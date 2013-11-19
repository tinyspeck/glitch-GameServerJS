// Games!

// Player-to-player collision for games
function games_handle_player_collision(pc){
	if (this.color_game){
		this.games_infect_player(pc);
	}
	else if (this.it_game){
		this.games_tag_player(pc);
	}
	else if (this.math_mayhem){
		this.games_do_math(pc);
	}
}

//////////////////////////////////////////////////////////////////
//
// Color Game stuff
//

// Start the game for us, assigning a random safe color
function games_start_color_game(game, color, start_time) {
	this.games_init_general();

	if(this.color_game) {
		log.info('[GAMES] '+"Warning Player "+this+" starting Color Game, but is already playing!");
	}
	
	var safe_colors;
	switch(color) {
		case 'red':
			safe_colors = ['orange', 'purple'];
			break;
		case 'blue':
			safe_colors = ['green', 'purple'];
			break;
		case 'yellow':
			safe_colors = ['orange', 'green'];
			break;
	}
	
	var safe_color = choose_one(safe_colors);
		
	this.color_game = {
		game: game,
		start_time: start_time,
		is_done: false,
		infections: 0
	};

	log.info('[GAMES] '+"Starting color game for player "+this+" with color "+color+", secondary color "+safe_color);
	
	this.games_color_game_set_color(color, safe_color);
	
	// The game ends for this player in ten minutes, minus any elapsed time from the official start_time
	var time_remaining = (2*60) - (time() - start_time);
	
	this.apiSetTimer('games_end_color_game', 1000 * time_remaining);
	
	this.setPlayerCollisions(true);
}

// Infect another player
function games_infect_player(pc) {
	if(!this.color_game || this.color_game.is_done) {
		return;
	}

	// The other player is not yet playing. Determine their current colour and safe colour, and start the game.
	if(!pc.color_game) {
		pc.games_start_color_game(this.color_game.game, this.color_game.color, this.color_game.start_time);
		
		// We get another infection. Hurray!
		this.color_game.infections++;
		
		this.color_game.game.addInfection(pc, this.color_game.color);
	} else {
		// The other player is already playing, or we share the same colour.
		if(pc.color_game.is_done || this.color_game.color == pc.color_game.color) {
			return;
		}
		
		// Combine colours
		if(this.color_game.color == 'red' || pc.color_game.color == 'red') {
			// One player is red, and the other is not red.
			if(this.color_game.color == 'yellow' || pc.color_game.color == 'yellow') {
				this.games_color_finish_on_color('orange');
				pc.games_color_finish_on_color('orange');
			} else {
				this.games_color_finish_on_color('purple');
				pc.games_color_finish_on_color('purple');				
			}
		} else {
			// Neither player is red, hence one player is blue and the other is yellow.
			this.games_color_finish_on_color('green');
			pc.games_color_finish_on_color('green');
		}
	}
	// It's possible that completing this action created a stalemate, so check for that and report to the game if necessary
	if(this.games_has_stalemate()) {
		this.color_game.game.cancel();
	}	
}

function games_color_get_infections(){
	return this.color_game ? this.color_game.infections : 0;
}

// The game is over for us
function games_end_color_game() {
	if(!this.color_game) {
		return;
	}
	
	this.apiCancelTimer('games_end_color_game');

	this.setPlayerCollisions(false);
	
	var reds = this.color_game.game.getInfections('red');
	var yellows = this.color_game.game.getInfections('yellow');
	var blues = this.color_game.game.getInfections('blue');

	this.achievements_increment('color_game', 'infections', reds+yellows+blues);
	this.achievements_increment('color_game', 'infections_red', reds);
	this.achievements_increment('color_game', 'infections_yellow', yellows);
	this.achievements_increment('color_game', 'infections_blue', blues);
	
	if(!this.color_game.is_done) {
		this.prompts_add({
			txt: "Time's up! The stats were: red "+reds+", blue "+blues+", yellow "+yellows+". You failed to reach your safe colour. Better luck next time!", 
			title: "The Color Game",
			is_modal: true,
			callback: 'games_leave_instance',
			choices: [
				{ value: "again", label: "Play again!"},
				{ value: "leave", label: "Leave!"}
			]});
	} else {
		this.prompts_add({
			txt: "The game is over! The stats were: red "+reds+", blue "+blues+", yellow "+yellows+". Good job and thanks for playing.", 
			title: "The Color Game",
			is_modal: true,
			callback: 'games_leave_instance',
			choices: [
				{ value: "again", label: "Play again!"},
				{ value: "leave", label: "Leave!"}
			]});
	}
	
	this.games_set_color_group();
	
	this.color_game.game.playerFinish(this);
	delete this.color_game;

	this.games_scoreboard_end('color_game');
}

// The game is over for us on a certain color
function games_color_finish_on_color(end_color) {
	if(!this.color_game) {
		return false;
	}
	
	this.color_game.is_done = true;
	this.games_color_game_set_color(end_color);

	this.setPlayerCollisions(false);
	
	// Are we our safe color? Then do something good.
	if(this.color_game.color == this.color_game.safe_color) {
		/*this.prompts_add({
			txt: "You have reached your safe colour, and you infected "+this.color_game.infections+" people. Congratulations!", 
			title: "A Fun, New Game!",
			is_modal: true,
			choices: [{
				value: "ok",
				label: "OK"
			}]});*/
		
		this.apiSendAnnouncement({
			uid: "color_game_tip",
			type: "vp_overlay",
			duration: 3000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_brain">You have reached your safe colour, and you infected '+this.color_game.infections+' people. Congratulations!</span></p>'
			]
		});

		this.achievements_increment('color_game', 'wins');
		this.color_game.game.playerOut(this, true);
	} else {
		/*this.prompts_add({
			txt: "YOU'RE OUT! That is not your safe colour. You infected "+this.color_game.infections+" people, but none of them count. Better luck next time.", 
			title: "A Fun, New Game!",
			is_modal: true,
			choices: [{
				value: "ok",
				label: "OK"
			}]});*/
		
		this.apiSendAnnouncement({
			uid: "color_game_tip",
			type: "vp_overlay",
			duration: 3000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_brain">YOU\'RE OUT! That is not your safe colour. You infected '+this.color_game.infections+' people, but none of them count. Better luck next time.</span></p>'
			]
		});

		this.achievements_increment('color_game', 'losses');
		this.color_game.game.playerOut(this, false);
	}
}

// Get colors, based on our current status
function games_color_get_colors(colors) {
	// Compute outgoing colour and secondary colour based on game status:
	if(this.color_game.is_done) {
		colors.out_color = '#888888';
		colors.out_color_secondary = '';
	} else {
		// Do primary colour
		switch(this.color_game.color) {
			case 'red':
				colors.out_color = '#CC0000';
				break;
			case 'blue':
				colors.out_color = '#0C6AE0';
				break;
			case 'yellow':
				colors.out_color = '#FFFF00';
				break;
		}
		
		// Do secondary colour
		switch(this.color_game.safe_color) {
			case 'purple':
				colors.out_color_secondary = '#9900FF';
				break;
			case 'green':
				colors.out_color_secondary = '#00CE00';
				break;
			case 'orange':
				colors.out_color_secondary = '#FF9900';
				break;
		}
	}
	
}

// Set our colors
function games_color_game_set_color(color, secondary_color) {
	this.color_game.color = color;
	if(secondary_color) {
		this.color_game.safe_color = secondary_color;
	}
	
	var colors = {};
	this.games_color_get_colors(colors);
	
	this.games_set_color_group(colors.out_color, colors.out_color_secondary);	
}

// Tell the client about our colors
function games_set_color_group(color, secondary_color) {
	this.color_group = color;
	
	var msg = {
		type: 'pc_game_flag_change',
		pc: {
			tsid: this.tsid,
			label: this.label,
			location: {
				tsid: this.location.tsid,
				label: this.location.label
			},
			color_group: color,
			secondary_color_group: secondary_color,
			show_color_dot: true
		}
	};
	
	this.location.apiSendMsg(msg);
}

function games_get_color_group() {
	return this.color_group;
}


//////////////////////////////////////////////////////////////////
//
// IT Game stuff
//

