function houses_login(){
	this.house_auth = {};
	this.house_auth_req = {};
}

function houses_logout(){
	delete this.house_auth;
	delete this.house_auth_req;


	//
	// In a POL that's not yours? You go to the entrance.
	// In a POL that is yours? Everyone else goes to the entrance
	//

	if (this.location.pols_is_pol() && !this.location.getProp('is_public')){
		var entrance = this.location.pols_get_entrance_outside();

		if (this.location.pols_is_owner(this)){
			var pcs = this.location.getAllPlayers();
			for (var i in pcs){
				if (i == this.tsid || pcs[i].is_god || pcs[i].is_help || this.location.acl_keys_player_has_key(pcs[i])) continue;

				pcs[i].teleportToLocationDelayed(entrance.tsid, entrance.x, entrance.y);
			}
		}
		else if (!this.is_god && !this.is_help){
			this.teleportToLocationDelayed(entrance.tsid, entrance.x, entrance.y);
		}
	}
	
	if (this.houses){
		for (var i in this.houses){
			var house = apiFindObject(i);
			if (!house || house.getProp('is_public')) continue;

			if (!house.pols_trusteeOnline(this)){
				house.pols_kickEveryone();
			}
		}
	}
	else if (this.home && this.home.interior){
		var house = this.home.interior;
		if (!house.pols_trusteeOnline(this)){
			house.pols_kickEveryone();
		}
	}


	if (this.acl_keys){
		for (var i in this.acl_keys){
			var house = this.acl_keys[i].location;
			if (!house.pols_trusteeOnline(this)){
				house.pols_kickEveryone();
			}
		}
	}

}

function houses_has_authed(loc, pc){
	
	if (!this.house_auth) return false;

	var key = loc.tsid + '!' + pc.tsid;
	return this.house_auth[key] ? true : false;
}

function houses_has_requested(loc, pc){
	
	if (!this.house_auth_req) return false;

	var key = loc.tsid + '!' + pc.tsid;
	return this.house_auth_req[key] ? true : false;
}

function house_set_auth(key){

	this.house_auth[key] = 1;

	var a = key.split('!');

	var loc_tsid = a[0];
	var pc_tsid = a[1];

	var pc = apiFindObject(pc_tsid);
	pc.sendOnlineActivity(this.linkifyLabel()+" has let you into their location");
	pc.prompts_add({
		txt		: this.linkifyLabel()+" has let you into their house.",
		icon_buttons	: false,
		timeout: 20,
		choices		: [
			{ value : 'ok', label : 'Very well' }
		],
	});
}

function houses_remove_auth(loc, pc){
	var key = loc.tsid + '!' + pc.tsid;
	
	if (this.house_auth) delete this.house_auth[key];
	if (this.house_auth_req) delete this.house_auth_req[key];
}

function houses_remove_all_auth(pc){

	if (!this.houses) this.houses = {};

	for (var i in this.houses){

		this.houses_remove_auth(apiFindObject(i), pc);
	}

	if (this.home && this.home.interior){
		this.houses_remove_auth(this.home.interior, pc);
	}
}

function houses_auth_request(loc, pc){

	var key = loc.tsid + '!' + pc.tsid;

	// already authed?
	if (!this.house_auth) this.house_auth = {};
	if (this.house_auth[key]) return;

	// request already sent?
	if (!this.house_auth_req) this.house_auth_req = {};
	if (this.house_auth_req[key]) return;

	// send request
	this.house_auth_req[key] = 1;
	
	this.announce_sound('POL_GATE_KNOCKED');
	pc.announce_sound('POL_GATE_KNOCKED');

	// prompt the owner
	this.prompts_add({
		'callback'	: 'houses_auth_req',
		'key'		: key,
		'pc'		: pc,
		'loc'		: loc,
		'txt'		: pc.linkifyLabel()+" is knocking on your door and would like to enter your house...",
		'timeout'	: 20,
		'timeout_value'	: 'dismiss',
		'icon_buttons'	: true,
		'choices'	: [
			{ label: "Ok, let them in.", value: 'allow' },
			{ label: "Nope, don't answer the door", value: 'dismiss' },
		],
	});
}

function houses_auth_req(choice, details){

	if (choice == 'allow'){

		this.house_set_auth(details.key);
		return;
	}

	// drop through - dismiss
	if (this.house_auth_req) delete this.house_auth_req[details.key];
	return;
}

function houses_add_property(tsid){

	if (!this.houses) this.houses = {};
	this.houses[tsid] = 1;
	this.houses_update_client();
}

function houses_remove_property(tsid){

	if (!this.houses) this.houses = {};
	delete this.houses[tsid];
	this.houses_update_client();
}

function houses_has_house(){

	if (!this.houses) this.houses = {};
	//return num_keys(this.houses) || num_keys(this.home) ? 1 : 0;

	for (var i in this.houses){
		var house = apiFindObject(i);
		if (!house.getProp('is_home') && !house.getProp('is_deleted')) return true;
	}

	return false;
}

function houses_get_login(){

	if (!this.houses) this.houses = {};
	for (var i in this.houses){
		var house = apiFindObject(i);
		if (house.getProp('is_home') || house.getProp('is_deleted')) continue;

		return house.get_client_info();
	}

	return null;
}

