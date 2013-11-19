//#include include/food.js, include/takeable.js

var label = "Deluxe Sammich";
var version = "1354592775";
var name_single = "Deluxe Sammich";
var name_plural = "Deluxe Sammiches";
var article = "a";
var description = "A deeply satisfying deluxe sammich.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 86;
var input_for = [];
var parent_classes = ["deluxe_sammich", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && pc.skills_has("ezcooking_1") && !pc.making_recipe_is_known("11")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a> a bit more."]);
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
		'position': {"x":-15,"y":-26,"w":29,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAL7UlEQVR42u2Y51NUWRrG+Q\/crdr9\nsOsISjCAigETKq2oqCggYkSRoBhQxCEYRmcYBSQIIggqoKCAShRBRKCBhqYbmiYHkdSSQUFoBmZ2\ndj89e8659iXpOrNTU1O1tVQ91fS9t8\/5necN596rpvb\/vz\/wr09qrTFYcFDQn7tX0J1lJujO2C7o\nF3sIxsZaBQpF0ow\/DGxMfkqglB6rHhbbY6DgEN7l7kdv1m50ZZhhsFuI981P0JJggqbYtWiIWYm6\nyKWoDl+YVhWqLfhdwXqqgvSHio64jJWfxkiJI4bEdgTwMA\/YnWGO9mfboUjejJanAjQ9MUbbSzso\nXlij+bERGh+tIVorak3c4Nn8eJ1nY+ya3wb8s\/KN7VCHMLgz53A1N\/EWvCs9jzG5EwMcaQjD8NtU\nvCvxmAbYK7+O97IL6M+zwaAiFX2tz9CZYYm3KVvRlmCMlicC5vBr4nBN5JKYqrAFGr8Iarhi74zB\nfGvPfuF+ZWPmcTRkHCUDm6Erxx59cl90lHhjpOZbjJQ6oksegM4yPwahAuwUHsP72psYlDphIH88\n\/N0vzNGRZjoNsDnJHA1xxqi+u1hZFaJr8R\/hlMWH9QcLbasHRSRswgPoy96DnsxdDLD5+X7UpTui\nOdEUnYVuGKy9gSHpcQyKbAgEuTbLCr1iFwzX+mBYchQfimz5\/KTnul9YjAMmbuIBB5oSoSgJQsXd\nJai4vQASf3XbT8OVHrcdLnZQcgMfxmCJG7py7dDz0pIlf8czMniyCb\/6lmRT9FUGYlDmxi3mlRWU\n9Tfwg+wEhqVTAMm5npzDGGp7hoE38WjNOMgBxtEQr0L9\/eWovaePqnBdiH01lAXXZupPghstd7JQ\nDcwnvtgJXa+sGSANHVv9BEA2+MPVaMs6hr7SK+iXuGKk3hfKyssYqriIwTIPDJS64p3EBf3iM+jJ\nc0B33gl05hzF68dbPgOoh9IgLQivzYyZBPhD2an2qYDvhQfRn733i4D1DwxI+K3xjrrTkYE+iQfa\nU7exgmpN2IgWUr1t6QfxNs+FpUaP5CIUzy25KleNQQEjOEDZTW3kX\/sKQr8\/j\/dR2jYmAtK8+iTg\nx\/xpe74XiiwH9BYcw6D8EoblbizvhiTHSU7FoOO5xTggWczblw5ofX4ADY\/WERgDvM0+iS7JFdaG\nOEADHrA0UJMB5l2dOZ6LYxVnlKOykyDNdxwwjwDm7EVvLqnQHGv0S91JyNwwVObKLaTYnru28Ajn\neL41W9T7ssvozD02CbBTfAkdRRdQE8U17Zq7i1EfY4gumS8a4zfwgNV39FDoo84A873+7sm1larT\nGhTwx4ozUIn2udFaT4yRnOLdITA08Sk8Tf7+yhuof+VOFrGPFMEe1kpYxRM42moo4NR0aHiwggek\nBVH7yBgK4VmWJrURS0h4dTi4iQ6Oyp1iRuWnWIhpb6PukGrGh9pA1koGpM6sn1F3aEXSsNO2wUJP\nWgfrfek7WQq0JW5Gh8QTHekWnweMIoD3OMDK0Pl4nWjFAEtvzuXhqJ7Em3CAxBElA2LufAxXnjVr\nHcyd7HF3aLOlPbHz+Q62Y7SnbGOFo0jazGCqI5ejt9STnftUQXGAyz4C6jHAMlIU0pBlk+DSYoyQ\n1+iBrDpngRpN1EnuvOLcYUAT3GnMdERDyn7OGVIoqvyieywFqLizGC05Z9CVaTUdMH4d24cboqcD\nSgPmTIMrbLuEzLpziBJaW6hJbuj8Indan27ggOLXsx2ATkh7GJ1UflsP1dFGrBnTMT4PuJIBqnoe\nBSzwmsWU7aWOyGhj5L52R0LpCbgTUFmRnYsabYqyW7qshUxy5+lHd8jgb2INuRCRjZ3mC3OBVJ08\nVBclJHdkIbrozrXnt0V+16Fb2lNuUVMBK8N0Uew3m3fO6eYKuD\/YiHNRRnC\/Z4iUuF3Ij9mjVMv3\n\/psGuUBZeH02qiOWsnAxdygQGZC2ADYoqTIamvLQBZAFz0XxDW1Q9yvuGaA7ax+XGp8ApM5PBawK\nXwjxBLi865p4mWaNIuFRSPPtIUk4iPvuApzfOx+sUKoerbcoCV3E\/6DYTxNif00UT5CEqOjjcXYu\nQBuy0IWskLj9lruxYPv2hKY+EbCOLFYWPI+FdGLeSR+Z4J8dvvhQfx6i2H24clAP4c5rcXy7hpKr\n5Npznj+1XiWb+G4UEoj8j3lR4K0OEWmc1N1C39ko8p3DIOn3fK+vyDmNLwI2xxuxyJQETW4jKskf\nm2KszZvBlSXYINp9I+65rIcHcW\/Xmr8GM8D3VV+3\/6vLH1QUtJQkey7ZliSPDCGOXg1R5ApISWFk\n+OlMm0Dsr4W6aEPUPliN2vsrSasxQFXEMkgD5zKnPwVFCyI9dClkyVZszqGGi2RXOYuL+3Rx0nQO\njmz6CvZbZsFszV8Eau\/rXfV\/6nmKnxReUEHW17gjljxv5DdfQFnfVWTXubJPec93eP7QiE3wqYm\/\npPTrWkiOESCR7NmilkvIKT5JnLuEgRpXiOIPwHGbBpzNtOBmNQ8nd8yBqeGfNNQGq5wFP3bFYqDW\nDcrGy\/i5\/Tp+UHgjMMkUwS92I158FHFiBwLsgKi8Izj\/cAt8IjYi6\/YqCP3nT1OqnzaSfLXwjLhN\nlXZzIRJjNyE59xBe1btB0vkdcsjnY7EjbidYMDiqOO\/NuLR\/ARMtjuCzq7gCoYDKliD+QiYCS22X\nFDogPtUSwZGbEHjPGLfubkImqbY2qQve1X7D1FN5Hk1FZ3jVFzohJtECl+4bIfzVAX5xj8hYD0UO\nCMs6CPfozfC4I0BFkSObryHnGA\/mtFOThTnkzFIOcKw7WtBf4wU\/JwN2EU3QEKfV+N5mEcI91iI7\najeaRSegkJxiouAjby5jrPV7\/OOtN58WUzXSfBVd5e4oz7ZHTPR23LhrDP87GxBAPjPJHfVEQ246\nr2Rzu1hoszBTXdgzkwMcVhyf8fKOhZLGndLTi64eWYwARwMmWvJe9kvYKie5\/CvULT\/LFtdTdxPD\nrWGTzlWm2\/HuVafa4Oc6N\/QXHCF31erg7wc7sm1x8ZAevwJaRYc3zmSi\/1NwcdwBDDX5skF7y88h\nPcxskkoSD7HJqGgvozlFI\/Dkmgn7pMq4sxuvRT4YaQvBh8ZrbCx6nM5bGG3F4EYrnSEN1UfOVfV2\nHrAtzap9oOQ0g6ROqpJ1Yl48DtiK0Y4HbND73whw3WEpU7izIZPqO00PVZrQ70EnVrLeRlOGjqUK\noUo03+icyf5bGVzJbX3kes9G9rVZ488lbam709pf7AeF9LDWnTYA\/Yz22sQcfBGxi3dXpamTUrnu\nngtvuyU8OE0V6pRKX1vqTDLh9un5EAXMg9BnzkfACU92bSmWtq0plmjP2IcR+RlUphzGt\/aL2USq\nAb2PL2PuJQfvgN3mWXAwUef7lgqKpgM9To\/5nFrOdNluEa9bbmtwxWYhA6JgFJJe72VD+qqvNtmT\ntZDno4lcL420ac\/FLcm72ltSdrEn\/e7sQxitOMtygsLmENdifbYwwPRwcwagWv1EV+h36njkFQE+\nyJzZ76eKHo\/00Ie\/w2wEn5iN9O91UOCvwwMKvWYrX5IbmGmAzak79VtSLJQUsCnRHG8SduJtOrmb\nFtpguIR0\/MpzDPBH0iO7SNt5FmyKENc1vHvOu7QRdp7cmr2052FG5KcxQBp9D3noUqRboobsIsXB\nC1EcpIeiwAUovMGFdRLg1Vmff\/3RmmQpaEoyVxIxwDcJO9D4ZDt50N4GZVMouoqOoSlpJ1qSzdGc\nbEbc3kkWY0quo9qGxqdbybUmaCAP5mV3VkAWTp41bi9DCdl3pSH6kNxa\/HnA61rKPC8t2y++PGpO\n2KnfmGhePRWQqjHJDHVk26qJIc8f0RuIBKh6sB6V99ejIsoQ5RFrIL+3GmV3V\/1iwEICmO+nI8r3\nnqPxq169EadcXj\/d3q4CbIgzIXBbOMCHxqj5zYC6SlHA3JiCgN\/4UvP1460WDbFbgglcdX3cfw8o\nuaUvKg5elCYJ1LMtCJqr\/7u9Za1IWj6jKnqjRW2MkSdV9YN1RIaelVGrPcsjqFZ6lt01YCoNW25L\n4AQVEZoz\/mdf1P8byuAQuO8aVmYAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/deluxe_sammich-1334340419.swf",
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

log.info("deluxe_sammich.js LOADED");

// generated ok 2012-12-03 19:46:15 by martlume
