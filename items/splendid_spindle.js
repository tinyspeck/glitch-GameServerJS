//#include include/takeable.js

var label = "Splendid Spindle";
var version = "1355087801";
var name_single = "Splendid Spindle";
var name_plural = "Splendid Spindle";
var article = "a";
var description = "The ancients whispered of the spindle of Cosma that could spin the very fibres of air into cloths of heaven, enwrought with golden and silver light; blue and dim and dark cloths of night and light and the half-light. This is not that spindle. But it is really quite a good spindle, and it lasts longer than the other kind of spindle.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2000;
var input_for = [];
var parent_classes = ["splendid_spindle", "spindle", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "fiber_arts_1",	// defined by tool_base
	"points_capacity"	: "500",	// defined by tool_base (overridden by splendid_spindle)
	"display_wear"	: "1",	// defined by tool_base
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "500";	// defined by tool_base (overridden by splendid_spindle)
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

verbs.spin = { // defined by spindle
	"name"				: "spin",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Spin some Thread",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.instanceProps && this.instanceProps.is_broken == 1) return {state:'disabled', reason:'The Spindle is broken.'};

		if (pc.is_dead) return {state:'disabled', reason:'You can\'t spin when you\'re dead!'};
		if (pc.skills_has('fiber_arts_1')) return {state:'enabled'};

		return {state:'disabled', reason:'You need to know Fiber Arts 1 to spin.'};
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.class_tsid == 'fiber'){
				uniques[it.class_tsid] = it.tsid;
			}
		}

		var possibles = [];
		for (var i in uniques){
			possibles.push(i);
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			pc.sendActivity("You don't have anything to spin!");
			return {
				'ok' : 0,
				'txt' : "You don't have anything to spin!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (msg.target_item_class_count < 7){
			pc.sendOnlineActivity("You need at least 7 Fibers to make a Thread.");
			return false;
		}

		msg.target_item_class_count = msg.target_item_class_count - (msg.target_item_class_count % 7);


		var thread = msg.target_item_class_count / 7;
		var details = pc.getSkillPackageDetails('spinning');
		var energy = details['energy_cost'] * thread;
		if (pc.metabolics_get_energy() < energy){
			pc.sendActivity('You don\'t have enough energy to create that much thread!');
			return false;
		}


		if (msg.target_itemstack_tsid){
			// Where is this stack?
			var find_stack = apiFindObject(msg.target_itemstack_tsid);

			if(find_stack.container == null) {
				// This may be a stack we received from disambig, in which case it is not in the player's pack
				if(find_stack.count == msg.target_item_class_count) {
					var stack = find_stack;
				} else {
					// split it into the appropriate size and return the excess
					var stack = find_stack.apiSplit(msg.target_item_class_count);

					// Return the original amount to the pack
					pc.addItemStack(find_stack);
				}
			} else {
				// Try removing the count from pack
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
			}
		}
		else{
			var stack = pc.removeItemStackClass(msg.target_item_class, msg.target_item_class_count);
		}

		if (!stack){
			log.error('failed to find other stack - wtf');
			return false;
		}

		var count = stack.count;
		stack.apiDelete();

		while (count < msg.target_item_class_count){
			var remaining = msg.target_item_class_count - count;
			var next_stack = pc.removeItemStackClass(msg.target_item_class, remaining);
			if (!next_stack) break;
					
			count += next_stack.count;
			next_stack.apiDelete();
		}

		this.count_spinning = count;

		var thread_count = Math.round((count-1)/7);

		var add_duration = Math.min(thread_count, 10) * 200;
		if (thread_count > 10){
			add_duration += (thread_count-10) * 100;
		}

		var ret = pc.runSkillPackage('spinning', this, {add_duration: add_duration,  word_progress: config.word_progress_map['spinning'], tool_wear_multiplier: thread_count, ignore_energy_cost: true, tool_item: this, callback: 'onSpinComplete'});

		if (!ret['ok']){
			if (ret['error_tool_broken']) pc.sendActivity("Your Spindle doesn't have enough uses left. Try repairing it, replacing it, or spinning a smaller amount of Fiber.");
			var remaining = this.count_spinning;
			while (remaining){
				remaining = pc.createItem('fiber', remaining);
			}
			delete this.count_spinning;
			return false;
		}
			
		return true;
	}
};

