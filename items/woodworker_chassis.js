//#include include/takeable.js

var label = "Woodworker Chassis";
var version = "1347677145";
var name_single = "Woodworker Chassis";
var name_plural = "Woodworker Chassis";
var article = "a";
var description = "One of the four essential parts of the Woodworker, the chassis is essential in helping every upstanding wannabe woodworker gird their woodworkerly loin-parts and whittle their brown stuff into something wonderful.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1250;
var input_for = [];
var parent_classes = ["woodworker_chassis", "machine_part_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"machine_class_id"	: "woodworker",	// defined by machine_part_base (overridden by woodworker_chassis)
	"machine_step_id"	: "3"	// defined by machine_part_base (overridden by woodworker_chassis)
};

var instancePropsDef = {};

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

function canDrop(pc, drop_stack){ // defined by machine_part_base
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

function onAssembled(pc){ // defined by machine_part_base
	//
	// Do nothing
	//
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

function onDisassembled(pc){ // defined by machine_part_base
	//
	// Do nothing
	//
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

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("engineering_1"))) out.push([1, "You need the <a href=\"\/skills\/92\/\" glitch=\"skill|engineering_1\">Engineering<\/a> skill to assemble machines."]);
	out.push([2, "You can use this to assemble a <a href=\"\/items\/1183\/\" glitch=\"item|woodworker\">Woodworker<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"woodworker",
	"machineparts_products",
	"no_shelf"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-66,"y":-110,"w":132,"h":110},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALKklEQVR42u2Y+VdTZx7G+xe0trWI\ngOLCLjvIIoQAQogQspAESEJISEiQJewSthACsqMIblXQ0IrLuNSl2sWl1O7t2NKO0zo9nTnOTKdn\nfphzxj\/hme\/7AlEEHTtz5pz5wXvO59ybm5vkud\/teW9eeOH59nx78nanI9pwvTFy7nRF6OxKXLJt\ncV+uCXM+zq3mSCf77FeOGOFK3LHHvfQfi\/rntQ7\/n46onO\/ZE+5PlQXBpQxEWVYQpGlRyyjKiIAx\nO3wZtrwwNOYvZVwfhveaouHQJCJDIBD+amH\/uNIm\/NMxnXtuMBNv14WDooNDxnD0ayI4tvyoJ7KS\n+EX02VE4URmDM7Z4qLKTkJMpQHpaat2vFvj7gZTZ7wdSwPhhMAU\/jQhw\/2AefhxOw72BbR5+Gt\/B\n+XFvFu7uTsR3vYm4t1e0hG96knCnKw5z3fH4tCOeRy1XEAOr0BuF4m1MoPOZhU1NTfmPDA2MHWov\nfXCsrRBTrWpM2lU40lKA13cpMNmiwPlWEa60b8dl4qI9HeeaBbjVnogvnIn4sntl2HufOBIwWZkI\nqSAcTVmvoU\/qDV1eyrMJvHDmRNTEvjF3j8uFjo4O1FRXQaWQQq2Uo1ClgJpBx6UlWhhLS1Cq10FP\nxyXaYpTotNBqilFcXIRCtYquVaKgQAGDWgKbTowaTQ6qi0WoLMqCVi5CuTQJvflrMK72hV6S+nSB\nl986Izt4YHy2p6cHDocD1ZUVyNshQkJ8LCIjtiApMf6ppKUm0w+keBBlpUMsyvSgkEmQl5eLnJwc\n5OaKoZRLYBaHY0DmjX0qHxK4QgRv3Ljx0vlTbxj2j4\/d7+vrAxPH6O7uRmNjIyqsVlgs5TAaDDwi\nKlUBlEoFChRy\/iOZGUKkC1P5nrEtOWGZ8NSUZOTl7oBEIqHP5EIupb04Cyl0rT4zCINyb4w9SeD0\n5KGxof4ePI6joxWtLc2w72pCr6sLA309sNPrhvo6tLW2oNvpgNPRicaGeroBC0wmEwx0EzqWYq0G\nxUUsxWqeYiWlWCaTQZovgVKRj+0ZAiQlxCEuJgrGzAAMkMC9ShL4pBo0lmgflBQXQluo4pQb9bCa\nDCij2qL3+HGlxQRLmYHeK+XH1RXl2FleRudKYau0oN\/V6aGrvQVOusGuDjs\/dhA9znZI88Q8agnx\nMUhJiIU5YwO68rx4BCcKfWFRZa0sUFeoNCjy82CQpcOm2OqhSpGEiiIxrIU5sKhFMCuzUKQsoJtQ\nc0qoEfTUEOy4iNJeWCCHSk7NpJDBRM2j1xTyc0o6ZygpRjKlOzkhHuKUaDSJvOGSrMGQYi0aMldj\niETWyWNXFtjvcgjZl9VJI\/kHRincz0pvwWZ0yALRtkADOUNFXjSqZfGoLUiEVZ4CBaVWSvWavi0B\nmrRAdOzwwm4aKyMKb4wWrEVl2itozXkNtU8SeOXsm8Lmumo4dYl42xaGLxzx+LwzDp8R3wzTcB2k\nWUfnL9XMc5Xc5KO2WNxujcGHi9hjcK1uC7\/uMqMmlHPUGsejuD09DUpBMDpzvdAvmxc2QrSTMFPy\ny2ijfZ087skCHfYm1CoScGtXFO72bcPv+pLx3e5k3GxLwlDBOvRK12JQ4YO9Kl8c1PrDbQ7hxyMF\nPtivDcCN5ih87tiKz4hPO7fiE+JjcooLu9J5rcoluVwgSysTNkKZGibYiFFEv4hOimqNNPbpApvV\nNOHbY7kdfe0iS3Il4manAE6JD40BX7gNGzBj3ozLtRF88h\/RruOwAp8o9sdH7fG43RaHD4nZ1jh8\nYI\/FmaY01FBDKaR5XGAPDWUmbGiBUUId+yK6KLI2WSxEaUnuZQKvXZjxXxT4pTMBX3TNwyJyvSOV\nR+k3FcF4vzmarzoY7xIzlmBcbYrjIt8s24SbLbG40RKDG7ticJ14vzkGJ+sFXCBrnEWBQ3LKBsd7\noYN9eNrtkk3oK9iICWPkcpGeCFJaWGpYNBhHy0JxoMiPVjERuNoQhbfrIzknykNwuGQTZirCMV68\nAdPGjVz0u43RuNYYhWt0Lbv+DVsKF8i7eUEgE8VmH0svo0+6hiLojXHNJhw1BqMj1xcmSULUEoGd\nLY1c4GJqbhEsIocNIThWGoBzVWG4aIvAW4yacJyqCKXa9MMR\/SaMKP0o\/RtxpS4Sl4lLVAIXGXTt\nqabMJQJZDTJR\/Qu48ui1Yh1O0I2OqDdQs3jx92sl4UuXXfbGWi7wenOMJ5UsItPWCAyr\/HFIs46E\nbsTR0k04ZgzAtCkQ40XrMUmvmQuw2rxAws9Xh+MccbZqyzytYlRbzUsEMmHdtHflr8WkMQiTphD0\ny315ZzPLY99nEkc+bJYbZ8++1NpYB7t6K8ZoVXGkZAPhj6O0v1gbiQ+6hPi4nQqfRsmsPZpz25FM\nNxOF640RnEsUremyAJzeGUbRDcNJivCMNRSnW3JgJbd5VGAPMUHpPFW5BeM0AQZk86IYe6jemVBr\nbvRFj7ghV9eca6ecGiEIpyyBSzhEI2XPwmg5TIIZR\/UbKVJhOEbL\/hNVbFUcxetwr9oPx42b4S4L\nhNsUjOOmIEzXZ3A7XBTYr6BpQPXrtoRRBP3QTSneo\/TxzMXF8dOcHzLLBXa3t8wNN+pwdzQLf9sn\neGb+MJDk4R7xaTtFtyWS835TOA3tMJyvDMKF1myYDSXQybKwuzAEp6vCsU+zmeaqDxcy+ogoNnYW\nu7teEjrnGS+DJbH4YU8W\/jiRi\/vTRvx8tgF\/cevx1+lS\/HLSgp+PF+PvJ\/T45fU8\/HI491fdyPXx\nKrQ21aNZEoSpsmDeCKwJWLQ885BE7abudubN12dX7hqYRWHgA7qptgqHS4O5ayxyd5CeNcZy8F1f\nCr7tTfYwx0nCVz0puHdQie+HhfhhdDu\/9lv63I\/76DM9W\/Hn\/aL5myH2uNpgM2kwpgnAcIHvw2gt\nzMLFcdMm8oKdaCWa6RHAmOLl5gJZAb9p2ozf0rMC4yvi6z4B+hTr0Zzrjx5aDIzrgqluKGW2SD5i\nmPcyS2Rcrd3CPfd6UyT3Z\/Yg9E5DBI7T2GHRYRkyF8uWpXBx1PQRrGmYuJZsL9TTyqY0YZWB19\/4\nUJ\/TqCvGGXIJ5p+LMB+tTPdGcdLTKU1di0axP6dL6o9b5CKLA55xhcT32HQopxpkzx2PimJWyVY0\n7Dwb3mz+1QhffVAUs+rhgO7tbHVaNfk4aQniA\/pRmkVr\/63AR7Fl+5HAWM7NRzjSW8sFMgEeUVI2\narxoFnpR3c2ntlq4ek4d9\/LSfxU6dzXMmhSZOGEKwO3OxPt3R7a77\/QL5253JNCoCKDRsZ5WMGvR\nJiafJGq3e6Mm0xvmNELgDWPqQ4EmwRqP1b3jIQrurlLsNBtRm73eEy02C5lgllJGVdqr7mXi2GbW\n62bL5Bl4o2wz9ip8ZJ7FQ1Oo\/2lrELcuBqu7k9YQbmsTGn+MqvyouH34Dy3CnGHGEsJt7lEmW1So\npOVWOS3vuylabIm\/KI41gyX1lSf\/k6CU5T+olsZx1xhUeC0xZzeJnikP9NjX45xbgDnGtDmIc2Zn\nKHn2loc2R8zYJaigZ5rSjEDYSZR9QVh9xuoHlYJVT\/8fZkd2ttCuiJaNq\/2W3cWYet3sqNKXXGMT\nuUMAty8WIW5jZGFM2IpY55lZYNImhEmvhU4UOy+MutS07eW5Jc3w3267c1f5u\/JXC\/ul3obxwvXO\n\/doN7oO6jbMHdBsfHKIlF7M8tzmY2xuDLSYYU8QBczy3Ob04Htqtq6CJX3VxxXr7X27UkVHsBoaV\nfnV7VOudE5oNF\/cV+c+yWmVdKxGLoJFkQBu\/yvl\/+WcnKyXG8799n2+Pbf8CUKD6vC6Cm5sAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/woodworker_chassis-1332952385.swf",
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
	"no_rube",
	"woodworker",
	"machineparts_products",
	"no_shelf"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "disassemble",
	"c"	: "assemble",
	"h"	: "place"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "place"
};

log.info("woodworker_chassis.js LOADED");

// generated ok 2012-09-14 19:45:45 by martlume
