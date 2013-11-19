//#include include/events.js, include/rook.js

var label = "Paper Tree";
var version = "1354747039";
var name_single = "Paper Tree";
var name_plural = "Paper Trees";
var article = "a";
var description = "Turns out that paper DOES grow on trees, as long as the tree in question is this one. The sheety fruit of this practical tree is a prerequisite for all manner of <b>Penpersonship<\/b> skills.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["paper_tree"];
var has_instance_props = true;

var classProps = {
	"max_paper"	: "21"	// defined by paper_tree
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.paper_count = "0";	// defined by paper_tree
	this.instanceProps.wants_watering = "0";	// defined by paper_tree
	this.instanceProps.wants_petting = "0";	// defined by paper_tree
}

var instancePropsDef = {
	paper_count : ["How much paper does it have?"],
	wants_watering : ["0 for the default behavior, 1 to force wants, 2 to force not wants"],
	wants_petting : ["0 for the default behavior, 1 to force wants, 2 to force not wants"],
};

var instancePropsChoices = {
	paper_count : [""],
	wants_watering : [""],
	wants_petting : [""],
};

var verbs = {};

verbs.unrook = { // defined by paper_tree
	"name"				: "unrook",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 11,
	"tooltip"			: "ADMIN ONLY",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god && this.isRooked()) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.unRook();
		return true;
	}
};

verbs.rook_attack = { // defined by paper_tree
	"name"				: "rook_attack",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 12,
	"tooltip"			: "ADMIN ONLY",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.adminRook(pc);
		return true;
	}
};

verbs.apply_balm = { // defined by paper_tree
	"name"				: "apply balm to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Revive this tree with some Rook Balm",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Apply Rook Balm",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'potion_rook_balm' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) {
			function is_balm(it){ return it.class_tsid == 'potion_rook_balm' ? true : false; }
			var balm = pc.findFirst(is_balm);
			if (balm) {
				return {state:'enabled'};
			}
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		function is_balm(it){ return it.class_tsid == 'potion_rook_balm' ? true : false; }
		var balm = pc.findFirst(is_balm);

		if (!balm){
			return false;
		}

		msg.target = this;

		return balm.verbs['pour'].handler.call(balm, pc, msg);
	}
};

verbs.trantsform = { // defined by paper_tree
	"name"				: "trantsform",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		function has_potion(it){ return it.class_tsid == 'potion_trantsformation_fluid' ? true : false; }
		var potion = pc.findFirst(has_potion);
		if (potion) {
			return {state: 'disabled', reason:'You can\'t trantsform a Paper Tree.'};
		}

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


		var pre_msg = this.buildVerbMessage(msg.count, 'trantsform', 'trantsformed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.revive = { // defined by paper_tree
	"name"				: "revive",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Help this $itemclass escape the effects of The Rook. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) {
			if (this.playerIsHealer(pc)) {
				return {state: 'disabled', reason: "You have already helped revive this "+this.name_single+". Now others need to help!"};
			} else if (!this.canRevive(pc)) {
				return {state: 'disabled', reason: "Enough people are already helping to revive this "+this.name_single+"."};
			} else {
				return {state:'enabled'};
			}
		}

		return {state:null};
	},
	"effects"			: function(pc){

		return this.getReviveEffects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.startRevive(pc);

		var pre_msg = this.buildVerbMessage(msg.count, 'revive', 'revived', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.harvest = { // defined by paper_tree
	"name"				: "harvest",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Collect some paper",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) return {state:null};

		if (this.getInstanceProp('paper_count') == 0){
			return {state:'disabled', reason: "There's nothing to pick, cowboy!"};
		}

		if (!this.canHarvest(pc)){
			return {state:'disabled', reason: "You can only harvest from this tree once per game day."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var to_get = 5;

		if (pc.imagination_has_upgrade('gardening_harvest_paper')){
			to_get = 8;
		}

		var duration = 2500;

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
		pc.apiSendAnnouncement({
			type: 'itemstack_overlay',
			'swf_url': pc.overlay_key_to_url('trant_harvest'),
			word_progress: config.word_progress_map['harvest'],
			duration: duration + 100,
			itemstack_tsid: this.tsid,
			locking: true,
			dismissible: false,
			delta_x: delta_x,
			delta_y: 20,
			uid: pc.tsid+'_harvesting_self'
		});

		pc.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			'swf_url': pc.overlay_key_to_url('trant_harvest'),
			duration: duration + 100,
			pc_tsid: pc.tsid,
			delta_x: 0,
			delta_y: -110,
			bubble: true,
			width: 40,
			height: 40,
			uid: pc.tsid+'_harvesting_all'
		}, pc);

		// Set timers
		for (var i=1; i<=to_get; i++){
			this.events_add({callback: 'givePaper', pc: pc}, i);
		}

		this.events_add({callback: 'endHarvest', pc: pc}, duration/1000);

		var today = current_day_key();
		this.intervals[today][pc.tsid]++;

		this.apiSetTimer('cleanupPlayerIntervals', 4*60*60*1000);

		return true;
	}
};

verbs.water = { // defined by paper_tree
	"name"				: "water",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Give water",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Water this {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return (stack.class_tsid == 'watering_can' || stack.class_tsid == 'irrigator_9000') ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) return {state:null};

		// Find a watering_can
		function is_watering_can(it){ return (it.class_tsid == 'watering_can' || it.class_tsid == 'irrigator_9000') && it.isWorking() ? true : false; }
		var watering_can = pc.findFirst(is_watering_can);

		if (!watering_can){
			return {state:'disabled', reason: "You need a working watering can."}; 
		}

		if (!this.wantsWatering()){ return {state:'disabled', reason: "I don't want to be watered!"}; }
		else{ return {state:'enabled'}; }
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.performTending(msg, 'water', pc);
		return true;
	}
};

