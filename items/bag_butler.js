//#include include/butler_data.js, include/butler_strings.js, include/../../utils.js, include/butler_responses.js, include/butler_hints.js, include/butler_convos.js, include/butler_emotes.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Butler";
var version = "1352488262";
var name_single = "Butler";
var name_plural = "Butlers";
var article = "a";
var description = "Sewn from scraps of imagination and brought to life with a breath of happy servitude, your personally customized Butler or Butlerina enjoys buttling on your Home Street and can help you with many things. These include: mail, taking messages and packages, handing out gifts, and chatting with you.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["bag_butler", "npc_mailbox", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"near_dist"	: "250",	// defined by bag_butler
	"far_dist"	: "550",	// defined by bag_butler
	"required_click_delay"	: "3000",	// defined by bag_butler
	"capacity"	: "5",	// defined by bag_butler
	"step_away_dist"	: "100",	// defined by bag_butler
	"at_dist"	: "50",	// defined by bag_butler
	"wait_time"	: "15000",	// defined by bag_butler
	"package_limit"	: "5",	// defined by bag_butler
	"message_limit"	: "10",	// defined by bag_butler
	"timeout"	: "600"	// defined by bag_butler
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.variant = "mailboxLeft";	// defined by npc_mailbox
	this.instanceProps.owner_tsid = "";	// defined by bag_butler
	this.instanceProps.accessory = "accessory1";	// defined by bag_butler
	this.instanceProps.bod = "body1";	// defined by bag_butler
	this.instanceProps.skull = "skull1";	// defined by bag_butler
	this.instanceProps.face = "face1";	// defined by bag_butler
	this.instanceProps.closeArm = "1";	// defined by bag_butler
	this.instanceProps.farArm = "1";	// defined by bag_butler
	this.instanceProps.closeLeg = "1";	// defined by bag_butler
	this.instanceProps.farLeg = "1";	// defined by bag_butler
	this.instanceProps.min_look_time = "7000";	// defined by bag_butler
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	variant : ["Facing direction of the mailbox"],
	owner_tsid : ["The player that owns this butler"],
	accessory : [""],
	bod : [""],
	skull : [""],
	face : [""],
	closeArm : [""],
	farArm : [""],
	closeLeg : [""],
	farLeg : [""],
	min_look_time : ["Minimum time to look at a player in milliseconds"],
};

var instancePropsChoices = {
	ai_debug : [""],
	variant : ["mailboxLeft","mailboxRight"],
	owner_tsid : [""],
	accessory : ["1","2","3","4","5","6","7","8","9","10","11","12"],
	bod : ["body1","body2","body3","body4","body5","body6","body7","body8","body9","body10","body11","body12","body13","body14","body15","body16"],
	skull : ["skull1","skull2","skull3","skull4","skull5","skull6","skull7","skull8","skull9","skull10","skull11","skull12","skull13","skull14","skull15","skull16","skull17","skull18","skull19","skull20","skull21","skull22"],
	face : ["face1","face2","face3","face4","face5","face6","face7","face8","face9","face10","face11","face12","face13"],
	closeArm : ["1","2","3","4","5","6","7","8","9","10","11","12"],
	farArm : ["1","2","3","4","5","6","7","8","9","10","11","12"],
	closeLeg : ["1","2","3","4","5","6","7","8","9","10","11","12","13"],
	farLeg : ["1","2","3","4","5","6","7","8","9","10","11"],
	min_look_time : [""],
};

var verbs = {};

verbs.debug = { // defined by npc
	"name"				: "debug",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 10,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.debugging === undefined || this.debugging == false) {
			return "ADMIN ONLY: Turn on debug displays for this NPC.";
		}
		else {
			return "ADMIN ONLY: Turn off debug displays for this NPC.";
		}
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_god) { return {state:'enabled'} };

		// Do not show this for non-devs:
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		 
		if (this.debugging === undefined) {
			this.debugging = true;
		}
		else {
			this.debugging = !(this.debugging);
		}

		this.target_pc = pc;

		if (this.debugging) {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'are debugging', failed, self_msgs, self_effects, they_effects);	
		}
		else {
			var pre_msg = this.buildVerbMessage(msg.count, 'debug', 'stopped debugging', failed, self_msgs, self_effects, they_effects);	
		}

		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.give_cubimal = { // defined by npc
	"name"				: "Give a cubimal to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return 'Give '+this.label+' a cubimal likeness';
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var cubimal = this.hasCubimal();

		if (!cubimal) return {state: null};

		if (pc.getQuestStatus('mini_me_mini_you') != 'todo') return {state: null};

		if (pc.counters_get_label_count('npcs_given_cubimals', cubimal)) return {state:'disabled', reason: "You already gave away a "+this.label+" cubimal"}

		if (!pc.findFirst(cubimal)) return {state:'disabled', reason: "You don't have a cubimal of "+this.label};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var cubimal = this.hasCubimal();
		var stack = null;

		if (!cubimal){
			failed = 1;
		} else {
			stack = pc.findFirst(cubimal);
		}

		var responses = [
		'Pour moi? How kind of you! I feel all fluttery inside!',
		'Oh yes, this is very handsome. Thank you so much!',
		'A passable likeness. Always nice to know that someone is thinking of little old me!',
		'Well what have we here? It\'s a bit... square. But it captures the essence, doesn\'t it?',
		'Cubimals are my favorite! And this one is my favoritest favorite!',
		'I shall carry it with me always, and cherish the memory of your kindness'
		];


		if (stack){
			var item = pc.removeItemStack(stack.path);
			item.apiDelete();
			this.sendBubble(choose_one(responses), 10000, pc);
			pc.counters_increment('npcs_given_cubimals', cubimal);
			pc.quests_inc_counter('npcs_given_cubimals', 1);
		} else {
			failed = 1;
		}


		var pre_msg = this.buildVerbMessage(msg.count, 'Give a cubimal to', 'Gave a cubimal to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.dispense_wisdom = { // defined by bag_butler
	"name"				: "dispense butlerly wisdom",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Ask the Butler to give hints & tips",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.tsid == this.getInstanceProp("owner_tsid") && this.hints_off) { 
			return {state: "enabled"};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.hints_off = false;
	}
};

verbs.muffle_wisdom = { // defined by bag_butler
	"name"				: "muffle butlerly wisdom",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Instruct the Butler to stop giving hints & tips",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.tsid == this.getInstanceProp("owner_tsid") && !this.hints_off) { 
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.hints_off = true;
	}
};

verbs.eavesdrop = { // defined by bag_butler
	"name"				: "Tell me things visitors say",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Ask the Butler to tell you what your visitors are saying",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc != this.getOwner()) {
			return {state:null};
		}


		if (pc == this.getOwner() && this.notifications === undefined || this.notifications === true) { 
			if (this.eavesdropping === false) {
				return {state:'enabled'};
			}
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.eavesdropping = true;

		this.sendBubbleAndChat(pc, this.getTextString("speechNotificationsOn"), true);
	}
};

verbs.stop_eavesdropping = { // defined by bag_butler
	"name"				: "Stop telling me things visitors say",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Ask the Butler to stop telling you what your visitors are saying",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc != this.getOwner()) {
			return {state:null};
		}


		if (pc == this.getOwner() && this.notifications === undefined || this.notifications === true) { 
			if (this.eavesdropping === undefined || this.eavesdropping == true) { 
				return {state:'enabled'};
			}
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.eavesdropping = false;

		this.sendBubbleAndChat(pc, this.getTextString("speechNotificationsOff"), true);
	}
};

verbs.zip_it = { // defined by bag_butler
	"name"				: "zip it!",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Tell the Butler to stop the random chatter",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.tsid == this.getInstanceProp("owner_tsid") && !this.muted) { 
			return {state: "enabled"};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.muted = true;
	}
};

verbs.chatter = { // defined by bag_butler
	"name"				: "chatter",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Allow the Butler to say random things when bored",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.tsid == this.getInstanceProp("owner_tsid") && this.muted) { 
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.muted = false;
	}
};

verbs.notify_about_visitors = { // defined by bag_butler
	"name"				: "Tell me when visitors arrive",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Ask the Butler to IM you when you are away from home and visitors arrive",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc != this.getOwner()) {
			return {state:null};
		}
		if (pc == this.getOwner() && pc.is_god && this.notifications != undefined && !this.notifications) { 
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.logDebugInfo("turning notifications on");

		this.notifications = true;
		this.sendBubbleAndChat(pc, this.getTextString("notificationsOn"), true);

		return true;
	}
};

verbs.stop_notifying_about_visitors = { // defined by bag_butler
	"name"				: "Stop telling me when visitors arrive",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Ask the Butler not to IM you when you are away from home and visitors arrive",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		/*if (pc != this.getOwner()) {
			return {state:null};
		}
		if (pc == this.getOwner() && pc.is_god && (this.notifications == undefined || this.notifications)) { 
			return {state:'enabled'};
		}*/

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.logDebugInfo("turning notifications off");

		this.notifications = false;
		this.sendBubbleAndChat(pc, this.getTextString("notificationsOff"), true);

		return true;
	}
};

verbs.stay = { // defined by bag_butler
	"name"				: "stay away",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 60,
	"tooltip"			: "Tell the Butler to move to the edge of the location and stay put",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		/*if (pc && pc.tsid == this.getInstanceProp("owner_tsid") && !this.stayed) { 
			
			return {state:'enabled'}
		};*/

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.stayed = true;

		this.stateChange("stay_away", "done"); // override whatever the butler was doing

		this.onStayAway();
	}
};

verbs.wander = { // defined by bag_butler
	"name"				: "wander normally",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 61,
	"tooltip"			: "Tell the Butler to move around normally",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		/*if (pc && pc.tsid == this.getInstanceProp("owner_tsid") && this.stayed) { 
			
			return {state:'enabled'}
		};*/

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		delete this.stayed;
		delete this.stayingPut;
	}
};

verbs.set_post = { // defined by bag_butler
	"name"				: "set post",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 62,
	"tooltip"			: "Change the Butler's assigned post to your current position",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.tsid == this.getInstanceProp("owner_tsid")) { 
			
			return {state:'enabled'}
		};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.last_command_time = getTime();


		var convo = this.getTextString("setPostConfirm", pc);

		this.last_command_time = getTime();
		var conversation = [ { txt: convo, choices: [{txt:"Yes, please.", value:"setPostYes"}, {txt:"Never mind.", value:"setPostNo"}] }];

		this.convo_step = 0;

		this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: false}, true);
	}
};

verbs.customize = { // defined by bag_butler
	"name"				: "customize",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 63,
	"tooltip"			: "Change the Butler's appearance",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (pc === this.getOwner()) { 
			return {state:'enabled'};
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.playAnim("idle0", true);
		this.stateChange("attending", "done");

		if (this.reactionAllowed()) {
			this.doClickAnim(randInt(0, 2));
		}

		pc.apiSendMsg({
			type: 'itemstack_config_start',
			itemstack_tsid: this.tsid}
		);
	}
};

verbs.click = { // defined by bag_butler
	"name"				: "click",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 64,
	"tooltip"			: "Click to summon the Butler",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.doClick(pc);

		apiLogAction('BUTLER_CLICK', 'pc='+pc.tsid, 'butler='+this.tsid);

		log.info(this.getLabel()+" tsid is "+this.tsid);
	}
};

verbs.give = { // defined by bag_butler
	"name"				: "give",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 65,
	"tooltip"			: "Leave a gift for your visitors",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.gift_item) { 
			var oldprot = apiFindItemPrototype(this.gift_item["class"]);
			if (oldprot) { 
				var oldName = pluralize(this.gift_item["count"], oldprot.name_single, oldprot.name_plural);
				return this.getTextString("visitorGiftTooltip", pc, pc, null, null, oldName);
			}
		}

		return verb.tooltip;
	},
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Ask the Butler to give this to visitors",
	"drop_ok_code"			: function(stack, pc){

		if (!stack.takeable_pickup) return false;

		var ret = stack.takeable_drop_conditions(pc);
		if (ret.state != 'enabled') return false;

		if (stack.is_bag || stack.is_trophy || stack.has_parent('furniture_base')) return false;

		if (stack.hasTag("no_trade")) return false;

		return true;
	},
	"proximity_override"			: 550,
	"conditions"			: function(pc, drop_stack){

		if (pc == this.getOwner()) {
			if (this.interact_pc) { 
				return {state: 'disabled', reason: this.getTextString("interactFail")};
			}
			else { 
				return {state:'enabled'};
			}
		}

		return {state:null};
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: true,
	"valid_items"		: function(pc){

		var items = pc.apiGetAllItems();

		//log.info("Butler package: items is "+items);

		var possibles = [];
		for (var i in items){
			var it = items[i];
			
			if (!it.is_bag && !it.is_trophy && !it.has_parent('furniture_base') && !it.hasTag("no_trade")) {
				possibles.push(it.tsid);
			}
		}

		//log.info("Butler package: possibles is "+possibles);

		return {
			'ok' : 1,
			'choices' : possibles,
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		// Update capacity in case it has changed
		this.capacity = parseInt(this.getClassProp("capacity")) + 2; // add 1 for gifts to visitors and 1 to handle accepting a new gift before we give the old one back

		var num = msg.target_item_class_count;

		if (msg.target_itemstack_tsid) { 

			this.logDebugInfo(" msg is "+msg);

			// First check if we are going to be able to give the old gift back:
			if (this.gift_item) { 
				var gift = this.removeItemStackClassExact(this.gift_item["class"], this.gift_item["count"]);
				
				this.logDebugInfo("Removed "+gift+" gift.count is "+gift.count);
				if (pc.isBagFull(gift)) { 

					// Check whether taking the new gift out will free up a slot:
					var new_gift = apiFindObject(msg.target_itemstack_tsid);
					if (new_gift && new_gift.count >  num) { 

						this.logDebugInfo("no space");

						// no.
						this.addItemStack(gift);

				
						var oldName = pluralize(this.gift_item["count"], gift.name_single, gift.name_plural);
						var text_prefix = this.getTextString("visitorGiftPrevious", pc, pc, null, null, oldName);
			
						var text = text_prefix + this.getTextString("visitorGiftFail", pc, pc);

						var conversation = [ { txt: text, choices: [{txt:"Oh, ok.", value:"giftFail"}] }];

						this.convo_step = 0;
						this.playTalk();
						this.timer = 4000;
						this.playAnim("talk", false, 3400);			
					
						this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
					
						this.interact_pc = pc;
						this.interact_time = time();

						return;
					}
				}
			}

			// Put the stack back, because it'll get removed after the player confirms (in onReturnOldGift)
			this.addItemStack(gift);


			var stack = apiFindObject(msg.target_itemstack_tsid);
			if (!stack) return false;

			if (!this.canContain(stack)) {
				this.sendIM(pc, this.getTextString("packageTypeFail", pc));
				return false;
			}

			//var name = num == 1 ? stack.name_single : stack.name_plural;
			
			this.logDebugInfo("stack is "+stack);

			var name = pluralize(num, stack.name_single, stack.name_plural);

			this.logDebugInfo("stack is "+stack+" and name is "+name);

			if (this.gift_item) { 
				this.logDebugInfo(" stack class is "+stack.class_id+" and size is "+num+" and gift_item class is "+this.gift_item["class"]+" and gift item size is "+this.gift_item["count"]+" and stackmax is "+stack.stackmax);
			}
			
			if ( this.gift_item && (stack.class_id != this.gift_item["class"] || ((num + this.gift_item["count"]) > stack.stackmax))) { 
				var oldprot = apiFindItemPrototype(this.gift_item["class"]);
				if (oldprot) { 
					var oldName = pluralize(this.gift_item["count"], oldprot.name_single, oldprot.name_plural);
					text_prefix = this.getTextString("visitorGiftPrevious", pc, pc, null, null, oldName);
				}
			}
			else if (this.gift_item && (stack.class_id == this.gift_item["class"])) { 
				var oldprot = apiFindItemPrototype(this.gift_item["class"]);
				if (oldprot) { 
					var oldName = pluralize(this.gift_item["count"], oldprot.name_single, oldprot.name_plural);
					text_prefix = this.getTextString("visitorGiftSame", pc, pc, null, null, oldName);
				}
			}
			else { 
				text_prefix = this.getTextString("visitorGiftNoPrevious", pc, pc);
			}

			if (num > 1){
				var text = text_prefix + this.getTextString("visitorGiftConfirmPlural", pc, pc, null, null, name); 
			}
			else {
				var text = text_prefix + this.getTextString("visitorGiftConfirm", pc, pc, null, null, name); 
			}
			

			this.give_msg = msg;

			var conversation = [ { txt: text, choices: [{txt:"Take them!", value:"giftYes"}, {txt:"Never mind.", value:"giftNo"}] }];

			this.convo_step = 0;
			this.playTalk();
			this.timer = 4000;
			this.playAnim("talk", false, 3400);
			
			//log.info(this.getLabel() + " starting conversation "+conversation);
			this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
					
			this.interact_pc = pc;
			this.interact_time = time();
		}
		else { 
			log.error(this.getLabel()+"no target for give!");
		}
	}
};

verbs.teach = { // defined by bag_butler
	"name"				: "teach",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 66,
	"tooltip"			: "Teach the Butler a greeting",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		/*if (pc && pc.tsid == this.getInstanceProp("owner_tsid")) { 
			// add check for number of allowed greetings here
			return {state:'enabled'}
			
		};*/

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		var conversation_runner = "conversation_run_teach";
		if (this[conversation_runner]){
			failed = 0;
			this[conversation_runner](pc, msg);
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'teach', 'taught', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.view_inbox = { // defined by bag_butler
	"name"				: "open mailbox",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 67,
	"tooltip"			: "Check your mail",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
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


		var pre_msg = this.buildVerbMessage(msg.count, 'open mailbox', 'opened mailbox', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.chat = { // defined by bag_butler
	"name"				: "chat",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 69,
	"tooltip"			: "Ask the Butler to IM you",
	"is_drop_target"		: false,
	"proximity_override"			: 550,
	"handler"			: function(pc, msg, suppress_activity){

		if (this.reactionAllowed()) {
			this.doClickAnim(randInt(0, 2));
		}

		this.sendBubbleAndChat(pc, this.getTextString("openIM"), true, 5000, false);

		this.sendIM(pc, this.getTextString("normalClickResponseList", pc) + this.getTextString("clickHelpAddition", pc, pc));
	}
};

verbs.talk_to = { // defined by bag_butler
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 70,
	"tooltip"			: "Converse with the Butler",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 1;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		/*if (this.conversations) {

			var convos = this.conversations;

			log.info("Butler conversations "+convos);

			var which = choose_one_hash(convos);
			
			var conversation_runner = "conversation_run_"+which;
			if (this[conversation_runner]){
				failed = 0;
				this[conversation_runner](pc, msg);
			}
		}*/

		failed = this.onTalkTo(pc, msg) ? 0 : 1;


		return failed ? false : true;
	}
};

verbs.visit = { // defined by bag_butler
	"name"				: "visit",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 71,
	"tooltip"			: "Visit the owner of this location",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		//if (pc && pc.tsid != this.getInstanceProp("owner_tsid")) { return {state:'enabled'}};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.onVisit(pc);
	}
};

verbs.leave_package = { // defined by bag_butler
	"name"				: "leave package",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: true,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 72,
	"tooltip"			: "Leave a gift for the owner",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Leave a package with the Butler",
	"drop_ok_code"			: function(stack, pc){

		if (!stack.takeable_pickup) return false;

		var ret = stack.takeable_drop_conditions(pc);
		if (ret.state != 'enabled') return false;

		if (stack.is_trophy || stack.has_parent('furniture_base')) return false;

		if (stack.hasTag("no_trade") && stack.class_id != "bag_gift_box_wrapped") return false;

		var canGive = stack.takeable_give_conditions ? stack.takeable_give_conditions(pc) : false; 
		if (canGive.state != "enabled") return false;

		return true;
	},
	"proximity_override"			: 550,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.tsid != this.getInstanceProp("owner_tsid")) { 

			var totalMessages = this.getNumMessagesTotal();
			var packagesNoMessages = this.getNumPackagesTotal() - this.getNumPackagesWithMessages();
			
			var capacity = parseInt(this.getClassProp("capacity"));

			if (this.gift_item) { capacity += 1 }; 

			if (this.countContents() >= capacity 
				|| this.getNumPackagesTotal() >= parseInt(this.getClassProp("package_limit"))
				|| (totalMessages + packagesNoMessages) >= parseInt(this.getClassProp("message_limit"))) { 
				return {state:'disabled', reason: this.getTextString("packageFail", pc)};
			}
			else if (this.interact_pc) { 
				return {state: 'disabled', reason: this.getTextString("interactFail")};
			}

			return {state:'enabled'}
		};

		return {state:null};
	},
	"requires_target_item_count"	: true,
	"choices_are_stacks"	: true,
	"valid_items"		: function(pc){

		var items = pc.apiGetAllItems();

		//log.info("Butler package: items is "+items);

		var possibles = [];
		for (var i in items){
			var it = items[i];
			
			var canGive = it.takeable_give_conditions ? it.takeable_give_conditions(pc) : false;
			var noTrade = it.hasTag("no_trade") && it.class_id != "bag_gift_box_wrapped";

			if (!it.is_trophy && !it.has_parent('furniture_base') && !noTrade && canGive.state === "enabled") { 
				possibles.push(it.tsid);
			}
		}


		this.logDebugInfo("package: possibles is "+possibles);

		return {
			'ok' : 1,
			'choices' : possibles,
		};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.playAnim("idle0", true);
		this.stateChange("attending", "done");

		if (this.reactionAllowed()) {
			this.doClickAnim(randInt(0, 2));
		}

		if (msg.target_itemstack_tsid) { 

			var capacity = this.capacity;
			if (!this.gift_item) {
				capacity -= 1; 	// always leave one slot open for the gift to visitors.
			}

			var owner = this.getOwner();

			if (this.countContents() < capacity && this.getNumPackagesTotal() < parseInt(this.getClassProp("package_limit"))) {

				var count = msg.target_item_class_count;
				var stack = apiFindObject(msg.target_itemstack_tsid);

				if (this.canContain(stack)) {
				
					var name = count == 1 ? stack.name_single : stack.name_plural;
			
					var text = "";

					if (count > 1){
						text = this.getTextString("packageGivePlural", pc, owner);
						var article = "these";
					}
					else {
						text = this.getTextString("packageGiveSingle", pc, owner);
						var article = "this";
					}

					var conversation = [ { txt: text, choices: [{txt:"Of course!", value:"yes"}, {txt:"No, I'm keeping it!", value:"no"}] }];

					this.convo_step = 0;
					this.playTalk();
					this.timer = 4000;
					this.playAnim("talk", false, 3400);
			
					//log.info(this.getLabel() + " starting conversation "+conversation);
					this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
					this.package_msg = msg;
					this.interact_pc = pc;
					this.interact_time = time();

					//this.sendIM(pc, text);
					//this.waiting_for_response = {which:"leave_package", pc:pc, time:current_gametime(), msg:msg};
				}
				else { 
					var conversation = [{ txt:this.getTextString("packageTypeFail"), choices: [{txt:"Oh, ok.", value:"packagefail"}] }];
					this.convo_step = 0;
					this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
				}
			}
			/*else { 
				this.sendIM(pc, this.getTextString("packageFail", pc, owner)); 
			}*/
		}
		else { 
			this.logDebugInfo("Butler: no target!");
		}
	}
};

verbs.leave_message = { // defined by bag_butler
	"name"				: "leave message",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 73,
	"tooltip"			: "Leave a message for the owner",
	"is_drop_target"		: false,
	"proximity_override"			: 550,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.tsid != this.getInstanceProp("owner_tsid")) { 

			if (this.interact_pc) { 
				return {state: 'disabled', reason: this.getTextString("interactFail")};
			}
			else { 
				var totalMessages = this.getNumMessagesTotal();
				var packagesNoMessages = this.getNumPackagesTotal() - this.getNumPackagesWithMessages();
				var limit = this.getClassProp("message_limit");

				if (totalMessages < this.getClassProp("message_limit") && (totalMessages + packagesNoMessages < limit)) {
					return {state:'enabled'};
				}
				else {
					return {state:'disabled', reason:this.getTextString("messageFail", pc)};
				}
			}
		};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.playAnim("idle0", true);
		this.stateChange("attending", "done");

		if (this.reactionAllowed()) {
			this.doClickAnim(randInt(0, 2));
		}


		this.onLeaveMessage(pc);
		this.interact_pc = pc;
		this.interact_time = time();

		return true;
	}
};