function games_it_game_splash(instance_id) {
	this.apiSendMsg({
		type:'game_splash_screen',
		tsid:'it_game',
		graphic: {
			url: overlay_key_to_url('game_of_crowns_logo'),
			scale: 0.75  //will scale the graphic 150%. NOTE, ONLY DO THIS WITH SWF FILES!!!
		},
		show_rays:false, //if you want the white animated rays behind the logo
		text:'<font size="24">Hold the crown for <font size="35">60</font> seconds to win</font><br />'+
			'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Tag the player with the crown to steal it<br />'+
			'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• The crown can\'t be stolen when locked<br />'+
			'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Only time below the "play line" counts',
		text_delta_x: 0,  //how much to nudge the text left or right. Default is centered to the graphic
		text_delta_y: 60,  //how much to nudge text below the graphic. Default is 0 which snugs it tight to the graphic
		buttons: {
			is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
			padding: 10, //space between buttons
			delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
			delta_y: -170,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
			values: { //ordered list of buttons
				0:{
					label:"Click to Start",
					click_payload: { does_close:true, pc_callback: 'games_accept_start_button', id: 'it_game', instance_id: instance_id }, //does_close is an optional param that will tell the client to send the payload and close the splash screen when esc/enter is hit (otherwise it won't do anything)
					w: 150,
					size: 'default', //used from the client.css file (ie. .button_default)
					type: 'minor' //used from the client.css file (ie. .button_minor_label)
				}
			}
		}
	});
}

// Start the game for us
function games_start_it_game(game, start_time){
	this.games_init_general();

	if (this.it_game){
		log.info('[GAMES] '+"Warning Player "+this+" starting IT Game, but is already playing!");
	}
			
	this.it_game = {
		game: game,
		start_time: start_time,
		is_done: false,
		is_started: false, // Have they gone through the gate yet?
		crown_time: 0 // How long have they had the crown?
	};

	log.info('[GAMES] '+"Starting IT game for player "+this);
	
	this.setPlayerCollisions(true);

	this.announce_music(choose_one(['GOC_MUSIC_1', 'GOC_MUSIC_2', 'GOC_MUSIC_3']), 10);
}

// Two players tagged
function games_tag_player(pc){
	if (!this.it_game || this.it_game.is_done || !pc.it_game || pc.it_game.is_done){
		return;
	}

	var it = this.it_game.game.whosIt();
	log.info('[GAMES] '+this+" tagged "+pc+", it: "+it);

	// Are either of us it?
	if (it == this.tsid && !this.games_it_game_is_locked() && !this.games_it_is_out()){
		this.games_is_not_it();
		pc.games_is_it();
	}
	else if (it == pc.tsid && !pc.games_it_game_is_locked() && !this.games_it_is_out()){
		pc.games_is_not_it();
		this.games_is_it();
	}
}

function games_it_is_out(){
	if (!this.it_game || this.it_game.is_done){
		log.info('[GAMES] '+this+' is out!');
		return true;
	}

	return false;
}

// We are it!
function games_is_it(){
	if (!this.it_game){
		return;
	}
	
	log.info('[GAMES] '+this+" is now it!");
	this.overlay_dismiss('it_game_tip');

	// Start timer?
	if (this.games_it_game_is_started()){
		log.info('[GAMES] '+this+' is below the play line, starting timer');

		this.it_game.crown_start = time();
		var remaining = 60 - intval(this.it_game.crown_time);
		if (remaining > 60) remaining = 60;
		this.apiSetTimer('games_end_it_game', 1000 * remaining);

		this.apiSendAnnouncement({
			uid: "it_game_tip",
			type: "vp_overlay",
			duration: 3000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_brain">You\'re it! Keep it for '+remaining+' seconds, and win!</span></p>'
			]
		});
	}
	else{
		log.info('[GAMES] '+this+' is above the play line');

		this.apiSendAnnouncement({
			uid: "it_game_tip",
			type: "vp_overlay",
			duration: 3000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_brain">You\'re it! Go through the play line to start the timer!</span></p>'
			]
		});
	}

	// This comes last because it relies on data above
	this.it_game.game.setIt(this);

	// Send overlays
	this.games_it_game_lock(1);
	this.games_set_it_map();
	this.announce_sound('YOU_TAKE_CROWN');
}

function games_set_it_map(){
	log.info('[GAMES] '+this+' set it map');

	var msg = {
		type: 'pc_game_flag_change',
		pc: {
			tsid: this.tsid,
			label: this.label,
			location: {
				tsid: this.location.tsid,
				label: this.location.label
			},
			color_group: '#e5c33f'
		}
	};
	
	this.location.apiSendMsg(msg);
}

// We are not it!
function games_is_not_it(){
	if (!this.it_game){
		return;
	}

	log.info('[GAMES] '+this+" is no longer it!");

	// Cancel overlays
	this.overlay_dismiss('it_game_tip');

	// Cancel timer?
	if (this.games_it_game_is_started()){
		log.info('[GAMES] '+this+' is below the play line, pausing timer');

		if (!this.it_game.crown_start) this.it_game.crown_start = time();
		var delta = time() - this.it_game.crown_start;
		this.it_game.crown_time += delta;

		this.achievements_increment('it_game', 'seconds_with_crown', delta);

		this.apiCancelTimer('games_end_it_game');

		this.apiSendAnnouncement({
			uid: "it_game_tip",
			type: "vp_overlay",
			duration: 3000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_brain">You\'re no longer it! Get it back before they win!</span></p>'
			]
		});
	}
	else{
		log.info('[GAMES] '+this+' is above the play line');

		this.apiSendAnnouncement({
			uid: "it_game_tip",
			type: "vp_overlay",
			duration: 3000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_brain">You\'re no longer it! Get it back and go through the play line to win!</span></p>'
			]
		});
	}

	this.announce_remove_indicator('it_game_crown');
	this.games_set_notit_map();
	this.announce_sound('YOU_LOSE_CROWN');
}

function games_set_notit_map(){
	log.info('[GAMES] '+this+' set not it map');

	var msg = {
		type: 'pc_game_flag_change',
		pc: {
			tsid: this.tsid,
			label: this.label,
			location: {
				tsid: this.location.tsid,
				label: this.location.label
			},
			color_group: null
		}
	};
	
	this.location.apiSendMsg(msg);
}

// Player passed through the starting gate
function games_it_game_gate(){
	if (!this.it_game || this.it_game.is_done){
		return;
	}

	log.info('[GAMES] '+this+' passed through the gate');

	var it = this.it_game.game.whosIt(true);
	if (!this.games_it_game_is_started()){
		this.it_game.is_started = true;

		// If we are it, start the timer
		if (it == this.tsid){
			log.info('[GAMES] '+this+' passed through the starting gate, and is it!');
			this.it_game.crown_start = time();
			this.apiSetTimer('games_end_it_game', 1000 * 60);

			this.overlay_dismiss('it_game_tip');
			this.apiSendAnnouncement({
				uid: "it_game_tip",
				type: "vp_overlay",
				duration: 3000,
				locking: false,
				width: 500,
				x: '50%',
				top_y: '15%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_brain">Stay it for 60 seconds, and you win!</span></p>'
				]
			});

			this.it_game.game.it_game_tick();
		}
	}
	else{
		delete this.it_game.is_started;

		if (it == this.tsid){
			log.info('[GAMES] '+this+' went above the starting gate, and is it!');

			if (!this.it_game.crown_start) this.it_game.crown_start = time();
			this.it_game.crown_time += time() - this.it_game.crown_start;
			this.apiCancelTimer('games_end_it_game');

			this.overlay_dismiss('it_game_tip');
			this.apiSendAnnouncement({
				uid: "it_game_tip",
				type: "vp_overlay",
				duration: 3000,
				locking: false,
				width: 500,
				x: '50%',
				top_y: '15%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_brain">You exited the play area! Go back through the play line to start the timer.</span></p>'
				]
			});
		}
	}
}

