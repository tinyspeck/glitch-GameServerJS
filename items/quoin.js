var label = "Coin";
var version = "1351476850";
var name_single = "Coin";
var name_plural = "Coins";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["quoin"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.respawn_time = "1";	// defined by quoin
	this.instanceProps.type = "energy";	// defined by quoin
	this.instanceProps.is_random = "0";	// defined by quoin
	this.instanceProps.benefit_floor = "0";	// defined by quoin
	this.instanceProps.benefit_ceil = "0";	// defined by quoin
	this.instanceProps.benefit = "0";	// defined by quoin
	this.instanceProps.class_name = "placement tester";	// defined by quoin
	this.instanceProps.giant = "all";	// defined by quoin
	this.instanceProps.location_event_id = "";	// defined by quoin
	this.instanceProps.owner = "";	// defined by quoin
	this.instanceProps.marker = "";	// defined by quoin
	this.instanceProps.uses_remaining = "";	// defined by quoin
}

var instancePropsDef = {
	respawn_time : ["In seconds"],
	type : ["The type of quoin"],
	is_random : ["Whether the benefit amount is random (1 or 0)"],
	benefit_floor : ["The floor of the random benefit amount"],
	benefit_ceil : ["The ceiling of the random benefit amount"],
	benefit : ["The non-random benefit amount"],
	class_name : ["The class of quoin this is"],
	giant : ["The giant to assign favor points to, if type is favor"],
	location_event_id : ["The location event ID to send when the coin is picked up."],
	owner : ["tsid of the player who owns this quoin, if any"],
	marker : ["tsid of the marker that belongs to this quoin, if any"],
	uses_remaining : ["number of uses of this quoin remaining, if any"],
};

var instancePropsChoices = {
	respawn_time : [""],
	type : ["energy","mood","xp","currants","mystery","favor","time","qurazy"],
	is_random : ["1","0"],
	benefit_floor : [""],
	benefit_ceil : [""],
	benefit : [""],
	class_name : ["fast tiny mood","fast tiny energy","fast tiny xp","fast tiny currants","small random mood","small random energy","small random xp","small random currants","slow medium-large mood","slow medium-large energy","slow medium-large xp","slow medium-large currants","long random large mood","long random large energy","long random large xp","long random large currants","rainbow run","placement tester","small random favor","slow medium random favor","long large random favor","fast tiny time","small time","slow medium random time","long large random time","random baqala mood","random baqala energy","random baqala xp","random baqala currants","random baqala favor","random baqala time","slow tiny mood","slow tiny energy","slow tiny xp","slow tiny currants","quoin hub fast currants","quoin hub fast iMG","paradise iMG","paradise currants","party mood","party energy","party iMG","party currants"],
	giant : ["alph","cosma","friendly","grendaline","humbaba","lem","mab","pot","spriggan","ti","zille","all"],
	location_event_id : [""],
	owner : [""],
	marker : [""],
	uses_remaining : [""],
};

var verbs = {};

function buildState(){ // defined by quoin
	if (!this.spawned) return 'visible:false';
	if (this.instanceProps.type == 'xp') return 'scene:1';
	if (this.instanceProps.type == 'mood') return 'scene:2';
	if (this.instanceProps.type == 'energy') return 'scene:3';
	if (this.instanceProps.type == 'currants') return 'scene:4';
	if (this.instanceProps.type == 'mystery') return 'scene:5';
	if (this.instanceProps.type == 'favor') return 'scene:6';
	if (this.instanceProps.type == 'time') return 'scene:7';
	if (this.instanceProps.type == 'qurazy') return 'scene:8';
	return 'scene:3';
}

