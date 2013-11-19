//#include include/takeable.js

var label = "Potion of Animal Youth";
var version = "1355086256";
var name_single = "Potion of Animal Youth";
var name_plural = "Potion of Animal Youth";
var article = "a";
var description = "Animals, anxious about aging and longing for childhood, can be soothed by application of this potion: the only effusion with the proven ability to turn back time.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1500;
var input_for = [];
var parent_classes = ["potion_animal_youth", "potion_base", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "",	// defined by tool_base
	"points_capacity"	: "3",	// defined by tool_base (overridden by potion_animal_youth)
	"display_wear"	: "1",	// defined by tool_base
	"can_repair"	: "0",	// defined by tool_base
	"can_pour"	: "1",	// defined by potion_base (overridden by potion_animal_youth)
	"can_quaff"	: "0",	// defined by potion_base
	"pour_tooltip"	: "Babify an animal",	// defined by potion_base (overridden by potion_animal_youth)
	"quaff_tooltip"	: ""	// defined by potion_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "3";	// defined by tool_base (overridden by potion_animal_youth)
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

verbs.pour = { // defined by potion_animal_youth
	"name"				: "pour",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return this.getClassProp('pour_tooltip');
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		function is_valid_animal(it){ return (it.class_tsid=='npc_chicken' || it.class_tsid=='npc_piggy' || it.class_tsid=='npc_butterfly' ); }
		var animals = pc.findAllCloseStacks(is_valid_animal, 200);
		if (!animals.length) {
			return {state: 'disabled', reason: 'There is nothing to pour this on!'};
		}

		return {state: 'enabled'};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: true,
	"valid_items"		: function(pc){

		function is_valid_animal(it){ return (it.class_tsid=='npc_chicken' || it.class_tsid=='npc_piggy' || it.class_tsid=='npc_butterfly' ); }
		var animals = pc.findAllCloseStacks(is_valid_animal, 200);
		if(animals.length) {
			var animal_tsids = [];
			for (var i in animals) {
				animal_tsids.push(animals[i].tsid);
				animals[i].onInteractionInterval(pc, 3);
			}

			return {
				ok: 1,
				choices: animal_tsids
			};
		} else {
			return {
				ok: 0,
				txt: "There is nothing to pour this on!"
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!msg.target) {
			msg.target = apiFindObject(msg.target_itemstack_tsid);
		}

		if (msg.target) {
			return this.parent_verb_potion_base_pour(pc, msg, suppress_activity);
		} else {
			pc.sendActivity("Hm… I couldn't find that animal.");
			return false;
		}
	}
};

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

verbs.quaff = { // defined by potion_base
	"name"				: "quaff",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var tooltip = this.getClassProp('quaff_tooltip');
		if (tooltip && tooltip.length) {
			return tooltip;
		} else {
			tooltip = this.getInstanceProp('quaff_tooltip');
			if (tooltip && tooltip.length) {
				return tooltip;
			} else {
				return "This potion ain't hooked up right!";
			}
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.getClassProp('can_quaff') || !intval(this.getClassProp('can_quaff'))) {
			return {state: 'null'};
		}

		if (pc.is_dead) {
			return {state: 'disabled', reason: "This is no time to be messing about with potions. You're dead!"};
		}

		if (this.canQuaff) {
			var result = this.canQuaff(pc);
			if (result.ok) {
				return {state: 'enabled'};
			} else {
				if (result.error) {
					return {state: 'disabled', reason: result.error};
				} else {
					return {state: null};
				}
			}
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.onPreQuaff(pc, msg);

		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: 2500,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 0,
			delta_y: -135,
			width: 60,
			height: 60,
			uid: pc.tsid+'_powder_self'
		});

		pc.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: 2500,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -135,
			bubble: true,
			width: 40,
			height: 40,
			uid: pc.tsid+'_powder_all'
		}, pc);

		pc.announce_sound('POTION_GENERIC');

		this.apiSetTimerX("onQuaffComplete", 2500, pc, msg);

		return true;
	}
};

