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
var parent_classes = ["trophy_street_creator_earth_piece3", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "300",	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece3)
	"smash_blue"	: "450",	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece3)
	"smash_shiny"	: "550"	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece3)
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
		'position': {"x":-8,"y":-40,"w":16,"h":41},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADxklEQVR42s2YS28bVRTH8wVQPoI\/\nQjbQRYWU1O\/x+zUez9jj8Xg8fjRN3TZtyAMxSZsmpiClKoVSAlgKVUNpUtM0USFpNKCIBQvkBRKC\nlXdsKuGP8OfecZ02qZtVNTNX+i1mNvPTOXfOOfcODb3l5XQ6HSzHrYiSpNdqNWnITmvM46mPud3d\nMx4PKHlJApEctZNguy9Hcfl8UFW1bVtBSlYUMT4+7rBcju6943KUcDQK2+xFItR2er3oc4ZA01yu\nVFq2EHT6\/U2Xz48evkMKsoxyuTxsuaDbH9DcDIPjhGIxKqhZLuhhmFFvMIhDAkF4XkBKTtfyKDoD\nAYcvFMbrhJDiOBpF638WfySKHpEjhOMJqOVy03JBJhbTA2TPGURfwhDUSkW3XDAYi+tBEq1BlOzQ\nVULJlB5OphB6lUTSIE\/KjbVlhmWHI2wakRQ7EEmWu5bJxVNcNJrmOgQMIkZQFNWajhLneSme4XGc\nWB+OR0rIolgsmV+sE4LgiAvZboIIHMK\/imDA5UTIsmJeHUxms1Iql9NT5MMG2ZckDXJH4PMSEZTN\nGV5ZMd9kRQmvkz9KrkeKIOQLEM0S5KSCzkkyehQM0n3yg8kRBEExZ3DNFBQ9IxdhUBgMd4hsQATN\nKzG8XNL5Ygkno4CXe4iKCiEnmldisqUy3oRAZV5QrV\/ExalpXJi8TATzdVPkBEVxnCRIWfrkUzze\neoL17x\/g1me3oZB3LOky5qRXVUdPkquTiO0920frx8e4+9UqLpHo8Vlxxbz0Kor0JrlLM3PYefoU\nm49ahtzs3Ic0tR3TokdXqTqul85OQD13Hhc+mMGd1a9xn6Ry\/YeH2N7ewdp393D78y8wv3CN\/rkd\nLpcbMfdo6XJ3lXIVLOmvGdLWAmSkZ4Ih+Ak+JgCvn0GldhZzH81\/Y2rk+qtQUnWn2wO313cEl4ec\ng11uvPveqa6LPP\/9\/Pk7lkwuv7f\/0BaWlqlUm4r4yImNoVEkBMIRJFh2ZXJ6mh7aRywR3Nnfd+zs\n7aFYriBNphUnkWTCYYMEl\/lv6+fdtra4aO3ZY3VtrTm\/dB31K1OoT16BpJRQm6jj3oOH\/25ub0Ox\n+rKo0WgMz2paV63VoF1fwsJyA5Mzs7hx8ybpHFP2uCgqViojJGqd\/V8PcH\/jEarnJpAmM6KtblS3\nftpt\/fnXP9j95QBXG8v2E1zf2Ow8O\/gNG0+2cHWZCAqCZitBbfEa7ja\/xa0v74CWllAsZi\/B6sR5\nLH58w5ATyfD6\/tiYvQT9wXCTpBXJdLpFb\/hPnT791gX\/B9d8\/ES8+TSAAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294353916-9657.swf",
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

log.info("trophy_street_creator_earth_piece3.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
