//#include include/takeable.js

var label = "General Vapour";
var version = "1339011342";
var name_single = "General Vapour";
var name_plural = "General Vapour";
var article = "a";
var description = "A flask of all-purpose general vapour, harvested from a <a href=\"\/items\/354\/\" glitch=\"item|trant_gas\">Gas Plant<\/a>.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 250;
var base_cost = 5;
var input_for = [76,133,134,135,136,137];
var parent_classes = ["general_vapour", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "gasses"	// defined by takeable (overridden by general_vapour)
};

var instancePropsDef = {};

var verbs = {};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
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

verbs.shake = { // defined by general_vapour
	"name"				: "shake",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Probably futile",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('mad_gasser')) return {state:null};
		if (pc.metabolics_get_energy() <= 5) {
			return {state: 'disabled', reason: "You don't have enough energy to do this."};
		}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("What?!? Didn't your mother ever warn you not to shake your gases? You're lucky general vapor isn't volatile.");
		var val = 5;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		// effect does nothing in dry run: player/xp_give

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

		self_msgs.push("What?!? Didn't your mother ever warn you not to shake your gases? You're lucky general vapor isn't volatile.");
		var val = pc.metabolics_lose_energy(5);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var context = {'class_id':this.class_tsid, 'verb':'shake'};
		var val = pc.stats_add_xp(1, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'shake', 'shook', failed, self_msgs, self_effects, they_effects);
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
	"sort_on"			: 53,
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

verbs.gassify = { // defined by general_vapour
	"name"				: "gassify",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "With a Gassifier",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.items_find_working_tool('gassifier')) return {state:'disabled', reason: "You could gassify this with a working Gassifier."};

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var tool = pc.items_find_working_tool('gassifier');
		return tool.verbs['gassify'].handler.call(tool, pc, msg);
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be turned into a rarer or more valuable gas using a <a href=\"\/items\/290\/\" glitch=\"item|gassifier\">Gassifier<\/a>."]);
	return out;
}