function parent_verb_potion_base_pour(pc, msg, suppress_activity){
	if (msg.target){
		var target = msg.target;
	} else {
		if (this.getValidTargets) var target = this.getValidTargets(pc).pop();
	}

	// Start overlays
	if (target){
		msg.target = target;

		this.onPrePour(pc, msg);

		if (target.class_id == 'npc_chicken' ||
		    target.class_id == 'npc_piggy' ||
		    target.class_id == 'npc_butterfly'){
			target.onInteractionStarting(pc);
		}

		if (target.x < pc.x){
			var state = '-tool_animation';
			var delta_x = 10;
			var endpoint = target.x+100;
			var face = 'left';
		}
		else{
			var state = 'tool_animation';
			var delta_x = -10;
			var endpoint = target.x-100;
			var face = 'right';
		}
			
			
		// Move the player
		var distance = Math.abs(this.x-endpoint);
		pc.moveAvatar(endpoint, pc.y, face);

		var annc = {
			type: 'itemstack_overlay',
			itemstack_tsid: target.tsid,
			duration: 2500,
			item_class: this.class_tsid,
			state: state,
			locking: true,
			delta_x: delta_x,
			delta_y: 20,
			uid: pc.tsid+'_powder_self'
		};

		if (this.onOverlayCancel){
			annc.dismissible = true;
			annc.dismiss_payload = {item_tsids: [this.tsid]};
		} else {
			annc.dismissible = false;
		}

		pc.apiSendAnnouncement(annc);
	}
	else{
		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: 2500,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			locking: true,
			dismissible: false,
			delta_x: 0,
			delta_y: -135,
			width: 60,
			height: 60,
			uid: pc.tsid+'_powder_self'
		});
	}

	pc.location.apiSendAnnouncementX({
		type: 'pc_overlay',
		item_class: this.class_tsid,
		duration: 2500,
		state: 'tool_animation',
		pc_tsid: pc.tsid,
		delta_x: 0,
		delta_y: -135,
		bubble: true,
		width: 40,
		height: 40,
		uid: pc.tsid+'_powder_all'
	}, pc);

	pc.announce_sound('POTION_GENERIC');

	this.apiSetTimerX("onPourComplete", 2500, pc, msg);

	return true;
};

function parent_verb_potion_base_pour_effects(pc){
	// no effects code in this parent
};

function canPour(pc){ // defined by potion_animal_youth
	if (!this.getValidTargets || !num_keys(this.getValidTargets(pc))) return {error: "There are no animals around here."};

	return {ok: 1};
}

function getValidTargets(pc){ // defined by potion_animal_youth
	function is_valid_animal(it){ return (it.class_tsid=='npc_chicken' || it.class_tsid=='npc_piggy' || it.class_tsid=='npc_butterfly' ); }
	var animal = pc.findCloseStack(is_valid_animal, 200);
	if (!animal) return [];
	return [animal];
}

function onPour(pc, msg){ // defined by potion_animal_youth
	var target = msg.target;
	if (!target) return {ok:0, error:'There is no animal here.'};

	var target_coord = target.getCoordinates();

	if (target.class_tsid == 'npc_chicken'){
		var baby_class_id = 'chick';
	}else if (target.class_tsid == 'npc_piggy') {
		var baby_class_id = 'piglet';
	}else if (target.class_tsid == 'npc_butterfly') {
		var baby_class_id = 'caterpillar';
	}


	var new_animal = target.replaceWithPoofIfOnGround(baby_class_id);

	if (!new_animal) return {ok: 0, error: 'Could not create '+baby_class_id+'.'};

	if (target.getName()){
		new_animal.onInputBoxResponse(pc, 'name', target.getName());
	}

	return {ok:1};
}

function onPourComplete(pc, msg){ // defined by potion_base
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var result = this.onPour(pc, msg);

	if (result) {
		failed = !result.ok;
		if (result.msg) {
			self_msgs.push(result.msg);
		}
	} else {
		failed = true;
		self_msgs.push("This potion ain't hooked up right!");
	}

	if (!failed && !result.no_use){
		this.use(pc, 1);
		pc.achievements_increment('potions_used', this.class_tsid);
	}
	if (!this.isWorking()) {
		this.apiConsume(1);

		// Re-fill
		if (this.count){
			this.setInstanceProp('points_remaining', intval(this.getClassProp('points_capacity')));
			this.setInstanceProp('is_broken', 0);

			this.updateLabel();
			this.updateState();
			this.informClient();
		}
	}

	if (msg.target){
		var target = msg.target;
	} else {
		if (this.getValidTargets) var target = this.getValidTargets(pc).pop();
	}

	if (target && (target.class_id == 'npc_chicken' ||
			     target.class_id == 'npc_piggy' ||
			     target.class_id == 'npc_butterfly')){
		target.onInteractionEnding(pc);
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'pour', 'poured', failed, self_msgs, self_effects, they_effects);
	if (pre_msg) pc.sendActivity(pre_msg);

	return failed ? false : true;
}

function onPrePour(pc, msg){ // defined by potion_base
	//
	// Do nothing
	//
}

function onPreQuaff(pc, msg){ // defined by potion_base
	//
	// Do nothing
	//
}

function onQuaff(pc){ // defined by potion_base
	return {ok: 0, msg: "This potion ain't hooked up right!"};
}

