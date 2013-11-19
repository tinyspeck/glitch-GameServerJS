//#include include/food.js, include/takeable.js

var label = "Wicked Bolognese Sauce";
var version = "1354587351";
var name_single = "Wicked Bolognese Sauce";
var name_plural = "Wicked Bolognese Sauces";
var article = "a";
var description = "A small jar of wicked bolognese sauce, on spaghetti or on its own for a meaty treat.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 79;
var input_for = [30,346];
var parent_classes = ["wicked_bolognese_sauce", "food", "takeable"];
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
	if (pc && !(pc.skills_has("saucery_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/68\/\" glitch=\"skill|saucery_2\">Saucery II<\/a>."]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIQElEQVR42r3Y+VNTWRYHcH\/sKknC\nYpBFDAQCIQkkEIGIYXNlRxRsgsgmRlEJCCI7AVEERRbRZhQQQVRUhFYcFWk6GnYI4NLa3dXVw8\/z\nE3\/Cd+57dDLjpO3plse8qlOv6uWHfOqee947565b9xevyAVPXsyCKC52UaI1RoxBoos2hdgUUXPi\npuh5kTaSijlRXPSCWLpuLa+9i5LBuAUJjBFrjHkJYkwhpiOaCsNKRP1HEOjSTgOfsyZAalViyR\/\/\nHjD2TwD36IVQdvOxZitI\/kQXOSNCxJQnIiY9ET7miT06IcL1K\/fdo0LseumBnc\/dseOpO4Lu8hF4\n0wVbrzvD98ImSMsd4HXG\/v8DDB8nqFcENOKBHc\/cEfZYgNBHbgi+5wplD4F1uCDgGg9+TZshr3eC\nT80aAxN\/5XPCx\/2xWqD7ERmcU23i1gSp7RJ2qccCEDUvolNM7ald330e6H+Vhy2XneBbuwneFY5Q\nZNshMMV2cM1SvKByC3mx1wNPNTHoKAtF61ERLqc44\/zVYNS0KFF9WQlt3TaUVsqRm81DSfwmlIU7\noniXA8oDHFApscNJT9vja4L7mOzJexXPW36ikuOn\/ht43axFg5yLczI7VHo7oMLbHuVe9igjUSKx\nRzGJIrE9zpA4LbZFvtgGGhELR0Xs5Uz39cy+D39V8zkGlWCxP8wac81F+PHh3\/CqKgvtgZZo22qJ\nVoUlmgM4aPDjoG4LB+fkHFT7cFAhY6NEykahNxv5EjY0YhaOE2SmkL2UyF\/H3Lvwp3RR1\/Pwjfg+\nJwKLvVdguN2Ctp08E3D0oDcu+FmiTs7+Q2AuCQp4RMjCQTcLHSO4pQyvkIl4J4ykK\/CxtxHTNxvw\nsDQLVT6sT1awxpcNrewPgF4c5Hlb4qS3FUkzB+nuLCTwLbSrT+9hyeCT7VYw1J\/AD111eHezDoNp\nQejYxvnLKc4jOI3UBse9bHDYg4VEV4vlVQN\/SRctU8C582q876jBmxtncWe7HbqUljRQK2OhkoQR\n2Krk4tbuzSbgBcUGPCSVXxNgS3DWyPXh4oSUSwOT3CwQ7bLKgnl\/UAAKOHM2E2\/bKvEDQY58LUJ\/\nhJMJWE9WzQhs2mqDXFIMRV5s0woWeJHqFVog25v85muLkz4baWAyAcY4fxXCCHC6MhWLrcUwXCnG\n7SAr0wr+mRRT1UsBc2Rc5MntkONrzzxwsiwZ840FmL1c8Amwh6T76X4hrgdzTcC+aFeMJHujMYi8\nB6Uc0x48vWUj8v0doZE7IMPdglngRPEBzF3MwVRDAfqjXNAdbE0Dr4c54ttGLR63t+BR22X01BSi\nMdQJJTJSsSILOigglXYqvQUKJ+QFbKZXUEWAkS5f8RgBjhXuw0SNGk8qjqCSpI1awdsJvtANDUA\/\nOoCRoTY8fdSKoaEhtBcfo\/dgntiCrByLBlJfEQ0pkMJAHvIVPKjlG3BIYLH6zma4QoxDpBG435qA\nqepMjGszTSnWPbqDyeGL0LcL8ffzAvRVu6Kz1hf377ajOTXC\/DWj2IjKODGuq4R4uYcLDXm2amD\/\nedIDzolQ+OEQLs2fwI0hNVryvDF4KhHT09OYvh8E\/REhhvYL0B3Dx5W0zWipVOBezy00H1eh6est\n6IxzQ+c+W4zs98DrJDEdjANPfVBB++MxVHw4ivqpUszOzmJa\/wAzbSKMJXmagA3kHVifuwk3r9ei\nt7cXj\/JV+I5gqPh+rzNeqyR0UMBjniww8SWhgZr3iSj9eBgl7zNNwJlXtzBbZQ6sSXNEU43KHBjv\nAj35blNBAQ\/w1y8xBlS\/jcKZD6kofJf6P4HVKkfUFgWbAXXxfIylyKD\/bQUTXBloGIzA1MXtyH+v\nwqm3qk9SPFv\/+8AG7V5z4D5XjKX6kj0oYh6YshAKzbsE5LxJ+DeQKpJ7e6BPEZql+FrDCXPgfjeM\np\/uRPejFPDB5PgjZb+OQvRD3CXBy9Cb09QR4WIDbh1aq+FKBAPfudJsBXyV6YDzDH6+TGQQuZUqo\nYwskzW+D+k0UsuYjcWw83gScmJiAfrgdw\/dP4XGPBn0d+Xj4oBcPHjwwA+pTpJg4rKDvjAJzvhXh\ngEGBjIXdSJ\/bZQ7U6zE6OooXL17QX5KBgYHPAGWYyAqk7z3BNswCEwz+ODQfhpTZ0C8GUgUyqVbS\ndxrIX9\/EGHDfnBwqgxJJM8ovBo6nyTF1NJi+rwAZaPmXMkRxfaf4SBn2QuJsABKmAlYB9MPUsVA8\nS5aT7zOHKeDK0HQ\/xg7nqgRIfib9YuBARig6UrejfI8MaUwNTUbgwA4b3ArZgN7QDehIE2Pgkga9\n3WUY7mnDs65rpn6wr\/UibjfVovNcCd0snNvlSXc1ubIN0EbIcCEhCKXhMqSSVosRIHW9SXZb7gux\nJG08G98oOLgXxsXjWBd0Kq3plr8jxBadYXa4EWKHS\/5WZi0\/1bRme1qgOsoXtQnByA8SIIUA410Y\nOmH4OV2kHY6wQ28waVKDLE1A40zSs9MBd8M3o3UbF2fJfFxN4rzcCrfCnXHWz5ruB4ukZG45oMTZ\nGD9kMTm4G48+FpPdF+eqkjBRdsBsaLpEZpFCMrlR3XOJlEWGejbdUZ\/+7RkFrN26EVdUIXTbn+HB\nXk5xYfp8JpHP+VgSvfjPZ9\/gHwNNZlNdoz9ZNd+Vk4Vyktoc0uJTqTUCC8jQXkCGJrWIs8j44ZHx\nMhDkZKKg6Xksb3kglo\/h3MjPjp0VZO+VSln0HjxD0psvtVrO8bLsUvOt1uYA\/b+hL\/fyc5\/Guej6\nI3i67p0OS+2kSK4quWgKJOMniToFd6lGwdVp\/bi6Irl1bpH8y2D\/AsjKXdln9WVAAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/wicked_bolognese_sauce-1334214794.swf",
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

log.info("wicked_bolognese_sauce.js LOADED");

// generated ok 2012-12-03 18:15:51 by martlume
