//#include include/takeable.js

var label = "Dusty Stick";
var version = "1355086256";
var name_single = "Dusty Stick";
var name_plural = "Dusty Sticks";
var article = "a";
var description = "A special gift to commemorate the Great Item Loss of early 2012.\r\nBuild up the power of your stick throughout the day. When ready, release it in order to spread happiness to all those around you.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["dusty_stick", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "",	// defined by tool_base
	"points_capacity"	: "20",	// defined by tool_base (overridden by dusty_stick)
	"display_wear"	: "1",	// defined by tool_base (overridden by dusty_stick)
	"can_repair"	: "0"	// defined by tool_base (overridden by dusty_stick)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "20";	// defined by tool_base (overridden by dusty_stick)
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

verbs.unleash = { // defined by dusty_stick
	"name"				: "unleash",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Spread some joy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.getInstanceProp('points_remaining') != this.getClassProp('points_capacity')) return {state:'disabled', reason: "Your stick is not ready!"};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.setInstanceProp('points_remaining', 0);
		this.last_use = time();
		this.updateState();

		this.apiSetTimer('onRejuvination', 1000*60*12);

		var s = pc.location.createItemStackWithPoof('npc_bundle_of_joy', 1, pc.x, pc.y);
		s.owner = pc;

		var pre_msg = this.buildVerbMessage(msg.count, 'unleash', 'unleashed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getTooltipLabel(){ // defined by dusty_stick
	return this.label;
}

function onCreate(){ // defined by dusty_stick
	this.initInstanceProps();
	this.parent_onCreate();
	this.updateState();
}

function onDrop(){ // defined by dusty_stick
	this.updateState();
}

function onLoad(){ // defined by dusty_stick

}

function onPickup(){ // defined by dusty_stick
	this.updateState();
}

function onRejuvination(){ // defined by dusty_stick
	log.info(this+' onRejuvination start');
	this.setInstanceProp('points_remaining', this.getInstanceProp('points_remaining')+1);
	this.updateState();

	if (this.getInstanceProp('points_remaining') < 20) this.apiSetTimer('onRejuvination', 1000*60*12);
	log.info(this+' onRejuvination end');
}

