//#include include/food.js, include/takeable.js

var label = "Fruit Salad";
var version = "1342483398";
var name_single = "Fruit Salad";
var name_plural = "Fruit Salads";
var article = "a";
var description = "A nice fruit salad.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 29;
var input_for = [71];
var parent_classes = ["fruit_salad", "food", "takeable"];
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
		'position': {"x":-17,"y":-27,"w":34,"h":27},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIJ0lEQVR42u2YeVBUVxbGu+af\/GmI\nysSICLigSHApN0YZJpMZnYkmGTOVWDODmNIZXIjiAigqECEYSGkDgiI7DTRKG2giIIOISFAQYgJq\nbDbZVwFtegd0\/Obc20sQ3JIRqqbKW\/UVr+j37vu9c853zusWCF6tV+v\/dOFBqTMXrk5\/1nmydNfQ\nYDPBhPEDw\/UJjwavFGHoCpgeDZY04b7kiQDQHZ2uaw3CYUtB5bhAMjiCqjTC6QGLoe4VNenup46K\nJBRCD\/QLkb7xbQRMEySOPeBQSeKgugDyu2dNgA\/UedD0JUMnT3Yeef6j\/tAi9EegSuSKAEsBAqYK\n5o8d3GDJfCOUsk+Ke52n+bH2\/hkOGPHBu3KvyTPgSdo12QbbJlo1tZT6A4po9Fd\/BaH1awizeS10\nTKOnU+RxOLU8Wx89TT6HYxK+txnhH2zFobfmgIHumGQDD+s5ULdHAcoUJNmaQWRr1jSGtVciZ1A9\n7Smm2tP0pXK4qpwwhBGcH8EdMp\/JAXcSoNska8gKAgFVOr6xn4psewsU2JhNIPhQD4oye4htdM7m\niVbSj81sfrmJKuJ2eww3BtOAItMUvYBlK7Fvmj32EZg3aQ\/d3J1uvsPagQC\/BNRSfLtwJq4umo0g\nixlF4Y7r4DNlDvYaHmQLQX76hlXlzwYLsBCEsuIWfbzwMTijMZiS3NZhK93gM5bSyXqxY+95y+Dn\n9C56qhPwkEx1a6kDcuzn4bDtb5Cx4XP4UaT3E+DuyfoobrGYiw2vWzm\/ENgXUwTTD08TFHHnGZSx\n2QkdFUKTKZjqfD5B+lw7bJpoxdPJQFk0tv56Fg44\/gHFiQcBzXkKYDA6VizHV5a2iFm1CfGrNsPX\nALjLALjLbilcXrd+vsu30EmFwg2hmlZKTX8Y6QQ5MYYKPZFqKRVDcjF098VojtuJ7xfPQ93yRUi3\nc4ArQX5K2kbGSPVyxfXMIIL7N6C9iB7Xj9C50hHBBHhkwR\/hZ7OY1+kekpe1HeL+9VekHXCHfjJd\nf3otelrY+7MUsNoIdlqK1lIfsD4GxSkCTOBuhOoM1VQG6RxUVyPR6rKW35zp9lIntEuEBJZLyie4\nQqhTj\/DPGh2XYae5DbZTtJg5WO3lH9vOM8G6wbASqnwiJPWtjWFUvElrtuEghZ8Vutdse1SI3eVQ\nUKtQxOFOiS8BppGoUauzePoeNErQtfodDtG1+nf8f9AWkIqgFv8E5zd1FpL3uuHz3zrzcgh57x1D\nqaSa4NgQ0B+XjJ46WydZFbHi\/dJ2BQ6Yz8CBGfa4HHMY3XVfyx\/SDQeVWai+7MvTDJWEOxOaHB6p\noVtiDtnj+hd0nziI+iAvXFjuSI6dzSPlbnBq\/LYN6GmQQnY5FvVlkYYJJDEBdjTGGgHlowDdqBex\n0LPIBU6dCdmZEIxsLQxS1R6NNN91yPR1QeTaVYh4fzXC1v4JQvuFlOIlyJ67nOprDgKoVA5ZOpgm\ni7uhL8YSJNuLgQ0HZM2fjVA2oR7qisAm12OAh\/\/p+eF2KwcqZGtUrVk5Cs44ObR9IqS4fYRji9cg\niCC8hzkxdqYdIqzmIoSMwLIRvmQtfMz1449FkrmcOZ5FcEiVPSqCLMVMbGIxw3Cw8y3Kje7Hkytd\nAiOwb\/3fccFxNlQ3k0bBsYtYqtmmN1LDOUDwjCVUDjO5qXga35wFb8u3+WdMgW\/N5fXMHOtheIj9\ni52RcWQPAeaa2hXbn0WNRY+NUgaZVVZcydgE4jKZfHPIKez8hwublbgt3AgMFJrA2IXG0GvlUr5h\n27VonHBaz8fafnN9s2Xu9KPe5zvbkcOdpM8PGj43Tgx3eoDgtZ9wQFYuRsD\/6ApHGSU5Pw+nr8kg\nkN5sqbxQ3YGo9X9G\/IJJ+n43cPGJKTaOt1vnA3itehrG2g7D5PBesAIeb9rC39YR3lP0Lw17DdFj\nEfakc3zoIZp\/EEN7L80EyPZ9rJQGSlFcU4uihj6pICj3mkdMeQPym5UorWmArLsesg4ZuvproFBX\nmjSovWzaULznb\/yGnxkcutWQuk2LnLlb3Q19zvhC4G6YMF7zVyB43fs8vfLer9HTc56r624B2u7X\noLa3DTe7O5Bd1wvJHSVSatXzBbvjJG8E5ZYrEqrlSKpT4kqXFuXdpC4NV1mnGqUdKpOutqtwsaIa\n0qxCZJHY3xOHQiA+Gonk3G9xko6jSKdICSEn+TnG84pblbhk0MUWJXKalJDIurkSq9oRUdGMo2WN\nOFnVjaRaxU+vZv6ZxV8cL2vggOda1KjoGeAqJ5V261DSpcPlTi0KO7S40KZFXpsGOS0aZDWTmlT4\nhiRtVCKjQYmz9OQSg8T1Sr7ns8SAhuvYtSYk1PRDVEsGGbZ+FZhd+qMpigT1ooAZTWpIGtU4fUeF\n1HoVRHXPhzIqnu43EjD6x14WvaJRjXpv4rklx0vrFezC0w2qcQGMrOx8DC7ihw76v0Ke2qh78ldZ\nn7T8LdFVXfxiabN6zAGF5c0j4JQQ1Ss\/fObrll\/GpS0xt3pMkGMFGHXj7mi4EXX31BVe1rQx7nYf\nT3cmGeBlAzITMDMMT+sLwxnXIfGFWQk18htsQ0mjCpc6NC8FkMGFVrRwOFaDBFf51Jp7kRV7o\/v3\nvHCpZeS1av4nQAYX\/l0bj17UzR55cr3K+aV87ZQ0YEJSrTKUgaaTw3OoV\/5cwNjb93jkjn\/fLo+v\nkYeyPcfkO7KoTuFBsFIGdJbAngfIeh1LZeh3rdIY2T2PcfuVi0WApUhUr\/IXN6j8U+r1Eo2QsLTJ\nOfh6w\/j9\/PZqvVovef0XaVJnnb\/DnJsAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fruit_salad-1334208694.swf",
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

log.info("fruit_salad.js LOADED");

// generated ok 2012-07-16 17:03:18 by lizg