verbs.randomize = { // defined by bag_butler
	"name"				: "randomize",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 74,
	"tooltip"			: "Change the Butler's appearance",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		/*if (pc === this.getOwner()) { 
			return {state:'enabled'};
		}*/

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.playAnim("idle0", true);
		this.stateChange("attending", "done");

		this.randomize();
	}
};

verbs.record_info = { // defined by bag_butler
	"name"				: "leave info",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 75,
	"tooltip"			: "Record information for your visitors",
	"is_drop_target"		: false,
	"proximity_override"			: 550,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.tsid == this.getInstanceProp("owner_tsid")) { 

			if (this.interact_pc) { 
				return {state: 'disabled', reason: this.getTextString("interactFail")};
			}
			else {
				return {state:'enabled'}
			}
		};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var owner = this.getOwner();

		this.playAnim("idle0", true);
		this.stateChange("attending", "done");

		if (this.reactionAllowed()) {
			this.doClickAnim(randInt(0, 2));
		}

		var text = "Your info is: \n\n";
		if (this.info && this.info.length > 0) { 
			text += "<b>This is "+this.getPlayerNameText(owner, true)+" home street.</b>"+"\n\n"+owner.label+" says: "+this.info[0];
		}
		else { 
			text += "<b> This is "+this.getPlayerNameText(owner, true)+" home street. </b>";
		}
			

		var conversation = [ { txt: text, choices: [{txt:"Change it!", value:"changeInfo"}, {txt:"Never mind.", value:"noChangeInfo" }] }];


		this.convo_step = 0;

		this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);

		//this.stateChange("interacting");

		this.interact_pc = pc;
		this.interact_time = time();
		return true;
	}
};

verbs.name = { // defined by bag_butler
	"name"				: "name",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 76,
	"tooltip"			: "Change the Butler's name",
	"is_drop_target"		: false,
	"proximity_override"			: 550,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.tsid == this.getInstanceProp("owner_tsid")) { 

			if (this.interact_pc) { 
				return {state: 'disabled', reason: this.getTextString("interactFail")};
			}
			else {
				return {state:'enabled'}
			}
		};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.playAnim("idle0", true);
		this.stateChange("attending", "done");

		if (this.reactionAllowed()) {
			this.doClickAnim(randInt(0, 2));
		}

		var args = {
			input_label: 'My new name:',
			cancelable: true,
			input_focus: true,
			input_max_chars: 19,
		};

		if (this.user_name) args.input_value = this.user_name;

		this.interact_pc = pc;
		this.interact_time = time();
		this.interact_box = "name";

		this.askPlayer(pc, 'name', 'Rename Me!', args);

		//this.stateChange("interacting");
		return true;
	}
};

verbs.access_mailbox = { // defined by bag_butler
	"name"				: "mailbox",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 77,
	"tooltip"			: "Access your mailbox",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (pc.tsid == this.getInstanceProp("owner_tsid")) { return {state:'enabled'}};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.stateChange("interacting");
		this.fullStop();

		if (this.reactionAllowed()) {
			this.doClickAnim(randInt(0, 2));
		}

		this.checkMail(pc);
	}
};

verbs.visitors = { // defined by bag_butler
	"name"				: "who visited?",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 78,
	"tooltip"			: "Find out who visited your street",
	"is_drop_target"		: false,
	"proximity_override"			: 550,
	"conditions"			: function(pc, drop_stack){

		if (pc === this.getOwner()) { 

			var num = this.getVisitors();
			this.visitors_num = num;

			this.logDebugInfo(" found "+num+" visitors");
			apiLogAction('BUTLER_VISITORS_CONDITIONS', 'pc='+pc.tsid, 'butler='+this.tsid, 'num='+num, 'last_time='+this.last_who_visited_time);

			if (num > 0) {
				return {state:'enabled'};
			}
			else {

				/*if (this.getNumPackagesTotal() > 0 || this.getNumMessagesTotal() > 0) { 
					log.error(this.tsid+" Butler has package or message but no visitors! ");
					this.displayVisitors();
				}*/

				return {state:'disabled', reason:"There have been no visitors since the last time you asked."};
			}
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var output = this.visitors_output;

		if (this.visitors_num > 5) { 
			output = this.getTextString("visitorsMany");
			this.im_visitors = this.visitors_output;

			this.logDebugInfo("output is "+output);
		}
		else { 
			this.logDebugInfo("num is "+this.visitors_num+" and output is "+output);
			this.sendBubbleAndChat(pc, output, true, null, true);
		}

		this.fullStop();
		this.playAnim("idle0", "start");

		if (this.reactionAllowed()) {
			this.doClickAnim(randInt(0, 2));
		}

		this.stateChange("attending", "start");
		var conversation = [ { txt: output, choices: [{txt:"Thanks!", value:"gotVisitors"}] }];

		this.convo_step = 0;
		this.playTalk();
		this.timer = 4000;
		this.playAnim("talk", false, 3400);

		this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);


		this.last_who_visited_time = getTime();
			

		return true;
	}
};

verbs.retrieve_messages = { // defined by bag_butler
	"name"				: "messages",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 79,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var num = this.getNumMessagesTotal();

		if (num > 1) { 
			return "You have "+num+" Messages";
		}
		else if (num === 1) { 
			return "You have 1 Message";
		}
		else {
			return "This isn't possible, please report a bug";
		}
	},
	"is_drop_target"		: false,
	"proximity_override"			: 550,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.tsid == this.getInstanceProp("owner_tsid")) { 

			if (this.getNumPackagesTotal() > 0)  { 
				return {state:null};
			}
			else if (this.interact_pc) { 
				return {state:'disabled', reason: this.getTextString("chatFailTooltip")};
			}
			else if (this.getNumMessagesTotal() > 0) {
				return {state:'enabled'}
			}
			else { 
				return {state:'disabled', reason: this.getTextString("messagesNone")};
			}
		};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.reactionAllowed()) {
			this.doClickAnim(randInt(0, 2));
		}

		this.interact_pc = pc;
		this.interact_time = time();

		this.onRetrieveMessages(pc);
	}
};

verbs.retrieve_packages = { // defined by bag_butler
	"name"				: "packages",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 80,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var packagesWithMessages = this.getNumPackagesWithMessages();
		var packages = this.getNumPackagesTotal();

		var messages = this.getNumMessagesTotal() - packagesWithMessages;

		var p = (packages > 1) ? "Packages" : "Package";
		if (messages > 0) { 
			var m = (messages > 1) ? "Messages" : "Message";
			return "You have "+packages+" "+p+" and "+messages+" "+m;
		} 
		else { 
			return "You have "+packages+" "+p;
		}
	},
	"is_drop_target"		: false,
	"proximity_override"			: 550,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc.tsid == this.getInstanceProp("owner_tsid")) { 
			
			if (this.getNumPackagesTotal() > 0) {
				if (this.interact_pc) { 
					return {state:'disabled', reason: this.getTextString("chatFailTooltip")};
				}
				else { 
					return {state:'enabled'};
				}
			}
			else { 
				// Check for broken packages
				var numContents = this.countContents();
				if ((this.gift_item && numContents > 1) || (!this.gift_item && numContents > 0)) {
					 if (this.interact_pc) { 
						return {state:'disabled', reason: this.getTextString("chatFailTooltip")};
					}
					else { 
						return {state:'enabled'};
					}
				}
				return {state:null};
			}
		};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.reactionAllowed()) {
			this.doClickAnim(randInt(0, 2));
		}

		this.interact_pc = pc;
		this.interact_time = time();

		this.onRetrieveMessages(pc);
	}
};

verbs.info = { // defined by bag_butler
	"name"				: "tell me about...",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 81,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return "Learn about "+this.getOwner().label;
	},
	"is_drop_target"		: false,
	"proximity_override"			: 550,
	"conditions"			: function(pc, drop_stack){

		if (pc && pc != this.getOwner()) { 
			return {state:'enabled'};
		}
		else { 
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.fullStop();
		this.playAnim("idle0", "start");
		this.stateChange("attending", "start");

		if (this.reactionAllowed()) {
			this.doClickAnim(randInt(0, 2));
		}

		var owner = this.getOwner();
		var text = "";

		if (this.info && this.info.length > 0) { 
			text = "<b>This is "+this.getPlayerNameText(owner, true)+" home street.</b>"+"\n\n"+owner.label+" says: "+this.info[0];
		}
		else { 
			text = "<b> This is "+this.getPlayerNameText(owner, true)+" home street. </b>"
		}
			

		var conversation = [ { txt: text, choices: [{txt:"Thanks!", value:"gotInfo"}] }];

		this.convo_step = 0;
		this.playTalk();
		this.timer = 4000;
		this.playAnim("talk", false, 3400);

		this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
			

		return true;
	}
};

verbs.accept_gift = { // defined by bag_butler
	"name"				: "receive gift",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 82,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		var item = get_item_name_from_class(this.gift_item["class"], false, true);
		var text = this.getTextString("giftTooltip", pc, this.getOwner(), null,  null, item);


		return text;
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.giftCanGive(pc)) { 
			return {state:'enabled'};
		}

		return {state:'null'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var canGive = this.giftCanGive(pc);
			if (canGive === "no space") {
				
				this.sendBubbleAndChat(pc, this.getTextString("giftItemFail", pc, this.getOwner()), true, 5000);
				return false;			
			}
			else if (canGive) {
				this.gift_item["count"] --;

				if (this.gift_no_space && this.gift_no_space[pc.tsid]) {
					delete this.gift_no_space[pc.tsid];
				}
			
				var item = get_item_name_from_class(this.gift_item["class"], false, false);
				var text = this.getTextString("giftItem", pc, this.getOwner(), null,  null, item);

				var conversation = [ { txt: text, choices: [{txt:"Thanks!", value:"gotGift"} ] }];

				this.convo_step = 0;
				this.playTalk();
				this.timer = 4000;
				this.playAnim("talk", false, 3400);

				this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
				this.interact_pc = pc;
				this.interact_time = time();
			}

			return true;
	}
};

function parent_verb_npc_mailbox_view_inbox(pc, msg, suppress_activity){
	this.checkMail(pc);

	return true;
};

function parent_verb_npc_mailbox_view_inbox_effects(pc){
	// no effects code in this parent
};

function afterGreeting(player){ // defined by bag_butler
	var owner = this.getOwner();

	if (!owner || !player) { 
		log.error("Butler got bad parameter (owner or player)");
	}


	var owner_tsid = this.getInstanceProp("owner_tsid");
	var owner = getPlayer(owner_tsid);

	this.logDebugInfo(" after greeting, player is "+player+" and owner is "+owner);


	var greeting = "";
	if (player === owner) { 
		this.logDebugInfo(" owner is here");
		var greeting = this.getAfterGreetingForOwner(player);
	}
	else if (owner.buddies_is_buddy(player)) {
		this.logDebugInfo(" friend is here");
		var greeting = this.getAfterGreetingForFriend(player);
	}
	else { 
		this.logDebugInfo(" stranger is here ");
		var greeting = this.getAfterGreetingForStranger(player);
	}

	if (greeting) {
		this.sendBubbleAndChat(player, greeting, true, null, false); 
	}
	else {
		this.logDebugInfo(" no greeting");
	}

	this.logDebugInfo(" greeting is "+greeting);
	this.logDebugInfo(" after greet queue is "+this.after_greet_queue);

	for (var idx in this.after_greet_queue) {
		var nextPlayer = this.after_greet_queue[idx];
		
		if (nextPlayer.tsid == owner.tsid) { 
			this.logDebugInfo(" owner is here");
			greeting = this.getAfterGreetingForOwner(nextPlayer );
		}
		else if (owner.buddies_is_buddy(nextPlayer )) {
			this.logDebugInfo(" friend is here");
			greeting = this.getAfterGreetingForFriend(nextPlayer );
		}
		else { 
			this.logDebugInfo(" stranger is here ");
			greeting = this.getAfterGreetingForStranger(nextPlayer );
		}

		this.logDebugInfo(" greeting "+nextPlayer);

		if (greeting) {
			this.sendBubbleAndChat(nextPlayer, greeting, true, null, false); 
		}
	}

	delete this.after_greet_queue;


	this.last_command_time = getTime();

	// If the player doesn't respond for several seconds, revert to normal behaviour
	this.apiSetTimerX("endGreeting", 20 * 1000, player);
}

function approachPlayer(pc){ // defined by bag_butler
	this.logDebugInfo(" moving to player "+pc);

	if (this.stateChange("approach", "start")) {

		this.chooseWalk();

		if (this.canPlayAnim(this['!walk_anim'], true)) {
			this.moveToPlayer(pc);
			delete this.walkNotAllowed;

			if (this.textAddition) { 
					this.sendIM(pc, this.getTextString("summonSucceed", pc, this.getOwner()) + this.textAddition);
					delete this.textAddition;
			}
			else { 		
				this.sendIM(pc, this.getTextString("summonSucceed", pc, this.getOwner()));
				this.setSpeakTime();
			}
		}
		else {
			this.sendIM(pc, this.getTextString("waitASec"));
			this.walkNotAllowed = true;
		}

		this.summoner = pc;

		return true;
	}

	return false;
}

function broadcastState(){ // defined by bag_butler
	// this is the same as the version in item.js - redefined to override the 
	// mailbox's special version

	var container = this.apiGetLocatableContainerOrSelf();
	if (!container) return;
		
	if (container.container){
		var root = container.container;
	}
	else{
		var root = container;
	}
		
	root.apiSendMsg({
		type: 'item_state',
		itemstack_tsid: this.tsid,
		s: this.buildState(),
	});
}

function buildState(){ // defined by bag_butler
	if (this.dir){
		//log.info('building state for stack with direction', this.dir);
		if (this.dir == 'left'){
			return '-' + this.state;
		}
	}

	return this.state;
}

function bumpPlayer(pc){ // defined by bag_butler
	//log.info(this.getLabel()+" bumped player");

	/*	if (this.greet_queue && this.greet_queue.length > 0 && pc == this.greet_queue[0]) { 
			// If currently greeting this player, we're about to play a greeting, so skip this
			log.info(this.getLabel()+" bumped player - is currently greeting");
			return;
		}

		if (this['!behavior_state'] == "escorting") {
			// If escorting the player, we might walk past them. Skip this in that case
			log.info(this.getLabel()+" bumped player - is currently escorting");
			return;
		}

		log.info(this.getLabel()+" bumped player, speak time is "+this['!speak_time']);

		var diff =  Math.abs(getTime() - this['!speak_time']);
		log.info(this.getLabel()+" bumped player, diff is "+diff);

		if (!this['!speak_time'] || diff > 8000) {

			// When bumping into a player, say something.
			this.sendBubble(this.getCollisionComment(pc), 3000);

			this['!speak_time'] = getTime();

			this.timer = 3000;
			this.stateChange("speaking", "start");
		}
		else { 
			if (randInt(0, 100) < 5) { 
				this.timer = 3640;
				this.fullStop();
				this.stateChange("waiting", "start");
				this.playAnim("idle2", false, 3633);
			}

			//log.info(this.getLabel()+" blinking");
			//this.playAnim("idle3", false);
		}
	*/
}

function cancelGreeting(){ // defined by bag_butler
	this.logDebugInfo(" cancelGreeting queue is "+this.greet_queue);
	var player = this.greetee;

	this.greet_queue.shift();
			
	if (this.greet_queue.length > 0) { 
		this.logDebugInfo(" greet queue is "+this.greet_queue);
		this.moveToPlayer(this.greet_queue[0]);
	}
	else { 
		this.stateChange("idle", "done");
	}
}

function canContain(stack){ // defined by bag_butler
	return (stack.getProp('is_element') || stack.class_tsid == 'npc_crafty_bot') ? 0  : stack.getProp('count');
}

function canPlayAnim(s, l, t){ // defined by bag_butler
	// s is the name of the animation state to play
	// l should be true if looping
	// if NOT looping, provide t = length of an animation in milliseconds

	if (!s) { log.error(this.getLabel()+" bad animation state " +s); return false; }

	var current_anim = this['!anim_state'];

	if (current_anim && current_anim.state === s)  
	{ 
		//log.info(this.getLabel()+" already in anim state "+s);
		return true; 
	}
	else {
		if (current_anim && current_anim.state === "turnBack" && s === "turnFront") { 
			return true;
		}
		else if (current_anim && current_anim.state === "turnFront" && s === "turnBack") {
			return true;
		} 
		else if (current_anim && current_anim.state === "dance" && s && s === "fastDance") {
			return true;
		}
		else if (s && s === "fastDance") {
			//this.logDebugInfo(this.getLabel()+" in state "+current_anim.state+" not changing to "+s); 
			return false;
		}
		else if (s && s === "jump" && (current_anim && (current_anim.state === "walk3" || current_anim.state === "walk4"))) {
			return false;
		}
		else if (current_anim && (current_anim.state === "idle3" || current_anim.state === "idle4" || current_anim.state == "idle0")) {
			return true;
		}
		else if (current_anim && (current_anim.state != "idle0") && (s === "acknowledge")) {
			this.logDebugInfo(" not playing acknowledge, current state is "+current_anim);
			return false;
		}
		/*else if (current_anim && (current_anim.state === "acknowledge")) {
			// special case to prevent acknowledge from causing sliding
			return true;
		}*/
		else if (current_anim && !current_anim.loop) { 
			this.logDebugInfo(" in state "+current_anim.state+" not changing to "+s);
			return false;
		}
	}

	return true;
}

function canSpeak(waitTimeMS){ // defined by bag_butler
	var diff =  Math.abs(getTime() - this['!speak_time']);

	this.logDebugInfo("IDLE speak diff is "+diff+" and requested delay is "+waitTimeMS);
	if (diff > waitTimeMS) {
		return true;
	} 

	return false;
}

function chooseWalk(){ // defined by bag_butler
	this['!walk_anim'] = "walk4";

	// walk3 is the zombie walk

	/*if (randInt(0, 10) < 2) { // 2 out of 11 chance of choosing a different walk.
		
		if (randInt(1,2) < 2) { 
			this['!walk_anim'] = "walk2";
		}
		else {
			this['!walk_anim'] = "walk1";
		}
	}*/
}

function confirmMessageReceipt(pc){ // defined by bag_butler
	var owner = this.getOwner();

	var text = this.getTextString("messageSuccess", pc, owner);


	var conversation = [ { txt: text, choices: [{txt:"Thanks.", value:"confirm"}] }];

	this.convo_step = 0;
	this.playTalk();
	this.timer = 4000;
	this.playAnim("talk", false, 3400);
		
	this.logDebugInfo(" starting conversation "+conversation);
	this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
}

function confirmPackageReceipt(pc){ // defined by bag_butler
	var owner = this.getOwner();

	var text = this.getTextString("packageConfirm", pc, owner);


	var conversation = [ { txt: text, choices: [{txt:"Thanks.", value:"confirm"}] }];

	this.convo_step = 0;
	this.playTalk();
	this.timer = 4000;
	this.playAnim("talk", false, 3400);
		
	this.logDebugInfo(" starting conversation "+conversation);
	this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
}

function doClick(pc){ // defined by bag_butler
	if (this.waiting_for_response && this.waiting_for_response.list && this.waiting_for_response.list[pc.tsid]) {
		delete this.waiting_for_response.list[pc.tsid];
	}

	if (!this.click_history) { 
		this.click_history = {};
	}

	var now = getTime();
	var pc_history = this.click_history[pc.tsid];
	var last_click = (pc_history && pc_history.length > 0) ? pc_history[0] : 0;

	this.last_command_time = now;

	var diff =  Math.abs(now - last_click);

	var owner = this.getOwner();

	if (Math.abs(this.x - pc.x) > 300) {
		this.approachPlayer(pc);
		if (this.canSpeak(10000)) {
			this.sendBubbleAndChat(pc, this.getTextString("clickSummon", pc, this.getOwner())); 
			this.setSpeakTime();
		}
	}
	else {
		if (diff > this.getClassProp("required_click_delay")) {
			delete this.click_history[pc.tsid];
			this.sendBubbleAndChat(pc, this.getTextString("openIM", pc, owner, null, null, null, pc), true, null, true);
			this.sendIM(pc, this.getShortGreeting());
			this.click_history[pc.tsid] = [];

			if (this.reactionAllowed()) {
				this.doClickAnim(0);
			}
		}
		else {
			var num = pc_history ? pc_history.length : 0; 
			this.sendIM(pc, this.getShortGreeting(num));

			if (this.reactionAllowed()) {
				this.doClickAnim(num);
			}
		}
	}

	this.click_history[pc.tsid].unshift(now);
}

function doIntro(pc){ // defined by bag_butler
	this.fullStop();
	this.stateChange("interacting", "start");

	this.interact_pc = pc;
	this.interact_time = time();

	this.intro_end_time = time(); // setting it here instead of in onConversation, just in case the 
					// player loses their connection or something

	this.facePlayer(pc);

	var output = "Thank you. I am very happy to be here with you, "+pc.label+". I look forward to being of service.";

	var conversation = [ { txt: output, choices: [{txt:"Welcome!", value:"intro"}] }];

	this.convo_step = 0;
	this.playTalk();
	this.timer = 4000;
	this.playAnim("talk", false, 3400);

	this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
}

