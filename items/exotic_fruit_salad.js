//#include include/food.js, include/takeable.js

var label = "Exotic Fruit Salad";
var version = "1347677194";
var name_single = "Exotic Fruit Salad";
var name_plural = "Exotic Fruit Salads";
var article = "an";
var description = "An enticing array of exotic fruits.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 33;
var input_for = [];
var parent_classes = ["exotic_fruit_salad", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !(pc.skills_has("ezcooking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/66\/\" glitch=\"skill|ezcooking_2\">EZ Cooking II<\/a>."]);
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
		'position': {"x":-18,"y":-29,"w":34,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIJElEQVR42u2Ye2xT1x3H71qhMFQl\nYiUUOh5tlyFWlmRlZaWlBUppKZo0\/miROq0to5P6B5rGtP0xbUKK1G5ZtY2EETo6QTB5tEAeBNKM\nQF4OcciDhCSNspCX49iOH3FsX\/v6xo8Q57vfOTe5seMQAU2q\/cGRvrJycq\/P53x\/j3MSQXg4Ho67\nD+AH6xFMLrEPLdWY+oV9Mb\/XfvfAZNVqLYoeOfzNw4VS0hBIERFMQdD7I5j7BZj6BEPUM9Wr0lC3\nAbj6OCYvCNpvBiyYvG8ymGJgYBPyRox7nwGCL8A6mKBARjiJy8vScOkxoHotULwEuCBkLh7YneQd\nk8FkLQML+zdBtq9A0LUG7Gcm0Z7KAUkl6juFQhrK1wO39gNl8Rg\/R1lRGJsKC5BrzyQExXUic8vv\nfAoB52oOOQ3HJLtUQEQBFj1KDj4JlK+CP1+AnCu0L4qDXvOyNO\/wcvhdGxAS16uA059B73YVcHhQ\nSOWApStKUPu0EuJrSZg4L0DUzGxgQYdoEHa4Bx+Bz7Yc8shT8HteQ8DzMsKB7VOAW1RA0g7KtwMo\njQfqngeatgEl8QhfEOA5u0iAbHhMCRiXt2MytCcqvLMBfdWChof2GrmnpRzUEWCBgMDnBKiZydEF\nHW69kCAOLeHhnQ2nAO5SAYOVcUDtRsq7RKB5N3eP5Z+UQ79rfULLCo7l9YMXxXj9AVI7CUyTIZ3B\nZ3szzWX4Nry2FMrDH\/MWEwkoOV+aAaxLIOeo\/zXuBEoTefX6cgW4C5dEFxf10ZDnae19VGtrwmSo\nXjsNFqkxVx4kx5sYc++ENPICfPakiGLZBpc1WQUcb\/8pAW4GiuI4nOsM6fIKhKVNvG+yLjAupcLv\neAKSZQXPSVQuT0BV4oF54SJdC3jLIY4UqoA+5wWMGD7BuG8n3\/1k8CVy9lXFidBbaqM2dwsYyY6D\nM1vgcpFzlhqBV3mk4wyUbZClDV+\/YqUGuk2soWvmBJx2bqg3C3L\/R3DVvE758h58Nz+A3PEbOPvS\nYR\/MgG\/0\/Zj8C\/neUt2zda\/i73ga34Ptxgcwdb\/K570O5VlWYBPB3QhJW6YcjIfURRVf+X0RNVRU\nJXFirHsTN\/YxOEtvJgLaV3jFhb5QkppVnpyntAdHzZ45ALfRKfK8Cuhq+yEkWx5sRg2PQlDK4vP2\noZX8SJy9ORbuYLXAcxWVKxkgcF7poxF5pzPAQ+GselZ5YFoXl3JYJlaFLJekkqXRi4TexfBAnAoo\nFSgb8rZ8iJBciXCwXGneA3Qmh9JJf1QU\/JDycCvkbgK7REV1YytVPKUPa0+RxyHGdYcVuCTwrl9D\nn01v0AvPKT9Xb+BtgiU7W5jlldy2egpwJ4Xu5Rn3mgR1QyOnBB5qv1gCqz6VnjuEuYoPnb+ian9R\n6Zc1G3nk2BEZnXvWo\/QAHfwVa5QF6FiimwhwfZMy37KXQ6pOFiku3hn7here8G0B4brvAVfW8iON\nLcQ2Y\/\/vEQI8RKEujgKTnCWQxS95GlBYgJ5f86pnJrjLIq5mUW3FnU8P\/hbhhjcQLn0c4cafQOp8\nFvauRyOPMS7r4LKZyiWF6tcqjje8qORTgZLD9qaDvLhkV1EUIINjKcA+XdZzyvzAn5RmbtmvjSqQ\nYKBZfZGFxGn+DPa+QzFQ88l6Ow7+liTl5tK0iwOynPVod3NAh\/FEFKCp\/yRvYxMBLdf0\/Lj+IPzy\nXkOTRVLysGnYq\/0otwjnvzzKv4jJpv8LLfokHKZ1PMck52sUov3Uy\/Zwya6tNL+ZN2dWnZGgo12J\nCLN28Z81Sgcof4765z\/593rsuTFhZu45hvO4k3w+VAGD+R2cKKtD\/ZCzXag3imJ2dQve\/zgLR\/6V\ngfqGDIi2n5P9B+nhX1Ku7aWm\/ErM\/W9Gr1MffCfqJBnu\/RbuaJN4vo6cfQyj5tPq5kXrGUz4q1VI\nFubZhVPblo6c2jbozBKEv1fc0lwZcEKrH8WZmlYc0RSjqfOvtPDPVIjw+NsxlwR2kkRB02nCXGau\n85B3KaeIsyiJOzRqOqlCMkfZyRQO1kaBeeV2DLn1aLEM4NqQhLx+qURIu3h917Ebfcjtk1Ckl9Bs\nldFs8aHVakH3yHVFjlsw2P6MYfcxLofnD3B7fweP9134pH0R4Jvpfvg2ubmRQxpb18Hekc4Xdnrb\n0WvWocdYy9Vp6kSHuRedBNNuc6La4EZprwOajmFktZpxlnhyeiXlbP64rLH+zG2RT2qtftx0BLma\nSQ32AOpprs4yhqsmGeVGGTVmH64ZJVwlVZkkXKdQ1JoUaUk1U2IulBlmxAwoGFB0jsTW+0fjYIw+\n63TgbK935i\/E32tKtxxv1PMXig2+GECdLYBagqy2+FFh9qPcPIYy4xguD43R8zIKBmVa0IfP+33I\n6VMWvlfNhsu8aVTc65ei\/7hKu6g78e8OW5SLiw3InIqEO9pkwOluN7knxd66P6lsTfhbVcdXLNS5\n\/RIaRwKLDpjRPDRnaAv0mPu2fTD9eGKmrsfIXj6n96GBIOcDvDQLMP8+AGe7x+H6vGJer5w67636\nqK439dMWY\/s0pM7mX3DAMz2eKPfuGS4y3CokVRuDW0jAE+3W2XDt9wwXOU53uw6zneVTTlYQ1EIA\nToeWFcSpLqeY0+f9ev\/5yrja9R36Yg378ktD8tcCPPnVCIfLarMgu8ejuWsxPMhgIWCg+QOSeJlA\n7wcwmzoD62\/HWowiOah5oHDeLywVUFqBXtYWDvrEuwN6xU877FoqiMzjbcOLCzXfuNLvii\/ud63J\nJ52a0sP\/P\/+\/jP8B5gYtdVui2mEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/exotic_fruit_salad-1334208351.swf",
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

log.info("exotic_fruit_salad.js LOADED");

// generated ok 2012-09-14 19:46:34 by martlume
