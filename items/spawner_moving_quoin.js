var label = "Moving Coin Spawner";
var version = "1354585925";
var name_single = "Moving Coin Spawner";
var name_plural = "Moving Coin Spawners";
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
var parent_classes = ["spawner_moving_quoin", "spawner"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.spawn_class = "moving_quoin";	// defined by spawner (overridden by spawner_moving_quoin)
	this.instanceProps.max_count = "50";	// defined by spawner (overridden by spawner_moving_quoin)
	this.instanceProps.spawn_interval = "10";	// defined by spawner (overridden by spawner_moving_quoin)
	this.instanceProps.spawn_count = "1";	// defined by spawner
	this.instanceProps.spawn_radius = "100";	// defined by spawner (overridden by spawner_moving_quoin)
	this.instanceProps.check_entire_location = "0";	// defined by spawner
	this.instanceProps.spawn_at = "";	// defined by spawner
	this.instanceProps.spawn_interval_max = "0";	// defined by spawner
	this.instanceProps.velocity = "10";	// defined by spawner_moving_quoin
	this.instanceProps.direction = "up";	// defined by spawner_moving_quoin
}

var instancePropsDef = {
	spawn_class : ["Class ID of item to spawn"],
	max_count : ["Max items spawned at once"],
	spawn_interval : ["Spawn event interval in seconds"],
	spawn_count : ["Number of items to spawn per interval"],
	spawn_radius : ["Pixels to spawn\/check objects within"],
	check_entire_location : ["0 to only check in 'spawn_radius', 1 to check in the entire location"],
	spawn_at : ["x,y to spawn at. Leave blank for a random point within spawn_radius"],
	spawn_interval_max : ["Max spawn event interval in seconds"],
	velocity : ["Velocity of coins to spawn"],
	direction : ["Direction of coin (up, down, left, right)"],
};

var instancePropsChoices = {
	spawn_class : [""],
	max_count : [""],
	spawn_interval : [""],
	spawn_count : [""],
	spawn_radius : [""],
	check_entire_location : [""],
	spawn_at : [""],
	spawn_interval_max : [""],
	velocity : [""],
	direction : [""],
};

var verbs = {};

