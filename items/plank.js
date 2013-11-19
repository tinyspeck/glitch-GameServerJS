//#include include/food.js, include/takeable.js

var label = "Plank";
var version = "1352505476";
var name_single = "Plank";
var name_plural = "Planks";
var article = "a";
var description = "A plain wooden plank with many uses.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 250;
var base_cost = 5;
var input_for = [27,177,178,179,205,206,213,220,253,259,263,303];
var parent_classes = ["plank", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"energy_factor"	: "0.4"	// defined by food (overridden by plank)
};

var instancePropsDef = {};

var verbs = {};

verbs.emote_splank = { // defined by plank
	"name"				: "splank",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: true,
	"sort_on"			: 50,
	"tooltip"			: "Smack someone",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.is_race) {
			return {state: 'disabled', reason: "That would be unsportspersonlike of you."};
		}
		else return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		//
		// get target player
		//

		var target = getPlayer(msg.object_pc_tsid);

		//
		// change stats
		//

		pc.metabolics_lose_energy(10);
		//target.metabolics_add_mood(10);

		pc.achievements_increment('players_splanked', target.tsid);

		//
		// send message to target player
		//

		var rsp = {
			type: 'vp_overlay',
			item_class: "plank",
			state: "emote_animation",
			duration: 10000,
			size: "225%",
			msg: linkifyPlayer(pc)+' splanked you!'
		};
		target.apiSendAnnouncement(rsp);
		target.announce_sound('SPLANK');

		self_msgs.push('Energy -10');


		var pre_msg = this.buildVerbMessage(msg.count, 'splank', 'splanked', failed, self_msgs, self_effects, they_effects, target);
		pc.sendActivity(pre_msg);

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

verbs.eat_bonus_img = { // defined by food
	"name"				: "Eat • Super Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_bonus_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "month");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat_img = { // defined by food
	"name"				: "Eat • Bonus iMG",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.getTooltip) { 
			return this.getTooltip(pc);
		}
		else {
			return this.food_eat_tooltip(pc);
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.specialConditions) { 
			return this.specialConditions(pc, "eat_img", drop_stack);
		}
		else { 
			return this.food_eat_conditions_img(pc, drop_stack, "day");
		}
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.verbs['eat'].handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.food_eat_tooltip(pc);
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.food_eat_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.food_eat_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.food_eat(pc, msg);
	}
};

function getDescExtras(pc){
	var out = [];
	out.push([2, "This can be harvested from a <a href=\"\/items\/742\/\" glitch=\"item|wood_tree\">Wood Tree<\/a>."]);
	return out;
}

var tags = [
	"basic_resource",
	"trantproduct",
	"nobag_trantproduct",
	"woodproduct"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-30,"y":-16,"w":59,"h":16},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAE90lEQVR42u2YTW8bVRiFs2CfDQt2\nhVL8lRTXM7Edd5NK3bBjxQYSDArEThsIICGTtJXbOLHHbhLni0gIgSUQFKKSVKVNqEpj2gQICCkL\nFiz7E7roD7jcM8m5fj1tWTCTdlNLI89cj3WfOee95752R8fT12N8\/fWZ3fnncqZvtZzo23CSjZ2l\nTPOa09P8YSIRfyJAfyyk4juLmdFbM8n6lSlrd2u+V+0sHVe\/1NPqypStrjs9ansho9aryd0Vx+48\nUBiocK1sZ3cWjzduz\/U21yZt9WOlxwX6bTHjnuPAOcYAC0iM6fvVZj3dPBCw6dPRQzeqKbU5m1aA\nwjsAbk6n3Oufasn\/hMQ17rtxMaV+XehtBA5YOxXbWvygW23PZ1wYTAZFAEBoL+TVsm0gOUbFb8+m\nRwMFdHLh0YunYurbswl3QkwC6wh5ayZlJgcMDl1zLiRrkmO4D9\/9eTqVDRgy+jUgr1eSRhFMhMUg\nF4W0F6pijJAcA+Raybq3Xkv2BQc4dLizmo\/erb\/X5VotbWNNAgSqSeUISbVl7QIy0JVdGY7YteGY\n+rIQf6C2MCnGECneEniYkqzdtUkr2PjRVpdg9XfFhAsDSGQdFwprEGMSCkCPhCzZa4HWYzUf25od\n6VKrJcvUICKECwXgGCM4S+BhkPyeVrIenNWDLx7RVt9f+vCoyTeoBktpLyCkuiwBPBBqlNDyQVZL\ndjZwqxtjcRMdiBu5CHAt65RZyR2GkFB8T0UNqffwQACLJzqecYajf8PqlfOWmYBqsr5wDWX5OWMI\nUFJJubIDayyqudBJvcuohdFuYyFUgmU4ZzDDVtpISKgISGYpoHEe+Mp28tFLsPrzj19uyz7Yi4kx\nIeB4zoN1CnW5LRoV3c+tXbRu\/q1+6\/nnqsPR+9Onu9Q3546ZxQEAvBMG4FQIILCekHggjLWr6NZw\nIyAVIxVYjXq8fMFy1WOLBXUwGUFwLiOG\/SLA8C5VxP135gLofopDoWe11a6KjB5CySzkYmEp4B3X\n+w2te2CcD8XPtud7\/cdPJRctYBsE5BeFuFGKQcyIweQEYQZKeLzLeoWigPSdkYidSi7yDxYMIL8v\nJtriA2Bye5PxQnj2kTIBWMu6PfMfP+Vc+BXd8biAaHDb8m2ytbsAgvHCRsILz7qU2Xp1yvYPqRfM\nJVqNBrfVtexNBBAZ3DyoKKComvfh9qz3mZGInYpeMLRadypt2cdGotUktMJbKs6H4TbJrNyz3iek\nVjFHq3GgNSMIdxmv\/VRRZiFU476Na8CZz0tWw98+nY\/+Tqvn3u9Wlyda+zUnki2YVFguLLmvswEx\nJeIHsjwUikirlz86+oClzEM2DrKZ8F6b3zL7yvIhfMUPslFazdZMHmwyJATGZBYSkqEP+Ju6Rhuf\nxNXcSHfTv9X7KmIrXHeSbZ2NBPBGjbQW96zrX5TLeqcqvRNV4wNh9xgbOOKvf\/Ra\/ameAL8KUUcS\nVC4e00vWUmp1wlYz+nvnsmEDNd4f2h17I5QtvHY4mJbMa\/VX48cMDEC5SLAANmfSaqVouVAGCEr1\nh+9qsOKZ1184FPhfJ16rcUAZ82Ner2oAnX870gY1PhC6NzbwUr3QHzr4v+68AQ6gWj6mnFzMA+WC\nNc68GX71sf+XWH43MqKbWxdwYjDitbAZaF39\/3qMbOjD1BUsPJC68mN1aTC88UQsfPp6xOtfn4vR\npoDz4icAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/plank-1334877138.swf",
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
itemDef.hasConditionalEmoteVerbs = 1;
itemDef.tags = [
	"basic_resource",
	"trantproduct",
	"nobag_trantproduct",
	"woodproduct"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"n"	: "splank"
};

log.info("plank.js LOADED");

// generated ok 2012-11-09 15:57:56 by lizg
