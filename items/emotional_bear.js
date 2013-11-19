//#include include/npc_quests.js, include/npc_conversation.js, include/takeable.js

var label = "Emotional Bear";
var version = "1353444280";
var name_single = "Emotional Bear";
var name_plural = "Emotional Bears";
var article = "an";
var description = "When you can't express how you're feeling, this furry companion will emote on your behalf. Particularly when equipped with <a href=\"\/items\/446\/\" glitch=\"item|lips\">Lips<\/a> for kissing or a <a href=\"\/items\/351\/\" glitch=\"item|moon\">Moon<\/a> for you-know-whatting…";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 300;
var input_for = [];
var parent_classes = ["emotional_bear", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.reminisce = { // defined by emotional_bear
	"name"				: "reminisce",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "A remembering",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var quests = this.getAvailableQuests(pc);
		if (num_keys(quests.offered)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.offerQuests(pc, msg);
		return true;
	}
};

verbs.emote_hug = { // defined by emotional_bear
	"name"				: "hug",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: true,
	"sort_on"			: 51,
	"tooltip"			: "Hug this player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.is_race) {
			return {state: 'disabled', reason: "You're in a race! Save your emotional outbursts for later."};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		//
		// get target player
		//

		var target = getPlayer(msg.object_pc_tsid);

		if (pc.metabolics_get_energy() <= 5){
			pc.sendActivity("You tried to hug "+linkifyPlayer(target)+", but you just don't have the energy.");
			return false;
		}
		else{

			// +2 mood to other person, +2 mood to you, -5 energy to you


			//
			// change stats
			//

			pc.metabolics_lose_energy(5);
			pc.metabolics_add_mood(2);
			target.metabolics_add_mood(2);

			pc.achievements_increment('players_hugged', target.tsid);

			//
			// send message to target player
			//

			target.announce_vp_overlay({
				item_class: this.class_tsid,
				state: "hug",
				duration: 5000,
				size: "25%",
				msg: linkifyPlayer(pc)+' hugged you! Mood +2'
			});
			target.announce_sound('EMO_BEAR_HUG');

			pc.sendActivity("You hugged "+linkifyPlayer(target)+". Energy -5, Mood +2");

			var quest_zero_mood = pc.getQuestInstance('zero_mood');
			if (quest_zero_mood && !quest_zero_mood.isDone() && quest_zero_mood.canHug(target)){
				pc.quests_inc_counter('players_hugged', 1);
			}

			if (!pc.emo_bear_feat) pc.emo_bear_feat = {};
			if (!pc.emo_bear_feat['hug']) pc.emo_bear_feat['hug'] = {};
			if (!pc.emo_bear_feat['hug'][target.tsid]){
				if (pc.feats_increment('tottlys_toys', 1)) pc.emo_bear_feat['hug'][target.tsid] = time();
			}

			return true;
		}
	}
};

verbs.emote_high_five = { // defined by emotional_bear
	"name"				: "high five",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: true,
	"sort_on"			: 52,
	"tooltip"			: "High five this player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.is_race) {
			return {state: 'disabled', reason: "You're in a race! Save your emotional outbursts for later."};
		}

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		//
		// get target player
		//

		var target = getPlayer(msg.object_pc_tsid);

		if (pc.metabolics_get_energy() <= 10){
			pc.sendActivity("You tried to high five "+linkifyPlayer(target)+", but you just don't have the energy.");
			return false;
		}
		else{
			//
			// change stats
			//

			pc.metabolics_lose_energy(10);
			target.metabolics_add_mood(10);

			pc.achievements_increment('players_high_fived', target.tsid);

			//
			// send message to target player
			//

			target.announce_vp_overlay({
				item_class: this.class_tsid,
				state: "high_5",
				duration: 4000,
				size: "25%",
				msg: linkifyPlayer(pc)+' high fived you! Mood +10'
			});
			target.announce_sound('EMOTIONAL_BEAR_HIGH_5');

			pc.sendActivity("You high fived "+linkifyPlayer(target)+". Energy -10");

			if (!pc.emo_bear_feat) pc.emo_bear_feat = {};
			if (!pc.emo_bear_feat['high_five']) pc.emo_bear_feat['high_five'] = {};
			if (!pc.emo_bear_feat['high_five'][target.tsid]){
				if (pc.feats_increment('tottlys_toys', 1)) pc.emo_bear_feat['high_five'][target.tsid] = time();
			}

			return true;
		}
	}
};

