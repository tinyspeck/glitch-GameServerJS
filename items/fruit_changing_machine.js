//#include include/takeable.js

var label = "Fruit Changing Machine";
var version = "1355086256";
var name_single = "Fruit Changing Machine";
var name_plural = "Fruit Changing Machines";
var article = "a";
var description = "A triple-carbine fruit-changing machine. It will transmogrify cherries into other fruit. This can come in surprisingly handy.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["fruit_changing_machine", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "transmogrification",	// defined by tool_base (overridden by fruit_changing_machine)
	"required_skill"	: "fruitchanging_1",	// defined by tool_base (overridden by fruit_changing_machine)
	"points_capacity"	: "0",	// defined by tool_base
	"display_wear"	: "0",	// defined by tool_base
	"can_repair"	: "1"	// defined by tool_base
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

verbs.convert = { // defined by fruit_changing_machine
	"name"				: "convert",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Make all kinds of fruit",
	"is_drop_target"		: false,
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [108, 109, 111, 112, 113, 114, 115, 142, 144, 172, 173],
		skills		: [],
		can_discover	: false,
		specify_quantities	: false,
	},
	"conditions"			: function(pc){

		return pc.making_check_allowed(this, "convert");
	},
	"effects"			: function(pc){

		return pc.making_get_effects(this, "convert");
	},
	"handler"			: function(pc, msg, suppress_activity){

		return pc.making_open_interface(this, "convert");
	}
};

function onMakingComplete(pc, recipe_id, count){ // defined by fruit_changing_machine
	var chance_of_bonus = 0.10;
	var bonus_base_cost_percentage = 0.50;
	var upgrade_id = 'fruitchanging_imagination';

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
	if (pc && (!pc.skills_has("fruitchanging_1"))) out.push([2, "You can use this, but it's much better to learn <a href=\"\/skills\/17\/\" glitch=\"skill|fruitchanging_1\">Fruit Changing<\/a> first."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a> or purchased from a <a href=\"\/items\/1000006\/\" glitch=\"item|npc_streetspirit_kitchen_tools\">Kitchen Tools Vendor<\/a>, a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a> or a <a href=\"\/items\/365\/\" glitch=\"item|npc_gardening_vendor\">Gardening Tools Vendor<\/a>."]);
	if (pc && !pc.skills_has("tinkering_1")) out.push([2, "You need to learn <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !(pc.skills_has("tinkering_4") && pc.skills_has("engineering_1"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/75\/\" glitch=\"skill|tinkering_4\">Tinkering IV<\/a> and <a href=\"\/skills\/92\/\" glitch=\"skill|engineering_1\">Engineering I<\/a>."]);
	return out;
}

