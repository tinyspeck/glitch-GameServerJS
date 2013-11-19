//#include include/takeable.js

var label = "Ennui";
var version = "1337965214";
var name_single = "Ennui";
var name_plural = "Ennuis";
var article = "an";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["mental_ennui", "mental_item_base", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-39,"w":45,"h":40},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJc0lEQVR42u2YaVtTZx7G+QZ+BD+C\nr6tOqdbRcalULaJQRFSopRa04r5EAQELWSAJWUhIQhISEkIgEAgBctgSlhBjgISdoBUUwabVzut7\n\/udQHWq3mRa1L\/pc132RhJOc33P\/t+c6cXF\/r3ewLhYOp10uCfKu8u9rrotCzM3y0ZheNsGE5VOv\nFFFM28cVM2kR5XT8rGJ2wxuHYm80Uh6xu8QRiHk+6Bvm0O1\/it57yxibeY7gxPcYckXR\/UUzqRW+\ni13w5w1ipCwMR+U0SpRTmgLV3MY3AhZWjAfHdCEs+ZfxeGABzyJPEZtcwZOJFUzOvcDo7Avcm3yO\nwchzjHoeYsY0iqC8D0OiTgRL+uC73QWpKYq71XPIU07ai9fDUTYsk9pZ4SNmESvhp\/hu9tmqZp4h\nNrGMZ2NLWA4+xqJ\/EeHxGAKTLzAQeYG+MYJsmsG42g+\/0I0Qvw\/Bwh406CYgtz+C0DQPlXiMifwZ\nN9kvzzc+ZBb7F\/AksIDlkSdYIaBn4SUObIXeL997jKdDjzDPTGGiNYShyPfwjf+A3rEf4O5bRu95\nK1o+VcN7qhH9XzhRLwpCYl+AwPQA+jwfmM+cseDdIO\/\/zs9J+dymGdt8dL5zDg97oljwPcRjAlka\nXsDTwOKq\/AtYGvgGU20jCNkH0C9vha3YCXX7t1B3focq5jnqr9bA8HE+GhOV6M9oQu3dAEpqF1Bs\nfIiaa73oOGZDe1o9vFd6ovLy0U3\/E1xmZvsGe+VotJOZR5f3EbyDjzEUXEJgZAXB8LcIkZwOAh9c\nwOOeeXilbsj3F6Ji2zXo9tyExDwPSdv3kHn+jaqidlT+8wZq9okwdLoZenEYpdZFlOqi6MxwwENw\n1RcZ3BaGcE1wP1aW60n4XcCiu16evXESzrZZuJkHYPoeoUIzBnPjLCzOeQg04yhSTqC9fwkGVQS9\nnzthP6SE7aAMjsMKmPK6OMCKzh9go5B2pZsx9FkTBrPbUGZZRAlJw7+PnhMN0N304pZsAndKg9B+\n6YI53Y6mJPOvO5me7ohXVgZgtkZQ75hCk2sOJZIAzt\/y4ULBIC5TiK4JQrgtDXM\/nK+ahkA+if4z\nrQhSWxmhm\/gvdaHc+S3Eru\/glIQxmtOGEH3uoO\/y656Ar38AD13fSsB5lVO4VTEO7X4JGj7RkPSU\nDqaY7cAvQCYmWjZcP+uMNUkGMCD1IagcwkBRF7sjNB5Ww5JUAsXpKvAvOcDjB8CTRqhdTKGgahZC\nupE\/x41RumnkbDu02jmIGlfQXD6G8Fk37n3VgTLzIy7\/Gsm1fgqvmN2oYhL5XzkoNXjoOF6IhsNS\nVJ104Oz1vuDPALNONGhsl9vRW8hggN8Df7kPTalW1H+igD0xH87kArQdK0Rr6h04jhSgNseBiiI\/\nCmXjHKSEHF0FdMNTMBQrtSwyLSVBYTi7nWeniVNs+kbj4Hkp3M1oOd+BPIJjN2k9WQ\/1riLU7P8a\nNZQqF2\/04SwV0JmLDO8VXOf5zo1+0RhqDxvhvtCC3gIPOnNb0ZBYA8vBYjQm5XNw3aeKaadFaCZY\nT5qRc8Kb1QIJ5VSBegaWoiHNSLbrNxN9KMMRX5U\/kENw9tul96OdVMnuT+vgSrZARfDnCDD7Sjdu\nUW7b9hhW+2SwNJTjobFk2KdFy5lGMNfdaEgxw5pogiRZDEGmDuVZekizjZDm1ECcY4L5TBP1NwcG\n6IdCd\/yxCpo2f6TfdqTUpblSLEzLUQtuUkXnXO1BGRWQ9YAB5v26HO4iGuway5Fa6PdqYSOw5gwb\nRPSFXKq+rHPtOHPBw+2K3d3LgrlUNIwbxcNQ0N9GyUTCn51azmTbxuwrPcIvLzAx20EjdQUDG0E7\n989QeTiq+VcVqvdoIEvQIzu1DicpfBnkzmmqwJeQV79sQGmaCpKkcjDUw7qpLXTTocEvm9Ks52nF\ncqAm3plkTqA+GfOk1sfH9Rf4UbVLDfE+DdKPmpF2rA7pJ+w4melAZpYTWVnNuHNIDNn26zCmCtBx\ny4aQyIf7pV6MiQMYV4YxJomAPV6tJ6j\/tJNH0sS5ctoh36nC8QN6pCSZkEoJm0bJy0JmpZpQHH8L\nNZkyDNf0YtY7zs3eB65pzFjHEFEF6DDghfcsHa\/OdSCsmAquF2SEipe6QjDOnGyNXdlThaSPq3H0\nkOEV5JkUC6qPVmJI58G0+x4m2+5h3BnCnHMSEXMQwwo3AmX1dO5r4+YqW5H9l7oxrpjmrZeLgayW\naJxsm5xJ26\/jAFkdIchj1GL0x2oxXOnGhKULUYcXEzaSZRQR430E5D548uqp0kVopc24kq1oS1nV\nqCQSXS\/AruMNTFzJhwrmJdxLCfZq0JxrRXexFcNSB0KqFgRYx+SDGBb74LvLoOemG22ZDWg+Wotm\n6gJOVvR68PYAIut0cm5OMjNxuTvVvLVwpz\/SckVTe0oLa5YcLZd1cN80oCvPhR5q4q4rdM77SgnH\n8RJYD+aj7oCKWoKJnaM0Fk3oPt+JyB\/si68v4z4tE3djm3xT8poQF+xS0TGpEqqdChhSlKg9qYU9\nywz7CStMKTSX00WoP1qIzvQitKUWovZjAVZ7F+mQES5q4GH5dMJ6AMoputyLU3s1QRYuOUGHiu0K\nKD5UQkmQ2v1aGBMN0NPnOuqTyl1Crt0YPuKh7lAejcLbqN5bhNqEagLVw0JynmhERD6Vsx6ApVsk\nq4CXdlQmsC5mUO5JPpBBuk1OIAS6Q8m5qdwhQ+WOChrslRBt5aH8\/ascqGw7D9rdchj36WD8SIca\nUt1h87qFuHSz5L8nm893q4UZe6tQ9n4FxPEyApVzbko\/KONOxu1pX1PYVVzoFR9K6LMKgqvipNuz\nOoleqp6dAOuw+JulP21ZuTsUQsEWCUT\/kP4U9EdH5RR61lU2\/Kt5qoKaFeUtW1is6PW6tZlfs3Uj\na61gqwTCH0HL4wmWDf0a2LXAHDQnAqd0eeNPEfhbyzfxyUlWbKIKt0oYEav3pUEOlnNWxpC7JFmM\nzVnVvio0nHNAsl21Me5tLP5mseZVFa1xl3N2i1Tz8jNKB4Z1WbpTGdUk6fHWHhAJNksSfpakLPgW\ncYwFXdsKSjeLo0K6VrhVyot7m4t18ZdydO179REDQ6kgfCeP2TTJhtjvXaP91MgYT1l5bx1O8F5F\nfH1uE1537PWlTtIz0t0q5q0DsmBsFbOgv5kGVCT8rRLmnYS49D1xzu85yBbS69X+l1oEl8Zu5O8H\n43\/V9R+vMrnUG6hS9AAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_ennui-1312586187.swf",
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
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mental_ennui.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