verbs.pet = { // defined by paper_tree
	"name"				: "pet",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Give love",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) return {state:null};
		if (!this.wantsPetting()){ return {state:'disabled', reason: "I don't want to be petted!"}; }
		else{ return {state:'enabled'}; }
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.performTending(msg, 'pet', pc);

		return true;
	}
};

verbs.name = { // defined by paper_tree
	"name"				: "name",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Give this tree a name",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var args = {
			input_label: 'My new name:',
			cancelable: true,
			input_focus: true,
			input_max_chars: 32,
			input_restrict: 'A-Z a-z 0-9',

			itemstack_tsid: this.tsid,
		        follow:true
		};

		if (this.user_name) args.input_value = this.user_name;

		this.askPlayer(pc, 'name', 'Name Me!', args);
		return true;
	}
};

function addPaper(){ // defined by paper_tree
	this.setInstanceProp('paper_count', intval(this.getInstanceProp('paper_count'))+1);
	if (this.getInstanceProp('paper_count') > this.getClassProp('max_paper')) this.getInstanceProp('paper_count') = intval(this.getClassProp('max_paper'));

	this.broadcastConfig();
}

function canHarvest(pc){ // defined by paper_tree
	var today = current_day_key();
	if (!this.intervals) this.intervals = {};
	if (!this.intervals[today]) this.intervals[today] = {};

	if ( !this.intervals[today][pc.tsid]){
		this.intervals[today][pc.tsid] = 0;
	}
		
	//
	// Now check the limit
	//
		
	if (this.intervals[today][pc.tsid] >= 1){
		return false;
	}

	return true;
}

function cleanupPlayerIntervals(details){ // defined by paper_tree
	//
	// will remove old player intervals that are not today
	//

	var today = current_day_key();
	for (var i in this.intervals){
		if (i != today) delete this.intervals[i];
	}
}

function endHarvest(details){ // defined by paper_tree
	var pc = details.pc;

	var failed = 0;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	pc.quests_inc_counter('trant_harvest_paper_tree', 1);

	this.sendResponse('harvest', pc);
	this.broadcastStatus();

	pc.feats_reset_commit();

	var pre_msg = this.buildVerbMessage(1, 'harvest', 'harvested', failed, self_msgs, self_effects, they_effects);
	if (pre_msg) pc.sendActivity(pre_msg);
}

function getLabel(){ // defined by paper_tree
	if (this.user_name){
		return this.user_name;
	}

	return this.label;
}

function givePaper(details){ // defined by paper_tree
	var actual = this.removePaper(1);
	if (actual){
		details.pc.announce_sound('PAPER_TREE');
		details.pc.createItemFromSource('paper', 1, this);
	}
}

function make_config(){ // defined by paper_tree
	return {
		needs_water: this.wantsWatering(),
		needs_pet: this.wantsPetting(),
		paper_count: intval(this.getInstanceProp('paper_count'))
	};
}

function onContainerChanged(oldContainer, newContainer){ // defined by paper_tree
	if (!oldContainer) this.broadcastStatus();
}

