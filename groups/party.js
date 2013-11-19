//#include ../items/include/events.js

function init(leader){

	if (!this.members) this.members = {};
	if (!this.invites) this.invites = {};

	this.members[leader.tsid] = {
		'who'		: leader,
		'leader'	: true,
		'joined'	: time()
	};
}


//
// invite someone to join this party
//

function send_invite(from_pc, to_pc, silent){

	//
	// do they already have an invite?
	//

	if (this.invites[to_pc.tsid]){

		return 'invited';
	}


	//
	// are they online?
	//

	if (!apiIsPlayerOnline(to_pc.tsid)){

		return 'offline';
	}


	//
	// are they in another party?
	//

	if (to_pc.party_is_in()){

		return 'other_party';
	}


	//
	// are we currently full?
	//

	if (this.is_full()){

		return 'full';
	}


	//
	// they in newxp?
	//

	if (!to_pc.getProp('has_done_intro')){
		return 'newxp';
	}

	// Check whether this player was kicked out of the party already. If so, don't let them back in unless
	// the party creator invites them back.
	if (this.space){
		if ( this.space.getProp('creator') != from_pc.tsid ){
			for (var i in this.kicked_players){
				if (to_pc.tsid == this.kicked_players[i]){
					return 'kicked';
				}
			}
		}
		else {
			for (var i in this.kicked_players){
				if (to_pc.tsid == this.kicked_players[i]){
					delete this.kicked_players[i];
				}
			}
		}
	}
	

	//
	// store the invitation, along with metadata
	//

	this.invites[to_pc.tsid] = {
		'from'		: from_pc,
		'to'		: to_pc,
		'sent'		: time(),
		'expires'	: time() + config.party_invite_timeout
	};

	this.events_add({
		callback	: 'party_expire_invite',
		to_tsid		: to_pc.tsid
	}, config.party_invite_timeout + 1);


	//
	// send it to the invitee!
	//

	if (!silent) to_pc.party_invited(this, from_pc);

	return 'ok';
}

function is_full(){

	if (this.members){
		if (num_keys(this.members) >= config.max_party_size){

			return true;
		}
	}

	return false;
}

// This player was kicked out of the party
function kicked(tsid) { 
	//log.info("Kicked player out of party "+tsid);
	
	if (!this.kicked_players) { this.kicked_players = []; }
	
	this.kicked_players.push(tsid);	
}

function leave(pc, reason){

	//log.info("PS leaving party space "+pc);

	var details = this.members[pc.tsid];

	this.remove(pc, reason);


	//
	// if the last or second last person left, close the group
	//

	if (num_keys(this.members) < 2){
		//log.info("PS disbanding");
		this.close('disband');
		return;
	}


	//
	// else promote a new leader?
	//

	if (details.leader){

		this.promote_leader();
	}


	//
	// tell everyone that this person left
	//

	for (var i in this.members){
		if (!this.members[i] || !this.members[i].who) continue;
		this.members[i].who.party_member_left(pc, reason);
	}


	//
	// Leave party space
	//

	if (this.space){
		//log.info("PS exiting instance "+pc);
		pc.instances_exit('party_space');
	}
	else { 
		log.info("PS can't exit deleted instance"+pc);
	}
}

function remove(pc, reason){

	delete this.members[pc.tsid];

	pc.party_left(reason);
}

function promote_leader(){

	for (var i in this.members){

		this.members[i].leader = true;
		this.members[i].who.party_now_leader();
		return;
	}
}

