//#include include/takeable.js

var label = "Tiite";
var version = "1348008669";
var name_single = "Tiite";
var name_plural = "Tiite";
var article = "a";
var description = "A compound made out of red and blue.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 1.1;
var input_for = [170,171,235,288];
var parent_classes = ["tiite", "compound_base", "takeable"];
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
		'position': {"x":-4,"y":-21,"w":8,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADs0lEQVR42u3XyU8TURwH8IdKEBcK\nBhcEW6hbaguttJTpQnoyxpN\/gWk84JYomyIuUDdQ3KqiILKMG0YU40VNjIlN1LicKhANSnAoZbWF\nURBZxPx8b9piXU5qOu\/gL3lp0rl88p33fu83CP2jirsKskV146z0+hdWfgMkiJaKqQRJ7Lkh27zz\nQ3xczWeIvzQKi+q+8NKbX23iQo8MSKKKPbboI15+zokBiD39AeaVD8H8C8MQVzsC8ZfHMHSckzZM\nWENuC89zWacXuLkZhd0wa38vRBW\/h+hSL8w5yUPsmY8CdAGGLmRHIOHKGEivjTsTboAldMKNrTAt\nm4OIHR0QuasTZhb1wKwDfRBV4oHoo\/0+aBmGVmBo1TDEnB2EsMP9jtABN7QC2sZBWK4LpuW0Q0S+\nGyJ3dwnQ2RgqOeyBmGP9EI1X+L4+QPs9gLdE6IEovwvQ3l6Yst0N4Rg7CbX1QAT+RQV4FWFgcT+g\n4x9FAtre43R4QIe8MBWnSV59GHmG0WhPD6ADHt9z+yeRgac+ATo3AmhLG6BsF6CdwekNAiobpgBY\nOQZo60\/plX7w40cpAeYEpzfgT+8zeUYJcDI97\/f0KkYB1UyEEJj5NgsD+d8CC\/z\/leD0Tkymx6HL\noWzUQoptErSji\/0FuKf3p\/TGbKhSzDu50GPBTZibBAbSI+iDXiuiovK6ZcKJLR\/x3RqFvTzK7VQj\nqiqvgxX2X34nhThcCZmPLHGbnsDczc+siMZav2qzxbp6K6xbk2OplMsltcmJFmpw1YokWZVSbq9W\nLYZqlZwnvyxetzRL7aLC7mgU9mBQg3oZ3E9VwNM0Fbxk1NDIpNhEBXZkGPh7qUoB90Sn5AiqyaBx\nthi1ArBZrxT3sHSa9WqCfKBVCa+2akXiWrc5PavNlAYv09U8FfsvgHyu1wB51c0GLedLMIWl5pB0\nG42yDrPBSZDvTOnQxGjI\/qOr3QxotRKCbDenC\/uvTSuXINqKIN8adU4CRLQWaS3\/gX9T5PQS4Guj\nQkYdjqBID2zEQIx0UAdsNzGsO8MAb4w6Om6SHxq2ibESXCOjBZeZ8adISbMOvk0uJi8RmnUgRdH7\noa9BM9wrg0646vDY5Ww16dlAiuJPNGbGQRIjyZGBgQyr5OoL2oucmOOWneDq1cuDRy4HnmRutxhS\nucDYJcq9HEiJzIPVQcPqYzysvtAnC7CgJU7LeahN4Xxj\/u9XPUYT+D0Mv7tSxMZdo0xSk48kvAez\nalRyG8Y5\/CtwcP742+Qb9P7sk7VMvWIAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/tiite-1334267381.swf",
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

log.info("tiite.js LOADED");

// generated ok 2012-09-18 15:51:09 by martlume
