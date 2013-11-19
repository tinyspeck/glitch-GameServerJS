log.info("Starting main...");

//
// the main dispatch handler
//

function processMessage(pc, msg){
	//log.info("TYPE="+msg.type);

	processMessageInner(pc, msg);

	pc.performPostProcessing(msg);
}

function processMessageInner(pc, msg){

	switch (msg.type){
		case 'move_vec':				return doVecMove(pc, msg);
		case 'move_xy':					return doXYMove(pc, msg);
		case 'login_start':				return doLoginStart(pc, msg, false);
		case 'login_end':				return doLoginEnd(pc, msg, false);
		case 'relogin_start':				return doLoginStart(pc, msg, true);
		case 'relogin_end':				return doLoginEnd(pc, msg, true);
		case 'location_passthrough':			return doLocationPassthrough(pc, msg);
		case 'signpost_move_start':			return doStartSignpostMove(pc, msg);
		case 'signpost_move_end':			return doEndSignpostMove(pc, msg);
		case 'follow_move_end':				return doEndMove(pc, msg, 'pc_follow_move');
		case 'door_move_start':				return doStartDoorMove(pc, msg);
		case 'door_move_end':				return doEndDoorMove(pc, msg);
		case 'afk':					return doAFK(pc, msg);
		case 'local_chat':				return doLocalChat(pc, msg);
		case 'local_chat_start':				return doLocalChatStart(pc, msg);

		case 'itemstack_verb':				return doVerb(pc, msg);
		case 'itemstack_verb_menu':			return doItemstackVerbMenu(pc, msg);
		case 'itemstack_menu_up':			return doMenuUp(pc, msg);
		case 'itemstack_mouse_over':			return doMouseOver(pc, msg);
		case 'itemstack_verb_cancel':			return doVerbCancel(pc, msg);
		case 'itemstack_inspect':			return doInspectItem(pc, msg);
		case 'itemstack_modify':			return doModifyItem(pc, msg);
		case 'itemstack_create':			if (pc.is_god) return doCreateItem(pc, msg);
		case 'itemstack_status':			return doStatusItem(pc, msg);
		case 'itemstack_invoke':			return doItemstackInvoke(pc, msg);
		case 'itemstack_sync':				return doSync(pc, msg);

		case 'get_item_defs':				return doGetItemDefs(pc, msg);
		case 'get_item_asset':				return doGetItemAsset(pc, msg);
		case 'get_item_placement':			return doGetItemPlacement(pc, msg);

		case 'edit_location':				if (pc.is_god) return doReplaceGeometry(pc, msg);
		case 'im_send':					return doSendIM(pc, msg);
		case 'location_lock_request':			return doLocationLock(pc, msg);
		case 'location_lock_release':			return doLocationUnlock(pc, msg);
		case 'conversation_choice':			return doConversationChoice(pc, msg);
		case 'conversation_cancel':			return doConversationCancel(pc, msg);
		case 'teleport_move_end':			return doEndTeleportMove(pc, msg);
		case 'note_close':				return doNoteClose(pc, msg);

		case 'buddy_add':				return doBuddyAdd(pc, msg);
		case 'buddy_remove':				return doBuddyRemove(pc, msg);

		case 'ping':					return doPing(pc, msg);
		case 'follow_start':				return doStartFollow(pc, msg);
		case 'follow_end':				return doStopFollow(pc, msg);
		case 'make_known':				return doMakeKnown(pc, msg);
		case 'make_unknown':				return doMakeUnknown(pc, msg);
		case 'recipe_request':				return doRecipeRequest(pc, msg);
		case 'store_buy':				return doStoreBuy(pc, msg);
		case 'store_sell':				return doStoreSell(pc, msg);
		case 'store_sell_check':			return doStoreSellCheck(pc, msg);
		case 'overlay_dismissed':			return doOverlayDismissed(pc, msg);
		case 'overlay_done':				return doOverlayDone(pc, msg);
		case 'overlay_click':				return doOverlayClick(pc, msg);
		case 'screen_view_close':			return doScreenViewClose(pc, msg);
		case 'close_img_menu':				return doScreenViewClose(pc, msg);
		case 'inventory_move':				return doInventoryMove(pc, msg);
		case 'location_move':				return doLocationMove(pc, msg);
		case 'location_drag_targets':			return doLocationDragTargets(pc, msg);
		case 'inventory_drag_targets':			return doInventoryDragTargets(pc, msg);
		case 'echo_annc':				return doEchoAnnc(pc, msg);
		case 'play_music':				return doPlayMusic(pc, msg);

		case 'groups_chat_join':			return doGroupsChatJoin(pc, msg);
		case 'groups_chat_leave':			return doGroupsChatLeave(pc, msg);
		case 'groups_chat':				return doGroupsChat(pc, msg);

		case 'prompt_choice':				return doPromptChoice(pc, msg);

		case 'trade_start':				return doStartTrade(pc, msg);
		case 'trade_cancel':				return doCancelTrade(pc, msg);
		case 'trade_add_item':				return doTradeAddItem(pc, msg);
		case 'trade_remove_item':			return doTradeRemoveItem(pc, msg);
		case 'trade_change_item':			return doTradeChangeItem(pc, msg);
		case 'trade_currants':				return doTradeCurrants(pc, msg);
		case 'trade_accept':				return doTradeAccept(pc, msg);
		case 'trade_unlock':				return doTradeUnlock(pc, msg);

		case 'skills_can_learn':			return doSkillsCanLearn(pc, msg);
		case 'skill_unlearn_cancel':			return doUnlearnCancel(pc, msg);

		case 'action_request_reply':			return doActionRequestReply(pc, msg);
		case 'action_request_cancel':			return doActionRequestCancel(pc, msg);
		case 'action_request_broadcast':		return doActionRequestBroadcast(pc, msg);

		case 'teleportation_set':			return doTeleportationSet(pc, msg);
		case 'teleportation_go':			return doTeleportationGo(pc, msg);
		case 'teleportation_map':			return doTeleportationMap(pc, msg);

		case 'pc_verb_menu':				return doPcVerbMenu(pc, msg);
		case 'pc_menu':					return doPCMenu(pc, msg);
		case 'emote':					return doEmote(pc, msg);

		case 'quest_begin':				return doQuestBegin(pc, msg);
		case 'quest_conversation_choice':		return doQuestConversationChoice(pc, msg);
		case 'quest_dialog_closed':			return doQuestDialogEnd(pc, msg);

		case 'shrine_spend':				return doShrineSpend(pc, msg);
		case 'emblem_spend':				return doEmblemSpend(pc, msg);
		case 'shrine_favor_request':            return doShrineFavorRequest(pc, msg);
		case 'favor_request':            return doFavorRequest(pc, msg);

		case 'job_apply_work':				if (pc.is_god) return doJobApplyWork(pc, msg);
		case 'job_contribute_item':			return doJobContributeItem(pc, msg);
		case 'job_contribute_currants':			return doJobContributeCurrants(pc, msg);
		case 'job_contribute_work':			return doJobContributeWork(pc, msg);
		case 'job_stop_work':				return doJobStopWork(pc, msg);
		case 'job_leaderboard':				return doJobLeaderboard(pc, msg);
		case 'job_status':				return doJobStatus(pc, msg);
		case 'job_claim':				return doJobClaim(pc, msg);

		case 'input_response':				return doInputResponse(pc, msg);
		case 'note_save':				return doInputResponse(pc, msg);
		case 'teleportation_script_create':		return doInputResponse(pc, msg);
		case 'teleportation_script_use':		return doTPScriptUse(pc, msg);
		case 'teleportation_script_imbue':		return doTPScriptImbue(pc, msg);

		case 'map_get':					return doMapGet(pc, msg);
		case 'get_path_to_location':			return doMapGetPath(pc, msg);
		case 'clear_location_path':			return doMapClearPath(pc, msg);

		case 'set_prefs':				return doSetPrefs(pc, msg);
		case 'garden_action':				return doGardenAction(pc, msg);

		// Notice board feature
		case 'notice_board_action':			return doNoticeBoardAction(pc, msg);

		// Mail messages
		case 'mail_send':				return doMailSend(pc, msg);
		case 'mail_receive':				return doMailReceive(pc, msg);
		case 'mail_read':				return doMailRead(pc, msg);
		case 'mail_delete':				return doMailDelete(pc, msg);
		case 'mail_archive':				return doMailArchive(pc, msg);
		case 'mail_cancel':				return doMailCancel(pc, msg);
		case 'mail_cost':				return doMailCost(pc, msg);
		case 'mail_check':				return doMailCheck(pc, msg);
		
		// camera mode notices form client
		case 'camera_mode_started':			return doCameraModeStarted(pc, msg);
		case 'camera_mode_ended':			return doCameraModeEnded(pc, msg);

		// Parties
		case 'party_invite':				return doPartyInvite(pc, msg);
		case 'party_chat':				return doPartyChat(pc, msg);
		case 'party_leave':				return doPartyLeave(pc, msg);
		case 'party_space_response':			return doPartySpaceInviteResponse(pc, msg);
		case 'party_space_join':			return doPartySpaceJoin(pc, msg);
		
		//
		// House ACLs
		//
		case 'acl_key_info':				return doAclKeyInfo(pc, msg);
		case 'acl_key_change':				return doAclKeyChange(pc, msg);

		//
		// god-only messages
		//
		case 'admin_loc_request':			if (pc.is_god || pc.is_help) return doAdminLocRequest(pc, msg);
		case 'admin_teleport':				if (pc.is_god || pc.is_help) return doAdminTeleport(pc, msg);
		case 'perf_teleport':				return doPerfTeleport(pc, msg);
		case 'guide_status_change':			return doGuideStatusChange(pc, msg);
		
		// games
		case 'splash_screen_button_payload':		return doSplashScreenButtonPayload(pc, msg);

		case 'new_item_window_closed':			return doNewItemWindowClosed(pc, msg);

		// houses
		case 'houses_add_neighbor':			return doAddNeighbor(pc, msg);
		case 'houses_remove_neighbor':			return doRemoveNeighbor(pc, msg);

		case 'houses_expand_costs':			return doHousesExpandCosts(pc, msg);
		case 'houses_expand_wall':			return doHousesExpandWall(pc, msg);
		case 'houses_expand_yard':			return doHousesExpandYard(pc, msg);
		case 'houses_expand_tower':			return doHousesExpandTower(pc, msg);
		case 'houses_unexpand_wall':			return doHousesUnexpandWall(pc, msg);

		case 'houses_style_choices':			return doHousesStyleChoices(pc, msg);
		case 'houses_style_switch':			return doHousesStyleSwitch(pc, msg);

		case 'houses_wall_choices':			return doHousesWallChoices(pc, msg);
		case 'houses_wall_set':				return doHousesWallSet(pc, msg);
		case 'houses_wall_buy':				return doHousesWallBuy(pc, msg);
		case 'houses_wall_preview':			return doHousesWallPreview(pc, msg);

		case 'houses_floor_choices':			return doHousesFloorChoices(pc, msg);
		case 'houses_floor_set':			return doHousesFloorSet(pc, msg);
		case 'houses_floor_buy':			return doHousesFloorBuy(pc, msg);
		case 'houses_floor_preview':			return doHousesFloorPreview(pc, msg);

		case 'houses_ceiling_choices':			return doHousesCeilingChoices(pc, msg);
		case 'houses_ceiling_set':			return doHousesCeilingSet(pc, msg);
		case 'houses_ceiling_buy':			return doHousesCeilingBuy(pc, msg);
		case 'houses_ceiling_preview':			return doHousesCeilingPreview(pc, msg);
/* deprecated */ case 'houses_deco_mode':			return doNoEnergyMode(pc, msg);
		case 'no_energy_mode':				return doNoEnergyMode(pc, msg);

		case 'tower_set_name':				return doTowerSetName(pc, msg);
		case 'tower_set_floor_name':			return doTowerSetFloorName(pc, msg);
		case 'houses_set_name':				return doHousesSetName(pc, msg);
		case 'houses_visit':				return doHousesVisit(pc, msg);
		case 'houses_signpost':				return doHousesSignpost(pc, msg);

		case 'furniture_drop':				return doFurnitureDrop(pc, msg);
		case 'furniture_move':				return doFurnitureMove(pc, msg);
		case 'furniture_pickup':			return doFurniturePickup(pc, msg);
		case 'furniture_upgrade_purchase':		return doFurnitureUpgradePurchase(pc, msg);
		case 'furniture_set_zeds':			return doFurnitureSetZeds(pc, msg);
		case 'furniture_set_user_config':		return doFurnitureSetUserConfig(pc, msg);
		case 'itemstack_set_user_config':		return doItemstackSetUserConfig(pc, msg);
		case 'resnap_minimap':				return doResnapMiniMap(pc, msg);
		
		case 'cultivation_start':			return doCultivationStart(pc, msg);
		case 'cultivation_purchase':			return doCultivationPurchase(pc, msg);

		// imagination
		case 'imagination_purchase':			return doImaginationPurchase(pc, msg);
		case 'imagination_purchase_confirmed':		return doImaginationPurchaseConfirmed(pc, msg);
		case 'imagination_shuffle':			return doImaginationShuffle(pc, msg);

		case 'nudgery_start':				return doNudgeryStart(pc, msg);
		case 'itemstack_nudge':				return doItemstackNudge(pc, msg);

		case 'contact_list_opened':			return doContactListOpened(pc, msg);

		case 'cultivation_mode_ended':		return doCultivationModeEnded(pc, msg);
		
		case 'item_discovery_dialog_closed':	return itemDiscoveryDialogClosed(pc, msg);

		case 'snap_travel':			return doSnapTravel(pc, msg);
		case 'snap_travel_forget':		return doSnapTravelForget(pc, msg);

		case 'avatar_get_choices':			return doAvatarGetChoices(pc, msg);

		case 'share_track':				return doShareButton(pc, msg);

		case 'craftybot_add':				return doCraftybotMessage(pc, msg);
		case 'craftybot_remove':			return doCraftybotMessage(pc, msg);
		case 'craftybot_cost':				return doCraftybotMessage(pc, msg);
		case 'craftybot_pause':				return doCraftybotMessage(pc, msg);
		case 'craftybot_lock':				return doCraftybotMessage(pc, msg);
		case 'craftybot_refuel':			return doCraftybotMessage(pc, msg);

		case 'hi_emote_missile_hit':		return doHiEmoteMissileHit(pc, msg);
		case 'get_hi_emote_leaderboard':		return doGetHiEmoteLeaderboard(pc, msg);
	}
	

	log.info(pc.tsid+' '+msg);
	var rsp = make_rsp(msg);
	rsp.success = false;
	if (msg.type){
		rsp.msg = 'unrecognized msg type: '+msg.type;
	}else{
		rsp.msg = 'unspecified msg type';
	}
	pc.apiSendMsg(rsp);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

function stat_format(s){
	return {
		value: s.value,
		max: s.top
	};
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doLoginStart(pc, msg, isRelogin){

//log.info('***LOGIN-START-'+pc.tsid+'-1');

	pc.didStartStreetMove();

	var rsp = make_rsp(msg);
	rsp.success = true;
	
	apiLogAction('LOGIN_START', 'pc='+pc.tsid, 'loc='+pc.location.tsid, 'played='+pc.getTimePlayed());

	if (isRelogin){
		rsp.relogin_type = msg.relogin_type;
		// simulate moving into location
		pc.location.apiMoveIn(pc, pc.x, pc.y);

		// Call the player's java code to make end of the move arrangements
		pc.apiEndLocationMove(pc.location);
	}else{
		//
		// Let's make sure the player is in a good place
		//
		
		var below = pc.location.apiGetPointOnTheClosestPlatformLineBelow(pc.x, pc.y-1);
		if (!below){
			var above = pc.location.apiGetPointOnTheClosestPlatformLineAbove(pc.x, pc.y);
			if (above){
				pc.apiSetXY(above.x, above.y);
			}
			else{
				log.error(pc+" is in a bad place, but can't be fixed");
			}
		}
		
		//
		// sounds file, if defined
		//
		
		if (config.sounds_url){
			rsp.sounds_file = config.sounds_url;

			rsp.ambient_library = {
				'default': [
					config.music_map['FOREST_AMBIENT1'],
					config.music_map['FOREST_AMBIENT2'],
					config.music_map['FOREST_AMBIENT3'],
					config.music_map['FOREST_AMBIENT4']
				],
				'caverns': [
					config.music_map['AMBIENT_CAVERNS1'],
					config.music_map['AMBIENT_CAVERNS2'],
					config.music_map['AMBIENT_CAVERNS3'],
					config.music_map['AMBIENT_CAVERNS4']
				],
				'uralia': [
					config.music_map['AMBIENT_URALIA1'],
					config.music_map['AMBIENT_URALIA2'],
					config.music_map['AMBIENT_URALIA3'],
					config.music_map['AMBIENT_URALIA4']
				],
				'firebog': [
					config.music_map['AMBIENT_FIREBOGS1'],
					config.music_map['AMBIENT_FIREBOGS2'],
					config.music_map['AMBIENT_FIREBOGS3'],
					config.music_map['AMBIENT_FIREBOGS4'],
					config.music_map['AMBIENT_FIREBOGS5'],
					config.music_map['AMBIENT_FIREBOGS6'],
					config.music_map['AMBIENT_FIREBOGS7']
				],
				'savanna': [
					config.music_map['AMBIENT_SAVANNA1'],
					config.music_map['AMBIENT_SAVANNA2'],
					config.music_map['AMBIENT_SAVANNA3'],
					config.music_map['AMBIENT_SAVANNA4'],
					config.music_map['AMBIENT_SAVANNA5'],
					config.music_map['AMBIENT_SAVANNA6']
				],
				'highlands': [
					config.music_map['AMBIENT_HIGHLANDS1'],
					config.music_map['AMBIENT_HIGHLANDS2'],
					config.music_map['AMBIENT_HIGHLANDS3'],
					config.music_map['AMBIENT_HIGHLANDS4'],
					config.music_map['AMBIENT_HIGHLANDS5'],
					config.music_map['AMBIENT_HIGHLANDS6'],
					config.music_map['AMBIENT_HIGHLANDS7']
				],
				'cave': [
					config.music_map['CAVE_MUSIC1'],
					config.music_map['CAVE_MUSIC2'],
					config.music_map['CAVE_MUSIC3'],
					config.music_map['CAVE_MUSIC4'],
					config.music_map['CAVE_MUSIC5']
				],
				'ix': [
					config.music_map['AMBIENT_IX_1'],
					config.music_map['AMBIENT_IX_2'],
					config.music_map['AMBIENT_IX_3'],
					config.music_map['AMBIENT_IX_4'],
					config.music_map['AMBIENT_IX_5'],
					config.music_map['AMBIENT_IX_6'],
					config.music_map['AMBIENT_IX_7'],
					config.music_map['AMBIENT_IX_8'],
					config.music_map['AMBIENT_IX_9'],
					config.music_map['AMBIENT_IX_10'],
					config.music_map['AMBIENT_IX_11'],
					config.music_map['AMBIENT_IX_12'],
					config.music_map['AMBIENT_IX_13'],
					config.music_map['AMBIENT_IX_14'],
					config.music_map['AMBIENT_IX_15'],
					config.music_map['AMBIENT_IX_16'],
					config.music_map['AMBIENT_IX_17'],
					config.music_map['AMBIENT_IX_18']
				],
				'andra_kajuu': [
					config.music_map['ANDRA_KAJUU_1'],
					config.music_map['ANDRA_KAJUU_2'],
					config.music_map['ANDRA_KAJUU_3'],
					config.music_map['ANDRA_KAJUU_4'],
					config.music_map['ANDRA_KAJUU_5'],
					config.music_map['ANDRA_KAJUU_6'],
					config.music_map['ANDRA_KAJUU_7'],
					config.music_map['ANDRA_KAJUU_8'],
					config.music_map['ANDRA_KAJUU_9'],
					config.music_map['ANDRA_KAJUU_10'],
					config.music_map['ANDRA_KAJUU_11'],
					config.music_map['ANDRA_KAJUU_12'],
					config.music_map['ANDRA_KAJUU_13'],
					config.music_map['ANDRA_KAJUU_14'],
					config.music_map['ANDRA_KAJUU_15']
				],
				'kloro_haoma': [
					config.music_map['AMBIENT_KLORO_HAOMA1']
				],
				'urwok': [
					config.music_map['AMBIENT_URWOK1'],
					config.music_map['AMBIENT_URWOK2'],
					config.music_map['AMBIENT_URWOK3'],
					config.music_map['AMBIENT_URWOK4'],
					config.music_map['AMBIENT_URWOK5'],
					config.music_map['AMBIENT_URWOK6'],
					config.music_map['AMBIENT_URWOK7'],
					config.music_map['AMBIENT_URWOK8']
				],
				'jal': [
					config.music_map['JAL1'],
					config.music_map['JAL2']
				],
				'nottis': [
					config.music_map['WINTER_HUB1'],
					config.music_map['WINTER_HUB2'],
					config.music_map['WINTER_HUB3'],
					config.music_map['WINTER_HUB4'],
					config.music_map['WINTER_HUB5']
				],
				'bortola_muufo': [
					config.music_map['AMBIENT_FOREST_SLOW1'],
					config.music_map['AMBIENT_FOREST_SLOW2'],
					config.music_map['AMBIENT_FOREST_SLOW3'],
					config.music_map['AMBIENT_FOREST_SLOW4']
				],
				'hell': [
					config.music_map['HELL']
				]
			};
			
			// these map hub ids to records in the ambient_library above
			rsp.ambient_hub_map = {
				'78': 'caverns', // Ilmenskie Deeps
				'50': 'caverns', // Ilmenskie Caverns
				'18': 'caverns', // obaix on dev, for testing
                '51': 'uralia',  // Uralia
                '40': 'hell',

                '63': 'firebog',
                '71': 'firebog',
                '72': 'firebog',
                '77': 'firebog',
                '99': 'firebog',

                '86': 'savanna',
                '95': 'savanna',
                '90': 'savanna',
                '91': 'savanna',

                '76': 'highlands',
                '93': 'highlands',
                '109': 'highlands',
                '114': 'highlands',

                '107': 'cave',
                '106': 'cave',

                '85': 'andra_kajuu',
                '89': 'andra_kajuu',
                '113': 'andra_kajuu',
                '119': 'andra_kajuu',
                '102': 'andra_kajuu', // actually Ormonos, yay!
                '105': 'andra_kajuu', // actually Lida, yay!

                '27': 'ix',

                '133': 'kloro_haoma', // actually Kloro, yay!
                '131': 'kloro_haoma', // actually Haoma, yay!

                '126': 'urwok', // actually Roobrik, yay!
                '128': 'urwok', // actually Balzare, yay!

				'136': 'jal',
				'140': 'jal', // actually Samudra, yay!

				'137': 'nottis',
				'141': 'nottis', // actually Drifa, yay!

				'75': 'bortola_muufo', // actually bortola, yay!
				'97': 'bortola_muufo', // actually yay!
				'112': 'bortola_muufo', // actually brillah yay!
				'116': 'bortola_muufo', // actually haraiva yay!

				'88': 'bortola_muufo', // karnata
				'110': 'cave' // massadoe
			};
		}

		//
		// map data
		//

		rsp.world_map_url = overlay_key_to_url('world_map');
		
		//
		// basic info about the player
		//

		rsp.pc = pc.make_hash_with_location();


		//
		// misc stuff
		//

		rsp.pc.role = 'peon';
		if (pc.is_help) rsp.pc.role = 'help';
		if (pc.is_god) rsp.pc.role = 'god';
		if (pc.is_guide){
			rsp.pc.role = 'guide';
			rsp.pc.guide_on_duty = pc.guide_on_duty ? true : false;
		}
		rsp.prefs = pc.getPrefs();


		//
		// stats & metabolics
		//

		rsp.pc.stats = {};
		pc.stats_get_login(rsp.pc.stats);
		pc.metabolics_get_login(rsp.pc.stats);


		//
		// contents of the pc's bags
		//

		rsp.pc.itemstacks = make_bag(pc);

		var furniture_bag = pc.furniture_get_bag();
		if (furniture_bag){
			var contents = furniture_bag.getContents();
 
			for (var n in contents){
				var it = contents[n];
				if (it){
					rsp.pc.itemstacks[it.tsid] = make_item(it);
				}
			}
		}


		//
		// quests, buffs & familiar
		//

		rsp.quests = pc.quests_get_status();

		rsp.buffs = pc.buffs_get_active();

		rsp.familiar = pc.familiar_get_login();

		rsp.groups = pc.groups_get_login();
		if (!pc.live_help_group || (!in_array_real(pc.live_help_group, config.live_help_groups) && !in_array_real(pc.live_help_group, config.newbie_live_help_groups)) || time() - pc.date_last_loggedin >= 3600){
			if (pc.stats_get_level() < 11){
				pc.live_help_group = choose_one(config.newbie_live_help_groups);
			}
			else{
				pc.live_help_group = choose_one(config.live_help_groups);
			}
		}
		rsp.live_help_group = pc.live_help_group;
		if (!pc.global_chat_group || !in_array_real(pc.global_chat_group, config.global_chat_groups) || time() - pc.date_last_loggedin >= 3600) pc.global_chat_group = choose_one(config.global_chat_groups);
		rsp.global_chat_group = pc.global_chat_group;

		if (pc.canJoinTradeChat()){
			if (!pc.trade_chat_group || !in_array_real(pc.trade_chat_group, config.trade_chat_groups) || time() - pc.date_last_loggedin >= 3600) pc.trade_chat_group = choose_one(config.trade_chat_groups);
			rsp.trade_chat_group = pc.trade_chat_group;
		}

		rsp.prompts = pc.prompts_get_login();
		
		rsp.pc.hi_emote_variant = pc.hi_emote_variant;
		rsp.pc.escrow_tsid = pc.trading.storage_tsid;
		rsp.pc.rewards_bag_tsid = pc.rewards.storage_tsid;
		rsp.pc.mail_bag_tsid = pc.mail.storage_tsid;
		rsp.pc.trophy_storage_tsid = pc.trophies_find_container().tsid;
		rsp.pc.auction_storage_tsid = pc.auctions_find_container().tsid;
		rsp.pc.furniture_bag_tsid = pc.furniture.storage_tsid;
		rsp.pc.needs_account = (pc.quickstart_needs_account && pc.location.class_tsid != 'newxp_intro' && pc.location.class_tsid != 'newxp_training1') ? true : false;

		rsp.acl_key_count = pc.acl_keys_count_received();
		rsp.pol_info = pc.houses_get_login();
		rsp.home_info = pc.houses_get_login_new();

		rsp.overlay_urls = config.overlays_map;
		rsp.newxp_locations = config.newxp_locations;
		
		var hi_variants_tracker = apiFindObject(config.hi_variants_tracker);
		var hi_variants_login_data = {};
		if (hi_variants_tracker) hi_variants_login_data = hi_variants_tracker.get_login_data();
		var infector_pc = (hi_variants_login_data.yesterdays_top_infector_tsid) ? apiFindObject(hi_variants_login_data.yesterdays_top_infector_tsid) : null;
		rsp.hi_emote_data = {
			hi_emote_variants: config.hi_emote_variants,
			hi_emote_variants_color_map: config.hi_emote_variants_color_map,
			hi_emote_variants_name_map: config.hi_emote_variants_name_map,
			hi_emote_leaderboard: hi_variants_login_data.leaderboard,
			yesterdays_variant_winner: hi_variants_login_data.yesterdays_winner,
			yesterdays_variant_winner_count: hi_variants_login_data.yesterdays_winner_count,
			yesterdays_top_infector_tsid: hi_variants_login_data.yesterdays_top_infector_tsid,
			yesterdays_top_infector_count: hi_variants_login_data.yesterdays_top_infector_count,
			yesterdays_top_infector_variant: hi_variants_login_data.yesterdays_top_infector_variant,
			yesterdays_top_infector_pc: (infector_pc && infector_pc.is_player) ? infector_pc.make_hash() : null,
		};
		
		
		/* we used to send only a subset, but it is not too much data to just send it all, and we can use it in client
		var client_overlay_keys = ['tower_sign_scaffolding_overlay', 'fox_brush', 'proto_puff', 'smoke_puff', 'world_map', 'neuron_burst', 'rook_attack_test', 'rook_attack_fx_test', 'rook_fly_side', 'rook_fly_up', 'rook_fly_up_flv', 'rook_flock', 'rook_fly_forward', 'rook_familiar', 'sonic_boom', 'rook_fly_up_fractal_flv'];
		for (var i=0;i<client_overlay_keys.length;i++) {
			var o = client_overlay_keys[i];
			rsp.overlay_urls[o] = overlay_key_to_url(o);
		}
		*/

		var path_data = pc.getPathRsp();
		if (path_data){
			rsp.path_info = path_data;
		}
		
		rsp.camera_abilities = pc.getCameraAbilities();
	}

//log.info('***LOGIN-START-'+pc.tsid+'-2');

	rsp.location = pc.location.prep_geometry(pc);
	// Rewrite the world map url
	if (rsp.overlay_urls && rsp.location.mapData  && rsp.location.mapData.world_map) rsp.overlay_urls['world_map'] = rsp.location.mapData.world_map;

//log.info('***LOGIN-START-'+pc.tsid+'-3');


	//
	// send item definitions for all items
	//
	// this is a horrible hack and is temporary!
	// a special 'item' called 'catalog' contains an array of class_tsids
	//

	var catalog = apiFindItemPrototype('catalog');
	var tsids = catalog.class_tsids;

	// do not send these in rsp
	var skip_props = config.itemDef_skip_props;
	
	// send these props only if their value is not the default value specified
	var default_values = config.itemDef_default_values;
	
	// send this to client so it can apply the default values
	rsp.default_item_values = default_values;
	
	rsp.items = {};
	for (var n in tsids){
		var tsid = tsids[n];
		try {
			var itemProto = apiFindItemPrototype(tsid);
			rsp.items[tsid] = utils.copy_hash(itemProto.itemDef);

			rsp.items[tsid].has_infopage = itemProto.has_infopage;
			if (itemProto.proxy_item) rsp.items[tsid].proxy_item = itemProto.proxy_item;

			for (var i in default_values){
				if (rsp.items[tsid][i] == default_values[i]) {
					delete rsp.items[tsid][i];
				}
			}
			
			for (var i in skip_props){
				delete rsp.items[tsid][i];
			}

			if (itemProto.getSubClasses) rsp.items[tsid].subclasses = itemProto.getSubClasses();
			if (itemProto.is_routable) rsp.items[tsid].is_routable = true;

		} catch (e){
			//rsp.items[tsid] = {};
			log.error("can't find prototype for "+tsid+" from catalog during login_start");
		}
	}

	// Invoking sets catalog
	catalog = apiFindItemPrototype('catalog_invoking_sets');
	rsp.invoking = {
		sets: catalog.sets,
		blockers: {
			items: {
				'furniture_chassis': {
					width: 740
				},
				'home_sign': {
					width: 116
				},
				'magic_rock': {
					width: 116
				},
				'patch_seedling': {
					width: 286
				},
				'wood_tree': {
					width: 286
				},
				'trant_bean': {
					width: 286
				},
				'trant_spice': {
					width: 286
				},
				'trant_bubble': {
					width: 286
				},
				'trant_egg': {
					width: 286
				},
				'trant_fruit': {
					width: 286
				},
				'trant_gas': {
					width: 286
				},
				'trant_bean_dead': {
					width: 286
				},
				'trant_spice_dead': {
					width: 286
				},
				'trant_bubble_dead': {
					width: 286
				},
				'trant_egg_dead': {
					width: 286
				},
				'trant_fruit_dead': {
					width: 286
				},
				'trant_gas_dead': {
					width: 286
				}
			},
			signpost: {
				width: 260
			}
		}
	};

	// Deco sets catalog
	catalog = apiFindItemPrototype('catalog_userdeco_sets');
	rsp.userdeco = {
		sets: catalog.sets
	};


	// Recipe catalog
	catalog = apiFindItemPrototype('catalog_recipes');
		
	rsp.recipes = {};
	for (var rid in catalog.recipes){
		if (catalog.recipes[rid].learnt == 3) continue;

		var r = get_recipe(rid); // get_recipe sets some other stuff up for us, so let's call it
		
		// Copy the recipe so we don't modify the catalog
		r = utils.copy_hash(r);
		r.id = rid; // We need recipe id too
		
		// Discoverable?
		if (r.learnt == 0) r.discoverable = 1;
		
		// Get the tool that makes this recipe
		var tool = apiFindItemPrototype(r.tool);

		// Change task_limit based on potential upgrades
		var task_limit_multiplier = pc.get_task_limit_multiplier(tool);
		if (task_limit_multiplier != 1.0){
			r.task_limit = Math.round(r.task_limit * task_limit_multiplier);
		}
		
		// Do we know this recipe?
		if (!pc.recipes.recipes[rid]){
			// We implicitly know all transmogrification recipes
			if (!tool || tool.getClassProp('making_type') != 'transmogrification'){
				r.learnt = 0;
			}
			else if (rid == 288 && isPiDay()) {
				// we implicitly know the pi recipe
				r.learnt = 0;
			}
		}
		else if (r.discoverable){
			r.learnt = 1;
		}


		// Explain if we can make this thing, and why we can't if we can't
		if (r.learnt){
			r.disabled = false;
			if (r.skills){
				for (var s in r.skills){
					if (!pc.skills_has(r.skills[s])){
						r.disabled = true;
						r.disabled_reason = "You need to learn the "+pc.skills_linkify(r.skills[s])+" skill.";
						break;
					}
				}
			}

			if (r.achievements){
				for (var a in r.achievements){
					if (!pc.achievements_has(r.achievements[a])){
						r.disabled = true;
						r.disabled_reason = "You need to get the "+pc.achievements_linkify(r.achievements[a])+" achievement.";
						break;
					}
				}
			}
		}

		rsp.recipes[rid] = r;
	}


//log.info('***LOGIN-START-'+pc.tsid+'-4');

	//
	// the player's buddylists
	//

	rsp.buddies = pc.buddies_get_login();
	rsp.ignoring = pc.buddies_get_ignoring_login();

//log.info('***LOGIN-START-'+pc.tsid+'-5');

	
	//
	// in a party?
	//

	var m = pc.party_members();
	if (m){
		rsp.party = {
			members: m,
		};
	}

//log.info('***LOGIN-START-'+pc.tsid+'-6');


	//
	// Loading info
	//
	
	rsp.loading_info = pc.location.getLoadingInfo(pc);


	//
	// Skill urls
	//

	rsp.skill_urls = pc.skills_get_urls();

//log.info('***LOGIN-START-'+pc.tsid+'-7');
	
	//
	// send it
	//

	pc.apiSendMsgAsIs(rsp);

	//
	// Perf testing
	//

	if (msg.perf_testing && msg.perf_testing == true){
		if (!pc.after_perf_test_location){
			pc.after_perf_test_location = {
				tsid: pc.location.tsid,
				x: pc.x,
				y: pc.y
			};
		}

		delete pc.halt_perf_test;
	}
	else if (pc.after_perf_test_location){
		pc.halt_perf_test = true;
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////

function doLoginEnd(pc, msg, isRelogin){

	pc.didEndStreetMove();

	var rsp = make_rsp(msg);
	rsp.success = true;

	apiLogAction('LOGIN_END', 'pc='+pc.tsid);

	//
	// location info
	//

	rsp.location = {};

	rsp.location.tsid = pc.location.tsid;
	rsp.location.pcs = {};
	rsp.location.itemstacks = {};


	//
	// active players in location
	//

	for (var i in pc.location.activePlayers){

		var p = pc.location.activePlayers[i];

		if (p.tsid != pc.tsid || isRelogin){// we want to send all pcs data on relogin_end
			rsp.location.pcs[p.tsid] = p.make_hash_with_location();
		}
	}


	//
	// itemstacks in location
	//
	
	for (var i in pc.location.items){
		var item = pc.location.items[i];
		if (item && item.isVisibleTo(pc)) {
			rsp.location.itemstacks[item.tsid] = make_item(item, pc);
		}
	}

 	if (isRelogin){
		rsp.relogin_type = msg.relogin_type;
	}
	
	
	//
	// teleportation
	//
	
	rsp.teleportation = pc.teleportation_get_status();
	rsp.previous_location = pc.houses_get_previous_location_client();
	rsp.is_dead = pc.is_dead;
	delete pc['!teleporting'];

	//
	// send it
	//

	pc.apiSendMsgAsIs(rsp);


	//
	// Are we allowed to login?
	//

	if (pc.isInTimeout()){
		rsp = {
			type:"booted",
			msg: "Your account has been suspended.",
			url: "/"
		};

		return pc.apiSendMsg(rsp);
	}


	//
	// send message to other people in location
	//

	var notification = {
		type: "pc_login",
		pc: pc.make_hash_with_location()
	};

	if (msg.type === 'relogin_end') {
		notification.type = "pc_relogin";
		notification.relogin_type = msg.relogin_type;
	}
	pc.apiSendLocMsgX(notification);
	
	if (msg.type == 'login_end'){
		pc.announce_sound('CLIENT_LOADED');

		pc.onLoggedin();
	}
	else{
		//pc.announce_sound('STREET_LOADED');
		if (pc.tp_queue){
			var item = pc.tp_queue.shift();
			if (item) pc.teleportToLocationDelayed(item.tsid, item.x, item.y, item.args);
		}
	}


	if (pc.halt_perf_test && pc.after_perf_test_location){
		pc.teleportToLocationDelayed(pc.after_perf_test_location.tsid, pc.after_perf_test_location.x, pc.after_perf_test_location.y);
		delete pc.after_perf_test_location;
		delete pc.halt_perf_test;
	}
}


//
// called by the client when a user selects a signpost link
//

function doStartSignpostMove(pc, msg) {

	apiLogAction('SIGNPOST_MOVE', 'pc='+pc.tsid, 'signpost_id='+msg.from_signpost_tsid, 'signpost_connection='+msg.destination_index);
	
	//
	// get the connection that we've chosen
	//

	var signpost = pc.location.geometry.layers.middleground.signposts[msg.from_signpost_tsid];
	var connect = {};

	if (signpost.quarter){

		//
		// quarter signposts don't have connections stored in the geometry, so resolve here...
		//

		var quarter = apiFindObject(signpost.quarter);
		if (!quarter){
			return pc.apiSendMsg(make_fail_rsp(msg, 1, "Invalid quarter on signpost"));
		}

		if (msg.destination_index == 'exit'){

			connect = quarter.getExitConnectionData();
		}else{

			var keys = msg.destination_index.split('_');
			var key = "("+keys[0]+","+keys[1]+")";

			connect = quarter.getConnectionData(key);
		}
	}
	else if (signpost.instance_exit){
		pc.apiSetTimer('quests_set_flag', 1000, 'instance_exit_via_signpost');
		var prev = pc.instances_get_exit(pc.location.instance_id);
		
		var loc = apiFindObject(prev.tsid);
		var loc_info = loc.geo_get_info();
		connect = {
			target: loc,
			mote_id: loc_info.mote_id,
			hub_id: loc_info.hub_id,
			x: prev.x,
			y: prev.y
		};
	}
	else{

		connect = signpost.connects[msg.destination_index];
	}


	//
	// Is the signpost hidden and we are not an admin?
	//

	if (connect && connect.hidden && !pc.is_god){

		var rsp = make_fail_rsp(msg, 1, "This signpost is disabled!");
		pc.apiSendMsg(rsp);
		return;
	}

	if (!connect){
		var rsp = make_fail_rsp(msg, 1, "This signpost is not working!");
		pc.apiSendMsg(rsp);
		return;
	}
	
	//
	// make it happen
	//

	doStartMove(pc, msg, connect, 'geo:signpost:'+msg.from_signpost_tsid);
}


//
// called by the client when a user selects a door
//

function doStartDoorMove(pc, msg) {

	apiLogAction('DOOR_MOVE', 'pc='+pc.tsid, 'door_id='+msg.from_door_tsid);
	
	//
	// get the connection that we've chosen
	//

	var door = pc.location.geometry.layers.middleground.doors[msg.from_door_tsid];
	var connect = {};


	//
	// is the the exit door for a quarter?
	//

	if (door.quarter){

		var quarter = apiFindObject(door.quarter);
		if (!quarter){
			return pc.apiSendMsg(make_fail_rsp(msg, 1, "Invalid quarter on signpost"));
		}

		connect = quarter.getDoorConnectionData(pc.location.tsid);
	}else if (door.destinations && num_keys(door.destinations)){
		var destinations = []; // This is dumb, but something in the stack keeps converting destinations to a hash from an array, so we convert back here
		for (var i in door.destinations){
			destinations.push(door.destinations[i]);
		}
		var target;
		var attempts = 0;
		do {
			target = apiFindObject(choose_one(destinations));
			attempts++;
		} while ((!target || target.tsid == pc.last_random_destination) && attempts < 10);

		if (target){
		
			pc.last_random_destination = target.tsid;
			var target_info = target.get_info();
			var marker = target.geo_get_teleport_point();

			connect = {
				target: target,
				mote_id: target_info.mote_id,
				hub_id: target_info.hub_id,
				x: intval(marker.x),
				y: intval(marker.y),
				swf_file_versioned: target_info.swf_file_versioned,
				img_file_versioned: target_info.img_file_versioned
			};
		}
	}
	else if (door.instance_exit){
		pc.apiSetTimer('quests_set_flag', 1000, 'instance_exit_via_door');
		var prev = pc.instances_get_exit(pc.location.instance_id);
		
		var loc = apiFindObject(prev.tsid);
		var loc_info = loc.geo_get_info();
		connect = {
			target: loc,
			mote_id: loc_info.mote_id,
			hub_id: loc_info.hub_id,
			x: prev.x,
			y: prev.y
		};
	}else{
		connect = door.connect;
	}


	//
	// exiting transit?
	//

	if (pc.location.is_transit){
		if (pc.location.is_departed){
			pc.familiar_send_targeted({
				'callback'	: 'transit_familiar_doors_closed',
				'target_tsid'	: 'geo:door:'+msg.from_door_tsid
			});
			
			var rsp = make_fail_rsp(msg, 1, 'transit_moving');
			return pc.apiSendMsg(rsp);
		}
		
		var cfg = config.transit_instances[pc.location.instance_id];
		var current_station = apiFindObject(cfg.stations[pc.location.current_stop].tsid);
		
		connect = {
			target: current_station,
			mote_id: current_station.moteid,
			hub_id: current_station.hubid,
			x: cfg.stations[pc.location.current_stop].x,
			y: cfg.stations[pc.location.current_stop].y
		};
	}


	if (!connect){
		var rsp = make_fail_rsp(msg, 1, "This door is not working!");
		pc.apiSendMsg(rsp);
		return;
	}


	//
	// Can we go through this door?
	//
	
	var enter = pc.location.locked_doors_canEnter(pc, door, msg.from_door_tsid);

	if (!enter.ok){

		var rsp = make_fail_rsp(msg, enter.code, enter.msg);
		pc.apiSendMsg(rsp);
		return;
	}
	
	pc.location.locked_doors_onEnter(pc, door);
	
	
	//
	// make it happen
	//

	doStartMove(pc, msg, connect, 'geo:door:'+msg.from_door_tsid);
}

//
// called by doDoorSignpostMove & doStartSignpostMove after they get connect & target
//

function doStartMove(pc, msg, connect, link_id){

	// moving within the same location?
	
	if (connect.target.tsid == pc.location.tsid){
		//{
		//   "msg_id":"29",
		//   "success":true,
		//   "type":"door_move_start",
		//   "in_location": true,
		//   "pc": {...} // standard pc hash built from make_hash_with_location
		//}
		
		pc.apiSetXY(connect.x, connect.y);

		var rsp = make_ok_rsp(msg);
		rsp.in_location = true;
		rsp.pc = pc.make_hash_with_location();
		pc.apiSendMsg(rsp);
		
		return;
	}
	

	//
	// check we can make this move (ownership, acls, etc)
	//

	var enter = connect.target.pols_canEnter(pc, link_id);

	var rsp;
	if (!enter.ok){

		rsp = make_fail_rsp(msg, enter.code, enter.msg);
		pc.apiSendMsg(rsp);
		return;
	}

	if (!connect.target.pols_is_owner(pc) && pc.countFollowers()){
		var followers_have_clearance = 1;

		for (var i in pc.followers){
			var follower = apiFindObject(i);

			var fret = connect.target.pols_canEnter(follower);

			if (!fret.ok){
				followers_have_clearance = 0;
			}

		}

		if (!followers_have_clearance){
			pc.sendActivity("One or more of your followers is not allowed to teleport there.");
			rsp = make_fail_rsp(msg, 1, "One or more of your followers is not allowed to teleport there.");
			pc.apiSendMsg(rsp);
			return;
		}
	}
	
	pc.didStartStreetMove();


	//
	// Remove followers?
	//

	if (connect.target.pols_is_pol() && !connect.target.pols_is_owner(pc) && !connect.target.getProp('is_public')){
		pc.removeFollowers();
	}
	

	//
	// Create an instance?
	//
	
	var target;
	if (connect.target.instances_instance_me()){
		var instance_id = connect.target.instances_instance_me();
		var max_members = connect.target.instances_get_max_members();
		
		var instance_anchor;
		if (pc.location.instance_of){
			instance_anchor = apiFindObject(pc.location.instance_of);
		}
		else{
			instance_anchor = pc.location;
		}
		
		var instance = instance_anchor.instances_next_instance(instance_id, max_members);
		if (!instance){
			
			var instance_options = connect.target.instances_get_instance_options();

			var location_options = {};

			instance = pc.instances_create(instance_id, connect.target.tsid, instance_options, location_options);

			instance_anchor.instances_add_instance(instance_id, instance);
		}
		else if (!pc.instances_has(instance_id)){
			pc.instances_add(instance_id, instance);
		}
		
		// remove followers */
		pc.removeFollowers();

		//pc.instances_enter(instance_id, connect.x, connect.y);
		pc.instances.previously[instance_id] = pc.get_simple_location();
		target = apiFindObject(instance.get_entrance());
	}
	else{
		target = connect.target;
	}


	// check if this is interGS move
	var d = pc.apiCheckIfNeedToMoveToAnotherGSAndGetMoveData(target.tsid, connect.x, connect.y);
	if (d){
		rsp = make_ok_rsp(msg);
		rsp.token=d.token;
		rsp.hostport=d.hostAndPort;
		rsp.destination = target.get_client_info();
		rsp.loading_info = target.getLoadingInfo(pc);
		
		if (connect.loading_music) rsp.loading_music = config.music_map[connect.loading_music];
		
		log.info("doStartMove rsp=",rsp);
		pc.apiSendMsg(rsp);
		pc.location.apiMoveOutX(pc, target, connect.x, connect.y);
		return;
	}

	pc["!local_move_data"] = {
		old_loc: pc.location
	};

	//
	// call the player's java code to make all of the start move arrangements
	// this call will remove player from its current location, execute various onExit callbacks
	// set pc location, x and y to new values, and place the pc into the list of non-active player of the target location
	// if pc logout after this step, then after next loging he will be placed into the target location
	pc.apiStartLocationMoveX(target, connect.x, connect.y);

	//
	// respond to player with target location geometry
	//

	rsp = make_ok_rsp(msg);
	rsp.location = target.prep_geometry(pc);
	rsp.loading_info = target.getLoadingInfo(pc);
	if (connect.loading_music) rsp.loading_music = config.music_map[connect.loading_music];
	
	pc.apiSendMsg(rsp);


}


//
// called by the client when it's ready to enter the new location
//

function doEndSignpostMove(pc, msg) {

	doEndMove(pc, msg, "pc_signpost_move");
	
}


//
// called by the client when it's ready to enter the new building
//

function doEndDoorMove(pc, msg) {

	doEndMove(pc, msg, "pc_door_move");
	
}


//
// called by the doEndDoorMove & doEndSignpostMove with the correct name for the evt to be distributed
//

function doEndMove(pc, msg, broadcast_evt_name) {

	pc.didEndStreetMove();

	var move_data = pc["!local_move_data"];
	if (!move_data) return;
	
	delete pc["!local_move_data"];

	var old_loc = move_data.old_loc;
	var new_loc = pc.location;

	//
	// Call the player's java code to make end of the move arrangements
	//
	pc.apiEndLocationMoveX(old_loc);

	//
	// move is complete - tell the caller about the new location's contents
	//

	var rsp = make_ok_rsp(msg);
	rsp.location = make_location(new_loc, pc);
	rsp.teleportation = pc.teleportation_get_status();
	rsp.previous_location = pc.houses_get_previous_location_client();
	rsp.is_dead = pc.is_dead;
	delete pc['!teleporting'];
	pc.apiSendMsg(rsp);
	
	//pc.announce_sound('STREET_LOADED');


	//
	// tell people in the old and new streets about
	// the move
	//

	var ev = {
		type: broadcast_evt_name,
		pc: pc.make_hash_with_location(),
	};
	
	if (broadcast_evt_name == 'pc_follow_move'){
		pc.streets_followed++;
		
		if (pc.streets_followed >= 3){
			pc.achievements_grant('stalker_noncreepy_designation');
		}
	}

	old_loc.apiSendMsgX(ev, pc);
	pc.apiSendLocMsgX(ev);

	if (pc.tp_queue){
		var item = pc.tp_queue.shift();
		if (item) pc.teleportToLocationDelayed(item.tsid, item.x, item.y, item.args);
	}
}


function doStartFollow(pc, msg){
	apiLogAction('FOLLOW_START', 'pc='+pc.tsid, 'target='+msg.pc_tsid);
	var followee = getPlayer(msg.pc_tsid);
	var next_followee = null;

	var i = 0;
	do {
		next_followee = followee.getFollowee();
		if (next_followee) followee = getPlayer(next_followee);

		i++;
		if (i >= 100) break;
	} while (next_followee);

	if (followee.tsid == pc.tsid){
		pc.sendActivity("You can't follow yourself!");
		var rsp = make_ok_rsp(msg);
		return pc.apiSendMsg(rsp);
	}
	
	if (!followee.prompts_over_limit()){
		followee.prompts_add({
			callback		: 'respondToFollow',
			follower_tsid	: pc.tsid,
			txt				: utils.escape(pc.label)+" would like to follow you.",
			timeout			: 30,
			timeout_value	: 'decline',
			choices		: [
				{ label : 'OK', value: 'accept' },
				{ label : 'No thanks', value: 'decline' }
			]
		});

		pc['!follow_prompt'] = pc.prompts_add({
			txt				: "Waiting for "+utils.escape(followee.label)+" to confirm...",
			timeout			: 30,
			choices			: [
				{ label : 'OK', value: 'ok' }
			]
		});
	}
	else{
		pc.prompts_add({
			txt				: ""+utils.escape(followee.label)+" is too busy to be followed...",
			timeout			: 30,
			choices			: [
				{ label : 'OK', value: 'ok' }
			]
		});
	}
	
	var rsp = make_ok_rsp(msg);
	pc.apiSendMsg(rsp);
}

function doStopFollow(pc, msg){
	apiLogAction('FOLLOW_STOP', 'pc='+pc.tsid);
	

	pc.stopFollowing();
	delete pc.streets_followed;
	var rsp = make_rsp(msg);
	rsp.success = true;
	pc.apiSendMsg(rsp);
}


function doVecMove(pc, msg){
	var locMsg = {
		type: "pc_move_vec",
		pc: {
			tsid: pc.tsid
		}
	};
		
	if (msg.type) {
		delete msg.type;
	}
	
	for (var k in msg) {
		locMsg.pc[k] = msg[k];		
	}

	pc.location.apiSendMsg(locMsg, pc);
	//pc.location.apiSendMsgX(locMsg, pc);
}

//
// move to a new position
//

function doXYMove(pc, msg){
	var old_x = pc.x;
	var old_y = pc.y;
	var new_x = msg.x;
	var new_y = msg.y;
	var units;

	pc.s = msg.s;


	pc.apiSetXY(msg.x, msg.y);

	if (new_x != old_x || new_y != old_y){

		if (!pc['!moved_lat']) pc['!moved_lat'] = 0;
		var moved_lat = pc['!moved_lat'];

		pc['!actually_moved'] = true;
		pc.apiSetXY(new_x, new_y);


		moved_lat += Math.abs(new_x - old_x);

		if (msg.is_jump){
			if (pc.metabolics_get_energy() == 1){
				pc.metabolics_lose_energy(1);
			}

			if (pc.jump_count === undefined) pc.jump_count = 0;
			pc.jump_count++;

			if (pc.jump_count < 111112){
				if (pc.jump_count == 1111){
					pc.achievements_grant('bounder_untenured');
				}
				else if (pc.jump_count == 11111){
					pc.achievements_grant('leapist');
				}
				else if (pc.jump_count == 111111){
					pc.achievements_grant('bounder_tenured');
				}
			}
		}

		if (moved_lat > 800){
			units = Math.floor(moved_lat / 800);
			moved_lat -= 800 * units;
		}

		pc['!moved_lat'] = moved_lat;
	}
	else{
		pc['!actually_moved'] = false;
	}

	var locMsg = {
		type: "pc_move_xy",
		pc: {
			tsid	: pc.tsid,
			x		: pc.x,
			y		: pc.y,
			s		: pc.s
		}
		//we don't need all that crap from pc.make_hash_with_location() here
	};

	pc.location.apiSendMsgX(locMsg, pc);

}

function isAnimationStateJump(state) {
	if ((state == 3) || (state == 4) || (state == 5) || (state == 9))	// facing right
		return true;
	if ((state == -3) || (state == -4) || (state == -5) || (state == -9))	// facing left
		return true;
	
	return false;
}
//

function doAFK(pc, msg){
	pc.apiSendMsg(make_ok_rsp(msg));
	
	pc.is_afk = msg.afk ? true : false;

	// Tell reverse contacts
	apiSendToGroup({type: 'is_afk', afk: pc.is_afk, pc: pc.tsid}, pc.friends.reverse.pcs);
}

function doLocalChatStart(pc, msg){
	pc.apiSendMsg(make_ok_rsp(msg));
	if (pc.isInTimeout() || pc.isInConeOfSilence()) return;

	var anncx = {
		type: 'pc_overlay',
		uid: 'typing_'+pc.tsid,
		duration: 5000,
		pc_tsid: pc.tsid,
		delta_x: 0,
		delta_y: -130,
		bubble: false,
		width: 40,
		height: 40,
		swf_url: overlay_key_to_url('typing_in_location_overlay')
	};

	pc.location.apiSendAnnouncementX(anncx, pc);
}

function doLocalChat(pc, msg){
	pc.apiSendMsg(make_ok_rsp(msg));

	apiLogAction('CHAT_LOCAL', 'pc='+pc.tsid, 'loc='+pc.location.tsid, 'msg='+msg.txt);

	var txt = utils.trim(msg.txt);

	if (txt.substr(0,1) == '/'){
		return doChatCommand(pc, msg, txt);
	}
	
	if (pc.isInTimeout() || pc.isInConeOfSilence()){
		return pc.sendActivity("Sorry, you're currently suspended from this chat.");
	}
	
	// The comedian buff makes all players laugh when you say shit (activated via removal).
	if(pc.buffs_has('comedian')) {
		pc.buffs_remove('comedian');
	}

	
	if (txt.substr(0,3) == 'KFC'){
		pc.location.scareChickens(pc);
	}

	if (config.is_dev) {
		if (txt.substr(0,2) === "B " || txt.substr(0,2) === "b ") {
			pc.location.commandButler(pc, txt.substr(2));
		}
	}
	
	if (pc.location.pols_is_pol()){
		pc.location.butlerProcessText(pc, txt);
	}

        else if (!pc.location.isInstance()){
                if (/This game is absolutely preposterous/i.exec(txt)){
                        pc.location.doIncantationsFeat(1, pc);
                }
                else if (/I agree wholeheartedly/i.exec(txt)){
                        pc.location.doIncantationsFeat(2, pc);
                }
                else if (/And yet, I will really miss it/i.exec(txt)){
                        pc.location.doIncantationsFeat(3, pc);
                }
                else{
                        pc.location.clearIncantationsFeat(pc);
                }
        }
	
	if (pc.buffs_has('purpled_out')) {
		var words = utils.filter_chat(txt).split(' ');
		txt = "";
		
		for (var i in words) {
			var letters = words[i].split('');
			letters.sort(function() {return 0.5 - Math.random();});
			txt += letters.join('') + " ";
		}
	}
	
	pc.location.overlay_dismiss('typing_'+pc.tsid);
	pc.location.apiSendMsg({
		type: 'pc_local_chat',
		pc: pc.make_hash(),
		txt: utils.filter_chat(txt)
	});


	var pcs = pc.location.getActivePlayers();
	for (var i in pcs){
		var target = pcs[i];
		if (target.charades_word && txt.toLowerCase().indexOf(target.charades_word) != -1) {
			if (target.tsid == pc.tsid){
				pc.sendLocationActivity(utils.escape(pc.label)+' ruined their own game of charades by saying the answer.', pc);
				pc.sendActivity("You ruined it!");
				pc.announce_sound('FAILED_AT_CHARADES');

				pc.buffs_charades_ruin();
			}
			else{
				var rsp = utils.escape(pc.label)+' guessed correctly! +50 iMG, +250 currants';
				pc.sendLocationActivity(rsp, pc);
				pc.sendActivity(rsp, pc);
				pc.stats_add_xp(50);
				pc.stats_add_currants(250);
				pc.show_rainbow('rainbow_youdidit');

				pc.location.apiSendMsg({
					type:	'play_emotion',
					emotion: 'happy'
				});

				target.buffs_charades_guess_correct_word();
				target.announce_sound('RAINBOW_YOUDIDIT');
			}
		}
	}

	if (pc.location.onLocalChat) pc.location.onLocalChat(pc, msg);

	if (txt.toLowerCase().substr(0,10) == 'i love you'){
		var giant_name = txt.toLowerCase().substr(11).replace(/[^a-z]/g, "");
		if (giant_name == 'tii') giant_name = 'ti';
		
		if (in_array_real(giant_name, config.giants)){
			function is_shrine(it){ return it.is_shrine; }
			var shrine = pc.findCloseStack(is_shrine, 200);
			if (shrine && shrine.get_giant() == giant_name){
				var info = config.giants_info[giant_name];
				if (giant_name == 'ti') giant_name = 'tii';

				var rsp = {
					type:'giant_screen',
					tsid: giant_name,
					giant_of: info.giant_of,
					personality: info.personality,
					desc: info.desc,
					followers: info.followers,
					flv_url: overlay_key_to_url('giant_'+giant_name+'_flv_overlay'),
					tip_title: 'A Message:',
					tip_body: "I love you too, "+pc.getLabel(),
					sound: 'GONG_GIANTS',
					start_with_tip: true
				};

				pc.apiSendMsg(rsp);
			}
		}
	}
}

function doPartyChat(pc, msg){

	var txt = utils.trim(msg.txt);

	if (txt.substr(0,1) == '/'){
		pc.apiSendMsg(make_fail_rsp(msg, 1, 'Slash commands are for global/local chat only'));
		return;
	}

	pc.apiSendMsg(make_ok_rsp(msg));
	pc.party_chat(msg.txt);
}

function doChatCommand(pc, msg, txt){

	var words = txt.split(" ");

	//
	// check commands allowed by regular players first...
	//

	if (words[0]=="/makegod"){
//		pc.is_god = 1;
//		pc.sendActivity('you are now an admin');

		// People shouldn't just be able to make themselves god!
		pc.sendActivity("Don't go getting delusions of grandeur on us now. We need you to keep a level head!");
		
		return;
	}
	else if (!msg.channel && words[0] == '/who'){
		pc.sendActivity(pc.location.get_roster_msg());

		return;
	}

	if (words[0] == "/xyzzy"){
		if (pc.is_god){
			pc.events_add({ callback: 'instances_create_delayed', tsid: 'LIF9NRCLF273JBA', instance_id: 'rainbow_run', x: 816, y: -190, exit_delay: 0}, 0.1);
			return;
		}
		return pc.sendActivity("Nothing happens");
	}
	
	if (words[0] == '/home' || words[0] == '/house') {
		if (!pc.has_done_intro && !pc.newxp_allow_home){
			// Cannot /house in newxp
			return;
		}

		if (words[0] == '/house') {
			pc.has_used_house_command = true;
		}
		var ret = pc.houses_go_to_new_house(false, false, (words[0] == '/house'));
		if (!ret.ok) pc.sendActivity(ret.error);
		return;
	} else if (words[0] == '/tower'){
		if (!pc.has_done_intro && !pc.newxp_allow_home){
			// Cannot /house in newxp
			return;
		}
		
		pc.has_used_tower_command = true;
		var ret = pc.houses_go_to_tower();
		if (!ret.ok) pc.sendActivity(ret.error);
		return;

	} else if (words[0] == '/leave'){
		if (!pc.has_done_intro && !pc.newxp_allow_home){
			// Cannot /house in newxp
			return;
		}
		
		pc.houses_leave();
		return;

	}
	else if (words[0] == '/butler') {
		if (pc.butler_tsid){
			var butler = apiFindObject(pc.butler_tsid);
			butler.sendIM(pc, butler.getTextString("normalClickResponseList", pc) + butler.getTextString("clickHelpAddition", pc, pc));
		}
		return;
	}
	else if (words[0] == '/beans') {
		pc.createItemFromFamiliar('plate_of_beans', 1);
		return;
	}

	if (config.is_dev){
		if (words[0] == '/gentle_island_exit'){
			pc.teleportToLocation('LRO1GHVHBMA3IFI', -2780, -280);
			return;
		}
	}

	//
	// now check we're god or help
	//

	if (!pc.is_god && !pc.is_help && !pc.isGuideOnDuty()){
		
		pc.sendActivity("Unknown command: "+utils.filter_chat(txt));

		return;
	}


	//
	// Commands that work on both roles
	//

	if (words[0] == '/max'){
		
		pc.metabolics_add_energy(999999);
		pc.metabolics_add_mood(999999);
		return;
		
	}else if (words[0] == '/half'){

		pc.metabolics_set_energy(pc.metabolics.energy.top * 0.5);
		pc.metabolics_set_mood(pc.metabolics.mood.top * 0.5);
		return;

	}else if (words[0] == '/buffless'){
		pc.buffs_remove_all();
		return;

	}else if (words[0]=="/link"){
		var url = config.web_root+"/jump.php?t="+pc.location.tsid+"&x="+pc.x+"&y="+pc.y;
		pc.sendActivity(url);
		return;
	}


	//
	// now check we're god
	//

	if (!pc.is_god){
		
		pc.sendActivity("Unknown command: "+utils.filter_chat(txt));

		return;
	}


	//
	// god-only commands below this point
	//

	if (words[0]=="/newxp_skill_chooser"){
	
		if (words.length > 1 && words[1]=='cancel') {
			pc.apiSendMsgAsIs({
				type: 'overlay_cancel',
				uid: 'test_skill_chooser_1'
			});
			pc.apiSendMsgAsIs({
				type: 'overlay_cancel',
				uid: 'test_skill_chooser_2'
			});
			pc.apiSendMsgAsIs({
				type: 'overlay_cancel',
				uid: 'test_skill_chooser_3'
			});
		} else {
			pc.apiSendAnnouncement({
				type: 'vp_overlay',
				uid: 'test_skill_chooser_1',
				item_class:'apple',
				x: '25%',
				top_y: '30%',
				size:100,
				mouse: {
					is_clickable: true,
					allow_multiple_clicks: false,
					click_payload: {skill_choice:'test_skill_chooser_1'},
					dismiss_on_click: false
				}
			});
			pc.apiSendAnnouncement({
				type: 'vp_overlay',
				uid: 'test_skill_chooser_2',
				item_class:'apple',
				x: '50%',
				top_y: '20%',
				size:100,
				mouse: {
					is_clickable: true,
					allow_multiple_clicks: false,
					click_payload: {skill_choice:'test_skill_chooser_2'},
					dismiss_on_click: false
				}
			});
			pc.apiSendAnnouncement({
				type: 'vp_overlay',
				uid: 'test_skill_chooser_3',
				item_class:'apple',
				x: '75%',
				top_y: '30%',
				size:100,
				mouse: {
					is_clickable: true,
					allow_multiple_clicks: false,
					click_payload: {skill_choice:'test_skill_chooser_3'},
					dismiss_on_click: false
				}
			});
		}
	
	} else if (words[0]=="/create" && words[1]=="item"){

		var location = 'street';
		var num;
		if (words[3] == 'in'){
			location = words[4];
		}
		else{
			num = intval(words[3]);
			location = words[5];
		}
		
		if (!num) num = 1;

		try {
			var proto = apiFindItemPrototype(words[2]);
		} catch (e){
			pc.sendActivity("Unknown item class: "+words[2]);
			return;
		}


		if (location == 'pack'){
			pc.createItemFromGround(words[2], num);
		}
		else{
			var t = apiNewItemStack(words[2], num);
			pc.location.apiPutItemIntoPosition(t, pc.x, pc.y);
			pc.location.geo_add_plats_from_item(t);

			log.info(pc+' created item '+t+' in '+pc.location);
		}

		pc.apiSendLocMsg({ type: 'location_event' });

	}else if (words[0]=="/kill" && words[1]=="stack"){
	
		var silently = (words.length > 3 && words[3] == 'silently');

		var s = apiFindObject(words[2]);

		if (!s){
			if (!silently) pc.sendActivity("can't find stack "+words[2]);
			return;
		}

		if (s.hasTag('furniture')) pc.location.geo_remove_plats_by_source(s.tsid);
		if (s.class_tsid == 'furniture_door'){
			var job_id = 'proto-'+s.tsid;
			var job = pc.location.jobs_get(job_id);
			if (job){
				pc.location.jobs_reset(job_id, true);
				delete pc.location.jobs[job_id];
			}
		}

		s.apiDelete();
		pc.apiSendLocMsg({ type: 'location_event' });

		if (!silently) pc.sendActivity("stack "+words[2]+" destroyed");

	}else if (words[0]=="/script" && words.length > 1){
	
		var overlay_script_name = words[1];
	
		if (pc.run_overlay_script(overlay_script_name)) {
			pc.sendActivity('running: '+overlay_script_name);
		} else {
			pc.sendActivity("could not run: "+overlay_script_name);
		}

	}else if (words[0]=="/force_dump"){

		if (words[1]){
			var target = getPlayer(words[1]);
			if (target && apiIsPlayerOnline(target)){
				target.apiSendMsg({ type: 'dump_data' });
				pc.sendActivity(target.linkifyLabel()+' just dumped data to client errors page');
			}
			else{
				pc.sendActivity('that player is not online');
			}
		}
		else{
			pc.apiSendLocMsg({ type: 'dump_data' });
			pc.sendActivity('all users in this location just dumped data to client errors page');
		}

	}else if (words[0]=="/force_reload" || words[0]=="/force_reload_at_next_move"){
		var at_next_move = (words[0]=="/force_reload_at_next_move");
	
		words.shift();
		var msg = (words.length) ? words.join(' ') : '';
		
		this.apiSendToAll({
			type: "force_reload",
			at_next_move: at_next_move,
			msg: msg
		});

	}else if (words[0]=="/makemortal"){

//		delete pc.is_god;
//		pc.sendActivity('you are no longer an admin');
		// Don't allow you to toggle this one either, because it would be annoying:
		pc.sendActivity('But you were doing so well as God! Nope, God you are and God you will remain.');

	}else if (words[0]=="/clean"){

		pc.onClean();
		pc.sendActivity('Account cleaned');

	}else if (words[0]=="/activity"){

		pc.sendActivity(txt);

	}else if (words[0]=="/alert"){
		
		pc.apiSendMsgAsIs({
			'type'		: 'alert',
			'msg'		: (words.length > 1) ? txt.toString().replace(words[0]+' ', '') : '11<split butt_txt="after 1" />2<split />3<split butt_txt="after 3" />4<split />5<split butt_txt="">6<split butt_txt="after 6. should not show up because there is nothing after" />',
			'btn_txt'	: 'got it',
		});

	}else if (words[0]=="/time"){

		var gt = current_gametime();
		var gt2 = format_gametime(gt);

		pc.sendActivity(gt.join('/') + ' -- '+gt2);

	}else if (words[0]=="/im"){

		var target_pc = getPlayer(words[1]);

		if (target_pc){

			if (target_pc.tsid == pc.tsid){

				target_pc.apiSendMsgAsIs({
					type: "pc_global_chat",
					pc:{
						tsid: pc.tsid,
						label: pc.label
					},
					txt: 'Speaking to yourself?'
				});
				
			}else{

				words.shift();
				words.shift();
				target_pc.apiSendMsgAsIs({
					type: "pc_global_chat",
					pc:{
						tsid: pc.tsid,
						label: pc.label
					},
					txt: 'IM: '+words.join(' ')
				});
			}
		}

	}else if (words[0]=="/lock"){

		doLocationLock(pc, {type: 'location_lock_request',msg_id:10});	

	}else if (words[0]=="/unlock"){

		doLocationUnlock(pc, {type: 'location_lock_release',msg_id:10});	

	}else if (words[0]=="/runtest"){

	  	test(pc);
	}else if (words[0]=="/erictest"){

	  	erictest(pc, words);

	}else if (words[0]=="/creategroup"){

		pc.groups_create(words[1]);
		pc.sendActivity('created group: '+words[1]);

	}else if (words[0]=="/cash"){

		var num = intval(words[1]);

		pc.stats_add_currants(num ? num : 100);

		// needed to make sure changes are propagated
		pc.apiSendLocMsg({ type: 'location_event' });

	}else if (words[0] == '/eval'){

		words.shift();
		eval(words.join(" "));

		// needed to make sure changes are propagated
		pc.apiSendLocMsg({ type: 'location_event' });

	}else if (words[0] == '/ptest'){

		try {
			var temp = apiNewItemStack('class_not_real', 1);
			pc.sendActivity('class exists (wtf)');
		}catch(e){
			pc.sendActivity('class does not exist (good!)');
		}
		
	}else if (words[0] == '/ingredients'){

		var recipe = get_recipe(words[1]);

		var find = [];
		for (var i=0; i<recipe.inputs.length; i++){
			var input = recipe.inputs[i];
			find.push([input[0], input[1]]);
		}
		
		log.info('Ingredients: '+find);

		for (var i=0; i<find.length; i++){

			if (!pc.checkItemsInBag(find[i][0], find[i][1])) {
				var remaining = pc.createItem(find[i][0], find[i][1]);
				if (remaining){
					pc.sendActivity("Your bag is full, so you didn't get "+find[i][0]);
				}
			}
		}
		
		// needed to make sure changes are propagated
		pc.apiSendLocMsg({ type: 'location_event' });

	}else if (words[0] == '/geo'){

		pc.apiSendMsgAsIs({
			type: 'go_url',
			url: '/god/world_street.php?tsid='+pc.location.tsid,
			new_window: 'geo'
		});

	}else if (words[0] == '/log'){

		words.shift();
		log.info("CLIENT LOG: "+words.join(' '));

	}else if (words[0] == '/familiar_push'){

		pc.familiar_send_alert({'callback':'familiar_test'});
		pc.sendActivity('pushed another alert into the familiar queue');

	}else if (words[0] == '/reset'){
		pc.stats_reset_xp();
		pc.stats.currants.apiSet(0);
		pc.skills_reset();
		pc.making_reset();
		pc.metabolics_add_energy(999999);
		pc.metabolics_add_mood(999999);
		pc.buffs_reset();
		pc.achievements_reset();
		pc.quests_reset();
		pc.familiar_reset();

		pc.emptyBag();

		//pc.createItem('papl_upside_down_pizza', 2);
		//pc.createItem('sammich', 3);
		//pc.createItem('common_crudites', 5);
		//pc.createItem('milk_butterfly', 3);
		//pc.createItem('cheese_stinky', 1);
		//pc.createItem('carrot_margarita', 2);
		//pc.createItem('cloud_11_smoothie', 1);
		//pc.createItem('bubble_tea', 3);
		//pc.createItem('sno_cone_blue', 1);

		pc.apiSendMsg({ type: 'pc_itemstack_verb' });

	}else if (words[0] == '/demo1'){

		pc.stats_next_level();
		pc.skills_give('ezcooking_1');

		pc.emptyBag();

		pc.createItem('knife_and_board', 1);
                pc.createItem('bun', 3);
                pc.createItem('meat', 3);

		pc.createItem('tomato', 1);
		pc.createItem('mushroom', 5);
		pc.createItem('oily_dressing', 1);
		pc.createItem('spinach', 5);

		pc.apiSendMsg({ type: 'pc_itemstack_verb' });

		//pc.sendActivity('test1');

	}else if (words[0] == '/demo2'){
		
		pc.stats_next_level();
		pc.skills_give('light_green_thumb_1');
		pc.stats_next_level();
		pc.skills_give('soil_appreciation_1');
		pc.stats_next_level();
		pc.skills_give('animalkinship_1');

		pc.emptyBag();

		pc.createItem('hoe', 1);
		pc.createItem('watering_can', 1);

		pc.apiSendMsg({ type: 'pc_itemstack_verb' });

	}else if (words[0] == '/makepol'){

		pc.admin_place_pol();
		pc.apiSendMsg({ type: 'pc_itemstack_verb' });

	}else if (words[0] == '/testquest'){
		pc.quests_remove(words[1]);
		if (words[1] == 'de_embiggenify'){
			pc.quests_remove('de_embiggenify_part2');
		}
		else if (words[1] == 'vendor_ping_pong_part1'){
			pc.quests_remove('vendor_ping_pong_part2');
			pc.quests_remove('vendor_ping_pong_part3');
			pc.quests_remove('vendor_ping_pong_part4');
		}
		else if (words[1] == 'le_miserable'){
			pc.quests_remove('le_miserable_part_2');
		}
		pc.quests_offer(words[1], true);
		
	}else if (words[0] == '/abandonquest'){
		pc.quests_remove(words[1]);
		if (words[1] == 'de_embiggenify'){
			pc.quests_remove('de_embiggenify_part2');
		}
		else if (words[1] == 'vendor_ping_pong_part1'){
			pc.quests_remove('vendor_ping_pong_part2');
			pc.quests_remove('vendor_ping_pong_part3');
			pc.quests_remove('vendor_ping_pong_part4');
		}
	
	}else if (words[0] == '/newxp_intro' || words[0] == '/newxp'){
	
		delete pc.newxp_step;

		pc.prompts_add({
			txt: "<font size=\"15\" color=\"#ff0000\"><b>DO NOT USE YOUR PRODUCTION CHARACTER!</b><br>This character will be completly wiped!!</font><br>Are you sure you want to do this? It will reset all kinds of things about your player (like emptying your pack) and is super-annoying if you are not using a dedicated newxp testing player.",
			icon_buttons	: false,
			choices			: [
				{ value : 'ok', label : 'OK' },
				{ value : 'no', label : 'NOOOOOOOO!!!!' }
			],
			is_modal: true,
			callback: 'newxp_testing_modal_callback'
		});

	}else if (words[0] == '/newxp_reset'){
	
		pc.imagination_reset();
		pc.stats_reset_imagination();
		pc.stats_add_imagination(100000);
		pc.setDefaultPhysics();

		if (pc.location.is_newxp){
			pc.location.reset(pc);
		}

	}else if (words[0] == '/newxp_training1'){
	
		delete pc.newxp_step;

		var instance_id = 'newxp_training1';
		if (pc.instances_has(instance_id)){
			pc.instances_left(instance_id);
			
			delete pc.instances.instances[instance_id];
			delete pc.instances.previously[instance_id];
		}
		
		var instance = pc.instances_create(instance_id, config.is_dev ? 'LRO11T9B9EA3QBI' : 'LIFBLMAVDJ53NP1', {no_auto_return: true, location_type: instance_id});
		pc.instances_enter(instance_id, -1348, -1913);
	
	}else if (words[0] == '/newxp_training2'){
	
		delete pc.newxp_step;

		var instance_id = 'newxp_training2';
		if (pc.instances_has(instance_id)){
			pc.instances_left(instance_id);
			
			delete pc.instances.instances[instance_id];
			delete pc.instances.previously[instance_id];
		}
		
		var instance = pc.instances_create(instance_id, config.is_dev ? 'LRO11UFB9EA3IF8' : 'LIFD0KCDEJ53L7K', {no_auto_return: true, location_type: instance_id});
		pc.instances_enter(instance_id, -2769, -737);

	}else if (words[0] == '/img_close'){
		pc.apiSendMsg({
			type: 'close_img_menu'
		});

	}else if (words[0] == '/newxp_house'){

		var instance_id = 'firebog_4_high_newxp';
		if (pc.instances_has(instance_id)){
			pc.instances_left(instance_id);
			
			delete pc.instances.instances[instance_id];
			delete pc.instances.previously[instance_id];
		}

		pc.has_done_intro = false;
		pc.intro_steps = {};
		pc.physicsReset();
		delete pc.use_img;
		pc.adminBackfillNewxpPhysics();
		var furn_bag = pc.furniture_get_bag();
		if (furn_bag) furn_bag.emptyBag();
		pc.stats_set_currants(0);
		pc.clearPath();
		pc.skills_reset();

		pc.teleportToLocation(config.is_dev ? 'LRO10K3B8383N51' : 'LHVK21706023QDG', -314, -600);

	}else if (words[0] == '/newbie_island'){

		pc.has_done_intro = false;
		pc.intro_steps = {};
		pc.stats_set_currants(0);
		pc.clearPath();
		pc.quests_reset();
		pc.imagination_delete_upgrade('mappery');
		pc.imagination_delete_upgrade('zoomability');
		pc.imagination_delete_upgrade('camera_mode');
		pc.imagination_delete_upgrade('encyclopeddling');
		pc.apiCancelTimer('newxpQuestReminder');
		delete pc.newbie_island_butterfly_lotion;
		delete pc.newbie_island_butterfly_massaged;

		// Make sure we have a skill
		if (!pc.skills_get_count()) pc.skills_give('animalkinship_1');

		for (var instance_id in pc.instances.instances){
			if (instance_id.substr(0, 3) == 'NB_'){
				pc.instances_left(instance_id);
				
				delete pc.instances.instances[instance_id];
				delete pc.instances.previously[instance_id];
			}
		}
		
		var instance_id = 'NB_Street1';
		var instance = pc.instances_create(instance_id, config.newxp_locations['newbie_island'], {no_auto_return: true, location_type: 'newbie_island', preserve_links: true});
		pc.instances_enter(instance_id, -2268, -777);

	}else if (words[0] == '/piggychat'){
		var piggy = pc.findCloseStack('npc_piggy');
		pc.announce_itemstack_bubble(piggy, "Hi! I have a sneaky itch behind my little piggy ear, a little light petting might scratch it for me...", 15 * 1000);
	
	}else if (words[0] == '/pigclean'){
		pc.location.removeItems('meat');
		pc.location.removeItems('plop');

	}else if (words[0] == '/multiitems'){
		pc.createItemFromGround('meat', 10);
		pc.createItemFromGround('flaming_humbaba', 4);
		pc.createItemFromGround('milk_butterfly', 10);
	}else if (words[0] == '/acceptallquests'){
		var quests = pc.quests_get_all();
		for (var i in quests.todo){
			pc.acceptQuest(i);
		}
		
	}else if (words[0] == '/map_get'){
		
		pc.updateMap();
	}else if (words[0] == '/breakit'){
		doBreakIt(pc);
	}else if (words[0] == '/summonrube'){
		pc.location.spawn_rube(pc);
	}else if (words[0] == '/quoin_counter'){
		var min_overlay_position = 30;
		var max_overlay_position = 100;

		pc.location.overlay_dismiss('quoins_1');
		pc.location.apiSendAnnouncement({
			uid: 'quoins_1',
			type: "vp_overlay",
			duration: 0,
			locking: false,
			width: 500,
			x: min_overlay_position+'%',
			top_y: '10%',
			delay_ms: 0,
			click_to_advance: false,
			bubble_familiar: false,
			text: [
				'<p><span class="overlay_counter">Player One: 0</span></p>'
			]
		});
		
		pc.location.overlay_dismiss('quoins_remaining');
		pc.location.apiSendAnnouncement({
			uid: 'quoins_remaining',
			type: "vp_overlay",
			duration: 0,
			locking: false,
			width: 500,
			x: '65%',
			top_y: '10%',
			delay_ms: 0,
			click_to_advance: false,
			bubble_familiar: false,
			text: [
				'<p><span class="overlay_counter">Remaining: 50</span></p>'
			]
		});
		
		pc.location.overlay_dismiss('quoins_2');
		pc.location.apiSendAnnouncement({
			uid: 'quoins_2',
			type: "vp_overlay",
			duration: 0,
			locking: false,
			width: 500,
			x: max_overlay_position+'%',
			top_y: '10%',
			delay_ms: 0,
			click_to_advance: false,
			bubble_familiar: false,
			text: [
				'<p><span class="overlay_counter">Player Two: 0</span></p>'
			]
		});
	
	}else if (words[0] == '/reset_cats'){
		delete pc['!bureaucracy_started'];
		delete pc['!bureaucracy_waiting'];
		delete pc['!bureaucracy_waiting_prompt'];
	} else if (words[0] == '/make_traps_go_now'){
		pc.location.invokeOnAllItems('reset', 'dust_trap');
	} else if (words[0] == '/baqala_reset') {
		if(pc.buffs_has('ancestral_nostalgia')) {
			pc.give_baqala_time(600);
		}
	} else if (words[0] == '/how_does_your_garden_grow'){
		pc.location.invokeOnAllItems('gardenGrow', 'garden_new');		
	} else if (words[0] == '/dirty_work') {
		if(words[1]) {
			var item_class = words[1];
		} else {
			var item_class = 'guano';
		}
		if(words[2]) {
			var max_count = intval(words[2]);
		} else {
			var max_count = 10;
		}
		var items = pc.location.getItems();
		var item_counter = 1;
		for(var i in items) {
			if(items[i].class_tsid == item_class) {
				if (item_counter >= max_count) {
					log.info("Admin deleting "+item_class+": "+items[i]);
					items[i].apiDelete();
				}
				item_counter++;
			}
		}
	} else if (words[0] == '/test_color_game') {
		if(words[1]) {
			var redPlayers = [];
			var bluePlayers = [];
			var yellowPlayers = [];

			// Find team captains
			var redCaptain = getPlayer(words[1]);
			if (!redCaptain) {
				pc.sendActivity("Error: invalid red captain TSID "+words[1]);
				return;
			} else {
				redPlayers.push(redCaptain);
			}
			if(words[2]) {
				var blueCaptain = getPlayer(words[2]);
				if (!blueCaptain) {
					pc.sendActivity("Error: invalid blue captain TSID "+words[2]);
					return;
				} else {
					bluePlayers.push(blueCaptain);
				}
			}
			if(words[3]) {
				var yellowCaptain = getPlayer(words[3]);
				if (!yellowCaptain) {
					pc.sendActivity("Error: invalid yellow captain TSID "+words[3]);
					return;
				} else {
					yellowPlayers.push(yellowCaptain);
				}
			}

			var new_game = apiNewGroup('global_game');
			new_game.initColorGame(redPlayers, bluePlayers, yellowPlayers);
		} else {
			var new_game = apiNewGroup('global_game');
			new_game.initNewDayGameInLocation(pc.location);
		}
	} else if (words[0] == '/shared_instance_join') {
		if(!pc.test_shared_instance_mgr) {
			var shared_instance_manager = apiNewGroup('shared_instance_manager');
			shared_instance_manager.initSharedInstanceManager();
			pc.test_shared_instance_mgr = shared_instance_manager;
		}
		
		pc.test_shared_instance_mgr.playerJoinInstance(pc, 'color_game');
	} else if (words[0] == '/shared_instance_kick') {
		if(!pc.test_shared_instance_mgr) {
			return;
		}
		
		pc.test_shared_instance_mgr.kickPlayer(pc);
	} else if (words[0] == '/rook_attack') {
		var health = words[1] ? intval(words[1]) : 1000;
		var result = pc.location.startSingleRookAttack(health);
		if (result.ok) {
			pc.sendActivity("Rooking this location with "+health+" health.");
		} else {
			pc.sendActivity("Failed to Rook this location: "+result.reason);
		}
	} else if (words[0] == '/kill_rook') {
		if (pc.location.isRooked()) {
			pc.location.stopRookAttack();
		} else {
			pc.sendActivity("Could not kill Rook. Location is not rooked.");			
		}
	} else if (words[0] == '/stun_rook') {
		if(pc.get_location().isRooked()) {
			pc.get_location().getRookAttack().doStun(pc, 1, 1000);
		}
	} else if (words[0] == '/max_luck') {
		pc.buffs_apply('max_luck');
	} else if (words[0] == '/min_luck') {
		if (pc.buffs_has('max_luck')) {
			pc.buffs_remove('max_luck');
		}
	} else if (words[0] == '/turn_off_quests') {
		pc.buffs_apply('turn_off_quests');
	} else if (words[0] == '/turn_on_quests') {
		if (pc.buffs_has('turn_off_quests')) {
			pc.buffs_remove('turn_off_quests');
		}
	} else if (words[0] == '/fix_races') {
		var pc_tsid = words[1];
		if(!pc_tsid) {
			return;
		}
		var target = getPlayer(pc_tsid);
		if (!target) {
			return;
		}
		
		target.clean_race_quests();
	} else if (words[0] == '/rr') {
		if (config.is_dev) {
			pc.sendActivity("trying to apiMoveMyLocationToRandomGS()");
			pc.apiMoveMyLocationToRandomGS();
		} else {
			pc.sendActivity("/rr only works on dev!");
		}
	} else if ( words[0] == '/newday' ||
				words[0] == '/new_day') {
		pc.doNewDay();

	} else if (words[0] == '/rebuild_house') {
		pc.houses_reset();
	} else if (words[0] == '/home_reset') {
		pc.houses_reset();
	} else if (words[0] == '/home_rebuild') {
		pc.houses_rebuild();
	} else if (words[0] == '/home_add_floor') {
		pc.houses_add_floor();
	} else if (words[0] == '/furn' || words[0] == '/furniture') {
		pc.furniture_populate(true);

	} else if (words[0] == '/pack') {
		pc.houses_do_moving_boxes();
	} else if (words[0] == '/unpack') {
		pc.houses_undo_moving_boxes();
	} else if (words[0] == '/loneliness_overlay' && words[1]) {
		var spirit = apiFindObject(words[1]);
		if (spirit) {
			pc.startLoneliness(spirit, 'A', true);
		}
	} else if (words[0] == '/butler_me') {
		pc.giveButlerBox();
	} else if (words[0] == '/craftybot_me') {
		var crafty_bot = pc.location.createAndReturnItem('npc_crafty_bot', 1, pc.x+100, pc.y);
		if (crafty_bot){
			pc.crafty_bot = {};
			pc.crafty_bot.tsid = crafty_bot.tsid;
			crafty_bot.owner = pc;
			pc.sendActivity('Crafty-bot created in his master\'s image.');
		}else{
			pc.sendActivity('Could not create Crafty-bot');
		}
	} else if (words[0] == '/craftybot_clear') {
		if (pc.crafty_bot){
			var craftybot = apiFindObject(pc.crafty_bot.tsid);
			if (craftybot) craftybot.apiDelete();
			
			delete pc.crafty_bot;
			pc.sendActivity('Craftybot cleared');
		}else{
			pc.sendActivity('You dont have a Craftybot to clear');
		}		
	} else if (words[0] == '/magicrock_reset') {
		delete pc.magic_rock;
		pc.sendActivity('Magic Rock has been reset');
	}else if (words[0] == '/skillquest_clean'){
		delete pc.newxp_step;

	} else if (words[0] == '/redeal') {
		pc.imagination_reshuffle_hand();
	} else if (words[0] == '/img') {
		pc.imagination_grant(words[1], words[2]);
	} else if (words[0] == '/tower') {

		if (words[1] == 'visit'){		pc.visitTower();
		}else if (words[1] == 'floors'){	pc.setTowerFloors(intval(words[2]));
		}else if (words[1] == 'rebuild'){	pc.rebuildTower();
		}else if (words[1] == 'reset'){ 	pc.resetTower();
		}else{
			pc.sendActivity("Unknown command: "+utils.filter_chat(txt));
		}
	} else if (words[0] === "/kickMachine") { 
		if (!words[1]) { 
			pc.sendActivity("Need a TSID!");
			return;
		}
		
		var tsid = words[1];
		
		var machine = apiFindObject(tsid);
		
		if (!machine.is_running) { 
			pc.sendActivity("This machine is already stopped.");
			return;
		}
		
		if (!machine.kickMachine()) { 
			pc.sendActivity("Unable to verify that machine was stuck, please send Liz the TSID");
			return;
		}
	} else if (words[0] === "/kickSloth") { 
		if (!words[1]) { 
			pc.sendActivity("Need a TSID!");
			return;
		}
		
		var tsid = words[1];
		
		var sloth = apiFindObject(tsid);
		
		if (!sloth.is_metalizing) { 
			pc.sendActivity("This sloth is not eating.");
			return;
		}
		
		sloth.metalizeComplete();
	} else if (words[0] == '/instance') {
		if (!words[1]){
			pc.sendActivity("Need a TSID!");
			return;
		}

		var tsid = words[1];

		var loc = apiFindObject(tsid);

		if (!loc){
			pc.sendActivity("Unknown template TSID - "+tsid);
			return;
		}

		if (!loc.instances_instance_me() && !loc.moteid == 10){
			pc.sendActivity(tsid+" doesn't seem to be a template!");
			return;
		}

		var instance = pc.instances_create('admin_testing_'+tsid, tsid, {}, {});

		if (!instance){
			pc.sendActivity("Instance creation failed. Boo.");
			return;
		}

		var place = apiFindObject(instance.get_entrance());
		var marker = choose_one(place.find_items('marker_teleport'));
		if (!marker) marker = {x: 0, y: 0};

		pc.sendActivity("You are being instance-ified. Stand by...");

		pc.instances_enter('admin_testing_'+tsid, marker.x, marker.y);
	} else if (words[0] == '/qurazy_test'){
		pc.announce_vp_overlay({
			overlay_key: 'o_qurazy_quoin_overlay',
			duration: 10000,
			x: '50%',
			top_y: '-5%',
			scale_to_stage: true,
			fade_out_sec: 3
		});
	} else if (words[0] == '/say' || words[0] == '/sayb'){
		var id;
		var txt = 'No text sent';
		var choices = {
			1 : {txt : "What? A long button here, this is", value : 'what'},
			2 : {txt : "Yes", value : 'yes'}
		};
		var button_style_type;
		var button_style_size;
		
		if (words.length == 1) {
			pc.sendActivity("Need a TSID!");
			return;
		}
	
		id = words[1];	
		var it = apiFindObject(id);
		
		if (!it){
			pc.sendActivity(id+" is not an stack");
			return;
		}
		
		if (!it.conversation_start){
			pc.sendActivity(id+" does not support conversations");
			return;
		}
		
		if (words[0] == '/say') {
			if (words.length > 2) {
				txt = words.slice(2).join(' ');
			}
		} else {
			if (words.length > 4) {
				button_style_size = words[2];
				button_style_type = words[3];
				txt = words.slice(4).join(' ');
			}
		}
		
		it.conversation_start(pc, txt, choices, null, null, null, {button_style_type: button_style_type, button_style_size: button_style_size});
	
	} else if (words[0] == '/flv'){
		pc.announce_vp_overlay({
			duration: 5000,
			overlay_key: words[1], // Giant_Alph_400px_flv_overlay
			is_flv: true
		});
	} else {
		pc.sendActivity("Unknown command: "+utils.filter_chat(txt));
	}
}

function doLocationPassthrough(pc, msg) {
	var rsp = make_rsp(msg);
	rsp.success = true;
	sendMessage(rsp, pc);
	msg.payload = msg.payload || {missing_payload:true};
	sendMessage(msg.payload, pc.location);
}

function doVerb(pc, msg) {
	log.info(pc.tsid+" DO VERB ",msg);
	
	if (msg.itemstack_tsid == config.familiar_tsid){

		pc.familiar_on_verb(msg);
		return;
	}


	//
	// try and find the item stack in the player's location,
	// else try their bag, else give up
	//

	var it = pc.location.apiLockStack(msg.itemstack_tsid);
	//if (config.is_dev) log.info("VERB: "+msg.verb+" item: "+it);
	var stack_source = 'location';
	var stack_container_tsid = pc.location.tsid;

	if (it && it.class_tsid != 'npc_fox'){
		// range check...
		var x = Math.abs(it.x - pc.x);
		var y = Math.abs(it.y - pc.y);
		var range = Math.sqrt((x*x)+(y*y));
		var required_range = 300;
		var check_for_proximity = msg.check_for_proximity ? true : false;

		var at_home = pc.houses_is_at_home();

		// Check for overrides
		if (it.verbs && it.verbs[msg.verb]){
			if (it.verbs[msg.verb].proximity_override) required_range = it.verbs[msg.verb].proximity_override;
			if (it.verbs[msg.verb].disable_proximity) check_for_proximity = false;
		}

		// http://bugs.tinyspeck.com/9235
		if (msg.verb == 'give') check_for_proximity = false;

		if (at_home && msg.verb == 'pickup') check_for_proximity = false;

		if (range > required_range && check_for_proximity){
			it.apiPutBack();

			// sticking this here so that if you try to verb a butterfly and it's
			// far away, it will start moving again
			if (it.onInteractionEnding) it.onInteractionEnding(pc);

			return pc.apiSendMsg(make_fail_rsp(msg, 101, "You are "+Math.round(range)+"px away. Get closer:"+required_range));
		}
		else if (range > config.verb_radius && !at_home){
			it.apiPutBack();

			// sticking this here so that if you try to verb a butterfly and it's
			// far away, it will start moving again
			if (it.onInteractionEnding) it.onInteractionEnding(pc);

			var verb = it.verbs[msg.verb].name;
			if (!verb) verb = 'use';
			var text = "Oops. The "+it.name_single+" got too far away for you to "+verb+". Get closer and then try again.";
			if (pc.is_god) text += " ("+range+")";

			return pc.apiSendMsg(make_fail_rsp(msg, 1, text));
		}
	}

	if (!it){
		//if (config.is_dev) log.info("VERB: "+msg.verb+" item is not in location");
		var items = pc.getAllContents();
		if (items[msg.itemstack_tsid]){
			it = pc.apiLockStack(items[msg.itemstack_tsid].path);
			stack_source = 'bag';
			stack_container_tsid = pc.tsid;
			//if (config.is_dev) log.info("VERB: "+msg.verb+" item is in pack");
		}

		// it might be a trophy/furniture
		if (!it){
			items = pc.furniture_get_hidden();
			if (items[msg.itemstack_tsid]){
				it = pc.apiLockStack(items[msg.itemstack_tsid].path);
				if (it.is_trophy || it.has_parent('furniture_base')){

					//if (config.is_dev) log.info("VERB: "+msg.verb+" item is trophy/furniture");
					stack_source = 'bag';
					stack_container_tsid = pc.tsid;
				}
				else{
					it = null;
				}
			}
		}
	}

	if (!it){
		pc.apiSendMsg(make_fail_rsp(msg, 0, "can't find the itemstack to work with: "+msg.itemstack_tsid));
		log.error("doVerb CANNOT FIND ITEM ID=", msg.itemstack_tsid, msg);
		return;
	}
	
	//
	// Log it
	//
	
	if (msg.object_pc_tsid){
		apiLogAction('VERB', 'pc='+pc.tsid, 'item_class='+it.class_tsid, 'item_tsid='+msg.itemstack_tsid, 'verb='+msg.verb, 'count='+msg.count, 'target='+msg.object_pc_tsid);
	}
	else{
		apiLogAction('VERB', 'pc='+pc.tsid, 'item_class='+it.class_tsid, 'item_tsid='+msg.itemstack_tsid, 'verb='+msg.verb, 'count='+msg.count);
	}


	//
	// can we find a verb function?
	//

	if (!it.verbs || !it.verbs[msg.verb] || !it.verbs[msg.verb].handler){
		it.apiPutBack();
		pc.apiSendMsg(make_fail_rsp(msg, 0, "No such verb "+msg.verb));
		return;
	}


	//
	// is this state ok?
	//

	var is_ok = 0;

	for (var i in it.verbs[msg.verb].ok_states){

		var state = it.verbs[msg.verb].ok_states[i];

		if (state == 'in_pack'		&& stack_source == 'bag'	) is_ok = 1;
		if (state == 'in_location'	&& stack_source == 'location'	) is_ok = 1;
	}
	if (!is_ok){
		log.error(it+' verb '+msg.verb+' ok state mismatch: '+stack_source+' vs '+state);
		it.apiPutBack();
		pc.apiSendMsg(make_fail_rsp(msg, 0, "Verb "+msg.verb+" doesn't have OK state."));
		return;
	}


	//
	// does it have a condition?
	//

	if (it.verbs[msg.verb].conditions){
		if (msg.target_itemstack_tsid){
			var drop_stack = pc.getAllContents()[msg.target_itemstack_tsid];
			if (!drop_stack) drop_stack = pc.location.apiLockStack(msg.target_itemstack_tsid);
		}
		var ret = it.verbs[msg.verb].conditions.call(it, pc, drop_stack);
		if (ret['state'] != 'enabled'){

			it.apiPutBack();
			pc.apiSendMsg(make_fail_rsp(msg, 0, "Verb not enabled"));
			if (ret.reason) pc.sendActivity(ret.reason);
			return;
		}
	}


	//
	// if this verb requires a target itemstack, make sure one was passed and
	// that it was an allowed one.
	//


	if (it.verbs[msg.verb].requires_target_item){

		var ret = it.verbs[msg.verb].valid_items.call(it, pc);


		//
		// perhaps there are no valid stacks at this time
		//

		if (!ret.ok){

			var rsp = make_ok_rsp(msg);
			rsp.choices = [];
			rsp.txt = ret.txt;

			it.apiPutBack();
			pc.apiSendMsg(rsp);
			return;
		}


		//
		// if we weren't passed a stack id, return the possible list
		//

		if (!msg.target_item_class){

			var rsp = make_ok_rsp(msg);
			rsp.choices = ret.choices;

			it.apiPutBack();
			pc.apiSendMsg(rsp);
			return;
		}


		//
		// did we get passed a stack on the list?
		//

		var stack_ok = 0;
		for (var i=0; i<ret.choices.length; i++){
			var c = ret.choices[i];

			/* the list of choices can be either item classes or stack tsids */
			if (c == msg.target_item_class ||
				c == msg.target_itemstack_tsid ){

				stack_ok = 1;
			}
		}


		//
		// if we didn't get a valid stack, return an error
		//

		if (!stack_ok){

			it.apiPutBack();
			pc.apiSendMsg(make_fail_rsp(msg, 0, "Not a valid choice of target stack"));
			return;
		}
	}
	
	//
	// if this is an emote, perform some sanity checks
	//

	if (it.verbs[msg.verb].requires_target_pc || it.verbs[msg.verb].is_emote){

		//
		// can't target ourselves
		//

		if (msg.object_pc_tsid == pc.tsid){
			it.apiPutBack();
			pc.apiSendMsg(make_fail_rsp(msg, 0, "You can't do that to yourself."));
			return;
		}


		//
		// get target player
		//

		var target = getPlayer(msg.object_pc_tsid);
		if (!target){
			it.apiPutBack();
			pc.apiSendMsg(make_fail_rsp(msg, 0, "You can't do that to a player that isn't there!"));
			return;
		}

		if (!apiIsPlayerOnline(target.tsid)){
			it.apiPutBack();
			pc.apiSendMsg(make_fail_rsp(msg, 0, "That player has gone offline."));
			return;
		}
		
		//
		// Blocking?
		//
		
		if (pc.buddies_is_ignored_by(target)){
			it.apiPutBack();
			pc.apiSendMsg(make_fail_rsp(msg, 0, "That player has blocked you."));
			return;			
		}

		//
		// target must be within range of us
		//
		
		var range = pc.distanceFromPlayer(target);
		var required_range = config.verb_radius;
		var check_for_proximity = msg.check_for_proximity ? true : false;

		// Check for overrides
		if (it.verbs && it.verbs[msg.verb]){
			if (it.verbs[msg.verb].proximity_override) required_range = it.verbs[msg.verb].proximity_override;
			if (it.verbs[msg.verb].disable_proximity) check_for_proximity = false;
		}
		
		// http://bugs.tinyspeck.com/9235
		if (msg.verb == 'give') check_for_proximity = false;

		if (range > required_range && check_for_proximity){
			it.apiPutBack();
			pc.apiSendMsg(make_fail_rsp(msg, 0, "That player is too far away. Try moving a little closer."));
			return;
		}
	}

	//
	// do we need to split the stack down to act on a single copy?
	//

	var old_it = null;
	var count = msg.count;

	if (it.verbs[msg.verb].is_single) count = 1;
	if (it.verbs[msg.verb].is_all) count = it.count;

	if (count > it.count){
		log.error("not enough items in stack for original request");
		count = it.count;
	}

	var temp = it.apiSplit(count);
	if (temp){
		old_it = it;
		it = temp;
	}
	var old_count = it.count;

	//log.info("operating stack has count "+it.count);
	if (old_it){
		//log.info("left-over stack has count "+old_it.count);
	}else{
		//log.info("there is no left-over stack");
	}


	//
	// this call tells the stack that interaction (verb processing) has finished.
	// this is used was NPCs that track an isWaiting state
	// we do this before verb processing, so that verb processing can capture the
	// attention again if needed (by starting a conversation, etc)
	//

	if (it.onInteractionEnding) it.onInteractionEnding(pc);


	//
	// perform the verb
	//

	log.info("-- Calling verb handler");
	try{
		var handler_success = it.verbs[msg.verb].handler.call(it, pc, msg, false);
		if (handler_success) log.info("-- verb succeeded");
		else log.info("-- verb failed");
		it.notifyVerb(pc, msg.verb, old_count, handler_success);
	}
	catch (e){
		log.error('Caught exception during verb processing', e);
	}
	log.info("-- returned from verb handler");


	//
	// has the stack been deleted? if not, put it back
	//

	//log.info('operating stack: ', it, it.count);

	var has_moved	= (it.container && it.container.tsid != stack_container_tsid) ? 1 : 0;
	var is_gone	= it.apiIsDeleted() || (it.count == 0) ? 1 : 0;
	var has_grown	= it.count > old_count ? 1 : 0;
	var has_shrunk	= it.count < old_count ? 1 : 0;

	if (is_gone || has_moved){

		if (stack_source == 'bag'){
			pc.items_removed(it);
		}
		
		if (old_it){
			old_it.apiPutBack();
			//log.info("operating stack was deleted or moved - putting back left-over stack ("+is_gone+", "+has_moved+")");
		}else{
			//log.info("operating stack was deleted or moved and no left-over stack - do nothing");
		}

	}else{

		if (old_it){
			//log.info("operating stack needs to be merged into left-over stack");

			old_it.apiMerge(it, it.count);
			old_it.apiPutBack();

			if (it.count){
				// if we weren't able to merge the whole stack back,
				// make sure we put it back too.
				it.apiPutBack();
			}
		}else{
			//log.info("operating stack needs to be put back");

			it.apiPutBack();
		}
		
		if (has_grown){
			pc.items_added(it);
		}
		else if (has_shrunk){
			pc.items_removed(it);
		}
	}


	//
	// tell the calling player that the verb action succeeded. pc.apiSendMsg()
	// has the side-effect of telling the player about things which changed
	// due to the verb handler
	//

	var rsp = make_rsp(msg);
	rsp.success = true;
	//log.info("doVerb RSP=",rsp);
	pc.apiSendMsg(rsp);
	//log.info("DOVERB PCDELTA ",rsp);


	//
	// and now tell everyone else in the location. the GS will insert any
	// needed changes into this message, telling them that itemstack has
	// disappeared, etc.
	//
	// if other things happened to specific *other* pcs in this location
	// (e.g. item appeared in their bag, their stats changed) then they
	// will get this special info in thier messages. that is, different
	// players get different 'changes' payloads. if the payload would be
	// empty for any given player, they won't be sent a message at all. so,
	// this call may not produce any messages at all.
	//

	var ev = {
		type: "pc_itemstack_verb",
	};
	pc.apiSendLocMsgX(ev);
	//log.info("DOVERB DELTA ",ev);
}

function doMenuUp(pc, msg){

	var tsid = msg.itemstack_tsid;
	var stack = null;
	
	var pc_items = pc.getAllContents();

	if (pc.location.items[tsid]){
		stack = pc.location.items[tsid];
	}else if (pc_items[tsid]){
		stack = pc_items[tsid];
	}	
	else{
		// it might be a trophy/furniture
		pc_items = pc.furniture_get_hidden();
		if (pc_items[tsid]){
			stack = pc.apiLockStack(pc_items[tsid].path);
			if (!stack.is_trophy && !stack.has_parent('furniture_base')){
				stack = null;
			}
		}
	}

	if (stack){
		if (stack.onInteractionStarting) stack.onInteractionStarting(pc);
		pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		pc.apiSendMsg(make_fail_rsp(msg, 0, "can't find stack"));
	}

}

// for now this is the same as doMenuUp
function doMouseOver(pc, msg){

	var tsid = msg.itemstack_tsid;
	var stack = null;
	
	var pc_items = pc.getAllContents();

	if (pc.location.items[tsid]){
		stack = pc.location.items[tsid];
	}else if (pc_items[tsid]){
		stack = pc_items[tsid];
	}
	else{
		// it might be a trophy/furniture
		pc_items = pc.furniture_get_hidden();
		if (pc_items[tsid]){
			stack = pc.apiLockStack(pc_items[tsid].path);
			if (!stack.is_trophy && !stack.has_parent('furniture_base')){
				stack = null;
			}
		}
	}

	if (stack){
		if (stack.onInteractionStarting) stack.onInteractionStarting(pc, true);
		pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		pc.apiSendMsg(make_fail_rsp(msg, 0, "can't find stack"));
	}

}

function doPcVerbMenu(pc, msg){
	var target = apiFindObject(msg.pc_tsid);
	if (!target || !target.is_player){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "target player not found"));
		return;
	}

	var rsp = make_ok_rsp(msg);
	var target_info = target.getInfo();
	var pc_is_staff = (pc.is_god || pc.is_help);
	var target_is_staff = (target_info.is_god || target_info.is_help);
	var target_is_online = target.isOnline();
	
	//
	// player menu items
	//
	
	rsp.pcmenu = {};
	if (pc.is_god || pc.is_help || pc.isGuideOnDuty()){

		if (pc.is_god || pc.is_help){
			rsp.pcmenu['teleport_to_them'] = {
				label: '(GOD) Teleport to them',
				disabled: (target_is_staff && !pc_is_staff) ? true : false,
				disabled_reason: (target_is_staff && !pc_is_staff) ? "You can't teleport to staff" : '',
				tooltip: 'Teleport yourself to this person\'s location',
				god_verb: true,
				requires_confirmation: true
			};
			
			var is_instance = pc.location.isInstance();
			rsp.pcmenu['teleport_to_me'] = {
				label: '(GOD) Teleport them to me',
				disabled: is_instance ? true : false,
				disabled_reason: is_instance ? "You can't teleport people into this location" : '',
				tooltip: 'Teleport this person to your location',
				god_verb: true,
				requires_confirmation: true
			};
		}
		
		if (pc.is_god){
			if (!target.isInTimeout()){
				rsp.pcmenu['place_in_timeout'] = {
					label: '(GOD) Suspend this fine person',
					disabled: false,
					disabled_reason: '',
					tooltip: 'Kick them offline',
					god_verb: true,
					requires_confirmation: true
				};
			}
			
			if (!target.isInConeOfSilence()){			
				rsp.pcmenu['place_in_coneofsilence'] = {
					label: '(GOD) Place in cone of silence',
					disabled: false,
					disabled_reason: '',
					tooltip: 'Block them from global/local chat',
					god_verb: true,
					requires_confirmation: true
				};
			}
			else{			
				rsp.pcmenu['remove_from_coneofsilence'] = {
					label: '(GOD) Remove from cone of silence',
					disabled: false,
					disabled_reason: '',
					tooltip: 'Allow them to chat again',
					god_verb: true,
					requires_confirmation: true
				};
			}
			
			if (!target.isInConeOfSilence('help')){			
				rsp.pcmenu['place_in_help_coneofsilence'] = {
					label: '(GOD) Place in HELP cone of silence',
					disabled: false,
					disabled_reason: '',
					tooltip: 'Block them from the help channel',
					god_verb: true,
					requires_confirmation: true
				};
			}
			else{			
				rsp.pcmenu['remove_from_help_coneofsilence'] = {
					label: '(GOD) Remove from HELP cone of silence',
					disabled: false,
					disabled_reason: '',
					tooltip: 'Allow them to use the help channel again',
					god_verb: true,
					requires_confirmation: true
				};
			}
		}
		
		if (!pc.isGuideOnDuty()){
			rsp.pcmenu['client_error'] = {
				label: '(GOD) Force client error report',
				disabled: false,
				disabled_reason: '',
				tooltip: 'Force their client to create a client error report',
				god_verb: true,
				requires_confirmation: true
			};

			rsp.pcmenu['god_page'] = {
				label: '(GOD) Open god page',
				disabled: false,
				disabled_reason: '',
				tooltip: 'Go to their god page',
				god_verb: true
			};
		}

	}
	
	
	//
	// Find all items with emote verbs
	//
	
	if (target_is_online && target_info.location.tsid == pc.get_simple_location().tsid){
		
		//
		// Check for blocking
		//
		
		if (!pc.buddies_is_ignored_by(target) && !pc.buddies_is_ignoring(target)){
	
			var inv_items = pc.getAllContents();
			for (var i in inv_items){
				var stack = inv_items[i];
		
				for (var j in stack.verbs){
					var v = stack.verbs[j];
					if (v.is_emote){
						var ret = stack.get_tooltip(pc, j);
						if (ret.hidden) continue;
						
						if (pc.buddies_is_ignoring(target)) ret.disabled = "You are blocking "+utils.escape(target_info.label);
				
						rsp.pcmenu[stack.class_tsid+':'+j] = {
							label: v.name,
							disabled: ret.disabled,
							disabled_reason: (ret.disabled && ret.tooltip) ? ret.tooltip : '',
							tooltip: ret.tooltip,
							god_verb: false,
							requires_confirmation: false
						};
					}
				}
			}
		}
	}
	
	
	//
	// Put blocking/unblocking stuff at the bottom of the menu
	//
	
	if (!pc.buddies_is_ignoring(target)){
		// the name 'buddy_ignore' gets special report abuse treatment in the client
		// SO DO NOT CHANGE IT WITHOUT TALKING TO ERIC FIRST
		rsp.pcmenu['buddy_ignore'] = { 
			label: 'Block / Report',
			disabled: false,
			disabled_reason: '',
			tooltip: 'Prevent '+utils.escape(target_info.label)+' from talking to you',
			god_verb: false,
			requires_confirmation: true
		};

	}
	else{
		rsp.pcmenu['buddy_unignore'] = {
			label: 'Un-Block '+utils.escape(target_info.label),
			disabled: false,
			disabled_reason: '',
			tooltip: 'Allow '+utils.escape(target_info.label)+' to talk to you',
			god_verb: false,
			requires_confirmation: true
		};
	}
	
	if (pc.buddies_is_ignored_by(target) || pc.buddies_is_ignoring(target)){
		rsp.is_blocked = true;
	}
	
	if (pc.buddies_is_buddy(target)){
		rsp.pcmenu['buddy_remove'] = {
			label: 'Remove from Friends',
			disabled: false,
			disabled_reason: '',
			tooltip: 'Remove this person from your contact list',
			god_verb: false,
			requires_confirmation: true,
			sort_on: 2
		};
	} else {
		var buddy_add_ok = true;

		if (pc.buddiesHasMax()){
			if (!pc.buddies_is_reverse(target)){
				buddy_add_ok = false;
			}
		}

		rsp.pcmenu['buddy_add'] = {
			label: 'Add to Friends',
			disabled: buddy_add_ok ? false : true,
			disabled_reason: buddy_add_ok ? '' : 'You currently have the maximum number of friends ('+config.buddy_limit+' or more!)',
			tooltip: 'Add this person to your contact list',
			god_verb: false,
			requires_confirmation: false,
			sort_on: 1000,
		}
	}

	if (pc.followers){
		if (pc.followers[msg.pc_tsid]){
			rsp.pcmenu['break_follow'] = {
				label: 'Evade ' + utils.escape(target_info.label),
				disabled: false,
				disabled_reason: '',
				tooltip: 'Stop this player from following you',
				god_verb: false,
				requires_confirmation: false
			};
		}
	}

	if (target_is_online && !rsp.is_blocked && (pc.skills_has('teleportation_5') || (pc.location.isGreetingLocation() && pc.isGreeter() && target.isGreeter()))){
		var summonses = pc.teleportation_get_max_summons();
		var energy_cost = pc.teleportation_get_energy_cost();
		var ret = pc.teleportation_can_summon(target);

		if (target.prompts_over_limit()){
			rsp.pcmenu['summon'] = {
				label: 'Summon ' + utils.escape(target_info.label),
				disabled: true,
				disabled_reason: "They are too busy to be summoned.",
				tooltip: 'Summon this player to your location. -'+energy_cost+' energy',
				god_verb: false,
				requires_confirmation: true
			};
		}
		else if (pc.location.isGreetingLocation() && pc.isGreeter() && target.isGreeter()){
			rsp.pcmenu['summon'] = {
				label: 'Summon ' + utils.escape(target_info.label),
				disabled: false,
				disabled_reason: '',
				tooltip: 'Summon this player to your location.',
				god_verb: false,
				requires_confirmation: true
			};
		}
		else if (summonses[0] > pc.teleportation.free_summons_today){
			rsp.pcmenu['summon'] = {
				label: 'Summon ' + utils.escape(target_info.label),
				disabled: ret['ok'] ? false : true,
				disabled_reason: ret['error'] ? ret['error'] : '',
				tooltip: 'Summon this player to your location. -'+energy_cost+' energy',
				god_verb: false,
				requires_confirmation: true
			};
		}
		else if (summonses[1] == -1 || summonses[1] > pc.teleportation.paid_summons_today){
			rsp.pcmenu['summon'] = {
				label: 'Summon ' + utils.escape(target_info.label),
				disabled: ret['ok'] ? false : true,
				disabled_reason: ret['error'] ? ret['error'] : '',
				tooltip: 'Summon this player to your location with 1 teleport token.',
				god_verb: false,
				requires_confirmation: true
			};
		}
		else{
			rsp.pcmenu['summon'] = {
				label: 'Summon ' + utils.escape(target_info.label),
				disabled: true,
				disabled_reason: "You can't do this anymore today",
				tooltip: 'Summon this player to your location. -'+energy_cost+' energy',
				god_verb: false,
				requires_confirmation: true
			};
		}

	}

	if (target_info.location.pols_is_pol() && target_info.location.pols_is_owner(pc)){
		rsp.pcmenu['pol_kick'] = {
			label: 'Kick out ' + utils.escape(target_info.label),
			disabled: target_is_staff,
			disabled_reason: (target_is_staff) ? 'You can\'t kick out staff!' : '',
			tooltip: 'Kick this player out of your house',
			god_verb: false,
			requires_confirmation: true
		};
	}
	
	if (pc.location.is_party_space && target_info.location.tsid == pc.location.tsid && pc.location.instance.getProp('creator') == pc.tsid){
		rsp.pcmenu['party_space_kick'] = {
			label: 'Kick out ' + utils.escape(target_info.label),
			disabled: target_is_staff,
			disabled_reason: (target_is_staff) ? 'You can\'t kick out staff!' : '',
			tooltip: 'Kick this player out of your Party Space',
			god_verb: false,
			requires_confirmation: true
		};
	}

	pc.apiSendMsg(rsp);
}

function doPCMenu(pc, msg){

	var target = apiFindObject(msg.target_tsid);
	if (!target || !target.is_player){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "target player not found"));
		return;
	}
	
	var target_info = target.getInfo();

	//
	// God teleportation commands
	//

	if (msg.command == 'teleport_to_them' && (pc.is_god || pc.is_help)){
		pc.ignore_stuck_instance = true;
		pc.teleport_to_player(target);
		return pc.apiSendMsg(make_ok_rsp(msg));
	}

	if (msg.command == 'teleport_to_me' && (pc.is_god || pc.is_help)){
		target.teleport_to_player(pc);
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	
	
	//
	// God moderation commands
	//
	
	if (msg.command == 'place_in_timeout' && pc.is_god){
		target.placeInTimeout();
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	
	if (msg.command == 'place_in_coneofsilence' && pc.is_god){
		target.placeInConeOfSilence();
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	
	if (msg.command == 'remove_from_coneofsilence' && pc.is_god){
		target.removeFromConeOfSilence();
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	
	if (msg.command == 'place_in_help_coneofsilence' && pc.is_god){
		target.placeInConeOfSilence({type: 'help'});
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	
	if (msg.command == 'remove_from_help_coneofsilence' && pc.is_god){
		target.removeFromConeOfSilence({type: 'help'});
		return pc.apiSendMsg(make_ok_rsp(msg));
	}

	if (msg.command == 'client_error' && (pc.is_god || pc.is_help)){
		target.apiSendMsg({ type: 'dump_data' });
		return pc.apiSendMsg(make_ok_rsp(msg));
	}


	if (msg.command == 'god_page' && (pc.is_god || pc.is_help)){
		pc.apiSendMsgAsIs({
			type: 'go_url',
			url: '/god/user_player.php?tsid='+target.tsid,
			new_window: 'god_page_'+target.tsid
		});
	}
	
	
	//
	// Ignore/unignore
	//
	
	if (msg.command == 'buddy_ignore'){
		pc.buddies_add_ignore(target);
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	
	if (msg.command == 'buddy_unignore'){
		pc.buddies_remove_ignore(target);
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	
	
	//
	// Look for matching items
	//
	
	if (target.get_simple_location().tsid == pc.get_simple_location().tsid){
		var verb = msg.command.split(':', 2);
	
		if (verb[0] && verb[1]){
			var stacks = pc.get_stacks_by_class(verb[0]);
		
			for (var i in stacks){
				var stack = stacks[i];
				var v = stack.verbs[verb[1]];
			
				if (v && v.is_emote && !pc.buddies_is_ignored_by(target)){
					if (v.conditions){
						var ret = v.conditions.call(stack, pc);
						if (ret['state'] != 'enabled'){
							continue;
						}
					}
					
					msg.itemstack_tsid = stack.tsid;
					msg.verb = verb[1];
					msg.count = 1;
					msg.object_pc_tsid = target.tsid;
				
					return doVerb(pc, msg);
				}
			}
		}
	}
	
	//
	// break a follow
	//

	if (msg.command == 'break_follow'){
		target.sendActivity(utils.escape(pc.label) + " gave you the slip! You are no longer following them.");

		target.stopFollowing();

		return pc.apiSendMsg(make_ok_rsp(msg));
	}

	//
	// Summon
	//

	if (msg.command == 'summon'){
		if (!pc.location.isGreetingLocation() || !pc.isGreeter() || !target.isGreeter()){
			var ret = pc.teleportation_can_summon(target);
			if (!ret['ok']){
				return pc.apiSendMsg(make_fail_rsp(msg, 1, ret['error']));
			}
		}

		//
		// Send prompts
		//

		pc['!summons_uid'] = pc.prompts_add({
			txt		: 'Waiting for '+target.linkifyLabel()+' to confirm.',
			icon_buttons	: false,
			timeout			: 30,
			choices			: [
				{ value : 'ok', label : 'OK' }
			]
		});

		if (pc.location.isInstance('party_space')){
			if (target.party_get() != pc.party_get()) pc.party_invite(target, true);

			target.prompts_add({
				txt		: pc.linkifyLabel()+' would like to invite you to their party in '+pc.location.linkifyLabel()+'. Do you accept?',
				icon_buttons	: true,
				timeout			: 30,
				timeout_value	: 'timeout-'+pc.tsid,
				choices			: [
					{ value : 'yes-'+pc.tsid, label : 'Yes' },
					{ value : 'no-'+pc.tsid, label : 'No' }
				],
				callback	: 'teleportation_accept_summons'
			});
		}
		else{
			var txt = pc.linkifyLabel()+' would like to summon you to '+pc.location.linkifyLabel()+'. Do you accept?';
			if (pc.location.isGreetingLocation() && pc.isGreeter() && target.isGreeter()){
				txt	= '<span class="prompt_greeter"><span class="prompt_summon_name">'+pc.linkifyLabel()+'</span> would like to summon you to <span class="prompt_greeter_loc">'+pc.location.linkifyLabel()+'</span>. Do you accept?</span>';
			}
			target.prompts_add({
				txt		: txt,
				icon_buttons	: true,
				timeout			: 30,
				timeout_value	: 'timeout-'+pc.tsid,
				choices			: [
					{ value : 'yes-'+pc.tsid, label : 'Yes' },
					{ value : 'no-'+pc.tsid, label : 'No' }
				],
				callback	: 'teleportation_accept_summons'
			});
		}

		return pc.apiSendMsg(make_ok_rsp(msg));
	}

	//
	// Kick out of your house
	//

	if (msg.command == 'pol_kick'){
		if (target.location.pols_is_pol() && target.location.pols_is_owner(pc)){
			if (target.location.getProp('is_public')){
				target.houses_go_to_new_house();
			}
			else{			
				// de-auth
				pc.houses_remove_auth(target.location, target);

				var entrance = target.location.pols_get_entrance_outside();
				target.teleportToLocationDelayed(entrance.tsid, entrance.x, entrance.y);
			}

			pc.sendActivity(utils.escape(target.label) + " was removed from your house.");
			target.sendActivity(utils.escape(pc.label) + " removed you from their house.");
		}
		else{
			return pc.apiSendMsg(make_fail_rsp(msg, 1, "You can't do that"));
		}
	}

	//
	// Kick out of your party space
	//
	if (msg.command == 'party_space_kick'){
		if (pc.location.is_party_space && target_info.location.tsid == pc.location.tsid && pc.location.instance.getProp('creator') == pc.tsid){
			if (target.party) { 	// extreme paranoia. can't get here if target's not in a party!
				target.party.kicked(target.tsid);
			}
			target.party_leave();

			pc.sendActivity(utils.escape(target.label) + " was removed from your Party Space.");
			target.sendActivity(utils.escape(pc.label) + " removed you from their Party Space.");
		}
		else{
			return pc.apiSendMsg(make_fail_rsp(msg, 1, "You can't do that"));
		}
	}

	pc.apiSendMsg(make_fail_rsp(msg, 1, "unknown command"));
}

function doItemstackVerbMenu(pc, msg){

	var tsid = msg.itemstack_tsid;
	var stack = null;
	var stack_source = null;
	
	var pc_items = pc.getAllContents();

	if (pc.location.items[tsid]){
		stack = pc.location.items[tsid];
		stack_source = 'in_location';
	}else if (pc_items[tsid]){
		stack = pc_items[tsid];
		stack_source = 'in_pack';
	}
	else{
		// it might be a trophy/furniture
		pc_items = pc.furniture_get_hidden();
		if (pc_items[tsid]){
			stack = pc.apiLockStack(pc_items[tsid].path);
			if (stack.is_trophy || stack.has_parent('furniture_base')){
				stack_source = 'in_pack';
			}
			else{
				stack = null;
			}
		}
	}

	if (stack){
		// Run verb menu open callback.
		if (stack.onVerbMenuOpen) {
			stack.onVerbMenuOpen(pc);
		}
		
		// we sometimes send this messaeg when we just want to check on verbs; only when starting_menu:true are we actually starting an interaction with the stack
		if (msg.starting_menu && stack.onInteractionStarting) stack.onInteractionStarting(pc);
		var rsp = make_ok_rsp(msg);

		//
		// add any optional verbs
		//

		rsp.itemDef = {
			class_tsid: stack.type,
			verbs: {},
			emote_verbs: {}
		};

		if (stack.is_disabled) return pc.apiSendMsg(rsp);
		
		
		if (msg.target_itemstack_tsid){
			var drop_stack = pc.getAllContents()[msg.target_itemstack_tsid];
			if (!drop_stack) drop_stack = pc.location.apiLockStack(msg.target_itemstack_tsid);
		}

		for (var i in stack.verbs){
			var v = stack.verbs[i];

			// check if it matches ok_states first
			var is_ok = 0;
			for (var j in v.ok_states){
				if (v.ok_states[j] == stack_source) is_ok = 1;
			}
			if (!is_ok) continue;

			var ret = stack.get_tooltip(pc, i, drop_stack);
			if (ret.hidden) continue;


			var verb = {};

			// copy props - would probably be better to only copy things we want,
			// but i didn't write this code originally [CH]
			for (var j in v){

				if (j == 'handler') continue;
				if (j == 'conditions') continue;
				if (j == 'is_drop_target') continue;
				if (j == 'drop_many') continue;
				if (j == 'drop_ok_code') continue;
				if (j == 'name') continue;
				if (j == 'making') continue;
				if (j == 'valid_items') continue;
				if (j == 'drop_tip') continue;
				if (j == 'get_tooltip') continue;
				if (j == 'proximity_override') continue;

				verb[j] = v[j];
			}

			if (stack.getVerbLabel) verb.label = stack.getVerbLabel(pc, i);
			if (!verb.label) verb.label = v.name;
			verb.enabled = ret.disabled ? false : true;
			verb.disabled_reason = (ret.disabled && ret.tooltip) ? ret.tooltip : '';
			verb.tooltip = ret.tooltip;
			verb.effects = ret.effects_simple;
			
			if (stack.class_id == 'bag_furniture_sdb' && i == 'remove') {
				verb.requires_target_item_count = true;
				verb.target_item_class = stack.class_type;
				verb.target_item_class_max_count = stack.countItemClass(stack.class_type);
			} else if (stack.class_id == 'bag_butler' && (i == 'give' || i == 'leave_package')) {
				// TODO move limit_target_count_to_stack_count and limit_target_count_to_stackmax to god verb pages and the item publisher
				
				//verb.limit_target_count_to_stack_count = true; // limits the count chooser to the count of the stack the user chooses
				verb.limit_target_count_to_stackmax = true; // limits the count chooser to stackmax of the class of the stack the user chooses
			}

			if (v.is_emote){
				// Emote verbs are automatically disabled in this context
				verb.enabled = false;
				verb.disabled_reason = 'Click on a player to do this';
				verb.tooltip = verb.disabled_reason;
				rsp.itemDef.emote_verbs[i] = verb;
			}else{
				rsp.itemDef.verbs[i] = verb;
			}
		}
		pc.apiSendMsg(rsp);
	}else{
		pc.apiSendMsg(make_fail_rsp(msg, 0, "can't find stack"));
	}
}

function doVerbCancel(pc, msg){
	var tsid = msg.itemstack_tsid;
	var stack = null;

	if (pc.location.items[tsid]){
		stack = pc.location.items[tsid];
	}else{
		var pc_items = pc.getAllContents();
		
		if (pc_items[tsid]){
			stack = pc_items[tsid];
		}	
		else{
			// it might be a trophy/furniture
			pc_items = pc.furniture_get_hidden();
			if (pc_items[tsid]){
				stack = pc.apiLockStack(pc_items[tsid].path);
				if (!stack.is_trophy && !stack.has_parent('furniture_base')){
					stack = null;
				}
			}
		}
	}

	if (stack){
		if (stack.onInteractionEnding) stack.onInteractionEnding(pc);
		pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		pc.apiSendMsg(make_fail_rsp(msg, 0, "can't find stack"));
	}
}

function doGetItemDefs(pc, msg) {
	var rsp = make_rsp(msg);
	rsp.success = true;
	rsp.items={};
	var tsids=msg.tsids;

	for(var n in tsids){
		var tsid = tsids[n];
		var itemProto = findItemPrototype(tsid);
		rsp.items[tsid]=itemProto.itemDef;
	} 
	log.info(rsp);
	pc.apiSendMsg(rsp);
}

function doSync(pc, msg) {
	var rsp = make_rsp(msg);
	rsp.itemstacks={pc:{},location:{}};
	var items = pc.getAllContents();
	for(var n in items){
		var it = items[n];
		rsp.itemstacks.pc[n]={
			count: it.count,
			class_tsid: it.type,
			label: it.label,
			slot: it.slot,
			path_tsid: it.path
		};
	} 
	
	items = pc.location.items;
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
	//log.info("itemstack_sync",rsp);
	pc.apiSendMsg(rsp);
}

function doReplaceGeometry(pc, msg){
	log.info(pc+' doReplaceGeometry: '+pc.location.tsid);

	//if (msg.new_loco_deco && pc.tsid != 'P001') {
	//	pc.apiSendMsgAsIs(make_fail_rsp(msg, 0, "Only eric can save locations right now"));
	//	return;
	//}


	//
	// streets based on upgrade templates cannot be edited
	//

	if (pc.location.upgrade_tree){
		pc.apiSendMsgAsIs(make_fail_rsp(msg, 0, "Upgradeable streets cannot be edited"));
		return;
	}
	

	//
	// transform signpost and door connections into objrefs
	//
	
	for (var i in msg.location.layers.middleground.signposts){	
		var conns = msg.location.layers.middleground.signposts[i].connects;
		for (var n in conns){
			var c = conns[n];

			var st_tsid = c.street_tsid;
			delete c.label;
			delete c.street_tsid;
			c.target = st_tsid ? apiFindObject(st_tsid) : null;
		}
	}

	for (var i in msg.location.layers.middleground.doors){
		var c = msg.location.layers.middleground.doors[i].connect;

		var st_tsid = c.street_tsid;
		delete c.label;
		delete c.street_tsid;
		c.target = st_tsid ? apiFindObject(st_tsid) : null;
	}


	//
	// make sure we do not persist anything in temp, in case the client send it back (it shouldn't)
	//

	if (msg.location.temp) {
		delete msg.location.temp;
	}


	//
	// save new geo
	//
	
	pc.location.geometry.apiReplaceDynamic(msg.location);
	pc.location.geo_edit_log(pc.tsid+':'+pc.label, 'locodeco-replace');

	pc.apiSendMsgAsIs(make_ok_rsp(msg));
}


function test(pc){
	var msg = {
		type:'drawdots',
		coords:pc.location.nodes
	};
	pc.apiSendMsgAsIs(msg);
}


//
// send an IM message
//

function doSendIM(pc, msg){

	var rsp = make_rsp(msg);
	var txt = utils.trim(msg.txt);
	var filtered_txt = utils.filter_chat(msg.txt);
	rsp.txt = filtered_txt;

	// Is this an item we are sending to?
	// http://wiki.tinyspeck.com/wiki/SpecItemIM
	if (msg.itemstack_tsid){
		var target = apiFindObject(msg.itemstack_tsid);
		if (!target){
			rsp.success = false;
			rsp.reason = 'an unknown item';
			return pc.apiSendMsg(rsp);
		}


		apiLogAction('ITEM_IM', 'pc='+pc.tsid, 'target='+target.tsid, 'msg='+msg.txt);


		//
		// Does this item support IMing?
		//

		if (!target.onIMRecv){
			rsp.success = false;
			rsp.reason = "an unsupported item";
			return pc.apiSendMsg(rsp);
		}


		//
		// Send success (most do this before we send it to the item, so order is correct in client)
		//

		rsp.success = true;
		pc.apiSendMsg(rsp);

		//
		// Send it
		//

		target.onIMRecv(pc, msg);

		return;
	}
	
	//
	// can't send an IM to ourselves
	//

	if (msg.pc_tsid == pc.tsid){
		rsp.success = false;
		rsp.reason = 'self';
		return pc.apiSendMsg(rsp);
	}

	//
	// check it's not a slash command
	//

	if (txt.substr(0,1) == '/'){
		rsp.success = false;
		rsp.reason = 'unknown command';
		return pc.apiSendMsg(rsp);
	}

	//
	// get target player
	//

	var target = getPlayer(msg.pc_tsid);
	if (!target){
		rsp.success = false;
		rsp.reason = 'an unknown user';
		return pc.apiSendMsg(rsp);
	}
	
	apiLogAction('IM', 'pc='+pc.tsid, 'target='+target.tsid, 'msg='+msg.txt);
	
	if (pc.buddies_is_ignored_by(target)){
		rsp.success = false;
		rsp.reason = 'ignoring you';
		return pc.apiSendMsg(rsp);
	}
	
	if (pc.buddies_is_ignoring(target)){
		rsp.success = false;
		rsp.reason = 'on your ignore list';
		return pc.apiSendMsg(rsp);
	}

	if (!apiIsPlayerOnline(target.tsid)){
		rsp.success = false;
		rsp.reason = 'offline';
		return pc.apiSendMsg(rsp);
	}


	//
	// send message to target player
	//

	var evt_msg = {
		type: 'im_recv',
		pc: pc.make_hash(),
		txt: filtered_txt,
	};
	
	target.apiSendMsgAsIs(evt_msg);
	target.performPostProcessing(evt_msg);
	
	pc.achievements_increment('talked_to', target.tsid);
	target.achievements_increment('talked_to', pc.tsid);

	rsp.success = true;
	return pc.apiSendMsg(rsp);
}

function doLocationLock(pc, msg){
	var rsp = make_rsp(msg);
	if (pc.apiLockCurrentLocationForEditing()){
		rsp.success = true;
		rsp.location = pc.location.prep_geometry();
		rsp.groups = ['LM411MNV6LQJ1'];
	}else{
		rsp.success = false;
	}
	pc.apiSendMsg(rsp);
}

function doLocationUnlock(pc, msg){
	pc.apiUnlockCurrentLocationForEditing();
	var rsp = make_rsp(msg);
	rsp.success = true;
	pc.apiSendMsg(rsp);
}

function doConversationChoice(pc, msg){

	if (msg.itemstack_tsid == config.familiar_tsid){

		pc.familiar_on_conversation(msg);
		pc.apiSendLocMsg({ type: "pc_itemstack_verb" });
		return;
	}

	if (msg.itemstack_tsid.substr(0, 9) == 'geo:door:'){

		pc.familiar_on_conversation(msg);
		pc.apiSendLocMsg({ type: "pc_itemstack_verb" });
		return;
	}
	
	if (msg.itemstack_tsid.substring(0,13) == 'transit:gate:'){

		pc.familiar_on_conversation(msg);
		pc.apiSendLocMsg({ type: "pc_itemstack_verb" });
		return;
	}

	var item = pc.location.apiLockStack(msg.itemstack_tsid);

	if (!item){
		var items = pc.getAllContents();
		if (items[msg.itemstack_tsid]) item = pc.apiLockStack(items[msg.itemstack_tsid].path);
	}

	if (!item){
		var rsp = make_fail_rsp(msg, 0, "can't find the itemstack to work with");
		return pc.apiSendMsg(rsp);
	}

	if (!item.onConversation){
		var rsp = make_fail_rsp(msg, 0, "item stack can't handle conversations");
		return pc.apiSendMsg(rsp);
	}

	try{
		log.info('starting conversation handling...');
		item.onConversation(pc, msg);
		log.info('conversation handling complete');
	}
	catch (e){
		log.error('Caught exception during conversation processing', e);
	}

	item.apiPutBack();

	pc.apiSendLocMsg({ type: "pc_itemstack_verb" });
}

function doConversationCancel(pc, msg){

	if (msg.itemstack_tsid == config.familiar_tsid){

		pc.familiar_on_conversation_cancel(msg);
		pc.apiSendLocMsg({ type: "pc_itemstack_verb" });
		return;
	}

	if (msg.itemstack_tsid.substr(0, 9) == 'geo:door:'){

		pc.familiar_on_conversation_cancel(msg);
		pc.apiSendLocMsg({ type: "pc_itemstack_verb" });
		return;
	}

	var tsid = msg.itemstack_tsid;
	var stack = null;
	
	var pc_items = pc.getAllContents();

	if (pc.location.items[tsid]){
		stack = pc.location.items[tsid];
	}else if (pc_items[tsid]){
		stack = pc_items[tsid];
	}
	else{
		// it might be a trophy/furniture
		pc_items = pc.furniture_get_hidden();
		if (pc_items[tsid]){
			stack = pc.apiLockStack(pc_items[tsid].path);
			if (!stack.is_trophy && !stack.has_parent('furniture_base')){
				stack = null;
			}
		}
	}

	if (stack){
		if (stack.fsm_event_notify) stack.fsm_event_notify('conversation_cancel', {'pc': pc, 'msg': msg});
		if (stack.onConversationEnding) stack.onConversationEnding(pc);
		if (stack.onInteractionEnding) stack.onInteractionEnding(pc);
		pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		pc.apiSendMsg(make_fail_rsp(msg, 0, "can't find stack"));
	}	
}

function doNoteClose(pc, msg){
	var note = apiFindObject(msg.itemstack_tsid);
	if (note && (typeof note.onNoteClose == 'function')){
		note.onNoteClose(pc);
	}

	pc.apiSendMsg(make_ok_rsp(msg));
}

function doEndTeleportMove(pc, msg){

	var move_data = pc["!teleport_move_data"];
    delete pc["!teleport_move_data"];

	var old_loc = move_data.old_loc;
	var new_loc = pc.location;

	//
	// Call the player's java code to make end of the move arrangements
	//
	if (old_loc) pc.apiEndLocationMoveX(old_loc);

	var rsp = make_ok_rsp(msg);
	rsp.location = make_location(new_loc, pc);
	rsp.teleportation = pc.teleportation_get_status();
	rsp.previous_location = pc.houses_get_previous_location_client();
	rsp.is_dead = pc.is_dead;
	delete pc['!teleporting'];
	pc.apiSendMsg(rsp);

	var ev = {
		type: "pc_teleport_move",
		pc: pc.make_hash_with_location()
	};

	if (old_loc) old_loc.apiSendMsg(ev);
	pc.apiSendLocMsgX(ev);

	if (pc.tp_queue){
		var item = pc.tp_queue.shift();
		if (item) pc.teleportToLocationDelayed(item.tsid, item.x, item.y, item.args);
	}
}

function doBuddyAdd(pc, msg){

	if (msg.pc_tsid){
		var ret = pc.addToBuddyGroup(msg.group_id, msg.pc_tsid);
	}else{
		var ret = 'no player specified';
	}

	if (ret != 'ok'){
		pc.apiSendMsg(make_fail_rsp(msg, 1, ret));
	}else{
		var rsp = make_ok_rsp(msg);
		rsp.pc = getPlayer(msg.pc_tsid).make_hash_with_location();
		apiLogAction('ADD_BUDDY', 'pc='+pc.tsid, 'group='+msg.group_id, 'target='+msg.pc_tsid);
		pc.apiSendMsg(rsp);
	}
}

function doBuddyRemove(pc, msg){

	if (msg.pc_tsid){
		var ret = pc.removeBuddy(msg.pc_tsid);
	}else{
		var ret = 'no player specified';
	}

	if (ret != 'ok'){
		pc.apiSendMsg(make_fail_rsp(msg, 1, ret));
	}else{
		apiLogAction('REMOVE_BUDDY', 'pc='+pc.tsid, 'target='+msg.pc_tsid);
		pc.apiSendMsg(make_ok_rsp(msg));
	}
}

function doPartyInvite(pc, msg){

	if (msg.pc_tsid){
		pc.party_invite(apiFindObject(msg.pc_tsid));
		pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		pc.apiSendMsg(make_fail_rsp(msg, 1, "No player specified"));
	}
}

function doPartyLeave(pc, msg){

	pc.party_leave();
	pc.apiSendMsg(make_ok_rsp(msg));
}

function doPing(pc, msg){
	var rsp = make_ok_rsp(msg);
	rsp.ts = time();
	pc.apiSendMsg(rsp);
}


function erictest(pc, words){
	// default
	var msg = {
		type: 'server_message',
		action: 'CLOSE',
		msg: 'TIMEOUT'
	};

	if (words[1] && words[1] == 'reconnect') {
		var msg = {
			type: 'server_message',
			action: 'RECONNECT',
			msg: 'small-a.hellovetica.com:444'
		};
	}
	pc.apiSendMsgAsIs(msg);
}

//
// this is a helper function to find a stack to work with. more
// functions should probably be using this. probably want to
// rework it to only optionally take the stack out of its location.
//
function getTargetStack(pc, msg, lock){
	// In location?
	var item = pc.location.apiLockStack(msg.itemstack_tsid);

	if (!item){
		// In inventory?
		var items = pc.getAllContents();
		if (items[msg.itemstack_tsid]){
			item = pc.apiLockStack(items[msg.itemstack_tsid].path);
		}
		else{
			
			// Ok, is it their private trophy storage?
			var hidden_bag = pc.trophies_find_container();
			var items = hidden_bag.getAllContents();
			if (items[msg.itemstack_tsid]){
				item = hidden_bag.removeItemStack(items[msg.itemstack_tsid].path);
			}
			else{
				// it might be a trophy/furniture
				items = pc.furniture_get_hidden();
				if (items[msg.itemstack_tsid]){
					item = pc.apiLockStack(items[msg.itemstack_tsid].path);
				}
				else{
					// In a bag in the location?
					var bags = pc.location.getBags();
					for (var i in bags){
						var b = bags[i];

						// TODO: Eventually support all bags in location
						if ((b.is_cabinet || b.is_trophycase) && b.isOwner(pc)){
							var bag_items = b.getAllContents();
							if (bag_items[msg.itemstack_tsid]){
								item = b.removeItemStack(bag_items[msg.itemstack_tsid].path);
								break;
							}
						}
					}
				}
			}
		}
	}

	if (!item){
		pc.apiSendMsg(make_fail_rsp(msg, 0, "can't find the itemstack to work with"));
	}

	if (!lock && item){
		item.apiPutBack();
	}

	return item;
}


function doMakeKnown(pc, msg){

	var item = getTargetStack(pc, msg, true);
	if (!item) return;

	if (!item.verbs[msg.verb] || !item.verbs[msg.verb].making || !item.verbs[msg.verb].making.slots){
		item.apiPutBack();
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "not a making verb"));
	}
	
	apiLogAction('MAKE_KNOWN', 'pc='+pc.tsid, 'recipe='+msg.recipe, 'count='+msg.count);
	
	var ret = pc.making_make_known(msg, item);
	item.apiPutBack();

	return ret;
}

function doMakeUnknown(pc, msg){

	var item = getTargetStack(pc, msg, true);
	if (!item) return;

	if (!item.verbs[msg.verb].making.slots){
		item.apiPutBack();
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "not a making verb"));
	}
	
	apiLogAction('MAKE_UNKNOWN', 'pc='+pc.tsid, 'inputs='+msg.inputs);
	
	var ret = pc.tryToMake(msg, item);
	item.apiPutBack();

	return ret;
}

function doRecipeRequest(pc, msg){
	var rsp = make_ok_rsp(msg);

	var ret = pc.making_recipe_request(msg);

	for (var i in ret){
		rsp[i] = ret[i];
	}

	return pc.apiSendMsg(rsp);
}

function doStoreBuy(pc, msg){

	var item = getTargetStack(pc, msg, true);
	if (!item) return;

	if (item.getStoreInfo && item.sellItem){
		apiLogAction('STORE_BUY', 'pc='+pc.tsid, 'store=item_'+item.tsid, 'item_class='+msg.class_tsid, 'count='+msg.count);
		
		var ret = item.sellItem(pc, msg);
	}
	else{
		var store_id = pc.storeGetID(item, msg.verb);
		if (!store_id){
			item.apiPutBack();
			return pc.apiSendMsg(make_fail_rsp(msg, 0, "Oops. Something went wrong with that store."));
		}
		
		apiLogAction('STORE_BUY', 'pc='+pc.tsid, 'store='+store_id, 'item_class='+msg.class_tsid, 'count='+msg.count);
		
		var ret = pc.storeBuy(msg, item);
	}

	item.apiPutBack();
	return ret;
}

function doStoreSell(pc, msg){

	var item = getTargetStack(pc, msg, true);
	if (!item) return;

	var store_id = pc.storeGetID(item, msg.verb);
	if (!store_id){
		item.apiPutBack();
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Oops. Something went wrong with that store."));
	}
	
	apiLogAction('STORE_SELL', 'pc='+pc.tsid, 'store='+store_id, 'item_class='+msg.sellstack_class, 'count='+msg.count);
	
	var ret = pc.storeSell(msg, item);
	item.apiPutBack();

	return ret;
}

function doStoreSellCheck(pc, msg){

	var item = getTargetStack(pc, msg, true);
	if (!item) return;

	var store_id = pc.storeGetID(item, msg.verb);
	if (!store_id){
		item.apiPutBack();
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "not a store verb"));
	}

	var ret = pc.storeSellCheck(msg, item);
	item.apiPutBack();

	return ret;
}

function doItemstackInvoke(pc, msg){
	var pc_items = pc.getAllContents();
	var stack = pc_items[msg.tsid];
	
	if (!stack) {
		return pc.apiSendMsg(make_fail_rsp(msg, 0, 'unknown stack'));
	}
	
	if (!stack.createProtoItem) {
		return pc.apiSendMsg(make_fail_rsp(msg, 1, stack.class_tsid+' not invoking (no createProtoItem)'));
	}
	
	if (!stack.createProtoItem(pc, msg.x, msg.y, msg.pl_tsid)) {
		return pc.apiSendMsg(make_fail_rsp(msg, 1, stack.class_tsid+' createProtoItem() failed'));
	}
	
	stack.apiDelete();
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doCreateItem(pc, msg){

	try {
		var item = apiNewItemStack(msg.item_class, msg.count || 1);
		var x = intval(msg.x);
		var y = intval(msg.y);
		if (isNaN(x)) x = pc.x;
		if (isNaN(y)) y = pc.y;
		pc.location.apiPutItemIntoPosition(item, x, y);
		log.info(pc+' created item '+item+' in '+pc.location);

		pc.apiSendLocMsg({ type: 'location_event' });
	
		if (msg.props != null){ 	
			
			if (!item.instanceProps){
 				item.instanceProps = {};
 			}
 	
 			for (var i in msg.props){
 	
 				if (msg.props[i] == null){
 					delete item.instanceProps[i];
 				} else {
 					item.instanceProps[i] = msg.props[i];
 				}
 			}
 	
 			if (item.onPropsChanged) item.onPropsChanged();
 			if (item.state) item.broadcastState();	
 		}
 		
		return pc.apiSendMsg(make_ok_rsp(msg));

	} catch (e){
		return pc.apiSendMsg(make_fail_rsp(msg, 0, 'failed '+e));
	}
}

function doModifyItem(pc, msg){
	if (!pc.is_god && !pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	var item = pc.location.apiLockStack(msg.itemstack_tsid);

	if (!item) return pc.apiSendMsg(make_fail_rsp(msg, 0, "can't find the itemstack to work with"));
	
	var merge = true;
	if (msg.no_merge === true) {
		merge = false;
	}
	
	if (config.is_dev) {
		pc.location.apiPutItemIntoPosition(item, msg.x, msg.y, merge);
	} else {	
		pc.location.apiPutItemIntoPosition(item, msg.x, msg.y);
	}

	if (pc.location.tsid == pc.houses_get_interior_tsid() || pc.location.tsid == pc.houses_get_tower_tsid()){
		delete item.house_lock;
		var pl = pc.location.apiGetClosestPlatformLineBelow(msg.x, intval(msg.y)-1);
		if (pl){
			// Platline needs to have x1,y1 in the upper-left
			if (pl.y2 < pl.y1){
				pl = {
					x1: pl.x2,
					y1: pl.y2,
					x2: pl.x1,
					y2: pl.y1
				};
			}

			var plats = pc.location.geo_find_plats(pl.x1, pl.y1, pl.x2, pl.y2);
			for (var i in plats){
				if (plats[i].source){
					item.house_lock = true;
					if (pc.growl_plat_locks) pc.sendActivity(item.name_single+' locked to furniture plat');
				}
			}
		}
	}

	if (msg.s != null && pc.is_god){
		item.state = msg.x;
		item.broadcastState();
	}

	if (msg.props != null && pc.is_god){

		if (!item.instanceProps){
			item.instanceProps = {};
		}

		for (var i in msg.props){

			if (msg.props[i] == null){

				delete item.instanceProps[i];
			}else{
				item.instanceProps[i] = msg.props[i];
			}
		}

		if (item.onPropsChanged) item.onPropsChanged();
		if (item.state) item.broadcastState();
	}

	if (item.onModify) item.onModify();
	
	item.apiPutBack();

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doInspectItem(pc, msg){
	var item = pc.location.apiLockStack(msg.itemstack_tsid);

	if (!item){
		pc.apiSendMsg(make_fail_rsp(msg, 0, "can't find the itemstack to work with"));
	}

	var msg = make_ok_rsp(msg);


	// attach props
	if (item.instanceProps){
		msg.props = item.instanceProps;
	}else{
		msg.props = {};
	}

	item.apiPutBack();

	return pc.apiSendMsg(msg);
}

function doStatusItem(pc, msg){

	var item = getTargetStack(pc, msg, false);
	if (!item) return;

	var msg = make_ok_rsp(msg);
	msg.status = item.onStatus(pc);

	return pc.apiSendMsg(msg);
}

function doAdminLocRequest(pc, msg){
	
	var street = apiFindObject(msg.location_tsid);
	if (!street) return;
	
	var msg = make_ok_rsp(msg);
	msg.location = street.prep_geometry();

	return pc.apiSendMsg(msg);
}

function doOverlayDismissed(pc, msg){
	if (msg.dismiss_payload.skill_package){
		pc.location.overlay_dismiss(pc.tsid+'-'+msg.dismiss_payload.skill_package+'-all')
		pc.cancelSkillPackage();
	}
	
	if (msg.dismiss_payload.item_tsids){
		for (var i in msg.dismiss_payload.item_tsids){
			var item_tsid = msg.dismiss_payload.item_tsids[i];
			msg.itemstack_tsid = item_tsid;
		
			var item = getTargetStack(pc, msg, false);
			if (!item) return;
		
			if (item.onOverlayDismissed) item.onOverlayDismissed(pc, msg.dismiss_payload);
		}
		
		return pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		pc.apiSendMsg(make_fail_rsp(msg, 0, "don't know what to do with that"));
	}
}


function doOverlayDone(pc, msg){
	if (msg.done_payload.overlay_script_name){
		
		var overlay_script_name = msg.done_payload.overlay_script_name;
	
		var rsp;
		if (pc.run_overlay_done_script(overlay_script_name)) {
			rsp = make_ok_rsp(msg);
		} else {
			rsp = make_fail_rsp(msg, 0, "could not run done script for "+overlay_script_name);
		}
		
		return pc.apiSendMsg(rsp);
	
	}
	else if (msg.done_payload.location_script_name){
		
		var overlay_script_name = msg.done_payload.location_script_name;
	
		var rsp;
		if (pc.location[overlay_script_name] && pc.location[overlay_script_name](pc)) {
			rsp = make_ok_rsp(msg);
		} else {
			rsp = make_fail_rsp(msg, 0, "could not run done location script for "+overlay_script_name);
		}
		
		return pc.apiSendMsg(rsp);
	
	}
	else if (msg.done_payload.quest_name){
		pc.quests_offer(msg.done_payload.quest_name, true);
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	else if (msg.done_payload.function_name){
		if (pc[msg.done_payload.function_name]) pc[msg.done_payload.function_name]();
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	else if (msg.done_payload.location_callback){
		if (pc.location[msg.done_payload.location_callback]){
			pc.location[msg.done_payload.location_callback](msg.done_payload);
			return pc.apiSendMsg(make_ok_rsp(msg));
		}
	}
	else if (msg.done_payload.quest_callback) {
		log.info("Received quest callback overlay response "+msg);
		pc.location.quests_do_callback(pc, msg.done_payload.quest_callback, msg.done_payload);
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	else if (msg.done_payload.event_location){
		if (pc.location.tsid == msg.done_payload.event_location){
			pc.location.events_broadcast(msg.done_payload.event_name, {target_pc: pc});
		}		
	} else if (msg.done_payload.location_event){
		pc.location.events_broadcast(msg.done_payload.location_event, {target_pc:pc});
		return pc.apiSendMsg(make_ok_rsp(msg));		
	} else {
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "don't know what to do with that"));
	}
}

function doOverlayClick(pc, msg) {
	if (!msg.click_payload) {
		return pc.apiSendMsg(make_ok_rsp(msg));
	} else if (msg.click_payload.itemstack_tsids){
		for (var i in msg.click_payload.itemstack_tsids){
			var item_tsid = msg.click_payload.itemstack_tsids[i];
			var item = apiFindObject(item_tsid);
		
			if (item.onOverlayClicked) {
				log.info("Passing overlay click to "+item+" from "+pc);
				item.onOverlayClicked(pc, msg.click_payload);			
			}
		}

		return pc.apiSendMsg(make_ok_rsp(msg));
	} else if (msg.click_payload.pc_callback){
		if (pc[msg.click_payload.pc_callback]){
			pc[msg.click_payload.pc_callback](msg.click_payload);
			return pc.apiSendMsg(make_ok_rsp(msg));
		}
	} else if (msg.click_payload.location_callback){
		if (pc.location[msg.click_payload.location_callback]){
			pc.location[msg.click_payload.location_callback](msg.click_payload);
			return pc.apiSendMsg(make_ok_rsp(msg));
		}
	} else if (msg.click_payload.quest_callback) {
		pc.location.quests_do_callback(pc, msg.click_payload.quest_callback, msg.click_payload);
		return pc.apiSendMsg(make_ok_rsp(msg));		
	}

	return pc.apiSendMsg(make_fail_rsp(msg, 0, "don't know what to do with that"));
}

function doScreenViewClose(pc, msg){
	
	if (msg.close_payload && msg.close_payload.itemstack_tsid){
		msg.itemstack_tsid = msg.close_payload.itemstack_tsid;
		
		var item = getTargetStack(pc, msg, false);
		if (!item) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Could not find the itemstack to work with"));

		if (!msg.close_payload.callback) return pc.apiSendMsg(make_fail_rsp(msg, 0, "No callback specified"));
		if (!item[msg.close_payload.callback]) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Item cannot handle that callback"));
		
		item[msg.close_payload.callback](pc, msg);
		
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	else if (msg.close_payload && msg.close_payload.location_script_name){
		var location_script_name = msg.close_payload.location_script_name;
	
		var rsp;
		if (pc.location[location_script_name] && pc.location[location_script_name](pc)) {
			rsp = make_ok_rsp(msg);
		} else {
			rsp = make_fail_rsp(msg, 0, "could not run done location script for "+location_script_name);
		}
		
		return pc.apiSendMsg(rsp);
	}else{
		pc.apiSendMsg(make_fail_rsp(msg, 0, "don't know what to do with that"));
	}
}

function getPlayerBag(pc, tsid){
	if (!tsid || tsid == pc.tsid){
		// Starting from the player?
		return pc;
	}
	
	// Starting from a bag in the player's inventory?
	function is_bag(it, item_tsid){ return it.is_bag && it.tsid == item_tsid ? true : false; }
	var player_bag = pc.findFirst(is_bag, tsid);
	
	if (player_bag){
		return player_bag;
	}

	// How about a cabinet/trophy case in the location?
	// TODO: Eventually support all bags in location
	var location_bag = pc.location.items[tsid];
	if (location_bag && (location_bag.is_cabinet || location_bag.is_trophycase) && location_bag.isOwner(pc)){
		return location_bag;
	}
	
	// Ok, is it their private trophy storage?
	var hidden_bag = pc.trophies_find_container();
	if (hidden_bag.tsid == tsid){
		return hidden_bag;
	}
	
	return;
}

function doInventoryMove(pc, msg){
	var from_bag = getPlayerBag(pc, msg.from_path_tsid);	
	if (!from_bag) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Invalid from path"));
	
	var items = from_bag.getFlatContents();
	if (!items[msg.itemstack_tsid]) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Invalid from item"));
	
	var item = from_bag.removeItemStack(items[msg.itemstack_tsid].path, msg.count);
	if (!item) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Invalid from item"));
	var count = item.count;
	
	var to_bag = getPlayerBag(pc, msg.to_path_tsid);
	//var to_bag = (msg.to_path_tsid) ? apiFindObject(msg.to_path_tsid) : pc;
	if (!to_bag) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Invalid to bag"));
	
	if (!to_bag.canContain(item)){
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Can't store that"));
	}

	var can_pickup = true;
	if ((item.getContainerType() == 'street' || item.container.is_cabinet) && item.takeable_pickup_conditions){
		var ret = item.takeable_pickup_conditions(pc);
		if (ret.state != 'enabled') can_pickup = false;
	}
	else if (item.getContainerType() == 'street' || item.container.is_cabinet){
		can_pickup = false;
	}

	// Furniture cannot be "picked up" because it only goes in the furn bag, and we handle that later
	if (item.has_parent('furniture_base')) can_pickup = false;

	if (!can_pickup) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You can't pick that up"));
	
	//log.info('Moving '+item+' to slot '+msg.to_slot+' in bag '+to_bag+' from bag '+from_bag);
	var remaining = to_bag.addItemStack(item, msg.to_slot, pc);
	if (remaining != count){
		var rsp = make_ok_rsp(msg);
		
		if (remaining){
			item.apiPutBack();
		}
	}
	else{
		var rsp = make_fail_rsp(msg, 0, "Nothing stored remaining:"+remaining+" count:"+count);
		item.apiPutBack();
	}
	
	// Moving from a player bag?
	if (from_bag.is_player || from_bag.getContainerType() != 'street'){
		if (to_bag.getContainerType && to_bag.getContainerType() == 'street'){
			pc.items_removed(item);
		}
	}
	else if (to_bag.is_player || to_bag.getContainerType() != 'street'){
		if (from_bag.getContainerType && from_bag.getContainerType() == 'street'){
			pc.items_added(item);
		}
	}
	
	return pc.apiSendMsg(rsp);
}

function doLocationMove(pc, msg){
	//var from_bag = getPlayerBag(pc, msg.from_path_tsid);	
	//if (!from_bag) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Invalid from path"));
		
	var item = pc.location.apiLockStack(msg.itemstack_tsid);
	if (!item) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Invalid from item"));

	if (msg.count < item.count){
		var new_stack = item.apiSplit(msg.count);
		item.apiPutBack();
		item = new_stack;
	}

	var count = item.count;
	
	var to_bag = getPlayerBag(pc, msg.to_path_tsid);
	//var to_bag = (msg.to_path_tsid) ? apiFindObject(msg.to_path_tsid) : pc;
	if (!to_bag) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Invalid to bag"));
	
	if (!to_bag.canContain(item)){
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Can't store that"));
	}
	
	//log.info('Moving '+item+' to slot '+msg.to_slot+' in bag '+to_bag+' from bag '+from_bag);
	var remaining = to_bag.addItemStack(item, msg.to_slot, pc);
	if (remaining != count){
		var rsp = make_ok_rsp(msg);
		
		if (remaining){
			item.apiPutBack();
		}
	}
	else{
		var rsp = make_fail_rsp(msg, 0, "Nothing stored remaining:"+remaining+" count:"+count);
		item.apiPutBack();
	}
	
	return pc.apiSendMsg(rsp);
}

function doLocationDragTargets(pc, msg){
	var stack = getTargetStack(pc, msg, false);
	if (!stack) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Invalid itemstack_tsid"));
	
	var loc_items = pc.location.getItems();
	
	var rsp = getDroppableItemstacks(pc, msg, loc_items, stack);
	
	return pc.apiSendMsg(rsp);
}

function doInventoryDragTargets(pc, msg){
	var stack = getTargetStack(pc, msg, false);
	if (!stack) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Invalid itemstack_tsid"));
	
	var inv_items = pc.getAllContents();
	
	var rsp = getDroppableItemstacks(pc, msg, inv_items, stack);
	
	return pc.apiSendMsg(rsp);
}

function getDroppableItemstacks(pc, msg, items, stack){
	var rsp = make_ok_rsp(msg);
	rsp.items = {};
	rsp.itemstacks = {};
	rsp.trophycases = [];
	rsp.bags_new = {};
	rsp.cabinets_new = {};

	var can_pickup = true;
	if ((stack.getContainerType() == 'street' || stack.container.is_cabinet) && stack.takeable_pickup_conditions){
		var ret = stack.takeable_pickup_conditions(pc);
		if (ret.state != 'enabled') can_pickup = false;
	}
	else if (stack.getContainerType() == 'street' || stack.container.is_cabinet){
		can_pickup = false;
	}

	// Furniture cannot be "picked up" because it only goes in the furn bag, and we handle that later
	if (stack.has_parent('furniture_base')) can_pickup = false;

	if (pc.canContain(stack) && can_pickup){
		rsp.bags_new[pc.tsid] = {
			"tip": "Pick up",
			"disabled": false
		};
	}
	else{
		rsp.bags_new[pc.tsid] = {
			"tip": "You can't pick that up",
			"disabled": true
		};
	}
	
	// If stack is currently in our display trophy case, add our private trophy storage
	if (stack.container && stack.container.is_trophycase){
		var hidden = pc.trophies_find_container();
		if (hidden.canContain(stack)){
			rsp.trophycases.push(hidden.tsid);
		}
	}

	if ((stack.is_trophy || stack.has_parent('furniture_base')) && pc.furniture && pc.furniture.storage_tsid){
		if (stack.canPickup){
			var ret = stack.canPickup(pc);
			if (!ret.ok){
				rsp.bags_new[pc.furniture.storage_tsid] = {
					"tip": ret.error ? ret.error : "You cannot pick this up",
					"disabled": true
				};
			}
		}

		if (stack.class_tsid == 'furniture_chassis' || stack.class_tsid == 'furniture_tower_chassis'){
			rsp.bags_new[pc.furniture.storage_tsid] = {
				"tip": "You cannot pick this up",
				"disabled": true
			};
		}
		
		if (!rsp.bags_new[pc.furniture.storage_tsid]){
			if ((!stack.is_bag || !stack.countContents()) && (stack.class_tsid != 'furniture_door' || (!stack.hasInProgressJob(pc) && stack.has_job)) && (!stack.isForSale || !stack.isForSale())){
				rsp.bags_new[pc.furniture.storage_tsid] = {
					"tip": "Pick up",
					"disabled": false
				};
			}
			else if (stack.is_bag && stack.countContents()){
				rsp.bags_new[pc.furniture.storage_tsid] = {
					"tip": "Empty it if you want to pick it up!",
					"disabled": true
				};
			}
			else if (stack.class_tsid == 'furniture_door' && (stack.hasInProgressJob(pc) || !stack.has_job)){
				rsp.bags_new[pc.furniture.storage_tsid] = {
					"tip": "Placed doors cannot be picked up",
					"disabled": true
				};
			}
			else if (stack.isForSale && stack.isForSale()){
				rsp.bags_new[pc.furniture.storage_tsid] = {
					"tip": "You have to stop selling that to pick it up",
					"disabled": true
				};
			}
		}

	}
	
	for (var i in items){
		var it = items[i];
		if (!it) continue;
		
		var item_location = "in_location";
		if (!it.isOnGround()) item_location = "in_pack";

		// Check distance
		if (item_location == 'in_location' && it.distanceFromPlayer(pc) > config.verb_radius){
			if (it.class_tsid != 'npc_fox') continue;
		}
		
		// Trophy cases are ok, as long as we are the owner
		if (it.is_trophycase && it.canContain(stack) && it.isOwner(pc) && !it.isBagFull(stack)){
			rsp.trophycases.push(it.tsid);
		}

		// No trophies or furniture past this point
		if (!stack.is_trophy && !stack.has_parent('furniture_base')){

			// If the takeable conditions say no, let's not pick it up
			if (!can_pickup) continue;
			
			// Bags are ok, assuming they're not on the ground and can contain the item stack
			if (!it.is_cabinet && it.class_tsid != 'bag_furniture_sdb'){
				if (it.isForSale && it.isForSale()){
					rsp.bags_new[it.tsid] = {
						"tip": "Stop selling <b>"+(it.getLabel ? it.getLabel() : it.label)+"</b> to add items to it",
						"disabled": true
					};
				}
				else if (it.is_bag && it.canContain(stack) && !it.isOnGround() && !it.isBagFull(stack)){
					rsp.bags_new[it.tsid] = {
						"tip": "Put in <b>"+(it.getLabel ? it.getLabel() : it.label)+"</b>",
						"disabled": false
					};
				}
				else if (it.is_bag && it.isOnGround()){
					rsp.bags_new[it.tsid] = {
						"tip": "Pick <b>"+(it.getLabel ? it.getLabel() : it.label)+"</b> up if you want to add to it",
						"disabled": true
					};
				}
				else if (it.is_bag && !it.canContain(stack)){
					rsp.bags_new[it.tsid] = {
						"tip": "<b>"+(it.getLabel ? it.getLabel() : it.label)+"</b> can't hold that",
						"disabled": true
					};
				}
				else if (it.is_bag && it.isBagFull(stack)){
					rsp.bags_new[it.tsid] = {
						"tip": "<b>"+(it.getLabel ? it.getLabel() : it.label)+"</b> is full",
						"disabled": true
					};
				}
			}
			
			// Cabinets are ok, as long as we are the owner
			if (it.isForSale && it.isForSale()){
				rsp.cabinets_new[it.tsid] = {
					"tip": "Stop selling <b>"+(it.getLabel ? it.getLabel() : it.label)+"</b> to add items to it",
					"disabled": true
				};
			}
			else if (it.is_cabinet && it.canContain(stack) && it.isOwner(pc) && !it.isBagFull(stack)){
				rsp.cabinets_new[it.tsid] = {
					"tip": "Put in <b>"+(it.getLabel ? it.getLabel() : it.label)+"</b>",
					"disabled": false
				};
			}
			else if (it.is_cabinet && !it.canContain(stack)){
				rsp.cabinets_new[it.tsid] = {
					"tip": "<b>"+(it.getLabel ? it.getLabel() : it.label)+"</b> can't hold that",
					"disabled": true
				};
			}
			else if (it.is_cabinet && !it.isOwner(pc)){
				rsp.cabinets_new[it.tsid] = {
					"tip": "You don't have permission to add to <b>"+(it.getLabel ? it.getLabel() : it.label)+"</b>",
					"disabled": true
				};
			}
			else if (it.is_cabinet && it.isBagFull(stack)){
				rsp.cabinets_new[it.tsid] = {
					"tip": "<b>"+(it.getLabel ? it.getLabel() : it.label)+"</b> is full",
					"disabled": true
				};
			}
			
			// Stacks coming from the ground can only go to bags
			if (stack.isOnGround() && it.class_tsid != 'bag_furniture_sdb') continue;
		}
		
		for (var v in it.verbs){
			var verb = it.verbs[v];
			
			// Is this verb ok in the item's location?
			var is_ok = 0;
			for (var j in verb.ok_states){
				if (verb.ok_states[j] == item_location) is_ok = 1;
			}
			if (!is_ok) continue;
			
			// Is this verb a drop target?
			if (verb.is_drop_target){
				var class_ok = true;
				if (verb.drop_ok_code){
					if (!verb.drop_ok_code.call(it, stack, pc)){
						class_ok = false;
					}
				}
				
				var stack_ok = false;
				var ret = {ok: true};
				if (verb.conditions){
					var condition = verb.conditions.call(it, pc, stack);
					if (condition['state'] == null){
						class_ok = false;
					}
					else if (condition['state'] != 'enabled'){
						ret['ok'] = false;
						ret['msg'] = condition['reason'];
						stack_ok = true;
					}
					else{
						stack_ok = true;
					}
				}
				
				var count = stack.count;
				if (!verb.drop_many) count = 1;
				var drop_tip = verb.drop_tip;
				if (drop_tip){
					drop_tip = drop_tip.replace(/{\$count}/, count);
					drop_tip = drop_tip.replace(/{\$stack_name}/, count == 1 ? stack.name_single : stack.name_plural);
					drop_tip = drop_tip.replace(/{\$item_name}/, it.name_single);
				}
				else{
					drop_tip = capitalize(verb.name) + ' this ' + it.name_single + ' with ' + pluralize(count, stack.name_single, stack.name_plural);
				}
				
				if (stack_ok && class_ok){
					rsp.itemstacks[it.tsid] = {
						verb:		v,
						disabled:	ret['ok'] ? false : true,
						just_one:	verb.drop_many ? false: true,
						tip:		ret['msg'] ? ret['msg'] : drop_tip,
					};
				}
				else if (class_ok){
					rsp.items[it.class_tsid] = {
						verb:		v,
						disabled:	false,
						just_one:	verb.drop_many ? false: true,
						tip:		drop_tip,
					};
				}
			}
		}
	}

	rsp.can_drop = true;
	if (stack.canDrop){
		var can_drop = stack.canDrop(pc);
		if (!can_drop['ok']){
			rsp.can_drop = false;
		}
	}
	
	return rsp;
}

function doEchoAnnc(pc, msg) {
	if (!pc.is_god) return;

	if (!msg.annc) {
		pc.sendActivity("You must provide an annc");
		return;
	}
	
	if (!msg.annc.type) {
		pc.sendActivity("You must specify a type");
		return;
	}
	
	// give it the user's tsid
	if (msg.annc.type == 'pc_overlay') {
		msg.annc.pc_tsid = pc.tsid;
	}
	
	if (msg.annc.swf_key) {
		msg.annc.swf_url = config.overlays_map[msg.annc.swf_key];
		
		if (!msg.annc.swf_url) {
			pc.sendActivity("unknown overlay:"+msg.annc.swf_key+" (did you publish?)");
			return;
		}
		
		delete msg.annc.swf_key;
	}

	pc.apiSendAnnouncement(msg.annc);
}

function doGroupsChat(pc, msg){

	apiLogAction('GROUP_CHAT', 'pc='+pc.tsid, 'group='+msg.tsid, 'msg='+msg.txt);

	var txt = utils.trim(msg.txt);

	if (txt.substr(0,1) == '/'){
		var words = txt.split(" ");

		var group = pc.groups_get(msg.tsid);
		if (group && words[0] == '/who'){
			pc.apiSendMsg({
				type: 'pc_groups_chat',
				tsid: msg.tsid,
				pc: { tsid: "god", label: "God" },
				txt: group.chat_get_roster_msg()
			});
			
			pc.apiSendMsg(make_ok_rsp(msg));
		}
		else if (group && words[0] == '/unmuted' && msg.tsid == 'RCRIG222NHV17I8'){
			var roster = group.chat_get_roster();

			var names = [];
			for (var i in roster){
				if (!roster[i].getProp('greeting_muted')) names.push(roster[i].label);
			}
			
			var rsp = "None.";
			if (names.length == 1){
				rsp = names[0]+" is available";
			}
			if (names.length > 1){
				rsp = pretty_list(names, ' and ')+" are available";
			}

			pc.apiSendMsg({
				type: 'pc_groups_chat',
				tsid: msg.tsid,
				pc: { tsid: "god", label: "God" },
				txt: rsp
			});
			
			pc.apiSendMsg(make_ok_rsp(msg));
		}
		else if (group && words[0] == '/muted' && msg.tsid == 'RCRIG222NHV17I8'){
			var roster = group.chat_get_roster();

			var names = [];
			for (var i in roster){
				if (roster[i].getProp('greeting_muted')) names.push(roster[i].label);
			}
			
			var rsp = "None.";
			if (names.length == 1){
				rsp = names[0]+" is muted";
			}
			if (names.length > 1){
				rsp = pretty_list(names, ' and ')+" are muted";
			}

			pc.apiSendMsg({
				type: 'pc_groups_chat',
				tsid: msg.tsid,
				pc: { tsid: "god", label: "God" },
				txt: rsp
			});
			
			pc.apiSendMsg(make_ok_rsp(msg));
		}
		else if (group && words[0] == '/free' && msg.tsid == 'RCRIG222NHV17I8'){
			var roster = group.chat_get_roster();

			var names = [];
			for (var i in roster){
				if (roster[i].isFreeGreeter()) names.push(roster[i].label);
			}
			
			var rsp = "None.";
			if (names.length == 1){
				rsp = names[0]+" is free";
			}
			if (names.length > 1){
				rsp = pretty_list(names, ' and ')+" are free";
			}

			pc.apiSendMsg({
				type: 'pc_groups_chat',
				tsid: msg.tsid,
				pc: { tsid: "god", label: "God" },
				txt: rsp
			});
			
			pc.apiSendMsg(make_ok_rsp(msg));
		}
		else if (group && words[0] == '/whoguides' && (in_array_real(msg.tsid, config.live_help_groups) || in_array_real(msg.tsid, config.newbie_live_help_groups)) && (pc.is_guide || pc.is_god || pc.is_help)){
			var roster = group.chat_get_roster();

			var names = [];
			for (var i in roster){
				if (roster[i] && roster[i].isGuideOnDuty()) names.push(utils.escape(roster[i].label));
			}
			
			var rsp = "None.";
			if (names.length == 1){
				rsp = names[0]+" is on duty";
			}
			if (names.length > 1){
				rsp = pretty_list(names, ' and ')+" are on duty";
			}

			pc.apiSendMsg({
				type: 'pc_groups_chat',
				tsid: msg.tsid,
				pc: { tsid: "god", label: "God" },
				txt: rsp
			});
			
			pc.apiSendMsg(make_ok_rsp(msg));
		}
		else if (group && words[0] == '/whostaff' && (in_array_real(msg.tsid, config.live_help_groups) || msg.tsid == 'RHV577DMP0A2QQ4' || in_array_real(msg.tsid, config.newbie_live_help_groups)) && (pc.is_guide || pc.is_god || pc.is_help)){
			var roster = group.chat_get_roster();

			var names = [];
			for (var i in roster){
				if (roster[i] && roster[i].make_hash().is_admin) names.push(utils.escape(roster[i].label));
			}
			
			var rsp = "None.";
			if (names.length == 1){
				rsp = names[0]+" is available";
			}
			if (names.length > 1){
				rsp = pretty_list(names, ' and ')+" are available";
			}

			pc.apiSendMsg({
				type: 'pc_groups_chat',
				tsid: msg.tsid,
				pc: { tsid: "god", label: "God" },
				txt: rsp
			});
			
			pc.apiSendMsg(make_ok_rsp(msg));
		}
		else if (group && words[0] == '/next' && (in_array_real(msg.tsid, config.live_help_groups) || in_array_real(msg.tsid, config.newbie_live_help_groups)) && (pc.is_guide || pc.is_god || pc.is_help)){
			pc.groups_chat_leave(msg.tsid);
			var current = 0;
			var all_groups = config.live_help_groups.concat(config.newbie_live_help_groups);
			for (var i=0; i<all_groups.length; i++){
				if (all_groups[i] == msg.tsid){
					current = i;
					break;
				}
			}

			//log.info("current: "+i);

			if (all_groups.length == current+1){
				var next = all_groups[0];
				var next_index = 0;
			}
			else{
				var next = all_groups[current+1];
				var next_index = current+1;
			}

			//log.info("next: "+next);

			pc.live_help_group = next;
			pc.apiSendMsg({
				type: 'groups_switch',
				old_tsid: msg.tsid,
				new_tsid: next
			})
			pc.groups_chat_join(next);

			pc.apiSendMsg({
				type: 'pc_groups_chat',
				tsid: next,
				pc: { tsid: "god", label: "God" },
				txt: "Now in channel "+(next_index+1)+' ('+(in_array_real(next, config.live_help_groups) ? 'regular' : 'newbie')+').'
			});
			
			pc.apiSendMsg(make_ok_rsp(msg));
		}
		else if (group && words[0] == '/channel' && (in_array_real(msg.tsid, config.live_help_groups) || in_array_real(msg.tsid, config.newbie_live_help_groups)) && (pc.is_guide || pc.is_god || pc.is_help)){
			var current = 0;
			var all_groups = config.live_help_groups.concat(config.newbie_live_help_groups);
			for (var i=0; i<all_groups.length; i++){
				if (all_groups[i] == msg.tsid){
					current = i;
					break;
				}
			}

			pc.apiSendMsg({
				type: 'pc_groups_chat',
				tsid: msg.tsid,
				pc: { tsid: "god", label: "God" },
				txt: "Now in channel "+(current+1)+' ('+(in_array_real(msg.tsid, config.live_help_groups) ? 'regular' : 'newbie')+').'
			});
			
			pc.apiSendMsg(make_ok_rsp(msg));
		}
		else{
			pc.apiSendMsg(make_fail_rsp(msg, 1, 'Unknown chat command'));
		}
		return;
	}

	if (msg.tsid == 'RDO6KPBS43M2GSS' && !pc.is_god){
		pc.apiSendMsg({
			type: 'pc_groups_chat',
			tsid: msg.tsid,
			pc: { tsid: "god", label: "God" },
			txt: "Sorry, you may not speak in this channel."
		});
		
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	
	pc.apiSendMsg(make_ok_rsp(msg));

	if (msg.tsid == 'RCRIG222NHV17I8'){
		utils.http_get('callbacks/log_help.php', {
			t: time(),
			tsid: pc.tsid,
			name: pc.label,
			msg: txt,
			channel: 'greeters',
			group_id: msg.tsid
		});
	}
	else if (msg.tsid == 'RHV577DMP0A2QQ4'){
		utils.http_get('callbacks/log_help.php', {
			t: time(),
			tsid: pc.tsid,
			name: pc.label,
			msg: txt,
			channel: 'guides',
			group_id: msg.tsid
		});
	}
	else if (in_array_real(msg.tsid, config.live_help_groups) || in_array_real(msg.tsid, config.newbie_live_help_groups)){
		if (pc.isInConeOfSilence('help')) return pc.sendActivity("Sorry, you're currently suspended from this chat.");

		utils.http_get('callbacks/log_help.php', {
			t: time(),
			tsid: pc.tsid,
			name: pc.label,
			msg: txt,
			channel: 'help_chat',
			group_id: msg.tsid
		});
	}
	else if (in_array_real(msg.tsid, config.global_chat_groups)){
		if (pc.isInConeOfSilence()) return pc.sendActivity("Sorry, you're currently suspended from this chat.");

		utils.http_get('callbacks/log_help.php', {
			t: time(),
			tsid: pc.tsid,
			name: pc.label,
			msg: txt,
			channel: 'global_chat',
			group_id: msg.tsid
		});
	}
	else if (in_array_real(msg.tsid, config.trade_chat_groups)){
		if (pc.isInConeOfSilence()) return pc.sendActivity("Sorry, you're currently suspended from this chat.");

		utils.http_get('callbacks/log_help.php', {
			t: time(),
			tsid: pc.tsid,
			name: pc.label,
			msg: txt,
			channel: 'trade',
			group_id: msg.tsid
		});
	}

	pc.groups_chat(msg.tsid, msg.txt);
}

function doGroupsChatJoin(pc, msg){
	log.info(pc.tsid+' '+msg);

	pc.apiSendMsg(make_ok_rsp(msg));
	pc.groups_chat_join(msg.tsid);
}

function doGroupsChatLeave(pc, msg){
	log.info(pc.tsid+' '+msg);

	pc.apiSendMsg(make_ok_rsp(msg));
	pc.groups_chat_leave(msg.tsid);
}

function doPromptChoice(pc, msg){

	pc.apiSendMsg(make_ok_rsp(msg));
	pc.prompts_choice(msg.uid, msg.value);
}

function doStartTrade(pc, msg){	
	var ret = pc.trading_request_start(msg.tsid);
	
	if (ret['ok']){
		var rsp = make_ok_rsp(msg);
	}
	else{
		var rsp = make_fail_rsp(msg, 1, ret['error']);
	}
	pc.apiSendMsg(rsp);
}

function doCancelTrade(pc, msg){	
	var ret = pc.trading_cancel(msg.tsid);
	
	if (ret['ok']){
		var rsp = make_ok_rsp(msg);
	}
	else{
		var rsp = make_fail_rsp(msg, 1, ret['error']);
	}
	pc.apiSendMsg(rsp);
}

function doTradeAddItem(pc, msg){	
	var ret = pc.trading_add_item(msg.tsid, msg.itemstack_tsid, msg.amount);
	
	if (ret['ok']){
		var rsp = make_ok_rsp(msg);
	}
	else{
		var rsp = make_fail_rsp(msg, 1, ret['error']);
	}
	pc.apiSendMsg(rsp);
}

function doTradeRemoveItem(pc, msg){	
	var ret = pc.trading_remove_item(msg.tsid, msg.itemstack_tsid, msg.amount);
	
	if (ret['ok']){
		var rsp = make_ok_rsp(msg);
	}
	else{
		var rsp = make_fail_rsp(msg, 1, ret['error']);
	}
	pc.apiSendMsg(rsp);
}

function doTradeChangeItem(pc, msg){	
	var ret = pc.trading_change_item(msg.tsid, msg.itemstack_tsid, msg.amount);
	
	if (ret['ok']){
		var rsp = make_ok_rsp(msg);
	}
	else{
		var rsp = make_fail_rsp(msg, 1, ret['error']);
	}
	pc.apiSendMsg(rsp);
}

function doTradeCurrants(pc, msg){	
	var ret = pc.trading_update_currants(msg.tsid, msg.amount);
	
	if (ret['ok']){
		var rsp = make_ok_rsp(msg);
	}
	else{
		var rsp = make_fail_rsp(msg, 1, ret['error']);
	}
	pc.apiSendMsg(rsp);
}

function doTradeAccept(pc, msg){	
	var ret = pc.trading_accept(msg.tsid);
	
	if (ret['ok']){
		var rsp = make_ok_rsp(msg);
	}
	else{
		var rsp = make_fail_rsp(msg, 1, ret['error']);
	}
	pc.apiSendMsg(rsp);
}

function doTradeUnlock(pc, msg){	
	var ret = pc.trading_unlock(msg.tsid);
	
	if (ret['ok']){
		var rsp = make_ok_rsp(msg);
	}
	else{
		var rsp = make_fail_rsp(msg, 1, ret['error']);
	}
	pc.apiSendMsg(rsp);
}

function doSkillsCanLearn(pc, msg){
	var rsp = make_ok_rsp(msg);

	rsp.skills = pc.skills_learnable_list(msg.new_style, msg.include_unlearned);

	return pc.apiSendMsg(rsp);
}

function doUnlearnCancel(pc, msg) {
	var rsp = make_ok_rsp(msg);

	pc.skills_cancel_unlearning();
	
	return pc.apiSendMsg(rsp);
}

function doTeleportationSet(pc, msg){
	var ret = pc.teleportation_set_target(msg.teleport_id);
	
	if (ret['ok']){
		var rsp = make_ok_rsp(msg);
		rsp.status = pc.teleportation_get_status();
	}
	else{
		var rsp = make_fail_rsp(msg, 1, ret['error']);
	}
	pc.apiSendMsg(rsp);
}

function doTeleportationGo(pc, msg){
	var ret = pc.teleportation_teleport(msg.teleport_id);

	if (ret['ok']){
		var rsp = make_ok_rsp(msg);
	}
	else{
		var rsp = make_fail_rsp(msg, 1, ret['error']);
	}
	pc.apiSendMsg(rsp);
}

function doTeleportationMap(pc, msg){
	var ret = pc.teleportation_map_teleport(msg.loc_tsid, msg.is_token);

	if (ret['ok']){
		var rsp = make_ok_rsp(msg);
	}
	else{
		var rsp = make_fail_rsp(msg, 1, ret['error']);
	}
	pc.apiSendMsg(rsp);
}



function doQuestBegin(pc, msg){
	
	var ret = pc.restartQuest(msg.quest_id);
	if (!ret){
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Invalid quest id"));
	}
	else if (ret.error){
		return pc.apiSendMsg(make_fail_rsp(msg, 1, ret.error));
	}
	else{
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
}

function doQuestConversationChoice(pc, msg){
	
	var status = pc.getQuestStatus(msg.quest_id);
	if (status != 'todo'){
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Invalid quest id"));
	}
	else{
		pc.acceptQuest(msg.quest_id);
		if (msg.choice == 'accept_and_start'){
			var ret = pc.restartQuest(msg.quest_id);
			if (ret.error){
				return pc.apiSendMsg(make_fail_rsp(msg, 1, ret.error));
			}
		}
		
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
}

function doQuestDialogEnd(pc, msg){
	if (pc.location.onQuestDialogEnd) pc.location.onQuestDialogEnd(pc);
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doContactListOpened(pc, msg){
	if (pc.location.onContactListOpened) pc.location.onContactListOpened(pc);
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doCultivationModeEnded(pc, msg){
	var magic_rock = pc.location.find_items('magic_rock');
	if (magic_rock && magic_rock[0]){
		magic_rock[0].doCultivationModeEnded(pc);
	}
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doShrineSpend(pc, msg){
	if (!msg.itemstack_tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's itemstack_tsid?"));
	
	var shrine = apiFindObject(msg.itemstack_tsid);
	if (!shrine || !shrine.is_shrine){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "shrine not found"));
		return;
	}
	
	if (shrine.container.tsid != pc.location.tsid){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "shrine is in a different location than the player"));
		return;
	}

	shrine.spend_points(pc, msg);
	
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doEmblemSpend(pc, msg){
	if (!msg.itemstack_tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's itemstack_tsid?"));
	
	var emblem = apiFindObject(msg.itemstack_tsid); 
	
	if (!emblem){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "emblem not found"));
		return;
	}

	emblem.doSpend(pc, msg);
	
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doShrineFavorRequest(pc, msg){
	if (!msg.shrine_tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's shrine_tsid?"));

	var shrine = apiFindObject(msg.shrine_tsid);
	if (!shrine || !shrine.is_shrine){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "shrine not found"));
		return;
	}

	if (shrine.container.tsid != pc.location.tsid){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "shrine is in a different location than the player"));
		return;
	}

	var ret = shrine.favorRequest(pc, msg);

	return pc.replyToMsg(msg, ret);
}

function doFavorRequest(pc, msg){
	if (!msg.giant) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's giant?"));

	var giant = msg.giant;

	var max_daily_favor = pc.stats_get_max_favor(giant);
	var cur_daily_favor = 0;

	if (pc.daily_favor && pc.daily_favor[giant]){
		cur_daily_favor = pc.daily_favor[giant].value;
	}

	var ret = {
		name: giant.replace('ti', 'tii'),
		cur_daily_favor: cur_daily_favor,
		current: pc.stats_get_favor_points(giant),
		max: max_daily_favor,
		max_daily_favor: max_daily_favor
	};

	return pc.replyToMsg(msg, ret);
}

function doJobContributeItem(pc, msg){
	if (!msg.itemstack_tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's itemstack_tsid?"));

	var spirit = pc.location.jobs_find_spirit(msg.itemstack_tsid);
	if (!spirit || !spirit.hasJobs){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "spirit not found"));
		return;
	}

	var itemstacks = pc.takeItemsFromBag(msg.contribute_class_id, msg.contribute_count);
	if (!itemstacks){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "that item doesn't exist"));
		return;
	}

	if (!spirit.acceptJobItem(pc, msg.job_id, itemstacks, msg.option)){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "didn't accept anything"));
		return;
	}

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doJobContributeCurrants(pc, msg){
	if (!msg.itemstack_tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's itemstack_tsid?"));

	var spirit = pc.location.jobs_find_spirit(msg.itemstack_tsid);
	if (!spirit || !spirit.hasJobs){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "spirit not found"));
		return;
	}

	if (!spirit.acceptJobCurrants(pc, msg.job_id, msg.currants, msg.option)){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "didn't accept anything"));
		return;
	}

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doJobApplyWork(pc, msg) {
	if (!msg.itemstack_tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's itemstack_tsid?"));
	
	// Find spirit
	var spirit = pc.location.jobs_find_spirit(msg.itemstack_tsid);
	if (!spirit || !spirit.hasJobs){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "spirit not found"));
		return;
	}

	// find job
	var jobs = spirit.getAvailableJobs(pc);
	if(jobs.given[msg.job_id]) {
		var job = jobs.given[msg.job_id];
	} else if (jobs.open[msg.job_id]) {
		var job = jobs.open[msg.job_id];
	} else {
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Cannot find job."));		
	}
	
	// Find req
	var r = job.find_work(msg.tool_class_id);
	if(!r) {
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Cannot find req."));
	}
	
	// Apply work
	var unitsRequired = Math.round(r.num * msg.work_percentage / 100.0);
	
	var amount = job.inc_requirement(pc, r.id, unitsRequired);
	job.addPlayerContribution(pc, amount * r.base_cost, msg.option, 'work');	
	
	var rsp = make_ok_rsp(msg);
	rsp.work = {
		tool_class_id: msg.tool_class_id,
		units: amount,
		unit_duration: 0,
		unit_energy: 0		
	};
	
	spirit.updatePlayers(msg.job_id, null, true);
	
	return pc.apiSendMsg(rsp);
}

