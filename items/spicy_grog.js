//#include include/drink.js, include/takeable.js

var label = "Spicy Grog";
var version = "1347677188";
var name_single = "Spicy Grog";
var name_plural = "Spicy Grogs";
var article = "a";
var description = "A tall glass of exceedingly spicy grog.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 51;
var input_for = [];
var parent_classes = ["spicy_grog", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "30",	// defined by drink (overridden by spicy_grog)
	"drink_energy"	: "5",	// defined by drink (overridden by spicy_grog)
	"drink_xp"	: "3"	// defined by drink (overridden by spicy_grog)
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

verbs.drink = { // defined by drink
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.drink_get_tooltip(pc, verb, effects);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead){
			return {state: 'disabled', reason: "You are dead :("};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return this.drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.drink_drink(pc, msg, suppress_activity);
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a> or purchased from <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
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
		'position': {"x":-8,"y":-33,"w":14,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAILElEQVR42r3Y+09TWQIHcP8Df\/C1\njq\/5YZzMYHTi7K5AaSm0BUGE0gptaXkVijAjQgsC5VlEHXwBAs7EzbKLj9GdKG\/o47a0pU\/7pAUB\ngdZoRnd33GzcNWRu77mAd0\/BmZ\/MbrJJ702+uTk\/NPeT7+k5PbdbtkT4SmKxumKjo41xsbHGtJSU\nfhaLtXULGdeEI\/hbjWe+GnEvKRD301LEuZCpCsc++2uyRYXthw4dImKio4kjhw8T+\/ftI5hMpjGi\nsFHj3Cfa6WCZfv5Vtn7uFQOZecFAvEGGyrnIGLLNMYZMM4wHei\/jLuJk\/GbP3sD27duJ3bt3E3v3\n7iUORUURUVFRiogCNa6nL23BfzJMiz8x\/huQV1hasmvXLmLHjh0bwH2wvcNHviD++EjJjihQ510i\nJv3Bm\/8L+GUs9ebRo0eJbdu2bbS3Z88eIk9SRqjsC\/SIAid9y7d9gVcPbQvPnYbZ4G3DTPC23v\/s\nstodkI05F2Rj9jnZiH1WxhEW+D6POrTR4P79+4kDBw4Q5692fx9xoG460Pv6XyD\/2cufpAaH7+qA\nxth7b1DZd2dUq751f1j9p0cTQyr3fG92fgnx6edRRPg7GAbS6YmP9c4ZBalAvdUl7X8wKL14rVsq\nOXtOmsrNkSZzcvL7Ec9nH+37mNgGcTt37iQOHjy48MPDkRqVxVsXeaDF2\/\/s\/rcjy33XZ\/1dLbOO\n1opZZ6VwxVLMXpnkJa4gHNpbJJP65uN9+9e3bt26sUDyf\/\/FM+29e5fGpjwVEQda7\/a9Xu6oexvo\nVazMt1ev+JpLVz4E7KUdfVt45BNU8uVnaF\/i7\/5trJCsqHp6hiIOVF2\/js\/daA0F\/3Dp5zBwuunD\nQHU69c1EGuXNRGrsm\/HMhLcW+VlsQtFsIwVor63EPO0KMP1N\/aq7VYo7aouBvaoAmyrLChkkmSi8\n\/2yTizGTVIRpizKx8WxWSFeaB4FN5AGdCjm419a43tNaS1yQlRFdwqy14RQaGEyKxgYZMehgYjQ6\nEE5CNPoo4RiKSITYWFMDeUDDlfN437U2ou9yM3GltpyQlxYQfzkRD4YgcAgCR7nUkOoMExs5ToPI\nY6hGzMdGaqqspE7xdwr5+pXGKqJN9hVRVyR8N8hJAhPcFGyYFYMOQ2QYOgRbHEw8hqoLs7ChKmnk\ngUhHB+5qqwau8\/XAXFcORsol+MOiHHyAdxKo+elAI2SD0STYIMxIOMxoiIUN5p3CRs\/JyAE65LDB\ntnrgbK4E5vJCYCjkAYSXBpQZ8WA8NRYbOx6LjiXHbAa2OcKKhkAONlpDBrATNhgGXmgAjvpyYKkQ\nA0MRBArSgIodDyZOULDxVAo6ngKRxzeRozCIiI1NkAHUdXXirgYp5r\/ZhM\/cka9aK8VgqpgHdDlw\niiFQlRaHKdMoqDI1Fh0PJ4xMgcCck9hELRnAG524u1GK+S42AFdjBbBKxcAEgZMiCOTQgSodAk9C\nYFrsRiZSY1BlOhVFeMkhZT1JQHuFOOS71ADcTRXALhMDcwkfGHLTAZKVADTsOAwG1WRQUHU6BVWd\njEFVcIzwmOQAJ7s78ceV4pD\/mwbggYvEUVUELKV8YIRALQQibCoGf+pQDZuymTA0Mw7VZjMgkIR9\n0NDTiTul4tBMOwS2QGA1BJYJgDEvHUxmJwBdJhXTcqioNoyC2UDCMcJNCKkbyALKxKHZ9kYwragE\nzpoiYP9KAEyFGUDPTwR6Lg2bPEVFJ7lxG9FyKDDwnkUnCdgLV3GVOPTkSiPwQaAbHhQcZwTADIFG\nARMYsmiYIZuKhqPPgshTFNRRexqD+BDSTALQ2NuFe2qKQnNXm4C\/VQo8dRBYngMs4gwwlcMExmwa\nNpVNQ6feIw0QqePGopOcOHKAUze7cG8YeA0Cz0uBV14MXBBoLWYDk4gJLBI28LfLgVmQgJo2oHEQ\nGofqOZSQljRg7SZwtk0KpuslwF2ZAx6XsIElFwIFdMyaE49aBTTUwqehZh4VQiGQC4EtJABN397A\np2uLQ\/MQ+OSCDPgaJMDXU7zqOncKWPNYwJrLxBwlGagNIi2CTaC94wRuljIxneIcScA6CLzeBBZv\nXcbDSO\/5AtxVwQH2fBawC+mYXURHm7lJa+fyuIRcnE3cLUxbDbdIHlBeHFroaAJzF2XADxv0yoTA\nVZYJHAVJAOKwAQEDy2cfJ77mpxPNEj5xWZL1zsSD00wW0Pce6Ift6eWncU1FLo6c5uDOwiTgyEvE\ndLkJoTDwdHYaUSnMJBoFJ9bNZAOfdreA7y\/WrrfVnCXqzxQTsnzeu1+AzvwEVCeihwb4DGyAn4Dp\nBbQQqcDwFAdV7eudrY1ER1M1cbEKHvlL84lBYfLa41w6Ho5dFI+77nDXbfVJqyZBHJjiUUOkAI29\nnatwFeNPrzevIu11a92KWqKnSUZcLRO9M+YxV20iOm4ThhOPw+0GtwiouIkfhxuzKLhSLvVG\/jSj\nMzushSdn3ZUi2GQJbm75ek1fXbBmKslYhVvM6iaKtgEzv8fBzRpXZVGXxh4OPoj8edC7ROiml3ST\nd\/rn9Jdb5swy8Z9NRemPTHnJtl9iFCXbtCKWQVvE7tbKzyDqvlsBjXPeGf4sKUDNk7\/2I4G3inCU\n8\/9oV\/tf9Gv8L4ZV08+Mv8b3fHjc96J\/zP9j1\/j8a8Xok9eKcc+yOvIvTc6nBRr3wt+R2R8h4OX9\nYVfQM2hffD5gX\/zbB7I05AqOjXif\/6D0BNWIe6GLlH\/4dR7P1vfQOo0v0K\/xLD1XewKLm1neiMYb\nCMAMq9zLdRrXYqVSv3Dg\/3nWfwAEa05Ay3cBvwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/spicy_grog-1334341595.swf",
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

log.info("spicy_grog.js LOADED");

// generated ok 2012-09-14 19:46:28 by martlume
