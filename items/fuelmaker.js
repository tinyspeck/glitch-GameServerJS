var label = "Fuelmaker";
var version = "1348695496";
var name_single = "Fuelmaker";
var name_plural = "Fuelmakers";
var article = "a";
var description = "Talk about green energy. There's so much green in these fuel cells, and the Fuelmaker is how it gets there.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["fuelmaker", "machine_base"];
var has_instance_props = true;

var classProps = {
	"max_step_id"	: "4",	// defined by machine_base
	"max_fuel"	: "200",	// defined by machine_base
	"required_skill"	: "fuelmaking_1",	// defined by machine_base (overridden by fuelmaker)
	"making_type"	: "machine",	// defined by machine_base
	"days_to_store_contents"	: "6",	// defined by machine_base
	"pc_action_distance"	: "80"	// defined by fuelmaker
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.current_step_id = "1";	// defined by machine_base
	this.instanceProps.fuel_level = "0";	// defined by machine_base
}

var instancePropsDef = {
	current_step_id : ["Which step are we on?"],
	fuel_level : ["How much fuel do we have?"],
};

var instancePropsChoices = {
	current_step_id : [""],
	fuel_level : [""],
};

var verbs = {};

verbs.fully_disassemble = { // defined by machine_base
	"name"				: "fully disassemble",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Fully disassemble the machine",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.imagination_has_upgrade('engineering_disassemble_machine') || !this.is_assembled){
		    return {state:null};
		}

		if (this.placing_part_step) return {state:null};
		if (this.isInCraftingAltar()) return {state:null};
		if (this.auto_assemble) return {state:null};
		if (this.auto_disassemble) return {state:null};

		if (num_keys(this.getContentsForPlayer(pc))){
			return {state:null};
		}

		if (!pc.skills_has('engineering_1')){
			return {state:'disabled', reason: "You need to know Engineering to do this."};
		}

		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc) &&!this.container.acl_keys_player_has_key(pc)){
			return {state:'disabled', reason: "Only the owner or a keyholder of this location can disassemble this "+this.name_single};
		}
		if (!this.canUse(pc)) {
			if(this.last_user == pc.tsid) {
				return {state:'disabled', reason: "The machine is still in use."};
			} else {
				return {state:'disabled', reason: "Someone else is using this."};
			}
		}

		if (!pc.metabolics_try_dec('energy', 15)) return {state:'disabled', reason: "You don't have enough energy to do that!"}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.auto_disassemble = true;

		if (is_array(this.contents) || num_keys(this.contents) > 0) { 
			this.verifyDisassemble(pc);
		}
		else { 
			this.onFullyDisassemble(pc);
		}


		return true;
	}
};

verbs.place = { // defined by machine_base
	"name"				: "place",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Place the next part of this machine",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Add {$stack_name} to this machine",
	"drop_ok_code"			: function(stack, pc){

		if (stack.is_machine_part && in_array_real(this.class_tsid, stack.getAcceptableMachines()) && this.getNextPartClass() == stack.class_id){
			return true;
		}

		return false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.is_assembled) return {state:null};
		if (this.placing_part_step) return {state:null};
		if (this.auto_assemble) return {state:null};

		if (!pc.skills_has('engineering_1')){
			return {state:'disabled', reason: "You need to know Engineering to do this."};
		}

		if (!pc.items_has(this.getNextPartClass(), 1)){
			return {state:'disabled', reason: "You don't have the next part."};
		}

		return {state:'enabled'};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();

		var current_step_id = this.getInstanceProp('current_step_id');

		for (var i in items){
			var it = items[i];
			if (it.is_machine_part && in_array_real(this.class_tsid, it.getAcceptableMachines()) && this.getNextPartClass() == it.class_id){
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
			pc.sendActivity("You don't have the next part for this machine!");
			return {
				'ok' : 0,
				'txt' : "You don't have the next part for this machine!",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (msg.target_item_class || msg.target_itemstack_tsid){
			if (msg.target_itemstack_tsid){
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, 1);
			}
			else{
				var stack = pc.removeItemStackClass(msg.target_item_class, 1);
			}

			stack.verbs['place'].handler.call(stack, pc, msg);

			if (this.assembler && this.assembler != pc) { 
				log.info("deleting assembler "+this.assembler);
				delete this.assembler;
			}

			return true;
		}

		return false;
	}
};

verbs.install = { // defined by machine_base
	"name"				: "install",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Install the current machine part. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.is_assembled) return {state:null};
		if (!this.placing_part_step) return {state:null};
		if (this.auto_assemble) return {state:null};
		if (this.auto_disassemble) return {state:null};

		if (!pc.skills_has('engineering_1')){
			return {state:'disabled', reason: "You need to know Engineering to do this."};
		}

		if (!pc.metabolics_try_dec('energy', this.getEnergyCost(pc))) return {state:'disabled', reason: "You don't have enough energy to do that!"}
		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return {
			energy_cost: this.getEnergyCost(pc),
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.setUser(pc);
		pc.metabolics_lose_energy(this.getEnergyCost(pc));

		// Which direction are we "facing"?
		if (this.x < pc.x){
			var state = '-tool_animation';
			var delta_x = 10;
			var endpoint = this.x+100;
			var face = 'left';
		}
		else{
			var state = 'tool_animation';
			var delta_x = -10;
			var endpoint = this.x-100;
			var face = 'right';
		}


		// Move the player
		var distance = Math.abs(pc.x-endpoint);
		pc.moveAvatar(endpoint, pc.y, face);


		var duration = 2000;
		if (pc.imagination_has_upgrade('engineering_reduce_time')) duration = 1000;
		// Start overlays
		var annc = {
			type: 'itemstack_overlay',
			duration: duration,
			locking: true,
			itemstack_tsid: this.tsid,
			delta_x: delta_x,
			delta_y: -60,
			swf_url: pc.overlay_key_to_url('installing'),
			word_progress: config.word_progress_map['installing']
		};

		if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);

		pc.apiSendAnnouncement(annc);

		if (this.assembler && this.assembler != pc) { 
			log.info("deleting assembler "+this.assembler);
			delete this.assembler;
		}

		this.apiSetTimer('onApplyPartStep', duration + intval(annc['delay_ms']));

		var pre_msg = this.buildVerbMessage(msg.count, 'install', 'installed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.disassemble = { // defined by machine_base
	"name"				: "disassemble",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Uninstall the next part. Takes 15 energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.placing_part_step) return {state:null};
		if (this.isInCraftingAltar()) return {state:null};
		if (this.auto_assemble) return {state:null};
		if (this.auto_disassemble) return {state:null};

		if (num_keys(this.getContentsForPlayer(pc))){
			return {state:null};
		}

		if (!pc.skills_has('engineering_1')){
			return {state:'disabled', reason: "You need to know Engineering to do this."};
		}

		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc) &&!this.container.acl_keys_player_has_key(pc)){
			return {state:'disabled', reason: "Only the owner or a keyholder of this location can disassemble this "+this.name_single};
		}
		if (!this.canUse(pc)) {
			if(this.last_user == pc.tsid) {
				return {state:'disabled', reason: "The machine is still in use."};
			} else {
				return {state:'disabled', reason: "Someone else is using this."};
			}
		}

		if (!pc.metabolics_try_dec('energy', 15)) return {state:'disabled', reason: "You don't have enough energy to do that!"}
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		// Somebody else has stuff in this machine. Ask if they are sure:
		if (is_array(this.contents) || num_keys(this.contents) > 0) { 
			this.verifyDisassemble(pc);
		}
		else { 
			this.onDisassemble(pc);
		}


		return true;
	}
};

