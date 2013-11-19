//#include include/food.js, include/takeable.js

var label = "Grilled Cheese";
var version = "1354594664";
var name_single = "Grilled Cheese";
var name_plural = "Grilled Cheeses";
var article = "a";
var description = "A comforting grilled cheese.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 90;
var input_for = [];
var parent_classes = ["grilled_cheese", "food", "takeable"];
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
		'position': {"x":-20,"y":-23,"w":39,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIRklEQVR42u2YCVDU1x3H\/43xRDRR\nqc1EY7yCM1pJrXZarTqa0alWikdUrK1EQDxAV45IjRq0aGANBFBuYRcRREVdzuVmZWGB5VrOvcBd\nQEQRA8FQrEr77XuP7orSUGVqp9PhzfxmZ2f+8P+87\/v+jrccN7yG1\/AaXq+0yry5iSWnuJXyU5yN\nwneShz5+hVB98WNJ+tGxEoEdZ\/Nfgyg+xVnJT3IeJER1F8wlmuifQRW7DLpkK6iu\/xbN+QfRLHOB\nUmwLTR4P2UFLIbTnPN4IEFVEdpzzyD1hKpGeNussOT8PJSGLUHFpLeqSbVB2eRMU17ZCnW7PQpNu\nh+YiV9SI7aCWHkZ9oRsqUz+ThDlwE\/8jQBWnuRlEIV6V\/1TF7avLcC\/XGo+0Z9Cl9UJbiTM6VZ54\n1HAW3XofdGtP4XEjH8\/uBwGdAhbfN\/vjdvERBqaVOkEtmIuuxMXouTETTeff4g0ZTP5nzqL6\/DQR\nBerWnjS+0BCP6r7A07v+xu8U7rtqdzxtPYe\/d0TiaVsoWiq\/ZGA0VPGr0BRigt4rE9ArtYTSZwSu\nHnrLb0ieUl34yKOjzIkoEUggAlg8uxeI3rZg8vKIAbDPHoQxFWl8r\/PBt1q+EUybuwfq8OnoihoH\nxE\/Ek8umqPx6LNL9FiHSnpO8Fly+O2eRf2KUvr3CHXdL3KFN2QF1wqeoF++ELssO2gxbqNPsmLcM\nfusfVUm7oJI4ofSmNTQFzlDFLSXH+DZTDQW\/A9IWoi1qChTEj\/S510oUqlym+yh9UeQayC+uR8kl\nSxRHrkV5rCXqEndClfqZ0fjV8ZtRK7JmmUk30nDrIDRSnlE1jXg7VOcmMtWeiGahO5ocbaktoPPF\nt+mroJW5SXQy1xmvpV7xSU5IvfZdpRs6FS7ofRAy4CgN8dfGs\/hbexh6Ws6\/4DOaBMqIOUy1Huk2\nNCWsRxF\/Eol3UR8whoHeub6EN6TS0ZJm1ffyJh\/28h+Co0ET4H6dpxHMkASqb8agK2YKHl6dh+KA\n2ci7shNlafsgjtqGOP\/1wttl7kMrLZV+P9bThBgMikbvwwsvJIDhOOsCzdAaMgo9ifNRLzBH2llz\npAs2oS57P2oyHZARvMIvcM\/oj4ZWTkgHeCCzxWOdFzte+tlz+8y\/BDPUM0N20uNsCRrJfNYWPQ1y\nv2lIDFjOVKsmBVqeYItM4RaUimzQUeUOtXCBnr6P+v2V4LJINc\/70qSzKe8AVKLNLBGqrlihPG6z\nMTMrE\/6AupwDL\/hMdWkR9EEm6I7\/EN3Z66EMeh+Z\/FnIjNkBldQZtZLDkN5wQP7NvcQKX+FJy\/N6\nScXI8zBRvBJklhsXUiZcZcxOfd5BlpU01Fl7WWYqJY7sqGhQMFpsqWJP5Luhi16IW\/z3kBS6ATW5\nh0hpcYU85QAk1+xRIzmCx6SL\/KXhNB7r+WgnoMVxu5DsuwbJ3r\/+95C0hSl8Jw\/wGW1N+tKjTC0F\nqWtFMeuhEPwczWHvMLCu1JXQXV2OPN+ZKIjbgspMR\/ZseboTA6OqtWu+ZkX+sd4b7eVHkCfYCpHX\nKqSdW4f6bEejknS4GLSs0IcMYLRkqLIcmFIGj9VGLURL6HjWN6nH6FFWRi1mhdZw5JVZh9hxFiU5\n4l6dN+kq4ez\/tVacRP5FawaWEbgBTcXHBohBpx7qyUHV61\/LFCk20EgOQCmcz2pZa8S70AVNQNlX\nIyH1N0e1eLcRrDqHh8LEfQyMKsbKz\/1QsjFnBjQYmCFaK44h\/8xk0HlxgHqtt\/74Qi2jimmiFzAw\nGhrfH6GS\/zbKo34J+Y0dKIknIxTxZEXGAYiF23AzeCMBdGDZ3ac+Dym+axkY\/RwMTFf0OcRh63Dd\ndwUyLqwjAozrfMGPVxy553UscxduC2awOkbBavkcyvljII9YAmXu\/udHmfR7pAUux1XfT5ARbc2y\ntX89ZCeQ6kDKy37cr\/Vk0LSg9wdrV3kh9xLx47k1yIjciPIUB\/bMP\/2oMAJG7uEU0mBi\/OhZrF\/S\nWkbBaoKnoSputdH4NGqzD6Ig0AJpxyYg4ch4FHuORF3odDYI0M29DPly0NpJLXS3+iQqxHtZNJUd\nH6BqY8IaCtk3frXFztbTjKSqaSJmozF9KxpybMmku5sA7WP\/uCzVHoWhv4Akdi9Sjpoi6U+mKPQc\n1zcAxE9ln23ho6ELGME6CQVWJ1m9EjSNpvJjaK0+ZbQIVVJ5wRz0+sA9CB+tUH4zFnekDmQ3J4x\/\nRGse8ZlIdtO25tq5DRB7fogc79kI570Pv0PmEBz\/KcRn50PmP5eVmo7kFejNXQ2I3kNPzHh0CMYy\naHoi+rBJzNO0R1NoNbmLUJ8PBl16Y3vfCJbozPGKwha\/\/ICfYQSyXTbF1Nfl46VhvOlfRB6emu\/t\ntOCh0OsTpERsQU6UFZLCNyGOeDGBb4ECvhmUfibQhf8EbZfN0XH5A3QnL2HRW2QNlNuxyYZ+fxg1\nmW3gTvRMNMbM61Nd9BvWzw2AbIilV75Ezzmol7l29gf7oUWBI06vtozhr\/ZRpOyWaQtc+mxAem5e\nvA1EYRuRGvArBkxbXg7\/AzZilXmNZt5mGyBdh4VgNrOFISgwtRq1TPdlM\/QmzunkIuy4GbGu7\/CG\nerOiY1O9zM2Kbo4Ony8fFQVn8LGfEsUtUSHajmoR6euXlkEeuhBVYXOhJdeAhhAztgFDUGB9wIjO\nN3IdrS\/8fKW20JVngNbKXPVUaWWuI5mgXQeWpGRyPcjZj5YSNzwod0NXlRvupm8cvP29iaWTu1gw\ntYvcPAiokClOrEUnJE3+4QHg\/1M\/jVDVG4pcbSh8faGriMIP\/2A0vIbX\/8P6B\/pPpzQFim0XAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/grilled_cheese-1334208750.swf",
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

log.info("grilled_cheese.js LOADED");

// generated ok 2012-12-03 20:17:44 by martlume
