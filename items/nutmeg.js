//#include include/food.js, include/takeable.js

var label = "Nutmeg";
var version = "1354586743";
var name_single = "Nutmeg";
var name_plural = "Nutmegs";
var article = "a";
var description = "A sweet-smelling nutmeg seed.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 12;
var input_for = [47,67,76,227,326,328];
var parent_classes = ["nutmeg", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by nutmeg)
	"energy_factor"	: "0.1"	// defined by food (overridden by nutmeg)
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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
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

verbs.rub = { // defined by nutmeg
	"name"				: "rub",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Examine the spice",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('spice_examiner')) return {state:null};
		if (pc.metabolics_get_energy() <= 5) {
			return {state: 'disabled', reason: "You don't have enough energy to do this."};
		}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("You polish the nutmeg to a shiny gloss. This is strangely rewarding.");
		var val = 3;
		self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		var val = 5;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});

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

		self_msgs.push("You polish the nutmeg to a shiny gloss. This is strangely rewarding.");
		var val = pc.metabolics_add_mood(3);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_energy(5);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'rub', 'rubbed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

// global block from spice
this.is_spice = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_spicerack", 1))) out.push([2, "Spices are much easier to manage if you have a <a href=\"\/items\/271\/\" glitch=\"item|bag_spicerack\">Spice Rack<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/289\/\" glitch=\"item|spice_mill\">Spice Mill<\/a>."]);
	return out;
}

