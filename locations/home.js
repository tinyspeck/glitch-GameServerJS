
function hitBox(pc, id, in_box){
	if (config.is_dev || pc.is_god) log.info(pc+' has hit unhandled box: '+id);
}

function playerEnterCallback(pc){
	//
	// Recover butler
	//

	if (pc.getProp('had_butler') && this.pols_is_owner(pc)){
		pc.apiSetTimer('createButler', 1000);
		delete pc.had_butler;
	}

	pc.giveButlerBox(); // give out butler for real

	//
	// Moving boxes
	//

	if (!this.is_public && this.pols_is_owner(pc)){
		pc.apiSetTimer('houses_undo_moving_boxes', 1000);
		
		if (this.home_get_yard_expansions_remaining() <= 0){
			this.owner.achievements_increment("max_expansions", "yard", 1);
		}
	}
	
	if (this.is_public && this.pols_is_owner(pc)){
		var num = this.home_get_yard_expansions_remaining();
		if (num[0] <= 0 && num[1] <= 0){
			this.owner.achievements_increment("max_expansions", "street", 1);
		}
		
		if (num_keys(this.getNeighbors()) >= 5) {
			this.owner.achievements_set("signpost", "num_neighbors", 5);
		}
		
		this.owner.achievements_set("cultivation_items", "has", this.cultivation_count_all_items());

		this.homes_restore_chassis();
	}
	
	if (this.pols_is_owner(pc)){
		var trophies_outside = this.owner.home.exterior.find_items(function (it) { return it.hasTag('trophy'); });
		var trophies_inside = this.owner.home.interior.find_items(function (it) { return it.hasTag('trophy'); });

		if (trophies_outside.length + trophies_inside.length >= 11){
			pc.achievements_set("trophy", "placed_eleven", 1);
		}
	}

	// Party achievements
	if (!this.is_public){
		if (this.owner.location === this){
			log.info("PARTY check "+this.activePlayers.length);
		
			if (this.activePlayers.length >= 4){
				this.owner.achievements_increment("hosted_party", "three", 1);
			}
			
			if (this.activePlayers.length >= 18){
				this.owner.achievements_increment("hosted_party", "seventeen", 1);
			}
			
			this.checkEpicBlowout();
		}
	}
	

	//
	// Check for stuck floor jobs
	//

	var jobs = this.jobs_get_all(true);
	for (var i in jobs){
		var j = jobs[i];
		if (j && j.class_tsid == 'job_proto_door' && j.isDone()){
			var door = apiFindObject(j.spirit_tsid);
			if (door && door.has_job){
				door.onJobComplete(j);
			}
		}
	}


	//
	// Record daily unique visitors
	// http://bugs.tinyspeck.com/8964
	//

	if (this.owner && (this.owner.tsid != pc.tsid) || config.is_dev){

		this.home_log_visitor(pc.tsid);
		this.home_cleanup_visitors();
	}

	// Newxp cleanup
	if (this.special_loading_image) delete this.special_loading_image;

	if (this.pols_is_owner(pc)){
		if (this.is_newxp && !this.current_step){
			var rock = this.findFirst('magic_rock');
			if (rock) rock.apiSetHitBox(500, 400);
		}
		else if (this.is_newxp && (pc.location.current_step == 'given_furniture' || pc.location.current_step == 'furniture_placed' || pc.location.current_step == 'enabled_swatches')){
			var rock = this.findFirst('magic_rock');
			if (rock){
				rock.sendBubble("Hmm — you went somewhere in the middle of decorating!", 4000, pc);
				if (pc.location.current_step == 'given_furniture'){
					pc.changeUIComponent('furniture_bag', true);
					pc.changeUIComponent('decorate_button', true);
					pc.apiSendMsg({
						type: "ui_callout",
						section: 'furniture_tab',
						display_time: 0
					});
				}
				else{
					this.current_step = 'choose_skill';
					var choices = {
						1: {txt: 'I’m ready now', value: 'learn-skill'},
						2: {txt: 'Give me a minute', value: 'give-me-a-minute'}
					};
					
					rock.apiSetTimerX('conversation_start', 4000, pc, "Do you want to choose a skill now? Or do you want a few more minutes to look around?", choices, null, null, null, {ignore_state: true});
				}
			}
		}
		else if (this.is_postnewxp && this.is_public && !this.give_skill_learning){
			var rock = this.findFirst('magic_rock');
			if (rock){
				var choices = {
					1: {txt: 'Nice', value: 'give-skill-learning'}
				};
					
				rock.apiSetTimerX('conversation_start', 2000, pc, "You little adventurer, you — nicely done.<split butt_txt=\"Yay me\">I have a little present for you as well …<split butt_txt=\"Do Tell!\">I got you this very fancy upgrade: the Skill Learning Brain!", choices, null, null, null, {dont_take_camera_focus: true, ignore_state: true});
			}
		}
		else if (this.is_postnewxp && this.is_public){
			pc.apiSetTimerX('announce_vog_fade', 4000, "When you’re ready, use the iMG Menu to go back to Gentle Island and head to the real world.", {css_class: 'nuxp_vog_brain', done_payload: {location_script_name: 'giveQuests'}});
		}
	}

	if (!this.is_public){
		this.geo_clear_signposts();
	}
	else if (this.home_id == 'exterior' && this.geo_count_signposts() > 1){
		this.geo_clear_signposts();
		this.geo_add_signpost({
			x : -328,
			y : -112,
			w : 100,
			h : 200,
			connects : {},
		});

		this.updateNeighborSignpost();
	}
	else if (this.home_id == 'exterior' && this.geo_count_signposts() == 1 && !this.signpost_fixed){
		this.updateNeighborSignpost();
		this.signpost_fixed = true;
	}

	if (this.is_newxp){
		pc.newxpProgressCallback({
			action: 'enter',
			stage: 'house_'+this.home_id,
			enter_ts: time()
		});
	}
	
	if (pc.getQuestStatus('rube_spy') == 'none' && pc.rube_visited_count >= 1){
		pc.quests_offer('rube_spy');
	}
}

