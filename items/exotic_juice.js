//#include include/drink.js, include/takeable.js

var label = "Exotic Juice";
var version = "1354595004";
var name_single = "Exotic Juice";
var name_plural = "Exotic Juices";
var article = "an";
var description = "A goblet of mysteriously yummy exotic juice.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 54;
var input_for = [71];
var parent_classes = ["exotic_juice", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "20",	// defined by drink (overridden by exotic_juice)
	"drink_energy"	: "10",	// defined by drink (overridden by exotic_juice)
	"drink_xp"	: "5"	// defined by drink (overridden by exotic_juice)
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

verbs.drink = { // defined by exotic_juice
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy, $xp iMG. Grants 'Pleasant Equilibrium'",
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
			pc.buffs_apply("pleasant_equilibrium");
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
	out.push([2, "Drinking this will give you the Pleasant Equilibrium buff (being in a really bad mood does not deduct from iMG earned)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> or purchased from <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && pc.skills_has("blending_1") && !pc.making_recipe_is_known("57")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> a bit more."]);
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-37,"w":16,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGxUlEQVR42sWYeXNUZRbG8w38CPP\/\nlDUImhFXZFE2WRNEQQsE2SQhJCEhCSGA5YLO1CgOOuNMKDBkhhI1AhJCboZAEpqG9O19u713317T\nSW\/p7nR6ST9z3ovMTE0ValnV11t1qvtWd9X7q+es76mq+oWPv4hF6nC8dcBoPzBodR64pDWfuqIX\nuvstjm7O5u6+4fZ36yZTX1mSM32OTP6Kv4CGOPBIVaWfQB7zrhqsX7R091xp\/uIc13HuAnfiQh\/3\nYd9V7pOrQ9znQ6PcmdG7XO89DfeNzsp9b3VxnMvPjQSinCk1c10sYV3FAXUTiemvlGrhs4Ebqp8D\nqAhG7xgSGcGVK8WYkhVXUcyXb9JBsxP5uUyoANB3mGPpaePUdMwUS8csyUzMmpphMNJv7kwhZ5\/O\nZdn3EPCbygOSmwL5cjaUndXNFotpx1SKF2Ips3UyIRgicUETmhRUYlQYsjh5zmTXKOxei34yOSnm\n8XGVXI9YQELM5LTpfCHqS6ZNlkiM1\/sj\/LgvzCtcIn9L8PIM8Kbg1g9bnAbv7FyRhYd8gOTmQLYg\nJHJ5v5jMGH8MUOEOOOn\/nio5H+YucaYgRjM5hzeRNjwMcNTmMSi8QZc\/j+9kBaQ6eMyfKwUjmRmr\nN5HRmz1erXFsUNCPDAqamwOCRqcTeG9QUHsCDnUoFmT\/lxUwRAq6Taqi4fO2GXXbOmjqF8PU8CLs\nzSvhbV2DUNtGTB55BbHTbfmI\/m4xJGeCPMhk8\/gwlJ0boax\/AeP7n4Nwcifcf26G89AqiK3rEOmo\nRerTQ4iOXYPsCjJAl+Y2PGeOQ\/ikQTL3l+\/D9bdOeM+fhO\/8R\/D0nIT97LswXv+n\/IDsQGd\/D+yd\ntbA1r4DQtALWxuWwNL4EY8MyaOuWQLX\/eehOvA7NmXdAZems7IDugV44D6+Bq2U13GSuQ6ulGGSw\nLB619Utg6NoM3ccNYGVJdkDv9X\/AR4Bi23r4KVHEw2spQdZKoELjCklJw5FNMH7aJD8gO9D31w4E\n29cj3FGDCUqISHsNgm0b4KMsdjavJncvh\/lILfiGpVJPlhvQ4\/9wN4HVYOroK4gf3Yx452ZMEFCA\nIN0tayRXGymjdYfXwxMOsURZJAsc66miz4WJrk2YPvkmkl2vIX18K9LHtiBGkOH2jQgfexX2ppWS\nm430uzDWD9mGBRZ\/4shlhDqoGHdukgAzDJAsdvQ+oK9lrZQwRkoWBqj9rI1lslY293r\/0o7wH\/Yg\neuw1xChTE12vSm6OEjCLQw+52PaDgmqCVFGyyDIPsgPYQb4T5M5vTyNMQCzuomQsHkOknsgyufll\nqS7q61k9XIRxArab1AgUsK2y8UcHuJUcPO9tQ+BPdfBTaQlQJgep1AQOr6Oys5YS5GXYGlfCdPBF\naOoW497bz0FJaqr+frzyBVvqINd6ILSugoNqHyvQHiorbEDwEJiTaqCNstd88CXo6peCp25yZ+8z\nGCMlFR\/srnw9ZHOdmQqvqWkZLE3LCWY5HC2r4CUVGZiV3s2kHINT1y3C3X3PYmz3QuiPbMDwroVM\nwUTFC7TxVAN0DYuhP7gUvq4ayZWW5vudQ39gKbW4xaTcfbjbu5\/CzV2\/h5LcP\/Dm\/MoXbKag6eIp\nqOqfB09jlpbZgSUSlKbuBfBk4xRzPL07OjdIcEM7nsC\/6H2ovbbyCrJ7rY0fwZ23n4Zy\/7PSHCgZ\nQd0jxZT7noFi79MYJbeqG5cR3OMY3FWN\/p3VUJz7ABUf\/VmZYSqM\/3EfRvc+hdtkqnpyJ0GO7VlI\nYE\/iFql2g4C4HQtwbfs89L9Vjcu7noQnmULFNwsPLkw2E09BX00urIajawO0zcsw\/Ba5koyBXd8+\nH\/3b5uHyG4\/i0vbHoLx4Wr5OwpZATEUjtbvBHfPB7VwgfV4jkMtvPIZLr89D39bf4estj+Lbrb\/F\nCHUdacsg17Dwn4GBIK1GFa60bkHvpidwvvZx9JB9WbMA5zYuwIU9q6C41CvBVbyDPLTtUdAzAEcw\nCKOOh0EyFR7sZags\/Tpw\/6tksIDyVL5Utiayc\/xEcm5YjM597wyWvjZ5Ss5ssSzryuMhe5qzpFLZ\nkyuVjfEsVNEUtLFM2Z4plGW\/LP3YNfSBW\/\/rXpkv6z9n4zVVmIN+ahr2TF7erP2pffUPS02EZksw\nxdOwxLNl70wpIctG9adaHyVJQczmU\/pI3K+dTE6qo8nERY0teMsdmhJSubzsm63\/n64pg1POZMbP\nABXihJ9zBPx9Jpe\/V231f2NyRmzpfPFXU1K6QLFta75ctCVnUqZ4JqWNTqfuheMpPprKSAlDCv7S\nUvNvT8BpCOmBm9gAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/exotic_juice-1334340448.swf",
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

log.info("exotic_juice.js LOADED");

// generated ok 2012-12-03 20:23:24 by martlume
