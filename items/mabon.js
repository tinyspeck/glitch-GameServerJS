//#include include/takeable.js

var label = "Mabon";
var version = "1338860417";
var name_single = "Mabon";
var name_plural = "Mabon";
var article = "a";
var description = "A compound made out of green, blue and shiny.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 15.4;
var input_for = [167];
var parent_classes = ["mabon", "compound_base", "takeable"];
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

// global block from compound_base
this.is_compound = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_alchemistry_kit", 1))) out.push([2, "Compounds are much easier to manage if you have an <a href=\"\/items\/497\/\" glitch=\"item|bag_alchemistry_kit\">Alchemistry Kit<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	if (pc && !pc.skills_has("alchemy_1")) out.push([2, "You need to learn <a href=\"\/skills\/51\/\" glitch=\"skill|alchemy_1\">Alchemy I<\/a> to use a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	return out;
}

var tags = [
	"alchemy",
	"compound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-22,"w":23,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKP0lEQVR42sVYeXRU5RX\/NC5Y0Mwk\nM5lJMslErFA9YETcq0baKnKKTVF6bP+o055WrRtjLYrYQx8iS4CEAQNKJHFklcUwlSUmQniypMlk\ne9kmZDKZeZnJxiSZeZOFTe25vfcbEhMkyKEY3znfeZn3vvfd3\/39fvd+L4+xH+P4i8fInncJOGxs\nXjDyyi38nCuFveBJHvl+o\/lc4PC40Ny\/ulLZi03AXvMCe8kNP1nQpqje60++NADPuyM5CFqcgg09\n3mgxs9d9wMzNwAO8jCwMPeb4UtkcvDcwXvFAxCtu8Tsx5rVamNAJbJkC7FUPjHvnBMRk9dkuAVyj\nzP7WxLNir8r8PGZ+q4nfowxX9QFb2QNsYRcCdMMNC9ot3wZFmQS\/zAMPjJfdcP2bLXDj4u7UYXGW\nBCT2bjew+e1wFSZx05JO0OecFsIYUPLnGkU+iKTBY25bKpvXxh9i\/+wAZAuuea0Zxi3sCNO\/qs\/M\nFgeAz3mhCcbMa4HI9KCCgAW2ImRlGb0yW90Pg2NhJ1xjlmGs0AHqjKA8DGBabypbGgS2qJsncq3g\nh+ssPQp7u8PK3mwFPl73QgSyO2Zx8JxKSwM2loaUrwgBS+\/l\/qDsI5d1gToTgxOQD87I\/D4mcNPS\nLtBknURwfSl8LAuKnFlKkGxA7L\/Vyp\/XrOuFiFUIiqxDRKwIKSy9R2Tvn7GxtacsmHwKWx6ysJUU\nuyc8UEF6XrUyYMWMUB4CtywYZu+tNriam7cdojKCoMs+FfbiJkhhOV8LzNIvXZ+O84cea08buQXI\nV8gerUHsRa8OgS4HQZD8A\/4lC73kFoY9T0kuCstOcyLmeODGd\/2gXdd7zsOUwZJA2DtvI8i5LTB2\n4QnQZPZARAbSTwsMPf7lB\/SIZbBNpKENMk8qbN1p4EBRwusWdYJufZ\/MMvAeqbI8xK9jccEN81sU\nddp57WU1Fgp5fFEXRMxv4+ToN309JO57JyW+OC2EJo5Y6Mfq6pdYGkRyiZeHRLaix8xlwiDsHy08\nGPn02vSQzJb3mthmENgGZHkdmj6jT+ABSF4MypP\/uxeue8MHkWndyE6P+Y7detMTkkG4\/8BdQsSC\nI1aW\/ZWIflbY4m6IzAie1wG2gJFP+OCMiGCtFOCaVUOYI6DENFUgFQwuctVLTeEq\/Oi06aId4r2T\nMmfvrXYuXdSakHz9gtXi1H16eMqVCE\/WGb+1zFxUZq5LYvPcl9nA0xQr9xlVGzJCAeM3n714o90I\nZrYeE0cJb1wZVNQ7Mdk0deQtG7XKfV\/Ewr35+sFKH7dkjjD23Tmmy99NsnBx8ksG+iotpFy9NGC5\n3KXGpqmSYzKjBI0lSrjzM5S7It46oypBfqQoTpharv4\/t0Cq6it0\/GxHjPCQGAe\/qU+APwduht\/J\nRvhlSbz4o7wnTCuKS53pMAgzqg2DW+mtW7QiST29wgCzGhNhZl0CPHIkDkYd3NT9epTQAM92JnGW\nCCxdT8jSiJNzdXD\/gVh45GgcEJtT9uikUQUXm60yos9IOvhtA7JUmwB35+lldXq0qE5Xi8YNWpi4\nLQYm7dLB7Tt0kLQx2nTFQTx0ONb8WLlBfNJhEGc5E8TUeoM4vTLMkipDlXzr5hhAFuHnh+LggYOx\nMDk3ZvAtZtwKVYp2dbSoX6sRdZlR5isO7p58nfnRonjOzDPNRnjWnwTPeI3Y4xLgQTFOiMrg1Sol\nfaSFCVti4JZNMXL8elXyqMg3fqc68u68WGUaAURAv\/cZ4U\/dN8MfWhCgI2x4ZMc60FrUK6MkdZo6\nctT8NXGr1nwX7goPH46DJyoN3GOz3Ykwy5kIuJVxgFP36wZlU6X\/ABJelMGNGmHybh1Qq3j0WDw8\nXm6AGQiMziQ7VecdNv3gG4xqpSp1VAEaPowyT9gaA8n\/1uO2FcuL4OEv4\/j53oJYuBOvE8sc3CpV\nyqjKy4OuVRkTN4TNT22CgE7Zo+fAJn2qAwKvf1+TQlX+QGGsbWatQZhmj08eVZCa1VGW+PUauBmr\n9KebYoBaCp3pty4zWknK0cKv7PG8Qf8RKxyLSZ56YLSZTFeZYtZEA\/YyiF2n4WftmmhTfI4qmZr0\nL4rj4Sncyqj9\/LomgXrhsP\/mphTGGqeXG8y0FU4rifthfDpmsco4bqkqhQb9TddI3tu2h7cy2kke\nKwtXNsovU8GQL+PWR6fStaebEnmLwgTkUWOWiiJxg0a5DbewKXv1fDe5A6t+vFVrIXCq9GhTUrZW\nfrAwjjNLLFMSU\/bHGkdPfmzQKLtkzNZyXxqyNMP+cTJkRdvoheGBg+EOcA92gwnbY76\/kD4rcwq7\n7Q1ikdMnyt29F\/RFrt2ZbDs3r8rnt3mUi3\/KwG3POvQ3Vrbl8bJ4mSqeioteGm75WPP974O7S+tT\nPpeaIK\/SBQ3t3dAW6gNvQPnOLrCnzCnvq2iEwloPyN0hGkqTXxnxbWR85sTBNZKyo020A9H2iM1d\nUeFLA8l+SbLsKKq15Uku+NLRDK1KL3z1zX+hytMGWfklMg7bh\/kl5qwCu2lvuRMoEXtTG\/SdOcvn\nuU8ERjT50xtfND237R0OQrsmyky70EMo630F+kt\/i16fb0\/e+qUkFSDAau8Jzkxn30kQq13DvEMA\nCdzhei84WrugORCCM19\/A3and8Rgi\/ZuT95yuELabXeaVhXsMz2WM1ualHO7NHvrCyO3Fppc7m4T\nXZ2KVZLbzdmFlUYaWxDk4ToPBu+EsqZW+PCL0mH07yqqSd1TehyOHfeCyx\/kiZAVdhbVjPjFatux\nap6UWNcMjvYOha7tLHdHLsn7REY1bGgPm8N37qMT3bCVHpfIQ3UIwhfsgY6efgj0n5IJIM0hUHzk\nl1g35Jekns\/ghgK7vOtYjWJvbIHWYC\/aoF3m8n9ebNl+tDa5zN0mUIHVtwd50p8cqZYPoV8bTwQ4\n2939p9EmjQoOOOb04e9TfDh8J6xsf6VL2V\/h4h7ydCr8AfIQjfPZomMrLl7uaQc3zvV2h+Tcohox\n60B5JA2aT+fB6i52CNgFoMbnh+DJ0+DtUhQCvbGwQqjENbyBHugM9SnkaSrEAR\/7e\/t5\/GpPu8g+\nK23gNw7WeKC2JczggNGpEJAdYWBgMIkKgjzZf\/arbxcZqUWVNogUuMzdzoP6uhQYSMDVoaTUef2m\nAXVsJfUouQxVzWG\/0\/yCSqfIPi12SATwKHpooBhoEMUk6TkJBQK7DyWggHb0IhUDsVLf4h+xWm32\n40JBVRNUyB18Tbur5YKq0LXdxQ44WN0ExSix1NwBTmxrucW1Att8qELch6wUN7ZCLUpR39bFgbrR\n8FtFaVjFomRSPgYsRq9RQPJQFS42VNZhXzxEyZRX0Sh\/jv72oZwHqlzWkeZuOlSZklvisNmK68DR\n0ilj9xB4DeQcKBOwUpXc\/9TB9iPVIKE3CP2FFvu4sNy2t6wBqPUcccjQ0NaNzDePGHQoQ9S2Lv9z\nC5kcpcS+Z91xtMo2UL0XCrTjaLWw7UiVbU9pvZhX7jT90Hv4\/wD4ZXKHkmPXAAAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/mabon-1334267501.swf",
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
	"alchemy",
	"compound"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mabon.js LOADED");

// generated ok 2012-06-04 18:40:17 by kristi
