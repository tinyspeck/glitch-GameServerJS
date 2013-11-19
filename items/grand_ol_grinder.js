//#include include/takeable.js

var label = "Grand Ol' Grinder";
var version = "1355086256";
var name_single = "Grand Ol' Grinder";
var name_plural = "Grand Ol' Grinders";
var article = "a";
var description = "More hefty than any grinder you may have met before, a meatier mortar and more powerful pestle means a lot more grind for your currant. Which is good, as it also costs a bunch more currants.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2000;
var input_for = [];
var parent_classes = ["grand_ol_grinder", "ore_grinder", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "refining_1",	// defined by tool_base
	"points_capacity"	: "500",	// defined by tool_base (overridden by grand_ol_grinder)
	"display_wear"	: "1",	// defined by tool_base
	"can_repair"	: "1"	// defined by tool_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "500";	// defined by tool_base (overridden by grand_ol_grinder)
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

verbs.crush = { // defined by ore_grinder
	"name"				: "crush",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (pc.findFirst('bag_elemental_pouch')) { 
			return "Choose ore or barnacles to grind. (Or, drag ore or barnacles to grinder.)";
		}
		else {
			return "Choose barnacles to grind. (Or, drag barnacles to grinder.) Note: grinding ore requires an Elemental Pouch.";
		}
	},
	"is_drop_target"		: true,
	"drop_many"			: true,
	"drop_tip"			: "Crush {$count} {$stack_name}",
	"drop_ok_code"			: function(stack, pc){

		var can_refine = false;
		var required_skill = this.getClassProp('required_skill');
		if (pc.skills_has(required_skill)){
			if (pc.checkItemsInBag('bag_elemental_pouch', 1)){
				can_refine = true;
			}
		}

		return (stack.hasTag('rock') && !stack.hasTag('metal') && can_refine) || stack.class_tsid == 'barnacle';
	},
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('refining_1')) return {state:'disabled', reason:'You must know Refining to crush stuff.'};

		if (this['!is_crushing']){
			return {state:'disabled', reason:"You can only crush one thing at a time."};
		}

		if (pc['!in_house_deco_mode']){
			return {state:'disabled', reason:"No crushing while decorating."};
		}

		if (!this.isWorking()){
			return {state:'disabled', reason:"This "+this.name_single+" has become broken, and must be repaired."};
		}

		if (pc.making_is_making()) return {state:'disabled', reason:"You are making something else."};

		if (pc.items_has('barnacle',1)) return {state:'enabled'};

		var has_rock = false;
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.hasTag('rock') && !it.hasTag('metal')){
				var required_skill = this.getClassProp('required_skill');
				if (pc.skills_has(required_skill)){
					if (!pc.checkItemsInBag('bag_elemental_pouch', 1)){
						return {state:'disabled', reason:"You need an Elemental Pouch to use this."};
					}

					return {state:'enabled'};
				}
				else{
					return {state:'disabled', reason:"You need to know "+pc.skills_get_name(required_skill)+" to use this."};
				}
				break;
			}
		}

		return {state:'disabled', reason:"You need something to crush."};
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var can_refine = false;
		var required_skill = this.getClassProp('required_skill');
		if (pc.skills_has(required_skill)){
			if (pc.checkItemsInBag('bag_elemental_pouch', 1)){
				can_refine = true;
			}
		}

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.hasTag('rock') && !it.hasTag('metal') && can_refine){
				uniques[it.class_tsid] = it.tsid;
			}

			if (it.class_tsid == 'barnacle'){
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
			pc.sendActivity("You don't have anything to crush!");
			return {
				'ok' : 0,
				'txt' : "You don't have anything to crush!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this['!is_crushing']){
			return false;
		}

		if (msg.target_item_class || msg.target_itemstack_tsid || msg.target_itemstack){
			if (msg.target_itemstack){
				var stack = msg.target_itemstack;
				var item_count = stack.count;
			}
			else if (msg.target_itemstack_tsid){
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
				var item_count = msg.target_item_class_count;
			}
			else{
				var stack = pc.removeItemStackClass(msg.target_item_class, msg.target_item_class_count);
				var item_count = msg.target_item_class_count;
			}

			if (!stack){
				log.error('failed to find other stack - wtf');
				return false;
			}

			var can_refine = false;
			var required_skill = this.getClassProp('required_skill');
			if (pc.skills_has(required_skill)){
				can_refine = true;
			}

			if (!can_refine && stack.hasTag('rock')){
				pc.items_put_back(stack);
				pc.sendOnlineActivity("You need to know "+pc.skills_get_name(required_skill)+" to use this.");
				return false;
			}

			if (!stack.hasTag('rock') && stack.class_tsid != 'barnacle'){
				pc.items_put_back(stack);
				log.error('chose something we can\'t crush...');
				return false;
			}

			//
			// Enough energy?
			//

			if (stack.class_tsid == 'barnacle'){
				var skill_package = 'barnacle_refining';
			}
			else{
				var skill_package = 'refining';
			}

			var details = pc.getSkillPackageDetails(skill_package);
			var energy = details['energy_cost'] * item_count;


			//
			// Determine if we get any energy free crushes from 'flaming_grider'
			//
			var energy_free_crushes = 0;
			if (pc.buffs_has('flaming_grinder') && skill_package == 'refining'){
				var remaining_buff = parseFloat(pc.buffs_get_remaining_duration('flaming_grinder'));
				if (pc.imagination_has_upgrade('refining_time_2')){
					remaining_buff += remaining_buff * 0.60;
				}else if (pc.imagination_has_upgrade('refining_time_1')){
					remaining_buff += remaining_buff * 0.80;
				}
				
				energy_free_crushes = Math.min(remaining_buff * 5, 10); // 5 crushes per second for 2 seconds
				if (remaining_buff > 2){
					energy_free_crushes += (remaining_buff - 2) * 10; // 10 crushes per second for remainder
				}

				energy = Math.max((item_count - energy_free_crushes) * details['energy_cost'], 0);

				pc.addSkillPackageOverride('refining', {energy_cost: (energy/item_count)});
			}
			
			//log.info('Energy needed: '+energy);
			if (pc.metabolics_get_energy() <= energy){
				pc.items_put_back(stack);
				if (pc.buffs_has('flaming_grinder') && skill_package == 'refining'){
					pc.sendOnlineActivity("After Flaming Grinder wears off, you will not have enough energy!");
				}else{
					pc.sendOnlineActivity("You don't have enough energy to do that!");
				}

				return false;
			}

			this.class_crushing = stack.class_tsid;

			var count = stack.count;
			stack.apiDelete();

			while (count < msg.target_item_class_count){
				var remaining = msg.target_item_class_count - count;
				var next_stack = pc.removeItemStackClass(msg.target_item_class, remaining);
				if (!next_stack) break;
					
				count += next_stack.count;
				next_stack.apiDelete();
			}

			this.count_crushing = count;
			var tool_wear_multiplier = this.getToolWearMultiplier(stack.class_tsid, this.count_crushing);

			this['!is_crushing'] = 1;

			// 0.2 secs for each chunk, up to 10
			// 0.1 secs for each chunk thereafter
			var add_duration = ((this.count_crushing < 10) ? this.count_crushing : 10) * 200;
			if (this.count_crushing > 10) add_duration += (this.count_crushing - 10) * 100;

			if (pc.imagination_has_upgrade('refining_time_2')){
				add_duration -= add_duration * 0.4;
			}else if (pc.imagination_has_upgrade('refining_time_1')){
				add_duration -= add_duration * 0.2;
			}

			this['!start_time'] = getTime();
			
			pc.making = {
				wait: add_duration,
				known: 1,
				recipe: 0,
				count: count,
				item: this,
				verb: 'crush',
				energy: energy,
				started: intval(getTime())
			};

			var ret = pc.runSkillPackage(skill_package, this, {tool_item: this, word_progress: config.word_progress_map['crushing'], tool_wear_multiplier: tool_wear_multiplier, add_duration: add_duration, ignore_energy_cost: true, ignore_xp_bonus: true, no_drop: (count < 5), callback: 'onCrushComplete'});

			if (!ret['ok']){
				if (ret['error_tool_broken']) pc.sendActivity("Your Grinder doesn't have enough uses left. Try repairing it, replacing it, or crushing a smaller amount.");
				var remaining = this.count_crushing;
				while (remaining){
					remaining = pc.createItem(this.class_crushing, remaining);
				}
				delete this['!is_crushing'];
				delete this['!start_time'];
				delete this.class_crushing;
				delete this.count_crushing;
				pc.making = {};
				return false;
			}

			
			
			return true;
		}

		return false;
	}
};

