//#include include/takeable.js

var label = "Grade A Earth Block";
var version = "1337965214";
var name_single = "Grade A Earth Block";
var name_plural = "Grade A Earth Blocks";
var article = "a";
var description = "Made from earth and spice, and everything … uh … earth & spice, that's it.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 95;
var input_for = [];
var parent_classes = ["grade_a_earth_block", "takeable"];
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

function onLoad(){ // defined by grade_a_earth_block
	log.info(this+' replacing with '+(this.count)+' urth');
	this.apiSetTimerX('replaceWith', 500, 'grade_aa_earth_block', null, this.count);
}

function onPrototypeChanged(){ // defined by grade_a_earth_block
	this.onLoad();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can make this using <a href=\"\/items\/713\/\" glitch=\"item|blockmaker\">Blockmaker<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-39,"y":-42,"w":78,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHMklEQVR42u2Y6VaTVxSGvQMvoZfQ\n1dWl1TpgEVFkMkiYIQwBDEMSCDKTARBBCMEoEhAFR9CqtLXV1f7JJfQSvAQu4XQ\/OzmfwaHDan\/0\nR85ae+Wc7zvDu9\/97n0+OHQo3\/It3\/It3\/5Re7nZ8cWLTZ\/n9aO+yJudQBp7teVLry00vttOtm49\nW++KYL8+C0Z+eeKPrC82Re4utlTupjoD6b2hyNsdf+T5RmfBp4y9\/xU4Dt5d7zIvNq+Yl\/d9aj89\n7DOPbneY7WSb\/vIe29vqMc\/vdjvjN0\/95rfnA9q\/NVdvNuLNZifVqeOHt9p1\/cZS835ipja9MOHy\n\/G1Quylv5c56V2I31fXOHvbDdq95\/ajf\/PigV8ePVzv0sCd3vObZRuY94O38D405rH+86jV34y1m\nfbFZLRGrMRPBi8bvLdz\/S2DpVyHPkzVveutmqzJjvc013t0IV6s9SLYr0FzjPc+Z+ynAvBNpmHF\/\niQkPlpnZkUozJv3hvvPms8DePvUnXtzz7bOhDdHPj\/vVOPTDUGJP17z63L5jDDOM6VuAMJe7bvtm\nm5kerjDjgRIzOVBqpq9WmCn5HbxS9DHA5+tdhxH8252A6udTobHMEEp+7cEYaz4EwLzEdK0yaUP7\nQPS2Ot9gkrN1JjpUroDCg6XKIACjoTLT1\/HdxwDlwPQD8fhzurEsoZXNZY8++3U3qHqjjwQQO2bl\nkOuIMibrk9fqTK8AAMy10Usmkg0tNj1cqWBb6o4fBLi51PDFnflGWVyvh\/O7ISFajLgdHd2eazAz\no5WOHmHD6gpQzPtesluy0Amr1Z\/2ZU5E2AFUsOusAxBg\/I4HLpqe9jNmoLvI1F8+ampdR790AG4n\n2xOAgh02Qz+MOSy12CTp36IAR\/0XnIyztrbQpIZjjNES\/Zho6\/5KqzrKeGHysmpNWROgYZlHPzZU\nIeNyMynZGxDgQz3FCrDedaTAASgg0oDggDuSVakbTWZltlYBUrPuJTwKYnbsklmcrDYdrpMmOVPn\ngLw5m+nj2MLUZe3HozWqNX4ZkwywNeq7aEKd5x02BzvOm+ErJWZu3KXPBq+c0xALyPe18G7c8y7D\nRqO5KRoBGLYmQC0IDr8+UaX929cbzIq8xxmYxQnY0ncyVkdFMjzDMcbzk1UKKDxQZqaCZcJcuY6x\nuTFX5p3oz9t8yjRUHzVu99eHHYAwxCZW0PSTc\/UOOCt2K4O1LMM6T57ZzCYJVgVYXLQb6ih2koo6\nOZUNKSySGNEsgzzHqH+EuN9baHytBQcB2o3w2PZhiRABJrfaw\/LydI2+ZwyTBzXZaJbCbhP2l5nV\n7ByrVcpKLFtaYHRu7JJTZng+2n9BNdjeeOK9Bql\/NjHYhBAls2FeEW2hR7QXuVquFpINFqNuBQ5I\n5sIi622BBhCOwixZT5IA1hbiGSknXGkYupsdzWRydLBc9HjBDPpEh7XHAyNdRYcP8RVBCUhl9UZ4\nJvpKlQWewSJAhrzFprP6lGqUZ1qWRAboD8dgH6nwHmMNc3LZt5ojowFKPZxUwJnbZPqqXHV9F5XB\n\/s5CbE9Z1HKSBbgsWRf0FOmvLTuqyxvNZm7UpQxjq1n2YJIKYBMMI3moizAHcBsJmINFdGjDTXZT\n+0bk\/g35ihUoSVJXdWRLwc3Puw9rxsqmMLEcywDjUAS\/uZypY7AxL56v6NwmR6NWdzapLCiAxkUK\nZD4SQQZOiAUggGxN7BcmW+u\/Nd2e03oP11cd+d1JkOWYu8DqjQ1zhU34pmSDadkQUQNySSRgEwOd\n5WqOTJZvOmWPPePi7JRkLEaWwhgFOhqqUAZhlKQY7j1vgsIiNtRbbHxtp94XaalBBfGYWzec6C81\ny5EaDZv9OOB6s3UxJhtPyhycSGXnACa3NuIAZYU9Z4QhwsaYQky2Aqq7tlBLzZAkAwABNkIGC7ip\nq+UFB+5hAF6TQjkjAvU3F5qwFFHKCPcwISZE17UkuPQGwQnCNymHMY\/QOvrVdRlwODQ34dLwAvC6\n9GMSYjQXHsgwid5IFAnpfmykMj3QfTbw0VfMUswdwDtALkUzG7MheqMPOHsoRh9wEQmRnQ9gtIuD\nsMyaMTmcTCQCAEcuXIPcuTBmfxurv0k3VH31+b9FwqGyAAvxFLbGswvRHXWPS58DOAxgjBfCl\/Ww\n2EiFzgM4vwAc6ynRMoKT1EwcsXc1DHJTcNfy5dLecGLrLz\/tKYbyNbE31HsuIYfs1VUdjchFvedt\nOpmWK+d3NkIbbQ0nlBkAqtaEPfQFaPrWEb7pAIIBkGfXJEJLwjyJ4u88a5prjmlY\/5S5f9r4Pmur\nP+HxC5Owkpiu2W9yH0t3tpza6vYUpMUh\/aabCJYqsJ62M0aiY6ISBZWHOEHmSnTeQcKB773\/uo0N\nlBSk4k0HDuBy5\/6UIhvp8xZGcGa494LH13YmHfKdS\/d2nEl3t55OBLuKEvn\/LuRbvuXb\/6j9AQwJ\nsoKFRFguAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/grade_a_earth_block-1334275576.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("grade_a_earth_block.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
