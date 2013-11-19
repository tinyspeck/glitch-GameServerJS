//#include include/takeable.js

var label = "A Piece of Street Creator Wood Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Wood Trophy";
var name_plural = "Pieces of Street Creator Wood Trophy";
var article = "an";
var description = "One fragment of a trophy (the \"Wood\" trophy) marking top street-creation activity. If you earned four more fragments similar to this, would you have a whole trophy? Yes: You = Wood.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_wood_piece3", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "300",	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece3)
	"smash_blue"	: "450",	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece3)
	"smash_shiny"	: "550"	// defined by trophy_piece (overridden by trophy_street_creator_wood_piece3)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-wood-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-wood-trophy\/\">Street Creator Wood Trophy<\/a>"]);
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
		'position': {"x":-14,"y":-29,"w":28,"h":30},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI6UlEQVR42s2Ye1BU5xnGARGQ+\/22\n97NXYJflutz3AgjLwrIs7C4YlFWCeA1aNKgxk431RrwEnTo2GotxRqMYFTQoipcd00Sjbco0l\/5T\nW9pp\/+5OZzr59+n7bSE1RmtAJD0zz+zszjnf\/vZ53\/f5zp6AgDk4bDmplqb8FO\/SYp53pVHkXV8t\n9m4yc6ObzFL3lmouJuCnPDbXZEdUZcT\/y5yVAFd+Cna5DTi\/ZyWG3+nG8ddq8bZV7p1XIFlisKFU\nHHWysZAbYO9LuWhPfXYS2ovTsdYkxPVfbsFf7g19py8+egf9zaqT8waoTQj2NmmTsMqsRY4w9mS5\nLAbOwjR06YXYsFiCgc4KnO614NrOVnxz5ZAfcnBVGd5ulA\/MC2CxKNJry4pHR1GaL4cf4TOTe\/bc\nZLjyUrDGIICnQYYjS9S42FOOhwc7cHOXC+8t1WBHkxKedln09DodRem2nkqh560Gmeddp8owV3wL\nLer4v+9uzfP1U\/MblHGTReIolHHRsOckYWU5H2\/USXHQmYFfubU4t6YIH6zIwaHWTLxplWN7m1ow\nvZAzL9m3Ri\/AlloOO20Kds3AMecLDlR2euhad0k6PtzWMszes\/IqkkJRKIxEHbm6tCgNPZUiv4v7\nWlR+sAOODOxolKPPIv3HtIMmRazWnBkPqyYB7bpUbF4s9p+zu0k52W9XaGcNWCiK\/LrPqsGZnqoN\nGy0qT774P4DqtEUwECzrTfYD1tOwvF4jwTZykzm0sVqMDbXch9PrOHKSBhzUFnY6v0GdgHpSD13D\nzt1qlkzOGjBPEIHVej4OO5S2V3WJvhpNIkoJTJUchlx+OIzyWDRmJ2JJQSqWE+irZTysKOWh2yT0\n9TRwwul1VpSkT3bS5x00+W107jRoF52\/isq+qpw3Oxe1vEWTXUYp9rm0vo68OCprHBop++rJDVNG\nPEyqONRQqS0EbqOedBakoKOMN9mQnTiRzQtzszXWGYXujVVibKwSYb1RiC7qW1Zm5r6FrqXenHDm\nx82uF7NSQgfqqW8OrzShU5cMpzZhuLcxE2vr5GglRxgsU4suDatrucmtzZmeY935MflcQIwiMcRD\nrTC8rY7z0eSCaauZ84MySOakLTvRV83FzX5QJLEBogppjK+7UorOciGVNAYVXIyvf0WB7fhrFYbH\n9bTru8qTPW\/Wc\/7B2U\/aRdPLILsJ0JWf7GvIitW+cM5o0sNPVipiwaaQ\/eplxak\/epdo08V62nRx\n2Fwr8Gcjg2yh9qhWxvrYZL8wHHMwlxeBMkk0nLTwz9ikNiiafuz1vSaetr2I4qg4HlvrRP7yFlOO\n6sQR7jlJ6RxqdOacm6ZvE21rB90l6J9huO5pkg9sqxPjAIU55aBPlRTmnrNtrkQcOcxKQpPoT\/8L\nntaJ2ayzpoJvaM5J9ChiF2rnDI6Vl4XxkkKW\/HRTsCQbn7z3+vzdpTzvUCSF+IdjKUVIHyX+8dUV\nGNvp8Pz\/ACaG+HcK5mAvbV17aQKPL9MM\/6RQg0O33B8M3fbu3H3YKyNAdtfCepDdhWyvl2JvswqX\nLt\/1jt7+cmDeoN4\/M+Y5cfq6b\/DsOE6eu4VT5+9g557DkBJgHu23bIrbqcxrDUL0UcgOHj2G0dtf\n4ar3m4mbv\/3Ty\/3\/ceL0VdH7p8dw4swNPA74892HwSWEQJ4UAp0o0n\/30cb2WYqbTqsJb+06gr0H\nB3Hs1MeT\/QcHS+cd8BdHTyGDHw9JQiiU\/juXCBSJo1EmjUZJhgBl+sWoqrHB0uhC17q+b13tXete\nGuTx09cmngS8evMhRse82LtnPzb29GJ5Rycc9hY4XK\/A3uKC3eFG75Y92LH3KF0zjjv3\/4y7D\/7q\nfjmDce6m7ezwXZwd+cSvcyO\/xtDlTzF05TOcv3IP5z++j49GPyc9wMVrD3Fp7DcYvv4FRm78DpfH\nJ3Dl1u+pJ7\/E1TtfY2R84uXk5IWL48NXbjzE5esPMXL9AYbHHuDSNQb0OS5cJY0yyPt+2Ofp3Min\np+Yc8MCm7aJl5cVorzLglcr\/agmTyYA2k35GMiq5DXMO2cqP9PbqM7G+TIkGURQahFGoF0TBQqrj\nR8FMquVFwZQcjvzwQOQtCkTuM5SzKGDuA90hThxoFUSjr1qLjmwejPFBMJAq4gJRHhuIsphAlEQH\nojgqELrIQBRGBP5P0PyAgLnLSLvVamsylsOeFoFm0uYqDaqSglCZGARTwvdBS6dAi6ZAC6ZAf+Bi\nWMDcTHWzxSIy6fW+PJkEhVHByI1YgN5KDerSFqL6CUh9XNAzIfPCfwA4Jw+RAu0NDYccTU0oUclQ\nnRKJvMgFqBYloEWRiMUEWEWAlQRonAKseEq5n+XiNn3RrPfsYFI4KYEAv2KAzY2NKCsuRqlCAn1s\nCLLCglBAEM9zsPAZDjKt1KpwpKnOe8xZPeN+DJwGbDCb99kbGz9z2u1wtbSgrqYGxZosVKXQfwcq\neW1qNNozhVhKWpYlglstwfJsDiuypejKkWNlrgLdeUqsyldhbSGlgC4Ly9VSdGRyfsDthiK8oS+a\ntEtm9+ecORlHStZqtTpy8V6rwwGL2YwyuQSmuBBUxofCKoyh2IlB3VTksLipIRVHBz83ch6LHt9s\nJ5u5GU9KJaUTnMfZ0vJPu80GoyYD5XGhqIgJRjnBmKjMxifK\/bT4KQh\/eslfZHAWkpKmIHlqtbqU\nIP\/W5nLBZrVCX5iPwgwltDIOGk4MtVyGTJUKSoXiWynHPZKKxY84keiRmCQSCh+JBIJHQoHgj0I+\n\/zvRZ3+QiET3U1NTXfQdsVPfOWPIhGlI5iQrd6vTiTYSey3S6aDJyoI6MxNZGRnIJGUQqEqphEqh\ngFIuh0Img1wqhYzjIGWSSL4nBknrs+eGaVPtFTbTcrNneilisVhltVjebbbZ7rPhYao0GqFRq6Em\nyKxpSALMeByQJH8c8glAJnLRydqJ9f5Ue0WRFswENIi0aMpR\/uLKyk1NVuuNEp1uSCgU3qLy3RQI\nBOMCHu8GlfQCvR9iEvD5Zwhgv0wm8xCcX5xY\/AOJRKKWZ33xvwHfdtqQlRUzcgAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294354089-9872.swf",
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

log.info("trophy_street_creator_wood_piece3.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
