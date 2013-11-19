//#include include/food.js, include/takeable.js

var label = "Urfu";
var version = "1354649383";
var name_single = "Urfu";
var name_plural = "Urfu";
var article = "an";
var description = "A moist beige flaccid matter, imbued with the ability to suck up other flavours.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 73;
var input_for = [26,340,343];
var parent_classes = ["urfu", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !(pc.skills_has("cheffery_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/37\/\" glitch=\"skill|cheffery_2\">Cheffery II<\/a>."]);
	return out;
}

var tags = [
	"newfood",
	"food",
	"foodbonus"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-26,"w":29,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGlUlEQVR42u2YS08bVxTHzSdgVbU7\nuuqyqFK75gtUyrJKF2XRfSN10UpVVUjTJKVpAiEQHgFMeNjGPGzAvGzDgGMgBMiAITYYG9vY4LfH\n+FGgXZzec8kdxi9w05YgtZb+wnNn5t7fPed\/zpiRyf7\/XNJnelpWdqUBe8ZkZQ8VssorDVmnlMnr\nVbLy7PHPv\/zoakS3XiGrqFPIhGzI+pZvNcepIHeSDlfBUazsbUfRRSD5FrWs9I+jcIXJPMipBurg\nJB2Sij\/+LXTjJBUsv3TAhyrZtTplCXQMvy\/Eo1swM9MLDDAd98LOpgG2LZP0O44dp0LClsV07VLg\nMH3h\/WW5fu5jqFeVgGL8E+hR1cAvD78So5eMueEw4oSjxAHYN00wrHoASnl11aVFMOCZB+dWA+j0\nJRTy6+oP4YfbX0Aq7hYhfS4eDKNPQNlx81SXDYjiVz+DCWMJVNe9A9\/fuk7HfM55CtbX+SNoFHeh\nv+unDED0JHrzOB2Sn6SDmn\/EowCxUmp4UqH4N3LwEva29LDDD8D8\/AdQ1\/SeCGhb01GgyaEHsGLq\nhFWzElYXtRAJ2F0YWUx9eH8zq6DCbx5d3CFWJJsMfYUL4EJ0wdgq6CbezQE065thYfoJsGjHAhZy\njwOC3nWI+m0iHH7HsYjfyh+nI3+tkH5PBSuxAoWQXZzQ71mlFep1LNLjVy+NMKi6Do2tn1IQKz8K\nU6OPQau6B4aRxyIgE0b\/KOnPAMT5EJK1J2xdxUSuFm9AkNyUkEoVvMBNyMUiMM3egg1eB9YNI4QO\nrODaWYAd61QOICq4twjpQ2\/GfInonstpWxAWZ\/sFbrJTXhBMCG6UR4MWPh62AVMi6qAVyqo04N0E\nrfLeWYUS2TbNkEqEcjYS3V8HDwHFyCGYFNS1bYbpcblL2V7tks6l6LhZ+HmfDFsr8u2ayWk10kmG\nSe+bHW+klfrCPEQjiulCCzA4jL7Hbpamj5xfEecaVd+nVY4FNao+27C65efSotpIPrm2jGKVrj9X\nEXO\/yige9vRgTxUcQw\/HQg5qiYmh+ox5cJNLXBuMDfx6Gr32av5C\/\/nd8zy2kN2N4byQONH4YB14\ntqfFsZB3iaZRCL4i1bp95q2YB+ZnVGJ0GODyM6UIqNfWiec1yvu1Fzdit5mzPu8qCNjfdfvUd6Sl\nZJ\/bnG+HZ4PfgWN9CNaXx2Cg+y69ljXuKe0jMb1S3zEd+FyQSqWEdDotJ38rj46Ozn4ZHexaywJ+\nlzx8YBXOSzNGgQF67YaMjew7Z2FeW0Uh2XUojNKCsZWOsfRmq6+TdIK1SXDvrkE04odkMgkElJcJ\nQrDyMB7jyAEOgN9rgWIB+ZlHYDE1n3udVDjG0pstHbHN+qoOfHs2BofSyF6HFAQhTOntVi5joRcT\nNTCn\/oZGBo+fGToKpjjbq9RXJLUoBpgvvdMT3WRtG4OicrvdYLFYKhCwVkIs6jAeBCHihu1VDYlU\nE7it43ThRa67aEAEwyrFYjg9rhGhBnpqYNE0AoEDr7hmPB6HjY0N0Ol0MDQ0xIn+s9vtrt3dXfD5\nfBAMBiEWi0E0GoXDw8Mc6F37CnBTvaTRzmZ4D72IQl8yQGxH6L3Bnjv0uL\/7DswZu8Bh5wlMTJw3\nEAjA8vIyjIyMwMDAAMjlcvx+9shzOByVOzs7wESOKSxqf3+fThCJROgOpcCpZIJC+5xLsD7XDouj\nt2F7RZmRYtF\/2lYCtiH1F11rZmaGgqG0Wi00NjaCSqXictoLuViQQjLAfJICZ9sjmRAgHjuAl0sG\n0I92gGlaDT6vWzyP9\/E8D+Pj4yIYiqSUwjU1NWVGTwJYJQX0er3nQkrl9\/shHA5DIpHI8TITXrew\nsJABJY1cS0sLNDQ0QGdnJ5e3QTudzlIpoMfjKRoQhVWH90m9jNA2mw30en1eMOY5jBzCodRqdeGf\nW6RY5G8CiNdKN8e0trZWEAxFvJYB19zczJ37mCO7L2OTu1yuouD29vbywqGWlpYKwikUChGMqbW1\n9eIfqySKXLGA6FOs+EKAhTz39OnTHDgSSa6on\/pk4gqcnHjyQkC8phBcIUDscVlRE3p7e+VjY2PF\nvzJBSLJ4FRFH0i5gNLEI0GusunHsPLh8PU4Kh2Dd3d1VBoOh9G\/\/60kgy0nqb5BFNfjUuQiMyWg0\n5rSRtrY2V0dHx7\/7Gg+LCZ8+WPVE\/HmADA4rtK+v7+28X3zdQ68R1bIiQ2GPIxHTdHV1Vciu2gd9\n3NPTc7VfG\/8nPn8CmNPAr4A3muMAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/urfu-1353118084.swf",
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
	"newfood",
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

log.info("urfu.js LOADED");

// generated ok 2012-12-04 11:29:43 by martlume