verbs.do_nothing = { // defined by spawner
	"name"				: "do nothing to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "ADMIN ONLY",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'firefly_hive') return {state:null};
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("You did it!");

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("You did it!");

		var pre_msg = this.buildVerbMessage(msg.count, 'do nothing to', 'did nothing to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onSpawnTimer(){ // defined by spawner_moving_quoin
	this.timerRunning = 0;

	//log.info("Spawner "+this.tsid+" is ticking");
	var radius  = intval(this.getSpawnRadius());
	var max     = intval(this.getMaxCount());
	var count   = intval(this.getSpawnCount());
	var classes = this.getSpawnClasses();
	var check_entire_location = intval(this.getInstanceProp('check_entire_location'));

	if (!count) return;

	// find out how many objects have already spawned
	var found = 0;
	for (var i in this.container.items){
		var it = this.container.items[i];
		var ok = 0;
		for (var j in classes) if (it && it.class_id == classes[j]) ok = 1;
		if (ok && !check_entire_location){
			var dx = Math.abs(it.x - this.x);
			var dy = Math.abs(it.y - this.y);
			if (dx > radius) ok = 0;
			if (dy > radius) ok = 0;
		}
		if (ok) found+=it.count;
	}

	//log.info("Spawner "+this.tsid+" found "+found+" existing "+classes[0]+" out of "+max);

	// spawn some items?
	// enough to get from {found} to {max}, but no more than {count}
	var spawn = (found < max) ? max - found : 0;
	if (spawn > count) spawn = count;

	if (spawn){
		//log.info("Spawner "+this.tsid+" is spawning "+spawn+" "+classes[0]);
		for (var i=0; i<spawn; i++){
			var class_id = this.getSpawnClass();

			var spawn_at = this.getInstanceProp('spawn_at');
			if (spawn_at !== null && spawn_at !== '' && spawn_at !== undefined){
				var pt = spawn_at.split(',');
				var x = intval(pt[0]);
				var y = intval(pt[1]);
			}
			else{
				var x_diff = Math.random() * (radius+radius);
				var x = Math.round(this.x + x_diff - radius);
				if (x >= this.container.geo.r - 100){
					x = this.container.geo.r - 100;
				}
				else if (x <= this.container.geo.l + 100){
					x = this.container.geo.l + 100;
				}
				var y = this.y;

				// go lo
				var pt = this.container.apiGetPointOnTheClosestPlatformLineBelow(x,y);
				if (pt){
					y = pt.y;
				}
				else{
					// go hi
					var pt = this.container.apiGetPointOnTheClosestPlatformLineAbove(x,y);

					if (pt){
						y = pt.y;
					}
				}
			}

			if (class_id){
				//log.info("Spawner "+this.tsid+" is placing "+class_id+" at "+x+","+y);
				var stack = apiNewItemStack(class_id, 1);
				stack.setInstanceProp("class_name", "rainbow run");
				this.container.apiPutItemIntoPosition(stack, x, y);
				var dir = this.getInstanceProp("direction");
				var velocity = this.getInstanceProp("velocity");
				//log.info("Spawner "+this.tsid+" is moving "+stack.tsid+" at "+velocity+" in direction "+dir);
				stack.onStartMoving(intval(velocity), dir);
			}
		}
		this.container.apiSendMsg({ type: 'location_event' });
	}

	this.startSpawn();
}

function getMaxCount(){ // defined by spawner
	return this.instanceProps.max_count;
}

function getSpawnClass(){ // defined by spawner
	return this.instanceProps.spawn_class;
}

function getSpawnClasses(){ // defined by spawner
	return [this.instanceProps.spawn_class];
}

function getSpawnCount(){ // defined by spawner
	return this.instanceProps.spawn_count;
}

function getSpawnInterval(){ // defined by spawner
	return this.instanceProps.spawn_interval;
}

function getSpawnIntervalMax(){ // defined by spawner
	return this.instanceProps.spawn_interval_max;
}

function getSpawnRadius(){ // defined by spawner
	return this.instanceProps.spawn_radius;
}

function onCreate(){ // defined by spawner
	this.initInstanceProps();
	this.startSpawn();
}

function onPlayerEnter(pc){ // defined by spawner
	log.info(this+' in '+this.container+' onPlayerEnter() player entered '+pc);
	if (this.timerPaused){
		log.info(this+' in '+this.container+' onPlayerEnter() Recovering timer');
		if (this.next_spawn <= time()){
			log.info(this+' in '+this.container+' onPlayerEnter() Running immediately');
			this.onSpawnTimer();
		}
		else{
			log.info(this+' in '+this.container+' onPlayerEnter() Running in '+(this.next_spawn - time())+'s');
			this.apiSetTimer('onSpawnTimer', (this.next_spawn - time()) * 1000);
		}

		delete this.timerPaused;
	}
	else if (!this.apiTimerExists('onSpawnTimer')){
		log.info(this+' in '+this.container+' onPlayerEnter() Has no timer and is not paused. Running immediately');
		this.onSpawnTimer();
	}
}

function onPlayerExit(pc){ // defined by spawner
	var active = num_keys(this.container.activePlayers);

	log.info(this+' in '+this.container+' onPlayerExit() player exited '+pc+', remaining: '+active);
	if (!active){
		if (this.timerRunning && !this.timerPaused){
			log.info(this+' in '+this.container+' onPlayerExit() Pausing timer. Next run is in '+(this.next_spawn-time())+'s');
			this.apiCancelTimer('onSpawnTimer');
			this.timerPaused = true;
		}
	}
}

function onPropsChanged(){ // defined by spawner
	log.info(this+'  in '+this.container+' onPropsChanged() Spawner instance props changed. Restarting.');
	this.timerRunning = 0;
	this.apiCancelTimer('onSpawnTimer');
	this.startSpawn();
}

function startSpawn(){ // defined by spawner
	if (this.timerRunning) return;
	this.timerRunning = 1;

	var spawnIntervalMin = intval(this.getSpawnInterval());
	var spawnIntervalMax = intval(this.getSpawnIntervalMax());
	var spawnInterval = spawnIntervalMin;
	if (spawnIntervalMax != 0 && spawnIntervalMax > spawnIntervalMin) {
		spawnInterval = Math.ceil((Math.random() * (spawnIntervalMax - spawnIntervalMin + 1)) + spawnIntervalMin - 1);		

	}

	if (!spawnInterval) return;

	this.next_spawn = time()+spawnInterval;

	if (this.container && !num_keys(this.container.activePlayers)){
		log.info(this+' in '+this.container+' startSpawn() Pausing timer. Next run is in '+(this.next_spawn-time())+'s');
		this.timerPaused = true;
	}
	else{
		this.apiSetTimer('onSpawnTimer', spawnInterval*1000);
	}
}

function parent_onSpawnTimer(){ // defined by spawner
	this.timerRunning = 0;

	//log.info("Spawner "+this.tsid+" is ticking");
	var radius  = intval(this.getSpawnRadius());
	var max     = intval(this.getMaxCount());
	var count   = intval(this.getSpawnCount());
	var classes = this.getSpawnClasses();
	var check_entire_location = intval(this.getInstanceProp('check_entire_location'));

	if (!count) return false;

	// find out how many objects have already spawned
	var found = 0;
	for (var i in this.container.items){
		var it = this.container.items[i];
		var ok = 0;
		for (var j in classes) if (it && it.class_id == classes[j]) ok = 1;
		if (ok && !check_entire_location){
			var dx = Math.abs(it.x - this.x);
			var dy = Math.abs(it.y - this.y);
			if (dx > radius) ok = 0;
			if (dy > radius) ok = 0;
		}
		if (ok) found+=it.count;
	}

	//log.info("Spawner "+this.tsid+" found "+found+" existing "+classes[0]+" out of "+max);

	// spawn some items?
	// enough to get from {found} to {max}, but no more than {count}
	var spawn = (found < max) ? max - found : 0;
	if (spawn > count) spawn = count;

	if (spawn){
		//log.info("Spawner "+this.tsid+" is spawning "+spawn+" "+classes[0]);
		var class_id = this.getSpawnClass();
		if (!class_id) return false;

		for (var i=0; i<spawn; i++){

			var spawn_at = this.getInstanceProp('spawn_at');
			if (spawn_at !== null && spawn_at !== '' && spawn_at !== undefined){
				var pt = spawn_at.split(',');
				var x = intval(pt[0]);
				var y = intval(pt[1]);
			}
			else{
				var x_diff = Math.random() * (radius+radius);
				var x = Math.round(this.x + x_diff - radius);
				if (x >= this.container.geo.r - 100){
					x = this.container.geo.r - 100;
				}
				else if (x <= this.container.geo.l + 100){
					x = this.container.geo.l + 100;
				}
				var y = this.y;

				// go lo
				var pt = this.container.apiGetPointOnTheClosestPlatformLineBelow(x,y);
				if (pt){
					y = pt.y;
				}
				else{
					// go hi
					var pt = this.container.apiGetPointOnTheClosestPlatformLineAbove(x,y);

					if (pt){
						y = pt.y;
					}
				}
			}

			log.info("Spawner "+this.tsid+" is placing "+class_id+" at "+x+","+y);
			var stack = apiNewItemStack(class_id, 1);
			this.container.apiPutItemIntoPosition(stack, x, y);
		}
		this.container.apiSendMsg({ type: 'location_event' });
	}

	this.startSpawn();

	return spawn;
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
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "do_nothing"
};
itemDef.keys_in_pack = {};

log.info("spawner_moving_quoin.js LOADED");

// generated ok 2012-12-03 17:52:05 by martlume
