//#include include/takeable.js

var label = "A Piece of Street Creator Earth Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Earth Trophy";
var name_plural = "Pieces of Street Creator Earth Trophy";
var article = "an";
var description = "One piece of a street-building trophy. Five different pieces of this - the Earth\" Trophy - put together will make one whole ornament. Heal the earth! (Trophy)!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_earth_piece2", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "200",	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece2)
	"smash_blue"	: "500",	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece2)
	"smash_shiny"	: "400"	// defined by trophy_piece (overridden by trophy_street_creator_earth_piece2)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-earth-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-earth-trophy\/\">Street Creator Earth Trophy<\/a>"]);
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
		'position': {"x":-20,"y":-20,"w":39,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFUElEQVR42u2XeUybdRjHWzlaaEsp\nvUuxtKUc5ShQYOMsFVZKOcoOdjKBsBkzF9nm3LJDq\/7hxkDAsTGW7NDhpmbZYRTnZFsNczgjjOFG\n0Okkk0RdomOaLMv++vq83dSmUQRdIjF9kk\/6e9u3bz99jt\/bslj+8Ic\/\/OEPf8zYsBYXOy3WwrG8\nggKX2WwWzjjBDZs2tTWuX4\/ahgYU2+3uGSfYe+6cs72zE1tffAE1dXXIzM62zChBAKaeM73Y2bUH\nq9euRXFJ6Qnfc3Ly853mYrMwLy\/P9J9IXh4ZwaG33sS6jRvhqKiE92vGZKMzNT0NmbOyYC9zYH51\ndeND\/fBbt24Jb4zfdH11fdw1MjrmGhz+0vXp4Ijr\/CfDrrPnB11HT55uO3LsGFp3dXgyWOIoQ+Oz\nzx3c393jau7ods3OzUORzYbyqipUzpsPm6N86OHJ3b2r+e7mj0M3xn\/AtevjuDr6DQaHv8DFgRH0\n9V\/G2b4BdHTtR3N7OzZs2Yya+nrYSh3Uj03Y1\/0e2nYfxsIly5FbYMGc0jLYy+eiwlkNS1bOiX8t\nd+\/ePdPE7Z8nvr\/5EyYTfGLVatSuWIHFNTWUpbmoa1iB+pWrPIIHDvfg5LtubG\/phLXACnEgC6og\nFuJCWDBwWEORPJ7pnza+5c6duxMTt3\/BZILv936MNevWo4pKV1pWDrvDAXNmJtLMGdSL1VjVuBUt\nO3ZR1hYgLIAFJclFB7MRG8qGPoyLR5XyieDgYOe05E67h2uvjH6Ly1fHMDD8NS5euoYLn42i7+II\n3Bc+x5m+IXz40SWcOjeAD4i+\/ivodQ\/g6MleHDryDl574zgOdB\/HwSM9OHzsLPa9fhxGQ6xHjsle\nNIeNKD4XmqgoxMfFIUwgmJiyXMOyhtqXt+3GZGzbvhtN2zuxo6kTzTuI5k60tOxBK9H2ShfaW7vw\natte7CQ62vdi6+aXIKXsqYPY0JEc82iIVDFiUKvViIiImPrQpHJZYzkiDoqUgt+p0EqwMEGFRV4s\nNt5niRdLvViW+Ae2aAk0JKYiMSOVNo5QK+QQ8PlQqVRQKpWaqbg9Eh\/Iyk4LYcOXdMJMZNCFM4ks\nYhaPjdkPyCZy+GzkEnlEvuA+BQLmOeo7GgxFIBtShuAAqMURHjEuh+PmBgZO6a4TREgsUsGp6cj9\nmRgjZSEKw+h9oSxEkpwsgA1J4COQC8Og1+mg1Wohl8undM9mE2EFOp2htaLk7XxR6EOTsxJ6Dgvi\nEA5UMiliY2JgTEiATCoFn8ebUlmZrIkYua7qyqvtlSWoTzLgcaMONfFaLInVYGFMFBboIjEvWokq\njRzOKCkq1BKUqSLgUIpgVwhhk4WhWMJHkZgHa0QoCkVcWMI5yBUGQykKhzY6GkmJiTAlJyOBJlal\nVDJDcfDv5EIZOUKewmX1+5bVd0jmGuR\/OSTeg7KIyCBhaVAAlDIZYihrjJBSoYDiASTHPLomK2kI\nEU5INUL+fIs2Er4UElYGyt5jRBFRrL\/PHMJGlHhhj4lEKRHFD4GItg5mOvmEjCTDw8PdtJWcYKSk\nUmmtSCQSTibHJQSEmFBoNZp+PTWsNzHUxAa93tMzcbGxno3UGB+PROqfJKMRyUlJSKFymVJSkGoy\nIS01FelpaTDQ+RKJxAOzv3E4nGn\/Ygl8UFrmG0jEYnGWr5zeW85g8MglkJzxNznqJV85c3o6Msxm\nz7ZBGRqj5ndP+9bllUFmMHhMieliqXSxKmIepb+axn4xsZR6Zzkd19G6QSmXr6T1k8RTdPw0Ha+h\n9TPEBlpvovduofXzRBN94Vr\/vzN\/+MMf\/vgfx690nh9qts8nJAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294353908-8150.swf",
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

log.info("trophy_street_creator_earth_piece2.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
