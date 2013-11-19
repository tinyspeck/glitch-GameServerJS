var label = "Collision-triggered Geo Changer";
var version = "1340998286";
var name_single = "Collision-triggered Geo Changer";
var name_plural = "Collision-triggered Geo Changers";
var article = "a";
var description = "Used to change geo elements on collision (like changing perms on plats and walls)";
var is_hidden = true;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["ctgc"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.width = "10";	// defined by ctgc
	this.instanceProps.height = "10";	// defined by ctgc
	this.instanceProps.event_1_plat_pc_perm = "-1";	// defined by ctgc
	this.instanceProps.event_1_plat_item_perm = "-1";	// defined by ctgc
	this.instanceProps.event_1_wall_pc_perm = "-1";	// defined by ctgc
	this.instanceProps.event_1_wall_item_perm = "-1";	// defined by ctgc
	this.instanceProps.event_1_tsids = "";	// defined by ctgc
	this.instanceProps.event_1_decos = "";	// defined by ctgc
	this.instanceProps.event_2_plat_pc_perm = "-1";	// defined by ctgc
	this.instanceProps.event_2_plat_item_perm = "-1";	// defined by ctgc
	this.instanceProps.event_2_wall_pc_perm = "-1";	// defined by ctgc
	this.instanceProps.event_2_wall_item_perm = "-1";	// defined by ctgc
	this.instanceProps.event_2_tsids = "";	// defined by ctgc
	this.instanceProps.event_2_decos = "";	// defined by ctgc
	this.instanceProps.event_3_plat_pc_perm = "-1";	// defined by ctgc
	this.instanceProps.event_3_plat_item_perm = "-1";	// defined by ctgc
	this.instanceProps.event_3_wall_pc_perm = "-1";	// defined by ctgc
	this.instanceProps.event_3_wall_item_perm = "-1";	// defined by ctgc
	this.instanceProps.event_3_tsids = "";	// defined by ctgc
	this.instanceProps.event_3_decos = "";	// defined by ctgc
	this.instanceProps.event_4_plat_pc_perm = "-1";	// defined by ctgc
	this.instanceProps.event_4_plat_item_perm = "-1";	// defined by ctgc
	this.instanceProps.event_4_wall_pc_perm = "-1";	// defined by ctgc
	this.instanceProps.event_4_wall_item_perm = "-1";	// defined by ctgc
	this.instanceProps.event_4_tsids = "";	// defined by ctgc
	this.instanceProps.event_4_decos = "";	// defined by ctgc
	this.instanceProps.timer_ms = "0";	// defined by ctgc
	this.instanceProps.timer_fire = "Never";	// defined by ctgc
	this.instanceProps.onEnter = "";	// defined by ctgc
	this.instanceProps.onExit = "";	// defined by ctgc
	this.instanceProps.onTimer = "";	// defined by ctgc
	this.instanceProps.event_1_phys_tsids = "";	// defined by ctgc
	this.instanceProps.event_1_phys_state = "";	// defined by ctgc
	this.instanceProps.event_2_phys_tsids = "";	// defined by ctgc
	this.instanceProps.event_2_phys_state = "";	// defined by ctgc
	this.instanceProps.event_3_phys_tsids = "";	// defined by ctgc
	this.instanceProps.event_3_phys_state = "";	// defined by ctgc
	this.instanceProps.event_4_phys_tsids = "";	// defined by ctgc
	this.instanceProps.event_4_phys_state = "";	// defined by ctgc
}