function accept_invite(pc, inviter, auto_space){

	//
	// check the player was invited
	//

	if (!this.invites[pc.tsid]){

		pc.sendActivity('Your invitation to join this party has expired - sorry!');
		return;
	}


	//
	// check we're not full
	//

	if (this.is_full()){

		pc.sendActivity('The party is full - sorry!');
		delete this.invites[pc.tsid];
		return;
	}


	//
	// leave a previous party?
	//

	if (pc.party_is_in()){

		// any invites pc sent in their previous group
		// get moved over to their new group

		var invites = pc.party_get_invites_sent();

		pc.party_leave();

		for (var i in invites){

			this.invites[i] = invites[i];
		}
	}


	//
	// add player as member
	//

	var details = this.invites[pc.tsid];

	delete this.invites[pc.tsid];

	this.members[pc.tsid] = {
		'who'		: pc,
		'leader'	: false,
		'joined'	: time(),
		'invited'	: details.sent,
		'inviter'	: details.from
	};

	pc.party_joined(this);


	//
	// if there was only 1 member before this one joined, tell
	// the original member they are now in a group
	//

	if (num_keys(this.members) == 2){

		//log.info('********************** this is the second member!');

		for (var i in this.members){

			if (i != pc.tsid){

				this.members[i].who.party_joined(this, 'invite_accepted', pc);
			}
		}
	}else{
		//log.info('********************** NOT second member');

		//
		// let existing members know about the new member
		//

		for (var i in this.members){
			if (!this.members[i] || this.members[i].who) continue;

			if (i != pc.tsid){

				var was_inviter = details.from.tsid == i ? 1 : 0;
				this.members[i].who.party_member_joined(pc, was_inviter);
			}
		}
	}

	if (this.space){
		if (pc.is_dead) {
			pc.sendActivity("Someone invited you to a party, but you have more pressing matters to attend to: you are dead!");
		} else {
			pc.apiSendMsg({type: 'party_space_change', space_tsids: null});

			if (auto_space){
				this.enter_space(pc);
			}
			else{
				pc.party_space_prompt();
			}
		}
	}

}

function decline_invite(pc, inviter, expired){

	var details = this.invites[pc.tsid];
	delete this.invites[pc.tsid];


	//
	// tell inviter that invitation was declined?
	//

	if (details){

		details.from.party_declined(details.to, expired);
	}


	//
	// is the inviter the only one left in the group, with no other outstanding invites?
	//

	if (num_keys(this.invites) === 0 && num_keys(this.members) == 1){

		this.close('invites-done');
	}
}

function close(reason){

	//log.info('PS party.close', reason, this);

	//
	// cancel any outstanding invites
	//

	for (var i in this.invites){

		this.invites[i].to.party_uninvited(this, this.invites[i].from, reason);
		delete this.invites[i];
	}


	//
	// remove any remaining members
	//

	for (var i in this.members){
		if (!this.members[i] || !this.members[i].who) continue;

		this.remove(this.members[i].who, reason);
	}


	//
	// Remove the space
	//

	if (this.space) this.delete_space();

	//
	// finally, destroy
	//

	this.apiDelete();
}

function player_logout(pc){

	//
	// tell all other online players that they've gone offline
	//

	var onlines = 0;

	for (var i in this.members){
		if (!this.members[i] || !this.members[i].who) continue;

		if (i != pc.tsid && apiIsPlayerOnline(i)){
			this.members[i].who.party_member_offline(pc);
			onlines++;
		}
	}


	//
	// if all members have gone offline, disband party
	//

	if (onlines === 0){

		this.close('offline');
	}
}

function player_login(pc){

	//
	// tell other players that they're back
	//

	for (var i in this.members){
		if (!this.members[i] || !this.members[i].who) continue;

		if (i != pc.tsid && apiIsPlayerOnline(i)){

			this.members[i].who.party_member_online(pc);
		}
	}

	if (this.space){
		pc.apiSendMsg({type: 'party_space_change', space_tsids: this.space.get_locations()});
	}

}

function get_members(){

	var out = {};

	for (var i in this.members){
		if (!this.members[i] || !this.members[i].who) continue;

		out[i] = this.members[i].who.make_hash_online();
	}

	return out;
}

function chat(pc, txt){

	apiSendToGroup({
		type	: 'pc_party_chat',
		pc	: pc.make_hash(),
		txt	: utils.filter_chat(txt)
	}, array_keys(this.members));
}

