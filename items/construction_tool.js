//#include include/takeable.js

var label = "Construction Tool";
var version = "1355087290";
var name_single = "Construction Tool";
var name_plural = "Construction Tools";
var article = "a";
var description = "One handy pocketsized gadget for all your furniture construction needs. Comes complete with four pokey whojamaflilps, one specializing in tweaking the wotsit, one in cranking the doodah, and the other two in levering the begiantus out of any sticky-outty bits. A true professional's tool.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["construction_tool", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "furnituremaking_1",	// defined by tool_base (overridden by construction_tool)
	"points_capacity"	: "100",	// defined by tool_base (overridden by construction_tool)
	"display_wear"	: "1",	// defined by tool_base (overridden by construction_tool)
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "100";	// defined by tool_base (overridden by construction_tool)
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

verbs.use = { // defined by construction_tool
	"name"				: "use",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Make furniture. You know $recipes_known recipes",
	"is_drop_target"		: false,
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [252, 255, 256, 257, 258, 259, 260, 261, 262, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 289, 290, 291, 292, 297, 303, 321],
		skills		: ["engineering_1", "furnituremaking_1", "furnituremaking_2"],
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

function onMakingComplete(pc, recipe_id, count){ // defined by construction_tool
	log.info("FURNITURE got here");

	var recipe = get_recipe(recipe_id);
	var class_id = recipe.outputs[0][0];

	if (class_id != "note_pole" || class_id != "wall_segment") { 
		pc.achievements_increment("furniture_made", class_id, count);
		pc.achievements_increment("furniture_items", "made", count);
	}

	if (class_id === "furniture_roomdeco" || class_id === "furniture_ceilingdeco" || class_id === "furniture_walldeco" || class_id === "furniture_tabledeco") {
		pc.achievements_increment("furniture_decos", "made", count);
	}
	else if (class_id === "bag_furniture_cabinet" || class_id === "bag_furniture_smallcabinet" || class_id === "bag_furniture_wallcabinet") { 
		pc.achievements_increment("furniture_cabinets", "made", count);
	}
	else if (class_id === "furniture_floorlamp" || class_id === "furniture_ceilinglamp" || class_id === "furniture_tablelamp" || class_id === "furniture_walllamp") { 
		pc.achievements_increment("furniture_lamps", "made", count);
	}
	else if (class_id === "furniture_stool" || class_id === "furniture_bench" || class_id === "furniture_sofa" || class_id === "furniture_armchair" || class_id=== "furniture_chair" || class_id === "furniture_loveseat") { 
		pc.achievements_increment("furniture_seats", "made", count);
	}

	// Only a 5% chance
	// not sure exactly what max_luck is doing here -- it may not wokr. removing it for end of world.
	// if (!is_chance(0.05) && !pc.buffs_has('max_luck')) return;
	if (!is_chance(0.05)) return;

	// Need the required upgrade
	if (!pc.imagination_has_upgrade('furnituremaking_bonus_upgrade_1') && 
	    !pc.imagination_has_upgrade('furnituremaking_bonus_upgrade_2') &&
	    !pc.imagination_has_upgrade('furnituremaking_bonus_upgrade_3')){
		return;
	}


	if (recipe.skill != 'furnituremaking_1' &&
	    recipe.skill != 'furnituremaking_2' &&
	    recipe.skill != 'engineering_1'){
		return;
	}

	// Can only upgrade FM2 or ENG1 if you have specfic upgrade
	if (recipe.skill == 'furnituremaking_2' && !pc.imagination_has_upgrade('furnituremaking_bonus_upgrade_2')){
		return;
	}
	if (recipe.skill == 'engineering_1' && !pc.imagination_has_upgrade('furnituremaking_bonus_upgrade_3')){
		return;
	}


	function find_crafted(it, args){ return it.class_tsid == args.class_tsid && !it.getInstanceProp('upgrade_id') ? true : false; };

	var furniture_bag = pc.furniture_get_bag();
	var stack = furniture_bag.findFirst(find_crafted, {class_tsid:recipe.outputs[0][0]});
	if (stack){
		var upgrades = stack.getUpgrades(pc);
		var keys = [];
		for (var i in upgrades){
			if (upgrades[i].credits_cost <= 25 && upgrades[i].credits_cost > 0){
				keys.push(i);
			}
		}

		if (keys.length == 0) return;

		var upgrade_id = choose_one(keys);
		var upgrade = upgrades[upgrade_id];
		if (!upgrade) return;

		pc.achievements_increment("upgraded", this.class_id, stack.count);

		stack.setInstanceProp('upgrade_id', upgrade_id);
		pc.sendActivity('The Giants must have favored you. The item you just crafted was magically upgraded to a '+upgrade.name+'.');
	}
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
	if (pc && (!pc.skills_has("furnituremaking_1"))) out.push([1, "You need the skill <a href=\"\/skills\/99\/\" glitch=\"skill|furnituremaking_1\">Furnituremaking I<\/a> to make furniture with Construction Tool."]);
	out.push([2, "More things can be crafted after you learn <a href=\"\/skills\/100\/\" glitch=\"skill|furnituremaking_2\">Furnituremaking II<\/a> and <a href=\"\/skills\/92\/\" glitch=\"skill|engineering_1\">Engineering<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
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
		'position': {"x":-36,"y":-33,"w":72,"h":38},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIS0lEQVR42u2Ye0zTWRbHSXgXpDxE\nURdLRCjvgqioIAWRVwsUlNcI0pkOFKTyGAqUglDwNQhIRQUEhIID8hqoIAqKppp5ZNdkbXZ2fewf\nhuyfZv9o4j\/++d3z+2Ukjroz7oRO9g9vcnITyL2\/z\/2ec889pxYWn8an8Wl8\/FheXpbcunXL8O3M\njGF6elo7MjIiMcd3lEol7+zZs9re3l7D+Pi4YWFhwXDnzh3t0tKS4L8uIjCdXn8D8zdvYmDgKs53\ndmJwcBDd3d261tZW7loCpqSkaEQiEWjGkSNH0NjYiE763vDwMG7cuKEnoX75PaKXEiAYwOaWk5AV\nyY2ZWVmG\/Px8E8GhS11ubNvlVLFWgIcOHeIRXEVMTMyKj48PAgMDkZGRgdLSUtTW1iI7O9v0C1HG\nJ6c1DODMzCw6tVrT6Y4OHvP3hgP+vM70cNPZcCcUCTZCpVKtiZIEIxSLxToCNDFwDFR5eTlCQ0MR\nHh6OiooKxnNQKBRadsHg4DcC3cioUdPcAnlxyYpCoeTNJbhLB6NdTapgB5Tw7VFdWkQLK1dkMplg\nTeL9oAt3KdVTpxd7orc4A1\/IChEWFgahUIiamhrW9QUFBVhdMDU1xaV\/COVyFfeHTK+V9l1OmEzY\nhIWkjZhP3IDzmfugrlFCcbzMREquQk6Fu3B79joKR6Odpf00F3lZCU\/72\/F+DQ59cu5f8kOMt8Wb\n2b2Zb4n3CBAZGYm4uDjk5ubi+PHjuHz5Mj64wROpn0Ed7GD4Pssbz78U4H6mD6bj1uOKyBdlsqMo\npcWqL49U3El01y7Eu5kmYlwxEeOC6QOumI1zw8BeJzQFWhuVvtbSd\/f+d2Oq8B\/H9pkYsPEDbji9\nYx3UwRx98e4tgsTERG1UVJReIpHg1KlToBuu+VU3\/DPfV\/BTPt\/496N8zCdvYjecIFWPx4VhJmkL\n7ok2sFDXol0wFeuKufj1uJO0AQ9SPHBGYIdj3lao2G6lf7Pfv6oTNIbM7axqg\/td0ChwNDUEc95L\nZTk5OQJSUPDRsfLDYS\/9U6k\/7ku24mqUCwuxSHYr0R3z8W7vAc4dXI86fxuUelvic54lGgJsjH8r\niTQsp\/MwG+\/OurQ+hGNs+I1Q+N+COmWz5s+ZXvg+bRPUQRyMx7qxCo7sdwbj4rFoZ+iinNC\/dx1O\nBNqi0tcKVb7WyPO0xCkBByeDbTEa44aWMEcGTmOWl+ZHySYjo9AS2RApqSO4eVKNAezesw7dEY7Q\nBNuz7q0kuAo\/eyi2WaJthwOqfCxRE2BrUgfbCc32FC4kuLMKzpALpV7WGCXXjsWQW0UeuMXc9oQN\nmD3ojp69zgTKQfxGS5TxbXEyyJYFlHnb6s36VusosL9L9cBisgcLN7CPi8+2WpFbnaDwsUFLiD0K\nCDx1syXKfaxR42+H3j1OqPOzhoLiURbkBrMCTuXswATF3n3RRiyTagt0G69GcnEmzAGlPhR3pNZX\nfjT72WE42o1VsynQBrV8K5SQq\/NCPc0L2F2YhhFSbpDib\/6gGxYJcFm8iVV06S1jDtG50wGnQ+yg\nIvVKKd0wCibuFpgXsKxQahhP41NKcUM\/ubdnDxffUnq5LnTBSBSXTdDdux2hDXfAKYKrpVTD3OQS\nAvxcsBm+vr7mBfTy8jJ01pVjMsmTBRwhJS\/uXseadqcje1vPhnLQQje5kS7GV3wbKLZbQxbOQ0RE\nBPgeruYF3LLlTyY\/Pz80NWnQnX+QVbAjnFJLCAeNBFUfaA9VgB2qKQ6r\/WygEjijMEuC+Ph4JPE3\nUv5zQHOog9ZsgJLIHbhXJMT51DB0NtfjYkcbuo7lojUrGqcPRUKTthdq0S7UiXajvCAb9Q0nUJyX\njcJQDxbujV3Y46RjXqg1hXtWGqX5SR6xWn0ogxxQkJ6Mixcv4vHjx1RLzrAVeHt7O1paWlCWm4ay\naH\/UUT58A1ZDLxBTHOiiXTG033ltEja9FMK\/ynYYmUeeeUeZD1RGeCJZGImtW7fC29sbfD4fAQEB\nCAoKQnBwMEIC\/JC93Qll\/hwoAzmoCuBAQa8K88y1R25AQ4kUVDEb1qSVmDgcxKrGvKNM9VGVHota\nlYrKcwUaGhrYui0rKwuHDx9my3amz0hISEBqchKku7ahyMcetUE\/qyjcjtYTKlb1S5cuMfMK2e8v\ngL8ZG9P3XupC6851q9UHleHSa9eusW5V19ejrk6NjvPnceVKH7q6utg6rrq6miriPKqIpcje5ctC\nVoojcVLTiJ6eHjYUGBsaGoJOpzPRLP1dgNXVNUhPz2AfeNU2i1V3UDsqffr0qYm6LwK7ggKpFLEH\nDkCtVmN+fp6Fn5ubQ1WVEiJxCmtZ2Tn69vYOA3MIWo+JiQlMTk6yRtU8mDb3N4Hu3r1bcbm7e4VO\naRodGzfk5R1l3PXB07148YJLgBpSwpCTm2uIjY1deRtwdHQURUVyJIvEK0li8eoefX19rAdmZ2dB\n\/TBrTMN2+\/ZtZja813L+3LBzqf43MK7p6OhAT+8VclE+8vMLTB9d2dIgQOnNmzc1RqNRQ025htrH\nDx5uYGBIQgdhYMAYCfO2Gd9r4MfGxnTnzp3D9evX0d\/fD7m8mOnuoFRWMxfBRHHHM0devXfvXsWD\nBw\/x8OHDdyFNq5AUK1JqTljJmcBtampiY6mtrQ1tlNNKSo5Rq1ksMFfyp1gWPn\/+fOXRo0fvQjJM\nEovFxUUT85MDc\/sYuAsXLpB1oaZWhcJCuVYul3Mt\/oDx8uVL\/ZMnT1fhhkeuGU+2tgrYoD3z9dea\n5uZmTXl5pUZWKNd8UVgo+aPA3h6vXr2SPnv2zNTfP7Dmvwet2Xj9+jXP4tP4NP6Pxn8AlBj0+G8u\n+lYAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/construction_tool-1338334034.swf",
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

log.info("construction_tool.js LOADED");

// generated ok 2012-12-09 13:08:10 by ali
