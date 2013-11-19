
function adminSetLocation(loc){

log.info('arg', loc);

	var location = apiFindObject(loc.tsid);

	if (!location){
		return 0;
	}

	location.apiMoveIn(this, loc.x, loc.y);

	log.info('moved player');
	return 1;
}

function adminSendActivity(arg){
	this.sendActivity(arg.msg);
}

function adminTeleport(arg){
	//if (!this.is_god) return {ok: 0, error: "You're not allowed to do that."};

	if (arg.sudo_make_me_an_instance){
		var instance = this.instances_create('admin_teleport_'+arg.tsid, arg.tsid, {preserve_links: true});
		this.instances_enter('admin_teleport_'+arg.tsid, arg.x, arg.y);

		return {
			'ok' : 1,
			'was_online' : 1,
			'is_queued': 1
		};

	}

	if (arg.really_the_freaking_template && arg.really_the_freaking_template == "0") arg.really_the_freaking_template = false;
	var ignore_instance_me = arg.really_the_freaking_template ? true : false;
	return this.teleportToLocation(arg.tsid, arg.x, arg.y, {'ignore_instance_me': ignore_instance_me});
}

function adminLocationTeleport(arg){
	if (arg.is_token && this.teleportation_get_token_balance()){
		return this.teleportation_map_teleport(arg.dst, true);
	}
	else{
		return {ok: 0, error: 'Whaaaaa????'};
	}
}

function adminLogout(arg){
	return this.apiLogout();
}

function adminGetBuddyTsids(arg){

	var out = [];

	for (var i in this.friends){
		if (i != 'reverse'){
			for (var j in this.friends[i].pcs){
				out.push(j);
			}
		}
	}

	return out;
}

function adminAddBuddyToGroup(args){

	return this.addToBuddyGroup(args.group_id, args.player_tsid, args.ignore_limit, args.skip_notify);
}

function adminRemoveBuddy(args){

	return this.removeBuddy(args.player_tsid);
}

function adminBuddiesAddIgnore(args){
	var pc = getPlayer(args.player_tsid);
	if (!pc) return 'invalid_player';

	this.buddies_add_ignore(pc);
	
	return 'ok';
}

function adminBuddiesRemoveIgnore(args){
	var pc = getPlayer(args.player_tsid);
	if (!pc) return 'invalid_player';
	
	this.buddies_remove_ignore(pc);
	
	return 'ok';
}

function adminBuddiesHasMax(args){
	var out = {};
	out.has_max = this.buddiesHasMax();
	if (out.has_max){
		out.reverse_buddies = this.buddies_get_reverse_tsids();
	}
	return out;
}

function adminIsBuddy(args){

	return this.getBuddyGroup(args.tsid) ? 1 : 0;
}


function adminHasBagSpace(args){
	var stack = false;;
	if (args && args.stack_tsid){
		stack = apiFindObject(args.stack_tsid);
	}
	return this.isBagFull(stack) ? 0 : 1;
}

function adminExec(args){
	try {
		return eval(args.code);
	}
	catch (e){
		log.error('Exception during ADMIN_CALL eval', args, e);
	}
}


//
// this is a function for executing code and returning
// something afterwards. an array of statements to execute
// is sent and we return the value of the last one.
//

function adminExecMulti(args){
	try {
		//log.info('adminExecMulti()');
		var len = args.code.length;
		for (var i=0; i<len; i++){
			//log.info('LINE '+i+': '+args.code[i]);
			if (i == len-1){
				var ret = null;
				eval('ret = '+args.code[i]);
				return {ok: 1, ret: ret};
			}else{
				eval(args.code[i]);
			}
		}
	}
	catch (e){
		log.error('Exception during ADMIN_CALL eval return', args, e);
		return { ok: 0, e: e};
	}
}

function adminDebugSkills(){
	this.adminGetSkills();
	return apiGetIOOps();
}

function adminGetProfile(args){
	
	this.init();

	var out = {};

	//
	// online?
	//

	out.is_online = apiIsPlayerOnline(this.tsid);


	//
	// core stats
	//

	out.stats = this.stats_get();


	//
	// contact status
	//

	out.is_me = 0;
	out.is_contact = 0;
	out.is_rev_contact = 0;
	out.is_ignoring = 0;
	out.is_ignored_by = 0;

	if (args.viewer_tsid){


		//
		// do we count the viewer as a contact
		//

		var ret = this.getBuddyGroup(args.viewer_tsid);
		if (ret != null){
			out.is_contact = 1;
			out.contact_group = ret;
		}


		//
		// does the viewer count us as a contact
		//

		var viewer = apiFindObject(args.viewer_tsid);
		var ret = viewer ? viewer.getBuddyGroup(this.tsid) : null;
		if (ret != null){
			out.is_rev_contact = 1;
			out.rev_contact_group = ret;
		}
		
		
		//
		// are we ignoring the viewer/are they ignoring us?
		//
		
		out.is_ignoring = viewer && this.buddies_is_ignoring(viewer) ? true : false;
		out.is_ignored_by = viewer && this.buddies_is_ignored_by(viewer) ? true : false;


		//
		// Hellooooo? Is it me you're looking forrrrr?
		//

		if (args.viewer_tsid == this.tsid){
			out.is_me = 1;
		}
	}


	//
	// everything else
	//

	if (!args.skip_inventory) out.inventory = this.profile_get_inventory();

	if (!args.skip_skills){
		out.skills = this.skills_get_list();
		out.skills_learning = this.skills_get_learning();
		out.can_unlearn = this.imagination_has_upgrade('unlearning_ability');
	}

	if (!args.skip_groups) out.groups = this.profile_get_groups(out.is_me);

	if (!args.skip_metabolics) out.metabolics = this.profile_get_metabolics();

	if (!args.skip_buddies){
		if (!args.limit_buddies){
			this.buddies_init();
			out.friends = this.buddies_get_login(1000);
			out.ignoring = this.buddies_get_ignoring_login();
		} else {
			out.friends = this.buddies_get_random_slice(args.limit_buddies);
		}
	}

	if (!args.skip_achievements) out.achievements = this.achievements_get_profile();

	out.location = {
		'name' : this.location.label,
		'tsid' : this.location.tsid,
		'x' : this.x,
		'y' : this.y,
		'is_hidden' : this.location.is_hidden(),
	};

	out.a2 = this.avatar_hash();

	out.houses = this.profile_get_houses();
	out.home_street = this.profile_get_home_street();

	out.has_done_intro = this.has_done_intro ? 1 : 0;
	out.new_player_goodbye_familiar = this.has_done_intro ? 1 : 0;
	
	//
	// Moderation flgs
	//
	
	out.is_in_timeout = this.isInTimeout();
	out.is_in_coneofsilence = this.isInConeOfSilence();
	out.is_in_help_coneofsilence = this.isInConeOfSilence('help');

	if (!args.skip_upgrades){
		out.upgrades = this.admin_imagination_latest_upgrades(args);
		out.upgrades_total = this.admin_imagination_count_upgrades();
	}

	return out;
}

