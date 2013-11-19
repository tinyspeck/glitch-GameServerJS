//#include ../items/include/events.js

/* Shared instance manager objects are created to manage multiplayer games or any other activities which are:
 *		- Multiplayer
 *		- Repeatable
 *		- Globally shared
 *
 * Shared instance games differ from races in that they are repeatable and not mediated via a single player.
 * An id does not specify a particular instance. Instead it is a particular game or event which may contain
 * multiple instances. Players join by id, and the shared instance manager attempts to do matchmaking in
 * order to perform the following tasks:
 *		- If no available instance exists for the id, create a new one.
 *		- If multiple available instances exist, pick the 'best' one.
 *
 * When a player joins an instance, the manager performs the following tasks:
 *		- If at least the minimum number of players are in the instance and the instance timer has elapsed, it starts the associated game.
 *		- Else, if fewer than the minimum number of players are in the instance or the timer has not elapsed, it waits.
 *
 * When a game is finished, all players are notified with an option to rejoin the same instance in a new game, or leave.
 *
 * When a player logs in inside an instance, if the current game is no longer the game they started playing, they are kicked.
 *
 * When a player is waiting inside an instance, they see a prompt explaining that the instance is waiting for more players, and have the option to leave.
 *
 * When a player has completed a game, if they do not respond to the prompt to rejoin or leave by the time the next game starts, they are kicked.
 */



/////////////////////////////////////////////////////
//
// Public interface. You will be using these functions to assign players to game instances
//

// Join an available instance of a given type.
function playerJoinInstance(pc, id, force_uid, location_id) {
	if(!config.shared_instances || !config.shared_instances[id]) {
		log.info('[GAMES] '+"Error: attempt to add player to instance of unknown type.");
	}
	
	var found_instance = false;
	
	// Retrieve the list of available instances of this id
	log.info('[GAMES] '+this+' looking for instances of type '+id+' for '+pc);

	var available_instances = this.findAvailableInstances(id, location_id);
	if(num_keys(available_instances) && force_uid !== true) {
		// pick the best
		var uid = 0;
		var most_players = 0;

		for (var i in available_instances){
			var ready = this.countReadyPlayers(id, available_instances[i]);
			var not_ready = this.countNonReadyPlayers(id, available_instances[i]);
			var player_count = ready + not_ready;

			// Fill first: instances with the most players that are under their maximum player count
			var it = available_instances[i];
			if (!uid || (most_players < player_count && player_count < config.shared_instances[id].max_players && !force_uid) || (force_uid && force_uid == it)){
				uid = it;
				most_players = player_count;
			}
		}

		this.playerJoinExistingInstance(pc, id, uid);
	} else {
		// No available instances. Create one and put us in it.
		if(location_id != undefined && config.shared_instances[id].locations.length > location_id) {
			var location_tsid = config.shared_instances[id].locations[location_id];
		} else {
			var location_tsid = choose_one(config.shared_instances[id].locations);
		}
		
		
		var uid = this.playerJoinNewInstance(pc, id, location_tsid);
	}
	
	// Add player
	if (!this.players) {
		this.players = {};
	}
	
	this.players[pc.tsid] = {pc: pc, id: id, instance_uid: uid, waiting: true, start_prompted: true};

	return uid;
}

