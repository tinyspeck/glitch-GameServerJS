log.info("loading group.js");

var all_perms = {
	'can_invite'		: 1,
	'can_approve'		: 1,
	'can_promote'		: 1,
	'can_demote'		: 1,
	'can_ban'			: 1,
	'can_view_members'	: 1,
	'can_view_topics'	: 1,
	'can_post_topics'	: 1,
	'can_post_replies'	: 1,
};

var public_perms = {
	'can_view_members'	: 1,
	'can_view_topics'	: 1
};

//var chat_roster = {}; // This can't be set this way, or it is a class var, and shared between all instances of 'group' on this GS

////////////////////////////////////////////////////////////////////////////////////////////////

function doCreate(name, desc, mode, creator){

	//
	// basics
	//

	this.label = name;
	this.desc = desc;
	this.is_group = 1;
	this.mode = 'public';
	if (mode == 'private') this.mode = 'private';
	if (mode == 'public_apply') this.mode = 'public_apply';
	this.created = time();
	this.creator = creator.tsid;
	this.balance = 0;

	if (this.class_tsid == 'organization') this.organization_create();

	//
	// create levels
	//

	this.levels = {
		1: {
			'label_single': 'Administrator',
			'label_plural': 'Administrators',
		},
		2: {
			'label_single': 'Member',
			'label_plural': 'Members',
			'can_invite'		: 1,
			'can_view_topics'       : 1,
			'can_view_members'		: 1,
			'can_post_topics'       : 1,
			'can_post_replies'      : 1,
		}
	};

	if (this.mode == 'public' || this.mode == 'public_apply'){
		var i = '999';
		this.levels[i] = {
			'label_single': 'Non-Member',
			'label_plural': 'Non-Members'
		};

		for (var p in this.public_perms){
			this.levels[i][p] = 1;
		}
	}


	//
	// add creator to group
	//

	this.members = {};

	this.members[creator.tsid] =  {
		'level' : 1,
		'joined' : time(),
	};

	this.invites = {};
}

////////////////////////////////////////////////////////////////////////////////////////////////

function doDelete(deleter){

	//
	// remove members
	//

	for (var i in this.members){

		var pc = apiFindObject(i);

		if (pc){
			if (this.class_tsid == 'organization'){
				pc.organizations_left(this);
			}
			else{
				pc.groups_left(this.tsid);
			}
		}
	}
	this.members = {};


	//
	// remove invites
	//

	for (var i in this.invites){

		var pc = apiFindObject(i);

		if (pc) pc.groups_uninvited(this);
	}
	this.invites = {};


	//
	// remove applied
	//

	for (var i in this.applied){

		var pc = apiFindObject(i);

		if (pc) pc.groups_unapplied(this);
	}
	this.applied = {};


	//
	// delete group
	//

	this.deleted = 1;
	if (deleter) this.deleted_by = deleter;	
	if (!this.deleted_when) this.deleted_when = time();
}

////////////////////////////////////////////////////////////////////////////////////////////////

function join(pc){

	//
	// check they're not already in the group
	//

	if (this.members[pc.tsid] && this.members[pc.tsid].level) return { ok: 1 };
	if (this.getMaxMembers && this.getMaxMembers() >= this.count_members()) return { ok: 0, error: 'Too many members!' };


	//
	// Banned?
	//

	if (this.banned && this.banned[pc.tsid]) return { ok: 0, error: 'You have been banned from this group.' };


	//
	// find the level to join at - the bigger the better
	//

	var join_level = 1;

	for (var i in this.levels){
		if (i > join_level && i < 900) join_level = i;
	}


	//
	// add group->pc pointer
	//

	this.members[pc.tsid] =  {
		'level' : join_level,
		'joined' : time(),
	};


	//
	// remove any pending invite/application
	//

	if (!this.invites) this.invites = {};
	if (this.invites[pc.tsid]){
		delete this.invites[pc.tsid];
		pc.groups_uninvited(this);
	}

	if (!this.applied) this.applied = {};
	if (this.applied[pc.tsid]){
		delete this.applied[pc.tsid];
		pc.groups_unapplied(this);
	}

	return { ok: 1 };
}

