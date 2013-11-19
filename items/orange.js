//#include include/food.js, include/takeable.js

var label = "Orange";
var version = "1345744897";
var name_single = "Orange";
var name_plural = "Oranges";
var article = "an";
var description = "A very orange orange.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 100;
var base_cost = 5;
var input_for = [52,54,103,104];
var parent_classes = ["orange", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "fruits",	// defined by takeable (overridden by orange)
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
		'position': {"x":-11,"y":-19,"w":20,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGuUlEQVR42u1YW2wUZRTmxdJu99bu\nLlA1+qyJ0fhgfOPBaIwvJBoT5YUHEktLS7nUUrnYUi5FXNk0xUrTKq3IRUArhBip0YZbFCMWQnqj\nlIpAoIIWbGd2tpIc\/+\/M\/jOzs\/+UgkJiwiYnTJed+b\/\/O9\/5zvln2rQHnwcf9efb16eFekuiszmK\nYxV9C6I1WVESmde7MPz4fQV2en543smKaEfrR7PoVHmMekvU0V8asa57SqKjYiMJAL5nwHqKI3N6\nFsSGu+cXUOOnD1NjIkJD5bkicuj8oofoWnV2XK2aTsMVQeoridpgF0S7\/lNWh94qCJ0rD3fsTRRS\ne32UPmgvoqU7i6hmS4wqdwug22bSxXd99NeaPLpZm0vXV+RkAR1ZnkO\/Lg5kAAWjePa\/AjdQHH66\ntzQyikUONoWpdm8RVW2M0JHVQfqpPkQDawKk1Qco9X4wI8bX59MfK3M8WZXpR0awxl2BMwsgRpcr\nfTQUD9CGhhitrSukU4t8WYC8AqyqQF5cmp\/B5h1rUzJ3aVk+6fV+GlllxvUNATIagpRsCpLWHiJt\nR5j0T0Ic+M7YnA0S9\/+5aroy7QMLC50pnz1lgGfLwl0j1XlkvGen0IjboFShNwuQW4K8ASWbdT66\n9k4myMuVeZmVPpXigaddqfIxOAYmWNFbBbDt3uDcAaC4N9kYZHbxDGO1n27W5E2qScFix20rdrA8\nPIpqtFiTwPZGSe+YSfr+Ig5tX4z0g8+Q9nnEBofvxGYQYNJICJBb09frhTxENtzpvvJ2Ll1Y4reY\nnLRo+ksLK6ANpIPBtYWshZOdT1LqZDFNnGsi\/dhrpH\/zBCW\/fpQmempMwLsLeQP87zZTm6pUIzPO\nVKNgENAjPBP24wlwsCw8jJuTG\/28gLbnMdJ2isUOPkLJwy\/S2NG5lPptPxnnd9Gt0TNknHiTgetf\nzOBNsBZxvauAmZepdseNmtwMHeJfpHmwrICtx7NyYaYyvcwcAO6JkH7oKUqe\/Zj0M5tI6661QE6M\nHKPULwt5A8yi+K0ECvYt\/cXTqU5X+dhanwVwaFGIdYj0AqBnmtHcoQXYAqcXi4h0GcdfpfHvX6Cx\nH8tMkH2NdOtGP\/89dnw+pc5+SMnvnjMBQo9gD9JoNwOFAg3ieaxFoUNtQ35WoTgBolBVxtwBurn6\nttra07+aReNdLzNrAAjmcA2QqcudlPzhDdYiAhuSQPQW0xuZuXi6mlE0wluNdYGsahbt1OmJ2dXc\nUxLrxg85venKBSvQmNb5LLOF9EoWx3+u4jCOz2FwzKDQKwc2h2e0mSBVOnSCQ5qdADFQKBiM8Y\/Z\nnKX5CvYAMHnkFQYHQACYurCP\/r52glIDDTRxeompwQNFbEUcO2yQsvOAUTCJcANE5swKjlk9WgkQ\nngR9WPYi9MQVDIZQKN3VNDHYYAIS1cohro2u51mrfA+qHmBlK2w2U8tpbrEr251iZ1dBKAGiSFBh\n3F9bQzaL0Jhg0jj6kul9\/XEyDs\/lomDjPlBk6Y8LBZXfbN6v6s\/uIpEA4YdgEm1PCRA6gM1w1bWl\n2xsWFGmThSBDWov+5Qyzy8D\/8Ns2uyWiQDJMut7sJljDDRDkACT0qNQgigRmiVbEU0izXcnMiAAi\n25zsHFJzMtXaZ4VsK9IHZWotgKIfI9ztDqAsi\/GqYnwpC8Xqw2ADQGRl4hqAd4Yze7B7smkxTRk6\nBEjIhe0GDLpaHeLSMh+HNR8KT1ZOMRIgWh2DTJiWI\/WYEVJziLQhcxE0Bq0NAqT83tgUoOQKP2m1\n+coh1glQORtiFpMAUSgyLTycSl1tN5ngykzbh9f8pxoS9Dr1UcA5vCoLxNKh8B9u3nJgaA1ZMyG3\nKXdsNtlh4C5DNmqF3uoEayv9nFrVwCrbHPRn28wk0wzOBjgrwA+xUzm0erISt8Fm\/d9qv6U5d1Eg\nnXAMrJN50rvNPCirWYLEERInNCvdjUHLOpjVzS4LwVAat7UIcKqUgjU8H2mVDHq2ONXYBR0AJLwJ\nnsXemDAbvtQf+xxAiDRyOgVAfV2+2YlEyKMnZj\/IRY5YOOnh76vLfY4hdYrsOVMtX1\/gAXgwFsPD\nnQEQWo0As8LnecREFpzGjHT\/Xu0+0XmMWLc7Fw8vDozCRMGkanGvkDYFJlGhuB+6ky3NDU4U57a7\nfrMg040+6QXIWYkyjQiwDq1hUsdGEQCHZ+E7T1O+IybZH6MJ1oh4OIB4BeSAhQFKHohkf5VsSaB9\npdHuu37tMRlQeKXqVRtSCDCZPTU7TJe4h6\/hZOqRGtjCVEK+G7zvLzMffP4Pn38AbLTxs5K4VZQA\nAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/orange-1334598017.swf",
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

log.info("orange.js LOADED");

// generated ok 2012-08-23 11:01:37 by martlume
