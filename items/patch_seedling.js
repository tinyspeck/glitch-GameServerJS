//#include include/cultivation.js

var label = "Seedling";
var version = "1343930688";
var name_single = "Seedling";
var name_plural = "Seedlings";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["patch_seedling"];
var has_instance_props = true;

var classProps = {
	"conversation_offset_y"	: "-35",	// defined by patch_seedling
	"conversation_offset_x"	: "0"	// defined by patch_seedling
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.cultivation_max_wear = "2000";	// defined by patch_seedling
	this.instanceProps.cultivation_wear = "";	// defined by patch_seedling
}

var instancePropsDef = {
	cultivation_max_wear : ["Max wear"],
	cultivation_wear : ["Current wear"],
};

var instancePropsChoices = {
	cultivation_max_wear : [""],
	cultivation_wear : [""],
};

var verbs = {};

verbs.remove = { // defined by patch_seedling
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

verbs.pet = { // defined by patch_seedling
	"name"				: "pet",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Help it grow up",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		// effect does nothing in dry run: player/custom

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

		var success = this.onPetted(pc);
failed = success ? false : true;

		var pre_msg = this.buildVerbMessage(msg.count, 'pet', 'pet', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function checkAndSendResponse(key, pc, slugs, txt_pc){ // defined by patch_seedling
	if (this.container.is_skillquest) return;

	return this.sendResponse(key, pc, slugs, txt_pc);
}

function growUp(){ // defined by patch_seedling
	if (!this.trant_class){
		log.error("max time reached but no trant class set - dying...");
		this.onMaxTimePassed();
		return;
	}

	var ps = apiNewItem(this.trant_class);

	if (this.grow_level) {
		ps.setInstanceProp("maturity", this.grow_level);
		delete this.grow_level;
	}

	this.container.apiPutItemIntoPosition(ps, this.x, this.y);

	if (this.canWear()){
		ps.setInstanceProp('cultivation_wear', this.getInstanceProp('cultivation_wear'));
		ps.setProp('proto_class', this.getProp('proto_class'));
	}

	this.apiDelete();
}

function make_config(){ // defined by patch_seedling
	var ret = {};
	ret = this.buildConfig(ret);
	return ret;
}

function onContainerChanged(oldContainer, newContainer){ // defined by patch_seedling
	if (!oldContainer) this.broadcastStatus();
}

function onCreate(){ // defined by patch_seedling
	this.initInstanceProps();
	this.state = 'scene:seedling';
	this.trant_class = '';
	this.timer_elapsed = 0;
	this.petted = 0;

	this.broadcastStatus();
}

function onLoad(){ // defined by patch_seedling
	if (this.container.pols_is_pol() && this.container.getProp('is_home') && !this.canWear()){
		this.initWear();
		this.proto_class = 'proto_patch';
	}

	if (!this.apiTimerExists('onMaxTimePassed')) this.setTimers();
}

function onMaxTimePassed(){ // defined by patch_seedling
	// we went 4h without 3 pettings - die

	if (this.trant_class != 'wood_tree_enchanted') this.replaceWithPatch();
}

function onMinTimePassed(){ // defined by patch_seedling
	// fired when 5m have elapsed - the earliest a patch can turn into a trant
	this.timer_elapsed = 1;

	if (this.petted >= 3){
		this.growUp();
	}
}

function onPetted(pc){ // defined by patch_seedling
	var success = true;

	this.petted++;

	// Players are rewarded 1-5 xp (randomized), -2 energy, each time they pet the trant
	// until it has been petted three times at which point they get the message "You don't need to pet this seedling any more. Just wait a few minutes." when they pet it
	// (they still lose 2 energy)

	pc.metabolics_lose_energy(2);
	if (this.petted <= 3){
		if (this.trant_class) pc.achievements_increment('seedlings_petted', this.trant_class);
		var slugs = {};
		slugs.xp = pc.stats_add_xp(randInt(1, 5), false, {'verb':'pet','class_id':this.class_tsid});

		if (this.petted == 3){
			this.checkAndSendResponse('pet_3rd_time', pc, slugs);
			if (this.owner.tsid == pc.tsid){
				pc.quests_inc_counter('seedlings_fully_petted', 1);
			}

			if (this.owner.imagination_has_upgrade("soil_appreciation_bean_grow_2")) {
				this.grow_level = 4;
			}
			else if (this.owner.imagination_has_upgrade("soil_appreciation_bean_grow_1")) {
				this.grow_level = 3;
			}
			else if (this.grow_level) {
				delete this.grow_level;
			}
		}
		else{
			this.checkAndSendResponse('pet_1st_2nd_time', pc, slugs);
		}

		if (!this.petters) this.petters = {};
		if (!this.petters[pc.tsid]){
			pc.quests_inc_counter('seedlings_petted', 1);
			this.petters[pc.tsid] = time();
		}

		this.broadcastStatus();

		if (this.timer_elapsed){
			this.growUp();
		}
	}
	else{
		this.checkAndSendResponse('pet_no_more', pc, slugs);
		pc.sendActivity("You don't need to pet this seedling any more. Just wait a few minutes.");
		success = false;
	}

	return success;
}

function onPrototypeChanged(){ // defined by patch_seedling
	this.onLoad();
}

function onStatus(pc){ // defined by patch_seedling
	var status = {
		verb_states: {},
	};

	status.verb_states['pet'] = {
		enabled: (this.petted < 3) ? true : false,
		disabled_reason: (this.petted >= 3) ? "That's enough, thnx." : "",
		warning: (this.petted == 2) ? true : false
	};

	return status;
}

function replaceWithPatch(){ // defined by patch_seedling
	if (this.trant_class == 'trant_egg'){

		var s = this.replaceWith('patch_dark');
	}else{
		var s = this.replaceWith('patch');
	}
}

function setTimers(pc){ // defined by patch_seedling
	var min_time = 5;

	if (pc && pc.imagination_has_upgrade("soil_appreciation_bean_grow_2")) {
		min_time = 1;
	}
	else if (pc && pc.imagination_has_upgrade("soil_appreciation_bean_grow_1")) {
		min_time = 3;
	}


	this.apiSetTimer('onMinTimePassed', 1000 * 60 * min_time); // min_time minutes
	this.apiSetTimer('onMaxTimePassed', 1000 * 60 * 60 * 4); // 4h
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];

var responses = {
	"pet_1st_2nd_time": [
		"Mmmmmn, that's nice.",
		"Excellent. A little nurture stimulates the nodules...",
		"Many thanks. Growing is hard work.",
		"One day I'll be a real tree!",
		"Unf! Straining noises! Creaking and stuff!",
	],
	"pet_3rd_time": [
		"Ahh. Enough for now, thank you.",
		"Now stand back. And wait for the magic to happen.",
		"Enough! I need time to ruminate on my growingness.",
		"Three times is the charm, chum. Enough.",
		"Thanks, but enough for now. I must grow my own way.",
	],
	"pet_no_more": [
		"Shhhh! Leave me to concentrate on biggificating.",
		"Cease and desist! In the nicest way possible: Go away.",
		"Avast! Pet me not. I need to focus on sprouting.",
		"Halt! No more petting. This I must do alone.",
		"Stop right there! I must do the final spurt myself!",
	],
	"plant_bean": [
		"Squeee! That tickles!",
		"Oooh! I shall hold it and squeeze it and grow it and call it George.",
		"Yessss! A bean! Come to me my precioussssssss.",
		"Ah! A seed it is! Grow it I will!",
		"Thanks! Let the magical mystery of bean-growing commence!",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': false,
		'thumb': "",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-09\/1283475096-5030.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: true,
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
	"e"	: "pet",
	"o"	: "remove"
};
itemDef.keys_in_pack = {};

log.info("patch_seedling.js LOADED");

// generated ok 2012-08-02 11:04:48 by tim
