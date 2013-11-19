//#include include/food.js, include/takeable.js

var label = "Pi";
var version = "1342483399";
var name_single = "Pi";
var name_plural = "Pi";
var article = "a";
var description = "The recipe for Pi was described in ancient times by Alphimedes of Salatu, who also purportedly invented a heat ray for attacking the Rook. (If the heat ray ever existed, it has long since been lost.) It was later improved upon by Ludolph the Cerulean, named for his bright blue skin. Ludolph gave a Pi to several of the giants. Tii immediately stated that Pi was irrational. Pot, on the other hand, declared this to be the best pie he’d ever eaten - transcendental, in fact.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 314;
var input_for = [];
var parent_classes = ["pi", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.722"	// defined by food (overridden by pi)
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

verbs.square = { // defined by pi
	"name"				: "square",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Pi r squared",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		failed = 1;

		pc.announce_sound('CLICK_FAILURE');	
		self_msgs.push("Pi aren't square! Pies are round!"); 

		var pre_msg = this.buildVerbMessage(msg.count, 'square', 'squared', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.eat = { // defined by pi
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		if (this.parent_verb_food_eat(pc, msg)){
			pc.sendActivity("You suddenly feel as though you have 3141 digits, and yet, you feel strangely incomplete.");

			pc.achievements_increment_daily('pies_eaten', 'pi', msg.count);
		}

		return failed ? false : true;
	}
};

verbs.estimate = { // defined by pi
	"name"				: "estimate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Estimate Pi",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!isPiDay()) { 
			return {state:null};
		}
		else  { 
			var date = new Date();
			//var count = pc.counters_get_label_count("pi_estimated", date.getUTCFullYear()+"");
			
			if (pc.piEstimateTime && is_same_day(pc.piEstimateTime, current_gametime())) {
				return {state:"disabled", reason: "You have already estimated pi today."};
			}
		}

		return {state:"enabled"};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		pc.sendActivity("You start estimating Pi.");

		this.val = [];

		this.estimateDigit(pc, 0);


		return failed ? false : true;
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

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function estimateDigit(pc, digitIdx){ // defined by pi
	this.pi = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8, 9, 7, 9, 3];

	log.info("PI digit is "+digitIdx);

	// The first time each Pi Day that a player estimates Pi, they get favor with Tii. 
	// After that, they get mood instead.
	var date = new Date();
	var count = pc.counters_get_label_count("pi_estimated", date.getUTCFullYear()+"");
	if (count > 0) { var favor = false; }
	else { favor = true; }

	var done = false;
	var max = 1;
	if (digitIdx > 5) { max = Math.round(digitIdx/2); }

	var chance = randInt(1, max);

	if (digitIdx < this.pi.length && (chance == 1)) { 

		if (favor) {
			var amt = pc.stats_add_favor_points("ti", this.pi[digitIdx]);
		}
		else {
			var amt = pc.metabolics_add_mood(this.pi[digitIdx]);
		}

		this.val.unshift(amt);

		if (this.val[0] == this.pi[digitIdx]) { 
			if (favor) { 
				pc.sendActivity("You gain "+this.val[0]+" favor with Tii.");
			}
			else {
				pc.sendActivity("You gain "+this.val[0]+" mood.");
			}

			if ((digitIdx + 1) < this.pi.length) { 
				this.apiSetTimerX("estimateDigit", 500, pc, (digitIdx + 1));
			}
			else { 
				done = true;
			}
		}
		else if (digitIdx == 0) { 
			if (favor) {
				pc.sendActivity("Your estimation abilities aren't working very well right now. Maybe visiting a Shrine to Tii would recharge them.");
			}
			else {
				pc.sendActivity("You can't concentrate on estimating when your mood is this good.");
			}

		}
		else { 
			done = true;
		}
	}
	else { 
		done = true;
	}


	if (done) { 	
		pc.sendActivity("That's as many digits as you can get.");

		var total = 0;
		for (var i in this.val) { 
			total += this.val[i];
		}

		//pc.achievements_increment("pi_estimated", date.getFullYear()+"");
		pc.counters_increment('pi_estimated', date.getUTCFullYear()+"");

		pc.piEstimateTime = current_gametime();

		if (favor) { 
			pc.sendActivity("You gained a total of "+total+" favor with Tii.");
		}
		else {
			pc.sendActivity("You gained a total of "+total+" mood.");
		}
	}
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can only make this item on Pi Day, observed on March 14."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-23,"w":48,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI7klEQVR42u1Y+1OU1xnmP\/BPyM+d\nToc4aTKJ1qDRqBh1IwaCgCACCyx3QRA2uAgiIJdFhIUNIAioK7cVQQSEXQG5iiwrF7nJCuwiFnUF\nJGlj26fnPeu3YjBp2qadzpRv5h3gfOc75znP87znvAcbm\/Vn\/Vl\/1p\/\/zQfPlRu+m78UgpUeGVa6\ni5ZmskXUvjibE7JsKjQvGZXal8Y82\/8eoJc9HgTkB3NTkWk4RdZWG2AY6jyFRaMK5pmLePzgLMZ7\nYzHZJ7NGz60wjPXGaR8OnNZ+v1Bl\/uF5g\/b7uez3fnVwS0aFB2MEK49LYH6Ug66GYJTlHoQyZTdU\nCgdczhKtieK0PciQbkGl0hHttRI0V\/tisj8Bs0MpWJpRyP9toH9ZavX423KHemFCrpvSxWOgNRLa\nSjHK5PuRELgR8RJbZEk3oyTNHg2lrjway9ysUVv4NUrT9\/D3uae2IifODunRm5GfshOlOQdwtyUC\nizM55j8\/u6599UJb9E+Bo9X9cSLDTLLpb0dAcXoH4gPfh0JmhxvFzui8LkZ\/UxB0t4KhbwnFfU0Y\nBrXH1gS10\/uB5hDe\/15jIGryHaFM2Ibi1D0Yao\/G3Kgcy6ZiLBnz5b\/Y\/DevHtW11fpzqZJCP0C1\n8gDa1V64e1PCJ6IJ9S0WUMOtERhpO44H7ZEsolZFJG+n94PacA5WANrXEIA717xQlrEHWXFb0cYs\nMDWQiF7Ncbuf9xrzxkhXLC6e\/xJxTEJlAvu4yhM9N\/zYoAK4UA6soy4MN1Qh+DZLgnNnxchMFkOe\n5AN5siUyU8Ss3RdZaX7ITvdHjlyCOpWFcWKeQPbW+6GrVsyI2AfNNV+YRs+DbAX0bVgDbuVxqcww\nkICKfCfEB9iirtiJSemN7jrfVcyF4m5jGE7E+EMaG4yoaAkcnJzx2W4RelvT0XM7zRpOzk7YztqL\nC6QoKYrl\/S+VyDibBNLCpIQvvvO6D25dcUNzlS9WntTglfmm+a0t6q\/LrSHm6ULoNMcg8\/sdai84\ncglodb31\/tw7tOrehlDkKaIwM5KLxek8lo1K7HdwRGCgJxbG5DAOnGaRCJM+EZ9s2QlHBnL+QRqM\n+jOYH0llv6djrDOGK0By07g0fnedGB01Xrhd6YGhjhgszSoogbRWgC\/nSrXEHnmupsABbdVH+Aer\n2ePStMbBNJiCiS4pJru\/weX8YGzbuR\/xMgkeDyZhfigZT4ZT0FQRiY8+2Q5\/\/8OY6Y+H4a6M9x\/v\njObeHLr9hkUav+eGL1erXe2JLvb7s6lzMA0nwwpwfjRN21h+FNknt7BVuPOOHTXeawDSwJQANNHD\nnlgEBbpzgNWXpQxcChYYW8\/GMtBSfYIDFHs7Y1aXgEd9cbz\/OGNv9E4UTxxKGsGLgszt6qN8\/luV\nXqi95I7qiy4inrVPH2aivzkCFYr9vENb9c8BjOQAGyvDYS9yxA77LzGjT38NMBVPR9PRoo7Bpk93\nwf4L0RqAtMCfBujJ5zcOJeF2jT\/KCw+pbZZnc2V0QrTVnECzygXaisOrJBYzgP5vZS9tHQ0Vx3DI\nwx17DzrjfGYE993c\/TNM5mQOdKovCVt37MV2Bv7OjWirxGMd0ei6GbFGYiJCkJgAzo2k49mjMjRV\n+ups6KT401M1Hg2kcICacje0VnmwJDnKksSHbwW0SlotrTovKwguXj5wPOyJ0HB\/PNKncobIa8QW\nJcqs7jSy5BaG9x08hIjj3pCnBkCZHQxJiC8b5+0koWQkQogYImjh4bdgRQiGu8\/CRt8WZXhuyOKZ\nQy9brrq+04c0WHttGOITj\/MouhCH+YlcTDLpSL6p3pOcKSEWxjPRWJsMBxd3OLl78kW5eotRXBT3\njgSx+I+IoWCnGKbvZ6CtLshgcynXQXa9zB1PxjPwoOPEGhbpYxqEBhtk0hhZFpuGzsJ4P5kbnoKk\nI39RdgtBf5uY5MaxfOh7zlvjuUFhPU3Ie6QSbWkCe4PMn83VPkxeb0N7Q6CtTbnScUNNqZuB0vrl\nYxXu1PhyFgUv\/hiksCcSC+RJ8tNw6\/FVx13k62MukrePMvCTjN0J8iADrmPSWpizgBOkJdU6mdTT\n9xN5pSRP2C2zbjPDHVEiqt+WTQWMyXNWqelna9UbkCQ3eYZWLwC1nMuWgoG8ZSkSVhcKlqNNYM2y\nMVtkFZgjcBRUnMyyDFam7YXY9bceVoAjHdL3hpm8BJI6UbQxD74B6fHak1581RagfpwJASwB+HFQ\nO72nfgSMVLCw5m31HI1PzC3O5NM5DBPL4CTpNni5\/ObtepEVlTLSniqLvpZj3KjkSRqAPEkrJDYF\noLQtUPYRWJqYJCMQb8KPt9F76keM0XcETGCNAJLnaC6DPpllrwKj3VJIQza9uz5sqPAUqS844VLe\nQYywzZiym0r6h\/3nuDcJqLbCMjBNQmBJfpqYWCHQQtDf1E4yCqDoOwHYeM83XE498+61EjfkZ+xD\nxqnPcSb6M3OAy8afrra1V109mi67YIB5aar\/FPcl7ZMU0+y8phW3M1AWsIetE1riyKrwsAISbDLA\nfDnF9suV+Qp2dVByEsoLnZEUsxVRko8QLv49gjw32v3DopVAahkAAklZRRJYZEgEHYsv54rw6kUz\nlubq2I5fzq3woPNNjHWfxJQuC9ODeXg+XYX5MQXfZym+e3KVtZVwcPWqI0hm4KRBHyNS8qE5zOdD\nu19c9mtUbraMJcMIm5wSqKM+EFfYBYg8SluSMOGL6WyeXFQmCRs+u47yBVAsGiv5N40VXnwcIdTF\nrkhh4GRhmyAN\/FgbHrDxX7tEacoP2bVcddFpWEZTXL\/oDI2andHNYdbJiAkCf0\/zNuP0Owdz0RVF\nmftRf9kTxZkiZCfuQtKJTxEfvrlIGr7p17mGkuwtKlctgSSP3iw7ZI36UmfUsgq8vswV99i+19sU\njJ7GIPYzBFUFX6Mg1R55Z3YhO+FzyGXbzKnSrfLkqD\/8Zy71t8odN2hULiK2R8oFZpuvuKChzJlf\nE64VfsXuwgegyhGhjN01ijO+MBectVfnJe4KyYrfZrv+P5n1Z\/35f3v+DvMYqDCX4XnZAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/pi-1331597994.swf",
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
	"no_rube",
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
	"c"	: "estimate",
	"v"	: "give",
	"q"	: "square"
};

log.info("pi.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
