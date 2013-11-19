//#include include/drink.js, include/takeable.js

var label = "Bubble Tea";
var version = "1338854810";
var name_single = "Bubble Tea";
var name_plural = "Bubble Teas";
var article = "a";
var description = "A super-frothy bubble tea.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 24;
var base_cost = 172;
var input_for = [];
var parent_classes = ["bubble_tea", "drink", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"drink_mood"	: "30",	// defined by drink (overridden by bubble_tea)
	"drink_energy"	: "10",	// defined by drink (overridden by bubble_tea)
	"drink_xp"	: "10"	// defined by drink (overridden by bubble_tea)
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

verbs.drink = { // defined by bubble_tea
	"name"				: "drink",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Gives $mood mood, $energy energy, $xp iMG. Grants 'Bubble-Enhanced Meditation'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		return this.parent_verb_drink_drink_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;

		if (this.parent_verb_drink_drink){
			var success = this.parent_verb_drink_drink(pc, msg);
			failed = success ? 0 : 1;
		}
		if (failed != true){
			pc.buffs_apply("bubble_enhanced_meditation");
		}

		return failed ? false : true;
	}
};

function parent_verb_drink_drink(pc, msg, suppress_activity){
	return this.drink_drink(pc, msg, suppress_activity);
};

function parent_verb_drink_drink_effects(pc){
	return this.drink_effects(pc);
};

