//#include include/takeable.js

var label = "Draught of Giant Amicability";
var version = "1355086256";
var name_single = "Draught of Giant Amicability";
var name_plural = "Draughts of Giant Amicability";
var article = "a";
var description = "Causes the quaffer to smell like stardust, hot sauce, whiskers on kittens and several other of the Giants' favourite things, thus granting a modicum of favor from the Giant the potion happens to be most amicable with. Shake up to three times a day to shift Giant affinity. Do not exceed one quaff a day.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 3011;
var input_for = [];
var parent_classes = ["potion_favor", "potion_base", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "",	// defined by tool_base
	"points_capacity"	: "11",	// defined by tool_base (overridden by potion_favor)
	"display_wear"	: "1",	// defined by tool_base
	"can_repair"	: "0",	// defined by tool_base
	"can_pour"	: "0",	// defined by potion_base
	"can_quaff"	: "1",	// defined by potion_base (overridden by potion_favor)
	"pour_tooltip"	: ""	// defined by potion_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "5";	// defined by tool_base
	this.instanceProps.is_broken = "0";	// defined by tool_base
	this.instanceProps.quaff_tooltip = "";	// defined by potion_favor
}

var instancePropsDef = {
	points_remaining : ["Number of hit points remaining"],
	is_broken : ["Is this broken?"],
	quaff_tooltip : ["Instance tooltip for quaffing this potion"],
};

