//#include include/food.js, include/takeable.js

var label = "Spinach Salad";
var version = "1342483399";
var name_single = "Spinach Salad";
var name_plural = "Spinach Salads";
var article = "a";
var description = "A suspiciously nutritious spinach salad.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 18;
var input_for = [];
var parent_classes = ["spinach_salad", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "1"	// defined by food
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !pc.skills_has("ezcooking_1")) out.push([2, "You need to learn <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use a <a href=\"\/items\/250\/\" glitch=\"item|knife_and_board\">Knife & Board<\/a>."]);
	if (pc && !(pc.skills_has("ezcooking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/66\/\" glitch=\"skill|ezcooking_2\">EZ Cooking II<\/a>."]);
	return out;
}

var tags = [
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-31,"w":60,"h":31},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHOElEQVR42u2WD1DT5xnH3yTyp1Sh\ndm3nejuZtbXUltaz2nb+GWBtVXRGpRSxldDTzjpndbN1UNSEiYCi8p+iNkQFNrGtAVQs8U+EnqDy\nJwIJoFYilBkEQ\/grimHfPe\/Loe7Wu7Wbtu6O5+453oQkv8\/7fb7P876MDcZgDMZg\/H+E3V4of2Bg\n\/Hcwt9fDmcJ7nVTps4HJe3pylD09uV4PDODMTRK993oZ+lNq6+7ar3+gyvnbbRLblLUDgDI0WBI1\nDxTgIjXTeIdJMeVjGbzCZCiuXo\/wwy8aqr6NQGX9RpyqXQ3VF8\/qAxOcvX4yDwbsZIbpKikmr5Hh\ny8L3UNeYBFWGj1lzNFi56rPxKDKFYvmuJ+EX7aCZHs3cfpxO7S1QtLZGu83ezhTyWIl5fiLD3O0S\nxOT6oPSiCta2DHR27lEatL+CvmAB1LpAyCMdMFcl+3Es0NGh1oZpRxoWpTH4f8rwwZfDsXiPDCs0\no+CjlGJN1i+QnjvGDN0vUZ7uhOTc+fAhj85RyeAbIlXeX99pmDL84BjbrGgJvDdIbTMipZgbKwGH\nXbpvGJbsexjyOCky04bAnvck8NUTiE54HNPWDRON5P+XYei5ng2bLf7+gBKIPDlvknagc6d+IiXV\nJPpZmyWkoiMU6Y54PVwKf\/Jl798YoBsNHBmBnFQnrNzihDeoqVpawilVtwG\/aUxR0OvYewLIvddw\nZZPB\/PcklJ6PQ4s1A6HZz4L7kJd3AJyvdyYwXP+rE\/qOjYX9uCes+Z6kpBQFFUG2GRvZqql\/ZrEv\nr2S27fvncWDtPQFsuBKjjydPTQqRYVKoFMEaZyjUQzE7RoJ58RLQbBQ5M0oqIDdFMOTEMHxFuSyE\n4ddrGF54n2Hskv589Q9DUVsXAcvJ8QaPIKYc8y576QdD8WNsWhhz941iypMV67BksxOmE9yCJJlo\nDq6eIt0Z7+6WYkX2Ywja6yAguTff3sHE2i+ZwZc28eqf7sB9EDsOluZUdJs\/Iiu4Y\/EfGV78kCl+\nMKD3Opmez7CF24cj6+uVsGQ\/gnOZDqIxgjOchO84GIflr7maHJr7kif\/XJz+NwKSr6eEMry2RoIo\n7UTsPjkfJblPA\/qxqNg\/HLO3se8\/it7YKNVwOLoMGAJiRpqXpzyFmuLgfuNrnQTQ8gOPis7lyR8+\nZ6sUgbu4mg6YFS2jssuwcBeDwbwegep+VbkVuLKL1I7ie7H0\/94vXIBCT3RpndFd4G+zmnZoLRaL\n8tatW16XLl369wFfXl7uHpw60nznMiDD71Ofwj8KJgInPdCXMxzrMxyEery0c2MZJnzIsHDHw6LE\n8tghouxcWQ5+vGIppm2QYJqSYUYUV5eRRfoV5RuoSZfBnv04KekJe\/7TuKnzQHm5AVarlYZ+p+02\n2NmzZ73OnDmjLSkpwd5j4aJU79Cs0yRKYMmUAl8\/D5zywvUMhtAURiOF4aVllL+T4M1wB6zW\/hy+\nmx3FhuYnUBNluMA\/fhh2HpwHDwXDK6sYJn9EJSa\/jVtB5f6kv\/NnRjpiD6lblMpQ\/KkLzqYHoKa2\nFjdv3kSd+TIE2OnTp80ER+TlOHfuHDhk3oFXCOg14BiV9QR55dRk9H3uhDraOTUPqPMwde0QLCbl\n3k5wRgl1ZHDCo7dVnx3hCmPdVizd4oHILUOhihuHOWHPifRTvozktHiEJAZhQcQo8fmA6GdwQJeO\n5uZmXKU0Gk366upqd1ZVVQUOR6AwGAyorKwEf6\/peDA6c0ejL3807EcIcD\/DNTWdGqv74caRcgFx\nD2FREmXKQ1irHYXmI55UqtG4mOWKdkMwygrn4SjNRBwciqZDU5Cdk4tTRUWihI2NjQKmpaUF165d\nQ3d3N\/21orq21kxgd25BAJStra24fPmyACwtLUVFRQVqKk\/j26yJAqpzL8M3and8vtsPgVFcgecg\nD3fFexpXLIxzxjvJLliS4YYTahf0niArHHMH8p6g446OvEOupP4E6NUjoExbhorzJf8CRj6DlZ5\/\n4cJFm8lU893HIEHSL2IVpaGrq0vszmg0ClCTyYSysjJR\/nLaQEFBIXS6o3iLji+uoFw1BEszH6Fr\nlSO2Jo6AbY8TNdMEoGA8cHyMGCO92T9DeupMrE1R4ExZsWiAjo4OtLW1CZ9VmUya7+zY\/wCrvXHj\nBpqamoS6JDvMZrNY19fXQ\/XZW5jxMQ3hEJp9mxwQFDkKaXt3oUjjJxS372Poy+rPtt0MR3L34erV\nq+AC9PT0oL6hYcBn\/\/2lliDdKBUctq+vT+ycA3NArnKxQYfM7CSos7bi8OE85Ot0wibFh7ah6cAk\nWHMmw5rni8bqfAHV29uLKxYLqowmm9FYo7int5m7YSnFA9vb2\/u7jpS521d8Izy5WjRwYbfbRWdW\n19SC++x7l\/MewGoobRyCzy2uEF\/fHe3tHTh\/4eKdsfFTBHHIB2AHwHgpjaZqXk7z\/+SzwRiMwRiM\n+xv\/BJjdrVg5qkruAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/spinach_salad-1334341655.swf",
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
	"food",
	"foodbonus"
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

log.info("spinach_salad.js LOADED");

// generated ok 2012-07-16 17:03:19 by lizg
