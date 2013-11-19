//#include include/cultivation.js

var label = "Dead Bubble Tree";
var version = "1339118095";
var name_single = "Dead Bubble Tree";
var name_plural = "Dead Bubble Trees";
var article = "a";
var description = "A tree that won't be producing any more bubbles.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_bubble_dead", "dead_tree"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.cultivation_max_wear = "2000";	// defined by dead_tree
	this.instanceProps.cultivation_wear = "";	// defined by dead_tree
}

var instancePropsDef = {
	cultivation_max_wear : ["Max wear"],
	cultivation_wear : ["Current wear"],
};

var instancePropsChoices = {
	cultivation_max_wear : [""],
	cultivation_wear : [""],
};

var verbs = {};

verbs.remove = { // defined by dead_tree
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Pour {$stack_name} on {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return this.proto_class && stack.class_tsid == 'wine_of_the_dead';
	},
	"conditions"			: function(pc, drop_stack){

		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state:null};
		if (this.proto_class && drop_stack && drop_stack.class_tsid == 'wine_of_the_dead') return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var it = pc.getAllContents()[msg.target_itemstack_tsid];
		if (!it) return false;

		msg.target = this;
		return it.verbs['pour'].handler.call(it, pc, msg);
	}
};

verbs.clear = { // defined by dead_tree
	"name"				: "clear",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Chop it up for Planks",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Clear this dead tree",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'hatchet' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		function is_hatchet(it){ return (it.class_tsid == 'hatchet' || it.class_tsid == "class_axe") && it.isWorking() ? true : false; }
		var hatchet = pc.findFirst(is_hatchet);

		if (!hatchet) return {state:'disabled', reason: "You'll need a working Hatchet."};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		// Find a hatchet
		if (msg.target_itemstack_tsid){
			var hatchet = pc.getAllContents()[msg.target_itemstack_tsid];
		}
		else{
			function is_hatchet(it){ return (it.class_tsid == 'hatchet' || it.class_tsid == "class_axe") && it.isWorking() ? true : false; }
			var hatchet = pc.findFirst(is_hatchet);
		}

		if (!hatchet){
			pc.sendActivity("You'll need a hatchet first.");
			return false;
		}

		// Is someone else clearing it?
		if (this['!player'] && (!apiIsPlayerOnline(this['!player']) || getPlayer(this['!player']).get_location() != pc.location)){
			delete this['!player'];
		}
		else if (this['!player'] && this['!player'] == pc.tsid){
			pc.sendActivity("You are already clearing this tree.");
			return false;
		}
		else if (this['!player']){
			pc.sendActivity("Sorry, someone else has already started clearing that.");
			return false;
		}

		this['!player'] = pc.tsid;
		pc['!clearing'] = this.tsid;

		var success = pc.runSkillPackage('dead_trant_clearing', this, {tool_item: hatchet, word_progress: config.word_progress_map['clear'], callback: 'onClearComplete', msg: msg});

		if (!success['ok']){
			delete this['!player'];
			delete pc['!clearing'];
			return false;
		}

		return true;
	}
};

function cancelClearing(pc){ // defined by dead_tree
	if (this['!player'] == pc.tsid){
		delete this['!player'];
		delete pc['!clearing'];
	}
}

function make_config(){ // defined by dead_tree
	var ret = {};
	ret = this.buildConfig(ret);
	return ret;
}

