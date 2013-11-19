//#include include/takeable.js

var label = "Rubeweed Seed";
var version = "1352410033";
var name_single = "Rubeweed Seed";
var name_plural = "Rubeweed Seeds";
var article = "a";
var description = "A Rubeweed Seed, for growing a pretty bunch of <a href=\"\/items\/766\/\" glitch=\"item|rubeweed\">Rubeweeds<\/a> in your Herb Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 20;
var input_for = [];
var parent_classes = ["herb_seed_rubeweed", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "rubeweed",	// defined by seed_base (overridden by herb_seed_rubeweed)
	"produces_count"	: "1",	// defined by seed_base
	"time_grow1"	: "2",	// defined by seed_base (overridden by herb_seed_rubeweed)
	"time_grow2"	: "2"	// defined by seed_base (overridden by herb_seed_rubeweed)
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
	out.push([2, "This can be obtained by shucking <a href=\"\/items\/766\/\" glitch=\"item|rubeweed\">Sprigs of Rubeweed<\/a>."]);
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
		'position': {"x":-7,"y":-8,"w":17,"h":9},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEZUlEQVR42u2W21LbVhSGeYPc9J5H\nIJaMMOZgczC+6UxipkmHwkCZNnbScipQHLAdNcRgczQQCLihcYlTaDjEJSlNSpso0MNFb3iEPIIf\nYXX9W5JtChMCQ3qlNbPG0vZo72\/9\/9pbKiqywgorrLDCCiv6lm3FoQdll8IrTlVNOzO31yq16HqV\nFttyaWPbbm3y5xot8aJOm\/29Xpt\/7dEW971a8k9vIvlXg7q416DOvfK4zh2qKyGpPXP2TP89hYLJ\nMhpcLqfw905S0xXEgBRdr6bYExcxIDEgTb+oo9nf6unuKw8t7DXQvX0vZwPNax6ae1lPM7\/W0dRO\nTXb8mTszlnGrdzar26JbzuJTQQXitpLrsYupjgmJuqZl+mq2lPoXFBpYAqCDwikn3QLgaiXdeVxF\no1suiv\/kpolnNTT1S62AYBUFJMB0OI8AZ4VpcqeWxp+6KZZx0chGNQ3\/WEXqo0ottOJoCyblCyeB\naTdiNkJ+Oc6AUwC0U9+8DnjzvoNCD8op8rCCvvmBAXlyLILFsKhQ8bkByUAAxe\/Mrg6HAlAICkJh\ncABOwBE4M\/RdOQWXlFTvklJyBM4EywGOSdTJgD0zACylrxcZ8FuHmCSywjY\/yttsqjj+tEZAAmT6\neZ2AQgJ6akeHQzugLVAYCkSht7jgEDsDhyAEHOPWSvjjhqJtQ7ZsYOQw4BdxG3VOStSdsFPvHNuc\n60PDZkNFWBTdKITU7QYo7ERO8DXgBRys3awW7SHU40JRMAqHABACgqC9rnZLB1f8DHk5IJPvhkQt\nQYkKQfN9qNtcqGJus6zqVpuQAAAoYAoznjGUYzje\/TS8pqsXKVAPAkCI3rul1DwgE7iudEqZost+\n6QA3Zjb1SfT5bcPmSd1mPISHBwwVRS+aVq8aSrLdABCgT\/KJ+1EeF7Y+zsPBBbP38uop1DKQZ0EW\n+a7ZXIUDZn7UKVF7RGIlTRX1XgzyZDhyQikDMm3YzQsLNdd1WKgqftcNMP4PxfCuPQx3P997LcGj\nHKIPfX657ThI3X5ZSO6PMuSCchjSUBILQk2AAgL9BWAkrjGG\/1BM5KFT9HEOjl3pninlnjtmfb+U\nze3mt0Ga2ciwTb0yfRqG7brdQwyJBU1QnJOAzWVaHxNgrBqUN+E6JhUxH+b291dQOtlI+5ut9M92\nO43EvABUDx05ut3Sm5NAzfy4R+Z+xa4rE6BoeEAgAYwU9zwOtQEGO6+PKtQ6aM\/NExmup92Ul7YX\nHPQy\/aEAjI15D449tLG1mTz1rpCF+Um\/nYEVujZ8ODHWHikVBf33GcD9vdVMycELtBz+gP5Yv0p7\nG61vfAFbyVtfe77AxUunUfOsCUsBCOUAt7LoywYjNSXv\/H7We\/P9gZo9t7vWTINqbRZtdqavG6Go\nX86cN2xbj4O6BqupqUM5ONHWU8EGZO3cQHm3itfaeYfYUAG5WyjLZ9YZwFKNn9mK\/7cvb1gENfRW\nEAofTb+UgAPvRTErrLDCCiusOBL\/AobI9hYvvuO2AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/seed_rubeweed-1308763745.swf",
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

log.info("herb_seed_rubeweed.js LOADED");

// generated ok 2012-11-08 13:27:13 by martlume