//
// this feeds the players.fullInfo() API method
//
function adminGetFullInfo(args){
	
	this.init();
	
	var out = {};

	//
	// online?
	//

	out.is_online = apiIsPlayerOnline(this.tsid);

	if (out.is_online){
		out.last_online = 0;
	} else {
		out.last_online = this.date_last_logout;
	}

	//
	// core stats
	//

	out.stats = this.stats_get();

	//
	// contact status
	//

	out.is_me = false;
	out.is_contact = false;
	out.is_rev_contact = false;
	out.can_contact = false;

	if (args.viewer_tsid){

		//
		// do we count the viewer as a contact
		//

		var ret = this.getBuddyGroup(args.viewer_tsid);
		if (ret != null){
			out.is_contact = true;
			out.contact_group = ret;
		}

		//
		// does the viewer count us as a contact
		//

		var viewer = apiFindObject(args.viewer_tsid);
		var ret = viewer ? viewer.getBuddyGroup(this.tsid) : null;
		if (ret != null){
			out.is_rev_contact = true;
			out.rev_contact_group = ret;
		}

		//
		// can this viewer make this player a contact?
		// (For now, this boils down to "is there an ignore in place?")
		//

		out.can_contact = (viewer && this.buddies_is_ignoring(viewer)) || (viewer && this.buddies_is_ignored_by(viewer)) || (args.viewer_tsid == this.tsid) ? false : true;

		//
		// Iiii'm looking at the man inthemirror...
		//
		if (args.viewer_tsid == this.tsid){
			out.is_me = true;
		}
	}

	//
	// everything else
	//
	out.num_skills = this.skillsGetCount();

	var skill = this.skillsGetLatest();

	out.latest_skill = {};

	if (typeof(skill) != 'undefined'){
		out.latest_skill = {
			'id' : skill.id,
			'name' : this.skills_get_name(skill.id)
		};
	}
	out.num_achievements = this.achievementsGetCount();

	var latest_achievement = this.achievementsGetLatest();

	out.latest_achievement = {};

	if (latest_achievement){
		out.latest_achievement = {
			'id'   : latest_achievement.id,
			'name' : latest_achievement.name,
			'icon_urls' : {
				'swf' : latest_achievement.url_swf,
				'180' : latest_achievement.url_img_180,
				'60'  : latest_achievement.url_img_60,
				'40'  : latest_achievement.url_img_40
			}
		};
	}

	out.num_upgrades = this.imagination_get_list().length;

	out.metabolics = this.profile_get_metabolics();

	out.location = {
		'name' : this.location.label,
		'tsid' : this.location.tsid,
		'x' : this.x,
		'y' : this.y,
		'is_hidden' : this.location.is_hidden(),
		'is_pol' : this.location.pols_is_pol()
	};

	out.houses = this.houses_get_with_streets();

	return out;
}

function adminGetLocationInfo(){
	var is_online = apiIsPlayerOnline(this.tsid);
	var out = {
		is_online: is_online,

		last_online: is_online ? 0 : this.date_last_logout,

		location: {
			'name' : this.location.label,
			'tsid' : this.location.tsid,
			'x' : this.x,
			'y' : this.y,
			'is_hidden' : this.location.is_hidden(),
			'is_pol' : this.location.pols_is_pol()
		},
		houses: this.houses_get_with_streets()
	};

	return out;
}

function adminIsOnline(){
	return apiIsPlayerOnline(this.tsid);
}

function adminHasUnlearningAbility() { 
	return this.imagination_has_upgrade("unlearning_ability");
}

function adminGetSkills(args){
	var is_admin = !!(args && args.is_admin);
	return {
		skills: this.skills_get_all(is_admin),
		skill_queue: this.skills_get_queue(),
		unlearn_queue: this.skills_get_unlearning()
	};
}

function adminSkillsTrain(args){
	return this.skills_train(args.skill_id);
}

function adminSkillsUnlearn(args){
	return this.skills_unlearn(args.skill_id);
}

function adminSkillsCancelUnlearn(args){
	return this.skills_cancel_unlearning(args.skill_id);
}

function adminGetCurrants(args){
	return {
		'currants': this.stats.currants.value,
	};
}

function adminGetGodProfile(args){
	
	this.init();

	var out = {};
	
	//
	// online?
	//

	out.is_online = apiIsPlayerOnline(this.tsid);
	out.date_last_login = this.date_last_login;


	//
	// core stats
	//

	out.stats = this.stats_get();

	if (args.wants && args.wants.max_favor){
		out.stats.favor_points_max = {};

		for (var i in out.stats.favor_points){
			out.stats.favor_points_max[i] = this.stats_get_max_favor(i);
		}
	}

	//
	// metabolics
	//

	out.metabolics = {};

	out.metabolics.energy = {
		'value'	: this.metabolics.energy.value,
		'max'	: this.metabolics.energy.top,
	};

	out.metabolics.mood = {
		'value'	: this.metabolics.mood.value,
		'max'	: this.metabolics.mood.top,
	};
	
	
	//
	// location
	//
	
	out.location = {
		'name' : this.location.label,
		'tsid' : this.location.tsid,
		'x' : this.x,
		'y' : this.y,
	};

	//
	// quests
	//

	if (args.wants && args.wants.quests){
		out.quests = this.quests_get_all();
	}
	
	
	//
	// skills
	//
	
	if (args.wants && args.wants.skills){
		out.skills = this.skills_get_list();
	}

	//
	// recipes
	//

	if (args.wants && args.wants.recipes){
		var recipes = this.making_get_known_recipes();
		
		out.recipes = {};
		
		// this jiggery-pokery orders recipes by the tools used to create them,
		// because that seems a tad more useful than just spewing out a big jumbled list.
		for (var r in recipes){
			var recipe = get_recipe(r);
			
			if (!recipe) continue;

			if (out.recipes[recipe.tool] == undefined){
				out.recipes[recipe.tool] = [];
			}

			out.recipes[recipe.tool][r] = {
				'name'    : recipe.name,
				'skill'   : recipe.skill,
				'outputs' : recipe.outputs,
				'learnt'  : recipe.learnt,
				'when'    : recipes[r],
			}
		}
	}

	//
	// achievements
	//

	if (args.wants && args.wants.achievements){
		out.achievements = this.achievements_get_profile();
		out.achievements_queue = this.achievements_get_queue();
	}

	//
	// buffs
	//

	if (args.wants && args.wants.buffs){
		out.buffs = this.buffs_get_active();
	}


	//
	// upgrades
	//

	out.img_migrated = 0;
	if (this.imagination && this.imagination.converted_at) out.img_migrated = this.imagination.converted_at;

	return out;
}

