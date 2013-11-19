//#include include/takeable.js

var label = "Piece of Chicken-Shaped Brick";
var version = "1350087076";
var name_single = "Piece of Chicken-Shaped Brick";
var name_plural = "Pieces of Chicken-Shaped Brick";
var article = "a";
var description = "A piece of brick that resembles one fifth of a chicken and is warm to the touch. All of them will likely combine to make a whole fowl.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_chicken_brick_piece1", "takeable"];
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
	out.push([2, "Collecting all the unique pieces gets you the <a href=\"\/items\/1312\/\" glitch=\"item|artifact_chicken_brick\">Chicken-Shaped Brick<\/a> artifact."]);
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
		'position': {"x":-12,"y":-31,"w":24,"h":31},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHS0lEQVR42sWY21IUZxSFfQMfAQEF\nRU4zw3FgBjxEziBHmeEwgAyoeABBMCogKoiKwSgYiYi5SVLJDVW5yh2PwCPwCD7Cn\/393RtbKqmS\ngTFTtat7unu616y999rr7yNHEvxsxEMV6\/Hw9no8tPV+MNSkxz8Ml+cd+b8\/q73B2dVY0Kz2Bc37\neMiw\/6DZtz3X5t\/5MBQ2Pw+GzP2Lvu3u8oxvD3altyS2IoAIgC11FZupxjwzfD7LXD57yjzuCJin\nnYXmYZvf9J85udMeSDuaVEDrl4MppBJmJJ1mbaDcLFwqsABmW31mvC7HXL1w2lyTGBSAsYpMM9Pi\ns+dv1mSbntDxiuQCHAptAoxUApJ4HimyAL5vypNU5tt9gn1hzdxpyP12AAXQrKb0bV+ZeSkphTUF\n5Q2YA+CYnAccbDrnfFtT55OUarpVAb7qLhEQfnPlu6x\/BUj0VZ4016uzzf3mfHNXGObYtAAfq8m+\nlbyu7QvuKMhnnUWWJX24N2B2QM5drzptRmtzzI3q02a62SmD0ZrsraTKigJcihbvgqDWAMp2vD7X\nHqdZAEfA5kxLvu3ypAJcaw8cfRMLflp05QMwrSXHTUfwhAXRHc400fIM0yLHGgvTTa98h2X22d6Q\nlCcVIJ8XkcJlBXi7LtfUBNJMXUGaBeWNBgHFOY1IWYYZEbZhPKkAn0WKNuc7CpgYpl5AAGbErTVS\nrGnVGBLhjoYy5No00ynswnZzaZIkBy2caysw8XNZFtglYQUQyMlsq9+8EOkhHrUHpGP9FvCYC7RH\npKZWGfWnbp8\/zMmyISZAp8iCdC8PoaaowfvC5FL\/GbNxvcqsD1ead5fLbbztL7Pj74mwfY\/uFZDo\nYU\/YifbSE4cD0o64ofCOTo\/l3lIz0xqwLMEWYP6auWT+ftJjNq5Umt9Gq+2Wa5k6r+T651Fn4sTP\nnbLgRqTDmdn1BembBwb400DZR+94A9DLbieVMLTcU\/JF4GC4bs1lEYCaetIdk263gi37dH1V4NjB\nhPt5tHgHILCwGCm0BoEA5Gp\/0O6T6hmpwQXpbo4DVEF5A2CwqFPlloxBFKDWl5qSuKy4N58XIKR1\nrt1vXsdKLUs\/Cjv9wghpQwexWdSbdPouqMWI88c0zXS8ThxAtpYeN9X+tI8JA6Q7nwi4eZe5924K\nSR+gsFY0AA++WJwunX3CMgqwBVcviUfyxx5Lw3At3ztEAaKhTDMs85ymS5jFB82OjZr3gKO+GGWY\nBa\/mdQo47XCYVICYV1ikoxmJN2tyxKI5952U8ddUlA6LswkBnBQt42HvxKBqA\/Bg0oOt4g8QAGTM\nAbBN0jbpekGA0Vhal2SECYTJ5TyA0dRqf+pOQgB58KJoHwYB5lYltdThXgejXQlA5vNEfe4u88+k\n\/thqLavJZYuY0yj8LiFdBKCuO2CQRvECUyYA1BVyGIwIk16A3k6G\/ZGqbHsN7BE0F7+rDhyLJWAO\nHPZED63uecGReh4ASEwAzPEgmMRJ4\/+8I5CAzZ4KcThSd3ERa+uAQhmJpXklGkz5bPODthO9iyTt\nXp0Qja6DgUkmhTbPXFvAysyK3AOQAOO6wXNZu26oV0Czf8GX+vVLVLHrMRZG2KtZaYTxumyjXa0A\nCcA0euwVYAFNmtXlvBFwNNiSp1GQIxgcOMMq0AG4r8kyUJm5ec2dm+jdVZEVUhdxTamG1\/fVugBJ\nN0wiJwBh6thZLt1MHVt37f5BvafbLF8\/n+Xf7cTPntrmBns9nlM7mdYTapoAhN1nukzgDYVlUguD\nSI0ChEFvLdM0GFxqsTqQ+vWOOxpMTZlr91VwE1I7tseMqlTAxoBr6dFGWOc4HUvN0UyaYt42aJl4\nA92kLMTh7H9J4J2dKg0a+vZA602\/q0g7JsHpZFwR6XXE3Wfr0KsIZKapOAGA3HzuP9a\/jzyiDaPT\nHoBPOz8DxO38IOm9Z6XHZ9NKeTD2KBVAD9lmS9ve11zmNRqpQQe9w5\/ARLwZCIu2FVswMAZDGgqQ\n\/bvSLHwfc80CzQM4vRcAdRLtW7DVrGKvvIzx4F8nmszv4\/X2PDoHaJwMRvW16Oe9ZsrCZ8GwPNAJ\ns1fwB6X+MA0iV\/u3XryctABjjju2DeAaVUB7\/wDn\/rzbYm0\/gG8JY4Dkd7rAR6AJFX2YaylJ3+kN\nZTYl\/OJIAcIOW+RjvO6zfBCv3eP63Y42uX6y0UmvNtGdhjzbJAC8IRJ2IMPqBWhXa1KLbK0rkeL3\nAkTjWNn9MeGkHGnR2Qs4Ta+3kbrCGbEDL5w+DIWWFYTWmnapAoRV1iPs\/3Lt7BcppyEAqC+adDvV\nkHc4r0HWhgJHBcgnXUqSRuchgV2XwjFdq0y3BGy86i2xNYbD7hIpQYyRIoT9YZtve7E9cHiL94VI\nYQUgdPFj3xrIKNMF0ry7blGWkSXOPZB08lYBt90dzthO6rvqGXE34vG2pMi3RmuzZ8dqciqmmvI3\n0UfWG7cF8IKrh7osoP6Yr5iAg7xJ+AduM+6JNxRS4AAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_chicken_brick_piece1-1348197899.swf",
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

log.info("artifact_chicken_brick_piece1.js LOADED");

// generated ok 2012-10-12 17:11:16 by martlume