function onQuaffComplete(pc, msg){ // defined by potion_base
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var result = this.onQuaff(pc, msg);

	if (result) {
		failed = !result.ok;
		if (result.msg) {
			self_msgs.push(result.msg);
		}

		if (!result.no_use){
			this.use(pc, 1);
			pc.achievements_increment('potions_used', this.class_tsid);
		}

	} else {
		failed = true;
		self_msgs.push("This potion ain't hooked up right!");
	}

	if (!this.isWorking()) {
		this.apiConsume(1);

		// Re-fill
		if (this.count){
			this.setInstanceProp('points_remaining', intval(this.getClassProp('points_capacity')));
			this.setInstanceProp('is_broken', 0);

			this.updateLabel();
			this.updateState();
			this.informClient();
		}
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'quaff', 'quaffed', failed, self_msgs, self_effects, they_effects);
	if (pre_msg) pc.sendActivity(pre_msg);

	return failed ? false : true;
}

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

function onOverlayDismissed(pc, payload){ // defined by tool_base
	pc.announce_sound_stop(this.class_tsid.toUpperCase());
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

// global block from tool_base
var is_tool = true;

function parent_onPour(pc){ // defined by potion_base
	return {ok: 0, msg: "This potion ain't hooked up right!"};
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/981\/\" glitch=\"item|cauldron\">Cauldron<\/a>."]);
	if (pc && !pc.skills_has("potionmaking_1")) out.push([2, "You need to learn <a href=\"\/skills\/127\/\" glitch=\"skill|potionmaking_1\">Potionmaking I<\/a> to use a <a href=\"\/items\/981\/\" glitch=\"item|cauldron\">Cauldron<\/a>."]);
	if (pc && !(pc.skills_has("potionmaking_2"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/128\/\" glitch=\"skill|potionmaking_2\">Potionmaking II<\/a>."]);
	return out;
}