function playerExitCallback(pc, next_location){
	// Check to see if the player is leaving for the real world
	if (next_location !== undefined && next_location !== null && this.is_newxp){
		if (!next_location.isInstance() && !next_location.homes_get_type()){
			pc.newxpComplete();
		}
	}

	if (this.is_newxp){
		pc.newxpProgressCallback({
			action: 'exit',
			stage: 'house_'+this.home_id,
			enter_ts: pc.stats_get_last_street_visit(this.tsid),
			exit_ts: time()
		});
	}
}

function checkEpicBlowout(){
	if ((config.is_dev && this.activePlayers.length >= 3) || this.activePlayers.length >= 12) {
		var drugged = 0;
		var owner_drugged = false;
		for (var i in this.activePlayers){
			var player = this.activePlayers[i];
			if (player.buffs_has("buff_buzzed") || player.buffs_has("buff_smashed") || player.buffs_has("purple_flower") || player.buffs_has("no_no_powder")){
				if (player === this.owner){
					owner_drugged = true;
				}
				else{
					drugged ++;
				}
			}
		}
		
		if ((config.is_dev && drugged >= 3) || drugged >= 11) {
			for (i in this.activePlayers){
				var player = this.activePlayers[i];
				player.achievements_increment("attended_party", "blowout", 1);
			}
		}
	}
}

function addNeighbor(pc, position){
	if (!this.neighbors) this.neighbors = apiNewOrderedHash();
	
	if (position > 4) return false;
	if (!this.owner.buddies_is_buddy(pc)) return false;

	// Make sure they're not already a neighbor
	var neighbors = this.getNeighbors();
	var count = 0;
	for (var i in neighbors){
		count ++;
		if (neighbors[i].tsid == pc.tsid){
			this.updateNeighborSignpost(); // probably they're re-adding someone that's already there, but they can't see it
			return false;
		}
	}

	// Make sure they have a house
	if (!pc.houses_get_external_entrance()){
		pc.houses_go_to_new_house(false, true);
	}

	// Can't add them if they're in newxp
	if (!pc.getProp('has_done_intro') || pc.getQuestStatus('leave_gentle_island') == 'todo') return false;

	// TODO: If there is someone in this position already, we may need to remove sources or whatever

	this.neighbors[position] = pc;
	
	if (count >= 4){
		this.owner.achievements_set("signpost", "num_neighbors", 5);
	}
	
	return this.updateNeighborSignpost();
}

