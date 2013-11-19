//#include include/takeable.js

var label = "Dung-Kicker Drops";
var version = "1355086256";
var name_single = "Dung-Kicker Drops";
var name_plural = "Dung-Kicker Drops";
var article = "a";
var description = "One squirt of Dung-Kicker Drops spreads fertilizer over all fertilizable plots in a garden (no extra guano necessary), leaving you free to enjoy more pleasant-scented parts of the gardening experience.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2200;
var input_for = [];
var parent_classes = ["potion_garden_fertilize", "mg_potion_base", "potion_base", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "mastergardener_1",	// defined by tool_base (overridden by potion_garden_fertilize)
	"points_capacity"	: "5",	// defined by tool_base
	"display_wear"	: "1",	// defined by tool_base
	"can_repair"	: "0",	// defined by tool_base
	"can_pour"	: "1",	// defined by potion_base (overridden by potion_garden_fertilize)
	"can_quaff"	: "0",	// defined by potion_base
	"pour_tooltip"	: "Fertilize all garden plots",	// defined by potion_base (overridden by potion_garden_fertilize)
	"quaff_tooltip"	: ""	// defined by potion_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.points_remaining = "5";	// defined by tool_base
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

verbs.pour = { // defined by potion_base
	"name"				: "pour",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var tooltip = this.getClassProp('pour_tooltip');
		if (tooltip && tooltip.length) {
			return tooltip;
		} else {
			return "This potion ain't hooked up right!";
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.getClassProp('can_pour') || !intval(this.getClassProp('can_pour'))) {
			return {state: 'null'};
		}

		if (pc.is_dead) {
			return {state: 'disabled', reason: "This is no time to be messing about with potions. You're dead!"};
		}

		if (this.canPour) {
			var result = this.canPour(pc);
			if (result.ok) {
				return {state: 'enabled'};
			} else {
				if (result.error) {
					return {state: 'disabled', reason: result.error};
				} else {
					return {state: null};
				}
			}
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (msg.target){
			var target = msg.target;
		} else {
			if (this.getValidTargets) var target = this.getValidTargets(pc).pop();
		}

		// Start overlays
		if (target){
			msg.target = target;

			this.onPrePour(pc, msg);

			if (target.class_id == 'npc_chicken' ||
			    target.class_id == 'npc_piggy' ||
			    target.class_id == 'npc_butterfly'){
				target.onInteractionStarting(pc);
			}

			if (target.x < pc.x){
				var state = '-tool_animation';
				var delta_x = 10;
				var endpoint = target.x+100;
				var face = 'left';
			}
			else{
				var state = 'tool_animation';
				var delta_x = -10;
				var endpoint = target.x-100;
				var face = 'right';
			}
				
				
			// Move the player
			var distance = Math.abs(this.x-endpoint);
			pc.moveAvatar(endpoint, pc.y, face);

			var annc = {
				type: 'itemstack_overlay',
				itemstack_tsid: target.tsid,
				duration: 2500,
				item_class: this.class_tsid,
				state: state,
				locking: true,
				delta_x: delta_x,
				delta_y: 20,
				uid: pc.tsid+'_powder_self'
			};

			if (this.onOverlayCancel){
				annc.dismissible = true;
				annc.dismiss_payload = {item_tsids: [this.tsid]};
			} else {
				annc.dismissible = false;
			}

			pc.apiSendAnnouncement(annc);
		}
		else{
			pc.apiSendAnnouncement({
				type: 'pc_overlay',
				item_class: this.class_tsid,
				duration: 2500,
				state: 'tool_animation',
				pc_tsid: pc.tsid,
				locking: true,
				dismissible: false,
				delta_x: 0,
				delta_y: -135,
				width: 60,
				height: 60,
				uid: pc.tsid+'_powder_self'
			});
		}

		pc.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: 2500,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -135,
			bubble: true,
			width: 40,
			height: 40,
			uid: pc.tsid+'_powder_all'
		}, pc);

		pc.announce_sound('POTION_GENERIC');

		this.apiSetTimerX("onPourComplete", 2500, pc, msg);

		return true;
	}
};

