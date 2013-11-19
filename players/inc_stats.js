
function stats_init(){

	if (config.level_limit){
		var info = this.stats_calc_level_xp_needed(config.level_limit);
		this.init_prop('stats', 'xp', 0, 0, info[config.level_limit].xp_for_this);
	}
	else{
		this.init_prop('stats', 'xp', 0, 0, 2000000000);
	}

	var temp_level = this.stats_calc_level_from_xp_simple(this.stats.xp.value);
	if (this.stats.level != temp_level){
		this.stats.level = temp_level;
	}

	this.init_prop('stats', 'currants', 0, 0, 2000000000);
	

	var quoin_limit = (this.daily_quoin_limit) ? this.daily_quoin_limit : this.imagination_get_quoin_limit();

	this.init_prop('stats', 'quoins_today', 0, 0, quoin_limit);
	if (this.quoins_today) delete this.quoins_today;
	this.init_prop('stats', 'meditation_today', 0, 0, (this.get_meditation_bonus() * this.metabolics_get_max_energy()));
	if (this.meditation_today) delete this.meditation_today;

	if (!this.stats.misc) this.stats.misc = {};
	if (!this.favor_points) {
		this.favor_points = {};
		if (this.favour_points){
			for (var i in this.favour_points){
				this.init_prop('favor_points', i, this.favour_points[i].value, 0, this.stats_get_max_favor(i));
			}
			
			delete this.favour_points;
		}
	}
	
	if (!this.street_history){
	//if (this.street_history === undefined || this.street_history === null){
		this.street_history = apiNewOwnedDC(this);
		this.street_history.label = 'Street History';
		this.street_history.streets = {};
		this.street_history.pols = {};
	}
	
	if(this.giant_emblems === undefined || this.giant_emblems === null) {
		this.giant_emblems = {};
	}
	
	this.init_prop('stats', 'rube_trades', 0, 0, 3);
	this.init_prop('stats', 'rube_lure_disabled', 0, 0, 1);

	this.init_prop('stats', 'imagination', 0, 0, 2000000000);
	this.init_prop('stats', 'credits', 0, 0, 2000000000);

	if (!this.stats.quoin_multiplier) this.stats.quoin_multiplier = 1;

	if (!this.stats.has_subscription) this.stats.has_subscription = false;

	delete this.stats.beans_made;
}

function stats_delete(){

	delete this.stats;
	delete this.favor_points;
	delete this.giant_emblems;
	
	this.stats_reset_street_history();
}

function stats_reset_xp(){

	this.stats_init();
	this.stats.xp.apiSet(0);
	this.stats_add_xp(0);
}

function stats_reset_imagination(){

	this.stats_init();
	this.stats.imagination.apiSet(0);
	this.stats_add_imagination(0);
}

function stats_reset_favor(){

	delete this.favor_points;
	this.stats_init();
}

function stats_reset_street_history(){
	if (this.street_history){
		this.street_history.streets = {};
		this.street_history.pols = {};
	}
}

function stats_calc_level_from_xp_simple(xp){

	var ret = this.stats_calc_level_from_xp(xp);

	return ret.level;
}

var xp_for_level = [
	400,
	1091,
	2180,
	3795,
	6085,
	9219,
	13393,
	18826,
	25766,
	34490,
	45305,
	58551,
	74604,
	93876,
	116819,
	143924,
	175726,
	212806,
	255793,
	305366,
	362256,
	427250,
	501193,
	584989,
	679606,
	786079,
	905510,
	1039074,
	1188021,
	1353678,
	1537454,
	1740841,
	1965421,
	2212865,
	2484939,
	2783508,
	3110539,
	3468103,
	3858382,
	4283670,
	4746380,
	5249045,
	5794324,
	6385006,
	7024015,
	7714412,
	8459403,
	9262341,
	10126733,
	11056241,
	12054692,
	13126080,
	14274570,
	15504507,
	16820419,
	18227022,
	19729227,
	21332145,
	23041093
];
function stats_calc_level_from_xp(xp){

	if (xp < this.xp_for_level[0]){
		return {
			level		: 1,
			xp_for_this	: 0,
			xp_for_next	: this.xp_for_level[0]
		};
	}

	for (var l=0; l<this.xp_for_level.length; l++){
		if (this.xp_for_level[l] > xp) break;
	}

	return {
		level		: l+1,
		xp_for_this	: this.xp_for_level[l-1],
		xp_for_next	: (this.xp_for_level[l] ? this.xp_for_level[l] : 0)
	};
}

