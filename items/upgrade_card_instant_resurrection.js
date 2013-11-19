//#include include/takeable.js

var label = "Get Out of Hell Free Card";
var version = "1345658125";
var name_single = "Get Out of Hell Free Card";
var name_plural = "Get Out of Hell Free Card";
var article = "a";
var description = "Escape from the underworld: instantly, with energy tank fully replenished and the soles of your feet barely scorched.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 50;
var base_cost = 25;
var input_for = [];
var parent_classes = ["upgrade_card_instant_resurrection", "takeable"];
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

verbs.resurrect = { // defined by upgrade_card_instant_resurrection
	"name"				: "resurrect",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Restore your life",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead) return {state:'enabled'};
		return {state:'disabled', reason: "Unfortunately, you are alive"};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		// effect does nothing in dry run: player/custom

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		pc.resurrect();
pc.metabolics_add_energy(999999);
pc.metabolics_add_mood(999999);
this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'resurrect', 'resurrected', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"upgrade_card"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-10,"w":38,"h":11},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFIklEQVR42u2XW08bVxCA8w\/6E\/IT\neGxTtTEBjI1JsIFwC8QOAWOuxoADQUlj2qQPLS20KpSqgA00rSoqakiABnDYgJ245dIHCphiwNzv\nCCGekJCmZ456VmtjCHSXl4ojfbKN0O63M3Nmzl66dLEu1tnW7OzsOz6fT8Ygvy0CbASOMTU1xTU2\nNlpE33Rubu7y9PR0odfrtfxLNfnNMcjvXQLMzMz4QST8INfxgzwANDQ0cKIFyc3tKPDwo0dgszUB\nfg\/kLHIoxpBEEKP0x9AQxMUnUF709Bwrd5qonYsgRu9W6m0\/wf8aNWR+fp7S2tq6K4lge3uHXwSD\niX1f3wDj4+NvjRqTQ9ra2kASQYwYprmnpzeoXG9vHxQWFUPFx49hYmIiqJxQDFlYWJBW8KSUVlVV\ngyE7B9SaOCg0FcPTH38Cl+v1iXKSCRIZ7qRaczpdVC455Rbk6rWgir4OD0jNZmTqoaurO6jYuQkG\nymE6ExKTIP1uJiQmJcONGDUVNZqKQJeWDPnZenA4Xh6RW1xcpEgmeNwO\/bauDiIVSsjOyYMCowmK\nS+5Rbmt1VDY1TQsmUpt6QzZ8U1PrJ3dugkwOo6fWxIIySgWZ+ixaeyjHPlHafK8UbiYkgjk\/A74k\ndSqUW1paklYwsH08e\/4crspCIUoVDbo7dyEvv4CKMrkScyn9HhsXD5rYOGhp+cFPbnV1FZqamnyS\nCAbrbTUkZaHXwmiKURAjh2IohXVYWlbOR9RUVAJut5uKMTY3N6WZJHjyCNbXyu6XU8EIeSQVwhpE\nGQRTX1Rs5gWtVpufHLKxsSGZoG9kZIQXGx0dBVeHHdI0anj3vSsQHiGnO5htEkxp\/M1EXs6QnQuj\n7jfQz3FUbHl5mSKZIEr1ORwwOTkJ3olxaNLr4Ff5FQgLj+AjiLuWbY476RlUkgmW67TQRzaJUA6R\nLMUscs3NLfBLRirUKUOhQXGVF8QazDLkUCFs2PgdNwvWIwqWpCRDpSocnn1XCxz3isqtrKzAzs6O\ndILYaJ8+rgDzDRWNnlBQoYyi6UVQDidIYlIKn\/Inmmj4NFpOYXIIXre+vr5a7Gk6hI0pW6wSKq4r\nqCCSqlRQwRi1hm\/QCIse1l5elgF+lr9PHwjxvOzlBXEyiT7yk7qRodxfPd1USihYE\/khFEXIaIpz\n8wr4GmRgBDF67P9bIj\/gBbEH4nUlE\/Q4B+hNsJbYDRlmRRjdyVpdut\/Iy8nIpNHD\/8FPrN1FcipC\nOdzBY2NjWIOFogTJ7LSwAe\/67JMjcoyvo67BQ2U4PCCyj1Ryylfkb8LodRuzqByyvb0NQ+R8abVa\nZZIICmeo988RmOh7Qfm9porSX2qEjpjwYx8A8bpfU7m1tTXY29ujk0W0IEmvXSjH5ihD2Nfmp\/+G\nvoLMoHJvKp\/wcsj+\/j50dnZiii+LjSAXTCxQjrUPrsx4RM5BpJfIjmVyyMHBAbS3t4s\/yRBB39vk\nWNtApt0uKsQYqq32E0PW19fh8PCQNP5m8W90p4maELYJhOlk4PkRYYKipwgRCDmtnFDsODn22trV\n\/RtsbW2hoF10Dzxr1ALlMFqIndQbE8QJg9eRoklbxESNySGNjVYwFprIGDTAq4EBaZr04OCgDM9+\neDGPx3PmqDFwauCrKQp+XvkFrT88X4rugbhIGkLwQgimBCEvOtWkpjiETINd4Xsvto\/j6O\/nqDAu\nSXrgWRd7EHKEUtvtdsvw8LDF6XTaHA4HfRjMBoITRJJz4MX6P6x\/AHOjoNHVGnI3AAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/upgrade_card_instant_resurrection-1334013034.swf",
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
	"no_rube",
	"upgrade_card"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "resurrect"
};

log.info("upgrade_card_instant_resurrection.js LOADED");

// generated ok 2012-08-22 10:55:25 by martlume
