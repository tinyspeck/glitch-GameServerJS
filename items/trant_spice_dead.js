//#include include/cultivation.js

var label = "Dead Spice Plant";
var version = "1339118095";
var name_single = "Dead Spice Plant";
var name_plural = "Dead Spice Plants";
var article = "a";
var description = "A tree that won't be producing any more spices.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_spice_dead", "dead_tree"];
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
		"Nonsense! I've never felt bett...eugh.",
		"Well, I've had a happy life. Also, spicy!",
		"Drink to me!…",
		"I never should have switched from scotch to martinis…",
		"Oh you young people act like old men. You have no fun…",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-52,"y":-120,"w":104,"h":120},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAINUlEQVR42r2XyU9j2RXGLXVXQ0kp\n0YKiKk1XFZNtzFTGeAAMxja28QCe53nGNjaDGaqgqinSoaWuHVIUKYskQtlEtUr\/B+1VpN5VpOyy\nKBb5A9h01if3u\/Ac0uqmJsyTjt7od3\/vO+c791okuqFtPz+bfpqbOa4nVKebCRWtRSepGJA3Ct7x\nRnxp+HgroZB\/0Iu\/qS70roYmT\/Lex6d4YcY1epK0y\/Tv+vvf1ozyr0q6Rj2pohqDqkYUlHKOngUt\nkmOnrs\/NQu+a79vwGcTHZuVAx3vBvSjPH+7ltYQv3k5raCczRbssyqEJSi2PvmaDbLztHU\/zM43t\n9BRXLOcdp6BZSgwo\/dEp+c2q4WQrpUE6DoVgKpwBeCOupIL\/MWU9YxS2Dv0i5JPM1DGUwweWghMc\nzqkb+O6j4V6UdG6m1tl2TNH7f2oElR2bCeUZBtwvzFKeKcLSRUjTT9\/x9ZpRL8Dhg\/Cc1ygmh7a\/\n96MB9wpappb6Z+usHlemMehudprWYkqetoBJchZelDaL\/OWKuWM\/rz3dSqlpNaygol9+8SH9jWtx\nHNJ55f24kjuxFJBTxj1GEZuMfAviUyjMTbEy\/xo1u84+QLiPcM0PHF4L4NssvxlXHaMWnxXnuDpx\nxzAGp6JX3mCAZ6ydULOVsFrFfaT3p4C1sEKuVXzRe+09DbUJhQCJNKddYxS1y4gpR0e1BQY+ywER\nOc84NxPqlR2f1GMqNzK0lVR9hxIoBSdpK6U9uXbIpzntGQaosBpDHa6wdMM4CMEYaEdCvaJF8TbF\njqEwYiOupoBFRguqh6dGzZfyawU8rOgbGBAgFQaCvQAGY2SZcmgtuAY34xjA2Fcjk7xp49ksq1G\/\naYiuXUGWysOvq0bewIV0CnVXuwgc4xrqNMtTPc7LAXvUZcgipbhd1mCzVPraAVkjP2QzTRNQMAac\nKwBiWoO6l8ESSyPk1g9wUwUtYr2oFdvvv3neu1\/1NC6rd1DSkdCYBSUBiBkHLcZvkjTBzqMvLWrV\nVl\/NuncqYYJJAAPXMkW5ejALUiqomLuYbQB50Wow3Z2IWrlVslF9vZKi9eQcVwqphnuFwsceRin4\nzntgcnmEB2rONd9\/9t6rlg8BXM3HqV5OcLVgFsHRPLUMDo4teM\/TCwUB6DEMXs9i4V0A10sp2q7m\nKGwb5umtJzUc9ryNKDgo0g0wGONiqru+6e6tKV7NECDTXg2x1TKxvshrEq4tXwQMUoxaKLqkuATY\nQnMIWzUf692uZglprmQClPQZaDO\/zBXcTGk5JBYJUcdjquSiFHRMNd37c0uzlmw7tRwHFGJ3rUCF\nqI2n\/aCeob21BIOLUSbmo7h\/kbUYyc0peN5qMhxMULJeydBmKcaP11aSfL+SDnNARD4RYNdilIp4\nDm8EsJAMUikToa+2y00VD3ZWqVZM0GYlzdXLs2cEQJ9zkVx2EzntRv2NmKScjRKCA5XTVC3EuWkA\nCqBiKtQ8RkT9yzcImI+n9zaLHCDHUgeY3bU8V+1czRgDTtAGAxcAA27bjQI2kFqkWFCyztKajfv5\nNQTSC1VxDMCIb4kDuqymjZbClXIJOVRCWgEhpPVcvRhPOVTNJwNcQVwHZCLkJu+yhSm4cNxSwNVc\n7GTlQhU4E6kFYK0YJ7QeAOMe4OBwHENhQMcCTqbiwusWA8bPhPYBUKEWcb57CbBW+F8fBBwgoTjS\nbDabO1rmXsBgoCKDxDGAhDQ+q680AaFugZkHz\/GaxDn7ndvB6tBmak2zruTix4BizZbDQRWouV5K\ncsinG4WmajzNDBbPwDx4DuF3WclpMzWuHS4VdkiRXgyIWsJsAZdicLQZ7KESAnAwhdALAYVrgG9J\nP5TdEXWlQst\/rBajzZYBtwIQ5wDGwHzeDboo6LHzaPZABhhi5\/iIc6OYuFnsinE7e\/0nHwTleTyx\n4R6f+LtjdPSvMwpJtJQN\/fhkZ5lCLjMVQxauIBS6PEugjWBvXZijpUUDVxH3UxEvu7fIlQx7HeRd\nstCicZYc5vl\/WdTjBx75RIONdzx0V3TnneD6Phd9PifpmzJIxC+Vku41NsgbHxtgv2ylF7VFeraV\n4T1PUASFv2w1MjAdWeY1ZNcryW1SsWXWHAfCM1C0nA5QdHmWYktqijk0bI2oIv+C\/D9xi\/wP5nFx\nfaC7fW6wu02M8X+J7ROkUy\/uqywOy\/5iUw59H7VrKObUUdY3TasRDdXjBq5cMuzhyjltC2Qzatmi\nVEtp5xTVQjPsz5OB\/SGfpm+flamcCZGbqRoJGijsm6eMb4ZKfg2V2EK3Elez\/8Xyf0fN43vq\/p6d\nsZ4OS\/890f0ra00v7nfODT5aV\/d\/ebCoGvhz0j7xY2Z5kna2pqkWn2IrZDt5WIqgltemo0rYTEfr\nITqoeGgjoqUXRTtV\/FPsYwx09HyDlUKCntQyrGfqyWOdIa91jiqBGapE1bS7M\/2PsEG+px3sfS6+\nf3v6SrjLm3VEqrOPjP1O8ag7IO35VdigePRye0f9xqmTvvLa535YMqr\/6TPJ39SCWtqK6ameWKCj\nVQ9tJwy0lzZR1c8AvNNcpbxLRXn\/LK3lWCascgrPKSg4NUlpn\/xvGtn96MPONqv017c1EOe9jWKS\nybqYSY7MMkns4b22wQddtzR9dz81POpqNw1\/ccdjGpK+cshHvvcZhl8FjSOv3PNDPBwayYl9dPSH\nJeXwgUJ6N6JT9UQMqgd+l2LsTzPinvyDzjZb7912I2rug8Cu2kZEos\/gNrx4sPP2w76uW1P93e3z\nAnhv56cz\/fduyXs72vsfdLdJxJ2fjV5V9G\/b\/guykFB4PQ9I2AAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-09\/1285029831-4422.swf",
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

log.info("trant_spice_dead.js LOADED");

// generated ok 2012-06-07 18:14:55 by lizg
