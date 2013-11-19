var label = "Metal Machine";
var version = "1349288303";
var name_single = "Metal Machine";
var name_plural = "Metal Machines";
var article = "a";
var description = "A bangy, squeaky, marvellous red-hot metal machine. For the mutation of Plain Metal, Tin, Copper and Molybdenum into Metal Rods, Bars and Girders. None more metal.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["metalmaker", "machine_base"];
var has_instance_props = true;

var classProps = {
	"max_step_id"	: "4",	// defined by machine_base
	"max_fuel"	: "200",	// defined by machine_base
	"required_skill"	: "metalwork_1",	// defined by machine_base (overridden by metalmaker)
	"making_type"	: "machine",	// defined by machine_base
	"days_to_store_contents"	: "6",	// defined by machine_base
	"pc_action_distance"	: "80"	// defined by metalmaker
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

verbs.turn_off_music = { // defined by metalmaker
	"name"				: "Turn Music Off",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Stop playing Metal Music while the machine is working",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.imagination_has_upgrade('metalmaking_music')){
			if (this.music_on === undefined || this.music_on) {  // music is on by default
				return {state: 'enabled'};
			}
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.music_on = false;

		pc.announce_sound_stop("METALMAKER");
	}
};

verbs.turn_on_music = { // defined by metalmaker
	"name"				: "Turn Music On",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Play Metal Music while the machine is working",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.imagination_has_upgrade('metalmaking_music')){
			if (this.music_on === false) { 
				return {state: 'enabled'};
			}
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.music_on = true;

		if (this.is_running && this.last_user == pc.tsid) {
			pc.announce_sound('METALMAKER');
		}
	}
};

