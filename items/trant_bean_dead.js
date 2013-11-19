//#include include/cultivation.js

var label = "Dead Bean Tree";
var version = "1339118095";
var name_single = "Dead Bean Tree";
var name_plural = "Dead Bean Trees";
var article = "a";
var description = "A tree that won't be producing any more beans.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_bean_dead", "dead_tree"];
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
		"Bean there - done now. A ha ha h...",
		"Toodle pip, old Bean, eh? Heh heh *croak*...",
		"Die, my dear? Why, that's the last thing I'll d…",
		"Phew. I'm so tired of being the funniest person in the yard…",
		"Dying is easy. Comedy is hard.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-60,"y":-158,"w":120,"h":159},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFQ0lEQVR42s2Y2U4bZxiGLTUB2ioi\nCRSFkGBCk7DFG3jG9mDwElYbY4\/B8TLejW28wAAGDITGKSJVe1BFai+AHlZqBQe5AF9BxUFOK3ED\nlXxCj7\/+34ApbUEsxQwj\/bI9M\/Y8er\/t\/S2RVPjIJ3pq8\/F+vrBk2VldtBVxfb3OFvMLYwqJ2MdS\nRGfIR5i9N6kByEX0EOD0wHl7hRUO9JdiMbNUNLh8VK8opAdKGzMjsBxhIOHTlNys2o7XWPLqdTGl\nWNi4JR5gpLe4EuuDTd4KvF8HKa\/OcPy600EXCGBJFLhcjJEiHIZ2PqCF+ET3f5RyuXpqMczi5V60\nVwhtyq2GgE1mOOm+CSe9xbK0QhRAVG8hqIWwXbl32n0Y5gmWDomQf4wdFeQ5DQTH5e9Pu49lKQNC\nXjvgcpQpIOAsAfSPyU8FwDy80YAHYabeXzvgetJYXIsbzgkogoKrU\/27WCRzAd3NBMTw4sp66coD\n5uZHQqmYqbiate6uJM17XyVNpZWYvrg5a7GfdP9mziLF8C6GmXMBYiVfDiznlC7l7MVw0CAMd79P\nD+FgP0xFTJCKGGCZTIq1hGHnpB74zbwNEHLGV0HAZHxgx+ftg+m0dcts7jhyHT5Hd4GbpGE2rBfm\nbD7KbP27gjH\/cNRVDHAmNWhAxU7r8gt+WsFzut21uAneZoYgH9bxf+cfs1XOQQT0WWT2KwckLoM\/\nqz8lSJMlObZXhkGDgOdfJ4xCBS+GdOfKQWzWFwbkecdOZnb8zBmZdqvtWAyCMYgyO8creM6vFQA5\nq+zqG7FnUls4r\/QrUybB9x24l97QetIk2Kxl4qAPFJQVrx7QpT230834VFK0VAhI1CxtzFrhu0Un\nLEWO+iBcOaB7UmO\/yP0Bm3wr7dEKYZ3xaaFcxYd261Q\/eOkjkRi4UOJmfXRhPTVMwIYhMdkjqIeh\nxiquCOBl\/B+q95pATbvUBLIblg6LZ8rZLT6gMEEIUOqVmuQdJUAh5I0CJPuPXcw57H\/lVoOLbJhu\nBuDqVF8RRx\/ug3EOl1sP5iRnlYduBCCaBFzYZrCSERBb0FnT5FqOt9nhIoLhbEY4VLFs+6MO5Y7o\ngPhPwvHcOz7yMm6qJD7g4UZ9zq\/5B2Du0DRkvLR4eTgf0BkQruxgMKz4+bj1z3joPdEAsx66MEum\nBqqHMLhw044LYbF5C+fdFH9tUJ0SSRXT2aQ0Kh87Yg7Vr2WwtJs6giyvGKuC0LiCqEiueahilFUp\nKgrWVv\/ZQ33Xg6C9r\/13ziIXHlxWKeJQCp+JDxSaNJ4TpglxNcRdC7BBm6LEjb6IttVL7lwpHP5g\n670qGdXWkPKPKPcTTooopoEAUYc8FF4Nd4F39IVgEPxWhWC1ygritYCDIZByCI+rwG+R79v62n6m\nnte9fFZX1dF+R1JHHvHJpVV7er+qq7mu5uWw5ukHblgJczjSSK\/b5F2wseiFXMAIa1EzLAWNsBI2\nwQ\/vFmE+5Qc+ZBJmdJzMZj5qgizHwJRdDekwBcEx1S\/9skZO2nCL+V9q4pebCWDTveoxs6r5W8+g\n7ONMHHNNC6kJUhguLSyQTVY+ZoW1aRZ4DwNvpsch7TFD0jsIMUcPZGMUAdVAZlILcVb9ZyZI\/WRU\nPHS3flGjb7kruXtlIZbW1jx5XH9bbeptdGo6HmSG6JbvWUP7h6BF+TFup\/aTLA3kFeIO6o+oree3\n4KhymxtSbEecim2XuZOsrh8Hep7MfNn4+cizhupWjE5FqxmhsWha6qraH9XdpqX3b+kwFfB9U331\nczwvJTmGII8kkk8v+vt\/AZHy3JWvCW6dAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-09\/1285028761-2571.swf",
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

log.info("trant_bean_dead.js LOADED");

// generated ok 2012-06-07 18:14:55 by lizg
