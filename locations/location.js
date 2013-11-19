//#include inc_admin.js
//#include inc_pols.js inc_pols_write.js inc_acl_keys.js
//#include inc_demo.js
//#include inc_geo.js
//#include inc_locked_doors.js
//#include inc_jobs.js
//#include inc_rook.js
//#include inc_upgrades.js
//#include inc_geo_links.js
//#include inc_geo_edit.js
//#include inc_quarters.js
//#include inc_transit.js
//#include inc_race.js
//#include inc_instances.js
//#include inc_regions.js
//#include inc_quests.js
//#include inc_smuggling.js
//#include inc_npcs.js
//#include inc_homes.js
//#include inc_cultivation.js
//#include inc_events.js
//#include inc_geo_builder.js
//#include inc_geo_textures.js
//#include inc_routing.js

function processTimeEvent(){
//	log.info("LOCATION.JS processTimeEvent called");
}

function isInTheAir(x,y){
	var pls = this.geometry.platforms;
	for(var plid in pls){
		var pl= pls[plid];
		if (y===pl.y){
			if(x>pl.x && x<pl.x+pl.w){
				return false;
			}
		}
	}
/*	var lds = this.location.geometry.ladders;
	for(var lid in lds){
		var ld= lds[lid];
		if (this.x===ld.x){
			if(x<ld.y && x>ld.y-ld.h){
				return false;
			}
		}
	}*/
	return true;
}

function updatePlayerOverlayIndicators(pc) {
	// Update us with all player overlay flags in the area.
	var activePlayers = this.getActivePlayers();
	for(var i in activePlayers) {
		activePlayers[i].announce_show_indicators(pc);
	}
	
	// Finally, update all players in the area with our overlay flag.
	pc.announce_show_indicators();
}

var tower_quest_instances = ['tower_quest_desert', 'tower_quest_headspace', 'tower_quest_chamber', 'tower_quest_crystine'];
function onPlayerEnter(pc){
	if (this.isInstance()){
		apiLogAction('race_player_enter', 'pc='+pc.tsid, 'loc='+this.tsid, 'template='+this.instance_of);
	}
	else if (this.pols_is_pol()){
		apiLogAction('PLAYER_ENTER', 'pc='+pc.tsid, 'loc='+this.tsid, 'pol=1', 'template='+this.template, 'is_my_interior='+(pc.houses_get_interior_tsid() == this.tsid ? '1' : '0'), 'is_my_exterior='+(pc.houses_get_external_tsid() == this.tsid ? '1' : '0'));
		this.last_entered_on = time();
		
		if (pc.houses_get_interior_tsid() == this.tsid) { 
			pc.counters_increment("butler_hint_counters", "visited_my_house");
		}
	}
	else if (this.quarter_tsid){
		apiLogAction('PLAYER_ENTER', 'pc='+pc.tsid, 'loc='+this.tsid, 'quarter=1', 'template='+this.template);
	}
	else{
		apiLogAction('PLAYER_ENTER', 'pc='+pc.tsid, 'loc='+this.tsid);
	}

	pc.is_afk = false;

	// Dead, but not in hell?
	if (pc.is_dead && !this.isInHell()){
		log.info(pc+' forcing back to hell');
		pc.teleportToLocationDelayed(config.hell['tsid'], config.hell['x'], config.hell['y']);
	}

	var info = this.getMapInfo();

	var is_instance = this.isInstance();
	var is_pol = this.pols_is_pol();
	var is_quarter = this.quarter_tsid ? true : false;
	var last_visit = pc.stats_get_last_street_visit();

	// Update send announcements for any overlay flags on players in the area.
	this.updatePlayerOverlayIndicators(pc);


	//
	// Stuck in an instance?
	//

	if (is_instance && !pc.instances_has(this.instance_id)){
		log.error(this+' is an instance of '+this.instance_id+' and contains a player '+pc+' who does not belong');
		if (!pc.ignore_stuck_instance){
			pc.instances_exit_familiar(this.instance_id, "Why are you still here? Let's see if we can get you back where you are supposed to be.");
		}
		else{
			delete pc.ignore_stuck_instance;
		}
	}


	pc.instances_location_enter(this);

	// Quest location? Invoke any quest location change functionality
	this.quests_enter_location(pc);
	
	// Glitch train achievement check
	pc.updateGlitchTrain(this.tsid);

	// Check for 11 secret locations, which is an achievement rather than a quest
	pc.showSecretLocationMarker(this);

	if (!this.is_public && pc == this.owner){
		// In their house
		if (pc.crafty_bot && pc.crafty_bot.tsid){
			var test_bot = apiFindObject(pc.crafty_bot.tsid);
			if (test_bot.class_tsid != 'npc_crafty_bot'){
				test_bot.apiDelete();
				delete pc.crafty_bot;
			}
		}

		var butler_box = this.findFirst('butler_box');
		if (butler_box){
			butler_box.apiDelete();
		}

		if (!pc.crafty_bot){
			if (this.count_items('butler_box') == 0){
				var magic_rock = this.findFirst('magic_rock');
				if (magic_rock){
					var point = this.apiGetPointOnTheClosestPlatformLineBelow(magic_rock.x, magic_rock.y);
					var crafty_box = this.createAndReturnItem('butler_box', 1, point.x-124, point.y, 0, null, pc.tsid);
					if (crafty_box){
						crafty_box.is_craftybot = true;
						crafty_box.setAndBroadcastState('craftybot');
						crafty_box.setInstanceProp('talk_state', 'craftybot');
					}
				}
			}
		}
	}

	// Street or house?
	if (is_pol && !is_instance){
		pc.counters_increment('pols_visited', this.tsid);
				
		if (this.is_public && pc != this.owner){
			if (this.home_id == "tower") {
				pc.has_visited_tower = true;
			}
			else { 
				pc.achievements_increment("player_streets_visited", this.tsid);
			}
		}
		else if (this.is_public && this.home_id == "tower") {
			pc.has_visited_tower = true;
			pc.counters_increment("butler_hint_counters", "visited_my_tower");
		}
	}
	else if (!is_instance || this.instance_of){

		var location_tsid = this.tsid;
		if (this.instance_of) location_tsid = this.instance_of;

		var visits_count = 0;
		var locations_count = 0;
		if (!is_quarter && !this.transit_is_station() && !this.is_machine_room() && !this.isGreetingLocation()){
			pc.achievements_increment('locations_visited', location_tsid);
			pc.counters_increment('locations_visited', location_tsid);
			visits_count = pc.counters_get_label_count('locations_visited', location_tsid);
			locations_count = pc.counters_get_group_count('locations_visited');

			pc.quests_enter_location(this.tsid, locations_count);
		}
		else{
			if (this.transit_is_station()) {
				this.transit_enter_station(pc);
			}
			pc.counters_increment('hidden_locations_visited', location_tsid);
			visits_count = pc.counters_get_label_count('hidden_locations_visited', location_tsid);
			locations_count = pc.counters_get_group_count('locations_visited');
		}

		//
		// Qurazy quoins
		// https://docs.google.com/document/d/125o-Qz-5L1_pPfxR4ifNImoV-zuU6URuNTC8esSNQ8s/edit
		//

		if (this.qurazy && this.qurazy[pc.tsid]){
			try{
				this.qurazy[pc.tsid].apiDelete();
			}
			catch(e){}
			delete this.qurazy[pc.tsid];
		}

		if (!pc.achievements_get_daily_label_count('qurazy_notfound', location_tsid)){

			var qurazy_chance = 0.2;
			if (visits_count == 1){
				qurazy_chance = 1;
			}
			else{
				var history = pc.stats_get_street_history();
				var sorted_history = utils.sortObj(history, function(a, b){ return history[a] < history[b]; });
				var history_position = 0;
				for (var i in sorted_history){
					history_position++;
					if (sorted_history[i].key == location_tsid) break;
				}

				//log.info(this+' qurazy position for '+pc+' is '+history_position);
				//log.info(this+' qurazy history for '+pc+' is '+sorted_history.length);
				var percentile = history_position / sorted_history.length;
				//log.info(this+' qurazy percentile for '+pc+' is '+percentile);
				if (percentile >= 0.9){
					qurazy_chance = 0.7;
				}
				else if (percentile >= 0.7){
					qurazy_chance = 0.5;
				}
				else if (percentile >= 0.5){
					qurazy_chance = 0.3;
				}
				else if (percentile >= 0.3){
					qurazy_chance = 0.2;
				}
				else if (percentile >= 0.1){
					qurazy_chance = 0.1;
				}

				var three_days_ago = gametime_to_key(timestamp_to_gametime(time() - (game_days_to_ms(2) / 1000)));
				var yesterday = gametime_to_key(timestamp_to_gametime(time() - (game_days_to_ms(1) / 1000)));
				var today = current_day_key();
				if (pc.daily_history_get(three_days_ago, 'qurazy_found_'+location_tsid) || pc.daily_history_get(yesterday, 'qurazy_found_'+location_tsid) || pc.daily_history_get(today, 'qurazy_found_'+this.tsid)){
					qurazy_chance = 0;
				}

				if (pc.achievements_get_daily_group_sum('qurazy_found') >= 5) qurazy_chance = 0;
			}

			log.info(this+' qurazy chance for '+pc+' is '+qurazy_chance);
			if (is_chance(qurazy_chance) || pc.buffs_has('max_luck')){
				this.spawnQurazy(pc);
			}
			else{
				pc.achievements_increment_daily('qurazy_notfound', location_tsid, 1);
			}
		}

		pc.achievements_increment('hubs_visited', this.hubid);
	
		// Compute the counter for completist achievements.
		var countsForBadge = this.countsTowardHubAchievement(pc);
		if (visits_count == 1 && countsForBadge) {
			pc.achievements_increment('streets_visited_in_hub', 'number_'+this.hubid);
			pc.counters_increment('streets_visited_in_hub', 'number_'+this.hubid);
		}
		
		if (countsForBadge) {
			pc.achievements_increment('streets_visited_in_hub_'+this.hubid, location_tsid);
			pc.counters_increment('streets_visited_in_hub_'+this.hubid, location_tsid);
			var count = pc.counters_get_label_count('streets_visited_in_hub', 'number_'+this.hubid);
			var group_count = pc.counters_get_group_count('streets_visited_in_hub_'+this.hubid);
			
			if (group_count > count){
				pc.achievements_set('streets_visited_in_hub', 'number_'+this.hubid, group_count);
				pc.counters_set('streets_visited_in_hub', 'number_'+this.hubid, group_count);
			}
		}
	}

		// dinosaur transit sound effect
	var last_tsid = pc.last_location.tsid;
	if (pc.last_location.instance_of) last_tsid = pc.last_location.instance_of;
	if ((this.tsid == "LA9T7IFRDIA2N0K" && last_tsid == "LA9TKSRJ7LD3SGK")
		||  (this.tsid == "LA5GNCQ4T3137M7" && last_tsid == "LA9UCEFP7LD3523")
		||  (this.tsid == "LA5AAB0VNKR2VRN" && last_tsid == "LA931BPTNLD3E35")
		||  (this.tsid == "LIF153KDV872SE5" && last_tsid == "LA9U27HN7LD3FVE")
		||  (this.tsid == "LIFR1RLV0G43647" && last_tsid == "LA9TCL1H7LD37DC")
		||  (this.tsid == "LIFF8A7EAO72NPH" && last_tsid == "LA9UIKNQ7LD3SN0")) {
			this.announce_sound_to_all("BURP");
	}
		
	
	if (!is_instance && !is_pol){
		pc.teleportation_add_history(this.tsid);
	}

	if (!is_instance || this.instance_of){
		pc.stats_add_street_history(this.instance_of ? this.instance_of : this.tsid, is_pol);
	}

	var pc_dest = pc.getPathDestTsid();
	if (this.tsid == pc_dest || (this.instance_of && this.instance_of == pc_dest)){
		pc.quests_inc_counter('map_dest_reached',1);
	}

	if (this.isInstance('hell_one')){
		var prompt_delay = 30;
		if (visits_count == 1){
			prompt_delay = 1;
		}

		pc.prompts_add_delayed({
			txt		: 'Uh oh. You croaked! Bummer! Just find some hellish grapes on the ground in here and give them some good squashing. Keep going until you get out!',
			icon_buttons	: false,
			timeout_value	: '',
			timeout		: 10,
			choices		: [
				{ value : '', label : 'Ok' }
			],
			callback	: '',
			is_grape_squish: true
		}, prompt_delay);
	}

	// Kukubee Winter Buff
	if ((this.tsid == 'LM413ATO8PR54' || this.tsid == 'LLI11ITO8SBS6' || this.tsid == 'LM11E7ODKHO1QJE') && !pc.buffs_has('kukubee_winter_positive')){
		pc.buffs_apply('kukubee_winter_negative');
	}
	
	// Rainbow Run
	else if (is_instance && this.instance_id == 'rainbow_run'){
		// Display an indicator, then go to a countdown, then apply buff and start!
		log.info("Entering rainbow run...");
		pc.apiSendAnnouncement({
			uid: "rainbow_run_ready",
			type: "vp_overlay",
			duration: 0,
			locking: true,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: true,
			text: [
				'<p align="center"><span class="nuxp_vog">Get ready to grab those coins!</span><br><span class="nuxp_vog_smaller">(CLICK WHEN READY)</span></p>'
			],
			done_payload: {
				function_name: 'rainbow_run_ready'
			}
		});
	}
	else if (this.instance_id == 'top_of_tree'){
		this.ignore_quoin_limit = true;
		if (pc.getQuestStatus('high_jump') != 'done'){
			pc.run_overlay_script('top_of_tree');
		}
		else{
			pc.prompts_add_delayed({
				txt		: 'Just jump off the tree to go back to where you were…',
				icon_buttons	: false,
				timeout_value	: '',
				timeout		: 10,
				choices		: [
					{ value : '', label : 'Ok' }
				],
				callback	: ''
			}, 1);
		}
	}
	else if (this.instance_id != 'rainbow_run' && !this.isInHell()){
		pc.quests_set_flag('left_rainbow_run');
 		var quest = pc.getQuestInstance('numismatic_hustle');
		if (quest){
			if (quest.isStarted(pc) && !quest.isDone(pc)){
				pc.familiar_send_alert({
					'callback'	: 'quests_familiar_fail_and_remove',
					'class_tsid'	: 'numismatic_hustle',
					'txt'		: "My Grandma has more <b>Hustle</b> than that. Open your Quest Log if you want to try again.",
				});
			}
		}
	}

	if (this.isInstance('eesti') && !pc.ignore_stuck_instance){
		var quest = pc.getQuestInstance('de_embiggenify_part2');
		if (quest){
			if (quest.isDone(pc)){
				pc.instances_exit_familiar('eesti', "Why are you still here? Let's see if we can get you back where you are supposed to be.");
			}
		}
	}

	if (this.isInstance('humbaba') && pc.distanceFromPlayerXY(-1450, -110) <= 300){
		pc.apiSendAnnouncement({
			uid: 'humbaba_1',
			type: "vp_overlay",
			duration: 0,
			locking: true,
			width: 560,
			x: '50%',
			top_y: '15%',
			delay_ms: 1000,
			click_to_advance: true,
			text: [
				'<p align="center"><span class="nuxp_vog">Ah, the Rooks\' Wood. Careful of the crushers …</span></p>',
				'<p align="center"><span class="nuxp_vog">… get too close to those mean rocks & you\'ll get a bad shock and have to start over.</span></p>'
			]
		});
	}

	if (!this.isInstance('eesti')){
		var quest_instance = pc.getQuestInstance('de_embiggenify_part2');
		if (quest_instance && quest_instance.isStarted() && !quest_instance.isDone()){
			log.info('-=-=-=-=-=-=-=-==-=-=-=-=-= Canceled quests de_embiggenify_part2 and de_embiggenify');
			pc.failQuest('de_embiggenify_part2');
			pc.failQuest('de_embiggenify', true);
		}
		else if (!quest_instance){
			var quest_instance = pc.getQuestInstance('de_embiggenify');
			if (quest_instance && quest_instance.isStarted()){
				log.info('-=-=-=-=-=-=-=-==-=-=-=-=-= Canceled quest de_embiggenify');
				pc.failQuest('de_embiggenify');
			}
		}
	}
	
	if (this.isInstance('tower_quest_desert')){
		pc.buffs_apply('its_so_hot');
	}
	else{
		if (pc.buffs_has('its_so_hot')) pc.buffs_remove('its_so_hot');
		if (pc.buffs_has('its_so_hot2')) pc.buffs_remove('its_so_hot2');
	}
	
 	if (pc.getQuestStatus('tower_quest') != 'none' && !in_array_real(this.instance_id, this.tower_quest_instances)){
		var quest_instance = pc.getQuestInstance('tower_quest_part3');
		// Quest is now repeatable.
		if(!quest_instance) {
			quest_instance = pc.getQuestInstance('tower_quest_part3repeat');
		}
		if (!quest_instance || !quest_instance.isDone()){
			pc.failQuest('tower_quest_part3repeat');
			pc.failQuest('tower_quest_part3');
			pc.failQuest('tower_quest_part2', true);
			pc.failQuest('tower_quest_part2');
			pc.failQuest('tower_quest', true);
			pc.failQuest('tower_quest');
		}
	}
	
	// quest ending code for Last Pilgrimage of Esquibeth
	if (pc.end_esquibeth) {
		pc.apiSetTimer("announce_vog_fade", 5000, "Contemplate well the Last Pilgrimage of Esquibeth. Your knowledge of this hero and her deeds enables you to participate in Feats.", {css_class:'nuxp_medium', fade_alpha:0.6, width: 600, done_payload: {function_name: 'esquibethEnd'}});
	
	}
	
	// Spawn any items for this location: the rube, smugglers, etc.
	this.location_spawns(pc);

	// Do region-specific entry code
	this.region_on_enter(pc);

	// Invoke any specific entry code for buffs
	pc.buffs_enter_location(this);

	//
	// Play any music for this location
	//

	if (this.isRooked()){
		this.onPlayerEnterRooked(pc);
	}
	else if (this.geometry.music_file){
		pc.announce_music(this.geometry.music_file, 999);
	}

	
	// make sure we update physics whenever a player enters a location
	pc.removeAllTempPhysics(true);

	// Announce
	pc.sendLocationActivity(pc.label + " is here!", pc, pc.buddies_get_ignoring_tsids());

	var msg = '';
	var players = [];
	for (var i in this.activePlayers){
		var player = this.activePlayers[i];
		var tsid = player.tsid;
		if (tsid != pc.tsid){
			if (pc.buddies_is_ignored_by(tsid) == false) { 
				players.push(utils.escape(player.label));
			}
		}
	}

	var rsp = {
		type: 'pc_location_change',
		pc: {
			tsid: pc.tsid,
			label: pc.label,
			location: {
				tsid: this.tsid,
				label: this.is_hidden() ? 'A secret place' : this.label
			}
		}
	};

	pc.reverseBuddiesSendMsg(rsp);

	if (players.length){
		var msg = "Other players here: " + pretty_list(players, ' and ');
		pc.sendActivity(msg, null);
	}


	if (this.tsid == 'LM410EP19KL55' || this.tsid == 'LLI2VDR4JRD1AEG'){
		// hole to ix
		pc.quests_set_flag('find_ix_hole');
	}

	if (this.is_transit){
		this.transit_schedule_departure(pc);
	}

	if (this.is_race){
		this.race_player_enter(pc);
	}
	else{
		pc.quests_set_flag('race_leave');
	}

	if (pc.getQuestStatus('explore_the_seams') == 'todo' && in_array_real(this.tsid, ['LDOC74759ST2IG1','LDOB5HTH1ID2MTL','LCR14T7ECHM18G8','LDOHDJ84BST2UI2','LTJ1KL16N2O13T2','LHVDIELDQQ7228K','LTJ1KOM8N2O1EFS','LM11E7ODKHO1QJE','LCR1516SFHM122V','LDOSHD9J6NT2HUJ'])){
		var explore_the_seams = pc.getQuestInstance('explore_the_seams');
		if (explore_the_seams && explore_the_seams.isStarted() && !explore_the_seams.isDone() && explore_the_seams.isNewVisit(this.tsid)){
			pc.quests_inc_counter('visit_seam_street', 1);
		}
	}
	else if (pc.getQuestStatus('tend_to_your_community') == 'todo' && in_array_real(this.tsid, ['LA95U14319524O9', 'LA97L62229522GS', 'LA99U5PI39524GN', 'LHV17T973F42GEP', 'LTJ13TRDHKV1970', 'LTJ1013E97K17P1', 'LIFN3FI0TNU10PS', 'LHFR1N2PUMI2C7A'])){
		var tend_to_your_community = pc.getQuestInstance('tend_to_your_community');
		if (tend_to_your_community && tend_to_your_community.isStarted() && !tend_to_your_community.isDone() && tend_to_your_community.isInDestination(pc)){
			pc.quests_inc_counter('visit_herb_gardens', 1);
		}
	}

	// Action requests!!!
	if (this.action_requests){
		for (var pc_tsid in this.action_requests){
			if (pc_tsid == pc.tsid) continue; //wtf?
			if (!this.activePlayers[pc_tsid]){
				delete this.action_requests[pc_tsid];
				continue;
			}

			var deets = this.action_requests[pc_tsid];
			var timeout = intval(deets.timeout);
			if (timeout){
				if (deets.offered + timeout <= time()) continue;
				timeout -= time()-deets.offered;
			}

			pc.sendActionRequest(deets.type, deets.tsid, getPlayer(pc_tsid), deets.txt, deets.need, deets.got, timeout);
		}
	}

	// Greeting location?

	if (this.isGreetingLocation()){
		// Are they a greeter?

		if (pc.isGreeter()){

			if (!pc.greeted) pc.greeted = {};

			// Tell non-greeters here that a greeter arrived
			var greeter_ava = pc.avatar_get_pc_msg_props();
			if (greeter_ava.singles_url){
				log.info(this+' greeter has arrived with singles: '+pc);

				for (var i in this.activePlayers){
					var ap = this.activePlayers[i];
					if (!ap.has_done_intro || ap.tsid == pc.tsid) continue;

					if (ap.isGreeter()){
						if (ap.isGreeterTrainee() && !pc.isGreeterTrainee()){
							pc.prompts_add_delayed({
								txt				: '<span class="prompt_greeter">How did <span class="prompt_greeter_name">'+ap.linkifyLabel()+'</span> do on this greet with you?</span>',
								icon_buttons	: false,
								callback		: 'greeter_training_callback',
								trainee			: ap.tsid,
								choices			: [
									{ value : 'up', label : 'Great!' },
									{ value : 'down', label : 'Meh.' }
								]
							}, 5);
						}
						else if (pc.isGreeterTrainee() && ap.isGreeter() && !ap.isGreeterTrainee()){
							ap.prompts_add_delayed({
								txt				: '<span class="prompt_greeter">How did <span class="prompt_greeter_name">'+pc.linkifyLabel()+'</span> do on this greet with you?</span>',
								icon_buttons	: false,
								callback		: 'greeter_training_callback',
								trainee			: pc.tsid,
								choices			: [
									{ value : 'up', label : 'Great!' },
									{ value : 'down', label : 'Meh.' }
								]
							}, 5);
						}
						continue;
					}

					if (ap.greeting && !ap.greeting.greeter) ap.greeting.greeter = pc.tsid;
					if (ap.greeting && !ap.greeting.greeter_arrived) ap.greeting.greeter_arrived = time();

					pc.greeted[ap.tsid] = time();

					ap.apiSendMsg({
					        "type": "conversation",
					        "title": "<span class=\"choices_quest_title\">Your greeter has arrived!</span>",
					        "itemstack_tsid": config.familiar_tsid,
					        "greeter_ava_url": greeter_ava.singles_url, // url of greeters avatar icon
					        "conv_type": "greeter_arrived",
					        "txt":"A greeter has arrived to welcome you, and lend a hand if you need it. Here's what your greeter looks like.",
					        "choices":{
					                "1":{
					                        "value":false, // false will keep the conversation from sending anything back to the server, so you don't have to worry about handling any responses
					                        "txt":"Ok, thanks"
					                }
					        }
					});
				}
			}
			else{
				log.info(this+' greeter has arrived without singles: '+pc);
			}
		}
		else if (this.instance_of){

			if (!pc.greeting) pc.greeting = {};
			pc.greeting.location = this.tsid;
			pc.greeting.entered = time();

			// Place a music block
			var block_location = null;
			for (var i in config.greeting_locations){
				if (this.instance_of == config.greeting_locations[i].tsid){
					block_location = config.greeting_locations[i].musicblock_position;
					log.info(this+" Block location will be: "+block_location);
					break;
				}
			}

			var is_musicblock = function(it){ return it.is_musicblock; };

			if (block_location && !pc.countItemClass(is_musicblock) && !this.find_items(is_musicblock).length){
				var block_class = choose_one(['musicblock_d_blue_01','musicblock_d_blue_02','musicblock_d_blue_03','musicblock_d_blue_04','musicblock_d_blue_05','musicblock_d_green_01','musicblock_d_green_02','musicblock_d_green_03','musicblock_d_green_04','musicblock_d_green_05','musicblock_d_red_01','musicblock_d_red_02','musicblock_d_red_03','musicblock_d_red_04','musicblock_d_red_05','musicblock_x_shiny_01','musicblock_x_shiny_02','musicblock_x_shiny_03','musicblock_x_shiny_04','musicblock_x_shiny_05']);
				//var blk = this.createItemStack(block_class, 1, block_location[0], block_location[1]);
				this.createItemStackDelayed(block_class, 1, block_location[0], block_location[1], 1);
				log.info(this+" Adding delayed music block at "+block_location+'.');
			}
		}
	}

	//
	// Determing whether this is an instance template and we should warn the user
	//

	if (this.moteid == 10 || this.instances_instance_me() || this.tsid == 'LTJ101M7R9O1HTT'){
		if (!this.isInstance()){
			log.error(pc+' has entered a quest location template and is going to fuck it up: '+this);
		}
	}


	//
	// newxp
	//

	if (!is_instance && !is_pol && !pc.is_dead && pc.getQuestStatus('leave_gentle_island') == 'todo'){
		pc.apiSetTimerX('quests_set_flag', 15000, 'leave_gentle_island');
	}

	//
	// Perform custom callbacks
	//

	if (this.playerEnterCallback) this.playerEnterCallback(pc);


	//
	// Let's get rid of upgrade tree stuff, temporarily
	//

	if (this.upgrade_tree){
		this.old_upgrade_tree = this.upgrade_tree;
		delete this.upgrade_tree;
	}


	//
	// location events
	//

	var num = 0;
	for (var i in this.activePlayers){
		if (this.activePlayers[i].tsid != pc.tsid) num++;
	}
	if (num == 0) this.events_broadcast('first_player_enter');
	this.events_broadcast('player_enter', {target_pc:pc});


	//
	// feats
	//

	if (pc.buffs_has('nekkid')) pc.nekkid_entered_location = [pc.x, pc.y];
}