function removeNeighbor(position){
	if (!this.neighbors) return false;

	delete this.neighbors[position];

	return this.updateNeighborSignpost();
}

function setNeighbors(neighbors){
	this.neighbors = apiNewOrderedHash();
	for (var i in neighbors){
		this.addNeighbor(getPlayer(neighbors[i]), i);
	}
}

function getNeighbors(){
	return this.neighbors ? this.neighbors : {};
}

function removeNeighborTo(tsid){
	var neighbors = this.getNeighbors();
	for (var position in neighbors){
		if (neighbors[position].tsid == tsid) return this.removeNeighbor(position);
	}

	return false;
}

function updateNeighborSignpost(){
	// find our signpost
	var mg = this.geometry.layers.middleground;
	if (!mg) return false;

	if (num_keys(mg.signposts) != 1) return false;

	var post = null;
	var signpost_id = 0;
	for (signpost_id in mg.signposts){
		post = mg.signposts[signpost_id];
		break;
	}

	// Set new connections
	post.connects = {};
	var neighbors = this.getNeighbors();
	for (var i in neighbors){
		var dest = neighbors[i].houses_get_external_entrance();
		if (!dest) continue;

		var info = dest.loc.geo_get_info();
		var player_info = dest.loc.pols_get_owner().getInfo();

		post.connects[i] = {
			target	: dest.loc,
			mote_id	: info.mote_id,
			hub_id	: info.hub_id,
			x	: dest.x,
			y	: dest.y,
			label: player_info.label,
			player_tsid: player_info.tsid
		};

		// TODO: Do we need to maintain sources?
		// Could get messy on popular houses
		// We can fake it by walking reverse contacts and checking if we are on their signposts
	}

	// Tell the client
	this.geo_signpost_updated(signpost_id);

	return true;
}

function hideUIOnLoad(ui_component, pc){

	// hide furn bag in newxp
	if (this.is_newxp){
		if (ui_component == 'pack') return false;
		if (ui_component == 'energy') return false;
		if (ui_component == 'mood') return false;

		if (ui_component == 'furniture_bag' && (!this.current_step || this.current_step == 'go-inside')) return true;
		if (ui_component == 'decorate_button' && !this.current_step) return true;
		if (ui_component == 'swatches_button' && (!this.current_step || this.current_step == 'given_furniture')) return true;
		if (ui_component == 'expand_button' && (!this.current_step || this.current_step == 'given_furniture' || this.current_step == 'enabled_swatches')) return true;

		if (ui_component == 'imagination') return true;
		if (ui_component == 'current_location') return true;
		if (ui_component == 'cultivate_button') return true;
		if (ui_component == 'currants') return true;
		if (ui_component == 'inventory_search') return true;

		if (ui_component == 'map') return true;

		if (ui_component == 'skill_learning') return true;

		if (ui_component == 'home_street_visiting' && (!pc || !pc.has_done_intro)) return true;
	}

	return false;
}

function prep_geometry_callback(pc){
	if (!this.is_newxp){
		var geo = this.getClientGeometry();
		if (geo.no_map) delete geo.no_map;
	}
}

function newxp_in_decomode(pc){
	pc.announce_vog_fade("The arrow keys move the camera while you’re in Decoration Mode.", {no_locking: true, duration: 3000, css_class:'nuxp_vog_brain', done_payload:{location_script_name: 'newxp_callout_toolbar_close'}});
}

function newxp_callout_toolbar_close(pc){
	pc.apiSendMsg({
		type: "ui_callout",
		section: 'toolbar_close'
	});

	return true;
}

function newxp_choose_skill(pc){
	var magic_rock = pc.location.findFirst('magic_rock');
	if (magic_rock) magic_rock.callToNewxpPlayer(pc);
}

function upgradeConfirmed(pc, upgrade_id){
	if (upgrade_id == 'skill_learning'){
		//pc.apiSendMsg({type: 'familiar_dialog_start', close_payload: {location_script_name: 'closedImaginationMenu'}});
		this.closedImaginationMenu(pc);
	}
}

