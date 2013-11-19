//#include include/drink.js, include/takeable.js

var label = "Face Smelter";
var version = "1347677194";
var name_single = "Face Smelter";
var name_plural = "Face Smelters";
var article = "a";
var description = "A powerful brew with a scent acrid enough to perm your nostril hairs.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 141;
var input_for = [];
var parent_classes = ["face_smelter", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "10",	// defined by drink (overridden by face_smelter)
	"drink_energy"	: "30",	// defined by drink (overridden by face_smelter)
	"drink_xp"	: "5"	// defined by drink (overridden by face_smelter)
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

verbs.drink = { // defined by face_smelter
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy, $xp iMG. Grants 'Smelt It, Dealt It'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? 0 : 1;
		}
		if (failed != true){
			pc.buffs_apply("smelt_it_dealt_it");
		}

		return failed ? false : true;
	}
};

function parent_verb_drink_drink(pc, msg, suppress_activity){
	return this.drink_drink(pc, msg, suppress_activity);
};

function parent_verb_drink_drink_effects(pc){
	return this.drink_effects(pc);
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Drinking this will give you the Smelt It, Dealt It buff (smelt metal rocks without using energy)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a> or purchased from a <a href=\"\/items\/1000009\/\" glitch=\"item|npc_streetspirit_mining\">Mining Vendor<\/a> or a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && !(pc.skills_has("cocktailcrafting_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/45\/\" glitch=\"skill|cocktailcrafting_2\">Cocktail Crafting II<\/a>."]);
	return out;
}

