//#include include/cultivation.js, include/npc_conversation.js

var label = "Patch";
var version = "1352936202";
var name_single = "Patch";
var name_plural = "Patches";
var article = "a";
var description = "A humble, weedy patch. With a spade you can dig it, a hoe you can tend it, and, with a bean, even grow a tree in it. (NB: Trees are delicate organisms, and beans will only consent to being planted in the correct region.)";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["patch"];
var has_instance_props = true;

var classProps = {
	"conversation_offset_y"	: "-35",	// defined by patch
	"conversation_offset_x"	: "0"	// defined by patch
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.cultivation_max_wear = "2000";	// defined by patch
	this.instanceProps.cultivation_wear = "";	// defined by patch
}

var instancePropsDef = {
	cultivation_max_wear : ["Max wear"],
	cultivation_wear : ["Current wear"],
};

var instancePropsChoices = {
	cultivation_max_wear : [""],
	cultivation_wear : [""],
};

var verbs = {};

verbs.remove = { // defined by patch
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Pour {$stack_name} on {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return this.proto_class && stack.class_tsid == 'wine_of_the_dead';
	},
	"conditions"			: function(pc, drop_stack){

		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state:null};
		if (this.proto_class && drop_stack && drop_stack.class_tsid == 'wine_of_the_dead') return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var it = pc.getAllContents()[msg.target_itemstack_tsid];
		if (!it) return false;

		msg.target = this;
		return it.verbs['pour'].handler.call(it, pc, msg);
	}
};

