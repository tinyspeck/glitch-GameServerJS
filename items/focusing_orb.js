//#include include/takeable.js

var label = "Focusing Orb";
var version = "1355086256";
var name_single = "Focusing Orb";
var name_plural = "Focusing Orbs";
var article = "a";
var description = "An iridescent focusing orb. It calms your swirly thoughts, helps you meditate, levitate and fight the enemies of the imagination.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1200;
var input_for = [];
var parent_classes = ["focusing_orb", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "meditativearts_1",	// defined by tool_base (overridden by focusing_orb)
	"points_capacity"	: "0",	// defined by tool_base
	"display_wear"	: "0",	// defined by tool_base
	"can_repair"	: "1",	// defined by tool_base
	"startTRString"	: "You feel calmness radiating from pc. "	// defined by focusing_orb
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "0";	// defined by tool_base
	this.instanceProps.is_broken = "0";	// defined by tool_base
}

var instancePropsDef = {
	points_remaining : ["Number of hit points remaining"],
	is_broken : ["Is this broken?"],
};

var instancePropsChoices = {
	points_remaining : [""],
	is_broken : [""],
};

var verbs = {};

verbs.pickup = { // defined by takeable
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.repair = { // defined by tool_base
	"name"				: "repair",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "The full repair takes $total_energy energy and $time seconds",
	"is_drop_target"		: true,
	"drop_many"			: true,
	"drop_tip"			: "Repair with your Tinkertool",
	"drop_ok_code"			: function(stack, pc){

		if (this.tsid == stack.tsid) return false;
		if (this.class_tsid == 'tinkertool'){
			if (stack.getClassProp('can_repair') == "0") return false;
			if (stack.isWorking && !stack.isWorking()) return true;
			if (stack.getClassProp('display_wear') == 1 && stack.getInstanceProp('points_remaining') < stack.getClassProp('points_capacity')) return true;
		}
		else if (stack.class_tsid == 'tinkertool'){
			if (this.getClassProp('can_repair') == "0") return false;
			if (this.isWorking && !this.isWorking()) return true;
			if (this.getClassProp('display_wear') == 1 && this.getInstanceProp('points_remaining') < this.getClassProp('points_capacity')) return true;
		}

		return false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.getClassProp('can_repair') == "0") return {state:null};

		var needs_repair = false;

		if (this.class_tsid == 'tinkertool' && drop_stack){
			if (drop_stack.getClassProp('can_repair') == "0") return {state:null};
			if(drop_stack.class_tsid == 'butterfly_lotion' || drop_stack.class_tsid == 'random_kindness') {
				return {state:null};
			}

			if (drop_stack.getInstanceProp('is_broken') == 1){
				needs_repair = true;
			}
			else if (drop_stack.getInstanceProp('points_remaining') < drop_stack.getClassProp('points_capacity') && drop_stack.getClassProp('display_wear') == 1){
				needs_repair = true;
			}
		}
		else{
			if (this.getInstanceProp('is_broken') == 1){
				needs_repair = true;
			}
			else if (this.getInstanceProp('points_remaining') < this.getClassProp('points_capacity') && this.getClassProp('display_wear') == 1){
				needs_repair = true;
			}
		}

		//if (!needs_repair && this.class_tsid != 'tinkertool') return {state:null};
		if (!needs_repair) return {state:null};

		if ((this.class_tsid != 'tinkertool' || drop_stack) && needs_repair){
			// Find a tinkertool
			function is_tinkertool(it){ return it.class_tsid == 'tinkertool' && it.isWorking() ? true : false; }
			var tinkertool = pc.findFirst(is_tinkertool);

			if (!tinkertool){
				return {state:'disabled', reason: "You need a Tinkertool to repair this."};
			}

			if (!pc.skills_has('tinkering_1')) return {state:'disabled', reason: "You need to know "+pc.skills_get_name('tinkering_1')+" to repair this."};
		}
		else{
			if (needs_repair){
				if (!pc.skills_has('tinkering_3')) return {state:'disabled', reason: "You need to know "+pc.skills_get_name('tinkering_3')+" to repair this."};
			}
			else{
				if (!pc.skills_has('tinkering_1')) return {state:'disabled', reason: "You need to know "+pc.skills_get_name('tinkering_1')+" to use this."};
			}
		}

		//var details = pc.getSkillPackageDetails('tinkering');

		var min_energy = this.getEnergyPerTwoTicksRepair(pc) + 1; // The cost of repairing is 2 ticks minimum

		if (pc.metabolics_get_energy() <= min_energy) return {state:'disabled', reason: "You don't have enough energy to repair this."};

		if (pc.making_is_making()) return {state:'disabled', reason: "You are too busy making something."};

		if (pc['!in_house_deco_mode']){
			return {state:'disabled', reason:"No repairing while decorating."};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var ret = pc.trySkillPackage('tinkering');
		var details = pc.getSkillPackageDetails('tinkering');
		var duration = Math.ceil((this.getClassProp('points_capacity')-this.getInstanceProp('points_remaining')) / details.tool_wear);

		ret.time = duration;
		duration = Math.max(duration, 2);

		//pc.sendActivity('Duration '+duration);

		// this comes from tinkertool.onTick(), which removes energy every other tick
		ret.min = this.getEnergyPerTwoTicksRepair(pc);
		ret.energy_cost_per = ret.min / 2;


		// Total energy cost is always rounded up to an even number of ticks.
		if ((duration % 2) != 0) {
			duration += 1;
		}

		ret.total_energy = duration * ret.energy_cost_per;

		return ret;
	},
	"handler"			: function(pc, msg, suppress_activity){

		// If this is the tinkertool, we accept items dropped on us, unless we are broken, and then we do the normal thing
		if (this.class_tsid == 'tinkertool' && (!this.needsRepair() || (msg.target_itemstack_tsid && this.isWorking()))){

			if (msg.target_itemstack_tsid){
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid);
				if (!stack) return false;

				this.startRepair(stack);
				return true;
			}
			else{
				// We don't have a way to do this yet, so just growl it
				pc.sendActivity('Choose Repair from the item you want to repair, or drag it onto the Tinkertool!');
				return false;
			}
		}
		else{
			// Find a tinkertool
			if (msg.target_itemstack_tsid){
				var tinkertool = pc.removeItemStackTsid(msg.target_itemstack_tsid);
				if (tinkertool.class_tsid != 'tinkertool' || !tinkertool.isWorking()) return false;
			}
			else{
				function is_tinkertool(it){ return it.class_tsid == 'tinkertool' && it.isWorking() ? true : false; }
				var tinkertool = pc.findFirst(is_tinkertool);
			}

			if (!tinkertool && this.class_tsid != 'tinkertool'){
				return false;
			}
			else if (this.class_tsid == 'tinkertool'){
				var tinkertool = this;
			}

			tinkertool.startRepair(this);
		}

		return true;
	}
};

