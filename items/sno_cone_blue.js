//#include include/food.js, include/takeable.js

var label = "Blue Sno Cone";
var version = "1354594478";
var name_single = "Blue Sno Cone";
var name_plural = "Blue Sno Cones";
var article = "a";
var description = "A delicious, refreshing Blue Sno Cone with a tangy hit of iMG. Blended to perfection using ice, hooch, and the very finest elemental additives and preservatives, it tastes exactly what the the concept of blue should taste like. And a little like raspberry, weirdly.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 75;
var input_for = [319];
var parent_classes = ["sno_cone_blue", "sno_cone_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"eat_min_level"	: "2",	// defined by sno_cone_base (overridden by sno_cone_blue)
	"eat_xp"	: "37"	// defined by sno_cone_base (overridden by sno_cone_blue)
};

var instancePropsDef = {};

var verbs = {};

verbs.bemoan = { // defined by sno_cone_blue
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

		self_msgs.push("Sigh. You should have known not to drop a cone.");
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

		self_msgs.push("Sigh. You should have known not to drop a cone.");
		var context = {'class_id':this.class_tsid, 'verb':'bemoan'};
		var val = pc.stats_add_xp(19 * msg.count, false, context);
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
	if (pc && (pc.stats_get_level() < 2)) out.push([1, "You must be at least level 2 to eat this Sno Cone."]);

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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIgklEQVR42s2YCVdT6RnH8w38CH4E\nPwLntD3TTqetjh1n2mqLU7dxK9VxXyYooOOKCMMiKjDKLoKyKBAIW1gCIUAWsm8kZCO52SCC0n+f\n97KYGFFG0fE953+y3XP5vf\/nfZaLQPCeq8YUXV9ljiZVGZ6lVBujwkrDjPhVsd+qjFgn+JiLwVQZ\no6gwzKBcP40R\/wvowv+DxD2H+9oISnXTvMpI7PdywzTHQD8KXKUhmsxATNPgxcDuaUIY417wn6v0\nEdxVh1BEKh4PoWQ8jLtKDiXqIMq0kcwP6ia5kyyyP1sGG\/DOodYUQbU+TGDhZegm6wwKFAHcImXL\nPLjea8eNPjvyhz0oVgfl97SRDWsOd08bFjJ3iseDqDaEcVsZQO6on1wJodk2g5tyHwa9C87Kfc\/5\nzzkjPlyW2HGp24orPTZclUzgRv8k7igD5vt0ftcE7Gd9NIl2bX5gjEAVmEeRKoA2exTa0PwyjNgR\nRe7IFArHfKg1hpEl8+LqoAfXhrxI77QgXWzGhU4zLnZZeNjrfQ4UKgLcXXU46b3gSiikLFzMsbwx\njncka3hqOZSx6nfP4kK\/M0YuXFzUOQJMbTfhvNiE9I4F0CvkJjsCd8dDye8GNx5Jvq0KolIXRjmF\nMXfUh+vkzBVyRrGYELGqNYSQ2uOAkJS6qHOSSZzvnUR67wJ0Br1P67LxoBkEmjPiRz5t\/LbyHSDv\na0JmFtJYCNnUHB7og+SKk8LoRq7cgxw6+Od67DjVacPJjpdin093TuBMlx0\/dNt54AVYgqTrf6TX\nTNrwNboXhZzLH+ZWnzhsR4WUBKKYsxarEpWfACZwgkCOia042m7FkTYLvo\/RkUWx30+Ibfz1DJaB\nphFcKttAiw7CVj3OtxkpgeziVcEVUJ2iA2wu1QSRT2G9LHUjo89JtcyHDscMJK5nuK\/283\/8sMgM\nYdcELg1Mkhy41O8gh+w43WHFf1qMJBP2N2jwX3qf8kSHvTUjOCYy4iyBHm\/W4fgTDU49XYC8NuBE\njtr\/9swuUHBClpnMKQ25l0UhzBxy87tnjp0loMsEdJEyMaOXfWdBGh14BsZemY60mbCnSY8dtUr8\n\/U4n\/nW\/n4c9RBtiG2OOnmw34\/sGNU6QiycJVEguZg04hG+Eu9WlTsqRe7ls+RQazNSyNAE+JOws\nHadQXaZdlqh85OYU7ii8VFYIftBJMDpyyYAU0l5yavtjDb4lbauUY0uhGF\/f7qDv9dhH0HsfqbDv\nkZIPPbsv2\/D+igEcrBxA+iMp0osfy18LB0DYorSJb8imlsO6BMduxsJ5qNVI301QYrhQMOpB\/ghd\n1zuBbbVqbCX946FqWd+UD2NTQTu+JG2+1Y6vbi2AMke3FXdjR7kUuyoGsatsAHtK+7CvvB9X2zXI\nF42mrAS47sX8PGcPPUOdjuNLxJmul3AHm428C7sadbw7B+g9c4uBff1AiS3VCnxVpcDm0mF8kS\/G\nFz+14k+5IvyZ9Jc8Eb7Mb8dfCXRLYQe+IdCtd7vwTwL9rqwXZ+pkyG5Toqh7nCsYMq7cq+fn51Nm\nn7\/AzOxz2ANR5I1w5JATZ+icfUfh2dmgxfZHGt6xv9WoeKjNVWPYVDGKjaTPC7vxWXYLPrvZzOsP\n9P7znBYeloFuym\/jHd1WIsHuShmONapR3KdHaZ8OP\/dqUSTRCt+aJLNzz+UMMBydg8wVRZY8hBx5\ngM6fhw64lZq+DSco67bWKLCR3PpjiRS\/v9OL32aL8JsbT0lPFl+f4ndZzdhxrwc7SafqBnG9VYHi\nATNyh31US734odNB9zIhu1OHEonmze4tAwIblgADM7O4rQhRQQ1Qb\/VTKaHk0flh9oZgcAegdXJQ\nT\/oht\/moFdJ1wwHqNH5kU7fp0DrRpZ2EeNwBkXoCzUobmsasqB+x4OGwBTepEjDAo61mHGjQ4d81\nKuGqCzUBZi4BSien4wCvkJNaVzAOUGH3oZHO7RIgcydvcGXAumEzamQmFPWbcFpkwoF6Hbe7yrj6\nOZElTGhmjmOAzuAMH+IlwAt9HjzS+BIAR2xTNNFwy4BpPS7kSR1vBKweNKB8QI9MsV74i3txJDqX\nzAB9kShE5nAcYJrEjRG7PwGwWTcVB8hCmN038WbAfp25asj4blN2YPqZmAHauWkaDuIB86i7vAoo\ns3hRRgU8FvBUOw2pEisaCO51gGUDhuR3ngcjs7MbGKAnNIMWYzAOMLXbiWqlJwFQaiJ4GvNjAY+1\nWvhWVjFkjgOskurl7z1R+yIzmQzQ5osgR+aLAzxLAD0mbwJgt96FTBqjYgEPPzXiYKMe6W16lEmN\ni4DmpPcG9FPCeILTnCswjT5bMAEwlVphp8ETB9hndEGid6JwMBFwL3WhXbUqpDxWFK3ZA5M7FE1m\ngHZ\/BBU0LMQCnhbTBEOzXY\/RkwDIykypjIZZUTzgzlrlLysrq1muQETMAG2+MHKGPHGAJ0RWpIot\naNW4EgBZmakfsyGNxvyXDqrX\/iHeH42uXwJkhTpDEg94tMWM4zTz1YzaEwCXykxRvxlHm7RiwYda\nDm5ayABZq5Na\/QmAh5+akNJkwPl2I5pVjgTAxlEL12r0f7j\/LPj9WGedCpmXenGTxvtaQNZbWShz\nekwEFluoJ5IEH3rZuNBGnfvlsFA\/7l4RcHedGin1ar7nEmDmR\/vvVqMhVBvbi+tUrhUBdz5UYvuD\nMW7LWmft2578Hoz7udhWV6Nwrgj4bfXYRsHHXleHuORS6ruxra5qdDIRsEaZKfi11oVed22jJr7V\n1SsdONS0BKgy7\/6YoX11\/TjkX5feM8mVjjjjWl0jlZhT9GC+p167QfBrr1ypN+ksPYiXUEt7pdUJ\nBZ\/KOimyJrNe+1OvhQfsNTjlgk9tZXRYivbXa5HRruckJv96wae49j3WFO1Yw0Hg\/9MyvnhY0+z+\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-01\/1262849249-4574.swf",
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

log.info("sno_cone_blue.js LOADED");

// generated ok 2012-12-03 20:14:38 by martlume