function doQuests(pc){ // defined by bag_butler
	// Only call this with the owner!

	// First check if owner needs to complete the Join Club quest
	//pc.sendActivity("quest exit flag is "+pc.quests_get_flag("join_club", "instance_exit_via_signpost"));
	if (pc.quests_get_flag("join_club", "instance_exit_via_signpost")) {
		//pc.sendActivity("setting talk_to_butler flag");
		pc.quests_set_flag("talk_to_butler");
	}

	var quests = this.getAvailableQuests(pc);
	if (num_keys(quests.offered) || num_keys(quests.completed)) {
		this.logDebugInfo("offering quests");
		this.offerQuests(pc);
	}
}

function doTalk(pc){ // defined by bag_butler
	this.fullStop();
	this.playAnim("idle0", true);

	this.setSpeakTime();
	this.buildAndRunConvo("alphy", "owner", pc);

	this.summoner = null;
	this.callback = null;
}

function endAnim(s, l, t){ // defined by bag_butler
	//this.logDebugInfo(" got to endAnim "+this.getCurrentAnim()+" "+s);

	var new_anim = { 
		state:s,
		loop: (l ? l : false) ,
		time: (t ? t : null)
	};

	this['!anim_state'] = new_anim;
	this.setAndBroadcastState(new_anim.state);


	if (!l) {
		// Automatically transition back to idle0 when done 
		if (!t) { 
			this.apiSetTimerX("endAnim", 333, "idle0", true, null); // about 10 frames
		}
		else { 
			this.apiSetTimerX("endAnim", t, "idle0", true, null); 
		}
	}
}

function endGreeting(pc){ // defined by bag_butler
	this.logDebugInfo(" ended greeting");

	this.last_command_time = getTime();


	// This gets called when we haven't received an answer from the player. Stop waiting for 
	// a response.
	if (this.waiting_for_response && this.waiting_for_response.list && this.waiting_for_response.list[pc.tsid]) {
		delete this.waiting_for_response.list[pc.tsid];
	}

	if (pc && pc.location == this.container) {

		this.sendIM(pc, this.getTextString("greetingNoResponse", pc));

		this.chooseWalk();
		
		if (this.stateChange("move_away", "done")) {
			if (this.canPlayAnim(this['!walk_anim'], true)) {
				this.moveAwayFromPlayer(pc, false);
			}
			else {
				this.stateChange("idle", "done");
			}
		}
		else {
			// if the butler can't move away, just stop it where it is in this case
			this.stateChange("idle", "done");
		}
	}
	else {
		this.stateChange("idle", "done");
	}
}

function facePlayer(pc){ // defined by bag_butler
	if (pc.x < this.x) {
		this.dir = "right";	// player is to the left, directions are backwards
	}
	else {
		this.dir = "left";
	}

	if (this.getCurrentAnim() === "turnBack") {
		this.playAnim("turnFront");
	}
}

function finishEscorting(args){ // defined by bag_butler
	this.logDebugInfo(" got escort status "+args.status);

	this.last_command_time = getTime();


	var anim = this.getCurrentAnim();
	if (anim != "walk1" && anim != "walk2" && anim != "walk3" && anim != "walk4" ) {
		log.error(this.getLabel()+" got anim state "+anim+" in finishEscorting with status "+args.status);
	}

	var owner = this.getOwner();
	var inside = this.ownerInsideHouse();
	var outside = inside ? false : owner.houses_is_at_home();

	this.logDebugInfo(" has inside "+inside+" and outside "+outside);

	if (args.status == 9) { 
		// reached destination
		this.sendBubble(this.getTextString("visitSucceed", this.visitor, owner)); 
		this.timer = 5000;
		this.visitor = null;
		this.stateChange("waiting", "done");
		this.playAnim("idle0", true);
	}
	else if (args.status == 10 || args.status == 3 || args.status == 4) { 
		
		if (inside) { 
			var target = this.getDoorPosition();

			if (this.escortTarget === owner) {
				this.sendIM(this.visitor, this.getTextString("visitOwnerWentInside", this.visitor, owner));
				
				this.escortTarget = "door";
				var x = this.getDoorPosition();
				//this.apiStopMoving();
				var result = this.apiWalkAndLeadPlayer(this.visitor, x, this.visitor.y, "finishEscorting");
				this.logDebugInfo(" switching lead types, result is "+result);
			}
		}
		else if (outside) { 
			var target = owner.x;

			if (this.escortTarget === "door") {
				this.sendIM(this.visitor, this.getTextString("visitOwnerWentOutside", this.visitor, owner));
				this.escortTarget = owner;
				//this.apiStopMoving();
				var result = this.apiWalkAndLeadPlayerToPlayer(this.visitor, owner, "finishEscorting");

				this.logDebugInfo(" switching lead types, result is "+result);
			}
		}
		else {
			var target = -1;
			this.sendBubbleAndChat(this.visitor, this.getTextString("visitOwnerGone", this.visitor, owner)); 	this.stateChange("idle", done);
		}

		if (target > 0 && ( Math.abs(this.visitor.x - target) > Math.abs(this.x - target) ) ) {
			if (this.canSpeak(8000)) {
				//log.info(this.getLabel()+" this way: diff is "+diff);
				this.setSpeakTime();
				this.sendBubbleAndChat(this.visitor, this.getTextString("visitWaitForPlayer", this.visitor, owner)); 		}
		}

		this.playAnim("idle0", true);
	}
	else if (args.status == 15) {
		this.playAnim(this['!walk_anim'], true);
		this.logDebugInfo(" got code 15, doing walk anim ");
	}
	else if (args.status == 1) { 
		this.playAnim(this['!walk_anim'], true);
		this.logDebugInfo(" got direction "+args.dir);
		// NOTE: directions seem to be backwards
		if (args.dir == 'right'){
			this.dir = 'left';
		}
		else if (args.dir == 'left'){
			this.dir = 'right';
		}
	}
	else if (args.status == 12 || args.status == 13) {
		if (inside && this.escortTarget === owner) {
			this.sendIM(this.visitor, this.getTextString("visitOwnerWentInside", this.visitor, owner));		
			this.escortTarget = "door";
			var x = this.getDoorPosition();
			var result = this.apiWalkAndLeadPlayer(this.visitor, x, this.visitor.y, "finishEscorting");
		}
		else { 
			this.sendBubble(this.getTextString("visitFail", this.visitor, owner)); 
			this.visitor = null;
			this.stateChange("idle", "done");
		}
	}
	else if (args.status == 8 || args.status == 11) {
		this.sendBubble(this.getTextString("visitFail", this.visitor, owner)); 
		this.visitor = null;
		this.stateChange("idle", "done");
	}
}

function forcePlayAnim(s, l, t){ // defined by bag_butler
	// s is the name of the animation state to play
	// l should be true if looping
	// if NOT looping, provide t = length of an animation in milliseconds

	var current_anim = this['!anim_state'];


	var new_anim = { 
		state:s,
		loop: (l ? l : false) ,
		time: (t ? t : null)
	};
		
	this.logDebugInfo( " changing from "+current_anim+" to "+new_anim);
		
	this['!anim_state'] = new_anim;

	this.setAndBroadcastState(new_anim.state);

	this.logDebugInfo(" now anim is "+this.getCurrentAnim());

	//log.info(this.getLabel()+" canceling timer for "+current_anim);
	this.apiCancelTimer("endAnim");
			
	if (!l) {
		var goto_state = "idle0";
		var goto_loop = true;
		if (new_anim.state === "idle3" || new_anim.state === "idle4") {
			goto_state = current_anim.state;
			goto_loop = false;
		}

		this.playSound(new_anim);

		// Automatically transition back to idle0 when done except for danceStart -> dance
		if (new_anim.state === "danceStart") { 
			//log.info(this.getLabel()+" setting end timer for dance start");
			this.apiSetTimerX("endAnim", 750, "dance", false, this.timer - 750);
		}
		else if (new_anim.state === "turnBack") {
			// do nothing - keep the head turned
		} 
		else if (!t) { 
			this.timer += 333;
			//log.info(this.getLabel()+" adding endAnim timer for "+s);
			this.apiSetTimerX("endAnim", 300, goto_state, goto_loop, null); // idle3 is 9 frames
		}
		else { 
			this.timer += t;
			//log.info(this.getLabel()+" adding endAnim timer for "+s);
			this.apiSetTimerX("endAnim", t, goto_state, goto_loop, null); 
		}
	}

	return true;
}

function fullStop(){ // defined by bag_butler
	//log.info(this.getLabel()+" stopping");

	// Don't stop if we are currently stepping back. 
	if (this['!sub_state'] && this['!sub_state'] == 'stepping') { this.logDebugInfo(" not stopping"); return; }

	this.ai_debug_display("Stopping");
	this.apiStopMoving();
	this.apiCancelTimer('startMoving');
	this.apiCancelTimer('onIdle');

	//this.playAnim("idle0", true);
}

function getCurrentAnim(){ // defined by bag_butler
	if (this['!anim_state']) {
		if (this.state != this['!anim_state'].state) { 
			this.logDebugInfo(" Got anim state mis-match");
			log.info(this.getLabel()+" anim mismatch - state is "+this.state+" and anim should be "+this['!anim_state']);
		}

		return this['!anim_state'].state;
	}

	else return "unknown";
}

function getCurrentState(){ // defined by bag_butler
	return this['!behavior_state'];
}

function getDoorPosition(){ // defined by bag_butler
	var owner = this.getOwner();

	var doors = owner.home.exterior.geo_links_get_all_doors()

	if (!doors[0]) { log.error("Butler can't find a valid door"); return 0; }
	if (!doors[0].my_x) { log.info("Butler has bad code. Fix me."); return 0; }

	this.logDebugInfo(" got doors "+doors);

	return doors[0].my_x;
}

function getLabel(pc){ // defined by bag_butler
	var owner = this.getOwner();

	if (owner && (!pc || pc != owner)) {
		
		var owner_name = owner.getLabel();

		if (this.user_name) { 
			return this.user_name+" ("+owner_name+")";
		}
		else return this.label+" ("+owner_name+")";
	}
	else {
		if (this.user_name) { 
			return this.user_name;
		}
		else {
			return this.label;
		}
	}
}

function getNameInfo(){ // defined by bag_butler
	return {
		user_name	: this.user_name,
		class_tsid	: this.class_tsid,
		pc_namer	: this.pc_namer,
		named_on	: this.named_on,
		location	: this.container.tsid,
	};
}

function getOwner(){ // defined by bag_butler
	var tsid = this.getInstanceProp("owner_tsid");

	if (!config.is_dev && tsid == "PMF16PJ4LCB2BGM") {
		log.error("This butler is broken -  bad owner tsid value!");
		return null;
	}
	else if (tsid != "") {
		var owner = getPlayer(this.getInstanceProp("owner_tsid"));
		return owner;
	}

	return null;
}

function getPlayerNameText(pc, possessive){ // defined by bag_butler
	if (!possessive) { 
		var txt = "<a href=\"event:player_info|"+pc.tsid+"\">"+utils.escape(pc.label)+"</a>";
	}
	else { 
		var txt = "<a href=\"event:player_info|"+pc.tsid+"\">"+utils.escape(pc.label+"'s")+"</a>";
	}

	return txt;
}

function giftCanGive(pc){ // defined by bag_butler
	if (pc == this.getOwner()) { return false; }

	if (!this.gift_item) { return false; } 

	// This next one is to prevent cases of people getting a gift while the owner is swapping it 
	// for something else.
	if (this.interact_pc && this.interact_pc === this.getOwner()) { return false; }

	if (this.gifts && this.gifts[pc.tsid] && this.gifts[pc.tsid] == this.gift_item["class"]) {
		return false;
	}

	if (this.gift_item["count"] <= 0) { return false; }

	var gift = this.removeItemStackClassExact(this.gift_item["class"], 1);
	if (pc.isBagFull(gift)) { 
		this.addItemStack(gift);
		return "no space";
	}
	this.addItemStack(gift);

	return true;
}

function giveGift(pc){ // defined by bag_butler
	if (pc == this.getOwner()) { return; }

	var already_given = false;

	if (!this.gifts) { 
		this.gifts = {};
	}

	if (!this.gifts[pc.tsid]) { 
			this.gifts[pc.tsid] = {};
	}
	else {
		//if (!config.is_dev) {
			if (this.gifts[pc.tsid] == this.gift_item["class"]) {
				already_given = true;
			}
		//}
	}

	if (this.gift_item && this.gift_item["count"] >= 0 && !already_given) {
		var gift = this.removeItemStackClassExact(this.gift_item["class"], 1);

		if (!gift) {
			log.info(this.getLabel()+" failed to get gift "+this.gift_item["class"]+" clearing data "+this.gift_item);
			delete this.gift_item;
			delete this.gifts;
		}
		else {
			//this.sendBubbleAndChat(pc, this.getTextString("giftItem", pc, this.getOwner(), gift), true, null, true); 
		
			apiLogAction('BUTLER_GAVE_GIFT', 'pc='+pc.tsid, 'butler='+this.tsid, 'gift='+gift.class_id);
			this.logDebugInfo(" giving item type "+gift.class_id);

			var remainder = pc.addItemStack(gift);	

			if (remainder > 0) { 
				this.logDebugInfo("Butler didn't give player "+gift);
				pc.location.apiPutStackIntoPosition(gift, remainder, pc.x, pc.y);
			}

			// Fake a message so we can call onGive which will update any quests that 
			// count items given to others.
			var msg = {};
			msg.object_pc_tsid = pc.tsid;
			msg.count = 1;
			//this.logDebugInfo("Calling onGive with "+msg);
			if (gift.onGive) gift.onGive(this.getOwner(), msg);
			
			this.gifts[pc.tsid] = this.gift_item["class"];
			//this.gift_item["count"] = this.gift_item["count"] - 1;

			if (this.gift_item["count"] <= 0) {
				delete this.gift_item;
				delete this.gifts;
			}
		}
	}


	if (this.interact_pc === pc) { 
		delete this.interact_pc;
	}
}

function giveNextMessage(){ // defined by bag_butler
	var pc = this.getOwner();

	var txt= "";

	var total = 0;

	if (!this.messages) { 
		this.messages = apiNewOwnedDC(this);
		this.messages.list = {};
	}


	if (!this.packages) { 
		this.packages = apiNewOwnedDC(this);
		this.packages.list = {};
	}


	this.facePlayer(pc);

	var messages = this.messages.list;
	var packages = this.packages.list;


	// We're only going to process one, but a loop is the easiest way to get the key.
	for (var tsid in messages) {
		var list = messages[tsid];
		var player = getPlayer(tsid);

		for (var i in list) { 
			if (!list[i].withPackage) {
				txt += this.getTextString("messagesGive", player, pc, null, list[i]);
				delete list[i];
				this.messages.utime = time(); // hacky fix for data loss - mark DC as dirty


				if (txt != "") {
					break;
				}
			}
			if (list[i].withPackage && (num_keys(this.packages.list) <= 0)) { 
				txt += this.getTextString("messagesGive", player, pc, null, list[i]);
				delete list[i];
				this.messages.utime = time(); // hacky fix for data loss - mark DC as dirty

				if (txt != "") break;
			}
		}

		if (txt != "") { 
			break;
		}
	}

	this.logDebugInfo(" list is "+list+" and messages is "+this.messages.list);
	if (numValidKeys(list) <= 0) {
		log.info(this.getLabel()+" empty list, deleting it");
		delete this.messages.list[tsid];
		this.messages.utime = time(); // hacky fix for data loss - mark DC as dirty
	}
	else {
		log.info(this.getLabel()+" not deleting "+this.messages.list[tsid]);
	}

	if (txt != "") {
		this.sendBubbleAndChat(pc, txt, true, null, true);
		
		var conversation = [ { txt: txt, choices: [{txt:"Thanks!", value:"acceptMessage"}] }];

		this.convo_step = 0;
		this.playTalk();
		this.timer = 4000;
		this.playAnim("talk", false, 3400);

		this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);

		apiLogAction('BUTLER_VIEW_MESSAGE', 'pc='+pc.tsid, 'butler='+this.tsid, 'message='+txt);
	}
	else { 
		// there might be packages that didn't have messages
		this.giveNextPackage();
	}
}

function giveNextPackage(){ // defined by bag_butler
	var pc = this.getOwner();

	var bubble = "";

	var total = 0;

	if (!this.packages || !this.packages.list) { 
		log.error(this.getLabel() +" has no packages");
	}

	this.facePlayer(pc);


	var packages = this.packages.list;

	this.logDebugInfo("in giveNextPackage, packages is "+packages);


	for (var tsid in packages) { 

		var giver = getPlayer(tsid);
		var list = packages[tsid];

		var messages = (this.messages && this.messages.list) ? this.messages.list[giver.tsid] : [];
		this.logDebugInfo(" got "+num_keys(messages)+" messages: "+messages);

		bubble += this.getTextString("packagesStart", giver);

		var firstFromGiver = true;
		for (var i in list) {
			var it = list[i];
			
			var canGive = this.packageCanGive(pc, it);

			if (canGive === "no space") { 
				this.logDebugInfo(" No space for item, it is "+it+" and it.is_bag is "+it.is_bag);
				break;
			}

			if (canGive) { 
				this.logDebugInfo(" got "+it+" from "+giver);

				var stack = this.removeItemStackClassExact(it.class_id, it.count);
		
				if (!stack) {
					log.error("Butler got bad package "+it);
					continue;
				}
			
				this.logDebugInfo("removeItemStackClassExact gave back "+stack.getProp('count'));

				firstFromGiver = false;

				var count = stack.getProp('count');

				if (count > it.count) { 
					this.logDebugInfo(" error found! ");
				}

				bubble += pluralize(count, stack.name_single, stack.name_plural);
				//bubble += " from "+this.getPlayerNameText(giver);
				
				total ++;

				var timestamp = ago(gametime_to_timestamp(it.time));
				this.stack_to_give = stack;

				// Only process one item at a time.
				delete list[i];
				this.packages.utime = time();
				break;
			}

		}

		if (total > 0 || canGive === "no space") {
			// Only process stuff from one giver.
			break;
		}
		else {
			bubble = "";
			delete this.packages.list[tsid];
			this.packages.utime = time();
		}
	}

	if (canGive === "no space") { 
		this.logDebugInfo("it.class_id is "+it.class_id+" and substr is "+it.class_id.indexOf("bag_"));
		if (it.class_id.indexOf("bag_") === 0) { 
			bubble = this.getTextString("packageNoSpaceBag", pc, pc);
		}
		else { 
			bubble = this.getTextString("packageNoSpace", pc, pc);
		}
		this.sendBubbleAndChat(pc, bubble, true, null, true);
		var conversation = [ { txt: bubble, choices: [{txt:"Ok", value:"packageNoSpace"}] }];

		this.convo_step = 0;
		this.playTalk();
		this.timer = 4000;
		this.playAnim("talk", false, 3400);

		this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
	}

	else if (bubble) {

		this.logDebugInfo(" stack is "+it.stack_tsid);
		
		var gotMessage = false;
		for (var index in messages) {
			var message = messages[index]; 
			this.logDebugInfo(" checking message "+message);
			if (message.withPackage === it.stack_tsid) {
				bubble += this.getTextString("messageFromGiver", giver, this.getOwner(), null, message);
				delete messages[index];
				gotMessage = true;
				this.messages.utime = time();
				break;
			}
		}

		if (!gotMessage) {
		
			bubble += this.getTextString("packageNoMessage", giver, null, null, null, timestamp);
		}
		

		this.sendBubbleAndChat(pc, bubble, true, null, true);
		var conversation = [ { txt: bubble, choices: [{txt:"Thanks!", value:"acceptPackage"}] }];

		this.convo_step = 0;
		this.playTalk();
		this.timer = 4000;
		this.playAnim("talk", false, 3400);

		this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
		
	}
	else { 
		// check for broken data
		this.giveBrokenPackage();
	}
}

function giveStack(pc){ // defined by bag_butler
	if (this.stack_to_give && pc === this.getOwner()) { 
		this.logDebugInfo("Calling add item stack");

		var remainder = pc.addItemStack(this.stack_to_give);	

		if (remainder > 0) { 
			this.logDebugInfo("Butler didn't give player "+this.stack_to_give);
			pc.location.apiPutStackIntoPosition(this.stack_to_give, remainder, pc.x, pc.y);
		}
		apiLogAction('BUTLER_RETRIEVE_PACKAGE', 'pc='+pc.tsid, 'butler='+this.tsid, 'stack='+this.stack_to_give, 'num_dropped_instead_of_given='+remainder);

		delete this.stack_to_give;
	}
}

function greetPlayer(args){ // defined by bag_butler
	if (!this.greet_queue) { this.stateChange("idle", "done"); return; }

	if (this.greet_queue.length < 1) { this.stateChange("idle", "done"); return; }

	var player = this.greet_queue[0];

	this.fullStop();

	this.playAnim("idle0");


	if (this.x > player.x) { 
		// player is to the left, directions are backwards so face right
		this.dir = "right";
	}
	else {
		this.dir = "left";
	}
		
	var owner_tsid = this.getInstanceProp("owner_tsid");
	var owner = getPlayer(owner_tsid);

	var greeting = "";
	if (player.tsid == owner.tsid) { 
		this.playAnim("bow", false, 1333);
		var greeting = this.getGreetingForOwner(player);
	}
	else if (owner.buddies_is_buddy(player)) {
		var greeting = this.getGreetingForFriend(player);
	}
	else { 
		var greeting = this.getGreetingForStranger(player);
	}

	// Remove the player from the greet queue so we don't greet them again
	this.greet_queue.shift();
	this.greetee = player;

	var queue_length = this.greet_queue.length;


	if (queue_length > 0) { 
		log.info(this.getLabel()+" greet queue is "+queue_length);

		var next_player = this.greet_queue[0];
		
		this.giveGift(player);

		// Only walk to players if there aren't too many of them. Define "too many" as 3.
		if (queue_length > 0 && queue_length < 3) {
			this.sendBubbleAndChat(player, greeting + this.getTextString("greetingNextPlayer", next_player), true, null, false); 


			this.moveToPlayer(this.greet_queue[0]);
		}
		else {
			this.sendBubbleAndChat(player, greeting, true, null, false); 
		}	

		this.apiSetTimerX("afterGreeting", 10 * 1000, player);
	}
	else { 
		if (player === this.getOwner()) {
			this.sendBubbleAndChat(player, greeting, true, null, false);
					
		}
		else {
			
			this.sendBubbleAndChat(player, greeting+this.getTextString("visitorOwnerHome", player, this.getOwner()), true, null, false); 
			
		}

		this.giveGift(player);

		this.last_command_time = getTime();

		//log.info("Butler calling afterGreeting in 10 seconds");
		this.apiSetTimerX("afterGreeting", 10 * 1000, player);
	}


	if (queue_length >= 3 ) {
		this.logDebugInfo("greetPlayer greet_queue size is "+queue_length);


		if (!this.after_greet_queue) { this.after_greet_queue = []; }

		// Too many players, just show them stuff in chat w/o bothering to walk anywhere.
		for (var idx in this.greet_queue) {
			var nextPlayer = this.greet_queue[idx];

			if (nextPlayer .tsid == owner.tsid) { 
				greeting = this.getGreetingForOwner(nextPlayer );
			}
			else if (owner.buddies_is_buddy(nextPlayer )) {
				greeting = this.getGreetingForFriend(nextPlayer ) + this.getTextString("visitorOwnerHome", nextPlayer , this.getOwner());
			}
			else { 
				greeting = this.getGreetingForStranger(nextPlayer ) + this.getTextString("visitorOwnerHome", nextPlayer , this.getOwner());
			}
			
			this.sendBubbleAndChat(nextPlayer , greeting, true, null, false);

			this.giveGift(nextPlayer );

			this.after_greet_queue.push(nextPlayer);
		}

		delete this.greet_queue;

		this.logDebugInfo(" after_greet_queue is "+this.after_greet_queue);

		this.last_command_time = getTime();	
	}
}