function distributeQuoinShards(pc, amount){ // defined by quoin
	if (this.instanceProps.type != 'xp' && this.instanceProps.type != 'mood' && this.instanceProps.type != 'energy' && this.instanceProps.type != 'currants') return;

	var dist_threshold = 300;
	var players = this.container.apiGetActivePlayersInTheRadiusX(pc.x, pc.y, dist_threshold);

	var quoin_multiplier = 1;
	var final_amount = 0;
	var actual = 0;
	var shards = [];

	var sound = 'QUOIN_SHARD_'+Math.min(Math.max(players.length, 2), 9);

	for (var i in players){
		actual = 0;

		// Ignore the original quoin pc
		if (players[i].pc == pc) continue;

		// Ignore player if they're following someone
		if (players[i].pc.followee) continue;

		// Ignore if they are afk
		if (players[i].pc.is_afk) continue;

		// Calculate shard percentage	
		var shard_percentage = 0.50;
		if (players[i].dist > 25){
			shard_percentage = Math.max(0.50-(0.50*((players[i].dist - 25)/275)), 0.050);
		}

		// Quoin Multiplier
		quoin_multiplier = players[i].pc.stats_get_quoin_multiplier();
		if (!quoin_multiplier) quoin_multiplier = 1;
		
		// Calculate amount
		final_amount = Math.max(Math.round(amount * quoin_multiplier * shard_percentage), 1);

		var coin_stub = null;
		// Apply and get actual amount (possible mood modifiers)
		if (this.instanceProps.type == 'xp'){
			coin_stub = 'iMG';
			actual = players[i].pc.stats_add_xp(final_amount);
		}else if (this.instanceProps.type == 'mood'){
			coin_stub = 'mood';
			actual = players[i].pc.metabolics_add_mood(final_amount);
		}else if (this.instanceProps.type == 'energy'){
			coin_stub = 'energy';
			actual = players[i].pc.metabolics_add_energy(final_amount);
		}else if (this.instanceProps.type == 'currants'){
			coin_stub = 'currants';
			actual = players[i].pc.stats_add_currants(final_amount);
		}

		if (actual > 0){
			players[i].pc.announce_sound(sound);
			if (coin_stub){
				apiLogAction('QUOIN_SHARD', 'pc='+players[i].pc.tsid, 'type='+coin_stub, 'amount='+actual, 'source_pc='+pc.tsid, 'source_amount='+amount);
				shards.push({stat:coin_stub, pc_tsid: players[i].pc.tsid, x:players[i].x, y:players[i].y-60, type:'quoin_got', delta:actual});	
			}
		}
	}


	return shards;
}

function onCreate(){ // defined by quoin
	this.initInstanceProps();
	this.state = 1;
	this.spawned = 1;
}

