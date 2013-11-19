//#include include/drink.js, include/takeable.js

var label = "Cosma-politan";
var version = "1354601589";
var name_single = "Cosma-politan";
var name_plural = "Cosma-politans";
var article = "a";
var description = "An urbane, sophistimicated cosma-politan.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 131;
var input_for = [];
var parent_classes = ["cosmapolitan", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "20",	// defined by drink (overridden by cosmapolitan)
	"drink_energy"	: "5",	// defined by drink (overridden by cosmapolitan)
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

verbs.drink = { // defined by cosmapolitan
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy. Grants 'Sophisticated Feeling'",
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
			pc.buffs_apply("sophisticated_feeling");
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
	out.push([2, "Drinking this will give you the Sophisticated Feeling buff (large mood boosts, a minute apart)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && !(pc.skills_has("cocktailcrafting_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/45\/\" glitch=\"skill|cocktailcrafting_2\">Cocktail Crafting II<\/a>."]);
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
		'position': {"x":-16,"y":-36,"w":31,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHEUlEQVR42u3We1BTVx4HcP7bnenM\n6k7bdWbbrp3adV184AMVF10UrYrKIgUpIErhjlgKlBbYqYou4GKRBJZCqEolStkKlcqbEB43T0JI\nIA+SELgJARIklHdQZKRrZ757b3br7OzUTjutkD88M985CcxNPvn97jnnurktwYi5\/NqymPw1kUTu\n6ptvZ68ShWW8IjqYsPymL\/HLlW5LPWKKXlt2pmKj6JJgC7Ilnshu24rM1m1I5Loj6MLzjv3xyz2W\nFJjO98zL13mDRf4R2U1\/QI5wLQrU25Cr8EICdzWC058X\/eAPa1XNLONpbWkNGqvIGa2ttb7bRv0n\nwy212uFaJlVqG+sOky4mVlaFcpD1hcLiTBkTuZn1uYxi3VZY8nOkux1s0h0Fys1OYGHXFufM\/C1L\n5IWo\/BV4M3X5yu9FNerunuL3fFXY1DfF4Zsc6fyBeYLff59ooO4Tdb0OOtNEtWGCuEOnQjdGVGjs\nRHnXXeKWkomVKJUPECWyfme4Eor4VNhLXCMNRFbtJ+l5ii3\/rZw7OIpNyJOud75nkt+5HfE3foew\njBd8vhPHVKvRMNogGF6IJ+\/+iyCtD4lmOj8fMItV2O2FvLYNyG\/3wI3eHfjn0C4nsqBjI64ZvZFc\n\/jrCs19I+05gg9aKVvMsS2j\/hvh\/YF8Bh2OPI2SjJ4OokYijlDXcnxoIPUSZQw5SVPB+qifIl9If\n3U1p\/rKTUvn\/iVIe2k7JD26lZAc2U+K9HpRwzzrq9sm1tlzJerBa1jgr9rn1z7g9uudxBTkqT6SU\nr0Z41hOA9VpbIo2c51OTXAZovVrMmfkgTjYfenh+LmgfZgN9MRPgg0n\/nfjq8A6M+G2D7YAnBt\/Y\nhP69G0DtWQujzxrod\/0eWu9VUO14Fcrtr0Du+Vu0bV6ByiMvPcbkSdahQO6BYqOXs5rOFis9Ec9d\niWMZy32eeA\/Wa0Y86rXWm01yo0Nb+gX62WyMJifg5wCKN76IzAZ3XKnyAUew4TGWa97pnFlt23CS\ntWLoB61gqVQToKvhOzqbJVC2SMG0n4mQL0F72R2oc3OgymGjk82CknUZHdlZkF++BFlWJto+ugjJ\npQyIM9Mh\/Pvf0MrOBr+80nl9i7gLpeqkx21mUtDlCY5+F05fedUR+OGP2Ad5mtGV2oYW7WhaCu7l\nZOD+l7dgr6qEgdcEfU09ur+shKasHKqSUnRevw5l0TUorl6B\/JNCdORkoSspBorEaMjjI9F1\/AD6\n0hKhSAgGq5huqWA9ckTrkCvZgI\/oTTsi6yXtvg9\/vexHb6zMttPMF+cpUxPQHR8KE\/scBnLOw5L5\nV5hSY9GXFAnTu6EwRh6B4fh+6EN90R2yG+pAbyj9t6Lj0CYojnqh53ws1NH+EAfuRHPRp9WpnwUG\nnOdtTjtXvTEtLONln598AtCbdGRb8XUYYkNAXYiHOTMF1Nl3YEyMgP5UILR0hTRv+UJ9zAfqoF1Q\n0UBVgJfzdc\/7J5z\/a3v3hKOpRZ741I4pZgGJqhu1+pQYmJPehuU8DU2OQh+N7qEr2EMjDWH7YHhr\nL\/THdtOzL4zRAdCE7oM0O1PLXP\/Uz1Km5XxZd56iuBiW+HAMpERjIOE4zMRRmGmk6YQfTBEHQdEz\nRYNVqUlorWvNY65b1EOfqYa4rnlo8P0oWOMiYI0JwRDxJoaiAjAU6Y\/BE4ehKOQMNWru+izp00mT\n3FBtuZAMe2wY7KdDYD8VDFtsOEQ8kXbRq\/bEtrfp0kbOJmKSruQkjZPWtVS7DO7bIW6RDelvlEBV\nemvI5XDfPgnV6eyKRt3IOTdXHMxiqNGP17SYZuJcFkhapoUuDRQPTre5PJA0T73n0kBB\/\/QHz4DP\ngM+A37uKpxNdGujS+2ATNdnscsDG4dlVwhGHB6\/bdqbBMCEVmCYrSNNoEq\/H7t08hueWBHVdpHu5\njAbVWaYUIvs9UjU+J+RprRPy\/rE549j9yd6JOaVuck4sGBg38vvHeYv6VF2lHoxjSw015QNTJH94\nlmwfmyON0\/OkYcyhHJv7Wjfz8JFm4uEjcmB2gVRPPCCZH1BhGpPkkKrkRQGWd1smCrr6229ZpsgG\n2yzZRgP1NNA6t0BOLTwiZxe+IUfnvyZNsw\/JLhpI2mfJysFpsqBd13mmUb7pqQM5HUYBR2nUFelG\nhNVWhxOgHH9AGmikmUYxlaPoWTP1gJSO3iPpe5TkagelXA1FnRGpX3\/qwDfyKwJZ7XotS6RRFCpN\nkrJeu5BvnRAwGPn4nBPLtJ1pba1lXHBDMygu7DCo36uVcRfnJvTz+8WalH\/4nyzlV14UaJTZrar2\nj0UaWaG0W8bt7JPepFNMhyPRytgijfIsTy49zLl90c0v6sXFXcp+x3\/lduT0jj3szy4EX71TElJU\nVRL6P\/H\/uPzyb6LT9rsFnHb\/KV\/zb0BHnw0+q2czAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cosmapolitan-1334193573.swf",
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

log.info("cosmapolitan.js LOADED");

// generated ok 2012-12-03 22:13:09 by martlume