function getToolWearMultiplier(class_tsid, count_crushing){ // defined by ore_grinder
	if (class_tsid == 'barnacle'){
		return count_crushing;
	}
	else{
		return Math.round(count_crushing / 3);
	}
}

function onCrushComplete(pc, ret){ // defined by ore_grinder
	if (ret['ok'] && this.class_crushing && this.count_crushing){
		this['!end_time'] = getTime();

		var outputs = [];
		if (this.class_crushing == 'beryl'){
			outputs.push({class_tsid: 'element_red', count: '20'});
			outputs.push({class_tsid: 'element_green', count: '2'});
			outputs.push({class_tsid: 'element_blue', count: '4'});
		}
		else if (this.class_crushing == 'dullite'){
			outputs.push({class_tsid: 'element_red', count: '5'});
			outputs.push({class_tsid: 'element_green', count: '8'});
		}
		else if (this.class_crushing == 'sparkly'){
			outputs.push({class_tsid: 'element_red', count: '5'});
			outputs.push({class_tsid: 'element_green', count: '1'});
			outputs.push({class_tsid: 'element_blue', count: '4'});
			outputs.push({class_tsid: 'element_shiny', count: '6'});
		}
		else if (this.class_crushing == 'barnacle'){
			outputs.push({class_tsid: 'barnacle_talc', count: ret.details['bonus_amount']});
		}

		if (ret.details['xp_bonus']){
			var context = {'class_crushing':this.class_crushing, 'count':this.count_crushing};
			var xp = pc.stats_add_xp(ret.details['xp_bonus'] * this.count_crushing, false, context) + ret.values['xp_bonus'];
		}
		var energy = pc.metabolics_lose_energy(ret.details['energy_cost'] * this.count_crushing) + ret.values['energy_cost'];

		//log.info("grinder - cost is "+ret.details['energy_cost']+" count is "+this.count_crushing+" and other cost is "+ret.values['energy_cost']);

		var proto = apiFindItemPrototype(this.class_crushing);
		if (xp){
			var rsp = "You crushed "+pluralize(this.count_crushing, proto.name_single, proto.name_plural)+" (+"+xp+" iMG, "+energy+" energy).";
		}
		else{
			var rsp = "You crushed "+pluralize(this.count_crushing, proto.name_single, proto.name_plural)+" ("+energy+" energy).";
		}

		if (this.class_crushing != 'barnacle'){
			pc.quests_inc_counter('ore_crushed', this.count_crushing);
		}

		var you_got = [];
		for (var i in outputs){
			var to_get = outputs[i].count * this.count_crushing;
			pc.quests_inc_counter('refined_'+outputs[i].class_tsid, to_get);
			pc.achievements_increment('elements_refined', outputs[i].class_tsid, to_get);
			// don't destroy the remainder if it's barnacle talc
			var remainder = pc.createItemFromGround(outputs[i].class_tsid, to_get, (this.class_crushing != "barnacle"));
			var proto = apiFindItemPrototype(outputs[i].class_tsid);
			//pc.sendActivity('to_get '+to_get+' remainder '+remainder);
			if (remainder){
				rsp += " "+pluralize(remainder, proto.name_single, proto.name_plural)+" were created, but destroyed, because you couldn't carry them.";
			}

			if (remainder != to_get){
				you_got.push(pluralize(to_get-remainder, proto.name_single, proto.name_plural));
			}
		}

		if (you_got.length){
			rsp += " You got "+pretty_list(you_got, ", and ")+".";
		}
	}
	else{
		rsp = "Huh, that didn't work for some reason.";
	}

	// Remove cost override from Flaming Humbaba buff if any. (If we still have the buff, 
	// the override will get re-computed on the next crush.)
	pc.removeSkillPackageOverride('refining');


	pc.sendActivity(rsp);

	if (config.is_dev) {
		pc.sendActivity("That took you "+((this['!end_time']-this['!start_time'])/1000)+" seconds");
	}

	delete this['!is_crushing'];
	delete this['!start_time'];
	delete this['!end_time'];
	delete this.class_crushing;
	delete this.count_crushing;
	pc.making = {};
}

