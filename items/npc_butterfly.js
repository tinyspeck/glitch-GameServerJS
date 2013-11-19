//#include include/rook.js, include/animal_sadness.js, include/animal_naming.js, include/npc_quests.js, include/npc_conversation.js, include/npc_ai.js, include/events.js

var label = "Butterfly";
var version = "1354519131";
var name_single = "Butterfly";
var name_plural = "Butterflies";
var article = "a";
var description = "A morphously blue butterfly. As any fool knows, butter can't fly, but milk apparently can. Butterflies may need a little kindness (or massage) before they give up the milk, but milk can always be turned into butter… and cheese… and who knows what else?";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["npc_butterfly", "npc"];
var has_instance_props = true;

var classProps = {
	"got_quest_text"	: "I've got something for you...",	// defined by npc
	"no_quest_text"	: "",	// defined by npc
	"conversation_offset_y"	: "0",	// defined by npc_butterfly
	"conversation_offset_x"	: "0"	// defined by npc_butterfly
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.ai_debug = "0";	// defined by npc
	this.instanceProps.life_points = "400";	// defined by npc_butterfly
}

var instancePropsDef = {
	ai_debug : ["Turn on ai debugging for this instance"],
	life_points : ["How much life is left in this butterfly?"],
};

var instancePropsChoices = {
	ai_debug : [""],
	life_points : [""],
};

var verbs = {};

verbs.unrook = { // defined by npc_butterfly
	"name"				: "unrook",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 10,
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

verbs.rook_attack = { // defined by npc_butterfly
	"name"				: "rook_attack",
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

		if (pc.is_god) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.adminRook(pc);
		return true;
	}
};

