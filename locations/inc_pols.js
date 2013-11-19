//
// Owner types:
// undefined or 1: player!
// 2: group/organization
//

function pols_is_for_sale(){

	if (!this.isOwnable) return 0;
	if (this.owner) return 0;

	return 1;
}

function pols_canBuy(pc){

	if (!this.isOwnable){
		return {
			ok: 0,
			error: 'cant_own'
		};
	}

	if (this.owner){
		return {
			ok: 0,
			error: 'owned'
		};
	}

	if (pc.houses_has_house()){
		return {
			ok: 0,
			error: 'has_other'
		};
	}

	if (!pc.stats_has_currants(this.cost)){
		return {
			ok: 0,
			error: 'no_money'
		};
	}
	
	if (!pc.achievements_has('you_have_papers')){
		return {
			ok: 0,
			error: 'no_papers'
		};
	}

	if (this.owner_type == 2){
		return {
			ok: 0,
			error: 'wrong_type'
		};
	}

	return {
		ok: 1
	};

}

function pols_buyHouse(pc){

	//
	// basic checks
	//

	var can = this.pols_canBuy(pc);

	if (!can.ok) return can;


	//
	// now actually buy it
	//

	if (!pc.stats_try_remove_currants(this.cost, {type: 'pol_purchase', pol: this.tsid})){
		pc.sendActivity('Not enough currants!');

		return {
			ok: 0,
			error: 'no_money'
		};
	}

	this.pols_setOwner(pc);

	return {
		ok: 1
	};
}

function pols_setOwner(pc_or_group){
	this.owner = pc_or_group;

	if (pc_or_group.getProp('is_player')){
		pc_or_group.houses_add_property(this.tsid);
		pc_or_group.daily_history_flag('bought_house');
		pc_or_group.achievements_increment('pols', 'bought', 1);
	}
	else{
		this.owner_type = 2;
		pc_or_group.addPol(this);

		//
		// Look for other GOL streets to mark as owned
		//

		var links = this.geo_links_get_outgoing();
		for (var i=0; i<links.length; i++){
			var t = links[i].target;
			if (t && t.pols_get_owner_type() == 2 && t.pols_is_for_sale()){
				t.pols_setOwner(pc_or_group);
			}
		}
	}

	this.purchased_on = time();

	this.pols_sync();
}

