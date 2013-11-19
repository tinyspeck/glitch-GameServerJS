//#include include/takeable.js

var label = "Fox Brush";
var version = "1355086256";
var name_single = "Fox Brush";
var name_plural = "Fox Brushes";
var article = "a";
var description = "One finely crafted Brush for the grooming of fantastic foxes and removing fine Fibers from their bushy tails.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 200;
var input_for = [];
var parent_classes = ["fox_brush", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "animal_kinship_2",	// defined by tool_base (overridden by fox_brush)
	"points_capacity"	: "100",	// defined by tool_base (overridden by fox_brush)
	"display_wear"	: "1",	// defined by tool_base (overridden by fox_brush)
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "100";	// defined by tool_base (overridden by fox_brush)
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

function canDrop(pc, drop_stack){ // defined by fox_brush
	var ranger = pc.location.find_items('npc_fox_ranger');
	if (ranger.length){
		return {ok: 0, error: "No littering in the Preserve"};
	}

	return {ok: 1};
}

function canGive(pc, drop_stack){ // defined by fox_brush
	var ranger = pc.location.find_items('npc_fox_ranger');
	if (ranger.length){
		return {ok: 0, error: "The sign on the Preserve entrance said No Trading!"};
	}

	return {ok: 1};
}

function disable(){ // defined by fox_brush
	this.setAndBroadcastState('blank');
	this.apiSetTimer('enable', 2000);
	this.is_disabled = true;
}

function enable(){ // defined by fox_brush
	this.updateState();
	delete this.is_disabled;
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
	out.push([2, "Grab the Brush from your pack and release it on a Fox to brush its Fibers!"]);
	out.push([2, "You can use this, but it's much better to learn <a href=\"\/skills\/134\/\" glitch=\"skill|foxbrushing_1\">Fox Brushing<\/a> first."]);
	if (pc && (!pc.achievements_has("fox_brushing_license"))) out.push([1, "Brushing foxes requires a Fox-Brushing Permit. See a Fox Ranger about getting one."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1159\/\" glitch=\"item|npc_fox_ranger\">Fox Ranger<\/a>."]);
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
		'position': {"x":-22,"y":-36,"w":45,"h":36},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJXklEQVR42u2Y6VNUVxrG\/Q9IRqIi\nIntj09BNs8rabM1OszRrs7QIgowgCqIkRhlEjRojuI4QCSoiCAKCAqJoG5dMMkNEZ6mpzIfhy9R8\n5U945jwHut3CKJnMpKbKW\/XWuff06fv+7vMu53avWPH+eH\/8nx53jwTYTbcEm6dbQixjewNnrzVq\n0VWjnm8rV1oOlyrMB02uzr8Y3L3W4OahJv85QnVvV+NMlQqnK1U4tcUbxzZtkHa4RIF9ee7dx8uV\nzk\/Hy50fDhTq7l8t1M2Ml9fd6ytotvSZmh8NFTcPd2bp7lzO1d27YvrPH+jRkQjNg0PhlsnfhOJi\nnZ+0kwLq87INNrCX7YDJE005bjjXFIp7VwvwuxEzpq8WYvJSPmZulWP0ghEDZzPFnAlPRkqbfzLY\nzJF4O8vhyLZ7hyIwdSAMY\/uC0S\/U49hTr8WJzUobVGuRJ1oE2Kf57hLOamcbN+LWVzkYE1B\/uLkZ\nd68UoPvzFNztLYCl3yRAjfP\/fHpw+Sr212s1fbv85gm0lPXU++GogHsd6nU71RiKJ8OlQrECdBxK\nxHRvPm52GfHbg4l4NLQZ1ztLRpYFN7AnwI5wJ8qV0GtWIjXgI2mJfvZI9rdHTborTlerJWTfLi3O\nbPVdEq4xyxXVyetxZm8U2vfHobc9HV3HkuV4v68Qz+\/UoqUhBssCvLbLr7lnpwZ1aS7Ykb5gxdHr\nkK1zQl6SJ0qyVKgs1OBEXZCEHP44EKerfJaELItbh+KYdTi6W4dDu6LQWh+Ji8dT8fB6BZ6Mbce2\nUn8sXz2RX\/UZLvLmxmhnFBmUMBt9UGv2x\/7aMOnkZHM8Bo7FL0B+EoSGzAXFCNWQ6YK6dGdUJjoh\nJ2wN4tX2MEQ5y++fPZCIZ3d24PupBtRvCVkmYKNWR4f78j1QELkWBSkKqVhjZTA6P0vEpS9ShQO9\nDNPkpVyR9PnoadFJyM5tavlAVssLd5BgcX6rUJCswG5xj5ELRXg+3YjutlzsLA\/Ex9Ub8etS7dyy\nioPOqtLcUVuqRcvOcAyfz8TU5TwMnc\/C1ZMGjHRk4U5PHvpOG2ygg82hEvKAyQulMY5IETkb7bMS\naRFOqMhT45woiL9YdqPvnEkqRvu0JlRGw9\/bAQrHDzRvhWNj7W1Ps4x1ZYsELpDqsEUQbPRLo00x\nntMIeaMzG+daE3ChNX6xsrUSLEYoZ9S7S4ipK6V4NFIji8EKR6OCIWpHKJztha2c+7eQT8crMqZ7\nTfP3rhbh8fUSCUbnd3rYrwplaxjvzsHExTx5TbjhjmxhRnw9UIJH14sxeixWQlYbPNFQEYiuo0mY\nmayV4XwZjFZo8IZasXoRzmorRzzW2evegPt+vKJZGGjsV\/f7TPhm2Cx3gAfXTBJs6nK+BGdr4Dmh\nuJ47A9dQcT7UREeGUFrsHjc2\/6hqtLQYj9fAXpjn+l\/VuTp8sNC4Z+5W2ok9csQKZzWCEUQ6FIp9\ne2MTHg+VSNUs\/UW2db8fK5NqEo4hvyFs5lYFnt\/djokrFW+AleWqoVU6wMvFXhqBNF4OrwBucP1I\nQNq3LQAKODqhCnT43eiCQxZE3ymDyDeTnGf4bou5h4MlNjhCE4yhZ7GwcGbGq\/DXh01ob0l9Bax2\nUwASItzg67kGQT7rEOzrJMeN6vUIUq2Dt\/sqG7BarFG5r7asmLpSaLY65x7Jkc7YRnrbDeLaLBVi\n+G5fEioK+FfTYAGO++rgOSP+9rgJDwa3ikaswz5RmTXmF7kW5LtWKhWqcUakvytigtwQ5ueMcK0L\nQnzXC3OSyllVjPBbX7fi2e2tFjqz5s+1Mwa5FU1czJcQ3wgIVu3LIaXSDweL5Hp+7+tBcT1ULcHa\n9+txsCHSZoTTh7tKxy\/DpUVtQFK4AtECknNRAa5yPsDbUa5Vuq6ac\/vwQ7sVPzzaI52ybVirlWFj\n\/k0tVujjIbMt16gwwb67uQV\/mha7wO0dGO4segOMtqMsUITREX4b1spQEiR+owfSdRuQHOGFZAGY\nGOYpFYzwd4Eu0A0RWpc5H8\/Vs7bKfTBQNfLDw90iPJlSKRYBASYu5uC8eONgws9ObsXTyWq5of9x\neqdoGTuXhKI1bQ1BXKiLTTGrRQoIY7yPVC8z1hsJoZ5SRULz85hgt9n4EI82X481L1rMuRa9brTL\nhL9\/u0\/mj9X+fL8R\/3jaimd3GzDdX4Gxr4rRfzYXp1v0MgWONUUvCcYiYAFYwxm9mGssBINOicwY\nbxsklaOKHEP9XOp+tDmLPbV7VOwaE5fEbtGRKfbYhLfa8U9iJBS3KJNBhcjA9VC6rZJgzCdCcUwR\noSQIVQoR1crCyE3wFSFWSOM14ZLCFEu\/UXeIN+abXdkjBKRdO2tYEuzonhjs3RaO4gwVDLFeQiUn\n+CsdESiSW61YgwShBnOJYNFiZAizYlVIifSSeejjsRqmZA0M0Ur5mVRP62J56\/57oCZG07ZXL9pF\nKi6fSMOXnyXL16jWhihsKw5AVYE\/ogKdoVE4IDbYXTqTT75Yicwv5hwdJ4YpZCjThVE5zmXHqRCo\nchS9bZWEoooSMNxzPiXsHX4BVuYG2G0y+KM8MxDVuSHIT1TLStMq18r+RBWCfZzkOdVYqD5nmwoM\nlUqow9yyhpD3o5I0FocIo60Jl2UE8AFGEiIUmnd6vao2BpuLUvxQkRWIyuwglKZpkSGSmYlOKCY2\n1WBepQoIgljDZK1E7ghUj\/dh3pnTRYMW4bQWRLGY526x0depOytGpVnW632lMXiEUFSvyhgsQfnU\ndLhRvQDIa7YGgjNkVJmQ7GscmXusWgLys4IktbxXjt5HRkDAWrZla5f\/yy07VumcHa9qswLyxhwZ\nKjpmzlEBXjO8BCUk1SFo3uI6KsWdgOcML9dxFOG00MdP\/t2bpffVMQetgIThyBDRiRWIIFSC6hCM\nsMWpfhI8Z3EdFWSo+V0xN58V753xs\/ydUZ0bpLMCMqk5bhaJTDXpmAVTmKSBXoSYUHwIthGe83Oq\nSXgaGzULwJSi\/fn+n2FuiP40x9xj0hOQFU0lrGEmLMfSdK2cixJqMTeZcwwlVRWgsylhXhn\/lT+F\ncuPd7AREt6jSOSsgVSQEex5HKshw5up9ZV9j\/ytJ01py9T51TJP\/yb9XVLM6J3ieqjDsBIryd5kV\nRdAcF+JWlxjqaTGJB0kIV5jlK9EvcRCyJF2ro+UnLLNnvT\/eH+9+\/Av7iXcKNwDCxgAAAABJRU5E\nrkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fox_brush-1335310429.swf",
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
	"e"	: "repair"
};

log.info("fox_brush.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
