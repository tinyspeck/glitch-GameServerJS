//#include include/takeable.js

var label = "Red Element";
var version = "1351724923";
var name_single = "Red Element";
var name_plural = "Red Elements";
var article = "a";
var description = "An element is the basic building block of all stuff. This one is red.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5000;
var base_cost = 0.2;
var input_for = [146,147,148,149,150,151,152,153,154,156,158,159,161,174,175,316,317,318];
var parent_classes = ["element_red", "element_base", "takeable"];
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

verbs.disperse = { // defined by element_base
	"name"				: "disperse",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Elements will be destroyed",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Those elements done gone back to the universe.");
		// effect does nothing in dry run: item/destroy
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

		self_msgs.push("Those elements done gone back to the universe.");
		this.apiDelete();
		var xp = pc.stats_add_xp(msg.count / 20, false, {'verb':'disperse', 'class_id':this.class_tsid});
self_msgs.push("(+"+xp+" iMG)");

		var pre_msg = this.buildVerbMessage(msg.count, 'disperse', 'dispersed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function canDrop(pc, drop_stack){ // defined by element_base
	return {ok: 0};
}

function canPickup(pc, drop_stack){ // defined by element_base
	return {ok: 0};
}

// global block from element_base
this.is_element = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be obtained by grinding chunks of rock in a <a href=\"\/items\/427\/\" glitch=\"item|ore_grinder\">Grinder<\/a>"]);
	if (pc && !pc.skills_has("refining_1")) out.push([2, "You need to learn <a href=\"\/skills\/54\/\" glitch=\"skill|refining_1\">Refining I<\/a> to use a <a href=\"\/items\/427\/\" glitch=\"item|ore_grinder\">Grinder<\/a>."]);
	return out;
}

var tags = [
	"element",
	"no_rube",
	"no_auction",
	"no_vendor",
	"alchemy"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-21,"y":-46,"w":41,"h":46},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF00lEQVR42uVYa1MTVxj2H\/AT+OgF\nIckCuZNAghYRTYPcCSQRBatTGfuhM53pTH6C48d+Sqf9YCtaCkgHL9OIjrU6lXirbRUMgiAEyBoC\ngUDo03MOu3FNybJabZw2M88wJLtnn33e933e95wtW\/4vH\/S35aLXa2W41J7zXpFLnve6k72egEhw\nrc\/TmezxOt4PcoQIIcenq0ZJou+gKrthJaRWez0hquBGv5PfTmaN3PQ3TtX8hbZAYvAoYhe91o2u\noSpmjeDUaWcgdukQEj8dx4sBjz9T4WRS951\/nvkrQzNn6zDX04zwmQP+TNcRFX1ZIbjS0wr+9AGE\nv3YEIl+U5\/yrBF\/xtDSIxZHs84BCrNRfdxt9N4p2MNzU5KWql90nXEPvE22IEpeCpsKm\/ilUpZ9W\nX\/oC9DvqdbRqCYKMILEXdt9nJ6zRI634uXgHbmnzcKt4Z0BKkFzbLa5LbSmdiCgI\/V3WmpR6FzNi\nQcHkWU9g7XhbGCc6MOLYhV+0+bity8foERslFKQPpeSUeqps5SvNFxYSQo4p+3lLd\/IjN9aOebB6\noh13TRzu6FW4b+UwUliY8zrrCuH3vTWCK6dcnYlDzVhpd2GVhHjtqAfh5mrc06tx36DBAwN3UjBs\nv8J1O2VtiYZXSQ+lOUUJxo\/Wh5a9DUi0NSHWWovVjhYkOw9jeJcZD40cfjMW4rGhmKmiZIBg\/Xyz\n61iibnIRXShxqgmLrhrECbGZmn14YDEhcagJK4ddiBFVfyfkHpmKENpr4mkuig4gGxUlps7cnygk\n+xJdrcF5lxOxRicWmg9gSKfFTY7DVHUVlg82kpC3IFxThWGzFiMEvG8\/5EiygWOTZ\/4tWTfKG0qe\nfj\/\/8YehF0S1+ToHRnaV4ganYbitK+aXPPVgYSc5OWo1YrREj7FyE1a6WljV0\/ulEaJpxci\/7gxJ\n5ZaSFEnPeysdEcce8M5KhPdX4Dqnfgm12kHC7ou31mHJ04Bocw3GLAY8sxgRbrQF2eQj+CdTbf0Z\noTcey0SS9K\/oT+E95aHZqt2Y21eB24ZiXONUDFc1KmbOqK3NiTVX8\/GWWiyT4pkh105aTXhuNYNv\nr3CnTD6tE735QLreBVgIpstLfdO7bQhXlGPEVoJBroDhiqaAv67Znives9DodC80VbMiWnQ3YKq0\nBGEGS1AoxJcklVSubEWTN6RY+rIpOFlm4Z\/brZgkuFakwo9cPq4Q3DVwwadmvW\/covdNWIwMs3uJ\nykS9CFF67gM7ZsusiNhKsfDJ\/pAQ6m6R5NKFg8HogKczcq4697XJpcYrsyEwQaxkkigxZCjEZW4n\nw5COY3k2TvJsghSFGM7pdcUIMQvmCDmekHthK0O00o5ER5VKtKv4hTb8GfwU8StHMHuuIaA496SW\nMKYrcowZdBg3GTBs1OEil8cwWJRPiK0XgUhMDOeMQCwiErOXYd5uw0K5HYt2e7c4nET73cHFQAei\nA15MfVsTUOSD0oZN+2mokONHtcV4qtfiKiE1wO1gGNJz+MOkxWOTjngehR5PSgwIEYwS0k8Jxojq\n4xYzeQkzUbiEvEgJnhNlH5IOQ9efOeO0hs\/WB2bO1AZjXXU+Rf1Q+n8oP9\/xRKMGIYk7hSr8wG1\/\nK+iXFJV0AyZbMKyLbNCLHxcUhB6pC8jC23D+LaCf2+bLlFqy41amXjicl+ceVG9HL7f1H6NHszUk\nNzDTwpEvjg0kjvQ35Ub7W33z39U7hOn6FbNNtTASgdRJw7qNdKd3JAXu4d905JfaC3+uXhW\/eoxP\n3DgOvs8FulmSmCwvN\/0IvVvcKvjZxC68RMaJftN9CZ0JyYIpE+1pwcLlw6BWMNfdiOXvXRAeGFQy\nHrE9iLjZImsLEfCn73kUkct4ikD8KdxVi4mv9qbCSBdUcrSRteMPIXxBJduDrB1\/sCFCJqeUbiHe\n6bmgnEJZVU9qCxslN\/O0bB0cKdnDvBfqSclIq5UZfrZPVzMcWzBPkyuc\/9znLzOsdIsCEpfgAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-05\/1273133969-3084.swf",
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
	"element",
	"no_rube",
	"no_auction",
	"no_vendor",
	"alchemy"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "disperse"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "disperse",
	"g"	: "give"
};

log.info("element_red.js LOADED");

// generated ok 2012-10-31 16:08:43 by martlume
