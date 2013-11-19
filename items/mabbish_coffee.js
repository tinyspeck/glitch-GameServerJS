//#include include/drink.js, include/takeable.js

var label = "Mabbish Coffee";
var version = "1347677188";
var name_single = "Mabbish Coffee";
var name_plural = "Mabbish Coffees";
var article = "a";
var description = "A Mabbish coffee has all the goodness of regular coffee, but gooder.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 54;
var input_for = [];
var parent_classes = ["mabbish_coffee", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "10",	// defined by drink (overridden by mabbish_coffee)
	"drink_energy"	: "5",	// defined by drink (overridden by mabbish_coffee)
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

verbs.drink = { // defined by mabbish_coffee
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy. Grants 'Caffeine Buzz'",
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
			pc.buffs_apply("caffeine_buzz");
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
	out.push([2, "Drinking this will give you the Caffeine Buzz buff (caffeine pops your mood every 10 seconds)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a> or purchased from <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
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
		'position': {"x":-12,"y":-40,"w":23,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHQElEQVR42s3YW2xbZx0A8LzxgAQv\niCck4I0XBBIIFR4YshhrtGYrA4llTCyIZV1Yx5ouHaVp2q6XxWnauE3armnSOM3Nzs23+DgXH8c+\nto\/v5xyf4+P73bFjO47jpE5Ithb++Fi0wpoQa3Hc\/qW\/bJ0j2T9\/\/+\/7+\/tOXd2XDLVj4+uztuDB\nMaPnwITJf3jKHGqatUXLKSW4TDQpKC6TTQiTbkLYwg9VTOrwHJn8Qd1+h5SI\/2gCd78p1NDNAoWV\n16cieJ8u0rwBjY83Z\/M2bGccBnTgwxmT19sooTM8hW+Tp\/IVeYuBnQaVO9umdMb7EHL12\/uCU1Ix\nwbCGae2cwnjdEpz3n0AbyzbvrTmCD3NmeJA1wF5KW6T9dPNjYGiXp4k94Oniew1KKu5FyMSr+wGk\nRnVsx2Pglc5GVDrQsZujqJD6GiSM\/fBwDYcNdgr8qkuwm1wq5uLamZWomR8ME610NNqIJYGndCaC\n3I\/dlxFUkrE0h0wnyOGHebIIBQq4\/GfeDqz0HKTtw\/B5Wgspyx3YCswC\/mkTrBivw05kBtYDUlAz\nEYPCES5y87jqQK4sluBqpzcaKZq8UTB5g+AM+iGRYGEtScLaih2ycQtk4iZIRw2wGtGB22cFo8sF\nGOMBndMNFuMsqDBset8WiTsaTT\/cCsKD+3HIRByQXg0BGwoAE\/CC08cC5XEC4XKAnbaCzWkGktCA\ni5yHFc8SsPgIYJKLoNIob8kc4e9zWXWgIxDRflbwwWebEdjbCMFOzgfbWRY2UwTk42ZYC+tg1VsC\nsQqIOWchTIjBZxWBxzYDxrkrsDz9MchwJijFHJRUT1Fye\/DuCE1\/tWpANRMVcMDdjWAZt5VmIJ+w\nQyZsgJRfAwlWBSFyFvwllBu\/B5T2DjixYaANY6CX80En7QTx1MyisxQ2m80hx6mg3BFuqd48pOJn\ny8C87wvApA+FGKMEv30KPKYxYPRDQC73A2McA1I3VAaqlbdBJBIhU1NT8xzSTDi9cpufktChb1YF\nqCJXXjBMCcAp64EV50KpnNpSWU3\/FYhJLpdK2weTfcfhUstL0N3+TkGmWtLLkXk1giCLfr+flRko\nRk5ED1QVaB4+BYSk9CrqBJ3wDCzcOgGynqMw+cmfQNj+O7h94jD0HmuAq0frob+jCQQf\/hY63vo5\nXL96PqlwBG8qrSyJarULHo\/HsWSh\/Aoy0lY74OlK4M2TjXC19bUyUCgWa8s9lYy2LBOsw+v1mswk\nbePQzwx4ve03cOXYryuAXIvR0iEqEAhonC63UUmEHDUDDp9+vQJ47fhr0P2XVyuAXGtRMzEqkUho\nOCRChKjaATsqgYLWw3D5\/YYysPvcMe2jz1pi4lQ2m9VEIhGNigo\/O2DPB69A19FDFUCurWjdSaZQ\nKBgCkaheRUYUNQQ2VgAvv1fK91+pAHJtxRxIUblczkR5AnolEa7dIrl35o0KYNefD0LXey9XAEu7\nojYiEKcymYwFp70OBRV7o2pAXMR\/MmCpQXe2HCwDBV2n3XNUvHneGTEzbq+6tEC0S4Svuo3aOtT2\nREB+y6\/g0pEXy8AxuQq0dobCbcSy1WpFDGaLurSCdVX7L36aEeS\/+yJcbP5lGTg6M7ulVquR5eVl\nBEVRBDEznqqV92nnIAe88DavDBwRi9clEgkikysW5Ji1VNqQuKrbLe7oiMkGwTR08qmAkwu6jVkU\nZ2Rmlilt\/XuqinsUmkUZGPpbnwqoIMNubmOgoGPf3bdt\/4LJIeWAtkn+EwF7zh+DmhzeuXmIyu6B\nfvAjMI1f+tLAweFBbV2tgjvhLc3cKaj7P4LlwVOPgaKLTV\/cbvFPwIQCke7LUfN\/PaOZs7iESkRG\nSQf5MH2zA0S9p2BU8FcQdrfBhHisMIPiUm7E655lcM9aMG8yjzCpIY0n222Pb3afFyKjI9YVVd3z\nEp9MGy+cEWFdxkjhQqwIF0atqQERkT773AARMlwY07k78chmc\/w+NHdO6gQjpuid5wZ4bgS9elaM\nHX0EvCyxfDxOrXU\/UxS3SMRU9ANFKNevTRZ0S4E1lz113x4rfm63pnYYV25bZ0puokvh9X4Zu\/pS\nTXFia+BQn8mnG\/WtauYTm6g5W0SxSI52Zbcthb1\/WNjsDp3c3kPd+R0UzxTRuci6rs\/IdNQMKHQE\n8Wu2oF4cXkc5oKkENCXyNs9a0ZL7+wPcl90mEyWg699AZXwTvWH2Gnst3saaACfokPu62U0JPRmN\nIl5AtaktlFjbRn2FXTS8tVdOd2EHtZWuLac2UWmsgA5RQWevyfWHmgBfvz397i27x8fXOvFBOqZV\nxPIoWoJwo2XNbpfTUHqv5nCRPHrD6seu6EjLj9t7f1KbGtfXf+V7x\/lHjowvyDsQ43i3hjTewt36\nu0QAG2eiOi7vEkHsBu7Sn5Vh994ckIm\/0XTyF7VfyvVvf6vu0JGffued9rcO\/E1w\/GftlVlX\/8cX\nuPt19b\/\/2v\/7Vf8Cnf7Qmjv6VzEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/mabbish_coffee-1334208875.swf",
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

log.info("mabbish_coffee.js LOADED");

// generated ok 2012-09-14 19:46:28 by martlume
