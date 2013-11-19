//#include include/takeable.js

var label = "Thought";
var version = "1337965215";
var name_single = "Thought";
var name_plural = "Thoughts";
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
var parent_classes = ["mental_thought", "mental_item_base", "takeable"];
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
		'position': {"x":-21,"y":-41,"w":41,"h":41},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIuklEQVR42s2YCVNU2RXH\/QZ8BD4C\nk1QllVQqgk7KLGWFxEqqplwnjmZGAwMzU2NGY4IsssiWAS1kaZpFAWGgUSJKN9AN9ACNQLM2q7SN\nICJLA42g4NTJ+184z9vNa5hMUpV5Vae633p\/73+We+7bt+97uLmdn4QuOCP1L8bDzf+zh7avuENt\nywtRnSvuU98RKhhQS5N\/cy8\/jSa36wty9pyzfycYx+Z68MibTcPImw1z98sV89g3m1Edy4s0tPma\n8OvYWHfjmj2f03E2uLD4cNSt20ecc08SaG0+n9bmcmh56grNjX9MHeaT+v8YrtvjCQbI8JsN6l1b\npe7VFRr9ZpPsLz3iF8dw3rHxesfbd9JiQN9cd7CiVsTCRKRzrDeMHjyIoBdPi+i5K5s8M6m06PxU\nsUga7foztdUf29sbHR53MJtw5dK8of\/VSxp8va4a4NqXFujRips6PUvCbMq+cq25XfwuUK2jyZxX\ndcmNwReffKaoFKOolUUj\/SlUaThLKRmHqM1yUsBBPVvDSeo0\/THAL1j5484A05PH7pYXM8SDaBlD\n2TTOdSxOk2O2ke5bYigh7QAlZ\/yCJoc\/p9VnCeSZvkpLk5fJ+OCoOMdWWhpKpcWhlH39l7vHn6HX\nHmHos1Pr4tyeYFAQLoe727f3B57byNV\/XihSVPxbup79Gyq78x5ZzWeEgkJJxWZGwqmg6LAKGJO0\nn86e\/wGd\/uid3eOvvLPDDkCTa0ITDvHGhn24GpBdq8viv60lktpMJ+jZcJiiyu8o7fohSkw\/SKmZ\n75Jr4LwKyDbQcYYqvzpCCYkhlJgQQtlZv4raFfBOR7sTgNX9PeTrZigHMAGyfQzJgWNIkN6FEQHX\n3fS+iCcxsOTGHN2vdwDKsYd7+22ng3YFLLJa0gHI9vDxqOpulBLAcCbD8J8BrcM1YiCoh4G7vv6T\nFyAM0L6AInMVuFbjceeucLZVd1B+ff2piu5HAu7+iIMap1xeKiLeGEqUF2W\/e9lNLTPT1NRze0uF\n1tNCFQyeefPQDkgoiRj0VU8BNPiFU2AMhc0WulFzl7If1lJZRxvVOcc1E8W27W65tCAehbJP7ovB\nMOjsaLimijDEpMV0jAbaPhDXwxqaY7UTRNdg0mfeNahwrCDMV0EtQ32E9a1vxWNH2yUxIFwHlXxj\nke1K\/M\/pg4\/eUa1xanznHJyYnR0QX1TgZrjKni6SYxAqIkMHXq2pBRoQjo1XaqHGf8QgZ3S7LdoL\nEIZiDNUYLi45mD4M+6EKd+HSfjI6x3YqqCgXlVxaItQraf9aBUMWW549FQAyFCcKJwv2hZJKIrXO\nzVLtyBBV3vu7ABxsPyNqIscjygzUFPVPKSuXL\/9MGMpL+s0wisnL2RmDN2qqDddKbglAWTnZtQwI\nN\/Kcy5CIQVyDl5Hvt\/aVqbHFpYezG+DyOVhuaSxlVFdRy9xzZ\/f6YqAKGJ2bGxqTl0v\/rKzwci\/K\nCwNybPkaFJSnOlldUS\/n+70g4HItOFhmcTIlFBVS0\/Np4vlf3WJyc\/TxhQWkN9eL7GVQLtS27fIi\nNwpQU3WvZDz9MWTzgEETyNcAB6EwpleCROfm2NnFbLp6oxqHWlPejuZAAeWSwy+EpEKNrOyy0q2K\ny\/SwJYPMzVeoyXKRrA1\/EWYcslHT1CTVK4lYNz5K+Y31ohN66968XHNqeZkXHJu\/ePQ1nv68XKso\nDGjTxBjlN5ioyt5Fne4Fcc42\/0I80zTWR0NK0sn3bb3gNmBcXl7g1QK9Jtzt1hahHsAQi3jgvcE+\noSZMLuA8F2tBPlIgMcswML9Q55Jy3LMswkS+h8vWlnr5OcFcXmTjUiNDAFYuP9b52T0BucvmeESi\nyTHL4YBjAMO1tu3w6Hv1MtQvoJzJmIthvF8zNOC3w9EyrXOopbZd4hmTAtY6IkGSbhX7VZDVYkgR\nh+558aZ4iDwvy1nrC8g11FdZ+QW5M2LFx2hzq8zE6PLsPAez3az9lzoXa7kTA7J75EbW4RPwXCO1\nVJQBuTPfevaaYYTobT8INyNRUKRlSLlhgHoyIMNpLQl8Oxy5RZNVwgv53ts0O63dSUfn5USgQAIU\nJQfTjZzNgKwdG\/YqNZjWAK4FiWM8h2u1aYBFwmC\/YdIpZg5cXzPY77\/Vb26IcGbdThCVPFaXR1wb\noSLcLGexr6EMyeUH5QgDa8GheMP1CAe8iNezlMWaJlxcysFAS91RdcpJK0yn9IpyEYu4EW+Ih2FQ\nDM4PZPVwHuoiw9VGQYpb3xDgcuLVXPTa3VjuagImpoVEGGvfoynHx5R\/J464ccg1PtwxiwCKQeB2\nwPE5qOfbZMiG8sQvJT+nZnhQ7xcOW3xaiL288iyNO+IFHAz1kQGhGkDYuC4yIAzqcp30V9\/wHBju\nlzyRvusiaXHis0AsauxdSdRq\/VwFhH1Z9dWO7poNsenvHADgPobnhNK6ttLRHbjXp6+Iutpj5BrN\nEu14kj5DBYzL11GGoVJ0NsXWZmGY+HUNRrXb8WdQkgu8HJto5TAR4LfC\/ihqzw9ECxOR5kVXNFks\nF8Q64WrmaS8VZUMZgqpyO6apiqKsnMVIGBwvtjYRTwrX71U7s02mgD0Blfbb7ZlJpvaWMHUxoy84\nTJ1Key43k\/G6LPLX+fgaw7OCUOvmg\/uUUFxI3Hdm1NQE7QmH8uIaDCfPs0RlnfCJ19Iw8doBulf+\nB6\/1AlRE1y0XciiCjE+vrHDjHCDk81BcSTh7nF6XzjU2paTk232JVbL31N3qk+R2\/VVdGlrrj9OF\niz9Rl4Ix0fupquT31Fz3vqiPWq5HR47GA8sG3+NY76jLCp0uCPatv5gmpIbo8wuPCOWwLOTFjOX+\nUbrx5SE6F\/52zRr56Y\/cKUnvmv+Rej4qVperGuZyr+WDsg\/D\/\/\/64\/dozzl7YupBirzwY7qWdECA\nsUvxEafNeELfbjweYWs8HrTv\/7GN2z+k6rIj9MXFnzrx0TA2dv+pVuOJ4H3fk+3f9tiRLfA+U3IA\nAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-08\/mental_thought-1312587422.swf",
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

log.info("mental_thought.js LOADED");

// generated ok 2012-05-25 10:00:15 by eric