var tags = [
	"potion",
	"tinctures_potions",
	"pm2",
	"no_rube"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-48,"w":23,"h":48},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIY0lEQVR42s2Ya28T+RXG+QZ8BN71\nVVuqVlW7K7WgatvtFrFQFGBhW9hKdLtbikDd7bKiFaGomwQIJQkQEghxQsjNjuPYjuPYji9xLr57\n7PH9Mh7HcWI7djxJuLSv+vTMBFpoX2LMWjr6WxNF8\/NzznnOmdmx4w1\/VDePqYauHL7xsPXQrh1f\nt89o+5HG0bYjmGg\/jp7LhzDQclglbzm882sBp1W27O5tOiRcv7APqo7jGL12FH1NDRi6elgYaTm6\n+43CeavVnUN\/P8woOz7AwLUG9DYdhLz1qKTi8NUjGGhqeDOQ3SbvTn+5vOdey4eywesNuHnxfSlE\nFa999i6oFiUlRcgHTQ1M3dOtZdneKeccLn26F12X9kNO9Tdy\/Ri6Lx+UAC+feQf3Gg\/gTuNBMdUY\nvnaksa6Aapd70MnFcOb4D9D6+bsQVRSjr+WXuEkqtp3\/Bf7y2x\/T336Os7\/6IU4f\/f6NusExS8sf\nh0trsCWSuNP9FS4QyI3z76Gzcb90igq2nPspvvjobZw69F2ceP87svo1RSbzswjBFR8\/hp\/Pws5l\ncOnSGXxOMH89\/RM0nX0HF079CBc\/2YsP3vsmzp14q37KudPpt0OF4tbKo0cE+ATJahW2SBTzmSwu\nNV\/Ar\/d\/G79r+B4+O\/EWPtz3Lezb+42TdYObdrl2E5xQJLj1J0+R29hAer2KaGUdrjQHV3YJd8dH\n8cnvj+Gjk\/vR3NHsrxucP5PfHVhZFVa3tlB98gR5YQM8waVJwRSd8fV1MLll2OIJWJIpTIWj0LHh\nTF3gTF7vThEuu7mJ8qPHyG9sw8XKFbBUi8HiGkJ0BopF2Jdy0AVY2dTi4h7dwsKuusAx+TyTIcXy\nW4+w\/AwusVYBQ1DeQgmulQIWV1YwSwpq48n6dStHIyy4WmA4glva3MKSCFehtJJyibU1+ES41QIc\nK6uwE9xUMs3Udb56slkmXRXAb2wiRSdXXgdXqSBVLiNO6jGFIpwEKMLNZJcYE\/1P\/ewkk7WKUCKg\n2AQpAuMILLVWRoLgosUS\/AQ3t5yHMc3XFi5T\/ceulCDsiT4LN8\/vkctN\/7mBM8XLRH\/jKbIExz+H\nIzBRuSgpF6BYyOcxmUgy3SZTbeD8BELFbU2IRU61JJ2SRQiIkJc509y\/bGyEiZM6ObKNLF3jy\/9V\nLkLXGVLNI8GtwMRnhYf+6Kt3qpfjdrJsVBXN5Ki4y+CEdSyXeDLaKvJkHXnythjBLERjsHi9SJDh\n8mQdcSp+EU5MqY\/gPIVtOLEpLEs5wZLPv\/qOFyKDDXlZwa+zI2ybRy7mwtqyB5UVH0qVLAoEV6LJ\nwFGtOclkbR4PHH4\/\/NEoMqUSkgQWIn8T4Z5bipHLCAMu\/6vDJegXsnaHEJ6yIumZRSG7SHBuVFb9\nqBaDENbCBLiJEg19cXwlKK0ONgRPKARnIAAXfU8RoI8ARThPLeFEDwuY7HxQO42UZwYrmXkUl5wo\n572oFgLYJLhH6zFsChmUaehXaLaK6U6LEyGRgJsg3eEwHPQ9KNYdhY3sRMFGDtSkISKeYKNPPom0\n34RcyrYNmHNJqRVIva1KFE+EJP65lcHmRh4VghQXAHFSRKk7RSV9sRj8qTS8uRyNsGWMh2O12Uyq\npJ53XC9E7QZkE+b\/ByxtA5YSDOLTVoR1M1gvcNISsA25iQSlNZBKIcDzMITC5HWcYOJq5HV8nD\/g\nGlEhHfofwBdTXA5jtlMBzYX7UH3ZA3baBKHCESCl++lTrNJoE60lTrU3n+LgpVocc3lro2BAb5cx\nejW4qAF8fAZLSSucahWG\/9wFxcV7mOkcgXdch9m7Y1CevwvFn7oR0Bkk8HIxQl29JW3LVMeIUk2K\nszdONqRP1mgRCBrn+YBBjXRkGpmYiVS0IO41gJ3Vw9Inx8C52xj8Yyem2wbhVk5KwEXeg7JoPTk3\nCqR0vrIKXhBojSKroUkibjOacNRaE0DXyBR8ugmkwvqXVFxOz0LZch+9Z26i\/+wtPKBYlE9IaV\/L\newjOJVnRSmZOKgsuF6WRVkKMUp2lupym+VwTQI\/SiMVBBZIhnaTi3c\/acOvjVsi+uIVM2IyRxm70\nnG7H\/T90QHVFJtVmIevAKr+APLcNt5S0IBqYBZtfRYQAxcVhgg3XBpCdccB2ZwQRh4ZUnML9L9uh\nvHEfc0q5pCQXmsHQxS7obj2AsWdQUizP2SWFn8NlYmZ4TEaw\/hCi4hymOtTEE6raAM66rTNtD+Ec\nUiHOaDH4VSd0PX10UyPdVAWj7CF8ZjWsw6MY+Vv3MyirBCZ2PR83Ie6bA2txwzvvlerQuVrEkMNV\nmy5Ox9NnDVd7Mds9Cv+UFlN9fZju74dzegzDTV1oO3UV070PEHHpYB8blWp0O0zSj0iHjQhaHWCM\nTrBmNzy0ZJjo2VdOS0fNVvVFuVEwk4rz95XwTaphGn6A1t80S9H+6VXEfDqpgV4MsV7TET1SvkUE\nDU749AtgDA4sesPQxGr8rBFmwicNrf2w3BrGgmwCXu0E4kENEqxWah4xxPp8McRrwVk15vqVCGjn\nybxdiNiDMLExocdsrv0T2sKkzapvlsFye0SC9GgmEAuoKTQSbDyofSnsE4OYH1TD3DVCMQprtwLG\neR+0HP963kqJi6p5YJLXN\/dhpmMY9nvjcCpUCHtUiDITL4VDqYCFwCxUtxaCsxDcDLmBJhZ\/vY+R\nrlBo94zCwOiu9MFwfRDWzlHMycbho24OucfBOsYxNzAG212FpJgYtu4xmE2LUEdi9XufZ9ZbG3Wd\ncmGypR+G1gGY2odJKTls98YISgnLnTEqBQX0t0ehMdqt2kzmzbxX1lnsB9RdI9fVd0YZTfsgNB1D\nUNOpan\/IK4Y1sm65\/LU+2\/4b54h2RYtr0hkAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/potion_animal_youth-1334269765.swf",
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
	"potion",
	"tinctures_potions",
	"pm2",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"o"	: "pour",
	"q"	: "quaff",
	"e"	: "repair"
};

log.info("potion_animal_youth.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
