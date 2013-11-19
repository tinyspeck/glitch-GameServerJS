//#include include/takeable.js

var label = "Piece of Woolly Glove Darned with a Metal Finger";
var version = "1350087112";
var name_single = "Piece of Woolly Glove Darned with a Metal Finger";
var name_plural = "Pieces of Woolly Glove Darned with a Metal Finger";
var article = "a";
var description = "A shred of wool and a chunk of metal that look remarkably like one third of a glove.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_glove_metal_finger_piece3", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1316\/\" glitch=\"item|artifact_glove_metal_finger\">Wooly Glove Darned with a Metal Finger<\/a> artifact."]);
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
		'position': {"x":-17,"y":-16,"w":33,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEXElEQVR42u2W+09aZxjH+x90\/0Gz\nv8AsWbKl2Yra1RYvKKtWvFBrLyreW1fFIKB4wQuKt1pUOGgRPCjuiFqtWHbwwlZbJtk1634oqVmy\nH7bUP+HZ+7wNZ6K0WZZKfzlP8s3JgRz4nO\/zfZ\/3PXVKLLHEEksssU6sXr0Knf775U7J\/nM\/\/3TT\nHfHMDIDHOQhOe2\/Y2FbPa5tVZl1TefZ7gUOwv17uRH7c5WB+xgwzTI8g+3gntGqqQNesAq26IpJ4\n1\/aD3ItffLC94QC3oz8GLqqBniYKWKMq4hMGd\/DHdtL+88fh7\/hZWPdOAscOxwWcnjQKDubKLxyk\np6eeOXG4UGju9G97K5Gg3wW+JSuw06ZjYNb77TDSrxHgDumAtNqubSpPOjG4UHA+HIVDHYUzaGuO\nQlHdrS+NucdM6tQVeo2m6t25Ggp6uPWl+C29N6gFo+F2DISmsQyqywuh8EoGFd4f\/h7zic86bN0R\nh62HczDddS6mV\/K\/4Pa+\/VrykLOAd34U\/KsM8I+mYMv3ANYWx8FkvAsd+lpBkyNaWGSHYHxYB4aW\nKrhxVQ6Zl85Bbk7aMSfRcQTFWERflownmBjRcjPWrpKPPvzgzH90bz68sWyF3U2WykZ+UJEnBcnn\nH8MXKZ+CPOs8XM6+IChbeg5ulcihQ1cDlqEWeLRoARfTDWZjA5g670Bzw3UKONTXDBOjbVRRyJWF\n+0KE3FN9YGqv4\/sN1W\/Prf8hQ8ECxLnKMgUFQ6WdPyvAFeVnwtVCGVwrzoGKm\/lUygIZKHKl9PtS\npRz0zZUw0N1IZ+Yy6QZLABZcgzBHhvvhyOA9RmnRPSLAOq1dYWa0Lf7AD6xPhRGwlLQrCpea\/Ing\nGMIheOPt63EXCaqh9hrUqoooOL5EsSKLvlDTnRtgHTPQuGB8VhbGgH1gopDeuVHi\/oQAifKyQxEX\n0xWb1d1tNulJYPYAW5uTlUoBczJTKVye\/CKobimERTDYp8bgC7pnbqGfGbTVb4RHaPwtFbl2tdYT\nkEnYeTwDGCvMPbq5RkD5tWnA+ft90AP8qo3bCy78m1HSIolveYLj1xjYXJ+mbaJ\/3qsGu6UTfIcy\n+iZ5SDsRNu4oIu4XkdUe7Up9lZI6i88Rc8jVDT+HluDXvWX4\/YdVCPqdYBtrPzg2qnBlKQukkqdb\nc8cU80ZHO7DFZj8JsHbsBE4BxtIR19XqikLaelT+5Ut0RKGri+5h+OmZF\/58sQnfrNrBRfKLi4wc\nRrh3PvQRmDiiJ8ARdB6j0NvZAOqvblJVlhXQ2KAwr+hoQV46bfXGipXOXVz50d3qRLdPdP21s2xk\njRuHfmMj1FUqBcDDkNmZKXSSxDhONoOEHUSIqyUElMcTkpPpJQuvXIBEQGnaZ3RjwF2rrrKYgmdl\nJPMJP2e+nhqsHRcIjprO1jrIlZHpcTaJLsy8Ly+CLCOFKDkxp6S3tX83MGtGV6OTALMnS08OE+nf\nK5xYYoklllhiJa7+AUbqPla5bWnzAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_glove_metal_finger_piece3-1348197993.swf",
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

log.info("artifact_glove_metal_finger_piece3.js LOADED");

// generated ok 2012-10-12 17:11:52 by martlume
