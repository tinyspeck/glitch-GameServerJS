//#include include/food.js, include/takeable.js

var label = "Secret Sauce";
var version = "1354587586";
var name_single = "Secret Sauce";
var name_plural = "Secret Sauces";
var article = "a";
var description = "An enigmatic jar full of mysteriously yummy secret sauce.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 20;
var base_cost = 47;
var input_for = [28,145];
var parent_classes = ["secret_sauce", "food", "takeable"];
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
	out.push([2, "This can be made with a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && !pc.skills_has("saucery_1")) out.push([2, "You need to learn <a href=\"\/skills\/39\/\" glitch=\"skill|saucery_1\">Saucery I<\/a> to use a <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a>."]);
	if (pc && pc.skills_has("saucery_1") && !pc.making_recipe_is_known("51")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/269\/\" glitch=\"item|saucepan\">Saucepan<\/a> a bit more."]);
	return out;
}

var tags = [
	"food",
	"sauce"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-10,"y":-32,"w":20,"h":32},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHtUlEQVR42r3Y6zvbaRoH8P4H\/oR5\nsS9297pmp7s7h3arrbO2lgZ1FudWMYOKobZT41AqpUqdgyBURykqDuMUUVPBBCGsqiCqRQiJRNS0\n2n73yW9mda+rpYyffa7rfpW8+Fz3\/dzP736eQ4f2uNzg94knfBie8I35b3i98RN+KDzf+Ka9+58P\ngwnfw4cOcnm99aslgX3FG1+5I\/wNDgTIfOEj9Hzt+7txrloPnBJb4cAyyNR4C5k6H3hskHjlCz2W\nlBHMl95wW\/eEi4YJp2U3OChcYP\/cCf8cZVAg8+5T+EfNcXzO+wqH8\/7+fwK+fAfU4\/QwPeqszB5W\nI2dh+bMVzLosYdRqCkP+SRy5d+xggY5Tjgb24+exX+CfrlngD9\/9kXEgyPqV2lD2IhuuKg+Q\/QiP\nTRKvfbYFmgotcKLJhCrvF7wjOJNhCNukozEHVuK1NZmRbKwYktEqCGYq0Cbnof1pOYoWM5H\/NBVZ\nE0lIl8YhuS8KMa0BSKz2QVq5D5KL3ZGV5wxejguKs5kHA9zYmP9EvSJUryxVYlU1iMfSSnQ0sVBf\neRH3y3xQVeqNyhIv3Cv2REWRB37gMnG30B3lBW64T37jV1yAgB+MursBKMrxMKIVB6gMdGvjcpWy\nFGurIqyvjWB8jA9hWyLkE+mYHEvFk5FkjEmSMNqfgOG+OAx2fw9x13foFUahuy0CXc0sCBtC0V73\nDcH7qjkcR\/rOwlevFMVaNR8adSPWdVLotMOYn+Vidipzj8BLFPDHqgAU3HaVcNg0IIE1o40XPSRz\ndXixPkyyN4TVlQ7MzeTsClhRykLmrWAK2NkYRsocgpbqIFSVeCM72baYBuBqrU57Fy903QQoIcAB\nLCvuvwfMuh0OSV\/ie0BBYySaqlm\/ZZAA6y+htTYYTWTv5t+yV+8b+PatUq0Hrut+IsgBUl4xFM8L\n0fAgHrKx9D2VWJ\/BjvowtNWGUEBetjMy2Jb7GyBev57C8lIp5p61EqQYOk0fAea\/l8HOtjiU86Iw\nKIr\/ILC+6hLucEPR0cBC+4NQCljOcUXG9TNG+wZOTuTjqbyJlLcXa5qeDwL7exIhaI7ZNoMCkjn+\nvTBS5nDSKJfQVEUjUF9i3VoHAYpIszz6IHBXJW4Kh7DxWwjqwqhOpheoFZB4BO1qFwUcEqeCXxO7\nJ+BDAuxsItnkh1PAslyX\/QPlm0OIWw1DjaYAEnLUzKtaKeBjaToG+lL2BORW++FyuQscOKfxF\/Zf\ncYVtuX\/g2GY\/3Fe9cU19HWmqDNxSpsN+0gkuj13AGvVB6JAngsVMBPW44mKXMy4IHODXbAfvegY8\nH1iDWWmFL4uP4vP8r\/BF7hEYc0xxMtuYPmDvq06hHhirTsBNVRqSl1LBnPJC3HQCCuVF4EwUIF6a\nCFeRO8w6TsGkxQJG9aY4XmOMY5UncPSO4RbwaJ4hTPLNYZRtgs9+A+77HNS8eU4Bo1VxYK+k4Pri\nDYyq\/g21Wo2B+UEIZzohmu7BzMwM0gZu7wg8ln8CZgWWMMkxw2c3\/gZuhgNoOKhXKeAV1fdIWGYj\nfSkTWq0WwbIw2EjtYDVwFu5iT\/RPDmBychLn2p23BRrmn4R54SmY5ZpTwNybdvQBWapIxC6TsiqL\nKODQ4jBuT2ZSwNO91mgeb4FMJoN\/Z+C2wOMFRrDknoF5niU+TTqMnBRb+oBfr4TiqjIWVxaiwZsv\ng0jRgyRZ8hZQLOungB4d3jsCT3OtYEm6+M\/XP6UXGLQSjCjlVUQuXKG6mPHYgSrxuUFnVIzfw\/T0\nNHiS0h334IlCY1gV2+B0vhX9wIDlr\/HtUhRY85FbwOgnsRielaLuCR8R4ssf7eKThSawLjkLqwJr\n+oCAJiZEEwb\/5SCELUUgZI716zk47gGFQkEB9SW2\/OnMR4FGXFPYlNjCutAG1mnHkJ1iK6QFGK+N\nx\/nlAAQvhiFoLmQrg9Pz0+iR9yBu+BpcdnEOGnPNwODZw4bLoB\/ou+yPQEUw\/J8HbQGDxoKRO85B\nsvTmrjJowjWHXek5MIrsYME+Qh8wW5sCb+V5XFAEwu\/ZxS2g04gbUh+Tr4s0dVdA0yIL2Jc5IoWM\n\/FmFznQBtQz9nUSjKkcL+cz969m7EkePx2JidgKtE21gPLLfEejEs8C1+95oaYtFd3sCast89U2S\nRtulSaO6A5WyDEpFCTXNCKcSUTIeiayRUGRIvkGaOBA3RReR3HUe7A4fJLZ4Ib6JiTvNAeCTCVo\/\nUXe3XSXTDRui9kQKmJtiG0MjsIwAS6Bc4KKmKm5PA2sbmf9+BUajr\/MGegRJ1K2OFqB+\/bIhU2tU\npQRYTICF2478mWmsbe8k+nlQD2youUGG1ljwctyRl2pHz4vr5uZijHa1aUegdCBpxzuJHtgjiMPD\nliTwfwgEJ91FeIiupX\/6WNdNSnRrP5OR\/+HWRJ2eGo7xkdRdT9S9wgS08yNQkuulzstwpve9Wo\/U\nrE5JXv6iwcYL+a73ICcrdOvi3lYXgfKCCxJuHvNgHtOBKQOlcjRtYU6onputwdLCjx8FigRREDRE\ngl\/BUleUBBdXcg7oAf1\/l0rVb\/DsqSh0erJTODFWJxyTlstHBksx2FcIcXcORJ3peNh6U97SwBY2\nVscK6yqvhFZWXv5dsP8A2vyq2\/Aa3DAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/secret_sauce-1334213541.swf",
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
	"sauce"
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

log.info("secret_sauce.js LOADED");

// generated ok 2012-12-03 18:19:46 by martlume