function onClearComplete(pc, ret){ // defined by dead_tree
	var failed = 0;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var slugs = {};
	self_effects.push({
		"type"	: "metabolic_dec",
		"which"	: "energy",
		"value"	: ret.values['energy_cost'] ? ret.values['energy_cost'] : 0
	});
	slugs.energy = ret.values['energy_cost'];

	var remaining = pc.createItemFromSource('plank', ret.details.bonus_amount, this);
	var proto = apiFindItemPrototype('plank');

	self_effects.push({
		"type"	: "item_give",
		"which"	: proto.name_plural,
		"value"	: ret.details.bonus_amount
	});

	pc.achievements_increment('dead_trants_cleared', this.class_tsid);

	var pre_msg = this.buildVerbMessage(this.count, 'clear', 'cleared', failed, self_msgs, self_effects, they_effects);

	var class_tsid = this.class_tsid;
	var patch = this.replaceWithPatch();

	pc.sendActivity(pre_msg);

	if (class_tsid == 'trant_bean_dead'){
		patch.sendResponse('clear_bean_tree', pc, slugs);
	}
	else if (class_tsid == 'trant_bubble_dead'){
		patch.sendResponse('clear_bubble_tree', pc, slugs);
	}
	else if (class_tsid == 'trant_egg_dead'){
		patch.sendResponse('clear_egg_plant', pc, slugs);
	}
	else if (class_tsid == 'trant_fruit_dead'){
		patch.sendResponse('clear_fruit_tree', pc, slugs);
	}
	else if (class_tsid == 'trant_gas_dead'){
		patch.sendResponse('clear_gas_plant', pc, slugs);
	}
	else if (class_tsid == 'trant_spice_dead'){
		patch.sendResponse('clear_spice_plant', pc, slugs);
	}

	delete this['!player'];
	delete pc['!clearing'];
}

function onLoad(){ // defined by dead_tree
	if (this.container.pols_is_pol() && this.container.getProp('is_home') && !this.canWear()){
		this.initWear();
		this.proto_class = 'proto_patch';
	}
}

function onOverlayDismissed(pc, payload){ // defined by dead_tree
	this.cancelClearing(pc);
}

function onPrototypeChanged(){ // defined by dead_tree
	this.onLoad();
}

function replaceWithPatch(){ // defined by dead_tree
	if (this.isDepleted()){
		return this.replaceWithDepleted();
	}

	if (this.canWear && this.canWear()){
		return this.replaceWith('patch');
	}

	var s;
	if (this.class_tsid == 'trant_egg_dead'){
		s = this.replaceWith('patch_dark');
	}else{
		s = this.replaceWith('patch');
	}

	return s;
}

// global block from dead_tree
var is_dead_trant = true;

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"trant",
	"no_trade"
];