var instancePropsDef = {
	width : ["Width of the hitbox"],
	height : ["Height of the hitbox"],
	event_1_plat_pc_perm : ["0=soft, -1=hard on top, 1=hard on bottom, null=solid"],
	event_1_plat_item_perm : ["0=soft, -1=hard on top, 1=hard on bottom, null=solid"],
	event_1_wall_pc_perm : ["0=soft, -1=hard on left, 1=hard on right, null=solid"],
	event_1_wall_item_perm : ["0=soft, -1=hard on left, 1=hard on right, null=solid"],
	event_1_tsids : ["Comma delimited string of plat and wall ids to change"],
	event_1_decos : ["Comma delimited string of deco ids to change (based on visibility of event_1_plat_pc_perms)"],
	event_2_plat_pc_perm : ["0=soft, -1=hard on top, 1=hard on bottom, null=solid"],
	event_2_plat_item_perm : ["0=soft, -1=hard on top, 1=hard on bottom, null=solid"],
	event_2_wall_pc_perm : ["0=soft, -1=hard on left, 1=hard on right, null=solid"],
	event_2_wall_item_perm : ["0=soft, -1=hard on left, 1=hard on right, null=solid"],
	event_2_tsids : ["Comma delimited string of plat and wall ids to change"],
	event_2_decos : ["Comma delimited string of deco ids to change (based on visibility of event_2_plat_pc_perms)"],
	event_3_plat_pc_perm : ["0=soft, -1=hard on top, 1=hard on bottom, null=solid"],
	event_3_plat_item_perm : ["0=soft, -1=hard on top, 1=hard on bottom, null=solid"],
	event_3_wall_pc_perm : ["0=soft, -1=hard on left, 1=hard on right, null=solid"],
	event_3_wall_item_perm : ["0=soft, -1=hard on left, 1=hard on right, null=solid"],
	event_3_tsids : ["Comma delimited string of plat and wall ids to change"],
	event_3_decos : ["Comma delimited string of deco ids to change (based on visibility of event_3_plat_pc_perms)"],
	event_4_plat_pc_perm : ["0=soft, -1=hard on top, 1=hard on bottom, null=solid"],
	event_4_plat_item_perm : ["0=soft, -1=hard on top, 1=hard on bottom, null=solid"],
	event_4_wall_pc_perm : ["0=soft, -1=hard on left, 1=hard on right, null=solid"],
	event_4_wall_item_perm : ["0=soft, -1=hard on left, 1=hard on right, null=solid"],
	event_4_tsids : ["Comma delimited string of plat and wall ids to change"],
	event_4_decos : ["Comma delimited string of deco ids to change (based on visibility of event_4_plat_pc_perms)"],
	timer_ms : ["Milliseconds to wait before setting the geo state to timer_state"],
	timer_fire : ["When the timer should start counting"],
	onEnter : ["Comma seperated list of events to call when entering hit box (i.e. event_2)"],
	onExit : ["Comma seperated list of events to call when exiting hit box (i.e. event_2)"],
	onTimer : ["Comma seperated list of events to call when timer fires (i.e. event_2)"],
	event_1_phys_tsids : ["Comma delimited string of phys box ids to change"],
	event_1_phys_state : ["0 - off, 1 - on"],
	event_2_phys_tsids : ["Comma delimited string of phys box ids to change"],
	event_2_phys_state : ["0 - off, 1 - on"],
	event_3_phys_tsids : ["Comma delimited string of phys box ids to change"],
	event_3_phys_state : ["0 - off, 1 - on"],
	event_4_phys_tsids : ["Comma delimited string of phys box ids to change"],
	event_4_phys_state : ["0 - off, 1 - on"],
};

