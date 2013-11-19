//#include include/food.js, include/takeable.js

var label = "King of Condiments";
var version = "1354649271";
var name_single = "King of Condiments";
var name_plural = "Kings of Condiments";
var article = "a";
var description = "Otherwise known as the blandest rub in all of Ur. Meh.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 20;
var input_for = [7,10,45,345];
var parent_classes = ["kings_of_condiments", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.1"	// defined by food (overridden by kings_of_condiments)
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	return out;
}

var tags = [
	"newfood",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-22,"w":1,"h":1},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIp0lEQVR42sWY2VOTaRbGvZ4b\/4T5\nB6ZqLrzoS6fHrVlFtrCFQAJhJxBkDSFgS0C2gOgIaAsi0ILYLJEgEojIjkAhIKNDqzUjiiUKWtZU\n19RcnDnPi18q0GEJ7cxQ9RTJly\/v9zvnPOe835dDhxz+bty4oWhoaLBBfX19tu7ubtPQ0JDhyZMn\n0OmlpaWj0KH\/119RUZGBRc5UWlpKdXV1Qrdu3aI7d+4QB0AIBJqZmbF9CURICub58+eH\/yeA+1Vl\nZaU9EAQB9ff308DAwMuxsTHbwsJCx4GD+C2AeXl5pFKphHQ63a7nOlZjexBdXV22iooK01cH1Gq1\nJJPJhAB50HU0Gg3WsH11wPPnz5NcLheAarWafmOgOwLWm0wmqqmpscuVxQsKCkR58f+ggPj+boC2\n1tZWmp6ediqbzUb3798XslgshHMlXbt2zR4UgvyvA46OjlJPTw\/19vYKoMHBQafiOUncnTsGBUlB\nQRhNUlDNzc1bqoXm2RMQJ2LRqakpslqtdjiAdnZ27ijuPnHOToFIQuA7BYJrYxoEBgZu7AnoTFhc\nutDw8LB4DyEQs9m8BRjZh5wFg0AcJVVA8jwabUdApFlKOXzl6DPHUjkLABfaniEE4giPTOP7UmA4\nJn0HJd8V0Gg0Kr6MGsjmoF2N7egjx4DQSFJAGMTwq7OgJiYmxGt8Z1dA6W9lZUXBskl69epV\/evX\nrw3Ly8tGLu913nuNjY2Nxtra2utQeXl5mxQMB7mxV0DV1dX2gPjGxB6QVGLM070AbQxEq6urOwqf\n83lOxQG9xBrj4+Oz0MjIiKWlpWUQYqBx3q\/\/ytvZbElJyaqzALAT7Qm4trZGnz9\/3pc+fvxIGxsb\nQu\/fvyd8F3r37p09oDdv3mwJ4unTp5Sfny\/EXjfzTvR7zv5RKDIycvdbOmQAF9oP3Mb6Oq384+9C\nu5336dMn+vDhg4AG7KNHj+yA9fX15S7ddiFCZGM\/gKM2Kz3suyu0xhffAs9rvH371qkd2Md2wJs3\nb0buG259ff0wFkDE+wEc7L1Lw32benC\/lyZHHtD87PQWSGRtOyB2lAMBsl+OYoG9wF5xSUcG+mik\n30ITg300PdRPNku3yKT1btevrcCgjj7k7rcDzs3NnXIJEKZ2BvWw\/x4N3eNM3TPT45lp8X\/MamE4\nqwAEWP\/dThqwmO3NA99hve0ZdARE1fYNyA2i2QnQ1rvptSEG67rVRBcLDXQhN4NyEqMoL1lN57Rx\npA33pwyljK6YSun7zBRWKk1NjP0KUIKDXGoQDGRnIwbdOjc1SZX5mVSeGU\/l6bGUqQqiEK8TpPJ1\np6SQM5QfL6f0yEBKDvOlCJ\/vKD7IW7wuK9DRwuM5O9yLFy\/scMikqx1skgDfrr6hZ4vz9GxpkYat\n96jeZKTyjERWLF3MTmAYGQV7nqCEYB\/KYDB9bBgZNUqKk3lTKmcS4ADWqUOpprzIDug4Yi5duvTJ\nVUAbfAPAyeEH9KDXLMwPb6G8gz1dZGlvofaGq5SriaOEsABKU\/hTQXw4VeckUdnZGJG5pNAzpPR1\noxS5nyh5yw81dkDcHEiAV65cWXUJsK3+6nLv7UaaHntI1p5uYfwBQHW2U09HO\/3U2kxNtRfpoiFN\nZEfl507Job50VhFA3ydGkC46RACmKwM5s6cpkUsfx+9rK0tpaWGensw\/3jJieA\/+2SVAgzbhF2Rq\nzMp30uYOkbmOlkaqLismY7aWfRdCMYFe3Ax+lMclhVDSYM\/jFB3gQbH8GlnLYdC0iACKPOMmAoAN\nUiKC2KcKumA8v2WbcwlwgDt1ZmJUjJSrxQYqSYvhRcMpgi8UHeBJ8ZwVlLREG02XdElUlRUvGgRe\nhO8M3CiZKhllMWA4N4qSfYiA8BmE0idER9oB29raWlwClEbM49kZyo+TU05UMGXwBbE4ADXclQUJ\n4aIpilJUVMhNEeJ5UmQKDXI5N1kck7kfo0C3P9OZk38SkNnRwZTNaxVmpVKBwWAH5BtYvUuA0p2I\nhf1Wpk+nzOhQSouWC0B4CuMjikHlp08Jb+GYzP24yOC5RIXIrCEuTGQKpQ1gSMDDlyg\/ZqLjDHR5\nmwMcNvdMdZgoF6IO4YuHeZ8UM8\/\/u28p1OskKbk5UG74TcHQAEXTJLLX5HxuQoiPaBBkMsrfQ2Q+\nPug0FRt0FBboRzGRctLn5hLfL37jEqC0seuSYthrASILKGlpmlr8R7Zgfn1MqMgKyhfscUwAIphU\nbh7fU98KhXEg2FkAjoz78TG5jxvJfDwpkJWm1ZKr\/js6OTJEdWWF9JdSI6UoNyEKkyPpLEMVs+eQ\nPWQGHsTMw46CLOIYSohsojn8ONNy71Ni3GBQa6PDKTVeTQlKOfl7e5CflztpkhL\/7TIgRomOs4Px\ngdIo2T8pXB5kAUaPlXkJZfE2V5ERR5XcxdjyUD7MRGQMXkSW4Us0FsZQepyKcuKVlBGrpJzsbOG\/\nqqqqNZcBG2ovi\/0TTZHLkRenqkQGQ9lX8BH2WwADHlnN5F0CxxPZc0Eex0UW0\/l4UWqU2EFiOJhN\n354Q60bJfEit3BwzJpNpxWVAsVdyp5nvtNK5BIW9lKX6DNIogkjDnrzAnVrFezG6FQMYc1CadwrO\neKDbMQENT6LZUNqclARS8+fK4ABK1SQLQH5oGncJcH5+3n12dta+Z\/74Qy1dNurpx9oqmp4YF8fq\nKop5lKjFgEbTAAoCJN5nKoPIysO+ramB2ptvbLmL2X4fyI+rVS4BFhcXHzabzS87OjrwIIMpL54d\nJicnaXFxUVwAF+xubaKOpus0MzUhji3\/7RmVn8sVHVyalUwvfl7e8ZFUAtTr9f\/Kycn5w4F+q+aF\n\/oj7Qn6eXQAgYPGTGoTXCADHkW0I93c7ATkK5+Kh\/Uv2mr7aj+sAhj\/7+\/uVFovlp9u3bw\/yXcgq\nP4RvQDU1Nb9IAewlfv79p0aj6Txy5Mjv9nPt\/wDWAyoHrXwXEwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/kings_of_condiments-1353119686.swf",
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
	"newfood",
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

log.info("kings_of_condiments.js LOADED");

// generated ok 2012-12-04 11:27:51 by martlume