verbs.talk_to = { // defined by patch
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		if (convos.length) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 1;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		for (var i=0; i<convos.length; i++){
			var conversation_runner = "conversation_run_"+convos[i];
			if (this[conversation_runner]){
				failed = 0;
				this[conversation_runner](pc, msg);
				break;
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.dig = { // defined by patch
	"name"				: "dig",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Obtain some earth. Costs $energy_cost energy",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Dig this {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'shovel' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		// Find a shovel
		function is_shovel(it){ return (it.class_tsid == 'shovel' || it.class_tsid == 'ace_of_spades') && it.isWorking() ? true : false; }
		var shovel = pc.findFirst(is_shovel);

		if (!shovel){
			return {state:'disabled', reason: "You need a working shovel."}; 
		}

		if (this.planted){
			return {state: 'disabled', reason: "A seedling is growing - why would you dig it out?"};
		}
		if (this.is_dug){
			return {state: 'disabled', reason: "There is already a hole there."};
		}

		if (this.container.verbAvailable){
			var avail = this.container.verbAvailable(this.class_tsid, 'dig');
			if (avail) return avail;
		}

		return {state: 'enabled'};
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('dig_patch');
	},
	"handler"			: function(pc, msg, suppress_activity){

		if(!this.diggers) {
			this.diggers = {};
		}

		if(this.is_being_tended) {
			pc.sendActivity("Someone else is already working on this patch.");
			return false;
		}
		if (this.planted){
			pc.sendActivity("A seedling is growing - why would you dig it out?");
			return false;
		}
		if (this.is_dug){
			pc.sendActivity("There is already a hole there.");
			return false;
		}

		// Find a shovel
		if (msg.target_itemstack_tsid){
			var shovel = pc.getAllContents()[msg.target_itemstack_tsid];
		}
		else{
			function is_shovel(it){ return (it.class_tsid == 'shovel' || it.class_tsid == 'ace_of_spades') && it.isWorking() ? true : false; }
			var shovel = pc.findFirst(is_shovel);
		}

		this.diggers[pc.tsid] = pc.label;

		// Run the darned thing
		var ret = pc.runSkillPackage('dig_patch', this, {tool_item: shovel, word_progress: config.word_progress_map['digging'], callback: 'onDigComplete', msg: msg});

		if (!ret['ok']){
			delete this.diggers[pc.tsid];

			if (ret['error_tool_broken']){
				pc.sendActivity("Your shovel doesn't have enough wear remaining.");
			}
			else{
				pc.sendActivity("Oops! That didn't work. Try again?");
			}

			return false;
		}


		return true;
	}
};

verbs.plant = { // defined by patch
	"name"				: "plant",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Or, drag a bean to the patch",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Plant {$count} {$stack_name}",
	"drop_ok_code"			: function(stack, pc){

		return stack.is_seasoned_bean ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.planted){
			return {
				'state': 'disabled',
				'reason': "There's already a seedling here.",
			};
		}

		if (this.is_messy){
			return {
				'state': 'disabled',
				'reason': "You should probably tend to the weeds first.",
			};
		}

		if (this.is_dug){
			return {
				'state': 'disabled',
				'reason': "You need to wait for the hole to fill in first.",
			};
		}

		if (drop_stack && !this.canPlant(drop_stack)){
			return {
				'state': 'disabled',
				'reason': "That bean will not grow here.",
			};
		}

		if (this.container.verbAvailable){
			var avail = this.container.verbAvailable(this.class_tsid, 'plant');
			if (avail) return avail;
		}

		var possibles = this.getPossibleBeans(pc);

		if (possibles.length){
			return {
				'state': 'enabled',
			};
		}else{
			return {
				'state': 'disabled',
				'reason': "But what to plant? You need a *seasoned* bean. Plain beans will not work, so ask a friend where to find a seasoned one.",
			};
		}
	},
	"requires_target_item_count"	: false,
	"choices_are_stacks"	: false,
	"valid_items"		: function(pc){

		var possibles = this.getPossibleBeans(pc);

		if (possibles.length){
			return {
				'ok' : 1,
				'choices' : possibles,
			};
		}else{
			return {
				'ok' : 0,
				'txt' : "But what to plant? You need a *seasoned* bean. Plain beans will not work, so ask a friend where to find a seasoned one.",
			};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		// the bean has been passed to us - execute the plant verb on it!

		var stack = pc.removeItemStackClass(msg.target_item_class, 1);

		if (!stack){
			log.error('failed to find other stack - wtf');
			return false;
		}

		msg.target_item_class;
		return stack.verbs['plant'].handler.call(stack, pc, msg);
	}
};

verbs.tend = { // defined by patch
	"name"				: "tend",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Weed & prepare for planting",
	"get_tooltip"			: function(pc, verb, effects){

		var details = pc.trySkillPackage('soil_appreciation');

		var tooltip = verb.tooltip;

		if (pc.knowsAboutEnergy()){
			tooltip += ". Costs "+details.energy_cost+" energy and gives "+details.mood+" mood";
		}

		return tooltip;
	},
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Tend this {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'hoe' || stack.class_tsid == 'high_class_hoe' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		// Find a hoe
		function is_hoe(it){ return (it.class_tsid == 'hoe' || it.class_tsid == 'high_class_hoe') && it.isWorking() ? true : false; }
		var hoe = pc.findFirst(is_hoe);

		if (!hoe){
			return {state:'disabled', reason: "You need a working hoe."}; 
		}

		if (this.planted){
			return {state: 'disabled', reason: "A seedling is growing - no need for tending!"};
		}
		if (!this.is_messy || this.is_dug){
			return {state: 'disabled', reason: "Nope, no tending needed."};
		}

		if (this.container.verbAvailable){
			var avail = this.container.verbAvailable(this.class_tsid, 'tend');
			if (avail) return avail;
		}

		return {state: 'enabled'};
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('soil_appreciation');
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.is_being_tended) {
			pc.sendActivity("Someone else is already working on this patch.");
			return false;
		}
		if(this.diggers) {
			for(var i in this.diggers) {
				pc.sendActivity("Someone else is already working on this patch.");
				return false;
			}
		}
		if (this.planted){
			pc.sendActivity("A seedling is growing - no need for tending!");
			return false;
		}
		if (!this.is_messy || this.is_dug){
			pc.sendActivity("Nope, no tending needed.");
			return false;
		}

		// Find a hoe
		if (msg.target_itemstack_tsid){
			var hoe = pc.getAllContents()[msg.target_itemstack_tsid];
		}
		else{
			function is_hoe(it){ return it.class_tsid =='high_class_hoe' && it.isWorking() ? true : false; }
			var hoe = pc.findFirst(is_hoe);
			if (!hoe){
				function is_hoe(it){ return it.class_tsid == 'hoe' && it.isWorking() ? true : false; }
				hoe = pc.findFirst(is_hoe);
			}
		}

		pc.overlay_dismiss(this.tsid+'_bubble');

		this.is_being_tended = pc.tsid;
		this.apiSetTimer('onTendTimeout',10000);

		var tool_wear_multiplier = 1;
		if (pc.imagination_has_upgrade('hoeing_more_img_more_wear') && !pc.aggressive_off){
			var xp_bonus = 2;
			tool_wear_multiplier = 1.5;
			if (pc.skills_has('soil_appreciation_5')){
				xp_bonus = 10;	
				tool_wear_multiplier = 5;
			}else if (pc.skills_has('soil_appreciation_4')){
				xp_bonus = 8;
				tool_wear_multiplier = 5;
			}else if (pc.skills_has('soil_appreciation_3')){
				xp_bonus = 6;
				tool_wear_multiplier = 4;
			}else if (pc.skills_has('soil_appreciation_2')){
				xp_bonus = 5;
				tool_wear_multiplier = 2;
			}else if (pc.skills_has('soil_appreciation_1')){
				xp_bonus = 3;
				tool_wear_multiplier = 1.5;
			}
			pc.addSkillPackageOverride('soil_appreciation', {'xp_bonus': xp_bonus});
		}

		// Run the darned thing
		var ret = pc.runSkillPackage('soil_appreciation', this, {tool_item: hoe, tool_wear_multiplier: tool_wear_multiplier, word_progress: config.word_progress_map['tend'], no_fail: !pc.has_done_intro, callback: 'onTendComplete', msg: msg});

		pc.removeSkillPackageOverride('soil_appreciation');

		if (!ret['ok']){
			this.is_being_tended = false;
			this.apiCancelTimer('onTendTimeout');
			if (ret['error_tool_broken']){
				pc.sendActivity("Your hoe doesn't have enough wear remaining.");
			}
			else{
				this.checkAndSendResponse('tend_failed', pc);
			}

			return false;
		}

		return true;
	}
};

function buildState(){ // defined by patch
	if (this.planted) return 'scene:seedling';
	if (this.is_dug) return 'scene:dug';
	if (this.is_messy) return 'scene:dirty';
	return 'scene:clean';
}

function canPlant(bean){ // defined by patch
	if (!this.container) return false;

	// everything is ok in new POLs
	if (this.container.pols_is_pol() && this.container.getProp('is_home')) return true;

	if (this.class_tsid == 'patch_dark'){
		if (bean.trant_class == 'trant_egg') return true;
	}
	else{
		// no egg plants
		if (bean.trant_class == 'trant_egg') return false;

		// everything else is ok in POLs or in Pat's test location
		if (this.container.pols_is_pol()) return true;
		if (config.is_dev && this.container.tsid == 'L001') return true;

		// And now, the restrictions based on geography
		if (config.is_dev) return true;
		if (this.can_plant_mappings[bean.trant_class] && in_array(this.container.hubid, this.can_plant_mappings[bean.trant_class])) return true;
	}

	return false;
}

function checkAndSendResponse(key, pc, slugs, txt_pc){ // defined by patch
	if (this.container.is_skillquest) return;

	return this.sendResponse(key, pc, slugs, txt_pc);
}

function getPossibleBeans(pc){ // defined by patch
	var uniques = {};
	var items = pc.apiGetAllItems();
	for (var i in items){
		var it = items[i];
		if (it.is_seasoned_bean && this.canPlant(it)){
			uniques[it.class_tsid] = it.tsid;
		}
	}

	var possibles = [];
	for (var i in uniques){
		possibles.push(i);
	}

	return possibles;
}

function giveBean(){ // defined by patch
	var pc = this.findClosePlayer();
	pc.createItemFromSource('bean_bean', 1, this);
}

function giveThanks(){ // defined by patch
	var pc = this.findClosePlayer();
	pc.overlay_dismiss(this.tsid+'_bubble');
	pc.announce_itemstack_bubble(this, "Ooh. Thank you! Very kind. Have a special bean!", 10*1000);

	this.apiSetTimer('giveBean', 2000);
}

function make_config(){ // defined by patch
	var ret = {};
	ret = this.buildConfig(ret);
	return ret;
}

function onCreate(){ // defined by patch
	this.initInstanceProps();
	this.planted = 0;
	this.is_messy = 1;
	this.state = 1;
	this.onRegrowTimer();

	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(400, 400);
}

function onDigComplete(pc, ret){ // defined by patch
	var msg = ret.msg ? ret.msg : '';

	var failed = 1;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if(this.diggers) {
		if(this.diggers[pc.tsid]) {
			delete this.diggers[pc.tsid];
		}
	}

	if (ret['ok']){
		failed = 0;

		var slugs = {};
		if (ret.values['energy_cost']){
			slugs.energy = ret.values['energy_cost'];
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: ret.values['energy_cost']
			});
		}

		if (ret.values['mood_bonus']){
			slugs.mood = ret.values['mood_bonus'];
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: ret.values['mood_bonus']
			});
		}

		if (ret.values['xp_bonus']){
			slugs.xp = ret.values['xp_bonus'];
			self_effects.push({
				"type"	: "xp_give",
				"value"	: ret.values['xp_bonus']
			});
		}

		if (!ret.details['got_drop']){
			pc.createItemFromSource('earth', ret.details['bonus_amount'], this);
			self_effects.push({
				"type"	: "item_give",
				"value"	: ret.details['bonus_amount'],
				"which"  : "Lumps of Earth"
			});

			this.checkAndSendResponse('dig_na_sa1_sa5', pc, slugs);

			pc.quests_inc_counter('dig_dirt', ret.details['bonus_amount']);
		}
		else{
			this.checkAndSendResponse('dig_loam_drop', pc, slugs);
			for (var i in ret.details['got_drop']){
				var it = ret.details['got_drop'][i];
				pc.quests_inc_counter('dig_loam', it.count);			
			}
		}

		// you win!
		pc.quests_inc_counter('patches_dug', 1);
		pc.achievements_increment('patches', 'dug');
		pc.achievements_increment('dug', 'dirt');

		// mark as dug
		this.setDug();

		this.addWear(5);
		this.container.cultivation_add_img_rewards(pc, 8.0);
		if (this.isDepleted()) this.replaceWithDepleted();
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'dig', 'dug', failed, self_msgs, self_effects, they_effects);
	pc.sendOnlineActivity(pre_msg);
}