function adminAddMood(args){
	this.metabolics_add_mood(args.amount);
}

function adminAddEnergy(args){
	this.metabolics_add_energy(args.amount);
}

function adminRemoveMood(args){
	this.metabolics_lose_mood(args.amount);
}

function adminRemoveEnergy(args){
	this.metabolics_lose_energy(args.amount);
}

function adminAddXP(args){
	this.stats_add_xp(args.amount, true, {type: 'god_page'});
}

function adminAddCurrants(args){
	this.stats_add_currants(args.amount);
}

function adminRemoveCurrants(args){
	this.stats_remove_currants(args.amount, {type: 'admin_call'});
}

function adminAddFavorPoints(args){
	this.stats_add_favor_points(args.giant,args.amount,0);
}

function adminRemoveFavorPoints(args){
	this.stats_remove_favor_points(args.giant,args.amount);
}

function adminAddImagination(args){
	this.stats_add_imagination(args.amount, {type: 'god_page'});
}

function adminAddBrainCapacity(args){
	this.skills_increase_brain_capacity(args.amount);
}

function adminAddQuoinMultiplier(args){
	this.stats_increase_quoin_multiplier(args.amount);
}

function admin_get_visited_streets(){
	if (this.achievements) {
		return this.counters.counters.locations_visited;
	} else {
		return {};
	}
}

function adminStreetHistory() {
	var out = {};

	out.streets = this.stats_get_street_history();
	out.pols = this.stats_get_pol_history();

	return out;
}

function admin_get_player_progress() {

	var out = {};

	out.level = this.stats.level;
	out.skills = this.skills_get_list().length;
	out.time_played = this.getTimePlayed();
	out.got_walk_speed1 = this.imagination_has_upgrade("walk_speed_1");
	out.got_walk_speed2 = this.imagination_has_upgrade("walk_speed_2");	
	out.got_jump1 = this.imagination_has_upgrade("jump_1");
	out.got_jump2 = this.imagination_has_upgrade("jump_2");
	out.got_mappery = this.imagination_has_upgrade("mappery");
	out.completed_buy_bag = (this.getQuestStatus("buy_two_bags") == 'done');
	out.completed_leave_gentle_island = (this.getQuestStatus("leave_gentle_island") == 'done');
	out.max_energy = this.metabolics.energy.top;
	out.quoin_multiplier = this.stats_get_quoin_multiplier();
	out.enter_clouds = (this.stats_get_last_street_visit('LIFBFC7TDJ535UL') > 0);
	out.enter_training1 = (this.stats_get_last_street_visit('LIFBLMAVDJ53NP1') > 0);
	out.date_last_login = this.date_last_loggedin;
	out.num_friends = this.buddies_count();

	return out;
}

function admin_test_data(){

	var out = {};

	out.level = this.stats.level;
	out.max_energy = this.metabolics.energy.top;
	out.xp = this.stats.xp.value;
	out.currants = this.stats.currants.value;
	out.favor_points = this.favor_points;
	out.houses = array_keys(this.houses);
	out.quests_todo = {};
	out.quests_complete = {};
	if (this.quests) {
		for (var i in this.quests.done.quests) {
			out.quests_complete[i] = {
				'ts_start' : this.quests.done.quests[i].ts_start,
				'ts_done' : this.quests.done.quests[i].ts_done,
			}
		}
		for (var i in this.quests.todo.quests) {
			out.quests_todo[i] = this.quests.todo.quests[i].ts_start;
		}
	}
	out.achievements = this.achievements.achievements;
	out.inventory = {};
	var inventory = this.getAllContents();
	for (var i in inventory){
		var it = inventory[i];
		if (!it) continue;

		if (!out.inventory[it.class_id]) out.inventory[it.class_id] = 0;
		out.inventory[it.class_id] += it.count;
	}
	out.skills = this.skills ? this.skills.skills : {};
	out.visited_streets = this.counters_get_group_count('locations_visited');
	out.buddies = this.buddies_count();
	out.buddies_rev = this.buddies_reverse_count();
	out.recipes = this.recipes ? array_keys(this.recipes.recipes) : 0;
	out.completed_tutorial = this.has_done_intro ? 1 : 0;
	out.date_last_login = this.date_last_login;	
	out.time_played = this.counters.counters.time_played;
	out.count_ignoring = this.buddies_get_ignoring_count();
	out.count_ignored_by = this.buddies_get_ignored_by_count();

	// get all items in an owned POL and items in cabinets in owned POLs
	
	/*	
	out.house_items = {};
	out.house_cabinet_items = {};
	var houses = this.houses_get_all();

	for (var i in houses) {
		var house = houses[i];
		var items = house.getItems();
		for (var j in items) {
			var item = items[j];
			if (item.isBag()) {
				// this is a container
				var cItems = item.getAllContents();
				if (item.class_tsid.indexOf("cabinet") != -1) {
					// this is a cabinet					
					for (var k in cItems) {
						var cItem = cItems[k];
						if (cItem.isBag()) {
							// this is a container in a cabinet
							out.house_cabinet_items[k] = {"value" : cItem.class_tsid, "count" : cItem.getCount()};
							var cbItems = cItem.getAllContents();
							for (var l in cbItems) {
								out.house_cabinet_items[l] = {"value" : cbItems[l].class_tsid, "count" : cbItems[l].getCount()};
							}
						} else {
							out.house_cabinet_items[k] = {"value" : cItem.class_tsid, "count" : cItem.getCount()};
						}
					}
				} else {
					// a container in a pol
					out.house_items[j] = {"value" : item.class_tsid, "count" : item.getCount()};
					for (var k in cItems) {
						var bItem = cItems[k];
						out.house_items[k] = {"value" : bItem.class_tsid, "count" : bItem.getCount()};
					}
				}
			} else {
				// an item in a pol
				out.house_items[j] = {"value" : item.class_tsid, "count" : item.getCount()};
			}
		}
	}
	*/
	
	if (this.home) {
		out.furniture = {};
		out.furniture.bag = this.furniture_count();
		if (this.home.interior) {			
			var interior_items = this.home.interior.admin_get_items().items;
			out.furniture.interior = num_keys(interior_items);
			out.yard_size = this.home.interior.home_get_yard_size();
		}
		if (this.home.exterior) {
			var exterior_items = this.home.exterior.admin_get_items().items;
			out.furniture.exterior = num_keys(exterior_items);
			var yard_size = this.home.exterior.home_get_yard_size();
			out.street_size_left = yard_size[0];
			out.street_size_right = yard_size[1];
		}
	}

	return out;
}