verbs.pickup = { // defined by machine_base
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Pick up the last part. Takes 5 energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.placing_part_step) return {state:null};
		if (this.auto_assemble) return {state:null};
		if (this.auto_disassemble) return {state:null};

		if (!pc.skills_has('engineering_1')){
			return {state:'disabled', reason: "You need to know Engineering to do this."};
		}

		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc) && !this.container.acl_keys_player_has_key(pc)){
			return {state:'disabled', reason: "Only the owner of the location can disassemble this "+this.name_single};
		}

		if (!this.canUse(pc)) return {state:'disabled', reason: "Someone else is using this."};

		if (!pc.metabolics_try_dec('energy', 5)) return {state:'disabled', reason: "You don't have enough energy to do that!"}
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.setUser(pc);
		pc.metabolics_lose_energy(5);

		// Which direction are we "facing"?
		if (this.x < pc.x){
			var delta_x = 10;
			var endpoint = this.x+100;
			var face = 'left';
		}
		else{
			var delta_x = -10;
			var endpoint = this.x-100;
			var face = 'right';
		}


		// Move the player
		var distance = Math.abs(pc.x-endpoint);
		pc.moveAvatar(endpoint, pc.y, face);

		// Mart wanted machine parts to animate instantly to your pack instead of displaying the "uninstalling" overlay. Leaving this here in case minds are changed.

		this.onUninstallPart();

		if (this.disassembler && this.disassembler != pc) { 
			delete this.disassembler;
		}

		/*
			// Start overlays
			var annc = {
				type: 'itemstack_overlay',
				duration: 2000,
				locking: true,
				itemstack_tsid: this.tsid,
				delta_x: delta_x,
				delta_y: 20,
				swf_url: pc.overlay_key_to_url('uninstalling')
			};

			if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);

			pc.apiSendAnnouncement(annc);

			this.apiSetTimer('onUninstallPart', 2000 + intval(annc['delay_ms']));
		*/
		/*var pre_msg = this.buildVerbMessage(msg.count, 'pick up', 'picked up', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);
		*/
		return failed ? false : true;
	}
};

