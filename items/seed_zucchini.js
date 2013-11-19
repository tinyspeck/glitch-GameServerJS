//#include include/takeable.js

var label = "Zucchini Seed";
var version = "1347677151";
var name_single = "Zucchini Seed";
var name_plural = "Zucchini Seeds";
var article = "a";
var description = "A packet of zucchini seeds. This can be planted to grow <a href=\"\/items\/249\/\" glitch=\"item|zucchini\">Zucchinis<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 34;
var input_for = [];
var parent_classes = ["seed_zucchini", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "zucchini",	// defined by seed_base (overridden by seed_zucchini)
	"produces_count"	: "23",	// defined by seed_base (overridden by seed_zucchini)
	"time_grow1"	: "4",	// defined by seed_base (overridden by seed_zucchini)
	"time_grow2"	: "4"	// defined by seed_base (overridden by seed_zucchini)
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
	out.push([2, "This can be planted to grow <a href=\"\/items\/249\/\" glitch=\"item|zucchini\">Zucchinis<\/a> in a Crop Garden."]);

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
		'position': {"x":-11,"y":-26,"w":22,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKMklEQVR42r3YiU+b9xkH8P4FS7t1\na9Y2JE03ddo9VVWrtFuUbuvabmm7Kq2qtB1NMtomaUpzn42T5m6SQsKRgwRCISHc9w1+wRwG29jY\n+MTGB\/jE2OYmCUm+e97XscExh5G2IT1CgJA+73P8np\/fRx6Z5QvjTkyPe6M23B3uw+SgGbe9Pbg1\n0I2Jfg3GXEqMOuQYtkkx1CfBoKUdXlMrPD1NcOsb0K+rh0tTA4eqCvaucljlJeiTFaK3Iw9mcTZM\n7Tcgq0qKfWShX\/9PoLgygbcwnLdn0X0C3edwLi7ujTlwd8SGyaE+3OGQRkIaMD6gwxhBR51KjDgU\nBO0kqBSDvWJ4ze3wcNhmwgrQ390Ap7YeTnUtB7Z1VcCqKIWq6frCgJM+\/cpJjw73x+yEdFP0E5BF\nOnF3lKCjdkyO2HFn2Io7HLiXwoLbLNxnxi2vicKICY8BEwN6jLvZ6MaYm30YLWWdMs\/+3K\/DKP1t\nzN2zMODdAU305IAa90b6cJ8wbHnvjVipxL24O2ShLJoJZMIdn5Er922vAbc8esqoDhNuLVf68X41\nQVQYc7It0EWhwIi9EyM2GYatUooOriVGnGoISy+kLSyDHg3vjlsVhptkcYMP4TwsrjuIGw\/DKbge\nDcH1+XGDvSICqpAdv5FZEDBNs4KXql6By8Y\/BeNizyu4YFiBJP1LSOx+EQm6F3BO+zziNX9AnOb3\nOKv+Lc6ofo3Tyl\/iVNcvcFLxHE7If45jnc\/iaOdyHJEtw2FpFA51PA2e5El8Lf4pDoiewE3dBlw4\nu3phwHrbeh4F6rybuKj1bkS15zNUDcSgwr0BZf3rUer6BMXOf6HQ8SHy7WuRa\/sAOdb3cbNvDW70\nvovrlneQYX4L6aZ\/4JrpTaQaX8eVnteQYvgLLulfxQXdKiRpV6LCuh\/JmX+T7Zc+ujRiYO\/QFcYw\nfhZGJHPRcz8J+nsJ0N09B81kHFR3zqLr9mnIb52CbOI4JONHIRr7Bm2jh9A6chDNwwcgGNqHhsE9\n4Pt20kNuR41nKz1gLD3gFnrAzfRwG+nhPoPQm4z446uwoAwaRk8zhon\/PbDIsYkDntm0YmHAcaeU\nueVS\/FeHgT3AfeY2CiF3kHuNLXCbm+F0teK7La8sEGiX+iZYYBCn5zZHCM71EM4eihuaCWeawrGH\nt9cohEVRg\/jYlUjc\/urSBQAluNWvnHa+0VoL4tSEU3ErbszZNYWjDTIcxEkwRJtkdlwTBgwC2jJC\n6MXFOL91FS7vfWNlxMAxmwQTrq4pnPshnHMKNxLETR2+HM4yhQvCjM1B3IC+kVahCAZxCZJ2\/Dly\nILySRWM2Md0PFA9wU5thPGwzyMM2QwDnmwfnpr3spb9rW7JxYddrSN2\/+u2IgBMO0cpRazthuoL9\n5raWoEX2GzSLfgKRajmE2p+hTflG2DD4ceHDwPZbAMfecNzdDF0c+FyJ20vP49Ke15F28J3I9vFE\nHwH72iiDXcFhEBLK4HoHcturkJiWoF6zFPWqZfD2NkU0DB42a4bGKZyOz13DvBYJRGUs8A2kH3o3\nMuAIAUd6hRijErIldVkzITU8D6F1J3I1H0HYswSlXUtxjB8FVffhiIYhDEdXLpe2jutBcXkCLu97\nExlH1kQKFPKGLS0ElHP91qKKR4flQxTr9+BM+0vIlkchR7YUe6qjUNrx94iGYQpXT7g6wtVyl1iP\nSYS6a7tx9cBqXD\/2fmFkQEsLb5gO0MAwtCjjkKVYh0zVehxqfhbxwmVIbvMDT9Y9H9EwuLv9JWWz\n5tLUwkk4p7oavl4Z6r\/fS\/33NrJOfBDZhWGIgEPmpuBmUGgzkN65DknS1zng1w3P4CDfD9xZvgSm\n7uIZh8GP8w9DCE7tx7E3al9vB5iMfdR\/\/8TNkx9GBhw0C9KGTI3BzWA1V+OyaC1X3gBwX\/2yIJCR\nHpt3GPw4P8ypriJcJezKChqSDlSnxCLjmzXI+fYjWWRAYwMzZGwM2QznWt7Ed6IXcbx1eRjwXP1f\nOdxcwxDAsVkL4ByqanjMEpQnxbD9h\/zvoiPbx4M9DQxFyGbIFX3JZTBdEYXDjctCgNtKnoJBnf\/Q\nMPBDhiGIU\/px7Kc7P1CMqgufs\/2Hovj1EQINDTIfC5y2GVq74nCm7WXK4jLwGqaAvJqncbDqKSTX\nvTXnMPhxBFOWE64MNvokZ1dWwd0jRM3lzcg+tRYl5\/8dGdBn4MPX0xiytpzGepxseiGsBw\/XPo2E\npqcQW\/AkBOJvZx0Gx4OsBXDsZ2OHqgZmaQmqL25E7umPUZb4KfhXt\/1uXqBXTyc8ZfDhw7eicwd4\ngvAeZEvMAnfkL0exYDvaROdChiGAs03DWTuL4FDXccAqAuafjUZF8kbwU7fOf2HwdtfSNPJn3AyJ\nbatmBW7JXYxNWU\/gs8wfY0tGFI7kvIxDWSsQl7caaSXrUFi1nXDFHI59s+CgD+9mWQlqU75AIfVf\n1aXNEHy\/c26gT1+z0qOjE56yGMRNO3w1mkwcafwVjjdG4Sh\/yazAmGuPY\/2VHyL60mP4KGkR1p7\/\nAT5JXIyCqh3+1x7SAjhowrWCdNSnxqKY+q8mZQuaM3dFzwsc0FVjoLtu1s1g1VYgTvDHOTMYAH6R\n\/iPsznocMZcexYbkJYjPe59w+dx7GaeOga4xFQ3XtqKU+q\/u6ldoydrDmx+orYSbsjjzZmjgNkOf\nphQpgrfnBW5IeQwxKY9yGfz04jO4WPAxh7N05MKp5UPXdI3KugPlyZ+Dn7YNwuwDcwMHNBXRbk0F\n3NrqCDZDLRSyFKQy73HA2LzF2F+0eMYSb776HBILPoCuLR0WSS7MkhwCMtAwl9my0qBsRkP6DrTn\nHpwb6NZU8txqAurqZsbNshmM8jw0tB5BVl0MbtRuQGbVemRUrEN62TrkVH4BcXOCP3MEY1+5mcU3\n4dI3QVV9DsKsvXQWboEgczdEeYeYeYDlvH51GUFqZsHNvhlsCjpG2CNk2qSyw8D2nOUhnEmUBVc3\nDV1dAtpz9lP\/xaL5xl5ICg7PDXSpy+JcqlL0a6pDNkP\/jJuhMmQzBHB903EP+i2IE\/lxfqAAWgK2\n3dxH\/bcVwpv7IS06OjfQqSxhXMoSuOiQneuaNNNmsHYGcAXBSQ3Dtd+Asf069WAuARuhrjwFJu0r\nOmq2Uia\/RmfJCdM8wCLG2UWnPJvFMNxcm6GYy1oI7sEwcK95p+GMbZlcdlmgruYMiuOjUZ4Yg6aM\nXZCXnph7HzsVRYxDQae8ooDKWTvjHW4KF9pvYbhp\/cbh2vw49vfsBLNAce4BAn7CbZOmzF0+WfGR\nuV+m2+WFPoe8AHaaSjt990\/p\/MMQwM00DEEcZc9K\/xvAsdctfuqXqKTrVsO1bXGSnN2L5t3D9s48\nxhYIaQ4FfZeXMDZlGUMwhsrJUDkpipheNqQFjKUjn7FI8hgqJ0U2Q73G\/l5qkRYqLR0FSousWGlT\nVisJpezvaQ1Gn7zUWJawgam\/snnOdzL\/AQJanxwNONN5AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1263353303-8227.swf",
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

log.info("seed_zucchini.js LOADED");

// generated ok 2012-09-14 19:45:51 by martlume