function isFacing(pc){ // defined by bag_butler
	// Don't attempt to face players who aren't here:
	if (!pc.isOnline() || pc.location != this.container) { return true; }

	// Directions are backwards!
	if (pc.x < this.x) {
		if (this.dir === "right") { return true; }
	}
	else {
		if (this.dir === "left") { return true; }
	}

	return false;
}

function isOwnerHere(){ // defined by bag_butler
	var owner = this.getOwner();

	var isOnline = owner.isOnline();

	if (isOnline && !this.ownerInsideHouse() && owner.houses_is_at_home()) {
		return true;
	}

	return false;
}

function isOwnerHome(){ // defined by bag_butler
	var owner = this.getOwner();

	var isOnline = owner.isOnline();

	if (isOnline && this.ownerInsideHouse()) {
		return true;
	}
	else if (isOnline && owner.houses_is_at_home()) {
		return true;
	}

	return false;
}

function isOwnerInTower(){ // defined by bag_butler
	var owner = this.getOwner();

	this.logDebugInfo(" owner location is "+owner.location);

	if (owner.isOnline() && owner.home && owner.home.tower && owner.location.tsid === owner.home.tower.tsid) {
		return true;
	}

	return false;
}

function logDebugInfo(string){ // defined by bag_butler
	if (this.debugging === true) {
		log.info(this.getLabel()+" "+string);
	}
}

function lookAtPlayer(pc){ // defined by bag_butler
	var state = this.getCurrentState();

	// Don't allow stupid animation changes:
	if (!this.reactionAllowed()) { return; }

	var threshold = parseInt(this.getInstanceProp("min_look_time"));

	if (!threshold) { 
		threshold = 7000;
	}

	if (!this['!lookTarget'] || (Math.abs(getTime() - this['!lookTarget'].time) > threshold)) { 
		if (this['!lookTarget']) {
			//log.info(this.getLabel()+" switching targets "+(Math.abs(getTime() - this['!lookTarget'].time)));
		}
		this['!lookTarget'] = { player: pc, time: getTime() };
	}
	else {
		//log.info(this.getLabel()+" not switching targets "+(Math.abs(getTime() - this['!lookTarget'].time)));
	}

	var target = this['!lookTarget'].player;

	// Check whether the target is still here:
	if (!target.isOnline() || target.location != this.container) { return; }

	if (target.x < this.x) { // player is to the left
		//log.info(this.getLabel() +" has player to the left, and direction "+this.dir);
		if (this.dir == "left") { // butler is backwards for some reason
			this.playAnim("turnBack", false, 633);
			this.apiSetTimerX("facePlayer", 1500, target);
		}
		else if (this.getCurrentAnim() == "turnBack") {
			//log.info(this.getLabel()+" playing turnFront");
			this.playAnim("turnFront", false, 667);
		}
	}
	else {
		//log.info(this.getLabel() +" has player to the right and direction "+this.dir); 
		if (this.dir == "right") { // butler is backwards
			this.playAnim("turnBack", false, 633);
			this.apiSetTimerX("facePlayer", 1500, target);
		}
		else if (this.getCurrentAnim() == "turnBack") {
			//log.info(this.getLabel()+" playing turnFront");
			this.playAnim("turnFront", false, 667);
		}
	}
}

function mailStop(pc){ // defined by bag_butler
	this.ai_debug_display("mailstop");
	this.logDebugInfo("Butler calling mailstop");
	this.stateChange("idle", "done");
}

function make_config(){ // defined by bag_butler
	var accessory = this.getInstanceProp('accessory') || 'accessory1';
	var bod = this.getInstanceProp('bod') || 'body1';
	var skull = this.getInstanceProp('skull') || 'skull1';
	var face = this.getInstanceProp('face') || 'face1';
	var closeArm = this.getInstanceProp('closeArm') || '1';
	var farArm = this.getInstanceProp('farArm') || '1';
	var closeLeg = this.getInstanceProp('closeLeg') || '1';
	var farLeg = this.getInstanceProp('farLeg') || '1';

	return {
		accessory: accessory,
		bod: bod,
		skull: skull,
		face: face,
		closeArm: closeArm,
		farArm: farArm,
		closeLeg: closeLeg,
		farLeg: farLeg
	};
}

function modal_callback(pc, value, details){ // defined by bag_butler
	this.logDebugInfo("modal_callback deleting messages "+value);

	delete this.messages.list;
	this.messages.utime = time();

	this.message_index = 0;

	this.stateChange("idle", "done");
}

function moveAwayFromPlayer(pc, saySorry){ // defined by bag_butler
	if (!pc) { log.error(this.getLabel()+" trying to move away from "+pc); return; }

	var x = pc.x;

	var left = this.container.geo.l;
	var right = this.container.geo.r;

	var range = parseInt(this.getClassProp("near_dist")) + 25;

	this.logDebugInfo(" range is "+range+" left is "+left+" right is "+right+" and x is "+x);

	var target_x = x - range;

	if (this.x > x) { 
		target_x = x + range;

		if (this.x > (target_x-10) || Math.abs(this.x - target_x) <= 75) { 
			target_x = this.x + range;
		}
	}
	else { 
		if (this.x < (target_x+10) || Math.abs(this.x - target_x) <= 75) { 
			target_x = this.x - range;
		}
	}


	this.logDebugInfo(" this.x is "+this.x+" and target_x is "+target_x);

	if (target_x < left) {
		target_x = x + range; 
	}
	else if (target_x > right) { 
		target_x = x - range;
	}

	this.logDebugInfo(" this.x is "+this.x+" and target_x is "+target_x);
	var before = Math.abs(this.x - x);
	var after = Math.abs(target_x - x);
	var passing = (this.x < x && target_x > x) || (this.x > x && target_x < x);
	this.logDebugInfo(" before is "+before +" and after is "+after);


	if (  (before > after && !passing) || after <= 75  ) {	
		if (saySorry) {
			var owner = this.getOwner();
			this.sendIM(pc, this.getTextString("moveAwayStuck", pc, owner, null, null, null, pc));
			this.stateChange("idle0", "done");
		}
	}
	else {
		if (this.canPlayAnim(this['!walk_anim'], true)) { 
			if ( !this.apiFindPath(target_x, this.y, 0, "onPathing") ) { 
				if (saySorry) {
					var owner = this.getOwner();
					this.sendIM(pc, this.getTextString("moveAwayStuck", pc, owner, null, null, null, pc));
					this.stateChange("idle0", "done");
				}
			}
			else { 
				this.logDebugInfo(" playing walk anim");
				this.playAnim(this['!walk_anim'], true);
			}
		}
		else {
			this.logDebugInfo(" can't play walk anim");
			this.walkNotAllowed = true;
		}
	}

	this.ai_debug_display(" moving from "+this.x+" to "+target_x);
	this.logDebugInfo(" moving away from player "+pc+" pc x is "+x+" and target is "+target_x);
}

function moveToPlayer(player){ // defined by bag_butler
	if (!player && !this.greet_queue) 
	{ 
		log.info(this.getLabel()+" no greet queue"); 
		this.stateChange("idle", "done"); 
		return; 
	}

	if (!player && this.greet_queue.length < 1) 
	{ 
		log.info(this.getLabel()+" empty greet queue"); 
		this.stateChange("idle", "done"); 
		return; 
	}

	if (!player){
		var pc = this.greet_queue[0];

		// Check for people stuck in the greet queue:
		if (pc.location != this.container || !apiIsPlayerOnline(pc.tsid)) { 
			// player not here - remove them from the queue and try again
			this.greet_queue.shift();
			this.logDebugInfo(" removed player from greet_queue - new queue is "+this.greet_queue);
			this.moveToPlayer();
			return;
		}
	}
	else {
		var pc = player;

		if (pc.location != this.container || !apiIsPlayerOnline(pc.tsid)) { 
			this.logDebugInfo(" can't move to player "+player);
			this.stateChange("idle", "done");
			return;
		}	
	}

	var state = this.getCurrentState();

	this.ai_debug_display("Moving to player "+pc.label);
	this.logDebugInfo(" moving to player "+pc.label);

	this.fullStop(); // cancels all timers which might be starting conflicting movement

	this.chooseWalk();

	if (Math.abs(this.x - pc.x) < 30) { 

		if (state == "greeting") {
			this.logDebugInfo(" near player");
			this.greetPlayer();
		}
		else if (state == "approach") {
			this.stateChange("idle", "done");

			if (this.summoner) {
				this.sendIM(this.summoner, this.getShortGreeting());
			}
		}
		else if (this.callback) {
			this.callback(this.summoner);
		}
	}
	else {
		// Note: directions appear to be backwards
		if (this.x < pc.x) { 
			this.dir = "left";
		}
		else {
			this.dir = "right";
		}
	 
		this.logDebugInfo(" starting to follow ");
		var result = this.apiWalkAndFollowPlayer(pc, 200, false, "onFollow");

		if (!result && state == "greeting") {
			// bad player somehow got stuck in the greet queue, throw it out
			this.greet_queue.shift(); 
			this.moveToPlayer(); // start over
		}
		else if (!result) {
			// can't get to player who is calling
			this.logDebugInfo(" failed to get path "+pc);
		}
		else if (result) {
			this.playAnim(this['!walk_anim'], true);
		}

		this.logDebugInfo(" follow result was "+result);
	}
}

function oldGiftReturn(pc){ // defined by bag_butler
	if (this.old_gift && (this.old_gift["class"] != stack.class_id) && (this.old_gift["count"] > 0)) {
		var old_stack = this.removeItemStackClassExact(this.old_gift["class"], this.old_gift["count"]);

		var remainder = pc.addItemStack(old_stack);
		if (remainder > 0) { 
			log.info(this.getLabel()+" didn't give player "+old_stack);
			pc.location.apiPutStackIntoPosition(old_stack, remainder, pc.x, pc.y);
		}
	}
}

function onAttending(){ // defined by bag_butler
	//log.info(this.getLabel()+" attending");

		if (this.shouldReturnToBase()) { 
			this.stateChange("return_to_base", "start");
		}
		else if (this.getNumPlayersInRange(50) > 0) {
			//log.info(this.getLabel()+" got players in range 50");

			var collision_infos = this.collisions ? this.collisions.list : [];
			for (var c in collision_infos) {
				var diff = Math.abs(collision_infos[c]["time"] - getTime())
			
				log.info(this.getLabel()+" checking collision, time diff is "+diff+" "+collision_infos[c]);
				log.info(this.getLabel()+" substate is "+this['!sub_state']);
				if ( diff > 3000) {
					var pc = collision_infos[c]["player"];
					var playerDist = Math.abs(pc.x - this.x);

					if ( playerDist <= this.getClassProp("at_dist") 
					  && this.canPlayAnim("stepBack", true)) {
						this.stepBackFromPlayer(pc, pc.x); // does nothing if already stepping
						break;
					}

					var diff =  Math.abs(getTime() - this['!speak_time']);
					if (!this['!speak_time'] || diff > 10000) {
						if (randInt(1,2) < 2) {
							var choice = this.getTextString("stepAwayList"); 
							this.sendBubble(choice);
							this['!speak_time'] = getTime();
						}	
					}
				}
			}
		}
		else if (this.reactionAllowed()) {
			if (this.collsions && this.collsions.list) { 
				delete this.collisions.list;
			}
			
			if (this['!collisions']) { 
				delete this['!collisions'];
			}

			var player = this.getPlayerInRange(this.getClassProp("far_dist"));
			//log.info(this.getLabel()+" attending player "+player);
			
			if (!player) {
				this.stateChange("idle", "done");
			} else if (randInt(1, 3) < 2) { 
				// 50/50 chance of blink or blink+body  motion
				if (randInt(1,2) < 2) {	// 
					this.playAnim("idle3", false);
				}
				else {
					this.playAnim("idle4", false, 2833);
				}
			}
			else {
				this.lookAtPlayer(player);
			}
		}
}

function onConversation(pc, msg){ // defined by bag_butler
	this.logDebugInfo(" onConversation "+msg);

	this.last_command_time = getTime();

	if (msg && /decline-quest/i.exec(msg.choice)) {
		var quest = msg.choice.replace(/decline-quest-/i, "");

		this.logDebugInfo("pc declining quest "+quest);
		pc.startQuest(quest, true, true);

		this.conversation_end(pc, msg);	
	}
	else if (msg && /quest/i.exec(msg.choice)) { 
		this.questConversation(pc, msg);
	}
	else if (msg && msg.choice === "yes") {
		this.conversation_end(pc, msg);

		this.interact_pc = pc;
		this.interact_time = time();
		this.onLeavePackage(pc, this.package_msg);
		//delete this.package_msg;
	}
	else if (msg && msg.choice === "no") {
		//this.conversation_end(pc, msg);
		var choices = [{txt: 'Bye', value: 'bye'}];
		this.conversation_reply(pc, msg, this.getTextString("packageNo", pc), choices, null, null, null, null, true);
		//this.sendBubble(pc, this.getTextString("packageNo", pc)); 
		//this.apiSetTimerX("sendBubble", 1500, pc, this.getTextString("packageNo", pc));
		delete this.package_msg;
	}
	else if (msg && msg.choice === "acceptPackage") {
		this.logDebugInfo(" "+pc+" accepting package");	

		this.conversation_end(pc, msg);
		this.last_command_time = getTime();

		this.giveStack(pc);

		this.logDebugInfo("done giving stack, calling give next package again");
		this.giveNextPackage();
	}
	else if (msg && msg.choice === "acceptPackageBroken") {
		this.logDebugInfo(" "+pc+" accepting package");	
	 
		this.conversation_end(pc, msg);
		this.last_command_time = getTime();

		apiLogAction('BUTLER_PROCESSED_BROKEN_PACKAGE', 'pc='+pc.tsid, 'butler='+this.tsid, 'stack='+this.stack_to_give);

		this.giveStack(pc);
		
		this.logDebugInfo("done giving stack, calling give broken package again");
		this.giveBrokenPackage();
	}
	else if (msg && msg.choice === "acceptMessage") {
		this.logDebugInfo(" "+pc+" accepting message");	

		this.conversation_end(pc, msg);
		this.last_command_time = getTime();

		this.giveStack(pc);

		this.logDebugInfo("done giving stack, calling give next message again");
		this.giveNextMessage();
	}
	else if (msg && msg.choice === "giftYes") {
		this.conversation_end(pc, msg);
		this.last_command_time = getTime();

		this.onLeaveVisitorGift(pc, this.give_msg);
	}
	else if (msg && msg.choice === "giftNo") {
		var choices = [{txt: 'Bye', value: 'bye'}];
		this.conversation_reply(pc, msg, this.getTextString("visitorGiftNo", pc), choices, null, null, null, null, true);
	}
	/*else if (msg && msg.choice === "oldGiftReturn") { 
		this.conversation_end(pc, msg);
		this.last_command_time = getTime();
		
		this.onReturnOldGift(pc);
	}*/
	else if (msg && msg.choice === "gotGift") { 
		this.conversation_end(pc, msg);
		this.last_command_time = getTime();
		
		this.giveGift(pc);
	}
	else if (msg && msg.choice === "packageNoSpace"){ 
		this.conversation_end(pc, msg);
		this.last_command_time = getTime();
	}
	else if (msg && msg.choice === "gotVisitors") {
		this.conversation_end(pc, msg);
		this.last_command_time = getTime();

		if (this.im_visitors) { 
			this.sendIM(pc, this.im_visitors);
			delete this.im_visitors;
		}
	}
	else if (msg && msg.choice === "gotInfo") {
		this.conversation_end(pc, msg);
		this.last_command_time = getTime();
	}
	else if (msg && msg.choice === "changeInfo") {
		this.conversation_end(pc, msg);

		var args = {
			input_label: this.getTextString("infoDialogLabel"),
			input_value: "",
			cancelable: true,
			input_focus: true,
			input_max_chars: 141,
		};

		this.interact_pc = pc;
		this.interact_time = time();
		this.interact_box = "leaveInfo";

		this.askPlayer(pc, 'leaveInfo', 'Visitor Information', args);
	}
	else if (msg && msg.choice === "noChangeInfo") { 
		this.conversation_end(pc, msg);
	}
	else if (msg && msg.choice === "setPostYes") {
		this.target_loc = pc.x;
		//this.state_override = "return_to_base";
		this.conversation_end(pc, msg);
		this.stateChange("return_to_base", "done");
	}
	else if (msg && msg.choice === "setPostNo") {
		this.conversation_end(pc, msg);
	}
	else if (msg && msg.choice === "bye") {
		this.conversation_end(pc, msg);
	}
	else if (msg && msg.choice == "giftFail") {
		this.conversation_end(pc, msg);
	}
	else if (msg && msg.choice === "intro") {
		this.conversation_end(pc, msg);
	}
	else if (msg && msg.choice == "convo") {
		this.continueConvo(pc);
	}
	else if (msg && msg.choice == "convoDone") {
		this.conversation_end(pc, msg);
		this.stateChange("idle", "done");
	}
	else if (msg && msg.choice === "nameSuccess") {
		this.conversation_end(pc, msg);
		//this.stateChange("idle", "done");
	}
	else if (msg && msg.choice === "confirm") { 
		this.logDebugInfo(" "+pc+" confirming package/message receipt");	

		this.conversation_end(pc, msg);

		if (this.isOwnerHere()) { 
			var txt = this.getPackagesAndMessagesForOwner(this.getOwner());
			if (txt.length > 0) {
				this.sendBubbleAndChat(this.getOwner(), txt, true, 0, true);
			}
		} 
	}
	else if (msg && msg.choice === "packagefail") {
		this.conversation_end(pc, msg);
	}
	else if (this.conversation) {
		this.handleConversation(pc, msg);
	}
}

function onConversationEnding(pc){ // defined by bag_butler
	var current_anim = this.getCurrentAnim();
	//log.info(this.getLabel()+" onConversationEnding, anim state is "+this.state+" and anim should be "+current_anim);
	//this.apiSetTimerX("stateChange", 5*1000, "moving"); // always wait a few seconds 

	// Prevent getting stuck in acknowledge anim by forcing current anim to end.
	this.endAnim("idle0", true);

	this.setSpeakTime();
	this.stateChange("idle", "done");

	this.giveStack(pc);

	this.conversationalist = null;
}

function onConversationReply(pc){ // defined by bag_butler

}

function onConversationStarting(pc){ // defined by bag_butler
	this.logDebugInfo(" onConversationStarting");

	this.fullStop();

	this.stateChange("interacting", "start");
	this.conversationalist = pc;
}

function onCreate(){ // defined by bag_butler
	this.initInstanceProps();
	this.parent_onCreate();

	this.is_nameable = true;

	this.npc_can_walk = true;
	this.npc_can_climb = false;
	this.npc_can_jump = true;
	this.npc_can_fall = true;

	this.npc_walk_speed = 75;
	this.npc_climb_speed = 25;
	this.npc_jump_height = 10;
	//this.npc_can_fall = 0;

	this.dir = "right";

	this.last_owner_visit = current_gametime();

	this.is_pack = 0;
	this.capacity = parseInt(this.getClassProp("capacity")) + 2; // add 1 for gifts to visitors and 1 to handle accepting a new gift before giving the old one back.

	this.apiAddHitBox("at", 50, 300); // narrower than the default hitbox for increased responsiveness

	var near = this.getClassProp('near_dist');
	this.apiAddHitBox("near", near, 300);

	var far = this.getClassProp('far_dist');
	this.apiAddHitBox("far", far, 300);

	this.setInstanceProp("min_look_time", randInt(6, 9) * 1000);

	this['!anim_state'] = {state:"idle0", loop:"true", time:null};
	this['!walk_anim'] = "walk4";

	this.playAnim("idle0", true);
	this['!behavior_state'] = "idle";

	// Don't use the moving state because this gets called before the container is set so it will crash
	//this.stateChange("idle", "start"); 
	//this.apiSetTimer("onUpdate", 1000);
}

function onFollow(args){ // defined by bag_butler
	//log.info("Butler got follow status "+args.status);

	this.last_command_time = getTime();


	var anim = this.getCurrentAnim();
	if (anim != "walk1" && anim != "walk2" && anim != "walk3") {
		//log.error(this.getLabel()+" got anim state "+anim+" in onFollow with status "+args.status);
	}

	if (args.status == 4 || args.status == 3) {
		var state = this.getCurrentState();
		this.logDebugInfo(" done following with current state "+state);
		if (state == "greeting") { 
			// got to the player, greet them
			this.greetPlayer();
		}
		else if (state == "approach") {
			if (this.summoner) {
				this.sendIM(this.summoner, this.getShortGreeting());
				this.summoner = null;
			}
			this.logDebugInfo(" changing to idle");
			this.setSpeakTime(); // prevent the butler from saying something.
			this.stateChange("idle", "done");
		}
		else if (state == "approachAndSpeak") {
			this.sendBubbleAndChat(this.most_recent_notification, this.getTextString("tellMessage", this.most_recent_notification, this.getOwner())); 
			delete this.speech;
			this.logDebugInfo(" changing to idle");
			this.setSpeakTime();
			this.stateChange("idle", "done");
		}
		else if (this.callback) {
			this.callback(this.summoner);
		}
	}
	else if (args.status == 2 || args.status == 5 || args.status == 6) { 
		this.logDebugInfo(" changing to idle");
		this.fullStop();
		this.onIdle();
	}
	else if (args.status == 1) { 
		// NOTE: directions seem to be backwards
		if (args.dir == 'right'){
			this.dir = 'left';
		}
		if (args.dir == 'left'){
			this.dir = 'right';
		}
	}
}