function pols_sellHouse(pc, factor){

	factor = factor ? factor : 0.8;

	if (!this.isOwnable){
		return {
			ok: 0,
			error: 'cant_own'
		};
	}

	if (!this.owner){
		return {
			ok: 0,
			error: 'no_owner'
		};
	}

	if (this.owner.tsid != pc.tsid){
		return {
			ok: 0,
			error: 'not_ours'
		};
	}

	if (this.pols_get_owner_type() == 2){
		return {
			ok: 1
		};
	}

	pc.stats_add_currants(Math.floor(this.cost * factor), {'pol':this.tsid});

	pc.houses_remove_property(this.tsid);
	//pc.achievements_increment('pols', 'sold', 1);

	this.acl_keys_remove_all_keys(true);

	this.previous_owner = this.owner;
	this.sold_on = time();
	delete this.owner;

	this.pols_sync();


	//
	// Teleport all players out
	//

	//
	// we want to find the signpost/door within this POL that
	// leads out into the parent street, then use that jump
	// target to teleport the player out.
	//

	var target = this.pols_get_entrance_outside();

	for (var i in this.players){
		var trespasser = this.players[i];
		if (trespasser){
			if (target.tsid){
				trespasser.teleportToLocationDelayed(target.tsid, target.x, target.y);
			}
			else{
				trespasser.apiSetTimer('teleportHome', 5000);
			}
		}
	}


	//
	// Handle objects that need to be deleted/moved
	//
	
	var trophy_cases = this.find_items(function(it){ return it.is_trophycase ? true : false; });
	for (var i in trophy_cases){
		var contents = trophy_cases[i].getContents();
		for (var j in contents){
			if (contents[j] && contents[j].is_trophy){
				var trophy = trophy_cases[i].removeItemStackSlot(j);
				pc.trophies_add_hidden(trophy);
			}
		}
	}
	
	var teachable_classes = [ 'npc_garden_gnome', 'pumpkin_lit_1', 'pumpkin_lit_2', 'pumpkin_lit_3', 'pumpkin_lit_4', 'pumpkin_lit_5'];

	var teachables = this.find_items(function(it, teachable_classes){ return in_array(it.class_tsid, teachable_classes) ? true : false; }, teachable_classes);
	for (var i in teachables){
		teachables[i].owner = null;
	}

	var items_to_restore = [];

	var entrance = this.pols_get_entrance();
	if (pc && entrance && entrance.tsid){
		var entrance_loc = apiFindObject(entrance.tsid);
		if (entrance_loc){
			teachables = entrance_loc.find_items(function(it, args){ return in_array(it.class_tsid, args.teachable_classes) && it.owner == args.pc_tsid ? true : false; }, {teachable_classes: teachable_classes, pc_tsid: pc.tsid});
			for (var i in teachables){
				items_to_restore.push(teachables[i].class_tsid);
				teachables[i].apiDelete();
			}
		}
	}

	var tokens_to_refund = 0;
	var collectible_item_classes = ['gameserver', 'collectors_edition_2010_glitchmas_yeti', 'glitchmas_present', 'greeter_badge', 'bag_greeter_badge', 'trophy_egghunt', 'trophy_street_creator_dirt', 'trophy_street_creator_earth', 'trophy_street_creator_rock', 'trophy_street_creator_wood'];
	for (var i in this.items){
		
		// Collectibles, which should not be deleted!
		if (this.items[i].is_cabinet){
			var contents = this.items[i].getAllContents();
			for (var j in contents){
				if (in_array(contents[j].class_tsid, collectible_item_classes)){
					items_to_restore.push(contents[j].class_tsid);
					contents[j].apiDelete();
				}

				if (contents[j].class_tsid == 'teleportation_script' && contents[j].is_imbued){
					tokens_to_refund++;
					contents[j].apiDelete();
				}
			}
		}
		else if (in_array(this.items[i].class_tsid, collectible_item_classes)){
			items_to_restore.push(this.items[i].class_tsid);
			this.items[i].apiDelete();
		}
		else if (this.items[i].class_tsid == 'teleportation_script' && this.items[i].is_imbued){
			tokens_to_refund++;
			this.items[i].apiDelete();
		}
	}
	
	// Restore items
	for (var i in items_to_restore){
		pc.createItemFromFamiliar(items_to_restore[i], 1);
	}

	// Restore any unspent tokens
	if (tokens_to_refund){
		pc.teleportation_give_tokens(tokens_to_refund, "Imbued Teleportation Script refund");
	}
	

	return {
		ok: 1,
		cash: 0,
	};
}