function stats_calc_level_xp_needed(up_to){

	var out = {};

	out[1] = {
		xp_for_this	: 0,
		xp_for_next	: this.xp_for_level[0],
	};

	var l = 1;
	while (l < up_to){

		out[l+1] = {
			xp_for_this	: this.xp_for_level[l-1],
			xp_for_next	: (this.xp_for_level[l] ? this.xp_for_level[l] : 0),
		};

		if (config.level_limit && l >= config.level_limit) break;
		l++;
	}

	return out;
}

function stats_at_level_cap(){
	if (this.stats_get_level() >= config.level_limit) return true;
	return false;
}

function stats_next_level(){
	if (!this.stats){
		this.stats_init();
	}

	var ret = this.stats_calc_level_from_xp(this.stats.xp.value);
	var needed = ret.xp_for_next - this.stats.xp.value;

	this.stats_add_xp(needed+1, true);
}

function stats_get_xp_mood_bonus(){
	var mood = this.metabolics_get_percentage('mood');
	
	// With pleasant equilibrium, the player will not drop below 0.75 multiplier.
	if (mood < 50 && this.buffs_has('pleasant_equilibrium')){
		mood = 49;
	}
	
	if (mood < 10){
		return 0;
	}
	else if (mood < 20){
		return 0.5;
	}
	else if (mood < 50){
		return 0.75;
	}
	else if (mood < 70){
		return 0.9;
	}
	else if (mood < 80){
		return 1;
	}
	else if (mood < 90){
		return 1.1;
	}
	else{
		return 1.2;
	}
}

