//#include include/takeable.js

var label = "Pet rock";
var version = "1337965213";
var name_single = "Pet rock";
var name_plural = "Pet rock";
var article = "a";
var description = "More than just a pet, a pet rock is your pal on the inside. It tells you when new quests are available, and lets you know other stuff you need to know.";
var is_hidden = true;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["pet_rock", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-49,"w":35,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHZ0lEQVR42sWY2VNTZxjG\/Q\/8E7xu\npzO9aev0irphwYW61RURERGUfYmA7FERURQFRVkEWWQNSwhJTkJChLAlhEXrOK3LRZ2Odhyu2l6+\nfZ8PvnjAQjWJbWaegZOcnO93nnf53pM1a\/7Dl8FsDoKyC4oi1vxfr36rdR0g+o1KWL9JyYP6jGZd\n34AyrzcqBJVcvU65Wm3YJ4dRFGUtAPRGs00u\/k8yWWyk2Iao32QRx+W37lB2fqHnk7rErtRhMcug\nnRzDIzTsHKXJyUmWizxTU+Ryu2mC\/x8fn6Du3j5qanlAitXmBUzPyiHc4CdxDOEyKoPkdk3R40dz\n9OSnx+Lv3OwszUzPkMfj8QJaB22UnVdA51gS8E5dAyVnZFLBhZKggMHpTZYImUdmq51cLjfNzs7Q\no7lZAYe\/czMAnF7i4KDNTjX1jRzmQVLYbXz\/fkubAGRFBKz6ZD4NPRwh15RbuAQYQAJsdtG96WkP\nuRlwgsM9wuEdHpugkdFxesgpIAFb2rsEYFL62bqAAMp8G+FFxtkVl8slIAA57ZkWoBDgptwL7jlG\nJ6ihpZ1uVtUINbV1MuCQt3AWAV8EBpBDi7A6x8ZpbGJShA6QcNLNQFMMCzA3HwPO7hgSgFW1DV5A\nqLq+iRpbO7yAUGpq9jq\/c0+Elit1ZHSMRhnSyaHrNZg4l9o54e9TcWnZAjAL8HqDkW5V36PiK9fp\nSnml0LWKKgFZer1iCWCu9mKZv+HVGcxWejjipGEGhB50dntdweLpWbnU3NpG4+zuGMOP4gb0BgGe\nV3SB4hJTGSaLzuYUcEUXeQHPJKVSUpqfYcbFii6WUIeuW0A6nONUebdOwMGVPG2xWFxbXLLgLgtO\nDzvHRG90DDvZURNduX6TzpdcoRQ+VwJGRJ2k4ydjya\/qbdP10OmkFMriPobFkFs3blejh1FCqoYi\nT8ZxsmdSfWMLOZ0LYKhY3IzVPkRGxUq63n7qYgEMf9FmElIzKDzyhJDv7g0oZbgY7jqDw2h3jPAi\nZnarVDjX2NpOJm4d3f0DVMeAVt7OhMucrygqA8M5GBhq6dBxVbeJ3K28WysclIDhkdFBPobXbOvo\n7qOqmnpqaG6lwaFhsrEA\/fPzl\/THn3\/R\/aZmMpjM9OSXZ+J99Ek7q7NXT7+9+V1U\/cVLl8U5zgkX\ntel6xbAQMEDe2sjMzig2B1nsDrHhw7HXb99Sl05H36z\/lj77\/Atyc7PG+wNmC583JFybnZ2jXbv2\niM8PHDxMr16\/EW0mp\/C8APzxUDht2hrKCkn0bSgQk4pCRoudzNxklUGHCDFAsNh3GzaJxdWAYmLh\nmwJgeUWl9\/Ovvl4vvlN7v1nAHTsRswgXShu3hJT5tcVhURNDmqwLoE1tHfTy11cCAAtHRceIY7yP\nmzDyUADYp8+e0\/YdYQKwtr6B5p48paLiy3SEwyrhFh20+b0HG3h6MfJcBzd5+hRJ75l7LBZFbuFY\nx70PxWGyDhFyF5D4HLI6hvmcLoqOPSNCu2vfAdq5ex8Fh+6gjcGh8371QSF20aDYaIB1tfwmFZ4v\nFvurVA9XJ+BxEwOWhfPau\/Ui56BmHhBQwQhvfEo6HT0eLQrkh737hYv+7CQvJGS\/eZAaH3TQsaho\nOnEqVkABerlwntTy6VpucafOJArAbWG7\/QMsvXZjXtdnWHTRSq2dPZSZk8+VqBVbnhpmuXD+SoBx\niSkCMGTHD\/4B4mJoC5jhJGRjayfVNDRT74DyUXAY9SVgVExcYEIsL5iZW\/BuMV58decs78EhCngO\niTkdT0cjo7yAhyOO+w6o0WjWSkConXcBWTAVVdUUn5xKFXdqVnVNSo75qRoeVHkfjo1P8u4kCLNv\n7qVnBqkB8bCjDle+9uLCewBTudatH6Cc\/EJK4++oz8\/IzqXzl0p50CimFE2WFxBhDggg9lC5YGeP\nXuzP3gJSqbahic7lF7EKve\/hRgB4reI2Xb1RKa6HUQuA6Is+AmoScaGE5DShJXm4iqpq7gnH4OTy\nAknLPCdA1YDIQ58AkzIydbjQ2Zw8yuW2kqwK2cdIFog6GnJg9Wsm5Kcum2wzWs6dfwNEEbV19bz3\nvhyv+HoUl5AkRn3o3bjlJyASGqEpuHBpVUCM9a3cvOVxHU8uGPOlY2mZ2XQy9jQ36eQl7vkDWKcO\nydXyCjGyV96pXtFBdVGov4ubxA0CMuZ0whK48GNR87426Qj1Ikh0TCl3Ve1mJQFGfg\/PH4lpGd5j\nWRxS+49E6HwCxEO1GhCJjnxC012tIau3tGxuNzkF2hWLQ0zVwd\/7\/huNzENfhZaC\/JXHGLUk3MHw\nY7Q5ZPv85s2bff8Zbnmz\/hglpmm8FRubkLxk\/5VjFg+reX7\/NsP9sGwlAMx1SHop5Fd0XPySQgDg\n2XN5XMFnaO+Bw7R1204J5\/HLPfXQIJu2OvFlLiFUyCXsqdCe\/YfEsRSg5HjvfVDiMX\/jxtB1awL5\nSk7ThCEnocjoUzaESs5zHyq4xqoLiHMf+toQHPzlhi0hQahG5BQglkBtDXmBZ19fHPsbPY0XlgdV\nOVEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-11\/1288974749-5561.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("pet_rock.js LOADED");

// generated ok 2012-05-25 10:00:13 by eric
