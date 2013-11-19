//#include include/takeable.js

var label = "A Piece of Street Creator Dirt Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Dirt Trophy";
var name_plural = "Pieces of Street Creator Dirt Trophy";
var article = "an";
var description = "One part of a trophy for contributing to street-building. Four more parts like it, you might have a whole trophy! A Dirt Trophy. Like they say: where there's muck, there's brass.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_dirt_piece5", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "400",	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece5)
	"smash_blue"	: "550",	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece5)
	"smash_shiny"	: "700"	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece5)
};

var instancePropsDef = {};

var verbs = {};

verbs.smash = { // defined by trophy_piece
	"name"				: "smash",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return "Smash this trophy to receive "+this.getClassProp('smash_green')+" Green Elements, "+this.getClassProp('smash_blue')+" Blue Elements and "+this.getClassProp('smash_shiny')+" Shiny Elements.";
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!pc.checkItemsInBag('bag_elemental_pouch', 1)) {
			return {state: 'disabled', reason: "You'll need an elemental pouch to collect the pieces."};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var n_green = this.getClassProp('smash_green');
		var n_blue =  this.getClassProp('smash_blue');
		var n_shiny =  this.getClassProp('smash_shiny');

		var remainder = pc.createItemFromSource('element_green', n_green, this, true);
		n_green -= remainder;
		var g_destroyed = remainder;

		remainder = pc.createItemFromSource('element_blue', n_blue, this, true);
		n_blue -= remainder;
		var b_destroyed = remainder;

		remainder = pc.createItemFromSource('element_shiny', n_shiny, this, true);
		n_shiny -= remainder;
		var s_destroyed = remainder;

		var result_string = "You smashed "+this.label+". ";

		if (g_destroyed) {
			result_string += g_destroyed+" Green Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (b_destroyed) {
			result_string += b_destroyed+" Blue Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (s_destroyed) {
			result_string += s_destroyed+" Shiny Elements were created, but destroyed, because you couldn't carry them. ";
		}

		var produced = [];
		if (n_green) {
			produced.push(n_green+" Green Elements");
		} 
		if (n_blue) {
			produced.push(n_blue+" Blue Elements");
		}
		if (n_shiny) {
			produced.push(n_shiny+" Shiny Elements");
		}

		if (produced.length == 1) {
			result_string += "You received "+produced[0]+".";
		} else if (produced.length == 2) {
			result_string += "You received "+produced[0]+" and "+produced[1]+".";
		} else if (produced.length == 3) {
			result_string += "You received "+produced[0]+", "+produced[1]+" and "+produced[2]+".";
		}

		pc.sendActivity(result_string);

		this.apiDelete();

		return failed ? false : true;
	}
};

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

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-dirt-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-dirt-trophy\/\">Street Creator Dirt Trophy<\/a>"]);
	return out;
}