verbs.quaff = { // defined by potion_base
	"name"				: "quaff",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var tooltip = this.getClassProp('quaff_tooltip');
		if (tooltip && tooltip.length) {
			return tooltip;
		} else {
			tooltip = this.getInstanceProp('quaff_tooltip');
			if (tooltip && tooltip.length) {
				return tooltip;
			} else {
				return "This potion ain't hooked up right!";
			}
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.getClassProp('can_quaff') || !intval(this.getClassProp('can_quaff'))) {
			return {state: 'null'};
		}

		if (pc.is_dead) {
			return {state: 'disabled', reason: "This is no time to be messing about with potions. You're dead!"};
		}

		if (this.canQuaff) {
			var result = this.canQuaff(pc);
			if (result.ok) {
				return {state: 'enabled'};
			} else {
				if (result.error) {
					return {state: 'disabled', reason: result.error};
				} else {
					return {state: null};
				}
			}
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.onPreQuaff(pc, msg);

		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: 2500,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 0,
			delta_y: -135,
			width: 60,
			height: 60,
			uid: pc.tsid+'_powder_self'
		});

		pc.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: 2500,
			state: 'tool_animation',
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -135,
			bubble: true,
			width: 40,
			height: 40,
			uid: pc.tsid+'_powder_all'
		}, pc);

		pc.announce_sound('POTION_GENERIC');

		this.apiSetTimerX("onQuaffComplete", 2500, pc, msg);

		return true;
	}
};

function canPour(pc){ // defined by potion_garden_fertilize
	if (this.getClassProp('required_skill') != ''){
		var skill_id = this.getClassProp('required_skill');
		if (!pc.skills_has(skill_id)){
			return {ok: 0, error: "You need to know "+pc.skills_get_name(skill_id)+" to use this."};
		}
	}


	var targets = this.getValidTargets(pc);
	if (!num_keys(targets)) return {ok:0, error: "Only wet garden plots with seeds or seedlings can be fertilized."};

	for (var i in targets) { 
		 // Ours?
		var owner = targets[i].isPublic() ? null : targets[i].container.pols_get_owner();
		if (owner && owner.tsid != pc.tsid && !targets[i].container.acl_keys_player_has_key(pc)){
			return {ok:0, error: "You can't do that here."};
		}

		if (targets[i].fertilize_in_progress) { 
			return {ok:0, error: "This garden is already being fertilized!"};
		}
		if (targets[i].plant_in_progress) { 
			return {ok:0, error: "This garden is being planted - wait until that's done!"};
		}

		if (targets[i].getInstanceProp('garden_type') === "herb")  {
			var package_fertilize = "mg_herbalism_fertilize";
		}
		else {
			var package_fertilize = "mg_croppery_fertilize";
		}
		
		var planted_count = 0;
		var plots = targets[i].data.plots;
		for (var p in plots) {
			if (plots[p].seed && !plots[p].fertilized) {
				planted_count ++;
			}
		}
		
		var details = pc.getSkillPackageDetails(package_fertilize);
		if (pc.metabolics_get_energy() <= (details.energy_cost * planted_count)){
			return {ok:0, error: "You don't have enough energy to do that!"};
		}



		break;
	}

	return {ok:1};
}

function getValidTargets(pc){ // defined by potion_garden_fertilize
	function is_garden(it){ 
		if (it.hasTag("garden") || it.class_tsid=='garden_new') {
			var plots = it.data.plots;
			for (var p in plots) { 
				if (plots[p].seed && !plots[p].fertilized && plots[p].wet && plots[p].state != "crop") {
					return true;
				}
			}
				
			return false;
		}

		return false;
	}


	var garden = pc.findCloseStack(is_garden, 350);
	if (!garden) return [];
	return [garden];
}