function onFillTimer(){ // defined by patch
	this.setMessy();
	//log.info('triggered regrowth...');
}

function onLoad(){ // defined by patch
	if (!this.hitBox){
		this.apiSetPlayersCollisions(true);
		this.apiSetHitBox(400, 400);
	}

	if (this.container.pols_is_pol() && this.container.getProp('is_home') && !this.canWear()){
		this.initWear();
		this.proto_class = 'proto_patch';
	}
}

function onOverlayDismissed(pc, payload){ // defined by patch
	if(this.diggers) {
		if(this.diggers[pc.tsid]) {
			delete this.diggers[pc.tsid];
		} else {
			this.is_being_tended = false;
			this.apiCancelTimer('onTendTimeout');
		}
	} else {
		this.is_being_tended = false;
		this.apiCancelTimer('onTendTimeout');
	}
}

function onPlayerCollision(pc){ // defined by patch
	if (this.conversations){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}
}

function onRegrowTimer(){ // defined by patch
	if (this.planted) return;
	this.setMessy();
	//log.info('triggered regrowth...');
}

function onTendComplete(pc, ret){ // defined by patch
	var msg = ret.args ? ret.args.msg : '';

	var failed = 1;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	this.is_being_tended = false;
	this.apiCancelTimer('onTendTimeout');

	if (ret['ok']){
		failed = 0;

		var slugs = {};
		if (ret.values['energy_cost']){
			slugs.energy = ret.values['energy_cost'];
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: ret.values['energy_cost']
			});
		}

		if (ret.values['mood_bonus']){
			slugs.mood = ret.values['mood_bonus'];
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: ret.values['mood_bonus']
			});
		}

		if (ret.values['xp_bonus']){
			slugs.xp = ret.values['xp_bonus'];
			self_effects.push({
				"type"	: "xp_give",
				"value"	: ret.values['xp_bonus']
			});
		}

		// you win!
		pc.quests_inc_counter('patches_tended', 1);
		pc.achievements_increment('patches', 'tended');
		pc.location.cultivation_add_img_rewards(pc, 3.0);

		// mark as non-messy
		this.setClean();

		if (ret.details['got_drop']){
			this.checkAndSendResponse('tend_drop', pc, slugs);
		}
		else{
			this.checkAndSendResponse('tend_na_sa1_sa5', pc, slugs);
		}
	}
	else{
		this.checkAndSendResponse('tend_failed', pc);
		pc.announce_sound('CLICK_FAILURE');
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'tend', 'tended', failed, self_msgs, self_effects, they_effects);
	pc.sendOnlineActivity(pre_msg);
}