var responses = {
	"clear_na": [
		"I have not told half of what I saw…",
		"I knew they'd get me in the end.",
		"Sigh. I'm so bored with it all, anyw...",
		"Don't disturb my circles!",
		"The struggle will continue! Onward, comr…",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-52,"y":-149,"w":104,"h":150},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFpUlEQVR42s2XS1CaVxiGmWm9TDup\nSTRJp2NERfESlasQr4goKioISAREkDuIgCBiVBRFk9ZpEhsnq26ybFfNoovu6rIz3WThpqtm3ZnM\nONPp\/u35fkOmt2Q6uQD\/zNk4B\/\/nf7\/vfc93eLxXPBv+HlXEJnk6Imus4pXisxMazC7bpLCMNsdL\nEnB3aSgbn5cxQOHj\/7M\/YCmw0qTgikOOhal2TPU3iF63d81984TUdky2nRQM8LavN5t0KuAxdmJ6\noF71qn2Z4GB81aVAzC6Dl+3VDzZmC6NgcMCw4etDxCqBZUT45L\/2fBEYqdoJDp4lnd0gBf1mEebG\nWs4KUu6DyDCflKEyB2dFMGuErn\/uyUWGjzb9fSBA2rc0J8G8rq1wxkotKk\/YApnFOX2Dla8+\/ndA\n9VNmJtz29p5\/iEXM7TOoBIXpxaRDIiLAvyrk0necsV478dhGznIH+1hPeJF0q9hHyOEzd70AbETB\nzJKYl7mYSzmVVp1KhG6JOaW8xi4kQxbs5HIILYUZeBf3d\/dMJ2wTra811jt\/YnZplsA2mWnS7h7E\nmFpRZgqTugm7BweIxGJwGJQIsF5lCsM63lo4N9OzbpFV3dIKH5MBCJRW9Dz3kMlmEUskYNG2c1FD\nKp4r2Pik4KeLrreB75xRxh0GBcUJfDYNVtPrCEfCuDUqhN\/UhUVDB1fmgir4r75MpZ4ZZ2c55dy+\nAJwOM2ZUAoSZsmQmMgrrQUPRAJOpVDaaSJwk437YbWaYtCK4mXJRu5SDfAGo4hX7yYaHEDCLYWc9\nRycO5SVFEZW7JAApqLf8A\/CxyKHS0iKjWEoFcH9ZfbK\/PIxsWPXyNCFAI4ufkgHci6ix7ul5Cedn\np4lZ01xcF+eHCVKPlMuf1\/kcpAhiOXhUVMANb5+LAGlYoLGMVMyPXI7JdgbYcFJUQBokCHAr0I\/E\ngoI7\/iheCI6mcP1gw7NSuLeckYJU4ryLKQft7EhkPYiSMMl2cIADpJAOsPLSeW0abioVwOFsXsHE\ngpybG0umBznAyJCLRn4yCBmFQKnE59NMCQDuRdUqAqO7C8UNzYtxx\/mkU\/QczGchBTUBcn1ok3ED\n68yQoDQAXziZA6Sgpv6jWbBkFMwDhiwSbqKhRQqyezSdJI+LDnd8fCzaiRsRsg9yd+cVRzeLG3lp\nmITgvjw6wsNHj3D38BAu6yRc0zTud5RGzGxktp89ePgQBHl47x7W1tdhm1bAz5QkBdnd+Ozw\/n1N\nQaFaL\/CqGy+Vd9ocCz9kdvews7eH21sZZHP7yOzuIhTyYbyvCbq+ekz01sPj8\/5uNJke9HZcFbTU\n8C7Qei9g7TxeueBKRVMn\/xOdXa\/+wxMIMbgc9u9+juRaGimm3ub2DtKbm1hJJhAMLHJrfsEFvcEA\n7+zwc+uY+BfraNc389qutTEZX9pS89Fnbw1MYA1XedcENWUyufBKxDTU\/uuiWY3cnRxS6RRIxW22\nMtldrG9uYYNBBsJL8IfCcHm8GJ\/QYXzoJpZso1j1aNh9WgmvXo65kc7nNq1onz64+UqZ+I1A6y\/y\nLtazH9ddrhhVSeqO2T\/Esl2JkEmBqNuIw\/0gV+K9O3c40OhKkoN0+\/wIBn1Ir0ZhntTAN9eDgH0A\nYWsvfAY54n4GaZL+ZOgXLtVerhgnAd5YQfoxv6ZS3VL78bxJ1f5jyCn9bXFayr1ocVIKr4EB23UI\nO6aRXnYj5rfDY5tG1KXHatCKsHMGKXbzW5xik45RgbC9G2FX9\/fKtmvWuupKDZX5XbTgB6Rm3eXy\nGxPD17XXL304oGz7NKIS16Ynbgq+tmjav3VPSU5dk+JTz5Ts1KkTn9rHRD\/btJ3fGQda95zmrq\/0\n\/c2ZKbbYb\/xUEX51edt7M0y+N+kFpHAze1nD1TJRbXWZgha\/qkx6vapCwK+qbGi8VFlHH\/g27\/oT\nEfUHgqm7e6EAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-09\/1285029227-7087.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
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
	"trant",
	"no_trade"
];
itemDef.keys_in_location = {
	"c"	: "clear",
	"e"	: "remove"
};
itemDef.keys_in_pack = {};

log.info("trant_bubble_dead.js LOADED");

// generated ok 2012-06-07 18:14:55 by lizg
