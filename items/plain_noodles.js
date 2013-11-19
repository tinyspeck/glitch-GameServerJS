//#include include/food.js, include/takeable.js

var label = "Plain Noodles";
var version = "1354598589";
var name_single = "Plain Noodles";
var name_plural = "Plain Noodles";
var article = "a";
var description = "Some good, honest, plain noodles.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 13;
var input_for = [37,87,94,343,346];
var parent_classes = ["plain_noodles", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-18,"w":38,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJS0lEQVR42u1Xa1OT6Rnef+BP8Cfs\nh37pl44zbafbzmyl06ntaFVmrbqKCssqFRcFz4pTRF1BEdaAghw8BMIxQMgBkkASkpDz+ZyQ8xty\nRFCv3u\/b1Wq3bt3tdusH7pl7ZF4n73M91+G+kw8+2KiN2qiNer+qtCzYUkpMbkFatPm9A5ePjIhL\nKQWKcSFWkzNYY+bK2edpd9smv6mtPGLvE8d9E+Ko\/QGfffajglsJ9jesFyOI2u8iaruDbERAAOXI\nJ9TNfkObN2BsR8wjQMw9iLClE379NSaXMjcAKCtEp8pWgr0NjLeL+u6WHxQYHbCJuioXnWRizvvw\neg2weXzQGg1IBMXIRcZhljdCPlqHWWEzZCIeNLJbsMjPwb90A6W0CsW0GqtZG4opFRh\/H5Ku1vIf\nAtiWFy9eiD3BCHRWBwqJWTiWujE4LcWESIAZqQB+y0OsZ9TQzzZBoRyHVCGBWKmGdEEDhUqBhOch\nUu57CJg64DN3w2Psgt\/YirijDWtra2L2jO\/LWHM2X2CGZmbRNybCwMQMcssTBPA+xILjMM+dQ9wz\nQixdwHreCsZ9h5jSo5DSwW3ohU4rRCo0g6T7Ppbm78C5cBoWbQ8MOiH0Ohk8+ltwWCRIZzJgz2LP\nfFdwZatPn3rlWiOGhf2YlbTDoGyCUXkNaU8nwuYWOBYuknTXYZLRobLjKMYmkQs9RtrWhKSTh2XL\nbVCYkHB1QSu7Crl8FArJPVjm6uFR18OnOQW36gtitY0u\/AAe2wyKpRJDZ5f\/J3ANuUIRArEcgole\nLNva4FRfgU5UCb2omoCdR9rbDcf8GWinaiB9shd22VEC1YFM4Ak8C\/Xway9TwieR9vXBSuCDhmbY\nlWch6t8N0cAn0M8Q+7ITCFh6ELHeQcRwHu75KrgtIygUiyybvLeBqyJJ0TMyha6hCY61ZTsPE8ON\nryQW8k8hYmmDS3UZi8JD0E9VwiytJQCXKCjDbGpRTMiwmpqDc\/4sluj\/rXMNCBpbEKKmBJMCN2Ca\nrYNLcwmlFQfSgUF4VbXwak7CbRpAKjBGE6KVH1RVb3kd3GZqZkqpwf2hYUxOk6k1tVicOYHekVEO\n4NCjCxA\/IgZEfyUvChEwdsCmvEAS19FFeoi1aZSSEqwX3PSvlGQf41iMO+4Su\/0c81blRcyPV0Mn\nuYCQpZ0YLUfcN46I6QqCujoEFmtJtVYsW7+ET\/UZAurqspcAm58WQrBrW1DMWLCa8yETGkXMehVq\naRPET45AIzxG4I5RIr+i+TeGjP8BcuHHKERHkA0PI26\/jUzwMRjfAGLEvFffimRgGoW0GUn\/MPSS\n0xi\/\/2dOgUxEiv7WMgzc+hjdNz6CSXIIiqHdkPAPwEThC3pViLhHGZeyUscxyY6SlagUBcaEfEqL\nlK+fDmxF1NKEuO065IJDUI4cJGnPEIt7IePvh058Etb5vyFg7iBGx0hWCTe01zPzWFtZxFpWj1xM\nQkBvQz15nORvxpK4jkBPwqdrJP8ewNj9HXhw89e4ffFnsEgroJskT8s\/RyKZBIvJoThcxTLJASxl\nnUTxcRgkRyEVVGKWvwcKwX4KRgMi5qsI6s9hdugArPLTlNIWGMS1xNgQAoYWAnodRtk5aEWnuF6c\nPkmgaknOo3S5Ckge\/wXCBzshG6xAMiiFS30OIdNNaKZOoL3x5+i6+ktM9GzjZDVLDiAcibBhAauu\ncng3jwP4fL0Iv6YGI\/yLGOzcwxk6bm\/HYMcfaCTUw6aoxRwdNj96BHOD+4nJPcQIjRjaEnHvGIXg\nS5J7lPazjBg0wDxbT7Ltg4R8y3pX8ngPrIqzsKlbyHu74Fm8iKSPj0x4AgzZiR09LEC2w0HbK4Cv\nEsw+SHr7YJAew6O2reB3\/A7Dndsw1beTUnYCqonDtJ7aoBipgLBnOyZ7d2B++FMEl65RENppP3fQ\noVeI3TbaOCR33kk+7cEK+XLZ3k2S7od2+gt6zzFi7Fe41\/wR5EPlMIgOwKms5tTzqao5gPmVZRYO\n\/xspZoPi156CQ3EM6vEDmOrfSbffRXOrCiNdf6QDPsfKsgjpmAUeQzfsitOUwOtkgZtYosQn3A8o\nRJ0UhBakgxM0Ltphkp6AT9tIXm4haS+Rherw8NZWAnaQxtQ+Ar4Dg19tpRl6lOZmBVL+J\/i6yt6Y\ng9nVp+y6QTpuppceg3\/xJMJLZ4j6GiyM7ccsycp6iQ2LX3+VGyFhwxV4SaqFsSPIxDS01nqgnayE\nfHAfyXmeWOVB2L0DwzxSonc3MXyBLnMNIV0DvecT9FJArtX\/FCZVDxzKk7AstL4Ex\/\/GoJ5yuzdF\nMzl23SCT8uBRxy66ZQVHu542STauonFTiYXJem4gKwSfUpD20kEVFJAGGrAjWBitgJS8Nkdh0k4f\nJ3kHOP+NE8iHt8pgFB9BaOkyFzj9dBV6aMQ0Hv8JeE2\/gEE9xCFbe\/acSZfw778Iz5i9ZZ545uUt\nEHYOIWy8Qgn7EwXlNFy0ytIBAVTjhzhGWSCK4QpuBmqEldw6+8fzg8TgOfJgN312F4ViD4WlHLqp\ng7Rh6gjYb+jvI\/SF4xRG+upRKma58zKlNbhSuapv3ccye6DZGmVQeLr+CmjEr4fwYQ3NqsO02qrB\nb\/89BHe3YYKYcanOk8cu0mxk\/bQPC+OfIeFktwy7t3mQD1dxIepv+S3nY6OkBoLO7dDMdr56\/+r6\nM\/iZAqzxLO+dvtHIbAGeOZqBPZHlbvWy2BDlUxqEHY9oM5whcGexbLqKeZJ5ur+cNsV2YvQI5seq\nOYlTrjsYaN2Kh7fpMgM10M51obji+efF01koHEEYwmlYYlm+O413\/4kgNvs4kLZ4FqGVIrKra9xN\nX6\/nz1aRZ1xIRExvdDxsRDblwhpdKMv43\/gMeQzeOAO5PQCy1NfgVsTfCdzLUrpC5UvhNEPUw5vO\nI5gpUhcQzZXAFJ9yoItrz7gusE22+NdmFUjkV7nPsoos+uMQmTyQWHwcOGsi1\/Bffe0XWTybdcEE\nzxJfYVzJHHklz\/mFBexJ5VlTw0nPHYkcx7b1W1rti3HgFK4wTFGm+Xux9rbShpgPySfNLAg3gfou\nAI3LJKkjxLGmdId5lkRuy\/\/spyd7a2ssW+5IZHkEjHEms28FyHpY5Y1CavGL512RKnss\/+GP\/kPe\nki5tdhIjL9vyWv9fAG3URm3Ue1h\/Bxby8s+D2fZyAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/plain_noodles-1334209058.swf",
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

log.info("plain_noodles.js LOADED");

// generated ok 2012-12-03 21:23:09 by martlume
