//#include include/takeable.js

var label = "Diabolical Drink Ticket";
var version = "1337965215";
var name_single = "Diabolical Drink Ticket";
var name_plural = "Diabolical Drink Tickets";
var article = "a";
var description = "Printed in infernal inks on fire-resistant paper, a Diabolical Drink Ticket can be given to Hell's Bartender in exchange for the potent Wine of the Dead—a fermented beverage which revitalizes the devitalized. No one knows what the Bartender does with the tickets, but rumour has it that in sufficient numbers they can be redeemed for either an all-expenses-paid vacation to Ix or the apocalypse.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 0;
var input_for = [];
var parent_classes = ["drink_ticket", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.buy_wine = { // defined by drink_ticket
	"name"				: "buy wine",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Buy Wine of the Dead",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.findCloseStack('hell_bartender', 200)) {
			return {state: 'disabled', reason: "There is no one here to buy wine from!"};
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (this.proxyVerb(pc, msg, 'hell_bartender', 200, 'buy_wine')){
			return true;
		} else {
			pc.sendActivity("There is no one here to buy wine from!");
			return false;	
		}
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
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-19,"w":48,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEhklEQVR42sWY3UtTcRjH\/Q8MgqCL\nMArEVptLJ8ZMptu66Eq6624X0bxKE8roDSsKxHQTDTQxli\/FMsWooChyRC8IhYO6qJsa6I0SuD\/h\n176r73j48TvuzL144GFnHs\/v9znPy\/d5zqqqKnRsPAlGl4e9i5M9rhC+b84Fq1dGjtdX7fQBkPV4\nMJEBVLp9inqTOw6XAUmuTbWp1521aqnLoVZuN6rvd5tzkPPXGhM7ArcRb69fjwdSP0e96kXooAIk\nzgEHyOXr7izgr4dt6lGvu28n4NIAgudkWAGKTwDSk9\/GW9XUBWdHReAy+dYBOHgJIdXhZk7uzX0H\nPIE\/RrzpwTOHaspcqYEQvcMQ0uBNwI16dmXPCYzwVyQfM17rxiYfLjqNcOMtu7NwMFkkehpM9jgT\n5YCLMWT0jg5nBah7HPk4f7UxVEKNC8QQKnjOCg65SDgY8lPXRISa90Mfhzpr60umcZQR3SsP\/Hty\nmzL\/YHrxMB8XTu\/PrfP8pidREjhsZoIDCLyKcNKQAvSoqbPgYQDJ7xPnXamSahxNQgEWQLT4qX1Z\n0x+KBsDfE63qx6RPDYUdsW3DwTvSY1ZeMRlykJ6ksXAoO2\/7m1Wk09FRkMYBTtc4LIjN9ALJZ\/CU\nLBwdENUcOVvnK0iA9UbP5IexYnVQhMsUTqQHQo17Zd4xEmuzfhUNO\/pswAWjvFFuDhh4EgDUOYSd\nQ4H0lEwHGuDgLZmPuA9OAFymitN5pYYCjA0AolcqPYZFWbX0CCEBYALE\/0h5whq4B3DTve5kf\/hA\ndR4ZCSzqMsJiQJg54xGSYkwtAyg9RLmxylOsi2sYvWYvuRM24P5pnP7kAJKJTfHFJx8Cns6G6T8k\nrgOSrU5fk2kBWRk7d3hrWdlc8NcATsoIh0x6gEVBjaOXmAIMN64zP00hltFBxY51OaO2NY69UjZ6\ntC32UYZPF2dCYmOGnmvocIT+POxVkXDd1sPBn7kTPsBxHJeVJgUY+YW\/cVNKDj2FB8CDUBtl6GU7\n45oYUvOKsdQ4PYkBI9sZgAChVyPTgDmGtahz8oGlA2zJiBw0Ta1K7xLYXA+XlBt5bmpvuA4ZeXWn\nKWl7vEd4rTwoK5GGTQDKps9CYThZNHql2tY4K0CWu6naWMXSiywmwrBt6WuwA0Hj4lcaYgXByRDr\nT21l9CpyD6D4pHjjk5UsB1lbGrdFr00yxCa9kk2foxHHJYCyGGQO838B9\/Vei+LvMds6MNKszvrT\n7BT6tMJigXxgU3gM56xa0xscK\/\/LSEs6r8bZgswsggSWE630hpzX4BVOMhRiWamMwtJAc7roFx95\nPL3eEJUvLyYpYQGYJhQ5yL685UmVFI5HJl+SDJPeyhA25ByrWFYr8xJReHbDkyy4Ugt5W1udaU9Z\n\/XxhGu\/5sg64x5fdi2WD4\/FmoMlnepk2yQ2vQ0agcRX7+Wy61xWV\/VgXXxSO1LiJHld3xX+ARL8k\nDNsaTI7qRWtcscf7wWPG0OY0zu5rYbmOd4NHa\/ACTcNwiWIoucYVJeLCSxiR7ncd6St7pYrjL5Wq\nhwQPptcYAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-02\/drink_ticket-1329260448.swf",
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
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"u"	: "buy_wine",
	"g"	: "give"
};

log.info("drink_ticket.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
