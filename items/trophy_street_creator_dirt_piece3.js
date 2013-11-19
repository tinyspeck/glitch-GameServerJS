//#include include/takeable.js

var label = "A Piece of Street Creator Dirt Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Dirt Trophy";
var name_plural = "Pieces of Street Creator Dirt Trophy";
var article = "an";
var description = "One part of a trophy for contributing to street-building. Four more parts like it, you might have a whole trophy! A Dirt Trophy. Like they say: where there's muck, there's brass.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_dirt_piece3", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "300",	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece3)
	"smash_blue"	: "450",	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece3)
	"smash_shiny"	: "550"	// defined by trophy_piece (overridden by trophy_street_creator_dirt_piece3)
};

var instancePropsDef = {};

var verbs = {};

verbs.smash = { // defined by trophy_piece
	"name"				: "smash",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return "Smash this trophy to receive "+this.getClassProp('smash_green')+" Green Elements, "+this.getClassProp('smash_blue')+" Blue Elements and "+this.getClassProp('smash_shiny')+" Shiny Elements.";
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!pc.checkItemsInBag('bag_elemental_pouch', 1)) {
			return {state: 'disabled', reason: "You'll need an elemental pouch to collect the pieces."};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var n_green = this.getClassProp('smash_green');
		var n_blue =  this.getClassProp('smash_blue');
		var n_shiny =  this.getClassProp('smash_shiny');

		var remainder = pc.createItemFromSource('element_green', n_green, this, true);
		n_green -= remainder;
		var g_destroyed = remainder;

		remainder = pc.createItemFromSource('element_blue', n_blue, this, true);
		n_blue -= remainder;
		var b_destroyed = remainder;

		remainder = pc.createItemFromSource('element_shiny', n_shiny, this, true);
		n_shiny -= remainder;
		var s_destroyed = remainder;

		var result_string = "You smashed "+this.label+". ";

		if (g_destroyed) {
			result_string += g_destroyed+" Green Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (b_destroyed) {
			result_string += b_destroyed+" Blue Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (s_destroyed) {
			result_string += s_destroyed+" Shiny Elements were created, but destroyed, because you couldn't carry them. ";
		}

		var produced = [];
		if (n_green) {
			produced.push(n_green+" Green Elements");
		} 
		if (n_blue) {
			produced.push(n_blue+" Blue Elements");
		}
		if (n_shiny) {
			produced.push(n_shiny+" Shiny Elements");
		}

		if (produced.length == 1) {
			result_string += "You received "+produced[0]+".";
		} else if (produced.length == 2) {
			result_string += "You received "+produced[0]+" and "+produced[1]+".";
		} else if (produced.length == 3) {
			result_string += "You received "+produced[0]+", "+produced[1]+" and "+produced[2]+".";
		}

		pc.sendActivity(result_string);

		this.apiDelete();

		return failed ? false : true;
	}
};

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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-dirt-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-dirt-trophy\/\">Street Creator Dirt Trophy<\/a>"]);
	return out;
}

