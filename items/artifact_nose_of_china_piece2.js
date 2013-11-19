//#include include/takeable.js

var label = "Piece of Fake Nose Made of China";
var version = "1350087201";
var name_single = "Piece of Fake Nose Made of China";
var name_plural = "Pieces of Fake Nose Made of China";
var article = "a";
var description = "A single and somewhat snotty half of a fake nose made from delicate china.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_nose_of_china_piece2", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1313\/\" glitch=\"item|artifact_nose_of_china\">Fake Nose Made of China<\/a> artifact."]);
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
		'position': {"x":-11,"y":-11,"w":21,"h":11},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGe0lEQVR42u2X51NTWRjG+Q\/8E9zR\nXV11F9aCDTSAyqKUaBAFKQECoRNCy0gWA1gApUikGCCA0gMhtNCiRBCkqEREEVAEG24ZZZsf9tOz\n9xxNJCrqjuM4s5N35pncOTfnnN\/7vOfce66ZmSlMYQpTmOL\/F9PXFEsmr6okE0NK7Stl3x9RLv3i\nYARiYlhZOjHcgIXS9VZjUHMOV7vLMT5Y\/7J9SDlD4Pva5dk9rcXcyy1yi88GNTnUwKVOvQH2IY1c\nqkKvutgAfme4YZ4ZRzUxrBJMDiktPqmEpGx3hpW64Qvn6SREZMIPQREQ4uhAVxntM3ZFYXT\/9kAd\nHo934OmwAvcGa7V\/z\/Vlv3jSz8bza0s+GvDnSU32g5tqzIy2YFrXDGa94RYzkaF87xEButlXS6WH\nI\/0J1C9TGryY68fF86mI2bMRefE+mNXI8Ki3DF3yZJ3Qz5kt4ru9H3RuXL300a3G+eczF\/HHw0v4\n\/cFL\/fmoF\/Ozl\/Dr3Qt4eKsNd683vhOQJLVQcxOd+OvxZQp2e0CBMydjUZIrZpKtwuPbTegXe6A7\naBcO266Bn+VyBNiYzwft2cRevLy9pVrScTE9GW\/Gw7EmPJ3sYK7bmSR68WxGS6UHWai711XoUcvQ\nVHkSGlUu068Tz2e1mBppp79jHUXIFYVA4GpDAYn8N6+A0NuZ9RZc52FP7kCKL94HqFeXTIzTAU4Y\n0shxo7ec6t5IA9XNviqoi5ORx3dGodgffe0yPLuvxT+\/XaeSyWqQkVWO1sZmTDEJSNNFkHg7IJa1\nmirCaiXjpMWMEdzzac0STaTzPLF7pCAWU535RkAPRhS0bbREjE4BG+kOPyDTcR00JUnoaztrUGOB\nGFleO5F5kAVpcijG+iswOtiBhrpGaNrUFHB6rBc3OipxozQZVZEcpO1e+5YCN32NSA8H7mv3YjnZ\nBO5jVOxuTQc5y9mEcncrg+RuW5DOtJ9024aTSWHQ9ZRh7k4rTqQWUMnzCzHbJcOVRE+08+xQc8ja\nqH\/x\/s20PxmbOBm0e5OKwimyhCwVb+cHwS7wd6LKwxqnOFtxas86o8GJspzWQ\/LjWhyJ8kLq8ROQ\n5ecZ3CfOd4c7osXPlo5RJ+BAJfZGS2oIVaW3DR1D6rLhNaD9BlBApchDS242+LAWhesI2EEzznTa\n8E73SPZJu8wRto8FWU4yhWuuK8HMQDm6othQem9HNc+ewtSfTUSaJBRxEZ5Uh4U+qGB2dm2IEwr2\nbaTjR29bBZ71aphdaStk9TRKoYxzpxNVMKr13GYQydZQQr9dyItyR8nRELr2iIgT5B5xlKybpBgu\ns3MVuK+rx1D9KdQGOqApmQetIgNd9aeReTTSAPamLlelIpdtiaP2Fgje\/A34O9bCTJ57TKtf4GQg\nksWbpSP2qyT+KM9NQPlZCdQ1mYZNQZKTHbSmJSEZVxYmYbCziLa3S+Pof7RNuSjIiKNOEZCjCXxk\npERQpb9yUhzji9GWHOqe\/nHDtzHPNgvmhyLtWAq6m\/KNduObUpWnUTiii41nDO3kWp4mAG\/jcppx\nuyLLqJ+6JoMCJcb5ISdViLK8nwzjEFUXpUBVkQZdixStIncImNKGbl2lKvbY8XIHe3kFwt8\/HDHR\njDtFGWioOP0WXCdTGjJYXkYC0lOi0Vz98j89rfl0AuICgQtgfU\/b9P3qSo9BEs+jYKR\/XelxaBpy\nmMNDCe4MVdP1ef0c0x68B3U+trp4mzXcaRHf+FUnEobM+HL58PEJQlCQEGFh8YiMPEwVHi5CYKAA\nJAkiV1dPcDiHwOUG40hCHIqliSjIjKclIoCkLLUnQikccSrvVCwF0nUUYLT6OK6djqAwuXstcZwp\npcj2O52v5TJB8SG7xc+SQt4+riSai7TkOIjjo0Bg9UB6kTZ+QCD2urjAbb+nod3H2w+xEV5GgOQt\nUJEjgro2E93V6VCEs1HA2YxSD9Z8NnuLqtLLXlLoYcv6T8cr\/y0rVQIXKySFHaSOLFwjRHJpAl1D\nBEQY6gE3Dht2dg5U5HohoP5deoLrCKkra6bI3U4yLuZ9+mn7jOt2QejWlTqyE0OcrSBiJhCHHECS\nKOCtxwGB1AMSBfsfAN9+gy7M6tvSGBtzrtLfyeKzHev565ctIZMwa6M0ZOuKeeIIgSYOEXA9pKOz\nO9h7vbUHvcIFokS5xZf9SGJ2lp\/lVywicgyKCTu01PTpaApTmMIUpqDxL3PSl5\/XFNIWAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_nose_of_china_piece2-1348253348.swf",
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

log.info("artifact_nose_of_china_piece2.js LOADED");

// generated ok 2012-10-12 17:13:21 by martlume