function pols_canEnter(pc, link_id){

	if (!this.isOwnable) return {ok: 1};


	//
	// is this a group-owned location?
	//

	if (this.owner_type == 2){
		// No owner?
		if (!this.owner){
			// Are we already in an org?
			if (pc.organizations_has()){
				if (link_id){
					pc.familiar_send_targeted({
						'callback'	: 'houses_familiar_has_org',
						'target_tsid'	: link_id
					});
				}

				return {
					ok: 0,
					error: 'has_org'
				};
			}

			// We can buy it
			pc.familiar_send_targeted({
				'callback'	: 'houses_familiar_org_create',
				'target_tsid'	: link_id,
				'loc_tsid'	: this.tsid,
				'cost'		: this.cost
			});

			return {
				ok	: 0,
				code	: 2,
				msg	: 'unowned'
			};
		}

		// Been named?
		if (!this.owner.getProp('has_been_renamed')){
			pc.familiar_send_targeted({
				'callback'	: 'houses_familiar_unnamed_org',
				'target_tsid'	: link_id,
				'loc_tsid'	: this.tsid
			});

			return {
				ok: 0,
				error: 'unnamed'
			};
		}

		// if this is a public street, we may enter
		if (this.is_public) return {ok: 1};

		// Are we a member?
		if (this.owner.is_member(pc)) return {ok: 1};

		// We cannot enter -- private street
		if (link_id){
			pc.familiar_send_targeted({
				'callback'	: 'houses_familiar_private_group',
				'target_tsid'	: link_id,
				'owner'		: this.owner
			});
		}

		return {
			ok: 0,
			error: 'not_member'
		};
	}


	//
	// no current owner?
	//

	if (!this.owner){

		if (config.disable_old_pols){

			pc.sendActivity('This house is no longer accessible');

			return {
				ok	: 0,
				code	: 2,
				msg	: 'unowned',
			};
		}

		if (link_id){
			var can = this.pols_canBuy(pc);
			
			if (!pc.achievements_has('card_carrying_qualification') && pc.getQuestStatus('card_carrying_qualification') == 'none'){
				if (!pc.quests_offer('card_carrying_qualification', true)){
					pc.apiSendMsg({type:"offer_quest_now", quest_id:"card_carrying_qualification"});
				}
				
				return {
					ok: 0,
					error: 'no_card'
				};
			}

			pc.familiar_send_targeted({
				'callback'	: 'houses_familiar_no_owner',
				'target_tsid'	: link_id,
				'can_buy'	: can.ok,
				'error'		: can.error,
				'loc_tsid'	: this.tsid,
				'cost'		: this.cost
			});
		}

		return {
			ok	: 0,
			code	: 2,
			msg	: 'unowned'
		};
	}


	//
	// we own it?
	//

	if (this.owner.tsid == pc.tsid){
		if (this.is_newxp && this.is_public){
			if (link_id){
				pc.familiar_send_targeted({
					'callback'	: 'houses_familiar_newxp_locked',
					'target_tsid'	: link_id
				});
			}

			return {
				ok	: 0,
				code	: 5,
				msg	: 'newxp'
			};
		}
		return {ok: 1};
	}


	//
	// newxp?
	//

	if (this.is_newxp || this.is_postnewxp || this.owner.getQuestStatus('leave_gentle_island') == 'todo'){

		if (link_id){
			pc.familiar_send_targeted({
				'callback'	: 'houses_familiar_newxp_wait',
				'target_tsid'	: link_id
			});
		}

		return {
			ok	: 0,
			code	: 5,
			msg	: 'newxp'
		};
	}

	//
	// if this is a public street, we may enter, as long as we are not blocked by the owner
	//

	if (this.is_public){
		if (this.owner.buddies_is_ignoring(pc)){
			return {ok: 0, code: 4, msg: 'blocked_by_owner'};
		}

		return {ok: 1};
	}

	//
	// we can haz key?
	//
	if (this.acl_keys_player_has_key(pc)){
		if (link_id){
			this.owner.prompts_add({
				txt		: "<b>"+utils.escape(pc.label)+"</b> just entered your house.",
				icon_buttons	: false,
				timeout: 20,
				choices		: [
					{ value : 'ok', label : 'OK' }
				]
			});
		}

		return {ok: 1};
	}

	//
	// owner not online
	//

	if (!apiIsPlayerOnline(this.owner.tsid)){

		if (link_id){
			pc.familiar_send_targeted({
				'callback'	: 'houses_familiar_owner_offline',
				'target_tsid'	: link_id,
				'owner'		: this.owner
			});
		}

		return {
			ok	: 0,
			code	: 3,
			msg	: 'owned'
		};
	}


	//
	// owner is online - have they authed already?
	//

	if (this.owner.houses_has_authed(this, pc)){

		return {ok: 1};
	}


	//
	// not yet authed - is the owner home or in the quarter street? if so, send a request
	//

	if (link_id){
		var parent = this.pols_get_parent();

		if (this.owner.houses_is_at_home()){
			pc.familiar_send_targeted({
				'callback'	: 'houses_familiar_knock',
				'target_tsid'	: link_id,
				'loc_tsid'	: this.tsid,
				'owner_tsid'	: this.owner.tsid,
				'requested'	: this.owner.houses_has_requested(this, pc)
			});
		} else {
			pc.familiar_send_targeted({
				'callback'	: 'houses_familiar_owner_not_at_home',
				'target_tsid'	: link_id,
				'owner'		: this.owner
			});
		}
	}

	return {
		ok	: 0,
		code	: 3,
		msg	: 'owned'
	};
}

function pols_kickPlayer(pc){
	var location = pc.get_location();
	if (location.tsid == this.tsid){
		var entrance = this.pols_get_entrance_outside();
	
		pc.teleportToLocationDelayed(entrance.tsid, entrance.x, entrance.y);
	}
}

function pols_kickEveryone(){
	var entrance = this.pols_get_entrance_outside();
	var pcs = this.getAllPlayers();
	for (var i in pcs){
		if (i == this.owner.tsid || pcs[i].is_god || pcs[i].is_help || this.acl_keys_player_has_key(pcs[i])) continue;

		pcs[i].teleportToLocationDelayed(entrance.tsid, entrance.x, entrance.y);
	}
}