function onPlayerReconnect(pc){
	this.region_on_reconnect(pc);
	this.events_broadcast('player_reconnect');
}

function spawnQurazy(pc){
	if (this.qurazy && this.qurazy[pc.tsid]) return;

	var markers = this.find_items('marker_qurazy');
	if (markers && markers.length){
		var marker = choose_one(markers);
		if (marker){
			if (!this.qurazy) this.qurazy = {};
			log.info(this+' placing qurazy for '+pc+' at '+marker.x+','+marker.y);

			this.qurazy[pc.tsid] = this.createAndReturnItem('quoin', 1, marker.x, marker.y, 0, pc.tsid);
			if (this.qurazy[pc.tsid]){
				this.qurazy[pc.tsid].setInstanceProp('type', 'qurazy');
				pc.achievements_increment_daily('qurazy_found', this.tsid, 1);
				pc.daily_history_flag('qurazy_found_'+this.tsid);

				if (this.class_tsid != 'newbie_island'){
					pc.sendActivity("OMG! There's a Qurazy Quoin on this street for you!", pc, true);
					pc.announce_vp_overlay({
						overlay_key: 'o_qurazy_quoin_overlay',
						duration: 10000,
						x: '50%',
						top_y: '-5%',
						scale_to_stage: true,
						fade_out_sec: 3
					});
				}
			}
		}
	}
}

function onPlayerExit(pc, next_location){

	pc.last_location = this;

	if (this.isInstance()){
		apiLogAction('PLAYER_EXIT', 'pc='+pc.tsid, 'loc='+this.tsid, 'template='+this.instance_of);
		
		pc.instances_cancel_exit_prompt(this.instance_id);
	}
	else if (this.pols_is_pol()){
		apiLogAction('PLAYER_EXIT', 'pc='+pc.tsid, 'loc='+this.tsid, 'pol=1', 'template='+this.template);
	}
	else if (this.quarter_tsid){
		apiLogAction('PLAYER_EXIT', 'pc='+pc.tsid, 'loc='+this.tsid, 'quarter=1', 'template='+this.template);
	}
	else{
		apiLogAction('PLAYER_EXIT', 'pc='+pc.tsid, 'loc='+this.tsid);
	}

	if (this.isInstance('hell_one')){
		pc.events_remove(function(details){ return details.callback == 'prompts_add' && details.is_grape_squish; });
	}
	
	if (this.isMountain && this.isMountain()){
		this.removePlayer(pc);
	}
	
	// Kukubee Winter Buffs
	if ((this.tsid == 'LM413ATO8PR54' || this.tsid == 'LLI11ITO8SBS6' || this.tsid == 'LM11E7ODKHO1QJE')){
		if (pc.buffs_has('kukubee_winter_negative')){
			pc.buffs_remove('kukubee_winter_negative');
		}

		var quest_instance = pc.getQuestInstance('meditativearts_maintain_energy_in_wintry_place');
		if (quest_instance && quest_instance.isStarted() && !quest_instance.isDone() && quest_instance.get_counter_value(pc, 'wintry_place_meditation')){
			pc.quests_set_counter('wintry_place_meditation', 0);

			pc.familiar_send_alert({
				'callback'	: 'familiar_ignore_callback',
				'args'		: {
					'title'		: quest_instance.getTitle(pc)
				},
				'txt'		: 'Too cold for ya, eh? <split butt_txt="It\'s not that, I\'m fine, I just have other stuff to do…" /> Sure you do kid, sure you do. Come back and try again any time. Did I mention that Focused Meditation might be a handy skill to have? <split butt_txt="I\'ll bear that in mind." />',
			});
		}
	}

	if (this.instance_id && this.instance_id.substr(0, 17) == 'bureaucratic_hall'){
		log.info(pc+' left bureaucratic hall');
		delete pc['!bureaucracy_waiting'];
		delete pc['!bureaucracy_step'];
		delete pc['!bureaucracy_started'];

		if (pc.buffs_has('please_wait')){
			pc.buffs_remove('please_wait');
		}
	}

	if (!pc.is_dead && pc.isOnline()){
		if (this.isInstance('eesti')){
			if(pc.apply_bluff) {
				delete pc.apply_buff;
			}
			
			log.info('-=-=-=-=-=-=-=-==-=-=-=-=-= Left eesti instance');
			log.info('-=-=-=-=-=-=-=-==-=-=-=-=-= Checking quest de_embiggenify_part2');
			var quest_instance = pc.getQuestInstance('de_embiggenify_part2');
			if (quest_instance && pc.checkItemsInBag('small_worthless', 1)){
				log.info('-=-=-=-=-=-=-=-==-=-=-=-=-= Canceled quests de_embiggenify_part2 and de_embiggenify');
				pc.failQuest('de_embiggenify_part2');
				pc.failQuest('de_embiggenify', true);
				pc.items_destroy('small_worthless', 1);

			}
			else if (quest_instance && !quest_instance.isDone()){
				log.info('-=-=-=-=-=-=-=-==-=-=-=-=-= Canceled quests de_embiggenify_part2 and de_embiggenify');
				pc.failQuest('de_embiggenify_part2');
				pc.failQuest('de_embiggenify', true);
			}
			else if (!quest_instance){
				log.info('-=-=-=-=-=-=-=-==-=-=-=-=-= Canceled quest de_embiggenify');
				pc.failQuest('de_embiggenify');
			}
		}
		else if (this.isInstance('top_of_tree')){
			var quest_instance = pc.getQuestInstance('high_jump');
			if (!quest_instance.isDone()){
				log.info('-=-=-=-=-=-=-=-==-=-=-=-=-= Canceled quest high_jump');
				pc.failQuest('high_jump');
			}
		}
		else if (this.isInstance('humbaba')){
			var quest_instance = pc.getQuestInstance('rook_egg_smash');
			if (!quest_instance.isDone()){
				log.info('-=-=-=-=-=-=-=-==-=-=-=-=-= Canceled quest rook_egg_smash');
				pc.failQuest('rook_egg_smash');
			}

			pc.overlay_dismiss('humbaba_1');
			pc.overlay_dismiss('humbaba_2');
		}
		else if (this.isInstance('firefly_whistle')){
			var quest_instance = pc.getQuestInstance('firefly_whistle');
			if (!quest_instance.isDone()){
				log.info('-=-=-=-=-=-=-=-==-=-=-=-=-= Canceled quest firefly_whistle');
				pc.failQuest('firefly_whistle');
			}
		}
	}
	
	if (pc['!crusher_collided']){
		
		pc.stopHitAnimation();
	}
	
	if (pc['!pulling']) {
		var cracker = apiFindObject(pc['!pulling']);
		if (cracker) { 
			cracker.onPlayerExit(pc);
		}
	}

	if (this.is_race){
		this.race_player_exit(pc);
	}

	if (pc.buffs_has('charades')){
		pc.sendActivity('You left your own game of charades. I guess you were done playing.');
		pc.buffs_remove('charades');	
	}


	// Action requests!!!
	if (this.action_requests){
		for (var pc_tsid in this.action_requests){
			var deets = this.action_requests[pc_tsid];

			if (pc_tsid == pc.tsid){

				if (deets.type == 'quest_accept'){
					// Remove prompts
					pc.prompts_remove(pc['!invite_uid_'+pc.tsid]);

					var q = pc.getQuestInstance(deets.tsid);
					if (q){
						pc.updateActionRequest('was looking for a challenger on the quest <b>'+q.getTitle(pc)+'</b>.', 0);

						for (var i in q.opponents){
							var opp = getPlayer(i);
							if (opp) opp.prompts_remove(opp['!invite_uid_'+pc.tsid]);
						}

						pc.failQuest(deets.tsid);
					}
					pc.events_remove(function(details){ return details.callback == 'quests_multiplayer_invite_timeout'; });
				}
				else if (deets.type == 'game_accept'){
					var g = config.shared_instances[deets.tsid];

					// Remove prompts
					pc.prompts_remove(pc['!invite_uid_'+pc.tsid]);
					for (var i in pc.games_invite.opponents){
						var opp = getPlayer(i);
						if (opp){
							opp.prompts_remove(opp['!invite_uid_'+pc.tsid]);
							opp.removeActionRequestReply(pc);
						}
					}
					
					pc.updateActionRequest('was looking for a challenger on <b>'+g.name+'</b>.', 0);
					pc.events_remove(function(details){ return details.callback == 'games_invite_timeout'; });

					if (pc.games_invite && pc.games_invite.ticket_on_cancel){
						pc.createItemFromFamiliar(pc.games_invite.ticket_on_cancel, 1);
					}

					delete pc.games_invite;
				}

				// Do ourselves first, because canceling the broadcast deletes data necessary for us to cancel on ourselves
				pc.cancelActionRequest(pc, deets.type, deets.tsid);
				pc.cancelActionRequestBroadcast(deets.type, deets.tsid);
			}
			else{
				var owner = getPlayer(pc_tsid);
				pc.cancelActionRequest(owner, deets.type, deets.tsid);
			}
		}
	}

	// Greeting location?
	if (this.isGreetingLocation()){
		// Are they a greeter?

		if (pc.isGreeter()){
			for (var i in this.activePlayers){
				if (this.activePlayers[i].isGreeter() || !this.activePlayers[i].has_done_intro) continue;

				if (this.activePlayers[i].greeting && !this.activePlayers[i].greeting.greeter_arrived) this.activePlayers[i].greeting.greeter_left = time();
			}
		}
		else{
			
			if (!pc.greeting) pc.greeting = {};
			pc.greeting.left = time();
		}
	}

	// Remove auth, if this is a house
	if (this.pols_is_pol() && !this.pols_is_owner(pc) && !this.getProp('is_public') && !this.acl_keys_player_has_key(pc)){
		var owner = this.pols_get_owner();
		if (owner) owner.houses_remove_auth(this, pc);
	}

	//pc.apiSendAnnouncement({type: 'stop_all_music'});
	if (this.isRooked()){
		pc.announce_music_stop('ROOK_FLOCK', 1);
	}
	else if (this.geometry.music_file){
		pc.announce_music_stop(this.geometry.music_file, 1);
	}
	pc.apiSendAnnouncement({type: 'stop_all_sound_effects'});

	var txt = pc.label + " just left :-(";
	if (next_location !== undefined && next_location !== null){
		if(next_location.is_hidden()) {
			txt = pc.label + " just left for "+choose_one(['a secret place', 'a mysterious vortex', 'a non-existent impossibility', 'another castle', '12 galaxies']);
		} else {
			txt = pc.label + " just left for "+next_location.label;
		}
	}

	// Announce
	pc.sendLocationActivity(txt, pc, pc.buddies_get_ignoring_tsids());

	//
	// Perform custom callbacks
	//
	
	if (this.playerExitCallback) this.playerExitCallback(pc, next_location);

	//
	// Qurazy quoins
	//

	if (this.qurazy && this.qurazy[pc.tsid]){
		try{
			this.qurazy[pc.tsid].apiDelete();
		}
		catch(e){}
		delete this.qurazy[pc.tsid];
	}

	//
	// location events
	//

	var num = 0;
	for (var i in this.activePlayers){
		if (this.activePlayers[i].tsid != pc.tsid) num++;
	}
	if (num == 0) this.events_broadcast('last_player_exit');
	this.events_broadcast('player_exit', {target_pc:pc});


	//
	// Instance cleanup
	//

	if (this.isInstance() && this.instance){
		this.instance.check_should_destroy(pc);
	}


	//
	// feats
	//

	if (!this.isInstance() && !this.pols_is_pol() && pc.buffs_has('nekkid') && pc.nekkid_entered_location){
		var distance = pc.distanceFromPlayerXY(pc.nekkid_entered_location[0], pc.nekkid_entered_location[1]);

		if (config.is_dev) log.info(this+'-=-=-=-=-=-==-=-=-=-=-=-==-'+pc+'=-=-=-=-=-=-=-=-=--=-=-'+distance);
		if (distance >= 1000 && pc.has_blown_conch){
			if (!this.streaking_increments) this.streaking_increments = {};
			if (!this.streaking_increments[current_day_key()])this.streaking_increments[current_day_key()] = {};
			if (!this.streaking_increments[current_day_key()][pc.tsid]){
				pc.apiSetTimer('feats_increment', 1000, 'streaking', 1);
				this.streaking_increments[current_day_key()][pc.tsid] = time();
			}
		}

		delete pc.nekkid_entered_location;
	}
}