function announce(txt){

	apiSendToGroup({
		type	: 'party_activity',
		txt	: utils.filter_chat(txt)
	}, array_keys(this.members));
}

function remove_invites_from(pc_tsid){

	var out = {};

	for (var i in this.invites){

		if (this.invites[i].from.tsid == pc_tsid){

			out[i] = this.invites[i];
			delete this.invites[i];
		}
	}

	return out;
}

function getTsid(){
	return this.tsid;
}

function dump(){

	log.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PARTY '+this.tsid);
	log.dir(this.members);
	log.dir(this.invites);
	log.info('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> PARTY '+this.tsid);

}

function party_expire_invite(details){

	var inv = this.invites[details.to_tsid];

	if (inv && inv.expires <= time()){

		this.decline_invite(inv.to, inv.from, 1);
	}
}

function get_space(){
	return this.space;
}

function get_space_details(){
	if (!this.space) return {};
	//log.info("PS Getting space details: "+this.space);

	var loc = apiFindObject(this.space.get_entrance());
	var label = '';
	var players = [];
	if (loc){
		label = loc.getProp('label');
		players = loc.getActivePlayers();
	}

	var template = this.space.getProp('party_template');

	log.info("Template is "+template);
	
	var desc = "A challenging mountain environment";
	var img_url = "";
	
	if (config.party_spaces[template]) {
		desc = config.party_spaces[template].desc;
		img_url = config.party_spaces[template].img;
	}
	
	return {
		label: label,
		template: template,
		desc: desc,
		img_url: img_url,
		players: players
	};
}

function create_space(template, duration, creator){
	log.info(this+' creating party space of type '+template+' and duration '+duration);

	if (!template) template = choose_one(array_keys(config.party_spaces));

	var instance_options = {
		preserve_links: true,
		no_auto_destroy: true,
		party_template: template,
		expiration: time()+duration,
		is_taster: (duration == (10*60) ? true : false),
		creator: creator.tsid
	};

	var location_options = {
		is_party_space: true
	};

	this.space = creator.instances_create('party_space', config.party_spaces[template].tsid, instance_options, location_options);

	if (this.space){

		this.announce(utils.escape(creator.label)+' made us a new Party Space!');

		var loc = apiFindObject(this.space.get_entrance());
		if (loc) loc.geo_signpost_set_instance_exit('signpost_1');


		//
		// Create teleporters next to all members
		//

		var member_count = 0;
		for (var i in this.members){
		if (!this.members[i] || !this.members[i].who) continue;
			var who = this.members[i].who;
			
			member_count++;
			if (who == creator){
				who.party_create_teleporter();
			}
			else if (who.is_dead){
				who.sendActivity("Someone invited you to a party, but you have more pressing matters to attend to: you are dead!");
			}
			else {
				who.party_space_prompt();
			}
		}

		this.apiSetTimer('space_warning', (duration-(60*5)) * 1000);
		this.apiSetTimer('delete_space', duration * 1000);


		if (member_count >= 11){
			if (creator.feats_increment('tottlys_toys', 7)){
				if (!this.feats_tracker) this.feats_tracker = {};
				this.feats_tracker[creator.tsid] = time();
			}
		}

		//
		// Everyone gets notified that the space exists
		//

		apiSendToGroup({
			type	: 'party_space_change',
			space_tsids: this.space.get_locations()
		}, array_keys(this.members));
	}

	return this.space;
}

