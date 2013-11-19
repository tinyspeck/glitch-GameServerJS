//#include include/takeable.js

var label = "Machine Stand";
var version = "1347677145";
var name_single = "Machine Stand";
var name_plural = "Machine Stands";
var article = "a";
var description = "This generic machine stand provides just the right foundation upon which many a machine can be built.  As with all good foundations, once assembled it cannot be moved.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 500;
var input_for = [];
var parent_classes = ["machine_stand", "machine_part_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"machine_class_id"	: "",	// defined by machine_part_base
	"machine_step_id"	: "1"	// defined by machine_part_base
};

var instancePropsDef = {};

var verbs = {};

verbs.add_chassis = { // defined by machine_stand
	"name"				: "add component",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Add the next piece of this machine. Takes 20 energy",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Add {$stack_name} to this machine",
	"drop_ok_code"			: function(stack, pc){

		if (stack.is_machine_part && stack.getClassProp('machine_step_id') == 2){
			return true;
		}

		return false;
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.is_assembled) return {state:null};

		if (!pc.skills_has('engineering_1')){
			return {state:'disabled', reason: "You need to know Engineering to do this."};
		}

		if (!pc.metabolics_try_dec('energy', 20)) return {state:'disabled', reason: "You don't have enough energy to do that!"}
		return {state:'enabled'};
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();

		for (var i in items){
			var it = items[i];
			if (it.is_machine_part && it.getClassProp('machine_step_id') == 2){
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
			pc.sendActivity("You don't have any parts that can go here!");
			return {
				'ok' : 0,
				'txt' : "You don't have any parts that can go here!",
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

			return true;
		}

		return false;
	}
};

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

verbs.assemble_woodworker = { // defined by machine_stand
	"name"				: "assemble a Woodworker",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Assemble a Woodworker",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.imagination_has_upgrade('engineering_assemble_machine')){
		    return {state:null};
		}

		if (!pc.items_has('woodworker_chassis', 1) ||
		    !pc.items_has('woodworker_fuser', 1) ||
		    !pc.items_has('blockmaker_engine', 1)){
			return {state:null};
		}

		/*
		removing until quest is rebuilt
		if (pc.getQuestStatus('engineering_assemble_machine') != 'done'){
			return {state:'disabled', reason:'You must complete the Machine Stop Pit Stop quest first.'};
		}*/

		if (!this.is_assembled){
			return {state:'disabled', reason:'The Machine Stand must be assembled'};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!pc.items_has('woodworker_chassis', 1) ||
		    !pc.items_has('woodworker_fuser', 1) ||
		    !pc.items_has('blockmaker_engine', 1)){
			return;
		}

		var stack = pc.removeItemStackClass('woodworker_chassis', 1);
		stack.apiDelete();
		stack = pc.removeItemStackClass('woodworker_fuser', 1);
		stack.apiDelete();
		stack = pc.removeItemStackClass('blockmaker_engine', 1);
		stack.apiDelete();


		this.autoAssemble('woodworker', pc);
	}
};

verbs.assemble_metalmaker = { // defined by machine_stand
	"name"				: "assemble a Metalmaker",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Assemble a Metalmaker",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.imagination_has_upgrade('engineering_assemble_machine')){
		    return {state:null};
		}

		if (!pc.items_has('metalmaker_mechanism', 1) ||
		    !pc.items_has('metalmaker_tooler', 1) ||
		    !pc.items_has('blockmaker_engine', 1)){
			return {state:null};
		}

		/*
		removing until quest is rebuilt
		if (pc.getQuestStatus('engineering_assemble_machine') != 'done'){
			return {state:'disabled', reason:'You must complete the Machine Stop Pit Stop quest first.'};
		}*/

		if (!this.is_assembled){
			return {state:'disabled', reason:'The Machine Stand must be assembled'};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!pc.items_has('metalmaker_mechanism', 1) ||
		    !pc.items_has('metalmaker_tooler', 1) ||
		    !pc.items_has('blockmaker_engine', 1)){
			return;
		}

		var stack = pc.removeItemStackClass('metalmaker_mechanism', 1);
		stack.apiDelete();
		stack = pc.removeItemStackClass('metalmaker_tooler', 1);
		stack.apiDelete();
		stack = pc.removeItemStackClass('blockmaker_engine', 1);
		stack.apiDelete();


		this.autoAssemble('metalmaker', pc);
	}
};