function pols_trusteeOnline(exclude_pc){
	if (!this.owner) return false;
	if (this.owner.isOnline() && (!exclude_pc || (exclude_pc.tsid != this.owner.tsid))) return true;

	var keys =  this.acl_keys_get_keys();

	for (var i in keys){
		var key = keys[i];
		if (key.pc.isOnline() && (key.pc.tsid != exclude_pc.tsid)) return true;
	}

	return false;
}

function pols_trusteeIsPresent(exclude_pc){
	if (this.owner.isOnline() && this.owner.location.tsid == this.tsid && (!exclude_pc || (exclude_pc.tsid != this.owner.tsid))) return true;

	var keys =  this.acl_keys_get_keys();

	for (var i in keys){
		var key = keys[i];
		if (key.pc.isOnline() && key.pc.location.tsid == this.tsid (key.pc.tsid != exclude_pc.tsid)) return true;
	}

	return false;
}

function pols_setOwnable(cost, owner_type){

	if (this.isOwnable){
		return {
			ok: 0,
			error: 'already_pol',
		};
	}

	this.isOwnable = true;
	this.cost = cost;
	this.owner_type = (owner_type ? owner_type : 1);

	this.pols_sync();

	return {
		ok: 1,
	};
}

function pols_setCost(cost){

	if (!this.isOwnable){
		return {
			ok: 0,
			error: 'not_a_pol',
		};
	}

	this.cost = cost;
	this.pols_sync();

	return {
		ok: 1,
	};
}

function pols_setNonOwnable(){

	if (!this.isOwnable){
		return {
			ok: 0,
			error: 'not_a_pol',
		};
	}

	if (this.owner){
		return {
			ok: 0,
			error: 'has_owner',
		};
	}

	this.isOwnable = false;
	delete this.owner_type;

	this.pols_sync();

	return {
		ok: 1,
	};
}

function pols_sync(){

	// for now, don't sync group-owned pols
	if (this.owner_type == 2) return false;

	utils.http_get('callbacks/realty_update.php', {
		'tsid' : this.tsid,
	});

	return true;
}


//////////////////////////////////////////////////////////
//
// these 3 functions are used internally to find parent
// rooms & streets. you should not call these from outside
// this class.
//

function pols_get_parent_room(){

	if (this.mapParent){
		return apiFindObject(this.mapParent).pols_get_parent_room();
	}

	return this;
}

function pols_get_parent_street(){

	if (this.is_home && !this.is_public){
		var entrance = this.pols_get_entrance_outside();
		if (!entrance || !entrance.tsid) return null;
		
		return apiFindObject(entrance.tsid);
	}
	else if (this.mapLocation){
		return apiFindObject(this.mapLocation);
	}

	return null;
}

function pols_has_map_location(){

	return this.mapLocation ? 1 : 0;
}

//////////////////////////////////////////////////////////

// does this location belong to a building?
function pols_is_building(){

	var l = this.pols_get_parent_room();

	if (l.pols_has_map_location()){
		return 1;
	}

	return 0;
}

// if this location is part of a building, return its tsid
function pols_get_building_tsid(){

	var l = this.pols_get_parent_room();

	if (l.pols_has_map_location()){
		return l.tsid;
	}

	return null;
}

// is this location a room in a POL?
function pols_is_pol(){

	if (this.pols_is_building() && this.isOwnable) return 1;

	// Support new homes
	if (this.isOwnable && (this.is_home || this.home_id)) return 1;

	return 0;
}

// returns the street on which this building resides
function pols_get_parent(){

	var l = this.pols_get_parent_room();
	return l.pols_get_parent_street();
}

function pols_get_owner(){

	if (!this.isOwnable) return null;

	return this.owner;
}

function pols_get_owner_type(){

	if (!this.isOwnable) return null;

	return this.owner_type ? this.owner_type : 1;
}

function pols_is_owner(pc_or_group){
	var owner = this.pols_get_owner();
	if (owner && owner.tsid == pc_or_group.tsid) return true;
	return false;
}

function pols_get_status(){

	return {
		'label'		: this.label,
		'is_pol'	: this.pols_is_pol(),
		'owner'		: this.isOwnable && this.owner ? this.owner.tsid : null,
		'owner_type': this.owner_type ? this.owner_type : 1,
		'cost'		: this.cost,
		'house_number'	: this.house_number,
		'image'		: this.image,
		'template'	: this.template,
		'desc'		: this.desc,
		'map_pos'	: this.mapPos,
		'map_location'	: this.mapLocation,
		'door_uid'	: this.door_uid,
		'is_public' : this.is_public ? true : false
	};
}