function admin_reset_skills(){

	this.skills_remove("croppery");
	this.skills_remove("animal_husbandry");
	this.skills_remove("botany");
	this.skills_remove("cheffery");
	this.skills_remove("cocktail_crafting");
	this.skills_remove("herdkeeping");
	this.skills_remove("remote_herdkeeping");
	this.skills_remove("gasmogrification");
	this.skills_remove("spice_milling");
	this.skills_remove("blending");
	this.skills_remove("fruit_changing");
	this.skills_remove("master_chef");
	this.skills_remove("grilling");
	this.skills_remove("saucery");
	this.skills_remove("bubble_tuning");
}

function admin_place_pol(){

	this.familiar_send_alert_now({
		'callback' : 'admin_place_pol_callback',
	});
}

function admin_place_pol_callback(choice, details){

	//
	// give template choices
	//

	if (choice == 'start'){

		var choices = {};
		var c = 1;

		for (var i in config.pol_types){

			choices[c++] = {
				txt	: config.pol_types[i].label,
				value	: 'pick_template_'+config.pol_types[i].uid,
			};
		}

		choices[c++] = {
			txt	: "Cancel",
			value	: 'dismiss',
		};

		return {
			txt: "Choose a POL template to clone:",
			choices: choices,
		};
	}


	//
	// build a street
	//

	if (choice.substr(0, 14) == 'pick_template_'){

		var idx = choice.substr(14);
		var pol = utils.get_pol_config(idx);

		var ret = this.location.pols_write_create(pol.template_tsid, this.x, this.y, pol.uid, true);

		if (ret.ok){

			return {
				txt: "OK! A POL has been created right where you're standing. Reload the client to show it.",
				done: true,
			};
		}else{

			return {
				txt: "Error creating POL: "+ret.error,
				done: true,
			};
		}
	}


	//
	// cancel
	//

	return {
		done: true,
	};
}

function admin_test_teleporting(){

	//
	// try and find a remote location...
	//
	var street = this.admin_get_remote_location();

	if (street){
		this.sendActivity("found a remote street: "+street.tsid);
	}else{
		this.sendActivity("can't find a remote street");
		return;
	}

	this.sendActivity('pre-teleport');
	this.teleportToLocation(street.tsid, 0, 0);
	this.sendActivity('post-teleport');
}

function admin_get_remote_location(){

	for (var mote_id in config.data_maps.streets){
		for (var hub_id in config.data_maps.streets[mote_id]){
			for (var tsid in config.data_maps.streets[mote_id][hub_id]){

				var street = apiFindObject(tsid);
				if (street.isRemote) return street;
			}
		}
	}

	return null;
}

function admin_get_leaderboards(){

	if (!config.is_dev && (this.is_god || this.is_help || this.tsid == 'PCRFDQOCKNS1LIS')) return {};

	var out = {
		'players': {
			'xp'		: this.stats_get_xp(),
			'currants'	: this.stats_get_currants(),
			'locations'	: this.counters_get_group_count('locations_visited'),
			'achievements'	: this.achievements_get_leaderboard_count(),
			'quests'	: this.quests_get_complete_count(),
		}
	};
	
	return out;
}

function admin_get_inventory(){

	return make_bag(this);
}

function admin_get_inventory_cabinets(){
	var out = {};

	//
	// If they have one, find their cabinet - it's attached to the house,
	// so walk through houses, then sort through house contents and if we
	// find a cabinet, load it.
	//

	out['cabinets'] = [];
	if (this.houses){
		for (var house_tsid in this.houses){
			var house = apiFindObject(house_tsid);
			var items = house.admin_get_items();

			for (var item_tsid in items.items){
				var item = apiFindObject(item_tsid);
				if (item.is_cabinet){
					out['cabinets'].push({
						class_tsid: item.class_id,
						label: item.getLabel ? item.getLabel() : item.label,
						version: item.version,
						path_tsid: item.path,
						slots: item.capacity,
						items: make_bag(item)
					});
				}
			}
		}
	}
	
	return out;
}

function admin_get_inventory_furniture(){

	var bag = this.furniture_get_bag();

	var contents = bag.getContents();

	var out = make_bag(bag);

	for (var i in contents){
		if (contents[i]){
			var tsid = contents[i].tsid;

			if (contents[i].hasTag('trophy')){
				delete out[tsid];
			} else {
				out[tsid].upgrades = contents[i].getUpgrades(this, true);
			}
		}
	}

	return out;
}

//
// return everything needed for the header
//

function admin_get_stats(){

	var out = {};

	this.stats_get_login(out);

	out.energy = {
		value: this.metabolics.energy.value,
		max: this.metabolics.energy.top,
	};

	out.mood = {
		value: this.metabolics.mood.value,
		max: this.metabolics.mood.top,
	};
	out.mail_unread = this.mail_count_unread();

	return out;
}

function adminDebug(args){
	log.info(args);
	return args;
}

function adminCheckDoneIntro(args){
	if (!this.has_done_intro && (config.force_intro || this.quickstart_needs_player) && (!this.intro_steps || this.intro_steps['new_player_part1']) && this.stats_get_level() < 2 && !this.location.is_newxp && !this.location.is_skillquest){
		this.no_reset_teleport = true;
		this.resetForTesting();
		this.goToNewNewStartingLevel();
		log.info(this+' adminCheckDoneIntro reset because not has_done_intro original');
	}
	else if (!this.has_done_intro && (config.force_intro || this.quickstart_needs_player) && !this.location.is_newxp && !this.location.is_skillquest && this.stats_get_level() < 4){
		this.no_reset_teleport = true;
		this.resetForTesting();
		this.goToNewNewStartingLevel();
		log.info(this+' adminCheckDoneIntro reset because not has_done_intro');
	}
	else if (this.location.isInstance('new_starting')){
		this.no_reset_teleport = true;
		this.resetForTesting();
		this.goToNewNewStartingLevel();
		log.info(this+' adminCheckDoneIntro reset because old newxp');
	}

	var leave_gentle_island_status = this.getQuestStatus('leave_gentle_island');
	return {
		has_done_intro : this.has_done_intro,
		// the following makes the assumption that they cannot have done the leave_gentle_island_status quest if !has_done_intro
		// (but they might not have been given the quest yet, so it might not have a 'todo' status)
		needs_todo_leave_gentle_island: (!this.has_done_intro) ? true : (leave_gentle_island_status == 'todo')
	};
}

