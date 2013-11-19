//#include include/takeable.js, include/animal_naming.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Scion of Purple Cubimal";
var version = "1353719713";
var name_single = "Scion of Purple Cubimal";
var name_plural = "Scion of Purple Cubimals";
var article = "a";
var description = "It's a Scion of Purple Cubimal! Collect all Series 2 Cubimals!";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_cubimal_scionofpurple", "npc_cubimal_base", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"set_free_img"	: "0"	// defined by npc_cubimal_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.level = "1";	// defined by npc_cubimal_base
	this.instanceProps.xp = "0";	// defined by npc_cubimal_base
	this.instanceProps.next_level_amount = "10";	// defined by npc_cubimal_base
	this.instanceProps.health = "10";	// defined by npc_cubimal_base
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	level : ["what level is this"],
	xp : ["how much xp we have"],
	next_level_amount : ["how much xp to next level"],
	health : ["health"],
};

var instancePropsChoices = {
	ai_debug : [""],
	level : [""],
	xp : [""],
	next_level_amount : [""],
	health : [""],
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

verbs.paper_battle = { // defined by npc_cubimal_base
	"name"				: "Panache (battle)",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Battle against another cubimal to level up",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		//this.is_racing = true;
		//this.racing_owner = pc;

		//VARS FOR BATTLING
		this.is_fighting = true;
		this.fighting_owner = pc;
		this.hasTurned = false;
		this.hasMidPoint = false;
		this.state = "backing";
		this.facin='left';
		this.H = intval(this.getInstanceProp('health'));
		this.style = "p";
		this.firstStrike = true;
		delete this.targetC;

		this.former_slot = this.slot;
		this.former_container = this.container;
		pc.location.apiPutItemIntoPosition(this, pc.x, pc.y);
		pc.announce_sound('CUBIMAL_WIND_UP');

		this.apiSetTimer('search', 1000,pc);                      //start battle after 1 secs

		var pre_msg = this.buildVerbMessage(msg.count, 'battle', 'battled', failed, self_msgs, self_effects, they_effects);
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

verbs.scissors_battle = { // defined by npc_cubimal_base
	"name"				: "Wile (battle)",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Battle against another cubimal to level up",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		//this.is_racing = true;
		//this.racing_owner = pc;

		//VARS FOR BATTLING
		this.is_fighting = true;
		this.fighting_owner = pc;
		this.hasTurned = false;
		this.hasMidPoint = false;
		this.state = "backing";
		this.facin='left';
		this.H = intval(this.getInstanceProp('health'));
		this.type = "s";
		this.firstStrike = true;
		delete this.targetC;

		this.former_slot = this.slot;
		this.former_container = this.container;
		pc.location.apiPutItemIntoPosition(this, pc.x, pc.y);
		pc.announce_sound('CUBIMAL_WIND_UP');

		this.apiSetTimer('search', 1000,pc);                      //start battle after 2 secs

		var pre_msg = this.buildVerbMessage(msg.count, 'battle', 'battled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.battle = { // defined by npc_cubimal_base
	"name"				: "Gumption (battle)",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Battle against another cubimal to level up",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		//this.is_racing = true;
		//this.racing_owner = pc;

		//VARS FOR BATTLING
		this.is_fighting = true;
		this.fighting_owner = pc;
		this.hasTurned = false;
		this.hasMidPoint = false;
		this.state = "backing";
		this.facin='left';
		this.H = intval(this.getInstanceProp('health'));
		this.style = "r";
		this.firstStrike = true;
		delete this.targetC;

		this.former_slot = this.slot;
		this.former_container = this.container;
		pc.location.apiPutItemIntoPosition(this, pc.x, pc.y);
		pc.announce_sound('CUBIMAL_WIND_UP');

		this.apiSetTimer('search', 1000,pc);                      //start battle after 2 secs

		var pre_msg = this.buildVerbMessage(msg.count, 'battle', 'battled', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.pickup = { // defined by npc_cubimal_base
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by npc_cubimal_base
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

verbs.drop = { // defined by npc_cubimal_base
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

verbs.set_free_with_love = { // defined by npc_cubimal_base
	"name"				: "set free, with love",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Set me free",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!intval(this.getClassProp('set_free_img'))) return {state:null};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var img_gained = intval(this.getClassProp('set_free_img'));

		var choices = {
			1: {txt: 'Yes, go on, you\'re free now!', value: 'set_free'},
			2: {txt: 'No, I love you too much.', value: 'no'}
		};

		this.conversation_start(pc, 'Really, you want to set me free? I\'ll give you '+img_gained+' Imagination.', choices);
	}
};

verbs.name = { // defined by npc_cubimal_base
	"name"				: "name",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Give this Cubimal a name",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.user_name && this.canName(pc)){
			return {state:'enabled'};
		}
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var args = {
			input_label: 'My new name:',
			cancelable: true,
			input_focus: true
		};

		this.askPlayer(pc, 'name', 'Name Me!', args);
		this.getLabel();
		return true;
	}
};

verbs.rename = { // defined by npc_cubimal_base
	"name"				: "rename",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Change this Cubimal's name",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.user_name && this.canName(pc)) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var args = {
			input_label: 'My new name:',
			cancelable: true,
			input_focus: true
		};

		if (this.user_name) args.input_value = this.user_name;

		this.askPlayer(pc, 'name', 'Rename Me!', args);
		this.getLabel();
		return true;
	}
};

verbs.race = { // defined by npc_cubimal_base
	"name"				: "race",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Race it against another Cubimal",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.is_racing = true;
		this.racing_owner = pc;

		this.former_slot = this.slot;
		this.former_container = this.container;
		pc.location.apiPutItemIntoPosition(this, pc.x, pc.y);
		pc.announce_sound('CUBIMAL_WIND_UP');

		this.apiSetTimer('onRaceStart', 2000);
		this.dir = 'right';

		var pre_msg = this.buildVerbMessage(msg.count, 'race', 'raced', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function canPickup(pc, drop_stack){ // defined by npc_cubimal_base
	if (this.is_racing) return {ok: 0};
	if (this.is_fighting && this.targetC) return {ok: 0};
	if (!this.isSelectable(pc)) return {ok: 0};

	if(this.is_fighting && this.fighting_owner!=pc){
	return {ok: 0};
	}
	return {ok: 1};
}

function checkWin(targetC){ // defined by npc_cubimal_base
	if(this.targetC.H<=0) //if dead 
	{
	    this.doneFight=true;
	    this.targetC.doneFight=true;

	this.container.sendActivity(linkifyPlayer(this.fighting_owner, true)+" "+this.getLabel() +" defeated "+linkifyPlayer(this.targetC.fighting_owner, true)+" "+this.targetC.getLabel(),null, false, true);
	    

	    if (this.apiTimerExists("taunt")) { 
			this.apiCancelTimer("taunt");
	    }
	    if (this.targetC.apiTimerExists("taunt")) { 
			this.targetC.apiCancelTimer("taunt");
	    }
	    this.apiStopMoving();
	    this.targetC.apiStopMoving();
	    this.battleOver = true;                                       //end battle
	    //this.targetC.sendBubble("LOSER", 4000, this.targetC.fighting_owner);
	                var annc = {
				type: 'itemstack_overlay',
				swf_url: overlay_key_to_url('smoke_puff_overlay'),
				itemstack_tsid: this.targetC.tsid,
				delta_x: 0,
				delta_y: 120
			};

			this.container.apiSendAnnouncement(annc);
			this.container.announce_sound_to_all('PROTO_PUFF');

	    //declare loser on op
	    delete this.targetC.targetC;
	    this.targetC.apiSetTimer('returnToPack', 40);                    //return op to pack after 4 secs
	    //this.makeWinner(this.fighting_owner);                         //call make winner on this
	    this.apiSetTimer('makeWinner', 1000, this.fighting_owner, this.targetC);  
	}
	else //if not dead, output remaining health and say insult
	{
	    this.battleOver = false;                                           //battle not over 
	    this.fighting_owner.sendActivity(this.targetC.getLabel() + "'s Ego remaining: "+this.targetC.H,null, false, true);
	this.targetC.fighting_owner.sendActivity(this.targetC.getLabel() + "'s Ego remaining: "+this.targetC.H,null, false, true);
	}
}

function getLabel(){ // defined by npc_cubimal_base
	if (this.user_name) 
	{  
	     return this.user_name+" Lvl."+this.getInstanceProp('level');
	}
	else
	{
	      return this.label+" Lvl."+this.getInstanceProp('level');
	}
}

function getType(){ // defined by npc_cubimal_base
	if(this.type == "r" && this.targetC.type == "s")
	{
	   var mod = 1;
	}
	else if (this.type == "r" && this.targetC.type == "p")
	{
	   var mod = -1;
	}
	else if (this.type == "s" && this.targetC.type == "r")
	{
	   var mod = -1;
	}
	else if (this.type == "p" && this.targetC.type == "r")
	{
	   var mod = 1;
	}
	else if (this.type == "s" && this.targetC.type == "p")
	{
	   var mod = 1;
	}
	else if (this.type == "s" && this.targetC.type == "r")
	{
	   var mod = -1;
	}
	else
	{
	    var mod = 0;
	}

	return mod;
}

function isSwarm(){ // defined by npc_cubimal_base
	var cubimals = this.racing_owner.location.find_items(function (it) { return it.hasTag('cubimal'); });

	var swarm = [];
	for (var c in cubimals) { 

		if (cubimals[c].is_racing) { 
			swarm.push(cubimals[c]);
		}
	}

	//log.info("CUBI swarm is "+swarm);
	if ((config.is_dev && swarm.length >= 31) || swarm.length >= 31) { 
		for (var s in swarm) { 
			var cubi = swarm[s];
			//log.info("CUBI: granting achievement to "+cubi.racing_owner);
			cubi.racing_owner.achievements_grant("the_swarm");
		}
	}
}

function makeWinner(pc,targetC){ // defined by npc_cubimal_base
	var xpEarned = intval(targetC.getInstanceProp('level')*10);
	var nla = intval(this.getInstanceProp('next_level_amount'));
	var xp = intval(this.getInstanceProp('xp'));

	pc.feats_increment('tottlys_toys', 1);

	if(xp + xpEarned >= nla) //if leveled up
	{
	   this.setInstanceProp('level', intval(this.getInstanceProp('level'))+1); //increase level
	   this.setInstanceProp('next_level_amount', nla*2.2); //set new next level amount
	   this.setInstanceProp('xp', xp+xpEarned-nla); //set xp to 0 + amount remaining after level up
	   this.setInstanceProp('health', intval(this.getInstanceProp('health'))+2); //max health +2
	   this.sendBubble("LEVEL "+this.getInstanceProp('level')+"!", 4000, null);
	   this.name_single = this.getLabel();

	  pc.feats_increment('tottlys_toys', 1);
	}
	else
	{
	   this.setInstanceProp('xp', xp+xpEarned); //increase xp amount
	   this.sendBubble("+"+xpEarned+"xp!", 4000, null);
	}
	 
	//delete this.targetC;
	this.apiSetTimer('returnToPack', 4000); //return to pack
}

function onBattleLoop(targetC,pc){ // defined by npc_cubimal_base
	//this.container.sendActivity(this+"State: LOOP");

	this.fullStop();
	this.setAndBroadcastState('1');

	this.fighting_owner.announce_sound_stop('CUBIMAL_RACE');
	this.fighting_owner.announce_sound('CUBIMAL_WIND_DOWN');

	this.npc_walk_speed = 100;                                    //set walk speed
	log.info("CUBI: this.Rstart_point is "+this.Rstart_point);
	this.apiFindPath(this.Rstart_point, this.y, 0, 'onPathing');   //move back to start position
	                                     
	this.checkWin(this.targetC);  //check if battle is over or not

	if(this.battleOver==false)                                    //if battle not over
	{
	    this.apiSetTimer('taunt', 1500, this.targetC,pc);              //call battleStart() on op
	}

	this.state = "backing";
}

function onBattleStart(pc,targetC){ // defined by npc_cubimal_base
	//this.container.sendActivity(this+ " State: START");

	var level = intval(this.getInstanceProp('level'));
	var insults =["*choke*",
		      "Yo Momma so slooow!",
	              "You're more like a spherimal!",
	              "you're a Noobimal.",
	              "Any squarer and you'd be round.",
	              "You're so 2 dimensional!",
	              "You smell like guano",
	              "You're a Cubifail!",
	              "Tryin' to wind me up, or somethin'?",
	              "Your springs are rusted.",
	              "Your smack is wack!",
	              "You're more common than dirt.",
	              "You race like a sloth.",
	              "I've collected like 100 of you.",
	              "You're barely square!",
	              "I hope you're releasable.",
	              "My wit is going to unwind you",
	              "Cubimal? More like a RUBE-imal.",
		      "You couldn't race your way out of a bigger bag!",
	              "You've got the right angles, but the wrong moves!",
	              "Your mama's so square her milk comes out in cartons.",
		      "I'd rather collect the box"];

	var hadOp = (this.targetC)?true:false;

	{
	    var mod = this.getType();

	    this.setAndBroadcastState('race');
	    this.fighting_owner.announce_sound('CUBIMAL_RACE');

	     if(level>=18)
	     {
	 	 var damage = randInt(18, (18+3)+mod); 
	     }
	     else
	     {
	 	 var damage = randInt(level, (level+3)+mod); 
	     }
	     var actualDamage = randInt(level, (level+3)+mod);

	    if(level>=10)
	    {
	         var chokeRan = Math.floor((Math.random()*12)); 
	    }
	    else 
	    {
	         var chokeRan = Math.floor((Math.random()*10));
	    }
	    

	    if(chokeRan == 0){  damage = 0; }  //10% chance of choking
	log.info("CUBI Insult: "+insults[damage]);
	    this.speech = insults[damage];
	    this.apiSetTimer('showInsult', 100, this.speech,this.fighting_owner,this.targetC);   //say insult 
	    if(damage!=0)   //deal damage if we don't choke
	    {
	        if(this.speech == this.targetC.speech)
	        {
	            this.targetC.H-=Math.ceil(damage/2);  //if same insult do same damage
	        }
	        else
	        {
	            this.targetC.H-=actualDamage;
	        }
	    }
	}

	if(this.targetC)
	{
	    if(this.hasTurned == false)
	    {
		  if(this.targetC.x < this.x) //if on the left of us
		  {
	 	       this.dir = 'left';
	 	       this.facin = "left";
		  }
		  else //if on the right of us
		  {
	  	       this.dir = 'right';
	 	       this.facin = "right";
	 	  }
		  this.hasTurned = true;
	    }

	    if(this.hasMidPoint==false)
	    {
	         if(this.targetC)
		 {
	  	     var dis = Math.abs(this.x - this.targetC.x);
	  	     if(this.targetC.x<this.x)
	  	     {
	  	         this.Rstart_point = this.x-(dis/2)+50; //set start point
	   	     }
	   	     else
	   	     {
	    	         this.Rstart_point = this.x+(dis/2)-50; //set start point
	 	     }
	 	 }
	         this.hasMidPoint = true;
	    }
	}

	if(!hadOp)
	{ 
	   
	}

	this.npc_walk_speed = 150; //set speed

	if(this.targetC)
	{
	    if(damage!=0) //if not choking - move to opponent!
	    {
	         if(this.facin == "left")
	         {
	              this.apiFindPath(this.targetC.x+40, this.y, 0, 'onPathing');
	              this.targetC.facin = "right";
	         }
	         else
	         {
	      	      this.apiFindPath(this.targetC.x-40, this.y, 0, 'onPathing');
	              this.targetC.facin = "left";
	         }
	    }
	}

	//this.isSwarm(); // not sure what this does

	if(this.targetC)
	{
	   if(this.firstStrike == false)
	   {
	      this.apiSetTimer('onBattleLoop', 700, this.targetC,this.fighting_owner);
	   }
	   else
	   {
	      if(this.type=="r"){this.sendBubble("Gumption!", 1400, this.fighting_owner);}
	      if(this.type=="p"){this.sendBubble("Panache!", 1400, this.fighting_owner);}
	      if(this.type=="s"){this.sendBubble("Wile!", 1400, this.fighting_owner);}
	      if(this.targetC.type=="r"){this.targetC.sendBubble("Gumption!", 1400, this.targetC.fighting_owner);}
	      if(this.targetC.type=="p"){this.targetC.sendBubble("Panache!", 1400, this.targetC.fighting_owner);}
	      if(this.targetC.type=="s"){this.targetC.sendBubble("Wile!", 1400, this.targetC.fighting_owner);}
	      this.firstStrike = false;
	      this.targetC.firstStrike = false;
	      this.apiSetTimer('onBattleLoop', 1400, this.targetC,this.fighting_owner);
	   } 
	}
}

function onConversation(pc, msg){ // defined by npc_cubimal_base
	this.setAndBroadcastState('1');

	if (msg.choice == 'set_free'){

		var new_cubimal = pc.location.createItemStackWithPoof(this.class_tsid, 1, pc.x+80, pc.y-60);
		if (new_cubimal){
			new_cubimal.not_selectable = true;
			new_cubimal.apiSetTimerX('sendResponse', 300, 'set_free', pc, {});
			new_cubimal.apiSetTimerX('setFree', 2.5*1000, pc);

			pc.feats_increment('tottlys_toys', 5);

			this.apiDelete();
		}else{
			this.sendBubble('Something went wrong and I can\'t be set free.');
		}

	}
	this.conversation_end(pc, msg);
}

function onCreate(){ // defined by npc_cubimal_base
	this.initInstanceProps();
	this.setAndBroadcastState('1');

	this.npc_can_walk = true;
	this.npc_can_climb = false;
	this.npc_can_jump = false;
	this.npc_can_fall = false;

	//this.npc_walk_speed = randInt(30,55);
	this.npc_climb_speed = 25;
	this.npc_jump_height = 0;
	this.npc_can_fall = 0;

	this.apiSetPlayersCollisions(false);

	this.name_single = this.getLabel();
}

function onLoad(){ // defined by npc_cubimal_base
	this.onPrototypeChanged();
}

function onPathing(args){ // defined by npc_cubimal_base
	//this.fsm_event_notify('pathing', args); 

	if (args.status === 3 || args.status === 4) {
		if (this.apiTimerExists("onRaceEnd")) { 
			this.apiCancelTimer("onRaceEnd");
		}
	        
	        if(this.is_racing==true)
		{
			this.onRaceEnd();
		}
		//this.container.apiSendLocMsg({ type: 'location_event' });
	}

	return true;
}

function onPrototypeChanged(){ // defined by npc_cubimal_base
	log.info("Setting level for cubimal - level was "+this.getInstanceProp("level"));

	if (!parseInt(this.getInstanceProp("level")) 
		|| !parseInt(this.getInstanceProp("health"))
		|| !parseInt(this.getInstanceProp("next_level_amount"))
		|| !parseInt(this.getInstanceProp("xp"))
		) {
		this.setInstanceProp("level", 1);
		this.setInstanceProp("health", 10);
		this.setInstanceProp("xp", 0);
		this.setInstanceProp("next_level_amount", 10);
	}
}

function onRaceEnd(){ // defined by npc_cubimal_base
	this.fullStop();
	var distance = (this.x - this.start_point) / 100;
	this.container.sendActivity("'s "+this.name_single+" went "+distance+" planks before stopping.", this.racing_owner);
	this.setAndBroadcastState('1');

	this.racing_owner.announce_sound_stop('CUBIMAL_RACE');
	this.racing_owner.announce_sound('CUBIMAL_WIND_DOWN');

	if (distance >= 8.9) { 
		this.racing_owner.achievements_increment("cubimals_raced", "long_distance", 1);
	}

	if (distance >= 5){
		this.racing_owner.feats_increment('tottlys_toys', 2);
	}

	this.apiSetTimer('returnToPack', 3000);
}

function onRaceStart(){ // defined by npc_cubimal_base
	this.start_point = this.x;
	this.dir = 'right';

	this.npc_walk_speed = randInt(15, 85);
	this.apiFindPath(this.container.geo.r-200, this.y, 0, 'onPathing');
	this.setAndBroadcastState('race');

	this.isSwarm();

	this.apiSetTimer('onRaceEnd', randInt(2, 10)*1000);
	this.racing_owner.announce_sound('CUBIMAL_RACE');
}

function onTrade(from, to){ // defined by npc_cubimal_base
	if (this.user_name) delete this.user_name;
}

function returnToPack(){ // defined by npc_cubimal_base
	//log.info("Going back to: "+this.former_container+" - "+this.former_slot);

	var remaining = this.former_container.addItemStack(this, this.former_slot);
	if (remaining){

		if(this.is_racing){
		remaining = this.racing_owner.addItemStack(this);}

		if(this.is_fighting){
		remaining = this.fighting_owner.addItemStack(this);}

		if (remaining){
			if(this.is_racing){
			this.racing_owner.createItemFromFamiliar(this.class_tsid, 1);}
	                if(this.is_fighting){
			this.fighting_owner.createItemFromFamiliar(this.class_tsid, 1);}     

			this.apiDelete();
		}
	}

	delete this.is_racing;
	delete this.is_fighting;
	delete this.targetC;
	delete this.doneFight;
}

function search(pc){ // defined by npc_cubimal_base
	if (!this.targetC)
	{
	    var container = this.container;
	    if(!container.find_items) return;
	    //var cubi = container.find_items('npc_cubimal_piggy'); 
	    var cubiFind = this.fighting_owner.location.find_items(function (it) { return it.hasTag('cubimal'); });
	 
	    var cubi = [];
	    for (var c in cubiFind) {
			if(cubiFind[c].is_fighting && cubiFind[c].fighting_owner!=this.fighting_owner && !cubiFind[c].doneFight){
	                	if(Math.abs(cubiFind[c].x-this.x)<=450){
					if(this.apiFindPath(cubiFind[c].x,cubiFind[c].y,1,null)==true){
						cubi.push(cubiFind[c]);
					}
				}
			} 
	     }
	// && cubiFind[c].fighting_owner!=this.fighting_owner
	    if(!this.targetC)
	    {
		 for (var i in cubi)
		 {
	 	      if(cubi[i] != this)
	 	      {
			   if(!cubi[i].targetC || cubi[i].targetC == this)
			   {
	 	  	        this.targetC = cubi[i];
	                        this.targetC.targetC = this;
	                        this.container.sendActivity(linkifyPlayer(this.fighting_owner, true)+" "+this.getLabel() +" VS. "+linkifyPlayer(this.targetC.fighting_owner, true)+" "+this.targetC.getLabel(),null, false, true);
	                        break;
	                   }
		      }
		 }
	    }
	}

	if(!this.targetC) //if no cubi found, say come at me bro
	{
	    this.sendBubble("Come at me, Bro!", 3000, null);
	}
	else
	{
	      this.apiSetTimer('onBattleStart', 10, pc, this.targetC);
	}
}

function setFree(pc){ // defined by npc_cubimal_base
	this.apiMoveToXY(this.x, this.y-1000, 1500, "setFreeEnd");

	this.setAndBroadcastState('race');

	var img_gained = intval(this.getClassProp('set_free_img'));
	pc.stats_add_xp(img_gained, true, {type: 'cubimal_set_free'});
	pc.announce_sound('SPINACHJUMP');

	pc.achievements_increment('cubimals_freed', this.class_tsid, 1);
}

function setFreeEnd(){ // defined by npc_cubimal_base
	this.apiDelete();
}

function showInsult(amount,pc,targetC){ // defined by npc_cubimal_base
	if((amount == this.targetC.speech) && (amount != "*choke*") && (amount != null))
	{
	    amount = "No, "+amount;
	}
	return this.sendBubble(amount, 920, null);
}

function taunt(targetC,pc){ // defined by npc_cubimal_base
	this.targetC.onBattleStart(pc,this); //call battle on opponent
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

function npc_onPathing(args){ // defined by npc
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

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/series-2-cubimal-wrangler\/\" glitch=\"external|\/achievements\/trophies\/series-2-cubimal-wrangler\/\">Series 2 Cubimal Wrangler<\/a>"]);
	return out;
}

var tags = [
	"cubimal",
	"collectible",
	"no_auction",
	"npc-cubimal-2",
	"npc"
];

var responses = {
	"set_free": [
		"I will remember you always.",
		"You have been, and will always be, my friend",
		"Live long and be merry",
		"Yay, I'm free!",
		"Yay, I'm off to Cosmaland!",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-18,"y":-33,"w":35,"h":34},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAK40lEQVR42u2X2VNb5xnG8x\/wH9Qz\nvepMpnHcxknd2MVm3wUICa1oP9r3fUEHLQhJSAgQm9gExmCDjQE7i1PbUb2NYzc1iT1Tz3Q6w0zS\nXuuyl0+\/cyjYeImzOBlf9Mw8c3SkI52fnvd7l++tt\/5\/vPi4Wrha8eeJS5VvJNyV0cuHPxvb3L6S\n39x54+AuZ88d3syslDczZ8FoK7Mi+9kfOuXd4sw61w+96r4z8dlDy\/H58kr\/PPa0HJ\/7eV0seNcq\n8o5z5RH7SnnEtkwnqbWKl907G8pvzPaO4TkFx34+FxmoIetpZCxFpE1zGDBOlxP6ieceOOpOV466\nB7GnM3Qa86E0+zrvGqQpKlmhUmRkGnl6Qy0fLL0WuCRVqCBQ5aRxGgOGKfTrxhHT5hHRDINWZXZ6\nldnD+\/eaIqWUOQpGM74ormbiuBiPsddxYzRHwLY18kEwIoD0awFM6AuyA1DqIfSqBhFUJOGXJ+Dp\niZadoji7NmnKB0YDRh\/ORwL7Yq5Niv7yHhwj5VN\/7CcdfZrhjSdQKRbKJ4vDLY3AKQ7DIQrBJvCV\n3FJzpbvHCkYjNitmPLZ9DRjs+2AGVZq4l359SROUJ0t7UB4CldD1YTNOwmgIwtLthYnvgoHngLqF\n2jbxKTAaNGoOyCZzs3BBYwor0TR5nS6+nuxNrlW4xPS2S0LvOiUMYMEfxHo0iHO0D7MeN+xCC9Tt\nBsgaNVC2SVgF5eJ9eaVi9DTroe5y40wojM9zLKD1J8NJazWVhi5nWd\/pgEXAOOWGW+LEcq8HiwEn\n5rx2FFwWZE0ErkUFQa0UnJNtENRzQXV0QM1pA7eqAR++WwltB0Xc1rOiOBpoFOkf3\/5EVapD0np1\nqadeA0ZK8u91XBu0nWY4RSYWatxuxIhVT+AoJPVqqDgS1B1rxrF3KtH4YSN7Pvr2CVY1R1vY32k\/\nzodDqoCZb4GCZ\/\/hgLwaqkJaq87tgT0tRasWijaKdSqtp5AiUP1aBSJqGUIKCcSNHah6rwHck2JW\n4lrl\/ne5lULUvtcEIXGWe6qdJFsQJ9+tt\/7gcPbUq3d0rXrYuCa4eCZy1sNMQqNrUxEX5ZA0SSFs\nEMPEk6CXQPl7RHCJuyGqb0b10foDUE+DVf2unpWhW0LcM6O7Wkiu675\/DZyLLh3uU0cREDgRFDrg\n7bYeANRzVKBaZVC2SCCsE6CzuhPy1k6IG5rBOdUEcXMXu8YMXB0LJqiWHQBjxLjHKGmKs9desbl4\nMeKvdGmTnJcmTFYZPZyU08V+WQhRqR9hseeVgLImITpOcmAS2qHvtkFHyouFlJmwht5NgHY1u86Y\nUD4NyLjHZLu0QQbOiU6c6UuzyeY3JMpswf7mm284X3zxxcaNGzdKly9f3hiKD3Iyikg5JafxMsAU\nZcecx4Wi34Gc2YCwQgkbeZC0kc86+ew6Dami+HTiY9LWEjB0UfCQ+xlQm0QGfpUAg9YBFjZNPp8P\nJTDtcZR7tdHdbvL48WM8evQIX3\/99c5XX32Fe\/fuYa5vIvciwLzZj8uJCBGNVVLrGMBxh4ktuExS\n2IXd6K7ls6XnacCWY51o\/KCVtMMwNrPnkHfn4OvxwNtD6l9sDjwCKamXwq9wI2vxImIIPAntgwcP\nsLOzA+b13bt3Zffv38e3335bfFGI+5UuXEnFXgrolQpIsnAx5C9gbuAcxsLzGHSPgzYOkPBxWZeY\nMHqlbgw7BpGzp6Hr0LHvS9tFyKdS2Fg6jatXrz4Z2e7cuVNknNve3mapyYd4+PDhNjsiOUafC3FC\n5fhOwM4qLuzyEArxM5iKnUbEQtZUdh0X0mcw7MxA36mDmLglrpNCVCdhZROa4TM54Lc4IeGIEbYE\nOU82L4T22rVr2wzYJ598Urp06RJu377NNuyV4Y8wQiCfXYNxpRWLfvdzgG5SWpqIU7aeACYiCxin\n58GvlbAOrQ4skmkmwIbRJ3dhLjyB09FpLPQVyBDhwOzwKKo+qCF1sAZN77c9KTVbW1uczc3NMgHb\nWVtb21lfXwcB3snlcqWF7Pny6cwGRjxj6JW4D2SxjatFXG3AqNW4D6ho4aPxeBdC+gTyvbMYDU3D\nLHazgIo2OdQiGWxaAzxmG8l0CvP0JAvqktqwOjeHY789jqojdWg42lqq+X3NbpgJVJmB2gNeWFgo\nLy0tlRcXF+mlkfVyMbVG1tMqCrElxHWxl5YZaaMATQRO3WXBcLCAnlYNeNUiuJVBUnocEHMEmBrK\nYjo7jLgvhMnBIWRs\/ZgOjqKPCoJ2+RBxB9BnD+ycfLf2SZIQEDAKBoOHCoVCxeTkJFZWVjbYPUT\/\n2dJM\/wqm48ss4HhwDFlbFCExBSdXCmuHCPrWbpKBPHAqueiolpAEGUfWNwab1IO695v\/V4xlGOjt\nxbmZOfzmV29DwZVjeWIW\/VYaE74cWZspiJtEMCt04NbwcOpIfenUkbrdMjM1NVUiQjKZRCaTQbFY\nLFMUxdo7FVsqTUVPY9ybQU6tQYqMR3GxELSAjwC\/C25uJ+zt7TC1tUJY08aGN+HIIu0eRsqVA22I\nQ92pJ+tQhAny230uPzprO\/Cff\/8LSyOzyHoTZE+SwYgrjQFTBPIWOeQdhu1TR2qfDAwErCKbzRZT\nqVRpenp64\/r16\/vbx4m+Ym7cN4S8UoYhuXQfMCISINYjRoicQxIhnN1dkDfsAnpJrUs4MpC1qve7\nRfV79UiGw4h5Q3jn10dwafEccuE0ErY+5JxJDNkHMOxOYXN+CYtDmbKWJ7cym6hX9uJ8YJye1OoO\nAA4QrYa9bAbnbQYM6FTs8Klp2QVk1lzMMoAo6Qq9ugjpFi7kg1MwyjQYJVFSi+QQk5o3FEkgbgiz\n63A2nseD65\/jL1ubSPu90PJEzOC6oVJlvnuvPUOpt6c0ygOAF\/sCuEA2O88CGtp3AZ1ysjkyxkh4\no+jVRxDS0biQ34JP4YRZRSHi96E\/GCRr1ISsM4FLcyv4+OwK7l75FFtnlrCUH6EpXs2r3VswaIqz\nWjWeBlwP+0gnib4YsIOD1j91gOKZWaigNowAFYJfE8T5kQ3iVAIxXS8CpA6G1F4MumK4d+UzPLp1\nE6cnxlnI9YWF7e81Zi2bdPSigcKzgJPkvY9IF3kWMEDmP21LCymwPDSf4BN3nPCp\/fCqfPAovVgd\nXkfKEkPSTDZWxj5cmFxggf567Sp7ZvTw5s1iIfk91t1++TForM8C7q3BUb0G4wRuUKdGWCaGmYS3\n6zgP9UcEaP4DD12ke7iIU07SMRwyB9bGzmMmNoqZxAiur2+wrq0vFNmQbpc+x9lC4cdt1Ge0as4o\nZXgui58tM4o6Hto+kIP7IQl1VzvaT3VC2U4RJ22wii24duEy\/vm3L3H744\/2HWMAH968sf3o1q2f\ntkkP6froCOVFQqlHUio9CNjFh5WnAr9SC\/4JNWLEbTaj27lorewmHcQIk8BAHLuPG1uXWKhrF9dZ\nBz9dXc29vg26KnjIrSBjuMLLcck9tEvuop0yV8kutZeUzday8KQJPjIVT5FdXcZIukx3D5r\/KICe\nryWTNYV\/fPklm6U3ySCyPD5d\/PudO4fe+iUOVZPzkLzOBWmNHVmdlx3BckYreMTNrqqeHNWppH2U\ni3587y796NYN6y8GtndQLSFa3eSDot4NO9cDR5cLgpNGAqgrvvUmHIb2PlrX2gtNcwDKBi9kdWTg\nrLZtMPvoNwLQ0tlPmzoi0LeFSasLltT1Xs7rfsZ\/Afy7mVYCt198AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-07\/npc_cubimal_scionofpurple-1343768144.swf",
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
	"cubimal",
	"collectible",
	"no_auction",
	"npc-cubimal-2",
	"npc"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "debug",
	"v"	: "give_cubimal"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"t"	: "battle",
	"g"	: "give",
	"n"	: "name",
	"c"	: "paper_battle",
	"h"	: "race",
	"j"	: "rename",
	"o"	: "scissors_battle",
	"k"	: "set_free_with_love"
};

log.info("npc_cubimal_scionofpurple.js LOADED");

// generated ok 2012-11-23 17:15:13 by lizg
