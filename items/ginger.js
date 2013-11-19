//#include include/food.js, include/takeable.js

var label = "Ginger";
var version = "1354597650";
var name_single = "Ginger";
var name_plural = "Ginger";
var article = "a";
var description = "A nubbin of pungent ginger.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 4;
var input_for = [49,70,327];
var parent_classes = ["ginger", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by ginger)
	"energy_factor"	: "0.2"	// defined by food (overridden by ginger)
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

verbs.sniff = { // defined by ginger
	"name"				: "sniff",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Examine the spice",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('spice_examiner')) return {state:null};
		if (pc.metabolics_get_energy() <= 3) {
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

		self_msgs.push("Ah, sweetly aromatic ginger. Tickly to the nose, soothing to the senses.");
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		var val = 3;
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

		self_msgs.push("Ah, sweetly aromatic ginger. Tickly to the nose, soothing to the senses.");
		var val = pc.metabolics_add_mood(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_energy(3);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'sniff', 'sniffed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

// global block from spice
this.is_spice = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_spicerack", 1))) out.push([2, "Spices are much easier to manage if you have a <a href=\"\/items\/271\/\" glitch=\"item|bag_spicerack\">Spice Rack<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/289\/\" glitch=\"item|spice_mill\">Spice Mill<\/a>."]);
	return out;
}

