//#include include/food.js, include/takeable.js

var label = "Cedar Plank Salmon";
var version = "1354595570";
var name_single = "Cedar Plank Salmon";
var name_plural = "Cedar Plank Salmons";
var article = "a";
var description = "A wild salmon cooked on a wild cedar plank.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 70;
var input_for = [];
var parent_classes = ["cedar_plank_salmon", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !pc.skills_has("grilling_1")) out.push([2, "You need to learn <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> to use a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && pc.skills_has("grilling_1") && !pc.making_recipe_is_known("27")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a> a bit more."]);
	return out;
}

var tags = [
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-27,"y":-24,"w":54,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIE0lEQVR42u2XeVCU9xnH+SNhlz1Y\nQKMhSkgIVpNBDEVrTBNtCId4ISDXciwKLLewAnKzLCDhiIAi3kfMoYlt7HQ6k2lNU5qkJGmxaiYh\npB6hZAXkWJdll+VSv31+77JUEiUmMZrp8Jv5zvub3Z19P\/N9nuf7e18Li+k1vabXvVvAoUVajVzZ\npY6q7+6Ibzz\/WdT+3iuqd4BoKXDQ8f7C6bNW6LQFuNKZfKrrckFTT6eqcXS0QD1oSD6t6XbN0veX\ndBBk2n0D\/Lpmhp\/6jwKt4Us3jHwtxfBXUgydj8GoOo72wYNjHR7n+v+9Xg0c8LsnQKff3Sdpem+X\noz73sRUGlUvb8MvLcO1EJHQHfXGhXIQvDlthoOVZ9P3pCQx0BGKkeRmMfTm4\/mlW23CFexqynSQ\/\nQY8ddBwb21Xb0yU9NaJb9VtDnxIDf\/eATp0OdNUCJ8IxWvNrDOQ6ob\/AGf+pdkL7Ww\/g6umnMdb6\nPIbagzFw3BXDVb+CLvdxraFogewuwlUs0vQqtJreiHP9mshzw2efVQ+0puH6l74Y6NuIngthGGmR\nA0f9YNzmxkEalE9CV+mGf+Xx0Vxlwemr7IegL5zPfcc0WLrwyF2A2ycZMlZo+6+GX9T0rDuhvSLr\n02oKMGKoQ0d7EQzvvgDjiZnQf+CC0Y8SMbbzNxwEg2RuDeQ7c3szONOV7HnoyjJdddmP\/bjhMQ5m\nNna0r1X3tLp\/bDy\/Dv2XZdC3+MB4zh\/9bRHQfO6Pgd4cjF0txDVDLQZVBFr3vAmG4MxgDOiTKDt8\nEG4zoaYIW7yR6PLxgfSnlNXx8\/3kcrnE2dmZ9\/0AjYVt+v7Qk4buxD4NQY29\/xxutMdg5B\/L0NPk\nDt0XMgz9dR4Ml+NwY2wnB8MAzS5ezpmP80n2+Fw+axLcO1I7bI9wQmG4A15JkuBAvAQ1UdYoCBR3\npawUNqavFtbeEaD2fYu0oTMWGG51wMglavjOdZyMF1\/AQNNiDGpKMHYxHMPN3hhSh6A3x4FzrqfI\nZZJj5v1fpLZoCLFHRqQLckIcsD1KhBqZNSojxHhJKkYlqTxMjMw1fEwJ1tjY+EBD\/MzMlrx52p7y\np6DbPR99bz+Djv2OaKm2xKVjFmDgumYHDnhU7cl91lnwKNRpcye5xcQcfC3KAXkRC5AV9AhSV\/Kh\n3CDEq8kSvJ4iwZ4Ya1SFi1ESIsKW1Xwke\/NuD7hN7m6\/N37WJx9mPIyR6qVcfFw\/GgD8WYFRGgLm\nUHv2bHyaL5iYUKZ\/5llCr1rI9dbNcMyxvOinkSN1wmYCy1rLxyuJEhxKkKB+kzW5yCRGBQGy7xhc\nsveDt46hmkjJ4gNyW\/XbyXbQVy3F2I7luLbHCzdOKTBStxw39vpwYjHBeuxqjiO6yxagI3cut29N\nmD0Jrip4DvJjlyAzcDYHVxoixC5yqyFWgn1yaw5yL+13RFtPOHdbuIAl\/OV5AWJ9Q7QEvRQRwxWL\nSe4YbvCEofyXEzHBJvP6bq9J0WEsdUWnwmES3M4wB2zL8EXmOjEK\/K1wLFWCk1ts8TuFLY5vtsFh\ncnG\/XIKGTeNwXpba28LFePCXq4LE+ipq0o9S7dGf+wS6MxwmyQxjjhBWegbGnR758yYNxbHQh0xw\n5FwG3XwvucWmlUEdJNfY\/tVkgqT91rUmuBTvBxfdEi7FW+CbslKg37JGiHqpDS4lUX9tsv2WWmJn\n4ELiLGi2Ok6AcscbwfZlOU7A\/SFsBlSJzyEr7BeQe\/BRGCjE7lhr7Ikjx+JZpFhjb5w16jdac\/BT\nwilWC2VFgSKUBItQGCDC4Qi7W8LdrM9i7NClmMsBsrzrL3HFpeRHJmLkpTh3FMcvgWIVH3UyMQGK\nkOhphUJ\/EXZQpBwlF99ItUGun9XUcKpAYVruehEoFKlPhGD749EzvxPQLOY0g2SlbY6egTNxs1EW\n7QJVwlIuRrIJgJWS9dsu6rNSihDFagHkL1pxzk4Jx1ZxgKCNIFE67l62nxB5fiL8TWZzx5CsNxkg\nc65U5oL86IVI96UooaDduVGMOprOlylG2JTupuktDxXTfQjSg9c2JZwJUAizyoJEUG0QgZW7LHgm\nDsW74rXwh\/GebGpH22mgzmyaCVWII3JCHTi4NNKOaDFXRjYIbF9KYPn031vXCaYO4UklXm+VVuwv\nbLwZtNBfSDexQoKPCDmU+rkb3aCQPontMS6oC52DkzJ7NMaa9KF8DppTHFEf\/iiyQh\/nysqOqMMJ\n5BgLYOo35uJOGoY62uetN8EleVme\/V4PBCp\/\/goq95EJSPqjhBd5nJK8eFzAKtZQaULmQhnjCmXC\nM5yKE5dxKox1Izj2Ox6qIkRoiGGRYoN9NLXshFAF0wkx7hyXdR4WP+wlqiyA78iB+gu1CipToieP\nU8L4NYlukObLQ4qPSQxoC02qYhV9Tvt6covFCXOsKpJEDwC11H+VUhFSfXjfPRR3uiqCLCQEqty6\nxkqb7MWbAGViLqT7mq7J46AMWhkowJs0rceo714fD2B2QlQTpOn4muII+3GgwtrstQLtZp\/\/OZrE\nQBm4l+nGDLKMzljukYkOfAZVSdd6mlxV0HjfeVsqf7K3uPHSK4uo9Bmr+PimqzkUG9WRYq6kFdzz\nHKUBJQIDHx+KI\/fkdZM5ap58BmoGzFxthYpQevAkwF3Uf7UEW7zhB07s3Vol\/sJFBX6C32cRXB5N\nqDkBlBRTLAfNcHJPC4nF\/Vym8gtri\/0FbWZIFtY\/C7hv56lQRqBnFb68nx\/c9Jpe\/4\/rv4upLQbY\nl9KdAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cedar_plank_salmon-1334190358.swf",
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
	"food",
	"foodbonus"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("cedar_plank_salmon.js LOADED");

// generated ok 2012-12-03 20:32:50 by martlume