verbs.emote_kiss = { // defined by emotional_bear
	"name"				: "kiss",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: true,
	"sort_on"			: 53,
	"tooltip"			: "Kiss this player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.hasUpgrade('kiss')) return {state:null};
		if (pc.location.is_race) {
			return {state: 'disabled', reason: "You're in a race! Save your emotional outbursts for later."};
		}
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		//
		// get target player
		//

		var target = getPlayer(msg.object_pc_tsid);

		if (pc.buffs_has('buff_garlic_breath') && pc.metabolics_get_energy() <= 5) {
			pc.sendActivity("You tried to kiss "+linkifyPlayer(target)+", but you just don't have the energy.");
			return false;
		}
		else if (!pc.buffs_has('buff_garlic_breath') && pc.metabolics_get_energy() <= 10) {
			pc.sendActivity("You tried to kiss "+linkifyPlayer(target)+", but you just don't have the energy.");
			return false;
		}
		else{
			//
			// change stats
			//

			if (pc.buffs_has('buff_garlic_breath')){
				var energy = pc.metabolics_lose_energy(5);
				var mood = pc.metabolics_add_mood(5);
				self_msgs.push("Hopefully they don't notice your garlic breath. "+energy+" energy, +"+mood+" mood");

				var mood = target.metabolics_lose_mood(3);
				var xp = target.stats_add_xp(2, false, {'verb':'emote_kiss', 'class_id':this.class_tsid});
				var target_msg = linkifyPlayer(pc) + " kisses you. Wooeee, that is stinky! "+mood+" mood, +"+xp+" iMG";
			
				pc.achievements_increment('players_garlic_kissed', target.tsid);
				pc.counters_increment('players_garlic_kissed', target.tsid);
			
				if (pc.getQuestStatus('spread_garlic_love') == 'todo'){
					if (pc.counters_get_label_count('players_garlic_kissed', target.tsid) == 1){
						pc.quests_inc_counter('players_garlic_kissed', 1);
					}
				}
			}
			else{
				var mood = target.metabolics_add_mood(10);
				var energy = pc.metabolics_lose_energy(10);

				var target_msg = linkifyPlayer(pc) + " kisses you. +"+mood+" mood";
				self_msgs.push(energy+" energy");
			}

			//
			// send message to target player
			//

			var args = {
				item_class: this.class_tsid,
				state: "kiss",
				duration: 3000,
				size: "25%",
				msg: target_msg
			};
			target.announce_vp_overlay(args);
			target.announce_sound('KISS_RECV');

			pc.announce_sound('KISS_SEND');

			//
			// achievements
			//
			
			pc.achievements_increment('kissed', target.tsid);
			target.achievements_increment('been_kissed', pc.tsid);

			if (!pc.emo_bear_feat) pc.emo_bear_feat = {};
			if (!pc.emo_bear_feat['kiss']) pc.emo_bear_feat['kiss'] = {};
			if (!pc.emo_bear_feat['kiss'][target.tsid]){
				if (pc.feats_increment('tottlys_toys', 1)) pc.emo_bear_feat['kiss'][target.tsid] = time();
			}
		}

		if (failed) { 
			pc.sendActivity("You tried to kiss "+linkifyPlayer(target)+", but you just don't have the energy.");
			return false;
		}
		else {
			var pre_msg = this.buildVerbMessage(msg.count, 'kiss', 'kissed', failed, self_msgs, self_effects, they_effects, target);
			pc.sendActivity(pre_msg);
		}

		return failed ? false : true;
	}
};

