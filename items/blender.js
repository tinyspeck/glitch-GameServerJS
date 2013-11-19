//#include include/takeable.js

var label = "Blender";
var version = "1355086256";
var name_single = "Blender";
var name_plural = "Blenders";
var article = "a";
var description = "A Blender is very good for blending juices, smoothies and other concoctions. This seems a generally sturdy model.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 150;
var input_for = [];
var parent_classes = ["blender", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "cooking",	// defined by tool_base (overridden by blender)
	"required_skill"	: "blending_1",	// defined by tool_base (overridden by blender)
	"points_capacity"	: "100",	// defined by tool_base (overridden by blender)
	"display_wear"	: "1",	// defined by tool_base (overridden by blender)
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "100";	// defined by tool_base (overridden by blender)
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

verbs.blend = { // defined by blender
	"name"				: "blend",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Blend drinks. You know $recipes_known recipes",
	"is_drop_target"		: false,
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 314, 315, 316, 317, 318, 319],
		skills		: ["blending_1", "blending_2"],
		can_discover	: false,
		specify_quantities	: false,
	},
	"conditions"			: function(pc){

		return pc.making_check_allowed(this, "blend");
	},
	"effects"			: function(pc){

		return pc.making_get_effects(this, "blend");
	},
	"handler"			: function(pc, msg, suppress_activity){

		return pc.making_open_interface(this, "blend");
	}
};

function getHitPointModifier(pc){ // defined by blender
	if (pc.imagination_has_upgrade('blending_tool_wear')) return 0.5;

	return 1;
}

function onMakingComplete(pc, recipe_id, count){ // defined by blender
	var chance_of_bonus = 0.10;
	var bonus_base_cost_percentage = 0.20;
	var upgrade_id = 'blending_imagination';

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
	if (pc && (!pc.skills_has("blending_1"))) out.push([1, "You can't use a Blender yet: you need to learn <a href=\"\/skills\/43\/\" glitch=\"skill|blending_1\">Blending I<\/a> first."]);
	if (pc && (!pc.achievements_has("blendmaster"))) out.push([2, "Additional recipes will become available if you use the Blender more."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a> or purchased from a <a href=\"\/items\/1000006\/\" glitch=\"item|npc_streetspirit_kitchen_tools\">Kitchen Tools Vendor<\/a> or <a href=\"\/items\/374\/\" glitch=\"item|npc_jabba1\">Uncle Friendly's Emporium<\/a>."]);
	if (pc && !pc.skills_has("tinkering_1")) out.push([2, "You need to learn <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !(pc.skills_has("tinkering_4") && pc.skills_has("engineering_1"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/75\/\" glitch=\"skill|tinkering_4\">Tinkering IV<\/a> and <a href=\"\/skills\/92\/\" glitch=\"skill|engineering_1\">Engineering I<\/a>."]);
	return out;
}