function stats_add_xp(xp, no_bonus, context){
	if (!this.stats){
		this.stats_init();
	}


	//
	// Apply mood bonus
	//

	if (!no_bonus && !this.is_dead){
		xp = this.stats_xp_apply_bonus(xp);
	}


	//
	// Increment counters
	//

	var imagination = this.stats.imagination.apiInc(xp);
	this.daily_history_increment('imagination', imagination);

	if (this.isOnline() && imagination){
		this.apiSendAnnouncement({
			type: "imagination_stat",
			delta: imagination
		});
	}

	if (context && imagination){
		var log_args = [];
		for (var k in context){
			log_args.push(k+':'+context[k]);
		}

		apiLogAction('GAIN_IMAGINATION', 'pc='+this.tsid, 'context=['+log_args.join(",")+']', 'imagination='+imagination);
	}
	else if (imagination){
		apiLogAction('GAIN_IMAGINATION', 'pc='+this.tsid, 'imagination='+imagination);
	}

	if (this.stats.xp >= 7652 && this.getQuestStatus('puzzle_level_light_perspective') == 'none') {
		this.quests_offer('puzzle_level_light_perspective');
	}
	if (this.stats.xp >= 11306 && this.getQuestStatus('radiant_glare') == 'none') {
		this.quests_offer('radiant_glare');
	}
	if (this.stats.xp >= 16110 && this.getQuestStatus('mental_block') == 'none') {
		this.quests_offer('mental_block');
	}
	if (this.stats.xp >= 4940 && this.getQuestStatus('puzzle_level_color_blockage') == 'none') {
		this.quests_offer('puzzle_level_color_blockage');
	}
	if (this.stats.xp >= 30128 && this.getQuestStatus('join_club') == 'none') {
		if (this.butler_tsid) {
			var butler = apiFindObject(this.butler_tsid);
			if (!butler.available_quests) {
				butler.setAvailableQuests(['join_club']);
			}
			else {
				butler.available_quests.push('join_club');
			}
		}
	}
	if (this.stats.xp >= 22296 && this.getQuestStatus('btc_room_3') == 'none') {
		this.quests_offer('btc_room_3');
	}
	if (this.stats.xp >= 39898 && this.getQuestStatus('mental_block_2') == 'none') {
		this.quests_offer('mental_block_2');
	}
	if (this.stats.xp >= 34490 && this.getQuestStatus('picto_pattern') == 'none') {
		this.quests_offer('picto_pattern');
	}

	//
	// Check level limit
	//

	if (config.level_limit && this.stats.level >= config.level_limit && xp >= 0) return imagination;

	xp = this.stats.xp.apiInc(xp);
	this.daily_history_increment('xp', xp);
	var info = this.stats_calc_level_from_xp(this.stats.xp.value);

	if (this.isOnline() && xp){
		this.apiSendAnnouncement({
			type: "xp_stat",
			delta: xp
		});
	}

	if (xp) this.quests_give_level();

	//
	// Check level up
	//

	if (info.level != this.stats.level){

		this.stats.level = info.level;

		this.metabolics_recalc_limits(false);
		
		if (!this.is_dead){
			var energy_added = this.metabolics_set_energy(this.metabolics.energy.top);
			var mood_added = this.metabolics_set_mood(this.metabolics.mood.top);
		}
		else{
			var energy_added = 0;
			var mood_added = 0;
		}

		//log.info('player has levelled up!');
		this.sendActivity("Woo! you've reached level "+info.level+"!!!");
		this.sendLocationActivity(this.label + " just reached level "+info.level+"!", this, this.buddies_get_ignoring_tsids());

		this.level_up_time = time();

		//
		// rewards are based on xp needed to hit this level (non-cumm)
		//

		var prev_level = info.level - 1;
		var info2 = this.stats_calc_level_xp_needed(prev_level);
		var xp_needed = 0;
		if (info2 && info2[prev_level]) xp_needed = info2[prev_level].xp_for_next - info2[prev_level].xp_for_this;

		var reward_currants;
		if (this.stats.level <= 25 || this.stats.level % 5 == 0){
			reward_currants = Math.round(xp_needed / 40) * 10;
		}
		else{
			reward_currants = 0;
		}
		
		// From Excel: round(log(xp_needed)*log(xp_needed)*sqrt(xp_needed)/20)
		var reward_favor = Math.round(Math.pow(Math.log(xp_needed)/Math.LN10, 2) * (Math.sqrt(xp_needed) / 20));

		this.stats_add_currants(reward_currants);
		this.stats_add_favor_points('all', reward_favor);
		this.daily_history_increment('level_up', 1);


		//
		// Now that all rewards are handed out, construct the new_level message (needs to come after rewards given so the stats blocks are correct)
		//

		var rsp = {
			'type': 'new_level',
			'sound': 'LEVEL_UP',
			'stats': {},
			'rewards': {
				'currants': reward_currants,
				'favor': {0: {giant: 'all', points: reward_favor}}
			}
		};

		if (!this.has_done_intro) rsp.do_not_annc = true;

		this.stats_get_login(rsp.stats);
		this.metabolics_get_login(rsp.stats);

		this.sendMsgOnline(rsp);
		
		
		// Tell your friends
		this.buddies_update_reverse_cache();
		var rsp = {
			'type': 'pc_level_up',
			'tsid': this.tsid,
			'label': this.label,
			'level': this.stats.level
		};
			
		this.reverseBuddiesSendMsg(rsp);
		
		// Check for 11 secret locations start:
		if (this.stats.level >= this.secretLocationsQuestLevel()) {
			this.startSecretLocationsQuest();
		}

		this.activity_notify({
			type	: 'level_up',
			level	: this.stats.level
		});

		apiLogAction('LEVEL_UP', 'pc='+this.tsid, 'level='+this.stats.level, 'energy='+energy_added, 'mood='+mood_added, 'currants='+reward_currants, 'favor='+reward_favor);

		this.stats_init(); // Stats init sets a lot of props that change when you level up
	}

	if (context && xp){		
		var log_args = [];
		for (var k in context){
			log_args.push(k+':'+context[k]);
		}

		apiLogAction('GAIN_XP', 'pc='+this.tsid, 'context=['+log_args.join(",")+']', 'xp='+xp);
	}

	return xp;
}

function stats_get_xp(){
	if (!this.stats){
		this.stats_init();
	}

	return this.stats.xp.value;
}


function stats_get_imagination(){
	if (!this.stats){
		this.stats_init();
	}

	return this.stats.imagination.value;
}

function stats_set_imagination(num, quiet){
	this.stats_init();

	var change = num - this.stats.imagination.value;
	this.stats.imagination.apiSet(num);

	if (change && !quiet){
		this.apiSendAnnouncement({
			type: "imagination_stat",
			delta: change
		});
	}
}

