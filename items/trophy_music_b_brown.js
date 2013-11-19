//#include include/takeable.js

var label = "BB Music Trophy";
var version = "1345593755";
var name_single = "BB Music Trophy";
var name_plural = "BB Music Trophy";
var article = "a";
var description = "Brilliantly Bodacious are two words often used to describe the bearer of the BB Music Trophy. Also, \"Brutally Beardy\", or \"Big and Bouncy\". Anything celebrating the finding of all five BB Music Blocks, basically.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trophy_music_b_brown", "trophy_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "collection_musicblocks_bb"	// defined by trophy_base (overridden by trophy_music_b_brown)
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

verbs.drop = { // defined by trophy_base
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

		var result = this.takeable_drop(pc, msg, true);

		if (result) { 
			var trophies_outside = pc.home.exterior.find_items(function (it) { return it.hasTag('trophy'); });
			var trophies_inside = pc.home.interior.find_items(function (it) { return it.hasTag('trophy'); });

			if (trophies_outside.length + trophies_inside.length >= 11) { 
				pc.achievements_set("trophy", "placed_eleven", 1);
			}
		}
	}
};

verbs.examine = { // defined by trophy_base
	"name"				: "examine",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Have a look at the trophies",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var rsp = {
			'type'		: 'get_trophy_info',
			'itemstack_tsid'	: this.tsid
		};

		pc.apiSendMsg(rsp);

		var pre_msg = this.buildVerbMessage(msg.count, 'examine', 'examined', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function canDrop(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	var loc = this.getLocation();
	if (loc.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function canGive(pc, drop_stack){ // defined by trophy_base
	return {ok: false};
}

function canPickup(pc, drop_stack){ // defined by trophy_base
	if (!this.container) return {ok: false};
	if (this.getContainerType() != 'street') return {ok: false};
	if (this.container.pols_is_owner(pc)) return {ok: true};
	return {ok: false};
}

function getAdminStatus(){ // defined by trophy_base
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc.is_player){
		var location = this.getLocation();
		pc = location.pols_get_owner();
		if (!pc || !pc.is_player) return;
	}

	var ago = this.ts;
	if (this.ago) ago = this.ago;
	return pc.label+' got this trophy '+utils.ago(ago/1000);
}

function onPickup(pc, msg){ // defined by trophy_base
	pc.furniture_migrate_trophies();
}

// global block from trophy_base
this.is_trophy = 1;

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"trophy",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-50,"w":50,"h":49},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJeElEQVR42rWYWVCUVxbHnZmaFycp\nN1ZjVBCQHQGBbpqmge4GBGWnGwTEBVEjiokJigsgKA6LCKIiiBEdd1BB0VJJxF0EBUUlqIm7icnL\npGoeZt7+c87tbgSXVGyUql9B0d937++ec79zz9dDhrzjRy6XK\/z8\/HI\/NjKZLHWIMT98s9TbG74S\nyUdF4uXVarSgzNeXB\/ho+EqlgxecPSMFvzx7iJfPHwl+ef5Q8POznwQvnv4oeP7kgY7HOp49ui94\n+vCe4MlPvYLHP\/4gKC4sGHQEjxoEf33xBDtra\/r4trZax3YdO7Zv01EzkNqaKtRW69gu2Irt27bi\n1o1rKF6\/VpdmH59\/GyUok0pbiT7BuJiYD8bZllN9glIfHxgvqI\/gyxeP3zlZ+nQFir+SC0qWvqJ4\nWeQfC+pTzAxKsKx4\/R8KVmSr8ORYKJ4Sz46\/4mZD8hvXRkydiikhITh98hiajhz6MIIbigrx689v\nT7EmNhabVqiFIFPxdQDq8kPwlAQ7DyUhjGQC\/f3hMWkSHCdO7OPwwb1obDggnuRBp5gF73Z3viGm\njY9HglaL76vD8bgpBK3bVNhbloKalf5orfTApW1ecHdzwyQXF7g6OcHZwaFPsKqyHEcb9g9OUCqR\ntHKdYsELrS1CLDwsDBHh4YiYNg1RERGIjorCmaopeHQ0BDuXO+F8lQ+qMkywK2sMzmx0xkQ7O9jZ\n2MBmwgRMsLKCjbU1nOztsWb1Chyt3w+fyZMHIejj0\/W64O61CnT+S43u\/cHoORiCe\/Uh6N0nwZ2a\n0dibZYrqr6yxKHw42qvs0FM7Wvy\/u3o0blZZ4vpmSzT90wVymQx5JNhIEeSTigIBT0\/PYcYIitXx\nQ3LhbItIa12BAh27VejaQ5J7leistkEXTd69bTQ2LzBBqtIUzaUeQuw2ifH\/u\/RybRUWOF7iAXVQ\nEPJzVooI8vii1EilikEJnqcIajUa7FijwNWdSlypoT1WbomrNGnHZgssDBtOD4ccOUkWOF9qgVt6\nsRtbLNFeaSGuu7TRHI1F7ghWqZCfu0oI+n4IwY0lRSLFifRAVK+S4VSpLU6vN0VriRkulpnj4AoT\nbFnmjcubxpLoMCzV2mJZwlgh1rbJApfLzcV1Z+n6wzmjEBocjILc1TpBfZkxTlBf5U+daMJ5SnE8\n7cGC2bpJjheY4FShKb4rMsO+5SYoWzQRpWkjUV\/ggNL541GYOoL2m6MQO1dqJq7j64\/lm4g6WJC3\nGndudoBPqkFH8FRzo6j8nI4szSfYlz0SDSTZtMYEJ9aaiGgunGaGjekjka01R\/mXrshLplRXS9FC\nYvw5X9dI1zesHoWw0FCsJcHbXe3wY0FC6uVlfARPHj+C40frMdndHTFTfDA3MRALUpTImKlG5uxQ\n7Fphhf3Zo1CRORFbvnHFunQ7NG3woWjaY8WiaCxJC8WiWcFYOEOFeUlBCFQoSDCHBK\/Bj+osR9DL\nGEEJR5BuPnnsMB1LBzHZwwMSKgs8qIJOByU9jSG0n8oXj0c9RSYrZhjWzhmHqkUjsDfXHrtz3ZCY\nmIhQSqlKqUQAiXGJ4UWvXZOD7k6dIKf5vQW9vb3dpPoNfKLpMAoL8gYIBvQTLJo\/FnXfjEBeijnW\nZ0zGnkI5jhSMR022C6b3EwzsJ5icmEAtVxvonUII+nh5Zb5femnTGp6w5saBgjygQi6HMjAQwWo1\n8maNwdaMYdi2eBiqM19RudQZiQkJYhEqWgwvihf3SvBqnyAFJNc4QRqsubEB6\/Jz4Ul7kFYqBvSn\ngYMCAqCmmpY1fTSK53yC0rmfYkP6pyhL1\/0uznAUtZMXEUSL4UXxvbzIpAQtbl6\/Cn+KKM8zKMHv\nTzeLPcMdibf+7ORUGdK8MMUf+UtC3uRrDeLj4kT0RHppUTwmn7\/TtRp0dVxBiEopnmKjBKV6wfs9\nt0Tdcnd1FWnuH0WemCU5kpxK3m8M\/82RE3IUaf9+0fPy9ESCJo4EL2PWjGSxYImxgnyY3++5KY4m\nN2dnEUWewLAXWXLx\/GBkpKkxn8pIOpWROYkKpMbL6HeAWADLGfYeZ4C3ijYuFp3tlzEzJUlUCqME\n9QUU9+52UXu0Ei6OjqK34wl4IpYMVsrw220NHrRMxcVqOc5UeKOFesGmEgecrZQgLlxXRgxyXEs5\nE5qYaNy4dgmpyUYK8tu+Yb\/03ukS\/Rv3cdx4TqIJWHLVEiXutMTiP0+S8dtNDerXueLKkWwc2hCL\nA4UTcG23HL2Ho\/BtWfQAOR4jNipSCM6Ynij2IM21873fiYUgpbP3Tqfo37gT7pOkSFYWhODZpVj8\n72WqEDyY74Jzu7SozbJC6\/50Ifj0dAIatkbCk7aGQY4765jICFxvu4gUKjciU9QcGy34w+0b+GLe\n3L52nSU53RVr1Pi9J7lPcF+eM87UzcfhypmoL3HrE6zfEgE3WpALyfG9PIa\/zBcdVy8gOUEDfq0Y\nlGBP9w3ER0cNeOlhyvNUAwT35DihtyUTjSVOqF5uLwQfNMWifvO0Ae8jBlgwSTtIwQB6Snu6ryPu\nLYJKuSu+TJvUtwcv1EXj4oHFOFqpwXd106ix9cOhIhVcHW3euJdpv3IeaTNTRW3kFzSjBHkT373V\n8VZBA8sXTMKSZCdkxNtjQYwt0iOtMXvaOMyPtkWg1OWd9127fA55q7IHL8iNZVx05DsnMhYWzF2Z\nbVyKfX19+wm2i+aS2yOGuxCGz1KGjyyGCy\/D5YPhp\/R62wWx1zqunhcpbb9yTogxbZda+wTf+xsu\nDjkLhgWrsY7OYW4wuQs2wO8UBXS6GMjPWSXe1AxwYefayeStMpAtYCkDhofkvb\/+EIL694WPjZ++\no3kvwRA\/j65YhRMyw+2xeIod1FI3qHzdPyhpoW7IirDHbLUD1DIPpKus\/\/zLe5rSqpVueDRPPQGz\nAqwwXT7u95kB469ofT+H5jVmKMZ1zPAfd\/1tzAoc\/yJNaY3+0P+ezwmyurss0gE8PjM3yKprdqCV\n259xG0p8RlgTDgTf5M1f+o83GzpP7WoOpYs5ApzM4O9gCi+bkU94PcQ84gsig1ikZ6G12T\/KIr0+\nQ4zPGMRJxoAXGDHZso0+m0oEEwHcmxCehDNhS4wlRhJ\/eV1umP5DO8KV8GIxQs0DhrlbNifJxyFB\nNhYa6ediQner4c30WT5RTGwiqoldxA5iC1EmsR31Xz97E\/g7miLQ2QwqWuDQv\/91AX2mJaKIUCJQ\nL+pOOPaT\/Nv\/AeNTz8rQlApkAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/trophy_music_b_brown-1345593755.swf",
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
	"trophy",
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "examine"
};
itemDef.keys_in_pack = {
	"r"	: "drop"
};

log.info("trophy_music_b_brown.js LOADED");

// generated ok 2012-08-21 17:02:35