// The player has entered the instance
function onSharedInstanceEnter(pc) {
	if(!this.players[pc.tsid]) {
		return;
	}
	
	log.info('[GAMES] '+this+' '+pc+' entered');
	var id = this.players[pc.tsid].id;
	var uid = this.players[pc.tsid].instance_uid;
	
	// Start scoreboard for the game
/*	pc.games_scoreboard_start(id, this.getGameTitle(id), 0, this.getScoreboardPlayers(id, uid));

	var players = this.getPlayers(id, uid);
	for (var i in players){
		if (players[i] == pc.tsid) {
			continue;
		}

		var this_player = getPlayer(players[i]);
		if (!this_player) {
			continue;
		}
		
		this_player.games_scoreboard_update(id, 0, false, this.getScoreboardPlayers(id, uid));
	}*/
	
	if (this.players[pc.tsid].waiting){
		log.info('[GAMES] '+this+' '+pc+' entered, showing instructions');

		// Otherwise, we need a freezing overlay
		this.players[pc.tsid].start_prompted = true;

		// REMOVEME: In for backwards compatibility. Now using splash screens.
		if (!config.shared_instances[id].splash) {
			if (id == 'it_game'){
				var title_overlay = 'game_of_crowns_title';
				var title_position = '45%';
				var start_overlay = 'click_to_start_button';
				var start_position = '58%';
				var title_width = 400;
			} else if (id == 'color_game'){
				var title_overlay = 'color_game_title';
				var title_position = '45%';
				var start_overlay = 'click_to_start_color_game';
				var start_position = '51%';
				var title_width = 400;
			} else if (id == 'math_mayhem'){
				var title_overlay = 'color_game_title';
				var title_position = '45%';
				var start_overlay = 'click_to_start_color_game';
				var start_position = '51%';
				var title_width = 400;
			} else if (id == 'race') {
				var title_overlay = 'race_logo';
				var title_position = '24%';
				var start_overlay = 'click_to_start_button';
				var start_position = '51%';			
				var instructions_text = 'Be the first to the finish line!';
				var instructions_position = '62%';
				var title_width = 400;
			} else if (id == 'quoin_grab') {
				var title_overlay = 'grabemgood_logo';
				var title_position = '30%';
				var start_overlay = 'click_to_start_button';
				var start_position = '65%';						
				var title_width = 300;
			} else {
				log.error(this+' unrecognized game id: '+id);
				return;
			}


			pc.apiSendAnnouncement({
				uid: "game_instructions",
				type: "vp_overlay",
				duration: 0,
				locking: true,
				width: title_width,
				y: title_position,
				x: '50%',
				click_to_advance: false,
				swf_url: overlay_key_to_url(title_overlay)
			});

			if(instructions_text) {
				pc.apiSendAnnouncement({
					uid: "game_instructions_text",
					type: "vp_overlay",
					duration: 0,
					locking: false,
					width: 500,
					y: instructions_position,
					x: '50%',
					text: [
						'<p align="center"><span class="game_splash_race">'+instructions_text+'</span></p>'
					]
				});
			}

			pc.apiSendAnnouncement({
				uid: "click_to_start",
				type: "vp_overlay",
				duration: 0,
				locking: true,
				width: 200,
				y: start_position,
				x: '50%',
				click_to_advance: false,
				swf_url: overlay_key_to_url(start_overlay),
				mouse: {
					is_clickable: true,
					allow_multiple_clicks: false,
					click_payload: {pc_callback: 'games_accept_start_button', id: id, instance_id: this.getInstanceName(id)},
					dismiss_on_click: false
				}
			});
		} else {
			pc[config.shared_instances[id].splash](this.getInstanceName(id));
		}
		

		pc.apiSetTimer('games_auto_leave', 2 * 60 * 1000);
	}
	else{
		if (this.isGameStarted(id, uid) && this.instances[id][uid].game){
			this.instances[id][uid].game.playerEntered(pc);
		}
		else{
			this.players[pc.tsid].waiting = true;
			this.onSharedInstanceEnter(pc);
		}
	}
}


/////////////////////////////////////////////////////
//
// Less public interface. You probably don't care about these, but code in other libraries calls them
//

