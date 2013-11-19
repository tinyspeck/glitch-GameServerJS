// http://staging.glitch.com/god/world_hub.php?id=129
// https://docs.google.com/document/d/1K9L8_RFCv_nUMpYS5Y3b30259ckx_yY392JniEQS4LY/edit#

var is_newxp = true;

function hitBox(pc, id, in_box){
	log.info('newbie_island: '+pc+' hit box '+id+', in box: '+(in_box ? 'true': 'false'));

	if (id == 'street4_check'){
		var leave_status = pc.getQuestStatus('leave_gentle_island');
		if (!pc.has_done_intro || leave_status != 'todo'){
			if (pc.getQuestStatus('buy_two_bags') != 'done'){
				pc.moveAvatar(pc.x-250, pc.y);
				pc.announce_vog_fade("You haven't bought your bags from the vendor yet. You really need to do that …");
			}
			else{
				pc.moveAvatar(pc.x-150, pc.y);
				pc.announce_vog_fade("Not so fast — head home first so we can wrap this up//Use the iMG menu to go back to your home street.", {done_payload: {location_script_name: 'openImagination'}});
			}
		}

		return true;
	}
	else if (id == 'gentle_island_exit'){
		delete pc.return_to_gentle_island;
		//pc.apiSetTimerX('quests_set_flag', 20000, 'leave_gentle_island');
		pc.teleportHome();
		return true;
	}
	else if (id == 'street_spirit_pan'){
		if (this.qurazy_got && !this.street_spirit_pan){
			var spirit = this.findFirst('street_spirit_groddle');
			if (!spirit) spirit = this.findFirst('street_spirit_zutto');
			if (spirit){
				pc.centerCamera({x: spirit.x, y: spirit.y}, 5000);
				this.street_spirit_pan = true;
			}
		}
		return true;
	}
	else if (id == 'quickstart_account_check'){
		if (pc.quickstart_needs_account){
			pc.moveAvatar(pc.x-250, pc.y, 'right');
			pc.announce_vog_fade("You must finish creating your account to get off Gentle Island.");

			pc.apiSendMsg({
				type: "ui_callout",
				section: 'ready_to_save'
			});
		}
		return true;
	}
}

