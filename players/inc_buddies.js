
function buddies_init(){
	//
	// default buddy groups
	//

	if (this.friends === undefined || this.friends === null) this.friends = {};
	if (this.friends.group1 === undefined || this.friends.group1 === null){
		this.friends.group1 = apiNewOwnedDC(this);
		this.friends.group1.label = 'Buddies';
		this.friends.group1.pcs = {};
	}
	
	if (this.friends.cache === undefined || this.friends.cache === null || this.friends.cache.pcs === undefined || this.friends.cache.pcs === null){
		if (this.friends.cache !== undefined && this.friends.cache !== null) delete this.friends.cache;
		this.friends.cache = apiNewOwnedDC(this);
		this.friends.cache.label = 'Cache';
		this.friends.cache.pcs = {};
	}
	
	if (this.friends.reverse === undefined || this.friends.cache === null){
		this.friends.reverse = apiNewOwnedDC(this);
		this.friends.reverse.label = 'Reverse Contacts';
		this.friends.reverse.pcs = {};
	}
	
	if (this.friends.ignoring !== undefined && this.friends.cache !== null){
		this.friends.ignoring.apiDelete();
		delete this.friends.ignoring;
	}
	
	if (this.ignoring === undefined || this.ignoring === null){
		this.ignoring = apiNewOwnedDC(this);
		this.ignoring.label = 'Ignoring';
		this.ignoring.pcs = {};
	}
	
	if (this.friends.ignored_by !== undefined && this.friends.ignored_by !== null){
		this.friends.ignored_by.apiDelete();
		delete this.friends.ignored_by;
	}
	
	if (this.ignored_by === undefined || this.ignored_by === null){
		this.ignored_by = apiNewOwnedDC(this);
		this.ignored_by.label = 'Ignored By';
		this.ignored_by.pcs = {};
	}

	if (this.friends.reverse_cache !== undefined && this.friends.reverse_cache !== null){
		this.friends.reverse_cache.apiDelete();
		delete this.friends.reverse_cache;
	}

	if (this.reverse_buddy_cache === undefined || this.reverse_buddy_cache === null){
		this.reverse_buddy_cache = apiNewOwnedDC(this);
		this.reverse_buddy_cache.label = 'Reverse Buddy Cache';
		this.reverse_buddy_cache.contents = this.buddies_get_cache_data();
	}
}

function buddies_get_tsids(){

	var out = [];

	for (var i in this.friends){
		if (i != 'reverse' && i != 'cache'){
			for (var tsid in this.friends[i].pcs){

				out.push(tsid);
			}
		}
	}

	return out;
}

function buddies_is_buddy(pc){
	for (var i in this.friends){
		if (i != 'reverse' && i != 'cache'){
			for (var tsid in this.friends[i].pcs){
				if (tsid == pc.tsid) return true;
			}
		}
	}
	
	return false;
}

function buddies_is_reverse(pc){
	if (this.friends && this.friends.reverse){
		return this.friends.reverse.pcs[pc.tsid] ? true : false;
	}
	
	return false;
}

function buddies_count(){
	try{
		return this.friends.group1.pcs.__length;
	} catch(e) {
		return 0;
	}
}

function buddiesHasMax(){
	if (!config.buddy_limit) return false;

	return this.buddies_count() >= config.buddy_limit;
}

function buddies_reverse_count(){

	if (this.friends && this.friends.reverse && this.friends.reverse.pcs){
		return this.friends.reverse.pcs.__length;
	} else {
		return 0;
	}
}

function createBuddyGroup(name){
	return; // disabled for now

	// find a spare key
	var key = 1;
	while (this.friends['group'+key]){
		key++;
	}
	key = 'group'+key;

	// create group
	this.friends[key] = apiNewOwnedDC(this);
	this.friends[key].label = name;
	this.friends[key].pcs = {};

	return key;
}

