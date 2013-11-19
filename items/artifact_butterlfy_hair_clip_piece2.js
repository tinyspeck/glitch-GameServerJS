//#include include/takeable.js

var label = "A Piece of Butterfly Bone Hair Clip";
var version = "1348197843";
var name_single = "A Piece of Butterfly Bone Hair Clip";
var name_plural = "Pieces of Butterfly Bone Hair Clip";
var article = "an";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 100;
var input_for = [];
var parent_classes = ["artifact_butterlfy_hair_clip_piece2", "takeable"];
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

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/artifacts\/butterfly-bone-hair-clip\/\" glitch=\"external|\/achievements\/artifacts\/butterfly-bone-hair-clip\/\">Butterfly Bone Hair Clip<\/a>"]);
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
		'position': {"x":-19,"y":-20,"w":37,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGZUlEQVR42u2XaVNTZxTH8w06fdmx\ngMouiECALCQgEBDDlrCTAEGWGBYJEBFKgmFfRRZFZRmiqK3WhdFBLWon7UzbF53OZNTpNn3BR\/Aj\n\/HvOg2CwuHR0nOk0Z+Y\/915y7\/P8zv+c+9wHicQXvvCFL3zx\/475bnXyvCPJOu9Qryw41G4hu3ry\nUr\/Gyb\/dO5sf8NFgFu3KgEV7kokBZtqVnlNWGUbNMvSapGgvjhKyG2LQXRmDAXM8+uvjMNgQD5cz\nxcPAHxR2rkP6CTuw4EhysivTLcrnU\/VKjFfJccqgwGiRHBOFSpwpUWG2TL1N08WJGMhLgONwLBo1\nEajRhKK1NBKTbYrnPN77lcqudp1pV65PW5WYNCswUaHAFE24E8i7aohga1Sh0CkD0GOOBSfMBryx\nVFSmPC4V30yZYbghAYOmeAyVyDCcL8NYvhxnS19CMSCDsmuj9NurGtbLMKiTiSPf4w04opejIyMa\nVfIQZMf6ob0iCvP2JM8WJJ+wtdzIbPNAQxycdbHoMkbDpovCSJHstdkzJE\/Ik7+rhkibyfGzXOqu\nzFhY1PtQGLMHmXG7yMUkcMU2eoloZzsSUZqxF4ZDgWjWRsKRJRUPnaQjDzheoBC9szkwn3Pm7wLE\n\/daXGy\/Ez\/AY7Pgg\/Z3nYLWlRQkH9Qd2oyhxjwC8eSrPLeGe4ouitN3QywOoF8JwIj1660GWnTLs\nzYnfViIu25ug+nITtpxhcQmbUyJRlxgGKx3NqnAhhjLGBwnlE1ylOhj9NXEC0O2qdkkuD6S7+UKf\nEIBqRah4qD5pHzoPxWyDZDm0UvRkxwlHXueUNxQnys7UElSJdK9wh1Ucu1dI\/wKoVbdfQM11JePG\neA6+uWDAzakSjNrS3JK7Z0sF4HFaoziDTUge+FXAt4mdbk8\/IHqJx6iUBYue2gR7FehchwrXRrS4\nN1uCr08XYWlAh54GFTqrpei2yLA8poVkeSx\/fXW2TFjalBWxYTMNfJQmaEyOEOLStKTuF7JpDohy\n7QTIv3GChrhAFETv2RHoyuAh3JkpxNq8EdcmCgWQpXAfmssiMdamxqXhTFwc0mCqUwnXcAYkP92u\nxtzJTDycr8CSM0UMxINyCUyykC1HveUNvyl2rTwh+LVA98+X4sFcGVZmdLg8rMGlwVQ4LVK0Gvej\nqTgC10\/nwDWQgvmeZMw6VC8Bnz204PaZdPRaErA6axSDMejEMbmYyCAPFE7ke\/WOt6qSQrYBXerT\n4PakHl+N6UTZvIFelYOWsurcELRVRNO9h3GRABcI8JyDVgkCXOhP2wDsb4xDD2XTXhmFmY5U3D1r\nEI5yw\/KEXP7pNiVGKAlvMRAnw0BXR\/Iwa89EV50StfpwHMkJRldtHK6M7AzH6qFv8XFalK2GSHHt\nDWivi0GzMcojebJm9nx3zYjFfg2+OBINe3WMODrNUkydSMFibxaW+rJxY6IA18iVpd4MLDrTMded\ngXFbGo5XyVCUHiicqNWFCtUXhsNaGiEmvzWdtSPcuE2BowXhqMgKRrk2CJ0051iLDMfKIqA7GIBs\ntT+0ar88ycNlg2uJGvP0cSXtLuIx3JyI5VG9OP\/xlhU\/3G7D9ZlyzNi1GGyme5oUQjZTLI7Rl6bv\nmBIzXSmYc6ZSJWRbYJu6Opq5I2AxfRSaSiJgK49CC70gnBQlua476O9iMI30043PXGtZlMlmkgnH\nGGrEqsKva9X4+U49fn9sxh+Py+nagKcPSvDbt4149siCP79vw9NHLThP5Z3qoB1Llwrnu9VY6k9B\nN33sj+aHwVIQhgaatCYvFDW6MMz1pAuwjfLFCocqyLkizR5Ptsrfma3adeC1m4Oq3GAPD8rZfEml\n9Kya8OS+EX+5TdsAPatF+OVOPp6t0e9rTf8A5P4ZbIoXzrE7R3JCGACVVMaavBABROV7nqX2c2Ul\n+pu2XHpb8I3U1O466h9uWH79pzoP\/mvAaTqvJscai2ldo1Jz6dpoGakvCF83Hg6azFF\/nvxem1Da\nKOTV6kI8Zn0oLvTrCab0rYDjNjk6a6LRRM19hF4UU3YwQ65TT01SwtY6fVDyB9+6GzMDTbR5WKEj\nemkJGrLSktJNa9xICi4OH8Tl8Qws0xJUlRu69cZlq\/xWqJesWuVnAR\/1nx6DVrjqtBSGcwu8UJj7\nqD7MnZvk73zvsvnCF77whS\/+2\/E3TDqUuuIgWM0AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_butterlfy_hair_clip_piece2-1348197843.swf",
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

log.info("artifact_butterlfy_hair_clip_piece2.js LOADED");

// generated ok 2012-09-20 20:24:03
