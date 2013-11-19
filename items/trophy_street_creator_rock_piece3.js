//#include include/takeable.js

var label = "A Piece of Street Creator Rock Trophy";
var version = "1337965214";
var name_single = "A Piece of Street Creator Rock Trophy";
var name_plural = "Pieces of Street Creator Rock Trophy";
var article = "an";
var description = "One fifth of a trophy celebrating top street-creators. Four more pieces similar to it, and one mighty Rock Trophy would be born.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 50;
var input_for = [];
var parent_classes = ["trophy_street_creator_rock_piece3", "trophy_piece", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"smash_green"	: "300",	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece3)
	"smash_blue"	: "450",	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece3)
	"smash_shiny"	: "550"	// defined by trophy_piece (overridden by trophy_street_creator_rock_piece3)
};

var instancePropsDef = {};

var verbs = {};

verbs.smash = { // defined by trophy_piece
	"name"				: "smash",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return "Smash this trophy to receive "+this.getClassProp('smash_green')+" Green Elements, "+this.getClassProp('smash_blue')+" Blue Elements and "+this.getClassProp('smash_shiny')+" Shiny Elements.";
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!pc.checkItemsInBag('bag_elemental_pouch', 1)) {
			return {state: 'disabled', reason: "You'll need an elemental pouch to collect the pieces."};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var n_green = this.getClassProp('smash_green');
		var n_blue =  this.getClassProp('smash_blue');
		var n_shiny =  this.getClassProp('smash_shiny');

		var remainder = pc.createItemFromSource('element_green', n_green, this, true);
		n_green -= remainder;
		var g_destroyed = remainder;

		remainder = pc.createItemFromSource('element_blue', n_blue, this, true);
		n_blue -= remainder;
		var b_destroyed = remainder;

		remainder = pc.createItemFromSource('element_shiny', n_shiny, this, true);
		n_shiny -= remainder;
		var s_destroyed = remainder;

		var result_string = "You smashed "+this.label+". ";

		if (g_destroyed) {
			result_string += g_destroyed+" Green Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (b_destroyed) {
			result_string += b_destroyed+" Blue Elements were created, but destroyed, because you couldn't carry them. ";
		}
		if (s_destroyed) {
			result_string += s_destroyed+" Shiny Elements were created, but destroyed, because you couldn't carry them. ";
		}

		var produced = [];
		if (n_green) {
			produced.push(n_green+" Green Elements");
		} 
		if (n_blue) {
			produced.push(n_blue+" Blue Elements");
		}
		if (n_shiny) {
			produced.push(n_shiny+" Shiny Elements");
		}

		if (produced.length == 1) {
			result_string += "You received "+produced[0]+".";
		} else if (produced.length == 2) {
			result_string += "You received "+produced[0]+" and "+produced[1]+".";
		} else if (produced.length == 3) {
			result_string += "You received "+produced[0]+", "+produced[1]+" and "+produced[2]+".";
		}

		pc.sendActivity(result_string);

		this.apiDelete();

		return failed ? false : true;
	}
};

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

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/street-creator-rock-trophy\/\" glitch=\"external|\/achievements\/trophies\/street-creator-rock-trophy\/\">Street Creator Rock Trophy<\/a>"]);
	return out;
}