function addToBuddyGroup(group_id, player_tsid, ignore_limit, skip_notify){

	if (player_tsid == this.tsid) return 'self';

	// first, get the player we're adding
	var pc_target = apiFindObject(player_tsid);

	if (!pc_target) return 'no player';
	if (!pc_target.is_player) return 'no player';


	// check relevant groups exist
	if (!this.friends[group_id]) return 'no group';

	// check player isn't already on a list
	for (var i in this.friends){
		if (i != 'reverse' && i != 'cache' && this.friends[i].pcs[player_tsid]) return 'in group '+i;
	}
	
	// check that we're not being ignored by that player
	if (this.buddies_is_ignored_by(pc_target)) return 'ignored';

	// deleted?
	if (this.isDeleted()) return 'deleted';

	if (group_id == 'group1' && this.buddiesHasMax() && !ignore_limit && !this.buddies_is_reverse(pc_target)){
		return 'max_buddies';
	}


	// add to outgoing group
	this.friends[group_id].pcs[player_tsid] = pc_target;
	this.buddies_add_to_cache(pc_target);

	// add reverse relationship
	pc_target.buddies_add_reverse(this);
	
	// perform web callback for additional processing
	utils.http_get('callbacks/buddy_add.php', {
		from		: this.tsid,
		to		: player_tsid,
		group		: group_id,
		skip_notify	: skip_notify,
	});
	this.buddies_changed();

	// the target may also want to do additional processing
	pc_target.buddies_has_added(this);

	// send message if we're online
	var ret = pc_target.make_hash_with_location();
	
	this.sendMsgOnline({
		type		: 'buddy_added',
		group_id	: group_id,
		pc		: ret,
	});
	
	this.achievements_set('player', 'buddies_count', this.buddies_count());

	if (this.buddies_count() == 1) this.checkNeighborSignpost();

	return 'ok';
}

function buddies_has_added(pc){

	//
	// called when someone has added you as a buddy
	//

	this.sendOnlineActivity(pc.linkifyLabel()+" just added you as a contact!");


	//
	// if they are already our friend, we just notify, else
	// we'll add a request to friend them back.
	//

	if (this.getBuddyGroup(pc.tsid)){

		this.activity_notify({
			type: 'friend_add_mutual',
			who: pc.tsid,
		});
	}else{
		this.activity_notify({
			type: 'friend_add',
			who: pc.tsid,
		});
	}
}

function removeBuddy(player_tsid, silent){

	if (!silent) silent = false;

	if (player_tsid == this.tsid) return 'self';

	// first, get the player we're removing
	var pc_target = apiFindObject(player_tsid);

	if (!pc_target) return 'no player';
	if (!pc_target.getProp('is_player')) return 'no player';

	// get the current group
	var group_id = this.getBuddyGroup(player_tsid);
	if (!group_id) return 'not buddy';

	// check the user is in the group
	if (!this.friends[group_id]) return 'no group';
	if (!this.friends[group_id].pcs[player_tsid]) return 'not in group';

	// remove
	delete this.friends[group_id].pcs[player_tsid];
	this.buddies_remove_from_cache(player_tsid);
	pc_target.buddies_delete_reverse(this.tsid);

	// revoke any house keys you gave them (as per http://bugs.tinyspeck.com/6490)
	this.acl_keys_remove(pc_target);

	// perform web callback for additional processing
	utils.http_get('callbacks/buddy_remove.php', {
		from	: this.tsid,
		to	: player_tsid,
		group	: group_id
	});
	this.buddies_changed();

	// send message if we're online
	if (!silent){
		this.sendMsgOnline({
			type		: 'buddy_removed',
			group_id	: group_id,
			pc		: pc_target.make_hash()
		});
	}
	
	this.achievements_set('player', 'buddies_count', this.buddies_count());

	// Remove from neighbor signpost
	var exterior = this.houses_get_external_entrance();
	if (exterior) exterior.loc.removeNeighborTo(player_tsid);

	return 'ok';
}

function getBuddyGroup(player_tsid){

	for (var i in this.friends){
		if (i != 'reverse' && i != 'cache' && this.friends[i].pcs[player_tsid]){
			return i;
		}
	}

	return null;
}

function buddies_add_reverse(pc){

	if (this.friends && this.friends.reverse){
		this.friends.reverse.pcs[pc.tsid] = pc;
	}
	this.buddies_changed();
}

function buddies_delete_reverse(tsid){
	delete this.friends.reverse.pcs[tsid];
	this.buddies_changed();
}

function buddiesSendMsg(msg){

	var tsids = this.buddies_get_tsids();

	apiSendToGroup(msg, tsids);
}

function reverseBuddiesSendMsg(msg){

	var tsids = this.buddies_get_reverse_tsids();

	apiSendToGroup(msg, tsids);
}

function buddies_get_reverse_tsids(){

	this.buddies_init();

	var tsids = [];

	for (var i in this.friends.reverse.pcs){
		tsids.push(i);
	}

	return tsids;
}

