//#include include/drink.js, include/takeable.js

var label = "Mega Healthy Veggie Juice";
var version = "1347677188";
var name_single = "Mega Healthy Veggie Juice";
var name_plural = "Mega Healthy Veggie Juices";
var article = "a";
var description = "A bracing tumbler of mega-healthy veggie juice.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 46;
var input_for = [];
var parent_classes = ["mega_healthy_veggie_juice", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "10",	// defined by drink (overridden by mega_healthy_veggie_juice)
	"drink_energy"	: "20",	// defined by drink (overridden by mega_healthy_veggie_juice)
	"drink_xp"	: "5"	// defined by drink (overridden by mega_healthy_veggie_juice)
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

verbs.drink = { // defined by drink
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.drink_get_tooltip(pc, verb, effects);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead){
			return {state: 'disabled', reason: "You are dead :("};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return this.drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.drink_drink(pc, msg, suppress_activity);
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> or purchased from <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && pc.skills_has("blending_1") && !pc.making_recipe_is_known("55")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a> a bit more."]);
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-35,"w":17,"h":35},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHYElEQVR42r2Y+1OTdxbG\/Q\/2T6ha\nlGsABUQSkGJFitWulnXZqq3tOlo669Y1s9Nh7Uw7m3Vnr93WC0IitxdIAoRruIWbBoIEkGII3VQF\ngSIQQCGShEve4Dx7vi+wk+44Hdr1JTPPvJPJD\/nkOd\/nnPPNli0\/4dX7bPmgeXrxVPfMwpmeGXd6\n79NV9c0tplvmPOlW0jfPPOnfkh64vek2J3+md27uZ1vEfLEv+Hp26XLT8Oyfq21T8hrbE3nDgyfy\nW48ccuOIQ24ec8i7xx3yvkm33PLELbeRBh2L8pH5Zfm4e1k+ufT80sgSnzbg9oSJAmhx8vc6p1yG\nCuuU\/KcATi2uyGc8zy9ZnZ5JUdy0urxguju7ZO2YdGuMY\/MZLaNzlzYCOLrg+ZPNxbf1O72LVrcX\nfc7ln790wAEXb\/9uwaukMg3ed\/PzTOzLLPOeRcszzyA9B62C+MEBJz\/Y7+TH2eeCnLzH8mxp2jLj\nGjBNOLoGFryfv3TAf7v4EfuCV7HkXTEv8CtmN7\/Sdv\/JvML61M3dm3ZyfdMOrmfCwZnHZ7nO72a5\n24\/synrrqKKqb1hR2TOkuDc6re0dntK2P54zigL4rctjEQD55ya3Z8XkWOL1DNBmdygsj2cVvWPT\nis5hu6J9aEJx6\/5jhcE2pvAFtAxPq3uH7WrzhKNbFMDBRa+RAS7yK0bXstc4s+DJ\/zGAnQ8nVXeH\n7IVdk\/NdogIueFdaCLDlsWvh+o8BNN0fV3U\/nCgwTzrEBXR5+EaXc844YWnTPepp4YbMzdyDTgNn\nM9Vz1rZ6zlatNNyrLynpbq7mzIYqzlylKTHV6DijbSzD\/HCCM4sVEkptV09FBdenKbA3\/fEz\/DPE\nH\/8KDcTVsEBc3xWIGxFByIoMgmpvCLKlIciVSVCdIoOeVHc8Fs2f\/makvUzXSiFpFwXwlrEDl\/12\noDY9HfrfX8Q\/gnfiC0kArjDA8EBk7A5EJgOMDkZ2TAhypBLkx0lQsC8U6tfCoH\/nDbScfxcmfSX6\n3fxp0QBL085Bc\/o9\/D2IAMnFr8jFawxydwAyyUXlnmByMRg5MRLkxUrAEWBRfChqT78Fw7lfoKur\nizX8+JcOeLf3LnRHotHySRoafncWXGI0ruwORl5CJDKjQnBtV8BqmaOC11wMFspctVbm7s8+gCHt\nGEwdHeIAsjFXmhiG1t+eQuv5k9AlhqLpRBx6LhxG44l9qEmRQn8sBvq3Y1CXKkNbWiJqjscgL24n\nuboNxb9KRM7B3egeHEHf3NIrLx2Q5qij\/KgMDe8eQvNHqSg\/GEoKQzmBlh2QQPd6CEr3h0CbEAR1\nfAAK4vyRJ9tBTr4KVYwfAR5ElsxfGH2ibDP9Ts\/txk8+RP2JRDSfS0FlUhgqCbCKACsTJSg\/EAId\nARbvD4bmtUAU7fMHF7uTzqIf8hMkKD6+H9mHY2BxekZEWrc8X966+jfoj0px+\/w7qCLA6jfCoSdV\nJxEkATLIUgLUCoDkIgHmSv1QmBSBwuQ9KDr7S7AfKo6D1Bo6airJuXC0fpiCmsMRAlztoV2Cqqnk\nFYKLwSheLzMB5hGg5rAUuQkhqPrr58zBL0UBZMnrphbBABtPJqH+mBQ1BNhwJBINDDaJAUpQ9gJA\n7dE4KPduhyFfhX4Xf0G0tZ8dcP2bkWj5IBn1KXGCg3XJ5OBamX0dLCZHGSAXHySUWBm9TbwW47v2\n16WlovZtGl+k751BCkrF2hlkgOwMFsYHQvNmFDgqr3LPVmEjF\/XiRIB5TX\/5FJXJEag9JltNMTlV\ntQZXRq2mxCfFBQRYnpqA3DiCPXEI7AeKCsjOT5uWE\/pf5aEI4VlBbabcpw+unr9AFFIfzKc+yB0I\nx83o7Si5eJY5WCkqILsy9li\/QRlB6da1BlcilHbdvQChB7IWk0flVdEkMeTfFDcg3xt5B0JJklW9\nvtqcmXMaCkQRufffKSKjRh0XiKw9mxAQ34lS\/fH7KCYwrTA52Hhjzq0Go4CUzyYIuZcd6w+VdCcy\nWUDcIgfENyh1l\/8ANbmmpvKpCUxNkIWsrBQGthzkrs9gembSM+eITLwR96KgtKrzUEglLSQ41kq0\ntOUwuHxyTIAj91QElrV3GzKovNoLZ8QPiO9EudPZCY7CkE9wHCspO3OsrHTmsglQJWVw23GDSns9\naiv0176AKGv+i15sl+t9NIo8GmW5+5jItbh1MCY\/ZJF7N2hyZBDc1citaCwtFmfN\/6GRl0OuZTOR\nczdlq2DKmHW47bhOpWVwX0W8gjbTJiXYd+Sp6Y6hojN3k8rKnMsiuMy9fsiIfnUVLmobrhDcVXr\/\ntf0pRP9\/8H9bjfajU8iS+pNYUnfgxjoc6ZoPIHNQ9Bn8IgcL33trw4Cb6iALSZ99FrmsSdMlaSOA\nrfV1mxcS1qhbK3RQxlJ7SQzfEGDJpYub2Kjp\/BmbGqGU+W+4xEUf\/3rzRh1rF+wKamw0QJN28gcB\nc1KT0agrFkKyKZuM7z\/+bDIw0B66iJvu3EE7bSu+6hkaAfucXZL+n4v6fwAItfrR0P3EWwAAAABJ\nRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/mega_healthy_veggie_juice-1334340908.swf",
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
	"drink"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("mega_healthy_veggie_juice.js LOADED");

// generated ok 2012-09-14 19:46:28 by martlume
