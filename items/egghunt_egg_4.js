//#include include/food.js, include/takeable.js

var label = "Secular Holiday Egg";
var version = "1342483399";
var name_single = "Secular Holiday Egg";
var name_plural = "Secular Holiday Eggs";
var article = "a";
var description = "An 'oh-so-delicious' and delightfully decorated chocolate egg. Inarguably tasty, this treat is not affiliated with any known holiday or group, religious or otherwise.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 150;
var input_for = [];
var parent_classes = ["egghunt_egg_4", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.33"	// defined by food (overridden by egghunt_egg_4)
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

verbs.eat = { // defined by egghunt_egg_4
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Gives $energy energy. Grants 'Chocolate High' and 'Sugar Crash'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		if (pc.knowsAboutEnergy()){
			return {
				energy: Math.round(this.base_cost * floatval(this.classProps.energy_factor)),
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_food_eat(pc, msg)){
			pc.buffs_apply("chocolate_high");
			return true;
		}

		return false;
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "Collect 5 different chocolate eggs to get the Egg Hunter Trophy!"]);

	// automatically generated buff information...
	out.push([2, "Eating this will give you the Chocolate High buff (chocolate pops your mood, energy and imagination)."]);

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/egg-hunter-trophy\/\" glitch=\"external|\/achievements\/trophies\/egg-hunter-trophy\/\">Egg Hunter Trophy<\/a>"]);
	return out;
}