verbs.levitate = { // defined by focusing_orb
	"name"				: "imagine levitation",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Gives a short burst of levitation using spacebar. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var required_skill = 'levitation_1';
		if (pc.skills_has(required_skill)){
			
			if (pc.location.is_puzzle) return{state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};

			if (pc.location.isInstance('puzzle_level_light_perspective')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('puzzle_level_light_perspective_rem')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('blue_and_white')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('blue_and_white_bonus')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('radiant_glare')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('radiant_glare_rem')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('mental_block')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('mental_block_rem')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('level_quest_winter_walk')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('level_quest_winter_haven')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('level_quest_winter_walk_part2')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('level_quest_winter_haven_part2')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('color_unblocking')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
			if (pc.location.isInstance('color_unblocking_rem')) return {state:'disabled', reason:"I'd say, doing that would give you an unfair advantage."};
		        if (pc.location.isInstance('mental_block_2')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};
		        if (pc.location.isInstance('picto_pattern')) return {state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};


			if (pc.buffs_has('meditation_cooldown') || pc.buffs_has('focused_meditation_cooldown')){
			    return {state:'disabled', reason:"You are too scattered to levitate right now."};
			}

			if (pc.imagination_has_upgrade("levitation_time")) {
				var min_energy = 12 + Math.round(pc.metabolics_get_max_energy() * 0.008);
			}
			else { 
				var min_energy = 20 + Math.round(pc.metabolics_get_max_energy() * 0.008);
			}

			if (pc.metabolics_get_energy() <= min_energy) { 
				return {state:'disabled', reason:"You need more energy to do this."};
			}


			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"effects"			: function(pc){

		if (pc.imagination_has_upgrade("levitation_time")) {
			pc.addSkillPackageOverride('levitation', {energy_cost: 12});
		}

		var val = pc.trySkillPackage('levitation');

		if (pc.imagination_has_upgrade("levitation_time")) {
			pc.removeSkillPackageOverride('levitation');
		}

		return val;
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 1;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var dur = 0;

		if (pc.imagination_has_upgrade("levitation_time")) {
			pc.addSkillPackageOverride('levitation', {energy_cost: 12});
		}

		var ret = pc.runSkillPackage('levitation', this);
		if (ret['ok']){
			failed = 0;
			dur = ret.values['duration'];

			if (pc.imagination_has_upgrade("levitation_time")) {
				// Doing this in the skill package override breaks the buff completely, so just set it here:
				// (Note also that being unclear about whether this value is in seconds or milliseconds also 
				// breaks the buff completely, and may have been the real problem with the override. However, this works.)
				dur = 8000;
			}
			
			pc.buffs_apply("levitation_by_meditation", {duration: dur/1000});
		}

		if (pc.imagination_has_upgrade("levitation_time")) {
			pc.removeSkillPackageOverride('levitation');
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'imagine levitation', 'imagined levitation with', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.focus_energy = { // defined by focusing_orb
	"name"				: "focus energy",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Increase your energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var required_skill = 'focused_meditation_1';
		if (pc.skills_has(required_skill)){

			if (pc.buffs_has('zen')){
				return {state:'disabled', reason:"You have achieved zen and cannot gain any more energy today."};
			}

			if (pc.buffs_has('focused_meditation_cooldown') || pc.buffs_has('meditation_cooldown')){
				return {state:'disabled', reason:"You are too scattered to meditate right now."};
			}
			
			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var required_skill = 'focused_meditation_1';
		if (!pc.skills_has(required_skill)){
			return false;
		}

		return this.startFocusedMeditation(pc, 'energy');
	}
};

verbs.focus_mood = { // defined by focusing_orb
	"name"				: "focus mood",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Increase your mood",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var required_skill = 'focused_meditation_1';
		if (pc.skills_has(required_skill)){
			if (pc.buffs_has('focused_meditation_cooldown') || pc.buffs_has('meditation_cooldown')){
				return {state:'disabled', reason:"You are too scattered to meditate right now."};
			}

			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var required_skill = 'focused_meditation_1';
		if (!pc.skills_has(required_skill)){
			return false;
		}

		return this.startFocusedMeditation(pc, 'mood');
	}
};

verbs.radiate = { // defined by focusing_orb
	"name"				: "radiate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Help your neighbors",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var required_skill = 'transcendental_radiation_1';
		if (pc.skills_has(required_skill)){
			if (pc.buffs_has('meditation_cooldown') || pc.buffs_has('focused_meditation_cooldown')){
				return {state:'disabled', reason:"You are too scattered to radiate right now."};
			}
				
				var count = this.getNumPlayersInRadius(pc);
				if (count <= 0) { 
					return {state:'disabled', reason: "There's nobody near enough for you to radiate."};
				}

				var tank_size = pc.metabolics_get_max_energy();
				
				var tank_size = pc.metabolics_get_max_energy();
				var details = pc.getSkillPackageDetails('transcendental_radiation');
				var effect = this.getTRCostTankMultiplier(tank_size) * tank_size * this.getTRCostSkillMultiplier(pc) * (details.duration_max/1000);
				log.info("ORB: "+effect+" with duration_max "+details.duration_max+" and tank size "+tank_size+" and tank multiplier "+this.getTRCostTankMultiplier(tank_size));

				if (pc.metabolics_get_energy() <= (effect + 2)) { 
					return {state:'disabled', reason:"You don't have enough energy to do that."};
				}

			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var required_skill = 'transcendental_radiation_1';
		if (!pc.skills_has(required_skill)){
			return false;
		}

		return this.startTranscendentalMeditation(pc);
	}
};

verbs.meditate = { // defined by focusing_orb
	"name"				: "meditate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 60,
	"tooltip"			: "Focus on the orb",
	"get_tooltip"			: function(pc, verb, effects){

		var t = verb.tooltip;

		if (pc.buffs_has('bubble_enhanced_meditation')){
			t += ' <b>Double rewards!</b>';
		}

		return t;
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var required_skill = this.getClassProp('required_skill');
		if (pc.skills_has(required_skill)){

			if (pc.buffs_has('meditation_cooldown') || pc.buffs_has('focused_meditation_cooldown')){
				return {state:'disabled', reason:"You are too scattered to meditate right now."};
			}

			return {state:'enabled'};
		}
		else{
			return {state:'disabled', reason:"You need to know Meditative Arts to use this."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var required_skill = this.getClassProp('required_skill');
		if (!pc.skills_has(required_skill)){
			return false;
		}

		return this.startStandingMeditation(pc);
	}
};

verbs.stun_attack = { // defined by focusing_orb
	"name"				: "stun attack",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 61,
	"tooltip"			: "Begin a stun attack against the Rook. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!pc.skills_has('martial_imagination_1')) {

			if (pc.location.isRooked()) {
				return {state:'disabled', reason: "You need to know Martial Imagination to start stun attacks, or team up with someone who does."};
			}
			else { 
				return {state: null};
			}
		}
		if(!pc.location.canStun()) {
			return {state: 'disabled', reason: "You'll have to wait until the right time to unleash the awesome power of Martial Imagination."};
		}

		var energy_required = 50;
		if (pc.buffs_has('rook_armor')) energy_required = energy_required / 2;

		if(pc.metabolics_get_energy() < energy_required) {
			return {state: 'disabled', reason: "You are too tired to keep fighting."};
		}

		return {state: 'enabled'};
	},
	"effects"			: function(pc){

		return {energy_cost: 50}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.pc = pc;
		this.startMartialImagination(pc, this);
		this.apiSetTimer('endMartialImagination', 15000);

		var energy_loss = 50;
		if (pc.buffs_has('rook_armor'))	energy_loss = energy_loss / 2;

		if(pc.metabolics_get_energy() <= energy_loss) {
			pc.sendActivity("You don't have enough energy to begin a stun attack.");
			return;
		}

		pc.metabolics_lose_energy(energy_loss);
		pc.sendActivity("You initiated a stun attack with the Focusing Orb. You lose "+energy_loss+" energy.");

		return true;
	}
};

function cancelAnyMeditation(){ // defined by focusing_orb
	// Do it!
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc){
		log.error('NO PC!');
		return;
	}
	if (!this.meditating || !pc['!meditating']) return;

	if (pc['!meditating'] == 'standing'){
		this.cancelStandingMeditation();
	}
	else if (pc['!meditating'] == 'focused'){
		this.cancelFocusedMeditation();
	}
	else if (pc['!meditating'] == 'transcendental'){
		this.cancelTranscendentalMeditation();
	}
	else{
		log.error('Unknown meditation type: '+pc['!meditating']);
	}
}

function cancelFocusedMeditation(){ // defined by focusing_orb
	// Do it!
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc){
		log.error('NO PC!');
		return;
	}
	if (!this.meditating || !pc['!meditating'] || pc['!meditating'] != 'focused') return;

	this.apiCancelTimer('endFocusedMeditation');
	pc.apiSendMsgAsIs({
		type: 'overlay_cancel',
		uid: pc.tsid+'_meditation_self'
	});

	pc.location.apiSendMsgAsIsX({
		type: 'overlay_cancel',
		uid: pc.tsid+'_meditation_all'
	}, pc);

	this.endFocusedMeditation();
}

function cancelStandingMeditation(){ // defined by focusing_orb
	// Do it!
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc){
		log.error('NO PC!');
		return;
	}
	if (!this.meditating || !pc['!meditating'] || pc['!meditating'] != 'standing') return;

	this.apiCancelTimer('endStandingMeditation');
	pc.apiSendMsgAsIs({
		type: 'overlay_cancel',
		uid: pc.tsid+'_meditation_self'
	});

	pc.location.apiSendMsgAsIsX({
		type: 'overlay_cancel',
		uid: pc.tsid+'_meditation_all'
	}, pc);

	this.endStandingMeditation();
}

function cancelTranscendentalMeditation(){ // defined by focusing_orb
	// Do it!
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc){
		log.error('NO PC!');
		return;
	}
	if (!this.meditating || !pc['!meditating'] || pc['!meditating'] != 'transcendental') return;

	this.apiCancelTimer('endTranscendentalMeditation');
	pc.apiSendMsgAsIs({
		type: 'overlay_cancel',
		uid: pc.tsid+'_meditation_self'
	});

	pc.location.apiSendMsgAsIsX({
		type: 'overlay_cancel',
		uid: pc.tsid+'_meditation_all'
	}, pc);

	this.endTranscendentalMeditation();
}

function endFocusedMeditation(){ // defined by focusing_orb
	// Do it!
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc){
		log.error('NO PC!');
		return;
	}

	if (!this.meditating || !pc['!meditating'] || pc['!meditating'] != 'focused'){
		log.error('NO MEDITATION!');
		return;
	}

	var ret = this['!skill_ret'];
	if (!ret) return;

	if (this['!focus_type'] == 'energy'){
		pc.announce_music_stop('FOCUSED_MEDITATION_ENERGY');
	}
	else{
		pc.announce_music_stop('FOCUSED_MEDITATION_MOOD');
	}

	var duration = getTime() - this['start_time'];
	var seconds = Math.ceil(duration / 1000);
	var actual_time = seconds * 1000; // We want an even number of seconds here
	var received_full_effect = ret.values['duration'] <= actual_time ? true : false;

	//log.info("MED duration is "+duration+" actual time is "+actual_time+" and timer was "+ret.values['duration']+" and received full effect "+received_full_effect);

	var minutes = seconds / 60.0;

	var msg = choose_one(["Darn. Got distracted. ", "Whoops. There it goes. ", "Ah, lost it. "]);
	// for each second meditating, you gain 2 mood/energy
	var img = 0;
	var effect = ret.details['bonus_amount'];

	var tank_size = pc.metabolics_get_max_energy();
	if (this['!focus_type'] == 'energy'){
		//var energy = effect * seconds;
		var energy = this.getTankMultiplier(tank_size) * tank_size * 2.0 * seconds;
		if (config.is_dev) pc.sendActivity("Meditated for "+seconds+" seconds with energy tank size "+tank_size+" and tank multiplier of "+this.getTankMultiplier(tank_size)+" and skill multilplier 2.0 for total of "+energy);

		var mood = 0;
	}
	else{
		//var mood = effect * seconds;
		var mood = this.getTankMultiplier(tank_size) * tank_size * 2.0 * seconds;
		if (config.is_dev) pc.sendActivity("Meditated for "+seconds+" seconds with energy tank size "+tank_size+" and tank multiplier of "+this.getTankMultiplier(tank_size)+" and skill multilplier 2.0 for total of "+mood);

		var energy = 0;
	}

	// Even more bonus if you received the full effect
	if (received_full_effect){
		var bonus = ret.details['bonus_amount'];
		var mood_bonus = (bonus/100)*mood;
		var energy_bonus = (bonus/100)*energy;

		if (config.is_dev) pc.sendActivity("Full effect bonus of "+energy_bonus+" energy and "+mood_bonus+" mood");

		if (energy) { energy += energy_bonus; img += energy_bonus; }
		if (mood) { mood += mood_bonus; img += mood_bonus; }
	}

	if (ret.details.duration_max == actual_time) { 
		pc.show_rainbow('rainbow_maxrelax');

		if (pc.imagination_has_upgrade("meditative_arts_max_relax")) {
			// double bonus for max relax
			if (energy) energy *= 2;
			if (mood) mood *= 2;
			img *= 2;
		
			if (config.is_dev) pc.sendActivity("Max relax: doubled amount!");
		}
	}


	// If user has Zen they get no energy
	if (pc.buffs_has('zen')) energy = 0;

	// NOTE: the img_upgrade_bonus is added to the player right in this block!
	var img_upgrade_bonus = 0;
	if (pc.imagination_has_upgrade("focused_meditation_imagination")) {
		if (is_chance(.08) || pc.buffs_has('max_luck')) {
			var context = {};
			context["img_upgrade"] = "focused_meditation_imagination";
			context["energy"] = energy;
			context["mood"] = mood;
			
			if (energy) {
				//log.info("IMG gave "+energy+" imagination to "+pc);
				img_upgrade_bonus = pc.stats_add_xp(energy, false, context);
				//img_upgrade_bonus = energy;
			}
			else if (mood) {
				//log.info("IMG gave "+mood+" imagination to "+pc);
				img_upgrade_bonus = pc.stats_add_xp(mood, false, context);
				//img_upgrade_bonus = mood;
			}
			else {
				log.error("Focused meditation both mood and energy are undefined "+pc );
			}
		}
	}

	if (energy) energy = pc.metabolics_add_energy(energy);
	if (mood) mood = pc.metabolics_add_mood(mood);
	img = pc.stats_add_xp(img, false, {'verb':'meditate','type':'focused','class_id':this.class_tsid})+ret.values['xp_bonus'];

	if (this['!focus_type'] == 'energy'){
		msg += "That was relaxing. +"+energy+" energy, +"+(img+img_upgrade_bonus)+" iMG";
		if (energy >= 24) pc.quests_set_flag('meditation_24_mood_energy');

		if (pc.location.tsid == 'LM413ATO8PR54' || pc.location.tsid == 'LLI11ITO8SBS6' || pc.location.tsid == 'LM11E7ODKHO1QJE'){
			pc.quests_inc_counter('wintry_place_meditation', seconds);
		}
	}
	else{
		msg += "That was relaxing. +"+mood+" mood, +"+img+" iMG";
		if (mood >= 24) pc.quests_set_flag('meditation_24_mood_energy');
		if (mood >= 50) pc.quests_set_flag('meditation_mood_50');
	}

	pc.sendActivity(msg);

	if (!received_full_effect) pc.announce_sound('HORRIBLE_SOUND');
	else pc.announce_sound("MEDITATION_SUCCESS");

	pc.quests_inc_counter('meditation_time', seconds);
	pc.achievements_increment('focusing_orb', 'meditation_time', minutes);

	delete pc['!meditating'];
	this.meditating = false;

	//
	// Buffs must come after we delete pc['!meditating'] or we cause an infinite* loop
	//  * Not really infinite, because the GS detects and kills it, but it's still bad
	//
	//pc.buffs_apply('focused_meditation_cooldown');

	var cooldown_duration = tank_size / 40;

	if (cooldown_duration < 30) cooldown_duration = 30;

	pc.buffs_apply('meditation_cooldown', {duration: cooldown_duration});
}