function hitBox(pc, id, in_box){
	if (config.is_dev || pc.is_god) log.info(pc+' hit box '+id+', in box: '+(in_box ? 'true': 'false'));
	if (!id){
		log.error("location.hitBox passed undefined id");
		return;
	}


	//
	// Find the box
	//

	var box = this.find_hitbox_by_id(id);

	//
	// Bureaucratic Hall
	//

	if (id == 'bureaucratic_hall_entered'){
		if (!pc['!bureaucracy_started']){
			// one of the bureaucrats randomly moves from behind the counter the middle of the level (the “meeting area”) and announces
			function is_bureaucrat(it){ return it.class_tsid == 'npc_bureaucrat' && !it.isBusy(); }
			var bureaucrat = pc.findCloseStack(is_bureaucrat);
			if (bureaucrat){
				log.info(bureaucrat+' will greet '+pc);
				bureaucrat.greetPlayer(pc);
				pc['!bureaucracy_started'] = true;

				return true;
			}
			else{
				log.error(this+' no bureaucrats available!');
			}
		}
		else{
			return true;
		}
	}
	else if (id == 'waiting_area'){
		log.info(pc+' bureaucracy_waiting: '+pc['!bureaucracy_waiting']);
		if (pc['!bureaucracy_waiting']){
			log.info(pc+' is waiting');

			if (pc['!bureaucracy_waiting_prompt']){
				pc.prompts_remove(pc['!bureaucracy_waiting_prompt']);
				delete pc['!bureaucracy_waiting_prompt'];
			}

			if (pc.achievements_has('card_carrying_qualification') && !pc.skills_has('bureaucraticarts_1')){
				log.info(pc+' has card-carrying but no skill');

				pc.prompts_add({
					txt		: 'You have not learned any of Bureaucratic Arts and already have a Card-Carrying Qualification: the Bureaucrats have nothing for you.',
					icon_buttons	: false,
					timeout 	: 10,
					choices		: [
						{ value : 'ok', label : 'OK' }
					]
				});

				function is_bureaucrat(it){ return it.class_tsid == 'npc_bureaucrat' && !it.isBusy(); }
				var bureaucrat = pc.findCloseStack(is_bureaucrat);
				if (bureaucrat){
					log.info(bureaucrat+' will help '+pc);
					bureaucrat.helpPlayer(pc);
				}
				else{
					log.error(pc+' could not get a bureaucrat');
				}
			}
			else{
				log.info(pc+' told to wait');
				pc.buffs_apply('please_wait');
			}

			delete pc['!bureaucracy_waiting'];
		}
		else{
			log.info(pc+' is not waiting');
		}

		return true;
	}


	//
	// Transit
	//

	if (id.substring(0,13) == 'transit:gate:'){
		var transit_id = id.substr(13);

		var entrance = this.find_hitbox_by_id('transit:entrance:'+transit_id);
		if (!this.transit_has_paid_fare(pc, transit_id)){
			pc.moveAvatar(box.x, box.y);
			pc.familiar_send_targeted({
				'callback'	: 'transit_familiar_pay_fare',
				'target_tsid'	: 'transit:gate:'+transit_id,
				'cost'		: this.transit_get_fare_cost(transit_id),
				'loc_tsid'	: this.tsid
			});
		}

		return true;
	}
	else if (id.substring(0,17) == 'transit:entrance:'){
		var transit_id = id.substr(17);

		var gate = this.find_hitbox_by_id('transit:gate:'+transit_id);
		if (!this.transit_has_paid_fare(pc, transit_id)){
			pc.moveAvatar(gate.x, gate.y);
		}
		else{
			if (this.transit_enter_instance(pc, transit_id)){
				this.transit_process_fare(pc, transit_id);
			}
		}

		return true;
	}


	//
	// Quests
	//

	if (id.substring(0,11) == 'quest:flag:'){
		return pc.quests_set_flag(id.substr(11));
	}
	else if (id.substring(0,12) == 'quest:count:'){
		return pc.quests_set_flag(id.substr(12));
	}
	else if (id.substring(0,6) == 'quest:'){
		return pc.completeQuest(id.substr(6));
	}

	if (id == 'myles_is_great'){
		if (pc.getQuestStatus('de_embiggenify_part2') == 'todo' && !pc.countItemClass('small_worthless') && !this.item_exists('small_worthless')){
			var remaining = pc.createItemFromGround('small_worthless', 1);
			if (!remaining){
				pc.sendActivity("You found the small shiny object with no intrinsic value! Consider bringing it back to the hairball.");
				
				/* reset instance timer */
				pc.instances_cancel_exit_prompt('eesti');
				pc.instances_schedule_exit_prompt('eesti', 2*60);
								
				pc.findFirst('small_worthless').setQuestItem();
				delete pc['!de_embiggenify_full_pack_warn'];
			}
			else if (!pc['!de_embiggenify_full_pack_warn'] || time() - pc['!de_embiggenify_full_pack_warn'] >= 60){
				pc.sendActivity("You found the small shiny object with no intrinsic value, BUT you don't have room in your pack for it. Try eating or drinking something to make room.");
				pc['!de_embiggenify_full_pack_warn'] = time();
			}
		}

		return;
	}
	
	if (id == 'freeze'){
		pc.playHitAnimation(choose_one(pc.hit_types), 500);
 		pc.apiSendAnnouncement({
			type: 'vp_canvas',
			uid: 'freeze',
			canvas: {
				color: '#0000cc',
				steps: [
					{alpha:.5, secs:.5},
					{alpha:.5, secs:.25},
					{alpha:0, secs:.5},
					{alpha:0, secs:3.75}
				],
				loop: false
			}
		});
		log.info('box: '+box);
		pc.teleportToLocation(pc.location.tsid, pc.x, box.y+30);
		return;
	}

	if (this.instance_id == 'top_of_tree'){
		log.info(pc+' hit hitbox '+id+' in top_of_tree');
		if (id == 'got_to_the_top_of_the_spinach_tree'){
			pc.quests_set_flag('top_of_tree');
		}
		else if (id == 'teleport_player_out_of_spinach_tree_level'){
			if (pc.getQuestStatus('high_jump') == 'done'){
				pc.instances_exit(this.instance_id);
			}
			else{
				log.info(pc+" teleport out of top_of_tree not done because they're still doing the quest");
			}
		}

		return;
	}

	if (this.isInstance('humbaba')){
		if (id == 'egg_instruction'){
			if (!pc['!egg_instruction']){
				pc['!egg_instruction'] = true;
				//pc.moveAvatar(box.x, box.y, 'right');
				pc.apiSendAnnouncement({
					uid: 'humbaba_2',
					type: "vp_overlay",
					duration: 0,
					locking: true,
					width: 560,
					x: '50%',
					top_y: '15%',
					delay_ms: 0,
					click_to_advance: true,
					text: [
						'<p align="center"><span class="nuxp_vog">Aha! There it is. You\'re lucky it was not better protected.</span></p>',
						'<p align="center"><span class="nuxp_vog">Now, <b>smash</b> that egg!!</span></p>'
					]
				});
			}

			return;
		}
	}

	if (this.isInstance('firefly_whistle')){
		if (id == 'teleporter'){
			if (this.teleporter_activated){
				var exit = pc.instances_get_exit('firefly_whistle');
				pc.goToFallingLevel(exit);
			}
			else{
				pc.teleportToLocation(this.tsid, pc.x-300, pc.y);
			}

			return;
		}
		else if (id == 'midpoint'){
			var stand = pc.findCloseStack('whistle_stand_button');
			if (stand && !stand.not_selectable){
				pc.moveAvatar(pc.x-500, pc.y, 'right');
				pc.apiSendAnnouncement({
					uid: 'midpoint',
					type: "vp_overlay",
					duration: 3000,
					locking: true,
					width: 500,
					x: '50%',
					top_y: '25%',
					delay_ms: 1000,
					text: [
						'<p><span class="nuxp_vog">Whoops! You may not proceed without the whistle.</span></p>'
					]
				});
			}

			return;
		}
	}

	if (this.isInstance('back_alley')){
		if (id == 'back_alley_entered'){
			function is_bureaucrat(it){ return it.class_tsid == 'npc_bureaucrat'; }
			var bureaucrat = pc.findCloseStack(is_bureaucrat);
			if (bureaucrat){
				bureaucrat.propositionPlayer(pc);
			}
		}
	}
	
	this.handleTowerSecrets(pc, id);
	
	this.handleElevenSecrets(pc, id);
	
	// Warning for gory hell level:
	if (!pc.hasBeenWarned) {
		if (this.tsid == 'LA5Q57C99OE2GNU' && id == 'hell_01') {
			var loc = apiFindObject('LA524M0OMOE2OGT');
			pc.apiSendAnnouncement({
				uid: "hell_warning",
				type: "vp_overlay",
				duration: 0,
				locking: true,
				width: 500,
				x: '50%',
				top_y: '15%',
				click_to_advance: true,
				click_to_advance_show_text: true, // shows the text prompt next to the advance button
				no_spacebar_advance: true,
				text: [
					'<p align="center"><span class="nuxp_medium">Warning: '+loc.label+' may not be suitable for those with a sensitive disposition. Explorer discretion is advised.</span></p>',
					'<p align="center"><span class="nuxp_medium">Really: we mean it. If seeing gore makes you unhappy, do not go in.</span></p>',
					'<p align="center"><span class="nuxp_medium">'+"This is your final warning. You're on your own from here."+'</span></p>'
				]});
			
			pc.hasBeenWarned = true;
		}
	}
		
	if (this.tsid == 'LIF1QBNPP7123J0' && id == 'key_drop'){
		function find_key(it) { return it.class_tsid=='door_key_1' && it.pc_can_pickup==pc.tsid; }
		if (!pc.achievements_get_daily_label_count('keys_found', 'door_key_1') && !pc.items_has('door_key_1', 1) && this.find_items(find_key).length == 0){
			pc.sendActivity("You found a door key!");

			var remaining = pc.createItemFromGround('door_key_1', 1, true);
			
			if (remaining){
				var door_key = pc.location.createItemStack('door_key_1', 1, pc.x+randInt(200, 400), pc.y-700);
				door_key.pc_can_pickup = pc.tsid;
				door_key.apiSetTimer('expire', 10 * 60 * 1000);
				door_key.label = pc.label + "'s "+door_key.label;
			}

			pc.achievements_increment_daily('keys_found', 'door_key_1');
		}
		
		return true;
	}
	
	if (this.isInstance('tower_quest_headspace')) {
		if (id == 'innermind_vog_interrupt' && !pc['!innermind_vog_interrupt_collided']){
			pc.apiSendAnnouncement({
				uid: "innermind_vog_interrupt",
				type: "vp_overlay",
				duration: 0,
				locking: true,
				width: 500,
				x: '50%',
				top_y: '15%',
				click_to_advance: true,
				click_to_advance_show_text: true, // shows the text prompt next to the advance button
				no_spacebar_advance: true,
				text: [
					'<p align="center"><span class="nuxp_vog_brain">TRAVELLER: EXAMINE THE PATH. WALK THE PATH WITH HEART. THE ONLY WORTHWHILE CHALLENGE IS TO TRAVERSE THE FULL LENGTH.</span></p>',
					'<p align="center"><span class="nuxp_vog_brain">BE AWARE, THIS IS YOUR OWN MIND. DO NOT LITTER.  PLEASE LEAVE IT AS YOU WOULD WISH TO FIND IT. YOUR NEAREST EXIT MAY BE ABOVE YOU.</span></p>',
					'<p align="center"><span class="nuxp_vog_brain">THE ONES WHO CAME BEFORE YOU DID NOT HAVE WHAT YOU HAVE. THEY DID NOT KNOW WHAT YOU KNOW.</span></p>', 
					'<p align="center"><span class="nuxp_vog_brain">KNOWLEDGE IS YOUR RAFT. YOUR PATH IS YOUR OWN. DO NOT GO BACK. DO NOT PASS GO. BE IN YOUR MIND ALWAYS. EVEN WHEN YOU ARE WITHOUT IT.</span></p>'
				]
			});
		
			pc['!innermind_vog_interrupt_collided'] = true;
		} else if (id == "make_squid_appear" && !pc['!make_squid_appear_collided']) {
			/* trigger appearing behavior on squid */
			var squid = pc.findCloseStack('npc_squid');
			if(squid) {
				squid.makeAppear(pc);
			}
			pc['!make_squid_appear_collided'] = true;
		} else if (id == "end_squiddy_convo" && pc['!make_squid_appear_collided'] && !pc['!end_squiddy_convo_collided']) {
			/* trigger appearing behavior on squid */
			var squid = pc.findCloseStack('npc_squid');
			if(squid) {
				squid.finalConvo(pc);
			}
			pc['!end_squiddy_convo_collided'] = true;
		}
	}
	
	if (this.isInstance('tower_quest_crystine') && id == 'crystine_across'){
		pc.instances_cancel_exit_prompt('tower_quest_crystine');
		pc.events_add({ callback: 'instances_create_delayed', tsid: 'LCR8MSVKJI12BOU', instance_id: 'tower_quest_chamber', x: -408, y: -163, options: {no_auto_return: true}}, 0.1);
	}
	
	if (this.isInstance('tower_quest_chamber') && id == 'gwendolyn_chamber_exit') {
		if(pc.getQuestStatus('tower_quest_part3') == 'done' ||
		   pc.getQuestStatus('tower_quest_part3repeat') == 'done') {			
			pc.teleportToLocationDelayed('LTJ10M515812V0C', 102, -534);
		}
	}
	
	if (this.is_game) {
		if (id == 'race_finish') {
			pc.games_win_race();
		} else if (id == 'pig_pen' & pc.announce_has_indicator('has_hogtied_piggy')) {
			pc.games_hogtie_piggy_add_pig();
		}
	}

	if (this.is_race){
		if (id == 'race_finish'){
			return this.race_finish(pc);
		}
		else if (id == 'pig_pen' && pc.announce_has_indicator('has_hogtied_piggy')){

			pc.announce_remove_indicator('has_hogtied_piggy');

			if (!pc['!race_piggies_collected']){
				pc.apiSendAnnouncement({
					uid: "piggy_tip",
					type: "vp_overlay",
					duration: 3000,
					locking: false,
					width: 500,
					x: '50%',
					top_y: '15%',
					click_to_advance: false,
					text: [
						'<p align="center"><span class="nuxp_vog_brain">Nice job! Now, get two more!</span></p>'
					]
				});
			}
			else if (pc['!race_piggies_collected'] == 1){
				pc.apiSendAnnouncement({
					uid: "piggy_tip",
					type: "vp_overlay",
					duration: 2000,
					locking: false,
					width: 500,
					x: '50%',
					top_y: '15%',
					click_to_advance: false,
					text: [
						'<p align="center"><span class="nuxp_vog_brain">Nice job! Now, get one more!</span></p>'
					]
				});
			}
			
			pc['!race_piggies_collected']++;
			this.race_update_piggies_counter(pc);

			if (pc['!race_piggies_collected'] >= 3){
				this.race_finish(pc);
			}

			var piggy = this.createItemStack('npc_piggy', 1, 0, -875);
			if (piggy) piggy.in_pen = true;
		}
	}

	if (id == 'it_game_start'){
		return pc.games_it_game_gate();
	}

	if (id == 'instance_exit' && this.isInstance()){
		var prev = pc.instances_get_exit(this.instance_id);
		if (prev && prev.tsid){
			return pc.teleportToLocationDelayed(prev.tsid, prev.x, prev.y);
		}
	}

	
	// If we're attached to a quest, we may have a quest hitbox callback
	if (this.quests_trigger_hitbox(pc, id)) {
		return true;
	}

	if (config.is_dev || pc.is_god) log.info(pc+' has hit unhandled box: '+id);
}


