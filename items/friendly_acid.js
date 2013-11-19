//#include include/takeable.js

var label = "Friendly Acid";
var version = "1347907854";
var name_single = "Friendly Acid";
var name_plural = "Friendly Acid";
var article = "a";
var description = "A compound made out of red and blue.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 5.5;
var input_for = [236];
var parent_classes = ["friendly_acid", "compound_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
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

// global block from compound_base
this.is_compound = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_alchemistry_kit", 1))) out.push([2, "Compounds are much easier to manage if you have an <a href=\"\/items\/497\/\" glitch=\"item|bag_alchemistry_kit\">Alchemistry Kit<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	if (pc && !pc.skills_has("alchemy_1")) out.push([2, "You need to learn <a href=\"\/skills\/51\/\" glitch=\"skill|alchemy_1\">Alchemy I<\/a> to use a <a href=\"\/items\/463\/\" glitch=\"item|test_tube\">Test Tube<\/a>."]);
	return out;
}

var tags = [
	"alchemy",
	"compound"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-11,"y":-20,"w":22,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIE0lEQVR42uVY+1NU5xn+sASvKUZj\nYxoblIgKC3uFvYGzf4LTH9pf95fGJE3LRo0x2pjjBSIQ4ioaM\/GSjagZY6NM7SSdSRrPD5k2vaQ9\n4CW2QTiwXDTczoLgBZt5+z7f2QMLdoalUy8z\/Wa+4Zzd77zneZ\/3fZ\/3XYT4f14dqwOhs6589XDh\nM3IfsuVGjxTmKtiHCpauSctIZ5nX8aXXqSUNxCwD7xUtDWG\/m5ubjXNfB1yhJp89guvLfm\/4\/aLl\nxM\/IXc\/XHzpW0BnninCq7e5gMKfJ75FnPnHn37VbPKbtKb1sLfURXnjWtUo+iJedsOdJwwCLc+1l\nfv2C30lNfnsYL\/6T10kNzpX0RUkhnfe7eDvpnMvmgCPnfUVj7FwJehtOO027OPuPoIca+Wyj3x5L\nOxTxMr\/6madQAoSRr3x2NuCQ+3NPQUOT363ACb3MR40+h3HMvlzn0BE2HLtS6qXfewqII6BLRwJO\n44LX5kBIj7Oj3wS90lkAhY0mv0NPi71UFi0jeCGu4alabJOf4f4Tt42Bu+mfwWL6IzuBz8HiFyUO\nuhxw0ynHCh1nLgWKJYi\/eO1GTKZArvE3v1t+BzuIwgf2PONzV37OBZ8zMh0WpRG8tKW0BOzpxwqX\nK79zFxqTwV8MuOhcsU39rWuFo63Up\/NZFfmK78CSWmynZrZxzmMzkMNICSZBOscpojCz2p99Lh33\n5wNFofSKpdQfRhjbzBAQQpQKHKG3wm7tVON4HgWB\/EW+mWAcMmfxvR70KlbesQMKzjb63TijTotF\nWQjJasVLLfbw4tTikTt\/WU7qs2APuQhn8BdAP3at0ie\/p6XUqyEaOJ9kNZwWwI+dBWvOOldGrfsT\n9uUKjCD5Uc2Hbc+ELfk5YlvmSJWTRp\/bAGic\/chdYHzKjp70+9XJetdR5ldQXJYjyYLU0wKIqsPL\n5TUbHmOKE90SW0sXp1q\/+Wl5eGN4v+ZZ+5k8\/+Rpkmx\/6imMwM5Re54GR5J2G6a0C8G26AYjSPRY\nisDC2z+UFBrTkYel6\/4emqlc1RbuTeiLD9+gJR\/cieaeorHnf\/2Tl6I\/fvbM1EUy4PFkI4cuBmRi\nS7rjqwNRhAI5d5oFuVlW9jTEldeMF1to9pYuerSihxbsNugH71ynHx69pS89QxIU2M3Y2EEL9yXU\np47eoh+dvBNblmR6YnGs9scg1FbSsv5FIQVmVa6UsgGt+zqYn5M2uudaHeK5ZhIvxylrUwfNVa7S\n\/Jp+yuY9u6qfRIWxZtaWLmXejmvy88frBmnxwRF6qv42PX3qu3GgqFQIsCUPFxjIVyyyyMUzrlWh\ni8Fio4Xlh1vZtNgTzzaHxAstJLZcJVE5QDPWt1NGuU7i1W6+Z4A1CUM830yPsANzXuuWLD9WO0CL\n9g\/RvOp+nJEtVlwOlmipfRjdA\/mmemxhq8uA1WmxJwF+ExEvtpJ47RqJ2iES6+LMZgeJ7b18P2iI\n6oQqGd7YSTM4zDNf6aBZr3ZSxgY+8\/q3JN4cNAFCy8AWKtiqWEiKVVXJam6Y9qz1s+Y1olw35Mui\n10m81E5iK4OtTpA4cMOUMgDc1EXijQESv2Km4ZDF8N4RZYI96JoEyFpnadvxoryoJTUAamlg2iDX\ndzrEth5d7GYGN3ebQPYO6+I9s0gmAIQj6+MWeyTevT0RIAChx6JXWrlpSY3VRSyw0wJZNZDNrOmi\nolfj0EbkdVVSal64oo4BROjH2BtmlkfDd1Uyj0qyfyLfEGZMJseK8mROfuktkpNIY0qfTmctOTka\nmb3v+jioqmEHF4hZcAC7rbeBi8gQFQxM6WH2EiighrvYQ8+F7rXybPdXr11DLmJIAItgDZV+iSvc\n6tNTrfm7jdCifYO6lI7JGmeC1ETNYGSM5cp+TVQbNIHhVPYAxgKCquWq1uuL8mKtZT7DnOWK0xPq\nDd05XI3qvG3XKHtXrxRoSMfiQ0mN+\/A7JfOtRFSCA5MMZn7tQM6jexINj70zTE+8f\/s\/s4ffFRPG\nKZ6c0dbQ3JOTtJZWm1vbrGT8opUe2dAuu8i87Qy0qo8WRA3ilkdZlX0kqobMAeLleDSLpUWKeHWf\nKdZw5MSoNtYSUQwWexN3rhw20QYv+Z1K2nnHAKVcvMKatqmTsliIZ23upEz+K4tgJwPcfT2U1EpV\n\/FKnmRvjNPf1q9IROCHT4vioxinhEP\/zZQG0ZAWAnr9CwhJg6GDtoCaFeG2zKS1cyXBkztZumRYL\n9yRoQV2Cvr+XBf2eA6xiQGhxuEelQrSjQ5rY3mMC504idrAT23ook89lrmsjDBCyA1X2q\/ceIBiz\n2Kvh67dvkqgn9OnoeOcYAKvEumgyiq5SKZ1R7s2\/FH6uR8TmLkMCrBlMZU8XB++Eko40iPI2E0wV\ny8suPruu3RwukBZvcfc5cDMk7tnaxNq2y1DkoAABhu5NYLolm\/uzJpkFe3AAjiDcaHVg+r6sioEc\nUWNE7gJoObGDOwnycmev2e7AeN2ILg7\/Kyzu6+L8mxtNxJ44OKItqb9lPP0RA6i9mSOBS4B9GMGi\nom7YIe73mlGuR2amDqVvD9GTR27QotgtytozND77PbDFgpwR0SmLh1IpyNA67iyP7xukOW9ygUzu\nvQ8CoJSPrd\/S9zZ38fQcp0zuHrJiUekPfFkdAxVaNzIu0Ob4rz8cACHWO5MAI21mp4D+7b+hPniA\n+AG1IW4OpRBgTNEAG+XJ+dBoTDwUi+dEUdGnShE2hwZVHLgTEg\/dqh0KizeMhxDYf7n+DbKmIavn\n21t\/AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/friendly_acid-1334267144.swf",
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
	"alchemy",
	"compound"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("friendly_acid.js LOADED");

// generated ok 2012-09-17 11:50:54 by martlume