function onPour(pc, msg){ // defined by potion_garden_fertilize
	var targets = this.getValidTargets(pc);

	if (is_array(targets)) { 
		for (var i in targets) {
			var garden = targets[i];
			break; 
		}
	}
	else { 
		var garden = targets;
	}

	if (!garden) { 
		var result = {'ok':0, 'msg': "Oops, there's nothing to fertilize."};
	}
	else if (garden.fertilize_in_progress || garden.plant_in_progress) {
		var result = {'ok':0, 'msg': "Somebody else is fertilizing or planting this garden."};
	}
	else {
		var result = this.doPotionGardenAction(pc, msg, 350, garden, "fertilize");
	}

	//log.info("MG result of onPour is "+result);

	return result;
}

function doPotionGardenAction(pc, msg, range, garden, action, seed_id){ // defined by mg_potion_base
	// Copied this function from main.js for calling by master gardener potions.

	//function is_garden(it){ return (it.hasTag("garden") || it.class_tsid=='garden_new'); }
	//var garden = pc.findCloseStack(is_garden, range);


	//log.info("MG garden is "+garden+" and is_garden "+garden.is_garden);
		
	if (garden && garden.is_garden){

		// range check...
		var x = Math.abs(garden.x - pc.x);
		var y = Math.abs(garden.y - pc.y);
		var range = Math.sqrt((x*x)+(y*y));
		var required_range = 300;
		var check_for_proximity = msg.check_for_proximity ? true : false;

		if (range > required_range && check_for_proximity){
			return pc.apiSendMsg(make_fail_rsp(msg, 101, "Get closer:"+required_range));
		}
		else if (range > config.verb_radius && !pc.houses_is_at_home()){
			var text = "Oops. The "+garden.name_single+" got too far away for you. Get closer and then try again.";
			if (pc.is_god) text += " ("+range+")";

			return pc.apiSendMsg(make_fail_rsp(msg, 1, text));
		}
			
		var args = {
			pc: pc.tsid,
			garden: garden,
			action: action,
			seed: seed_id,
		};
			
		//if (config.is_dev) log.info(this+" MG calling potionTendGarden with "+garden+" "+args);
		var ret = garden.potionTendGarden(args);
		//if (config.is_dev) log.info(this+" MG doPotionGardenAction result is "+ret);
		if (ret.ok){
			var rsp = make_ok_rsp(msg);
				
			/*if (ret.announce){
				rsp.energy = intval(ret.announce.energy);
				rsp.mood = intval(ret.announce.mood);
					rsp.xp = intval(ret.announce.xp);
				
				if (ret.announce.msg){
					var growl = ret.announce.msg;
					
					if (rsp.energy || rsp.mood || rsp.xp){
						growl += ' (';
						if (rsp.energy){
							growl += rsp.energy+' energy';
							
							if (rsp.mood || rsp.xp) growl += ', ';
						}
							
						if (rsp.mood){
							growl += '+'+rsp.mood+' mood';
								
							if (rsp.xp) growl += ', ';
						}
							
						if (rsp.xp) growl += '+'+rsp.xp+' iMG';
							
						growl += ')';
					}


					pc.sendActivity(growl);
				}

				
				if (ret.announce.drop_chance) { 
					log.info("MG running drop table "+ret.announce.dropTable);
					var items = pc.runDropTable(ret.announce.dropTable, garden);
				}
				else { 
					log.info("MG no drop chance ");
				}
			}*/
				
			var msg = pc.apiSendMsg(rsp);
			//log.info(this+" MG returning message "+msg);
			return {ok:1};
		}
		else{
			var msg = pc.apiSendMsg(make_fail_rsp(msg, 1, ret.error));
			//log.info(this+" MG returning message "+msg);
			return {ok:0};
		}
	}
	else{
		var msg = pc.apiSendMsg(make_fail_rsp(msg, 1, "Invalid itemstack_tsid"));
		//log.info(this+" MG returning message "+msg);
		return {ok:0};
	}

	log.info("MG should never get here");
}

