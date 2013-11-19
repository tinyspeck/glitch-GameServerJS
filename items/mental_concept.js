//#include include/takeable.js

var label = "Concept";
var version = "1337965214";
var name_single = "Concept";
var name_plural = "Concepts";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["mental_concept", "mental_item_base", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-47,"w":48,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGe0lEQVR42s2YeVNTZxTG+QZ8BD4C\nH4F\/OnUZWzptHbcq1qWIWsMiRkAJIggKci2LIotBIZAFEhYjwRBCIBCWwJWwC8llC8iWCxS16nSe\nvu9FFCWIdCThnTkz\/MO5v\/ucc5733Pj4eODw\/TFB832JxkVHgXG+\/5Z0xhopclnFvj474SwPXvVf\nGn3Av3s5hnevxvFqxoTZzkuYsUbw063h\/l4HXLTf5N4sPsPbpV68nmvGgj0HsywB7IjEdHu4xLvq\nOeL9lydy8Wpai5dTVXD1X8ecLYoAigXA5sJfRF4F\/Ju7FrDoSMLCcwn4fgnme2MEwKn2i2hXHoQu\n\/XvvlnjBHi9dGI4DPxhL1LuC+Z5oONvCCdwhGHN\/gCFzr5\/X4F47EvwWCZyg3sBVuIh6893RmOu6\nLAzJZEsYLMX7Ge+p9zxO+gGu7wqF44dNZ0WmvB9FdmMIGZAIvGgJ5bwCxxNr4QdiSd+twM31RLMu\n+0ffs8j2S4nF4IUlFM6mC4EeByTDwAol7aFD8Snc6pmyhLJTTSI4G84bPQvXHS2ivTbfTeykS+wW\njh56kzjNF1gCiKm6kACPwHVO5vnNPhNzJNDTEoMYZaoxXH57QyuZavgzwFl\/DuOGM9JthytbbJTY\nhjN5asDdzVG4rLyNMDkDSU0uiueMQRv934QhhBmvPYMJXfC390Sly+qr4hslZQsNvGlShem2CIxa\nLiKjNgNxT\/NwyyJD9kAFimeN\/EY5XPo\/fEefnuZHdKc13wSqaNLgV\/iiVlQ8bdAo5utRMKpDfmse\nxlsjhal8bLoB2aQemiUz9EsdULvMkM8a8aWcozUng0aenISj6sT\/UzGX0wbmj1Qz0jEd99CpR9GU\nAVm9GsRW57AxyhSpwyTCpPkCxiwRqFo0wvCSxdjbGSz8u4zRN9NQzprYzZ7hqPqdc1Qc\/7qJzuzT\n+mUMVIjuDlZpsoceI8fxBHkjOkhHdVyu\/QkTo80OFCuTfWl5JurPsrTRnaZzGG4Ri9REuZ5\/OAy\/\ncaL31QhyuiuR0VW26dbCVR5nHOXHwKmPrp\/o5HZ5YEGfnr\/bXYU0mxp\/9WiQ0VeBVKsCieZCLqu\/\nQpLn0H5yb07UBfuP1QbzZAIxUReC8boQfqUvTZyaN8O0ZEMBeSmxJuOrJpSrPBpgVx\/FkOrwp2qn\nd5RL++bG4FyeQ6ndjBvNMoSWMHxoSRrjziKoaiPVp5ipllv88ngDpq0MxvTBsKkOCyDyuXqOBFUN\nkaXp7FZaya45QVzgAdqkP0GftYdvzN\/n75P9TAvNUBMSGoqQ0qlCcpuc28i77ASOe3ycne+RkR2P\nxcKwFlx1MOrJZlKTtVsoY\/FMHfLsWsFivuSBbi2nPolzkcqZcvbRfNBl7Zb6hCoYCU1G4yqxhhRW\nteFbcxXHJCPV58lG8pCEFAOa46h\/n4wCFk7X+UvHa0hZM0ErsGlZSb+RkgaSkDyXHzQ6ys\/A+mj\/\naj4hfGizhyvvsMIbK+\/gRmsJ7UO3V4+t5IDRrj4Ge3kQOmUHoL+750MiXeYuvqnpuvQmaRGay1Z+\niiElklDw9sKfhWBl+zXDZb8Zh0qPcMOlRzCkPIwhxSHYin4Vymq4t\/cTOF3m7o\/bTtTTnIAwRVqQ\nuCILKR1Kt+NuvL9XszbB5yGrjBLgkoolaFgp++cPNK4NCr9RkBd2v+XQkl8zPcStzvUq6u9\/51uT\ntUtD1XIHmEjAKGBcUSzz9O6e7VsAIpR3jHRYkq1Kt5sIXdVrMncxH5Qgf+fmngpc7eWIstTtXeVp\nX0Zrs\/mbHaqvXsnD5GkiCkcsivXxxAlTpgXENzwCUXHTT8P7dr0v6V1+RcE0z23I4ap0JtFSguRO\n+Rf97Darkq6Wl6rv0Q05UpPJJraV8BtBpvaV+SWYCwW4UDnj2fVdUJHcBlHa+0hoIZCt6yFTSJ\/G\n6vNXAIkDeOUrjT74au0DXG8u5uPXQKZ2lvkltSv5y1X3BEDat177zg0jt01cYyHim2QCJLWgREsx\ne6NVjojSdO\/03+dTHVmehbjGIlwzyygoVVSI9\/bCe\/2nNDIE0qjqHMQ3ylBjt+LFsgtjCzOIUd\/z\nzoCsu2HIDRGmuENWsxIo+xrQNjkIRVed9ybYLSTptyt1BUgyK\/CwS48r2tydU+KVK43BRXUGxI+z\ncany\/fTuJEAKsgq1Nmh\/7gzANRv4WvW2fYPZ6rDQlZ4OBgnNVr89tnL+AwX6RPs5IAAzAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_concept-1312585978.swf",
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
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mental_concept.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
