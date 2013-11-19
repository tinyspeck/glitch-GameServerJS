//#include include/drink.js, include/takeable.js

var label = "Slow Gin Fizz";
var version = "1347677188";
var name_single = "Slow Gin Fizz";
var name_plural = "Slow Gin Fizzes";
var article = "a";
var description = "A low and lazy slow gin fizz.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 76;
var input_for = [];
var parent_classes = ["slow_gin_fizz", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "10",	// defined by drink (overridden by slow_gin_fizz)
	"drink_energy"	: "10",	// defined by drink (overridden by slow_gin_fizz)
	"drink_xp"	: "0"	// defined by drink
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

verbs.drink = { // defined by slow_gin_fizz
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy. Grants 'Slow Gin'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? 0 : 1;
		}
		if (failed != true){
			pc.buffs_apply("slow_gin");
		}

		return failed ? false : true;
	}
};

function parent_verb_drink_drink(pc, msg, suppress_activity){
	return this.drink_drink(pc, msg, suppress_activity);
};

function parent_verb_drink_drink_effects(pc){
	return this.drink_effects(pc);
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Drinking this will give you the Slow Gin buff (mood increases every 10 seconds)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a> or purchased from <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && pc.skills_has("cocktailcrafting_1") && !pc.making_recipe_is_known("65")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a> a bit more."]);
	return out;
}

