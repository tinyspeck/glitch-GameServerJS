//#include include/upgradeable.js, include/cultivation.js, include/master_garden.js, include/garden.js

var label = "Garden";
var version = "1345588488";
var name_single = "Garden";
var name_plural = "Gardens";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 0.7;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["garden_new", "garden"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.style = "none";	// defined by garden_new
	this.instanceProps.width = "4";	// defined by garden_new
	this.instanceProps.height = "4";	// defined by garden_new
	this.instanceProps.garden_type = "default";	// defined by garden_new
	this.instanceProps.cultivation_max_wear = "60";	// defined by garden_new
	this.instanceProps.cultivation_wear = "0";	// defined by garden_new
}

var instancePropsDef = {
	style : ["Style of the beds"],
	width : ["Width of the garden, in plots"],
	height : ["Height of the garden, in plots"],
	garden_type : ["Type of garden (controls what can be planted)"],
	cultivation_max_wear : ["Maximum wear"],
	cultivation_wear : ["Current wear"],
};

var instancePropsChoices = {
	style : ["none","apartment_2","shimla_1","strip_1","strip_3","polgroddle_3","polgroddle_2","polcrop_2","polcrop_3","polherb_2","polherb_3"],
	width : [""],
	height : [""],
	garden_type : ["default","herb"],
	cultivation_max_wear : [""],
	cultivation_wear : [""],
};

var verbs = {};

verbs.remove = { // defined by garden_new
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

verbs.tend = { // defined by garden_new
	"name"				: "tend",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Do some gardening",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var owner = this.container.pols_get_owner();

		var has_key = this.container.acl_keys_player_has_key(pc);

		if (!owner || owner.tsid == pc.tsid || has_key || pc.is_god){
			return {state:'enabled'};
		}

		return {state:null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


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


		var pre_msg = this.buildVerbMessage(msg.count, 'tend', 'tended', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.upgrade = { // defined by garden_new
	"name"				: "upgrade",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.is_upgradeable && this.hasJobs(pc)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.offerJobs(pc, msg);
		return true;
	}
};

function getSubClass(){ // defined by garden_new
	return this.getInstanceProp('garden_type') == 'herb' ? 'garden_new_herb' : 'garden_new_crop';
}

function getSubClasses(){ // defined by garden_new
	return {
		'garden_new_crop' : { 'name' : 'Crop Garden' },
		'garden_new_herb' : { 'name' : 'Herb Garden' },
	};
}

function make_config(){ // defined by garden_new
	var owner = this.isPublic() ? null : this.container.pols_get_owner();
	var style = this.getInstanceProp('style');
	var garden_type = this.getInstanceProp('garden_type');

	var owners = owner ? this.container.acl_keys_get_player_hashes() : [];
	var owner_tsids;

	if (owners) {
		owner_tsids = [];
		for (var i=0;i<owners.length;i++) {
			owner_tsids.push(owners[i].tsid);
		}
	}

	if (!garden_type) {
		garden_type = "default";
	}

	var item_config = {
	    rows: this.data.height, //MUST MATCH THE ROW COUNT IN THE STYLE ASSET (see list of current assets below)
	    cols: this.data.width, //MUST BE A MULTIPLE OF THE COLUMN COUNT IN THE STYLE!!!! (ie. if you set apartment_2 cols must be 2, 4, 6, etc.)
	    max_water_time: this.timings.water * 60 * 60,  //amount of seconds maximum water level occurs
	    style: style ? style : 'none',  //the type of style the garden bed will be (see possible styles below) will assume "none" if not sent
	    owner: owner ? owner.make_hash() : {},
	    owner_tsids: owner_tsids,
	    water_threshold:  config.garden_water_threshold,
	    plots: [],
	    type: garden_type,
	    proto_class: this.proto_class
	};

	for (var r=1; r<=item_config.rows; r++){
		for (var c=1; c<=item_config.cols; c++){
			var key = r+'-'+c;
			item_config.plots.push(this.getPlotStatus(key));
		}
	}

	item_config = this.buildConfig(item_config);
	return item_config;

	return item_config;
}

function onCultivated(pc){ // defined by garden_new
	var class_id = this.proto_class;
	if (class_id == 'proto_crop_garden_large'){
		this.setInstanceProp('garden_type', 'default');
		this.setInstanceProp('width', 5);
		this.setInstanceProp('height', 3);
		this.setInstanceProp('cultivation_max_wear', 300);
		this.setInstanceProp('style', 'polcrop_3');
	}
	else if (class_id == 'proto_crop_garden_medium'){
		this.setInstanceProp('garden_type', 'default');
		this.setInstanceProp('width', 4);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 160);
		this.setInstanceProp('style', 'polcrop_2');
	}
	else if (class_id == 'proto_crop_garden_small'){
		this.setInstanceProp('garden_type', 'default');
		this.setInstanceProp('width', 2);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 60);
		this.setInstanceProp('style', 'polcrop_2');
	}
	else if (class_id == 'proto_herb_garden_large'){
		this.setInstanceProp('garden_type', 'herb');
		this.setInstanceProp('width', 5);
		this.setInstanceProp('height', 3);
		this.setInstanceProp('cultivation_max_wear', 300);
		this.setInstanceProp('style', 'polherb_3');
	}
	else if (class_id == 'proto_herb_garden_medium'){
		this.setInstanceProp('garden_type', 'herb');
		this.setInstanceProp('width', 4);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 160);
		this.setInstanceProp('style', 'polherb_2');
	}
	else if (class_id == 'proto_herb_garden_small'){
		this.setInstanceProp('garden_type', 'herb');
		this.setInstanceProp('width', 2);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 60);
		this.setInstanceProp('style', 'polherb_2');
	}

	this.broadcastConfig();
}

