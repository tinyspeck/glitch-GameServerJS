var label = "Collision-triggered Physics Changer";
var version = "1340996960";
var name_single = "Collision-triggered Physics Changer";
var name_plural = "Collision-triggered Physics Changers";
var article = "a";
var description = "Adjusts the physics of a player when they collide with it.\r\n\r\nAdjustments are percentages of the default value. See: http:\/\/svn.tinyspeck.com\/wsvn\/main\/clientNew\/src\/com\/tinyspeck\/engine\/physics\/avatar\/PhysicsSettables.as\r\n\r\nAlso, jetpack can be 0 or 1 (NOT false or true)";
var is_hidden = true;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["physics"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.width = "10";	// defined by physics
	this.instanceProps.height = "10";	// defined by physics
	this.instanceProps.gravity = "1.0";	// defined by physics
	this.instanceProps.vx_max = "1.0";	// defined by physics
	this.instanceProps.vy_max = "1.0";	// defined by physics
	this.instanceProps.vy_jump = "1.0";	// defined by physics
	this.instanceProps.is_permanent = "0";	// defined by physics
	this.instanceProps.removes_ctpc_effects = "1";	// defined by physics
	this.instanceProps.duration = "0";	// defined by physics
	this.instanceProps.vx_accel_add_in_floor = "1.0";	// defined by physics
	this.instanceProps.vx_accel_add_in_air = "1.0";	// defined by physics
	this.instanceProps.friction_floor = "1.0";	// defined by physics
	this.instanceProps.friction_air = "1.0";	// defined by physics
	this.instanceProps.friction_thresh = "1.0";	// defined by physics
	this.instanceProps.pc_scale = "1";	// defined by physics
	this.instanceProps.jetpack = "0";	// defined by physics
	this.instanceProps.y_cam_offset = "1";	// defined by physics
}

var instancePropsDef = {
	width : ["Width of the hitbox"],
	height : ["Height of the hitbox"],
	gravity : ["Percent of normal gravity"],
	vx_max : ["Percent of normal max velocity along the x-axis"],
	vy_max : ["Percent of normal max velocity along the y-axis"],
	vy_jump : ["Percent of normal y velocity when jumping"],
	is_permanent : ["Should the effects remain even after the player leaves the location?"],
	removes_ctpc_effects : ["Does it remove the effects from other CTPCs?"],
	duration : ["How many seconds to do these effects last?"],
	vx_accel_add_in_floor : ["Percent of normal horizontal acceleration when on a platform"],
	vx_accel_add_in_air : ["Percent of normal horizontal acceleration when in the air"],
	friction_floor : ["Percent of normal friction when on a platform"],
	friction_air : ["Percent of normal friction when in the air"],
	friction_thresh : ["Percent of normal friction threshold (this higher it goes, the quicker you come to a halt when slowing)"],
	pc_scale : ["scale of the avatar"],
	jetpack : ["jetpack on (1) or off (0)"],
	y_cam_offset : ["Percent of normal camera offset (150)"],
};

var instancePropsChoices = {
	width : [""],
	height : [""],
	gravity : [""],
	vx_max : [""],
	vy_max : [""],
	vy_jump : [""],
	is_permanent : [""],
	removes_ctpc_effects : [""],
	duration : [""],
	vx_accel_add_in_floor : [""],
	vx_accel_add_in_air : [""],
	friction_floor : [""],
	friction_air : [""],
	friction_thresh : [""],
	pc_scale : [""],
	jetpack : ["0","1"],
	y_cam_offset : [""],
};

var verbs = {};

function make_config(){ // defined by physics
	return {
		w: this.getInstanceProp('width'),
		h: this.getInstanceProp('height')
	};
}

function onPlayerCollision(pc){ // defined by physics
	log.info('Player '+pc+' collided with physics changer '+this.tsid);

	if (this.state == 0){
		log.info('Physics changer '+this.tsid+' disabled.');
		return;
	}


	var gravity = this.getInstanceProp('gravity');
	var vx_max = this.getInstanceProp('vx_max');
	var vy_max = this.getInstanceProp('vy_max');
	var vy_jump = this.getInstanceProp('vy_jump');
	var vx_accel_add_in_floor = this.getInstanceProp('vx_accel_add_in_floor');
	var vx_accel_add_in_air = this.getInstanceProp('vx_accel_add_in_air');
	var friction_floor = this.getInstanceProp('friction_floor');
	var friction_air = this.getInstanceProp('friction_air');
	var friction_thresh = this.getInstanceProp('friction_thresh');
	var pc_scale = this.getInstanceProp('pc_scale');
	var jetpack = this.getInstanceProp('jetpack') || 0;
	var duration = this.getInstanceProp('duration') || 0;
	var y_cam_offset = this.getInstanceProp('y_cam_offset');

	if (gravity === null || gravity === undefined) gravity = 1;
	if (vx_max === null || vx_max === undefined) vx_max = 1;
	if (vy_max === null || vy_max === undefined) vy_max = 1;
	if (vy_jump === null || vy_jump === undefined) vy_jump = 1;
	if (vx_accel_add_in_floor === null || vx_accel_add_in_floor === undefined) vx_accel_add_in_floor = 1;
	if (vx_accel_add_in_air === null || vx_accel_add_in_air === undefined) vx_accel_add_in_air = 1;
	if (friction_floor === null || friction_floor === undefined) friction_floor = 1;
	if (friction_air === null || friction_air === undefined) friction_air = 1;
	if (friction_thresh === null || friction_thresh === undefined) friction_thresh = 1;
	if (pc_scale === null || pc_scale === undefined) pc_scale = 1;
	if (jetpack === null || jetpack === undefined) jetpack = 0;
	if (y_cam_offset === null || y_cam_offset === undefined) y_cam_offset = 1;

	var hash = {
		gravity : floatval(gravity),
		vx_max : floatval(vx_max),
		vy_max : floatval(vy_max),
		vy_jump : floatval(vy_jump),
		vx_accel_add_in_floor : floatval(vx_accel_add_in_floor),
		vx_accel_add_in_air : floatval(vx_accel_add_in_air),
		friction_floor : floatval(friction_floor),
		friction_air : floatval(friction_air),
		friction_thresh : floatval(friction_thresh),
		pc_scale : floatval(pc_scale),
		jetpack : intval(jetpack),
		y_cam_offset : floatval(y_cam_offset),
		duration_ms : floatval(duration)*1000
	};

	if (intval(this.getInstanceProp('removes_ctpc_effects')) == 1) hash.removes_ctpc_effects = 1;
	if (intval(this.getInstanceProp('is_permanent')) == 1) hash.is_permanent = 1;
	pc.addCTPCPhysics(hash, this.tsid);
}

function onPropsChanged(){ // defined by physics
	this.apiSetHitBox(intval(this.instanceProps.width), intval(this.instanceProps.height));
}

function setActiveState(state){ // defined by physics
	if (state == 0 || state == 1){
		this.state = state;
	}
}

// global block from physics
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
	"no_trade",
	"no_scale"
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
	"no_trade",
	"no_scale"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("physics.js LOADED");

// generated ok 2012-06-29 12:09:20 by jupro
