//#include include/takeable.js

var label = "Smelter";
var version = "1355086256";
var name_single = "Smelter";
var name_plural = "Smelter";
var article = "a";
var description = "Extracting purest metal from even the dullest chunk of Metal Rock, this classic Smelter is the second step to creating all manner of exciting secondary metals. (Learning Smelting is step one.)";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 700;
var input_for = [];
var parent_classes = ["smelter", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "smelting_1",	// defined by tool_base (overridden by smelter)
	"points_capacity"	: "500",	// defined by tool_base (overridden by smelter)
	"display_wear"	: "1",	// defined by tool_base (overridden by smelter)
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "500";	// defined by tool_base (overridden by smelter)
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

verbs.smelt = { // defined by smelter
	"name"				: "smelt",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Choose metal to smelt. (Or, drag metal to smelter)",
	"is_drop_target"		: true,
	"drop_many"			: true,
	"drop_tip"			: "Smelt {$count} {$stack_name}",
	"drop_ok_code"			: function(stack, pc){

		return stack.hasTag('rock') && stack.hasTag('metal');
	},
	"conditions"			: function(pc, drop_stack){

		if (this['!is_smelting']){
			return {state:'disabled', reason:"You can only smelt one thing at a time."};
		}

		if (!this.isWorking()){
			return {state:'disabled', reason:"This "+this.name_single+" has become broken, and must be repaired."};
		}

		if (pc.making_is_making()){
			return {state:'disabled', reason:"You are making something else."};
		}

		if (pc['!in_house_deco_mode']){
			return {state:'disabled', reason:"No smelting while decorating."};
		}

		var has_metal = false;
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.hasTag('rock') && it.hasTag('metal')){
				has_metal = true;
				break;
			}
		}

		if (!has_metal){
			return {state:'disabled', reason:"You don't have any metal to smelt."};
		}

		var required_skill = this.getClassProp('required_skill');
		if (pc.skills_has(required_skill)){
			return {state:'enabled'};
		}
		else{
			return {state:'disabled', reason:"You need to know "+pc.skills_get_name(required_skill)+" to use this."};
		}
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.hasTag('rock') && it.hasTag('metal')){
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
			pc.sendActivity("You don't have anything to smelt!");
			return {
				'ok' : 0,
				'txt' : "You don't have anything to smelt!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this['!is_smelting']){
			return false;
		}

		log.info("Received msg: "+msg);

		var required_skill = this.getClassProp('required_skill');
		if (!pc.skills_has(required_skill)){
			return false;
		}

		if (msg.target_item_class || msg.target_itemstack_tsid){
			//
			// Rewrite the amount to something divisible by 5 (the amount needed to make an ingot)
			//

			msg.target_item_class_count = msg.target_item_class_count - (msg.target_item_class_count % 5);

			if (msg.target_item_class_count < 5){
				pc.sendOnlineActivity("You need at least 5 chunks to make an ingot.");
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

			if (!stack.hasTag('rock') || !stack.hasTag('metal')){
				pc.items_put_back(stack);
				log.error('chose something we can\'t smelt...');
				return false;
			}


			//
			// apply upgrade overrides before checking required energy
			//

			if (pc.imagination_has_upgrade('smelting_tool_wear')){
				pc.addSkillPackageOverride('smelting', {tool_wear: 2});
			}

			
			var details = pc.getSkillPackageDetails('smelting');

			if (pc.imagination_has_upgrade('smelting_energy')){
				pc.addSkillPackageOverride('smelting', {energy_cost: 3});
				var energy_cost = 3;
			}
			else { 
				var energy_cost = details['energy_cost'];
			}

			var energy = energy_cost * (msg.target_item_class_count / 5);

			

			//
			// Determine if we get any energy free smelts from 'smelt_it_dealt_it'
			//
			var energy_free_smelts = 0;
			if (pc.buffs_has('smelt_it_dealt_it')){
				var remaining_buff = parseFloat(pc.buffs_get_remaining_duration('smelt_it_dealt_it'));
				log.info("Smelter - remaining buff time is "+remaining_buff);
				
				energy_free_smelts = 1; 	// 1 ingot per second for the first 6 seconds

				// This approximates the time calculation done below, but is not exact because 
				// the remaining time is in seconds and the calculation uses fractions of seconds
				if (remaining_buff >= 8){
					energy_free_smelts += 1;
				}
				
				if (remaining_buff >= 9) { 	
					energy_free_smelts += 1;
				}

				if (remaining_buff >= 10) {
					energy_free_smelts += 1;
				}

				if (remaining_buff > 10) {
					energy_free_smelts += (remaining_buff - 10) * 2.5; // 2.5 ingots per second for remainder
				}


				energy = Math.max(((msg.target_item_class_count/ 5) - energy_free_smelts) * energy_cost, 0);

				log.info("Smelter - free smelts is "+energy_free_smelts+" and energy is "+energy);

				pc.addSkillPackageOverride('smelting', {energy_cost: (energy/(msg.target_item_class_count/5))});
			}
			

			//
			// Enough energy?
			//

			
			//log.info('Energy needed: '+energy);
			if (pc.metabolics_get_energy() <= energy){
				pc.items_put_back(stack);

				if (pc.buffs_has('smelt_it_dealt_it')){
					pc.sendOnlineActivity("After Smelt It, Dealt It wears off, you will not have enough energy!");
				}
				else{			
					pc.sendOnlineActivity("You don't have enough energy to do that!");
				}
				return false;
			}
			
			
			this.class_smelting = stack.class_tsid;

			var count = stack.count;
			stack.apiDelete();

			while (count < msg.target_item_class_count){
				var remaining = msg.target_item_class_count - count;
				var next_stack = pc.removeItemStackClass(msg.target_item_class, remaining);
				if (!next_stack) break;
					
				count += next_stack.count;
				next_stack.apiDelete();
			}

			this.count_smelting = count;

			this['!is_smelting'] = 1;


			// Smelting: Basing the amount on the output (and considering that an ingot of Plain Metal is 3-6x the base cost of Dullite/Beryl/Sparkly so it should take a little longer), 
			// I propose the following time addition for every ingot until the 5th: 2s, 1.6s , 1.2s , 0.8s , 0.4s - and then 0.4 s for every additional ingot. So 5 ingots take 6 sec, 
			// 10 ingots take 8 sec and 50 ingots take 24 sec to smelt.
			var ingots = Math.floor(this.count_smelting / 5);
			var add_duration = 0;
			if (ingots >= 1) add_duration += 2000;
			if (ingots >= 2) add_duration += 1600;
			if (ingots >= 3) add_duration += 1200;
			if (ingots >= 4) add_duration += 800;
			if (ingots >= 5) add_duration += 400;
			if (ingots > 5) add_duration += ((ingots - 5) * 400);

			var ret = pc.runSkillPackage('smelting', this, {tool_item: this, word_progress: config.word_progress_map['smelting'], tool_wear_multiplier: ingots, ignore_energy_cost: true, ignore_xp_bonus:true, add_duration: add_duration, callback: 'onSmeltComplete'});

			if (!ret['ok']){
				if (ret['error_tool_broken']) pc.sendActivity("Your Smelter doesn't have enough uses left. Try repairing it, replacing it, or smelting a smaller amount of rock.");
				var remaining = this.count_smelting;
				while (remaining){
					remaining = pc.createItem(this.class_smelting, remaining);
				}
				delete this['!is_smelting'];
				delete this.class_smelting;
				delete this.count_smelting;
				return false;
			}
			
			return true;
		}

		return false;
	}
};

