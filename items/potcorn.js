//#include include/food.js, include/takeable.js

var label = "Potcorn";
var version = "1354649314";
var name_single = "Potcorn";
var name_plural = "Potcorns";
var article = "a";
var description = "Pot corn is a regular corn made to pop because its kernels have a hard moisture-sealed hull and a dense starchy interior. This allows pressure to build inside the kernel until an explosive \"pop\" results.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 136;
var input_for = [];
var parent_classes = ["potcorn", "food", "takeable"];
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
	out.push([2, "This can be made with an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && !pc.skills_has("masterchef_1")) out.push([2, "You need to learn <a href=\"\/skills\/47\/\" glitch=\"skill|masterchef_1\">Master Chef I<\/a> to use an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
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
		'position': {"x":-14,"y":-33,"w":28,"h":33},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIwUlEQVR42sWYe1BU9xXH+b9mbBqT\nTFsbU6e1TYtl1FSajCPWjpmk0RAziSZmlI4xaZuk+AJtTRBDAjGpgaCbRUBZ5CWvZXntAkJBEOQR\nEJSHEHZZFpbX8lhYRMRHT+\/3LL\/bXazhIbF35szd89u79\/e53\/P4\/e66uMzjEXnypOcppVIDi1Iq\nPVz+X8fpkyfdABEZFmY8FRZGZ89EUtUFNbU0N1F\/fx+Z2+upqiSJSvLjPXHtA4XFZJFKZS3AYAmq\nr6i68ASNW7Lp9s0BunNrmM8TQwVUV55C4jrpgazfGWh4ePhCDp000dWyYNJXBZPp0hdka\/2nbKPG\nMBozx9JYZzRd79GwbzWeIf3XoVSQfpwhofjpsDB\/GNIB9517PimVIeLpU2MVlJGooLLzWhobMZHN\ncJxs+mCasJbTndvXGBBw13tTGXAq+LWO06yo1VIvqTtEgy3H+X4SsGpWUPn5+Qt1Op0HQiHgslKj\nyfJNLE9085qe\/k13aGL4a8nK6PZELxtgb\/Rr6eZoHd0aa6Zr7RF0YyCXoTjcI3U8Bv96dxKD61JP\n2FVFuiiVXjMCzNZlh2hztFSQcYIKEg\/RSFcW3xQqYfKJ4VK6aaumsd5sshqi+DsY4ATMrfF2SeFQ\nGm1T8Bh8jN8YOEfjffbQA\/BqcQAVpwdSboKfHVQK+bSAaRo1AbAlbydbZ7mPPLFIfJil4Rh1V\/rI\nvqPhu54qHw45YKCY+G7coiNz+V7+vr\/uQxq44k\/6c9upSvcRmUztNGIbNtpstnuDpqQkMeDF3GDK\nydFQTe5hnhDKsUEtKXRQh\/NOyjf4CB9gYJgQk3MOSkqOWzJlhUfNydRbF0TdVQep79I\/qKtiL19v\nqggg2+iIbPcETDybwICa9735nJeTTOaaIBrrSpCVAIQAsDYFctgci2Lo6hecp+OWAn4QUTQDDYHU\nVriT2s+\/zb8zS9HBw7cV76bB3kYavHyZmp5Z\/+2AMdEqY+axY5S89JcMCKsozaChzjyytKawIri5\nocCLJ0WoOHSTkMPNR1kZAI51p\/FnAOGMhxpsCODfW1sVdN2QSaOX0mXVBtIzqVkClMJcdO8VIjxc\nA8CkhxZRZpiSAfns8QfSl4exAjCEBZN1lL4nmbcc8t7qA\/zdsFRAaEV4APgYt+lDyWaKI1tPIdlK\nY6jnb\/tpQJMmA\/YFHyf9C5tJOu7dG9FA0zM0DCjCrNm5i\/2Kox+TvjKK9GVf8qRQBqqIsIl8gpkv\nesuKohCGJcVsQwYZptf3oB1QUk2MwW\/f6lU07TKWEB9H6o0vU+r655wAU93XsF9YWECdlX5kKvkL\nKwhInOELwJ6aI2Qt+5wsIYdo6IIUxhGLDGKVcg0wsKHKSqexjh3vhEzbalSRkdaMjwIo6fEnnABh\n8LPORJPx3GFqOHuAlzyohBBCJXNNMAMOmKupJ\/BTGcSxQgfPF8vjAOOx3Dz2TVt2TN+wsfxkJJ6V\n8zD94N9lwOzUZB4r2vQMJT66mDcKA0326rXkJ9GwtYf6DHn2kAnAPb5OgAirABzuMPGYRRnBfv2v\nV7tNC4hlR61OoRTXlZyHomgYWPoMFVHl8MU63fbWZurw9nECkQGDQ5zGBYyjsr1+AWR64080450L\n+mHimnVyHgpAqAkf+SgAIxQKat2w6a5QyoChoU7jqFaM9wV9zj5UhG\/Y+GrRjDcNUh7WxrzympyH\nQjHk41TAo\/5H+Ok5p1papgXs8T3E41ASPgql66+76erTa\/1nvmOW2k2a7wGGQFGkbd3Gn1HdrOja\n9TKgv3Rdx\/ZdTknvCNgbecoZcDK8osXgjAg0Lnf3nNWuOUOlYghUtCgUKJelzSJW1wEQCmBSVONU\nwKHq6v8JKFpM5+GPAUdNT61YMqsdNPIQIUZYoSKAEpa5MlT0e952wA8+dAJ0aryTgI6qOvZAUcH6\nHW9Tw\/LV1lnvqLH1QpHIhSLBCtVUPvbwK7e84RTiGQNKeSjGoF6Dq3vRrAG1Om0t1EO7cSyMKL\/D\nDInPit9vcAIUiT8dICqZK7i7iwEbXVf7zx4wR6sSPdBxRUF4+VXziZ\/JgFV\/ft9pYgYM+OQuwMHK\nKntBBH1m74nFJXbA2RSIw\/bfS\/RArB4CFgUCwHi3p2XACq9ddwMeOHQXoEEKbba0AtUcsW9QO79U\nMKBh6arZv91ptdolAESIUcVY5gAY97s1DBj7wiaKXL6SAUtefOVuwCnrrSiIlIWPUX24PRXa3t2L\n\/DPO+dVTUtGIHigaNAoFygEQSkb9wpUBizye4zx0BISPBu4IeP6PnvyQpvrL1Ncj559mzoDIQ\/RB\nsdXCGbk3FTD7+ZeoacWzZHx3j1N1YswRUP3jnzKgvvEKtVZVzL1AHPMQPVC8AiQ\/v1FuNQCM\/dGT\nDJi8eQtP1vy6Fw0O9suAMHlLZe605\/NKdwb8JiXF\/hDLfzv3v0OycrPcxFqMc8J+XztgcLC8mjgC\nNm2V9oL9ff8NnwOgMS\/P3hHw+iAB1vsdmXuBOB7ql1+1AlAd9ClFnz7Fk6BRh2\/bLgPGvbZNBgSc\nud3gBAhVpwLmvuiJ8Nbe9x9HKb9ZpcKNUbX8b5a03EVI6h2dXJ8\/e3M7Kd56RwY06VvI0FTvBNjW\n3Ejlu\/fx9QWvv8mAqT9cQnW\/WqW6b8DE7\/1gN26M4kCTjlu3gZTPrmXlkIOOgI3u63jyhtpq9muf\nWkn1F0t5DMrhPiV797PPe8wFi\/zvGzB5wSIPsWEVGwZRvTgD8JM9+2TFSiMiKCdXR0U\/+Tk35eqy\nC9R8+RKpJ5fK2tgYBiwPDFQluzy80GU+jsSHHvGUzCogzzy5jAGxkgS\/tJk\/C8B\/Kb5y2oUX6LIp\nO03N\/RP3aG28opLM02W+Dzxt0oJHNGJiASiWuwLXVaxa7j5fedURLYl3QB\/4zZ9i06kZ\/\/3HWEWE\nGHnomAJTTbpehTR5oH+iB6xY4Rb78OOab4EyogAeiGLTvmAtc\/WPWby0FmDxjy4ugsLzef\/\/AFq6\nirnBKLA5AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/potcorn-1353117672.swf",
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

log.info("potcorn.js LOADED");

// generated ok 2012-12-04 11:28:34 by martlume