function onPlayerCollision(pc){ // defined by quoin
	if (!this.spawned || (this.only_visible_to && this.only_visible_to != pc.tsid)) return;

	if (!this.container.is_game && !this.container.is_race && !this.container.isInstance('rainbow_run') && !this.container.isParadiseLocation() && this.instanceProps.type != 'qurazy' && pc.stats.quoins_today.value >= pc.stats.quoins_today.top) return;

	if (this.instanceProps.is_random == 1){
		var amount = randInt(intval(this.instanceProps.benefit_floor), intval(this.instanceProps.benefit_ceil));
	}
	else{
		var amount = intval(this.instanceProps.benefit);
	}


	var shards = this.distributeQuoinShards(pc, amount);

	var personal_multiplier = pc.stats_get_quoin_multiplier();
	if (!personal_multiplier) personal_multiplier = 1;

	amount = Math.round(amount * personal_multiplier);

	if (this.instanceProps.type == 'qurazy' || amount > 0){
		if (this.instanceProps.giant == 'anyRandom'){
			var giant = choose_one(config.giants);
		}
		else{
			var giant = this.instanceProps.giant;
		}

		if (this.instanceProps.type == 'xp') var actual = pc.stats_add_xp(amount, false, {type: 'quoin', location: this.container.tsid});
		if (this.instanceProps.type == 'mood') var actual = pc.metabolics_add_mood(amount);
		if (this.instanceProps.type == 'energy') var actual = pc.metabolics_add_energy(amount);
		if (this.instanceProps.type == 'currants') var actual = pc.stats_add_currants(amount, {type: 'quoin', location: this.container.tsid});

		if (this.instanceProps.type == 'favor') { 
			var actual = pc.stats_add_favor_points(giant, amount);
			if (giant === "all") {
				pc.sendActivity("+"+amount+" favor with all giants!");
			}
			else {
				if (giant == 'ti') {
					giant = 'tii';
				}
				pc.sendActivity("+"+amount+" favor with "+capitalize(giant)+"!");
			}
		}

		if (this.instanceProps.type == 'time') pc.skills_start_acceleration(amount);

		// Since XP has the mood modifier, we need to show what they actually got
		if (this.instanceProps.type == 'xp') amount = actual;

		if (this.instanceProps.type == 'qurazy'){
			var context = {type: 'qurazy', 'location':this.container.tsid};
			var actual = pc.stats_add_xp(config.qurazy_rewards[pc.stats.level-1], false, context);
			amount = actual;
		}
		
		var shard_flag = (shards && shards.length > 0) ? 1:0;

		apiLogAction('QUOIN', 'pc='+pc.tsid, 'type='+this.instanceProps.type, 'amount='+amount, 'giant='+giant, 'shard='+shard_flag);
	}

	if (pc['!doing_rainbow_run']) {
		pc.quests_inc_counter('quoins_collected', 1);
		pc['!race_quoins_collected']++;
		pc.rainbow_run_overlay();
	}
	else if (this.container.race_type == 'most_quoins' || this.container.race_type == 'quoins_in_time'){
		pc['!race_quoins_collected']++;
		this.container.race_update_quoins_counter(pc);
	}
	else if (this.container.is_game) {
		if (this.container.game_type == 'cloudhopolis'){
			pc.cloudhopolis_get_quoin();
		}
		else{
			pc.quoin_grab_get_quoin();
		}
	}

	else if (!this.container.is_race && !this.container.isInstance('rainbow_run') && !this.container.isParadiseLocation() && !this.container.ignore_quoin_limit && this.instanceProps.type != 'qurazy'){
		pc.stats_add_quoins_today(1);
	}

	this.spawned = 0;
	this.broadcastState();

	var stat = this.instanceProps.type;
	if (this.instanceProps.type == 'qurazy' || stat == 'xp') stat = 'iMG';
	this.container.apiSendAnnouncement({
		type: "quoin_got",
		delta: amount,
		stat: stat,
		x: this.x,
		y: this.y,
		pc_tsid: pc.tsid,
		quoin_shards:shards
	});

	if (this.getInstanceProp('location_event_id')){
		this.container.events_broadcast(this.getInstanceProp('location_event_id'));
	}

	if (this.instanceProps.type == 'qurazy'){
		pc.announce_sound('QUORAZY_QUOIN');
		if (this.container && this.container.qurazy && this.container.qurazy[pc.tsid] && this.container.qurazy[pc.tsid].tsid == this.tsid){
			delete this.container.qurazy[pc.tsid];
		}
		return this.apiDelete();
	}
	else{
		var sound = 'QUOIN_GOT';
		// Need to count shards -1 since pc is not included since they're not getting a shard
		if (shards && shards.length > 0){
			sound = 'QUOIN_SHARD_'+Math.min(Math.max(shards.length+1, 2), 9);
		}
		pc.announce_sound(sound);
	}

	var uses_remaining = intval(this.getInstanceProp('uses_remaining'));
	if (uses_remaining){
		var owner = getPlayer(this.getInstanceProp('owner'));
		if (owner){
			if (owner.tsid == pc.tsid){
				pc.sendActivity("You got "+actual+" "+stat+" from your own quoin!");
			}
			else{
				pc.sendActivity("You got "+actual+" "+stat+". Thanks to "+owner.linkifyLabel()+" for making that quoin!");
			}
		}
		
		this['!ignore_prop_changes'] = true;
		uses_remaining--;
		if (uses_remaining === 0){
			var marker_tsid = this.getInstanceProp('marker');
			if (marker_tsid){
				var marker = apiFindObject(marker_tsid);
				if (marker) marker.apiDelete();
			}

			return this.apiDelete();
		}
		else{
			this.setInstanceProp('uses_remaining', uses_remaining);
		}

		delete this['!ignore_prop_changes'];
	}

	if (!this.container.is_race && !this.container.is_game && this.container.game_type != 'cloudhopolis' && !this.container.isInstance('top_of_tree')) this.apiSetTimer("onRespawn", 1000 * this.instanceProps.respawn_time);

	if (this.container.race_type == 'most_quoins'){
		this.container.race_update_quoins_remaining();

		function is_quoin(it){ return it.class_tsid == 'quoin' && it.spawned; }
		var quoins_remaining = this.container.find_items(is_quoin).length;
		if (!quoins_remaining){
			this.container.race_finish(this.container.race_find_quoins_winner());
		}
	}
}