var tags = [
	"tool",
	"cookingtool",
	"drink_task_limit_upgrade"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-58,"w":35,"h":58},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIn0lEQVR42s3YWVBTWRoHcF7maarL\n8WWq2rFlnLZZdRBBUBQiAdk1IIiAAmK3qGVjRBkVaA0INqvtDAdEtDGhaVyQgEBUZEkIoDGEJBCz\nsMQsLLIJtNPz4Ns351y5NHbpvJhYc6v+VXDhpn71fec7J4mNzUdctd7rGM1MO86DnQ7clkBnUWuw\ns0gY5iLqCt8oehrpKuqNchMpYjaLBuI2s7VxrrY2n\/IS+rq6iBNCf232c4RHAU7QGrwehKEbQLzb\nBZ5EuII0yg3k0e7QH+sB6rQYfN850SqQDqarrdDfkyUK8ODgNOAoRYGeQPJa3Q+ygxEwr+qDZykH\nYPBaEaiKz0P3kUj4t7oPHkXvAHL1XS2C+ywGDJ\/+WmTIPCqayDrBmcpPY83nn13x0UBZwi6uNDYI\nxGHbgIZRCdoC3Xt3Qg9rB\/wyIAfpiUQYu38Xnl++CN1HY+FXjQpqd6wHWTUXKgO2guxYHBgzjsFY\nNhuGM46AOCkM7ga5fXxVtakH2LrTCaA9FU9l4Nhe6E+OBFl8CMgSQkGy1w8kUX64rb7wbK8\/9MYE\ngjw+DPq\/jgD10WjQpeyHkVNJ0IufaY8LgDuBG+Gmjz1wfRygcrudy8cDj8fZalIPKGng\/4r6RByo\nv40BTUosaNj7QRwfBPyQzVDt60yhaFiV34b\/cL3tuBZdi83t7YXdNZWCppI86UBpnrTnQup4CzsR\nFCc\/DG6NYS7BKnwc4bzfZji+O2D8u5wcvsWHRTU8nKQfG2scn5pqM46O1g8ZDDyFRoNu8fn1hVeu\nSGuvFCp5WenjXPZh4J1MBl7qEbicGAX50SEzRd8mSU+cOydIv3Sp4lxuLrpayUu2OFCr1+8juNm5\nOens\/DyVmVfzXeqhIaQZGUFDBhPST0wg0+QkMs\/MoIn5eaTAf3soFiNebS36oaICZRUXIwKsf\/jQ\n8lvOC7N5u\/nlyxYaN7+wIJ2anhboCE6vR3qzCRk+ALx55w4FvIiB6RjY3tnpa3HgwsLCX0lrCW4O\nB\/8unZyarNXTOLMZ4yaQeWoKTbx6hSYXFpBQo29vkigEP\/5cc6\/y9Mm2vvgoGEk58sZ07lTnzNkM\n9svMTMudLni\/XTlsNHLp6hHg+MQEz0RgJFT1fgOaZuduCNV6UVPvgOjGjUpR2Z4Qo2yPH9AZiA2D\nqX+kLVh2HQ4PX1oONJjMlXoTqZ7pLfJ3wE7tsIBUsKLsmqg0IVq5HEgyfDgRLArU6fVJUzMzQho5\nRNYfzggZEAyk1uAikF6DzR0d6Ee8BovLy9GF9DM8QdbZot5wJpcAlQnRYPFBMeGthh4UMsEkZFBG\nTO+f4oa2NnS9poYCcoqK0IPHj336\/N1WEODTmAjLAn958+bLQb2+mt5qVHgfVC0iyTYzgquoX6yi\nGVdRvgxYUFaGzhcUoOnR0S97I3wZBNgeGWK0KBAPyh8GBgeLpufmnsxgpFytRiQKnQ6p8TQPLVbR\nsAiU4fv81lZUXl1NAct5vB\/Ia8h2+bIIsD4sSGTx7WbQaGRrXry4jZFS5eBgpUylQuREUeE2awwG\nNESqiNtswm2mgC0tFDAPA6vr6tjkNeg1WBXA5FgcODU3t+WpQoEk\/f1LkZEq4naqcBV1GDhCqoiB\nUgyve\/jwLRAh1CoUbqPewoUzOV0sJuR7ebEsDsQt+iNpaRdG0pHgKpJq9eMqqnGbdRiox22WYPgd\ngQChqipUcvNmKWnvYgWN9UE+YGOtS2cwpInlckSnB1eRVEuOgSrcZt3YGBrBbe7B8FsYWMLjId69\ne2nkWXqCq5leDVYDzs7OumNYmUgmQyRUFXG1ZLjN\/bjNarIOp6evS7Ta8prGxlIC5AsE1PlLD0i2\nx8ZEqwGpScQV65BKqVBVxNWS4jbLMbDPaOY90JjftGqM5lu5WUrd2YT5kYzE46qkYAbeYpT3A7cb\nbax9aYzGpFaMI+nAwC4MlGCgDLdZbjRXiIdHuwTPjTOPDu6D3x9xee6bOFYHms3mlWKlsrRFIkFt\nuM3dwrbb0s62enl3Z72yT3pbjdchuc\/lcqulxw6cJZNL0h7qk2h13PihCJfJ5ChOX2G2vICd8ppz\n+BBkHf0GStLToLo4D1q410DWcAskd396\/aT6+kvyv+SZT\/KBvXarA6NnlzeoYoJAmxQBjedSAaWx\nAWWcgcq8HOBXlIKwrgbkokegbW2Egaw0eBDsBUUuaxfy\/7ZyxScAOjbUeTnDva1OS3ns7w6dIV7Q\nF+kH2v2hYDgUjj+K+sNP3hsh12nN2zjb4qy+YlXcz15rbZfDPpQmhgvc9Xf7DbcIzHFaY90q1no6\nsmlEA9MVxIf2Qks48\/3III93gGccVkO24xeQ4\/AX6w1J3fb1VHsFod7QkRwNj7\/ZB\/wdG5dQjaGe\nSz\/f99u0hCMwtt0qSLNfBTmOX1jvBHkQ6LHQjNdbc7AH1LO8oC6aAc8LL4AiOxVaElnQELYNahl\/\np4BtwZ5LQA4GkgoSJAe32So4ZSabq+PfAymfD9LsdOjJ+Q4wmEp7\/G5o2rUFv7\/bAp0pByhga8Dm\nd1pMqnfKngLCRbs\/W27Lueq6jiEgXwwVcOBZPR9UjY0g141C178uQ09sEHRGMaFttzd0nz4KLSwG\nNDE3QQMekvYgz3eA53EV0xaBFl2HBFju7gBX3e2hLnQ7qDmpYPgnB15kJMPg6UR4nn4Mhnok8FTa\nD0\/zs0Gj1MDj4wehew\/j3SlePs32a9gWA5JtodBlnZIA6VQxXKEp3BfkKXFgKs4E7Z0q6C3OBoXW\nAM2F30NPQhg8iw9+LzAvMlRkjSXIKj+fKSrYZMcpc7dT0hWlc3unJwXuwhu0IiUW5MdjoBm3fTmM\n7IG5TqtYn+S4o9ruZsctd7MXLYfSKXH96p2WXnJazfkkx9yHlkCZ21dsAi5zszfSQFIxHG7u2s9t\nbf6fLq8\/fcbifp8LOzc4MCzxev8FVI4qpEaBf70AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/blender-1334339973.swf",
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
	"drink_task_limit_upgrade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "blend",
	"g"	: "give",
	"e"	: "repair"
};

log.info("blender.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
