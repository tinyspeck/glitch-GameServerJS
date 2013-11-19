//#include include/takeable.js

var label = "Nyanite Necklace";
var version = "1350441346";
var name_single = "Nyanite Necklace";
var name_plural = "Nyanite Necklaces";
var article = "a";
var description = "A necklace of 17 pleasingly square beads, given by devotees of Mab to celebrate Croppaday. Based on a necklace owned by an ancient Mabbite priest called Timbernasleigh which would, when placed around the right neck, play the most alluring yet annoying tune Ur had ever heard so repetitiously that anyone within earshot could never unhear it. This replica, thank Mab, does not do that.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_necklace_amazonite", "takeable"];
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
	return out;
}

var tags = [
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-14,"w":32,"h":18},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEe0lEQVR42u1X3U9adxj2PyBLerEL\nExIvlnmxEGO6DBNHNW5t7Qzxq2qn4mwRC+IBjoCAclA+RIHgBEYR7PGLihZEh\/gVy5mamqqppGpb\nXbeeNTNuTTfPxZZ4+Q66rFdrJhvOG57kXJzkvG+e932f3\/P+TlpaCimkkEIKZ4JjOKaH9wgEC9uI\nir4mxpkROYIj2sr3K3jk2Ry4HnjJjiU3sX6wxVgj5ynD\/FfA7UchqySHfmYE20a0wdYxHUjvaKHR\nhQK\/sxTcY5po19e9IMJVUOtoIuPf3X++RZeELP9PJwGA9utvJBIfo6jhPI6i+STXhRJ1LolVochj\noTYBLh\/TEQ14K9bv5ONLuzOkYeEWcBxC4tTJuReHUUcEB1ukHxzLHtC7EUp1z\/PWEW6+WCaNsza4\n6ZZCibYWO3WC6R+ks6Q2AUh9ehAMKqHWJiArLH9\/CMwx4l3TNkCHMWg3VlCZhaekxfhIf6Q2WE8O\nw3SdhGnVo0wk++oFzmfKCiQjO4P2tjjPvVG6a2EwOBsNgX\/JQe6\/fMRJOrn1gx3G1O5c9M5DHxjm\nnSCbNMF1D3qiTlziXSnBJrpBHTCBPBbX7NWAYFxnTaplCO1CQuQSAzqCAdcpgsqeOjyRnO++H5PE\nIBZVTxpA4tORhapr9KRZRlXPF1Fl80cYl\/8x8qmkBLvhVbMTzblzuIrMPpkCbagPuHYh5AsK6Ql3\n7YDa53z36mEwuDiB1MjYQcTOj8Yto9xYTvsv8vCtBhiGsJOSxYruDNmAe0uCJ5xE4+veNoTs0DZp\nAV3MDpQjKmiYMNKSod8iRTFL2CcM1pvq8WpXC5ZRkJ143nPp51iIiUcidw3Q4JFCpaU+KV71gnrE\nCe3Okq3+Hrhm4588Z2ycjMeHK0Rg2x8cWPZicdvQoUzivbwsRmZOZlJ86vj4iE58OwfKCWNsrGJg\n1nzCOtkWmL\/N7plxgnrK+tpouQ4hiJUXkWRb05fEEKc9Zi9iw1Xg+TpOvt6yij9kVFr5uMglgutu\nlCqSF7OTSYz8ZZ2ztB8musI2sraXH80uL0hcczo0hx4fabK7NrG9yBpZHwVVwAzioXYo1X6e2NaA\nmJ3s\/Xw\/uLg3TQxsTmM9K8OsZBIU9kspsbkOkGE1NOCKaELB5oCZbp1zU5qgFRT+bmi8LQdBdzVh\nEDNZuz8RnIWnIUwzY7f+0wp7+fsO49mryJvCIuQGa42MUJPbATAveaJtA5Lgv6ou7j9X5GXWJq+G\n4g7IoFpficXJTa3hwaEHo6D0m4DnFFPZ5X\/61NHxc\/rmD4v4+JafaBnTRatjV\/bw01Us9HgG7N8M\nADZjA\/mgPKp3CEA9pAAEV0JdHx9KO6qSdxkw3jWxZd5OaBpSgWLSDEp5PhnXZvwZ3xiLWuYdIBvv\nAnFnGWhVl3B+XxPIY+\/8\/hao6eVRvOZcdtmNXHa1hR\/kDiqIy9LipEomLf6fcL4ql8WsymPl3ix6\nk1zqUSKNTgnw8FYQj+uhgF\/4+qS\/k5FBu8C9iMQ3wl+dTiGFFFJIIYWzxx86G3f1GLtmkAAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/artifact_necklace_amazonite-1350441346.swf",
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
	"collectible",
	"artifact",
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

log.info("artifact_necklace_amazonite.js LOADED");

// generated ok 2012-10-16 19:35:46