function onTendTimeout(){ // defined by patch
	if (this.is_being_tended){
		log.info("STUCK PATCH! - timer hit but is_being_tended was still "+this.is_being_tended);
		delete this.is_being_tended;
	}
}

function plantBean(trant_class, pc){ // defined by patch
	// replace ourselves with a seedling...

	var seedling = apiNewItem('patch_seedling');
	seedling.trant_class = trant_class;
	seedling.owner = pc;
	seedling.setTimers(pc);
	if (this.canWear()){
		seedling.setInstanceProp('cultivation_wear', this.getInstanceProp('cultivation_wear'));
		seedling.setProp('proto_class', this.getProp('proto_class'));
	}

	this.container.apiPutItemIntoPosition(seedling, this.x, this.y);

	pc.apiSendLocMsg({ type: 'location_event' });
	seedling.checkAndSendResponse('plant_bean', pc);

	pc.quests_inc_counter('bean_plant_'+trant_class, 1);
	pc.quests_inc_counter('beans_planted', 1);

	//
	// Mildly guilty poisoners feel less guilty when they make new trees
	//
	if (pc.buffs_has('poisoners_guilt')){
		var buff = pc.buffs_get_instance('poisoners_guilt');

		if (buff.args.is_second_time && pc.buffs_get_remaining_duration('poisoners_guilt') > 90){
			// remove the super-long guilt and replace with a bog-standard one
			pc.buffs_remove('poisoners_guilt');
			pc.buffs_apply('poisoners_guilt');
			pc.sendActivity("Some of your tree-poisoning-related guilt subsides.");
		} else {
			pc.buffs_remove('poisoners_guilt');
			pc.sendActivity("You no longer feel guilty about that tree you poisoned.");
		}
	}

	pc.hub_plant_beans_add(this.container.hubid);

	if (this.container.pols_is_owner(pc)){
		pc.quests_inc_counter('pol_beans_planted', 1);
	}

	this.apiDelete();
}

function setClean(){ // defined by patch
	this.is_messy = 0;
	this.is_dug = 0;
	this.broadcastState();
	this.apiSetTimer('onRegrowTimer', 1000 * 60 * 1.5); // 1.5m
}

function setDug(){ // defined by patch
	this.is_dug = 1;
	this.is_messy = 0;
	this.broadcastState();
	this.apiCancelTimer('onRegrowTimer');
	this.apiSetTimer('onFillTimer', 1000 * 60 * 10); // 10m
}

function setMessy(){ // defined by patch
	this.messy_at = time();
	this.is_dug = 0;
	this.is_messy = 1;
	this.broadcastState();
}

// global block from patch
// Bean trant class to valid hubs

var can_plant_mappings = {
	// Bean: Groddle Forest, Groddle Meadow, Groddle Heights, Alakol, Salatu, Andra, Kajuu, Ormonos, Bortola, Muufo, Tamila, Besara, Aranna, Ormonos, Lida, Rasana, Karnata, Brillah, Tahli, Firozi, Folivoria, Cauda, Sura, Fenneq, Vantalu, Haraiva
	'trant_bean': [56, 58, 64, 76, 93, 89, 85, 102, 75, 97, 92, 98, 101, 102, 105, 109, 88, 112, 113, 114, 119, 120, 121, 123, 100, 116],

	// Bubble: Groddle Forest, Groddle Meadow, Groddle Heights, Uralia, Ilmenskie Caverns, Ilmenskie Deeps, Ix, Ormonos, Bortola, Muufo, Cauda, Fenneq, Tamila, Besara, Aranna, Ormonos, Lida, Karnata, Brillah, Firozi, Fenneq, Nottis, Vantalu, Haraiva, Drifa
	'trant_bubble': [56, 58, 64, 51, 50, 78, 27, 102, 75, 97, 92, 98, 101, 102, 105, 88, 112, 114, 120, 123, 137, 100, 116, 141],

	// Fruit: Groddle Forest, Groddle Meadow, Groddle Heights, Alakol, Salatu, Andra, Kajuu, Ormonos, Bortola, Muufo, Tamila, Besara, Aranna, Lida, Rasana, Karnata, Brillah, Tahli, Firozi, Folivoria, Cauda, Sura, Fenneq, Skill Quests, Vantalu, Haraiva
	'trant_fruit': [56, 58, 64, 76, 93, 89, 85, 102, 75, 97, 92, 98, 101, 105, 109, 88, 112, 113, 114, 119, 120, 121, 123, 132, 100, 116],

	// Gas: Uralia, Ilmenskie Caverns, Ilmenskie Deeps, Shimla Mirch, Chakra Phool, Jethimadh, Kalavana, Ix
	'trant_gas': [51, 50, 78, 63, 72, 71, 99, 27],

	// Spice: Shimla Mirch, Chakra Phool, Jethimadh, Kalavana, Ix
	'trant_spice': [63, 72, 71, 99, 27],

	// Wood: Groddle Forest, Groddle Meadow, Groddle Heights, Alakol, Salatu, Andra, Kajuu, Ormonos, Bortola, Muufo, Tamila, Besara, Aranna, Ormonos, Lida, Rasana, Karnata, Brillah, Tahli, Firozi, Folivoria, Cauda, Sura, Fenneq, Nottis, Vantalu, Haraiva, Drifa
	'wood_tree': [56, 58, 64, 76, 93, 89, 85, 102, 75, 97, 92, 98, 101, 102, 105, 109, 88, 112, 113, 114, 119, 120, 121, 123, 137, 100, 116, 141]
};

