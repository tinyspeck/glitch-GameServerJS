//#include include/food.js, include/takeable.js

var label = "Allspice";
var version = "1354593554";
var name_single = "Allspice";
var name_plural = "Allspices";
var article = "an";
var description = "Some basic spice, freshly harvested from a <a href=\"\/items\/355\/\" glitch=\"item|trant_spice\">Spice Plant<\/a>.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 250;
var base_cost = 3;
var input_for = [41,59,63,90,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131];
var parent_classes = ["all_spice", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by all_spice)
	"energy_factor"	: "0.4"	// defined by food (overridden by all_spice)
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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.food_eat(pc, msg);
	}
};

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.grind = { // defined by all_spice
	"name"				: "grind",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "With a Spice Mill",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.items_find_working_tool('spice_mill')) return {state:'disabled', reason: "You could grind this with a working Spice Mill."};

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var tool = pc.items_find_working_tool('spice_mill');
		return tool.verbs['grind'].handler.call(tool, pc, msg);
	}
};

verbs.consider = { // defined by all_spice
	"name"				: "consider",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Examine the spice",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('spice_examiner')) return {state:null};
		if (pc.metabolics_get_energy() <= 5) {
			return {state: 'disabled', reason: "You don't have enough energy to do this."};
		}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Allspice may be the most basic of spices, but it deserves some consideration, too. Together you share a moment of mutual contemplation.");
		// effect does nothing in dry run: player/xp_give
		var val = 5;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("Allspice may be the most basic of spices, but it deserves some consideration, too. Together you share a moment of mutual contemplation.");
		var context = {'class_id':this.class_tsid, 'verb':'consider'};
		var val = pc.stats_add_xp(2, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_energy(5);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'consider', 'considered', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

// global block from spice
this.is_spice = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_spicerack", 1))) out.push([2, "Spices are much easier to manage if you have a <a href=\"\/items\/271\/\" glitch=\"item|bag_spicerack\">Spice Rack<\/a>."]);
	out.push([2, "This can be ground into other fancier spices using a <a href=\"\/items\/289\/\" glitch=\"item|spice_mill\">Spice Mill<\/a>."]);
	return out;
}

var tags = [
	"spice",
	"basic_resource",
	"trantproduct"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-20,"w":35,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFq0lEQVR42u1XCVJaWRR1B72EVHcp\no8o8CoLzAIo4DyiCiHFONE5oJCqxk46J6SHpuaysgCWwBJfAEljC7XPeJ1XpTrp6NG1V86pe8fn\/\n8f6555577qOurjZqozZqozb+PyMTNMU2O5tK93uspbWOpuKC33jn1oDLOj77ZKOzWY4GHHIWd8lB\nxC4r7U1XtwZgKmgIbXY1y0MAfDzsllzULmBR0q2mfAaTn2MI4j8Blw6YLdlWc\/JBj0UKcTcAeuR0\nyCXLbY2yDla3eqzqMxM0lj46uMVW09VWt0X2eq3yKOaUHFJ7MdEiXyWCCiz0KIcDTvWZDZsl4dZZ\nbq4I2kyxe12W0oNeawnFoIpgub1J6e2w3yYFsPblTEB+TLfL62RYvhjzymp7o2x2WWSV6Q6aZNr\/\n6c0UDsFsVDVWqGpspb2xmA01VnbA3g7Se477l1NgbyYozyf9ksfaJbC20dmk9LgQNBZvtAh+BTCi\nFQF1hmpVLK3h+gj3T5DqXQBG+mW3zyYnYPZ40AktWoSBploMyUy1eFJ+fexfAcgKzIYbK\/egt0OA\noL7OVEG4BWmXbMgsYx6DTPsMsoy0Mpi7ALzP1MN2TjG3ocNUwFTh\/fvdVjW5dtZnCP1jgEttqNSw\nObnVZak8G\/fKt9DYTwsd8s1sq2J0EQBHPXp8mmSnz6r8kED2cP1w0CVPoEfen2sxKD3u9tsBEKx3\nNFMG13SCvw8ubL6kzo6iDjkf1cD9kGqXN0vd8nouJE\/xcr542K2XQ6zJRWzQYIu8nArIMYDmcG8\/\n6pSYSycjbp2qZkqDjFIy3JeZyf4Zn2Qq2aou8AKKG8xUGCU3IXPc8OmoR15OB+RrWMkLFANBxN0G\nGfMa5IyVnGhVQXyfapPnE34Zx\/2IQyf9nHadTHo1kHtI\/\/mIW3UeOAM0a9z8Q4AzXl2SbO0hBZw0\nWEa7A7Ezbdx0HbphhdJW9pG2CWhvyGWQGb8R4L3yCmln+mk1z8Z9sob1TCtTPu7VS5+9QRJYS9Zo\nUdQp2+R84AMAD\/psIVRY\/hEmbCM\/6zdcMToKmKD4w1TAqDTGquUn\/Wyt2iFYDPP4HnNpKT7otyr\/\nI7MEdzygBclgadZL4UaJOhoEFaxYVE6AALjnB1vhScxRpl5eQC\/0tnWkFZEo\/yJzBMSUMEVRTOqI\n9xh9LupUILmW4BCgbOO+mrQUgID3qSB2++wqaK6NuxrkLQn7EU1\/3JN4Cv22O8CRPxp0aWyuVDvB\nE+iKfkXhMg0pRJTCC8Y8mm5YoYx2D6yS2VX8bqPaIQiEOqPPcQ\/uxT3TrWbYjl69nB2H7DH4EQTD\n39xVDGp2xCJLBoxFZoyEUR6FuDNWB1u45sY0XuqLkV9A2LQPTl5P+jRG+Zy+d1oNJA12ZrFxHKxO\nASCZYhaOBx1CHc8HTIr5eLV6Z+CRtJZDrDnCZGHM+PUyimfDWMMAmJEDsErjz4RwuEgEdJZMyFSu\nRlh5jIpiq2KFMpLzEY\/yrwWwwZfm0SW4Oa2FbY0tjSkiC9mqTqk5fh9yaez3qdkAhrTOwqqlNzJQ\nBt9ja5BBZ4NimsC2e21qD7L8nibzUXuZL\/4caaLYaReosvKER3\/JIJgCppDs\/pzplO\/mNStZq5ov\ni2FVBWtWUiCgJYCNoDCmfcaqdu3Y36s8dcKnv+6x1pd67PXFOb\/+miDJJIso4dO\/fzxbCRs32fQL\nQ07VIcjUStiU57Np9FF6FX3wFQz6arFL8zqwiNONAk9dLgIcJUCGKAlKg5U+4NAVwUqZuudcCJqu\n3q1cXk\/56kNv5+8ecBd5MIDlcPL6t89hHRVqk0crxTZApAPGCjVJu0C\/LVPXeRwQeEZUXQWy+WiH\n1CXoFserUj7qKOX6rcUVnBPffY5UxZbVgcCidEsLA8jyrfqHxxNKOoD\/IpgnA7YQ\/a32v7c2aqM2\nauOvj18AgfbLCmOTxaQAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/all_spice-1334274594.swf",
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
	"spice",
	"basic_resource",
	"trantproduct"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"c"	: "consider"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "consider",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"n"	: "grind"
};

log.info("all_spice.js LOADED");

// generated ok 2012-12-03 19:59:14 by martlume