// The timer ended, or the game otherwise ended! If we are still it, we win!
function games_end_it_game(){
	if (!this.it_game || this.it_game.is_done){
		return;
	}

	log.info('[GAMES] '+this+" games_end_it_game");

	// End the game
	this.it_game.is_done = true;
	this.setPlayerCollisions(false);
	this.games_it_dismiss_overlays();

	this.announce_music_stop('GOC_MUSIC_1');
	this.announce_music_stop('GOC_MUSIC_2');
	this.announce_music_stop('GOC_MUSIC_3');

	this.apiSetTimerX('announce_music', 5000, 'WAITING_MUZAK', 10);

	var winner = getPlayer(this.it_game.game.whosIt(true));

	if (winner) {
		var splash = {
			type:'game_splash_screen',
			tsid:'it_game',
			graphic: {
				url: overlay_key_to_url('game_of_crowns_winner'),
				scale: 1.0  //will scale the graphic 150%. NOTE, ONLY DO THIS WITH SWF FILES!!!
			},
			show_rays: false, //if you want the white animated rays behind the logo
			buttons: {
				is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
				padding: 10, //space between buttons
				delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
				delta_y: 20,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
				values: { //ordered list of buttons
					0:{
						label:"Play Again",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'again'},
						w: 150,
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					},
					1:{
						label:"Leave the Game",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'leave'},
						w: 150,
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					}
				}
			}
		}


		// Did we win?
		if (winner.tsid == this.tsid){
			log.info('[GAMES] '+this+" games_end_it_game was it!");

			var context = {'verb':'it_game'};
			this.stats_add_xp(200, false, context);
			this.stats_add_currants(50, context);
			this.achievements_increment('it_game', 'won');
			
			if (!this.it_game.crown_start) { 
				log.error("Player "+this.tsid+" won GoC without a crown start time");
			}
			else {
				var delta = time() - this.it_game.crown_start;
				this.achievements_increment('it_game', 'seconds_with_crown', delta);
			}

			// Cancel the game for everyone else
			this.it_game.game.cancel();
			splash.graphic.frame_label = 'you_winner';
			splash.show_rays = true;
			this.announce_sound('YOU_WIN');
		}
		else{
			log.info('[GAMES] '+this+" games_end_it_game was not it, winner was: "+winner);

			this.achievements_increment('it_game', 'lost');
			splash.graphic.text = winner.label;  //format is "game_splash_TSID_graphic" in client.css			
			splash.graphic.text_delta_y = 25;
			splash.graphic.frame_label = 'other_winner';
			this.announce_sound('YOU_LOSE');
		}

		this.apiSendMsg(splash);
	} else {
		this.apiSendMsg({
			type:'game_splash_screen',
			tsid:'it_game',
			graphic: {
				url: overlay_key_to_url('game_of_crowns_logo'),
				scale: 0.75  //will scale the graphic 150%. NOTE, ONLY DO THIS WITH SWF FILES!!!
			},
			show_rays: false, //if you want the white animated rays behind the logo
			buttons: {
				is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
				padding: 10, //space between buttons
				delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
				delta_y: 20,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
				values: { //ordered list of buttons
					0:{
						label:"Play Again",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'again'},
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					},
					1:{
						label:"Leave the Game",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'leave'},
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					}
				}
			}
		});		
	}

	this.it_game.game.playerFinish(this);
	delete this.it_game;

	this.games_scoreboard_end('it_game');
}

function games_it_dismiss_overlays(){
	log.info('[GAMES] '+this+' dismissing all overlays');

	this.announce_remove_indicator('it_game_crown');
	this.overlay_dismiss('crown_game_indicator');
	this.overlay_dismiss('crown_game_score');
	this.overlay_dismiss('crown_game_king');
	this.games_set_notit_map();
}

function games_get_it_status(){
	if (!this.it_game){
		return {};
	}
	else{
		return {
			crown_time: intval(this.it_game.crown_time),
			crown_start: intval(this.it_game.crown_start),
			is_started: this.games_it_game_is_started()
		};
	}
}

function games_it_game_lock(duration){
	if (!this.it_game || this.it_game.is_done){
		return;
	}

	log.info('[GAMES] '+'it_game locking: '+this);

	var it = this.it_game.game.whosIt(true);
	if (this.tsid == it){
		log.info('[GAMES] '+'it_game locking IT: '+this);
		if (this.it_game.lock_start) {
			this.apiCancelTimer('games_it_game_unlock');
			this.announce_add_indicator('it_game_crown', 'game_crown', true, 'locked', {width: 42, height: 42});
		}
		else {
			this.announce_add_indicator('it_game_crown', 'game_crown', true, 'locking', {width: 42, height: 42});
		}

		this.it_game.lock_start = time();

		if (!duration) duration = 4;
		this.apiSetTimer('games_it_game_unlock', duration * 1000);
		if (duration >= 4) this.apiSetTimer('games_it_game_wiggle1', 2 * 1000);
	}
}

function games_it_game_unlock(){
	if (!this.it_game || this.it_game.is_done){
		return;
	}

	log.info('[GAMES] '+'it_game unlocking: '+this);
	if (this.it_game.lock_start){
		log.info('[GAMES] '+'it_game unlocking start: '+this);

		delete this.it_game.lock_start;

		var it = this.it_game.game.whosIt(true);
		if (this.tsid == it){
			this.announce_add_indicator('it_game_crown', 'game_crown', true, 'unlocking', {width: 42, height: 42});
		}
		else{
			this.announce_remove_indicator('it_game_crown');
		}
	}
}

function games_it_game_wiggle1(){
	if (!this.it_game || this.it_game.is_done){
		return;
	}

	if (this.announce_has_indicator('it_game_crown')){
		if (config.is_dev) log.info('[GAMES] '+this+' wiggle 1');

		this.announce_add_indicator('it_game_crown', 'game_crown', true, 'wiggle1', {width: 42, height: 42});

		this.apiSetTimer('games_it_game_wiggle2', 1 * 1000);
	}
}

function games_it_game_wiggle2(){
	if (!this.it_game || this.it_game.is_done){
		return;
	}

	if (this.announce_has_indicator('it_game_crown')){
		if (config.is_dev) log.info('[GAMES] '+this+' wiggle 2');

		this.announce_add_indicator('it_game_crown', 'game_crown', true, 'wiggle2', {width: 42, height: 42});
	}
}

function games_it_game_is_locked(){
	if (!this.it_game || this.it_game.is_done){
		return false;
	}

	return this.it_game.lock_start ? true : false;
}

function games_it_game_is_started(){
	if (!this.it_game || this.it_game.is_done){
		return false;
	}

	if (this.it_game.is_started){
		return true;
	}
	else{
		if (this.y >= -1390){
			this.it_game.is_started = true;
			return true;
		}
		else{
			return false;
		}
	}
}

// Do the score overlays
function games_it_game_start_scores(it){
	if (!this.it_game || this.it_game.is_done){
		return;
	}

	log.info('[GAMES] '+this+' start scores. It: '+it);

	this.overlay_dismiss('crown_game_indicator');
	this.overlay_dismiss('crown_game_king');
	if (it.tsid == this.tsid){
		this.apiSendAnnouncement({
			uid: "crown_game_indicator",
			type: "vp_overlay",
			duration: 0,
			locking: false,
			width: 140,
			y: '88%',
			x: 70,
			swf_url: overlay_key_to_url('crown_game_indicator_you')
		});
	}
	else{
		this.apiSendAnnouncement({
			uid: "crown_game_indicator",
			type: "vp_overlay",
			duration: 0,
			locking: false,
			width: 100,
			y: '91%',
			x: '94%',
			swf_url: overlay_key_to_url('crown_game_indicator_someone_else')
		});

		this.apiSendAnnouncement({
			uid: "crown_game_king",
			type: "vp_overlay",
			duration: 0,
			locking: false,
			width: 100,
			y: '81%',
			x: '94%',
			text: [
				'<p align="center"><span class="crowns_king">'+utils.escape(it.label)+'</span></p>'
			]
		});
	}
}

function games_it_game_update_scores(remaining, is_it){
	if (!this.it_game || this.it_game.is_done){
		return;
	}

	if (config.is_dev) log.info('[GAMES] '+this+' update scores: '+remaining+', '+is_it);
	this.overlay_dismiss('crown_game_score');
	if (is_it){
		this.apiSendAnnouncement({
			uid: "crown_game_score",
			type: "vp_overlay",
			duration: 0,
			locking: false,
			width: 140,
			y: '92%',
			x: 70,
			show_text_shadow: false,
			text: [
				'<p align="center"><span class="crowns_counter">'+remaining+'</span></p>'
			]
		});
	}
	else{
		this.announce_remove_indicator('it_game_crown'); // temporary?

		this.apiSendAnnouncement({
			uid: "crown_game_score",
			type: "vp_overlay",
			duration: 0,
			locking: false,
			width: 100,
			y: '93%',
			x: '94%',
			show_text_shadow: false,
			text: [
				'<p align="center"><span class="crowns_counter">'+remaining+'</span></p>'
			]
		});
	}
}

//////////////////////////////////////////////////////////////////
//
// MATH MAYHEM
//

// Start the game for us
function games_start_math_mayhem(game, start_time, score, team, target){
	this.games_init_general();

	if (this.math_mayhem){
		log.info('[GAMES] '+"Warning Player "+this+" starting math mayhem, but is already playing!");
	}
			
	this.math_mayhem = {
		game: game,
		start_time: start_time,
		is_done: false,
		is_started: false, // Have they gone through the gate yet?
		score: score,
		team: team
	};

	log.info('[GAMES] '+"Starting math mayhem for player "+this);
	
	this.setPlayerCollisions(true);
	this.games_show_mayhem_score(team, score);
	this.games_mayhem_show_target(target);
}

// Two players tagged
function games_do_math(pc){
	if (!this.math_mayhem || this.math_mayhem.is_done || !pc.math_mayhem || pc.math_mayhem.is_done){
		return;
	}


	// Locked?
	if (this.games_math_mayhem_is_locked() || pc.games_math_mayhem_is_locked()) return;

	// EXECUTE MATH
	var our_status = this.games_get_math_mayhem_status();
	var their_status = pc.games_get_math_mayhem_status();

	log.info('[GAMES] '+this+":"+our_status+" is doing math with "+pc+":"+their_status);

	// Same team?
	var total;
	if (our_status.team == their_status.team){
		total = our_status.score + their_status.score;
	}
	else{
		total = Math.abs(our_status.score - their_status.score);
	}

	this.games_set_math_mayhem_score(total);
	pc.games_set_math_mayhem_score(total);
	this.games_math_mayhem_lock(1);
	pc.games_math_mayhem_lock(1);
}

