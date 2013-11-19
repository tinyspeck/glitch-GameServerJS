//#include include/takeable.js

var label = "Tinkertool";
var version = "1355086256";
var name_single = "Tinkertool";
var name_plural = "Tinkertools";
var article = "a";
var description = "Are you the DIY type who likes to repair your own tools? The nitpicky type who likes to craft their own gear from scratch? Then a Tinkertool is a very handy thing for you to have.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["tinkertool", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "tinkering_1",	// defined by tool_base (overridden by tinkertool)
	"points_capacity"	: "200",	// defined by tool_base (overridden by tinkertool)
	"display_wear"	: "1",	// defined by tool_base (overridden by tinkertool)
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "200";	// defined by tool_base (overridden by tinkertool)
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

verbs.craft = { // defined by tinkertool
	"name"				: "craft",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Craft new tools out of raw materials",
	"is_drop_target"		: false,
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [177, 178, 179, 180, 181, 182, 183, 184, 187, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 299, 300, 301, 302],
		skills		: ["soil_appreciation_5", "light_green_thumb_3", "remoteherdkeeping_1", "refining_2", "tinkering_4", "tinkering_5", "engineering_1", "fiber_arts_1"],
		can_discover	: false,
		specify_quantities	: false,
	},
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('tinkering_4')){
			return {state:'disabled', reason:"You need to know "+pc.skills_get_name('tinkering_4')+" to use this."};
		}

		// working item
		if (this.isWorking && !this.isWorking()){
			return {state:'disabled', reason:"This "+this.name_single+" has become broken, and must be repaired."};
		}

		return pc.making_check_allowed(this, "use");
	},
	"effects"			: function(pc){

		return pc.making_get_effects(this, "craft");
	},
	"handler"			: function(pc, msg, suppress_activity){

		return pc.making_open_interface(this, "craft");
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
	"sort_on"			: 56,
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

function endRepair(){ // defined by tinkertool
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc || !pc.is_player) return;

	pc.announce_sound_stop('TINKERTOOL');
	this.apiCancelTimer("onTick");

	pc.apiSendMsgAsIs({
		type: 'overlay_cancel',
		uid: pc.tsid+'_tinkering_self'
	});

	pc.location.apiSendMsgAsIsX({
		type: 'overlay_cancel',
		uid: pc.tsid+'_tinkering_all'
	}, pc);

	var tool = this['!tinkering'].tool;
	if (!tool) return;

	var txt = '';
	if (tool.getInstanceProp('points_remaining') != tool.getClassProp('points_capacity')){
		if (tool.getClassProp('display_wear') == 1){
			var percent = tool.getInstanceProp('points_remaining') / tool.getClassProp('points_capacity') * 100;
			txt = "You repaired the "+tool.name_single+" to "+intval(percent)+" percent.";
		}
		else{
			txt = "You got partway done repairing the "+tool.name_single+", but it needs a bit more tinkering.";
		}
	}
	else if (tool.isWorking()){

		txt = "You fixed the "+tool.name_single+" up just perfect."

		if (pc.getQuestStatus('tinkering_repair_tools') == 'todo' || pc.getQuestStatus('tinkering_repair_more_tools') == 'todo' || pc.getQuestStatus('tinkering_repair_even_more_tools') == 'todo'){
			if (!pc.tools_repaired) pc.tools_repaired = {};
			if (!pc.tools_repaired[tool.tsid]){
				pc.quests_inc_counter('tinkertool_repair', 1);
				pc.tools_repaired[tool.tsid] = true;
			}
		}

		if (tool.class_tsid == 'tinkertool' && tool.tsid != this.tsid){
			pc.quests_inc_counter('tinkertool_repaired', 1);
		}

		pc.achievements_increment('tools_repaired', tool.class_tsid, 1);
		if (tool.hasTag('cookingtool') && this['!tinkering'].percentage_wear <= .5){
			pc.achievements_increment('cookingtools_repaired', tool.class_tsid, 1);
		}
	}

	pc.sendActivity(txt+" You spent "+this['!energy_used']+" energy.");

	if (this['!ticks'] >= 15){
		pc.quests_set_flag('tinkertool_15s_repair');
	}
}

function onMakingComplete(pc, recipe_id, count){ // defined by tinkertool
	var upgrade_id = '';
	var chance_of_bonus = 0;
	var bonus_base_cost_percentage = 0;

	if (pc.imagination_has_upgrade('toolcrafting_imagination_2')){
		chance_of_bonus = 0.08;
		bonus_base_cost_percentage = 0.15;
		upgrade_id = 'toolcrafting_imagination_2';

	}else if (pc.imagination_has_upgrade('toolcrafting_imagination_1')){
		chance_of_bonus = 0.06;
		bonus_base_cost_percentage = 0.12;
		upgrade_id = 'toolcrafting_imagination_1';
	}

	if (upgrade_id != ''){
		return this.rollCraftingBonusImagination(	pc, 
										recipe_id, 
										count, 
										upgrade_id, 
										chance_of_bonus, 
										bonus_base_cost_percentage);
	}
}

function onOverlayDismissed(payload){ // defined by tinkertool
	this.endRepair();
}