function houses_get_login_new(){

	var ret = {};
	if (this.home){
		for (var i in this.home){
			if (this.home[i] === undefined || this.home[i] === null) continue;
			var loc = this.home[i];
			if (!loc) continue;
			
			ret[loc.tsid] = loc.get_client_info();

			if (i == 'exterior') ret[loc.tsid].is_exterior = true;
			if (i == 'interior') ret[loc.tsid].is_interior = true;
		}
	}

	return ret;
}

function houses_get(){
	var new_house = this.houses_get_new();
	if (new_house && new_house[0]) return new_house[0];

	return null;
}

function houses_get_all(){
	var ret = [];
	for (var i in this.houses){
		var loc = apiFindObject(i);
		if (loc && !loc.getProp('is_deleted')) ret.push();
	}

	if (this.home && this.home.interior && !in_array(this.home.interior, ret)) ret.push(this.home.interior);

	return ret;
}

function houses_get_old(){
	var ret = [];
	for (var i in this.houses){
		var house = apiFindObject(i);
		if (house && !house.getProp('is_home')) ret.push(house);
	}

	return ret;
}

function houses_get_new(){
	if (this.home && this.home.interior) return [this.home.interior];
	return [];
}

function houses_get_with_streets(){

	try{
		return {
			data: this.home.interior.get_client_info(),
			street: this.home.exterior.getInfo()
		};
	} catch(e){
		return null;
	}
}

function houses_get_entrances(){
	if (!this.houses) this.houses = {};
	
	var entrances = {};
	for (var i in this.houses){
		var house = apiFindObject(i);
		if (house && !house.getProp('is_deleted')){
			var links = house.geo_links_get_outgoing();
			for (var l in links){
				if (links.length == 1 || (links[l].deco_class && links[l].deco_class.indexOf('entrance') >= 0)){
					entrances[i] = {
						tsid: links[l].tsid,
						x: links[l].x,
						y: links[l].y
					};
				}
			}
		}
	}

	// TODO: Maybe just always use the exterior?
	if (this.home && this.home.interior){
		var links = this.home.interior.geo_links_get_outgoing();
		for (var l in links){
			if (links.length == 1 || (links[l].deco_class && links[l].deco_class.indexOf('entrance') >= 0)){
				entrances[i] = {
					tsid: links[l].tsid,
					x: links[l].x,
					y: links[l].y
				};
			}
		}
	}
	
	return entrances;
}

function houses_update_client(){
	this.sendMsgOnline({
		'type'		: 'pol_change',
		'pol_info'	: this.houses_get_login(),
		'home_info' : this.houses_get_login_new()
	});
}


function houses_familiar_no_owner(choice, details){

	//
	// offer the various options
	//

	if (choice == 'start'){

		var txt = '';
		var choices = {
			1: {
				txt     : 'View the realty listing',
				value   : 'realty_listing'
			}
		};

		if (details.can_buy){

			txt = "This location is for sale!";
			choices[2] = {
				txt     : 'Purchase location for '+details.cost+' currants',
				value   : 'purchase'
			};

		}else if (details.error == 'has_other'){

			txt = "This location is for sale. You already own a location, which you'll need to sell before you can buy a new one.";

		}else if (details.error == 'no_money'){

			txt = "This location is for sale for "+details.cost+" currants (more than you have right now!)";

		}else if (details.error == 'no_papers'){

			txt = "Ah, I see you don't have <a href=\"event:item|your_papers\">Your Papers</a>, and you'll need them to buy a house. <split butt_txt=\"Papers?\" /> That's right. You can get <a href=\"event:item|your_papers\">Your Papers</a> at the Bureaucratic Hall on <a href=\"event:location|58#LLI32G3NUTD100I\">Gregarious Grange</a>, or you can avoid the red tape by getting them from another player. Hint: Try <a href=\"event:external|/auctions/\">Auctions</a>";
		
		}else{
			txt = "Unknown reason you can't buy it! "+details.error;
		}

		choices[3] = {
			txt     : 'Just walk away',
			value   : 'dismiss'
		};

		return {
			txt: txt,
			choices: choices
		};
	}


	//
	// look at the listing?
	//

	if (choice == 'realty_listing'){

		this.apiSendMsgAsIs({
			type: 'go_url',
			url: '/realty/'+details.loc_tsid+'/',
			new_window: 'realty'
		});

		return {done: true};
	}


	//
	// purchase?
	//

	if (choice == 'purchase'){

		var loc = apiFindObject(details.loc_tsid);

		var ret = loc.pols_buyHouse(this);

		if (!ret.ok){
			return {
				txt : "Location purchase failed!?",
				done : true
			};
		}


		//
		// teleport in there
		//

		var landing = loc.geo_get_teleport_point(false);
		if (!landing.found){
			var door_id = loc.geo_find_door_id();
			var door_info = loc.geo_get_door_info(door_id);
			if (door_info){
				landing.x = door_info.x;
				landing.y = door_info.y;
			}
		}


		this.teleportToLocation(loc.tsid, landing.x, landing.y);
		return {done: true};
	}


	//
	// dismiss
	//

	return {done: true};
}

function houses_familiar_owner_offline(choice, details){

	return {
		txt: "The owner of this location ("+details.owner.linkifyLabel()+") is currently offline",
		done: true
	};
}

