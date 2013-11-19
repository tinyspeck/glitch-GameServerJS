//#include include/takeable.js

var label = "Fuelmaker Core";
var version = "1347677145";
var name_single = "Fuelmaker Core";
var name_plural = "Fuelmaker Cores";
var article = "a";
var description = "Install the Fuelmaker core and the final piece of the puzzle will be in place. Now you just need fuel to fuel the Fuelmaker.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1250;
var input_for = [];
var parent_classes = ["fuelmaker_core", "machine_part_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"machine_class_id"	: "fuelmaker",	// defined by machine_part_base (overridden by fuelmaker_core)
	"machine_step_id"	: "3"	// defined by machine_part_base (overridden by fuelmaker_core)
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
	out.push([2, "You can use this to assemble a <a href=\"\/items\/714\/\" glitch=\"item|fuelmaker\">Fuelmaker<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"machineparts_products",
	"fuelmaker",
	"core",
	"no_rube",
	"no_shelf"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-31,"y":-88,"w":61,"h":89},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHvUlEQVR42rVYW3NT1xnlhRnenKQJ\nLtPOmDg4+Kr7xZJs6y5Z1yPJ1t2yJGMBrakvhIaEYJTBNKaQ2sFDktJJq2mGpAmUUqZJHvoQzeSx\nM62fOtM3\/wT9hK\/f2vYRsmtcLAnNrDny8dHZa3\/X9e0jR1r43Lt3s+OTjQ+s195byi\/Ony2fLeUe\nnymmq2cKqWoxn6oWcslqPhcX3ydigUrQ7yrjueXli8ojL\/Jz9+6NrvLyW5ULPy9SJh0jj9tKfb09\n1Hv6lLgODpwmpaKfNOpB0uuUZBrW0KjFSC7nGAUD7h24agG\/uxIM2ttHFhYDMbZSfSGtRkGdx18V\nePnll+iVV16i1179EXV2vkYnTnTST39yglTKfhobMZJeqyK1aqiBpJvvD2+1x2p3bkof3LhSi0i+\n+stDQY+4qlWDgshxJnn06NFdOHbsGP248zhbUkUaJmc0aOq\/H2XSb7xxsnWC712el955+wLFov5d\nu9+LgN9FvnEnjXvswu1wqdMxSrYxMznsI3UX+8YdNMIu12qV1Nd3utoSuXjc1ZHLxmqTEwECprIx\nSibCNFNMCaRTEYpI488NbGLEYqDhYR0Z2JpK5UC1pZibKaY3ZXKtQgp7yWJmckYtGfQa0nFMDg31\nNU9wYW6m0k5yZpOeY1BLer1auFetVrCLe5ojGPP7u7KZaNvImQQ5DScLk9MoRTYruBT19HRXmiLo\n9zu6ENDRiE\/E3NnZLJ0rTdHiQolmz2SokE88JzkP10Fd3aUaLktK5SD1958GOeruPrnQtIsPytjn\nhZ2zt9GlQ4N9dOrU6zs4udlSBnPGbT1rYdTA+GRIlJODCNqslm2XqodocDe59e7u7o6WCHI7qu63\naDIhsZunaDqXECXjIIIW\/r+K4w0uBbE3uR1ana5qW7oHmvt+i547Oy3IAaGg90ArKhUDdXJKtYqC\nsQTNLV1uE0Fu5HsXnJwI1sn9P5LoHrJLuaVVZucWKZaeppXb69W2CYRAwLXeuGhpdmoXOSk8TtnM\nBI2NDv8PQb1eVSeHd33x6Alt\/O4P7SW4nSwsi3YWTcTDIv5SyQh\/lzgJzJws4X0tCOkVCIfW5fd8\n9ddv6LP7X7WfoGxJOashGliAiqafm5okL4uDveS8HgfNX\/olvb\/6ocBn9x91wYIrt37Tvhh81uf+\nn5\/kK18+pEtXrtZCPrd1LzLTSenzrx\/Sgyff0q8\/uisI\/evf\/5H+9vfvafnGKi2+c\/XFEfzu+x+s\nn3\/9iK6urNbmL12W9nvmi788kT79\/R+3Vm6t0eVrK7T07jKtrm\/UVtfuUOnCEt3e+HS9raRUiv6y\nimWRkpUHUDhTrN7e+JjimdxjhaI3PzTUa23E2p070g\/\/+OdW5U8P6VcffkQX370msjeRm6Hrt9fW\n7z140NEWYlqttoML8abFrGcloiNc84VpggVjiSQ5XXYhnYaNGiEEDNzSoJxL50p0\/eYtWvv4tzR3\n8W1KZrJCdatUgzWb1VT1eGyPUWMRDi0R9LhtFa\/HJoi5XWMCkhSgK+9fJ4fLyaXFyIp5RNQ7h91C\ndhtgFplduf8lZYslcrmdLBa0ogzhWb\/PKQDljSQbH7flm5NbMX8XFDAIhoJuIZnCIcAj7mEx3N+Z\n0IRSDviddQK\/WFpEiRGbw7PIdPxuL9xuW3OCIR4PL6DmYZdT2UmufdmnmMlQivsxugqAktMIlCEQ\nhmVBApLN73MID2AueYpRAVY8hx89E\/HQYxCElVj208\/O5+uY43n4rYvndwFD1cJ8iTErcJ77NUSF\nXNxBVA6Fp+GwDZvNdHhNGIn4a7AELFgspFis5lgkyJim8+eeopG8jHQqKjqMTBBErGOmPRgWscmz\ncbkpsQrrIRFwelCYTmwjnxQoAoWkIA\/MFFI7k16aMNhHI34hIuBeADMwpNm+MBsOTxAuGffaOSNN\nNMlxlebe24gMW6iOdJSyvAmBTIymGF63XcSX3PpQpiD9kdGNEGXKoDk8QY6LKtyCFyMrJc5gIMLq\nBYhKgE8gFgH8AhPo09EAW94kNgeS2KzRoBZ10sAKB0C9lKHTKQ5P0GLSraNEoAAjXtycdR6XVcDr\nBmwCOEWQ4fMCDvLj5MBsFPUQoyZqI8jhHEerGSKNejdUqn7p0ATV6r4unsJqOh52cEJlZvdYeDGc\nUgE4DOLgFrCOAiYB25hJHHUg5tBhYCFsVKdViBOvfVBrejZBX5VfxL24LkpBaNsaCsIGZEATws1O\nLidwKf4PC8lXHMs1YoBHgYG+ntaEA0jygF3GAiAKV8EyiKNnWOSZ6O\/rYRF7Spwj7qA9sisa9VlR\nXEdHDMJKGDeByYmQ6KlIJMQqLAVL4+rmWEWWoowghiEWhgZ72WpvEhQRjwH5tsmtdDpqzU8n610A\nJFGC0BnQZxFvIAgSAL7jHkIC5BDDIA6rI7O5z5fbqgdBEDNIbiourIa+KpNFN0C2wlJybduuedsy\nDFbHc7Eo+nRQFO3EZLi9BOPxeAcT3IIwwBSHFoj2hUXRMXDqivtQOzhxwBV\/4z7+v70pp7iP3yaj\nwfYfomdisS6c1GNhKBVZcsGNsBjcJ0QpuxIZjQ4BN6PYIx4FwaBnMxr1S0de5MflcnUExp15VsVl\ndt3mQQRHLMYtm81ccbnGyh5Pc6f5\/wUSZ4ABUaqKNQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/fuelmaker_core-1334270636.swf",
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
	"fuelmaker",
	"core",
	"no_rube",
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

log.info("fuelmaker_core.js LOADED");

// generated ok 2012-09-14 19:45:45 by martlume