verbs.assemble_fuelmaker = { // defined by machine_stand
	"name"				: "assemble a Fuelmaker",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Assemble a Fuelmaker",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.imagination_has_upgrade('engineering_assemble_machine')){
		    return {state:null};
		}

		if (!pc.items_has('fuelmaker_case', 1) ||
		    !pc.items_has('fuelmaker_core', 1) ||
		    !pc.items_has('blockmaker_engine', 1)){
			return {state:null};
		}

		/*
		removing until quest is rebuilt
		if (pc.getQuestStatus('engineering_assemble_machine') != 'done'){
			return {state:'disabled', reason:'You must complete the Machine Stop Pit Stop quest first.'};
		}*/

		if (!this.is_assembled){
			return {state:'disabled', reason:'The Machine Stand must be assembled'};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!pc.items_has('fuelmaker_case', 1) ||
		    !pc.items_has('fuelmaker_core', 1) ||
		    !pc.items_has('blockmaker_engine', 1)){
			return;
		}

		var stack = pc.removeItemStackClass('fuelmaker_case', 1);
		stack.apiDelete();
		stack = pc.removeItemStackClass('fuelmaker_core', 1);
		stack.apiDelete();
		stack = pc.removeItemStackClass('blockmaker_engine', 1);
		stack.apiDelete();


		this.autoAssemble('fuelmaker', pc);
	}
};

verbs.drop = { // defined by machine_stand
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


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


		var pre_msg = this.buildVerbMessage(msg.count, 'drop', 'dropped', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.assemble_blockmaker = { // defined by machine_stand
	"name"				: "assemble a Blockmaker",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Assemble a Blockmaker",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.imagination_has_upgrade('engineering_assemble_machine')){
		    return {state:null};
		}

		if (!pc.items_has('blockmaker_chassis', 1) ||
		    !pc.items_has('blockmaker_engine', 1) ||
		    !pc.items_has('blockmaker_plates', 1)){
			return {state:null};
		}

		/*
		removing until quest is rebuilt
		if (pc.getQuestStatus('engineering_assemble_machine') != 'done'){
			return {state:'disabled', reason:'You must complete the Machine Stop Pit Stop quest first.'};
		}*/

		if (!this.is_assembled){
			return {state:'disabled', reason:'The Machine Stand must be assembled'};
		}


		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (!pc.items_has('blockmaker_chassis', 1) ||
		    !pc.items_has('blockmaker_engine', 1) ||
		    !pc.items_has('blockmaker_plates', 1)){
			return;
		}

		var stack = pc.removeItemStackClass('blockmaker_chassis', 1);
		stack.apiDelete();
		stack = pc.removeItemStackClass('blockmaker_engine', 1);
		stack.apiDelete();
		stack = pc.removeItemStackClass('blockmaker_plates', 1);
		stack.apiDelete();


		this.autoAssemble('blockmaker', pc);
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

verbs.disassemble = { // defined by machine_part_base
	"name"				: "disassemble",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Uninstall the Machine Stand. Takes 15 energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.is_assembled) return {state:null};
		if (this.class_tsid != 'machine_stand') return {state:null};

		if (!pc.skills_has('engineering_1')){
			return {state:'disabled', reason: "You need to know Engineering to do this."};
		}

		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc) && !this.container.acl_keys_player_has_key(pc)){
			return {state:'disabled', reason: "Only the owner of the location can disassemble this "+this.name_single};
		}

		if (!pc.metabolics_try_dec('energy', 15)) return {state:'disabled', reason: "You don't have enough energy to do that!"}
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

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


		// Start overlays
		var annc = {
			type: 'itemstack_overlay',
			duration: 2000,
			locking: true,
			itemstack_tsid: this.tsid,
			delta_x: delta_x,
			delta_y: 20,
			swf_url: pc.overlay_key_to_url('disassembling'),
			word_progress: config.word_progress_map['disassembling']
		};

		if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);

		pc.apiSendAnnouncement(annc);

		this.apiSetTimer('onDisassembleStand', 2000 + intval(annc['delay_ms']));

		var pre_msg = this.buildVerbMessage(msg.count, 'disassemble', 'disassembled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		this.onDisassembled(pc);

		return failed ? false : true;
	}
};