var tags = [
	"trophypiece",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-36,"w":23,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFw0lEQVR42s2Y60+TZxjGX47DIS0o\nB6EnKCAiUzKJFUToEAVbKj0yQISicm45DIWWciiiyKnQmOAiyRaWJUtMls0PO2T7YMjidHGH8G36\njT+hf8K1535KWUWzLyu8NrmS5337ob\/3uq\/7fp63grAPnwWfz+5b9m\/4VlYGfT6fSniXPi7XvNS3\nvBK4PXMXpLuzc5hbWNycm1\/Y0Gg0xaIDMtfs8wtLGPNMYmTUBZfbw9XR2Q3NmVKcPl2mFRdw2b81\nffsOxie8uHlrhMvRPwCzxYqz5edwub5+XXT3JianuYMhwD5nP+qNJtRe0sFsNttFdc87PfMGYE+f\nA5d0elyoqd0S1b3Ze\/McjkS5CwG2ttl5\/jSaUvHcW\/Itb01OTe8AjrrGtgFHUWe4jDOlZSgpKZGK\n5t7MndkduHBAz\/gUzlVUoqa29rFo7i0u+bbC4TzjwfxRmbt7HNxB1hzad8a9f\/Pngr7OAJPJIt5o\nWVjybYTDhcpLLpotNpjMFlgsFnG2O9pnaSvbDUhD2uUeh\/ajKuaeeUPM0TIYmnu71dXdyxrjkriA\nC4u+x2+DIzVfuQqdvo7yJ1733ptbDAS7doqXNRzQZLZuO2jxipo\/gqOuHfNMvAFYdb6axotRFMCV\nlRUtnVpGRt07My8c0NbQiLKz5WhoaBBn91j2+73UIKH9Nhxw+OYI3z1Yg2yKlj8C9IxP7ACSk1Rm\nOqReazGj+sJFyp9\/\/4\/0DSnSySbFurutZCv8xBKuvo4rHHDf87fWpZbOtavX3TY5OnRK7tZuuKFP\nhnGjrRkVJ9Oh\/UAaqDietD+QnzkKVauOgs1V5zHMtquxNKiFy9nCgVpaWmEx29DY2AxrjQb2umLU\nl6YRILRF0r0\/pD50Hi1evJ4bmL6iwv3eAjAXMXM1Gz16Oeav53LRdbdeiTutOVi8kYepZhUatTIO\nWVmUZN9TuAf9hRxusknJ5bIp0FeXiSGjjIPRvc7aIxi1yvna87GCr1urM\/fWxeXuo8X+rvwAuRKC\nm7XncDkNMow1KOC2KTFQL2OAmRyMHqRPnwl7dTrOn5QGAZn2BPCB89jGclf+DlxIN81K9NYpeYm7\n9Qq+JnXpWPPUyrhMZak7cJVFksiPm\/t9BUYqX6iEn\/YX8jU5NGpTMdeUrMwMUJeFxso0tJ0\/Audl\nBYfv1sl24EjnihIj\/4\/C2sBx78PB4yCFl5i6mBqF1gRL342wvPUy2FsWJbwt2dCdzngNsLxQEvkM\nTjQpvQRBHTneqOQ\/TtdOQxbPGt2jawIcNivgMCgwbM2DqUL1GtyZvINQH4xBVpwQmWN\/lzpF2pN\/\naH2gSeOlH+zbzhc5RM3gMARzRnnzdeRxh2nMOI3ZMGoLXi9toQSq96Igi4tigFE4EiP8\/3HTni3x\nX89OXn\/y9C\/v19\/8gFmvB\/0tVWiukqGJZc1WngpL2WFcu5iFW1ZyluWQPYC1KghXejQJp3IScUJ+\nAGkMLj1GQBopVojMwaFZkYQWpSTw6Iuv1n968gLf\/fwM337\/C7589CPm7s3DPTqCrrYGdJpOYahZ\ng4HGEpzKlSOVQWTEClDGC5DHCUhna7qXHM0VSBGEyBy7LFmJsDJ97l\/F0xd\/49cXL\/Hs95d4\/scr\nPP\/zFX5jWltdQ7tBh6oTJ1CWm4M8XkYBCgaXHR8FFZOSSU5lZaDJUULk3ksMaQkbhowDcHd0Ymrw\nE3iHhjG9LUd7J\/rtHchPiEIeiYHlMqmZDjG3kqKDzsk5bBCQsnc4Rojce8mFQ\/Hei6kJMKiSUJ8t\ngV4pgTZLgsLEWA4TLvW2cihrDOxgdFAEKiXY7bJnRAuDEQMsT4qx16QnQJsai8L3o3jJcsJg1LvA\n6HuSgrmWGAbIcrfOnDOmC0Jkh\/SHCYLqbLJgVCcIXhZ4rypO2AxBvE2hvJEkQUDa1vb3PUQeK2jD\npYwTBlXxwuMQWChvKdGCeO8g\/wG+wRSgYRyJUfIPd8vv6RlcKg0AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294353866-6067.swf",
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
	"trophypiece",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "smash"
};

log.info("trophy_street_creator_dirt_piece5.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
