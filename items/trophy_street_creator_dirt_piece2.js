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
var parent_classes = ["trophy_street_creator_dirt_piece2", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "200",	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece2)
	"smash_blue"	: "500",	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece2)
	"smash_shiny"	: "400"	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece2)
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
		'position': {"x":-16,"y":-36,"w":33,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAENElEQVR42s2Y61KaVxSG\/dmZiMbU\nqEkMKEZQmym1KeAh6hiNKBrhw6gRORojiuCHR1QOgnhAG2uTSdv0F5eQS+ASuAQv4buE1f1u+6X5\n079svpk1wAwzPPOu9b5rb6qqKuDJeVqOfl81FtdfPSyExhpMVZX0ZN1a+c9oJ6Gmrfdo9Ke7pYqB\nS7gf6D6Gjcp5QE\/y9EOa6a+nN4P3KWRrdFQE4HXIULpaaaf9180097yegqON5B66T4NPa46Ew129\nay98lrso522lt2ONtDfTTKk3Wq6gxVAtFjAf0MuA+7BmpG3pEW8v4PB+xHSXrMY7sji4YIsDhgDg\nkVtHMccjOva0cEDvcAPUE2eSvKfV9CliVJgx6PLtEz57KhzUG\/ihRulu\/U4nBC4+W1fLWnoD9TJM\nORTmL72gpcO5x2T\/pY61VuMQCGcofYp0UGpBx6FO\/a1cOdT8QD2Z26uvhToWhsC8qVBq+UcaqK9D\nUxCmHFbY++Un3KnvbE1fwdBWwPV2ar4IhcOWCE8+4AGsRgpyb9J8j3o7NMVn+qpaYTMHOKgGuE3W\nXrwiiCee1YmLE0QJ9iviA3Aelm1QzveigaTe72noaa24TfHbcptDhYNigMIrIG0\/QzWNYjHc8QuB\n+xBql+FURAj2KtRbnWjiqrEAZhlXXRQWwh\/DhgKcCmfCEJGpW8eqqgkL4L9X9Nyp6kaAO9HS5bEm\n6u+swax9EeJS1Qxs1krqVsBeRTlZS5li4k8kqXmtAuW+bS2OSogPZgRx94rPEYMps6jjcDiV7Lqa\neb7BCGzeCsJaymduo8N\/udSmYFXBsfHXj3nwDv9YK3bZq8rhLIeZyy+1Uc6n58rdtlVQtn3r1j+i\nnQrOcDBClgUxQrhi4P6Su0pwKvINZsBmuL07aMRdD3NnZ\/78xa90cZqiq2gvV05d9kKVy2azQ+f5\nS7q4fE+5kzPaix\/QyXGGlmxammV311u3CrwWxmJbhVQ6Q6dnedre2eW1f5Cg4HT3v9tB0OmX\/xWR\nONFFNmQ6z1\/Q7l6cw21t79DObpzsA11i4fCEwxF5b\/+AjnOnDHCfNre2KRyJUmh1jZy2nqLwvyOi\nsc2bVDrLWwr1NuQYLXq8tOBexCwqiXTWIbS9yVSGUDAGAL3+AHm8PoqytuPzYSJFiURWjHuTyays\nAmLmMIuAWw2v81arhgFkMpkpv4sTqUwBcAeHSYptbpF70UOhtTDJ7L0Kh8Js4nv4fpkVzBQPE2kO\nscJMATi1tWp5fX6anZtnM+nhNTUlle9YtR6RbwCxHt3gpULBwf7AEo1P2Glk9OXX6ut\/Tt3dfeW7\nYzid0o3kmuGO9QeC5PMHyTZuJ4u1h0ZfjpFTcv1XTqk0breXdw4lSTLhhwEw\/GKEg5ktVsVs7Sna\nJ18VnE7XEcrlcumEZiGDuB4YHFLMlp5CWVv4P88\/Pdug6FkHlPoAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294353840-6620.swf",
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

log.info("trophy_street_creator_dirt_piece2.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
