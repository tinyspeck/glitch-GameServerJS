// TODO: this has a lot of code repetition. A lot of game-specific functions here should be merged where functionality is shared.

// Global game events

// Start a new game of type. You want this function!
function startInstancedGame(instance, id) {
	log.info('[GAMES] '+this+' start instanced game: '+instance+', '+id);

	this.game_type = id;

	switch(id) {
		case 'color_game':
			this.initColorGameInInstance(instance);
			break;
		case 'it_game':
			this.initITGameInInstance(instance);
			break;
		case 'math_mayhem':
			this.initMathMayhemInInstance(instance);
			break;
		case 'race':
			this.initRaceInInstance(instance);
			break;
		case 'quoin_grab':
			this.initQuoinGrabInInstance(instance);
			break;
		case 'cloudhopolis':
			this.initCloudhopolisInInstance(instance);
			break;
		case 'hogtie_piggy':
			this.initHogtiePiggyInInstance(instance);
			break;
		default:
			log.info('[GAMES] '+"Error: attempt to start instanced game with invalid game id.");
			break;
	}
}

/////////////////////////////////////////////////////
//
// The New Day/Color game
//


// Init a new instance, assigning teams
function initColorGameInInstance(instance) {
	var location = apiFindObject(instance.get_entrance());
	if(!location) {
		log.info('[GAMES] '+"Error: instance does not have a valid location");
		return;
	}
	
	var players = location.getActivePlayers();
	
	if(num_keys(players) < 2) {
		log.info('[GAMES] '+"Error: attempt to start colour game in location with insufficient players.");
		return;
	}
	
	var players_copy = [];
	
	// copy array
	for (var i in players) {
		players_copy.push(players[i]);

		players[i].games_clear_spawn_point();
	}
	
	var redPlayerIndex = randInt(0, players_copy.length - 1);
	var redPlayer = players_copy[redPlayerIndex];
	players_copy.splice(redPlayerIndex, 1);
	
	var bluePlayerIndex = randInt(0, players_copy.length - 1);
	var bluePlayer = players_copy[bluePlayerIndex];
	players_copy.splice(bluePlayerIndex, 1);

	if(num_keys(players) > 2) {
		var yellowPlayerIndex = randInt(0, players_copy.length - 1);
		var yellowPlayer = players_copy[yellowPlayerIndex];

		this.initColorGame([redPlayer], [bluePlayer], [yellowPlayer]);
	} else {
		this.initColorGame([redPlayer], [bluePlayer], null);
	}
	
	this.instance = instance;
}

// Start the game
function initColorGame(red_players, blue_players, yellow_players) {
	log.info('[GAMES] '+"Starting color game "+this+" with red players: "+red_players+", blue players: "+blue_players+", and yellow players "+yellow_players);
	
	var start_time = time();
	
	this.players = {};
	this.infections = {};
	this.infections['red'] = num_keys(red_players);
	this.infections['blue'] = num_keys(blue_players);
	this.infections['yellow'] = num_keys(yellow_players);
	
	for(var i in red_players) {
		red_players[i].games_start_color_game(this, 'red', start_time);
		this.players[red_players[i].tsid] = red_players[i];
	}
	for(i in blue_players) {
		blue_players[i].games_start_color_game(this, 'blue', start_time);		
		this.players[blue_players[i].tsid] = blue_players[i];
	}
	for(i in yellow_players) {
		yellow_players[i].games_start_color_game(this, 'yellow', start_time);		
		this.players[yellow_players[i].tsid] = yellow_players[i];
	}
}

// Boom. Infect pc with color
function addInfection(pc, color) {
	if(!this.infections[color]) {
		log.info('[GAMES] '+"ERROR attempt to infect player with weird, invalid colour.");
		return;
	}
	this.infections[color]++;
	
	this.players[pc.tsid] = pc;
}

// How many infections does color have?
function getInfections(color) {
	return this.infections[color];
}


/////////////////////////////////////////////////////
//
// The IT game
//

// Init a new game instance, assigning who is IT
function initITGameInInstance(instance){
	log.info('[GAMES] '+this+' init it game instance: '+instance);

	var manager = instance.getInstanceManager();
	var location = apiFindObject(instance.get_entrance());
	if(!location) {
		log.info(this+' [GAMES] '+"Error: instance does not have a valid location");
		return;
	}
	
	var players = location.getActivePlayers();
	
	if (num_keys(players) < 2) {
		log.info(this+' [GAMES] '+"Error: attempt to start IT game in location with insufficient players.");
	}

	this.instance = instance;
	
	// Start all the players
	var start_time = time();
	this.players = {};
	
	for (var i in players){
		if (manager.playerIsOut(players[i])){
			log.info(this+' [GAMES] '+" skipping out player: "+players[i]);
			continue;
		}

		players[i].games_start_it_game(this, start_time);
		this.players[players[i].tsid] = players[i];

		players[i].games_clear_spawn_point();
	}

	this.chooseIt();
}

