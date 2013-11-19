//#include include/food.js, include/takeable.js

var label = "Stock Sauce";
var version = "1354649359";
var name_single = "Stock Sauce";
var name_plural = "Stock Sauce";
var article = "a";
var description = "As plain and every day as a woman laughing while eating salad, no one even things about Stock Sauce any more. Perhaps they should.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 34;
var input_for = [35,44,347];
var parent_classes = ["stock_sauce", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && !pc.skills_has("saucery_1")) out.push([2, "You need to learn <a href=\"\/skills\/39\/\" glitch=\"skill|saucery_1\">Saucery I<\/a> to use a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
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
		'position': {"x":-11,"y":-32,"w":20,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGrElEQVR42r3YeVATVxwH8J3qTFtt\nBTvT\/usf1aooiqKAF0QUvEFFHR2vKh4I5AA5DRBOQVEBRQmiXHIkJNyEIKjRUAG5FJBqtVawOo62\nHoBCUPHbfdsulbaOJVncmd+83Z3N\/D75vbyXt4+iBnnEi43HSIOMHRODjSVsJAQba94TMewz5DPS\nUOOp1FAedKL8xJCvkBgyWu9IkBjdTfQdbTQkwHj\/YRqpZJTeuBj\/Edi7jcKQVTDWm9LE+1E4Lh5O\nV2Ikk\/RYwCgcDfiSSX7I9zMc9P4UkR7DES78BH47KXhspcDfRGHzCgpOdhQc5n8sYOAIBkhwBEZQ\nIe4UxC4UfJwpiLZQcN1AYecaClsdKWxY+hGAB4QUjhkIXDqPgqUp5TgkQLVCkJccNRkxPsNwPOBz\nSIONEbfvi\/cCXdZR2L6awsa\/une13UisXfpN9ZBVEL\/WCJ+UeOJmxSk0no9DrToSlQUBUGXvQF7a\nFshOrUfaiTU4GeOAoxF2SIxciYTwFYgLWoIEH3uku9qiImhT8NDgHl2Z2lsV1d2pXIfu6wq0nT2O\nKsk8lHvzUCC0Rb5gPnL586Fw5yHHjQf5Hhtku9ggc7cNZC5WdEyHbPd4FPss7L1y2JPb+RBP6436\nbuU96Eqfh+7qI+hukePJuSC0x1vi59iZuHF4BloOTEdjxDRcCTXDZclUXBKb4pyvKdRek1AomoA8\n\/gTkuIxD1q6xKPF3fFLhu8uIw+ppM3rki\/CyzA26liy8bMrAw9P2\/xtYJJqIPAENdB2PzF3jkLJ9\nLNSBGxq5wfU02\/RpfdBbsgm9zenouZaGzgvBeJAwa3BA\/kQo3CYia89EpDqPQ+qOSbgUIZAYDuxq\nze8rXIVXVfvRey0ZPY2n8VS5edDAXP54KN1MkO1qgrRdJkj6\/lucDXLuMBjYd1\/d+VbOw6vLodA1\nnkRPvRS\/n7LWo4IToHQ3gcxtMtJ3T2KAyr3LUBa427AB87a9AAywUgJd\/Ql018bjt5Oz9APyJ0Pm\nPgVnXEwZoEK0COUhO224AWrF0F2JQ3dNrN7AXIEp5HwznHGdyj2w96IfeqoPoftytN7APMEU5Ain\nIcPNjFtgT4ET2huS0HY1FfcaknGvVIS7KhF+UWzD7dRVuJm8Cq1JjmiSOqDhhANqj61AdewyVB5e\nhgrJ7HcqOIVGmSOTb94PVImdxxgMfKO0x0\/Ncr1Cm8IfAFR6WiBLMLMfaPAoZruYJDtf6IVo36+R\nFmeDE+EmyJIuQcPlY2ipS2ZatWLPh4F7LZEttOAQ2NmsIcA7jalQJq9BsBvFAElLkCQILDZoDHNO\nniFBwP8E5gnNkOs1CzKRFQNUiTdwB2yvk6IoYyuDIIkJgrRsRZOiZ\/TfJ88R8L+AomnI854Dmeds\n7oFtdQlMV0Z4jEDNhQMMigDYSrJg0hI0e62OWDUQ6DMX8r1zGWCR3\/qHnAHvV0UzCcnvjiRnK8kC\nyX0WSO6xXVwe6dAPzPeYjnw\/a8g8ZjHAYp+1jZwBH1aGDajOu0CCI5UlFWaB2rKg\/wCao8CfB5nQ\nintg67lAJjEJMpoJiAUSDAGTcxbPfoEBQM8ZKBTbQu4xm2Ng7mLc1kYyELYyLIC9Zn+XZESzYNLN\nmvhN\/cBCLwsUBSyE3HMOAyz131hr+HLrZaukr3wH2mriDJ6oS\/ytURRo3z9ILoYLNZwB7yXaoyXF\nGa3FEtSVHqFfmuIHD9xng+KgxcjxsuYeqMtZhBcKJ3TIVvYvFpqirNAQYYHaMAtUB89AZaA5NGJz\nnPObjrPeZlB5mqFYNKUfqBLzUCJZAoW3zZ\/A\/YIYboAaPnRyO7yQO6Aja7neqxlVgC1KQpbRQB5O\nb\/+OoyV\/Z6sj6qOgk9miK3sJOjIW6w8MtIUqdAWUPrb0u4klR0D6pYkBZs9HV6Ydnqcv0BtYGrgQ\npWEOUPot4BjYehK6LGt0pfPwPMVab6BaYsf89eX629ErGR43QGYuvF\/Rocuci660eXiePEd\/YPAi\nGriangdn0wNmDS6EunOzw4BnTZLXNeF0BecaBCwLX86M4hy+JX6I9tBQXB1k6wOP6q6+IrsK2jAa\naKUXsDzCEfn0JF11SPSsMsqd4\/2ZO\/VGbx+33Hjz+Dp62y4NGpgvmITzoU64Gr\/vKuebR38jK4zQ\npo153azseFbkgcdl\/h8ElvuZ4VLocjQd9+1olkpS6qN8h2YDfQC0nob+WCZ821Sk6dWerupSH3zY\npTqI5wX78VgZhgcyCe5nRd57kBOrac8+pLmVFiW8k6gf7A\/1ZsXM12HjeAAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/stock_sauce-1353117948.swf",
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

log.info("stock_sauce.js LOADED");

// generated ok 2012-12-04 11:29:19 by martlume