function houses_familiar_owner_not_at_home(choice, details){
	return {
		txt: "The owner of this location ("+details.owner.linkifyLabel()+") is not at home right now",
		done: true
	};
}

function houses_familiar_knock(choice, details){

	if (choice == 'start'){

		var owner = apiFindObject(details.owner_tsid);
		
		if (this.buddies_is_ignored_by(owner)){
			return {
				txt : owner.label+" is blocking you.",
				done : true
			};
		}

		if (details.requested){

			return {
				txt : "You've already asked "+owner.linkifyLabel()+" if you can enter - be patient!",
				done : true
			};
		}

		return {
			txt : "The owner ("+owner.linkifyLabel()+") is currently at home",
			choices : {
				1: {
					txt: "Knock on the door",
					value: 'knock'
				},
				2: {
					txt: "Don't bother",
					value: 'dismiss'
				}
			}
		};
	}

	if (choice == 'knock'){

		var loc = apiFindObject(details.loc_tsid);

		loc.owner.houses_auth_request(loc, this);

		return {
			txt : "Ok! We'll let you know if they answer the door",
			done : true
		};
	}

	return {done: true};
}

function houses_familiar_private_group(choice, details){

	return {
		txt: "The location is the property of <b>"+(details.owner.mode == 'private' ? 'A Private Organization' : details.owner.label)+"</b>, and you are not a member.",
		done: true
	};
}

function houses_familiar_has_org(choice, details){

	return {
		txt: "This location is unowned, but you are already in an Organization",
		done: true
	};
}


function houses_familiar_org_create(choice, details){

	//
	// offer the various options
	//

	if (choice == 'start'){

		var txt = 'This location is for sale! In order to purchase it, you must create a new Organization.<br /><br />This will cost <b>'+details.cost+' currants</b>.';
		var choices = {
			1: {
				txt     : 'Create new Organization',
				value   : 'confirm'
			},
			2: {
				txt     : 'Just walk away',
				value   : 'dismiss'
			}
		};

		return {
			txt: txt,
			choices: choices
		};
	}


	//
	// confirm
	//

	if (choice == 'confirm'){
		var txt = 'Are you sure? This is a big commitment. This will cost <b>'+details.cost+' currants</b>. You can only be in one Organization. There are fees.';
		var choices = {
			1: {
				txt     : 'Yes, I commit',
				value   : 'purchase'
			},
			2: {
				txt     : 'Just walk away',
				value   : 'dismiss'
			}
		};

		return {
			txt: txt,
			choices: choices
		};
	}


	//
	// purchase?
	//

	if (choice == 'purchase'){

		var loc = apiFindObject(details.loc_tsid);

		//
		// Charge them
		//

		if (!this.stats_try_remove_currants(details.cost, {type: 'org_purchase', pol: this.tsid})){
			this.sendActivity('Not enough currants!');

			return {
				ok: 0,
				error: 'no_money'
			};
		}


		//
		// Create a new org and set it as the owner
		// Walk connections and set the other group street(s) as owned
		//

		var org = this.organizations_create('Unnamed Organization', '');
		loc.pols_setOwner(org);


		//
		// prompt for an org name
		//

		var args = {
			cancel_label: 'Later',
			submit_label: 'Name It',
			subtitle: 'Your new Organization needs a name!',
			input_max_chars: 255
		};
		this.openInputBox('org_create', 'Create Your Organization', args);

		return {done: true};
	}


	//
	// dismiss
	//

	return {done: true};
}

function houses_familiar_unnamed_org(choice, details){
	var loc = apiFindObject(details.loc_tsid);
	var org = loc.owner;
	if (!org) return {done: true};


	//
	// offer the various options
	//

	if (choice == 'start'){
		var txt = '';

		if (org.is_member(this)){
			if (org.is_admin(this)){
				txt = "You have not named your Organization yet. No one may enter until you do. Would you like to do that now?";

				var choices = {
					1: {
						txt     : 'Now, please',
						value   : 'rename'
					},
					2: {
						txt     : 'Perhaps Later?',
						value   : 'dismiss'
					}
				};

				return {
					txt: txt,
					choices: choices
				};
			}
			else{
				txt = "Your Organization administrator has not yet named your Organization. No one may enter until they do.";

				return {
					txt: txt,
					done: true
				};
			}
		}
		else{
			txt = "The Organization owning this property is not ready for visitors yet.";

			return {
				txt: txt,
				done: true
			};
		}
	}


	//
	// name?
	//

	if (choice == 'rename'){

		//
		// prompt for an org name
		//

		var args = {
			cancel_label: 'Later',
			submit_label: 'Name It',
			subtitle: 'Your new Organization needs a name!',
			input_max_chars: 255
		};
		this.openInputBox('org_create', 'Create Your Organization', args);

		return {done: true};
	}


	//
	// dismiss
	//

	return {done: true};
}

function houses_familiar_newxp_locked(choice, details){

	return {
		txt: "Oops - looks like you need to go talk to your rock first!",
		done: true
	};
}


function houses_familiar_newxp_wait(choice, details){

	return {
		txt: "That player cannot be visited yet.",
		done: true
	};
}