function chooseIt(){
	log.info('[GAMES] '+this+' choosing it');

	var manager = this.instance.getInstanceManager();
	var location = apiFindObject(this.instance.get_entrance());

	// Choose someone to be it
	var players_copy = [];
	
	var players = location.getActivePlayers();

	// copy array
	for (var i in players) {
		if (manager.playerIsOut(players[i])){
			log.info(this+' [GAMES] '+" skipping out player: "+players[i]);
			continue;
		}

		players_copy.push(players[i]);
	}

	var it = choose_one(players_copy);
	if (it) it.games_is_it();

	return it;
}

// Return tsid of player who is currently "IT"
function whosIt(force){
	if (!force && this.it_time && time() - this.it_time < 1) return null; // NO TAG BACKS!
	return this.it_player;
}

// Set it!
function setIt(pc){
	log.info('[GAMES] '+this+' it_game_tick setIt: '+pc);

	var was_it = this.it_player;

	this.it_player = pc.tsid;
	this.it_time = time();

	if (num_keys(this.players)){
		for (var i in this.players){
			this.players[i].games_it_game_start_scores(pc);
			if (i != was_it && i != this.it_player) this.players[i].announce_sound('CROWN_CHANGES_HANDS');
		}

		this.apiCancelTimer('it_game_tick');
		this.it_game_tick();
	}
}

// Interval function for updating when a player has the crown
function it_game_tick(){
	if (config.is_dev) log.info('[GAMES] '+this+' it game tick');

	if (num_keys(this.players)){
		var it = getPlayer(this.whosIt(true));
		if (it){
			var it_status = it.games_get_it_status();

			var counter = it_status.crown_time;
			if (it_status.crown_start) counter += (time() - it_status.crown_start);
			if (counter > 60) counter = 60;

			for (var i in this.players){
				this.players[i].games_it_game_update_scores(counter, it.tsid == i);
				//this.players[i].games_scoreboard_update(this.game_type, 0, false, this.instance.getInstanceManager().getScoreboardPlayers(this.instance.getProp('shared_instance_id'), this.instance.getProp('instance_uid')));
			}

			if (counter == 60) it.games_end_it_game();
		}

		if (!it_status || it_status.is_started) this.apiSetTimer('it_game_tick', 1000);
	}
}

function it_game_get_score(pc){
	var it = this.whosIt(true);

	var it_status = pc.games_get_it_status();

	var counter = it_status.crown_time;
	if (pc.tsid == it && it_status.crown_start){
		counter += (time() - it_status.crown_start);
	}

	if (counter > 60) counter = 60;

	return counter;
}

/////////////////////////////////////////////////////
//
// MATH MAYHEMMMM
//

// Init a new game instance
function initMathMayhemInInstance(instance){
	log.info('[GAMES] '+this+' init math mayhem instance: '+instance);

	var manager = instance.getInstanceManager();
	var location = apiFindObject(instance.get_entrance());
	if(!location) {
		log.info(this+' [GAMES] '+"Error: instance does not have a valid location");
		return;
	}
	
	var players = location.getActivePlayers();
	
	if (num_keys(players) < 2) {
		log.info(this+' [GAMES] '+"Error: attempt to start math mayhem in location with insufficient players.");
	}

	this.instance = instance;
	
	// Start all the players
	var start_time = time();
	this.players = {};
	this.teams = {
		'red': [],
		'blue': []
	};


	this.target_score = randInt(10, 100);
	var last_team = null;
	
	for (var i in players){
		if (manager.playerIsOut(players[i])){
			log.info(this+' [GAMES] '+" skipping out player: "+players[i]);
			continue;
		}

		switch (last_team){
			case null:
			case 'red':
				var team = 'blue';
				break;
			case 'blue':
				var team = 'red';
				break;			
		};

		last_team = team;

		players[i].games_start_math_mayhem(this, start_time, 1+this.teams[team].length, team, this.target_score);
		this.players[players[i].tsid] = players[i];
		this.teams[team].push(players[i].tsid);

		players[i].games_clear_spawn_point();
	}
}

