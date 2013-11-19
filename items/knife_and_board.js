//#include include/takeable.js

var label = "Knife & Board";
var version = "1355086256";
var name_single = "Knife & Board";
var name_plural = "Knives & Boards";
var article = "a";
var description = "A good knife and cutting board. They can be used to make simple foods.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 75;
var input_for = [];
var parent_classes = ["knife_and_board", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "cooking",	// defined by tool_base (overridden by knife_and_board)
	"required_skill"	: "ezcooking_1",	// defined by tool_base (overridden by knife_and_board)
	"points_capacity"	: "100",	// defined by tool_base (overridden by knife_and_board)
	"display_wear"	: "1",	// defined by tool_base (overridden by knife_and_board)
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "100";	// defined by tool_base (overridden by knife_and_board)
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

verbs.use = { // defined by knife_and_board
	"name"				: "use",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Get chopping. You know $recipes_known recipes",
	"is_drop_target"		: false,
	"drop_ok_code"			: function(stack, pc){

		return true;
	},
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [1, 7, 8, 9, 11, 12, 13, 14, 15, 16, 95, 97, 98, 99, 100, 101, 102, 103, 104, 138, 225, 322, 323, 324, 325, 326, 327, 328],
		skills		: ["ezcooking_1", "ezcooking_2"],
		can_discover	: false,
		specify_quantities	: false,
	},
	"conditions"			: function(pc){

		return pc.making_check_allowed(this, "use");
	},
	"effects"			: function(pc){

		return pc.making_get_effects(this, "use");
	},
	"handler"			: function(pc, msg, suppress_activity){

		return pc.making_open_interface(this, "use");
	}
};

function getHitPointModifier(pc){ // defined by knife_and_board
	if (pc.imagination_has_upgrade('ezcooking_tool_wear')) return 0.5;

	return 1;
}