function houses_remove_all(){

	if (!this.houses) this.houses = {};

	for (var i in this.houses){
		var loc = apiFindObject(i);
		if (loc) loc.pols_sellHouse(this);
	}

	// Delete incoming neighborhood signposts
	try{
		var reverse = this.buddies_get_reverse_tsids();
		for (var i in reverse){
			var pc = getPlayer(reverse[i]);
			if (!pc) continue;

			var exterior = pc.houses_get_external_entrance();
			if (exterior) exterior.loc.removeNeighborTo(this.tsid);
		}
	}
	catch(e){
		log.error(this+" could not delete incoming signposts: "+e);
	}

	if (!this.home) this.home = {};
	for (var i in this.home){
		var pol = this.home[i];
		if (pol){
			pol.homes_return_decos();
			pol.jobs_delete_all();
			pol.geo_links_clear_sources();
			pol.geo_clear_doors();
			pol.evacuatePlayers();

			pol.admin_delete();
		}
	}
	delete this.home;
}

function houses_remove_new(){
	if (this.home){

		// Backup keys
		if (!this.acl_keys_backup) this.acl_keys_backup = this.acl_keys_get_given(true);
		this.had_butler = this.has_butler();

		// Moving boxes
		this.removeButler();

		// Backup social signpost
		if (this.home.exterior && !this.social_signpost_backup){
			this.social_signpost_backup = {};
			var neighbors = this.home.exterior.getNeighbors();
			for (var i in neighbors){
				this.social_signpost_backup[i] = neighbors[i].tsid;
			}
		}

		// Delete incoming neighborhood signposts
		var reverse = this.buddies_get_reverse_tsids();
		for (var i in reverse){
			var pc = getPlayer(reverse[i]);
			if (!pc) continue;

			var exterior = pc.houses_get_external_entrance();
			if (exterior && exterior.loc) exterior.loc.removeNeighborTo(this.tsid);
		}

		for (var i in this.home){
			var pol = this.home[i];
			if (pol){
				pol.pack_moving_boxes();
				pol.homes_return_decos();
				pol.jobs_delete_all();
				pol.geo_links_clear_sources();
				pol.geo_clear_doors();
				pol.evacuatePlayers();
				pol.setProp('is_deleted', true);

				pol.admin_delete();
			}
		}

		if (!this.home_backup) this.home_backup = this.home;
		delete this.home;
	}
}

function houses_go_to_new_house(force_recreate, no_teleport, go_inside){


	//
	// Force recreate?
	//

	if (this.home && force_recreate){
		this.houses_remove_new();
	}
	else if (!this.home){
		// Backup keys
		if (!this.acl_keys_backup) this.acl_keys_backup = this.acl_keys_get_given();
	}


	//
	// Make new locations
	//

	if ((!this.home || !num_keys(this.home)) && (!this.home_is_creating || force_recreate || time() - this.home_is_creating > 2*60)){
		this.home_is_creating = time();
		this.home = {};

		var label = utils.escape(this.label)+"'s";
		var ret = this.houses_create_location(label+' House', 'home_interior', false);
		if (!ret.ok) return ret;

		this.home.interior = ret.pol;
		this.home.interior.homes_demo_backyard(); // init backyard
		if (this.acl_keys_backup){
			log.info("Setting interior keys to: "+this.acl_keys_backup);
			this.home.interior.acl_keys_set(this.acl_keys_backup); // restore keys
			delete this.acl_keys_backup;
		}

		ret = this.houses_create_location(label+' Home Street', 'home_exterior', false);
		if (!ret.ok) return ret;

		this.home.exterior = ret.pol;
		this.home.exterior.setProp('is_public', true);
		this.home.exterior.homes_demo_frontyard(); // init frontyard
		if (this.social_signpost_backup){
			this.home.exterior.setNeighbors(this.social_signpost_backup);
			delete this.social_signpost_backup;
		}


		//
		// Wire up doors
		//

		var doors_out = this.home.interior.geo_links_get_all_doors();
		if (!doors_out[0]) return {ok: 0, error: "No doors out"};

		var doors_in = this.home.exterior.geo_links_get_all_doors();
		if (!doors_in[0]) return {ok: 0, error: "No doors in"};

		var marker_inside = this.home.interior.geo_get_teleport_point();
		var marker_outside = this.home.exterior.geo_get_teleport_point();

		this.home.interior.geo_door_set_dest_pos(doors_out[0].door_id, this.home.exterior, marker_outside.found ? marker_outside.x : doors_in[0].my_x, marker_outside.found ? marker_outside.y : doors_in[0].my_y);
		this.home.exterior.geo_door_set_dest_pos(doors_in[0].door_id, this.home.interior, marker_inside.found ? marker_inside.x : doors_out[0].my_x, marker_inside.found ? marker_inside.y : doors_out[0].my_y);


		//
		// CH: build some demo rooms on the interior
		//

		this.home.interior.homes_rebuild_rooms();


		// Moving boxes
		//this.houses_undo_moving_boxes();

		this.houses_update_client();
		delete this.home_is_creating;
	}
	else{
		// Migrate?
		this.houses_reset_for_r2();
		//this.houses_undo_moving_boxes();
	}


	//
	// I want to go to there
	//

	if (!no_teleport){

		//
		// newxp
		//

		if (this.location.is_skillquest){
			return {ok: 0, error: "Just finish the quest first! It's easy!"};
		}

		if (this.newxp_allow_home){
			// TA-DA!
			this.newxpComplete();
		}

		var target_house = go_inside ? this.home.interior : this.home.exterior;
		var ret = this.houses_teleport_to(target_house);

		if (!ret.ok) return ret;
	}

	return {ok: 1};
}

