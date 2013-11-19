//#include include/drink.js, include/takeable.js

var label = "Carrot Margarita";
var version = "1347677188";
var name_single = "Carrot Margarita";
var name_plural = "Carrot Margaritas";
var article = "a";
var description = "A thick, warm carrot margarita.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 90;
var input_for = [];
var parent_classes = ["carrot_margarita", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "10",	// defined by drink (overridden by carrot_margarita)
	"drink_energy"	: "8",	// defined by drink (overridden by carrot_margarita)
	"drink_xp"	: "5"	// defined by drink (overridden by carrot_margarita)
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

verbs.drink = { // defined by carrot_margarita
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy, $xp iMG. Grants 'Carrot Zing'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = false;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? false : true;
		}
		if (failed != true){
			pc.buffs_apply("carrot_zing");
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
	out.push([2, "Drinking this will give you the Carrot Zing buff (a triple zing of mood and energy)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a> or purchased from <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && !pc.making_recipe_is_known("66")) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> and complete the associated quest."]);
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
		'position': {"x":-15,"y":-38,"w":29,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHKUlEQVR42u2Xa0xb5x3G393SadKC\nmu5DtFWKVE3VPmTNmnBLUrWN2m2NumzpRS1pVjUtXaJJacOytLSkCc2UQCAJJNzBEANOMIlpjI1t\nID6xzcVgbGNj4+PrAdsMKLdwGTihQ8mz9zWtVFXah0AHqNorPTpHst7z\/\/n5X857CFmlhVISg5IY\n+f2SGP1sxg\/kk8fJJrJWFoOjYMH7xesxfuqHmPyIYDKVTK0hwPXp1D2Mnvg+3IcJgikkCrk24Mp\/\nvInBRTJ\/hNEPCDwUkD9MpoLvkWe+\/WC1ZAuuk5gH2lOyXjx1Zh0mUhddG\/2QyPsOPtgz\/usqVJs3\nVrT5HpOZ+16WWYSkmRu\/lFHAqXu1RLwgJulB2avp3eoL6Wp7OF1hG0hS9AwkNfQMJamcI4+pg3Mb\nI+WPx8\/n\/iTqmv99grEPyJFlATXYBrcou\/sLZSZfQY3RI60yuLKrWt3ZEirDLZF0Qb4hgrp1uHeF\n4AsRwZ1LBLOZBBNpBEP\/+LnXWndCoXB8nq3o\/Ty7gWq6OmF8+uT3MPR3AufRh+1LBlPbhjc12ENi\naZtbcbauPTlH3pGco+xKvqiyJOc32pJtirfy78oeDkO5EdRBLFQSzBcRRHII\/pVBMHWCpu84wW2q\nwVO\/8N7ssBx2azOzpzMeitbd+Cc\/HdfbXPk0hlxj++eD1x7bpLKHUK3vrchXWz78OuCdzzaGUb8B\nzDkGd0+6DgvSDfiilOBuPoW8sOjizCnqJK2xsWME4TOb2+fKH\/eGjpJo11oVuRVqfkRKY0SWBMgc\nZIDsAeyqsPaHm7tMtmDzm+MM6v41qloKV0Pdk6zDv0WLDrIUz52jcKepgycp4MeLkFPpBMM5m6NN\n4ZCksOeClk702SzWktLMNltbzup7dWno4p0wOL24abGgyepEh7EWHe1UJhU8mhS4VVTKFPAKKnkK\nXJ+loLO5DG1cbVSNZicajV1ovqmEvr4M1oYicFlJfhZjyXWosoX0Zl0FwnUvYrhXgiGfGoPGVAQV\nz4NXvQOX8h30yt+GqekcOjXZ6FBnw9iQhXZlFtrqz6Kr6hC6RPthKn0DlsxEWNM3w5r1LDw3TqKv\nMRd6WRFYjKUD2sNvacw8PAW\/h\/9GKvqtdQiZChCS7UK\/dDsFfRV9NU8jUBUPX0UcfKWx8IpfgFf6\nZ3ipi3z1G3BJDsB19SB6ivaip\/g1dOf+EZ7K92EtPASVyQUWY1ljhv1DbVsLvOV7IWjOINB0GkL5\nDgiXt0OoTKRKQODq8whcfwl+6V54L+8CX7gV7so9cJX+Fo7sLbBlPIHuU7+G5ZPNcJx\/EY6qY1B3\nucCmxLIHs9Y6GcMgmzst6NZcgKA8AqHuTQhV29EnSUTflQSqeAQkcQiIqYPl2+Ap2QpXwZPovfgb\nCrQF9swnYM9KgLtsP8z1+VE4Wnu53+or7cuxY2+7JYGzIRV+2cvov5pIU00BpfEQauIgVMfCd5kC\niraCL6KAedvAFzwDV\/lrsF1Lg76xhoHZ2fD\/n7zko27SmmFBDC0yBGsSEbyWgKAsHn21FPBKLPxf\nARY\/CXfJTriLnwPXVBsFW3a9PQioxsojpNyHkPav6L9OAaUUUPI1QOqgR7QLvZfisaxRsvQOD8Hf\ndAzhtjPoV7xC3aM1WEVTXEEByyhgIXWw7DmYKg+yZpCvOCALatLmUwePob\/hAAKVcdQ92iSir5qE\ndnLps9CpK7Biqf1m02gsPHxyCkcVnYMiCliyLTpm+KKdcOQ9DbXZtfRX2bLTTMdPp\/oc\/Ff2wFsW\nR+Fi4S7cBlcedTAvHlqdCuxcuGpHdzYuaKqnTPJP4SmKg7sgFjwdLa7crdBrLkc7lzXUqn5ffHnq\nsRuaxDDKs9F+IwvNrfq1AffNo5mWHxbYtcEePkLW2mJg5vBM\/arMvO8MID8RcTY6wmsX0D0Z8fwf\n8DsNuCabRO0a2qlxD70e\/QIcmNWxK+cdSm72jySsGpRI73i0wuT7SCVMmFqHZzjr6KxO0xOeZXAa\nx8A9\/+SdFvvYrEEXnOjRBEYrVvSwUGPyPfVpU1eVVBjjGgemuY7RWY6finCW\/jFXePKOMDI37xue\nm9f5pu9y5tE5Tjs4zUl6Qp3n23xPrQigxClcLzZ7bdK+CU4TnuaMI7Nc7+0IF56d5ybuLnC35xe4\nwbl5zk2hOyl8EwWs5gd1Z\/V244oAFts8lWKnECh1DOrkoducdmiagsxxTgrJXGPi6b15bI7TD81w\nyvAUd7Gdby3v9vauCOCv3sv8XYbOqj7f2mMu6PS1yISxW8wlA61F5iZLOatLltp6+gdKuwVDsZnv\n3JGWe2BlinD37ofIC3+J+1NO9cm0+lZR1i1r+6VWR1tZp7u12hk0SKjEdsFQ0MG3nlYbRa8X1OY9\nsv9vL0X3rejavX89+cOh7Rv2HX0l8ePco0w7ji+K3f9sX8oe9jvZ\/e6jyw31H3LNyOLYL1yEAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/carrot_margarita-1334340108.swf",
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

log.info("carrot_margarita.js LOADED");

// generated ok 2012-09-14 19:46:28 by martlume