var tags = [
	"egghunt",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-19,"w":24,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKQklEQVR42u2YaU9b6RmG8w\/4CfMT\n8mE+tVJFpXY+tSO1HakjtTOl09EkmUkmEEhidkMIYQtLAsMOZt93B2LWw44JXjBmMTa2MTvBYPYd\n7r7Pe2xsi0w70+lUqpQj3Tq2gcN17ud+nvf1uXHj\/fH++D84qmZnbx4ay\/0Pt4tSj3fLhJP9cuH8\nsEo4P6nR4qwe2HqFy9lO66WyV7hUDAqXbYMCXg9I8arPD\/Kemz8LVITGcTNKvStrn1Na7RslOHAU\n4Wi3FAwOZ4dVuLA3AtOdwMAQ0D0KCG\/c6mHvu5VA5wigGAQDdaClV4aGLr+fBCXp3PKRDKz5h4\/a\ntbHqDehtDdjdyMP+ZiEOt4txvFeG07U6XKo6xX9OMH0qBqkGhrTA8Lgoek2f0c\/od65A+4EmwYG6\nLj\/UdPr8SDizz6PeJW3o0Dpi3qzCMF+B7fVs7NrzcbAlw5G9FBcjCuD1oBuuXy0CjU4AY5OAakoU\nvX6jB5Q6YFDDfk8lutwxDLQNAM0CUN\/lQH33Bz8I7haDe9Bh1j7uXQIBKo312Fr5DjvrOdizF+Bw\noQyX8i4qFXNiSCwfuUNOEZyaQY3PABNGQG8Uz7pZQDMtwtJN0M30XIPERY3C\/98CfttmaAzstOCx\nsIg81Rg2Fl4ywEzsvM3F\/nwJLpqYc409YokUzsy53CMAgps0ATMWYNYqil7TZ\/QzT0j62\/Zh8Vrs\nmpd1HTirUsi+F+62XH\/zfqsBD9rnEC6YYDOnY2NRBNy1FeC0mXVobQe7WDcg7xOzRA5S2a4ADSIM\ngVkWgfllwLwAGJyQ2hmx5OR475gYEU8Xa9txWtmmfWcu7zTqpPfk0whQmFCgFLBmTbkCPOqsZXf3\nmpWhnV+IX5AuzDM4JuaLSkylpNKSayabCEmABMxdNHi4yG6sdxiXym6cj7fiTNeEU3U9TnoacdRR\nf93J27Vq6zfNetxvM0Cpl4mArMTbU\/k4KZfjrLIN59UKt4ueOfR0UevM4PScCEru0Wv6jH6mYTcy\nz9zfawPNzvPjapweVOCYjS4aYXubBTzzB92VUi\/Ar2pUuNMwjqDWcSybErBmSWaAL7DbUY7j0hac\nVrxiLrZxFy\/r2HhpcmaRcsSz6NEs1MEEQw1CIufI3Ul2E0fs785eMzXj8rQO50fVbKZW8NnKAdm0\n2GaAW+Zs7LXU+F4BflEx4rhVq0Zcu4AlYzxWGeBbWxr2S2txVNKE4zIX5OvrkORkl1LM1YDHyKG8\nuUbNHLuBcxaNM1aBs1dMDbg4qeXD\/mSvHEc7JdhnY2x3gwGuZWNzOQNv59Pcpf572aDwZdUb5Pc0\nYGk2HivmJNjHsrFfWIeDoobvh6SupqahTNLooJJTLvudg5vyqWHvz3qccFTaJtE9Z3l3dqoxvDyK\nbpsKnZZRKExDGJ1rwoIlA6vWRNHFz4t6ZV+UDaNEqMSiIQ4rc0nY7MrFXn7N90CyTNY4M+lqnFdO\nUHKUGoi7ys5H7EbO2Ig6a70q7cVxDXOvEoOrE0hkKYibPkes\/gQx4wdgSysi32whbPgtJP0rjRzw\nL\/ld\/n8r7kdRVxkWZmKxbEzAZlUhdnIqvSGLm3gm3Y3jctMJSmVv6RVhW1n55zqdYC1MjVdwK9sK\n5Jr3kGC4dMPpDhGt2YNUtY2I0U2EDK5B0rcEWnpv\/Cmj+4O\/FvSgsL0YtumnvMwbFXlwZJZhO6cC\nu3nV2CuoxYGsHofFbBSUNLvd9AC9YI7y0hMsrTqHjRyMOvaSZe6cwRnsAxwsnoE9mzxlcMfcOU+4\nUOZecP8KHvXY8KDLKm4uPs1SWPPaCjE\/+QQLhmfYeFEIe3oxtjJLsZ3NIHOrrrl5VNqMkzI5Bz2t\nbOX5JFgq\/4WqhTcCOUZgZ0dVWHK0IXl6n4Gd4OnEMXftiXafl1U65vCGExZAK1tE65TYLJ+ky\/1z\n5Lmw6KO4i+speXibxiBfFmEzowSOrHJecpebXqBOR6n0HLaCwdqreZdS1k4PKlkz1CB7ZoW7RVDk\nWJR6R3SNZS5caUemSo+m8Q6MThZhWJePtrEyRLWqtBzwt\/E1PrnN6Q6zLhJW5uJySibWknOxnprP\n3JQxSNHNd4JS6T1hWxr4npFGCG3PSP22IQYjAkUyt6gRyLGwkQ1EjyxCY6zE+nwqnyA06qgXiEPf\n8xJX4ya9Pl1q0obDMhGFxdw0rCRmYfV5jtPNAuamjLt5DZRK7wmrruSzjUR7SLYLR6LKxjuTRGWk\nJggeWEXk4DymTMUcbtX8nC8UFLH5qRjOMaRMcgOSi8becO3ceARsWc+x+Cwdy\/HfMdBsrD1nbqbk\nO8vudPQ7EZQy6gm7Zynig3d\/q5BvdMcsctA2jovtlkjUAA+7bWjTyb3gFhmcjeBY1IjDNBoOr2Vv\nVh5x06gJc1hK42CLScNC7EssxmVgOSETK0meoAW89PZ0MaMclrqeGortwD1VPDbAd0ouBbSb+MYk\nsmsc62zdd8PF8fxb9dEwj0fCqA6DSZA6rm0eZlUhfqaaaFikzzEfnXIFuuQCZY5S6deS83hGyVUO\nSw3F5qdjNQsOtmTxM1OYQg3aLbl0t2WKaRI5fQq+KNDc5c55wJk0YTCMBcOkkDa+c49oKJHK5sLj\nYY5MhCXKG5QcXeKlz+KuesFW58C+lH4l01wubtdpronW\/m5VIZ+51BDzzrK64GYZ3PToIxhaw9+9\n2zZL4n0MwTEyY2gcOGiEG3T+SSoWnr7AostVButydq01nWdqnW026DzCxsUX5SNc\/6hwi95P6FK4\nazR7qSEoc0YPuMmhQOu\/\/BrAIR\/FCLPBT2EMfQZTmBNUmgRrVDIDdbrqhOVN1ZzGR4VLA6psfFYo\n4HNZ7zWRa7ykOinmtAxOHcrLyuGGg6AfCpD+oC9UUw+jhJnHT8BBQwiUXE3whnU6aytIxuJsHC8d\nnQXlS\/w56zXYSoVPs9vdYu8nNU\/ETiXXVCEwvJFgWklwgdD1B2jNqls\/7GupWSLxmQqMkE0\/jAKB\nGiQxDDbW6aob1hyZBEtGAh8TLmlU8fhDWiPXH180eamxIwmzTtdmRh9jauQhc+0BJgb8oR+49+Of\nRkwEhMkmH0RgKkgKb1jRWcorAZsnpDxTdCZ99qIEv0uo4vp9YvWVPkkux1BfOKaUD8WSDgYw5+5D\n23f3P3\/6oLsb4qfzD3MQ6GRgpBv2UfQVsFEulo1Eoa999QwfRRfhoyfX9XFsAWIKk5BUHIfEolgk\nFMb4\/eRnNqpbEp\/xe8GC7tsQTPiHQR8QDi\/g+AheNsoUaYYpOCsRvqHZXL8Oy7mS6zPf0EzHr0Iy\nff+rD5c0Xz\/yZRLG70qguxeMifuhbuAKylQQpljpJrkCkVocid8Ep+CXQS+89IvAtNQPJTk+P9uj\nOc1XD3zVt4MaGSy03zwGATOHoSsJ5IHXkVi2SMOd9yFJC4NvYKz1w3vx\/h\/eivf5nz1DpNIT7Nit\nwFTV7SBBdSdIUGf4C+ribwV1\/V2ZVrgjVXV97afp\/vKDG++P94f7+Ce5PQxN+xdfxgAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/egghunt_egg_4-1319159462.swf",
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
	"egghunt",
	"collectible",
	"no_rube"
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

log.info("egghunt_egg_4.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
