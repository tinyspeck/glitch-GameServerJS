//#include include/takeable.js

var label = "DG Music Trophy";
var version = "1340228514";
var name_single = "DG Music Trophy";
var name_plural = "DG Music Trophy";
var article = "a";
var description = "This plaque shouts out \"Look at me world! I collected all five DG Music Blocks!\" Metaphorically, that is.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_music_d_green", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_musicblocks_dg"	// defined by trophy_base (overridden by trophy_music_d_green)
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

verbs.drop = { // defined by trophy_base
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

		var result = this.takeable_drop(pc, msg, true);

		if (result) { 
			var trophies_outside = pc.home.exterior.find_items(function (it) { return it.hasTag('trophy'); });
			var trophies_inside = pc.home.interior.find_items(function (it) { return it.hasTag('trophy'); });

			if (trophies_outside.length + trophies_inside.length >= 11) { 
				pc.achievements_set("trophy", "placed_eleven", 1);
			}
		}
	}
};

verbs.examine = { // defined by trophy_base
	"name"				: "examine",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Have a look at the trophies",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var rsp = {
			'type'		: 'get_trophy_info',
			'itemstack_tsid'	: this.tsid
		};

		pc.apiSendMsg(rsp);

		var pre_msg = this.buildVerbMessage(msg.count, 'examine', 'examined', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function canDrop(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	var loc = this.getLocation();
	if (loc.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function canGive(pc, drop_stack){ // defined by trophy_base
	return {ok: false};
}

function canPickup(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	if (this.getContainerType() != 'street') return {ok: false};
	if (this.container.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function getAdminStatus(){ // defined by trophy_base
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc.is_player){
		var location = this.getLocation();
		pc = location.pols_get_owner();
		if (!pc || !pc.is_player) return;
	}

	var ago = this.ts;
	if (this.ago) ago = this.ago;
	return pc.label+' got this trophy '+utils.ago(ago/1000);
}

function onPickup(pc, msg){ // defined by trophy_base
	pc.furniture_migrate_trophies();
}

// global block from trophy_base
this.is_trophy = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"trophy",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-50,"w":50,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ50lEQVR42rWYeVDTZxrHu53ZmZ22\nW7W1ohUJIUBIgEAuchMghASQ+74pK\/WAVsXttoIigkDVeh+Lt6vr1q4XWKyKW\/GoKCJyiJS23kfP\n2el2\/9nZP3a++7xvEtTWdkrQzHwmhN\/83vfzPs97PL\/fM8\/8zMdkMpmNRuOip43BYCh6xp0Pu1kX\nFga9VvtU0anV7W4LGvR61sBTw6DTjV5wWmEBvrl7A9\/eu8n55t4Nztd3r3O+unON8+XtLzj3bzm4\nd\/NzBzc+w13G9SHcYVz7FLeJ5fW1o47gIZfgd\/dvY+fWzdixdZODLS6aONs3P2Ab588ONrnYiK1N\nD+jvvoBlTkG9RvO9W4IU\/naWApdgekrKE6P9xNGHBeG+oDOC396\/9bOdJcTHw2qxwBIZ+QixNtsv\nCy5ZPLxQRiW4alnjYwWTEhIQnRyFzJ2JmNGdhzk3ijDvdjHm3XkNc28Wo6QtE\/HzrIiPjf3JvSfb\njuLw\/r1PSHBpA7778tEUpyQlIaExFqWX81A2WIDZ14tQTt+x2+ORfyQP73xViopbxZgxlIOpe6Kg\nMSqhlssRLJEgUCzGoQ\/2oIUE2UoedYpXkuCn\/ZcfEbS\/YUVxZw6m9+ahfKiQy+QeS0fq3nTo15kw\n6242sq6bMXVAC+tFNSSVQvgKhVyO0bRuNQm+P0pBrZYvEiZ4tv3EsFx8nh15pzJRfCEbr5NgGROk\nlCrXqJHQaYR8jxT2c3qkXTdg6hUS7FTDdEoB3z8IIJNKERQQgNqFlWjZ9z60KpX7gnRjj\/5Hgllp\naUhoSkBueyaKOrJ5igv7kpFAkQr9qwTBOwLg\/a4IuXcsSB7SI65XA8t5FYwn5VC3yuArF0IWGMgF\nmymCeudJpVQqx4xYUEcjY7BFcvbkCWSmpiIpNxGpR1KR\/XEGcs+kw3ragKgOFSwdSgiWCvG7aRMQ\ndz4ciYM6xPVpeHrNZ5TQHQ+FsiUYklIx5MHBqKuuQjNFkEWPb9Y6nXlUgmdIMCsjA8nzU5DckgLr\nYQvULSHQHgvl6Rsz91X4rffDlHeFiO8zwNYdhmhKbcRZJQz\/cEQvZH8QghoDoQwNRd2iBVzQMFpB\nNsLVy5fyFOdkZiKxOhmKXWoE7AqAbB91djgYgX8JgHC5P1SHgjF2rifGv+UNjyofLq5vC0XYERlC\nDwYh8G9SSOqkUCsUWLJooUPQVTC4Jejc5Y8faaEUt\/EUy6Yr4LXeF75bxZDslkD290D4bxFDuEKM\niTXeUOxWQbpZBs8GEaQ7JXwAoQcccv47A+C\/SAINLYwlNQtxtbcLRprjhtFG8HhrM+38x3g6VIkq\nTFrpA68NvhBt9YeYohdAvFQhRMjuUEyuozTXSjBxoS\/CmlUI3ktRo8Xjt10M7yY\/SGYFQUtbSz0T\n7LnoEHRUNO5H8NiHB9F6aB\/faE20L06q98WkFT6Yss4Xwk1+8N0mhs8mf3jUCjGxzgdjKryg3hfG\np4H\/DjFEW\/wh2OiHyatF0KaRDK3c+ppqDPR0wkjtsQiq3RJ0TuCjhw\/gw4Mf8LnDGg+docHL9QJ4\nLBfiVep0CqXci2Q9a6UY97YAr1QL4bnKIS+gSHuuFfEBvVotgslg4IOuX1yNK5c7+YBZBEcsGBYW\nFsLk2OiOthxAY13NsKA1KgqC+VKMrfXC+EZvTFgm5ALCpSFQ7DDAb62cR4tNBY\/3hHhlqTdeWiKA\nMTl8WLAgJxtXqOSKMBq5oEatnj2y6NGkdQl+1PxAUEuCbN7EJdrhXyHH7xdOwZgaL4wjARbVlxsE\nXJp9v0S\/2SDGVQmgytQiMjycR0znFOzvPg+zU5ACssg9QWrsSPN+NNYugormoNZZprOG4+x2yGcb\n8eKfBHhu\/mQ8X+WJFxY84PlKT3j\/UQZbgo2XX2aTiQ+ODTI\/Owt9l0iQIsqCMCrBk8db+ZxhG6zG\neXayVEVQRKzR0UjPzUDM7EQYK2JgmmfjRMyJRUZJFq8Jo2lKRJrNCGfRojZZG3lZmejr6oA92sIH\nrHVXkMlcG+zj+5ZCJnOk2RlF1iHrmAnEkKgtJgZ2EuLQ3zFWK78WFRExHD02h8OUStr009HbdQ4l\nhfl8IbovSA1+MdhLO\/8ChAYF8SiyDnTOucgk58y0481pNpQXxmBWngWvZ0eiJMOE6fTNBsDlaO6x\nwbLosamSnZ6Gnovn8FpBHnSOftwQdGyg+PxqD1UfVbxUYgc964B1xCRtFgN+GCjEvbY0tDfq0d8U\nifNrdPh4mRyX1oQjP9HMB\/KwHMtEVmoKLnd+guL8POjdEWRP+zz01OjnAz28PGJ1XAiVSnLqgHVU\nMycG19py8L9vZ+DfvYWoTfLAqrwp2P22Aa1LNRjcGY37+zOxe2X6I3KsjfTkJC5YlJsDFgjqa8eI\nn4m5IKXzs4HLXJBVwsOSFMmmunj88+wDwXXF3vhsdwxOr1JjWa4IX+zLw\/fHCnF4QxpUNDXkTjlW\n9qclJaL7wlkU0nbDM0XFsduCQ1e6UTa9dLhcZ5Is3RsXx+K\/V0uGBTeW+HDBrs0GrC6cjFtHK7hg\nCwmG0oBYocruZW2YDXpcOn8GBdmZMDiOu1EI9ncjMyV5WNDFhhobfujMHxZsmuYQbK0Nwfa3LBja\nk4Svm7PRsj51+GHpYZhgftYoBaNolX7afwkZjxG0GKgynmfGN1T6M8G2dYU4tiYfH61IxunNdgxs\ns+DDBhtyU3U\/uZfR1XEapcVFfJGwBzS3BNkkHuzreqwgQ+Lnh\/eqI7H8HTPqZ+pQXaLE2wUyzMkO\nQFWhHJGaoMfex7h47hQWL5j\/BAR7mWDSz3bkLkywpmo+3\/RHnGK9Xj8seLX3ItVuBJVHrERiVQh7\n+dNPZyk7T9mR1cugjZdtvmz7YLBV2n3hDJ9rl86f5int6jjFxRidn7Q7BB2v+EYmyELOBONjrGig\nc7iBCkxWBbtgzxTsdHFRV72AP6m5YBs725o4CyoplZU8nQwm5cK1SEb8+sP1Zutpv11lGFmNOFLB\neIOiJ8cUjEq7FJU2MeIMCsQaVE+UcpsCtfFSlFuksOtpcUX7\/PqH99kRvu1zI31vVkT5oSzcB6V6\n73+VhYs6ijUCFP2IGUafLuISY7rRp9sF+11mEt2ntvAw5WbRvTfNoqt1UwPB2mfQ\/3vKI4Uhv8bt\nBcKTEBFSQk5oiHDR+OemTw2ehNjAibBJPBAdMAEGn5dv07VSYgZRRrxBvOn8Lvef8PzKLKUnclVT\nUBDmhWKtAFkKzwt0bSoRQ0Sw2oRQEEGEH+FFjCN+82O5FwkPQkzI2KMJEyOsREJKyKTWUr0QJTpv\nHrl86jBMMK6VrtURy4m1xGZiF7GV2ECsMInG\/ydKPAFWGpBd6oE4GuBzv312Jl3LIpIJ+0OiwU7B\nicRY4tn\/A\/kupXByAaXiAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-07\/1278112433-5296.swf",
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
	"trophy",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "examine"
};
itemDef.keys_in_pack = {
	"r"	: "drop"
};

log.info("trophy_music_d_green.js LOADED");

// generated ok 2012-06-20 14:41:54 by lizg
