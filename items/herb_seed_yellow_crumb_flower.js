//#include include/takeable.js

var label = "Yellow Crumb Flower Seed";
var version = "1352410045";
var name_single = "Yellow Crumb Flower Seed";
var name_plural = "Yellow Crumb Flower Seeds";
var article = "a";
var description = "A Yellow Crumb Flower Seed, for growing a pretty bunch of <a href=\"\/items\/768\/\" glitch=\"item|yellow_crumb_flower\">Yellow Crumb Flowers<\/a> in your Herb Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 33;
var input_for = [];
var parent_classes = ["herb_seed_yellow_crumb_flower", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "yellow_crumb_flower",	// defined by seed_base (overridden by herb_seed_yellow_crumb_flower)
	"produces_count"	: "3",	// defined by seed_base (overridden by herb_seed_yellow_crumb_flower)
	"time_grow1"	: "4.5",	// defined by seed_base (overridden by herb_seed_yellow_crumb_flower)
	"time_grow2"	: "4.5"	// defined by seed_base (overridden by herb_seed_yellow_crumb_flower)
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
	out.push([2, "This can be obtained by shucking <a href=\"\/items\/768\/\" glitch=\"item|yellow_crumb_flower\">Yellow Crumb Flowers<\/a>."]);
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
		'position': {"x":-8,"y":-8,"w":17,"h":8},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEVklEQVR42u2XW1NTZxSG+QdMZ3rT\nKQRmbKu2U8kBAhFwE2+8cUq96VVnmP6CEm2no6OTjpNisCAHCXIIBAlNIEBCOFglpeFQECMl4oEe\nbCfUOvUyP2F1vTvfBxsNCrXc7TXzDnu+w\/qe\/a619w45OXrooYceeuihh4yVTkvuUq9NSfRntBqw\nKfdDlco663G4UkmF7crf43blGWvfYUZbTUXRNmP1lMfiu9lRHJ\/pLknP9pTST74yWr5uo7v+o5T8\nrpweBCtoPXSMfh9R6M9wFf01Zqen48fp2cRx+mfcnnoatcc3xqoiqXBVDW7itaBCbktu4IqxZqjZ\nGAm3mNLRNgtNtRfTrY4S+qHLSrPeDOBtAbjKgPcZ8NFQJf02fIz+GFUoFamiJwISehK10waPYQ5r\nHg5WpteCFfHkQHnTqt9atGuwYKPRx3Dp4BUjhZqMNNpqJgl4UwDGGXCht4yW+myU6D9KPw+U01qg\nAofSLxoXAbnBkBCuMfaY57AGa7EHe5Fjqa8sPt9bWr0j3GCjqUiCSQ0BsMVEY1fNNOmx0PfXiinW\nWUI\/dltpngEXGfAOJ18RZZYu\/jqcgYRbgIJwjTHMYQ3WJhlwhQGRA7mQM+61pmPdVmeM+3wboMd5\nMN5\/+UPSAg6yRhgwwoATDHiDAacZcIYBZR+izAl\/xsV7fOADdgYAcAml1ApjmMOae9I93oscyDXH\nOZEbZ9xot6Qn2yw1m4Df1BpSbkcBtTsP0kDDkU3I4WYThbnM41nKLF1c1vQiDoY7DwXouhCuMYY5\nrMFa7MHeLfdK1dw4A2dF2Jyurw\/5BGC+r67WQNDlM4XUdfGwCpqtzFoXZS+iTHeFkyj3mgDVCmOY\nwxqsvaP2nk3NMatxD2fgLM+Fd1Weq+fecea4zrxVIAGl4Og1djTAoJHnXIzxnaIX50Spl4STKNmK\nAIVLSaFVAYa5hHAOe2RpkSumca9dwAnD0qqLdQ5DzfOQUq3nDlC\/+4PNXpSvHAm5IMqNfoIzCeGo\nVhjD3G1RVuzBXlla5JxoM1PL2QMvnL\/Viw7D5ztBQt9+UUg9Fw9RqPHINkiUCH0ER1RQAbsshGuM\nLQrX5kVZsVeF49IG+SF1ny6gbJXc9kS7HPnV\/NCkXwYK1XMyn+swjXKfon\/gxJwAXRCwWmFsXuMa\n9qDfkKNegLWef58mvScpEf2MFkc+pW6Xmcfzml54L6InGTL5Kkiphi8L1b4Z4DaY5AcKXxs4tE3e\nLbAw31Sn871NMMjfUE4jzcUU9bC7gVMqZF99adL91Ru5O77AL9UanLtxM5u7\/PRlVbb1Yx0naNp3\ngjrP5pL3\/Jsq4FTPRyn36bdf\/RnMuJkf3yvkboWywq2F0Cc04z+p\/p2+furlzmWLOkeesh+gEhC6\n1fcxdbnMe4fTBjbjacfX5\/+EhLI+EK8TmRd8XtN\/6VOt1JvlCu3rj1s0tIDdg7P5EXwg9P9T9NBD\nDz302N\/4F3kLZFP\/uphQAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/seed_yellow_crumb_flower-1308763741.swf",
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

log.info("herb_seed_yellow_crumb_flower.js LOADED");

// generated ok 2012-11-08 13:27:25 by martlume
