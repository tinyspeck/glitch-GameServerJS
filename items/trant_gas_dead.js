//#include include/cultivation.js

var label = "Dead Gas Plant";
var version = "1339118095";
var name_single = "Dead Gas Plant";
var name_plural = "Dead Gas Plants";
var article = "a";
var description = "A tree that won't be producing any more gas.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["trant_gas_dead", "dead_tree"];
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
		"Ahhh: beautiful day. Beautiful.",
		"Why not? Yeah.",
		"Yeah… better to burn out than fade away…",
		"Such a beautiful day to die, man.",
		"It's been a gas, friend. See you in the ne…",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-60,"y":-113,"w":120,"h":114},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJIklEQVR42uWZa0yb1xnHmdqItFtH\n06Tt1GThkoSEBDDEhFsM5m7AxhiwjbGNbYyxDYaYO4SbCbeYWyBcS2jq3LOQLDTJUNulC5kSTd2X\nMSlSNO0L\/VKparqhbp328b\/zvPBSNKVNm4CEVEuP9Nrv+57zO\/\/n\/zznILy8fmofc84hgS7zoCcz\n1t9308GZFMEuXWYQsuL8xJsOrqLg8FCRIgSKhD2Lmw6uwRwpqNAKoZceZOoFDG06wDpTtMehOYx8\nyX5Kb\/bmUk8l9Kk2HEGpOowD3HTFUaWNyG4qOQpLXigHmCIM8NlUgLWGqCGWYphzQjgPyuP9nN+l\ndL0pashlFy\/WGKNRXhABQ9YhFKQfQKHs0JIpO3i+KCfk+aq\/Wh8uqCo8IuZj7b1KnXCRVTCoggtl\nB5EtDlj4\/\/cr9RGuWlMUGsyxsKvCoE4NpGKapXb0TEuUMGoit6vDXJbcUC5M8mBXbtJeFw1AKavU\nRSw4NOEoyw9nKz8MNiEL4SyB0\/UxVsHkQYKkyWUif8G3BRQ1W1cUjWpD5KrKWXH+88+tFFPE49QJ\nwYBRzAYsyRMsGWQHF+TxAS7msSGWikWCXYaMAE1OHiRA9iynoiJhudU0lxz1tJclcM\/YVMsLYH3y\nxQuJQNmKFwmAYEm5goyg2dwkf199WqCAJuIBSVECYKnnFKJiUSbvW2qzx7tOOBJRY4zkxqAFrKTW\n81QL6YXOWlOki4LLoiLYaVV9T8G5rSk+DcUx8zQBgZDPKD3qtMBZFgu8ipTe8gLhKnBxTihM8hCQ\ncg3mGAYXwSnLq7c2\/VQ45E82xxL\/PolB89CWmZe8z\/lMNV32eA8pxEOSSlz1ZRwAS\/eq\/+ge78NK\nXST4d8gqpKpRHswqPACr7UknNFZoDy8eYwsozg3loBgQLWKePCqP91+k+EEpZ2p4Wm1xXLpIORqQ\nVkiD0neCK1EKUM+grMqwVTUp6D4Balg7IUCbMiS71hi5UMc9u+xZAmMwC2u9ScVJlf6DfdleKl6g\nVsFPSkoRIE1Cv\/EqOfKFzI\/LcOQ9Kg5KMd0jK9AY9D5fUMtK+RmfNuePKibyZIstfnFtqmlSAqQ0\nU5CyrD2ttiK+sukeQVPQ82QNeo4UXdetsaM8UUDmP245Cto9nLojnHKkCE1MqpI3qRnzCtJvdJ9g\ny1cWRlsiwT2tol8c0pHk6SxPAgV5ktJEEHyQn4pX2hApt\/YevwCCY6ld2pB9u8uR5Ev9rdkqAut1\nXLGoUgI5Vfi0FTJvrm0vlHpSmqp\/uSACNvbc2FmeOE+pJkCKck0EchP3QiHewzVjvTQIrIWsVjKl\nn4qFgm83tbkJrg0ETHK5SsUcHPmRtjq+oVOV0q5CfqOgPshvcwRH7Yb1OQyrtUvXy50LGwLYWhon\nJg8SJMEtn1RiQL2SUk8HWL7aub65ckggdUm99BhfnNGb0JEkWf80z9XU+F4uLZstzYrgFCSwRqNo\nBTCepfbb3YOP5e0vmPOrjKl3TC7G6Vw1GoQpG3O4ndQb\/livSIZTG4lWsxiDehUHSEEprzFEwcxS\nqmGFw6tG+3BuQiDGiw24YLOhO036EMAvWby0rnBswFd\/U1fnHDcUYlSvRYtKgmmzGS0FaRww34Lo\nWpsexAEaWfUWsebs0kgxodKgNS4ZYyZrHRvrHRY+6wX2MxavsAj4eHDEdsHhwFiBFpMM9JyjDD0q\nBbLj9kHP0sifJfmg9Frkh+ExFKE\/IwttcSl4eP6KkY0VwcKfxl0PwF+w+BWL5Ptj7\/WMZSoxmJqF\nEeali8cqONi2vEyuAKgfsjMhp5xZEcxBduiycKHIAne8BE0HovCvz78U0VgsJCyCXhTOm8WBb775\nWv+PJ09KrtUdvzuepYY7JhWnEmUYz9FwgKc1GkwYDehUyVGYGsbtKLqMIGhTg3HeYMZArARdoXFo\nDSE2xK8A0qK3vGhqt33xxecpn\/7pfsfMpenr08bi\/04ZjBhMZnBSFfpF6XBHp6DvqIQDpuuBhAw0\npycjI9YPjfIUnDyShN6YFAynKzCiNeLO1FT9B9evRt2Zmdl5ra5u7lZ3z2U2z\/YfBXejpa303tmz\nNQ8++ah5\/u5cl+fdgQ9HKx3ojU6Fm004np\/PPGjAiFKNIVkORuRKjGSrcCo9G0OZCpxi0ZErQ68m\nDyN5KkzpjThTZMVAWg66k6X\/bCpVflaWn3RxvM810NvRao0K3btr\/w6v186abYJnn6QrK18\/Mzos\n+fOnD6fu\/+H3F2\/fuPgXT08bJguNcKfJ0aPIgDtPir44CfpEEgwkZeJsSQnGtTpMagsxe6Idl2tq\nubhQVY2rtfV4V2XAoFKLQY0BE6ZSDFhNON1ZjVZnIRpL8\/\/6297ue+crKr7MCxfY\/d\/yevs74XZ5\neb1iKZCnfnjrZt\/t2WszIz1NX12c6MV4nR2djXk401WDudHT8Iw1oyNFinZhPNxRyVyKe0Vp3PWA\nOBOnUuU4rSxAl92C+mwFWsNEGCgrgLvShonuRlwe7MaVqQ5MuqsxO33qwZkhd+90f3f77XPTRVar\n9em+JImFe9\/a01vlaLg5Ovy7B+9N497wMD7u68OlE1U42a6GZ6gFN86NYKDFhtYSCWq1YpxghTGU\nq4Q7VYpaYTT6UzIwodbj\/S4Xhnvb0X+iGYNNxzDosmK8vQrD7Q70N5gx5S79etRlfjJUUvLYlCyq\nvtrY+PcRk\/k+Q\/n+Bv6By5V5pb5hoddSfK8hO+sjQ2zUTEF6yFxNhfizOkv237rrLf9psMhQpoxi\ngPGo1Segp0COdpsMFWq2P+cn4KSafTdm4HihFMcNMjgtiTBmh8MoZQdXtlXa8mI\/yUnf2+i7Y6v2\n1294S\/a\/vdX\/eQrZe+drXtv373j1nYBtW3fv2r4lcve2l0W73\/BOTYg6lFebl35rpq4G5YqExxUK\n8Vc6ieCRPl3wSJMa8ihLFHinU537cEJXCIqSrOhuTVy4fcxWdPNSlfNx9P6damdqYtPZYgvOWW30\nF5\/3eu14L5EV\/F73en2yqOju+3b7k0aZdK4rX3lj9\/atybQAvze3hO1603ufr89Wf1rUzh3egfTi\nlErlUxkbJ23LkOlsiYkCr43+eOz2GqbOv80ikYN9\/flP7r8G\/wPEn7\/acjMxvgAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-09\/1285567144-8028.swf",
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

log.info("trant_gas_dead.js LOADED");

// generated ok 2012-06-07 18:14:55 by lizg
