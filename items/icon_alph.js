//#include include/icon.js, include/takeable.js, include/npc_conversation.js

var label = "Icon of Alph";
var version = "1354842322";
var name_single = "Icon of Alph";
var name_plural = "Icons of Alph";
var article = "an";
var description = "Containing the combined power of eleven already powerful emblems, this Icon of Alph can confer many blessings upon those who show it appropriate adoration.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["icon_alph", "icon_base", "takeable"];
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

function conversation_canoffer_icon_alph_1(pc){ // defined by conversation auto-builder for "icon_alph_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_icon_alph_1(pc, msg, replay){ // defined by conversation auto-builder for "icon_alph_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_alph_1";
	var conversation_title = "Voices of the Giants";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	if (!msg.choice){
		choices['0']['icon_alph_1-0-2'] = {txt: "What?", value: 'icon_alph_1-0-2'};
		this.conversation_start(pc, "*Click* ... Welcome to the Icon of Alph. Please enter your request after the tone.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_alph_1', msg.choice);
	}

	if (msg.choice == "icon_alph_1-0-2"){
		choices['1']['icon_alph_1-1-2'] = {txt: "What request?", value: 'icon_alph_1-1-2'};
		this.conversation_reply(pc, msg, "I’m sorry, we could not recognise your request. Please re... re... Please repeat your request after the tone.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_alph_1', msg.choice);
	}

	if (msg.choice == "icon_alph_1-1-2"){
		choices['2']['icon_alph_1-2-2'] = {txt: "Um...", value: 'icon_alph_1-2-2'};
		this.conversation_reply(pc, msg, "Your request has been accepted, and will be passed along to Alph.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_alph_1', msg.choice);
	}

	if (msg.choice == "icon_alph_1-2-2"){
		choices['3']['icon_alph_1-3-2'] = {txt: "Ok?", value: 'icon_alph_1-3-2'};
		this.conversation_reply(pc, msg, "Please note, due to overwhelming volume of devotion, there may be some delay in fulfilling your request.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_alph_1', msg.choice);
	}

	if (msg.choice == "icon_alph_1-3-2"){
		choices['4']['icon_alph_1-4-2'] = {txt: "Oh?", value: 'icon_alph_1-4-2'};
		this.conversation_reply(pc, msg, "In the meantime, please be assured that ever since the first appearance of a rook, Alph has been hard at work imagining the precise combination of elements that would lead to ultimate rook explodification.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_alph_1', msg.choice);
	}

	if (msg.choice == "icon_alph_1-4-2"){
		choices['5']['icon_alph_1-5-2'] = {txt: "Hello? Oh.", value: 'icon_alph_1-5-2'};
		this.conversation_reply(pc, msg, "And as soon as Alph has imagined the correct combination, his loyal followers will be the first to... Thank you for ... *click*.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_alph_1', msg.choice);
	}

	if ((msg.choice == "icon_alph_1-5-2") && (!replay)){
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

	if (msg.choice == "icon_alph_1-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"icon_alph_1",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Icons placed on the ground have a chance of bestowing blessings when you walk past."]);

	// automatically generated source information...
	out.push([2, "You can make this by combining eleven <a href=\"\/items\/582\/\" glitch=\"item|emblem_alph\">Emblems of Alph<\/a>."]);
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
		'position': {"x":-45,"y":-115,"w":92,"h":103},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALyklEQVR42s2Y61Obd3bH86Kddqbd\nJbPZJOsYDOYmIQlx0RUMCAlxR0hI4iZA3K\/ifhUgLHMxNviC7RhfcbA3ThzHSbbZJnbW2cbZzWWd\n7qTZzmy7205n\/KYv+q5\/wqfnUaYv2jedQWkbzZzhAQn4PN\/fOed7zvPcc9\/h6+8+DCXf2Sh2P9xr\n6Hzu+\/Z6+7Qz4eEtH5fDJm6t2Xh4s+HJ9wrw1gnrvgJ3cjSHkSYVkT79s7sbhcnfA+UMCZfDxidr\nI3rCPVpaqtPpcqdzfDCbC3OGf39t1fr\/d9w3Vky27cm8Z8t9OoZFNXeFhnJnPkVmNW57MjNBDacn\ncrkwa9xRbuT\/DEw5uhsr5v2dWQPLfdkE6rJw15jwuu3YSyxo1Smo0g9TbdcIuJrNsVwuLxj\/99W8\nvmBIuLNujb4q\/0xRrbkqDW+NkfaWCgy56TTU2\/HUlaJRJ1FcaKC6ohBboZba0vRYXm5N5LG\/WvDN\na6sFtu8E6NFNT\/Sb94PRL+75o\/e27M9EsWcrAzp6JMdc5dk0NhQRaHTQ3lqBxagi0FzJiy\/9CF1W\nCvm5aSQd+oGA6uQ9NZa8o9SWJLHQrWFzPI93dpzffH6veeerdwPRvdWygym70JPz7GqkgLWQgfku\nDVMdWdSXJhPw20S1ctqanbQ1ldHis5GWnEBq4iEqrRoqTFkUFeTRIEdeVW6htCSPYwV6LCYtpeZk\nuuUGh5syOTVh4vycmaEm9f6BAC8sWJ\/cPVXK2WkD\/T413iodna1OBns99ARr6Oqokms3fd11knsG\nagWuo6GSEn0aL7\/wPF6Pg\/IyI47SfOw2I4XWHIz5GvKyj9JRr2KxV8dfXSpnOqiLHghwfdTw5Hq0\niDe3Sjm\/6KDVe4xQv4fQkI+RwQYBq2V0yM+gAD7\/F3+GISOJsVCQiYkRCnXJFFm0eOpt1FQUUGY3\nU1SYg9moxWJQszFh4cE5B\/e2HQz41QcD3Jm3RifaNESGTAz31jPUWc34sI\/QgIfxUCOhQS\/eimOk\nvpSAJvkQHf5KJgUwNNiOUXWYH\/z5n2LWZJLwl39ChdMqKhsxGTQY8rJwFqtZG8km3Ktne8p0sKJx\nmF+JDvkziY4WCKCLuYkWiTamQn6WZgVkpBWr5gibqxGctkKmhtuZH+\/H63Iy3NOCLjMFTephXnwh\ngbqKIpwOKyXFRql4tQBmsh7SU249jN30k4MDdtWnszBQQGQ+yPxkCzNjjSzPBSkzZNDvreDs5nE2\n1sJsnYqwtXmClcgE0cgsk5ODjI8MEGxv5JAonJ2eSHVlIVaz5GBuJuUlalYG9NQUJcUHGKhJY7bX\nHINbnu9idWWA8Q4\/\/VIAblsey4vjhLr8BFscnD8d4WR0ipXlSVq8VQwNBRge6qSk0IjTqseky6T4\nWK4ccxblxSqWpMk3OJIPDlhhFQXdGcz0mJkc8RCZa6eiIIvbt29y5\/Z1Zib7WY9O4pNK3V4fJTza\nwwkBjkYmsUlfHBXArmAjJsm5zs42fD639EeNqKilsjQrZoVBV\/rBAb2OlOh4IIvISCEnj\/exsz3F\nQqeXd+7fpauuBH9RHvNj7ZxaHUeT\/hK7W2Gy05LITT8ivdGBJUcgR7pwmLOlwo+gT0skI+VwTEWr\nSSXDhY5uTwYHdpKaosTotNzlSqhQILqZ7WrkxFAbu6+epipPxYUzC+xejLK\/t8vSRA8\/3X+VKpNe\nFNHQXFNEvlRsJDJP30A7QwJqysnClJVGRtLLUigZrA7n0NsQB2Cp+SedC926GGBHtYXjfU0M+Z28\nfmuLYHMVd2+f4czaKG\/d22d3O8L+jTN4HLkEqksI1paRm6dmfXWZ8MwoLa6ymAUatWkYBVJzNJHo\noD7mKgcGVHJDmfE2pkokob1MNlUSnevh7k\/PEAn3SbFU4LRk8PP373NuK0LAmUtEqnxpLEif2FyB\nJYez2ydp8tgozs\/EXVuKu9pGgV5FjjT1tZEcOuvT4gNckqnlzIKdhR434U4PP3uwK4pdZHN5gLf2\nz\/Lg3h6ffPwBr+2d4dEHb3P1+Iwo3sLOueMEfNXsnF1nbryPtnYXzb4qfB67NO80dKmvcEqGhn5v\nRnyAi71adpbLmGiu4ESfnw\/fu8br+9vcuXaCyGwfD16\/wkDQy+3r69y+scHHj+5z741dpkPt+GsL\n6WnzSd8cw16UI8NFJYdfThCXSSFPlczWZB5zndoncQEqrWBnySnq1RPucPHOnbPsXz\/Fz+5f4P37\n17i8E5Wq3uPm1SgXN2e4thNmWrz6+FQnpzcXJJYJtrqpqyqMtR2HDBUKoD7tMBuhHDrq0uIDnGzL\nYnveLmNRryjoY6nfL17cxNMvfsnffPwOTz\/\/pVw\/5qunv2bvWpRzG7OMDXhZjQxw5fIpbly9xNbW\nOqsnlpifHZcGbaAkTyOFkhoDlKE3PsBB8eLN6VJOT3aw2FbDqeEWHj\/c41ePX2f3QoR\/+sff8vuv\nP+Prp5\/y5ms7ouYVUTXMtYtr7O6e5tb1V7l86SzVZRYmpXhqxYtLDVqs2SnxK9hgT7QpfeqkAEaC\nLvymDLZG25iXkevzxzeZHHbx93\/7kHevrLM23cmzf\/4DT35xj10B\/PUnD9m7skab0xIrlNnJdgY6\n\/TjyVTKKpVNmShcvzlY2wIMDbo5l2\/q9mcx2atkaC7Az1cXl2R6uzPayFe7m6a\/u8p5U9VeP93iw\nd4J\/+9d\/wSN7yKXtNR69\/wb3757CfUxLT0cZ\/d0ufDIT2qXBV8m0XWbOiFld3IChZnVsczs\/08bW\nSCNXwgPciIzI8jPBtsAO1Bbz5KN9fvv0Ib\/\/3W8EsIiTkRk+\/fRD3ry9w6VzYXpaKulxOai1ZOOW\nIy6TI3ZaMtkYzaWtNi2+JxDKESueeWW5l9NDTVyU6rwmkFcXB+msMjPurpR8vMNXX34ggJ8z3R9g\n+8QcX372keTiCuvLg2jEn5vsJirz1VRbdbhLzDiM6bHlqbU6TkClSJTdYbG9nK1QKxsyRa8PNNBd\nYWWl2Y1WdYieVpdU8i\/44z98JvZ3gd1Lx6V5vycefY4h8eEimWZUSS\/S5CygvigXs7hISW5y\/Dmo\nvCYCapYEcGO4gbOjAa4t9smx2uiQUf9kRxsLngpypK+1ekr5+ds3+Po3b\/HX7+7wxv45jrzyAod\/\n\/EOJBNzWXIp1KsplJ3HbTKJgKscHdUx3aHfiAlzo1ooPa7kUDtJWZma5pYGwKDdSWcqcv4rExAT5\nvpbu1mq+ePIenzx6iz\/+4Xd89MEbZMm43+g4RqDIRI0hh4o8LWV6jVRxJj6nCmXHlvSJxgU41qqS\nfqWn32VgtqGGBX9tLCZlvRxy2WPAkUY3C0310hO\/5N27l\/jmy8eyYLmplKGgp9JB4zEjHms+NcYc\nSrOlzajT5bgzYgqONGXGBxhqUaE8uZptshFurGepWSbrVi+RJlk\/65yiYg1LYmXTAlyVl0nykR9T\nqj9KpS2XwQqZYkStJlHQbcml2qDHmaulQJUmK4M2BhisS43G5STttakyWGazHChlxlsjirmZ81bH\nvs77amLAi02umKr9NaXo05MEug5N0vP4ZQ8p12bgMuppKDAKoOzFUtH6I4foc2XFjjhuwJaqo0SH\nsqWKC2KACtxScz3Rdh+rsm\/8J+CMp5J5dy1HUw5JEdkZqLbTX1VCu62ASvFetyWfBquJvJRXMGce\nZSqgRcnvttrUnbgAA9XfVttYo5lZX20MSIlwYx0TdWXfqtrowikWlpWRSFLijwjVl8vxO+h0FOAX\n12gtsVInq0Blvo4yWZrM6ckymWdJBWtoLE+Jb1hoqzmKsjhNtCpFUiUKKkXiikEqRRMsNjEhas14\nqklJfAGLLoPWIgMtx5TIp1muGwtNeCVqTNlY1alYValMyJSkPIyKG9BjPxL7Y1FRUcnFrYlcTo\/\/\n11B+roRSTP\/9PSWUB527iyYuLZg4L9fKwj4l6ikm8J0AKouN5AoDfhWhFnUMWDH6ua5vQ9lblA1t\nPfRtnBSPjfTrYkOG8jkFRgnl94YbVTEwZdT3OVP+R8D\/AB3xSpzGpRp8AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/icon_alph-1334255001.swf",
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

log.info("icon_alph.js LOADED");

// generated ok 2012-12-06 17:05:22 by martlume
