var label = "Avatar Embiggenifier";
var version = "1346352641";
var name_single = "Avatar Embiggenifier";
var name_plural = "Avatar Embiggenifiers";
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
var parent_classes = ["avatar_embiggenifier", "physics"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.width = "75";	// defined by physics (overridden by avatar_embiggenifier)
	this.instanceProps.height = "130";	// defined by physics (overridden by avatar_embiggenifier)
	this.instanceProps.gravity = "1.0";	// defined by physics
	this.instanceProps.vx_max = "1.0";	// defined by physics
	this.instanceProps.vy_max = "1.0";	// defined by physics
	this.instanceProps.vy_jump = "1.0";	// defined by physics
	this.instanceProps.is_permanent = "0";	// defined by physics
	this.instanceProps.removes_ctpc_effects = "1";	// defined by physics
	this.instanceProps.duration = "10";	// defined by physics (overridden by avatar_embiggenifier)
	this.instanceProps.vx_accel_add_in_floor = "1.0";	// defined by physics
	this.instanceProps.vx_accel_add_in_air = "1.0";	// defined by physics
	this.instanceProps.friction_floor = "1.0";	// defined by physics
	this.instanceProps.friction_air = "1.0";	// defined by physics
	this.instanceProps.friction_thresh = "1.0";	// defined by physics
	this.instanceProps.pc_scale = "1.2";	// defined by physics (overridden by avatar_embiggenifier)
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

function onCreate(){ // defined by avatar_embiggenifier
	this.initInstanceProps();
	this.apiSetTimer('apiDelete', 120*1000);
}

function onPlayerCollision(pc){ // defined by avatar_embiggenifier
	var physics_list = pc.getPhysics();
	for (var i in physics_list) { 
		if (physics_list[i].location_tsid == pc.location.tsid) { 
			var current_physics = physics_list[i];
			break;
		}
	}

	if (!current_physics || !current_physics.pc_scale || current_physics.pc_scale != floatval(this.getInstanceProp("pc_scale"))) {
		pc.announce_sound('BIGENNIFY');
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
		'position': {"x":-100,"y":-141,"w":200,"h":141},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEg0lEQVR42u2XW2wUVRjHC22h0Eo1\nFfFuBEwfTIxElBhDwFQTH3jTxgQeBB4QQ6KJkQBGsokYrEpMBIx0Q4G2SUu3BSuFbZdedrvbbne3\ns9eZvc\/s7Hbv17lfutvmOAP22ZiUDib7T76c+8wv35zznW9qaqqqqqqq\/j9yIfn3faH89+5AvvWx\ngbJYstucSOk9ue7zlV5JpJgrgccJMLZA9jg82XdX2tEF8tuVul6PN6AR6hyC5JoUA9RoQK3Nln69\nE4LqH3gxTOxbGUP8hY8hqV+rDW9U3JN6AOrkEoKSm6un8b9IBWrWa0B7rcmUfNlqz+2dgwp7xiDo\nuU7wVn0NqFmnOOA41tE85R5ttbkjJ33B0rTXX7D4grlepz9yTIZXfu\/lVM+aAoZ2TzCiRTFCXIgz\ny2iELPvQ3IQe0TQpDjgW\/3GnOaD\/yh+LQmGMWI7F6WUUJ1hvODNidBi3Kg44Q59rNeLDR9wRz6Qf\ny1JYLE\/HksUYjMYu6ty6ZxQDAwCsl2zDDHlpt5n8rc2KznTCaBRDwjjiRGG1GTMdhIBqszxPKcDa\nPAg8YSO7P7BkBj+3Rg19SDQUcWM+vz1ivzRL\/PwmRF94Ggf6BqDEaZYA6xkQ3urK6Y76MvMGe2Jy\n0IsH2FAyvAihtqvReCHkEbq2+8HtFj3YX6cE4IYwmNzhKY2cgOlbZ+ZTf6m9SXcQjnkK1vzAqfnc\n0FE73bsXEXt3XscPNygBuBHm+nfD9NBJL333gidjcjjTU7ehuNGEpMwzdvrGMSulPmAj1W\/rwDeN\nSgA2wGzfhz52uMPP6NT+vCXsJIYv2\/PD1+Hs7JyL7TvtZK99ZmevfDReOtW85oDy3vLxtz4NcKNq\njDP0+0n9uIcZuozQw1dh8t6A5NlfXOzNr22U+tBE4kzLmgPKByDIjZzAWP1QlLPcQxmDLsCO9gZY\n7UCQ1w4GOW2Xlxk572B6vtQxqrWPhy6ue1eYm1RFubmJBOc2JgTXfEJ0GFBOPyb138d54x2cM1zD\nef0f9\/Oq59cmc1E9DLrS\/lsHU3cOJEVnd4p3Qxkh4JJKT5SzmmK8dU4yqQ+25cuh6Zgw2xvkpt\/R\nxOObVAiyQV67mifhwcN+NZs3yS\/oyWQaR4LxF0hR3JEVo13CEhUtMRmG5HLFooAnsuWAOyl4kJQA\nBwpiBKPKqVBRjCHEYvYHrlzeJQjCq4\/sZpFT+3+818zy\/EFGJKbFCp8WFtkSzVIkQRVoTiTzQoWM\ns2IpIywxWaHMpLkyiQll9uYyAGeXADgkrd8mB\/lHFVqekuyNpSXwBScI\/ZJNlcvleZZlgyRJpkql\nUrxQKGCS4RzH+SSPzUrjGql+Xlhc\/I4giCOMUNkvAvBakedf\/BMnnlxtwDqeBy8JALRlSfo4w3Aq\nmqZ\/kkDOiqJ4MZvN3l2Ixx3pdNpAUNQNCbyjUqmcluYcZ3j+kzTB7MsIwvYEDVq0xeKW3xGkSf7Z\nUq3mZ2\/XaGo1UqIgb3bwsGyUbxXJtjAM01YgiMMFitojtVtMMVL2eJ1iGU1VVVVV1b\/rb+ILW2th\n0UZwAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/avatar_embiggenifier-1345593849.swf",
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
	"no_trade",
	"no_auction",
	"no_scale"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("avatar_embiggenifier.js LOADED");

// generated ok 2012-08-30 11:50:41 by lizg