function games_get_math_mayhem_status(){
	if (!this.math_mayhem){
		return {};
	}
	else{
		return {
			score: this.math_mayhem.score,
			team: this.math_mayhem.team
		};
	}
}

function games_set_math_mayhem_score(score){
	if (!this.math_mayhem){
		return;
	}

	log.info('[GAMES] '+this+' setting math mayhem score to '+score);
	this.math_mayhem.score = score;

	// Broadcast change
	this.games_show_mayhem_score(this.math_mayhem.team, score);

	// Winner?
	if (this.math_mayhem.game.math_mayhem_get_target() == score){
		this.math_mayhem.game.math_mayhem_set_winner(this);
	}
}

function games_math_mayhem_dismiss_overlays(){
	log.info('[GAMES] '+this+' dismissing all overlays');

	this.overlay_dismiss('math_mayhem_target');
	this.games_clear_mayhem_score();
}

function games_end_math_mayhem(){
	if (!this.math_mayhem || this.math_mayhem.is_done){
		return;
	}

	log.info('[GAMES] '+this+" games_end_math_mayhem");

	// End the game
	this.math_mayhem.is_done = true;
	this.setPlayerCollisions(false);
	this.games_math_mayhem_dismiss_overlays();

	// Did we win?
	var winner = this.math_mayhem.game.math_mayhem_get_winner();
	if (winner && winner.tsid == this.tsid){
		log.info('[GAMES] '+this+" games_end_math_mayhem was winner!");

		this.apiSendAnnouncement({
			uid: "game_results",
			type: "vp_overlay",
			duration: 0,
			locking: true,
			width: 500,
			y: '30%',
			x: '50%',
			swf_url: overlay_key_to_url('crown_game_winner_you')
		});

		var context = {'verb':'math_mayhem'};
		this.stats_add_xp(200, false, context);
		this.stats_add_currants(50, context);
		this.achievements_increment('math_mayhem', 'won');

		// Cancel the game for everyone else
		this.math_mayhem.game.cancel();
	}
	else{
		log.info('[GAMES] '+this+" games_end_math_mayhem was not it, winner was: "+winner);

		this.achievements_increment('math_mayhem', 'lost');

		if (winner){
			this.apiSendAnnouncement({
				uid: "game_results",
				type: "vp_overlay",
				duration: 0,
				locking: true,
				width: 330,
				y: '30%',
				x: '50%',
				swf_url: overlay_key_to_url('crown_game_winner_someone_else')
			});

			this.apiSendAnnouncement({
				uid: "game_winner_name",
				type: "vp_overlay",
				duration: 0,
				locking: false,
				width: 500,
				y: '30%',
				x: '50%',
				text: [
					'<p align="center"><span class="nuxp_vog_brain">'+utils.escape(winner.label)+'</span></p>'
				]
			});
		}
	}

	this.apiSendAnnouncement({
		uid: "game_button_again",
		type: "vp_overlay",
		duration: 0,
		locking: true,
		width: 150,
		y: '60%',
		x: '37%',
		swf_url: overlay_key_to_url('button_play_again'),
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_payload: {pc_callback: 'games_leave_instance_overlay', choice: 'again'},
			dismiss_on_click: true
		}
	});

	this.apiSendAnnouncement({
		uid: "game_button_leave",
		type: "vp_overlay",
		duration: 0,
		locking: true,
		width: 150,
		y: '60%',
		x: '63%',
		swf_url: overlay_key_to_url('button_leave_game'),
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_payload: {pc_callback: 'games_leave_instance_overlay', choice: 'leave'},
			dismiss_on_click: true
		}
	});

	this.math_mayhem.game.playerFinish(this);
	delete this.math_mayhem;

	this.games_scoreboard_end('math_mayhem');
}

// Tell the client about our colors
function games_show_mayhem_score(color, score){
	var out_color;
	switch(color) {
		case 'red':
			out_color = '#CC0000';
			break;
		case 'blue':
			out_color = '#0C6AE0';
			break;
		case 'yellow':
			out_color = '#FFFF00';
			break;
	}
	
	var msg = {
		type: 'pc_game_flag_change',
		pc: {
			tsid: this.tsid,
			label: this.label,
			location: {
				tsid: this.location.tsid,
				label: this.location.label
			},
			color_group: out_color,
			show_color_dot: true,
			game_text: score
		}
	};
	
	this.location.apiSendMsg(msg);
}

function games_clear_mayhem_score(){
	var msg = {
		type: 'pc_game_flag_change',
		pc: {
			tsid: this.tsid,
			label: this.label,
			location: {
				tsid: this.location.tsid,
				label: this.location.label
			},
			color_group: null,
			show_color_dot: false
		}
	};
	
	this.location.apiSendMsg(msg);
}

function games_mayhem_show_target(score){
	if (!this.math_mayhem || this.math_mayhem.is_done){
		return;
	}

	log.info('[GAMES] '+this+' start scores.');

	this.apiSendAnnouncement({
		uid: "math_mayhem_target",
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
			'<p><span class="overlay_counter">Target: '+score+'</span></p>'
		]
	});
}


function games_math_mayhem_lock(duration){
	if (!this.math_mayhem || this.math_mayhem.is_done){
		return;
	}

	log.info('[GAMES] '+'math_mayhem locking: '+this);

	if (this.math_mayhem.lock_start){
		this.apiCancelTimer('games_math_mayhem_unlock');
		//this.games_set_overlay_flag('it_game_crown', 'game_crown', 'locked', {width: 42, height: 42, delta_y: -115});
	}
	else{
		//this.games_set_overlay_flag('it_game_crown', 'game_crown', 'locking', {width: 42, height: 42, delta_y: -115});
	}

	this.math_mayhem.lock_start = time();

	this.apiSetTimer('games_math_mayhem_unlock', duration * 1000);
}

function games_math_mayhem_unlock(){
	if (!this.math_mayhem || this.math_mayhem.is_done){
		return;
	}

	log.info('[GAMES] '+'math_mayhem unlocking: '+this);
	if (this.math_mayhem.lock_start){
		log.info('[GAMES] '+'math_mayhem unlocking start: '+this);

		delete this.math_mayhem.lock_start;

		//this.games_clear_overlay_flag('it_game_crown');
	}
}

function games_math_mayhem_is_locked(){
	if (!this.math_mayhem || this.math_mayhem.is_done){
		return false;
	}

	return this.math_mayhem.lock_start ? true : false;
}

//////////////////////////////////////////////////////////////////
//
// Races!
//

function games_race_splash(instance_id) {
	this.apiSendMsg({
		type:'game_splash_screen',
		tsid:'race',
		graphic: {
			url: overlay_key_to_url('race_logo'),
			scale: 1.0
		},
		show_rays:false, //if you want the white animated rays behind the logo
		text:'<font size="24">Be the first to the finish line to win!</font>',  //class name in the format of "game_splash_TSID"
		text_delta_x: 0,  //how much to nudge the text left or right. Default is centered to the graphic
		text_delta_y: 60,  //how much to nudge text below the graphic. Default is 0 which snugs it tight to the graphic
		buttons: {
			is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
			padding: 10, //space between buttons
			delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
			delta_y: -80,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
			values: { //ordered list of buttons
				0:{
					label:"Click to Start",
					click_payload: { does_close:true, pc_callback: 'games_accept_start_button', id: 'it_game', instance_id: instance_id }, //does_close is an optional param that will tell the client to send the payload and close the splash screen when esc/enter is hit (otherwise it won't do anything)
					w: 150,
					size: 'default', //used from the client.css file (ie. .button_default)
					type: 'minor' //used from the client.css file (ie. .button_minor_label)
				}
			}
		}
	});
}

function games_start_race(game, start_time) {
	this.games_init_general();

	this.race = {
		game: game,
		start_time: start_time
	};
}

function games_win_race() {
	if (!this.race) {
		log.error("Player "+this+" attempting to win race, but does not have race object.");
		return;
	}
	
	// Do winning stuff here.
	this.race.game.race_set_winner(this);
}

