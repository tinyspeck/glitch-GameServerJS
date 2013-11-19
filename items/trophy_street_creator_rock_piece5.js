//#include include/takeable.js

var label = "A Piece of Street Creator Rock Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Rock Trophy";
var name_plural = "Pieces of Street Creator Rock Trophy";
var article = "an";
var description = "One fifth of a trophy celebrating top street-creators. Four more pieces similar to it, and one mighty Rock Trophy would be born.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_rock_piece5", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "400",	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece5)
	"smash_blue"	: "550",	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece5)
	"smash_shiny"	: "700"	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece5)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-rock-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-rock-trophy\/\">Street Creator Rock Trophy<\/a>"]);
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
		'position': {"x":-10,"y":-44,"w":20,"h":44},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE9klEQVR42s3YWUxUVxgH8CsE26Rt\nTNMm1irQpo9NY\/vSpNZAbVO7xGotIchSFi0oDMrWCsoylBllnYwgIBRkAAWsFlBQHGQZNkEEh2EZ\nYdgGxQIOy6WCsgzNv\/ccHOry0od6Lyf55859++U79zv3m8swL2ANAOv0xmk5CfnNrLZFcUvTIBk0\nTuv1Sw\/cVg8OM7YmnCkDSyy6\/54UC44bxOxmDsQ+iRskuKUJ3DaO6wXGzVk\/iyPpW5qiwMcRbqv7\njWybbmmSVApao4FeCbDXOEnvaRYN+gFM8d80pAluLxrQuTCGDi7t86M02gUDBoxTy\/cLoyjsqkPn\n4pgf70AOp9fMj6Bt7k+oudx6dG8l3RySXBPKcmGzdyd4x+kWJuVqDtD6aBgtD+\/i5uxdNM\/eWYl2\n\/j5qJ3rgEh2A74I9dvGKU8+N2rY8HKaoGzNDaJrRo\/GBHkpDJ66Na3H9r0GoH96DKDUSzvEB\/Hfx\njdkhFYERFMFUT+lQOqpB0b1WXDNocaGnHkfPJWJPzCE4JwTw38HXOVj9gwHUTfejlu1DDdsLFYcs\nG9Hg8BkZ7KK8sTf5CLzSI9p4x9XPDm6undejZnoZVT3Zg6rJblRO3EZgTiw8ToYQGHwVUvhkSXfx\nDqyb6bM1wcjzVsHByLVAVwtnWSD2\/yamON8siZ8gB3M122dLKnZlrJ0+d0pDF65yzRFTkfsUULA3\nRwXbs4tUrJyDKce7cHlMw6UdYUUpcD3xy3L1FFKVcMBxrZgcJ2X3OyisYKgRJSNqOEQf\/Hd7haxg\n+Xin2LS9JSNtSNcqIWs4zx0ngSs4kUIi3ARzZUyjKBxuwSWuaoXcuZfUXgKpUgH3xGCK80wLh4v8\nZ+FmwJIRjT6nvxYZ3RVIbi+FXF2M4POJcDtxmB4xzrIAVtD5j1Quq7caKZ1lkDTkILHtIoLOxsNe\nKoJ7UjBcZEEqQYGKPhUydVU0xxvPUqjHySO0eoJ3MFmZPVWsCSi7VUiBTnH+Kw2yCoCVKhMwtvkc\nxMpMeCSFrI4OJiu6MU9FYNFN+RCrMuGZEf4UkMQrPUa4\/8SShmwVaQ6So+Wp8Dotfg4oyIhlWlH1\n2WxkTRYiqjIQWJQA0dljzwG\/9nMU7jkkOP8LcSvxzomiwH2poTR2kQew1W0Htrh+y\/+o9Wtjrm3w\n5aSngCRkSCCTDIljnB++8nfCVtcd\/L9NJJVZbk\/CfAuO06vnqTBaPXupD0UKBjxwRiL2PhMFL4UY\n+zJD4ZwUiEO\/x0CULaVTNNnaL3zssS8sBHFpecX8HzEX01R+aVH0YHaQHVyJ6\/Eg2Et8sN1rD6KT\ns5GWXQqRfzi++Xx78esM8+KPHADruBTj8RqfYFHRcB3yfAVC02RwDw\/EDncHxKfkQ5aSh5+8g\/CR\ntRUsLRgFP0NqXQfbpRuGKR3dd9DWNYhWTR+a1TpculrHVSwUrntFsHd0w5c222C9dg02WjCbeQGe\nL23Cs\/njyg0UlTXjkvImFPmXKc7ByQPbPvkU773yEn\/V+y9Aaewp\/OjujQ8tN+IdrnJWaxl+O\/hC\naZPYlPjIY6qw\/Z6I8PZEpI8X4kJCsH3rZ\/hgw3q6rVYWjLCffXe+bSbebWkOOytz7LYyw8frXzPB\n2E0WjFzwz73fbzIT\/\/AY9\/6ra2DJ4Swt1mADw1gzq2HZvGkm3\/KGGd59mXTpct4y\/\/+39R8XZIGS\nY7XUmgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294354016-6379.swf",
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

log.info("trophy_street_creator_rock_piece5.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
