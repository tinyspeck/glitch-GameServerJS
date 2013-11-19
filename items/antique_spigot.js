//#include include/takeable.js

var label = "Antique Spigot";
var version = "1347298703";
var name_single = "Antique Spigot";
var name_plural = "Antique Spigots";
var article = "an";
var description = "Water once flowed freely through this residual, rusting spigot. Old water, from times long by. Surely, you must have it!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 251000;
var input_for = [];
var parent_classes = ["antique_spigot", "rare_item", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"quantity"	: "331"	// defined by rare_item (overridden by antique_spigot)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.owner_id = "";	// defined by rare_item
	this.instanceProps.sequence_id = "0";	// defined by rare_item
}

var instancePropsDef = {
	owner_id : ["TSID of the owner player. If empty, it has never been sold."],
	sequence_id : ["Which sequence in the rare item catalog was this one?"],
};

var instancePropsChoices = {
	owner_id : [""],
	sequence_id : [""],
};

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

verbs.collect = { // defined by antique_spigot
	"name"				: "collect",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Collect this previous artifact",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("You already collected this!");

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

		self_msgs.push("You already collected this!");

		var pre_msg = this.buildVerbMessage(msg.count, 'collect', 'collected', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.contemplate = { // defined by antique_spigot
	"name"				: "contemplate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Gain a precious insight",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("It takes sooooooooooooo long to make a game :(");

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

		self_msgs.push("It takes sooooooooooooo long to make a game :(");

		var pre_msg = this.buildVerbMessage(msg.count, 'contemplate', 'contemplated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.applytoforehead = { // defined by antique_spigot
	"name"				: "apply to forehead",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Do the good ol' forehead applyin'",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		if (pc.metabolics_get_mood() >= 51){
			var val = 50;
			self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "mood",
					"value"	: val
				});
			// effect does nothing in dry run: player/xp_give
			self_msgs.push("You drained off some of your mood and learned something from it.");
		}

		if (pc.metabolics_get_mood() <= 50){
			self_msgs.push("You are not in a good enough mood to do that.");
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

		if (pc.metabolics_get_mood() >= 51){
			var val = pc.metabolics_lose_mood(50 * msg.count);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "mood",
					"value"	: val
				});
			}
			var context = {'class_id':this.class_tsid, 'verb':'apply to forehead'};
			var val = pc.stats_add_xp(20 * msg.count, false, context);
			if (val){
				self_effects.push({
					"type"	: "xp_give",
					"which"	: "",
					"value"	: val
				});
			}
			self_msgs.push("You drained off some of your mood and learned something from it.");
		}

		if (pc.metabolics_get_mood() <= 50){
			self_msgs.push("You are not in a good enough mood to do that.");
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'apply to forehead', 'applied to forehead', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.spin = { // defined by antique_spigot
	"name"				: "spin",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Spin the spigot. Spingot!",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("That doesn't do anything.");

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

		self_msgs.push("That doesn't do anything.");

		var pre_msg = this.buildVerbMessage(msg.count, 'spin', 'spun', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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

function canPickup(pc, drop_stack){ // defined by rare_item
	if (this.is_racing) return {ok: 0};

	var owner = this.getInstanceProp('owner_id');
	if (!owner) return {ok: 0};

	if (owner != pc.tsid) return {ok: 0, error: "This does not belong to you!"};
	return {ok: 1};
}

function getLabel(){ // defined by rare_item
	var sequence_id = intval(this.getInstanceProp('sequence_id'));
	if (sequence_id){
		return this.label + ' (#'+sequence_id+')';
	}

	return this.label;
}

function onContainerChanged(oldContainer, newContainer){ // defined by rare_item
	if (newContainer){
		var root = this.getRootContainer();
		if (root && root.is_player){
			this.setInstanceProp('owner_id', root.tsid);

			if (root.is_god) this.no_sequence = true;
			if (!this.no_sequence){
				var sequence_id = intval(this.getInstanceProp('sequence_id'));
				if (!sequence_id) this.setInstanceProp('sequence_id', getSequence(this.class_tsid));
			}
		}
	}
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "There will only ever be 999 of these in the game."]);
	return out;
}

var tags = [
	"no_rube",
	"no_donate",
	"no_vendor",
	"rare",
	"collectible"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-30,"w":41,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIzUlEQVR42sWYWVNaaRrHvZyquXBm\nqqem0+nEuIG4ARoUBWRHVJBNkEXBDXBf4m6rGI0BN0hcoiYxZNOks3bX1NRUzQ2X8wXm3o\/gR\/jP\n8x5HK9OTSdKVdHirnkI553B+51n\/78nI+EIr1i8XroyqU9FhZepGvyK1GJYLM77WerLhjrzPtuat\nDnZ8f9Ga2F1oxE6kEVNdcoQdQnRaitBtL9xaHzV9cxT3KI\/ivsCzhDdymPClmB0lvG\/XxoyRFzFn\n5mfB3ZkzK+9H3Uiutf6XHcQ8uOYTYbFPdvI03oKDZQe2ZxsQHdFgNlTFHWupK8CNIQ3uLju5ax6s\neMF+695NFzbnzNBKvkNt9SXLZwEu9ddElgaUiPQqMNFRjbluBeZ7FJgJyTHkFWFtTIdHK\/QAdPP9\npSa6sQWL\/QoM0zGrig9XbSn6PBKMtUkxG5ZhebCGswFvOSzqXLgMBZHPAvSbSyzNtcX4pdk0RbCT\nLfYqkiujBsRG9VgaUGOmqxqDnnK6cSHMNXyoJfyUpoIPZsbqAjQoCrhPvZQPb0MxOmziz89VtSRP\n+T47O95pF2dd81cl\/KbSY4emALpK3rGmghfRiLOzzs7Rledk\/vL6VrNYmfE118udtsjOfCMY3P87\nZzKky5zuUSvPbDKsFn5VwK259wOyav3bwUDyr3f78PN+D37a68ab3R7sL7dgKqw6JlDLVwGMTzX8\nD+CTjWbhz\/u9x4dxH46o4g\/JXmx24FkigDd3wni904\/JkBpjHTWRtAD+tNeTerjSjEerPqp2Hw6i\nHqxO1GNn3opkrBmP6fvV8UYMB2Qnk87yzN8Ebj+myzyIupKxUSNVb2Fy1CvgCuQo3qp8vOYFC+0\/\nHo3h9Z0QeSxIngxgvk+LpSEd7kTM2F2wYtBfhT6fNPmbefDpeiv1wBr46ktw3ugXzG9fbnVxUK+2\nguQtD4W3Ew9jbmzNmjDSLqO+quT+jvRr0e2WoM8rzvricKwInt8O0CRRw6YWkId8ifs37Fn71214\nvR3GwxUP7t1wcN56lmjHAU2Trdl6TAYVsGqLqfErsD5hRFdTGTodoqEvBvYw5kw+iDbRze3YmjNx\no24mpMIRFcBB1HF8uO4nmCYyB+WgC7dn6nFryoi9iA3xCQPmu2vQZhOjUV2E2LCKGrcIbdbSLxPm\n+8uOoY2pegz75bg5osf2XAPnoUerbs4ObjoJ0olnt1rw42aAPgMkKGw06tRYuaZBjLw9F5YjYBVC\nW8nH9V45gk0i+EzFqc8Ce7TWbLm3ZE3uzJtOotd0NKNlcBpKEWgUYmNCj03yEoNlFqMxeGvGjL3r\nFtyaNtIsV2LEL8U8zeWlfjl+6JLCXVeIWhkfY4EKtFtL4DYKfj3g07gn8HjVnUxGnSfMM8loM4Wr\nDisjWkySiBgPSKGR8GgOi3FzUIX4pAFrozrMUgj7vZWY6qzGKJ0z3CKBU1+MqXYJZoMVGHCXwa7j\nwVDFQ8guQqupEE06\/qcDMi33arvj+PntNqo8F9e3WIJvk1yKT9ZS1SrpyaUYoRszQWBR5lDYqrlq\nZjk1TeLBbxYhYC5BW2MxwQlgqhGg1yVCn0uIniYhzHSNtpLH\/e818kkF5X0a4GHCmzyMe8HgWJJT\nzlFzNXGeu0F5NNUl47zC4MKUOwxQJ7mIqQ4JJtsrCbSKJNlVOHTFqJfzSMXwuHMalQKE7cXoshah\n3SxAbdVlLsSD7lKCzybFc+XjRfJ80598ud2Ox2vN1DL8INVMotTJ9asVklZMG460VnIhG\/CUkbwq\nOgcM2orQT6Hrd4vR6xSR14q4ItBW8DiZ1awv4MRsm4kPpy6HUuMKmg0CBK0FJGAvM+APtxny2tDb\n3RBebHVwjXV\/0cJ5bosU80KfCpOUT9f8p3BhAmglXccAzgDbTTwEyUNhRwnlVRE6Ggvgo9A5tDy4\nKN+ayTyGfPjrcqG++h30Vfl0jQBObTY9xEVoxBeyPjANvFlP496Tpxte8lwrB3dn3oylQQ2mg4pz\nz4UcYkroUljVhTDKCjg4ViR6ybfoMPMRaCAPkbXWF1AoC0\/aGvLh1efCo8+BS5uDFkM21GXfkqDN\ngUNDRSLl0RbgApRlf3n74Wrd8CRYQ30YdeHukg071HxvT9dxcCOtUvIYU8sl5x5714zSLJhlF8lD\nebCp8mFS8ODU5CUCDfxOfz2P+95OMt8kz4Gq\/DJUV\/OgIzASuNBVfI\/q0j8fl+f8MfNjk+GEbYBY\n32J9LDqio0qkPUZLJTptZZTsAqgr+KeKmcyk4KdqKUSGysuc95zqK+fA9H0qpDu9oc+QF3UxQFUu\nFUs+\/QaPMz0BGqWXUFH0p5OKoj98WLw+XnUq7y\/bubHFcm593HAKR54LOcrRqCrk9hhMvp\/L\/frs\nrPb6Kyde3SW4NZeOjdV5ESbn3z3nbHl02UsNslzUy\/I4a5Dn0kNdQDk\/MyXO\/t3HBcLedevQJlXp\n3SU7diNWrI5qMd5ejW4Kq8dYQnC8k\/fd+Ncsu+ZClllxRclMLf5GWZT9+0+X\/IsD2ic3KaRsoK+P\n67mt5nALjR+LiMs5lYQ\/lJHO9UO36p\/Lw1qC03GDfKJdir7mcur0hVxOZaR7zZFwnO+pAduoz3fL\nMOyjPucQoY7aCCuMtAMu9Cm5nOOaMMGxQd5lK6E+d7oBTytcfFyvnO+W\/wfuKg1uMU2DErTUF541\n4WRaAaeDVcqxwCkc81zYUUozU0A966wR8yJpBexxipX97nIOrtcp5JRGm6kA3loeNVweVBW8QFoB\nBzwSZZAEYw\/BMSnE4NiMZN2fzcl338WkZdnrSr9ncCEOTkA7M1Ifmjw00ew0SPPT78HZbl3EoqKQ\nGtnbKT61lnxYamgc0Wii\/GP2Nq2Az251pvyN5eeq913jRGatKL1t5tVOZ+rvD0bwaruHto52xKfM\nNE2MmAmq0UayPO198M1uMHWUaAV7Gc72G2yvwSq6zVzIqeC0A77eCwvZtnJ3wZxiE4UBsjHnNAj+\nxfKPtJswHVz\/BmltUeAqeGSmAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/antique_spigot-1343937322.swf",
	admin_props	: true,
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
	"no_donate",
	"no_vendor",
	"rare",
	"collectible"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"y"	: "applytoforehead",
	"c"	: "collect",
	"o"	: "contemplate",
	"g"	: "give",
	"n"	: "spin"
};

log.info("antique_spigot.js LOADED");

// generated ok 2012-09-10 10:38:23 by mygrant