// The The race is over!
function games_end_race(){
	if (!this.race || this.race.is_done){
		return;
	}

	log.info('[GAMES] '+this+" games_end_race");

	// End the game
	this.race.is_done = true;

	var winner = getPlayer(this.race.game.race_get_winner());

	if (winner) {
		var splash = {
			type:'game_splash_screen',
			tsid:'race',
			graphic: {
				url: overlay_key_to_url('race_winner'),
				scale: 1.0  //will scale the graphic 150%. NOTE, ONLY DO THIS WITH SWF FILES!!!
			},
			show_rays: false, //if you want the white animated rays behind the logo
			buttons: {
				is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
				padding: 10, //space between buttons
				delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
				delta_y: 20,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
				values: { //ordered list of buttons
					0:{
						label:"Leave the Game",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'leave'},
						w: 150,
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					}
				}
			}
		};
		
		// Did we win?
		if (this.race.game.race_get_winner() == this.tsid){
			log.info('[GAMES] '+this+" won the race!");

			var context = {'verb':'race'};
			this.stats_add_xp(50, false, context);
			this.stats_add_currants(100, context);
			this.achievements_increment('race', 'won');

			splash.graphic.frame_label = 'you_winner';
			splash.show_rays = true;

			// Cancel the game for everyone else
			this.race.game.cancel();
		} else{
			log.info('[GAMES] '+this+" lost the race.");

			splash.graphic.frame_label = 'other_winner';
			splash.graphic.text = winner.label;
			splash.graphic.text_delta_y = 55;

			this.achievements_increment('race', 'lost');
		}
		
		this.apiSendMsg(splash);
	} else {
		this.apiSendMsg({
			type:'game_splash_screen',
			tsid:'race',
			graphic: {
				url: overlay_key_to_url('race_logo'),
				scale: 1.0 //will scale the graphic 150%. NOTE, ONLY DO THIS WITH SWF FILES!!!
			},
			show_rays: false, //if you want the white animated rays behind the logo
			buttons: {
				is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
				padding: 10, //space between buttons
				delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
				delta_y: 20,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
				values: { //ordered list of buttons
					0:{
						label:"Leave the Game",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'leave'},
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					}
				}
			}
		});		
	}	

	this.race.game.playerFinish(this);
	delete this.race;

	this.games_scoreboard_end('race');
}

//////////////////////////////////////////////////////////////////
//
// Quoin Graaaaab!
//

function games_quoin_grab_splash(instance_id) {
	this.apiSendMsg({
		type:'game_splash_screen',
		tsid:'quoin_grab',
		graphic: {
			url: overlay_key_to_url('grabemgood_logo'),
			scale: 1.0
		},
		show_rays:false, //if you want the white animated rays behind the logo
		text:'<font size="24">Get the most quoins to win!</font>',  //class name in the format of "game_splash_TSID"
		text_delta_x: 0,  //how much to nudge the text left or right. Default is centered to the graphic
		text_delta_y: 60,  //how much to nudge text below the graphic. Default is 0 which snugs it tight to the graphic
		buttons: {
			is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
			padding: 10, //space between buttons
			delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
			delta_y: -85,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
			values: { //ordered list of buttons
				0:{
					label:"Click to Start",
					click_payload: { does_close:true, pc_callback: 'games_accept_start_button', id: 'it_game', instance_id: instance_id }, //does_close is an optional param that will tell the client to send the payload and close the splash screen when esc/enter is hit (otherwise it won't do anything)
					w: 150,
					size: 'default', //used from the client.css file (ie. .button_default)
					type: 'minor' //used from the client.css file (ie. .button_minor_label)
				}
			}
		}
	});
}

function games_start_quoin_grab(game, start_time) {
	this.games_init_general();

	this.quoin_grab = {
		game: game,
		start_time: start_time,
	};
	
	this.quoin_grab_show_overlays();
}

function quoin_grab_show_overlays() {
	if (!this.quoin_grab || this.quoin_grab.is_done) {
		return;
	}
	
	var remaining = this.location.countItemClass('quoin');
	
	var scores = this.quoin_grab.game.quoin_grab_get_all_scores();
	var overlay_text = "";
	
	for (var i in scores) {
		overlay_text += utils.escape(scores[i].label)+": "+scores[i].score+"<br />";
		remaining -= scores[i].score;
	}
	overlay_text += "Remaining: "+remaining;
	

	log.info("Showing quoin grab overlays");
	this.apiSendAnnouncement({
		uid: "game_scores",
		type: "vp_overlay",
		locking: false,
		width: 500,
		y: '20%',
		x: '50%',
		text: [
			'<p align="center"><span class="nuxp_vog_smaller">'+overlay_text+'</span></p>'
		]
	});
}

function quoin_grab_dismiss_overlays() {
	if (!this.quoin_grab) {
		return;
	}

	log.info("Dismissing quoin grab overlays");

	this.apiSendMsg({type: 'overlay_cancel', uid: 'game_scores'});
}

function quoin_grab_update_overlays() {
	log.info("Updating quoin grab overlays");

	this.quoin_grab_dismiss_overlays();
	this.quoin_grab_show_overlays();
}

function quoin_grab_get_quoin() {
	log.info("Quoin grab get quoin!");
	if (!this.quoin_grab) {
		return;
	}

	this.quoin_grab.game.quoin_grab_get_quoin(this);
}

// Game over!
function games_end_quoin_grab(){
	if (!this.quoin_grab || this.quoin_grab.is_done){
		return;
	}

	log.info('[GAMES] '+this+" games_end_quoin_grab");

	// End the game
	this.quoin_grab.is_done = true;
	// No overlays yet
	this.quoin_grab_dismiss_overlays();

	var winner = getPlayer(this.quoin_grab.game.quoin_grab_get_winner());

	if (winner) {
		var splash = {
			type:'game_splash_screen',
			tsid:'quoin_grab',
			graphic: {
				url: overlay_key_to_url('grabemgood_winner'),
				scale: 1.0  //will scale the graphic 150%. NOTE, ONLY DO THIS WITH SWF FILES!!!
			},
			show_rays: false, //if you want the white animated rays behind the logo
			buttons: {
				is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
				padding: 10, //space between buttons
				delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
				delta_y: 20,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
				values: { //ordered list of buttons
					0:{
						label:"Leave the Game",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'leave'},
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					}
				}
			}
		};

		// Did we win?
		if (this.quoin_grab.game.quoin_grab_get_winner() == this.tsid){
			log.info('[GAMES] '+this+" won grab 'em good!");

			var context = {'verb':'quoin_grab'};
			this.stats_add_xp(50, false, context);
			this.stats_add_currants(100, context);
			this.achievements_increment('quoin_grab', 'won');
			
			splash.show_rays = true;
			splash.graphic.frame_label = 'you_winner';

			// Cancel the game for everyone else
			this.quoin_grab.game.cancel();
		} else{
			log.info('[GAMES] '+this+" lost grab 'em good.");
			splash.graphic.text = winner.label;
			splash.graphic.text_delta_y = 0;
			splash.graphic.frame_label = 'other_winner';

			this.achievements_increment('quoin_grab', 'lost');
		}
		
		this.apiSendMsg(splash);
	} else {
		this.apiSendMsg({
			type:'game_splash_screen',
			tsid:'quoin_grab',
			graphic: {
				url: overlay_key_to_url('grabemgood_logo'),
				scale: 1.0 //will scale the graphic 150%. NOTE, ONLY DO THIS WITH SWF FILES!!!
			},
			show_rays: false, //if you want the white animated rays behind the logo
			buttons: {
				is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
				padding: 10, //space between buttons
				delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
				delta_y: 20,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
				values: { //ordered list of buttons
					0:{
						label:"Leave the Game",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'leave'},
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					}
				}
			}
		});		
	}

	this.quoin_grab.game.playerFinish(this);
	delete this.quoin_grab;

	this.games_scoreboard_end('quoin_grab');
}


//////////////////////////////////////////////////////////////////
//
// Cloudhopolis
//

function games_cloudhopolis_splash(instance_id) {
	this.apiSendMsg({
		type:'game_splash_screen',
		tsid:'cloudhopolis',
		graphic: {
			url: overlay_key_to_url('grabemgood_logo'),
			scale: 1.0
		},
		show_rays:false, //if you want the white animated rays behind the logo
		text:'<font size="24">Get the most coins before time runs out to win!</font>',  //class name in the format of "game_splash_TSID"
		text_delta_x: 0,  //how much to nudge the text left or right. Default is centered to the graphic
		text_delta_y: 60,  //how much to nudge text below the graphic. Default is 0 which snugs it tight to the graphic
		buttons: {
			is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
			padding: 10, //space between buttons
			delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
			delta_y: -85,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
			values: { //ordered list of buttons
				0:{
					label:"Click to Start",
					click_payload: { does_close:true, pc_callback: 'games_accept_start_button', id: 'it_game', instance_id: instance_id }, //does_close is an optional param that will tell the client to send the payload and close the splash screen when esc/enter is hit (otherwise it won't do anything)
					w: 150,
					size: 'default', //used from the client.css file (ie. .button_default)
					type: 'minor' //used from the client.css file (ie. .button_minor_label)
				}
			}
		}
	});
}

function games_start_cloudhopolis(game, start_time) {
	this.games_init_general();

	this.cloudhopolis = {
		game: game,
		start_time: start_time,
	};
	
	this.cloudhopolis_show_overlays();
}