function stats_add_imagination(num, context){
	if (!num) return 0;
	this.stats_init();

	var change = this.stats.imagination.apiInc(num);
	this.daily_history_increment('imagination', change);

	this.apiSendAnnouncement({
		type: "imagination_stat",
		delta: change
	});

	if (context){
		var log_args = [];
		for (var k in context) {
			log_args.push(k+':'+context[k]);
		}
		if (change > 0) {
			apiLogAction('GAIN_IMAGINATION', 'pc='+this.tsid, 'context=['+log_args.join(",")+']', 'imagination='+change);
		}
	}
	
	return change;
}

function stats_remove_imagination(num, context){
	this.stats_init();

	var change = this.stats.imagination.apiDec(num);

	this.apiSendAnnouncement({
		type: "imagination_stat",
		delta: change
	});

	if (context){
		var log_args = [];
		for (var k in context) {
			log_args.push(k+':'+context[k]);
		}
		if (change < 0) {
			apiLogAction('LOSE_IMAGINATION', 'pc='+this.tsid, 'context=['+log_args.join(",")+']', 'imagination='+change);
		}
	}

	return change;
}

function stats_try_remove_imagination(num, context){
	this.stats_init();

	if (this.stats.imagination.value < num) return false;

	this.stats_remove_imagination(num, context);

	return true;
}

function stats_has_imagination(num){
	this.stats_init();

	return (this.stats.imagination.value < num) ? false : true;
}


function stats_xp_apply_bonus(xp){
	var multiplier = this.stats_get_xp_mood_bonus();
	
	xp = Math.round(xp * multiplier);
	
	// no-no powder nerf
	if (this.buffs_has('no_no_powder')){
		xp = Math.round(xp * 0.2);
	}

	return xp;
}

function stats_get(){

	var out = {};
	this.stats_get_login(out);
	return out;
}

function stats_get_login(out){
 
	this.stats_init();
	this.skills_init();

	var ret = this.stats_calc_level_from_xp(this.stats.xp.value);

	out.level	= ret.level;
	out.xp = {
		'total' : this.stats.xp.value,
		'base'	: ret.xp_for_this,
		'nxt'	: ret.xp_for_next,
	};
	out.currants	= this.stats.currants.value;

	out.quoin_multiplier = this.stats.quoin_multiplier;

	out.favor_points = {};
	for (var i in this.favor_points){
		out.favor_points[i] = this.favor_points[i].value;
	}

	out.favor_points_new = {};
	for (var i in this.favor_points){
		out.favor_points_new[i] = {
			current: this.favor_points[i].value,
			max: this.stats_get_max_favor(i),
			cur_daily_favor: (this.daily_favor && this.daily_favor[i]) ? this.daily_favor[i] : 0
		};
	}

	out.skill_training = {};
	
	var queue = this.skills_get_queue();
	if (num_keys(queue)){
		for (var i in queue){
			if (!queue[i].is_paused){
				var skill = this.skills_get(i);
				out.skill_training = {
					tsid: i,
					name: this.skills_get_name(i),
					desc: skill.description,
					time_remaining: queue[i].end - time(),
					total_time: this.skills_points_to_seconds(skill.point_cost),
					is_accelerated: queue[i].is_accelerated
				};
			}
		}
	}
	
	out.skill_unlearning = {};
	var unlearningqueue = this.skills_get_unlearning();
	
	if (unlearningqueue && unlearningqueue.id){
		var id = unlearningqueue.id;
		var unskill = this.skills_get(id);
		out.skill_unlearning = {
			tsid: id,
			name: this.skills_get_name(id),
			desc: unskill.description,
			time_remaining: unlearningqueue.queue.remaining,
			total_time: unlearningqueue.queue.unlearn_time
		};
	}

	out.num_skills = this.skills_get_count();
	out.brain_capacity = this.get_brain_capacity();
	out.skill_learning_modifier = this.skills_get_learning_time_modifier();
	
	out.quoins_today = {
		value	: this.stats.quoins_today.value,
		max	: this.stats.quoins_today.top
	};
	
	out.meditation_today = {
		value	: this.stats.meditation_today.value,
		max	: this.stats.meditation_today.top
	};
	
	out.energy_spent_today = intval(this.daily_history_get(current_day_key(), 'energy_consumed')) * -1;
	out.xp_gained_today = intval(this.daily_history_get(current_day_key(), 'xp'));

	out.imagination = this.stats.imagination.value;
	out.imagination_gained_today = intval(this.daily_history_get(current_day_key(), 'imagination'));

	out.imagination_hand = this.imagination_get_login();
	out.imagination_shuffle_cost = 0;
	out.imagination_shuffled_today = this.achievements_get_daily_label_count('imagination', 'shuffle') ? true : false;

	out.credits = this.stats.credits.value;
	out.is_subscriber = this.stats_is_sub();
}