function admin_get_location(){
	var info = this.location.getInfo();

	return {
		ok		: 1,
		tsid		: info.tsid,
		label		: info.label,
		moteid		: info.moteid,
		hubid		: info.hubid,
		x		: this.x,
		y		: this.y,
		is_god		: this.is_god,
		is_instance	: info.is_instance,
		is_pol		: info.is_pol,
		logged_in	: this.date_last_login
	};
}

function admin_is_instanced(){
	if (this.location.is_instance){
		var members = this.location.instance.get_members();
		var joined = 0;

		for (var member_tsid in members){
			if (member_tsid == this.tsid){
				joined = members[member_tsid].joined;
			}
		}

		return {
			'is_instanced': 1,
			'joined': joined
		}
	} else {
		return {
			'is_instanced': 0
		}
	}
}

function admin_renamed(args){
	// called after player-initiated rename
	if (args.cost) this.stats_try_remove_currants(args.cost);

	if (this.home){
		var label = utils.escape(this.label)+"'s";
		if (this.home.interior) this.home.interior.setProp('label', label+' House');
		if (this.home.exterior) this.home.exterior.setProp('label', label+' Home Street');
		if (this.home.tower) this.home.tower.tower_set_label(label+' Tower');
	}
	
	if (apiIsPlayerOnline(this.tsid)) {
		this.apiSendMsg({
			type: 'pc_rename',
			pc: this.make_hash()
		});
	}
	
}

function adminGetItemDescExtras(args){
	if (!args || !args.class_id) return {};
	
	var proto = apiFindItemPrototype(args.class_id);
	if (!proto || !proto.getDescExtras) return {};
	
	return proto.getDescExtras(this);
}

function adminGetGodExtras(args){
	return {
		is_in_timeout: this.isInTimeout(),
		is_in_coneofsilence: this.isInConeOfSilence(),
		is_in_help_coneofsilence: this.isInConeOfSilence('help'),
		img_migrated: (this.imagination && this.imagination.converted_at) ? this.imagination.converted_at : 0,
		is_online: apiIsPlayerOnline(this.tsid),
	};
}

function adminBuildPath(args){
	var dst = args.dst;
	
	var ret = this.buildPath(dst);
	if (!ret.ok){
		return ret;
	}
	
	var rsp = {
		type: 'get_path_to_location',
		path_info: ret.path
	};

	this.apiSendMsg(rsp);

	return {ok: 1};
}

function adminSetTeleportationTokens(args){
	this.teleportation_init();
	this.teleportation.token_balance = intval(args.tokens);
	this.teleportation_notify_client();
	return {ok: 1};
}

function adminSetCredits(args){
	this.stats_init();
	this.stats_set_credits(args.credits);
	return {ok: 1};
}

function adminSetSubscriptionStatus(args){
	this.stats_init();
	this.stats_set_sub(args.is_subscriber, args.sub_expires);
	return {ok: 1};
}

function admin_get_greeting_data(args){
	var out = {};

	out.greeted = this.greeted ? this.greeted : {};
	out.greeting = this.greeting ? this.greeting : {};

	return out;
}

function admin_get_named_animals(){

	var out = {};

	if (this.animals_named){
		for (var i in this.animals_named){

			var row = utils.apiCopyHash(this.animals_named[i]);

			var item = null;
			if (row.tsid) item = apiFindObject(row.tsid);
			if (item) row.current = item.getNameInfo();

			out[i] = row;
		}
	}

	return out;
}

function admin_fix_quest_containers(){
	var fixed = 0;
	for (var i in this.quests.todo.quests){
		//log.info(this+' admin_fix_quest_containers checking '+i);
		var q = this.quests.todo.quests[i];
		if (q.isDone(this)){
			//log.info(this+' admin_fix_quest_containers '+i+' is done. Unflagging.');
			// Flag it as incomplete so it can get turned in on next login
			q.setProp('is_complete', false);
			fixed++;
		}
		else{
			//log.info(this+' admin_fix_quest_containers '+i+' is not done.');
		}
	}

	return {
		fixed: fixed
	};
}

function admin_mail_has_unread(args){
	return { 'ok': 1, 'has_unread_mail': this.mail_has_unread() };
}

function admin_mail_get_count(args){
	return { 'ok': 1, 'message_count': this.mail_count_messages() };
}

function admin_mail_unread_count(args){
	return { 'ok': 1, 'unread_count': this.mail_count_unread() };
}

function admin_mail_get_inbox(args){
	return {
		'ok'		: 1, 
		'inbox'		: args.fetch_all ? this.build_mail_check_msg(null, null, true) : this.build_mail_check_msg(null),
		'unread_count'	: this.mail_count_unread(),
		'replied_count'	: this.mail_count_replied(),
	};
}

function admin_mail_get_message(args){
	var message = this.mail_get_player_message_data(args.msg_id);
	
	if (!args.keep_read_status) this.mail_read(args.msg_id, args.mark_as_read);

	if (!message) return {'ok': 1, 'message_not_found' : 1};
	if (message.sender_tsid) {
		var sender_pc = getPlayer(message.sender_tsid);
		message.sender_label = sender_pc.label;
		message.sender_avatar = sender_pc.avatar_get_singles();
	}

	return { 'ok': 1, 'message' : message };
}

function admin_mail_delete_message(args){
	this.mail_remove_player_message(args.msg_id);
	return { 'ok': 1 };
}

function admin_mail_send(args){

	var delay = config.mail_delivery_time;
	var cost = 2;

	// Remove currents for shipping costs
	var sender_pc = getPlayer(args.sender_tsid);
	sender_pc.stats_remove_currants(cost, {type: 'mail_send', in_reply_to: args.in_reply_to, to: this.tsid});

	if (args.in_reply_to) {
		args.in_reply_to = sender_pc.mail_get_player_reply(args.in_reply_to);
	} else if (args.in_reply_to_payload) {
		args.in_reply_to = args.in_reply_to_payload;
	}
	
	log.info("MAIL: admin_mail_send");
	this.mail_add_player_delivery(null, args.sender_tsid, 0, args.message, delay, true, args.in_reply_to);
	
	return { 'ok': 1 };
}

