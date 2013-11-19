//#include include/takeable.js

var label = "Green Element";
var version = "1351724929";
var name_single = "Green Element";
var name_plural = "Green Elements";
var article = "a";
var description = "An element is the basic building block of all stuff. This one is green.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5000;
var base_cost = 0.5;
var input_for = [146,148,149,150,151,152,154,157,158,159,160,161,174,175,315,316];
var parent_classes = ["element_green", "element_base", "takeable"];
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGm0lEQVR42uWYiW+TdRjH\/Qvc0WPd\n2tLdF7sXiIAyQI1y6HAIiqDjEhTUCRGFoFYRQ7ubycaAuXKJqMDEk4hQgQAiQg1hw8Hou7bbgG3s\nhR0YEpKvz\/OulTG29gUiI9rkyfa27\/H5fZ\/n9xzvAw\/8Xz75TU2GQpcrg+3+g2toyM53Oq0ewAKX\ny1jQ0JB8X8BJQE6naGpr87sJ2uXK6f3dwKjndAqsWO\/vGY4hBwys1OHIWdfaaiu\/dAnlFy\/26c6+\nwO8lICovX8ama9dQ0dpq7ROQ4nDANs2qs2fF8qYmrGtuRpnLVdXfeQOmYn5dnVh45gyK6+psBbW1\n\/e7YXAqFAQHMIxfn1tcj14cLzQ5HNufIvlzf02SnJc5plDYsnNd6mY0MefX1FrIihjMJgujzfna7\nwSwIRWa6hq8rcDiMeU5nZm9Ady61eQUtpAt7r\/YWl9HNcgXBYrbbYbLbxbnV71nGndRbnqrWWSf+\nqbc+c0ZvnVirt2bW6Ktmn55vWX72N4vp3Dk2PznieE1NDChHZVIuZ3HNdkw8PgqTT4fi9aZYLG1N\nwPttiVguJuIDsoUXYjG1LgwTTurFOacW22QnfW+bilcg50ZTjs4yjjqkxfS6SCxrS8KHYgrM7ako\n7kzD6qtpKOlKQ35HKj6+kiJBjrXpMOaItuiuFZSTt4buViePsIaI404Y8GZzAimXCKOYBFN7ClZ1\npWLtX+kovZqOPAJccTkFS1oSMbHagMeOajFyv8arABz7PssjneR1pUN+DLYRIGY4YvHahcF4iyDf\nvZSIjy4nkWopKCbIws4UrLySBCO5fAm5fkFjHB6VAEPE4XuDDf2Fl6ycyZukP8ikXZpsAkTGQR1m\nOmMxrzEeOecHYzFBLrvUHX8rCJRhJbiWBCy8GI8FTXF48nc9HvklBEN\/0lj68hxnCvkdCu\/mPuIx\naYfalv69RgKcJkRjliMG81yxeIMAFl6IJ9B4vNM6GG+3kLIXGT4O80m9ObSYJ44Nwoh9IRiyOxjp\newL8esJRThVuuz2TApaSrOc4bIu\/IWF7EFK\/0WD4Pi0mn43CC+eikS3E4GVHNF5xxRBMDLkzVrJX\nG2Iwl8Bm1sfgRXs0Rh\/S4aE9BEcLnHJwURWnHUpTyZRPxZ7PuT1IupArAd9oxpECS9wXQUiq0kgP\nGX8yDFmnI\/BcbSSm1UXhpXNRmCFEYSbBzLBHIpuOp9P3U89EIqsmDMP3dqvHC5x6cClWUonkRG++\nU7h\/EjNVDgK0hlYqM6I\/U2PwV0FI2aXBMFKRITNPhSOrOgKTasIpJ4ZjitueJZtUE4Gn6ZyRB3QY\nSnBp32qQtDMIzx9YClJQqkR3Vat7Kjjn8HprxEY1Yj9Xg10tQf6sxePHDBh7IhTjbKGY8McNG0\/H\nHHfD3XHngYsnL2TtWySyglQCpXpe3Nho7a+nlB2DWXuXGUI\/VSFy0w3I5K81SCN3j9ivoxjTY8yv\nZEf0GH1Yh4f3ayXVOBzYrR449kJopSLTHYNCGbVrW65fR+WVK17btlu3fR+7WFuuEDyQMVvJ3V8G\nIXFnNyhDpH1H8ek2VoxV5pjlxcRtC0LUFjXCN6gQXOEv5UL2THlzs7ihsxMVbW0oczp9A3qbJTSl\ngUZduRKGChUiNqqkB7Ka8QSaQLGZuOOGMRTHK4PxYnhRYZUq6Ncqb8p3pFpG+fnzKHW5UEg1XpZr\n+\/stwBTgpy4JFLVrlBi0XkWucoNuVkuuYxCP8TEvgMHCLSppUbq1SmjKlBn9FQgewLyWOv7RV0fj\nX+ifqV6lQPBqJRhUv65bUYYNIxCG4b+sFocDL4TBQsqUUJUEei2jXOq8NiwMJ2eWTd88IUdbYgCD\nalYTbGk3rJbcr3MbHzMULySoRAFlUaBRTpn1WvL6i70KunBdS0vGWtp51KxmcAO68PgP0BQNgqIg\nEMpCBVTFCgnYY3ysKlJAQb8N2zq5SHb28LaTpUahV0fBcBs6OsQNXV3gKY7zFucvE3fUlGxHbptt\n8TMFWP3NgfDP7WGmAOFBc6Bx6cnDRXReldRVC0Kmr07KZ02WGoXu+UOaRYrpf0t7OywdHeDdxsMS\nzRcCQdpYTV+K0HlGTieeAYrnEppJLNL7m94mt2GQNotnoCHgsoYGcU1jIz4hJfLcm4hAjXLKFJfK\nARk7ebX08CpfCx0wQLeKNh+1PMfXlPjvqkhB7S1v8Ywx4G9VeUPdTj2\/9yq6d+AdTWj38CWmtada\nDHdfvatmpXq+z5H7huI\/8fkbtVBJWdStWhgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-05\/1273133939-9149.swf",
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

log.info("element_green.js LOADED");

// generated ok 2012-10-31 16:08:49 by martlume
