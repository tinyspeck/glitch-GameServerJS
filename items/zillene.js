//#include include/takeable.js

var label = "Zillene";
var version = "1338861280";
var name_single = "Zillene";
var name_plural = "Zillene";
var article = "a";
var description = "A compound made out of green, blue and shiny.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 5.6;
var input_for = [163,167];
var parent_classes = ["zillene", "compound_base", "takeable"];
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
	out.push([2, "Compounds are much easier to manage if you have an <a href=\"\/items\/497\/\" glitch=\"item|bag_alchemistry_kit\">Alchemistry Kit<\/a>."]);

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
		'position': {"x":-10,"y":-20,"w":19,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJuElEQVR42s1YCXSU1RV+LLWoaCaz\nb5lJoFhLgYCgLYIOVKsIloCnm9qe6ekponWJFoEAwgCyBJKQQBLIBkNkj4QRZCdhQBDIOtkwZJ0k\nk5lsQ\/7sC+C5fff9mZxMFllE8D\/nHsLh3fd997vbI4T8iG9iuqfHy2lqw6xstXnONS\/z3AIv85+u\nehlfzVT6kYf9TUhWaHUXVNxrFjXMLdTAmzYtvO3whr9YtUBJwsspqtCBfKddUvjPyFYbZuerDa9f\nVRumZ6p87wh0qllhmpHJAyLQnHwNhwr1PjciwdPjudMKy\/RvVTAz2wv+XKKBf9Z4w785H0bUL18D\nf0xTw\/Nn+yo5OUlhfiVdDW9QjLft3vD3Cj6g6Zfkuh8kN\/6ILPTFC0p4PdeLgSDYX8u08FoWBfrG\nHWhsotT43EkF6C6qwKUgAr1l71IwjykIzycrrD39xpmkhilnlfBqhpoF9S+nD1PdLx8JqriJZzw9\n+iXns1ugHX9YDi+cUzJC6PxmpRbeKNKwy2jUVsEmgc5lo\/dLuYnH5DDVrGREZuV4wZxrGphboIHZ\nVA3MwjRK\/nenFeC9Q6J3+Y05KOV+f0YBL1EfPIc4iDEzywtoucDEYzL\/fgl67xDrxnwpYxfSSBhJ\nVHKGhQd69oQChMGibntqjxTGmeSAKr5wXgkvXVHBKzQQDAZTO+1bVE8JzxyVgzxc3O33671SeOZr\nGtg5PjAMBP2wVJA4KtwvQflWsW7ULin4fiVnJBEUI8KLkMTYRBm4Kb5DAr\/ZL4PxX\/EkkQz6vPiN\nkvkg2ERKbsxBGahjJP6CEIFvlxDc6AMyRhLPTKEZQF+8A7FH7ZH4D1iD6igRhyTxUkw3XoIEfpsg\ng5E7paaeZ5VbRaYROyXw9D4pjD0kgwn07KRjCph0nCfG\/GhG8D43IbYIjTTlTEnEwSyMo\/6I8St6\nVhEn0A5IUBAk8FNuFYP3dgmMjJcyh5HxEtDGiTlFhLujmNaTapsY64uRQKKjE3ggVBYJoK86Wuw2\naoatEWglYUJOHcXjjDBKwIeaJlYCighx6G3HzOOBAl9hiNAq3SwCWbgIpGEik2dg\/50lChbpZVt4\nMG0cBdrBGwJrYsS09mjdBQmNvf2RpGCDMFQUIjJLQoVW8SYhh+L8JMOaBRQstErCaEBbeMPgKGgo\nDdTgGSS0ULMKaDD9+WMAeO4n3ypIdPg6gQ6N9FJMECzQUiKhnsEiE46ayaflOhz+s+kGwcYYuUf0\n8Neii6gsQmzBbsfN8Y8qb3irEheBl3XAAf2gP9q5VhxDOGNx8\/zNtamSlcafBUHs7mfpzPvDZX4Z\nuBYBHU3mnwVBbazEivMR5+XkJCWuUDY3n94vffgK4jaho4XNvFG7pWxeouG8VceIdXd9YWJKge+h\nlAK9KfWa0ZSab\/k6oxBOZBVDeqnDmmN3Dth5E44ptPgWnEMfrzNz1CYXORw5OFLoDDTgKFJEikER\nLuJEm+9hBh63FOuPUkKH0wqAEgT8+SQldzbPClZnA5TUcpBrqzWml9T36b5Jx+RmfCPq63zYS4Wu\nQvN9H8RH0wvMJyzFgHY8s4j9mZRTClnl1Yygy\/IddZb45AxD7KkUw3\/2rTRoIkaE4m7F1ww+wfBl\nM+n4fW6AuORM7WGqmougy85Qgrb6JuDaOqC2uRUquSZGMr3EDjEnr8CSxFhufORUM647JImNgI+I\np3ZL9PeVIAXz70kMU3v+uzJILbZD2fUG6Lh5C27c+r7bmjs64Xxucfcz6YlA+uiIFBm9YsVmVfQd\nPADuWsFTKSYXuWSq2oX8CrhSWAl5tlqmGKrXk2A11wwxp1N1D2QURJ9J94hPTodTWSVgvloGF69R\nckWVkFHqgKKa+u7aa7txs5vg2ewiwLJ4IARjT17x223OhEOXrzJyKYxcFWSX17g1R1VjCyPX0t4J\n8Ulplgc2TKNOpvjuMmdyR1Lz4eClXLiYXw45FTVQUOV0I4iGtZdVaofoE5dDH+jEjz6VokcVj6Zd\ngwMXcuBI6nesUzOsDjfLs9XA3nOZ95TeEQnw414vWPTGpDQOSSZeygNzbgkUOJxuZqF1+YU5467V\nU+3q9NXsvclp99\/itAm3TN4Hwd\/7EOjuaR7uTEo37z1vASvdHFxbJ1TSOYjk8mjaD1zIvuvulUa1\n+MpiWzjF9jZQGttBFd8B6l2d4LXnBmj23QTJ9jYzCay\/O3XDjqZacFO4DOsUZyUO58UJ6Xd8mScF\nFobWW0WbG0Ac3giSyCaQbmsGWXQLyGNbQRbTAoNWOzmyoWmAwf5OicewhTbd8FV1OsEmzl8a3WpQ\nfdFhnBJb0e+q+mB\/ru+s7SXd\/6ZOAJ1PIvRfj5Tc8NU1lifX1oLH+joQbHCCZ9B18AypB2EoB56b\nOBiyvBrIaieQjQ2mAQgWGQZ\/UArDllTCk2tqQRTWwCJT7mwfcIxIgp16CmQVRzaZ5HFtLF2aL783\nuDXB4nqPRxZWWIYFVMKjS+3w2GcOeHxFFQxfWQ1PfF6DWNzgRZUWsqwKyJrrQEKagET310TvFFrJ\nh6Uw5OMy7tFldvBYVwfiLY2A9aI5cKuv7BR4WIDdgECoCioh3drMzqt33eBo8etJcLuWrLtuosHD\nIP8yGPypDYZ+WgGPUPvlIhsgacQjC2xAPqMKrqsHsqkZSFRHr98wzCvS4SXs4DIHN\/STMu6x5Q7w\nCHSyesGCFuzo8CMbm3XMgpr86IUm8l4x\/GJBOVNm+KpqljpUnpYIDF3L0sVRA\/JJOZAPrUAW2YGs\nrKNEqFJrqQXYrYRmjSysBLKiBsh6DkhYC1Wws1fW5hUayfv0YICDj2JFLTcE1fxfOQxd6uCdAzkE\ntJANDWZmhhoLebeYXT5osZ1XJYAqRJUhS6v4e4IaDcwW2IzkvyVAqIJkeReRzS08mY9cxGuB3gtk\nSyuQ2BtAdves53mFFvJxOU8kqJGqSOX+qIx3NFDH9fVWlq7eqiNBPLOWkllNlXmvhFdjVR1fSz0a\nkMwv4pVc2lVrmMptHUCoCEwY9NlIscPbkGCv\/6PML\/UlC20c+dzJR4UXBfSIKqyl70DuTRAVxiCx\n2FEhBHJvQhNTi6rdTSainf8ZSSN2MA0qsm2AplxWpWcgSGiJg1dkY5fkcf2MDwxqfjHXTXAD9V1U\nyfuhelEdVneCxXpWRphmV8lsbuWVxIyhqsGNlv472PWFNBnJGicfDaY6otXSV+4e3\/ulWkrQxAgG\nNfCdiMDh7YY+QJjmd4vNVGWOqby2K81RnbQuq\/HvVhJ4ux2Nl67jdH3q7XYf+mADrXaa7sh3cY0v\nWeXUUx8jS2kgx1Hr9zf9\/wfLn1MYK31JBgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/zillene-1334267405.swf",
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

log.info("zillene.js LOADED");

// generated ok 2012-06-04 18:54:40 by kristi
