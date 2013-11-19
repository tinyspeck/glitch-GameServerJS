var label = "Avatar Smallifier";
var version = "1346352632";
var name_single = "Avatar Smallifier";
var name_plural = "Avatar Smallifiers";
var article = "an";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1250;
var input_for = [];
var parent_classes = ["avatar_smallifier", "physics"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.width = "75";	// defined by physics (overridden by avatar_smallifier)
	this.instanceProps.height = "130";	// defined by physics (overridden by avatar_smallifier)
	this.instanceProps.gravity = "1.0";	// defined by physics
	this.instanceProps.vx_max = "0.8";	// defined by physics (overridden by avatar_smallifier)
	this.instanceProps.vy_max = "1.0";	// defined by physics
	this.instanceProps.vy_jump = "1.0";	// defined by physics
	this.instanceProps.is_permanent = "0";	// defined by physics
	this.instanceProps.removes_ctpc_effects = "1";	// defined by physics
	this.instanceProps.duration = "10";	// defined by physics (overridden by avatar_smallifier)
	this.instanceProps.vx_accel_add_in_floor = "1.0";	// defined by physics
	this.instanceProps.vx_accel_add_in_air = "1.0";	// defined by physics
	this.instanceProps.friction_floor = "1.0";	// defined by physics
	this.instanceProps.friction_air = "1.5";	// defined by physics (overridden by avatar_smallifier)
	this.instanceProps.friction_thresh = "1.0";	// defined by physics
	this.instanceProps.pc_scale = "0.6";	// defined by physics (overridden by avatar_smallifier)
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

function onCreate(){ // defined by avatar_smallifier
	this.initInstanceProps();
	this.apiSetTimer('apiDelete', 120*1000);
}

function onPlayerCollision(pc){ // defined by avatar_smallifier
	var physics_list = pc.getPhysics();
	for (var i in physics_list) { 
		if (physics_list[i].location_tsid == pc.location.tsid) { 
			var current_physics = physics_list[i];
			break;
		}
	}

	if (!current_physics || !current_physics.pc_scale || current_physics.pc_scale != floatval(this.getInstanceProp("pc_scale"))) {
		pc.announce_sound('SMALLIFY');
	}

	this.parent_onPlayerCollision(pc);

	pc.apiCancelTimer("announce_sound");
	pc.apiSetTimer("announce_sound", 5000, "BACK_TO_NORMAL");
}

function make_config(){ // defined by physics
	return {
		w: this.getInstanceProp('width'),
		h: this.getInstanceProp('height')
	};
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

function parent_onPlayerCollision(pc){ // defined by physics
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"no_scale"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-100,"y":-150,"w":200,"h":151},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAErElEQVR42u2We0xTVxzHqzycL8Qw\nt5G5JeoWnX8smixjMXGQuWQmc4uJ0z\/Ylk2zMU1kLtkmapQbHDJABNcpAxcQBYFWnNoW5FFooR2F\ncuVRSumD0hf0eW\/vq\/dBCzm7nfrH\/gfqkn6TX8755d5zzye\/8\/v9zhUI4oorrrj+I7U6sP65Bhw3\nI289d1CDY94t0RGGgxssNnR\/dD487NkUczCHiyweHfcfUyhAYtTXG5EPHA7igMWCblbp8I1abSDT\naHwCHBPpDFjmzGyo5Zk\/bSdOTjuIL5\/5Exa0wG7HDsUrM66lFDgsSACQIBFWWV8ffOzfq4GRDPge\nnA5yBElAIFgRc0BbxcFUXWP1jrH+yZ8NpmCvYRIZMBj99fqR6RwefGXMAQMVH6VPtIqOmIYNbVNW\njHO6qIUpKx42mnxyhVi8LuaArvJP3zBK75ya1hlgixVb4HvjgtWGhQyGWdlYR8dLMQdEyrJ2TDWX\nHzVrVN3myRnCbnGTjmmv0zxhE8YUEACwEljaVuFVh97Bqw7uM7ff\/8M4rJ82D+v1k1r4z8nenmwg\ngdaA6pykaCHFAjABG1Gk4ne+\/dDddC5nqlNUb4Vhm2VQazSpVdf896FdVFvRJrQBSgHQzuRYACYB\nm+IVr+TXbzyqu0pn5+1mq1ZLO0fhsEkhr3HYAma8TbgNtJ9Ln4XS18QCMJnrqdyOSC+exB+ePe+U\nXqt1DXSZbP1KxCO5nOfvqD7mf1j8PiXO3Rk4vX19LABXEW2F75EPzuShkou\/eQZkPrekTGjvbla7\n1Q\/UeGvBd8GWvE\/IphN7MGhXaiwAXwjJoP2kJL8Ee1R80913z4799VOhT1ZSN6tsHsBbL50lH+Z\/\nRTTlfjxT9G7asgOSirIXQ+2XsqmOohuEvFyEKm90EdL8a1hrYS3aXiHCOy6XYtJffgyKTn3hvbxn\n+dsN3vLDVqq7PJdSXG2h+663UkqhhOoqaaC6SsWUvPQu2XO1hpRfKcIenP4+ULE3fdkBsZbc3ZS6\nsoBWVclpTU0fM1jby+olakr5ewelEHZSmltSSlN3k9bUVaLCrM3LAgVBYOXT\/FsRbL9ygB2X1bPa\n+qE5uHGE1TbAdH+Nihmo1dCDt2B24pGWs6j7aLipjtDUZohdrtWQXp8cXbuYlfDvx8r7+1dHN7jt\n9a6Vmlyv4hy3jXaM1UQIn51wGUjGqUNYk8LOjd7TMUONE+xjkZGbUlvn3AYzOzuuo332Qjoc3s2y\n7JboDbQk0ROLQcLT6G0IMUw2h3uVEYbwhKkgFkJncdI\/Q3DoTCASsLm4gM07T3h9YRLxzBE+61wI\na14A4MI8AJ\/z61+ONvmlai0beXt7fh6coFm2ibeecDg8FAqFTDiOu4PBoAtBECtvNpqmDXzE\/uaf\ni\/l5ETs3dx7DsKMUG8niAHgTZZjN921Y6mIDJjIMeI0FYJ8PJ49TFA2RJFnCg1zgOE7o8\/lkTpdr\n2OPxKDGCqOPBiyORyBn+neMUw3zmwahML8tunSFBWhuKplzX69dVw3AStJjHflgsThDzPwrRZAdP\nxrXRW4W3FIqi9iEY9jVCEBm8n6Zy4NGIJy5Z3sUVV1z\/A\/0Dw2s01oZlDtIAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/avatar_smallifier-1345593891.swf",
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
	"no_auction",
	"no_scale"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("avatar_smallifier.js LOADED");

// generated ok 2012-08-30 11:50:32 by lizg
