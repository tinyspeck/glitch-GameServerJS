//#include include/takeable.js

var label = "Crystalmalizing Chamber";
var version = "1355086256";
var name_single = "Crystalmalizing Chamber";
var name_plural = "Crystalmalizing Chambers";
var article = "a";
var description = "With this tool, every armchair alchemist can be the master of their own future. Or at least make some Plain Crystals. Who knew Barnacle Talc and essence of Firefly would combine to make such fine new age bling?";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2500;
var input_for = [];
var parent_classes = ["crystallizer", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "crystalmalization",	// defined by tool_base (overridden by crystallizer)
	"required_skill"	: "crystalography_1",	// defined by tool_base (overridden by crystallizer)
	"points_capacity"	: "1000",	// defined by tool_base (overridden by crystallizer)
	"display_wear"	: "1",	// defined by tool_base (overridden by crystallizer)
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "1000";	// defined by tool_base (overridden by crystallizer)
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
	"sort_on"			: 51,
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
	"sort_on"			: 52,
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
	"sort_on"			: 53,
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

verbs.crystalmalize = { // defined by crystallizer
	"name"				: "crystalmalize",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Make plain crystals",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		function is_firefly_jar(it) { return it.class_tsid=='firefly_jar' && it.getInstanceProp('num_flies')==7; }

				if (!pc.items_has(is_firefly_jar, 1)){
					return {state:'disabled', reason: "You need a full Firefly Jar."};
				}
				else if (!pc.items_has('barnacle_talc', 7)){
					return {state:'disabled', reason: "You need at least 7 Barnacle Talc."};
				}

				if (pc.making_is_making()){
					return {state:'disabled', reason:"You are making something else."};
				}

				if (pc['!in_house_deco_mode']){
					return {state:'disabled', reason:"No crystalmalizing while decorating."};
				}

				if (intval(this.getInstanceProp("is_broken")) > 0) { 
					return {state:'disabled', reason:"You can't crystalmalize with a broken Crystalmalizing Chamber."};
				}

				return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this['!is_crystalizing']){
			return false;
		}

		this['!is_crystalizing'] = true;
		var ret = pc.runSkillPackage('crystallizing', this, {tool_item: this, word_progress: config.word_progress_map['crystalmalizing'], callback: 'onCrystalizeComplete', msg: msg});

		if (!ret['ok']){
			if (ret['error_tool_broken']) pc.sendActivity("Your "+this.name_single+" doesn't have enough uses left. Try repairing it or replacing it.");
			delete this['!is_crystalizing'];
			return false;
		}
							
		return true;
	}
};

verbs.crystalize = { // defined by crystallizer
	"name"				: "crystalmalize",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Make Plain Crystals",
	"is_drop_target"		: false,
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [304],
		skills		: [],
		can_discover	: false,
		specify_quantities	: false,
	},
	"conditions"			: function(pc, drop_stack){

		return {state:null};

		// When we want to switch to recipes, later, enable this verb!

		// fix for people who had crystallizers before the switch to recipes
		pc.making_try_learn_recipe(304);

		function is_firefly_jar(it) { return it.class_tsid=='firefly_jar' && it.getInstanceProp('num_flies')==7; }
		/*if (!pc.items_has(is_firefly_jar, 1)){
			return {state:'disabled', reason: "You need a full Firefly Jar."};
		}
		else if (!pc.items_has('barnacle_talc', 7)){
			return {state:'disabled', reason: "You need at least 7 Barnacle Talc."};
		}*/

		if (pc.making_is_making()){
			return {state:'disabled', reason:"You are making something else."};
		}

		if (pc['!in_house_deco_mode']){
			return {state:'disabled', reason:"No crystalmalizing while decorating."};
		}

		if (intval(this.getInstanceProp("is_broken")) > 0) { 
			return {state:'disabled', reason:"You can't crystalmalize with a broken Crystalmalizing Chamber."};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return pc.making_get_effects(this, "crystalize");
	},
	"handler"			: function(pc, msg, suppress_activity){

		return pc.making_open_interface(this, "crystalize");
	}
};

function onCrystalizeComplete(pc, ret){ // defined by crystallizer
	/********** No longer used *************/

	if (ret['ok']){
		function is_firefly_jar(it){ return it.class_tsid=='firefly_jar' && it.getInstanceProp('num_flies')==7; }
		var jar = pc.findFirst(is_firefly_jar);
		if (jar){
			jar.setInstanceProp('num_flies', 0);
		}
		
		pc.items_destroy('barnacle_talc', 7);
		
		pc.createItemFromSource('plain_crystal', 1, this);
		
		var rsp = "You created a crystal!";
	}
	else{
		var rsp = "Huh, that didn't work for some reason.";
	}

	pc.sendActivity(rsp);

	delete this['!is_crystalizing'];
}