// Check and see if we have just reached the minimum number of players.
// If so, set a timer for other players to join.
function dismissOverlaysAndStart(pc){
	if(!this.players[pc.tsid] || !this.players[pc.tsid].waiting) {
		return;
	}
	
	var id = this.players[pc.tsid].id;
	var uid = this.players[pc.tsid].instance_uid;
	var loc = apiFindObject(this.instances[id][uid].get_entrance());

	log.info('[GAMES] '+this+' '+pc+' dismiss overlays and start: '+id+', '+uid);

	delete this.players[pc.tsid].start_prompted;

	//pc.overlay_dismiss('game_instructions');
	pc.overlay_dismiss('click_to_start');

	pc.apiSendAnnouncement({
		uid: "game_waiting",
		type: "vp_overlay",
		duration: 0,
		locking: true,
		width: 200,
		y: '50%',
		x: '50%',
		click_to_advance: false,
		swf_url: overlay_key_to_url('game_of_crowns_throbber')
	});

	if (!this.players[pc.tsid].prompt_uid){
		this.players[pc.tsid].prompt_uid = pc.prompts_add({
			txt		: "You must wait for more players before this game can begin.",
			icon_buttons	: false,
			choices		: [
				{ value : 'leave', label : 'Leave' }
			],
			callback: 'games_leave_instance'
		});
	}

	var min_players = config.shared_instances[id].min_players;
	if (config.shared_instances[id].min_retry_players) min_players = config.shared_instances[id].min_retry_players;

	if (this.canStartGame(id, uid) && !this.events_has(function(details){return details.callback == 'startWithMinimumPlayers' && details.id == id && details.uid == uid;})){

		log.info('[GAMES] '+"Ready players: "+this.countReadyPlayers(id, uid)+" out of "+min_players+" minimum players. Setting start timer.");
		this.events_add({callback:'startWithMinimumPlayers', id: id, uid: uid}, 5);

		loc.sendActivity('is ready to play. LET\'S GO!', pc);

		// Tell people it's starting
		var players = loc.getActivePlayers();
		var ready_players = this.getReadyPlayers(id, uid);

		for (var i in ready_players){
			var rpc = players[ready_players[i]];
			log.info('[GAMES] '+this+' rpc is '+rpc);
			if (!rpc) continue;

			rpc.overlay_dismiss('game_instructions');
			rpc.overlay_dismiss('game_instructions_text');
			rpc.overlay_dismiss('game_waiting');

			if (this.players[rpc.tsid]){
				rpc.prompts_remove(this.players[rpc.tsid].prompt_uid);
				delete this.players[rpc.tsid].prompt_uid;
			}

			rpc.apiSendAnnouncement({
				uid: "game_waiting",
				type: "vp_overlay",
				duration: 5000,
				locking: true,
				width: 500,
				x: '50%',
				top_y: '15%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog">YAY! THE GAME IS STARTING SOON.</span></p>'
				]
			});

			rpc.announce_music_stop('WAITING_MUZAK');
			rpc.announce_sound('GAME_STARTING_SOON');
		}
	}
	else if (this.isGameStarted(id, uid)){
		log.info('[GAMES] '+this+' '+pc+' game has started, FREEEEEEEDOM');

		// Game already started! Quick, let me go!

		pc.overlay_dismiss('game_instructions');
		pc.overlay_dismiss('game_instructions_text');
		pc.overlay_dismiss('game_waiting');

		if (this.players[pc.tsid]){
			pc.prompts_remove(this.players[pc.tsid].prompt_uid);
			delete this.players[pc.tsid].prompt_uid;
			this.players[pc.tsid].waiting = false;
		}
	}
	else{
		pc.announce_music('WAITING_MUZAK', 10);

		var remaining = (min_players-this.countReadyPlayers(id, uid));
		if (remaining > 0){
			loc.sendActivity('is ready to play. Need '+remaining+' more.', pc);
		}
		else{
			loc.sendActivity('is ready to play. Just waiting on a few more slackers to HIT THE START BUTTON.', pc);
		}
	}
}

// Timer function to start the game. Don't call this directly.
function startWithMinimumPlayers(details) {
	log.info('[GAMES] '+this+' start with minimum players');

	// Make sure we still have at least enough people.
	var min_players = config.shared_instances[details.id].min_players;
	if (config.shared_instances[details.id].min_retry_players) min_players = config.shared_instances[details.id].min_retry_players;

	if (this.countReadyPlayers(details.id, details.uid) < min_players && !this.instances[details.id][details.uid].has_game_running()){
		return;
	}
	
	// Start!
	this.startCountdown(details.id,details.uid);
}

// Reset the player as waiting and then pretend to re-enter to reset starting position, etc
function resetPlayer(pc){
	log.info('[GAMES] '+this+' '+pc+' resetting');
	if(!this.players[pc.tsid]) {
		return;
	}

	this.players[pc.tsid].waiting = true;
	delete this.players[pc.tsid].is_out;
	delete this.players[pc.tsid].leave_prompt_uid;
	this.onSharedInstanceEnter(pc);
}

function playerIsOut(pc){
	log.info('[GAMES] '+this+' '+pc+' playerIsOut');

	if(!this.players[pc.tsid]) {
		return true;
	}

	return this.players[pc.tsid].is_out;
}

