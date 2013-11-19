//#include include/food.js, include/takeable.js

var label = "Hearty Omelet";
var version = "1348008083";
var name_single = "Hearty Omelet";
var name_plural = "Hearty Omelets";
var article = "a";
var description = "An unusually nourishing hearty omelet.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 120;
var input_for = [];
var parent_classes = ["hearty_omelet", "food", "takeable"];
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

verbs.eat = { // defined by hearty_omelet
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.getTooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.parent_verb_food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_food_eat(pc, msg)){
			pc.buffs_apply('kukubee_winter_positive');
			return true;
		}

		return false;
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

function parent_verb_food_eat(pc, msg, suppress_activity){
	return this.food_eat(pc, msg);
};

function parent_verb_food_eat_effects(pc){
	return this.food_eat_effects(pc);
};

function getTooltip(pc){ // defined by hearty_omelet
	return this.food_eat_tooltip(pc) + ". Grants 'A Hearty Feeling'.";
}

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Eating this will give you the Hearty Feeling buff (immune from ill effects of cold)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && !pc.skills_has("cheffery_1")) out.push([2, "You need to learn <a href=\"\/skills\/36\/\" glitch=\"skill|cheffery_1\">Cheffery I<\/a> to use a <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a>."]);
	if (pc && pc.skills_has("cheffery_1") && !pc.making_recipe_is_known("4")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/251\/\" glitch=\"item|frying_pan\">Frying Pan<\/a> a bit more."]);
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
		'position': {"x":-21,"y":-24,"w":41,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI3klEQVR42u1YaVBUZxalKiJLszQ0\ni6CIgyK4jECImtEhGs3omBmLSiYZJ25IgliREBTGuI0QQQWjoilEjFvLAAUuSAgCKrIMEZS4EMOS\nhgZ776ZpsGWZkYjJme9+TFsm84uOmvzwVd3qxyuq+vS555x7v2dh8fx6fj2Zy3hNGNp1TVTZfc1Z\nfPeGk+OvChwBaivxNMrLRqG7TgRDrfN+bbG1t+oVC9\/OuRZ2vzjAzlpRpbLcHZ1VztBm2EN\/UICO\nBAHa17r1X02anVOUujBGf0EQ8IuAkxSNFktyPaDJEkK31xa6M0Jo8pyg+5xVtSeuZs5DduI8aEsd\noCuxm\/NMwUkz3UOlmx2hXG4JzSZr3NktREeaANpPBFBvtIZm1Qh0JDmg9MAk3LsyAZoS+8pnp7tb\nQu+mAi8jK+hrXB6V4ZwjB0kA1VEjoT9qx577oufKTOgvuYC0+UwAKi6717P2QlHijtYMV6h3MFCr\nLaFeOQKaHbZoO+wCk2n6W0PQkj0B9Vkv43RKSMFTB0dRov+CaWyXDWRhVlC+OxLyzQLIM5zQfHo0\nOr50BTGrrXblAPukofjqSAAqDy9G2gZ\/pkX7sKcGTpdkHabaYAPlCsbWeitIE4RQ7XNA6w5nXkp2\nrzrogMa8MZCWeOLudQ+oq\/6A6vRZOJX8GooPBOLbM754Kq5Wv2HxNhlC+d5IKP5uC3msLbSbraH6\nyIZrju51W6x4m1Ws1EkC9N2ega+OTkPZgbn4bMsruJj2OmeyOT9Q9sTD2FAkNKpznXnbVBXuMFwV\nof2CBxrPjcW3hWN4a0l3dy56oCmLtTrZBh0fiFCxzgMVhxbxuIlfHcwBlh8KgPHWlCfHoqHWpb71\n\/Gj+5RTKmio3rjECR3+Tg6mlmmIGPsUOimgbHjO6CBEa\/2LFQVWlLeJ1fv8fkZM0DsabLyY8mUlR\nIxITOBNrdE9smQC3ZrnzCUKgVCtGQM4+lcn2MH7hB3nuHFxf5YTG1d68qpeMwtklY9CWZgdj7Uv1\nT8KxMcQMASGA1EJVkQsUh4WQbbOH8n0rrjdNvA13sbzAjbNK\/\/ud5m1cSPFH3rZgrr\/EyCCUH5mB\n7h1e0G0V4N\/SxfjZGwrpjdrWslvEmVEss+SAFOEjH4FSFrryH0DgSYukS+MtbwyoIlGxyREtaX68\nkDeRV295ELRlE\/Cw633zJ4uxThigKHA1yhPsoIlkjgwbMeTUT+3QLnZ9ZAwq0h+FNj2jT\/pRA8pQ\nNORMR90efzRlBEN5PAhdGR54kOUDSeZEfH\/3A6A\/1jyT3I20cNQk2ciIJRpXHfts+Qh7vBTZIp51\nBIjMQkDJOASup2EK7knfRUniZJ59J+LnIjthOlD5EvSZozFoYOD6YhPMBqda9kKHqZVc9OxevtSS\n39Nz5f8+6Rndyz5x5Kah1kqKfPC9MRo1h5jeDi7g7iWQ9cfmo3yPH\/qaFgA9seabQ3\/ZqUB3WshZ\nkuW6coaohaQvyclRkO9kbl0+BI7PXRYl2riR3N1UZAzt9SU4HjOeM0fgqCha6nJ+A\/TGmd9aabFn\nArWK2kTZRuDIjZ15Djx0tdGWQ8xxFi1xZy1bCvY6Q18p4ia5L1+EB53RKEkYh+NbZiF1\/e9wdtdU\nZH\/sh9ydY9DbONf81nbVicIIDAGjVrWku0GVOLShmNpNbGm2sekgduBLAS0EFEHEcJ9kJtNWNG6L\n\/XE8zo+DO58+A4O356A1RwQdW7WYMYzAxuGfVySFY2LoS9SXWFykCDlT1D5qJQEk9ohF+h\/TmCPG\nyBTyy958neqXhaP+iA\/k+ZPYjwyBspppTbIA7afGQ33eAf3snrU3zCxw0mx37lRTnCg+ZGOKxYny\njAtn1DRzyQgEkFxLRW592LUGPS3LcTHRGwVJM1Cf+zqgj2RsrkPbKV\/IzzmwkRbMjBEXM2xwsg0C\nMemImLqz0Q6qI4y9siFQ1Doyhok10yJAQHVXRnMzkN6a8ufiyx3e2BsVyE1Brr3w2Sw0nWByKXRA\nZ\/U4Ym54S6p2rcckXaxbjWq1HdeVOtYKMrY63VnHTmIxbPGMs+VnDL62b7OFOn8IIBW1k2JEde2v\nKN0+nq9RBMpU5Nb8FE9+SCJwD7ujZMPSHZ1VVVud+rvEE6Hd6cKACTg4igoCS2aQL2X3EdboSvaB\nOpIxG2GJnrpA3s57reFoORuM4m3eEG99+dF+Z6pdUUHMQE7cFA80K43DihTa6RTl7pUkbmoVtdG0\nlpvEz3OPYuMoc14q2\/22+6BjDWNv83hUpU7B6VgX1KRNw76YGfjwb7\/9EXObVwWh9NNR5oGjqyHf\nS0zzksCZtEVFjmy7OA6amkD0S+fjP+3zucYGO8OZeQLQ\/pYNWkKtkBPpg\/RYX1Skz\/sRa7SpxEdM\nQvnJF3nWDSjfqRx2nBhqRQWPi56\/org6BI6ADRrWoKthGZrzglGX6s6rdt9YVPxjMiRv2OObxQLc\nCBNwbV06OBYHP\/o9r7jlATi0fTb6VGuMFCNmTYnuOuf9JlB0iOltCuIsUd3XhENSvBBlyRNRzBL\/\n8+QpQPM8XrLShZyhsjcdoU5hhgl\/gRmKHdIL7VF7wpVX28XJTJtR9WaPL9rpKOWpZd9pw3lmGRpW\ncFCkqfPxE1C6K5AP9t3RM\/F1yZ8B9Qr0NbzJwRFLJWxtV29ixslhk4VCfDkDupIdyqNEg90J\/ud+\n1tI5aIiQqf71Gppzp6E50xffZAbgUmoIjwfTtkGHGWpVwU4vtOV5ofG4EDeOOXOGCvZ4on23gIPq\n+OcoPhHu33irvlc8W6x\/T5TfvXGcpDt+glS31D7VLIAD6jBUJlqiSeyI5pNC3DzmgcJ9Qy90iDEC\n9nGkLwdD+nq8umr8cO\/rWTBemA59tMeDjtVulx4XP0WWIc6rjgCqX7X4k1kASbg\/9MRVUtGq80C7\nCrKqmbiZP41XY9FUDoTcR+wMqN5h7o3EDz2xMvTGimlE9R6ZeeDenqky1TyLiKf+2gL347zpS2nt\n+b\/qXR+KvvVzfhoR8hALDwL3q3gZ+fz6yfVfJX+hm2ebbZkAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/hearty_omelet-1334340831.swf",
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

log.info("hearty_omelet.js LOADED");

// generated ok 2012-09-18 15:41:23 by martlume
