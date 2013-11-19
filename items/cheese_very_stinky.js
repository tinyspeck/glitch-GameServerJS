//#include include/food.js, include/takeable.js

var label = "Very Stinky Cheese";
var version = "1354598473";
var name_single = "Very Stinky Cheese";
var name_plural = "Very Stinky Cheese";
var article = "a";
var description = "Smelling like a manatee bathed in celery juice and old surgical stockings,  goodness knows what would happen if you aged this connoisseurial cheese any longer. You could give it a go, though…";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 27;
var input_for = [29,340];
var parent_classes = ["cheese_very_stinky", "food", "takeable"];
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

verbs.age = { // defined by cheese_very_stinky
	"name"				: "age",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Increase the stink. Costs $energy_cost energy and $mood_cost mood per cheese",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var energy = pc.metabolics_get_energy();
		var mood = pc.metabolics_get_mood()

		if ((energy >= 30) && (mood >= 30)){
			return {state:'enabled'};
		}
		else if ((energy >= 30) && (mood < 30)){
			return {state:'disabled', reason: "You need more mood to do that"};
		}
		else if ((energy < 30) && (mood >= 30)){
			return {state:'disabled', reason: "You need more energy to do that"};
		}
		else{
			return {state:'disabled', reason: "You are too weak to do that."};
		}
	},
	"effects"			: function(pc){

		return {
			energy_cost: 20,
			mood_cost: 20,
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.metabolics_get_energy() < 20 * msg.count) {
			pc.sendActivity("You are way too tired to age that much cheese. Maybe you should eat something first.");
			return false;
		}

		if (pc.metabolics_get_mood() < 20 * msg.count) {
			pc.sendActivity("You are way too depressed to feel like aging that much cheese. Maybe you should drink a tasty drink instead.");
			return false;
		}

		var duration = 3000 + 1000 * intval(msg.count / 4);

		var annc = {
			type: 'pc_overlay',
			uid: 'very_very_stinky_cheese_age_'+pc.tsid,
			item_class: this.class_tsid,
			duration: duration,
			bubble: true,
			pc_tsid: pc.tsid,
			delta_y: -120,
		}

		pc.location.apiSendAnnouncementX(annc, pc);
		annc.locking = true;
		pc.apiSendAnnouncement(annc);

		self_msgs.push("Wow, is that ever draining. But the cheese <i>is<\/i> visibly aged.");

		var val = pc.metabolics_lose_energy(20 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_mood(20 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "mood",
				"value"	: val
			});
		}
		self_effects.push({
			"type"	: "item_give",
			"which"	: "Very, Very Stinky Cheese",
			"value"	: msg.count
		});

		var pre_msg = this.buildVerbMessage(msg.count, 'age', 'aged', failed, self_msgs, self_effects, they_effects);
			
		if (this.isOnGround()){
			pc.createItemFromSourceDelayed("cheese_very_very_stinky", 1 * msg.count, this, false, duration, pre_msg);
		} else {
			pc.createItemFromOffsetDelayed("cheese_very_very_stinky", 1 * msg.count, {x: 0, y: 0}, false, duration, pre_msg, pc);
		}
		this.apiDelete();

		return failed ? false : true;
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