function onMakingComplete(pc, recipe, count){ // defined by crystallizer
	pc.runDropTable('crystalography_favor', this);
}

function onOverlayDismissed(pc, payload){ // defined by crystallizer
	delete this['!is_crystalizing'];
	pc.announce_sound_stop(this.class_tsid.toUpperCase());
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
	out.push([2, "You’ll need <a href=\"\/items\/641\/\" glitch=\"item|barnacle_talc\">Barnacle Talc<\/a> and Fireflies to make <a href=\"\/items\/701\/\" glitch=\"item|plain_crystal\">Crystals<\/a>."]);
	out.push([2, "You can use this, but it's much better to learn <a href=\"\/skills\/88\/\" glitch=\"skill|crystalography_1\">Crystallography<\/a> first."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a> or purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or an <a href=\"\/items\/1000001\/\" glitch=\"item|npc_streetspirit_alchemical_goods\">Alchemical Goods Vendor<\/a>."]);
	if (pc && !pc.skills_has("tinkering_1")) out.push([2, "You need to learn <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !(pc.skills_has("tinkering_5") && pc.skills_has("engineering_1"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/76\/\" glitch=\"skill|tinkering_5\">Tinkering V<\/a> and <a href=\"\/skills\/92\/\" glitch=\"skill|engineering_1\">Engineering I<\/a>."]);
	return out;
}

