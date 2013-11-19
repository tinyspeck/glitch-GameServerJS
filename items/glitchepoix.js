//#include include/food.js, include/takeable.js

var label = "Glitchepoix";
var version = "1354649221";
var name_single = "Glitchepoix";
var name_plural = "Glitchepoixes";
var article = "a";
var description = "Combination of vegetables known as the holy quadrinity of the Glitchean cuisine.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 45;
var input_for = [30,35,38,332];
var parent_classes = ["glitchepoix", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	return out;
}

var tags = [
	"newfood",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-35,"w":28,"h":34},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH6UlEQVR42s2Y+1OTZxbH\/S\/UqhDk\nlhuEBAIJ14RwLVAKShQEw10uSgpECNdQLgqFQr0guIioaJWtI9aqZdqtrLpTsLNbd91KZ3fbdXe6\nO93LD21nf9uZne++58H39U0kkNe6M5uZ7wSSJ8\/zec9zznnOczZtWuf1q4mMxcfT2ZK0Mp019uVM\ntkuKph3Rrk0v8rp1xISlE2mS9Nl4Oj49noa7YymCFt+2YGHQLOhGXxLmexOZrroS0LRbjo4ihb8k\nuIsdsf5iwF8cS8WdEQs+fisZ9DmJJifNtsUKOtdqxGRjNE4cisJorQ5DVRHoLwtH5z4V2ovWVlnG\nTrQVypMkAV5oMyZ5s+DPR91BSTf6kwTgua54N2ixCP6UXc\/ghw9oGXxlZiAqMgJtkgAnD2o1NMn\/\nUgMVGmbBPSZ\/Tn52yT7I\/fg7msBVomZPKlVdxWp0cFvbulfJ\/KwhLxR1rwWj6tWgp1DPVGDeLm2L\nJxv19jOOGLZl3rbyx4i2u7lAIYZclAQ46zQuUlBIjWJfRA96mvNFsQWtJv\/v\/i8AaU6y3jt1kZ6A\nDyUDvmy4e1xOvNQe+xxgofkFt5if+PVyNVwj2nXVPaRFhyvSTQ0NOjib9IKGHdFCuqFUZEvbyeAo\niCoyA+d\/FODKUiL+vjziVd8uD+Cb5SZBT5aq8NXSXkH0++oqjQBIwda4S46anOCnCVs588KABxwa\ntsD3D95dV\/MnOmHNNDNV7M7Eg7kR4TtPwIVBEwbKw3HYqmCAbYUqaVt8pSteANxtV+LLpRSvYN\/c\nmcbPzvZDp1Ui2RnLFJGqYqD8mFvvG90APxoyY4Q7SfjjTjIg5SoxIG2TNziNQo5QVSBMLQbknU9n\nypmwIDg4APFREcySP52LeQ5wnDuvXwqgrUXtFZC2NcykQM5PUlbBuPe0kURYjsTBMhAHlSEEQ46K\nNQHPcgfBSwGkKPUGSFurig1F7nQqsictDMzcbYSxSgdtlopZkcZ4At7mkvULA862Rmt4wE+4ymU9\nwM7aIkTlhiPrVDKSnDFIaNRDoQtGZqIRp7rrsfLBOBvnCUhRLAakc19SqXXtzVXAmd4EBvjnpfo1\nASkQIvPDmMXIWuSP9D\/5Hn03O9QsBMn+UrVXQMceBXwvVtsMNr4WJEB6esptawESAEEF+suY1Qjs\nRFkg+rK2oiJ+G+z784U0s6dIuSZgcU4QZPotkJADY10bAZJf0eIEZjCFwJSlgFK5E0fzZPhnXwCu\nl21hkLvSk\/D4g5NrAk42RcOQtAPy+K2w1wbBnL1N4xNgdWW4S5EfBF5iQEorZCkCS7eqMPixCROP\nUtF7Kw77u3SIV8nwx04Zlhq2Y8q6GcmGKJZmCNBkDWV+SDpUr0Vo4nZk5fuhvyUUIx0KjLb5WPZP\ndGkWLx2PwEcXo9E3oGGAD26UMauR4xMc6c3riQyOVDeuQ9+HCdAZA5kVv+7wx2zRZjaOB2zsCHOT\ns3EVjNdwR2iuT4DHXCoBkCYiwM5mjQDGq8SpY6oZiUKxSw3nlVi8fkgBTbAMj1pkuGrbAkvYDtyc\n6MZv72az+XjdPBvlBkd6u13u8hXwoSfgqcEklnBJBHewIBJD9nSMtlpRlhsFuTwAtp5IlB5Vw5gW\nhIYUGe7Vb0OWdgdmjjTi0WIeLp+OFAA\/PK93g6NtDjJu9q2iOdkdhqmhMDdA3gcprxnDA\/H7y7n4\nx0Il8Ltz+PdvjmGmMwUhnOWKe1TY265kf79X7scimQe8fSnazYpiuEjzK8iM3\/HENwv2KEG6MKYR\nAP+y7GSAFLnjbxjww\/12\/GdlCj\/cczDQR2czkB6rQGphCAMM1+1EgUEGR+p2tFRaGeDdq4bnAAlO\nY3oFaSa\/1QLWvEEk04XdUsKdBKXBKKkNhdkWItSCBEjb+9W1A\/jX8lF8f7cZ376\/i+nry9nYbVEz\ny9EY66tmFsHkgzzgtQt6N8DeVjl0lm2wZgWiJCXAt9sdnSJjrQaW\/8a749yK1b\/dP88W\/8OVAnw+\nacbjM4n401wWA\/zrfB5yExUoy8\/AnXMDLHLnxlrZeB6wuk2NnGq5IFUmB8Ql6Wd3Yx8BxR0FHnBl\nwcUWjYkIw3BNBL6YSsCnx4z49WQ8VjjQT4YNDIagaByvnoPFeOtwBQMsbVCiMDcYDbYwHHcaUJ4f\nwroKfPvDJ0DxKSIG\/OV1J1uQHF7NnbnHD2rxbrseM4cjcaZZh3bukk7wYjixHi5UobJBhe79YUK5\nRSU\/QdG7nbvUSwakK2JmidINkIfMNse5iXyOPl8PsKdfgyMVEazBROUWD0jy2Qd5QP6KmL5PwQA\/\nv13LIEmfXe31CrIeIFVFBEgNpFsDSW6APvsgD8i3JwhQfL0cn4piacdTN+cTmZ950xf309nve2zh\nGOXuxO91x68JmJ+81X\/D2xxVGp5tsxGuEO23R6GOO+j3lahYZSLWLu5B0p\/KmBfkVU0FCgZ4kdud\ntQB9um7yt\/+XIb6hOcZBjYo01RyD3tJw6YDThw2LUiEm3ljtqBIIdcS4OXCaq\/VONujdoDxFgbLP\nIhMDbnzUtRUq5ye5BWmB807jhtYZt3uHGK7RMZ9rof4gt7VitXG570pnHN6p04kaSH4bVzOj9ZG2\n2tdC2ARD1dp1LeCpo5URApCd8y+aZz05rErMdcWxpia13zYMkGedVbW9Jid40Zs2WliKHHuUTwar\nIubL0wLWLBL+C1B92WOIUzecAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/glitchepoix-1354153662.swf",
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
	"newfood",
	"food",
	"foodbonus"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("glitchepoix.js LOADED");

// generated ok 2012-12-04 11:27:01 by martlume
