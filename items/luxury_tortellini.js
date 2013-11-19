//#include include/food.js, include/takeable.js

var label = "Luxury Tortellini";
var version = "1354649285";
var name_single = "Luxury Tortellini";
var name_plural = "Luxury Tortellinis";
var article = "a";
var description = "It's tortellini, stuffed with extravagance and drizzled with grandeur.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 758;
var input_for = [];
var parent_classes = ["luxury_tortellini", "food", "takeable"];
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
	if (pc && !(pc.skills_has("masterchef_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/48\/\" glitch=\"skill|masterchef_2\">Master Chef II<\/a>."]);
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
		'position': {"x":-20,"y":-18,"w":38,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJD0lEQVR42u2XaVSTVxrHnTMfZjsz\nTmc7TheZ6tSxHVx6qkeLS906dQGxoiO4gWO1KEiwbnRUFhUFBVHLpqiAiiABY4Cwk0ACYQfZQhJC\nQiAsYUlCSFAU+c+9ryXVWp06bef0A885z0ne926\/+2z3vuPGjcmYjMmY\/HjEqOGEmLrSBObu7OiH\nev4HPy64Vrb9YF8JBnuFuNedjft9+XigL3Q+nzCOlZBqzWqXXOeYdFKYDc2Qp\/lW87fNsc9ZNmn8\n\/w3Q1JWjN3Xnw9DOh6mnEgPdhQRQjHD2r3Eu\/icQ5e5EvegkCr1scWvxm7gw9w0cnjFB5TVtgoCq\nTHhbMKirEuibouy\/NygAzh356SHt5ZkqRUUoKsoOgyu4iLjYcASuXQh12Q2omyJwmT0ZvLyLyLkZ\nA94\/\/opwm4nwmj7BoseWT4Ts7ln0t7HRp4iCoSMjhMxt9V3ArEZGRlTKtnakHduP9B3LcfHsLxhL\nUU28vA5hm5ZAFH0ID4y1qC8JQ015HIo5FxjAM7NfQ7ybLeozTiP6lhUzJjrijxD5rUAN+wC6pOFo\nzedB7LEu5GXBxhMNGTAPQny3DvG8XLBjY5C8dBKCnF9BcMRPmcVU8gS0N15DedZBDHaVouyoHYSu\ndgwc1SLWSpg6eVBUR6KwiI0i\/nakbnwLl+ZNZKxLlc5J+2py76jImvbfBm4GtVqdSID4iC9QcOME\nZFURaKn0RrTtO4yrvOdORNa1TWgqOwlxGguimG3g7VxkARvVFl4Aim964NSqWcy41CgPVGSxUJ3i\nhitu83Fk9uu4usAKNzz\/gOjrk1BadwbUMC+EI6ovSUl+ZjGqdLdPxtTp1dZIDrJF0pGVyPTeAPEB\nW6TbvW3pz99pg\/K4XShO8ER6pCP4iS6ozDkIVVUAVJUnUBDrz8xzfP0riDnyW6RErkFnl5ZCRj\/P\nrdXFNQ2ISUjGdf+PcO3g78De+pplQe6yyTg75\/WnIE8tfxvFSW5QVpxh3DnQmYV2QRwkkSxUBG2G\nLN8brbWhMGrYUGf7oy7BDcLMbSi48ynUd4MQ676EmSd24V8g8vwALdWB6JRFQSu\/jJZST86TgD5G\nkxm30+MhzI8CJ8ORibPw0J89k5HnHOYjO9QfsoJQMuF5lLF3I8bdET7vTyJ1UURUjD5lHDolEWir\nvYA+VTLqIzwsG42I+hV6O\/iozT8E7tW14AV\/jILQ9aji\/As1ebtQnf0JqrK3o0nsjrayvY8PAhp3\nnc1J6O\/IpSbGo+F7kNd4o6XMG7F21gzYF1tmQVlygrjoNNRkYU1DJKq4fo8t+aE1apN90HT7KIr9\n7SE+YQdpij86S1KguHXeAhdrS+KOYwV+hhNiji0C13kmMnbPgTTTFTmxDqjK2Y2mWjYMBgPaFbxq\nRbFHtVzszqIWJMU3i9SmXOjUt9FRexyd9QHQSoIR9vFMHFsyGc3lPijmERdxdqA69wDqhd4klsIh\nZu9HVfguSxiMZihVWqyfjGPfeVOIa5OgLPVHeuA6pp26l7ZVnltNDOIJidgfOp2OSRgK15DvCgZQ\nTwBbK72QnhKAzMQ9qOZ\/jsxAW8ZChTE7SSb7oTRjL\/SqWDQID6MoxRW9cg4akjyhKr6K4lMOKA\/a\nggxPW0Q72lhCwufdP1sAy45sQVWWL4TXdlraj856Fdzjy1DLdWEApSUnGUDiVQH1bm7iBhbj4iGz\nBq0VBxF7aRdyEj+FrDQQJQEbEOD3c2SmLQU\/zhkRO+YieN008NkuyLnmhLRVU5iFRV52MLSyYe7i\nMTE4oK17KpnOO\/wJV479Bim2xKJr\/w5u8EoknlyJM\/bvIHiNNRTic1CTtZtLPFCb9wnu37+PhyMj\nTyUJPXbQ0XAW8qLPkB3vhIwbG8COsWGSJZX3PikFixHmNBeiW8eRd2sr0lk2DFzcojfRlO4LOdm5\novwUdC1xMGuzcdHFjoEL22iDsMRfMvPEb36VGZO6cgriLqxAGW8bZCI3SArcCOABNBW5Q1N\/jsmD\nB8PDzhZApU5nRV6AWrFRxCKdP4dEuA+i9K3IzJqHrJDFSN00A\/muC8gJsRpC95VPZXfcv5dDVXOJ\nsWKXNBJ1gv2ovHOMaStJ24U60QHUlXuAH7CGGZf9z+mQFe6BIMkJ8aEfkd\/NUJfvh4wYhzIMPRxW\nPVMLm7V6DiXv71OSE8IVEtFnaKs6DKWQhdQ1U7+xeFOAI8t+jxyOC3FrASq5+3F0zhvw\/\/AtpAdv\nJzUwDJlxm8C9so6UlPVQlPlCKz2Htmo\/8n49Ik8uQMx5B7Qr81GRHwJTvxrDj0agMd5zfgYwT6K0\nkmh69LRDT5ccGYn7UHrBHkLWfAZm9PpEM9VSNkgGjp7NVPlJm3AnxAF+Cx+fOm11YcgJd7DEKhOv\nnksgLziEu3keiAleitNe7yE1\/iDuDRqJWx+hRWcSPPe4y61XOUu79DAPPWTiQNchRlNSIFJWT7XE\n29etSI8pesuhScC8s50K\/tHlxNWXSFaeQep666fHrPobru+bSy4Ze6Gsuwm1ovzxWub7kPcY9TKt\nacYLLwxCaWt0bbsOHf2D6L\/3gBl8\/94AGtIuoTZsD4S7FyLD+T2kbZ6JvB02ELotQta22ch0mQXe\nlnchcF0I0aEVpKAHoTLAESkbp4PrNB13HKeBS4pyY8oJKOpTvrTYMFp7DWjs7ENjtxGSnoFv9wkh\naGiJbugyQEoGtXS2wDTYj1EZHjLA0F2HLlUOelWJ0CpuojzPH+IMX0ZLs0+Q51Nol8bBoOFCxDuO\nmhJ6qS1kNvplhkKp1aFA0gKxoh2S7n59o9bo\/FL3woJGtQ+1JAOpN0FDLNpnHoKJuH+IxMrLCg0b\nOl7R04+8eiWjo3D\/1a0vcLf93bZePTW\/SmdCm2EQrXozATYzzxryTMHpb6vBDLX+WZX1GBn3UaVe\nySdWo3Blqi5ItMaQZh2++0dVpbrHh+5U3jMANQEbBVT2maDoHUATUQoi7f4K5utKvUHhCqRq+l\/w\nP1vteZLT3Dxe2t3PIqAqCvQygOUtWhTJNSht7uBIe432P\/jnJ929vHuAJes2CmhpIPqNgA2dhmoS\nJpxihcb5e3HlmIzJmIzJDyP\/AcEuvSNmyjz0AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/luxury_tortellini-1353117509.swf",
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

log.info("luxury_tortellini.js LOADED");

// generated ok 2012-12-04 11:28:05 by martlume