verbs.debug = { // defined by npc
	"name"				: "debug",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 11,
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

verbs.revive = { // defined by npc_butterfly
	"name"				: "revive",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Help this butterfly escape the effects of The Rook. Costs $energy_cost energy",
	"get_tooltip"			: function(pc, verb, effects){

		return "Help this "+this.name_single+" escape the effects of The Rook. Costs "+effects.energy_cost+" energy";
	},
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

verbs.talk_to = { // defined by npc_butterfly
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(this.isRooked()) {
			return {state:null};
		}
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

verbs.set_free = { // defined by npc_butterfly
	"name"				: "set free",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Costs 5 energy, rewards 20 mood",
	"get_tooltip"			: function(pc, verb, effects){

		if(this.user_name) {
			var result = "Release a "+this.name_single+" named "+this.user_name+" into the wilderness. "+verb.tooltip;
		} else {
			var result = "Release this "+this.name_single+" into the wilderness. "+verb.tooltip;
		}

		return result;
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(!this.container.owner || this.container.owner != pc) {
			return {state:null};
		}

		if(!pc.skills_has('herdkeeping_1')) {
			return {state:'disabled', reason: "You need to know Herdkeeping to set animals free."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.free_pc = pc;
		if(this.user_name) {
			var prompt_text = "Are you sure you want to let your butterfly named "+this.user_name+" out into the wilderness?";
		} else {
			var prompt_text = "Are you sure you want to let your butterfly out into the wilderness?";
		}

		pc.prompts_add({
			is_modal: true,
			txt		: prompt_text,
			icon_buttons	: false,
			choices		: [
				{ value : 'ok', label : 'OK' },
				{ value : 'cancel', label : 'Cancel' }
			],
			callback	: 'prompts_itemstack_location_callback',
			itemstack_tsid: this.tsid
		});

		return true;
	}
};

verbs.apply_balm = { // defined by npc_butterfly
	"name"				: "apply balm to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		return "Revive this "+this.label+" with some Rook Balm"
	},
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

verbs.apply_youth = { // defined by npc_butterfly
	"name"				: "apply youth potion",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Make this Butterfly young again",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'potion_animal_youth' ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid != 'npc_butterfly') {
			return {state: null};
		}

		function has_potion(it){ return it.class_tsid == 'potion_animal_youth' ? true : false; }
		if (pc.findFirst(has_potion)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		function is_potion(it){ return it.class_tsid == 'potion_animal_youth' ? true : false; }
		var potion = pc.findFirst(is_potion);

		if (!is_potion){
			return false;
		}

		msg.target = this;

		return potion.verbs['pour'].handler.call(potion, pc, msg);
	}
};

verbs.name = { // defined by npc_butterfly
	"name"				: "name",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Give this Butterfly a name",
	"get_tooltip"			: function(pc, verb, effects){

		return "Give this "+this.name_single+" a name";
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (!this.user_name && this.canName(pc)) return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var args = {
			input_label: 'My new name:',
			cancelable: true,
			input_focus: true
		};

		this.askPlayer(pc, 'name', 'Name Me!', args);
		delete this.was_attracted;
		return true;
	}
};

verbs.rename = { // defined by npc_butterfly
	"name"				: "rename",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Change this Butterfly's name",
	"get_tooltip"			: function(pc, verb, effects){

		return "Change this "+this.name_single+"'s name";
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
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
		delete this.was_attracted;
		return true;
	}
};

verbs.sing_to = { // defined by npc_butterfly
	"name"				: "sing to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Your song might scare them",
	"get_tooltip"			: function(pc, verb, effects){

		if (pc.achievements_has("butterfly_whisperer")){
			return "Sing, and get wisdom";
		}

		return verb.tooltip;
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) return {state: null};

		if (!pc.achievements_has("butterfly_whisperer")) return {state: null};

		if (this.isSad()){
			return {state:'disabled', reason:"Can't do that! Butterfly is sad!."};
		}

		var limit = 1;
		if (pc.checkSkillPackageOverLimit('sing_to', limit, this)) return {state:'disabled', reason: "You already sang to this Butterfly enough today."};

		if (pc.metabolics_get_energy() <= 2) return {state:'disabled', reason: "You don't have enough energy to do that."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		// http://svn.tinyspeck.com/wiki/SpecButterfly#Butterfly_Wisdom

		if (!this.num_times_sung_to) {
			this.num_times_sung_to = 0;
		}

		if (!pc.achievements_has("butterfly_whisperer")){
			failed = 1;
			self_msgs.push("The butterfly is agitated by your decidedly un-dulcet tones. It flies away.");
		}
		else if (pc.achievements_has("butterfly_whisperer")){
			
			//
			// First column is chance out of 10, second column is minimum level to see it, third column is maximum level to see it, fourth column is the wisdom
			//

			var choices = [
				[10,	1,	7,	"If a plant isn't hungry, don't feed it, silly."],
				[10,	1,	7,	"Have you been hoeing weedy patches to no avail? Soil Appreciation will help you."],
				[10,	1,	7,	"After you tend a weedy patch, plant something quickly, or all your efforts will be for naught."],
				[10,	3,	10,	"If you want to choose what kinds of beans to plant, you're going to need a Bean Seasoner."],
				[10,	1,	5,	"You'll have more luck nibbling piggies if you pet and feed them first."],
				[10,	1,	999,	"Of course the chicken came before the egg. That's why it crossed the road."],
				[3,	1,	999,	"Cosma does not remember the butterflies, but we remember her."],
				[5,	1,	999,	"What is the sound of one piggy napping?"],
				[5,	1,	999,	"Don't take any wooden coins."],
				[10,	1,	999,	"Don't sweat the petty things. Also, don't pet the sweaty things."],
				[10,	1,	999,	"A pig in the hand is worth two in the poke."],
				[10,	1,	999,	"Now is the Kukubee Winter of our discontent."],
				[10,	1,	7,	"Cherries are the root of all fruits"],
			];
			
			var available = [];
			for (var index in choices){
				var choice = choices[index];
				if (pc.stats.level >= choice[1] && pc.stats.level <= choice[2]){
					for (var i=0; i<choice[0]; i++){
						available.push([choice[0], choice[3]]);
					}
				}
			}

			var wisdom = choose_one(available);
			//self_msgs.push('The butterfly replies, "'+wisdom[1]+'"');
			
			var slugs = {};
			var boost = Math.ceil(0.5 / ( wisdom[0] / 10 ));
			var xp = Math.ceil(0.05 * pc.metabolics.energy.top) * boost;
			var energy_cost = xp * 2;
			if(pc.metabolics_get_energy() < energy_cost) {
				pc.sendActivity("You lack sufficient energy to kick out the jams. Maybe you should eat something?");
				return false;
			}

			var ak_level = pc.skills_get_highest_level('animalkinship_1');

			var life = 1;
			if (ak_level >= 6) { life = 3; }
			else if (ak_level >= 3) { life = 2; }


			if (this.num_times_sung_to < 100) {
				life = this.addLifePoints(pc, life);
			}

			// Don't increment this counter if the butterfly was already maxed.
			if (life > 0) {
				this.num_times_sung_to ++;
			}

			var actual_xp = pc.stats_add_xp(xp, false, {'verb':'sing_to','class_id':this.class_tsid});
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: actual_xp
			});
			slugs.xp = actual_xp;

			var val = pc.metabolics_lose_energy(energy_cost);
			if (val){
				self_effects.push({
					"type"	: "metabolic_dec",
					"which"	: "energy",
					"value"	: val
				});

				slugs.energy = val;
			}

			this.sendBubble(wisdom[1], 5000, pc, slugs);

			pc.achievements_increment('butterflies', 'sung_to');
			pc.announce_sound('BUTTERFLY_SING');

			pc.incrementSkillPackageLimit('sing_to', this);

			// pc.feats_increment_for_commit(3);
			pc.feats_increment('animal_love', 3);
		}
		var pre_msg = this.buildVerbMessage(msg.count, 'sing to', 'sang to', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		delete this.was_attracted;
		return failed ? false : true;
	}
};

verbs.milk = { // defined by npc_butterfly
	"name"				: "milk",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Extract the nectar. Costs $energy_cost energy",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) return {state: null};

		if (this.isSad()){
			return {state:'disabled', reason:"Can't do that! Butterfly is sad!"};
		}

		var ret = this.canMilk(pc);
		if (!ret['ok']){
			return {state:'disabled', reason: "You can only milk this "+this.name_single+" "+pluralize(ret['limit'], 'time', 'times')+" per game day."};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('ak_butterfly_milk');
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (!this.massagers) this.massagers = {};
		if (this.massagers[pc.tsid] == current_day_key() || pc.skills_has('animalkinship_6')){
			pc.runSkillPackage('ak_butterfly_milk', this, {word_progress: config.word_progress_map['milk'], no_fail: !pc.has_done_intro, overlay_id: 'butterfly_milk', callback: 'onMilkComplete', msg: msg});
			
			delete this.was_attracted;
			pc.feats_increment('animal_love', 1);
			return true;
		}
		else{
			self_msgs.push("What? No warmup? No preamble? You just walk up to a butterfly with your clammy hands and try to milk it? You have a lot to learn about charming butterflies.");
			failed = 1;
			var pre_msg = this.buildVerbMessage(msg.count, 'milk', 'milked', failed, self_msgs, self_effects, they_effects);
			pc.sendActivity(pre_msg);
			delete this.was_attracted;
			return false;
		}
	}
};

verbs.massage = { // defined by npc_butterfly
	"name"				: "massage",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 60,
	"tooltip"			: "Advised before milking. Requires Butterfly Lotion",
	"get_tooltip"			: function(pc, verb, effects){

		if (pc.skills_has('animalkinship_6')){
			return "Unnecessary at this point";
		}

		if (pc.skills_has('animalkinship_5')){
			return "Advised before milking. No lotion required";
		}

		return verb.tooltip;
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.isRooked()) return {state: null};

		if (this.isSad()){
			return {state:'disabled', reason:"Can't do that! Butterfly is sad!."};
		}

		var ret = this.canMassage(pc);
		if (!ret['ok']){
			return {state:'disabled', reason: "You can only massage this "+this.name_single+" "+pluralize(ret['limit'], 'time', 'times')+" per game day."};
		}

		var package_details = pc.getSkillPackageDetails('ak_butterfly_massage');
		var lotion_amount = package_details['bonus_amount'];

		if (lotion_amount && !pc.checkItemsInBag("butterfly_lotion", lotion_amount)){
			return {state:'disabled', reason: "Massaging a butterfly without lotion? That's not nice. It's too dry. Go find some lotion."};
		}

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var package_details = pc.getSkillPackageDetails('ak_butterfly_massage');
		var lotion_amount = package_details['bonus_amount'];

		if (!lotion_amount || pc.checkItemsInBag("butterfly_lotion", lotion_amount)){
			
			var lotion = pc.findFirst('butterfly_lotion');
			pc.runSkillPackage('ak_butterfly_massage', this, {overlay_id: 'butterfly_massage', word_progress: config.word_progress_map['massage'], tool_item: lotion, callback: 'onMassageComplete', msg: msg});

			delete this.was_attracted;
			pc.feats_increment('animal_love', 1);
			return true;
		}
		else if (!pc.checkItemsInBag("butterfly_lotion", 1)){
			failed = 1;
			self_msgs.push("Massaging a butterfly without lotion? That's not nice. It's too dry. Go find some lotion.");
			var pre_msg = this.buildVerbMessage(msg.count, 'massage', 'massaged', failed, self_msgs, self_effects, they_effects);
			pc.sendActivity(pre_msg);

			if (pc.achievements_has('butterfly_whisperer')){
				this.sendResponse('massage_without_lotion', pc);
			}
			else{
				this.sendResponse('massage_without_lotion_gibberish', pc);
			}
			delete this.was_attracted;
			return false;
		}
	}
};

function addLifePoints(pc, num){ // defined by npc_butterfly
	if (!this.instanceProps || !this.instanceProps.life_points) this.initInstanceProps();
	if (typeof this.instanceProps.life_points == 'undefined' || this.instanceProps.life_points == ''){
		this.instanceProps.life_points = 400;
	}

	var life = this.instanceProps.life_points;

	var old_life = life;

	life = intval(life) + intval(num);

	if (life > 400) { 
		life = 400;
	}

	this.instanceProps.life_points = life;

	return (life - old_life);
}

function canMassage(pc){ // defined by npc_butterfly
	var package_class = 'ak_butterfly_massage';
			
	var details = pc.getSkillPackageDetails(package_class);
	if (!details) return {ok: 0, error: 'No matching details'};
			
	var fail = pc.checkSkillPackageOverLimit(package_class, details.interval_limit, this);
			
	return {
		ok: fail ? false : true,
		limit: details.interval_limit
	};
}

function canMilk(pc){ // defined by npc_butterfly
	var package_class = 'ak_butterfly_milk';
			
	var details = pc.getSkillPackageDetails(package_class);
	if (!details) return {ok: 0, error: 'No matching details'};
			
	var fail = pc.checkSkillPackageOverLimit(package_class, details.interval_limit, this);
			
	return {
		ok: fail ? false : true,
		limit: details.interval_limit
	};
}

function flyAround(){ // defined by npc_butterfly
	if (this.isRooked()) return;
	if (this.isSad()) return;

	if (!this.container || !this.container.geo){
		// give it a second to allow the NPC to be placed in a containing street
		this.apiSetTimer('flyAround', 1000);
		return;
	}

	// fly around the bottom portion of the screen
	var g = this.container.geo;
	var height = 200;
	var floor = g.b;
	if (g.ground_y) floor = g.ground_y;
	var max_h = floor-height;

	if (this.move_limits && this.move_limits.y >= max_h) { // up on the screen is the -y axis

		this.ai_debug_display("Obeying move limits");

		var l = this.move_limits.x - this.move_limits.w;
		var r = this.move_limits.x + this.move_limits.w;

		//log.info("BFLY step 1 l is "+l +" r is "+r);

		var shift = 0;
		if (l < g.l) { 
			
			shift = g.l - l;
			l = g.l;

			//log.info("BFLY adjust left l is "+l +" r is "+r+" shift is "+shift); 
		}

		r += shift;
		if (r > g.r) {
			shift = g.r - r; 
			r = g.r; 


			//log.info("BFLY adjust right l is "+l +" r is "+r+" shift is "+shift); 
			
			l += shift;
		}


		//log.info("BFLY final shift l is "+l +" r is "+r+" shift is "+shift); 

		var width = r - l;
	}
	else { 
		//  no move limits, or move limits not reachable
		this.ai_debug_display("Clearing move limits");

		this.clearMovementLimits();

		var l = g.l;
		var width = g.r-g.l;
	}

	this.ai_debug_display("Flying in area "+l+" "+max_h+" "+width+" "+height);
	//log.info("BFLY  area "+l+" "+max_h+" "+width+" "+height);
	this.apiStartFlyingInTheArea(l, max_h, width, height);

	// Check once a minute for achievements
	if (time() - this['!achievement_check'] >= 60){
		// How many  butterflies are here?
		var butterflies = 0;
		for (var i in this.container.items){
			if (this.container.items[i].class_tsid == 'npc_butterfly') butterflies++;
		}

		if (butterflies >= 5){
			pc.achievements_grant('butterfly_attendant');
		}

		if (butterflies >= 13){
			pc.achievements_grant('fivestar_butterfly_concierge');
		}

		this['!achievement_check'] = time();
	}
}

function freeButterfly(){ // defined by npc_butterfly
	if(this.user_name) {
		this.free_pc.sendActivity("The butterfly named "+this.user_name+" has gone to enjoy its life in the wilderness.");
	} else {
		this.free_pc.sendActivity("Your butterfly has gone to enjoy its life in the wilderness.");
	}

	this.apiDelete();
}

function leave(){ // defined by npc_butterfly
	this.apiDelete();
}

function modal_callback(pc, value, details){ // defined by npc_butterfly
	if(value == 'ok') {

		var slugs = {};

		var val = pc.metabolics_add_mood(20);
		slugs.mood = val;

		val = pc.metabolics_lose_energy(5);
		slugs.energy = val;

		this.sendResponse('set_free_in_pol', pc, slugs);

		this.container.apiSendAnnouncement({
			type: 'itemstack_overlay',
			itemstack_tsid: this.tsid,
			swf_url: overlay_key_to_url('smoke_puff'),
			delay_ms: 2500,
			allow_bubble: true,
			delta_y: 95,
			follow: true,
			duration: 1500
		});
		this.apiSetTimer('freeButterfly', 3000);
	}
}

function moveToWait(){ // defined by npc_butterfly
	if (this.isRooked()) return;
	if (this.isSad()) return;
	if (!this.is_waiting) return;

	// move to next to pc
	var x = this.wait_pc.x - 20;
	var y = this.wait_pc.y - 100;
	this.apiStartFlyingInTheArea(x, y, 10, 10);

	// follow the pc while we're still focused on them
	this.apiSetTimer('moveToWait', 500);
}

function onContainerChanged(oldContainer, newContainer){ // defined by npc_butterfly
	// Check for magic bfly sticks on the level
	//log.info("Created bfly, checking for bfly sticks");
	var items = this.container.items;
	for (var i in items){
		var it = items[i];
		if (it.class_id == "magic_butterfly_stick" && it.is_placed){
			var dist = parseInt(it.getInstanceProp('distance'));

			//log.info("Setting movement limits "+dist+" on butterfly"+this);
			this.setMovementLimits(it.x, it.y, dist);
		}
	}

	this.flyAround();
}

function onContainerItemAdded(addedItem, oldContainer){ // defined by npc_butterfly
	if (addedItem.class_tsid == this.class_tsid){
		this.onSadnessCheck();
	}
}

function onContainerItemRemoved(item, newContainer){ // defined by npc_butterfly
	// Clear data if the bfly stick is removed.
	if (item && item.class_tsid == 'magic_butterfly_stick' && item.is_placed) {
		this.ai_debug_display("Clearing movement limits");
		this.clearMovementLimits();
		this.flyAround();
	}
	else if (item && item.class_tsid == this.class_tsid){
		this.onSadnessCheck();
	}
}

function onCreate(){ // defined by npc_butterfly
	this.initInstanceProps();
	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(400, 400);

	this.broadcastStatus();
}

function onLoad(){ // defined by npc_butterfly
	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(400, 400);

	if (this.locationIsDepressing() && this.class_tsid == 'npc_butterfly') {
		this.apiDelete();
	}
}

function onMassageComplete(pc, ret){ // defined by npc_butterfly
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (ret['ok']){
		var lotion = ret.args.tool_item;

		var slugs = ret.slugs;
		self_effects.push({
			"type"	: "metabolic_dec",
			"which"	: "energy",
			"value"	: ret.values['energy_cost']
		});

		// Mood bonus!
		var actual_mood = ret.values['mood_bonus'];
		var got_bonus = false;
		if (ret.details['bonus_multiplier'] && (is_chance(ret.details['bonus_chance']) || pc.buffs_has('max_luck'))){
			var mood = actual_mood * ret.details['bonus_multiplier'];
			if (mood > ret.details['bonus_multiplier']) actual_mood = pc.metabolics_add_mood(mood - ret.details['bonus_multiplier']) + ret.values['mood_bonus'];
			got_bonus = true;
		}

		if (actual_mood){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: actual_mood
			});
			slugs.mood = actual_mood;
		}

		if (ret.values['xp_bonus']){
			self_effects.push({
				"type"	: "xp_give",
				"value"	: ret.values['xp_bonus']
			});
		}

		if (lotion && !lotion.isWorking()){
			lotion.apiDelete();
		}

		pc.achievements_increment('butterflies', 'massaged');
		if (!this.massagers) this.massagers = {};
		var today = current_day_key();
		this.massagers[pc.tsid] = today;

		//
		// trim the massagers list, while we're here
		//
		for (var i in this.massagers){
			if (this.massagers[i] != today){
				delete this.massagers[i];
			}
		}

		if (pc.getQuestStatus('animalkinship_massage_butterflies') == 'todo'){
			if (!pc.butterflies_massaged) pc.butterflies_massaged = {};
			if (!pc.butterflies_massaged[this.tsid]){
				pc.butterflies_massaged[this.tsid] = true;
				pc.quests_inc_counter('butterflies_massaged', 1);
			}
		}

		if (pc.achievements_has('butterfly_whisperer')){
			if (got_bonus){
				if (!pc.skills_has('animalkinship_5')){
					this.sendResponse('massage_bonus_ak4', pc, slugs);
				}
				else if (!pc.skills_has('animalkinship_6')){
					this.sendResponse('massage_bonus_ak5', pc, slugs);
				}
				else if (!pc.skills_has('animalkinship_7')){
					this.sendResponse('massage_bonus_ak6', pc, slugs);
				}
				else{
					this.sendResponse('massage_bonus_ak7', pc, slugs);
				}
			}
			else{
				if (!pc.skills_has('animalkinship_2')){
					this.sendResponse('massage_ak1', pc, slugs);
				}
				else if (!pc.skills_has('animalkinship_4')){
					this.sendResponse('massage_ak2_ak3', pc, slugs);
				}
				else if (!pc.skills_has('animalkinship_6')){
					this.sendResponse('massage_ak4_ak5', pc, slugs);
				}
				else{
					this.sendResponse('massage_ak6_ak7', pc, slugs);
				}
			}
		}
		else{
			if (!pc.skills_has('animalkinship_2')){
				this.sendResponse('massage_ak1_gibberish', pc, slugs);
			}
			else{
				this.sendResponse('massage_ak2_ak3_gibberish', pc, slugs);
			}
		}

		this.broadcastStatus();

		pc.location.cultivation_add_img_rewards(pc, 4.0);

		if (this.container.eventFired) this.container.eventFired('verb_massage_success', this);

		pc.feats_increment_for_commit(1);
	}
	else{
		failed = 1;
		self_msgs.push("Oh no, that didn't work!");
		if (this.container.eventFired) this.container.eventFired('verb_massage_fail', this);
	}

	var pre_msg = this.buildVerbMessage(this.count, 'massage', 'massaged', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);
}

