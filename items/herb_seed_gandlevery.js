//#include include/takeable.js

var label = "Gandlevery Seed";
var version = "1352411567";
var name_single = "Gandlevery Seed";
var name_plural = "Gandlevery Seeds";
var article = "a";
var description = "A Gandlevery Seed, for growing a pretty bunch of <a href=\"\/items\/765\/\" glitch=\"item|gandlevery\">Gandlevery<\/a> in your Herb Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 13;
var input_for = [];
var parent_classes = ["herb_seed_gandlevery", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "gandlevery",	// defined by seed_base (overridden by herb_seed_gandlevery)
	"produces_count"	: "1",	// defined by seed_base
	"time_grow1"	: "0.75",	// defined by seed_base (overridden by herb_seed_gandlevery)
	"time_grow2"	: "0.75"	// defined by seed_base (overridden by herb_seed_gandlevery)
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

// global block from seed_base
var is_seed = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be obtained by shucking <a href=\"\/items\/765\/\" glitch=\"item|gandlevery\">Sprigs of Gandlevery<\/a>."]);
	return out;
}

var tags = [
	"herb_seed",
	"herbalism_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-8,"y":-8,"w":17,"h":8},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE9UlEQVR42u2X\/VNUVRjH+Q+YfnRc\npH5wlBpCJHlTWcNlFxcIA1GQcFlQkyiQt0VZ6ALVKC8KMsqb4jqSBouIq2EYAiqFu5RiOmlksCIo\nktNsLzPaVPDtPJe9uC6LYUP9dJ+Z78zucs55Puf7POfci5OTGGKIIYYYYoghxNXkQNer770uvbE9\nkLuVLuNuZ8o4s0bODe8I5kZzlNxYrpL76f1Q7nHzLg6mpkkZm8LRq5fC1OAxpzDtW72czZVpUsvp\n8rJxY2PXr637Lb8YynD\/YBaG9yWhP1uJ21lymLMVGN65BqNaJR7mhcKSH4bHDQWYMOkdatyk75sw\nNbawtbjrBTHS5waj3Y4b9boJo94yUxLSn931uPNBNAYZ4N2dwbjPAH\/MCwFzkJdl\/zb8djwff7Fx\nM63x4FgBLm5dgY7N\/lxbgrfHP4I96jzS9Swoe\/3c+CEGNAoM7QjGSM6ki2O5Ibzo8whzdijvDYwU\nq\/DwcDbG6rIxekiDe6wKNwtjYEyRWQGX41yCH1pVPn2GWG\/VNLiP1y9RtWesxaAub9Zw5ODwns1T\nZb5rhbxnFQ\/HfhtkG6AxtzJkuLF9NfpSAvH1u6tgfEeKL7atxAUGeD5xOdrUfvhU5YtTcd5o2via\nWR\/jOVn+3bIXnKvDF+No1BI0xHjhROwyftDF9DCYtFG4VhgHc1UGhqozMFyTiZHaLAwUq\/lkN9Nl\n6M8Mwg8MgEp9hwENWXUn+wncdxlB+DZNhuupgWCHDL3Jq3A5KQDdb69E15YVaE\/0x2cM8IzKBy1v\nEeAy6CLdUSSfr3IqDpJIixUuKFEsAIE2RHvxg85s8uEn0eTOLctxiS3WwxY1JUtxhSW5xpIR5C0r\nJIEMaOR8yUkELcDRRuzd+5KtJZT38wR\/nI33xWmW8yTL3RC9FGXKl0BcTqWB81zpg6DS4AU49KYb\nc9ILrWzSOTaZFqFSUEkus8W\/YknIiW+skARAJexnMN8zWAKmz\/QbOUdjaENX7NyzLW8rK68hzgd6\nVkUBjgekKAqSlNlCCqpZu4jZvfQpF2nnRhtISnydAQxXJOFRW6XDfv29ow4PjuTimibM2nv27vnx\nFWuI9kS5DdwUIEWx3EXnCJJUpnwRxze4s536ToMkV+hunM3BetxxCH05EfwaQu8J7ukiX+GrZ597\nCpAOS5Fc0jITpKDDEYvZIfLiIanc1JOjR7SzPv1\/XKpHT9oanOevFn80xXhiX8ikaxXrFuJk4Wr0\nGtS86Pu0K0dwsnytGw6qA3hVb\/LH3rCFT4HuWePKenURO1CeGKjOxPPcn0ZNOOu1JahlLSSsdzSF\nHcwDATAc8EW3fj0PWBX7ss7hpV0Z46U6kRtvYYKt6jYHOnS1cqM3zn6UhAtl6eit1mLkVAXGWqum\n6W7zXhjSlHzL2M4nuI76UNTsdIYufx56mmPRURfVQlWd8cmiz97q3Jwbz9lDHkuPnOYmiZy2H2ur\nT7I28FWxn0dlJLfINYLsqo+AYZe875lwttGsTXRt0sbrbJM17oh1mKyUnUBqB6E1BDka+8R9t6me\n66xbhxq1e9es4Rw5ymDNAmSp3ZXwb1WrfpUXXXdz8irWpFWHM8gWcmsuAIsULmZ6os35Cyw9hUoU\nLuH8yZe7WJ4bTi7pK1ZIUv+3N+7d8vkeJXIJV6SQdM3sFv1Nkkpjxf9RxBBDDDHE+O\/jb5Pkn+xG\ngz3mAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/seed_gandlevery-1308763753.swf",
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
	"herb_seed",
	"herbalism_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("herb_seed_gandlevery.js LOADED");

// generated ok 2012-11-08 13:52:47 by martlume
