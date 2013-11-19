//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Ghost of Gwendolyn";
var version = "1348081133";
var name_single = "Ghost of Gwendolyn";
var name_plural = "Ghosts of Gwendolyn";
var article = "a";
var description = "The ethereal manifestation of one of the ancients that used to inhabit Ur, long before the Glitches arrived. She claims to be a disciple of Cosma, who died when the age of Grendaline overtook the world with a great flood. But who can tell? Ghosts are notoriously inconsistent.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_gwendolyn", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
};

var instancePropsChoices = {
	ai_debug : [""],
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

verbs.talk_to = { // defined by npc_gwendolyn
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Speak. With words",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.setAvailableQuests([
			'tower_quest',
			'tower_quest_part3',
		]);

		this.offerQuests(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onCreate(){ // defined by npc_gwendolyn
	this.initInstanceProps();
	this.setAndBroadcastState('idle');
	this.apiSetHitBox(400, 400);
}

function onPlayerCollision(pc){ // defined by npc_gwendolyn
	if (!this.container.isInstance()) return;

	if(pc.repeatingTower) {
		this.setAvailableQuests([
			'tower_quest',
			'tower_quest_part3repeat',
		]);
	} else {
		this.setAvailableQuests([
			'tower_quest',
			'tower_quest_part3',
		]);
	}

	if(pc.getQuestStatus('tower_quest_part3') != 'done' &&
		pc.getQuestStatus('tower_quest_part3repeat') != 'done') {
		this.apiSetTimer('resumeIdling',3000);
		this.offerQuests(pc);
	}
}

function resumeIdling(){ // defined by npc_gwendolyn
	this.setAndBroadcastState('idle');
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

function parent_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"npc",
	"no_trade",
	"npc-quest"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-68,"y":-225,"w":136,"h":225},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIeElEQVR42u1YaYgkZxmOGvE2GmNE\n1CSiZIWAt0ZFiCaySBYTNRAJwYAJKJEgEskPibqRTVACsgRBZI1hXSe7mb3m6Olreqbvu3um5+q5\n+6z7rvq+r46uPj6\/L7hxf4k\/unf9kYIXqrqb6qee93neo2644c3jzeN\/OzDGb61i\/PYrQa\/\/b4CV\nLO\/OVc19vqa5L6wqziNFDb8\/gfF7SbyTxI3XDRxlqqZ5z5DAV6Kq2G+cr6huhoKuAnDLdQLnvlDT\n\/wOOnlc1z0909P7VnxOgtWsK8jzGb8vLzi9zIvKXu3o\/yZp+UXWHJdXz4xwS\/1nZBRRgWXFxkTBa\nVl1c0bwZ+lDXBGAOwltndtn9WFf3E6LjL\/Ogl5ScXkpEIMqBw6m1hpSR7T657idFu5cU0XCZNfy0\nBJ+cuHkoC6fKu4+GOpoT46AfaCgg0NKMMGehRQ50ozzYCnJg+\/wOp5JzJ8pBN9K1\/GUBDWd22NPU\nOBMFSN0Z5dFyhLF601sdMNdUjRALzBAHGmEBrgQ5GmAtyJhbcx1DD7IAzbU1Z6Gt98jvNl7Ob908\nMRYpe39Z3z0ytd4qBpqqG2YsFOhCNcyD7YiIyiHBLszzVjHAg\/I8Z9WCjLVzqaFogS5AMy3VnT2U\nmAv72tGJsUgAvvul7Mb9QdbYpukj2mJjgrUZEVA1xMPiAg9yQRFkgwIoBHirSljdCPJgf7alqAus\n5V4+EKtnqvt3ZzF+30QA0gK8wJono7ydzStIzsioMd9U6pcO5PUID0sETHGB+3fwqDrfNTam9\/lG\nhDU7YdYyggLszrX1YxkTf5BWgrGnN8bpt4U480JFdaJVDRqxltZ5da3ZPrfN7BOAKwTgCmFxNSyA\n1SAP12bbxs5r9Q5zfpvl4xyQiSQM8t0zaYg\/PPY00xvGRfe+ZcF+qqK6uzkZKlkJdfIi6EzX252o\nCDeiItokALbCHKyHBbQd4uB+htHFYFsWkpKthBhzLyTA36Vt\/FEql7Hrj6T0uzHeeaikunMpye4U\nZFtY6irCn5fKYlx09pZldBCTUGNRgIeE0UaEt9rRA0G9uMNIaREZQRamlkT7ZynH+cTYdUhvmNHt\n78Vk+xgB8uu45j1d0exGTkLc\/IHAJySnnZBsbplcL\/GQiwk2uyQgdv5QkZK8rRQVdHaZNZ9Mab0f\n5XT39oSBP0DKzVvGx6COb8pq8K604T0YU+zjcdl5Nm94Jwuax6UlQAzjSikJqeGuoUe6qhYXbXlZ\nBEpadlTSVbaLmv14UkIn84b\/hZTpfrIE8IfGZhT6pPSJC4Z7R1Z3HiXt7Y+ErRMZrXeiZHj\/KGgu\nn5NtK3Aooen1pnu6uuMkeAiIJKycYtfymv33nOH8omiAxwum\/8Wc6X2KAhzbKEYrPy0NFGBZdh6O\ny+ilhGL\/Ka04J3O6f6pk+tNVo7ed4gGoqnZ\/VUZ+QXPYnOpUsrIbywjwVFV3\/1CG7n1F0\/9S3vI+\nnQD4lrENDxRg3sI309SkVOehhGj\/jTD4V+LMU1ndnSoYvaWSbHvxrj4M7Ar4Up3DwQOpR9zOlnR3\nOifZPy\/D3g+vBkhLzVgBUgYrCjhC0vu1lOKeS4n2mZSCprKqe4mwVQk1pUGEtfDZPRFfONTxQlcf\nnVlvtGqw\/9wK8H9aAt4PStC9lwKkKR43g29oMIN6n0vLdiQtOTOk1b2W0+xXkryZTgtgFOYhnmXA\naLYDcYCx8Nye4KzZ\/d+sAv+JEuh9vwjdb09Eg1dcnNGd27Kq\/VROdsJp0UlmFe\/FVeQ\/He5qKxXF\nwcS5owCHhq9H28DBttavWu5vK6j3WBl4D5Rh\/56c4X+eSoVKZqxTDa2DVdW5u6Q4LxZUZ54Y4Nmi\njn5cNpxfXdrjpawAMZkBh6drzQGNqY3OaOFQGUQ4MFOBvUfIYnWsCPrfLKLeZ8deB6u6ftOa6R2t\nUh2Z9pfzlv\/Vgtn\/DtVVkAGVhAg9uixd3hMGZ9bbBGBrQHrwYLGtDmcZaKTIelA0+0dLwP96Fvbu\nKjrOx8feSWgvzkF8K3Ug1VFR9+5fkuyXidb0JA\/6Wc7CSx19lOzqOMPBYVmEw0hbG50\/kI25rlVL\nqugnOdP\/ShZ4RybSi6mgqW6oUWiakqz1WOBAAmfrHZDirUFGcjFpbaMIY47CJKKsNUpJjn92s20H\neKgFmspFqj9qEFpiDjB+x0TmwbyNP5YHvc+EDvipHGv5wUPBjXZMuhyNiElwjIAkw8KIgl1oaYN5\nshIsccBKC3CDppcajepv7PMgPfIYv4ummbIQlbRvxJrSQpw1SpGuOSQgcFxCOK31cJKsm2S7Gy1y\nEIe6uhHc5+N52X0iY3l30vTSvWZSC9ONtGDTcYmySItuSnILwY4+TMrOaLaljV6tM\/3ZpjIk0\/Ro\nUXRGF3ZYL6v0T1D2qHtp\/ZtIeq8c6xi\/p4jwR2gto3+a5C00dyj3ErI7IlM0MYXoBbvmKEhSPs9Y\n\/sVdwVkSQfB17RH2qHsnuhvT9kQ1RLVYNnsPLzKaTdJrxlVvEBTs4eWWOiDAhguSMwwJwA50dGOx\na6KCYj8wcfau1iL9sw3DXb+w1fGSsmeSidoiO0ifgB0EumY\/LLl9MkzoKTJJzxEWq6obp+yPdUj9\nb8PDoWU\/XzfdYbQpu0XVYeOSk5jvaF6ch4PpfdEP8aiVlN2lguzULm0ybLareesqvPeavUA60JFR\nEy0ndiixJbVXy2p+Nto1UEZEw+k640c7YJc4OlaVna0co7NlRhV3FHj8mgHc5t3btyTr9Jpo2Sua\nu7Mq29xi25CzsjM4t9nuLzTkerSjrZR1d31DRvqGAu+5Li8xdxT3W5sy2tuUoE167y4Z9XcTLZlP\nNBWmwOhKXUb9uoheua6vgRtkmKhL8DiJ5wjQ31Ot7QjuHeO4978AXpFT3fg5wIcAAAAASUVORK5C\nYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_gwendolyn-1342640266.swf",
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
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"npc",
	"no_trade",
	"npc-quest"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_gwendolyn.js LOADED");

// generated ok 2012-09-19 11:58:53 by ryan
