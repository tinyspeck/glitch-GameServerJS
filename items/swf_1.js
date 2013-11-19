//#include include/takeable.js

var label = "SWF";
var version = "1338601876";
var name_single = "SWF";
var name_plural = "SWF";
var article = "a";
var description = "One of the three essential elementary thingamabobs that go into making a game. Without this one, the whatsitcalleds won't do that rendering thingy. And without that nothing works, as any fool knows.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["swf_1", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.wrangle = { // defined by swf_1
	"name"				: "wrangle",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Wrangle all the imagination out of this buggy sucker!",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		// effect does nothing in dry run: player/xp_give
		self_msgs.push("Every last bit o' imagination has been drained out of that sucker! Optimization complete.");
		// effect does nothing in dry run: item/destroy

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var context = {'class_id':this.class_tsid, 'verb':'wrangle'};
		var val = pc.stats_add_xp(25 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		self_msgs.push("Every last bit o' imagination has been drained out of that sucker! Optimization complete.");
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'wrangle', 'wrangled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

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
	"sort_on"			: 51,
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
	"sort_on"			: 52,
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
	"sort_on"			: 53,
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
	"collectible",
	"swf",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-34,"w":32,"h":35},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ8ElEQVR42sXYeVCTZx4HcP\/pHzuj\nYrvd7drtrDu721q82Jl2q7OtjUzV0e161Hp0d6vWdo9ar7qr6wW+WkVQlFOQOxAg3IQACeEIAcIh\nhwQRIkgg4okCggKign7397wk8Y28UenaaWa+Q4aQNx++v\/d53iTjxo3hBkDy8OFD6cPhYd2j4WEF\n3eeGh4fXY2hIQo9NGfdj3OiFnSjrCWN49PAhWAg4kqEhDD94MJL79zF0\/x4eDA4aHty9qxsaHOTo\n5zb6KcHg4JQfAjaF4vvo0aMeymjYkBBGuXcPhGFAEIwygPsDlP5+Sh\/u9VHu3Dbfu92ru9vb6zt4\n+zY32Ncnud\/T4zJW2DKKgkeJwoZGw+49A9Z3h3B3QChKLwZ7e3G3p4dyC3dv3cLArW70d3f39Hd1\n6fo6b0oHurs5Y23t6Na7Ozu5rhs3cIcOMEAHHqQXHCLM2GH9jmG9PSM4C4wwlC70d3Wiv7MTNy9d\nQolGA3VysmQU8PrlyxwF1lyjP2bpuHIFnR0d6OnqQi87IL3gAwKOwO6OwAZEYHduj+CeA8YeP19n\ngColGdnJSch8FpDBrra387ly8SKfy2YzLrW18WlvbUXH1as8\/ha9QB9rnTAMKQrrEYFR2P2u69dR\nkpfLw7KSEpHJkiwXBzqCXRbAWC6aTLjY0gIzpe3CBT6tzc1obWrCNUvj1rZZoww8AnuMY\/9Mc8M5\nW2s8LjEBygQ5MuVPAE0Lp69v89prFuJ4mKU1OxiFwcxCGMVEONP582ihXDAa+TQ3NvKPtdMxOun8\nvk0jvk+nRT+1bNeaBZYhj4ciPg7pctljYOMXH5tbNyxB298WomXhTJi+XIrWnX9HW4AHLmqUuFhV\nYcOZRVrjYZQWIY5gDNfU0ICmc+dwnqW+HkbKTWq3jZ5nG+eTuLhYpMsEwNzfO4GlYM5klK2Yg9o1\n81D\/1\/loWrcY5i+XwbTkD2hZNhumTZ\/B5HcIJlkoTFoNP05HsGYGowhhxrNn0Ui5QeccG60YLC1W\nhlRZDJLFgCzZsyZCPm08n6RpE5Dj4gTdolkoXzkX1QRvXLsIJmq7deWHfNstG\/6MFrfNuOBzEM3K\nFDRXVz6GUYSwxro6NFAYsOlcPTIIpxDBpcREIy0uYooocPvkl9BhauK3j\/6OazD6HyTsBGiozbxF\nM5Ex62UoKCrJmyhY\/j4qVrvCQKdG47o\/8W0z9IU1rriwcTWajnMwxkfCqM7kYQ0GA85ROq5d41sV\ngyVHS5FEsVsgQqDv0nm0NfSi+NM5yPrLfH61abevh1Gbi6ZIPwS\/OR56aQgKCZwy6xWEvT0R8dNf\nQcLMn0JOUS\/\/AAWfSlC+Zj7qPl9MDS9B8aJ34fvWyzhbVYX62loeyFq1wYQ4aRQSoyLFgRoaZ+w7\nk3GrlU7+nAwo6dzTfjIbmvnToTq8B5cKVPD49U9wh1ajOVeJSOdJKAzxQ0NUECI+cUX+3i1IXbMA\nJ6dOQuS0VxE942eQUjx+MwFbfvES9JocnD1zht8\/jWfr7FuzwBIiIyCnjAIynJoBncdD\/ZEzDJ67\n0NFQB5MyCXlL34NsxTzcbDIiaMlcXG2sh6lCD5\/fjkdLaTF0W9chzf0\/6KDft9Hi6Wwz4aapBVGE\ni5zxcxy2AFUJcairqcF1AjbSVcM6zkTCJRCOweQR4YgPD7MH5lhwKpdJCPr4fbQo5FDS\/WTJVBSF\nBaIpWQa\/343H5bozSNmzDVVJsSiOCELwqoW41tiAxNlT+N8b0xJsrWWsXsDjInjgRB6oiAyFoboa\n12kjN1RW2rdmgcWFhSI2NMQeqHJx6skmUBYlnhZE++ky1MZHIeO\/m1AaHY66cH9InZ1QFBqA1ooy\nFO\/\/Fok7voE2yAeNiiTIZr6KpJ2bYCrXo0wWjqzdW5C28iOEEy58xms2YLT3EdTSeci2I61aZRtn\nPOHiCBdLOBnhZCGn7IFZ0ye5ZLpM0lFrZiWt0MzZb6Do61Uo27cZZXs3Qen6NpJoAcR+\/Tnaa6qQ\nvdIVJxa8hzbC6g\/tQgw1Jt\/+L5xXK1G4dysqg32Q9Y81PE4IDHbbiTPUHNsntarsUa0xWMypYEQH\nB0H0vWC8twcXd8gN0s1fIGYVNTB3KmLffZ3HJVLS5jmjaPcmxFFj3tNfQ7NOi\/TlH\/Ijjdv6Faoj\ng\/iRWmFiwMqSYjQRMD87y661GMJFE05KOGnQSXFgRY6KK81SQJsYi+zQQD6JPp6IcNuBMGovdLkr\ngj9wRuQ7b\/CtpS2by+OiCCVfuwwFbttH4YTAY9u\/oZWs5jfyvKzMUa0xWNTJQERSRIFUPSe8RNVV\nlKOyIA8lynTkxUbx4IwgX8QfO4zwnVsQvGEVfBb\/EYFz3kKIy+uiOCHQc8s\/oVOk8sfOVSofwyhR\nhGOwiMAARAT4OwY6vERZrgLVRTqUqrOhS01EriySR6f6eyPmyAEE\/3sj\/NeuwNEFsxEwZyqhf2kD\nfjvrVzwwTy7jj52jzLCNk2\/NAgunhPn7iQMJxhktF3bhtdOKY1eBetpo2WZ7lvYztqexbeO0tgAl\n2UpoUxKgsaDZqRHK7YHPjq04tPEr7F7\/GR91VCgaGVCRbhsna80KC\/XzRaivz1OAltaEsHMMRhHC\n6gjGcAbaNmppZbLVeeb0adRQqisqUEbv9dg4WWMMZT01GJ4dX5WebhtnOMHCLLAQnxM4RREF0hM5\na2tCWP1zwmoIVl1ezqeqrAyVLKWlOK3Xo7yoCCU5amjTklFfTVtVWqpdayGEY7DgE8cRdNzbMfBZ\n4+RhApwNZsFVWXEMZsFVsJSUoLy4GGUUdvys1BTbOPnWCBZMsCDvYzhJEQXSE7mxjrPmSZigNRvM\niqMWWeoJmEmfQ55sjcECjx2F\/1FPg0OgtbVRMMrzjvO0A1ipTgc9hf0zSvosEixsjWCBR70Q4OUJ\nPy9PnSiQYJxday9gnDzMiissRAmLVouMxES71gII589wnkfg63HYMfBFj9Pamt4CYykuKEA6fR6x\nwlhr\/gTzO+IBX8qJww6ABOMcjtOKE8KsuDHAWIry823jtLVGMB+Pw4Q7hOOHDjoG2rU2hnGWP2Wc\nxRYcg7Ho8vJEYSO47+B98IA4kGDcDzHOIguOwVgKc3Nt43zcGsG+O4hjBw\/A6wDnGPjkOKueNk5r\na88YpxDGotVoRGFHD3A4yu2HF+euc\/j9YE1NjRO1JqkuK+Mq9XoFoczPM079U8ZZaMExGEtBTo4o\nzotwnu5u5iPu7pIxfanJ0NSapKK4mCOYgmDmsYxTa8ExGEu+Wj0att8dR9z3+Xrt2uX0Qr4irsnP\nd6JFINFrtRyBpBSDXWuCcQph1vzfrX3fG41TotNothFMSiiDGI7F2pqnmxs37se+5anVkjyVahtF\nSjEwoIfbPoOXu\/szv0D\/H+Z9gY7Urd2tAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-09\/swf_1-1316567438.swf",
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
	"collectible",
	"swf",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "wrangle"
};

log.info("swf_1.js LOADED");

// generated ok 2012-06-01 18:51:16 by martlume