var tags = [
	"spice"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-11,"w":15,"h":12},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKg0lEQVR42u1YZ1eU1xrNx\/shZgoz\n9CYIUqVbQbCBiEhRLCi9Dr2XoY\/SpINopAtEo0GxJcYUJzc3t3zLT+An+BP23c8ZMLhM7rrJzf3G\nu9azGIb3nbPP3vvZzxk++mjn2rl2rp3r3bXSERbyWXtkl9RKe8T6SluYdakl1LrYHGKdawi2ztYH\nWT+t8bdOV\/pZpyt8uyZKvFMGir00\/1dQDzoju+53Rf282LIPc41Bqj7v3o\/V9nA86IzAZ\/y52haK\n5dYQLDbtw3xDEGZqA3C7yg9T5b4YL92D4SKv9YH83SF\/Gqjl1rDY1Y7IsXutoW9vV\/lgtt4Pn3eG\nY\/3GATzrPYDnffvxtDeKv0fiiYV1PRL320Mw1+CPhcZAzNf7407lHkyXe2O0eDcG8jzQc9WV5WId\nyND9cUYXGoNjCWpjtj4A4yWuWGryJ6D9eDFwEF8NR+Pr0aN4PRaHbybi8PJmNB73HsLajYN42n8E\nzwdj8OVwHF4MxeLZQDTW+w7jUc9+3GsOxGyNDyZLvTBIoH1Zruu\/G+RMbXDs3dpA63ipJ\/pzDJip\n8cKzvii8Go7Bt5Mn8MOdBPz1zml8NXIUD3sica81GA8tUfhqNA7fTZ0i4BP4evw4\/07gBChgBfTj\n3sNYu36IjPrhbtUejBV54kaWK25c+y+ZvEsD09TrUxU+GMh15C5d8agrlIvEqIXfTMezTuFZ\/0Gs\nmoPouVCyFAPr7XgF2Ergb27FcxMn8Xr8BF6NHsOXBPji5lE+E40nBPiYAJdbgjFa6IGRQneu447e\nLBdYMh0X\/yO4yQrfEHbbxlCBG65fs8M9yrnWE4FXY8cUI99OnOQiB7BiDsAXlnAF5h\/zZ1X9NJeE\nH+8m4vtbBD8YjfudkWyaCLJ6AE8HYt6Teak1nB50x3SZF+5UeGEoXwC6EqATOjIMsb8KTtp\/wrQH\nXVcMuJnvjGX65FFXONmJJRPH8Zye+8zsj0fdIWToJH6aTVLA\/rWYjH8uJCtwT\/oOQTp7nVJ+v01m\n8eEambtnjsBsYwioEObrfDFT7fMBwK5LDhsfgBsq9EwZKvBE6wUd\/eaElZZAggnGOg3\/tP8wHnTs\nY3QEsyHiFGs\/fpr4DuDf586QscNYNu8jSzFK5je3E\/AN5RU5l8xhuFUTiLnmUDyyHOQGI7HY8D7A\nwTwbQPMFBwGI98ANFzh53Mz3eGvOsCN7Rj7sR4ABCuDD7gjmmB9NHaXY+H4qXi0uIP42c4aAorHQ\nHID7HWFK4lfs5jXGznJbGKaZeTP1wXjAfHxO\/4nEa5b9ShlZY67Wl+C86XFP5cGuK86oO2f8EGD7\nRft1FhrTtJCOld0tNfqp5pjjB8niX9ODrwlwq0mkKZbZIPO8T+6RTJyp88OnrDlmHkNcde9Wk7wk\nwC96orDaEoTZ2r2MK0+MFHkogKNFNoAlCXq0ZTig8+I2gFVJ2pxu6l6XooU5Q6LEB\/Pc2XCBI27m\nGrHE3UoHvhqNUz58PX6MrIbbgG0DN9cYQPmiVDPJBrZi5sXQUSoQjJFihnKmg1qjK9MRE6W7VQ5O\nlXnTUu6oSDKg4owBPVec0Jpu\/AVgc7rx53ZSWntOy651Ubl0M8+RDxkxUuCE1dYgPGHoSqNIzEjW\nCSiphUZ\/jrcIPOf7Ivsbxsx3Ei1jwtgRrPBey1V7SCJMmrxwt8ZXSSsKLdTvVeBaLjihKF6P+lR7\nXL\/qgsZUI+rPGWwAy8\/8xcOcYY+GVDsFcLhwN\/qZe71ZRgzk2CuZRZL7bfuwWO\/LQHVmOWGi2EVN\nkxeDB\/Fy8BDrMF4OHHo36tZ6wjFW7E7GjPxMN3zeEaL8vMrG25K3Kd0eecc1KEu0Q3emC\/qyXZW8\nBSd1aL+wyaDp9K6cdupdmaRFy3mjSvO2DD0T3Yjb7KwlyibdLONtIMeoSkA+ZDA\/sUSoWStzd3ut\ncEM3rtkrcNJwfdlO3LQLerOd+TvJSLND0UkBpkfnFVfGmUwpN7RfdERWrBbNacZtABM+GRNgFWe0\n6LjkSB\/q2EVaPuCsIkDkHsx14CJG9LOmTO54SDYE4BfdYYqpxwS6VeJfC4EJuG6C67xs5OdywYsG\nXM9yQmcmQWZyswQ1WuytFJM53HLBEVePatBCVjuoqDl9U+LSBI3VdFqD8kQN6EWwYdQOJQ8tV50U\nmz0MbWH0TqWX8qPILZJtAZUR+KB9HyV1ew\/cSJG7klNOMPMNcszyx62KvZgs88FYCRsj1wNN5x1R\neEqH\/BOUlUq2E1xdsh1aiUEBLI7XvK1NNqA2xUj2bEx2XnZSnqxJ1ipfNpDVsVJvzNbR2FxoqSlI\nzdCVVvqScSIeE0Adl2wZOm7abTta8fw3WxfIifELuL5NUMXxOuQc0yCHHqw8a+DzToq9\/OM6tJ03\noCVVZ5skDalM7ctuMG9WfZq9AimerDqrRTtlHy32UgdMWUAWkgXldfdVZ3aeTm1ESpgfM8kZkQdT\nArvLw+kE2eq55qYIKE7QovS0DtUkpDGdWXfZhamhTjAkwciG0TFeDIq9pnPars2A5ukhi34oI\/WV\n\/hgq8UH1OTuyaacaRjwiAAfFyAxSM2WoJph3dda2kTYanAcMBV5qtGQPARsZvBr+ZMwUeqkT9EiR\nl7JPX7Y7WjMcSYQBuce1MDGgzewF8d479uSqT2MD5Hkz\/YNU3akNRG+uJ8SXZfRlOdncYvTXqi5F\nrwwv4Laqk5FRyudNiVr1WoCJtOaLTqjhGDMxVmRi1CQb0UTwHdx02wXJPvGeHo3J2l9OMqWn7axj\npXsxXU2fVAdydoosfmDz2BbZBKrAbgJuSDModixZbsrsYvrJMl\/053nSTzrFGr2NZnam8jYDuDWD\nJxTJOsZJX7abOvddp0W6L\/MeNkUpAW9Km\/PeDM6O25UzUMDvCFWB9FUApir8MVnurxaoSqJhLzqo\npulmPIhfRB6RXaTakr6XY6rpvP07YJVn9Uq+Xsoo90rOSZRY+LwAlryz8POEuQJ2byFLwDWf0354\nUM04+ZGm9ZLbxmxDqGJuwuRHSfxQyCAtOrW5YJKeYPX0GytZyk5VDSUpibfdU8oGkCwbzPdg+Dqj\n+bwDJ4WD8lg1u7QuxZ5yOijW5LxXT6CZ0Zrt4Kp\/8wSdFfNx7GCRLxaawjgx\/OipPQpcTbINVHmi\njtLq1HvbS4A3cG628PzWlyMN5IgydqnElYUztV\/J6bopp4vtpEzWCjnKLh\/hphg1Lan6jfc891sX\nu2hsjgDXeo+gr8CHnaVBRaJkklEdfcQrcsoQaYQFiQZZWA6YcsAQRgvIeuclJ\/We\/F1qizGb1wzI\njNEg95gWjUyJ1lT9WPPJ3\/Et7trRT6rzjn2CrDgGaJzsUKukLjmlpZRaJWNpgk6VSeq0sKpVm8ln\nySSQDQgg2UzPFUd2pz1jyE6NsSJOjJok\/QYlzWlL13r8oe+\/tYkfx1Yk7LIWndAgO5bdS1B17Mxa\nVjkBFRNQcfxW2cA2pBjUiJJTsFRLukwkYVTLEaal7HpKaWdtTtOm\/Gn\/QahN2JVSc2bXYmWC5q2J\nTZBPwAUsE4EJUJHfVnpV4qc8Bm5WrLCpFd9uNKXarZtT9dXN\/8t\/DHaunWvn+u3r39nzl0hpNGXW\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/nutmeg-1334275992.swf",
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
	"spice"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"u"	: "rub"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"u"	: "rub"
};

log.info("nutmeg.js LOADED");

// generated ok 2012-12-03 18:05:43 by martlume
