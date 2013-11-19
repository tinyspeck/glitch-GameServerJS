//#include include/takeable.js

var label = "Tincturing Kit";
var version = "1355086256";
var name_single = "Tincturing Kit";
var name_plural = "Tincturing Kits";
var article = "a";
var description = "Anyone who wants to beef up the benefits of herbs or create ingredients for powerful potions would do well to avail themselves of this basic Tincturing Kit and the Tincturing skill. As the name suggests, it is perfect for making tinctures. And no use at all for anything else.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1250;
var input_for = [];
var parent_classes = ["tincturing_kit", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "tincturing_1",	// defined by tool_base (overridden by tincturing_kit)
	"points_capacity"	: "100",	// defined by tool_base (overridden by tincturing_kit)
	"display_wear"	: "1",	// defined by tool_base (overridden by tincturing_kit)
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "100";	// defined by tool_base (overridden by tincturing_kit)
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

verbs.use = { // defined by tincturing_kit
	"name"				: "use",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Unleash the hidden potential of herbs. You know $recipes_known recipes",
	"is_drop_target"		: false,
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [228, 229, 230, 231, 232, 233, 234],
		skills		: ["tincturing_1"],
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

function onMakingComplete(pc, recipe_id, count){ // defined by tincturing_kit
	var chance_of_bonus = 0.08;
	var bonus_base_cost_percentage = 0.15;
	var upgrade_id = 'tincturing_imagination';

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
	if (pc && (!pc.skills_has("tincturing_1"))) out.push([1, "You need the skill <a href=\"\/skills\/132\/\" glitch=\"skill|tincturing_1\">Tincturing I<\/a> to use this."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a>, an <a href=\"\/items\/1000001\/\" glitch=\"item|npc_streetspirit_alchemical_goods\">Alchemical Goods Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"tool",
	"tincturing_task_limit_upgrade"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-22,"y":-42,"w":44,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJt0lEQVR42s3Y+W+T9xkAcH7aD5PW\n\/gNI1TRtVdu1QFtWVAIUCG2AUrKuFNDWUmjpRcnhJaQJgRCOAAlJCCFxiJ3DiRPb8X29Pl+\/vh3f\nx+v79X3FiWMnHD22TvrORuqUoq4tnenySN\/f\/MofPc\/3fNaseciAsPxjnHDyc7o\/dl4Rzz+zZrWF\nPJ07Gyosq4XBKB6KZ4+vOmApg0wsOXkWnm2EIpmWNasx2Fjy\/V6948yYM4iH8vnHVh0QTuX20dxY\nz3lktkESna9elWVG4nPiGwZHK8UTaViVZWYGEi3KaHJszBEcWpVlVs7lD5jT8+wbRieB6QqdJxkc\nB8km9CDF6j1ItXkPUR2BQyw0eojljR4SBNKV4khmi8g\/\/9wvBsRLVDuYroBX4PTaOkWKmU\/6hnC4\nYRKuaYJWf47Oq78ikNb1SbV1QxpLLcmC1lLQUA03lD4lisw3CsO5Fx8ZDEnl1yozedyrtY0Hb8q0\nkB6L+rthneKnADmhdI0kvXgSzt1rFPgyH5YVpp7LPy0KxAjt5BlJdU3DYFVdU8NFGo+ABCNYH6yV\ndnKl+B8CTo+dhWgT7cVxHmLSriIzk5cQStfbbdOdB7aVBagpzjlVNJNH\/FhCFYgktOEExrW6EI4n\nFKSYnMrLXMnwfwNSSK0iwcDfAK\/\/r4DRc\/j+ENx8B+DP7geNRytA2bYWTTo3j1jtTpXVYVe73HAg\nkbTFc4WYK5tftGRyBVEwkYCCyYQISyWh0gimUlAw7YfNyvnOz\/cAYkc16GnaDa7U7QLnPt0OcO9s\nAker1yNlK7N2fums3ItFZWarXWy1STzRuCk8n8Pi+aW5hbv3shw7KqSbbRMsm3OCZXdPcFy+Ca43\nRDLalW5S51\/ABVwV6GjYDYbO7QNXca+C0x9uBQde+yNS3u0lnWuXeoMxjsHEd4TCOiydcXrmcqml\nL7+6LfJHPN8HNOjE4cG2fWD8yptgqvstMFrMZAmIe\/dlcHDPBmgGgF+VF5lauDwNKynWQFDlTSTN\nztRccOHO3ZwCi\/kZNpS5Esh2+hj9pJF8y4k9\/+qorQS9xRK3n9gBWo9vBceqN4DG1pNscbpwqrxb\nTXK+aVKmIBs8XtgRjuhtsYTFXcyiP5sNcN2YbiWQgwaodDFUsGOhrwZG8N80X277+kRTze2a5tps\nS9dFs2U+T1Rllz96JMBZj19hCmJKMxZS6mPpaHp5OSWwuzAGDS9hzAxLmAyChMUaEyPCqbR41nR7\nRCS\/08+F7nYL5JkBhc417fTzNdncYZ4l\/euyA0eFYpoWdUu1bp9U5\/NL1VjCUcqgKpLE2HYXZSXQ\nIiGnmDLpHBrCvpzRzOYG5erwsNYsovsiNc6vv36y\/KdJEUjkQ3Sp2caDHagAQd0CxO0XS\/yYFcst\nhnhoULlykSjk3NCUXLlo8gX\/cY0lWO4SyjODKoOL4gywkMz8BUks+9uyAwfoTD5PN8uAzBY2ZLGz\nRXaUJfQEDCUgV6XwlzLIoBNgsoDn0RlUXxlR9AvEgd6bRHT5LoEsiVfOGids3j6qO4wrzsN2OL3w\nfPlWcXKh+SaNIWQoNRSm1kBjG0w0jslG5bl8SkMsbtXGUlG200NhWRzcPrbQbQ8Elh3B0B2101kQ\nGo0L\/QIJNqQysoiz9topNFjryC1fU2SW3i0rsJc8LZuWI+RpRE2mqnVkms40yTTbqEJf2G1MJp0s\nCd\/F5JC1l\/ADob5xwtykQhNnGiwJjsURvyFR+lcCeZFsTdmBPRNkuAScUqimRiAJe5gv4hNFEj7D\naPaI1eIIXSENUWij5gsD\/bHrQ72FWzRqjiQSp6hGS\/g6BAcfBMKZwscPhXhl0zNjOyueRV7ftQmp\n3Lq+7UHg1ZExzRCDzSeJJLIZlRZhqPUIU29E2Ga7GvKGgzyn38Y12WZJIn7apKf+UyCj3GXwR2\/T\nOUPLREpfnswa9HKFQyK1ZlppDRrI8kyh4yfjXn7xyf3bNj0DKresA\/t3bwYnjh8CHx550\/7q9g3r\nvgUO0BgqhkKN8IwWhcBkVQjNDhiyu+QCJyqHXF45q\/9UmEk4n6DNDN1JB7jApsIDGes8YJMaAHX4\nJGCO\/x1Ime3AggwCNKCCHgpYWbG+bfPGp8D2l58FVa88D\/a\/9hL46N1qsGfnRlCEI0feO+y7dmvQ\nztXNKrhGM8wz2eRcs13GtzmlXIMeZrPHTRzuhJEtZnvUWvZ9IH2kARz789PgyBt\/AO+8\/nvQ\/Mkr\n\/wGGfKKgbC5\/7icD9+584UhlxTpQ8aenwM6K58Deyo1g744Xi+DnQNWOjeDA61vA3p0vgeu3Bl3F\nFQxzjOb7QF4RyNbrisAxI5tDMrKEzKBCxVguAeXsS2Ck9wOw64XfgNbPdoJbXUe+A4Szy80PNQeL\noN5SiSuKmdy1dT3YVszm2\/u2gc\/eqwZtzbXg9JlGcK2v8xvI6bXzTVaYb3XK+cUS851uqaB4ugg8\nfinXYncgJtHiyhKXgL3nDnynxD8LWIp92zduq9q2IfpGscRV258H7x\/eDVquXAZtVy6Brps3wPXR\nESAOp+RIKvexPJTs1sXSPWJfiCAtPg2kWJzAt7lkBrvsR4ERryD5s4D352PlC49v37wO2bzxaVBz\n\/CA4eaYFvF9fA2pbmkA\/cXiRBitHp3RmqiabP\/bgt3SZ4s1YSBb6MWDCywE\/G1iKPTs2PLFr64al\npoZPQeu1LvBZ6+eg5nQTaBsmDo1KkC6+3kgal8KjFCvaVnpcrQQGfRJ0JbC0SAjdR78DjHl5X\/xP\nwG\/jxHvVvY0NJ5De8fEonicYwavN9x9H3RzxaabGMEhH1MRRREeVRTOflH4\/I5ZXtd8idHLE4xyt\nHJ96cJuBWJdTGvWkUYO5r9oK93rK258JZ\/\/KwzItU3ZvfR+sr+tgiXB4oeyicNY8RoAkgwREf1Ps\nCR7V2F0imck+M8SFuhuJE6daiq++SyxRfa9UVfftSSKKZ+vRpbvksl+7hN7ME8LI\/CkOFq8fM6F1\npT+9ypE0UpSaHqbaQOgXSIkco8XsCIbhbhq74+QgEfd9QEE0W198kDU+um5XZOEtYWzuAt0drh\/W\nW2q7ILjuhlDWyjdaCLe4Ql3x9mLs54h6fggoS+U3PdJejSxceFySXKoRx7ItFDdWP6iareviSnAj\ncnUnU6VXUFUGw02+qKOXKz6zEkhFsQ9k8YWKX6ypJI4sbJGmCi3CcAZHsqL3uwsjiO5caX7O2Nxv\nnCKT17YxobVXIWTt\/601V8qmOLF4VJouNNGD8ZpSpohKffOwyniRjSZ+t2p6iPxAah0UXjgmCGUP\nc33xI1RH4DLHG3moi+m\/AYaDu6HR07V\/AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/tincturing_kit-1338254002.swf",
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
	"tincturing_task_limit_upgrade"
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

log.info("tincturing_kit.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
