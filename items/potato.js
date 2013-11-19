//#include include/food.js, include/takeable.js

var label = "Potato";
var version = "1354598438";
var name_single = "Potato";
var name_plural = "Potatoes";
var article = "a";
var description = "A humble potato.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 7;
var input_for = [5,15,74,88,92,95,339,341];
var parent_classes = ["potato", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_potato"	// defined by crop_base (overridden by potato)
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

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can grow this by planting <a href=\"\/items\/322\/\" glitch=\"item|seed_potato\">Potato Seeds<\/a> in a Crop Garden."]);
	out.push([2, "Using a <a href=\"\/items\/979\/\" glitch=\"item|still\">Still<\/a> and the <a href=\"\/skills\/123\/\" glitch=\"skill|distilling_1\">Distilling<\/a> skill, this can be turned into <a href=\"\/items\/180\/\" glitch=\"item|hooch\">Hooch<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>, a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"crop",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-19,"w":31,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHyUlEQVR42u2X+U\/TeR7G9S8w88uA\nKKeCCCIgIvddylFETuVSUEBAHUEUQa5yKTcFWqCUo+CFqFBO0dFZMia7k0l2w+z8A5P5C0jmH3j2\n+XwKtQizszvZnWQSPsmTlia0rz7P835\/vz1wYP\/sn\/2zf\/78Z3kwyntZq1BTpiWtYn2XBmONK7qY\n\/PejikN\/GJT4sDfD8flL2lgCKDaXtbH4LS32R8PUH2P8v4Gu6qId342q8t8ZkkxretXm21EVVofj\nLQBz7UES4nOoBQ3VH4P53ii87I6EsSVkc643yvt3Qcz3RUUwkojZ7kj1k4eh6tHGQPVoQ4DGoA7a\n4HN8PZ6Mj0\/S8Y0xBW8NSRCQa\/pErA7FWaDoKBYHFBJqrjsMcz2RIBBe9ZgBp9vCoK8P\/Ok\/coRv\npjH35NdjYix4zQ943hGO8aYgGAg61RqCN3oVVoYT6GKCdJJfzOwUHZvri5b\/sw012xWBF50RmOF7\nPG8Px0h9AIZqzqn3BBOFXRmKX18bUdGB87v0ZiQRK7q4vXtEZ0xbEGaASDMA9QkqchfURL0\/9NU+\nYCp43BaKMX7J9ls+G7umbZVgAuL9eAreT6Tu0LuxC5+BqnYDMr6FgRiYNNtORWHmUQhm2kMk1AtC\nzRBKuP2sPQxPH4VJqKnmIEzT9amWYEw2B2OCSTSVnYYVnNKbH7gpQP4ylYH16UyL3k+mY2koWb7+\n1pC8E3I40dInCUWXrPs0a4EK3wU13RYiq2Ak1BgdHFcHSrHTMFBNJV6wdG11OHHzw2Qa\/jZzCf+Y\ny5H67kWWBfLtWKoZll9gTZ9E95LYK3ZsKBGmAeW\/7dMOqNZPUJN0TTgloAz15yTU0AN\/9N09g\/6q\nM6gr9DQDLuli10V83z7JxI+LeRb9sJBrARTufWNMp4MXsEyoJR2d0yZgYTCeUSp3QW0DiT5tR2dk\ndJMEGiPIQIUXhqv9pFt6wo3UncPAfT+03ThNeaGVupN74hdz7zhl4sO\/f5n1GWAePvB1EfHXE2l4\nN57GqFUSyjQQj7n+OLzWxOFVn1K6pLvnA91dH0yqd\/dpnK+J4guX9IQZrvGTUMO1\/tK1jnIfds4L\nTaVeUJecQuN1T1xPd\/koJ1Z0Sbj099c5+MFEMFMuNuZz8dfnFwnFSA2peDOaImUaTCCUUkK96ovF\ny95YzPbE0q1wGOr8MN7obwUVaIEarTeDjdQSikC6mrPQVp9Fd4WPdE19nVDFnmig6os8UJHjhoJk\np\/IDy1ql8R1j+0CXPjLi79m77wgm\/pZQ+hSsUisjjJayhprpVuB5lwLPOmNkp\/aCsnZpG2qQUWru\n+cooGyWQJ\/vmgdprJ\/Hg6klU5rnharITChMPOx5YGIjdWNUnyyFYM6TsCbU0nIxFTvH8gAozXWao\nxw+j6FQ4Cx+Jx4+i5HK27pM1VOfNU3hYchI9FacJdgY9d3zQ8ZWXfGygWwKq5qo7agrcUZnrioLz\nDrissl+XAzKnUbDwKjMQtSyhki1QC7pkmLTn6Vw8nnXE4El7NIGioasORG85nahkrOrQPZzyk6UX\n09hX6c3J9EFvpY+E6rx9Gu03vdBS5onqghO4n38CVVfc8NWlY7iiIlyiA66ePxohAWd7omXR94Ka\nH0zCbF8CI1RIl6bp2lQbL+Z0bbQhmBEGs3OhEkpGJ6CqCEWXNHd9CeVrgeqq8EZn+Wl0EK651INu\nmaHuXXbF3TxXlGW4IDfBgbIX7hktC\/pZe8Sm6NNsrxJzjHCOUK8HkvCSYE\/pmDXUREsEJprF9TYc\nY01hMKjDCMf1QJe2oXorfSVQN4G6yj9BtTPSR7e88JBxt5R50DU3rhFX3MlxRWm6M3LijyI77ijy\nEo9uXM90+XS7xaW5Lkr+tCN6Kz4CEcpIqMnWiD2hRumaviEEutrAHS5tQ7UTpK3slHx8JPpHtTLO\nllJPNJd4oL7wBKf0OMqzj+HWRReCHcHFWDuhn3fAiTPeGFA+2RJmcWmyZS8oAhFqhFDDjHWoLhiD\nNQE7ndpyqe3GKdQyuhbGaIbygLqYQ1DgJqO8nXWMXXPBLermRWdcSbJHpsIOmTG2P2YqbZx33bmM\nVvsd0tcHbA7eD2RUAZ9csoaqM0PpaoOgfRCEvir\/PaMTcNtQTXSqsdidUVpB0a2bmc64keGMogsO\nyFbaIT36MDKibf+pCj30xa\/e93HiynU1\/gQJ4n1YiJS2JhAaAvffD6BbhOfUCrAuLtadUJ4SqnkL\nSn39pASruuL6GZQTytKdUJziwL4dQVqULdKptEibViIc\/M2bU5ZcI0tOaarOslvc8nf80FNpVudt\nb9knAdTEnSZWhOiTeL4N1VDkjmo6dusSgQhVtgVVmuaIohR7gtltQVHRtt9mKex8\/6vb+QfX3Iub\nSjylM3tHRzj2qbHQXfZKAInCi35V5h2TYNZQxaliZRxBRsxhpBAqNdKGfbPRXE6wjfjdP3zKs13T\nOWGb91n0aq6CB9xXQtWEEH0S0d27fJyFP46KbBGh81Z09lyuBErkRCoOs1u2hLIR2kiL\/NKYq7TN\n\/1\/+QDvIjZ5feMFpsSjFEYUXHHEtWWx3B16G7JGXcAQ5XA2i5FnUdp+onzJibNdTwm006ZG2+XnK\nL73\/iJ+4B7MZSWYsFWVW6pbE5aiYslyW9s\/+2T\/75893\/gVIkRk\/bFskgwAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/potato-1334213380.swf",
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
	"crop",
	"croppery_gardening_supplies"
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

log.info("potato.js LOADED");

// generated ok 2012-12-03 21:20:38 by martlume
