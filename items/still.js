//#include include/takeable.js

var label = "Still";
var version = "1351031186";
var name_single = "Still";
var name_plural = "Stills";
var article = "a";
var description = "A basic Still for converting Grain, Corn, or the humble Potato into versatile, potent (if not smooth) Hooch.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2000;
var input_for = [];
var parent_classes = ["still", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"hopper_size"	: "500",	// defined by still
	"hooch_cost"	: "14",	// defined by still
	"max_hooch"	: "50"	// defined by still
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.hooch = "0";	// defined by still
	this.instanceProps.hopper_amount = "0";	// defined by still
}

var instancePropsDef = {
	hooch : ["The number of hooches held in the still"],
	hopper_amount : ["The amount in the hopper"],
};

var instancePropsChoices = {
	hooch : [""],
	hopper_amount : [""],
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

verbs.collect = { // defined by still
	"name"				: "collect",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var hooch = this.getHooch();
		var item_name = (hooch > 1) ? (hooch + " Hooches") : "Hooch";

		return "Collect your "+item_name+"!";
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc.skills_has('distilling_1')) {
			return {state: 'disabled', reason: "You must know Distilling to use this."};
		}

		if (!this.isOnGround()) {
			return {state: 'disabled', reason: "You must first Drop this to use it."};
		}
		var hooch = this.getHooch();
		if (hooch && !this.give_pc) {
			if (this.container.pols_is_pol()) {
				if (this.container.pols_is_owner(pc)) {
					return {state: 'enabled'};
				} else {
					return {state: 'disabled', reason: "Collecting Hooch from someone else's Still is against the bootlegger's code."};
				}
			} else {
				return {state: 'enabled'};
			}
		} else {
			var amount = this.getHopperAmount();
			if (amount >= this.getHoochCost()) {
				return {state: 'disabled', reason: "This Still is currently working, and will produce "+Math.floor(amount/this.getHoochCost())+" more Hooch. Return in a while to collect your Hooch."};
			} else if (amount) {
				return {state: 'disabled', reason: "This Still needs more Potatoes, Corn or Grain to make Hooch. Try Distilling some."};
			} else {
				return {state: 'disabled', reason: "This Still is currently empty. Try Distilling some Potatoes, Corn or Grain."};
			}
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.setAndBroadcastState('collect');
		this.give_pc = pc;
		this.apiCancelTimer('finishWorking');
		this.is_working = false;
		this.apiSetTimer('giveHooch', 4000);
		pc.announce_sound('STILL_COLLECT');
	}
};

