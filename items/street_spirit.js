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
var parent_classes = ["street_spirit", "npc_walkable", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"walk_type"	: "pace",	// defined by npc_walkable (overridden by street_spirit)
	"loneliness_state"	: "idle_cry",	// defined by street_spirit
	"conversation_offset_x"	: "0",	// defined by street_spirit
	"conversation_offset_y"	: "60"	// defined by street_spirit
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.pace_distance = "0";	// defined by npc_walkable (overridden by street_spirit)
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

function onCreate(){ // defined by street_spirit
	this.initInstanceProps();
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

function onLoad(){ // defined by street_spirit
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

function parent_onCreate(){ // defined by npc_walkable
	this.npc_can_walk = true;
	this.npc_can_climb = true;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	this.npc_walk_speed = this.npc_climb_speed = randInt(50,55);
	this.npc_jump_height = 0;

	this.go_dir = 'left';
	this.startMoving();
}

function parent_turnAround(){ // defined by npc_walkable
	this.go_dir = (this.go_dir == 'left') ? 'right' : 'left';
}

function parent_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function parent_onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function parent_onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
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
		'position': {"x":-30,"y":-122,"w":72,"h":74},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI6ElEQVR42s2Z6VJbyRXH\/cXjmTgJ\n48RsltB2hcSilU1I7EZCrFrBQkKA2GOcCa6JY2ecypBKvqbKj8Aj+BF4hHkEHoFHONP\/c+8RLVnG\nQ+ykQtUp6V71vf3rs3dz795n\/G0Me9q2R70zlZiRLUQc55mA\/SzlfTxz7\/\/hrzrmPa\/GvPRsyEX5\nsINWB220FrBRZdSg8oiHNkfcl2sB+2Wyt\/1d0ujMzvk6wv8TMGhN4ErDbgaEFCNOygbtDApI\/A7J\nh3so3ddFC\/5OSvV2\/DTva99Neh61fXGwrTFjdytmXGHyXKiHoQTiU\/Js2EW5SA+tBJ7Q8qCSge4r\n1uyXAq2OucO\/FKaVlEc9pBbIUog6GHYtaKOUr+MaGn3q\/tb5WSaF5j4Jofxuqb9bTdrJGsa9igIC\nXHHIyYJ7G5Y2IasBG49nUeb\/j\/x0e9y4qMbgUwbtjHtoN66Jut62foP\/wc8QMOKD0FhRaWx52Eeb\nyRjtzEXqGoS5V5S5AQmzC+SdzV6Lu6\/2Eh66TXbGjZZa3Z0J0WmtRAfVddraWKO9SoEKc6O0FrJx\n4AAKWs+E7Ay52N8FyItfBHaQcDsV3CUADicMOpo06kAnU146mfbS\/sQN5K6lXcCK1Mp5er5fpu+O\nqvQst0TFTJpWxvpZw+tRJ+Ujjrq5odm8+mQ3+RRkLeE5ryXc1\/tq4j9M9zKQgJ7O9NKLWR\/Lsbq\/\nM+6m0ojT0qSHavEb6I2nowwlkpkbp3zUxaaubWapEB9Uz7qRM+umz4ZNV0HwfAzuQiYAHATfASNg\nENzfVGB46eaok7VnBoFTpRWHunar7w7amhqg4kyUMmN9nBMRNOtTIVqLB1mL4g7wVZge5oapk70d\n1x\/4417ClRW4A0tbAvhc0xwE5i1Ee1iD8gyCIm+ZDFrd1n4DhJgTgtyo+ysAETCAlOhu0OJJrfR+\nPzd\/tWu9dN\/SmvgeQAUOsOVRlxJAmFGMT0T0lpVadLhWgDCrDqj\/ZubIzhtfLOWXs3DmUjatype5\nMkwGM1VjJohAQqv4jns1NqvB5q1Zsm1FNPyRg0e9Ay6wNeZpgJA0hMXAD1sBJns7L81knFs629nM\nsRNvqBK2PuTgKDTN5uIJbkszGANzf2wc3KAau4GQpJ3XoFpqUAkDFpafOjNTQ7QacrLv4GV4QS1u\nsJkRvTIRTAetQHCvZAWK+JUexbpAy+sKDFKxyl4rOETxipW4EShagKg0MmkC4btMhHwH0wIMmoW2\nxOySYipjbsvvjLr\/Hmp5UwDNitTa7xC9qC4IkuU6oGXiY1VvEZVHTS\/VhQMi5m6a1M3P1OKeus\/h\net9aIPwYgvv4RGBgIdJAtKrJAFwaMGt60tfxngH3VbfCWht3UCnSQWn\/I9oaecIvRlAg5ZRGXFwt\nPrYALPC50jQ+DyyXMOu3BThu1uUNKwj1wBCToorgWsqgAjxvMPHa4GNyfHufqpkUras0cjJlcFqB\nVirKtBLJUlXEB\/GbXvaa5TAZoe10nMqxXvY96Q+hOSTlZj8UQDQPDYBR26\/JqQDTIz4qqQpwPOVm\nbcCUAII\/AhhjpdTBN3fquVONSzioOmpnOZgw7x\/n5rhZKKan6nDS0aT9twBKFJslzn3tb\/+a7L+9\nT33tDyjY9bWa2AyE06YqIpVGNydkM9pFs0YbDdsfUj4xoNyk2zT1YpybhWxygsudRCvguH\/UAoXv\n103ceaW1VZ73M95HFOx8QAMKcML9G66loi1dJEKhwX3JdTGneukj6mm7T\/3q+X\/\/+IrSwSfKTUwt\nFiN2LgISHNAeIOB\/AodrAVxU8vKpnxrq8NGkm4rhDkr1\/U51yHb2r2Y4MS38DtqTtATAQOc3ZFMW\n8D1+QGFlAQjeCSsgqvWWHwEhaQVQuLdsweI3wNXUc3XAN0lP26uFviv4GSrCJpcyN2tLGgUECCIV\nE6Jj0ZMyxg7bHlKg4wH7sff3X1Go+xs11sWWQB6sWMkZUBDRou5\/UArgTia9jT54Ou09f53up7dL\ng\/QmPUB\/TvXRd3O+erQCtGyB4xMpR1JIPUjiDgp3P1Qm\/koF3K9oSwUKxiPB76qx+n5EB5Vr5FnM\nfZAwzG2qDrg37tqVturVwgC9XQ4wLASwL2Z7GxK5dDD4jjq8ZaWhWtxFx8qstXHsk21cb80E3svm\nLVqdsw4KsDOltVepfu6S6hspHVCStQh86y+LAfphJUR\/Ww3TP7JR+vtqiH5YHKTvk31qIT7lgzC3\nl9OQtFcAzYXMeoqiD+3iXbtxg5MzAKFR+DDcCVCstQmj5U6vaYNkmu1gcYxOq3k6ys3TTsKvzOvl\nVPMyNUBvlhXwWoT+mR9m6B\/XQqxtaPnlvJ\/dollezPrpj3N+tbB+eg3rKKvguddKAXsJgy0g2pSt\n6wcNK2\/QuTSpBiA9wRseCJLr0aS3IYJlk3Q45ac\/JQP0fTpIby3ofxVGLPAwa1wE139dCqqxATqe\n8VPFar+gZUQvIhkicA058OZ4w\/sTMn050U\/59HR9s7M54mD\/O54P0uHsQIMf6t3JtlV7a017Zn0M\nznPQNKAnRO5DzqvXYH+Xbt6LlqcI5VHjEskUJwU4f8moFXIzqjri0tI0PZsbYTikGX0\/wkl7wmz1\ni9Ee9jcA7WdmqTw71HBOo5\/XSHulmxZy63FILuI4gzNXrMJuOraTJ4UG0FqZuzlXfS+MJhf5Lh9t\n3BBtTEfVAl0fbJKkojSD8W7O6Mx+cuOuHr7AC6R\/00XOXFrd30mNUTUVM89k1MJwH4trNT6n6nIz\n3J3OZ3IR+6W08ihTzadVm1ZPp09emRuilainXr7y1g6Oz2ksK2B8IeJogFsa8tFKbPDdnc5l8hHb\nrn40IX4F4HVr4yOw8h0wgJPIxLPiHggKRG1DrlOyMKjen1m4xt7ozqdbhWi3U8ytb7gBA5OWtP1t\n\/eRKOuSB7oaKwYdDGtiNadvfffYhZj5qC4vJ4VuiRV27EpUAkxoLWIzHmFaADW39l\/hT5rnkI4rg\nTZukN5wNuexjgnNApbX\/2n8EkAYQcYBBohWRDuR2uM6zu8z1Mwz5JTGKrZB8AAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-01\/street_spirit-1325797164.swf",
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

log.info("street_spirit.js LOADED");

// generated ok 2012-11-01 17:29:18 by lizg
