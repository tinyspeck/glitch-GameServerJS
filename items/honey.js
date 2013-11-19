//#include include/food.js, include/takeable.js

var label = "Honey";
var version = "1354594146";
var name_single = "Honey";
var name_plural = "Honey";
var article = "a";
var description = "A brimful jar of raw golden honey.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 40;
var base_cost = 4;
var input_for = [24,43,45,50,56,70,72,86,224,227];
var parent_classes = ["honey", "food", "takeable"];
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
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000004\/\" glitch=\"item|npc_streetspirit_groceries\">Groceries Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	return out;
}

var tags = [
	"food"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-23,"w":19,"h":23},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMSklEQVR42q3YeVgbZ37AcdbASIpE\nnObYxIldJ+4+SXZrd5s8SZNu0\/Uf8aZpdx2vt8l243Sf5Gl327p\/5HjcZ9Nlk2yX+MYHxhgZg5C5\nQdyHCGAwNmA7xgfFHEISOkYXSCDgHc0haST9+r4DUmzIY+Rs9TyfZwYE73xn3pE0o5SUuzxAl\/Kn\nUJ3yXbx8HS\/\/HS9\/R0Qb1h6ItqzPTfhiS1m06\/nqrwP6Terb\/1YapzblZxIydkHKfSnf5EGiYk0P\n1vor1t2yqddNW4uegYn8TTByYiOMnvwzGM9\/GowF34Ph3GfhVt5mGDv9HBgKXwST9gcwWbYVbFWv\ngkP3OrgatsN0y09hrmMnLHS9BUzPL4C98A4IF38Bob43A+H+f2yL9G77L2he\/52k4yJjx3ZEu38Y\nMJzcAF17vgU9v6HgQqYS+j5bC5eyHoYr+9bB4KENcOPoJhjKeWbVwKmWneBt\/znMdr4D8z3vAbr4\nK2AHdgP\/5fsQur4HIkMfQ\/TSWxDtevFL7uZvHl81MGir3iHc\/AQi\/W\/CdNX3wXjqKRjKXgdX9z\/y\n\/xbI9f8LCJf+FUJDmRA2nISQ+SzEzv31NFSmPLxqoG+k+oPRrgNgOLcXPL17YO78uxC98BpE+36M\nbYfYwM4ErusfgPniRxDoeA3Yyx8Ce+Uj4L7cA3zfu8B3bweh5w0IXfgpRK79J0QMxyDibofI9EUQ\n3Z3AWFpgZkwH1sv5YOz6DPxfbL8Jnp6NqwZeqn5\/x0DV+3BFtwdIKFm\/XLUbblW\/BTMDeDrGD8F8\ny0uA9K8A27FVMnf9EMxOdsGsqV3aKMFc+RBHvg5Tnb+UxhluzwLD+SPS0nypAKZH62HO2AiuG2dh\nqPptPP7O3qTOQXqw6IMbLZ\/CYMN\/S4ORAVi6E0IzQxD2j0DU2QCxkU\/ISS4Rbh2CBa9JMj81DnOO\nQQlnroLI8Kcgjh4EkbHdgYwTP3pkW8baneDTv9Gf9BHsr3x\/nvwjGSC+93FXaz+A0K294G\/+Acw1\nvQQjbR\/f8XycrfWfIWrKg4XWH0qzQWaCjGnqOwGOG2XA2Lsh6O4F+mohWLt\/C4H+X89BS5JvO2Ap\nWOu7oZ6jb9a3LVi6b3CeK7y4YP7qKBqyIfblLyE6nAnIM5Q4ardbsPVAZOwAPv92QzQ4Lx05wTdm\n4dzXLQF7j8U7rBuz9p3udvQf9jBXP+6Anr\/5j6TjgpOll0W\/MTfELWSG0EwWQIwH\/IhERA\/jHjkc\nvP7bc9GerWZ+aH8Tc+1AJ3NtXyczuLcTDf4B+59FVz\/tdFyuzbKer8g0d5dkmjs0mcb2gkxDW17m\nWFNO5lj9kcyRmoOZ4\/X7sgKjheMho+b7q8dZizYGjVqbiCZzxRnjH4RbRWejkYgHlh5867ZJvvQB\nr1CmCkRqHwjzFUrEV2E1CiTosDoFCjZgzQoUapajUCuml6NwpxwJXX\/i4M6tH+G6iSdG5s+9oHfp\n31QPV2VljtZ8nsWNF1mD5uIdd38PNGobgxPF14SGbQOcOgNF7O3heFzUPxLhi1SIL1YiEhhte0YU\nah9HfCUOrF4W2EQibwvswLpkKHROhsLnsV4ZEi9ifRSKXLrPy5zfNODu2aMTTNr5uweatBDs3HWZ\ny1cyJDAmChAXcfaKicCqx1GsZ2skPHIwiF+lQXFsyTh2YzcfvvT3rBTYgrUtC+xZjIwHigM4ciCd\nmW1\/ugcfxblVAxduatTubEpgTqSFovwsxIm2dpEvxIEafMTOKlGk\/pEwV4bXpWnGR49Mcy1Wj49e\nIzmKXwWG2sk03xbYQzHh82mc2LsmKHR8K+QtTRVGjm7RJx1o2J+BiOC8HUJYeMEOnKEu4suRcf68\ndMGfny6IuoeifKkixJWmC1x5msBXYlWYLk0Q6rCGNCHUiH+uTw3N498v1KQKs+Vp3FRxGjddnCpY\nc9JZw\/50NJZFSUgg2f49BfLeceC9Y5L54QrRsE+FDPuUEqb8sbDlyP2Bif0KZM2mWOuRJUcXTeyT\nofHP5beRoTHMnJ0qjH9OIUvBCwHrmedZW25KzJydxn2jQNY5CHFz14sSgeZDKoYpXxd2n3qQG9+r\nRON7FSvdEfdV4MSBdHYsS4ac9e+wzvpdrOVYqmA8mB5IOhD9r0ZtPJSBCMbaC4z1vMR\/9aRoPKhC\nxoNK5Mh9IBCoXB\/2nH6ImzigxBtVrLRfvowM7\/Qic84GxtP8Hudpfpcz56xnDPsoNHos2cBhHHgE\nB2ILxjaIm7mcLRqzcWC2Ek2deZgLVG0Iz5Y8JkwcxoGHFSsdki+D45ZM5j3FuJve5giybjiIA0\/c\nQ6DpWAYi5kZrYG60WuLrzxJNR1XIdFSJZsufFPj2V0R\/2eOC8YgS74xipWz5Mnh6l1iLtgRcDT\/j\nCGvR5sDEYRyYm2zgiEZtzslAxOyQBuK8FzLFyRwFYz6uRIHun4dDfbsiTM3GkOmYEu+MHP89xZKl\n6Zhi0VH5MjJkXGIt+l7AVbedc9X9BAd+N2A8QqHxvCQDAzjQkpeBCN+1XPBdOyGZPv+RaDmpQpaT\nSoSaXw7hS\/UoW7spPJmrRJYTFOcuXhOznZIFJnMVSJIjX4ace4vo0ucDLt1rnEv3I44ufS5gPk4h\nw6lkA8c0ahv+FCG8V\/ZD3NS53aItX4Vs+UrkK32UE9pfDgdqnwzb8ijeckqOLKcUd8qTL0POvUV0\n+XOso\/IF1lH1EkuX\/yU7eRIHnr6HQPvpDERM9X8CU\/2\/k3g63hPtahWyq5USV9FaxlUgj8zVy2Ku\nIoq35SvQHXD0nWQ4fBFdtpm1F28M0KXPBuiyP2cteRQyJh04rlHThRmI8PR+hO9LPpS42\/9JpM+o\nEH1GmWBXU\/ysTh52FMlYe4EC3eG0fBkZsi2hy55h6eJ1jF37BA58mrWpcWBhkoHchEbtKM5AhLv7\n1+Du\/pVkquXvYi4tFXLgz+I4migiFCsVypeRIfsSunwTa9c8wNBnv83Q5U+x9jMUMhUlG2jSqJ0l\nGUjSuQucnW9LXE2vRj0V93FOfKEQ5yC0hGKlYvkyOCyuYgNLa\/Esnb2foSvWs7QGB2rvIdBVmoEI\nh\/4NcOi3L2r+W9FVokKuEmWCsyQeq1hJK19UmM7R6jVhx5lU3qGVIYIue4wlwWTn6LJH8TqFzEkH\nmvHlViWeXoxu3QZ066sSR+Nfie4KFXLjy6s4F1FGKFYqxXElMoY+nRKba6RiM7VUxFmKP4NLyRQ\/\nxOLn8PMUXn+QJUtzaZKBPA701OAXCGZvfhnszS9J6IYtoqdahTzVygQ35iqXM87iNAFvhHPj68KE\nSjl+TsY4ilKigS\/ksblmmeiqlCHCUZ4RcFXg9QoKOSsUDFlaypINtGjU07UZiLA3bAF7w2aJo\/47\n4rROhaZ1yoQpDE9deKYqLTZbkxaZwhetCdXyBE8FxU5VUoynWoYIV4U84KnC61UU3hH8e7y0VtxD\noLcev0lj9rqnIM5R94TorVMhb50yYbqOBK4RGb08hvRycRpfUSfo5MvI8A4twpHMVA1er6ESrJVb\n9PyEhl\/9nsSmUfua8MccZtN9G2y6RyR07YOir1GFfI3KBC\/RgENrKHa6Ts548Q1TQr1c4tSmhlzF\na0LeehmajquLoxLsNVv0zK0Cy10D8V3VEDdxrHOmNQMRNp0KxykljjqlONOiQjMtygQf0UwoVsL3\nJISnLE3A52DI1yRD3rjGOCrBrktuirVBS\/mov+Nh76yeTLEKT69S4mxQirNtKjTbpkyYIVoJxUr4\nhulOMrxDS5rjqISZi+8Nk3vyuwaSu3uyF8z1XTf9HfhtpkGFX71KibtJKfrbVcjfrkyYJfSEYhG+\nD\/bVU+zXS2dn2mRI0hpHLdI\/4uPHT3FhY\/G7q367EDJrfx+crPIEBt8Yc7Wooo56BTiqKHCVp0c9\nJalhj3aN6FSnwDflOpMS9ZxdE56qTA1669K4Wf3aAD+yN0JmL+mvgcmeBE0lvPfSB\/6+45thLO9+\n+GOivja08H7e37EDhIn8GJ7a4\/f8RbpoLt6K\/7GXTPlQ53G43vYZh67826C\/8xWfr+nZwHTdk6Yp\nzF26ftKlfcJCOLXrLM7ixxZpHrU4yv5igC5\/sZsue6HbVrGt1tu1e8Df96GFuf57XnrHwOMn9aXR\nal8okSMqTT0JxsirXdoAJhjP8pyp3MIZidJFhhKJYNTy8b+LB5GjRcYj46627f8DghyqFUcsnPwA\nAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/honey-1334211808.swf",
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
	"food"
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

log.info("honey.js LOADED");

// generated ok 2012-12-03 20:09:06 by martlume
