//#include include/takeable.js

var label = "Cauldron";
var version = "1355086256";
var name_single = "Cauldron";
var name_plural = "Cauldrons";
var article = "a";
var description = "A charmed pot for potioneers of all levels. This thick, heavy, magic-imbued cauldron is perfect for potions, from novice concoctions to expert unctions.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 3500;
var input_for = [];
var parent_classes = ["cauldron", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "potionmaking_1",	// defined by tool_base (overridden by cauldron)
	"points_capacity"	: "200",	// defined by tool_base (overridden by cauldron)
	"display_wear"	: "1",	// defined by tool_base (overridden by cauldron)
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "200";	// defined by tool_base (overridden by cauldron)
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

verbs.use = { // defined by cauldron
	"name"				: "use",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Brew a selection of potent potions",
	"is_drop_target"		: false,
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 306, 307, 308, 309, 310, 311, 312, 313, 320],
		skills		: ["botany_1", "potionmaking_1", "potionmaking_2", "potionmaking_3"],
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

function onMakingComplete(pc, recipe_id, count){ // defined by cauldron
	pc.quests_inc_counter('make_potions', count);

	var q = pc.getQuestInstance('potionmaking_make_different_potions_in_a_time_period');
	if (q && q.accepted && !q.isDone() && pc.buffs_has('make_different_potions')){
		if (!pc.stats.potions_made) pc.stats.potions_made = {};
		if (!pc.stats.potions_made[recipe_id]){
			pc.stats.potions_made[recipe_id] = 0;
			pc.quests_inc_counter('different_potions_made', 1);
		}
		pc.stats.potions_made[recipe_id] += 1;
	}

	var chance_of_bonus = 0.06;
	var bonus_base_cost_percentage = 0.10;
	var upgrade_id = 'cocktail_crafting_imagination';

	return this.rollCraftingBonusImagination(	pc, 
									recipe_id, 
									count,
									upgrade_id, 
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
	if (pc && (!pc.skills_has("potionmaking_1"))) out.push([1, "You need the skill <a href=\"\/skills\/127\/\" glitch=\"skill|potionmaking_1\">Potionmaking I<\/a> to use this."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a>, an <a href=\"\/items\/1000001\/\" glitch=\"item|npc_streetspirit_alchemical_goods\">Alchemical Goods Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
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
		'position': {"x":-32,"y":-63,"w":62,"h":66},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJSklEQVR42s2Ya24b1xXHvQN\/atLG\nNSS+hvPkcDh8iaI4JEWJelNSpNpyUktOjCSwUQtx0cLph7CFi34KoCVoCVqClqAlaAlawun5nzt3\nNKTkRIJdoAQuhsOZufO7\/\/O8fPDgjp\/9\/f2H+wd\/jg4OXkRfP385Pjr6bvzy5avxc\/7+9Nnz8e7e\n0\/HW1u54bWN7vLa2NV5Z2RgvL6+NB8sr4\/5gZdztL48XeoPRwkIvarX6Mw8+9jMYDB4uDddPBkur\nF1F3keqNFrXmO3IMgipVwjpVa02qVhsUYvA5Bn4Pq7jWkGvquvq9zM95XplKfsDzzFNzrn1Zb7ZO\ng3rdvzNYudoYNebaZ5jQsl3KZPP0+PEsFQyLbLvEv3n8goqMMGxQrTZHDX7Z3NwCzc9HxApRFC1S\ntzugbm8gR5zjd1zHfbi\/UgFwSEEFi61Rpdq4KIf1wzAMH94K1mP551qdy6Lp0B++eESfff57Oc5m\n8pQvmFQsOgJnWq6cG0VbFKlWm1Svt6jRZMiWgmy3uwKkB84TOL6vVp8T1YNKjfxySF4pIJeVhbos\nzlWnOxhPwPX7\/Zlud\/EK0v\/us89lfPHoscBlsgXK500qFCwCvO2UZDIoWC5XRQlA4qUNZTa53mp1\nkgGwZrMt1zWcKMjPwyq4H\/OapivAEas+GK6NUuoNRzAHfOzRHx8L4MxsTgAxsjlDBgCh4G2QeCl8\nEgDwU8DogXP8jutwCyiH5\/B8Asfzwiq4BkD2+7MJFdlXLgCISXJ5I4HTKubyRfFDMbXlXUOWKrJq\nmBugKkhU4EBZ\/R2\/Cxjf5\/uhPJeGg5KYBxZY6PSpULSOb0Qtw51jIqxga+tL6vWHPHkzmQigAAas\nntRx\/QTUdcsJrPZRGawWftdg8LkSvsMC8GNkAw42Henw8UwmczMVsZOOMBnMMN+OaGf3Cb345gf6\ny5u\/0buf\/kVv\/\/oPevX6LR0efkd7e89ouLJBi4srbL4WT94QWLxITBmr1+LgGCyt0eJglZaW1uW4\nPNyQxUfdJQ6sjoC5XiCLEqtl82e3RnKj0T6GGSTHxdGJyESaAMzW6Et68uRrevXqR\/rx7U\/0\/t+\/\n0Pv3v9DPP\/+H3r37pyzgzfHf6TUv4vsf3tC3L1\/T0Yvv6enBEW1s7goc3Aj+6LMQUB6BATCoBj+H\nlfh4eitgs7lwKjkqTsIARPQhEqdzHJRbX9+m1bUtgV9ilfqLQ8l9E3mvpfKeBEeQSivuZHCkAXOc\nNW4FrM0tRO02clef81VbVqoBJbd1FGCvt8SAQxoMVhhsVb7jN1ScDjs47sUzcHiJYDa7jl4Aan\/V\ngAg+lSmKyv9yxfPbq0ileoIJANdnH+n1l6nNSjQ5j4mK7JfTgBj3BYSvwrSAyXN+LRg2F4ESp7Gk\nCNzug+Vy7QITldkUiDL2SXbwVVpbH9Em+9CAfajDgEi8AIfCSC1aacl57BYqSBpiSsBAKZ3kAYG5\n8Y6An4UvokIBEqZGCsO92Wx2suRZVjAjSVf7X5xs4TcwCb4jIpeW12hn508SLAcHz+nZs0M54nxv\n\/4B2OfJHoz0Oih3lnxyxWBisgedrNTQbdQYvi3kBJ2knNjvOAZgzzMMJQL54jDwFQKQNKV26vsa1\nNYrVgwsgyjEpzK9GO1XOWpJutIqSnMsq7yH9QHVROv4OYbTaGjBvWJNmtl3\/DDdBMbRCmFxHMQDh\nf52OimAowr0era5uyhEDwbKyspn4ZZ8Vg1\/ifvHLhe5EN5P4JSKbhfE4DzqOLyaGqbkYXE0C2qUL\nXRF0fa2nlMRLer1l1aFwNAMALx8O19msT7ny7AoQN6oMvK7aLR6490PdjFYviWpbNQyGIYCTqSbd\nBGBF6SYAKwYcch+OeCFUhH+hLCKAkBNxHW6AxehWC2A6oqe7GQRJumGQAOFaj84JaWcCELJqSF0v\nUb5gBvilNKQMBp\/Ei6ESAPFyQEM9wAjQ\/FSb1UxFd5hSDo0vv0tMG\/seciLUQ8KeANRNKCQGJBwW\nfqFbIxyxevghXhZFA4lKqIkqAhDxV0Cyv95os3RHE6SSNSuXhoNpdUVBTZ4AzGSNS1yUlsq8bqkE\nVLqPiijS5QIvuQ9NQRV7EnVEYKmupBn\/3kzU102tpCy\/MlHqdN7De9Nws5kpBWdnc6e679MtvoDy\n6rBS1XGUE1hpq8qqnYJyMLNAsNIAwdDpBT7tp4PBUXsbDFhNm1XDFQ2DzKJ5OQ04yucLSQeNBzQk\nwJDXMKFWVe3ulLmkh2STJ8pKb9dI9hqA0i6j9zUSDLFq2ud0c9youFSreCc3Sl2hYFxkc4WJVl8r\nisnSgYRkLcCcGnCuh25g5dy+Vkqg4GexYhrs2qQKzjCKNFf1qBVYNxtW3hxF2CDptkc\/iC2AGqrt\nN5FM49qpVQ7DppgR35PB11B3ce80VHp+2zTJttQ1pBjHcU4+uC92TXOMm5TDQnqDH+bNkmknq9Sb\nKEyoFYY5oZrqUMwERgNNQ6Xn8hyLSq6t9zwXNxqFG62\/Y56bJps0XrXFcIA0ZPPuxlvR4sTL9Av1\nmL6mI\/N6gUVpTItFU3yuzqNouVeG4fz2vwwhr4BXdW5bduzMOFpU8dm\/HE\/UrFYqKWWMCbjrYVxv\nWeNIve4BVR\/o2I74XDN0L+uB49\/r\/5lalfOWY5Nr23x0qOxxa+So3g1KAjQfb+j9Uik+N6eGJRbw\nbLVI3INRKfEznivqNWshV6fu2b3guGfz0ZX0eos8EYPZlsD6rkOey32c5UrVQQPqOi4FDAh4owh\/\n5dRkq0CBa7gWnrWo7AKM1fcdqgds1sC55ICQ9MS59PxegFw1ou3tfdrY2JZaahWtC37RGUA9URSq\nOBxxrqgL8BKGo+CgumsrMN+1KPBsChmsWnaoFjgXjdCVjXkmVzhHnuSkfnU\/wHbnGJ0xVESFmM3n\nI9V5WzPsnyeeZZ67lnmpgCeHQMWKAQyq+fy9xCYNwxrqdJJGMC\/8kXPl\/UzM3cgYmyF0LlyiTj\/o\nCgwceGb0oRGG2Yem7Z0iUORPJe50uE88\/+g\/MFm1c\/1fzZ1C\/1c+eB6AqMXoFTc2dj4ekAv8GQo\/\n+8fZg0\/wQbeEZI6G9quvjj4eENncNL3oN7P6HT+5nHmIOo3+cXPzEyj4qT8Z9lWkHXRBn8QH\/yeQ\nnFLkn4tG++r\/EhApBW0XQ97Zr\/8Lzf0VbzE4940AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/cauldron-1338253850.swf",
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
	"g"	: "give",
	"e"	: "repair",
	"u"	: "use"
};

log.info("cauldron.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