//
// the following functions are used by the map editor to get connection
// data about a group of interconnected streets. for each street we want
// a list of outgoing connections and some information about them (src
// coords, dst coords, dst tsid, dst name)
//

function getStreetLayout(){

	var out = {};

	out.w = this.geo.r - this.geo.l;
	out.h = this.geo.b - this.geo.t;

	out.links = {};

	for (var j in this.geo.doors){

		var door = this.geo.doors[j];
		var key = 'door_'+j;

		if (door.connect){
			this.formatStreetConn(out.links, key, door, door.connect);
		}
	}

	for (var j in this.geo.signposts){

		var sign = this.geo.signposts[j];
		var key = 'sign_'+j;

		if (!sign.quarter){
			for (var k in sign.connects){

				this.formatStreetConn(out.links, key+'_'+k, sign, sign.connects[k]);
			}
		}
	}

	if (this.mapLocation){
		out.parentStreet = this.mapLocation;
		out.parentPos = this.mapPos;
		out.isOwnable = this.isOwnable ? true : false;
		out.ownerId = this.owner ? this.owner.tsid : null;
		out.ownerName = this.owner ? this.owner.label : null;
	}
	if (this.mapParent){
		out.parentHouse = this.mapParent;
	}

	if (this.cost){
		out.cost = this.cost;
	}

	if (this.jobs_is_street_locked()){
		out.locked = true;
		out.is_available = this.jobs_is_street_available();
	}

	out.has_jobs = this.jobs_has();

	out.quarters = this.getQuarters();

	out.image = this.image;

	return out;
}

function formatStreetConn(out, key, src, con){

	if (!con.target) return;
	if (!con.target.tsid) return;

	var street = con.target;
	var link_info = street.getLinkInfo(con.x, con.y);

	out[key] = {
		'sx' : (src.x - this.geo.l) / (this.geo.r - this.geo.l),
		'sy' : (src.y - this.geo.t) / (this.geo.b - this.geo.t),
		'd' : street.tsid,
		'dx' : link_info.dx,
		'dy' : link_info.dy,
		'dn' : street.label,
	};

	if (link_info.hub_id != this.hubid){
		out[key]['hub'] = link_info.hub_id;
		out[key]['mote'] = link_info.mote_id;
	}else{
		out[key]['same_hub'] = 1;
	}
}

function getLinkInfo(x, y){

	return {
		'mote_id'	: this.moteid,
		'hub_id'	: this.hubid,
		'dx'		: (x - this.geo.l) / (this.geo.r - this.geo.l),
		'dy'		: (y - this.geo.t) / (this.geo.b - this.geo.t),
	};
}

function getClientGeometry() {
	return this.clientGeometry;
}

function cloneGeometry(){
	return utils.copy_gs_object(this.geometry);
}

function replaceGeometry(geo){
	utils.replace_gs_object(this.geometry, geo);
	this.apiGeometryUpdated();
}

function getMapInfo(){

	var map_info = this.get_info();

	//
	// are we inside a building?
	//

	var l = this;
	while (l.mapParent){ l = apiFindObject(l.mapParent); }

	if (l.mapLocation){

		map_info.showStreet = l.mapLocation;
		map_info.showPos = l.mapPos;
	}
	else{
		if (this.instance_of){
			map_info.showStreet = this.instance_of;
		}
	}

	return map_info;
}

function set_house_position(pos){

	this.mapPos = pos;

	return {
		ok: 1,
	};
}

function getConnections(){

	var out = {};

	//
	// incoming links
	//

	var links = this.geo_links_get_incoming();
	for (var i in links){
		var tsid = links[i].street_tsid;

		if (!out[tsid]) out[tsid] = {ins:0, outs:0};
		out[tsid].ins++;
	}


	//
	// outgoing links
	//

	var links = this.geo_links_get_outgoing();
	for (var i=0; i<links.length; i++){
		var tsid = links[i].tsid;

		if (!out[tsid]) out[tsid] = {ins:0, outs:0};
		out[tsid].outs++;
	}

	return out;
}

function getHubPageInfo(){

	var info = this.getMapInfo();

	return {
		// basic naming
		name		: this.label,
		hubid		: this.hubid,
		moteid		: this.moteid,

		// pol/house status
		is_house	: info.showStreet ? true : false,
		parent_tsid	: info.showStreet ? info.showStreet : null,
		street_type	: info.type,
		upgrade_tree	: this.upgrade_tree,

		// connections!
		connections	: this.getConnections(),
		quarters	: this.getQuarters(),

		// jobs
		locked		: this.jobs_is_street_locked(),
		is_available	: this.jobs_is_street_available(),

		image		: this.image,
		image_full	: info.image_full,
		
		// Can this street be rooked?
		rookable	: this.isRookable()
	};
}

function getQuarters(){

	if (!this) return {};
	if (!this.geometry) return {};
	if (!this.geometry.layers) return {};
	if (!this.geometry.layers.middleground) return {};

	var out = {};

	if (this.geo.signposts){
		for (var i in this.geo.signposts){
			var sign = this.geo.signposts[i];

			if (sign.quarter){
				out[sign.quarter]++;
			}
		}
	}

	if (this.geo.doors){
		for (var i in this.geo.doors){
			var door = this.geo.doors[i];

			if (door.quarter){
				out[door.quarter]++;
			}
		}
	}

	return out;
}

function getNonQuarterSignPosts(){

    if (!this) return {};
        if (!this.geo) return {};

        var out = [];
        var sign_x;
        var sign_y
        if (this.geo.signposts){
           for (var i in this.geo.signposts){
               var sign = this.geo.signposts[i];

               if (!sign.quarter){
                   if(sign.x && sign.y){
                        sign_x = sign.x;
                        sign_y = sign.y;
                        if (sign.connects){
                            for (var j in sign.connects){
                                var c = sign.connects[j];

                                if (c.target){

					                out.push({
						            'target'	: c.target,
						            'tsid'		: c.target.tsid,
						            'hub_id'	: c.hub_id,
						            'mote_id'	: c.mote_id,
						            'x'		: sign_x,
                                    'y'		: sign_y,
						            'type'		: 'signpost',
						            'signpost_id'	: i,
						            'connect_id'	: j,
					            });
				            }

                        }
                     }
                   }
               }
           }
        }
    return out;

}


function getQuartersAndDoorsAndSignPosts(){
    if (!this) return {};
    if (!this.geo) return {};

    var out = [];
    var sign_x;
    var sign_y

    var is_quarter = "false";
    if (this.geo.signposts){
        for (var i in this.geo.signposts){
            var sign = this.geo.signposts[i];

            if(sign.x && sign.y){
                sign_x = sign.x;
                sign_y = sign.y;
                if (sign.connects){
                    for (var j in sign.connects){
                        var c = sign.connects[j];
                        if(sign.quarter){
                            is_quarter = "true";
                        } else{
                            is_quarter = "false";
                        }
                        if (c.target){

                            out.push({
                            'target'    : c.target,
                            'tsid'              : c.target.tsid,
                            'hub_id'    : c.hub_id,
                            'mote_id'   : c.mote_id,
                            'x'         : sign_x,
                            'y'         : sign_y,
                            'type'              : 'signpost',
                            'signpost_id'       : i,
                            'connect_id'        : j,
                            'quarter'       : is_quarter,
                            });
                        }

                    }
                }
            }
        }
    }


    var door_x;
    var door_y;
    if (this.geo.doors){
        for (var k in this.geo.doors){

            var door = this.geo.doors[k];
            if (door.connect ){
                if(door.x && door.y){
                    door_x = door.x;
                    door_y = door.y;
                    var c = door.connect;
                    if (c.target){
                        out.push({
                            'target'        : c.target,
                            'tsid'          : c.target.tsid,
                            'hub_id'        : c.hub_id,
                            'mote_id'       : c.mote_id,
                            'x'             : door_x,
                            'y'             : door_y,
                            'type'          : 'door',
                            'door_id'       : k,
                            'connect_id'    : "0",
                        });

                    }
                }
            }
        }
    }
    return out;
}



function createItem(class_id, num, x, y, radius, owner, props){
	var s = this.createAndReturnItem(class_id, num, x, y, radius, null, owner);
	if (!s) return num;
	if (props) {
		for (var i in props) {
			s[i] = props[i];
		}
	}

	var size = s.count;
	if (!size) return 0;

	if (size < num){
		this.createItem(class_id, num-size, x, y, radius);
	}

	return 0;
}

function createAndReturnItem(class_id, num, x, y, radius, only_visible_to, owner){
	var s = apiNewItemStack(class_id, num);
	if (!s) return null;

	if (only_visible_to) s.only_visible_to = only_visible_to;
	if (owner && s.takeable_drop_lock) s.takeable_drop_lock(owner);

	if (radius == undefined){
		var radius = 250;
	}

	if (radius){
		var x_diff = Math.random() * (radius+radius);
		var x = Math.round(x + x_diff - radius);
		if (x <= this.geo.l+200){
			x = this.geo.l+200;
		}
		else if (x >= this.geo.r-200){
			x = this.geo.r-200;
		}
	}
	this.apiPutItemIntoPosition(s, x, y);

	return s;
}

function getItems(){
	return this.items;
}

function getTakeableItems(){
    var items = this.getItems();
    var takeables = [];

    var is_takeable = function(it){
    	if (it.has_parent('takeable') && !it.has_parent('trophy_base')){
			takeables.push({
				'x': it.x,
				'y': it.y,
				'tsid': it.tsid,
				'label': it.label,
				'class_tsid': it.class_tsid,
				'count': it.count
			});
        }
    };
    this.items.apiIterate(is_takeable);
    
    return takeables;
 }

function countItemClass(class_tsid){
	var population = 0;
	this.items.apiIterate(class_tsid, function(it){ population++; });

	return population;
}

function getBags(){
	var bags = {};
	for (var i in this.items){
		if (this.items[i].is_bag){
			bags[i] = this.items[i];
		}
	}

	return bags;
}

function getActivePlayers(){
	return this.activePlayers;
}

function getAllPlayers(){
	return this.players;
}

function getNumActivePlayers(){
	return this.activePlayers.length;
}

function findPlatline(x, y){
	// go lo
	var pl = this.apiGetClosestPlatformLineBelow(x,y);
	if (pl){
		y = pl.y1;
	}
	else{
		// go hi
		var pl = this.apiGetClosestPlatformLineAbove(x,y);

		if (pl){
			y = pl.y1;
		}
	}

	return {
		'x': x,
		'y': y
	};
}

function removeAllItems(){
	this.items.apiIterate(function(item){ item.apiDelete(); });
}

function removeItems(class_id){
	this.items.apiIterate(class_id, function(item){ item.apiDelete(); });
	this.apiSendMsg({type: 'pc_itemstack_verb'});
}

function createItemStackDelayed(class_tsid, num, x, y, delay) {
	if(!this.delayedItems) {
		this.delayedItems = {};
	}
	
	this.delayedItems[time() + delay] = {class_tsid: class_tsid, num: num, x: x, y: y};
	
	this.scheduleNextDelayedItem();
}

function doCreateDelayedItems() {
	for(var i in this.delayedItems) {
		if(i <= time()) {
			this.createItemStack(this.delayedItems[i].class_tsid, this.delayedItems[i].num, this.delayedItems[i].x, this.delayedItems[i].y);
			
			delete this.delayedItems[i];
		}
	}
	
	this.scheduleNextDelayedItem();
}

function scheduleNextDelayedItem() {
	var nextTime = -1;
	this.apiCancelTimer('doCreateDelayedItems');
	
	for(var i in this.delayedItems) {
		if(nextTime == -1 || i < nextTime) {
			nextTime = i;
		}
	}
	
	if(nextTime > 0) {
		this.apiSetTimer('doCreateDelayedItems', (nextTime - time()) * 1000);
	}
}

function createItemStack(class_tsid, num, x, y){

	var stack = apiNewItemStack(class_tsid, num);

	this.apiPutItemIntoPosition(stack, x, y);

	return stack;
}

function createItemStackWithPoof(class_tsid, num, x, y, poof_overlay){
	
	if (!poof_overlay) poof_overlay = 'proto_puff';

	var stack = this.createItemStack(class_tsid, num, x, y);
	
	if (stack) {
		this.apiSendMsg({
			type: 'poof_in',
			itemstack_tsid: stack.tsid,
			swf_url: overlay_key_to_url(poof_overlay)
		});
		this.announce_sound_to_all('PROTO_PUFF');
	}
	
	return stack;
}

function createItemStackFromSource(class_tsid, num, x, y, source){

	var stack = apiNewItemStackFromSource(class_tsid, num, source);

	this.apiPutItemIntoPosition(stack, x, y);

	return stack;
}

function getInfo(){
	return {
		'tsid'		: this.tsid,
		'name'		: this.label,
		'label'		: this.label,
		'moteid'	: this.moteid,
		'hubid'		: this.hubid,
		'image_file'	: this.img_file_versioned,
		'is_instance'	: this.is_instance ? true : false,
		'is_pol'	: this.pols_is_pol(),
	};
}

function run_on_location(f){
	f = eval(f);
	return f(this);
}

function run_on_items(f){
	f = eval(f);
	var out = {};
	for (var i in this.items){
		out[i] = f(this.items[i]);
	}
	return out;
}

function item_exists(class_tsid){
	for (var i in this.items){
		if (this.items[i].class_tsid == class_tsid) return true;
	}

	return false;
}

function find_items(class_tsid, args){
	var is_function = (typeof class_tsid == 'function');

	var items = [];
	for (var i in this.items){
		var it = this.items[i];

		var ok = 0;
		if (is_function) ok = (it && class_tsid(it, args));
		if (!is_function) ok = (it && it.class_tsid == class_tsid) ? true : false;

		if (ok) items.push(this.items[i]);
	}

	return items;
}

function find_items_including_bags(class_tsid, args){
	var is_function = (typeof class_tsid == 'function');

	var items = [];
	for (var i in this.items){
		var it = this.items[i];

		var ok = 0;
		if (is_function) ok = (it && class_tsid(it, args));
		if (!is_function) ok = (it && it.class_tsid == class_tsid) ? true : false;

		if (ok) items.push(this.items[i]);

		if (!ok && it.is_bag){
			var tmp = items.concat(it.findItemClass(class_tsid, args));
			items = tmp;
		}
	}

	return items;
}

function count_items(class_tsid, args){
	var is_function = (typeof class_tsid == 'function');

	var count = 0;
	for (var i in this.items){
		var it = this.items[i];

		var ok = 0;
		if (is_function) ok = (it && class_tsid(it, args));
		if (!is_function) ok = (it && it.class_tsid == class_tsid) ? true : false;

		if (ok) count += this.items[i].getCount();
	}

	return count;
}

function count_items_including_bags(class_tsid, args){
	var is_function = (typeof class_tsid == 'function');

	var count = 0;
	for (var i in this.items){
		var it = this.items[i];

		var ok = 0;
		if (is_function) ok = (it && class_tsid(it, args));
		if (!is_function) ok = (it && it.class_tsid == class_tsid) ? true : false;

		if (ok) count += this.items[i].getCount();
		
		if (!ok && it.is_bag){
			count += it.countItemClass(class_tsid, args);
		}
	}

	return count;
}