function endMartialImagination(){ // defined by focusing_orb
	if(!this.pc) {
		return;
	}

	this.pc.location.doOrbAttack(this.pc.tsid);
}

function endStandingMeditation(){ // defined by focusing_orb
	// Do it!
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc){
		log.error('NO PC!');
		return;
	}

	if (!this.meditating || !pc['!meditating'] || pc['!meditating'] != 'standing'){
		log.error('NO MEDITATION!');
		return;
	}

	var ret = this['!skill_ret'];
	if (!ret) return;

	pc.announce_music_stop('MEDITATIVE_ARTS_01');
	pc.announce_music_stop('MEDITATIVE_ARTS_02');

	var duration = getTime() - this['start_time'];
	var seconds = Math.ceil(duration / 1000);
	var actual_time = seconds * 1000; // We want an even number of seconds here
	var received_full_effect = ret.values['duration'] <= actual_time ? true : false;

	//log.info("MED duration is "+duration);
	//log.info("MED seconds is "+seconds);
	//log.info("MED skill package return is "+ret);
	//log.info("MED ret duration is "+ret.values['duration']+" and actual time is "+actual_time+" and received full effect is "+received_full_effect);

	var minutes = seconds / 60.0;


	var img = 0;

	//var mood = ret.details['mood_bonus'] * (seconds - 1);
	//var energy = ret.details['mood_bonus'] * seconds;

	var tank_size = pc.metabolics_get_max_energy();
	var mood = this.getTankMultiplier(tank_size) * tank_size * this.getSkillMultiplier(pc) * seconds;
	var energy = this.getTankMultiplier(tank_size) * tank_size * this.getSkillMultiplier(pc) * seconds;

	if (config.is_dev) log.info("ORB duration is "+seconds+" seconds and tanksize is "+tank_size+" and tankmultiplier is "+this.getTankMultiplier(tank_size)+" and skill multiplier is "+this.getSkillMultiplier(pc)+" for total is "+mood);

	if (config.is_dev) pc.sendActivity("Meditated for "+seconds+" seconds. Energy tank is "+tank_size +" and tank multiplier is "+this.getTankMultiplier(tank_size)+" and skill multiplier is "+this.getSkillMultiplier(pc)+" for total "+mood);


	var energy_cost = ret.values['energy_cost'];

	// If user has Zen they get no energy
	if (pc.buffs_has('zen')) energy = 0;

	// Even more bonus if you received the full effect
	if (received_full_effect){
		
		var bonus = (ret.details['bonus_amount']/100)*energy;
		if (config.is_dev) log.info("ORB full effect bonus "+(bonus/energy)*energy);

		//log.info("MED bonus is "+bonus);
		if (energy) energy += bonus;
		if (mood) mood += bonus;
		img += bonus;
		
		if (config.is_dev) pc.sendActivity("Full effect bonus  +"+bonus);
	}

	if (ret.details.duration_max == actual_time) { 
		pc.show_rainbow('rainbow_maxrelax');

		if (pc.imagination_has_upgrade("meditative_arts_max_relax")) {
			// double bonus for max relax
			if (energy) energy *= 2;
			if (mood) mood *= 2;
			img *= 2;

			if (config.is_dev) pc.sendActivity("Max relax bonus:  doubled amount! ");
		}
	}

	var img_upgrade_bonus = 0;
	if (pc.imagination_has_upgrade("meditative_arts_imagination")) {
		if (is_chance(.08) || pc.buffs_has('max_luck')) {
			var context = {};
			context["img_upgrade"] = "meditative_arts_imagination";
			context["energy"] = energy;
			context["mood"] = mood;
			img_upgrade_bonus = pc.stats_add_xp(energy+mood, false, context);
			//img_upgrade_bonus += energy+mood;
		}
	}

	energy = pc.metabolics_add_energy(energy);

	mood = pc.metabolics_add_mood(mood); // + ret.values['mood_bonus'];
	img = pc.stats_add_xp(img, false, {'verb':'meditate','type':'standing','class_id':this.class_tsid})+ret.values['xp_bonus'];

	var msg = choose_one(["Darn. Got distracted.", "Whoops. There it goes.", "Ah, lost it."]);
	msg += " That was relaxing. +"+mood+" mood, +"+energy+" energy, +"+(img+img_upgrade_bonus)+" iMG";
	pc.sendActivity(msg);

	if (!received_full_effect) pc.announce_sound('HORRIBLE_SOUND');
	else pc.announce_sound("MEDITATION_SUCCESS");

	pc.quests_inc_counter('meditation_time', seconds);
	pc.achievements_increment('focusing_orb', 'meditation_time', minutes);

	if (mood >= 50) pc.quests_set_flag('meditation_mood_50');

	if (pc.location.tsid == 'LM413ATO8PR54' || pc.location.tsid == 'LLI11ITO8SBS6' || pc.location.tsid == 'LM11E7ODKHO1QJE'){
		pc.quests_inc_counter('wintry_place_meditation', seconds);
	}

	delete pc['!meditating'];
	this.meditating = false;

	//
	// Buffs must come after we delete pc['!meditating'] or we cause an infinite* loop
	//  * Not really infinite, because the GS detects and kills it, but it's still bad
	//

	var cooldown_duration = tank_size / 50;

	if (cooldown_duration < 20) cooldown_duration = 20;

	/*if (pc.skills_has('meditation_3')){
		var cooldown_duration = 120;
	}
	else if (pc.skills_has('meditation_2')){
		var cooldown_duration = 40;
	}
	else{
		var cooldown_duration = 20;
	}*/
	pc.buffs_apply('meditation_cooldown', {duration: cooldown_duration});
}

function endTranscendentalMeditation(){ // defined by focusing_orb
	// Do it!
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc){
		log.error('NO PC!');
		return;
	}

	if (!this.meditating || !pc['!meditating'] || pc['!meditating'] != 'transcendental'){
		log.error('NO MEDITATION!');
		return;
	}


	this.endTranscendentalRadiationNew(pc);
	return;

	// old code
	/*
	var ret = this['!skill_ret'];
	if (!ret) return;

	var duration = getTime() - this['start_time'];
	var seconds = Math.ceil(duration / 1000);
	var actual_time = seconds * 1000; // We want an even number of seconds here
	var received_full_effect = ret.values['duration'] <= actual_time ? true : false;

	var minutes = seconds / 60.0;

	// All players within distance (Except for meditatee) receive 1 mood and 1 energy per each second of meditating.

	var effect = ret.details['bonus_amount'] * seconds;
	var players = pc.location.activePlayers;

	// Check upgrades:
	var dist = pc.imagination_get_radiation_distance();

	if (pc.imagination_has_upgrade("transcendental_benefits_2")) {
		effect *= 1.5;
	}
	else if (pc.imagination_has_upgrade("transcendental_benefits_1")) {
		effect *= 1.25;
	}

	effect = Math.round(effect);

	var energy_limit = .75;

	// Apply radiation to all players
	for (var i in players){
		if (i != pc.tsid){
			var player = players[i];
		
			if ((dist > 9000) || (Math.abs(player.x - pc.x) <= dist)) {

				var my_mood = player.metabolics_add_mood(effect);

				var my_energy = 0;
				// You can get up to 75% of daily energy capacity from other people radiating
				// unless you have an upgrade to 100%
				if (player.imagination_has_upgrade("transcendental_daily_limit")) {
					energy_limit = 1.0;
				}
				else {
					energy_limit = 0.75;
				}	

				if (player.buffs_has('zen')){
					player.sendActivity("You feel calmness radiating from "+pc.linkifyLabel()+". +"+my_mood+" mood. You would have gained energy, but you have already achieved zen.", pc);
				}
				else if (intval(player.getProp('radiation_today')) >= players[i].metabolics_get_max_energy() * energy_limit){
					player.sendActivity("You feel calmness radiating from "+pc.linkifyLabel()+". +"+my_mood+" mood. You would have gained energy, but you have received enough for the day.", pc);
				}
				else{
					my_energy = player.metabolics_add_energy(effect);
					player.setProp('radiation_today', intval(player .getProp('radiation_today'))+my_energy);

					player.sendActivity("You feel calmness radiating from "+pc.linkifyLabel()+". +"+my_energy+" energy, +"+my_mood+" mood", pc);
				}
			}
		}
	}

	var img = ret.values['xp_bonus'];
	var energy = ret.values['energy_cost'];

	var img_upgrade_bonus = 0;
	if (pc.imagination_has_upgrade("transcendental_imagination")) {
		// 5% chance of getting 50% of radiated energy + mood as imagination
		// Amount of energy is effect and so is amount of mood, so just give effect imagination
		if (is_chance(.05) || pc.buffs_has('max_luck')) {
			var context = {};
			context["img_upgrade"] = "transcendental_imagination";
			context["energy"] = effect;
			context["mood"] = effect;

			//log.info("IMG added "+effect+" imagination for "+pc);
			pc.stats_add_xp(effect, false, context);
			img_upgrade_bonus = effect;
		}
	}

	// If user has Zen they get no energy
	if (pc.buffs_has('zen')) energy = 0;

	// Even more bonus if you received the full effect
	if (received_full_effect){
		var bonus = ret.details['bonus_amount'];
		if (energy) energy += pc.metabolics_add_energy(bonus);
		img += pc.stats_add_xp(bonus, false, {'verb':'meditate','type':'transcendental','class_id':this.class_tsid});
	}

	var msg = choose_one(["Darn. Got distracted.", "Whoops. There it goes.", "Ah, lost it."]);
	if (energy > 0) {
		msg += " That was relaxing. +"+energy+" energy, +"+(img+img_upgrade_bonus)+" iMG";
	}
	else {
		msg += " That was relaxing. +"+(img+img_upgrade_bonus)+" iMG";
	}

	msg += " Everyone around you gains "+effect+" mood and energy.";

	pc.sendActivity(msg);
	pc.announce_music_stop('TRANSCENDENTAL_MEDITATION_01');
	pc.announce_music_stop('TRANSCENDENTAL_MEDITATION_02');
	if (!received_full_effect) pc.announce_sound('HORRIBLE_SOUND');
	else pc.announce_sound("MEDITATION_SUCCESS");

	pc.quests_inc_counter('meditation_time', seconds);
	pc.achievements_increment('focusing_orb', 'meditation_time', minutes);

	if (seconds && num_keys(players) >= 6){
		pc.quests_set_flag('transcendence_5players');
	}

	if (ret.details.duration_max == actual_time) pc.show_rainbow('rainbow_maxrelax');

	delete pc['!meditating'];
	this.meditating = false;

	pc.buffs_apply('meditation_cooldown', {duration: 120});

	*/
}

