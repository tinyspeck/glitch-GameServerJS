//#include include/drink.js, include/takeable.js

var label = "Fruity Juice";
var version = "1337965213";
var name_single = "Fruity Juice";
var name_plural = "Fruity Juices";
var article = "a";
var description = "A glass of nigh-ambrosial fruit juice.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 24;
var input_for = [65,68,69,70];
var parent_classes = ["fruity_juice", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "20",	// defined by drink (overridden by fruity_juice)
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

verbs.drink = { // defined by drink
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.drink_get_tooltip(pc, verb, effects);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead){
			return {state: 'disabled', reason: "You are dead :("};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return this.drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.drink_drink(pc, msg, suppress_activity);
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-31,"w":21,"h":31},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGcklEQVR42sXZaVNTVxgHcDr9AH3R\nD9BXfd1P0NpalxFZRBBkkR0kArKKWyu1to7WTmvV6bTayhQRQQghxABlMSREWZQQEghIEgkKmIQl\ngEhyI95\/nxMMExUVk0jPzDOZO3c5v3uW55w7CQhYY2k2Gj+6Z5ku7h6dkLEwTs3KxmbnZcbpuWob\nt1Ruf4ZXwrzIlQ9NzZW7rqPr2X09D80i7YQ1J8BfBUCCzc4pTHOL\/aYFp1y\/iL99jeHZJ81DU\/PD\nQ9bpSnr+Bl9wvXNPeZU\/UK\/FzjzuoHpKvAIuOJw2HnDMPIX8vh1X\/I2zPkWz8xk\/NbvoEHkFrNcZ\nZawF2UPoLcF+2bFnsErMHKRvihfvQa+Dxyh7HveMnzDOzE+Itfpir4DsRvX0QuWwHZeNDlw2O\/kG\nM8c3Uosq55d49cISP8jxMLOglubgUdgxAawsFp5Bv8BDR7ieaSffPrXEy0Yd\/DXWivL749I6jX6D\nl8DhnLuT8yI30EQPNXGoGHHgH6ODL6VuL6PjMpMDV012\/hqr9AGdp6gctfNVDzi+aoxD9UMOwnEn\naiY4iMY4vnbCyYuNdr6UARuGTCaJ9v5nXgHZm8lHzCo3cM7uHDQPG2ZuHDjySJSe\/ahOkGOu35dn\nbtpfYG7JLbK0FRyyKA8csXQUHbN0HS623j163Ko6dsKqKT5pHfj+tHXozLkJQ41E4wmU6owqr2cx\nA0qb5KaKtEyTeH\/hvKHlJljcPH4SZVtDUBEYBmFQOMShkbixMxqNu+LQsjsebdGJUMaloCMhHXeS\nBVClZEKTno0BQS50WfkYzC6Eak\/qVN\/pcypJv2HCpzxYeaUKFz\/fiOvxKXADe0pKCRiMawSsJmDt\nCjDWBZQRsJ2At13ADBew7yXg3a2h6NoSglrNsMwnoFAoRcWXW9FEFZlaZSvAKy7gDlQRUPQc2EDA\nZgLeJKDiObCL7utJ2Qc1AfsJOJCZB01WAVq\/3g7hhi3+AYrpYXcy9mNGocRCewceXxdhPC4NhtgU\nqAkzEJeKgT3p6CdQf2IGtEkZ0CTvg4a1XFoWde9+9GXkoIeAnYIcKOi8iF668ovNfgC2KkcYsCtx\n7wtAW4IAT1KysZiegyVBATiKx4J82CgsgjyMUYxk5ELPWo1+NfTrBsrpRRjwenQSA5b4BGRvyICK\n7eFvBDp\/+BlPTv36VmBP0VEoqTUZsIq63uskvRrQLBS9ArQf+g5LJVfBZR985xb0O\/DBH5dWB1YI\nweUfXTNQe\/YCGqP2+B+oTUx3AefLKv0yBv0OVFMqGacWmyz61i\/A6uKT\/geORCXCTCnGH0DhqbN+\nAgZFrAAtZ87BrriF2cxCr4GymCQ\/ArV6kTj30ApwNDULkwferYsH8w5By9Zfiq7sAjRuC3MBay6V\ngu2YfAKKNfpQcXkN2sJjve5iXVahC9hNGwcFrTzSjYEQxSajtlNtk+ruf+Lzh5O435Ag6ep70Jl\/\nGJ0hkbgbFr0qUEOVjtASt1oXt8WnoW5TEJopJMdPu5Y4rzeqr\/vsrOtS92qyDuDfbTvwKDZtGZhz\nEEuUA83JmagLDocsIuYVYDehS77aCvmWUDQcPg5Jv\/58wPsoLYNjH9crum1jMSm4syN6GbivAEu0\nirwJKKShoaTtlYyGB7WaJOB9FsmAvkB76jeM7E6GiaCuLi4qxmxajgvYERX\/AlAZn4pWAnbSxGi4\nXA6\/jLm3fCt\/2F4tnWdjsINa0XMMMmAvjUNPYD0tabd27F4GdvaWB6xH+ffmbZkbOE1d6wbWh0RA\nS3tDT2DVziiogiNxKybZ95y35m7uN5xgwCEaU0batLqBChp\/nrNYTRvT1tgkqALDocgsgF9n7Zs\/\npoaTRr75EWOUD9WR8a8FymnF6KatPwO2\/PI72CRbJ6B+AwOyWawM2\/1aoDQiFveSBCvAgPUqTTrD\np4M\/nX8rsC48GkMJe13A+hqpbd2AbCar\/yxdE3AwZrmLG8uqZf8LsCU4YhlIyfpl4PXQXSvA+trG\ndQV+4AbeoI93F5CS9cvAK0E7V4A+f16+a+m58JfmIc3isk2B0FGq0VH+K98Wgj6PPOgGtm8ORv2A\n8eK6AinpthtEdVAcPIo2WsokoZG4GhiKRmpFRUwC5JT\/pFFx6MorgqX99volaQ9gG96hrDuQ7bQN\nk7Y14dh1Pu+cvdkfskrZ3wrqMbNtyDKN1YKdZxteb+v5D2DAdLzzKYRMAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fruity_juice-1334340677.swf",
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

log.info("fruity_juice.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