function cloudhopolis_show_overlays() {
	if (!this.cloudhopolis || this.cloudhopolis.is_done) {
		return;
	}
	
	var remaining = this.cloudhopolis.game.cloudhopolis_get_time_remaining();
	
	var scores = this.cloudhopolis.game.cloudhopolis_get_all_scores();
	var overlay_text = "";
	
	for (var i in scores) {
		overlay_text += utils.escape(scores[i].label)+": "+scores[i].score+"<br />";
		remaining -= scores[i].score;
	}
	overlay_text += "Time Remaining: "+remaining;
	

	log.info("[GAMES] Showing cloudhopolis overlays");
	this.apiSendAnnouncement({
		uid: "game_scores",
		type: "vp_overlay",
		locking: false,
		width: 500,
		y: '20%',
		x: '50%',
		text: [
			'<p align="center"><span class="nuxp_vog_smaller">'+overlay_text+'</span></p>'
		]
	});
}

function cloudhopolis_dismiss_overlays() {
	if (!this.cloudhopolis) {
		return;
	}

	log.info("[GAMES] Dismissing cloudhopolis overlays");

	this.apiSendMsg({type: 'overlay_cancel', uid: 'game_scores'});
}

function cloudhopolis_update_overlays() {
	log.info("Updating cloudhopolis overlays");

	this.cloudhopolis_dismiss_overlays();
	this.cloudhopolis_show_overlays();
}

function cloudhopolis_get_quoin() {
	log.info("cloudhopolis get quoin!");
	if (!this.cloudhopolis) {
		return;
	}

	this.cloudhopolis.game.cloudhopolis_get_quoin(this);
}

// Game over!
function games_end_cloudhopolis(){
	if (!this.cloudhopolis || this.cloudhopolis.is_done){
		return;
	}

	log.info('[GAMES] '+this+" games_end_cloudhopolis");

	// End the game
	this.cloudhopolis.is_done = true;
	// No overlays yet
	this.cloudhopolis_dismiss_overlays();

	var winner = getPlayer(this.cloudhopolis.game.cloudhopolis_get_winner());

	if (winner) {
		var splash = {
			type:'game_splash_screen',
			tsid:'cloudhopolis',
			graphic: {
				url: overlay_key_to_url('grabemgood_winner'),
				scale: 1.0  //will scale the graphic 150%. NOTE, ONLY DO THIS WITH SWF FILES!!!
			},
			show_rays: false, //if you want the white animated rays behind the logo
			buttons: {
				is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
				padding: 10, //space between buttons
				delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
				delta_y: 20,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
				values: { //ordered list of buttons
					0:{
						label:"Leave the Game",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'leave'},
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					}
				}
			}
		};

		// Did we win?
		if (this.cloudhopolis.game.cloudhopolis_get_winner() == this.tsid){
			log.info('[GAMES] '+this+" won cloudhopolis!");

			var context = {'verb':'cloudhopolis'};
			this.stats_add_xp(50, false, context);
			this.stats_add_currants(100, context);
			this.achievements_increment('cloudhopolis', 'won');
			
			splash.show_rays = true;
			splash.graphic.frame_label = 'you_winner';

			// Cancel the game for everyone else
			this.cloudhopolis.game.cancel();
		} else{
			log.info('[GAMES] '+this+" lost cloudhopolis.");
			splash.graphic.text = winner.label;
			splash.graphic.text_delta_y = 0;
			splash.graphic.frame_label = 'other_winner';

			this.achievements_increment('cloudhopolis', 'lost');
		}
		
		this.apiSendMsg(splash);
	} else {
		this.apiSendMsg({
			type:'game_splash_screen',
			tsid:'cloudhopolis',
			graphic: {
				url: overlay_key_to_url('grabemgood_logo'),
				scale: 1.0 //will scale the graphic 150%. NOTE, ONLY DO THIS WITH SWF FILES!!!
			},
			show_rays: false, //if you want the white animated rays behind the logo
			buttons: {
				is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
				padding: 10, //space between buttons
				delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
				delta_y: 20,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
				values: { //ordered list of buttons
					0:{
						label:"Leave the Game",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'leave'},
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					}
				}
			}
		});
	}

	this.cloudhopolis.game.playerFinish(this);
	delete this.cloudhopolis;

	this.games_scoreboard_end('cloudhopolis');
}

//////////////////////////////////////////////////////////////////
//
// Hogtied piggy race!
//

function games_hogtie_piggy_splash(instance_id) {
	this.apiSendMsg({
		type:'game_splash_screen',
		tsid:'hogtie_piggy',
		graphic: {
			url: overlay_key_to_url('thegreathoghaul_logo'),
			scale: 1.0
		},
		show_rays:false, //if you want the white animated rays behind the logo
		text:'<font size="24">Be the first to capture <font size="35">3</font> Piggies.</font><br />'+
			'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Touch Pig Bait to pick it up<br />'+
			'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• While carrying Bait, touch a Piggy to hogtie it<br />'+
			'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;• Deliver your Hogtied Piggy to the Pig Pen',
		text_delta_x: 0,  //how much to nudge the text left or right. Default is centered to the graphic
		text_delta_y: 60,  //how much to nudge text below the graphic. Default is 0 which snugs it tight to the graphic
		buttons: {
			is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
			padding: 10, //space between buttons
			delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
			delta_y: -170,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
			values: { //ordered list of buttons
				0:{
					label:"Click to Start",
					click_payload: { does_close:true, pc_callback: 'games_accept_start_button', id: 'it_game', instance_id: instance_id }, //does_close is an optional param that will tell the client to send the payload and close the splash screen when esc/enter is hit (otherwise it won't do anything)
					w: 150,
					size: 'default', //used from the client.css file (ie. .button_default)
					type: 'minor' //used from the client.css file (ie. .button_minor_label)
				}
			}
		}
	});
}

function games_start_hogtie_piggy(game, start_time) {
	this.games_init_general();

	this.hogtie_piggy = {
		game: game,
		start_time: start_time
	};
	
	this.hogtie_piggy_show_overlays();
}

function hogtie_piggy_show_overlays() {
	if (!this.hogtie_piggy || this.hogtie_piggy.is_done) {
		return;
	}
	
	var scores = this.hogtie_piggy.game.hogtie_piggy_get_all_scores();
	var overlay_text = "";
	
	for (var i in scores) {
		overlay_text += utils.escape(scores[i].label)+": "+scores[i].score+"<br />";
	}	

	this.apiSendAnnouncement({
		uid: "game_scores",
		type: "vp_overlay",
		locking: false,
		width: 500,
		y: '20%',
		x: '50%',
		text: [
			'<p align="center"><span class="nuxp_vog_smaller">'+overlay_text+'</span></p>'
		]
	});
}

function hogtie_piggy_dismiss_overlays() {
	if (!this.hogtie_piggy) {
		return;
	}

	this.apiSendMsg({type: 'overlay_cancel', uid: 'game_scores'});
}

function hogtie_piggy_update_overlays() {
	log.info("Updating quoin grab overlays");

	this.hogtie_piggy_dismiss_overlays();
	this.hogtie_piggy_show_overlays();
}

function games_hogtie_piggy_pickup_bait() {
	if (!this.hogtie_piggy || this.hogtie_piggy.is_done) {
		return false;
	}
	
	this.announce_add_indicator('has_pig_bait', 'pig_bait', true);
	var score = this.hogtie_piggy.game.hogtie_piggy_get_score(this);

	if (!score){
		this.overlay_dismiss('piggy_tip');

		this.apiSendAnnouncement({
			uid: "pig_bait_tip",
			type: "vp_overlay",
			duration: 3000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '25%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_brain">You have bait, now go get a piggy!</span></p>'
			]
		});
	}
	else if (score){
		this.overlay_dismiss('piggy_tip');

		this.apiSendAnnouncement({
			uid: "pig_bait_tip",
			type: "vp_overlay",
			duration: 2000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '25%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_brain">Got bait! Find a pig!</span></p>'
			]
		});
	}	
}

function games_hogtie_piggy_pickup_pig() {
	if (!this.hogtie_piggy || this.hogtie_piggy.is_done) {
		return false;
	}
	
	if (!this.announce_has_indicator('has_hogtied_piggy') && this.announce_has_indicator('has_pig_bait')){

		this.announce_remove_indicator('has_pig_bait');
		this.announce_add_indicator('has_hogtied_piggy', 'hogtied_piggy', true);
		var score = this.hogtie_piggy.game.hogtie_piggy_get_score(this);

		if (!score){
			this.overlay_dismiss('pig_bait_tip');
			this.apiSendAnnouncement({
				uid: "piggy_tip",
				type: "vp_overlay",
				duration: 3000,
				locking: false,
				width: 500,
				x: '50%',
				top_y: '25%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_brain">You hogtied a piggy, now take it to the Pig Pen!</span></p>'
				]
			});
		}
		else if (score == 1){
			this.overlay_dismiss('pig_bait_tip');

			this.apiSendAnnouncement({
				uid: "piggy_tip",
				type: "vp_overlay",
				duration: 2000,
				locking: false,
				width: 500,
				x: '50%',
				top_y: '25%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_brain">Got a pig! Back to the pen!</span></p>'
				]
			});
		}
		
		return true;
	}
	else if (!this.announce_has_indicator('has_hogtied_piggy')){
		this.apiSendAnnouncement({
			uid: "piggy_tip",
			type: "vp_overlay",
			duration: 3000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '25%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_brain">You need bait first!</span></p>'
			]
		});
	}	
	
	return false;
}

