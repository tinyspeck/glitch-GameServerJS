//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Greeterbot Sentry G-42";
var version = "1344982233";
var name_single = "Greeterbot Sentry G-42";
var name_plural = "Greeterbot Sentry G-42";
var article = "a";
var description = "The patented Greeterbot Sentry G-42 does mainly what it said on the oversized Greeterbot Sentry G-42 box - greets, stands sentry (to the fragile world of the Ghost of Gwendolyn) and charges admission for things he will never get to experience for himself. A sad, but worthwhile, life.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_quest_giver_widget", "npc_quest_giver", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "I'm afraid one cannot simply enter the Museum of the Rook on a whim, little Glitch. One must be called to do so."	// defined by npc (overridden by npc_quest_giver_widget)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.quests = "";	// defined by npc_quest_giver
	this.instanceProps.variant = "widgetWood";	// defined by npc_quest_giver_widget
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	quests : ["Quests we offer, comma separated."],
	variant : ["Variant of widget to use."],
};

var instancePropsChoices = {
	ai_debug : [""],
	quests : [""],
	variant : ["widgetGreen","widgetWhite","widgetPink","widgetTin","widgetWood"],
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

verbs.talk_to = { // defined by npc_quest_giver
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Listen to what they have to say",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.doTalk(pc);

		return true;
	}
};

function doTalk(pc){ // defined by npc_quest_giver_widget
	var status = pc.getQuestStatus('rook_hall');

	// This is temp code to fix broken rook hall quests
	if (status == 'fail_repeat') {
		// Fix busted quests here.
		pc.fix_rook_hall();
	} 

	if (status == 'done') {
		this.conversation_run_hall_repeat(pc, {});
	} else {
		this.parent_doTalk(pc);
	}
}

function enterHall(pc){ // defined by npc_quest_giver_widget
	pc.instances_create('rook_museum', config.is_dev ? 'LMF18E5891926RI' : 'LA91BDTNHS82D36', {preserve_links: true});
	pc.instances_enter('rook_museum', -2270, -136);
}

function make_config(){ // defined by npc_quest_giver_widget
	return { variant: this.getInstanceProp('variant') || "widgetPink" };
}