var tags = [
	"drink",
	"alcohol"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-8,"y":-33,"w":14,"h":33},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIiUlEQVR42sXZzW\/b5h3A8f4H+xN2\n2SE7DTv2MGzQYWux7jZghx2W09AB3WADe2mxpVm7LHGdeo5rx4kdW07s6I22JVGi3mxL1OtPFEVS\nlEhK1IspURRFyqZsK5aTtGnhUWt3GDAUQwF6BL7Q6YE+eH4EJT167bVvcKG08p39zqffDQhHb6LN\n0+\/7Kv03A6XedV+pe91HT5Le2SXb173U4btIvnV9O9\/80WtXcYWY\/rdDZeWvIV6\/EZMufhZundsC\n4pnNyxs2pKzbnHTPtlno2Oy5ls2eEm2P4rztQaxsc2Sr0ztE894u2XzDUmCQ6Sip3qUt3nlli3Ve\n2P5X4GKYts0HCjY\/1coEmd73rAOWOqNwpbfzTYDmLt7AJusZ5YeWAcMVdZHpnv6+1DHQlKitxnj1\n8SSM70\/7S71pLy1Pbxfb057i4bS3KC35KOnxTqG1GDBfM7y8FSAbv7McKI8u3+ob51Mk15jajeJT\nqwj2wbzdc\/fW\/ceL07fuLc5seN91EdKPHYX2T1bwyrWVWOUakmReB7b2zv8FuLD+dOqPH85M\/fI3\nv536wU9\/PvWLt\/\/w1ga0r63g9Wv\/BjoOmNfxAvuOP1+zHngyfvXeaDT2a\/2Bv1Vv+assG6pRFLCZ\nFBDRMIhJPKqXKEQrAKJBEtFS+0g3sbfN5HJzSIb\/taXAdK3vPz9\/GR0\/G4MxOAa1I4MkCFArfj2w\nl9zzdyGVK8eTQUuBmRyDXQhs8eL0TPivwPBXQPo\/gf0oGlDxSEnwOHKWA89DSPSCylKjUrFqUERD\n5yvNTj5Tlet1qVXhJFWsVw2pzRyxTE4PIhH96YNg7\/FSSHLbc7xrC7ceGHSHx7kDMPZQUP1OkJwr\nUFudB\/be34C4\/R6Iczej+sosoj2YMbuDaMt3EGXlrv\/Q8ehqgKNtO3rBMdwQjxZU1A2Saw1q6wvA\nLt4GYvbPIC58GNXX5xBt7a6ZCTWxyqN\/+FuO1RzvfnoFQO8T9EW30zESIVCxbZCQDahtLAO7fBeI\njz8E8f5HUX1zCdEeLyLaxgKird9DFPsn\/vpkBxGXxUBgsVHAgY7JNBipGKjhXZB2tqC2tQLs2jwQ\nC7dBXJmL6s4VRHM8MFtGtK1lRN5c9jcc6yl+F7EYmC9joxCCjikAw7wPVfM+lPwuqLnswNoXgVia\nBXFtMap7NhDNvW62imjOVUR2PPLXnesJ3u+1Gshho5gPHTMEGJAA9SAEkjnm2vYmsJsPgXg4DwmX\nm4iF4xBGo4DtYsAiLkz2bPhFlz3BYwGLgQUeGyUC6JgtgkGkQcVjIIV9UNtxAru1Bju7gfoaCJqd\nFJWHaU75JEYqszsZJe3y4FXPZoIPhSwGkiYwFUXHHANGEUDNxEHaC0LNvw1xFC07iuKJ\/uzF59ti\nr7duIpfijDKHgjLnjPcKbleGj8WsBlaxUeYAHQssGOaY1RwOkjnmGrYL7li6469IZ26+oz8VZGVt\nAsRLylyQ7N9x4prPhTL8wYHFQKqGjSCFjkUODJYClciAhO9BLRqEzSh0PZXu87Vi88hMWc4IykKM\nUWa9hHLHmdQ8bozmEwmLgbSIjYoZdNwQwOBKoJJ5kNIJqO2FAAkmmvf22bPFREVfwnllPlZS7gZI\n5e+ejDLjxPWYN5Thk+krADIEeqHI7Pji+fjisy8uz07PzmqJPYAwRs7upAezKKHdxShlBi0ot5Cs\nMuvJqQuOA7kaDUb4LFgMZBrYiKXQi77KP\/\/081f\/Ao7OxzU8AWwsDLgPJRd30vJHPqJ3Zzvfm3Fn\nVU+UrLeqYkvE9\/d4IK0GNrERx6JjWYKhdEjLrcOaKCl9odnV9qN7VCYQzE++brF5JgzJQpTJEEGt\nXPK2KIoQ4nsRvkBZDGQPsVGVQ8eKDHStxXnLhx1PuaWuQVWdDeQ67z+JSmKZZ42emtcEDtG4CqJV\nWERI4pFaOonxFHMFwHoVPVaUAn6oKacvX70KttSevVhX5vcp5YYT7y6jRMfQBnlNrCNatYpoQhUR\nsplIiyz4ebpiMbAsTYDbotQrE+pwGFdPhsHOseHgZONhVjRmMMp435npspVGUO90fMPTUc84OqkL\neSLSomg\/zwrWA8\/qIsK3+2KmOxxhrcHJjqgaT2jJWEryxm2UNG7tEINC+TCmyT1E6yreQU+PC8Vi\npMVW\/HxZvAJgs4m0u3oVq\/af+YT+MwfdNlbN3ZvfZ40PtsG4hRC6rA6CmnqEaJrm1ftaVKBKkU5N\n3OX5htXANnbWaiEXR0YxVpEHblIyNqE+XE0Iw\/kwM5z1Fk\/zYn94fDoGTR+awGNE6+mIUCpHeq02\nwgtXBBwPjuCor9N5vnOIZKv6kwSnbyUqx2J\/dDl6\/tnl8fnLgjYcIdqRiTR3UihzkZ4km8DW1QEN\nVTV\/dnZAqjeAr3AUw5SoRrurNtu9Yls9xvrHZ6XTi5eXxul5XeSr2BUBJaxXqcR0qd06ezZ+Mfkk\n0QfGOV2g5DyAnE5lZCJPNmimwnV6+vEE2OmqxxQQtEAziQpXT1kKjACX5LNpbtBTjybAk7NnL\/p9\nfUTnC3I+m5PTcVwmMvkGTdJcMV80y3PFHHBkKs0RyRSXyRYYa89mWMWbjB3cruaArBbJuvn4aFYK\nhUM6C4f5dFpO7+\/LJqRB5wmumM2ZZbliKsuRiSSXiOytuHH2L5YCsVLncnKIibGdwl5RrB9QYiJH\nlpO5Ahunczl3MZt3F9M5dyGb\/ySbhBs4nn07BpX7KNmwo3S7MFlvKXCC8zdGK7725c1Ju+0vzF7d\n9IqjB77a6cbuJOGruEnDDaR2fsdVe3Fzkq+kOi3eQflXE2RAOF5BKqe3HKTa\/9ponXIyA5eLGXzs\nLSmPzLUblp\/071Mn35pAzXHNY6z8kZ+Rq35G0X1sX\/wy9cvoLmKO1R6g238KleSbk38Ivsn7\/RMD\nPWh1cM6LPQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/slow_gin_fizz-1334209221.swf",
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
	"drink",
	"alcohol"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("slow_gin_fizz.js LOADED");

// generated ok 2012-09-14 19:46:28 by martlume