function doJobContributeWork(pc, msg){
	if (!msg.itemstack_tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's itemstack_tsid?"));
	
	var spirit = pc.location.jobs_find_spirit(msg.itemstack_tsid);
	if (!spirit || !spirit.hasJobs){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "spirit not found"));
		return;
	}

	var work = spirit.startJobWork(pc, msg.job_id, msg.tool_class_id, msg.contribute_count, msg.option);
	if (!work.units){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "didn't accept anything"));
		return;
	}

	var rsp = make_ok_rsp(msg);
	rsp.work = work;

	return pc.apiSendMsg(rsp);
}

function doJobStopWork(pc, msg){
	if (!msg.itemstack_tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's itemstack_tsid?"));

	var spirit = pc.location.jobs_find_spirit(msg.itemstack_tsid);
	if (!spirit || !spirit.hasJobs){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "spirit not found"));
		return;
	}

	if (!spirit.cancelJobWork(pc)){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "couldn't cancel"));
		return;
	}

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doJobLeaderboard(pc, msg){
	if (!msg.itemstack_tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's itemstack_tsid?"));

	var spirit = pc.location.jobs_find_spirit(msg.itemstack_tsid);
	if (!spirit || !spirit.hasJobs){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "spirit not found"));
		return;
	}
	
	return pc.apiSendMsg(spirit.getJobLeaderboard(pc, msg));
}