function onCreate(){ // defined by paper_tree
	this.initInstanceProps();
	this.setInstanceProp('paper_count', intval(this.getClassProp('max_paper')));
	this.been_petted = false;
	this.been_watered = false;

	this.broadcastStatus();
}

function onInputBoxResponse(pc, uid, value){ // defined by paper_tree
	value = value.substr(0, 32).replace(/[^a-z0-9 ]/gi,'');

	if (uid == 'name' && value){
		this.user_name = value;
	}
}

function onLoad(){ // defined by paper_tree
	if (this.been_watered && this.been_petted && !this.apiTimerExists('onNeedsReset')){
		this.onNeedsReset();
	}
}

function onNeedsReset(){ // defined by paper_tree
	this.been_petted = false;
	this.been_watered = false;

	this.broadcastStatus();
}

function onOverlayDismissed(pc, payload){ // defined by paper_tree
	if(this.isRooked()) {
		this.doReviveCancel(pc);
	}
}

function onPropsChanged(){ // defined by paper_tree
	if (intval(this.getInstanceProp('paper_count')) > intval(this.getClassProp('max_paper'))){
		this.setInstanceProp('paper_count', intval(this.getClassProp('max_paper')));
	}
	this.broadcastConfig();
}

function onPrototypeChanged(){ // defined by paper_tree
	this.onLoad();
}

function onStatus(pc){ // defined by paper_tree
	var status = {
		verb_states: {},
	};

	status.verb_states['water'] = {
		enabled: (!this.wantsWatering()) ? false : true,
		disabled_reason: (!this.wantsWatering()) ? "I don't want to be watered." : "",
		warning: false
	};

	status.verb_states['pet'] = {
		enabled: (!this.wantsPetting()) ? false : true,
		disabled_reason: (!this.wantsPetting()) ? "I don't want to be petted." : "",
		warning: false
	};

	return status;
}

function onTendComplete(pc, ret){ // defined by paper_tree
	if (ret['ok']){

		var verb = '';
		if (ret.args.type == 'water'){
			this.sendResponse('water', pc);
			this.been_watered = true;
			verb = 'watered';

			pc.achievements_increment('trants_watered', this.class_tsid);
			pc.quests_inc_counter('trees_watered', 1);
		}
		else{
			this.sendResponse('pet', pc);
			this.been_petted = true;
			verb = 'petted';
		}
		
		var self_effects = [];
		if (ret.details['xp_bonus'] > 0){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "imagination",
				"value"	: ret.details['xp_bonus'] ? ret.details['xp_bonus'] : 0
			});
		}
		
		var msg = this.buildVerbMessage(ret.count, ret.args['type'], verb, false, [], self_effects, []);
		pc.sendActivity(msg);

		if (this.been_watered && this.been_petted){
			this.apiSetTimer('onNeedsReset', 6*60*1000);

			pc.quests_inc_counter('heal_trant', 1);

			this.events_add({callback: 'addPaper'}, 0.5);
			for (var i=1; i<9; i++){
				this.events_add({callback: 'addPaper'}, 2*i);
			}
		}

		this.broadcastStatus();

		pc.feats_increment_for_commit(1);
	}
	else{
		var rsp = 'Oops. You failed! You probably need a bit more skill to stop that from happening.';
		pc.sendActivity(rsp);
	}
}

function performTending(msg, type, pc){ // defined by paper_tree
	var package_name = 'paper_tree_'+type;

	var args = {
		type: type,
		callback: 'onTendComplete',
		msg: msg
	};

	if (type == 'pet'){
		args.overlay_id = 'trant_pet';
		args.word_progress = config.word_progress_map['pet'];
	}
	else{
		// Find a watering_can
		if (msg.target_itemstack_tsid){
			var watering_can = pc.getAllContents()[msg.target_itemstack_tsid];
		}
		else{
			function is_watering_can(it){ return it.class_tsid == 'irrigator_9000' && it.isWorking() ? true : false; }
			var watering_can = pc.findFirst(is_watering_can);
			if (!watering_can){
				function is_watering_can(it){ return it.class_tsid == 'watering_can' && it.isWorking() ? true : false; }
				watering_can = pc.findFirst(is_watering_can);
			}
		}

		if (!watering_can){
			pc.sendActivity("That's going to be tough without a watering can :(");
			return false;
		}
		
		args.tool_item = watering_can;
		args.word_progress = config.word_progress_map['water'];
	}

	pc.runSkillPackage(package_name, this, args);

	return true;
}