var tags = [
	"trophypiece",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-29,"w":33,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHZ0lEQVR42u2Y+U+b9x3HfXMYY2Pu\nwxe+bXwQbG5sYxuCHbAN2FAIwSEcuQqEHMvULrParVvSVqWp1q5VEqG1UbWkITQJybJ2kTtNZUnb\njR+67qdJ\/hO8vyDvfR6Hbk2FwtoAQ1of6fWL\/aDnxef7uR6zWD9cO\/g67a8TPx9wzP8k4Eie8JiT\nR5vUyWnidId14Uxnre1\/LjjTZgpPOFXoV4sRkQnw01Adnusy45RbhREVNxUrYIm3VciYzVI05bNT\nEW3pV2enYuKAQpyKGSQYsRTgcEMZLs724TfH+3D5ZB8uHO7ClCl3aTqgydo2QauEk2go4CCqLYIj\nj5MOayUYNBVgQCvEiDYbY1oeps18nNtTjbfizThszsGUQ\/radgrOd5dzMSTnzfsrhasBhQjthVwE\nS7mIybkY0\/Bw1MTHSZsAxywCTOr5mLBLktsm2FTAWT3irMRUNUvsKcvBrlw2WsVs7C7moLeSi70q\nHsZ1fBwy8DFFcnE1Dwcbi7ZH0Cxk2XwkMttQvjrmlLi9VWLU5rDRkMdGu5STiWJ\/FUVXwcuIDit5\nGDXnYb9dOrtt+ecu4mBczY2POQqSMWsJvBW5qBNyQIUDL0kGSjjooRQIV3DRqxBg1CZN+berki0S\nVpgpkBNudXLYXoCQNh+9RmkGf5UQu2W56FYKEVIJ0a8TYaS2OOUt5C7UUuVvi2A1RcIm4aRnvWYM\nm8XoVOWlJ11KzPjVGG+WYbJVjsk2OcYaKtPH\/NUJRsxFUfcUUlQpP5ncfNbMSx41bqEwHfNsY2k2\nospseOhIvVJ26kkR3yXhwFdCeUn5yBTNCaruU3Z++qCevzV5qRNy4zoxH1YJNzM5IlW8xAZp4bZI\nuMkGakU9VECTeh6OUBtiojko52y+ZGMeK9lBhRKhIpisleLBrcX\/at4aJSyFhXpoLbUpF0XURxXv\nKeEubapcHYsldlORdJdxMaLJwi+H3Okdtbk4c1izvsJHDXncmINLxweWdpRgg5CVYo43KuNipr4Q\nFyY8iR0hdvXmivtAT2ShniaGnwT7qh5F8IhJsLAjBBMvvbl6\/MAkHLmPRhozKYZU\/IwkM5O39OEP\nHz5Mffn3VPrK9T\/E1\/v+5HPnEnM\/+jmmejrQUihACy0GnTSPmVE2qCRJp3Jr5+yN8+fiGcGle3jt\nrSvxqdNnxdNzL7hn5l4Iz51+afVn597B5cU\/YsDTjC5VPjplQnSUChCo4CMsz8KATY4zL77BHDV3\nSwQPVEsSM3bl6nuXP0y9\/vYHeOWNd9Pzv76CS+9\/hPeufYL3l\/6E395Ywcu\/eBXD4TA66x1o0qvR\npFPBZauBr7UVgZ4YRieO3Tv7ztXNP+79yvwESWLaqU+\/ffEakitfIvnpGit\/wyfEnXt\/xa2PPsft\nj7\/AMvHh3fu4fnsFi8ufEiu4dvsBlu7+BYt3Pl+9+vEXmys5Is9PxJVijKkkODMxhZu\/\/ww37n5G\nEvTQ3z3A9Tv3sXj7Pq4t38cHy3\/G1VsbcHNlcyWHZaIFksQ+RT6O+xwIGyrRUSmCn\/AxVIho56O1\nvlwED0OZCG7C9QQsWaz5TZGL+f3iWFVe+hmZCEPEIbschxo18FKva6eJwWwrLhptbRJ2pnqbaSlt\nFLHB9EOnkI06aju7aKOu\/Rb2bFZqUwQ9Llc8oilHrDIPAwxVeTjZXoN9NaXooM3YT+2EkWX2Obd0\nfVHHmui3JZ96Se0LBhV7urpS9RoFesuF6GOoENIYE+GUz4q9piJ0kmQHSfrWIpqRLKCXJBJtFj9Z\n0p7Fmn2qo+3r6ZmPRiJobWqidZ3W99JchMoeMaQpwvNBB0KynIzkvyO5duSta5Fk3kMaROsft7c4\nP30+1BV\/qihGe3vD7rY2ODVKBEtyHmPOY8Y+S\/n3jiDDK0EfftW35\/sXTF8o1M4IOnRqdBZlISIX\n40iTNhM9hgmHFlFtJWK6KgzqZRgyyDFsVGDErELcUo39Vg3G7VpaXPU4uMuAww4Tnq03Y69BiVFT\nNcZq6HuLDlF1ZZLZJb+rHzcUDHYwgtaaGniKhfBJBRmClI+jFhmmW40IVmQ\/XtHfiODXR\/zNKK5X\n1ZmczPlurYdD8Jqt1hLKw3QkFEJ3hw9BmwHecjHcEj5c9N7RRgybyuhzDQJ2HXYz2HTotOrgt2gz\neClK7WYNPITbpIHLqEGbQY1WBv1\/MBUXoKKiIkTPzSbYGwkyN\/AIgdPpLIuEw28O9Pf\/85lYDEOD\ng+gL9aCrtRkBhx1dtTXo9Laj1m6H1WKBhaJdYzbDbDLBZDTCaDDAoNfDoNNBr9VCp9FAq1ZDU10N\ntUr1GCqF4it6ZhVRTORuJMpsH4K1\/0hI5Pd2d\/94IBrNiDIMMkSjIHns9vths1qfKKknSR1JaklS\nQ5LqdSSlUmkTPatiTVJCZG0kyV8TzWFEW1pazOGenoP9kci7sf7+ZKy3lwFMS2pwOv+hlMvvKhSK\nOwq5fFkul9+sViovqVSqixSdC\/T5BZVSeV6pVM7Tfa8T54mzdE\/ia+hv6n74Xfr\/7voXN7mxi0\/4\nmrUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294353849-3346.swf",
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
	"trophypiece",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "smash"
};

log.info("trophy_street_creator_dirt_piece3.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