var tags = [
	"tool",
	"transmog_task_limit_upgrade"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-56,"w":36,"h":56},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIFElEQVR42sXYeUyTeRoHcP7YfzYz\nrn+YzGyy2TWT3UHG0VQrAqJQRcq9yKUcwyGMDJeGRWZ2dTKmyigUESoKggKCCIT7bAXkaIsgR0EG\nkLtQlYqALpXDUTaa776\/32ybJTNggrX+kiehb2j6eZ\/f8Tzvq6enpdHU1MT5\/2hpadmo96HGnTt3\nWBkZGeKQkJDu0NBQHD9+HDweDxcuXEBqaipyc3NRWVmJxsZGNDQ0qEQikZhBC3SKLCoqyoyPj0dU\nVBT4fD4EAgGuXr2K7OxsFBcX49atWxAKhWAyiba2NpXOM9rZ2bleKpUqmMygu7ubINDT06OJ9vZ2\nmsmhoSHIZDLeB5lqMm1qIIGQv9VRX18PZmoxPj6uIjejm6zx9dY3Jaw7cEfwB15ryl94MtGpMjVw\ndHR0GbC6uppO72hPjUrZcFg83fot74nU32+6xoGl\/UwlfMxpEqwTt6Z+ho6MrWhP+wJd2SZovW4M\nNfDx48fLgCUlJWA2E6QVcZBct4ey\/itMSvwwJT2MyQb3boXQxk8ruFnRFxsHctgq2XUWxRFY5w1D\ntF39HLJMFlrTWJCVhaBDdBq1N8NRmxuBurxIlF0LRnmKN4pid6KvkItH1Y5Q3nZmcIcwJfHGTEso\n5BVuN7J9Pv3onYCPyzZ391\/fjbneeMz1nMFkRyKU967gSd8N9BbZoyNNnwL6Ci3Rc3MH+vKMMVRq\nhZEKW4wJ\/44JSSimOnh42h2LZz1xmJGdxpP2s5BX+0PC\/zOkF34fvmbc00oDzliOAcYrAkDG82Yf\nPCpzwpuB7zBefAhzzI++GhFA2XgSiurjTERgtusUpu7+E8NlwXjUcBRKaRgUdYHozfdBi2AbJNEb\nIeX\/CW3Jn6DuzAY08j8SawX4n6d3MdvoDJXUmwLHCt3wovMoFmXBGMy2RX+mJcaK7THd4IKBnL3o\nSjbCWBkHw0W7MFRgiOa4TWji\/5UCJTG\/AOujNqAh5uO1A6er9FmD6foYLbDFQmcYBc41+2oyuNT7\nDzxjFr0aqBQ5UeC9VFMNsOe64a+AzQm\/AG\/zNjBZXBf4TmtwOEOf1ZZpKx6pDcJQuTee1ntQoFLk\nTYHT9T4a4OMaFwrsz+ZQoOwyG33ZO3H\/JlsDvM3fgsrLXFyLPdKd5\/nJp1rZyUxl4PX396Orq4tW\nCHoIlxehoqICtWXpEN04h6rMKIjy4yEsSEBFXhxKb8agOOsssq5dQPIlAZLiY3Dx4kWQ8piQkIDT\np0+LtXYOqoEzMzNQqVSYn5\/H69evaczOztIqwlQLWu7I4UzOQdIokBuRSCT0GlMWNTdI6nRMTIz2\nga9evcLLly+XAcm1xcVFPH\/+HM+ePcPU1BSUSiUePHiAsbExDA8Pg3yX1Of3BpwI9MRkRBCWUgX4\nOf8G5pj4uaKQxmJZPuZL8jCede3DAaUBXsg134k234MY8HfHT5wdkJmxcXfPdkhNWRg0ZyOL9fmH\nATJrbP30AwWqzvfih52XcTOyAGe841H4YwFkdbXIDw+lwCumbArSOXBubi6crDkS8u4n4FvW4cyu\nGtyrUdBNc9HOEl27WUiy2Uc3y9uApLHQKpDZBOKlpSX8VoyMjOCy4VY0m2ylwL6+vlWBg4ODKM3P\nxbeBvgg4eEDlYrU308LU9N06bWanKt68eQMSysVJGurP5Ci5xNqEErYBBTY3N68IHBgYwLVLCTj\/\nfSR8nexgbWYCCxNDcHcbZa4Zx\/QH69XZap\/qQsjd78CtdYOPNBQPn0+grvoWMrcboGD7prcCOzo6\nEBHwFYI9XSjOzHAbdmwxIECsOYvMmcd58eIFSJSOCWmM\/VsB9bVUfjRy\/ge8csiJtvgrAW\/fEuJf\n3\/gi3M+dAk22baFhtccYXLNdnDUBFxYWOMwmQV5LGkam5TSS+zJArpFIiTmnAaYGHkZ5efnKQCbb\nX7s5wt\/FgQL3GrHBYcJxvxmDNFrbYwBT1ljy0kK0e7uh+YA1JpqlSDzpgM7wYMw8eogr0WeXAZlH\n0VU3yYkQf\/COHsGB\/eaw45jCw54L6z3GinfaJJPj4+hPuQS5qBKKGhHavFzRxN2D6elpJJ\/7cRkw\nPT19VeBFQQIO2XHh6WAFRwsz2JiZiN95FzMPQ2Xkgei3Iuls1K+AExMTKwJJMxF3PhZBX\/vDxdHR\nXjt1eGKC8\/DhQ5B4JO9HhuQHqD\/nJl\/WAFN8PCjw\/v37qx7UpLNhWi6FnjaHXC4Pl+ecANK+xHz6\nFkxVHIFiqAe1QqEGSI4ZAiSVYjUgeWcTGxvrp6ft0bJ7myLX8EukmBkg384AWYdske7phrRty6eY\n9H2rARMTE8V672v0mm3n1Nvvy6k6GgQh0yQUBPkj94gfsphIj42hQNKkrgRksifm8\/nv\/zVITk5O\nIOmgCaa2tpYW\/6qqKnoOrgQsKSnJZ776O529OGLqsCvpXt7WUZMbSEpKitT5m60TJ05k1tTUkLaJ\nvigiRwipxeQZhGSRHNqRkZEwNzeHoaHh9zoHnjx5UkWe6iIiIhAWFgZfX194enri4MGDcHFxgaOj\nI2xtbdXARp3irKys\/E6dOoXo6GgKPHbsGEJCQhAYGAh\/f3\/4+PhosPv27YORkdGITtdfaGhoJpNB\nBAUFrQp0dXWlGTQ2NgabzdbdW1Zm6kwEAsFoQEAAPDw84O7uDjc3Nzq1Tk5OcHBwgI2NDfbv3w8u\nl0uAC\/r6+nt0Os2bN2\/+o6WlZQgzja3e3t50DXp5eWmwzs7OsLa2XrCwsEhh\/vdva\/2d\/wIZp9dh\nUoIeTgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fruit_changing_machine-1334270453.swf",
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
	"transmog_task_limit_upgrade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "convert",
	"g"	: "give",
	"e"	: "repair"
};

log.info("fruit_changing_machine.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
