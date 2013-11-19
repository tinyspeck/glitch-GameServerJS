//#include include/street_spirits.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Street Spirit";
var version = "1351816158";
var name_single = "Street Spirit";
var name_plural = "Street Spirits";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["street_spirit_groddle", "street_spirit", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "pace",	// defined by npc_walkable
	"loneliness_state"	: "idle_cry",	// defined by street_spirit
	"conversation_offset_x"	: "0",	// defined by street_spirit
	"conversation_offset_y"	: "60",	// defined by street_spirit
	"loneliness_size"	: "250",	// defined by street_spirit_groddle
	"loneliness_x_offset"	: "55",	// defined by street_spirit_groddle
	"loneliness_y_offset"	: "85"	// defined by street_spirit_groddle
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.pace_distance = "0";	// defined by npc_walkable
	this.instanceProps.center_pos = "0";	// defined by npc_walkable
	this.instanceProps.use_center_pos = "0";	// defined by npc_walkable
	this.instanceProps.skull = "skull_L0dirt";	// defined by street_spirit
	this.instanceProps.eyes = "eyes_L0eyes1";	// defined by street_spirit
	this.instanceProps.top = "";	// defined by street_spirit
	this.instanceProps.bottom = "";	// defined by street_spirit
	this.instanceProps.base = "base_L0dirt";	// defined by street_spirit
	this.instanceProps.store_id = "0";	// defined by street_spirit
	this.instanceProps.y_offset = "150";	// defined by street_spirit
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	pace_distance : ["If pacing, how far shall we pace?"],
	center_pos : ["If the walk type supports it, upon which x value shall we center ourselves?"],
	use_center_pos : ["Should we use the center_pos value? 0 for no, 1 for yes"],
	skull : [""],
	eyes : [""],
	top : [""],
	bottom : [""],
	base : [""],
	store_id : ["Id of the base store this spirit offers"],
	y_offset : ["How far above the platline in pixxxels"],
};

var instancePropsChoices = {
	ai_debug : [""],
	pace_distance : [""],
	center_pos : [""],
	use_center_pos : [""],
	skull : ["skull_L0dirt","skull_L1dirt","skull_L1wood"],
	eyes : ["eyes_L0Eyes4","eyes_L0Eyes5","eyes_L0eyes1","eyes_L0eyes2","eyes_L0eyes3","eyes_L1Eyes4","eyes_L1Eyes5","eyes_L1eyes1","eyes_L1eyes2","eyes_L1eyes3"],
	top : ["top_L1Feathers","top_L1FlowerTop","top_L1Grass","top_L1LeafSprout","top_L1LotusTop","top_L1dirtSeedling","top_L1dirtSpikey","top_L1woodLeafHat","top_L1woodSpikey","top_L1woodTwig"],
	bottom : ["bottom_L1Branches","bottom_L1FallLeaves","bottom_L1FlowerBush","bottom_L1LeafSkirt","bottom_L1LotusBottom","bottom_L1WoodAcornBranch","bottom_L1flower","bottom_L1grassSkirt","bottom_L1woodRoots"],
	base : ["base_L0dirt","base_L1dirt","base_L1wood"],
	store_id : ["0:none"," 3:Produce"," 4:Hardware"," 5:Sno Cone"," 6:Gardening Goods"," 7:Kitchen"," 8:Groceries"," 9:Alchemical"," 10:Animal"," 11:Tool"," 12:Gardening Tools"," 13:Uncle Friendly"," 14:Cooking"," 15:Helga"," 16: Meal"," 17:Bureacracy"," 18:Mining"," 19:Toy"," 20:Ticket Dispenser"," 21:Bags Only"," 22:Fox Ranger"," 23:Furniture","24:Bags Small & Large"," 25:Extremely Rare Items"],
	y_offset : [""],
};

var verbs = {};

verbs.debug = { // defined by npc
	"name"				: "debug",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 10,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.debugging === undefined || this.debugging == false) {
			return "ADMIN ONLY: Turn on debug displays for this NPC.";
		}
		else {
			return "ADMIN ONLY: Turn off debug displays for this NPC.";
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) { return {state:'enabled'} };

		// Do not show this for non-devs:
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		 
		if (this.debugging === undefined) {
			this.debugging = true;
		}
		else {
			this.debugging = !(this.debugging);
		}

		this.target_pc = pc;

		if (this.debugging) {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'are debugging', failed, self_msgs, self_effects, they_effects);	
		}
		else {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'stopped debugging', failed, self_msgs, self_effects, they_effects);	
		}

		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.give_cubimal = { // defined by npc
	"name"				: "Give a cubimal to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return 'Give '+this.label+' a cubimal likeness';
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var cubimal = this.hasCubimal();

		if (!cubimal) return {state: null};

		if (pc.getQuestStatus('mini_me_mini_you') != 'todo') return {state: null};

		if (pc.counters_get_label_count('npcs_given_cubimals', cubimal)) return {state:'disabled', reason: "You already gave away a "+this.label+" cubimal"}

		if (!pc.findFirst(cubimal)) return {state:'disabled', reason: "You don't have a cubimal of "+this.label};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var cubimal = this.hasCubimal();
		var stack = null;

		if (!cubimal){
			failed = 1;
		} else {
			stack = pc.findFirst(cubimal);
		}

		var responses = [
		'Pour moi? How kind of you! I feel all fluttery inside!',
		'Oh yes, this is very handsome. Thank you so much!',
		'A passable likeness. Always nice to know that someone is thinking of little old me!',
		'Well what have we here? It\'s a bit... square. But it captures the essence, doesn\'t it?',
		'Cubimals are my favorite! And this one is my favoritest favorite!',
		'I shall carry it with me always, and cherish the memory of your kindness'
		];


		if (stack){
			var item = pc.removeItemStack(stack.path);
			item.apiDelete();
			this.sendBubble(choose_one(responses), 10000, pc);
			pc.counters_increment('npcs_given_cubimals', cubimal);
			pc.quests_inc_counter('npcs_given_cubimals', 1);
		} else {
			failed = 1;
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'Give a cubimal to', 'Gave a cubimal to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.reminisce = { // defined by street_spirit
	"name"				: "reminisce",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "A remembering",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container && this.container.isInstance()) return {state:null};
		if (this.container && this.container.isRooked())  return {state: null};

		var quests = this.getAvailableQuests(pc);
		if (pc.getQuestStatus('blue_and_white_part1') == 'done'){
			if (quests.offered['blue_and_white_part2']) return {state:'enabled'};
		}

		if (pc.getQuestStatus('winter_walk') == 'done'){
			if (quests.offered['winter_walk_part2']) return {state:'enabled'};
		}

		if (quests.offered['an_autumn_day_part2']) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!msg.exclude_quests) {
			msg.exclude_quests = ['an_autumn_day', 'winter_walk'];
		}
		if (pc.getQuestStatus('le_miserable') != 'done') msg.exclude_quests.push('le_miserable');
		this.offerQuests(pc, msg);
		return true;
	}
};

