//#include include/events.js, include/rook.js, include/cultivation.js, include/npc_conversation.js

var label = "Wood Tree";
var version = "1351472997";
var name_single = "Wood Tree";
var name_plural = "Wood Trees";
var article = "a";
var description = "While all trees are woody, the Wood Tree is woodier than most. Tending to your wood is a rewarding solitary pursuit, but gathering friends to engorge your wood before all wielding your choppers simultaneously is both mutually satisfying, and sure to result in the injection of firm, tasty planks into your bag.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = "wood_tree";
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["wood_tree_enchanted", "wood_tree"];
var has_instance_props = true;

var classProps = {
	"pc_action_distance"	: "25"	// defined by wood_tree (overridden by wood_tree_enchanted)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.maturity = "1";	// defined by wood_tree
	this.instanceProps.variant = "1";	// defined by wood_tree
	this.instanceProps.harvest_count = "0";	// defined by wood_tree
	this.instanceProps.cultivation_max_wear = "2000";	// defined by wood_tree
	this.instanceProps.cultivation_wear = "";	// defined by wood_tree
}

var instancePropsDef = {
	maturity : ["Trant maturity (1-6)"],
	variant : ["How does the tree look? (1-4)"],
	harvest_count : ["Number of harvests performed without maturity transformation"],
	cultivation_max_wear : ["Max wear"],
	cultivation_wear : ["Current wear"],
};

var instancePropsChoices = {
	maturity : [""],
	variant : [""],
	harvest_count : [""],
	cultivation_max_wear : [""],
	cultivation_wear : [""],
};

var verbs = {};

verbs.unrook = { // defined by wood_tree
	"name"				: "unrook",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 10,
	"tooltip"			: "ADMIN ONLY",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god && this.isRooked()) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.unRook();
		return true;
	}
};

verbs.rook_attack = { // defined by wood_tree
	"name"				: "rook_attack",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 11,
	"tooltip"			: "ADMIN ONLY",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.adminRook(pc);
		return true;
	}
};

verbs.remove = { // defined by wood_tree
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

verbs.trantsform = { // defined by wood_tree
	"name"				: "trantsform",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Trantsform this tree with some Trantsformation Fluid",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'potion_trantsformation_fluid' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'wood_tree_enchanted') return {state:null};
		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc) && !this.container.acl_keys_player_has_key(pc)) return {state:null};
		if (this.is_poisoned) return {state:null};

		function has_potion(it){ return it.class_tsid == 'potion_trantsformation_fluid' ? true : false; }
		var potion = pc.findFirst(has_potion);
		if (potion) {
			if (potion.canPour){
				var ret = potion.canPour(pc);
				if (!ret.ok) return {state:'disabled', reason:ret.error};
			}
			else{
				if (this.getInstanceProp('maturity') < 4) return {state:'disabled', reason:'This tree is too small to be trantsformed'};
			}
			
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		function is_potion(it){ return it.class_tsid == 'potion_trantsformation_fluid' ? true : false; }
		var potion = pc.findFirst(is_potion);

		if (!potion){
			return false;
		}

		msg.target = this;

		return potion.verbs['pour'].handler.call(potion, pc, msg);
	}
};

verbs.apply_balm = { // defined by wood_tree
	"name"				: "apply balm to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Revive this tree with some Rook Balm",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Apply Rook Balm",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'potion_rook_balm' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) {
			function is_balm(it){ return it.class_tsid == 'potion_rook_balm' ? true : false; }
			var balm = pc.findFirst(is_balm);
			if (balm) {
				return {state:'enabled'};
			}
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		function is_balm(it){ return it.class_tsid == 'potion_rook_balm' ? true : false; }
		var balm = pc.findFirst(is_balm);

		if (!balm){
			return false;
		}

		msg.target = this;

		return balm.verbs['pour'].handler.call(balm, pc, msg);
	}
};

