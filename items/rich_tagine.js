//#include include/food.js, include/takeable.js

var label = "Rich Tagine";
var version = "1354600820";
var name_single = "Rich Tagine";
var name_plural = "Rich Tagines";
var article = "a";
var description = "A steaming pot of zesty, slow-cooked tagine.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 12;
var base_cost = 332;
var input_for = [];
var parent_classes = ["rich_tagine", "food", "takeable"];
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
	out.push([2, "This can be made with an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a> or purchased from a <a href=\"\/items\/431\/\" glitch=\"item|npc_cooking_vendor\">Meal Vendor<\/a>."]);
	if (pc && !pc.skills_has("masterchef_1")) out.push([2, "You need to learn <a href=\"\/skills\/47\/\" glitch=\"skill|masterchef_1\">Master Chef I<\/a> to use an <a href=\"\/items\/268\/\" glitch=\"item|awesome_pot\">Awesome Pot<\/a>."]);
	if (pc && !(pc.skills_has("masterchef_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/48\/\" glitch=\"skill|masterchef_2\">Master Chef II<\/a>."]);
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
		'position': {"x":-18,"y":-20,"w":36,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHbUlEQVR42u2X+1OTZxbH\/Q\/6BxSV\nLghaW12dvXS32223uzNtrdXt1tWurSJoxanIrVVRq4AFyoaygUUwYmPCTQIJhBDut5RLwi0QSMI9\nEBIgECDcKTv7y3ef87hk2PGydmp\/2eXMnHmT93Lez\/M95znP827Zsmmbtmmbtmn\/m7aysrJ3bW3t\n9adxuvdHhVldXT3MPHJoaEg5PDwM8ubmZrS2tqKtrQ3t7e3Q6\/Xo6OhAZ2cnDAYDurq6YDQaYTKZ\nYDabMTExwd1qtSopFsX8QVAs0GEW2FBVVQWZTAaxWIyUlBSkpaVBJBIhPT2dn5NIJMjIyEBWVhZy\ncnL4vSWFIpQVpUOpVEKlUkGtVqO0tBQVFRWgeBqNhg+KwG02m8Futx\/+PqnzYw9pioqKkJSUhMTE\nRAiFQiQnJ0Oek45hfR4srdnQqO9CliOB0yzH6kgRhtrl0GQnoijhLIpTT0MlOg+jTglTcxEMWhXq\na0rcgDU1Nairq0N9fT0aGxvXFdbQu5+YxrGxMatUKkVcXBzi4+MhEAjcgLdT\/44pswLLQ\/mwNQkg\n+UbEFXRWRGO59z6cBgnar3thIXUrHGEesIZuxZwmFt91i7GmTcCiQQzXgAp6bdlDgFqtFi0tLbw0\nnE6n9SFQdkI4MjLCoWJiYh4JaGmTcaXmjbcxq30Lo4VeKI\/7PcxXfaCLeQ1VqR\/g5sc\/4W4KfwGO\ni9swEOSBmW8F+K79FpZ6srHUnwO7Uf1YQKpnqmWHwwEmmMStHJ0gqOjo6EcCFube4XCkkin255ir\n9kJbwg7YLnmiIdILxdG+UN7cj9SQlyEI3IqoEx744kNPFMT+Aa5OIRy6r6DPD8ZEwyeYqX0datlt\nVKrljwWkicaUJMhIUk9TWVmJyMjI\/wAUJUXh3q0bkKZFYW6gAOaSG6hP3oeSyD2QhL6InGBfNFz0\ngl7sDXm0B24cfx6dmQcwXrofNQleSPrQA1ePeqI48RBSzvlCGrYb1Zd3oTHcG+U39kJ2+WUo43+D\nEtFJVOYLOORGwIGBAQIEAc5vBKyQhmCw+BSsJScxrD6BcU0IeorDkRm+G4WRvpBc2AllsA\/uBO1C\n0lkfxJ3xwPmDHhCc8UW\/7CBsJccwUx8O052DKPn6AHIuvoSM4F1cbVv4NlguPA\/VBW80\/W0PFFeZ\nR++DKuFVaMpzHwto7evr44BJ8ZcxVuGPtSERnE2XMFoRCHttKOrFxxF\/ypsD3T7\/AJB+Exj55SPb\nURT9CpzNsZjrSoG9IgCjZadgv38AA\/feRNj723CFqTkfsR2W0G2Qh++AMsoH8og9KGSQ2WwQypj9\nKJOEQttYxwFZ6wGxbZmenv4rkVIfS0u4yAFtZX4YKvoIi71SPmup\/kZ1qUi\/9FvE+XlDELADV\/7s\n6YarjdgFx819mCgIQb8qCO1ZAVixFOAflVew0JCA5oJrSAz9HeKOeCAn0AvioJ0oDvVB9vkHmRCH\nvAjZFQYbtx+FgjfQUHoXS0tLcLlcyi1MOW+2QtAfFMrvo0d5mgOO1QZjuPIz\/sLlwVwOSS4K+xmH\nvP6XFzic4tpPMZnwClyfb4U9\/zTK419ltfomumUnsGAW8xm82ncf\/+w5iZjAX+LCIQ+kfboTihBf\nfMOykRzoy7OT9flLKPhyHzRSf0xaDWDCUZoftJu8vDz1+Pg4z7llwITGwpswKvyx1HEdro44GHOZ\nmn2ZcHWn85c33f0TyoXvolH0HubU57CUdxaL38bCJD8DU9Y7GK\/0x3TVL9AhPYBpvZAPjJ790n83\nV\/3aMU83GA2WjsqoX2OwTc4ZCK6\/v9\/q7oNsqfoVTfnR0VF+kW6i9dbSocCSMQmLumCY5QHQZx7H\nVE0AFlvCsNAcgukaP7eypFa75ANMVAfAXvYRq0M\/DCjeR6vkGJwtX6Hl3lGUJbzGASNYeRBY+rV3\nUZv\/NfpaS\/k7qbX09vbyCeJWb93y8\/PzaGGni5RuVqDc6cGVeTtGtHdhqbiE+cZzcNWdhKv+E8y3\nfIYFUzr3WX0iTLlHsTZ4CyPKP8JScAiDivcwVBaEprS3Yas6C6cuAuo0f6jE1zHa38Fjz87OcjG6\nu7t5q6Flj6mneWipq66ufo61m3ECpFWFipQA6Ui+vLzMnQMvzmDJ0YlVhxZzfXmYNClg0WVivEOC\naVMWnMZMTHVnYLIrAw6DFC5bGxZmrPzZxcVFzM3N8Z0N7XgIat0JksHNM+DnHrkes13H3oaGhnmC\nZOuyG3BhYYEHpdFSCczMzPAj\/V\/\/TemZmprC5OTkQ842H7x8\/p067tTaNsJR\/yM4du3Je0eCZFsh\nN+SjAAmEFKCJRS9nWzOeJuoGGyGe5LTdWoejfeRTwa0bW8j3shFZKRA1zGcNSHW2Ma3snOGp4TbW\nJAskZLNqhSAI7lkA9vT0QKfTcWeTklQTPrbmnsZYIG8WtMlisXCwHwJInwAERullA9ewybj9mX2X\nsFQcoelPMLQ9+76AVGcExuJoWJzDP9oHFI2avSCEPn4I7r8BUr0xMCVLZ8gzVWzTNm3TNu3\/xP4F\n5CTr0h7K5bIAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/rich_tagine-1334209152.swf",
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

log.info("rich_tagine.js LOADED");

// generated ok 2012-12-03 22:00:20 by martlume
