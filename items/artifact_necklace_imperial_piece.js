//#include include/takeable.js

var label = "Bead of Ouzian Necklace";
var version = "1350429235";
var name_single = "Bead of Ouzian Necklace";
var name_plural = "Beads of Ouzian Necklace";
var article = "a";
var description = "A single swirling blue bead from a Ouzian Necklace, which, when reunited with 22 others of its kind, form the remembrance of a single flowing neck-river.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 23;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_necklace_imperial_piece", "takeable"];
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
	out.push([2, "Collecting 23 of these gets you the <a href=\"\/items\/1362\/\" glitch=\"item|artifact_necklace_imperial\">Ouzian Necklace<\/a> artifact."]);
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
		'position': {"x":-4,"y":-8,"w":8,"h":8},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADU0lEQVR42u3W\/0\/UdRzA8fvFxRrt\nambqVK5uSWOFx+VFBdYF6UhEaYr4ZbW7C2Vs8U0g1M44YwkHoexc4sFqgoiSnFIs+eLIgwnKyXEH\nMg406CAI5RIOLAaU9ezGf9APHK59Htv7h\/dvz+291\/v9FokEAoFAIBD8LxQPIDbeQfbYhakLu3Wq\n8mFnQtUoSbVudhn6iNbfJuwjk1Ox26BbtDDtpVGJ5hunW23oIrt9Fm3NKPmWaXSN4ySfHyZW10pY\n3AlijQPu7QUOidcDMxqnzCpjP+mlvZT1\/0PprQmOm3rJrewl3dDG3szLJJzrY6u2lfDUZvvBixNi\nr8W9f8yaklg\/ReKZAfTfD3GhzcX1kTksY48w3bpPUf0geXWjZF29R+S+b1EethKUfLPQa4GhmmJn\nZtMfHKkaovS6i0bHFDcG3HTdm8Yx\/hc\/3HaT\/10fau0lYlPq2JzTwyvRJlaGpC\/8UQfIv5K8tcfA\n5x1\/klMzQqXlATd\/\/p2hyVnGZh7hnJzjis1F0rFakvVNaPKsbM13sC7yAiviLKoFDwzcf035Tux5\nDl2b4LR9hoq23zD3ubGMPGRq7m9+Gp+l2nPMh4taSNE3s\/+UYz5QrmrgOcWXCz\/VgQdsSqWqhj3Z\nbRTaZihrn+Sy1UXr4EM6R6Yx33VztmmY5LwG0orsxMRX83ZUGS+t1\/O0f8zCB4Zld8s2HGznvd2V\nJJX0cLpzhpLmMc+g3KfaPkGlZ2C+KO9EnXmRHR+XsvHDU7wamUPAlpOsK36g8sqQyD+xOcMTrhKt\nNpFV7yK3YYyj5T2cqPuFgtpf+aziLnFZZmJSG1BuO0uwpp5NV+bw2dvqnfvwxcQO3RvaLoK3fIpn\nO7+eePIpIlS57DveQrzRQdyZQWKKnbyr6+D1tCaWBR4ye+2aeSbeKn75gNUZnNbCcj8FvsukiFdK\n50M3p1XxZsRRgkIT8ZepWC3dgXhpiHvJC1Hefad3nbwjk2V02P2jclmzNoIgpYbA0HiUR26wKdtG\nQEgJfmsLWCPNcIuWrFqcT8TGnXqxVPFB9dIVr7F8dQirpCqeX29Eru\/HL6wCX3GCWR7+tUS02Hx8\ntBJfRbnON9iztv+oeza1WyfakP34fb0EAoFAIBD8Z\/8CfgjuhAzYBtkAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/artifact_necklace_imperial_piece-1350348711.swf",
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

log.info("artifact_necklace_imperial_piece.js LOADED");

// generated ok 2012-10-16 16:13:55 by martlume