function endTranscendentalRadiationNew(pc){ // defined by focusing_orb
	var ret = this['!skill_ret'];
	if (!ret) return;


	var duration = getTime() - this['start_time'];
	var seconds = Math.ceil(duration / 1000);
	var actual_time = seconds * 1000; // We want an even number of seconds here
	var received_full_effect = ret.values['duration'] <= actual_time ? true : false;


	var minutes = seconds / 60.0;

	if (config.is_dev) { 
		pc.sendActivity("actual_time (even number of seconds is "+actual_time+" and duration was supposed to be "+ret.values['duration']+" so received_full_effect is "+received_full_effect);
	}

	var players = pc.location.activePlayers;

	// Check upgrades:
	var dist = pc.imagination_get_radiation_distance();


	// Send message to all players
	for (var i in players){
		if (i != pc.tsid){
			var player = players[i];
		
			if ((dist > 9000) || (Math.abs(player.x - pc.x) <= dist)) {
				this.endTRForPlayer(pc, player, true);
			}
		}
	}

	// Bonuses for radiator
	var tank_size = pc.metabolics_get_max_energy();

	var effect_seconds = 0;
	if (received_full_effect) { 
		effect_seconds = (ret.values['duration']/1000);
	}
	else { 
		// Round down to the most recent multiple of three (which the user should have gotten a message for)
		effect_seconds = Math.floor(duration / 1000);
		effect_seconds -= (effect_seconds % 3);
	}
		

	var effect = this.getTankMultiplier(tank_size) * tank_size * this.getTRSkillMultiplier(pc) * effect_seconds;

	var bonus = 0;

	if (config.is_dev) { 
		pc.sendActivity("Effect is "+this.getTankMultiplier(tank_size)+" * "+tank_size+" * "+this.getTRSkillMultiplier(pc)+" * "+effect_seconds);
	}


	var img_upgrade_bonus = 0;
	if (pc.imagination_has_upgrade("transcendental_imagination")) {

		// 5% chance of getting 50% of radiated energy + mood as imagination
		// Amount of energy is effect and so is amount of mood, so just give effect imagination
		if (is_chance(.05) || pc.buffs_has('max_luck')) {
			bonus = effect;
			if (pc.metabolics_get_mood() <= 0) { 
				bonus *= .5; // recipients get no mood when radiator's mood is 0
					     // not totally accurate, since our mood might have 
					     // dropped to 0 at some point in the process, but it's too 
					     // hard to calculate
			}

			var context = {};
			context["img_upgrade"] = "transcendental_imagination";

			//log.info("IMG added "+bonus+" imagination for "+pc);
			bonus = Math.round(bonus); // round to an integer
			img_upgrade_bonus = pc.stats_add_xp(bonus, false, context);

			if (config.is_dev){ 
				pc.sendActivity("Imagination upgrade bonus of "+img_upgrade_bonus+" effect is "+effect);
			}
		}
	}


	if (this.tr_radiator) {
		var energy = this.tr_radiator.energy;
		var mood = this.tr_radiator.mood;
	} else { 
		var energy = 0;
		var mood = 0;
	}

	// If user has Zen they get no energy
	if (pc.buffs_has('zen')) energy = 0;

	// Even more bonus if you received the full effect
	if (received_full_effect){
		if (config.is_dev) { 
			pc.sendActivity("Effect is "+effect+" and percentage is "+(ret.details['bonus_amount']/100));
		}

		bonus = Math.round((ret.details['bonus_amount']/100)*effect);

		if (energy) energy += pc.metabolics_add_energy(bonus);
		var img_bonus = pc.stats_add_xp(bonus, false, {'verb':'meditate','type':'transcendental','class_id':this.class_tsid});

		if (config.is_dev) { 
			pc.sendActivity("Received full effect bonus of "+img_bonus);
		}
		/*else if (pc.is_god) { 
			pc.sendActivity("Debug: Tried to give full duration bonus of "+bonus+"iMG actually received "+img_bonus+" iMG");
		}*/
	}

	var msg = choose_one(["Darn. Got distracted.", "Whoops. There it goes.", "Ah, lost it."]);
	if (energy > 0 && img_bonus > 0) {
		msg += " That was relaxing. +"+energy+" energy, +"+img_bonus+" iMG";
	}
	else if (energy > 0) { 
		msg += " That was relaxing. +"+energy+" energy";
	}
	else if (img_bonus > 0) {
		msg += " That was relaxing. +"+img_bonus+" iMG";
	}
	else {
		msg += " That was relaxing.";
	}

	if (img_upgrade_bonus > 0) { 
		msg += " Your \"Transcendental Highway\" upgrade got you an extra "+img_upgrade_bonus+" iMG!";
	}

	if (this.tr_recipients && this.tr_recipients.__length > 0){
		msg += " Everyone around you gains some mood and energy.";
	}

	pc.sendActivity(msg);
	pc.announce_music_stop('TRANSCENDENTAL_MEDITATION_01');
	pc.announce_music_stop('TRANSCENDENTAL_MEDITATION_02');
	if (!received_full_effect) pc.announce_sound('HORRIBLE_SOUND');
	else pc.announce_sound("MEDITATION_SUCCESS");

	pc.quests_inc_counter('meditation_time', seconds);
	pc.achievements_increment('focusing_orb', 'meditation_time', minutes);

	if (seconds && num_keys(players) >= 6){
		pc.quests_set_flag('transcendence_5players');
	}

	if (ret.details.duration_max == actual_time) pc.show_rainbow('rainbow_maxrelax');

	delete pc['!meditating'];
	this.meditating = false;

	pc.buffs_apply('meditation_cooldown', {duration: 120});

	delete this.tr_recipients;
	delete this.tr_radiator;
}

function endTRForPlayer(pc, player, complete){ // defined by focusing_orb
	if (this.tr_recipients[player.tsid]) {
		//log.info("ORB: ending radiation for "+player);

		var energy = this.tr_recipients[player.tsid].energy;
		var mood = this.tr_recipients[player.tsid].mood;

		var player_name = "<a href=\"event:player_info|"+pc.tsid+"\">"+utils.escape(pc.label)+"</a>";

		if (!complete) { 
			var text = "You feel somewhat transcended by radiation from "+player_name+". ";
		}
		else { 
			var text = "You feel transcended by radiation from "+player_name+". ";
		}

		text += "+"+energy+" energy, +"+mood+" mood";

		player.sendActivity(text);

		delete this.tr_recipients[player.tsid];
	}
}

function getNumPlayersInRadius(pc){ // defined by focusing_orb
	var dist = pc.imagination_get_radiation_distance();

	var players = pc.location.activePlayers;

	var count = 0;
	for (var tsid in players) {
		if (tsid != pc.tsid){
			var player = players[tsid];

			if ((dist > 9000) || (Math.abs(player.x - pc.x) <= dist)) {
				count ++;
			}
		}
	}

	return count;
}

function getSkillMultiplier(pc){ // defined by focusing_orb
	if (pc.skills_has('meditativearts_3')) {
		return 1.5;
	}
	else if (pc.skills_has('meditativearts_2')) {
		return 1.25;
	}
	else if (pc.skills_has('meditativearts_1')) {
		return 1.0;
	}

	return 1.0;
}

function getTankMultiplier(tank_size){ // defined by focusing_orb
	// Returns the multiplier for the tank size which is based on the tank size
	// This all gets multiplied by the skill_multiplier and the duration to give 
	// the energy/mood rewards

	var min_multiplier = 1.0;  // this is the multiplier for the minimum tank size, 
				   // which is why it's bigger than the max_multiplier
	var max_multiplier = 0.0;

	var min_tank_size = 100;
	var max_tank_size = 10000;

	// ugly, but I can't think of a better way to do it
	if (tank_size >= 100 && tank_size <= 200) { 
		min_tank_size = 100;
		max_tank_size = 200;
		min_multiplier = .75;
		max_multiplier = .6;
	}
	else if (tank_size > 200 && tank_size <= 300) {
		min_tank_size = 200;
		max_tank_size = 300;
		min_multiplier = .6;
		max_multiplier = .52;
	}
	else if (tank_size > 300 && tank_size <= 400) {
		min_tank_size = 300;
		max_tank_size = 400;
		min_multiplier = .52;
		max_multiplier = .48;
	}
	else if (tank_size > 400 && tank_size <= 500) { 
		min_tank_size = 400;
		max_tank_size = 500;
		min_multiplier = .48;
		max_multiplier = .44;
	}
	else if (tank_size > 500 && tank_size <= 750) {
		min_tank_size = 500;
		max_tank_size = 750;
		min_multiplier = .44;
		max_multiplier = .4;
	}
	else if (tank_size > 750 && tank_size <= 1000) {
		min_tank_size = 750;
		max_tank_size = 1000;
		min_multiplier = .4;
		max_multiplier = .36;
	}
	else if (tank_size > 1000 && tank_size <= 1250) {
		min_tank_size = 1000;
		max_tank_size = 1250;
		min_multiplier = .36;
		max_multiplier = .33;
	}
	else if (tank_size > 1250 && tank_size <= 1500) {
		min_tank_size = 1250;
		max_tank_size = 1500;
		min_multiplier = .33;
		max_multiplier = .3;
	}
	else if (tank_size > 1500 && tank_size <= 1750) { 
		min_tank_size = 1500;
		max_tank_size = 1750;
		min_multiplier = .3;
		max_multiplier = .27;
	}
	else if (tank_size > 1750 && tank_size <= 2000) { 
		min_tank_size = 1750;
		max_tank_size = 2000;
		min_multiplier = .27;
		max_multiplier = .24;
	}
	else if (tank_size > 2000 && tank_size <= 2500) {
		min_tank_size = 2000;
		max_tank_size = 2500;
		min_multiplier = .24;
		max_multiplier = .21;
	}
	else if (tank_size > 2500 && tank_size <= 3000) { 
		min_tank_size = 2500;
		max_tank_size = 3000;
		min_multiplier = .21;
		max_multiplier = .18;
	}
	else if (tank_size > 3000 && tank_size <= 4000) {
		min_tank_size = 3000;
		max_tank_size = 4000;
		min_multiplier = .18;
		max_multiplier = .16;
	}
	else if (tank_size > 4000 && tank_size <= 5000) {
		min_tank_size = 4000;
		max_tank_size = 5000;
		min_multiplier = .16;
		max_multiplier = .14;
	}
	else if (tank_size > 5000 && tank_size <= 6000) { 
		min_tank_size = 5000;
		max_tank_size = 6000;
		min_multiplier = .14;
		max_multiplier = .13;
	}
	else if (tank_size > 6000 && tank_size <= 7000) {
		min_tank_size = 6000;
		max_tank_size = 7000;
		min_multiplier = .13;
		max_multiplier = .12;
	}
	else if (tank_size > 7000 && tank_size <= 8000) { 
		min_tank_size = 7000;
		max_tank_size = 8000;
		min_multiplier = .12;
		max_multiplier = .11;
	}
	else if (tank_size > 8000 && tank_size <= 9000) {
		min_tank_size = 8000;
		max_tank_size = 9000;
		min_multiplier = .11;
		max_multiplier = .10;
	}
	else if (tank_size > 9000 && tank_size <= 10000) { 
		min_tank_size = 9000;
		max_tank_size = 10000;
		min_multiplier = .10;
		max_multiplier = .09;
	}
	/*else if (tank_size > 10000 && tank_size <= 11000) {
		min_tank_size = 10000;
		max_tank_size = 11000;
		min_multiplier = .09;
		max_multiplier = .08;
	}
	else if (tank_size > 11000 && tank_size <= 12000) {
		min_tank_size = 11000;
		max_tank_size = 12000;
		min_multiplier = .08;
		max_multiplier = .07;
	}*/
	else if (tank_size > 10000) {
		// upper limit 
		return (.09/100);
	}

	var percent = (tank_size - min_tank_size) / (max_tank_size - min_tank_size);

	if (config.is_dev) log.info("ORB percent is "+percent+" multiplier range is "+min_multiplier+" "+max_multiplier+" for tank size "+tank_size);

	var actual_multiplier = min_multiplier - percent * (min_multiplier - max_multiplier);

	if (config.is_dev) log.info("ORB multiplier is "+actual_multiplier+" / 100");

	return (actual_multiplier / 100);
}