verbs.buy_sell = { // defined by street_spirit
	"name"				: "buy\/sell",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Trade with $storename",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container && this.container.is_newxp && pc.isGreeter()) return {state:null};
		if (intval(this.getInstanceProp('store_id')) != 0) return {state:'enabled'};
		return {state:null};
	},
	"effects"			: function(pc){

		var store = get_store(intval(this.getInstanceProp('store_id')));

		return {
			'storename' : store.name,
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return pc.openStoreInterface(this,'buy_sell');
	}
};

verbs.talk_to = { // defined by street_spirit
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "See what's up with this spirit",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container && this.container.isInstance()) return {state:null};
		if (this.container && this.container.isRooked())  return {state:null};
		if (this.hasJobs(pc)) return {state:'enabled'};

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		if (convos.length) return {state:'enabled'};

		var quests = this.getAvailableQuests(pc);
		delete quests.offered['blue_and_white_part2'];
		if (pc.getQuestStatus('le_miserable') == 'done') delete quests.offered['le_miserable'];
		delete quests.offered['winter_walk_part2'];
		delete quests.offered['an_autumn_day_part2'];
		if (num_keys(quests.offered) || num_keys(quests.completed)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.hasJobs(pc)){
			this.onInteractionStarting(pc);
			this.apiSetTimer('onWaiting', 5000);
			this.setAndBroadcastState(this.talk_state);
			this.onTalking();
			this.offerJobs(pc, msg);
			return true;
		}
		else{
			var quests = this.getAvailableQuests(pc);
			if (!msg.exclude_quests) msg.exclude_quests = [];
			delete quests.offered['blue_and_white_part2'];
			msg.exclude_quests.push('blue_and_white_part2');
			if (pc.getQuestStatus('le_miserable') == 'done'){
				msg.exclude_quests.push('le_miserable');
				delete quests.offered['le_miserable'];
			}

			delete quests.offered['winter_walk_part2'];
			msg.exclude_quests.push('winter_walk_part2');

			delete quests.offered['an_autumn_day_part2'];
			msg.exclude_quests.push('an_autumn_day_part2');

			if (num_keys(quests.offered) || num_keys(quests.completed)){
				this.offerQuests(pc, msg);
				return true;
			}
			else{
				var failed = 1;
				var orig_count = this.count;
				var self_msgs = [];
				var self_effects = [];
				var they_effects = [];

				var convos = pc.conversations_offered_for_class(this.class_tsid);
				for (var i=0; i<convos.length; i++){
					var conversation_runner = "conversation_run_"+convos[i];
					if (this[conversation_runner]){
						failed = 0;
						this[conversation_runner](pc, msg);
						break;
					}
				}

				var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
				if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

				return failed ? false : true;
			}
		}
	}
};

function onConversationEnding(pc){ // defined by street_spirit_groddle
	this.setAndBroadcastState('idle_hold');
}

function onCreate(){ // defined by street_spirit_groddle
	this.initInstanceProps();
	if (this.parent_onCreate) this.parent_onCreate();

	this.apiSetPlayersCollisions(false);
	this.apiSetHitBox(400, 400);
	this.apiSetPlayersCollisions(true);
}

function onLoad(){ // defined by street_spirit_groddle
	this.parent_onLoad();

	if (this.container && this.container.class_tsid == 'gentle_island'){
		this.apiSetHitBox(160, 400);
	}
	else{
		this.apiSetHitBox(400, 400);
	}
}

function singTo(pc){ // defined by street_spirit_groddle
	if (!this.song_lines) return;
	if (!this.song_index) this.song_index = 0;

	var line = this.song_lines[this.song_index];
	if (line) this.sendBubble(line, 3000, pc, null, false, true);

	this.song_index++;
	if (this.song_index >= this.song_lines.length) this.song_index = 0;

	this.apiSetTimerX('singTo', 3750, pc);
}

function declareLoneliness(){ // defined by street_spirit
	if (this.isWaiting) {
		this.apiSetTimer('declareLoneliness', randInt(5000, 10000));
	} else {
		this.fullStop();
		this.setAndBroadcastState('idle_cry');
		this.sendBubble(this.lonelinessGetChatter());
		this.apiSetTimer('stopCrying', 8000);
		this.loneliness.is_crying = true;
	}
}

function getSubClass(){ // defined by street_spirit
	var stores_map = {
		9  : 'alchemical_goods',
		10 : 'animal_goods',
		6  : 'gardening_goods',
		8  : 'groceries',
		4  : 'hardware',
		7  : 'kitchen_tools',
		3  : 'produce',
		19 : 'toys',
		18 : 'mining',
	};

	var sid = intval(this.getInstanceProp('store_id'));
	var sk = stores_map[sid] ? stores_map[sid] : 'unknown_'+sid;
	return 'npc_streetspirit_'+sk;
}

function getSubClasses(){ // defined by street_spirit
	return {
		'npc_streetspirit_alchemical_goods'	: { 'name' : 'Street Spirit - Alchemical Goods' },
		'npc_streetspirit_animal_goods'		: { 'name' : 'Street Spirit - Animal Goods' },
		'npc_streetspirit_gardening_goods'	: { 'name' : 'Street Spirit - Gardening Goods' },
		'npc_streetspirit_groceries'		: { 'name' : 'Street Spirit - Groceries' },
		'npc_streetspirit_hardware'		: { 'name' : 'Street Spirit - Hardware' },
		'npc_streetspirit_kitchen_tools'	: { 'name' : 'Street Spirit - Kitchen Tools' },
		'npc_streetspirit_produce'		: { 'name' : 'Street Spirit - Produce' },
		'npc_streetspirit_toys'			: { 'name' : 'Street Spirit - Toys' },
		'npc_streetspirit_mining'		: { 'name' : 'Street Spirit - Mining' },
	};
}

