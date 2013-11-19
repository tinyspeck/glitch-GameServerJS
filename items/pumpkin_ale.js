//#include include/drink.js, include/takeable.js

var label = "Pumpkin Ale";
var version = "1339026056";
var name_single = "Pumpkin Ale";
var name_plural = "Pumpkin Ales";
var article = "a";
var description = "All the refreshment of beer combined with the autumnal savoury heft of pumpkin. Then combined with cinnamon. For no reason anyone can decipher.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 83;
var input_for = [];
var parent_classes = ["pumpkin_ale", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "50",	// defined by drink
	"drink_energy"	: "0",	// defined by drink
	"drink_xp"	: "0"	// defined by drink
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

verbs.drink = { // defined by pumpkin_ale
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood. Grants 'Moonwalk'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = false;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? false : true;
		}
		if (failed != true){
			pc.sendActivity("The full moon and yard of vegetab-ale casts a spell on you. My, what a thriller!");
			pc.buffs_apply("moonwalk");
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
	out.push([2, "This item is seasonal. Some of its ingredients can only be grown during the appropriate holidays."]);

	// automatically generated buff information...
	out.push([2, "Drinking this will give you the Moonwalk buff (a new way to move)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	return out;
}

var tags = [
	"zilloween",
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-38,"w":22,"h":38},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIPElEQVR42sXYWUxbVxoH8D7M2zxE\n8z5SpI5m0Uij0TzNYyRGmoak2Zq22dokkybN1lHaNEmnarNvDQQIa9gSCGEzYIzxDtjG+77iDW\/X\nYIJtwBACAZKm+s+5F2OC6JKJzeRKn66ubJ\/78\/edc+655623MjgArAPmN6yO2b++9aYOBvVi9sD3\n82O27xfGMfc4hKdTAfzwfBILM1E8JddzM2NT+GG26MVCfBv9\/f8PbD68nr4pgUzNTYcxM+EGfaaR\nj+M2zIy7ydmO53Nxgg7jccKO2eQgnoy7ELR3cdY4a5PrXiwk6ayAjqdTfpKtYcw\/iTCg6YSDYLyY\nSfowOWpCcsSAsYgCibAM8VAfRgMS6HpLL64JrtccWmf2UZyFJxSeEdSz2egihmSQzg4ddAbnpykC\n02MiqsX4kCoNjPoECDvZcOnuoUel5dDtZRdopbYpLQMzkzEbnoy5MEf622K2PEx56f73OGbBFJO5\nZeDIoAhRrwAD2lo4NdUQs2+A1VIBur2sZ1FrtUOnakdvxyXMElAs3I84pSRZUiMRUSJOrmMhGUaD\nfWmgXX2PlLUEGskdtNefR33ldbC7+ViTMmudPoRCdrjddiTHKYxHdRCwroNV++2q8Jo5DLCjoQSt\ndXcg7HoAg0EKm5kHhckMq\/Ta+qzipNbweovbjQhlx8T4EOZnY0yJux5cQzhghH9QDc9AHzxOCdwO\nEQLuHgao6qmHy85DyK9CcFCJASsXGqMCWm33hqwCZVZqAw0cHnYxwOcLSTKNBKGVVMOiFyHo1xGg\nNA30DYjTQIeFQz5XIuhTwE2wNJBub02Aj0a8DPDFsySezyeg4JdAp+CuArrsAmaaWQR2kuwpEPDK\n4batIXDA51wEjkUwEffCKGtA7e2zqQxq4XXJVgDpkb0EDPj64ffK4LJ1Q28Qol+veSgyhw8LjMGD\nWcHSjbgHHWlgIh5Av7gN4s56UCHzTwLt+g4GOOiRwk\/C7RCQwcJDv0Frs4WTbYMjk11dKl95n5k6\nlTnQY2CA4yng6IgHwxHnzwIHTJ0M0Ev65KCbDCICVPW3kHkwJJU7R2vGp+asE1NzepEx2JrR5E3+\n4QG34DRGTJVIUBrEoo5fBE4nnDDIGxmg3dAKs7wWkoazaCn9jACjKp5xqJhnpG5MPH5q9g6N14gN\n\/r2vP81YqIth9lbEDUWIW6oxoi0EpSpEoL8Q7p6rsPO+hr7tJNRNR6B4eBjy+sNMBi3SSnTm50JQ\neRDCmuPoKjmAxlt70GuJ6ERGqrhLG6w0eWNlianZXp7adzVjYMxQmAaG5VcxKPwPnJzPYG4+CFXt\ndsgrNqG3LBeS4lwGaOuvZYC8io8gqPqUAT649E\/Q7dElFRtD8tY+12ka2CZzXsgcqH8JKLtCgF\/B\n2XlyEVizLQ3sq9jOAA3SOgbYVfIh+Hc\/AbfsUBqYWoTcpYF0iRvF1mNZAla9BDyXAh5YAXSKbiwO\nEl0zA+QUv4\/u8oMrMrjULg10BuMl1Rz9ziwACxAzVyKqLUgDHZ0nVgETARlZI8aYJVbrzc3g3NkJ\nbul+Av34R4FG7+jNjICm\/qa6ZeBdRDW3EZZehk+wBNy\/ApgcNjBAB1nNNFzbis6iHegq3gd20V4G\nKNbY6uh2JSbqKA1U2ocuZFRivZItXw28tAxsooFb00CTIJ9ZetUVnWWAHbcJ8s5udBTsYoBcbpuc\nbpcMEqYP9hiC5zIaJEvAuLE4BcxPAc\/CwT6+Clh\/ZScunzqIvDP7mD7Ynr8Z7MIP0Jb\/\/gogXx+4\nQwPbpO7jPK2PlTFwwtmAmKkCUXU+QjSQf4YAj8HU9PEKID3N3L+8k8ExwLxNJIvvgXVrRxrYZ6V2\nc7SLwDqh\/ZBA76\/KTgaXgH0XGaC94yhMjR9BVb0SKCjKBbdgYxrYlrcNLTe3MsBusTApMEbudqgD\nl2lgQ4\/zJP20yhg4qiN9y1ROgHmrgMrqLT8JbLuVC9Z3W9B8\/d1FoEgYox91S8Burb86o2exVs2n\nVgMvEOCXKeC+XwBuROuNTWi6mssAeSLhzBKQp\/PXyazhzHYhNJoerATeegn46SsBW65vROOVdxgg\nXyKGxByR9Zior7LyCroMzMOosQzDKhp4Hl7e6dcGZnVFvQy8lQJ+h1BvCth+BMaHe98sUGZyM8BH\n6msEWPoS8ItlYNW7bw7YZwlP0cDhvrMp4E0Ee799CbiHADe\/MlAoU2QZaA7JA5xdiIhOLAKVBNjz\nDbzdn8PWdhjGhv8NSAYGlWUgdcoirUCQ\/SFGDSU\/Atz9ysDO5hIaaMsqUGGPCMlcBavwCoK8IwR4\nIwU8RYCfvDKQff8iSHcBV+3Ly+jJsWoUOyl4AhHIbFRSqZLAKSthgB7uKVhZ\/4L+\/o6fBXYU74VA\nyEGPOTTDV\/vyPf4Qe2lNmJWjvIF7OxwZnovGxri+0fljCnfsotI5Uq9R99qU\/JIZBb8Mcl4ZpNwy\n9HaVoodTSt6ZSyHkN9pEhmA9V+s7z5K69tTyjP+Q6tzH3YHI1Mkz5\/+ezSr\/9l4rr84XfjQwMjZd\nHp5c+Lfn0cwuXTCZK3HEc4R0WEZyug2RnE4NHcGcNoUvp1nqymmQ0OHIYcns7+ic\/nNam0\/7wd79\n9Iv6r7O9A\/eHo59\/fYYlUrLVDv8DBzVRTI0\/PRGIzx52Rqf3WYNju7WexHalM75N6hjaKrUMbaE3\nKkV6ao\/YEPimtL7zi8sFVRW\/++Of6c3L36zVVvWvSLxN4m879x06WVjT2lrDEt5liTVslljb0SLU\ndDQLVB0tfFV7E0\/RfruyufxKQdWDt3\/\/p\/fIb\/5CV+J1bvpf1hAx7uUlkWIAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/pumpkin_ale-1334213422.swf",
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
	"zilloween",
	"drink"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("pumpkin_ale.js LOADED");

// generated ok 2012-06-06 16:40:56 by kevin