function onPropsChanged(){ // defined by quoin
	if (this['!ignore_prop_changes']) return;

	switch (this.instanceProps.class_name){
	//
	// Here are the fast tiny ones. Currants and XP are faster 'cause we decided to use them for hinting to platforms
	//
		case 'fast tiny mood':
			this.instanceProps.type = "mood";
			this.instanceProps.respawn_time = 4*60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;		
		case 'fast tiny energy':
			this.instanceProps.type = "energy";
			this.instanceProps.respawn_time = 3*60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
		case 'fast tiny xp':
			this.instanceProps.type = "xp";
			this.instanceProps.respawn_time = 60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
		case 'fast tiny currants':
			this.instanceProps.type = "currants";
			this.instanceProps.respawn_time = 40;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
		case 'fast tiny time':
			this.instanceProps.type = "time";
			this.instanceProps.respawn_time = 60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
	//
	// Here are the small random ones
	// Currants and XP are a little faster
	//
		case 'small random mood':
			this.instanceProps.type = "mood";
			this.instanceProps.respawn_time = 7*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "2";
			this.instanceProps.benefit_ceil = "6";
			break;		
		case 'small random energy':
			this.instanceProps.type = "energy";
			this.instanceProps.respawn_time = 7*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "2";
			this.instanceProps.benefit_ceil = "6";
			break;
		case 'small random xp':
			this.instanceProps.type = "xp";
			this.instanceProps.respawn_time = 5*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "2";
			this.instanceProps.benefit_ceil = "6";
			break;
		case 'small random currants':
			this.instanceProps.type = "currants";
			this.instanceProps.respawn_time = 3*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "2";
			this.instanceProps.benefit_ceil = "6";
			break;

		case 'slow medium-large mood':
			this.instanceProps.type = "mood";
			this.instanceProps.respawn_time = 30*60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "25";
			break;		
		case 'slow medium-large energy':
			this.instanceProps.type = "energy";
			this.instanceProps.respawn_time = 30*60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "25";
			break;
		case 'slow medium-large xp':
			this.instanceProps.type = "xp";
			this.instanceProps.respawn_time = 30*60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "25";
			break;
		case 'slow medium-large currants':
			this.instanceProps.type = "currants";
			this.instanceProps.respawn_time = 30*60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "25";
			break;

		case 'long random large mood':
			this.instanceProps.type = "mood";
			this.instanceProps.respawn_time = 60*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "2";
			this.instanceProps.benefit_ceil = "100";
			break;		
		case 'long random large energy':
			this.instanceProps.type = "energy";
			this.instanceProps.respawn_time = 60*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "2";
			this.instanceProps.benefit_ceil = "100";
			break;
		case 'long random large xp':
			this.instanceProps.type = "xp";
			this.instanceProps.respawn_time = 60*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "2";
			this.instanceProps.benefit_ceil = "100";
			break;
		case 'long random large currants':
			this.instanceProps.type = "currants";
			this.instanceProps.respawn_time = 60*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "2";
			this.instanceProps.benefit_ceil = "100";
			break;

		case 'placement tester':
			this.instanceProps.respawn_time = 1;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "0";
			break;

		case 'rainbow run':
			this.instanceProps.respawn_time = 15;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			this.instanceProps.type = 'mood';
			break;
	//
	// I edited these  favor ones down quite a bit on Oct 2, 2010
	// Until we have the ability to direct it towards one giant, even 10 favor points with all is really large:
	// 10 points * 11 giants * 5 base cost = the equiv of 550 currants
	// Would be better to have 50 favor points or even 100, but just for one particular giant
	//
		case 'small random favor':
			this.instanceProps.type = "favor";
			this.instanceProps.respawn_time = 5*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "1";
			this.instanceProps.benefit_ceil = "3";
			this.instanceProps.giant = "all";
			break;
			
		case 'slow medium random favor':
			this.instanceProps.type = "favor";
			this.instanceProps.respawn_time = 20*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "2";
			this.instanceProps.benefit_ceil = "9";
			break;
			
		case 'long large random favor':
			this.instanceProps.type = "favor";
			this.instanceProps.respawn_time = 60*60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit= "10";
			break;
	//
	// I edited the time ones down as well. - Stewart
	// We don't need to give much to make people happy 
	// and we want those skills to last!
	//		
		case 'small time':
			this.instanceProps.type = "time";
			this.instanceProps.respawn_time = 10*60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "5";
			break;
			
		case 'slow medium random time':
			this.instanceProps.type = "time";
			this.instanceProps.respawn_time = 30*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "5";
			this.instanceProps.benefit_ceil = "25";
			break;
			
		case 'long large random time':
			this.instanceProps.type = "time";
			this.instanceProps.respawn_time = 60*60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "30";
			break;
	//
	// Coins for Baqala
	// Added 6/22 by Mart
	// 
		case 'random baqala mood':
			this.instanceProps.type = "mood";
			this.instanceProps.respawn_time = 10*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "6";
			this.instanceProps.benefit_ceil = "17";
			break;
		case 'random baqala energy':
			this.instanceProps.type = "energy";
			this.instanceProps.respawn_time = 10*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "6";
			this.instanceProps.benefit_ceil = "17";
			break;
		case 'random baqala xp':
			this.instanceProps.type = "xp";
			this.instanceProps.respawn_time = 10*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "6";
			this.instanceProps.benefit_ceil = "17";
			break;
		case 'random baqala currants':
			this.instanceProps.type = "currants";
			this.instanceProps.respawn_time = 10*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "6";
			this.instanceProps.benefit_ceil = "17";
			break;
		case 'random baqala favor':
			this.instanceProps.type = "favor";
			this.instanceProps.respawn_time = 10*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "1";
			this.instanceProps.benefit_ceil = "4";
			this.instanceProps.giant = "all";
			break;
		case 'random baqala time':
			this.instanceProps.type = "time";
			this.instanceProps.respawn_time = 10*60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "6";
			this.instanceProps.benefit_ceil = "17";
			break;
	//
	// Coins for Quoin Platforming Hubs
	// Added 6/18/2012 by Stewart
	// 
		case 'quoin hub fast currants':
			this.instanceProps.type = "currants";
			this.instanceProps.respawn_time = 40;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "1";
			this.instanceProps.benefit_ceil = "3";
			break;
		case 'quoin hub fast iMG':
			this.instanceProps.type = "xp";
			this.instanceProps.respawn_time = 60;
			this.instanceProps.is_random = "1";
			this.instanceProps.benefit_floor = "1";
			this.instanceProps.benefit_ceil = "3";
			break;
	//
	// Coins for Ticket to paradise levels
	// Added 6/*/2012 by Justin
	// 
		case 'paradise currants':
			this.instanceProps.type = "currants";
			this.instanceProps.respawn_time = 400000;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
		case 'paradise iMG':
			this.instanceProps.type = "xp";
			this.instanceProps.respawn_time = 400000;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
	//
	// Here are the slow tiny ones.
	//
		case 'slow tiny mood':
			this.instanceProps.type = "mood";
			this.instanceProps.respawn_time = 300;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;		
		case 'slow tiny energy':
			this.instanceProps.type = "energy";
			this.instanceProps.respawn_time = 300;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
		case 'slow tiny xp':
			this.instanceProps.type = "xp";
			this.instanceProps.respawn_time = 300;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
		case 'slow tiny currants':
			this.instanceProps.type = "currants";
			this.instanceProps.respawn_time = 300;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
		case 'slow tiny time':
			this.instanceProps.type = "time";
			this.instanceProps.respawn_time = 300;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
	//
	// Coins for Coin Sharding Party Spaces
	// Added 9/*/2012 by Justin
	// 
			case 'party mood':
			this.instanceProps.type = "mood";
			this.instanceProps.respawn_time = 2*60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;		
		case 'party energy':
			this.instanceProps.type = "energy";
			this.instanceProps.respawn_time = 2*60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
		case 'party iMG':
			this.instanceProps.type = "xp";
			this.instanceProps.respawn_time = 90;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;
		case 'party currants':
			this.instanceProps.type = "currants";
			this.instanceProps.respawn_time = 60;
			this.instanceProps.is_random = "0";
			this.instanceProps.benefit = "1";
			break;

		case '':
			break;
		default:
			log.error('Quoin '+this.tsid+' has unknown class_name: '+this.instanceProps.class_name);
	}

	if (this.instanceProps.giant == 'tii') this.instanceProps.giant = 'ti';

	this.onRespawn();
	this.apiCancelTimer('onRespawn');
}