function houses_go_to_tower(){
	if (!this.home || !this.home.tower) return {ok: 0, error: "You don't have a tower!"};
	if (this.location.is_skillquest){
		return {ok: 0, error: "Just finish the quest first! It's easy!"};
	}

	var ret = this.houses_teleport_to(this.home.tower);

	if (!ret.ok) return ret;

	return {ok: 1};
}

function admin_houses_visit(args){
	var ret = this.houses_visit(args.player_tsid);
	if (!ret.ok){
		switch (ret.error){
			case 'player_not_found':
				ret.error = "Could not find that player.";
				break;
			case 'blocked':
				ret.error = "You are blocked by that player.";
				break;
			case 'house_not_found':
				ret.error = "Could not find their house.";
				break;
			case 'followers_cant_visit':
				ret.error = "One or more of your followers can't visit that location, so neither can you!";
				break;
			case 'newxp':
				ret.error = "That player has not finished the tutorial, and can't be visited until they do.";
				break;
			case 'newxp_us':
				ret.error = "You can't do that until you finish the tutorial.";
				break;
		}
	}

	return ret;
}

function houses_visit(player_tsid){

	// find player
	var player = apiFindObject(player_tsid);
	if (!player){
		return {
			ok: 0,
			error: 'player_not_found',
		};
	}

	// check blocking
	if (this.buddies_is_ignored_by(player)){
		return {
			ok: 0,
			error: 'blocked',
		};
	}

	// find house
	var house = player.houses_get_external_street();
	if (!house){
		return {
			ok: 0,
			error: 'house_not_found',
		};
	}

	// can enter?
	var ret = house.pols_canEnter(this);
	if (!ret.ok){
		if (!ret.error && ret.msg) ret.error = ret.msg;
		return ret;
	}

	if (!house.pols_is_owner(this) && this.countFollowers()){
		var followers_have_clearance = 1;

		for (var i in this.followers){
			var follower = apiFindObject(i);

			var fret = house.pols_canEnter(follower);

			if (!fret.ok){
				followers_have_clearance = 0;
			}

		}

		if (!followers_have_clearance){
			return {
				ok: 0,
				error: 'followers_cant_visit',
			};
		}
	}

	// newxp
	if (!house.pols_is_owner(this) && (!player.has_done_intro || player.getQuestStatus('leave_gentle_island') == 'todo')){
		return {
			ok: 0,
			error: 'newxp',
		};
	}

	// newxp us
	if (!house.pols_is_owner(this) && (!this.has_done_intro || this.getQuestStatus('leave_gentle_island') == 'todo')){
		return {
			ok: 0,
			error: 'newxp_us',
		};
	}

	return this.houses_teleport_to(house);
}

function houses_teleport_to(target_house, x, y){

	if (this.is_dead) return {ok: 0, error: "You are dead."};

	if (this.making_is_making()) return {ok: 0, error: "You need to finish up what you're working on first."};

	//
	// Record where they were before
	//

	this.houses_record_leave();


	//
	// Decide where to go
	//

	var landing = target_house.homes_get_teleport_location();
	if (x === undefined) x = landing.x;
	if (y === undefined) y = landing.y;

	this.teleportToLocationDelayed(target_house.tsid, x, y);

	return {ok: 1};
}

function houses_record_leave(){
	if (this.location.isInstance() && this.location.class_tsid != 'newbie_island'){
		var exit = this.instances_unwind_exit();
		if (exit && exit.tsid){
			var exit_loc = apiFindObject(exit.tsid);
			if (exit_loc && (!exit_loc.pols_is_pol() || !exit_loc.getProp('is_home'))){
				this.home_leave = exit;
			}
		}
	}
	else if (this.location.no_teleportation){
		var targets = this.location.geo_links_get_incoming();
		var choice = choose_one(array_keys(targets));

		if (targets[choice]){
			this.home_leave = {
				tsid: targets[choice].street_tsid,
				x: targets[choice].x,
				y: targets[choice].y
			};
		}
		else{
			this.home_leave = {
				tsid: this.location.tsid,
				x: this.x,
				y: this.y
			};
		}
	}
	else if (!this.location.pols_is_pol() || !this.location.getProp('is_home')){
		this.home_leave = {
			tsid: this.location.tsid,
			x: this.x,
			y: this.y
		};
	}
}

function houses_create_location(label, type, db_sync){

	var pol_cfg = {};
	if (type == 'home_interior') pol_cfg = config.homes_interior_configs[config.home_limits.START_INT_TEMPLATE];
	if (type == 'home_exterior') pol_cfg = config.homes_exterior_configs[config.home_limits.START_EXT_TEMPLATE];


	//
	// get the template/source
	//

	var source = apiFindObject(pol_cfg.template);

	if (!source.tsid){
		return {
			ok: 0,
			error: "can't find template"
		};
	}


	//
	// clone the street
	//

	// TODO: Separate location classes for interior/exterior?
	var new_loc = source.apiCopyLocation(label, config.is_prod ? '15' : '28', 'POL_'+this.tsid, false, 'home');

	// TODO: Shrink down the geo from the template to make the initial street

	new_loc.pols_setOwnable(0, 1);
	new_loc.pols_setOwner(this);
	new_loc.pols_setTemplate(source.tsid);
	new_loc.pols_setImage(source.getProp('image'));
	new_loc.pols_setDoorUid(type);
	new_loc.setProp('is_home', true);
	new_loc.setAllowSync(db_sync);

	new_loc.web_sync();
	new_loc.pols_sync();


	//
	// return
	//

	return {
		'ok'		: 1,
		'pol'		: new_loc
	};
}

