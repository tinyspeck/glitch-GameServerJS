var label = "Anti Gravity's Rainbow";
var version = "1346350344";
var name_single = "Anti Gravity's Rainbow";
var name_plural = "Anti Gravity's Rainbows";
var article = "an";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["anti_gravitys_rainbow", "physics"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.width = "25";	// defined by physics (overridden by anti_gravitys_rainbow)
	this.instanceProps.height = "25";	// defined by physics (overridden by anti_gravitys_rainbow)
	this.instanceProps.gravity = "-5";	// defined by physics (overridden by anti_gravitys_rainbow)
	this.instanceProps.vx_max = "1.0";	// defined by physics
	this.instanceProps.vy_max = "1.0";	// defined by physics
	this.instanceProps.vy_jump = "1.0";	// defined by physics
	this.instanceProps.is_permanent = "0";	// defined by physics
	this.instanceProps.removes_ctpc_effects = "0";	// defined by physics (overridden by anti_gravitys_rainbow)
	this.instanceProps.duration = "2";	// defined by physics (overridden by anti_gravitys_rainbow)
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

function onCreate(){ // defined by anti_gravitys_rainbow
	this.initInstanceProps();
	this.apiSetTimer('apiDelete', 5*60*1000);
	this.setAndBroadcastState('loop');
}

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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_scale"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-100,"y":-181,"w":200,"h":182},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFLklEQVR42u2XfVDTZhzHq+iciqi8\nFkEotIqrd1OG22S+4ESd25h4U5nTwYlMZOOYL9tA50vOqiA632XKpgKVQ6y78TLEqThEGKDyMrUK\npbSBvlDaJk3aNC9Nu8sSt\/2\/P3ThbnzvPpfkkufJ537P73J5BILhDGc4wxnO\/yMMI\/BiGc0yYmiJ\nCQQjGEAwkjEGj2OsURM40SElaAQE49SArw\/WIQxwOKb7t7UJRg8pQSXg4wsCAUKkRSgiYEmoWi0Z\nM6QEuwH\/Ker9gWL4bpiUMkvEDCN6eSj1n1f37qAItUw4c6AxLAaDJdJW2NcHYASjWEYCAPMM\/pZX\nKvBW7xRKe2XBMba74nm4RRrdpPOfUqiZPPGUWjBmTYHSm4M3QXW0d4Am23+O5kDAfKgpbCkBz4i9\nro2IOqsKDbnQ7T8hWd4byMFfBWMmh6l2BizQ5AUusbVEfEAiMxbV9IbFfN8VMv1MV4jfhqIuEQdv\ngg\/n+Ef1fBW4TJMblAC3RCQ54ajl1aAorkQdHl0EioSppWopB2+Cna9Pmq3OCUrU5gnXQM3iFNwm\nXVHVF\/5+kXbqghJNcNhGuWYOB2+Cj97wje3NCVqrzQ9OtjaLNxOwNKlSJ\/roEihafqk3VJJWqlvI\nwV8PvuW3uDdbmKo9FLwJuT9tC4nMTKnRRW4s64tcVd4X\/kpamW45B2+Cj2ODEtQ5wkzt4SlZtnuS\nHBKduanGJM4qN4hTyg0Rs9Ku6j\/k4E1QtVS8VrsrNLv\/eGi2vT0SoOzSrGqjJKdcP22zYkAck\/7j\nwCeZFeZk\/r6DibM\/7dsXJdOfjpKhnbMPU8652bWmWbKfBqO3V1vmzd9WY\/18+zVLJm+C4PoFW3W5\nrx3TF8YctT+cW+Cyvy2rs84\/WmON23sTXrls1w1ox+4b0E7eBPtS4r\/RHYk9ZyyKPet4vPiiy5Hw\nbT0Uf+4m9E7+XSQ1cV89ckB2GznIm2B\/+nuA4cTCEmNxnNzZteyyB19Z0AC\/W3LLlnC6Bc1Iym2w\nn8hrsJ\/kr4KZKw8azyy5YipdchVTJVTQeNKFJjRR0YCuOv\/AuTX5cBP2w5Em7Dxvgoavk4+ZCldU\nmi4nVOE9q6\/RRHLpb46k6kZsfVk7viP9RKuzjIM3QdO+rO8sJeuuWys+vk5qN9bRRE51O55Wd8+Z\nXvWUyttW2E5UcvAmaD65t9iiyKyHajPqSd0XjR5y\/41OfEtzO7m9DnTJc8uVRH3JI+rWfyb0z98x\nwzAjQASZZKuU\/wLVAveR+l33SCPQ5qHy7zyhgN+fUEcemOk7l1oN7ie3QboTwvEQhV4\/FlAqX+LG\nPs\/N7rPJjjU3j+VeIB8cHP+zSh+CUpQYo+htbrPRgIAdKAo2DJLWKxqPS97RQx1X9VBnlTb64c1u\nq3ug1+YxOynqS5ymo0mSjGAFX8wWQKFgvP6u3kQnQaxz0XQpDVtR0gJimEXjtNu0BEX22VHPY9Tm\nUqGkG+63ON0YQrghmqYv\/sEwezwMs54dH8TyYram7MSTWV71eJjPcBwvxknyV4rA2jEHokUQK2Sz\nDVogyApCEASy95+yFWtl5arY81zS5dqNIEgqRroXUQwzDSaI0AoQmfS8BUcRBDOVZJh4M+rIwDAc\ncDgc+azIHoqiTpnN5hqdXt9hMpnuIHZ7sdPpPOR2u3ewz2RgBLHahGBxgyQZaXAwfrUw7FOgVHoX\ntrWNBp7nsq9RKLwUDOPFNTvz13E8yxgWHwzD4iEE2QDZ7W+y136N\/ShX8VEvrO+G8y\/yJ8H1I2Tw\ncKDTAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-12\/anti_gravitys_rainbow-1324340522.swf",
	admin_props	: true,
	obey_physics	: true,
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
	"no_trade",
	"no_scale"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("anti_gravitys_rainbow.js LOADED");

// generated ok 2012-08-30 11:12:24 by lizg