/****************** Mountaineering special *******************/
function create_mountain(expedition_id, duration, difficulty, creator){

	var prot = apiFindItemPrototype('catalog_expeditions');
	if (!prot){
		log.info('Invalid expedition_id to create_mountain. Could not create prototype');
		return false;
	}
	var expedition = utils.copy_hash(prot.expeditions[expedition_id]);
	if (!expedition){
		log.info('Invalid expedition to create_mountain. Could not create expedition');
		return false;
	}
	
	var template = expedition.template_tsid;

	if (!difficulty) difficulty = 1;
	var templateData = expedition.config ? expedition.config : null;
	log.info('templateData: '+templateData);
	var rewards = {
		'xp'			: expedition.reward_xp,
		'energy'		: expedition.reward_energy,
		'currants'		: expedition.reward_currants,
		'mood'			: expedition.reward_mood,
		'favor_giant'	: expedition.reward_favor_giant,
		'favor_points'	: expedition.reward_favor_points,
		'items'			: expedition.rewards
	}
	log.info('rewards: '+rewards);
	
	var instance_options = {
		preserve_links: true,
		no_auto_destroy: true,
		party_template: template,
		rungs: templateData ? templateData.rungs : null,
		rewards: rewards,
		//expiration: time()+duration,
		location_type: "mountains",
		creator: creator.tsid
	};

	var location_options = {
		is_party_space: true,
		difficulty: difficulty
	};
	
	this.space = creator.instances_create('party_space', expedition.template_tsid, instance_options, location_options);

	if (this.space){

		this.announce(utils.escape(creator.label)+' made us a new Party Space!');

		var loc = apiFindObject(this.space.get_entrance());
		if (loc) loc.geo_signpost_set_instance_exit('signpost_1');

		//
		// Create teleporters next to all members
		//

		for (var i in this.members){
			if (!this.members[i] || !this.members[i].who) continue;

			var who = this.members[i].who;
			
			if (who == creator){
				who.party_create_teleporter();
			}
			else if (who.is_dead){
				who.sendActivity("Someone invited you to join a mountaineering expedition, but you have more pressing matters to attend to: you are dead!");
			}
			else {
				log.info("Mountaineering invite for "+who);
				who.party_space_prompt();
			}
		}

		//this.apiSetTimer('space_warning', (duration-(60*5)) * 1000);
		//this.apiSetTimer('delete_space', duration * 1000);


		//
		// Everyone gets notified that the space exists
		//

		apiSendToGroup({
			type	: 'party_space_change',
			space_tsids: this.space.get_locations()
		}, array_keys(this.members));
	}

	return this.space;
}
/******************************************************/

function enter_space(pc){
	if (!this.space) return false;

	pc.instances_add('party_space', this.space);

	var loc = apiFindObject(this.space.get_entrance());
	var marker = choose_one(loc.find_items('marker_teleport'));
	if (!marker) marker = {x: 0, y: 0};

	if ((!this.feats_tracker || !this.feats_tracker[pc.tsid]) && num_keys(this.get_members()) >= 11){
		if (pc.feats_increment('tottlys_toys', 2)){
			if (!this.feats_tracker) this.feats_tracker = {};
			this.feats_tracker[pc.tsid] = time();
		}
	}

	return pc.instances_enter('party_space', marker.x, marker.y);
}

function space_warning(){
	if (this.space) this.announce('Our Party Space will expire in 5 minutes.');
}

function delete_space(){
	log.info(this+' party space dies***');
	if (this.space){
		this.announce('Our Party Space expired.');

		this.space.destroy(true);

		delete this.space;

		//
		// Everyone gets notified that the space was destroyed
		//

		apiSendToGroup({
			type	: 'party_space_change',
			space_tsids: null
		}, array_keys(this.members));
	}
	else{
		log.info(this+' party space lives!!!!');
	}
}

function extend_space_time(pc, duration){
	if (this.space){
		var expiration = intval(this.space.getProp('expiration'));
		duration = intval(duration);
		//log.info(this+' space expiration '+expiration);

		expiration += duration;
		//log.info(this+' space new expiration '+expiration);
		this.space.setProp('expiration', expiration);

		var new_duration = expiration-time();
		this.apiCancelTimer('space_warning');
		this.apiCancelTimer('delete_space');
		this.apiSetTimer('space_warning', (new_duration-(60*5)) * 1000);
		this.apiSetTimer('delete_space', new_duration * 1000);

		this.announce(utils.escape(pc.label)+' extended the party time!');
	}
}