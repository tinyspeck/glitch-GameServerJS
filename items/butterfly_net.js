//#include include/takeable.js

var label = "Butterfly Net";
var version = "1355086256";
var name_single = "Butterfly Net";
var name_plural = "Butterfly Nets";
var article = "a";
var description = "It sure makes catching Butterflies easier, but at what cost?";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 150;
var input_for = [];
var parent_classes = ["butterfly_net", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "",	// defined by tool_base
	"points_capacity"	: "100",	// defined by tool_base (overridden by butterfly_net)
	"display_wear"	: "1",	// defined by tool_base (overridden by butterfly_net)
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "100";	// defined by tool_base (overridden by butterfly_net)
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

verbs.attract = { // defined by butterfly_net
	"name"				: "attract",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "The Butterfly comes to you. Costs 10 energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.isWorking()) return {state:'disabled', reason: "This "+this.name_single+" has become broken, and must be repaired."}
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		function is_butterfly(it){ return it.class_tsid == 'npc_butterfly'};
		var butterfly = pc.findCloseStack(is_butterfly, 500);
		if (butterfly){
			butterfly.onWaitStart(pc);
			butterfly.was_attracted = true;

			this.use(pc);

			pc.metabolics_lose_energy(10);
		}
		else{
			failed = 1;
			self_msgs.push("There are no Butterflies nearby.");
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'attract with', 'attracted with', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
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
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-55,"y":-25,"w":110,"h":25},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKe0lEQVR42s2YWWxbZRbHeZuR5qEP\nM+8M0JXCpLQMU6C0oSW0HZAqIRAVyxTaTinQJg2Bpkmavdnj2nEcJ04c24n3G+\/29W7fa1\/vcXxj\nO7bjLY7TbAwtEWo1D3355n5GHQkGBqkJyycd+SZK5J\/+55z\/Ofd75JGf+Uybz58isSp+wHwec2tP\nlwJXvY05lG\/RSaz6zCO\/xrEhr2ybcVxq9qEfFGQjxwDv5guA0bq\/FPSW\/eBm8zOl56mxCmCUvLEh\nZB4q+8XgIs7LRwLmcyWw\/sZ9oO3a4Tu0\/supPkZroLnvJlrV1Kqp6+rVN\/W0m7s73kqJWS8BEevI\nBqf7wLafHc5v+qDZhrxZUqej8ehGW2d18PP2Ti0MJpfngIA36ExT9+CwpaWPjrZQP7Noby9Ahdvr\nnw+Un\/7gzz8bnA89o0Y4R0FH7b77zW0Xwt2DbEs7BdPPGbUxuXwHY5RnYY4LTM00hpo2xkXre\/uV\n3UMj+uuddeho70HQ27APfNR0pfP9moZDWwqWD9duI3TvqCcGXgQ3ml5fgUpBMBijIpmrrruXAhpH\nG2mMqZ4RrhIGgzeh4soVKHyu76NLmT2vLTNaD4CqL06hg0rNiMZsf3nLAAn9u\/zhrudAd\/fHCZhK\nWGMQsrajR3O1s2uKwZ\/UDU6KNbwptf6mYEIuUGl0bawRIUskVfRx+bK+MYGcyfhHHJZFbfXBwpST\nkOJhUpXNZn+3aTiL\/MQZCNfY8EYaKgbBSjXX1kkpNaobEIi0DL5QyVdr9FKD2TAwKRExhTKRSG9U\njSq0CE+tU3bzJoS9g3U21o1nQd2l3UDrCSLuaNwWTqcPbbJbPyrj9j+\/0dV6au2BcjB6hjjmTtaw\n9nofQ8aWyDTtI2PCAZFULEbNSqXDpeMbTDIFhqsnjBaZEnOrGTLFBI1Viw207Qc1H+0EeDRuosJm\njybPbU492ZsYbIjq6\/UGWGs9LLa1gzlk6mWPoWMIYuYiSgNbplBKTRbtmNog0bp9WsThlo3oUC6C\necQjBsu4AvchUjshHx46l6VT3lhzYSdwkHNmb3IeJ+bz3Q8Nl\/Q2PApNtq35dGyAy8da+ummMYmM\naGex0QbagKKFNSyXGi2mvgmpUOZwqgSoVaLxBKfsZEyrDYalKn9YLHb5x9WBiERgc\/PYPeV32z5\/\nEjTVHr\/jn8\/izljSHskVOA9vKfr3qqB39Q12eZi8CZzGGceaaAzjiARxsMVyI1OCqCZRk37Kgeuh\nQuYwqZ3APGPm2YTcOpeSaWYSPHw+N2VLZBHm0MeRwVL97QJdN95d8adzbgrQEZjPDm3KkGHXdbLY\n9mtdvaaeYQ7ey+FaB0USi9xodbIVajUdUYoNvpBh3Izx1dNRCTqbELuyRcRXXJHbc8VJX3ENsUQ8\nRjhtehvKwGcXdoAJZGg2kFkg3MmMyxpN9D80oEv9ZjNUsHOI7WQKhARTICLGFUp3G5urpovlGg1O\n2OU4obeEoyZ0JoYY4\/Nyx\/yi1L\/8LyS8dkfuvvWlMPbV1xZ654lvhrufAw2Xd4GrlX\/7tzuddwRy\nRa8rmSGs8fmLD78MyE80q3nHQHP3Vd+IWOav7aGZh6QIJkQtOF9nNBkCQWzYYJXyca\/QOpdWKaPp\ncdetdZFv5SskuHZH4V69LRYLKtfhBGmu3gOunN8BRGpO3JXOOyEgRilom517eJuxyY6fMkuOA97I\n2eX+MR7BU2iCA0KpXWaxE\/0ShXrSiusRX1At9IZFRG5Jr88s8oLrd6YCFJxn9bZsdPRcdpz2fAnu\ni4s7QW\/HOxtEbtHxLeCi15VIOzZt1PrJig0V7\/h9Oo8TFKi0oVYO18RHLU6JHbdJXR6TjepEJByb\nsuWWVKbCGt+3\/jWC5\/MaRHpl9QFc7Sc7wWcX\/3Lfk0r4icyig2ocLLKwFHLMpa5teooYpG+jSu5R\nwBk6vdbOGceFqMkvstjdDKVOzzY71LpwzKSaTSrxhVt698ptmdmv809y3viG2XYANFbtLsFVnt0B\nNDga8C8s4e7MAhZaWPJ50jmPOpXa\/FaDOkdvIpxyIBk6DLjMk3dvDteTA4jaKncROOIL2QyROYvA\nZtCNcf5ZZHSW34VgrTVPfgeOJ6ElYGrJ4qovXLgVwJMZzJNdpG\/JkhAorr6vkpy5rRo\/CtjUPOb2\nHwTDPS\/eH+x\/7fZA7+tf3Ww\/fA\/aR+e1p0H753tLKYVwsOYgnGiKmQkVll3k0qpvZnHZjydzmHOO\nmiALy1uzXZsT2b1O7dl7Gv4rgNXxHGBQqzyr41kwQClFa3oGfB+u7tNdJa+DNacwCFIzS6tuqJ43\nW3B5MgtubC6D2xLpli1bsyzSk3Sd4BUgZR8GXXX7qC\/fBRqv7C3F9conQf3lPeDap7vB1Y93lWwE\ngvX3nf3SEY\/hEAyGP7fojhSXgxAOS6RtwVTqj1vzUkTZjH6iAsiGj4C+68+AxqvH7kmUA8nW+op7\nVed2lFIIo7nu5B32UPW6Nz4Tja98GUyurc\/AlPpzSzhsCKoxcNi1MLWuRKpmS+Acyr8\/SsFtyEfK\nqZei\/aCupvyudjpk0cWSajSe1pLLa148XbC4s4s2Il+0hRdvEQ8CqkWBeeAnNGQIF4aAsaRzy9RD\nJytI2L2D7X8FlR\/uIHkm7XvUtLBO+mdkRKaAe3ILmCGa1FH1ZIEqQSBYZ\/A5kC96IVgwu+j3pfO+\nWHGF9KSy\/tlC8eKWwBlFFXTF2MsAbtFXzu8kL1x4fJtqOvqUPhw3GciE0Z1ecE0FSQ003NDikjeU\nX\/LB7oT24UpmXTCVMCAcZeSuYHYhTC0FbvPM3PbNd634eBU0Zh79BQhX+PTcY4\/C38\/kigd4uE+l\noxYDB\/XlJjJpc1JFb5+bx+BMDWYL\/mCuEIRQlAn7\/fO5gC+dnSaSmUAgmw+bZ6LE5uFkr5apxl\/e\n4NNfBFc\/2bNx6exj\/\/Uqkcv3tHaatCHeaZOYCOiNszGnI55ywdRBGH8mH4Kf9liSgGqFMvmIhYy7\nIZidjPu8iVTlpq8x1LyjG\/AGoO7SHnD5w+1HvjOTg5EyLrUcqPzTDoHTo0M8IbOdAvGmMsEgpRA2\nl\/JBICye9E9n8rOeZDqMx5JBGO659GebVo8yYhKOs6bqp6imeOJ\/LntYZudelTfkUHgCNn0ogqu8\nQQc6TbqwWNIfTOdICAKVevAJlbNGYq1YOLx703CUEdOl7COgo7YMXD67g\/+DWw2loDUS9yo8IZvG\nF8YskagHwkTyxTiEgeFJzIccsaRJQ8bekYTTf9qSjjVMHDsDjZjZ9mzJTn7s7xRE6HFTmCRgoCES\nhyrBVEL1IFggndeaoulj\/ELh91s2xgyTFXQ55XVjfQfhmNp40LE\/6o0hEjHORN0mSr1IdiFWSmd0\nzuKMpyqj6+t\/2NK7FlRYwZ8aLQdcaqn84uJuamRtb\/6p\/1F7w0\/oAzP6UCZHQvWol+4BYja1c8tv\nqEziV\/nQiOFFUGPV3v+b2l\/8WCQnzkAjnmQeKm0klR9u\/8nU\/mLHKjl5BBqxcPAl0FLzVGkT+b7f\n\/apHNX4Mg0bc07Dv21XpB\/zuVz205v2Frrqy3yYcPBTUKVhzv0W4\/wC7hqNIYLxCygAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-04\/butterfly_net-1303529956.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"t"	: "attract",
	"g"	: "give",
	"e"	: "repair"
};

log.info("butterfly_net.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
