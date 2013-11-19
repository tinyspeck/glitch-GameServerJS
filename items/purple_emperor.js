var label = "Purple Emperor";
var version = "1323122804";
var name_single = "Purple Emperor";
var name_plural = "Purple Emperors";
var article = "a";
var description = "The Purple Emperor sees and knows all.";
var is_hidden = true;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["purple_emperor"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function finishUp(){ // defined by purple_emperor
	if (!this.pc) {
		return;
	}

	this.pc.sendActivity("You are starting to feel a little less weird.");
	this.feeling_better = true;
}

function getRandomPosition(){ // defined by purple_emperor
	var x = -300 + (Math.random() * 600);
	var y = -75 + (Math.random() * 150);

	x += this.pc.x;
	y += this.pc.y;

	x = Math.max(this.container.geo.l + 100, x);
	x = Math.min(this.container.geo.r - 100, x);

	y = Math.min(-100, y);
	y = Math.max(this.container.geo.t + 500, y);

	return {x: x, y: y};
}

function manifestQuoin(){ // defined by purple_emperor
	if (!this.pc || this.feeling_better) {
		return;
	}

	var pos = this.getRandomPosition();

	var quoin = this.container.createItemStackWithPoof('quoin', 1, pos.x, pos.y);
	var small_classes = [
		'small random mood',
		'small random energy',
		'small random xp',
		'small random currants'
	];
	var big_classes = [
		'slow medium-large mood',
		'slow medium-large energy',
		'slow medium-large xp',
		'slow medium-large currants'
	];

	if (is_chance(0.05)) {
		quoin.setInstanceProp('class_name', choose_one(big_classes));
	} else {
		quoin.setInstanceProp('class_name', choose_one(small_classes));
	}

	this.apiSetTimer('manifestQuoin', (Math.random() * 10 + 10) * 1000);
}

function manifestStrangeness(){ // defined by purple_emperor
	if (!this.pc) {
		return;
	}

	var pos = this.getRandomPosition();

	var flower = this.container.createItemStack('purple_apparition', 1, pos.x, pos.y);
	flower.setPC(this.pc);

	this.spawn_count++;

	if (this.spawn_count < 5) {
		this.apiSetTimer('manifestStrangeness', (Math.random() * 5 + 12) * 1000);
	}
}

function onPlayerEnter(pc){ // defined by purple_emperor
	if (this.container.isInstance('purple_journey')) {
		if (this.feeling_better) {
			pc.instances_exit('purple_journey');
			return;
		}

		pc.buffs_apply('purple_journey');
		this.pc = pc;
		this.spawn_count = 0;
		this.apiSetTimer('manifestStrangeness', 3 * 1000);
		this.apiSetTimer('manifestQuoin', 6 * 1000);
		this.apiSetTimer('finishUp', 85* 1000);
	}
}

function onPlayerExit(pc){ // defined by purple_emperor
	this.pc = null;
	this.apiCancelTimer('manifestStrangeness');
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":0,"y":0,"w":40,"h":40},
		'thumb': null,
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/missing.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("purple_emperor.js LOADED");

// generated ok 2011-12-05 14:06:44 by mygrant