function getTRCostSkillMultiplier(pc){ // defined by focusing_orb
	if (pc.skills_has('transcendental_radiation_3')) {
		return 1.35;
	}
	else if (pc.skills_has('transcendental_radiation_2')) {
		return 1.2;
	}
	else if (pc.skills_has('transcendental_radiation_1')) {
		return 1.0;
	}

	return 1.0;
}

function getTRCostTankMultiplier(tank_size){ // defined by focusing_orb
	// Returns the multiplier for the tank size which is based on the tank size
	// This all gets multiplied by the skill_multiplier and the duration to give 
	// the energy/mood rewards

	var min_multiplier = 1.0;  // this is the multiplier for the minimum tank size, 
				   // which is why it's bigger than the max_multiplier
	var max_multiplier = 0.0;

	var min_tank_size = 100;
	var max_tank_size = 10000;

	// ugly, but I can't think of a better way to do it
	if (tank_size >= 100 && tank_size <= 200) { 
		min_tank_size = 100;
		max_tank_size = 200;
		min_multiplier = 1.5;
		max_multiplier = 1.2;
	}
	else if (tank_size > 200 && tank_size <= 300) {
		min_tank_size = 200;
		max_tank_size = 300;
		min_multiplier = 1.2;
		max_multiplier = 1.04;
	}
	else if (tank_size > 300 && tank_size <= 400) {
		min_tank_size = 300;
		max_tank_size = 400;
		min_multiplier = 1.04;
		max_multiplier = .96;
	}
	else if (tank_size > 400 && tank_size <= 500) { 
		min_tank_size = 400;
		max_tank_size = 500;
		min_multiplier = .96;
		max_multiplier = .88;
	}
	else if (tank_size > 500 && tank_size <= 750) {
		min_tank_size = 500;
		max_tank_size = 750;
		min_multiplier = .88;
		max_multiplier = .80;
	}
	else if (tank_size > 750 && tank_size <= 1000) {
		min_tank_size = 750;
		max_tank_size = 1000;
		min_multiplier = .80;
		max_multiplier = .72;
	}
	else if (tank_size > 1000 && tank_size <= 1250) {
		min_tank_size = 1000;
		max_tank_size = 1250;
		min_multiplier = .72;
		max_multiplier = .66;
	}
	else if (tank_size > 1250 && tank_size <= 1500) {
		min_tank_size = 1250;
		max_tank_size = 1500;
		min_multiplier = .66;
		max_multiplier = .60;
	}
	else if (tank_size > 1500 && tank_size <= 1750) { 
		min_tank_size = 1500;
		max_tank_size = 1750;
		min_multiplier = .60;
		max_multiplier = .54;
	}
	else if (tank_size > 1750 && tank_size <= 2000) { 
		min_tank_size = 1750;
		max_tank_size = 2000;
		min_multiplier = .54;
		max_multiplier = .48;
	}
	else if (tank_size > 2000 && tank_size <= 2500) {
		min_tank_size = 2000;
		max_tank_size = 2500;
		min_multiplier = .48;
		max_multiplier = .42;
	}
	else if (tank_size > 2500 && tank_size <= 3000) { 
		min_tank_size = 2500;
		max_tank_size = 3000;
		min_multiplier = .42;
		max_multiplier = .36;
	}
	else if (tank_size > 3000 && tank_size <= 4000) {
		min_tank_size = 3000;
		max_tank_size = 4000;
		min_multiplier = .36;
		max_multiplier = .32;
	}
	else if (tank_size > 4000 && tank_size <= 5000) {
		min_tank_size = 4000;
		max_tank_size = 5000;
		min_multiplier = .32;
		max_multiplier = .28;
	}
	else if (tank_size > 5000 && tank_size <= 6000) { 
		min_tank_size = 5000;
		max_tank_size = 6000;
		min_multiplier = .28;
		max_multiplier = .26;
	}
	else if (tank_size > 6000 && tank_size <= 7000) {
		min_tank_size = 6000;
		max_tank_size = 7000;
		min_multiplier = .26;
		max_multiplier = .24;
	}
	else if (tank_size > 7000 && tank_size <= 8000) { 
		min_tank_size = 7000;
		max_tank_size = 8000;
		min_multiplier = .24;
		max_multiplier = .22;
	}
	else if (tank_size > 8000 && tank_size <= 9000) {
		min_tank_size = 8000;
		max_tank_size = 9000;
		min_multiplier = .22;
		max_multiplier = .20;
	}
	else if (tank_size > 9000 && tank_size <= 10000) { 
		min_tank_size = 9000;
		max_tank_size = 10000;
		min_multiplier = .20;
		max_multiplier = .18;
	}
	/*else if (tank_size > 10000 && tank_size <= 11000) {
		min_tank_size = 10000;
		max_tank_size = 11000;
		min_multiplier = .18;
		max_multiplier = .16;
	}
	else if (tank_size > 11000 && tank_size <= 12000) {
		min_tank_size = 11000;
		max_tank_size = 12000;
		min_multiplier = .16;
		max_multiplier = .14;
	}*/
	else if (tank_size > 10000) {
		// upper limit 
		return (.18/100);
	}

	var percent = (tank_size - min_tank_size) / (max_tank_size - min_tank_size);

	if (config.is_dev) log.info("ORB TR cost percent is "+percent+" multiplier range is "+min_multiplier+" "+max_multiplier+" for tank size "+tank_size);

	var actual_multiplier = min_multiplier - percent * (min_multiplier - max_multiplier);

	if (config.is_dev) log.info("ORB TR cost multiplier is "+actual_multiplier+" / 100");

	return (actual_multiplier / 100);
}

function getTRSkillMultiplier(pc){ // defined by focusing_orb
	if (pc.skills_has('transcendental_radiation_3')) {
		return 1.5;
	}
	else if (pc.skills_has('transcendental_radiation_2')) {
		return 1.25;
	}
	else if (pc.skills_has('transcendental_radiation_1')) {
		return 1.0;
	}

	return 1.0;
}

function onOverlayClicked(pc, payload){ // defined by focusing_orb
	if(!this.pc) {
		return;
	}

	if(pc.location.orbCanAddPlayer(this.pc.tsid, pc)) {
		if(pc.metabolics_get_energy() <= 25) {
			pc.sendActivity("You do not have enough energy to contribute to this stun attack.");
			return;
		}

		pc.location.orbAddPlayer(this.pc.tsid, pc);
		pc.metabolics_lose_energy(25);

		if(pc.location.orbNumPlayers(this.pc.tsid) < 8) {
			var real_xp = pc.stats_add_xp(10);
			pc.sendActivity("You focus your thoughts on the orb. You lose 25 energy and gain "+real_xp+" iMG.");
		} else {
	 		pc.sendActivity("You focus your thoughts on the orb. You lose 25 energy.");
		}
	}
}

function onOverlayDismissed(pc, payload){ // defined by focusing_orb
	pc.location.removeOrb(pc.tsid);
	this.apiCancelTimer('endMartialImagination');
}

function onTick(){ // defined by focusing_orb
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc || !this.meditating || !pc['!meditating']){
		this.apiCancelTimer('onTick');
		return;
	}

	var ticks = this['!ticks'];

	// Copy is different depending what kind of meditation you are doing
	if (!(pc['!meditating'] == 'transcendental')) {
		if (ticks == 2){
			pc.sendActivity(choose_one(["Ommmmmmmmm ...", "Calm blue ocean.", "You are feeling focused."]));
		}
		else if (ticks == 5){
			pc.sendActivity(choose_one(["The universe is a peaceful place.", "I am safe.", "This is beautiful.", "Other people are not so strange."]));
		}
		else if (ticks == 11){
			pc.sendActivity(choose_one(["Ah. A thought. I gently label it: \"thinking\" and move on.", "Good, good.", "I feel the heart of the giants."]));
		}
	}

	// New TR code:
		if ( (ticks > 0) && (ticks % 3 == 0) && (pc['!meditating'] == 'transcendental')) { 
		
			var tank_size = pc.metabolics_get_max_energy();
			var effect = this.getTRCostTankMultiplier(tank_size) * tank_size * this.getTRCostSkillMultiplier(pc) * 3;

			var pc_energy = pc.metabolics_get_energy();
			if (( pc_energy - effect) <= 0) { 
				if (config.is_dev) {log.info("TR ending meditation for player with energy "+pc_energy+" and effect "+effect); }
				this.endTranscendentalMeditation();
			}	
			else { 	
				//if (config.is_dev) pc.sendActivity("Updating players for tick "+ticks+" tr_messages is "+this.tr_messages);
				if (this.tr_messages.length > 0) { 
					var msg = this.tr_messages.shift();
					pc.sendActivity(msg);
				}
				this.onTRUpdatePlayers(pc);
			}
		}


	this['!ticks']++;

	// New method of ending TR
	if  (pc['!meditating'] == 'transcendental') {
		if ((ticks * 1000) >= this['!skill_ret'].values['duration']) {
			if (config.is_dev) { 
				pc.sendActivity("Ending TR at tick "+ticks+" for duration "+this['!skill_ret'].values['duration']);
			}
			this.endTranscendentalMeditation();
		}
		else { 
			if (config.is_dev) {
				pc.sendActivity("Not ending TR at tick "+ticks+" for duration "+this['!skill_ret'].values['duration']);
			}
		}
	}
		
	this.apiSetTimer("onTick", 1000);
}