////////////////////////////////////////////////////////////////////////////////////////////////

function get_info(player_tsid){

	if (!this.created){
		this.created = time();
		for (var i in this.members){
			var m = this.members[i];
			if (m.joined < this.created){
				this.created = m.joined;
			}
		}
	}


	//
	// basics
	//

	var out = {};

	out.name = this.label;
	out.desc = this.desc;
	out.mode = this.mode;
	out.created = this.created;


	//
	// deleted?
	//

	if (this.deleted){
		out.deleted = 1;
		out.deleted_by_name	= this.deleted_by.label;
		out.deleted_by_tsid	= this.deleted_by.tsid;
		out.deleted_when	= this.deleted_when;
		return out;
	}


	//
	// are we in this group?
	//

	out.in_group = 0;
	out.invited = 0;
	out.applied = 0;
	out.banned = 0;

	if (player_tsid){
		for (var i in this.members){
			if (i == player_tsid){
				out.in_group = 1;
				out.our_level = this.members[i].level;
				break;
			}
		}

		var pc = apiFindObject(player_tsid);
		out.num_groups = pc.groups_count();
		out.max_groups = config.max_groups;
		if (pc && pc.isGreeter()) out.max_groups++;

		if (!this.invites) this.invites = {};
		if (this.invites[player_tsid]){
			out.invited = 1;
			out.invite = this.invites[player_tsid];
		}

		if (!this.applied) this.applied = {};
		if (this.applied[player_tsid]){
			out.applied = 1;
			out.apply = this.applied[player_tsid];
		}

		if (this.banned && this.banned[player_tsid]){
			out.banned = 1;
			out.ban = this.banned[player_tsid];
		}
	}

	if (!out.in_group){
		out.our_level = 999;
	}


	//
	// group levels
	//

	out.levels = {};

	var pp = utils.copy_hash(this.public_perms);
	for (var i in this.levels){
		var l = this.levels[i];

		out.levels[i] = {
			'name_plural'	: l.label_plural,
			'name_single'	: l.label_single,
			'count'			: 0,
		};

		for (var p in this.all_perms){
			out.levels[i][p] = i==1 ? 1 : (l[p] ? 1 : 0);

			if (pp[p] && !out.levels[i][p]) pp[p] = 0;
		}
	}

	// Create the non-member level, if it doesn't exist
	if (!this.levels['999'] && (this.mode == 'public' || this.mode == 'public_apply')){
		var i = '999';
		var l = this.levels[i];

		l = {
			'label_single': 'Non-Member',
			'label_plural': 'Non-Members'
		};

		for (var p in pp){
			l[p] = pp[p];
		}

		out.levels[i] = {
			'name_plural'	: l.label_plural,
			'name_single'	: l.label_single,
			'count'			: 0,
		};

		for (var p in this.public_perms){
			out.levels[i][p] = l[p] ? 1 : 0;
		}
	}

	out.members = 0;

	for (var i in this.members){
		var m = this.members[i];
		// Fix members at reserved levels
		if (m.level >= 900){
			var join_level = 1;
			for (var j in this.levels){
				if (j > join_level && j < 900) join_level = j;
			}

			m.level = join_level;
		}

		if (out.levels[m.level]) out.levels[m.level].count++;
		out.members++;
	}
	//out.members = group.members;
	//out.levels = group.levels;

	return out;
}

function get_members(){

	var out = {};

	var tsids = [];
	for (var i in this.members){
		tsids.push(i);
	}

	var member_hashes = apiCallMethod('make_hash', tsids);

	out.members = [];

	for (var i in this.members){
		var m = this.members[i];

		if (member_hashes[i]){
			var name = member_hashes[i].label;
		}
		else{
			var name = apiFindObject(i).label;
		}

		out.members.push({
			'tsid'  : i,
			'name'  : name,
			'level' : m.level,
			'joined': m.joined,
		});
	}

	out.invites = [];

	if (!this.invites) this.invites = {};
	for (var i in this.invites){
		var it = this.invites[i];
		out.invites.push({
			'tsid'	: i,
			'name'	: apiFindObject(i).label,
			'invited' : it.when,
			'inviter' : it.who,
		});
	}

	out.applied = [];

	if (!this.applied) this.applied = {};
	for (var i in this.applied){
		out.applied.push({
			'tsid'	: i,
			'name'	: apiFindObject(i).label,
			'applied' : this.applied[i].applied,
		});
	}

	return out;
}

