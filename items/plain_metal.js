//#include include/takeable.js

var label = "Plain Metal Ingot";
var version = "1345780583";
var name_single = "Plain Metal Ingot";
var name_plural = "Plain Metal Ingots";
var article = "a";
var description = "Sure, this metal is plain, but with the aid of <a href=\"\/items\/621\/\" glitch=\"item|alchemical_tongs\">Alchemical Tongs<\/a>, <a href=\"\/skills\/81\/\" glitch=\"skill|alchemy_2\">Alchemy II<\/a> and a secret blend of elemental ingredients, more exciting metal materials can be made.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 30;
var input_for = [174,175,176,177,178,179,181,184,187,196,202,205,206,208,212,213,215,216,217,218,219,220,279,281,282];
var parent_classes = ["plain_metal", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/620\/\" glitch=\"item|smelter\">Smelter<\/a>."]);
	return out;
}

var tags = [
	"metal",
	"advanced_resource",
	"metalproduct",
	"nobag_advanced_resource"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-17,"w":34,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE60lEQVR42u2YS28aVxTH8w2sbNM6\nxmPAvGYYGBjezACDzfAc8zCuaxvXfUhR1LqJ2rVTqXWlLuouuyqbtNt8gC76AbJg0XWUL1BpFvkA\n\/547Bmqn2AZiMJV6pSMQQvDj\/s4591zu3ft\/\/UeWJHFLQdFxFgq6TtjzhYJzu1dXBO9qz8\/bIQoO\niKLDDIrOxQANBFyKKNhN3svB67bB51mF4ONwDms3xbsETafDx8lEELGIADnkRTDgssAYJINl0IJv\njV5bMwl2fqCtlrZUKWW7uq5iI59ELhuDkg7jZljOFHz2k5nC1evFlWaz2Gu3q2g0ijCMTVTKOYwD\n6+cd8Atu8Px6bSZwej6lFHXVZEC12gbqWwU0myWMAxuPBZBMhqxHgjQ57pZ1p5PScVaNQKMvZV+u\nb6ZRKmZQrWgwGGxdR6tVtoI9r1XzKJeyKBQUaLkEVDVKgBKitKtsR3mf88Wt9bdw0NWNhn2IR\/1I\nxQNQUiGMA8t2t0SQuWwcVFCIxUSESbnod1q5yXvWau\/c33xuW0+gDwtQDkniOsJBN8aBNWp52kUN\nmpaEokSQiAchh3kE6TNYwbjXH8JhXzanhvM6V\/2822byrAIvxDiwJV2hfMxbcJlMbKhWovezYvG4\nVrDuWAZne9CbDs5l67wNNir8tBMBOjlCBCtLHsRkHuWigmp\/57JMbYrURkmtRGoFJ7z0A13OZdhX\nH\/S4+\/cnLxTeZeuOAzcKtlo5L4ocFcX1at\/rcdyEcKzsWb5NAxcU7Gg1CwSVGMJlWNUm\/lEr9NU6\n7e+\/mBjuqnwbD86B9nbJAmNKr1XrWO7OLN9GhZIIYGenbPU4Vgyj1Ab6ainvunPLNxbVkoItY8OC\nuQg3Wu3D7tzyjcXOto5KJWfBsd27Tq3HY+vOLd9YfHzUJJAYnQzyZbUUiiIjTv1Qpt5oqfVw3bnl\nWziwjkePdodwN6nl+bXJ4EQvdzYt3KYWxWef7iBBAClSOEptylLrR4gatiisdSYby+lMjck+pBOi\n1RYmgdM34jj6qGnBsXHpJrU04ncmrlbRxx1HQh4LUN9MopCPjwV6sFehiUS\/BPe2WrWvNiKTWtHV\nmepsFdy212GawRJRAVklTLuSQOfAgFHJXAn37ORzbG8XLbhx1ErSlHD9qoVEMxjTrKYkyqkYKiUV\ne7tVfPftU+pp6SGYRtPIN8++sI6tAdyNaiVvZ+qxadCM2Yh0rjmAfJaNRGnUDQ37ezU8f\/4jur\/8\nQPEzXr78fSTcVWplWei809DJdpA1ZTZt0GSMZMyPnBq2ctGoZrHd0q0i+O3Xn\/DmzV84Pf1qCHe9\n2pAZifC3c\/mxTg6X7Q+mOR7hoaZJMxVKtayi2djEh7sVPH3yCV69+tO6+FyEG6hlUGz3WNBFyJTl\ngP\/Wb2Uibz+L0p3gXHMUZUtzHh\/slNDp1PH96ddjqI2YyeQM4AZLplZwrlnua86hTZr39ww8+fKI\nrpClS2oZ3EBtRo3NFm4IKXv9ajponmvOoGVprlq5eHjYGKk2m00QnDx7uMGi9rBC1dxjd4jGFtNc\nxiFpPjpq\/UttLpc0M5k5wg2WpklLxUKia9RIM41QB\/sGDg62Lqm9M7iLi6r5hGlmjfvx4\/2hWooe\n+xEL8SdkYyvX2W2XTVYk\/d1bHLjBarc3\/DSQvs5kFhDu4n9\/Cwt3F+tvHqx\/QT9V6dcAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/plain_metal-1334276401.swf",
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
	"metal",
	"advanced_resource",
	"metalproduct",
	"nobag_advanced_resource"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("plain_metal.js LOADED");

// generated ok 2012-08-23 20:56:23 by martlume
