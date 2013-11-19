//#include include/drink.js, include/takeable.js

var label = "Crabato Juice";
var version = "1337965213";
var name_single = "Crabato Juice";
var name_plural = "Crabato Juices";
var article = "a";
var description = "Mmm... all the goodness of crab juice, plus tomatoes!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 50;
var input_for = [];
var parent_classes = ["crabato_juice", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "20",	// defined by drink (overridden by crabato_juice)
	"drink_energy"	: "0",	// defined by drink
	"drink_xp"	: "0"	// defined by drink
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

verbs.drink = { // defined by crabato_juice
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood. Grants 'Crab State of Mind'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? 0 : 1;
		}
		if (failed != true){
			pc.buffs_apply("crab_state_of_mind");
		}

		return failed ? false : true;
	}
};

function parent_verb_drink_drink(pc, msg, suppress_activity){
	return this.drink_drink(pc, msg, suppress_activity);
};

function parent_verb_drink_drink_effects(pc){
	return this.drink_effects(pc);
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Drinking this will put you in the Crab State of Mind (does almost nothing, but crabbier)."]);
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-32,"w":19,"h":31},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJeElEQVR42r3YC1TT1x0HcE91a9dt\nta3tdrq6erSbtdXVbqXVbm1TJ9u02qp1rbq61ZVW6XwAOl84C4qAIKCIAj4IEIwJrwARCEJISEiQ\nSEhIQhKQR3gZQAgglDf2u3uvLedk9Kxn82\/vOfecfxLO4ZPf7\/7uvflNm\/Y\/jOHh4TkDAwO83t5e\nXmtrq4\/Vag2oqak5WV9fr6ytrVXabDYleU9ZXV1Nn0\/a7fYAi8USUFZWxlOr1TyFQrF4GtcDwMyx\nsTEf8g+NJpMJdDY0NKCvrw83b95Ec3MzHA4HCBIECfJ3IChUVVWhsrISGo0Ger2efUZnU1OTg3yB\nk3l5eXO4AvZSCIke+vv7QQd9JmgMDg6ip6cHHR0daGlpYUgKNBqN0Ol0KC0tRXFxMfLz8yGTyXDp\n0iUUFBRAq9XCYDBAKpXy7hlIIRMTE2yOjIywqLW1tTGsy+VCe3s7SLpZVElKWYQrKiqgUqlQWFiI\n3NxciEQiJCUlQSKRMCCdRUVFICm\/dyBFUAzF0eeuri6W3rq6OpZKGgmaQhoxGhkKo1H7CsCQ9DVZ\ng+wzGkk6r1y5Qt+7d2B3d7eSwui4c+cOSy8pFIalkaPrj2Lp+iIFArPZzMCkMBiIRpCkEjk5OSxy\nFErhonRJL\/lC974OV6a18nZlWqBvcMI1MIxvGqSqWcToWqOQjIwMllaBQAA+n89eU5woKxfH4lPw\ntt9xPLjSV8lJkdh6wesZGkNlbROi8g2IyNYiUa5HgqIKIq0dAnU1zsquY9+5TOw8LcJnkQJsDeNj\nxYEYvO4TiTfJfPdgDJb5RWKxdzhe3RWJp73C8YONwUquqph358svMT5xBzZnLwaGR9HzxTAczi7w\nyxrwbpwKy0\/J4RGQBv+kfAQLZVi0NxFz\/fh4LYBEUWmAoMSMQkszSuyt2H+5BM\/uOMstMChbh+sN\nHaho7JgEdvYNotU1AO+cOqwWWMCLr8C1OifUNW34U3QR5gdI8Yeoq8i4fgOisppJYDKJOAU+seUE\nN8CH\/h7L80x34qJ1ECWO2wy4XWKBoraTAf2yqxnQK808CdwlKncDLjmShvdO5aLE1gohWRYU6LE\/\ngRvgOgV478nHkFgzCu3NEQbcI2vE58o2BvSRmBgwVH4DKRobkjV2xBSZ3YCvHc3AhhgZA55XmBlw\nZaj4\/gJP6u5G8BORngHTDS0IlFxDWKEV2fp6zDskmQT6XlKDr6pGobkJe4UqBtxyNvf+Ab9egwZH\nJ1ZdKGdAY9Mt\/OW8Ap9croC8uhm\/C8t1W4NXCU5pa0ESWYPzCDAwU3t\/gRUN7fBKVGFjWi0+ldgZ\n8K2oQqyI0zDghvjiSeCOJAWiZJXIJM95xka8sPs8TuTquQEeNkwFGpq70E5OEJ1CBbWsCLrqBpgI\n8KLajouaGwwYXWDAzpRSXDXW4YPTufhzdB72XlahiFRzcJoSKr2Ju20mtGoc5u5x2G4NYajOgo5w\nH9R\/6gnLpqXQvbMIimVzYRNdRGVjO6tiQ30ru1SYjOTGkp4KVbGcRLEYoTk6tt2YrDVIvnCO+426\nr9aC7sOb0ea3dhJo2rEO9nNh6GptRkC6BkckZeyGQ4H0rD5\/KhLBB\/ehSKuHzOQgEWxi57Y0M5Mb\noLqundd4qw8TQ4MYOOs\/BegsV6Gu3YWtAg3W86\/jc2mVGzAqKACBe3whvZKHvKpGROXqcDI4CL5e\nW7grknXiGxg3qtEf6u0GrDr4MTLlOmRU1CNWYUV5mD\/qNEpYLWYkxcYgLiIMQft2M+DFVCl2JpMq\nP5ePTLGIW+Bh\/ThGJHFuQOfFUOiae1kVe4kNKPffCuH8h1AaehCl1Y2QZUsQcnAvA2aliuAvUuHD\ns\/k4dFmBYn4c1CUl9xfYsGsNrpGzNUDugCUtGVdXvcSA5TGhWB2rYlVsqTKhSpoKYUYu3j6Rg40x\neTiRVYpza3kITOZ4ox64Kp4EOo9+ihsmC8zk8lkXG8SqWOrxJAPKlVo8f6yAHXWCfA2SfjkD6sgA\nWBUFsKmLUS5KRNRuPyzcGcMtsLa+xQ3YGu7nts1QoDxoP9ac18IjnFxe9bUwixMYMOEXM5C6+jdI\n37gclzYsR35KEvfA4jbyKy4jdkoVU6Bq9YvIOnKIVfGSKCU0Vgcqj\/8TmQumI+UroGjFixCvfwPJ\n695AxKtzEROXyC3Q2DWBYX4QXATYGePPIlgfuA3ao3sQnnKV3QdfiiyFpKIO9uRo5L0wnQGF82eA\nT5BCz+chfGcJElctQcjzjyNu0yrugUNh3uj9fDMGa4yIqbiFQHLlolX89YU1Sm5HU2E2ihc9MAUo\nePNZJP9xMS54Lkbwc4\/iwOzvcQvUdY5j+HIkA95WZOHEtU5IrF04rmpmwC1iE241NaBs6aPfCExe\n\/gz4qxYgfsVzOLbwEe6B6fWjGC2VMmDXGX9k2nrg6h9EZbMLH1yuRm3bLVT\/7XVofvXAFKDA82EI\n\/eYhyWc+4j57FsHrZ+LAAg6B4oYJlmLrzT7cJsedczfZqBVXEKa5yVLM17XAKUuFfvEDU4Cpv38Y\n4p2zINjxM1zwno3THz+FY+\/\/GAc8H+QOuE1zN4JnTINobO9F5wkfNGz1RGP4HqjIdatVUwzD2kXQ\nvegOzFryfeTsmsWAidtmIe7jxxH54UwErX8YB1Y\/xP2FlQLDKvpQ5BhAVxYf9h3kNCHbTOFb85D5\n8k9QuHCGG7DgH7Mg3fPkXeDWxxC7ZSYiNv3o\/gGt3XcbSRHXXfBXtkNW242O62oY1yyEaunjbiku\nfPuHKPL\/6XcLbOkfZ8Azhh7sljvR1vMFXJnn0bhyNqxvzJwEKn49HaUE950AI6onPvoamGwbgtA+\ngMOablwyu1gjyflXjylA7aZHoAl86r8C\/d\/\/eTv92X3vvZm+O8b\/XIPHrnWjb3AYA7kCONcvcANq\nX56OypCnvxV4xMuDNpTWcHHlT8x2jCG8asStSEb6XOjxXjYFaPB67FuB+9c+idhTx2nfcA4XwDnj\n4+PG0YkvUVTTibDiG+gfGsWQNAE9H73iDnxlBuyRz3wj8JzXE9i7fi68N69AaGgoxGKxD6fN9JGR\nEZ\/R0VEH7UnTJqU85QKSQo4g8l+HIdiwDPGrX0HsZg\/E+v0WJ3e8irBtHji9+y0E+m3C9u3b4evr\ni0OHDiEkJCTrzJkzc6bdr0G7\/mSuIQWSODY2pqTtYdo0VyqVrElJu6np6ekQCoVISEhwxMfHK6Oj\no30iIiL+L9S\/AU2TK7hl25f+AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/crabato_juice-1334340373.swf",
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
	"drink"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("crabato_juice.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