function pols_adjust_price(factor){

	if (this.pols_is_pol()){

		this.cost = Math.floor(this.cost * factor);

		this.pols_sync();
	}
}

function pols_reset(no_delete){

	//
	// go through each item stack in the location
	//

	var stacks = this.items;
	for (var i in stacks){
		var it = stacks[i];

		if (it.class_tsid == 'garden_new'){

			// reset it
			log.info('resetting garden '+it.tsid);
			it.resetGarden();

		}else if (it.replaceWithPatch){

			// replaces it with the right kind of patch
			log.info('killing trant '+it.tsid);
			it.replaceWithPatch();

		}else if (it.class_tsid == 'patch_seedling'){

			// replace with a patch
			log.info('resetting seedling '+it.tsid);
			it.onMaxTimePassed();

		}else if (it.class_tsid == 'patch' || it.class_tsid == 'patch_dark'){

			// just leave it
			log.info('ignoring patch '+it.tsid);
		}else if (it.is_trophycase){

			// Return items to the owner
			if (this.owner){
				var contents = it.getAllContents();
				for (var j in contents){
					var s = it.removeItemStackTsid(contents[j].tsid);
					if (s) this.owner.addItemStack(s);
				}
			}

			// Then empty it (just in case)
			it.emptyBag();

		}else if (it.is_cabinet){

			// Empty it
			it.emptyBag();

		}else if (!no_delete){
			log.info('deleteing stack '+it.tsid);
			it.apiDelete();
		}
	}

	if (this.owner){
		this.pols_sellHouse(this.owner, 0);
	}

	return 'ok';
}

function pols_setNumber(n){
	this.house_number = n;
}

function pols_setName(name){
	this.label = name;
}

function pols_setTemplate(tsid){
	this.template = tsid;
}

function pols_setImage(image){
	this.image = image;
}

function pols_setDesc(desc){
	this.desc = desc;
}

function pols_admin_update_info(args){

	if (args.cost) this.cost = args.cost;

	if (args.house_number){
		this.pols_set_number_and_name(args.house_number);
	}

	this.desc = args.desc;

	this.pols_sync();
}

function pols_get_door_uid(){
	var door_uid = this.door_uid;

	if (!door_uid){
		for (var i in config.pol_types){
			if (config.pol_types[i].template_tsid == this.template){
				door_uid = config.pol_types[i].uid;
			}
		}
		if (!door_uid){
			return null;
		}
		this.door_uid = door_uid;
	}

	return door_uid;
}

function pols_get_door_info(){

	var door_uid = this.pols_get_door_uid();

	var door_info = utils.get_pol_config(door_uid);

	return {
		uid	: door_uid,
		img	: door_info.asset_name,
		ext_img	: door_info.ext_img,
	};
}

function pols_get_ext_img_full(){
	var door_uid = this.pols_get_door_uid();

	var door_info = utils.get_pol_config(door_uid);

	return door_info.ext_img_full;
}

// Return the tsid, x, and y for the entrance INTO this house
// Unfortunately, x/y is the location of the door in the inside.
// You probably want pols_get_entrance_outside()
function pols_get_entrance(){
	var links = this.geo_links_get_incoming();
	
	for (var id in links){
		if (links[id].source_type == 'door'){
			return {
				tsid: links[id].street_tsid,
				x: links[id].x,
				y: links[id].y
			};
		}
	}
	
	return {};
}

// Return the tsid, x, and y for the entrance INTO this house where tsid/x/y is OUTSIDE
function pols_get_entrance_outside(){
	var links = this.geo_links_get_outgoing();
	for (var l in links){
		if (links.length == 1 || (links[l].deco_class && links[l].deco_class.indexOf('entrance') >= 0) || (links[l].door_id && links[l].door_id == 'door_out')){
			return {
				tsid: links[l].tsid,
				x: links[l].x,
				y: links[l].y
			};
		}
	}

	return {};
}

function pols_setDoorUid(door_uid){

	this.door_uid = door_uid;
}