function onTick(){ // defined by tinkertool
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc || !pc.is_player) return;

	this['!ticks']++;

	if (!this['!tinkering']) return;
	var tool = this['!tinkering'].tool;
	if (!tool) return;

	var energy = tool.getEnergyPerTwoTicksRepair(pc);

	if (pc.metabolics_get_energy() > energy){

		if (pc.imagination_has_upgrade("tinkering_repairing_gives_mood")) {
			pc.metabolics_add_mood(this['!tinkering'].details.tool_wear);
		}

		pc.achievements_increment('tool_units_repaired', tool.class_tsid, this['!tinkering'].details.tool_wear);
		var remaining = tool.repair(this['!tinkering'].details.tool_wear);
		this.use();
	}


	if (this['!ticks'] % 2 == 1){
		if (pc.metabolics_get_energy() <= energy){
			this.endRepair();
			return;
		}

		pc.metabolics_lose_energy(energy);
		this['!energy_used'] += energy;
	}

	if (remaining == 0){
		this.endRepair();
		return;
	}

	if (pc.metabolics_get_energy() <= energy){
		this.endRepair();
		return;
	}

	if (!this.isWorking()){
		this.endRepair();
		return;
	}

	this.apiSetTimer("onTick", 1000);
}

function startRepair(tool){ // defined by tinkertool
	var pc = this.apiGetLocatableContainerOrSelf();
	if (!pc || !pc.is_player) return;

	var details = pc.getSkillPackageDetails('tinkering');
	if (!details) return;

	pc.announce_sound('TINKERTOOL', 999);
	var duration = (tool.getClassProp('points_capacity')-tool.getInstanceProp('points_remaining')) / details.tool_wear * 1000 + 100;

	//log.info("TOOL capacity is "+tool.getClassProp('points_capacity')+" pts remaining "+tool.getInstanceProp('points_remaining')+" tool wear is "+details.tool_wear); 

	// Start overlays
	pc.apiSendAnnouncement({
		type: 'pc_overlay',
		item_class: this.class_tsid,
		state: 'tool_animation',
		duration: duration,
		pc_tsid: pc.tsid,
		locking: true,
		dismissible: true,
		dismiss_payload: {
			item_tsids: [this.tsid]
		},
		delta_x: 0,
		delta_y: -115,
		width: 80,
		height: 80,
		word_progress: config.word_progress_map['repairing'],
		uid: pc.tsid+'_tinkering_self'
	});

	pc.location.apiSendAnnouncementX({
		type: 'pc_overlay',
		item_class: this.class_tsid,
		state: 'tool_animation',
		duration: duration,
		pc_tsid: pc.tsid,
		delta_x: 0,
		delta_y: -110,
		bubble: true,
		width: 40,
		height: 40,
		uid: pc.tsid+'_tinkering_all'
	}, pc);

	this['!ticks'] = 0;
	this['!energy_used'] = 0;
	this['!tinkering'] = {
		details: details,
		tool: tool,
		percentage_wear:tool.getInstanceProp('points_remaining') / tool.getClassProp('points_capacity'),
	};

	//log.info("TOOL percentage wear is "+this['!tinkering'].percentage_wear);

	this.apiSetTimer("onTick", 1000);
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

function parent_onOverlayDismissed(pc, payload){ // defined by tool_base
	pc.announce_sound_stop(this.class_tsid.toUpperCase());
}

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("tinkering_1"))) out.push([1, "You need the skill <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use this to repair tools."]);
	if (pc && (!pc.skills_has("tinkering_4"))) out.push([2, "You need the skill <a href=\"\/skills\/75\/\" glitch=\"skill|tinkering_4\">Tinkering IV<\/a> to craft tools."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a>, a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a> or a <a href=\"\/items\/1000009\/\" glitch=\"item|npc_streetspirit_mining\">Mining Vendor<\/a>."]);
	return out;
}