function playerEnterCallback(pc){
	if (this.instance_id != 'NB_Street2') pc.achievements_run_queue(); // We can do achievements now

	// Fix up quoins to fire proper location events
	var quoin_event_id;
	if (this.instance_id == 'NB_Street1'){
		if (!this.img_shuffled){
			pc.imagination_reshuffle_hand(true);
			this.img_shuffled = true;
		}

		quoin_event_id = 'mappery_upgrade';
	}
	/*else if (this.instance_id == 'NB_Street3'){
		quoin_event_id = 'camera_upgrade';
	}*/
	else if (this.instance_id == 'NB_Street4'){
		quoin_event_id = 'explain_upgrades';
	}

	if (quoin_event_id && (!pc.has_done_intro || this.instance_id == 'NB_Street4')){
		if (!this.qurazy_got) this.spawnQurazy(pc);

		var quoins = this.find_items('quoin');
		for (var i in quoins){
			var q = quoins[i];
			if (!q) continue;

			if (q.getInstanceProp('type') == 'qurazy'){
				q.setInstanceProp('location_event_id', quoin_event_id);
			}
		}
	}

	if (this.instance_id == 'NB_Street2' && !pc.has_done_intro){
		var quoin_event_id1 = 'zoom_upgrade';
		var quoin_event_id2 = 'other_upgrade';

		var quoins = this.find_items('quoin');
		for (var i in quoins){
			var q = quoins[i];
			if (!q) continue;

			if (q.x == -1135 && q.y == -1322){
				q.setInstanceProp('location_event_id', quoin_event_id1);
			}
			else if (q.x == 122 && q.y == -1288){
				q.setInstanceProp('location_event_id', quoin_event_id2);
			}
		}
	}

	// Set piggy to not be hungry, set hitboxes on magic rock
	if (this.instance_id == 'NB_Street1'){
		var piggies = this.find_items('npc_piggy');
		for (var i in piggies){
			var p = piggies[i];
			if (!p) continue;

			p.setInstanceProp('mood', 2);
			p.setInstanceProp('hunger', 0);
		}

		var rock = this.findFirst('magic_rock');
		if (rock){
			rock.apiAddHitBox('below', 120, -400);
			rock.not_selectable = true;
		}
	}
	// Generate random musicblock, fill garden with spinach
	else if (this.instance_id == 'NB_Side_Street2'){
		if (!this.musicblock_generated){
			var block_class = choose_one([
				'musicblock_b_brown_01',
				'musicblock_b_brown_02',
				'musicblock_b_brown_03',
				'musicblock_b_brown_04',
				'musicblock_b_brown_05',
				'musicblock_d_blue_01',
				'musicblock_d_blue_02',
				'musicblock_d_blue_03',
				'musicblock_d_blue_04',
				'musicblock_d_blue_05',
				'musicblock_d_green_01',
				'musicblock_d_green_02',
				'musicblock_d_green_03',
				'musicblock_d_green_04',
				'musicblock_d_green_05',
				'musicblock_d_red_01',
				'musicblock_d_red_02',
				'musicblock_d_red_03',
				'musicblock_d_red_04',
				'musicblock_d_red_05',
				'musicblock_x_shiny_01',
				'musicblock_x_shiny_02',
				'musicblock_x_shiny_03',
				'musicblock_x_shiny_04',
				'musicblock_x_shiny_05'
			]);
			log.info(this+' creating music block of class: '+block_class);
			if (block_class){
				var s = this.createItemStack(block_class, 1, -988, -467);
				if (s) this.musicblock_generated = true;
			}
		}

		if (!this.garden_filled){
			var gardens = this.find_items('garden_new');
			for (var i in gardens){
				var g = gardens[i];
				if (!g) continue;

				g.setNewXPGarden();
			}

			this.garden_filled = true;
		}
	}

	// Street spirit scripting
	if (this.instance_id == 'NB_Street3'){
		// We sing!
		if (!this.street_spirit_done_singing){
			var spirit = this.findFirst('street_spirit_groddle');
			if (!spirit) spirit = this.findFirst('street_spirit_zutto');
			if (spirit){
				spirit.apiSetHitBox(160, 400);
				spirit.singTo(pc);
			}
		}
	}

	if (pc.newbie_island_butterfly_lotion){
		this.events_set_flag('butterfly_lotion_msg_off_called');
	}
	if (pc.newbie_island_butterfly_massaged){
		this.events_set_flag('butterfly_msg_off_called');
	}

	// Hide butterfly VoG events for players that already know about AK
	if (this.instance_id == 'NB_Street3' && !pc.isGreeter() && pc.skills_has('animalkinship_1')){
		this.events_set_flag('has_ak');
	}

	if (this.instance_id == 'NB_Street4'){
		if (pc.quickstart_needs_account){
			this.events_broadcast('enable_wall');
		}
		else{
			this.events_broadcast('disable_wall');
		}
	}

	// http://bugs.tinyspeck.com/10780 - Newxp: Moving back to surveyor's stroll says "now entering gentle island"
	if (this.special_loading_image) delete this.special_loading_image;

	//
	// Return to Gentle Island
	//

	if (pc.has_done_intro && !pc.return_to_gentle_island){
		pc.run_overlay_onmove = 'return_to_gentle_island';
	}

	pc.newxpProgressCallback({
		action: 'enter',
		stage: this.instance_id,
		enter_ts: time()
	});
}

function playerExitCallback(pc){
	// Street spirit scripting
	if (this.instance_id == 'NB_Street3'){
		// We sing!
		if (!this.street_spirit_done_singing){
			var spirit = this.findFirst('street_spirit_groddle');
			if (!spirit) spirit = this.findFirst('street_spirit_zutto');
			if (spirit){
				spirit.apiCancelTimer('singTo');
			}
		}
	}

	pc.newxpProgressCallback({
		action: 'exit',
		stage: this.instance_id,
		enter_ts: pc.stats_get_last_street_visit(this.instance_of ? this.instance_of : this.tsid),
		exit_ts: time()
	});
}

function hideUIOnLoad(ui_component, pc){
	if (ui_component == 'imagination' && !this.imagination_revealed && (!pc || (!pc.has_done_intro && !pc.newxp_allow_home))) return true;
	if (ui_component == 'current_location' && (!pc || !pc.imagination_has_upgrade('mappery'))) return true;
	if (ui_component == 'map' && (!pc || !pc.imagination_has_upgrade('mappery'))) return true;
	if (ui_component == 'world_map') return true;
	if (ui_component == 'inventory_search') return true;
	if (ui_component == 'currants' && !this.currants_revealed && this.instance_id == 'NB_Street1') return true;
	if (ui_component == 'skill_learning' && (!pc || !pc.has_done_intro)) return true;
	if (ui_component == 'home_street_visiting' && (!pc || !pc.has_done_intro)) return true;
	return false;
}