function games_hogtie_piggy_add_pig() {
	if (!this.hogtie_piggy) {
		log.error("[GAMES] "+this+" returned hogtied piggy, but has no race object!");
		return;
	}
	
	this.announce_remove_indicator('has_hogtied_piggy');
	if (this.hogtie_piggy.is_done) {
		return;
	}

	var score = this.hogtie_piggy.game.hogtie_piggy_get_score(this);

	if (!score) {
		this.apiSendAnnouncement({
			uid: "piggy_tip",
			type: "vp_overlay",
			duration: 3000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '25%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_brain">Nice job! Now, get two more!</span></p>'
			]
		});
	}
	else if (score == 1){
		this.apiSendAnnouncement({
			uid: "piggy_tip",
			type: "vp_overlay",
			duration: 2000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '25%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog_brain">Nice job! Now, get one more!</span></p>'
			]
		});
	}
	
	score++;
	this.hogtie_piggy.game.hogtie_piggy_add_pig(this);

	if (score >= 3){
		this.games_win_hogtie_piggy();
	}

	var piggy = this.location.createItemStack('npc_piggy', 1, 0, -875);
	if (piggy) piggy.in_pen = true;	
}

function games_win_hogtie_piggy() {
	if (!this.hogtie_piggy) {
		log.error("Player "+this+" attempting to win hogtied piggy race, but does not have race object.")
	}
	
	// Do winning stuff here.
	this.hogtie_piggy.game.hogtie_piggy_set_winner(this);
}

// The The race is over!
function games_end_hogtie_piggy(){
	if (!this.hogtie_piggy || this.hogtie_piggy.is_done){
		return;
	}

	log.info('[GAMES] '+this+" games_end_hogtie_piggy");

	// End the game
	this.hogtie_piggy.is_done = true;
	this.hogtie_piggy_dismiss_overlays();
	this.announce_remove_indicator('has_pig_bait');
	this.announce_remove_indicator('has_hogtied_piggy');

	var winner = getPlayer(this.hogtie_piggy.game.hogtie_piggy_get_winner());

	if (winner) {
		var splash = {
			type:'game_splash_screen',
			tsid:'hogtie_piggy',
			graphic: {
				url: overlay_key_to_url('thegreathoghaul_winner'),
				text_delta_y: -10,
				scale: 1.0  //will scale the graphic 150%. NOTE, ONLY DO THIS WITH SWF FILES!!!
			},
			show_rays: false, //if you want the white animated rays behind the logo
			buttons: {
				is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
				padding: 10, //space between buttons
				delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
				delta_y: 20,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
				values: { //ordered list of buttons
					0:{
						label:"Leave the Game",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'leave'},
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					}
				}
			}
		};

		// Did we win?
		if (winner.tsid == this.tsid){
			log.info('[GAMES] '+this+" won the hogtied piggy race!");

			var context = {'verb':'hogtie_piggy'};
			this.stats_add_xp(50, false, context);
			this.stats_add_currants(100, context);
			this.achievements_increment('hogtie_piggy', 'won');
			
			splash.show_rays = true;
			splash.graphic.frame_label = 'you_winner';

			// Cancel the game for everyone else
			this.hogtie_piggy.game.cancel();
		} else {
			log.info('[GAMES] '+this+" lost the hogtied piggy race.");

			splash.graphic.text = winner.label;  //format is "game_splash_TSID_graphic" in client.css
			splash.graphic.frame_label = 'other_winner';

			this.achievements_increment('hogtie_piggy', 'lost');
		}
		
		this.apiSendMsg(splash);
	} else {
		this.apiSendMsg({
			type:'game_splash_screen',
			tsid:'race',
			graphic: {
				url: overlay_key_to_url('thegreathoghaul_logo'),
				scale: 1.0 //will scale the graphic 150%. NOTE, ONLY DO THIS WITH SWF FILES!!!
			},
			show_rays: false, //if you want the white animated rays behind the logo
			buttons: {
				is_vertical: false, //this is optional, it will default to having the buttons built and centered horizontally
				padding: 10, //space between buttons
				delta_x: 0,  //how much to nudge the buttons left/right. Default is centered to the graphic.
				delta_y: 20,  //how much to nudge the buttons below the text block. Default is 0 which snugs it tight.
				values: { //ordered list of buttons
					0:{
						label:"Leave the Game",
						click_payload: {does_close:true, pc_callback: 'games_leave_instance_overlay', choice: 'leave'},
						size: 'default', //used from the client.css file (ie. .button_default)
						type: 'minor' //used from the client.css file (ie. .button_minor_label)
					}
				}
			}
		});		
	}	

	this.hogtie_piggy.game.playerFinish(this);
	delete this.hogtie_piggy;

	this.games_scoreboard_end('hogtie_piggy');
}

//////////////////////////////////////////////////////////////////
//
// Hopefully generic multiplayer game functions
// May contain game-specific logic, with switching based on type
//

function games_add_msg_props(msg) {
	if(this.color_game) {
		var colors = {};
		this.games_color_get_colors(colors);
		
		msg.color_group = colors.out_color;
		msg.secondary_color_group = colors.out_color_secondary;
	}
}

// Prompt callback. Should I stay or should I go?
function games_leave_instance(value, details) {
	log.info('[GAMES] '+this+' games_leave_instance: '+value+', '+details);

	if (!value || value == 'leave'){
		this.overlay_dismiss('game_waiting');
		this.overlay_dismiss('game_instructions_text');

		this.announce_music_stop('WAITING_MUZAK');
		this.instances_exit(this.location.instance_id, true);
	}
	else if (value == 'again'){
		// Add our spawn point back in.
		var instance = this.instances_get(this.location.instance_id);
		if(instance){

			// Move to another spawn point
			var spawn_point = instance.get_spawn_point();
			this.teleportToLocation(this.location.tsid, spawn_point.x, spawn_point.y);


			// Register ourselves as ready
			if (!details.forced){
				this.apiCancelTimer('games_auto_leave');

				log.info('[GAMES] '+this+' games_leave_instance NOT FORCED');
				instance.getInstanceManager().resetPlayer(this);
			}
			else{
				this.apiSetTimer('games_auto_leave', 20 * 1000);
			}
		}
	}
}

// Go through all players in our location and see if any of them have potential moves.
function games_has_stalemate() {
	var found_color = null;
	if(this.color_game) {
		var players = this.location.getActivePlayers();
		for(var i in players) {
			if(players[i].games_is_playing()) {
				if(found_color) {
					if(players[i].games_get_color_group() != found_color) {
						return false;
					}
				} else {
					found_color = players[i].games_get_color_group();
				}
			}
		}
		return true;
	} else {
		return false;
	}
}

// Am I playing a game?
function games_is_playing() {
	if (this.color_game){
		return !this.color_game.is_done;
	}
	else if (this.it_game){
		return !this.it_game.is_done;
	}
	else if (this.math_mayhem){
		return !this.math_mayhem.is_done;
	}
	else{
		return false;
	}
}

// The player clicked on the start button!
function games_accept_start_button(payload){
	log.info('[GAMES] '+this+' games_accept_start_button: '+payload);

	if (!payload.instance_id) return;

	var instance = this.instances_get(payload.instance_id);
	if (!instance) return;

	var manager = instance.getInstanceManager();
	if (!manager) return;

	this.apiCancelTimer('games_auto_leave');
	manager.dismissOverlaysAndStart(this);
}

function games_leave_instance_overlay(payload){
	log.info('[GAMES] '+this+' games_leave_instance_overlay: '+payload);

	this.overlay_dismiss('game_results');
	this.overlay_dismiss('game_winner_name');
	this.overlay_dismiss('game_button_again');
	this.overlay_dismiss('game_button_leave');

	this.games_leave_instance(payload.choice, payload);
}

function games_auto_leave(){
	log.info('[GAMES] '+this+' games_auto_leave');
	this.games_leave_instance_overlay({choice: 'leave', forced: true});

	this.sendActivity("You were removed from the game due to inactivity.");
}

function games_assign_spawn_point(x, y){
	this.games_spawn_point = {
		x: x,
		y: y
	};
}