function onMilkComplete(pc, ret){ // defined by npc_butterfly
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	if (ret['ok']){

		var death = this.removeLifePoints(pc,2);

		var slugs = ret.slugs;

		if (ret.values['energy_cost']){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: ret.values['energy_cost']
			});
		}

		if (ret.values['mood_bonus']){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: ret.values['mood_bonus']
			});
		}

		var xp_value = ret.values['xp_bonus'];

		if (death.xp){
			xp_value+=death.xp;
			slugs.xp+=death.xp;
		}

		if (xp_value){
			self_effects.push({
				"type"	: "xp_give",
				"value"	: xp_value
			});
		}

		if (pc.stats_get_daily_counter('butterfly_milk_long_text') == 0){
			self_msgs.push("The butterfly responds to your firm yet gentle touch by excreting several drops of its most precious essence. Conveniently, the butterfly also has a vial handy for holding said essence.");
			pc.stats_inc_daily_counter('butterfly_milk_long_text');
		}

		var proto = apiFindItemPrototype('milk_butterfly');

		var got_bonus = false;
		var milk_count = ret.details['bonus_amount'];
		if (ret.details['bonus_multiplier'] && (is_chance(ret.details['bonus_chance']) || pc.buffs_has('max_luck'))){
			var harvest_effects = [];
			var bonus_items = milk_count * (ret.details['bonus_multiplier'] - 1);
		
			harvest_effects.push({
				"type"	: "item_give",
				"which"	: (bonus_items > 1) ? proto.name_plural : proto.name_single,
				"value"	: bonus_items
			});

			var harvest_msg = "Super Harvest! " + this.buildSimpleVerbMessage(null, harvest_effects, they_effects);
		
			pc.createItemFromOffsetDelayed('milk_butterfly', bonus_items, {x: 0, y:-75}, false, 4000, harvest_msg, pc);
			pc.show_rainbow('rainbow_superharvest', 1000);
			pc.quests_inc_counter('butterfly_milk_max_reward', 1);
			got_bonus = true;

		}

		if (milk_count){
			var val = pc.createItemFromSource('milk_butterfly', milk_count, this);
			if (val){
				self_effects.push({
					"type"	: "item_give",
					"which"	: "Butterfly Milk",
					"value"	: val
				});
			}

			pc.achievements_increment('butterflies', 'milked');

			if (pc.getQuestStatus('animalkinship_milk_butterflies') == 'todo' || pc.getQuestStatus('master_milker') == 'todo'){
				if (!pc.butterflies_milked) pc.butterflies_milked = {};
				if (!pc.butterflies_milked[this.tsid]){
					pc.butterflies_milked[this.tsid] = true;
					pc.quests_inc_counter('butterflies_milked', 1);
				}
			}

			if (!slugs.items) slugs.items = [];
			slugs.items.push({
				class_tsid	: 'milk_butterfly',
				label		: proto.label,
				count		: milk_count,
				//itemstack_tsid	: 'IWESKDJF345' //sent when applicable
			});
		}

		
		if (death.dying){
			if (pc.achievements_has('butterfly_whisperer')){
				this.sendResponse('ascend_to_higher_plain', pc, slugs);
			} else {
				this.sendResponse('milk_ak2_ak3_gibberish', pc, slugs);
			}
			self_msgs.push("The butterfly ascends to a higher plane.");	
		} else {
			if (pc.achievements_has('butterfly_whisperer')){
				if (got_bonus){
					if (!pc.skills_has('animalkinship_4')){
						this.sendResponse('milk_bonus_ak3', pc, slugs);
					}
					else if (!pc.skills_has('animalkinship_5')){
						this.sendResponse('milk_bonus_ak4', pc, slugs);
					}
					else if (!pc.skills_has('animalkinship_6')){
						this.sendResponse('milk_bonus_ak5', pc, slugs);
					}
					else if (!pc.skills_has('animalkinship_7')){
						this.sendResponse('milk_bonus_ak6', pc, slugs);
					}
					else{
						this.sendResponse('milk_bonus_ak7', pc, slugs);
					}
				}
				else{
					if (!pc.skills_has('animalkinship_2')){
						this.sendResponse('milk_ak1', pc, slugs);
					}
					else if (!pc.skills_has('animalkinship_4')){
						this.sendResponse('milk_ak2_ak3', pc, slugs);
					}
					else if (!pc.skills_has('animalkinship_6')){
						this.sendResponse('milk_ak4_ak5', pc, slugs);
					}
					else{
						this.sendResponse('milk_ak6_ak7', pc, slugs);
					}
				}
			}
			else{
				if (!pc.skills_has('animalkinship_2')){
					this.sendResponse('milk_ak1_gibberish', pc, slugs);
				}
				else{
					this.sendResponse('milk_ak2_ak3_gibberish', pc, slugs);
				}
			}
		}

		this.broadcastStatus();
		pc.location.cultivation_add_img_rewards(pc, 4.0);

		if (this.container.eventFired) this.container.eventFired('verb_milk_success', this);

		pc.feats_reset_commit();
	}
	else{
		self_msgs.push("Oh no, that didn't work. Try again?");
		failed = 1;
		if (this.container.eventFired) this.container.eventFired('verb_milk_fail', this);
	}

	var pre_msg = this.buildVerbMessage(this.count, 'milk', 'milked', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);
}

