//#include include/food.js, include/takeable.js

var label = "Tiny Bubble";
var version = "1354601464";
var name_single = "Tiny Bubble";
var name_plural = "Tiny Bubbles";
var article = "a";
var description = "An eeny-weeny, fizzy-wizzy tiny bubble.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 10;
var input_for = [31,61,70,72,79,199,224,244,309,312];
var parent_classes = ["tiny_bubble", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "bubbles",	// defined by takeable (overridden by tiny_bubble)
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
	out.push([2, "This can be made with a <a href=\"\/items\/263\/\" glitch=\"item|bubble_tuner\">Bubble Tuner<\/a>."]);
	return out;
}

var tags = [
	"bubble",
	"gassesbubbles"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-4,"y":-10,"w":11,"h":11},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEfElEQVR42u2Yu3MbVRSHXdO7T52e\nhoqGhj5NKv4DKhoaeiqaNDQGHEMGDB4CMcGB2LGdB8ax4+gRObbeb631WHn1WFnM4Xyrvcoi4oGR\nrCSF7swZeW3N3e\/+fuece6\/n5mZjNmZjNuZE5C2NyxpXRuJdjUuvDax7dvZerd37\/LDazG1lK+56\nqiyjsVes1QvN9o7d632osPOvSrH5stNZ2s5YzjfhlCwcJP4zfjkuSOzEDtfa7tWpwrV78s5BuZb8\nLpr5F8QXGouhpFxX6K+eJl8Kup4uuzm7dY20mIZyl\/aK1coo1I1oWlZiWfn5KC+rx3lPrVv6883n\nOVl+lpGvI\/9UmcU1uu6nFw6HRYuqzFIo5UEQPyrEWrwoG5pv25mK3M9a8kCDz019vpssed\/7QReA\nukPL4wW33et\/dGGA+dPOAvnG6t1+X8zYSJflYc6S3WJVnpTr8pSo1OVAP\/dLNfmzUPVgAUXRpUDO\n6kIqVP+FVCsrZtKjanMIV3I6HgAwEatBEchz\/TtxWLXlmT6HKw0P\/FH+xKtqIK8HIDON1q2JARMN\nZ91M6Pb\/8uDqHddTKKQAhwoSrzUlWT+VVGMQ\/JzQONLfA3rgQ6Ik+Wrmux0vOPTLSXLv7TvJkmsm\njFq2FE7b8liVC6mVKAVIuuFIxnYka7ck12x5nzwDG\/chURK7FUpuRNJDSHrp2IA0WNNSsIYq3c5W\nvJfxUgMHFODByHugA8hjhQxrGpCrWB1UMWLZ+2O3HavdXTETARFRS7EKa8lHXo5ao3BBSJTE8piv\nItVOSzK9cjNj5XBqPMBWJ2IA7ySKsqVViwoUhVEvH1CvGAjzOxbGQigeKpyqx2YqmrZ1L12imq9M\nDEgvo989LtaG9qLOy+BGAVkINod8B+idNPEvdd6pAEZ9Bf8vYEoBj0YAf1KbFyYG7HQXDCArpk3Q\n+7CY6jzP4mAekqNDizUHH2Cx7i6rGsy7lakkx27YVLGpOFoDK3+YO\/FyiReS\/NmAiucVCWqTFvRO\ntsBfNQdXfQVjlh0Zu4qprt8SJYeJqDqqjxfslQY2oyL2AZkfaTW5QAWzGOzdUfVxgVZj2tdEfZAR\nr5+Ggzb\/ri9ARXaHmL+LYOGLZj345Bk42hEpwaJoMRtpAEvBneT9iQCdXu+DlcOsa1RkP6VYdvID\nSKwDAhuT9RfbHODsNMBhLaecDQV7pIszB92Y1bg\/8dmQCdiPF\/3GyvkOq4GkIs2eHPUPDATQgFEU\nVD1bnBaDwlmy7FtL6kysXgDysipWoW9xHgQSJbEb2\/5QUECAZbfY849aNOWtjB7JFJDvkCLm0Fpt\ndz+78EsSJ2qU\/F5fdNM\/rN7T3QXbsHxfIbH9iQLqhUl281XZVdBNhTS2av9ztRV9O7VjPydrFEBN\nQGm4txWUrfCu5hiBsmv6TK9bDtxfuJM03bOPp36r4xDBMWzxnMvRaLAgrqdTv9UFh9uXq3rnXVN7\nHe4dNPTRoN9pD0xySXptl3gKiFZkd3vXglF3zz7x\/7swPzcbszEbs\/Fmjr8BJFYNU8O7d9wAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-02\/1265433979-5957.swf",
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
	"bubble",
	"gassesbubbles"
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

log.info("tiny_bubble.js LOADED");

// generated ok 2012-12-03 22:11:04 by martlume
