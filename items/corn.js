//#include include/food.js, include/takeable.js

var label = "Corn";
var version = "1354598432";
var name_single = "Corn";
var name_plural = "Corn";
var article = "a";
var description = "Many kernels of sweet corn, conveniently located on a sturdy cob.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 80;
var base_cost = 6;
var input_for = [1,5,83,84,140,224,338,342];
var parent_classes = ["corn", "crop_base", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1",	// defined by food
	"produced_by_class"	: "seed_corn"	// defined by crop_base (overridden by corn)
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

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.food_eat(pc, msg);
	}
};

// global block from crop_base
this.is_crop = 1;

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can grow this by planting <a href=\"\/items\/319\/\" glitch=\"item|seed_corn\">Corn Seeds<\/a> in a Crop Garden."]);
	out.push([2, "Using a <a href=\"\/items\/979\/\" glitch=\"item|still\">Still<\/a> and the <a href=\"\/skills\/123\/\" glitch=\"skill|distilling_1\">Distilling<\/a> skill, this can be turned into <a href=\"\/items\/180\/\" glitch=\"item|hooch\">Hooch<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000007\/\" glitch=\"item|npc_streetspirit_produce\">Produce Vendor<\/a>, a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"crop",
	"croppery_gardening_supplies"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-19,"w":39,"h":20},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFqklEQVR42s2Ye2hbZRjGvzaNW9Jm\nFWEgCBZhIDikKqgg0yAMVASL1s4NbQob1s2NFdkfdV4oMtRaLxFsy4bT4G6s7UrVMd2QJdrLsm6r\nmXOrK1Kz9bo2bc\/StNnW1r1+z5t82elpOtSTdj3w0lxOz\/md532e9\/taIRbgQdSZLRbyQZPtzgUN\nd00rz430FzrHel7JXRBQo72uvEivq2y0x0UTo3s94W5XMNxT6Av3uAILRjmoFR36mMYulQanRvfm\nMXiPq+iWAYW8whlpX+aMdD\/o1DqW544PbA1MRL6lqWhzULa54ZZADXlF3tBxR0O4fTlFOp00evER\nGr3wAA35l9DU2BFCi+G9eYUaOSpyQj7hHj5xuzby210MdGWgiK6FNvFrlPyexjtfL5vXUDBYo9Wt\noFDR\/tUU7Xs+8T7ceT\/h++GTd5DWsWL+4KQiZUMtdi3aW0CT2ntcka7HE2DXLj1F492PMSDUG\/SK\n4Px4rMWeN3xqafDyH8tiikm1rg4Wc0uV31B\/D+dTtGcFhf+8j0JNt9GgT3jmtp0\/iWw2v1QESgHI\nCGUsnDvUYiM8DBI9t6r5Hdrljnv5xlPhD4nGd3KN9z7LSl0fWUWkraHJ0HN8zkjbUgr9Ypn79oZa\n7B7t97tnqAP1AIfXV\/tXMhxqYuCZ+FjJYjgG9ImSOWlpqHlRAKphXCjFkFIjLMKgACMXH44FQ6qH\n5EpADddKOZx86oAKwvVIVQIQr2fznPIdwNDiOGBZymcbPIMbqJsiFBgjgFPD90rfk9xa\/GQwmVb2\nnWwpggFbSBX\/n3rfnHfkfd6aGXD7M6n6pIOe2Cx4R6F5RS4uqpSbrfQtTYRCDmPlOYaMefC\/q1fe\nZM0t3pMeeLFSUOHONNr2ox2AVFktihhOem6se2WirfipH8CzAQ63Zk8DTIn33H572bpqK+W\/KejC\nEUHauXtiqZSDV3kONTHy1gwV0V7AAZbnnITitsqhzAr6hPltVGWrI\/j0FkEnv7OQvq1YHfTB0C\/6\nxoLi8BwCoVvWfKbhdp9fUrL5S2sMLj6AMdfUbDMW1MIwhmIMJh9IzbqRwJ3TfAgvm4J797DI\/awp\nS\/PVCn5yXtxvMuuivc6E59Ba9lxshMQAZXo5wbH2uk3BFdeK7Kq2zID3aMa0p8cYUYDwoNFvClDv\nuRmplYPddDDeOZLhO3jCxr7B7DL6DoUUT2\/xQwzJcNIOvMZKtQzJ1Uy3dn2dKKtsy6Su5gw2NHYi\nWFP1G0wFBJixrkenbzyl2kottWIkFDSb2o31Iqf0Bwt5Aza+EaD0o0QPiM2maqnRb1ANLcZnKHQi\nJXu99bXC86nfRl3HFvHT6z1nBFRwSC1vOA1+Y9A4INZs075DMDbUCa3mV3vS1BrnHLZMGCtIr37b\nZKyUwOHYcEAUbaoXifYyiPQfZp4KBFRV81At\/ioEnU3pFGi0UM1hC5XXpdPWrwXX2u2ioaA6BTvl\nDbWiAf7zn1rEnpmxRZIw+FyvTt\/Pgs8\/cM5B2FSo2nHaQRVNdsJajsr\/QmimIaX\/ggpQpRBGR3Ey\n41tzVV2NaXToTCZVNNto3a40WrNDUEFVDGj1dsGgb9RbE5Cy8swpWCdID3izwjm7zzr4fPyeKkAq\noKKv0oLv+2w3AKtMbkoVIFRJBoV2nj5upf1nsuij5sUEv+rhiveLaTAFO0R2RbM9oD4z3eKNB4T2\nQWPMTx0tlkSd9WdwcKAYvjeCoV6rEfTSdvZaA8DUNbcdtWlxD5r\/i23tLuHecjCdVUxWRii9coAz\ntnDPX4tzNtVkpMZ\/ONCCV\/eJWUGSqfbyztkD8MkxW0n8O7dI1SFT6Fm39+Zga3ffAEPrksHVdsqh\nv8+ipRROD1koB6zLEyvArKoW+nHBYLI8L1SKnGTXKP3e6s6vFHP3X1G0GwASxqeK3yOd\/yKNbx9K\nDm7m+AfEpGlFzeoRMQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/corn-1334358559.swf",
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
	"crop",
	"croppery_gardening_supplies"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give"
};

log.info("corn.js LOADED");

// generated ok 2012-12-03 21:20:32 by martlume