function onPropsChanged(){ // defined by npc_quest_giver_widget
	this.broadcastConfig();
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

function onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

function onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function conversation_run_hall_repeat(pc, msg, replay){ // defined by conversation auto-builder for "hall_repeat"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "hall_repeat";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['hall_repeat-0-2'] = {txt: "Yes.", value: 'hall_repeat-0-2'};
		choices['0']['hall_repeat-0-3'] = {txt: "No.", value: 'hall_repeat-0-3'};
		this.conversation_start(pc, "Would you like to return to the Museum of the Rook, in order to review its artifacts?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'hall_repeat', msg.choice);
	}

	if (msg.choice == "hall_repeat-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "hall_repeat-0-2") && (!replay)){
		this.enterHall(pc);
	}

	if (msg.choice == "hall_repeat-0-3"){
		choices['2']['hall_repeat-2-2'] = {txt: "Will do.", value: 'hall_repeat-2-2'};
		this.conversation_reply(pc, msg, "Very well then. Please speak with me again if you are ever so inclined.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'hall_repeat', msg.choice);
	}

	if (msg.choice == "hall_repeat-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"hall_repeat",
];

function parent_doTalk(pc){ // defined by npc_quest_giver
	this.offerQuests(pc);
}

function parent_onPropsChanged(){ // defined by npc_quest_giver
	var questList = this.getInstanceProp('quests');
	var quests = questList.split(',');
	this.setAvailableQuests(quests);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade",
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-36,"y":-85,"w":72,"h":84},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKgUlEQVR42s2YeVCTdxrHsbXutrZ1\n2tndtjOt03Z6qKN4AIIHAiJClDu8ISckARIIUUTuM4T7DCFcCSSEhCsEgRAgCqgobmVrRW29be26\nrbvu1qPdcW2nf+w++\/zeaqfd2dl2omt5Z37zQvIen99zfp+4uDyi47iVevqgjVoxNRa93GqlnnSZ\nT4fV6vvsmeOS7MtzcvjwPcnfj4zzcuYV4ISN7XlqJv7o9UtpcOW0\/F\/TDp5BrfZ\/af5Y0BS89KCN\n3XB8Unj38Cj39khfZIHVumLRvLKiSbdtaXOlf5mq2E+p0Xg+7zLfjt5a5rKGfEZn0W7fGl9fl4Xz\nK0ko6slhvSCks451viIzaFzKX78aP14wbwCHW9mvD7Wwm3pU1Df1+YzbOUmbS7jcVS\/MD+s1U8+O\nGgUJjk7RjX0tXGivCIeqbMZsRqJvMIPx1q9+UbhpK\/XsUAuLb2\/nXZzqSYCJbgmMdohBX826m7\/b\nzyZmrfajVrj8Mtl8zkotOmQWhowj3FBzNAy3sKG7NhyaixhQsscP0uM3gozvPpLIXr32scfjtMJ3\n4bhB4O4wCIYHEW5fEwvsOi50IWCTIgiqMvyhaLcPpMdtuCuP8VAL2Wtef6yQ9nbqDbuWYxhqZoO5\nOhysGooG7K6NgKZCBqhytqMVfSE3cTPsFXvdlnDdCjjB7\/zmsSXFWDtfMtzK+caiiYZeNRvs+lh6\n9apZoMck0RTsgIq0rVAo3wIZCRshied+WhS1OpiiXP7\/ImKyg\/v2uCF2wmGSwMxQOrzvyIfTB4tg\ndjwbJvvkMNEjg32tsdBUFPJtcYrvt5kSGhBEUWuqKMZbv30kEHpV4IvW6h0vW8sZP3qgQuHyxFCb\nwMdhSvzq4u+r4dYlPdy6rIcvLrTAtblaOHOoEOYm8+DkgWwY65TcU+XvuEesuFu4HuJZayeFkWs8\nHgoMwGXBcFsUY0hLlQ5rqbphHVUx2cmLuHqycgn5fqyF+4LDGJc3O5YLty8b4M7HnXDrigFuIuBf\nPtLAldkKOHukCD46nA\/HbHuhR8ODyoxtkCXZBDKB+5149to4inoIETFiCH3Opos+O2Zgw1gHLgPn\nn+MdvCudKj6LfG\/Tilbs04nODxt3w9UP1AjZDrcu6uCL841w42wDfH66Hj55vxqOj+XAVH8K2I0S\n0BQGQ4HMG1JFXpDIc2sWha18zWlAh4b3PBbdrxAShtv4YGlkg6aI8WVRWkAace9wu9C3SxMD6lI+\nXD5eAzcvttLrrwh3Ay1482IbnJuphKZyPpRkhkNXYyzoyiNBgW7eI\/QECc9tRshy9XoIZUwtmrHK\nzkxiR7AbpUBgKrN3\/jmR57XJqPD99WALmzvaKYVTh8vRrU30+tv5JrRcHVw\/o4abl9rQxWUIyIHS\nrDAw4\/2G6ii6Lu5BC8ZHr7skpNYEOA148qTkqfdse46ecKTT2divFUGDMuLzeKanq7lm++IBTZR0\nVC+EM5MFcHmmGD47WQ3XTlTBhaNKuHK8Ej75Qw3MHciBQ\/1yGMMstxvEYMCyU5sdAFnSTSDluM2J\nqFU+zgPqJE\/tN4ksU13xYNGgexUhsDdu42dC5vK3J8yCxbbWaCkpyv0NLBhs5cPBXilM9yXBhDkB\nDluS4UCXFHo1HOiqj4bO2igwVJLOwqAB85O3QLJg\/UQstcrNaUAFtrChJmb1iJYLupJgqEj3h2S+\nx1VJ8CvPEMD9HTwp6bsdFaHQjC\/urosAi5qJKwq7SRQYK8OgNisAyvZuhUq8l3SUhrxAqMncBtlo\nwSS+x0gMc53rQwC6PGHRREpJf9WV7KRfliXZ+EdBhOvvCOCEKUY62sYDc00YtOEGelXM+4DfLQJO\nrFWOXaQaodQIRxb5PwfbXlGK36y+Ikw22s7d8WDZdZzN9saQN3Q6t6d+DuMCS12IV09dJHTVREBj\nYRAU7fK5Wyj3tmLrMnZUhh8b1\/NpmM7qMPrcW\/\/d6iefVYVCQz5aDDdWl70d6nO3g+r+0uCzjJWh\nX\/aqIi+gxee6VZFzPbgsDcxjFnXkSJ8qMkKnCH7mp7uIIvDFRkXQn\/BBNKSmIIh2VzE2\/4YCBuw3\nCGBfIwtMCEjcSq4jlhzA2EQA2vWagkBoxPsIILEkcXWrcgduIJwOhwFUP\/14fR9ujCyy0faykDN1\nGQFUauqGp\/+3m3HgyZVtKq7LCQB9WQjtyvrcQChN9aNftt8QAyQOSfwRmdVVg\/UOVcxgMwqF8mAa\nRF8WDIbyEHTvdijD+4iLyUb15aH0tX31CImbJJuyNkTRz2hV7gTs3bZcifcrP2lFEXvlaxmSDRm5\nss0TeTLve5nSjZCChTYXO8IBYwyMaDmYyUwalFjwQQwSOG3xTvqFJpRhdRiP+FLIwQTJlm6GgmTv\n6+XpWx0Yp331eUF9pprw83jftwSaWL44xedOusjLU+L2M+KR2vbmEnG068pkvntAEm8tQxy9llGb\nH5gyZRYByi3aNUT\/EcCBRor+u522XCj9WWdVGF0FiFjIQskljloDgvBVU0nsNTuz4za8RZa5KjSx\nT8X8lLidhERpqi+kxnqwxKHvPueUip4yCwInTbEwjoA9CETcTx5Osv5BPBHXE0CS0SXo3gKsf6QX\ny\/geIGSuHYkJXfl9mRk3cJhowSs9eA+xNhkVsCUKKOrNJc5UoQUjraxNWBZo9UyShLhzQMOiIYkF\nSUxiZpKApws0cW8+whErklaXwFn3ozo4ZRJycZa52l5Kau5WUO72BTnfo4IX6fqqc1K\/LdoDZ2Ba\n4psxzoiVyLBEygzGE8ZlFJjQtSRBSDwS2U8AySIx\/J+Ah7uFYoeBf01bHAwluBlibRS3lpjw1e84\nCchDQA7tSpKFxLU2TBhSN0nMEUByNlSE0NMdsUgmxl8m6sG0uA3Ezf2CiJXLHzxvxipVYl29eT+D\ngVbf\/PVDYp77uw8FSJeVpuj72UxBC1qrrfS7eDQiXHvpTrr2EcvtRTACSM5ynruKH7n8+zJyeiKr\nbdae9g+bIQ6MKg40lTKhYE\/gx9kyf+eUt6UhYmV3HfNTMxZwYsFRepILBx3CdWCRNmInaUO4HlUE\nDZ2N7U0esx7kAg+Qct2I3KombfP7+cYk7jjSn\/i1wxQPfU180FYwIU3ifT1Z4OXp3M+8dvmyw9bk\nU4NaAXYDDoxj0TZjspAgJ0lDIElskkwmbiOiIU\/uA3m7\/CBL5gdpCVtSfvhziFYZ5G\/VsM7pSkOg\nHnu2Qu5zA+dovoRycyqLXSZ6hcsmexJOHd0nhw\/2Z+JwlAUfODJhdjQNpgd2wX6UW+OmBBjtTEDB\ni2dzIgx1JIBJI4BaRQTkpQQW\/vDlKE4WkgGtKnPr+rK9\/n6Z8Z6v3p9ZnBvy7Tpq6YiWPWDDODzY\nFQfTFhlgDMGHh\/Lh\/NEiODutwBG0AE44cuDoYCoMtomhuTQSyjICIS1+49cJ3HWpgu2ui\/9bCSNK\n6lFMpAt61aEv2ZrZqSgYPiIZS1xK4k2dFwRaLNwkWTQoKoiiIVmMiXInVew5hh2JmSVx0nXOgFop\nalFtmv+K+tyA5MosP2V5mp9SlRegrM3xVxbt8lbuEXnmJPHdwoXUipfxeqet82+5p7M924SUOwAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/npc_quest_giver_widget-1312924342.swf",
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
	"no_trade",
	"npc-quest"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_quest_giver_widget.js LOADED");

// generated ok 2012-08-14 15:10:33 by simon
