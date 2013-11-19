//#include include/food.js, include/takeable.js

var label = "Hard Bubble";
var version = "1354594663";
var name_single = "Hard Bubble";
var name_plural = "Hard Bubbles";
var article = "a";
var description = "A deceptively hard bubble.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 15;
var input_for = [59,61,74,80,92,249,310,311];
var parent_classes = ["hard_bubble", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "bubbles",	// defined by takeable (overridden by hard_bubble)
	"energy_factor"	: "1"	// defined by food
};

var instancePropsDef = {};

var verbs = {};

verbs.pop = { // defined by hard_bubble
	"name"				: "pop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "You can learn something this way",
	"get_tooltip"			: function(pc, verb, effects){

		if (pc.stats.level >= 4){
			return "Popping bubbles is old hat";
		}

		return verb.tooltip;
	},
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		if (pc.stats.level <= 4){
			var val = 1;
			self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			// effect does nothing in dry run: player/xp_give
			self_msgs.push("Interesting. These bubbles are hard to pop, but you definitely seemed to learn a thing or two.");
			// effect does nothing in dry run: item/destroy
		}

		if (pc.stats.level >= 5){
			var val = 5;
			self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			self_msgs.push("Popping bubbles is fun, but you've already learned all you can from it.");
			var val = 5;
			self_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
			// effect does nothing in dry run: item/destroy
		}


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

		if (pc.stats.level <= 4){
			var val = pc.metabolics_lose_energy(1 * msg.count);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}
			var context = {'class_id':this.class_tsid, 'verb':'pop'};
			var val = pc.stats_add_xp(20 * msg.count, false, context);
			if (val){
				self_effects.push({
					"type"	: "xp_give",
					"which"	: "",
					"value"	: val
				});
			}
			self_msgs.push("Interesting. These bubbles are hard to pop, but you definitely seemed to learn a thing or two.");
			this.apiDelete();
		}

		if (pc.stats.level >= 5){
			var val = pc.metabolics_lose_energy(5 * msg.count);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}
			self_msgs.push("Popping bubbles is fun, but you've already learned all you can from it.");
			var val = pc.metabolics_add_mood(5 * msg.count);
			if (val){
				self_effects.push({
					"type"	: "metabolic_inc",
					"which"	: "mood",
					"value"	: val
				});
			}
			this.apiDelete();
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'pop', 'popped', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

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
		'position': {"x":-9,"y":-17,"w":17,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIw0lEQVR42rWYa1dUVRjH+QZ+BF\/0\nAXzRWpVWQqamppkWXiibgUkuDTgiildCKxUTGJCbODAgIJeRCS+YSuV4z0ghC7PCHEnNLGuWWqtW\nb56e\/95nn7PPmUHN7Kz1LDxnjmf\/5v9\/LvtMUtJDHt+2Zo37JrjYd6HR0zTU4ImcD6RHvqh3Rwa2\nuyNn61yR\/upFkTNVr0dOV7zmP12e5jtVmjY26f8+vg9ljrnUmuUbbsmODrdk0Xcc3zRn0tdNi4lB\n6auGDDq\/I50Gt7vpXK2LPq9eRGe2vU4MSSfLF9LR0gWRyJZ5rkcO9huDXWnP8Ufb34px0OX2HPp+\nVw5das2WkDsz6aKAfNMGebb2DWIl6dPK1+iUP42Oly2go1vn05GS1FhfySu+RwI30uV1jXR6o1dD\nufRDVy7xOfE5XemQoJfasmlYgxxiJb8MZNAX9el0ro5VrHmDPqtiFSulisdKF1Dk\/Xn08eZXqW\/j\n3MFD78wZ99BwP3Tl+a\/tzqPr3UvMwPnVUJ6AvcKgUBSQpt1BqOi5r4qflKTSR5tepYPvzon1bpjz\n721nEP+P4SV04wMf\/YToWSr+4hzXAaoglZKAvNgsrbapaOZiGp1ALsLmLfPoI1bx8Htz6cN35tDe\nDbNmPzhct9d1Iyyhbu5ZSr\/szTcD57hug2S7kZPDrdJqXcWBOlbxHjYf3viKANy\/fnZsf9HM+9t9\nLZw7DosDAkCxvvV090SFiDvHSulW7wr6eU++DXLEYbWei6bNVdLmk\/6FdFwBss19DMg2U++Gl6mn\naFZsW+aEx+5ZrbxgFFYC4vaREvp7KGyLu8cZct8y8Tnsvt4tVYxCxbacBDbLluPMQwAiD\/s2ScAD\nDLjv7ZeoOX\/K4OhFEcprgio3WZ1bB1bHwSFuH15Lv+4vEOpCRRQOKvxKh1faLIqFAYP2POw38tBZ\nKBJwrgQsfok6V06n+rdSiuPgroZyklGdCvDO0a1xcH+e3ka3D66g33oBuEzch\/sFYKfXykOu5gtB\n2ROdhXI\/wJ51s2iHN4WqvRPsk4cXiOiAf57baYc7U0N3DxfS7Q8twJ8SAbb8d8DgkklUlz2xyYS7\n3OYdiwWwECzDwja4\/gDdOVQo1IsdWP5gFus5WOcatRcmAmxdNoXqcpKp2mOoyMntR6tAsiPpkfx\/\nfN4o4H4\/VSWgRPQqOGkv7lOtBkVi74VWFccViV7FjiLpWTeTdi2fKgBrsibKcTjcljWINjEiVJST\nQ1UyYFC1KsxeKCpYqjeimjXP5m93ys3DkOiDiduMfdxZbWYvANfOpI4V06gWgJnPDIodCmyBPUpF\nqKKmyE2jWQNWNekbBpzogTybVYsZdow75N+APo8rrEaNSaI36t71swXgBwLwBarNZouznqWkr4OL\nk2ELvv1lhrzaXUB\/ne+kW30bBYQADcsRh784RxpAacBZU0SqZ98wuO0FglFXpkadnMWHjFHHk4T2\nFM0SgO3LbYAeH5JaQHIOXd+zRgBeCxcI+wACpVSojYKYHtjRaNuui0b\/s425UaaIs0D2FzMgF0h4\nzYsCsCZ7IlVlMuCFxoxiWAJrlJJQBDmJygSIiC7r31ANn9v2hAyH5yD3zOJwbBQS2avyTxUIAFvy\np6BAGPAZSvoqkFEMS5DYChLNFmoCAMkPGBVQTIBhH9iaZYfT9oLIPblJGH2rpdu7t0jmX\/fqGdTk\nmyzs3baYAc8H3MV4qIDkRWATdiQCVMBmC5VU4Nzc7hs5pysn4ax9oL7NSlS9qv8pe3evmkE7cp8T\ngJVvMuBgvbsYD8XDkTtosFBTgLKiSHw9AIXrCkxu8+8BZ2yxkHu6emofqKq3R6j3IoV4FtdxgcDe\nSg8D8sNceCgejr4l1BSgHpHwgACwGYASYB4TDAWBilVwKu\/i3kW2xKsnisOoXqi3q+AF094Kz9OU\n1F+7KBkPRUIjsXVQzFJAIIaMvzIyNLB0syCQc\/0OOLSVY6XzbZPjUAL1YC\/Ua8ybJNVje\/2eCaxg\nfeoYPBTNFKADJqiCjQ8FZYJBtRrZTpStFpzVVmzWarmn1MMEqTHUq2T1yjMYEAcncRSdXgfF\/MTi\nAyLcWsjr+NwE01QT7QT9jm1Vyplwo1irci+45HlNPQZ0j5eb15MVC\/341lgAC0EJBavirPZv5Bg+\nV4oJMEM1URBGzo0Kp6w1+l6I1Wvn8eZUr8z9lNy4niibPw4PxgKYl59qsAioq0JdU\/fgfh3sWKlV\nEHY4OTHMvNPaSlfhdArkphhwMvdYPSr1aJtW\/CyBBbAQLJKwEtgeaWKmCii+zwkG1TBnUa1O5RSc\nmXfclGFtMzdmZS0qtzyd4dzje2w76iPvpybjW2Mh9CwsiiRHgz2pBc5xHZ\/jPuSZBSYrFe+7qlqd\ntiq4bgOurWCq2VYsa8cDMjnuvYSTNvLx5lSxGBZVAQgV+nUFJRTTwJSlqFZVEMpWHa4lf7It7\/wZ\n0tqt7vH+hG914bUzxob4P\/exNcgfLCwBnJEqPgeUslKBqR6nLEUrwZxFQehwzUsna8oZeSetjZVk\nPj5m1FfP9sJprvaV00SfwsIiNmuxyQLCRFBQumIAU6qhlahGjJzrLJxGDXnPOeDMvKOyjCfu\/+tC\nx8rp\/hbOjd380IO8KJqrHgoI+QUoJ9g+BbbO6nOoVrwMbc9JTgiHvCtNf+rBf0TiF5fiZs6RnQVT\nqIu\/eZgt0mEEkIJSVjrAoFrXqulif8cv4yLfsAk1c86wleFiW9OfnP2vf+Hizu4KcgsILpXRzAp0\nsEXdvHBP0UyhlIJCdao8C62S1Rn0PS92JtgdVws42UrMgjDgHsjW0XNyqqvBNynawC\/TtuChHuBc\nCvDeDfu3em+KiO0cdayWeCtjMJtqqs9Z1Tr4n+DUEVo5ecyugqk9jTwrdRgnFN5la7MTg0lLrXwz\nx9ijPNCGAnmT\/AwZM4FsUMpKO1iFNVujALtnG3lUR4M3xYXfTziiSi3kWBxY+oRBVsxf\/jBFwMc\/\ns0SC70\/SObsAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/hard_bubble-1334269258.swf",
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
	"v"	: "give",
	"o"	: "pop"
};

log.info("hard_bubble.js LOADED");

// generated ok 2012-12-03 20:17:43 by martlume
