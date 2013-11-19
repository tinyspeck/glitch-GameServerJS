//#include include/drink.js, include/takeable.js

var label = "Cloudberry Daiquiri";
var version = "1354594477";
var name_single = "Cloudberry Daiquiri";
var name_plural = "Cloudberry Daiquiris";
var article = "a";
var description = "A nourishing cloudberry daiquiri. It goes down smooth.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 142;
var input_for = [];
var parent_classes = ["cloudberry_daiquiri", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "15",	// defined by drink (overridden by cloudberry_daiquiri)
	"drink_energy"	: "10",	// defined by drink (overridden by cloudberry_daiquiri)
	"drink_xp"	: "7"	// defined by drink (overridden by cloudberry_daiquiri)
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

verbs.drink = { // defined by cloudberry_daiquiri
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy, $xp iMG. Grants 'Floating on a Cloud'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? 0 : 1;
		}
		if (failed != true){
			pc.buffs_apply("floating_on_a_cloud");
		}


		return failed ? false : true;
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
	out.push([2, "Drinking this will give you the Floating on a Cloud buff (long-lasting, slow-acting mood boost)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
	if (pc && pc.skills_has("cocktailcrafting_1") && !pc.making_recipe_is_known("67")) out.push([2, "The recipe for this will become available after you use the <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a> a bit more."]);
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
		'position': {"x":-16,"y":-35,"w":32,"h":35},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH1klEQVR42u2XW1CTZxrHc7d3683e\n7Y5a61prHbWr1Fpd0eKBeGKt1a71bAAXT+CIoKAERQVBBESUohgUlVSsLpCDIV\/OBwJIQgKEHCAn\nCIoBwlFQuvPf90vHndaxnbVVy4XPzDPzXbzv9\/y+\/\/953jdhMF5T9KTNHuc7FhT8a\/a27Plom\/fo\nHLY9cgq78+Q8mWPvlJmvi4sBAuZPWxDtO\/Gp89HR2c5X3a9n\/im4LW4WutMXwpMQhN6sxXBFfyRz\nsN6b8IsbxQ96xvH1njC+wc2mk2dwl\/Lq3bqKereFV+9RG0TXfK3fHkN\/9iIM5IWg68Rc2FiTUZt\/\nRM3VOdK5upb0W4G0pd\/S2tK5VbbMErX9wCVB\/cclVfY1t3XWBc0RUzju2FnwJs1Fz9lguGOmY+j8\n5+hkf4LutM\/uvRSM3+BdKjQ\/DhfZB74UWv3JwtYhltDez+JZ+lnlZj\/JbtZI0Vrf6M01eHJpKZ5w\nmPCnzofv+FwQBeHY8yGa2KvVytwjuRWFeckFCjOrQGpm5VMNrDwRSaGRlSvUswolDcmW7e\/BsXsq\nHiXODoA59k+n1UPbwRlw7fsw66dgRCVBQ4da4hnZK217xqJcz1gi1zDrx4AajTKup3ib\/nvOCjy7\nuToAOEjU68tZ9AMgKUQXbI36ANad78O6YxKMR5lq7ekdJaU3bsQ9B7x7c39JNq+Wpd23WE16D83b\nJqJ560R0pnyGpwXLMXhhCbozF7F\/AsgzuCC29aZLvd+zXgSsrlbGddyJLxvmrveNkBc8uRCCodzP\nMXAumFi8GP6zC+FL\/gQPCWA76SfPgelwEyVc+6YFCtvCJ8O0fapPm7CujAasurbMRwOWHYnMbdw2\naehxZggGiIL0R9EO0Ao6dr0wKBUGF4f0mI9yDMbRgNpm1163ILPQfydCH7D0+ko8vbwcI1dCMUxy\n5Poq9GX8Hf60+eg+OS+gYGdSEB4m\/A1uAtgWOyPQU2YCaGURNXdOQuPX42HZPdNnOB+EvGNBlvTk\nsDJ+1HS3h6zrSvkU3sQ5AQWfEFfaXzbJ9FDw9C4Zz+ixWAW5Q90lEXhaGIpRAjRaRGy9ugIBBWlr\niYJ95xYG+u9\/gMfmBAC9REVaBSdR0EbgaMubNo2HPeKvsBDbm\/dMQVXScoguxqJCeHdIlhblF276\nM0yRUwz0BDv3TmP\/4vTKtdoTVXIeVAoxqhV80PZTujpoFCKo5SI8EN5Aw90smO6cQ0vhfjgu7kRr\n7nbYc7bBdm4LLGc3ozl9I5pS\/4nGkxtQmxcPFbcAUkE5pPwyCGVaVBZmQ5J3HCJ+BVt5fhbn8MaJ\nzvj1k8b93+eTVKcLayjL9nuKdsFzOwFmeSlqVJWokfMh1eggVWshUaogkStAyWSgJBKI6aQoVIrp\nFENUKYb09lVIiy9AwclAzfWzqMmOgSJ6CaRJW\/zSm\/lhdC1rySLZ0c3jDa98CPP1HRPkvDsGc244\n7JxoOMuy4CrLgONOClpKEmC\/GgPLpV1oytqCxvQNMKWuR\/2pL6A\/HobapNWoPrIC2thl0MST5+xD\nkCduhnBLEPhph2W0U8\/r9IvXhtm4IfiWPdV5L2XavZqCea92I4nlyizj5VjYLoajtfQkWm+nwEED\nFh2A7ZsomHO2BgDrT6+DPvkfqE1cCV1cKNQHlkB5IBSalEhI9jHBj1kPfjHnpf2F6q9mQrsxGJov\nJvyqK02gbwvWfpfvt57fClvRIdiLD8N2JRrNeZFozNxM1PsShpS1qEtag+qEFaiKXQ517CpoEjdC\nEhUCQepBZ4W+\/fXdsT83QNL75TJj3m6Yc1lourQbTTksGMlA1NNwbGJt4iro4kOhJbaqYldDErcO\nAm7xvR9b+saDVlPNveg3pX5F4DbDcGoD9DTcUdJr8aTvDhL1opeiMj\/DT69l\/B5BD1BlJSWrPbOT\n2Er6LmEVqg8TawmcMnEDBPz7MnoN4\/cOflU9R3MmEtVxTDKxy6E4vgN8TT2HMZZCINXKqmJCoDq0\nBsJK+diCe253ud75TGhsGxoTtr4srqkddXVtAzrGWA1ujbvO0DGkGrOA5Q3tze8AfyugqbO\/9R3g\nO8B3gD8T3xk8JuOjAcuYBSxUOlT1HYPaMQ04ps\/BMQfItXe+X+7pXSZ2de\/km9ribmgdTn17v7PW\n2xuncvp2i8xeFq\/FN\/utg9H\/LTgGN\/vf9sc6cVuPvObxICVubHfXOHw+a+dAt\/lhn7W1b4Qydg1S\nUlfXA561s7DY6PjgrcDd0lkXZEiNSo75kaTc7afkHX2UnoA0dw0qvAPD2uHR\/2h7hkcV7YMjVJN\/\niNJ2DlBCTy\/FqWuhzmktoW\/+N5\/elnJZbzMXWbuoey4\/JfX2UbVEQWvvMOUlUF0jo1Tn8FPKQRQ0\ndQ1RqkcDlIAAFuhb5Dlq0zdvHDDytvjrUpunPVtnVXFbuwLFlUTFOgJJK0aDWvzDAXtp9cTeXvIh\n3dRlvb32isGS8+Y9Zob\/JeKm8H6GylSXqTRqOEa3jOfupSjvD6A0lIaoJiPK3ifwpS2PJZcNrZpM\n+QPpzPizC97OlKz518fTYlJPhxdVlB8pU4kzpHr1pSqzsrDOrig2OeV0FtbaFJlyvTTmlqhi6amC\nNAaTNZ\/BZP7h7Y0yXYyAMpgRzMlRx5NmHDyTPuuFZKyMWMtYtWseg7npj7+l1H8BaGvr3DqBGxwA\nAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cloudberry_daiquiri-1334193494.swf",
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

log.info("cloudberry_daiquiri.js LOADED");

// generated ok 2012-12-03 20:14:37 by martlume
