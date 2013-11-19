var label = "Random Hole";
var version = "1344456367";
var name_single = "Random Hole";
var name_plural = "Random Holes";
var article = "a";
var description = "";
var is_hidden = true;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["random_hole"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.width = "10";	// defined by random_hole
	this.instanceProps.height = "10";	// defined by random_hole
}

var instancePropsDef = {
	width : ["Width of the collision box"],
	height : ["Height of the collision box"],
};

var instancePropsChoices = {
	width : [""],
	height : [""],
};

var verbs = {};

function findHoles(){ // defined by random_hole
	this.holes = {};

	for (var tsid in this.container.items){
		var item = this.container.items[tsid];
		if (item.class_tsid == this.class_tsid){
			this.holes[item.tsid] = item;
		}
	}
}

function onContainerChanged(oldContainer, newContainer){ // defined by random_hole
	this.findHoles();
}

function onContainerItemAdded(item, oldContainer){ // defined by random_hole
	if (item.class_tsid == this.class_tsid){
		if (!this.holes) this.findHoles();
		this.holes[item.tsid] = item;
	}
}

function onContainerItemRemoved(item, newContainer){ // defined by random_hole
	if (item.class_tsid == this.class_tsid){
		if (!this.holes) this.findHoles();
		delete this.holes[item.tsid];
	}
}

function onPlayerCollision(pc){ // defined by random_hole
	if (!this.holes) this.findHoles();

	var hole = choose_one_hash(this.holes);
	pc.teleportToLocation(this.container.tsid, hole.x, hole.y-120);
	pc.addCTPCPhysics({gravity: -2, duration_ms: 1100}, this.class_tsid);
}

function onPropsChanged(){ // defined by random_hole
	log.info('Random hole properties changed');

	this.apiSetHitBox(intval(this.instanceProps.width), intval(this.instanceProps.height));
}

// global block from random_hole
var hitBox = {
	w: 10,
	h: 10,
};

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
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
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
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

log.info("random_hole.js LOADED");

// generated ok 2012-08-08 13:06:07 by eric
