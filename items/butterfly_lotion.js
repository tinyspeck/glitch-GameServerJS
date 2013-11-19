//#include include/takeable.js

var label = "Butterfly Lotion";
var version = "1355086256";
var name_single = "Butterfly Lotion";
var name_plural = "Butterfly Lotions";
var article = "a";
var description = "A tiny tube of butterfly lotion, without which a butterfly cannot be massaged. Remember: butterflies chafe easily, but they still like it pretty hard.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 10;
var input_for = [];
var parent_classes = ["butterfly_lotion", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "",	// defined by tool_base
	"points_capacity"	: "5",	// defined by tool_base (overridden by butterfly_lotion)
	"display_wear"	: "1",	// defined by tool_base (overridden by butterfly_lotion)
	"can_repair"	: "0"	// defined by tool_base (overridden by butterfly_lotion)
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "5";	// defined by tool_base (overridden by butterfly_lotion)
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

verbs.taste = { // defined by butterfly_lotion
	"name"				: "taste",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Lotion is not for eating",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.is_newxp || pc.location.is_skillquest) return {state:'disabled', reason:'You can\'t taste this right now.'};

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("You tried to taste a little but you ended up tasting a lot! And now it's gone! Oddly mood enhancing though.");
		var val = 12;
		self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		// effect does nothing in dry run: item/destroy

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("You tried to taste a little but you ended up tasting a lot! And now it's gone! Oddly mood enhancing though.");
		var val = pc.metabolics_add_mood(12 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}
		this.apiDelete();

		var pre_msg = this.buildVerbMessage(msg.count, 'taste', 'tasted', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.inspect = { // defined by butterfly_lotion
	"name"				: "inspect",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Seems like normal Butterly Lotion",
	"is_drop_target"		: false,
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("This'd be great for giving some lucky butterfly a nice massage.");

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("This'd be great for giving some lucky butterfly a nice massage.");

		var pre_msg = this.buildVerbMessage(msg.count, 'inspect', 'inspected', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.use = { // defined by butterfly_lotion
	"name"				: "use",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "You <i>could<\/i> try it",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isWorking()) return {state:'disabled', reason: "This lotion is out of charges."}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];

		self_msgs.push("Nuh-uh. This lotion doesn't work on you. Only butterflies.");

		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		self_msgs.push("Nuh-uh. This lotion doesn't work on you. Only butterflies.");

		var pre_msg = this.buildVerbMessage(msg.count, 'use', 'used', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getBaseCost(){ // defined by butterfly_lotion
	// [0% of BC] + [100% of BC * current wear/maximum wear)
	return this.base_cost * intval(this.getInstanceProp('points_remaining')) / intval(this.getClassProp('points_capacity'));
}

function onLoad(){ // defined by butterfly_lotion
	if (!this.instanceProps || this.instanceProps.points_remaining == undefined){
		this.onCreate();
		if (this.count > 1) this.apiConsume(this.count - 1);
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

function parent_getBaseCost(){ // defined by tool_base
	// [20% of BC] + [80% of BC * current wear/maximum wear)
	// This was producing issues with tools like the gassifier that do not have a points capacity
	if(intval(this.getClassProp('points_capacity'))) {
		return (this.base_cost * 0.2) + (this.base_cost * 0.8 * floatval(this.getInstanceProp('points_remaining')) / intval(this.getClassProp('points_capacity')));
	} else {
		return this.base_cost;
	}
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

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from an <a href=\"\/items\/1000002\/\" glitch=\"item|npc_streetspirit_animal_goods\">Animal Goods Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"herdkeepingsupplies",
	"animals"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-8,"y":-34,"w":15,"h":34},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHOElEQVR42u2YaXRU5RnHg1YiYKvW\nYuH0dPUgrS2bSqw9oj2WU9ZAQgxL4eDRIqZCTFmCWNCwFUJCgqKQxawYDiSQ1GwQtgSNxASSzJJt\nksyemSyz3Ln3zp315ubfZ4ZQ7cd+mIEPfc75n\/kwd875zfP\/3\/d53zci4n8sABPA9v4KrGYhUlIe\niLifCuicCFb9qmTTKv0WdYfL1Bl9n4BR11zd00W7+gPRonYKpk44dDI4tO3XWGPHU\/cWTtfwMNk5\nX7Jry32WfnDGcTgSo5VZOYNiH1pbH7o3XeN7nvBZNetFm1bttWjBD\/aCHSBAveJbSJ1Mzmjbwmt1\nQ0rK97wW9QzJoftYZPROr30AgtUA57AGnFkFspXg5OOQch9rkBU7h9qnhqdzls5HwBtfluy6dtFh\ngo+zwsNa4LKbIVj04IfIZlM3HAblf7rI6uQmTiffHnKr4dJPlxj9FslhcEq8BaLXBb+bh9dpJ8hh\nghyAcyRgdR9Z3UX2ymGU34LschO+qWq8Vl54bn4gGqGBs+l+LTHa\/DF2AGMeDmNjYxgV\/UFIn4uD\nl7fC7RiCy2YkSE0wj4aO2yg68C9s+MV5rJ1RJCStP\/Ixb+79UUgAJUZ3eIw1imM+FwIVAJQkCaN+\nL\/weAT7BAQ9ngZsxB\/PIDPSi9vMq7H45FxWvdiDjpSocTcjr5HSKdSGxmoL1NHlZT2xujFcQcnQU\noo8g3U76miGrR8ANG3D7y0akbclDwYKvoFntR\/4fG5CZnEV5lH3hNMh\/G5plBZhBUGfp0\/7fkCLc\nghO6Pi3kN5X4supr7PpbGqJnJuOLhUrcWKrH8UXlOLX\/M+hlzSOsXvYPRtP6aKjWv8dJ6STTdyHN\nOgZHtlzCnuizOL68Am\/NTscr07Zi1+wCHHy2FLsWnMLR14tQdqwa6pbmVk7fsSx0LwwwibSDwOR3\nAXuaOayZ0ojiF5VBS2v\/3I1FP9mOqKl\/RfZL16B6zY2zr7Rjz+ISXCm54uMM8hzPYPfPQzlJJpJW\nEFx7AFLTxWBTVDk+fK4UhZS7jKhKJD2ThT1RRSheXY+bCf34NKYKhzbl49alG4EF3ER5fAcDTZNC\nCRlJWklq5XkBNZU3sX\/HGSStz8DmqGNojh5C\/Ro1LqTU43pZPc4VlqGp7ios\/W3BBZzTy+p4vfJF\n+v0DoYR8mBRDunXHbgnKVi3S4quhiGFQGSNHdWojeM3g+CikeR3cUARHoUBT5ihNp2mh3jgEMhlD\ndrcE8mjs5ZCTcBvptPadWluDzgIagSoLjUKa10NqWrFUNAo77oxCvaybNcrXAP2RoYacTIolNXuE\nUbQ1GJGbVo2LWU0YLnPC2cnQlDFBGCHYwX6wWhWYHhqHvYrArD7PGG\/\/LhxbsCmkuEAm745CV7cP\ntnNeAmQhGC1gb1nBNFhhv2qBrZZEf4Tp6rQS5Hu8qeWJcED+gLSBpAjk0a0SYS3wg6l2g7kowFbu\nAlPHwdFoha2Cg7XCDruil+xWtLMG5cKQvjDfgXyMlEBdVPtHRsHd8JO84Ftc1EkHXOYh8Doz7LUO\n2C6PwKHqgaOr288oVTmsSvXLcO24p5K2SX5JLfIi\/LxnfGvGwG0nq5sY2CibTNMgmGYjrJVke7N2\n2KFWvgGzeXI4If9Oux61dHdr5uQgqFjYLrhhq+TB3LDBWsrDWs4ErWYNiuucUR4VFqvHIZ8kJUvS\nqHFU9ME77IajzgNLgRe28y7YLxJsJQv7FQsYZR+dBBVuh15+SBjp+HE4D1jTSHsJcsg76IPjshf2\ncg\/YRupgHQ\/bWQH2GoasHoCjrwusXqHVKRpe\/7oy\/\/vhhPwZWZ0uukW7d9ALt0EA3+akLrrpLfcG\n8+hoGyC4Hti07bhYnt1Zkn94d8Xp9CfDd0wFngKkzLFR0e5zuMG3ksUX7tjNXGfA6\/VgjN24XlOE\nzNR3kXPiffOZwiPxZWWZk8IJOVOSxFzR43O6+jxgKgnusgBBZwE3pMW1mtPYvXMNEt5aiIMfvInC\n7ANflZWkzgIiJoQL8kHSPMpjqSj4fB6zC54hFk7rIC5VFmPbu3FYGz8f61Y\/j60JS5BxeKv3888O\n55UVpk0LZx4fIv2BzjN1os+DYZMGpWdOImHzcqyKmUeai\/i4eVi\/7gXsTIrFJ8e2q\/M\/2jsz3Fcn\nE1u+ubqvtrrEmfXpPiRtjUPsyuewbOksrIyeHYRcHfcsNv7l967dO+KTU1M3PxoR7jpzOjO6KO9I\n+\/G0nUjeto46tgDRy+aQZiFmxRzExc5D\/Kq5x99YO\/+n9PiEsAPm5KRMLs499E5e1n5N6j8Tkbgl\nFq+teiHYxRXLZ7tiVs7JjoubO4MevXcXoSdPpjxSnHswMfuTvdoDH76NzZuWIjbm+ZuLFz+zYdGi\n30ynRx685xegeZkpPyzMOvDmRxnJGe+\/t\/HtjRv\/9PSSJRGREfdTnTiRGJmevnNKYuKSyHuSt\/\/X\n\/Vr\/BnYQl2F5s8X2AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/butterfly_lotion-1334602033.swf",
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
	"herdkeepingsupplies",
	"animals"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"n"	: "inspect",
	"e"	: "repair",
	"t"	: "taste",
	"u"	: "use"
};

log.info("butterfly_lotion.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