// Player is exiting the shared instance
function playerLeavingInstance(pc) {
	if(!this.players[pc.tsid]) {
		log.info('[GAMES] '+"Error: somehow, player "+pc+" is attempting to leave shared instance without actually being there.");
		log.printStackTrace();
		return;
	}

	log.info('[GAMES] '+this+' '+pc+' leaving instance');

	var last_player = false;

	// Find the player's instance
	var id = this.players[pc.tsid].id;
	var instance_uid = this.players[pc.tsid].instance_uid;

	if (this.instances[id] && this.instances[id][instance_uid]){
		last_player = this.instances[id][instance_uid].count_members() == 1;
	}
	else{
		last_player = true;
	}
		
	if(last_player) {
		log.info('[GAMES] '+this+' '+pc+' last player. Killing instance');
		this.killInstance(id, instance_uid);
	}
	
	delete this.players[pc.tsid];
}

// Kick a player from whatever instance they're in:
function kickPlayer(pc) {
	if(!this.players[pc.tsid]) {
		log.info('[GAMES] '+this+' '+pc+' trying to kick, but not a player');
		return;

	}
	
	log.info('[GAMES] '+this+' '+pc+' kicking');

	// Find the player's instance
	var id = this.players[pc.tsid].id;
	// Evacuate player from instance location
	pc.instances_exit(this.getInstanceName(id));
}


// Player is done with the game. Take them out.
function playerOut(pc, success) {
	if(!this.players[pc.tsid]) {
		return;
	}
	
	log.info('[GAMES] '+this+' '+pc+' is out');

	var id = this.players[pc.tsid].id;
	var uid = this.players[pc.tsid].instance_uid;
	
	var exit = this.instances[id][uid].get_exit_point();
	
	pc.teleportToLocation(this.instances[id][uid].get_entrance(), exit.x, exit.y);
}

// How many players are ready to play?
function countReadyPlayers(id, uid){
	return this.getReadyPlayers(id, uid).length;
}

function getReadyPlayers(id, uid){

	var players = [];
	for (var i in this.players){
		if (this.players[i] && this.players[i].id == id && this.players[i].instance_uid == uid && this.players[i].waiting && !this.players[i].start_prompted && apiIsPlayerOnline(i)) players.push(i);
	}

	return players;
}

function countNonReadyPlayers(id, uid){
	return this.getNonReadyPlayers(id, uid).length;
}

function getNonReadyPlayers(id, uid){
	var players = [];
	for (var i in this.players){
		if (this.players[i] && this.players[i].id == id && this.players[i].instance_uid == uid && this.players[i].waiting && this.players[i].start_prompted && apiIsPlayerOnline(i)) players.push(i);
	}

	return players;
}

function countOfflinePlayers(id, uid){
	return this.getOfflinePlayers(id, uid).length;
}

function getOfflinePlayers(id, uid){
	var players = [];
	for (var i in this.players){
		if (this.players[i] && this.players[i].id == id && this.players[i].instance_uid == uid && !apiIsPlayerOnline(i)) players.push(i);
	}

	return players;
}

function countPlayers(id, uid){
	return this.getPlayers(id, uid).length;
}

function getPlayers(id, uid){
	var players = [];
	for (var i in this.players){
		if (this.players[i] && this.players[i].id == id && this.players[i].instance_uid == uid && apiIsPlayerOnline(i)) players.push(i);
	}

	return players;
}


/////////////////////////////////////////////////////
//
// Internal functions. Game management, etc. You will probably not call these, and neither will outside code
//

function initSharedInstanceManager() {
	log.info('[GAMES] '+"Creating new shared instance manager "+this);
}

function getInstanceName(id) {
	return id+'_instance';
}

function getNewInstanceUID(id) {
	var uid = time();
	var collision = false;
	do {
		collision = false;
		for(var i in this.instances[id]) {
			if(uid == i) {
				uid++;
				collision = true;
			}
		}
	} while (collision);
	
	return uid;
}

function addInstanceOfType(id, location_tsid) {
	if(!this.instances) {
		this.instances = {};
	}
	if(!this.instances[id]) {
		this.instances[id] = {};
	}
	
	// Get a new UID
	var uid = this.getNewInstanceUID(id);
	
	// Create instance
	var new_instance = apiNewGroup('instance');
	new_instance.init(this.getInstanceName(id), location_tsid, {shared_instance_id: id, instance_uid: uid, game_uid: 0, game_running: false, shared_instance_manager: this}, {is_game: true, game_type: id});
	
	this.instances[id][uid] = new_instance;
	
	new_instance.populate_spawn_points();
	
	log.info('[GAMES] '+"Adding instance type "+id+" with instance uid "+uid+" to shared instance manager "+this);
	
	return uid;
}

