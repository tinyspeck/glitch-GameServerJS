//#include include/takeable.js

var label = "Broccoli Seed";
var version = "1347677151";
var name_single = "Broccoli Seed";
var name_plural = "Broccoli Seeds";
var article = "a";
var description = "A packet of broccoli seeds. This can be planted to grow <a href=\"\/items\/124\/\" glitch=\"item|broccoli\">Broccoli<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 24;
var input_for = [];
var parent_classes = ["seed_broccoli", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "broccoli",	// defined by seed_base (overridden by seed_broccoli)
	"produces_count"	: "16",	// defined by seed_base (overridden by seed_broccoli)
	"time_grow1"	: "3.5",	// defined by seed_base (overridden by seed_broccoli)
	"time_grow2"	: "3.5"	// defined by seed_base (overridden by seed_broccoli)
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

// global block from seed_base
var is_seed = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000003\/\" glitch=\"item|npc_streetspirit_gardening_goods\">Gardening Goods Vendor<\/a> or a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a>."]);
	return out;
}

var tags = [
	"seed",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-27,"w":22,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK5ElEQVR42r3YZ1SUZxYH8HyxgICS\nmE1cjTUmm+bZnGxOdt0cScIqCsQYLDHGhJgYoyGaGKUZioqhRKUIAoKUKIj0ovQy9Dq0ofc+zNCr\n2P9732dkhpE25EPmnPth4Mtv7nPvc+\/7PvPMNB\/cEWFiPB4R4uFQGx4MNONeXwPu9tRirKsKo+Jy\njHQKMNRRjME2PgZa8tDXlI3ehgx016WiqyYZ4qpEdFbEQVgWjfbSKLQVh6O1MATNBYFoyruBCp5H\n+DNz\/fyVwNKkK7y54foaFj8e6cBjhhOzeDwqwsPhDjwYbMN9hmwkZD3u9NRglKAjogoMM2gJQYsw\n0FqAvuY89DJsFmHT0VWbClF1MkSVEnBHWQzaBbeRH+c+N+CD\/jqNB701hBICY90E7cKjUTEFIUc6\nKYR4MEwx1IH7DNxK0YJ7HLy\/GXf7m3CXfsBYbz3GeuroR1B012K0m\/sx1ZR1yjz3vYu+04+s5cfM\nDfiwp0r\/QU8lHg23MeQjyuaj4XZ2xA+HWimLzQRqwv3+Rnbc9\/rqcbe3TnLshOCO\/k5XJSW+AqMi\nrgTKWBkMC0sxTBke6ijCUHshK4lhUSXSwy8Vzy2DvVWW97srWN3JcK14ONgyDa6WcATrrpbiRuVw\nBBOWEK6YYIRrk+AGqQyGO8sR6GiAOQF9qjZaelduhEfjJmm4N7wPt\/qNcK37N1xq34Nzzbu4VP0O\nHKvehkPVP2FfuQEXKt7E+fLX8XvZa7AVvAqb0vWwLlmHcyVrYVW8GmeLVuJ04QpY8pfDomAZzPJf\ngEe5Ljzt98wNeDr5ZUsKmGa8Ig2TtJdhnLoORry1MExZg5PJq3EicRV+SViJ4wkv4ee4FTgWuxzH\nYpbhaPQyGNx+EQZRf8MPkc\/jcMRSfB\/+HL4PexbfharjYMgSHAxejG8C1WCTrAUnj60wzV+qYcxX\nX6wQ0DZag\/eNvxo+vymLvTdU8Zm\/KvZcV8GeayrY\/YcKdvkswi7vRdjptQh6nsr41IPCXQk73JTw\niSuFy0Jsd16Ij50WQNeRwmEBdC7Oh\/YFivPzsc1uHk76fQhrk01wMdi4SuEMfuunyvv6LwIa39gC\nJyMtXDr+oYbCwLuiIt7dLsGfaAaBfDO0y5phoCUf2Xx3ZBe4IiufIu8yMnNdkF7kDTcTHbjOBXhH\nWNQ\/Ji6V4XrlcXcm4QTTdupAaz6bLv3NuRQ5bMr0NWbR5Z3Jpk1nbRZl7yO4Gm6eA7CzEGNiAcva\nvSf3mxxOPI6TZG1EKMENPcENToVregpXn44eArZVpHLHiyumW\/XnkEE+Actkl68U9+Typfkrh+sY\nx0040mlxGejhcPVpBMxCe2UqLp\/UhOcpbUsF5zB\/8WhHAe0HAtlkmIgTSXDCxgwEx52Fe4gBfCMN\nUSWIZLgivj\/SM9xRI4hgOCmsMVOGq0tji0QPZbKpOBZuRlvgZaarGHCsM19jpD0fdzpLJjVDWVko\njD0346jLf7D7t9XQMFmALZZq0LJYgi3mi6FhPB8bj87Df4\/Nw3bT5QwwJY6Whu7aFPb\/0mRfXDHZ\nCh+L7XMAtuVilIATm2FYKMBBx7egabEQWlbK0LVVxzYbVXx9+Q187fIG9C+9Dh0rdXxkNh8fnpqP\nD0zmISTWXNoMHI7LWnctj7aaFLaG9TTmoDSFA26D7+kdiu2EY235GsOtOQQUTGiGcqTneELTnO60\nC2r45sprFG9C21YV2+2ehd75ZfjU7kXCL5ADbjNbgiP2\/0JMoo0MVyPBiauTWA0KUv6Ah6k2rp\/Z\npdhGM9yWYznUkoVR6srxZridaYMz13Zg89mF+MJ1FQ56vokvXNZBy1oJ2jZq0LFegv+dXjAJqGE0\nD5tOzsPPlzbJcNUSnLgqgTKYi\/TAc7j6qy78zu1WENiSZTnUnEndWcxwA7R87rFbia02ynTzK2G7\nvRp22Ktjq60Sdtn\/XXrE26xUpwXqmr2A8gJ\/whGsOpHhRJXxVJt5yAy2hrf5dgTY7FUcONicQVdH\nEbtGwpKtKHNK+MpzHQ55v4WdTkuh\/bsSA37muBKfO67FJ7bPz5hB7V+fRxkBudVf9ATHbdS9VINZ\nITZUf58i0G6fYhvNQHO6z2BTmnQyuIQcgs4FFRzy3cCAe12WS4HcEW85t5Ad\/UxATaNFyKWrR1Qp\nw3WWx6CvpRA8PzNcO7sTwee\/VBDYmMobbEyTjq1Kus92OyzDQZ83cMDzFeheVIGew3OsSfY7r1cI\nqGWqDp\/go4QjWEUsw3EPUL0tfCR6HefqD6EX9RUENqTyKKRj6\/eAfeyIP3ZcBF17ZcqmMr64vIYB\n9zqtmRWoYTgfeqdXIZXnyHDCJ7gOAQGbC5DscxI3rPci3OEAEq8cWqwAMK24vyFFOrY2n1XGxw4q\n0L+6HvvcXmLAfS5Ue85r2DUzE\/ADurh3Wa2FqdtWytpE3C36TjXYnA\/eNSNWf5FO3yLB4+jsC0N\/\nfQr6G3jSmfqd8wboOauzGuSOmAMqWoM6Fkth6KopOdLyaMLdZjju2VhI4I7KZMS7H6H6249bLoeQ\n4n1cAWBdMj0Wp0p3uPRsN7pelLHfYzV2OS+dEah1RgVap1UZUMtcjcbhWngGHWFZm4hrL4mEsCIe\nQgLGEZCrv2jXw4oB++qSaBVKkW4iOdleNNIWydXgdEA9uxU4GfgWjHw0YOalg5tRRpIjlcNFsDcL\nnfTwzmUw0fNHVn+x7j8g7Y8TM69c\/U0pGr21CeilLI6vSV11GfgtQA\/73F+SA+64SNm0VWPALdRE\nO8+vwJdOr8AubQNc0jUn1BuHI1hppBTXVhxG2UtAY0EYkr2OsfqL9ziKjOtGlrMcb4JGb008emqT\nJDvcU5uIffheGnWrWRd\/6boenlGHYeyrif1Or+Irx1dhGfMP2Ge\/DbvUd5CQay7BlcrjWovCKELR\nWZWEhtxA8HyO45bzd0i8+hOy\/E1mB\/ZUxxEwedo1qbToGnJy3VCU7z1pMtwqPiAF2iW+j9ICD4Zr\nm4grDEFLYTBE1SloyAtC2rUTiL58GMnex5ETeGpmYE9NvH53VQwDTlyTxnHja5Jk2CdOmgx1Aj8p\n0CrhXZy7vQlFeVfYkXJZG8e18IMogwTMCUCmnxGrP57vCeQGmfvMCOyuirXsroxBd02S5JmhPm3K\nNUmGk58MXDME5n0uBVrceg8W4R\/IcPxgNBOOe+0mqklHTaonsgNMqP5+RNp1I+SFWPJmBXZVRqO7\nOmEybsKaJM3axMlQJmmGDP4Z+QzmuMlwBGsuuImm\/ACIazNQm34VeUG\/Uv0dQ4a\/CfihZ2YGiitj\nHMQVtwgTPwUuUR4nNxlkzVBU6MiAoRlHUEF12sJwQXI47qWluDYd9RneyL15itVfdsApFEacmxko\nKo\/iicujCBLHnhm4Ix3f4USTcLLLdxw3VTNMhWvmhxAwDTVJl+hy\/glJXj8jN9AcJZG\/9c8CjOSJ\nyiIJECVfb1XyzfD02JLhJjcDw+XfZLDGPH805vqhtTiCAet5lxHh8BVuOx+kbjZESZT1zBuNSBDB\n6yyjW14QxlAzNcPEsTUVbrwZmp7CcX\/jcFzQkRJQn5YEA6RfN+znh5\/5aUagUBDRz+GEpaEUYSxj\n47inm+HpyTC5U2VHOjFzomoew4lqeHS1\/IJY10NI9f3FgR9kPPuq1Vn6BFcSAmFxMDqKgiGkB\/LZ\nxhaHm64ZuAxyNcktB+OZ40JYkYAopwO85KsGM752+z8n4oYfjG\/Q5QAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1263353141-1035.swf",
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
	"seed",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("seed_broccoli.js LOADED");

// generated ok 2012-09-14 19:45:51 by martlume