var tags = [
	"gas",
	"basic_resource",
	"trantproduct"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-33,"w":29,"h":33},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJIUlEQVR42s3YyW8b1x0HcJ96zS23\nIn9AD70URRGgyK05dL2kl7ZwWyQBGncixXKtxJZMy6n2zZRCLaREWiRFyRIlyiI1IsV9xH0WzsLh\nMiRFUhRJiasoypZju5nOc8FAEOLGSWzLA7wLAQIf\/H7v+3tv5sKFH\/hg5vfeCJnfH+WQf9qT7lZ7\nnuiwF+kuey3ar3u0N3Hxwnk\/O+5Lb2WxK3w+eJ2vhLv5CtvNH9Bd\/B72GR9zfKS78Do8OaI9VY\/3\n8V8VZvjj5Ci\/T4n4sO1DPrj5Z9G548zR8u9jIdXXQKHFT4FC9XiPa8pui9V+eq5AS7TER9PRRj0x\nyj\/KTvLVSK\/Q7k6e9g7ydprkLdGi\/VyBrkTtYmy\/Ed4\/fJBmC0c8WMHsIW8M5eJIvKyzxUvvnHub\nTUxe6g4n+9LZvU0fHpREo1GdAt5uey1wTSDCxHsz2dxTYDgcXpYbkE9eK6CTSXRns1lHAMelHBc1\nmD3owGsFJKOcPJ3ZgymanhOAmw4\/MfbaAI1M\/h7DxdUCcAO0OMSyC2sOX5eRLfzx3HHCGGlZxxLi\n3fy+JZ5MawGQDYeXDC7i1pI7MixaCv3o\/IZ0svqGMZQ3+hhuuFKrBQM4JQFAkqJUkVhsdXbD86mB\n2L1yfsDwwYQxELuRPyjasvmCqQn0YTgYNQZ4G+9W2YLiBSfz41eOAwEw0XvaVDqzVqvVwmw0qgkQ\n5GQTSDLMPBViNbJ7zrZ1LCl+9dWL7G9hLDdUrpSJYqXixihacrqCfiIoS3JRuxejZqb1TtESEv71\nK8NZYyWRkc705YVgVGs1NJnJaM8CcZJUR8IsHOciTpXBdm0RCc+APfvycTvVt7bYfZ0zlGqv12rs\nYa0a46IRPcPSd6kgoUVxXOHHiEmWDek9KD4tnCqbNh8mGVRufLzkiXz6Clp7oDGTmc+KxZKjfngY\nyRUKmzgdkpyuIMMwd0EFt30BCUkzyyhBLkpX7O1yU0CsJ3d\/\/lKDYQ4XVBS3N3RUr8er1QqZSKU0\nNMMoaIZWN0NC0rQ6SFEaAAwQwTkuwiJmFz4+pNK3zFmI4ZfX3khxy0ynof1SdUsAcvVqJZxOxGxs\nhNVgFDPZrCBo8XYAkwAg4g1MMExoNcGyLrvLOzuk2fjUQGahlxIMa7jQh4YTg9b54ceuVelJyO8k\nQtHwzNkWg5AY9StK\/ZJi0eH2gUTfoShay7G0V79lE8v0bvGqO\/HmCw2GLXqgcbA5yG3UoqbZbt4k\n7+EXh6+QVDgsOQu80wMFBv7yMx4s+ecfBVxevwwL0mqWpiwUgW\/1zSxd1vq4FzcbLZHiChItXGXS\npe6g14ptym7xq7fb+IlPfrd3FoggdtnQ395+2ASqb3dabNtuSQALqvFg8G6EId3rJuvY4PyGaNkf\n++ULeSlycCWph9tvzVYas+l4GN2YusFL2\/7AD\/\/97YdngdJrf4o0cSMfvFMHLQZAtw+VB4LkPBbE\nlykCtXZJ5luUFuKHzUbwZ1ustOVKlCGuUO3PlRuaRr1OrY2180N\/\/cVTxLZtQ9kEbq6oF5s4sHTK\ncV0TaEc8UwAYwIPzJIEbDCaLpF08By27ox\/9oGB4UxWRP1W7DKpXrjdM1VrVox1pqzQRxiWprgmU\ntPx2r\/n7eMtv9kCKm0CLY1vixTClEBiND8cXWRJ1jSmXO8ZWHeLv9WoKguFMlGE0XYWSB8cju+X7\n0qOjhq9YKhkXh9q+bqN6oCUAgMsTtyynqwdSfBaIuL0yFAAxQkOTqNXjcurbR+QtM6ZAz\/e5iK6g\n2aOrodxRe6Z8f2q33JiqHR4i+YODe0tjHdtNyHT7e0mv1yUD+635G0hxcw6eBpodyITQYrUwJzUE\nga2zZMA3Prcs+mxcfRWm8x9+p2B4UzUxkWtAmcrx7XT5vkQAThRK1eV0Nqfe0ip0TczYpV+VVH0t\ngdPBQBxW2TcBtxxOiTuAKkAVcRxfZYiAX7W2OdA6IIXGtJYBpZt687mCYY9XnaSAi5RPrmWrD8YF\n4Hi62Phi96A2xyVTU+FYUnK6nafHilY2AINB\/SygxYlM+QligSBwPYUHkDv3rL0dXyjbPu6WQMJs\nHPj21sbKPcHCiYjKN1p2D0+GhQqKU+Vj8U6xPhbLloej8aQEAMcuvVs6jQQLhKR5kjwLaLI5JH4c\nn2coHPF4vat37ll6JAsbIgDsmL4r0qE7z75MgDS5kjWYLT+CuOL9zt3qyUi68mBECMlofL9+G40X\nr0W4xBgAznRcjJwFgjHzPECPH1VSQdzoR1GdUm\/rkeu2ejrHlVf+8fk4NGP0TzxzNjriFVWk\/ASK\nlh+1Zqong+nqwyEBOMQdHA0Lc3AQHHVUNDEIgEvi69uncfKbH5Cnz+L\/BxT2oQrD8TUKx2wACKo4\nfddwCwDfvzECbdC5q9\/8IWinDgNgpv74pgDsTwlrp3Q8wB0cD9K7tU4AxCLJLgC0G5YXT+9BtxuR\nPS\/Q5Q\/MuYQq6szImFJv7QX7UL5q6v339MI1AJRteEXPGMzl4UTlyZXc8X\/6Hzx6gubqjyZT5fv9\n3P5xvz++fxkAXWz6X4mdzCwXTylgRX9kfeLGjs\/nljePOjRISvEgqRDGiSKAogor4h1fhG1dBrNj\ndG3TOji7Yuxcs3oGl0yuXs0m0qvW23ufInXm3slFQ\/eVYXm7ntgdfmaCsd3DOaGCt5sVPHn8hP7y\n8VeZQu2+yssVrtqZTCsRy3Zxmb3pvVzOkM2mjenMzgYXj68Ir5orwVBYOC0omdmDDqpgZ7t40QwN\naQzQwJwB6lXooBG1vq1ndqW1Y1wNgaPu5rSmTbVu7QPAeeP2xCaVWfjW8xlN1y+F80eqZOnB7Vz9\n4WSx8aW23HgIV48f2guHx1oklL0KEwkIDkRbbXjs+hbKXof9zHW1GYUUJi80a3BBU+sOSLJihc4C\nb0qXoZtTi1AT2DmuurywiYyag4lVF5v5yXe6KICPk96d6l0HV5Y7o0WxnS2IwI3aROxAALjuj0A6\nFwstIySkcRDQ8wJHF0yiWdgn1SAsvEmmR4Uj9eILeR95eqsWljlaVAgvT1IzW5Aa6ZwOJrOwgczA\nhmAG1hNpeB3bgdewJLyGJmGYznEwtcdt\/G+pwH\/B95zn\/fL1Xy09vR0beiptAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/general_vapour-1334268921.swf",
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
	"gas",
	"basic_resource",
	"trantproduct"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"h"	: "shake"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "gassify",
	"v"	: "give",
	"h"	: "shake"
};

log.info("general_vapour.js LOADED");

// generated ok 2012-06-06 12:35:42 by cal
