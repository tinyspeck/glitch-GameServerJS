//#include include/food.js, include/takeable.js

var label = "Cinnamon";
var version = "1354597543";
var name_single = "Cinnamon";
var name_plural = "Cinnamon";
var article = "a";
var description = "About a spoonful of versatile cinnamon.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 200;
var base_cost = 8;
var input_for = [31,62,195,226,326];
var parent_classes = ["cinnamon", "spice", "food", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "spices",	// defined by takeable (overridden by cinnamon)
	"energy_factor"	: "0.1"	// defined by food (overridden by cinnamon)
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

verbs.eat = { // defined by food
	"name"				: "eat",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 53,
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

verbs.pinch = { // defined by cinnamon
	"name"				: "pinch",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Examine the spice",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.achievements_has('spice_examiner')) return {state:null};
		if (pc.metabolics_get_energy() <= 3) {
			return {state: 'disabled', reason: "You don't have enough energy to do this."};
		}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("You've always wondered what recipes mean when they ask for \"a pinch of cinnamon.\" Now you know.");
		// effect does nothing in dry run: player/xp_give
		var val = 3;
		self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});

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

		self_msgs.push("You've always wondered what recipes mean when they ask for \"a pinch of cinnamon.\" Now you know.");
		var context = {'class_id':this.class_tsid, 'verb':'pinch'};
		var val = pc.stats_add_xp(1, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
		var val = pc.metabolics_lose_energy(3);
		if (val){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: val
			});
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'pinch', 'pinched', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

// global block from spice
this.is_spice = 1;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.checkItemsInBag("bag_spicerack", 1))) out.push([2, "Spices are much easier to manage if you have a <a href=\"\/items\/271\/\" glitch=\"item|bag_spicerack\">Spice Rack<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/289\/\" glitch=\"item|spice_mill\">Spice Mill<\/a>."]);
	return out;
}

var tags = [
	"spice"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-12,"w":37,"h":12},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAECElEQVR42u2W204bVxSGuajAzN57\nPLbH0DveoDQgwIHAgGNOxmcwYAg4cgiUtAo0EGigMIoaEkAcyyGhQMwpUZUoQe1Nq974EXgEP4If\n4e\/ek0KbyI2SqGlRNb+0NWPL4\/n8rbW2JyfHjBkzZsyYMfO\/yT23pehuPdWm+Jrk5+cGbIHDzNST\n5L0GCg4I3UMxdZliwk31\/xRs1pNjnW8kQw9DMpZbGN4EnHRT3KklJ+N1pPhfh1tqtmibQXqy4mOY\nbaK4z+HeBBzTCK6V5mKslmK0hurjpTnWjw627rUUrXil5JKX4GGQYS3A8KLHjp1Wa1aDI9USblUT\nxEtycfMSzXx9iQx9FLAtXs4Nn6R\/7yOZg6iMrRAzABe9FKt+ltWgUeI6ahgcdOVzQILhaoavqlj6\nRiXV+\/8po1sBEt8MkMyGn2AnwrAZoFjna9VH8aRTwX67grlGimRUyQqY4GXuL7fgVg0TFtH12Se4\nWpqHwUqW6XeR+AeD7oZJ8XZIOnkcpvgxZsU2P764YsOjIOX2XgHON1OjB9f8MjcpZwUcdFkMgwJQ\nGPzCJWHARQQgBi4y9FWwTKKMLr8z6FHEUrQXkZL7rRSHUQYBmGxlEAbXfISDMvyScOAHfhRDYhhs\nenuJRzXKwfLReyGXl5iirzwfMW4yXpKHRDlB9+e56C2VMj1lLNl1wVL0a0IpnqpXtDOo\/a7C4FFM\nTX3XZEttBQn2IgTPYjKSEYqXVxT81qcaBo\/aZQNyuYVgoZkYw3EK+Chs5TbZ3wKKHrxxUTIABysp\nrldIHJQgUSaht8TCX3OrVTK+rLKmn\/c4M3M+O3L2YoXHD1rU1MRlZWgjUqBPN9j1Wb63CYO7ISm9\nExKwFLt8CYNPO60GoOjFvTb5rMQLXoZtDisM7rQp+DnuwLTnT8C+sjzed7lGifvK8g1zpyW+7mJI\nVLD0drszk+xQMawpx6+V9LCjoHgr6kyN1ir6X9+726xoj8MW7aDDfrIdVTFSq2Tmmkhqldtb\/2NQ\nVgIK5lv4cDRYuTGWtcT3m7nZFjs3KGO8TsZBpwMrIRX8frw3WXw97IzPeO367Vrl3begU8DT8yW\/\nqo24ldf+X\/djn8Z5KfC8R8W3DXaMuRXMNCn6hFvWx+ukIIfTxNqPOVOLftUYgifdBcnDmBMPfCru\neOyY9Ngy4vqlgAO33Tb0c+D3glwLq6m3fWano3BoMaDq837H8cteFWsRlYPacC3LjY66nfGfrjrS\n0412AZP+xmPXD7udBuCM9xRQTvJ5GFoOqambNcqHb+riSzY4\/HDNq7Yw2qStQOdmdG7ybBN+FrVZ\nN8OqNu6xWcU14gdPNdpSA5UseC6edEQbiOEbrVPOB5AZM2bMmDFj5r3yO3bZNW2cnGZ5AAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/cinnamon-1334275088.swf",
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
	"spice"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"n"	: "pinch"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "eat",
	"t"	: "eat_bonus_img",
	"g"	: "eat_img",
	"v"	: "give",
	"n"	: "pinch"
};

log.info("cinnamon.js LOADED");

// generated ok 2012-12-03 21:05:43 by martlume