function conversation_canoffer_creator_of_the_universe_3(pc){ // defined by conversation auto-builder for "creator_of_the_universe_3"
	var chain = {
		id: "creator_of_the_universe",
		level: 3,
		max_level: 3
	};
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "creator_of_the_universe_2")){
			return true;
	}
	return false;
}

function conversation_run_creator_of_the_universe_3(pc, msg, replay){ // defined by conversation auto-builder for "creator_of_the_universe_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "creator_of_the_universe_3";
	var conversation_title = "The Creator of the Universe";
	var chain = {
		id: "creator_of_the_universe",
		level: 3,
		max_level: 3
	};
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['creator_of_the_universe_3-0-2'] = {txt: "What do? I mean, does? What does?", value: 'creator_of_the_universe_3-0-2'};
		this.conversation_start(pc, "It make me laugh it do.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_3', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_3-0-2"){
		choices['1']['creator_of_the_universe_3-1-2'] = {txt: "Ridiculous?", value: 'creator_of_the_universe_3-1-2'};
		this.conversation_reply(pc, msg, "Fings are all likes \"one true giant\" dis and \"uvver true giant\" vat. It's juss dikkle’us.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_3', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_3-1-2"){
		choices['2']['creator_of_the_universe_3-2-2'] = {txt: "No, I mean, WHY is it ridiculous? ", value: 'creator_of_the_universe_3-2-2'};
		this.conversation_reply(pc, msg, "Yus. Dikkle’us.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_3', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_3-2-2"){
		choices['3']['creator_of_the_universe_3-3-2'] = {txt: "And who IS, then?", value: 'creator_of_the_universe_3-3-2'};
		this.conversation_reply(pc, msg, "Cos thems aren’t one true nuffink. ", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_3', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_3-3-2"){
		choices['4']['creator_of_the_universe_3-4-2'] = {txt: "None of the Giants are Top Giant?", value: 'creator_of_the_universe_3-4-2'};
		this.conversation_reply(pc, msg, "None’ve ‘em. ", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_3', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_3-4-2"){
		choices['5']['creator_of_the_universe_3-5-2'] = {txt: "I'm sorry, say what now?", value: 'creator_of_the_universe_3-5-2'};
		this.conversation_reply(pc, msg, "Hur hur hur hur. No. There’s NOT any giants at all, silly. I like you.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_3', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_3-5-2"){
		choices['6']['creator_of_the_universe_3-6-2'] = {txt: "Bye then.", value: 'creator_of_the_universe_3-6-2'};
		this.conversation_reply(pc, msg, "Mabbite called Mahir did make’em all up. For funs. ‘K, I tired now bye.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'creator_of_the_universe_3', msg.choice);
	}

	if (msg.choice == "creator_of_the_universe_3-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_perspectives_of_a_patch_1(pc){ // defined by conversation auto-builder for "perspectives_of_a_patch_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "creator_of_the_universe_3")){
			return true;
	}
	return false;
}

function conversation_run_perspectives_of_a_patch_1(pc, msg, replay){ // defined by conversation auto-builder for "perspectives_of_a_patch_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "perspectives_of_a_patch_1";
	var conversation_title = "Perspectives of a Patch";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	if (!msg.choice){
		choices['0']['perspectives_of_a_patch_1-0-2'] = {txt: "Hi!", value: 'perspectives_of_a_patch_1-0-2'};
		this.conversation_start(pc, "Hullo!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_1', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_1-0-2"){
		choices['1']['perspectives_of_a_patch_1-1-2'] = {txt: "That’s nice.", value: 'perspectives_of_a_patch_1-1-2'};
		this.conversation_reply(pc, msg, "I likes you.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_1', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_1-1-2"){
		choices['2']['perspectives_of_a_patch_1-2-2'] = {txt: "You mean a Mabbite?", value: 'perspectives_of_a_patch_1-2-2'};
		this.conversation_reply(pc, msg, "I likes you, an’ I likes Mahir. Mahir was a Mabbit.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_1', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_1-2-2"){
		choices['3']['perspectives_of_a_patch_1-3-2'] = {txt: "And you have one of those for me?", value: 'perspectives_of_a_patch_1-3-2'};
		this.conversation_reply(pc, msg, "Hur hur hur. Yus. Not Mabbit. Mabbite. Eleventy-FOUSAND yearas before you. Mahir buried fings in patches. Mahir liked patches. Sometime he did bury musical blockses, and sometime he did bury secret fings. Bits of Mabbite history an’ stuffs.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_1', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_1-3-2"){
		choices['4']['perspectives_of_a_patch_1-4-2'] = {txt: "A real key? An actual key?", value: 'perspectives_of_a_patch_1-4-2'};
		this.conversation_reply(pc, msg, "Hur hur hur! No I doesn’t has’em. I don’t fink. But somewhere, in some patch, he left a key. An he said that if you FINDS it, you know the secrets of the giants.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_1', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_1-4-2"){
		choices['5']['perspectives_of_a_patch_1-5-2'] = {txt: "Eeeenteresting.", value: 'perspectives_of_a_patch_1-5-2'};
		this.conversation_reply(pc, msg, "No, wally. Made of metaphoricalisms, his key, that’s what Mahir said.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_1', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_1-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_perspectives_of_a_patch_2(pc){ // defined by conversation auto-builder for "perspectives_of_a_patch_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "perspectives_of_a_patch_1")){
			return true;
	}
	return false;
}

function conversation_run_perspectives_of_a_patch_2(pc, msg, replay){ // defined by conversation auto-builder for "perspectives_of_a_patch_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "perspectives_of_a_patch_2";
	var conversation_title = "Perspectives of a Patch";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['perspectives_of_a_patch_2-0-2'] = {txt: "Hey!", value: 'perspectives_of_a_patch_2-0-2'};
		this.conversation_start(pc, "Oh! Is you! Hullo!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_2', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_2-0-2"){
		choices['1']['perspectives_of_a_patch_2-1-2'] = {txt: "Tell me.", value: 'perspectives_of_a_patch_2-1-2'};
		this.conversation_reply(pc, msg, "I wants to tells you sumfin: You wants to hear my sumfin?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_2', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_2-1-2"){
		choices['2']['perspectives_of_a_patch_2-2-2'] = {txt: "Things like…?", value: 'perspectives_of_a_patch_2-2-2'};
		this.conversation_reply(pc, msg, "During that bit there woz only Mabbites, they dugged into patches, as deep as they woz tall, and then stand in the hole. For days. Soakin’ up ver patchiness of the patch. Some did become one wiv their patch. Somethems still in here, finking ancient Mabbite fings.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_2', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_2-2-2"){
		choices['3']['perspectives_of_a_patch_2-3-2'] = {txt: "And what happens if you do?", value: 'perspectives_of_a_patch_2-3-2'};
		this.conversation_reply(pc, msg, "Deep fings. Deep fings and worms. And what happens if you jus’ keep diggin’ down.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_2', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_2-3-2"){
		choices['4']['perspectives_of_a_patch_2-4-2'] = {txt: "I'll be back.", value: 'perspectives_of_a_patch_2-4-2'};
		this.conversation_reply(pc, msg, "Not this time. I tell you ‘nuvver time.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_2', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_2-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_perspectives_of_a_patch_3(pc){ // defined by conversation auto-builder for "perspectives_of_a_patch_3"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "perspectives_of_a_patch_2")){
			return true;
	}
	return false;
}

function conversation_run_perspectives_of_a_patch_3(pc, msg, replay){ // defined by conversation auto-builder for "perspectives_of_a_patch_3"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "perspectives_of_a_patch_3";
	var conversation_title = "Perspectives of a Patch";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	if (!msg.choice){
		choices['0']['perspectives_of_a_patch_3-0-2'] = {txt: "How nice. Well I likes – like – you too.", value: 'perspectives_of_a_patch_3-0-2'};
		this.conversation_start(pc, "Hey! I ‘member you! I likes you!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_3', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_3-0-2"){
		choices['1']['perspectives_of_a_patch_3-1-2'] = {txt: "About the Mabbites?", value: 'perspectives_of_a_patch_3-1-2'};
		this.conversation_reply(pc, msg, "I was going to tells you this thing, wasnni? But I has forgot what it is-was.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_3', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_3-1-2"){
		choices['2']['perspectives_of_a_patch_3-2-2'] = {txt: "And did any of them ever try?", value: 'perspectives_of_a_patch_3-2-2'};
		this.conversation_reply(pc, msg, "Ohhhhhh yesses. The Mabbites they used to stand in their holes, holes dugged out of patches, and they used to be thinking very deeply about deep deep down and what mightbe happen if they did carry on be diggin’.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_3', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_3-2-2"){
		choices['3']['perspectives_of_a_patch_3-3-2'] = {txt: "But what if they DID dig all the way through?", value: 'perspectives_of_a_patch_3-3-2'};
		this.conversation_reply(pc, msg, "Mabbite? No. But they certainly thunked about it very thoroughlike.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_3', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_3-3-2"){
		choices['4']['perspectives_of_a_patch_3-4-2'] = {txt: "What could be worse?", value: 'perspectives_of_a_patch_3-4-2'};
		this.conversation_reply(pc, msg, "They’d fall out of the world. Out of the prettyworld and onto the giantrock. And then they’d get squishimicated by Giantfeets. Or worse. There is worser.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_3', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_3-4-2"){
		choices['5']['perspectives_of_a_patch_3-5-2'] = {txt: "You mean they knew i… oh, never mind.", value: 'perspectives_of_a_patch_3-5-2'};
		this.conversation_reply(pc, msg, "I cannot say. But the Mabbites knewed it.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_3', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_3-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_perspectives_of_a_patch_4(pc){ // defined by conversation auto-builder for "perspectives_of_a_patch_4"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "perspectives_of_a_patch_3")){
			return true;
	}
	return false;
}

function conversation_run_perspectives_of_a_patch_4(pc, msg, replay){ // defined by conversation auto-builder for "perspectives_of_a_patch_4"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "perspectives_of_a_patch_4";
	var conversation_title = "Perspectives of a Patch";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['perspectives_of_a_patch_4-0-2'] = {txt: "Hola, Patch.", value: 'perspectives_of_a_patch_4-0-2'};
		this.conversation_start(pc, "Hullo! I likes you!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_4', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_4-0-2"){
		choices['1']['perspectives_of_a_patch_4-1-2'] = {txt: "Yes?", value: 'perspectives_of_a_patch_4-1-2'};
		this.conversation_reply(pc, msg, "I is here, yus? You can see I is here, yus?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_4', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_4-1-2"){
		choices['2']['perspectives_of_a_patch_4-2-2'] = {txt: "Yes. I would imagine so.", value: 'perspectives_of_a_patch_4-2-2'};
		this.conversation_reply(pc, msg, "And when you are not on this street, I am still here? An’ even if a tree is planted in me, I is still here, isn’t I? I still ‘zist, don’t I?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_4', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_4-2-2"){
		choices['3']['perspectives_of_a_patch_4-3-2'] = {txt: "I’m not sur…", value: 'perspectives_of_a_patch_4-3-2'};
		this.conversation_reply(pc, msg, "You have to ‘member I exist, though, right? Because if someone forgets I exist, then maybe I don’t exist anymore. ", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_4', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_4-3-2"){
		choices['4']['perspectives_of_a_patch_4-4-2'] = {txt: "I’m not sure that’s how it works.", value: 'perspectives_of_a_patch_4-4-2'};
		this.conversation_reply(pc, msg, "If things that exist when someone thinks them up? If someone forgets to think that they exist, they don’t exist anymore, issit?", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_4', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_4-4-2"){
		choices['5']['perspectives_of_a_patch_4-5-2'] = {txt: "I promise.", value: 'perspectives_of_a_patch_4-5-2'};
		this.conversation_reply(pc, msg, "That’s what happened to the Mabbites. Everyone stopped remembering they existed, and that was the end of them. You promise not to forget I ‘zist please.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_4', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_4-5-2"){
		choices['6']['perspectives_of_a_patch_4-6-2'] = {txt: "Remember that.", value: 'perspectives_of_a_patch_4-6-2'};
		this.conversation_reply(pc, msg, "I likes you.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'perspectives_of_a_patch_4', msg.choice);
	}

	if (msg.choice == "perspectives_of_a_patch_4-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"creator_of_the_universe_3",
	"perspectives_of_a_patch_1",
	"perspectives_of_a_patch_2",
	"perspectives_of_a_patch_3",
	"perspectives_of_a_patch_4",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "You can tend this with a <a href=\"\/items\/95\/\" glitch=\"item|hoe\">Hoe<\/a>, dig it with a <a href=\"\/items\/627\/\" glitch=\"item|shovel\">Shovel<\/a> or plant a <a href=\"\/items\/261\/\" glitch=\"item|bean_seasoner\">Seasoned Bean<\/a> in it."]);
	return out;
}

var tags = [
	"no_trade",
	"natural-resources"
];

var responses = {
	"clear_bean_tree": [
		"Bean there - done now. A ha ha h...",
		"Toodle pip, old Bean, eh? Heh heh *croak*...",
		"Die, my dear? Why, that's the last thing I'll d…",
		"Phew. I'm so tired of being the funniest person in the yard…",
		"Dying is easy. Comedy is hard.",
	],
	"clear_bubble_tree": [
		"I have not told half of what I saw…",
		"I knew they'd get me in the end.",
		"Sigh. I'm so bored with it all, anyw...",
		"Don't disturb my circles!",
		"The struggle will continue! Onward, comr…",
	],
	"clear_egg_plant": [
		"Egg tu, Brute? Egg TU?",
		"Meh. Last words are for fools who haven't said enough.",
		"Bah! You couldn't hit an elephant at this dist...",
		"Ah. La petit mort. Au revoir, mon cherie.",
		"Acta est fabula, plaudite!",
	],
	"clear_fruit_tree": [
		"URK!",
		"Wait, I've just thought of someth....",
		"ARRRRGGGGHHHH…",
		"BUUUUURP. Excuse m…",
		"Ngngngngngng-ftang.",
	],
	"clear_gas_plant": [
		"Ahhh: beautiful day. Beautiful.",
		"Why not? Yeah.",
		"Yeah… better to burn out than fade away…",
		"Such a beautiful day to die, man.",
		"It's been a gas, friend. See you in the ne…",
	],
	"clear_spice_plant": [
		"Nonsense! I've never felt bett...eugh.",
		"Well, I've had a happy life. Also, spicy!",
		"Drink to me!…",
		"I never should have switched from scotch to martinis…",
		"Oh you young people act like old men. You have no fun…",
	],
	"dig_loam_drop": [
		"OOOOH. This dig is better dugged than otherdiggins.",
		"You should so much take this. Is BEST diggins.",
		"AW! I am think this is best thing EVER! But I am hole.",
		"Cans you dig it? O look, you can.",
		"In thinkings of humble hole, you did win today.",
	],
	"dig_na_sa1_sa5": [
		"Is dugged! Here! Earths!",
		"O looks! You dugged me. An' I mades this.",
		"O what is this you did dug? It done be stuff, yeah?",
		"I is pull this out of that hole you dugged.",
		"Please be patient. I am newthing. Thanky for digs!",
		"Look! Earths and stuffs! Dugged it you did!",
	],
	"tend_drop": [
		"Buuuuuuuuuuuuuuurp! TA DA!",
		"Cough COUGH! Oh! Erm, you can have that.",
		"A.... A-CHOOO!",
		"Hic! Oh wow, that's been stuck there for eons.",
		"Tend and ye shall find... um... this?",
	],
	"tend_failed": [
		"Nein, danke. Reholster that hoe, young'un.",
		"That hoe's not coming near me. Hoe no no no.",
	],
	"tend_na_sa1_sa5": [
		"So fresh! So clean! So ready for a bean! OMG that rhymes!",
		"Ah, cleansed. Now plant me up, I say, PLANT ME UP!",
		"Much better. And much better for gardening, non?",
		"Nice and tidy. And superfertile. Got any beans?",
		"Great. Now: tended patches need beans. You dig?",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-51,"y":-29,"w":104,"h":29},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEJElEQVR42u2VS0xiZxTHSVoB20yG\nUdAZZRQEi0VweD99gDxEQKUqWEDlJQ95KA7CWMbRGWfsYzJN02VXXbUxmcRNky677rJJ000X3U\/S\nZbv+9zt3MtNF28WkaZM295+c3Mvlu+f7fed1BQJevHjx4sWLFy9e\/zG9ppEKrpBpBQLhv7qzXCDo\n1UjfGCILuYc0Sol4dPSqWKlXSma9U\/K9af1QxzV54y5dDar+7EifKKCQ9RgIlsD\/ESjlgGBQNSjU\n6RWS7LxJ8bXfMvbTgn0ciYgWIXbdXXXhZCeKVsrD7q2ovGPFzpIJxbgZtXUbShuGb53a6\/UZ7bAv\nYFUY7MqBQTro3wZTSAQSlUykHukX+0J21ZcrMxMgMLJuKYRW1YGH5SAeN1Zwvx5HOx\/GWTOCu7UF\n7KccuJ104aziR7fuZuA2vOvXY8On+znp13+X9OkuE17tud80uurRytSUkYkrgv5Xitpb13ttN\/tE\nCwt25UUqoEc5ZsNxYR7vHy7huBjGk5M9nLeLeNCI416rhOzaHLoFD+4XfXhQCbO1fhzlPegeOHFS\n8LLDBLi1B9kISjE78ssmbC\/eQi5i\/JFBf+GzjLCy6HOND4jGnpcRVxa\/iwpaMyhWaqQijUL6usei\nkTbDDvU3mUUDjnMePD5YxlkjgOPmIu5sTaOT9aOVnkUn48NOfJ7dz3AQj3ZDOG8m0MkvIhtfQLfr\nYO\/PPYesRvGoU0QzE0Yr70Zj3Y7ympkDXfdOYitk+CxkVW5SYNSyHiOBvoQb7xe+PSoVe4ckouWg\nVXlBLxSiJjSTDrTKdtQ3bDjdjeDJaQWdQpRtOI9PDmI4r4Rwyu7PWNoJ4uO7RXz6QRen7Sq2Ilac\ndgqobS7iMONEp+LkUt\/IOFBl\/oqrJhwUbdhNm0CpTwWm9sdkvWtjMvE0BYtrLCpYVV\/vTaVMPEtw\n8n7hasSp\/iofNaK4bGbOrGiWrNhPMND0HAox2sSNbmYW7a15HBXC+Gg\/xlIaQjvtZulfxF4uhvy6\nH8etCmqpII62Z9AtT6OatDCfJuwxX+SvnrTizqEdxZj56cq0Jkf7E4dmQDj1hxHFgUp7zNQUtNCt\nH74XdakvdrPGZ9Wc6VklZuGAcxEDmhtOziga7+WCOKklcJD2cs+6GS8HSv\/R7yrr7EbcjnbFwXX5\ndugWSitmlh0jyinTrzsx0\/ms\/kaa9lQP9jpeRu6vxNUiFSk7BYWagIeviaIUWY38zU0C9xjlHy65\n1Rf5iOF7Bv5LndVSbc2G8oqFA6IosYP8sBnSX6aD+svNiO4yF9dfJgO6y9ic5mnEpfo8aFUc6ZRX\nE+Sb9qDaf6VO\/rMBTWOHwKnDySkVs\/yaKMy6r0jgZLaJgdt0GHr+wmjtSJ9wkoY6GQ34FwOfjKYG\n\/wHmxYsXL168eP0\/9RsEpbWdBDbUsAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-12\/1291688041-7428.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
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
	"no_trade",
	"natural-resources"
];
itemDef.keys_in_location = {
	"g"	: "dig",
	"e"	: "tend",
	"n"	: "plant",
	"o"	: "remove",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("patch.js LOADED");

// generated ok 2012-11-14 15:36:42 by jupro