function onOverlayDismissed(pc, payload){ // defined by smelter
	delete this['!is_smelting'];

	pc.announce_sound_stop('SMELTER');
	pc.createItem(this.class_smelting, this.count_smelting);
}

function onSmeltComplete(pc, ret){ // defined by smelter
	if (ret['ok'] && this.class_smelting && this.count_smelting){
		var ingots = 0;
		if (this.class_smelting == 'metal_rock'){
			ingots = Math.floor(this.count_smelting / 5);
			pc.achievements_increment('smelter', 'ingots_created', ingots);
			var remainder = pc.createItemFromGround('plain_metal', ingots);
			if (remainder){
				pc.location.createItemStack('plain_metal', remainder, pc.x, pc.y);
			}

			if (ingots >= 20) pc.quests_set_flag('100_metal_smelted');
		}


		log.info("Smelter - ret is "+ret);
		var energy = pc.metabolics_lose_energy(ret.details['energy_cost'] * ingots) + ret.values['energy_cost'];
		var xp = pc.stats_add_xp(ret.details['xp_bonus'] * ingots, false, {'verb':'smelt','class_id':this.class_tsid}) + ret.values['xp_bonus'];

		var proto = apiFindItemPrototype(this.class_smelting);
		var proto2 = apiFindItemPrototype('plain_metal');
		var rsp = "You smelted "+pluralize(this.count_smelting, proto.name_single, proto.name_plural)+" into "+pluralize(ingots, proto2.name_single, proto2.name_plural)+" (+"+xp+" iMG, "+energy+" energy).";
		
		pc.achievements_increment('smelter', 'metal_smelted', this.count_smelting);
	}
	else{
		rsp = "Huh, that didn't work for some reason.";
	}

	pc.sendActivity(rsp);


	pc.removeSkillPackageOverride('smelting');

	delete this['!is_smelting'];
	delete this.class_smelting;
	delete this.count_smelting;
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
	if (pc && (!pc.skills_has("smelting_1"))) out.push([1, "You need the skill <a href=\"\/skills\/80\/\" glitch=\"skill|smelting_1\">Smelting<\/a> to use this."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a> or purchased from an <a href=\"\/items\/1000001\/\" glitch=\"item|npc_streetspirit_alchemical_goods\">Alchemical Goods Vendor<\/a>, a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a>, a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a> or a <a href=\"\/items\/1000009\/\" glitch=\"item|npc_streetspirit_mining\">Mining Vendor<\/a>."]);
	if (pc && !pc.skills_has("tinkering_1")) out.push([2, "You need to learn <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !(pc.skills_has("tinkering_5") && pc.skills_has("engineering_1"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/76\/\" glitch=\"skill|tinkering_5\">Tinkering V<\/a> and <a href=\"\/skills\/92\/\" glitch=\"skill|engineering_1\">Engineering I<\/a>."]);
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
		'position': {"x":-36,"y":-57,"w":69,"h":58},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALB0lEQVR42u2YaVfT6RnG5wt0prM6\no6Ossi9ZgIQlhLCHLSTsDGsQZF9lBwOERWQJO4IsjoggjuIojNWxEzsdp+309PCmPe05bY8fgY9w\n9b4fTETFTl\/01L4w51wnJCT\/\/++57uW5n7zzztvH28f\/4WO0v8mhoaKgMC8taTsxKnw\/Wq18Gq6U\nmeRy5\/feKNiN5XFLT3PVnjHHgCxdPPTaSMSEK6CQecHf2xm+Ho6rbwwuI1mjrizKQHZKNNISIhCm\n8DuA8nQU8vNygtTHBVJvJ\/83BliSk4KMRA0M8eGvgAX4nYZC6oFgmefTNxLqDK1GbcxOQToBppOD\nMj\/XAzB\/NwEWIveCKsgXEUp\/RIbItqPl8vf+54BZyVEivGlaNaLCZAdgAd52sKhQGWJVAdBGKJCo\nCd5PiQ4xGSJDHA5f57u7K+pHXy8Vfru9YHpwa8F0\/+a8aXNpeHt5use6PN1rXWXNsMzW73dXrY93\nVi3rixfqthYu\/PsF6wkwTRsBA8EZ4tXQU5jjwgOhCZa8AJYUGYzUWJVwmUV\/rz7ZveZAN1v91c25\n\/QVLNxoq8lBenIGSL\/Qop7yuKc1BY2U+WmuN6GoqQ29bJQa7azHa14TlqV7cujKG7auW\/bVLA9vX\nZvodjgSki6htYPq4cKSyCCQlJgxJUcHQ0XNmUhQpUrisiw2j\/4WiuiTr6ZP7X+IruklKPLmfHI1s\nQzzyM5NgPAxYcRRgIyYHWzA30ondGzMgQFyZM28fCXixt1l9GCwtQYPGGiMKs3UCJDk6FFkpMQQb\ngkQCTgqWwRAkxUhrBa8e\/R3VKM03ICdNi4LMZDvgWQKsPmMDLCbAUjvg7EgHVmf6cPvqONYXhjB1\noRWZqbGm1wIymI5kIJfWrs5h9951zM8Mk6tqAWagFNBqFIgLkSFX7o\/vNi7jd4+2UFWSTRdvw7Cp\nXkDUlX2B2rJc9LVWitetNcVoqzOK1+11JeK964sXsLU6ii\/n+jF7sQOLlh50natEQXbq0YDdDaXq\ng7BRKPVabKwv2FVWnC1cY3cTCTQm0A\/GIBn+sWcVgPeuT+Hu+hSWJnvw5x9vCXHI+OY15F5pfhqq\njFki1AK8rQozw+0Y6KwRixkxNeKvf\/oNHt3dpFw1Hg2YHKNS20KZQYCTlkHMTg8LnTXmIIGKg+Hj\nqVDU1MTTJL7oSI7HYk+TgKMCwe7mNHY2pilkFtwkd1hNlQV2d6\/MmtFC7o2Zz+HSWJcAvL40Tt9d\nxqi5k1pcNFK1kZbXAAarGY5DqaOQtrfVw9zXjl5TKwpz9RRapajiGKrs0AAf+Hk6w+HEMRgSI4SD\n3++uCD2+t4T7W7P4+tqkKJz2+hI77NqlQeEyiwHN7VVYnbtAgKtU9blkQihi1ErrkYBJkSEmWwEk\nklv5uQaca6pGY305Uigv2TlWDLUbhdQTgf7u8HV3hj5BjR1yzgbI+vb2Ark5I2RqLhegLwNy5XY1\nloqqv\/\/VKsqKckADCTRhiqMBEyKVJgbjUCaQWyKkcWokRIUKsDh1kBA7KPc9DZkPy5XcDhchtt5d\nsgM+2n4O2Eat5d71aQFIDdsOyIXRXF2IZLrH3Y1F\/PR4F+2NVbi9sfR6QAY7CKXS7pgNLDacRY2b\nKtifwssh9vNwQhLlLd\/87vqkyMNf31l8AXBpwmT\/+8byRTvg\/GgnFVC2ALx1dRZ7Tx6SHmDvhwc4\nEjA+QmlisHTqdQmUi6og\/xfAYlSBIrxqpQTebg7wPn0KXiRtpNKeY7e+HMfXBGoDYrG7d9YmxP+5\n19kAJwZaRPthwM3lCXJwBz9Zd\/AH673XAQaZLs8N4\/79Tfz0+wdo66gVYF9RhVnG+zAw2IlUat5h\ngb5wd\/6cdAJuTicoD51wdb7fDsninGNY1uH3WTbAMdrmmqsOQrx2aRRPvt3Gk4e38QPpx4e31a8C\nhgeZzN0N+GZ3A\/\/8+x\/R1FRO+7AUT367KyAnJ\/tpK6MhIlQOF4dP4XyKdPIYnEiDXTXPwnzQbkTL\nuXHgHrcddpL\/v7Uy8gJgZXEmdFoNVqaH8Hj3BqysnU18983Wq4AUSlNxrg6rSxZcIcu7yEG1Uoq\/\n\/eVHWCxmbG4sQBsdRqH3o\/byMU4dZ32Ek599JIZbrlAG4B7IRWEL8eG+aAvxwni3ACyk8S4rNY52\nlGk8vHMND7fXhB5sr73arKPDAkycY\/T8THLhFk8yCdR+ctMTaASjFiPxxIljH+D4sfdx\/JP38dkn\nvxQ6k5cqbnx1fkBUqy0nbS2G4Vem+2hLO49xatQ9LeXQJ0YiUxeL9cUx7N5cwe7WCna2lsn95aMB\nXwajwZQkFaGOYFGBqBX+OPbRe\/jkw3fp+V2cIjfdXT4XhcOQ3D54x2BQbsYMLcJK1Tw11CqcG+qq\nFVsg5x9PQKuzw7izfklo+9ol+v7wU7qvw0uAMtNRYJpnYAKOhlYG\/PiDX4jQulGxeLieFNXs7e4I\nDX13YqAZG5eHRSO+SNvb+XNnRcUy2PD5etGca2lP5nz2dHOmc48buWrGzSvTFOopUTDVJTlIpwau\nUQU+z0WCMv0cWDiLclDi5SIaNfdCX+qFPgTHGuquEW6Nm5toajEijtqW3M+dFuAITxI\/e7vx553p\n+25QSr1o1wrB3GiPaDUTAx0i5DqamoID6D4+bvt2QImvu0VCq\/H3Ok0X9YDM153OIx6Uc14Iorxj\nMC4QFU0y3GpYvCezQuQsb\/voVJyjg5MDtSKXUyJnlbQ1BtPRlb\/D14lQSIQBUWQIT0dzIyZ0NJQJ\n1+I0IQiS+tC9vSD19XjeE+nNvUCJN8F50mHJg0DdyB1XCp0Lrd6JbuaA006nhNycD+Tr4UKiMHm5\nCkfYPUt\/M7L18fjs2MfkliOCaJG8bweSkwEsXzfxXpDEA6G0MF5wBoHpEyIRERIgnFPIfCCXeO+T\nabqD\/KMTWkRIIMKD5dQypAgJlNBuohI9KiUuAkmx4WS3Ox1BT8OHoL0odzxcHQnSAa6OJ6knnoDj\nyePifMH5lpYUTcXzKVwcP6cFnaTPOojwehHwQVo4Q+LtKtKEoRNjVIfu7c+Ae1Kp5\/MiiVYpdNHh\nStr4NVSJNMVQh68szqJBMx1nvjCgNC9NDJZceQ3l+SiiEHIP4\/OGgWBy0xLEAclCBcKDKOeR0zPo\nnxNHSBMaBDW5p1LIKGUkL86DC3Tco7I39XfW7A9114kqa64qQu2ZXFQbswVoeWEGyp7BGmk2LKJz\nSkFmCvIykqh5q3jIJKh42sdjCTyVYA10FslEC+21fKYpzk1FJU3UvJiCrGRk0AJsgJxrkWFBFF75\nvkoh0R25Dw921O5Z+s5hksIzPdSGxbFuzF3sxNr8IKYvtIvmyqHjqZjH9d5nZwt2LoqcT46NINhk\nep1I+aelg88BrCEphvbvKAFraqnASE8j6s7m0QwYa08Ndo0A917pey8fORspdOwcz29dDaUwUf\/i\nQ85AezWGu+owSueGpfHzmCfwJYsJy1QQq1N9YhELtCA+BPEJjUPM592R3kah+dEuXKbP99N1Kgi0\nMCsF2qgw+Hoe5DOll+U\/+mUhVx+ny0tPMhVlJFtKclKtlHfWSrpgDZ3Y6in\/mioK0FJdhA5yrrux\nDD00KZtbqzDUUYOL3fUYI3cmzM2Y7G\/BIi2EI3Fl2iwW0lF3hq6Rh7KCdJEW+uQY9X\/1Z5Esfax\/\njl6rLshMLCzKTjFRLlrO5qdbq4qyrJyrDRS2c5WFaKOc66w\/g\/N8OKeQsmuTA630vlHkNOdwjj6+\n8O0vsG8fhx7\/AsxZVVnOQKwWAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/smelter-1337278337.swf",
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
	"t"	: "smelt"
};

log.info("smelter.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