function onMakingComplete(pc, recipe_id, count){ // defined by knife_and_board
	var chance_of_bonus = 0.10;
	var bonus_base_cost_percentage = 0.20;
	var upgrade_id = 'ezcooking_less_imagination';

	return this.rollCraftingBonusImagination(	pc, 
									recipe_id, 
									count, upgrade_id, 
									chance_of_bonus, 
									bonus_base_cost_percentage);
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

function parent_getHitPointModifier(pc){ // defined by tool_base
	return 1;
}

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("ezcooking_1"))) out.push([1, "You need the skill <a href=\"\/skills\/35\/\" glitch=\"skill|ezcooking_1\">EZ Cooking I<\/a> to use this."]);
	if (pc && (!pc.achievements_has("master_whacker"))) out.push([2, "Additional recipes will become available if you use the Knife & Board more."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a> or purchased from a <a href=\"\/items\/1000006\/\" glitch=\"item|npc_streetspirit_kitchen_tools\">Kitchen Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	if (pc && !pc.skills_has("tinkering_1")) out.push([2, "You need to learn <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !(pc.skills_has("tinkering_4"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/75\/\" glitch=\"skill|tinkering_4\">Tinkering IV<\/a>."]);
	return out;
}

var tags = [
	"tool",
	"cookingtool",
	"food_task_limit_upgrade"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-34,"y":-19,"w":69,"h":19},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJBklEQVR42u2YeVNTaRbGnfkCfISe\n6Zn5Z6ZbsXSs1h4FFVF7dGjpFncBIUGCEMKquEQRIagtKrYb0mEVCEsISxJAEp0GZE3YF1Gx1PJP\n+QjPvM8bbgYVGlvGGmtqbtVbZOPe333OOc85712y5P\/HwseTFrXPZHO0X7dpj98nCTduj54arI+E\ns\/A7jNji3J8U4ESTRm+7vQNF59ahMXcLuivDQTU\/CTgAvx1uUE9fP\/EVCjPWwZEXhKFGDYoyN30a\ngI8cKcGdpgOw3gqC7dZ2jFkPo9W4++MD9tQcDBppjAzquLvTb\/7cS\/XpqlL1D9ar0WXaB3dtuIDb\nhcJzASjJ2PDZB1\/c5XLN+8\/jdk3QcINquqf6IIYaVOBfXny8OTa+t1azfsqR7MflskQGdVeFu8ea\ndXDXqVD343aUGAIlXMG5jcZFqdPZ2ant6uqC0+mcNhqNOeJ1KD8frI8wusxheFixF2O2wxKMi6Cu\n2kh0Vasw3pKAR61J6Kw6hGFrNAhYffUfyNP7e+FMhgCfRQGOjo76jY2NoaenBwIQxcXFsNaV46H9\nCnrMKglH5fpqQr2A7WV7MWiNxWNnCvos0Ri2azHRHCtf3zkbAIN25dSiwjr7eP36tc+rV6\/ApQCW\nlZXBZDLhvqMJQw4DqCTh6G2EfWjaL+GomAI6ZtdIVdvKwuDI37XsP1oEL168mH727BlqamreAOT7\npqYmTA7Y0VG+B6PWKLTd3YWBuggJ1V8fI0MslRQ30WOOwkRLvPztz3dDzGNWdSiNe9GAIu\/MzEOL\nxfIOYF1dnYQc6rGJAjgsLy7MGBP3EiUg4bioKkM92Bgjb6K7cr83PfobNeZJh87vg1uTs87ofv78\nOdxu95yAVqsVzc3N6G5rxKAtQQISjpCEG22iavukmt3VERKQahOSqTHZmigLqqc6MudXwfWa1D69\ntSp35ZUw9Pb2oru7W8LNB9ja2oqxoS5xMR36atVe9QjbZ44QfTdWVLQnT1lMBB1pVOPRPR26a9Si\nqxyZfv+eaU9Y5rJET\/PO7LdC0P6gFS9fvoTD4fhFwAcPHmCw14GJf2ZKOKrG4hi1H4HLEuV5PaMe\nF9XuFW7Am+B6L7injtRlg9Y4CUdr+LlkN+rL8mQlP3nyRAJWVla+A0h4Ara3t+Pp43E8bcuQecfi\neHQvHp2VYXDVaSRUe9luqSIV7Kg4KG+kJjd4YcCxJl0o7YH\/0Ft7GAMN4s7N4TBmx0gF+\/v7YTab\nFwSkb7542o++eq20mhF7rAQh8HDjv4uJ4e4V4e9viEVW3MpfBuw2q7SEG7LFyQSneswNnvB6ykY4\nmq0YGRmBaH8LArLqWVRPhuzyXAMNGq9SvTXhEkxR0m2JQG6aH9I1y+cHdFliE5kDBFQMlos5wxPU\n5GxDYW6mDDMrmnALAfb19aGiogJd9SdENNRCqUMyLzsq9mPAcshbKEVZmyTcWY2vfk44AWakUrw7\nhpQnoYrMQQJ2VYXKxL6QHC4BadotLS3zAt6\/fx+FhYW4nH0ahdcyYC3LlucZaojyWI5QkudjB7Ld\nDkJm7Aqc0fi6DeoVPm8PkL+ZdKYWE45qeULhASSc0q6Y4ByPzoSvxPjosLQbxbjfBrTb7TAYDMjP\n0aP6zN\/lqtR\/g9ZrIcKYPf7YJYqF4e0o34vzur8Sbjo9avm77e9Ri9ZIIBaD4lcKmLKY1GJUkqEo\nSN+E7ORDEo6rra3tDUB2lKysLKSlpSE9LgRlxwNhzQqSkKZThNwpc9plEZ7XoMaV1DUytAJQO8cs\nF+1kiVN6qkT1aAcKmHR2c9RMiA\/JcAxYVNAGr5BwLBSGm1AEJGhmZqaE49LHfIfMg0sF2BbUndsO\ny9ntKD+5FTah5LD1CPLTN0i49GjfnLkGTSMl5iynhJT+xPxQ8k+CVatmVI2XOcO2ZIhejZKbP0jL\nefz4MTo6OqRpnzp1yguXFBmMDPXX0O9diptaP+QnB8gwE7AwNRAFZzd7lIv2dc4Fp1X8h4CTjiQJ\npDR2vmYYCE5VPU0\/WoaY3tWUtw9nY3ZKQOYiC4JwR1OSoFOJnNJukMbOa9Re3ons8OXIS\/CXkHeP\nb5GgN8R75t07RSH7a1V4KJWg\/3CaoNxUj3AsFOYcq5lg\/JwqyrwRIebv2Tcv6zaioaoUNpsNVy9f\nQkLYt4gP9kVp1mbvhO1pYWqcO\/ClXJdUK1GQEuDNxyu6NUFzWgon2Z\/EVNtRfkBWpqsuyqucMrvJ\nwqjx5CehJXCTp0VNNMeJQUCDE+HrkRa2QRp4440dUuHZcJywaSdJO\/6C03u+kJAEJBxX+Ymt2nlN\n+Yekr51M0qrL26SFKKopcLPBlKIZqFdJAF6UHYaFNelIlqlCOKUzcNGE5cwnqn\/YFo+LsWuRq1mN\nC6rVuJ66A9d1AchP8NfPC2hIWLUs7\/T6qWtp63D3wlbcKzjgrVwq97bVMB+5z2AODjVGvTFG8TOO\n+gqcAsybEbs70WM1yIxZhZJjgagxlcrOkhO3CWkhS\/ULDgY5KX\/TF2RsnCZo7bUd6DBFSGVmw1FJ\naeRiP+sJcawXjt8pIWWVE2r2tMwhI+\/Mehg0q2RxFJ3ejbxj3+LkXl+oAz\/Xv9doxZy8emytmdvA\nH4\/7wXp7l1dBJdxKN1EACcfv+Bu+Z0hZdIqahCNksSFA2kliyJ+R+v0XOBryJaK3\/gnqzX9AVODv\nf93GiY8fbpzwc94Se9YSw2a0FuyTiir2owDKaVgUlKIwJxPCscr5vWfbuRuVOVuULjGt2fZHM6GU\npQr8\/MM363fO+IeKsE9R0Uspa\/GgNGwGUOd9cqDASUOfGSRmF0f9je1eOPZYqsWQcqk2\/W7xz2G4\n2xeA+vMJa3DzpD\/KL34DZ9EBeXEqxOpVrIi2QzgqyO+V6WSmU4R+1IdCFxPXfHbjpL+Raoqqx5Wj\na9FZESpy0pOb0jtF6Jl3hHMWfS+nk3kHgI91sJD4HOVC4hr8JPyzOFs0\/Ttio94ktpgi9My55vxg\nXEr+yjMAaHyNS\/4bx3ndar876RvMVJPhL83eAnNuEAoyNyPjyApFOfeiHwgt9mDFZ+tWTxGU4Rd+\nKgHnnIr\/145\/AfZY7yoM+kNEAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/knife_and_board-1334256049.swf",
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
	"tool",
	"cookingtool",
	"food_task_limit_upgrade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "repair",
	"u"	: "use"
};

log.info("knife_and_board.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