verbs.fully_disassemble = { // defined by machine_base
	"name"				: "fully disassemble",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
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
	"sort_on"			: 53,
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
	"sort_on"			: 54,
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
	"sort_on"			: 55,
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
	"sort_on"			: 56,
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
	"sort_on"			: 57,
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
	"sort_on"			: 58,
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
	"sort_on"			: 59,
	"tooltip"			: "Get Excited and Make Things. Fuel: $fuel_level\/$max_fuel",
	"is_drop_target"		: false,
	"making"			: {
		slots		: 4,
		try_wait	: 5,
		recipes		: [251, 254, 279, 280, 281, 282, 283, 284, 285, 286, 287],
		skills		: ["metalwork_1"],
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

function getEnergyCost(pc){ // defined by metalmaker
	var step = this.getInstanceProp('current_step_id');

	if (step == 2) return 20;
	if (step == 3) return 10;
	if (step == 4) return 15;
}

function getNextPartClass(){ // defined by metalmaker
	var part_id = this.getInstanceProp('current_step_id');

	if (part_id == 1){
		return 'metalmaker_mechanism';
	}
	else if (part_id == 2){
		return 'metalmaker_tooler';
	}
	else if (part_id == 3){
		return 'blockmaker_engine';
	}

	return null;
}

function getPreviousPartClass(){ // defined by metalmaker
	var part_id = this.getInstanceProp('current_step_id');

	if (part_id == 2){
		return 'metalmaker_mechanism';
	}
	else if (part_id == 3){
		return 'metalmaker_tooler';
	}
	else if (part_id == 4){
		return 'blockmaker_engine';
	}

	return null;
}

function isPlayingMusic(pc){ // defined by metalmaker
	if (pc && pc.imagination_has_upgrade('metalmaking_music')){
		log.info("METAL: player has upgrade");

		if (this.music_on === undefined || this.music_on) {
			log.info("METAL: music is on");

			return true;
		}
	}


	return false;
}

function onApplyPart(part){ // defined by metalmaker
	this.placing_part_step = 1;
	var part_id = intval(this.getInstanceProp('current_step_id')) + 1;

	if (part_id == 2){
		this.setAndBroadcastState('mechanism1');
		this.container.announce_sound_to_all('CHASSIS1');
	}
	else if (part_id == 3){
		this.setAndBroadcastState('tooler1');
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

function onApplyPartStep(){ // defined by metalmaker
	var part_id = this.getInstanceProp('current_step_id');

	if (part_id == 2){
		if (this.placing_part_step == 1){
			this.setAndBroadcastState('mechanism1Hold');
			this.placing_part_step++;
		}
		else if (this.placing_part_step == 2){
			this.setAndBroadcastState('mechanism2');
			this.container.announce_sound_to_all('CHASSIS2');
			this.placing_part_step++;
			this.apiSetTimer('onApplyPartStep', 1100);
		}
		else{
			this.setAndBroadcastState('mechanism2Hold');
			delete this.placing_part_step;
		}
	}
	else if (part_id == 3){
		if (this.placing_part_step == 1){
			this.setAndBroadcastState('tooler1Hold');
			this.placing_part_step++;
		}
		else if (this.placing_part_step == 2){
			this.setAndBroadcastState('tooler2');
			this.container.announce_sound_to_all('CHASSIS2');
			this.placing_part_step++;
			this.apiSetTimer('onApplyPartStep', 1100);
		}
		else{
			this.setAndBroadcastState('tooler2Hold');
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

function onDisassemblePart(){ // defined by metalmaker
	var part_id = this.getInstanceProp('current_step_id');

	if (part_id == 2){
		this.placing_part_step = 2;
		this.container.announce_sound_to_all('FUELMAKER_CASE1');
		this.setAndBroadcastState('mechanism1Hold');
	}
	else if (part_id == 3){
		this.placing_part_step = 2;
		this.container.announce_sound_to_all('FUELMAKER_CORE1');
		this.setAndBroadcastState('tooler1Hold');
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

function onMakingComplete(pc, recipe_id, count){ // defined by metalmaker
	this.is_running = false;

	var chance_of_bonus = 0.08;
	var bonus_base_cost_percentage = 0.20;
	var upgrade_id = 'metalmaking_imagination';

	if (pc && pc.imagination_has_upgrade('metalmaking_music')){
		pc.announce_sound_stop('METALMAKER'); //, true);

		// Find all sloths within 250 pixels and have them do the devil animation.
		var sloths = this.container.find_items("npc_sloth");
		for (var i in sloths) { 
			if (Math.abs(sloths[i].x - this.x) <= 250) { 
				sloths[i].endDevilHorns();
				pc.achievements_increment("sloths", "played_music_for", 1);
			} 
		}

	}

	this.rollCraftingBonusImagination(	pc, 
								recipe_id, 
								count,
								upgrade_id, 
								chance_of_bonus, 
								bonus_base_cost_percentage);


	// Check crafting altar/machine room
	if (!this.isInCraftingAltar()) return false;

	var preface = "Altar bonus! You used a Machine in a Machine Room: ";
	if (pc && recipe_id == 192){
		pc.runDropTable('crafting_altar_bonus_rewards_fuel', this, preface);
	}

	return true;
}

function onMakingStart(pc, recipe_id, count, wait_time){ // defined by metalmaker
	var overlay_id;

	if (pc && pc.imagination_has_upgrade('metalmaking_music')){
		if (this.music_on === undefined || this.music_on === true) { 
			pc.announce_music('METALMAKER', 999);

			// Find all sloths within 250 pixels and have them do the devil animation.
			var sloths = pc.location.find_items("npc_sloth");
			for (var i in sloths) { 
				if (Math.abs(sloths[i].x - this.x) <= 250) { 
					sloths[i].devilHorns();
					//pc.achievements_increment("sloths", "played_music_for", 1);
				} 
			}
		}
	}

	/*
	 Waiting to get overlay assets from Mart
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
	*/
	this.last_use = time();
	this.is_running = true;
}

function onUninstallPart(){ // defined by metalmaker
	delete this.placing_part_step;

	if (!this.last_user) return false;

	var pc = getPlayer(this.last_user);
	var part_name = null;
	var part_class_tsid = null;

	var part_id = this.getInstanceProp('current_step_id');
	if (part_id == 2){
		part_class_tsid = 'metalmaker_mechanism';
		pc.createItemFromSource(part_class_tsid, 1, this);
		var stand = this.replaceWith('machine_stand');
		stand.is_assembled = true;
		if (this.disassembler) {
			this.disassembler.achievements_increment("machines_disassembled", this.class_tsid, 1);
		}
		stand.setAndBroadcastState('stand2Hold');
	}
	else if (part_id == 3){
		part_class_tsid = 'metalmaker_tooler';
		pc.createItemFromSource(part_class_tsid, 1, this);
		this.setAndBroadcastState('mechanism2Hold');
	}
	else if (part_id == 4){
		part_class_tsid = 'blockmaker_engine';
		pc.createItemFromSource(part_class_tsid, 1, this);
		this.setAndBroadcastState('tooler2Hold');
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
	if (pc && (!pc.skills_has("metalwork_1"))) out.push([1, "You need the skill <a href=\"\/skills\/126\/\" glitch=\"skill|metalwork_1\">Metalworking<\/a> to use this."]);
	out.push([2, "You'll need a <a href=\"\/items\/715\/\" glitch=\"item|machine_stand\">Machine Stand<\/a>, <a href=\"\/items\/992\/\" glitch=\"item|metalmaker_mechanism\">Metal Machine Mechanism<\/a>, <a href=\"\/items\/993\/\" glitch=\"item|metalmaker_tooler\">Metal Machine Tooler<\/a> and <a href=\"\/items\/720\/\" glitch=\"item|blockmaker_engine\">Machine Engine<\/a> to assemble a Metalmaker."]);
	return out;
}

var tags = [
	"metalmachine",
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
		'position': {"x":-62,"y":-207,"w":128,"h":198},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAJM0lEQVR42s2YeUyU6xXGTUxu0qQJ\naZo2aTTi0tg2WlBBdhhQB0FAQEUBQUAFWQSUfR9A9m1kU0GGVcaKKCIgitgRCG7oJW6pSbUmNze5\nf\/JX\/376PkfG2HttyhWwneRkZr7vm+\/7vc97znPed1asWKbXtWvXLMsqKgYqK2tMen29bsX\/w+ve\nvXuWAwMDyT09Pbrz5893NDU1YXR0FCdOnHhfWlqua2trT\/6fwRmNfxmYmJxEV1cXqqqqkJOTi8zM\nLPT1XSUgoqOjcfr0aXx1MA8PD3+lnO7lq1fo7u5GVnaeKTMz06KoqEhTXV0jCh47dgx+fn6IiYn5\nuoBbt27VvHjxEgSZnn6A2lo9jh49as1zZWVlmvr6+s8C3r171+KrAGZnZ+sNhnacOpWiVw9FSUkZ\nIqOOmQ6HhZkSEhJmfwyYkpKKlottKCktR1l5FTo6u+dqa2utlw1QFYGpsqoaxSUl+qGhIRQWFuPg\noWDs2bMHBw8exI8Bk5OT0draitevX6P53DkkJiYjPT1bsyxwfX19Fuphsw0NjTDdn5wbHhlFzyUj\n8gt0AnPo0KF\/AwwJCYHW0xO7d3uhsbFxjsUUFxe\/fIB1dXWalpZWNDU148aNG7h5c0hVbbbkGWEI\nmZ6erqb\/lFSwVqtFbGysREx0jFR7TMyJ5QPkq7KyEnq9HnfvjmNiYgJZWTk4rfIsMTER1lbWomB7\nezt27twJOzs7ycHQ0FAEB4eoAd1Ef\/81KtxhY2NjsayAJtP9j4AXWlqg0+nQ2dmpVOqG0WgEDVsV\nzUfAgIBAdHR0ory8HJcuXcLFixflvbe3FxkZGUvTdR4\/fhpBOKpkBtQVFtJmlO1Uq+nORFtbG8KP\nHJFjnGozoLe3N+rq9JIOjY1NUN0HZ8+excmTJxEZGalbJNhjawVjunz5ssCphJfpMplMqKioFDDm\nmbIgmWp\/f38cPnwY8fHxHwFdXd3Q0NAgylLh4uJipX7W0gC+ffsOz549w9TUlECNjY3hzh3GHSmW\n6elpPHz4EI8ePZJ3HjPH8PCwyrt+paxBvhOyoKBAYskAHzx4gPHxcdD3lNVIrrEQ1AIBVJUAg4OD\nuHXrlkAwty5cuICamhrlk4VK5Qppifn5+RLLCmgwGEQFcy4yCMB3gjP5eZ7FRDhGamqq6jglPwHk\n8YiICISFhS0OcFKtWKjOdZXYOTk5kuhRUVHKmINx4MAB8UD6Ho8FBwcjMDBQ8lAp81lAhqpcUU\/B\nLQ5QqWY9MzMjgFxSMfFZoSEq8X19\/QRw\/\/79EvQ+d3d3qVhP1UHCwsM\/C8hB0tAJeERV\/KIAVW5F\nsEA4JVVqBUM4TgvV26egYmPjpIL37dsHD48d0Gg0AkdYKpmbl\/dZBQlIn6TKi8pBBZhMQNoDk38+\nZ3AgKEishP2XKgYEBIhyTk7O2LHjAyin2Qz4KZwZME+dW3SRKL\/TEJBVyQIhFPNMFFSqEYxArq6u\ncHFxgYODg8Dxs1briZzcXAHkCtsMR1NXi1uZ6iUFVJsiNDc3Sy7m5uaJTSQlcfmUIUt75ifBvZSS\nXMV4e+9BZlb2TwDZ7thxeJ8lA+So1YpZRp6rVOGD2A14nJZz5cqV\/+iDZkBez95Lw6fJsyMtCjAp\nKck\/LS3NxIfxRrST48ePI0jlH4uA02kOZ2dn+Pj4CBBTgSZOb+zo6JDPBCOUapt4\/vy5dCZetyjA\nuLi4OXoeQ30WS+Aaj2EGc3JykhzkypmGzcRnUG1OIRWmolevXpW2x20CFXzy5Il0pS8GVEAamq\/Z\nVli5THylKthZzpw5Ay8vL1mxqD2GTF9KSopcz8qm2rQfnj+nlvpUiyoyj0dGRqQzsT1+MaCaSr0Z\njpXLiqViW7ZskXxisJ0x4VksVJhQrHBeH65Mmh7HY2ZlCczrWEwMeusXA6ofzXJKzbbCTZHaD4t\/\nUTEaL3sul1ocBK\/hsmq+dUlHYU5yYAN9lbh\/uxL9xkJc6cnHkfAQuR\/3LQRUQuh\/7s4tQv3wPR9M\nJfhgPoxVt2vXLqxevRpr166V9sbFAa\/hQDggqsbcIri9vT3i4yJQpgtBd+spDBhTMDNxBvGxoeKb\nvCcHrLzUtCAwNRUWCmyWTd8cfCg7BPOPU7VmzRps3LgRVlZW2L59u9gNj3Mw5oFwIUCFqSoV3Lt3\nr9hTVVkyCvPVIvZUFNzc3OCnjnNWTkS5zS0IUD1A5+joKJVJIP6YQQthX6Uqmzdvhq2t7Xyn0MoK\nWu325DyrmYXFiuZ3FgiLqlCXg9ryGDwYy8R3f1MbrpEq+KsOxOfo0pxxu2fLwv4eUVOWvGnTJoGg\nQtu2bRP1OIW8GQ3ZvBDw9fUVhVJT0wSQA2P1sgg4zfRLBmEJTsUIHX08Ugbt4rQFXfWu+OvlP+F2\n1\/qFASq\/s1BQc5aWlpJjGzZsEPU4TZwi5iBbHfcex45Hq0qOFfug33HxQOthpastpWw5qSYXDBwU\nzZ33Ye4FBdhj8poTRjt\/j+H2dXPXW9cufJ9sNmYmfZyygg8qpcq2kmFeJeflfcg9GjITvXq+rXEJ\nxdylDfEevBcVZW5SRV2aCx4OOmDYsF4B\/vHFVO+ff7VguHdPbSwGDR7v60u90FimRerJ3chI8kZo\nsL9ULP974UPpbVSDqnAazYNi0KxZJDRuwmeovGVK+Ps4YrDTA+NGa4EbattQP\/xz4Pg6ELjLf6Rz\nO\/q7nHG2wgeDxjh8\/+wQrrd5oDjLHf94FIq3k67Qpbujp8kT7We1aK7wRKt+HwqzA5GW6IWYSK1M\nqzk4kJhIN0wPuOBG6zqBGzGs\/7LeGxSkLSpKd0D1uY3o7dyJhKO2s+NG+3\/ODNkrJd0l3k3YYarf\nQT7z\/dWYHQrSNWiu8sP3Mz6YGNiL0nx\/PB31xg\/f+mKkdy8uVFijr2mtwHXVrEtUj\/rmS\/hWtlRZ\nbVu1atXqtuoNm3\/4NlyTkmC30WvnKsf6gvXZdUW2bT4+bga9blPvVJ\/1m\/I8N0RH7sCtLpvvehts\n3uSdtntz5byzAOvPuMoAODAOoir3D7jcYImb7Y6+S\/EPx8r5928+iU9f\/C5\/\/ABYqeKX6iPDxsbq\n1xEvb9uWDhhsEuOjd0cfDV5fOtZtNatU+3tOwm8Oqmt+8bX+CV75X84T5Lfz4L+bj5ULvfm\/AE+Y\nNFkWg+TVAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/metalmaker-1342140736.swf",
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
	"metalmachine",
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
	"h"	: "refuel",
	"t"	: "turn_off_music",
	"o"	: "turn_on_music"
};
itemDef.keys_in_pack = {};

log.info("metalmaker.js LOADED");

// generated ok 2012-10-03 11:18:23 by martlume