function pols_find_exit(){
	var exit_link = {};

	var links = this.geo_links_get_all_doors();
	for (var i=0; i<links.length; i++){
		if (links.length == 1 || links[i].deco_class.indexOf('entrance') >= 0){
			exit_link = links[i];
			break;
		}
	}

	if (!exit_link || !exit_link.type){
		var links = this.geo_links_get_all_signposts();
		for (var i=0; i<links.length; i++){
			if (links.length == 1){
				exit_link = links[i];
				break;
			}
		}
	}

	return exit_link;
}

function pols_reclone(){
	
	//
	// find the point on the street that the POL links to
	// hopefully it's the only link out!
	//

	var exit_link = this.pols_find_exit();

	if (!exit_link.tsid){
		return {
			ok: 0,
			error: 'no_parent_street_set',
		};
	}

	var parent = apiFindObject(exit_link.tsid);
	if (!parent){
		return {
			ok: 0,
			error: 'parent_not_found',
		};
	}

	return parent.pols_write_replace(this.tsid);
}

function pols_set_number_and_name(number){

	this.house_number = number;

	var parent = apiFindObject(this.mapLocation);

	if (parent){
		var label = this.house_number + ' ' + parent.label;

		this.label = label;
		this.geometry.label = label;

		this.pols_sync();
	}
}


function pols_verify_door(){

	var parent = apiFindObject(this.mapLocation);
	var doors = parent.getClientGeometry().layers.middleground.doors;

	var deco = '?';

	for (var i in doors){
		var door = doors[i];
		if (door.connect.street_tsid == this.tsid){
			deco = door.deco.sprite_class;
		}
	}

	return [this.door_uid, deco];
}


function pols_check_door_asset(){

	var ret = this.pols_verify_door();

	var uid = ret[0];
	var uid_deco = utils.get_pol_config(uid).asset_name;

	var door_deco = ret[1];
	var door_uid = '?';

	for (var i in config.pol_types){
		if (config.pol_types[i].asset_name == door_deco){
			door_uid = config.pol_types[i].uid;
		}
	}

	if (uid_deco == door_deco){
		return { ok:1, };
	}

	if (door_uid != '?'){
		this.door_uid = door_uid;
	}

	return {
		ok: 0,
		error: "ERR was "+uid+", should be "+door_uid,
	};
}

function pols_get_profile_info(){

	var ret = {
		tsid	: this.tsid,
		house	: this.label,
	};

	if (this.is_home){
		ret.home = this.homes_get_info();
		ret.entry = this.admin_geo_get_entrypoint();
	}

	return ret;
}


//
// this method is call on the parent street to remove a pol instance
//

function pols_delete(pol){

	//
	// find the door to the POL first
	//

	var door_id = null;
	for (var i in this.geometry.layers.middleground.doors){
		var door = this.geometry.layers.middleground.doors[i];
		if (door.connect && door.connect.target && door.connect.target.tsid == pol.tsid){
			door_id = i;
		}
	}


	//
	// if we found a door, remove it
	//

	if (door_id){
		delete this.geometry.layers.middleground.doors[door_id];
	}

	this.geo_links_remove_source(pol.tsid);


	//
	// make it delete-able
	//

	pol.geo_links_clear_sources();
	pol.geo_clear_doors();
	pol.evacuatePlayers();


	//
	// delete it
	//

	var ret = pol.admin_delete();

	this.pols_sync();

	return ret;
}


//
// called from the owning quarter street to configure
// quarter POLs
//

function pols_quarter_settings(args){

	this.quarter_template_uid = args.template_uid;
	this.quarter_tsid = args.quarter_tsid;	

	// naming
	this.floor_number = args.pols_floor;
	var num = this.house_number;
	num = ''+num;
	while (num.length < 2) num = '0'+num;

	var name = ''+args.pols_label;
	var name = name.replace('##', num);

	this.pols_setName(name);
	this.pols_sync();

	// map data
	this.mapLocation = args.exit_tsid;
	this.mapPos = args.exit_pos;
	this.mapChildren = {};
}

function pols_delete_if_unowned(){
	var status = this.pols_get_status();
	if (status.owner) return 0;

	var parent = apiFindObject(status.map_location);
	if (!parent) return 0;

	parent.pols_delete(this);
	return 1;
}

// Is this a new-style home?
function pols_is_home(){
	return (this.is_home || this.door_uid == 'home_interior' || this.door_uid == 'home_exterior') ? true : false;
}