function doJobStatus(pc, msg){
	if (!msg.itemstack_tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's itemstack_tsid?"));

	var spirit = pc.location.jobs_find_spirit(msg.itemstack_tsid);
	if (!spirit || !spirit.hasJobs){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "spirit not found"));
		return;
	}
	
	var job = spirit.getAndAccept(pc, msg.job_id);
	if (!job){
		var jobs = spirit.getAvailableJobs(pc);
		if (jobs && jobs.delayed && jobs.delayed[msg.job_id]){
			var status = spirit.buildJobStatus(pc, jobs.delayed[msg.job_id]);
			if (status.info.delay_text){
				spirit.conversation_start(pc, status.info.delay_text);
				return pc.apiSendMsg(make_ok_rsp(msg));
			}
		}
		
		return pc.apiSendMsg(make_fail_rsp(msg, 1, 'Invalid job id'));
	}
	
	var status = spirit.buildJobStatus(pc, job);
	status.spirit_id = spirit.tsid;
	
	var rsp = make_ok_rsp(msg);
	rsp.status = status;
	return pc.apiSendMsg(rsp);
}

function doJobClaim(pc, msg){
	if (!msg.itemstack_tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Where's itemstack_tsid?"));

	var spirit = pc.location.jobs_find_spirit(msg.itemstack_tsid);
	if (!spirit || !spirit.hasJobs){
		pc.apiSendMsg(make_fail_rsp(msg, 1, "spirit not found"));
		return;
	}

	var job = spirit.getAndAccept(pc, msg.job_id);
	if (!job){
		return pc.apiSendMsg(make_fail_rsp(msg, 1, 'Invalid job id'));
	}
	
	if (!job.claimJob(pc, msg.group_tsid)){
		return pc.apiSendMsg(make_fail_rsp(msg, 1, 'Could not claim'));
	}

	spirit.updatePlayers(msg.job_id);
	
	var status = spirit.buildJobStatus(pc, job);
	status.spirit_id = spirit.tsid;
	
	var rsp = make_ok_rsp(msg);
	rsp.status = status;
	return pc.apiSendMsg(rsp);
}

function doInputResponse(pc, msg){
	pc.inputBoxResponse(msg);
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doTPScriptUse(pc, msg){
	var items = pc.getAllContents();
	if (items[msg.itemstack_tsid]){
		var it = pc.apiLockStack(items[msg.itemstack_tsid].path);
		var ret = it.use(pc, msg.use_token);
		if (ret.ok)	return pc.apiSendMsg(make_ok_rsp(msg));
		return pc.apiSendMsg(make_fail_rsp(msg, 1, ret.error));
	}
	else{
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "TP script not found"));
	}
}