function get_item_counts_including_bags(){

	var items = {};

	for (var i in this.items){
		var it = this.items[i];
		if (!items[it.class_tsid]) items[it.class_tsid] = 0;
		items[it.class_tsid] += it.getCount();

		if (it.is_bag){
			var sub_items = it.get_item_counts(true);
			for (var j in sub_items){
				if (!items[j]) items[j] = 0;
				items[j] += sub_items[j];
			}
		}
	}
	
	return items;
}

function get_quoin_count(){
	function valid_quoin(it, args){ return it.class_tsid == 'quoin' && it.spawned ? true : false; }
	return this.count_items(valid_quoin);
}


function isInstance(instance_id){
	if (instance_id) return this.instance_id == instance_id;
	return this.is_instance ? true : false;
}

function set_instance_id(instance_id, instance){
	this.is_instance = true;
	this.instance_id = instance_id;
	this.instance = instance;
}



function get_info(){

	//
	// return basic stats about this location
	//

	var ret = {
		tsid				: this.tsid,
		name				: this.label,
		image				: this.image,

		mote_id				: this.moteid,
		moteId				: this.moteid,

		mote_name			: config.data_maps.motes[this.moteid] ? config.data_maps.motes[this.moteid].name : '',
		moteName			: config.data_maps.motes[this.moteid] ? config.data_maps.motes[this.moteid].name : '',

		hub_id				: this.hubid,
		hubId				: this.hubid,

		hub_name			: config.data_maps.hubs[this.hubid] ? config.data_maps.hubs[this.hubid].name : '',
		hubName				: config.data_maps.hubs[this.hubid] ? config.data_maps.hubs[this.hubid].name : '',

		type				: this.pols_is_pol() ? 'pol' : this.pols_is_building() ? 'house' : 'street',

		swf_file_versioned		: this.getVersionedSwf(),
		img_file_versioned		: this.img_file_versioned
	};

	if (ret.image && ret.image.url){
		ret.image_full = utils.copy_hash(ret.image);
		ret.image_full.url = 'http://c2.glitch.bz/' + ret.image_full.url;
	}

	return ret;
}

function get_client_info(){

	//
	// return basic data about this location for messaging to client.
	// this hash looks just like the (client-formatted) connect object on doors & signposts.
	//

	var info = this.get_info();

	var pol_img_url = null;
	var is_pol = this.pols_is_pol();
	if (is_pol){
		var pol_img_url = this.pols_get_ext_img_full();
	}

	var ret = {
		street_tsid		: info.tsid,
		label			: info.name,
		mote_id			: info.mote_id,
		hub_id			: info.hub_id,
		swf_file_versioned	: info.swf_file_versioned,
		img_file_versioned	: info.img_file_versioned,
		pol_img_150		: pol_img_url,
		image 			: info.image
	};

	if (info.image_full) ret.image_full = info.image_full;

	return ret;

}

function get_door_info(){

	//
	// this function is used when we need to build
	// the geometry of doors linking to this location.
	// we do it in one function to avoid multiple round
	// trips.
	//

	return {
		'img_file_versioned'	: this.img_file_versioned,
		'for_sale'		: this.pols_is_for_sale() ? true : false,
		'owner'			: this.pols_get_owner(),
		'house_number'		: intval(this.house_number) + intval(this.floor_number),
		'swf_file_versioned'	: this.getVersionedSwf(),
	};
}

function get_signpost_info(){

	//
	// see the above function...
	//

	return {
		'ok'			: 1,
		'label'			: this.label,
		'img_file_versioned'	: this.img_file_versioned,
		'swf_file_versioned'	: this.getVersionedSwf(),
	};
}


//
// move all players in this location to somewhere else
//

function remove_players(to_tsid, to_x, to_y){

	log.info('all players in loc', this.players);

	for (var i in this.players){

		log.info('teleporting player '+this.players[i].tsid);

		var ret = this.players[i].teleportToLocation(to_tsid, to_x, to_y);
		if (!ret.ok) return ret;
	}

	return {
		ok : 1,
	};
}

function setAllowSync(allow_sync){
	if (allow_sync){
		delete this.no_sync;
	}else{
		this.no_sync = true;
	}
}

function web_sync(){
	if (this.no_sync) return;
	utils.http_get_world('callbacks/street_create.php', {
		tsid : this.tsid,
		mote_id : this.moteid,
		hub_id : this.hubid,
		name : this.label,
	});
}

function web_sync_deleted(){
	utils.http_get_world('callbacks/street_delete.php', {
		tsid : this.tsid,
	});
}


//
// Be aware that the GS code calls this method directly.
// Ensure the GS code is updated if this signature is changed,
//

function prep_geometry(pc){

	//
	// we try to reduce roundtrips by making exactly one
	// call to each door/sign destination. those calls make
	// no further calls.
	//

	var geo = this.getClientGeometry();

	geo.swf_file_versioned = this.getVersionedSwf();
	geo.img_file_versioned = this.img_file_versioned;

	if (geo.layers && geo.layers.middleground){
		for (var j in geo.layers.middleground.doors){

			var door = geo.layers.middleground.doors[j];

			if (door.quarter){

				var quarter = apiFindObject(door.quarter);
				if (quarter){
					var ret = quarter.formatDoor(this.tsid);
					door.connect = ret.connect;
				}else{
					door.connect = {};
				}

			}else if (door.destinations && num_keys(door.destinations)){
				door.connect = {
					x 		: 0,
					y 		: 0,
					mote_id	: 0,
					hub_id	: 0,
					label 	: 'An Unknown Destination',
					street_tsid : (door.connect ? door.connect.street_tsid : null)
				};

			}else{

				if (door.connect && door.connect.street_tsid){
					var target = apiFindObject(door.connect.street_tsid);
					if (!target){
						continue;
					}
					
					var target_info = target.get_door_info();

					door.connect.swf_file_versioned	= target_info.swf_file_versioned;
					door.connect.img_file_versioned	= target_info.img_file_versioned;
					door.for_sale			= target_info.for_sale;
					door.house_number		= target_info.house_number;

					if (target_info.owner){
						door.owner_tsid		= target_info.owner.tsid;
						door.owner_label	= utils.escape(target_info.owner.label);
					}else{
						delete door.owner_tsid;
						delete door.owner_label;
					}

					door.is_locked = this.locked_doors_isLocked(door) ? true : false;
				}
			}
		}

		for (var j in geo.layers.middleground.signposts){

			var sign = geo.layers.middleground.signposts[j];

			if (sign.quarter){

				var quarter = apiFindObject(sign.quarter);
				if (quarter){
					var ret = quarter.formatSignpost(this.tsid);
					sign.connects = ret.connects;
					sign.quarter_info = ret.quarter;
				}else{
					sign.connects = {};
				}
			}
			else if (sign.instance_exit){
				sign.connects = {
					0: {
						x 		: 0,
						y 		: 0,
						mote_id	: 0,
						hub_id	: 0,
						label 	: 'Exit',
						street_tsid : ((sign.connects && sign.connects[0]) ? sign.connects[0].street_tsid : null)
					}
				};
			}else{

				for (var k in sign.connects){

					var target = apiFindObject(sign.connects[k].street_tsid);
					if (!target){
						continue;
					}

					var target_info = target.get_signpost_info();

					sign.connects[k].swf_file_versioned = target_info.swf_file_versioned;
					sign.connects[k].img_file_versioned = target_info.img_file_versioned;
				}
			}
		}
	}


	//
	// fetch map information and the actual map data
	//

	geo.mapInfo = this.getMapInfo();
	geo.mapData = this.get_map(pc);

	// anything stuck in temp will get stripped out when the location is saved in main.js with an edit_location msg
	geo.temp = {
		physics_configs: config.physics_configs
	}

	geo.rooked_status = this.getRookedStatus();


	//
	// Determing whether this is an instance template and we should warn the user
	//

	if (this.moteid == 10 || this.instances_instance_me() || this.tsid == 'LTJ101M7R9O1HTT' || this.isPOLTemplate()){
		if (!this.isInstance()){
			geo.is_template = true;
		}
		else{
			delete geo.is_template;
		}


	}
	else{
		delete geo.is_template;
	}

	//
	// overrides need to be 0 or 1 (not false and true)
	//

	var hide_pack_override = this.hideUIOnLoad('pack');
	if (hide_pack_override) {
		geo.no_pack_overide = 1;
	} else {
		delete geo.no_pack_overide;
	}

	//
	// Some flags we always want on certain types of locations
	//
	// PLEASE NOTE! Any of these no_* flags that get put on the location before
	// sending to client WILL be saved to the geo file when the client saves.
	// If you do not wish the value to be saved to geo, talk to Eric and we can
	// set up a np_*_override prop for the flag, which will override the geo flag
	// and not get saved. Exceptions are noted below.
	
	var hide_account_required_features = (pc && (pc.quickstart_needs_player || pc.quickstart_needs_avatar || pc.quickstart_needs_account));
	if (hide_account_required_features) {
		geo.no_account_required_features = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_account_required_features;
	}
	
	var hide_furniture_bag = this.hideUIOnLoad('furniture_bag', pc);
	if (hide_furniture_bag) {
		geo.no_furniture_bag = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_furniture_bag;
	}
	
	var hide_swatches_button = this.hideUIOnLoad('swatches_button', pc); // do some check here on the player to see if they are still in newxp before this button is shown
	if (hide_swatches_button) {
		geo.no_swatches_button = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_swatches_button;
	}
	
	var hide_expand_buttons = this.hideUIOnLoad('expand_button', pc); // do some check here on the player to see if they are still in newxp before these buttons are shown
	if (hide_expand_buttons) {
		geo.no_expand_buttons = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_expand_buttons;
	}
	
	var hide_mood = this.hideUIOnLoad('mood', pc); // do some check here on the player to see if they are still in newxp before this is shown
	if (hide_mood) {
		geo.no_mood = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_mood;
	}
	
	var hide_energy = this.hideUIOnLoad('energy', pc); // do some check here on the player to see if they are still in newxp before this is shown
	if (hide_energy) {
		geo.no_energy = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_energy;
	}
	
	var hide_imagination = this.hideUIOnLoad('imagination', pc); // do some check here on the player to see if they are still in newxp before this is shown
	if (hide_imagination) {
		geo.no_imagination = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_imagination;
	}
	
	var hide_decorate_button = this.hideUIOnLoad('decorate_button', pc); // do some check here on the player to see if they are still in newxp before this is shown
	if (hide_decorate_button) {
		geo.no_decorate_button = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_decorate_button;
	}
	
	var hide_cultivate_button = this.hideUIOnLoad('cultivate_button', pc); // do some check here on the player to see if they are still in newxp before this is shown
	if (hide_cultivate_button) {
		geo.no_cultivate_button = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_cultivate_button;
	}

	var hide_current_location = this.hideUIOnLoad('current_location', pc); // do some check here on the player to see if they are still in newxp before this is shown
	if (hide_current_location) {
		geo.no_current_location = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_current_location;
	}

	var hide_currants = this.hideUIOnLoad('currants', pc);
	if (hide_currants) {
		geo.no_currants = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_currants;
	}

	var hide_inventory_search = this.hideUIOnLoad('inventory_search', pc);
	if (hide_inventory_search) {
		geo.no_inventory_search = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_inventory_search;
	}

	var no_skill_learning = this.hideUIOnLoad('skill_learning', pc);
	if (no_skill_learning) {
		geo.no_skill_learning = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_skill_learning;
	}

	// Some templates have this property set explicitly, so skip this logic if they do
	if (!geo.no_map){
		var hide_map = this.hideUIOnLoad('map', pc);
		if (hide_map) {
			geo.no_map = true; // this is a dynamic prop and will NOT be saved to the location by the client
		} else {
			delete geo.no_map;
		}
	}

	var hide_world_map = this.hideUIOnLoad('world_map', pc);
	if (hide_world_map) {
		geo.no_world_map = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_world_map;
	}

	var no_home_street_visiting = this.hideUIOnLoad('home_street_visiting', pc);
	if (no_home_street_visiting) {
		geo.no_home_street_visiting = true; // this is a dynamic prop and will NOT be saved to the location by the client
	} else {
		delete geo.no_home_street_visiting;
	}

	
	if (this.is_race || this.is_game){
		geo.no_familiar = true;
		geo.no_ambient_music = true;
		geo.no_hubmap = true;
		geo.no_starting_quests = true;
	}

	if (this.is_party_space){
		geo.no_hubmap = true;
		geo.no_starting_quests = true;
	}

	if (this.isMountain && this.isMountain()) { 
		log.info("MT disabling pc interaction");
		geo.no_pc_interactions = true;
	}
	
	if (this.isGreetingLocation()){
		geo.no_familiar = true;
	}

	if (this.pols_is_pol()){
		geo.is_pol = true;
		geo.is_home  = this.is_home ? true : false;
	}

	if (this.isInstance()){
		geo.is_instance = true;
	}
	else{
		delete geo.is_instance;
	}

	geo.is_decoratable = false;
	var home_type = this.homes_get_type();
	if (home_type) {
		geo.home_type = home_type;
		if (pc && this.owner && this.owner.tsid == pc.tsid){
			// this prop will not get saved by the client, since it's user-specific
			if (home_type == 'interior') geo.is_decoratable = true;
			if (home_type == 'tower') geo.is_decoratable = true;
		}
	} else {
		delete geo.home_type;
	}


	//
	// Perform custom callbacks
	//

	if (this.prep_geometry_callback) this.prep_geometry_callback(pc);

	if (geo.no_map) geo.no_hubmap = true;

	return geo;
}

function get_geo_bounds(){

	return {
		l: this.geo.l,
		r: this.geo.r,
		t: this.geo.t,
		b: this.geo.b,
	};
}


//
// Send the location geometry to all connected players in this location
//

function send_client_geometry(){
	var rsp = {
		type: "location_rerender",
		location: this.prep_geometry()
	};

	for (var i in this.activePlayers){
		try{
			this.activePlayers[i].apiSendMsg(rsp);
		}
		catch(e){
			log.error("Cannot send client geometry to "+i);
		}
	}
}

// Returns true if this street counts as a unique street for the purposes of the exploration achievements.
function countsTowardHubAchievement(pc) {
	
	// Don't count POLs, transit stations, quarter parent streets.
	if (this.pols_is_pol() || this.quarter_tsid || this.transit_is_station()){
		return false;
	}
		
	// Don't count apartment lobbies
    if (this.is_apartment_lobby()) return false;
	
	// Don't count machine rooms
	if (this.is_machine_room()) return false;
	
	// Don't count start streets
	if (this.isGreetingLocation()) return false;
		
	// Otherwise count everything that's in the map 
	var maps = config.data_maps.maps;
	if (!maps[this.hubid]) return false;

	for (var i in maps[this.hubid].objs){
		var o = maps[this.hubid].objs[i];

		if (o.tsid == this.tsid){
			return true;
		}
		else if (this.instance_of && this.instance_of == o.tsid) {
			return true;
		}
	}
	
	// Special case for locations that aren't in the map.
	if ((this.tsid == 'LCR1516SFHM122V') 		// Vicar's Peak
		|| (this.tsid == 'LCR14T7ECHM18G8'))	// Martleby Hare
	{
		return true;
	}
	
	// If we get here, it's not in the map.
	return false;
}
	
function is_hidden(){
	if (config.is_dev) return false;

	if (this.pols_is_pol() && this.pols_get_owner_type() == 2){
		var info = this.pols_get_owner().get_basic_info();
		if (info.mode == 'private') return true;
		return false;
	}

	if (this.hubid == 129 || this.hubid == 132 || this.hubid == 81) return true;

	if (this.is_instance || this.pols_is_pol() || this.quarter_tsid || this.transit_is_station()){
		return false;
	}

	var maps = config.data_maps.maps;
	if (!maps[this.hubid]) return true;

	for (var i in maps[this.hubid].objs){
		var o = maps[this.hubid].objs[i];

		if (o.tsid == this.tsid){
			if (o.type == 'X'){
				return true;
			}

			if (o.type == 'SL'){
				if (!this.jobs_is_street_locked()){
					return false;
				}
				else {
					return true;
				}
			}

			return false;
		}
	}

	// Handle apartment lobbies, which are hidden on the map on purpose
    if (this.is_apartment_lobby()) return false;
    if (this.tsid == 'LM4118MEHFDMM') return false; // Uncle friendly's emporium
    if (this.tsid == 'LHV38BSD7G32CMQ' || this.tsid == 'LHV3O6D3AG32NTH') return false; // Model homes
    if (this.tsid == 'LDOLMQFMNOS24AJ' || this.tsid == 'LDODG1KQLOS2GNO' || this.tsid == 'LUVNMB7AOOS28EK') return false; // Enchanted forests
    if (this.tsid == 'LHVEI9NVJ203LRO' || this.tsid == 'LHV6HOCAH203RMF' || this.tsid == 'LA9EBPF8M2031HB' || this.tsid == 'LIF84CCRN203N7P' || this.tsid == 'LDONEDVHC4030KF') return false; // Apt basements
    if (in_array_real(this.tsid, config.machine_rooms)) return false;


	return true;
}

var tower_streets = [77, 79];
var keylocked_streets = ['LDOU5PQU0FD21PF', 'LA9154LI9R22R7A'];