function onConversation(pc, msg){ // defined by street_spirit
	if (msg.choice == 'done-singing'){
		this.container.street_spirit_done_singing = true;
		return this.conversation_end(pc, msg);
	}

	var conversation_runner = "conversation_run_"+msg.choice.split('-')[0];
	if (this[conversation_runner]) return this[conversation_runner](pc, msg);

	if (this.getAvailableQuests) {
		// do quests
		return this.questConversation(pc, msg);
	}
		
	if (this.loneliness && msg.choice.substr(0, 11) == 'loneliness-') {
		return this.lonelinessOnConversation(pc, msg);
	}

	return this.conversation_reply(pc, msg, "Sorry, what?");
}

function onLonelinessEnd(){ // defined by street_spirit
	log.info(this+" loneliness end.");
	this.apiCancelTimer('declareLoneliness');
	this.apiCancelTimer('stopCrying');
	if (this.loneliness.is_crying) {
		delete this.loneliness.is_crying;
	}
	this.startMoving();
}

function onLonelinessStart(){ // defined by street_spirit
	log.info(this+" loneliness start.");
	this.fullStop();
	this.setAndBroadcastState('idle_cry');
	this.idle_state = 'idle_cry';
}

function onLonelinessVisit(){ // defined by street_spirit
	log.info(this+" loneliness visit.");
	if (num_keys(this.loneliness.visitors) == 1) {
		this.idle_state = 'idle';
		this.setAndBroadcastState(this.idle_state);
		this.loneliness_visited = true;

		if (this.loneliness.is_running) {
			this.apiSetTimer('declareLoneliness', randInt(3000, 5000));
		}
	}
}

