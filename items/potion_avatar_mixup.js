//#include include/takeable.js

var label = "Phreaky Philter";
var version = "1355086256";
var name_single = "Phreaky Philter";
var name_plural = "Phreaky Philters";
var article = "a";
var description = "A potion crafted entirely for lovers of perfectly delicious chaos. Go ahead. Switch it up! You know you want to.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 3;
var base_cost = 0;
var input_for = [];
var parent_classes = ["potion_avatar_mixup", "potion_base", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "",	// defined by tool_base
	"points_capacity"	: "1",	// defined by tool_base (overridden by potion_avatar_mixup)
	"display_wear"	: "0",	// defined by tool_base (overridden by potion_avatar_mixup)
	"can_repair"	: "0",	// defined by tool_base
	"can_pour"	: "0",	// defined by potion_base
	"can_quaff"	: "1",	// defined by potion_base (overridden by potion_avatar_mixup)
	"pour_tooltip"	: "",	// defined by potion_base
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

function onPour(pc){ // defined by potion_base
	return {ok: 0, msg: "This potion ain't hooked up right!"};
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"potion",
	"tinctures_potions",
	"pm3"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-35,"w":22,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALUElEQVR42s2Y+XOTdR7H+Q\/4D2R\/\n23XGkZHRdXBFdFQQYaVyeI3Keq0HKoccAkKhBXq39ITS0oMe6ZWmZ9I2adI2SdM0adLc15P7vnuy\njIP73k8ewJ92V6qiPjOfmWcymXleeX8+7\/fn+Wbdut\/paivdt7u3\/G1JR+H+Q+v+aFdLyesbW0v2\npvlX3wOn8A1cO58laS3es+EPAdeVv399W\/E+bd2lLPRWvo2+8ndwI3cParKz0n8INduK9\/I6St9E\nVfZutJXsQ3vRfnQWvYn6nD2smu0F+8t+N7j6S1mHGvJeR3PhXhYuU3W5u9FV\/CarIsGhJY+gC944\n8JtBCdXq9X0S5ZPlp7NerDm3Cx2lb6DmfBYqz+3Gua+3sYBF32xHW\/5+VsH7VXh8x9bfBHByzvil\nNhLh5J8+sJB\/+GXUX7zb2u6yd1B3cQ+qCToDePnQSyxYG6nYXrgfTYXvun8TQAPjKdGGo8g+\/Rmy\nP3selWd2\/tjeTFV9txNVZ3Yh\/+h2nP54Cxpy9+LS4W1ourQXve25D7fVALKWbt0u1AdC6JOM4eBb\nf0Xxse1ouJyFlqK7c1hzT8FMnfroWZz9dCuOvLcZ\/3jrBTSLRt0PFe77O3eOBVdWvP5ECvORKMqr\n8vDN+8+wMAVHt91tLamVR60\/9\/kLOHZgMz7eswknj+xHv9GYHnV7DzwsuH9+\/8MPBzNwsdVbiKys\ngIkFoQ4FcOrU56TkU\/juk+dQcGQb29aTH\/6NVe2tHY+hqOxbjLg96RFXYOMDP3BcLn9uTK74YEqp\n3jmhUO0QK5U7RdPKXWMyxWsjU\/LdvNHxHS08XtY9uONLt2+f8S4kVsPLMUSXI2CSDFwJF5h4AHPB\nIC7kHMeHWU\/g8LtPk6Kb2Xr9xUdRWluAUbdHO+4KPdhWmZqbe1ylNx70JZPbvYsr7ztTaYErvTDt\nWlhUuBcXZ5zptNKeSittybSISaWrIvFkjzcSqvCm\/KuBRR8CCz6Cc8AWt8ASNbP3zoQP6qAPVTeq\nsfeVJ\/D35\/+Mfa9uwo2uBoy4PBKhM7X+J8HUlF3CiZlT\/UMT152WSY7Z74UrnYZ7IQXPYhrexST8\niwn4lxJwLSzAkVpAanUVdr8\/4Qjbb1n8NjBRO+xxG6xxE8GZYKbSha2wxHzwpuPU7jAmGRe4UgkG\n1LOYcnoezBAGq\/Vx9bzl69GR0UmHUXIn4JRCp52CQCKF1u4kuBiBxRGg9oWWIgQehYEepjVbINOo\nqKZg8Ohgj9hgDhtZMEPUhrlICKpQBDP03dlgmH7gIhSMGxMeL+T+IKQeH34Szmp1PT4qVnYq5EKf\nn5lE0CVFyDONiHcGApEIErkG9nAAAVIutJxEeDlBFYU1kYTcYMSkehoy+jFSgpy1KmGPWaAP6aAJ\n+1g4JcFNU+RI\/QEMaI3ondPRzHkzpoDA7c3+v3BOp3P9kEBarZwW3vI5JhBwTmFGfwVSQw6szg64\nGTXGZTPQmO1wRoIIraTInWlEV1Nwp8OwxfzQMwbI52WQ66RsKcxyGIJmFk4VJvVIORnBDenNGDCY\nM2CND+xUyZSqbETAT3ntYmTUG5o+jGrhk7g+uRmDmg+RiszDwRihszIwOT1w0QMjy2nEVhcQXUmS\nAdzkUifUVhUUBjmmjXJIjdNQu13QhEKYJUh5IMjCDZlta4MLhMO7Gpr7\/UpVIyX+YQzJjqF+5BWU\n859AjegpaKxXsRA1IB2jgXc6qHxw+ILwx+OIrSwgcWuRWh2HI+mCKWCGTD8JhUkGhWUaSsYBfTQG\nudeHwR\/hvGt77xufVKmEY\/w7NtMgJmdKUNLzNPJ6HgVP9inszj6kIzoskhuXk1ak4xQbNDcMAbqD\nUYSSScRXl5D81xJ8ixHYKe\/0Ph2UFjnmaCzULhMUZAQhGYxvc2DN2yGYSj3C6RlbtBnGMDhxEhda\nHsXZm39CKW8zdKZmJEIapKN6LCVMWEnZcHvJhXTScw8wAl8kjnAqRSous0oGCNISZ8jZJmj8JkjM\nWnTLZzFJLh39KSP8d3P4Pq+sr7lVyaWdyNmEM00bwBMfwdX+VzFvbLoHqEPYbYbH6kTA4cFywo14\nzAV3IAxfmGKHIDNKxggwM5NBarc1xkAf0UMbmoM24mQdzLfa1v62TObgVTblY0B8Atf7s1DatYV1\ncKfoM\/icYiSCc2QaHW5WuKmC4FyNYXIoRGpaEY044CFnesgAmfInSU1ydiaCXKkAdBErZaCJZtMD\nLc3hkMmsXTMgr39cW3GtA2J5AbX3L5jTNrMudltlaK5Uob9Vi4lhPWoLGDSUelnItuoIO5MLMQNC\nQQsYb4Ath9cPdzxKQU6AFD062ibGmJ1iKABzPAmBg8HaAYck1uJKDjSqXqjnbsBjE+NuDkphpOAd\n6lCh+rIe1ZesLGRGSZ3CyhonFZ5nR8Dn1cNM0WOi1WUkMzgTZJZUhFrrwnyUYXPSTGHO1cxDSHm7\ntjNqJ19cWNaK0dFBuCxjpJwIXruEVVEyLEPJWSWKv9PiynkDzGotC3S\/4tT+mF+FiE8Jt1MNndkK\njcmKWQphrc8FdcRNW8TNrkNTIoFBcvGA2722s0ZXn9CRV9KMq\/U9MGpHCFKIUZ4Il78dp0PNJApO\nyVnI+lI1FCI1Ac3+WFECy6zBzDrMrEXGJodSq4NMpUX\/iATzHjfNnpfUjEEfi4Nnsqxdwb7hyfqc\ngnqUVXegt38ITvMY2mpFaKwUYUIgZiFHe6W4cUWBEa4SYY\/iXk2DmeVipvYQlDUHoWk6AUbVDcYi\ngWRahl7+OIanFATog4nmcjpIr\/0W29pncEKh+ersxWsoKG9BdX0vxOPDLKRVJ0L2YREqL4+zMyke\nnIJaKmVn837NcfPBP\/4yhKdfxcT53VDVfkUjIoTdOIYp+Qi6BULo6PVKE41i1OFEn51Zu4udweAj\neaWN\/84tvIGyGg5qG\/uhmeVDwB1D9iEhC5oxTmYufQ4JBnPfQe\/JneB88hSGs\/eg\/\/BWgnyJIHdA\nVvoB\/bhRMKYROIx8yOVUjJVVb9jpBtfuaPxZZ4jWbn7vmdyryC9tRuX1btQ19cEwN8w+7K5xhKx5\nPLZxthw6Won1J9D15Rb0fPEMJmu+gkFcD\/t8P8EJWDitahDdg8MYnpmFiLYIz86g1+H+eYdxs8u1\nIbeoHhfy61BY3kqt5qL+Zi906mFWjQxopu1mRQf4hR+g4d3H2Go+sBE9R18C\/+Lb91QTwG4Yhkk7\nCA6vDy09\/egRyzFE8dNjYyS\/6CTWPTjeeDK7EjkFdSiubEUNzWNTWw89bIhVRMbJQfNHT7JgnXRk\nzNy3HdwCce1RtH60iQWz6Ydg1AygidOH5m4B2vpHIbDZqLUZ9Ry\/7K8MDal4o20gfTK7AhcK61BU\n0Xqv3RQ\/mkEouIXgnnoN0vYL7H0GNHOvGq5AD31upbYb5vpxrZGDoup2FFe1gavUoNtgQrfN8ev8\nYzXjcOy+yRvBiXPlOJ93HfllzWScdjS0dmF2uo8gBmBUdt1V74tnWajMZxaaPb26D1cb2lFCYFdq\nO8GZUKBTq0eP1S5Z92teMsZ9oGtkAicvVODMxRrkkLsLym+ispaDiXEuzNo+jFV\/jZmBMvY+UzMy\nLrmfQ6rRaNzsA3dWgw4K7G6bXdu11mB+oPOwP7x1aHYuXVHHwemcKhb0QsF1XC5pRHNLG6QTPQTG\nY2tM0E0h34r8K82o4\/LRJBSjU\/8rtvV\/vmWHQhuElFsCWvCN3GGUXmvFubxrOJ1bhbOXaqj9tSit\nqsfl8gZU3qS2iyTooF2dcesvNsSa\/oBMpdZnzhB8OyPpV2vSvFk1uJRt3dMz6JQr0EOtpA3hppw7\nxLW5Nq77Pa\/MoufT28jA\/aLgHSb3P8xn\/gflKa1cQEtPywAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/potion_avatar_mixup-1345583733.swf",
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
	"no_rube",
	"no_trade",
	"no_auction",
	"potion",
	"tinctures_potions",
	"pm3"
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

log.info("potion_avatar_mixup.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
