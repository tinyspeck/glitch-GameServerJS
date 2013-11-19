//#include include/takeable.js

var label = "Bead of Nyanite Necklace";
var version = "1350429221";
var name_single = "Bead of Nyanite Necklace";
var name_plural = "Beads of Nyanite Necklace";
var article = "a";
var description = "A single deep-green bead, warm to the touch, from a Nyanite necklace. Aquire 17 of them to form the remembrance of a whole necklace.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 17;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_necklace_amazonite_piece", "takeable"];
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
	out.push([2, "Collecting 17 of these gets you the <a href=\"\/items\/1366\/\" glitch=\"item|artifact_necklace_amazonite\">Nyanite Necklace<\/a> artifact."]);
	return out;
}

var tags = [
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-7,"y":-8,"w":14,"h":8},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADlklEQVR42u2WWU8TYRSG+QfESxMT\n4hZBgyJaBAVaiyiKpGWRimgqguybrS2rrVgMIkvB1kopMFALaARBQVBLaRHivkQJAgo2GlcUmogm\n3r3OjKHRiFfULZkneTP5MpnJM+ec+WacnBgYGBgYGBgYfhcAnKe\/TBKTn55jYvop3n4ctU58HDdP\nfn4un5h+kvHG9og9PmV0\/ityti823tTnFzbrh1t49v46hl73YmDsPHpHzsA00gzTcDPMo2dheXIO\nxseN1qtDBjO5lpPneZcHa1f9Vrl306\/kI29u4P6LbjJd6H\/aSkv1DDfBOGxA+0M9iFv1UA\/UQXmt\nBuV9OpT1VaPEokWJ+VtKLdXI6lYRKa2lLg4TG58adx57P9Q2MNZur9SMVMegHrqbBI5b6nCkpwYF\nRh0OG6shu1qF\/CunkHdZg5zuk8jqUtFRmGoh7qxAQkuh2SFy\/S8HVxlH+61N95px+q4B+jt61N9u\noKXK+maXyv1OSnKhHOLWYjryThXELccgrJGCXxg3d8Gu4QEhcfeirdjSgCJzPY721qHQNLtUziUV\nRM0KpNZmI0UnQZImEwknUu05qMtBrDIR\/PwdCEgMgnd0gHBOco0PuuXl\/U2\/lMrrUkPaVkpLpRG5\nPwl9H0lNLi0Xkh0GTlwg1vC9iDnJJanThQd12fRTi6qzkKmVIL1KjFSNCMknM0Gen1WEqh7V0pl5\nk146gWM9dUjXyxAs4cN\/LxcewSxizq2NUESZNZ1atF2\/CHVHFRJUaXYpqlJUC2dCVS\/DIIe0o+Kb\nFHmk5k1EzprS1IDERjnCixPB3r8V7kGehENeDE5sILE5LRjbpaEQV2WjrLUSstNHUHJBDcUVrb1C\nM8lsKrDPHvUQ8ZUpOKCVIrooBtR9fKL8sCJwJeGwbcWNu9rFk8eyeQt86bYEJAVhmyQMQiIPovZy\nepsQt5dCbChAiubAj20m11T4hyLp67wi1mM5x51w+KY8b80i58XrlvHcuO5Kj22eD1jhPuCmhoKn\niEfE8WRy4MMRJhdAULQHsZoMJJ8l32Ay+xtliKpMw8b4IKwN9YYrdyXxRz5xi0jh5Zs8eKzoQOWG\nmM1Wn51+8I8JwKbkrRBUpGNvfT65+R5FtDYLwbJ9YAnYcOX8IbnZCCvc5eId5S\/0itxA+CWEmLdI\nd4ObEQnf2BB4RmzEUo6H8p\/7y1ni585ewHJlz3db6OLEwMDAwMDA8F\/zFXMEq8NlUUkwAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/artifact_necklace_amazonite_piece-1350348696.swf",
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
	"artifactpiece",
	"collectible",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_necklace_amazonite_piece.js LOADED");

// generated ok 2012-10-16 16:13:41 by martlume