var tags = [
	"tool"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-26,"y":-21,"w":51,"h":26},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHLElEQVR42u1X+08UVxTmxyZt3QWF\nRH\/ottYqCrhUxLqYOo3aRBstausjFrMxjbVNaNeKBhaLI4jI8lrebxzeIAVW3uICAyhPwVEhVKQy\nGFJt08bpf3B6zsUl6wPEgsEfuMnN7p3dmfnuOec733cdHBbGwlgYczuat7zH9+52l4b1m2DkyGZl\n7LstQucuV27egVm9HFXSPk9L2\/YV8OsnzpDs6QSpHztBsfcSqPFxgSqfxb7zChBB8BS1yo3OYqSb\nWkvX6DPKXS1VbHSGGp2LZV4BZnstthCQ2o3OevvrUR5qrmLTUqjWOYuvHcTIYR3X\/PkHUudOV2jY\nvIzN5m3vy5Rek5taT2mt9nFWaG27p+NLN6Fpq4ZSbZ7quePj49yDBw94msPDw\/zt27cNvb29XEdH\nh2bmKdzgoh06rFNyvBZD9Fq1ZHRVieFuaqj9dBl07HRl0TG5q8Uyn6XQ95WWrWM9HC0dez2hyHuJ\nErNa\/dzLHj16xD388y\/xj4ePYGxsDEZGRmBgYAD6+vrg+vXr0NzcDPX19VBRUSEUFxdPT7RuXzeZ\nij3CTT0ZicCVb2sj3dUskr273YTI5Y6qmLWOSuMWDQwc8jZEu6v5FE8n\/kXgEhMThZiYGIiIiICz\nZ8+CyRQFmVnZUFpaBk1NLdDefg2uXLkCVVVVcOnSJcjPz4esrCwR73seKKaHI3YSwNgnBLANo+u7\nevNaRwayfftHQrSH2pfY275jhUJRn2rDgiCYMzIyICkpCWJjY+HChQsMaHBwMJw8eRJycnJBFNug\nvLwcCgsLcZ0DKSkpEBcXR\/8VAgMDVXYg3uEsxEQEaF9f9iCjPRxZe8EaFEweanOC91IQDm4VpstK\nUVGRITc3V3kWaGhoKJw+fRrXcdDadg1wM5Ceng7x8fEYaROEhYXRRpQTJ05oJwFS7RFAAgARR7jx\n77fxdw6uF2ltAxmyWgXnsS6NqxaZQ77ZLbS0tCijo6PTFjrWlwaBSggUCgoKoK6uDi5evMiAEpCw\nsHN4vYhtIDo6GsLDw3Geh9TUNIrmRMcIXO6gwhcrpRsmmq5tFmITjvFwFO0j6b91gyJJknLz5k0t\npkbG79L9+\/dV04FEUqhaW1vpv4wcqWnpkJyczNIZGRnJopaXXwglpZfAam2Crq5uKCkpkZ96CBHC\nuEplCV6lUoJdVYAsloNXLTI8+zKdTsdlZ2dDW1ubgtERcUBeXp6EKRINBoOILxTLyspELH6+bs96\n32qdi2z5wh1aywrg8uXLSJJSjFYK3UOkYHVnNptxnQ\/YhqC7uxsqKyvpOv+\/+2VAQICeXkbFbTQa\nISQkhBU57prHVFly4kyQ9UsAVJ8PZJkgUuXv2QiDg4NSXl4B7\/\/jcQaCwBJ7acOtrW1w69Yt1nZo\njRtVzaqpJyQk6Kn4CWRDQwNg1Bgje3p6ICMxHqxn\/KGjxQrl3+4Cqt1s7sNJKUxNzdBbrVZWjwSU\n2szQ0G+ANc2eFxUVJcyJ8gQFBYG\/vz+LHrGQXkREoJoqTE+GxDNBkBv8k3IOVejZe7u6ugQsEyCg\nPT290NnZyTaIG5eR4Zo5AZiDbExPz4CamhqwWCwsXQSyvb0drMW5UHLOCLe7rk1ZS\/39\/WLvjRvw\n+30ZamtrATNinnVq7Ue9pQLiIsIhRL8fqqurkX1dgC+FsqICRgCSNSTRlAAfP36s+fuffxViOG5u\n7jxltW4J175jpdx\/4gA0ZiWyehOv1MMPn3lBEh\/Eih2NANzA6CS9hI2jow81WL+zjxopDFktbNzS\n4KEN0LvHgzG0dq835J8JYBFM5o2sfVDxk0pQ6hEo\/9rsF4GiaKHXM\/d\/7SkTMGn\/OqbLtkYeukYF\npi0ecNzvABw\/\/jNjIbEReyRJmIKORb579+7s3Hadj1pDQMi2k3MmQOQLbYDISdsiZgNGLmeiqS\/i\nkRj62rp6EZVARPmSKJrEzqamJj0Wv0IMxXTL2IJ4vP7q6SSfl6CdMAP2UvfspN\/JNJDSIDCBJPJF\nz0OdFYnJ2B95bD\/axsZGCwFGMpACEXmEl8mjw9O23RFoUsd\/EUiKGFkuG7DTq9+atk+hxnLU0xDM\npI6jOmhQvgz4KT+pTWGG4NScDaDtpJa5zomBStQ6sRpj2ow6TXo9k2fu27dPRe6FyPKi39PS0mSS\ntBkBZCczO4Bk8ycipZqssZdFbAopFEnGsAafO6ugXhvITb9SDRJAVvhPokXWajbEO3XqFEeGAs8a\n1IJkjCYvyzJjc2ZmJnf16tWZA6SzBp5vDeFr1HN6+EbbbiadptZD\/ZE8IDJexE9fqsM7d+7M72Gf\nhp+fn\/bYsWO+aOF5PJNImHqKqESA0fQC9kjDKzH6dY+jR48ayO0Qy7H9MGMxNDREU7x3754Bz83a\neQeJFk2LJtdCSkO9kZQHD\/JMvzMyMy0Ob9IgsJhuPRoGqbLSAniW1jgsjIXxBo3\/AMpcJZM4jCZG\nAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/tinkertool-1338253139.swf",
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
	"tool"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "craft",
	"g"	: "give",
	"e"	: "repair"
};

log.info("tinkertool.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