function upgradeGranted(pc, upgrade_id){
	this.qurazy_got = true;

	log.info(this+' upgradeGranted: '+pc+' '+upgrade_id);
}

function upgradeConfirmed(pc, upgrade_id){
	log.info(this+' upgradeConfirmed: '+pc+' '+upgrade_id);
	if (upgrade_id == 'mappery'){
		pc.announce_vog_fade("Mappery is the full package: it comes with everything …//… a minimap showing your current location …", {delay_ms: 2000, done_payload: {location_script_name: 'revealMappery'}});
	}
	else if (upgrade_id == 'camera_mode'){
		pc.announce_vog_fade("Press the ‘C’ key to enter Camera Mode, then use the arrow keys to peek around your current location.", {delay_ms: 2000});
	}
	else if (upgrade_id == 'zoomability'){
		pc.announce_vog_fade("Use the + and - keys to zoom in and out. The 0 (zero) key will reset you to normal zoom level.", {delay_ms: 2000, css_class: 'nuxp_vog_brain', no_locking: true, duration: 7000, text_fade_delay_sec: 0, fade_sec: 0, fade_alpha: 0});
	}
	else if (upgrade_id == 'encyclopeddling'){
		pc.announce_vog_fade("[[class=nuxp_big]]O, what mystical new power of insight is this!?//Now you can press the \"i\" key at any time to tap directly into the great Encyclopedia.", {delay_ms: 2000, css_class: 'nuxp_vog_medplus'}); 
	}
}

function revealMappery(pc){
	pc.apiSendAnnouncement({
		type: 'vp_canvas',
		uid: 'mappery_canvas',
		canvas: {
			color: '#000000',
			steps: [
				{alpha:0.3, secs:1}
			],
			loop: false
		},
		fade_out_sec:1,
		at_bottom: true,
		locking: true
	});

	pc.changeUIComponent('hubmap', true);
	pc.changeUIComponent('map', true);
	pc.changeUIComponent('current_location', true);

	pc.apiSendMsg({
		type: "ui_callout",
		section: 'mini_map'
	});

	this.apiSetTimerX('revealMappery2', 3000, pc);

	return true;
}

function revealMappery2(pc){
	pc.overlay_dismiss('mappery_canvas');
	pc.announce_vog_fade("… and a big ol’ area map which lets you set destinations and get directions.", {done_payload: {location_script_name: 'calloutMap'}});
}

function calloutMap(pc){
	pc.apiSendMsg({
		type: "ui_callout",
		section: 'icon_map'
	});

	pc.apiSendMsg({
		type: 'map_open_delayed',
		hub_id: this.hubid,
		location_tsid: (this.instance_of == 'LA952QGCH3D31E2' ? 'LA94UK1BH3D3FJL' : 'LIF8LHA3HT336O0')
	});

	pc.sendActivity("Click on the street “Progress Way” and set it as your destination.");

	return true;
}

function explainQuest(pc){
	var rock = this.findFirst('magic_rock');
	if (rock){
		var choices = [{txt:'Currants? What are currants?', value:'explain-currants'}];
		rock.conversation_start(pc, "You need to go and find the CHEAP BAG VENDOR on PROGRESS WAY.<split butt_txt=\"OK\">Bags cost about 500 currants each, I think. You should get two. I can give you the money, let’s see here …", choices, null, null, null, {dont_take_camera_focus: true});
	}

	return true;
}

function revealCurrants(pc){
	this.currants_revealed = true;
	pc.changeUIComponent('currants', true);
	pc.apiSendMsg({
		type: "ui_callout",
		section: 'currants',
		display_time: 3000
	});
	this.apiSetTimerX('revealCurrants2', 2000, pc);

	// lock the player
	pc.apiSendAnnouncement({
		uid: 'currants_lock',
		type: "vp_overlay",
		duration: 6000,
		locking: true,
		width: 500,
		x: '50%',
		top_y: '-1000', // HIDE IT! We want it only to listen for the hub map closing and send the done_payload
		delay_ms: 0,
		click_to_advance: false,
		text: [
			'<p><span class="nuxp_medium">THIS IS HIDDEN</span></p>'
		]
	});

	return true;
}

function revealCurrants2(pc){

	pc.stats_add_currants(978, {type: 'newxp_bag_quest'});
	this.apiSetTimerX('revealCurrants3', 4000, pc);
}