verbs.refuel = { // defined by machine_base
	"name"				: "refuel",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Add more fuel. Current level: $fuel_level\/$max_fuel",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Add fuel",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'fuel_cell';
	},
	"conditions"			: function(pc, drop_stack){

		if (this.is_assembled && this.getClassProp('max_fuel') != 0){
			if (this.getInstanceProp('fuel_level') > this.getClassProp('max_fuel') - 50){
				return {state: 'disabled', reason: "There is not enough space for a fuel cell. Current level: "+this.getInstanceProp('fuel_level')+'/'+this.getClassProp('max_fuel')};
			}

			if (!pc.items_has('fuel_cell', 1)){
				return {state: 'disabled', reason: "You don't have any fuel cells."};
			}
			else{
				return {state: 'enabled'};
			}
		}

		return {state:null};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (it.class_tsid == 'fuel_cell'){
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
			this.startMoving();
			pc.sendActivity("You don't have any fuel cells!");
			return {
				'ok' : 0,
				'txt' : "You don't have any fuel cells!",
			};
		}
	},
	"effects"			: function(pc){

		return {
			fuel_level: this.getInstanceProp('fuel_level'),
			max_fuel: this.getClassProp('max_fuel')
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		log.info('MACHINE ['+this.tsid+'] refuelling');

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (msg.target_item_class || msg.target_itemstack_tsid){
			if (msg.target_itemstack_tsid){
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
			}
			else{
				var stack = pc.removeItemStackClass(msg.target_item_class, msg.target_item_class_count);
			}
					
			if (!stack){
				log.error('failed to find other stack - wtf');
				return false;
			}

			stack.apiDelete();

			this.setInstanceProp('fuel_level', this.getInstanceProp('fuel_level')+(msg.target_item_class_count * 50));
			if (this.getInstanceProp('fuel_level') > this.getClassProp('max_fuel')) this.setInstanceProp('fuel_level', this.getClassProp('max_fuel'));
		}
		else{
			return false;
		}

		pc.achievements_increment('machines', 'refueled', 1);

		if (pc.location != pc.home.exterior && pc.location != pc.home.interior && pc.location != pc.home.tower) {
			pc.achievements_increment('machines', 'refueled_for_others', 1);
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'refuel', 'refueled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.collect = { // defined by machine_base
	"name"				: "collect",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Collect a finished block",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.class_tsid == 'fuelmaker') return "Collect your fuel cell";
		if (this.class_tsid == 'blockmaker') return "Collect your block";
		if (this.class_tsid == 'metalmaker') return "Collect your metal";
		if (this.class_tsid == 'woodworker') return "Collect your wood";
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (num_keys(this.getContentsForPlayer(pc)) > 0){
			
			var time_left = secondsToString(getPlayer(this.last_user).machineTimeRemaining(this.tsid));

			if (!this.canUse(pc)) return {state:'disabled', reason: "Someone else is using this. "+time_left+" remaining."};
			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		//log.info("Making: collecting");

		var contents = this.getContentsForPlayer(pc);

		//log.info("Making: contents is "+contents);

		pc.announce_sound('COLLECT');
		this.setAndBroadcastState('collectOpen');
		for (var i=0; i< contents.length; i++){
			//log.info("Making: creating "+contents[i]);
			//log.info("Making: creating class "+contents[i].class_id);
			//log.info("Making: creating number "+contents[i].count);
			pc.createItemFromSource(contents[i].class_id, contents[i].count, this);
		}

		if (this.contents[pc.tsid]) {
			delete this.contents[pc.tsid];
		}
		else { 
			delete this.contents;
		}

		this.broadcastStatus();

		//log.info("Making setting timer for onCollect "+this);
		this.apiSetTimerX('onCollect', 3000, pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'collect from', 'collected from', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.use = { // defined by machine_base
	"name"				: "use",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Get Excited and Make Things. Fuel: $fuel_level\/$max_fuel",
	"is_drop_target"		: false,
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [192],
		skills		: ["fuelmaking_1"],
		can_discover	: false,
		specify_quantities	: false,
	},
	"conditions"			: function(pc, drop_stack){

		if (this.is_assembled){
			if (!this.canUse(pc)){
				var time_left = secondsToString(getPlayer(this.last_user).machineTimeRemaining(this.tsid));

				if(this.last_user == pc.tsid) {
					return {state:'disabled', reason: "The machine is still running. "+time_left+" remaining."};
				} else {
					return {state:'disabled', reason: "Someone else is using this. "+time_left+" remaining."};
				}
			}

			if (num_keys(this.getContentsForPlayer(pc)) > 0){
				
				return {state:null};
				
			}
			else{
				return pc.making_check_allowed(this, 'use');
			}
		}

		return {state:null};
	},
	"effects"			: function(pc){

		return pc.making_get_effects(this, "use");
	},
	"handler"			: function(pc, msg, suppress_activity){

		return pc.making_open_interface(this, "use");
	}
};

function getEnergyCost(pc){ // defined by fuelmaker
	var step = this.getInstanceProp('current_step_id');

	if (step == 2) return 20;
	if (step == 3) return 10;
	if (step == 4) return 15;
}

function getNextPartClass(){ // defined by fuelmaker
	var part_id = this.getInstanceProp('current_step_id');

	if (part_id == 1){
		return 'fuelmaker_case';
	}
	else if (part_id == 2){
		return 'fuelmaker_core';
	}
	else if (part_id == 3){
		return 'blockmaker_engine';
	}

	return null;
}

function getPreviousPartClass(){ // defined by fuelmaker
	var part_id = this.getInstanceProp('current_step_id');

	if (part_id == 2){
		return 'fuelmaker_case';
	}
	else if (part_id == 3){
		return 'fuelmaker_core';
	}
	else if (part_id == 4){
		return 'blockmaker_engine';
	}

	return null;
}

function onApplyPart(part){ // defined by fuelmaker
	this.placing_part_step = 1;
	var part_id = intval(this.getInstanceProp('current_step_id')) + 1;

	if (part_id == 2){
		this.setAndBroadcastState('case1');
		this.container.announce_sound_to_all('CHASSIS1');
	}
	else if (part_id == 3){
		this.setAndBroadcastState('core1');
		this.container.announce_sound_to_all('CHASSIS1');
	}
	else if (part_id == 4){
		this.setAndBroadcastState('engine1');
		this.container.announce_sound_to_all('ENGINE1');
	}
	else{
		log.error(this+' unknown part_id: '+part_id);
		return false;
	}

	this.apiSetTimer('onApplyPartStep', 1100);

	this.setInstanceProp('current_step_id', part_id);
	return true;
}

function onApplyPartStep(){ // defined by fuelmaker
	var part_id = this.getInstanceProp('current_step_id');

	if (part_id == 2){
		if (this.placing_part_step == 1){
			this.setAndBroadcastState('case1Hold');
			this.placing_part_step++;
		}
		else if (this.placing_part_step == 2){
			this.setAndBroadcastState('case2');
			this.container.announce_sound_to_all('CHASSIS2');
			this.placing_part_step++;
			this.apiSetTimer('onApplyPartStep', 1100);
		}
		else{
			this.setAndBroadcastState('case2Hold');
			delete this.placing_part_step;
		}
	}
	else if (part_id == 3){
		if (this.placing_part_step == 1){
			this.setAndBroadcastState('core1Hold');
			this.placing_part_step++;
		}
		else if (this.placing_part_step == 2){
			this.setAndBroadcastState('core2');
			this.container.announce_sound_to_all('CHASSIS2');
			this.placing_part_step++;
			this.apiSetTimer('onApplyPartStep', 1100);
		}
		else{
			this.setAndBroadcastState('core2Hold');
			delete this.placing_part_step;
		}
	}
	else if (part_id == 4){
		if (this.placing_part_step == 1){
			this.setAndBroadcastState('engine1Hold');
			this.placing_part_step++;
		}
		else if (this.placing_part_step == 2){
			this.setAndBroadcastState('engine2');
			this.container.announce_sound_to_all('ENGINE2');
			this.placing_part_step++;
			this.apiSetTimer('onApplyPartStep', 1100);
		}
		else{
			this.onAssembled();
			delete this.placing_part_step;
			this.is_assembled = true;
		}
	}
	else{
		log.error(this+' unknown part_id: '+part_id);
		return false;
	}

	this.checkAutoAssemble();
}

function onDisassemblePart(){ // defined by fuelmaker
	var part_id = this.getInstanceProp('current_step_id');

	if (part_id == 2){
		this.placing_part_step = 2;
		this.container.announce_sound_to_all('FUELMAKER_CASE1');
		this.setAndBroadcastState('case1Hold');
	}
	else if (part_id == 3){
		this.placing_part_step = 2;
		this.container.announce_sound_to_all('FUELMAKER_CORE1');
		this.setAndBroadcastState('core1Hold');
	}
	else if (part_id == 4){
		this.placing_part_step = 2;
		delete this.is_assembled;
		this.container.announce_sound_to_all('FUELMAKER_ENGINE1');
		this.setAndBroadcastState('engine1Hold');
	}
	else{
		log.error(this+' unknown part_id: '+part_id);
		return false;
	}

	if (this.auto_disassemble){
		this.apiSetTimer('checkAutoDisassemble', 1100);
	}
}

function onMakingComplete(pc, recipe_id, count){ // defined by fuelmaker
	this.is_running = false;

	if (pc){
		pc.quests_set_flag('made_fuel_cell');
		
		var chance_of_bonus = 0.10;
		var bonus_base_cost_percentage = 0.15;
		var upgrade_id = 'fuelmaking_imagination';

		this.rollCraftingBonusImagination(	
			pc, 
			recipe_id, 
			count, upgrade_id, 
			chance_of_bonus, 
			bonus_base_cost_percentage);

		// Check crafting altar/machine room
		if (!this.isInCraftingAltar()) return false;

		var preface = "Altar bonus! You used a Machine in a Machine Room: ";
		if (recipe_id == 192){
			pc.runDropTable('crafting_altar_bonus_rewards_fuel', this, preface);
		}
	}
}

function onMakingStart(pc, recipe_id, count, wait_time){ // defined by fuelmaker
	var overlay_id;
	if (recipe_id == 192){
		overlay_id = 'fuelmaker_fuel_cell';
	}

	var annc = {
		type: 'itemstack_overlay',
		duration: 800,
		locking: false,
		itemstack_tsid: this.tsid,
		delta_x: 0,
		delta_y: 40,
		swf_url: overlay_key_to_url(overlay_id),
		delay_ms: 500,
		state: 'please_play_once'
	};

	this.container.apiSendAnnouncement(annc);

	this.last_use = time();
	this.is_running = true;
}

function onUninstallPart(){ // defined by fuelmaker
	delete this.placing_part_step;

	if (!this.last_user) return false;

	var pc = getPlayer(this.last_user);
	var part_name = null;
	var part_class_tsid = null;

	var part_id = this.getInstanceProp('current_step_id');
	if (part_id == 2){
		part_class_tsid = 'fuelmaker_case';
		pc.createItemFromSource(part_class_tsid, 1, this);
		var stand = this.replaceWith('machine_stand');
		stand.is_assembled = true;
		if (this.disassembler) {
			this.disassembler.achievements_increment("machines_disassembled", this.class_tsid, 1);
		}
		stand.setAndBroadcastState('stand2Hold');
	}
	else if (part_id == 3){
		part_class_tsid = 'fuelmaker_core';
		pc.createItemFromSource(part_class_tsid, 1, this);
		this.setAndBroadcastState('case2Hold');
	}
	else if (part_id == 4){
		part_class_tsid = 'blockmaker_engine';
		pc.createItemFromSource(part_class_tsid, 1, this);
		this.setAndBroadcastState('core2Hold');
	}
	else{
		log.error(this+' unknown part_id: '+part_id);
		return false;
	}

	this.setInstanceProp('current_step_id', part_id-1);

	if (part_class_tsid){
		part_name = get_item_name_from_class(part_class_tsid, false, true);
		if (part_name){
			pc.sendActivity('You picked up '+part_name);
		}
	}

	if (this.auto_disassemble){
		this.apiSetTimer('checkAutoDisassemble', 1100);
	}

	return true;
}

function applyPart(part){ // defined by machine_base
	var my_machine_step_id = intval(this.getInstanceProp('current_step_id'));

	// Checks
	if (!in_array_real(this.class_tsid, part.getAcceptableMachines())) return false;
	if (this.getNextPartClass() != part.class_id) return false;

	// Change the machine to the correct level, switch animation state, etc
	if (this.onApplyPart(part)){
		return true;
	}
	else{
		return false;
	}
}

function blinkReadyLight(pc, reason){ // defined by machine_base
	//log.info("Making blink ready light, pc "+pc+" contents "+this.getContentsForPlayer(pc));

	//log.info("Making blink ready light, state is "+this.state+" and reason is "+reason);
	//log.info("Making blink ready light, running is "+this.is_running);
	if (reason != "done" && this.is_running) { return; }
	if (reason != "done" && this.state && this.state != "ready" && this.state != "assembled" && this.state != "collectClose" ) { return; }

	//log.info("Making Deleting state "+this.state+" for "+this);

	delete this.state;

	var players = this.container.getActivePlayers();

	//log.info("Making got here "+players);

	if (players == {} && reason == "done") { 
		this.setAndBroadcastState("assembled");
	}
	else { 
	  for (var p in players) { 

		if (num_keys(this.getContentsForPlayer(players[p])) > 0) { 

			//log.info("Making setting state to ready for "+players[p]);
			players[p].apiSendMsg({
				type: 'item_state',
				itemstack_tsid: this.tsid,
				s: "ready",
			});
		}
		else { 
			//log.info("Making setting state to assembled "+players[p]);
			players[p].apiSendMsg({
				type: 'item_state',
				itemstack_tsid: this.tsid,
				s: "assembled",
			});
		}
	  }
	}

	//log.info("Making state is "+this.state);
}

function callPlayer(pc){ // defined by machine_base
	var choices = ["I made things for you!", "Hey, come get your stuff!", "Come take this stuff off my gears."]; 
	this.sendBubble(choose_one(choices), 3000, pc);
}

function canUse(pc){ // defined by machine_base
	if (!this.last_user) return true;

	if (this.is_running) return false;

	if(this.last_user == pc.tsid) return true;

	//if (time() - this.last_use >= 30) return true;

	return true;
}

function checkAutoAssemble(){ // defined by machine_base
	if (this.auto_assemble){
		if (!this.is_assembled){
			if (!this.apiTimerExists('onApplyPartStep') && !this.apiTimerExists('onApplyPart')){
				if (this.placing_part_step){
					this.onApplyPartStep();
				}else{
					this.onApplyPart();
				}
			}
		}else{
			delete this.auto_assemble;
		}
	}
}

function checkAutoDisassemble(){ // defined by machine_base
	if (this.auto_disassemble){
		if (!this.apiTimerExists('onDisassemblePart') && !this.apiTimerExists('onUninstallPart')){
	//	        var pc = getPlayer(this.last_user);

			if (this.placing_part_step){
				this.onUninstallPart();
	//			this.verbs['pickup'].handler.call(this, pc, null);
			}else{
				this.onDisassemblePart();
	//			this.verbs['disassemble'].handler.call(this, pc, null);
			}
		}
	}
}

function craftytaskingComplete(){ // defined by machine_base
	this.setAndBroadcastState('assembled');
	this.onMakingComplete(null, this.craftytasking.recipe_id, this.craftytasking.count);
	delete this.craftytasking;
}

function craftytaskingStart(craftybot, recipe_id, count){ // defined by machine_base
	var ret = {};

	var recipe = get_recipe(recipe_id);
	if (!recipe) return {ok: 0, error:'invalid recipe_id'};

	var ingredient_class;
	var count;
	for (var i in recipe.inputs){
		ingredient_class = recipe.inputs[i][0];
		count = recipe.inputs[i][1];
		if (ingredient_class == 'fuel_cell'){
			if (this.getInstanceProp('fuel_level') >= count){
				this.setInstanceProp('fuel_level', this.getInstanceProp('fuel_level') - count);
			}else{
				return {ok:0, error:'Not enough fuel', class_tsid:ingredient_class, count:count};
				break;
			}
		}else{
			if (craftybot.crafting_holder && craftybot.crafting_holder[ingredient_class] && craftybot.crafting_holder[ingredient_class].count >= count){
				craftybot.crafting_holder[ingredient_class].count -= count;
			}else{
				return {ok:0, error:'Missing ingredient', class_tsid:ingredient_class, count:count};
				break;
			}
		}
	}

	// Put output items in hands
	for (var i in recipe.outputs){
		if (!craftybot.crafting_holder[recipe.outputs[i][0]]) craftybot.crafting_holder[recipe.outputs[i][0]] = {};
		if (!craftybot.crafting_holder[recipe.outputs[i][0]]['count']) craftybot.crafting_holder[recipe.outputs[i][0]]['count'] = 0;
		craftybot.crafting_holder[recipe.outputs[i][0]]['count'] += recipe.outputs[i][1];
	}

	this.craftytasking = {
		craftybot: craftybot.tsid,
		recipe_id: recipe_id,
		count: count,
		duration: recipe.wait_ms
	};

	ret.duration = 4*1000 + recipe.wait_ms;

	this.onMakingStart(null, recipe_id, count, 0);
	this.craftytaskingStep('open');

	return ret;
}

function craftytaskingStep(step){ // defined by machine_base
	switch(step){
		case 'open':{
			this.setAndBroadcastState('loadOpen');
			this.apiSetTimerX('craftytaskingStep', 1*1000, 'close');
			break;
		}
		case 'close':{
			this.setAndBroadcastState('loadClose');
			this.apiSetTimerX('craftytaskingStep', 1*1000, 'start');
			break;
		}
		case 'start':{
			this.setAndBroadcastState('active');
			this.apiSetTimerX('craftytaskingStep', this.craftytasking.duration, 'ready');
			break;
		}
		case 'ready':{
			this.setAndBroadcastState('ready');
			this.apiSetTimerX('craftytaskingStep', 1*1000, 'collectOpen');
			break;
		}
		case 'collectOpen':{
			this.setAndBroadcastState('collectOpen');
			this.apiSetTimerX('craftytaskingStep', 1*1000, 'collectClose');
			break;
		}
		case 'collectClose':{
			this.setAndBroadcastState('collectClose');
			this.craftytaskingComplete();
			break;
		}
	}
}

function expireOldContents(pc){ // defined by machine_base
	// Expire contents if needed
	if (this.contents && this.contents[pc.tsid]) {
		if (!this.container.pols_is_pol() || !this.container.pols_is_owner(pc)) { 
			var time = this.contents[pc.tsid]["time"];
			//log.info("Making: checking time "+time);
			if (game_days_since_ts(time) > this.getClassProp("days_to_store_contents")) { 
				log.info("Making: expired old contents for "+pc);
				delete this.contents[pc.tsid];
			}
		}
	}
}

function getContentsForPlayer(pc){ // defined by machine_base
	if (this.contents && this.contents[pc.tsid]) {
		//log.info("Making: returning contents for pc "+pc.tsid);
		return this.contents[pc.tsid]["contents"];
	}
	else if (is_array(this.contents) && this.last_user === pc) {
		//log.info("Making: old style data");
		// old style data, no timestamp
		return this.contents;
	}

	return [];
}

function getVerbLabel(pc, verb){ // defined by machine_base
	if (verb == 'place'){
		var class_id = this.getNextPartClass();
		if (!class_id) return null;

		var proto = apiFindItemPrototype(class_id);
		if (!proto) return null;

		return 'Place '+proto.name_single;
	}
	else if (verb == 'pickup'){
		var class_id = this.getPreviousPartClass();
		if (!class_id) return null;

		var proto = apiFindItemPrototype(class_id);
		if (!proto) return null;

		return 'Pick up '+proto.name_single;
	}

	return null;
}

function isInCraftingAltar(){ // defined by machine_base
	return in_array_real(this.container.tsid, config.machine_rooms);
}

function isWorking(count){ // defined by machine_base
	if (!count) count = 1;
	return (this.getClassProp('max_fuel') > 0 && this.getInstanceProp('fuel_level') < (count)) ? false : true;
}

function kickMachine(){ // defined by machine_base
	if (this.is_running && this.last_user) { 
		var player = getPlayer(this.last_user);

		if (num_keys(player.making_queue) == 0) { 
			
			this.is_running = false;
			this.setAndBroadcastState("assembled");

			return true;
		}
	}
	else if (this.is_running) { 
		this.is_running = false;
		this.setAndBroadcastState("assembled");

		return true;
	}

	return false;
}

function lowFuelAlert(){ // defined by machine_base
	if (this.getInstanceProp('fuel_level') <= 10){
		this.sendBubble('I am low on fuel!', 10000);
		this.apiSetTimer('lowFuelAlert', 30*1000);
	}
}

function modal_callback(pc, value, details){ // defined by machine_base
	if (value === "yes") { 
		// start disassembly
		if (this.auto_disassemble) { 
			this.onFullyDisassemble(pc);
		}
		else { 
			this.onDisassemble(pc);
		}

		var failed = 0;

		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var pre_msg = this.buildVerbMessage(1, 'disassemble', 'disassembled', failed, self_msgs, self_effects, they_effects);
		if (pre_msg) pc.sendActivity(pre_msg);
	}
	else if (value === "no") { 
		if (this.auto_disassemble) { 
			delete this.auto_disassemble;
		}
	}

	return true;
}

function onActive(){ // defined by machine_base
	this.setAndBroadcastState('active');
}

function onAssembled(){ // defined by machine_base
	this.setAndBroadcastState('assembled');

	var pc = getPlayer(this.last_user);
	if (pc && pc.buffs_has('machine_shop_pit_stop_in_time_period')){
		var q = pc.getQuestInstance('engineering_assemble_machine');
		if (q) q.onAssembled(pc);
	}


	//log.info("assembled machine, assembler is "+this.assembler+" and "+pc+" and class is "+this.class_id);
	if (this.assembler && this.assembler == pc) { 
		pc.achievements_increment("machines_assembled", this.class_id, 1);
		delete this.assembler;
	}
}

function onCollect(pc){ // defined by machine_base
	//log.info("Making onCollect "+this);

	this.setAndBroadcastState('collectClose');

	this.apiSetTimerX('blinkReadyLight', 1000, pc, "collected");

	this.last_use = 0;
}

function onCreate(){ // defined by machine_base
	this.initInstanceProps();
	if (this.getClassProp('max_fuel') > 0){
		this.setInstanceProp('fuel_level', intval(this.getClassProp('max_fuel')) / 4);
	}


	this.broadcastStatus();
}

function onDisassemble(pc){ // defined by machine_base
	delete this.contents;

	this.setUser(pc);
	pc.metabolics_lose_energy(15);

	// Which direction are we "facing"?
	if (this.x < pc.x){
		var delta_x = 10;
		var endpoint = this.x+100;
		var face = 'left';
	}
	else{
		var delta_x = -10;
		var endpoint = this.x-100;
		var face = 'right';
	}


	// Move the player
	var distance = Math.abs(pc.x-endpoint);
	pc.moveAvatar(endpoint, pc.y, face);


	var duration = 2000;
	if (pc.imagination_has_upgrade('engineering_reduce_time')) duration = 1000;
	// Start overlays
	var annc = {
		type: 'itemstack_overlay',
		duration: duration,
		locking: true,
		itemstack_tsid: this.tsid,
		delta_x: delta_x,
		delta_y: -60,
		swf_url: pc.overlay_key_to_url('disassembling'),
		word_progress: config.word_progress_map['disassembling']
	};

	if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);

	pc.apiSendAnnouncement(annc);

	if (this.isWorking()) { 
		this.disassembler = pc;
	}
	else if (this.disassembler && this.disassembler != pc) { 
		delete this.disassembler;
	}

	this.apiSetTimer('onDisassemblePart', duration + intval(annc['delay_ms']));
}

function onFullyDisassemble(pc){ // defined by machine_base
	delete this.contents;

	this.setUser(pc);
	pc.metabolics_lose_energy(15);

	this.disassembler = pc;

	// Which direction are we "facing"?
	if (this.x < pc.x){
		var delta_x = 10;
		var endpoint = this.x+100;
		var face = 'left';
	}
	else{
		var delta_x = -10;
		var endpoint = this.x-100;
		var face = 'right';
	}


	// Move the player
	var distance = Math.abs(pc.x-endpoint);
	pc.moveAvatar(endpoint, pc.y, face);


	var duration = 6600;
	// Start overlays
	var annc = {
		type: 'itemstack_overlay',
		duration: duration,
		locking: true,
		itemstack_tsid: this.tsid,
		delta_x: delta_x,
		delta_y: -60,
		swf_url: pc.overlay_key_to_url('disassembling'),
		word_progress: config.word_progress_map['disassembling']
	};

	if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);

	pc.apiSendAnnouncement(annc);

	this.apiSetTimer('onDisassemblePart', 1);
}

function onLidClose(){ // defined by machine_base
	this.setAndBroadcastState('loadClose');
	this.apiSetTimer('onActive', 1100);
}

function onMakingFailed(){ // defined by machine_base
	this.is_running = false;
	this.sendBubble('I couldn\'t find the ingredient I needed. I guess I ran for nothing.');
}

function onPlayerCollision(pc, hitbox){ // defined by machine_base
	// If this player is nearby and has stuff to collect, tell them so:

	if (this.canUse(pc) && num_keys(this.getContentsForPlayer(pc)) > 0) { 
		this.callPlayer(pc);
	}
}

function onPlayerEnter(pc){ // defined by machine_base
	if (!this.hitbox) { 
		this.apiSetHitBox(200, 100);
	}

	this.expireOldContents(pc);

	//log.info("Making: machine running? "+this.is_running+" and last user is "+this.last_user);
	if (this.is_running && this.last_user === pc.tsid) { 
		//log.info("Making machine starting sound "+this.class_tsid.toUpperCase());

		
		var metal_started = false;
		if (this.class_id === "metalmaker") { 
			if (pc && pc.imagination_has_upgrade('metalmaking_music')){
				if (this.music_on === undefined || this.music_on === true) { 
					pc.announce_sound('METALMAKER', 999); 
					metal_started = true;
				}
			}
		}
		
		if (!metal_started) { 
			pc.announce_sound('ACTIVE', 999, 0);
		}
		
	};
		

	//log.info("Making calling blinkReadyLight for pc "+pc);
	this.blinkReadyLight(pc);
}

function onPlayerExit(pc){ // defined by machine_base
	pc.announce_sound_stop('ACTIVE');
	pc.announce_sound_stop('METALMAKER');
}

function onStatus(pc){ // defined by machine_base
	var status = {
		verb_states: {}
	};

	if (pc){

	var contents = this.getContentsForPlayer(pc);
	if (num_keys(contents) > 0){
		
		//log.info("Making onStatus contents is "+contents);

		var class_id = contents[0] ? contents[0].class_id : contents.class_id;
		
		//log.info("Making onStatus class_id is "+class_id);

		status.verb_states['collect'] = {
			enabled: true,
			disabled_reason: '',
			warning: false,
			item_class: class_id
		};
	}
	else if (this.getInstanceProp('fuel_level') <= 10){
		if (!pc.checkItemsInBag("fuel_cell", 1)){
			var disabled_reason = "You don't have any Fuel Cells.";
		}

		status.verb_states['refuel'] = {
			enabled: disabled_reason ? false : true,
			disabled_reason: disabled_reason ? disabled_reason : '',
			warning: true,
			item_class: 'fuel_cell'
		};
	}

	}

	return status;
}

function rollCraftingBonusImagination(pc, recipe_id, count, upgrade_id, chance_of_bonus, bonus_base_cost_percentage){ // defined by machine_base
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

		pc.sendActivity('Hey, you got '+change+' bonus imagination for making that.');
		pc.stats_add_xp(change, false, context);
	}
}

function setContents(pc, contents){ // defined by machine_base
	if (!this.contents) { 
		this.contents = {};
	}

	this.contents[pc.tsid] = {contents: contents, time: getTime() };

	//log.info("Making Setting contents");
	this.blinkReadyLight(pc, "done");

	this.apiSetHitBox(200, 100); // make sure hitbox is the right size
}

function setUser(pc){ // defined by machine_base
	this.last_user = pc.tsid;
	this.last_use = time();

	//log.info("Making setting user "+pc+" for "+this);
}

function use(pc, count){ // defined by machine_base
	this.setUser(pc);

	if (!count) count = 1;
	if (this.getClassProp('max_fuel') != 0){
		this.setInstanceProp('fuel_level', this.getInstanceProp('fuel_level')-(count));

		if (this.getInstanceProp('fuel_level') < 0) this.setInstanceProp('fuel_level', 0);

		if (this.getInstanceProp('fuel_level') <= 10){
			this.lowFuelAlert();
		}
	}

	this.broadcastStatus();
}

function verifyDisassemble(pc){ // defined by machine_base
	pc.prompts_add({
		is_modal : true,
		txt: 'Are you sure you want to disassemble this? The machine contains items belonging to other players that will be destroyed.',
		choices	: [
				{ value : 'yes', label : 'Yes' },
				{ value : 'no', label : 'No' },
			],
		escape_value: 'no',
		callback	: 'prompts_itemstack_location_callback',
		itemstack_tsid: this.tsid
	});
}

// global block from machine_base
var is_machine = true;

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("fuelmaking_1"))) out.push([1, "You need the skill <a href=\"\/skills\/91\/\" glitch=\"skill|fuelmaking_1\">Fuelmaking<\/a> to use this."]);
	out.push([2, "You'll need a <a href=\"\/items\/715\/\" glitch=\"item|machine_stand\">Machine Stand<\/a>, <a href=\"\/items\/716\/\" glitch=\"item|fuelmaker_case\">Fuelmaker Case<\/a>, <a href=\"\/items\/717\/\" glitch=\"item|fuelmaker_core\">Fuelmaker Core<\/a> and <a href=\"\/items\/720\/\" glitch=\"item|blockmaker_engine\">Machine Engine<\/a> to assemble a Fuelmaker."]);
	return out;
}