function onPlayerCollision(pc){ // defined by street_spirit
	if (this.container && this.container.instance_id == 'NB_Street3' && !this.container.street_spirit_done_singing){
		// lock the player
		pc.apiSendAnnouncement({
			uid: 'player_lock',
			type: "vp_overlay",
			duration: 2000,
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

		this.apiCancelTimer('singTo');

		var choices = [{txt:'OK', value:'done-singing'}];
		this.apiSetTimerX('conversation_start', 2000, pc, "<font size=\"30\"><b>Oh!</b></font><split butt_txt=\"Oh?\">This is embarrassing! I thought I was alone!<split butt_txt=\"It’s OK\">Well, anyway, "+pc.getLabel()+", if you are looking for bags on the cheap, I am your girl. Come BUY from me if you need bags!", choices);
		return;
	}

	// No instances fire beyond here!!!
	if (this.container && this.container.isInstance()) return;

	if (this.loneliness) {
		if(this.lonelinessVisit(pc)) {
			return;
		}
	}

	if (this.hasJobs(pc)) return;

	if (pc.getQuestStatus('get_first_tool') == 'todo') {
		var q = pc.getQuestInstance('get_first_tool');
		var location = this.container.tsid;
		if(config.map_stores[location] && config.map_stores[location] == q.vendor_name) {
			return this.sendBubble("Hello, "+pc.getLabel()+". Are you here to shop for tools?", 5000, pc);
		}
	}

	if (this.conversations){
		for (var i=0; i<this.conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}

	if (pc.getQuestStatus('blue_and_white_part1') != 'done'){
		var quests = this.getAvailableQuests(pc);
		if (num_keys(quests.offered) || num_keys(quests.given) || num_keys(quests.incomplete) || num_keys(quests.completed)){
			if (!pc.last_blue_and_white_offer){
				return this.sendBubble("Hark there, "+pc.getLabel()+". I have something which I think you should contemplate. Come talk to me …", 5000, pc);
			}
			else{
				return this.sendBubble("Well then "+pc.getLabel()+", I don’t mean to bother you, but I think this experience will be worth your time. Come talk to me …", 5000, pc);
			}
		}
	}
}

function onPlayerEnter(pc){ // defined by street_spirit
	var jobs = this.getAvailableJobs(pc);
		
	for (var i in jobs.given){
		var qi = jobs.given[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.open){
		var qi = jobs.open[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.delayed){
		var qi = jobs.delayed[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	if (this.onLonelinessPlayerEnter(pc)) {
		return;
	}

	if (pc.getQuestStatus('get_first_tool') == 'todo' && Math.abs(this.x - pc.x) < 200 ) {
		var q = pc.getQuestInstance('get_first_tool');
		var location = this.container.tsid;
		if(config.map_stores[location] && config.map_stores[location] == q.vendor_name) {
			return this.sendBubble("Hello, "+pc.label+". Are you here to shop for tools?", 5000, pc);
		}
	}

	var distance = this.distanceFromPlayer(pc);
	if (distance <= 400){
		var quests = this.getAvailableQuests(pc);
		if (num_keys(quests.completed)){
			return this.offerQuests(pc);
		}
	}
}

function onPlayerExit(pc){ // defined by street_spirit
	this.onLonelinessPlayerExit(pc);
}

function onPrototypeChanged(){ // defined by street_spirit
	this.onLoad();
}

function onTalking(){ // defined by street_spirit
	return;
}

function onWaiting(){ // defined by street_spirit
	this.setAndBroadcastState(this.idle_state);
}

function stopCrying(){ // defined by street_spirit
	if (!this.isWaiting) {
		this.startMoving();
	}
	this.apiSetTimer('declareLoneliness', randInt(5000, 10000));
	if (this.loneliness.is_crying) {
		delete this.loneliness.is_crying;
	}
}

function turnAround(){ // defined by street_spirit
	this.setAndBroadcastState('turn');
	if (this.parent_turnAround) this.parent_turnAround();
	if (this.npc_walkable_turnAround) this.npc_walkable_turnAround();
}

// global block from street_spirit
var is_streetspirit = true;

var song_lines = [
	"♫ … my milkshake brings all the boys to the yard … ♫",
	"♫ … and they’re like •  it’s better than yours … ♫",
	"♫ … damn right •  it’s better than yours … ♫",
	"♫ … I could teach you, but I’d have to charge … ♫"
];

function npc_walkable_onCreate(){ // defined by npc_walkable
	this.npc_can_walk = true;
	this.npc_can_climb = true;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = this.npc_climb_speed = randInt(50,55);
	this.npc_jump_height = 0;

	this.go_dir = 'left';
	this.startMoving();
}

function onPathing(args){ // defined by npc_walkable
	//log.info('pathing callback: '+args.status);
	if (args.status == 3 || args.status == 4){
		if (this.classProps.walk_type == 'roam' || this.classProps.walk_type == 'pace'){
			this.stopMoving();
			this.turnAround();
			this.apiSetTimer('startMoving', 10000);
		}
		else{
			//log.info('reached destination!');
			//log.info('turning around...');
			this.turnAround();
			if (this.container.getNumActivePlayers()){
				this.startMoving();
			}
			else{
				this.pathfinding_paused = true;
				this.apiSetTimer('startMoving', 20*1000);
			}
		}

		if (this.onDonePathing) { 
			this.onDonePathing();
		}
	}
	if (args.status == 1){

		var walk_left_state = 'walk';
		if (this.walk_left_state) walk_left_state = this.walk_left_state;
		var walk_right_state = 'walk';
		if (this.walk_right_state) walk_right_state = this.walk_right_state;

		if (args.dir == 'left'){
			this.state = walk_left_state;
			this.dir = 'left';
		}
		if (args.dir == 'right'){
			this.state = walk_right_state;
			this.dir = 'right';
		}
		if (args.dir == 'climb'){
			this.state = 'climb';
		}

		this.broadcastState();
	}
}

function onStuck(){ // defined by npc_walkable
	//log.info('STUCK! '+this);
	this.turnAround();
	this.apiSetTimer('startMoving', 1000);
}

function onWaitEnd(){ // defined by npc_walkable
	this.apiSetTimer('startMoving', 1500);
}

function onWaitStart(pc){ // defined by npc_walkable
	this.stopMoving();
}

function startMoving(){ // defined by npc_walkable
	if (this.isRookable() && this.isRooked()) return;
	if (this.isSad && this.isSad()) return;
	if (this.isWaiting) {
		return;
	}
	if (!this.container){
		this.apiSetTimer('startMoving', 1000);
		return;
	}

	if (this.pathfinding_paused) delete this.pathfinding_paused;

	if (!this.classProps || !this.classProps.walk_type || this.classProps.walk_type == 'edge_to_edge'){
		if (this.go_dir == 'left' && this.container.geo.l+100 != this.x){
			if (!this.apiFindPath(this.container.geo.l+100, this.y, 0, 'onPathing')){
				this.onStuck();
			}
		}else if (this.container.geo.r-100 != this.x){
			if (!this.apiFindPath(this.container.geo.r-100, this.y, 0, 'onPathing')){
				this.onStuck();
			}
		}
		else{
			this.onStuck();
		}
	}
	else if (this.classProps.walk_type == 'roam'){
		if (this.go_dir == 'left'){
			var distance = choose_one([-400, -250]);
		}
		else{
			var distance = choose_one([250, 400]);
		}
		//log.info(this+' ------------- startMoving distance: '+distance);

		if (intval(this.getInstanceProp('use_center_pos')) != 0){
			var center = intval(this.getInstanceProp('center_pos'));
			distance = distance / 2;
		}
		else{
			var center = this.x;
		}

		if (distance < 0 && center+distance < this.container.geo.l+100){
			distance = this.container.geo.l-center+100;
		}
		else if (distance > 0 && center+distance > this.container.geo.r-100){
			distance = this.container.geo.r-center-100;
		}

		if (distance == 0 || !this.apiFindPath(center+distance, this.y, 0, 'onPathing')){
			this.onStuck();
		}
	}
	else if (this.classProps.walk_type == 'pace'){
		var distance = intval(this.getInstanceProp('pace_distance'));
		if (this.go_dir == 'left'){
			if (distance){ distance = distance * -1; }
			else{ distance = -200; }
		}
		else{
			if (!distance) distance = 200;
		}
		//log.info(this+' ------------- startMoving distance: '+distance);

		if (intval(this.getInstanceProp('use_center_pos')) != 0){
			var center = intval(this.getInstanceProp('center_pos'));
			distance = distance / 2;
		}
		else{
			var center = this.x;
		}

		if (distance < 0 && center+distance < this.container.geo.l+100){
			distance = this.container.geo.l-center+100;
		}
		else if (distance > 0 && center+distance > this.container.geo.r-100){
			distance = this.container.geo.r-center-100;
		}

		if (distance == 0 || !this.apiFindPath(center+distance, this.y, 0, 'onPathing')){
			this.onStuck();
		}
	}
	else{
		log.error('Unknown walk type: '+this.classProps.walk_type);
	}
}

function stopMoving(){ // defined by npc_walkable
	this.apiStopMoving();
	var idle_state = 'idle_stand';
	if (this.idle_state) idle_state = this.idle_state;
	this.setAndBroadcastState(idle_state);
}

function npc_walkable_turnAround(){ // defined by npc_walkable
	this.go_dir = (this.go_dir == 'left') ? 'right' : 'left';
}

function checkWaiting(){ // defined by npc
	if (!this.isWaiting) return;
	if (!this.container) this.apiSetTimer('checkWaiting', 1000);

	//
	// remove any keys we can, because user has logged off, or is far away
	//

	if (this.waitingFor.__iterator__ == null) delete this.waitingFor.__iterator__;
	for (var i in this.waitingFor){
		if (!this.container.activePlayers) continue;

		var pc = this.container.activePlayers[i];
		if (pc){
			if (this.distanceFromPlayer(pc) > config.verb_radius){
				delete this.waitingFor[i];
			}
		}else{
			delete this.waitingFor[i];
		}
	}


	//
	// done waiting?
	//

	if (!num_keys(this.waitingFor)){
		this.isWaiting = 0;
		if (this.onWaitEnd) this.onWaitEnd();
	}else{
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function clearMovementLimits(){ // defined by npc
	delete this.move_limits;
}

function fullStop(){ // defined by npc
	this.apiStopMoving();
	this.apiCancelTimer('startMoving');
}

function hasCubimal(){ // defined by npc
	var cubimal_map = {
		hell_bartender:					'npc_cubimal_hellbartender',
		npc_batterfly:					'npc_cubimal_batterfly',
		npc_bureaucrat:				'npc_cubimal_bureaucrat',
		npc_butterfly:					'npc_cubimal_butterfly',
		npc_cactus:					'npc_cubimal_cactus',
		npc_cooking_vendor:			'npc_cubimal_mealvendor',
		npc_crab:						'npc_cubimal_crab',
		npc_crafty_bot:					'npc_cubimal_craftybot',
		npc_deimaginator:				'npc_cubimal_deimaginator',
		npc_firefly:					'npc_cubimal_firefly',
		npc_fox:						'npc_cubimal_fox',
		npc_fox_ranger:				'npc_cubimal_foxranger',
		npc_garden_gnome:				'npc_cubimal_gnome',
		npc_gardening_vendor:			'npc_cubimal_gardeningtoolsvendor',
		npc_gwendolyn:				'npc_cubimal_gwendolyn',
		npc_jabba2:					'npc_cubimal_helga',
		npc_jabba1:					'npc_cubimal_unclefriendly',
		npc_juju_black:					'npc_cubimal_juju',
		npc_juju_green:				'npc_cubimal_juju',
		npc_juju_red:					'npc_cubimal_juju',
		npc_juju_yellow:				'npc_cubimal_juju',
		npc_maintenance_bot:			'npc_cubimal_maintenancebot',
		npc_newxp_dustbunny:			'npc_cubimal_dustbunny',
		npc_piggy:					'npc_cubimal_piggy',
		npc_piggy_explorer:				'npc_cubimal_ilmenskiejones',
		npc_quest_giver_widget: 			'npc_cubimal_greeterbot',
		npc_rube:						'npc_cubimal_rube',
		npc_sloth:						'npc_cubimal_sloth',
		npc_smuggler:					'npc_cubimal_smuggler',
		npc_sno_cone_vending_machine:	'npc_cubimal_snoconevendor',
		npc_squid:					'npc_cubimal_squid',
		npc_tool_vendor:				'npc_cubimal_toolvendor',
		npc_yoga_frog:					'npc_cubimal_frog',
		phantom_glitch:				'npc_cubimal_phantom',
		street_spirit_firebog:				'npc_cubimal_firebogstreetspirit',
		street_spirit_groddle:			'npc_cubimal_groddlestreetspirit',
		street_spirit_zutto:				'npc_cubimal_uraliastreetspirit'
	};

	return cubimal_map[this.class_id];
}

function onInteractionEnding(pc){ // defined by npc
	this.fsm_event_notify('interaction_ending', pc);
	if (this.waitingFor){
		delete this.waitingFor[pc.tsid];
	}
	this.checkWaiting();
}

function onInteractionInterval(pc, interval){ // defined by npc
	this.onInteractionStarting(pc);
	this.events_add({callback: 'onInteractionIntervalEnd', pc: pc}, interval);
}

function onInteractionIntervalEnd(details){ // defined by npc
	if (details.pc) {
		this.onInteractionEnding(details.pc);
	}
}

function onInteractionStarting(pc, mouseInteraction){ // defined by npc
	this.fsm_event_notify('interaction_starting', pc);
	if (!this.waitingFor) this.waitingFor = {};
	this.waitingFor[pc.tsid] = 1;
	if (!this.isWaiting){
		this.isWaiting = 1;
		if (this.onWaitStart) this.onWaitStart(pc, mouseInteraction);
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function npc_onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

function npc_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function npc_onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function npc_onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function npc_onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function npc_onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function conversation_canoffer_street_spirit_stories_1(pc){ // defined by conversation auto-builder for "street_spirit_stories_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "facts_of_the_giants_4")){
			return true;
	}
	return false;
}

function conversation_run_street_spirit_stories_1(pc, msg, replay){ // defined by conversation auto-builder for "street_spirit_stories_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "street_spirit_stories_1";
	var conversation_title = "Street Spirit Stories";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	choices['8'] = {};
	if (!msg.choice){
		choices['0']['street_spirit_stories_1-0-2'] = {txt: "How-do.", value: 'street_spirit_stories_1-0-2'};
		this.conversation_start(pc, "How-do there, Little?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_1', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_1-0-2"){
		choices['1']['street_spirit_stories_1-1-2'] = {txt: "Lush?", value: 'street_spirit_stories_1-1-2'};
		this.conversation_reply(pc, msg, "Lush, ain’t it?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_1', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_1-1-2"){
		choices['2']['street_spirit_stories_1-2-2'] = {txt: "Ah. Yes. Very lush.", value: 'street_spirit_stories_1-2-2'};
		this.conversation_reply(pc, msg, "Lush. Not like “Y’all see him o’er ? He’s a Friend of Friendly and no mistake” lush. Like “My, ain’t we looking Purdy an’ Green an’ Fertile terday?” lush. ", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_1', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_1-2-2"){
		choices['3']['street_spirit_stories_1-3-2'] = {txt: "Oh.", value: 'street_spirit_stories_1-3-2'};
		this.conversation_reply(pc, msg, "See, in the lives the Giants had before, there weren’t no such thing as lush. Sure been such things as ‘bleak’, and ‘barren’, and a whole heap of ‘goshforsaken’, but lushness? No sir there weren’t a dribblin’ of lush.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_1', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_1-3-2"){
		choices['4']['street_spirit_stories_1-4-2'] = {txt: "No?", value: 'street_spirit_stories_1-4-2'};
		this.conversation_reply(pc, msg, "So when the world came springin’ all to be, lushness was the first thing there was. Green, fertile, flower-filled sunshine-bathed lushness everywhere. Course, some of them giants didn’t like it.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_1', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_1-4-2"){
		choices['5']['street_spirit_stories_1-5-2'] = {txt: "So what happened?", value: 'street_spirit_stories_1-5-2'};
		this.conversation_reply(pc, msg, "No, L’il Honeybadger, no. Not one tiny bitty.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_1', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_1-5-2"){
		choices['6']['street_spirit_stories_1-6-2'] = {txt: "So there’s forest UNDER the caverns? ", value: 'street_spirit_stories_1-6-2'};
		this.conversation_reply(pc, msg, "No one knows for sure. All we knewed was that one day there was some mighty wind, and you could hear the giants roarin’, and the ground all fell to shakin’, and then, the half the dern forest fell cattywampus into itself, and rocks came tumblin’ on top of it and buried it all in caverns and caves an’ all.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_1', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_1-6-2"){
		choices['7']['street_spirit_stories_1-7-2'] = {txt: "I see.", value: 'street_spirit_stories_1-7-2'};
		this.conversation_reply(pc, msg, "Who can say? P’raps there is, praps there ain’t But sometimes, I swear I can hear it growin’ down there.", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_1', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_1-7-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_street_spirit_stories_2(pc){ // defined by conversation auto-builder for "street_spirit_stories_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "street_spirit_stories_1")){
			return true;
	}
	return false;
}

function conversation_run_street_spirit_stories_2(pc, msg, replay){ // defined by conversation auto-builder for "street_spirit_stories_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "street_spirit_stories_2";
	var conversation_title = "Street Spirit Stories";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	choices['8'] = {};
	if (!msg.choice){
		choices['0']['street_spirit_stories_2-0-2'] = {txt: "Huh?", value: 'street_spirit_stories_2-0-2'};
		this.conversation_start(pc, "Gosh DARN It!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_2', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_2-0-2"){
		choices['1']['street_spirit_stories_2-1-2'] = {txt: "New-ish?", value: 'street_spirit_stories_2-1-2'};
		this.conversation_reply(pc, msg, "Darn it, I said. I was nappin’. Y’all new round these parts? ", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_2', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_2-1-2"){
		choices['2']['street_spirit_stories_2-2-2'] = {txt: "So I hear.", value: 'street_spirit_stories_2-2-2'};
		this.conversation_reply(pc, msg, "Dang, Small, all a y’all are new compared to us.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_2', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_2-2-2"){
		choices['3']['street_spirit_stories_2-3-2'] = {txt: "Like Groddle Forest, you mean?", value: 'street_spirit_stories_2-3-2'};
		this.conversation_reply(pc, msg, "Jis’ woked up from a nap, and clean forgot where I was for a tick. Thought it was way back when. You know, back then, alla this were forest.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_2', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_2-3-2"){
		choices['4']['street_spirit_stories_2-4-2'] = {txt: "All of it?", value: 'street_spirit_stories_2-4-2'};
		this.conversation_reply(pc, msg, "Well, I know. Technically, quite a lot of this ‘ere still IS forest. But I’m sayin’, all was forest, once. But only because forest was all there was. There wasn’t anything else. The whole world was forest.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_2', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_2-4-2"){
		choices['5']['street_spirit_stories_2-5-2'] = {txt: "So what happened to it?", value: 'street_spirit_stories_2-5-2'};
		this.conversation_reply(pc, msg, "All of it. There was nothing but forest in the beginning.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_2', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_2-5-2"){
		choices['6']['street_spirit_stories_2-6-2'] = {txt: "Welllll…", value: 'street_spirit_stories_2-6-2'};
		this.conversation_reply(pc, msg, "Happened? Nothing, little mucker. Mosta the forest there WAS still IS. But all the other world grew up around it. As the giants’ imagination expanded, the world took off in all manner of bizarre directions. I heard talk of deserts and firebogs, though I never believed them to be true.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_2', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_2-6-2"){
		choices['7']['street_spirit_stories_2-7-2'] = {txt: "I see.", value: 'street_spirit_stories_2-7-2'};
		this.conversation_reply(pc, msg, "And won’t hear any different. Far as I’m concerned, forest is all there be. I know what I know: the forest was the first land that ever was. I know, for I was there in it when it came into being.", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'street_spirit_stories_2', msg.choice);
	}

	if (msg.choice == "street_spirit_stories_2-7-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_sonnets_of_the_street_spirit_1(pc){ // defined by conversation auto-builder for "sonnets_of_the_street_spirit_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "from_the_books_of_the_giants_3")){
			return true;
	}
	return false;
}

function conversation_run_sonnets_of_the_street_spirit_1(pc, msg, replay){ // defined by conversation auto-builder for "sonnets_of_the_street_spirit_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "sonnets_of_the_street_spirit_1";
	var conversation_title = "Sonnets of the Street Spirit";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['sonnets_of_the_street_spirit_1-0-2'] = {txt: "Um…", value: 'sonnets_of_the_street_spirit_1-0-2'};
		this.conversation_start(pc, "When came the Glitch to walk upon this land?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'sonnets_of_the_street_spirit_1', msg.choice);
	}

	if (msg.choice == "sonnets_of_the_street_spirit_1-0-2"){
		choices['1']['sonnets_of_the_street_spirit_1-1-2'] = {txt: "Oh, well, I think it was…", value: 'sonnets_of_the_street_spirit_1-1-2'};
		this.conversation_start(pc, "What Lemmish map did lead them to this place?\nThis ground was shaped by naught but Giant’s hand\nEach feature caused a smile upon Giants’ face.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'sonnets_of_the_street_spirit_1', msg.choice);
	}

	if (msg.choice == "sonnets_of_the_street_spirit_1-1-2"){
		choices['2']['sonnets_of_the_street_spirit_1-2-2'] = {txt: "Sounds nice?", value: 'sonnets_of_the_street_spirit_1-2-2'};
		this.conversation_reply(pc, msg, "Age upon age, this land stood, icy still\nThe only sound the flap of butt’ry wings", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'sonnets_of_the_street_spirit_1', msg.choice);
	}

	if (msg.choice == "sonnets_of_the_street_spirit_1-2-2"){
		choices['3']['sonnets_of_the_street_spirit_1-3-2'] = {txt: "Hmmm.", value: 'sonnets_of_the_street_spirit_1-3-2'};
		this.conversation_reply(pc, msg, "And yet, of late - an influx: sudden fill\nOf Glitchlife and the chaos that it brings.\nWho knows what tree they might plant somewhere next?\nWho knows how long that tree might get to live?\nOur firstly instinct was to get quite vexed.\nBut life with giants has taught us to forgive.\nWhichever way the Glitchy whims might bend\nThe world will find its balance in the end.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'sonnets_of_the_street_spirit_1', msg.choice);
	}

	if (msg.choice == "sonnets_of_the_street_spirit_1-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_sonnets_of_the_street_spirit_2(pc){ // defined by conversation auto-builder for "sonnets_of_the_street_spirit_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "sonnets_of_the_street_spirit_1")){
			return true;
	}
	return false;
}

function conversation_run_sonnets_of_the_street_spirit_2(pc, msg, replay){ // defined by conversation auto-builder for "sonnets_of_the_street_spirit_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "sonnets_of_the_street_spirit_2";
	var conversation_title = "Sonnets of the Street Spirit";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['sonnets_of_the_street_spirit_2-0-2'] = {txt: "Oh?", value: 'sonnets_of_the_street_spirit_2-0-2'};
		this.conversation_start(pc, "There was a time, before you Glitches came\nWhen through these lands some other feet did tread\nI knew them by the noise before the name", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'sonnets_of_the_street_spirit_2', msg.choice);
	}

	if (msg.choice == "sonnets_of_the_street_spirit_2-0-2"){
		choices['1']['sonnets_of_the_street_spirit_2-1-2'] = {txt: "Woah.", value: 'sonnets_of_the_street_spirit_2-1-2'};
		this.conversation_reply(pc, msg, "Their voices cut all earholes into shreds.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'sonnets_of_the_street_spirit_2', msg.choice);
	}

	if (msg.choice == "sonnets_of_the_street_spirit_2-1-2"){
		choices['2']['sonnets_of_the_street_spirit_2-2-2'] = {txt: "You don’t have to tell me twice", value: 'sonnets_of_the_street_spirit_2-2-2'};
		this.conversation_reply(pc, msg, "Those were, I think, the supplicants of Pot\nWhose bawdy songs in keys too high to hear\nWould cause the rocks themselves to blush a lot.\n(Though rocks themselves say things that shame your ears).", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'sonnets_of_the_street_spirit_2', msg.choice);
	}

	if (msg.choice == "sonnets_of_the_street_spirit_2-2-2"){
		choices['3']['sonnets_of_the_street_spirit_2-3-2'] = {txt: "What’s a weg?", value: 'sonnets_of_the_street_spirit_2-3-2'};
		this.conversation_reply(pc, msg, "Some swore eternal loyalty to Lem\nAnd wore the Lemmish stripes upon their leg.\nThey boasted of the ground covered by them.\nHow far they’d hoofed o’er land and sea and weg.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'sonnets_of_the_street_spirit_2', msg.choice);
	}

	if (msg.choice == "sonnets_of_the_street_spirit_2-3-2"){
		choices['4']['sonnets_of_the_street_spirit_2-4-2'] = {txt: "Interesting.", value: 'sonnets_of_the_street_spirit_2-4-2'};
		this.conversation_reply(pc, msg, "That’s not the point. The fact is, before you\nWere here, lived lives, and left their own mark, too.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'sonnets_of_the_street_spirit_2', msg.choice);
	}

	if (msg.choice == "sonnets_of_the_street_spirit_2-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"street_spirit_stories_1",
	"street_spirit_stories_2",
	"sonnets_of_the_street_spirit_1",
	"sonnets_of_the_street_spirit_2",
];

function parent_onCreate(){ // defined by street_spirit
	this.apiSetHitBox(400, 400);
	this.apiSetPlayersCollisions(true);
	if (this.npc_walkable_onCreate){
		this.npc_walkable_onCreate();
	}
	else if (this.parent_onCreate){
		this.parent_onCreate();
	}
	this.walk_left_state = this.walk_right_state = 'idle_move';
	this.idle_state = 'idle_hold';
	this.talk_state = 'talk';

	this.npc_can_climb = 0;

	this.setAvailableQuests([
		'blue_and_white_part1',
		'blue_and_white_part2',
		'le_miserable',
		'winter_walk',
		'winter_walk_part2',
		'an_autumn_day',
		'an_autumn_day_part2'
	]);
}

function parent_onLoad(){ // defined by street_spirit
	if (this.class_tsid == 'street_spirit'){
		var item = apiNewItemStack('street_spirit_groddle', this.count);
		this.container.apiPutItemIntoPosition(item, this.x, this.y);

		if (this.hitBox) item.apiSetHitBox(this.hitBox.w, this.hitBox.h);
		if (this.instanceProps) item.setAllInstanceProps(this.instanceProps);

		this.apiDelete();
	}

	this.setAvailableQuests([
		'blue_and_white_part1',
		'blue_and_white_part2',
		'le_miserable',
		'winter_walk',
		'winter_walk_part2',
		'an_autumn_day',
		'an_autumn_day_part2'
	]);

	if (this.class_tsid == 'street_spirit_firebog'){
		this.idle_state = 'idle_move';
	}

	if (this.npc_can_climb) this.npc_can_climb = false;
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"streetspirit",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-84,"y":-176,"w":161,"h":201},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKJElEQVR42s2YeVCTdxrHu2131\/+4\nAgkkIQcBlCsJdzhykYMrCYEECEICCXJ5hEsFPF5paxFE4sGpVqyKCB54RbCsTUVrV2uLUwvT2XY2\n7ezubFUgWt12Z\/959v29Lh3X2Z1RsdR35pnnnffN+76ffJ\/r976vvfYLbFFRbLfXXqUtlh\/KnYdC\nPp4f4XylAOMjI7CEaO7kY7hwR2IMD9LESVatQsJ9ZRRMjo2EOF6EVRDNdUgEMZCTngKvDCChIi\/C\nhNSLiwy35aSlOLRyieiVCvNP0\/sZn9qbNSuNmYNzU93Jc9O9wgdTfXHw9e7f\/6pgj27vI9+f6il3\n3Wqvm72+0TL7cX3+7MfVutmrNbkz1xtNc5+9u+rh9N5fR02kzoPbvda5m29Xzly15ty5ZFbcGy8U\n3\/1DfvK9Dw2imQ9NKfcmKjJnPtlQMne7O2LRAX+Y6tXMfbZ15cxElQaB3RnTcr+\/qGLNXMqkzo1n\n+s9e0ITcHdcn3XVYUueubypY1HD\/8FV38Nztrg2zn9TmzVwqks6O5YTeG1P63jmTQp63u\/Z0CgJG\nkISSn7fIFg\/wyz4iv+5eLk+fGdPHIrjvayPj99d0cH78Jizh+4sKH2QIEsHPOIwylJOLBohXKDZ7\nfVMpyjsEgEBcwxLR1fJi+U9\/DTL9cF6UjACRknP2dAbKSaQ2qvZFA5w4alln0fFPzoxrlz24okx9\n9KWy1rVLoP3HJG\/lw4nY1YSCZ8Sc2QtptLuXCoRrSwXDc9OdiwN4\/8ve9fta5QcLshlwZzQn4uFY\nivXHr5Tb5nYLVv30N07zo4notu8GE9Vf7Y2JudYnXjo9rJVblvs9ct5ooywO4O3evKnxdZglf+kX\nqAgenpVsRYCuXQlbUhIivosMC4ZGY+Tlz3tjBSO7BCnt78Q1FORwvvnleh7A7z6ouSH6oPILkd3y\nMYNo0LiKKPFRHj60y3c9+kTe+tAufKdxTfif86Xcb7Fy\/uWiajrkllNBV+oHecX0C78I3LDhkOh0\nyVnnaNUE2Euvgb18As6a7SM3uw+YHkx2WO9dqzPct2u6jr8rvzA3Kuz851+CR3ZahZf\/fiKl89sT\n6SunzhTr\/\/RBg0LGcxdbFPT+lwr3vrbDdNz4PpwpG4GRorNw2jSK+3NwYY0dhvL74ZCxo6XMkPFZ\nW53qhkUnnV1TKJptrIr\/19oi0Z29G+RXjFrp12UG5br5+xWIKVijnvlyRt8x43bNkdwdMKDrglOl\nA3CqeAiOGwZh2DAAx3L7Ydi0H47kdUBL6qot2amJ\/eqUREiTJECqSAAZEgGoUgRnM0SJEnQvBLVG\nzcS0CWSnNYvl3Fq8zNGQy8bW6xew+u5V1DiPFrXBoew2OJrXCUf1PXBU1wsDOT1wOHs3DBbuhvcy\nMDigbXJta8oayRB6gVboZVJJSFezZd5gSCOJzAoqd0UazdGQFwBN+QGwwcCBRnx\/8\/IgaC4KhhZz\nqKspL2DkueEGzPVYV0oF9CnrYH\/6Rhg0tcNQ8U44qGkl\/NRFO9w6dxI+6n4P\/nj0EIye6IY8BetW\nYRrZKk\/06FFLSaCXebiZFbSRVWoG1OWwCDisMAg2FQTCW8alxD6yd0zLoDE34NmnTDs\/nTF97azL\n0dkJQ5Wb4frhw\/D1rTG4efk4DO3pgL6ObdDfswMO9rTDoZ7tcKSnDY7t2w71a9Quc4avTSMnDWYp\nvL\/Qa3EFlTQCbn0um1CtSuVPgNbrWD\/D2iq4sNHAeXYVb44NWKc\/PQ\/H+nZArbkMCrUGWBYcDUxm\nGPj6BYAfbsGBfBBFy0EZI4OsuBR4t7bUlSqinsmV+WCZEi9nlpzkKlbSrJZUGg7DJiARTHkGHVZr\nGMQ+nocEdFtpGAJ0PTPg51dOcttrV7ty46Wgxh+OIEJ4ycBLlgOZyoYdp8aASg0Ac3Y+rDWbJ9ub\naqxVlmVWRbLHbj2edzqFD5aVSnIYFRQTUrA0jQYIFFmVigE12UzCUA4iQGRI0ecumO63G004JJYV\nK8VCeUmTqfkm8PbD1di+G3yoHCg1F2LzvzXk+GSlJnl+l6ciazRKUnOmjHTfIvVlVGb6E6ohv07P\nJgwVCVIVeWQFYj8Qh7jBgtoPmb7UQfEPAQojFDc81MxwZD\/nzYoiikgtIt0vMVBEKqlXv07pPSHm\nubsj9dZkMaEsnQ46ERvEoe4EJFJtvlis+PnVeCEtCJDKiQZacDxQOTFADYwB+tJEYIRJYP68scBP\nI0\/yuKJSeFbrlT4j2Qpv4hyqYqQeKo7KTDy8WhYOzIBqLZPIS6Qknn+TqIoX1BMZoWInm58GgfFa\n8A8RQqhQB6zIVGCFPn73LdNRbeIEj3N5OrImW+qjXa4iO+avLU+na3BQrDqLiaHmXJv92K\/PY2oW\nBDW\/ubv7MnxZXGBGyCBaXQEsrgIobB4ECzTA5iudHuwot2K9r1Ut9Nqz4j8hNmRRDqJr7Z3pjNF9\nauyETeY4sVPpGGiVYidtqdiNUytEN4fLXs43HG8y00oNigMWXwn0kOT+oFgZRqYHgzc1qP9x2KNd\n8iQyXsVeH4nF7u6qFK9+PMT9ZXij7qiJg+F2EezdFAU9TTzYsy4CtleHgK02BDqbYuB0l9p5\/WT5\nwr5A+NCWYijvmBFSoAbFmwT6ShE1MBpINI7IPzzZRuVEAYUZahInuGMlKrxYlF47cVBmiZwmQhXc\nXsWDw81iOG1TwnGbAvY3C6BnYxz0bY6DLhzy8kCRa2hz\/Iu\/r1CYEf1srhiY4clA4fBFKKTMcBEe\natmkhzfVSQ\/kgY8fB5PHedqMWrIGbzU2Pn8JI1dIweYbNJokyLdaQuDQZjEcwSQwsEUCBzYIoa8u\nFq9gtu2FAWmcGIcvm+\/0ZUUAJ1JM9D5GmHDShxYIXhQmkCgM8PL2Nwm4biOozcgTPHceLm3F1mfk\nOBAgasqblwf\/vEiYn8nbzKGERxNlQS2GvixphBOTYcN7odMvgEcsOEOSsjCSL9PmSaKAh6ePy8PD\ng0j4vHSyxlgeaN24PsNZnZEDePXCWn0A0fseKxlA+HlQtFBAE2VBOcgMl4vwnjfp5cfUkPxYxMxk\ns2Vu6PjTv0VLLOT3FNc7xur3QaM6B+bnMTIEtMHweA4jMKTgWwUKaF1tti0IkoWvcNhRMjcvb3q\/\nO4n2f8OBZvHbuUbTUFk7jNbthSNlLa4dhnKwqrjEuEMKNuShEAcTeVmniYLjFTY4Ud\/qGC\/re6G2\n85snzd2dhP6p29PHn7SLjQdMY+v2j+AG4w39MGjdhq9YKp27DFbYY6oETK+AxuwEaF2ugxad1WWv\n7oWPmg7DhZq+Z\/50\/PpT9sa8LVmyhIX7N5\/HDBXB0tK6MNdbJSXNZ1Z1Os\/X9MLp1Z3QUV4JtQ1C\naFuxorinEBN3FTTxFgz4xIN\/+wL2Zo3S4nmwZGsNHtYtLcYKvtrIkKjzGfwn7v9CgK\/\/D8DnhXzy\nujeesief81\/bvwF9yxJS6nNJnwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/street_spirit_groddle-1342650243.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: true,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"streetspirit",
	"no_trade"
];
itemDef.keys_in_location = {
	"u"	: "buy_sell",
	"e"	: "debug",
	"g"	: "give_cubimal",
	"n"	: "reminisce",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("street_spirit_groddle.js LOADED");

// generated ok 2012-11-01 17:29:18 by lizg
