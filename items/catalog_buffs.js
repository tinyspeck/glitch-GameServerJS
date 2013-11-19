var buffs = {
	"admin_buff_timers" : {
		name		: "Admin Buff Timers",
		desc		: "Always show timers on buffs, even when they are hidden",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"ancestral_nostalgia" : {
		name		: "Overwhelming Ancestral Nostalgia",
		desc		: "You are overwhelmed by the weight of millions of years of history",
		duration	: 600,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			if (pc.imagination_has_upgrade("ancestral_lands_time_2")) {
				pc.buffs_extend_time("ancestral_nostalgia", 120);
			}
			else if (pc.imagination_has_upgrade("ancestral_lands_time_1")) {
				pc.buffs_extend_time("ancestral_nostalgia", 60);
			}
			
		},
		on_remove	: function(pc, args){
			pc.check_baqala_boot();
		},
		on_tick		: function(pc, args){
			
		},
	},
	"arbito_bonus" : {
		name		: "Arbito Bonus Round",
		desc		: "",
		duration	: 30,
		tick_duration	: 1,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			if (pc.location.tsid != 'LM411CNV2FNBN'){
				this.args.previous_location = {
					'tsid' : pc.location.tsid,
					'x' : pc.x,
					'y' : pc.y,
				};
			
				pc.teleportToLocation('LM411CNV2FNBN', 530, -50);
			}
		},
		on_remove	: function(pc, args){
			// If we're dead, don't teleport out, just pull a switcharoo
			if (!pc.is_dead){
				pc.teleportToLocation(this.args.previous_location['tsid'], this.args.previous_location['x'], this.args.previous_location['y']);
			}
			else{
				this.resurrect_location = {
					tsid:	this.args.previous_location['tsid'],
					x:	this.args.previous_location['x'],
					y:	this.args.previous_location['y'],
				}
			}
		},
		on_tick		: function(pc, args){
			if (pc.location.tsid == 'LM411CNV2FNBN' && !this.args.has_started){
				this.args.has_started = 1;
				this.args.tick_duration = 0;
				pc.buffs_apply('arbito_bonus', this.args);
			}
		},
	},
	"a_too_guilty_mind" : {
		name		: "A too-guilty mind",
		desc		: "You feel so bad about yourself, you murderer",
		duration	: 900,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: "tree_poison",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"bad_mood" : {
		name		: "Bad Mood",
		desc		: "Keeps your mood down low",
		duration	: 60,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			if (pc.metabolics_get_mood() > 60){
				pc.metabolics_set_mood(60);
			}
			
			pc.metabolics.mood.apiSetLimits(0, 60);
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"beta_item_cooldown" : {
		name		: "Too Much Fun",
		desc		: "Maybe you should lay off that Special Item That Only Beta Testers Get for a while",
		duration	: 300,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "special_item_that_only_beta_testers_get",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"bogspecialization_harvest_full_peat_bog_in_time_period" : {
		name		: "Peter out Peat",
		desc		: "Empty a Peat Bog",
		duration	: 9,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "peat_2",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'bogspecialization_harvest_full_peat_bog_in_time_period';
			var quest = pc.getQuestInstance(quest_id);
			if (!quest) return;
			
			quest.testBog();
			if (!quest.isDone(pc)){
				pc.failQuest(quest_id);
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"bubble_enhanced_meditation" : {
		name		: "Bubble-Enhanced Meditation",
		desc		: "Double reward when meditating",
		duration	: 120,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "bubble_tea",
		on_apply	: function(pc, args){
			pc.removeSkillPackageOverride('meditative_arts');
			pc.removeSkillPackageOverride('focused_meditation');
			pc.removeSkillPackageOverride('transcendental_radiation');
			
			var details = pc.getSkillPackageDetails('meditative_arts');
			if (details && details['bonus_amount']) pc.addSkillPackageOverride('meditative_arts', {bonus_amount: details['bonus_amount'] * 2});
			
			details = pc.getSkillPackageDetails('focused_meditation');
			if (details && details['bonus_amount']) pc.addSkillPackageOverride('focused_meditation', {bonus_amount: details['bonus_amount'] * 2});
			
			details = pc.getSkillPackageDetails('transcendental_radiation');
			if (details && details['bonus_amount']) pc.addSkillPackageOverride('transcendental_radiation', {bonus_amount: details['bonus_amount'] * 2});
		},
		on_remove	: function(pc, args){
			pc.removeSkillPackageOverride('meditative_arts');
			pc.removeSkillPackageOverride('focused_meditation');
			pc.removeSkillPackageOverride('transcendental_radiation');
		},
		on_tick		: function(pc, args){
			
		},
	},
	"buff_buzzed" : {
		name		: "Buzzed",
		desc		: "Mood goes up, energy goes down",
		duration	: 300,
		tick_duration	: 60,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "beer",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			pc.sendActivity("You feel your buzz fading.");
			pc.achievements_set('buff_times', 'buzzed', 0); // Restart this counter - it's continuous, not cumulative
		},
		on_tick		: function(pc, args){
			pc.metabolics_add_mood(3);
			pc.metabolics_lose_energy(7);
			pc.sendActivity("That is a nice buzz you got going on.");
			pc.achievements_increment('buff_times', 'buzzed');	// This counter is counting minutes
		},
	},
	"buff_garlic_breath" : {
		name		: "Garlic Breath",
		desc		: "Your breath is icky",
		duration	: 300,
		tick_duration	: 60,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "garlic",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			pc.sendActivity("You no longer have the taste of garlic in your mouth.");
			pc.stats_add_xp(5, false, {'buff':'buff_garlic_breath'});
		},
		on_tick		: function(pc, args){
			pc.metabolics_add_mood(3);
			pc.sendActivity("The power of garlic lives on in your mouth.");
		},
	},
	"buff_hungover" : {
		name		: "Hungover",
		desc		: "Ugh. This is a mood-killer",
		duration	: 300,
		tick_duration	: 60,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			pc.sendActivity("That hangover is gone! You feel so much better.");
			pc.metabolics_add_mood(10);
			pc.metabolics_add_energy(10);
		},
		on_tick		: function(pc, args){
			pc.metabolics_lose_mood(2);
			pc.stats_add_xp(3, false, {'buff':'buff_hungover'});
			pc.sendActivity("Your head really hurts from your hangover");
		},
	},
	"buff_remembering" : {
		name		: "Remembering ...",
		desc		: "What was it ... ?",
		duration	: 300,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "older_spice",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			pc.sendActivity("Oh, now you remember what old(er) spice reminds you of.");
			pc.metabolics_add_mood(5);
		},
		on_tick		: function(pc, args){
			
		},
	},
	"buff_smashed" : {
		name		: "Smashed",
		desc		: "Lose energy, gain mood every minute",
		duration	: 240,
		tick_duration	: 60,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "hooch",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			pc.sendActivity("You don't feel as smashed anymore.");
			pc.buffs_apply("buff_hungover");
			
		},
		on_tick		: function(pc, args){
			pc.metabolics_add_mood(3);
			pc.metabolics_lose_energy(3);
			pc.sendActivity("You feel completely smashed.");
		},
	},
	"caffeine_buzz" : {
		name		: "Caffeine Buzz",
		desc		: "Caffeine pops your mood every 10 seconds",
		duration	: 50,
		tick_duration	: 10,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "mabbish_coffee",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			var mood = pc.metabolics_add_mood(2);
		},
	},
	"cal_test" : {
		name		: "Cal's Test Buff",
		desc		: "",
		duration	: 60,
		tick_duration	: 10,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			log.info('Buff applied');
			this.addStat('foo', 2);
		},
		on_remove	: function(pc, args){
			log.info('Buff removed', args);
			pc.sendActivity('That was awesome!');
			
			
		},
		on_tick		: function(pc, args){
			log.info('Buff tick');
			pc.metabolics_add_energy(10);
			
		},
	},
	"camera_recharging" : {
		name		: "Camera Recharging",
		desc		: "You need to wait before you can \"Take a picture\" again!",
		duration	: 90,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: "camera",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"carrot_zing" : {
		name		: "Carrot Zing",
		desc		: "A triple zing of mood and energy",
		duration	: 12,
		tick_duration	: 4,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "carrot_margarita",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			var mood = pc.metabolics_add_mood(7);
			var energy = pc.metabolics_add_energy(7);
		},
	},
	"charades" : {
		name		: "Charades",
		desc		: "Get other players here to guess the secret word, and they'll win a prize!",
		duration	: 120,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "potion_charades",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			if (pc.stats.charades){
				delete pc.stats.charades;
			}else{
				pc.sendLocationActivity(pc.label+'\'s game of charades is over. Nobody guessed \''+pc.charades_word+'\'.', pc);
				pc.sendActivity("Time\'s up and nobody guessed your charade.");
				pc.announce_sound('FAILED_AT_CHARADES');				
				pc.show_rainbow('charades_gameover');
			}
			
			delete pc.charades_word;
			delete pc.charades_winners;
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"chocolate_high" : {
		name		: "Chocolate High",
		desc		: "Chocolate pops your mood, energy and imagination",
		duration	: 360,
		tick_duration	: 120,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			pc.buffs_apply('sugar_crash');
		},
		on_tick		: function(pc, args){
			// +30 mood, +20 energy, +5 XP, every 2 minutes, 3 times
			pc.metabolics_add_mood(30);
			pc.metabolics_add_energy(20);
			pc.stats_add_xp(5, false, {'buff':'chocolate_high'});
		},
	},
	"comedian" : {
		name		: "Comedian",
		desc		: "You possess an incredible wit, you card, you.",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "laughing_gas",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var players = pc.location.getActivePlayers();
			pc.announce_sound('COMEDIAN', 0, 0, false);
			
			pc.sendActivity("Gosh darn it, that was witty. Everyone laughed uproariously!");
			
			for(var i in players) {
				if(players[i] != pc) {
					players[i].playEmotionAnimation('happy');
					players[i].metabolics_add_mood(10);
					players[i].sendActivity(pc.label+" just said something wildly amusing. What a riot!");
				}
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"crab_state_of_mind" : {
		name		: "Crab State of Mind",
		desc		: "Does almost nothing, but crabbier",
		duration	: 30,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "crabato_juice",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"crazy_coin_collector" : {
		name		: "Crazy Quoin Collector",
		desc		: "You can collect 50 more quoins today. It's crazy!",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "quoin",
		on_apply	: function(pc, args){
			pc.stats_set_quoins_max_today(pc.imagination_get_quoin_limit()+50);
		},
		on_remove	: function(pc, args){
			pc.stats_set_quoins_max_today(pc.imagination_get_quoin_limit());
		},
		on_tick		: function(pc, args){
			
		},
	},
	"crumbly_thoughts" : {
		name		: "Crumbly Thoughts",
		desc		: "Your brain is like whoa. Doubles learning speed for ten minutes",
		duration	: 600,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "essence_of_yellow_crumb",
		on_apply	: function(pc, args){
			var skill = pc.skills_get_learning();
			if (skill) {
				pc.skills_start_acceleration(60 * 10);
			}
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"crusher_invincibility" : {
		name		: "Crusher Invincibility",
		desc		: "I crush everything, except you",
		duration	: 0,
		tick_duration	: 60,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "crusher",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"donate_1000_favor_every_giant_one_day" : {
		name		: "1000 Favor",
		desc		: "Donate 1000 favor to each Giant in one day",
		duration	: 14400,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "npc_shrine_alph",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'donate_1000_favor_every_giant_one_day';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"dont_get_caught" : {
		name		: "Don't Get Caught!",
		desc		: "You've been entrusted with an important delivery. Don't let it fall into the wrong hands",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "contraband",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"easy_animalia" : {
		name		: "Easy Animalia",
		desc		: "All interactions with domestic animals (except singing) do not cost energy",
		duration	: 300,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "gurly_drink",
		on_apply	: function(pc, args){
			pc.addSkillPackageOverride('ak_butterfly_massage', {energy_cost: 0});
			pc.addSkillPackageOverride('ak_butterfly_milk', {energy_cost: 0});
			pc.addSkillPackageOverride('ak_chicken_squeeze', {energy_cost: 0});
			pc.addSkillPackageOverride('ak_piggy_nibble', {energy_cost: 0});
			pc.addSkillPackageOverride('ak_piggy_pet', {energy_cost: 0});
		},
		on_remove	: function(pc, args){
			pc.removeSkillPackageOverride('ak_butterfly_massage');
			pc.removeSkillPackageOverride('ak_butterfly_milk');
			pc.removeSkillPackageOverride('ak_chicken_squeeze');
			pc.removeSkillPackageOverride('ak_piggy_nibble');
			pc.removeSkillPackageOverride('ak_piggy_pet');
		},
		on_tick		: function(pc, args){
			
		},
	},
	"emberried_hiccups" : {
		name		: "Emberried Hiccups",
		desc		: "A little pep and vim, every 10 seconds",
		duration	: 50,
		tick_duration	: 10,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "tooberry_shake",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			var mood = pc.metabolics_add_mood(5);
			var energy = pc.metabolics_add_energy(5);
		},
	},
	"extremely_hallowed" : {
		name		: "Extremely Hallowed Shrine Powder",
		desc		: "Your next shrine donation: superduper powered",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "extremely_hallowed_shrine_powder",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"fairly_hallowed" : {
		name		: "Fairly Hallowed Shrine Powder ",
		desc		: "Your next shrine donation has double benefit",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "fairly_hallowed_shrine_powder",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"fecundity_cooldown" : {
		name		: "Fecundity Powder Cooldown",
		desc		: "You can't use any Fecundity Powders until this is over",
		duration	: 600,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: "powder_of_startling_fecundity",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"feeling_called_love" : {
		name		: "Feeling Called Love",
		desc		: "What is this feeling called love? It's a contagious 10% mood boost, that's what! Spread it around",
		duration	: 60,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			pc.metabolics_add_mood(pc.metabolics_get_max_mood() * 0.10);
			
			pc.announce_add_indicator('feeling_called_love', 'amorous_philtre_heart');
			
			if (!pc.hasPlayerCollisions()){
				pc.setPlayerCollisions(true);
				pc.feeling_called_love_collision = true;
				pc.feeling_called_love_last_time = time();
			}
			
		},
		on_remove	: function(pc, args){
			if (pc.feeling_called_love_collision){
				pc.setPlayerCollisions(false);
				delete pc.feeling_called_love_collision;
			}
			
			pc.announce_remove_indicator('feeling_called_love');
		},
		on_tick		: function(pc, args){
			
		},
	},
	"flaming_grinder" : {
		name		: "Flaming Grinder",
		desc		: "Refine any ore without using energy",
		duration	: 30,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "flaming_humbaba",
		on_apply	: function(pc, args){
			// override will happen in grinder's Crush verb
		},
		on_remove	: function(pc, args){
			// remove override from grinder's Crush verb
			pc.removeSkillPackageOverride('refining');
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"floating_on_a_cloud" : {
		name		: "Floating on a Cloud",
		desc		: "Long-lasting, slow-acting mood boost",
		duration	: 75,
		tick_duration	: 5,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "cloudberry_daiquiri",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			var mood = pc.metabolics_add_mood(3);
			var xp = pc.stats_add_xp(1, false, {'buff':'floating_on_a_cloud'});
		},
	},
	"focused_meditation_cooldown" : {
		name		: "Focused Meditation Cooldown",
		desc		: "You can't use Meditation until this is over!",
		duration	: 30,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: "focusing_orb",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"full_of_pie" : {
		name		: "Full of Pie",
		desc		: "Who ate all the pie? You did, and it was awesome: the pie boosts your mood and energy, though you feel a little heavy.",
		duration	: 180,
		tick_duration	: 30,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "pumpkin_pie",
		on_apply	: function(pc, args){
			pc.addBuffPhysics({vx_max:0.6, vy_jump: 0.7}, this.class_tsid);
		},
		on_remove	: function(pc, args){
			pc.removePhysics(this.class_tsid, true);
		},
		on_tick		: function(pc, args){
			var energy = pc.metabolics_add_energy(20);
			var mood = pc.metabolics_add_mood(20);
		},
	},
	"gandlevery" : {
		name		: "Gandlevery Boost",
		desc		: "Gandlevery keeps you wide awake, giving you an energy boost every 15 seconds.",
		duration	: 120,
		tick_duration	: 15,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "gandlevery",
		on_apply	: function(pc, args){
			pc.metabolics_lose_mood(5);
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			pc.metabolics_add_energy(3);
		},
	},
	"gandlevery_charge" : {
		name		: "Gandlevery Charge",
		desc		: "The Essence of Gandlevery leaves you full of energy at the cost of some mild stomach pain",
		duration	: 120,
		tick_duration	: 15,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "essence_of_gandlevery",
		on_apply	: function(pc, args){
			pc.metabolics_lose_mood(10);
			pc.metabolics_add_energy(30);
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			pc.metabolics_lose_mood(10);
			pc.metabolics_add_energy(30);
			
		},
	},
	"gardening_harvest_all_trees_in_time_period" : {
		name		: "One, Two, Tree, Four, Six, Eight",
		desc		: "Harvest each of the eight different kinds of <b>Trees<\/b>, all in one game day",
		duration	: 14400,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'gardening_harvest_all_trees_in_time_period';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"get_a_rasher" : {
		name		: "Get a Rasher",
		desc		: "Nibble 13 piggies in one game day",
		duration	: 14400,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "npc_piggy",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'animalkinship_nibble_meat';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"gift_of_gab" : {
		name		: "Gift of Gab",
		desc		: "20% bonus rewards on your next quest or achievement due to your incredible way with words",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "essence_of_silvertongue",
		on_apply	: function(pc, args){
			if (pc.buffs_has('silvertongue')) {
				pc.buffs_remove('silvertongue');
			}
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"glitch_train" : {
		name		: "On the Glitch Train",
		desc		: "You're on the Glitch train with at least <br>19 other glitches! Toot toot!",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"go_moloko_loco" : {
		name		: "Go Moloko Loco",
		desc		: "Milk 13 butterflies in one game day",
		duration	: 14400,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "npc_butterfly",
		on_apply	: function(pc, args){
			pc.butterflies_milked = {};
		},
		on_remove	: function(pc, args){
			var quest_id = 'animalkinship_milk_butterflies';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
			
			delete pc.butterflies_milked;
		},
		on_tick		: function(pc, args){
			
		},
	},
	"hairball_dash" : {
		name		: "Hairball Dash",
		desc		: "Drastically increase your speed for 1 minute with some energy loss",
		duration	: 60,
		tick_duration	: 15,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "essence_of_hairball",
		on_apply	: function(pc, args){
			pc.addBuffPhysics({vx_max:1.25}, this.class_tsid);
			pc.buffs_hairball_start();
		},
		on_remove	: function(pc, args){
			pc.removePhysics(this.class_tsid, true);
			pc.buffs_hairball_end();
		},
		on_tick		: function(pc, args){
			pc.metabolics_lose_energy(5);
			
		},
	},
	"hairball_flower" : {
		name		: "Hairball Rally",
		desc		: "Faster walk speed with some energy loss, for 5 minutes",
		duration	: 300,
		tick_duration	: 60,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "hairball_flower",
		on_apply	: function(pc, args){
			pc.addBuffPhysics({vx_max:1.1}, this.class_tsid);
		},
		on_remove	: function(pc, args){
			pc.removePhysics(this.class_tsid, true);
		},
		on_tick		: function(pc, args){
			pc.metabolics_lose_energy(5);
		},
	},
	"high_jumper" : {
		name		: "High Jumper",
		desc		: "You can jump really, really high",
		duration	: 7,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "spinach",
		on_apply	: function(pc, args){
			pc.addBuffPhysics({
				vx_max: 1.7,
				vy_jump: 4.5,
				gravity: 0.35
			}, this.class_tsid);
		},
		on_remove	: function(pc, args){
			pc.removePhysics(this.class_tsid, true);
		},
		on_tick		: function(pc, args){
			
		},
	},
	"hog_tie" : {
		name		: "Hog-Tied Escape Alert",
		desc		: "Place that piggy soon or it'll escape",
		duration	: 0,
		tick_duration	: 30,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "hogtied_piggy",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			// When Piggy is captured, player gets the "Hog-tie" buff. The buff gives 1 XP every 30 seconds 
			// and a growl "Be careful, you can lose the Piggy any minute!"
			
			pc.stats_add_xp(1, false, {'buff':'hog_tie'});
			pc.sendOnlineActivity("Be careful, you can lose the Piggy any minute!");
		},
	},
	"impervious_miner" : {
		name		: "Impervious Miner",
		desc		: "Mining uses no energy at all",
		duration	: 180,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "earthshaker",
		on_apply	: function(pc, args){
			pc.addSkillPackageOverride('mining', {energy_cost: 0});
			pc.addSkillPackageOverride('mining_fancypick', {energy_cost: 0});
		},
		on_remove	: function(pc, args){
			pc.removeSkillPackageOverride('mining');
			pc.removeSkillPackageOverride('mining_fancypick');
		},
		on_tick		: function(pc, args){
			
		},
	},
	"its_so_hot" : {
		name		: "It's So Hot!",
		desc		: "The sun, it burns...",
		duration	: 0,
		tick_duration	: 5,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: true,
		item_class	: "npc_cactus",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			//pc.overlay_dismiss('its_so_hot');
		},
		on_tick		: function(pc, args){
			pc.apiSendAnnouncement({
				type: 'vp_canvas',
				uid: 'its_so_hot',
				canvas: {
					color: '#cc0000',
					steps: [
						{alpha:.5, secs:.5},
						{alpha:.5, secs:.25},
						{alpha:0, secs:.5},
						{alpha:0, secs:3.75}
					],
					loop: false
				}
			});
			
			var actual = pc.metabolics_lose_mood(3);
			
			if (actual){
				pc.apiSendAnnouncement({
					uid: "its_so_hot_tip",
					type: "vp_overlay",
					duration: 1500,
					locking: false,
					width: 500,
					x: '50%',
					top_y: '15%',
					click_to_advance: false,
					text: [
						'<p align="center"><span class="nuxp_vog_smaller">So hot! '+actual+' mood!</span></p>',
					]
				});
			}
			
			if (pc.metabolics_get_mood() == 0) pc.metabolics_add_mood(3, true);
		},
	},
	"its_so_hot2" : {
		name		: "It's CRAZY Hot!",
		desc		: "The sun, it burns... hotter!",
		duration	: 0,
		tick_duration	: 2,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: true,
		item_class	: "npc_cactus",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			//pc.overlay_dismiss('its_so_hot2');
		},
		on_tick		: function(pc, args){
			pc.apiSendAnnouncement({
				type: 'vp_canvas',
				uid: 'its_so_hot2',
				canvas: {
					color: '#cc0000',
					steps: [
						{alpha:.5, secs:.5},
						{alpha:.5, secs:.25},
						{alpha:0, secs:.5},
						{alpha:0, secs:0.75}
					],
					loop: false
				}
			});
			
			var actual = pc.metabolics_lose_mood(3);
			
			if (actual){
				pc.apiSendAnnouncement({
					uid: "its_so_hot_tip",
					type: "vp_overlay",
					duration: 1500,
					locking: false,
					width: 500,
					x: '50%',
					top_y: '15%',
					click_to_advance: false,
					text: [
						'<p align="center"><span class="nuxp_vog_smaller">So hot! '+actual+' mood!</span></p>',
					]
				});
			}
			if (pc.metabolics_get_mood() == 0) pc.metabolics_add_mood(3, true);
		},
	},
	"kukubee_winter_negative" : {
		name		: "A Cold Place",
		desc		: "It's freezing. Eat something hearty or get out",
		duration	: 0,
		tick_duration	: 1,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: true,
		item_class	: null,
		on_apply	: function(pc, args){
			this.args.ticks_elapsed = 0;
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			if (pc.location.tsid == 'LM413ATO8PR54' || pc.location.tsid == 'LLI11ITO8SBS6' || pc.location.tsid == 'LM11E7ODKHO1QJE'){
				pc.metabolics_lose_energy(1);
				this.args.ticks_elapsed++;
			
				if (this.args.ticks_elapses % 10 == 0){
					pc.sendActivity("It's cold here! Watch it - you are losing energy fast!");
				}
				else if (this.args.ticks_elapsed % 5 == 0){
					pc.sendActivity("Eating something hearty will protect you from the cold.");
				}
			}
			else{
				pc.buffs_remove('kukubee_winter_negative');
			}
		},
	},
	"kukubee_winter_positive" : {
		name		: "A Hearty Feeling",
		desc		: "Immune from ill effects of cold",
		duration	: 60,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "hearty_groddle_sammich",
		on_apply	: function(pc, args){
			if (pc.buffs_has('kukubee_winter_negative')){
				pc.buffs_remove('kukubee_winter_negative');
			}
		},
		on_remove	: function(pc, args){
			if (pc.location.tsid == 'LM413ATO8PR54' || pc.location.tsid == 'LLI11ITO8SBS6' || pc.location.tsid == 'LM11E7ODKHO1QJE'){
				pc.buffs_apply('kukubee_winter_negative');
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"levitation_by_meditation" : {
		name		: "Levitating",
		desc		: "Yogic flying! You are able to levitate at will (hit spacebar!!)",
		duration	: 5,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "focusing_orb",
		on_apply	: function(pc, args){
			if (pc.imagination_has_upgrade("levitation_physics")) {
				pc.addBuffPhysics({
					jetpack:1,
					gravity:0.798,
					vy_jump:1.176,
					friction_air:1.59
				}, this.class_tsid);
			}
			else {
				pc.addBuffPhysics({
					jetpack:1,
					gravity:0.85
				}, this.class_tsid);
			}
		},
		on_remove	: function(pc, args){
			pc.removePhysics(this.class_tsid, true);
			
			pc.buffs_apply('meditation_cooldown',{duration: 20});
		},
		on_tick		: function(pc, args){
			
		},
	},
	"machine_shop_pit_stop_in_time_period" : {
		name		: "Machine Shop Pit Stop",
		desc		: "Fully Assemble and Disassemble a Machine in 2 minutes",
		duration	: 120,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "blockmaker",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'engineering_assemble_machine';
			var status = pc.getQuestStatus(quest_id);
			if (status != 'done'){
				pc.failQuest(quest_id);
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"make_different_potions" : {
		name		: "Make 7 Different Potions",
		desc		: "Make 7 different potions in one game day",
		duration	: 14400,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "potion_chris",
		on_apply	: function(pc, args){
			pc.stats.potions_made = {};
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'potionmaking_make_different_potions_in_a_time_period';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
			
			delete pc.stats.potions_made;
		},
		on_tick		: function(pc, args){
			
		},
	},
	"max_luck" : {
		name		: "Max Luck",
		desc		: "everything you touch turns to gold. all dice-rolls are maxed",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "npc_rube",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"meditation_cooldown" : {
		name		: "Meditation Cooldown",
		desc		: "You can't use Meditation until this is over!",
		duration	: 120,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: "focusing_orb",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"mining_deplete_rocks_in_time_period" : {
		name		: "Another Day Older and Deeper In Debt",
		desc		: "Use your <b>Pick<\/b> to wear 5 <b>Rocks<\/b> down to nary a nub in just one game day",
		duration	: 14400,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "pick",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'mining_deplete_rocks_in_time_period';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"mining_mine_in_time_period" : {
		name		: "Giv'r till you Shiver",
		desc		: "Mine 15 times in just 5 minutes",
		duration	: 300,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "pick",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'mining_mine_in_time_period';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"moonwalk" : {
		name		: "Moonwalk",
		desc		: "A new way to move",
		duration	: 11,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "moon",
		on_apply	: function(pc, args){
			pc.location.announce_sound_to_all('MOONWALK', 0, 0, true);
			pc.apiSendMsg({type: "avatar_orientation", reversed: true});
			pc.addBuffPhysics({
				vx_max: 0.7,
				gravity: 0.5
			}, this.class_tsid);
		},
		on_remove	: function(pc, args){
			pc.apiSendMsg({type: "avatar_orientation", reversed: false});
			pc.removePhysics(this.class_tsid, true);
		},
		on_tick		: function(pc, args){
			
		},
	},
	"nekkid" : {
		name		: "Nekkid!",
		desc		: "Yup, you're nekkid alright!",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "moon",
		on_apply	: function(pc, args){
			pc.nekkid_entered_location = [pc.x, pc.y];
		},
		on_remove	: function(pc, args){
			delete pc.nekkid_entered_location;
		},
		on_tick		: function(pc, args){
			
		},
	},
	"no_no_powder" : {
		name		: "No-No Powder Rush",
		desc		: "This feels really, really fantastic",
		duration	: 360,
		tick_duration	: 1,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "no_no_powder",
		on_apply	: function(pc, args){
			if (pc.buffs_has('no_no_powder_crash')){
				pc.buffs_remove('no_no_powder_crash');
			}
			if (!pc.no_no_powder_start) pc.no_no_powder_start = time();
			pc.metabolics_set_energy(pc.metabolics.energy.top);
			pc.metabolics_set_mood(pc.metabolics.mood.top);
		},
		on_remove	: function(pc, args){
			var uses = pc.achievements_get_daily_label_count('no_no_powder','sniff');
			
			var duration = 360;
			if (uses > 1){
				duration = Math.round(duration / (Math.pow(2, uses-1)));
			}
			
			if (duration < 1) duration = 1; 
			
			pc.buffs_apply('no_no_powder_crash',{duration: duration});
		},
		on_tick		: function(pc, args){
			if (!pc.is_dead){
				pc.metabolics_set_energy(pc.metabolics.energy.top);
				pc.metabolics_set_mood(pc.metabolics.mood.top);
			}
			
			if (time() - pc.no_no_powder_start > 660 && !pc.achievements_has('dragon_chaser')) pc.achievements_increment('powders', 'dragon_chaser', 1);
		},
	},
	"no_no_powder_crash" : {
		name		: "No-No Powder Crash",
		desc		: "Crashing! Get more powder or die!",
		duration	: 360,
		tick_duration	: 1,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: true,
		item_class	: "no_no_powder",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			if (!pc.buffs_has('no_no_powder')){
				if (pc.no_no_powder_start) delete pc.no_no_powder_start;
				pc.croak();
			}
		},
		on_tick		: function(pc, args){
			//
			// this is a variable-duration buff, but buffs can only last for a multiple of their ticks, so we have to
			// tick every second, but only actually do anything every 60. Yes, this is a BIG HACK.
			//
			
			var buff = pc.buffs_get_instance('no_no_powder_crash');
			
			if (buff.args.ticks_elapsed/60 == intval(buff.args.ticks_elapsed/60)){
			
				var max_mood = pc.metabolics_get_max_mood();
				var max_energy = pc.metabolics_get_max_energy();
			
				pc.metabolics_lose_energy(Math.round(max_energy*0.03));
				pc.metabolics_lose_mood(Math.round(max_energy*0.03));
			}
		},
	},
	"offline_test" : {
		name		: "Offline Test",
		desc		: "",
		duration	: 60,
		tick_duration	: 10,
		is_offline	: true,
		is_timer	: false,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			log.info('offline remove!');
		},
		on_tick		: function(pc, args){
			log.info('offline tick!');
		},
	},
	"online_test" : {
		name		: "Online Test",
		desc		: "",
		duration	: 60,
		tick_duration	: 10,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			log.info('online remove!');
		},
		on_tick		: function(pc, args){
			log.info('online tick!');
		},
	},
	"party_time" : {
		name		: "Party Time!",
		desc		: "Party, yeah! Everyone's having a good time!",
		duration	: 60,
		tick_duration	: 10,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "beer",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			pc.metabolics_add_mood(5);
		},
	},
	"piggy_capture_cooldown" : {
		name		: "Piggy Capture Cooldown",
		desc		: "You can't capture another piggy until this is over!",
		duration	: 600,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: "hogtied_piggy",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"play_musicblocks" : {
		name		: "Blocks That Rock",
		desc		: "Play 25 musicblocks for 25 players in one game day",
		duration	: 14400,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "musicblock_b_brown_01",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'play_musicblocks';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"pleasant_equilibrium" : {
		name		: "Pleasant Equilibrium",
		desc		: "Being in a really bad mood does not deduct from iMG earned",
		duration	: 300,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "exotic_juice",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"please_wait" : {
		name		: "Please Wait",
		desc		: "Do not move: just wait.",
		duration	: 10,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "npc_bureaucrat",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			if (time() - args.start >= 10){
				function is_bureaucrat(it){ return it.class_tsid == 'npc_bureaucrat' && !it.isBusy(); }
				var bureaucrat = pc.findCloseStack(is_bureaucrat);
				if (bureaucrat){
					log.info(bureaucrat+' will help '+pc);
					bureaucrat.helpPlayer(pc);
				}
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"poisoners_guilt" : {
		name		: "Poisoner's Guilt",
		desc		: "You feel bad for the tree poisoning",
		duration	: 90,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: "potion_tree_poison",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"pooped" : {
		name		: "Pooped",
		desc		: "You are seriously pooped! You need energy to get out of it",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: null,
		on_apply	: function(pc, args){
			// http://staging.glitch.com/game/?vy_jump=-380&vy_max=770&vx_max=180&friction_floor=4.3
			
			pc.addBuffPhysics({
				vx_max: 0.5,
				vy_jump: 0.5
			}, this.class_tsid);
			
			pc.prompts_add({
				txt		: "You are seriously pooped! You need energy to get out of it.",
				icon_buttons	: false,
				timeout		: 10,
				choices		: [
					{ value : 'ok', label : 'OK' }
				]
			});
		},
		on_remove	: function(pc, args){
			pc.removePhysics(this.class_tsid, true);
		},
		on_tick		: function(pc, args){
			
		},
	},
	"purpled_out" : {
		name		: "Purpled Out",
		desc		: "Your brain feels like it's trying to escape",
		duration	: 120,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: "essence_of_purple",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"purple_flower" : {
		name		: "Purple Junk",
		desc		: "Feelin' kinda… purple?",
		duration	: 126,
		tick_duration	: 7,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "purple_flower",
		on_apply	: function(pc, args){
			pc.apiSendAnnouncement({
				type: 'vp_canvas',
				uid: 'purple_haze',
				canvas: {
					color: '#a020f0',
					steps: [
						{alpha:.5, secs:.5},
						{alpha:.5, secs:.25},
						{alpha:0, secs:.5},
						{alpha:0, secs:1.75}
					],
					loop: false
				}
			});
			
			
			pc['!junk_ticks'] = 1;
			
			
			pc.apiSendAnnouncement({
				uid: "purple_msg_1",
				type: "vp_overlay",
				duration: 1500,
				locking: false,
				width: 500,
				x: '50%',
				top_y: '15%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">Ugh…</span></p>',
				]
			});
			
			pc.apiSendAnnouncement({
				uid: "purple_msg_2",
				type: "vp_overlay",
				duration: 1500,
				locking: false,
				width: 500,
				delay_ms:1000,
				x: '20%',
				top_y: '45%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">Whoa…</span></p>',
				]
			});
			
			pc.apiSendAnnouncement({
				uid: "purple_msg_3",
				type: "vp_overlay",
				duration: 1500,
				locking: false,
				width: 500,
				delay_ms:1500,
				x: '76%',
				top_y: '37%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">I do not feel right.</span></p>',
				]
			});
			
			pc.apiSendAnnouncement({
				uid: "purple_msg_4",
				type: "vp_overlay",
				duration: 1500,
				locking: false,
				width: 500,
				delay_ms:2250,
				x: '25%',
				top_y: '79%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">I do not feel right at all.</span></p>',
				]
			});
			
			pc.apiSendAnnouncement({
				uid: "purple_msg_5",
				type: "vp_overlay",
				duration: 1500,
				locking: false,
				width: 500,
				delay_ms:2500,
				x: '75%',
				top_y: '22%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">Ugh…</span></p>',
				]
			});
			
			pc.apiSendAnnouncement({
				uid: "purple_msg_6",
				type: "vp_overlay",
				duration: 1500,
				locking: false,
				width: 500,
				delay_ms:3500,
				x: '50%',
				top_y: '60%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">I am feelin\' mflerblwerb…</span></p>',
				]
			});
			
			pc.apiSendAnnouncement({
				uid: "purple_msg_7",
				type: "vp_overlay",
				duration: 1500,
				locking: false,
				width: 500,
				delay_ms:4000,
				x: '20%',
				top_y: '24%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">A little heeblwob…</span></p>',
				]
			});
			
			pc.apiSendAnnouncement({
				uid: "purple_msg_8",
				type: "vp_overlay",
				duration: 1500,
				locking: false,
				width: 500,
				delay_ms:4500,
				x: '70%',
				top_y: '73%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">Zibblezibzob…</span></p>',
				]
			});
			
			
			pc.apiSendAnnouncement({
				uid: "purple_msg_9",
				type: "vp_overlay",
				duration: 1500,
				locking: false,
				width: 500,
				delay_ms:5000,
				x: '40%',
				top_y: '13%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">Hoopdeboop…</span></p>',
				]
			});
			
			pc.apiSendAnnouncement({
				uid: "purple_msg_10",
				type: "vp_overlay",
				duration: 1500,
				locking: false,
				width: 500,
				delay_ms:5500,
				x: '20%',
				top_y: '83%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">Hurf…</span></p>',
				]
			});
			
			pc.apiSendAnnouncement({
				uid: "purple_msg_11",
				type: "vp_overlay",
				duration: 2500,
				locking: false,
				width: 500,
				delay_ms:7000,
				x: '50%',
				top_y: '40%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">I should NOT have eaten that.</span></p>',
				]
			});
			
			pc.playEmotionAnimation('surprise');
		},
		on_remove	: function(pc, args){
			if(pc['!junk_ticks']) {
				delete pc['!junk_ticks'];
			}
			
			if (args && args.complete_purple_journey) pc.quests_set_flag('purple_journey_munch');
		},
		on_tick		: function(pc, args){
			pc.apiSendAnnouncement({
				type: 'vp_canvas',
				uid: 'purple_haze',
				canvas: {
					color: '#a020f0',
					steps: [
						{alpha:.5, secs:.5},
						{alpha:.5, secs:.25},
						{alpha:0, secs:.5},
						{alpha:0, secs:1.75}
					],
					loop: false
				}
			});
			
			pc.stats_add_xp(1,false, {'buff':'purple_flower'});
			
			pc.playEmotionAnimation('surprise');
			
			if(pc['!junk_ticks']) {
				pc['!junk_ticks'] = 0;
				return;
			} else {
				pc['!junk_ticks'] = 1;
			}
			
			
			pc.playEmotionAnimation('surprise');
			
			var babble = [
				"I wonder if hoopyhoobadoop?",
				"Misfiguring misfigfnl.<br />Butterscotch woooooo…",
				"My hands are huge, and they can touch anything but themselves.",
				"Meebleforp.",
				"Whizzlehizz.",
				"I tried to bleepadoobapoop beep whoop.",
				"I'm a banana.",
				"Whoops, there goes Mr. Jelly.",
				"I liked their first album better, before they got all whibbly and blue.",
				"Do you ever wonder about, like, you know?",
				"Shmoop.",
				"Over there I saw a horbleblorp.",
				"You used to be about the music, but now you're all about the shrimp.",
				"What if this never goes away? What if I feel like this forever?",
				"'Twas brillig, and the slithy toves <br /> Did gyre and gimble in the wabe…",
				"I want to go back to the blue room.",
				"Oh no pigeons.",
				"I had a pet monkey once, but his lyre-playing was subpar."
			];
			
			var xpos = Math.random() * 50 + 25;
			var ypos = Math.random() * 50 + 25;
			
			pc.apiSendAnnouncement({
				uid: "purple_msg",
				type: "vp_overlay",
				duration: 2500,
				locking: false,
				width: 400,
				x: xpos+'%',
				top_y: ypos+'%',
				click_to_advance: false,
				text: [
					'<p align="center"><span class="nuxp_vog_smaller">'+choose_one(babble)+'</span></p>',
				]
			});
		},
	},
	"purple_journey" : {
		name		: "Purple Journey",
		desc		: "HURRY UP PLEASE ITS TIME",
		duration	: 90,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "essence_of_purple",
		on_apply	: function(pc, args){
			if (pc.taken_purple) {
				delete pc.taken_purple;
			}
		},
		on_remove	: function(pc, args){
			pc.instances_exit('purple_journey');
			pc.buffs_apply('purpled_out');
			pc.events_add({callback: 'achievements_increment_delayed', group: 'essence_of_purple', label: 'journeys_taken'}, 2);
		},
		on_tick		: function(pc, args){
			
		},
	},
	"rainbow_run" : {
		name		: "Rainbow Run",
		desc		: "Collect at least 30 coins!!!",
		duration	: 30,
		tick_duration	: 1,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			pc.announce_music('FUTURE_SWING_30');
			pc.rainbow_run_overlay();
		},
		on_remove	: function(pc, args){
			pc.rainbow_run_over();
			pc.dismiss_rainbow_run_overlay();
		},
		on_tick		: function(pc, args){
			
		},
	},
	"real_bummer" : {
		name		: "Real Bummer",
		desc		: "Keeps your mood down real low",
		duration	: 180,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			if (pc.metabolics_get_mood() > 30){
				pc.metabolics_set_mood(30);
			}
			
			pc.metabolics.mood.apiSetLimits(0, 30);
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"rooked" : {
		name		: "Rooked!",
		desc		: "Gah! Horrible Rookage! You are frozen",
		duration	: 10,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: null,
		on_apply	: function(pc, args){
			/*var annc = {
				type: 'pc_overlay',
				duration: (10 * 1000),
				pc_tsid: pc.tsid,
				locking: true,
				delta_x: 0,
				delta_y: -115,
				swf_url: pc.overlay_key_to_url('rooked'),
				uid: pc.tsid+'_rooked'
			};
			pc.apiSendAnnouncement(annc);*/
		},
		on_remove	: function(pc, args){
			pc.unRook();
			//pc.buffs_apply('rooked_recovery');
		},
		on_tick		: function(pc, args){
			
		},
	},
	"rooked_recovery" : {
		name		: "Rook Recovery",
		desc		: "You feel real rough and move real slow",
		duration	: 30,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: null,
		on_apply	: function(pc, args){
			pc.metabolics_recalc_limits();
			pc.addBuffPhysics({
				vx_max: 0.5,
				vy_jump: 0.5
			}, this.class_tsid);
		},
		on_remove	: function(pc, args){
			pc.apiSetTimer('metabolics_recalc_limits', 100);
			pc.removePhysics(this.class_tsid, true);
		},
		on_tick		: function(pc, args){
			
		},
	},
	"rookswort" : {
		name		: "Steady as a Rook",
		desc		: "Slows down your \"natural mood loss\" by half",
		duration	: 300,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "rookswort",
		on_apply	: function(pc, args){
			pc.metabolics_lose_mood(2);
			pc.metabolics_add_energy(3);
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"rook_armor" : {
		name		: "Rook Armor",
		desc		: "Gird your loins to face down Rookly threats",
		duration	: 300,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "essence_of_rookswort",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"rook_vulnerability_hug" : {
		name		: "Rook Hug Vulnerability",
		desc		: "The Rook is vulnerable to hugs! Quick, use your Emo Bear to hug nearby plants and animals",
		duration	: 10,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "emotional_bear",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"rook_vulnerability_kiss" : {
		name		: "Rook Kiss Vulnerability",
		desc		: "The Rook is vulnerable to kisses! Quick, use your Emo Bear to kiss nearby plants and animals",
		duration	: 10,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "emotional_bear",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"rook_wrath" : {
		name		: "Rook's Wrath",
		desc		: "You are being targeted by the Rook. Beware!",
		duration	: 120,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: true,
		item_class	: "rook_head",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"rubeweed" : {
		name		: "Luck of the Rube",
		desc		: "Do ru' feel lucky? Well do ru? Punk? An improved chance of drops for the next 5 minutes",
		duration	: 300,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "rubeweed",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"rube_lure" : {
		name		: "Rube Lure",
		desc		: "Irresistible to Rubes",
		duration	: 0,
		tick_duration	: 5,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "essence_of_rubeweed",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			pc.location.tryRubeLure(pc);
		},
	},
	"savoring_experience" : {
		name		: "Savoring Experience",
		desc		: "Periodic mood-booster, based on your current mood",
		duration	: 80,
		tick_duration	: 10,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "savory_smoothie",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			var mood = pc.metabolics_add_mood(0.05 * pc.metabolics_get_mood());
		},
	},
	"silvertongue" : {
		name		: "Silverytongued Charmer",
		desc		: "Everything good just feels even better. 5% bonus rewards on your next quest or achievement",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "silvertongue",
		on_apply	: function(pc, args){
			pc.metabolics_add_mood(5);
			pc.metabolics_lose_energy(5);
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"sky_cruisin" : {
		name		: "Sky Cruisin'",
		desc		: "A nice mood boost, every 10 seconds",
		duration	: 80,
		tick_duration	: 10,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "cloud_11_smoothie",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			var mood = pc.metabolics_add_mood(5);
		},
	},
	"slow_gin" : {
		name		: "Slow Gin",
		desc		: "Mood increases every 10 seconds",
		duration	: 100,
		tick_duration	: 10,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "slow_gin_fizz",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			var mood = pc.metabolics_add_mood(5);
		},
	},
	"small_enlightenment" : {
		name		: "Small Enlightenment",
		desc		: "Doubles skill learning speed",
		duration	: 90,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "pungent_sunrise",
		on_apply	: function(pc, args){
			// "Small Enlightenment": doubles learning for 90 seconds
			if (pc.previous_small_enlightenment_time > 0 && pc.previous_small_enlightenment_time < 90) 
			{
				// Accelerate for less than 90 seconds since we've already had the buff for some time.
				pc.skills_start_acceleration(90 - pc.previous_small_enlightenment_time, true);
			}
			else {
				pc.skills_start_acceleration(90, true);
			}
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"smelt_it_dealt_it" : {
		name		: "Smelt It, Dealt It",
		desc		: "Smelt metal rocks without using energy",
		duration	: 30,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "face_smelter",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			// remove override from smelter's smelt verb
			pc.removeSkillPackageOverride('smelting');
		},
		on_tick		: function(pc, args){
			
		},
	},
	"smug_healthy_glow" : {
		name		: "Smug Healthy Glow",
		desc		: "You feel cleansed and healthy from top to intestine",
		duration	: 120,
		tick_duration	: 30,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "pepitas",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			var energy = pc.metabolics_add_energy(11);
		},
	},
	"sneezing" : {
		name		: "Sneezing",
		desc		: "Nobody likes having to sneeze",
		duration	: 21,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "sneezing_powder",
		on_apply	: function(pc, args){
			pc.events_add({ callback: 'sneeze'}, randInt(0, 8));
			
			pc.events_add({ callback: 'sneeze'}, 13);
		},
		on_remove	: function(pc, args){
			pc.location.apiSendAnnouncement({
				type: 'pc_overlay',
				swf_url: overlay_key_to_url('overlay_sneezing_powder'),
				duration: 2000,
				locking: true,
				pc_tsid: pc.tsid,
				delta_x: 0,
				delta_y: -110,
				width: 300,
				height: 300
			});
			
			pc.sendActivity('With that last sneeze, you finally succeed in blowing out the bean that\'s been lodged in your nose for days. Relief! Now for the last time: stop sticking beans up there.');
			
			pc.location.createItem('bean_plain', 1, pc.x, pc.y, 100);
		},
		on_tick		: function(pc, args){
			
		},
	},
	"sneezing_fit" : {
		name		: "Sneezing Fit",
		desc		: "If only you could stop sneezing",
		duration	: 33,
		tick_duration	: 3,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "bean_plain",
		on_apply	: function(pc, args){
			pc['!sneezes'] = 0;
		},
		on_remove	: function(pc, args){
			pc.sendActivity("Either you're out of sneezes or you're out of beans. In any case, you should stop making bets that require you to put things up your nose.");
		},
		on_tick		: function(pc, args){
			pc.announce_sound('SNEEZING_AHCHOO', 0, 0, 0);
			pc.location.apiSendAnnouncementX({
				type: 'pc_overlay',
				swf_url: overlay_key_to_url('overlay_sneezing_powder'),
				duration: 2000,
				locking: false,
				pc_tsid: pc.tsid,
				delta_x: 0,
				delta_y: -110,
				width: 300,
				height: 300
			}, pc);
			pc.apiSendAnnouncement({
				type: 'pc_overlay',
				swf_url: overlay_key_to_url('overlay_sneezing_powder'),
				duration: 2000,
				locking: true,
				pc_tsid: pc.tsid,
				delta_x: 0,
				delta_y: -110,
				width: 300,
				height: 300
			});
			var players = pc.location.getActivePlayers();
			for(var i in players) {
				if(players[i] != pc) {
					players[i].metabolics_add_mood(2);
				} else {
					players[i].metabolics_lose_mood(3);
				}
			}
			pc.location.createItem('bean_plain', 2, pc.x, pc.y-1, 100);
			pc['!sneezes']++;
			
			if(pc['!sneezes'] == 1) {
				pc.sendActivity("You sneezed out some beans!");
			} else if(pc['!sneezes'] == 3) {
				pc.sendActivity("You sneezed out some more beans!");
			} else if(pc['!sneezes'] == 5) {
				pc.sendActivity("OK, this is starting to get worrying");
			} else if(pc['!sneezes'] == 7) {
				pc.sendActivity("Where are they even coming from?");
			} else if(pc['!sneezes'] == 9) {
				pc.sendActivity("Beans, beans, an awful disease: the more you snort the more you sneeze.");
			} else if(pc['!sneezes'] == 10) {
				pc.sendActivity("Wait, it feels like this is the last one.");
			}
		},
	},
	"soil_appreciation_loam_in_time_period" : {
		name		: "Many Shovels Make Something-Something Loam",
		desc		: "Loose 11 <b>Lumps of Loam<\/b> from <b>Dirt Piles<\/b> or <b>Patches<\/b> in 30 minutes ",
		duration	: 1800,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "loam",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'soilappreciation_collect_loam';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"sophisticated_feeling" : {
		name		: "Sophisticated Feeling",
		desc		: "Large mood boosts, a minute apart",
		duration	: 180,
		tick_duration	: 60,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "cosmapolitan",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			var mood = pc.metabolics_add_mood(20);
		},
	},
	"stuffed" : {
		name		: "Stuffed",
		desc		: "You are stuffed.  You can’t eat any more today",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: null,
		on_apply	: function(pc, args){
			pc.prompts_add({
				txt		: "You are stuffed.  You can’t eat any more today.",
				icon_buttons	: false,
				timeout		: 10,
				choices		: [
					{ value : 'ok', label : 'OK' }
				]
			});
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"sugar_crash" : {
		name		: "Sugar Crash",
		desc		: "Drops your energy and mood",
		duration	: 120,
		tick_duration	: 60,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: true,
		item_class	: null,
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			// -20 mood, -10 energy, every 1 minute, 2 times
			pc.metabolics_lose_mood(20);
			pc.metabolics_lose_energy(10);
		},
	},
	"sugar_rush" : {
		name		: "Sugar Rush",
		desc		: "OMGiant! Harder Faster Better Stronger Sugar Sugar Sugar Sugar!",
		duration	: 120,
		tick_duration	: 30,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "birch_candy",
		on_apply	: function(pc, args){
			pc.addBuffPhysics({vx_max:1.05}, this.class_tsid);
		},
		on_remove	: function(pc, args){
			pc.removePhysics(this.class_tsid, true);
		},
		on_tick		: function(pc, args){
			var energy = pc.metabolics_add_mood(7);
		},
	},
	"super_pooped" : {
		name		: "Super Pooped",
		desc		: "You are completely pooped. Rest and chat a bit until the new day arrives",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: null,
		on_apply	: function(pc, args){
			pc.prompts_add({
				txt		: "You are completely pooped. Rest and chat a bit until the new day arrives.",
				icon_buttons	: false,
				timeout		: 10,
				choices		: [
					{ value : 'ok', label : 'OK' }
				]
			});
			
			pc.addBuffPhysics({
				vx_max: 0.5,
				vy_jump: 0.5
			}, this.class_tsid);
		},
		on_remove	: function(pc, args){
			pc.removePhysics(this.class_tsid, true);
		},
		on_tick		: function(pc, args){
			
		},
	},
	"teleportation_cooldown" : {
		name		: "Teleportation Cooldown",
		desc		: "You can't teleport again until this is over!",
		duration	: 5,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: null,
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			// Set a timer to tell the client they can teleport again, because the buff is still here until after this code is run
			pc.apiSetTimer('teleportation_notify_client', 1000);
		},
		on_tick		: function(pc, args){
			
		},
	},
	"teleportation_teleport_in_time_period" : {
		name		: "Fear of Flying",
		desc		: "Teleport five times in 30 minutes",
		duration	: 1800,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: true,
		item_class	: "quest_req_icon_teleport",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'teleportation_teleport_in_time_period';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"the_daily_grind" : {
		name		: "The Daily Grind",
		desc		: "Refine 200 Ore in 2 minutes",
		duration	: 120,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "ore_grinder",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'refining_refine_ore_in_time_period';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"tickle_me_emo" : {
		name		: "Tickle Me Emo",
		desc		: "Hug 33 different players in one game day",
		duration	: 14400,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "emotional_bear",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			var quest_id = 'zero_mood';
			var status = pc.getQuestStatus(quest_id);
			if (status == 'todo'){
				pc.failQuest(quest_id);
			}
		},
		on_tick		: function(pc, args){
			
		},
	},
	"timer_test" : {
		name		: "Timer Test",
		desc		: "This is a buff for testing all things time-related.",
		duration	: 120,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: null,
		on_apply	: function(pc, args){
			pc.sendActivity("Test buff started!");
		},
		on_remove	: function(pc, args){
			pc.sendActivity("Test buff is done!");
		},
		on_tick		: function(pc, args){
			
		},
	},
	"too_much_nostalgia" : {
		name		: "Overwhelmed by Ancestral Nostalgia",
		desc		: "All that nostalgia was too much. You need a breather!",
		duration	: 1800,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: null,
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			pc.reset_baqala_times();
		},
		on_tick		: function(pc, args){
			
		},
	},
	"turn_off_quests" : {
		name		: "Quest Offers Disabled",
		desc		: "Will disable the offering of quests",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "quest_spawner",
		on_apply	: function(pc, args){
			pc.sendOnlineActivity('Quest Offers Disabled');
		},
		on_remove	: function(pc, args){
			pc.sendOnlineActivity('Quest Offers Re-enabled');
			pc.quests_restart_queue();
		},
		on_tick		: function(pc, args){
			
		},
	},
	"walking_dead" : {
		name		: "Walking Dead",
		desc		: "You are dead, and yet walking. AMAZING! Adding some extra text as well",
		duration	: 0,
		tick_duration	: 60,
		is_offline	: false,
		is_timer	: false,
		is_debuff	: false,
		item_class	: "admin_widget",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			pc.sendOnlineActivity('Braiiiiiiiiins!');
		},
	},
	"well_fed_energy" : {
		name		: "Apple a Day",
		desc		: "An additional energy boost at the end",
		duration	: 30,
		tick_duration	: 30,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "apple",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			pc.metabolics_add_energy(args.energy ? args.energy : 5);
		},
	},
	"yellow_crumb_flower" : {
		name		: "Crumb of Knowledge",
		desc		: "Suddenly you feel super focused. Doubles learning speed for 1 minute",
		duration	: 60,
		tick_duration	: 0,
		is_offline	: false,
		is_timer	: true,
		is_debuff	: false,
		item_class	: "yellow_crumb_flower",
		on_apply	: function(pc, args){
			pc.skills_start_acceleration(60);
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
	"zen" : {
		name		: "Zen",
		desc		: "You cannot gain energy from meditation anymore today",
		duration	: 0,
		tick_duration	: 0,
		is_offline	: true,
		is_timer	: true,
		is_debuff	: true,
		item_class	: "focusing_orb",
		on_apply	: function(pc, args){
			
		},
		on_remove	: function(pc, args){
			
		},
		on_tick		: function(pc, args){
			
		},
	},
};

// generated ok