function stats_set_quoins_today(num){
	this.stats_add_quoins_today(num - this.stats.quoins_today.value);
}

function stats_add_quoins_today(num){
	
	var change;
	if (num >= 0){
		change = this.stats.quoins_today.apiInc(num);
	}
	else{
		change = this.stats.quoins_today.apiDec(num * -1);
	}
	
	if (this.stats.quoins_today.value == this.stats.quoins_today.top && !this.location.isParadiseLocation()){
		this.prompts_add({
			txt		: "Wowza! You've reached your limit on quoins for this game day.",
			icon_buttons	: false,
			timeout		: 10,
			choices		: [
				{ value : 'ok', label : 'OK' }
			]
		});
		if (this.stats.quoins_today.top == 150){
			this.show_rainbow('rainbow_150coinstoday');
		}else{
			this.show_rainbow('rainbow_100coinstoday');
		}

		apiLogAction('QUOIN_LIMIT', 'pc='+this.tsid, 'limit='+this.stats.quoins_today.top);

		// http://bugs.tinyspeck.com/9138
		//this.buffs_remove('crazy_coin_collector');
	}
	
	if (change && this.isOnline()){
		this.apiSendAnnouncement({
			type: "quoins_stat",
			delta: change,
		});
	}
	
	return change;
}

function stats_set_quoins_max_today(num){
	this.daily_quoin_limit = num;
	this.stats.quoins_today.apiSetLimits(0, num);
	
	if (this.isOnline()){
		this.apiSendAnnouncement({
			type: "quoins_stat_max",
			delta: num
		});
	}
}

function stats_set_meditation_max_today(no_client){
	this.init_prop('stats', 'meditation_today', 0, 0, (this.get_meditation_bonus() * this.metabolics_get_max_energy()));
	
	var rsp = {
		'type': 'stat_max_changed',
		'stats': {}
	};
    
    if (!no_client){
		this.stats_get_login(rsp.stats);
		this.metabolics_get_login(rsp.stats);
		this.apiSendMsg(rsp);
	}
}

function stats_set_making_xp_today(recipe_id, num){
	this.stats_add_making_xp_today(recipe_id, num - this.stats.making_xp_today.value);
}

function stats_add_making_xp_today(recipe_id, num){

	if (!this.stats.recipe_xp_today){
		this.stats.recipe_xp_today = {};
	}

	if (!this.stats.recipe_xp_today[recipe_id]){
		this.stats.recipe_xp_today[recipe_id] = this.apiNewProperty(recipe_id.toString(), 0);
	}
	this.stats.recipe_xp_today[recipe_id].apiSetLimits(0, this.making_get_xp_ceiling());
	
	var change;
	if (num >= 0){
		change = this.stats.recipe_xp_today[recipe_id].apiInc(num);
	}
	else{
		change = this.stats.recipe_xp_today[recipe_id].apiDec(num * -1);
	}
		
	return change;
}

function stats_set_meditation_today(num){
	this.stats_add_meditation_today(num - this.stats.meditation_today.value);
}

function stats_add_meditation_today(num){
	if (num >= 0){
		var change = this.stats.meditation_today.apiInc(num);
	}
	else{
		var change = this.stats.meditation_today.apiDec(num * -1);
	}
	
	if (this.stats.meditation_today.top && this.stats.meditation_today.value == this.stats.meditation_today.top){
		var tomorrow = timestamp_to_gametime(time()+ (game_days_to_ms(1)/1000));
		tomorrow[3] = 0;
		tomorrow[4] = 0;
				
		var remaining = gametime_to_timestamp(tomorrow) - time();
		this.buffs_apply('zen', {duration: remaining});
	}
	
	if (change && this.isOnline()){
		this.apiSendAnnouncement({
			type: "meditation_stat",
			delta: change
		});
	}
	
	return change;
}

function stats_set_currants(num){
	this.stats_init();

	var change = num - this.stats.currants.value;
	this.stats.currants.apiSet(num);

	this.apiSendAnnouncement({
		type: "currants_stat",
		delta: change
	});
}