function doTPScriptImbue(pc, msg){
	var script = getTargetStack(pc, msg, true);
	pc.removeItemStackTsid(script.tsid, 1);
	if (script){
		if (!pc.teleportation_get_token_balance()) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Buy more tokens!"));

		pc.teleportation_spend_token("Imbueing a Teleportation Script to "+script.destination.name+".");

		var imbued_script = apiNewItemStack('teleportation_script_imbued', 1);
		if (!imbued_script) {
			log.error("Could not create teleportation script for player "+pc);
			return;
		}
		
		// Copy properties over
		imbued_script.setTarget(script.destination);
		imbued_script.contents = script.contents;
		imbued_script.title = script.title;
		imbued_script.last_editor = script.last_editor;
		imbued_script.last_edited = time();
		
		
		script.apiDelete();
		var remaining = pc.addItemStack(imbued_script);
		if (remaining) {
			pc.sendAcivity("You don't have room for an imbued script, which is honestly pretty weird.");
			imbued_script.apiDelete();
			return;
		}
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	else{
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "TP script not found"));
	}
}

function doMapGet(pc, msg){

	if (msg.hub_id && !msg.tsid){
		var hub_basic = config.data_maps.maps[msg.hub_id];
		if (hub_basic.objs[0]){
			var street = apiFindObject(hub_basic.objs[0].tsid);
		}
	} else {
		var street = apiFindObject(msg.tsid);
	}

	if (!street){
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Street not found"));
	}

	var rsp = make_ok_rsp(msg);
	rsp.mapData = street.get_map(pc);
	pc.apiSendMsg(rsp);
}