function playerJoinNewInstance(pc, id, location_tsid) {
	log.info('[GAMES] '+"Creating new instance of type "+id);
	var new_instance_index = this.addInstanceOfType(id, location_tsid);
	
	log.info('[GAMES] '+"Adding player "+pc+" to new instance of type "+id+" with uid "+new_instance_index);
	this.playerJoinExistingInstance(pc, id, new_instance_index);
	
	return new_instance_index;
}

function playerJoinExistingInstance(pc, id, index) {
	pc.instances_add(this.getInstanceName(id), this.instances[id][index]);

	log.info('[GAMES] '+"Joining player "+pc+" to existing instance of type "+id+" with uid "+index);
	// Find spawn point
	var spawn_point = this.instances[id][index].get_spawn_point();
	if(!spawn_point) {
		pc.instances_enter(this.getInstanceName(id), 0, 0);
	} else {
		pc.games_assign_spawn_point(spawn_point.x, spawn_point.y);
		pc.instances_enter(this.getInstanceName(id), spawn_point.x, spawn_point.y);
	}
}

// The given instance is done. No more playing will occur. Get rid of it so we don't put players in it
function killInstance(id, index) {
	delete this.instances[id][index];
}

// Return all available instances
function findAvailableInstances(id, location_id) {
	var indices = [];

	if (!this.instances) return indices;
	
	log.info('[GAMES] '+this+' looking for instances of type '+id);
	for (var i in this.instances[id]){
		log.info('[GAMES] '+this+' checking instance '+i);
		// Clean up hanging pointers
		if (!this.instances[id][i]){
			log.info('[GAMES] '+this+' deleting dead instance '+id+', '+i+': '+this.instances[id][i]);
			this.killInstance(id, i);
			continue;
		}

		// Skip instances with game running
		if (this.isGameStarted(id, i)){
			log.info('[GAMES] '+this+' skipping started instance '+id+', '+i+': '+this.instances[id][i]);
			continue;
		}


		if (!this.countSpawnPoints(id, i)){
			log.info('[GAMES] '+this+' has no spawn points '+id+', '+i+'');
			continue;
		}
		
		// If a location id was specified and exists, is this instance the right location id?
		if (location_id != undefined) {
			// Get the instance location
			var loc = apiFindObject(this.instances[id][i].locations[0]);
			
			if (loc && (config.shared_instances[id].locations.length <= location_id || loc.instance_of != config.shared_instances[id].locations[location_id])) {
				log.info("Skipping instance "+i+". Location is "+this.instances[id][i].locations[0]+" and we are looking for "+config.shared_instances[id].locations[location_id]);
				continue;
			}
		}

		// Push instances with players under the max players threshold
		if (this.instances[id][i].count_members() < config.shared_instances[id].max_players) {
			log.info('[GAMES] '+this+' adding non-full instance '+id+', '+i+': '+this.instances[id][i]);
			indices.push(i);
		}
	}
	
	return indices;
}

// Convenience function to see if a given game instance can start yet
// (minimum players, not currently running)
function canStartGame(id, instance_uid) {
	if (!this.instances[id] || !this.instances[id][instance_uid]) return false;
	return this.instances[id][instance_uid].can_start_game();
}

function isGameStarted(id, instance_uid) {
	if (!this.instances[id] || !this.instances[id][instance_uid]) return false;
	return this.instances[id][instance_uid].has_game_running();
}

// Flag the game as "running", start the countdown overlays
function startCountdown(id, uid) {
	log.info('[GAMES] '+this+' starting countdown: '+id+', '+uid);

	this.instances[id][uid].init_game();

	var loc = apiFindObject(this.instances[id][uid].get_entrance());
	var players = loc.getActivePlayers();
	for(var i in players) {
		if (this.playerIsOut(players[i])){
			log.info('[GAMES] '+this+' skipping out player: '+players[i]);
			players[i].games_leave_instance('again', {forced: true});
			continue;
		}


		players[i].overlay_dismiss('game_instructions');
		players[i].overlay_dismiss('game_instructions_text');
		players[i].overlay_dismiss('game_waiting');
		players[i].overlay_dismiss('click_to_start');
		if(this.players[players[i].tsid]) {
			this.players[players[i].tsid].waiting = false;
			players[i].prompts_remove(this.players[players[i].tsid].prompt_uid);
			delete this.players[players[i].tsid].prompt_uid;
		}

		// Start countdown
		players[i].apiSendAnnouncement({
			type: 'vp_overlay',
			duration: 4000,
			swf_url: overlay_key_to_url('321_countdown'),
			locking: true,
			dismissible: false,
			x: '50%',
			top_y: '50%',
			width: 350,
			height: 350,
			uid: 'game_countdown'
		});

		players[i].announce_sound('COUNT_DOWN');
	}
	
	this.events_add({callback: 'startGame', id: id, uid: uid}, 3);
}