function math_mayhem_get_score(pc){
	return pc.games_get_math_mayhem_status().score;
}

function math_mayhem_get_target(){
	return this.target_score;
}

function math_mayhem_set_winner(pc){
	this.winner = pc;
}

function math_mayhem_get_winner(){
	return this.winner;
}

/////////////////////////////////////////////////////
//
// Race!
//

function initRaceInInstance(instance) {
	log.info('[GAMES] '+this+' init race instance: '+instance);
	
	var manager = instance.getInstanceManager();
	var location = apiFindObject(instance.get_entrance());
	if(!location) {
		log.info(this+' [GAMES] '+"Error: instance does not have a valid location");
		return;
	}
	
	var players = location.getActivePlayers();
	
	if (num_keys(players) < 2) {
		log.info(this+' [GAMES] '+"Error: attempt to start race in location with insufficient players.");
	}

	this.instance = instance;
	
	// Start all the players
	var start_time = time();
	this.players = {};

	for (var i in players){
		players[i].games_start_race(this, start_time);
		this.players[players[i].tsid] = players[i];

		players[i].games_clear_spawn_point();
	}
}

function race_set_winner(pc) {
	this.winner = pc.tsid;
	
	// end the game
	pc.games_end_race();
}

function race_get_winner() {
	return this.winner;
}

/////////////////////////////////////////////////////
//
// Quoin Grab!
//

function initQuoinGrabInInstance(instance) {
	log.info('[GAMES] '+this+' init quoin grab instance: '+instance);
	
	var manager = instance.getInstanceManager();
	var location = apiFindObject(instance.get_entrance());
	if(!location) {
		log.info(this+' [GAMES] '+"Error: instance does not have a valid location");
		return;
	}
	
	var players = location.getActivePlayers();
	
	if (num_keys(players) < 2) {
		log.info(this+' [GAMES] '+"Error: attempt to start quoin grab in location with insufficient players.");
	}

	this.instance = instance;
	
	// Start all the players
	var start_time = time();
	this.players = {};
	this.scores = {};

	log.info("Found players "+players);

	// Build score data
	for (var i in players){
		this.players[players[i].tsid] = players[i];
		this.scores[players[i].tsid] = 0;

		players[i].games_clear_spawn_point();
	}

	// Start the game
	for (var i in players){
		players[i].games_start_quoin_grab(this, start_time);
	}
}

function quoin_grab_set_winner(pc) {
	this.winner = pc.tsid;
	
	// end the game
	pc.games_end_quoin_grab();
}

function quoin_grab_get_winner() {
	return this.winner;
}

function quoin_grab_get_quoin(pc) {
	log.info("Game Object get quoin");
	
	// Update score
	this.scores[pc.tsid]++;

	// Check winning conditions
	var remaining = pc.get_location().countItemClass('quoin');
	var score_diff = 0;
	
	// Find greatest positive disparity in scores
	for (var i in this.scores) {
		remaining -= this.scores[i];
		
		if (this.scores[pc.tsid] - this.scores[i] > score_diff) {
			score_diff = this.scores[pc.tsid] - this.scores[i];
		}
	}
	
	// We have a winner!
	if (score_diff > remaining || remaining == 0) {
		this.quoin_grab_set_winner(pc);
	} else {
		// Update score overlays
		for (var i in this.players) {
			log.info("Updating player overlay for "+i);
			this.players[i].quoin_grab_update_overlays();
		}
	}
}

function quoin_grab_get_score(pc) {
	if (!this.scores[pc.tsid]) {
		return 0;
	}
	
	return this.scores[pc.tsid];
}

function quoin_grab_get_all_scores() {
	var scores = {};
	
	for (var i in this.scores) {
		if (!this.players[i]) {
			continue;
		}
		scores[i] = {label: this.players[i].label, score: this.scores[i]};
	}
	
	return scores;
}

/////////////////////////////////////////////////////
//
// Cloudhopolis
//

function initCloudhopolisInInstance(instance) {
	log.info('[GAMES] '+this+' init cloudhopolis instance: '+instance);
	
	var manager = instance.getInstanceManager();
	var location = apiFindObject(instance.get_entrance());
	if(!location) {
		log.info(this+' [GAMES] '+"Error: instance does not have a valid location");
		return;
	}
	
	var players = location.getActivePlayers();
	
	if (num_keys(players) < 2) {
		log.info(this+' [GAMES] '+"Error: attempt to start cloudhopolis in location with insufficient players.");
	}

	this.instance = instance;
	
	// Start all the players
	this.start_time = time();
	this.players = {};
	this.scores = {};

	log.info("Found players "+players);

	// Build score data
	for (var i in players){
		this.players[players[i].tsid] = players[i];
		this.scores[players[i].tsid] = 0;

		players[i].games_clear_spawn_point();
	}

	// Start the game
	for (var i in players){
		players[i].games_start_cloudhopolis(this, this.start_time);
	}

	this.apiSetTimer('cloudhopolis_time_end', 60*1000);
	this.apiSetTimer('cloudhopolis_time_tick', 1000);

	location.events_broadcast('player_enter');
}