function onTRUpdatePlayers(pc){ // defined by focusing_orb
	// To be called every 3 ticks

	// Update radiator:
	if (!this.tr_radiator) { this.tr_radiator = {}; this.tr_radiator = {energy: 0, mood: 0}; }

	var tank_size = pc.metabolics_get_max_energy();
	var effect = Math.round(this.getTRCostTankMultiplier(tank_size) * tank_size * this.getTRCostSkillMultiplier(pc) * 3);

	var mood = pc.metabolics_add_mood(-1 * effect);
	var energy = pc.metabolics_add_energy(-1 * effect);

	if (config.is_dev) { 
		pc.sendActivity("Tank size is "+tank_size+" and tank multiplier is "+this.getTRCostTankMultiplier(tank_size)+" and skill multiplier is "+this.getTRCostSkillMultiplier(pc)+" times 3 ticks equals "+effect);
	}

	energy += this.tr_radiator.energy;
	mood += this.tr_radiator.mood;
	this.tr_radiator = { energy: energy , mood: mood}; 

	var radiator_mood = pc.metabolics_get_mood();

	// Now update recipients
	var dist = pc.imagination_get_radiation_distance();

	var players = pc.location.activePlayers;

	if (!this.tr_recipients) { this.tr_recipients = {}; }

	var count = 0;

	for (var tsid in players) {
		if (tsid != pc.tsid){
			var player = players[tsid];

			if ((dist > 9000) || (Math.abs(player.x - pc.x) <= dist)) {

				count ++;

				// Player just arrived?
				if (!this.tr_recipients[tsid]) { 
					this.tr_recipients[tsid] = { energy: 0, mood: 0}; 
		
					var txt = this.getClassProp("startTRString");
					var player_name = "<a href=\"event:player_info|"+pc.tsid+"\">"+utils.escape(pc.label)+"</a>";
					txt = txt.replace("pc", player_name);
					player.sendActivity(txt);
				}
			
				// 3 seconds of benefit
				tank_size = player.metabolics_get_max_energy();
				effect = this.getTankMultiplier(tank_size) * tank_size * this.getTRSkillMultiplier(pc) * 3;

				if (config.is_dev) { 
					player.sendActivity("Tank size is "+tank_size+" and tank multiplier is "+this.getTankMultiplier(tank_size)+" and skill multiplier is "+this.getTRSkillMultiplier(pc)+" times 3 ticks equals "+effect);
				}

				if (radiator_mood > 0) {
					mood = player.metabolics_add_mood(effect);
				}
				else {
					mood = 0;
				}
		
				// Get rid of the limit on TR
				/*if (player.imagination_has_upgrade("transcendental_daily_limit")) {
					energy_limit = 1.0;
				}
				else {
					energy_limit = 0.75;
				}*/	

				if (!player.buffs_has('zen') ){
					energy = player.metabolics_add_energy(effect);
					player.setProp('radiation_today', intval(player .getProp('radiation_today'))+energy);
				}
				else { 
					energy = 0;
				}

				energy += this.tr_recipients[tsid].energy;
				mood += this.tr_recipients[tsid].mood;
				this.tr_recipients[tsid] = { energy: energy , mood: mood}; 
			}
		}
	}

	// Now check for anybody who left early
	for (var i in this.tr_recipients) { 
		if (!players[i]) { 
			// player has left the location or gone offline
			this.endTRForPlayer(pc, this.tr_recipients[i], false);
		}
	}

	// And end TR if there is nobody getting benefits:
	if (count <= 0) {
		pc.sendActivity("There's nobody near enough for you to radiate.");
		this.cancelTranscendentalMeditation();
	}
}

function startFocusedMeditation(pc, type){ // defined by focusing_orb
	var ret = pc.runSkillPackage('focused_meditation', this);
	if (ret['ok']){
		var duration = ret.values['duration'];

		this.apiSetTimer('endFocusedMeditation', duration);

		// Start overlays
		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			item_class: 'focusing_orb',
			duration: duration + 100,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 0,
			delta_y: -8,
			width: 80,
			height: 80,
			uid: pc.tsid+'_meditation_self'
		});

		pc.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: 'focusing_orb',
			duration: duration + 100,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -110,
			bubble: true,
			width: 40,
			height: 40,
			uid: pc.tsid+'_meditation_all'
		}, pc);

		pc.sendActivity(choose_one(["Ah ... meditation.", "R-e-l-a-x-i-n-g."]));
		if (type == 'energy'){
			pc.announce_music('FOCUSED_MEDITATION_ENERGY', 10);
		}
		else{
			pc.announce_music('FOCUSED_MEDITATION_MOOD', 10);
		}

		pc['!meditating'] = 'focused';
		this['!focus_type'] = type;
		this.meditating = true;
		this['!ticks'] = 0;
		this.apiSetTimer("onTick", 1000);
		this.uses++;
		this['start_time'] = getTime();
		this['!skill_ret'] = ret;

		return true;
	}

	pc.sendActivity("Awww, that didn't work!");
	return false;
}

function startMartialImagination(pc){ // defined by focusing_orb
	pc.location.addOrb(pc, this);
}

function startStandingMeditation(pc){ // defined by focusing_orb
	var ret = pc.runSkillPackage('meditative_arts', this);
	if (config.is_dev) log.info("ORB: ret is "+ret);
	if (ret['ok']){
		var duration = ret.values['duration'];

		this['start_time'] = getTime();
		this.apiSetTimer('endStandingMeditation', duration);

		// Start overlays
		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			item_class: 'focusing_orb',
			duration: duration + 100,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 0,
			delta_y: -8,
			width: 80,
			height: 80,
			uid: pc.tsid+'_meditation_self'
		});

		pc.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: 'focusing_orb',
			duration: duration + 100,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -110,
			bubble: true,
			width: 40,
			height: 40,
			uid: pc.tsid+'_meditation_all'
		}, pc);

		pc.sendActivity(choose_one(["Ah ... meditation.", "R-e-l-a-x-i-n-g."]));
		pc.announce_music(choose_one(['MEDITATIVE_ARTS_01', 'MEDITATIVE_ARTS_02']), 10);

		pc['!meditating'] = 'standing';
		this.meditating = true;
		this['!ticks'] = 0;
		this.apiSetTimer("onTick", 1000);
		this.uses++;
		this['!skill_ret'] = ret;

		return true;
	}

	pc.sendActivity("Awww, that didn't work!");
	return false;
}

function startTranscendentalMeditation(pc){ // defined by focusing_orb
	var ret = pc.runSkillPackage('transcendental_radiation', this);
	if (ret['ok']){
		var duration = ret.values['duration'];

		if (config.is_dev) { pc.sendActivity("Duration from skill package is "+duration); }

		

		// Force it to be a multiple of 3 seconds:
		duration = Math.round(duration/1000);

		var rem = duration % 3;
		if (rem > 0 && rem == 1) { 
			duration -= 1;
		}
		else if (rem == 2) { 
			duration += 1;
		}

		if (config.is_dev) { pc.sendActivity("Duration adjusted is "+duration); }


			// new upgrade effect
			
			if (pc.imagination_has_upgrade("transcendental_benefits_2")) {
				duration *= 1.5;
			}
			else if (pc.imagination_has_upgrade("transcendental_benefits_1")) {
				duration *= 1.2;
			}

		if (config.is_dev) { pc.sendActivity("Duration after applying upgrade is "+duration); }


			// Again, force it to be a multiple of 3: (we are doing this twice deliberately)
			duration = Math.round(duration);

			var rem = duration % 3;
			if (rem > 0 && rem == 1) { 
				duration -= 1;
			}
			else if (rem == 2) { 
				duration += 1;
			}

			if (config.is_dev) { pc.sendActivity("Duration adjusted a second time is "+duration); }

			duration = duration * 1000;
			ret.values['duration'] = duration;

			log.info("ORB: duration is "+ret.values['duration']);
		
		/*else {
			// old way of ending it (new way is to call it from onTick)
			this.apiSetTimer('endTranscendentalMeditation', duration);
		}*/


		// Start overlays
		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			item_class: 'focusing_orb',
			duration: duration + 100,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 0,
			delta_y: -8,
			width: 80,
			height: 80,
			uid: pc.tsid+'_meditation_self'
		});

		pc.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: 'focusing_orb',
			duration: duration + 100,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -110,
			bubble: true,
			width: 40,
			height: 40,
			uid: pc.tsid+'_meditation_all'
		}, pc);

		pc.sendActivity("You begin to radiate.");
		pc.announce_music(choose_one(['TRANSCENDENTAL_MEDITATION_01', 'TRANSCENDENTAL_MEDITATION_02']), 10);


			// check all active players and give those within range a message
			if (!this.tr_recipients) { this.tr_recipients = {}; }
		
			var players = pc.location.activePlayers;
			var dist = pc.imagination_get_radiation_distance();

			//log.info("ORB: dist is "+dist);

			for (var tsid in players) {
				if (tsid != pc.tsid){
					var player = players[tsid];

					if ((dist > 9000) || (Math.abs(player.x - pc.x) <= dist)) {
						var txt = this.getClassProp("startTRString");
						var player_name = "<a href=\"event:player_info|"+pc.tsid+"\">"+utils.escape(pc.label)+"</a>";
						txt = txt.replace("pc", player_name);
						//log.info("ORB: sending "+txt+" to "+player);
						player.sendActivity(txt);

						// init data so we don't send the message twice
						if (!this.tr_recipients[tsid]) { 
							this.tr_recipients[tsid] = { energy: 0, mood: 0}; 
						}
					}
				}
			}

		//Create a list of messages to show to the radiator:
		var tank_size = pc.metabolics_get_max_energy();
		var effect = Math.round(this.getTRCostTankMultiplier(tank_size) * tank_size * this.getTRCostSkillMultiplier(pc) * 3);

		this.tr_messages = [];
		this.tr_messages.push("Each pulse takes "+effect+" Mood and "+effect+" Energy.");
		this.tr_messages.push("Click (almost) anywhere or move to stop radiating.");
		this.tr_messages.push("You emit a burst. -"+effect+" Mood -"+effect+" Energy");
		
		var temp = ["You emit a burst of love. -"+effect+" Mood -"+effect+" Energy",  "You emit a burst of joy. -"+effect+" Mood -"+effect+" Energy", "Your power goes to benefit all. -"+effect+" Mood -"+effect+" Energy", "You radiate your inwardness outwards. -"+effect+" Mood -"+effect+" Energy", "You're givin' it, soul2soul. Yeah. -"+effect+" Mood -"+effect+" Energy", "Your kindness envelops others. -"+effect+" Mood -"+effect+" Energy"];

		// Make sure we have enough to cover the entire duration
		var target = duration/1000;
		target = Math.round(target / 3);
		target += 3;

		// This rejects duplicate messages, and I suppose that there's a very slight chance this 
		// could loop for a ridiculously long amount of time, but I really don't think it's very likely, 
		// so I'm ignoring it.
		while (this.tr_messages.length < target) { 
			var msg = choose_one(temp);
			if (this.tr_messages[this.tr_messages.length - 1] != msg) {
				this.tr_messages.push(msg);
			}
		}


		pc['!meditating'] = 'transcendental';
		this.meditating = true;
		this['!ticks'] = 0;
		this.apiSetTimer("onTick", 1000);
		this.uses++;
		this['start_time'] = getTime();
		this['!skill_ret'] = ret;

		return true;
	}

	pc.sendActivity("Awww, that didn't work!");
	return false;
}

// global block from focusing_orb
var meditating = false;
var uses = 0;

function doBreak(){ // defined by tool_base
	this.setInstanceProp('is_broken', 1);
	this.updateState();
	this.informClient();

	if (this.getClassProp('can_repair') == 0) return;

	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc || !pc.is_player) return;

	pc.announce_sound('TOOL_BREAKS');

	var txt = "Ooops! You done broke your "+this.name_single+".";
	pc.prompts_add({
		txt		: txt,
		icon_buttons	: false,
		timeout		: 5,
		choices		: [
			{ value : 'ok', label : 'OK' }
		]
	});

	pc.sendActivity(txt);

	pc.quests_inc_counter('tool_broke_'+this.class_tsid, 1);
	if (this.class_tsid == 'irrigator_9000'){
		// http://bugs.tinyspeck.com/5784

		pc.quests_inc_counter('tool_broke_watering_can', 1);
	}
}

