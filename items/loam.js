//#include include/takeable.js

var label = "Lump of Loam";
var version = "1345779759";
var name_single = "Lump of Loam";
var name_plural = "Lumps of Loam";
var article = "a";
var description = "Ah, loam sweet loam. Moist and fertile, and leagues above plain old earth, this rich, meaty chunk of ground will do any building project proud.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 10;
var input_for = [190];
var parent_classes = ["loam", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be dug from a <a href=\"\/items\/756\/\" glitch=\"item|dirt_pile\">Dirt Pile<\/a>."]);
	return out;
}

var tags = [
	"basic_resource",
	"earth"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-26,"w":58,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEl0lEQVR42u1XWXLiSBD1z8ywIwkh\nb5gd2mA2g2mMjQ1miejoGDdH4AgcgSP4CBzBR+AIHKGPwBGy8xVKLGRwz8zHbEFFZEgqVWW+fPmy\nBEdHh3EYh3EYh\/H\/H6Nnsyv3g0xkUj8LzGonwckwrYf\/MVD9r1pilDW7w6E1GzWj81HOXI7yJt3E\nQlQ5CVAvbVAnqVPjPLgA2HYs0L079ST+HnBZY9avmMt+06Snlknd6wj1sxECwOppkG4vwnQXD1P9\nLEifY2HqpnXqZQziRBToyol\/7gaLhP8SmOFQD6NUiq1MZMzMLO8TmgLR6USoVghT8TRAtwxowCA\/\nM4N4B2vH16YA5zV6qBubd2ouob12asZ09O14+vS7Vf1z5XtG+Rhc13plUKsOg0LZnpiJx5ROHRtk\nkwEJYAGz09JhqsSDW3NY3x9GVaJlZrUd07p\/GOTgW3QyHFmrp35Uacrp+IHLhHKirAArADeBMxp1\nSvo7kC0Hu8JqpRCi\/LGfpbGOMcyZLz9lTwHMRyaDUoS6A5Mypm+7dAzgNvmeJawpWH4qH3OTPJpq\n7po1WeJnpzXPGVTUR7kzP+XYN5K8S2pcjTA3VWj+seaerddRyZgObHaa8RA1zrZLA3C9e3PDCpoB\n12u+ZiI+erjjvT1TPdcd1lBNE1IAASxheKnK1UESKb7\/FPVTUvON9zaDOtO+WvPBQ1RprZPU9mqq\nUzXoOh2im\/PQBkCZgyEwGK7mQ1SzO1pK277UqJYNUZFZvmIDQABLOCymefbrsFcxpt1rgxpXYaU7\nyc6tHbH6RUgFQtmw7up4DRCaLNullLKCuVKOE6lpzJRPWcIFDvZhefmQXbEGFCuiKdy3wBgHvXfY\n3Y6OLbLY8wzwxu5ssIor9oJdAIAESnYi7wDq3uVecGn9KOwUMoCBAegGwv\/Ednn8ZkUOCI0KOOgN\n5RJGwSASa3EiYBb6Ske8yhfWFO0Si2X4Xc70LvZ2bv9LdN6q64oB0F+wA8Fwn9+RcZrZaNsMuTvV\naeJLEkgab0DFF2LeVDTCoS39sPWxf3w0pjgwM5ZPZYuM4PQyunYCgJjbBsiOT\/z0yB2NPR+BhKUV\nS76NbxhKLgBhDHr3F6WWDI5l05XNmDwDJEoiAMHA5ky74o5NrmUgdukCi7m0vRd+pYuzjqqINstm\nYHcX4wUWYDPYEC3hOWVn6GQPz26GhAX3PFgTQ5Lw724SlbQVWDHQMQOf7QUopSxa70vmzDjpaIiC\nzW7OZkeqALA507dV\/l0NIpYz\/S95LvG59kv1VPMkcD260H4dw3jBikW\/UuK1mfsIoHReydGhUqZ1\nkuu1lzu0Kbp2HzHNWHDBcZc6nyg4sNWhHTc8c5koWoGZHBsFh+b2WcoG4DaAS22k8Ha8vEnBL6BW\ncc0zQXywlTW9LwndswBhmFOlxY1M8IZXNwhOYLbL1Fp2hiBgXA5iZ4fja8TX77uSw2cQZy38CJgG\nX3f+8gZ7yAALkdE6sGcBdn\/2s0ytdQRGsm\/vvK\/wJzHi2m9TSRC\/kFRnO74e0F9OzftW\/9o\/YEgE\nDXL4K3oYh3EYh\/EfGT8AtfYRvKcjeX4AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/loam-1334269500.swf",
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
	"basic_resource",
	"earth"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("loam.js LOADED");

// generated ok 2012-08-23 20:42:39 by martlume
