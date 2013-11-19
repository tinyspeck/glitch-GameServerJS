//#include include/drink.js, include/takeable.js

var label = "Orange Juice";
var version = "1354586469";
var name_single = "Orange Juice";
var name_plural = "Orange Juices";
var article = "an";
var description = "A surprising glass of orange juice.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 39;
var input_for = [66,240];
var parent_classes = ["orange_juice", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "20",	// defined by drink (overridden by orange_juice)
	"drink_energy"	: "15",	// defined by drink (overridden by orange_juice)
	"drink_xp"	: "0"	// defined by drink
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

verbs.drink = { // defined by drink
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.drink_get_tooltip(pc, verb, effects);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead){
			return {state: 'disabled', reason: "You are dead :("};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return this.drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.drink_drink(pc, msg, suppress_activity);
	}
};

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-27,"w":16,"h":28},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGwElEQVR42r2Y+08UVxTH+a1\/QX9r\n4n\/Q\/tafJvUH02TTGBsTfjCmj03amDSZxrSJrWlIbdJY+xAVRa3KQm0pCwLLcwFBXFgE5TVYlAVZ\nYXmssCLLPmBey+ycnnNnht3VPrTO9Cbf7LLs3vnMOed+77lTVPQCQ9iEV8dE2DuqwKfjEpSPStA4\nJuoB\/CwxJgEUCD\/H\/3eMiFAxKgI\/IsF7dyR4rciJIciwGy96AUFCo5I+ie9P4sU\/f16Ny\/AV\/qZp\nTNLv42vNmAwf2gaHd19FEUGwLrrQi4D9lXCu8\/gapajjje96aUAGJ4JkB1xOepc577svD2jWF7tr\nGWpeKnoyfIuv\/Vad2hNBLPa5DFyaVfThKdlcADKE8UIjFInn1CR+P46\/Ve7KEJpWwEfz2FKDVNw0\n4UIGzgGOzSyE7skQnJRhYgKj+k9CmEchBcJhRb+7lIF+nKOS5sGb9Y6KesQWQKy9Y\/mAqg7R5Zkh\n76O7nb5Hf6DudfpW7qNCqOlO3+oD1CzqYadvbeFma3JN6N9IRzvXNWjEOcppHhZBzIxdETw8KevD\nyxOdvqychsyCAOsnOIj\/yMFGKQeJMg5S5zlIX+Jg08PB1i8cSNUcyF4OlGYXZII8aIM8ZCa+SSSn\nTgVjsSEvZYDsxjYPDA\/UKOvfcQxOS6wAvV+3AM9wkCxHwJ8RsMIE\/O1ZQO02D9nrHOi9HERWR9Yo\nM\/YAqvBG6PEKxEtdDJAGA\/zhKcCLqCsIWGUASjUI2IS\/6edhmwAHPwFtmAd96jiEt9JAu5FtZh1a\nEkANYJpm\/QwwWc3D+veY5pM5wBQBXkbASozedR7kDjdGcJ8BKJyAzOARUG\/yIHUdhal5gSxmt22A\n5IVKPQdayMMAMwN40Vs50d+USoJR+3gGovaiBr4GdegEyF08iM1uVqN0E0IyDXe24HUbAfWA2rwH\ntKnLDJBStt3G7SjTimrhQG1CNWJq8WbkOlRLMSg9PIuo2IKAlUYZ2OaB+V4Y7zOiRUMbwpryczva\nbkdZkD5UA0JeQ7UagAoCSk0HYat2P6w1uGlXitsKSCsuTrXU52aA2aky0Lo4puz4EdD6DjBIiqTa\nbEBSFJU2E7AbARuKQb5ZAo9bedyD9SG7I3h4+Z6HpZMBhj2Q7Ua4wQOgL\/sMSL+Z7panAG\/kAGmF\nLw6UUQQbbe8HGWB7HmCP4WkEqXVjfXYUAqr5gD05wMiwh5rZUnsB0QunowID0NcF0GNBFkEdIbOB\nd0AL7H8mgupTERRrXAxwZjZorwdagwG2moBxYacGtduHICuU5BbK39QgA8RVPBURAI8B+2wHnEil\nEhSd7JKfQbIV3GGu5Pa86DWZq7i+cBVbgOSBoxl403ZA5oV4cW3GA7q4YnigCbad74O+nA8qeT64\nVf0280HWqOLhy35A9MJkjxu2x48bu0kLl1NzDs7yQGoW5LaDLL20k1D9PWl0s+ODIyc75oW9xnbG\n+kIfVyhzB2FwtUazIPvdLHpSJ8+iF2vhgU52jgCSF0ZHykDxFxuADdyOGJi1vXkNONYTtrlZ9KQO\nnu3Di0HmgR2OnY0XBQ+LDgPEhkChOqszwWoL4VjL1epm0RObPmJ7cOS2h1ZwhTOA6IUPHgYZgK6m\nQcF0MyALygJDib+irnKsQZD8CIi1R13M9EyQIvhFkVMjtCiwyGgxwdi+qnNQ9LkFRl01a1y7v8T0\nfgYiNgjUcVMfSI9AHAMUkqkEAWwvBo0ezwRSAiUFYLQgqOYyc70IWQJbde+zhlZIpGE4DW85Bkhe\nSGarTniYCGZHlTkwOpuw7roeU3y9BDZrP2BdN3mgYw+QLC98gumS+4+DiguGwXjyoK4YYEx0iKrD\n7w5XQPraxxD73fDAjjC84hggeSF5mdiGK3jMk4OxdMkAo3SmLuD7WuyifTykqophpY5nTySKnBzk\nhQt9ZZD2uEAZ9TAYdpq7aEKZYMnz5kmvBgEbeEhe3geRG2WU4luOApIXzg96GIAydhXE9iPs0G4B\nWUqcMw\/03kOQruchcd4Fc\/0OemDBGTkUhMRZXL19paBM+gyYs6bKjGMo02mM4DUe0pjajXMuCN0P\nUgRPFjk9JpdmDYDyPZCs2J8DMqESp4wDPSlVi\/Xn5SFe5oLJxVlnPTD\/jBxFw002H0VI1w6MJTrM\nx38ynt2karCLuXEG5AUB2KM7Efb+D4B6ILYNOyOzJBhafFb5gwAd9UBrDCTUY2S4ERVAycK\/jrSG\nkduQwDcfG3fUA\/NH4\/zKLu+D6Gl\/dCPgm1uFW7Ek3HmyWajHqUjz3GrVlYnwsdIB4Y3\/eq0\/AZ3s\nvD9vSYBOAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/orange_juice-1334213119.swf",
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
	"drink"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("orange_juice.js LOADED");

// generated ok 2012-12-03 18:01:09 by martlume
