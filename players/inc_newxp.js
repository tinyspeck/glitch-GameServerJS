function newxp_move_along(details){
	this.prompts_add_simple('Time to move along. Try going right?', 30);
}

function newxp_testing_modal_callback(value, details){
	if (value == 'ok'){
		this.houses_remove_all();
		this.imagination_reset();
		this.stats_reset_imagination();
		this.stats_reset_xp();
		this.stats_reset_street_history();
		this.skills_reset();
		this.metabolics_set_tank(100);
		this.metabolics_set_max('energy', 100);
		this.metabolics_set_energy(95);
		this.metabolics_set_mood(95);
		this.stats_set_quoin_multiplier(1.0);
		this.stats_set_currants(0);
		this.achievements_reset();
		this.achievements_reset_daily();
		this.quests_reset();
		this.counters_reset();
		this.setDefaultPhysics();
		this.emptyBag();
		//this.furniture_reset(); // This deletes and re-creates your furn bag, which confuses the client. do the next thing instead
		var furn_bag = this.furniture_get_bag();
		if (furn_bag) furn_bag.emptyBag();
		this.physicsReset();
		this.clearPath();

		this.announce_music_stop(this.location.geometry.music_file, 1);
		this.goToNewNewStartingLevel();
	}
}

function newxpQuestReminder(){
	if (this.getQuestStatus('buy_two_bags') != 'done' && this.location.class_tsid == 'newbie_island'){
		this.sendActivity("You haven't gotten your bags from the vendor. Don't forget!");
		this.apiSetTimer('newxpQuestReminder', 5*60*1000);
	}
}

function newxpComplete(){
	this.has_done_intro = true;
	this.apiSendMsg({type: "has_done_intro", value: true});
	delete this.intro_steps; // Is this ok?
	delete this.newbie_island_butterfly_massaged;
	delete this.newxp_allow_home; // no longer needed

	var exterior = this.houses_get_external_street();
	if (exterior){
		exterior.homes_unset_newxp();
	}

	var interior = this.houses_get_interior_street();
	if (interior){
		interior.homes_unset_newxp();
	}

	this.checkNeighborSignpost();
	
	/*
	var level = this.stats_get_level();
	for (var i=1; i<=level; i++){
		var rsp = {
			'type': 'new_level',
			'sound': 'LEVEL_UP',
			'stats': {},
			'rewards': {}
		};

		this.stats_get_login(rsp.stats);
		this.metabolics_get_login(rsp.stats);

		this.sendMsgOnline(rsp);
	}
	*/

	// Log it
	apiLogAction('NEWXP_COMPLETE', 'pc='+this.tsid);
}

function newxpReturnToGentleIsland(){
	if (this.return_to_gentle_island) return;
	this.announce_vog_fade("Though you are on your own now, you are not really alone.//You should find that the other players are pretty helpful, so if you have any questions, just ask.", {width: 600, done_payload: {location_script_name: 'openContacts'}});
}

function doNewxpCompleteCallback(){
	this.checkNeighborSignpost();
	//utils.http_post('callbacks/finished_newxp.php', {tsid: this.tsid}, this.tsid);
}

function newxpGiveGreeterTwig(){
	this.overlay_dismiss('greeter_twig');

	this.announce_vog_fade("It’s a Greeter Twig! You can use it to summon another player to come and say hi.", {css_class: 'nuxp_big', fade_alpha: 0.7, done_payload: {function_name: 'newxpExplainGreeters'}});
	this.createItemFromFamiliar('greeter_twig', 1);
}

function newxpExplainGreeters(){
	this.announce_vog_fade("(Greeters are real people — other players who volunteer to welcome new ‘uns — and tend to be nice. Enjoy, and use the twig whenever you want.)", {css_class: 'nuxp_medium', fade_alpha: 0.7});
}

function newxpProgressCallback(args){
	if (!args) return;

	args.pc = this.tsid;
	utils.http_post('callbacks/newxp_progress.php', args, this.tsid);
}

function checkNeighborSignpost(){
	if (this.getQuestStatus('leave_gentle_island') == 'done' && this.buddies_count()){
		var exterior = this.houses_get_external_street();
		if (exterior){
			exterior.give_neighbor_signpost();
		}
	}
}