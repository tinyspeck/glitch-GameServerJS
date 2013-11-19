//#include include/cultivation.js

var label = "Dead Egg Plant";
var version = "1339118095";
var name_single = "Dead Egg Plant";
var name_plural = "Dead Egg Plants";
var article = "a";
var description = "A tree that won't be producing any more eggs.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_egg_dead", "dead_tree"];
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
		"Egg tu, Brute? Egg TU?",
		"Meh. Last words are for fools who haven't said enough.",
		"Bah! You couldn't hit an elephant at this dist...",
		"Ah. La petit mort. Au revoir, mon cherie.",
		"Acta est fabula, plaudite!",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-59,"y":-169,"w":119,"h":170},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAF8UlEQVR42s2XWVOaZxTHmWmTNp1p\n00lM2qYxRlzAXQLKpiBEUHCBiEoQEAQUVASiiLu4EKOJikbT7LVpO5ObzOQblA\/QCy86vWhu\/Aje\n9P7f57xqpnedMW1f3pkzAj7K7znL\/5wjEHzA42wWe7oaC98KsvWJuVVvve3lyFrAuVBDxmetgFUj\njGYl4MyA9nDYUYtugyj7vJga1uctDusw6lHB01aOtvrr2qwCXBzRaZODDSAP9lkIUJjOKsDlsD45\n4a9HrFcNf4cE7Zr8\/awCTPjqkhGnHBGXEu7WMgYohFmVn5c1gJMBTZLCG+y6gYFOCZwmMWw3i7Kn\nmucHG9JzQS2iLgUG7TVHgLrCTNYAsgLJjHrUXJEQoMtcyoW5USo8nzWA5L1ARzUX4hPAds11T7aI\nNOJ9dbjDqjjcI2daWAa7sRjWhoI93uFejNk8EbuC89yIU3HsQTFnVq3wgFe4V4luDzOMO+pBMsN5\n0a08zkMx\/3LzMt6Zme3VIsi8RhpIQk3mbilDV2MROm8W8tv2doYtmAloDqcC9Zjq17AcVCHuVTNv\n1jLIEg6SAVp4gftxvEvLAA+oQEZ7lQg7arjwktxQiHtbSzkPsjAneQPcDVsy5Lm\/VzFNNKFuKSc5\nVMm8AqZDLXsEOB9q4GzMW\/c+D6nt0WTD2xpAgJuDbWkCnGZ20knIe1QwFPIhuwy3m0T8tLyfJuxV\n68GWDCuQDPXhSA+DOx4WSA\/HffVwNZXDbSrjrycT4HJYx0wPgqSZcMJXx3nU3VqB9aAZKa+Rv9lw\nLWBKE+DCkI6TmahbhSiTGNruSKh7jKXYCLbwt6Ms9ho9s0FthgqEJIZCezQXSuFoFqNJkYd4t5pH\nQLeBdhHOg0cSw4YFBuizVsLRVIwOfSFinUosuYxV\/GxzPfo8AqS8IzAy\/63qY8gKtLFe7G+pPqCL\n8ObFpWF9OtGnxJRfjUSfCjG3ghPtESYzZvU1BC2SDK+AM4F6S9RZAzLqyQQ4dFvGBDoPLepc9LdW\nZ1a7GvmbrGlppxBTcURdcjbZVMFnKWFtTsh6sRBRm4Lf3eTFbkce6eC4l8IrZ\/knYd6UcZ2EppmZ\ngGT\/2Uqh9n8F2l41W\/YedSefb9v3v9uwINGvRNzDcs+r5AZXGhiozRHg\/IgOu6s3sZuS\/Xdj18SA\n9Hw8pEo+XDPv76wacG\/eiCdpO978EMX2aismQ0quxflZ5fa2ljANLIBF8zXrw8WIOZWYuaPFk00H\ntlatb9dT5n9\/wh4LqfZmIrXYnhXj4VwxNhdU2FqxIn2vHcvTjViZM8BrK4DDlA+T4ksGls9anZjl\nYD6s9VdgaijE+LAGz7Z6sJmyHD5erjx8nhLh8aLoYHdelB7o+sD1dNgjyyQjlSxcRViIFmNrUcG+\n6CZ2HrTh+50OrC8ZOchH6+24O92AWKAaIVfZe4sOKDAZ0+D+komBqtk5G55usQuumBHx12A6Vne4\nttB8+rmx11a5N9hTibVECXaTIowFb2A6qsFCQo\/FCT1SM+RFIxfKyUg95uM67nMyOkPvJ8J1WFsw\n4CnLWQLcuMsGiVkD5sd13N+ND6kRD6pOl6dBl6TK0VZ2aG8pha+7innlBiK+WsQHVRgdZIUxwHQw\nIOdspK+W+x29Hg2zz\/rlGA9JMR+tRmpKi41FLe5OyrGSqMTDZSUXBboE\/a+QU3pqSfpIJsoRycsv\nx7Wyqy9thtI\/+73V6GouRWLIggG2F4fsbB\/xm+Fqk2A1OYaRgBVDDNxpKwe7HLuUlJ1VYGu2FPcn\nxNiYPrJEWMV5d9jDzrIJ3KjOM50aMv+y4KuiS59qhJc+rTOorkWa5PkPLBrxK3dz1W8Bi\/T3QZv8\nHZmvTfrO2y7\/xX1L8uZ2c\/lri178ul1X9LO3s+qP\/h421PZIEHRK4OmsQIDppq+7Gi6mACZtwa9l\nwi9q6LtOnY+iHMHnpQLBWXpNP+l9wYVzufmXz1SdWMGlTwpFOZ9dIaMzJ+fpuSoQnLt+8aw498LH\nTbk5Z2TfXDxbQnb1ouDbfwL7C8IEShXV4i+dAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-09\/1285611027-4810.swf",
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

log.info("trant_egg_dead.js LOADED");

// generated ok 2012-06-07 18:14:55 by lizg