function adminGetHomepage(args){

	this.init();
	
	var out = {};

	//
	// structured data
	//

	out.stats = this.stats_get();
	out.skills_learning = this.skills_get_learning();
	out.friends = this.buddies_get_simple_online();

	// flags
	out.has_done_intro = !!this.has_done_intro;
	out.new_player_goodbye_familiar = !!this.has_done_intro;
	out.is_in_timeout = this.isInTimeout();
	out.is_in_coneofsilence = this.isInConeOfSilence();
	out.is_in_help_coneofsilence = this.isInConeOfSilence('help');

	return out;
}

function adminGetProfileFriends(args){

	var out = {};
	out.friends = this.buddies_get_simple_online();

	return out;
}

function adminCleanLostHiddenItems(){
	var hidden = this.hiddenItems;

	var currants = 0;
	var item_count = 0;

	for (var i in hidden){
		var stack = hidden[i];
		if (!stack.is_bag && !this.auctions_get_uid_for_item(stack.tsid)){
			this.mail_add_auction_delivery(stack.tsid, config.auction_delivery_time, null, this.tsid, 'expired');
		}
	}
}

function adminCountLostHiddenItems(){
	var hidden = this.hiddenItems;

	var currants = 0;
	var item_count = 0;

	for (var i in hidden){
		if (!hidden[i].is_bag && !this.auctions_get_uid_for_item(hidden[i].tsid)){
			currants += intval(Math.round(hidden[i].base_cost * hidden[i].count * 0.9));
			item_count++;
		}
	}

	return item_count+' items worth a calculated '+currants+' currants';
}

function admin_fix_elixir_of_avarice(){
	if (this.achievements_has('numismatizer_leprechaun_class')) this.making_try_learn_recipe(241);
}

function admin_create_new_home(){
	this.houses_go_to_new_house(false, true, false);
}

function admin_craftytasking_robot_category_items(args){
	var crafty_bot = null;
	if (this.crafty_bot && this.crafty_bot.tsid){
		crafty_bot = apiFindObject(this.crafty_bot.tsid);
	}
	
	if (!crafty_bot) return {'ok':0, 'error':-200, 'error_desc': 'This player does not have a Crafty-bot'};

	var status = {'ok': 1};

	status.data = utils.craftytasking_category_items(crafty_bot, args.category);
	
	return status;
}

function admin_craftytasking_robot_sequenceSteps(args){
	
	var crafty_bot = null;
	if (this.crafty_bot && this.crafty_bot.tsid){
		crafty_bot = apiFindObject(this.crafty_bot.tsid);
	}
	
	if (!crafty_bot) return {'ok':0, 'error':-200, 'error_desc': 'This player does not have a Crafty-bot'};

	var status = {'ok': 1};
		
	status.sequence = utils.craftytasking_build_sequence(crafty_bot, utils.craftytasking_get_static_build_spec(args.class_tsid), args.count);
	
	return status;
}

function admin_craftytasking_robot_queueAdd(args){
	
	var crafty_bot = null;
	if (this.crafty_bot && this.crafty_bot.tsid){
		crafty_bot = apiFindObject(this.crafty_bot.tsid);
	}
	
	if (!crafty_bot) return {'ok':0, 'error':-200, 'error_desc': 'This player does not have a Crafty-bot'};

	return crafty_bot.queueAdd(args.class_tsid, args.count);
}

function admin_craftytasking_robot_queueRemove(args){
	
	var crafty_bot = null;
	if (this.crafty_bot && this.crafty_bot.tsid){
		crafty_bot = apiFindObject(this.crafty_bot.tsid);
	}
	
	if (!crafty_bot) return {'ok':0, 'error':-200, 'error_desc': 'This player does not have a Crafty-bot'};

	return crafty_bot.queueRemove(args.class_tsid, args.count);
}

function admin_craftytasking_robot_get_status(args){
	var crafty_bot = null;
	if (this.crafty_bot && this.crafty_bot.tsid){
		crafty_bot = apiFindObject(this.crafty_bot.tsid);
	}
	
	if (!crafty_bot) return {'ok':0, 'error':-200, 'error_desc': 'This player does not have a Crafty-bot'};

	var status = crafty_bot.getStatus();
	
	status['ok'] = 1;
	
	return status;
}

function admin_craftytasking_robot_stop(args){
	var crafty_bot = null;
	if (this.crafty_bot && this.crafty_bot.tsid){
		crafty_bot = apiFindObject(this.crafty_bot.tsid);
	}
	
	if (!crafty_bot) return {'ok':0, 'error':-200, 'error_desc': 'This player does not have a Crafty-bot'};

	var status = crafty_bot.craftCancel();
	status['ok'] = 1;
	
	return status;
}

function admin_craftytasking_robot_canRefuel(args){
	var crafty_bot = null;
	if (this.crafty_bot && this.crafty_bot.tsid){
		crafty_bot = apiFindObject(this.crafty_bot.tsid);
	}
	
	if (!crafty_bot) return {'ok':0, 'error':-200, 'error_desc': 'This player does not have a Crafty-bot'};

	var status = crafty_bot.canAutoRefuel();
	
	log.info('CAN REFUEL:'+status);
	
	return status;
}

function admin_craftytasking_robot_refuel(args){
	var crafty_bot = null;
	if (this.crafty_bot && this.crafty_bot.tsid){
		crafty_bot = apiFindObject(this.crafty_bot.tsid);
	}
	
	if (!crafty_bot) return {'ok':0, 'error':-200, 'error_desc': 'This player does not have a Crafty-bot'};

	var status = crafty_bot.autoRefuel();
	
	return status;
}

function admin_craftytasking_robot_queue(args){
	var crafty_bot = null;
	if (this.crafty_bot && this.crafty_bot.tsid){
		crafty_bot = apiFindObject(this.crafty_bot.tsid);
	}
	
	if (!crafty_bot) return {'ok':0, 'error':-200, 'error_desc': 'This player does not have a Crafty-bot'};

	var status = {'ok': 1};
	status.active_queue_index = null;
	if (crafty_bot.isCrafting()){
		status.active_queue_index = crafty_bot.getActiveQueueIndex();
	}
	status.queue = [];

	var queue_data = null;
	for (var i=0; i < crafty_bot.queueCount(); i++){
		queue_data = crafty_bot.queueIndexStatus(i);
		if (queue_data){
			status.queue.push({
				'class_tsid': queue_data.class_tsid,
				'complete': queue_data.complete,
				'craftable_count': queue_data.craftable_count,
				'queue_count': queue_data.queue_count,
				'completed_count': queue_data.completed_count,
				'ingredients': queue_data.ingredients,
				'missing_ingredients': queue_data.missing_ingredients,
				'tools': queue_data.tools,
				'missing_tools': queue_data.missing_tools,
			});
		}
	}
	
	return status;
}