function closedImaginationMenu(pc){
	if (pc.skills_is_learning()){
		this.closedImaginationMenu2(pc);
	}
	else{
		var magic_rock = pc.location.findFirst('magic_rock');
		if (magic_rock){
			var choices = [{txt:'Will do', value:'open-skills'}];
			magic_rock.conversation_start(pc, "Now you have a Skill Learning Brain! You can learn skills on your own, but learning takes time.<split butt_txt=\"Good\">As you learn more and level up, you'll unlock all kinds of skills — Teleportation and Mining, Machine use and Potionmaking — the list is long.<split butt_txt=\"Interesting …\">But for now, your choices are a bit more humble. Choose one of the skills you've unlocked so far to begin.", choices, null, null, null, {dont_take_camera_focus: true, ignore_state: true});
		}
	}

	return true;
}

function closedImaginationMenu2(pc){
	var magic_rock = pc.location.findFirst('magic_rock');
	if (magic_rock){
		var choices = [{txt:'OK', value:'check-sidestreets'}];
		magic_rock.conversation_start(pc, "Well kid, you seem to know what you’re doing … at least enough to get started.<split butt_txt=\"Yeah\">So I’m going to pipe down now and stick close to your house for later. I have a lot of reading to catch up on.", choices, null, null, null, {dont_take_camera_focus: true, ignore_state: true});
	}

	this.give_skill_learning = true;

	return true;
}

function giveQuests(pc){
	pc.quests_offer('leave_gentle_island', true);

	var first_skill = pc.skills_get_list()[0].id;
	if (first_skill) pc.quests_learnt_skill(first_skill);

	var exterior = pc.houses_get_external_street();
	if (exterior){
		delete exterior.is_postnewxp;
		delete exterior.give_skill_learning;
	}

	return true;
}


function home_log_visitor(pc_tsid){

	if (!this.daily_visitors) this.daily_visitors = {};
	if (!this.real_daily_visitors) this.real_daily_visitors = {};

	var game_day = current_day_key();
	var real_day = real_day_key();

	if (!this.daily_visitors[     game_day]) this.daily_visitors[     game_day] = {};
	if (!this.real_daily_visitors[real_day]) this.real_daily_visitors[real_day] = {};

	if (!this.daily_visitors[game_day][pc_tsid]){
		this.daily_visitors[game_day][pc_tsid] = 0;

		var cap = this.cultivation_get_rewards_cap(this.owner);
		this.cultivation_add_img_rewards(this, Math.round(cap * 0.03));
	}

	if (!this.real_daily_visitors[real_day][pc_tsid]){
		this.real_daily_visitors[real_day][pc_tsid] = 0;
	}

	this.daily_visitors[game_day][pc_tsid]++;
	this.real_daily_visitors[real_day][pc_tsid]++;
}

function home_cleanup_visitors(){

	//
	// deal with game day logs first
	//

	if (this.daily_visitors){

		var today = current_day_key();

		for (var i in this.daily_visitors){
			if (i != today){
				delete this.daily_visitors[i];
			}
		}
	}

	//
	// now real-world days
	//

	if (this.real_daily_visitors){

		//log.info('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& scanning history for '+this.tsid);

		var today = real_day_key();

		for (var i in this.real_daily_visitors){
			if (i != today){
				var count = this.real_daily_visitors[i].__length;

				//log.info('&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& '+i+' = '+count);

				if (this.owner){

					utils.http_get('callbacks/player_street_visitors.php', {

						'player'	: this.owner.tsid,
						'type'		: this.homes_get_type(),
						'date'		: i,
						'count'		: count,
					});

					//delete this.real_daily_visitors[i];
				}
			}
		}
	}
}

function give_neighbor_signpost(){
	if (!this.is_public && this.home_id != 'exterior') return;
	if (this.geo_count_signposts()){
		this.geo_unlock_signpost('signpost_1');
		this.apiGeometryUpdated();
	}
	else{
		this.geo_add_signpost({
			x : -328,
			y : -112,
			w : 100,
			h : 200,
			connects : {},
		});
		
		this.apiGeometryUpdated();
	}
}