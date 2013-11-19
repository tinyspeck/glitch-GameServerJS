//#include include/food.js, include/takeable.js

var label = "Gamma's Pancake";
var version = "1354586081";
var name_single = "Gamma's Pancake";
var name_plural = "Gamma's Pancakes";
var article = "a";
var description = "One mouthwatering pancake, just like Gamma used to make.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 57;
var input_for = [];
var parent_classes = ["gammas_pancakes", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.making_recipe_is_known("20")) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> and complete the associated quest."]);
	return out;
}

var tags = [
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-15,"w":36,"h":14},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH5ElEQVR42u3YaVCU5wEH8J04bae5\n0GKUY7kURA0KBhQEzEKaaWtsQp2MdmozQ3PaNBi01hBQRDGoiIDIoWQXFuTe5ZJLkOMFEmBBYFmO\nBRRYkFuOtUlaP\/77vO8u8LLsLuhokw\/ZmecTO7M\/nuP\/\/N+Xw\/n583\/+jIqdvYYzXYT3M52pwYyd\n1GCaEzWQ6kT1pzpSfSkOVF+yA9WbZE\/1Jm8P6hXaBckTt\/Hkgi0WzxQ1K3I0GMtxixwV7VaQgZEs\nFxAghjJ2YjB9JxRpjhhIfQ39KTtw74YD7ibbozdpO3qE29CdaAd5wqvo5G9VtsdvpmTxm72fHqzc\n0WAyzz1oItcd49luGBO7ggYOM8BdaqCTbmAiASYQoIABouPrLSBIyK7bou2aDdUaZ817Ypyy0N1+\nMv91xWTuHkzkqICjYjJ7IhcCdNYK7GMDhQvALq3ATWiNtVa0xlk+PnL6pof3VD5P+SBvD1RANwJ0\nnQf2JNqjLmwjbp0yRsUZE1SeNUF5EBmnjVFGRmmgEaqCuaBCzPDtJUtIY221zSDIDKIldiOaYyxX\nvuzTRR7eBIip\/NehArrPA+UCexQFGKHYby3qg03RdN4Mkq9MUXfOBLUEWh1kjEqCKz9lhLKA9Sj2\nfwW5\/\/wNMnxehuiYAapCTAnQlgA3QUoDY9XA6A1oumopXH5Ziz29Zgo8MH2TtwTYEb8NoqNrUOa\/\nDtJQc7RcMGeADTQwWDew8ItXkH9iLcTH1iDtHy+i+gIXbTQwTg2MUQHvXLVCU5Slr+4DUfyGxWyB\nh1ITyBwQAizwW8cAWwhqJcDSgHWLgLnHDZHla4CCLw2Z\/acN2BhlCUmUmZd2YJEnNVvoCTZwUg3s\nSXCAmOCyySy0X7J4YmC6z0u48ffntQKb1MCGKxbKusvGi3Pz+xJPnrLoDbCBD1jAhsvWDJCewScB\n5v3LkNmHqWSJ031eXAK8wwJKrligPpJLLQI+LP5tnj6gLM4O6Z+9BJHvGlSfNmIBucsC89QzR+8\/\nwQe\/QvlZ40XA5iVAczREkn\/8sqnqZNeE25kRINjAKTZQnYH8v\/0SmUcMGGTBCUNQBFJzxgjUaXqs\nXwIs\/nItsj6nv7+a2XtJH\/8aOcfXzGfgUqAlGsnsMcAIM1R8ZSJngJ0Cx0Ns4DQbyArpqnPmiPnL\nc7hx+AXyg+RHP1\/NADLpcYQeLyPn2GqyT8k4upqZtXyytMX+65nvfO39C7KcNouAqgykgcwJVgEj\nzVFPgHXhXMS8b+jMkfGdAuaAM3PAfB60hXRpoAmiDnIQe2gVkj95YQkwgx4+qkED6b+LCfbae6tQ\nH26lDulNGiE9HzEMsIEFzPYzvsAZSneNp4Gzc0AtIT3GukXaYrcymaaCPsfsK8H7CyPur6sWDXrW\nqRAuuUU26wxpXcAsP9MKTleiSxkD1IiYOeC4BnDuHiZVCzUXLXEr0Ji58krIvpNEWKMhfCPZ4BsI\nZivTYlT38JZ5oJ6QZk4wG5gTtEHBkSe5U5onWDOklwAzVEBFmhMpCY6kxZCicIMUhWRSFJLsF9Ws\nLsHWeaAs3lZ\/SGsu8dnN4DRec9EKnNQFzFQD0zWB2nsgAyQloYPVYnSFNBtYG8ZFXqgDOM1p70Jf\nBjJAsRo4X1R3sYqqo96i2sVXAdt1AO8sAZoxwFJSRm5fdwOnNmG\/fuCSouq8fFGdAwpUwA4dQF0h\nXU+WN\/ckF7Wpb4IjEX9CQB56Q5oGqvbf02jSmkCrhZCOVIU0vf9EgTaQiPcqOC0FvlRf2h69Ia2v\nSfezm3TSQpOW62zSNqyQ3qA1pEvPcZF\/6TUCfEvImeyNp+qu7mJlIG9JUdUFHJgDsk6wfuDKQjrj\nBBdViZ400Ivz35n8yNIID\/X+0x\/SbKBiDpiyEuDKQ7qcNCRxsB0kOX9UMHfxo+mb3hLRx5ALXR8r\npBlgqnZgNwNcHNKyFYa0KMAKDaJ9aMzdt\/Cc8nA4DSWhu1ce0unaQ1prBvLVGbiCkK4gFa7oigsa\n87wUi\/rgfx7kCJvzfdAl3L1sSA89w5AWn7SCJPsdMnvvLH7KezSVy1MOpaAgdA+Gstx+lJC+HWKB\n0lh3NOXvV2h9JvlhQkRN3r1OltoZI2K3pxLSnSsKaUuUBFugMNwZLYUH0FSwX\/uD\/KPZHIvvxjOU\nw7IIlEe\/iXaBs0ZIP523CXPA6rANZNYskR1kS26MfWgt+jNaCg7ofzb+fkrE+24sDf8eSUF3zUmy\nHz5CQ+pB1CXsRZ3gD\/iG\/zvURDmhJnw7OgQOjx3SzTHWBLUReed3oDblbTSI30Vb6XuQlhxCS9FB\naXP5AYNlH95\/mEyxfziSQimHkzA7lIiZQT6mB65jqi8Ok3ejMdEbhfHuCLTd8kFt4tuoithB4mP7\nssDyC9Zktl4lEXIAnZUfoaP8A7SVeUsJkJIWH\/J9\/JdHIyn2yqFE75khftCMIj7oQV8sNdEbTY33\nXFHSwLGuMIx2hmK4\/TxkZT6o5u\/Ft1EO6ODbsYBbUHHRBrfCd5Fl\/BPk1Z8S3GGqs+JDb3nlh8\/u\nneGY\/LLFaFeY12hXaNB9WQh1X3YOQ9Kz6Kk5jvrU\/aiIdkPFVVdUxv8e7bcPo\/cbX8hrPpN213zq\n\/aO8dZ3tv2gwKD0jHGwOVCiaT6G\/yR99ki9wr\/648m7dUeG92iO8n8wrYkVrIE\/R5M8baPSz\/\/mF\n+U\/h8z\/ZANg1dHnwFwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/gammas_pancakes-1334190916.swf",
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

log.info("gammas_pancakes.js LOADED");

// generated ok 2012-12-03 17:54:41 by martlume