verbs.distill = { // defined by still
	"name"				: "distill",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var amount = this.getHopperAmount();
		if (amount) {
			return "The hopper contains "+amount+" units, enough to make "+Math.floor(amount/this.getHoochCost())+" Hooch. Add more Grain, Potatoes or Corn to make more Hooch.";
		} else {
			return "Add Grain, Potatoes or Corn to the hopper to begin making Hooch";
		}
	},
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Distill {$stack_name} into Hooch.",
	"drop_ok_code"			: function(stack, pc){

		var room = this.getRoom();

		if (in_array(stack.class_tsid, this.distillables)) {
			return room >= apiFindItemPrototype(stack.class_tsid).base_cost;
		} else {
			return false;
		}
	},
	"conditions"			: function(pc, drop_stack){

		var room = this.getRoom();
		var hasSomething = false;
		var tooFull = false;

		if (!this.isOnGround()) {
			return {state: 'disabled', reason: "You must first Drop this to use it."};
		}
		if (!pc.skills_has('distilling_1')) {
			return {state: 'disabled', reason: "You must know Distilling to use this."};
		}

		for (var i in this.distillables) {
			if (pc.countItemClass(this.distillables[i])) {
				if (!hasSomething && room <= apiFindItemPrototype(this.distillables[i]).base_cost) {
					tooFull = true;
				} else {
					hasSomething = true;
				}
			}
		}

		if (hasSomething) {
			return {state: 'enabled'};
		} else {
			if (tooFull) {
				return {state: 'disabled', reason: "The hopper of this Still is too full for anything you're carrying."};
			} else {
				return {state: 'disabled', reason: "You must have either Corn, Grain or Potatoes to distill."};
			}
		}
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var uniques = {};
		var items = pc.apiGetAllItems();
		for (var i in items){
			var it = items[i];
			if (!uniques[it.class_tsid]) {
				uniques[it.class_tsid] = it.count;
			} else {
				uniques[it.class_tsid] += it.count;
			}
		}

		var room = this.getRoom();
		log.info("Room "+room);

		var possibles = [];
		for (var i in this.distillables) {
			if (uniques[this.distillables[i]] && room >= apiFindItemPrototype(this.distillables[i]).base_cost) {
				possibles.push(this.distillables[i]);
			}
		}

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			pc.sendActivity("You must have Corn, Grain or Potatoes to distill, and room in the hopper to add them.");
			return {
				'ok' : 0,
				'txt' : "You must have Corn, Grain or Potatoes in sufficient amounts to distill.",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		//
		// Some stills are mysteriously missing instance props, which makes them bottomless resource-sinks.
		//
		if (!this.instanceProps) this.initInstanceProps();

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var multiplier = 1;
		if (msg.target_item_class == 'corn' && pc.imagination_has_upgrade('distilling_corn')){
			multiplier += 0.2;
			var bonus_name = "Corn Hoocher";
		}
		else if (msg.target_item_class == 'grain' && pc.imagination_has_upgrade('distilling_grain')){
			multiplier += 0.2;
			var bonus_name = "Grain Hoocher";
		}
		else if (msg.target_item_class == 'potato' && pc.imagination_has_upgrade('distilling_potato')){
			multiplier += 0.2;
			var bonus_name = "Potato Hoocher";
		}

		var room = this.getRoom();
		var base_cost = apiFindItemPrototype(msg.target_item_class).base_cost; 
		var can_fit = Math.floor(room / base_cost);
		var needed = Math.min(msg.target_item_class_count, can_fit);	

		var taken = 0;
		var itemName = "";

		if (msg.target_itemstack_tsid) {
			var stack = apiFindObject(msg.target_itemstack_tsid);
			if (!stack) {
				log.error("Trying to distill "+msg.target_itemstack_tsid+" but could not find stack.");
				return false;
			}

			if (needed < stack.count) {
				var stack = stack.apiSplit(needed);
				if (!stack) {
					log.error("Trying to distill "+msg.target_itemstack_tsid+" but could not split stack.");
				}

				taken = Math.round(stack.count);
			} else{
				taken = Math.round(stack.count);
				stack.apiDelete();
			}

			stack.apiDelete();
		}

		if (taken < needed) {
			log.info("Found "+taken+" but needed "+needed);
			while (taken < needed) {
				var stack = pc.removeItemStackClass(msg.target_item_class, needed - taken);
				if (stack) {
					taken += Math.round(stack.count);
					stack.apiDelete();
				} else {
					log.error("Attempting to distill, but player "+pc+" did not have enough resources!");
					return false;
				}
			}	
		}

		taken = Math.min(taken, can_fit);

		this.setHopperAmount(this.getHopperAmount() + taken * base_cost*multiplier);
		this.updateLabel();

		if (taken) {
			var proto = apiFindItemPrototype(msg.target_item_class);
			itemName = (taken > 1) ? proto.name_plural : proto.name_single;

			self_msgs.push("You added "+taken+" "+itemName+" to the hopper.");

			if (multiplier > 0 && bonus_name) {
				self_msgs.push("Your \""+bonus_name+"\" upgrade got you an extra "+Math.round(taken*base_cost*(multiplier-1.0))+" units in the hopper!");
			} 
		}

		if (this.getHooch() >= this.getMaxHooch()) {
			failed = true;
			self_msgs.push("The Still is totally full. You'll have to remove some Hooch before you can make any more.");
		} else if (!this.is_working && this.getHopperAmount() >= this.getHoochCost()) {
			this.startWorking();
		} else if (!this.is_working) {
			failed = true;
			self_msgs.push("Hm… nothing happened. Maybe you \"still\" need to add more stuff?")
		}

		pc.announce_sound('FUELMAKER_LOAD_OPEN');

		var pre_msg = this.buildVerbMessage(msg.count, 'activate', 'activated', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function canDrop(pc, drop_stack){ // defined by still
	if (pc.location.pols_is_pol() && !pc.location.pols_is_owner(pc)) {
		return {ok: 0, error: "This is someone else's house. Don't litter!"};
	}
	return {ok: 1};
}

function canPickup(pc, drop_stack){ // defined by still
	if (pc.location.pols_is_pol() && !pc.location.pols_is_owner(pc)) {
		return {ok: 0, error: "Stealing a Still from someone else's home is the basest of crimes."};
	}
	if (this.give_pc) {
		if (this.give_pc == pc) {
			return {ok: 0, error: "You are still collecting Hooch from this Still. Hold your horses!"};
		} else {
			return {ok: 0, error: "Someone is still collecting Hooch from this Still. Hold your horses!"};
		}
	}
	return {ok: 1};
}

function finishWorking(){ // defined by still
	this.setHooch(this.getHooch() + 1);
	this.setHopperAmount(this.getHopperAmount() - this.getHoochCost());
	this.updateLabel();

	if (this.getHopperAmount() >= this.getHoochCost() && this.getHooch() < this.getMaxHooch()) {
		this.startWorking();
	} else {
		this.is_working = false;
		this.setAndBroadcastState('ready');
		if (this.container.pols_is_pol && this.container.pols_is_pol()) {
			var owner = this.container.pols_get_owner();
			if (owner.get_location() == this.container) {
				owner.announce_sound('STILL_READY');
			}
		} else {
			this.container.announce_sound_to_all('STILL_READY');
		}
	}
}

function getContentCount(){ // defined by still
	return this.getInstanceProp('hooch');
}

function getHooch(){ // defined by still
	return intval(this.getInstanceProp('hooch'));
}

function getHoochCost(){ // defined by still
	return intval(this.getClassProp('hooch_cost'));
}

function getHopperAmount(){ // defined by still
	return intval(this.getInstanceProp('hopper_amount'));
}

function getMaxHooch(){ // defined by still
	return intval(this.getClassProp('max_hooch'));
}

function getRoom(){ // defined by still
	return intval(this.getClassProp('hopper_size')) - this.getHopperAmount();
}

function giveHooch(){ // defined by still
	var hooch = this.getHooch();
	var item_name = (hooch > 1) ? "Hooches" : "Hooch";
	var article = (hooch > 1) ? " " : " a ";
	var jar = (hooch > 1) ? "jars" : "jar";

	var remaining = this.give_pc.createItemFromSource('hooch', hooch, this);
	this.give_pc.sendActivity("You collected "+hooch+" "+item_name+" in"+article+"convenient, rustic "+jar+".");
	this.give_pc.quests_inc_counter('make_hooch', hooch);
	if (this.container.pols_is_pol() && this.container.pols_is_owner(this.give_pc)) {
		this.give_pc.achievements_increment('still', 'collected_in_pol', hooch);
	}
	this.setHooch(0);
	if (!this.is_working) {
		if (this.getHopperAmount() >= this.getHoochCost()) {
			this.startWorking();
		} else {
			this.setAndBroadcastState('empty');
		}
	}
	delete this.give_pc;
}

function onContainerChanged(oldContainer, newContainer){ // defined by still
	if (!oldContainer) {
		this.setAndBroadcastState('empty');
	}
}

function onCreate(){ // defined by still
	this.initInstanceProps();
	this.distillables = ['grain', 'corn', 'potato', 'grain_bushel'];
	this.working = false;

	this.updateLabel();
}

function onDrop(pc, msg){ // defined by still
	if (this.getHopperAmount() > this.getHoochCost()) {
		this.apiSetTimer('startWorking', 2000);
	}
}

function onPickup(pc, msg){ // defined by still
	this.setAndBroadcastState('empty');
	this.is_working = false;
	this.apiCancelTimer('startWorking');
	this.apiCancelTimer('finishWorking');
}

function onPrototypeChanged(){ // defined by still
	if (!this.instanceProps) {
		this.initInstanceProps();
	}
	// Backfill from previous values
	if (this.hooch) {
		this.setHooch(this.hooch);
		this.old_hooch = this.hooch;
		delete this.hooch;
	}
	if (this.amount) {
		this.setHopperAmount(this.amount);
		this.old_amount = this.amount;
		delete this.amount;
	}
}

function setHooch(amount){ // defined by still
	this.setInstanceProp('hooch', amount);
}

function setHopperAmount(amount){ // defined by still
	this.setInstanceProp('hopper_amount', amount);
}

function startWorking(){ // defined by still
	this.setAndBroadcastState('active');
	this.is_working = true;
	this.apiSetTimer('finishWorking', (7.0/3.0) * 60 * 1000);
}

function takeHooch(count){ // defined by still
	var hooch_inside = this.getInstanceProp('hooch');
	if (hooch_inside >= count){
		this.setInstanceProp('hooch',  hooch_inside - count);
		return 0;
	}else{
		var diff = count - hooch_inside;
		this.setInstanceProp('hooch', 0);
		return diff;
	}
}

function updateLabel(){ // defined by still
	this.label = "Still ("+this.getHopperAmount()+"/"+this.getClassProp('hopper_size')+")";
}

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("distilling_1"))) out.push([1, "You need the skill <a href=\"\/skills\/123\/\" glitch=\"skill|distilling_1\">Distilling<\/a> to use this."]);
	out.push([2, "Because a Still only works when placed on the ground, it is advisable to bootleg Hooch in a private location."]);

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a>, an <a href=\"\/items\/1000001\/\" glitch=\"item|npc_streetspirit_alchemical_goods\">Alchemical Goods Vendor<\/a>, <a href=\"\/items\/439\/\" glitch=\"item|npc_jabba2\">Helga's Liquor Store<\/a> or a <a href=\"\/items\/411\/\" glitch=\"item|npc_tool_vendor\">Tool Vendor<\/a>."]);
	return out;
}

