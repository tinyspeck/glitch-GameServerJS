//#include include/takeable.js

var label = "Rainbow Juice";
var version = "1355086256";
var name_single = "Rainbow Juice";
var name_plural = "Rainbow Juices";
var article = "a";
var description = "Where is the end of the rainbow? Apparently, in this bottle. Warning: may produce curious disruptive effect on air around it. Thus the term, 'Anti-Gravity Rainbow'.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 750;
var input_for = [];
var parent_classes = ["potion_rainbow_juice", "potion_base", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "",	// defined by tool_base
	"points_capacity"	: "1",	// defined by tool_base (overridden by potion_rainbow_juice)
	"display_wear"	: "0",	// defined by tool_base (overridden by potion_rainbow_juice)
	"can_repair"	: "0",	// defined by tool_base
	"can_pour"	: "1",	// defined by potion_base (overridden by potion_rainbow_juice)
	"can_quaff"	: "0",	// defined by potion_base
	"pour_tooltip"	: "Taste the rainbow",	// defined by potion_base (overridden by potion_rainbow_juice)
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

function canPour(pc){ // defined by potion_rainbow_juice
	var location = this.getLocation();
	if (location){

	//Disable pouring in the following instances 

	if (location.is_puzzle) return{state:'disabled', reason: "I'd say, doing that would give you an unfair advantage."};

	if (pc.location.isInstance('puzzle_level_light_perspective')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('puzzle_level_light_perspective_rem')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('blue_and_white')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('blue_and_white_bonus')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('radiant_glare')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('radiant_glare_rem')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('mental_block')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('mental_block_rem')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('color_unblocking')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('color_unblocking_rem')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('level_quest_winter_walk')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('level_quest_winter_haven')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('level_quest_winter_walk_part2')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('level_quest_winter_haven_part2')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('mental_block_2')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
	if (pc.location.isInstance('picto_pattern')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}


		var signposts = location.geo_links_get_all_signposts();

		for (var i in signposts) {
			var signpost = signposts[i];
		
			if (Math.abs(pc.x - signpost.signpost_x) < 150 && Math.abs(pc.y - signpost.signpost_y) < 150){
				return {ok: 0, error:'You can\'t pour this close to a sign post.'};
			}
		}

		return {ok: 1};
	}
		
	return {ok: 0, error:'You can\'t pour this here'};
}

function onPour(pc, msg){ // defined by potion_rainbow_juice
	pc.location.createItemStackWithPoof('anti_gravitys_rainbow', 1, pc.x, pc.y);

	return {ok: 1};
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
	return out;
}

var tags = [
	"potion",
	"tinctures_potions",
	"pm1",
	"no_rube"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-37,"w":23,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK\/UlEQVR42s2Y6XNT5xXG+Q\/4A9oZ\nMtNJZtJ8gGmahDRtXbI0JGkgZgsBCmVSUppATArBpAG84l1e2IwdY8uW933Di2x5k2Rr36526Uqy\ntdtajG1IM\/nw9NxLwky\/RTSQ3Jkzr+\/VK9\/ffc45z\/tebdr0Ex2dggMNbSX7G1pL9qdt+rkdLYJ9\nWd1V76On4gMIr+zF7bz06eayPVt+FnCt5fvTavJ2o74wHZK642grOYBrF3ehpWh\/sr3o\/a0\/KVxn\n0f7N7deOJauz03E9axc6K9\/H4LUjPKSocB8o3T8tpLB4Tx8piPaKA6A081GbvRv9VYdRn7+Xh2wW\nHE2OSYeeHGSdRL7l5tRUmuDigSwOqCYvHbdy30POmZ0oufA2qr54G9UX3+UhOSW5aLn6UfLsh68+\nmZocs1iTUwYtcj\/ZwcNwae2sPIi6\/H08aEXmWyg9+yaKzryBwauHcePSbh6y4ou\/9D0RwCmbAxLG\nhE8PvYjy8zshKt2L79PcWLyHh6u48A4KMt7A5X+koTaXrp17C4LPd+LLD3\/3eFVccDiOjRpMUAcC\nOJ9xEMWf\/RnXL77zsP644KA5SC7OHXuZV\/rE3ufx7p+eaXi8qVUqt2oXl6Dy+iCnGNWocPLQKzxI\nMQWXbi69hQRdkPE6LpF6Z4++jL\/t3vZk4NQeb9KzuorIxj1ILVaogiHUtdXj73t+w8PknXqVh+UU\nKz\/\/Fk598CIOvPkcDu\/a9pjhpMqtBJRkkxzcBiLr92BbWYHExEAVCKG2owlH01\/Ev\/66HZnHX+FV\n4yL9tWcfXTnx\/HyalGGylA7ntMrNTispFE739Dydz9kd0xID0zCmN2ZIjOZdMqst7k4kEV5bxwoB\nupNJWFZi0IcjmGLM0JGS7RIxjhx8Hfve+DWvGjfu3\/VSRcpgcp1ui8bl9troBo54Ak66sYuLJBer\n\/DVrLA5zLAaVbxGzRhMcBBJIJBBZW4Of5nnjcbhpnoPmWCJRTJtMUHgXMePxQlBTgfzKfNT0tGJA\nb8xKCU4pU1YYjTZY7B446QacKj4aF2lcotoKcHF3jf9Ms+THhEIJrdUKl98PX3QZNn\/gARw9gIse\n0Mk9JP1tpXHeZodYb8CkxQKx2YIxis5ZacYPAtNZPVsMrE+vqu6BWjgJU78cHoMKXq8dgeUVBAko\nTHDhu3cRpWBJJWMojEkClOl0UOgMYFxuXj0TqWqJroAhYC7FxnAUxkgEWpo\/RR0uXFA0iL3+tBGK\nHwTHsuzmSb02KZptg6Z5AqxOgZB3HpFFBfyOeYTYRQRJAQ4wSuotUxojBGkjZeaovmQaLZQGIxaM\nRqhJTRtBWcJhqGhUBsNQUP3JSFkOrttkFqaUUpZNbB5YmNeXjpShWV2CgFtOcHIebjmgRiykA+mK\nJbUO4WAQywS4sr6O2PoGn26W1LV7PNCYzVBRnSmpa+UMAyOlX+UPQhWKYJ4Me4bgehhrf8oNMac3\nNRT3X0WzshRLrhkEWCnCvgUs+1U8XCJiQDJsgl+pRFCrJnAfwa0jTp0aJ8glagwfqWthWagJUkP1\npSL\/k9psMFFzKEMhzBJsq0avr5mY2JwSnD8cTqseakXdnABuxxj87lkEvTJevZWABvGwHqvLDNZi\nViT9DEIqBaJGLZZZJxL37iFJESPQRUq1e3kZOocDGquNH9Wsh28iBaW4TWtIHY73OYV2WjBcAad1\nFIvOKaiMKojmXGiTs+hW+jCgWaIFfwmeAIv7q26sLpoR1lLqLQbEPARJCibv3+fVXKLO9ZAxMz4f\nTG4WRrKTOWqafqrRO07ntpThosnk1ibxHQwv1GNBJ0fOYADHW+7io24FTg9O4uyIBP8en8Hlsfu4\nIvkPrsq+hiMYIUgTlhkt4i4LEl4nkgSZuPcAMkBW5KaaNFFTqEm9dqUaMhqHTebUzXg5Hs+o7K+H\nXCPFyfY4TvZO4Pzse7is\/gUf2ZpfotTwNK6btqNadwmVsgTqVN8gEPEi5tYhZjciztqQWHIhQatH\nnNLNNQ\/X6Y5oFHYKK3UyZ+hit8ebMqBUa+3rmhKSRczhkyEh8lTPYYZ9AfHom7gXexsbsT0IRw5i\nYXEXWl3b0Wy+gpuKb9Go+wYrEStiPoJ0UKpdDAGbsZKIfWc\/ZOJUjzbyPc4TWVJVSt1cVleX2h6v\nT6Lwtkrq4LaMQmy6DE9wB9Zcv8eq8YUHwdC55yDWVz6Dwn8Qg74daDM34sbCt5iwRBCnDl\/2qrBs\nU1JoEXWZECGgECnoIvU4H\/RRXfpoaVygRunVmVJ7D+4Yl6NwoBRWZgCsdRwheyliI08hePtBRLt\/\ni7vqdKy7T2MjkY0FguzzvMOn+hrVI9fl0SUlwh7yTbMUEYZGtxF+sh0H2YuZoDxkPxyghs7FP3TV\nePhSQzVX2C\/AsPYaqTgGj00Mt\/AEmH2\/4sN+cgdio\/uxYT2FjdB5JFbO8am+rhKhgJpGYbGRX84j\n6JHx9rRknkRANwmX2Qj7oh8MNQpLgF5KsZpWlBGvN0UFR2Uo7KlCuTQTRnMbr6LHRsvcjJAsZxre\nsRp4c48iKTuENcdxbMQ\/xoDrD6jSnEbW+NcYULO8qXNw3HyfQwKPZRzGmTtwaI1wEqCXdjLcpoLz\nwk6dLkXAganp\/NabKJu5iBZTJj356ENI7macLzqzDyPaswOrup3UNEfQbn8eRcpDyBy+h+4FF7\/y\nPITjHo7+h2O8GpMtt8FY7aQg+SLZjsS3hKKamtSMenpGXZEjvI3i0Suo1JzCnK3gfyC99kmYT2xH\npOtpJOTbCPBdCM3P4rJ8L870baBN5iCwKX4eD0ffc8yLYBvMh228BDaTmBolwtffkN2Zus0sRSK7\nC+q6UNBTwae5wXwSBnslD8nVpFvbD9eVP\/KNk1Rt5a2nTP8UzooLcLJzDZ1S5jswMT+f+55trBy2\n4RxYRrPgnr8Gvd9D63CANgmWrEfa0rf2TiRzRbUoHstDpfpT9Nr\/CbOjim42wtsPy\/QiJD+C9eDr\nvA1xBs6tNNyKwxk8pxo3j5tvlzfAOpRNcJdhm8iGS1YCjX0Gw6wXPR7Po73nGhl7Rt5X3bjSfRWl\nVItVxpMYcn4ChiCdzB3+xpwyidAJfMU8gwvS13i4M11R\/jr3OTfPbumA3d2NgFkJx3QZrFNZlO58\nzJu60O90\/X9vawN3Zr3Zt5tQQJYjmP2Sh+SU1DgK4DANUQzDTDeq0Lz0UL3uWTV\/nfuc0bVh2v05\nWq1nqMPP0UajBRLpKKbkEgxameQjq\/f9YXK50pp7xpEjFBJkOXX1JYI5DZH5Y8zYLsJi6IbdOAiD\n7g4ye4IoGGT5c5thAApJE+0X\/bhlOoXy+UyUjRehuKcWBcJ+dKj0qBdP\/Ti\/oi4o9cdu1Pchp6GR\nmqaKajIX5bLzqNJ+TJ17GlqDCFZ9P3SaYT64v2eNVaidy4CgNwPls5dQcqcMhR114EpGNCFDi0qT\nsenHPGRKbUVN4wCyatqR11pDapaheDwXgpkvIZB\/jnZ1IQzaLmi0bRCqcujaBZRRrRWPFtND3UBe\nUxMKCa5drkb95PSxx\/LrgNxk2d3aOpQsqe5AVm0bckW3caXzOp\/6wqESFA0\/iMIBAQp7ryK\/\/RZy\nGxuRe6sL1+r7IRqf8db2Dj7eH8cl9NI+Kp5pEDX1Q3CT1LzexquaXdeCnHoRH9lftSGnuhOFN9px\nlebUCXv0ollpVk1n5+ZNT+qY0Gg2jywoj3WIBrKaCKC5ewyNXVyMQNhJIRpItnSP9DWNiB+LYv8F\nLPuP4ZtTIQIAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/potion_rainbow_juice-1334270020.swf",
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
	"pm1",
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

log.info("potion_rainbow_juice.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