function onIdle(){ // defined by bag_butler
	// Note: this gets called once per second from onUpdate
	this.fullStop();

	var diff = Math.abs(getTime() - this.last_command_time)

	if (this.shouldReturnToBase()) { 
		this.stateChange("return_to_base");
	}
	else if (!this.muted && this.canSpeak(5 * 1000 * 60) && (diff > 2 * 1000 * 60) ) { // a minimum of 5 minutes time gap
		var txt = (!this.idle_comments) ? this.getTextString("defaultIdleComment") : choose_one(this.idle_comments);

		if (config.is_dev){
			var owner = this.getOwner();
			if (!owner.buddies_count() && is_chance(0.2)){
				txt = this.getTextString("addFriendComment");
			}
			else if (owner.stats_get_level() >= 18 && !owner.getTower() && is_chance(0.2)){
				txt = this.getTextString("buildTowerComment");
			}
		}
		else if (isZilloween() && is_chance(.2)) { 
			txt = this.getTextString("zilloweenIdleComment");
		}

		this.setSpeakTime();
		this.sendBubbleAndChat(null, txt, false, 3400);

		this.playAnim("talk", false, 3400);

		if (this.timer < 4000) { this.timer += 3500; }
	}
	else if (this.reactionAllowed()) { 

		this.logDebugInfo("IDLE diff is "+diff);

		if (diff > 5000) { 

			// Animate, for interest.
			var chance = randInt(1, 10);

			if (chance < 3) { 
				if (randInt(1, 2) < 2) { 
					this.logDebugInfo("IDLE playing idle 2");
					if (this.timer < 3700) { this.timer += 3700; } 
					this.playAnim("idle2", false, 3667);
				}
				else { 
					this.logDebugInfo("IDLE playing idle 1");
					if (this.timer < 5150) { this.timer += 5150; }
					this.playAnim("idle1", false, 5133);
				}
			}
			else if (chance > 5) {
				if (chance > 8) {
					this.logDebugInfo("IDLE playing idle 3");
					this.playAnim("idle3", false);
				}
				else {
					this.logDebugInfo("IDLE playing idle 4");
					this.playAnim("idle4", false, 2833);
				}
			}
		}
	}
}

function onIMRecv(pc, msg){ // defined by bag_butler
	//log.info(this.getLabel()+" cancelling endGreeting call");
	this.apiCancelTimer("endGreeting");

	this.last_command_time = getTime();

	if (!this.waiting_for_response) { 
		this.waiting_for_response = apiNewOwnedDC(this); 
		this.waiting_for_response.list = {};
	}

	this.doCommand(pc, msg.txt);
}

function onInputBoxResponse(pc, uid, value){ // defined by bag_butler
	if (uid === "package_message" && value) {
		this.takeMessage(pc, value, true);
		delete this.interact_pc;
		return true;
	}
	else if (uid === "package_message") {
		delete this.package_msg;
		this.confirmPackageReceipt(pc);
		delete this.interact_pc;
		return false;
	}
	else if (uid === "message" && value) { 
		this.takeMessage(pc, value, false);
		delete this.interact_pc;
		return true;
	}
	else if (uid === "name" && value) {
		this.onName(pc, value);
		delete this.interact_pc;
		return true;
	}
	else if (uid === "leaveInfo" && value) { 
		this.onTeach(pc, value, 'info');
		delete this.interact_pc; 
		return true;
	}

	this.logDebugInfo("onInputBoxResponse "+uid+" "+value);

	delete this.interact_pc;

	return false;
}

function onInteractionEnding(pc){ // defined by bag_butler
	//log.info("Butler interaction ending");
	this.parent_onInteractionEnding(pc);

	//this.timer = 5000;
	//this.stateChange("waiting", "done");
	//this.stateChange('moving', "done");

	this.last_command_time = getTime();

	if (pc === this.interact_pc) { 
		this.logDebugInfo(" onInteractionEnding");
		delete this.interact_pc; 
	}

	if (!this.interact_pc) {
		this.stateChange("idle", "done");
	}
}

function onInteractionStarting(pc, mouseInteraction){ // defined by bag_butler
	this.fullStop();
	this.playAnim("idle0");

	if (this.reactionAllowed()) {
		this.doClickAnim(randInt(0, 2));
	}

	this.parent_onInteractionStarting(pc, mouseInteraction);

	this.stateChange('interacting', "start");
}

function onLeaveMessage(pc){ // defined by bag_butler
	var args = {
		input_label: 'What is your message?',
		cancelable: true,
		input_focus: true,
		input_max_chars: 431,
		//itemstack_tsid: this.tsid,
		//follow:true
	};


	this.facePlayer(pc);
	this.fullStop();
	this.askPlayer(pc, 'message', 'Leave message', args);

	this.interact_box = "message";

	this.stateChange("interacting");
}

function onLeavePackage(pc, msg){ // defined by bag_butler
	//log.info("Butler msg is "+msg);
		
	var count = msg.target_item_class_count;

	var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, count);
	if (!stack) return false;

	//log.info("Butler taking stack "+stack);
	apiLogAction('BUTLER_LEAVE_PACKAGE', 'pc='+pc.tsid, 'butler='+this.tsid, 'class='+stack.class_id, 'count='+count);

	if (!this.packages) { 
		this.packages = apiNewOwnedDC(this);
		this.packages.list = {};
	}

	if (!this.packages.list[pc.tsid]) { 
		this.packages.list[pc.tsid] = [];
	}
		
	var gift = {};
	gift.stack_tsid = stack.tsid;
	gift.class_id = stack.class_id
	gift.count = count;
	gift.time = current_gametime();

	// Feats - only increment if the player hasn't already left a package with this butler.
	if (this.packages.list[pc.tsid].length == 0) {
		pc.feats_increment('visiting_stones', 2);
	}

	this.packages.list[pc.tsid].unshift(gift);
	this.packages.utime = time(); // hacky fix for lost data - marks the DC as dirty

	this.package_msg.target_itemstack_tsid = stack.tsid; // this will be stored with the message

	var stackCount = stack.count;

	this.addItemStack(stack);

	msg.count = msg.target_item_class_count;
	if (stack.onGive) stack.onGive(pc, msg);

	if (stackCount < count) { 
		var remainder = pc.removeItemStackClassExact(stack.class_tsid, count - stack.count);

		if (remainder) { 
			this.addItemStack(remainder);
		}
	}

	var owner = this.getOwner();
	var label = this.getTextString("packageSuccess", pc, owner);
	var args = {
		input_label: label,
		cancelable: true,
		input_focus: true,
		input_max_chars: 431
	};

	this.askPlayer(pc, 'package_message', '', args);

	this.interact_box = "package_message";

	this.facePlayer(pc);
	this.fullStop();

	this.stateChange("interacting");
	return true;
}

function onLeaveVisitorGift(pc, msg){ // defined by bag_butler
	var num = msg.target_item_class_count;

	var stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, num);
	if (!stack) return false;

	this.logDebugInfo("onleavevisitorgift num is "+num+" and stack is "+stack+" "+stack.count);
	this.logDebugInfo(" currently have "+this.gift_item+" and stackmax is "+stack.stackmax);

	//this.logDebugInfo(" taking stack "+stack);
	apiLogAction('BUTLER_GIVE', 'pc='+pc.tsid, 'butler='+this.tsid, 'class='+stack.class_id, 'count='+num);

	if (!this.gifts) { 
		this.gifts=  {};
	}

	if (this.gift_item) {
		this.old_gift = this.gift_item;
	}

	this.gift_item = { 
		"class": stack.class_id, 
		"count": num
	};

	delete this.gift_notification;

	//this.sendIM(pc, this.getTextString("visitorGiftYes", pc, pc));

	var max = stack.stackmax;
	var rem = num - stack.count;
	this.logDebugInfo("rem is "+rem);

	this.addItemStack(stack);
	this.logDebugInfo(" added stack");

	if (rem > 0) { 
		this.logDebugInfo("getting remainder "+num+" "+stack.count+" "+rem);
		var remainder = pc.removeItemStackClassExact(stack.class_tsid, rem);

		this.logDebugInfo("remainder is "+remainder+" "+remainder.count);

		if (remainder) { 
			this.addItemStack(remainder);
		}
	}

	if (this.old_gift && this.old_gift["class"] == stack.class_id && ((num + this.old_gift["count"]) <= max) ) {
		this.gift_item["count"] = this.gift_item["count"] + this.old_gift["count"];
		this.logDebugInfo(" added old item amount "+this.gift_item);
	}
	else if (this.old_gift) { 
		this.logDebugInfo("returning old gift, "+this.old_gift);

		this.apiSetTimerX("onReturnOldGift", 1000, pc);

		this.interact_time = time();
		this.returning_old_gift = true;
	}


	if (this.gift_item["count"] > 1) { 
		var txt = this.getTextString("visitorGiftAcceptPlural", pc, pc);
	}
	else {
		var txt = this.getTextString("visitorGiftAccept", pc, pc);
	}
	this.apiSetTimerX("sendBubbleAndChat", 1200, pc, txt, true, 3000, false);
}

function onLoad(){ // defined by bag_butler
	if (!this.intro_end_time) {
		this.intro_end_time = time(); // make sure existing butlers have this value set
	}
}

function onName(pc, txt){ // defined by bag_butler
	var previous_name = this.user_name;

	var matchTag = /<(?:.|\s)*?>/g;
	txt = txt.replace(matchTag, "");

	this.user_name = txt;
	this.pc_namer = pc.tsid;
	this.named_on = time();

	if (txt.length > 19) { 
		this.user_name = txt.slice(0, 19);
		var convo = this.getTextString("nameShortened", pc);
	}
	else {
		var convo = this.getTextString("nameSuccess", pc);
	}

	var conversation = [ { txt: convo, choices: [{txt:"ok", value:"nameSuccess"}] }];

	this.convo_step = 0;

	this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
		


	apiLogAction('BUTLER_NAME', 'pc='+pc.tsid, 'butler='+this.tsid, 'name='+txt);

	//this.timer = 5000;
	//this.stateChange("waiting", "done");


	return true;
}

function onPathing(args){ // defined by bag_butler
	var anim = this.getCurrentAnim();
	if (anim != "walk1" && anim != "walk2" && anim != "walk3" && anim != "walk4") {
		//log.error(this.getLabel()+" got anim state "+anim+" in onPathing with status "+args.status);
	}

	var state = this.getCurrentState();

	if (args.status == 3 || args.status == 4){
		this.chooseWalk();

		if (state == "move_away") {
			this.logDebugInfo(" got status 3 or 4, location is "+this.x);
			this.stateChange("attending", "done");
			return;
		}

		this.ai_debug_display("Done pathing");
		this.logDebugInfo(" got status 3 or 4, location is "+this.x);

		this.stateChange("idle", "done");
	}
	if (args.status == 1){
		// NOTE: directions are backwards
		if (args.dir == 'right'){
			//this.playAnim(this['!walk_anim'], true);
			this.dir = 'left';
		}
		if (args.dir == 'left'){
			//this.playAnim(this['!walk_anim'], true);
			this.dir = 'right';
		}
		this.logDebugInfo(" changed direction to "+this.dir);
	}
}

function onPlayerCollision(pc, hitbox){ // defined by bag_butler
	this.ai_debug_display("Hitbox "+hitbox);
	var state = this.getCurrentState();

	if (!hitbox) {
		// default hitbox has no name, so this is an actual collision
		//log.info(this.getLabel()+" bumped player, looking at player");
		//this.lookAtPlayer(pc);
	}
	else if (hitbox == "near") {
		this.logDebugInfo("player entering near");
		
		if (this.giftCanGive(pc)) { 
			if (!this.gift_notification) { 
				this.gift_notification = {};
			} 

			if (!this.gift_notification[pc.tsid]) {
				var gift = true;
				this.gift_notification[pc.tsid] = getTime();

				this.sendBubbleAndChat(pc, this.getTextString("giftItemAnnounce", pc, this.getOwner()), true, 5000);
			}
		}

		if (state === "interacting" || state === 'greeting' || state === 'escorting' || state === 'dancing' || state === 'speaking' || state === 'approach' || state == "approachAndSpeak" || state === 'walkleft' || state === 'walkright') {
			this.logDebugInfo("state is "+state);
			return;
		}
		else { 
			this.onPlayerNear(pc);

			if (!gift && (pc == this.getOwner())) {
				this.logDebugInfo("Checking quests & hints");

				// First check if owner needs to complete the Join Club quest
				
				this.logDebugInfo("doing convo for "+pc);
				var result = this.doConvo(pc);

				this.logDebugInfo("result is "+result);

				if (!result) {
					this.logDebugInfo("giving hint");
					if (!this.hints_off){
						this.giveHint(pc);
					}
				}
				
			}
		}
	}
	else if (hitbox == "far") {
		this.onPlayerFar(pc);

		if (!gift && (pc == this.getOwner())) {
			this.doQuests(pc);	
		}

		// At least 10s on this street - same criteria used in inc_conversations
		var now = time();
		if ((now - pc.stats_get_last_street_visit(pc.location.tsid)) > 10) { 
			this.sayHi(pc);
		}

	}
	else if (hitbox == "at") {
		// player is right in front of the butler
		//log.info(this.getLabel()+" got hitbox "+hitbox);
		
		var collision_info = { 'time': getTime(), 'player': pc, 'position': pc.x };

		if (!this.collisions) { this.collisions = apiNewOwnedDC(this); this.collisions.list = {}; }
		this.collisions.list[pc.tsid] = collision_info;
	}
	else {
		log.error("Butler got unknown hitbox name "+hitbox);
	}
}

function onPlayerEnter(pc){ // defined by bag_butler
	this.ai_debug_display("Somebody entered my level!");
	log.info(this+" Somebody entered my level "+pc);

	this.setSpeakTime(); // Prevent the butler from speaking right away

	this.logDebugInfo(" somebody entered my level "+pc);

	if (config.is_dev) { 
		if (this.visitors) { 
			this.logDebugInfo(" visitors list is array? "+is_array(this.visitors.list));
		}

		this.displayMessagesAndPackages();
	}

	// Fix any bad data hanging around.
	this.fixButler();

	if (config.is_dev) { 
		this.logDebugInfo(" after fixing data");
		this.displayMessagesAndPackages();
	}

	// Keep visitors data from getting ridiculously big by tossing out old timestamps.
	this.clearAllOldVisitors();

	// Reschedule update if we had stopped updating
	if (!this.container.activePlayers || num_keys(this.container.activePlayers) <= 1) {
		this.apiSetTimer("onUpdate", 1000);
	}
	else if (!this.apiTimerExists("onUpdate") && (num_keys(this.container.activePlayers) > 0)) {
		this.apiSetTimer("onUpdate", 1000);
	}
	else {
		this.logDebugInfo(" more than one active player");
	}

	// Check if the player appeared very close by - if so, step back from them
	if (Math.abs(pc.x - this.x) < 100) { 
		// Note: there is a delay before starting the greet state, so we should have time to 
		// step back before playing the bow.
		this.stepBackFromPlayer(pc, pc.x);
	}

	if (!this.visitors) { this.visitors = apiNewOwnedDC(this); this.visitors.list = []; }

	if (!this.greet_queue) { this.greet_queue = []; }

	if (this.greet_queue.some(function(element, index, array){return element == pc;})) {
		if (this.getCurrentState() == "greeting") {
			// player is already in the greet queue, don't greet them twice!
			// Note: I have no idea how it happens, but apparently it does because 
			// Scott's butler had him in the greet queue like 30 times.
			this.logDebugInfo(" bailing on greet, pc came from "+pc.last_location);
			return;
		}
		else {
			// Somehow we got out of the greet state with this player still in the greet 
			// queue. Restart the greeting.
			this.stateChange("greeting", "start");
			return;
		}
	}

	var notOwner = (pc.tsid != this.getInstanceProp("owner_tsid"));
	if (notOwner) {
		if (!this.visitors.list) { 
			this.visitors.list = {};
		}

		if (!this.visitors.list[pc.tsid]){
			this.visitors.list[pc.tsid] = [];
		}
		
		this.logDebugInfo("got visitor, adding to visitors list");

		var t = getTime();
		log.info(this+" adding "+pc+" to visitors list "+t);

		var length = this.visitors.list[pc.tsid].length;

		var new_length = (this.visitors.list[pc.tsid]).push(t);
		this.visitors.utime = time(); // hacky fix for lost data - marks the DC as dirty
		
		if (new_length <= length) { 
			log.error(this+" failed to store visitors data for "+pc+" at "+t+" length is "+length+" and new_length is "+new_length);
			this.visitors.list[pc.tsid] = [];
			new_length = (this.visitors.list[pc.tsid]).push(t);
			
			if (new_length <= length) {
				log.error(this+" deleted data and tried again, still failed :(");
			}
		}
		/*else { 
			log.info(this+" stored visitors info for "+pc+" at "+t+" with length "+length+" and new_length "+new_length);
		}*/	


	}
	else {
		this.logDebugInfo("got owner");
		log.info(this+" setting timestamp for owner");

		this.last_owner_visit = current_gametime();

		if (pc.quests_get_flag("join_club", "instance_exit_via_signpost")) {
			if (Math.abs(pc.x - this.x) < 600) {
				this.logDebugInfo("doing quests on entry"); 
				this.doQuests(pc);
			}
			else {
				this.logDebugInfo("prompting user for quest end");
				var txt = this.getTextString("joinClubReturn", pc, pc);
				this.sendBubbleAndChat(pc, txt, true, 0, false);
			}
		}

		txt = this.getPackagesAndMessagesForOwner(pc);
		if (txt.length > 0) {
			this.sendBubbleAndChat(pc, txt, true, 0, true);
		} 
	}

	var old_loc = pc.last_location;

	var owner = this.getOwner();

	this.most_recent_notification = pc;

	if (notOwner && !this.isOwnerHome() && owner.isOnline()) {
		if (this.notifications === true || this.notifications == undefined) { 
			var text = this.getTextString("visitorNotifyOwnerHere", pc, owner);

			if (!this.notification_time 
			  || ((getTime()-this.notification_time) > 10 * 60 * 1000)) {
				text += this.getTextString("clickHelpAddition", pc, pc);
			}
		
			/*if (this.getInstanceProp("owner_tsid") == "PUV1D62CP6D2M64") {
				log.info(this+" notifying Cleops about a visitor "+text+" at "+this.notification_time);
			}*/

			this.sendIM(owner, text); 
			this.notification_time = getTime();
		}
	}
	else if (notOwner && owner.isOnline() && (this.ownerInsideHouse() || this.isOwnerInTower())) {
		this.logDebugInfo("owner getting notification");
			
		if (this.notifications === true || this.notifications == undefined) { 
			var text = this.getTextString("visitorNotifyOwnerHere", pc, owner);

			if (!this.notification_time 
			  || ((getTime()-this.notification_time) > 10 * 60 * 1000)) {
				text += this.getTextString("clickHelpAddition", pc, pc);
			}

			/*if (this.getInstanceProp("owner_tsid") == "PUV1D62CP6D2M64") {
				log.info(this+" notifying Cleops about a visitor "+text+" at "+this.notification_time);
			}*/

			this.sendIM(owner, text); 
			this.notification_time = getTime();
		}	
	}
}

function onPlayerExit(pc){ // defined by bag_butler
	var owner = this.getOwner();

	this.logDebugInfo(this.getLabel()+" player "+pc.label+" leaving, state is "+this.getCurrentState()+" greet_queue "+this.greet_queue);

	if (config.is_dev) { 
		this.displayMessagesAndPackages();
	}

	if (this.getCurrentState() === "greeting") {
		this.logDebugInfo(this.getLabel()+" checking greeting");
		var player = this.greet_queue[0];

		if (pc === player) {
			this.cancelGreeting();
		}
	}

	if (pc == this.hi_target) { 
		this.apiCancelTimer("doSayHi");
		this.apiCancelTimer("sayHiHint");
		this.apiCancelTimer("doHiResponse");
		this.apiCancelTimer("doHiEmoteBonusWithOtherPlayer");

		delete this.hi_target;
	}

	if (pc === this.most_recent_notification) {
		delete this.most_recent_notification;
	}

	if (pc === this.summoner) { 
		delete this.summoner;
	}

	if (pc === this.conversationalist) { 
		delete this.conversationalist;

		if (this.getCurrentState() === "interacting") { 
			this.stateChange("idle", "done");
		}
	}

	if (this.gift_no_space && this.gift_no_space[pc.tsid]) {
		delete this.gift_no_space[pc.tsid];
	}

	if (this.gift_notification && this.gift_notification[pc.tsid]) { 
		delete this.gift_notification[pc.tsid];
	}

	if (this.eavesdropping_notifications && this.eavesdropping_notifications[pc.tsid]) { 
		delete this.eavesdropping_notifications[pc.tsid];
	}

	if (pc === this.interact_pc) { 
		delete this.interact_pc;

		if (this.getCurrentState() === "interacting") { 
			this.stateChange("idle", "done");
		}
	}

	if (pc === owner && this.returning_old_gift) { 
		this.onReturnOldGift(pc);
	}

	// ***
	this.giveStack(pc); // this will check if the pc is the owner

	if (this.last_chat && this.last_chat.pc === pc) { 
		log.info(this.getLabel()+" deleting "+this.last_chat);
		delete this.last_chat;
	}

	if (this['!lookTarget'] && (this['!lookTarget'].player === pc)) {
		this['!lookTarget'] = null;
	}

	//var choice = this.getTextString("goodbyeList", pc, null, null, null, null, pc); 

	// This doesn't work - the location doesn't get set until after this is called.  Was trying to 
	// avoid saying goodbye when player goes inside the house.
	//var new_loc = pc.location;

	//this.sendIM(pc, choice);


	// *** Took this out since people were complaining about losing information
	//if (!this.closing) { this.closing = []; }
	//this.closing.push(pc.tsid);

	// clear collision data
	if (this.collisions && this.collisions.list)  {
		var collision_infos = this.collisions.list;
		for (var c in collision_infos) {
			if (pc == collision_infos[c]["player"]) {
				delete this.collisions.list[c];
			}
		}
	}


	if (pc != owner && !this.isOwnerHome() && owner.isOnline()) {
		if (this.notifications === true || this.notifications == undefined) { 
			this.sendIM(owner, this.getTextString("visitorNotifyOwnerLeft", pc, owner)); 
			this.notification_time = getTime();
		}
	}
	else if (pc != owner && owner.isOnline() && (this.ownerInsideHouse() || this.isOwnerInTower())) {
		if (this.notifications === true || this.notifications == undefined) { 
			this.sendIM(owner, this.getTextString("visitorNotifyOwnerLeft", pc, owner)); 
			this.notification_time = getTime();
		}
	}



	if (config.is_dev) { 
		this.logDebugInfo("at end of onPlayerExit");
		this.displayMessagesAndPackages();
	}
	//this.apiSetTimerX("im_close", 15 * 1000, pc);
}

function onPlayerFar(pc){ // defined by bag_butler
	// Don't change to wave/attending if the butler is already approaching the player
	// (which is kind of a shame, because it's cool if the butler waves while approaching you, but 
	// it looks slidey)

	if (this.reactionAllowed()) {
		if (this.isFacing(pc)) {
			this.playAnim("wave", false, 1733);
		}

		this.apiSetTimerX("stateChange", 2500, "attending", "start");
		//this.stateChange("attending", "start");
	}
}

