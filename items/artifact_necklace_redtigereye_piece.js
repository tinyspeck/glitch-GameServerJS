//#include include/takeable.js

var label = "Bead of Red Tiger Eye Necklace";
var version = "1350479779";
var name_single = "Bead of Red Tiger Eye Necklace";
var name_plural = "Beads of Red Tiger Eye Necklace";
var article = "a";
var description = "A single blood-coloured bead named after the eye of a red tiger, or the red eye of a normal tiger (no one can decide) that constitutes 1\/19th of a necklace.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 19;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_necklace_redtigereye_piece", "takeable"];
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
	out.push([2, "Collecting 19 of these gets you the <a href=\"\/items\/1364\/\" glitch=\"item|artifact_necklace_redtigereye\">Red Tiger Eye Necklace<\/a> artifact."]);
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
		'position': {"x":-5,"y":-8,"w":9,"h":9},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADZklEQVR42u3W3U9bZRzA8TmXuMQo\nGoVMxygvpS\/2hdJySntoaUtPWyilWLBItmbdKJa3lfYCMjFiEZgDB6LbEGacqFnClgW3xS3RRFfm\nyIzKNEu82wXxwgsvDLfefcX9Ad6YlpicT\/Jcn2+e55znd\/bskclkMplM9r8mWSxF4UZrfPWELXum\nw5R1O8RsrE6TjViM8agkFe1qXNjtSF9MituXY2bW3\/GRbRZIey2s9Vv4atTKuaPm7bC7Pr0rcf4m\nd3YhVMv6VIBLqRbungoxGwsyFZW4PmjjQkjN2UAVSxE1wyFbtqBxUcnZOtJs40ayge\/Gg3w0PUhu\nOcmtwRBjAwlWu+vpC7oIuBz0mStZbKumzV7rKszO+f1Pjjdqtt5vt7MxHeb29GEuf77M\/bufsbkw\nyumTGeYSnZwPC4QkNx67lTdEBRF91VZBAt87bo3Pe9QsRh38OPcKm5++xcaddf747Rd++OYm92ZS\njKRTzHRJTDTpiNkMtJi0BNQK3I0N8bwHXk0JK297jTuBzkeBW1cnePDzff7683d++v4e187P8Mlg\nlOOxw7S1BHA5RARzLfqXNERNqpW8B97KWHILLiVzESd33gzxcG2UjWurPLx9nQdXPuTdU5O8PtDD\nQFeYoF\/CKdqx1NZQq1aSlapzeQ+8OWTKnZV2Hha0sXZE5NcrPXw90cvi\/CxfjPWwNPgq\/fEjRCPt\nSB4XYr2AR6\/mpHCQTECf\/8AzXcaV5XYVSY\/AxVYjX\/a72LzQzdxwjKFkL4mjMeIdbTT7vPhFgYSx\nnIy2hDZdGRaTMf9H7Ks3pld7DAyJGlIuE0s+LZe6LXw76efGeICphI\/eTjev2bSM1rxIRlNCq\/Ig\nqnIFx+z6dAHuQKloskW9\/XFEhVtXTcVTT1D59H58h55h3lnOOf\/O++mp4LSzjJG6UuyqSvSVCuLa\n0u2Cjb6wUZ2ebVIw7VOxf9\/j7NtZe\/c+RnXJswTMerw1Wsw67aM4b8ULdCueo89uLOzIcwvmhf66\ncsa8SoKGUuoNOkqKixF1KkR1FS7lIZrKD2BSKWlsaFjYlXlss1rjgk5Dh7mCYVsZKcMBOiuKiSie\n59jOh5GwK0mGC3A5\/5vNGanoRFRIT0V0uQ9ers4t\/rPalbmVmDG7679bMplMJpPJ\/rO\/AcGMmph\/\nzFUFAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/artifact_necklace_redtigereye_piece-1350348825.swf",
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

log.info("artifact_necklace_redtigereye_piece.js LOADED");

// generated ok 2012-10-17 06:16:19 by justinklemsz