function stats_add_currants(num, context){
	if (!num) return 0;
	this.stats_init();

	var change = this.stats.currants.apiInc(num);

	this.apiSendAnnouncement({
		type: "currants_stat",
		delta: change
	});
	
	// Check for currants achievements
	if (this.stats_get_currants() >= 2022 && !this.achievements_has('pennypincher')){
		this.achievements_grant('pennypincher');
	}

	if (this.stats_get_currants() >= 5011 && !this.achievements_has('moneybags')){
		this.achievements_grant('moneybags');
	}

	if (this.stats_get_currants() >= 11111 && !this.achievements_has('lovable_skinflint')){
		this.achievements_grant('lovable_skinflint');
	}

	if (context){
		var log_args = [];
		for (var k in context) {
			log_args.push(k+':'+context[k]);
		}
		if (change > 0) {
			apiLogAction('GAIN_CURRANTS', 'pc='+this.tsid, 'context=['+log_args.join(",")+']', 'currants='+change);
		}
	}
	
	return change;
}

function stats_remove_currants(num, context){
	this.stats_init();

	var change = this.stats.currants.apiDec(num);

	this.apiSendAnnouncement({
		type: "currants_stat",
		delta: change
	});

	if (context){
		var log_args = [];
		for (var k in context) {
			log_args.push(k+':'+context[k]);
		}
		if (change < 0) {
			apiLogAction('LOSE_CURRANTS', 'pc='+this.tsid, 'context=['+log_args.join(",")+']', 'currants='+change);
		}
	}
	else if (change < 0){
		apiLogAction('LOSE_CURRANTS', 'pc='+this.tsid, 'currants='+change);
	}

	return change;
}

function stats_try_remove_currants(num, context){
	this.stats_init();

	if (this.stats.currants.value < num) return false;

	this.stats_remove_currants(num, context);

	return true;
}

function stats_has_currants(num){
	this.stats_init();

	return (this.stats.currants.value < num) ? false : true;
}

function stats_set_rube_trades(num) {
	this.stats_init();
	
	this.stats.rube_trades.apiSet(num);
}

function stats_add_rube_trade() {
	this.stats_init();
	
	this.stats.rube_trades.apiInc(1);
	this.stats.last_rube_trade = time();
}

function stats_get_last_rube_trade() {
	return this.stats.last_rube_trade;
}

function stats_get_rube_trades() {
	return this.stats.rube_trades.value;
}

function stats_set_temp_buff(buff_class_tsid, stat_id, value){

	if (!this.stats.misc.buffs){
		this.stats.misc.buffs = {};
	}

	if (!this.stats.misc.buffs[buff_class_tsid]){
		this.stats.misc.buffs[buff_class_tsid] = {};
	}

	this.stats.misc.buffs[buff_class_tsid][stat_id] = value;
}

function stats_fixup_buffs(){
	
	this.metabolics_recalc_limits(false);

	if (!this.stats.misc.buffs) return;

	for (var i in this.stats.misc.buffs){

		if (!this.buffs_has(i)){

			delete this.stats.misc.buffs[i];
		}
	}
}

function stats_get_currants(){
	
	this.stats_init();

	return this.stats.currants.value;
}

function stats_get_level(){

	this.stats_init();
	
	return this.stats.level;
}

function stats_add_favor_points(giant, value, suppress_prompt){
	if (giant == 'all'){
		for (var i=0; i<config.giants.length; i++){
			this.stats_add_favor_points(config.giants[i], value);
		}
		
		return value;
	}
	else if (giant == 'street'){
		log.error("Uh-oh, don't know how to do this yet.");
		return 0;
	}
	else{
		/* Make sure this is a real giant */
		if(!in_array(giant, config.giants)) {
			this.sendActivity("Oops, there was a problem communicating with the Giants, and you didn't receive some favor when you should have. Please let us know by filing a bug report!");
			log.error(this+" failed to receive "+value+" favor, because giant "+giant+" is not a real giant.");
			return;
		}
		
		this.init_prop('favor_points', giant, 0, 0, this.stats_get_max_favor(giant));
		var change = this.favor_points[giant].apiInc(value);
	
		if (change){
			this.achievements_increment('favor_points', giant, change);
			this.counters_increment('favor_points', giant, change);
			this.apiSendAnnouncement({
				type: "favor_stat",
				giant: giant,
				delta: change,
			});
		
			if (!suppress_prompt && this.stats_has_favor_points(giant, this.stats_get_max_favor(giant))){
			
				var txt = "You have reached "+this.stats_get_max_favor(giant)+" favor points with "+capitalize(giant.replace("ti", "tii"))+". Get to a shrine and collect your emblem!";
				this.prompts_add({
					txt		: txt,
					icon_buttons	: false,
					timeout		: 10,
					choices		: [
						{ value : 'ok', label : 'OK' },
					],
				});
				this.sendActivity(txt);
			}
		}
	
		return change;
	}
}

