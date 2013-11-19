//#include include/takeable.js

var label = "Blue Element";
var version = "1351723098";
var name_single = "Blue Element";
var name_plural = "Blue Elements";
var article = "a";
var description = "An element is the basic building block of all stuff. This one is blue.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5000;
var base_cost = 0.7;
var input_for = [147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,174,176,314,318];
var parent_classes = ["element_blue", "element_base", "takeable"];
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGF0lEQVR42uWY21MTdxTHF61XWikq\naL0x7Utf2uG90xn+g\/LUpz7QlzqdzmhEq1hvoYhC8RLRWkWxKxVUSGmqNcglsEXHmXbGMVartQ6w\nud+ALEgScsNvzy8XSDQ3tBo73ZkdmOwvm89+z9nvOefHcf+Xw3kDRcPXUMJO503kvVJw9n6U2fof\nC1FA2zUo7NdR\/ErAEUyptR\/Sk6oxSKZqdsNKUKScyBRMeI0gswanbbaXDahdWpMQkIbUkwmVsvVD\nljXAW802cUA9AUOvDw8uj\/HJXpxE6r6U47dGg3indRj32kdxu8XGJ1tH+SnPCqC+2497Sifut49p\nbzYMJrUVszD17wPGelrsGbUOZw\/yTL1BGDVBmDTB6RCuaQnI1533a9cqURr9zNgdKDH1zXzPymyI\ncpPuJY87KRXS+mf0zYv4WNwN2GeWX6cEc19QNGkCWkN3APouP9iPFjS4ylaecomrvp\/E6iYv1rT4\nsfZiUFjThhIGaOgKqGg9b+oNKMx9KH0SJCpIBLw4peFmUgWM3X6ZvtOPH5UevF0vaZcfHUfB8UdY\ncdKFlafdWMUT6A8+rCXQ9e1+dKv9fKaRS\/lSMdPN5EbKVrf8o3onluxz4M1vRpB\/0IllCgkMtPC7\nCaxoINBGzwzo+QDWtU7J32lL\/fAhwOspXqq0llDhzJu3zaBY+JUJi3dZkCu34o29dizZPzwDemQM\ny4\/NgL51hkDPUtjPMUUD0rqLU7JUv89CnRyQ4p9ywecDwlyZiPlb9FiwzYhFO8xYvNuC1yttIdC8\nGgKtG8XSQzGgJwj0lHsatID+n6+YkCeJoCqT2qpImoefPRS4LwaRQ5DzynWY\/6UBCytiQL8m0GpH\nPGj9GAq+fYRlBLugZhRcNZ0HxuUJxJFnlGIsD5I+SQSQK9eD22rCnM36eNCdZuTusYZAl0RA8w+M\nYlGVAzl7bOCqhsHVSOAOxSvIIke\/yWfsg5GWiU8JWGEGt8cObpcNc8sjoFsJdLtpGnQh\/c2pMIHb\nYQUnd4DbR+rVjYGLCTHzSDPZ16x7SJaw9MVpSGNHoOS9rTrpKUAWsloJObuseI2FnlRlOTpHpgO3\n2QBuO63bzdQbiaj3CGVn3aKp01ds6kSxsScg2vuesXe0CsEyugFPhlymV3tlCRUM5xS4o26mDDgG\nxtZsCqdBSL3KqHq0TuHCxuZJiGqvpOv0iaa+52xsqZypCFA7SBUjLeBJH+axkG4QY9Szh9WrDavH\n1m1sIcAOX6gSGXufo1ZbhCkFe0IWDp3apy3aNCSmAyystCRX74gL3PFJrG\/xSgTIHpzVcui6PMKD\nS+Oy+83OzDvwUD2Okd+iRlFReQaAVQS4halnSageW8OdCatG5VIQr3pgu\/EYYpcHd1pHhIxfkISG\nnSbEuY0EWE0vxDZSb2dUPWecetwpP7imMCBrNB5eHtcOdbrx8Jdx3L5g4zPzwWStehrAwiYC3G8P\nq8eu7U2kXhDcuZl6e+v8cMkfFx3Cn20j2kG1O30+ppwj1g\/mLd0i8vk7jMkBax0z6u13hq9F1Tvt\nl7imxM1AdABL6YeRKpK23FSflhQf1DmQu9cRB\/juBQKsG4lX7zBZzzEPU0\/FNaYeQ8PzdQqBMh1w\nyMNKBy5Paj9tkFTFJyTkHw0Dvt\/mR+FBAqscjlFvQjzW6sko+SMqCrNuWP9ul4r\/ujQuv6OUSo1d\nAbmuw6cV1T4MXfFCq\/KgSunGxx2T+EQTQOFhZ1i9GknawLvEgUuTZfRA\/Czcg0\/b8sfuCNwlOL3G\nC2OfD\/d\/coIqC6iFh446alYNBq94FczEV5\/xFX\/4s08orJeY7\/FcLfKGyJpEuq5TewVaz9OgJbP0\nJg8z62jS1uRQZ0EyEyjYaejxY\/CqC8wK7ipHoO\/0waAJCmSyAps3nrrBIVdc6dKT4tF1ocaApjxW\n458amhjcs2yV3Gq0FN2+YBfJCvD7WZPCErkJm+aMmqm0OwfsYbK2L2MRgik7YGbE5t6gisvWwRrb\nVDnDLCPTQeyFbb2l8q2MZoyXAMknUjH8smVxdyvdDDOrGeOFbwFHtkZiDf+V2QKOzcfn8rP\/6vEP\nmS5QeE4awdEAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-05\/1273133932-8626.swf",
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

log.info("element_blue.js LOADED");

// generated ok 2012-10-31 15:38:18 by martlume