function onPourComplete(pc, msg){ // defined by potion_base
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var result = this.onPour(pc, msg);

	if (result) {
		failed = !result.ok;
		if (result.msg) {
			self_msgs.push(result.msg);
		}
	} else {
		failed = true;
		self_msgs.push("This potion ain't hooked up right!");
	}

	if (!failed && !result.no_use){
		this.use(pc, 1);
		pc.achievements_increment('potions_used', this.class_tsid);
	}
	if (!this.isWorking()) {
		this.apiConsume(1);

		// Re-fill
		if (this.count){
			this.setInstanceProp('points_remaining', intval(this.getClassProp('points_capacity')));
			this.setInstanceProp('is_broken', 0);

			this.updateLabel();
			this.updateState();
			this.informClient();
		}
	}

	if (msg.target){
		var target = msg.target;
	} else {
		if (this.getValidTargets) var target = this.getValidTargets(pc).pop();
	}

	if (target && (target.class_id == 'npc_chicken' ||
			     target.class_id == 'npc_piggy' ||
			     target.class_id == 'npc_butterfly')){
		target.onInteractionEnding(pc);
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'pour', 'poured', failed, self_msgs, self_effects, they_effects);
	if (pre_msg) pc.sendActivity(pre_msg);

	return failed ? false : true;
}

function onPrePour(pc, msg){ // defined by potion_base
	//
	// Do nothing
	//
}

function onPreQuaff(pc, msg){ // defined by potion_base
	//
	// Do nothing
	//
}

function onQuaff(pc){ // defined by potion_base
	return {ok: 0, msg: "This potion ain't hooked up right!"};
}