var tags = [
	"tool"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-35,"y":-100,"w":68,"h":100},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI6ElEQVR42s2YeVOTWRbG\/QbWTHXX\n2HYrm6K40fY44zLaIAK2EAibJGFJWCRsgQCGPRAgYQdBEIhgCKDsYFhlG0BF0RkDEQVFu6ap6aru\naf\/KR3jmnlexrXaqraGJ1am6dfO+uZX8cs5znnPvu2XLJr6+++5Hq8XFb50mJ+edtvyeXi9evHLM\nVqrNAkEoFIpsXK5pRGFhJVR5ZYbfBWBhYZVqZGQGnZ1D6Ooehr6lF2XlV6DWVKC2VqfS6TpVra39\nKp2+W5WnrjCIxdHy9PSSrR8NMFHoqtIUFGNgYArGhRfo6BxERmY+iksuo66+hQH34Ea7Aa2tfWzN\nBFLTVKiuaUJped1aSaXW0eKAWpVUr8v0xoO2RCxN1uPvTXFQR7uhIM5L\/7\/WNzZ2OLW09pp6+kZQ\nc0W\/ZnHAC1EyU9O1doxP3MWDh0sszYMsxbXw8w8y\/3JtV9ewY1fXqD4+XoFbY7fZ2lG4u3tKLArI\n4\/kbkpIyYRiYxJOna6iubkRmVgHOefrM\/nLtwuMV0\/jEbbRd78XY+D20tfUzQJ7KskUi3Ku6knQG\nY\/VRuNerQX91BDJDjqM0ZOd7P\/zI+AxLT15ifv4pZmb+CbFYSoCOFgdsSTmK\/wxI8MNDLZ53hqIp\n8QiaYna9B7iy8j1\/efnfs1pt65pQKGFwXmYXFw8riwNezfKFoV7+QcCenqmt3T2jpqioBKbTOkgk\n0R8nxfU1pWjQXoXxZs6vAi6vPDc9W32BuXtGTEzcR0ZG\/scB7Cnwxog29oMRfPhwGe8OiUSKj5Li\nSrUCKlU2VqfKfhVwdfUHPusu5qoqLTSFl+DnJ7K8zRBgf6MKQ23FHwQcGppxGhicRkFBBWjOVhZa\nPsVVOUn6m+UR+NdIFlbvtuIfHcloyvRBSYLHe5uFu3OLZuPCMu7PP8bsbSOyszUQCMRyiwLKZMlr\nGrZ7aW3rxuLiczQ2XUd+QRlCxVF4z6hNL02Lpm9Bo6b2Gmczrq6ultk49F+0sdLF7VLFnz9pTlNk\ncLsZpjHU1emRlpYNgccxtCfZ6vuzbd4WAcFkZhdU+fsHrckSUsG6kGU02JVszW+I3o2S4L0oEx9A\nTdSXuHThEErCD6KIXecHOUAjckB1hD3aEu1wM9Oag1hafi6ZnJqDWl2BoeEZtrPJ3XwNaiIdrOql\nu80a0V5cineGNNAF+joNutV89CpPojPjBKiz1MUcRknoflSH26NVbmtOF+zhz90zmY2LK5h\/sITb\ndxa4Ijl7lrc5GiyI2O+YKXIwBTt\/gdLQPegukUCWmAixJAph4VIMNOdiptIdk6WuGMx3QnvacdTH\nfoWi4H1gfwgZAVboatGhv3+cG7VXdAzOa\/N8UB12QJ4auBcKPxvuRztyPVF1uRoJCQpkZedhUJuA\nJ3ofGBu9cKf6LIbUzmhTHEN1pCMqxHugCbWF4vwesO\/hUtrRMeRUWdkAqTRxc1Ic522rkvvthiLQ\nHhnCPcgT78fldB6qC2JwKS8aN9RemLsuw3SDCMPFLujIPkkwDMoeaQJavw\/h31jj60N\/lE9NGbc+\nfrKiHx6e3bwUx3rZzV7wsIb\/qc8R5WmDOG875En2Izd0H\/LZHONli9KoQ9BEHEBR5EGoGFAqA4vj\n24F\/4jN4s3Hm8KfISZXNLj1dXhu9dRvp6XmmTbMZmc8us9TTFiGuO3HBw4YB7cJFlvJYBpomcEAg\n0yaBB3z9OYLP7OCiRdcCdt\/jr9vgx\/5YflYKRm9Nc+eTpJTMqt8M198\/VjU1Nb82Pf1Qn5UYjqKM\nGFTmX0TEOTuWagckB7yO0LuABCdxt0IEA4xmUQ0+sxO8Y9s48FJNIXTN3UhOzp7dXFNmoMkxEsSI\n3BEX4gGp114oQw4gwXc3pDwbDoQAI85ZI9RtJwdKESR4ukcpJsAsRSJq61rQ2z+Mymrt7Kall54W\nZET7oEoZBUPfIC6XFyNdSKK34mBoECBJgMAIMpLpVcqzBemWPjvv9AUHKfI6hVxlnqm27irc3Lw2\n5ylE5\/Ue\/Q2dFsOGIXR3j0Cn60Bi0Mm3cBQlwenXgPSedEr3ab7IrEV4egenRQI97fgJhN5n9Kr8\n4t8O+NNPZrnR+NJEJ7USdhBnx0a2VSpHSkoGMhPErJJ3cSCU5mAGQ4AxXnY\/65HdS\/K353RIQ\/AG\nMJDnbEpKzoKvr4C\/YbhXr8yq1dXvYTBMISk5E6GhUQgPj4FIFAahUAwfZ3vE818DkhaDWHGsA3oc\n3cbpjwDpMzErGopmAKtk168+hdDHdS0sLBrBwZEb2yg8e\/ajlcn0AuXldWaRKNwpiO9i8HHeh0hv\nR\/BOH4HLUXsuGmTcBEhRoqgRHA3PdwBJj2L313Mg0yH\/xHYkR4tmu3uGNp7iR49W+TdvTtCpi7MD\nVrHyKBYdGhfO2eKbv\/yJA8kK2s9VMAFSBCla0awwvI59xgESFL0nE08IOoXiLBlCPBw5QOPCysYB\n+\/rG5ZeqrrL9mh\/XJ3NCDzpJ31iHgpmzz9+2cwBkNQRKgOR9NIedteK6DRm4yGUHvI8zQJ+DLBu1\nGBubg0aZygGOjt3ZOGB7+6BcybZCfn4CwzudhItIgs9uLp0yNhOg+A0Y1\/4YNAfI7GTdGymtSoWM\nbe\/V3DFTqdRgYvzu2jVd18YBp6fvWzU3dzjxeL5vH0vE8GzXON1RVTJtyf3suQ5C9rIOSIMiuW7W\nBCh2s4I0LAixsXJERsYjOUWJO3cXIEtIw6Zu91P87Q1UiQRFeiNA8jiCpegSEPVoWkNRpGsCJVmE\neJ+Av78AfH4gPF1OmClym\/5MJj3IQU7dgVJH2iLApDfRpHucH7IiInhatw5IsNRFXI9sx+kj1nA+\n9IlljpkX\/Wys1MnCt12DioA0RxqkmYCieT+bNLW4IPZHyKCpqMgDA9wOm\/9s+wfLPf7NVeaqmrTX\nWC8uAcFSBa93C+rLkSzF6\/tF8RvfixG6IDxEAJEgiBl9HH+LpV9FOTlODVcaTH29w+zgY8SIYRgD\nPV1o1zejWVuPS6VlqChSQ63KgyqvlG3pZTgfcN7k4eH7f8P9F5piHKA4t7smAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/still-1334271951.swf",
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
	"p"	: "pickup",
	"c"	: "collect",
	"t"	: "distill"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"c"	: "collect",
	"t"	: "distill",
	"g"	: "give"
};

log.info("still.js LOADED");

// generated ok 2012-10-23 15:26:26 by lizg
