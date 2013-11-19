//#include include/food.js, include/takeable.js

var label = "Saffron";
var version = "1354597529";
var name_single = "Saffron";
var name_plural = "Saffron";
var article = "a";
var description = "Some tendrils of bitter saffron.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 12;
var input_for = [40,324,328];
var parent_classes = ["saffron", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by saffron)
	"energy_factor"	: "0.1"	// defined by food (overridden by saffron)
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

verbs.love = { // defined by saffron
	"name"				: "love",
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
		if (pc.metabolics_get_energy() <= 2) {
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

		self_msgs.push("Awww. The saffron loves you back.");
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		var val = 2;
		self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
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

		self_msgs.push("Awww. The saffron loves you back.");
		var val = pc.metabolics_lose_energy(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var val = pc.metabolics_add_mood(2);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'love', 'loved', failed, self_msgs, self_effects, they_effects);
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
		'position': {"x":-17,"y":-11,"w":34,"h":11},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEbUlEQVR42u1Wa08cZRg9tdZWwVDS\nVqJAF4FCuS4UikCqo7VqNMZtq6kp1Sxem1hh8BY\/zk\/YnzA\/Yb4qiG\/ZllquU7kuLPBSbi2lMNyx\nJeb1DAtiFROTpn6ak5zs5J3JzHmfc57nXcCDBw8ePHjw4MEDMfMVNJe3amL8Xz6qSpCgKqCtV8K4\nR66Vw1h6AfoS1+Yq4XOfcb6G\/04dxHQdLNK4VQtjUoc5WQs1XgNr6B0Ee4oQ6iqCuFEESapOsjUH\nKvwcnIanYP4A+B9a7DpFrZHL5QjOlcGZLoO6\/SbEDIVMvQfnZikMucnhYzCiFQiNvAslP4JyRYUT\nIcQTsH7eC9kI+Dpz4GsrQKClANYvhTD+kwiZDZ0MDKcj4a\/rEyfgn34LxvzbsFaqYK1dgrn8MezZ\nGsg7L1HgcTjjpZCjpRDD5FAJxEAJrN5cBFqzuP4lbFK0ZbCCBRC\/FiG49e52fus6RV4thAznw27K\nh7hMirztZ\/7ECHcls2BM5EHMcdej2ZCRNIgoXzxFe\/p43ZMGe\/I85MRp2Eu0cLUW+sxx5o6cZPUo\n1BiiiBEKtVNgtxyMVSfyIszoOVjyC1aY7DoFq83P+37I624l8+APFyBEgbJpJ3H\/yB\/tvF8JuVoB\na7Ec0s3cwjfQ57+FcHNnH0Kw4xDMhYvQnc9gdSQxZ6kQpHUjFSY3EuzLhj3gh4oUQ\/byt\/MIRAdp\ns1LteVAtaTBaChGkQNMVOPw5EiIfItTyMkTrazBHLsVyDnUBwfUqmPerYd\/TIH6rgFihqOUKqBVe\nr77BalXDWTwLNX8CtsNmuVuGYCQD5nA2m0Hj+qe0uRzmYBacwVyKIrszoLoyWfl86P3MZW8RDNfe\n1jToV+MhwmyQLZt7A7AGPoDdnLMpaseqfY+ExWrmqwpynmLuvg975gLssVchu5NjnTaciISbuTDG\naKNkJ44VwuzPpO2n+PwnUG1JUPy4uhIH1fQk1OV9EI17IH56HFbDYwi5DbIhCkjgfZ33zbEamKPM\ntSuUFuthZrdxP3zsbn2nRglsMBPa0BHog5nMYDp379qXvJFJfZyWRNOg9SRzhKQg1JsCI5IJZ\/Ik\nK1kHufTdznOwHtDqd8HuLIDG7Fm0VkTOw+k5w9xlwW6M29iIqN8N8eMuiH8dP2pzxs1xR67YGVqz\nUMYZ54czehTKFdvvZiwlJqT\/MILdKXBGnodv\/HWYsxehmFNj6uy2XX3F8G3Yy66+lgHR\/Qr8E7Ww\nx2tjTcQG0di9qvFZhNyNNODBSfKgQI6V3zmY545BzpJrvGYmDf76upIQ6HwGTvtBBnl\/TGDvYUg7\nCVY4Hlp4H7S2VDpwBvYUZ+D4OajoSVjd3GRXMbRmVjt6GhaHufXQJ85GBY9yLPxtLrYzh+0HWI0D\nEBSqWhPhND8N80o8DAY\/4Ips2gtd7EHILoIjOchHKHSsGvI2TxyeNsFHcvRtCtbcfEbJSDpMzkZn\nIHk7Ky1x8F\/brOQWG3Yj4P1b8eDBgwcPHjw8EvwBR9Mv39M+JK8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/saffron-1334276466.swf",
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
	"o"	: "love"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"o"	: "love"
};

log.info("saffron.js LOADED");

// generated ok 2012-12-03 21:05:29 by martlume
