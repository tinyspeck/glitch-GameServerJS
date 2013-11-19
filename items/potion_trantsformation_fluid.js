//#include include/takeable.js

var label = "Trantsformation Fluid";
var version = "1355086256";
var name_single = "Trantsformation Fluid";
var name_plural = "Trantsformation Fluids";
var article = "a";
var description = "A tree-reassignment liquor, capable of soaking into the roots of any tree or plant and silently, smelllessly, \"almost\" harmlessly rearranging its DNA.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2500;
var input_for = [];
var parent_classes = ["potion_trantsformation_fluid", "potion_base", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "",	// defined by tool_base
	"points_capacity"	: "3",	// defined by tool_base (overridden by potion_trantsformation_fluid)
	"display_wear"	: "1",	// defined by tool_base (overridden by potion_trantsformation_fluid)
	"can_repair"	: "0",	// defined by tool_base
	"can_pour"	: "1",	// defined by potion_base (overridden by potion_trantsformation_fluid)
	"can_quaff"	: "0",	// defined by potion_base
	"pour_tooltip"	: "Turn a tree into a random different tree",	// defined by potion_base (overridden by potion_trantsformation_fluid)
	"quaff_tooltip"	: ""	// defined by potion_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "5";	// defined by tool_base
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

verbs.pour = { // defined by potion_base
	"name"				: "pour",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var tooltip = this.getClassProp('pour_tooltip');
		if (tooltip && tooltip.length) {
			return tooltip;
		} else {
			return "This potion ain't hooked up right!";
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.getClassProp('can_pour') || !intval(this.getClassProp('can_pour'))) {
			return {state: 'null'};
		}

		if (pc.is_dead) {
			return {state: 'disabled', reason: "This is no time to be messing about with potions. You're dead!"};
		}

		if (this.canPour) {
			var result = this.canPour(pc);
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

function canPour(pc){ // defined by potion_trantsformation_fluid
	if (!this.getValidTargets || !num_keys(this.getValidTargets(pc))) return {ok:0, error: "You must be near a tree to apply this."};

	var target = this.getValidTargets(pc).pop();

	var owner = target.container.pols_is_pol() ? target.container.pols_get_owner() : null;
	if (owner && owner.tsid != pc.tsid && !target.container.acl_keys_player_has_key(pc)){
		return {ok:0, error:"You can\'t trantsform somebody else's tree."};
	}


	if (target.getInstanceProp('maturity') < 4) return {ok:0, error:'This tree is too small to be trantsformed'};
	if (target.getInstanceProp('health') < 4) return {ok:0, error:'This tree is too weak to be trantsformed'};

	return {ok: 1};
}

function getValidTargets(pc){ // defined by potion_trantsformation_fluid
	function is_trant(it){ return ((it.is_trant || it.class_tsid=='wood_tree') && (it.container.pols_is_pol() || it.class_tsid != 'trant_egg') && !it.is_poisoned); }
	var trant = pc.findCloseStack(is_trant, 200);
	if (!trant) return [];
	return [trant];
}

function onPour(pc, msg){ // defined by potion_trantsformation_fluid
	if (msg.target){
		var target = msg.target;
	} else {
		if (this.getValidTargets) var target = this.getValidTargets(pc).pop();
	}

	if (target.getInstanceProp('maturity') < 4){
		pc.sendActivity('This tree is too small to be trantsformed');
		return false;
	}

	if (target.getInstanceProp('health') < 4){
		pc.sendActivity('This tree is too weak to be trantsformed');
		return false;
	}

	var health = 4;
	var maturity = Math.max(4, intval(target.getInstanceProp('maturity'))-3);

	var choice;
	do {
		choice = choose_one(this.replacements);
	} while (choice == target.class_tsid || (!pc.location.pols_is_pol() && choice == 'trant_egg'));

	var rsp = 'The '+target.label+' is now ';

	var cultivation_max_wear;
	var proto_class;
	var cultivation_max_wear_multiplier;
	var cultivation_wear;
	if (target.canWear && target.canWear()){
		cultivation_max_wear = target.getInstanceProp('cultivation_max_wear');
		proto_class = target.proto_class;
		cultivation_max_wear_multiplier = target.cultivation_max_wear_multiplier;
		cultivation_wear = target.getInstanceProp('cultivation_wear');
	}

	var new_trant = target.replaceWithPoofIfOnGround(choice);
	new_trant.setInstanceProp('health', health);
	new_trant.setInstanceProp('maturity', maturity);

	if (proto_class){
		new_trant.proto_class = proto_class;
		new_trant.setInstanceProp('cultivation_max_wear', cultivation_max_wear);
		new_trant.cultivation_max_wear_multiplier = cultivation_max_wear_multiplier;
		new_trant.setInstanceProp('cultivation_wear', cultivation_wear);
	}

	if (in_array(new_trant.label.substr(0, 1).toLowerCase(), config.vowels)){
		rsp += 'an '+new_trant.label+'.';
	}else{
		rsp += 'a '+new_trant.label+'.';
	}

	return {ok: 1, msg:rsp};
}

// global block from potion_trantsformation_fluid
this.replacements = ['trant_bean', 'trant_bubble', 'trant_egg', 'trant_fruit', 'trant_gas', 'trant_spice', 'wood_tree'];

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

function parent_onPour(pc){ // defined by potion_base
	return {ok: 0, msg: "This potion ain't hooked up right!"};
}

// global block from tool_base
var is_tool = true;

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
		'position': {"x":-12,"y":-37,"w":23,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKjElEQVR42s2YaVNb9xXG\/Q38ETzT\nF+m0nSlNp9NOtyFuFjuJaxPHSxYbvBGKnQRDCDGOsWyM2XfMIjY7YLGDBDISwoAAIUD7LrQLEAIk\nQAIMnr57eu6VYTpNXwQSJ9HMM3\/pcsX96TnPOXc5cOAnevXXnEvqKDzLb8k\/HX3g5\/Z6XHjyEK\/o\nFCQ1cWjNP4OaOzHSttyzUT8jwFPSuvsxGKiNRXfJh2jMOokGUmvBGc5PDscrfD\/pm7xTKLxxDIyL\noupY1sX6zJPs2pp\/+uFPBleecSyKgeooPcPCMaq\/dwK83NOo5sSgJe\/0jw+pDYUOaVdWogeV49Hc\nu8e9VF6UZfwTFRnHkZl8FNzM4yj44ggL2V5w9gXgGdRlnvxxIHlyOUfpX0J12Q0WpDE7hnWupeAD\nVNyOQc3dCOD9z14H9\/Zx8Es\/AnU2Ht1\/H0wzvXTA7mlVoy4QxFdJH4Dzr9dQdTuSvd7Kj9FC64Nb\n76Iw9Siyk4\/gq4t\/BZdzAgVp76L0xjsE\/tbLdfGpWn2wd3JKNzU3j5omLm5e+TvBHNnNH5vBrBOs\ng4zSL\/8Nd68eRuqFv+DE4V+Gjx1+Jeqlwkl1ep01sAKJ3ggVlTn9ywvITnqDhSlOextl6e8gJ\/kt\n5F5\/E3cSX0MagV0\/9yd8fOy34YSzf3y5c3FYrdHaV9bgf\/YMpvkFjDldGDKbER97lHUy89o\/kEdw\nmdcOs87dSojGhRO\/w7njUd7clMMvF25QqXpoXlrGwuYmgtvP2VVqMoMp9YDBgJTr55F45g9s5r6I\n\/TOrKyd\/j2OvvaJ7441fHNy7G3L5IalaHTdtsz1Uuj1SpcstVTjc0mmHSzphs0vHrDapWKXhjDud\n0Ttwvo0NBJ9tYZHgZlbXYFpZxajZChVBjnu8SM9Mw3uv\/wpnjvwGp978NU6+\/ap3X3AKi4Vj9i\/C\nvhaCg+QMhSMKr8NBq40ObiGZV1cxotPDMDsHT3AFSwToJ3npO+61NTiZfQhyfMaGSYcTUz4\/eEMS\n5JVnI6csGwKt2rM3MJMpSuFQek0BF6xBP1wE41kLwhecxzzBLaxvYGFjE7O0WungY1TCUa0WJrcb\nPoJ1+BbgIlA3\/c1JYCYaNZqlANTkrpZcHNYbMGSxYtBsgYTUp9F7vzOcdc6XNOESQzzTiGF7G\/Qu\nCfwLeqwsqLG6qMXS2hKW19cRIDjGqZnVEMaNJkzQQafIRSXBegjEtbwM48IijARnXg5As7gEA0Hq\nF5chpx\/A1+rD\/MnJmL7Jyeh+itF3gtO5LRyhthEiSxWmHQL4vBMIzCtYuDWCCy0bsBq0E+AGAuTg\nyuYzzJKjBorBkEIBBUFO6\/WYpmYwuD0wLi0RXBAzgQBUBDZJ+43P+dBrsYarn469uqey6ryGuI6p\nEjRI06Aw8+D3TGB5bhpBn4p1joFbD5qwuWrBWsjPwq0+i8hDObNS\/hxeL5RGIxTk6CQ5OWG1wUaQ\nBnJwmhyU0cjptc6gemyPcJ7FxUM9U9V4OHoTKkMLfK5xLHrlWN5xb0mH9QADZ8VWyIatsBOrG2tY\n29pCaHsbAerWWYI0udzQWqlbLRYoaZXTap6fh44A5Qt+iKhB6icm4vbcraOGPmn90A3KUDPmHFIs\nuBnASba8CmMHJMpq8CcLYXT24fm6E\/\/e9OD5hgehzRBCW9sI07xbppIzHayz26Gi4GtsNqidTqg8\nHgIMQkzDel9wSytL0U0jWRhR1WLWPrwL6HVK0T1WiNyeeOQILqCw\/xLqR1OgdLRidVXHQjJOhgmS\nAVx\/zkDSaKGutVM59QRkopmnIUlovHQbTfx9TX6NU87nDqTCYRHBaxtiAZkSe50jqOhLwb2uOOT2\nXkTxwGVUDMejRpYAgS4L22EHW+6NVQdBrhHkNiumebzMeAlS91I39xqMEFAmqcThfQH2TdWFn8hK\n4bYOvgAcIcAxtkkeSTgRwL4XgCPx4BJgrTwBLVNfU+Z62cZhGmhtY5UyuU1Ns4UVahxmDtpoxFgJ\n0kbvVbT2Gy0n9gRH\/yi6cZCDSeU3BCghwKdU5hHMO0epzDJwRTdwrzMuUmLRJZQ9vYIHBFkp\/QTl\nQ1dQJL4Mh3uIHUFMMwVWvAhSd7NNQy7aqDkY0Dka9EZah+d8e7sxWgmHOcXdCVCoeHBZBuCZGdzN\nIeOibUaMnO4ryOqOQx65WCS6jBJJRAxcvvASpJqGCBw11NLsFPw+IxbDIczTac5KI4aB9IXD7DlZ\nZHfuLYcmt4ZTQICj03VwmsXfcnHG2o+CnqvIJBfv91xgs5gnvEhgF9n39\/kX2Ag8VdRG4GiwM\/md\nJ3kWvWx5Z0h+OvO4SQOeWemeACWqdk5+Zzy6pXkEKNp1cSeLDKSLthd3JCCzI5aFYdxkRe8Z8Dvt\nsWgcyGAzy3Q\/8x3mu27bCMx+H6zU0UyJXeRiH1397AnQ4FRxctsvo1r4BSx6wa6LDKTD1I9xSQVa\n6xJR9egKbreex522WNxtj4gB49C2jJbzkCmb2EjswDE\/UKXrgzfoxAwBMmcaJoMdas3eSry8Fk7K\nbr2IUsGnkExUslB6RTuK7sagPPsUqgs+REPpefC4CXgszkQJPwkZvPOsbpG+fnwON5vOobwnlc0t\nEw0GzkkxmXaIKZ+dbIlnCE5B5+JW+dTemiQQCEfV9H2Noq5EtmMNuk4W8kHuRyjOfA8VOadRlf8B\nhoQF7MEZdyr4qUgnqOy2BNxupjx2fAa5ksc2F5Nfxn01nXEmXHzInAJYlv3Q0lXMCF1mVfX07P1h\nkXCi2ZvXFo+y3utoGc6iUvMxKq5Ayb33CTIGZXSPatZ0swdn3LGZ+9ErLYOdBruB9mU+74Ax8TDP\nPMGYqx1DjmYMk9Q+DeR0FdOl1oX2NagVFjkni3cJhV3XUCX8Et2jBbAZhNBOtaCh\/BNU5n3MNg9z\n8IgGWZgd7Wxn9rET7KijBU8djzBobyTIJoy4Opn5h2+Gpft7OOQOhQ7WPcnx5rR+grKeJNT0p0Mw\nWkSQfbAbn0A+XEtlF7FdzjSRyyJmYSISs9sifxPRRUUVlPM90C4KIbbVYYAksTdAaLWFc7ncg\/u+\nExtSiOJyeYnIa0tEmSCZ8ngTPQQ5o+99ASpkYRkxGf1fMdsFdGFRKvwUxb1XUfEkmS7jq0iVGHQq\nwJPJkr737WLPeIc0s4lC334V5fwUFrJzOA9WnYAF3YGNSPhCkc+jCi7aJzJpqCegkP8p5TkZFb2p\naJI9QtuEXHrgh3ip3e6DraM83b2mSyhov0blTqH5eAPNknvQqNpY0P+nxwN3kfWYztXd11As+Jwq\nkEJwaagfLAJfo9J9r9J+63GZ1XpIrJWFs3lXkduaiOKu66gQpKGu\/zbG5I2waPkEFZFC0YzG\/gwW\nKKJUdt8Hfel4LGtC6\/gEwXX8cHC7TqrdB4f0an5pNwdZzfHIb6NcdVHJ+Gl4JMrEsKyOVAuuMAOV\nfTd3VS28hQeCm6gfaMBDkaTkpcD990uq1sXxhtu9FYIc3G9OQA7vGvJaP0dRRzKKO1NQ2pWKkhcq\n6qDPbVnhmq5mflVTy4\/75H5AJoviy4Y5Nd2lD6t6y8N1Ii5qReQgrdV9lXjQVa6rbq\/jcDt+eMf+\nAwf\/dUPN1SLaAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/potion_trantsformation_fluid-1345957866.swf",
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

log.info("potion_trantsformation_fluid.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