function games_clear_spawn_point(){
	delete this.games_spawn_point;
}

function games_get_spawn_point(){
	return this.games_spawn_point;
}

//////////////////////////////////////////////////////////////////
//
// Scoreboard: http://wiki.tinyspeck.com/wiki/SpecScoreBoards
//

function games_scoreboard_start(game_id, game_title, duration, players){
	var msg = {
		type: "game_start",
		tsid: game_id,
		title: game_title,
		timer: duration,  //how long the game will last in seconds, optional
		players: []
	};

	for (var i in players){
		msg.players.push(players[i]);
	}

	this.sendMsgOnline(msg);
}

function games_scoreboard_update(game_id, duration, is_complete, players){
	var msg = {
		type: "game_update",
		tsid: game_id,
		timer: duration,
		is_game_over: is_complete,  //send true to show the winner screen/leaderboard
		players: []
	};

	for (var i in players){
		msg.players.push(players[i]);
	}

	this.sendMsgOnline(msg);
}

function games_scoreboard_end(game_id){
	var msg = {
		type: "game_end",
		tsid: game_id
	};

	this.sendMsgOnline(msg);
}

//////////////////////////////////////////////////////////////////
//
// Offering
//

function games_get_name(class_tsid, location_id) {
	if(location_id == undefined || !config.shared_instances[class_tsid].locations[location_id]) {
		return config.shared_instances[class_tsid].name;
	} else {
		var loc = apiFindObject(config.shared_instances[class_tsid].locations[location_id]);
		if (loc) {
			return loc.label;
		} else {
			return config.shared_instances[class_tsid].name;
		}
	}
}

function games_invite_create(class_tsid, ticket_on_cancel, location_id){
	var q = config.shared_instances[class_tsid];
	if (q){
		var game_name = this.games_get_name(class_tsid, location_id);
		
		this.broadcastActionRequest('game_accept', class_tsid, 'is looking for a challenger for <b>'+game_name+'</b>.', q.min_players-1);
		
		this['!invite_uid_'+this.tsid] = this.prompts_add({
			txt		: 'Waiting for other players...',
			timeout		: 60,
			choices		: [
				{ value : 'ok', label : 'OK' }
			],
			callback	: 'games_accept',
			quest_id	: class_tsid,
			game_name	: game_name,
			is_game		: true,
			challenger	: this.tsid
		});
	
		// Set a timer to fail the request
		this.events_add({callback: 'games_invite_timeout', class_tsid: class_tsid}, 60);

		this.games_invite = {
			game_name: game_name,
			class_tsid: class_tsid,
			location_id : location_id,
			offered_on: time(),
			opponents: [],
			ticket_on_cancel: ticket_on_cancel
		};
	}
}

function games_invite_timeout(details){
	var q = config.shared_instances[details.class_tsid];
	if (q){
		if (!this.games_invite_is_full()){
			
			// Remove prompts
			this.prompts_remove(this['!invite_uid_'+this.tsid]);
			if (this.games_invite){
				for (var i in this.games_invite.opponents){
					var opp = getPlayer(i);
					if (opp) opp.prompts_remove(opp['!invite_uid_'+this.tsid]);
				}
			}
			
			
			this.updateActionRequest('was looking for a challenger for <b>'+this.games_invite.game_name+'</b>.', 0);
			this.cancelActionRequestBroadcast('game_accept', details.class_tsid);
			
			this.prompts_add({
				txt		: 'Not enough players accepted your challenge. Try again later?',
				timeout		: 10,
				choices		: [
					{ value : 'ok', label : 'Dagnabit!' }
				]
			});

			if (this.games_invite && this.games_invite.ticket_on_cancel){
				this.createItemFromFamiliar(this.games_invite.ticket_on_cancel, 1);
			}

			delete this.games_invite;
		}
	}
}

function games_accept(value, details){
	if (value == 'yes'){
		var challenger = getPlayer(details.challenger);
		if (!challenger || challenger.tsid == this.tsid) return;
		
		var q = config.shared_instances[class_tsid];
		if (!q) return;
		
		if (this.games_invite_is_full()){
			this.prompts_add({
				txt		: 'Sorry, you were not quite fast enough to join '+utils.escape(challenger.label)+' for '+details.game_name+'.',
				timeout		: 10,
				choices		: [
					{ value : 'ok', label : 'Dagnabit!' }
				]
			});
		}
		else{
			challenger.games_add_opponent(this);
		}
	}
}

function games_invite_is_full(){
	if (!this.games_invite) {
		return true;
	}

	var q = config.shared_instances[this.games_invite.class_tsid];
	if (!q) {
		return true;
	}

	if (this.games_invite.opponents.length >= q.min_players-1) {
		return true;
	}
	
	return false;
}

function games_add_opponent(pc){
	if (!this.games_invite) return false;

	var q = config.shared_instances[this.games_invite.class_tsid];
	if (!q) return false;

	if (in_array_real(pc.tsid, this.games_invite.opponents)) return false;
	
	this.games_invite.opponents.push(pc.tsid);

	if (this.games_invite.opponents.length >= q.min_players-1){
		this.events_remove(function(details){ return (details.callback == 'games_invite_timeout') ? true : false;});

		//delete this.games_invite;

		this.updateActionRequest('was looking for a challenger for <b>'+this.games_invite.game_name+'</b>. '+pc.linkifyLabel()+' accepted.', this.games_invite.opponents.length);
		this.cancelActionRequestBroadcast('game_accept', this.games_invite.class_tsid);
		
		var opponent_names = [];
		opponent_names.push(utils.escape(this.label));
		for (var i in this.games_invite.opponents){
			
			var opp = getPlayer(this.games_invite.opponents[i]);
			if (opp){
				opponent_names.push(utils.escape(opp.label));
			}
		}
		
		var pretty_opponents = pretty_list(opponent_names, ' and ');
	
		// Remove waiting prompts, add starting prompts!
		this.prompts_remove(this['!invite_uid_'+this.tsid]);
		this.apiSendAnnouncement({
			uid: "race_start_delay",
			type: "vp_overlay",
			duration: 5000,
			locking: false,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: false,
			text: [
				'<p align="center"><span class="nuxp_vog">Starting '+this.games_invite.game_name+' between '+pretty_opponents+' in 5 seconds!</span></p>'
			]
		});
		
		
		for (var i in this.games_invite.opponents){
			var opp2 = getPlayer(this.games_invite.opponents[i]);
			if (opp2){
				opp2.prompts_remove(opp['!invite_uid_'+this.tsid]);
				opp2.removeActionRequestReply(this);
				opp2.apiSendAnnouncement({
					uid: "race_start_delay",
					type: "vp_overlay",
					duration: 5000,
					locking: false,
					width: 500,
					x: '50%',
					top_y: '15%',
					click_to_advance: false,
					text: [
						'<p align="center"><span class="nuxp_vog">Starting '+this.games_invite.game_name+' between '+pretty_opponents+' in 5 seconds!</span></p>'
					]
				});
			}
		}
		
		// Start it up
		this.apiSetTimer('games_invite_start', 5*1000);
	}
	else{
		this.updateActionRequest(null, this.games_invite.opponents.length);
		
		pc['!invite_uid_'+this.tsid] = pc.prompts_add({
			txt		: 'Waiting for other players...',
			timeout		: 60,
			choices		: [
				{ value : 'ok', label : 'OK' }
			],
			quest_id	: this.games_invite.class_tsid,
			challenger	: this.tsid
		});
	}
}

function games_remove_opponent(pc){
	if (!this.games_invite) return false;

	var q = config.shared_instances[this.games_invite.class_tsid];
	if (!q) return false;

	if (!in_array_real(pc.tsid, this.games_invite.opponents)) return false;
	
	array_remove_value(this.games_invite.opponents, pc.tsid);

	this.updateActionRequest(null, this.games_invite.opponents.length);
		
	pc.prompts_remove(pc['!invite_uid_'+this.tsid]);
}

function games_invite_start(){
	if (!this.games_invite) return false;

	var q = config.shared_instances[this.games_invite.class_tsid];
	if (!q) return false;

	var manager = apiFindObject(config.shared_instance_manager);
	if (!manager) return false;

	var uid = manager.playerJoinInstance(this, this.games_invite.class_tsid, true, this.games_invite.location_id);
	log.info(this+' [GAMES] games_invite_start uid will be: '+uid);

	for (var i in this.games_invite.opponents){
		var opp = getPlayer(this.games_invite.opponents[i]);
		if (opp){
			manager.playerJoinInstance(opp, this.games_invite.class_tsid, uid, this.games_invite.location_id);
		}
	}

	delete this.games_invite;
}

function games_init_general(){
	log.info('games_init_general');
	if (this.buffs_has('hairball_dash')) this.buffs_remove('hairball_dash');
	if (this.buffs_has('hairball_flower')) this.buffs_remove('hairball_flower')
}