function getBaseCost(){ // defined by tool_base
	// [20% of BC] + [80% of BC * current wear/maximum wear)
	// This was producing issues with tools like the gassifier that do not have a points capacity
	if(intval(this.getClassProp('points_capacity'))) {
		return (this.base_cost * 0.2) + (this.base_cost * 0.8 * floatval(this.getInstanceProp('points_remaining')) / intval(this.getClassProp('points_capacity')));
	} else {
		return this.base_cost;
	}
}

function getEnergyPerTwoTicksRepair(pc){ // defined by tool_base
	//if (!pc) { return 0; }

	var details = pc.getSkillPackageDetails('tinkering');

	var energy = Math.round((details.bonus_amount / 100 * ((this.base_cost)/(this.getClassProp('points_capacity')))) * details.tool_wear);

	return energy;
}

function getHitPointModifier(pc){ // defined by tool_base
	return 1;
}

function getTooltipLabel(){ // defined by tool_base
	if (this.getClassProp('display_wear') == 1 && hasIntVal(this.getClassProp('points_capacity')) && this.getClassProp('points_capacity') > 0){
		return this.label + ' ('+floatval(this.getInstanceProp('points_remaining'))+'/'+intval(this.getClassProp('points_capacity'))+')';
	}
	else{
		return this.label;
	}
}

function informClient(){ // defined by tool_base
	var container = this.apiGetLocatableContainerOrSelf();
	if (!container || !container.is_player) return;

	return;
	container.apiSendMsgAsIs({
		type: 'tool_state',
		itemstack_tsid: this.tsid,
		tool_state: this.get_tool_state()
	});
}

function isWorking(points){ // defined by tool_base
	// We need fully-formed instance props
	if (!this.instanceProps || this.instanceProps.points_remaining == undefined){
		this.initInstanceProps();
	}

	// Temp fix to make sure no one's tools became broken unexpectedly
	if (floatval(this.getInstanceProp('points_remaining')) < 0 && intval(this.getClassProp('points_capacity')) != 0){
		this.setInstanceProp('points_remaining', intval(this.getClassProp('points_capacity')));
	}

	// No capacity means it works
	if (!hasIntVal(this.getClassProp('points_capacity')) || intval(this.getClassProp('points_capacity')) == 0) return true;

	// Are we flagged as broken?
	if (intval(this.getInstanceProp('is_broken')) == 1) return false;

	// If we don't display wear, then we're working
	if (intval(this.getClassProp('display_wear')) == 0) return true;

	// Do we have enough points remaining
	if (!points) points = 1;
	var pc = this.getRootContainer();
	if (pc && pc.is_player){
		points *= this.getHitPointModifier(pc);
	}
	return (floatval(this.getInstanceProp('points_remaining')) - points) >= 0 ? true : false;
}

function needsRepair(){ // defined by tool_base
	var needs_repair = false;

	if (this.getInstanceProp('is_broken') == 1){
		needs_repair = true;
	}
	else if (this.getInstanceProp('points_remaining') < this.getClassProp('points_capacity') && this.getClassProp('display_wear') == 1){
		needs_repair = true;
	}

	return needs_repair;
}

function onContainerChanged(oldContainer, newContainer){ // defined by tool_base
	this.updateState();
}

function onConversation(pc, msg){ // defined by tool_base
	if (msg.choice == 'repair-no'){
		this.conversation_end(pc, msg);
	}
	else{
		this.conversation_end(pc, msg);

		var contents = pc.getAllContents();
		if (contents[msg.choice]){
			tinkertool.startRepair(contents[msg.choice]);
		}
		else{
			this.conversation_reply(pc, msg, "Not sure what you mean there...");
		}
	}
}

function onCreate(){ // defined by tool_base
	this.initInstanceProps();
	this.updateLabel();
}

function onLoad(){ // defined by tool_base
	if (this.getInstanceProp('is_broken') == 1) return;
	if (!this.isWorking()){
		this.doBreak();
	}
	else{
		this.updateLabel();
	}
}

function onPropsChanged(){ // defined by tool_base
	// Set instance prop directly. Don't call setInstanceProp since that will produce a stack overflow
	this.instanceProps['points_remaining'] = floatval(this.instanceProps['points_remaining']);

	this.updateLabel();
	this.updateState();
}

function repair(points){ // defined by tool_base
	this.setInstanceProp('points_remaining', floatval(this.getInstanceProp('points_remaining')) + points);

	if (this.getInstanceProp('points_remaining') > this.getClassProp('points_capacity')){
		this.setInstanceProp('points_remaining', this.getClassProp('points_capacity'));
	}

	if (this.getClassProp('display_wear') == 0 && this.getInstanceProp('points_remaining') == this.getClassProp('points_capacity')){
		this.setInstanceProp('is_broken', 0);
	}
	else if (this.getClassProp('display_wear') == 1 && this.getInstanceProp('points_remaining') > 0){
		this.setInstanceProp('is_broken', 0);
	}

	this.updateLabel();
	this.updateState();

	return this.getClassProp('points_capacity') - this.getInstanceProp('points_remaining');
}

function rollCraftingBonusImagination(pc, recipe_id, count, upgrade_id, chance_of_bonus, bonus_base_cost_percentage){ // defined by tool_base
	if (!pc.imagination_has_upgrade(upgrade_id)) return;

	if (is_chance(chance_of_bonus) || pc.buffs_has('max_luck')){
		var recipe = get_recipe(recipe_id);
		if (!recipe) return;

		var base_cost = 0;
		var item = null;
		var crafting = '';
		for (var i in recipe.outputs){
			item = apiFindItemPrototype(recipe.outputs[i][0]);
			if (item){
				base_cost += item.getBaseCost() * recipe.outputs[i][1] * count;
				if (crafting != '') crafting += ',';
				crafting += recipe.outputs[i][0];
			}
		}

		if (!base_cost) return;

		var change = Math.round(base_cost * bonus_base_cost_percentage);
		var context = {};
		context['tool'] = this.class_id;
		context['crafting'] = crafting;
		context['img_upgrade'] = upgrade_id;
		context['base_cost'] = base_cost;

		var actual = pc.stats_add_xp(change, false, context);

		if (actual > 0) {
			pc.sendActivity('Hey, you got '+actual+' bonus imagination for making that.');
		}
		
	}
}

function updateLabel(){ // defined by tool_base
	if (this.label != this.name_single){
		this.label = this.name_single;
		this.informClient();
	}

	/*if (this.getClassProp('display_wear') == 1 && hasIntVal(this.getClassProp('points_capacity')) && this.getClassProp('points_capacity') > 0){
		this.label = this.name_single + ' (' + this.getInstanceProp('points_remaining') + '/' + this.getClassProp('points_capacity') + ')';
		this.informClient();
	}*/
}

function updateState(){ // defined by tool_base
	if (this.isOnGround()){
		if (this.isWorking()){
			this.setAndBroadcastState('1');
		}
		else{
			this.setAndBroadcastState('broken');
		}
	}
	else{
		if (this.isWorking()){
			this.setAndBroadcastState('iconic');
		}
		else{
			this.setAndBroadcastState('broken_iconic');
		}
	}
}

function use(pc, points){ // defined by tool_base
	if (!this.instanceProps || this.instanceProps.points_remaining == undefined){
		this.initInstanceProps();
	}

	if (this.getClassProp('points_capacity') == 0) return false;

	if (!points) points = 1;

	if (!this.isWorking(points)) return false;

	this.instanceProps.points_remaining = floatval(this.instanceProps.points_remaining) - (points * this.getHitPointModifier(pc));

	// Tools that display wear break at 0
	// Otherwise we roll the dice
	if (this.getInstanceProp('points_remaining') <= 0){
		this.setInstanceProp('points_remaining', 0);

		if (this.getClassProp('display_wear') == 1 || this.has_parent('potion_base')){
			this.doBreak();
		}
		else{
			var chance = 0.10;
			if (this.getClassProp('required_skill')){
				if (pc.skills_get_highest_level(this.getClassProp('required_skill')) == 2){
					chance = 0.05;
				}
			}

			// max_luck is undesirable for end of world
			// if (is_chance(chance) || pc.buffs_has('max_luck')){
			if (is_chance(chance)){
				this.doBreak();
			}
		}
	}

	this.updateLabel();
	return true;
}

function parent_onOverlayDismissed(pc, payload){ // defined by tool_base
	pc.announce_sound_stop(this.class_tsid.toUpperCase());
}

