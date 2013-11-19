function acl_keys_init(){
	if (!this.acl_keys){
		this.acl_keys = {};
	}
}

function acl_keys_grant(pc){
	if (this.buddies_is_ignored_by(pc)){
		return {ok: 0, reason: "You can't give them a key."};
	} else if (pc.buddies_is_ignored_by(this)){
		return {ok: 0, reason: "You can't give that player a key because you're blocking them."};
	}
	else if (pc.isDeleted()){
		return {ok: 0, reason: "You can't give that player a key because their account is deleted."};
	}

	var loc = this.acl_keys_find_my_house();

	if (!loc){
		return {ok: 0, reason: "You can't give out keys because you don't have a house!"};
	} else if (config.is_dev){
		log.info(this+' acl_keys_grant on '+loc);
	}

	//
	// check limits
	//

	if (loc.acl_keys_count_granted() >= config.acl_keys_per_house_limit){
		return {ok: 0, reason: "You've already given out the maximum number of keys for your house."};
	}

	if (pc.acl_keys_count_received() >= config.acl_keys_per_player_limit){
		return {ok: 0, reason: "They already have too many keys on their keyring!"};
	}

	pc.acl_keys_grant_receive(loc);

	loc.acl_keys_add_key(pc);

	return {ok: true};
}

function acl_keys_grant_receive(loc, silent){
	if (!silent) silent = false;

	this.acl_keys_init();

	this.acl_keys[loc.tsid] = { date_granted: time(),
		location: loc
	};

	this.apiSendMsg(this.acl_keys_build_client_msg());

	if (this.isOnline() && !silent){
		this.prompts_add({
			txt		: "<b>"+utils.escape(loc.owner.label)+"</b> sent you a key to their house! (Keys can be found at your Magic Rock.)",
			icon_buttons	: false,
			timeout		: 0,
			choices		: [
				{ value : 'ok', label : 'OK' }
			]
		});
	}
}

function acl_keys_remove(pc){
	var loc = this.acl_keys_find_my_house();

	if (!loc) return {ok: false, error: 'house_not_found'};

	pc.acl_keys_remove_receive(loc);

	if (loc.acl_keys_player_has_key(pc)){
		loc.acl_keys_remove_key(pc);

		loc.pols_kickPlayer(pc);
	}

	return {ok: true};
}

function acl_keys_remove_receive(loc){
	this.acl_keys_init();

	if (loc && this.acl_keys[loc.tsid]){
		delete this.acl_keys[loc.tsid];

		this.apiSendMsg(this.acl_keys_build_client_msg());
	}
}

function acl_keys_handle_ignore(pc){
	var loc = this.acl_keys_find_my_house();

	if (!loc){
		return;
	}

	//
	// Remove their key, if we gave them one
	//

	if (loc.acl_keys_player_has_key(pc)){
		this.acl_keys_remove(pc);
	}

	//
	// Remove our key, if they gave us one
	//

	var their_loc = pc.acl_keys_find_my_house();

	if (their_loc && their_loc.acl_keys_player_has_key(this)){
		pc.acl_keys_remove(this);
	}
}



function acl_keys_count_received(){
	this.acl_keys_init();

	return num_keys(this.acl_keys);
}

function acl_keys_build_client_msg(msg){
	this.acl_keys_init();

	if (!msg){
		msg = {type: 'acl_key_info'};
	}

	var house = this.acl_keys_find_my_house();

	if (house){
		var house_keys = house.acl_keys_get_keys();
		if (num_keys(house_keys)){
			msg.keys_given = [];
			var key;
			var deets;
			for (var i in house_keys){
				deets = house_keys[i];
				key = {
					received: deets.date_granted,
					pc: {
						tsid: deets.pc.tsid,
						label: deets.pc.label,
						singles_url: deets.pc.avatar_get_singles(),
					}
				};
				msg.keys_given.push(key);
			}
		}
	}

	if (num_keys(this.acl_keys)){
		msg.keys_received = [];
		var key;
		var deets;
		var owner;
		for (var i in this.acl_keys){
			deets = this.acl_keys[i];
			owner = deets.location.pols_get_owner();
			key = {
				received: deets.date_granted,
				location: deets.location.get_client_info(),
				pc: {
					tsid: owner.tsid,
					label: owner.label,
					singles_url: owner.avatar_get_singles(),
				}
			};
			msg.keys_received.push(key);
		}
	}

	return msg;
}

function acl_keys_find_my_house(){
	if (this.home && this.home.interior){
		return this.home.interior;
	} else {
		log.info('KEY FAIL: could not find new house for '+this.tsid);
		return false;
	}
}

function acl_keys_get_keys(){
	return this.acl_keys;
}

//
// this is basically a stub so that bits of house migration stuff still work (maybe) on dev.
//
function acl_keys_get_given(include_reverse){
	var loc = this.acl_keys_find_my_house();

	if (loc){
		return loc.acl_keys_get_keys();
	} else {
		return {};
	}
}

function acl_keys_fix_house_backup(really_fix_it){
	if (!really_fix_it) really_fix_it = false;


        if (!this.home_backup || !this.home_backup.interior) return ['no backup home found'];
        if (!this.home || !this.home.interior) return ['no home found'];

        var results = [];

        var backup_keys = this.home_backup.interior.acl_keys_get_keys();

        var keys = this.home.interior.acl_keys_get_keys();

        for(var i in backup_keys){
                if (!keys[i]){
			var pc = backup_keys[i].pc;
                        var their_keys = pc.acl_keys_get_keys();

                        if (their_keys[this.home_backup.interior.tsid]){
                        	if (really_fix_it){
					pc.acl_keys_grant_receive(this.home.interior, true);
					pc.acl_keys_remove_receive(this.home_backup.interior);
				}
				results.push(i+' key reassigned from backup house to new');
                        } else {
				results.push(i+' key found in backup home but not player - ignoring');
                        }
                } else {
                        results.push(i+' already has key to current house');
                }
        }

        return results;
}