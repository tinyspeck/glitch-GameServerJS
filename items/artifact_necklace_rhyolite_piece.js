//#include include/takeable.js

var label = "Bead of Caiyotite Necklace";
var version = "1350430331";
var name_single = "Bead of Caiyotite Necklace";
var name_plural = "Beads of Caiyotite Necklace";
var article = "a";
var description = "A single multicoloured bead from a Caiyotite Necklace, which hums gently in the palm of the hand. 1\/17th of a necklace unremarkable in beauty, low in price, but rich in sentimental value.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 17;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_necklace_rhyolite_piece", "takeable"];
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
	out.push([2, "Collecting 17 of these gets you the <a href=\"\/items\/1365\/\" glitch=\"item|artifact_necklace_rhyolite\">Caiyotite Necklace<\/a> artifact."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD0ElEQVR42u2W3U9bBRjG+Q\/wUhMj\nJprdTYckU3HYbMNtgIZBbDcBVz7DuhFgdGuIQ+rG0k1iPxhjsNGspEE3GIMVNiiFttiOFvpFPynt\n6ScUhFRb3WLUq8fTY+RCd0cnMTm\/5Lk+vzzv+55zMjJoaGhoaGhoaF4UiUQic3ONkBFOAzyLs3DN\nT4aXTRqtxzQj++WnjaZkPMxIBC2ZuyL3+69Pi3+Oryc9C9OYvXsdqu8k0D2UwqFTYD1gx2bEjbWQ\nC3bPAnRWTVhlVo2pzWr+jHmmWG1TZ71QuT9+e8ZPbEawFV2mEvEYEXYbKanNsBu+FRP0Vg30FjUc\nrnn4vIsI+y1Yc+oQmpEj+LgfxGgXiIle2cayLSutI\/VFfVq9XQ8L+eCg34aA34qAzwoXKWmwzZHR\nUlKBuSEEJ3rhG+yAp+s0VuRfIfDoFkK6+4g6tNgI2hHzmRGw67RpkUsmt95eXSPCVrcBKpMK04vT\nVJQLSsyZZ\/+SsqgQUt7BiqwN\/nvXEJweQMQ4gRhh3U7EokRgvAeevhYYhRyM8KuWdrynT3+MseMx\nPzk+cqdIwdT4FpbmKCmvboRqyj\/0NYgHIoT1D7BO2P4lRTzqhedmE1yiWtivsKDhFUFWw8Clkhz2\njuTiMUK8FfHgh5CTyga5X2H1IAKjEnj7eQgoehAlm3ueVCDV5rcdcAmrqaRGnZJTthSgj30AXxTt\nk+1Ibp2w8imxoIPamVXTJJbJFlLjC2nubkuFjeOUjG+4E96Btm2hv2MS1sLSy8W84HPcay5Ed3ku\nuMf2yna8dyGXAalrfZbcQpxs0X39LNnW9LZUSshNtvJPoVQWRfXQihugEDVDcfsS7lyug6CJhcby\no2Ae2S9Ly2EMyW+OTY3KYZgdg2tYjOiUFFury4jHfPD2nduWsQtr8L3oDB5LzmFc0oL7XTwqk8IG\naDrrMNZ2Et2cQrQyD4B1+B1Z2l4r3LM1WVfazydvCDvQ31qJwfMnMDc1DJNCCtvVU3B2noJK1IDR\nnosY6W6lpB5KuHgi4sAhqYfzWgV1DAO15DEcz0HVB3vYaX8pM\/PzM6vKPi3mlB4S81gHl4SCLyG9\n0Qlp3SHIOUcg5lXgVns15ILTmOqsh13wGRxXyyi51DHcrsxD2yfZKH\/vDfZ\/8oljMvMzL\/Ia2c2l\nH4q5H+doz5zMx4XKIvA5pRhqLKAaM7cfx0TTUXRX5IJX8BZY+19n7+pPQ8nBbEZZYS6fW\/K+9psT\n7+JySQ4ukGLVeXtQtO+13ZV7Hh\/tfZWR9+bLjOxXXsrKoKGhoaGhoflf8yeiKAzXD3EnMgAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/artifact_necklace_rhyolite_piece-1350348853.swf",
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

log.info("artifact_necklace_rhyolite_piece.js LOADED");

// generated ok 2012-10-16 16:32:11 by martlume