function onQuaffComplete(pc, msg){ // defined by potion_base
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var result = this.onQuaff(pc, msg);

	if (result) {
		failed = !result.ok;
		if (result.msg) {
			self_msgs.push(result.msg);
		}

		if (!result.no_use){
			this.use(pc, 1);
			pc.achievements_increment('potions_used', this.class_tsid);
		}

	} else {
		failed = true;
		self_msgs.push("This potion ain't hooked up right!");
	}

	if (!this.isWorking()) {
		this.apiConsume(1);

		// Re-fill
		if (this.count){
			this.setInstanceProp('points_remaining', intval(this.getClassProp('points_capacity')));
			this.setInstanceProp('is_broken', 0);

			this.updateLabel();
			this.updateState();
			this.informClient();
		}
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'quaff', 'quaffed', failed, self_msgs, self_effects, they_effects);
	if (pre_msg) pc.sendActivity(pre_msg);

	return failed ? false : true;
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

function onOverlayDismissed(pc, payload){ // defined by tool_base
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

function parent_onPour(pc){ // defined by potion_base
	return {ok: 0, msg: "This potion ain't hooked up right!"};
}

function getDescExtras(pc){
	var out = [];
	if (pc && (!pc.skills_has("mastergardener_1"))) out.push([1, "You will not be able to use this until you have the <a href=\"\/skills\/138\/\" glitch=\"skill|mastergardener_1\">Master Gardener<\/a> skill."]);

	// automatically generated source information...
	out.push([2, "This can be made with a <a href=\"\/items\/981\/\" glitch=\"item|cauldron\">Cauldron<\/a>."]);
	if (pc && !pc.skills_has("potionmaking_1")) out.push([2, "You need to learn <a href=\"\/skills\/127\/\" glitch=\"skill|potionmaking_1\">Potionmaking I<\/a> to use a <a href=\"\/items\/981\/\" glitch=\"item|cauldron\">Cauldron<\/a>."]);
	if (pc && !(pc.skills_has("potionmaking_3"))) out.push([2, "The recipe for this will become available after you learn <a href=\"\/skills\/129\/\" glitch=\"skill|potionmaking_3\">Potionmaking III<\/a>."]);
	return out;
}

var tags = [
	"potion",
	"tinctures_potions",
	"pm3",
	"no_rube"
];

var has_custom_basecost = 1;


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-16,"y":-46,"w":30,"h":46},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI0klEQVR42u2YiVNTWRbG\/Q\/6T+iZ\nqqmZmu7pwaVtERVFW1txQVkEVBBZtAWVsBMI+w4JYUcUCIikAdlUdgjIjgIJhAghIWQlLCEJCDrV\nVV31zX2PqZpxpme6awbarilP1am83Hqp\/Or7zjn3vrdr18f4GNsXj9n2n9ZmufRUZTja\/ergalKd\nPqlkO4rqc11RkeIILvNcA7X2qwGsZDs0FCc6gJdqj9pMF5QlOYCf7mSmVP2gYKXPOo7eT3LhVXKc\nUJpyCXkxF1CWbI86riv4aU4UpOiDKflifMKtb2ywMN7PBiWJF1HNdSGAduCGnUF2uC2q0i\/Tdt9P\nceN9EMA53QJbajCCeeskciPPopLjSCcFyAk5g4zAU2CHnSXQjiipq7LYcaCwxN12XN5hUSbvMDr6\ncxpN7951zOqXUMa\/jzhfGxREnUce6xwyQ04jlXESQe4H4W2\/F5kPs9GnWdj5zvYJ+NycXHAQmaVf\no7a5Bcubb7H0ZgPSZQNS0pgI8bBCwp3jYPlY4+5VS3hetsKTnhZzn3bx6I7DhTJOmm8y\/gRW+n6k\nPziEeLYzhLMyyE1m6AnkNIHMecjF1bNfwMNuN3y9L6CoLgM5le7KotpjPbHcAz28xuPcxDyr7e9q\nW\/vffhoWfAIRUUSZiD8jmvMVEnIskVZgh6beaijX1rG4sYk5kwntY6PIIqAxXA8Exe1BWOJeBMXu\nQTC5juVu\/S6r\/AgScy17OI\/ucrcF8JzTb\/yd3H6PB7kuCI0+AEaUBa1kXNYBpN63ArvIDU0D9RBp\ndRgSC1H9nIcg1iU43\/gdGNG7aSh28SGQ+kVh9VH6mvM4EK1KZcy2ABaVsIupPwtkfgV+qQeSudY0\nHLfsMB7U2tCZmGcJTukFRKR9jQAC5X77DzTgvUgL+t6cCmtaubCkfUguZaJFodwe9QCEC3r7ay67\nW2xZFr8fWZyLSMk4gZh0KwL0JW051dkUKNVEVI16Mz4DM2Uf\/MK\/gOfdP9Lf70XbIu9ZmblZqbTb\nNjjD5mYNVWORCcH0H1EKhCfvQ0TMEeTnOCAv1w5Jmdb0GgVE1VlY0l763puBnyOD2Jlb5YW2eVVP\nq0LF61Qoft6uIhgccescHI5t6x8KFoyM2HYNDZ1r6uk\/XdnYaFNcV\/cpBbe0sTGsJl2qJcX\/ckoC\nb98L8Pb\/DGlFVjQEBRTCskRi4jdIi7uIZLKLBPofhW\/QbkQSZamk6pVujmzL6z8LrLO1\/nDro\/yA\niYlh7vza2hP1+hshSWzluk65ttZo3tgYkWl1CrXBAI3RCNWqEUqSYo0WQZF+cLtlAX+WBWIyt7oy\nir2f6krk18bA3e8gbSu1TtlOrbMy9qOo5pjyJ+GmpHKv+vzoYaGg\/AfxQDXqeemQamagfWOAfsME\n3boZshUDXs\/JMTQ2BqlKBfWqCUrDKqbJupjk1PIKKlvaiHV5YD9KBJefhJzqFNSNdYi6NRq728xL\nRz3u7EFk+pd0LfKeHqebJIXUZtHTgH+v4vj4aGRrVc6s4nUnFlVD0M8Poo2fgd42PlTLaixumrD8\ndg3zZiMGJycxIhJhZGICUrUacysrW3AkhYvL6JiRoVezIBrU63906GZW5dmxsnzMVL1SKhZ8dxSc\nkkNE4VsNPwonFI5+21CSItTIX2BBOYBlzSus6oWQTbRjWFCFyZdt0Jn0MLyjBi6l2CIkMinGpqYw\nKpFAsqDH5OLSe3BjJtN\/LPZOhemT\/GfFDQn3ryE++wANmsn7RvQvNypI1+RH+1bJxS0\/aOd6oSfq\nGXRjMC1N4s3qNCSjLZh81QapeAB6ox7Gv2xAu27ArF6D0dcSjEulEBGrKfU6pDJq0+f9FNw\/xlMy\nUrLr2WaqYbL4nqj55y6WCEddK7jBRtWsABTg4t8AzctibBhn8NYkg2SsE7PiQczLhFhZM8D4joJc\nhWxZB4lKiRECJpieRadc8V+d66jRktNUxo3NOYN6ufL9g8PjrLgHA20l37\/sfgRO2FWUswMQ7WGD\n2gIm5qc6sGmahXFRDOlUP+al41ArprBMFFx994a2W0bsFqrUEBN7WyXT\/9P0T+MnXK+Xy98H5Ibf\nFA62l6Ikg4EAcvwJv2pNAyb5nESG72k8TvfF2soUVrTjmJsegkI6ijmSetMSljbNkK4uYM64BJXZ\njAHdgmjbTyLsEK+17wqj8KKpCAzHgwh1PQKW+zHEe56gIdn3zmNBMQjDwhixfwQzom5Mj3djhtSk\n2ryMGQIoJ7WpW19D8+QUth2QE3bz+7jbjqRT65AW5IIg50O0ihRkDFGSzbDHkmYEi+ph6JWDdJ2+\nHmvGWG89RofbMa56jRnjAjRkRnYplNsPyC9kG5jXz6Aim4mhLh5Cr9nQkGFXjtCgTJIjXeUErA\/U\nGFLLuqGUdkHYV4N2Mieri5Nom+Vku2slzbLtgLXlhbWBzseR4OdM20xBhlw9BobTQQSSmsyL8YJs\nshmq2S2w+ZlOyMTN6Kpmo76IiacVqZhe1WOcNEnb7FzDtgPOa7VucX6uYHmdR2a4D172VGCwoxTh\nHqfgd+kAnhTHEqgOKKapbIdc0ooOAleXF4zqzLuoyWZgYLQbnbI5tCvV13ftRLQ+r1MEXrYBVYsZ\noTfI7lEO8ata8AtZEDzLJ1AtdMqmmlFZEIW0YE88TPUHPzcElezbeP78MVrkCvOOPfCIZTLrwrQo\nBF85hXhidUaIB231zMQzSCf\/npXcEMR5nEGk90Wi8Fmwbl5CSWk2miXTaFOq\/Xf0qeyldJbLuuWE\nkCsnEfOtE9JDbqClioNpUSNe9VYgO8oHzBu2CHc7hQhSDlG3HJCTHgmBXE4fNn+RNwGC8VFeVhIT\nDGJ35I3ziL\/jitwYX6QEuCHW1xmxty\/Tn3F+LuDXVaKTjBUKjtr4f7HXFf1zSv+mvl5zCusewr0u\nItTdFhGedojycUDc3WvIzUpCw\/AQmmZmqaaI2fUhgjqN9Op0119odNwXaq2yh5yUBWotulQadKjU\nPRSYYF7\/YV+bfYz\/l\/grM4D6O\/qrLcMAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/potion_garden_fertilize-1345957755.swf",
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
	"potion",
	"tinctures_potions",
	"pm3",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"o"	: "pour",
	"q"	: "quaff",
	"e"	: "repair"
};

log.info("potion_garden_fertilize.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
