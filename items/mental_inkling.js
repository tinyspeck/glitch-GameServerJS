//#include include/takeable.js

var label = "Inkling";
var version = "1337965215";
var name_single = "Inkling";
var name_plural = "Inklings";
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
var parent_classes = ["mental_inkling", "mental_item_base", "takeable"];
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
		'position': {"x":-17,"y":-43,"w":34,"h":43},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGIElEQVR42s2Y61IaSRTHfQMfwUfw\nEXwEHsFH8BH4tsnu1hYfdmM0awSjMYoSJF4SRJhEgwrKRa6DICOX4c40AyiaSM726TjUSNzaLYzo\nVJ1imOmhf\/3vc\/7dzMDA\/zjcz8hYZLluTr4rcsUVnku8TnF47XBSGhx4yENcimvKm0lyYm3AibUJ\nzewFfLu8Alm4gOC8DBTS92CQ2LF3ogKl1RiEXuZ9B8+INmMStLInJ4juc0h8aMLBc8IgHwQQgWiA\n8CalveWe\/mS5AOJ6FjIrGeBfFzR9hZPWk0Px2TThX2WF2+6fUHXLthSpOtJQdaSgaM1o+wpYsvBj\npXcxKK0f6xWgwDQZidBQ2pyuFHX8XAUSxhKkLDmur4DeCaKJGErAG8o65Vp0howml8uEnyFj7Ps0\nGQ1NEwhMEfBPSlzfc\/DohSQk5guEONKa+Csykn5b0ZC9PCGu4jDex2tRA4EwhTyaegDArCk7nN9I\nk+JWDk4tMqQtBMheQa\/cJ66qlvhkEK1VSK1VuIHHdtT8EteMN0D2E6juV\/WPCk6yt4bkUBPkUAPq\nwTpkrWT0UQHmzURbC7ZAWCCQfV8jj0s9G\/XAj3VSPTyjJk4gPkd0j0u9VVnbSFyAuCFDcp5AbJYM\n\/2DkIA1GgIzgZ1\/hWl5p6CzRgMvyJTQiNP\/CjRsrTQzIcORK4qJtAqrQI2xfAOtBom+J53CRa0Ej\nKoN8VOvYSwSkoUibkC64TnzOx+6\/kGRPhWvyNThPNaEeoPbikgAVU0INlG43odA+h1z7jJ07C8f3\n75WSs8DJ\/gqQI2rQ9hqE9BKEs7crJrTrUGlfgPTtEspXrf4ABuiSFpmrQXKtAbxRBv8LAl6uBK6q\nAPvlJAQvSj+AJtoyBJoF4NJhWHbZOUvA+fO3ZkpV+k1E76NQkQWqHgX10A0rP1+G7eMo7ORi4JGz\nPwAi9Of8MViPvWDc2\/oeu46fWzSRK+LDzsKCBN4JGqgc3cUE9RWochnwrLlhxf\/5VkAMb11kkDiI\nD\/whLO7ahDtDoWXE2jVd4koWcJroOfjPCnDqSkLFdgqVre8hbsZhftHEAAOtIvxbFYe\/VuGglmaQ\nS\/t2MDntQ70XA8BQ5VuLYIIrkWo3WJ7tn8bgeDsKqZ0E+1zYWIO10D74mjk2iDgNBUqkFRxTfcc2\nCLji3bnbNBP4OqKGQ7vgaQeooDJVSmCBRFsVBoOBIHgtdl5mz6LNhL5U2PTvlk7YM0aq4C+vxnsH\nxIJAJVA17ATtIkO9TK2OEvy152FbtUqpVq2jPE69MiBU7y\/zHNztL6d0MkhHzVaFYrvVURJB+S5A\nVEYJTAGEwFwrXz\/HX7fB4jC5OZj68JaGibsT3LYY8ykVyV97mVIoqCIqhoH3nIX4jSnHwILAdklq\n1qgepsVW8qhjMwabpfcq3hZ5rrtDt5TqLF\/q3ERg9DkcjBoUz1FN9TUsJAVw3PKm9xykgKQbEBXA\nREdVFDXV+aiYMbb9lI2y6VQ\/b0v4OnA4xU9mnvcOSH\/Q3A2oqIJKolrK0obneK27slcDux2gGfs7\nFgj2x8LL73CG8d5fl2zn4yOO0yDryOJ3stHfBow5hYFTN\/tp48Y9VBGrdcpqEnSLBu6J4TkLCmZ+\nOjMx9tQ4ebeNLJro4u6WmQaHKiDoRsTdielNc0eNX2cnYS3s6qiMRYFxJIuw7t9lalEozU0bk4ai\nV2SUpoeWFpTWWYxrnblkbyuL8dA2uLi3NUrXTx0Cz31cRyV0GL+\/\/hvM3u0baYDbLMVi\/NUMLLkd\nbBBqSPXGFn0TDRxz35H0Dv\/UTcSCyzHMpUKdooo0ijeq3FUWWBpg1VK12Qsm75moQTAsOgVSSRmL\nb+d+XkJ5ZFGrLG1K4LKHhYQdv9hYAsxBbItbfwRSigxVxxTCVMKZuhdAuh0z43qtBox+qbLqxpxl\n1nINiAvBZsJnfh89YPewyOgKQ8yenft7hYf\/RxSPjH+l5k130HYh0DFnndFAQ\/9wr0fWw\/sa3DGr\nrebt4ScG96dpVkBrUf4j4yddIsewgnuu3F4OzJ+lPbtWHVhE3e2u7YUZ\/DPLm8f3VsxC1R5fXSC\/\nUYtC4\/6v9v8AW+9b7WdzRrAAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_inkling-1312586613.swf",
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

log.info("mental_inkling.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
