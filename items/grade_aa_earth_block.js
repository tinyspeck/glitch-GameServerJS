//#include include/takeable.js

var label = "Urth Block";
var version = "1342641218";
var name_single = "Urth Block";
var name_plural = "Urth Blocks";
var article = "an";
var description = "Marginally muddy earth of Ur, less-than-lofty loam and heavy gas from somewhat suspect origin comprise these useful building blocks.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 150;
var input_for = [];
var parent_classes = ["grade_aa_earth_block", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/713\/\" glitch=\"item|blockmaker\">Blockmaker<\/a>."]);
	if (pc && !pc.skills_has("blockmaking_1")) out.push([2, "You need to learn <a href=\"\/skills\/93\/\" glitch=\"skill|blockmaking_1\">Blockmaking<\/a> to use a <a href=\"\/items\/713\/\" glitch=\"item|blockmaker\">Blockmaker<\/a>."]);
	return out;
}

var tags = [
	"earth",
	"block",
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-39,"y":-43,"w":76,"h":43},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHNElEQVR42u2Y2U5bVxSGeQMeoVLv\nqirBA5PDYGYweGKwARvbGDPYDDaeYgbbjAFCGTIUaBqSqJWqqr2hqnrTK0t9gT4Cj8AjrK5\/2fvY\noY1aqa2UCx9p6Rzvc87e3\/rXsA\/U1FSP6lE9qsfHdbw6ctW+3XPGrnedN6fp\/sJJqr+wu9J1tzHf\nfjvvNgbO0hYz7l\/lrVuHqz1iO9FOx3G813yW7jVf5vj+wbD5ze5w3X8Khgmv8rbzy7z17iJrI4aj\ni+wQPV+30GG8h9ZmWykXNtNRvJdO+N6zNQu92i4+tz7bRk8TvXL91ZaN9qPdlA620PZiB73YGKKz\nzIC8mw2bb7ML5ptsuH0r7jOZ\/zHY6137u5ebg7JwpQFmZ7lTAFZ9zWLrc220xQufpC30fMNKx8k+\n2l7qpCexbnHmKu9g8BF6vTtG3xxOsnO9AldpkYl6WOFvQ\/l6z751kuq7w8QAggKvtp3047MgXeas\n7P2gjClYBQ5lYbiP3\/edO2fFoDCuAQ6oRMDEzrVSKvioCDj5AUCAXeaGzk9LEyFMgOFcoi9Sfdrk\nCoxzTcJ2WgorYPAOxg74HaiJ8Cq4t\/tOsZcMj1ADDmChUT2tTDXSqr+Jlr0NtHQf8CjTU3uRHdz6\nMjt0d73vot9+yNObfbdMurfSJYZrgCJkWBTAUA6G8d3lLlENYPlIB62FWsWgEuA5VbTncEZ6hItq\niSnAhXEjrAyI6jpO9t4h2StDAQBMAi\/VGEABgAUBht87DHycHGCHxunXd0n6+WqRrvdcohAcATTg\nrvccdPq4X8IZnjAKTGhML4rFfI0UZUCcZ3lsydtQBmSIAiAyoWIlJqdNohLyAd4DMh8x04q3mRft\nes8JFAGeUb\/zi51\/KiaVd4BFtQMIigFQQeFafvP1nMvAazXeaoCAUYDqGt5nQi0Cl11op\/TMI365\nScbxjDLkGO5jHGoiTBjHu9Epk7SgbVG4jzIMtxHuEpAlT4OcD9PDcgakUhL3uKdSaET\/iQAiZJvz\n7bTBLeJ+yW\/Ml8cAifP2MudfxqGNqx6IOVJBk3Y9766X9xEJGYt00VnOI0BKwZPNCa0wZlm5zUg3\n7SedUslzLr255jTRV6eqCRNh4sfsfXHRDrrc8dDbp9O0F7NIj4PlI6zcUvEdPIsqROIDBr+l6bKq\niUBzqUqLTma4X+aWejXFEN4nSbuEFarBEpxeMFbwTiuQbIViWGB6WI8cEJDjxw5RazfaL9AqT1WI\noapSENcAg2GeSli8pyAAB4NKqnJV\/mEMVcxtp6ABqkkQnlgpSRGCdCk00kjZKyiMNEBeok2gOLB7\nIN+gHkDhyPG6S5xbr0gZRAYOLE7Wy\/x+Zx0LoZPQqhBL6BkQ94KjujIgJsPEvOHLA+hNWAyLqrys\n3GvR40TtmVbyOww8cXGLe5Kw0cWOl365TggkoBQgnIMBBAUAlQC6WMpFZRgPjuhoyv6QPIOffSKA\nTzOj9N2zCB2mHBTnvEGbgaJKOVEAYZtp0RZFyJY93MdGjXxulOT\/6es4fX86TS+yI7Q211EsvFKR\nYE7MDQEqQ4x+iDADHKbC7HM8pCnbg0LNTqRTFDxIOSWJVVgQDgUDxdBOkFPIochEA8X9JnkGv3F+\nsROgiz0\/7UV7yvnMDhVT55FWQEopQKhWo\/IPoFAU1QwFvbYH5zW5SJv5fmsBJEKaLi2AaxQNXkbl\nwVQK4Ax11u+1qFSwqLaKBBwEqKpghPIgaaXd1UGZT+VguJSDXvvDW1fPp7UaoAqFUk2FFhMXW0Sr\neImQRrkwjhID9O3pHOUWu1nNZg0EYOHxBlpwN0jjRuFhTswDJ6Aa4JCHmTmzGOCQd4Cb4Y8Gn72O\nfLYHxe9BVmALLwJOtQWotcT5lV8ZLBVPm+Y9DGOHySHa5D4Z82G7atJaj0oPlct4HlWOfR1zqC6B\nClYtBucAqxZwcnU7dLdT1s\/LX9txX4NZLQxQSX4GxCKV1aXlCk8GR6CK2lczJcdUtaudAirh+RVv\nkzaO3\/gYCAzXyf15t0HOAWk5zYXxfl3svc+syGSDGbKHRg3iNbwJlypNVRYmBpRUYaktqN\/ISyye\nZTVPNscpHTLLgphHNWaPVSdg6KsIoeqDKAZUK4f3zmN74PjLD9TUdMs59swpG3vl1Je8Mmq9ambE\noC2GHQbVp9RUjuEa4cMeDXAVuuCwQcKGM3IROxYAUaEAg4p8HZN+96FjesR447cbzscHdAXYhEVX\n8FrZI\/YaNm7RCRiA\/Y7it9viZLk9wCnpXazkslR6+d7smEEcxzsSHb6PeQTOqeOz7uZf\/zXnsujN\nMPeALuCy6M4ZqDDNqiy46+VrxWvVCwQWxtlnL15DWQDCwdkxI3eFZimmkoK\/8+6zhfT63\/4+jnqa\nHFA\/MtkYYKVv8Gnkt+sCbovuRkUDxtFhNU3ijMdadyvN92M6MvPG2njQJFGo\/tujelSP6vERHn8A\npZfxcXjxu5AAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/grade_aa_earth_block-1334348244.swf",
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
	"earth",
	"block",
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("grade_aa_earth_block.js LOADED");

// generated ok 2012-07-18 12:53:38 by martlume
