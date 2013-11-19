//#include include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Bureaucrat";
var version = "1350423000";
var name_single = "Bureaucrat";
var name_plural = "Bureaucrats";
var article = "a";
var description = "While this bureaucrat can't be described as faceless, given the presence of a face, the fact that you can't tell any of them apart renders its face basically unnecessary. Charged with the granting (or not) of permits, this is a world of red tape and frustration in an ill-fitting suit, basically.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_bureaucrat", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: ""	// defined by npc
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.arms = "01";	// defined by npc_bureaucrat
	this.instanceProps.glasses = "none";	// defined by npc_bureaucrat
	this.instanceProps.hair = "01";	// defined by npc_bureaucrat
	this.instanceProps.legs = "01";	// defined by npc_bureaucrat
	this.instanceProps.necklace = "01";	// defined by npc_bureaucrat
	this.instanceProps.tie = "none";	// defined by npc_bureaucrat
	this.instanceProps.torso = "01";	// defined by npc_bureaucrat
	this.instanceProps.label = "";	// defined by npc_bureaucrat
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	arms : [""],
	glasses : [""],
	hair : [""],
	legs : [""],
	necklace : [""],
	tie : [""],
	torso : [""],
	label : ["What to call???"],
};

var instancePropsChoices = {
	ai_debug : [""],
	arms : ["none","01","02","03","04"],
	glasses : ["none","01"],
	hair : ["none","01","02","03","04","05"],
	legs : ["none","01","02","03","04"],
	necklace : ["none","01","02"],
	tie : ["none","01","02"],
	torso : ["none","01","02","03","04"],
	label : [""],
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
	"sort_on"			: 50,
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

verbs.talk_to = { // defined by npc_bureaucrat
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Attempt what is likely to be a maddening conversation",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!pc['!bureaucracy_step'] && this.current_state == 'helping' && this.helping && this.helping.tsid == pc.tsid){
			return {state:'enabled'};
		}

		return {state:'disabled', reason: "Please approach the counter for assistance."};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.helping_started = true;

		var items = this.getItems(pc);

		var choices = [];
		for (var i=0; i<items.length; i++){
			choices.push({txt: items[i].label+' ('+items[i].cost+'c)', value: items[i].class_tsid});
		}

		if (items.length){
			var txt = "The following items are available to you:";
			choices.push({txt: 'Nevermind', value: 'nevermind'});
		}
		else{
			var txt = "Go away, <b>"+pc.label+"</b>, we don't have time to waste on people who have not learned any Bureaucratic Arts.";
			choices.push({txt: 'OK', value: 'nevermind'});
		}
		this.conversation_start(pc, txt, choices);

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function getItems(pc){ // defined by npc_bureaucrat
	var items = get_store(17).items;

	var choices = [];

	for (var i in items){
		var it = apiFindItemPrototype(items[i].class_tsid);
		if (items[i].class_tsid == 'card_carrying_qualification' && pc.achievements_has('card_carrying_qualification')) continue;
		if (items[i].class_tsid != 'card_carrying_qualification' && !pc.skills_has('bureaucraticarts_1')) continue;
		if (items[i].class_tsid == 'general_building_permit' && !pc.skills_has('bureaucraticarts_2')) continue;

		choices.push({
			class_tsid: items[i].class_tsid,
			label: it.name_single,
			cost: items[i].cost
		});
	}

	return choices;
}

function getLabel(){ // defined by npc_bureaucrat
	var instance_label = this.getInstanceProp('label');
	if (instance_label) return instance_label;

	if (!this.name){
		var titles = [
			'Prefect',
			'Chamberlain',
			'Deputy',
			'Secretary',
			'Assistant',
			'Associate',
			'Representative',
			'Magister',
			'Manager',
			'Director',
			'Overseer',
			'Administrator',
			'Probost'
		];

		var names = [
			'Smithe',
			'Wigglesbottom',
			'Apfer',
			'Naraiwaddleappali',
			'Snifflenose',
			'Sharpburger',
			'Tummyford',
			'Piksnixson',
			'Nuter',
			'Innifekki',
			'Candnot',
			'Chucklesmouth',
			'Earwick'
		];

		this.name = choose_one(titles)+' '+choose_one(names);
	}

	return this.name;
}

function getRandomBureaucrat(pc){ // defined by npc_bureaucrat
	var items = this.container.items;
	for (var i in items){
		if (items[i].class_tsid == 'npc_bureaucrat' && !items[i].isBusy()) return items[i];
	}

	return null;
}

function getRandomQuestion(){ // defined by npc_bureaucrat
	var choices = [
		{txt: "I may be able to help you with that. But first, favorite colour?", options: ['Blue', 'Other'] },
		{txt: "That should be possible. But first, quick question: which number is better?", options: ['631', '11'] },
		{txt: "I may be able to help you with that. But first, which cloud is better?", options: ['Cirrus', 'Cumulonimbus'] },
		{txt: "I should think so, but first: Which is the superior number?", options: ['81', '19'] },
		{txt: "It sounds like the kind of thing I should be able to help with. First: Sandals or Flip-Flops?", options: ['Sandals', 'Flip-Flops'] },
		{txt: "I may be able to help. One question, though. Given the choice: Bowl or Plate?", options: ['Bowl', 'Plate'] },
		{txt: "I should be able to help with that. But first, favorite noise?", options: ['Duck', 'Not a Duck'] },
		{txt: "I may be able to help. Quick question first, though. Is it ever too late?", options: ['Yes', 'No'] },
		{txt: "I imagine we can help. One question first. Which came first?", options: ['The Chicken', 'The Grain'] },
		{txt: "I don’t see why not. But first, answer me this: Who let the dogs out?", options: ['A man called Graham', 'Someone else'] },
		{txt: "I may be able to sort that out for you. First: favorite colour?", options: ['Orange', 'Other'] },
		{txt: "I should think it possible. Before we sign off, quick question: Which is superior?", options: ['An apple', 'An orange'] },
		{txt: "It sounds I should be able to sign this off. First: Which is better?", options: ['Wool', 'Geometry'] },
		{txt: "I should be able to help you. First, however, answer me this. What time is love?", options: ['2pm', 'Before lunch'] },
		{txt: "Shouldn’t be a problem. Quick question first: Which colour is better?", options: ['Red', 'Taupe'] },
		{txt: "I may be able to assist you on this. But first, I have to ask you: which is optimal?", options: ['Hats', 'Salmon'] },
		{txt: "Sounds reasonable. Before we proceed, I must ask, which shelf-height do you prefer?", options: ['High shelves', 'Ankle-height shelves'] },
		{txt: "I don’t see why not. But first, one question. What’s my square root?", options: ['67?', 'I prefer not to say'] },
		{txt: "I may be able to help you out with this. First though, quick question. Which do you prefer?", options: ['Sailing', 'Ketchup'] },
		{txt: "That should be possible. First, however, can you just tell me your preferred shape?", options: ['Dodecahedron', 'Other'] },
		{txt: "I imagine I should be able to sign this off. Quick question though: which is the superior letter?", options: ['P', 'F']  },
		{txt: "I may be able to help you out. But first, which is better?", options: ['Laughter', 'Pants'] },
		{txt: "I think I can help you with this. One question first… Please choose between the following:", options: ['Daddy', 'Chips'] },
		{txt: "Sounds all in order. Answer me this first, please: What is the eminent shape?", options: ['Circle', 'Rectangle'] },
		{txt: "I may be able to help you with that. But first, please choose between the following:", options: ['Pirates', 'Ninjas'] },
		{txt: "That should be possible. Before we proceed, which number is preferable?", options: ['Six', 'Ninety-four']  },
		{txt: "I can’t see why not. One last thing before we proceed: which is the greater?", options: ['Antelopes', 'Capitalism'] },
		{txt: "It sounds like I may be able to help, but first, one more quick question:", options: ['Scrambled', 'Fried'] },
		{txt: "I should be able to help with that. First, however, one question:", options: ['Innie?', 'Outie?'] },
		{txt: "That might be within my jurisdiction. One final thing, which do you prefer?", options: ['Egg', 'Jasmine'] },
		{txt: "Sounds like something we can help with. Before that: your favourite shape?", options: ['Triangle', 'Dodecahedron'] },
		{txt: "I might be able to help with that. Before we proceed: which is superior?", options: ['Shelving', 'Polenta'] },
		{txt: "I may be prepared to sign this off. First, though: your favorite color?", options: ['Yellow', 'Black'] },
		{txt: "I should be able to rubber stamp this. Before that, though, your favorite color?", options: ['Purple', 'Not Purple'] },
		{txt: "This shouldn’t be a problem. One last question. Your favorite color?", options: ['Beige', 'Other'] },
		{txt: "I don’t see any issue with your application. But first, which do you prefer?", options: ['Velcro', 'Glory'] },
		{txt: "I may be able to deal with this. Final question, though, which number is better?", options: ['13', '44278'] },
		{txt: "It should be possible to sign this off. But one quick check, do you prefer:", options: ['Hairy hats', 'Other hats'] },
		{txt: "I may be able to do this for you. One quick question, though: which is better?", options: ['Logic', 'Swimming'] },
		{txt: "I might be able to help. One last thing: which is your preferred destination?", options: ['Ski Slopes', 'Cowboy Ranch'] },
		{txt: "I might be able to help with that. First though, which is superior?", options: ['Fast bus', 'Slow speedboat'] },
		{txt: "I may be able to help with that. One final question. Do you consider honey a dairy product?", options: ['Yes', 'No'] },
		{txt: "Shouldn’t be too much of a problem. Quick question first. Do you prefer:", options: ['Frozen bananas', 'A cornballer'] },
		{txt: "I should be able to help. But one final question before we do: Which is better?", options: ['Feathers', 'Gratitude'] },
		{txt: "Can’t see any issue with your application. One last thing. Your favourite fruit?", options: ['Lemon', 'Other'] },
		{txt: "I should be able to help. One last question: if bacon is wrong, do you want to be right?", options: ['No', 'The hypothesis is invalid'] },
		{txt: "I may be able to deal with this. Quick question, though. Does Sandy Claws exist?", options: ['Yes', 'No', 'Who?'] },
		{txt: "I can probably deal with your application. One final question, which is optimal?", options: ['Cake', 'Death'] },
		{txt: "I might be able to sign this off. One thing: Your favorite fruit?", options: ['Apples', 'Tomatoes'] }
	];

	return choose_one(choices);
}

function greeting_onEnter(previous_state){ // defined by npc_bureaucrat
	this.messages_register_handler('greeting', 'greeting_onMsg');
	this.apiFindPath(Math.max(this.greeting.x+100, 384), -128, 0, 'onPathing');
	this.helping_started = false;

	this.fsm_event_notify('interval', null, getTime()+10000);
}

function greeting_onMsg(msg){ // defined by npc_bureaucrat
	if (config.is_dev) log.info(this+' greeting_onMsg: '+msg);

	if (msg.from == 'interval'){
		if (!this.greeting){
			this.returnToStart();
		}
		else{
			this.fsm_event_notify('interval', null, getTime()+10000);
		}
	}
	else if (msg.from == 'pathing'){
		var args = msg.payload;

		if (args.status == 1){
			if (args.dir == 'left'){
				this.dir = 'left';
			}
			else if (args.dir == 'right'){
				this.dir = 'right';
			}
			this.npc_walk_speed = 60;
			this.setAndBroadcastState('walk1');
		}
		else if (args.status == 3 || args.status == 4){
			if (this.greeting){
				// Turn to face the player
				if (this.greeting.x > this.x){
					this.dir = 'right';
				}
				else{
					this.dir = 'left';
				}

				this.setAndBroadcastState('talk');
				var choices = {
					1: {txt: 'OK', value: 'greeting-ok'}
				};
				this.conversation_start(this.greeting, "<b>"+this.greeting.label+"</b>! We will be with you as soon as possible. Now please go and wait.", choices);
			}
			else{
				delete this.returning;
				this.fsm_pop_stack();
			}
		}
	}
	else if (msg.from == 'conversation' || msg.from == 'conversation_cancel'){
		if (msg.payload.msg.choice == 'greeting-ok' || msg.from == 'conversation_cancel'){
			msg.payload.pc['!bureaucracy_waiting'] = true;

			if (msg.payload.pc.x < -220){
				var txt = 'Please move into the waiting area to your right.';
			}
			else{
				var txt = 'Please move into the waiting area to your left.';
			}

			msg.payload.pc['!bureaucracy_waiting_prompt'] = msg.payload.pc.prompts_add({
				txt		: txt,
				icon_buttons	: false,
				choices		: [
					{ value : 'ok', label : 'OK' }
				]
			});
		}

		delete this.greeting;
		this.returnToStart();
		if (msg.from == 'conversation') this.conversation_end(msg.payload.pc, msg.payload.msg);
	}
	else if (msg.from == 'player_exit'){
		if (this.greeting && msg.payload.tsid == this.greeting.tsid){
			delete this.greeting;
			this.returnToStart();
		}
	}
}

function greetPlayer(pc){ // defined by npc_bureaucrat
	this.left_from = [this.x, this.y];
	this.greeting = pc;
	this.fsm_push_stack('greeting');
}

function helping_onEnter(previous_state){ // defined by npc_bureaucrat
	this.messages_register_handler('helping', 'helping_onMsg');

	var helping_points = [-205, -105, -5, 95];
	this.apiFindPath(Math.min(450, Math.max(this.helping.x+100, choose_one(helping_points))), -128, 0, 'onPathing');
}

function helping_onMsg(msg){ // defined by npc_bureaucrat
	if (config.is_dev) log.info(this+' helping_onMsg: '+msg);

	if (msg.from == 'pathing'){
		var args = msg.payload;

		if (args.status == 1){
			if (args.dir == 'left'){
				this.dir = 'left';
			}
			else if (args.dir == 'right'){
				this.dir = 'right';
			}

			this.npc_walk_speed = 60;
			this.setAndBroadcastState('walk2');
			this.fsm_event_notify('pathing_check', null, getTime()+200);
			this.is_pathing = true;
		}
		else if (args.status == 3 || args.status == 4){
			this.is_pathing = false;
			if (this.helping){

				// Turn to face the player
				if (this.helping.x > this.x){
					this.dir = 'right';
				}
				else{
					this.dir = 'left';
				}

				this.setAndBroadcastState('talk');
				if (this.helping['!bureaucracy_step'] > 1){
					var it = this.helping['!bureaucracy_item'];

					var txt = this.chooseResponse('purchasing_step2', this.helping);
						if(it.label.substring(0,4) == "Your") {
							txt = txt.replace(/{item_label}/g, '<b>'+it.label+'</b>');
						} else {
							txt = txt.replace(/{item_label}/g, 'a <b>'+it.label+'</b>');
						}
					var choices = [{txt: 'YES', value: 'yes'}];
					this.conversation_start(this.helping, txt, choices);
				}
				else{
					if (this.helping.achievements_has('card_carrying_qualification') && !this.helping.skills_has('bureaucraticarts_1')){
						var choices = {
							1: {txt: 'OK', value: 'nevermind'}
						};
						this.conversation_start(this.helping, "Go away, <b>"+this.helping.label+"</b>, we don't have time to waste on people who have not learned any Bureaucratic Arts.", choices);
					}
					else{
						this.sendResponse('helping_ready', this.helping);
						this.fsm_event_notify('helping_reminder', null, getTime()+8000);
					}
				}
			}
			else{
				delete this.returning;
				this.fsm_pop_stack();
			}
		}
	}
	else if (msg.from == 'pathing_check'){
		if (!this.helping) return;

		if (this.x <= this.helping.x +150 && this.x < 450){
			this.apiStopMoving();

			// Fake a pathing message
			this.fsm_event_notify('pathing', {status: 3}, getTime());
		}
		else if (this.is_pathing){
			this.fsm_event_notify('pathing_check', null, getTime()+200);
		}
	}
	else if (msg.from == 'conversation'){
		var pc = msg.payload.pc;
		var choice = msg.payload.msg.choice;

		if (choice == 'ok'){
			// Proceed to the next step
			pc['!bureaucracy_step']++;
			delete this.helping;
			delete this.will_help;
			this.returnToStart();

	   		var bureaucrat = this.container.items[pc['!bureaucracy_helper']];
			if (bureaucrat){
				log.info(bureaucrat+' will help '+pc);
				bureaucrat.helpPlayer(pc);
			}
		}
		else if (choice == 'yes'){
			// Send a random question
			var q = this.getRandomQuestion();
			var choices = [];
			for (var i=0; i<q.options.length; i++){
				choices.push({txt: q.options[i], value: 'random-'+i});
			}
			return this.conversation_reply(pc, msg.payload.msg, q.txt, choices);
		}
		else if (choice == 'nevermind'){
			// Cancel
			delete pc['!bureaucracy_step'];
			delete this.helping;
			delete this.will_help;
			this.returnToStart();
			this.showEndPrompt(pc);
		}
		else if (choice.substring(0, 7) == 'random-'){
			// Did they get it right? ;-)
			if (is_chance(0.4)){
	   			var bureaucrat = this.getRandomBureaucrat(pc);
				if (bureaucrat){
					bureaucrat.will_help = pc.tsid;
					pc['!bureaucracy_helper'] = bureaucrat.tsid;

					var txt = this.chooseResponse('purchasing_step3', pc);
					txt = txt.replace(/{bureaucrat_name}/g, '<b>'+bureaucrat.getLabel()+'</b>');
					var choices = [{txt: 'OK', value: 'ok'}];
				}
				else{
					var txt = 'Hmmm. It seems no one is able to help you with this. Please come back another time.';
					var choices = [{txt: 'OK', value: 'ok'}];
				}
			}
			else{
				var it = pc['!bureaucracy_item'];
				var txt = this.chooseResponse('purchasing_confirm', pc);
				txt = txt.replace(/{item_label}/g, '<b>'+it.label+'</b>');
				txt = txt.replace(/{item_cost}/g, '<b>'+it.cost+'</b>');
				var choices = [
					{txt: 'Pay '+it.cost, value: 'purchase'},
					{txt: 'Nevermind', value: 'nevermind'},
				];
			}

			return this.conversation_reply(pc, msg.payload.msg, txt, choices);
		}
		else if (choice == 'purchase'){
			var it = pc['!bureaucracy_item'];
			if (pc.stats_has_currants(it.cost)){
				if (pc.createItemFromSource(it.class_tsid, 1, this, true) == 0){
					pc.stats_remove_currants(it.cost, {type: 'bureaucrat', class_id: it.class_tsid});

					delete pc['!bureaucracy_step'];
					delete this.helping;
					delete this.will_help;
					this.returnToStart();
					this.showEndPrompt(pc);
				}else{
					return this.conversation_reply(pc, msg.payload.msg, "Oops, you don't have enough space in your inventory. Come back when you do.", [{txt: 'OK', value: 'nevermind'}]);			
				}
			}else{
				return this.conversation_reply(pc, msg.payload.msg, "Oops, you don't have enough for that. Come back when you do.", [{txt: 'OK', value: 'nevermind'}]);
			}
		}
		else{
			// We want to buy something
			if (!pc['!bureaucracy_step']) pc['!bureaucracy_step'] = 1;

			var items = this.getItems(pc);
			var it = null;
			for (var i=0; i<items.length; i++){
				if (items[i].class_tsid == choice){
					it = items[i];
					break;
				}
			}

			if (it){
				if (pc['!bureaucracy_step'] == 1){
					pc['!bureaucracy_item'] = it;
	   				var bureaucrat = this.getRandomBureaucrat(pc);
					if (bureaucrat){
						bureaucrat.will_help = pc.tsid;
						pc['!bureaucracy_helper'] = bureaucrat.tsid;

						var txt = this.chooseResponse('purchasing_step1', pc);
						if(it.label.substring(0,4) == "Your") {
							txt = txt.replace(/{item_label}/g, '<b>'+it.label+'</b>');
						} else {
							txt = txt.replace(/{item_label}/g, 'a <b>'+it.label+'</b>');
						}
						txt = txt.replace(/{bureaucrat_name}/g, '<b>'+bureaucrat.getLabel()+'</b>');
						var choices = [{txt: 'OK', value: 'ok'}];
					}
				}

				if (!txt){
					var txt = 'Hmmm. It seems no one is able to help you with this. Please come back another time.';
					var choices = [{txt: 'OK', value: 'ok'}];
				}

				return this.conversation_reply(pc, msg.payload.msg, txt, choices);
			}
			else{
				var txt = "Hmmm. I see your lips moving, but I don't understand the words. Maybe come back another time?";
				var choices = [{txt: 'OK', value: 'ok'}];

				return this.conversation_reply(pc, msg.payload.msg, txt, choices);
			}
		}

		this.conversation_end(pc, msg.payload.msg);
	}
	else if (msg.from == 'helping_reminder'){
		if (this.helping && !this.helping_started){
			if (this.container.activePlayers[this.helping.tsid]){
				this.setAndBroadcastState('talk');
				this.sendResponse('helping_reminder', this.helping);
				this.fsm_event_notify('helping_reminder', null, getTime()+8000);
			}
			else{
				delete this.helping;
				delete this.will_help;
				this.returnToStart();
			}
		}
	}
	else if (msg.from == 'player_exit'){
		if (this.helping && msg.payload.tsid == this.helping.tsid){
			delete this.helping;
			delete this.will_help;
			this.returnToStart();
		}
		else if (this.will_help && msg.payload.tsid == this.will_help){
			delete this.will_help;
		}
	}
	else if (msg.from == 'conversation_cancel'){
		var pc = msg.payload.pc;

		// Cancel
		delete pc['!bureaucracy_step'];
		delete this.helping;
		delete this.will_help;
		this.returnToStart();
		this.showEndPrompt(pc);
	}
}

function helpPlayer(pc){ // defined by npc_bureaucrat
	this.left_from = [this.x, this.y];
	this.helping = pc;
	this.fsm_push_stack('helping');
}

function idle_onEnter(previous_state){ // defined by npc_bureaucrat
	this.setAndBroadcastState(choose_one['idle0', 'idle1', 'idle2']);
	this.messages_register_handler('idle', 'idle_onMsg');
	this.fsm_event_notify('interval', null, getTime()+1000);
}

function idle_onMsg(msg){ // defined by npc_bureaucrat
	if (msg.from == 'interval'){
		if (is_chance(0.25) && this.container.instance_id && this.container.instance_id.substr(0, 17) == 'bureaucratic_hall'){
			this.apiFindPath(randInt(500, 1060), -128, 0, 'onPathing');
		}
		else{
			if (is_chance(0.1)) this.turnAround();
			this.setAndBroadcastState(choose_one(['idle0', 'idle1', 'idle2']));
			this.fsm_event_notify('interval', null, getTime()+randInt(1000, 10000));
		}
	}
	else if (msg.from == 'pathing'){
		var args = msg.payload;

		if (args.status == 1){
			if (args.dir == 'left'){
				this.dir = 'left';
			}
			else if (args.dir == 'right'){
				this.dir = 'right';
			}

			this.npc_walk_speed = randInt(20, 40);
			this.setAndBroadcastState('walk1');
		}
		else if (args.status == 3 || args.status == 4){
			this.setAndBroadcastState('idle0');
			this.fsm_event_notify('interval', null, getTime()+1000);	
		}
	}
	else if (msg.from == 'conversation' || msg.from == 'conversation_cancel'){
		if (this.container.isInstance('back_alley') && (msg.payload.msg.choice == 'proposition-ok' || msg.from == 'conversation_cancel')){
			var pc = msg.payload.pc;
			var prev = pc.instances_get_exit('back_alley');

			if (pc.back_alley_business && pc.back_alley_business == 'fuelmaking') {
				var dst = [];
				for (var i in config.transit_instances['subway_1'].stations) {
					if (config.transit_instances['subway_1'].stations[i].connects_to &&
							config.transit_instances['subway_1'].stations[i].connects_to.length) {
						dst.push(config.transit_instances['subway_1'].stations[i].connects_to);
					}
				}
				pc.quests_set_flag('talk_to_bureaucrat');
				
				if (!dst.length) {
					dst = null;
				}
			} else {
				var dst = (config.is_dev ? 'LHH10JE8R0Q108H' : ['LLI32G3NUTD100I', 'LA91JUQT2G82GUL', 'LA5I10NJDL52TKD']);
			}		

			if (dst) {
				var ret = pc.buildPath(dst, prev.tsid);

				var rsp = {
					type: 'get_path_to_location',
					path_info: ret.path
				};

				pc.apiSendMsg(rsp);
			}

			pc.instances_exit('back_alley');
			if (msg.from == 'conversation') this.conversation_end(pc, msg.payload.msg);
		}
		else{
			this.conversation_end(msg.payload.pc, msg.payload.msg);
		}
	}
}

function isBusy(){ // defined by npc_bureaucrat
	if (this.current_state == 'idle' && !this.will_help) return false;

	if (this.current_state == 'idle'){
		if (this.will_help && !this.container.activePlayers[this.will_help]){
			delete this.will_help;
			return false;
		}

		return true;
	}

	if (this.current_state == 'helping'){
		if (!this.helping){
			if (this.is_pathing) return true;

			delete this.returning;
			this.returnToStart();
			return true;
		}

		if (this.helping && !this.container.activePlayers[this.helping.tsid]){
			delete this.helping;
			delete this.will_help;
			this.returnToStart();
			return true;
		}

		return true;
	}

	return true;
}

function make_config(){ // defined by npc_bureaucrat
	var arms = this.getInstanceProp('arms') ? this.getInstanceProp('arms') : '01';
	var hair = this.getInstanceProp('hair') ? this.getInstanceProp('hair') : '01';
	var glasses = this.getInstanceProp('glasses') ? this.getInstanceProp('glasses') : 'none';
	var legs = this.getInstanceProp('legs') ? this.getInstanceProp('legs') : '01';
	var necklace = this.getInstanceProp('necklace') ? this.getInstanceProp('necklace') : '01';
	var tie = this.getInstanceProp('tie') ? this.getInstanceProp('tie') : 'none';
	var torso = this.getInstanceProp('torso') ? this.getInstanceProp('torso') : '01';

	return {
		arms: arms,
		hair: hair,
		glasses: glasses,
		legs: legs,
		necklace: necklace,
		tie: tie,
		torso: torso
	};
}

function onConversation(pc, msg){ // defined by npc_bureaucrat
	if (msg.choice.substr(0, 14) == 'locationevent_' && this.container.events_broadcast){
		this.container.events_broadcast(msg.choice.substr(14));
	}

	this.fsm_event_notify('conversation', {'pc': pc, 'msg': msg});
}

function onCreate(){ // defined by npc_bureaucrat
	this.initInstanceProps();
	this.apiSetPlayersCollisions(false);

	// Other setup
	this.default_state = 'idle';
	this.dir = 'left';
	this.fsm_init();
}

function propositionPlayer(pc){ // defined by npc_bureaucrat
	if (pc.back_alley_business) {
		if (pc.back_alley_business == 'fuelmaking') {
			var choices = {
				1: {
					txt: 'OK',
					value: 'proposition-ok'
				}
			};

			this.conversation_start(pc, "Here’sss the deal. We try to run an orderly operation, but sometimes it takes sssomething a little extra to keep the wheels of the Bureaucracy turning, if you catch my drift.<split butt_txt=\"I’m listening.\" />Sssee, I need a little extra work done, but just the requisition for the requisition must be filled out in hendecuplicate, and even then there’s little guarantee as to when it will be processsed. It’s mostly a matter of tradition, you understand.<split butt_txt=\"What is it you need, exactly?\" />I need a little assistance keeping the trainsss running smoothly. But as my predecessor on this project, Yusuf Cay, wandered into a ssstorm of paperwork and was never seen or heard from again, we’ll be handling this in an unofficial manner.<split butt_txt=\"What do I do?\" />Sssimply make a Fuel Cell with a Fuelmaker and then go to a Subway Station and all will become clear. I'll mark the closest station on your map. I promise you’ll be well rewarded for your effortsss.<split butt_txt=\"Gotcha.\" />", choices);
		}
	} else {
		var choices = {
			1: {
				txt: 'OK',
				value: 'proposition-ok'
			}
		};

		this.conversation_start(pc, "Psssst. Here'sss the deal. Getting your Card Carrying Qualification is the first step in the Bureaucratic Artsss. <split butt_txt=\"Oh, yeah?\"> Yesss, and once you have it you are on your way to being able to obtain Your Papersss (and all sorts of licenses and permits). <split butt_txt=\"Sounds handy\"> You can often acquire the Card Carrying Qualification and other bureaucratic documentsss directly from other players or at auctions, etc. <split butt_txt=\"Um, sketchy?\"> It'sss perfectly legal, but if you want to go the official route and don't mind the red tape, head over to the Bureaucratic Hall on Gregarious Grange, Baeli Bray or Chego Chase and talk to one of my friends there. You'll get what you need. <split butt_txt=\"OK\"> You can go back to wherever you were now: I'll set the closest Bureaucratic Hall as the destination on your map.", choices);
	}
}

function returnToStart(){ // defined by npc_bureaucrat
	if (this.returning) return;

	this.npc_walk_speed = 75;
	this.apiFindPath(this.left_from[0], this.left_from[1], 0, 'onPathing');
	this.returning = true;
}

function showEndPrompt(pc){ // defined by npc_bureaucrat
	if (!pc) return;
	pc.prompts_add({
		txt		: 'Thank you for your business. To conduct another transaction, you must exit and re-enter the Hall.',
		icon_buttons	: false,
		timeout		: 10,
		choices		: [
			{ value : 'ok', label : 'OK' }
		]
	});
}

function turnAround(){ // defined by npc_bureaucrat
	this.dir = (this.dir == 'left') ? 'right' : 'left';
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

function fullStop(){ // defined by npc
	this.apiStopMoving();
	this.apiCancelTimer('startMoving');
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

function onInteractionEnding(pc){ // defined by npc
	this.fsm_event_notify('interaction_ending', pc);
	if (this.waitingFor){
		delete this.waitingFor[pc.tsid];
	}
	this.checkWaiting();
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

function onInteractionStarting(pc, mouseInteraction){ // defined by npc
	this.fsm_event_notify('interaction_starting', pc);
	if (!this.waitingFor) this.waitingFor = {};
	this.waitingFor[pc.tsid] = 1;
	if (!this.isWaiting){
		this.isWaiting = 1;
		if (this.onWaitStart) this.onWaitStart(pc, mouseInteraction);
		this.apiSetTimer("checkWaiting", 1000);
	}
}

function onPathing(args){ // defined by npc
	this.fsm_event_notify('pathing', args);
}

function onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function onPlayerExit(pc){ // defined by npc
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

function getDescExtras(pc){
	var out = [];
	out.push([2, "Bureaucrats can be found in Bureaucratic Halls, located in <a href=\"\/locations\/LA5I10NJDL52TKD\/\" glitch=\"location|89#LA5I10NJDL52TKD\">Chego Chase<\/a> in Andra, in <a href=\"\/locations\/LLI32G3NUTD100I\/\" glitch=\"location|58#LLI32G3NUTD100I\">Gregarious Grange<\/a> in Groddle Meadow and in <a href=\"\/locations\/LA91JUQT2G82GUL\/\" glitch=\"location|97#LA91JUQT2G82GUL\">Baeli Bray<\/a> in Muufo."]);
	return out;
}

var tags = [
	"npc",
	"no_trade"
];

var responses = {
	"helping_ready": [
		"{pc_label}! Your turn!",
		"{pc_label}! You’re up!",
		"NEXT, {pc_label}!",
		"{pc_label}! Come forward!",
		"{pc_label}! Step up",
		"Ready for you now, {pc_label}!",
		"Attention, {pc_label}! When you’re ready?",
		"Who’s Next? {pc_label}? Is {pc_label} here?",
		"{pc_label}! Ready for you now!",
	],
	"helping_reminder": [
		"{pc_label}! It is now your turn. Come speak to me, or you will lose your turn.",
		"{pc_label}! Either come to the counter, or go to the back of the line.",
		"I haven’t got all day, {pc_label}! You can take your turn, or someone else can take theirs.",
		"Did you want something, {pc_label}? Now is your chance. Use it or lose it.",
		"{pc_label}! Come and speak to me now, if you please. Time is currants, {pc_label}!",
		"{pc_label}! Do you want to be seen today or not, {pc_label}? Come speak to me if you do.",
		"Time’s a’wasting, {pc_label}! Come speak to me or lose your place in line.",
		"{pc_label}! If you want your documentation, you need to come speak to me.",
		"Did you hear me, {pc_label}? Come take your turn, or lose your turn. Your choice.",
	],
	"purchasing_confirm": [
		"Very well. The fee is {item_cost}. We only accept cash.",
		"Acceptable. The fee is {item_cost}. Cash up front, please.",
		"That will do. Your fee is {item_cost}. Cash only.",
		"Excellent. The bureau charges {item_cost}. Cash only, I’m afraid.",
		"Very well. In that case, the fee is {item_cost}, and we only take cash.",
		"I’ll take that. The fee is {item_cost}, and I’ll take that, as well. In cash.",
	],
	"purchasing_step1": [
		"{pc_label}, as I understand, you are requesting {item_label}. You will have to speak to {bureaucrat_name} about that. Please wait a moment.",
		"I understand you’re hoping to attain {item_label}, {pc_label}. That’s a matter for {bureaucrat_name}. Let me find out if they’re in the office this week.",
		"So you’re requesting {item_label} are you, {pc_label}? {bureaucrat_name} is the official you need to speak to. Please bear with me a moment.",
		"{pc_label}, your request for {item_label} will have to be passed along to the correct department. Please wait while I ascertain the availability of – {bureaucrat_name}.",
		"{pc_label}? If you are seeking {item_label}, you must speak to {bureaucrat_name}. Please wait while I see if they’re taking appointments today.",
		"You wish to be granted {item_label} I understand, {pc_label}. That is a decision for {bureaucrat_name}, if they’re in today. Bear with me please…",
	],
	"purchasing_step2": [
		"Let’s see here… You are interested in obtaining {item_label}, correct?",
		"I understand you’re here to procure yourself {item_label}, is that right?",
		"What’s this, then? You’re hoping to acquire {item_label}, correct?",
		"I’m led to believe you’re interested in receiving {item_label}, is that correct?",
		"What do we have here, then?… I see. So, it’s {item_label} you’re after, is it?",
		"Right then, let’s see… You’re here hoping to procure {item_label}, are you?",
	],
	"purchasing_step3": [
		"I see. Perhaps you’d better talk to {bureaucrat_name} about this.",
		"Interesting. Perhaps you’d better talk to {bureaucrat_name} about this.",
		"Ah. In that case, you’ll need to speak with {bureaucrat_name}, this is outside my remit now.",
		"I see. It seems you’d be better off speaking to {bureaucrat_name} about this after all.",
		"Right. In that case, I think you’d better go speak to {bureaucrat_name} on this matter.",
		"Interesting. I believe the department you’re looking for is that of {bureaucrat_name}. Good day.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-43,"y":-88,"w":90,"h":85},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIFElEQVR42u2YWUxc5xXHaQOz3Vnu\nnZWBWWFWBphhhtUGM8AYCIvHLGOzGQwEHGwwDtjGeJvEhNhpYrte6rZR4lFUqS+NYjVRo7YPRWml\nSn2okKqqqipVSKkUVZWiUauqUh+qf7\/zEZy66ouTwfWDr3R079wZaX73f87\/O+e7eXnPjqfw2FNV\n5RxMJJJdjfvS3Xv3ZTobGjd6m+IPGiPRdFMkkqTv\/29wsVhMl6ir34g3VCIeL0VrjxnVtVbsabKj\ntt6GaMSBkMeDWNSR6ZtTND8xsFQioWuMxBZryyuyDc1mzK5pce4tPc7ckzD\/DR2W70o4tq7FoUUV\neqdUOHhMicOnVHh+XI7eaXk2NZun2zW4oNvtjPj9my3VtVyhkSUN5t\/QYemOhJPXdRz00rsGDk1Q\nc9d0GFtRc9jRswI6RmVILeyimgGXKxNwu0HRNy3hwIwCc1e1PBa\/KeLsdyScf1uPixkDBzz8kgqT\nlzRcRYqZK1ocWVXvDmBLX35zZbkNjQkT4t0SOoYFpKZ0OH7agZcu+3DpRiXW7sWwuG7DdFqDvjkl\nhhjgxHk1h6S097N7c69ps8t3xdybJ35QsdE+rEDnEVZLLyh4TZ045cAffzWNP\/\/hAt77dh\/+\/tl9\nXH2jCV0TcqROqjC8LGBwXsnBhpYEnmpScvKyenPlu1JuazFxWIb2ERkHI4CeKQXo3rX1Cnz03kH8\n9MNR\/OiDw2gfFNB1VI7krAKDC9tABElKEvQJZqTBeRXmr4vpnME19uSF2w4VIDEk44W+E92TcgYt\nR2tKhrZDMn7dzu7T73qnFdtwDJLACHLyohovvKLhih5ZUWdzBtg77Gpu7VczKDm6jyp4DMwJSI6o\nHwYpSspSCZCypPSOOQiQFKWHoOvZNQ1Pd\/ekYiIngP1dXc5zFwaRGNSisbcAPeMqjM1LWH3diSu3\nS3Dv+yHcuh\/E+i0Pzr5qx+gpHVeYYMnpHWMy\/nB1nfloPFDwUNHa9vzcpNlkKp4Y6O\/FxxtvY+1G\nEvH+Ag5K0TJQgLZUAVdtYFbAQtqM9bslzNUOvHjBxOFIXVKQlKf0c2Vnldm+YwXhr7YwB4POsoqW\nZLS644GrJIza2nr8YuN7+N1vP8Cdd6ZwYNKAOANsYqoQNJmIHD4wp2JwRqRvOHH1jgcXXnNg5qwB\n0+f0PE6+YslOLYlfDc5nFsLBYG22vLIZ0ZpO1l97YCkshcsdwEcfvoO\/fvYb\/OmTj3H3\/hTGFtwc\ncn9Ky9IvbZJ5uElmlJg6zdrgq8VYvWbHxTcd2ZdvuG5eue4O5yS1TmcZ3Ew5q6UYoYp9cLrKYS3y\nsntB3Lr5Mv7xt9\/jX\/\/c4vHjn9zAtbVh\/Pxn93mn2J\/Kb\/7vSKRy3Iftdt9WiCnocnhgs3lRVtGM\nYHkT7I4ymC1u3LuTxqef\/BJ\/+fTXWBlqRHq6Ez98\/\/5E3pM6nK4KhCpbECyrh8ViR3m4FYFQI4Mr\n4YAebwjv\/+A2Xl+dxlDMzAHj8bYHTwROysvTUUrLyvchVvM8DJIJwVATAmV7UGzzc0CK8SMDWF89\nivGWAFbnR1HsKNsKBlt3f1AVVbIMgTicIfj8NawGm+EPNvA0e\/3VKCr2cUC7w8dSfRnH+xuwMDcG\nd2kVKpjSNpsvvXtwivxmUZBD0urYH\/lZWvcywDjC0f1czVBlnIG5OTylOxSK4MXUPsx0x7ipqvZa\nwTpPNucDwc5R1yZfFIUCEKRBlOBiqfb4YtwgBBqKutngqcLQKQn1rX5uGmuhG\/EKN0qYgh2pcoye\nETCzps09ZP8JhTPeq2RweSxkMOgtMBoKuVKlnipmjCjqEgIfSAniyIqA\/X1RhKsS7CFqOGA4VoPD\nJ9k0zabo49e0izkFXL4jbuztkH8OmAejpGMOdj80BYXbr+OTzLaKKjR1u1FT342GvUlWg1FEq9vR\nM+ahgSA7ckaVG1fTZmb5W2JmhA2Z7cNfAFKqaYmxWr8AJPPUtBrQd0zN+qsaEVab1XVd7NyOUm81\nykJ7EK6uzPbN5mpaYWkdXxE2j15QY3hJxUchs4ngvga9qGftrQJeVoN2mxt6nZql3IwiWwk8\/iC\/\nT0sPrZEUnkAQNnuAudyblaQS3WOrRJuW8VVhgq4JbOysKr3wpi5LwyTVDO0jkmxEKq\/JZ4DPwWgs\nYrUX4SC0JhZZHRzQaCzkZ4fdzVrgdkv0+mvZuRJFRb4tUXQ\/3lpIcg+eUG6xDU02dVK5ePS8kFm6\nLfJRfHxVjZHTwudDpJzPag1d+bCY82EyOzkcBXWVktLIw1SXlIY5EC3o\/DdsfaRzaWkk+fhT8ZQi\nQ0VNaaQg93Gw5W3Vhpa2p94DbFxqShagruO5bHHx17fIwTsK0hLjC9Q+Uote5lxKMQV95\/VGM1\/a\nBP3HlZu0PBAQqUW7LvrcM6nA\/uGCDTaSP6jvzE8zOK4AM8mGpNXwdY4A\/YE61k3qYTI5stujVwVX\nkJR0On0wSWqI6vwNo6huNotC+EtBsr3CIptq02y4THeMy5K0Ifrf3STPadQbmCm0sJiKHqaZpXHj\nP3+nFeSLkkYGkyiHWVLBYtCgyKSDx2GCvUhM7mo\/Li50TVjMxbzlmZghzCYrzAZTRhQeUUdHkKJG\nlTGJag5YaGAPpdcwaCGzq4Dsj2+KGiUMOgFWo5b\/uZmlka4dhRICLuMjrzEYZFKvVaUpRPWTeaPF\n1FHeZIDZHTBKH4XTqifIrafmZSVTJUNKkhHMlD521utUm0\/VG1VK207QQPvsHfOz4zGOfwNowQNp\nuVGeYAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_bureaucrat-1342647391.swf",
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
	"npc",
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "debug",
	"g"	: "give_cubimal",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("npc_bureaucrat.js LOADED");

// generated ok 2012-10-16 14:30:00 by martlume