function removePaper(amount){ // defined by paper_tree
	this.setInstanceProp('paper_count', this.getInstanceProp('paper_count') - amount);
	if (this.getInstanceProp('paper_count') < 0) {
		amount += this.getInstanceProp('paper_count');
		this.setInstanceProp('paper_count', 0);
	}
	this.broadcastConfig();

	return amount;
}

function wantsHarvesting(){ // defined by paper_tree
	if (this.isRooked()) return false;
	return this.getInstanceProp('paper_count') > 0 ? true : false;
}

function wantsPetting(){ // defined by paper_tree
	if (this.isRooked()) return false;
	if (this.getInstanceProp('wants_petting') == 1) return true;
	if (this.getInstanceProp('wants_petting') == 2) return false;
	return this.been_petted ? false : true;
}

function wantsWatering(){ // defined by paper_tree
	if (this.isRooked()) return false;
	if (this.getInstanceProp('wants_watering') == 1) return true;
	if (this.getInstanceProp('wants_watering') == 2) return false;
	return this.been_watered ? false : true;
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Harvesting this will yield <a href=\"\/items\/601\/\" glitch=\"item|paper\">Paper<\/a>."]);
	return out;
}

var tags = [
	"paper",
	"trant",
	"no_trade",
	"natural-resources"
];

