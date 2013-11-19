//#include include/icon.js, include/takeable.js, include/npc_conversation.js

var label = "Icon of Cosma";
var version = "1354842496";
var name_single = "Icon of Cosma";
var name_plural = "Icons of Cosma";
var article = "an";
var description = "Emitting a soft glow and a ethereal whistle only butterflies can hear, this Icon of Cosma, made of eleven glistening emblems, can grant many benedictions to those who treat it correctly.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["icon_cosma", "icon_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"actions_capacity"	: "20"	// defined by icon_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.actions_remaining = "20";	// defined by icon_base
	this.instanceProps.testing = "0";	// defined by icon_base
}

var instancePropsDef = {
	actions_remaining : ["The number of actions remaining before tithing is necessary"],
	testing : ["Set to 1 to cause a bestowment check every 6 seconds which will always result in a bestowment"],
};

var instancePropsChoices = {
	actions_remaining : [""],
	testing : [""],
};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.furniturize = { // defined by icon_base
	"name"				: "furniturize",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Turn into a lovely wall decoration",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (config.is_dev && pc.is_god) return {state:'enabled'};
		return {state:null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		var pre_msg = this.buildVerbMessage(msg.count, 'furniturize', 'furniturizeed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.tithe = { // defined by icon_base
	"name"				: "tithe",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Insert $cost currants to support the Icon",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_tithe_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.icon_tithe_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_tithe(pc, msg, suppress_activity);
	}
};

verbs.ruminate = { // defined by icon_base
	"name"				: "ruminate",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Soak up the happysauce emanating from the Icon",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_ruminate_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_ruminate(pc, msg, suppress_activity);
	}
};

verbs.revere = { // defined by icon_base
	"name"				: "revere",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Let the Icon replenish you while you adore it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_revere_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_revere(pc, msg, suppress_activity);
	}
};

verbs.reflect = { // defined by icon_base
	"name"				: "reflect",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Dwell a while on the true meaning of the Icon",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_reflect_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_reflect(pc, msg, suppress_activity);
	}
};