verbs.apply_antidote = { // defined by wood_tree
	"name"				: "apply antidote to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Save this poor poisoned tree with some antidote",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Apply an antidote to this poor poisoned tree",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'tree_poison_antidote' || stack.class_tsid == 'potion_tree_poison_antidote' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.is_poisoned) return {state:null};

		// Find a tree poison antidote
		function is_antidote(it){ return it.class_tsid == 'tree_poison_antidote' || it.class_tsid == 'potion_tree_poison_antidote';}
		var antidote = pc.findFirst(is_antidote);

		if (!antidote){
			return {state:'disabled', reason: "You don't have any antidote!"}; 
		} else{
			return {state:'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		// Find a tree poison antidote
		function is_antidote(it){ return it.class_tsid == 'tree_poison_antidote' || it.class_tsid == 'potion_tree_poison_antidote' ? true : false; }
		var antidote = pc.findFirst(is_antidote);

		if (!antidote){
			return false;
		}

		msg.target = this;

		// The counter is incremented in the powder or potion.
		//pc.achievements_increment('tree_antidote', 'antidoted');
		if (antidote.class_tsid == 'tree_poison_antidote') return antidote.doVerb(pc, msg);
		if (antidote.class_tsid == 'potion_tree_poison_antidote') return antidote.verbs['pour'].handler.call(antidote, pc, msg);
	}
};

verbs.poison = { // defined by wood_tree
	"name"				: "apply poison to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Apply poison to this tree, killing it",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Poison this tree, killing it.",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'tree_poison' || stack.class_tsid == 'potion_tree_poison';
	},
	"conditions"			: function(pc, drop_stack){

		if (this.is_poisoned) return {state:null};
		if (this.class_tsid == 'wood_tree_enchanted') return {state:null};
		if (this.container && this.container.pols_is_pol() && !this.container.pols_is_owner(pc) && !this.container.acl_keys_player_has_key(pc)) return {state:null};

		if (pc.buffs_has('a_too_guilty_mind')){
			return {state:'disabled', reason: "The guilt is too much to bear. You cannot poison a tree until your mind is free."};
		}

		// Find a tree poison
		function is_poison(it){ return it.class_tsid == 'tree_poison' || it.class_tsid == 'potion_tree_poison'; }
		var poison = pc.findFirst(is_poison);

		if (!poison){
			return {state:null}; 
		} 

		if(!pc.skills_has('botany_1')) {
			return {state: 'disabled', reason: "You need to know Botany to do this."};
		}

		var mood_cost = poison.getMoodCost(pc);
		if (pc.metabolics_get_mood() < mood_cost){
			return {state:'disabled', reason: "You are not in a good enough mood to poison a tree."};
		}

		if (this.getInstanceProp('dontDie') == 1){
			return {state:'disabled', reason: "This tree can't be poisoned."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		// Find a tree poison
		function is_poison(it){ return it.class_tsid == 'tree_poison' || it.class_tsid == 'potion_tree_poison' }
		var poison = pc.findFirst(is_poison);

		if (!poison){
			return false;
		}


		msg.target = this;

		if (poison.class_tsid == 'tree_poison') {
			return poison.doVerb(pc, msg);
		} else {
			return poison.verbs['pour'].handler.call(poison, pc, msg);
		}
	}
};

verbs.talk_to = { // defined by wood_tree
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		if (convos.length) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 1;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		for (var i=0; i<convos.length; i++){
			var conversation_runner = "conversation_run_"+convos[i];
			if (this[conversation_runner]){
				failed = 0;
				this[conversation_runner](pc, msg);
				break;
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.revive = { // defined by wood_tree
	"name"				: "revive",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Help this $itemclass escape the effects of The Rook. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) {
			if (this.playerIsHealer(pc)) {
				return {state: 'disabled', reason: "You have already helped revive this "+this.name_single+". Now others need to help!"};
			} else if (!this.canRevive(pc)) {
				return {state: 'disabled', reason: "Enough people are already helping to revive this "+this.name_single+"."};
			} else {
				return {state:'enabled'};
			}
		}

		return {state:null};
	},
	"effects"			: function(pc){

		return this.getReviveEffects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.startRevive(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'revive', 'revived', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.harvest_clear = { // defined by wood_tree
	"name"				: "Harvest and Clear",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Harvesting this wee tree will also kill it!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) return {state:null};
		if (this.is_poisoned) return {state:null};

		if (this.getInstanceProp('maturity') == 1){
			if (!this.canHarvest(pc)){
				return {state:'disabled', reason: "You can only harvest from this tree once per game day."};
			} else {
				return {state:'enabled'};
			}
		} else {
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.doHarvest(pc, msg);
	}
};

verbs.harvest = { // defined by wood_tree
	"name"				: "harvest",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Collect some planks",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) return {state:null};
		if (this.is_poisoned) return {state:null};

		if (this.getInstanceProp('maturity') == 1){
			return {state:null};
		}

		if (!this.canHarvest(pc)){
			return {state:'disabled', reason: "You can only harvest from this tree once per game day."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!this.canHarvest(pc)){
			pc.sendActivity('You cannot harvest this tree anymore today!');
			return false;
		}
		return this.doHarvest(pc, msg);
	}
};

verbs.pet = { // defined by wood_tree
	"name"				: "pet",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Give love",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) return {state:null};
		if (this.is_poisoned) return {state:null};
		if (!this.canPet(pc)) { return {state:'disabled', reason: "I don't want to be petted right now!"};}
		else{ return {state:'enabled'}; }
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.performTending(msg, 'pet', pc);
	}
};

verbs.water = { // defined by wood_tree
	"name"				: "water",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 60,
	"tooltip"			: "Give water",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Water this {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return (stack.class_tsid == 'watering_can' || stack.class_tsid == 'irrigator_9000') ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) return {state:null};
		if (this.is_poisoned) return {state:null};

		// Find a watering_can
		function is_watering_can(it){ return (it.class_tsid == 'watering_can' || it.class_tsid == 'irrigator_9000') && it.isWorking() ? true : false; }
		var watering_can = pc.findFirst(is_watering_can);

		if (!watering_can){
			return {state:'disabled', reason: "You need a working watering can."}; 
		}

		if (!this.canWater(pc)) { return {state:'disabled', reason: "I don't want to be watered right now!"};}
		else{ return {state:'enabled'}; }
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.performTending(msg, 'water', pc);
	}
};

function onDie(pc){ // defined by wood_tree_enchanted
	var seedling = this.replaceWith('patch_seedling');
	if (seedling){
		seedling.trant_class = 'wood_tree_enchanted';
		seedling.petted = 3;
		seedling.setTimers(pc);
	}
}

function onLoad(){ // defined by wood_tree_enchanted
	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(400, 400);

	this.plankProdMap = [
		10,
		15,
		22,
		32,
		45,
		60
	];
	this.maturityMap = [
		2,
		3,
		4,
		5,
		6,
		0
	];
}

function applyPoison(){ // defined by wood_tree
	this.is_poisoned = true;
	var duration = 3*60;
	this.poison_end = time() + duration;
	this.apiSetTimer('die', duration*1000);
	this.container.apiSendAnnouncement({
		type: 'itemstack_overlay',
		itemstack_tsid: this.tsid,
		duration: duration*1000,
		delta_x: 0,
		delta_y: 20,
		swf_url: overlay_key_to_url('poisoned'),
		uid: this.tsid+'_poisoned_all'
	});
		
	this['!poison_ticks'] = 0;
	this.apiSetTimer('onPoisoned', 3*1000);
}

function canHarvest(pc){ // defined by wood_tree
	if (this.isRooked()) return false;

	var today = current_day_key();
	if (!this.intervals) this.intervals = {};
	if (!this.intervals[today]) this.intervals[today] = {};

	if ( !this.intervals[today][pc.tsid]){
		this.intervals[today][pc.tsid] = 0;
	}
		
	//
	// Now check the limit
	//
		
	if (this.intervals[today][pc.tsid] >= 1){
		return false;
	}

	return true;
}

function canPet(pc){ // defined by wood_tree
	if (this.isRooked()) return false;

	var now = time();

	if (	this.pet_intervals &&
	   	this.pet_intervals[pc.tsid] &&
		(now - this.pet_intervals[pc.tsid]) < 5*60){
		return false;
	}

	return true;
}

function canWater(pc){ // defined by wood_tree
	if (this.isRooked()) return false;

	var now = time();

	if (	this.water_intervals &&
		this.water_intervals[pc.tsid] &&
		(now - this.water_intervals[pc.tsid]) < 5*60){
		return false;
	}

	return true;
}

function cleanupPlayerIntervals(details){ // defined by wood_tree
	if (!details.pc) return;

	//
	// will remove old player intervals (pet and water)
	//

	var now = time();

	if (this.pet_intervals && (now - this.pet_intervals[details.pc.tsid]) > 5*60) { delete this.pet_intervals[details.pc.tsid]; }
	if (this.water_intervals && (now - this.water_intervals[details.pc.tsid]) > 5*60) { delete this.water_intervals[details.pc.tsid]; }
}

function die(pc){ // defined by wood_tree
	//
	// this function is just a wrapper to maintain compatibility with trant classes
	//
	this.onDie(pc);
}

function doHarvest(pc, msg){ // defined by wood_tree
	//
	// Player needs a hatchet to harvest
	//

	var hatchet;

	if (msg.target_itemstack_tsid){
		hatchet = pc.getAllContents()[msg.target_itemstack_tsid];
	}
	else{
		function is_hatchet(it){ return (it.class_tsid == 'hatchet' || it.class_tsid == 'class_axe') && it.isWorking() ? true : false; }
		hatchet = pc.findFirst(is_hatchet);
	}

	if (!hatchet){
		pc.sendActivity("You can't just pluck planks from a tree! You need something to gently extract them with. A hatchet, maybe?");
		return false;
	}

	if (this.x < pc.x){
		var delta_x = 10;
		var endpoint = this.x+100;
		var face = 'left';
	}
	else{
		var delta_x = -10;
		var endpoint = this.x-100;
		var face = 'right';
	}

	// Move the player
	var distance = Math.abs(pc.x-endpoint);
	//pc.moveAvatar(endpoint, pc.y, face);
	pc.faceAvatar(face);

	if (pc.imagination_has_upgrade('gardening_harvest_wood')){
		pc.addSkillPackageOverride('wood_tree_harvest', {energy_cost: 12, tool_wear: 3});
	}

	var ret = pc.runSkillPackage('wood_tree_harvest', this, {tool_item: hatchet, word_progress: config.word_progress_map['harvest'], callback: 'endHarvest', msg: msg});

	if (pc.imagination_has_upgrade('gardening_harvest_wood')){
		pc.removeSkillPackageOverride('wood_tree_harvest');
	}

	if (!ret['ok']){
		if (ret['error_tool_broken']){
			pc.sendActivity("You need to repair your hatchet first.");
		}
		else{
			pc.sendActivity("Oops. Somehow you failed at harvesting that. Try again?");
		}

		return false;
	}

	return true;
}

function endHarvest(pc, ret){ // defined by wood_tree
	var failed = 0;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (ret['ok']){
		//log.info("Doin' it!");
		var resp_type;

		var harvest_count = this.getInstanceProp('harvest_count');
		if (harvest_count == undefined) harvest_count = 0;

		var maturity = this.getInstanceProp('maturity');
		var post_maturity = maturity;
		if (maturity > 6) maturity = 6;

		if (maturity == 6) {
			// We are harvesting a fully grown wood tree, so we get max harvest.
			pc.quests_inc_counter('harvest_max_wood_tree', 1);
		}

		if (maturity <= 2 || harvest_count != 0){

			if (maturity == 6){
				resp_type = 'harvest_state_6to5';
			} else if (maturity == 5 || maturity == 4){
				resp_type = 'harvest_state_5to4_4to3';
			} else if (maturity == 3 || maturity == 2){
				resp_type = 'harvest_state_3to2_2to1';
			} else if (maturity == 1){
				resp_type = 'harvest_state_1to0';
			} else {
				resp_type = 'harvest';
			}

			harvest_count = 0;
			post_maturity--;

			this.sendResponse(resp_type, pc, ret.slugs);
		}else{
			harvest_count = 1;
		}

		var yield = this.plankProdMap[maturity-1];
		var proto = apiFindItemPrototype('plank');
		this.addWear(proto.base_cost * yield);

		pc.announce_sound('HARVEST');
		pc.createItemFromSource('plank', yield, this);

		var today = current_day_key();
		if (!this.intervals) this.intervals = {};
		if (!this.intervals[today]) this.intervals[today] = {};
		if (!this.intervals[today][pc.tsid]) this.intervals[today][pc.tsid] = 0;
		this.intervals[today][pc.tsid]++;

		pc.quests_inc_counter('trant_harvest_wood_tree', 1);

		this.setInstanceProp('maturity',post_maturity);
		this.setInstanceProp('harvest_count', harvest_count);

		//
		// delay turning into a patch, so the player gets to see talkback
		//
		if (this.getInstanceProp('maturity') == 0){
			this.apiSetTimerX('onDie', 2000, pc); // 2s
		} else { 
			this.petted_count = 0;
			this.watered_count = 0;
		}

		pc.achievements_increment('completed_harvest', 'wood_tree');

		this.broadcastStatus();

		pc.feats_reset_commit();
	}
	else{
		failed = 1;
		if (ret['error_tool_broken']){
			self_msgs.push("You need to repair your hatchet first.");
		}
		else{
			self_msgs.push("Oops. Somehow you failed at harvesting that. Try again?");
		}
	}

	var pre_msg = this.buildVerbMessage(1, 'harvest', 'harvested', failed, self_msgs, self_effects, they_effects);
	if (pre_msg) pc.sendActivity(pre_msg);
}

function getStatus(pc){ // defined by wood_tree
	var status = {
		verb_states: {},
	};

	status.verb_states['water'] = {
		enabled: (!this.canWater(pc)) ? false : true,
		disabled_reason: (!this.canWater(pc)) ? "I don't want to be watered." : "",
		warning: false
	};

	status.verb_states['pet'] = {
		enabled: (!this.canPet(pc)) ? false : true,
		disabled_reason: (!this.canPet(pc)) ? "I don't want to be petted." : "",
		warning: false
	};

	return status;
}

function make_config(){ // defined by wood_tree
	var ret = {
		variant: intval(this.getInstanceProp('variant')),
		maturity: intval(this.getInstanceProp('maturity'))
	};

	ret = this.buildConfig(ret);
	return ret;
}

function onCreate(){ // defined by wood_tree
	this.initInstanceProps();
	this.petted_count = 0;
	this.been_petted = false;
	this.watered_count = 0;
	this.been_watered = false;
	this.setInstanceProp('variant',Math.floor(4 * Math.random()) + 1);

	this.broadcastStatus();

	this.onLoad();
}

function onFertilidust(){ // defined by wood_tree
	if (this.instanceProps.maturity < 6){
		this.plusMaturity();
	}
}

function onNeedsReset(){ // defined by wood_tree
	this.been_petted = false;
	this.been_watered = false;

	this.broadcastStatus();
}

function onOverlayDismissed(pc, payload){ // defined by wood_tree
	if(this.isRooked()) {
		this.doReviveCancel(pc);
	}
}

function onPlayerCollision(pc){ // defined by wood_tree
	if (this.conversations){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}
}

function onPoisoned(){ // defined by wood_tree
	if (!this.is_poisoned){
		if (this.poison_end) delete this.poison_end;
		return;
	}
		
	if (this['!poison_ticks'] % 2 == 0){
		var remaining = this.poison_end - time();
		var phrase = "Help! I've been poisoned and will die in "+remaining+" seconds.";
	}
	else{
		var phrase = "I need <a href=\"event:item|tree_poison_antidote\">antidote</a>!";
	}
		
	this.sendBubble(phrase, 3*1000);
		
	this['!poison_ticks']++;
	this.apiSetTimer('onPoisoned', 30*1000);
}

function onPrototypeChanged(){ // defined by wood_tree
	this.onLoad();
}

function onStatus(pc){ // defined by wood_tree
	return this.getStatus(pc);
}

function onTendComplete(pc, ret){ // defined by wood_tree
	if (ret['ok']){

		var resp_subtype;
		var slugs = ret.slugs;

		if (ret.details['got_drop']){
			if (!pc.skills_has('light_green_thumb_3')){
				resp_subtype = '_drop_lgt2';
			} else{
				resp_subtype = '_drop_lgt3';
			}
		} else{
			if (!pc.skills_has('light_green_thumb_1')){
				resp_subtype = '_na';
			} else if (!pc.skills_has('light_green_thumb_2')){
				resp_subtype = '_lgt1';
			} else if (!pc.skills_has('light_green_thumb_3')){
				resp_subtype = '_lgt2';
			} else{
				resp_subtype = '_lgt3';
			}
		}

		if (ret.args.type == 'water'){
			this.sendResponse('water'+resp_subtype, pc, slugs);
			this.watered_count++;
			this.been_watered = true;
			pc.achievements_increment('trants_watered', this.class_tsid);
			pc.quests_inc_counter('trees_watered', 1);

			if (!this.water_intervals) this.water_intervals = {};
			this.water_intervals[pc.tsid] = time();
		}
		else{
			this.sendResponse('pet'+resp_subtype, pc, slugs);
			this.been_petted = true;
			this.petted_count++;
			pc.achievements_increment('trants_petted', this.class_tsid);
			pc.quests_inc_counter('trees_petted', 1);

			if (!this.pet_intervals) this.pet_intervals = {};
			this.pet_intervals[pc.tsid] = time();
		}

		this.events_add({callback: 'cleanupPlayerIntervals', pc: pc}, 6*60);

		if (this.been_watered && this.been_petted){
			this.apiSetTimer('onNeedsReset', 10*60*1000);

			if (this.instanceProps.maturity > 6) this.instanceProps.maturity = 6;
			if(this.watered_count >= this.maturityMap[this.instanceProps.maturity-1] && this.petted_count >= this.maturityMap[this.instanceProps.maturity-1] && this.instanceProps.maturity < 6){
				this.plusMaturity();

				pc.quests_inc_counter('heal_trant', 1);
				if (this.instanceProps.maturity == 6){
					pc.quests_set_flag('trant_health_10');
					pc.achievements_increment('wood_tree', 'maxed');
				}
			}	
		}

		this.broadcastStatus();
		pc.location.cultivation_add_img_rewards(pc, 3.0);

		var rsp = 'Thanks for '+(ret.args.type == 'water' ? 'watering' : 'petting')+'!';

		if (ret.values['energy_cost']){
			rsp += ' '+ret.values['energy_cost']+' energy';
		}

		if (ret.values['mood_bonus']){
			rsp += ' +'+ret.values['mood_bonus']+' mood';
		}

		if (ret.values['xp_bonus']){
			rsp += ' +'+ret.values['xp_bonus']+' iMG';
		}

		pc.sendActivity(rsp);

		pc.feats_increment_for_commit(1);
	}
	else{
		if (ret.args.type == 'water'){
			this.sendResponse('water_na_failed',pc);
		} else {
			this.sendResponse('pet_na_failed',pc);
		}
		pc.announce_sound('CLICK_FAILURE');

		var rsp = 'Oops. You failed! You probably need a bit more skill to stop that from happening.';
		pc.sendActivity(rsp);
	}
}

function performTending(msg, type, pc){ // defined by wood_tree
	var package_name = 'wood_tree_'+type;

	var args = {
		type: type,
		callback: 'onTendComplete'
	};

	if (type == 'pet'){
		args.overlay_id = 'trant_pet';
		args.word_progress = config.word_progress_map['pet'];
	}
	else{
		// Find a watering_can
		if (msg.target_itemstack_tsid){
			var watering_can = pc.getAllContents()[msg.target_itemstack_tsid];
		}
		else{
			function is_watering_can(it){ return it.class_tsid == 'irrigator_9000' && it.isWorking() ? true : false; }
			var watering_can = pc.findFirst(is_watering_can);
			if (!watering_can){
				function is_watering_can(it){ return it.class_tsid == 'watering_can' && it.isWorking() ? true : false; }
				watering_can = pc.findFirst(is_watering_can);
			}
		}

		if (!watering_can){
			pc.sendActivity("That's going to be tough without a watering can :(");
			return false;
		}
		
		args.tool_item = watering_can;
		args.word_progress = config.word_progress_map['water'];
	}

	pc.runSkillPackage(package_name, this, args);

	return true;
}

function plusMaturity(){ // defined by wood_tree
	this.instanceProps.maturity++;
	this.instanceProps.harvest_count = 0;
	this.watered_count = 0;
	this.petted_count = 0;

	if (this.instanceProps.maturity == 6){
		var owner = this.container.pols_get_owner();
		if (owner){
			if (owner.getQuestStatus('soilappreciation_get_all_back_yard_trees_to_level10') == 'todo'){
				if (!owner.fully_grown_trants) owner.fully_grown_trants = {};
				if (!owner.fully_grown_trants[this.tsid]){
					owner.fully_grown_trants[this.tsid] = time();
					owner.quests_inc_counter('pol_trants_fully_grown', 1);
			
					owner.prompts_add({
						txt		: 'One of your trees is now fully grown!',
						icon_buttons	: false,
						timeout		: 10,
						choices		: [
							{ value : 'ok', label : 'ok' }
						]
					});
				}
			}
		}
	}
}

function replaceWithPatch(){ // defined by wood_tree
	this.replaceWith('patch');
}

function conversation_canoffer_the_epic_log_of_the_wood_tree_1(pc){ // defined by conversation auto-builder for "the_epic_log_of_the_wood_tree_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "perspectives_of_a_patch_4")){
		return true;
	}
	return false;
}

function conversation_run_the_epic_log_of_the_wood_tree_1(pc, msg, replay){ // defined by conversation auto-builder for "the_epic_log_of_the_wood_tree_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_epic_log_of_the_wood_tree_1";
	var conversation_title = "The Epic Log of the Wood Tree";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['the_epic_log_of_the_wood_tree_1-0-2'] = {txt: "I shudder to think.", value: 'the_epic_log_of_the_wood_tree_1-0-2'};
		this.conversation_start(pc, "You know who knows his wood?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_1', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_1-0-2"){
		choices['1']['the_epic_log_of_the_wood_tree_1-1-2'] = {txt: "Logical.", value: 'the_epic_log_of_the_wood_tree_1-1-2'};
		this.conversation_reply(pc, msg, "Spriggan.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_1', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_1-1-2"){
		choices['2']['the_epic_log_of_the_wood_tree_1-2-2'] = {txt: "Wow.", value: 'the_epic_log_of_the_wood_tree_1-2-2'};
		this.conversation_reply(pc, msg, "Not only is he an expert, he’s obsessed. Last thing at night, first thing in the morning, wood is the only thing on his mind. He’s a single-track giant, that one.  If it was up to Spriggan, everything that could be thought would burst through the ground tall, proud, and made of solid wood.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_1', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_1-2-2"){
		choices['3']['the_epic_log_of_the_wood_tree_1-3-2'] = {txt: "It was?", value: 'the_epic_log_of_the_wood_tree_1-3-2'};
		this.conversation_reply(pc, msg, "Yes wow. And that, my little fleshy friend, is why, of all the 11 ages, the age of Spriggan was possibly the least successful.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_1', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_1-3-2"){
		choices['4']['the_epic_log_of_the_wood_tree_1-4-2'] = {txt: "Um…", value: 'the_epic_log_of_the_wood_tree_1-4-2'};
		this.conversation_reply(pc, msg, "All started so well. But all the followers of the other giants said he was too rigid, you know? Stiff…", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_1', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_1-4-2"){
		choices['5']['the_epic_log_of_the_wood_tree_1-5-2'] = {txt: "…A fire?!", value: 'the_epic_log_of_the_wood_tree_1-5-2'};
		this.conversation_reply(pc, msg, "And then the time when… Oh, the great conflagration.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_1', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_1-5-2"){
		choices['6']['the_epic_log_of_the_wood_tree_1-6-2'] = {txt: "Consider me intrigued. ", value: 'the_epic_log_of_the_wood_tree_1-6-2'};
		this.conversation_reply(pc, msg, "No. No conflagration conversation. Not ready. Not yet.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_1', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_the_epic_log_of_the_wood_tree_2(pc){ // defined by conversation auto-builder for "the_epic_log_of_the_wood_tree_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "the_epic_log_of_the_wood_tree_1")){
		return true;
	}
	return false;
}

function conversation_run_the_epic_log_of_the_wood_tree_2(pc, msg, replay){ // defined by conversation auto-builder for "the_epic_log_of_the_wood_tree_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "the_epic_log_of_the_wood_tree_2";
	var conversation_title = "The Epic Log of the Wood Tree";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	choices['8'] = {};
	if (!msg.choice){
		choices['0']['the_epic_log_of_the_wood_tree_2-0-2'] = {txt: "Bring it.", value: 'the_epic_log_of_the_wood_tree_2-0-2'};
		this.conversation_start(pc, "The best advice I can offer you?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_2', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_2-0-2"){
		choices['1']['the_epic_log_of_the_wood_tree_2-1-2'] = {txt: "No one?", value: 'the_epic_log_of_the_wood_tree_2-1-2'};
		this.conversation_reply(pc, msg, "Listen to everyone. Trust no one.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_2', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_2-1-2"){
		choices['2']['the_epic_log_of_the_wood_tree_2-2-2'] = {txt: "Like?", value: 'the_epic_log_of_the_wood_tree_2-2-2'};
		this.conversation_reply(pc, msg, "There’s a brisk trade in the propagation and circulation of misinformation.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_2', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_2-2-2"){
		choices['3']['the_epic_log_of_the_wood_tree_2-3-2'] = {txt: "Hooded … whatnow?", value: 'the_epic_log_of_the_wood_tree_2-3-2'};
		this.conversation_reply(pc, msg, "Like? Like most of it. Like, for example, in the otherwise humdrum age of Humbaba, the legend of The Hooded Warrior.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_2', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_2-3-2"){
		choices['4']['the_epic_log_of_the_wood_tree_2-4-2'] = {txt: "I bet.", value: 'the_epic_log_of_the_wood_tree_2-4-2'};
		this.conversation_reply(pc, msg, "The Legend of the Hooded Warrior was one passed down from generation to the next, each generation getting larger and longer in the telling, and frightening the life out of all the little animals…", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_2', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_2-4-2"){
		choices['5']['the_epic_log_of_the_wood_tree_2-5-2'] = {txt: "Woah there.", value: 'the_epic_log_of_the_wood_tree_2-5-2'};
		this.conversation_reply(pc, msg, "Who were convinced that one night they would awaken, and there, before them, brandishing his mighty sword…", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_2', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_2-5-2"){
		choices['6']['the_epic_log_of_the_wood_tree_2-6-2'] = {txt: "This explains a lot.", value: 'the_epic_log_of_the_wood_tree_2-6-2'};
		this.conversation_reply(pc, msg, "I know. Terrifying. The chickens, in particular, were never the same again from that age on. Constantly in fear of being skewered. ", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_2', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_2-6-2"){
		choices['7']['the_epic_log_of_the_wood_tree_2-7-2'] = {txt: "That makes no sense. But ok.", value: 'the_epic_log_of_the_wood_tree_2-7-2'};
		this.conversation_reply(pc, msg, "That’s what I’m saying. Hear all of everything. Believe 10% of nothing.", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'the_epic_log_of_the_wood_tree_2', msg.choice);
	}

	if (msg.choice == "the_epic_log_of_the_wood_tree_2-7-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"the_epic_log_of_the_wood_tree_1",
	"the_epic_log_of_the_wood_tree_2",
];

function parent_onDie(){ // defined by wood_tree
	if (this.is_poisoned){
		this.container.overlay_dismiss(this.tsid+'_poisoned_all');
	}

	var patch = this.replaceWith('patch');

	if (this.is_poisoned){
		// place planks next to patch - if the client gets them out of order, it'll put the planks under the patch
		patch.container.createItemStack('plank',25,patch.x+80,patch.y);
	}
}

function parent_onLoad(){ // defined by wood_tree
	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(400, 400);

	this.plankProdMap = [
		25,
		30,
		40,
		50,
		60,
		80
	];

	this.maturityMap = [
		2,
		3,
		4,
		5,
		6,
		0
	];

	if (this.container && this.container.pols_is_pol() && this.container.getProp('is_home') && !this.canWear()){
		this.initWear();
		this.proto_class = 'proto_patch';
	}
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "The more mature the Wood Tree, the more <a href=\"\/items\/211\/\" glitch=\"item|plank\">Planks<\/a> can be harvested from it!"]);
	out.push([2, "Wood Tree grows quicker if petted by many people!"]);
	return out;
}

var tags = [
	"trant",
	"no_trade",
	"natural-resources"
];

var responses = {
	"harvest_state_1to0": [
		"Wood: felled.",
		"My trunk! My mighty tru…",
		"I've totally lost wood.",
		"Aaaand I'm spent.",
		"Kiss this wood goodbye.",
	],
	"harvest_state_3to2_2to1": [
		"Donk.",
		"Never mind the quantity, feel the wood.",
		"Thonk.",
		"You've got wood.",
		"Planks.",
	],
	"harvest_state_5to4_4to3": [
		"Never mind the quality, feel the width.",
		"HOO-HA!!!",
		"I've got a huge … wood. I have wood. Here, take some.",
		"Wood you like some planks?",
		"Mighty chopper you have there.",
	],
	"harvest_state_6to5": [
		"How much wood would a wood tree drop if a wood tree could drop wood?",
		"UNGH! YEAH! THERE'S wood for ya!",
		"Tiiiiimmmmberrrrr!",
		"Many planks.",
		"Planks for having me.",
	],
	"pet_drop_lgt2": [
		"A good vigorous rub-down occasionally releases a little bonus. Ta da!",
		"Such petting causes explosions of growth. And stuff! Free stuff!",
	],
	"pet_drop_lgt3": [
		"OOH! You have rubbed one out! One of what, I'm not sure, but take it!",
		"A little something. No planks necessary.",
	],
	"pet_lgt1": [
		"Soft strokes. Yes. Right there.",
		"A little lower, wood you?",
		"You feel wood. My wood. Woody-win-win.",
		"I grow bigger and stronger with every stroke.",
		"A fine wood-rubbing action, there.",
	],
	"pet_lgt2": [
		"Why yes, I AM just pleased to see you.",
		"Petting makes me proud. Yes. Proud.",
		"Firm hand, fine grip, good movement.",
		"Pleasing hand-action there. Good.",
		"Feel my mighty growth.",
	],
	"pet_lgt3": [
		"Yes. Stroke my mighty girth.",
		"Wood never felt so good.",
		"Yes. I am standing firm now. Yes.",
		"Lo. Here I stand. Proud, proud wood.",
		"Behold, heavy petting has made me stand firm.",
	],
	"pet_na": [
		"Plank you very much!",
		"Mmm, you feel wood.",
		"Don't rub too rough, I'll splinter all over you.",
		"Go with the grain.",
		"Yes. Wood-rubbing. I approve.",
	],
	"pet_na_failed": [
		"Hands off my wood. I'm not in the mood.",
		"Unwrap those fingers from my protuberance, kid.",
		"I wooden if I were you. I'm feeling splintery.",
	],
	"revived_1st_time": [
		"Still… so weak… just… please… more? A little? More?",
		"Need… firming… up… still…Help? More? Twice more?…",
		"Rigidity… all gone… need more help… Someone? Anyone?",
	],
	"revived_2nd_time": [
		"Almost back to full wood. Just one more stroke of revival… please?",
		"Nearly there. Nearly. One more tiny hand to revive me?",
		"A little touch more will revive me? Could you? Wood? You?",
	],
	"revived_3rd_time": [
		"BEHOLD! Thanks to {pc_label}, wood has been restored!",
		"Thanks to you, {pc_label} - true saviour of the wood.",
		"Firm, upstanding, strong, proud. And that's just you, {pc_label}!",
	],
	"rooked": [
		"Rooked! Can't… stand… going… floppy…",
		"Argh! Rooked! Help! Losing rigidity! This has never happened before!",
		"Please! Help me! Help! Can't… stand… proud… much… longarrrghhhh",
		"Help! I've been ROOK! Life being sucked from the roots. Can't… go…",
		"Wood! Drooping! Trunk! Flopping! Dignity! Gone! Rook! Killing! HELP!",
	],
	"water_drop_lgt2": [
		"Wood you like this?",
		"Mind if I lighten my load? You can have that.",
	],
	"water_drop_lgt3": [
		"YEAH!",
		"ROAR! Take THAT!",
	],
	"water_lgt1": [
		"Ahhh, wetter, but still standing firm.",
		"Mmm. Wet. I like it.",
		"My arbor is dampened. My ardor burns bright.",
		"My logs are sodden.",
		"My trunk is filled with happy moisture.",
	],
	"water_lgt2": [
		"Ahhh. A cold shower, and yet, I still stand firm.",
		"A good moistening pumps me up all the more. Planks.",
		"Never before has rising damp been such a promising proposition.",
		"A gushing spout does nothing but good for my growth.",
		"Mmmm. Moist.",
	],
	"water_lgt3": [
		"Great GIANT, but I'm fully engorged. Good watering!",
		"Ah, mighty moisture. My sap is rising.",
		"Ahhh, my mighty trunk is filled to bursting. Many planks.",
		"Mmm, wet. Don't forget to rub it in.",
		"I stand firm and proud against the mighty gushing of your hose.",
	],
	"water_na": [
		"Yep. Nothing like wet kindling.",
		"Oh thanks. Now I've got rising damp.",
		"You've totally moistened my roots.",
		"Even a dribble from the right hose provides succor to a thirsty trunk.",
		"Watch it, you've gushed all over my barky bits.",
	],
	"water_na_failed": [
		"Take that away, I like to keep my tinder dry.",
		"I prefer a dry rub - you can carry your can away.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-32,"y":-70,"w":64,"h":70},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFnklEQVR42sWYy09iVxzHjw8QUeGi\nCCJwUfEFKshDUaoiIGo1U2fGAYxth2gn3XRS00eadDqJXXRrJumuK\/+ALkzcduGm+5lVk6666to0\n6f7X3\/dwDyUkTWY6w\/Umv5z74t4P39\/j\/M4V4h1u1bw\/Xi7pZ9Vi8EZZZSt4VSnqtfLWhFPcxYYX\nV0rBy+NS6PbzapS++mhB2pfH8\/QF29nRHB2VQnS0FTg3HQ4vfXIwdQuIZycJ+u40Sc9OE\/T8kyR9\nU4vT8ycpelqOUHVLp6jebR7gw4IvVC3pLwECqG9PFutQj2MSUB4z3GcM9+mDaVqPaQxoNQ9wd3n4\n8v76KJ3cC0uoVoOrT\/na4\/fHqZgaYnPT\/JiJgJtJ7byQHKQHOT\/lFl1U25+gR4UA7SwP02HeT3ur\nHiqkBikT6afV6ADFw73munh\/ZbhWTLvpgzUfbTJguRik3YyX1tiVW3wesIebfgn+tBKhrz+OUYXv\nMQ3wUT54sM1q3d8YlS4E4N6qlxKTdprxW+R5uPjDHZ2Ot4NUKfj5j2gv7wSwxIoBcD\/rpdi4jcIj\nnfTegpOqrCLgMOYWTU6Scj6QA+A9dvFuxmO42EOrcw4a8whamu2jXNzF54YpwzE4G7TS1GjXpemA\nUA0GQBzD0tN9NO3vZqBumvR1yRHHvH9jHmBRP\/svQMQkkmU2aKFxTwf5XYLGvR3mAnKWnrcCFtND\ntMNu3mDXZozSAndPMJx\/UJBfE+YDIu4UIOri3opHjjCoiISZYfeaD5gP3kh3smoAPMwHZDZjvxVw\nYaxHAuqDwrwyUy7oLxUgSg1sx1AThRuAyGIApqftMg6RMCYmST0pAKMAVTwCDGpiRPZCSQAiFk0F\nlBAGIMAw7WEEEOBxDe5dj2syWQBpCpzsmo2kAAziD2AARZIoQFxPTtmlkjKTzQJEkVaA2Xlnowaq\nMZ9wNQBXow4JKDPZTECoBQC0U62AqIMKEGoiTiNctE0DRA1UbVargoACoCo3AMSIom0qIAAQ\/OsM\ng74PBRujdDt3Mq2AKaPU+DQRMqEGBq9Q8zCdoTltzmIVl80uxj7uRaKM9IucKbMICjSaUzSpCg4Z\njARpBswZ8ZjlNsw0QF5z\/IGXxyZsjRlENa4AagYscGejADGrsIvP2uve1ITzgFdzUAqBj0UT1EQt\nVIrBnQowz4brCpAbhhftVW9Tr8GtAFkM2yUYAOBizBw4vzzb3wBEbyjjkgHRuLa9o+EEuSwtueUL\n0zN90rWq7QIcSgxiswGYbgHkrsblEu37RvMwF7jFC5cYTtU7WVJSdfeusHubARGXzYD6kKARTdTa\ntpIDjIw\/ThCoAxDVpKKkYLGkAOFygLcCjmriFT+u613zdXByXOOFa\/XvLA3l4F4FiAUTAHGMmUYp\nCGUB2NTVoNwE2Nxs\/W8DjB86fE6RZpi\/oAqSYC5kbYApd0IlKAtrroEqJJoBnT3iZ35uhi3GNsk2\nyobYtLwJHG7W8E\/X5h2\/bfDUhu4E9Q8qof4phWTjwCrhGuBxjKlQuRhtFwBlqalPeX\/zcyuGkmm2\nCJvONsTW87qAvWzD0YBlGQoAAOrNBCyyi0EMqiyFsrgnqluk4Ry+LqhrrYDI5gGruObnb7Nl2eJs\nYTYvW9\/rAnazDQBSd4vvY2O2PwGHFzXUSf27QAKEAtwwMlp1NwpQlhoG9DrE74M94hd8h2pSMPim\nCsrkYOs09u0um1if063Xyq3KZPzxzII1CAAx3WGxhD+SnXdQkpNn0tf9YnJE5PIJTc3HdmMcaEqW\nzrfJZBviciOm1ZrhkK317y91dWUI8DHWI1AR+wCc9nVdGWHT2dbZJBvRQlCBE+eclbrKRAZuEpO9\nN\/i0EfZ2\/hh0iwuGuxjziovYuO2H9Iz9Vz7+KTQi8kbidYg72joMAChtbUk22\/996D8UeGwMjcu+\n9wAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/wood_tree_enchanted-1332884499.swf",
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
	"trant",
	"no_trade",
	"natural-resources"
];
itemDef.keys_in_location = {
	"h"	: "harvest",
	"c"	: "harvest_clear",
	"e"	: "pet",
	"t"	: "water",
	"y"	: "apply_antidote",
	"g"	: "apply_balm",
	"o"	: "poison",
	"v"	: "remove",
	"j"	: "revive",
	"k"	: "rook_attack",
	"n"	: "talk_to",
	"q"	: "trantsform",
	"u"	: "unrook"
};
itemDef.keys_in_pack = {};

log.info("wood_tree_enchanted.js LOADED");

// generated ok 2012-10-28 18:09:57 by mygrant