var tags = [
	"spice"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-14,"w":22,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIlUlEQVR42u1Y6VPT5xb2P3Du\/Xxn\nbEEoICEsEQTZxQWlggugEBJ2rRUQtWKtGsoiRNlFkM2AyL7vkIABFPVaLda6trVRqIoihCoY9H54\n7nlfl7n9TMDpzM3MGTM\/M8Mz55xnOb9Fi\/7\/+Rt9dH0BS2aVkpjXPUHqD6VTBimg8l38ycERmMw\/\nOwLwuHYTRqp9PtbzRl9Md4s1kx0BSz4JMNad6c7AYW3bNjxv9seMUgpdbzB0SgnYM03FRvxwyhX3\nS9c3fRKAzxq2qifatuPtYCT+M\/TVx9KppHjR7Id7ivX4pcwLfakrcDXHzWVhwTVukc6ogv8CjNUs\ngdUS6GeNfhit3YIHFd64mrsKzfG2ioXdO6VU\/fbizo\/A2PfX6nBoO8V4Uu+L\/uP2UB6zRZ\/cHtfy\n10Cx30q9oIxlY3yjDsNsXwhetPjhSd0WPKzywa\/lX+L3Sh\/0p63EpSxX3CxahwtZqzCQtUozWrNZ\n9qDCR3a3zEs2mOHmPX8AeyRSRoLHtZvxqHoTnhBbH9Vsxv2yDbie70Gds+NgX9CoxzvEGO8Mwli7\nGKPN23BL4YVLOR4o\/UaEeQP4vNlvWMe6d2EHZgYi8fJ8OCZ6pPjl7EbcKtlAzPUg0P6YVIVivCcY\nz7qkeNIehNFWMW6c2YDG+BUojLWcH4CzKon37GAEdIM7MN0fgT\/7wjiQ0aZtuFnsyfftRqEnHtb5\n4WmHBI\/bgjDSEoj71b4Yyl2NjmQHnD1gjdMxQs386J4qWPOauvaKCDHVG4YJZQj+aAnAjSJP\/PvU\nato3dxqhO67kevDv59Nc0J3iiLZEezQetUX5ASuc+tocubvM9L+DL7sCFdMEjI1U2xuKp22B+LVy\nE66fXktg3FAdJ4BK7sRH2JPqiE7qVsv3dqg7spyAWSJvtznSwky1GZEmUr13Ttu6TfGs6YO2+eBu\nqRd+oq79kLcGQ9nuaIkXoXyfGe9U4R4hCqKFyI8SUKfMkbXTDCfCTXA81EiRGmmgP29+0y0WvuoS\ny160bNMwbXtUvZlkZCNu06IPF6x7P0Y39J1wRu0hS1TFWaD2sAhZO5YhPYJAhZmo5cHGsuNhRjFp\nYZ8v0Qug94mkabLVX\/uoilzgpCux0h13zqzHvbIviQjr+Ugv5ZC2ZbhCSSNtT7JH\/WEbVB60RtEe\nC+qWKVKCjbVJAXoARZHIZbY\/TPF2IEL70UtJQiZJw8bIrkZI35i2dSUuxxAJ71UiQrPMhrolQCvt\nV2vCCtTTjuXvWorCKFOk0ShTQr5AksTQe85uwDo1ez70r0ZPXjrZEUh2tZXEdhN6SXRVKSugTnNE\nw2EhsZKNU4jSWBNUspF+J8K5OCsURpsiM9IEx4KNkRhkqJjzKF8rJVoWi1gxu5pVh+IVxSUSYfxB\nRPidiMBGei3Pg8sGG2ndt0LU0a7VHrJCUZQRSvea4+w3QhTvMefgkqXGSBAvHU71\/cfiOXXubsna\n4R\/z3PGhfiv3wniTP542+PKR\/nbOG7cVG0hw13Ftu8j0jIjQeFSEMzFfoIa6VrZfAMVeAfJ3m0HO\nR2qE+ECD4TjfObCU7duHzk13iXnivVNCC5\/lRJ1yh4ZGejHDCZ20b9fyVnMSNB62IqF14A7QcERE\nu2ZIwMxJRsyREfFhpEsRH2Agm5tFETvZvrEEwlLvTHcQtO0BYNp2+4wneilUMjJcpnH2yVdy+egm\nsW0i0a04KELJXia0AqRIDHjHUqmSpUZICDRUHNn+mcucRJY6pnjTH\/6RCDO9IRhr2IqhTEcqJ9I2\nbwykO6IjUYSBTHdyAntKGzYoiCFQUUKc3CXg2pZG8pEo\/hzJkqUaKpleZIRGOvy\/kXyGujje4o\/H\ndVtx4\/QaXDnpRo6wDv3priiIWkY6RoyMtcLpaEvyTAvkfEUEeA8uOciw6fuAz\/TnoTqVRMaCJQOo\now6+orGSK0BT6c2z231iKYtI7UlOUFA+yyFLOknWlB\/9vms7zckRTC\/TOOcnXL67TSV42RnID5np\nniA6ZDypc6swRrs3OxAO3UAEXveF8t+MVBN7i9dy8mhJCydoR8fpWntOvx1r9NUSy\/V7V8zQTTpF\nf2SGxXMKl7eIscP57pwcLDIxUWb\/TlHY\/LloDS5nO3OBnugK4omF1YNzPhjMopR83A29aW64ecZT\nf9fZROv2puekb1PUjQfnNhIAJy7CLykqsbDJMx2FzXs07oETDjRuLzylWM6iFKuH9f5oTXRE3VEH\n1B5hZY\/WJEf9BU1Vqs3iHrmrmnnqlRwXrnVjrQE8BU+xosA5UruVgLtgkFjMYtR4N920FNPZ\/dB3\ngjLe4RWo+u5dVR6y49WeuFK\/ee5h1ebM8\/J3OsdAjDaQndHNoKnZwu2sJ9kWl7JdcZ\/Gye4HDXXu\nR0osDFTFt3Y4d5CSMKs4W5yNW07P7fR7Qj6o9VjckSAaGy5Yizt0VbE8x44bHp3ohmiLt6YOOnNQ\nN+n\/WAhVyV1QdmA5L3aBsVLsJ6vbb4NSKr0zujTGyPnKyVWvrnPtc+eZjgG5kOFCdmZJOujMA8EQ\nFfNeJtYMTMk+VtYo3vuuikgjC6ItdfMiO+qMlSLlMXttPcWl\/nQX2jEnqFIdUHNQQP5rBzU9Y0cO\nS8jlcSIu2IUk3AV7LLmrnKZiGnlqt2D+XgZ1p9oKe5IdNL3HnSg6CSl8ilBxwBw1FKU6KBlXUhBl\n38vjbDgYZnV5URYEyoI7S+7XAnIXwfy+CGLs7kp2ULQl2PFUzIIni1FNMlsoYk1REm1MOc+auwkr\nAoRssrxs5iyRyzIX7B3LsRATadEeS23pPvLdnUtRHE0p+aAVnYhCKOhZ1s5l3Ie5F0eY6k6EmsgW\nLfQnQWwsTI80U6QEG2lTpIZ0GhojI9KMX2UEiocEeZhJFfvdJ32NG+v7r38mSgylyWIDGTsV5dSt\nJImxv17v2L\/b57\/cQLcyWVEDyQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2009-12\/1261531556-6041.swf",
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
	"spice"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"n"	: "sniff"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"n"	: "sniff"
};

log.info("ginger.js LOADED");

// generated ok 2012-12-03 21:07:30 by martlume