verbs.emote_moon = { // defined by emotional_bear
	"name"				: "moon",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: true,
	"sort_on"			: 54,
	"tooltip"			: "Moon this player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.hasUpgrade('moon')) return {state:null};
		if (pc.location.is_race) {
			return {state: 'disabled', reason: "You're in a race! Save your emotional outbursts for later."};
		}
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		//
		// get target player
		//

		var target = getPlayer(msg.object_pc_tsid);

		if (pc.metabolics_get_energy() <= 10){
			pc.sendActivity("You tried to moon "+linkifyPlayer(target)+", but you just don't have the energy.");
			return false;
		}
		else{
			//
			// change stats
			//

			pc.metabolics_lose_energy(10);
			target.metabolics_add_mood(10);

			pc.achievements_increment('players_mooned', target.tsid);
			pc.counters_increment('players_mooned', target.tsid);

			if (pc.getQuestStatus('rising_moon') == 'todo'){
				if (pc.counters_get_label_count('players_mooned', target.tsid) == 1){
					pc.quests_inc_counter('players_mooned', 1);
				}
			}

			//
			// send message to target player
			//

			target.announce_vp_overlay({
				item_class: this.class_tsid,
				state: "moon",
				duration: 6000,
				size: "25%",
				msg: linkifyPlayer(pc)+' mooned you! Mood +10'
			});

			if (!pc.emo_bear_feat) pc.emo_bear_feat = {};
			if (!pc.emo_bear_feat['moon']) pc.emo_bear_feat['moon'] = {};
			if (!pc.emo_bear_feat['moon'][target.tsid]){
				if (pc.feats_increment('tottlys_toys', 1)) pc.emo_bear_feat['moon'][target.tsid] = time();
			}

			pc.sendActivity("You mooned "+linkifyPlayer(target)+". Energy -10");

			return true;
		}
	}
};

verbs.pickup = { // defined by emotional_bear
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_takeable_pickup(pc, msg)){
			this.updateState();
			return true;
		}

		return false;
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
	"sort_on"			: 57,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by emotional_bear
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.is_dead){ return {state:'disabled', reason: "You're dead!"}; }
		if (this.isQuestItem()) return {state:'disabled', reason: "This item is needed for a quest and can't be dropped."};
		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.parent_verb_takeable_drop(pc, msg)){
			this.updateState();
			return true;
		}

		return false;
	}
};

verbs.upgrade_moon = { // defined by emotional_bear
	"name"				: "upgrade with a moon",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 60,
	"tooltip"			: "Upgrade your Emo Bear with a Moon",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.hasUpgrade('moon')) return {state:null};

		if (!pc.items_has('moon', 1)) return {state:null};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (!pc.items_destroy('moon', 1)){
			return false;
		}

		this.addUpgrade('moon');
		self_msgs.push("Now you can moon with your Emo Bear!");

		var pre_msg = this.buildVerbMessage(msg.count, 'upgrade', 'upgraded', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		return true;
	}
};

verbs.upgrade_lips = { // defined by emotional_bear
	"name"				: "upgrade with some lips",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 61,
	"tooltip"			: "Upgrade your Emo Bear with some Lips",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.hasUpgrade('kiss')) return {state:null};

		if (!pc.items_has('lips', 1)) return {state:null};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if (!pc.items_destroy('lips', 1)){
			return false;
		}

		this.addUpgrade('kiss');
		self_msgs.push("Now you can kiss with your Emo Bear!");

		var pre_msg = this.buildVerbMessage(msg.count, 'upgrade', 'upgraded', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		return true;
	}
};

