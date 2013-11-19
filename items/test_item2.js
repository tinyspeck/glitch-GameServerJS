//#include include/takeable.js

var label = "Test Item 2";
var version = "1347647397";
var name_single = "Test Item 2";
var name_plural = "Test Item 2s";
var article = "a";
var description = "the initial test_item was such a hit that there was no choice but to create a sequel and cash in on the inevitable commercial windfall.\r\n\r\nthe generic test item #2 is the stock item used for inventory and other item testing in the test framework. don't spawn these in-game, they don't do anything and they're intended to be entirely useless";
var is_hidden = true;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 1;
var input_for = [];
var parent_classes = ["test_item2", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.watch = { // defined by test_item2
	"name"				: "watch",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "ADMIN ONLY",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("It didn't do much.");

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("It didn't do much.");

		var pre_msg = this.buildVerbMessage(msg.count, 'watch', 'watched', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

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
	return out;
}

var tags = [
	"test",
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-31,"y":-65,"w":62,"h":65},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHOElEQVR42u2Y+1OTVxrH\/Q+Yndm1\nQlUQlYLtLEFlt2XVUFS2F64qVrESrAKjogESjFwkWCQFC8TFBEGwQWQRFMELchWCJtyFcBNku24U\nrNyEVxGQi+x3z3mR7Nr90YT6g2fmmRyGIe+H7\/M83\/Ocd8GC9+v9er8Ms4I3r+BGO33Ej\/jCgidx\ntuS+U3CH7c3ERzatQKjjShzdvAJhf12JOPePee8E3IH1Zq5+60xx2H4ZhBuXs3FggxmivrbUvhOA\n3p8uVu79bAn22S3FQQLmz10GH7IXESUFG835e+2MTX8zONEmc6OtHGN42BjD7Y+L4Ln2Qza2rzaB\n96dLKDCTEraL92qqnTczeU88M6kVY+oRD9Md3OmXrVygw9TggNs4xhpHyz+AhoPF7\/HlqoXsXh61\nHy+e1mFmogP\/nu7DzNQTvJp4gMnRZowytRjuu42+7nIF8MDo198bt8XK9Ee3VYpDXDOln90SV711\nsZftYr4Hx0RRcimegN17HZ0E7jEmXjTjxVAVG0O9lXjysIyN\/sdKzf9+zzFHC+uTrqsYibMVaG3T\n8vH9y1L9NRxRjP9fOBr3MT3eroOjMfC4Qgc4C1mhpH8baG\/Opy5Ag9YzLZPdf1pMQZV6gevRlnJT\nZHy0NV3Gm5D3MPlC8wbkcJ9KB1hdloxgt9XawM\/NEULgwolNBZA9VZAGbUAS4rcGbKz7uzY+xgct\nd3P+D3B6rPUNQAo8yjSwgJG+X+M7kkp\/olqQgzkEDstZqJ1rTDDnED52S\/LfCg6TbdYPfy7G5axo\nMH2VGHx4CVOjTRgZuPUarloH96\/71\/CP9qsY6qvC4JPbuHg2HE6ffMA6wbe2ixkCxPDtzTHnEGxw\njPlvB0isY06tlppEVBbHkdSdwM3cCDQ35GCkvwzjz+rR230L4Ud3IvTIDpTelKP3UTkKrsQj7sQB\nBO11Vrh8slC857OlmkMbzBQ7VptoKeRWzgf8t04vVZAqNT3eBqa3CONMNYZ6rpLPGtRVZUJdHIGB\nX1Toar+GI0EeEARshbIsFf09SjTXZ6GiSA65VMjWmbvNQmtyQjG+60zz3W0W6e9cHx2uwRhTB\/o5\nBzubVhWpubt4StL5fLAGhdcTUVGSwqpNU9zVmod6VboOkC56Aun9FBpjavMpEE3l86e1Ou8bf97A\nwlBzfj6owtw\/MvK0mm2SngfFKC+UvQFokDXSr+Y9G1CxDUEBaZdSwImRRlZR+rv+nnJdzNkMTXH6\n2WOQJQgMPwEN9FRoKQh9cG93xWu1KGgtUUxNmuKWDkzbVcBGbtYPkEmFkMUJDD9YTI42Wfd2lzPa\nrhu4U57GKvfw5yJyeih1YDSld6sy2LTmZcfitFTAzIt6c+vlcJNpZ+sVTe7FGEyNtaBKeU6nWGdz\nLtsQF86JZ1VLEEpTYkRG8z6KlZWlGJ2XC7UULCczGhXFSVCXn8XNvASSysOMJPTb\/NMRHvjNZkXq\ni6XZx5Eh3Q+ZxAeJ0fsQGbwDR\/Z\/pQk74IjoICeNyG+T6\/xCkQEUE\/dcZybapdQDnw1UQ9txHUU5\nUZD\/4Ivjol0aT2dbxWGvDeJYoYsmOvBLvsFgeh\/d5r2aaFeS0P56MJibXigk3VPbedB5DTnpkZrd\nzrZcT5e1Yk8XW75B1fqbNJRJS4lC+jkJfkqNRq36IjHoBjKM3iGGfEdnzjSoKTP9d9Cgysj3crNV\nzEs6JVGBSEk6jpwsKYoLUtF8Nw\/FGWLECnegLF9KTLqRhXs50sT6H52iK0qSlV7ua\/VfdzHuFtbX\nf\/TTjg3VY5gc7vSh9OG3UoQ46bYKyT5c9lirvByDb2yX4liIL0TB+1BenIZKMhBQ9eiJUlogYwyi\nVqyblVS6cw3OC10Qt90G8d99ThRRYYCMSjHbOOxFXX3jFC6khEEs2ouLmfE4fzoUkc4fI\/vMUd0c\n2EE8MDPzhP5PCwKgPPaFBSK\/+giiTStA3yLUl8hJ4V\/H93s2wttuGaLDfaBIk6BGlY3OtkJi0K3o\nqs6AwJmDwV8qWMDufxaitDBR\/69FtnCMpbODozF22X7IxplYf1zKjNZ421uKE6L8+QVXz0jrVVnI\njfdnU95SIiMTsxpJkv1IOh1OIJXoasvDT2dD9A\/oseZ3RnSqDdq+Lj\/gm\/XKLZxFYoGnA5sqdWYE\nj\/re5GiLpvd+AbJCt7F1KXG2hOL7PTgpCYA0LgTJsjBSk0lISgienxdLMR7mRpciPbWNBadmrYQ0\nEA26P+W9HsEbl8PfaTUkUQG4cTUZ6WknkCoPmZ+Jha6TblZ8qlTqwc1s89Amygh2ZSfky9JD7H32\nIM8J1\/KS0Fh3BWVFaTiTKFLM27FG7q582jQxrlZsSmkcJz9fkAcjjFwjSRkoJJJArqYhX9xUn6dU\nV2Yqsy\/EWM8boMBhmSm9rwaROyy1mRDHleDbk24+uhtBXo7iBe\/Coh1MO9v7z7OXaw8bEybMz9mg\nE8p\/ALFc4MswXUvTAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/test_item2-1347647397.swf",
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
	"test",
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"t"	: "watch"
};

log.info("test_item2.js LOADED");

// generated ok 2012-09-14 11:29:57