verbs.poke = { // defined by cheese_very_stinky
	"name"				: "poke",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Investigate the cheese",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.metabolics_get_energy() >= 11){
			return {state:'enabled'};
		}
		else{
			return {state:'disabled', reason: "You really need more energy to do that."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (pc.metabolics_get_energy() >= 11){
			self_msgs.push("After sticking an investigatory pinkie in the soft, gooey cheese, you encounter a hard object. You pull it out. It's a small shiny object with no intrinsic value!");

			if (this.isOnGround()){
				var val = pc.createItemFromSource("small_worthless", 1 * msg.count, this);
			}else{
				var val = pc.createItem("small_worthless", 1 * msg.count);
			}
			if (val){
				self_effects.push({
					"type"	: "item_give",
					"which"	: "small_worthless",
					"value"	: val
				});
			}

			var val = pc.metabolics_lose_energy(10 * msg.count);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});
			}

			this.replaceWith('cheese_stinky', pc);
		}
		else{
			self_msgs.push("You really need more energy to do that.");
			failed = true;
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'poke', 'poked', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.eat = { // defined by cheese_very_stinky
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

		if (pc.isOverDailyFoodLimit()){
			return {state: 'disabled', reason: "You can't eat anymore food today."};
		}

		if (pc.metabolics_get_percentage('energy') == 100){
			return {state: 'disabled', reason: "You already have full energy."};
		}

		return {state: 'enabled'};
	},
	"effects"			: function(pc){

		if (pc.knowsAboutEnergy()){
			return {
				energy: Math.round(this.base_cost * floatval(this.classProps.energy_factor)),
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (!this.parent_verb_food_eat(pc, msg)) return false;

		pc.sendActivity("After all the hubbub about the very stinky cheese, its actual stinkiness is a little anti-climactic.");

		return failed ? false : true;
	}
};

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can make this from <a href=\"\/items\/45\/\" glitch=\"item|cheese_stinky\">Stinky Cheese<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-28,"w":34,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFKklEQVR42u2Y\/U9bZRTH+Q\/2J+xP\noKi\/+MOcS+ZL1Lglm5kxmurQqGy8GJ0dFCzT4ZxTeZnMMEoZm2GBtYUsCGO83MJahqWllAEJL20p\npQUZ9CrFn4\/PeeB5uL0vpWywLYYnOekLl3s\/93vO+Z7nNiNjb+2t\/8EK9hj3zwiG\/BmhsGWm96yA\nr8FeQ+bTByMQCBNxmkD0\/girvp9p\/D18CRYHz0PIYSwPdBn2PRW4UK\/hSNBRJC79WcbB5IGgEWdp\n6ImqiYow1RBAC25WIKp61v++NHheDPcZ9bsOhxdB1R66v+cgUed3HCRVLA\/9ALsGiekMOIpCmE4t\n1RAy2FMCY21naEx2FirA456LBLI4f4frzCikqjMMBPPa88Bj+xS8tk9oDFlzwGPPhxX3RX4MvRHS\nTFFXqemxu5Mo5sNOVFMs0neO1NUF\/n6wOQcGb74Lrt+PQn\/DGzTwPUKikut1eCGpeWb7S8ofGQ7r\nDNOxVV0xZVyNemivfk4R\/deP0nSr\/R+eP9RXtD0lw\/Zjeimc9K61YnGgDNzWPOisOaAEvHGCK8gC\nU87SjY1DHCG9xpk36\/ShtpPA6g0vLL17LHhfawFM\/lEAU52GpAbANGO9oZIsMO34HZ6H2Y6v9Qv+\nmQU6wpY+GTNn7Y+YdaIUUM3XXI0fQHftS1Sd8bY8xTFoOagOhtQHpYFZwRvCYzchy8SUkASuhSgI\nc9cPkJOfUW0MvBh2atfVQ9BtPkwvIk2bXBm1CDtKoNfyCm2iYduHMiUJJJnpCrgFS9ZBhGOBkGHh\nrAIyHTOWB4Kjkuzz9N2veX1iJv4a+JYfh6+xgXM+xeyO1OrqpYAMcs5RmJQWrCfWNKjW9J0CWHCa\nkm4AVWUplqZQeh73rc94nTIw\/J6de95pEuTpFeWADDLab1RN9USHgabZ3XQiqYGGbdngs2fD\/cZj\nIJhfS1JP3vlyh8AGmmg30MyFHEX10u4FrYhcexGiDoPqRfACTAG8IJqy16qHHvMhnsbJjrx11ayn\nCbweYveKNcthvr+EBvNI3F9uCUghLS9ArDsvZa2tQ2ADvczh+hre5jcw1ZELY7f1MC5rDGl4mo9D\n4G7upspkilGP1EqxArI9O+X2ivnmSGsOtSAG98gxWgmL3p9EbjHpRKTtI5COwHQmjdbOR25TSS4x\ncQXi41dgeaSiJSNaqzuSLiBGuPU9buaKE2soi5HqOH4efzkkps2w8uBXhBPFB1WZfMxtC7LpTbIb\nKU56DlHb8aA1DVlP0QYatp9WtR4eY5dhLXiNwj0cqfBxOLZQyXTqkUM2vgpkYwHS3bV0LLqtudx2\nWAyRblaznsRkDfwbvgHxsWoKFw\/UqD9oxWue37edmkSvDHR\/BQv3k5XBZhls+pjPbcFyGIaa3weP\n9fPk7dfIL7AWsEBCopwmnGLzoDJhtDo8eOcUzLtKN0dal5HuZqRbMGrsRFW+\/SJduhZqgNXpOlgZ\nvYw1J6QFJ5\/T6SiKkLgTmrv3DbciTKX\/9pcwcPMkHWvok6geNkNivBoSgXqa0uWRSlSu\/rEeAebr\nsjJR0a1qdNZ2HCJOk8LEsYuZLyamrsI\/U2YKtgFXvmMPUZj6aJ3OlAoUm4fthqTPLlhviZk6ECd+\n24CrEJf9lbv3rEytqVbn05rhs2RscVMn9bbK\/W0dThytOvhEfmlg6Very7D9HVjyXqKNsOyvYnDb\nb4adWBsWlU9gQ1LQ6K23eL2t+CtNGc\/CkjZVrOl1qppiMjwLC1VF2L1fUPdWivUfrQkVnsgytScA\nAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/cheese_very_stinky-1339640905.swf",
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
	"food"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "age",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"c"	: "eat_img",
	"v"	: "give",
	"o"	: "poke"
};

log.info("cheese_very_stinky.js LOADED");

// generated ok 2012-12-03 21:21:13 by martlume
