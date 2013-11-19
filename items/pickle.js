//#include include/food.js, include/takeable.js

var label = "Pickle";
var version = "1354588325";
var name_single = "Pickle";
var name_plural = "Pickles";
var article = "a";
var description = "A seriously crunchy pickle.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 21;
var input_for = [11,100];
var parent_classes = ["pickle", "food", "takeable"];
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
	out.push([2, "This can be made with an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && !pc.skills_has("masterchef_1")) out.push([2, "You need to learn <a href=\"\/skills\/47\/\" glitch=\"skill|masterchef_1\">Master Chef I<\/a> to use an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-12,"w":29,"h":12},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJFUlEQVR42u2YaVNTeRbGU9wEIhAC\nCjQQGkQUREBAwbVtu7vmvf0NrKn5AP0RZl7Ztq3ihsqahIQkhOx7CNlJQhLCGhBlE3DspSzpaXt6\nxlnqmXMvZbVdU1NTNRB9M7fqX\/eSyosf5znPc04uj\/f\/6z9f8zMi6dyUyL8wK\/Iv0llKi\/yP06LL\n7x0snc67PJXKW5+bycfivAhrKwXY2ijEs8392Fzfj5VFsXF1lSd+L3AzM3nSVCofc7MElxZhaVFE\ncGK8fFGIH384gFd\/qsCL7yqwulQofedwiVSudNSVA4tegFhkHxYI8PEjEZ5tFBFcIX76UYK\/\/HQY\nr39uxMvva7C+XHjxncHFk3mdLmc2jDo+7CY+ouEdwMUFESfti+9L8POrgxzc3\/\/agdd\/7sDm6gf+\ndwIXjed+7vHkQD\/Ch8XAh8smQCqVhzQBspBPHovxfKsEr36oJsBm\/OP1WfzzbxewsVqKjMNNTvLE\nkWDJ9sazNljMObCZBUgmczlAH0GPB3cqufy4EN9slVH\/VZO8tXj5XS31YVHmAYMR4R+iAQkSyUpY\nTAJ4CSo5mctV0WXN5k4ynstBLi0UYGOtBM+elmGF4JbSBZkFtNl4RVZH9rbZnAujkc8BTk7lweUQ\nwGn5BTAcEGN1rQHr601IxHIxQ9V9RHAZBxzSML9Va\/gYIWOYjAKMeXMQDAlhJ5kdBDhq30dAdVhe\n\/hTffPsbip1WDjhGBkrF8xAYy9nOKKByiD+jIkCDQUAVFCAYFsJKYGwfjgersDB\/HkuPPsHK8kVs\nbn2MyXgDB8g6nIV0WQSZc7FUwf9EqeZjmJyrJ0CLVYBQRAibRYjUZCsWFy\/i0eLHVLXzeLrBgp7C\ndKqB5C7iAEN+IdsGnRkDlA\/x\/SygVrcDSGaBz1+ExUdn8GjpAuXfBaTnz9L9NNafnqbnJvzxW8q+\nZycQpz70unPgtfOqM1Q95nO5ig+VlvqPpoaNAjo5W4yJSDPSs\/UcyMZWB+bnO7Cy1oGpZCPc+iI8\nWWlEYqKMczXJm5lR1ynlFUqVzPYgVU+jE0BHvTe1UIb5xY8wmWhHxHcQ65ssWDvSC21YetLK9R5r\nFtY0EZLXT+bweDK0LPTIGbN0iI+hkR3A5GwVnqx\/itn5C5iePYup6VMU0iepD1sIroWqdRTx6BEE\nvaVw27O5EM9Y73X1M7\/rV\/IxOEzyjlCM+CVYf\/4ZZsitqZnTlIEdFNJtSCSaMZemzEvU0dJwCJHQ\nh+TeHERpgQgFhRi18Pd+SXggy7rdq2AgJWmVWsq5sSosb1LlFs4jOX0aiVQ7JhKtiMUJLHmUYOtI\nzhqECW7MWYAAuTZB1fM4MlC9B\/IsWfcggwEVg0GC84YbMEMRMr90DvHUKUwkTyIab0Ek1ohI9CjB\nHqFKHUQwUInxcAVBihGN7WMz0LinYN1anrhLxvgfyBn0DRHcSA48IarO3HnMLp1BLNmBaKIN4xPN\nCEcbKAfrMDl7GIFAFXw+CeYXdhz9eLkO7r2u3L0+XvVdWdZ6F8H1KBnItDTG4ieRnD+HhbWziCTb\nKfuaEYo10f0oAuEjSKVrKQtJUm8FPM5iDm7r+QkyRunv9xTuTj+v5bY0a\/0uwXUTnMIghn+iDanF\ns5hfOYXxxAmqZAO8yXpEppvgC9ViavEQ3Svh9pTB7S6GWUdjTyNkzbG3kXJzgHfp1kDW9l3quQck\n64A2D+MzxzH1+BRm6AQmWuGLNHF96ArXIjJDppilfotVwun+AA7XAZjM+2Bm53GC+s7FXNoTsKtU\ntet9jLFTyuAuufU+ZZ3GVg5v7CRi6WZMzJ2AL9qCsfFGeIL1cAeOwOWrQSRVTUcCm6sUNsd+GExC\nbnnw0+hzjWbvblpc6eFdvNLDGK\/1MttfDzDoJEnvKPi4R1mnspYjNHkG8XQHgpRtY9RvbpLVFaiD\nw3cIdm81wX5I4BJYqN9MtkKaKkLoCM5Fa5dlN6PsajdPzIJ92cvgah9JqcyFwl+FW4N8DtDorUN4\n6jRicyfhibbCHW6CM3gUDv8R2Lw1sHooeGmLjkxXwOQ8AIOlEMP6HALMwWiwCBZ77i7genmXrvRm\nbbNw10jO63I+bsioatp8PNQWYGyig3qOqpY6Aff4cTiCx2D318Pqq4XZUw2TWwJPpBz+RCl01iJo\nzSKoddlQaQRILLUgtdy2PbXW9r9tKV\/2ZElZsK\/6d8DePhp3LcbiZxCabocj0ARrqBG2QAMsvjqY\nxg7BMFoFI8F5k+VwR0oITAy1MZ+bKlpaUvWmbLi9VZ0E17IruGsDv4br1u2HI9KO0YnTcJMh7OEW\nqkgpzLMtMAXrCKwGOteHBFmOwHQ5jJ4DUJkKoNQLuamid2RDQxuNSsdc3pWsLNx16S9gfYZSjHjq\n4YmfhSvWAfv4CViDx2HyH4PWXgVTsgkjYzXQOiUw+8swliyFmnpNYRBBThNFRguD3iWAUsee3cCR\nIa6SS\/tVBRgeP8zBGf0UrsmPMEqSOqPtsIXbYAo0w+BrgM5ThxH3IWicVVDbJbBHymAOFGPQKIZM\nn49+TTbkelpUnQLICVI+zOzubdWVPubyjX4+FM4KqCOH0TVcQH10Du6JUyRbPcwpkpKCV+eth3b0\nMDSug1DZK+m5HNbxUgyREaT6AgKWwJBsgNqRAwX9xOxX86cVGl7LrgOYjZOvZRS8OjHukFNlFglc\n0R1Jhw0S6EKHoR8\/xplE6ajGsEeCEW8Z\/V2MAX0h+kZE6NbkoI9m8ZBLjH4ts92nyfpiz0YXC\/i2\nKeTWSpK0lZNU722A1nMEalcNFNR3KncFZOZS6s8D6KV\/6IF6H7qUAm6qdNMe+JB+KLEbzp4O\/qs9\nWV+8yTv2SM3kRH8jdCTvMEmqch7EoK2S+7zPWIKHI4W4p87FbYUA3Ww26vIJko\/7Sn5m1nTOJP3M\n9hvAHn0x5161a0dSuVUCBY21XqrcLaUQN+g7N2misFOlS5O73WsqlN5X8TP7Ho9dBN6Ec7c6H4ZE\nIx5Qpe7S8w25ADJFPpd7Q6Ea3CJZb8qYbYLs3HM5\/5ubv6KQfigXwpg49quwvkmjrmuYpCS3Xpcx\nRoJ7d28+376uDfAukqOl12V8\/7+f9wP2L\/UD59gIfhNKAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/pickle-1334213287.swf",
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
	"food"
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

log.info("pickle.js LOADED");

// generated ok 2012-12-03 18:32:05 by martlume
