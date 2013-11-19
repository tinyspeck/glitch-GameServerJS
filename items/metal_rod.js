//#include include/takeable.js

var label = "Metal Rod";
var version = "1339184580";
var name_single = "Metal Rod";
var name_plural = "Metal Rods";
var article = "a";
var description = "Metal Rod, made of tin and plain metal, is not only useful for the yet unimagined construction purposes, but is also a much beloved snack of a Sloth.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 16;
var base_cost = 100;
var input_for = [251,254,255,264,265,273,284,286,287,289,290,291,292,303];
var parent_classes = ["metal_rod", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.feed = { // defined by metal_rod
	"name"				: "feed",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Feed Metal Rod To Sloth",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var sloth = pc.findCloseStack('npc_sloth', 200);

		if (!sloth){
			return {state:null};
		}

		if (!sloth.canMetalize()){
			return {state:'disabled', reason:'You can\'t feed the Sloth right now.'};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var sloth = pc.findCloseStack('npc_sloth', 200);
		if (!sloth && sloth.isHiding()) return false;

		msg.target_item_class = this.class_tsid;
		msg.target_itemstack_tsid = this.tsid;

		if (this.proxyVerb(pc, msg, 'npc_sloth', 200, 'feed')){
			return true;
		}

		return false;
	}
};

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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/995\/\" glitch=\"item|metalmaker\">Metal Machine<\/a>."]);
	if (pc && !pc.skills_has("metalwork_1")) out.push([2, "You need to learn <a href=\"\/skills\/126\/\" glitch=\"skill|metalwork_1\">Metalworking<\/a> to use a <a href=\"\/items\/995\/\" glitch=\"item|metalmaker\">Metal Machine<\/a>."]);
	return out;
}

var tags = [
	"metalproduct",
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-11,"w":41,"h":12},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAADQUlEQVR42u2YTUtiYRiG+wfRLwha\ntGlhEURQJEUEEVFEFATlJARFgaDQYIOZWunkpPmt+XH8zK9MbbKyLxuI2czCn+BPOOtZ3fM+Bxxk\nQIaZxbGFN8jB3cX7Pvf1HO3oaKeddtr5r9ze3kqTyaTW5\/NpbTbb3LuCK5VK2ouLC3g8HjidTpyf\nn\/PBYFDScrDHx8fOm5ubSjweh8vlEj4MDuFwGIlEotZSuOfn5+5isViNRqNwOBwCnN\/vF+BisRgM\nBgNaBvfy8iIpFAp8JBIBmze43W4Bjr5zHIeDgwOsr6+3BvDp6Ul2dXUlgNThAoEA6CTpqdFosLq6\nirGxMVkrrlWby+UQCoVgt9uFUrAyCHBerxdqtRorKyv8yMiITPQyPDw8cNlsVjglgiMggqN5o\/nb\n3d3F0tISPzQ0JBEd7u7urppOp4WGUiEIjk6R4AhWqVRiYWGBHxgYkIheBiZgPpVKCVAEx0QswJFa\nLBYLFAoF5ufna62Am2MC5hsFTHBUDuY4mM1mbG9vY2ZmptrT09MpdlMVTMBoImAYjUZsbm5ienpa\nfDjWVO76+hrNBHx4eIiNjQ1MTk5WRIWjMrCTqzABC8Kl4W8UMAHWBTwxMcGJXgYGV83n8wJIo4AJ\nri7gtbU1ErD4cOxa+bqACa5RwFSMvb09EjCYgK2iry0mYPxNwMvLyxgeHpaJXQZruVxGJpNpKmCV\nSoXFxUUMDg7KxC5Dnm0HkIDpCv8UsNVqrQuY7+\/vFx2uyrYD2Ot5UwHv7OxgdnaW7+vrE2878PxP\nydvbD\/719TvSaSpEuP56\/lvAJpMJW1tbJGC+t7dXIurJlcvfaoXCPS4vvyKZyrM5yzCorABH11oX\n8NTUVE1UOEqxeK\/I5Urs5AqIJy4ZVJK1NgaPN8SeIeh0OsjlcoyPj4u\/uijZbJH96sohEk0xhcTZ\nzHFwuvw4s7lxdGQSBCyVSlsDR4nFstpQKMHmLcI2RAA2uxenpw6YPlugVH3E6OhopaurqzVwlEAg\n3u1yB3m7w8fe4Zw4OTnD0bEZOr0Rax\/kXMd7yKndLmFgtWPjF+gNJuxrDWyF7Wvf3V8UGr1eotbo\npCrVp+72HzbttNPOv+cX4knja60Ns1wAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/metal_rod-1334193280.swf",
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
	"metalproduct",
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "feed",
	"g"	: "give"
};

log.info("metal_rod.js LOADED");

// generated ok 2012-06-08 12:43:00 by martlume
