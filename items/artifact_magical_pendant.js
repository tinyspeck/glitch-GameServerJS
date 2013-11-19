//#include include/takeable.js

var label = "Magical Pendant";
var version = "1351130300";
var name_single = "Magical Pendant";
var name_plural = "Magical Pendants";
var article = "a";
var description = "A high priestess of Grendaline once bestowed this piece of jewelry, known as the ‘Kommangerrit Neckpiece” to Helen, having observed that her low confidence was stalling her romantic life. Helen, who became the most desirable girl in Groddle, and believed it to have magical properties, though under duress, the priestess would admit that the vaguely suggestive shape and beer-scented pheromones sprinkled on it might have been more responsible.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["artifact_magical_pendant", "takeable"];
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
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-29,"y":-22,"w":58,"h":24},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGvklEQVR42u1Y6VNTVxTPf0A7UwVF\nTeBDWzutMQSEhEASCIEgkh1MQEIEgsoSRAEtYMBdFoOorQgSBRFFFqlbWeRZq1atTqzVVsfa12Xa\nfuiM72Nn+uX0nktD1Wps69J2JmfmN5P35r17f2e5v3NeeLyABSxgAQvYczGp6BV+9PxgZ9yCEI9C\nEsokxc1iNMrZTJpqjkufKtAaUsP4\/wqxBOkMvlQc4omJCIaYiOkeieg1+YMgpLXREdPc8dEz2ITY\nUC41YY5Hrw4TvhRyeo1AHhsZzEWLpnsxgk97foFoulAaGexdlMQHjOoLJYcpk4iDWUzr33lPLH41\niDjlVsXN4pSxoV4sh0RZKC0HHwyp4S6zKjzomQjGSULkGBH8PdKfYRvtN7FlDiFGh25i1IQP+dsE\niT5aDj6gA7oUAfPMJOnhIClLVwvAuDAMMrXhLMK++A3WF4l\/um56ksBp1AienB3uTrOQwMXdaXTf\nv93I\/nxrG3x3tc4vPj1dyo0esnETA7nMcKdda9CEsc\/iPGbhz8Tubpdztxs9P93YxN06WwXHOu3g\nrksDpi8Punda4NJXw9B\/8yBsbi+G2lIFRWO1Gjq3mGGsrQDGd2fCmd4cuDFeDncv1sBE\/wr2wI4M\nF0bTl8K\/KjkGTbh76uL+1038n29tHcKFB9st8G5xHGQbhGDPiABz2ttw5fQqaGpaDNtGGilquqqg\nqYYQa9LCni1pcNwUByMpEhhIjIKTrVa4eqqYEr14zAFfnK2AtgYDS2TIFSMKZmKjQkCXLBh6+kH8\nvUQwnRgxXGxNkQyy9PNgdWEsrC2SeSuXyVwl9ih5R5OZuzG+GtoImbqVCti5QUPJIVpcKVCnfAfW\nyyexf4MR2Mu1sGWNCpYYhXB4twk+HsiDH7zrPT5R16oFrFoZ6lcPUeR59+9tDUJyZ\/tyoTg3mkRM\nhOTc1UXSh9JQUyIfGuzIpRsdfd8MvbuM0NNqoBhoy4D+Niuc7rbDaG8+HN1jgZpSOY1+lm4e58iK\nhMGObMA9vrlS65msL4EzRTHH5o8gkSA3j7vd5Lx8fDkMtWdCjmk+FFojHyugtcUyYXuDkfOOOGnK\nMNr4HpYEoqNRCxtXJ1BiiNKlMVCUG+12mMVBZflS16ZKNeC76CBmDEVeFT\/L7ymXioOHeN9erWOw\nVppr1UA8dft7AQ\/PxBE77GvQQpdbT5yyUqJ7ty2CxenvTJIrkTPVJfGe6tK4hxwl99x40nGv8cM5\nzqcR1CTOccbMn2bj3btUw5w+kEVSlMH6k5w7F2pcndsroLLIC3tbfgHP7l9hVWEzjB7Ko87pkub6\nde72hWotRhAJ9uzQa7EnK6UzH5st7NXYXVDMeV0tZm6sZwkc77TAxOFs4VifOQil5vtrda7PRsuY\n62NlXFeLCRxWMZgXrgNL+k0KR9Zd0Cfvg3Urk+DKiRVciV0k9zcE\/Hh9I83UwJ4MWJgQ7pVFhTBP\nIrdIxed8XYqXmf6299QBK5w\/VkzrA+sKi\/nAdh1sqkiEdU4FiVAybK5KBJWsEpSS9ikkxu6CYlsU\nnBvIh+3rVIDyMTnVBEN8zAxIU\/Ephvfb6bpIsMASAZLIGe4nyYo2WQCKmNA\/Do8h5S1X1QoZfLBv\nMY3isQ4LMKTOjhBpaK1PhXZSXz452bo2DYpsJorSpRlQX66j9\/vbMqlzmAGUEJ8g9+xe4jk3OOkw\nknMujQbZAv5DpYT91pgisOlSwlh1\/GwOezzv0QccWVFelJjOZgM9obggSkfvLhOcOZxLiU\/KinGK\nrA\/dLQbS4lbSEzreu4S5NFyovXGm3E3SzmLUkDgqRD6J3MKE10GjFNBBwqgJY\/QpYUBqETSK2UPS\nyBAXrbnHWZ5VxEeSKwuksJWIa997JkqK6SsA5mg+aWVJtDOM9uSQLpNNUroMvvyoEm5OrIbPJyrg\n2kg5fDK8DM4PFtDnOpvS4cPuHOhoSIf1RHp0yXNBp57LqWR8Bscr7CY43OKo9lfmyCnDroFS0Vo\/\n2SVO7rdCV4seDu4wwPA+Cy0DT7MWxnrzSAmQ3nuIRNeTTYkfIoI92pNLn921IZWkMwYKs6OoturU\nb3owCM9lEK1yiINa6zRushF7wmOFhneTqL7VlyspcYRPjH1YWxRHW2NZngSW5yygxAqzIllHltj2\n3Ig9zrqb9cINFYlOFNn6VUoiwDLSh+UcirEPy23RTJ4lgs0xzSPSE+Uh5JyF2aKX883xqKF2oYQs\nUs2eEljspwppKPd3R\/8XYnjK8AOJqDwkxc8ChWQmkGsOJeU\/9Q384PdD4B+BgAUsYP9z+w3yeSN4\n6LiqXAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/artifact_magical_pendant-1348197747.swf",
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
	"collectible",
	"artifact",
	"no_rube",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give"
};

log.info("artifact_magical_pendant.js LOADED");

// generated ok 2012-10-24 18:58:20 by martlume
