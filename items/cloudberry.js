//#include include/food.js, include/takeable.js

var label = "Cloudberry";
var version = "1354594455";
var name_single = "Cloudberry";
var name_plural = "Cloudberries";
var article = "a";
var description = "A pleasingly tart cloudberry.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 2;
var input_for = [49,56,98];
var parent_classes = ["cloudberry", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "fruits",	// defined by takeable (overridden by cloudberry)
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
	out.push([2, "This can be made with a <a href=\"\/items\/265\/\" glitch=\"item|fruit_changing_machine\">Fruit Changing Machine<\/a>."]);
	return out;
}

var tags = [
	"food",
	"fruit"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-8,"y":-13,"w":13,"h":13},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ7klEQVR42u1YiVNT9xrtf4Cdec5T\nWZIQ9lWLKCoaBcRd2Te1uLcqGiAgImosWFFRIgIiLuCCG1WxdZS+uuRZa9UZNa4oKgRBNlmCoGAR\n57zv+\/Fs66jVB9rOm2lm7iTh3pvf+Z1zvvN9l08++fv19+v1V8kcc6OHMU6a2rXD9XUpI1AV1w8P\nIh1wd7Zlbkngp0Z\/PbhYZ11Dxmi07A1Cc\/Y4NKwchOoln6FsoT2KZ8q1lYuc1JWL+qorop3U+nnW\nSr7nTwP4YL5NePXS\/mjSjEBrljeeZY1E83oF6r4aiAqVE+7NthSfG1MUaNw8DtVJg1Ey18pwY4qx\n858DcKGduoYANq4agoavB6M+0U0cj5a7glhD6XwbVCe4oC3TC49Th6N+vQceKO1xZ5pU+9FAlUc5\nTnopW9kCey0DqYrvB0PaSDzZE4i2g2F4nOGNR2pXweL9OZYwrB6CFs1wPFoxAOXkz+Lp5vgo4B7G\n9dXUrRuBBgJTT16riHYUjDxKHoon+0LQ\/u1UPD8yGU83eggvMviSuda4Q4Ca1rijZqkLedMOd8Jl\nHx5gRZSjok5DHssLxNMDIWjJ8BIs6RfYoYaYadntj2d7\/PHLllF4soHkTHIjgM4o+dIatyabiY1U\nxvUVBcTAy5T2hpI5VuoPJ220Y25Trh+e7g\/Bs90+aN86mlgZInzGC9cnDkTT2qFoXjcMjcmDUbus\nP8gOVCgWuBFiIoA1rhqMRrqmaac\/6jLGoDy2H1d6+AcC6GRoSB+N5sxRolo7to8R3ro7y0JECucf\ng2JWa6gwKmKcUDrPBsUzzFH0uVQUD0v\/NN0DzVm0uR3+qFnnKRguCust6T5AMjd7iFl4nDJMsCYK\nZHE\/ISWfZ7\/xoY+wpbC2F+eYOQbP5\/nzc9qYsADnZdIQsYnbU8y6L3XJPBs9hbJgqYoWqllO8ZLm\nLaqX5WXWhKRUtVw8fJ1B44EmYpwLhs+zD7lYXmYl\/x5v6IMAvDfLQs3MkBdRHf8ZmrLGojU\/FM8o\nVth3XBTMGF\/D7xzOfK79yFRRUCwxA2LpBWBSg1nlML8VYtJ9gKUzZZK7M+UGloTZacn1wS+0eAfF\nSmuGp\/DjS5ZYyiZij8+\/KJyB1uzRFOSDhC04Zvh8hcpRyMuRc2eaeUG3WiDfXK5y1PICLAkDbN48\nBs8OT0F7ng9ayfiG5E6AXDB8XUOyOzEcRtdMRjO1QiEpsXf\/CytxDRcH5+PNUFMR6GSh3K63tCgH\nJQd008aRv0rJkjVv9ERLqoLixV0A6GxvtmKaqV7ignoC2bBmmDjH9zB7pAJ1FysUTZXiVhiBi3Gm\nyh8g\/MsqdQlg1VeDdM27qY1xEGd7C3nYh\/zDvDhHCwNgedlTd2daiM\/sOWaTmSujQCcfi0MUFHmZ\nN8fRw5vma2hEU3YJYLXaTXSQtl2+6MgZK4zOMrE0D4kBBswAuO8yM+SpTqZITrYEM8b99yYxVh7l\nQH51F5vjeGLv1lEn4srnQuwSwEqSi4OVJTVQl+AKZHZ4YfYSAyueIUfRFAm3MLFoJWUfg7wVZiZ8\ndi2wD64HGdPQoCDPeopuwyqU0yZfVv\/tz6VdA6iPsNNVLXMVUrLPaun9cZqHkIr7LDPDi98jwJxx\nXNXcMbj18eKlPDAQq+zVjr2+aNsxUWyic7C1E\/2cN3M90ETRJYDcL\/VkfjYyM1RHAc2SvxwK2Hfs\ntUaq5FaywYvj09GeO448NlwUkygeihS2xNMt1El2+opwZ4nvf2lF4GW4HmKs71YOEv253Hf5B2tp\nqmncPB6NNKQyE8wSH9xVWr8JE2NX27axIsB\/3zHuTJeJ74atk\/5b1fYsK6769caV8T26N2XzA9C1\nQGMte6pylQLVyQrhoc4W5yCqsD7VE817Oscx9uvLFsfnRcege0VhLRuAMpWzGDRuBPVRXxnbQ\/JB\nZ8Pi2VYFpQvsReVynDA7\/Lkygfrzdl9RUHXELmchAxIdg2Vkn3IMETD+fjPURPdRJmsej4qmSHUc\nHVy93BHu0jtXYgVVb+XSznGfwXeOXHJRyTrfXrgRbCKAXvXtpb3k9X6PpZeyXV69DheDnd9Lcv\/e\nyhsBfdTX6ND5\/1N5dqZMMMT5x4dgKlwmwB3164MNQaaIVPRCrJ\/ZryO\/yq+HRBXYU5kQ9naZr+QM\nnPQqwEuBRvUnff+nSTdDJQ3fEC3HZVXniC\/ihybpQ\/6mWBdghuWTpfh6ugR+7n0wn75H+PTURgb0\n1MYE9cTikH+8Nf+K8gZLinYPe73D4EJI7rkdw3NXx717ysimazZESQ25SyxxJq0vDiU5YH2kLWID\nzZEQJsP6+XKkzpNhzSwJghR9EEGgVcHEZGBPXVzwH1dv8b7han3+iNfzEVfCJO1nA3E8c5AhNd4q\nPPstQPnvm2KlupQIMxxKtMHJdY44sMIWmkhrJE2XI4mKIV1pDs1cCfYusYDS1xRzJxpj6TTJO5+N\nDyfZhN\/bPwIVh0e+OcCfaP00TScmoTB9ADYsttCnxclf8QIBU2TGSHUapRmyVBIC54DC1bbYEW+F\n1AWW0CyQI2WOFJuizZE+3xTHku2RsdAKMSGmiKViWTHN9I0j1sYIY+fNSuPca7nuqPpuNGqPer+Z\nZZzwMnp0bJyeLzqT5YYUlSXSYsyxKc4c+avssXmRDJkEbEusFEdX2aIw2RbfJVlhk6oTXPpCc2Qo\nZdi00AzboiW4mOWKc5muiKfWmDjTFMunGGPlDGN9yhcmGs08E3V6hIk6M8KkYJvKDLqcwaC10VA4\nwfCHNDcSyLJDXob7BzxwdedQ7EtyIoA2aPsxEPsS7ZG\/whonUhxwnMB9S+D2J8j16VEWQtasaBmy\no6XYEmmGA8vkBbrtg3B9xxCc0vRH6lwZkmeZYN1cU2jmmWJjhAkyF5hgO4G7nadA4\/cTwOo1n\/J5\n9yBbeshDUpQ3TMc\/fnmbG6iqgAv0PPJjAK7STgW4REscXC4zZEbJtXT8Bi7KDDkqU0N23KdGRbuG\naor3KsC+Kv3GEz+TKgfUdti3zBr5amsUrnXEwyOj8PikD56c9kPbmQDgnN\/7dZmSfBejy1vd1Oc3\n9Tfotg1Cx7lg8SP1hRNwc9dQLg5DDnvyd+ByYqTYmyAz5Kl+e+7V53sWlB\/2FkCqj47plJHZ+kGw\nhadaP7Hx5z8FoeN8aNce6k+nOk5q+GGirr5wvFioJN9DsHqF2P05sz+0GicqFjscWiHX74+TvWbw\n2mNj1XXHadj410QhY8tpX7T+m6Z1Sg3eOM6HGnAxtHv\/cTB8P9654oi38OYtYpDYJXAuOJ3qhKMr\nrbEnXlrAsr7t\/rZTfpIWrY+SZFQ\/PxugfnE+SI2LIWpcCFZyo\/gw\/2HN9xKyX8hy1f6U4aI9td5R\ne1BtUbArtouD5\/\/76z+P9LjCoQpnhQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-03\/1268323693-3312.swf",
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
	"food",
	"fruit"
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

log.info("cloudberry.js LOADED");

// generated ok 2012-12-03 20:14:15 by martlume