function stats_remove_favor_points(giant, value){
	this.init_prop('favor_points', giant, 0, 0, this.stats_get_max_favor(giant));
	var change = this.favor_points[giant].apiDec(value);

	if (change){
		this.apiSendAnnouncement({
			type: "favor_stat",
			giant: giant,
			delta: change,
		});
	}

	return change;
}

function stats_get_favor_points(giant){
	if (!this.favor_points) return 0;
	
	if (!this.favor_points[giant]) return 0;
	
	return this.favor_points[giant].value;
}

function stats_get_most_favor(){
	var most_giant = null;
	var most_points = 0;
	
	for (var giant in this.favor_points){
		var points = this.stats_get_favor_points(giant);
		if (points > most_points){
			most_points = points;
			most_giant = giant;
		}
	}
	
	return most_giant;
}

function stats_has_favor_points(giant, value){
	return this.stats_get_favor_points(giant) >= value ? true : false;
}

function stats_add_street_history(tsid, is_pol){
	if (!this.street_history) this.stats_init();
	
	if (is_pol){
		this.street_history.pols[tsid] = time();
	}
	else{
		this.street_history.streets[tsid] = time();
	}
}

function stats_get_street_history() {
	return this.street_history.streets;
}

function stats_get_pol_history() {
	return this.street_history.pols;
}

function stats_get_last_street_visit(tsid){
	if (!this.street_history) return 0;
	if (this.street_history.streets && this.street_history.streets[tsid]){
		return this.street_history.streets[tsid];
	}
	else if (this.street_history.pols && this.street_history.pols[tsid]){
		return this.street_history.pols[tsid];
	}
	
	return 0;
}

function stats_add_emblem(giant) {
	if(!this.giant_emblems) {
		this.giant_emblems = {};
	}
	
	this.init_prop('giant_emblems', giant, 0, 0, 100000);
	this.giant_emblems[giant].apiInc(1);
}

function stats_get_emblems(giant) {
	if(!this.giant_emblems || !this.giant_emblems[giant]) {
		return 0;
	}
	
	return this.giant_emblems[giant].value;
}

function stats_get_max_favor(giant) {
	return config.emblem_favor_cost + (this.stats_get_emblems(giant) * config.emblem_favor_increment);
}

function stats_set_rube_lure_disabled(disabled){
	if (!this.stats.rube_lure_disabled) this.stats_init();

	if (disabled){
		this.stats.rube_lure_disabled.apiSet(1);
	}else{
		this.stats.rube_lure_disabled.apiSet(0);
	}
}

function stats_rube_lure_disabled(){
	if (!this.stats.rube_lure_disabled) this.stats_init();
	return this.stats.rube_lure_disabled.value;
}

function stats_get_daily_count(class_tsid){
	if (!this.stats.daily_count) this.stats.daily_count = {};
	if (!this.stats.daily_count[class_tsid]) this.stats.daily_count[class_tsid] = 0;
	return this.stats.daily_count[class_tsid];
}

function stats_init_daily_counter(){
	if (!this.stats.daily_count){
		this.stats.daily_count = {};
	}
}

function stats_reset_daily_counter(){
	this.stats.daily_count = {};
}

function stats_get_daily_counter(class_tsid){
	this.stats_init_daily_counter();
	if (!this.stats.daily_count[class_tsid]) this.stats.daily_count[class_tsid] = 0;
	return this.stats.daily_count[class_tsid];
}

function stats_set_daily_counter(class_tsid, num){
	this.stats_init_daily_counter();
	this.stats.daily_count[class_tsid] = num;
}

