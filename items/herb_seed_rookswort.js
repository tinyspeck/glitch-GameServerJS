//#include include/takeable.js

var label = "Rookswort Seed";
var version = "1352410027";
var name_single = "Rookswort Seed";
var name_plural = "Rookswort Seeds";
var article = "a";
var description = "A Rookswort Seed, for growing a pretty bunch of <a href=\"\/items\/764\/\" glitch=\"item|rookswort\">Rooksworts<\/a> in your Herb Garden.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 25;
var input_for = [];
var parent_classes = ["herb_seed_rookswort", "seed_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"produces_class"	: "rookswort",	// defined by seed_base (overridden by herb_seed_rookswort)
	"produces_count"	: "1",	// defined by seed_base
	"time_grow1"	: "2.5",	// defined by seed_base (overridden by herb_seed_rookswort)
	"time_grow2"	: "2.5"	// defined by seed_base (overridden by herb_seed_rookswort)
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

// global block from seed_base
var is_seed = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be obtained by shucking <a href=\"\/items\/764\/\" glitch=\"item|rookswort\">Sprigs of Rookswort<\/a>."]);
	return out;
}

var tags = [
	"herb_seed",
	"herbalism_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-6,"y":-7,"w":17,"h":8},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEsUlEQVR42u2WW1NbZRiFuXIKtXaH\n7BxIAgmgtnZ0cNSZSjm2Ojo6dRhobUFQkhQQAjScaUtoKAGCHIptoZAATYAQ0gDGOl54lwu98qY\/\ngZ\/Qn7D83p18kKS0iODdfmfWhLBhvoe11vuRtDR55JFHHnnkkWe2O8u40KOpWLylcy47DBG\/Mzsa\nGDJGQyOmaNidG93qN0W3avTR7VpD9Nc6Q\/TZ99nRyFdZM5vlWuf211pnuEQsCxWrC44VatImOqfa\nxciDTg1mu7WY78uC97YeTxwGrNzNxpojB+t1OgS\/1GKjTIOn5RqEmTYvarHFRK\/0nr5Pz9dLNQiU\nqrFSrN7xF6l8gRZ9fXhccfpQUPcahTJXoxAZa87ERKuI6XYVfu5Q4xEHvKXDcr8e\/motVi6qsVai\nZgerEWQAoQRIDsbh6DnBBb5gX1sMCA4YsT5sxKozB77BbN\/igK7itWDDVqHA1SBEXY0KkMZ+zMRP\nNiWmGOAMAXZp8Lg3C56OLCxdUsFXrCInsMoA6WAOuREH5eJwG5eZq31GbI3n4elYLjZcJgTuGaUk\nKBFKhgxgRvhmuwVjEpzrhlDPwbhGGeB4ixKTbSLu29V4yGKea9bAWyJi6YIKT4qSIbmTFGOwNAZF\nr+uXWOQ3c\/DLRL4EF2ZwrLcx94Yk97A0YICHJUMGUFKU2HS7ODPeFI+\/p0aBu5ZkwJEmBdwMkGK+\nf5PF3KLCfLkIb6GIRQa4XBSD9KdASjHGFfpBj62RPGwzsE13Mtwag\/PH3Vtk7i306zDXo8VDltQM\nM8TdIqLzuuJ507cMsvWKAiQCHbLuQVIPecyPLouY\/1SEhwF6L8Rc5JDkpL9YvQu6yrq5Yc+WgEgU\naWg0FiuH49Eu3dEnuUcLSakxOInJfk2IMEAhyiFJXdUKDJr3Yp5qUGLuvBKPGeDCqyA5aLkKgd4c\nCYYrGAejzqXC0dJR97h7ZAaHI7VdVSCtrVIoaK0SXiRCxugVGGCgrs8VmD2fAFm4B0lx74KWsbi7\nDBIEiYA4FPVthW2sfzAZbiEOR0s41iyi\/WoyA0nqoa1SqEh9QLJVCDC\/nY4beenoO3cKkx8pkp2U\nOhkH\/U4rHU7Fp34lyhcHW2YLsRiPlTt3365hRih3z3Q0mDBsewcd1WpQurvb3FIplKU62VT+Fsy5\n6Ulqys9Az3unMPqhIDnr4Y526qTDaSuXU0SO0TJIrvXH4OhmcCSAzTo+wV+bdfj7mUWSd7gQxJR0\n5dDW2K4IEf5LDR+\/+RJgqtrfPYmhYoH1R8N6pJXcIXnjkt73x8AedGox2qzGnXplUpzB6c8QmjgL\nz+3T+H2hBH\/4qtBdq\/W98uKWImduWs5kHAgoucqcTnS+43om+mqV6E1QV00m9quR312KP8PXsO7O\nlyDJRbf9rE+6Yl439APmM+l21sEXBwFSV\/c7\/N+IR0oi5wYbTb5D\/X8mUOv7GU6z6cTOfnDWcxn\/\nGY7H+5vnG6mDtirBeaRPOBbTGxUM1Gc27blq\/eDkkQCl26JK2HlpIY46FtOJegYasRZk7BwB7Dm7\nSur\/9w+09NdTPHRvkRsHucXkO3bHDttbAkjVgZspjzzyyCOPPMc+\/wDV9Eo84GdB0wAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/seed_rookswort-1308763747.swf",
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
	"herb_seed",
	"herbalism_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("herb_seed_rookswort.js LOADED");

// generated ok 2012-11-08 13:27:07 by martlume