var tags = [
	"drink",
	"alcohol"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-13,"y":-35,"w":38,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKM0lEQVR42uWYC1BTZxbHmen6przs\nzm5nZ2qnO53Z6dgyC52q9YFEHkJ4VlTAByIPQQWkFosopFipCIWgUuWlURAUBMM7hCRcAoEAeVxC\nAiThkYQQHgmYyKO+tnv23lDcduuMYde2zuw3859773dzv\/zuOec73\/mumdnr3pqEw7Ys0UgWC8Wl\n+olGDiHoiE9Tj8qewR+y\/B0BFQ5ItwoVjD4j4OpUPjKqbRDXLIEtnSU0S3QBrJ4xN4ZQ5YQD\/6aA\nuHWYgmFFm2w6rPNHwDblAtwCoIHAwiXBNUWgiyYIDFQVSxcq\/JkCxc7fBJIlHF7HFCrEzZKJxJ8C\nsn8GiMMtANYLcI0uiDcchcPiofLrx6JQ2YaI1OWt8hnPRfey\/8N6C4ALcNWduJSE+21KQg132JMm\nUByq75Bv\/NUgmd3q\/XUC9QFEpGzmyA3OP7PeCwGVPwIOGlXGlhpVy5VHNnQN\/ML98GTYFp4pHGZ1\nQge1otHh0WyfA8DwuiXFY7NoJKFd3M\/p7Eaq2D2KAUEvF0U7s2Z70avQL7oGMnEuqBUV41pNw6xm\npA7VTsmyae21Ac8BWVJCCUtiVBVHGtkoUO7QjrXG\/PBYof\/hiQKezMthTMkC9RDdKI2SpXg800cG\nMDFTVNELgtolMmjl1QGrCwVGSxWklLhC2AVrCE5cC0nptlBTGQAs2mFgM8MA5SXDoKwA+B0xIOTH\nD6AoqZWHkrObuaVhsiFJqnKAPm7Q8QGHwzU1zn0Oh58v9s8behCTLdkhEStoCAXo7RxoYGTDqavv\nQfTlteAfZwHEg+9B3HmvBUBGGMj78qGDcwyGByjQg54GiSgOZH1JYJimw+gwwwjy\/UwvPHs0CJhL\nQSmrAaW81tj\/FLOmTsOGCRXDKP14u4NJgG29owiNfV\/PEiqgvuEyxF+yBe9Ic4hO3AA1dV9DY2sV\nsDq5gHAKgdd5AYS8MxjgDVAN3wJJdxx0sjNhepwDsp470N9dBCp59XMIqei2sW9AUmq8xgHPpO2A\nCzlekJzpG2Rq8vbGciNCa2mAe6WhkJi1AcjZ+6CyKhGoVfGY4qC2LhboTd8Bky8FOQbwQMeFAekl\n7MgGeS8VJIJSaGVeAjY9A9qasgHl3jKKx8kDURcFhvoqjIBIUwZs8V4B+05bGOW0fyXJZFfTmu+R\niwvd4WK+LyRl7YWkDD\/Iy\/WHO8WHoLzsCFTXxkFjOx1aOophbqYf9NMdIBKeAqkMsyy\/AHi8CqBV\np0Ll3SSgV6VDYW4s3LwWBUX5MVBWeAqDpUAJJRbcDq8Gt+DV+sgMGziYZAnO+1fFmDyrac230ZsV\nXpBxyx8yinwg4dw2KMpzgJtXt8L17C1wj5phBMQtiHaehhZeDTS0IlDDrIOSuxlwu+QiVFeehVYh\nY4bX34bKhzrR6Qk+kpsbbpl7KYKUkxWB+J+ygE2ey8jRV2xIEenWsDvWHF3SWn2XFg83abuAXOIF\naTk74G6hIxTf2A43bjrCfUYRNosZMK5oxGZ0GVRQ0yE\/yw0uX9gGBTkRUFj4FZXaUB6Dr1b4eDp1\no8Okop780\/8IjLeATz2Xe4fnWltGX1kLxmt3syXkx45mSv59NwzQDa7ccIL7pQS4XuYCuVQ\/aBZ0\nYSlCDqMD1SDoZkNV4x19dWMFBY\/jF1VBKmlZzLDk7vOUcizbat2umDfB3snM+Nvjl2xgf4Il5vI1\niHvIynUmr9UNzcnw3R1XKCl1hvxiJ8gsdgFKDQlk\/Ux4MMaBqREm9IhbFC8bq4+XS+7tyvk3YKZV\n0N4vLJ4\/dxSLQ9zNgV9aAGHvKqrJVkQ6iigslhswGncCnfW5orG1IIYjECDaERbMTLbDrLYDBqVN\nL022o4N0VMC+CIvXx7OsqT5HzWGL7zLbkPNW6yK\/tYGjmTZw6Csr2OKzwvTk3YQqizHNYCXWDJ\/\/\nntEdQmE18s9\/GOB7vcQIqBmsfumAel0PcGgJRsDQVCvvY2Qb8DvxJmzyWIEExJk74JYLTraC0BQr\n2Oy1gmwSXG2XYiciGjvRKtbca5CobRb7+YJ65OmjcXj6aAym1ExQSctfCoi\/UFPViQXAC1aKI2nW\nxvyHp5pNnn9w8IowJ+HW2x37JuwIXEkxCbC+YyiZK5tyQlDVzzJ9iwAlj8pr4KGuG0bl96FXVPPS\nJItyLuubKk\/ocesdzbDWh1+0NsYcDrnJYzl1q+9yb6+INcZJ4hFmQj6Ua2conYO6iGaxOvpF97mC\nNpK4uxKkaJG+T5htcmqISLci4SkFizuI\/NYacFfjgPg93N0bicuCTCpih6bnkKa+sYNI94j\/q6o7\nA0+uXBeUaIkc\/toK9iVYwLEsGwgiWYJT4BKWucX0whAqD3Ok2hBENPJK9x\/OB1brA36cEMHnrIAY\nugafKDFLHqj\/wdyHjcKRRDaqfv9VAuITYttnK\/F1F3yjzPWbfVYoPvFYtvR9jXhsOqZJqAlhooog\ns1fcPvVYTsJB8XjDljrKfzWIbFIfJFbqQwSyMcTsdWw4IH94OrFnWKt\/TT+NKLzF44Y0lkjl9VoC\ntsvGyDLtzDfsnnH31xKwc2iCLFDqUrgDk0fFk3rb1w6QhSpIqGKS1zWg3dMu0\/x+E0WkM0QKtQ+j\nz12vsF0s97vHdOTe0Sk9FeFDUV1LWpt0VPNtQSm1pJ4bhFfai1Xyb9I+2L5zi\/0OD5\/1Wx2JZSy+\nb\/vARDxP\/cAd1eh9mIJBqkg1HaPRzyf3TkzzSmgcTRMqL1bPPfmoT\/v4\/ToM9ASJ\/G5ATMKfsKHe\nWBzzQKIFOQQrm07m\/ZFy5vbb\/\/vLZLK6\/1KFapyrB7R2XZOznw3NzBb2z8zFDz6cjVbMfR8\/9fjp\n8aHZuSbl3Hz6+Pxjosbw1E44pPu4sLrFISWv1DWvmnY+Jf\/WVafAkANlAG9gqwSK13rhqdYQe+0t\nbPP\/Fno8ay0SlmqNHDhriez+0sz0D6P+8RfedQmOisyj89zqpLqP2zQGF\/6kwUU8PeciN8y5KB\/O\nE0fm531Us\/NJ2sfPiNr5p3YJqZl7gqPjw539Dp6LSPgqP7Xg5lmuSl3TPalPZon7XQJPeu3bEbCK\n6o1VzJ5H1gB+9AhfA+4hqymEQBP3G+JJw197H8x8I5rS7yIejk7MqaJ\/Xd4lc2INGOy4SoPdDcw6\nWYXlrteKy10ZHfwtOBgu3HpMYf8m0pXrXsT9oeH2Th7v4OOtd3SPxs7jN7l4xBMCHTO\/yPtzNV6A\n4jUeIWAVGbPm0j4nn825FZVVVhkfdYYU7b7vcNoG4p7rG7x2p53OupqReCUn\/bPQ6CifQ8c+d90b\nlEwMCE4KivoiMq+81gl3rUg7b8fXzNs1iOS7zufdyvnY2Svlo62udliFEoSVTwju2tBvrMHnmDkQ\nAlehjgErHZYcd+u3ubl8tN3F7+\/b3fzsHIn2H2x2eudte\/vVH253+Rsu++0ev9BGZ59Dmz33pGz2\n9CNv8\/VPJQZFnPyEuOv4egfXA\/jzZv9P7V\/+CR\/TY60vegAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/face_smelter-1339721928.swf",
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
	"drink",
	"alcohol"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("face_smelter.js LOADED");

// generated ok 2012-09-14 19:46:34 by martlume
