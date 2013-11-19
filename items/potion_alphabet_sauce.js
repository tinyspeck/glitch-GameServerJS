//#include include/takeable.js

var label = "Alphabet Sauce";
var version = "1355086256";
var name_single = "Alphabet Sauce";
var name_plural = "Alphabet Sauces";
var article = "an";
var description = "You know what you want to say? In the right place, by pouring the right equipment on the ground (this equipment) and the right number of friends willing to step through it to get a letter of that thing, you can make that happen. Just make sure you can trust them to stand in the right order, then take a Snap, and the benefits will be felt all round.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 11;
var base_cost = 500;
var input_for = [];
var parent_classes = ["potion_alphabet_sauce", "potion_base", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "",	// defined by tool_base
	"points_capacity"	: "1",	// defined by tool_base (overridden by potion_alphabet_sauce)
	"display_wear"	: "0",	// defined by tool_base (overridden by potion_alphabet_sauce)
	"can_repair"	: "0",	// defined by tool_base
	"can_pour"	: "1",	// defined by potion_base (overridden by potion_alphabet_sauce)
	"can_quaff"	: "0",	// defined by potion_base
	"pour_tooltip"	: "Sauce up a phrase",	// defined by potion_base (overridden by potion_alphabet_sauce)
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

verbs.pour = { // defined by potion_alphabet_sauce
	"name"				: "pour",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_all"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
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
	"handler"			: function(pc, msg, suppress_activity){

		var args = {
			input_label: "What do you want to spell?",
			cancelable: true,
			input_focus: true,
			input_max_chars: 140,
			input_min_chars: 3,
			input_restrict: 'a-z ',
		};

		this.askPlayer(pc, 'alphabet_sauce', 'Alphabet Sauce', args);

		return true;
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
	"sort_on"			: 51,
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

verbs.quaff = { // defined by potion_base
	"name"				: "quaff",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
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

function canPour(pc){ // defined by potion_alphabet_sauce
	var location = this.getLocation();
	if (location){

		//Disable pouring in the following instances 
		if (pc.location.isInstance('puzzle_level_light_perspective')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
		if (pc.location.isInstance('blue_and_white')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
		if (pc.location.isInstance('blue_and_white_bonus')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
		if (pc.location.isInstance('radiant_glare')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
		if (pc.location.isInstance('mental_block')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
		if (pc.location.isInstance('color_unblocking')){ return {ok: 0, error:'I\'d say, doing that would give you an unfair advantage.'};}
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

function onInputBoxResponse(pc, uid, value){ // defined by potion_alphabet_sauce
	value = utils.trim(value.substr(0, 140).replace(/[^a-z]/gi,'')).toLowerCase();

	if (uid == 'alphabet_sauce' && value){
		this.word = value;
		this.parent_verb_potion_base_pour(pc, {count: 1});

		return true;
	}
}

function onPour(pc, msg){ // defined by potion_alphabet_sauce
	var s = pc.location.createItemStackWithPoof('alphabet_sauce', 1, pc.x, pc.y);
	if (s){
		s.word = this.word;
		
		pc.sendLocationActivity(pc.getLabel()+' poured an Alphabet Sauce to try and spell: '+this.word, pc);
	}

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
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"potion",
	"tinctures_potions",
	"pm1"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-12,"y":-45,"w":22,"h":45},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHxklEQVR42u3YW3MT5xkHcKZfgI+Q\ni9620150pk2b6bSdTBqgQxKOmTSkTDIMIZQOkGaGUwohUAcIBIMhKTUQY4xly5Jt4oPs1cGyJdmW\nZZ13dVxJK2l3dVgdbQyhnfn32WWa5q4XUURm2p15RvL45qf\/8z7vvrvr1v3\/+u\/X3Y+3PDPS\/ce0\n4do7p75zuMGPtq\/XXd9TGu16DQMXduLqmTcSKvg7A9R37zdfO\/kS\/n72ZYxceQ2fn92K\/kuv\/8PQ\n\/d4vnjpO99n+w30Xt2Hw8k6on90fvoyhS6\/ixgevoLdjGwY+27\/xqcCsPrZzYNxo6jy6Efc+3o7u\ns1tw9vAGdB7bhK5jv4Pu\/A6t3X2X3\/zyqQB9WZGdtI3j9P5fo+fcFhiuvIq+Cztw9fgmnDv8AjoO\nPo8+Ql4lbNtxzcePn02VldWgmMOpAxvQdWITei9s1Vqsfr\/03os4+favcP7QCzi461m0HSetrMhi\ncwWsXIRh9Dal+Bt0EObCu79F55GNOH3geRx96zns2\/ETHDm2t9J+3Moqig\/WkK01ECwUceWTkzj4\n+k+1dquw43t+id9v+iHOXz4eYfjq+rbgimtrW+WV1YdUUNYI12iCUypIVqoIF0ro\/PQidm\/7GXa\/\n9GO8sflHeP+j48a2JafiqKUPC4SrEU4kXLpWI1wNCQLmmk1EygpGXU5cuvEJjDbzo7bhKg8fvpWt\nN9ZUhLK6iny9Ab5SQZTSYxUFwVIZ\/mKJqoxFPoOFvARnJpdsC67x6NFBgq0JlJjaWhWXVmGUlpdQ\nS3IBi1IBLkJNhDgYvMH325bc13FZmthcvU44BUkChii1f+OcGi7SXlxhdbUz22ispdXEtJZWwas4\nSi5eKiFcLML9tHClB2vXhCah1MQIl6rWwJfLSFBqcaooAVlqr0tsMS5br38\/XlKusJJk8wkC6xOy\nnCed4ebjiYgzlgjaQqHefL2uzzUaECixLFWGhoGn1BI0AHFCRSi5AG3Oi6LcOhyA7\/k8kjPKJh8G\nE01KpoZUvUrpVCE0CEF\/q\/tZhlrICRlkCZShxDQcJRajChHMRxvyMtUC4UzReNMYCO\/5xrhYnt8U\nY5cfi2kHxNQSZp0lOJwValce6YZIOJHuBrK2h3lYFr5IBDFBQIbaGJdkra1eQnkKBfos0VCouETT\nGI49941xqWzkmJCYJZgDsjCPUs6NKJfErL0Kf7hEC16kBEXkGjINAS14jiNgFOFkkooHL8sIU6nT\n6iOcOhRTrcIlM5GfZ5JOpNz34b9+Dq53D8C+excKvBtefxH+EC30eBnpskx3AaqGhLiSQ0qWNGBI\nLT6F0NdwpkhspSU49Qo75x64jh4Cs3kzLDu3a0D1e5GbhZzjEWBVYAmxVAmCUoS4UoBQlxAr5+Dn\n42BTaQR4HjREWmtbiksKlb2z+\/ZoIOeh\/chzNiyeeA\/ejr+gUWaxWo0hn8uDowTj6TL4XBm5ahHS\naoHuryJNahbBTBLRbE4DWqJx6BxLG1q2j4XZVIAdu43E\/IiG9H96XvuUQlYChpHzh9CUE8hmpSfA\nLE2tqGhIcUWmJEVwKpIOo9Ygh\/mciGFP4J3WHcUD+QbPTSETs2Dx9BEN57v0IRTJC79xETc3MzCd\ncuBBLYZURkZSoLWYV7QSqgU6Rongq3kEJFqDUpYmvIKJMHe9ZUCvr\/nPWNCCdJSBt+uvsOzYTm22\nYqHHoeGW+uZxZ6cZgZEl1IosIQtIZJSviq+KSNZy8Mo8QoUMktUKxtnoUuuetuwNzFrD4LlpLT1v\nVwdMZ6warodgctKDmcsOjP55BhXZh7LkRyxWRDShIBKn4kuIVrJwy0kEik+ATEZwtAw4M1eHvr+K\nWNCMiOUerFfNGs6tmyGoTfuu1rLeiVJ+CUXaHwvCAiFTCHIKTbgCd6hIay+BYDmDeFWBbtEdbBnQ\nbK6V+u80MWuJIsmaMLCXktvBgA\/asDxioxQZyBkX+IQLdyfsMJjtSETnkEvaEQ4n4PEqcCzSHSeY\no2NVBgG6m\/Q7F6dbBpxfLkd7bjWgH2gisORE2GHSgANvM+j7w5PST9uw+TTzVe27wiAStmqDFfQF\nYJtRMOcT6d6b1Y5U3VPmztYBOemEXldD\/90mRodriAYZDTl6ZBqGgwzGbpg11O6LDL6wWghmwZk7\nDHZ2MPB4KGnaAVyOJGbsCpzpHIbcnjVDKtXaF0Hm2UK552YDg\/1NmMYLiASmkQhPai2\/NTqtAUct\njDbpqQgDlv5\/rHsa98anwPrmMc2UwZjLMFGbe+YcPS0\/dDo5aZfRWEHv501q9QohZXD+KcRD4+jS\nmzSgiv1PTdIPmEDYa4FxqAzjqALTQh4610J2kOe\/nedau19w6Q1l3O1pautx7D49fbltGLeMa8Du\n4UkNrFYsOEbJTcFoyKO\/v46BoTqGl7kHt21zL36rx3c7x1uHRgvou70CXV8Tw8YqfAsWfHB7UkPu\nvTwFp+s+vAtWSq4Ina6BEaZCuMjqLbujPa\/NrNH4uS9s\/Je9vVUtzaGBKpZcMxhj7ms1Z\/Ni2FDF\n8HATI3YRQ8vL5m7n0g\/a+sLHIknPTCyHxwzWqKAfS6N\/uITJ6TjGp1IwTFQwZInLA24Pc3NiasO6\np32pL3OG5xcP6OfnDwzMzf3pLmN982+Dg+vX\/S9f\/wIA3cR26gu+vAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/potion_alphabet_sauce-1352316424.swf",
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
	"pm1"
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

log.info("potion_alphabet_sauce.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