function get_members_quick(){

	// like get_members() but without names

	var out = {};

	out.members = [];

	for (var i in this.members){
		var m = this.members[i];

		out.members.push({
			'tsid'  : i,
			'level' : m.level,
			'joined': m.joined,
		});
	}

	out.invites = [];

	if (!this.invites) this.invites = {};
	for (var i in this.invites){
		var it = this.invites[i];
		out.invites.push({
			'tsid'	: i,
			'invited' : it.when,
			'inviter' : it.who,
		});
	}

	out.applied = [];

	if (!this.applied) this.applied = {};
	for (var i in this.applied){
		out.applied.push({
			'tsid'	: i,
			'applied' : this.applied[i].applied,
		});
	}

	return out;
}

function is_member(pc){
	return this.members[pc.tsid] ? true : false;
}

function count_members(){
	return num_keys(this.members);
}

function get_basic_info(){

	return {
		tsid: this.tsid,
		name: this.label,
		desc: this.desc,
		mode: this.mode,
		members: num_keys(this.members),
		owns_property: this.hasPol()
	};
}

function get_very_basic_info(){

	// used for login_start & groups_join
	return {
		name: this.label,
		owns_property: this.hasPol()
	};
}

function admin_edit(args){

	this.label = args.name;
	this.desc = args.desc;

	return 1;
}

function admin_edit_role(args){

	//
	// check we have role
	//

	if (!this.levels[args.idx]){
		return {
			ok: 0,
			error: 'role_not_found',
		};
	}


	//
	// set names
	//

	this.levels[args.idx].label_single = str(args.name);
	this.levels[args.idx].label_plural = str(args.name) + 's';


	//
	// set perms
	//

	if (args.idx > 1){
		var base_perms = args.idx == 999 ? this.public_perms : this.all_perms;
		var off_perms = this.get_off_perms(args.idx-1);

		for (var i in base_perms){
			if (!off_perms[i] && args.perms[i]){

				this.levels[args.idx][i] = 1;
			}else{
				delete this.levels[args.idx][i];
			}
		}

		this.cascade_perms(intval(args.idx));
	}


	return {
		ok: 1,
	};
}

function cascade_perms(from_level){
	var off_perms = this.get_off_perms(from_level);

	for (var i in this.levels){
		if (intval(i) > from_level){
			for (var p in off_perms){
				delete this.levels[i][p];
			}
		}
	}
}

function get_off_perms(idx){

	if (idx == 1) return {};

	if (idx >= 900){
		var base = this.get_off_perms(num_keys(this.levels) - 1);
	}
	else{
		var base = this.get_off_perms(idx-1);
	}

	// what perms is this level missing?
	if (this.levels[idx]){

		for (var i in this.all_perms){
			if (!this.levels[idx][i]){
				base[i] = 1;
			}
		}
	}

	return base;
}

function admin_add_role(args){

	//
	// check that we have a place to insert after
	//

	if (!this.levels[args.after]){
		return {
			ok: 0,
			error: 'insert_after_not_found',
		};
	}

	if (args.after >= 100){
		return {
			ok: 0,
			error: 'too_many_levels',
		};
	}


	//
	// create a map for moving subsequent levels downwards
	//

	var move_map = {};
	for (var i in this.levels){
		if (intval(i) > args.after && intval(i) < 900){
			move_map[i] = intval(i)+1;
		}
	}


	//
	// construct the new levels map
	//

	var new_levels = {};
	for (var i in this.levels){
		if (i <= args.after || i>=900){
			new_levels[i] = this.levels[i];
		}else{
			new_levels[intval(i)+1] = this.levels[i];
		}
		if (i == args.after){
			new_levels[intval(i)+1] = {};
		}
	}
	this.levels = new_levels;


	//
	// update members as needed
	//

	for (var i in this.members){
		if (move_map[this.members[i].level]){
			this.members[i].level = move_map[this.members[i].level];
		}
	}


	//
	// insert the new level details
	//

	var new_idx = intval(args.after)+1;

	this.levels[new_idx].label_single = str(args.name);
	this.levels[new_idx].label_plural = str(args.name) + 's';

	var off_perms = this.get_off_perms(new_idx-1);

	for (var i in this.all_perms){
		if (!off_perms[i] && args.perms[i]){

			this.levels[new_idx][i] = 1;
		}else{
			delete this.levels[new_idx][i];
		}
	}


	//
	// cascade perms choices...
	//

	this.cascade_perms(new_idx);


	return {
		ok: 1,
	};
}