// global block from tool_base
var is_tool = true;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("meditativearts_1"))) out.push([1, "You need the skill <a href=\"\/skills\/55\/\" glitch=\"skill|meditativearts_1\">Meditative Arts I<\/a> to use this."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"meditation",
	"tool"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-17,"y":-38,"w":33,"h":38},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAQf0lEQVR42rWYyW8bWX7HfUgQIAvm\nkksuCQYBcg2Q5TCHZP6BAA3kEgQIMIckPcBMt9tuL7ItW5J3W14ky9bmTau1S9zFVaQWklpIcae4\nU5REiqS4SCJZ9Wp5ryq\/R7cdd2YyS08PgR9esch69Xnf3\/aqzpz5jh9NQv6RJkau6uJkSBsjNm0U\n29RRYlOBNccd\/N4ipH1+B\/9bz6L8R2d+35\/5HfnvAKZLn5COl3eJvHEgNW39GzMlJFkTlWR1DKw5\nEhiJrIripimjZEidkH\/8vYOZU\/IPNHEyYElKsjsnydGSJKeqkrx\/Isn5uiRXWUk+QZJc48B4Ih81\niLx3TOSdIyJv54hsTRFZR0EjuGkLO2RlPir\/4\/cCZ0jIn2nj0rGLgh1JsveQQhLZc0jkUIHIyTKR\nDwC0UCPyMSIyEiSZBasw9DyR01UihfJY9sA1VHVdjCoKykaIPBci3Z+75T\/8HVxKuozgtkDhvQup\nEhQsAVCHp5JUrEvSUUOSSg16TOQiQJYZSW7wklznqLpE2q1iKVmRSLhIyFaOEPseloxxDIBg4PaF\nMLaN7ch\/8VvD0XgxJHBTLX0c3JQgsi9P5CyAZU8kkjuVCLiXACA5ZmVyippulvI1IpUYIp0CIEBL\nqSohsRIh4SOCfYdYdGSwaE1hbEpiogFAasqwGJuIyX\/+G8PNhsj1D3AacMdSClPVpGRZIv4CEbdz\nIvYXMA4dYRwvSzhVIfioAZCcTJUkEJtN6AojkUQJ48gREYN5LHoPibB1QASYjzPGsKCJYIGqqIlh\nWbEjzLfb5D\/4tXAzQfyfUD5kVxbgYISVylSBUJFgR4YIG3CDnSIWIQkwxB6mY6wsickKxlWWkMMa\nIRB3uMRI8F0m8RIWgwUsABzvykrc+h7mVncx0kZFRh0RufkQRlRFbYxmOpn9lXC6iPw3yghmqHKG\nBGnKH8gDHChgSRHkhMkhnkRwMz6sSbhQlzDEIYkWsQAJJEAs4gJYrEwEgBfLjIwhiQRfXuIgm9HG\nPmbXMiKznMKMNirUF8JCfT7Es9NBoaEDwEValnZIy\/8LCEHstWeI7Nx\/XxJWMwRHSpJoSWLWnMRM\nqiLx8TIWAJR1HYgoc0IEChkpEj6YJ\/zBKREhecRwgfC7FSyAu3GyRJXD7OYBZiA0GFiAcIJkcS2D\n67NBfDwdEE4nfXxtJiieLsbfx7s2Ivz9L8C5s\/JPaI2DmAI4Is+HsRAsNGMGTQfEU09OYiEGOXsG\nN1ZSYmNtV2CCBYkFJSG2MOvJSyzAihTIm8OIjpDFYvSIIHBrw54R66A8L3\/zSVYImvQJpTGfUBn3\nicej28LRfEhs6MFzugRx\/KJ6WbIbLkoyNUWY4KUEFqDO8YqQUJsM8NV4mXD2XVyHAD+1JsWaLS3W\nYAEATSCuxIb3UGRyNSIE8pjdyuIGLAblahIP8cqAW09X0vgEMl74AAhKo3GPUBim5ubLrzdRdcyN\nKpCUvDFBlcT\/+i31aCHerb7vFKqwWHNnCQeubIxsC2XIuGqogBnVjlhxZsSaax\/XAaqeOZa4rQOx\nvprBp5Ejid07pgqLNfuuWIP6x0Ecct6c0LClybE5gavOPXIM5QmVWZmHOYvD28LBkJvP9Ttq1YH1\n+nHfWr0w4UE1Y5LIxgTe\/VQ92wdAxx7htBGxFKBAEaH6xiUUAPRk84CczIXEI7hRJVGRGEgWdjsr\n1umNIbtPMlXCwTWNZVAK4usEshtlqhKCOK4a42J5MSqWNBHhCGpefjYgHALY\/ug2X3m5xR\/02CqV\n\/g3ucGCTT7\/dYvKwyUDmFDSGtPy3Z9xV+QcUDjKtGX\/mhFgyJXAxUCAnr1x8HibIQfWvuLP4eNwr\n5CCYC5aEWLamxApdCKhThqylLmUgmcoAXIaCfLpbIWy8RBp6ChcjRU1ELCjCwuFsSMi99QhpmDf1\naks46NsQkt22auG5gz14sc7HX21xsUlP48SSlqD+kq4zrpz8GQX0QzsLH0kiZFAGWlHRn8eV3g0+\nARNkllJiyZ8nJxCPh8Pb\/N5MAOcWdoT8ahqXocTUExXSgDZYgp1O0ZLCpWQVgOHc+j6uQb07VYTE\nJth0UNx76xKSg5tCHOaN9a\/zqRdOLtZtZ1IPLeXCQ0sl27NWDw9t1fPamMhBvHspYPsHQMjG+lyQ\n34EMPfLlxNILBxcA2bNzAb7gOyRVPxiocwzj8U5ROokc4Vq4CEmTJkVFUDzURMXDQJGcQCmqwwbh\nVBkQ8rNB4XDGJ4A7hdTLLYDaFKK963zkuVMID2wJez1OPvJ0jdvpXKqlH1iPE1121jXoqO\/OB7ma\nFVQEQEnxAdCTEyvvvJxHFxX2AKT42sX5ep0o3O3ko8od4QAWUIZsrcBvTbMlhTyUisw7r7A3F8T7\n0C2q0NYgYfCpIU5yo14h3VTMJUT7NvhIL0C9cPKhHgcX6rZzgS4773+yxvs7V7lA5yoKPVrlPE9X\nkePZUik9sd0oQ\/jIHxPEmyc4XBArI9vcpmZHSAFs3pwUE\/SCxyvIQSeDyXdAicQYGI2V3g0h0rfO\nR19u8nFnRij6mvBiZSkpZsF90X4437fBxQY3+T3wRqhrhdl5ZD2N3jdVY\/dM1ehdUyVyW1+N3KKj\nsRrt0BbDN+aTO536g8yYB+2bkxL3ERB6LJso48qQC9nfuHk37N9ynizef+cXtjtXuOWHNrQCK9wG\ndwSodTv4IACHp\/1CypUjRSjOJR+YKS7uN1X6Rqke+F\/XKhu6byilbmlye+2qg0ybcj9zQ3mwe12x\nn76m2Eu30nF+f\/fq\/IH\/hnLf3bVy7Bnx8HFIsNpHQFsaH4NrCsow53q6hpYde+KuOyfuQSnJLEb5\nQI8TLXcuc5YHNuTscnC+qYAQ39gX854cLsIesQjuL0InSHTbBX8XNQfve2rnfFStDnV276Y2n7xj\nrOzcNde8d61o854Nbdy2cs5bFuS8beXBuI12E6u\/u8zqYQ47lKEQZH75IyC4pQJuPYDy4X+8xup7\n17mN9X0RXE3S21mcAtDUx\/FAzEAhz7mzYh7KT96axpn+TRHiiPPQOKLjwxXkuaktJNrUueRdS817\nz8ZtPrAJ65AcLui\/QX1MjMJGITQZEP2TPjEw6ReCpoSwPeXnHM8d3NrrLd6vCgsFukEYooC0\/q2k\nxbj\/UEw+XmHn71i5pedObgU6Q9SVFZPUAC7pyZKE5\/1xChTcnfCL4fvL\/NandneJdbUqc\/GOxVLw\nro1ff2rnN+fDYnhtF6chBGJjXt7TZuaW202crc3CWW\/A2GriFm8usbMA7XRkxNiIm\/eqoKx9LDO0\nOGsifChUEHdnA5zl1hK7cNPCGTrMSAdqWmb8vHPGLzpnfLxzFsY3Lm75tgXpbltYI7hn5Ra4i7qs\n3Vzbapnfj97QV7ch\/japUrC33IOiHulcFextFh6AeAtAWVqNnBlG61UYr+iZyesmNHFnCSktcdEP\n\/w8DYPZjoaaAtMRQBcF1\/lsWZqTNyGq71jjPkzXkhokUMLGCjteNSNlmRKp2E1K3m3l1hwVpwHTX\nDfWVS\/PZ4JMVdosCQZ\/eW90liedOEcD5pVYzheJN14y84YqBA2MN1wyc\/pIBKVv0zFCrEY3fXeIU\nALZligsx9Y5gOOM5lP\/qU0Bwsz+YFyOKEG9sMzWGIZbs1K6Z2PlWA5q7amDnWg383HUTPw\/AC+\/B\nOcVlRcHUsrC\/pgghN+wVE7CnTAy5Bdd1UOcahTLwxvdQnP6yjtVd1iNNyyLSXtYh1UUd8\/qelVXf\nXEIz963sAnQz91JCiEGSdHzcqNIkmfLxgREXtwrJEoZ6Fhhxo7krBmbkqp6dvWxgZ2DC6aYZ0PRV\nPZoBm72yWF+4tLC\/NLhW2XAfiBFqEOzue1akukoXBPBXmgoh1SUdq720iNQXtfSYV17UIeV5NfP6\ngo7tv2NpzLVb0bsHy+wCXO+dDwl+fUL40XvAQ\/krWmYgzkKvttDyjJ+z+fNiELqGRxnm1W1GZhhc\nMNmiYybhBu9g1RMXlCezLeqKqn\/1xOZIcyFIorDrAIehV1voIq4Y0RS1lkV2+vIiO3VJhybpdQA1\neVGDpi9o0dTgBqeY8HKKvnU01WpqvL1lZiceLHMLsNf0j3uQ9n\/3g7CjgQeZ7EKYj9NC\/czOaoxx\nbs2XE7ywn3PDze2qMDK+84rmcZ9gGvfwJug2awAUbFoWB41xYeOaiWsugNpFOurYieZ3LRq\/pGXH\nv9YyYxc0zCjADRtj\/KI9JZisSd6ojXCLbcb6y3u2xrgyLKxMepFzLoD\/41s7aoiZG+qIkKatrtfB\n6juX2ZkeBzNpTXI22DhsAuw6lJZNqHteCH5\/07LYv74reoa2OP0FHRql1oT45rgJAwbnRs4D1Nca\nNHROxfTpY4IOFqS6oK09atM3et5sool2U\/314Car0EV555CL06ui8p99+5kEVDTEhOi4h9se2OQs\nT9fYhTuW+ugNY33w5SYahwtVtjivhxUvmuO8WRHkLQPrSPmVhnl7XoXenlMzQ\/\/X6Hn6+zk1++Yr\nNTN4VtV4At3iMSzY8XCZ6b2orT2+qm88g+wfuL\/MjELsOXqdrGF4W\/znX\/pUt7yL\/51ut15vodUe\nJ6t5sNyYpCu7bqz3tSw2uumE59W1h+dV9ftnVfV7XygaT84q2Z6vlHBzDXoFyfO23YxGP5oJYlfL\n9H2pbHR+qajfPqus35n2oglvjndS9S5rG12t+nrvo1VmeCkp2AfXWS0s+umvfDaG547OppthJZAw\nms4VdpyqeNXAPL+sazylE8P33u5Vdu6StvEIamVnn4PtH3MzIyMu9PZTm\/SgsYUgmqLHFzT1++dg\nUZCIE6CgczbAz8z6uQXdDjIup\/m1gU1W1WNn3\/Tajv70175dmPIJMzSbu+2sGly+OBvkta822In+\ndTTa52TeDqwzo+MeVjvqpt\/Zlx2mxhOq0C8z+huUr\/FJHzf2tbrx4O0WGvbnxHUa19AU3PoIZ368\nwkw+WWXHBx3cX\/9G72ZogIKKnXBzI+3LNLs6TPVX1\/QnAy2a4xdfKyvPzilKXV\/OFZ9+OVN8eklR\n6OldqYy+slcnPrUHxuKbn01ku68s5Pqn3cfqS\/O5vrOzuRdPrNXxblt56qr6aLjDcPzu4TLb+XwT\n\/fC3fsPVu3bc8UCf32pX7Tsuz6aXz03Gl74Yj1l+PhIz\/XQ4avrvoYjp52Mx66Dt0NO\/lPXcVO1t\ntcxk1i9MpRydiwdbg7a857\/e7FguTydW3qxkPZ8PRY0\/HYkavxiLmc6+i5svzqaXWqbik4+MhT\/5\nzu8Iuy35f3myfDp7z3Iy366vTrRqy8OXVcU3FxWlwfMLxf6buuLrOc+J+po6P\/Dl7OGzs3OFbmq3\njeXBm\/rywAXFUc87d33mlbM+0aI7fdG6eNpPY\/rWEjMEXePr3wnuw4fGRrcdXXu4wk7T0kMzu81U\nH6AZeA3qGMTYDBT40XZj4xkkzhOa7XS8Z2X6IBlmJ7xoGrpR3w1DvR+ufXXTzPQ9tDH\/8L2\/q36+\ngn74aA39DG78kipAb0ZBO8xMf6+TGX3nRRRmhhr08enHq8zb2xZmkNY52ik6lpj2W5baP\/3e3\/YP\nuuU\/7rTWf3zHynzesdR41FTUXH9JXfep0XPthsZFUOyzdjP7l9\/lXv8DTB+tYb6yB2oAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/focusing_orb-1334270104.swf",
	admin_props	: true,
	obey_physics	: true,
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
	"meditation",
	"tool"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "focus_energy",
	"o"	: "focus_mood",
	"v"	: "levitate",
	"t"	: "radiate",
	"g"	: "give",
	"c"	: "meditate",
	"h"	: "repair",
	"u"	: "stun_attack"
};

log.info("focusing_orb.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
