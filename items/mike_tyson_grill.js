//#include include/takeable.js

var label = "Famous Pugilist Grill";
var version = "1355086256";
var name_single = "Famous Pugilist Grill";
var name_plural = "Famous Pugilist Grills";
var article = "a";
var description = "For grilling food. Named after the infamous gang of Potian Grillers (all called George) who roamed the countryside in days of yore, indiscriminately punching things into submission then grilling them until they were well done. Whole continents once lived in fear of the Four Georgemen of the Apocgrillypse. You, meanwhile, get to use their tribute novelty cooking item.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 175;
var input_for = [];
var parent_classes = ["mike_tyson_grill", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "cooking",	// defined by tool_base (overridden by mike_tyson_grill)
	"required_skill"	: "grilling_1",	// defined by tool_base (overridden by mike_tyson_grill)
	"points_capacity"	: "100",	// defined by tool_base (overridden by mike_tyson_grill)
	"display_wear"	: "1",	// defined by tool_base (overridden by mike_tyson_grill)
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "100";	// defined by tool_base (overridden by mike_tyson_grill)
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

verbs.use = { // defined by mike_tyson_grill
	"name"				: "use",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Grill food. You know $recipes_known recipes",
	"is_drop_target"		: false,
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [21, 23, 24, 25, 26, 27, 28, 29, 34, 36, 91, 96, 337, 338, 339, 340, 344, 348],
		skills		: ["grilling_1", "grilling_2"],
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

function getHitPointModifier(pc){ // defined by mike_tyson_grill
	if (pc.imagination_has_upgrade('grilling_tool_wear')) return 0.5;

	return 1;
}

function onMakingComplete(pc, recipe_id, count){ // defined by mike_tyson_grill
	var chance_of_bonus = 0.10;
	var bonus_base_cost_percentage = 0.20;
	var upgrade_id = 'grilling_less_imagination';

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
	if (pc && (!pc.skills_has("grilling_1"))) out.push([1, "You need the skill <a href=\"\/skills\/40\/\" glitch=\"skill|grilling_1\">Grilling I<\/a> to use this."]);
	out.push([2, "Additional recipes will become available if you use the Famous Pugilist Grill more."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a> or purchased from a <a href=\"\/items\/1000006\/\" glitch=\"item|npc_streetspirit_kitchen_tools\">Kitchen Tools Vendor<\/a>."]);
	if (pc && !pc.skills_has("tinkering_1")) out.push([2, "You need to learn <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !(pc.skills_has("tinkering_5") && pc.skills_has("engineering_1"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/76\/\" glitch=\"skill|tinkering_5\">Tinkering V<\/a> and <a href=\"\/skills\/92\/\" glitch=\"skill|engineering_1\">Engineering I<\/a>."]);
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
		'position': {"x":-29,"y":-39,"w":58,"h":41},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJhElEQVR42r2YCVCV1xXHTeOYpDFd\nUh3b2DhZGE2MVUDxse+biCwiQsQNk9RorYJ5wGNRFByxIFGRRWQTJE8EEcTwAGUHQcAaK4xFTK3R\nEIP6RDQGUOH2f77mOjcvID41YebO\/c73fe\/e3znnnuVj1Kif4Y8xNubWrd63vv22x1Ct7rO\/fPma\nY11d8w+j0fb8+cuz29q+1ElPTx8\/6pf+6+y8Pa67+65ra+uF9Jqak23l5XX9RUWlLCNjP9u3L5tl\nZirv5OcXnS0rq8ouLj6+qaysxjgjo+B3PysULDYWFnvz5s3bZmr13Q03btztPHnyC5aSso9t2hTJ\nAgODWXBw2A9zKO5FsOTkNFZcfGywurrxfEVFvV9SUubEZw7W3n7pzc8\/r5ybnJzxCWDSDx4saC8s\nVPUXFKgYZnbkSAlGKfu\/XAIrfgawdJaTky\/NycmprKnpzGBra4e6ouLEdqXy0HvPDA5WmpiXd+Qf\n27fv6lq1ag1zdZ3PbG0dmI2NHTM3t2SWltbM2tpWkk1NzR9e0\/D29mErVvyVhYdHssTEVCihYrBi\nX2Vl40GV6rjes3DpKyUllevXrw\/8ysnJWdrczMyCWVnZPBagpuzhsRCu34Ajkdm3e\/eeIqXysAX2\neOlpXGu1efPWBje3+dJGBGNhYfUQkAD49VBApAyXaabndG1n58CWLFneHxq6qamh4cyaurpTk7SG\nu3CBvaBSVW5evXrtLdFiBMg3NTExk6CHAxRlEZDLdFyKiytuAFChNWBPT59OXFxivo\/P0h9ZRAQS\nAWlDkh8FSM\/5Nf3O2dmVZWfnDtTXt5RqDUhJV6EIa3ZwmDMkIFmVNuTWpfuiS+n+owDJG\/PmuSFn\nKtmJE\/+s1BqwpqZx2erV674ULSYC0gZiwNC16H66pndIpkEyvSPCkoufGLCwsHjlypV\/u8IBaBYB\n6ZoDiO4WI5rLPPoJkq9lbGzK3N09WHp6Nisvr3l6QNqMgLhMG4iAJIsRTbKme0Vl6fn8+QtQEg+w\noqIy7QF37Upcv2zZiut8UdJedCFtILrfyMhkRED+jAN6enpLFejAgXztAaFZJCpHP99E84xpAmpa\nUIzo4QApQ7S0tA6gNJZoDZifr5IjSNRiEGgCcZlm0YWPAhQT\/po1fuzMmX\/fRfeTojUgStzKVavW\nXhGDQgQSqwidRfE8jgRI71L6io7eiQhuubZv34G1WgN2dFzxCQgIPi9GJY9CzYARI1ZUQEw5vIrw\niuLi4s7y8oqYSlXxH\/SOploDdnd\/p5uXV1iIRuGeg4PTQ4ihzqNmihFzoJiSREDUYri3\/b5SmVeR\nkJA79kk6mRebmk7PQLpZu2dPRi2qyvdeXovQatn\/xGKa549be6iAonv0blRULADPXc\/IUPo9Tbv1\nnFqt\/k1Ly9m4+vrmO7W1J6l2srCwTVIE8uQtAhKAoaGxJPMkLZMZPbym4ecnZ83NZwdUqvIvMjMz\nJ2kD9HZra6vfoUOHjiQmJjbHxcU3JyQk5OXk5J3Nzy98UFBwFFm\/mpWUlLOqqnrW0NAkNaEJCXsB\nvZktX\/6hlNsWLPBmZO1Fi5ZIirz\/vg8LCgplaWlZg+Xl9WooXHbu3MUtSmW+Y3h4+K8eo7W6ML6q\nqmp5UlLScX\/\/9V1YsN\/V1R0Npic28en19l50j64\/+OAjplAEY4QwuTwQURiDTjmJpaamoa3fi9ap\nlB07Vsnq65sYPpZYaWmVNCMQ2Lp1n9yXyxUHvvnmxrudnTcntbW1vZqbmztmJIuN7u3ttayurj4a\nGKjocnef30\/hz\/MUP1Mk06BG09HRidnbO0r358xxQkfiKpUsZ2cXKPAhCwgIYhs3hkvgWVmfSRbH\n8WAhIRvu4RMgXht3Trh69WpQTs7Biz4+S\/poYzo3BMYDQFPmEUoyP2NiGaQAInhSkj4RqBP39V2B\nr7wguFjxIDb207rm5uYNcrn85ZHgXsNZi4qL290D7QdoYZ7bOIzY3ov5TYTjCXi497hM0BiDOCZ9\n+\/fvvxwQEKD\/KLg\/NTQ0RG3ZsuXuggULH\/ZqPPEOB8etJL6j2VIN9R4HJiPs3ZuC9BKlVigUsuHg\nxnd0dISlp2f00aHnZYd3wrQoL1uilUQ3i82naCWxHIpwfO2dO3chitNwPjde9\/LyendIwK6urrdL\nS0v3r1vnL23C3cPhyCJ8QRFYBOEKifdEJUTF+Htbt0YhwotZRETEgL+\/f\/uw7oVrdeLj47Pnzp33\no2xPC1E\/J5Yn\/o0hVgSSh4Ljrb+YjHkzERW1jTU2NgJy6yAAvwoNDX19WMDa2trxyD2hMPPtefNc\nBmbNmj1gYCAbpMxP1uTWosXF+sphRQW41TSriNgYcMtFR0cPArAXgPIR04uRkdE7bm5uWcHBoTVY\n4CjSwHUc4F6A3sMgYDZ7tqFUrmgjguKzaCVNJbglqe5Sks\/NzWOFhYUsNjaWxcTE9CE4do3E9hzg\nXpo5c+Y4jL+YmJhM0dHReUGpVI7LyspyQsnZ+fHHq04vXbqsGwn4O7i8F5D9mO+jlg5gkKUfQB4k\nCG5Rfu4ImHfVKSlpqC6pCIydBNgLwBHhRnl6ev7WxcXlIycnpxMODg4n7O3tix0dHSMhO5qbm79u\namr6e2dn51+XlJS8gTPjdfjw4WikBSWiryEkJLQdlv4aX2HtAPsasGqZzLBHJjO+QwoAbJAHGEGn\npKSy+PiEgbi4uJuA3PxYlWPKlCmvmJmZ\/d3KyuqeTCZjs2bNkgZdA\/C2ra1tE8C3AdoBsG\/Z2NhM\nIGgo8vLUqVPHqFSqP586dUof8JaoBsbbtm3zxQgJCQmrjoiIvBgTs70TleIqgqI3Ozt7EMF4bseO\nHXO0ap8AoocNazw8PNTW1tb3IcM1pnCNMc7dbBH4Fp63ATgHwArIC3E89AwNDd\/APBHH4zW8\/wdS\nwNLScizGi0VFRe+gphssXrz4oK+v7yVUiz8+UY83bdq0Cbq6un7YoAEbd2Lx27DqfcwEBjeZ4fCb\nIO0YSbAGBgbSNSmCcQPP\/wX4Jvwm087OLh4KyGF9X\/zeA8rPwNq6eDYTWz3\/VP\/709PTGz9jxoyF\nWC8elquGddoA9l9AXMNmd8jCFhaUBy0kaA5O1iZgvC8NsjwpQvcA\/D2GE34\/+ln\/l3c0YCdOnz7d\nEcABgE\/BOA7rnQbwecBdglWuALoLwN2wdA\/mHoD04H4PZDVALwL+EK3zi\/0nf\/LkyRP19fXNyNIA\nXooRhBEDJT4VB97ZgtkVwfTqk+71P7tFXA5S+f+FAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/mike_tyson_grill-1338253291.swf",
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

log.info("mike_tyson_grill.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
