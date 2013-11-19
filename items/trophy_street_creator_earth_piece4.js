//#include include/takeable.js

var label = "A Piece of Street Creator Earth Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Earth Trophy";
var name_plural = "Pieces of Street Creator Earth Trophy";
var article = "an";
var description = "One piece of a street-building trophy. Five different pieces of this - the Earth\" Trophy - put together will make one whole ornament. Heal the earth! (Trophy)!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_earth_piece4", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "400",	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece4)
	"smash_blue"	: "550",	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece4)
	"smash_shiny"	: "700"	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece4)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-earth-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-earth-trophy\/\">Street Creator Earth Trophy<\/a>"]);
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
		'position': {"x":-12,"y":-33,"w":23,"h":34},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFzElEQVR42s2Y208TZhjGudvl\/oDF\neLlkMWGLTpBTOQqWQlsObSn0IC2FHoBSKjAOFhgo59ICpYWWylEG1iJIZVap06jTZONqBy9mp+xy\n2m33y7PvqwEdZWocrX2TJ01Imvz6vO\/7fc9HTEwYy2yZYrR396G71+i22WwfxkRbUcBTnALkcguh\n0tY7ow6QusbhCZDJzAWHx0efccRttjpiowqSL5IiLTsHKRlZyGKyUCI+DYW6dkvX2Bg7NjV16L07\nWFwqCsIlpqYhPjkFnKJiCMVSlCsqodRU45sHD+G9c9cQcbjRUfvhPuOYOyOHuQunqtGiUq2BjMBJ\nymUQlokxOT2L9Zu3fBEH1DW1GlIyXzqnrKlDlboa8kolpDI5RNLT4AtLoVCqYXNOR97BQkGpj8Kl\nZp3E6IQTrHwuKlVqlFdUQnz6hXu8EiG4pOWsfE5txNvLKRaASzZ4ZtEFhaoaSSkM4l5VsLVlEmnQ\nveazHTCOWmGyTrLDDrX54PtY3\/3vDFSuq19vTVyYx6L7KkYmnVDX6cEuLMaX5\/vQ0d2Drt4BzC+v\n7CoicBu37gYokGVqBiabY1+9CrWrpRV32OHWb94OUKf+C4zK4pjeF3Du0hVJWOHcnhtvhKMaJ86G\nwC2t+MPq3tLqhu9NYDuyz14MAVxe9VSHFXDY6nC+LeDsV5cj6x4tk80ueRs4q3MuxL2FpVVG+OMU\nSSZGy8Rr4cwTU6HuLa8YIwJXo2vYKuCXYOg1kBcWlvceK1tLS96DDa+d5\/udpVIZsnJZWwKR1Mcv\nFfnyCopwNC4enx77HDJyn+4H55hb3OtcYNa1drB50GSxS3ilYjDInZqUnoET5Mo6npiEo\/Ev4DQ6\nPXqGzCFtjQgcreb2Lv9LuNRgtuORjEcTyvGERLjWr\/8Ljp6J+7U1LHAmq722isSkHbhsVj4mphdg\nJ+5QMLfHG7Ktexdi8fJqYH3Dy76+ucnYkdd7ADNI4cQyxS5cHGlrW+c5DI5ZQxyzkWBAU8velrrW\nPP6NG5sIkfemf8O7+f8STMe5\/kAygWOyuUGw7r4hokFo6uohJZlOIq\/E4Mh4EEah0pAYVUGSSi8W\nLl1Bd\/8QegYG3dZJh980Og6rfQr3vn2IZ78\/D8r\/61PcuHU7sLG5+e5tJ+\/ZQAIjFQMmC\/RNLcg+\nxQwqn8NFFnkEZZ7MBodsMk8gRBpJznFkHvlCoUuuVPv6hoxbGq3OIFMoUUOiVnvXOaxf28DTp9t4\n9uw58Dfw5x9\/YXhszD88bPn4nQBnF12xvUaznzqXmpaODLIo6QQkLSMTicnJiDuRAE2t1s0hOe8U\nKw8sNudH+j1Nvd5HoNglZeKAQqkBOZIgLi9HU1sbSdY2rFzz4JH\/MZ5s\/waLfZKcAEPzB7IwPzx+\nHLejR9vbH+38vatr8BCBQ1YO0\/kC8Iz74uKyk7qXSn5MMon9grIy1Dc1kZEYIbO5FIScv7SModER\nnO8f\/CXstwqLw90SScsDQUCd3lChUjszTuYE206Vzy0gb2E1WjvaMWA2YcRmJbBmtHZ20Fm9G3ZA\nqVxuSCcz2dLRIaGAjW2GJ9S5HcAUMiKFfD4qlErUNTSgoaU5+Klv+gKdPT28sAPK1OrDdA5VWq2\/\nseUsW63VERgVMrJfuphEgHPJKBSXlARbTn4UbftCxF5ypMXOOv0ZrHk87qpqrV+jrSPHjxoy8pIr\n5AuC\/1Gg4hbxIK9S4kxzi8Ns9nwQMUCFQvFhIY8fkCkUkJNW0sWp0zeQp2X7rs52dqG7p895edXD\niHkfJZVV1NJWk+0NMMghn5qZaXCtrcVSoPcG9Wp9cuSI+7Ojx8DMyyM3js4fE011PD5RciIpGUWC\nkuCZ55yZM0YVILlZ\/My8fFRVV8M25YDf\/0QSPXAJCWx6lPCEQjS2tuLOvfsgxYgi9xJ9tL2lEglG\nxsd9P\/38CNE1fwkJhniSFwUikc9utx+eWVhgxERbUUhucfGBg\/0D5e8fSf9SWWQAAAAASUVORK5C\nYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294353924-5280.swf",
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

log.info("trophy_street_creator_earth_piece4.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