function get_map(pc){
	var maps = config.data_maps.maps;
	if (!config.data_maps.cache) config.data_maps.cache = {};
	var cache = config.data_maps.cache;

	//
	// Get everything that appears on a map
	//

	var all = {};

	var god_sees_all = (pc && pc.is_god) ? true : false;

	for (var hub_id in maps){
		if (!maps[hub_id] || !maps[hub_id].objs) continue;

		var has_available_streets = false;

		if (in_array_real(hub_id, config.public_hubs)){
			all[hub_id] = {
				name: config.data_maps.hubs[hub_id].name,
				streets: {}
			};
		}

		for (var i in maps[hub_id].objs){
			if (!all[hub_id] && !god_sees_all) continue;
			
			var o = maps[hub_id].objs[i];

			if (o.type != 'X'){

				// Locked streets get checked and rewritten here
				if (cache[hub_id] && cache[hub_id][o.tsid]){
					//log.info(this+' getting loc '+o.tsid+' from cache');
					for (var k in cache[hub_id][o.tsid]){
						o[k] = cache[hub_id][o.tsid][k];
					}

					if (!o.invisible_to_outsiders) has_available_streets = true;
				}
				else if (o.type == 'SL'){
					//log.info(this+' adding hub '+hub_id+' to cache');
					if (!cache[hub_id]) cache[hub_id] = {};
					
					var l = apiFindObject(o.tsid);

					var did_o = false;

					try{
						if (!l.jobs_is_street_locked()){
							o.type = 'S';
							o.not_a_destination = false;
							o.invisible_to_outsiders = false;

							//log.info(this+' adding loc '+o.tsid+' to unlocked cache');
							cache[hub_id][o.tsid] = {
								type: o.type,
								not_a_destination: o.not_a_destination,
								invisible_to_outsiders: o.invisible_to_outsiders
							};
							did_o = true;
							has_available_streets = true;
						}
						else if (!l.jobs_is_street_available()){
							//delete maps[hub_id].objs[i];
							o.not_a_destination = true;
							o.invisible_to_outsiders = true;

							//log.info(this+' adding loc '+o.tsid+' to unavailable cache');
							cache[hub_id][o.tsid] = {
								not_a_destination: o.not_a_destination,
								invisible_to_outsiders: o.invisible_to_outsiders
							};
							did_o = true;
						}
					} catch(e){}
					if (!did_o){
						o.not_a_destination = true;
						o.invisible_to_outsiders = false;

						//log.info(this+' adding loc '+o.tsid+' to available cache');
						cache[hub_id][o.tsid] = {
							not_a_destination: o.not_a_destination,
							invisible_to_outsiders: o.invisible_to_outsiders
						};

						has_available_streets = true;
					}
				}
				else if (o.type == 'S'){
					has_available_streets = true;
				}

				// Check if greeting location
				if (!o.not_a_destination || !o.invisible_to_outsiders){
					for (var j=0; j<config.greeting_locations.length; j++){
						if (o.tsid == config.greeting_locations[j].tsid){
							o.not_a_destination = true;
							o.invisible_to_outsiders = true;
						}
					}
				}
				
				// Tower streets and keylocked streets are not destinations
				if (in_array_real(hub_id, this.tower_streets)){
					o.not_a_destination = true;
				}
				else if (in_array_real(o.tsid, this.keylocked_streets)){
					o.not_a_destination = true;
				}

				if (all[hub_id] && !o.invisible_to_outsiders && o.type == 'S'){
					all[hub_id].streets[o.tsid] = config.data_maps.streets[config.data_maps.hubs[hub_id].mote_id][hub_id][o.tsid];
				}
			}
		}

		if (!has_available_streets) delete all[hub_id];
		if (all[hub_id]) all[hub_id].has_available_streets = has_available_streets;
	}

	//
	// Now just this hub
	//

	var map = utils.copy_hash(maps[this.hubid]);
	if (!map) map = {};

	var tsid_to_index = {};
	// assign labels
	for (var i in map.objs){
		var o = map.objs[i];

		tsid_to_index[o.tsid] = i;

		// Locked/unlocked streets are now handled by the code above

		// x links need hub, mote & color
		if (o.type == 'X'){
			if (!config.data_maps.maps[o.hub_id]) continue;

			if (!o.hub) o.hub = config.data_maps.hubs[o.hub_id].name;
			if (!o.mote) o.mote = config.data_maps.motes[o.mote_id].name;
			if (!o.color) o.color = config.data_maps.maps[o.hub_id].color;
		}else{
			// S objects need their name
			if (!o.name) o.name = config.data_maps.streets[this.moteid][this.hubid][o.tsid];

			if (!o.shrine){
				var shrine = config.map_shrines[o.tsid];
				if (shrine) o.shrine = shrine;
			}

			if (!o.store){
				var store = config.map_stores[o.tsid];
				if (store) o.store = store;
			}

			delete o.not_visited;
			delete o.visited;
			if (pc && pc.is_player && (pc.counters_get_label_count('locations_visited', o.tsid) || pc.counters_get_label_count('hidden_locations_visited', o.tsid))){
				o.visited = true;
			}

			// Gentle Island
			if (this.hubid == 129) o.no_info = true;
		}
	}
	

	//
	// Attach the full listing of streets
	//

	map.all = all;
	
		
	//
	// Build transit maps
	//
	
	map.transit = {
		0: {
			tsid: "subway",  // mode of transportation
			name: "Subway System",
			lines: [
			]
		}
	};
	
	for (var i in config.transit_instances){
		if (config.transit_instances[i].type != 'subway') continue;

		var forwards = {
			tsid: i+'_forwards',
			name: config.transit_instances[i].forwards_name,
			bg: config.transit_instances[i].map_background_url,
			fg: config.transit_instances[i].map_forwards_url,
			locations: [
			]
		};
		
		var backwards = {
			tsid: i+'_backwards',
			name: config.transit_instances[i].backwards_name,
			bg: config.transit_instances[i].map_background_url,
			fg: config.transit_instances[i].map_backwards_url,
			locations: [
			]
		};
		
		for (var j in config.transit_instances[i].stations){
			var stop = config.transit_instances[i].stations[j];
			forwards.locations.push({
				name: stop.name,
				tsid: stop.tsid,
				station_tsid: stop.connects_to,
				x: stop.map_pos[0],
				y: stop.map_pos[1] 
			});
			
			backwards.locations.push({
				name: stop.name,
				tsid: stop.tsid,
				station_tsid: stop.connects_to,
				x: stop.map_pos[0],
				y: stop.map_pos[1] 
			});

			if (stop.connects_to){
				if (tsid_to_index[stop.connects_to]){
					map.objs[tsid_to_index[stop.connects_to]].has_subway = true;
				}
			}
		}
		
		backwards.locations.reverse();
		
		map.transit[0].lines.push(forwards);
		map.transit[0].lines.push(backwards);
	}

	map.world_map = overlay_key_to_url('world_map');

	return map;
}


// teleport all players in this location to their home location.
// should be used when a street is not supposed to be in production, etc.

function evacuatePlayers(random){

	var done = {
		offline: [],
		online: [],
	};

	var is_home = this.getProp('is_home') ? true : false;

	for (var i in this.players){
		if (!this.players[i]) continue;

		if (apiIsPlayerOnline(i)){
			this.players[i].sendActivity("This location is being evacuated...");
			done.online.push(i);
		}else{
			done.offline.push(i);
		}

		if (is_home){
			this.players[i].apiSetTimer('houses_leave', 500);
		}
		else if (random){
			this.players[i].apiSetTimer('teleportSomewhere', 500);
		}else{
			this.players[i].apiSetTimer('teleportHome', 500);
		}
	}

	return done;
}

function getFractionalPosition(x){

	var l = this.geo.l;
	var r = this.geo.r;
	return (x-l) / (r-l);
}

// http://svn.tinyspeck.com/wiki/Street_Loading_Screen#Client.2FServer_messaging
function getLoadingInfo(pc, no_formatting){

	//
	// Gather all the data we'll need
	//

	var info = this.getMapInfo();

	var is_instance = this.isInstance();
	var is_pol = this.pols_is_pol();
	var is_quarter = this.quarter_tsid ? true : false;

	var location_tsid = this.tsid;
	if (!is_instance && is_pol){
		var visits_count = pc ? pc.counters_get_label_count('pols_visited', this.tsid) : 0;
		var pols_count = pc ? pc.counters_get_group_count('pols_visited') : 0;
	}
	else if (!is_instance || this.instance_of){
		if (this.instance_of) location_tsid = this.instance_of;
		if (!is_quarter && !this.transit_is_station() && !this.is_machine_room() && !this.isGreetingLocation()){
			var visits_count = pc ? pc.counters_get_label_count('locations_visited', location_tsid) : 0;
			var locations_count = pc ? pc.counters_get_group_count('locations_visited') : 0;
		}
		else{
			var visits_count = pc ? pc.counters_get_label_count('hidden_locations_visited', location_tsid) : 0;
			var locations_count = pc ? pc.counters_get_group_count('locations_visited') : 0;
		}
	}
	else{
		var visits_count = 0;
		var locations_count = 0;
	}

	var last_visit = pc ? pc.stats_get_last_street_visit(location_tsid) : 0;
	var last_visit_mins = last_visit ? Math.round((time() - last_visit) / 60) : 0;

	var completed_jobs = 0;
	var inprogress_jobs = 0;

	var last_upgrade_time = 0;
	var last_upgrade_mins = 0;
	var last_upgrade_leaderboard = {};

	var last_unlock_time = 0;
	var last_unlock_mins = 0;
	var last_unlock_leaderboard = {};
	var last_unlock_contributors = 0;

	var jobs = this.jobs_get_all();
	for (var i in jobs){
		var job = jobs[i];
		if (job){
			var job_type = job.getProp('type');
			
			if (job.isDone()){
				completed_jobs++;

				if (job_type == 2){
					last_upgrade_time = intval(job.getProp('ts_done'));
					last_upgrade_mins = last_upgrade_time ? Math.round((time() - last_upgrade_time) / 60) : 0;

					var total_bc = job.getTotalBasecost();
					var sorted = job.getSortedContributors();

					for (var i=0; i<sorted.length; i++){
						if (num_keys(last_upgrade_leaderboard) < 3){
							var player = apiFindObject(sorted[i].pc_tsid);
							if (player){
								try{
									last_upgrade_leaderboard[i] = {
										'position': i+1,
										'pc': {
											tsid: player.tsid,
											label: player.label
										},
										'contributions': Math.round(sorted[i].base_cost / total_bc * 10000) / 100
									};
								}
								catch(e){
									log.error(this+' exception fetching contributor data for '+pc+': '+e);
								}
							}
						}

						if (last_upgrade_leaderboard.length >= 3) break;
					}
				}
				else if (job_type == 1){
					if (job.getPrimaryLocation().tsid == this.tsid && job.isFinalPhase()){
						last_unlock_time = intval(job.getProp('ts_done'));
						last_unlock_mins = last_unlock_time ? Math.round((time() - last_unlock_time) / 60) : 0;
						last_unlock_contributors = 0;

						var sorted = [];
						var total_bc = 0;
						var phases = job.getAllPhases();
						for (var p in phases){
							var instance = phases[p].instance;
							if (!instance) continue;

							total_bc += instance.getTotalBasecost();
							var contributions = instance.getContributions();
							for (var pc_tsid in contributions){
								if (!contributions[pc_tsid]) continue;
								var pre_existing = false;
								for (var i=0; i<sorted.length; i++){
									if (sorted[i].pc_tsid == pc_tsid){
										sorted[i].base_cost += contributions[pc_tsid];
										pre_existing = true;
									}
								}

								if (!pre_existing){
									sorted.push({pc_tsid: pc_tsid, base_cost: contributions[pc_tsid]});
									last_unlock_contributors++;
								}
							}
						}
						
						function contributorSort(a, b){
							return b['base_cost'] - a['base_cost'];
						};
						sorted.sort(contributorSort);

						for (var i=0; i<sorted.length; i++){
							if (num_keys(last_unlock_leaderboard) < 3){
								var player = apiFindObject(sorted[i].pc_tsid);
								if (player){
									try{
										last_unlock_leaderboard[i] = {
											'position': i+1,
											'pc': {
												tsid: player.tsid,
												label: player.label
											},
											'contributions': Math.round(sorted[i].base_cost / total_bc * 10000) / 100
										};
									}
									catch(e){
										log.error(this+' exception fetching contributor data for '+pc+': '+e);
									}
								}
							}

							if (last_unlock_leaderboard.length >= 3) break;
						}
					}
				}
			}
			else if (job.isStarted() && !this.jobs[i].street_info.is_hidden && job_type < 3){
				inprogress_jobs++;
			}
		}
	}


	//
	// Build the basic response
	//

	var rsp = {
		to_tsid: this.tsid,  //tsid of where we are going to
		first_visit: (!is_instance && visits_count == 0) ? true : false,  //is the player's first time in the location?
		xp: 0,  //if this was the first time, then how much xp to give
		last_visit_mins: last_visit_mins,  //time in minutes since last visit
		visit_count: visits_count,  //how many times the player has been here
		street_name: this.label,
		hub_name: is_instance ? '' : config.data_maps.hubs[this.hubid] ? config.data_maps.hubs[this.hubid].name : '',
		loading_img: {},
		street_details: {
			active_project: (inprogress_jobs > 0) ? true : false,  //if there is a job on the street in progress
			features: []
			//features: { //an order of features for the "home to:" part
			//	0: 'A street spirit named <b>Johnny McSwifty</b> selling <b>Cooking Goods</b>.',
			//	1: 'A shrine dedicated to <b>Lem</b>.',
			//	2: 'Plus <b>3 Piggies</b>, <b>2 Butterflies</b>, <b>2 Cherry Trees</b>, <b>2 Patches</b>, a <b>Bubble Tree</b>, and <b>24 Houses (2 for sale)</b>'
			//}
		},
		upgrade_details: {  //details on the latest upgrade only
			upgrade_since_last_visit: (last_upgrade_mins && visits_count != 0 && last_visit_mins > last_upgrade_mins) ? true : false,  //if player has been here before and there was an upgrade
			mins: last_upgrade_mins,  //time in mins since the last upgrade was complete
			leaderboard: last_upgrade_leaderboard  //leaderboard hash like job_leaderboard with the top 3 leaders
		},
		unlock_details: {  //details on the latest unlock only
			mins: last_unlock_mins,  //time in mins since the last unlock was complete
			leaderboard: last_unlock_leaderboard, // leaderboard hash like job_leaderboard with the top 3 leaders
			contributors: last_unlock_contributors // how many total contributors?
		},
		is_basic: false,
	};

	if ((!is_instance || this.instance_of) && visits_count == 0 && pc && !is_pol && !is_quarter && !this.transit_is_station() && !this.is_machine_room() && !this.isGreetingLocation()){
		//rsp.xp = pc.stats_at_level_cap() ? 0 : Math.round(pc.stats_get_level() * 2 * pc.stats_get_xp_mood_bonus());

		if (visits_count == 0 && pc.achievements_get_daily_label_count('qurazy_found', this.tsid) < 5){
			var markers = this.find_items('marker_qurazy');
			if (markers && markers.length){
				rsp.qurazy_here = true;
			}
		}
	}


	//
	// colors come from the hub
	//

	var hub_data = config.data_maps.hubs[this.hubid];
	if (hub_data){
		rsp.top_color = hub_data.top_color;
		rsp.bottom_color = hub_data.btm_color;
	}


	//
	// grab loading image
	//

	if (this.upgrade_template && !this.template){
		this.template = this.upgrade_template;
	}

	if (!this.loading_image && this.template){
		var template = apiFindObject(this.template);
		if (template){
			var img = template.getProp('loading_image');
			if (img){
				this.loading_image = img;
			}
		}
	}

	if (this.loading_image && this.loading_image.url){

		rsp.loading_img = utils.copy_hash(this.loading_image);
		rsp.loading_img.url = 'http://c2.glitch.bz/'+rsp.loading_img.url;
	}

	if (this.special_loading_image && this.special_loading_image.url){

		rsp.loading_img = utils.copy_hash(this.special_loading_image);
		rsp.loading_img.url = 'http://c2.glitch.bz/'+rsp.loading_img.url;
		rsp.is_basic = true;
		rsp.top_color = '#ffffff';
		rsp.bottom_color = '#ffffff';
	}

	if (this.pols_is_pol() && this.is_home && !this.special_loading_image){
		rsp.owner_info = this.owner ? this.owner.make_hash_with_location() : {};
		rsp.pol_type = this.homes_get_type();

		if (rsp.pol_type == 'tower'){
			var custom_name = this.tower_get_custom_name();
			rsp.custom_name = custom_name ? utils.escape(custom_name) : null;
		}

		if (rsp.pol_type == 'exterior'){
			rsp.neighbors = {};
			var neighbors = this.getNeighbors();
			for (var i in neighbors){
				var n = neighbors[i];
				if (!n) continue;

				rsp.neighbors[n.tsid] = n.make_hash_with_location();
			}
		}
	}


	if (!this.no_street_features){
		//
		// Add street features
		//

		var shrine = null;
		var street_spirit = null;
		var vendor = null;
		var piggy_count = 0;
		var butterfly_count = 0;
		var batterfly_count = 0;
		var chicken_count = 0;
		var sloth_count = 0;
		var chick_count = 0;
		var piglet_count = 0;
		var caterpillar_count = 0;
		var patch_count = 0;
		var dark_patch_count = 0;
		var firefly_count = 0;
		var jellisac_count = 0;
		var barnacle_count = 0;
		var peat_count = 0;
		var dirt_count = 0;
		var nubbin_count = 0;
		var salmon_count = 0;
		var trants = {};
		var rocks = {};
		var gardens = {};
		var cabinets = {};

		for (var i in this.items){
			try {
				var it = this.items[i];
				
				if (it.class_id == 'street_spirit' || it.class_id == 'street_spirit_groddle' || it.class_id == 'street_spirit_firebog' || it.class_id == 'street_spirit_zutto'){
					street_spirit = it;
				} 
				else if (it.class_id == 'npc_gardening_vendor' || it.class_id == 'npc_tool_vendor' || it.class_id == 'npc_cooking_vendor'){
					vendor = it;
				}
				else if (it.hasTag('shrine')){
					shrine = it;
				}
				else if (it.class_id == 'npc_piggy'){
					piggy_count++;
				}
				else if (it.class_id == 'npc_butterfly'){
					butterfly_count++;
				}
				else if (it.class_id == 'npc_batterfly'){
					batterfly_count++;
				}
				else if (it.class_id == 'npc_chicken'){
					chicken_count++;
				}
				else if (it.class_id == 'npc_sloth'){
					sloth_count++;
				}
				else if (it.class_id == 'chick'){
					chick_count++;
				}
				else if (it.class_id == 'piglet'){
					piglet_count++;
				}
				else if (it.class_id == 'caterpillar'){
					caterpillar_count++;
				}
				else if (it.class_id == 'patch'){
					patch_count++
				}
				else if (it.class_id == 'patch_dark'){
					dark_patch_count++;
				}
				else if (it.class_id == 'npc_firefly'){
					firefly_count++;
				}
				else if (it.class_id == 'jellisac'){
					jellisac_count++;
				}
				else if (it.class_id == 'mortar_barnacle'){
					barnacle_count++;
				}
				else if (it.is_peat_bog){
					peat_count++;
				}
				else if (it.class_id == 'dirt_pile'){
					dirt_count++;
				}
				else if (it.is_cabinet){
					var cabinet = it.capacity+'-slot storage cabinet';
					if (!cabinets[cabinet]) cabinets[cabinet] = 0;
					cabinets[cabinet]++;
				}
				else if (it.is_trant){
					if (!trants[it.class_id]) trants[it.class_id] = 0;
					trants[it.class_id]++;
				}
				else if (it.class_id == 'wood_tree' || it.class_id == 'paper_tree'){
					if (!trants[it.class_id]) trants[it.class_id] = 0;
					trants[it.class_id]++;
				}
				else if (it.is_mineable){
					var rock_class = it.getClassProp('rock_type');
					if (!rocks[rock_class]) rocks[rock_class] = 0;
					rocks[rock_class]++;
				}
				else if (it.has_parent('garden')){
					var garden_type = (it.getInstanceProp('garden_type') == 'herb' ? 'herb' : 'crop');
					if (!gardens[garden_type]) gardens[garden_type] = 0;
					gardens[garden_type] += (intval(it.getInstanceProp('width')) * intval(it.getInstanceProp('height')));
				}
				else if (it.class_tsid == 'ice_knob'){
					nubbin_count++;
				}
				else if (it.class_tsid == 'npc_salmon'){
					salmon_count++;
				}
			} catch(e){}
		}

		if (vendor){
			if (no_formatting){
				rsp.street_details.features.push("A <b>"+vendor.label+"</b>");
			}else{
				rsp.street_details.features.push("A <b>"+vendor.label+"</b>.");
			}
		} else if (street_spirit){
			if (intval(street_spirit.getInstanceProp('store_id')) != 0){
				var store = get_store(intval(street_spirit.getInstanceProp('store_id')));
				var article = (in_array(store.name.substr(0, 1).toLowerCase(), config.vowels)) ? 'An' : 'A';

				if (no_formatting){
					rsp.street_details.features.push(article+" <b>"+store.name+"</b>");
				}else{
					rsp.street_details.features.push(article+" <b>"+store.name+"</b>.");
				}
			}
		}

		if (shrine){
			if (no_formatting){
				rsp.street_details.features.push("A shrine to <b>"+capitalize(shrine.get_giant())+"</b>");
			}else{
				rsp.street_details.features.push("A shrine dedicated to <b>"+capitalize(shrine.get_giant())+"</b>.");
			}
		}

		var pols = this.quarters_get_pols();
		var pols_count = 0;
		var pols_count_forsale = 0;
		for (var i in pols){
			if (i != this.tsid){
				pols_count++;
				if (!pols[i].owned) pols_count_forsale++;
			}
		}

		var plus_parts = [];
		if (piggy_count) plus_parts.push('<b>'+pluralize(piggy_count, 'Piggy', 'Piggies')+'</b>'); // Alliteration!!!!
		if (butterfly_count) plus_parts.push('<b>'+pluralize(butterfly_count, 'Butterfly', 'Butterflies')+'</b>');
		if (batterfly_count) plus_parts.push('<b>'+pluralize(batterfly_count, 'Batterfly', 'Batterflies')+'</b>');
		if (chicken_count) plus_parts.push('<b>'+pluralize(chicken_count, 'Chicken', 'Chickens')+'</b>');
		if (sloth_count) plus_parts.push('<b>'+pluralize(sloth_count, 'Sloth', 'Sloths')+'</b>');
		if (chick_count) plus_parts.push('<b>'+pluralize(chick_count, 'Chick', 'Chicks')+'</b>');
		if (caterpillar_count) plus_parts.push('<b>'+pluralize(caterpillar_count, 'Caterpillar', 'Caterpillars')+'</b>');
		if (piglet_count) plus_parts.push('<b>'+pluralize(piglet_count, 'Piglet', 'Piglets')+'</b>');
		if (patch_count) plus_parts.push('<b>'+pluralize(patch_count, 'Patch', 'Patches')+'</b>');
		if (dark_patch_count) plus_parts.push('<b>'+pluralize(dark_patch_count, 'Dark Patch', 'Dark Patches')+'</b>');
		if (firefly_count) plus_parts.push('<b>A Firefly Swarm</b>');
		if (jellisac_count) plus_parts.push('<b>'+pluralize(jellisac_count, 'Jellisac Growth', 'Jellisac Growths')+'</b>');
		if (barnacle_count) plus_parts.push('<b>'+pluralize(barnacle_count, 'Mortar Barnacle', 'Mortar Barnacles')+'</b>');
		if (peat_count) plus_parts.push('<b>'+pluralize(peat_count, 'Peat Bog', 'Peat Bogs')+'</b>');
		if (dirt_count) plus_parts.push('<b>'+pluralize(dirt_count, 'Dirt Pile', 'Dirt Piles')+'</b>');
		if (nubbin_count) plus_parts.push('<b>'+pluralize(nubbin_count, 'Ice Nubbin', 'Ice Nubbins')+'</b>');
		if (salmon_count) plus_parts.push('<b>'+pluralize(salmon_count, 'Salmon', 'Salmen')+'</b>');

		if (num_keys(trants)){
			for (var i in trants){
				var trant_count = trants[i];
				var proto = apiFindItemPrototype(i);
				plus_parts.push('<b>'+pluralize(trant_count, proto.name_single, proto.name_plural)+'</b>');
			}
		}

		if (num_keys(rocks)){
			for (var i in rocks){
				var rock_count = rocks[i];

				if (i == 'beryl'){
					plus_parts.push('<b>'+pluralize(rock_count, 'Beryl Rock', 'Beryl Rocks')+' for mining</b>');
				}
				else if (i == 'dullite'){
					plus_parts.push('<b>'+pluralize(rock_count, 'Dullite Rock', 'Dullite Rocks')+' for mining</b>');
				}
				else if (i == 'metal_rock'){
					plus_parts.push('<b>'+pluralize(rock_count, 'Metal Rock', 'Metal Rocks')+' for mining</b>');
				}
				else if (i == 'sparkly'){
					plus_parts.push('<b>'+pluralize(rock_count, 'Sparkly Rock', 'Sparkly Rocks')+' for mining</b>');
				}
			}
		}

		if (num_keys(cabinets)){
			for (var i in cabinets){
				var count = cabinets[i];

				plus_parts.push('<b>'+pluralize(count, i, i+'s')+'</b>');
			}
		}

		if (num_keys(gardens)){
			for (var i in gardens){
				var plot_count = gardens[i];

				if (i == 'herb'){
					plus_parts.push('<b>'+pluralize(plot_count, 'Herb Garden plot', 'Herb Garden plots')+'</b>');
				}
				else if (i == 'crop'){
					plus_parts.push('<b>'+pluralize(plot_count, 'Crop Garden plot', 'Crop Garden plots')+'</b>');
				}
			}
		}

		if (pols_count && !is_pol){
			if (pols_count_forsale){
				plus_parts.push('<b>'+pluralize(pols_count, 'House', 'Houses')+' ('+pols_count_forsale+' for sale)</b>');
			}
			else{
				plus_parts.push('<b>'+pluralize(pols_count, 'House', 'Houses')+'</b>');
			}
		}


		if (no_formatting){

			var features = rsp.street_details.features;
			for (var i=0; i<features.length; i++){
				features[i] = features[i].replace(/<b>/g, '').replace(/<\/b>/g, '');
			}

			rsp.street_details.features_also = [];
			for (var i=0; i<plus_parts.length; i++){
				rsp.street_details.features_also.push(plus_parts[i].replace(/<b>/g, '').replace(/<\/b>/g, ''));
			}

		}else{

			if (plus_parts.length){
				if (rsp.street_details.features.length){
					rsp.street_details.features.push('Plus '+pretty_list(plus_parts, ', and ')+'.');
				}
				else{
					rsp.street_details.features.push(pretty_list(plus_parts, ', and ')+'.');
				}
			}
		}
	}

	return rsp;
}