var responses = {
	"harvest": [
		"Take these sheets away.<br>Do with them as you want to.<br>I cannot use them.",
		"You want some paper? <br>Take it then, it's yours to use.<br>Just don't waste it. Thanks.",
		"Giving you paper. <br>I hope that's what you wanted. <br>It's all you're getting.",
		"Only a few pieces <br>of paper, I will give you. <br>You expected more?",
		"Here you are: paper!<br>You harvest a paper tree… <br>What do you expect?",
		"Covered in white stuff. <br>I look like I've been TPed <br>But no, it's my fruit.",
		"Your perfect harvest. <br>Each branch shaken, and at last…<br>A few clean leaves fall.",
		"My leaves bow to you<br>My branches offer bounty<br>And now a leaf falls.",
		"You stretch to harvest <br>Pinching, pulling until paf! <br>A single leaf falls.",
		"Listen, here's a secret:<br>These aren't just leaves, they're paper!<br>For writing and stuff.",
		"Here, kid, is paper<br>Used for reading, writing, planes, or<br>Decorating walls.",
	],
	"pet": [
		"Hugging trees tightly<br>a trickle of energy<br>yes, I like that. thanks",
		"Your action suggests<br>you haven't been at this long<br>but you're still not bad.",
		"I am Paper Tree<br>I think I might be useful<br>But for what? No clue.",
		"Paper trees are good<br>at making crinkling noises<br>when you hug their trunks.",
		"I am paper tree<br>I like it when you hug me hard<br>but so soon you leave.",
		"This petting pleases.<br>Are you a tree whisperer?<br>(If that is a thing…)",
		"This kind attention<br>Helps paper tree to grow big<br>We hope you feel proud.",
		"Such polished petting! <br>That you took the time for this <br>Makes Paper Tree smile.",
		"I like your petting <br>You know how to please a tree. <br>Not in a weird way.",
		"Didn't see you there<br>With your soft and kindly hands. <br>You can stop now, though.",
	],
	"water": [
		"That one watering<br>Can… have such stunning effect?<br>Hail, tiny raincloud.",
		"Even a trickle<br>From the right kind of can<br>Brings life to paper.",
		"Careful where you aim.<br>I don't want to turn into<br>Papier-mâché.",
		"Ahh, this welcome rain. <br>It falls upon my branches. <br>And makes me go \"Squeee!\"",
		"It's very nice, thanks <br>That you have taken the time. <br>To sprinkle on me.",
		"You made my roots wet. <br>It's not that I'm complaining <br>I'm just a bit damp.",
		"All this way you came. <br>To seek me out and sprinkle. <br>I think that you're nice.",
		"Watering paper?<br>Nice, thanks, but watch out there or<br>You'll make me soggy.",
		"The gentle patter<br>Of sprinkled Glitchy water<br>Brings joy to my roots.",
		"It's enjoyable,<br>But watch I don't turn into<br>Papier Mache.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-119,"y":-217,"w":232,"h":217},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAKLElEQVR42uVYi1NTVxrv7szOdjq7\nZbvTbq0KCQmGWoSACYkkIQESwjsREXwgRHwO6k7WdtnOznS9daa729Xi3XbcVlvsdUtbBcWrIMrD\ncOWRQCBwecqbq\/gYO93p3f\/g7PfdNhQVK51OrTN7Z87kBu6553e+7\/f7fd\/JU0\/9P159fR5ZX0+z\nM\/h9eryT\/mo6EHJnpk\/2oy9+a8avvjHZQw3yHNPOsdTHHx6x3APO36D2NFSL3tYLYktLjfrmZLdl\nmL9Kpse6SF93M5ka7eTrL1RywecROD4D\/2cWBeDaYJvlu3baxrHs2HA7wUVH+q\/yx99+O2T+\/wd4\nzjV5zUeuXD5NejovM8PwHYEhwIkRLxno9ZAhnqMQ2N3ZQebGVA8ZH+4gN6a63Y8E13H1PN3SWE0G\nAh5+QfADre6hvhYyOthGJoY7xIdthHw1HTI52sl4GquIr62O7fZdJoGuBjI21C5gBjDKo0Pt4ux0\ngAz1cWR2ppdbVPTOVn1ILtVWYhoQxAMhRy5hdDAis5M9TlzsYe\/KX2ty+1ovkGaIJGSF1Jw+xhgM\n4bJAoDlkZqxTvHOjnyDAQdgw72+mFwUQUsZ0tteJfHcT7LaNTI35hGvXvDJNvi1EoVGETI93cQjQ\n771ErjRW87gRTFmg87I43H\/1niiodCp1YYmTtHHnSVvLOadN81yIQS9nPY3VLKSdXJ\/slga8k\/g7\nLrq+lxAwdbAzAOMlwoSf37J\/K6daE+UKdDVyPEQPedp4uYr2+y5JERjpb8VFeIzQ\/Pco9FH038sP\n0OsML8lUupep\/MJMsb72U9LRWittDAJCev1NBDZtEcb9dFd7ndvrqX+QNgKoEnbGw45E3BWS2e+t\n5656WPpyw2nm0HtvCrEJkcLhd96QXo4RDc498PbrztraT7m6cxUkyvDKA7TITVxuyUlYLindsTGd\n0TqMdFS2SX335oAb14M082hLg8DFs6ePE6ainF3Yu7qbLDjwfnKsy8n3eChvax1V5C4Sk4uziT7X\nLFjzrFzDxc+JJi9lDkhCcYZbm58ilpbtECOTNA8ocaM5jNJgejdnyqxr5C7t+uQ5f2yoO63u9jW4\nRwZauZlxP\/D1FCk\/9IbwcI8TAq7rE34BVdoFPLt4oZKc+LCc3V+6ybIlNdK9PSvGtbt0Ex9r1xOT\nLlytAV4G52ZAlJBnUmoTYtwqU5wkoM1JYRLo+IIUXpupo4y2GDrIUfyEbDFAI9Lf0wxpvyIsKDy0\nhTvXeR69Cv0NLAA5RXqAY6cqj3Kvv75LWjg+Odqiz9LzMaYo0RwfyiTo5dLixuJ0V4J1lTsnUU7H\nb0ilY7KNZGWKRkpVji1SipjBrhYsJqWIG9OmxnGRpmjxk1Mf0JJQxjrpGRDjglGbBtnPTvfSo6Ba\nEAFB47w7O0DOVX8kEbnLW++c\/3yEfiUXq4\/gdhaniZuSZBII5KTOHsebAQR+N22xq3MyY52RyVqn\nNUfLqpK\/jmZxqlyihsEQwa7OTRL\/\/FaZyLIn6YC\/kUfeT4\/7+esT3QykmT1XfYIDz\/02mujs6HMd\nYAsoBF9bLUHi3r+h+Hi5pdtXz11pqCJ17L\/JhbMVc6AyU1SU9MymVEtCntkdY9W40uyr5kzfZZNL\n79uQHaVOyokXo+w6RmmIlgKA\/oglD7JHQSmkgnqYu7zeehnXVM22es5xV6+c5ZGHY1CCFor6F7cG\n6YmRDtJ48TPS0VJDCkAI+Pcd6Qpq\/nNbkuTuXGPonD8WJstJsU3uXJ8YRv\/gpiBYxPFzIc7evs6L\n1aeOEbAnbkuKnM\/VLVNDhO4x6102RUi+WcZngg8GAebNAxy8xofa1RgxqNFuUDIVaK4O+d6A7zdh\niCJX9dkHYLQNXGmO3AKL80UpcvH+eVttcirHEOqUwCaGEX1ytDM8bqUs2Blhd9Mf8AClLpLKk\/9k\n33\/\/b5bmRwHEiejuWDH2UL9nU1zZrNYYycUnyOd4gZ3IuTMVZGywTUrXniwlU2CWEUPcS\/dspOSb\nlAJ4eq0hlNFtsLLmAjt1qfZTeuqaT0QP7O1qEkcHWh9d7qbGutyYOmx\/0JtQ0e0gmlNVx4l5nYXE\n68P5dN0yF9rL8aMHBag25HwNQwfTWZqtFB1rllP3R9BpCBVhEJ1dwxg226i0PLsQnaJlFfN8FIsD\n1GWWazrDY5ofqL0AisO6ip0H1lb0J2waqs5UCJm71lPxiSrGmGt02TNjmfTUV0jZm\/sI1uXS17YK\nmgKrtPv965XOvWtXkJKMbyO9NVVOg4hIqma525ixms43hbnRCx2F2eLHHx12YjnFvhIshur1N3LQ\ndIidHRfpo++89W0mxLsjzi9vj1D\/uTPMofch0D5\/I\/GC3Rw7Ua7GnUIn4tTlJbExWUYpYusKU+hX\nD+wjWruWV9g0c5HYZpcLpY4IHlO9M13ObLWFkzTtMkkYJVa5Kz1JRZkcej7WHE1HmmPdQX5\/\/skR\nGgsE+vHUqE9qcBdM893bg04wZ6bVU4OdL1t2cL9lbYmTN65Rulabo\/gcx2raYVYwBpOCijYoJX69\nmh\/5PqYY5\/+pQMXuyFCSdSYZ2ZwkJ8A7YtMudYLSKbhnsS6jZ2JtDq5p1Mld\/yh\/k3v32CG3p\/EM\nDU2uyF2pIU2XTvEL2ssM9H3Ivzr2JGmDpjNjm4PeUJrPHz1RTpKdBiHKqHLdxzN6e1q4uNYQRm1L\nk6MgSJH1a3COhFCSZ5IJjoTlc97314P73MyJdyk4ElA1lTRz5OAe50LBeqiakZOnwUKgxSdtnmr2\n1X0b1Ni8Vn\/+L6IxKBc83CD\/\/rBOJWxMkhEXgJNAwihMlkE0w4SyTS+\/Vlqk2Wx16JhoLUR+Wz7v\n76gXeGgSUJC3BJ5Gf13csRFME+SPKcaOFzqMXuGLm4MEXkbN72Duv4JK3mABkDYZgbQSx5pQ5ruK\nAfaEKEw8RtyYCizubNLWUmuBNBM8vQEfSFP9Z5L1jI14nY+am2sMc61PlJHdmQpSAEAT45ZYvuv5\nbt8l7AUFOGRRiz43T413uiRAoKqKY4fFCiCvr71OWMxcbO+hyyF7cpRkszWcmOKWqX+UA\/oXt4bU\nX94eovoDTWzlyfcYAUx8sXN3ZoST3VkKEEkYeSJ\/+tgBii4rUJGNyfInE+DuzHC+GJTshAj+aCn+\nIVdZQSQpSQ0n2zOVZFOq3PJEgUOr2Z2tJBjB7emKR6r4sV97s5Suvc4VZFuaguxxRJDiNIX7yQKY\no+T2ArA\/Qpqx3Nm1S6knBtxfil62QPNAEGBpTgQpSQsnhVbF7JOA7ZexEb9J2pqm+C\/2fnkA0p27\nApqEMFIE7ZZdu+wMPPMcjJ8\/bmC\/gPG7JS88k2Fa9WJLlm7pRLZ++Verwp9rtca+OLDRAilevexm\nPpS8lWHPIhdXwHj+cQL9GYxn8deOpNglh\/Urnz8E9wV4BMbedelvnzmgVb1wFu5RybEwlsJ4+idN\nNYxnYPwKxq+\/+Xz6p0jtY7v+Byo0A\/b2dNCCAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-05\/paper_tree-1304639233.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
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
	"paper",
	"trant",
	"no_trade",
	"natural-resources"
];
itemDef.keys_in_location = {
	"h"	: "harvest",
	"t"	: "water",
	"y"	: "apply_balm",
	"n"	: "name",
	"e"	: "pet",
	"v"	: "revive",
	"o"	: "rook_attack",
	"c"	: "trantsform",
	"u"	: "unrook"
};
itemDef.keys_in_pack = {};

log.info("paper_tree.js LOADED");

// generated ok 2012-12-05 14:37:19 by ali