function onJobComplete(job){ // defined by garden_new
	var cid = job.class_id;

	if (cid.substr(0,26) == 'job_cult_crop_garden_large'){
		this.setInstanceProp('garden_type', 'default');
		this.setInstanceProp('width', 5);
		this.setInstanceProp('height', 3);
		this.setInstanceProp('cultivation_max_wear', 300);
		this.setInstanceProp('style', 'polcrop_3');
	}
	else if (cid.substr(0,27) == 'job_cult_crop_garden_medium'){
		this.setInstanceProp('garden_type', 'default');
		this.setInstanceProp('width', 4);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 160);
		this.setInstanceProp('style', 'polcrop_2');
	}
	else if (cid.substr(0,26) == 'job_cult_crop_garden_small'){
		this.setInstanceProp('garden_type', 'default');
		this.setInstanceProp('width', 2);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 60);
		this.setInstanceProp('style', 'polcrop_2');
	}
	else if (cid.substr(0,26) == 'job_cult_herb_garden_large'){
		this.setInstanceProp('garden_type', 'herb');
		this.setInstanceProp('width', 5);
		this.setInstanceProp('height', 3);
		this.setInstanceProp('cultivation_max_wear', 300);
		this.setInstanceProp('style', 'polherb_3');
	}
	else if (cid.substr(0,27) == 'job_cult_herb_garden_medium'){
		this.setInstanceProp('garden_type', 'herb');
		this.setInstanceProp('width', 4);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 160);
		this.setInstanceProp('style', 'polherb_2');
	}
	else if (cid.substr(0,26) == 'job_cult_herb_garden_small'){
		this.setInstanceProp('garden_type', 'herb');
		this.setInstanceProp('width', 2);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 60);
		this.setInstanceProp('style', 'polherb_2');
	}

	this.broadcastConfig();
}

function onPropsChanged(){ // defined by garden_new
	if (this.data.width != this.getInstanceProp('width') || this.data.height != this.getInstanceProp('height')){
		this.resetGarden();
	}
}

function onPrototypeChanged(){ // defined by garden_new
	if (!this.proto_class) return;

	if (this.proto_class == 'proto_crop_garden_large'){
		this.setInstanceProp('garden_type', 'default');
		this.setInstanceProp('width', 5);
		this.setInstanceProp('height', 3);
		this.setInstanceProp('cultivation_max_wear', 300);
		this.setInstanceProp('style', 'polcrop_3');
	}
	else if (this.proto_class == 'proto_crop_garden_medium'){
		this.setInstanceProp('garden_type', 'default');
		this.setInstanceProp('width', 4);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 160);
		this.setInstanceProp('style', 'polcrop_2');
	}
	else if (this.proto_class == 'proto_crop_garden_small'){
		this.setInstanceProp('garden_type', 'default');
		this.setInstanceProp('width', 2);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 60);
		this.setInstanceProp('style', 'polcrop_2');
	}
	else if (this.proto_class == 'proto_herb_garden_large'){
		this.setInstanceProp('garden_type', 'herb');
		this.setInstanceProp('width', 5);
		this.setInstanceProp('height', 3);
		this.setInstanceProp('cultivation_max_wear', 300);
		this.setInstanceProp('style', 'polherb_3');
	}
	else if (this.proto_class == 'proto_herb_garden_medium'){
		this.setInstanceProp('garden_type', 'herb');
		this.setInstanceProp('width', 4);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 160);
		this.setInstanceProp('style', 'polherb_2');
	}
	else if (this.proto_class == 'proto_herb_garden_small'){
		this.setInstanceProp('garden_type', 'herb');
		this.setInstanceProp('width', 2);
		this.setInstanceProp('height', 2);
		this.setInstanceProp('cultivation_max_wear', 60);
		this.setInstanceProp('style', 'polherb_2');
	}
}

