//#include include/takeable.js

var label = "Snail";
var version = "1339184587";
var name_single = "Snail";
var name_plural = "Snails";
var article = "a";
var description = "Part-screw, part-nail (and managing to combine the less useful parts of both), snails are the product of a Sloth getting private time with metal rods.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 10;
var input_for = [252,255,256,257,258,259,260,262,263,264,265,266,267,268,269,270,271,272,274,275,276,290,291,292,297,303];
var parent_classes = ["snail", "takeable"];
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-14,"w":25,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGO0lEQVR42s2Y+VITWRTG8wY8Ao\/A\nA6gVdwUSwyYWoGRgChRRGBYREWz2fQAJKKthk51pZHBf4oILbkGx3K24+595hG\/Od4tQwLhMlU2Y\nW3UqRXVI\/\/p893zn3DaZDFytra0BJ06csDtldXd3u06ePOkaGhpyjY6OusbHx\/XTp0+nX7x4McC0\nEkvAbBJeCQgcBA4CB4GDwGFychJnz56FAOLy5cv6\/fv3\/Qc6lzkwurq60NfXh4GBAYyMjEDXdUxM\nTODMmTO4cOEC4XDt2jVMTU1henpa8wtgU1NTPeFEWfT29qK\/vx\/Dw8MYGxvDqVOnINLi\/PnzuHTp\nEq5evYobN27g9u3buHv3Lh48eFC\/rHDBwVZzVVWVyl5PT88iaZk5gjFrLpdLwTF7BLx586YCnJmZ\nwZMnT1xv3rwJWCbAUM\/ff0+qfUdpBwcHlbTMGsGuXLmyCO769esKkBIT8s6dOwryxYsXbsMhQ0JC\nbCEhFpFxQknLfUdpOzs70d7ejubmZhQUFKg4cuSICk3TVFRWVqr\/4UP5Hkz+1g0GtGgEbGlpRUVF\nBaKjo7Fq1SqsXr0aa9asmY8NGzZg69atsFgs2LJlC9avX7\/o+pJwGgpotdqwdu1a9eP85M0JtDB2\n7NiBffv2obi4GOnp6YiNjcWmTZv+9T1frFu3zmYIoNVqNVssVv7gd2\/GiIyMREpKipI4MzMT8fHx\nCA4O\/u735SHdhmUxLDzC+61sREREIDExUWWN9sOqZlHcunVLWQyLQ3xQVfK9e\/cgxk3LgdvtVoX1\n9OnTQEMAo6KitYiIyEVwGRkZyrCXVu3P4B4+fKgAWdWPHz82GwK4ffv2gJjYOC+l3rhxo7KU169f\nq2wttZSFgD+Ce\/ToETwej9kwmWNj4212ewLs9t9kn2lyMzc+fPjALCion0m7FE6MG1++fDEbajmJ\nib87k5J3SzGkIivrgNxwBp8\/f2YmFMR\/lZZw8nDer1+\/GmvaycnJAcm7U9ypqfuRlv6HVGs2JqWb\nEPDjx494\/vy5AvoR3LNnz\/D+\/Xs+2PL055ycHD0jI1OKJAvZB3KQm5snHaNapJ5V2WS8ffsWL1++\nZGtTn4xXr175wPDp0ye3YdlrbGw0Hzx4cP7HCgsLXbm5uWLK+5GdfQB5efkokD1ZVFSCnt4+kXh6\nHnRpvHv3DlOyV8Vign4ZbHZ2Nkj2ipt9t6OjA3V1dewOzmPHjnnz8vJASLY9Sl1YWIyS0jKUV1Si\nuqYWjY4m9EvPHhwaxsjoGMb+0jEuvbx\/YFDGtCH7L8O1tLQEyb7xcs\/QgGVYRWlpKcLCwtS0zAGB\ngHa7HZs3b7bLtcCysgpnVXUNav+sQ8PRRjiamnFc+ndbe4eMaV3o6u7xyphmTHsTu\/CwEjmUMnPM\nWExMDFJTU5WV+AB37txJX5yXX6aXgLqjR20OR7N2\/Hir1trernV2OjUZ0+yihDF7TgzXzsqTvYe9\ne\/cqGZk5TigcVglYVlamALdt2+Y2+XuJ4To5tjNr0kGc0oPN4eHhNmn+HtoFh1Je27NnD6HT\/QYm\nDT9IZKyXScTLyZkZknOIW4ZSnuTM586d02mwbW1t8\/LKRBLoF7iamhobeyqnZEpKeQlRVFSkJOWh\niMXBY2VJSYnYSzZCQ0Ndfssei4KAtJO4uDgkJCQoCEIyYxzbec1XHJz9WL1+geMhhtIxSw6HAzKg\nemVvuVgUrFwWSkNDg4qsrCxfwXj8lj0ZGs0E9PmdHHZ0WocURz0hvxEeyV7QsoOxfYltOKUiPT5A\nyjgXupx1NQHW5XvzcHLC8y5se8u6ZM85CcbDOOXlQZxwvjcFvMbguZdSz0Ha\/CYtPY3dory8nIbr\n4dmCBsy9RlB2EZ6B09LSfHD+8zzKxOzQOvLz8yFznp1VyepMSkpSlcogHGX1W8X61uHDhwPFeNXZ\ngl4nMK5Dhw6ZCRoVFeWRSlZZEzDvwl7r1yVSuigjzbm6uhoywagTGmXmUDAHqJlWau3atcvMflpb\nW6v2G4PvTySTyusEzmla6cW9RRn5moK9la8vZM\/xlUX9isOxg9CkpaW5FxrxisrqA5ODtu7zOL4h\nWFAU2opnTsYnN9\/d0Xw5kbDvcr\/5pX39bImv2WS\/2Uz\/s\/UPWYBXd5l9GkUAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/snail-1333579417.swf",
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
	"advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("snail.js LOADED");

// generated ok 2012-06-08 12:43:07 by martlume
