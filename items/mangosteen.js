//#include include/food.js, include/takeable.js

var label = "Mangosteen";
var version = "1345744869";
var name_single = "Mangosteen";
var name_plural = "Mangosteens";
var article = "a";
var description = "A sweet and tangy mangosteen.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 10;
var input_for = [55,57,195];
var parent_classes = ["mangosteen", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "fruits",	// defined by takeable (overridden by mangosteen)
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
	out.push([2, "This can be made with a <a href=\"\/items\/265\/\" glitch=\"item|fruit_changing_machine\">Fruit Changing Machine<\/a>."]);
	return out;
}

var tags = [
	"food",
	"fruit"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-24,"w":23,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKL0lEQVR42s2Yd1NUaRbGrZpCMBKa\nKDl0jtCBbKNiQEEUwayYIwqoDEEExIQgtgoqRgyDoGMedUadsV1nZnfWHdet3dr9Y6u2+AhU7Rd4\n9pz39tVuxR3dsXbsqlN0uNz7e5\/nOee93SNG\/IrHo7\/anfdeWsuvfp\/WPOJTe1x5luq8\/CQNFx6n\n4vhtM3ae0pR\/UoBHbxjdri9N6LxqxKEBAxpP615+UoDtfYahI9eN6PnKIiB3ndaholNl\/mQAH\/\/L\nGnj997aXFx\/bcOxmmgTYrq78pFS89rM18Nw3lt4z9zMlwA61+5NrlrY+Q2XXzbShfRct2NKhxp5e\nXXPdSU3zlsMpzt8cznXN6L7izsXl79IhA3Lj7LmgR223FpvalL2\/GVxHv6H59P003PrJiTvPHdQo\nZgF44AsDDvYZaOzosPWQGiuaUv6\/M7Ii3GHeFGprbnXpB0\/cNZN6abjxBxvOPJAUPHDZgDYG7NEK\nwJq9uqEuGkldt8w4ct2Ejn4jKawbbOzRurcf\/Qizs3NAbz58zVDZedXQvOeAqbd+uWWoosyA2ga9\nGC8MeeKOCd23TQKwgcCazuhQ2alG5zUjzn5twcVvU3Hp2zScf5gqjj9M7++9qEfDSS0f517XlhT4\n4YP4pqn85F3zICvD1XPPgq6bJhrK0snZws+7NcJSBrjxo1UAVh5UovW8DjuOaVDVqcSVp2m4+ZMN\nt5\/bMfDMKiBZTY4BL4RUxPr9StcHwR27YXT1PrJTvvLw9cupuPaDA7ytsRp88nayafd5aoTjWvGX\nFoKLjyxw9RvQckqL1l49KaNC02kNrvzOKuDu\/mzH1e+t6H2Uim4GvPIacMMBFd4\/\/APG4hN3zLj7\nPJ\/g8vHNX3Jw74UdX5JCrNTJr8zCWu7UerKoyqUWqh69YYJ3zljl2m41KW\/GF7S4Pre0b7MT3On7\nLkk5rTqsxrq9ShQVJRS\/3xbWbxjkzZ+t6CdL2J5bf7RhgFbPF+AMMRADtpzT0S5ionw5yMp0oQ7H\nofv262M4Z2wnL5oXwPnbf1lSr4ZisPmgCitbUpAVEQN7QOQvz07uwiO0QlaKIS9Rl3Kn9j6UVs8K\ntVHuZLirz3Lx+G+FePqPIho3WUIpjgIrysfxDsM27iTrWTWOBCvHGa1oV2F1qxIlyxORPjoatlET\noPQPT\/qvgLs69GJUsI0McJxWzsUNwquX4PRCHVb6wYsCPPl7IX74ZyHuv3BIOXvolbOzUsNsbFMJ\nOxmWO5xzt2p3CornJCInOI4AYwSgxT\/q3XdFmxWO8upcq1g1B30\/rZiBuNgWfo8\/q+3UYc8RaQF9\nTzLw4M9TKQYZoJsH9D2VFOTPvBVkoCVLlVhUoETZtBTMyU9CgS0RE8fGY\/LYROSNTRCAqaOiYBgZ\nXjL8EA61u6vDM1CZnYrte7SoP6EVdnDx85pGA3asNqM+MQu7m6RmYXUZiPPJxc+Pe2WQG6mSlFtL\njbBAr8EKhRlLQoyYH6xHSZAWswPVmDleianjkpFBKgrAgPAf31YvKDV+S5gD2wiwNiobWyMcqDLa\nsM1uR409HXWmDLRE58GVOB0H46ZgV4md9l+DTwdz8XO5ixtPSeptokZYtkaJxSEGrAq1vAKc5wU4\njQDzxiQgjQBNARE8dnyH90aFtZwBt0dkon5CDnZFT8T+xMnoSJqKI8kz0J0yEz3KQpxWFeEc\/W2L\nnYydbXoRegblgc3Fzzmj3o2waqsKCyJ1Am51WCqWvgNw0thEkUUGjB8ZNNcHcIPC2isAIzNRR4BN\nsU4cSJoiAF3J09GjLcRZ3WwCLMQZgjydXIhWvRM1OwxvR6FLIxpiQ4Ma5bl6LInSY5nChPXhVgG4\nLNQ0rMUMmDUmVgCq\/EM6fAFDbe4KBozKQi0BtsQ5ScEpOJiUj5OGWejPLMO1zPkYcJQKJblOJM\/C\nAbK7OseKyrl0NzPXhE1zjFg\/24DVFhPKQ80CZn14GjZF2AXgKgJcTu\/LgEUEWOABzCPAXGoaIwFq\nA0Kf+QCuD7WiIsyObVGZ+Jwy2BLvxD6ymFU8YylCX0apgLxKdZzslqsrpQCHk6ajKW4iGmJysSMy\nCztokexEVWQ6qiMzsIXyzIBrCXSlrGCQDnMFoAozxqcgXwAmIGdMnFBQHaD4kw\/gOgKk2yhxQr5A\nc4ITexIniRz2WApxOb2EIOfhQtocHE2ZIYqzyfZ3Jk9DO0WBF9Mc40TDhFxyIVu4UUXnqyDADeE2\nrCHAFWEWLCXAMgKcE6hBIQFOF4BJcBJgtgdQ9Sbg6pDUoQ0EWUmrZhV3xU9EiweyXZmPc7ZiXCLI\nbm0BDhEQQ\/FfzijHgOFY8cboXJFhXiQvdiudT7aX81ceZsbiUCNKSb1iAuT8MeDkcTwTEyiDcdAH\nhEE9UuE7alYqLG5Wke3gVdfF5vhA8sU7VdMESBsBycWvOat76ZjWhDzUR+eghiLCi+TFequ3ktRj\nexcpjB57X+dvkid\/DtryGDDZL6THB3BFiMW1WpGKjXQyXvWO6Ew0xOcKSLZ7N12cQfd6YOXi1\/x+\nC33eRMfVkHIMV+WVvXWe5mD1lpB680P0Qr1Z41\/bK+eP56COAJP8gjf4AC4PMhavUFjAKm6mkzJk\nbVw26uNzsNMLtEVUngBuEeUUYPw5q17taQ4Zjq2VsyepZ8C8YJ1QT55\/kr3xwl7uYI1\/GKJGjNO8\ntZssDzYPrSJItoRPXj2BdpW4LNQRaIMHtNEDy9UoKlcoXRubLTJXOQwcW8ujZbFQT\/dKvRk+6rG9\nMUI95Zv5kx+0FTUvDzGLMPPJ+SKVUWR3LI0eAmVF60TleEp6vT068xUYq78xwjYs3AJSr8QzWgp8\n1JOawxIQSfMvDPGfjZ81LGBZcFLgkmDj0DIPJGeH1RSWRzkEiKgYqbZFc5c6RCN4g\/G84\/+X4Th3\nCwmuNOS1tZy9KV7Zs1NzSOqF3CeUz955y1UWZHQuDjbSfmnCSto7WQUGXe+BZQhWVi5+ze\/LYHw8\nN4ScOVk5huNtzbcxpM7l7Y2zpx4Z+u\/IEWPDfvGuuixI71oUbACD8nbFF2RF+OJrh6k1rxSTwFi1\npV5w8p4r504eK9wY2R5rWT2Vn+L9vyfTpO\/l\/XKhB3QZ3cfxxVcOU\/w+jxBvMNnSudQQsq0yHOeO\nd42s0bHi\/k8vrA1t\/eDvxiVBmt5S2pIYdMErWIO4n1uqkGoJ1WIqHh8L6X5Pvo3ibYxV461Mzlz+\nG3CsnNg1\/EJd\/\/MvC3PHacrZonmidCj1VJnX83mitGJ3kMGKPGCsGncrZ06yNQGOUdFiv2U4TYDi\n1\/\/8MTMgMZ5ml5svPlwVv4J6rViBRzW2VO5Wboa0gCjREDr\/sJcqv6CP+4vsZAKli7pmjE8enEUA\nDMPF4ZehWDFvsIk0gDPJTt7CzGSpISDMrf\/YYMM9csZEm7NGxzRnj4l105AdzCYILnqPvvxEI51s\ntPLXyFFRQ2b\/iFsm\/4hKvV\/4B4P9B1zKY4OZTVxDAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/mangosteen-1334211971.swf",
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
	"fruit"
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

log.info("mangosteen.js LOADED");

// generated ok 2012-08-23 11:01:09 by martlume