function onCreate(){ // defined by garden
	this.initInstanceProps();
	this.initGarden();
}

function onPlayerEnter(pc){ // defined by garden
	if (this.container.isInstance('tower_room_5') && !this.spinach_done){
		for (var i in this.data.plots){
			this.setPlotData(i, {
				state: 'crop',
				wet: true,
				start_water: time(),
				seed: 'seed_spinach',
				growth: 0
			});
		}

		this.spinach_done = true;
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"garden",
	"no_trade",
	"natural-resources",
	"deleted"
];

var responses = {
	"broken_hoe": [
		"That's one broken down hoe.",
		"Woah! You've cracked your hoe.",
		"Hoe no.",
	],
	"broken_watering_can": [
		"I think you've cracked your can.",
		"Hey, your spout is futzed.",
		"Watering can? Watering can't, more like.",
	],
	"crop_clear": [
		"Yeeaaah...",
		"Always feels better when a friend does it.",
		"Good scritchings.",
		"Mmmm. Scratchy.",
		"All clean!",
		"Better.",
		"Nice. And clean.",
		"Feels nicererer.",
	],
	"crop_clear_drop_large": [
		"It's dangerous to go alone! Take this.",
		"Hey, look what I found in my soil.",
		"Hoe-ly gift unearthing, Glitchling!",
		"Because you unurthed it.",
	],
	"crop_clear_drop_small": [
		"Hoe hoe hoe! You hoed up a thing!",
		"You look like you could use this. What is it?",
		"Ta dah! It is a THING! For YOU!",
		"Little thing for you. For thanks.",
	],
	"crop_fertilize": [
		"Nutrientized!",
		"Woo! Batstuff!",
		"Smelly.",
		"NNNNNGGGG! I am growing Very Hard!",
		"Look at me! I'm GROWING!",
		"Wheeeeee!",
	],
	"crop_harvest": [
		"Here! Fruits... no, um, cropses of your labour.",
		"Those'll make your hair curly.",
		"I made these! Just for you.",
		"I made you eaty stuff.",
		"Look! Foodstuffs!",
		"Happy Cropday!",
		"Look, seeds turned all into these!",
		"These will put hair on your chest. Maybe. Maybe just upper arms.",
		"Oh croppy day!",
		"Noms.",
	],
	"crop_harvest_2x": [
		"A little extra…",
		"You got lucky!",
		"Oooh, big cropsies!",
		"Dedicated crop-planters deserve happy croppy rewards.",
	],
	"crop_harvest_3x": [
		"I didn't think I had it in me!",
		"Bumper cropsies!",
		"Maxi-sized croppables!",
		"Croppabanzai!",
	],
	"crop_harvest_4x": [
		"You gonna eat all those?",
		"Super-ooper-doooper cropsies!",
		"Supersized croppsicle joy!",
		"Croppabonanza!",
	],
	"crop_harvest_drop": [
		"You'll never get me lucky charms.",
		"Mmmm, tasty rainbows!",
		"Pyew!  Rainbow!  Pyew pyew!",
	],
	"crop_harvest_na_failed": [
		"No. I like these. You can't have them.",
		"Say please.",
		"You mis-picked. You picked nothin'. Try harder, picky-picker.",
	],
	"crop_plant": [
		"Consider me seeded.",
		"Good planting!",
		"That tickles!",
		"I am super-seedy!",
		"Yay!",
		"Nom nom nom nom nom.",
		"Mmm. Seedy.",
		"Ohhhhh. I will GROW this!",
		"Hee! Tickly in my seed-tumkin!",
		"Ah. Planting the seeds of tomorrow, today.",
	],
	"crop_plant_drop_large": [
		"I don't have room for this too. You take this.",
		"Hey, look what I found in my soil! Crazy!",
		"Seeds need room to grow. This too big. You take.",
		"You have this.",
	],
	"crop_plant_drop_small": [
		"I don't want this anymore. You have!",
		"You look like Glitchling that could make use of this.",
		"I found a thing!",
		"Oooh, goodies. For you!",
	],
	"crop_water": [
		"Wet!",
		"I'm Wet!",
		"You wet me.",
		"Oh I'm all wet.",
		"Splosh.",
		"Wetted.",
		"Oh!",
		"I am wet!",
		"Ooh! Wet!",
		"Jeepers, that's moist.",
	],
	"crop_water_drop_large": [
		"Oooh, have that special card, do you? Here, have this too.",
		"Pizzazzy watering! I give you treat.",
		"This washed to surface. Want it?",
		"Water dislodged thing. Don't want it.",
	],
	"crop_water_drop_small": [
		"Good things come to those who water.",
		"For your trouble, little cloud.",
		"Look! I found you this!",
		"Found thing for you! It is a bit damp.",
	],
	"crop_water_na_failed": [
		"Oh. Water everywhere. Everywhere but on me. Try again.",
		"You missed.",
		"Aim better! I am not wet!",
	],
	"herb_clear": [
		"Smooth.",
		"Fresh.",
		"I feel like a new plot!",
		"Plant me up!",
		"I'm ready.",
		"Left a bit? Ahhh.",
		"Nice work, hoe-meister.",
		"Ahhh, all hoed up.",
	],
	"herb_clear_drop": [
		"Take this for your trouble. And get shucking.",
		"You de-soiled this with your red hot hoeing!",
		"*COUGH*. Woah! You dislodged this!",
		"What the…?!? Oh, just take it.",
	],
	"herb_fertilize": [
		"Mmm, smells like nutrients.",
		"Heady. Strong. POWER FILLED.",
		"Stand back, I'm growing.",
		"AlakaZAM.",
		"I feel… mighty.",
		"Guano? Oooh, I'm getting angry. You'll like me when I'm angry.",
	],
	"herb_harvest": [
		"Herbs!",
		"Erbs!",
		"Bitter to the tongue, sweet to the mind.",
		"Be wise.",
		"Be happy.",
		"Just say yes.",
		"Here's your herbs.",
		"'Ere's your 'erbs.",
		"That *ahem* stuff you wanted.",
		"It's herb o'clock. Woo.",
	],
	"herb_harvest_2x": [
		"Herbal bonus.",
		"More! More herbs!",
		"POW! Herb it up!",
		"Herb THIS.",
	],
	"herb_harvest_3x": [
		"DAYAM!",
		"Are you ready? It's the Motherlode of herbs. The motherbalode!",
		"Herbs! All the herbs!",
		"High time for heavy herbal bonus? HELL YEAH.",
	],
	"herb_harvest_na_failed": [
		"Nooooo. My precious! Cannot take my precious herbs. Mineses.",
		"Hoe no. Hoe no no no.",
		"The roots run deep on this one.",
	],
	"herb_plant": [
		"Wahey!",
		"Wow. Planty.",
		"Hot seed action.",
		"Ahhh.",
		"*Gulp*",
		"Yowzers.",
		"Seedy.",
		"I like it seedy.",
		"Munch munch munch.",
		"That's one big seed.",
	],
	"herb_plant_drop": [
		"Hey, look what I found in my soil.",
		"Yowza! How'd THAT get there?",
		"Take this. Might want to wipe it off first.",
		"Shhh. Take this. Say nothing.",
	],
	"herb_water": [
		"Mmm... electrolytes.",
		"Niiiiiiice.",
		"Ahh.",
		"Cool.",
		"Good. Mmmm.",
		"Spoosh.",
		"Ahhhhhh.",
		"I like it wet.",
		"Blublublub.",
		"Right on.",
	],
	"herb_water_drop": [
		"This bubbled up. Have it.",
		"*Burrrrrrp*",
		"*Cough* Oh! Will you look at that?",
		"I don't want to get this wet. Take it.",
	],
	"herb_water_na_failed": [
		"Dry as a bone.",
		"Dry, friend. Try again.",
		"Somehow, you missed. I'm as mystified as you.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-40,"y":-46,"w":81,"h":43},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEqElEQVR42u2W60+TZxjG+bhspX2B\nQukBSilIwY0qWFhPvJwRBYpgrS2HoiMwUWmQLYoIHYiZ03CcSwZmabYsfjABvi77MLJk3\/sn9E\/g\nT7h3X08P1IZlLkPHkt7JlbeH53Ddv\/t+njYnJxvZyEY2spGN\/yzubEnWu1uSPPlMGfrsiTI0sZ2n\nyhyD7xdfF4aWd4siS3uFwZVdyfh+zG1I+\/cjBbS8p6EvXubT1JqKRhZzDwMPFWHv\/Rxh9MaKMsrj\n6N52Pj34UU0Pf1bT0q4mtvBKLb8zY6B0e0OKzP2kpnnekAnR2HIuDc0rKPhVLg0vKGhkQbEemP\/A\nyGaJydLkM5VIYGpdIp5LSOzupnSAJE\/MFFMK39mUwqEXUnT62zyx0eRzFT1go9\/8Ukwbv+to7Ted\nIDUKo4uKMAx+zmO+\/CFOGnr0qpBAFZralDwnRm5pTy0v7RUdJjeCHu9rhLGtP\/RCz3\/V0uxOPt1Y\nVsbGn6rIP\/fROpONTq2qBDUYZXJxmqvKyImXFw2OZk83mS6YG17Ijd1ek4LTL\/II\/Yh5KPfNJ8ow\nNPZYEfbPKeR3ekCevs5Tgej0d1I4qfGvleHA\/IeiZDM7kjy7U4BSR07l9TPzUvLAIEp9Kg3e4wMF\ng0OPFHQqDc5uF+zDIK6fW90WOV3v1UjAYTL63WUy5HOVha45TbErnxppelVNosQrSrp8oYR6bSXk\naSwVGrSXEcb082uv00QB2Rwb77SET9S8z2WyjjRVrI+1nomNNFfQUJOZgi2VNCybabTTLMxBE3xB\nX+ssoQB\/73OV01VHWeoJxY0axXOAxevSzY6qKNb2ucv++R052VXl8bvNB0NyBV3hhftspSky0OUL\nBvIOFL9h0HO1gNprtdR5Tk89TBPk\/O5yodGWCkKC19k0zHnZ9Eizmd+bBF2\/yxR9K2PAP3WpJjrK\nlFAymEHWSWHTS\/UG6rDqaNBbJMzNfJ\/Pv80KGriVSw2VanJWF1FbrY4u1ul5bAn1NZQKIVFuDfKx\nYAyvYW6AW6HjnOGvD9lEe7lqotMS5NJFURb0zkCiFJDXYUqVqp836q4zsAEtuas15LIVkL1Bokab\niupr+FlZSO4aDZPUCeowBTPXEyTRInhiXawD0ki4rVZ\/vMFAU3k42Fp5COx9tni26cSOyBmZZlw9\nPK7zvJ5a2UTT2WImpiG7pSglGEQCvbw5KCXLDIFYP6\/Xy+bdNTrqEuvoD501ujcv+l6bQWa00eSk\n5ALoExyA9EWTQhJ4BhIkhuT4gfBwUuIANCZOrDgg8TKm5jrjVYCxbibWdFZHDos25rQUB+vLM\/5b\ndtfp15M0xARGDcxo\/KTwGUqdvkmKAm80aDemNsbJRVIY60skiyfm96ft03XeQK5qbcxh0UXsluLj\nrxpGHwLW+J1VmhLe4\/OkesR9dlRiNDIIwBzKli7fMUnAIOa3W\/XU8glaQRdxnSmy\/u0ptVdpQ5xB\n2FGt3XdatAfOat0hizIlcwnarHqR9cW6IyERqCfRr5603vRk9CnMubjPUMZ\/fSEjO2BPJZAhkUyG\nePNo88c6viL04u5LCsTcwhiPeRtq2chGNrKRjf9H\/Al+7vDUYNwBwgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/garden_new-1333148466.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
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
	"garden",
	"no_trade",
	"natural-resources",
	"deleted"
];
itemDef.keys_in_location = {
	"e"	: "remove",
	"t"	: "tend",
	"u"	: "upgrade"
};
itemDef.keys_in_pack = {};

log.info("garden_new.js LOADED");

// generated ok 2012-08-21 15:34:48 by cal