function onPlayerLeavingCollisionArea(pc, hitbox){ // defined by bag_butler
	this.ai_debug_display("Ending collision "+hitbox);
	if (!hitbox){
		// default hitbox
	}
	else if (hitbox == "at") {
		//log.info(this.getLabel()+" bumped player, (exit) looking at player");
		
		if (this.apiTimerExists("stepBackFromPlayer")) {
			this.apiCancelTimer("stepBackFromPlayer");
		}

		if (this.collisions && this.collisions.list[pc.tsid]) {
			delete this.collisions.list[pc.tsid];
		}

		this.lookAtPlayer(pc);
	}
	else if (hitbox == "near") {
		//log.info(this.getLabel()+" looking at player (leaving near)");
		// butler looks at player if not already
		this.lookAtPlayer(pc);
	}
	else if (hitbox == "far") {
		var range = this.getClassProp("far_dist");
		var numPlayers = this.getNumPlayersInRange(range);
		this.logDebugInfo(" player leaving far, num players is "+numPlayers);
		if ( numPlayers == 0 || (numPlayers == 1 && this.getPlayerInRange(range) == pc)) {
			this.logDebugInfo(" IDLE player leaving far");
			// butler reverts to normal behaviour
			if (this.getCurrentAnim() == "turnBack"){
				this.playAnim("turnFront");
			
				if (this.getCurrentState() == "attending") {
					this.apiSetTimerX("stateChange", 300, "idle", "done");
				}
			}
			else if (this.getCurrentState() == "attending") {
				this.stateChange("idle", "done");
			}	
		}
	}
	else {
		log.error(this.getLabel()+" got player leaving unknown hitbox "+hitbox);
	}
}

function onPlayerNear(pc){ // defined by bag_butler
	//log.info(this.getLabel()+" got player (near)");

	if (this.reactionAllowed()) {

		//log.info(this.getLabel()+" facing player");
		this.facePlayer(pc);
		//log.info(this.getLabel()+" playing acknowledge");
		this.playAnim("acknowledge", false, 667);
	}
}

function onPrototypeChanged(){ // defined by bag_butler
	this.apiRemoveHitBox("near");
	var near = this.getClassProp('near_dist');
	this.apiAddHitBox("near", near, 300);

	this.apiRemoveHitBox("far");
	var far = this.getClassProp('far_dist');
	this.apiAddHitBox("far", far, 300);

	this.last_hint_time = 0;

	if (!this.intro_end_time) {
		this.intro_end_time = time(); // make sure existing butlers have this value set
	}
}

function onPumpkinRot(tsid, new_class, num){ // defined by bag_butler
	// Stack tsid was converted into num new_class (either 5 pepitas or 1 pumpkin pie)

	var packages = this.packages.list;

	for (var player in packages) { 
		var items = packages[player];

		for (var i in items) {
			if (items[i].stack_tsid == tsid) { 
				// found it
				items[i].class_id = new_class;
				items[i].count = num;
				// leave the tsid alone - we only use it for matching to the message
				this.packages.utime = time();
			}
		}
	}
}

function onRetrieveMessages(pc){ // defined by bag_butler
	this.logDebugInfo(" calling giveNextMessage ");
	apiLogAction('BUTLER_GET_MESSAGES', 'pc='+pc.tsid, 'butler='+this.tsid);

	var txt = this.getTextString("messagesStart", pc, pc);
	var conversation = [ { txt: txt, choices: [{txt:"Thanks!", value:"acceptMessage"}] }];

	this.convo_step = 0;
	this.playTalk();
	this.timer = 4000;
	this.playAnim("talk", false, 3400);

	this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);

	return;
}

function onReturnOldGift(pc){ // defined by bag_butler
	if (this.old_gift && (this.old_gift["count"] > 0)) {
		
		var old_stack = this.removeItemStackClassExact(this.old_gift["class"], this.old_gift["count"]);

		/*if (old_stack && old_stack["count"] > 1) {
			this.sendIM(pc, this.getTextString("visitorGiftReturnPlural", pc));
		}
		else {
			this.sendIM(pc, this.getTextString("visitorGiftReturnSingle", pc));
		}*/

		var remainder = pc.addItemStack(old_stack);
		if (remainder > 0) { 
			log.info(this.getLabel()+" didn't give player "+old_stack);
			pc.location.apiPutStackIntoPosition(old_stack, remainder, pc.x, pc.y);
		}
	}

	this.mergeGifts();

	delete this.old_gift;
	delete this.returning_old_gift;
}

function onStayAway(){ // defined by bag_butler
	var left = this.container.geo.l + 50;
	var right = this.container.geo.r - 50;

	var leftDist = Math.abs(this.x - left);
	var rightDist = Math.abs(this.x - right);


	var target_x = leftDist > rightDist ? right : left; 


	this.logDebugInfo(" - stay away -  this.x is "+this.x+" and target_x is "+target_x);

	this.chooseWalk();

	if (this.playAnim(this['!walk_anim'], true)) { 
		this.apiFindPath(target_x, this.y, 0, "onPathing");
		delete this.walkNotAllowed;
		this.stayingPut = true;
	}
	else { 
		this.walkNotAllowed = true;
	}

	this.ai_debug_display(" moving from "+this.x+" to "+target_x);
}

function onStepping(args){ // defined by bag_butler
	if (args.status == 3 || args.status == 4){
		this.logDebugInfo(" done stepping");
		this.ai_debug_display("Done stepping");
		this['!sub_state'] = "";

		this.playAnim("idle0", true);
		this.fullStop();

		var player = this.getPlayerInRange(300);
		if (player) {
			this.logDebugInfo(" looking at "+player);
			this.lookAtPlayer(player);
		}
	}
	else {
		this.playAnim("stepBack", true);
		this.logDebugInfo(" onStepping status "+args.status);
	}

	if (args.status == 1){
		// NOTE: directions are backwards, but the butler is walking backwards in this case
		if (args.dir === "right"){
			this.dir = "right";
		}
		if (args.dir === "left"){
			this.dir = "left";
		}
	}
}

function onStuck(){ // defined by bag_butler
	this.ai_debug_display("I'm stuck");

	this.logDebugInfo(" is stuck!");
	this.turnAround();
	this.last_command_time = getTime();
	this.stateChange("idle", "done");
}

function onTalkTo(pc, msg){ // defined by bag_butler
	apiLogAction('BUTLER_TALK', 'pc='+pc.tsid, 'butler='+this.tsid);

	if (this.conversationalist === pc) { 
		return true;
	}

	if (this.conversationalist) { 
		this.sendIM(pc, this.getTextString("chatFail"));
		return;
	}

	this.stateChange("interacting", "start");

	if (Math.abs(this.x - pc.x) > 200) {
		this.sendIM(pc, this.getTextString("talkToComing", pc)); 
	}

	this.summoner = pc;
	this.conversationalist = pc;
	this.callback = doTalk;

	this.moveToPlayer(this.summoner);

	return true;
}

function onTeach(pc, txt, type){ // defined by bag_butler
	var phrase_limit = 1;

	apiLogAction('BUTLER_TEACH', 'pc='+pc.tsid, 'butler='+this.tsid, 'type='+type, 'txt='+txt);

	txt = utils.filter_chat(txt); // remove most html tags

	if (type === 'owner_greeting' && txt) { 

		if (!this.owner_greetings) { 
			this.owner_greetings = [];
		}
		else if (this.owner_greetings.length > phrase_limit) {
			// this was to correct existing butlers after adding the phrase limit
			this.owner_greetings = [];
		}
		
		this.owner_greetings.push(txt);
		
		if (this.owner_greetings.length > phrase_limit) {
			this.owner_greetings.shift();
		}

		this.logDebugInfo(" learned the owner greeting "+txt);
		this.sendIM(pc, this.getTextString("teachOwnerSuccess", pc, pc));
		this.timer = 5000;
		this.stateChange("waiting", "done");

		return true;
	}
	else if (type === 'friend_greeting' && txt) { 
		if (!this.friend_greetings) { 
			this.friend_greetings = [];
		}
		else if (this.friend_greetings.length > phrase_limit) {
			// this was to correct existing butlers after adding the phrase limit
			this.friend_greetings = [];
		}
		
		this.friend_greetings.push(txt);

		if (this.friend_greetings.length > phrase_limit) {
			this.friend_greetings.shift();
		}

		this.logDebugInfo(" learned the friend greeting "+txt);
		this.sendIM(pc, this.getTextString("teachFriendSuccess", pc, pc)); 
		this.timer = 5000;
		this.stateChange("waiting", "done");

		return true;
	}
	else if (type === 'stranger_greeting' && txt) { 
		if (!this.stranger_greetings) { 
			this.stranger_greetings = [];
		}
		else if (this.stranger_greetings.length > phrase_limit) {
			// this was to correct existing butlers after adding the phrase limit
			this.stranger_greetings = [];
		}
		
		this.stranger_greetings.push(txt);

		if (this.stranger_greetings.length > phrase_limit) {
			this.stranger_greetings.shift();
		}

		this.logDebugInfo(" learned the stranger greeting "+txt);
		this.sendIM(pc, this.getTextString("teachStrangerSuccess", pc, pc)); 
		this.timer = 5000;
		this.stateChange("waiting", "done");

		return true;
	}
	else if (type === 'idle_comment' && txt) { 
		if (!this.idle_comments) { 
			this.idle_comments = [];
		}
		else if (this.idle_comments.length > phrase_limit) {
			// this was to correct existing butlers after adding the phrase limit
			this.idle_comments = []; 
		}
		
		this.idle_comments.push(txt);

		if (this.idle_comments.length > phrase_limit) {
			this.idle_comments.shift();
		}

		this.logDebugInfo(" learned the idle comment "+txt);
		this.sendIM(pc, this.getTextString("teachIdleSuccess", pc, pc)); 
		this.timer = 5000;
		this.stateChange("waiting", "done");

		return true;
	}
	else if (type === 'info' && txt) { 
		if (!this.info) {
			this.info = [];
		}
		else if (this.info.length > phrase_limit) { 
			// this was to correct existing butlers after adding the phrase limit
			this.info = [];
		}
		
		this.info.push(txt);

		if (this.info.length > phrase_limit) {
			this.info.shift();
		}

		this.logDebugInfo(" learned info "+txt);
		
		var convo = this.getTextString("teachInfoSuccess", pc);

		var conversation = [ { txt: convo, choices: [{txt:"ok", value:"gotInfo"}] }];

		this.convo_step = 0;

		this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
		

		//this.sendIM(pc, this.getTextString("teachInfoSuccess", pc, pc)); 
		this.timer = 5000;
		this.stateChange("waiting", "done");

		return true;
	}
}

function onUpdate(){ // defined by bag_butler
	// Close any IM windows for players who have left
	// *** Update - took this out since somebody complained about losing information about visitors
	/*if (this.closing){
		for (var p in this.closing) {
			this.logDebugInfo(" closing window for "+this.closing[p]);
			var pc = getPlayer(this.closing[p]);
			this.im_close(pc);
		}

		delete this.closing;
	}*/


	// Nobody in the level, don't update.
	if (this.container.activePlayers && num_keys(this.container.activePlayers) <= 0){
		this.logDebugInfo(" level empty"); 

		if (this.interact_pc) { 
			delete this.interact_pc;
		}

		if (this.collisions && this.collisions.list) { 
			delete this.collisions;
		}

		if (this['!collisions']) { 
			delete this['!collisions'];
		}

		if (this.announce_flag) { 
			delete this.announce_flag;
		}

		return;
	}

	// handle error case:
	if (this.waiting_for_response && this.waiting_for_response.list) {
		var response_list = this.waiting_for_response.list;
		for (var tsid in response_list) {
			var time_since = game_days_since(response_list[tsid].time);
			if ( time_since >= 1) {
				this.logDebugInfo(" deleting waiting "+response_list[tsid]+" time_since is "+time_since);
				delete this.waiting_for_response.list[tsid];
			}
		}
	}

	// To be called once per second while there are players in the level
	this.apiSetTimer("onUpdate", 1000);
	//this.logDebugInfo(" updating, state is "+this.getCurrentState()+" interact_pc is "+this.interact_pc);


	/*if (config.is_dev) { 
		this.displayMessagesAndPackages();
	}*/

	// Check for players going afk with a dialog open and locking the butler for everybody else
	if (this.interact_pc && Math.abs(this.interact_time - time()) > intval(this.getClassProp("timeout"))) {

		this.sendBubbleAndChat(this.interact_pc, this.getTextString("afkResponse", this.interact_pc, owner), true, null, false);

		this.logDebugInfo("interact_pc is "+this.interact_pc+" time is "+this.interact_time+" box is "+this.interact_box);

		if (this.interact_box) { 
			if (this.interact_pc) {
				this.logDebugInfo("canceling box "+this.interact_box);
				this.interact_pc.apiSendMsg({type:'input_cancel', uid:this.interact_box});
			}
		}

		
		this.conversation_cancel(this.interact_pc);
		delete this.interact_pc;
	}

	// Stay near target location
	if (!this.target_loc) { 
		this.target_loc = 660; // to the right of the door
	} 

	// Process current state
	var state = this['!behavior_state'];


	// If the butler was interrupted during a stay_away command, then finish the stay_away
	/*if (this.stayed && state != "stay_away") {

		var left = this.container.geo.l + 50;
		var right = this.container.geo.r - 50;

		this.logDebugInfo(" left diff is "+Math.abs(this.x - left)+" right diff is "+Math.abs(this.x - right));

		if (Math.abs(this.x - left) > 100 && Math.abs(this.x - right) > 100) { 
			this.stateChange("stay_away", "done"); // override whatever the butler was doing
			this.onStayAway();
		}
	}*/


	// Update timer if any
	if (this.timer && this.timer > 0) { 
		this.timer -= 1000; // timer in milliseconds is used by some behaviors
	}

	//log.info(this.getLabel()+" current state is "+state);

	if (!state) { 
		log.info(this.getLabel()+" had no state, changing to idle");
		this.stateChange("idle");
	}

	// The butler's main behavior when not near players is to swap between the idle and moving states.
	if (state == 'idle') {
		if (this.getNumPlayersInRange(0.5 * this.getClassProp('far_dist')) > 0) { 
			this.stateChange("attending", "start");
		}
		else {
			this.onIdle(); 	// butler may say something or do an idle animation periodically

			if (this.timer <= 0) { 
				// Pick a walk anim
				this.chooseWalk();
				if (this.canPlayAnim(this['!walk_anim'], true)) { 
					//log.info(this.getLabel()+" done idling, changing to move with anim state "+this['!anim_state']);
					this.stateChange("moving", "done");
				}
				// if can't change to the walk anim, then stay in idle until done with current idle anim
			}
		}
	}
	else if (state === "moving") { 
		if (this.timer <= 0) { 
			// start idle state
			
			this.stateChange('idle', "done");
		}
	}
	else if (state === "packages") {
		
		var owner = this.getOwner();
		this.last_command_time = getTime();
		
		if (this.getNumPackagesTotal() <= 0) { 
			this.stateChange("attending", "done");
		}

		/*if (this.getNumPackagesTotal() > 0) {
			if (this.timer > 0) {
				return;  // pause between packages / messages
			}

			this.giveNextPackage();
			this.timer = 15000;
		}
		else {
			this.sendIM(owner, this.getTextString("packagesEnd"));

			if (this.getNumMessagesTotal() > 0) {
				this.sendIM(owner, this.getTextString("ownerSuggestMessages", this.getOwner(), owner)); 
				this.waiting_for_response.list[owner.tsid] = {which:"suggestion-messages", pc:this.getOwner(), time:current_gametime()};
			}
			else {
				var numVisitors = this.getUniqueVisitorsToday();
				if (numVisitors > 0) {
					this.sendIM(owner, this.getTextString("ownerSuggestVisitors", owner, owner)); 
					this.waiting_for_response.list[owner.tsid] = {which:"suggestion-visitors", pc:owner, time:current_gametime()};
				}
				else {
					this.sendBubbleAndChat(owner, 	this.getTextString("ownerNoSuggestions")); 				
					this.stateChange("attending", "done");
				}
			}

			this.stateChange('attending', "done");
		}*/
	}
	else if (state === "interacting") { 
		this.last_command_time = getTime();
	}
	else if (state === "greeting") { 

		this.last_command_time = getTime();

		if (this.walkNotAllowed && this.canPlayAnim(this['!walk_anim'], true)) {
			this.moveToPlayer();
			delete this.walkNotAllowed;
		}
	}
	else if (state === "escorting") {
		if (this.walkNotAllowed && this.canPlayAnim(this['!walk_anim'], true)) {
			this.startEscorting();
			delete this.walkNotAllowed;
		}
	}
	else if (state == "approach") {

		this.last_command_time = getTime();

		if (this.walkNotAllowed && this.canPlayAnim(this['!walk_anim'], true)) {
			this.moveToPlayer(this.summoner);
			if (this.textAddition) { 
				this.sendIM(this.summoner, this.getTextString("summonSucceed", this.summoner, owner) + this.textAddition);
				delete this.textAddition;
			}
			else { 
				this.logDebugInfo("got here");
				this.sendIM(this.summoner, this.getTextString("summonSucceed", this.summoner, owner));
			}
			delete this.walkNotAllowed;
		}
		
	}
	else if (state === "approachAndSpeak") {
		if (this.walkNotAllowed && this.canPlayAnim(this['!walk_anim'], true)) {
			this.moveToPlayer(this.most_recent_notification);
			delete this.walkNotAllowed;
		}
		else {
			this.walkNotAllowed = true;
		}
	}
	else if (state === "return_to_base") {
		if (this.walkNotAllowed && this.canPlayAnim(this['!walk_anim'], true)) {
			this.returnToBase(this.most_recent_notification);
			delete this.walkNotAllowed;
		}
		else {
			this.walkNotAllowed = true;
		}
	}
	/*else if (state === "stay_away"){ 
		this.last_command_time = getTime();

		if (!this.stayingPut && this.walkNotAllowed && this.canPlayAnim(this['!walk_anim'], true)) {
			this.onStayAway();
			delete this.walkNotAllowed;
		}
		else if (!this.stayingPut) {
			this.walkNotAllowed = true;
		}
	}*/
	else if (state === "move_away") {

		this.last_command_time = getTime();

		this.logDebugInfo(" walk not allowed is "+this.walkNotAllowed+" and dismisser is "+this.dismisser);
		if (this.walkNotAllowed && this.dismisser && this.canPlayAnim(this['!walk_anim'], true)) {
			//if (this.dismisser) {
				delete this.walkNotAllowed;
				
				this.moveAwayFromPlayer(this.dismisser, true);
				if (this.textAddition) { 
					if (this['!walk_anim'] != "walk3") {
						this.sendIM(this.dismisser, this.getTextString("goAwaySucceed", this.dismisser, owner) + this.textAddition);
					}
					delete this.textAddition;
				}
				else { 
					if (this['!walk_anim'] != "walk3") {
						this.sendIM(this.dismisser, this.getTextString("goAwaySucceed", this.dismisser, owner));
					}
				}
			//}
			//else {
			//	log.error(this.getLabel()+" no dismisser");
			//	this.stateChange("idle", "done");
			//}
			
			delete this.dismisser;
		}
		/*else {
			this.walkNotAllowed = true;
		}*/
	}
	else if (state === "waiting") {

		this.last_command_time = getTime();

		if (this.timer <= 0) { 
			if (this.getNumPlayersInRange(this.getClassProp('far_dist')) > 0) { 
				this.stateChange("attending", "done");
			}
			else { 
				this.stateChange("idle", "done");
			}
		}
	}
	else if (state === "speaking") {

		this.last_command_time = getTime();

		//log.info(this.getLabel()+" in speaking state with timer "+this.timer);
		if (this.timer <= 0) { 
			this.stateChange("idle", "done");
		}
	}
	else if (state === "dancing") { 

		this.last_command_time = getTime();

		//log.info(this.getLabel()+" in dancing with timer "+this.timer);
		if (!this.dance_started ) { 
			if (this.canPlayAnim('danceStart', false)) {
				this.dance_started = true; 
				var secs = randInt(7, 10); 
				this.timer = secs * 1000 + 833;
				//log.info(this.getLabel()+" can dance with timer "+this.timer);
		
				this.playAnim('danceStart', false, 833);
				if (this.textAddition) { 
					this.sendIM(this.danceMaster, this.textAddition);
					delete this.textAddition;
					delete this.danceMaster;
				}
			}
			else { 
				this.dance_started = false;
				//this.sendIM(pc, this.getTextString("waitASec"));
				//log.info(this.getLabel()+" can't dance :(");
			}
		}
		else { 
			//log.info(this.getLabel()+" dancing "+this.timer+" "+this.getCurrentAnim());
			if (this.timer <= 0) {
				this.dance_started = false;

				this.stateChange("idle", "done");
			}
			else if (this.timer <= 4000) {
				
				if (this.getCurrentAnim() === "fastDance") {
					this.playAnim("dance", true);
				}
			}
		}
	}
	else if (state === "attending") {

		this.onAttending();

	}
}

function onVisit(pc){ // defined by bag_butler
	var owner = this.getOwner();

	var isOnline = owner.isOnline();

	apiLogAction('BUTLER_VISIT', 'pc='+pc.tsid, 'butler='+this.tsid, 'owner='+owner.tsid);


	if (!isOnline || !owner.houses_is_at_home()) {
		this.sendIM(pc, this.getTextString("visitOwnerNotHome", pc, owner)); 
		this.waiting_for_response.list[pc.tsid] = {which:"leave_message", pc:pc, time:current_gametime()};
		this.apiSetTimerX("stateChange", 5*1000, "idle");
		return; // don't start escorting
	}


	this.visitor = pc;

	if (!this.stateChange("escorting", "start")){
		this.sendIM(pc, this.getTextString("visitNoCanDo", pc, owner));
		this.visitor = null;
	}
}

function ownerInsideHouse(){ // defined by bag_butler
	var owner = this.getOwner();

	this.logDebugInfo(" owner location is "+owner.location);

	if (owner.isOnline() && owner.home && owner.home.interior && owner.location.tsid == owner.home.interior.tsid) {
		return true;
	}

	return false;
}

function packageCanGive(pc, info){ // defined by bag_butler
	if (pc != this.getOwner()) { return false; }

	if (!info) { return false; } 

	var gift = this.removeItemStackClassExact(info["class_id"], info["count"]);
	if (pc.isBagFull(gift)) { 
		this.addItemStack(gift);
		return "no space";
	}
	this.addItemStack(gift);

	return true;
}

