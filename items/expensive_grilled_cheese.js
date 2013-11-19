//#include include/food.js, include/takeable.js

var label = "Expensive Grilled Cheese";
var version = "1354595003";
var name_single = "Expensive Grilled Cheese";
var name_plural = "Expensive Grilled Cheeses";
var article = "an";
var description = "Expensive cheese expensively grilled on expensive bread.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 220;
var input_for = [];
var parent_classes = ["expensive_grilled_cheese", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && !pc.skills_has("grilling_1")) out.push([2, "You need to learn <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> to use a <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a>."]);
	if (pc && pc.skills_has("grilling_1") && !pc.making_recipe_is_known("29")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/264\/\" glitch=\"item|mike_tyson_grill\">Famous Pugilist Grill<\/a> a bit more."]);
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
		'position': {"x":-20,"y":-23,"w":39,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIb0lEQVR42u1XaVBUVxp9P7AYHGsw\no8lYsSyxolNGBEQREFR2BAQhBEZc2ETBJYhAzDiJhhi3qAQwyjYgjcjaLA0IoRvoBmRtFlugbcBR\nGlxAiQYzkxhLTc7ce5nuAYJJZJz84lZ9Ve\/Be\/ee933nnO9rjptaU2tqTa1ftVo\/47SbD3MWTYe5\nkL4so+jupIVVor9pVp3fxhn8pkCuHOXmExCu0k+4iLbPpgu6ExcolZnG6E5fA3maNRR8d9THWaO\/\nZDNKIuYhZQdn8X8FVBzMWeTt5kIydkzj8fdqywr3z0HJwQWoPLkcteesIPh4GYuiCENUn1mLulhr\n3CrdggGRDxrOGSuTA7j5r7xUtExNn3C8trOLleUnDFAdY87A0OjKdYc8yw29xV4YFPvhacc+oHs\/\nflCE41HDTgaMhuSAMRqOGVZ9277J95UAkx7mfNtOaFX1Za7A15Vu7FAa318Jxv1KPzyRhbD7J1dD\ncF\/sj0eNQXgmD2V\/oyCHJNvU4PK3LkLZnqXAvXg8bH0XvWLr+f8Tp9qjZ1UNlTmqQY2O71rfw9PO\nUPX9P5t2Ybg+CM\/lYez+2+bdamDXM90Rb6INyX4CrjcQT7r80ZxpipQAbnJZlH7KGdzONVOqMkMP\npwc+bgvG82thalBf1QSog5aYxi3hVpJJPyhJqSk46SkrnNHXQmukKXDTH08UW9CYboPyU\/rgbeci\nJlXSliid4YEKX8gurEc9IXfZMWOITq6CONIcBYcM1AIYH5KoNbgh8MTlWHP0Fm1kJT27TAu3Cl2B\ngUhAuQd9le6Ep5vQlbV++KWthmauMHQGA5H3oR7yPtJD1vuLUXHKDJLoNbh81pIJgl6XE8BtPEeW\ntc4sV3QTG1GVtC\/bHfl2ryP73bn4vn0LHss3A0PJjHsPLvvgrtC76usKT+2Xzh4Vw+OW7YzYDy\/v\nwI9d70\/IP1pyWm7VtQoYDfnx1UhbPp3x7U6tM9qL7XEl34aJggJtSzVXloZPwmKoyd7JM2PK+5d0\nN35UTAxOFeMVyvxtjy6SCLj22NXoq3FBacI6XIqyBp+AFsVZooZkvFfkByo8YuiClwJ4NXKm8ucA\nqYL62vis3eS5oHCtNnJJSQfFG3BdZI\/qZDsocj1HvC\/BERUkhkhVfrgWzvbpK3IBP4gThK7itH6V\nMAaLrNjhzD5Iduj1eHDM64j3jQbXfsgEvCUaTKW0jO2FNhDH20J63hYtKbZoIxZTf9EN30h34VFd\nEFO8JGo18g8Soz9tQDMZ\/ctd4riW7HHrLiiLvHBb6I3OdBe0Z2xQW4eyZBO+qg4YA4wKocJtLnIc\nX8etEif016xHY6YVav7uwP6vIO9VJDigp9QbT9v34QEB1pRox9TemuKA+xJ\/9tGUVnSYeCG4Lzw4\n9wtBf0T2\/rfBP6BLvkyfKVhlHR0E6GC57xhwsv2GSF8xIgSata4yO0iSLNGRPaLkTr4nqlNc8KBh\nF6sIVTvdS3TSlHSanWOq8qwjGK3HNIdpK50QYEkIJ5RnOquzRf2PloH2U9rcaShyXIn67CGPs0Wp\nhTbSCN96Mm1Y1ppzrFGf4sSeU5ZsIdxzhrxoM74jrfBathtKjhgxcHTvCcXWuQ892RaoPzSBaKjv\nKeLmTWgjNGt9l7xQ9YUpJKeNUPGXOYxrBf46uCG0Z1xryXBipkuzRrMniLTEHfE23CH3KmATZU0V\ng1X+KPncBPknyAR0ah6ok4y1FjKZjO61VATXclzUpVTme6IxeAnKTbWQr68BntNsVs6OPGdcL9jI\nnqEAv4yxQdYRM5SftVO\/25XzDv5R4InhukD1ZKPu41feQ22yLQQnjSCJt8RAld9\/Sv07pbrU9OJq\npPbw6JFIWbwRDYmWasMVW89Ek90s1FtpQ+T4GlouWKKvdJMahDTBHmccZiNhIxlAdy5Ga6rLGK6O\njwdEaPScDkKZ2iRbdBV6jAFOpyW1qunkSxWkGpvoBqQFoSeOOL\/fQgiNR7J2aYUmrjj\/CcK9bzEe\n0me6CzxQeGYV+JErkXVsOeIDFyLGcy6y9KehYYsOZAdN0JXy82BHg6aUojiekUmoJ2khKPW4ygOc\nckjsrX7wdqEXpNv\/jDLT3yNBVxMFgTrI2raI9FMdZBhoovaoCSN6Q\/o7SD++HJ\/vXYzofUsQe2Ap\nUo8YQJRkjsKABRCZzUCr0xuoWT0DxSbTISRWVBdmiI5z69jYRc+6U7b1hYDl6fYjUw75TYB+IgIK\nrIFsQPsn33MOGmNXQl5qj1reOsazPoEXZGTzAZF3dMYR04iLxwwViR\/q42yoPjIOmyIuXB\/Re3WR\nTIyX9lzxp3q4aD4DaboaP4mspRrIXzkdlza8iYqdumy6pnvTM0YDPL+DKDrVj5P1f+mChzWeaEk0\nhYJ0kpsSYs6lXoQjHuoX6ORxX7h1zFh0es8SkzP79D5IizCW8T5azoAWnrZAQ4ozpGREa8txQGuO\nHaQX16I6yoh9NAUuCl2EXLuZEBDqCA2noXSZBvh6I+DjF2sge\/2bKA\/Txf16LyVJ31+HnyuJ1Bvd\n0V9PONgcjgFJICrIhnSWuyv0UZJw\/aUudDRgwfwLHxsHXYqyKiPPD48vGa0CtaCyGCOIzpkS4KRP\nx5khdd1s1Dm8wYAWG4yAlMab4F6jGzN\/TllhK1PwjTB49SDuNYSpN7wh8Bi+Xbo1ZLI\/FehHUTrc\nFfnIRgPtznXD9fxRMyMpK99DB+k2r7HB9haZwL9p3o575c5oi5kl4Co\/4HzbkwwxUP7f5j8o8omY\n1CD5gkX3Giz3thgQ+oQQqvAoXcZnuT7B4idCOb+dq+KoUkRH31LxjDcg3jz\/t\/qRrwJOEuJLk0Iy\nLqDgVQCpgKmKLXJC\/yC7HKVnwU2tqTW1ptYrX\/8GR0oWuEWj7kQAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/expensive_grilled_cheese-1334208416.swf",
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

log.info("expensive_grilled_cheese.js LOADED");

// generated ok 2012-12-03 20:23:23 by martlume
