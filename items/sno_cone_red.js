//#include include/food.js, include/takeable.js

var label = "Red Sno Cone";
var version = "1354593556";
var name_single = "Red Sno Cone";
var name_plural = "Red Sno Cones";
var article = "a";
var description = "A tongue-tingling spine-shiveringly Red Sno Cone. A seamless blend of Ice, Hooch, and a secret blend of elemental additives, preservatives, iMG and raw energy that make you feel slightly, though not to any copyright-infringing extent, like you may have wings.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 600;
var input_for = [319];
var parent_classes = ["sno_cone_red", "sno_cone_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"eat_min_level"	: "8",	// defined by sno_cone_base (overridden by sno_cone_red)
	"eat_xp"	: "300"	// defined by sno_cone_base (overridden by sno_cone_red)
};

var instancePropsDef = {};

var verbs = {};

verbs.bemoan = { // defined by sno_cone_red
	"name"				: "bemoan",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Grieve, for you cannot eat it",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		//if (pc.achievements_get_daily_group_sum('sno_cones_bemoaned')) return {state:'disabled', reason: "You bemoaned a Sno Cone once already today. Any more isn't very ice"};

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Grrr. Pffft. A dropped sno cone is a painful thing to behold.");
		// effect does nothing in dry run: player/xp_give
		if (this.parent_verb_sno_cone_base_bemoan_effects){
			sub_effects.push(this.parent_verb_sno_cone_base_bemoan_effects(pc));
		}
		// effect does nothing in dry run: player/custom

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

		self_msgs.push("Grrr. Pffft. A dropped sno cone is a painful thing to behold.");
		var context = {'class_id':this.class_tsid, 'verb':'bemoan'};
		var val = pc.stats_add_xp(150 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		if (this.parent_verb_sno_cone_base_bemoan){
			var success = this.parent_verb_sno_cone_base_bemoan(pc, msg);
			failed = success ? 0 : 1;
		}
		pc.achievements_increment_daily('sno_cones_bemoaned', this.class_tsid, msg.count);

		var pre_msg = this.buildVerbMessage(msg.count, 'bemoan', 'bemoaned the loss of', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.pickup = { // defined by sno_cone_base
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "You saved it!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.houses_is_at_home()) return {state:'enabled'};
		return {state:'disabled', reason: "You can't unscramble an egg. And once you drop a sno cone, you're out of luck."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.takeable_pickup(pc, msg);
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

verbs.drop = { // defined by sno_cone_base
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Think for a sec: drop a sno cone?",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_food_drop){
			if (this.parent_verb_food_drop(pc, msg)){
				this.apiSetTimer('onMelt', 30 * 60 * 1000); // 30 minutes

				return true;
			}
		}

		return false;
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

verbs.eat = { // defined by sno_cone_base
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Gives some iMG",
	"get_tooltip"			: function(pc, verb, effects){

		var eaten = pc.achievements_get_daily_group_sum('sno_cones_eaten');
		if (eaten > 3) return "Careful! Eating this might freeze your brain, which will cost you all your mood!"

		return verb.tooltip;
	},
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.stats.level >= intval(this.classProps.eat_min_level)){
			var brain_froze = false;

			pc.achievements_increment_daily('sno_cones_eaten', this.class_tsid, msg.count);
			var eaten = pc.achievements_get_daily_group_sum('sno_cones_eaten');
			if (eaten == 3){
				self_msgs.push("This Sno Cone almost gave you a Brain Freeze! I would consider carefully before eating another one today.");
			}
			else if (eaten > 3){
				if (is_chance(0.5)){
					brain_froze = true;
					self_msgs.push("Aiiiiiii! Can't… feel… my brain?!? Brain freeze!");
					pc.achievements_increment("brain", "frozen", 1);

					var val = pc.metabolics_set_mood(0);
					if (val){
						self_effects.push({
							"type"	: "metabolic_dec",
							"which"	: "mood",
							"value"	: val
						});
				}
					}
				else{
					self_msgs.push("Huh! No brain freeze! Lucky!");
				}
			}
			
			if (!brain_froze){
				var context = {'class_id':this.class_tsid, 'verb':'eat'};
				var val = pc.stats_add_xp(intval(this.classProps.eat_xp) * msg.count, false, context);

				if (val){
					self_effects.push({
						"type"	: "xp_give",
						"which"	: "",
						"value"	: val
					});
				}
				else {
					self_msgs.push("You gain 0 iMG due to low mood. Unlucky!");
				} 
			}

			this.apiDelete();
		}
		else{
			self_msgs.push("You must be at least level "+this.classProps.eat_min_level+" to eat this sno cone.");
			failed = 1;
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'eat', 'ate', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_sno_cone_base_bemoan(pc, msg, suppress_activity){
	this.apiDelete();

	return true;
};

function parent_verb_sno_cone_base_bemoan_effects(pc){
	// no effects code in this parent
};

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_pickup(pc, msg, suppress_activity){
	return this.takeable_pickup(pc, msg);
};

function parent_verb_takeable_pickup_effects(pc){
	// no effects code in this parent
};

function parent_verb_food_pickup(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_pickup(pc, msg, suppress_activity);
};

function parent_verb_food_pickup_effects(pc){
	return this.parent_verb_takeable_pickup_effects(pc);
};

function parent_verb_food_drop(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_drop(pc, msg, suppress_activity);
};

function parent_verb_food_drop_effects(pc){
	return this.parent_verb_takeable_drop_effects(pc);
};

function onMelt(){ // defined by sno_cone_base
	this.apiDelete();
}

function onPickup(pc, msg){ // defined by sno_cone_base
	this.apiCancelTimer('onMelt');
}

function getDescExtras(pc){
	var out = [];
	if (pc && (pc.stats_get_level() < 8)) out.push([1, "You must be at least level 8 to eat this Sno Cone."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> or purchased from a <a href=\"\/items\/310\/\" glitch=\"item|npc_sno_cone_vending_machine\">Sno Cone Vendor<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && !(pc.skills_has("blending_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/67\/\" glitch=\"skill|blending_2\">Blending II<\/a>."]);
	return out;
}

var tags = [
	"snocone",
	"no_rube",
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-42,"w":43,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIHklEQVR42s3YCVNTZxcHcL4BH8GP\n4AfownTfaztTu9jWuCDuRWndC0E2QZFAoWCddmjfVysD4gIBRZAIskgIBAIJ2TeWJITkQkhIQem\/\n51wJJUaoVbQ+M2duchPu\/T3nPMsNcXFP2ML5+WvCBQUJfxQUJIdlMumMTKZ4MPgz5ObGxz3LxhgK\nzJw+jVB+PubOncOfdXXicfrkSQRPnVoM\/jx0+rTA0GeDy8+XMATXr4vxp1yOyZwc3K2qEt8HCgow\nmZ0tnuOYOnEC\/oX3BJY91WwGCRf+5ZdF2OyFC5gm0BRj6BhBz5SXYyI9Hb7jx+FKTYXjyBE4KdxS\nKUPVwdzctauOm87Lkwby8iBwVqi8ExkZ8KalwZ+ZiSCddx87htmKChE4T3h+7\/n+e9gPHID1u+9g\npaP90CEMHz0Kf1aWjcfv6sBOnkygktkCVCqUlopZCdHYmi8pEd\/PFRYiROPOTTf20GfCDz+IWRs9\neFAM8759MFGY9++H5dtvRayDoL6MDGE6JyfhiXCUMQnfnMeUl8rDGXERhGEPBmUEdoJEwkGgSBj2\n7oWewpicLGIZypnlzgqZmZLHw+XkSLh8jKOLwEMlGzt8GCN04btFRTFAP93Msns3zBSWhbDu2QMr\nwWwEY7SNM0lh+OYbmAjuoUzzWH0sJJf1XnFxFGKWxp6PLminGw5TFhg7wmUjiCEpKSaM27fDtGMH\nzDt33gcvYC0MTkkROzxMw8B56JBA2EefONwj7lmQyhsZa0vDTTOSb67ftg1DW7dCt2ULtJs3xwSf\n58\/1iYmLWIbaOIOE1RJcx50jsOPgQfUj4fy0To1LpTaehaM862hQc3kYFaSJwmPSQ69F1KZN0O3a\nBSNl0UgZMVDo6WZayp7mq6+g+fpr9GzYAM3Gjein6KLXgwQ2EWyAOqeh72kJzUjOpDc19Z8nzVR2\ntpRnZiRbY7ScOGmCcO85Y3o6GnngE2SIMjFA2dFRNji0C9FP2ev99FN0rV+Phg8\/RPPHH4vYQYlE\n7BhnVEfX6qPXg4Ts40oQ0pKWLlsRd7ZVlzCcflxwUYameObSIOaSiOWki5ooUzaaMFYqv5nWQBN9\nPkQZVhGmlwAcqs8\/h5JAHLcJd+3dd3Ht\/fehpvPqL75ANx27KZNcer6ukbLZRn\/XQfgruUXI+rXm\n4aUGIL0x6FQwLlJWC\/WKL8IX495zqXjcGGhwG2kIGOi7GupA5wcfoIMQYrz3nni89c47kL\/5JuRv\nvYW6t99G\/QKUM9r40Udo\/eQTtH32GW4TupWijYZEs+wMzjT1Jy8HjL83Py+EHE64aa\/lmWmkckZw\n\/V9+KWZBRWXj7HTTRZWUOca0EeA2QVoJ1PzGG6h95RVcffVVMWpefx21dC4C5Yw2UIdurFuHJrpO\n45ZE1B3PRWVVA8pvDwk\/qSzL79Xz8\/PJs3fvYWb2LiZHXaiTd+JaYTnu7Nx7H0e97qLec8ba6UaM\naqGb33rtNdwklDwhAZdefhnVFJfo9WWOCJah1AFG1mzYiIqUVJwtq8KvnSac7zTifx0GlLcbpP84\nSWbn7qoZOB2eQ487jCJ1ALKeSZyR9+N8yQWoCkug3JeCVoI20Y0bCCF\/6SVUv\/ACqh6Iiy++iKtb\nt+Nq4g7UHj8B+c\/nUa3oQ2mvDyfueJHWMorDjVYUtxjxW7t+5ewtAoG1EeDkzCx+HrgPzO\/2I69r\nAnKjHzZvAGbPJAwuAboxP9ROH8o09L3eSZyi7xV3j+OWwYVWwxgUQ6No0g2jYdCJeo0DtX12XOq1\no7DLJQIPNNqwR27Elmqt9JEXagLKIkDlWCgKeKprHAb3VBRwYMSHGoOwCOTslHUvD7zSa0N1jxVn\nO21iBvfUGoWkSsujPyfyhAnMzAkMdE3NoET9NzCncxxX9b4YYJ9zAqV9wiIws82NMuXoisCqbjMu\ndJkgU5ik\/\/7hNDwnYaAvGEaTbToKmNnuQd+IPwZ40zQRBeQSFncOrwy8Y7RVqiyP95Q9GfpDwcAR\nIYSinmhgmcoTA+yxe3FJ640CHm0eRmG7A3LCPQz4e5dZ8viP+LOzaxk4HpjBDctUFDD9tgtVg+Mx\nQKXVgwsaTxTwYKMd0psWVKhsUcBKpUn9xE\/UvuCMjIFOXxAlPb4oYCoB2qzeGGCnxY1zalcUMOW6\nBXvrTMi6acLvSssC0JbwxEA\/TZjxqZDgngyh0zkVA0xvGUaLeTwG2G5yoaJvFGmKaODOGj22XdYi\nuWagfNV+MHkCYQkDR\/xBVGh9UcBjBMhscaLNMh4D5GWmRjOCtOZoYOLlwX+3rDxKc08GFQx0+qZR\nohqPAh5uciBdYUej3h0D5GXmGs3g\/FbrkgzqVv9HvD8cXhMB8kKd3R4NPHDDhkM3rKjuH4kBRpaZ\n\/yttOFBvUDy1H+6jQkjKQN7qlA5\/DDDluhXJ9WZkNFvQoB2NAdb124VGi\/\/p\/WfB70e8YyJgi+zF\n9XrvQ4G8t3IpS9qsBFu6UA8nxD3t5hQC64yevx8Waoc8ywKTruiQXKtD+R2GOmXP7L9bdebA5aV7\n8RWte1lg4qVBbLqoEdav9qxdqf1kQfzFIb+wdKurHnAtC9xcpVkX96xbvkqQnB\/wRm11lf1jscDq\nQVncf9VyOjyX6\/TRW13t4Cj210eAWlvSsyztgy1X5Y\/PahsTzve5ora6OlpijjYYsb3WsDbuv26l\nSm9CqsKJ33pGHtzqpHHPSzvS5JDwXvtjh10Edphd6rjnrWXfspfvrjUgu9kktFv9a+Kex7arRl++\ndRUfBP4CJhEB\/DCOCYYAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1262849296-6014.swf",
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
	"snocone",
	"no_rube",
	"food"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "bemoan"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"t"	: "eat",
	"o"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("sno_cone_red.js LOADED");

// generated ok 2012-12-03 19:59:16 by martlume