function doPerfTeleport(pc, msg){

	var loc_tsid = msg.loc_tsid;

	var street = apiFindObject(loc_tsid);
	
	if (!street){
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Street not found"));
	}
	
	// make sure loc is in http://staging.glitch.com/god/world_hub.php?id=122
	if ((!config.is_dev && street.hubid != '122') && !(pc.is_god || pc.is_guide || pc.is_help)) {
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Invalid street"));
	}
	
	var ret = pc.teleportToLocation(loc_tsid, 0, -150);
	if (!ret.ok){
		pc.sendActivity(ret.error);
		return pc.apiSendMsg(make_fail_rsp(msg, 1, ret.error));
	}

	pc.apiSendMsg(make_ok_rsp(msg));
}


function doAdminTeleport(pc, msg){

	var street = apiFindObject(msg.loc_tsid);
	if (!street){
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Street not found"));
	}
	
	var ret = pc.teleportToLocation(msg.loc_tsid, 0, -500);
	if (!ret.ok){
		pc.sendActivity(ret.error);
		return pc.apiSendMsg(make_fail_rsp(msg, 1, ret.error));
	}

	pc.apiSendMsg(make_ok_rsp(msg));
}

function doMapGetPath(pc, msg){

	var dst = msg.loc_tsid;
	
	var ret = pc.buildPath(dst);
	if (!ret.ok){
		if (!ret.non_fatal) log.error(pc+' failed to build path from '+pc.location.tsid+' to '+dst+': '+msg);
		return pc.apiSendMsg(make_fail_rsp(msg, 1, ret.error));
	}

	var rsp = make_ok_rsp(msg);
	rsp.path_info = ret.path;

	pc.apiSendMsg(rsp);
}

