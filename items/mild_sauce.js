//#include include/food.js, include/takeable.js

var label = "Mild Sauce";
var version = "1354592951";
var name_single = "Mild Sauce";
var name_plural = "Mild Sauces";
var article = "a";
var description = "Bland ho! It's some inoffensive mild sauce.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 26;
var input_for = [34];
var parent_classes = ["mild_sauce", "food", "takeable"];
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
	"food",
	"sauce"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-32,"w":20,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHZ0lEQVR42r3Ya1BTZxoHcD\/tTHfZ\nYnVbt3Qr0lELFQVUoArI3XI1KAbkolyC3BGR66oYuQcCBiIoghASAoFAuEhFUaahVSgUBAwIgRqy\niyggq7ju1O63\/77EAe3odms47Jl558xkkslvznOey\/uuWvWO10SEkbYyxJSmDDVhLq6JUFPp25Yy\nzJiz9D3ym4kQE4NVK3kpw0walWGmWM4icKUieIfmigDlB\/Wl9xk71cbJA7ajw1EHK\/YEh+03SYcd\nP8eoxxb8yDCCIpJgY01xP9IY42E7MBpshHsMQ8j8t2HAVx9d7pvQ4aKDdgdtNO76ECJDTQj0NP4P\nQPoWjAcYQBFFgImmGD++E\/fCDTEYpI\/ew3ro8iQwNwJzWo9WWy00W6xDvcnalQXepK\/S7CV\/uFxg\nua4G2Bt+R1sR5GDWHt5AlCkJ3yaMMrbi\/rEdmEgw+a\/ANsf1aLHRgsT8I1QZr0WJ8YfI2\/6nxhUL\n8VxXiuXEjTjIb7IxJIpHPy8E\/WUMyC8GYoh7BHdyvfF9piekyTQ0R5mjKtoSZZEWKA7Zjfwwc7CP\nWYEdbR2+Irin\/enayhvR8\/LWWDwea8NoZyXqWC4oPWWP4iQ7XEy0RVGCLQrjbXA+zgbcWGsUnLBG\nfoyV6l5EPi87vRcXEuzn805YU1sP0cfSnO1MVo42+GGqn0+A16C4dR7d\/EPoLPfAN8Xu+JpDQ1Pe\nPjTkuBK4M2oynFCd5oia9Jf3yrMO4CV\/hcsn7QnaRsmishY+v5PBm2gNhbIjDY\/lVzE70oJ+cdAS\n8NtSugp5o+gArnH3v8Tm7oMk2wXiTOdXwDMOKuBF8qRZEZZSSnA\/y3IspztioWz\/K+bkVwiuGX\/r\nKkKv0OudgRVMRxJmB1xK2ov841ZIC97NXDbwxVB2o6LFH9N3SvF4pAEzwxLIryWpCXRCebITSk46\noijOFmkh5vPLBv40mDm\/AHzUV4zZ4TpMy2oxWHtEbSDvjDNJLCeSNCTM4RZIDlzmAPGsl4kF4MPe\nIszIRHg0WI0BkbdaQD4BVjBdcfm0Cy7E2yEncg+SA3ZZUgPs4WJ6sBIPBwTqA886k7UPZcmu1AOn\nujl41M\/D1B3eMoAu4KfQUM6kkXpIMfBBVx4e9pXiQW+p2kBBiisEqftRftZtoWAjO8ICpxi7takB\nduZg6odiKG+xVcCeQmd05u7Fd9l2kGbaoj3NBteZ1mjNcviVd9AZlenuqEg5QGqhPTJJ+1t2Fi8C\nJ2+z8KC7EGNVUegK1sF37mshpa1Bu8sHaHNYjVa71Wix0kST+ftocPgY9fSNb81iYQYdFakHCXAv\nNcAXsmzpAvDv0lQoeJEYZXtDcWYT5i4YYq5kB6YLjTB5zhAK1jbIU\/XRGaSNNto6iHdqoMZqHWpP\n2rwKceo+VGV6gJ9GJ72bYuA41wP3C3zxrDkcM9xteFK6HcrMLzDFMfgFcOj0F+hP1MVNDy0y\/\/0B\nQtM1qEq2VwEr09xQneUJQbontcCRfCvI0+zxtD4IL9rCMRKnowJ2eq9TAW\/5aOGH0A1LwCbLD3Dd\n7c+oN1+Nyi3vQeCkowIK0\/ejmuWFyoxDBPgVUkPMlJQAZYl6GDm1G0\/FfpiXBGCSpYd\/Vhij2+9j\nVYj7wjZAlrB5CdhO10JPzGa0+3wKvu57ZP0egpN2KqAo2xvCLG9VmUk5aialDDgUb4hndb6Y4R1S\nhfi3AG9HbETF5y+B\/LAvUZVxADU5vhCyfEgvtqEYGEveOyEdsxUH3wkoMtF8DeiO2twjqM4+TC1w\nhLULspgteCJww0wZTS2g4BjZAmS6Q5znh+ocPxSSiZsS4M9DbKaCfwB3o3UxW+qEmRKnXwXeDtT+\nBVBooAH+1j+qkqQ6k466cwEQsf1REEMhcLItDLJEA4ynmOF5rasqi98GHIzbjA7vT9BGMngxSQR6\nr7K4OosAOYGoyQ2kHjjeyMDdZDP8mPYlnvN3qsrMcOxnqjJz98RGdAetx22\/T9ET8Rm+8fpEVWZE\nRhoQGr2\/VAdFWR6ozw9CbR5DBUwNNuNQB2wJhrwxBAPMPej2+Uj1FCfZ+m90ksEkXUh9\/gKJmSZE\nZmtRE79nqZOIWJ6QFByFmHNUBaRk5P+3jE1b2JOMXwmC\/EoI7jUGo++8AzpjtqLDS+vNXmy9Bo3u\nOmhIsHijFy8AG7ghEOcH41w0RXuSxU3TWHMgRpsYGJIw1B63arIPofF8KOoKQlYA2OSPkQZ\/yOr8\n1AfmeKGpKBwSbjh1wIXrSfeZ+bEmP4xIDkMm9l0G0JsAIyDK9SfTtCXpxebUnDD8ayCLqbwevmxg\nPScADSTEF5McqNu4Lx59zH1\/dmC6vxyTPZfUBkoKGGQWdEfecZt5VqQ5teczTwnyH3cvD\/w0N4Jn\nD3rV25OQcZ8bZz9A+eHR68jJjlOc8avH54eaojAmzfufwFoCFKY6o\/yM8zwJLe9Sot3KHKC\/filu\nJmrKr8ZHDzfHSPvEkdLOyiDltzx\/tJf44PoFL3zN9UQTx0MpZtOlVVnuUn6KW7S6sP8Ao3KhClGf\nYNcAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/mild_sauce-1334212728.swf",
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
	"sauce"
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

log.info("mild_sauce.js LOADED");

// generated ok 2012-12-03 19:49:11 by martlume