function cloudhopolis_get_time_remaining(){
	if (!this.start_time) return 60;
	var remaining = (this.start_time + 60 - time());
	if (remaining < 0) remaining = 0;
	return remaining;
}

function cloudhopolis_time_end(){
	log.info('[GAMES] '+this+' cloudhopolis time is up');
	var scores = this.cloudhopolis_get_all_scores();
	var winner = null;
	var best_score = 0;

	for (var i in this.scores){
		if (this.scores[i] >= best_score){
			winner = this.players[i];
			best_score = this.scores[i];
		}
	}

	this.cloudhopolis_set_winner(winner);
}

function cloudhopolis_set_winner(pc) {
	log.info('[GAMES] '+this+' cloudhopolis_set_winner: '+pc);
	this.winner = pc.tsid;
	
	// end the game
	pc.games_end_cloudhopolis();
}

function cloudhopolis_get_winner() {
	return this.winner;
}

function cloudhopolis_time_tick() {
	log.info('[GAMES] '+this+' cloudhopolis_time_tick');

	if (this.cloudhopolis_get_time_remaining() <= 0) return;

	// Update score overlays
	for (var i in this.players) {
		log.info("[GAMES] Updating player overlay for "+i);
		this.players[i].cloudhopolis_update_overlays();
	}

	this.apiSetTimer('cloudhopolis_time_tick', 1000);
}

function cloudhopolis_get_quoin(pc) {
	log.info("[GAMES] Game Object get quoin");
	
	// Update score
	this.scores[pc.tsid]++;

	// Update score overlays
	for (var i in this.players) {
		log.info("[GAMES] Updating player overlay for "+i);
		this.players[i].cloudhopolis_update_overlays();
	}
}

function cloudhopolis_get_score(pc) {
	if (!this.scores[pc.tsid]) {
		return 0;
	}
	
	return this.scores[pc.tsid];
}

function cloudhopolis_get_all_scores() {
	var scores = {};
	
	for (var i in this.scores) {
		if (!this.players[i]) {
			continue;
		}
		scores[i] = {label: this.players[i].label, score: this.scores[i]};
	}
	
	return scores;
}

/////////////////////////////////////////////////////
//
// Hogtied Piggy Race!
//

function initHogtiePiggyInInstance(instance) {
	log.info('[GAMES] '+this+' init hogtie piggy instance: '+instance);
	
	var manager = instance.getInstanceManager();
	var location = apiFindObject(instance.get_entrance());
	if(!location) {
		log.info(this+' [GAMES] '+"Error: instance does not have a valid location");
		return;
	}
	
	var players = location.getActivePlayers();
	
	if (num_keys(players) < 2) {
		log.info(this+' [GAMES] '+"Error: attempt to start hogtie piggy in location with insufficient players.");
	}

	this.instance = instance;
	
	// set up instance
	var setCollisions = function(it){
		if (it && (it.class_tsid == 'npc_piggy' || it.class_tsid == 'pig_bait')){
			it.apiSetHitBox(100, 50);
			it.apiSetPlayersCollisions(true);
		}
	};

	location.items.apiIterate(setCollisions);
	
	// Start all the players
	var start_time = time();
	this.players = {};
	this.scores = {};

	log.info("Found players "+players);

	// Build score data
	for (var i in players){
		this.players[players[i].tsid] = players[i];
		this.scores[players[i].tsid] = 0;

		players[i].games_clear_spawn_point();
	}

	// Start the game
	for (var i in players){
		players[i].games_start_hogtie_piggy(this, start_time);
	}
}

function hogtie_piggy_set_winner(pc) {
	this.winner = pc.tsid;
	
	// end the game
	pc.games_end_hogtie_piggy();
}

function hogtie_piggy_get_winner() {
	return this.winner;
}

function hogtie_piggy_add_pig(pc) {
	// Update score
	this.scores[pc.tsid]++;

	// Update score overlays
	for (var i in this.players) {
		log.info("Updating player overlay for "+i);
		this.players[i].hogtie_piggy_update_overlays();
	}
}