function announce_sound_delayed(name, loop_count, fade_in, is_exclusive, delay) {
	var anc_time = time() + delay;
	
	if(!this.delayed_sounds) {
		this.delayed_sounds = {};
	}
	
	var new_sound = {name: name, loop_count: loop_count, fade_in: fade_in, is_exclusive: is_exclusive};
	if(!this.delayed_sounds[anc_time]) {
		this.delayed_sounds[anc_time] = [];
	}
	this.delayed_sounds[anc_time].push(new_sound);
	this.schedule_next_delayed_sound();
}

function announce_delayed_sounds() {
	for(var i in this.delayed_sounds) {
		if (i <= time()) {
			for(var j in this.delayed_sounds[i]) {
				var sound = this.delayed_sounds[i][j];
				this.announce_sound_to_all(sound.name, sound.loop_count, sound.fade_in, sound.is_exclusive);
			}
			
			delete this.delayed_sounds[i];
		}
	}
	
	this.schedule_next_delayed_sound();
}

function schedule_next_delayed_sound() {
	var sounds_timer = -1;
	
	this.apiCancelTimer('announce_delayed_sounds');
	for(var i in this.delayed_sounds) {
		if(sounds_timer == -1 || i < sounds_timer) {
			sounds_timer = i;
		}
	}
	
	if(sounds_timer != -1) {
		this.apiSetTimer('announce_delayed_sounds', (sounds_timer - time()) * 1000);
	}
}

function announce_sound_to_all(name, loop_count, fade_in, is_exclusive){
	if (config.music_map[name]) name = config.music_map[name];

	var rsp = {
		type: 'play_sound',
		sound: name,
		is_exclusive: is_exclusive ? true : false
	};

	if (loop_count){
		rsp['loop_count'] = intval(loop_count);
	}

	if (fade_in){
		rsp['fade'] = intval(fade_in);
	}

	this.apiSendAnnouncement(rsp);
}

function announce_sound_stop_to_all(name, fade_out){

	if (config.music_map[name]) name = config.music_map[name];

	var rsp = {
		type: 'stop_sound',
		sound: name
	};

	if (fade_out){
		rsp['fade'] = intval(fade_out);
	}

	this.apiSendAnnouncement(rsp);
}

function announce_itemstack_bubble_to_all(stack, text, duration, follow, options){
	this.overlay_dismiss(stack.tsid+'_bubble');
	
	if(options) {
		var delta_x = options.delta_x ? options.delta_x : 10;
		var delta_y = options.delta_y ? options.delta_y : 0;
		var dont_keep_in_bounds = options.dont_keep_in_bounds;
	} else {
		var delta_x = 10;
		var delta_y = 0;
		var dont_keep_in_bounds = false;
	}
	
	//log.info(options);

	return this.announce_itemstack_overlay({
		uid: stack.tsid+'_bubble',
		duration: duration,
		dismissible: false,
		itemstack_tsid: stack.tsid,
		delta_x: delta_x,
		delta_y: delta_y,
		width: "100",
		height: "100",
		bubble_talk: true,
		follow: follow ? true : false,
		dont_keep_in_bounds: dont_keep_in_bounds,
		text: [
			'<span class="simple_panel">'+text+'</span>'
		]
	});
}

function announce_itemstack_overlay(args){
	var rsp = {
		type: 'itemstack_overlay'
	};

	for (var i in args){
		if (i == 'overlay_key'){
			rsp['swf_url'] = this.overlay_key_to_url(args[i]);
		}
		else{
			rsp[i] = args[i];
		}
	}

	this.apiSendAnnouncement(rsp);
}

function overlay_dismiss(uid){
	this.apiSendMsgAsIs({type: 'overlay_cancel', uid: uid});
}

// Called when REPLACE_OBJECT admin command executed for its geometry object
function onGeometryReplaced(){
	if (this.isInstance()) return false;

	log.info(this+' onGeometryReplaced calling jobs_modify_connections');
	//log.printStackTrace();
	
	// Set timers to allow us to set flags on this location that will affect these functions, like in instances
	this.apiSetTimer('geo_links_cleanup', 3000);
	//this.apiSetTimer('jobs_modify_connections', 4000); // geo_links_cleanup runs this
	this.apiSetTimer('jobs_modify_outgoing_connections', 5000);
	
	//this.geo_links_cleanup();
	//this.jobs_modify_connections();
	//this.jobs_modify_outgoing_connections();
	return true;
}

function updateMap(){
	var rsp = {
		type: 'map_get',
		hub_id: this.hubid
	};
	rsp.mapData = this.get_map();
	apiSendToHub(rsp, this.hubid);
}

function isGreetingLocation(){
	if (this.class_tsid == 'newbie_island') return true;

	for (var i=0; i<config.greeting_locations.length; i++){
		if (this.tsid == config.greeting_locations[i].tsid) return true;
		if (this.instance_of == config.greeting_locations[i].tsid) return true;
	}

	return false;
}

function resetGreetingLocation(){
	if (!this.isGreetingLocation()) return false;

	// Performing it:
	// Turns any trants, dead trants or seedlings in the location into patches
	// Sets all patches to the weedy state
	// Resets timers on any quoins in the location, making them active again

	var items = this.getItems();
	for (var i in items){
		var it = items[i];

		if (it.is_trant || it.is_dead_trant || it.class_tsid == 'patch_seedling'){
			it.replaceWithPatch();
		}
		else if (it.class_tsid == 'patch' || it.class_tsid == 'patch_dark'){
			it.setMessy();
		}
		else if (it.class_tsid == 'quoin'){
			it.onRespawn();
		}
	}

	return true;
}

function resetQuoins(){
	var items = this.getItems();
	for (var i in items){
		var it = items[i];

		if (it.class_tsid == 'quoin'){
			it.onRespawn();
		}
	}

	return true;
}

function getGreeters(){
	var greeters = [];

	var active_players = this.getActivePlayers();
	for (var p in active_players){
		var pc = active_players[p];
		if (pc && pc.isGreeter()){
			greeters.push(pc);
		}
	}

	return greeters;
}

function getNonGreeters(){
	var non_greeters = [];

	var active_players = this.getActivePlayers();
	for (var p in active_players){
		var pc = active_players[p];
		if (pc && !pc.isGreeter()){
			non_greeters.push(pc);
		}
	}

	return non_greeters;
}

function countGreeters(){
	var greeters = this.getGreeters();
	return greeters.length;
}

function getUnsummonedGreeters(){
	var group = apiFindObject(config.greeter_group);
	if (!group) return;

	var members = utils.shuffle(group.get_members().members);

	var to_summon = [];
	for (var i=0; i<members.length; i++){
		var pc = getPlayer(members[i].tsid);
		if (pc && pc.isOnline() && pc.isFreeGreeter() && (!this.greeters_summoned || !this.greeters_summoned[pc.tsid])){
			to_summon.push(pc.tsid);
		}
	}

	return to_summon;
}

function summonGreeters(pc){
	//if (this.greeters_summoned && this.greeters_summoned.length >= 10) return;
	this.greeters_summoned = {};
	if (this.countGreeters()) return;
	if (this.greeting_summons_canceled) return;

	if (!pc) pc = this.getNonGreeters()[0];
	if (!pc) return;

	var uid = 'greeter_alert-'+this.tsid+'-'+pc.tsid;
	// Fake a prompt
	var msg = {
		type		: 'prompt',
		uid		: uid,
		txt		: '<span class="prompt_greeter"><span class="prompt_greeter_name">'+pc.label+'</span> is ready to be greeted in <span class="prompt_greeter_loc">'+this.label+'</span>. Can you help?</span>',
		icon_buttons	: true,
		choices		: [
			{ value : this.tsid, label : 'I am eager!' },
			{ value : 'no', label : 'I am busy!' }
		],
		timeout		: 11,
		is_modal	: false,
		escape_value	: 'no',
		timeout_value	: 'no',
		sound 		: 'GREETING_NEEDED'
	};

	var to_summon = this.getUnsummonedGreeters();

	var summon_count = 0;
	if (!this.greeters_summoned) this.greeters_summoned = {};
	for (var i=0; i<to_summon.length; i++){
		var greeter = getPlayer(to_summon[i]);
		if (greeter){
			summon_count++;
			if (this.greeters_summoned) this.greeters_summoned[greeter.tsid] = uid;
			greeter.sendMsgOnline(msg);

			if (summon_count >= 3) break;
		}
	}

	//apiSendToAllByCondition(msg, 'isFreeGreeter');

	if (summon_count){
		log.info("Summoning greeters to "+this+" for "+pc);
		this.apiSetTimerX('summonGreeters', 8000, pc);
	}
	else{
		pc.apiSendMsg({
	        "type": "conversation",
	        "title": "<span class=\"choices_quest_title\">Our Apologies</span>",
	        "itemstack_tsid": config.familiar_tsid,
			"conv_type": "greeter_coming",
	        "txt": "Oops! Really sorry about this but it looks like all the greeters are occupied right now.",
	        "choices":{
	                "1":{
	                        "value":false, // false will keep the conversation from sending anything back to the server, so you don;t have to worry about handling any responses
	                        "txt":"Ok, thanks"
	                }
	        }
		});

		pc.greeting.no_response = true;

		utils.irc_inject('#greeters', pc.label+' WAS NOT greeted');

		delete this.greeters_summoned;
	}
}

