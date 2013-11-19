//#include include/takeable.js

var label = "Legitimate Post";
var version = "1337965215";
var name_single = "Legitimate Post";
var name_plural = "Legitimate Posts";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["legitimate_post", "takeable"];
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
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-36,"y":-41,"w":72,"h":41},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF5UlEQVR42s2Y6VLTZxjFuQPbD3VU\nZFFUkD0gCUuALPBPyJ6ACC6NrQrCIAEsmxYIYQskYROQzUQEBUFWLdo6ytTWmX7zEryEXMLp876o\n0860X1\/MzDuTj795lnPO84+I+Ap+S\/165+qQIfR6xtEV7Fa53s87YiK+lt+qzxxaGSwBwWF71IDd\nCRPWA1I42JlvPXC4tcA+3Kv7djwfN2GLALdHSzDXkQ9PTUb4wOHW\/Aa8uGfBb9M2rHiLsfMJbrA+\nC53X09BYmVB4YHAbIyZs0nsza8dir4a3dubnfIzcVqDVmYIqxxk4NNFdBwK3OWrB5rARe\/MOPBko\nwvMxA2YJbrwlB7cvJ6Gu\/CxKNTEoK4q1CofbHrNig+DeEtxSn5b+6zFzV4mptlyCS0bTpSTY1TGw\nFER\/yDz57SFhcIt9eg63ObIPx2Zu3a\/jlZtqz+NgjRcTYVNFw6GO+SgULuTW0sxZsDNm5guxRcuw\n4i1CyF2IydZctF9NRUNlIuyqGGptbNikjEwTBjfboQo9C5jwy4QVrwnuxT0TQt0qPOgqxHhzDjrY\ntl5MQqXuJJu5sFJ2WBzc9B0V6ZwBz0lKdicstLE2Dsbe2E\/Z6K6WoaYsHlcMcXzu7OoocUsxTZVb\n7JOwO2njbf096MBcZyEe9ajhd8nhvXUOtecTcMN2ms+dXRXtFAb3sEcKhTxaaitrqRnvF8owT3CL\nvWoEGuUYJDhWuVp65gLBcMsDxpEHbg12xi0c7q+lcj5zbCF8DXIOyHSOPUPecThUAsX4md\/iDHZr\nuc6xmfvzYSkek9Y9JMCh+nMIEGD9hbN8Y1nlLAVRIaFwj3olPCXzZ3B78\/sWFuouxHCTHMNUOVdF\nItc6ain0uZFi4ZYJ7MmADr\/et9GzYHVIwoJHDZ8riwM2XNyHqyg+AYNIOBY213wmLPVLHG5nzEh5\nToegW0U6l00zl8VdgrX1ckkcpJzID0WZglxioUdyrjK4vmKSEyu2Rgz0WGQq4HCscsz8WWuvmk9B\nk3VMHBwtg3PNb+ZtZZmOwbHIFCQRniD7YnDNV5Lhospds56GpBBYuZm7Kl65VV8JJWATSYqJII2k\ndQWU6ZQ807HKsbm7YT8DozLqo0Z2NEZY5R4PlJDhm7HmL6G5s\/Jb4lGPhqdhpnMtzmTur1X2eJiU\nUWFJLsj82UIwuJ1xK1YGdXTo2PDMr8cyhU5WPdZWloabCK7aEQ9jXlRYLcr8nw4aSed0tKVWLHt1\neDNnp8gkYc0nYZ6WglWO3xHU1pul8UzrxMExnaONpTmz8bl7O+cgMB02AnpeOT\/BuavS+bYyOMp0\nUGcdKRToEDqwNLweMODVlIVLCUvD7MgZpYXorZHhFllYTWkCpeFY0MyJMf\/1gCkt2F0U3hg201KY\n8HKSnYgWkhYtj+os0\/XVZpC\/JlIySeCVK0g\/IgZu0SulPXBrORxLw+yw3pu38W1l5s+E2HNTxqWk\niqTkAlmYVi4YbnvUit0pG8mIEe8ocC58grtH56GnOh0t3yfjR8splBNcQcbREWFwtBDhLbpd2ScJ\nlunehUr5ibjgUfE7oocq13Y1BVeMcajUn4Q265gY8w80KdMm2gvDy172vaSUJMWEPyjTsRMx6N6\/\nI\/pp5u78kAKnKQ4V0gkUywXBDdZndw25FOHRlnzMdhVjxe\/Ay+kKLiVsWydacuGty6QTMYXaeprP\nnEZ+dFMI3FC9wuVvVOC\/3ngrHdZteXTkZHKXYA5Rpo2FLidyL1OU+fsbFHufgTpupKOzSvYvyP66\nc2imhagrJylhcLmRYj9LfAb01GSg7Voq2q+nor8+6wuguzqDw50vikVJbpTYzxL\/BLxDXtpHEX2E\nWjpDcnK\/Q\/0FksHRFRaWnfkmLUL0j66tLgYx4FJg1qPBE7KxrUkzloaMXwANyuNhedJh8XDs523N\nPORvkIcZyJxHwjqFgp3pUow253G4ntpMZKd+54w4yJ+vUWH9v02m5\/oqvrgHmuRpdP2HfA2KjwyM\n\/n84aLi\/Ae9WEgyV+eiKAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/legitimate_post-1321586644.swf",
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
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("legitimate_post.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
