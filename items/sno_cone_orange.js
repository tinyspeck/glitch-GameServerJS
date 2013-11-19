//#include include/food.js, include/takeable.js

var label = "Orange Sno Cone";
var version = "1354588441";
var name_single = "Orange Sno Cone";
var name_plural = "Orange Sno Cones";
var article = "an";
var description = "A chillingly refreshing bright Orange Sno Cone, with a medium amount of iMG. A perfect blend of Ice, Hooch, and elemental additives and preservatives, it is the epitome of an orange drink. Not orange the fruit, that is, orange the colour. It's more of a concept.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 300;
var input_for = [319];
var parent_classes = ["sno_cone_orange", "sno_cone_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"eat_min_level"	: "6",	// defined by sno_cone_base (overridden by sno_cone_orange)
	"eat_xp"	: "150"	// defined by sno_cone_base (overridden by sno_cone_orange)
};

var instancePropsDef = {};

var verbs = {};

verbs.bemoan = { // defined by sno_cone_orange
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

		self_msgs.push("Drat, drat, drat. A dropped cone. I hope you learned something.");
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

		self_msgs.push("Drat, drat, drat. A dropped cone. I hope you learned something.");
		var context = {'class_id':this.class_tsid, 'verb':'bemoan'};
		var val = pc.stats_add_xp(75 * msg.count, false, context);
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
	if (pc && (pc.stats_get_level() < 6)) out.push([1, "You must be at least level 6 to eat this Sno Cone."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> or purchased from a <a href=\"\/items\/310\/\" glitch=\"item|npc_sno_cone_vending_machine\">Sno Cone Vendor<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIjklEQVR42s3Yd1dTaR4HcN6BL8GX\n4P+7O8u6szp9Gc84bXU3FkZ0RKIoNgaCitgYOSoi1mDBgnSkhRIgBEwgpAAhNyEJhJIQktyA6e27\nz70BNEYc+\/ic8z03kJzk8\/yedpOEhLdsMOSvhO5sIjRnuaAKeBHN78Lnwz6nP7ki4UM2BgPqLCKa\nfERGziBivIeIqRIRPR+R4VOIqE8\/DfP8SD7NQD8MbiSfEzELAFrJJmLvR3jwBMLj5SwyPHwGYVUu\nyfFoBvMQUOQiSB5Dffr9IjF0isNUaxEWmWpCWHMJ4aGzBEIqOlbOJjR8HuGBHITlOfBIf4NDdBCO\n7kNwSbMZKP+9DDmGT\/DCgycRVuYhPFKIkOIYQrIshFSkYporCEkPI0zdQMTwAGHtTfbvUF8mnKIM\n2Dv2wt65D46u\/XCKDyGoyJVDnbvy3cDUpxNDylwjWyUGwlRmqCCK0ZawCQ9fRFByGEFpFoLy0wj2\nHiDJINkPWrgbtjYu7O27o1ASp+gAQvIjNFR5iW85pHmc6BAWkGplsxUJSQ9FYRR\/ITcI\/Aap5DkE\nRNxnsptkD5u59jTYBKmwtaZFocJ0Fsp0NqQ8xnkjXIjBKY4iNPg7O4yhPlKdx\/sR7NmHsLqYoK6T\noWZyjU2w7xgCwl\/hJwmw2YlARyoCnbtI0li0r3M3wXIJdBcLDTIdHuAR5JHXR4ZUp4wRUy0wJVhK\nxEAWgLJgoTL7EOjOYK9+4S74W36JT2sK\/G3b4W\/fEQUTrJ9g3UIuPF17SIcPwCXejznRftovyVr1\n6jjSo9DAkeg8m6iPQTIJ9ueRD99GEMnwNW8l2QJf0yb4Gp8J8zfzf\/K8X5AcfT3BstUl0CdtqZhp\n3A5LE7kK0uDsyhC+2rwjW0BQdtQYUpDJ3ke2BXE6qdReBGWnyLCSBaEtRaA3mwA2EwgHvlYyrB3p\n8Amj8ZJ55m3eBu+jDfDVb4SzZgM89f+DrXojxh\/8jCeNW9mK2up\/gaWOpCGFIHfCQyqJgcw\/Xtlh\neTYvYqyMDimpXkCSTUBZpPcp0Yq1kKtwD\/mQNILbBW9jMrwtqezjxXgbNsNb\/QPo8vXQlnyL8dLv\nWCzbIdIx5n1czcmw1GzGLIFam7bD3kYWkDiH91LclS51oluaQwclmWTrKGK3DHbiM3NJQHpOKhTo\nPQK\/OAf+7mz4Rb\/B274Pnsrv4WEqVbsRnqof4Sn\/lmQdZu8lgbr+NbT8b+Ct+RHump9hr\/gJ9qoN\n0fcj7+tr2wF9BQf6yi1oqT6P3JJa+YuHFuA1qsblQclBslL3ItDFXcKx84z03lv\/X3gF2+HrOABf\n12FyPUSGcyfcZd\/A\/eBruO9\/tRTbnS+hvfoZqKtfgLpGcv0rFqotSYLu9jqY7v8AU9l\/YHiwAaNl\nGzFavgl9bcUoblVylwOuCIXDtH\/OBN\/IHXaLYIZ1CUfmFFMFT+V6tjqeqp\/grvieYAjs7udwl34G\n1521cNxcA33xP0Fd+pTkX6CK14C6vBbUlc8J9MuFiv4b2lvroLuzHkMPUtBTdxrVQgH4ohH6cr9+\n+WMwHA5z\/cEQPP4gntBmCOW9UIj4cLekLeC+Y4ePrda9LxZQa+C69SlcN1dj8nIiqMK\/Q7OYi\/+A\npmh1FFtMsFfWstWU3+ag4yEPdxvKcfuxDqW9WtzqocAXU7w\/XCT+QFDOAr0ByCxenJPPo1DuJG+i\nhFBwHdOiC6Ab0zF\/PwnOktWwX0uE5conGC38K0bOMflL9Hqeyd+gvJMCZel2SGtOQNRyF7USBYoG\n7DjxeBbZnVPIbjPgQqcWN8Wal1dvCQisWgQ6PX5cG5xHgcyJ\/D4HTklseKR1wDg7j9EZJygzDfW0\nA3KTHUUq8roBJ8702XGhz4oOyowuahrCkSm0qifQPGRCg2ocdYoxVA6M4bxkmgVmtBiR+kiLLRXD\nvFfeqAmwYBEonXbHAM9IrKAsczHAwUk7aih6CXiidxZX+5cHVg8YUSEzgP\/YgMxWA1LrtPS2Mv2r\n34IxC2beE6AZoHnOww7xIjCv14oajT0OqDDZUKSgl4BHuy0okU29FPiwbxT3JDoUCHW81z6LXd4A\nhwHaXV60Gp\/EAI+JZ6CYdMQB23S2GCAzhCX9Ey8HPtYay\/r1b3YD63T7hAxwknbjnCwWeKl\/Jg4o\nG5tF5bA1Bni43YTCnnE8IrgXAe9KRjlvfD\/o8vtXMUDrvAcC\/VwMMEdkxsMhaxxQapjBPdVMDDCj\nZYysVj3u9xtjgGVSnfyt76jtLk8BAzTZXSiU2WOAWQTQbZiNA\/bqLbgtN8cA9zTpsatei9w2He5K\n9QtAY+JbAx1kwVjn3LTF6UavaS4OmNM5gc5RaxxQrDPjvoLsc8JY4I5aDZKrhsGtHeS\/sy9MM\/Ne\nDgOcdLhwS2WLAWYKJ3Cs04RuvTUOyGwzDYOTyOuMBW6tGnq9beVVmsXpEjLAUSs5WfqtMcCDrePI\nEY6hRWOJAy5uMxd7jE8rWDmc9M6\/djq83pUM0GR\/AtmEE8fFscAMgREHBAZUKCdfCGS2GWaRZDZT\nwoT31aZoN48BMkdds9YWB0xvMoDbMIqj7Xo0D0\/FAeuVY3SL3vH+fqdxOLBi3DZvXDyLGzSzLwQy\nZyszlIXdBgJ7dqOeSEx4381EzydpZ57eLFyXmZcFbqtWg1unZs9cAiz4YL9u1Y\/OVz17FvNl08sC\nkyuHsKlcRX\/\/rlfty9plPVaUjzjoZ4+6ikHzssDND1VJCR+65ffTnNLB2Zijrkw5HQ+sGCpI+LNa\nXs9MVb0m9qirG5rCnoZF4LBx24cc2ufbyX7HitzuabpUYY456jq1Zhxu1iKljlqV8Ge3IulsYhY5\nb2\/KJp8\/6ngJH0s71DrOSSdn7cWeMRbYM2qWJ3xs7XjHGH9nHYXj7TpabHCsTPgY26+1Gv7WKvU7\n+6H8\/yD2p6ZctzoRAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1262849279-1620.swf",
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

log.info("sno_cone_orange.js LOADED");

// generated ok 2012-12-03 18:34:01 by martlume
