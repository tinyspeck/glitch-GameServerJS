//#include include/takeable.js

var label = "Machine Engine";
var version = "1347677145";
var name_single = "Machine Engine";
var name_plural = "Machine Engines";
var article = "a";
var description = "Install this engine, and your machine is one step closer to purring like the quintessential classic, thrumming like the deeply resonant inner chambers of Zille's enormous throat.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2500;
var input_for = [];
var parent_classes = ["blockmaker_engine", "machine_part_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"machine_class_id"	: "blockmaker,fuelmaker,metalmaker,woodworker",	// defined by machine_part_base (overridden by blockmaker_engine)
	"machine_step_id"	: "3"	// defined by machine_part_base (overridden by blockmaker_engine)
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

function onLoad(){ // defined by blockmaker_engine
	if (this.label != this.name_single) this.label = this.name_single;
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
		'position': {"x":-51,"y":-56,"w":102,"h":56},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKJ0lEQVR42u2XaVBUZxaG\/Tk\/pkai\nxDDaCDEa1EQB2dde6YWtWZpVBRERxUATQEFRW1AQlEWRRQIIqAiC0ELYERpZhSCoCUZjTI9jpsqJ\nlemZmqnKVM2Pd853MzKaMYuRpPwxX9Wp3m7f+9z3vOec7y5Y8NQCsPCeXs\/v7R3gT05O89nnJ7\/d\nmr2jvDE7q+sfHNJ9\/uCh+unffpXFLjj20dTMubp6dPf148uvHuNv33xjmLh+Q3dlYNDQrG3DB5Vn\n0NB4CZfbOjA8NoHxyY+qb9+7x\/9VACemp3WnSkrR2d0HUgkT0zP45N49PHj0CF8+fozh8Wuoq78I\ndgPnLzRwoK0fdqJvYBBTN2\/pHxkMTFWzXwTuXwC\/rKIC9Reb0N3bPxcM9PqtjznQO3o97nyhx9DY\nNVxsakZZeQWqa8+hqVmLDzu60XNlANdvfoy7er32n4ByXi3AAA9nZWN4dBxt7V3cBb8LOjgyxql6\n+\/59fP7wISk6gcZLLSivqOJUZTfHoqmFgLu60dbZNTNvgAUFRfzwTZtRVV2DUbpwD3mQKdPR1fsM\nKIuRa5OcokxZ5lWmZtbRHCSl7AY7h9zTE9tjY3EkOxsHDhywnBfAvr6+hTJPT4MqOBgFJ06SD3vQ\n2dmFffv24WxNLWrP1v0P6KWWy0jblw5vXyWUSiXCwsLAFwigIMBjx46hpbkZw0ND+qKiosLk5GRt\nTU2NdnR09Od7VCQSmQmEQp3CywsHD2Ugde9e7mKlxcXIzc19RtH2zh4wS0jlcpSXlaG7owPtbW0o\nzM9H5ObNKKBXbUsLcnNykBAfDwJEc1MTOjs6DJWVlS9XSKnp6coLjY14LyEBYokE+wi06GQR+nVX\nqSjO4lRJGRfbtsdyqXw\/MZG7eHdnJybGxjjY43RDXfR6orAQLi4uiCDolJQUZBw6hOJTp5BD4PX1\n9fqJiYkXt0CjVlu9Nz0dqqAgODg4ICAwEDvidiHzSBZaLrdxoBVV1fCh1Pr7+yMpKQkflJfjXG0t\nLtGNXenpwdjICMaGh3GSAFUqFY4ePYqGhgZO2bi4OCSq1cg7fhznz56dmZqa+unVPj09bVZZU4OI\nyEg4OTvD0tIKIpEYbu58+AeqEBO7A5qMw0jevQde3t6wtbVFWloajlJBFBYUcOk+S\/9vungRXe3t\nGB0agu7KFeQTDAPKI2+60HlDQ0IQS+pnZ2VxNiAL6bSXLql\/FLD49Gkl8x67uL9\/ADZu3IRAAvPz\n84edvQNcXF3hQwXBvGdvb88pHB4ezkHu378fWXRBBlpWWora6mpcrK9He2srRq5exbXRUe67XTt3\ncoqeppuJf+89bCEx2P+LTp5EVUWF5gcB96SlaWJ37IDEwwMKhScSE5PgS6lk7xmwi4srHB2dyPQp\nlNoUyGQyWFlZwd3dnSsGzcGDSCd7HDl8GPl5eSgtKUH1GRqPFy6g7fJlDA8O4urAAAfaQPCtWi2s\nra0hFos5K6gTEgw\/CBgVHR25NToaMlKIQaWkpMLb24dTccuWKA4uJCQUERER2Lp1K+LjE6DRZCAg\nIJADFVCbYf7aT5AsMjMzudSWUCc4U1mJ+ro6XKbqHqC0j5NPc0hxmVQKezs7DtDX15edJ\/J7ASUS\nyUJfpdLAAPl8AVJT93EKBgUFcwqGkHcYXGhoKIF7w4taEvtu58446n15iInZzlWtK1kh+f33kUVK\nMlUzMzJwjCqbVXAljdQL58+jjKAdHR2xYcMGuNHxAQEBsCNQAvzhNAtEIk0Y+Sr\/xAlEbY2GWp3E\npbbO3xF\/3uYyF49j+fg6XoqvdgjRG+KEqgBXlOzagqq8XBw8mAGJxIMrol1UtQWk4kny5gmKUoJk\nfnNzc+NUFwlF2ExtyJ0+s7ZG3yl\/tFg8vbyqd9CJqWiwJSoKyTJn\/MHH\/LnxMNACjyJs8fVOIf6R\n6sdBP4j3Qq8mEUeOZNOECedAAkmhXKp2Bsugn3iXtSoaiZzqPpRiGxubn9Z2hEKhkqWbTZMWxdrn\nwum9zfAFxedeZrhH8RnFH8Os8NdEBf6+xw9TYfY4s02FtEQ1EhISQefkfMpswAC96NwqVRBlSQ0n\nJyf6Tah\/oabNPKkU87XPg2Ng95+Cu+tphjsUn1LMKpZj1nsFPgt8B3+KcsbtcFvEiJ0RHb2NA2VF\nxVqUkhSTUAUzL4eT0mGhYXjhyfLQx5z\/PNUY3BPVnoFjr8pVmPVdiRnZclyn+ERpgQebbFEht4TQ\nyZ5rTyy93gTGIFkUylciQ\/Gu7oUBc2xeW3hDZjoHd\/87Kb37H7DbpBo7blLKQ7MbD4feMcae1UZo\ndTPBuISHMYkp7gatw4d+G7jiEVG6xVE28PXx4QA9qEDGA5Yg3fo3L76ZyLNaHKl1NcE1Dx4+JZDn\npfRj+XL0iM2Qa\/k6CqwXo5W\/FOedl+KIlQnGPJZjSLQMg8JlqHXhwfHdNZCTisEHhFAoJRwg+zyp\negN7rX\/7855xmJL5Vsaaavslc3BMtU8obhFch9gc5bavo8\/DDBXOpohb9Rr2rjVCvYsJBsU86Aiu\nX7AUeVbGEKxZwTXokBglAlJpzvv5wZMKJpvOUSUwKnyp7RhTs9Xt9xwcU+0mxQ2KKYU5GlyWIWbF\n75C9fhGaScFiWxNsf8uI3pviCsH18r8F5K9+E3400xlYsEaEoL1Crg05OzsrZ4LeKDwnWqR5acgR\nMc9wkwpghnx3XWqKOgcTlNkao9n1DZQ5LEPSmsXQrDNCA1mjX2KGHoLrEJrOAbLJoaKtXBCNOFWB\nPbwD5VwFtymM+U3SRS\/\/PHPOfonliIhnmCK4SfLmR3JzaAXmSF69iAProFQ3CFcgx5aHfvFydBNg\nm8icA5RZraHxGYRgesRgW6+NuRK4S530gcUtkSWZydW14td08\/IswyCveb5lYFU6Sj5rFpihlVQ6\n7cTjFExdY4Q+Uo\/BjcpXoNTOBFmWxnDcYE39MIF7jmHbNf+jtgaFQsEVR\/2x3dVVwnkCZKvBdZnl\njN9aA6Uc074WaCTVmgU8jHuuRIdsFXqFPA6wXfytesGrl3LTZCOB0UZDH7xHqlEdd5wDuuq3RNMq\nN9YsmM\/1lyCbhbdU62fGZG9iULIcw6QWg3oSo4qVKLZZwqm3duVbbFtlkEqlGjZ3D3Ru5vtl2c0B\nMrgSd6P5BZybOhF26psB7xqu+67Gk5gNWo9yexMct1qsl7\/N01hYWDyzW4lrUKg99\/93i6Xzfb0w\n02NV4YJfarF+qVNYqLukKzUsWO9kVf99x6e0qJSyw2u07D1TNMRlvV7hqZhZ8KoslmIPzWouxTSj\nlXz7dRBIRbAO32X2ygE2bl+x8LCfiUadGlPtEJ2sfuUAn6zQ2j6NbUSC5pUBlGc8u82SHix5dQDZ\neroP\/h\/wRRc9p1gK\/BwMTz8s2QhlOisn11ej1dDYi2TPw+vXvj2nmFzgoAsUrjO8MinerViir4gw\nnZsw+SHLLE9t4nFt5t+mNzL1FwWDNQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-02\/1298508230-8206.swf",
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
	"c"	: "assemble",
	"h"	: "place"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "place"
};

log.info("blockmaker_engine.js LOADED");

// generated ok 2012-09-14 19:45:45 by martlume
