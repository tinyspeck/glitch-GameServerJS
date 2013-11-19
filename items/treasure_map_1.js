//#include include/takeable.js

var label = "Treasure Map";
var version = "1344715080";
var name_single = "Treasure Map";
var name_plural = "";
var article = "a";
var description = "A map to hidden treasure. Probably.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["treasure_map_1", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.read = { // defined by treasure_map_1
	"name"				: "read",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Examine the map",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		if (pc.getQuestStatus("treasure_map_1") == 'done'){
			self_msgs.push("You've already found the treasure. This map is pretty useless now.");
		}

		if (pc.getQuestStatus("treasure_map_1") == 'todo'){
			self_msgs.push("Follow the directions to find the treasure (open your quest log).");
		}

		if (pc.getQuestStatus("treasure_map_1") == 'none'){
			// effect does nothing in dry run: player/custom
		}


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

		if (pc.getQuestStatus("treasure_map_1") == 'done'){
			self_msgs.push("You've already found the treasure. This map is pretty useless now.");
		}

		if (pc.getQuestStatus("treasure_map_1") == 'todo'){
			self_msgs.push("Follow the directions to find the treasure (open your quest log).");
		}

		if (pc.getQuestStatus("treasure_map_1") == 'none'){
			pc.quests_offer('treasure_map_1', true);
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'read', 'read', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

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
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-17,"w":47,"h":21},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEnElEQVR42u2WXWhTZxjHiyCIIIow\nGIMyGQiFXuR2d+6iu\/GmIoxdDbtdDMZWyibDTZhOnR\/dCrFzVmVVZ2dZW2ZjsevWEbBu6pY0NjbW\ntGma5uvk65zknJzkJGnSwLP3eXfe7CT9SuL6cZEHHpIc3rzv7\/yfr7eurmY1q9nG2rjT1zwxH3x1\nywJOegJu86zHuiXhpCzoJlx+IIBgcngMFpe4e0sBzvFyG8Ix33KQU76IFcFmggLMhmMw5QuD1cVZ\nMS83Hc4dTTTbvEHg4mmIpHJFHkougEdMSj4pdZOsO7LhqnKSonvuD0thJbsEbiUna++HU7mbQmbx\nwLrCiQC7ZwKCm8HNcSF4+mwKfNF42bAF4HSuTVzIH0xm828lk\/DSC8NhqNxR2YohxENM42boPPkp\n3L7aCXanay0gCCYyBWfPeeJSZvHF2xSGJqzkJLaxyWyGM60tYOj7EaZmncAURTURfDlIT1SG+YhY\ncDcvQYS87J17I2+TI1DBnVXBRVKLJ0sPM\/7+K1zr+Aq62k9Rv3jqMxgeGoQZLweWSRsFQCAvcaYY\nvkQRIHGL3dFDjmgk3kB8V2VgSu4I2dTNoDDfbly8AAO3vi+A4uHPZl3Q3fk1DPb30k8G2Herm\/7G\n7wySi6fobx8B9\/HS9BtNTa+rcDsqCifZzLpc3iAc5tvd\/tvw5x8PKDQ+90tKQRkGhcqOPRgrPEc4\nlnexVFZu1397WFVvT9lwWFnaUGKe4OaPTSY48cE7cJrkHT5HyCsXThSpiS\/kCvFgc8zR9UxJrfNk\nDcJ1\/Af3ctntI5LKGkpzjdMow3xkeAi69eeogrgGQb859mFRJaNaHiFe9D9OTGLFwvWe3hYVrr48\n1VL5Zsw1H9mAbYbJbRwdoQf\/bbEQVZxLQBH+uXOO5uXZtvcoKAt5wYliITkFYTlN4X4be3hchXuN\n+LYlMCYHpzM7\/QdwXpLhrp8OClatWn7Vn9pnwDDwE1w5\/wXcJa2k8\/TnFLIUdHjIAKO\/3Cs0a8xN\n\/K6FjBGwsuDQHFxEZ533Szjkn5CrEmu6y3mAvLUryNM8M5lN0HPtO+KXlijJetrQz31wp\/eHokaM\nHiU5p4GrXxGuMEsVRWfneGnc6V0VkA1+1mLOtL4LX37UQvtdaYUu59gHQ5KiLYhXykm57di19V1d\nhxyBCIc3knJmJ4YPQ2ezT8Pw4ACc\/fh9CrkSHCpaAlf2rN2rNsbGJtIk7d6A0YUjp4JBj9Xaf\/0y\ncBEBeKKwP5YogvPixSGRrq7PaVSsV\/\/caHz41\/FgPC1XAomKOtweEEnyxxfy9DNMqjUgJgh0hsE1\nVD1fVcPZtx8h244efdMfjZuj6cWK1MSpgIDMeWVBPtehP1zx+FrFtqndnKr5eGLyfCydk\/kqADVw\n+9as1Cpsu7oxVZMjaoqZPKwFGlNDrIHbu943+p0M1DAy2iooGQ7zS1hFPYHAtesvHfq\/QlpRfmKl\nP7E7LmPYcRoI6X\/Boml6E6ZN+OqNnoNqBDbFEHSfFpTlHAI+mrB9sh75Vm3osZgaMPSeIG+8\/8h0\nbDOVW63qd6mTYUddzWpWs421fwCbU0dQI69YDQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/treasure_map_1-1344715092.swf",
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
	"no_trade",
	"no_auction"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"x"	: "read",
	"g"	: "give"
};

log.info("treasure_map_1.js LOADED");

// generated ok 2012-08-11 12:58:00