verbs.anthropomorphize = { // defined by emotional_bear
	"name"				: "anthropomorphize",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 62,
	"tooltip"			: "This might cheer you up",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.canUse(pc, 'anthropomorphize')) return {state:'enabled'};
		else {
			return {state:'disabled', reason:"You already did this today. Now it's just a bear."}
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var val = pc.metabolics_add_mood(20 * msg.count);
		if (val){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: val
			});
		}

		//
		// send message to target player
		//

		pc.announce_window_overlay({
			item_class: this.class_tsid,
			state: "hug",
			duration: 5000,
			size: "50%"
		});

		pc.achievements_increment_daily(this.class_tsid, 'anthropomorphize', 1);

		self_msgs.push("Weirdly, ascribing glitchy characteristics to your inanimate bear cheers you up a bit.");

		var pre_msg = this.buildVerbMessage(msg.count, 'anthropomorphize', 'anthropomorphized', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_pickup(pc, msg, suppress_activity){
	return this.takeable_pickup(pc, msg);
};

function parent_verb_takeable_pickup_effects(pc){
	// no effects code in this parent
};

function addUpgrade(upgrade){ // defined by emotional_bear
	if (this.hasUpgrade(upgrade)) return;

	this.upgrades.push(upgrade);
	this.updateState();
}

function canUse(pc, verb){ // defined by emotional_bear
	// This function is used to prevent anthropomorphizing the bear more than once per day.
	if (pc.achievements_get_daily_label_count(this.class_tsid, verb)) return false;

	return true;
}

function hasUpgrade(upgrade){ // defined by emotional_bear
	return in_array(upgrade, this.upgrades);
}

function onCreate(){ // defined by emotional_bear
	if (!this.container) return this.apiSetTimer('onCreate', 100);

	this.upgrades = [];
	this.updateState();

	this.setAvailableQuests([
		'greedy_street_spirit_reminisce'
	]);
}

function onLoad(){ // defined by emotional_bear
	this.setAvailableQuests([
		'greedy_street_spirit_reminisce'
	]);

	if (this.state == 'talk') this.updateState();
}

function onPrototypeChanged(){ // defined by emotional_bear
	this.setAvailableQuests([
		'greedy_street_spirit_reminisce'
	]);

	if (this.state == 'talk') this.updateState();
}

function updateState(){ // defined by emotional_bear
	var state = 'plain';
	if (this.hasUpgrade('moon') && this.hasUpgrade('kiss')){
		state = 'moon_kiss';
	}
	else if (this.hasUpgrade('moon')){
		state = 'moon';
	}
	else if (this.hasUpgrade('kiss')){
		state = 'kiss';
	}

	if (this.isOnGround()){
		this.state = '1_'+state;
	}
	else{
		this.state = 'iconic_'+state;
	}
}

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This can be purchased from a <a href=\"\/items\/1000005\/\" glitch=\"item|npc_streetspirit_hardware\">Hardware Vendor<\/a> or a <a href=\"\/items\/1000008\/\" glitch=\"item|npc_streetspirit_toys\">Toy Vendor<\/a>."]);
	return out;
}

