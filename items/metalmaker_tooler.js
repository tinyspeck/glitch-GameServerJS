//#include include/takeable.js

var label = "Metal Machine Tooler";
var version = "1347907573";
var name_single = "Metal Machine Tooler";
var name_plural = "Metal Machine Toolers";
var article = "a";
var description = "Silvery, heavy, and glistening with hot oil, lump of machinery so beautiful, complex and well crafted that it must have been tooled in some kind of academy.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 1750;
var input_for = [];
var parent_classes = ["metalmaker_tooler", "machine_part_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"machine_class_id"	: "metalmaker",	// defined by machine_part_base (overridden by metalmaker_tooler)
	"machine_step_id"	: "3"	// defined by machine_part_base (overridden by metalmaker_tooler)
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
	out.push([2, "You can use this to assemble a <a href=\"\/items\/995\/\" glitch=\"item|metalmaker\">Metal Machine<\/a>."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"machineparts_products",
	"metalmachine",
	"no_rube",
	"no_shelf"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-43,"y":-118,"w":86,"h":118},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHrUlEQVR42s2YV1MUaRSG+Qf8Aass\nb\/TKUMKaQIdSkKhDzjmIknOGIWcYibvkDJJEVNKO2ggLUqIS9mq98cJ75yecPe\/RsQYXygIG2a76\nioFuup8+4X3PN2ZmJjrKKyq0kVHRSlFJmdLY2Kgy+z8cjx8\/Vg0PD6u6u7tVzc0ttLq6Sp2dneTt\n7d0zOTl5\/tjA1tfXNU+fPtX39fVRc3MzVVZWUmlpKQ0MDFBVVRV5enpRZmYWZWfn6H85XGtra8j2\n9t80ODhI5RWVlJWVQ8nJqZSSmkqPHo0K4M2bNykpKYnCwsLol4FxtDQzMzMKw+k5tVRcXLaRkpL5\nPY0VFRX0+vXr4wG0sLBI\/GtlhdrbO2jt7Vv96OgoxcUnfTK+5meAOp3O\/MgAm5qalK6uboqNT9Aq\nyiINDQ1RTGw82drbq52dXZSAgEBlN8C0tDTqHxyikrJyysvXUEZWLk1OTX8yOeDS0jLV1NRSWGSk\nemFhQeoPgL6+vuTh4UGurq60G+D9+\/dpfHyC\/vn4kVZWVqmjs4s0hcWmTzunh6qra2h4ZGxjYmKS\nauvqqbqmju7cuUNOTk5kb2+\/KyDLDYWGhsnf5ufnqby8nAIDg0wL2NXVoxkYGKK6ei3NzS\/Qwp86\njkQ3VVbVCACiB8gHDx4QlwJ3dDI5OjpScHAw+XCEnZycycHe4egAWd+0XV1dHMFqmpubp83NTWpk\nkPyCAkkhoqdSqSguLo5ycnIENDQ0lFxcXOQzQC0tLGlkZORoAPmmKgOg7sULAWxpaaG09CxJOx6q\nVrtSakoqLS0tUSrr4aVLl8ja2poyMjK\/A3Z399DMzCzpdC946bReXl7mJgWsqanZAdjbN0BwksLC\nQnr27Bnl5eXRkydP5CfbHyUkJOwAbHjYQA95VVVVy\/n+\/gFizyZ2JHEjLo2D+Tf7bMhugC0trRQU\nFES5uXmS3t\/\/+IPi4+NJq9USR0eaxBgwLS2dxb1EUtzW1sau84jGxsYoPz+f7t27h3vtD\/DLly\/m\ny8vLPfDX3QCzsnOlzu7evUuxsbEMk8EPDxRoPz8\/EWkDIAs9pz5dygFNND09LZDZ2dnyIvsG\/Pz5\nc+Jbdoznz59LcRvW+Pg4vXr1SlI5whGAfGg0GmpoQPoeSpPExMSwP2eRm5sbpaSkfAdMSEikiYkJ\nmpqa4kgWUwE32YEBt7a2aXFxUaQBMEgHbox6YT+W1CAKaIoVtsA3b97IqMURl6UoChqBu36O1tbW\n6N27d3IeNYeUAu5QgBsbm\/8B7O3tlVSjMWB18GOe+QQU0IDHdVyzUgLoejQQUo\/ORvQBtxtgeHj4\n\/gD5bRVjwI6ODkkjbo6UFhUVEY9dUkcYUHt6eqQE9gJEE+0GiHORkZHk7+9\/OEAIMtIQEREhxQ8B\nRq3hxvBjNAWiEBISIk0SEBDAn0P3BMTKzMyUrsf9cI99AyJtGAoQEQOcv38Au4YNOTg4iA+jEdzd\n3cnOzo5sbGzI2dlZzt2+fZsfHL4DEJE2hktPTz8c4I0bN+jUqVMiooCDffn6+gmAn58\/RUVFibzg\nQVZW1uIcBrhbt26Rt4\/vDsC6urodETQG\/CZP+wNUq9XywMTERIFD6jxZgB0cHCWlPj4+vPfwlCgC\n6PLlyxJJfEY03d09fgr4Vcwz5EX3DYiUoNCxIQIc6s3NzV0+IyVwC6QXLwLBtrT8TcYswF2\/fp3c\nGDCXbW8vQDQJGu5AMmPcJFB+wCFi3t4+Aoaood4AgoX0YkAwwF27do1HLqc9AcvKykQJ8PnQgJAQ\nzHn5+V\/HK9QjutXDw1M6FRM1gBFJA9yVK1fI7rb9DkBEzACI1OOeyNJBAbUMqDCgwjKjsMZt\/Eyo\n+\/r6qa29nd2iSbYHJSWlVMApNACilgGHYWJ2dlb+B9Z3IMAfD+5YFW6CBf1D2hEFeDEeiDrFBgkv\nAFmCL8PWamtrZUDAtdjYQ8i3trbow4cPYn0vX740DSALsyo6OpqwDKDoPCzD5FxfXy8OAu2EwwAY\nkYZAwwZRLvBoePf6+jptb2\/T+\/fvTQPIICdRf1iAhAYCDDaFTsd0glTiPBwFEoKIIaWoYQyoSCcG\nW+wKAYoIYogwCeC3KAocJAYugvkQCyMWBBdaiU6HRsLqcD2majRDO9cmahh+jbrFGAdQNKLJAKH4\n2K2hGxE1aBjmPUQT0FiQI7gCZkAAAxbbUaQfjoShA02GWsTXJwA9NCAPqOf5pgoegFSiKTAmoVkg\n2sZRw++QIEBCeuAsubm5onloJPwv6hTy0t\/fL0pwKECWgpNc9HqkEA+HIMPokS7U349giDKEHJGG\nl\/N2dIPlReGGUXgzpccLGjof4xq6\/hvg1IF2edyFGsCdOHFCBoczZ87QuXPnZOeGSBinE+nF\/gR2\nx66it7S0VO91XwY9z2WiwjexDKg5cN1xB2oAcPr0aTp79qzsLb7amKPUEpoA5+Em2MBbWVnRhQsX\npvi6o\/smy\/hgDdMglRcvXhT7gtcCBLYGAUYHQ27wd4bS80Sj\/qXfprLiq9CFqCfMeZAX1FhQcAhv\nARqlHq9evYoXmLK1tTU3O46DtasHhS0zG6czIiJSZAMp5k7Wc8rVZsd9sL8mcsdNJSUlK\/BaLB4S\nFHaCI4\/avxRyUXNhps3dAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-11\/metalmaker_tooler-1321471891.swf",
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
	"metalmachine",
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

log.info("metalmaker_tooler.js LOADED");

// generated ok 2012-09-17 11:46:13 by martlume