function onOverlayDismissed(pc, payload){ // defined by npc_butterfly
	if(this.isRooked()) {
		this.doReviveCancel(pc);
	}
}

function onPlayerCollision(pc){ // defined by npc_butterfly
	if(this.isRooked()) {
		this.rookedCollision(pc);
	} else if (this.conversations){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}
}

function onRevived(){ // defined by npc_butterfly
	this.flyAround();
	this.broadcastStatus();
}

function onRooked(){ // defined by npc_butterfly
	// fall to the closest platline
	var pl = this.container.apiGetPointOnTheClosestPlatformLineBelow(this.x, this.y-1);
	if (pl){
		this.apiSetXY(pl.x, pl.y);
	}

	this.apiSetTimer('onRookedInterval', 3000);
	this.broadcastStatus();
}

function onRookedInterval(){ // defined by npc_butterfly
	if (!this.isRooked()){
		return;
	}

	if (!this['!rooked_tick']){
		this.setAndBroadcastState('fly-rooked');
		this['!rooked_tick'] = 1;
		var duration = 1200;
	}
	else{
		this.setAndBroadcastState('rest-rooked');
		this['!rooked_tick'] = 0;
		var duration = 3000;
	}

	this.apiSetTimer('onRookedInterval', duration);
}

function onStatus(pc){ // defined by npc_butterfly
	var is_rook_verbs = this.isRooked();
	var is_tend_verbs = !is_rook_verbs;

	var status = {
		is_rook_verbs: is_rook_verbs,
		is_tend_verbs: is_tend_verbs,
		verb_states: {}
	};

	if (pc){

	if (this.class_tsid == 'npc_butterfly'){
		if (!this.massagers) this.massagers = {};
		if (this.massagers[pc.tsid] == current_day_key() || pc.skills_has('animalkinship_6')){
			var can_milk = this.canMilk(pc);
			if (can_milk['ok']){
				status.verb_states['milk'] = {
					enabled: !this.isRooked(),
					disabled_reason: '',
					warning: false,
					item_class: "milk_butterfly"
				};
			}
		}
		else{
			var can_massage = this.canMassage(pc);
			var package_details = pc.getSkillPackageDetails('ak_butterfly_massage');
			var lotion_amount = package_details['bonus_amount'];

			if (can_massage['ok'] && ((lotion_amount && pc.checkItemsInBag("butterfly_lotion", lotion_amount) || !lotion_amount))){
				status.verb_states['massage'] = {
					enabled: !this.isRooked(),
					disabled_reason: '',
					warning: false,
					item_class: 'butterfly_lotion'
				};
			}
		}
	}
	else{
		if (this.food_counter >= 10){
			status.verb_states['feed'] = {
				enabled: !this.isRooked(),
				disabled_reason: '',
				warning: false
			};
		}
	}

	}

	return status;
}

