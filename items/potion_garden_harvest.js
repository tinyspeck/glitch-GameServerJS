//#include include/takeable.js

var label = "Manyharvest Cordial";
var version = "1355086256";
var name_single = "Manyharvest Cordial";
var name_plural = "Manyharvest Cordials";
var article = "a";
var description = "Like a delicate tornado, one drop of Manyharvest Cordial will gently gather all ripe crops from the nearest garden (while,  like a twister filled with generosity, giving you all the usual 'super-harvest' bonuses).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 2200;
var input_for = [];
var parent_classes = ["potion_garden_harvest", "mg_potion_base", "potion_base", "tool_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"making_type"	: "",	// defined by tool_base
	"required_skill"	: "mastergardener_1",	// defined by tool_base (overridden by potion_garden_harvest)
	"points_capacity"	: "11",	// defined by tool_base (overridden by potion_garden_harvest)
	"display_wear"	: "1",	// defined by tool_base
	"can_repair"	: "0",	// defined by tool_base
	"can_pour"	: "1",	// defined by potion_base (overridden by potion_garden_harvest)
	"can_quaff"	: "0",	// defined by potion_base
	"pour_tooltip"	: "Harvest from all garden plots",	// defined by potion_base (overridden by potion_garden_harvest)
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

function canPour(pc){ // defined by potion_garden_harvest
	if (this.getClassProp('required_skill') != ''){
		var skill_id = this.getClassProp('required_skill');
		if (!pc.skills_has(skill_id)){
			return {ok: 0, error: "You need to know "+pc.skills_get_name(skill_id)+" to use this."};
		}
	}

	/*if ((!pc.location.pols_is_pol() || (!pc.location.pols_is_owner(pc)  && !pc.location.acl_keys_player_has_key(pc)))) {
		return {ok:0, error:"You can only use this potion in locations that you own or have a key for."};
	}*/

	var targets = this.getValidTargets(pc);

	if (!num_keys(this.getValidTargets(pc))) return {ok:0, error: "There is nothing to harvest here."};

	for (var i in targets) {
		//log.info("MG - manyharvest got target "+targets[i]+" for "+pc+" in progress is "+targets[i].harvest_in_progress);

		 // Ours?
		var owner = targets[i].isPublic() ? null : targets[i].container.pols_get_owner();
		if (owner && owner.tsid != pc.tsid && !targets[i].container.acl_keys_player_has_key(pc)){
			return {ok:0, error: "You can't do that here."};
		}

		if (targets[i].harvest_in_progress) { 
			return {ok:0, error: "This garden is already being harvested!"};
		}

		if (targets[i].getInstanceProp('garden_type') === "herb")  {
			var package_plant = "mg_herbalism_plant";
		}
		else {
			var package_plant = "mg_croppery_plant";
		}
		
		var grown_count = 0;
		var plots = targets[i].data.plots;
		for (var p in plots) {
			if (plots[p].state == 'crop') {
				grown_count ++;
			}
		}
		
		var details = pc.getSkillPackageDetails(package_plant);
		if (pc.metabolics_get_energy() <= (details.energy_cost * grown_count)){
			return {ok:0, error: "You don't have enough energy to do that!"};
		}

		break;
	}


	return {ok:1};
}

function getValidTargets(pc){ // defined by potion_garden_harvest
	function is_garden(it){ 
		if (it.hasTag("garden") || it.class_tsid=='garden_new') {
			var plots = it.data.plots;
			for (var p in plots) { 
				if (plots[p].state == "crop" && plots[p].seed) {
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

function onPour(pc, msg){ // defined by potion_garden_harvest
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
		//log.info("MG harvesting for "+pc+" and no garden");
		var result = {'ok':0, 'msg': "Oops, there's nothing to harvest here."};
	}
	else if (garden.harvest_in_progress) {
		//log.info("MG harvesting for "+pc+" and "+garden+" harvest in progress is "+garden.in_progress);
		var result = {'ok':0, 'msg': "Somebody else is harvesting this garden."};
	}
	else { 
		//log.info("MG harvesting for "+pc+" and "+garden+" harvest in progress is "+garden.in_progress);
		var result = this.doPotionGardenAction(pc, msg, 350, garden, "pick");
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAI30lEQVR42u2YaVBU6RWGrcqP\/EhV\n5kd+p5xUJknpxLghoiiu46ij4iAumGERFbdRRFZlU2jWbmh2WRqaRRhEFkEEpIEGZJG1obuhd3qn\nabvpBlFSk7LqzXev2TRJzVQC41TKr+pU3763uvq57znvOd+9K1Z8WB\/W0q17LLeV91kn+ZVMd9cf\nHVxV4vGPylnugkc5X6EswR3Zka511LkfDWA561hdAcMNnLijqE49hZJ4d1QkH7dTqr5XsNKGjh0F\nCae5ZUx35DOOIiv6CIrIZw3bg1aSQArem5KdY+JdvP7OuzFXdqE44UtUpp5EZpQr2KEHkB52EBVJ\nx2lIZsjB6PcCqDKaoiefWxDqtweZ4V+gPMWdjtSQ\/WAFHwDzxj4wgw8iI\/IYGFmM5U91KGOda0qh\nszq9dLu99WnGQ\/viYqvEZAa3\/C4Sr3+GnMjDyIo4hNTg\/Yj334tAry0457YBqQXp6NYZl9\/Zl4LX\n2JPznZFatBfVj5tgebUI0\/wLTBAVg6644ebZbYj9ejcizrvgisdmeLptRmXbY3u33rRj2eFuBe6z\n+934FBHJm5DK3QYGceqoTAaFzY5pCtL8HLfC\/OB5+A\/wcV2Hy+eOIK+GiYxyL3Ve9U7+nbTNfG79\n7mhG1talT\/VBt1+tDA3ag5sR23EtfC1usx2RmLsVKflHUfukFuq5eTx\/+QqK2Vk0PO0C624cQmL2\nICx+I24mbETg7fUIjdtI\/y42wwksjjMYmU78lNKr7CUBPHT8Y\/+TXr9DfuYphERtxvWodbSSRBUC\n6oLkHB809tRCbJwGXzCENM5t+F1zwckzn+B65FoaKimP3FChM+7e30EDxmYfQ93E0NK4O6+QxfnK\n77e4cdMRJXmeiGVtR3SqI9jF25BfvYuO+JwtSCk6gqCYXQggN+B7bRVO+n5CKx6TvhkZZS50aVBK\nJnID0KRSL416AL7mP3vWf9p3PQLvrEfQbQewEg8jgbkX0clbcSvJAVEpjkgr2Y7cqp2knTgh4S5x\n7\/XVuJXogMsha+B7dRX9PYzpg4LWGvtjtdp1KcB+8ufXry9Nv3zJo2osPDaI\/qPgmA10bUXGuIBb\ncAqFnOOIS3X5e71RaaeOz\/qvxvmA1bTKOdVX0TKlUTerNFyeSvX9p8qARPILAvJTEj8j8XNeV\/+q\nivr69cV1db+m4HRzczItcaneZsMzkRhnLn4GyslULVHKhSc7IDiCKBa\/H0l3jiI+2hWBATtwOXAd\nwsn1m0RBqgbjiKqx6U7e3wuqazD7l73j+eelBgGbKPNAO\/9ilAQ0JNTz8wap2VJnstm6ZXqDSWux\nQEecqbHOYoqEUKfHtTBPeF38lK6zv7kykrWJrsH0yki4e\/0eV8LW0OeptN9Jc0QEcxPyqnaqvxNO\nqlI5dI8kd0pkla8Vyod4Ol4Itd0A\/QsLjAs26OdtEE+bMCaRYEQogoEASnUGqC1WiEgzFpIQkX5X\n3tSCpAI2WKUMsCvikPmAZa8f7+F36HSuX5z42Nvj7G9odammTnofqdFNSCA3kFcf8J9VHBjv3N7d\nm69Uy9tg0vTBpOvDoDQX41P10M3pYXppg\/nVHFR2Kp0iDAjGMCgUYlKjgUhveANHYpSMtlaJHF06\no6B3enolNSV4NttbdXUm4HNX\/9uH7BRkVrkLWKQk2MTB2dUX6v4t3KCgfWtbZ4ZEp+iEUd0Ds34Q\ns9Oj0Bo6MGlogHKmC9MLJlgW52FasBPFTJhUKTBMQIfEYkiJauOmGQwbTXg0KqThht+BenfxVLaP\nshs4dUlF3nS6qRbD5OwT\/OuOg7imqiGyXjnZAr2yi1bPYhiGfWYcL6yTUJv4mDJ3Q2cZhnlhBrN\/\nWiCptkA+rceoZBICmRwCouIYUY6CI0Of+11w\/7zqSUvJqGXZKdOkVfii6l0XS5SjHo0tjG81sva\/\nAvbDYiSAZiEWZqVYnFcQwB7orKOYtk\/A+sqK2UUK0gqF2YgJrQb9MgWaBCLwFCruf9OyqNbC6XjI\nZ9w9iFqF+u2NQ2Mbu3hooBRqaRuoFDc0RyKlYDfSSH8qrD0A\/kA47FYxUXCIAIphnpcRyFlYF1+Q\ndNsgJ+kWaLUQmi3oNRr\/p9GU01zMrlUo3ga8VxsqfgPIg1bOx\/jofcRnO5Gx5IysChfUtp7H3HMR\nLDOjMFhHYLQJSYgws2DGzEs7pFYjlNYZyEi76TEY+Uu+EympCfq28Uk8VJOtkIkakZp7mMxGRyTl\nbiH7Omd80+ADKzEMVZczumfQmvqgtfRDax2Cbv45JARQMWuCdm4O3QaDYOkBq4Nf55Wfg3isDoyU\nAwhhbEAk0wGp+Z+T5upEUh5Kg5m0\/bTDqTpV6dqISVog1vKJOaSQzBqhnZ9HJ+mJSw7Y2J5jTSvy\nQH0LA2UVgWQCrEVS5iEoJprxsDEcgwNcGFRPCVg3XaNaeQddDlJlAwRTHHQJi4mK05CTkdeu0S19\nilu6uDXMfDfkVvihr68IBcWXIBmvp01DOZsCokIj66DPTUl4BL4JI\/I89EoT0SvLwYTVhBHSZnga\nHXfJAaf0es\/ssgvIKPFESc0NjAxWQCFuhnKiha7LKcmboI5Vk0\/oa8MTeeiZZKBrIgrdEzEYMU6A\nJ1fiiVrrvWI5Vkd\/vYqZeww5pBbLagIhFtRCLnpMookAvQnqmDr3qDUB5Y9uoKkvEvyxBPBFEeiQ\nVKNZobIv2wOPUC53Ka6OAqvgBEn1BVrJwf5SSMYaIB3\/RzzpjEVFgy8ySn1In\/Qku+AzuM\/PQ4tU\njha11n9Zn8q6hUPstKJzYOWfQM69c+BUXUNfDweTgocYGShHafV1AvZHZJZ4kG2SJzJLfVHcGI+O\nKSW12eSv+CEWXyTg5leGkwedL5HO9UJexUWU1YYg\/5vLBPo8sgl4FgnquK73AdpUahqOGvw\/2OuK\np0q1f21XnT2jxB+pHB+kcE4jg+uNrBJfUqOXUdqSjkbhMFoUKsoU7+edCrUb6TIYvPlqNbtTq1fz\nyU65XatHq3IKrRotn0fA2qem3+9rsw\/r\/2X9BY3pNVsPVKTWAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/potion_garden_harvest-1345957812.swf",
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

log.info("potion_garden_harvest.js LOADED");

// generated ok 2012-12-09 12:50:56 by ali