function buddies_get_online_login_info(){

	var ret = {};
	ret.is_admin = (this.is_god || this.is_help) ? true : false;
	ret.is_guide = (!ret.is_admin && this.is_guide) ? true : false;
	ret.location = {
		tsid: this.location.tsid,
		label: this.location.is_hidden() ? 'A secret place' : this.location.label
	};

	var props = this.avatar_get_pc_msg_props();
	
	for (var i in props){
		if (i != 'sheet_url' && i != 'singles_url' && i != 'sheet_pending') continue;

		ret[i] = props[i];
			
	}

	//ret.io = apiGetIOOps();
	return ret;
}

function buddies_get_login_info(){
	var online = apiIsPlayerOnline(this.tsid);

	var ret = {
		ok: 1,
		tsid: this.tsid,
		label: this.label,
		online: online,
		level: this.stats_get_level(),
		is_admin: (this.is_god || this.is_help) ? true : false
	};

	var props = this.avatar_get_pc_msg_props();
	
	for (var i in props){
		if (i != 'sheet_url' && i != 'singles_url' && i != 'sheet_pending') continue;

		ret[i] = props[i];
	}

	ret.is_guide = (!ret.is_admin && this.is_guide) ? true : false;
	
	if (online){
		ret.location = {
			tsid: this.location.tsid,
			label: this.location.is_hidden() ? 'A secret place' : this.location.label,
		};
	}

	//ret.io = apiGetIOOps();
	return ret;
}

function buddies_get_login(max){

	// we'll first build a list of friend TSIDs so
	// we can fetch info in parallel, then fetch their info

	var tsids = this.buddies_get_tsids();

	var online = apiCallMethodForOnlinePlayers('buddies_get_online_login_info', tsids);


	//
	// then we can build our output tree
	//

	var buddies = [];

	var count = 0;
	for (var i in this.friends){
		if (i != 'reverse' && i != 'cache'){

			var pcs = {};

			for (var j in this.friends[i].pcs){
				
				pcs[j] = this.buddies_get_from_cache(j);
				if (!pcs[j].tsid) pcs[j] = this.buddies_add_to_cache(apiFindObject(j));
				if (pcs[j].is_deleted){
					delete pcs[j];
					continue;
				}

				if (pcs[j] && online[j] && online[j].location){
					for (var k in online[j]){
						pcs[j][k] = online[j][k];
					}
					
					pcs[j].online = true;
				}
				
				delete pcs[j].ok;

				count++;
				if (max && count >= max) break;
			}

			buddies.push({
				'group_id' : i,
				'label' : this.friends[i].label,
				'pcs' : pcs
			});
		}
	}

	return buddies;
}

//
// towards a more efficient profile page
//
function buddies_get_random_slice(count){
	this.buddies_init();

	if (!count) count = 12;

	var tsids = this.buddies_get_tsids();

	var get = [];

	var limit = tsids.length;

	var used = {};

	if (limit <= count){
		get = tsids;
	} else {
		for(var i=0; i < count; i++){
			var rand = randInt(0, limit-1);
			while(used[rand]){
				rand++;
				if (rand > limit-1) rand = 0;
			}
			get.push(tsids[rand]);
			used[rand] = 1;
		}
	}

	var pcs = {};

	var online = apiCallMethodForOnlinePlayers('buddies_get_online_login_info', get);

	for(var j in get){

		var tsid = get[j];

		pcs[tsid] = this.buddies_get_from_cache(tsid);
		if (!pcs[tsid].tsid) pcs[tsid] = this.buddies_add_to_cache(apiFindObject(tsid));
		if (pcs[tsid].is_deleted){
			delete pcs[tsid];
			this.removeBuddy(tsid, true);
			continue;
		}

		if (pcs[tsid] && online[tsid] && online[tsid].location){
			for (var k in online[tsid]){
				pcs[tsid][k] = online[tsid][k];
			}
					
			pcs[tsid].online = true;
		}
			
		delete pcs[tsid].ok;

	}

	return {
		'pcs' : pcs,
		'total' : limit
		};
}

function buddies_add_ignore(pc){
	this.buddies_init();
	if (config.is_dev) log.info(this+' buddies_add_ignore '+pc);
	
	//
	// If they're currently a buddy, remove them
	//
	
	if (this.buddies_is_buddy(pc)){
		this.removeBuddy(pc.tsid);
	}
	
	//
	// House keys in either direction? Drop 'em
	//

	this.acl_keys_handle_ignore(pc);

	//
	// Add them to our ignore list
	//
	
	this.ignoring.pcs[pc.tsid] = pc;
	
	this.apiSendMsg({
		type: 'buddy_ignore',
		pc: pc.make_hash()
	});
	
	//
	// Add us to their ignored by list
	//
	
	pc.buddies_add_ignored_by(this);
	
	//
	// Remove housing auth
	//
	
	this.houses_remove_all_auth(pc);

	//
	// Remove from neighbor signpost
	//
	
	var exterior = pc.houses_get_external_entrance();
	if (exterior) exterior.loc.removeNeighborTo(this.tsid);
	
	this.sendActivity("You blocked "+pc.linkifyLabel()+".");
}

