//#include include/takeable.js

var label = "Purple Flower Seed";
var version = "1352410021";
var name_single = "Purple Flower Seed";
var name_plural = "Purple Flower Seeds";
var article = "a";
var description = "A Purple Flower Seed, for growing a pretty bunch of <a href=\"\/items\/770\/\" glitch=\"item|purple_flower\">Purple Flowers<\/a> in your Herb Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 6;
var input_for = [];
var parent_classes = ["herb_seed_purple_flower", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "purple_flower",	// defined by seed_base (overridden by herb_seed_purple_flower)
	"produces_count"	: "3",	// defined by seed_base (overridden by herb_seed_purple_flower)
	"time_grow1"	: "0.5",	// defined by seed_base (overridden by herb_seed_purple_flower)
	"time_grow2"	: "0.5"	// defined by seed_base (overridden by herb_seed_purple_flower)
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
	out.push([2, "This can be obtained by shucking <a href=\"\/items\/770\/\" glitch=\"item|purple_flower\">Purple Flowers<\/a>."]);
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
		'position': {"x":-9,"y":-9,"w":18,"h":9},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEzklEQVR42u2XyVIbVxSGeQM22fMI\n3mbHC6Qq5U22VCqVgIMdkgUhYlKc2EayMbJDqCAQiEEg0WgeUKOp0QgIgQwIGQw2xk5lyyOcnP+K\nVkTMYGySVZ+qU13duvee7\/7\/uS2prk4LLbTQQgst\/rMI2eINESnVGHHm2uKuFc+SN69kgutKLvRM\nWZVLSiFWVjbie8rm0oFSSr1WypkjZTf3Rinn3nh2skf6zeRB21Ziv7EQfVl\/bVAuS6jBNym3+W0x\nZWFWocW5FEWdWUq4VyjpW6NMcIOWw5uUXyzReuw5PVNe0HbyJZUzr2l3+S3tr\/5Fe8t\/8v0Rbade\n8ef7PG6XeEOHuYVN3mCxqRAtXB141uxrkkb8Rdf4AnknFylgixEA5bMAF2oAEy9oiwF3AJh7K+Bw\nBTDAsQGMyy\/u8Ma2xHyso3iWj6PzWavsSN+4EEwyS\/W2IWfRbvaSNBogAHoY0D8do5AKOF8DGNgg\nVoJWGbAQfU7FxB6xxVRKHQqocvZIqFdKH9IWPy\/yBjAO47ExzMc6WA8bDzuSx6EZxYp2OhPwcY\/Z\nNDko0eywh+ZG\/eQE4IQKmCDZkWTADMVdy8Q9SOnAOnEP0oq8TWuRHWGfUJFhYGmJE9et5IFQbyO+\ny+PKbPG2mIf5WEcA8sZlR0oIgXpc1+Mak08r2tlsOO7+9hENPZiguREGHAuRe0Im31SUgjMJCtuT\nFJHSDJhjW1Yp5S+wTUXRhxUVywICSm1yv0FNXHGP5\/gc7QB7szwP87EONhyRMlBQ1PFPRxlQFvXn\nRgP6U4CdLUZC6r8boHHTHLmtYfJORbgP47RgX+KDkq724ZJ3TaiQhYpcFMXXGAJ9BiA+1eKKexUO\n41T1VHtjzpxYF+sHuY6P66Hu\/FiQHCyUST9qrQC2GPUqoJoP2n+nqd9cVZuxy4iwuaJitRdPIGEf\nDgEsh5245jlXa+AwPuWrUY\/XQ\/uo9uJgusbDJFmCZOm3C47eO49NdR3fGOo7m43Ff0Mi+34cosmn\nzhMVK4cl7q70IoqhaDZUFM0PkBW5Aov+xD2eZ1U4trbae+xGVT22F+2k2jvxdJ66Wx+J+mg9oSIg\ndS2Gw7MgkXfbTDTxxEmLUq3VeaFk2r8uXh3oLyilJsDxXLVVhRPW8jphoV7iH\/XY3qH7k1U4Nau9\neAKpnAeJ7LndT8af\/mD73cIm2KWCQiHAAghX3FfA1iq2svKAw4GDtXjHBk56z272i7Z6pyY7+85r\nR9dsNF0EqeYv3z+hgR4LOYaDXDRbha1NPINq6F1haw0cVDMbZ+hndgfr3fvhHvlG7lDe96XIwd5u\nfm6wnvlu1N162Fh7ui\/LXlYWsNODHnJawkJdJBQDGA5EyKaQfThAw3026u8yU09rf3U+YALmm+Qb\n+pSWZm8KQOvD9mO4eu43jDg8vIP3hfzQHP61k9LSF2Tp\/oTMunqKT39GyuzXx13Nhs\/f6zu6o9lw\n47Le\/NCErVALgACDetHpFhrQ9TRe+ccEbBf9eQXrL0tj+91qz2WdX9FYXwfpbhmbPurnWMV6o\/6i\n19JVIQc69aS\/ff8Qbl3rD1rs9jrshzMXHoiPja7W\/ga2vu0qsBUHDFbM\/d\/\/KqBfcQpPvudPJ2\/k\n2q3UQgsttNBCi3Pjb1hDubgFY3A3AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/seed_purple_flower-1308763749.swf",
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

log.info("herb_seed_purple_flower.js LOADED");

// generated ok 2012-11-08 13:27:01 by martlume