function getDescExtras(pc){
	var out = [];

	// automatically generated buff information...
	out.push([2, "Drinking this will give you the Bubble-Enhanced Meditation buff (double reward when meditating)."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && !pc.skills_has("blending_1")) out.push([2, "You need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> to use a <a href=\"\/items\/7\/\" glitch=\"item|blender\">Blender<\/a>."]);
	if (pc && !(pc.skills_has("blending_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/67\/\" glitch=\"skill|blending_2\">Blending II<\/a>."]);
	return out;
}

var tags = [
	"drink"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-9,"y":-45,"w":18,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGwElEQVR42s2YSWwb1xnHBXRBUbRI\nDw1QoIdecih8KVqgQNuLg6BA26Q9xI6DNo5txU6Lto5Tx4mDJK6tQnZaO65txJZkapcjkZS4aMR9\n53A4C5cZDjkLKW4Sh6KW0LY4jlRLlh306xvHAnwwChSFRvqA\/+UBxPvx\/77\/W6at7X+sUG\/vU4b2\nN\/4ysvcoHjtwDqf\/eKGjbSeV\/fDxjoHf7Ads39sQPdgJ2J6jtR0FGD3w1m784HFgXusE6uA5cLx4\nDNp2WmmAVPsZSLx2ATwvnYCx51753g5z8ThOHnof2COXwf\/yu2D61YHdO83BDuLQSUgfuQjh352C\niReOHNqBffgWJA\/\/A2L7O8C1\/+2P0un07k3JsrwLAJ5+TF\/XDY7n+acLhcKfN4NCoqAEjp2tNRqN\nvz2ucrk8rCjKRzMzM921Wu14tVp9HoF+ZcsBWZal0EQv02+ekWktKO3nIfR6h6yN\/Tc1m82TyNnf\nbzmgJEmTyEUxNWSUqQ8uoT68BIFX3vvXk4A0JzUH8\/m8Ef0O05Z\/ywGRC6No8rNMNFbhHD5gnWFg\nJ72gjT9Ji4uLdgR8FukXugIS4RDLWxzADU4C32UCiTEGBfqTqkTfgELKBOWMFRTZK9yaF5WVVt3z\n+cbqHgT48y0HzEv8dTGJyQXOCbwdg\/SAFTLd48C6r0OW6AeRHkGARiiy41BIjEKznoJbjQwsVWOr\nKFwvbjkgGRyhWXwI8pwDeJcVUoMWyPRYgJs0AB\/rA5EagXzSCAWkmRwGS7UELFYpKLETq7o4mMTN\ndCaGINgp4ANmSAyYgLtuA87U\/whwGAGOQYmbgGpuEhZnSJjNB9WY47ykSw9m6KlgOedZLOX8Gzlq\nfIN29D5ITPVAOtCFAHtBIJG7aGmnU6Y7MjO2ICbtc3zcrMRdFwVdADnKKZQEv1IUcZVnMDXuGFph\nPaNLxZi1VOYnhWLGJuRT44JEjwrZ+JCQZSYUljAqpPeSPoC5pAs56JutSISaSzhV4sbgBtX1CWQM\n5s9nRZdQyWGPIM1Cjroh8LRZYfFRhQmNVHUB5BmHo5iZKlbluCqk3SppHl4nrg6ioKCeYxylmuQW\nKlkEyU0gF40CHzcqqeiIwoRv6AMopWwfFnlnsZqnVJH1qAn32Cr+ce\/DoFSjzlq94BdmRNQGyEU5\naRIysVElGR6oMlFjDW3WX95yQDHtPyMnjEK1QKkS51VZfOKOBsgabFByYZ82ikGhJrmEMm9\/uMya\ne4lQfyVJTH2qy20ml\/QckJNGoSLjTZnzqRnKpuJdff9O9pihYLbd+QLQLWiB0QATkUElFTIUUnFn\nVhdAQRB+qTlYliMLEutVOdKqEv39D+iuURCGLWsa4CxysJSxCzICjHt7GulIr5ikAi5dAFEffVNk\nJgqlnE\/RejBNjKtx09B6\/NrQw6Aosk+YyTkeJllKjIqE+1o9HTUIqUTssm6XViE5FZrmsKKQdKqJ\n6JhKTAzc\/SIoViiTWKkkRkoE6SkzUdNMImwopiKDBXRF+61ugFpQJLTMWQa7xUTGVMHVdT9y+T2I\n\/PMM1GW8Sldv3htKza9d8U3fcwU99WTMMlcqlb6tG2ClUvlhjh6TcuiUID19n8Wv7Aemux3c5\/ZC\n0Gm975Ca68bs0toV\/\/RanzN+m6WcJt0fTtqGjU4KMTp1VXV17gHv3\/cBbeuGTJLcwBKV+9eD8nqn\nNbfWZ\/U2tWDpDihn6R\/z8bFCOjJYDjuH7qa9ww9uNxfu1+vFFp4W705GuHsjzsjNQNg9vm3Pz0wi\n8Nd0wlMvlaRWhKQ\/E8RMS85zywwTW3a6Hctiyi1zHPfUtgFqjR8JOSoRkmp5Q\/5mFA\/cJshIyx\/y\ntrxe7GaGCZzc9kd8Iu69RvuvClI2PI\/2utshPLpCRLEFOjLMb6t7m6Vd41nKXp+fr62WS0IrGgsu\n8yn\/Ihkcvdy2UyoS8a+yaaqVShEtf9C1jIfsSwyD\/3rbwTAM+1ZXV9ePCNybCwYcKy43tmq1m1ZC\nju4Fi7nnhe37uoXjXwsEAs\/ZbLY\/9fX1tYd9Jr\/fcq4R9\/UshbGL80Hs46bVaj1tMBhe6u7ufgad\n31\/SFU5RlOG5ubn1UCh0zOl0tofD4dMkSWKbIgjCqI1vimGYo6hXv6MLoMti+a6YzQw3Gg2YnZ3l\nWJY9jCZvf5JQil9Hp8ipHJc+e\/qNwz\/QzcX3\/9D+ffeE8YNiPm9aWFg4j9w8hXTikd5B6kR\/AJsu\nyP3BKWvniVf3\/kz3Pty3a9dXX332p8\/YR\/oPBictH1Ih35XHFXbY3x2+euEn+57d9Y3\/Z57\/ABsr\npodF1uSRAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/bubble_tea-1334208227.swf",
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
	"drink"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "drink",
	"g"	: "give"
};

log.info("bubble_tea.js LOADED");

// generated ok 2012-06-04 17:06:50 by cal
