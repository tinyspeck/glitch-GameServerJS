//#include include/takeable.js

var label = "Diabolic Acid";
var version = "1347907777";
var name_single = "Diabolic Acid";
var name_plural = "Diabolic Acid";
var article = "a";
var description = "A compound made out of red, green and blue.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 1.4;
var input_for = [237];
var parent_classes = ["diabolic_acid", "compound_base", "takeable"];
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

// global block from compound_base
this.is_compound = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_alchemistry_kit", 1))) out.push([2, "Compounds are much easier to manage if you have an <a href=\"\/items\/497\/\" glitch=\"item|bag_alchemistry_kit\">Alchemistry Kit<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	if (pc && !pc.skills_has("alchemy_1")) out.push([2, "You need to learn <a href=\"\/skills\/51\/\" glitch=\"skill|alchemy_1\">Alchemy I<\/a> to use a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	return out;
}

var tags = [
	"alchemy",
	"compound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-8,"y":-19,"w":16,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGQ0lEQVR42s2YCUyTZxzGX51xuquV\nHvQAWnEoeNDOAwoWmYK6KK7opmhcgs5ovCaKB96f50QEigcol50HGty002nUmdkoi1M3h+iG88DK\nISgqnwcquiXP3verKFnMJhU\/9yZP2r4l4fc9z\/\/\/\/96vhPzLMhdoDX1Paa1Rv3k5os97OwZTDSr2\nsvcv9Iojr3uFHtZYIo5rMfCMNz655IMRFTqMvKrHUKcOH\/\/ujb4ntYWvDe6D75SGnoc1fORJLwyi\nMMMoVGy1HqNr2mJEuQ7Rf\/ig3ykvhB1VW18LoHGPyhn6gwbMwaiz3vi0xEdw77MqPYZdoQ4WUwd\/\npoBHNOh2qI1EVLgOeTKL4VsVgr9X48MftfjoVy8BaMhFHyFq5t6A097o85MW7CKMe1WxogK+v0XJ\ndf7aE932qUBjRu9jWiHOAUXeghgwc5a5F3RAjUC7khMVUJ8r5zpsU9J\/rEKP\/WrBpfACrQDKFE5d\nNTso3EE1jLtV8M8XGVCVIYv1tSngv51C7qJO7lUJTpkOuRRMwbrvU4OVQcd8T7TbpBA34jaJbSTa\nDBnflkK2z1Oi0w5PAZQBGamYs6wE2AVQOGhWyyyid7EsVWrRZMihy1bA9ysF\/LYoBVgmv60uMH0u\nvYBUTwQt1TLFig4pXSW1KNI8eAbqlSmHT5ZL3vQ921Ouldmj5umdQ+b6QtAcX\/FnonSlNNYj2QOy\nVBnkVhkUVLIUD6c0Wfr0Vjcl3p+Lm9aBj4v3R9w0f8e4BF\/x5iIF0ckZXL1SPJ7rUvKkAF3SREMh\nFaj4pAldwkWDbAjIgP\/tb7eN6mHdNjoIguh7cQBTFA55qpICKl7ocHA0JtRyJMbMHx1uxpGYnoUF\nMWbDqwW0Bjjk1o4UMOCFHSkZGikpiY5wXI6OAJMzOuLVHc\/kaWFWxeowyFebG33HuBXVjyuL7IWi\nECNOmwyOIlNg048j+dpoTrEmGvI1g90q\/CvmYJwL6Yoik4FBMjmLggPjSro1Ubcr0z\/nlOvGQJ4x\n2i3AsrAQvjwsBKVmE86Hdn8GGmzgqaNccWiA7iUBZ3HK9AQKONM9QLPJwQCPBxnREPSMyVjvKFWg\n7WxQJ\/eaSbl+FeeZkUQBk14KMKdzO2wLbF9YFmaysc9MFyjoM0gDDnXraGs8YGYu57khF\/KsjS8N\nSOVge5WhoToK56yP+0RQF+Qb2j\/9vnHHr8zdHBVUWXvcAiw3h9gbArKaYx1d79rBrgGwub5zEzDr\nqE2VXQDPrII49wBN3LOI\/XjWHAzsl+BAfONyrV72TF83OluVU+xQ55yDOrvYrVtXRa8QKwPMN3QQ\nYmRwju6dGrjmy2d31Lt\/plRvrIag3OpGPwfXREZKqiLChTGz0+iPvEC\/pnGtfmk21lk0tjpoNz0C\ne1XnoFEz62ZUf8f1fr1RD5jTVK49dc9WZ9dsfAjt5kfwynsM7+2PHW13\/jfkjqEJkhNDR9krBw1E\ndf8+hf8AfDnXnp2oeYss7TYU6+7CM7OWRvyAOlnnAs3\/y67fhec6sHDihrjsMUuwf+QUnBky3MZG\nChs1dmNA07hGEmokby2otL+79DokK25AmnQLHlYe8rV3oFx\/D6rs+zTuh1BRvZlyx0Gs9znlynKu\n66JTVsvsA85JU\/OQOD7NuXX0vFfznNJ88mW+5YwytJpTAQqKdxZfw3vLqyFdeRMeKTWQrb4NSSqP\nZotvgKy8DWKtRYuU29AvvwTz\/GP2ETP3vOLT9LgLTvKFE83jS9FyeilaJZSj9byreJurAnO19cJK\nnsytBFlyE2TVHQGQudgquUZHRFljLzgYIEm4CrKoGs3mV6EFBW05o5R\/Y+oVkBnlIAuugXxZA5J6\nj+qheM8fLgcv2snkyyCzGCCNMYm6tOY+yLRSkDgKONsFLsTL9kVf4y5yZBIFnFkBwlGQJAqy7gF1\nlH6OLwOZVwWy7BZI8l2Q9IcgjZyNTQM4scQV5cLrIIm8y6nlFGpWhWtvBd1Lo7W34RHIZogc8diL\n4WTCJZDprNaewDBAVnNzWHM8iX0tdTXnTzvZAYnIDpZIyPgSjtYcT+Y\/aQbm1ooaV3MsZ81xlyfp\nda\/5h3Q6sMncKo4su+kURgmrOVdzFJI1tQbyv1qptbHEes9J47WSRHEj\/RvM8OWLPA36QAAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/diabolic_acid-1334267097.swf",
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
	"alchemy",
	"compound"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("diabolic_acid.js LOADED");

// generated ok 2012-09-17 11:49:37 by martlume
