//#include include/cultivation.js

var label = "Firefly Hive";
var version = "1354585925";
var name_single = "Firefly Hive";
var name_plural = "Firefly Hives";
var article = "a";
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
var parent_classes = ["firefly_hive", "spawner"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.spawn_class = "npc_firefly";	// defined by spawner (overridden by firefly_hive)
	this.instanceProps.max_count = "10";	// defined by spawner (overridden by firefly_hive)
	this.instanceProps.spawn_interval = "60";	// defined by spawner (overridden by firefly_hive)
	this.instanceProps.spawn_count = "1";	// defined by spawner
	this.instanceProps.spawn_radius = "200";	// defined by spawner (overridden by firefly_hive)
	this.instanceProps.check_entire_location = "0";	// defined by spawner (overridden by firefly_hive)
	this.instanceProps.spawn_at = "";	// defined by spawner
	this.instanceProps.spawn_interval_max = "0";	// defined by spawner
	this.instanceProps.cultivation_max_wear = "210";	// defined by firefly_hive
	this.instanceProps.cultivation_wear = "";	// defined by firefly_hive
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
	cultivation_max_wear : ["Max wear"],
	cultivation_wear : ["Current wear"],
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
	cultivation_max_wear : [""],
	cultivation_wear : [""],
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

verbs.remove = { // defined by firefly_hive
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

function make_config(){ // defined by firefly_hive
	var ret = {};
	ret = this.buildConfig(ret);
	return ret;
}

function onContainerChanged(oldContainer, newContainer){ // defined by firefly_hive
	if (!oldContainer){
		this.setInstanceProp('spawn_at', (this.x-50)+','+(this.y-100));
	}
}

function onContainerItemRemoved(removedItem, newContainer){ // defined by firefly_hive
	if (this.is_deleting) return;
	if (removedItem.class_id == 'npc_firefly' && this.isDepleted()){
		this.onDepleted();
	}
}

function onDepleted(){ // defined by firefly_hive
	if (this.is_deleting) return;

	var fireflies = this.container.find_items('npc_firefly');
	if (num_keys(fireflies) < 7){
		this.is_deleting = true;
		for (var i in fireflies){
			if (fireflies[i]) fireflies[i].apiDelete();
		}

		this.replaceWithDepleted();
	}
}

function onLoad(){ // defined by firefly_hive
	if (this.getInstanceProp('check_entire_location') == 1){
		this.setInstanceProp('check_entire_location', 0);
		this.setInstanceProp('spawn_radius', 200);
		this.onPropsChanged();
	}
}

function onPrototypeChanged(){ // defined by firefly_hive
	this.apiSetTimer('onLoad', 500);
}

function onRemoved(){ // defined by firefly_hive
	if (!this.container) return;
	var fireflies = this.container.find_items('npc_firefly');
	for (var i in fireflies){
		if (fireflies[i]) fireflies[i].apiDelete();
	}
}

function onSpawnTimer(){ // defined by firefly_hive
	if (this.isDepleted()) return;

	var spawned = this.parent_onSpawnTimer();
	if (spawned){
		this.addWear(spawned);
	}
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
	out.push([2, "Catching Fireflies requires a Firefly Jar."]);
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
		'position': {"x":-76,"y":-112,"w":160,"h":108},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH7ElEQVR42u2Xe0xb1x3HI23a1iYE\nm7ex8QPs8sYY\/MAPMG+wAWPzsjEP8yY8jAHzfhlwCI+Q0KZJyLYuyZI0S9KqLNOmpYsyqrV0UhQF\nNKmb1najXadt3SNoa7t12h\/f\/a6Jpm1VpVUqaaVxpK\/Ovcfn3vs539\/5\/e71gQP7bb\/tt\/223\/ak\nffh7r+TvD+aS8CfP4c8d3IkRdeUbr3RN3bvdMr\/5UqvicwNm0bGkdhV7c9AsxMZztfjhlSo4tEE7\ndhWr9DOHK1aypFYle6dWwUJDGhuN2gDY5CzYFf5oULFRr2K5PjvnCK5Ww96pV7LRRmCd6YFw6oPQ\nkxmEVk0AWmhs0h6NK4u5xx45XGUq29+hC9gcMvGx1BKP5dYEHLWL0cMAZgXBlRmILn0gXnjKiLfv\n9eEX93q\/CXi+9MjgrGr2pquYj6fdKlw\/UYjnVww4P6nFZFUkmtRsH1w3wU6ZI\/D6y53Yvt\/\/jzfu\nujofCWCVir1WleqP0bp4XFsx4rVXnHj3ZyO4c96Mi0NyTBSEYDgvGIP5wXCRm30FHFwY1WChPemX\nqZEH\/PfWPQVrpZGSoYPcWe1X4NYlG957x+PTj69bcXUiDfOlYZg2hmK2JAyThhD0MnuS9mNRgh+y\now+t7R2cmqWvp8yspSx1qFhYbpfi3gsO\/OGnw6D6hxdXi3CuKwHTxaEYIxedtA\/bdAGoU7LQkU5J\npN89b0xjOfZk37Vmh70135qI40dkGDCEY6JchGen0nHnXAm+fbIA592pWCoPx1Fybo5cnCHQ6aJQ\njFC4B3KC0ZsdhGGLCNWqgO1TTueXP1VAU7Kf49xoBjZvteHFCxXw1sfATQ\/1lkfgyQYxzjSKcdwc\njtNWLs7ZuHia+kUzxwfLuNlPcBtXbXjpW3acGdOhK5e\/8qkC9pSI3vnBZRs+\/J0Xr950YNgWjUrZ\nYTRr2L6EmCwMwXELB09VhuNkBQen7QReI4THGIJRSpah\/BD85r4bH\/x6Bj+53YYeA\/9vXpM2+iOv\ny26Z9DvH8vSfCK5MwxIMV0mwveHEH38+ilvny+E2cKkgB\/rCNkSADIS3JBQLFNprowrcvWbF7bNG\nX9gnijgYyA3G3bU6fEDJtHGzAeXqYFhk7PXnBjSe632pjht9Cv0Fp3zlrFOOr\/Yq8T+BXeuXSb9+\nRHFhyBS502OIwNX5PCq8RfA2JqApjQVXdjD6CNBNGjeEwkP7bb6Ch7doITuvj+Hd14Zx62ulND8e\nNfTqm6yJwctX7TjhVCBdfBAmORf1GUI4Mvhw5oswYo7GYkMKlmwxHw94YzjV\/+aw2rXartycsSbT\nDUSopdXmRR9ES2YIGrRBYDKZKRvNVJAbSS1akma3n7ZK8IBq4vu\/8uCvv53F1veacJbKUTdl8BF6\nFZYmHUZezCEoRH6o1IiQmxSOPGk4LMoILNdLMVQsRq85bhfwyniG4+Jo+srlifS1591Kx3cnstZP\nN6dgoCQOlWoBjKkRyEkMR7EsBDmxbGSIH0dh3CHYFAGoUQXBSMfVVHKYMHdkBGKQwuitFOAv5N77\nb3vw4M1x\/OhZG0bLI2FTBsFE98mm+xQmc2CQ8ZBDcEYZF7O2JCzVJMKVJ0B7VgQGjKJdwFWnCvOO\nRExVxWDCmoTWLCFsah4sKgHMJHt6JPKlXB+kWSmgnoPiVC4cWRIYU3hQCv2gFj2GckqW4kQ\/H6wz\nKxA3FvPx\/W9U4c5FK5Y7ZChL9odFwUU13S89NgwGurZUwSewBKy2yDBURO9wguvI4qMzV4DeKuku\n4NEG+ba3PgVD5fGYroiB1xpH7j2B5pwoWiEXmfEcaKJDfYBlaUIU0qqL5RGw6iJRkMyFPi4MmbEB\nUIkeR0rEV5AZw0JuHAsF8SzYNGE+lat4MCt4vgXp48OgiwmFTSvAMx1KDBZL0JcvRDdBHSHnnNR3\n5gjXTBqhxwe4aItenymToCtPiEYd1zepJ4+PqbIYnGpMxpkmKeZolYu1yXAVUd0rTUCVmu8TA55P\nkCVyPmwEzDzcRK4wi2AcZsaY\/dVcKMFCawpOdCjQb4nH5V4d5qsTdx3L5sOVL\/AdN2fw\/mxP45T9\nR0IstqStT9fI0J4XifbMCIwUiTBE8Wf2Qn8h1TCzGOOmKIyXRPnGGXnLJVi2x+FYVTQWrNE41ZCE\nEZMEY6USXwR6CqPQnivCgCkGDr0Ix+sTsERzZu3x6C56gqAi4C4UoStHQOKjlxwk0JXKuMMBH8lY\nb5t6ba42CY16vs9BN0GNFkcSUCSGCYYRcz5StDvGHDNzpgj8aIUEs2VizFHPjA\/Q+KCBwAxCn5j5\nU+YozNbJ8GS3DksdWrRTFLrItaZ0HomLzmz+Zk+u8OP\/FrRm8fRWReiKTcf3mFNCPJbUkJkKeej9\nJh13y10gfI8BZELgpgdPW8T\/EvNwBqaXfhugnnG+O5fvA58gx5k5DDTj+Cw5zlzfT3Jow9FARlAo\nt5szuJ\/og4F5cXNIYhKfJCAlPFSKTsLqMSQG9daoOZda9LxLbXreRksmb6s2LXyL9s6bYwTMbAfG\nMSeBeghwpmz3nBkfpd8XqmNRkymCURq0lhvJ3pNvQuZznUUKJ4U+hJeTtKzHvmCRCw6N25RhZ5vT\nuceaMrh32rN4W+Tqq8NUIU66sjFWk4JKLW\/lUXxQf\/HfXP\/v8YOkwIeLSCb5PdMcK5guE69R4q3X\nqcP0B\/bbfttv\/yftnyUmJ2cq7Ra8AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/firefly_hive-1332893462.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
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
	"o"	: "do_nothing",
	"e"	: "remove"
};
itemDef.keys_in_pack = {};

log.info("firefly_hive.js LOADED");

// generated ok 2012-12-03 17:52:05 by martlume