verbs.place = { // defined by icon_base
	"name"				: "place",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Place this Icon on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.icon_place_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_place(pc, msg, suppress_activity);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.talk_to = { // defined by icon_base
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		if (convos.length) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

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
};

function onCreate(){ // defined by icon_base
	this.initInstanceProps();
	this.initInstanceProps();
	this.apiSetHitBox(300,250);

	this.tither = null;
}

function conversation_canoffer_icon_cosma_1(pc){ // defined by conversation auto-builder for "icon_cosma_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_icon_cosma_1(pc, msg, replay){ // defined by conversation auto-builder for "icon_cosma_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_cosma_1";
	var conversation_title = "Rituals of the Giants";
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
	if (!msg.choice){
		choices['0']['icon_cosma_1-0-2'] = {txt: "Namaste.", value: 'icon_cosma_1-0-2'};
		this.conversation_start(pc, "Namaste, Cosmapolitan.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_cosma_1', msg.choice);
	}

	if (msg.choice == "icon_cosma_1-0-2"){
		choices['1']['icon_cosma_1-1-2'] = {txt: "Um...", value: 'icon_cosma_1-1-2'};
		this.conversation_reply(pc, msg, "Please prepare for the daily salute to Cosma. Raise your arms, and assume the position.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_cosma_1', msg.choice);
	}

	if (msg.choice == "icon_cosma_1-1-2"){
		choices['2']['icon_cosma_1-2-2'] = {txt: "Om.", value: 'icon_cosma_1-2-2'};
		this.conversation_reply(pc, msg, "Appreciate the silence. ...", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_cosma_1', msg.choice);
	}

	if (msg.choice == "icon_cosma_1-2-2"){
		choices['3']['icon_cosma_1-3-2'] = {txt: "Um...", value: 'icon_cosma_1-3-2'};
		this.conversation_reply(pc, msg, "Give thanks for the circulartude of the still, quiet airiness around you.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_cosma_1', msg.choice);
	}

	if (msg.choice == "icon_cosma_1-3-2"){
		choices['4']['icon_cosma_1-4-2'] = {txt: "...", value: 'icon_cosma_1-4-2'};
		this.conversation_reply(pc, msg, "Aaaaaand Shhhhh.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_cosma_1', msg.choice);
	}

	if (msg.choice == "icon_cosma_1-4-2"){
		choices['5']['icon_cosma_1-5-2'] = {txt: "...", value: 'icon_cosma_1-5-2'};
		this.conversation_reply(pc, msg, "...", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_cosma_1', msg.choice);
	}

	if (msg.choice == "icon_cosma_1-5-2"){
		choices['6']['icon_cosma_1-6-2'] = {txt: "Ahhhh.", value: 'icon_cosma_1-6-2'};
		this.conversation_reply(pc, msg, "Aaaaaaaand, come back to center. Your salute to Cosma is done for today.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_cosma_1', msg.choice);
	}

	if ((msg.choice == "icon_cosma_1-6-2") && (!replay)){
		var context = {'class_id':this.class_tsid, 'verb':''};
		var val = pc.stats_add_xp(111 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
	}

	if (msg.choice == "icon_cosma_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"icon_cosma_1",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Icons placed on the ground have a chance of bestowing blessings when you walk past."]);

	// automatically generated source information...
	out.push([2, "You can make this by combining eleven <a href=\"\/items\/583\/\" glitch=\"item|emblem_cosma\">Emblems of Cosma<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_vendor",
	"no_donate",
	"icon",
	"emblems_icons"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-46,"y":-104,"w":101,"h":93},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAScklEQVR42s2Z91dWZ7bHM\/f+cOdm\nrTvJTHLHtEkmGhUbCigqiFSpogIixhqxJ4ioKIjCi3SRKiK9995BunQUVJCuIoq9xNhjkrnrczes\n+8PMfecPmHetZx1YvOecz9nP3t\/93Yf33vu\/z7P+o40\/9bvxL7MGj+q+9\/efwUaX0IEGZ4bOuzLc\nfIyRVgXX2r253unP6MVT3OwOZexyBLeunOV2byx3+hK425\/EvcFk7vTHc+dqDOM9Z7h9OYyxbvn+\nxQBGO7250eHJ9bbjXGt2Yfj8IYYaHRms+56B2t30V9tztWoLvRUb6Cmz5UqJFZeLVtFbtpbcAKMP\n\/gHwwRVvxZWqHVzvOMaNCwqBOsFoty83LwUIWBC3ekK51RvB7b5IxvtjuDOYMLle3isR2HABDGa8\nN1AeQM7plnMvHOPxUBi3uhUCO3E9DwF2E2AXAT7EtVYngXZgpGkvw427GGrYzlD9Vq41bmWkypL3\n\/v\/n3iUPRW\/ND\/x8P0dWHj8\/KOLdo1LePa7i3ZNafnnawC\/PWvj1p05+kXV\/OImarM0EHlmIp8M8\njjku5KjDAjmqcfyHuSj2q3HSeT65MVb0n3fiwUAEb+7l8eZONq\/H03l1O5lXY\/G8vBnNyxtneHE9\nVFYIz4cDuFa7VhnwTpebord6L2\/vJNNfu4eGTGPOZ5txPseC5jxLWvLX0FpoQ1vxOkrizfE9vACv\nQ9oc2aTG7qWf4m42j+Mm33DU6GvcDabibjKT7QZ\/4eRRCwKOG1CYaEtnqR0dxWtpL7KirUCumWdO\nc64JzTkrGJmIXsshXlwLYbRxkzLg7Quuip5zu3hzK5YLxRtw3DCDg1vn4LRxJo62X+Oycx5Hdqri\nuVdtMkoH7NVRGMzF1eArDul9geeKqfhYSOQs5uAmkF4C7Gb8FZ4rVXBZOYtQLxv8jy7Hy3Ulnof1\ncT+og+s+bVwcluK8ayEXy3cLoPNkNMdadigDjnUcUVyp3Mnrm5F0Fn6Ln5MGXo4a+B7QwPvAIoKP\nLuWsvwlnjqmxd8F\/ccpsKrFrZ+BsOYWqzC1UZO+lMv87KpO3UZy0leqsjdTL7x5rPufs5nmEr53F\nHtvPSA+1JTbEmtM+xpz2NSNIYUq4zyp6ap0kN914ORbLeIeDMuBo20HF5YrtkgfhdBSuJ0ahRZyP\nHkl+BqQFGpIasIyMUG18zb6keKMGhVvVaK\/ZR3+dPT3V24n11yUveQvBnsY0FO\/jdn8EI5c9uXXZ\ngxsX\/ajZq0faBjWO7JhBdfZmqjK2Upy8kZw4G9IjVzHU7CoF5DGZm3e7nJUBr7c4KbrLt\/FsOJj2\nfDtiPJcQ761N3InFZAXrcS7Bkn3L36fIWZ8SN0OuXTgqcnSA0S5XkoOM6Tp3mK06U0k7YoSF1ocU\npNnzZDSeB4M+3JYb3h0Io8FBl0YvW5rqXCS6W6iSKJek2JEZtZprnZ5S+d68vpPJgyvHlQFHmhwU\nXaVbeToQSFveOkIPzSHFR4u8MANKzq6gNMqQnHVfU7VZhaGeIMa6PBgTuXhyPYjxgWDmTP0AD2tN\n3o2Gk+hhh576p5w+uYyno8e4Myzf6ffh3q0YugM3UHfEnKbizdQXbKIy3Zr8GAuRIT9udp2USs\/n\nYa+3MuBQ4\/eKiyWbedznT2ueLYmKJWQHG1AWZUJJ6HL8jadQar+ItNMr6ZNIj\/ccE0F2Fd07wV8+\nf4+akDWcy3SB191EWy0kYrc5V5tCeDKg4NF1D5Eld+4OeZMl+VnrbEySv6hDgR0VaVYCaSXXkYe+\nFMzbB6U8GTylDDhQu0fRWbSJBz3etOTYkOglgKeWkxVpQH6yERmrvqJlu7bkk4+I+SHuXjrKk5th\n9LYewVRvCs9\/rMDXaRnOezW5VOLPrwwwOpjBk3tevH0Uxc+PMngwGsT9oWDadutT6WJGffkOKgvW\nUZppK2IfKZCn5Xvn+HEkQhmwr3qHoqNwg9zYk+Zsa5J9lpF1cjnFJy1JM\/qCnI3TKRJpuNd7ilud\nzjwd8uD54zb2bFhCXdBOKjLduDNeAj9e4OmD83RWn+JM4DbCQux5dTeR5+NRPBk+Iec6UOWgzUUn\nfZoPrJQoCmT2BmmZ0dKJoqUpNPLTzThlwN4qe0V7wbeMXzxGU7YVqb46FAYvJ+2ULunGf6Vyz1Jq\norbKVkXx8PoZXt4KpafRBcOFnzFSrKC7zpurbWcYuhDF1c4EejuS6C8N4NX9Kt48TeeXJ1m8uR3O\n42F\/CiPWccFtJTWHVtBe5UBD3ha5bqLkaQK\/\/NjGy9tpyoBXKr5TtObZMSa98nzmGjJOarN+7icU\nnzGlyGYO5bsXc03y7VafHz\/dSuTZeDg88KM8y531+r+XlpVJfYkb7x428fBGDi\/G8tFT\/R28u8y7\np3H8+jieZ9cCeX49koE2BQ0uKzh\/cAVX6p2oSFrNw2up3BlIkTbaxWtpiUqAl8o2KVpybbnR6kxj\nxmrZXqngk\/PJP2NI+WY16ndqMtruyY83TsiWhYgchEkOfcfBHVrwMpM3d2P4cTSBVyItwx2h3BDH\nw9tMDu7RY6D1KL89TuJv98\/yZixU3NApLolANx\/Qoe+8M51lu6SQ0rg3nMWvL3olD8uUAbtKNiia\npTiuNTvRkGEpdkeLbL+F1MbaUrNNnfN7F5N\/2ppnN0L55ZaCZwNHqM85yOu7Z3C2VaOh9ACe3+tJ\nJwphqM6Jt3crcN+oLfmUJ5H14O39aJ7fCOG3BzE0R9nRp5AIOi6m75w9dckWPBgR+zaUzm+vhyTi\nNcqAF4rWKc5nWYtf20d9miWpJ9QpCFxCU+o2ijbMpmanOtVOhiIbHly\/cFyi1sKJw0tIC7KhOf+I\ntLDNaH72MY\/aXLGZP5d7fYnkRDmQEr4eLzmPl508H03ktydxdJxcw1U\/cy44LqW3cqOcv447vWdk\ni5P47VWvOKc6ZcCOgrWKRsm9\/rq91KVakO27mJqzRtQnrOV6VyojAzn0HTDlt0fxYscieDKWS1ON\ngrHWANwOGbFO8xOM571Pje9KrGd\/zl0plhPOJvS2hDJ4MUIKq5BXNwN4PRrAwClzHo3nMn4lmMH6\nLdSlm3Hv6mnG+2L57cUlkaVyZcC2PGtFQ\/pqrlbvpDbFnAzvxWR6aVAZY05LoSuNhS7cGi2iVJo8\nd8+KlztGacI+2hIdeTpWTEaYNW2l33HFfyUWC3\/H\/Z5Urub40J59gtyEHfzPjwkwGkLdKX2eP21i\nqNWXzqrD9JRuo71UdLAnTHIzUvxmO6\/uFSgDtuSsUkxsbe+5nTRlrSYnaDmV0uIKww1oynejq9pP\nHHYaV91MeXk9gOdXD\/O3h8EUntnK81tZtJX58OphIfnuRnSXH5DtyhNvWUtl\/IRmnuDNqOdk9Ot+\nmE9rqTcNWVvFF+4SN21PizSI8SsnxbmHi8w08uJ2hjJgY8ZKRa1s7eWKbSLUAnhSh5LTRhRHGNIm\nSd5RIda9M4q3LxsYPL4CnubQkCZ2fSSArsOrWar2Gbmu+lyu96U9ahMv7hQx4rmZn+5n86IhkL\/d\nOs2wlymvbhQwKnPLpWqFXPMofbW76D63Q9qmt4wXQaKX1TwbTfongGnmippkM7pLN4sOShUH6lJ6\nxpiaBCtx0550VvjK3xwlqd1pjt\/DpX1ahBwyxG3jVC5F7aLU304cSRQj3akMNPgS9q0aXdG7OGw9\nnSgnUy45L6WzyY8LVUH0N55gsDmA3gYvcdbrxaxuk3nluMwu\/jJmlPF0JEoZsD7FWFGdZDrpphvT\nLcgP16cs0piis2a0l7vTXibbXOlCZ9YuuhpDUBh9hIfGH8gRx7xz2RRKUo9wTaa8MdGyR+OZrNGZ\nQrDFMr43+Jp8O22OG31Ja70Xg9Jtehv86alxpzL1gBhVe+pTLcVNu3Cj04t3Dwp4NBiuDFidZKSo\nSjCmXZp3fZopuWF6sr16FJw2pzxlrzy5J9217hJNV1KsVcmymUum9RxOr1GhwE4GJOMZhB5fS1Sw\nDeV57rhs1ydvpRoRy78gWu\/PZKxWI0n\/U3pag+lrDqU5YxuN+c6T0WvMWcdw00Gut7vz890sHlwN\nVAasStBTVMYb0ZprQ22yCWlei8j10xS50RHhduRc6l46ylwIk4jEm84g0UyFXNuFFH8rrsdGjVTr\nueSsXUJFshPfWUwhZa0Gfiunkmo5hwTDb0hbPZv8TZr4GX9Kf9MpuupO0lXjKxq4kXNpaxhs2Cej\nqCtvx5O5d8VLGbAsZrmiIs5wsoJrkoyIP65OXoAO2ScNxbPtp0mk5mLpMaJNVYgXuDjjbyZvnmk1\nn1jj6RJRdRLNVWSmDmGH4RQczCTKqxcSqfclqasE3mYe6WvmkLt2Dq0F39NZKUVSfkKmum3UZqxn\noH4fI83OvJWhbfziP3HUBeHLFGWx+tKHV4q9NyDFT4sMfwEUUS08u42qRHvcF\/2RGHMBsZxHlNG0\nScDcdQslclpsXT0LaGZ8MIaLOQqCrdQJtFIjR6KctlqVPDt1UtfMJdZ8Js6Gn9BS7MyFcj9xTnZU\nJprRW72b4fMHJ4e2sY5\/MpNknFyiKIrUlS5iRkWsHpFHFohYa5J1yoSqdEeK4rYQoPcNjhr\/TYSR\nVOaK6SSYz5qMTqqVKhkWKmipfsSLx6KFydKXpYtE6HxKgsk0MbuqJNktkDRQ5azJdMJNZ9FaclQc\n+H4as+wojTVjYuQdbNw\/ObSNth5QBkzw1FTkhS+T7V1BcaQOqX5LZFhaRpKvNgnSHc7lH8JH+0uC\ndGcSYTxz8kZRxtOINZlBhpWGbKc6lrpT8Lafy6KZ\/4GrzickW86Qh5hOvMVM\/OTn+InIm83GUfMD\nqvL2UZzgQHGMMWUCeKVyB\/31jvwkQ9v15v3KgBGu6orMIG2q4vVlFtEm2l2V9FNLSQ4Uuck6yPFv\nZU7Wm0fA8ulEmMwi2mIecSvnccZwBjFmszhhOJ3O5hT2LfyaPF8HXBZ9TKyV5Kv5bGIsJU+tFxG3\naj7h8nCB+tNJ9rCiJu8weZH6YumMuFiyVUT7h8mh7VrTPmXAU06qimT\/JRK95ZJ\/S2QeXipORZco\nb11K0l3x0J+L4ZwP8DeYTYC+CkGygvWnEWGqjq3Gn1mi\/jF6S6fy1+n\/zgHTaWjO+DfCV0zlrLGK\nrOnEWizgjKU6YSZzCNGdjvfyaZRmHKQkwZqsUAM6ZMKbePXy6Kofww0\/KAN675mriDshORekRYzH\nQlICtEkW0ARfXYoS93NMR4UNGh\/jofsNdhp\/4aSeCqdkLZrzB9Rm\/idLVD9EVY6zF3zA8QVTMJBJ\nz2n+RwQu+Rw\/rc\/lQWajOfv37FL7iBNaX\/HdwikUp7lQGCeAMla053\/LlXO7ZSYWMa\/fowx43F5F\nEXlsIYk+moS7qMvQrin5t5hobwM2qP4Jtdkf4Kw1DR\/9mfiLhPjozMBXZzqaAqOu8gcWzf4QjXmf\n4L98BhrTP2Sb1qeoqvwRtbnv46M18UDTWKTyJ\/Ys\/Bwvra\/RUnmfLSJBycGGkkY60vK+5bLk4d1L\nCgakPysBHlz\/jSLsiDqRxzQI3D9f4BaR7KspNmoZyf5LSY81oSJ6jSS3DUWRWuKCxUSU2lAXvYxm\n6d0deVbSbezorralNtWIliQ9OjNkcstYQUv1NmlnVlRnr6AuyYTKZFOywxZTINfOCDMm3k+bNolg\nd7k9t2VokwlTGfB766mKQKf5BB2aj2y3GAE1wo6ocUaAoz00SZSIpsq254TqkicXLo3WFzkyEM00\npDrRSLqPMbUTxzQTgVghQKY0ZayiQY4T2lqfai4mZDX1SWacl5nnfIYVEw6+KduWppy1XBQPcFH8\n5Finq1g+e2VAe\/MvFb4\/qOL9\/Rx8HGbh5ziLwIOS0EfmctpN9MtjPnHeaiT6apAWuIiMYMnXEGlz\nYUvJCdcm9\/Qy8iJ0pCJ1Rdj1KIoyoDjakJKYFZTGmVAmqzxBNDbRnKqklVQlW1Kdsprq1DXUpluL\nq7YRod4vGuhMT8V3yoAbDL5QuG5RwWn9NFy2zuD4dpVJWP\/98wg5LBXopkaspxSPvzhtkZ980cyJ\nii+biGTcRBSNqUsxoSHdfDJiEy2zJceKVkmJCQMy8UrvYvFGusTOXZJp8EqF\/aQ57qvZRX\/tXikM\nBzGvjow07edy+RZlwDCX5UlBB5YSdlibyKPLRAeXE++pK1urT5q\/vlSaIbmhRjJ0G1MaJfko4lot\n0ahLWSnbZUlb7mpZayZXu+RjR741nQU2AmbDhSJbgVtH18QqkTwtXc+lMimKsg0Cs1FgN9FTKTJT\nuZneqi0CvF1Mq8s\/vkT\/+eE5\/qXWk5rJf0P8L0QUL2cE2VQJAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/icon_cosma-1334255054.swf",
	admin_props	: true,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: false,
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
	"no_vendor",
	"no_donate",
	"icon",
	"emblems_icons"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "reflect",
	"v"	: "revere",
	"n"	: "ruminate",
	"t"	: "talk_to",
	"h"	: "tithe"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"u"	: "furniturize",
	"g"	: "give",
	"c"	: "place",
	"e"	: "reflect",
	"v"	: "revere",
	"n"	: "ruminate",
	"h"	: "tithe"
};

log.info("icon_cosma.js LOADED");

// generated ok 2012-12-06 17:08:16 by martlume