function revealCurrants3(pc){
	var rock = this.findFirst('magic_rock');
	if (rock){
		var choices = [{txt:'Thanks', value:'explain-questlog'}];
		rock.conversation_start(pc, "Hmmm. Looks like I was a little short — that’s not quite enough for two bags.<split butt_txt=\"Dang\">Oh well — shouldn’t be THAT hard for you to rustle up a few more currants on your way to find the CHEAP BAG VENDOR on PROGRESS WAY (like I previously mentioned). Good luck!", choices, null, null, null, {dont_take_camera_focus: true});
	}
}

function giveQuest(pc){
	pc.startQuest('buy_two_bags', false, true);
	pc.apiSendMsg({type: 'quest_dialog_start'});
	this.current_step = 'given_quest';

	pc.sendActivity("Use the ‘L’ key to bring up your Quest Log whenever you want");
	pc.apiSetTimer('newxpQuestReminder', 5*60*1000);

	var rock = this.findFirst('magic_rock');
	if (rock){
		rock.setAndBroadcastState('readStart');
		rock.apiSetTimer('onIdle', 1000);
	}

	return true;
}

function eventFired(event_id, target, args){
	var ret = {};
	
	log.info('newbie_island: eventFired: '+event_id+' -- '+args);
	if (!args) return;
	var pc = args.pc;

	if (event_id == 'items_added' && args.stack.class_tsid == 'spinach'){
		if (!this.events_has_flag('spinach_hint_off_called')){
			this.events_broadcast('spinach_hint_off');
			this.events_set_flag('spinach_hint_off_called');
		}
	}

	if (event_id == 'verb_activate' && target.class_tsid == 'spinach'){
		if (!this.events_has_flag('spinach_hint2_off_called')){
			this.events_broadcast('spinach_hint2_off');
			this.events_set_flag('spinach_hint2_off_called');
		}
	}
	
	if (event_id == 'items_added' && args.stack.class_tsid == 'butterfly_lotion'){
		if (!this.events_has_flag('butterfly_lotion_msg_off_called') && !pc.newbie_island_butterfly_lotion){
			this.events_broadcast('butterfly_lotion_msg_off');
			this.events_set_flag('butterfly_lotion_msg_off_called');
			pc.newbie_island_butterfly_lotion = true;
		}
	}

	if (event_id == 'verb_massage'){
		if (!this.events_has_flag('butterfly_msg_off_called') && !pc.newbie_island_butterfly_massaged){
			this.events_broadcast('butterfly_msg_off');
			this.events_set_flag('butterfly_msg_off_called');
			pc.newbie_island_butterfly_massaged = true;
		}
	}
	
	if (event_id == 'items_added' && args.stack.hasTag('musicblock')){
		if (!this.events_has_flag('musicblock_msg_off_called')){
			this.events_set_flag('musicblock_msg_off_called');
			this.events_broadcast('musicblock_msg_off');
		}
	}
	
	if (event_id == 'items_added' && args.stack.class_tsid == 'gameshow_ticket'){
		if (!this.events_has_flag('gst_off_called')){
			this.events_broadcast('gst_off');
			this.events_set_flag('gst_off_called');
		}
	}

	return ret;
}

function onQuestDialogEnd(pc){
	this.apiSetTimerX('rockLuck', 2000, pc);
}

function rockLuck(pc){
	var rock = this.findFirst('magic_rock');
	if (rock){
		rock.setAndBroadcastState('readBreak');
		rock.sendBubble("Good luck …", 3000, pc);
		rock.apiSetTimerX('setAndBroadcastState', 2000, 'readResume');
	}
}

function revealImagination(pc){

	this.imagination_revealed = true;
	pc.changeUIComponent('imagination', true);
	pc.apiSetTimerX('apiSendMsg', 750, {
		type: "ui_callout",
		section: 'imagination_menu',
		display_time: 3000
	});
	pc.announce_vog_fade("Just use the imagination menu (hotkey: X)", {done_payload: {location_script_name: 'openImagination'}});

	return true;
}

function openImagination(pc){
	pc.apiSendMsg({type: 'open_img_menu'});

	pc.apiSendMsg({
		type: "ui_callout",
		section: 'go_home',
		display_time: 3000
	});

	pc.newxp_allow_home = true;

	return true;
}

function openContacts(pc){
	pc.apiSendMsg({
		type: "ui_callout",
		section: 'contacts',
		display_time: 0
	});

	pc.return_to_gentle_island = true;

	return true;
}

function onContactListOpened(pc){
	pc.apiSendMsg({
		type: "ui_callout",
		section: 'live_help',
		display_time: 3000
	});

	pc.apiSetTimerX('announce_vog_fade', 3000, "Good luck! And just explore … try everything, see what happens. You'll learn all you need that way.");
}