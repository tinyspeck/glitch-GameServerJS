//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Forehorseman";
var version = "1354918798";
var name_single = "Forehorseman";
var name_plural = "Forehorsemen";
var article = "a";
var description = "THE END IS NEIGH";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_forehorseman", "npc"];
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

function flipMe(){ // defined by npc_forehorseman
	this.apiSetTimer("flipMe", 5*1000);
	this.apiSetTimer('speak', 1*1000);

	this.dir = (this.dir == 'left') ? 'right' : 'left';
	this.broadcastState();
}

function onCreate(){ // defined by npc_forehorseman
	this.initInstanceProps();
	this.state = "frantic";
	this.apiSetTimer("flipMe", 5*1000);
}

function speak(){ // defined by npc_forehorseman
	var choice = choose_one(this.speak_choices);

	this.sendBubble(choice, 3*1000);
}

// global block from npc_forehorseman
var speak_choices = [
	"The end is neiiiiiiiighgh!",
	"Hark: the Giants awaken!",
	"All things are evanescent!!!",
	"The tranquil extinction is the Bliss.",
	"They did not mourn you before you were born …",
	"Bbbbrbrrbrrrr-eehhhhhh-frdph-drdphfff-rrrr.",
	"I can't believe this is happening!!"
];

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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-87,"y":-188,"w":173,"h":189},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAL0ElEQVR42uWYCVRTZxbHn0D2PSGE\nkAVCQhKSAAlhC0tYFVlkk7CDyKaCCyguKBiLFJeiU22txa1a22rd7SLO2GoVxWrVurSKZREXSqui\nzli1djl3vhda7fRM1aIz4znznXNPcsjjnd\/73+\/+7\/0ehv2\/rioTRsn3xmjoq12hG0YuiaCIcwMx\n5nMDmBrAMCUYWavi9IzSWA3GTQ5gNWQEMasKohm854HPLkzDSPb3YJ4I8GDfDdeyzpq1zL5IL9a1\naB9G4v8SzEFGwwRGd3JosIq53k\/B\/N4oZ0GgkgVBKhYEeLB+MipYlv8KyaZNm+y7uo6xOjo+FZ8\/\nvcf9aOsWd0u831Bfd\/rWME\/GvRBPBIagUoO5MDlVADOznGFcAr9\/QhJ\/\/OJiJhfdYsh\/DO7ChQvk\n3p6Thotdn87rOLf\/5LlTu3sP7HnjVn115o8xei6YEFiYhgUFUTx4IU8Ii0pFvwvhrF8gn\/3q7+9g\n9vV9mXGp+1hrV\/v+K18c+3DD2sUTxlcX+O9KDna+FaxmQriWCcVDOTA3nw\/zCgW2mD9aAAuLhdBU\n4oI+nQ+\/VMjzf+YqAlym9Pd3ZvZePnmps\/1AH1Ju5esLKsrifFnbU4OYUBjJgFwzA8ri+DA9Ww71\nRZ5QXyCG2VlcmJPNhfpcHjSO4kNDPv\/u3DzHKmsKm\/1MAW\/duujef71r26ULx262n\/mo+YM3X9QF\nqygTfWS0ez4yBoSo6WDW0qFyVDDs3twArbuXw9Ka4TAthQV1GRywItAXcgZgrVmck7OyWH7PSDkg\nAPzD8bvvvo69ca3zyOWe463tp1pUuch8TWraix7O1F65M+WeTEABlQsVJhQOhcMfL4fP9q+EpuoY\nGB\/HgOmp7AeQeMzO5N6ty2IXWhMx6tPC2d292yu5c6ev\/Pbfr2y5fvV8b\/dXrU34b8gv7N0dMaWQ\nTagUcYjrxFxSi8KJeC7W3+WnuopEsI5PgIokCVQmMGBGGhtqEWBd5gDgLyp+YLUwFU8LOKS39wvp\njRtdM65eba+7fOFYTfvxFu9\/d22YAuMPUxJeGqp2uB+lsocELwcoiaJCdfJAinEoPF7IcUQFJABr\nNu+GNZuTNygVjzVj1A+WuAZvbhSG7VjgooJNmP3jusdQpX18rCfheLofEYoiSDA2hgIT4+kwJYkJ\nsywcBMYbiFwnqM9zthUPAjxRl80wWSyPvf+\/rtZmjvTj5a7H\/vaa9NTBNR6v39hjZD3q+lApxknQ\nOtSP8CLct\/gToTiCDOOH06AqkQmTRzCh1sJ9CIji171oS3U2Z5k1le70xHBWK2bXtsrF8PlbbnB2\nmxd0tJhO938a98hJZJiaYEzWO3yYZiRAmi8BcoOJMAYpOAntPxywZiSyGZRa3GpwwNoMNlKVbfuc\nncm5OTubNXJpHEZ6IsB9+zCHk2\/LRnS+5wV9+0J\/\/vqTqCOP+59Eb\/v0FIPDlYyAAcA0XyLkmB5C\nTkliIaXQ3svj2wDrENiMNBaqbhbMSrfF\/loLQ\/VE5o0reGS9zKdtjWf30Q0B33T9NWLFH12LSpCk\nFmFKpOASHCwrkADZKNIRYLKeCBZ\/EtqPVJRuOkxNwdV6mGJcwZnpbBukDdTCnt1ULHS1ov38SMAy\nI0aoimckV2fwjlbnK68ceL\/hrb6+jnCdEybAJ5bfwimF5DCtmLIuQkXqsfjhqSVAoZkAo0KJkGYg\nwnBPEiT5DEDiSk5NxtUa8MTpqXSYmca0fcfVRFZ0ad4owStLc7mPHmyTdJigNJp2pDyOdSsnSgQb\nm2vuXOk5faAsK\/rVcG\/BxNrKtJhFjaVKDxFBrxRRm7US+v0I1H9zQuhQGEaE0kgilEQQITuIAPFa\nIgxVkZCyZBg3DJk4UnIK2pPTUpiQi7ZDXhARFYrjAyXrcx3vNVh4okcCZhpJ8jExDJuxVqcJYd3i\nCujpPA5Tyy0\/B2t415MiVG3xIfKNehl9s6eY0aNzZUKYlgOZIWwoCifDmGgSgiRBHlIz0YsIMUoy\nWPzIMCqIBAUo5SWhFJicSIcUbwIMUw5BFc6zqYgrOwel\/rGAaUZMODaG3lebwYW6UT5weO8G6Ok6\nAZUlyT\/5yRk3AzyYnf4KZqdBRr+okzJu+8iYgIZTiNfTkIKkBwrmhxAg2YcIw9QkyPYnQw5KdQZS\nM1eH1IygQfkwuu2Ban9pgbjlzM0X3rJmObo8EnCCAiONDqOWjE1w2bNyfnnPpQun7n7WtutgXnLw\nfIM7tcjPgz4SD4OMlq9zpa3RSum3tVIaRGiotsotDCPAaDMRCkIJkIoKZ5iaCFlIwVxvElQE8qE6\nzAWmRAq+n5HM+QkfJHCrGfBDBJkrOGPNFzzeE01ijBLt65K5a+vS9Pazh8p3bnzVjKr1wYFH50QT\neLsySjQSWotKRL2L9iFkxnpDTaEJ8sPQ2GUi2BTEqxpPc6oBKedNhmnhInh5pA4WJat+mJ7A\/bkq\nEbcgNEzgloOicRTn88bRdP4THXyUQszx17PGb38Q8zCRh4ha7yVldHi5Mn7wdmOCXsaC2VMK4cSh\nnbBlTQMsbyiFpmkWmFeVDDVlcZAR7gY5BuSJwTx4JV0Hy9K1UBPPO1MZT781MZ4BeExGoKum8m++\n0yCsHPTwIHGkuiiE1Eak2te4akhFwAED1Hwb4PkvD8K1b9qh9+IZuPDVceg6dxT279kCpZlRKN00\nKPNHk41ZiJR0hgmRrIWTRzDem5HK7KjP49xfPV0Ch9ao4eg7xoODghNjGEXuSMlSudD6UHEg1Zhg\nQKFzpYO\/ygkaZhRD274NsG\/3Wti1czVs3dgM295dAetXLYT85BAIVdEgw5cKpYEI1OwIy+qLTqxc\nWLJu6SSPMZ+8pug5u80felvj7nS3mCsGBejqiAnlQsoSLVJt4DjJQUdJNhgQoB+e4kk5sLflDdi1\nfRksWTAZ5s8pR3D1sL55LpSkm8Ffzrjn50b8McjNAUxyMtRNyoSd7y7qmFoYsHTFDHHf+R2+53v3\nRy\/79qNAwSDTi7loJPTlAQgsWM2zqacUEMHb2QHMbgSwmERQkuADxSkmyEkIgIq8WGisGQ0zxqZC\nergKAj1Y3Uj1d9XOhG4l3w5qJmTAvpaVP9aWhV0rieV2b2mUp\/Tu0UgBHtPq\/mh5oZEqRM2fGWMQ\ngVnnBBoRBSSsIeDBHYK6BeoKwch8fcioB9Mg0cCCRKMTZJvFkISOohFKOuglpLOFKaGTm6xj2uZM\nzYftG5rgvQ3zocqihqJI2tXiCNLTTdeBCi4z3EtYFaIV2FLs6WQPOmc70AnsIFZLhpJIBIWsZISe\ngvovBRUFFdkLBaIUBAiUUUAjJJw1eznH79jQNHb3jmUfvfFqzYlpBYG3iyLZ35VEkl4ri3jgGn9+\nHTy4mrFiaW2Mv4w6Vy9FhyM8tSIH8JMSIcCNAuFqKsR7U8CsIEKwOwGCZQQbdAzqIgYXewRHBCXf\nYa+chRn3bJrPOrRrrTw1XLkoLZBXkxtKTM0PwaT4GWdQcBERevbMKblTN6+p7U4xkL4xyRxAg1TT\nI8AAGRnCPFlXzVruWl+JXbVeZPcXb6HdcrXTkN0aZ7vrRvQAQXIa+KOH0Akdtss5mA6\/pxRtF70r\nJdjoigktGow4aOWEGEYN8pIUVldkf3vm6PsXZxf5NceosVKlE7ZIL7T\/xCiyPxIgJa5FoGEoPwwN\nE+MqGZijnIcVeDgO+dJLaA\/+rkSUYjL4Sgh7vaQOMQqFbXLG1SI+9dsFhYgiHjk8aO\/h1g+7F1gn\npC0uNnHxNsjGMLaGjzkbUGXjQBrsoQpqBsbzkzgs9nGx+x6pCb4ie\/CT2Pf6iu1z8Qd+pq88PMUk\nD5OX5NLL86attmg0T5QKHReTRCsJa0MV9j16F7u3vQV2DT5OWKzKEWM885dFfD5G9xRT46MDZd5P\nfOiabpG+\/UrlujcXjdtaVxJqxDvQ7\/v5M39j+mfSUpYfI23bt3Hdxc625v7+DvFz9wJdQMecNG7c\nJdMnjj7dund7+aZNi7nPHaSrkOg5IsqwNdJPfttTQh+H\/kQYzH3+CSV1KnH6clepAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-12\/npc_forehorseman-1354916964.swf",
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
	"no_rube",
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal"
};
itemDef.keys_in_pack = {};

log.info("npc_forehorseman.js LOADED");

// generated ok 2012-12-07 14:19:58 by cal