var instancePropsChoices = {
	width : [""],
	height : [""],
	event_1_plat_pc_perm : ["null","0","1","-1"],
	event_1_plat_item_perm : ["null","0","1","-1"],
	event_1_wall_pc_perm : ["null","0","1","-1"],
	event_1_wall_item_perm : ["null","0","1","-1"],
	event_1_tsids : [""],
	event_1_decos : [""],
	event_2_plat_pc_perm : ["null","0","1","-1"],
	event_2_plat_item_perm : ["null","0","1","-1"],
	event_2_wall_pc_perm : ["null","0","1","-1"],
	event_2_wall_item_perm : ["null","0","1","-1"],
	event_2_tsids : [""],
	event_2_decos : [""],
	event_3_plat_pc_perm : ["null","0","1","-1"],
	event_3_plat_item_perm : ["null","0","1","-1"],
	event_3_wall_pc_perm : ["null","0","1","-1"],
	event_3_wall_item_perm : ["null","0","1","-1"],
	event_3_tsids : [""],
	event_3_decos : [""],
	event_4_plat_pc_perm : ["null","0","1","-1"],
	event_4_plat_item_perm : ["null","0","1","-1"],
	event_4_wall_pc_perm : ["null","0","1","-1"],
	event_4_wall_item_perm : ["null","0","1","-1"],
	event_4_tsids : [""],
	event_4_decos : [""],
	timer_ms : [""],
	timer_fire : ["Never","On Enter","On Exit"],
	onEnter : [""],
	onExit : [""],
	onTimer : [""],
	event_1_phys_tsids : [""],
	event_1_phys_state : [""],
	event_2_phys_tsids : [""],
	event_2_phys_state : [""],
	event_3_phys_tsids : [""],
	event_3_phys_state : [""],
	event_4_phys_tsids : [""],
	event_4_phys_state : [""],
};

var verbs = {};

function executeEvents(pc, events){ // defined by ctgc
	for (var i in events){
		var tsids = this.getInstanceProp(events[i]+'_tsids');
		var decos = this.getInstanceProp(events[i]+'_decos');
		var plat_pc_perm = this.getInstanceProp(events[i]+'_plat_pc_perm');
		var plat_item_perm = this.getInstanceProp(events[i]+'_plat_item_perm');
		var wall_pc_perm = this.getInstanceProp(events[i]+'_wall_pc_perm');
		var wall_item_perm = this.getInstanceProp(events[i]+'_wall_item_perm');

		this.geoChange(pc, tsids, decos, plat_pc_perm, plat_item_perm, wall_pc_perm, wall_item_perm);

		var phys_tsids = this.getInstanceProp(events[i]+'_phys_tsids');
		var phys_state = intval(this.getInstanceProp(events[i]+'_phys_state'));
		log.info('executeEvents: '+phys_tsids+' -- '+phys_state);
		this.physChange(phys_tsids, phys_state);
	}
}

function geoChange(pc, tsids, decos, plat_pc_perm, plat_item_perm, wall_pc_perm, wall_item_perm){ // defined by ctgc
	// I left this in from a copy and paste from http://dev.glitch.com/god/item_func.php?id=288&func=158
	// not sure we will use it, but in case we want to...
	// if (this.only_visible_to && this.only_visible_to != pc.tsid) return false;

	// only on dev for now! too dangerous
	if (!config.is_dev) { 
		return false;
	}

	var validatePerm = function(val) {
		if (val == 'null') return null; // correct string to true null!
		if (val === null) return val;
		if (val == '-1') return val;
		if (val == '1') return val;
		if (val == '0') return val;

		// if not one of the valids above, return false
		return false;
	}

	plat_pc_perm = validatePerm(plat_pc_perm);
	plat_item_perm = validatePerm(plat_item_perm);
	wall_pc_perm = validatePerm(wall_pc_perm);
	wall_item_perm = validatePerm(wall_item_perm);

	log.info('Player '+pc+' collided with CTGC tsids:'+tsids);

	// update plats and walls
	var ret = pc.location.geo_find_plats_by_id(tsids);

	for (var i in ret.plats){
		if (plat_pc_perm !== false) {
			ret.plats[i].platform_pc_perm = plat_pc_perm;
		}
		if (plat_item_perm !== false) {
			ret.plats[i].platform_pc_perm = plat_item_perm;
		}
	}


	for (var i in ret.walls){
		if (wall_pc_perm !== false) {
			ret.walls[i].pc_perm = wall_pc_perm;
		}
		if (wall_item_perm !== false) {
			ret.walls[i].item_perm = wall_item_perm;
		}
	}

	pc.location.geo_modify_plats(ret.plats, ret.walls);

	// update decos
	if (decos){
		var deco_ids = decos.split(',');
		var deco_visible = (plat_pc_perm != 0);

		for (var i in deco_ids){
			pc.location.geo_deco_toggle_visibility(deco_ids[i], deco_visible, true);
		}
	}
}