function pack_moving_boxes(type){
	if (!this.owner && !this.previous_owner) return;

	var loop_count = 0;
	if (this.containsPackableItems()){
		var owner = this.owner;
		if (!owner) owner = this.previous_owner;
		if (!owner) return;

		if (owner.houses_is_our_home(this.tsid)) return;

		do {
			var sub_type = type;

			if (type == 'interior'){
				for (var i = this.houses_num_floors(); i>0; i--){
					sub_type = 'inside_'+i;
					pt = this.geo_get_teleport_point();
					box = this.createAndReturnItem('bag_moving_box', 1, intval(pt.x)-200, intval(pt.y), 0);
					if (this.houses_num_floors() > 1){
						if (i == 1){
							box.setProp('label', box.getProp('label')+' from the 1st floor of '+this.getInfo().label);
						}
						else{
							box.setProp('label', box.getProp('label')+' from the 2nd floor of '+this.getInfo().label);
						}
					}
					else{
						sub_type = 'inside';
						box.setProp('label', box.getProp('label')+' from inside of '+this.getInfo().label);
					}
					box.setProp('location_type', sub_type);
					box.consume(sub_type);

					if (box.countContents()){
						box.setProp('is_packed', true);
						box.setProp('owner', owner.tsid);
						box.apiSetTimerX('store', 30*1000, owner);
					}
					else{
						box.apiDelete();
					}
				}

				sub_type = 'backyard';

				pt = this.geo_get_teleport_point();
				var box2 = this.createAndReturnItem('bag_moving_box', 1, intval(pt.x)-200, intval(pt.y), 0);
				box2.setProp('label', box2.getProp('label')+' from the backyard of '+this.getInfo().label);
				box2.setProp('location_type', sub_type);
				box2.consume(sub_type);

				if (box2.countContents()){
					box2.setProp('is_packed', true);
					box2.setProp('owner', owner.tsid);
					box2.apiSetTimerX('store', 30*1000, owner);
				}
				else{
					box2.apiDelete();
				}
			}
			else{
				var pt = this.geo_get_teleport_point();
				var box = this.createAndReturnItem('bag_moving_box', 1, intval(pt.x)-200, intval(pt.y), 0);
				box.setProp('label', box.getProp('label')+' from '+this.getInfo().label);
				box.setProp('location_type', sub_type);
				box.consume(sub_type);

				if (type == 'old'){
					var teachable_classes = [ 'npc_garden_gnome', 'pumpkin_lit_1', 'pumpkin_lit_2', 'pumpkin_lit_3', 'pumpkin_lit_4', 'pumpkin_lit_5'];

					var entrance = this.pols_get_entrance_outside();
					if (entrance && entrance.tsid){
						var entrance_loc = apiFindObject(entrance.tsid);
						if (entrance_loc){
							var teachables = entrance_loc.find_items(function(it, args){ return in_array(it.class_tsid, args.teachable_classes) && it.owner == args.pc_tsid ? true : false; }, {teachable_classes: teachable_classes, pc_tsid: this.owner.tsid});
							for (var i in teachables){
								if (teachables[i]) box.addItemStack(teachables[i]);
							}
						}
					}
				}

				if (box.countContents()){
					log.info(this+' packed new moving box: '+box);
					box.setProp('is_packed', true);
					box.setProp('owner', owner.tsid);
					box.apiSetTimerX('store', 30*1000, owner);
				}
				else{
					box.apiDelete();
				}
			}

			loop_count++;
		} while (this.containsPackableItems() && loop_count < 100);
	}
}

function containsPackableItems(){
	var population = 0;
	var is_packable = function(it){
		if (it.itemIsPackable()){
			population++;
		}
	};
	this.items.apiIterate(is_packable);

	return population;
}


//
// these functions are used to clone master platforms for POL style templates
//

function admin_pol_clone_geo_from(args){
	return this.pol_clone_geo_from(args.template_tsid);
}

function pol_get_template_geo(){

	var mg = this.geometry.layers.middleground;

	return {
		platform_lines: utils.apiCopyHash(mg.platform_lines),
		signposts: utils.apiCopyHash(mg.signposts),
	};
}

function pol_clone_geo_from(template_tsid){

	var template = apiFindObject(template_tsid);
	if (!template){
		return {
			ok: 0,
			error: 'template_not_found',
		};
	}

	var geo = template.pol_get_template_geo();

	var mg = this.geometry.layers.middleground;

	mg.platform_lines = geo.platform_lines;
	mg.signposts = geo.signposts;

	this.apiGeometryUpdated();

	return {
		ok: 1,
	};
}