// Timer function for releasing players and starting the game
function startGame(details) {
	log.info('[GAMES] '+this+' start game: '+details);

	var loc = apiFindObject(this.instances[details.id][details.uid].get_entrance());
	var players = loc.getActivePlayers();
	
	for(var i in players) {
		if (this.playerIsOut(players[i])){
			log.info('[GAMES] '+this+' skipping out player: '+players[i]);
			continue;
		}

		players[i].overlay_dismiss('game_countdown');
		players[i].overlay_dismiss('game_instructions');
		players[i].overlay_dismiss('game_instructions_text');
		players[i].overlay_dismiss('game_waiting');
	}
	
	this.instances[details.id][details.uid].start_game(details.id);
}

// The game has ended. Reset things, let players know
function endGame(id, uid) {
	log.info('[GAMES] '+this+" shared instance endGame: "+id+", "+uid);
	this.instances[id][uid].clear_game_running();

	// Notify all players
	var loc = apiFindObject(this.instances[id][uid].get_entrance());
	var players = loc.getAllPlayers();
	
	for(var i in players) {
		if (this.players[players[i].tsid]){
			if (this.players[players[i].tsid].leave_prompt_uid) continue;

			this.players[players[i].tsid].is_out = true;
		}

		if (!apiIsPlayerOnline(players[i].tsid) && config.shared_instances[id].can_retry){
			var uid = players[i].prompts_add({
				txt		: "The game is finished. Thank you for playing! Would you like to stay and play again?",
				timeout_value	: 'leave',
				timeout		: 0,
				icon_buttons	: true,
				choices		: [
					{ value : 'again', label : 'Again!' },
					{ value : 'leave', label : 'Leave' }
				],
				callback: 'games_leave_instance'
			});

			if (this.players[players[i].tsid]){
				this.players[players[i].tsid].leave_prompt_uid = uid;
			}
		}
	}
}

function countSpawnPoints(id, uid) {
	return this.instances[id][uid].count_spawn_points();
}

function getGameTitle(id){
	if (id == 'it_game'){
		return "Game of Crowns";
	}
	else if (id == 'color_game'){
		return "Color Game";
	}
	else if (id == 'math_mayhem'){
		return "Math Mayhem";
	}
	else{
		return "OH GOD YOU FOUND IT";
	}
}

function getScoreboardPlayers(id, uid){
	var players = [];
	for (var i in this.players){
		if (this.players[i] && this.players[i].id == id && this.players[i].instance_uid == uid){
			var player = this.buildPlayerWithScore(i);
			if (!player) continue;

			players.push(player);
		}
	}

	return players;
}

function buildPlayerWithScore(tsid){
	if (!this.players[tsid] || !apiIsPlayerOnline(tsid)) return null;

	var id = this.players[tsid].id;
	var uid = this.players[tsid].instance_uid;

	var instance = this.instances[id][uid];
	if (!instance) return null;

	var pc = this.players[tsid].pc;

	var out = {
		label: pc.label,
		tsid: tsid,
		score: 0,
		is_active: false
	};

	var game = instance.getProp('game');
	if (game){
		out.score = game.getPlayerScore(pc);
		out.is_active = game.getPlayerIsActive(pc);
	}

	return out;
}

function getPlayerStats(){
	var out = {};

	for (var id in this.instances){
		out[id] = {};

		for (var uid in this.instances[id]){
			out[id][uid] = {
				players: this.countPlayers(id, uid),
				ready: this.countReadyPlayers(id, uid),
				not_ready: this.countNonReadyPlayers(id, uid),
				offline: this.countOfflinePlayers(id, uid),
				is_running: this.isGameStarted(id, uid)
			};
		}
	}

	return out;
}