var instancePropsChoices = {
	points_remaining : [""],
	is_broken : [""],
	quaff_tooltip : [""],
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

verbs.shake = { // defined by potion_favor
	"name"				: "shake",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Change the amicable giant. Three more shakes remaining today",
	"get_tooltip"			: function(pc, verb, effects){

		switch (pc.stats_get_daily_counter(this.class_tsid+'_shake')){
			case 0: return 'Change the amicable giant. Three more shakes remaining today';break;
			case 1: return 'Two more shakes remaining today'; break;
			case 2: return 'Last shake today'; break;
			default: return 'No more shakes today'; break;
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.stats_get_daily_counter(this.class_tsid+'_shake') >= 3) return {state:'disabled', reason: "Giants have had enough shaking for today. Try again tomorrow"};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var tmp_giant = null;

		do{
			tmp_giant = choose_one(config.giants);
		} while (this.favor_giant && tmp_giant == this.favor_giant);

		this.setFavorGiant(tmp_giant);

		var giant_name = capitalize(this.favor_giant);
		if (giant_name == 'Ti') giant_name = 'Tii';	

		pc.sendActivity('You shook the Draught of Giant Amicability. Quaffing it will now give favor with '+giant_name);
		pc.stats_inc_daily_counter(this.class_tsid+'_shake');
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
	"sort_on"			: 54,
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
	"sort_on"			: 55,
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
	"sort_on"			: 56,
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

function canQuaff(pc){ // defined by potion_favor
	if (pc.stats_get_daily_counter(this.class_tsid)) return {ok: 0, error: "You can only quaff this once per day"};

	var favor_to_gain = Math.min(111, pc.stats_get_max_favor(this.favor_giant) - pc.stats_get_favor_points(this.favor_giant));

	var giant_name = capitalize(this.favor_giant);
	if (giant_name == 'Ti') giant_name = 'Tii';	

	var tooltip = '';

	if (favor_to_gain == 0){
		return {ok: 0, error: "You must collect the Emblem of "+giant_name+" before you can quaff this"};
	}else if (favor_to_gain < 111){
		tooltip = '<font color=\'#990000\'>Gain '+favor_to_gain+' favor with '+giant_name+' to earn an Emblem</font>';
	}else{
		tooltip = 'Gain '+favor_to_gain+' favor with '+giant_name;
	}

	this.setInstanceProp('quaff_tooltip', tooltip);

	return {ok:1};
}

function onCreate(){ // defined by potion_favor
	this.initInstanceProps();
	this.onLoad();
}

function onLoad(){ // defined by potion_favor
	if (!this.favor_giant){
		this.setFavorGiant(choose_one(config.giants));
	}
}

function onPrototypeChanged(){ // defined by potion_favor
	this.onLoad();
}

function onQuaff(pc, msg){ // defined by potion_favor
	if (!this.favor_giant) return;

	pc.stats_inc_daily_counter(this.class_tsid, 1);
	pc.announce_sound('DONATION_4TH_TIER');			

	var favor = pc.stats_add_favor_points(this.favor_giant, 111);

	var giant_name = capitalize(this.favor_giant);
	if (giant_name == 'Ti') giant_name = 'Tii';

	return {ok: 1, msg: 'You gained '+favor+' favor with '+giant_name+''};
}

function setFavorGiant(giant){ // defined by potion_favor
	this.favor_giant = giant;
}

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

function parent_onQuaff(pc){ // defined by potion_base
	return {ok: 0, msg: "This potion ain't hooked up right!"};
}

function parent_onCreate(){ // defined by tool_base
	this.updateLabel();
}

function parent_onLoad(){ // defined by tool_base
	if (this.getInstanceProp('is_broken') == 1) return;
	if (!this.isWorking()){
		this.doBreak();
	}
	else{
		this.updateLabel();
	}
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/981\/\" glitch=\"item|cauldron\">Cauldron<\/a>."]);
	if (pc && !pc.skills_has("potionmaking_1")) out.push([2, "You need to learn <a href=\"\/skills\/127\/\" glitch=\"skill|potionmaking_1\">Potionmaking I<\/a> to use a <a href=\"\/items\/981\/\" glitch=\"item|cauldron\">Cauldron<\/a>."]);
	if (pc && !(pc.skills_has("potionmaking_3"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/129\/\" glitch=\"skill|potionmaking_3\">Potionmaking III<\/a>."]);
	return out;
}

var tags = [
	"potion",
	"tinctures_potions",
	"pm3",
	"no_rube"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-48,"w":23,"h":48},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIh0lEQVR42s2Y2XNT9xXHmekfwEP\/\nAGb6kJd2JjPNtJ0+tF4IkLLUJMZAM2mcSTMdZkhqWgbSBqghYINdbLM6OHawsfEiYVteZVvGsiV5\n0X6lq327V1eytS9eMLz123Mvy9DnCCV35sxPunr56HvO+Z5z744dP\/DV11xVIms6phi4duztHT+2\nS36taufD65X84I3j6Ll6BE1n99f+qAAH7n7aee3MfvQ3V2Gw+Tg6vv4A\/Q1H+b7GqpIfHE7R+++a\ngZaj6GuqQm\/TEXTVf4C+xqPorKtEP519DUerfxAwNce93fvgWsX9usP59ivv496lw7hUsw\/3Lh5C\nB30ebvmTBChG+6X3K4oK1zE3t0vH8WipP4mGv++VlBu+9SHu11fi9rkDuEr3Gk7tkZRsu3gYPfVH\n8kUFHNUs\/V4bDKHt7jnUfbEbHVcqJEgx7pw\/gNtfHcTlz8sJfg8ufb4bn1W+UzxAg8HzU4sQya6E\nOOiDHvzzxB40n30PN786IKW38fQ+SdXaE6U49dFvULX358zBsreKYz2zs7M7l7w+q7CxhdjmFuZc\nbgxr1Dj50e9w7q8lEtjXJ8skuM8qf4ljf\/gF8+67P9tZNLhlr9cSym8g9fQpohubMEeimPf4MKhd\nwIk\/l+NvH\/4apz\/+LU4e\/xUOlr5VPDgAP7EIgkwguMz2NpJPniCUW4cvm4WVIHVeH1QuJ\/518R\/4\npPoQzlw4hR61rngTZYFlOwOZHDJPtpHa2gKfzYHL5xGk00\/hSCSg83gxHwhiIRDCHDWQXLtcHJNe\n9njqvZks4gSW3HwOF0hn4EimYKdgUxR0mmJxjLOO\/KTJVDG2XCQ4Kxf+QoSLbm5SU2wiTHAh+u5I\npmFJJGGMx7GyFocuuoYRlzs\/5PAVL61qq\/0vjngC4Y0NCOsUYlozGQQJ0P4a3CLBTfmD6DVZizct\nzLxQzVLKeKozsRkCBMWLcJRaH6XTQYB6glsiOBX54bDTU7x5a+a4vU4CCEpNkKcmyIIjsEAqDT+F\nl35j40ksE9w0NUXB4ZRqbcmYWl0yrFKVyJWqkp7x8Vd1o\/N43rGGhU0+l6OUkmov4ZIiXAoe6lYX\nAZpIPRXBdSwuFg7Oxoc77ZEo76Na8lJIJ4E4KWWGEP\/fRa+P03v9+RCpJMFRWjn6LConppWlerTE\nEjBS6hfCEfRZmJaCgC2xbIVV4HhXOil5lpCKIpJNIkKTYJU6M0g1Jqb0sckMxutFaG0NbiFCyolw\nopWIDZEgG6GgU0NwIy5PZ0Hg2DDfssg7Me9n4AyZsBYxIb1qRirhlmwjQd62Sl1qW13DgsmEZSuD\nFQonGW2A0inWm5mgzARnfgHXtaIvDJze7+oct2vARFkI3BISgl6Cy8YZ5JMsUvkkAT5BmqZDkFJt\n9PmhJzi9zYYVCrs\/AA+lVkyrhWC1pGp3oeCMfneNwvIYc6wa4YAWsfAyUlEj0pElCW4z48JWzof0\n5joBPkXyxfhyh8Mw2FkYnU4YKCxhAea1GJZIYbnNzhQELhaL7ZpktJi1PYbgn8dqSIs4AfIr9Uj4\nHmE95cCTnBfPNoLY3hCQ2dpElraTOI2xEHmdgVYok8MJK9WjkTzOQpbSb2GY2VyuMJuJ3mtTDKxM\nIOh5HXBFAozqa5GPapAPyrCdMmDd+y020k5kt7eQe\/ZMSrk4ylhSkqU6XKY0j9hYqIJ8TUHgcvQv\nJ6waLDFK8N5ZAlQjGtSAN99BxNoKYfEsEtZGpJ2tiKkOYT08jq2sB\/mMjzaVTVqlniJFNSmm2ysu\nAIIAU3QVC0JkviCAmXy+olenQNA1Bc6jgt\/Sh4C5C7ytB+7h\/fANlyM0uhvh8d1Iu++Tei5spJzI\nJexIJ5xIradp19uWOtwtGXMSomlrCbIggOl8vrZ3YQABpxIh9ww8hg6sdJXCNngYrKwM7kflEmRA\nUQ5uqhJh3ZdIBiaRiVmRWjUhLhgRSwmSP4rrlItCoJEnLgXT3Or331SWfTZFq6oHfsckqThNKs4i\n7JuDbfQTWPvKJEinnEAHy+GhiLpkSIZ1SFKHizYU45ekkhDCVjjWBGnPi9AmI65WSp7\/\/juejfPO\nNys7YbSOSSoG2FHYVBfAznwJU08prL1lsPWXwT5QBo\/yUxjpnqH3PawG57DGLT6Ho8YS\/5RzNQwb\ndXAol6fxligMYDydrb062oZerfyFilNSqh3qOuh79sHQXSqBmh+Wgme6wbOP4NY0IGSXIRJYeAVn\n9+igNGjgSiVpbmexEClQDcaTmermyfu4peqGyjgmQdrUDdB1\/xGupTuwTZ+FRVGNINMP51wtQc1L\nUC\/BeO9jyZ5WQg4s+BhYViOwUXqnQ2G+YCYtW1SicaId387LYbQ8hww4p2AcPw2fle4Nfgx29gJC\nzgkJ6GWI9SqqbfKboA3a6eGHgVEIQEMdPBHiWwq2Vpm8DkXt4E20THWhjyzHaRuFj50gUKUE6lxu\ng3XmvATzeohNFQzoYIp4oKblQu2zSpAzXBiTHLerYIAcqdjxWI4rI624rXqIPu0QGOsIvPZxCdTL\nDMFj7n\/eRC9CVJm1T6BLNwKlSwd92AFNkIGG82LM7Suceq\/sxs7UXB66gzqCvDXzEB3zMhhNw\/CQ\nml77mAT7ehiNCphCVtxU9ZLyD3Bjuhut80ME58nLQ6E383ZgZGmu88zDBlwevosWZRfa5\/qhNQzB\nzYz8XxhMQ7gz3YPGse8kODG+mR\/EMMvkhzjuzT5GDmlnO88P3MQFWQuukf3cpLrsp0mjNw7CZVVg\nalFGaj2HaqbfmqY60bagwKDZwrxxuJfXxKKm+j\/D7fmzPQ0EegNXFK1oGGtH28wDNE12QjT26xP3\n0TjagXuqkbzMYCr+C\/BZs3lnj2q85vrQd\/ONj9qZy\/JW1Inx6Btckbfm62Vtilvyvjf6uuJ\/RfNn\n5OmKujgAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-09\/potion_favor-1346896418.swf",
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
	"pm3",
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
	"e"	: "repair",
	"h"	: "shake"
};

log.info("potion_favor.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
