var label = "spawner";
var version = "1354585925";
var name_single = "spawner";
var name_plural = "spawners";
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
var parent_classes = ["spawner"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.spawn_class = "";	// defined by spawner
	this.instanceProps.max_count = "1";	// defined by spawner
	this.instanceProps.spawn_interval = "10";	// defined by spawner
	this.instanceProps.spawn_count = "1";	// defined by spawner
	this.instanceProps.spawn_radius = "100";	// defined by spawner
	this.instanceProps.check_entire_location = "0";	// defined by spawner
	this.instanceProps.spawn_at = "";	// defined by spawner
	this.instanceProps.spawn_interval_max = "0";	// defined by spawner
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

function onSpawnTimer(){ // defined by spawner
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-23,"y":-53,"w":47,"h":52},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIRklEQVR42u2We1BU9xXHmek\/bWyH\nVtu0NiY76aTpI7F0BhuNJhAVTdTiCikqsrryyCIIrFBE3svCLouw7AZYwEVlAVEBa3gY8RHpRQzv\nhUUQdcZ2Fi1YO5JeQK12nO6391xcArLLK3X0j56ZM\/d3X7\/z+X3POb97HRyeo301f77s7vz5BnIa\nO7xIxkFpv3r9dQyLRLgfGwsaDy5YIH5hAB\/u3y\/+z9AQ2DsDqP00AQdl+9hHZ6q0Xg4O33ohAC0W\nC3P37l2MDJixeZEDQryFoPNmz1fZ\/i2vOD1XOACueGIPHjywDnGn6DCM7\/6I+ZvXItfnDaiFDbsv\nl7PPrA6df+bg+O4b33Zd\/vOXTCvfmuc0DaDJFiCl\/ZmpQnBrnRfi4\/deQYR4lXmqZx8\/fgw7gFO+\n5xDo+Yb59y5vYp3nZvMm91WVK3\/5\/RnXwvu\/+I72I6d5yIj1xbnTVTh\/5nPWjnrCR48ewRYkXedM\nYDdIlN9ibeqFKkSWtEF00IJtmT1QKpWMXi9xnE69FW++BOGS78Jn1SLUVh+F0WhET0+PlAsoo9TZ\nS6vVCHhkZISGU9egXB9tjtPnITKvCmJNP3Yqr0GuO2Sy9ewhnb9AXlAmXbdmBePyq3nsHu\/lkGx8\nC0xtOWZr1M3k9+7dm\/qLEpEcwYbV9SPl7xZ8ksUBJl2DjwpISUmc8GKc+nNxaG4vKzpggVjXDw+f\nGHiu+zViJBtw584dfk8bYgehityKFuaUXdWsR3rnybl9wH2+i4XSjDREtg9D88CC1Cv98Fddg0gx\njPB041hNaTQaV7HqAfzj6uCX0IadirP4g583giJ3YOv7C3DZZMQ\/Bvp4OI\/ffQ89xoZJcJROUoxl\nWX5MTovizP4OsNd3sas0PgyhDcPI+rcFmSwQkDPMK7hb0YLCLIlY8cf1gkT1ZywpS3C7S4aRebsf\nfru2wsvlZfi7v812d3ezN81\/4RsmjEt73anSCaoRyK1btyZA0vHhw4fstN0YFhsojT5aak6tygP5\nnpQ8BEYd4WFyVduZpL1b2F3yL3noIC5uzv1hvhwCT9+Ej6ezgebo6OiQ3bhxgw\/a2nAWYVuWouZY\nLt+lAwMDoHvW9FJqCfZJB0+\/SUu8nB2Dty0VBu4O0IZ8WsGoWi4wKacMbEL5UcQpU00R4VIERFfD\nN6GdV5jU29c1jIDiVkT5vc3XD9fBju3t7WaCIRArKClGQNYU05jUe3LNMC1ciOgdp4AInUlcMYAd\ntRaoBi2IawWy\/gXEaw4iZKcLYjIKEM2VlCQ8i03IDDIncXW65+w17NnnCyoR61ydnZ1Ovb297PXr\n1\/mUjt\/3aExOqg0NDVUODg4KZ7TZhoiWMX6Rx+GTzaWszoKUmxbkWgB58w3kKbcgI97TnKqU88rF\nd1sQEJttosYi5ej49HzVm38rrk8JQtvpk2PKkfX19TFdXV1aWsSsPlfBO9wgSh\/B9goL71KjBbsb\nLYhXH8aBNG9Gp9giTEmW8YrubR19RiLZNeW+VbX+NfaSjxPbWn+B6aguxc3Oprl\/b3f7LDPwCu7n\ngh8fdVGxBfLYIJM+zcuxIN3bNTE5dhSc4e6VWuAXVWJzE69w+4FjrWSNlokWoXXTq+g6UaRt2\/gT\nc4\/HQvPcAbctF\/hFlLDb5bf5LiUPkOpM1Dh0nyBjMg9\/Dc8BBvlugq25\/vpFhWNDuIeweddq\/Nn3\nPdSlx6MlJVjaKVwI09Y3ZaeTImTnVTGzV5MaJTo0wJwSE4OkyBCzFY6s51SZU6TsJCMqtPDfapFi\nBIq4RPZKdRlD3ltdbiKncVfZIaYhzB0XE\/zRkp2Mpvx0mA5mGM6tfbmy82MBGMkanAv3Rsem12SX\nNy2Uzgry6umTgt5T5TIukPlqTYVrb02ZgQ9eU45C9X6I4zt4uE9CknGxOAd0fSbema\/gvV0TjWaJ\nK7qCV6Hb46fCOaWbh7IRpN6QhUBJEMIC\/VCauAtNOhU6S\/UzhrR6959KcDFqm6xh\/Y+FDet+OPtf\nfFKxq6KIfXriyxVFaMpRTnIKOB0UvUt+peoYf07ZmXPDXFTLxT2VxyYFocmNRbqv4TgFO0ryx4JO\n5a0FGhSG+uJ8Wiy\/oCs15do5A7YZcgxPT95emD1JjZkoZ10YgRmbGyGTybA\/cDu4GmcpU9aY\/+Q+\nkX2N9YYZAuqY8QFMxw7yPttam1AanNoJoUEQCATw3+A2Cs5BXspSyrhyMlw\/W4W+pnrMDPBQltRe\nsI4jethK\/0wag7JwICqEB7bORU7ja2c+Q9tx23\/vk8yYluZoq0nICa45X43uk0fmrOj4uazjS1wZ\n1eszZ16XzbkZMnsQ7QYdusoK7aSzeEoo04kStB2dXC5XOQVvNzYKZgxYp4gTNB\/Q2EwnAZLbSv\/4\nRdkrBVrcF+ok1GerRucqzjffqK2Z3bZzVhkrPaeMRUNW6iS1jMX5vD8d+Msc1RgUHQmYniOIlgIt\nf\/8igamTWM4rue1M2qCRz20\/5OBMl3Iz0HnsMBrz1UyLPtNsDU4qUaCnnWpzvMo8TIYMPExmkox8\nzkA2ANFmVam6TEgTj1eNOp2uWb0+I0nblJs+dv98WgJDCzSVF2H8fvc\/M7nnR+ZsXy9UJu9DSagv\nv+rWAq3JqmKDXjOh4wiSUjgKWGY4nxrj2liUN7rffZOvht3\/QxdncfTa5VAIV5qzvdfxgIeCd0jz\nAn2g9naH2uvDCXuWzt9TEOe+GkejgnEiMZL\/096zepkh1WONKe7DFSaHZ2ERK99xSnNzc9R7ufH\/\nhRJnZ8dQ1yWVsg0urGLjB1rrdav5L\/2NdO\/qpdJk9w\/GPlnhK5cIHf5vz8n+C2Rpbio9OkpgAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-11\/1288741760-6696.swf",
	admin_props	: true,
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
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_trade"
];
itemDef.keys_in_location = {
	"o"	: "do_nothing"
};
itemDef.keys_in_pack = {};

log.info("spawner.js LOADED");

// generated ok 2012-12-03 17:52:05 by martlume