function admin_delete_role(args){

	//
	// check we can delete this role
	//

	if (args.role == 1){
		return {
			ok : 0,
			error: 'cant_delete_admin_role',
		};
	}

	if (args.role == 999){
		return {
			ok : 0,
			error: 'cant_delete_public_role',
		};
	}

	if (num_keys(this.levels) <= 2){
		return {
			ok : 0,
			error : 'must_leave_two_roles',
		};
	}

	if (!this.levels[args.role]){
		return {
			ok : 0,
			error : 'role_not_found',
		};
	}


	//
	// where do we move members to?
	//

	var move_to_prev = 0;
	var move_to_next = 0;
	var found = 0;

	for (var i in this.levels){
		if (i == args.role){
			found = 1;
		}
		if (found){
			if (!move_to_next) move_to_next = intval(i);
		}else{
			move_to_prev = intval(i);
		}
	}

	var move_to = move_to_next ? move_to_next : move_to_prev;


	//
	// move members
	//

	for (var i in this.members){
		if (this.members[i].level == args.role){

			this.members[i].level = move_to;
		}
	}


	//
	// remove the level and move other levels up
	//

	delete this.levels[args.role];

	var new_levels = {};

	for (var i in this.levels){
		if (intval(i) > args.role && i != 999){
			new_levels[intval(i)-1] = this.levels[i];
		}else{
			new_levels[i] = this.levels[i];
		}
	}

	this.levels = new_levels;


	return {
		ok : 1,
	};
}

function admin_get_member(args){

	var out = {
		is_admin: 0,
		is_member: 0,
		level: 0,
	};

	if (this.members[args.player_tsid]){

		out.is_member = 1;
		out.level = this.members[args.player_tsid].level;

		if (this.members[args.player_tsid].level == 1){

			out.is_admin = 1;
		}
	}

	return out;
}

function admin_set_member_role(args){

	// we don't check permissions here - we'll assume
	// the caller did that.

	var role = args.role;

	if (!this.members[args.player_tsid]){
		return {
			ok : 0,
			error: 'not_a_member',
		};
	}

	if (!this.levels[role]){
		return {
			ok : 0,
			error: 'not_a_role',
		};
	}

	this.members[args.player_tsid].level = role;

	return {
		ok: 1,
	};
}

////////////////////////////////////////////////////////////////////////////////////////////////

function get_promote_candidate(){

	//
	// are there multiple level 1 users?
	// if so, we don't need to promote
	//

	var num = 0;
	for (var i in this.members){
		if (this.members[i].level == 1){
			num++;
		}
		if (num > 1) return null;
	}


	//
	// get the highest level other than 1
	//

	var next_best_level = 999;

	for (var i in this.members){
		var lvl = this.members[i].level;
		if (lvl > 1 && lvl < next_best_level){
			next_best_level = lvl;
		}
	}

	if (next_best_level == 999){
		return null;
	}


	//
	// there is somebody on a level below us!
	//

	var promote_tsid = null;
	var earliest_join = time();

	for (var i in this.members){

		var m = this.members[i];

		if (m.level == next_best_level){

			if (m.joined < earliest_join){

				earliest_join = m.joined;
				promote_tsid = i;
			}
		}
	}

	return promote_tsid;
}

////////////////////////////////////////////////////////////////////////////////////////////////

