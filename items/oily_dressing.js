//#include include/food.js, include/takeable.js

var label = "Oily Dressing";
var version = "1354592862";
var name_single = "Oily Dressing";
var name_plural = "Oily Dressings";
var article = "an";
var description = "A bottle of cheap, yet strangely satisfying, oily dressing.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 3;
var input_for = [16,59];
var parent_classes = ["oily_dressing", "food", "takeable"];
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
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000004\/\" glitch=\"item|npc_streetspirit_groceries\">Groceries Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-44,"w":19,"h":44},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG7UlEQVR42u3Y61NT+RkHcP+Dvu2b\n2s603bWtzHqDogaI3EHccBECAUQWF2QrF0Gusot2QS1FJCC3GCEESSLmhgGEIIRrckggJFySAAmR\nS1BYlHFkO4PT9ttz2OmLttM33Qnwopn5TmaSN588z+855zk5dOhHvPDX1wn46Gj6+0eHamfbpnq\/\naVRtONSqVdtLlc0sbzJPPkk4tJ+vZWuf6t36BLa3ZrG1rsfGqhqOxT68snRgzvgMU2PNqn0FDnU\/\nUA29qAAVor8WuiHObjR9D3c\/o77fVyBfmYaW9jxI5EVQykow0FW+m9aOfHDlWajpTNnaV2BGezBC\n2zzA7PFB\/GgAWCo\/MLu9EdHuBYbQA2myQOwrsKjSG1l1QSjgBaBQEIAUuS+ilT64qKAfDKBFxyMH\nw4Lvv\/+AtbVpGAT3ceOBByI7zh0MoHX26b8AzWYFBirScYnvcbCBSQ20gwFsEl7BtLQZ6\/xmzNeW\nY+ReJgrv0A5Oi6kpTu6MRHSvLy5pAhE76H+whuS\/Ap\/\/H\/jjgAfmQk0BE58z\/gMYLvPcf6DtXd5P\n7j+P2Els8dlIlHtv\/hNI3erCpZ6I4rpvlsnC9g9oWsnxMlkzVtSq\/I5OcZhAKqA1UulRXJG2Pvo9\n\/3H1KcGAOunt3GreZ\/tzm1vKyzAvpFoci2zF0vyXnCUTg203MepWrdm8GSK4RqPyaRqbSLJblvMY\n+1PBV3mqeUtS+\/LCXcXrRWb1G\/tFNhXHYjpvzvD5w\/Ehfy5BsNRTC9myva8eWRWzLXPFNv1V6\/L8\n1ebvVqPqtt5Es7fWotmvlxI5DlsYe1IdxBkbDREbLNexp22mWmuyZb83Gy+LzcZk0VtHFPvDJov9\n7ru4x+834+vWlxM5G8ushxZjSO3EYACHquKM9cbebNbmV3lNFG5iLLZTO\/IH5eZaqfDDVvXzne16\n8d92Hok\/bieQ2Piq+Zkk4dI8q9lAXGhSv\/TmqEeZKuNcpsW8lOvch6hpaw5kbf4vmlp8R\/jy8+O9\nutgejblET1hK9HpT6fCUobRnxpgmMk9FCPT6hGHLZNhj7YBP3UCXF6e3I1A6PJayTZ1dpwG105ko\nk3jbawwXUT8VBc40czcNZGqNkajSh6NCx0D5UOBfKnv9Xj+V+43oBoI4+gHvqrvFv312K+8TCdkF\nOBXIVp1fp3D82Wg0zsag0cQCdyYaglkmKHjleCgqtCG4pw7CrSE\/3O3wtE9qQppLC34juZX3qcz5\nwOELWw0kUGSOAc8ci2ZLHHgkVGqJQS0FnAhFgz4Ud0jgbRJ4s\/8cjPp45R8LjkiKs51cQcJwbbt6\nMmK3vTyyguI5FppIpIDEts\/F7FawVh8GniEcd0Z\/qOAu0JhElNw8Ii26\/mvnAjUTV9erSAB13qiz\n17PAQiPZ3qfmaHQvxIDCy8xRuD\/2Q4sriSAU9tFhMHxB3PvmU1E128dETnKx04Bq3dX1B+MM8KfJ\nISGRbSRMYiFDvitJINcYjnYSWK27AOFUOL4Z8EH+Sy\/oJxKJ0oJPRDUP9wD457ELqJpgQGFhkqAI\nDNhYZCVjMLwYiw5zJLpGaOgcOo2yYV8UqbyR0+uB8fHLREnur0RcboBzgf2quNm7mmCUkS2sJYdB\nZWXthsJR6dH6oEPlivphOio0QbhDIrN6zkI7dokozvqliPvI37nAvv642W9HAlDQ74f0nnMYr\/DA\n06LjWL7pDrWEhq5BGlbeSKG130YluR\/eUNKQ8eI0CE08UZTxC9ETYcQGtaY5DTgylrKe3UvH0Zqj\nCOSfwTb\/Ht6yXHZDtHnDYq9CgyYdj4kCJEjP4sGoPzK73DGoDFfmpx52PlA3merIlZ\/dcuW44KKI\njtbyAFhDT8ER6Yn2gmCMlKfiT4V0XBX6I+QJDV6NLkhuP4lusb84N\/VwW4sgzLnAydm0jRyh65JL\n7VHE1dPA9TqBITodttBQGAMDofbygtLNDY0sGgLr3cBsO4EvpMegEPqKc5IPi1tanQykLrLlojPG\nOIkrIso+Q8uxk5Bm+WC0KgwjlQyoyoPRGegOxYkTiLxNRuSCm92e4FWebE5h\/lQiVcTtmNayf+7U\ndUurS7amCY85rrWdwstkf1zju6KWIAei2x2Cyc+R+\/Vx9AXQ0VBwGrFtv0NrL8P6bdrPuCVfu+kU\nykS7c9d88tebXuVuDRKXremtLtYk2XFckR9HajvZStkxXFOcwiWxC5KeuCCX7wZOX8jGMx5dmp92\nRNnaxtyZNF93\/p\/q1PpO7nT2KUvm+5bu87NF8jMbVBsLX3iioMsDxeTl536H94q85ZxY0urfxS73\nGFf0JOzopjOa9vS5hNqOqeWTOpcTxtSVf49a++XKkPYrkDD7jP1\/36T\/AcNvcSmfkmI5AAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/oily_dressing-1334341151.swf",
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

log.info("oily_dressing.js LOADED");

// generated ok 2012-12-03 19:47:42 by martlume