function hogtie_piggy_get_score(pc) {
	if (!this.scores[pc.tsid]) {
		return 0;
	}
	
	return this.scores[pc.tsid];
}

function hogtie_piggy_get_all_scores() {
	var scores = {};
	
	for (var i in this.scores) {
		if (!this.players[i]) {
			continue;
		}
		scores[i] = {label: this.players[i].label, score: this.scores[i]};
	}
	
	return scores;
}

/////////////////////////////////////////////////////
//
// Hopefully generic multiplayer game functions
// May contain game-specific logic, with switching based on type
//

// End the game on all players
function cancel(){
	log.info('[GAMES] '+this+" canceling game");
	// Cancel on all players
	for(var i in this.players) {
		switch (this.game_type) {
			case 'color_game':
				this.players[i].games_end_color_game();
				break;
			case 'it_game':
				this.players[i].games_end_it_game();
				break;
			case 'math_mayhem':
				this.players[i].games_end_math_mayhem();
				break;
			case 'race':
				this.players[i].games_end_race();
				break;
			case 'quoin_grab':
				this.players[i].games_end_quoin_grab();
				break;
			case 'cloudhopolis':
				this.players[i].games_end_cloudhopolis();
				break;
			case 'hogtie_piggy':
				this.players[i].games_end_hogtie_piggy();
				break;
		}
	}
}

// A player is finished. Delete them from the records and end the game if everyone is done
function playerFinish(pc){
	log.info('[GAMES] '+this+" playerFinish "+pc);
	if (!this.players[pc.tsid]){
		return;
	}
	
	delete this.players[pc.tsid];
	
	// Are we totally done?
	if (!num_keys(this.players)){
		log.info('[GAMES] '+"Concluding game "+this.game_type+" "+this);

		if (this.instance){
			this.instance.end_game();
		}

		this.apiDelete();
	}
}

// A player is "out". Did they win?
function playerOut(pc, success){
	log.info('[GAMES] '+this+' player out: '+pc);

	// If were started on an instance, notify that instance that we are out
	if(this.instance) {
		this.instance.player_out(pc, success);
	}
}

// The player "left"
function playerLeft(pc){
	log.info('[GAMES] '+this+' player left: '+pc);

	if (!this.players || !this.players[pc.tsid]){
		return;
	}

	if (this.game_type == 'color_game'){
		pc.games_has_stalemate();
	} else if (this.game_type == 'it_game'){
		pc.games_is_not_it();
		pc.games_it_dismiss_overlays();

		var it = this.whosIt(true);
		if (it == pc.tsid){
			this.chooseIt();
		}
	} else if (this.game_type == 'race' || this.game_type == 'quoin_grab' || this.game_type == 'hogtie_piggy' || this.game_type == 'cloudhopolis') {
		this.cancel();
	} else if (this.game_type == 'math_mayhem'){
		pc.games_math_mayhem_dismiss_overlays();
	}

	pc.announce_music_stop('WAITING_MUZAK');

	if (this.instance && pc.games_get_spawn_point()){
		var pt = pc.games_get_spawn_point();
		this.instance.add_spawn_point(pt.x, pt.y);

		pc.games_clear_spawn_point();
	}
}

// The player "entered"
function playerEntered(pc){
	log.info('[GAMES] '+this+' player entered: '+pc);

	if (!this.players[pc.tsid]){
		return;
	}

	if (this.game_type == 'it_game'){

		var it = getPlayer(this.whosIt(true));

		if (!it || !apiIsPlayerOnline(it.tsid)) it = this.chooseIt();
		
		pc.games_it_game_start_scores(it);

		it.games_set_it_map();

		this.it_game_tick();
	}
}

// Scoreboard function. What is the player's score?
function getPlayerScore(pc){
	if (this.game_type == 'color_game'){
		return pc.games_color_get_infections();
	} else if (this.game_type == 'it_game'){
		return this.it_game_get_score(pc);
	} else if (this.game_type == 'math_mayhem'){
		return this.math_mayhem_get_score(pc);
	} else if (this.game_type == 'quoin_grab') {
		return this.quoin_grab_get_score(pc);
	} else if (this.game_type == 'cloudhopolis') {
		return this.quoin_grab_get_score(pc);
	}

	return 0;
}

// Scoreboard function. Is the player "IT" or whatever?
function getPlayerIsActive(pc){
	if (this.game_type == 'it_game'){
		return this.whosIt(true) == pc.tsid ? true : false;
	}

	return false;
}