function onOverlayDismissed(pc, payload){ // defined by spindle
	pc.announce_sound_stop(this.class_tsid.toUpperCase());

	var remaining = this.count_spinning;
	while (remaining){
		remaining = pc.createItem('fiber', remaining);
	}
	delete this.count_spinning;
}

function onSpinComplete(pc, ret){ // defined by spindle
	var produce_class = 'thread';
	var message_top = 'You spun ';
	// max_luck is not desirable here because people still need to spin fiber.
	// if (pc.imagination_has_upgrade('fiber_arts_bonus_1') && (is_chance(0.04) || pc.buffs_has('max_luck'))){
	if (pc.imagination_has_upgrade('fiber_arts_bonus_1') && (is_chance(0.04))){
		produce_class = 'string';
		message_top = 'The Giants have favored you and instead of spinning thread you spun ';
	}

	if (ret['ok']){

		if (produce_class === "string") { 
			pc.achievements_increment("spun", "straight_to_string", 1);
		}

		if (this.count_spinning >= 2051) { 
			pc.achievements_increment("spun", "two_thousand_fiber", 1);
		}

		var thread = Math.floor(this.count_spinning / 7);

		var remainder = pc.createItemFromGround(produce_class, thread);
		if (remainder){
			pc.location.createItemStack(produce_class, remainder, pc.x, pc.y);
		}

		var energy = pc.metabolics_lose_energy(ret.details['energy_cost'] * thread);

		var proto = apiFindItemPrototype('fiber');
		var proto2 = apiFindItemPrototype(produce_class);
		var rsp = message_top+pluralize(this.count_spinning, proto.name_single, proto.name_plural)+" into "+pluralize(thread, proto2.name_single, proto2.name_plural)+" ("+energy+" energy).";
	}
	else{
		rsp = "Huh, that didn't work for some reason.";
	}

	pc.sendActivity(rsp);

	delete this.count_spinning;
	pc.removeSkillPackageOverride('spinning');
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

function tool_base_onOverlayDismissed(pc, payload){ // defined by tool_base
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
	if (pc && (!pc.skills_has("fiber_arts_1"))) out.push([1, "You need the skill <a href=\"\/skills\/135\/\" glitch=\"skill|fiber_arts_1\">Fiber Arts I<\/a> to use this."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !pc.skills_has("tinkering_1")) out.push([2, "You need to learn <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !(pc.skills_has("tinkering_5") && pc.skills_has("fiber_arts_1"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/76\/\" glitch=\"skill|tinkering_5\">Tinkering V<\/a> and <a href=\"\/skills\/135\/\" glitch=\"skill|fiber_arts_1\">Fiber Arts I<\/a>."]);
	return out;
}

var tags = [
	"tool",
	"premiumtool"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-26,"y":-16,"w":49,"h":17},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFOklEQVR42tXY609TZxwHcF4u2San\n5VYotKUXLtIL0FIQEIMiYCtWnY6NOOumc6JmDG9MpyteNhlyiTi1LEIHzFsBO2yNSwSrZIAX2AEt\nOHSMzP0B\/RO+e55HYlyyt7RnT\/LktKcvzie\/87uc04iI\/8NqaGqqeTH\/0iZoZGNLKz87N+8QLLCy\nstLQerYtODP7h8ftvhMpTGRVle3chYuYnn3Ou91uYSKrtmytOe9sx5PpWQEjP7J72i91YDIwzbcL\nFbl128d8x4\/dmJgKCBO50mKRb\/tk+3zXT1cwPvmE7+i5ZhAcsrS01LBt+45gz5VreMRPBp09PcJD\nllkstu07P8NVdx\/GxnlhIsutVvvO6t3ovfEzRh\/\/FnR2CBC5xmpt3bVnL24MePFo4nFwKuC3v5gd\ncjwL+OyCQW7YtJF397rg9XbhwcNbCAQG8fz3IUxP+fxzcwKYPgMDXQ5XZwt+uX0Ffn8fRkZu4s+5\nkQXkLT7syNbmen9nZyt+aG9Ed3cbAtP38dfL8TeQvvmnT73hy896x75gS3M9vjt9BCSaGBzsxeCQ\nG15fN4buXsfYaD8CU95g2JCHD+2xHz3yOZrPfA3nxQbcJMiHD29jZmYYL\/+eYJGcfTaIByPuoLe\/\nLTzIQ\/t2OU6dOIiWJgeJIoncUB9GR33k2IvpmfsYHu4DP+ENbyQP7a\/2XDj\/HS5fvoj+\/g5S1d24\nd+8G+XwJYw98GJ8gFf7kNsZ+vRoMTA2Epw01NR33U2Rjw1fweFxwOhtw9y6p7NGb4CfvsBY0fN+N\nw0f3o7C4JGjKL4TBZF7YObzeaF5ceENdXaTjaC1Pi6bt7El0dbXh+nUnOjubSQvqxyXX96jY\/CEs\nG9\/HKksFCleuxr+RZuiNOTWLiqyr22toPH0s+O03h3Gu7RRamh3w+Xqwp6YaBcUlKLHaGDKvqBhL\n9ZnQpGcgWZOKZHXKa6TOZFrcl7WDtZ+uOEYq++TxA2hvP4OqLR9Am2lEdl4BO8YlSBEjiUdUbBxE\n0THgxFGIFIkRFy99hTSa5xc9H788sNtxov4gamurIVeqWaTolsrkiE9MYshYgowmSPEbyCRFMkOm\nZ2XJFx157MgXLnOuCdIkOUPSnZSshFSuQEKSDBJpImLjExAdJ4E4JhaiqGiGzDBkhQZIVxS5ML11\nLM\/Ilqs0LEo0gtosI3TZRijUGsQQZNQCMlWr50OC4zhuBb0gjRK9veq0dChTUtn3lAwtisusWLN+\nE3ILVyBlacbrvFSoUkPzj8Y7BEhzSypTIE2rJwgtubgGInIuSaEkETShuNyK8vXvwVxYxH6PkUj8\nIWvcFEhzSkbyjraUNJ2eRZAj52hhUKSOIFeWr0W5jSALiqDNNnpCOl0iOdE8LQaab0tp8usMLIq0\nSGhxyJJVJA9zsGpNBcpsG5FTsJw2a1fIgG9znIFGkcJ0BJmRSZB6AykEHWRKFWszFKmnSDJdytYR\nZP5y2gs9SqMxNA+7b3GcnBSLX5WSxnAZmdnkmMnyklQz\/xppNKPEso4gNyyMwBw+ZEi63uU4+xJO\n7JAp1Q6Ctaenv+p1nFjsio6VsD7JkGQcllYQ5LKC0CP\/c4lEJFXFPO2FND8NplysXruebWNevqCQ\nwZi4eIbMzMljUVy91kZ65WZU2nfwdXUN4UXSgmJI0rAV5OkmOzcfRSXl5LiMjL9sqDXprWF\/jSV5\naqPNPY5MG9qaEkmTp6NRoVJDpUnzRwhhLeG4GpqPsZIENscTEmWvkEplTYRQFklID53jtLrpgwVB\n8iKlkuXgPxAV7v3Q714WAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/splendid_spindle-1338250617.swf",
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
	"premiumtool"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"e"	: "repair",
	"n"	: "spin"
};

log.info("splendid_spindle.js LOADED");

// generated ok 2012-12-09 13:16:41 by ali