function onVerbMenuOpen(pc){ // defined by npc_butterfly
	if(this.isRooked()) {
		this.cancelRookConversation(pc);
	}
}

function onWaitEnd(){ // defined by npc_butterfly
	log.info('---------------onWaitEnd()');
	delete this.is_waiting;
	delete this.wait_pc;

	if (this.isRooked()) return;
	if (this.isSad()) return;

	if (this.following){
		if (this.follow_pc){
			if (apiIsPlayerOnline(this.follow_pc.tsid)){
				if (this.follow_pc.location.tsid == this.container.tsid){

					this.apiStartFlyingAndFollow(this.follow_pc, 300);
					return;
				}
			}

			// either the player we're following has gone offline,
			// or has moved to another location. commence random movement
			delete this.follow_pc;
		}
	}

	this.flyAround();
}

function onWaitStart(pc, mouseInteraction){ // defined by npc_butterfly
	if (this.isRooked()) return;
	if (this.isSad()) return;

	log.info('---------------onWaitStart('+pc.tsid+')');

	this.apiStopMoving();
	this.is_waiting = 1;
	this.wait_pc = pc;
	this.state = 'fly-top';

	// Only pause for mouse interactions. Fly towards the player for local interaction stuff.
	if (this.distanceFromPlayer(pc) >= 100 && mouseInteraction){
		this.apiStartFlyingInTheArea(this.x, this.y, 10, 10);
	}
	else{
		this.moveToWait();
	}
}

function removeLifePoints(pc, points){ // defined by npc_butterfly
	if (!this.instanceProps || !this.instanceProps.life_points) this.initInstanceProps();
	if (typeof this.instanceProps.life_points == 'undefined' || this.instanceProps.life_points == ''){
		this.instanceProps.life_points = 400;
	}

	// For public streets, only remove life if there is more than one chicken on the street:
	var population = this.container.countItemClass(this.class_tsid);
	if(this.container.pols_is_pol() || population > 1) {
		this.instanceProps.life_points -= points;
	}

	if (this.instanceProps.life_points <= 0){
		var xp_bonus = 50;
		pc.stats_add_xp(xp_bonus, false, {'verb':'removeLifePoints','class_id':this.class_tsid});
		this.apiSetTimer('leave', 6000);
		this.container.apiSendAnnouncement({
			type: 'itemstack_overlay',
			itemstack_tsid: this.tsid,
			swf_url: overlay_key_to_url('smoke_puff'),
			delay_ms: 5500,
			delta_y: 95,
			follow: true,
			duration: 1500
		});
		return { xp: 50, dying: true };
	} else {
		return { xp: 0, dying: false };
	}
}

function stopFollowing(){ // defined by npc_butterfly
	delete this.following;
	delete this.follow_pc;

	if (this.isRooked()) return;
	if (this.isSad()) return;

	this.flyAround();
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

function onPlayerEnter(pc){ // defined by npc
	this.fsm_event_notify('player_enter', pc);

	if (this.pathfinding_paused) this.startMoving();
}

function onPlayerExit(pc){ // defined by npc
	this.fsm_event_notify('player_exit', pc);
}

function setMovementLimits(x_pos, y_pos, width){ // defined by npc
	this.move_limits = {x:x_pos, y:y_pos, w:width};

	//log.info("move_limits is "+this.move_limits);
}

function conversation_canoffer_what_the_butterfly_saw_1(pc){ // defined by conversation auto-builder for "what_the_butterfly_saw_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "perspectives_of_a_patch_4")){
			return true;
	}
	return false;
}

