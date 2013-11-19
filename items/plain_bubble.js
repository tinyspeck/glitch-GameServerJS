//#include include/food.js, include/takeable.js

var label = "Plain Bubble";
var version = "1354588331";
var name_single = "Plain Bubble";
var name_plural = "Plain Bubbles";
var article = "a";
var description = "A common, ordinary, plain bubble harvested from  <a href=\"\/items\/258\/\" glitch=\"item|trant_bubble\">Bubble Tree<\/a>.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 250;
var base_cost = 2;
var input_for = [48,61,62,105,106,107,178];
var parent_classes = ["plain_bubble", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "bubbles",	// defined by takeable (overridden by plain_bubble)
	"energy_factor"	: "1"	// defined by food
};

var instancePropsDef = {};

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

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
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
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.food_eat(pc, msg);
	}
};

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.tune = { // defined by plain_bubble
	"name"				: "tune",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "With a Bubble Tuner",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.items_find_working_tool('bubble_tuner')) return {state:'disabled', reason: "You could tune this with a working Bubble Tuner."};

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var tool = pc.items_find_working_tool('bubble_tuner');
		return tool.verbs['activate'].handler.call(tool, pc, msg);
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be turned into other kinds of bubbles using a <a href=\"\/items\/263\/\" glitch=\"item|bubble_tuner\">Bubble Tuner<\/a>."]);
	return out;
}

var tags = [
	"bubble",
	"basic_resource",
	"trantproduct"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-17,"w":18,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFRklEQVR42s2YO3PbRhCAWbt3rzpV\nGvdp3KdOld+RJpWbNOnduEqTxo0rN2kyE8aSY9GWZFGhnpRIU+L7DYIKch9wCyyPAEgxtCeY2REF\n3N1+t3u3t3uFwgZPEASPvPn824l\/\/2N\/Ovtl6PmHacI32tCWPoXP\/Rgl34xm\/vPacHJ90uoH+5\/a\nwW6tGfxxfZcqfKMNbelDX8b4HGBPmmPvlVE0zANaJfRlDMZizG2APepMvGdnnUHnz5u7jcFcYSzG\nZOyNXW86Pmamf9VbmYqKVtmbm2awi9SsmN+8WzUpxrbWfPxguMZgcpClgPd7BgQF74ywzkpK9q3w\n7W2tFULnjYWutSExeW8y+zVtrQkYigF532gHHxqd4OC2ExyG0rUSveMbbYBlMvQtZqxNdK7l7t50\n9ly7ld8o\/XjXDZUChmIgjsy74ybSC8pGTlqR8Jt39KHNoYUVUNyf5m5058JNZvPvj+56nnSq9kaB\n+5xYxQJUafeDUyNm0S8I7\/hGG4FlglgUD+ymQKIbhizXfnXRHXakMYO7z\/z+n9hKAnWu5KIbiX5H\nmwQ0WgLvjTWzIGGAZdm1zrprjadLgI3hJFR2tgA0DC6tXPUikf8vQklA\/zYBG2tqSNfdsh6XAjEB\nVDd0n+ZougCnoVgKyHU\/kuj\/BBZQbc0EMlqT7g6HZSGQmyPohbYenfXTnXgxHBbRYADdZIjACqhr\nSdl0e7VlK8IUx7yr7vBWN8Ds45kfwn0ajMMBteVQKGA18z1PBNSFZE2ycT5YV7tWhCmMjWQaWEx\/\nZEbMjPfsVjbEJnBpkOLuxNXpVkQ3bIWx7\/+s417RxiRmxgzFerhW3PoQOA1J30u7ccSKxEk2DDqL\nTlyErWDytjeanJnyVOw6qSjrVa31siDqVrK+p1sx282wFRqj6bV+CYgxbexevfayrFfPkDwrnttg\nXrZu5pRxQw5shZve6DZt\/WF6XKDde\/0AuDzAyIqRm8s25JRU8iugsKUCEp+2AVjPdXOyDgVQNgrW\n\/F8BoksAseJerZUPuC0X13PDTboFS43E1SFgc+SdZ8VADfglNgnJA5FDWGBbCjMsUBpzDB07QZow\nkxUDV8GJe6vqRJFgfWAB963nFsIMpaAO1MSidzmB+qGnSN4OZmw57mD4eNczuttxoIatMA+C7\/ig\nrUgd4W6UdYP1uudx4t6uzdKj+lmCNUywkSzsXPVGnWw3d5cymeoGyUI1Tr2WrVcKi\/vI1XGyYJhg\nCzOagTd\/qY+ZorKimzCkQaaB6pTryoGrONaLyod+vHthgSnOB30\/eHrSGnhpVpS1KGn++VJOOFxI\nVrOT1qRWAejIWq9sPUTCkCSsAw+mhay6O\/V+cw\/rvVriag2ZpPyLqb4rl07KL5YT10rRxU4uqk0K\ny1JNMpzNvnbTfnF1SUGWbYYj1ZsulqQG0cXTmcqiteX4\/9TC6SQBBlhSK7upf\/+TnIMupLg7qoXz\nS05degKiKzomKbvYhUMHDCsui2avxNXyt6jczcY5UEW7LtiBESAp4KV4Z63JGk6DQxe6V94usLX1\nvUzRbhgOcIKnAB5al1fsuhQRl0d1sbGueSeV3Vk7Wof0L6bfz+ysez+z0536L\/UJQwiIAnd0Y4Ay\n2Si6Nl6siW2RZMEIvpKp6NQeXWvDuZdI7vVbfMVm5G29aW+3WnGCIZJ2eZR6H7PupVEWpIlIz7iO\n2PYFJmMy9lburgmarfH09+Nm3\/uvcIzBWEuBeBsPh3dv4r0+bQ+GbjjKE9rSh75hAvAFbvufeP79\nDwNv9prKi8w3TfhGG9puemn+Ly1eFyYtlt\/oAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/plain_bubble-1334269632.swf",
	admin_props	: false,
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
	"bubble",
	"basic_resource",
	"trantproduct"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"u"	: "tune"
};

log.info("plain_bubble.js LOADED");

// generated ok 2012-12-03 18:32:11 by martlume