verbs.place = { // defined by machine_part_base
	"name"				: "place",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.is_assembled){
			return "Place the next piece of this machine.";
		}
		else{
			var acceptable_machines = this.getAcceptableMachines();
			if (!acceptable_machines.length){
				return "Place on the ground for assembly.";
			}
			else{
				var machine_names = [];

				for (var i=0; i<acceptable_machines.length; i++){
					var proto = apiFindItemPrototype(acceptable_machines[i]);
					machine_names.push(proto.name_single);
				}
				return "Place on the "+pretty_list(machine_names, ' or ')+" for assembly.";
			}
		}
	},
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Place {$stack_name}",
	"drop_ok_code"			: function(stack, pc){

		if (!this.is_assembled) return false;

		if (!pc.skills_has('engineering_1')) return false;

		if (in_array(stack.class_tsid, ['blockmaker_chassis', 'fuelmaker_case'])) return true;

		return false;
	},
	"conditions"			: function(pc, drop_stack){

		var acceptable_machines = this.getAcceptableMachines();
		if (this.is_assembled && drop_stack){
			return {state:'enabled'};
		}
		else{
			if (this.isOnGround()) return {state:null};

			if (!pc.skills_has('engineering_1')){
				return {state:'disabled', reason: "You need to know Engineering to do this."};
			}

			if (!acceptable_machines.length){
				
				if (this.canDrop){
					var can_drop = this.canDrop(pc, drop_stack);
					if (!can_drop['ok']){
						if (!can_drop['error']) return {state:null};
						return {state:'disabled', reason: can_drop['error']};
					}
				}

				// This can be placed anywhere (machine_stand)
				return {state:'enabled'};
			}
			else{
				var machine = this.getCloseMachine(pc);
				if (machine){
					return {state:'enabled'};
				}
				else{
					return {state:'disabled', reason: "There are no nearby machines currently in need of this part."};
				}
			}
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var acceptable_machines = this.getAcceptableMachines();
		if (this.is_assembled){
			if (msg.target_itemstack_tsid){
				var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, 1);
			}
			else{
				var stack = pc.removeItemStackClass(msg.target_item_class, 1);
			}

			stack.verbs['place'].handler.call(stack, pc, msg);

			return true;
		}
		else{
			if (!acceptable_machines.length){
				// Just drop it (machine_stand)
				var success = this.takeable_drop(pc, msg);
			}
			else{
				var machine = this.getCloseMachine(pc);

				if (machine){
					var machine_x = machine.x;
					// Apply it to the machine
					var success = machine.applyPart(this);
					if (success){
						// Which direction are we "facing"?
						if (machine_x < pc.x){
							var endpoint = machine_x+100;
							var face = 'left';
						}
						else{
							var endpoint = machine_x-100;
							var face = 'right';
						}


						// Move the player
						var distance = Math.abs(pc.x-endpoint);
						pc.moveAvatar(endpoint, pc.y, face);

						this.apiDelete();
					}
				}
			}
		}

		failed = success ? 0 : 1;

		var pre_msg = this.buildVerbMessage(msg.count, 'place', 'placed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.assemble = { // defined by machine_part_base
	"name"				: "assemble",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Assemble into a Machine Stand. Requires 20 energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.assembly_step || this.is_assembled) return {state:null};

		if (!pc.skills_has('engineering_1')){
			return {state:'disabled', reason: "You need to know Engineering to do this."};
		}

		var acceptable_machines = this. getAcceptableMachines();
		if (!acceptable_machines.length){
			// This can be placed anywhere (machine_stand)

			if (!pc.metabolics_try_dec('energy', 20)) return {state:'disabled', reason: "You don't have enough energy!"};
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

		this.assembly_step = 1;
		this.setAndBroadcastState('start');
		this.apiSetTimer('onAssemblyStep', 1000);
		this.container.announce_sound_to_all('STAND1');

		pc.metabolics_lose_energy(20);
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


		// Start overlays
		var annc = {
			type: 'itemstack_overlay',
			duration: 5000,
			locking: true,
			itemstack_tsid: this.tsid,
			delta_x: delta_x,
			delta_y: 20,
			swf_url: pc.overlay_key_to_url('assembling'),
			word_progress: config.word_progress_map['assembling']
		};

		if (distance) annc['delay_ms'] = Math.round(distance / 400 * 1000);

		pc.apiSendAnnouncement(annc);

		var pre_msg = this.buildVerbMessage(msg.count, 'assemble', 'assembled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		this.onAssembled(pc);
		this.assembler = pc;

		return failed ? false : true;
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function parent_verb_machine_part_base_drop(pc, msg, suppress_activity){
	// the child class defines this verb not defined by the direct parent, but defined by a grandparent.
	// this stub allows the child to always call the (direct) parent for any inherited verbs.
	return this.parent_verb_takeable_drop(pc, msg, suppress_activity);
};

function parent_verb_machine_part_base_drop_effects(pc){
	return this.parent_verb_takeable_drop_effects(pc);
};

function autoAssemble(machine_id, pc){ // defined by machine_stand
	var machine = this.replaceWith(machine_id, false, 1);
	if (machine){
		machine.assembler = pc;

		machine.auto_assemble = true;
		machine.setUser(pc);
		machine.onApplyPart();
	}
}

function canDrop(pc, drop_stack){ // defined by machine_stand
	// Machine Stand cannot be placed within 200px of another Machine Stand, closer than 70 px to the edge of the screen, and in the instance spaces.
	// In those cases, the "Place" verb is grayed out and tooltip says: "This Machine Stand cannot be placed here."

	var closest_stand = pc.findCloseStack('machine_stand', 200);
	if (closest_stand){
		return {error: "This Machine Stand cannot be placed here."};
	}

	function is_machine(stack){ return stack.is_machine}
	var closest_machine = pc.findCloseStack(is_machine, 200);
	if (closest_machine){
		return {error: "This Machine Stand cannot be placed here."};
	}

	if (pc.x <= pc.location.geo.l+70 || pc.x >= pc.location.geo.r-70){
		return {error: "This Machine Stand cannot be placed here."};
	}

	if (pc.location.isInstance()){
		return {error: "This Machine Stand cannot be placed here."};
	}

	return {ok: 1}
}

function onAssembled(pc){ // defined by machine_stand
	if (pc && pc.buffs_has('machine_shop_pit_stop_in_time_period')) {
		var q = pc.getQuestInstance('engineering_assemble_machine');
		if (q) q.onAssemblyStart(pc);
	}
}

function onDisassembled(pc){ // defined by machine_stand
	if (pc && pc.buffs_has('machine_shop_pit_stop_in_time_period')) {
		var q = pc.getQuestInstance('engineering_assemble_machine');
		if (q) q.onDisassembled(pc);
	}
}

function applyPart(part){ // defined by machine_part_base
	var acceptable_machines = this.getAcceptableMachines();
	if (!acceptable_machines.length){
		// Pretend we are a machine!

		var part_acceptable_machines = part.getAcceptableMachines();
		if (part_acceptable_machines.length != 1) return false;

		var part_machine_step_id = intval(part.getClassProp('machine_step_id'));
		if (part_machine_step_id != 2) return false;

		// Become a machine of part_acceptable_machines[0] at step 2
		var machine = this.replaceWith(part_acceptable_machines[0]);
		if (machine) {
			machine.onApplyPart();
			if (this.assembler) { 
				machine.assembler = this.assembler;
				//log.info("machine assembler is "+this.assembler);
			}
		}
		return true;
	}
	return false;
}

function canPickup(pc, drop_stack){ // defined by machine_part_base
	if (this.is_assembled){
		return {ok:0, error: 'It is assembled.'};
	}
	else if (this.assembly_step){
		return {ok:0, error: 'It is being assembled.'};
	}
	else if (this.class_tsid == 'machine_stand' && !pc.metabolics_try_dec('energy', 5)){
		return {state:'disabled', reason: "You don't have enough energy to do that!"};
	}
	else{
		return {ok:1};
	}
}

function getAcceptableMachines(){ // defined by machine_part_base
	var machine_class_id = this.getClassProp('machine_class_id');
	if (machine_class_id){
		return machine_class_id.split(',');
	}
	else{
		return [];
	}
}

function getCloseMachine(pc){ // defined by machine_part_base
	var machine_step_id = intval(this.getClassProp('machine_step_id'));

	if (machine_step_id == 2){
		// We need to find a stand
		function is_stand(it){ return it.class_id =='machine_stand' && it.is_assembled; }
		var machine = pc.findCloseStack(is_stand, 200);
	}
	else{
		// We need a machine nearby of the right type and state
		var acceptable_machines = this.getAcceptableMachines();
		var this_class_id = this.class_id;
		function is_machine(it, args){ return it.is_machine && in_array_real(it.class_id, args) && it.getNextPartClass() == this_class_id; }
		var machine = pc.findCloseStack(is_machine, 200, acceptable_machines);

		// not currently placing a part?
		if (machine && machine.placing_part_step){
			return null;
		}
	}

	return machine;
}

function onAssemblyStep(){ // defined by machine_part_base
	if (this.assembly_step == 1){
		this.assembly_step = 2;
		this.setAndBroadcastState('stand1');
		this.apiSetTimer('onAssemblyStep', 1100);
	}
	else if (this.assembly_step == 2){
		this.assembly_step = 3;
		this.setAndBroadcastState('stand2');
		this.apiSetTimer('onAssemblyStep', 1100);
	}
	else if (this.assembly_step == 3){
		this.setAndBroadcastState('stand2Hold');
		this.is_assembled = true;
	}

	if (this.auto_build){
		if (!this.is_assembled){
			if (!this.apiTimerExists('onAssemblyStep')){
				this.apiSetTimer('onApplyPart', 1000);
			}
		}else{
			delete this.auto_build;
		}
	}
}

function onCreate(){ // defined by machine_part_base
	if (this.class_tsid == 'machine_stand') this.setAndBroadcastState('street_view');
}

function onDisassembleStand(){ // defined by machine_part_base
	delete this.is_assembled;
	delete this.assembly_step;
	this.container.announce_sound_to_all('STAND1');
	this.setAndBroadcastState('start');
}

function onDrop(pc, msg){ // defined by machine_part_base
	if (this.class_tsid == 'machine_stand'){
		this.setAndBroadcastState('street_view');
	}
}

function onPickup(pc, msg){ // defined by machine_part_base
	if (this.class_id == 'machine_stand') pc.metabolics_lose_energy(5);
	this.setAndBroadcastState('iconic');
}

// global block from machine_part_base
var is_machine_part = true;

function parent_canDrop(pc, drop_stack){ // defined by machine_part_base
	if (!pc.skills_has('engineering_1')){
		return {ok: 1};
	}

	var acceptable_machines = this.getAcceptableMachines();
	if (!acceptable_machines.length){
		// This can be placed anywhere (machine_stand)
		return {ok:0};
	}
	else{
		var machine = this.getCloseMachine(pc);
		if (machine){
			return {ok:0};
		}
		else{
			return {ok:1};
		}
	}
}

function parent_onAssembled(pc){ // defined by machine_part_base
	//
	// Do nothing
	//
}

function parent_onDisassembled(pc){ // defined by machine_part_base
	//
	// Do nothing
	//
}

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("engineering_1"))) out.push([1, "You need the skill <a href=\"\/skills\/92\/\" glitch=\"skill|engineering_1\">Engineering<\/a> to assemble machines."]);
	out.push([2, "You can use this to assemble a <a href=\"\/items\/713\/\" glitch=\"item|blockmaker\">Blockmaker<\/a>, a <a href=\"\/items\/714\/\" glitch=\"item|fuelmaker\">Fuelmaker<\/a>, a <a href=\"\/items\/995\/\" glitch=\"item|metalmaker\">Metal Machine<\/a> or a <a href=\"\/items\/1183\/\" glitch=\"item|woodworker\">Woodworker<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"machineparts_products",
	"blockmaker",
	"fuelmaker",
	"metalmachine",
	"woodworker",
	"no_rube",
	"no_shelf"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-71,"y":-75,"w":142,"h":76},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFHUlEQVR42u3Y7U9TVxwHcF+YJSZL\neLFXezMB4xKzRUJEoAhWaaeUshXkyQYUJMGmBsYsbkQevLMUWh5rQaD0kacio0AVig90eBfQCdi1\nE9HNZJuZ0ewhaOf2B3x3z3VlMMAVRpAl\/SUn557b3tPP+d7TS8qmTf7yl7\/89f+oDpOOu6GBFyxm\nasPinjl3BfRb26kNi5t1cegnUwfw1B0F5vghGT91c9TMmPK4okQeF2dVt7\/drP9vi\/a4wkMYhIfA\nfG0EP+vm2AieWUQBwT9zRW1dav6K8lJq1an9lRDWsv0z\/dGhCtsqUuNwV5raatuPk4l45akt136b\nEeDBeBJ8To3Ev5642\/a9cHQGLw2USqXcV5GaFzczKsSti+G41rEMcHjISs26I7PWa6\/Nx91xHGRx\no5Zt6GsOdC\/56Ji4durhesK8OPc1PhxdO7w4j6M1OGABrux0Kve7sVhMO+JxvTeWuXDvuuA8M4dw\nj07EsCmYbTZtoGfIGBSyKL3kZF6B+mwEbg4LoamRoLgwHvfHs\/GTMxaPJvh4PMldc9wfDw7DeZk3\nh7ObgpbGkUpJ5tMaeTgaLEJUmgSopfagtToGP4yF41x5DJjXMT3Cwy\/u9zE9moQnU\/wVYX52CRcl\n9\/WIwDccqdaaaKrk5B53vzEB43089GpjkC\/ZzwLvOcKRmx07B77RHwll6V60nU\/Gr3eS8fybw3h+\n\/4OXArvOCxbg5if3AhiY9a\/PPKk4lHtasgv1Jbsgl0XiaFo0jLUcFkVAJEVH94txuyYamWIeiyfg\no5lxaKgSY3Y6CZ57hxaBr\/ZksP2zu0mYGIxdkNywKVDk00PZKE8IaSw7SKuL+R518XuolO1DUS4H\nJdIIFOdFQJzKxScf7mOBvdo9bKqkJ2OSLtkKBEvG5H1KKhWPnenMXjuCR658PJ1JQ19rKC7pguaA\nL72ty1V3Rz23TVf+8OpAHcz12ehpzkUTFYfaIh4+zWcgpZHQK3ez4OPH\/t4GLIpJmoxJ0mTsTZy2\n8lF9JhKWc29hyBCECw3BkGZshyQ91Heg0+kIoD\/vtk3cGMDY9R64b9vZfviSEfQVHejhRlia86Eu\nE0FbnsCiqz6ORcOZaPQ2RrDbgaC8KQ6ao9ht4LRHsAvQqbajW7OVWVwQclLewUdZuyHLCfcNaB8w\nZLlvD3kIynGlcwGQjAnSoFVCfuYkeroaQBbxxVU9WpQZtEEhJM2jlQvYlDWlXHTURqGlMhJpKfvn\nvly9TcGoKgrE8fSdqCw5hipFEW212iiHg6Zu3pwQLXkrv5octLmm7DTBeBtB2axaFkYg5BwBkmNy\n7suxPnR3aKBvUarnz2dQxG\/VK+JFeoVQzaIrhGgoO4BWBQ+XTTEwKjlIE+yAvFDkqa6u+14mO5V5\n9mwll+kpmUwmZabYvAipbSo3j45YcGu8fw5IIATkHZNjAhunP0NfTzMu9umcCqow2juHpdNUIJHk\nhSz3xTNUCAr0FfFmAi7ICrPJy\/JCTpzIP+Tr1tsSFrbz3RrVaVmnuc5mNtRgcEAPk66KhZEkSbsy\nZMYl5nzhydxS5po3509gtVpFFEWxH6jXt1AGg\/6W2dx+Q6WqNtpsg2ZvMnw+P2AtfgttyckRc0qL\n8+Ta5opvu9rUuDxoQle7+veUpDiC2PKyi+vrNeSB+8bcH4BWw12me3vs+ghXXVfbtdY\/3F5n2rZM\ncaJYJstNYI5fW+kEDJCAN6tUqoCSEirM\/28Of\/nLXxuo\/gT5I64LfmC0CwAAAABJRU5ErkJggg==\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-03\/1299094029-9905.swf",
	admin_props	: false,
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
	"machineparts_products",
	"blockmaker",
	"fuelmaker",
	"metalmachine",
	"woodworker",
	"no_rube",
	"no_shelf"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "disassemble",
	"c"	: "add_chassis",
	"g"	: "assemble",
	"o"	: "assemble_blockmaker",
	"u"	: "assemble_fuelmaker",
	"t"	: "assemble_metalmaker",
	"k"	: "assemble_woodworker",
	"h"	: "place"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"v"	: "give",
	"h"	: "place"
};

log.info("machine_stand.js LOADED");

// generated ok 2012-09-14 19:45:45 by martlume
