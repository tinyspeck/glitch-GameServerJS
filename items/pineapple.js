//#include include/food.js, include/takeable.js

var label = "Pineapple";
var version = "1354588326";
var name_single = "Pineapple";
var name_plural = "Pineapples";
var article = "a";
var description = "An exceptionally prickly pineapple.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 7;
var input_for = [25,57,75,104];
var parent_classes = ["pineapple", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "fruits",	// defined by takeable (overridden by pineapple)
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
		'position': {"x":-11,"y":-44,"w":20,"h":44},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIx0lEQVR42t1YWVBTaRrlaWpmarro\nntLqbkHCJiQhG4QQQDCsoihEkH1fhLAIKIhsQhRlkS2EfU3YadlBWWQxiuC0SpPucUStthtH25np\nmrLz1DWPZ\/6bGUq6H+bFINb8VbduUpcU555zvnP+e\/X0\/h9XsoIX\/cGCkyh4GckKa9GHC7CTp\/5g\nASa28vWTFDwkKNi7DzC4hS3OWePr\/9J71iIK4Kl2jnTXAYY2sUWpI7aawmVn0XaAkk4u4ppY41uM\nFt5yECUPCXaH0UA5S509a4+iu07S\/\/jPmpvQykFMHUuTM2fHzZ21V2beEMhilTyNXyVT\/N4BRrXw\nxKHNHOQtOiB\/0VFdsORIi2tiI6rWCoRJDZloLaiwBgbNp3wXAFIrvJmrjmznIm\/BAednHTSSLp4m\nvIoJyouJ7RzZrnsxgfguvImL2C5rnJu2R+Z1ISTd1lqAcS2czfcaISTjZNopbSE+q2chospKFVzG\nkMU0czWhjRyc6rPBmQk7pI8KQJgkf8NG2DbvUUOUPeMgShvbgaGh\/JTaYU3b+k75ivxzaVAJHUEl\nDMR28BBcz9EymTpkC0mvDSJlVgguo28G5pjqUw2TSYBnTtkpE8m1ILmV7urwfzWDX7EF90SBxWZY\nlRWi2yiQbMT32EDSz0dELQsBl+nwLTCXEYCaLU9GtrFFvuWMDJ3Ku\/07lX3JXTxVIhmO2AY2IqoJ\nU6UMLZgA6ixjIUZhjRjCqp\/UAicvWmo9Gdv0tmG8rzBoO+JFCtz5aaGG+HE8rpkjjZKzpCHljE0K\nnPiCBbyzzXA43RTHCg4gitxAMGH2RKEFqJsJr7aSbeVlTCMrw4NIr1NwVLVJ7zhp8pccf1FlgeWm\n+oQptU+uOY6cNYV7qjEOnTKCB\/lMDY\/fJUst00GlDE2UnCml5PbfCQYp9qTLTiRK7JS\/vkax4Z1t\nqvRMN4GLhIaDMfshDDWAS6oJ\/K8yEVbBhD+R+ji5CcK6hpI7XtcxVHjXiUsFctqIAPHbJnr7ck8x\nzjgUZ6RxiDCEINhAe7idNUNAOQM+eQfgcdoEogSatg4Dr9DR3+Is1iyHin685cdd73TivjPIrOvC\nDGpCwxo5ao\/ytx4qWLSPTh\/kayivRctZIL6EX5EF3JKNcTB6P44S9o5kmUF0ioZj580RTyrycIYp\nFAVcPB33xT8fKzBT7Yibta5ro1L6uXcCGUtih0yqdCsqtN4k0mvbg3QxVXUBxXQtYxQIl0QanOKM\nIEoxgWPk\/v9et4R3mBFyI03xfNIXD7rd0VfAgKrVE6MXmRgs5GwU+uhZ6cybRXcOIoHkW2QdWxRY\nShf5FZqLwisZMuK7TWpgtuSmjmPZ5giQmOBiiiU2Ro5iqlwIdZ8Xbjc6Y\/iSDcZLBFiU2aExyeDn\nIt\/fZUiZer95Z5DnpoXq7b5M6uQpEzq4quASusr\/3AG1mMROAPEc5b\/M0wLMtxzDmzsheDETgPVe\nT7xeTsfmSilW20R4PBGF9T4PTFfaoz3D7GflGUPZO4NMHOLrB9WzpNsfnrY+Z3fxlZT0VEZGhOxH\nZZIpmklWbgx74eFIAu62OuLLTicsdcdjooyPVYUXxisOYbHZA935QnRlGaMrjz+k483F2wEaGHBD\ndQXZPHjvwfV6L3w3F4fxUht83eeJhVpbtBCfNpDs7M2zQONpYyjJjdQk7EMrydHuXDrKw\/dgINcM\nxQEf5e9I+8zVuePaJWsstJzA4\/EwLHQEYU7miJcrhXg0EYNFuRAvF2Lw6Jo3Jkt5+HbCF89Gj+L7\nKTHerMZjMN8CkyW25EyHMofN1im4Z3MSrqrBHl25HLy4fR4bk7EYKOShO4eJ5Q4vLClCMVfNx19X\ni\/H8Xh1ma53wl6FjWB+JwndTx\/FipRi9F\/joymGhMY2BeomBSqcA\/\/G4X3yj0mbzXncg7nX54nZf\nIsaKOXjzIAcrihPoybdCS7oZ5uUCjFcdQlvmASI7n3jwIG5ctcZYmS2uEInb0w1Rl\/A5pi6zMV+j\n4+fuqUpH5cslCdYHA9BPfHar+TB+WL2Ap5MRWOk4oo2YBbkjFOcs0HbWEot1Dhi6yIPyvBWeTxwn\n192hahShJ5eNYbLxmCgVjusU4ILcWbx5Ox9fTybjTosLkVaMB71iLA+m4tple7yYjyYgXIkXbfFk\n2Bvfzsbifs8RzNUI8WSG\/KYrBMNk29aczkRrqgEaUmganQLETwv6i\/UizViVJ5bbvLA5n4hvhk5S\nbYHOLEt82euP9ZkiTFa74qseF7z6qhX3riVj7Aobi21i9F1yQGPqZygO+ggNks\/RnWWC7KN\/0K3M\nG0tl6kayUZiudsbT2XSsjyVhqOSQVt6ZKiHqko3QlGaM\/gt0dBCpK+KN0XbGlEhujMo4AzwbP0l8\naIQvLjBJw+xDScSnGToFOFrlRqtLMdTcV7ihL4+BYTIoczUC4sNQrA8Fo7\/IWguWapeHXS6k\/ojc\nkyGYqxVqWX0yd5Zk5AEospmojt+P8oi9GTrPQxI30Rszabg3EEmGgIvlZmdcr7DBlMyDnB20mffy\nfg2m5D64r3DB9ytXsdQZjD8PemBG7oHLwZ+QQ5\/IbIjRK9Y788hAglZZlWiG1zdP4oelOCy3e2in\nd7bKnhwC1Kcx0ZFFx0gxG\/IUU1TEGaIvn4Wa+H3ozTGHgkhOqk+5Y8\/XP60F6q+2u6pezfrj\/kAI\nJmrFhKHDpPbccLvVlQDj4OnIERI7fFJ95uRG\/KHu98IQiZehy46oO7VXU+D\/W5reTq5\/\/W2a9upB\nNW42euJGhVBbdX8aiEBbNlvL7OsHFVi\/kYN5mUC7w7nZGkoG41OUR36GSyd\/7\/Pe3lZcv2onffSF\nJ1aU3mjMsMJkmQAPla64RvxZnWBMBsIMFTF7UBr2R5SGfoKBAov3\/+57c7VEujpyRrXWcxjfDLhj\nbTiW9K4Z6WcbNCTt1UbKZJWnptDvY67ebq4f72Zy\/\/64Xzpd66VSD4ix0huPyXIn1cNub+nar14c\nbF\/\/Br7dNvwJC2bUAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/pineapple-1334341437.swf",
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

log.info("pineapple.js LOADED");

// generated ok 2012-12-03 18:32:06 by martlume
