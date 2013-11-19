//#include include/takeable.js

var label = "A Piece of Street Creator Rock Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Rock Trophy";
var name_plural = "Pieces of Street Creator Rock Trophy";
var article = "an";
var description = "One fifth of a trophy celebrating top street-creators. Four more pieces similar to it, and one mighty Rock Trophy would be born.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_rock_piece4", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "400",	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece4)
	"smash_blue"	: "550",	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece4)
	"smash_shiny"	: "700"	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece4)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-rock-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-rock-trophy\/\">Street Creator Rock Trophy<\/a>"]);
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
		'position': {"x":-13,"y":-47,"w":26,"h":48},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFe0lEQVR42s3YWVBTVxgH8Bu4uFAt\n2uoolVVRtOo4tmjtMoodcSuK1qXgFhSFUkBkh4pckVVZImtYjcgie5BFhCAXYthDYh2xpHTKONqZ\nLla0fejjv\/ceSEZn+koud+Y\/yX37zXe+75ycUNQ0PMo\/H21rGO2Rp7IVi6iZ9vT88ZitHWFRrm2D\nbKC5zZlxpmcMTvPvL7Y1T1jcGm4lKR2+h5zOylMzBqj+Wycu4ys32IziwSbk9cmR1VurmjnL+9cI\nUzjQiCIuEmUlriiKSfI0TRtmBFA+1sNkqqqR2lVuwJG0F8tmBJB9MSq\/xpa9jeOS0CFDkabFVtgB\n+WdsW+eLEeT2y5HWfRtXO0sNQEl3JXJUNWWCAodf6SStvz8iwExVDbK4ZDyo4Za7Arm9dZD21iOu\nuXCNYEDVi8ds3fMhlOu6cF1ZxeH4VBuwOT11kLAV+YIBO37TsPJfh9HApWSkgywrP8mT2OrJiiqr\nnwsG7H\/5hK162ofaZ4OoezaE69w0872oh\/JICfceoci3EGaTfjXKysZY3BzrQvXTfmT21yGFLSc9\nmD4FTVLcxMWWbFuBgDp5ke4++JSPq3D5bgESFTKkKm8joV2G2NYCMM15EG6KX+sYPbDgcRtimqUk\nElUVYjms\/l1QYCVXOR6Yqb6D7xuyCCi+\/YYBN2OAfAJuJhiQ+lxqko4Lgqv6mRVLB+rYgpE2FPyo\nIMDgihRcKEsmsOjGHIRXp+NSs5QV5IjLf9iIqNYcXKi5hqt93DGnrIBP4WWclUYj8FYSzpckkggG\nrB7vQXJ\/BcIaM5CoLEV4bQZOpIfAtygW\/rJ4QwJLkoQBZj+8gzhVCalifFcJcn+4C3FGOLzzYwgs\nrCqNJLQqjREEyONilTKEyNMR3Z6PYq4Hw2qukypG1EpIH0bVZ8JPFi8RBBjZko2g2hTSgxHNmch\/\n0o5rD27jeFow\/G7EERw\/NH7FVyZklR1sQ9tDuVr90jhHnvr1aCAP4+NbeoV8ZmjvIK23hgDPZEfB\np4DB6axI8p6QI0NMfLZx9kP+FpfRWcqezA7F8cxgfJMWAG8ZA0ZRiItNuYhuyoM\/tx\/6SmMRnpWO\n5JwSBEcmIiDkMoy2OUelpCEiOQWhiVfhH8MYEhSXgNjsPKTekMHHLxQeJ89B7OU\/ftYvjPUPYowz\nzR1qtbhPPYoBjQ5DWh3U2p9IBrnvA5pRSIvK4X7CCwcPe+DoMU\/tEW9v4\/7UalEMud29r0YbOwxF\ntwb3lVqS9i4NKus74HkuEAf2H8Kna9fCYb653OgTXF9Vx\/4fsKmlG+GRcXB12Y1V82bDfrYIdmaU\nca+efhvn2Ma6b8X5XZsMCdi5Cd9x2b3eESvniODAwZZz4YHWppSb0XA+TuZuvpvMtUl7LXFsBQ2P\n5TTc7WkcsTPF5gUiA27FFM5ulgg2s6jpP0W8P6YsvnUyZ4K+sJhIcrVEoNM8nFpJ44QDTaD7bGgC\ne7NyetwyM0o8vVXb+M4GxmXxRNAnFri43RLBW1fitCNNIl7FITmoi5UZqdpbuOmG6R+PFWZispRc\nzq5fgOi9TjizmobXGhqeHPIra1OC0sNsuVgbczAOWJkwh21NSa95TQHfrKDj3EmUPjZclhmrenrg\nIQ541N4Up9dNAk9yy8r3oKuVKQHxsZ6KFU1NLKQo42zM+9Z\/6LZjsYj92sYUfBU911ogxHk1GQw+\nWxaawMqMoNhlNCX5gKYYS4oy3v33S6v35Vvmi\/D5uyI4vyeCq7U5vD6yxp6lJiS2XN9ZcjjBbmw7\nFlIWLotF2t1LJkH7rWbhoN1cuK+ywGdL52IpLcISEypQ0L\/XjnDIc3u2Bu7avOHel+vssd3REjsd\nl4w7LJjHLKKpbdPVb\/8BXPv3EEXKfNAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294354006-8880.swf",
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

log.info("trophy_street_creator_rock_piece4.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
