//#include include/drink.js, include/takeable.js

var label = "Creamy Martini";
var version = "1347677188";
var name_single = "Creamy Martini";
var name_plural = "Creamy Martinis";
var article = "a";
var description = "A shaken-and-stirred-and-shaken-again creamy martini.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 60;
var input_for = [];
var parent_classes = ["creamy_martini", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "25",	// defined by drink (overridden by creamy_martini)
	"drink_energy"	: "10",	// defined by drink (overridden by creamy_martini)
	"drink_xp"	: "5"	// defined by drink (overridden by creamy_martini)
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

verbs.drink = { // defined by creamy_martini
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy, $xp iMG",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_drink_drink(pc, msg)){
			pc.quests_inc_counter('drink_creamy_martini', msg.count);
			return true;
		}

		return false;
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

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a> or purchased from <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a>."]);
	if (pc && !pc.skills_has("cocktailcrafting_1")) out.push([2, "You need to learn <a href=\"\/skills\/44\/\" glitch=\"skill|cocktailcrafting_1\">Cocktail Crafting I<\/a> to use a <a href=\"\/items\/254\/\" glitch=\"item|cocktail_shaker\">Cocktail Shaker<\/a>."]);
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
		'position': {"x":-16,"y":-38,"w":33,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGU0lEQVR42u2XfUwbZRzH+c8YE\/3L\n+Kd\/mBjfksXo\/0vUqDPRLdPE+LZp6lvm4jZxoAwHxG0OhjDHFkYqwhyTOWCMrgVKj7u+3LXXa3vX\n9toCLfT9ndJSRoWJy9e7GQzObU6nDJP9kl+eXts8z+f5\/l6e58rK\/iXLkbs2pnTba8rWohWMlRuz\n5C6sWcAZQ2VIBkxqP2peU2ALXN36WfoLKm+sxGUFR7YjrnlPiJx\/e0ew79V1qwKhs+fvGeRj62VX\nC5Gt8mgX6K2L9vr+eeuXKDJ78QfAwfchAWKq\/3VMnHk5NHb6xQ6LprZGa7FsXZ5HnlOeu5Qkn1j2\ngP3IAzcMpeGT91+GcScOatzpbrUvv001ObdJNV5QxDwD3UvOZiw66vFXgP6eVzB2+iWIXc+D73y2\n1DVwuuJb0lNBOt2DuYQhlU\/qQ\/OZUaGUJe1zKS0XdbV97dJ+etd1wKIbh3yZfVp\/voGI\/awgwgsK\n7dSCYihQUqgDcwrG56u4JB7FPwF0dj4F3ekd3RaX5ZtkhHL+qDtf0zbIlJ8weFp6rYGD4Sh3TIKl\nxtn6L64JqBbCJUMCCjLxi+JKwKLYyS85mySwBlx0HPpHgHr1gZPpKDVuZU8NKNUjO5tUVsWhfrOi\nVeuoldYWJMDGuLeDco1WP3V1QD5MDYpJejS6uH0ZMOIbai+42vlLYgt+A6xHyboPc+ZaFM17MUtX\n3zDgeP9bl1LezhmLpsohw8l+bNhRMWAPRjRCpGZhmlyfj6gsEuD+axaE\/EdZSY2YoGPus6U5Zxsu\n8o1Ych2+ArAGBVMVcvrdyIzulHsgEkMfIqp+F2HVFkyefU0uEvi6X4R48jm4TjwDT9cL8PW+CseZ\nLTCq6kp91kn+vBAuyPn+e9FI+XhNwGU7z8fXaXl\/SBRpmN0e8G4ONM\/B5TTAz59DmOtElG1F2NyC\noKkZAUMj\/NRBjBP74B2phVO7DxZSCTNxHKRxADpaC4LRYYgPgLKxMBDfwaSpx7CZoZYrehmwmBhk\nXVT1jhtqLzpnoCPkI7Ho78HPcQNyYStSUwwSYyMIiARElwFugYDVYYDBbpWchd5mgclKwcb8CI7u\nhtXYBVF3AAF5U0ZpE2e3wKqqxjDL\/Qnip2nyk7S\/2+iiqh674ZYjy8+ww4U4fQBZoR058QfMuE8i\nJ33O2lowzR1GhvkKKUMNEvo9iI9WIqr7FMHBjzCl\/gCBAQVi9EGER\/fA1\/8eTGRXSI7QlesUp4kH\n5fCGXcd3\/+1mLfdFysYJU8ZGJCxNSPNKJLkWJJgGxAx10uKfITzyCULanQgNf4zg0HYJcBumNNsQ\nIauk73fBra2DjrV0rAzpSji5xeSCPVXX7YN\/ZVqHr9nJ9iLF1CNtO4Y024ykpGxcUi9Ofo6YpF6M\n2I2YrvyyinFyD4IjFWBNZ34vhCutlCbfn8+Qqpio3HxTcMsmH1VGuzkUZY8iyx1Bhm1Cit6PlLFW\n8r1IGqqRlEKd1FfDa2oFYXdQcgSuNZ+sXiaovO\/fP6MFb02QO4Ec14RpSwOmzQck348s8yWydB0c\nrKogn0y39DYjAwQcPYWCrRl529fIc4eQtzaAsTPC1Qrhlpic9BmhU5gTWjDHH4HXoRGuVgi3XEna\nyYMRHIXr5dsttVOW0NioL91Ttlbte0uI5aIXWtcsoEqMj90GvFlAW2yu\/TbgbcDbgP9nwDXdZnqF\nqHtNAyqNQRMbLnaviZtMrzPyaJ8\/W68Nz\/SaMxcIlckmvW57FybSxXmnPzRmjRXsxGRWq\/GlGlTe\nyKOrq5TZt7PTk2T6wwWCShQJPjdPOMMJxj0R8Py0tOSJZPPs1Owi4cjOE6T0+xlPnGyhxSdXBU6+\nJbdzE8GO8SyxEjBYXCRyC0vE\/MVfiKw0rgTsC84QTUaBMAN3\/ueAlX2mdV3eYKiJ9tI9UzPEcHyW\nkEPsnikRk7MLl0H90uiSoJn0BWIoOkso+Ul9z0REXJ34bnjj7nI1Q7VYva7DEuQpX4IcliCMySJh\nycwTnOQWCVgvPctwne4IdcQscrv6DW2rl4QbP3hk0\/Fzx\/brXaZ6UjA1Uzx91Oikj5uctNL023jU\nKNCHjS5TjZbTPd3YVVG24Z17V7eMN2y4o+ylDx9\/uLxx0+bWvsbXlefa3lzhr7T2Nj1U3rhZ3szN\nLvUrRXbx8DfjlksAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/creamy_martini-1334193618.swf",
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

log.info("creamy_martini.js LOADED");

// generated ok 2012-09-14 19:46:28 by martlume
