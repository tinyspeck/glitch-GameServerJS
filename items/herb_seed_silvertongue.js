//#include include/takeable.js

var label = "Silvertongue Seed";
var version = "1352410038";
var name_single = "Silvertongue Seed";
var name_plural = "Silvertongue Seeds";
var article = "a";
var description = "A Silvertongue Seed, for growing a pretty bunch of <a href=\"\/items\/767\/\" glitch=\"item|silvertongue\">Silvertongues<\/a> in your Herb Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 25;
var input_for = [];
var parent_classes = ["herb_seed_silvertongue", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "silvertongue",	// defined by seed_base (overridden by herb_seed_silvertongue)
	"produces_count"	: "3",	// defined by seed_base (overridden by herb_seed_silvertongue)
	"time_grow1"	: "3.5",	// defined by seed_base (overridden by herb_seed_silvertongue)
	"time_grow2"	: "3.5"	// defined by seed_base (overridden by herb_seed_silvertongue)
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
	out.push([2, "This can be obtained by shucking <a href=\"\/items\/767\/\" glitch=\"item|silvertongue\">Sprigs of Silvertongue<\/a>."]);
	return out;
}

var tags = [
	"herb_seed",
	"herbalism_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-8,"y":-9,"w":17,"h":9},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEl0lEQVR42u2XS09bVxSF+QdMOmfQ\nH8AvqCJ1XKlSJRsIEQ6OAg1xefiBDRiM8fP6jY2xDRfbYJqUpBQQEKBALwQw2AQMAUJKH3SQSKlE\nBaraTjpYvecYKAbMwynqxFtasvw699tr7XOunZOTrWxlK1vZytaNF8u+ygsGtz7tjnyv6X30g\/Nx\n3y9cX\/8brn\/oHTc4useNTBxwz6Z\/5yZm\/uQmZv\/ixr\/7gxuZPHAOj\/2mGRj+VdPf\/yb\/P4dyO6K3\nPJ6Yxud9sdvuX4POtQKFJY4K\/SLEzfOQtCVQ3fkyRVLbClSt61C61qB0JlDrWIW5YxvWzm10RH5E\n7+Of93siO6FQ97aGZddFgcCL3GuDMcYpkY2Z4VyOBThdS1AxSaAj1Q\/8hPa3f6NjD2lF3retH0A7\n9ZY2cvTdspYF2qTJk4AvsA6\/bxUedzzktscudlipnMzVqUc1+ubxfcYwDRszC6d9HpX6hRS4+8bF\nC8HSyRzfS1mHrqWdh9oaQ5snjlZnFDbLbIIxcqJz4RpVg7stjaMwaMdhNkzxgDMU8POW1EUf2Jcz\nAiQizp+GJDLaF0HSsltmwRineYZvE\/qG0bx\/AaWPEk2qQWjVIzA084D6KVjNHBy2OdSbF84sqPxq\n59KIT4vETZo7D7DeHKVmkNRIekbtBIhZNZVs0s0ioRziEh2aVAPQa8Zg0k3CYuJgtz6n1stN0XMX\nJpuCuGKYe0cB0imdc0cx2xw8oG2eN2WGmkNMUlSHUVyoRLnYnJ9TJJDtE0jywsNyF5rVQ9Rqfiao\n9Z7WJbTYY5Doo2kvlIkInMWxRE0gZhBTiDkNyieUhTCJihu5nEKBLESenFRFuRN67TMac6trkQ6y\nj99xNs8K5EzsveGkpkVYXTG4+eZpvIfz11j3NQ+nSmHJEQiUuUcunlbZPROa1E+pi17vMvz+BDr5\naAPsBpz+l2C866i1Ll\/uFn+81JiWUG+Lw+1dRXv7CtrcMeqewzpHZ17T8M0ZOApIqqBAmp8OkuhO\nUR2qJB5YmMljyK6uTYTCrxDueY3uyA6C3a\/h7tw6oU24AslGuoJb6OSbCgTW4CNwfCJuPhnintk4\nBXlNF71OeWkNWnUVsDQ+xN1iKUpuq3ePd\/NlkCclqXDBoB8G27VBLx7kQUPhbYR5SCL+TkHhg6Et\n\/jObSdcP4bxtyzRaMt91yl6++aRramkl4kOlxyKQRQLFrZQz8fZnsrwigTxxFUii0hIN6lURmIyj\n8PlXqatELNUGBevoWKOutx\/CWZlpKBU9EItajtchMCP+j\/Cl6UOMsR9TQI38C+7cu0pyJuXOq0Ke\n1H2xAQoZyzvTQ6VSdkNVG+aBwvyItOFeqe7Md3QqCaL9xQjU5YJVf4C5J0L0+cp2SaIX3v6IvYVC\n2W4moNfR86diCjgd+YTC+ZkHuBTupJsFAlnVVWczU0ASKXmkcyeUia79C+c49hsArSyvhkJShbt3\npPsZwZ0uspHOO9zfR2SUrhzrdUBJx4UCOZcxHJ9IoVCuIQnd6F8CAktnVSgbuBoYOcpkohsHu+gE\nSKf\/DSpb2cpWtrJ1M\/UP8lZswzqbDe8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/seed_silvertongue-1308763743.swf",
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
	"herb_seed",
	"herbalism_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("herb_seed_silvertongue.js LOADED");

// generated ok 2012-11-08 13:27:18 by martlume
