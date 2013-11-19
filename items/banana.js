//#include include/food.js, include/takeable.js

var label = "Banana";
var version = "1345744788";
var name_single = "Banana";
var name_plural = "Bananas";
var article = "a";
var description = "A bright yellow, potassium-rich banana.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 10;
var input_for = [13,56,57,60,86,104];
var parent_classes = ["banana", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "fruits",	// defined by takeable (overridden by banana)
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

verbs.caress = { // defined by banana
	"name"				: "caress",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "If you treat the banana well, it may improve your mood",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.stats.level <= 10){
			if (is_chance(0.3333)) {
				self_msgs.push("Oops, you squashed it! You can't just go to town on a Banana like that; you have to be delicate.");
				this.apiDelete();
				failed = 1;
			} else {
				var val = pc.metabolics_add_mood(5 * msg.count);
				if (val){
					self_effects.push({
						"type"	: "metabolic_inc",
						"which"	: "mood",
						"value"	: val
					});
				}
				self_msgs.push("Feels so smooth!");
			}
		}

		if (pc.stats.level >= 11){
			self_msgs.push("You've matured beyond public banana fondling.");
			failed = 1;
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'caress', 'caressed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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
	"sort_on"			: 54,
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/265\/\" glitch=\"item|fruit_changing_machine\">Fruit Changing Machine<\/a>."]);
	return out;
}

var tags = [
	"food",
	"fruit"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-23,"w":42,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGDUlEQVR42s2YeUzTZxjHyeaWZdnC\nmGGKAwtCubEcgsdiijFGZRNEQVEnYCBTFx3ZNE40rhk4LfchDm9QrlJACorcFFDuSgWRUdpSpMBA\nZWxCAf\/67v2Vqwgz6gT6Jp\/\/P\/n+3ud5n+enoTHHx3\/fUi9\/b73M73013TTU7Zz00aGd8F4KiiP7\ntXE4WIOpVoIkOT4l5++ji4PHPsKhoPdYaiMXHG3KDDhuCApWoib2s96H7\/EF6iPIFdhpxpdby27c\nW4HLRctxNPJD+P74QahafWJupRUzs\/orUESl6eHIqY8FalcouTUOwkLBOvBKVyIkVgvHTnzKZl\/U\n0lQbwTLBSr+qBxtAkcRbBnbwQgQGasnCoz9Tj4quqbdgPHjoBIqq2vVITFmCkLPaCDpNCFzopRaS\nzQ83oeWRs5LiIltwkvQQcWYxYRFCz2jPv6S02Vkoa3FFG6G1aQvys+m4mUxDDHsJzrF1EM3+gjGv\ngp0tbvwukRs6RdshJ9SWrkLxLSKZYIALQbqIZevy51Wwp9Wd3yvegXFa6jajPMcEZbeNkXReH5eC\n9XAlVIc2b4LPJB78PokHxulo3IqqXHNU3jFDQRod10JoBD2XeRP8W7q7n4B+6S4lPc07UZtrSbBA\nDeF6mAFBf36eweE2J9qAdA\/GUXT9BnmDN+7nWUJAqCOiKdGGuHZWnzMvggMSd7+BNiJHIfPFSF8y\n5A8P4UH+ciX1eVbIjDVCYqjB\/BTKgHibbJDIUQx1nsQLIiiu2j4hSJF9wRgpoYZzLzgs3sxUELFx\nRnrCMdQbj8YC2ymCmb+TQjltcGVO5SC101RIdwiHZN9inBd91\/Gk9RQaiNQ4lCAn3AhJwYaBcyo4\nKN4YoSo33PEDEUyCuNqNJMiYoIZniVQieIWlv2nO5BQta10UbR5EbO8EIz0h6O84T6SsVWCgNMUc\nqRFGcNTX+GhukhM5MBTSbf1DMk+oMvIsAaJ7zkTKZoxRSV6sCRKCDPPm7t5JXFXkvJQMd\/2Cp5Ig\nZXGMMipZm7WcpEdHXIC+xxw05DU0hcRdqCqmpP0ABv+8jEcljiqCo+TFmZP2Qpc7amgsmOV2so45\nmpzXVDmZD0aeXIKownWaXG0Wg6RngrjT9AOzKjfUut5PId2J6XK+ePH0Mh4LD6Cx0G6SglFuXTRD\nYjC9elbfWIXERfjyfRvFm1RtGLqafiJSK6ZRyrFCcqjxwDl\/fdNZeLrWMhXS7XGKtt1jLcRzxuTk\nDQfHhOynIMixRVq0KWnM9KPvrnW0fcMYkG5lDZIiULTtGmu+M8g9Pozh3ktoF+x5Sc5hDHvwLlgg\nOcwk4a1ERPXGDHmjPbOnZYtLn9SD1S\/ZVf5c6qGcRAbH3tPJ12HvtFYy0BkOcYWTipzDFPLiSVuJ\nNBdyLy57\/b24uEKHVnffmtXcyJS1\/7EF3WR3eCrZib+I2D9kyBwflaYK7p0UJG1kuCcSvS0n0FSy\naobkVip5Yzn2d3aavEKriGohs\/9h09dobXbGY9E2dLe6TxMcnFHQU5nac3k4WitdR6tTWakrZpBj\ngBNpwX+j5AJ81mRmZjuirmETKEFxs8trCpIK7Q7AYFc0ZAIvld42syCVHCfSPO6N5KjD8l4tDz+5\nGtX1G\/DKBNsPQkEuv0L+M4a7g\/BEdBRtNVvH3lKb\/xQU5tkj56oV+axmEW9VEL8esi2LubYYCVwd\nZGaZoCjXCnV3mWiu3QixwAntDZ7oaPBCV+M+ktQOiCqdyfxmPTYmWc8gaDshWM61xs3z5uBEmfm9\ndesISfqEFZvyOa5zFyMtQxe3efoozDZCKdlVqXWQ2raopUZ18qUGzMlZbrqgMNcWBTeo1EyEGTFm\n\/3\/PjUnS4sdzF4FLBLN5NBRkG4J\/m457d0yVgtTGJSRLzasFbYiYDZnryPITYypLjTJ+t+vj1VTt\nCE76l+Bl0pBPBEuI4N0cU1STxZoSrFcRnCppjYp0S+VEkhZlIkwNN\/bispfNzn+\/xAwdWkqSLjsr\nnZZTkGVUls+lozjdBKXppribYYbKmxYTlCSaoSjBlE+mYFZquKEXJ8z4nf74+RcZiRE63uKwMgAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/banana-1334193782.swf",
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
	"food",
	"fruit"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "caress",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("banana.js LOADED");

// generated ok 2012-08-23 10:59:48 by martlume
