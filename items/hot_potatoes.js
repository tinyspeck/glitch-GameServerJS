//#include include/food.js, include/takeable.js

var label = "Hot Potatoes";
var version = "1354649248";
var name_single = "Hot Potatoes";
var name_plural = "Hot Potatoes";
var article = "a";
var description = "If a glitch gives you this 'tato, drop it like it's hot. Because it is.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 66;
var input_for = [345,347];
var parent_classes = ["hot_potatoes", "food", "takeable"];
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
		'position': {"x":-16,"y":-20,"w":33,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIFklEQVR42u2Y+VPU9xnH+Q\/8oWmT\nNHZMxyMEayhJrHcxGm1iKmtMalNNQ2qdmmo90AS8cDlWXGG573MBo1wicgmosE6G24XlWGA5l\/vG\n5RaPmXc\/z0O\/O9AQp8lkJv2Bz8x7+C58v5\/v6\/M8z\/v5fBYLi8WxOBbH4lgc32sYfNbJGn3Xy+eK\nfteqfGvJTw\/nvcHX4LMBJL3nWtw\/82vkOryMKg8b\/p0E+5PAtak2LiuVv45i59dAP6VrgpQ+axVv\noMbrdzAE2BrbY\/douq9+rOmI3QNSY8h2NAZv0xmNRtu2trZlPzpggdduWeqRFzlipOwTL4E+F7uu\nRpX3Bhhj7DCSdghDN\/6GiZzjeKI5Y9Z03km0hu9kyBZtDlpaWtDU1GRsbGz0bW5utv3BUACWTE1N\nycfHx00NZXlQ7fsZgg68gNBPX0D035dCH7KLoabyHOYBSXqc\/xWmsg9j7MYneJj4EQP21BVCzIfh\n4WF0dnZCQMJgMBgbGhrsW1tb\/\/c6FmAyId3o6Ci6urpQXZzLgH77f4ECl7cxlnUEfQkHFgTjqOUc\nRV+8DN3R72EsZZ85gto0b8zMzODJkyd4+vQp\/+zp6YGIJPR6vam+vv756X\/8+LH19PS0ZmJiAt0V\nmWhMk6Mk8E9QH1rKgCWX12M46c\/fCTZz1wHjNz9lKElNQbao9d3EunnSEpLRSPWqdTAEbocx4TCa\n6qpQU1Njqq6utl8QTqzGXsCZ+qtz0BhuZ56Eao7g7l20Qf9VO35pT\/xeDKbYz0vnZOYh9MZ+gI6I\nHWa4zuhdKHP9DXRX1qLUZTWu\/\/NVlIu6ZdcHbkWR3Ar3z61AU+hOGL+2x0C3kSAhIOXfgqPQd+V5\nwuC3GU3BwnVB70AvXEmAEQeXcopMSR9zPRHIxK3PWA+T\/4LWsHfRErwVxrDtDEb3tUe9x880iHke\nKKxx94wlA9J85P4a5VuzQaD3BW3j9xmvivkePiRA6HS62UiKWrAVqUWnoRKN\/r9Hjc8m6LzW8Qqp\nfSR\/8SIyHFfPujBshzmKc1XutoZF4MMJe801VyfmK3WzRtbp13D1i+VIO7bU3Akk3fvyV9C6r4FB\nlAABj+qzIFoRAZqkujOaTCbU37gwuxIBRjfSCnMcfomIz1+CPnAbhq59yOpSf8DR6Y3bzZGSIOma\nUtoU+i7D1fhsRvaXlkg6bokCt82oD93FPVHvvwVVqvUov\/RbaM6tFO94hUEZUry3I\/kIyJwCEBbP\nnj2zp+gRcYPa3lx3lSIld069gryzr2Po+kdcX+PpBzmNg9f2cprbwnegIdCWgUkUXQKrFwv8xn0t\nMh2t0az+BJN5p2adffc0i\/okdYGhlM\/4fn3AVtx2XMW9lVJPmh7pRGVlJSi9cgKk5lmX7cdR++bc\ncl5Ribs19zAywEJuncw4yA4td3sD2ks2Zt09a4Va\/23cA7\/L7aRHucc48pQVnc8WRH3+c35v2r9e\nxuTYyLcBaypKURR9lG\/SnHmVHyYTPO8lM\/dOQx\/8Pq4dWYEMh1VIO7kKhuCd\/Ox46n6Mi0hR1OaB\n3TmB0dQDXK90H9UsRZI6haRmvXYWUMDJyb3t7e3UKCEaJXT5CagPn2MEEcXe+A\/RIFIxnLyfI0Or\nn9tiCDLu8HIUe2yYbyDxLDVtgprI\/AeXx2zU9pibONUz1WuKqx0SXezQXJ7NLBUVFbAQuwQDUlFK\ngGLbQc1NBfS+Gzn8\/+1YSRQhhhUvp3TfufAmKj3Xm41DdSpBSJ\/nGopMRnVLbei2oxWk0dfXx9FL\nTb0Ji7i4ONnIyAgePXqE\/v5+M2BtwXUUXbRChceb3DIGvt5jnpxWXyOOWyS6Nu8YotlSS6GIEMxA\n\/G42lQQpQVGdUvMmM1FqS91tkHTKhuEGBwfZvaWlpXBxc1fPnlQK7hvFDgKx9zKk2LxZt5V7kedo\nCc15K1SJvkiONUb+gdUU\/A43557YP7I6o9\/HrVNWSD2+ku+lVkMtR\/o7uVxqP1Lzpq2PGjg9k+t3\nkA8PVVVVKCsrg5dKZXRycpo9PFAUi4qKGXBycpLT3dHRwRt4UVoIEr\/ayCYgWHJspfJtVIs+pvfb\nwqpQrkXK8VVcg6TkYytR4rqGQeeKtjsperTtUYbIVPSMJsmPd4\/CwkJ4eqng5OxsPW+rU8fGq0Uk\nQemm49DY2BhvOXSSEYdMlKSHIkv1V54s8egK3hkkEXyy0yY0lOWitbZYXG82gxaIPkowc0Vg0s5C\n96UKcxDcrfR0uLq5m846Oy98RoxWx6oTEpOh1VZgaGiII0mQBE2pJ1hKQ2tTPWoLM6EvyoK+OBvG\nBh0GBga4fuic19\/djup78SiIOIHsK\/uQem4Lw5JocVKkU91kKM5NQH5+PgICg3DBWa45f\/78849b\nMTFxssgote7a9UTh6joGI0B6MUETBLmst7eXz3Ekul5I9Dcqlf+coPlwSgYkI5aXlyM2Ng6XPC5D\n7uJiunjRRf69TtORkTGyiMhoU4w6Djm5eTwpwVGkCHouZHd3N0eWYKifUknQ1ilOyPPgKioqkZGZ\nhahoNdzcFcKlbmpXV1eZk1L5w74RhoeHLwmLjJSFhUUYQ8PCERIahuTkFBQUaFBSUsqOo5ZAPYua\nqlarxYMHDzg65ERaWHpGJiKjYoQrfUS0lFBc8tC5KTx8FQrFj\/vFKSgqallISLh9cHCoOigoWBMY\nFMx14x8QCD\/\/APj4+gv5QeXtyzCeXt644umlUyq9NJeveMkVSqVMoVAtW\/zPwuJYHIvj\/2z8G+UZ\n7UGWZG28AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/hot_potatoes-1353117428.swf",
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

log.info("hot_potatoes.js LOADED");

// generated ok 2012-12-04 11:27:28 by martlume
