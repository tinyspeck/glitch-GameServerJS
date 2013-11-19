//#include include/drink.js, include/takeable.js

var label = "Beer";
var version = "1354648404";
var name_single = "Beer";
var name_plural = "Beers";
var article = "a";
var description = "A shiny can of mmm... beer.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 10;
var input_for = [60,80,226];
var parent_classes = ["beer", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "3",	// defined by drink (overridden by beer)
	"drink_energy"	: "0",	// defined by drink
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

verbs.drink = { // defined by beer
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood. Grants 'Buzzed'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var success = false;
		if (this.parent_verb_drink_drink){ success = this.parent_verb_drink_drink(pc, msg); }
		if (success){
			pc.buffs_apply("buff_buzzed");
			pc.quests_inc_counter('beers_drank', msg.count);
		}

		return success;
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
	out.push([2, "Drinking this will make you Buzzed (mood goes up, energy goes down)."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000004\/\" glitch=\"item|npc_streetspirit_groceries\">Groceries Vendor<\/a>, <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a> or <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a>."]);
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
		'position': {"x":-9,"y":-32,"w":17,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAITklEQVR42r3YeVCTZx4HcGdqq6IV\ndbG6atXaWq2rW4oIiBxKURHKKYgoGI4kHIKAiAJZCSZCuBOQGA5DEggQriCHHOEIp5WrIIocHrBa\ndVe3UjtuZzu7s9998zpmdDp2tk7C89f752ee5\/v9ve\/7zJnzDgvNbrq3iu0tc8M3WzanmDBLorYw\nZVFfKKURG5XikE+UlwI+VrYWJ3DlZSVKTjRNyQz3UsYzwkQsFuvLOdpcGAik1CabTnVlW+N2hTOe\n1B\/G4xo3TJU5Ykxig9H6BEz2ytHXVoGS3AS0N1bgctFFXEiNQxrzBBj2ejPxB+ZWJVrP0dUK8L8D\nAcoHdUcw006DMOQzeJi8B4rFfFCtFyHIdikkDFN0yc5CkR+Jy1nBKIi1Bz\/oKwi89HDh8BKkOC4A\nx+4DeJstd9MK0DI4t0qYFYkRRTx+HozHTOdpPG2LwO1yH0zLvTFZfAQ3RQcxJPgGvby96OCYoy76\nzxD6rQTbbTWOWG\/Btp37Mc8sKkjjuOXHqikfHa2Ae1I39oVJsGpfFJaah2HPIRosnH0R7O+G43Q3\nBPgdBPWYI3buc8Y2Sxes2OGOBUaBeP8rKt7Tp0LH\/AwWfc1SPTtqFLji2OWpjbRqHE3tQXTxJCgZ\nvdhxvBybPHOx9mAm9A4kYKVtAj49xMU6l1Qs2s3AArMzmL8rEquceVhul4R5JmFYaBFNAufqU5Wa\nBsIwrB4OrFb4ZvYjVDQK21gFtlGLsNFLhDVuAnzkeAE7TsihH1iK5fZpWLiHCR0LBvRsE0ng0t2n\nsc0jBTqWDO0Cbf6iQEDOMHyzBmBAYF4B9ewz8DlFTAI\/duOrgUv2smERlA9LGg9WgQLtA\/fGNGIf\nowF0wRCc2O1vAPUceCRwo5dQDVxsxYRFsARmvumw9OdrB+iaMQaTiCY10DyiGvsZjfBM78XOULka\n+OH+ZGzyFmMrVYrF1mwSqGMeDXMCaOqTBnN6FhaYR2ke6CecRsClcbhyOtRAVUn2M5rgdF6JzzyF\nJHCHvwTLHdJJ4GqXDBK4wCwKu4JEMKakwtTvAlkcrQBPFk0htuwuXOLb1UBVSayjG2AVVY\/17tm4\nWDcJi5BCfHo0j0DnqYHG9DwYeibD2CcTq2xZcGaUaha4JaQFgcIJsCqnyTHjyG5TAzdRJLA8XYdT\nef1ILL+FCEEP\/mCXgs3EUS\/+Oo4EbvcRwPBYGoy8edgbKkZIRrvmS2J8shEnLo2QQNWYcWIr1WNm\nrXsOZN2PcLFhGqH8Hhj45mH9YQH+6JROAg18LmK7VxqB5MI\/tQHh\/G7NAtfT6tUttmO2kIP6VYu3\n+BbCnd0AxcgMpF1\/h29yGwLTW7DMhoNPPLLJkmw9woV9RD4MvLhIkg0iMrtH8xk8zP0OzkQhXpVk\nD3GsKqCqJLLO+2gdfQ75wI8I4X8LprgfejbxWEO8ZXStz8HznBysgmtwOC1FZtUIOEUD2isJhdeL\n3ZG16gxS0zvQMz7zEtg\/g4TyCVBT2uCfpiCGNAvrXDOQ33ofZ4SD4FUOkUBuxbBmgat9auGQcA1R\n0gl1Bg8mdMAqsgZ1fQ\/Rf+f5S2DfP5BdfwfeiS3EUbfAiJqD2IJByHqfIyK3H9zKYe0AX3+TOLDa\n4JHSQ+SwD1V9T8jdU954hsbhHyC\/9hgFrdNgSgZxjKNAIE8JafdTlFx7Dv\/0Tgjqbmof+CqDvOpx\ndI3\/BOXNGSgIXN3AE1QRwIqehyjtfIB0+U14JzXjrKgPxVefEePnKsSKCe0ClTefoZLIWfP1H3Dt\nzovfBBa1TyOrZgzHM9qRUT1GwG5A1KQl4AZ6HQQNd\/Hw6QuUEnkqvfq3twKp8ZXwZZfDxIsDr1gp\nRIo7SC4dwqWGMeQ3jiNO2AG2WMNzcPh7YOT7\/2Di8S9ouvGCBEo7H\/4KyMhtR3R2K4JTa5FHgD7Y\ndpQEihWTOJujgJAAmnjEaX4HXwFvPfo3Ru7\/gsGpn5Ekn0BK1eQbwP0hOeQRr7GOII9Y18gPKbJ+\nOIRkwoaeTO7i5zahswNUHbErpxM5jffUwLUHYiBpuYtlu47jUJQIu\/1SwRJ14Qvbk9hgFYi8+pfA\nM\/ym2QGWdD2CO6ddDXQ5LUFa2SD0D7ERmHwZrpFC\/MkhGuHcGtgHZ8CLIYJtEA+6+h6zA1Rl0Du9\n+1ctNqWkEDsohj+nkgRmXb4O+nkZvnSM1E6L3wbk199DQtmoGihtm4KgdhSHYwrxTWg2bIOzYOGd\nRJRjgijNOLLrbs0eUDn6I+zi2t4oSXhGI3b5cmEdcIEEMXJawa++QTxPIJfInwo\/a0BaVh9Ysltv\nAKXKKbAlPchvuk22uKD1HjlmVMCcK2O4WDNLwJqBpzA51Uh+pfzWm+R1YDYB5M8WMKFykgSqMvh7\ngKll35H\/xnP1adoFNhNfz3timrHzZD241RP\/F9CDWY6V+xh43zBI+0BVBjOv3IV+cA0208phEFSB\no4mt4JSO4HzxEFiFg4iV9ILCuYI9IWIss2ZivukpzDMOxYe7wrDJMW72BrXpyVqs8yzECtc8LHHg\nQ9eOh8U2KVi0l4OFVizoWJ4lftajSaAZjY84UY8WMvgAM28b1KoMMqXXQeN1wji4FEaBRTCkS2Dg\nJ4S+dw7sThUjhNdMfk2\/VpIqjQKnbg9yb9z\/6a3A39PiRFEDYmNjNXs\/iAG67qP2yKFvr7bh+l\/\/\n9U7AzIpenD8XgxiHlSItXaLTdf\/Z4c2UsYynxKk+EBcKUVzd9FZgjrwbPKEM7Bh\/BDltQOQBnaFU\n54WUObOxnl1xWfeg0ol5JdFEKY\/bPlN+Vh8lUVtRELGZvGDPDlgPAXXtVHHw+ioJffU7o\/4H3Gab\ncsL2ewIAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/beer-1334210270.swf",
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

log.info("beer.js LOADED");

// generated ok 2012-12-04 11:13:24 by martlume
