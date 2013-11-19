//#include include/cultivation.js

var label = "Dead Fruit Tree";
var version = "1339118095";
var name_single = "Dead Fruit Tree";
var name_plural = "Dead Fruit Trees";
var article = "a";
var description = "A tree that won't be producing any more fruit.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_fruit_dead", "dead_tree"];
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
		"URK!",
		"Wait, I've just thought of someth....",
		"ARRRRGGGGHHHH…",
		"Ngngngngngng-ftang.",
		"BUUUUURP. Excuse m…",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-59,"y":-145,"w":119,"h":145},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFbUlEQVR42s2Yy28aVxTGkVrHbtTI\nrUycJnVNsZPg2LUDDDAGY2CGecDwGgbMmwE7tmMcx+ShNH0qSrpou4qUXReVm11X9bar8ie4kvdl\nbSkSq6xP75mA2rp+1aoHRjoLJEb8+M7ru9dgOORZ5bjBUlhslEROi1ww0MiSkDw2k6HbjxqTEmpG\naalpGSqSCFUSaoiHfJABeX6uJTqpetfgqmGxXklEAKMqCS3yudGOprqQhHIqAQvBAPBOqsHauqAm\nwhSFYDPPM\/4DlN0iygIqmyNqSrMuCNitT3QFLJJ0kh99ftQfQHXJn4CE1wOs3QoBq7WiG6Di9wJj\ntSaOah5MfTkR1WoyPueGgM3a4ihqUBfAHMfAcT+2GBIq2DxlkYeImwYGVbRZG\/qkmA82TlirTTJ+\noMCzf0HqkeqDmuNAQEl4opKOrkRDkGH8+qf6uEcb5BGxhTMyywa0hhFdDv27+vAU888Vnxdi8x4o\nhgRNRYyoh+6+imSrbBGYpuzz1lU5BmUydjqAZNN0V0Uy\/7YkN73dUakSl3bUZFxLMyoqOCmsxWZ3\nlBO5RNLnbd2SWNM\/Rk40rO3rPMdCiHbq19H\/6vAg0yQ7uL4Y5v37BzeOnASpR0wxqkg2jP4q5jmm\n0YHaP3LKkRCoJDqAqGLIRWkqfre6Ovi0VvPr0rmHjRyS5lZncGOzsG+2SxPhMhzbdE9PAeekWpLH\nvW27YT4bF4RKHTm42\/4x6ZsDzmEHlkQ+zEOV1OhSTIK8wAFL2QChdd8ymopxqYnbRSVAOLSzcQnU\nXBrUbAoKYRGCBC5O4FNs4P+vz4UFalARqe0jTYQkJtCKZSUBFJJuhCsTk4twWJsxsm2wNo9yS6dX\nL+n252P09vFlIEKa8UFJjmqunJgPbU+jeqQmdxib7eaZpLegeEwFma6fFDA069T2M0bbeW8beuGp\ntg9Z6Ctzbw5ZWlp7xuXgVulslnTAp22Wrq2+A9chGTXYHHnSJKnAPHE3s\/q57RMBZpQdVUlAlgDK\nZPWh2+4twLS8gwqWUrLmbjT71SuA7ZWnjRc8CiBc+yjQG4A4qLE58Ogqt9ddu0kaPTJihCedMYOB\npgEhewcQ73D2Aep6Zj4JIN6CYYo7c1ADPOIq5cyfiQuGIYvx\/BXBfXlCDXFN3CBYf39X0D8z\/f2I\nwfCOrlDO68NJljK\/ZKmx3xPBCchwDu1MgkHOLdA5L6O75umZPdE1\/jLqsXzD0+M5xj5KmYcNl86C\n7S3L8LmZGyMXkgoztbcYc0BtwQtP11OwlOC03Yv3Nahc5\/YLjQKqWI3QsJ7nYVkh8HHqVV6Y\/iXD\nTH0apEzMmLH\/usVouDBpMJw7FRW+OH6x\/+rHQ3203WK8p\/gn\/7ibccPTTRGefR6Dz6oCAQsSu89o\nN7GpgBeIuYWqHIHlXBJkdp54wRm4V\/LDg9UsPFphoJaioRqzE+cz\/TrDfLI59sF5adzYRyHof4LD\nF8xEtZH3+yXGZnpRFK2wprjg4cYs1LMe+PJOFh4uRuC2HIBHKgfr6TlYTc5CTWFho5iC9WoKNpbS\ncKfIwv1bbtjIkvfKc7BecEFNdbxWw9afLB++u2AyDjBYOqdSECFHL77tvfJef1ykx37McNN7GytO\nuJ10kbMGBfWcB+4X5uB+mYcv1lKwScAfV1h4WPRqSq0pNDxY8cBaxgWL5PsrshPuLrtelZSpr7Fc\nULlTw+2vwWvD\/WPm4b6bI0N9LvvVoZLfOoJ19Ez2WX4uCDO\/LUWpXVWy7lYitt1S6OZuQZz5NcVM\n\/pCNTXwb9V77irWNPsZ3MCOjQwNBk9Fw+dS1d6KmIepqo+bSgBnBPzL2ORBei4v910yDA2aM0yr0\nJygmsVi1LBUkAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-09\/1285029598-3504.swf",
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

log.info("trant_fruit_dead.js LOADED");

// generated ok 2012-06-07 18:14:55 by lizg