function onOverlayDismissed(pc, payload){ // defined by ore_grinder
	delete this['!is_crushing'];
	pc.making = {};

	pc.announce_sound_stop(this.class_tsid.toUpperCase());
	pc.createItem(this.class_crushing, this.count_crushing);
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
	if (pc && (!pc.skills_has("refining_1"))) out.push([1, "You need the skill <a href=\"\/skills\/54\/\" glitch=\"skill|refining_1\">Refining I<\/a> to use this."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !pc.skills_has("tinkering_1")) out.push([2, "You need to learn <a href=\"\/skills\/72\/\" glitch=\"skill|tinkering_1\">Tinkering I<\/a> to use a <a href=\"\/items\/563\/\" glitch=\"item|tinkertool\">Tinkertool<\/a>."]);
	if (pc && !(pc.skills_has("refining_2") && pc.skills_has("tinkering_5"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/65\/\" glitch=\"skill|refining_2\">Refining II<\/a> and <a href=\"\/skills\/76\/\" glitch=\"skill|tinkering_5\">Tinkering V<\/a>."]);
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
		'position': {"x":-19,"y":-37,"w":38,"h":38},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKXElEQVR42s2Y20\/b9xnG+wdUQ+ou\nmt4kSxapo1EK1GDA2BgbzMkGczJHG4MNNsYHbAyYszFnCISQpmmStiPTNq3TJmXSDpo0aexi0i7z\nJ\/Rq11zt+t3zvMS0TtK1aru0lr7y+efP93nf93nfr1977Xu4eTyhosOjD57s7Bxmc7ndqUxmt+i1\nH9JteDiQza3vyvrGnqysbshcZuVsejpzFI2mr\/wwAP2Bp7cO3gfcpswvrEp6ZkESU2mZiMQlGIz4\nfwCAQcmubcvu3pHMzC4CbkYikwkZG48I3+sf9Ga\/NzjmHyE2tw7k4PAeAJdkMjol46FJ8Y+MyeDQ\nsHh6B6S9o+vkewH0+UatBHz00S9lNbst79\/7WKbT8zIyOi5DXr\/CdXT2iNPlFkdT09QrBxwdHXPH\nE2n58MFjOb77UBaXcsjDrMzOLStkZ5dHXG1uaWpulQZHk7xSuEAgXBKLp86Yd\/u37qJItlAgiyiO\nKeTemIQn4uIbDigkVXylgISLxpJnBFpaXpe13K6qFo1Ny2ggLH39XijXKZZam5gtdbpqLHUnrwgu\nUBKZnDpjrhGMBUL1ElOzKAq\/dHX3SavTLbVW+wWY2WwreSVwXsCFI4kzet3x3Ufywf2fozi2JDOf\nldR0BmFsuVDMbK57YrHYrN8pQCaTKUqlZq1xrjhXyhp5tkbHwu7xUOwsM7+q1Uq4tdwOimINlbuA\n8KaQa5483Ok3hlhYyVnnF9ey2PXpwlLuNLexd5rFD62ucW3LChRZxlqBbWxs3dI1M7cEb4vKwmJW\nK\/bBw1\/IxuYtPM9pYcTi03g\/dqEgCuSzozsPTm8fP3B\/JdC9j391ZWvn8AS7fbqMdrSApE4kZ+H0\nUfH6AtLY5BR3R4\/uvqXVrcnd0dmrVRgITiDhfRIcm5Cp5NwF3M7ukRYHjTmemNHPjoyGxFpXL3W2\nBpj1tILPzK6Iy9X58vzLbe66oczTVaizsrYlG9sHUGIZSdwvNWYrKsyuF7PXN4mjsRVe5boAbHd3\nwx56pX\/Ap5CEYEgJt7d\/DLgNrVoWBuFYuT2eQVWvE0UyODQivX1DUl1tksrKqhfDvb61f5Lb3JMs\npgyuOeRNtcmiMLz\/IiDhngekokPeEfxwSJv\/3fc\/0m6xu3csyyubnFhUUXoeNzDkHcU1WqS+oUl8\n6CxUM4miyUMWwEEp\/zryZmv3UNYwAlHByqoaKa+oEmNljQLa7A7YQH2Bgm3tXQpIOBosOwGMGHCP\nFO7WwT21ExZJMpXBQJBE6COaJt09A6oegYI6JIyp5QwMDiMaXZ8VAmJwJGBeQQIaK00FgASrszle\nCLGrrQs\/OKpTyGQ0eQF35\/ih9lq2sdT0PN5LIYcnsZEgoLzS3NKm+ReLp2UYQwIV5HsE7O\/3FoYY\nH8jGUQSLK+tCUEIyB9vdPdilTd2dIbbWnUPmAZ2ujgu4UDiquXYO9wDj1BftZFoLjCqxgFhQNGWq\nSEWpYBKbSKovNouhvLIQsN7RdBDAh+aX1i5CvI1ZbWf\/jiZ7t2fgIge5c8LxPg9HZRhKwsEqtFt8\nbidptRP\/yDgKaBiF1CcdKCY6AEPN73uRHszJZkTEUG6UsvKKpwWAjqaW3TZ3lybrNC6ar2JazNLK\nhtrMEh7zx7jLGKAZTlpJKBzDdxYA9uF5teLzzDmGNQqvy1csF9UK4DujwbBuinkZw2TD3+WGTTUW\n5L5J3jNUFBZJq6s929aOSsQE0TfgxUUikoHBriHUhKSqVDeDfGJ1z2aWJQ0j5mZS6fPQ8H2ad25z\nXyEJPTE5JWhzEpqIqWkTKg\/InKOCnd29GhGGnHAVxqoXAds7uwME7MGw2NXTJ56+QVhBWBVYQafY\nw\/kBDi+7UIg5+jLARGpOZvA6n\/N7k7Hki4BYhGNIe5A2La3tYm9oROpgQDDXoiCrAVcu5lprYRV7\nBnxWKpefKtgpXM+AvcOjMhIYl3ko+snj38if\/\/oP+dvf\/yW\/\/f2f5NPf\/VHXrz\/9g9x\/+FgOju7L\nPjazuX14niLZTYCmZBwF5IcFEcrV3iFNLU44gBPF1gjAJgWsNpkVsrbOLiaz5UkBYDS68GPm13Sa\nw2NCpefF6HOtznZxtnXoAEnY0WAIPzamj\/\/XGsDZgpsehHlTMU\/fORxHeUaJ17XXO9RqqGJDY7PY\nAGy2WNFJqkMFgEjwp5w2Dg7vy+2jD3UUYvWGwnGdbi21tXL58hWctnwKyOXzBxQkOD5RAMznQ74R\n\/Wxv\/yAcoF\/NGIcgeGaHtDjbpBHjfJ2tXu9bANoINWkvzD9DhVHeeuuty5\/3340D\/\/bOEQz2Y4W7\nc\/xIH7NF0Wjt9nqMQhb5UVGR7jIwFtaQ5wG\/uAi+uLwm6dkFBWQucxEyv3p6+7XzMN\/Y5gjJ0LJA\n2L0M5RX\/LFBvfn4tu7yyhSn3EOs2po47Cnn76IGMwOGtVs5qZnn99deltMwgkdiUxHDIfn7lIeNJ\nnHFRIOMTUaG3+nUzQQ11H1VVNbsBWCXNrW0a3vKKSlXUWFUt75aWzhQAJpJz2fTMEox1HWa7raC5\n9X1VkHBcNTVmKYKC1356XeiXLwNkWJlnYRzAx1G1zL8ePO\/20Jg5lrk056gic7rCWAklu59Vr0kN\nuho+ePXq1TcLAEOhWJZ9MjW9gIljVUcitiiqmQdkiC9duiQ\/uXpNL8Qfa0UucVEdKjboHcbMOCPR\nREqCOIQ7Xe1QyKXFwM8T0gyYThQI87ACucb8M8DzWMHMv4qKqr+8eGYYDmQDwYj2yvBEAn0zjaFx\nWfPP4Wi8ALx+\/bq8+eYluH2tqjMRTWguMoRUjeGdwH0kOoXXQwrkxPmWYVVv7R9Sj+PrzGUCcQM3\nb5ZoBwHkf0wm+4t\/HnV29pWwgU9EkuiL40JYKkrbGYPrE9BiqZXS0lJ54403NLk5Jg2PBMU3gkJB\nsYyFJ5H8g1qpIyiUQYSb4SMAQ8rQUjkrPI75Z7M3aIgdTa1SXHxDvc9YVRX\/0hEffnfCJu7pHUJD\n96sPssdyCs6H2Wg0wmouy8+K39Edoz2qkRNGTRiPaSO+Ef75M6xGz\/B29fSrEbMI0PM1rAQtKS3T\nAnn77WLAme5\/5TkEk0R2YNCPnXt0LOJcFhyblBkUUD7MxcXFWijVKBr6FtWggt1Qx93ZrUBDmHC6\nAdXR1aNAXVCQnyMwC4xQVI65x\/5bVmZY\/tqnN7vdfsXhcB5hsjhtaz8\/YzDkPB4Ssry8XK5du4aD\ntVXqkUddqNAh5B7BCMAWxpzj0MF\/qWwILV8jKMN63jnOh4J3S0r\/XWkyNX7jo2ZDQ0ORo6XN2urs\nOEGPPuMwUV\/fIDdu3ICS70jZewZdbE0MNxfBaMy0Ef6vUmu16fsEtSLEfM70oAcaDIbv7m9fo7Eq\ni5MW8rBS3gPUzZs3tadWwR6sNruGjgXRyJAi3M1QDUOwpgGVY+VXQTUDqpjXeemp7dvcuFvAPX12\n8YtFX2M1VqIDmJCXVIhh5OtcfK28vEKe+95nKLj\/z\/8uVBKgZ8+Dft2F7598p6H9sltZmenKs7Cf\nfgXwKaG+jWL\/BXs8QkoGkUb8AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/grand_ol_grinder-1338247052.swf",
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
	"c"	: "crush",
	"g"	: "give",
	"e"	: "repair"
};

log.info("grand_ol_grinder.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
