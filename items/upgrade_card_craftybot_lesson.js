//#include include/takeable.js

var label = "Craftybot Lesson Voucher";
var version = "1337965215";
var name_single = "Craftybot Lesson Voucher";
var name_plural = "Craftybot Lesson Vouchers";
var article = "a";
var description = "Reducing hours of brain-melting study for your Crafty-Bot, the Crafty-Bot Lesson Voucher contains special crib-note code facilitating the instant learning of one (1) skill.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 200;
var input_for = [];
var parent_classes = ["upgrade_card_craftybot_lesson", "takeable"];
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
	"no_rube",
	"no_trade",
	"upgrade_card",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-10,"w":38,"h":11},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGfUlEQVR42u2X+U9TWRTH\/Q\/mT5j\/\nYEwmmUx0jMxMZjQ4bkHHDQyLjgw4UlCWUlqKlrYUEFoWEdrSFpVt1EeVRdYiRdGyRKGMWlZRcZe4\nxRhNvnPPdR4piFv6\/GXiTT7hvTTc93nn3nPOfYsWfRlfxqeNsbGxryYmJoJE2L3aDxvDJXL16lWX\n1WpVB\/zQ8fHxr30+n2xkZET9H\/ns3iXC7mcYGB0dnQOTmAObZw7sBWCxWFwBC7KHCySgVKXDZrOD\nrufzKXIkJiKJIEXposeDkA2\/c840N79T7mOi9lkEKXrbQrfPEfQXGxoaQktLK5zOU\/B6ve+NGjE5\nOcmpra2dkUSwrs45J4KiVHNzC7rcbpysMsHr1mGofR+aqhLgHRr4oBxx4sQJSCJIEaNlJiExakJt\nKazGKJQbI3HSGgVjRjAqCrahpTIK+YbEt+T8xYjr169LKzg\/ESpKU5GRsAyyyG+hTFiDresWI1+9\nArmqVSg2ZnxQTjJBJuNaKBG8g\/3o6hCgkAVDsMWgKHMV1q38Bpa8cGTrkt8r9tkE52fpObcLpqwY\nnHGWQagpgSZlDQ5nb4FevRMDAwPvlJuamuJIJrhQ+ZiYGMP5jqM4U7UbyrhlkO9eCsVfP2L7xu8Q\nv3MJCrWb0NrSCNYxFpT7bIJidtZXp8PTIENTdTLspu2w5W3AsaJQWHJCkBy7HDWHt2P6sgHujpoF\n5W7cuCGtoH9dE45XIHXPzzAXqhCzYz2id2xCZNhviNgW\/IawtUhM2AV1\/HIUZoVjoN\/zltz09DTs\ndvuEJIL+cp2uVuQa0lFqSoI+PQJxu1mJMRpRVlY2i1wux7aQJVAlh6MkLx61VaWzYiL37t2TppPQ\nycO\/6MZGrcDhQyacrLXihyXfo729nS89PfDRo0d4+PAhl3GfbcG6VUuxb89mGA9m4prPN0fw7t27\nkglOiHL9\/f2QxW6BUpGACxfbEBkZzvcWiT1\/\/hyvXr3iPHv2DLdu3UJoaCji46KRLNuMtuY6Lnbz\n5k2OZIL+Bff08RJE7gxHVqsNh81F0Gk1uH37No\/a06dP8eLFC86TJ0\/w4MEDJCclIl2VgrDNv6Ch\nsXFWjpBsiWflThQhR\/ETMgp2Q9VYArViFwpM+TxS9+\/fx8zMDBcj6JoiRL\/L9kRDfyARPt\/IrBz9\nD72UZIJUaDOVkXAYwxCTuAnqljK2t1bi6JEKvt8oiiRJDyUoOpSlBq0SbX\/LkCkPmSNH0Lxmszk\/\n0NP0YpK7NuqDzKJGoj4BKVUGpDeXIksbBofdxh8klo07d+5w6LraHIcseRCKNKtRrAtB81D3rBxB\nnSngIz97cBAJdg96kFBjgMZtR1pjMWRmDfL3b4BKlcbPhiQplhH66\/VUY1\/MShhz1ZDvj4DSngGd\nyz4rRy9A80omOHBtCPHVWcjsdkDRUIRUZyGOGNciNUWG7m43F6MlpmyenvLCbAjGIf1G6BVroLBq\nIHcW4EBnOQbGh7kc7c\/BwUHag7KABFkJUYttqraniUdQfroASiEf2tT10Cm3IPNABvQ6LfQso7WZ\n+1FenMo6yDLoFKuRJvsV6UIxUuqM0HTZ0PjPOS5IGe5h58vy8vIgSQTFFnVpdBinetvh6HZCW3MQ\nOfowVB6KQIF2K+Jz0pFUrIVBtREVxg0waTZib\/YOZDSUIulkHo9gz8glnlCPHz9GT09P4IJseQX\/\nHurfrkbZaabeWYNOj4A0hwaaThuyzh9DImuBjspU6LJjoWw8BIOnCvuO53LByZtvMp5qZn19PS3x\n14FG0DVfTMS\/6I5NjsPR1wBddwXbbyZk91YjraGYQ\/s2oTYbwpCLyxEvX75EXV1d4CcZJjjxITn\/\n0qFuLePLmXWhEilMVNlcgowOC1IFE3xT41yOytDr16\/hcDgC\/6J7n9h8OeJAqwXJLCF0549gL4ua\noqkY6nYzPFcvYXh4mCMKBtxFmMDij5WjzCR6fZdR6KqEpe8UDjbZ4DjvhHfyGhcTP1sbGpt4SWKC\nQsA18GOiJsqJiPtMXE5CYPtNFIz+M5bPI0WRVn9M1BYS85cjrNZyxMnisfOPaHSePStNke7q6gqi\n8x9NduXKlU+Omgh1Dbe7mwtm5+Ty\/dfX1xd4DaTBlmExTUTQkhDsQyef7SkXwbrBjP+nJZWPd9HR\n4eLCNCSpgZ86xBdhR6h1giCoe3t71W6329bW1sZfhlaDoA4iyTnwy\/g\/jH8BmLEOW4GU+xUAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/upgrade_card_craftybot_lesson-1334013061.swf",
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
	"no_rube",
	"no_trade",
	"upgrade_card",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("upgrade_card_craftybot_lesson.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