// The position of the signpost (?) on our external street
function houses_get_external_entrance(){
	if (!this.home || !this.home.exterior) return null;

	var post = this.home.exterior.geo_links_get_all_signposts()[0];
	if (!post) return null;

	return {
		loc: this.home.exterior,
		x: post.signpost_x,
		y: post.signpost_y
	};
}

function houses_is_at_home(){
	return this.location.homes_belongs_to(this.tsid);
}

function houses_is_our_home(tsid){
	var loc = apiFindObject(tsid);
	if (!loc) return false;
	return loc.homes_belongs_to(this.tsid);
}

function houses_check_inside_home(){
	if (!this.home || !this.home.exterior || !this.home.interior){
		this.sendActivity('Only works in your own house');
		return false;
	}
	if (this.location.tsid != this.home.interior.tsid){
		this.sendActivity('Only works in your own house');
		return false;
	}

	return true;
}


////////////////////////////////////////////////////////////////
//
// THESE ARE DEBUGGING FUNCTIONS!
//

function houses_reset(){
	if (!this.houses_check_inside_home()) return false;

	return this.location.homes_reset();
}

function houses_rebuild(){
	if (!this.houses_check_inside_home()) return false;

	return this.location.homes_rebuild_rooms();
}

function houses_add_floor(){
	if (!this.houses_check_inside_home()) return false;

	return this.location.homes_add_floor_at(this.location.homes_guess_door_pos());
}

//
// END OF DEBUG FUNCTIONS
//
////////////////////////////////////////////////////////////////


function houses_get_external_street(){
	return this.home ? this.home.exterior : null;
}

function houses_get_interior_street(){
	return this.home ? this.home.interior : null;
}

function houses_get_external_tsid(){
	return this.home && this.home.exterior ? this.home.exterior.tsid : null;
}

function houses_get_interior_tsid(){
	return this.home && this.home.interior ? this.home.interior.tsid : null;
}

function houses_get_tower_tsid(){
	return this.home && this.home.tower ? this.home.tower.tsid : null;
}

function houses_do_moving_boxes(){
	try{
		if (this.home){
			if (this.home.interior){
				this.home.interior.pack_moving_boxes('interior');
			}

			if (this.home.exterior){
				this.home.exterior.pack_moving_boxes('exterior');
			}
		}

		var old = this.houses_get_old();
		if (old && old[0]){
			old[0].pack_moving_boxes('old');
		}
	}
	catch(e){
		log.error(this+" houses_do_moving_boxes motherfucking exception: "+e);
	}
}

function houses_undo_moving_boxes(){
	if (!this.home || !this.home.interior) return false;

	var offset = 200;
	try{
		for (var i in this.hiddenItems){
			var it = this.hiddenItems[i];
			if (it && it.class_tsid == 'bag_moving_box'){
				log.info(this+" houses_undo_moving_boxes doing "+it);
				if (!it.countContents()){
					it.apiDelete();
				}
				else{
					var pt = this.home.interior.geo_get_teleport_point();
					this.home.interior.apiPutItemIntoPosition(it, intval(pt.x)-offset, intval(pt.y));
					offset += 200;
				}
			}
		}
	}
	catch(e){
		log.error(this+" houses_undo_moving_boxes motherfucking exception: "+e);
		//this.apiSetTimer('houses_undo_moving_boxes', 5000);
	}

	return true;
}

function houses_leave(){
	if (!this.location.getProp('is_home')) return this.sendActivity("To leave, you must first go /home");

	var target = this.houses_get_previous_location();
	if (!target.tsid){
		if (!this.has_done_intro || this.getQuestStatus('leave_gentle_island') == 'todo') return this.sendActivity("You can't do that yet");
		return config.is_dev ? this.teleportHome() : this.teleportSomewhere();
	}

	var loc = apiFindObject(target.tsid);
	if (loc && loc.class_tsid == 'newbie_island'){
		this.removeFollowers();
	}

	this.teleportToLocationDelayed(target.tsid, target.x, target.y);
	delete this.home_leave;
}

function houses_get_previous_location(){
	var target = this.home_leave;
	var loc;

	// Newxp forcing to newbie island
	if (this.getQuestStatus('leave_gentle_island') == 'todo' && !config.is_dev){
		if (target && target.tsid){
			loc = apiFindObject(target.tsid);
			if (loc && loc.class_tsid == 'newbie_island') return target;
		}

		// They're missing the location, so let's just send them to street 3
		return {
			tsid: 'LIF8LHA3HT336O0',
			x: 786,
			y: -294
		};
	}

	if (!target || !target.tsid) return {};

	loc = apiFindObject(target.tsid);
	if (!loc) return {};

	if ((loc.is_hidden() || loc.jobs_is_street_locked()) && loc.class_tsid != 'newbie_island'){
		return {};
	}

	if (loc.class_tsid == 'newbie_island' && this.getQuestStatus('leave_gentle_island') == 'done'){
		return {};
	}

	if (loc.pols_is_pol() && !loc.pols_is_owner(this) && !loc.getProp('is_public')){
		target = loc.pols_get_entrance_outside();
	}

	return target;
}