function playAnim(s, l, t){ // defined by bag_butler
	// s is the name of the animation state to play
	// l should be true if looping
	// if NOT looping, provide t = length of an animation in milliseconds

	// Returns true if the butler is playing the requested animation, but does not do the change if 
	// the butler is already in the correct anim.

	if (!this.canPlayAnim(s,l,t)) { return false; }

	var current_anim = this['!anim_state'];

	/*if (current_anim && current_anim.state == s) { 
		return true; 
	}*/

	var new_anim = { 
		state:s,
		loop: (l ? l : false) ,
		time: (t ? t : null)
	};
		
	//this.logDebugInfo( " changing from "+current_anim+" to "+new_anim);
		
	this['!anim_state'] = new_anim;

	this.setAndBroadcastState(new_anim.state);

	//this.logDebugInfo(" now anim is "+this.getCurrentAnim());
	//log.info(this.getLabel()+" canceling timer for "+current_anim);

	this.apiCancelTimer("endAnim");

			
	if (!l) {
		var goto_state = "idle0";
		var goto_loop = true;
		if (new_anim.state === "idle3" || new_anim.state === "idle4") {
			goto_state = current_anim.state;
			goto_loop = false;
		}

		this.playSound(new_anim);

		// Automatically transition back to idle0 when done except for danceStart -> dance
		if (new_anim.state === "danceStart") { 
			//log.info(this.getLabel()+" setting end timer for dance start");
			this.apiSetTimerX("endAnim", 750, "dance", false, this.timer - 750);
		}
		else if (new_anim.state === "turnBack") {
			// do nothing - keep the head turned
		} 
		else if (!t) { 
			this.timer += 333;
			//log.info(this.getLabel()+" adding endAnim timer for "+s);
			this.apiSetTimerX("endAnim", 300, goto_state, goto_loop, null); // idle3 is 9 frames
		}
		else  { 
			this.timer += t;
			//log.info(this.getLabel()+" adding endAnim timer for "+s);
			this.apiSetTimerX("endAnim", t, goto_state, goto_loop, null); 
		}
		/*else { 
			log.info("not setting anim timer for "+new_anim.state+" because in "+this.getCurrentAnim());
		}*/
	}

	return true;
}

function playSound(anim){ // defined by bag_butler
	if (anim === "idle2") {
		this.container.announce_sound_to_all('BUTLER_DOLL_IDLE_2');
	}
	else if (anim === "fall") {
		this.container.announce_sound_to_all('BUTLER_DOLL_FALL');
	}
}

function playTalk(){ // defined by bag_butler
	// Taking this out as it doesn't work too well with the conversations as it is currently used (and 
	// the squeaking is annoying)
	/*var choices = ['BUTLER_DOLL_TALK1', 'BUTLER_DOLL_TALK2', 'BUTLER_DOLL_TALK3', 'BUTLER_DOLL_TALK4', 'BUTLER_DOLL_TALK5', 'BUTLER_DOLL_TALK6', 'BUTLER_DOLL_TALK7', 'BUTLER_DOLL_TALK8'];

	this.container.announce_sound_to_all(choose_one(choices));
	*/
}

function randomize(){ // defined by bag_butler
	// Randomly select a variant for each body part

	var accessories = this.instancePropsChoices["accessory"];
	var bodies = this.instancePropsChoices["bod"];
	var skulls = this.instancePropsChoices["skull"];
	var faces = this.instancePropsChoices["face"];
	var closeArms = this.instancePropsChoices["closeArm"];
	var farArms = this.instancePropsChoices["farArm"];
	var closeLegs = this.instancePropsChoices["closeLeg"];
	var farLegs = this.instancePropsChoices["farLeg"];

	var acc = choose_one(accessories);
	var bod = choose_one(bodies);
	var skull = choose_one(skulls);
	var face = choose_one(faces);
	var cArm = choose_one(closeArms);
	var fArm = choose_one(farArms);
	var cLeg = choose_one(closeLegs);
	var fLeg = choose_one(farLegs);

	this.setInstanceProp("accessory", acc);
	this.setInstanceProp("bod", bod);
	this.setInstanceProp("skull", skull);
	this.setInstanceProp("face", face);
	this.setInstanceProp("closeArm", cArm);
	this.setInstanceProp("farArm", fArm);
	this.setInstanceProp("closeLeg", cLeg);
	this.setInstanceProp("farLeg", fLeg);


	this.config = {
			accessory: acc,
			bod: bod,
			skull: skull,
			face: face,
			closeLeg: cLeg,
			farLeg: fLeg,
			closeArm: cArm,
			farArm: fArm
		};

	this.broadcastConfig();
}

function reactionAllowed(){ // defined by bag_butler
	var state = this.getCurrentState();
	if (state === "interacting" || state === "packages" || state === 'greeting' || state === 'escorting' || state === 'dancing' || state === 'speaking' || state === "approach" ||  state === "approachAndSpeak" || state === "move_away" || state === "walkleft" || state === "walkright" || state === "return_to_base" || state === "stay_away") { 
		//log.info(this.getLabel()+" reaction not allowed because state is "+state);
		return false;
	}

	if (this['!sub_state'] && this['!sub_state'] == 'stepping') {
		//log.info(this.getLabel()+" reaction not allowed because stepping ");
		return false;
	}

	// Only step or etc. if not already in a one-off animation to avoid sliding.
	var anim = this.getCurrentAnim();
	if (anim != "idle0" && anim != "walk3" && anim != "walk4") {
		return false;
	}

	return true;
}

function retrieveMessagesFromGiver(giver){ // defined by bag_butler
	if (!this.messages || !this.messages.list) { return; }

	var txt = "";
	var owner = this.getOwner();

	var list = this.messages.list[giver.tsid];

	if (!list) { return; }

	this.logDebugInfo(" (before) has message list "+list);

	var package_list = [];

	for (var i in list) { 
		//log.info(this.getLabel()+" "+list[i]);
		if (list[i].withPackage && list[i].withPackage != false) {
			package_list.push(list[i]);
			//this.sendIM(owner, this.getTextString("messageFromGiver", giver, owner, null, list[i]));
			delete list[i];
			this.messages.utime = time();
		}
	}

	this.logDebugInfo(" (after) has message list "+list+" and package_list "+package_list);


	if (list.length <= 0) {
		delete this.messages.list[giver.tsid];
		this.messages.utime = time();
	}

	return package_list;
}

function returnToBase(){ // defined by bag_butler
	this.npc_walk_speed = 75;

	this.chooseWalk();

	var target = this.target_loc; 

	var anim = this.getCurrentAnim();

	// First check that we're not in a conflicting animation
	if (anim === "idle0" || anim === "walk3" || anim === "walk4") {
		if (!this.apiFindPath(target, this.y, 0, 'onPathing')){
			this.logDebugInfo(" can't get to base");
			this.onStuck();
		}
		else { 
			// this should not fail if the first check passed
			if (!this.playAnim(this['!walk_anim'], true)) { 
				this.fullStop();
				this.stateChange("idle", "can't play anim");
			}
		}
	}
	else { 
		this.walkNotAllowed = true;

		/*this.fullStop();
		
		// Set command time to prevent idle from switching back to return to base and 
		// looping infinitly
		this.last_command_time = getTime();
		this.stateChange("idle", "can't play anim"); */
	}
}

function sayHi(pc){ // defined by bag_butler
	this.doSayHi(pc);
}

function sendBubbleAndChat(pc, txt, privateMsg, durationMS, noBubble){ // defined by bag_butler
	this.last_command_time = getTime();


	if (!noBubble) {

		var dur = durationMS ? durationMS : 3000;
		var target = privateMsg ? pc : null;
		
		this.logDebugInfo(" sending bubble with duration "+dur+" and target pc "+target);

		this.sendBubble(txt, dur, target);
	}

	// Don't repeat things!
	if (this.last_chat && this.last_chat.txt === txt && this.last_chat.pc === pc) {
		log.info(this.getLabel()+" not repeating "+this.last_chat);
		return;
	}

	if (!privateMsg) {
		this.container.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: txt});
	}
	else if (privateMsg) {
		pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: txt});
	}

	this.last_chat = {txt:txt, pc:pc};
}

function sendIM(pc, txt){ // defined by bag_butler
	this.last_command_time = getTime();

	// Add a delay for realism

	var delayMS = randInt(500, 1000);

	this.apiSetTimerMulti("im_send", delayMS, pc, txt, false);

	//this.im_send(pc, txt, false);
}

function setSpeakTime(){ // defined by bag_butler
	this['!speak_time'] = getTime();

	this.logDebugInfo("IDLE speak time is "+this['!speak_time']);
}

function shouldReturnToBase(){ // defined by bag_butler
	// Return true if not already at the base, and time since last click is big enough, and time since 
	// last IM received from a player is big enough.

	// If waiting for a response, then don't go away.
	if (this.waiting_for_response && this.waiting_for_response.list && num_keys(this.waiting_for_response.list) > 0) { 
		return false;
	}

	var dist = Math.abs(this.x - this.target_loc);

	if (dist > 50) {

		var now = getTime();

		var waitTime = this.getClassProp("wait_time");
		
		// check time since last command, IM, or click

		var command_time = this.last_command_time ? this.last_command_time : 0;
		var diff = Math.abs(now - command_time);

		if (diff > waitTime) {
			return true;
		}
	}

	return false;
}

function startEscorting(){ // defined by bag_butler
	var owner = this.getOwner();

	if (!this.visitor) { log.info(this.getLabel()+" got bad visitor"); this.stateChange("idle", "done"); return;}

	this.logDebugInfo("Butler owner location "+owner.location+" and butler container is "+this.container);

	this.chooseWalk();

	this.leading_params =  {
	    "max_stop_distance" : 200,
	    "waiting_distance" : 400,
	    "resume_movement_distance" : 200,
	    "coming_back_distance" : 600,
	    "waiting_time" : 6000,
	    "look_at_player_waiting" : true
	};

	var inside = this.ownerInsideHouse();
	var outside = inside ? false : owner.houses_is_at_home();

	if (outside) { 
		this.sendIM(this.visitor, this.getTextString("visitOwner", this.visitor, owner));

		this.logDebugInfo("Butler leading to owner "+this.getPlayerNameText(owner));
		this.escortTarget = owner;

		var result = this.apiWalkAndLeadPlayerToPlayer(this.visitor, owner, "finishEscorting");
	}
	else if (inside) { 
		this.sendIM(this.visitor, this.getTextString("visitHouse", this.visitor));	

		var x = this.getDoorPosition(); 

		this.escortTarget = "door";

		this.logDebugInfo(" setting x location from door "+x);
		var result = this.apiWalkAndLeadPlayer(this.visitor, x, this.visitor.y, "finishEscorting");
	}
	else {
		log.error(this.getLabel()+" can't escort to owner who isn't home");
	}

	if (result) { 
		this.playAnim(this['!walk_anim'], true);
	}

	this.logDebugInfo("Butler walk and lead result is "+result);
}

function startGreeting(){ // defined by bag_butler
	this.chooseWalk();

	if (this.canPlayAnim(this['!walk_anim'], true)) {
		this.moveToPlayer();
		delete this.walkNotAllowed;
	}
	else {
		this.walkNotAllowed = true;
	}
}

function startMoving(){ // defined by bag_butler
	this.dir = choose_one(['left', 'right']);

	this.npc_walk_speed = 75;

	var left = this.container.geo.l+200;
	var right = this.container.geo.r-200;

	var target = this.target_loc; // don't get too far from the target
	if (left < (target - 300)) { 
		left = target - 300;
	}
	if (right > (target + 300)) {
		right = target + 300;
	} 


	if (this.dir == 'right'){
		this.ai_debug_display("I'm moving left, my x is "+this.x+" and xcoord is "+left+" and state is "+this.state);
		//log.info(this.getLabel()+" moving left, pos is "+this.x+" "+this.y+" and xcoord is "+left);

		if (Math.abs(left - this.x) < 100) { 
			this.turnAround();
			this.startMoving();
		}
		else if (!this.apiFindPath(left, this.y, 0, 'onPathing')){
			this.onStuck();
		}
		else {
			if (!this.playAnim(this['!walk_anim'], true)) { 
				this.fullStop();
				this.stateChange("idle", "can't play anim");
			}
		}
	}else{
		this.ai_debug_display("I'm moving right, my x is "+this.x+" and xcoord is "+right+" and state is "+this.state);
		//log.info(this.getLabel()+" moving right, pos is "+this.x+" "+this.y+" and xcoord is "+right);

		if (Math.abs(right - this.x) < 100) { 
			this.turnAround();
			this.startMoving();
		}
		else if (!this.apiFindPath(right, this.y, 0, 'onPathing')){
			this.onStuck();
		}
		else { 
			if (!this.playAnim(this['!walk_anim'], true)) {
				this.fullStop();
				this.stateChange("idle", "can't play anim");
			}
		}
	}

	//var secs = randInt(3, 25);
	//this.apiSetTimer("onIdle", secs *1000);
}

function stateChange(new_state, reason){ // defined by bag_butler
	var old_state = this['!behavior_state']; 

	var owner = this.getOwner();


	if (reason == "done") {
		this['!behavior_state'] = new_state;
	}
	else if (old_state) { // interrupt

		switch(old_state) { 
			// user interaction
			case "packages":		
			case "interacting": 
			case "greeting":
				return false;
			case "escorting":
				// TODO: this should only allow the state change if the interacting player 
				// is the one being escorted.
				// And it would be good to override the verb menu somehow.
				if (new_state != "interacting") { 
					return false; 
				} 
				break;

			// user commands 
			case "approach":
			case "approachAndSpeak":
			case "walkleft":
			case "walkright":
			case "speaking":
			
				if (new_state == "moving" || new_state == "idle" || new_state == "dancing" || new_state == "attending" ) { 
					return false;
				}
				break;
			case "dancing":
				if (new_state == "moving" || new_state == "idle" || new_state == "attending" || "move_away") { 
					return false;
				}
				break;
			case "move_away": 
			
				if (new_state == "moving" || new_state == "idle" || new_state == "attending" || "dancing") { 
					return false;
				}
				break;
			case "waiting":
			case "attending":
				if (new_state == "moving" || new_state == "idle") {
					return false;
				}
				break;
			case "return_to_base":
				if (new_state === "dancing") { 
					return false; // this case causes slides, disallow it
				}
				break;
			case "moving":
			case "idle":
				break;
		}
	}

	// Special override - don't go to idle if there are players nearby. Instead, always go to attending
	if (new_state === "moving" || new_state === "idle") {
		var dist = this.getProp('far_dist');
		if (this.getNumPlayersInRange(dist) > 0) {
			this.logDebugInfo(" state override - changing "+new_state+" to attending");
			new_state = "attending";
		}
	}


	this['!behavior_state'] = new_state;

	this.ai_debug_display("I am changing from "+old_state+" to "+new_state+" because "+reason);

	// Make sure data is cleared!
	if (old_state === "attending" && new_state != "attending") {
		this['!sub_state'] = "";
	}

	if (this.conversationalist && new_state != "speaking" && new_state != "interacting") { 
		delete this.conversationalist;
	}

	delete this.walkNotAllowed;

	//this.logDebugInfo(" changing from "+old_state+" to "+new_state+" because "+reason);
	//log.info(this.getLabel()+" back two");

	if (new_state === "idle") { 
		//log.info(this.getLabel()+" idling");
		this.playAnim("idle0", true);
		//this.setSpeakTime();
		this.onIdle();
		var secs = randInt(2, 30);
		this.timer = secs * 1000;
	}
	else if (new_state === "moving") { 
		//log.info(this.getLabel()+" moving");
		this.startMoving();
		var secs = randInt(1, 3);
		this.timer = secs*1000;
	}
	else if (new_state === "greeting") { 
		//log.info(this.getLabel()+" greeting");
		this.apiSetTimer("startGreeting", 5*1000); 
	}
	else if (new_state === "packages") {
		//log.info(this.getLabel() + " packages state ");
		this.fullStop();
		this.apiCancelTimer("endGreeting");
		if (!this.packages || !this.packages.list || (num_keys(this.packages.list)=== 0)) 
		{ 
			this.sendIM(owner, this.getTextString("packagesNone", owner, owner));
			this.stateChange("idle", "done");  
		}
		else {
			//this.sendIM(owner, this.getTextString("packagesIntro"));
			this.giveNextPackage();
			this.timer = 15000;
		}
	}
	else if (new_state === "interacting") { 
		//log.info("Butler in interacting state, stopping");
		this.fullStop();
	}
	else if (new_state === "escorting") { 
		//log.info(this.getLabel()+" escorting");

		this.chooseWalk();
		if (this.canPlayAnim(this['!walk_anim'], true)) {
			this.startEscorting();
			delete this.walkNotAllowed;
		}
		else {
			this.sendIM(pc, this.getTextString("waitASec", pc, owner));
		}
	}
	else if (new_state === "approachAndSpeak") {

		if (this.canPlayAnim(this['!walk_anim'], true)) {
			this.moveToPlayer(this.most_recent_notification);
			delete this.walkNotAllowed;
		}
		else {
			this.walkNotAllowed = true;
		}
		
		this.sendIM(owner, this.getTextString("farCommandTellSuccess", owner, owner)); 
	}
	else if (new_state === "dancing") {
		if (old_state != "dancing") {
			this.dance_started = false;
		}

		log.info(this.getLabel()+" in anim state "+this.getCurrentAnim());
	}
	else if (new_state === "attending") { 
		//log.info(this.getLabel()+" start attending");
		this.fullStop();
	}
	else if (new_state === "speaking") {
		this.timer = 4000;
		this.playAnim("talk", false, 3400);
	}
	else if (new_state === "return_to_base") {
		this.returnToBase();
	}
	else {
		this.logDebugInfo(" unhandled state "+new_state);
	}

	//log.info(this.getLabel()+" back one");

	//log.info(this.getLabel()+" timer value in stateChange "+this.timer+" going to state "+new_state);

	return true;
}

function stepBackFromPlayer(pc, x_pos){ // defined by bag_butler
	// Takes the pc's position at the point when they entered the hitbox.

	// First implementation was always retreat in the direction the pc came from
	// Second implementation was randomized
	// Third implementation is avoid crossing the player's x position (requested by Stewart)


	// Don't allow stupid animation changes:
	if (!this.reactionAllowed()) { return false; }

	// Count this as a command so the butler doesn't immediately return to base (because 
	// that looks silly)
	this.last_command_time = getTime();

	var shift_amt = parseInt(this.getClassProp("step_away_dist")) + pc.w; //pc.w+50;

	// Note: directions are backwards

	var target_l = x_pos - shift_amt;
	var target_r = x_pos + shift_amt;


	//1st implementation: if (x_pos < this.x) { 
	//2nd implementation: if (randInt(0, 1) < 1) {
	if (this.x < pc.x) {
		var target = target_l;
		
		if (this.x < (target+10)) { 
			target = this.x - shift_amt;
		}	

		// Shift the target up to 5 times to attempt to avoid other players
		var count = 0;
		while (this.getNumPlayersInRange(50, target) > 0 && count < 5) {
			// will still be too close to a player
			target = target - shift_amt;
			count ++;
		} 

		this.dir = "left"; // directions are backwards but the butler is walking backwards here
	}
	else {
		var target = target_r;
		
		if (this.x > (target-10)) { 
			target = this.x + shift_amt;
		}	

		// Shift the target up to 5 times to attempt to avoid other players
		var count = 0;
		while (this.getNumPlayersInRange(50, target) > 0 && count < 5) {
			// will still be too close to a player
			target = target + shift_amt;
			count ++;
		} 

		this.dir = "right";
	}

	this.logDebugInfo(" stepping, target is "+target+" x is "+x_pos+" and shift amt is "+shift_amt);
	this.logDebugInfo(" stepping, left side is "+pc.location.geo.l);

	if (target < pc.location.geo.l || target > pc.location.geo.r || !this.apiFindPath(target, this.y, 0, 'onStepping')){

		if (this.canSpeak(500)) {
			this.setSpeakTime(); 

			var owner = this.getOwner();
			this.sendBubbleAndChat(pc, this.getTextString("stepAwayStuck", pc, owner, null, null, null, pc)); 
		}

	}
	else {
		this.playAnim("stepBack", true);
		this['!sub_state'] = 'stepping';

		if (this.textAddition) { 
			this.sendIM(pc, this.textAddition);
			delete this.textAddition;
		}
	}

	return true;
}

function takeMessage(pc, txt, withPackage){ // defined by bag_butler
	if (!this.messages) { 
		this.messages = apiNewOwnedDC(this);
	}

	if (!this.messages.list) {
		this.messages.list = {};
	}

	if (!this.messages.list[pc.tsid]) { 
		this.messages.list[pc.tsid] = [];
	}

	txt = utils.filter_chat(txt);

	var mess = {};
	mess.message = txt.slice(0, 431);
	mess.time = current_gametime();
	mess.withPackage = (this.package_msg ? this.package_msg.target_itemstack_tsid : null);
	this.messages.list[pc.tsid].push(mess);
	this.messages.utime = time(); // hacky fix for lost data problem

	delete this.package_msg;

	apiLogAction('BUTLER_LEAVE_MESSAGE', 'pc='+pc.tsid, 'butler='+this.tsid, 'message='+mess.message, 'time='+mess.time, 'package='+mess.withPackage);

	this.logDebugInfo(" taking message "+mess);
	this.logDebugInfo(" package_message is "+this.package_msg);

	if (!withPackage) {
		this.confirmMessageReceipt(pc);
	}
	else { 
		this.confirmPackageReceipt(pc);
	}

	this.timer = 1000;
	this.stateChange("waiting", "done");

	return true;
}

function teachMe(pc, uid){ // defined by bag_butler
	var args = {
		input_label: 'What I should say:',
		cancelable: true,
		input_focus: true
	};

	if (this.user_name) args.input_value = this.user_name;

	this.askPlayer(pc, uid, 'Teach Me!', args);

	this.stateChange("interacting");
	return true;
}

function turnAround(){ // defined by bag_butler
	this.dir = (this.dir == 'left') ? 'right' : 'left';

	this.ai_debug_display("turned around - dir is "+this.dir);
}

// global block from bag_butler
var no_auto_flip = true;

function checkMail(pc){ // defined by npc_mailbox
	this.setPCState(pc, 'interact');
	pc.announce_sound('INTERACT_MAILBOX');
	pc.mail_check(this.tsid);
}

function cleanPCs(){ // defined by npc_mailbox
	// Defensive coding, essentially, from server crashes or weirdness.

	for(var i in this.pc_states) {
		var pc = getPlayer(i);
		if(pc) {
			if(!pc.isOnline() || this.container != pc.location) {
				delete this.pc_states[i];
			}
		}
	}
}

function doIdle(pc){ // defined by npc_mailbox
	if(pc.mail_has_unread()) {
		this.setPCState(pc, 'has_mail');
	} else {
		this.setPCState(pc, 'idle');
	}
}

function processIdle(){ // defined by npc_mailbox
	for(var i in this.pc_idle_timers) {
		// Cancel expired timers and set the idle state
		if(this.pc_idle_timers[i] <= time()) {
			this.doIdle(getPlayer(i));

			delete this.pc_idle_timers[i];
		}
	}

	this.scheduleNextIdle();
}

function scheduleNextIdle(){ // defined by npc_mailbox
	var next_idle = -1;

	for(var i in this.pc_idle_timers) {
		if (next_idle == -1 || this.pc_idle_timers[i] < next_idle) {
			next_idle = this.pc_idle_timers[i];
		}
	}

	if(next_idle != -1) {
		this.apiCancelTimer('processIdle');
		this.apiSetTimer('processIdle', (next_idle - time()) * 1000);
	}
}