function admin_craftytasking_robot_queueItem(args){
	var crafty_bot = null;
	if (this.crafty_bot && this.crafty_bot.tsid){
		crafty_bot = apiFindObject(this.crafty_bot.tsid);
	}
	
	if (!crafty_bot) return {'ok':0, 'error':-200, 'error_desc': 'This player does not have a Crafty-bot'};

	var queue = crafty_bot.queueGet();
	var queue_item = null;
	var queue_index = 0;
	
	//
	// Get the item queue (and set the queue index)
	//
	if (args.class_id){
		for (var i in queue){
			if (queue[i].class_tsid == args.class_id){
				queue_item = queue[i];
				queue_index = i;
				break;
			}
		}
	}else if (args.queue_index){
		queue_item = queue[intval(args.queue_index)];
		if (!queue_item) return {'ok':0, 'error':-201, 'error_desc': 'Invalid queue index'};
		queue_index = args.queue_index;
	}

	if (!queue_item) return {'ok':0, 'error':-201, 'error_desc': 'Queue item not found'};

	var scoped_queue_item = {};
	scoped_queue_item['ok'] = 1;
	scoped_queue_item.queue_index = intval(queue_index);
	scoped_queue_item.active_queue_index = null;
	scoped_queue_item.active_sequence_index = null;

	if (crafty_bot.isCrafting()){
		scoped_queue_item.active_queue_index = crafty_bot.getActiveQueueIndex();
	}
	if (crafty_bot.active_queue_index == queue_index){
		scoped_queue_item.active_sequence_index = crafty_bot.getActiveSequenceIndex();
	}

	scoped_queue_item.queue_is_active = scoped_queue_item.queue_index == scoped_queue_item.active_queue_index;
	scoped_queue_item.class_tsid = queue_item.class_tsid;
	scoped_queue_item.count = queue_item.count;
	for (var i in queue_item.craft_sequence){
		if (scoped_queue_item.queue_is_active && scoped_queue_item.active_sequence_index != undefined){
			if (!queue_item.craft_sequence[i].can_step){
				queue_item.craft_sequence[i].state = 'skipped';
			}else if (i < scoped_queue_item.active_sequence_index){
				queue_item.craft_sequence[i].state = 'complete';
			}else if (i == scoped_queue_item.active_sequence_index){
				queue_item.craft_sequence[i].state = 'active';
			}else{
				queue_item.craft_sequence[i].state = 'pending';
			}
		}else{
			queue_item.craft_sequence[i].state = 'pending';
		}
	}
	scoped_queue_item.craft_sequence = queue_item.craft_sequence;
	var craft_count = 0;
	if (queue_item.craft_sequence[queue_item.craft_sequence.length-1].data){
		craft_count = queue_item.craft_sequence[queue_item.craft_sequence.length-1].data.count;
	}
	scoped_queue_item.craft_count = craft_count;
		
	return scoped_queue_item;
}

function admin_furniture_populate(){
	this.furniture_populate(false);
}

function admin_photos_state(){
	var ret = {};
	ret.has_snapshotting = this.imagination_has_upgrade('snapshotting');
	return ret;
}

function admin_grant_perftesting_rewards(args){
	this.stats_add_currants(1000, {type: 'perftesting_reward'});

	if (args.test_count == 1){
		this.stats_add_xp(500, 0, {type: 'perftesting_reward'});
	}
}

function admin_recover_moving_boxes(){
	for (var i in this.home_backup){
		var loc = this.home_backup[i];
		if (loc){
			loc.admin_recover_moving_boxes();
		}
	}
}

function admin_pack_more_moving_boxes(){
	if (this.home_backup){
		if (this.home_backup.interior){
			this.home_backup.interior.pack_moving_boxes('interior');
		}

		if (this.home_backup.exterior){
			this.home_backup.exterior.pack_moving_boxes('exterior');
		}
	}

	if (this.houses_backup){
		for (var i in this.houses_backup){
			if (this.houses_is_our_home(i)) continue;

			var pol = apiFindObject(i);
			if (pol){
				pol.pack_moving_boxes();
			}
		}
	}
}

function admin_evacuate_houses(){
	if (this.location.pols_is_pol()){
		if (this.location.getProp('is_home')){
			this.houses_leave();
		}
		else{
			this.teleportHome();
		}
	}
}

function admin_fix_home_door(){
	if (this.home && this.home.exterior){
		return this.home.exterior.admin_fix_home_door();
	}

	return {ok: 1};
}

function admin_remove_deleted_houses(){
	for (var i in this.houses){
		var loc = apiFindObject(i);
		if (!loc) continue;

		if (loc.getProp('is_deleted')){
			if (this.houses_is_our_home(i)){
				delete loc.is_deleted;
			}
			else{
				this.houses_remove_property(i);
			}
		}
	}
}

function admin_replace_home_sign_with_rock(){
	if (this.home && this.home.exterior){
		this.home.exterior.homes_replace_sign_with_rock();
	}

	if (this.home && this.home.interior){
		this.home.interior.homes_replace_sign_with_rock();
	}
}

function adminGetJumpCount(args){
	return this.jump_count;
}

function adminBackfillNewxpPhysics(args){
	if (this.use_img) return;

	this.physics_new = {};
	this.setDefaultPhysics();
	this.use_img = true;

	this.imagination_grant('walk_speed_1', 1, undefined, true, true);
	this.imagination_grant('walk_speed_2', 1, undefined, true, true);
	this.imagination_grant('walk_speed_3', 1, undefined, true, true);
	this.imagination_grant('jump_1', 1, undefined, true, true);
	this.imagination_grant('jump_2', 1, undefined, true, true);
	this.imagination_grant('jump_triple_1', 1, undefined, true, true);
}

function adminResetPlayer(){
	this.resetForTesting(false);
}

