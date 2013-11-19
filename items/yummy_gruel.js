//#include include/food.js, include/takeable.js

var label = "Yummy Gruel";
var version = "1354601380";
var name_single = "Yummy Gruel";
var name_plural = "Yummy Gruels";
var article = "a";
var description = "Somewhat-fizzy-but-still-yummy gruel.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 237;
var input_for = [];
var parent_classes = ["yummy_gruel", "food", "takeable"];
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
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-19,"w":36,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHA0lEQVR42u2Xa0yb1xnH87lf+n2V\nFlVq1XVRSZMwadO2ompLp0qRommptFVqO7Vr16nrSFolpE0aEyCE4BBDaqjDJa4xMTaYGDAYY2xs\nzM1c4gu+G4wBA75hbAKMKOr033nexlayoSVN0y+TH+nRa5\/3fc\/5ned2nnfPnpzkJCc5ycn\/jwB4\nemdnp2Bra+ud7e1t3ndReofepTmeGBCb+Oi9BcROpzM1MjKC\/v5+qFQq1NfXo6mpCWKxGBKJBFKp\nFDKZDHK5HG1tbVAqldxzXV1dUKvVGBoawvj4OLxeL0KhENLptOre3EcfC2xtbc02NjbGgQgEAtTU\n1EAoFKKurg4ikeg7A\/b29kKr1UKn00Gv12NwcBC0YbfbjY2NjdAjgZIblpeXQwaDAbW1taisrERV\nVdUPBkhWHR4ehsVigc\/nQyKRCBHDrrHFbhgnJibA5\/NRXl6OioqKhwJKxCK0NgvR1cpnehnd8ipO\n1aSKK0wF6Gmr5lSlaIRW070r4OjoKAc5OTmJYDAIZk1bNlbpBw20t7ejpKQEZWVluwKK6\/lo\/bqS\ngZRDpyyGufNzDHcWwXzzFIY6TsGoPAl9\/VtQVx5Bp+AN6GQnoG05jj5pITSSf6BH\/DGUjUW4KWVz\ntIuh0Wg4yP8EnJ6e5tx++\/btFEuqvRRvPApcHo\/3X4BKaRkmtOcw1f8FpvrOYkJzBuO9Z+CxNGLJ\npUBgoBSWpj\/CrzsNr+YTTEvfxtSN9+DsOw2XoRhT7FkzwSs+haH1E+gZ9MCN49AxaNW1v6FD9CE6\nGwrRe+MCTP1tWUCr1YqlpSWQVwnQRpl5PyCpqqUEVj0Ptwa+BVy2XkbcVY3odDmWp2qQ8lQgOnkc\n5vJfoPvET9D20XNofn8vrr39DJoLX8J4VT5MNa\/DqjqBWfMFRFwtSMyq4Ok9iwHBUUx3nsJoRxF0\nzYXoqPsQCuEH0Mj5WUC\/30+uBgHCZDJlAS+Wl0CvKoadWYAAnWON2Fpz4F+bMwyI7fTSQZgF++Bs\nOQDr9Tx4Wg9g8ss8qE++gPa\/P4fr7\/4Y9e\/+CL6vD8HbxLThIDyig3DXHsRM9QFMVeyHpepXcPbz\n4Og7B7vmC0x0fgYNCwH51b+gR1bJAc7Ozn4LyFJ8JJlMcm6tvHgGY33FcBjPwztShqhLgK35OmyH\nvsJWsA4Ry3n4e96ERZgHQ8k+jAn3Yb7rZwh1\/RJuyc\/R8+mLaPnrs9Ccex6TV16GpuinkH7wLEYu\nHUBQchhz1w\/D89WrGC3Nw4z6ZBbQ2nMW091n0Nv0EVqr38OQTkkZTXFo28Pi709EarfbMaQuhmu4\nFOuzDfgmqcPdeBfs4jcQHuPhbkKPBeMVOJSnMD90DmHT7xFS52Na+DLM\/H2wNuRhTpGPgOwQ\/NJD\nnAWHSl6C8uPnof38BVirmTVFr2CkhG3u7IvwGS5gxSlDxKOEQ3ueA5xilmz\/8n1MGlo4662urgr2\nHDly5CmWQbHNzU3EYyuIz8nxzWoj7i7X4074GnYWRZwF\/7nYjO0lGdKzIoxXv4a+0l\/D3nYMod4C\nBG\/mY649H8GOAsypXoe39XfMyr\/BIP8VWK4fg7\/vOLwdf4a76TU46w9jRvRbBM2XEfUqsTwjywLa\ntRVYCTk5uHA4jPn5+b1cqVEoFJfI7+vr69zNnbQfd2KaBwDJxbdna5EOCLFoOo05\/WeIuxsQnxEg\n6riC9IIKd9bGOU3P98KjOg1T7R\/g1BRxSeI3lSHmVSAZVCNg5j8Qg27TVYS9Rm7tVCqFhYUFKtzi\nbKEeGBh4mlX6FGUO3WRxyT28vZnCdpoVzqgJWwuSLOC67yqSnhokWFZnAOOeBiS8YmwsqhlsNyLO\nRsyPXURwpDwL6DOWwmNg8T14ESFbO2KLNqSTq9xasViMO6dv3bpFcKms9TLCjqdjdDYSJB3mrAZx\nSq6nK02ytRHD5vocNlaHkQ7rkZxTYC0gRyLQipiPqZfFlPsGVllJWXFKEXY0I2yXsKsckYAeiWUH\nkhEfNxfNu7KyApfLxRXqTLEmSAZYuOtZzM5NocPh4CCj0SgHxjKJOg\/O9BklC9M4Z+VHUHqHwicS\niXCxRV6iNai7ycBRY3IPTvw\/GwZ2sIszkGT2DCAtwDocxONxDp52zxoLLC4uchanM5RqF733KGqz\n2R6Ao+ONwRnZPA\/vF1nhFt9vyScN6PF4OKiMW+k\/G7c9ElxG2GH+DstsLnEI4kkBkhsJ6v6YY+OC\nx+qoWWbvZQVcSDtkWcWBfR\/A++EoW9mYiun+7936M0sWsBixBQIBrst4HECKMUoKUpa5IRZvR5\/4\nRxMDKKAsY9cUZSLBPgyQrE8dCrNciiWG+AcB203INUx55CZmWSMp+22kTMwo3WNQPPbBtT\/3TZyT\nnOQkJ48n\/wYccjz35G9L7QAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/yummy_gruel-1334209411.swf",
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

log.info("yummy_gruel.js LOADED");

// generated ok 2012-12-03 22:09:40 by martlume