var tags = [
	"fuelmaker",
	"no_rube",
	"no_trade",
	"no_shelf",
	"machineparts_products",
	"machine_task_limit_upgrade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-60,"y":-136,"w":118,"h":126},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJ9klEQVR42r2YeUxUWRbGnXTSickk\npDMzmbFnMk5m+o\/JLN3T7gqICIrIqqC4srQo4IYLyEALxSKroBabgCDYNMKggAuItEgJCshabLII\niLJvRbEoi2K+OfcCJbSlUkq6ki9FFXnv\/e45557z3Zo3bw5efX2NSkPSFrX3ad4v+Rrpa184KG02\nGJQ0pwxImpsG+1qgiPg1kpaUAWmLLfr6lOYMjN2MwM5OPaj1aTVyczIQFRGEkMDTcHP5L9wEjlzu\nrk5cHm7fw9PDGd6eLvDxckXUhSCIMm++ge1rlvZ01H96hJ9LW7+hlYvZTasrHiLuhwj40EMD\/Dz4\nuyvBCYVnEZuQiAfF5RDXNCAlPRNRcfFw9fDAsaMH4evtCj8fd\/jTNRm3kmdEtaAg65uPTqe0q0kW\ntevJl+FOEfKg6Ph6CUjO+N7xGM4IzyE4IgpBpNDIGJy\/+ANCLsQgMDwK\/oGh8PDxxVHb\/RRRJwSc\nPoW8+z\/NAHyYm2WgMJyUotbR+phHrbu9AZHhgXB1dsApeoiD\/SEY6G\/Av\/75dyirKMPb\/xy8A4Tw\nPReM08Jg+AeFwl8YQqL3wBAE0Gd9fW1orV9DoDbo6WjkYJKuJlSI81CQLxIoBNdUX2HQ0VJLN2pA\nZ2sdCvPu4gyt3MfTGbaH9kJ51VL86Y9\/wJcLfk\/vC6Ciqgpzy72wPW6PI3YncOyEA447OMLe0QmW\nVvugpaWBNWorsVp1BXKzb3O4tmc1qCp\/iOLCHDyqLFIM8OVwt6ivuwldbfXo7302Ix3sAXdup1Dx\nn4QXbYCTTnYw3WUCc9NtsDDbgT0WO7F3z27sszSF9T5z7Le2wKEDllQWjqgU58ru87SxEvm5mSgt\nuq844KuRnmhJ1xM8rikFwWJkqAMvBjrwvL8dQ9JWKNpapostvLqqECVFOQR49+MAqTYETfXlKC64\nB4LF2IsuguwkyHaCbMNzeh+i935J86RaKNLNkPY8Q1\/PU\/RSbfV0PkE31VoX1W\/Ls2o0Pi5H7aNi\nVJTlc4lLHrDa+zjAAUnLDEA\/HwHMzbbB2sqM+pkzfLxZX3NBZIQQCZejEB8XifgfL+BybATiSLGX\nwhEdFYKihyLU14pRW12MmqoiPKoo4HDVlYX8vbgw++MA8UoqYOloaqjggA72h6Grs06m7ds2wXT3\nFmzepPNOaa1XR3xsJAdkQNMBWSTZ3yyK4pJc1NWUKJ7ilqZHKKMbMEB\/P\/cZgFPaYqwHjbWqcv+n\nqbEa15Muc0Bxcc4MQFbbPN3ifJSV5lIJ1HxaDSYlXnoLwGSrAUVxK9TXKMsF1NPVwu20JLmA9XVi\n\/j2PYvED2tFVZxVOMdvF7EYMsKWpSk6Kt3Lt3GGEteoqM\/6vs1GT2s0u3L+X\/s4IPqkvl0WxrrpU\npNiIG+oQdLY+5jec2sWhwf4yADNTExmg0WZdmiraMwDXr1tDY9CVXy83gvTdsydVExtooh4VA5R2\nNhnIazMxF0Mm07ceu3YaE5wOjI10ob1BYwbgjm1GyEhLptZSNpHKyoKZEawtRStNErYJG+rKaBbf\nVQwQ6FOqqSyMZruvKD+L2kUWH3msD1bRA2KiQkkh8COH4ust4MbBh4mcTVhIAK4mXOJAU4BvtRlq\n1FR3qKLPRQXZigNWl+YuLKfdlZlxnRuE6TofHICb1+KRl3cP5eUF9NCHfOCX0mQoob5WRLM190EW\nSYQS2gA1NeUEUojy0jwuBsh2bmnxfd4HCx\/eUxywvbVBxGZl4FmftwCZ3RIKzyD4QjQ8vU4h6Jwv\nj96UOb10OR6RsfE4ZO8IV+\/TcHJ1R0GeiMolG2zRnwwIjBuw0VVHaZkOxupq5YrFWLL4axga6kNw\nygtm3+2BNjmV9ZpreN\/bSLUYHBFJvvAiHFw8oLVRB+fPB1E\/zeViaZYHmJ+bJZ014OtXw2dHnnch\nR5Qug\/vOfAe1EmWyTKuoMavAysYKhps3QUV5Gf+OSW31hJ2yO2EHm8NHoa6uhhXLF4FqGfXUVsjC\nyWrwrQjmZWH2gOMvRK\/HJMi6c4PDOZOdYjtVX08LhgYbuAz0taiVqPF+p6e7jktXR5N\/NjY2hK6e\nDge2tzuItuZarp7OxrkBHH\/5XMTaSmbGNQ54\/Oh+bDMx5Dqw3wK2hy0ndGhCx45YwcbabIZY+2HQ\nQUIfSMlPMk\/ZO1eAY8MDZFafIv3mFQ5oY2XOhz97qLWVqUw\/h5qShfk26otr+Si8khDN\/eTL4R6M\nUtm8D5AmSnRiYuKHj6Gjo4PRLXSkLKT+xwCZO2bpYw9lDobJjCaImelWctFM5KbNTMhNm3A4YyM9\nrNNczUvB3c0R46MSmd4FWE5tii2gv+dp9Cx28Su1poYqPoI83U9SBC1oh6qSKVgFI4qkMZseNN62\nGDHpYavxhEy26HPp05Rh9ccWtNdyNz24k08hVjbyAKtpZzM48qD8OJEtSrP98KGpsTqFNd5rSXFw\nsDvMd+vyZYuwjlqJFs1Zpg3k95i0tdSpvazl0tHWgCbZL3aoYpDsunoaa8xlS8jqs6kyHZAZhvHR\nXjrAt\/IfAXKy0pCdlSotvnNH6T0RHFlI6RCxC4ektKqc29w9792zCwZ6G3j6Nhtu5D1xFUl55VKo\nEoiq8nKsVmFagWVLv8XSJf+hRX0LR4cj3Biwxs9czJTlpyMth2O+cwpuSu+MIgCl8TFJE7vwQ3pU\nkU8T4I5MZeRYfrwUhtCg029EDohNmhspl3lXaKBodrXX83Sz1LPeOB1MprtpKXLhXr8akM4G7lPF\nDl5llGJ5cHdveiEhZPHbEcT4iNlL2mljI70YfUFHTVrh2HAv1\/hY\/6Skb8R3puJwA3QKLKDzsDw4\nUaoL4oR\/lp\/eV6PS6FEK\/fBQB18hOzSxJsuKm00BlpoOslw9XU\/pOPkEvd10zJS0o6+3jf\/dL6Hj\n6GA3HUc7SO14Mdg5uZg+GVx7S538lDK4G8ekyaF\/UXvPYb1XPBtANrZYn2ym4maFz3YiM51TByFm\nCJiPZC2F\/bRRyTYF9bna6tJ3wmWm2FSKEld+9f4RN8pS+8sCZmdeQeY1O2FmssZvPtCcoSSlXvXT\ndR+kp+5Adb43d9BzCcjM7FtwyQfMZjV\/+\/vbNDuoPtJiN8MjRhupSdtRI06eU8CGx29aiuh2OOLC\n9NlmmD8bvs8pgr\/yc17q5nDg324BTl8Jks5\/LchMPetO5+EHacl+beK8MNzLTEJG+lUysiUfBchG\nGq+3tDDcitU+qOjvlZ+Tfj3t82eTq1Oa\/N98WsR8wdG\/Ltlv+qXBldB\/aFubLxI4OR12vxDm6Zea\n6OJ5JSE8\/HpS2I3rCS6oLbmAPFEMrvwvRgbI7P6tq66DEX7LbX\/2rDl\/ffae7xdMir3mCwSC36qo\nqHyxXf93ZkKXvwVaGH+hO9u0stf\/AR8EaEHEInxXAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/fuelmaker-1337715179.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: true,
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
	"fuelmaker",
	"no_rube",
	"no_trade",
	"no_shelf",
	"machineparts_products",
	"machine_task_limit_upgrade"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"c"	: "collect",
	"e"	: "disassemble",
	"n"	: "install",
	"u"	: "use",
	"y"	: "fully_disassemble",
	"g"	: "place",
	"h"	: "refuel"
};
itemDef.keys_in_pack = {};

log.info("fuelmaker.js LOADED");

// generated ok 2012-09-26 14:38:16 by lizg