var tags = [
	"tool",
	"toys"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-54,"w":49,"h":58},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMJElEQVR42s2YaVBTab7Gqbq3+s6d\nud0urSiNCioiIIssgiAYdkVEFkFEaVbFBTTsCWuAsARICJAECFsCyhL2TUBZDihiuzRod49ds9Rl\nqr9M1cwHqnru9+f+3zNTPfNpurHt6TlVb3EqIef9vf8tzxMjoy1ci00+gmWtv2S5LVCyoPGVzDZ6\nOhj9u1yP286FftYdtvnaEI21vkg8aQ\/CI5UPJuSeowMy520\/K9ykwku33BaEVV0w1u6H4PN757HS\nfgZzal9MKjxhKHfjfjY49V0bPwYxp\/bBk47zmFP5f7ceqfwwXO2Ozvzj0Obax\/8sgI3p1obRag8s\nd4RioekM5jWBWGw+C64liP87UH4S6gwb1N85+rNE8T9o842BCjfMt5zHvDoAS9pzVH8hWOkMxbL2\nLOYaBZip80RPkdPmrMKTe6U\/t\/65Pmjzhe4s96wjQPm0zVfyjw+co3p9pPIWcqzZaC02BQh+FKHi\ntuWoVmQPQ5WAjxiDW24NAqfxxZJGgC8NF\/GZLhSzSh+8vn8eX\/ReoBXC37\/qCsJnHYGYq\/MIZc+q\nvGFhM1Zzap1r9sdqZxBedAXjacdZLGp8N6mM3m0i5ESaeFXfsEBd2lEsaC8Q3Dk8avDCfKMnHrf4\n4mG9PyaqvTBQ4oI12vDrwQh+fdUXinWCfKk7i4WG05utIttLmgzbb3vLXPFAKcBz\/Tm87g2lw9Fh\nCXi6\/jSG5R5m7wRZHG92sfzawW\/bKJKT1ScwW+eOhUYvzNV7oTPbDssaHzxtDeDBfj8ahd+NROHt\nQDje9ITglT6I3mOHcEM7fX5CeQaPtBEYVwRgtTsCK22srn0xVeeFwaqTundOdUeOVeNwuSNt9HfA\nsQpXPFJ68an8gmC+JigG99vhSLw1hH0HuNpGgDI39JU4YqzGm28wth62XATXGoxxuQ+97oF+qevG\nO8F151kJ+ottMSw9Thu5YEZxEstNvpSmUKxo\/fg0snR+SWllkWNwX1Itrt0LxovOMxRBP4xXuWJI\n6gKd2I7G1QU81YVhVk1zdeIuJpXeYI14r8R565NAKzq0TS8+utFXdAxDZQ60kTOma92oSXwwXOZC\noN58I7BIrRMQi9obgmVwL\/Vn8aw9AE+oVgdKnTBY5oz2bBs8oLp9fj8Ky+0XMNlwHrMtYQwO6kyb\n51sGbM8yj9eLLNFTaEOb2ON+gQOBEaTCi08zA3xKUWSQNFp4KLZY5Bjcivav3c6i3lPkgKb0o+gq\ncsHLvstY1YdTc\/ihKesYWkV2UKQe2XoNqtPMNjpzj+BevhX6JbaQJVshP+oIbXQCnSJHLKi8sESQ\nLEoslaze2GL37DUGxzp+WOoEvdgWdTcPQ55yEAOVXmjOsYfsxmE0CI+i8vohFMTsu7glOHnydjPF\ndVNoMw+hS3wUvRTFslhLJPmYoSD6CPqKnfBQ6cEDcOrTPAyLKFvsflF1GvMNnnhITTVS4YT2XGvU\nEJws+QAqks1QEn8AElrFcfs382P3SbYcPVmSsUPNNRPU3diPlvSDaEg9gpuB5vxSpdnw9ThVQ12t\ncKdu9sAcwcz\/bc3Vn+LhWcePVThjXOYEjdASNdfMUJm4H6Vxn4TmxewViKKNf5xkK4\/fzckpispb\nB1B\/2xxySklZ3CGk+Juju9AJXEckXo+m4LkhAU+7L2FS5oqpahrGta5YUJ\/DxnQvftOlBFcXR4c6\njKqk\/ZDGm6L0072C9\/JlnBe5M7EywRiKFFMCPAD1nYNoEh5Gt5TUzeAdfDaWjceGdDwbFeHVVD6+\nmsvHRAOJiNLjWGkQYaZChIfSHMzLMlCbQtFL2ofSWBMUxex6P4DeRkb\/mR22\/VVV0l6C3MdDqtLM\nMdF6lQfMvWqHQMedKEl0QqxgF1IjbfFkSIjBah8syYuxUF0A5dUQ9GTFoyLBFOUJn6D4yh4URb0n\nQHZd8\/vAXhy54y+ViXv4SNZRLY5pr4Lru4Vp3U3EBh7CeZftiPPehfCTO9FdG4XpzgQMipPQcTsW\njfHh0Nzyp9SaUPT2UIPtRl7UdsF71V2pZ\/\/bPTdi+2Zp7G7axBjNRT6Y7UrGTGcSZnTXca82GgZV\nPEaak+j1a\/wBNGnWqIg7BumnlpBc3YOSK8YojN4FceRO5IS\/Z0B2ZYb\/yoHS\/X\/Z4TuQGf4x2qRn\noC05g\/76KDQXB2Kk6QoMDdHob4hCW1kgFDf3U8eaoOSqMX+oosu7ICI48cXtP524PbXL6MME7\/+6\neSvgV38QhuyAPMMFTUX+0FedpyiGQS8LQY3QGXnRJjxQwaWPkX9pJ91\/jNyIHcgO37Yhi9rx05us\nRC+j3SUJ5j2kF5EW9CHE0aaQJFoiM2wX7gZ\/hKyw7SyNEBEU+0tgdL9tvSDiF2ZG\/4qr4rq5UJN1\nbHO20Q\/aHFv+myEveg9yLhLghe24c34b0i98tH43+H8MNwJ\/mXzN+xfebhZGH\/1kQAtqX7OJOi9B\nv\/SEUJVhzZUkHIBB6vrtSkcwnpDoXGgJJNF5GoOVblCl20gK40w36oWWm21ie0lPqbNw7n15567i\n48IJecjofPMVLJKoZIp3SRuAh43eYO6up9QFzdnHUPTpvlVeCZOWG647g9nmMCxqQ8jIn6b3bTlR\ntImw5vZhXqXcJyk1QvZ0pkGApZYA3ocstYRgsTWWtKD\/Rn+pS+gPglNlWul6pG5Y0Rfi6xE51kZq\nMVl\/BjP1AozXniKD7gp9kSOTRZsdFBlm3Jfagkm6R2NtIA5fjiZjvM6f2dBvbWyMPiiMNTWoM6yh\nLzzOf5Y9g0FOq+PxcqgGv51SkT+JQHu+A9qzrL+\/NunEm61iB6waqvB2TIlXPVIM0ndoX9kJ9NMG\n3aReyCez6AmGZCc5ZnSedUXg7UQK\/ncuHRsLmXiiC+f1nejyJx7MtpYlmE2zKHZLnHjIYbkfJjUZ\neDmiwG+mNZhuTUH9XSvU3LL4\/rlYHLdvvfa2BYYViVgekJHSzSGJFIROdsI8B8jTLDfEV0yc2f\/2\nlrpsDla64xlF7\/cP7+CPq4X484sSrA3GQ5tri9IEs272fyIaKaWJ5r2qv0VSl38CPeXxmFGlY1lX\nhE6JD6puHEJp4r7vBxRd3qvLofklu2mJ2lvOqBO6UndaoDTZHNQUSrbZA7KGPSWOXAdB91Jk1ym1\nv5slwKcF+NNzCdaGkynKVkzjoSXLZmOk8gS\/cXbUnitlSeZ8BlQZjmjJIcGa6wb2WuHVfd\/8oBpk\nAJlRu5UZkcaPcy7t\/Vx02WT6dqixIjV09zn23qNGL8GE3H2zi6Q7U8FDslN42XMZvx6\/TlG8y6f5\nZV8spDRyxDEm0GRYYajiBCZrT\/JiNDX8w4\/FVz6RkDgdFcWYcjmXTbncGJPRO2HGh9\/9Z7dWHwFJ\neuWjBk9uus4D4zUncb\/4OMgnUyrtsNIRile9MXgzFI8vhhOxZoil+jNBZqQxzUfyMeUuGCNPPCV3\n33hY7zlKyjv+abuv2Y+ceR5mi2oBxzWRbFcLMEfmaEZ5iiLhzkekKcMGNeQtmI8YqzmNOTUbRewn\nkQuYUPghPWI3Cq6SyE07An2BPQYJkh2MHZD9KrFA9oCeu8FpTgvfDbAtcn2pPQlz2hg8qKOxoPAg\nMBc+choqdmWaJeS3LTYKrpiYNdy1FnaInXSaLDtOk2HHabPtJSlB2w5XXDNfZ4dgkJ159ugj2zlK\n5n2M1mRjKOY0MXjcHY8tD\/BhuaPZ6r1sfPNmCm8eqDDfkkYPphFDdacSWqGe4OpSLciNHfynXqI8\n+aBZ1XXzTfktC\/5AWhruw5UnYKgMw3ybCF+t9ODNQOV39fmDL4PUSfLVg0Z8s9yFt7Mt9DUmwpDi\nAg\/INlLQGGpIs\/xBD5Umm8fLUg6BQXaQ5ezIs8OIMhVLXcXU\/VX4A6fDTG3Q+pYAe4scBU\/6xfj1\nVCNetuWS36hAnzSKaskOtTctUH3j0JYeWJFkrpOR1WzJsUZzljsGG1Ix15qDF8M1eH1fgr6S41u3\nmwMVgZuPuyXgDJUYr09DZ3UMNJlWqLxmvlmWdHBLNlGWsmNbeaL5ev2dI2gu9EVXZQIm2nMxr83F\nVFMC7hUd27rtbBFZOnQU+nbrpRc5bWk4Vy904ChVo4q0g+\/kYdkMLUvYr1PeseY0klCuWXyW05cG\nc+25x773d+3\/Bwxd0XJC9blLAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-05\/emotional_bear-1338251189.swf",
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
itemDef.hasConditionalEmoteVerbs = 1;
itemDef.tags = [
	"tool",
	"toys"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"n"	: "anthropomorphize",
	"g"	: "give",
	"h"	: "high_five",
	"u"	: "hug",
	"k"	: "kiss",
	"o"	: "moon",
	"e"	: "reminisce",
	"c"	: "upgrade_lips",
	"j"	: "upgrade_moon"
};

log.info("emotional_bear.js LOADED");

// generated ok 2012-11-20 12:44:40 by mygrant