function conversation_run_what_the_butterfly_saw_1(pc, msg, replay){ // defined by conversation auto-builder for "what_the_butterfly_saw_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "what_the_butterfly_saw_1";
	var conversation_title = "What the Butterfly Saw";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	if (!msg.choice){
		choices['0']['what_the_butterfly_saw_1-0-2'] = {txt: "No?", value: 'what_the_butterfly_saw_1-0-2'};
		this.conversation_start(pc, "OMG. You remember that global ice-storm thing? When all the bubble trees got like totally frozened-up? And people started that major icebubble fight? But the bubbles were the size of everyone's heads and as hard as, like, rock? And then it got like rilly tragic rilly quickly?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'what_the_butterfly_saw_1', msg.choice);
	}

	if (msg.choice == "what_the_butterfly_saw_1-0-2"){
		choices['1']['what_the_butterfly_saw_1-1-2'] = {txt: "Nice.", value: 'what_the_butterfly_saw_1-1-2'};
		this.conversation_reply(pc, msg, "Man, that was funny. But, y’know. Like, BAD? \nBut funny.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'what_the_butterfly_saw_1', msg.choice);
	}

	if (msg.choice == "what_the_butterfly_saw_1-1-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_what_the_butterfly_saw_2(pc){ // defined by conversation auto-builder for "what_the_butterfly_saw_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "what_the_butterfly_saw_1")){
			return true;
	}
	return false;
}

function conversation_run_what_the_butterfly_saw_2(pc, msg, replay){ // defined by conversation auto-builder for "what_the_butterfly_saw_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "what_the_butterfly_saw_2";
	var conversation_title = "What the Butterfly Saw";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	if (!msg.choice){
		choices['0']['what_the_butterfly_saw_2-0-2'] = {txt: "What happened, then?", value: 'what_the_butterfly_saw_2-0-2'};
		this.conversation_start(pc, "So, right, butterflies haven’t always been small?  We were, like, superhuge when Cosma first thought us up. Like, huuuuuuuuuuuuge.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'what_the_butterfly_saw_2', msg.choice);
	}

	if (msg.choice == "what_the_butterfly_saw_2-0-2"){
		choices['1']['what_the_butterfly_saw_2-1-2'] = {txt: "OMG?!?…", value: 'what_the_butterfly_saw_2-1-2'};
		this.conversation_reply(pc, msg, "Spriggan. Spriggan said one of us flapped our wings and, on the other side of another world, one of his precious forests had been flattened in the gale. Or something. ", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'what_the_butterfly_saw_2', msg.choice);
	}

	if (msg.choice == "what_the_butterfly_saw_2-1-2"){
		choices['2']['what_the_butterfly_saw_2-2-2'] = {txt: "O_o !!!", value: 'what_the_butterfly_saw_2-2-2'};
		this.conversation_reply(pc, msg, "O I no, rite?!? Anyway. Soon as he had enough power? He thought 'n' thought 'n' thought till we were all tiny. We’ll never grow up proper again, he said. Least, that’s what I heard.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'what_the_butterfly_saw_2', msg.choice);
	}

	if (msg.choice == "what_the_butterfly_saw_2-2-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"what_the_butterfly_saw_1",
	"what_the_butterfly_saw_2",
];

function parent_onPlayerCollision(pc){ // defined by npc
	apiResetThreadCPUClock();
	this.fsm_event_notify('player_collision', pc);
	apiResetThreadCPUClock("onPlayerCollision_"+this.class_tsid);
}

function parent_onWaitEnd(){ // defined by npc
	this.fsm_event_notify('wait_end', null);
}

function parent_onWaitStart(pc){ // defined by npc
	this.fsm_event_notify('wait_start', pc);
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Butterflies can be milked for <a href=\"\/items\/50\/\" glitch=\"item|milk_butterfly\">Butterfly Milk<\/a>."]);
	out.push([2, "Butterflies can be grown from  <a href=\"\/items\/368\/\" glitch=\"item|caterpillar\">Caterpillars<\/a>."]);
	return out;
}

var tags = [
	"npc",
	"animal",
	"no_trade",
	"npc-animal"
];

var responses = {
	"ascend_to_higher_plain": [
		"k flutterin off now. bai!",
		"k bai!!!!1!",
		"g2g byeeeeeee!!!!!!!!",
		"<3 u bai!!! have a nice life!!!",
		"{{{{hugz}}}}} byeeeee!!!",
		"No moar milx! Dyin now! Yay bai!!",
		"OMG back 2 Cosma!!! I <3 U!!!",
		"g2g!",
		"Done?! I won?!? YAY!!!",
		"l8rs! \/Nevrs! Bai bai bai 4eva!!!!!!!!",
	],
	"massage_ak1": [
		"Mmmf. Not bad.",
		"Massage ok. ‘Spose.",
		"Like, whatever",
		"K, thanx.",
	],
	"massage_ak1_gibberish": [
		"Askimble ubble gite nud razzafrazza rhubarb",
		"Ruttle snottfig squeebug fallgite schmee rugger",
		"Nookle flubber wezzent tie lupose rhubarb flap",
		"Meh fat strop portoff frite pice",
		"Flitup pickr rhubarb tokayai poze",
	],
	"massage_ak2_ak3": [
		"Yeah. So can I go hang with my butterfriends now?",
		"Unmf",
		"Ok, so, great massage. Can I, like, go?",
		"Yeah, so, thanks. I guess.",
		"Yeah, so-so, whatevs, k bai.",
	],
	"massage_ak2_ak3_gibberish": [
		"rutter flubbtoo spose quite nice rhubarb twonk",
		"buffrum gish flih not bad frakock kweezle",
		"nickpu flotter meh not unpleasant frumk",
		"croopy picklr so thass okay iffoo mumble nunk",
		"rhubarb tosstpottee I like it soafcan dowitmoar",
	],
	"massage_ak4_ak5": [
		"So um I dunno? Like, I guess I liked that? Kinda?",
		"Yeah, so that was like, not bad? I suppose? Thanks?",
		"So, like, that was quite good?",
		"I mean, whatever and everything? But that was ok and stuff?",
		"Well, totally not unpleasant? So yeah? whatever?",
		"Like, whatever?…",
		"Yeah, so, um. Ok? Thanks?",
		"Yeah? So nice massage? Whatever?",
		"So, I mean, the massage? It was, like, ok? Thanks?",
		"Right, so I liked your massage? So, like, thanks?",
	],
	"massage_ak6_ak7": [
		"Thnx, Bigthing.",
		"OMG ur like, gr8",
		"AWSUM msrg.",
		"i &lt;3 u + ur msrgs",
		"K thnx ttyl :)",
		"Msrg! I &lt;3 msrgs! \\o\/",
		"\\o\/",
		"LOL! Ur, like, all msrgy!",
		"i &lt;333 u!!!!1!",
		"Thnx!",
		"K THNX 4 MSRG BAI!",
		"Ur nice 4 msrgin me. xoxo",
		"OMG UR AWSM! \\o\/",
		"&lt;333 msrgs",
		"Yay thnx bigthing. ttyl…",
	],
	"massage_bonus_ak4": [
		"So I'm like, happy? So, um, you should be happy too?",
		"Yeah, so, massages make everyone happy, right?",
		"Like, I can totes be nice too, yeah?",
		"So yeah? You're nice? Be, um, happy, yeah?",
		"Ok, so, ping!?! Are you, like, happier too now?",
	],
	"massage_bonus_ak5": [
		"Ugh. Good moods are so uncool? You have mine.",
		"Like, whatever? But, so, you're awesome?",
		"So, yeah. You should be, like, happy?",
		"You're, like, awesome. Cheer up, yeah?",
		"Whatever? Yeah? Ok so, like, thanks!",
	],
	"massage_bonus_ak6": [
		"OMG ur gr8! Mood++!",
		"TY! i &lt;3 ur msrg! ur awsm!",
		"U wnt ++mood? U gets!",
		"Yay, thnx! I &lt;3 msrgs!",
		"LOL! I likes you LOADS!",
	],
	"massage_bonus_ak7": [
		":) +++++++++",
		"i &lt;3 ur msrgs &lt;------------------&gt; mch!",
		"i &lt;3333333333 u!",
		"Mood+++!!!!!!!1!",
		"\\o\/ Yaaaaaaaay!!!! R u happy?",
	],
	"massage_without_lotion": [
		"Ow! Why not just rub me with gravel?!",
		"OMFG! 2 DRY! UR rubbish.",
		"Ooo, ow, no, bad, stoppit.",
		"Jeez, if you can’t do it properly…",
		"Git ur dry hands off! Yow!",
	],
	"massage_without_lotion_gibberish": [
		"ruzzle fruzza bugroff mumble",
		"noliyk frakkig soddov rhubarble",
		"watta grunkle peff",
		"razzafrazzin digdassurdy",
		"Yeahright.",
	],
	"milk_ak1": [
		"Whoa milky!",
		"Here: milx",
		"Milx 4 U",
		"Got milx?",
		"Milky milky",
		"Here. S’good for growing teeth and stuff. And tails.",
	],
	"milk_ak1_gibberish": [
		"Fruzzup air oogoh merp",
		"Kruffin ilx ans uff",
		"Toffuzzin rappat ulk",
		"Rufflin bilky mong. Urk.",
		"Pufflunk norky tonk rnmrnmrnm",
	],
	"milk_ak2_ak3": [
		"I got some containers too!",
		"OMG you again! Take milk. K?",
		"There. Milx. Happy? Bai.",
		"UR OK. U can has milx.",
		"K, so I has milx. You wants?",
		"Here! Made you beer! I kiddin’. Is milx.",
	],
	"milk_ak2_ak3_gibberish": [
		"Pikgug fup here y'are urk fopple",
		"Snuggurp have these enflurkle",
		"Runkle some milk then flub rmnrnmrnmrm",
		"Glubfoo milk you wanted rhuburble bunk",
		"Snurfle milk, yeah? Ok, ruffgrm mnurmnur.",
	],
	"milk_ak4_ak5": [
		"So you wanted milk, yeah? Like, whatever?",
		"Yeah, like, you can have this milk? Like, totally?",
		"Whatever, yeah? So I made you milk?",
		"Right, so, like, milk? There? Have it?",
		"So like you can have milk again sometime? Or whatever?",
		"Right, so here's your milk?",
		"Alright so yeah, whatever? Here's your milk?",
		"So like, somehow you milked me, and I made this?",
		"Hey, you want this? I guess? 'Cos you milked me?",
		"Whatever and that, but take this milk, yeah?",
	],
	"milk_ak6_ak7": [
		"OMG I TOTES DID U MILX!",
		"i got milx 4 u!!!!!1!!",
		"Milx r awsum! U r awsum!",
		"i &lt;3 u! milx! ttyl!!!1!",
		"gt milx? Ys! ROFL!!!!1!!",
		"You needs milx! You totes HAZ milx!!!",
		"1t milx? Gotz milx! YAY!",
		"I maded milx.",
		"Look @ my milx! U can haz!!!!!!!!!!",
		"U &lt;3 milx? I &lt;3 u!!!",
		"YAY I MADEZ YOU MILX!!!1!",
		"Here iz milx! l8r!!!!",
		"U likez ur milx? YAY! Bai!!!",
		"All theez milxez r 4 u! &lt;3333",
		"Milx! Enjoi! xoxo",
	],
	"milk_bonus_ak3": [
		"Don't let it go to your head, yeah? I just have extra.",
		"Yeah, extra milk, whatevs. Doesn’t mean we’re friends.",
	],
	"milk_bonus_ak4": [
		"So I made you extra milk? Like? Whatever?",
		"Yeah, so, like, you want some extra or what?",
		"Like, you want extra? I made extra.",
		"You can totes have this extra milk? I don't want it.",
		"You want extra milks? Like, whatevs.",
	],
	"milk_bonus_ak5": [
		"I'm totally super-milky right now. Don't wanna talk about it.",
		"K, so whatevs, but I made you extra today?",
		"You can have extra, I guess, 'cos you're ok.",
		"Yeah, so I'm, like, super-milky? TMI? Want extra?",
		"I have, like, too much milk. You can have more.",
	],
	"milk_bonus_ak6": [
		"Xtra-milx 4 u 2day!",
		"OMG! 8-O Supr-milx!!!!!",
		"Yayz! Multi-milx!",
		"o_O!!!!!!1! So many milx!",
		"O rly? Moar milx? OKAYZ!",
	],
	"milk_bonus_ak7": [
		"i &lt;&lt;&lt;3 u THS much milx!",
		"++++++++++milx. Srsly.",
		"u &lt;3 milx? i &lt;3 u.",
		"OMG! +++++Milx!",
		"Lotsamilx. k? kewl. ttyl!!!!1!!",
	],
	"revived_1st_time": [
		"Thnx! Am still hurty. More revives? And more-more?",
		"Eugh. Bettr? But not? Pls halp more?",
		"Teh rux 2 hurtee 4 me. Pls 2 revive moar?",
		"I is +good. But not ++good. More reviving, pls?",
		"2x moar revives? Pls? So sicky. Stupid rux.",
	],
	"revived_2nd_time": [
		"i <3 u. U mades me almost bettr. 1 more times?",
		"I h8 rux. I still hurtz. Moar?",
		"OMG. I &lt;3 ur revinin. Pls do again? Someone? Pls?",
	],
	"revived_3rd_time": [
		"YAYZ!!!!!1!!! {pc_label} SAVED ME FROM TEH RUX! LOL!",
		"OMGiant I &lt;3 u {pc_label}!!!!!! Thnx!",
		"UR teh AWESUM! Thnx {pc_label}. I r unruxed! ROFL!",
	],
	"rooked": [
		"Noooooo. I h8 teh rux!!!!!1!! Revive meeeeeee!",
		"Pls halp. Pls. Need revives! Pls!!!",
		"OMG ROOK. PLS HALP.",
		"OMGiant teh RUX! It HURTZ. Pls. Pls halp.",
		"Hurty hurty hurty hurty rux. Pls make bettr?",
	],
	"set_free_in_pol": [
		"OMGiant! BAIIIIiiiiiiiiIIIiiiiii!!!",
		"<3 u bai!",
		"cu l8rs yah? L8rs!",
		"K Bai!",
		"ttfn!!!!!1!",
		"l8r g8r!!!",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-24,"y":-46,"w":50,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAG3klEQVR42u2X\/U9TVxjH+Q80uvjj\nTJb9MAUk2xJhZBnqyMy2GHRTEfp6S1\/oe+WltVC4tdSWlpeWEgi1CmMjmukQFhc3naQsZm7Wl8Ys\nW6cmw8TqksWllswl++U+u885bWl9gdKYsR84yZPbpvee8znf5\/s897SoaHWsjv\/hsChfWSOveTW8\nvXg9ZMe24vXhbZvXsduL15atKGArU1plkZWCrvY10Ku2ga7HAYxBBUJZLRzYUwkH3n0Z3n9jQ3T7\n5rU1K6ciUxJua90JfbEIOGYjoA9GQNIfB2GIA+EoB9JjcWho94DPq58KBpVrVkxF54luAolx6GIE\nFCMXQd43Awp2GqT2GCi6foKgvym6IpBmWQlrY\/cSOMu5OKgngIQgwBElxWNJYI7ykIHrMOSqWxYk\n3js6oDK6zR+xvK\/HiL+L1\/nQ4zs2rd2YPyRTmkAlm3U7wWRhwGA2gM7YDgrrNIgdcRC4eeBeTPlj\n8AYGx\/KZE8F6+30JjSsCMk8ElE4+G4f90KCuh52vb8gU5JLFaGaKJQglmX4E8jAH5p85GPiHg\/Yr\nAIoB9OAMAcUrwjZ0P4TRAaVkMdUGffawIXQVZJ\/8QnwsGkwSqwg8NCuqM3EQGxio3vISiSUAS6Ly\n8SvQeIkD7Y8U0PuIA8evAOJ+oOqlAgFlHRFwuj1zz5uvt88\/JXE\/znlOMMSDTXBgPHERLCNDoPXO\nkPl7rs8AZm7xSuZvQAWZ0\/dAfI5C9j\/mYPCvJDgjMTCFIqC202JJL2j0Rp+pord\/0Ci33yBq40ZQ\neZX5M3IVOpNkwwiGc9sDBgK3JGDTwb0ZMNtvHPCbzQlSMDwUqeZUqvHziL85nD3P8YCqDMFzlEuF\nqj9GOoXBZCDAnijtGAiHFlu81agqQdM7lAm9fwhcNyLguxsjk6h7I08tiKn29bKQ7Tt\/T1uUqJQq\nqkxxualVcLOmH5JgtBlSYHxhMqU1ebSZUh8+gHDMhadVHPgjDuz5CGiHY5mCwcXtvZ\/DaEBRpd9f\nOua31061eC8\/tZGOb2PguBaHnvtJOhdffOh1hMT2lv8bRVpibBz4lKTZeI0D98NcSNlQ7sKYYovr\nNAScdT6TeGti2C0EdctwbltyU3uk57Df44gAuAYWJb7FltWwmxs2bcRd4YPpvvhktMorwaCnPlJ2\n3YRgnzzsYevgSfUUx4Eo570Tz9lo002OFCP6ftmA2UNbX7lRJyw36oQVrFLZyMpMIRJqnSWMoVfL\nAaOnS8eatdUJ3JBJywAGqoiQrrsLFsHArGBgivWH25eXYhw64dYyraDcp1S3RuUGHzBHZkFx7D4c\n+p4ji2UHtoqO49+BpmH31Ic7NoF1\/BuwTs6CzuxMtEjLoLmJIQWW8THvPU1oiqQWO4bO1Q15FQgO\nveitKq2gYk6pNoPQPw+iUxyZBHdqjfFwD2jTZm\/Sxby\/A7S6TkCwux500ndIdA6eIr\/1JfiWEkqC\nXqskqjqOtYMtGif+s96mymF6iYX48+iScJr68ho+jUDgJigYhugsDzjLQd88R8DwtUeU+BuAcd2C\n4SO1BNBp3gUBx37otLUROPwd71MenQe1UhE1S7f4eK\/NIRhpYfw1r963kNbyKQRkzF+R0wu+kkTT\nVD3c9UE+vagYLoxhOgtgtvkIHIbbWkOuCIipx81geP\/k5\/JxoNA5o2gdi6y4DI925HiXj3ILgBWA\noWZ2g9h9iyiHCmI7kH7JEShMMarTxfdHSf88eGwCAjXsqkt0Nn3AZgPifai24TLfTvjNiQbnQSN5\nb065783CzpFpOKFzPgOHCqIPjVfoIriY6gKNRusXGfWCnjpJsHvfGvx8yGImyuGGuu7w6t9dsEtD\nx0kUgS0YUGqdpf0LU4zh4TKwGWD+u3CEN3qLhsK566P4\/FFvXRV+N1l6oOUSPaaxt6k9RJOp58eT\nPGB5orB+JyiPNspFoFKqQWK7TuEmuVw1J+kVf++27CJwqFw2oME2AdIzHDRd5aArTgtMfp6e\/XBj\nKAR2i2UDpquYFEn2ezRA00yAT1LD4yb87MdjabjMQYEHbLCEqHe\/pq+y9AYRruFgqHDAdCWn0yw6\n\/OCZxyWFzgF8r3zmUb\/PticsbwtlFCfXVC\/FzWELo8W4tbD\/2Vhh6BGchKQ5fUTqvEWuspaTz4XD\nYZK+zaJKCINBlOP\/sgrHaVAFC\/Rg9rsX\/YgVjROiYgiM\/sTX31JvIrwfbYApRShUEDsDbjCVYrbo\nRQx6SKhg05Gvb3AjRHkP9W3mJM37ViuuThTcB1\/UQPWz\/YvqYWAWeHtIilZ6oNoacXXGt1h0mNrF\nvPufDkxhuqem\/buUd1dISXrILbilrI7VsULjX2nz\/TjVze1lAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/npc_butterfly-1306966114.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: true,
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
	"npc",
	"animal",
	"no_trade",
	"npc-animal"
];
itemDef.keys_in_location = {
	"g"	: "massage",
	"k"	: "milk",
	"n"	: "sing_to",
	"y"	: "apply_balm",
	"o"	: "apply_youth",
	"e"	: "debug",
	"v"	: "give_cubimal",
	"c"	: "name",
	"h"	: "rename",
	"j"	: "revive",
	"t"	: "rook_attack",
	"q"	: "set_free",
	"u"	: "talk_to",
	"x"	: "unrook"
};
itemDef.keys_in_pack = {};

log.info("npc_butterfly.js LOADED");

// generated ok 2012-12-02 23:18:51 by ali