function doMapClearPath(pc, msg){

	pc.clearPath();

	pc.apiSendMsg(make_ok_rsp(msg));
}

function doActionRequestReply(pc, msg){

	var sender = getPlayer(msg.player_tsid);
	if (!sender || sender.tsid == pc.tsid) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Bad sender"));
	
	if (sender.actionRequestReply(pc, msg)){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	else{
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Couldn't handle it!"));
	}
}

function doActionRequestCancel(pc, msg){
	
	if (pc.actionRequestCancel(msg)){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	else{
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Couldn't handle it!"));
	}
}

function doActionRequestBroadcast(pc, msg){
	
	if (pc.broadcastActionRequest(msg.event_type, msg.event_tsid, msg.txt, msg.need, msg.got)){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	else{
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Couldn't handle it!"));
	}
}

function doGardenAction(pc, msg){
	var garden = getTargetStack(pc, msg, false);
	if (garden && garden.is_garden){
		// Ours?
		var owner = garden.isPublic() ? null : garden.container.pols_get_owner();
		if (owner && owner.tsid != pc.tsid && !garden.container.acl_keys_player_has_key(pc)){
			garden.apiPutBack();
			return pc.apiSendMsg(make_fail_rsp(msg, 1, "Nacho garden!"));
		}

		// range check...
		var x = Math.abs(garden.x - pc.x);
		var y = Math.abs(garden.y - pc.y);
		var range = Math.sqrt((x*x)+(y*y));
		var required_range = 300;
		var check_for_proximity = msg.check_for_proximity ? true : false;

		if (range > required_range && check_for_proximity){
			garden.apiPutBack();
			return pc.apiSendMsg(make_fail_rsp(msg, 101, "Get closer:"+required_range));
		}
		else if (range > config.verb_radius && !pc.houses_is_at_home()){
			garden.apiPutBack();

			var text = "Oops. The "+garden.name_single+" got too far away for you. Get closer and then try again.";
			if (pc.is_god) text += " ("+range+")";

			return pc.apiSendMsg(make_fail_rsp(msg, 1, text));
		}
		
		var args = {
			pc: pc.tsid,
			plot: garden.plotIDToKey(msg.plot_id),
			plot_id: msg.plot_id,
			action: msg.action,
			seed: msg.class_tsid,
			msg: msg
		};
		
		if (config.is_dev) log.info(args);
		var ret = garden.adminTendGarden(args);
		if (config.is_dev) log.info(ret);
		if (ret.ok){
			var rsp = make_ok_rsp(msg);
			
			if (ret.announce){
				rsp.energy = intval(ret.announce.energy);
				rsp.mood = intval(ret.announce.mood);
				rsp.xp = intval(ret.announce.xp);
				
				if (ret.announce.msg){
					var growl = ret.announce.msg;
					
					if (rsp.energy || rsp.mood || rsp.xp){
						growl += ' (';
						if (rsp.energy){
							growl += rsp.energy+' energy';
							
							if (rsp.mood || rsp.xp) growl += ', ';
						}
						
						if (rsp.mood){
							growl += '+'+rsp.mood+' mood';
							
							if (rsp.xp) growl += ', ';
						}
						
						if (rsp.xp) growl += '+'+rsp.xp+' iMG';
						
						growl += ')';
					}

					pc.sendActivity(growl);
				}
			}
			
			return pc.apiSendMsg(rsp);
		}
		else{
			return pc.apiSendMsg(make_fail_rsp(msg, 1, ret.error));
		}
	}
	else{
		return pc.apiSendMsg(make_fail_rsp(msg, 1, "Invalid itemstack_tsid"));
	}
}

function doNoticeBoardAction(pc, msg) {
	var noticeBoard = apiFindObject(msg.itemstack_tsid);
	var result;
	
	switch(msg.action) {
		case 'take':
			result = noticeBoard.takeNote(pc, msg);
		break;
		case 'add':
			result = noticeBoard.addNote(pc, msg);
		break;
		case 'read':
			result = noticeBoard.readNote(pc, msg);
		break;
		default:
			return pc.apiSendMsg(make_fail_rsp(msg, 1, "Invalid notice board action"));
		break;
	}
	
	if(result) {
		return pc.apiSendMsg(make_ok_rsp(msg));
	} else {
		return pc.apiSendMsg(makefail_rsp(msg, 1, "Notice board action failed."));
	}
}

function doPlayMusic(pc, msg){
	if (config.music_map[msg.name]){
		pc.announce_music(msg.name, msg.loops);
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	else{
		return pc.apiSendMsg(makefail_rsp(msg, 1, "Unknown sound name."));
	}
}

// Mail functions

function doMailSend(pc, msg) {
	var details = {};
	
	log.info("sending mail from "+pc+": "+msg);
	log.info("MAIL: doMailSend");
	
	var recipient = getPlayer(msg.recipient_tsid);
	if(!recipient) {
		log.error("Attempt to send mail to unknown player "+msg.recipient_tsid+" by player "+pc.tsid+".");
		return pc.apiSendMsg(make_fail_rsp(msg));
	}
	
	// Handle reply, if any
	if (msg.reply_message_id != null && msg.reply_message_id != undefined) {
		var reply = pc.mail_get_player_reply(msg.reply_message_id);
	}
	
	// Find the item. If we have an itemstack_tsid, use that. Otherwise, we need to get the stack from class and send it out.
	if(msg.itemstack_tsid) {
		var itemstack_tsid = msg.itemstack_tsid;
		
		var it = apiFindObject(msg.itemstack_tsid);
		if (!it) {
			log.error("Attempt to send itemstack "+msg.itemstack_tsid+" from player "+pc+", but it could not be found.");
			return pc.apiSendMsg(make_fail_rsp(msg, 1, "Could not find item"));
		}

		if (!pc.mail_can_send(it)){
			log.error("Attempt to send itemstack "+msg.itemstack_tsid+" from player "+pc+", but it is not allowed.");
			return pc.apiSendMsg(make_fail_rsp(msg, 1, "Item is not allowed to be mailed"));
		}
		
		var cost = pc.mail_get_message_cost(it, it.count, msg.currants);

		if (!pc.stats_has_currants(cost)) {
			return pc.apiSendMsg(make_fail_rsp(msg));			
		}
		
		pc.stats_remove_currants(cost);

		// Send it!
		recipient.mail_add_player_delivery(itemstack_tsid, pc.tsid, msg.currants, msg.text, config.mail_delivery_time_with_attachment, false, reply);
		apiLogAction("MAIL_SEND", 'sender='+pc.tsid, 'recipient='+msg.recipient_tsid, 'message='+msg.text, 'item='+itemstack_tsid, 'currants='+msg.currants, 'expedited='+msg.is_expedited);

		// Complete quest
		pc.quests_inc_counter('mail_packages_sent', 1);
	} else if(msg.class_tsid) {
		var stacks = pc.takeItemsFromBag(msg.class_tsid, msg.count);
		var tsids = [];
		
		if(!stacks || !stacks.length) {
			// Big problem! Abort!
			log.error("Attempted to send "+msg.count+" of item class "+msg.class_tsid+" from player "+pc+", but we couldn't find that in their bags!");
		}

		if (!pc.mail_can_send(stacks[0])){
			log.error("Attempt to send "+msg.count+" of item class "+msg.class_tsid+" from player "+pc+", but it is not allowed.");
			return pc.apiSendMsg(make_fail_rsp(msg, 1, "Item is not allowed to be mailed"));
		}

		var cost = pc.mail_get_message_cost(stacks[0], msg.count, msg.currants);

		if (!pc.stats_has_currants(cost)) {
			return pc.apiSendMsg(make_fail_rsp(msg));			
		}
		
		pc.stats_remove_currants(cost);

		// Assemble stacks in our mail bag
		var bag = pc.mail_get_bag();
		var slot = bag.firstEmptySlot();
		for(var i in stacks) {
			var stack = stacks[i];			
			bag.addItemStack(stack, slot);			
		}

		var final_stack = bag.getContents()[slot];
		var deets = {waiting_to_be_sent:true};
		final_stack.addDeliveryPacket(deets);
		
		recipient.mail_add_player_delivery_delayed(final_stack.tsid, pc.tsid, msg.currants, msg.text, config.mail_delivery_time_with_attachment, false, reply, 1);

		apiLogAction("MAIL_SEND", 'sender='+pc.tsid, 'recipient='+msg.recipient_tsid, 'message='+msg.text, 'item='+final_stack.tsid, 'currants='+msg.currants, 'expedited='+msg.is_expedited);

		// Complete quest
		pc.quests_inc_counter('mail_packages_sent', 1);
	} else {
		var cost = pc.mail_get_message_cost(null, 0, msg.currants);
		if (!pc.stats_has_currants(cost)) {
			return pc.apiSendMsg(make_fail_rsp(msg));			
		}
		
		pc.stats_remove_currants(cost);	
		
		var delivery_time = config.mail_delivery_time;	
		if (msg.currants){
			delivery_time = config.mail_delivery_time_with_attachment;
		}
		
		recipient.mail_add_player_delivery(null, pc.tsid, msg.currants, msg.text, delivery_time, true, reply);
		apiLogAction("MAIL_SEND", 'sender='+pc.tsid, 'recipient='+msg.recipient_tsid, 'message='+msg.text, 'currants='+msg.currants, 'expedited='+msg.is_expedited);
	}
		
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doMailReceive(pc, msg) {
	if (!msg.message_ids || !msg.message_ids.length) {
		return pc.apiSendMsg(make_fail_rsp(msg));
	}
	
	var rsp = make_ok_rsp(msg);
	var failed = false;
	rsp.message_ids = [];
	
	for (var i in msg.message_ids) {
		if(pc.get_message_goodies(msg.message_ids[i], true)) {
			failed = true;
		} else {
			rsp.message_ids.push(msg.message_ids[i]);
			var this_mail = pc.mail_get_player_message_data(msg.message_ids[i]);
			if (this_mail.is_auction) pc.mail_remove_player_message(msg.message_ids[i]);
		}
	}
	
	if (failed) {
		pc.prompts_add({
			txt		: "You cannot receive your items because your bag is full. You will need to free up space in your bag first.",
			timeout		: 10,
			choices		: [
				{ value : 'ok', label : 'OK' }
			]
		});		
	}
	
	return pc.apiSendMsg(rsp);
}

function doMailRead(pc, msg) {
	if(!msg.message_ids || !msg.message_ids.length) {
		return pc.apiSendMsg(make_fail_rsp(msg));
	}
	
	for (var i in msg.message_ids) {
		pc.mail_read(msg.message_ids[i], !msg.is_unread);	
	}
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doMailDelete(pc, msg) {
	if(!msg.message_ids || !msg.message_ids.length) {
		return pc.apiSendMsg(make_fail_rsp(msg));
	}

	for(var i in msg.message_ids) {
		pc.mail_remove_player_message(msg.message_ids[i]);
	}
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doMailArchive(pc, msg) {
	if (!msg.message_ids || !msg.message_ids.length) {
		return pc.apiSendMsg(make_fail_rsp(msg));
	}

	for(var i in msg.message_ids) {
		pc.mail_archive_message(msg.message_ids[i]);
	}
	return pc.apiSendMsg(make_ok_rsp(msg));
}

// We have stopped interacting with a mail item
// Admins can check mail from anywhere, so it's OK if there's no item
function doMailCancel(pc, msg) {
	if(!msg.itemstack_tsid) {
		return pc.apiSendMsg(make_ok_rsp(msg));
	}
	
	var it = apiFindObject(msg.itemstack_tsid);
	if(it && it.mailStop) {
		it.mailStop(pc);
		return pc.apiSendMsg(make_ok_rsp(msg));
	} else {
		return pc.apiSendMsg(make_fail_rsp(msg));		
	}
}

function doMailCost(pc, msg) {
	var it = null;
	if (msg.itemstack_tsid) {
		it = apiFindObject(msg.itemstack_tsid);
	}

	var cost = pc.mail_get_message_cost(it, msg.count, msg.currants, true);
	
	var rsp = make_ok_rsp(msg);
	
	rsp.type = 'mail_cost'; 
	rsp.amount = cost;
	
	return pc.apiSendMsg(rsp);
}

function doMailCheck(pc, msg) {
	var rsp = make_ok_rsp(msg);
	
	return pc.apiSendMsg(pc.build_mail_check_msg(null, rsp));
}

function doGuideStatusChange(pc, msg){
	if (!pc.is_guide) return pc.apiSendMsg(make_fail_rsp(msg, 1, "You are not a guide!"));

	pc.guide_on_duty = msg.on_duty ? true : false;

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doCameraModeStarted(pc, msg) {
	pc.location.apiSendAnnouncementX({
		type: 'pc_overlay',
		swf_url: overlay_key_to_url('eyeballing'),
		duration: 0,
		pc_tsid: pc.tsid,
		locking: false,
		dismissible: false,
		delta_x: 0,
		delta_y: -110,
		width: 50,
		height: 50,
		bubble: true,
		hide_in_snaps: true,
		uid: pc.tsid+'-eyeballing'
	}, pc);
	
	msg = make_ok_rsp(msg);
	msg.filters = [];
	if (pc.imagination_has_upgrade('snapshottery_basic_filter_pack')){
		msg.filters.push({tsid:'boost_filter', label:'Boost', is_enabled:true});
		msg.filters.push({tsid:'bw_fitler', label:'B&W', is_enabled:true});
		msg.filters.push({tsid:'historic_filter', label:'Historic', is_enabled:true});
		msg.filters.push({tsid:'memphis_filter', label:'Chilliwack', is_enabled:true});
	}
	if (pc.imagination_has_upgrade('snapshottery_filter_pack_1')){
		msg.filters.push({tsid:'piggy_filter', label:'Piggy', is_enabled:true});
		msg.filters.push({tsid:'beryl_filter', label:'Beryl', is_enabled:true});
		msg.filters.push({tsid:'fire_fly_filter', label:'Fire Fly', is_enabled:true});
	}
	if (pc.imagination_has_upgrade('snapshottery_filter_pack_2')){
		msg.filters.push({tsid:'holga_filter', label:'Holga', is_enabled:true});
		msg.filters.push({tsid:'vintage_filter', label:'Vintage', is_enabled:true});
		msg.filters.push({tsid:'ancient_filter', label:'Ancient', is_enabled:true});
	}
	if (pc.imagination_has_upgrade('snapshottery_filter_pack_3')){
		msg.filters.push({tsid:'dither_filter', label:'Dither', is_enabled:true});
		msg.filters.push({tsid:'shift_filter', label:'Shift', is_enabled:true});
		msg.filters.push({tsid:'outline_filter', label:'Outline', is_enabled:true});
	}

	return pc.apiSendMsg(msg);
}

function doCameraModeEnded(pc, msg) {
	pc.location.overlay_dismiss(pc.tsid+'-eyeballing');
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doSetPrefs(pc, msg) {
	var rsp = make_ok_rsp(msg);
	rsp.prefs = pc.setPrefs(msg.prefs);
	return pc.apiSendMsg(rsp);
}

function doPartySpaceInviteResponse(pc, msg){
	if (msg.spend_energy){
		pc.party_space_prompt_callback('energy');
	}
	else if (msg.spend_token){
		pc.party_space_prompt_callback('token');
	}
	else{
		pc.party_activity("If you'd like to join the Party Space later, you can do so from the Party Chat menu above.");
	}

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doPartySpaceJoin(pc, msg){
	if (!pc.party_is_in()) return pc.apiSendMsg(make_fail_rsp(msg, 1, "You are not in a party."));
	if (!pc.party_has_space()) return pc.apiSendMsg(make_fail_rsp(msg, 1, "Your party does not have a Party Space."));
	if (pc.is_dead) return pc.apiSendMsg(make_fail_rsp(msg, 1, "You are dead."));

	if (!pc.party_find_teleporter()) pc.party_space_prompt();

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doAclKeyInfo(pc, msg){
	return pc.apiSendMsg(pc.acl_keys_build_client_msg(msg));
}

function doAclKeyChange(pc, msg){
	var receiver = apiFindObject(msg.pc_tsid);

	if (!receiver){
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "can't find receiving player"));
	}

	if (msg.is_grant){
		var rsp = pc.acl_keys_grant(receiver);
		if (!rsp.ok){
			return pc.apiSendMsg(make_fail_rsp(msg, 0, rsp.reason));
		}
	} else {
		pc.acl_keys_remove(receiver);
	}

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doSplashScreenButtonPayload(pc, msg) {
	if (msg.click_payload.pc_callback){
		if (pc[msg.click_payload.pc_callback]){
			pc[msg.click_payload.pc_callback](msg.click_payload);
			return pc.apiSendMsg(make_ok_rsp(msg));
		}
	}

	return pc.apiSendMsg(make_fail_rsp(msg, 0, "don't know what to do with that"));
}

function doNewItemWindowClosed(pc, msg){
	if (pc.location.onNewItemWindowClosed) pc.location.onNewItemWindowClosed(pc, msg);

	// [4:37 PM] <eric> GS shoudl not send any message back to the client after it receives the [callback] message.
	return;
}

function doAddNeighbor(pc, msg){
	if (!pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	var neighbor = getPlayer(msg.neighbor);
	if (!neighbor) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Invalid neighbor"));

	if (!pc.location.addNeighbor(neighbor, intval(msg.position))) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Could not add neighbor"));

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doRemoveNeighbor(pc, msg){
	if (!pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	if (!pc.location.removeNeighbor(intval(msg.position))) return pc.apiSendMsg(make_fail_rsp(msg, 0, "Could not remove neighbor"));

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doImaginationPurchase(pc, msg){
	if (!pc.imagination_purchase_upgrade(msg.imagination_id)){
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Could not purchase imagination upgrade"));
	}

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doImaginationPurchaseConfirmed(pc, msg){
	pc.imagination_purchase_upgrade_confirmed(msg.imagination_id);

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doImaginationShuffle(pc, msg){
	if (pc.achievements_get_daily_label_count('imagination', 'shuffle')) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You can't do that anymore today"));

	if (!pc.imagination_reshuffle_hand()){
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "Could not shuffle"));
	}

	pc.achievements_increment_daily('imagination', 'shuffle', 1);

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doFurnitureDrop(pc, msg){
	if (!pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	var item = pc.furniture_get_bag().removeItemStackTsid(msg.itemstack_tsid, 1);
	if (!item) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You don't have that item"));

	if (!item.has_parent('furniture_base')) return pc.apiSendMsg(make_fail_rsp(msg, 0, "That is not furniture"));

	if (item.canDropAt && !item.canDropAt(pc.location, msg.x, msg.y)) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You can't drop that there"));

	if (msg.z) item.z = msg.z;
	
	pc.location.apiPutItemIntoPosition(item, msg.x, msg.y);
	pc.location.geo_add_plats_from_item(item);

	if (pc.location.is_newxp && pc.location.current_step == 'given_furniture'){
		//pc.changeUIComponent('swatches_button', true);
		//pc.location.current_step = 'enabled_swatches';
		pc.announce_vog_fade("You’re now in decoration mode.", {done_payload: {location_script_name: 'newxp_in_decomode'}});
		pc.location.current_step = 'furniture_placed';
	}
	else if (pc.location.is_newxp && pc.location.current_step == 'furniture_placed'){
		pc.changeUIComponent('swatches_button', true);
		pc.location.current_step = 'enabled_swatches';
		pc.apiSendMsg({
			type: "ui_callout",
			section: 'swatch_open'
		});
	}

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doFurnitureMove(pc, msg){
	if (!pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	var item = pc.location.apiLockStack(msg.itemstack_tsid);
	if (!item) return pc.apiSendMsg(make_fail_rsp(msg, 0, "That item is not here"));

	if (!item.has_parent('furniture_base')) return pc.apiSendMsg(make_fail_rsp(msg, 0, "That is not furniture"));

	// Don't move doors from their y position
	if (item.class_tsid == 'furniture_door'){
		msg.y = item.y;
		msg.diff_y = 0;
	}

	pc.location.apiPutItemIntoPosition(item, msg.x, msg.y);

	var diff_x = intval(msg.diff_x);
	var diff_y = intval(msg.diff_y);

	// Move plats contained in the item and let players know
	var ret = pc.location.geo_find_plats_by_source(item.tsid);
	for (var i in ret.plats){
		ret.plats[i].start.x+=diff_x;
		ret.plats[i].end.x+=diff_x;

		ret.plats[i].start.y+=diff_y;
		ret.plats[i].end.y+=diff_y;
	}
	pc.location.geo_modify_plats(ret.plats, ret.walls);

	// Need to move any items?
	if (msg.also_tsids){
		for (var i in msg.also_tsids){
			var it = pc.location.apiLockStack(msg.also_tsids[i]);
			if (!it) continue;

			pc.location.apiPutItemIntoPosition(it, it.x+diff_x, it.y+msg.diff_y, false);
		}
	}

	// Move the door?
	if (item.class_tsid == 'furniture_door'){
		var door = pc.location.geo_find_door_by_source(item);
		if (door){
			door.x = intval(msg.x);
			door.y = intval(msg.y);
		}

		var target_door = pc.location.geo_find_door_by_target_source(item);
		if (target_door){
			target_door.connect.x = intval(msg.x);
			target_door.connect.y = intval(msg.y);
		}
	}

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doFurniturePickup(pc, msg){
	if (!pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	var item = pc.location.apiLockStack(msg.itemstack_tsid);
	if (!item) return pc.apiSendMsg(make_fail_rsp(msg, 0, "That item is not here"));

	if ((item.is_bag && item.countContents()) || (item.class_tsid == 'furniture_door' && (item.hasInProgressJob(pc) || !item.has_job))) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You can't pick that up"));

	if (item.canPickup){
		var ret = item.canPickup(pc);
		if (!ret.ok){
			if (ret.error) return pc.apiSendMsg(make_fail_rsp(msg, 0, ret.error));
			return pc.apiSendMsg(make_fail_rsp(msg, 0, "You can't pick that up"));
		}
	}

	if (item.isForSale && item.isForSale()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You have to stop selling that before you can pick it up."));

	delete item.z;

	pc.furniture_get_bag().addItemStack(item);

	// Remove plats contained in the item and let players know
	pc.location.geo_remove_plats_by_source(item.tsid);

	if (item.class_tsid == 'furniture_door'){
		item.reset();
		var job_id = 'proto-'+item.tsid;
		var job = pc.location.jobs_get(job_id);
		if (job){
			pc.location.jobs_reset(job_id, true);
			delete pc.location.jobs[job_id];
		}
	}

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doItemstackSetUserConfig(pc, msg){
	var item = getTargetStack(pc, msg, true);
	if (!msg.config) return pc.apiSendMsg(make_fail_rsp(msg, 0, "No config passed"));
	if (!item) return pc.apiSendMsg(make_fail_rsp(msg, 0, "That item is not here"));
	
	var ret;
	
	// first, validate the config
	for (var k in msg.config) {
		if (item.getInstanceProp(k, msg.config[k]) == undefined) {
			item.apiPutBack();
			return pc.apiSendMsg(make_fail_rsp(msg, 0, k+' is not a valid instance prop on item'));
		}
	}
	
	// now set the config
	for (var k in msg.config) {
		ret = item.setInstanceProp(k, msg.config[k]);
	}
	
	item.apiPutBack();
	
	if (ret) {
		apiLogAction('ITEMSTACK_USER_CONFIG', 'pc='+pc.tsid, 'item='+item.class_tsid, 'config='+msg.config+'');
		item.broadcastConfig();
		return pc.apiSendMsg(make_ok_rsp(msg));
	} else {
		return pc.apiSendMsg(make_fail_rsp(msg, 0, 'unable to set config on item'));
	}
}

function doFurnitureSetUserConfig(pc, msg){
	var item = getTargetStack(pc, msg, true);
	if (!item) return pc.apiSendMsg(make_fail_rsp(msg, 0, "That item is not here"));
	
	var ret = item.setInstanceProp('user_config', msg.config);
	
	if (ret && 'facing_right' in msg) {
		var facing_right = (msg.facing_right) ? 1 : 0;
		if (facing_right != item.getInstanceProp('facing_right')) {
			item.setInstanceProp('facing_right', facing_right);
			item.flipPlats();
		}
	}
	
	item.apiPutBack();
	
	if (ret) {
		apiLogAction('FURNITURE_USER_CONFIG', 'pc='+pc.tsid, 'item='+item.class_tsid, 'config='+msg.config+'', 'chassis_style='+item.getInstanceProp('upgrade_id'));
		item.broadcastConfig();
		return pc.apiSendMsg(make_ok_rsp(msg));
	} else {
		return pc.apiSendMsg(make_fail_rsp(msg, 0, 'unable to setInstanceProp "user_config" on item'));
	}
}

function doFurnitureUpgradePurchase(pc, msg){
	var item = getTargetStack(pc, msg, true);
	if (!item) return pc.apiSendMsg(make_fail_rsp(msg, 0, "That item is not here"));

	var ret = pc.furniture_upgrade_purchase(item, msg.upgrade_id, msg.msg_id, msg.config, msg.facing_right);

	item.apiPutBack();

	if (ret.ok && ret.immediate){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}else if (!ret.ok){
		return pc.apiSendMsg(make_fail_rsp(msg, 0, ret.error));
	}
}

function doResnapMiniMap(pc, msg){
	pc.apiSendLocMsgX({
		type: 'resnap_minimap'
	});
	
	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doFurnitureSetZeds(pc, msg){
	
	var something_changed = false;
	var item;
	var hash = msg.hash;
	if (hash) { // this is the preferred way
		for (var tsid in hash) {
			item = pc.location.apiLockStack(tsid);
			if (item) {
				if (item.z != hash[tsid]) {
					something_changed = true;
					item.z = hash[tsid];
				}
				item.apiPutBack();
			}
		}
	
	} else if (msg.itemstacks) { // this is deprecated and will be removed shortly
		for (var i=0; i<msg.itemstacks.length; i++) {
			item = pc.location.apiLockStack(msg.itemstacks[i].tsid);
			if (item) {
				if (item.z != msg.itemstacks[i].z) {
					something_changed = true;
					item.z = msg.itemstacks[i].z;
				}
				item.apiPutBack();
			}
		}
	} else {
		return pc.apiSendMsg(make_fail_rsp(msg, 0, "bad itemstacks"));
	}
	
	if (something_changed) {
		// sending this to force changes to go out on the changed stacks
		pc.apiSendLocMsgX({
			type: 'furniture_zeds'
		});
	}
	
	return pc.apiSendMsg(make_ok_rsp(msg));
}


//
// get wall/floor/ceiling choices
//

function doHousesWallChoices(pc, msg){
	if (!pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	var rsp = make_ok_rsp(msg);
	rsp.choices = pc.furniture_get_wall_options();

	return pc.apiSendMsg(rsp);
}

function doHousesFloorChoices(pc, msg){
	if (!pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	var rsp = make_ok_rsp(msg);
	rsp.choices = pc.furniture_get_floor_options();

	return pc.apiSendMsg(rsp);
}

function doHousesCeilingChoices(pc, msg){
	if (!pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	var rsp = make_ok_rsp(msg);
	rsp.choices = pc.furniture_get_ceiling_options();

	return pc.apiSendMsg(rsp);
}


//
// set wall/floor/ceiling coverings
//

function doHousesWallSet(pc, msg){
	if (!pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	var ret = pc.furniture_set_wall(msg.wp_key, msg.wp_type);

	if (ret.ok){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		return pc.apiSendMsg(make_fail_rsp(msg, 0, ret.error));
	}
}

function doHousesFloorSet(pc, msg){
	if (!pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	var ret = pc.furniture_set_floor(msg.floor_key, msg.floor_type);

	if (ret.ok){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		return pc.apiSendMsg(make_fail_rsp(msg, 0, ret.error));
	}
}

function doHousesCeilingSet(pc, msg){
	if (!pc.houses_is_at_home()) return pc.apiSendMsg(make_fail_rsp(msg, 0, "You are not at home"));

	var ret = pc.furniture_set_ceiling(msg.ceiling_key, msg.ceiling_type);

	if (ret.ok){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		return pc.apiSendMsg(make_fail_rsp(msg, 0, ret.error));
	}
}


//
// buy wall/floor/ceiling coverings
//

function doHousesWallBuy(pc, msg){

	var ret = pc.furniture_buy_wall(msg.wp_type);

	if (ret.ok){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		return pc.apiSendMsg(make_fail_rsp(msg, 0, ret.error));
	}
}

function doHousesFloorBuy(pc, msg){

	var ret = pc.furniture_buy_floor(msg.floor_type);

	if (ret.ok){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		return pc.apiSendMsg(make_fail_rsp(msg, 0, ret.error));
	}
}

function doHousesCeilingBuy(pc, msg){

	var ret = pc.furniture_buy_ceiling(msg.ceiling_type);

	if (ret.ok){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		return pc.apiSendMsg(make_fail_rsp(msg, 0, ret.error));
	}
}


//
// preview wall/floor/ceiling coverings
//

function doHousesWallPreview(pc, msg){

	var ret = pc.furniture_preview_wall(msg.wp_key, msg.wp_type);

	if (ret.ok){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		return pc.apiSendMsg(make_fail_rsp(msg, 0, ret.error));
	}
}

function doHousesFloorPreview(pc, msg){

	var ret = pc.furniture_preview_floor(msg.floor_key, msg.floor_type);

	if (ret.ok){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		return pc.apiSendMsg(make_fail_rsp(msg, 0, ret.error));
	}
}

function doHousesCeilingPreview(pc, msg){

	var ret = pc.furniture_preview_ceiling(msg.ceiling_key, msg.ceiling_type);

	if (ret.ok){
		return pc.apiSendMsg(make_ok_rsp(msg));
	}else{
		return pc.apiSendMsg(make_fail_rsp(msg, 0, ret.error));
	}
}

function doNoEnergyMode(pc, msg){
	var enabled = msg.enabled == true;
	var currently_enabled = pc['!in_house_deco_mode'];

	if (enabled && !currently_enabled) {
		apiLogAction('ENTERING_DECO_MODE', 'pc='+pc.tsid);
		// started deco mode code here
	} else if (!enabled && currently_enabled) {
		apiLogAction('LEAVING_DECO_MODE', 'pc='+pc.tsid);
		// stopped deco mode code here
	}
	
	pc['!in_house_deco_mode'] = enabled;

	if (pc.location.is_newxp && (pc.location.current_step == 'furniture_placed' || pc.location.current_step == 'enabled_swatches') && !enabled){

		pc.announce_vog_fade("You’re back to normal mode.", {done_payload: {location_script_name: 'newxp_choose_skill'}});
		pc.apiSendMsg({
			type: "ui_callout",
			section: 'decorate'
		});

		pc.location.current_step = 'choose_skill';
	}

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doHousesExpandCosts(pc, msg){

	var ret = pc.houses_expand_costs();
	return pc.replyToMsg(msg, ret);
}

function doHousesExpandWall(pc, msg){

	var ret = pc.houses_extend();
	if (ret.ok)	apiLogAction('EXPAND_WALL', 'pc='+pc.tsid);
	return pc.replyToMsg(msg, ret);
}

function doHousesExpandYard(pc, msg){

	var ret = pc.houses_expand_yard(msg.side);
	if (ret.ok)	apiLogAction('EXPAND_YARD', 'pc='+pc.tsid, 'side='+msg.side);
	return pc.replyToMsg(msg, ret);
}

function doHousesExpandTower(pc, msg){

	var ret = pc.houses_expand_tower(msg.side);
	return pc.replyToMsg(msg, ret);
}

function doHousesUnexpandWall(pc, msg){

	var ret = pc.houses_unexpand();
	if (ret.ok) apiLogAction('UNEXPAND_WALL', 'pc='+pc.tsid);
	return pc.replyToMsg(msg, ret);
}

function doHousesStyleChoices(pc, msg){

	var ret = pc.houses_style_choices();
	return pc.replyToMsg(msg, ret);
}

function doHousesStyleSwitch(pc, msg){

	var ret = pc.houses_style_set(msg.style_id);
	if (ret.ok)	apiLogAction('STYLE_SWITCH', 'pc='+pc.tsid, 'style='+msg.style_id);
	return pc.replyToMsg(msg, ret);
}

function doTowerSetFloorName(pc, msg){
log.info(msg);
	var ret = pc.houses_set_tower_floor_name(msg.connect_id, msg.custom_label);
	return pc.replyToMsg(msg, ret);
}

function doCultivationStart(pc, msg){
	var ret = pc.location.cultivation_start(pc);
	return pc.replyToMsg(msg, ret);
}

function doCultivationPurchase(pc, msg){
	var ret = pc.location.cultivation_purchase(pc, msg.class_id, intval(msg.x), intval(msg.y));
	return pc.replyToMsg(msg, ret);
}

function doHousesSetName(pc, msg){
	return pc.replyToMsg(msg, pc.houses_set_name(msg.name));
}

function doHousesVisit(pc, msg){
	var ret = pc.houses_visit(msg.player_tsid);
	if (!ret.ok){
		switch (ret.error){
			case 'player_not_found':
				ret.error = "Could not find that player.";
				break;
			case 'blocked':
				ret.error = "You are blocked by that player.";
				break;
			case 'house_not_found':
				ret.error = "They don't have a house yet!";
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
	return pc.replyToMsg(msg, ret);
}

function doHousesSignpost(pc, msg){
	return pc.replyToMsg(msg, pc.houses_signpost(msg.tsid));
}

function doNudgeryStart(pc, msg){
	return pc.replyToMsg(msg, pc.location.nudgery_start(pc, msg.itemstack_tsid));
}

function doItemstackNudge(pc, msg){
	return pc.replyToMsg(msg, pc.location.nudgery_do(pc, msg.itemstack_tsid, msg.x, msg.y));
}

function doTowerSetName(pc, msg){
	var it = pc.location.apiLockStack(msg.tower_tsid);
	
	if (it){
		if (it.setUserName) {
			it.setUserName(msg.name);
			var rsp = make_ok_rsp(msg);
			rsp.name = it.getLabel();
			pc.apiSendMsg(rsp);
		} else {
			pc.apiSendMsg(make_fail_rsp(msg, 0, "setUserName not a function"));
		}
	}else{
		pc.apiSendMsg(make_fail_rsp(msg, 0, "can't find stack"));
	}
}

function doGetItemAsset(pc, msg){
	var rsp = make_ok_rsp(msg);
	rsp.item_class = msg.item_class;

	try {
		var proto = apiFindItemPrototype(msg.item_class);
		var info = proto.getAssetInfo();

		if (info.thumb) rsp.asset_str = info.thumb;
		if (info.position) rsp.position = info.position;
	}catch(e){
	}
	
	return pc.apiSendMsg(rsp);
}

function doGetItemPlacement(pc, msg){
	var rsp = make_ok_rsp(msg);
	rsp.item_class = msg.item_class;

	try {
		var proto = apiFindItemPrototype(msg.item_class);
		var info = proto.getAssetInfo();
		if (info.position) rsp.position = info.position;
	}catch(e){
	}
	
	return pc.apiSendMsg(rsp);
}

function itemDiscoveryDialogClosed(pc, msg){
	if (!pc) return;
	
	pc.itemDiscoveryDialogClosed(msg);

	return pc.apiSendMsg(make_ok_rsp(msg));
}

function doSnapTravel(pc, msg){
	var rsp = make_ok_rsp(msg);

	pc.buffs_apply('camera_recharging');
	pc.feats_increment('tottlys_toys', 1);

	pc.playHitAnimation('hit1', 1000);
	pc.teleportToLocationDelayed(msg.tsid, msg.location_x, msg.location_y);

	return pc.apiSendMsg(rsp);
}

function doSnapTravelForget(pc, msg){
	var rsp = make_ok_rsp(msg);

	pc.buffs_apply('camera_recharging');
	pc.buffs_alter_time('camera_recharging', 0, 15);
	return pc.apiSendMsg(rsp);
}

function doAvatarGetChoices(pc, msg){
	var rsp = make_ok_rsp(msg);
	rsp.choices = pc.avatar_default_choices();
	rsp.option_names = {
		bottom: 'Clothing: Bottom',
		ears: 'Ears',
		eyes: 'Eyes',
		hair_color: 'Hair Color',
		hair_style: 'Hair Style',
		mouth: 'Mouth',
		nose: 'Nose',
		skin_color: 'Skin Color',
		top: 'Clothing: Top'
	}
	//Hair Style / Hair Color / Skin Color /// Eyes / Nose / Mouth / Ears /// Clothing: Top / Clothing: Bottom
	rsp.option_names_sort = ['hair_style','hair_color','skin_color','eyes','nose','mouth','ears','top','bottom'];
	rsp.option_names_breaks = [2,6];
	rsp.default_options = {
		"ears":"choice0",
		"mouth":"choice0",
		"nose":"choice1",
		"skin_color":"choice2",
		"hair_style":"choice3",
		"eyes":"choice0",
		"hair_color":"choice0",
		"top":"choice2",
		"bottom":"choice2"
	}
	return pc.apiSendMsg(rsp);
}

function doEmote(pc, msg){
	pc.doEmote(msg);
}

function doShareButton(pc, msg){
	pc.apiSendMsg(make_ok_rsp(msg));
	utils.http_post('callbacks/share_button.php', {
		'pc' : pc.tsid,
		'button_type' : msg.button_type,
		'share_type' : msg.share_type,
		'short_url' : msg.short_url
	});
	apiLogAction('SHARE_BUTTON', 'pc='+pc.tsid, 'button_type='+msg.button_type, 'share_type='+msg.share_type, 'short_url='+msg.short_url);
}

// Generic handler for all CrafyBot messages.
// All client messages will be handled by the npc_crafty_bot item.
function doCraftybotMessage(pc, msg){
	var craftybot = pc.getCraftybot();
	if (!craftybot) return;

	craftybot.clientHandleMessage(pc, msg);
}


function doHiEmoteMissileHit(pc, msg) {
	pc.doHiEmoteMissileHit(msg);
}

function doGetHiEmoteLeaderboard(pc, msg) {
	var rsp = make_ok_rsp(msg);
	var hi_variants_tracker = apiFindObject(config.hi_variants_tracker);
	rsp.leaderboard = hi_variants_tracker.get_all_counts();
	return pc.apiSendMsg(rsp);
}

function doBreakIt(pc) {

	pc.apiSendMsg({
	type:"conversation",
	itemstack_tsid:"I-FAMILIAR",
	uid:"1351360031",
	txt:"The ancient Feat 'A Fine How-Do-You-Do' has been successfully recreated by modern Glitches. Your participation has earned you the following rewards:",
	choices:{
	  1:{
		 txt:"OK",
		 value:"feat-complete"
	  }
	},
	feat_id:"hi_signs_1",
	job_complete_convo:true,
	rewards:{
	  place:1304,
	  currants:170,
	  mood:0,
	  energy:102,
	  items:{
		 0:{
			class_tsid:"petrified_rock_small",
			count:"1",
			label:"Small Petrified Rock"
		 }
	  },
	  recipes:{
	
      },
	  drop_table:{
	
      },
	  imagination:272,
	  favor:[
		 {
			giant:"all",
			points:34
		 }
	  ]
	},
	title:"Feat Completed!"
	})

	pc.apiSendMsg({type:"nothing"});
}

