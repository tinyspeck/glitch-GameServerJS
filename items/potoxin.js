//#include include/takeable.js

var label = "Potoxin";
var version = "1354598548";
var name_single = "Potoxin";
var name_plural = "Potoxin";
var article = "a";
var description = "A compound made out of red, green and blue.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 500;
var base_cost = 9.7;
var input_for = [162,165,342];
var parent_classes = ["potoxin", "compound_base", "takeable"];
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
		'position': {"x":-9,"y":-22,"w":18,"h":22},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJDUlEQVR42s1YC3BU5RW+Y2YYrNbc\nfT+TzYOQhOx7k93sJrjQiIhKdyx1bKntTmvLaNtx2\/ExllZuVaAhgSzy0pCQpTyEpMBaDAEBuUoF\nAqg3Ca8iJGtChAiEGwUtM+3M6Tl3k+WhCdk4Gu\/MP0y4r+9+53zf+f5lmG\/p6C4pDraXuqNtHkuA\n+a4cZ30+U9dEbxiXeMxbCKdKiqCl2MZ\/7Qc7dqhtkw9p\/dPajP4pHxj9yd5\/ZqLX31VazBOoXS4z\nrLPmQJOzAE76CqG12MrRNUfcBbZWjzXU7spKTerhWQ2y1NK39fDD42nw854MmHE6HSYdMAQHu76j\n1G076nWI9OKBl\/EuS6TelgtrLONgqyMPGqw5oTOlxdz1ADtKPTzeBy0em0Bghw0wr14VLOX1MP1Y\nGszsNsFDHyLAd\/Wxodj60OeGdixfm9eeAIrAYhFzNrzpzCcQ4umSIpEAtXkt\/v77gO4j0HQe7wsO\nC2D2ahXv2qaFyfsMMPV9I5QdNIBnpw7YhaxpMIB8oRV2usyhf\/tc4kG3BRod+SL12p7CAr7WnCVu\nso2H9zxW6r8bAFLp27yF4VipWzxSbMfz1sgtS65bpgyPX68G+z+1ULRdB85GLUyoVwtsJRvIXa\/i\npwpGcebHGTBpn54reckQ7Jo6KUoA9xaaRWJrPb50oyU7odTqrKzUWnN2lMr9ryIzsRXtxrYggMQw\nMUcfQx+w2zUB6q3juSEBjp3LmtRL5IKpVgVZq1WQsUoV0y9TSC80b9LAlMNGmNGeDmXNBjCGlZww\nvSRCAAf67WCRJSz1mM9hIjADtrLdmS\/Qy6kFTvicESovMUuMN+GHEdiagiyhzpIxPFHeUc7a2Eo5\nx5TLEpSnr1TFHFu1ULxLB9bXtZEBK9ntMkfpwaRKKtOA78VKPSCVDoEOiGPgXGuxS\/ooZBdLPW74\nwK4\/jCuV\/rJmXeiBo4YglZgAq5fKOWO1kpNVy76yV1o81jD1EamWmG3xOgXszRvUSgD3F9nFDbYc\nodltjtH1l1yuVHKEpACaGzT8A21p8EinCSxbtcP6QnoZsUg2stmeB8d9+aZjXicyaJN67GYRoHkL\nJ3xFCNQOeB0kBZBKWtikA+9uHWiWykMlvDb44DFj9McdJv4+wThoMxOojhI3bLSNl1RNvdnfY1+y\nq022XAH7U3zf4+CPFjuSmzLUh4oquahdpgjqVyijd+\/Vw4\/QF39xPgOmH00D787BWaXxRv3Vv6Ko\ncEk8VMqTbscNpdxoy+HfLiyQejUpgDIUiHyRXGIqe4066t6hgymHjHB\/axpM3m8A+xvaQVk87LGH\nkbFwbX6m5J8xnydw1OtCO3FiKeNMHffaQ5LS0RvXWbODe4ssyQmFhCHrV7F2qSKSt0Et+WIRAiWf\nzP67KjjcZ213TuAabDloyE6OAJL90LymANFKkwQdIGkVyxYqrlGOQFWL0R9rVJBZpwJScrLPqy3I\nDtKUOeg2S+OQzJqE1FnqEW9W+pCHZ5cmUHbIKAZOpMHDMZMUGO5+Rx9TL1ZEvm5SopIPlJ3SDvYn\nf8xjD7ShX+7HSfO6PVcc8gEFm9W2kj168b4PjIBqhV\/2ZsLPcLRRusHxlgCY8sfO4J1zPwlrXr3C\nZ24GW7JASSxk1pvt40UeBVKPU4XmNq6hS43jjPe9pYd73zNKSYYSzSMfmeDBIwjwXQM4mlC5j3WY\nmFmnYMwzXZBafhE0tZ+LWQ0w5JAfO\/tjTld3NfHyzkmTgiSY2n77WWXO4mhu3\/LL8jdqpJDgRzDo\ndVLsIrO+B9VLwE01AYF5\/DTPhD4C5tluGPNUJ9w+5xx8f5E4ePlnnQ4yv22Hu+ZfAFXVBWHmYxsi\njTOeCB5GgVBfJkU9KhMsWzTgflMHE9\/RY1kNElgC53xDC3n1ag7ZizJ\/OgvMn88B84dOYOZ8AkzV\nZckiMqIQwsXRYpdfjgtp1qmwdC2CZP56ISGut2b8Ovn4j4YsjFujBvM\/NEDBgLKhC63FFkVwaDMZ\ndZhsZrWnMi9ciBGD+C8wiz4DphxSNXVXA7pVX4C0ar+AFK4HmMo+npnfG2XmILD5YphZckXq16In\n9vjnProgeYBsFetHkAhEBTlr1ZD7mhooHxKzaC2JB97+4qIo80JXgFnyHz+z8FPhtgoxxFb0iriA\nXXARvvc8MjwbWavouzbe6MMePw1jn+uWrtGsvCLKbtG7X3ncWcH6FWFpxAGB1S1XAnpgRF4pD6te\nlofKmvXRiXuzr\/UcspfydBef8uwZSJnTAynze4F5siMOsPJTYGr+F+gvNcf8rh1uw3N3YN8qFveB\nfvXVkVsXu0DBsxVygUJsIoIhi6Tw6UfSbvSr35zyM79HUH\/piZf8xYsg9WlFH\/bnZ4EB5TPPYFvM\nPgtjnu6Cu+adB\/WKy2B87b\/+kQHEctMsnoZbz\/uP60z0N4Eet1bFYz9+eZKQGJ46A8xLCO7lK3ER\nVfQJzALsw+d7eOZJVD53Hph5vXHB0LX0QXMvmUYE0LVNE5p8wCD5IO1DyMBl5bLBeybeYzwyx0ug\n5vXyVP7E+ee66f\/jzNIiliv6Rl5itJUY+d\/DOFF+0mWCaS1GtB9tcMQPJKb+diluS+Uisvw5MLUw\nMva0K5R+2iQha9JG6V7cglIexBTDMd+Fg0pJVkMgyQspWZMXGl5RhumcZYvSj6BFChP0M8mogCSB\nGF5RQGYkvgVFcAKBYxcqghMaNDANRyGVvuyQITJ6TFYqePJFFpeySh6mmJ9Zy5oy6pQiBVcah85G\nTXjUALIL5YkEkl+v4UnR7h3aCLuADRqrFdGMiCqiW8aaRgcc7YXR+xJzerkiQr1YsEUVHFWB5G\/T\nmX5wQM+VNRvFaS0GwbdPl2CIxt31oEflcDRqefpl69FzGfDTMya4p9mQCAkYHqKFTVoe98fcqKhX\n\/Sprs2IepPRMe18KqyQEOpe5Vm3DXCg+dDIdfiVm4vbTKLh2yVK\/3b5bxNrIUmhbST8S0SIvxB0e\nr1uuiFHaJnZpj0K\/cDm2jgKL6H\/h9BqlSMEVwYqGakWQgCvDco7yYeG2OHAHJuzMdaOkYIpY5H1j\nb\/pllXKhtDdG8ybg3zSO\/wNbjuaf6eu8NgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/potoxin-1334267317.swf",
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

log.info("potoxin.js LOADED");

// generated ok 2012-12-03 21:22:28 by martlume