function leave(pc, promote_tsid){

	//
	// check they're in the group
	//

	if (!this.members[pc.tsid]) return 1;
	if (!this.members[pc.tsid].level) return 1;

	var level = this.members[pc.tsid].level;


	//
	// for admins, we need to look at promotion
	//

	if (level == 1){

		// the admin is leaving - anyone we can promote?

		var best_promote = this.get_promote_candidate();

		if (best_promote){

			// did we specify someone who is in the group?
			if (promote_tsid && this.members[promote_tsid].level){
				if (this.members[promote_tsid].level > 1){

					best_promote = promote_tsid;
				}
			}

			// promote someone
			this.members[best_promote].level = 1;
		}
	}


	delete this.members[pc.tsid];

	pc.groups_left(this.tsid);

	//
	// last member leaving?
	//

	if (!num_keys(this.members)){

		this.doDelete(pc);
	}

	return 1;
}

////////////////////////////////////////////////////////////////////////////////////////////////

function admin_move_role(args){

	var role_id = args.role;
	var move_up = args.up;


	//
	// get the two role IDs to swap
	//

	var pre_id = null;
	var post_id = null;
	var found = false;

	for (var i in this.levels){
		if (found && !post_id) post_id = i;
		if (i == role_id) found = true;
		if (!found) pre_id = i;
	}


	if (!found) return api_error('role_not_found');
	if (role_id == 1) return api_error('cant_move_admin');
	if (move_up && pre_id == 1) return api_error('cant_move_up');
	if (!move_up && !post_id) return api_error('cant_move_down');


	//
	// swap em
	//

	var hi_role = move_up ? pre_id : role_id;
	var lo_role = move_up ? role_id : post_id;


	var temp = this.levels[hi_role];
	this.levels[hi_role] = this.levels[lo_role];
	this.levels[lo_role] = temp;

	this.cascade_perms(hi_role);


	//
	// move players
	//

	for (var i in this.members){
		if (this.members[i].level == lo_role){
			this.members[i].level = hi_role;
		}else{
			if (this.members[i].level == hi_role){
				this.members[i].level = lo_role;
			}
		}
	}


	//
	// all done
	//

	return api_ok();
}

////////////////////////////////////////////////////////////////////////////////////////////////

function chat_join(pc){

	var msg = this.chat_get_roster_msg();

	if (!in_array_real(this.tsid, config.live_help_groups) && !in_array_real(this.tsid, config.newbie_live_help_groups) && !in_array_real(this.tsid, config.global_chat_groups) && !in_array_real(this.tsid, config.qa_groups) && !in_array_real(this.tsid, config.trade_chat_groups)){
		pc.apiSendMsg({
			type: 'pc_groups_chat',
			tsid: this.tsid,
			pc: { tsid: "god", label: "God" },
			txt: msg,
		});

		// let everyone know
		this.chat_send_msg({
			type: 'pc_groups_chat',
			tsid: this.tsid,
			pc: { tsid: "god", label: "God" },
			txt: utils.escape(pc.label)+" has joined",
		});
	}

	this.chat_roster[pc.tsid] = pc;
}

function chat_leave(pc){
	if (!pc) return;

	// were they in the chat?
	if (!this.chat_roster) this.chat_roster = {};
	if (!this.chat_roster[pc.tsid]) return;

	// remove them
	delete this.chat_roster[pc.tsid];
	log.info(this+' chat_leave: '+pc);

	if (!in_array_real(this.tsid, config.live_help_groups) && !in_array_real(this.tsid, config.newbie_live_help_groups) && !in_array_real(this.tsid, config.global_chat_groups) && !in_array_real(this.tsid, config.qa_groups) && !in_array_real(this.tsid, config.trade_chat_groups)){
		// let everyone know
		this.chat_send_msg({
			type: 'pc_groups_chat',
			tsid: this.tsid,
			pc: { tsid: "god", label: "God" },
			txt: utils.escape(pc.label)+" has left",
		});
	}
}

function chat_send(pc, txt){

	// are they in the chat?
	if (!this.chat_roster) this.chat_roster = {};
	if (!this.chat_roster[pc.tsid]) {
		pc.sendActivity("You're not in that group");
		return
	}

	this.chat_send_msg({
		type: 'pc_groups_chat',
		tsid: this.tsid,
		pc: pc.make_hash(),
		txt: utils.filter_chat(txt),
	});
}

