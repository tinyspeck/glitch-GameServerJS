//#include include/drink.js, include/takeable.js

var label = "Cloud 11 Smoothie";
var version = "1354593729";
var name_single = "Cloud 11 Smoothie";
var name_plural = "Cloud 11 Smoothies";
var article = "a";
var description = "A Cloud 11 smoothie. Pretty much the best smoothie ever invented in the history of smoothies.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 69;
var input_for = [67];
var parent_classes = ["cloud_11_smoothie", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "5",	// defined by drink (overridden by cloud_11_smoothie)
	"drink_energy"	: "0",	// defined by drink
	"drink_xp"	: "4"	// defined by drink (overridden by cloud_11_smoothie)
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

verbs.drink = { // defined by cloud_11_smoothie
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $xp iMG. Grants 'Sky Cruisin'",
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
			pc.buffs_apply("sky_cruisin");
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
	out.push([2, "Drinking this will give you the Sky Cruisin' buff (a nice mood boost, every 10 seconds)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && !pc.making_recipe_is_known("56")) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> and complete the associated quest."]);
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-38,"w":18,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHj0lEQVR42s2Ye1TT5xnHs7Ojraud\nulXXatVpsSjd2uFK0a6tdnbTntniaq3O4eScVc8Qqy03SxWByl0QlItcilAghksgotQLLUanQAwJ\n5IIkhEASYriHJAQEhLPv3velrmp7dj0\/3HvO9\/DH7xfeT57nfb7P84bH+y9WQ0PDXJ1Ot91gMOxR\nKpVpGo0mjP59UFKptFIikYi\/1n4e14ts4qVWq3ONRmP8wMCAH4D3\/l2ZzeZw8qVy5XJ5vEwmm8UJ\nYH19vXRkZMTnPwF7UM3NzSVNTU27OAEk\/\/wIiUA1SZ+4ra0tjUaFikZz1Cj2c9QlhduuJYY7Wy6w\n6Pb09ATdfYeCkaNxjXz2NEn9Gk4AyTcvGBwc3HWdrPMVpcrWq9nj6it8qC7nQ\/lVHhqrctFwMQfy\nC9mQfZEJedEn3arzaUq9SnLabreXEOj9nZ2dvpwD6hRX1RMN8RgT78FQ8auwnXoBvSeX41byEhhi\n50MX8WPcDJkJ1YEZ0ITOgjbaBd1fxVruDPUFEcj1JJq\/5wzwjr6sfOLmZxhvOIph6VEMnfeGreBX\n3wKkYK2fPoG2qHnQxbrALNyDDr630yLySyARDOQE0CgprJm4\/hEmVCkYa0zG2GVfDJW+fn8E4xag\nPeYptEc\/iY74BQxQG7kEpuJd6ONvhCXjJXAGaKuN0Y\/XBOGOKh3DsuO4\/dcDcBavhS33F+jPeg7d\nac\/CkrwUpqMLYYybD8uxRSySmiOL0Vnuhx7BZnTy31FyluL2C9H6v9X6Y6L5FEalMZOAF\/8Me8kG\n9Oe43wdII0hTrDk8B6ZUD9iuRqGr3BeNIXO5A2z8fA8suRtIBLMwrkzF6LUgOEvXwf75Slg\/ex49\nGW7oSnGFOWkpOhKXoDdvHfoKf8c+Y8jbiuYET8j9Z3RzBqjI94OBRMP6ZSj6K3ZhQPQnOM95Y7D0\nTThK3oS9eANsp3+L\/oJ1sAo2wpj4LLSHZ0N94AfQpf0GN+NWcguoOvmW2JTmCWv1YVjP7Ya12AvW\nvFUYyHmeyZr9M1IsK9B5wgUdCYtYmlvCfoSmjx+DLmUNmiJXQH54GZeAXmLjMVfYLodhoPIvGCh9\nh1mMg6SY6t5iuXXsp9944icz0ZLkCeXB+aiPXAmFQvEWNz6Y4SWmm9rE4bCd94W9fDMcp1+Dk++B\nIf5LGMz\/JYsktRxaLEZiObRQmg8+jpYEdyhC5jFAsuZwE8G895PopnZxBOyk3TpEW5jN3C5ajdvF\nqxmknUSxL9MNncefgSn+aeiPzEXzoR9CE+uGxuDZqI97jTtAtWBfGN3UWukLx0U\/DFa8h2HhrzEm\nfAVjZa9iuGgVSzVNc1eKC7MbfeQ8aA4RL4xaBvlHj6A+08dJAB\/lBFAmFu40HX0afcJtcFzaC+fZ\nrbhd9gbGRWswfmYtRopfhoOkuZ8US1fKMlIoXwMSs26OWATZh9PQmLZZydnASqcQGpXewvWTgOcI\nYPkbmKh4nWmk5GV2Dr8LsCl0HmT7vof60qiLnAHSSbg1az26sjy+HUEieg4d+d+R4tDZUH38OGQf\n8NB4NvE4p2O\/Nu8Phs4Tz9x3BkdLX8EoOYfDglWw57mTInkO9B16HGiRaEiRKAMfYYDEYnZwCqgW\nhogsx5eSLrL9nipexSrZWegxOdlkrAB9x0immVZaxQcnAanF6PX6hZwC3rhx4\/1bycucfflrvvFB\nAkblYD355+hJd8WtpLuz4RPMqBUB09GQvk3P+c2O3CsWtxZsd3alr2CtjnYSmlaqARI96oG0QMyJ\ni9lc2BJOWl3IY2j0nwZ5WVwKbyqW+lJ2ETXi3lOrYc31\/EcvpsXRk76cpZcWSFvUT8iwMIcNC7Lo\nF9HS0rJ8SgDpRm25m5w0Ur3Z7ixqVD2kxdHqpX2YtTlWILOgCn4U8pKwIt5ULrWkKsKcQuwk1ZUN\nB1QMjoz9dwdWHUkvPX8NGVudBoPhySkFpJ6oLfXXUiCaUipaGHTMosVB7YXNgqFzobhStoP3MBap\n6J3tKStZQVBN3kUWsLNHo0ftRVGwX8J7mKupOMBMoagMsU8xOHYXIe1NTdpb\/SXBuw8VsP5KZRKF\noqJtjfoerVx29tLftfEe9iJpfqHp5EY2OVPPo+eODqjUWqSixFze\/8NSFOydvP+SnksjR+GUgdMx\nJb8J\/rNVUFDgkZqaukN6Nn2Y\/hZDL0fq4BkMTh40C0KhcH9YWNiiKQc7c+aMa1VVVQCfz9+dk5Pj\nU1sSr6FmTAcCRcA0NHz4fTYYVFRUxNDnmZmZbwsEgvlT1UU2tbe3a1UqVaFIJPKhEovF2ZJMH40k\neRORl6Yu6W1NrShdXllZ6Xv3nerq6sDa2lp3bruHVLpQ16JtNpvNMJlMFjJh76upqfH5V6qrq\/Ml\nXyhCdqPu2Ja1bjM5A9zi5jY9LnjfTnWj\/IsOo7Gzo6PDQiL6gVar9dVoND4PijzzIwrU6XSfyiXX\nowUZadx7IoUM3rHtxZMx4QF14i8jTYa2kK6uruDu7u7Ie2WxWOJNJqNBJZeJzgryA0N2+yyf0kKh\noH9c5+kW5b\/XOyv+yCFBVmr0vco7kRBBn3mvXe3yv+zzd8dIwUb9eUMiAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cloud_11_smoothie-1334208276.swf",
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

log.info("cloud_11_smoothie.js LOADED");

// generated ok 2012-12-03 20:02:09 by martlume
