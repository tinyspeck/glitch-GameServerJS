//#include include/food.js, include/takeable.js

var label = "Potian's Feast";
var version = "1354649321";
var name_single = "Potian's Feast";
var name_plural = "Potians' Feasts";
var article = "a";
var description = "The greatest, most magnificent, energy-filled, Pot-approved combination of nourishment. A fitting dish to make or eat for any serious Potian.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 10;
var base_cost = 1000;
var input_for = [];
var parent_classes = ["potians_feast", "food", "takeable"];
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
	if (pc && !(pc.skills_has("masterchef_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/48\/\" glitch=\"skill|masterchef_2\">Master Chef II<\/a>."]);
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
		'position': {"x":-22,"y":-21,"w":42,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK6klEQVR42u2YaVSTVxrHmY\/zZfg0\nZ1rbSqtSbVHRseJpq+JSFbem1FbE1iLUrVWgVlxxYQkQQJZAEhIIJEDYwbCGHQQMewhbIGyyioCF\ngKJWq\/7n3juF0bE90\/a0px\/Ge85z3uTy5n1\/7\/8+\/+e5L0ZGL8aL8WL8sUOgNjKh8d\/zfLURh3\/N\nyO5PBQu+ZhQUXGFkqGw54TyiK+RUZ3A5YeV\/o3NK\/rW\/IKTCyPxPgTMYDJZTg5pLyQ0WSG16D\/eG\nq3G\/MxoD1QLUFp5Fe4szBnWeuNcZi6H+DnR1dRn6+vpKe3p6grq7u+2uX79u8rsqRZXoH62xm5yc\nlKm7vZGoeRcUrkBvg3a9CHe6sxkgjZpMLiaaI9jn6XYZbnZeRVd\/DZTaT0HAQCBBINHZ2ant6Oiw\nI9+NfzMcAOOR8U5ZSuN6g6YvDGNjY7h58ybuDDeiYcAD14cUMPRWY6gulgFRsJzo0+irDGHfO8sC\noW9RIFazFPnttpieGIRhpAejIzeRXRKHpNIQ+DdaI00jCPrVoPfv37ecujXYOzXag9YOKfQdSbjR\n247Bvm5MDdTjwWQ37o62MsC7nYkMqONqICQ+B1Gd4Ym6LC9UpXtgsq8KTx4MAz+MzMb0qA7SNDfw\n87\/AufT1SFQ7obftPHQ6HecXqXbv3j3lnYlhcvFaptbD29fZhR\/dHcDk9auY6khjy0pjuiuNwY03\nR2GoNQ8VWWGQ+h9GluwU7nalYFRfwq5BY2KkDl03c9Hc7o2xzrlQ1bsju8kdaQ0HMdH\/PnJqAtHa\n2vrzzn\/w4IE5geudmJiAoV\/D1JkJqhq9ib49FEUV1ui4xmNLSaNN7YahxhT299v9ZaiK+xYtyjPQ\nKc9BLXXEDU0Gu0bZoBA+lRyElxyAV9pH0PZHIqx0P3K7z0NY\/Dkuxm9BSXU6mpqa7H4SjiyrgeaZ\nXq\/HmE5JFEgmKmUS1SpmQW\/35COs4O8QlP8VeSmOSMu1gqDEGG3FgaiSHUfCtxaIPvwW4r4yQ+yR\ntxHvvBwVon2oygiHf6YtTsatQXLtcWSWr0G+xgUJld+Ae2U79nHNcDTEAq7xO1GpLUVzczPn6WU1\n+f777w3lXeegaSlEWZOAqKLAiCZs1p0UdEyXhZu1AgjDzRGnWIfKK4ehTvsclSlHoRI4wW3TPITY\nvAnFITPknLRAtstKKA4uRtLJ1SgQHQFXzsH5mM0QF+\/DdO\/LaGyzhqTQAUdDV2HvpUU4JVsNR\/kq\nyEq41OmG+vp64xn1Su\/cuQN1kwyZmh3Q6N0xQZK7T3sFjQWB6KkIxq1GCYvB2iCUJDqhNPgzFPlu\nZ5HjsRlNyc4o5O8Bj7MQvK0LELN\/KeIdVkC82wxJpzajXLIfMYnnEX3VBeF5LghV2SCu5hgkRQ6w\n8zaDd6wdAtMOoqw9ER09OtTV1UGr1TobPXr0iEMAWW0a6GzA\/XE9M8Tj+0P4YbqPOXBYp4JG5Y3u\n8mBMduZAeckWEpvFSHdchcwT\/0SS41KkulhAxbVCXtAnCCBQUfbLEMJZBL9tpqiSHkW67z6kX0nF\n1NQU6P2ePHmChw8fguQ8bt++jZGREZBiTk2CyspKBqjRaHqpesrp6Wm0tLRgnBiDQs2Uj5m41XqF\nqVdBSkN7hjcCdy5EgoMFUo6sYBCh1m8h\/uulkB5YhDKRLeJPW8J\/uynEnyxG0CfLoIk7A5n7QaSk\npKC\/vx8k1\/H48WPcvXsX4+PjGB4eZkW8ra0NDQ0NqKmpASni7LMRfQrSuhjgjBlG2oqeMcW1gsPI\nVlpDFXka4Q5rIP9sOYF7B\/wPFz4TnlbzUBBgi1S3D5hygTvehPzYVqiCHREv9IJCoYBaraat7zlA\nClNRUYHc3FymJm0IDJDKTcsKBRzTZ5P+GcfcO1N8W9JPIiN5F3wuv4FML3sIPl6I2INms1ARu5dC\n8ukSBkNNku7zJSKcNiDmqw3I9bVDhdQZGT57cIVnh3TJBaQmxaOoqIgpSatFdXU1ysvL2VxxcTFK\nSkrY0pNWSJf4WcAOXQOmOxQMbEoXyczRXhKAUa0UlVIXtmyKQ+YQ2yyaBRTtMmNBjRG8ZyWUvodR\nJP4GebydSPxmBSk1ZpAfehtxXy8habAMUUffQ2qsGJmZmbSUsN5MOgiDoerS\/CO+YOpVVVX9G5A6\nmALSE\/XNajQXBrKmry8T4cGtBmiSePDd+RYibZdBYW\/x3NIGEPXciXpX3PYh6qwNol22IurA21Ac\nJuXo2HLIjyxHqA1R+4ul8NlqigDbJYj0PI78\/PznACk0XXYKmJ2d3Ws0TtSjSUvzgp5IE7WtRQOd\ntgLavESUhhyH1\/ZFCCIg0j3mTK2n4aiqFE5otxqp3geQ6GmPhDMb4LPDFMHWZgj4yBSRXy6F15YF\n4G1bwI5cq\/m4TB42ZN\/a5wB7e3sZJAUUCERBRnp9Ry8FpEahJzaoryLn8glE26+GjJiBLpvn5nnP\nqUZzzpvciOYdfYDsgK+ZejGXvkAWzwYXPyC\/+XgxA\/IjsPRIw2PTfPZAJy1NiMPNITmyEzmRQShI\nlmN0dJS5mcJlZmXh9OnT5kaZmVkyCkjrkTYrFtKPFyGSJH3MXgskHdwILytTBkGDu2X+bMzMUbjc\nH+E8dltAdGIXisOO4RQBuLDxDRbn1r+OM+tMGNTTccFqIU69Pweua+fAff2rkJ91oMWZGcfHh1fK\nugixvkldvYZZntbDcokHZDbmSLBfB7ntCnLcQIAWzAI9HRSukO+I6PN74Wdnia9W\/gP8o1ZI8bFH\n6IGNzwHNxLdrXsOxVS+z8x1XvQS39a\/Ae9tCpPHdWQ0UCIRwdXX9z65bLo+RtZLlpYDUMN01pVCe\n2QMpKbTSXYsRZbsS3M3PwtGcU\/2o3AwcjbPbF0Nw3BrpfkdwbpMpA3JZOxfH338VTu\/OwVGLl9h5\nxyzIuWvmwHPDa5Cf2Y\/6ajVqa2sRESHFWVfXZ3czycnJxjJ5tLalpZUB0tZDtvdoLVYixmEtwjim\nEHHehN\/W+SSP5kGwdyXEhzbC\/cMlcHrvFXZDF7JUPptMEGGzEqK9q8DfYwF\/a3O4Wr5GQF6BBwHx\n2TQX3iS8PpiLwN3vINX\/DGquFjFT0PLifzmQKHfxp\/eDUrLUkVFyQ1FRCavsFJAah9bIdnUh0i85\nQPjhAgh2LkDozvkI2UFi+3zwt89D8LZ58NvyOrjkxkLiXMFHZggl4U\/m6LzvZhPwSIj2r0MS1wll\nGYnMkLTv0vKWl5cHT67Xz8PNDIkk2ThCKtPKo2OJ3HWzgN999x1u3bo1+05y48YNdDZr0FSaQ7Za\nUhSEeaJAzGXH\/B9DJSS75ZCLKIolb3olKtZbaedob29npYyaIZn05qBgPi65ufVeuOBu+YvfR8Kl\nUc7hEZFITEoh9amBKToDSEsB7ZV0joIODQ1hcHAQAwMDrH3RHQmtZTNvb7S+0rY1A0jbWmpqGnx4\nvnBz9+h1d3d3Ps3j\/fo3O3FkpLkkPEIrlkRAGilDjiqXPHUjA6Eq\/hwghXv69ZJum3JUKsTFxTO1\nuF7e8PDkGtw9PX+f\/zqIxREckViiFIVJIBSJIRCGgeQqEhKSEB+fSG6cgFhFPGJi4xAdo4A8OgbE\ncIiSyeHr5w+erx9Ty8vbx+Dl7a3kcrkc3m9R7H8NiURiLBCIOaHCMFmIQKgNCRWCHyJAMD+UKBOC\nwCA+AgKDcTkgkLgxAH5+\/lpfXz8lj+fnTIDMjV6MF+PF+D8d\/wIcajTve17sbAAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/potians_feast-1353117698.swf",
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

log.info("potians_feast.js LOADED");

// generated ok 2012-12-04 11:28:41 by martlume