function buddies_remove_ignore(pc, hide_notify){
	this.buddies_init();
	if (config.is_dev) log.info(this+' buddies_remove_ignore '+pc);
	
	delete this.ignoring.pcs[pc.tsid];
	
	this.apiSendMsg({
		type: 'buddy_unignore',
		pc: pc.make_hash()
	});
	
	pc.buddies_remove_ignored_by(this);
	
	if (!hide_notify){
		this.sendActivity("You un-blocked "+pc.linkifyLabel()+".");
	}
}

// Not called directly, but called by 'buddies_add_ignore'
function buddies_add_ignored_by(pc){
	this.buddies_init();
	if (config.is_dev) log.info(this+' buddies_add_ignored_by '+pc);

	//
	// If they're currently a buddy, remove them
	//
	
	if (this.buddies_is_buddy(pc)){
		this.removeBuddy(pc.tsid);
	}
	
	//
	// Add them to our ignored by list
	//
	
	this.ignored_by.pcs[pc.tsid] = pc;
}

// Not called directly, but called by 'buddies_remove_ignore'
function buddies_remove_ignored_by(pc){
	this.buddies_init();
	if (config.is_dev) log.info(this+' buddies_remove_ignored_by '+pc);
	
	delete this.ignored_by.pcs[pc.tsid];
}

function buddies_is_ignoring(pc){
	if (!this.ignoring) return false;
	return this.ignoring.pcs[pc.tsid] ? true : false;
}

function buddies_is_ignored_by(pc){
	if (!this.ignored_by) return false;
	return this.ignored_by.pcs[pc.tsid] ? true : false;
}

function buddies_get_ignoring_tsids(){

	var out = [];
	
	if (!this.ignoring) return out;
	
	for (var i in this.ignoring.pcs){
		out.push(i);
	}

	return out;
}

function buddies_get_ignoring_login(){

	// For now, all we need are tsids
	var tsids = this.buddies_get_ignoring_tsids();
	
	var all = apiCallMethod('buddies_get_login_info', tsids);


	//
	// then we can build our output tree
	//

	var ignoring = {};

	for (var i=0; i<tsids.length; i++){
		var tsid = tsids[i];

		if (all[tsid] && all[tsid].ok){
			ignoring[tsid] = all[tsid];
			delete ignoring[tsid].ok;
		}else{
			log.error("WOAH! failed to fetch buddy data in time: "+this.tsid);
		}
	}
	
	return ignoring;
}

function buddies_get_ignored_by_tsids(){

	var out = [];
	
	if (!this.ignored_by) return out;

	for (var i in this.ignored_by.pcs){
		out.push(i);
	}

	return out;
}

function buddies_get_ignored_by_login(){

	// For now, all we need are tsids
	var tsids = this.buddies_get_ignored_by_tsids();
	
	var all = apiCallMethod('buddies_get_login_info', tsids);


	//
	// then we can build our output tree
	//

	var ignored_by = {};

	for (var i=0; i<tsids.length; i++){
		var tsid = tsids[i];

		if (all[tsid] && all[tsid].ok){
			ignored_by[tsid] = all[tsid];
			delete ignored_by[tsid].ok;
		}else{
			log.error("WOAH! failed to fetch buddy data in time: "+this.tsid);
		}
	}
	
	return ignored_by;
}

function buddies_get_ignoring_count(){
	if (!this.ignoring) return 0;
	return num_keys(this.ignoring.pcs);
}

function buddies_get_ignored_by_count(){
	if (!this.ignored_by) return 0;
	return num_keys(this.ignored_by.pcs);
}

function buddies_get_cache_data(){
	var out = {
		version: config.buddies_cache_version,
		name: this.label,
		level: this.stats_get_level()
	};

	if (this.isDeleted()) out.is_deleted = true;

	var props = this.avatar_get_pc_msg_props();
	for (var i in props){
		if (i != 'sheet_url' && i != 'singles_url' && i != 'sheet_pending') continue;
		if (i == 'sheet_pending'){
			out[i] = props[i];
		}
		else{
			out[i] = props[i] ? props[i].replace('http://c2.glitch.bz/avatars/', '') : props[i];
		}
	}

	return out;
}