function chat_logout(pc){
	log.info(this+' chat_logout: '+pc);

	this.chat_leave(pc);
}

function chat_send_msg(msg){

	var leave = [];
	var sendTo= [];

	if (!this.chat_roster) this.chat_roster = {};
	for (var i in this.chat_roster){
		var r = this.chat_roster[i];

		if (apiIsPlayerOnline(i)){
			sendTo.push(r)			
		}
		else{
			leave.push(r);
		}		
	}

	apiSendToGroup(msg, sendTo);
	
	if (leave.length){
		for (var i=0; i<leave.length; i++){
			var l = leave[i];
			log.info(this+' chat_send_msg leave: '+l);
			this.chat_logout(l);
		}
	}
}

function chat_get_roster_msg(){
	if (!this.chat_roster) this.chat_roster = {};

	var names = [];
	for (var i in this.chat_roster){
		var pc = this.chat_roster[i];
		if (pc !== null && pc !== undefined) names.push(utils.escape(pc.label));
	}
	
	var msg = "You are the only person here.";
	if (names.length == 1){
		msg = names[0]+" is here";
	}
	if (names.length > 1){
		msg = pretty_list(names, ' and ')+" are here";
	}

	return msg;
}

function chat_get_roster(){
	if (!this.chat_roster) this.chat_roster = {};

	var players = [];
	for (var i in this.chat_roster){
		players.push(this.chat_roster[i]);
	}

	return players;
}

function chat_is_in_roster(tsid){
	if (!this.chat_roster) return false;

	for (var i in this.chat_roster){
		if (i == tsid) return true;
	}

	return false;
}

////////////////////////////////////////////////////////////////////////////////////////////////

function admin_get_invite_members(args){

	if (!this.invites) this.invites = {};

	var pc = apiFindObject(args.caller);

	if (!pc){
		return {
			ok: 0,
			error: 'caller_not_found',
		};
	}

	var buddies = pc.buddies_get_tsids();
	var out = {};

	for (var i=0; i<buddies.length; i++){
		var tsid = buddies[i];
		out[tsid] = {
			in_group : this.members[tsid] ? true : false,
			invited : this.invites[tsid] ? true : false,
			banned : (this.banned && this.banned[tsid]) ? true : false,
			name : apiFindObject(tsid).label,
		};
	}

	return {
		ok : 1,
		players: out,
	};
}

function admin_invite(args){

	var out = {
		ok : 1,
		sent : 0,
		failed : 0,
		errors : {},
	};

	for (var i in args.invitees){
		var ret = this.invite(args.invitees[i], args.inviter, args.msg);

		if (ret.ok){
			out.sent++;
		}else{
			out.failed++;
			out.errors[args.invitees[i]] = ret.error;
		}
	}

	return out;
}

function invite(invitee_tsid, inviter_tsid, msg){

	if (!this.invites) this.invites = {};

	var invitee = apiFindObject(invitee_tsid);
	var inviter = apiFindObject(inviter_tsid);

	if (!invitee) return { ok: 0, error: 'bad_invitee' };
	if (!inviter) return { ok: 0, error: 'bad_inviter' };

	if ( this.members[invitee.tsid]) return { ok: 0, error: 'already_member' };
	if ( this.banned && this.banned[invitee.tsid]) return { ok: 0, error: 'invitee_is_banned' };
	if ( this.invites[invitee.tsid]) return { ok: 0, error: 'already_invited' };
	if (!this.members[inviter.tsid]) return { ok: 0, error: 'not_in_group' };

	this.invites[invitee_tsid] = {
		when: time(),
		who: inviter_tsid,
		msg: msg,
	};

	invitee.groups_invited(this);

	utils.http_get('callbacks/groups_invite.php', {
		group_tsid: this.tsid,
		invitee_tsid: invitee_tsid,
		inviter_tsid: inviter_tsid,
		msg: msg,
	});

	return { ok: 1 };
}