function houses_get_previous_location_client(){
	var target = this.houses_get_previous_location();
	if (!target.tsid) return {};

	return apiFindObject(target.tsid).getMapInfo();
}

function admin_reset_house(args){
	if (this.home){
		this.houses_go_to_new_house(true, true);

		this.furniture_reset();
	}

	return {ok:1};
}

function houses_get_bags(){
	var old = this.houses_get_old();

	if (old && old[0]) return old[0].getBags();
}

function houses_expand_costs(){

	if (!this.houses_is_at_home()){
		return {
			ok: 0,
			error: 'not_at_home',
		};
	}

	var house_type = this.location.homes_get_type();

	if (house_type == 'tower'){
		return {
			ok: 1,
			costs: this.location.tower_get_expand_costs(),
		};
	}

	if (house_type == 'interior' || house_type == 'exterior'){
		return {
			ok: 1,
			costs: this.location.homes_get_expand_costs(),
		};
	}

	return {
		ok: 0,
		error: 'cant_expand_here',
	};
}

function houses_extend(){

	if (!this.home.interior){
		return {
			ok: 0,
			error: 'no_new_house',
		};
	}

	if (this.home.interior.home_has_active_expansion()){
		return {
			ok: 0,
			error: 'busy_adding_floor',
		};
	}

	var costs = this.home.interior.homes_get_expand_costs();

	if (!costs.wall.count){
		return {
			ok: 0,
			error: 'no_expansions_left',
		};
	}

	var items = [];
	for (var i in costs.wall.items){
		if (costs.wall.items[i]){
			items.push([i, costs.wall.items[i]]);
		}
	}

	if (!config.home_limits.UPGRADES_ARE_FREE){
		if (!this.items_destroy_multi(items)){
			return {
				ok: 0,
				error: 'missing_mats',
				mats: costs.wall.items,
			};
		}
	}

	var ret = this.home.interior.homes_extend();
	if (!ret){
		return {
			ok: 0,
			error: 'expand_failed',
		};
	}

	return {
		ok: 1,
	};
}

function houses_expand_yard(side){


	//
	// in our backyard?
	//

	if (this.location.tsid == this.home.interior.tsid){

		var costs = this.location.home_get_yard_expansion_costs();
		var context = {
			'type'		: 'expand_backyard',
			'remaining'	: costs.count,
		};

		if (costs.count <= 0){
			return {
				ok: 0,
				error: 'max_size_already',
			};
		}

		if (!config.home_limits.UPGRADES_ARE_FREE){
			if (!this.stats_try_remove_imagination(costs.img_cost, context)){
				return {
					ok: 0,
					error: 'not_enough_img',
				};
			}
		}

		return this.location.home_add_expansion();
	}


	//
	// in our frontyard?
	//

	if (this.location.tsid == this.home.exterior.tsid){

		var costs = this.location.home_get_yard_expansion_costs();
		side = side == 'left' ? 'left' : 'right';

		var side_count = side == 'left' ? costs.count_left : costs.count_right;

		var context = {
			'type'		: 'expand_frontyard',
			'side'		: side,
			'remaining_l'	: costs.count_left,
			'remaining_r'	: costs.count_right,
		};

		if (side_count <= 0){
			return {
				ok: 0,
				error: 'max_size_already',
			};
		}

		if (!config.home_limits.UPGRADES_ARE_FREE){
			if (!this.stats_try_remove_imagination(costs.img_cost, context)){
				return {
					ok: 0,
					error: 'not_enough_img',
				};
			}
		}

		return this.location.home_add_expansion(side);
	}

	return {
		ok: 0,
		error: 'not_at_home',
	};
}

function houses_unexpand(){

	if (!this.home.interior){
		return {
			ok: 0,
			error: 'no_new_house',
		};
	}

	if (this.home.interior.home_has_active_expansion()){
		return {
			ok: 0,
			error: 'busy_adding_floor',
		};
	}

	var costs = this.home.interior.homes_get_expand_costs();

	if (!costs.unexpand.count){
		return {
			ok: 0,
			error: 'no_unexpansions_left',
		};
	}

	var items = [];
	for (var i in costs.unexpand.items){
		if (costs.unexpand.items[i]){
			this.createItem(i, costs.unexpand.items[i]);
		}
	}

	var ret = this.home.interior.homes_unexpand();
	if (!ret){
		return {
			ok: 0,
			error: 'unexpand_failed',
		};
	}

	return {
		ok: 1,
	};
}

function houses_expand_tower(side){

	if (this.location.tsid != this.home.tower.tsid){
		return {
			ok: 0,
			error: 'not_in_tower',
		};
	}

	return this.location.tower_start_expand();
}

function houses_set_tower_floor_name(connect_id, custom_label){

	if (this.location.tsid != this.home.tower.tsid){
		return {
			ok: 0,
			error: 'not_in_tower',
		};
	}

	return this.location.tower_set_floor_name(connect_id, custom_label);
}