var tags = [
	"trophypiece",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-29,"w":30,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI10lEQVR42t2YCVBU9x3HWVAERFAR\nud1w3ywgl4Asp3J4xBjPBFE5FEGIigfIjQJyrYiAy7VyCcICyuVyuR6AoKKNmrYzaQcn7SRN04Sk\nTZvamc63v7esGUIwMQaPKTMfHvt4b+ez39\/v939vn4zM\/+NPSb8wpFLc1lne3yo+1ysUF4saxYWd\ndeKC9hrua5fL7alNqbstwvAfH2CIqL99BWkdZUhrK8WJlrKJCH626muTy+ypCvnky8+B\/+J7\/vCX\nP0NwrR38PiGKui8gvbmExxyb0JCfElefK46uTee8ErmYiuTgwmuN+PeTJ\/j0679h8PFDdP5+BDV3\nRSgVt6CUBIuvNOJUWwWiKlMFWZfPIaGlCNtPRre9EsGosvibuf11ODvUiqqxK6h\/JEbVPRGKh1uR\nO1CP9K5yZLVXgNdeg7iaHBxt4o3HlKVjU2KYePb7rLuS96MEK5O+yu6tRuGNJpwbuYzyO120bafX\nzTjVV4PUDj5JnUZiYyFONvHvp4sqOYXXLyKyKHFi1gXTOvjj0\/dFlBz+Le1HTn8teFRqRox37aLk\n9YnuSiS2FSOuIQ9Rggwk1PPAnFN9p2s8j9INztk\/u9Od0VWB6ftCz8TuiT2fhvTOcmSKBMjqOS\/Z\nMqVNulSCI008xNZmIZyfiNCiQ2gZqGM3PhTHFlNLRJYkds\/utIqqUHGvi\/1jyYOCGEGaJC1Gitkm\ntJzB4YsFiKnORGhpPILzo\/B+3j7U32wT1Dzo5eb0VGPDkR1jsyqY3VMtLhwUhvxgSKozQiiliX1l\nieO7Cw9iz7mj2FN6FGHFR7D77CGpWCS2ZkbgWF02MupOiZt+0ytOERYjMHpT\/qwKptOQUO9Ipi+s\nPHl9GD9xPLIyve3AhRxJL23Jjua8n7tfvDk9DO+m7sLGlJ1YnxAMv8h3vvEMXY9jlSeQKSzCuZtC\nhGTFgrszYO2sCh5qOctmeiyuMU8cxk\/ihVYcZ890HLM\/vCyJyxDBP6p6qC6PzZSbgVkD9\/PTsOHw\njntGRkbzZn2Sky+V8pIvlyK+teQXTWBGR7ngSF0+Nh4Pxbq4YGxO3Sd4aYvzoca82LiG\/IkD9Tmx\nz3tOz\/0Rv+KrzUhuLcFBQTYO1GQjqu4E+6VJhlclcaME6by9FaniUP7xkOc558rDW5K1kmkTpgr0\nIVPeqNuxT778630+XWUKxA1g1tRjTafH3yjBxxOf86rHeiRXG2YxZwYmujab88YI9n08llJ\/pw9F\nN4QSweOtZxFTmx37xggWD7WNlw+3I\/\/qBbpOVyBeeAapzSUTI3cfiQdHPhRfG7wnHrg59nr68s7H\nvxMUiZuQP9AgSS+F7guP0LoYX5mL0bGPMDT6AP3XbqNDdB3n69p8XpkY3V+rfvX1N+KGWyJkdVdJ\nbiIYuWPCQkSWp2Jt3HvovTqMS539uNDUjsrqi0g7mT\/h47NB7aXLPXnyhPP3b\/95\/7MvvkB0STKi\nK9IQKziB8KIEbE7bg4APtsBj1xps274D4XuicTAuAakZOcg7zcfh+NS2l50c97vv\/jPxj2\/\/hT99\n+hkyzhQg7GgsAkO3wGv7WnC3BGHlhtXwDQpAQNA6BBIRe2OQlJqJ08VVOMuvRWFJdchLkbvYeSvk\n6tAjDAw+RP\/NB+i78SG6BsbQ2XdXwmXRKFq7hiHsHEQL0do1hI7e22jvGZUw+f8hNLdfn4gM3jW7\nN7WNHaOcpo5beB6aGTpvQdg1gpbuEbQSbVdGcUnESDLCt7F701YYzZXhzYqcnYIM28PUdMLPzh7T\nCXB0xFYvjxnZ5sWdxJuL7VLe85nEavECGM5jwUBe5tffXNgqyvDsFFl4FvbEciUWHOez4KTMgvMC\nFlaosOCqyoL7QhZWEh6LZMFdLAsvNVn6mzUpR+gTunNkXrjcLGK+rYLM4+cRcyExVxJzk4oxUp5S\nKe8lsvBVl4XfUlmsIizonLfkWWAT2irKL7SIzyGWGMyR8Z1RjsQcnpHY1LSmiq3WkEWApiwCtWTh\nQ68ZuWWM4BI1aGpqhvyi1IilhLa\/jnrTTMk5MMnNVE4q33S5VVPkgrTksEZbDut05OBKx+nNZUFH\ndQG0tLQmFi1a9LPPeeSJhYSGC1vLvGC9v8hnqcoz03P8mfR8pgj6TxFcKxV8W1cOTnS8tuJcaGtr\nQ0NDI\/anUlMm1Cbl2ObF76z56PS61QjQVoO\/9mKs1lqEVZoL4Uf4aqjCT0NFygJCGaskzKeklAja\nairBX1NRQoCmAm0VaDuPyjtJkAR52j+XBkUWWurqTIptz+o1FancUvplts2E\/SiCY4YwGxPssjLG\nTktD7LAwQJitCaKdrbDP0QJ7HcwRYW+KSEdzHPa0QxzXFgc9OPjA3QaxbtbY72qFKBcL7HM2x14n\nM0Q4miLcwQRhy42x284Iu+wMsdPWADs4+jBXUYQmlZn6UDxTSRm5xU97zkpBpuInlxQlaf\/NMCDM\n9E5fUrynlPrpBPtPGRam5Cb0fhozCDJfDRdIe24JoblMVfldN92l4Orr\/ABPwstAB96GOvAhfI10\n4Gesg9Umk\/ib6iDQTBdB5rpYQ6y10MU6Yr2lLt620sUGYqO1Hjba6GETRw+biS22ethqp4dt9nr0\nXurQUFNjevD7B09zCaXp6emz2cOG+vqYCSMDAxgbGsLEyAimxsYwMzGBmakpzM3M4OTgALcVK+Dm\n6go3Nze4Eyvd3eGxcuUkHh7gEp5cLrw8PeHl5SXBm\/Dx9oaPjw90dXWZBCXPiGSl6SlL05MMhpqa\nmvPzypk+lSMsSNDS3BxWFhawsrSEtZUVbKytwbGxgS2HAztbWwn2dnZYbm8Ph+XL4UgfyIkukU5O\nTnB2doYLYUXnUYISQTlCcVp5tZbp6RW8SHoWJGfJyBHWJGgzg+BUOQeSeyroTIKM3AoXF7hSBShF\n8dRlRU6apJJUVkUqzJRcXVp2Tab0hB6xjHiLMCCMCVPCjLAgrAnmW5wtYU84EM6EC+FKuBPM9daL\n8CZ8iVVEABFIrJGXl9+uoKDg8T8Oe6KJgh\/TjAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-01\/1294353981-2510.swf",
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
	"trophypiece",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "smash"
};

log.info("trophy_street_creator_rock_piece3.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