function onRespawn(){ // defined by quoin
	this.spawned = 1;
	this.broadcastState();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-35,"w":40,"h":50},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADB0lEQVR42u1X3U+SURz2qqtu6r\/I\nu7pttVpzfaxslZQflVqWK3ONKCv8KnF+hB9RZKACUbPSWczAC5eybOHmZrNaObMwI1mMAIdMxA\/6\nxXMmDMdr64JXWr3P9myH8zvnPc\/7O78P3qQkAQIECBDwb0IkEq1VKhsLDAZDj0qlSom22Wy2\/Xa7\n\/aTJZFqXMIGa1uagRqMJvjIOUbuuKugw7w64BrMWvr6uDVo\/j5N\/2s84Nzc3mRCB2pY7iw+0bfTC\nbOr1+XyKyScbmcjhzszT8J73xzS5HJ6fDodDnDAvfhoZ2RQeQ+B3q9rCZfsr4H4rXiYw4QlCISwu\nLJLzm4sRY8A2Zqeh7vf0rvcjmwfcbvepVROXnJy8ZnZ2tmN0yErdLf30qN5I9yufkfFuP\/U9tlBb\njZHkBa3UVPSQDLf7mGBg1QR6vd5cHAhRxaJGkuyrZsRYfqY18hu8cqCOCYYnV0XcxMTEhvn5eRcO\nvJRau4zn98jobEoZExY9X5p+k113IBCwOJ1O\/hInJMyH0oFrVV5oY96J5ox9hnFseDzGVpahYPuw\nH88ZGBhYH3eBSALEWeXRFrp6sCGGYYEglx37sB\/PCXlTH3eB8Iw8T0fSQ42cRDJAHDJ4pTV1+feY\nh+HFuAvsVPRQSZpiRUpFDSRJrSZZlvq368ztg\/xkdZf2OV0MBX35ESUnw9c7+tK64hqW1fVd\/AhE\n5iIjr6U3cTJaIJe99PAtytt2mYUC6mjcBeKt1UUdVJGh4mS0QC577lZJxHtTU1PbeREoTWsgWaaa\nk9ECuezoOAAvGRwWqCjSsUCvOqaJYVggijKX\/amum9+WF3rzL4ifnC0S1iGqj+uWEdmJEqMtMcTY\nwGHzB\/L7\/W94E4i4gQdwUP4OKZ3bWU7ivZVUk61jRI1Dh5Gf0EfmQFlWM1sLoI\/z2os9Hk8Giiz+\nyiPgUfcKd11nHrqRo2fEGHPZm8UR1haq+PUeF9BPcSg8g+8SiECMYryUDJYl6nnJ2j9F6HukAvFJ\nS8CY96sUIECAgP8IvwBlj81bhawogAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/quoin-1335988226.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: true,
	has_status	: false,
	not_selectable	: true,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("quoin.js LOADED");

// generated ok 2012-10-28 19:14:10 by mygrant
