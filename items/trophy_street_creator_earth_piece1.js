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
var parent_classes = ["trophy_street_creator_earth_piece1", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "200",	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece1)
	"smash_blue"	: "500",	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece1)
	"smash_shiny"	: "400"	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece1)
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
		'position': {"x":-21,"y":-14,"w":41,"h":15},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEcklEQVR42u3W609TBxzG8QICyq0t\nnSAglF5Ob5ReubalBcq1RZEO0BE3Q3gz3\/lmL5YY2NyU+32Ui86x6aYgirfBFBhLcNMQY9XNbWYX\nsy27uRck+wee\/VoKgiNANl6eJ\/mkPZyT8KXnNIHDYceOHTt27Nix24p1D44d6hm6iN6Tl\/DOqXG4\nT1\/BwPB1DJ2ZwKkPP8Hpc1MYHpnBmbHP8NH4HEau3sbYx\/O4fOMerk7fX5j49Gvblkd9MHrT1uEe\n6ewaGH1CgXij0Y2jx7pRf7wXDSd68GZjN8Ve3DDw2vQDTMw+wo1bjw9tWVwuL\/jQF\/NforN\/FF0D\nF+ANtORYsc\/1IkocTtiLilFO7x17K1B3+DW83fbuhoE35x5j5vYP7\/3vuDoRT2jlh2Bq8ibOXpgi\n0zg7No3J6Xm0dAzgeDN9gm+1o\/5YGzp6h9EzOIL3z0\/h3OU5nL9yi+I+x+i127hw\/Q4uTszj0uTd\nxVs9dR\/XZh7S6wPP6NRd7n+Ky+AFaw8zfE9NYhSO1Naiv\/ekj7tnCH3dQ+jtGkQP6e4cRFfHIDrb\nB9DRNoD2tn60trrR2uJGS7MbTU1uNDb14UTj2uqPNnv4HM7mI6v4HK4hYltDnmA7XpVGo1bERV50\nKIriI1G4QsGSuEV2ku+Xt+uZXGLzs66gDuUs02znbP6ZrJMKZi28EGjCgvCKkIvKhAjYIgP+xeqX\nQywRi8zERLLDA5BFMklG2KJ0kkaMOwJgIPoVdDs445uK27d3b0OZTomXhVGQ019WQ4EuUsANWGb3\ny48KQB7J9bM9F7xW6HqRxo1uc1VVFbeivHyhTCOjQC6YEA4OymJ8UcW8AJTyA32vRaRwRezKUNuK\nQPM6kWsFVkkS1v9W1xw40GCz2bCPicf+3ZG+QBvdalNEIEzhfvTeHBEEc2QQLJHbYIkKRg43BFa6\nzsYLRS5\/O\/IFYbALwlGwk57VmCgUx\/JQGseHM16APbt3ojwpFhXJcagUJ6BamogDsiQcVIhwJFOH\nPpdjfJA+qDUDX6quXtjjdCKPSYIjLgL2mDA4EyI35PArjV+thBT7FfkVxq3+Ui157nn0rBm4v7Jy\ntrqyEnZrDsoytHBoFT5OnQJlPkrfq\/fY6T\/nVUpKNF5yFJOi1EWFahkKiD1FhnwvFYM8kktsSqmP\nVSFFDrHIJcsyxUlgdr3QT0nhJHA50OVyCasqKrDH4UB2djZMJhPMZjMsXhbLM3Ts\/bn3vImuy87K\nQlZmJjIyMpCeno40oxFGgwEGvR56nQ46jQaa1FSkqtVQp6QgRamESqGAQi6HnGEgk0rBSCSQisWQ\niETLoqOjTZQVuyrUVV7uMZtMf+t0ut\/1ev0f9EueGo3Gp2lpaX8t8R4bDIY\/vee915HftFrtr1qN\n5hcK+VmtVv9EIU\/UKtWPKSrV9yql8julQvGYgr6Vy2TfyBjmESOVfiWVSB4yYvEDqUjkEYlE98RC\n4V2RUHhHkpw865WcmPg6JQlIGAll\/01jx44dO3bs2K27fwC\/HuCoqHwljwAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294353899-4428.swf",
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

log.info("trophy_street_creator_earth_piece1.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