function updateState(){ // defined by dusty_stick
	var state;
	var points = intval(this.getInstanceProp('points_remaining'));
	if (points < 10){
		state = 'empty';
	}
	else if (points < 20){
		state = 'half';
	}
	else{
		state = 'full';
	}

	if (!this.isOnGround()){
		this.state = 'iconic_'+state;
	}
	else{
		this.state = state;
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

function parent_getTooltipLabel(){ // defined by tool_base
	if (this.getClassProp('display_wear') == 1 && hasIntVal(this.getClassProp('points_capacity')) && this.getClassProp('points_capacity') > 0){
		return this.label + ' ('+floatval(this.getInstanceProp('points_remaining'))+'/'+intval(this.getClassProp('points_capacity'))+')';
	}
	else{
		return this.label;
	}
}

function parent_onCreate(){ // defined by tool_base
	this.updateLabel();
}

function parent_onLoad(){ // defined by tool_base
	if (this.getInstanceProp('is_broken') == 1) return;
	if (!this.isWorking()){
		this.doBreak();
	}
	else{
		this.updateLabel();
	}
}

function parent_updateState(){ // defined by tool_base
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

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_donate",
	"collectible"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-46,"w":47,"h":46},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAICklEQVR42t2Y61JaaRaGcwdeQld1\nVRvTSQajETyggggqZxA8cVIRCKggoBAOuvGICornQ7RDa2ISJ5nsJN1dc0jVUDP\/5heXsC9hX8I7\n37d76EpP1fyZIW1qvqqvdMOfh3et9a4Xbt36fzl\/fbtt+PB8pfTqNFX6bi8i+mLAOppuF1wWeenj\n61xhec4Zmh7T8PtrPlwexQrXZ0nmJBcw3AjYetxas5kcKk4MdvLPDuOwmzowqG8pd3c31sw90uFJ\nfhqXO37uZN3Dr8SGC785YIEZYbMJayE+qeP\/eL2B\/VUfn4kOsvS9p7tRLM\/ZuYBTVWYiAzjLT\/In\nm4HiRsrp+mxAMsnt0NSoBueFaOk8H3QVGBs\/HzZ1pkMWHOdmysN6CR8c68GAtrX8\/DjJabvq2aW5\nIby7WCpnE6OlfNpeXokN8l2td76qKlin+DZL+yziNTIvT9PIMxOl9bSTzyZG+ICji1+cdVBoPkmU\njPnU8IwoEQtY8MjWVTzMPkLE08f+7f1u6NVJPLQYtYJ8kLJKfrd6QyQV14ram+o6ZwMWw9FGEEO6\nFqSm9ViLWXhHvxTnWyGOLTJcPKDl3UMyzm9XcCZVI0wqsai4Ey5lIlZ+b9XHXj9JcU93wvzUuEqk\n764vV1XFq12f4WLLy5xuuLlnezM4WHHDaZZielSJxagZM+5e+EbkKK7q2Fm\/uex3KNh3l0v8k9wU\nn2OcxeW5ES7s0ZZzaVfpcM3P0vJXDe73p96aqz0\/zjbGCzsZW+nP1xvlQsZeXoyYeZ3iATYTFmQm\npUhP6XDEaDFm7UQ27ijsLPuQmDQgSV4Pjit5m6GVD7p7QlGfgQ27taHqKrj\/iHmyPs6PWmXlD89W\n2aM1bzkTNZUMygYwYRMuszo8yzuwOqdDp7gOo2Yxr5LeI+0ghrn3ITRyEVG5B3plQ1Ejr0cqaK6u\n7WylR5jzTXfIYZayP1ytYWdpAhkC5jC3YdwqRXRCidWYGWe5CZAPAZ1ChKCjBTZDE7pavsWgTsJu\nzQ9jb9GO4JgKky4Vr1XUl7pa7lQHdDVmYYjvFZ2WVoOlT4L0zCB2lz2YdMoRmVBg1tsLU08jmGkl\ngWpGLmXBmzMvFmdtuDiIlS93Alx32104TO2dm8mR0Fp8AGSoqlfmVFDvIgoUsokBnvbUmLUdsz4N\nsgk7FsIWuAfbYCST6x1sRdyvwGnWRtRtxU\/PF8E+TeBwZYy3qMUoMHZ+IzHA7mbs\/OGykyssjDBV\nAbSbWjml9F7JZmwrnG+HsZ1x4zAbwGp8UBiCSYcMQ5p6+G1tWAhpsTDdg6ebDvz9\/TIu97y4Oopj\nQCMhCrYh6ukjvdkMo7IxlE8NuyJeNdPY+HXNfw3X+uDOVxZ1E1Tt96HvbiBG24L5kJE7zU2WXp48\nxkbKXrKq63lTdx3WExqsP7ZiK6HGh8s55OctGLNI8N32DDVoMukajoImJnXEptqglT8QESPn5cRn\n\/ycFLX1NZdJDpT5ZfchKwgB9bXvBVnAPduBozd+pltWzVnUD8UU5gqNdKG65sZHQQSevxfx0L6bI\nwOxmnEj7pPAMSPh4wMBFPGroFQ3FqLePk5FtVbV+7JPf7+yTiUoz4z3cZnKAz0RMHPm\/7CVGTcun\nld\/D1rwZ\/T13YNPexdpMO5KeZsy4WpCfk+P7dSvO85NccsrIjVrbCxFPb7GqlkOXPbEHzmluZWbJ\n7iU7GAGHgniklKgoLgacXVxwrENQz6ysQ8TVhP2kAuvhDiS9zbjIu\/CqYMPL4znsrnhKzIyxWPVk\no2y7W6SmO6Rv5ga0EpaAGrw2WdFuauNpf\/lsEuKPzXD3i4RLIY\/S3cKloH95kcbh0jCOM3oSx\/qr\nC9jZVFeSt\/y6qb12FfO2uIQ\/XW9yr8\/neRJW+SlXF2ckg+MfeoDJkQbMjYlxPK8UbiEuJ9tHi+st\nIzZiWraqgDTd\/Coniutcl4cJlN7tFK+OEixRsZwOmvi1x8MkQPxc6lHTfYRdDxFyPMRZpke4BykF\nXmxo8Sqnw2FKUf0yVw71sHeXK\/zZVrjks6m4frUESqJwOqgPzfq0vE72TZFCOvT3EHeLBSUp4Pli\nj9CbF6tqvN4y4ElGVTyNd9d8FsiPH09rfrrKMsW9KJtNurC\/4iuRLVMatXbw9H2trJapQNJBSXgk\nOGVUwqXlprDXeT15VpY\/G2TltD+8LXyLU5NpV8tEZWXLHWHnamS1LgppJfZDlVzwt\/4CmYt2Cr1J\nIYsrfZ8fsnLk\/0rjlef\/BElLTv2y0pe\/KeS\/nwqkQXFbGBwKebygxPlSLwm+rULJaV9eZTU3B6mV\n14rI8PCfQh6kunGxphYgacmpqi82teW9uFx0o5BUTeqV849aBPWeZTWIT0iwEpQKkM+zGv67JdWX\nAZnyNZN9LSNT3StsH\/pMy\/8yp7tZSGJDXMXQqQ1R9SgYNfYZ50PsEGWLy338H7ZMNwPZ3f11jVb2\nTflTr1ycahMgwwSQ7nM65eSZv7Ge\/BRySP3tLzZEtw0tN7UmavCFmJw\/SChcNw5Z8cqQvRHbMRlm\nR8WCNQWGHwiJ6IYha9lKngwSQJfxPlampQRYIoQPGoQLCSX+8cZ\/M5D0VEIGVY1CUiiq3kKgAyeL\nerzft+CHAzN\/o7\/efgrptdbDpruPy3Uj2F0jLomp\/3jQX7rxn5grkPS+PRjCj4f9JJ7pBUjyl7n1\nJRy6v+363+HDfj\/ebBuEQEFCBnvrSzrP8\/2u\/YQCR\/NKnqzAwun6z0Hin3cn1VETRua+AAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/dusty_stick-1339722231.swf",
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
	"no_donate",
	"collectible"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "repair",
	"u"	: "unleash"
};

log.info("dusty_stick.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