function make_config(){ // defined by ctgc
	return {
		w: this.getInstanceProp('width'),
		h: this.getInstanceProp('height')
	};
}

function onPlayerCollision(pc){ // defined by ctgc
	var onEnter = this.getInstanceProp('onEnter');
	if (onEnter){
		var events = onEnter.split(',');
		this.executeEvents(pc, events);
	}

	if (this.getInstanceProp('timer_fire') == 'On Enter'){
		this.setTimer(pc);
	}
}

function onPlayerLeavingCollisionArea(pc){ // defined by ctgc
	var onExit = this.getInstanceProp('onExit');
	if (onExit){
		var events = onExit.split(',');
		this.executeEvents(pc, events);
	}

	if (this.getInstanceProp('timer_fire') == 'On Exit'){
		this.setTimer(pc);
	}

	/*// Section 1
	var tsids = this.getInstanceProp('exit_1_tsids');
	var decos = this.getInstanceProp('exit_1_decos');
	var plat_pc_perm = this.getInstanceProp('exit_1_plat_pc_perm');
	var plat_item_perm = this.getInstanceProp('exit_1_plat_item_perm');
	var wall_pc_perm = this.getInstanceProp('exit_1_wall_pc_perm');
	var wall_item_perm = this.getInstanceProp('exit_1_wall_item_perm');

	this.geoChange(pc, tsids, decos, plat_pc_perm, plat_item_perm, wall_pc_perm, wall_item_perm);

	// Section 2
	tsids = this.getInstanceProp('exit_2_tsids');
	decos = this.getInstanceProp('exit_2_decos');
	plat_pc_perm = this.getInstanceProp('exit_2_plat_pc_perm');
	plat_item_perm = this.getInstanceProp('exit_2_plat_item_perm');
	wall_pc_perm = this.getInstanceProp('exit_2_wall_pc_perm');
	wall_item_perm = this.getInstanceProp('exit_2_wall_item_perm');

	this.geoChange(pc, tsids, decos, plat_pc_perm, plat_item_perm, wall_pc_perm, wall_item_perm);

	if (this.getInstanceProp('timer_fire') == 'On Exit'){
		this.setTimer(pc);
	}*/
}

function onPropsChanged(){ // defined by ctgc
	log.info('CTGC properties changed');

	this.apiSetHitBox(intval(this.instanceProps.width), intval(this.instanceProps.height));
}

function onTimerFire(pc){ // defined by ctgc
	var onTimer = this.getInstanceProp('onTimer');
	if (onTimer){
		var events = onTimer.split(',');
		this.executeEvents(pc, events);
	}
}

function physChange(tsids, state){ // defined by ctgc
	// only on dev for now! too dangerous
	if (!config.is_dev) { 
		return false;
	}

	if ((state != 0 && state != 1) || !tsids){
		return false;
	}

	var tsid_list = tsids.split(','); 

	for (var i in tsid_list){
		var phys_box = apiFindObject(tsid_list[i]);
		if (phys_box && phys_box.setActiveState){
			phys_box.setActiveState(state);
		}
	}
}

function setTimer(pc){ // defined by ctgc
	this.apiSetTimerX('onTimerFire', intval(this.getInstanceProp('timer_ms')), pc);
	/*switch (this.getInstanceProp('timer_state')){
		case 'Enter':{
			break;
		}
		case 'Exit':{
			this.apiSetTimerX('onPlayerLeavingCollisionArea', intval(this.getInstanceProp('timer_ms')), pc);
			break;
		}
	}
	*/
}

// global block from ctgc
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
	"no_rube",
	"no_trade",
	"no_scale"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("ctgc.js LOADED");

// generated ok 2012-06-29 12:31:26 by jupro