function admin_accept_invite(args){

	if (!this.invites) this.invites = {};

	var pc = apiFindObject(args.player_tsid);
	if (!pc){
		return {
			ok: 0,
			error: 'player_not_found',
		};
	}

	if (!this.invites[pc.tsid]){

		return {
			ok: 0,
			error: 'not_invited',
		};
	}

	// group.join() will delete the invite

	return pc.groups_join(this.tsid);
}

function admin_decline_invite(args){

	if (!this.invites) this.invites = {};

	var pc = apiFindObject(args.player_tsid);
	if (!pc){
		return {
			ok: 0,
			error: 'player_not_found',
		};
	}

	if (!this.invites[pc.tsid]){

		return {
			ok: 0,
			error: 'not_invited',
		};
	}

	delete this.invites[pc.tsid];
	pc.groups_uninvited(this);

	utils.http_get('callbacks/groups_declined.php', {
		group_tsid: this.tsid,
		pc_tsid: pc.tsid,
	});	

	return { ok: 1 };
}


function get_invite(pc_tsid){

	if (this.invites){
		return this.invites[pc_tsid];
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////

function get_member_status(pc_tsid){

	if (this.members[pc_tsid]){
		if (!this.levels[this.members[pc_tsid].level]) this.fix_member_role(pc_tsid);
		return {
			name	: this.label,
			role	: 'member',
			level	: this.members[pc_tsid].level,
			label	: this.levels[this.members[pc_tsid].level].label_single,
			when	: this.members[pc_tsid].joined,
		};
	}

	if (this.invites){
		if (this.invites[pc_tsid]){

			return {
				name	: this.label,
				role	: 'invite',
				when	: this.invites[pc_tsid].when,
				who	: this.invites[pc_tsid].who,
			};
		}
	}

	if (this.applied){
		if (this.applied[pc_tsid]){

			return {
				name	: this.label,
				role	: 'applied',
				when	: this.applied[pc_tsid].applied
			};
		}
	}

	return {
		name	: this.label,
		role	: 'none',
	};
}

////////////////////////////////////////////////////////////////////////////////////////////////

function admin_kick(args){

	// we don't check permissions here - we'll assume
	// the caller did that.

	if (!this.members[args.player_tsid]){
		return {
			ok : 0,
			error: 'not_a_member',
		};
	}

	var pc = getPlayer(args.player_tsid);
	if (!pc){
		return {
			ok : 0,
			error: 'not_a_player',
		};
	}

	// they simply leave the group
	this.leave(pc);

	// Record this in history
	if (!this.kick_history) this.kick_history = [];
	this.kick_history.push({
		player: args.player_tsid,
		when: time(),
		by: args.kicker,
		reason: (args.reason ? args.reason : '')
	});

	return {
		ok: 1,
	};
	
}

function admin_ban(args){

	// we don't check permissions here - we'll assume
	// the caller did that.

	if (!this.members[args.player_tsid]){
		return {
			ok : 0,
			error: 'not_a_member',
		};
	}

	if (this.banned && this.banned[args.player_tsid]){
		return {
			ok : 0,
			error: 'already_banned',
		};
	}

	var pc = getPlayer(args.player_tsid);
	if (!pc){
		return {
			ok : 0,
			error: 'not_a_player',
		};
	}

	// leave the group
	this.leave(pc);

	// Record for posterity
	if (!this.banned) this.banned = {};
	this.banned[args.player_tsid] = {
		when: time(),
		by: args.banner,
		reason: (args.reason ? args.reason : '')
	};

	return {
		ok: 1,
	};
	
}

function admin_unban(args){

	// we don't check permissions here - we'll assume
	// the caller did that.

	if (!this.banned || !this.banned[args.player_tsid]){
		return {
			ok : 0,
			error: 'not_banned',
		};
	}

	var pc = getPlayer(args.player_tsid);
	if (!pc){
		return {
			ok : 0,
			error: 'not_a_player',
		};
	}


	// Remove the record
	delete this.banned[args.player_tsid];

	return {
		ok: 1,
	};
	
}

function admin_get_banned_users(args){
	return this.banned ? this.banned : {};
}

////////////////////////////////////////////////////////////////////////////////////////////////

function get_apply(pc_tsid){

	if (this.applied){
		return this.applied[pc_tsid];
	}
}

function apply(pc){

	//
	// check they're not already in the group
	//

	if (this.members[pc.tsid] && this.members[pc.tsid].level) return { ok: 1 };
	if (this.getMaxMembers && this.getMaxMembers() >= this.count_members()) return { ok: 0, error: 'Too many members!' };


	//
	// Invited?
	//

	var invite = this.get_invite(pc.tsid);
	if (invite) return this.join(pc);


	//
	// Banned?
	//

	if (this.banned && this.banned[pc.tsid]) return { ok: 0, error: 'You have been banned from this group.' };


	//
	// add group->pc pointer
	//

	if (!this.applied) this.applied = {};
	this.applied[pc.tsid] =  {
		'applied' : time(),
	};


	//
	// add pc->group pointer
	//

	pc.groups_applied(this);

	return { ok: 1 };
}

function admin_approve(args){

	// we don't check permissions here - we'll assume
	// the caller did that.

	if (this.members[args.player_tsid]){
		return {
			ok : 0,
			error: 'not_a_member',
		};
	}

	if (!this.applied || !this.applied[args.player_tsid]){
		return {
			ok : 0,
			error: 'not_applied',
		};
	}

	var pc = getPlayer(args.player_tsid);
	if (!pc){
		return {
			ok : 0,
			error: 'not_a_player',
		};
	}

	// they simply join the group
	pc.groups_join(this.tsid);

	return {
		ok: 1,
		remaining: num_keys(this.applied)
	};
	
}

function admin_decline(args){

	// we don't check permissions here - we'll assume
	// the caller did that.

	if (this.members[args.player_tsid]){
		return {
			ok : 0,
			error: 'not_a_member',
		};
	}

	if (!this.applied || !this.applied[args.player_tsid]){
		return {
			ok : 0,
			error: 'not_applied',
		};
	}

	var pc = getPlayer(args.player_tsid);
	if (!pc){
		return {
			ok : 0,
			error: 'not_a_player',
		};
	}

	// Just remove the application records
	delete this.applied[args.player_tsid];
	pc.groups_unapplied(this.tsid);

	return {
		ok: 1,
		remaining: num_keys(this.applied)
	};
	
}

function is_admin(pc){
	var status = this.get_member_status(pc.tsid);
	return status.level == 1 ? true : false;
}

////////////////////////////////////////////////////////////////////////////////////////////////

function addPol(pol){
	if (!this.pols) this.pols = [];
	this.pols.push(pol.tsid);
}

function getPols(){
	return this.pols;
}

function hasPol(){
	return this.pols && this.pols.length ? true : false;
}


////////////////////////////////////////////////////////////////////////////////////////////////

function fix_member_role(pc_tsid){
	var m = this.members[pc_tsid];
	if (m && !this.levels[m.level]){
		var best = 1;
		for (var i in this.levels){
			if (i > best && i < m.level && i < 900) best = i;
		}

		this.members[pc_tsid].level = best;
	}
}

function check_member_pointers(){
	if (!this.deleted){
		for (var i in this.members){
			var pc = getPlayer(i);
			if (!pc){
				log.info(this+" check_member_pointers deleting "+i);
				delete this.members[i];
			}

			if (pc.groups_get_status(this.tsid) != 'member'){
				log.info(this+" check_member_pointers adding "+i);
				pc.groups_join(this.tsid);
			}
		}

		for (var i in this.invites){
			var pc = getPlayer(i);
			if (!pc){
				log.info(this+" check_member_pointers deleting invite "+i);
				delete this.invites[i];
			}

			if (pc.groups_get_status(this.tsid) == 'none'){
				log.info(this+" check_member_pointers adding invite "+i);
				pc.groups_invited(this);
			}
		}

		for (var i in this.applied){
			var pc = getPlayer(i);
			if (!pc){
				log.info(this+" check_member_pointers deleting applied "+i);
				delete this.applied[i];
			}

			if (pc.groups_get_status(this.tsid) == 'none'){
				log.info(this+" check_member_pointers adding applied "+i);
				pc.groups_applied(this);
			}
		}
	}
	else{
		this.doDelete();
	}

	return 1;
}

function adminCheckMemberPointers(args){
	return this.check_member_pointers();
}