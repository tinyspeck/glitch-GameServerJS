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
var parent_classes = ["trophy_street_creator_rock_piece1", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "200",	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece1)
	"smash_blue"	: "500",	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece1)
	"smash_shiny"	: "400"	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece1)
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
		'position': {"x":-16,"y":-30,"w":32,"h":30},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHpklEQVR42u2ZaUxc1xmGZ2GZgYFZ\nWGZhdjAIcGzsmn2ZqSEELzHBNovNNrYJ8YZJqzZNKrWo6q8qamnSNi61XNo4Smy8YmzjDY\/jxCtb\n6hpXjhTZUez8aKWiVorU9s\/b77tzL3PB2F0Mdn8U6dFl7j0z5+E95zvnAArF\/78UipGRP+svjz\/o\nvTz2oHreO7tz5\/7is8Ebve8eGOzu6enTS\/f37b+w+L3Dl7r7TlwLHjszFjx54VZw6Mpnkx+PPcDl\n8S9lPOhl4XmRA6CfuHNvnASx78Bp\/PSXBye7dx8IvrO3f3zwwhguXrmFS9f+gI+HP8XV0c9w43ef\nY\/TWfYzM4MrYvbt9x6\/45lzuq6\/+Pn77zj1Igm\/1HET37j78Yu8xHB28ioGzwzh+5gaOnb6OI6eu\n4\/DJazh44ir6Bh7m4MDVrjlPsMai8b39+rcfEuz57QDJ3ZguOPgMBNdaNa51tli0FSzC3t7DU4J9\n\/R\/i5PlhDJx7xoL8VW\/XoTZFh+9u2iQI\/nzPEQwOjYQEn\/UQb6QENzrj0eCIQx1J7qqpweaCDKyw\nqPCCWYXnk1UoT1Th6wkq+EwqlBqUKNYrUaBTBJ\/KehZw64+2uPVoIskNomRnWQZWWlWoIslKEqxI\nUmE5CfpZ0CgKxj0FwTavoast1YhNHgNaSbJRTJIFV1nV4RRZkFL0k2SZUYUSSrHwaQhuTTPefSXN\nhJdFyRaXHu2L7KhL1WG1TR1KccYwTwnq51mwIy3R15GRiO3pCWDJLd5Qim05VlTb1dMEeZjLk6bP\nw3kVbPca9a9mJk5+IzMJHRkJ2LbABB7qbTl2rHNFCYIvSoKyefjUBDk5liNJ7CTBrSS4NcuMlkwD\nahzqkGCKWpiHjxIsnk\/BHTSsnBzDQ7zzORs6S9IoPXVY8FkluMVjcPGc42Fl+PtvFqcj8JwJ65xh\nwUcVCQvOa5EE3IbxNq9RqFyed1wc31qejfWU3loSfIkE16SIgrMs1vNaxY3OuFZelAMMLSsBjx7b\nFttD6cmHV5x\/0jpYIa2DpnleB2nP7eZtjXeNJlc8mkmyfZkjnJ5dlp5siZltJ8nVKSZzNIquH3zv\nJ3NzBqw1KvTrbbF36+hgUG+PE3aMrXlerLFHkJBKEJLvHBWJyql9tyieEovn7Y3EYpVYog2zvfll\nzMXBtOuPf5rE8PAn2JBmBh+vGtISUZWiEeYXJ8RzTEpJfigoEsXydEosI7ml2umCVSX+ORH0jd\/8\nFMyO8mJUW7TCPKsWh5SXFGnOPW5YOcV8KUVjLHJTU1HXsHluErw+ehv9pz5C15ZWNLgjsMEbgXqP\nGrVu9WPXv0JzDEEyNhOWeN1YmpWNiuUr0Lb9Nbze1Y2Oju9MzoVgJwv2\/KYfP3rzbezY9Ro2t+9E\nY0sbJdCCtbWNAuvrmlC\/MYDmQDvaXtmFjlffwPd\/+CZ+\/NYe7N7zPn7V24df7zuKd\/efwAeHzuLQ\n8SC21DXAG63ofGLJa6MTvfuPBnEmOCpw9uIYzn04hvOXxnFeuI5hiL4fEl+fo+fchtuevjAqnLBP\niafsE+dCJ+0DR4awMCEO3ijFk6dY6TGtb3neD4lWkQBTKUP2rFXWvrkiRFOFD03lIcoXZiI1WkkJ\nKuGOVLQ+kaA\/IbriheTQUsLwPGO4OGYiPVsptq0Slx+ek1LV51LBSHIeFoxSwhWpCNojFD6jQvHf\n\/RK\/2qUb50Lg7axGhBfo2eBn3I4X72rZAr6K8CeGxKbJEU7CQdgjlbBoo\/qpS+V\/sgd3NqUnTnLV\n1lH1cgU3eEPVzGxMDSG9bvCEq5x3mnXO8F7tpwQlsdnkUgirToukpKQ3jEbjv5cmnZbvNrp0QueN\nJNKUFoGWBRFoTY\/ApowwgYzQvWZ61pgWkuYfhH+oWlF0aXxIShKbKWfjBGM0MJvNLHnpXyZZa9f5\neP9tds8uGJDJBeh1y2yCsiSzYsNSkphczqqJhIXkLBYLC54mhYTH\/\/XAFtPL++8a2kEqkyNpr40I\nkRy6ViSpBeT3uZ3QVrhGodLMRFOxaJARo4Ij8mExQS5WCyuJWa1WQVCv19eTgo2IffQv51nWi5tz\nHOgoyZgTSu1GQUouZtPFwG4xIyUlBTabjeX+QvNvG3XvJuxEMhEx043HXuuMUax+yan6m1Ag7kcX\niLxQGmYrFPFY5qMiEaTiYuB2u+FyueB0OuFwOKYESW4n9Z1OeAgHYSYMM+U0RBxhylvgeGdVaR6Y\n1WX5IXz5eHEW+L7UZhVD71nJlORhRUkuqopz4fV4BKkZcn+loR1JTk5+j\/rMJjJkghZxLkZKctHi\nuBvEB276sENFRUUoZoqLUcKUlMwKP+d23L6osBCFBQUoIPLz85Gfl4clOTlTYgyJfaTVatdSP7lE\njigoJWgXEzQRMSyolqVHC7siSZyoC0jyZ9ThP0pLS1FWVgafzwe\/3x+GXvM9fsZtJNlpoqLkwuxs\n2O12UGKH1Wr1Svr8ImKZKJjF\/YlzMEWcg0bRSUiQo9SK1smioJNINRgMnQkJCSMmk+kT4iZxi5gg\nbotMiPzeZDTepPb3iS+Iz2luTdD1Ol0v8\/s1Gk0bfeZyopQoIL5GLCIyiTTCJfatF9NT\/c\/\/h+Cf\njde0kxEssS8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294354032-2885.swf",
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

log.info("trophy_street_creator_rock_piece1.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