function houses_style_choices(){

	if (this.location.tsid != this.home.interior.tsid && this.location.tsid != this.home.exterior.tsid){

		return {
			ok: 0,
			error: 'not_at_home',
		};
	}

	return {
		ok: 1,
		cost: this.house_style_switch_cost(),
		choices: this.location.homes_get_style_choices(!!this.is_god),
	};
}

function house_style_switch_cost(){

	var cost = this.stats_get_level() * 10;
	if (cost < 40) cost = 40;

	return cost;
}

function houses_style_set(t){

	var ret = this.houses_style_choices();
	if (!ret.ok) return ret;

	var choice = ret.choices[t];
	if (!choice){
		return {
			ok: 0,
			error: 'style_not_found',
		};
	}

	// deduct imagination
	var s = '?';
	if (this.location.tsid != this.home.interior.tsid) s = 'interior';
	if (this.location.tsid != this.home.exterior.tsid) s = 'exterior';

	var context = {
		'type'		: 'home_style_switch',
		'street'	: s,
		'from_style'	: this.location.style,
		'to_style'	: t,
	};

	if (!config.home_limits.UPGRADES_ARE_FREE){
		if (!this.stats_try_remove_imagination(this.house_style_switch_cost(), context)){
			return {
				ok: 0,
				error: 'not_enough_img',
			};
		}
	}

	apiLogAction('HOME_STYLE_SWITCH', 'pc='+this.tsid, 'location='+this.location.tsid, 'street_type='+s, 'old_style='+this.location.style, 'new_style='+t);

	// do eeet
	this.location.homes_set_style(t);

	return {
		ok: 1,
	};
}

function houses_reset_for_r2(){

	if (this.home && this.home.exterior){

		if (!this.home.exterior.homes_is_r2()){
			this.home.exterior.homes_scrub_r1();
			this.home.exterior.homes_demo_frontyard();
			this.home.exterior.homes_rebuild_exterior('misc');
		}
	}

	if (this.home && this.home.interior){

		if (!this.home.interior.homes_is_r2()){
			this.home.interior.homes_scrub_r1();
			this.home.interior.homes_demo_backyard();
			this.home.interior.homes_rebuild_rooms('misc');
		}
	}
}

function houses_set_name(name){

	if (this.location.tsid != this.home.interior.tsid && this.location.tsid != this.home.exterior.tsid){

		return {
			ok: 0,
			error: 'not_at_home',
		};
	}

	return this.location.homes_set_name(name);
}

function houses_get_img_rewards(){
	if (!this.home || !this.home.exterior) return 0;

	return this.home.exterior.cultivation_get_img_rewards(this);
}

function houses_reset_img_rewards(){
	if (!this.home || !this.home.exterior) return false;
	return this.home.exterior.cultivation_reset_img_rewards(this);
}

function houses_get_currants_to_collect(){
	if (!this.home || !this.home.interior) return 0;

	var currants = 0;

	var piles_of_currants = this.home.interior.find_items('pile_of_currants');
	for (var i=0; i<piles_of_currants.length; i++){
		currants += intval(piles_of_currants[i].getInstanceProp('balance'));
	}

	var sdbs = this.home.interior.find_items('bag_furniture_sdb');
	for (var i=0; i<sdbs.length; i++){
		currants += intval(sdbs[i].getProp('income'));
	}

	if (this.home_tower){
		piles_of_currants = this.home.tower.find_items('pile_of_currants');
		for (var i=0; i<piles_of_currants.length; i++){
			currants += intval(piles_of_currants[i].getInstanceProp('balance'));
		}

		sdbs = this.home.interior.find_items('bag_furniture_sdb');
		for (var i=0; i<sdbs.length; i++){
			currants += intval(sdbs[i].getProp('income'));
		}
	}

	return currants;
}

function houses_replace_sign_with_rock(){

	if (this.home && this.home.exterior) this.home.exterior.homes_replace_sign_with_rock();

	if (this.home && this.home.interior) this.home.interior.homes_replace_sign_with_rock();
}

function houses_rebuild_from_template(){
	if (this.home && this.home.exterior) this.home.exterior.homes_rebuild_from_template();
	if (this.home && this.home.interior) this.home.interior.homes_rebuild_from_template();
}

function houses_signpost(player_tsid){
	// find player
	var player = apiFindObject(player_tsid);
	if (!player){
		return {
			ok: 0,
			error: 'player_not_found'
		};
	}

	// check blocking
	if (this.buddies_is_ignored_by(player)){
		return {
			ok: 0,
			error: 'blocked'
		};
	}

	// find house
	var house = player.houses_get_external_street();
	if (!house){
		return {
			ok: 0,
			error: 'house_not_found'
		};
	}

	var rsp = {
		ok: 1,
		tsid: player.tsid,
		signposts: []
	};

	// Assume one signpost for now
	var connects = [];
	var neighbors = house.getNeighbors();
	for (var i in neighbors){
		var dest = neighbors[i].houses_get_external_entrance();
		if (!dest) continue;

		connects.push(neighbors[i].make_hash_with_avatar());
	}
	rsp.signposts.push(connects);

	return rsp;
}

function houses_sync_visitors(){

	var num = 0;

	if (this.home){
		if (this.home.exterior){
			this.home.exterior.home_cleanup_visitors();
			num++;
		}
		if (this.home.interior){
			this.home.interior.home_cleanup_visitors();
			num++;
		}
	}

	return num;
}