function adminBackfillSnapUpgrades(){

	// Grant new snap_pack upgrades, based on what they snapshot upgrades they already had
	if (this.imagination_has_upgrade('snapshottery_filter_piggy') || this.imagination_has_upgrade('snapshottery_filter_beryl') || this.imagination_has_upgrade('snapshottery_filter_firefly')){
		this.imagination_grant('snapshottery_filter_pack_1');
	}
	if (this.imagination_has_upgrade('snapshottery_filter_holga') || this.imagination_has_upgrade('snapshottery_filter_vintage') || this.imagination_has_upgrade('snapshottery_filter_ancient')){
		this.imagination_grant('snapshottery_filter_pack_2');
	}
	if (this.imagination_has_upgrade('snapshottery_filter_dither') || this.imagination_has_upgrade('snapshottery_filter_shift') || this.imagination_has_upgrade('snapshottery_filter_outline')){
		this.imagination_grant('snapshottery_filter_pack_3');
	}
	if (this.imagination_has_upgrade('snapshottery_filter_memphis')){
		this.imagination_grant('snapshottery_basic_filter_pack');
	}
	
	// Delete the out of date upgrades
	this.imagination_delete_upgrade('snapshottery_filter_piggy');
	this.imagination_delete_upgrade('snapshottery_filter_beryl');
	this.imagination_delete_upgrade('snapshottery_filter_firefly');
	this.imagination_delete_upgrade('snapshottery_filter_holga');
	this.imagination_delete_upgrade('snapshottery_filter_vintage');
	this.imagination_delete_upgrade('snapshottery_filter_ancient');
	this.imagination_delete_upgrade('snapshottery_filter_dither');
	this.imagination_delete_upgrade('snapshottery_filter_shift');
	this.imagination_delete_upgrade('snapshottery_filter_outline');
	this.imagination_delete_upgrade('snapshottery_filter_memphis');
	
	// and remove any from their hand
	this.imagination_remove_from_hand('snapshottery_filter_piggy');
	this.imagination_remove_from_hand('snapshottery_filter_beryl');
	this.imagination_remove_from_hand('snapshottery_filter_firefly');
	this.imagination_remove_from_hand('snapshottery_filter_holga');
	this.imagination_remove_from_hand('snapshottery_filter_vintage');
	this.imagination_remove_from_hand('snapshottery_filter_ancient');
	this.imagination_remove_from_hand('snapshottery_filter_dither');
	this.imagination_remove_from_hand('snapshottery_filter_shift');
	this.imagination_remove_from_hand('snapshottery_filter_outline');
	this.imagination_remove_from_hand('snapshottery_filter_memphis');

	// Update the hand (if necessary)
	this.imagination_get_next_upgrades();

	// And reload the hand in the client
	this.apiSendMsg({
		type: 'imagination_hand',
		hand: this.imagination_get_login(),
		is_redeal: true
	});
}


//
// used by lib_friends/friends_get_list()
//

function adminGetFriends(args){

	var out = {
		'fwd' : this.buddies_get_tsids(),
		'rev' : this.buddies_get_reverse_tsids(),
	};

	if (args.fetch_online){
		out.online = apiCallMethodForOnlinePlayers('buddies_get_simple_online_info', out.fwd);
	}

	return out;
}

//
// used by achievement.php to check if you have the achievements shown on the page
//
function adminAchievementsCheckHas(args){
	var out = {};

	for (var i in args.class_tsids){
		var class_tsid = args.class_tsids[i];
		out[class_tsid] = this.achievements_has(class_tsid);
	}

	return out;
}

function adminAchievementsGetAll(args){
	return this.achievements_get_all();
}

function adminAchievementsGetProfile(args){
	return this.achievements_get_profile();
}

function adminQuestsGetStatus(args){
	return this.getQuestStatus(args.quest_id);
}

function adminRoleAdd(args){
	var role_name = 'is_'+args.role;
	this[role_name] = 1;
	return 1;
}

function adminRoleRemove(args){
	var role_name = 'is_'+args.role;
	delete this[role_name];
	return 1;
}

function adminBuffsApply(args){
	return this.buffs_apply(args.buff_id);
}

function adminBuffsRemove(args){
	return this.buffs_remove(args.buff_id);
}

function adminItemsGive(args){
	if (args.item_class == '_currants'){
		this.stats_add_currants(args.count);
	} else {
		this.createItemFromFamiliar(args.item_class, args.count);
	}
}

function adminItemsDestroy(args){
	return this.items_destroy(args.item_class, args.count);
}

function adminQuestsOffer(args){
	return this.quests_offer(args.quest_id, true);
}

function adminQuestsRemove(args){
	return this.quests_remove(args.quest_id);
}

function adminQuestsMadeRecipe(args){
	return this.quests_made_recipe(args.recipe_id, args.count);
}

function adminQuestsIncCounter(args){
	return this.quests_inc_counter(args.counter_name, args.count);
}

function adminQuestsSetFlag(args){
	return this.quests_set_flag(args.flag_name);
}

function adminAchievementsIncrement(args){
	return this.achievements_increment(args.group, args.label, args.count);
}

function adminAchievementsGrant(args){
	return this.achievements_grant(args.achievement_id);
}

function adminAchievementsGrantMulti(args){
	for (var i in args.achievements){
		this.achievements_grant(args.achievements[i]);
	}
}

function adminAchievementsDelete(args){
	return this.achievements_delete(args.achievement_id);
}

function adminSkillsGive(args){
	return this.skills_give(args.skill_id);
}

function adminSkillsRemove(args){
	return this.skills_remove(args.skill_id);
}

function adminSkillsGetUnlearning(args){
	return this.skills_get_unlearning();
}

function adminSkillsCanUnlearn(args){
	return this.skills_can_unlearn(args.skill_id);
}

function adminMakingLearnRecipe(args){
	return this.making_learn_recipe(args.recipe_id);
}

function adminMakingUnlearnRecipe(args){
	return this.making_unlearn_recipe(args.recipe_id);
}

function adminImaginationGrantUpgrade(args){
	return this.imagination_grant(args.upgrade_id, args.amount);
}

function adminImaginationDeleteUpgrade(args){
	return this.imagination_delete_upgrade(args.upgrade_id);
}

function adminGrantFirstEleven(args){
	if (this.skills_get_count() >= 11) this.achievements_grant('first_eleven_skills');
}

function adminRebuildSocialSignpost(args){
	var exterior = this.houses_get_external_street();
	if (exterior){
		exterior.updateNeighborSignpost();
	}
}

function admin_quickstart_flags(){
	return {
		name	: !!this.quickstart_needs_player,
		avatar	: !!this.quickstart_needs_avatar,
		account	: !!this.quickstart_needs_account,
	};
}

function admin_feats_increment(args){
	if (config.is_dev) log.info(this+' admin_feats_increment: '+args);
	return this.feats_increment(args.class_tsid, args.amount);
}

function admin_can_feat(args){
	return {
		quest: this.getQuestStatus('last_pilgrimage_of_esquibeth') == 'done',
		conch: !!this.has_blown_conch
	};
}

function admin_set_flag(args){
	this[args.flag_name] = args.value;
}

function admin_prompts_add_simple(args){
	this.prompts_add_simple(args.txt, intval(args.timeout));
}