function setPCState(pc, state){ // defined by npc_mailbox
	if(!this.pc_states) {
		this.pc_states = {};
	}

	if(state == 'has_mail' && this.pc_states[pc.tsid] != 'has_mail') {
		pc.announce_sound('HAS_MAIL', 999);
	} else if (state != 'has_mail' && this.pc_states[pc.tsid] == 'has_mail') {
		pc.announce_sound_stop('HAS_MAIL');
	}

	this.pc_states[pc.tsid] = state;
	this.broadcastState();
}

function checkWaiting(){ // defined by npc
	if (!this.isWaiting) return;
	if (!this.container) this.apiSetTimer('checkWaiting', 1000);

	//
	// remove any keys we can, because user has logged off, or is far away
	//

	if (this.waitingFor.__iterator__ == null) delete this.waitingFor.__iterator__;
	for (var i in this.waitingFor){
		if (!this.container.activePlayers) continue;

		var pc = this.container.activePlayers[i];
		if (pc){
			if (this.distanceFromPlayer(pc) > config.verb_radius){
				delete this.waitingFor[i];
			}
		}else{
			delete this.waitingFor[i];
		}
	}


	//
	// done waiting?
	//

	if (!num_keys(this.waitingFor)){
		this.isWaiting = 0;
		if (this.onWaitEnd) this.onWaitEnd();
	}else{
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function clearMovementLimits(){ // defined by npc
	delete this.move_limits;
}

function hasCubimal(){ // defined by npc
	var cubimal_map = {
		hell_bartender:					'npc_cubimal_hellbartender',
		npc_batterfly:					'npc_cubimal_batterfly',
		npc_bureaucrat:				'npc_cubimal_bureaucrat',
		npc_butterfly:					'npc_cubimal_butterfly',
		npc_cactus:					'npc_cubimal_cactus',
		npc_cooking_vendor:			'npc_cubimal_mealvendor',
		npc_crab:						'npc_cubimal_crab',
		npc_crafty_bot:					'npc_cubimal_craftybot',
		npc_deimaginator:				'npc_cubimal_deimaginator',
		npc_firefly:					'npc_cubimal_firefly',
		npc_fox:						'npc_cubimal_fox',
		npc_fox_ranger:				'npc_cubimal_foxranger',
		npc_garden_gnome:				'npc_cubimal_gnome',
		npc_gardening_vendor:			'npc_cubimal_gardeningtoolsvendor',
		npc_gwendolyn:				'npc_cubimal_gwendolyn',
		npc_jabba2:					'npc_cubimal_helga',
		npc_jabba1:					'npc_cubimal_unclefriendly',
		npc_juju_black:					'npc_cubimal_juju',
		npc_juju_green:				'npc_cubimal_juju',
		npc_juju_red:					'npc_cubimal_juju',
		npc_juju_yellow:				'npc_cubimal_juju',
		npc_maintenance_bot:			'npc_cubimal_maintenancebot',
		npc_newxp_dustbunny:			'npc_cubimal_dustbunny',
		npc_piggy:					'npc_cubimal_piggy',
		npc_piggy_explorer:				'npc_cubimal_ilmenskiejones',
		npc_quest_giver_widget: 			'npc_cubimal_greeterbot',
		npc_rube:						'npc_cubimal_rube',
		npc_sloth:						'npc_cubimal_sloth',
		npc_smuggler:					'npc_cubimal_smuggler',
		npc_sno_cone_vending_machine:	'npc_cubimal_snoconevendor',
		npc_squid:					'npc_cubimal_squid',
		npc_tool_vendor:				'npc_cubimal_toolvendor',
		npc_yoga_frog:					'npc_cubimal_frog',
		phantom_glitch:				'npc_cubimal_phantom',
		street_spirit_firebog:				'npc_cubimal_firebogstreetspirit',
		street_spirit_groddle:			'npc_cubimal_groddlestreetspirit',
		street_spirit_zutto:				'npc_cubimal_uraliastreetspirit'
	};

	return cubimal_map[this.class_id];
}

function onInteractionInterval(pc, interval){ // defined by npc
	this.onInteractionStarting(pc);
	this.events_add({callback: 'onInteractionIntervalEnd', pc: pc}, interval);
}

function onInteractionIntervalEnd(details){ // defined by npc
	if (details.pc) {
		this.onInteractionEnding(details.pc);
	}
}

function npc_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function npc_onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function npc_onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function conversation_run_after_greeting_owner(pc, msg, replay){ // defined by conversation auto-builder for "after_greeting_owner"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "after_greeting_owner";
	var conversation_title = "";
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
		choices['0']['after_greeting_owner-0-2'] = {txt: "Access my mailbox!", value: 'after_greeting_owner-0-2'};
		choices['0']['after_greeting_owner-0-3'] = {txt: "Give me my messages!", value: 'after_greeting_owner-0-3'};
		choices['0']['after_greeting_owner-0-4'] = {txt: "Give me my packages!", value: 'after_greeting_owner-0-4'};
		choices['0']['after_greeting_owner-0-5'] = {txt: "I just wanna chat.", value: 'after_greeting_owner-0-5'};
		choices['0']['after_greeting_owner-0-6'] = {txt: "I don't need anything.", value: 'after_greeting_owner-0-6'};
		choices['0']['after_greeting_owner-0-7'] = {txt: "I have something to teach you.", value: 'after_greeting_owner-0-7'};
		this.conversation_start(pc, "How can I be of service?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'after_greeting_owner', msg.choice);
	}

	if ((msg.choice == "after_greeting_owner-0-2") && (!replay)){
		this.stateChange("interacting");
this.fullStop();

this.checkMail(pc);
	}

	if (msg.choice == "after_greeting_owner-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "after_greeting_owner-0-6"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "after_greeting_owner-0-3"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "after_greeting_owner-0-3") && (!replay)){
		this.onRetrieveMessages(pc);
	}

	if (msg.choice == "after_greeting_owner-0-4"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "after_greeting_owner-0-4") && (!replay)){
		this.onRetrievePackages(pc);
	}

	if ((msg.choice == "after_greeting_owner-0-5") && (!replay)){
		this.onTalkTo(pc, "");
	}

	if (msg.choice == "after_greeting_owner-0-5"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "after_greeting_owner-0-7"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "after_greeting_owner-0-7") && (!replay)){
		var conversation_runner = "conversation_run_teach";
if (this[conversation_runner]){
		this[conversation_runner](pc, msg);
}
	}

}

function conversation_run_after_greeting_visitor(pc, msg, replay){ // defined by conversation auto-builder for "after_greeting_visitor"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "after_greeting_visitor";
	var conversation_title = "";
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
		choices['0']['after_greeting_visitor-0-2'] = {txt: "Leave a message!", value: 'after_greeting_visitor-0-2'};
		choices['0']['after_greeting_visitor-0-3'] = {txt: "Leave a package!", value: 'after_greeting_visitor-0-3'};
		choices['0']['after_greeting_visitor-0-4'] = {txt: "I'm here to visit!", value: 'after_greeting_visitor-0-4'};
		choices['0']['after_greeting_visitor-0-5'] = {txt: "I just wanna chat.", value: 'after_greeting_visitor-0-5'};
		choices['0']['after_greeting_visitor-0-6'] = {txt: "I don't need anything.", value: 'after_greeting_visitor-0-6'};
		this.conversation_start(pc, "How can I help you?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'after_greeting_visitor', msg.choice);
	}

	if (msg.choice == "after_greeting_visitor-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "after_greeting_visitor-0-2") && (!replay)){
		this.onLeaveMessage(pc);
	}

	if (msg.choice == "after_greeting_visitor-0-3"){
		choices['2']['after_greeting_visitor-2-2'] = {txt: "Oh, ok.", value: 'after_greeting_visitor-2-2'};
		this.conversation_reply(pc, msg, "Sorry, I can't do that through this menu. We'll have to request client changes if we want to do it. But I can still take packages if you end the conversation and then click on me.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'after_greeting_visitor', msg.choice);
	}

	if (msg.choice == "after_greeting_visitor-0-6"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "after_greeting_visitor-0-5"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "after_greeting_visitor-0-5") && (!replay)){
		this.onTalkTo(pc, "");
	}

	if (msg.choice == "after_greeting_visitor-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "after_greeting_visitor-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if (msg.choice == "after_greeting_visitor-0-4"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "after_greeting_visitor-0-4") && (!replay)){
		this.onVisit(pc);
	}

}

function conversation_run_teach(pc, msg, replay){ // defined by conversation auto-builder for "teach"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "teach";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['teach-0-2'] = {txt: "A greeting for me.", value: 'teach-0-2'};
		choices['0']['teach-0-3'] = {txt: "A greeting for my friends.", value: 'teach-0-3'};
		choices['0']['teach-0-4'] = {txt: "A greeting for strangers.", value: 'teach-0-4'};
		choices['0']['teach-0-5'] = {txt: "Something to say when you're bored.", value: 'teach-0-5'};
		choices['0']['teach-0-6'] = {txt: "Nothing.", value: 'teach-0-6'};
		this.conversation_start(pc, "What would you like to teach me?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'teach', msg.choice);
	}

	if (msg.choice == "teach-0-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "teach-0-2") && (!replay)){
		this.teachMe(pc, "owner_greeting");
	}

	if (msg.choice == "teach-0-3"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "teach-0-3") && (!replay)){
		this.teachMe(pc, "friend_greeting");
	}

	if (msg.choice == "teach-0-4"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "teach-0-4") && (!replay)){
		this.teachMe(pc,"stranger_greeting");
	}

	if (msg.choice == "teach-0-5"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

	if ((msg.choice == "teach-0-5") && (!replay)){
		this.teachMe(pc, "idle_comment");
	}

	if (msg.choice == "teach-0-6"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_instructions(pc, msg, replay){ // defined by conversation auto-builder for "instructions"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "instructions";
	var conversation_title = "";
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
		choices['0']['instructions-0-2'] = {txt: "Hi!", value: 'instructions-0-2'};
		this.conversation_start(pc, "Hello. I am your new butler.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'instructions', msg.choice);
	}

	if (msg.choice == "instructions-0-2"){
		choices['1']['instructions-1-2'] = {txt: "So, I click on you to open an IM window.", value: 'instructions-1-2'};
		this.conversation_reply(pc, msg, "You can ask me to do things by IMing me. You can click on me to open an IM window. ", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'instructions', msg.choice);
	}

	if (msg.choice == "instructions-1-2"){
		choices['2']['instructions-2-2'] = {txt: "Commands: visitors, packages, messages, mailbox, jokes, dance.", value: 'instructions-2-2'};
		this.conversation_reply(pc, msg, "I can: tell you about visitors to your street, give you packages, give you messages, and open your mailbox. I also tell jokes and I know how to dance!", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'instructions', msg.choice);
	}

	if (msg.choice == "instructions-2-2"){
		choices['3']['instructions-3-2'] = {txt: "Wow!", value: 'instructions-3-2'};
		this.conversation_reply(pc, msg, "You can change my name if you want. You can also teach me things: a greeting for you, a greeting for your friends, a greeting for strangers, or info for visitors.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'instructions', msg.choice);
	}

	if (msg.choice == "instructions-3-2"){
		choices['4']['instructions-4-2'] = {txt: "Cool beans.", value: 'instructions-4-2'};
		this.conversation_reply(pc, msg, "If you want to leave gifts for your visitors, you can drag an itemstack to me.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'instructions', msg.choice);
	}

	if (msg.choice == "instructions-4-2"){
		choices['5']['instructions-5-2'] = {txt: "Ok, visit, packages, messages. ", value: 'instructions-5-2'};
		this.conversation_reply(pc, msg, "If you meet another butler, you can ask to visit their owner and they will escort you. You can also leave packages and messages. ", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'instructions', msg.choice);
	}

	if (msg.choice == "instructions-5-2"){
		choices['6']['instructions-6-2'] = {txt: "Excellent!", value: 'instructions-6-2'};
		this.conversation_reply(pc, msg, "And if somebody visits while you are away from home, I will let you know. If you ask me to tell them something, I will. ", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'instructions', msg.choice);
	}

	if ((msg.choice == "instructions-6-2") && (!replay)){
		this.sendIM(pc, "Now, what can I do for you?");
	}

	if (msg.choice == "instructions-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"after_greeting_owner",
	"after_greeting_visitor",
	"teach",
	"instructions",
];

function parent_broadcastState(){ // defined by npc_mailbox
	if(!this.apiGetLocatableContainerOrSelf()) {
		return;
	}

	for(var i in this.pc_states) {
		var pc = getPlayer(i);

		pc.apiSendMsg({
			type: 'item_state',
			itemstack_tsid: this.tsid,
			s: this.buildState(pc),
		});	
	}
}

function parent_buildState(pc){ // defined by npc_mailbox
	if(!pc || !this.pc_states || !this.pc_states[pc.tsid]) {
		return 'idle';
	}

	return this.pc_states[pc.tsid];
}

function parent_mailStop(pc){ // defined by npc_mailbox
	this.setPCState(pc, 'all_done');

	pc.announce_sound('MAILBOX_ALL_DONE');

	// add a timer to go back to idle on this pc.
	if(!this.pc_idle_timers) {
		this.pc_idle_timers = {};
	}

	this.pc_idle_timers[pc.tsid] = time() + 2;

	this.scheduleNextIdle();

	// deal with the states of any other mailboxes on this street

	if(this.container) {
		var boxes = this.container.find_items('npc_mailbox');
		for(var i = 0; i < boxes.length; ++i) {
			if(boxes[i] != this) {
				boxes[i].doIdle(pc);
			}
		}
	}
}

function parent_make_config(){ // defined by npc_mailbox
	return { variant: this.getInstanceProp('variant') || 'mailboxLeft' };
}

function parent_onCreate(){ // defined by npc_mailbox
	this.apiSetHitBox(200,200);
}

function parent_onPlayerCollision(pc){ // defined by npc_mailbox
	//pc.quests_offer('send_mail', true);
}

function parent_onPlayerEnter(pc){ // defined by npc_mailbox
	this.doIdle(pc);
}

function parent_onPlayerExit(pc){ // defined by npc_mailbox
	if(this.pc_states && this.pc_states[pc.tsid]) {
		delete this.pc_states[pc.tsid];
	}

	// Prune the PC list. This can probably be removed later for speed, but is going in to clean up previous list maintenance problems.
	this.cleanPCs();
}

function parent_onPrototypeChanged(){ // defined by npc_mailbox
	this.apiSetHitBox(200,200);
	this.apiSetPlayersCollisions(true);
}

function parent_fullStop(){ // defined by npc
	this.apiStopMoving();
	this.apiCancelTimer('startMoving');
}

function parent_onInteractionEnding(pc){ // defined by npc
	this.fsm_event_notify('interaction_ending', pc);
	if (this.waitingFor){
		delete this.waitingFor[pc.tsid];
	}
	this.checkWaiting();
}

function parent_onInteractionStarting(pc, mouseInteraction){ // defined by npc
	this.fsm_event_notify('interaction_starting', pc);
	if (!this.waitingFor) this.waitingFor = {};
	this.waitingFor[pc.tsid] = 1;
	if (!this.isWaiting){
		this.isWaiting = 1;
		if (this.onWaitStart) this.onWaitStart(pc, mouseInteraction);
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function parent_onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Butlers can be found only on <b>Home Streets<\/b>."]);
	if (pc && (pc.stats_get_level() < 3)) out.push([1, "Having a Butler requires <b>Level 3<\/b>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"mail",
	"regular-item"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-29,"y":-103,"w":56,"h":103},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAHy0lEQVR42s2YS1BaWQKGs55NVrPO\npqu70\/MwmTyNnRg1iaKI8kYE5SEYQEURRVFEUYMoiIo2Dx+IaESNQQ0qvkLUSFo7StImmp6eLqo3\nM5PZuJ7VPzdMZaq6p2YzFUhO1V8X7tl8\/Jdz7v+fU6fiMN6+fZxUVlexncdl7gkkBSEKJUM5Pe08\nfepTGYtrE5GfoxsIP7HDba9GjZIJIZ+8\/MkA\/vXn1ejh6xU8XPairccAuVqOIjEXDC47L2EQ+3vj\nGS1NpXk6jSjp13ObL3YQ+fMu9g8DmHtkR0u7GsKSAnCKWO6EwO0e70U2X+6gx92PkopSsHnsX0Ae\nfB\/EwqoX1sE2KOtLwBXRcCcnFSRyWjTucM8iS8XhyBq+fe6Hua8O0nIeGDya\/v18+GApdWJpFu4F\nH3p9o6i+p0cx8SNuZt4ET1yIuAPavAPR6fUAZkJB2CddqGyohETBDz1\/Ph1bpVvfb0W2D58hsBPE\n0KwHXa4eVNRXgUzLgVgmiD\/gcXQPf3+7hx+OV+AZaYXVXAWxgIIyGRPe0Rbs73nx4xs\/dsMebD8Z\nwpBTh55uNXjcHChkBfEHnPVZ4J+24sFEB+ZnO7EftmP32SgCKyMYnrDCO96GQWcdqtXFqC6nQVJ0\nGyJeBkqKyWhpVcYfcHV3NbQVeYK1g2dYOdj7L01ursM2Mwmz1x1TTUc7Kpp1xP+PjyxqXijugG6f\nzd1qNsBkM6GLULfdDP09LQRiBoqE1JjozCzQGJkxUfIykPL1BaRnXMOd3Fv+uAP6gsNJpmEL\/peM\ng12o79Kh1qiNSdVaizwuDZT82+DyKMqE7IMvXz0MvXzlx3v99NMi\/vG3tf\/o8MVUbJE82XDh8ZoD\njfVi8Pg0KBTcMwkBHHE1Kh39Nfi1xoZ1MfnGWzHgaEGvvRXySjFYnFxk5uf6TyVqNGmKlIzcZLyX\nVECC0aiC0axDYUFW7F4uJQ36\/h6UNWlBZZIhFLOKEwZIJV9OomRexPUrX8ZgDIYqDAbG8DDsh\/+7\nFdBpaaDmJGPCZ8XANzqwmbdOEp5Yblw9i8\/O\/Bak9POYCfows+TB4dEq5l+sg82noIiTAUdvObTV\nDAj4Oe6EA5LSzp9cPvcZbib\/DrW1MvhWp+AhIEeJa+qNPxHunkWJgguegIG0O2lJCQM7\/OFx0uLO\nojtyRASGg0Usbs5g8r4JpRVFUOsrQKffAoV0FbfvXAWVnw8qgxRJqHM7Ya\/\/8HUAk4RT7yCPfnyM\nrf1FvDx6hEePbOALaOBIOODJhcimklAgLChOKKC2vUZpuKf6p93VjBEiLAwOGRD7PNwCVhEDPJkI\nut5uiKqU4AkLTqQazcfpImRyWtLFlIvZHfeUJ52dKrQYyonkrEJ9UwUERHqWSDnIyUm3fvT+Ua6t\n8ReXK1AiLyVeaRzwi3jgEtf0HBIYbGreR4F67nSe3hpxnazYrBjRadGlroSvvQU9irvYHnHFtGG3\nQcNjKz+ac1PNjXpvYx1GtbXQMKmoZ9NRTs7CfOc9TDY3okNcDNKlCx8PcGNn6IxWXhh9B0bPykBd\nG9FPitjoVZRipFaFwvRUqCSiCJtMTko4XPRoxnoYGUenpQ5iSSFc4y44p1xw3HeCdSsVjJQraFVX\n4c3CLLqVMmQmX0mMk861jtPDAWMouDkAs7MGbX0GuGfcMFgN8G\/MYWzeCy4BLCoTg8HKx46zD1t9\nnWjmsZB77Yo87oAvIl539PgBXu+PQ1cvemuwGPBoM0C0OydMAyaom9SYXPahhQDmigpRJ+BiobEa\nwd4utKuUKCqM46a9Gnalrj11YH9\/DJ45I0Ql1M5mczPcD0YxH1qA0daB1p5WmActqCeSdHp2Ouhs\nCr6b8WKj3wKz8i4sJj1otGx9XADDu+7QMvFot58OwtRdSXQPZpl3wQuzwxKDmwk+QPdoDwQqEUg0\nEvSNCvgfWqGvlGDd1IwtezdMOjVEIh6ys9M\/bLLee9yX+sCrhbO\/DEszBggElGh7exdHUlGKXncv\nSpQlMNmJEuU0gystRD4nC3t79xHeGoVMxkHE\/U3k1bwdq4sGlCnEhIvk6Q9blJwyv8cmxX27HMYG\nNvjMG+6aap378uVryMrPRq1BA5aADWohDZmUTCg1fBy\/WcBaYAB3S1k4CjqUxy9t6LOoIZOKQMsj\nvwuwv\/lggJoyklItJ6Hqbha0yjwwc5NTw5uhE4vJCjqVARo9H9l52XISNTf1\/KXzqcPTOhw89+HV\naz8aG6REqXKenps0QSqUQ8iTIPlKCs794dyHfQ0W0lOKaeTL+ksXPi959\/3pk82TgH8OEx4P4Yr0\nF5E+sGPF5ooTe2EvqlXFsbmGmsZouUwFGoWFm1+n4\/df\/lEf1y3H2G5DU6MZqko9SFn5SE6+nhrL\ni0fjZ6aDnfhLdBmb2240EA4ymbdOS0VyP4fBA+k2GSlXr+OrL76Kb5CYexjE8JAPDrsXCnk1MtJI\nsWONUMRTbJ+sQfjbMWxvudHTXYvbGVe1Il5pEuGe\/sa1m\/qzn5\/Njv8ZzfI6Bp1eGNss0Ki1YNJp\nMadWdu36LocC2+uDsUc8N98HFpOU+Fa3vDApDsx6QhtLUyF9Q3WISSyQd\/eHp5r0yjoWXkSmsfPU\nA12NCCxG5qtP5gC926HJq2ooiDr6tRh2t0EipIaE\/H\/D\/z\/jXzWHIM29\/J0fAAAAAElFTkSuQmCC\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/bag_butler-1340661240.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: true,
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
	"no_trade",
	"mail",
	"regular-item"
];
itemDef.keys_in_location = {
	"y"	: "eavesdrop",
	"t"	: "stop_eavesdropping",
	"c"	: "accept_gift",
	"e"	: "access_mailbox",
	"h"	: "chat",
	"g"	: "chatter",
	"k"	: "click",
	"u"	: "customize",
	"j"	: "debug",
	"n"	: "dispense_wisdom",
	"v"	: "give",
	"o"	: "give_cubimal",
	"q"	: "info",
	"x"	: "leave_message",
	"z"	: "leave_package"
};
itemDef.keys_in_pack = {};

log.info("bag_butler.js LOADED");

// generated ok 2012-11-09 11:11:02 by pobrien