function cancelGreeterSummons(){
	this.apiCancelTimer('summonGreeters');

	for (var i in this.greeters_summoned){
		getPlayer(i).sendMsgOnline({
			type: 'prompt_remove',
			uid: this.greeters_summoned[i]
		});
	}
	
	delete this.greeters_summoned;
}

function linkifyLabel(){
	return '<a href="event:location|'+this.hubid+'#'+this.tsid+'">'+this.label+'</a>';
}

function getImages(){

	var out = {
		ok						: 1,
		main_image				: this.image,
		loading_image			: this.loading_image,
		special_loading_image	: this.special_loading_image,
		template_loading_image	: null,
	};

	if (this.template){
		var template = apiFindObject(this.template);
		if (template) out.template_loading_image = template.getProp('loading_image');
	}

	return out;
}

function invokeOnAllItems(fname, class_id) {

	if (class_id){
		this.items.apiIterate(class_id, function(it){ if (it[fname]) it[fname](); });
	}
	else{
		this.items.apiIterate(function(it){ if (it[fname]) it[fname](); });
	}
}

function onCreateAsCopyOf(sourceLocation){
	if ((this.is_race && this.race_type == 'piggy_race') || (sourceLocation && sourceLocation.tsid == config.multiplayer_quest_locations['hogtie_piggy'][0].tsid)){
		var setCollisions = function(it){
			if (it && (it.class_tsid == 'npc_piggy' || it.class_tsid == 'pig_bait')){
				it.apiSetHitBox(100, 50);
				it.apiSetPlayersCollisions(true);
			}
		};

		this.items.apiIterate(setCollisions);
	}
	
	this.invokeOnAllItems('onCreateAsCopy');
}

function sendActivity(msg, from){
	// Auto-prepend?
	var auto_prepend = false;
	if (from) auto_prepend = true;
	
	this.apiSendMsg({
		type: 'activity',
		txt: msg,
		pc: from ? from.make_hash() : {},
		auto_prepend: auto_prepend
	});
	//log.info('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'+msg);
}

function getVersionedSwf(){
	if (!this.geo || !this.geo.swf_file) return '';

	var swfs = this.geo.swf_file.split(',');
	var out = [];

	for (var i=0; i<swfs.length; i++){
		out.push(config.data_swfs_locations[swfs[i]]);
	}

	return out.join(',');
}

function get_roster_msg(){

	var names = [];

	var players = this.getActivePlayers();

	for (var i in players){
		names.push(utils.escape(players[i].label));
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

function is_machine_room(){
	if (!config.public_machine_rooms) return false;

	if (in_array_real(this.tsid, config.public_machine_rooms)) return true;

	return false;
}

function is_apartment_lobby(){
	// Are we hidden on the map and we have a quarter signpost?

	var maps = config.data_maps.maps;
	if (!maps[this.hubid]) return false;

	for (var i in maps[this.hubid].objs){
		var o = maps[this.hubid].objs[i];

		if (o.tsid == this.tsid && o.type == 'S'){
			return false;
		}
	}

	if (num_keys(this.getQuarters())) return true;

	return false;
}

// Logic for Tower Secrets achievement
function handleTowerSecrets(pc, id) {
	if (id.substring(0,10) == 'TowerSpot_'){
		pc.achievements_increment('tower_secrets', id);
		pc.counters_increment('tower_secrets', id);
		
		if (pc.counters_get_label_count('tower_secrets', id) == 1){
			var count = pc.counters_get_group_count('tower_secrets');
			
			// var txt = "You have now found ALL of the secret locations in the Jethimadh Tower Base! You are so great!!"
			if (count != 11){
				var txt = "You have found the "+numberth_word(count)+" of eleven secret spots in the Base of Jethimadh Tower. Nice Work!";
				
				if (id == 'TowerSpot_03'){
					pc.stats_add_currants(50, {'location':id});
				}
			
				pc.apiSendAnnouncement({
					uid: "tower_spot",
					type: "vp_overlay",
					duration: 0,
					locking: true,
					width: 500,
					x: '50%',
					top_y: '15%',
					click_to_advance: true,
					click_to_advance_show_text: true, // shows the text prompt next to the advance button
					no_spacebar_advance: true,
					text: [
						'<p align="center"><span class="nuxp_vog">'+txt+'</span></p>'
					]
				});
			}
		}
	}
}

// Logic for Eleven Secrets achievement
function handleElevenSecrets(pc, id) {
	if ((id.substring(0, 8) == '11spots_') || (id.substring(0,10) == '11secrets_')) {
		if (pc.hasSecretLocation(this, id)) {
			pc.triggerSecretLocationMarker(this, id);
		
			pc.apiSetTimerX('apiSendMsg', 600, {type: 'overlay_cancel', uid: 'secret_location_marker '+id});
			pc.removeSecretLocation(this, id);
		
			pc.apiSetTimerX('show_rainbow', 600, 'rainbow_secretspot', 0); 
			pc.apiSetTimerX('handleElevenSecrets', 3500, id);
		}
	}
}

function isPOLTemplate(){
	for (var i in config.pol_types){
		if (config.pol_types[i].template_tsid == this.tsid) return true;
	}

	return false;
}

// this is used for stats!
function getType(){

	if (this.isInstance()) return 'instance';
	if (this.pols_is_pol()) return 'pol';
	if (this.quarter_tsid) return 'quarter';
	return 'public';
}

function getTypeInfo(){
	var out = {
		'tsid' : this.tsid,
		'type' : 'public',
	};

	if (this.isInstance()){
		out.type = 'instance';
		out.template = this.instance_of;

	}else if (this.pols_is_pol()){
		out.type = 'pol';
		out.template = this.template;

	}else if (this.quarter_tsid){
		out.type = 'quarter';
		out.template = this.template;
	}

	return out;
}

function isInHell(){
	if (this.isInHellOne() || this.isInPurgatoryHub()) return true;

	// Guess not
	return false;
}

function isInHellOne(){
	// Do we match the hell one tsid in config, or are we an instance of it?
	if (this.tsid == config.hell.tsid || this.isInstance('hell_one')) return true;

	return false;
}

function isInPurgatoryHub(){
	// Are we in the purgatory hub?
	if (this.hubid == 40) return true;

	return false;
}

function isParadiseLocation(){
	if (this.instance_id && this.instance_id.substr(0, 9) == 'paradise_') return true;

	return false;
}

function scareChickens(pc){
	var is_chicken = function(it, args){ return it.class_tsid == 'npc_chicken' && it.distanceFromPlayer(args) <= config.verb_radius; };
	var chickens = this.find_items(is_chicken, pc);
	for (var i=0; i<chickens.length; i++){
		chickens[i].apiSetTimer('fly', randInt(1,10)*100);
	}
}
	
function commandButler(pc, txt){
	var butlers = this.find_items("bag_butler"); 
	if (butlers && butlers.length > 1) { 
		log.error(this.label+" has more than 1 butler!");
	}
	
	if (butlers && butlers.length <= 0) {
		return;
	}
	
	if (butlers && butlers[0]) { 
		butlers[0].doCommand(pc, txt);
	}
}

function butlerProcessText(pc, txt) { 
	var butlers = this.find_items("bag_butler"); 
	if (butlers && butlers.length > 1) { 
		log.error(this.label+" has more than 1 butler!");
	}
	
	if (butlers && butlers.length <= 0) {
		return;
	}
	
	if (butlers && butlers[0]) { 
		butlers[0].notifyOwner(pc, txt);
	}
}
	
function buffs_remove_after_time(details){
	if (details.pc.buffs_has(details.buff_name)){	
		details.pc.buffs_remove(details.buff_name);
	}
}

function restoreItem(args){
	function is_bag(it, f_args){ return it.class_tsid == f_args.class_tsid && !it.isBagFull() && it.x == f_args.x && it.y == f_args.y ? true : false; }
	var containers = this.find_items(is_bag, {class_tsid: args.container_class, x: args.container_pos[0], y: args.container_pos[1]});
	if (containers && containers[0]){
		return containers[0].restoreItem(args);
	}
	else{
		var s = apiNewItemStack(args.class_tsid, args.count);
		if (!s) return {ok: 0, error: "Could not create item"};
		
		if (args.props) s.instanceProps = args.props;
		if (args.user_name) s.user_name = args.user_name;
		if (args.contents) s.contents = args.contents;
		if (args.title) s.title = args.title;

		var x = args.my_pos[0];
		var y = args.my_pos[1];
		if (!x || !y){
			x = args.container_pos[0];
			y = args.container_pos[1];
		}
		this.apiPutItemIntoPosition(s, x, y);
		return {ok: 1, tsid: s.tsid};
	}

}

function getPrivateOwner(){

	if (!this.owner) return null;
	if (this.is_public) return null;
	return this.owner.tsid;
}

function centerCamera(pt, duration){
	this.apiSendMsg({
		type: 'camera_center',
		pt: pt,
		duration_ms: duration
	});
}

function dropFoxBaits(pc){
	var x = randInt(pc.x, pc.x-400);
	for (var i=0; i<3; i++){
		var s = pc.location.createAndReturnItem('fox_bait', 1, x, pc.y-1000, 100);
		if (s){
			s.is_placed = 1;
			s.not_selectable = true;

			s.setAndBroadcastState(choose_one(['bait1', 'bait2', 'bait3']));
			s.apiSetTimer('land', 1000);
			s.apiSetTimer('expire', 5*60*1000);
		}

		x += 300;
	}
}

function checkItemPlacement(){
	if (!this.is_home) return;

	var num_moved = 0;

	for (var i in this.items){
		if (!this.items[i]) continue;

		var move_in_by = this.randInt(150, 450);

		var x = this.items[i].x;
		var y = this.items[i].y;

		var new_x = x;
		var new_y = y;

		if (x < this.geometry.l) new_x = this.geometry.l + move_in_by;
		if (x > this.geometry.r) new_x = this.geometry.r - move_in_by;
		if (y < this.geometry.t) new_y = this.geometry.t + move_in_by;
		if (y > this.geometry.b) new_y = this.geometry.b - move_in_by;

		if (x != new_x || y != new_y){

			var error = "need to resposition stack "+this.items[i].tsid+" ("+this.items[i].class_tsid+") from ("+x+","+y+") to ("+new_x+","+new_y+")";

			log.error(error);

		//	this.apiSendMsgAsIs({
		//		type: 'activity',
		//		txt: error,
		//		pc: {},
		//		auto_prepend: false
		//	});

			this.items[i].apiSetXY(new_x, new_y);
			num_moved++;
		}
	}

	if (num_moved){
		this.apiSendMsgAsIs({
			type: 'activity',
			txt: "Moved "+num_moved+" item stacks into view",
			pc: {},
			auto_prepend: false
		});		
	}
}

function findFirst(class_tsid, args){
	var items = this.getItems();
	
	var is_function = (typeof class_tsid == 'function');
	
	for (var i in items){
		var it = items[i];
		
		if (it){
			var ok = 0;
			if (is_function) ok = class_tsid(it, args);
			if (!is_function) ok = (it.class_tsid == class_tsid) ? true : false;
	
			if (ok) return it;
		}
	}
}

function cloneLocationInfo(template){

	// this function needs to return any information directly on the
	// location object which is needed during cloning (such as events)
	//
	// if you modify this function, also check lib_streets.php:streets_clone_props()
	// which does the same thing in PHP.

	var props = template.getCloneLocationInfo();

	for (var i in props){
		this[i] = props[i];
	}
}

function getCloneLocationInfo(){

	return {
		events: utils.apiCopyHash(this.events),
	};
}

function hideUIOnLoad(ui_component){

	// hide pack in "ticket to paradise" levels
	if (ui_component == 'pack' && this.isParadiseLocation()) return true;

	return false;
}

function adminCloneSerializeItems(){
	return this.cloneSerializeItems();
}

function cloneSerializeItems(){

	var out = {};

	for (var i in this.items){
		var x = this.items[i].cloneSerializeStack();
		out[x.tsid] = x;
	}

	return out;
}

function adminCloneUnserializeItems(args){
	return this.cloneUnserializeItems(args.data);
}

function cloneUnserializeItems(serial_items){

	for (var i in serial_items){

		var data = serial_items[i];

		var stack = apiNewItemStack(data.class_tsid, data.count);
		stack.cloneUnserializeStack(data, this);
	}
}

function eventFired(event_id, target, args){
	if (this.location_tags && this.location_tags['listen_'+event_id]){
		this.events_broadcast(event_id, args);
		if (target && target.class_tsid){
			this.events_broadcast(event_id+'_'+target.class_tsid, args);
		}
		if (args && args.class_tsid){
			this.events_broadcast(event_id+'_'+args.class_tsid, args);
		}
	}
}

function addLocationTag(tag){
	if (!this.location_tags) this.location_tags = {};
	if (this.location_tags[tag]) return;
	this.location_tags[tag] = 1;
}

function removeLocationTag(tag){
	if (!this.location_tags) return;
	if (!this.location_tags[tag]) return;
	delete this.location_tags[tag];
}

function hasLocationTag(tag){
	if (!this.location_tags) return false;
	if (!this.location_tags[tag]) return false;
	return true;	
}

function doIncantationsFeat(step, pc){
        var feat = pc.feats_get('makeup_feat_redux');
        if (!feat) return;
 
        if (!this.incantations_redux) this.incantations_redux = {};
        if (!this.incantations_redux[pc.tsid]){
                if (!this.incantations_redux_step && step == 1){
                        if (pc.feats_increment('makeup_feat_redux', 1)){
                                this.incantations_redux_step = 1;
                                this.sendActivity(pc.linkifyLabel()+' got one point for <a href="event:external|/feats/giants-awakening/">The First Glimmer of the Giants\' Awakening</a> chain.');
                                this.announce_sound_to_all('COMPLETE_QUEST_REQUIREMENT');
 
                                this.incantations_redux[pc.tsid] = {
                                        step: step,
                                        ts: time()
                                };
                        }
                }
                else if (this.incantations_redux_step == 1 && step == 2){
                        if (pc.feats_increment('makeup_feat_redux', 2)){
                                this.incantations_redux_step = 2;
                                this.sendActivity(pc.linkifyLabel()+' got two points for <a href="event:external|/feats/the-incantations/">The Incantations of Absurdity</a> chain.');
                                this.announce_sound_to_all('COMPLETE_QUEST_REQUIREMENT');
 
                                this.incantations_redux[pc.tsid] = {
                                        step: step,
                                        ts: time()
                                };
                        }
                }
                else if (this.incantations_redux_step == 2 && step == 3){
                        if (pc.feats_increment('makeup_feat_redux', 3)){
                                delete this.incantations_redux_step;
                                this.sendActivity(pc.linkifyLabel()+' got three points for <a href="event:external|/feats/the-incantations/">The Incantations of Absurdity</a> chain.');
                                this.announce_sound_to_all('REVEAL_1');
 
                                this.incantations_redux[pc.tsid] = {
                                        step: step,
                                        ts: time()
                                };
                        }
                }
                else{
                        this.clearIncantationsFeat(pc);
                }
        }
        else{
                this.clearIncantationsFeat(pc);
        }
}
 
function clearIncantationsFeat(pc){
        var feat = pc.feats_get('makeup_feat_redux');
        if (!feat) return;
 
        if (!this.incantations_redux) return;
 
        if (this.incantations_redux_step){
                this.sendActivity('Oops! The incantation chain has been broken!');
                this.announce_sound_to_all('CLICK_FAILURE');
        }
 
        delete this.incantations_redux_step;
}

function resetIncantationsFeat(){
	delete this.incantations_redux;
	delete this.incantations_redux_step;
}

function getTakeables() {
	var rsp ={};
	rsp.itemstacks={location:{}};
	var items = this.items;
	for(n in items){
		var it = items[n];
		rsp.itemstacks.location[n]={
			count: it.count,
			class_tsid: it.type,
			label: it.label,
			x: it.x,
			y: it.y,
			takeable: it.has_parent('takeable') ? true : false
		};
	}
	return rsp;
}

function deleteNPCs(){
	for (var i in this.items){
		var it = this.items[i];
		if (!it) continue;

		if (it.class_tsid == 'npc_chicken' || it.class_tsid == 'npc_piggy' || it.class_tsid == 'npc_butterfly' || it.class_tsid == 'npc_batterfly') it.apiDelete();
	}
}

function deleteTakeables(){
	for (var i in this.items){
		var it = this.items[i];
		if (!it) continue;

		if (it.is_takeable && it.is_takeable()) it.apiDelete();
	}
}