function stats_inc_daily_counter(class_tsid, num){
	this.stats_init_daily_counter();
	if (!this.stats.daily_count[class_tsid]) this.stats.daily_count[class_tsid] = 0;
	this.stats.daily_count[class_tsid] += 1;
}

function stats_dec_daily_counter(class_tsid, num){
	this.stats_init_daily_counter();
	if (!this.stats.daily_count[class_tsid]) this.stats.daily_count[class_tsid] = 0;
	this.stats.daily_count[class_tsid] -= 1;
}

function stats_set_credits(num){
	this.stats_init();

	var change = num - this.stats.credits.value;
	this.stats.credits.apiSet(num);

	this.apiSendAnnouncement({
		type: "credits_stat",
		delta: change
	});
}

function stats_spend_credits(num, args){
	this.stats_init();

	if (num == 0){
		args.ok = 1;
		args.amount = 0;
		this[args.callback](args);
		return true;
	}

	if (this.stats.credits.value < num){
		args.ok = 0;
		args.amount = num;
		this[args.callback](args);
		return false;
	}

	// Tell the web app, which will sync back to us eventually
	args.player = this.tsid;
	args.amount = num;
	utils.http_post('callbacks/credits_spend.php', args, this.tsid);

	return true;
}

function stats_has_credits(num){
	this.stats_init();

	return (this.stats.credits.value < num) ? false : true;
}

function stats_get_credits(){
	this.stats_init();

	return this.stats.credits.value;
}

function stats_set_sub(is_sub, sub_end){
	this.stats_init();
	this.stats.has_subscription = is_sub ? true : false;
	if (is_sub) this.stats.subscription_end = sub_end;

	this.apiSendAnnouncement({
		type: "subscriber_stat",
		status: is_sub ? true : false
	});
}

function stats_is_sub(){
	this.stats_init();

	if (!this.stats.has_subscription) return false;

	return (this.stats.subscription_end < time()) ? false : true;
}

function stats_get_quoin_multiplier(){
	return this.stats.quoin_multiplier;
}

function stats_set_quoin_multiplier(amount){
	this.stats.quoin_multiplier = amount;
	if (this.stats.quoin_multiplier > config.quoin_capacity_limit) this.stats.quoin_multiplier = config.quoin_capacity_limit;
}

function stats_increase_quoin_multiplier(amount){
	this.stats.quoin_multiplier += amount;
	if (this.stats.quoin_multiplier > config.quoin_capacity_limit) this.stats.quoin_multiplier = config.quoin_capacity_limit;
}

function stats_get_all_favor(){

	var out = {};
	for (var i=0; i<config.giants.length; i++){

		var g = config.giants[i];
		var name = g.replace('ti', 'tii');

		var max_daily_favor = this.stats_get_max_favor(g);
		var cur_daily_favor = 0;

		if (this.daily_favor && this.daily_favor[g]){
			cur_daily_favor = this.daily_favor[g].value;
		}

		out[g] = {
			name		: name,

			current		: this.stats_get_favor_points(g),
			max		: this.stats_get_max_favor(g),

			max_daily_favor	: max_daily_favor,
			cur_daily_favor	: cur_daily_favor,
		};
	}
	return out;
}

function stats_get_favor_summary(){

	var max_daily = this.stats_donation_xp_limit();
	var cur_daily = 0;

	if (this.stats.donation_xp_today) cur_daily = this.stats.donation_xp_today.value;
	if (this.stats.level >= config.level_limit) max_daily = 0;

	return {
		max_daily_xp	: max_daily,
		cur_daily_xp	: cur_daily,
		giants		: this.stats_get_all_favor(),
	};

}

function stats_donation_xp_limit(){

	var level_data = this.stats_calc_level_from_xp(this.stats_get_xp());
	var level = level_data.level;
	var xp_base = 0;

	if (level <= 5) {
		xp_base = 250;
	} else if (level <= 10) {
		xp_base = 500;
	} else if (level <= 30) {
		var multiplier = 0.2 - (level - 11) * 0.005;
		xp_base = (level_data.xp_for_next - level_data.xp_for_this) * multiplier;
	} else if (level == 60){
		xp_base = 170894.8; // hard-coded value for what you get at level 59: http://bugs.tinyspeck.com/8535
	} else {
		xp_base = (level_data.xp_for_next - level_data.xp_for_this) * 0.1;
	}

	if (xp_base <= 0) xp_base = 0;

	return Math.round(xp_base);
}