function buddies_get_reverse_cache_tsid(){
	this.buddies_init();
	if (this.reverse_buddy_cache) return this.reverse_buddy_cache.tsid;
	return null;
}

function buddies_add_to_cache(pc){
	this.buddies_init();
	if (!pc) return {};
	
	var cache_tsid = pc.buddies_get_reverse_cache_tsid();
	if (!cache_tsid) return pc.buddies_get_cache_data();

	this.friends.cache.pcs[pc.tsid] = {
		tsid: cache_tsid
	};
	
	return this.buddies_get_from_cache(pc.tsid);
}

function buddies_get_from_cache(tsid){
	var cache = this.friends.cache.pcs[tsid];

	if (!cache) return {};

	if (!cache.tsid){
		delete this.friends.cache.pcs[tsid];
		var pc = apiFindObject(tsid);
		if (!pc) return {};
		return this.buddies_get_cache_data(pc);
	}

	if (cache.name && cache.tsid){
		this.friends.cache.pcs[tsid] = {
			tsid: cache.tsid
		};
	}

	if (cache.tsid){
		cache = apiGetObjectContent(cache.tsid);
		if (cache){
			cache = cache.contents;
		}
		else{
			delete this.friends.cache.pcs[tsid];
			var pc = apiFindObject(tsid);
			if (!pc) return {};
			return pc.buddies_get_cache_data();
		}
	}

	if (!cache){
		delete this.friends.cache.pcs[tsid];
		var pc = apiFindObject(tsid);
		if (!pc) return {};
		return pc.buddies_get_cache_data();
	}

	if (cache.version != config.buddies_cache_version && 0){
		var pc = apiFindObject(tsid);
		if (!pc) return {};
		pc.buddies_update_reverse_cache();
		return this.buddies_get_from_cache(tsid);
	}
	
	var ret = {
		ok: 1,
		tsid: tsid,
		label: cache.name,
		online: false,
		level: cache.level,
		is_admin: false,
		is_guide: false,
		sheet_pending: cache.sheet_pending,
		sheet_url: cache.sheet_url ? 'http://c2.glitch.bz/avatars/'+cache.sheet_url : null,
		singles_url: cache.singles_url ? 'http://c2.glitch.bz/avatars/'+cache.singles_url : null
	};

	if (cache.is_deleted) ret.is_deleted = true;
	
	return ret;
}

function buddies_remove_from_cache(tsid){
	this.buddies_init();
	delete this.friends.cache.pcs[tsid];
}

function buddies_update_reverse_cache(){
	this.buddies_init();
	if (this.reverse_buddy_cache){
		this.reverse_buddy_cache.contents = this.buddies_get_cache_data();
	}
}

function buddies_reset_cache(){
	this.buddies_init();
	this.friends.cache.pcs = {};
}

function buddies_send_buddy_offline(args){
	var group_id = this.getBuddyGroup(args.tsid);

	this.apiSendMsgAsIs({
		type: 'buddy_offline',
		pc: args,
		group_id: group_id
	});
}

function buddies_send_buddy_online(args){
	var group_id = this.getBuddyGroup(args.tsid);

	this.apiSendMsgAsIs({
		type: 'buddy_online',
		pc: args,
		group_id: group_id
	});
}

function buddies_changed(){

	var fwd_tsids = this.buddies_get_tsids();
	var rev_tsids = this.buddies_get_reverse_tsids();

	utils.http_post('callbacks/buddy_change.php', {

		'fwd'	: fwd_tsids.join(','),
		'rev'	: rev_tsids.join(','),
		'tsid'	: this.tsid,
		'ts'	: time()

	}, this.tsid);
}

function buddies_get_simple_online(){

	var tsids = this.buddies_get_tsids();
	var ret = apiCallMethodForOnlinePlayers('buddies_get_simple_online_info', tsids);

	for (var i=0; i<tsids.length; i++){
		ret[tsids[i]].order = i+1;
	}

	return ret;
}

function buddies_get_simple_online_info(){

	var ret = {
		ok		: 1,
		offline		: false,
		is_admin	: (this.is_god || this.is_help) ? true : false
	};

	ret.location = {
		tsid: this.location.tsid,
		label: this.location.label,
		secret: this.location.is_hidden()
	};

	return ret;
}
