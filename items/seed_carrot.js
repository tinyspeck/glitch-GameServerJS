//#include include/takeable.js

var label = "Carrot Seed";
var version = "1347677151";
var name_single = "Carrot Seed";
var name_plural = "Carrot Seeds";
var article = "a";
var description = "A packet of carrot seeds. This can be planted to grow <a href=\"\/items\/132\/\" glitch=\"item|carrot\">Carrot<\/a> in a Crop Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 28;
var input_for = [];
var parent_classes = ["seed_carrot", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "carrot",	// defined by seed_base (overridden by seed_carrot)
	"produces_count"	: "14",	// defined by seed_base (overridden by seed_carrot)
	"time_grow1"	: "3.5",	// defined by seed_base (overridden by seed_carrot)
	"time_grow2"	: "3.5"	// defined by seed_base (overridden by seed_carrot)
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
		'position': {"x":-11,"y":-27,"w":23,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKqElEQVR42r3YeXCU9RkH8NeZ\/uFU\nKNraKtai1EFrx3ZkrNOWaWWkU8eLoq1aRWkUkIJRYpAzHCEcIqOQAIFAyAUhQkLOzX2+uY\/N5tjs\nZq8ke2Sz9242Jznh2+d9k2x2szk2Mx135plk96\/P\/n7PtS\/DzPPCHTPc4+6AAeN9eoz1aDHS3YFh\nuwpDVjkGLVIMmMToMzSiVy9Cj64O3ZpqODoqYGsrhVVZDIu8AKbWPBgl2egSC6BvSkNnQzK09YnQ\n1H2PGkFoLLPY1w8JrEo\/wy4O192x7B6B7vE4Cx93B00Y7zdgrFePUR6pJmQ77tiVGCTogFmKflML\nQZsJ2oieznp0a+vg4LGVhC2HVVUKs6IYZlkhDzZIctDVkgVhTsTigGPOtrVjDiXuDRoJaaOwEpBD\nmjE+QNABI8b6KfoMGOXBnRQ6jHBwpxbD3RoKNYYc7Riyt+GOjQsVBm3cl1HQqdPJc++t9J6+pEqU\nszjguF3uN2aX4W6\/HvcIw13v3f4uuuJOjPfq6BS1BNJg1Knmr3ukux3DjraJa7cp+Ku\/Y5XRwbdi\n0MylgISiBf1GMfoNTejraqRo4FOi3yxDedr5psWdoEMePGpr9cKNcbieGTgHh1MRTsnj7kziBl24\nFj5H+43N0zj9BK6X0qDf3IrEMH8sChgrXxMcI1uDSPVLrrjc8RdEtK\/BxbY\/IVz1R1xQvohzihcQ\nJl+NUPnzOCP7Pb5rfQ7fSn+L05Lf4JuWZ3BKvAonm5\/CieZf43jTkwhpXIGjDY8jWPQYDtcvxyHh\nI4iTvYuos+8tDtiQtiJYlLYCoswnJkLwBIQZK1CX\/ivUpj6OmpRfojr5MVQmLUdF4qMov\/Uoym4+\ngtLvfwH2xs9RHP8wiq7\/DIVxP0VB7EPIj3kIedEPIufqMmRH\/gRZV5ZCELEEGZceQEXqK4iMeBUH\nhA+v9Rk4EvciO\/bNfcBk3DvF4O7XDMZPMBg7xmA0hMFIMIPhwwyGDlFHCmIwuJ\/BwD4G\/XsY9H3F\noHcXg54vGTh3UlP4goHDn4F9BwPbdgbWbQzMWxmYttBnp17CtcC\/Itx\/zRM+A0e\/uY8d\/4GAjjOv\n4uLe13A+8GXfT3DY3MgOW1r+r8XQoxPCqa2lqOEbebe6iu+PXBVH734ZlwL\/7jvwjrHROcQB3XH2\nGTjLDJzRE9c7ievpFPLThcdpPHGO9nKYVFUIC1iLS3sWBRRh2Crl+9vIVH\/zwkkJJ5nG0QTpc8dx\np7YAzqGuhL61lLteXDnwqp\/PwEGDCEMWiVvzVdIoa0Wa9CCSjf7INuybBTfdfKeu1APHwQjEzWg7\n4extZbB3VKFTUoSLu\/+Gq0GvB\/s4h0XLBg31tB+0uHDcZMiSHsfHHQw26xj4qRjEtH3IT4aI2g\/h\nn\/s03viewdaUVWhTZEzk2yTOdWozcDaay3Z6r6xJRsTeVxB96E3fgEMm4dqBrjq6RonH2MqSHMMm\nOYNNMgYbmxj8u4ZBfPN\/8VYmg\/UpDA\/8ImP17MUwC86qKqHPqyEujsOV\/a8h9shbPgL1BNTX0glK\nPIqhzyDGxsKl+EDI4N0KBv8qYhBU8QIP3JD6I2zOWImixrNz5pu9vYxfv2wqlsdxa5hdXYOmwige\nGHf0n2k+AfsJ2N9Zg0HKr5nFwEpDsbFgKd7OY\/CPdIJlEDb7fgiaQ6Buy\/INpyQcrVwWRRGfg\/XZ\nFxAZ9Drij7\/D+gisCe7TVRFQ7MLJtEk4o34ZxxR\/gH\/DcmzIYvBaAl1rEoOIuo+8KtXjSmfFFfJL\nrEMjRHniCUQdWo8bJ971EairCu7TVvL9jcMZdeXYIvkx\/Noo\/6SUf40M3qf8eyuXwSuxDBLqvoSu\nOh69t7egJ3EzulN3wtGUNJ1vPG7iSq10ahzOTDizLJ++SB0qb3+NmCMbcPPU+74BewnYq62Y3OHE\nEKqi+MKYAu4VP40b0k8R2vAGQiIZKI4uxdDBiVHHjTluxHXvWQI7G+YqBn7t53DyaRy3UTs0tWDj\ng3Dt6NtIPP2hbxtNj7Y8tldT5hpbrZpbeL+eQWD7ckSrPnA1X2XEG+gLuR8j55\/FcPhqDB5Z4gI6\nAyZmr7X4rCdOxuHyCJcLkzQH3boGFMXtQfyxd3D7200+AtWlbK+6jMf1zTG2NDe3QkOYscjVGI1d\nh5HodRg8+ag3MOABWCRZfL5xpzaFMxKO+wHl0IlQGB2IhJPvIeWsn4\/AjlKWYhLnNhncxlbT4SfR\nfeJBjF9fxwOHw571uOIpILe5WBJ2uK7UHWdoIaC2HnkR27n8Q1rYZhRe2bZsYWB7aZNTXTrn2OKq\ntIlWqN7w37mAQ8H3zwk0HnxmAiedwmURLpPe58HWUYOCSH\/Kv43IOL+V\/v9i4YXB2V4CJ12xx5rE\n46b7Gw+8tJoHjlx+0atI3IHNHy+Bsfoa4bJdOO63sZHABlkx8i\/v4PMvM3wbSmICfQC2FdPP4lLP\nTWTGDic7\/fw0kIqkh3DmQG+gejOD2vcY6NKPe+C6mjNgbM1HZ3MW8giYcsYP2Ze2+wbsbiui7l8y\n75qkE+yH6dtVcF5dB03ISugCvU\/QTNuzaCMDIQG1CbsmcRmES+efLJjox7u2SYDCq58jLfQTgvqj\n7NpXfgucXsFah4o6PJ2iN256MpjoNGr3PQ79xXVwnl7pdcV2SoHmTQxaKIy02lvOr\/fA6ZtSYaSW\n016biOKYAGSc28LlHyoS9gYvDFTmw64qmnsTmRxbbVkh6L38Z4yc9QZqueLYPlnFn1KcWw\/9JK6z\nMZUiBSYaeaqKayiNC+Tzryj6S1Td3L8w0K6g6lIWzLkm2dwmg4M9jZGwVfMWCQ+8sIE\/NQ7GPTTS\nNdyGWVECZUUcyq\/vnsi\/2F2oSQyaH2hX5vjZ5DmwKfIn8m0SN3NNcp8M3bn7vIBGrkl\/Ng20hr\/t\ngdOJkmCSl0BRFo3KG3uRe\/kzlF7bjdqkw\/M\/hrPJc4NtMgIqi2Zfk1w4z8lgqbgAx+EHofmcQSuB\nOnd4nqD53JsTONFtaAnHPXYzK8sgKwxHzc0DyKf8K4\/fC2HyUXZBoFWWRVtHwZw7nMVt2LtPhq6q\naKiOPUfjzfuKzYm7+VPjYNr6W9AIb8KiqoC86Dzqkg6iMCoAlQkHIEoJmR9okWWFWlozYZXnu+Gm\n1yQPnNR9bGXCwPU3qlSz4ACcx56C88hKOA6uhP3wszCnBHnguIeWFlU5FEUXUHsriCo5ENW3DqIx\n\/cT8QLNUwFqkAljo6mzzrEncJjJzMnA4V6XWXoclaSfsMR\/BGvUR9AWh0AqncVq6aouqDPL8M9Sc\nA\/gKpvxDs+CkcwFgOmuWpBMic5Y1yQ0nyfaaDBO4VK9i4B\/zcjiCqesSoK69wbcaDqgs+A7pof9B\n1oWtlIN7IM48Nf9GY25JZ00t1OVbUmcthimcwQM33XxdOLdimDq1KRxfIAqWBwop\/9JD\/fiFgYBO\nUVpIwLxAozjNaRJTlxenwNiSPseaxOEEXpNhGpfklW\/q2gQeyD2PnsKZaBaXRO9E7qVt1Kx3hYqS\n9i28ahmbk1nDVDQmUdBfsYA1SLNZgrF0YixdJ0U6H3RVrK4hhSKZ1Yq4SGQp17jPG3WNaVJdQ6pU\n15QhNUjzpYSSWjuqXaFvzlQLzn3CFkf5z\/nY7X9ZFkLCstq8VwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1263353168-2181.swf",
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

log.info("seed_carrot.js LOADED");

// generated ok 2012-09-14 19:45:51 by martlume