var tags = [
	"tool",
	"crystalmalization_task_limit_upgrade"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-20,"y":-59,"w":37,"h":59},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAInUlEQVR42s2Y+VNTWRbH\/QOman7t\naWcahUCjEEIICYEkhECCrC6ouNGNiCiigLZCoyibIFsAESNbIMCwhrCIQAEaHiIEDRAWISRsISQi\nrrTTPe1UTU2due85WM4P\/UMbbH1Vp\/KS3Lr3c8853\/POfZs2mXh1qZf+Iu4ZYmXUt3mnNbQFZja0\nB2c03PGXKSfNN30JV5NiXFh3f7i2cWCkSDqoulX\/YFRSe3+47labvPbpz2+5nx2wZWAkfXXtzYLs\nwXBuev2d84kVstSbrV03E0pr6gDg8wM29iuvGZ6\/mml8oBTigJkNHYnoMytZUl\/1RQDWY49S51ee\nqer6HmV+CJhS0VD5RQDW3FOkTC0ZB6vlA+lfJKC4A0tt7xvQRl5OWNoXEvrrofDTb49eiNNHpQkf\nfXZAZ7ptdGhExNr10nIIijgNvoeDYE\/IcTgcEQWBYafA39tjzZ5sseuzwLEYZAmHaQ+uzlQQ8Dkg\nEHCBx2OBuzsbGQeYDtvBCZkjxRrsbS2j\/1A4DsNOwkVgPJYDuLMdwYPzztzZNHBDv+HQbCcKuNBt\nCUga5ds\/DpLFsAvmulBhpw8P4uOiICvjCoQEBYCnmxMIuAzwcKUjcBrgG2Az7MDZ0Rbo1G1AJVuB\n\/fZPHG79ogqrKM+HPf58SLt6EW63VEF7Ww20NlfCkUB\/8HJ3hkP7fIBPQCJPohRwoZPfedEOedGG\npPtkcGr1oJlWPQT5eVeB78aEMvF1+HulCGprikFaL4akK+ehoaYQlnVjkJ+bAu4o5OteZNJswNGe\nyEUEaRH8SQBdqNvMThw\/DC4MCgTu84P869dAVJAJRYVCEJfkEeFWKrpgXvsI7vY0AodJBTcXByIX\niTCvA9qS1mjm5n\/eeECaDVIthRDB\/r2+kJIcB+lpVyArMwlyslMgNHg\/CNPjQX6vGaIjQ4GHC+b\/\nAFEeEoAEZOKGgQUd8KPs3yPA8EU4aDF8UR9PV4i5cAZ+jI2Ci3FnITYmEvb4uoO\/Jwf4HPp7VeNi\nYju9E8r7EP\/Pi4EBnokbVIzJ3J0+XBAglboiD+KL4vnl582DQOTJkO8DYS8SjZ+ADT58FyQUJqFm\nvOTg5Ya1noPv6iE4ILF4ojE+nuy1DQEkk0lcKprUCy1+aL837PZzQ\/fOyEN0orTs4DEJ9eKG3xOl\nBm0A9zSeEriKmciDXJQavjvYEHTQF83jBY6o9GwIoI3NVgoF7RyfkIM84sVnAQo5sdC6BaLv64b\/\nt383H\/Yh+3AMvrmAnR6wA22UiQq4g50VbFgeBoaEreCAznQ7BImeHq4MFCIOBPi7IyhPBOWJgASw\ndxefgMANhZDwuifyrBsKtzMKNQOFmobEwnDYBicjT0yJsKk\/mQxX0KP6uuTemKJ7aHTu\/IWol94e\ndPDlM2GHuwv47XCF3Ugcu9BTxd+Li0LoCt4CNuFlAQq3OyrYXPRU4bGpqHg7gL+v65tzZ489K5HK\nlKV9E90I8CuTAYt6VI7SoZnRJ6\/\/8eLVL29fPn\/9+ueejob\/VJRk\/5IQd+pfiRdPvUWfvybEnvzn\nudNBK2dOHtBFhR\/UR4UfMESeOmiMOXd0MTsnabyiofahavm5XL3ySnVfa3iAAxbeHaduBGB40yPt\nmP7FT0+XX70xTi6\/VA3Nr8r7tE+aO6cN5W2PDfkS5UJc5YguunJEH1Y1ZjhSNb4SUDWu\/+72jPF8\n86QhoV1jzGufMoh7Z54098+v3MM0xgEcsLh3\/JjpgN2jMfKpJfXC6pph8dlPSx0Tuq6y\/hlJ2aBG\nVK6YFUoezqf8FmCVShdeoVy8IBleSCx\/OJvdMamvwbTGHrl6ub9aMS1HgFEb4UExNqVXzxhfLs2u\nrs2V3Z9u+FjAeuWcWK4xdt1VL\/fVKKZ7S7Dxgo0A7BzQGGYn9S\/mVUurk6YAVio0xT1qQ2f3lL5X\nqtT0lcjHZCYDFveMjg9qjXOjulVNv9YwbApg+aDmVpda3945uSiXKmful\/SODZoEV9g1zMABFQhQ\nMWec7lUbHpoK2Dm11NY+sXhXppzpxwHxKmFCeEc9KrCJyT61XtOvMUy0js5jpgI2jS3Ibo8vdDcN\nzxKAxfdGeB8f3q7hM5XYxOOeicXpnkmdSjY8KzcVUDoy39g0OtslU2oJwBK5KtwUwJs1\/VPTd4a1\nUy1Dj2eKW7ueC6ukz7Ik1U8zxBXGa8Wly6mFRbqUG\/kLSXk5cwlZ1zTx6cnqiynxjy9npqgTc9K1\nyfl581dFIl0aGpshrjQWtXbOVveNPMRFUoaNK4rlo3kfn4MdioaSNuxNeVs3lLV0wo1aGWSUVsC1\nolJIFYkAgUFSrhAQGFxOT4ZLKfHwY0IMxFw6C3FJsRCfehmuZKRCYm4WJKOxqaJbkFtZBQW1UhA1\ntv775m35skmAV0Wl4gJpBxQ3dUBhYxvkVUtNBsypqIT86nq4US+DnJomKOjoD\/loQDvUmnv5ekFm\neR1cR5PlVtWbBJh2qxCECDCvqhbSJbVw4EQEbPnrV1yTAPHzrLMTFY6EhcMPadmQViT53YBXhJlw\nSZgLCfk34UJ2Hhw5cw4YbDZsMdtsKqBlNA5Ip25\/3wtyXZ1gV8AuOHL8OARHnIGI2Fg4+cM5OB4V\nCSGnwuG7sGNwOOR7CAoLgcOhx+BAaBgEHD0GfH9\/oDEcwdLCDEgW3wDJ\/G9ggWzr1s2UjwY0R8dD\nii2p5UNAHmr1BTxn8BFwYKe3G9EP7vyNftADtf9ubEfgoPafhQ5cTNT+0x3wptUa7GxIYEkywzak\no7a22qoj21iCE41MQHqgg\/vvBSS6adSVU2wsx7Z9uyVvyzdfJ27dbIL3PrzsbayCHak2GMnCrIVK\ntubSqdZctpN9tBuLLnFj0zEuyxHjONMwNpOKsZzsMSe63RgVP8Whw5adrRVstzaXWFuZJ5JIWz7\/\nC8311KDZb0dnDzLKNzOT3sf8FyyX3gCzSw9pAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/crystallizer-1334268489.swf",
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
	"crystalmalization_task_limit_upgrade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "crystalize",
	"y"	: "crystalmalize",
	"g"	: "give",
	"e"	: "repair"
};

log.info("crystallizer.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
