//#include include/takeable.js

var label = "Ideal";
var version = "1337965214";
var name_single = "Ideal";
var name_plural = "Ideals";
var article = "an";
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
var parent_classes = ["mental_ideal", "mental_item_base", "takeable"];
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

function canDrop(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by mental_item_base
	return {ok: 0};
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-45,"w":32,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIt0lEQVR42s2YaVMTWx7G\/QZ+BD8C\nH8F3826KmRcz9+rMyMgSkhAIJOyQBNkhhLAFCAiETTGI4G4Jghe9ipfRsAiCJOmsqIg02VjEW8\/8\nzwli1byYqULASdVTp9PdOf3r5\/+c06dz6tQhP3BIToeWpbrAknQisCSbCC7LhkOLsrOn\/h8+24sp\nZyKuLFvEV4zdwHXs7dzD7mYbQityMOgfCsecCyzLbdtrevz+5TlpmvQrvuyNYedTLUL2FASXZMYf\nBkgXHw45leTaHfy+95jgJqmdwJfP9\/Fl9wYivuyokz+i3OH55JjQWzl21vUEdIv0gJx7GIVj33ev\nkYvlCDtTQNkUmNsnCri5IJ0I2eX4HOkkmEGCGtkHG+bf93Z6sSNWIOxSgN1IYOEE88jcCL6RYWu1\ngEA6SX0EdZW7xloGt7fdgc9bDeSiFtvvCxEWMm0nBhiYlegof\/gc0hNIC+kyQXWRLNF2u53UhN2w\nHjsbOg64s0agqwVnjh1u41+S05szEjHiUVF5q8glI\/a2mvZBW0kV+BzOJlA9ttfUiHhSwaIQXFYg\n4srpOnZAcToxdnNWiog3k8qmxPa6liBrSLUEVkxSk7QEXYWtd2mIuCmDDgUCizLKoUI8fsCXycPB\nN2kIvJHzKWTrXT62P+YSqJrKmYFdkbRZQOUvp4ym000oyD1ycCkVm\/NyhH05Mcda3o1pCTZnZfSU\nUCJIozPiycT2u1zu1vaacl9qgizFll9N7tFkvZxCrYr\/bkvIUh4b4PrkxdhPU4kILSkRtquobFK6\nsJKcyudZ2\/IzpWHLR+2qmpzVUptH+\/LpXAUHDDvUwrEBfrgrH15\/Eg9yEqItmUqWDD7dEACbkNmc\nF6bMbfmzeO5C9lTaz24kBeLLJJoPM+jG1HDXXrH5DANHV+oNc+Vpf1upbe2+Auu\/JmDjRRI2ppMg\nzkgQeC3FlieXYNKijzUasSEHOeijfY50ymoKzx6DizgysTmjhq\/NBLfBKvoMQ0cD6W8t61ptK8HG\nJLkxm4nAjJwckZKTUUgqGw2C6EhljrLSBxZoezmNH2NwwYVUOleLzTkDxooL4DFY4aq+LgoZ3bHf\nDehrLROjgNmUIz3Wn1CJX0nB8sicDK+owEb25iyVfS452s6wcyT8+KfnCVh\/ytxuovNa0ZUhw7Su\nDe6aITgyukSnuu\/7JnC\/uRxUYiwNMIBqcqcJgflycqSUABQckOY4nrOvYmAbLxIJjsGWkcMdpDY6\nr4EDzhR3koM34VB3wp7eO\/F9DjZXw28uw1RNFvxjMspULXcitNxJ5bNQ9syky5S3ZgKvouOkuUp+\nM0F2nMTggouN+DBVih6pNlri8ttwZF4mF3sgpF45\/JLMXWkhwEowJycrMiHcSab8aQmymS7cvg\/Z\nQwOk\/5tWeqP7lzv4zQQI7v2vGowUZsNe3Qe3fgTOwj4CbIdD1U0u9h\/eRUfePZuvuQH+VgZZgXmj\nDnMWJRZvKuF9UkADQE8QBpKRgOui7RtyedHAo\/B6KAu\/mdPwMK+c4Hooe9chlN6GM6eJANsI0EKA\nV2iRZD3cmtGuGJlwV9+Cr8VEkNUHmteX4hedDh3JmbBmZ+JBGVMW10zjJdgaizFdUofZchM8dT3w\nGPtIgwR4B0JBIwE2wkulFgr74Ujvx4L8kCPaobips6db4akdhr+9h+Dq4G8xcPmaa0lGUj18pkb4\nmkzwNbbA22iGt6Ed3vpOeOssBNYLr2kQnnoC0tVByDMQWDM+3n9OoD0ccEpiPNxqZ0V+M9aeNsg7\ncRX3wd81gHf93Vi1tMDf2YTVLpKFyUTbbJ8Z\/svtNPI74Wu1wNvcS\/vYDTbDpb1E7lVwwLXbk3Sz\nNJJVXbzvp5Kqwz8GCVBknbDOnJlmuEpbOcT7ATM+DDXh4+16rD+owfr9GnwY1uNddwlWO8vI8UqK\nhgHuyiK4ijRwaYoJsJIBDr+\/9pDajoMMPk4sxuEBU67H8SBTZyzYzmwTnHlGulgVBE0pXDotXJfy\n4C7Jgrs0A+6yNJIyuk37XJfy6RwdP5d+E8f69DZYha+jeDG1E2MJGnzXfOhUDMQ40i0i69SZ3Qxn\nLmUpX09ZKuelcxUVUgRyo5Al6n0xuNzoMV7e8riv\/blKLBPRebAbv0mNBFg48d2PPUeO9bRdW29z\nZrVSuBuiYWcl05Rwh1xFBdxJV3FOVGybwxXRgCk8eLNzqpvOsD4c6g68TbdgPEGHR\/GFR\/Pm53zw\n5xjP2N\/g6lZBqKFMlZZFXWSQBOLSaaJQTLQtmBXw\/xInsgXvwY1mm4ajc2AXppJrMBavEUclOUf3\n7szec9de\/RPepz\/D++wcvOO0fTcJ3nuku4nw3E6Aa+QihEd\/gXfyHNiL\/tffCtlNcc6sFnLvMqak\n1Tx7VN6jX2kHlmRCWEjBxlISPr6Ox\/oirVrekBYS8HEuHu7HP8E9\/leIryUH\/88IOfVKlt+3qlaC\nqzo+uK\/\/bAVX5CJbSUe8+8v91TTeBh0y+J+dh7gg6fqW3zojG\/3LKhOeJpdhNL5QGI\/XHN9LFId0\nckgbc5It99lrJl\/60ysArbB138raqGPOLaQ3YDxRy0fskWbuf\/6ZtCyLCznkOi4CY+D\/mbkFZQMv\n6Wi8xig+mzv7afzlxIeRKdKLCfHFfMypH\/ERMltj2ZNnMd1EzukwflHD132fHr3UCdpbeCJvw+g\/\nDGDP+xOHc+SYTztUHSJbNT9LrsDoRe3BauX9lSfDdsUN6P+QgNG4aizLB08ecDKp+ix7SrAV8yt5\nA1Yy+mOFVOtZprUbz0W74iZMf5SAtc6Uu2dOHHDovPrM6MVicSm1F3blAOxpVthTr2NBdhULjUMc\nbEpSR+3I8MFDgEAdktGTGzwDP6lirOfTbfcu6HDvQhHpEkb+nocbCbkT00mdmJdexUrKiJHURRJI\nth8yWK6dy4gbPJ+us57PUFrPZfCB0vqnJOXgz\/nCwwt6jMUZxJcSi\/G\/ufdvH\/dkUErIjooAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_ideal-1312586506.swf",
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
	"mental",
	"no_trade",
	"no_rube",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("mental_ideal.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
