
// This file is for functions and data relating to hints given by the butler. 
// It also has responses to "hi".

function giveHint(pc) {
	var now = time();
	//log.info(" HINT time is "+this.last_hint_time+" and current time is "+now+" difference is "+(now - this.last_hint_time)+" seconds");
	
	var start_delay = 60*10; // don't hint until 10 minutes after creation
	
	if (!this.intro_end_time || (now - this.intro_end_time) <= start_delay) { 
		return;
	}
	
	var interval = 60*60;  	  // 1 hour
	var rook_interval = 60*5; // 5 minutes for rook attacks
	var hi_interval = 15;
	
	// Decrease interval for lower level players
	var player_level = pc.stats_get_level()
	if ( player_level <= 7 ) {
		interval = 60*7; // 7 minutes
	}
	else if ( player_level <= 12 ) {
		interval = 60*30; // half an hour
	}
	
	if (config.is_dev) { 
		interval = 5;		  // 5 seconds
		rook_interval = 5;
	}
	
	// Special for testing:
	if (this.tsid == "BUVH944EIPA34FQ" // Ali's butler
	||  this.tsid == "BUV7ORMUEL13UD9" // butler belonging to Turing Hopper, Liz's test character
	||  this.tsid == "BHV7T45H62C3D03" // Ali's alt's butler
	||  this.tsid == "BHVSNQLQ82C3HN1" // another of Ali's butlers
	) {
		interval = 5;
	}
	
	if (!this.last_hint_time) {
		this.last_hint_time = 1;
	}
	if (!this.last_hi_time) { 
		this.last_hi_time = 1;
	}
	
	this.logDebugInfo("checking hint interval "+this.last_hint_time+" and now is "+now+" diff is "+Math.abs(now-this.last_hint_time));
	
	if ((now - this.last_hint_time) > interval && (now - this.last_hi_time) > hi_interval) {
		var hint = this.getHint(pc);
		this.logDebugInfo("hint is "+hint);
		this.sendBubbleAndChat(pc, hint, true, 5000);
	}
	else if ((now - this.last_hint_time) > rook_interval  && (now - this.last_hi_time) > hi_interval) { 
		var hint = this.getRookNotification(pc.stats_get_level());
		if (hint) {
			this.given_hints.push(hint);
			this.last_hint_given = hint;
			this.last_hint_time = time();
			this.sendBubbleAndChat(pc, hint, true, 5000);
		}
	}
}

function getHint(pc) {

	if (!this.last_hint_given) { this.last_hint_given = ""; }
	if (!this.given_hints) { this.given_hints = []; }

	var hint = null;
	
	hint = this.getHintPreReqs(pc);
	
	if (!hint) {
		hint = this.getHintNoPreReqs(pc);
	}
	
	if (!hint) {
		delete this.given_hints;
		hint = this.getHint(pc);
	}
	
	this.given_hints.push(hint);
	this.last_hint_given = hint;
	this.last_hint_time = time();
	return hint;
}


function getHintNoPreReqs(pc) {

	var hint = "";
	
	var hints = [
							"If I might beg your indulgence, have you noticed that if you pick up a quoin near another player, they get a bit of the quoin too? This works in a chain reaction with many players. I recommend it. (Excuse me if I am teaching my grandmother to shard quoins.)",
							"Remember, your glitchiness: you can press 'i' any time to go into Info Mode. You can find out nearly everything that way! With one letter! Astounding!",
							"If you like to zoom (in or out), try using the  '+' and '-'. Keys. Zoom! Zoom zoom! Amazing.",
							"Do you like pressing keys, madamsir? Might I suggest pressing and holding '?' then? It will give you a lovely set of hotkeys to enjoy.",
							"If you ever want to know what date it is - if such things are important to you - look at the calendar by clicking the time in the top right, then the calendar icon. Ta-da!",
							"Found a bug in the game? Click on the little bug icon in the upper right of your screen. The devs will appreciate it, and it's nice to be helpful (I should know, I'm a butler).",
							"Ma'amsir, I wonder if you have perused the <a href=\"event:external|http://www.glitch.com/snaps/recent/\">Snaps</a> page lately? People often take pictures of new things in the world, so have a look to find out what's going on.",
							'Excuse me, your glitchiness. I found a list of useful links that I thought might come in handy if you ever need more assistance than I can give you. They are: <a href="event:external|http://www.glitch.com/encyclopedia/">Encyclopedia</a>, <a href="event:external|http://www.glitch.com/forum/">Forums</a>, <a href="event:external|http://www.glitchremote.com/">Glitch Remote</a>, <a href="event:external|http://www.glitch-strategy.com/">Glitch Strategy</a>, <a href="event:external|http://resources.grelca.com/">Glitch Housing Routes & Directory</a>. '
						  ];
	var possibles = [];
	
	for (var i in hints) { 
		if (!this.hintAlreadyGiven(hints[i])) {
			possibles.push(hints[i]);
		}
	}
	
	if (possibles.length > 0) {
		hint = choose_one(possibles);
	}
	
	return hint;
}

function getHintPreReqs(pc) {

	var possibles = [];
	var hint = "";
	
	var player_level = pc.stats_get_level();
	
	if (player_level <= 5) {
		hint = "Oh, sirmadam! Don't forget --- you can get to lots of useful things by clicking on the picture of your avatar in the upper left corner of your screen.";
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
		
		hint = "Psst, boss. See that window to the right? The one labeled \"Local Chat / Activity\"? Don't forget to look at it. All kinds of useful things show up there. And it'll let you talk to other players!";
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
	
	if (player_level <= 7) {
		hint = "A little butler's tip for you, madamsir: you can make your own salt the same way you can make many spices: by grinding Allspice with a Spice Mill. Obvious when you know how, no?";
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
		
		hint = "Pardon my caution sirmadam, but I've made sure you've got your map - do check it, I'd hate for you to get lost. (Click on the name of your current location in the top right to open your map. I've marked shrines and vendors on it for you too.)";
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
		
		hint = "As unlikely as it sounds, I heard that you can make your own cheese from butterfly milk. Not sure how one goes about that. Begin by shaking it, I assume?";
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
	
	if (player_level > 4 && !pc.global_chatter) { 
		hint = "While I never tire of you, I know you require more sophisticated company. Have you tried Global Chat, if I may be so bold? Open it from the list next to your Local Chat window.";
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
	
	
	// Stewart said take this one out!
	// Uncomment once the backfill is done
	/*if (player_level > 6 && !pc.has_facebook) {
		hint = "I hear Ur is more fun the more friends you have to explore it with, Skipper. May I suggest seeing if any of your Facebook friends already play Glitch? You can check "+"<a href=\"event:external|http://www.glitch.com/friends/add/\">here</a>.";
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}*/
	
	// Stewart said take this one out!
	/*if (player_level > 6 && !pc.has_twitter) {
		hint = "Twitter? Do you indulge, boss? I hear a lot about this twitterating business. May I suggest checking if your Twitter friends are playing already, for exploring with? You can check "+"<a href=\"event:external|http://www.glitch.com/friends/add/\">here</a>.";
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}*/
	
	// Stewart said take this one out!
	/*if (player_level > 6 && !pc.has_fb_likes) {
		hint = "Psst. Boss. Boss! You like Glitch, yes? Well apparently if you openly declare that you like it on the Facebook, it magically generates credits. Oh, the mysteries of modern life!";
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}*/
	
	
	if (player_level > 7) {
		// hub hints:
		var count = pc.counters_get_label_count('streets_visited_in_hub', 'number_63') // shimla mirch
			+  		pc.counters_get_label_count('streets_visited_in_hub', 'number_99') // kalavana
			+       pc.counters_get_label_count('streets_visited_in_hub', 'number_72') // chakra phool
			+       pc.counters_get_label_count('streets_visited_in_hub', 'number_71') // jethimadh;
		if (count < 1) {
			hint = "They say that untold numbers of jellisac clumps, free for all, can be found in the "+this.getLocationLink(63)+" region. Alas, I shall never see them. But perhaps you might on my behalf?";
		
			if (!this.hintAlreadyGiven(hint)) {
				possibles.push(hint);
			}
		}
	
		count = pc.counters_get_label_count("streets_visited_in_hub", "number_136"); // jal
		if (count < 1) {
			hint = "Do you enjoy swimming, madamsir? Apparently if you got to "+this.getLocationLink(136)+" you can swim with salmen, and even catch some! I wish I could go, but my stuffing gets terribly waterlogged if I get wet.";
			
			if (!this.hintAlreadyGiven(hint)) {
				possibles.push(hint);
			}
		}
	
		count = pc.counters_get_label_count("streets_visited_in_hub", "number_137"); // nottis
		if (count < 1) {
			hint = "They say that far to the north there is a snowy wonderland called "+this.getLocationLink(137)+" where ice can be harvested. I love the snow on pine trees! It makes me feel like curling up by the fire."
		
			if (!this.hintAlreadyGiven(hint)) {
				possibles.push(hint);
			}
		}
		
		// There are two hubs that have some sloths, and it would be a pain to check the individual streets, so, 
		// leaving this out for now.
		/*var count = pc.counters_get_label_count('streets_visited_in_hub', 'number_119')
			+       pc.counters_get_label_count('streets_visited_in_hub', 'number_113');
		if (count < 1) {
			hint = "Did you know, snails - the building material - comes from Sloths! Yes! Sloths! I scarce believe it myself, but if you go to "+this.getLocationLink(119)+", you can see for yourself. Be sure to pack some metal rods, sloths are mad for them."
		
			if (!this.hintAlreadyGiven(hint)) {
				possibles.push(hint);
			}
		}*/
		
		if (!pc.achievements_has("fox_brushing_license")) {
			// Get a path to a fox brushing preserve
			
			var start = pc.houses_get_previous_location().tsid;
			
			if (start) {
				var dst = config.is_dev ? ["LMF1AVPVIVC2MMA", "LMF1088P4JC2IB8"] : ["LA5G8MQD45T2UMH", "LA5OO9PJC8T26KE", "LA5CUF0978T2L64", "LA5KC1SHA8T2AL7", "LA5U9449F8T2DPR", "LA5VJDNKS5T2EFM", "LA5RV551E8T2K2F", "LA5AS7POI5T24IG", "LA5LBN35B8T288J", "LA5ELMKFP7T2Q4H", "LA556IE55JS245H", "LA5NV05NFJS2NIF", "LA5UDRLCE9S20ER", "LA5QAHLTB9S2C0F", "LA578O7KNJS2BNI", "LA5R11F6C9S2HA9", "LA53N05IG9S2BLR", "LA5VEL0SJJS2KVU", "LA5945LJ7JS2GFK", "LA582EG1QLS20BF", "LA5RJRSOHJS2C95", "LUVPMRNUQQS2GF3", "LUVO1ABIQQS2QIF", "LUVDU3H5COS2S4O", "LUV3HOATQOS2HNO", "LUVHBDR6DOS2UED", "LUVEAT1BCOS25QL", "LUVIP8FLKOS2USV", "LUVPAQS5B9S2E00", "LUVE5KV0TOS2N87", "LUV2SS9BHDT2I85", "LA983PEN5DT21G9", "LA9EAH3R8DT2R18", "LNVVEB4M8DT2JUB", "LNVEC8L1DDT2F20", "LNV4R9D5ADT2NP1", "LDORJMMHCDT2J08", "LDOFQEEIHDT2QNS", "LDOKTFQ22DT2OEL", "LHVC7554ADT2VA1", "LHV73IC58DT2RO7", "LHV21H2S5DT2VF8", "LHVSP6MKGDT2VUK", "LHVCJB2OMDT2VD8", "LHVAP821MDT2L85", "LHVBSCOFMDT2VE0", "LUVV8SDGGDT2QOH"]; 
				
				var path = apiFindShortestGlobalPath(start, dst);
				if (path && num_keys(path) > 0) { 
					var loc = path[num_keys(path)-1].tsid;
				}
				
				if (loc) {
					var loc_text = this.getLocationLink(null, loc);
				}
				else { 
					loc_text = "Placeholder Park";
				}
					
				hint = "You look like a worldly sort, have you ever tried brushing a fox, madamsir? I hear it's ever such fun. Head to "+loc_text+" and speak to the ranger there for a permit."
				
				/*if (this.tsid == "BUV7ORMUEL13UD9") { // butler belonging to Turing Hopper, Liz's test character
					possibles.push(hint);
				}*/
				
				if (!this.hintAlreadyGiven(hint)) {
					possibles.push(hint);
				}
			}
		}
	}
	
	var now = time();
	var long_ago = 60*60*24*3; // 3 days
	if (this.buddy_tower && (now - this.buddy_tower.completion_time) <= long_ago) {
		var buddy = getPlayer(this.buddy_tower.player);
		hint = "I say, captain: Did you see "+this.getPlayerNameText(buddy, true)+" new Tower yet?";
		//this.logDebugInfo("Checking hint "+hint);
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
	
	// Buddies loop - look for towers and birthdays
	hint = "";
	var buddies = pc.buddies_get_tsids();
	var special_tsids = ["P001", "P002", "P003", "P004", "P005", "P006", "P007", "P008", "P009"];
	var buddy_towers = [];
	var timestamps = [];
	for (var b in buddies) {
		var player = getPlayer(buddies[b]);
		
		if (player && !in_array(buddies[b], special_tsids) && this.isPlayerActive(player)) {
		
			if (!hint) {
				//this.logDebugInfo("checking age for "+player);
				//this.logDebugInfo("player.ts is "+player.ts);
				var age = isBirthday(player);
				//this.logDebugInfo("player "+player+" age is "+age);
				if (age != false) { 
					hint = "My buttling diary informs me that "+this.getPlayerNameText(player, false)+" was imagined into Ur "+age+" years ago today. Would madamsir like to visit them and leave something? A gift in the mail is also quite the done thing nowadays.";
				}
			}
			
			if (player_level > 3 && !pc.has_visited_tower) {
				var tower = player.getTower();
				if (tower) {
					buddy_towers.push(player);
				}
			}
			
			if (player.home && this.isPlayerActive(player) && player.has_done_intro && player.getQuestStatus('leave_gentle_island') == 'done') {
				timestamps.push(pc.stats_get_last_street_visit(player.home.exterior));
			}
		}
	}
		
	this.logDebugInfo("Sending substr "+"My buttling diary informs me");
	if (hint && !this.hintAlreadyGiven(hint, "My buttling diary informs me")) {
		this.logDebugInfo("hint is possible");
		possibles.push(hint);
	}
	
	var idx = this.getOldestTimestamp(timestamps);
	if (idx >= 0) {
		this.logDebugInfo("got oldest timestamp at idx "+idx);
		var player = getPlayer(buddies[idx]);	
		
		hint = "Pardon me, your glitchiness. I was going through my appointment book and I noticed that it's been a while since you visited your friend "+this.getPlayerNameText(player, false)+". Why don't you pay a visit to their home street?"
		
		this.logDebugInfo("hinting visit to player "+player);
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
		
	if (player_level > 3 && !pc.has_visited_tower) { 
		
		if (buddy_towers.length > 0) {
			var which = choose_one(buddy_towers);
			
			hint = "A butler's shopping secret for you: often, the best value in Glitch can be found in the towers of other glitches. You should have a look - your friend "+this.getPlayerNameText(which, false)+" has one on their home street.";
			
			if (!this.hintAlreadyGiven(hint, "A butler's shopping secret")) {
				this.logDebugInfo("Giving shopping tip");
				possibles.push(hint);
			}
		}
	}
	
	if (player_level >= 6 && pc.buddies_count() < 10) {
		hint = "I say, sirmadam! Level "+player_level+"! You do seem to be enjoying yourself. You know, Glitch, like buttling, is more fun with friends. Might I be so bold as to suggest you invite some friends to come and play Glitch with you? "+"(<a href=\"event:external|http://www.glitch.com/friends/add/\">Click here.</a>)";
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
	
	// Clothing suggestions
	long_ago = 60*60*24*30; // 30 days
	
	if (pc.clothing) { 
		this.logDebugInfo("Wardrobe data "+pc.clothing.clothing_changes+" "+pc.clothing.face_changes+" and "+pc.clothing.change_time);
	}
	else { 
		this.logDebugInfo("No clothing data");
	}
	
	if (pc.clothing && !pc.clothing.change_time) {
		pc.clothing.change_time = now - (60*60*24*20); // people who have already been playing won't get this hint for at least 10 days
	}
	if (!pc.clothing || (!pc.clothing.clothing_changes && !pc.clothing.face_changes) || ((now - pc.clothing.change_time) >= long_ago)) {
		hint = "*Discreet throat clearance* sirmadam, while I have always admired your dapper appearance, a change of look does one the power of good. Might I recommend a trip to Wardrobe or Vanity? Clicking on the picture of your avatar in the top left corner of your screen will take you there."
		
		if (!this.hintAlreadyGiven(hint)) { 
			possibles.push(hint);
		}
	}

	if (!pc.has_used_house_command) {
		if (pc.counters_get_label_count("butler_hint_counters", "visited_my_house") > 10) { 
			hint = "I note you often merely pass by here before entering your house. If you're in a hurry, do you know you can skip straight to the inside of your house by tapping /house into local chat, wherever you are? Will that be all, madamsir? Very good.";
			
			if (!this.hintAlreadyGiven(hint)) {
				possibles.push(hint);
			}
		}
	}
	
	if (!pc.has_used_tower_command) {
		if (pc.counters_get_label_count("butler_hint_counters", "visited_my_tower") > 10) { 
			hint = "Sirmadam, I've noticed you sometimes pass by here before entering your tower. Did you know you can go straight to the inside of your tower by typing /tower in local chat, wherever you are? Have a nice day, ma'amsir.";
			
			if (!this.hintAlreadyGiven(hint)) {
				possibles.push(hint);
			}
		}
	}
	
	if (!pc.skills_is_learning() && (pc.skills_get_list().length < 50)) {
		hint = "Far be it from me to to judge, madamsir, but you don't appear to be currently learning anything. Perhaps a visit to the <a href=\"event:skill\">Skill Picker</a> is in order? Wouldn't want to waste that marvellous brain of yours...";
		if (!this.hintAlreadyGiven(hint)) {			
			possibles.push(hint);
		}
	}
	
	// Visiting Stones suggestion
	if (pc.visiting_can_opt_in() && !pc.home_allow_visits) {
		hint = "I hope you don't mind me saying so, sirmadam, but I do love meeting new people. If you find a Visiting Stone and request new visitors, I'd meet Glitches from every corner of Ur: and you'd get more iMG from your Magic Rock! You could also use the Visiting Stone to visit random Glitches' butlers... I mean, their home streets."
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
	
	var time_playing_secs = time() - pc.date_last_login;
	if (!pc.reshuffle_time_ms) { 
		pc.reshuffle_time_ms = 1;
	}
	if (!pc.imagination_purchase_time_ms) { 
		pc.imagination_purchase_time_ms = 1;
	}
	var reshuffle_gt = timestamp_to_gametime(pc.reshuffle_time_ms/1000);
	var purchase_gt = timestamp_to_gametime(pc.imagination_purchase_time_ms/1000);
	var now_gt = current_gametime();
	this.logDebugInfo("pc reshuffle time is "+pc.reshuffle_time_ms+" and imagination time is "+pc.imagination_purchase_time_ms);
	this.logDebugInfo("Time playing is "+time_playing_secs+" and reshuffle time is "+reshuffle_gt+" and now is "+now_gt);
	if (time_playing_secs >= 60*10 && !is_same_day(reshuffle_gt, now_gt) && !is_same_day(purchase_gt, now_gt)) {
		hint = "I can't help but notice you haven't purchased any upgrades or shuffled cards today, ma'amsir. Might you check the <a href=\"event:upgrade\">Upgrade Picker</a>? There may be some good stuff in there?"
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
		
	}
	
	// Suggest asking for help on group quests:
	var group_quests = 0;
	if (pc.getQuestStatus("bogspecialization_harvest_full_peat_bog_in_time_period") == "todo") { 
		group_quests ++;
	}
	if (pc.getQuestStatus("soilappreciation_help_digging") == "todo") {
		group_quests ++;
	}
	if (pc.getQuestStatus("help_mine") == "todo") {
		group_quests ++;
	}
	if (pc.getQuestStatus("teleportation_teleport_with_followers") == "todo") {
		group_quests ++;
	}
	if (pc.getQuestStatus("soilappreciation_collect_loam") == "todo") {
		group_quests ++;
	}
	if (pc.getQuestStatus("transcendentalradiation_radiate_to_five_people") == "todo") {
		group_quests ++;
	}
	if (pc.getQuestStatus("tinkering_repair_tinkertool") == "todo") {
		group_quests ++;
	}
	if (group_quests >= 2) {
		var hint1 = "I note from your quest log there are some group participation quests you're still to conquer. Perhaps you'd like to invite some friends to play Glitch and help you out? You can do it "+"<a href=\"event:external|http://www.glitch.com/friends/add/\">here</a>.";
		var hint2 = "Your quest log has a couple of outstanding group quests. Have you considered asking for help in Global Chat? People are lovely. People who play Glitch particularly so.";
		if (!this.hintAlreadyGiven(hint1) && !this.hintAlreadyGiven(hint2)) {
				if (is_chance(.75)) {
					possibles.push(hint2); // higher chance of this once since we have other hints about invites
				}
				else { 
					possibles.push(hint1);
				}
		}
	}
	
	if (player_level >= 12 && pc.getQuestStatus("tower_quest") == "none") {
		// Only give a Jethimadh tower quest hint if the last hint was not a tower quest hint.
		
		var jethimadh = this.getLocationLink(71);
		
		hint1 = "Gwendolyn's story makes me shed salty eye-fluff every time I hear of it. I'd tell you the story myself, but she tells it far better. Oh, how I wish I could go to "+jethimadh+" Tower to hear it with my own clothy ear-holes...";
		hint2 = "Have you heard of the "+jethimadh+" Tower? I hear on the buttlevine that the ghost who haunts it - Gwendolyn, I believe? - has much of interest to show you...";
		if (!this.hintAlreadyGiven(hint1)
		&& !this.hintAlreadyGiven(hint2)) {
			
			possibles.push(hint1);
			
			possibles.push(hint2);
		}
	}
	
	// Suggest glitch mash for higher level players in case they are bored
	if (player_level >= 15 && pc.clothing.clothing_changes >= 1) { 
		hint = "If I may say so, Sirmadam, you look superlatively dashing today. May I interest you in signing up for <a href=\"event:external|http://glitchmash.iamcal.com/\">Glitch Mash</a>? It lets you rank others' outfits, and submit your own for ranking. I dare say such an impressive individual as yourself might reach the top 10!"
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}

	if (pc.imagination_has_upgrade("jump_triple_1")) {
		hint = "If you'll pardon me, you know the thing I envy most about you Glitches? Your ability to jump three times in a row and, if you time it right, jump extra high. I can only dream.";
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
	
	if (pc.imagination_has_upgrade("snapshotting")) {
		hint = "Press 'c' any time to go into Camera Mode. Please do, I do so love looking at snapshots... (And you can also use Camera Mode to look around the level!)"
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
	
	if (!pc.skills_has("fiber_arts_1") && !pc.skills_in_learning_queue("fiber_arts_1")) {
		hint = "String, sirmadam, is not to be sniffed at. Very useful, and you can spin it yourself out of fiber. My left arm is feeling a little loose, perhaps, if you learned Fiber Arts, you might one day fix it for me?";
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
	
	if (!pc.findFirst("high_class_hoe") && pc.findFirst("hoe")) {
		hint = "Have you considered trading that common Hoe for something more refined? Top players prefer employing the services of a <a href=\"event:external|http://www.glitch.com/items/tools/high-class-hoe/\">High-Class Hoe</a>. You can't just pick them up at any old Street Spirit, though, you\'ll need to ask around. Oh DO get a High Class Hoe, I shall be the envy of all the butlers!"
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
	
	var level_up = pc.stats_calc_level_from_xp(pc.stats.xp.value);
	var level_diff = level_up.xp_for_next - level_up.xp_for_this;
	var xp_actual = level_up.xp_for_next - pc.stats.xp.value;
	
	if ((xp_actual / level_diff) <= .1) {
		var next = (pc.stats.level+1);
		if (xp_actual > 1000) {
			xp_actual = Math.round(xp_actual / 1000) * 1000; // Stewart said round to the nearest 1000
		}
		
		hint = "Goodness Gracious, madamsir! Have you noticed that you're only about "+addCommas(xp_actual)+" iMG away from Level "+next+"?!? Oh to be the butler of a Level "+next+" Glitch! I will be the toast of the buttling community! I cannot wait!"
		
	
		if (!this.hintAlreadyGiven(hint)) {
			possibles.push(hint);
		}
	}
	
	var sdb_hint = false;
	// If pc doesn't have any SDBs in their house and tower 
	if (pc.home.tower && !this.hasSDBs(pc.home.tower) && !this.hasSDBs(pc.home.interior)) { 
		sdb_hint = true;
	}
	else if (!pc.home.tower && (player_level > 10) && !this.hasSDBs(pc.home.interior)) {
		sdb_hint = true;
	}
	
	if (sdb_hint) {
		hint = "Speaking as a butler (and qualified neatfreak), I can highly recommend <a href=\"event:item|bag_furniture_sdb\">Storage Display Boxes</a>. They're very handy for storing a lot of the same thing, and you can use them to sell things too. ";
		
		var sdb = pc.furniture_get_bag().findFirst("bag_furniture_sdb");
		if (sdb) {
			hint += "It looks like you have one already. Why don't you give it a try?";
		}
		else {
			hint += "You can make them, or buy one in <a href=\"event:external|http://www.glitch.com/auctions/item-sdb/\">auction</a>.";
		}
		
		if (!this.hintAlreadyGiven(hint, "Speaking as a butler (and qualified neatfreak)")) {
			possibles.push(hint);
		}
	}
	
	
	////////////////////////////////
	// Time sensitive hints:
	
	
	var feat = pc.feats_get_current();
	if (feat) {
	
		this.logDebugInfo("feat is "+feat.title);
	
		var respect_status = pc.getQuestStatus("donate_to_all_shrines");
		var esquibeth_status = pc.getQuestStatus("last_pilgrimage_of_esquibeth");
		
		hint = "";
		
		if ( respect_status == "none" ) {
			var hint = "Oh! Oh, your glitcchiness, have you seen? There's a feat going on. You'll be able to participate once you've gained more knowledge of the Giants. Why don't you start by donating something at a Shrine?"; 
		}
		else if ( respect_status == "todo" ) {
			var hint = "Oh! Oh, your glitchiness, have you seen? There's a feat going on. You can help once you finish the quests "+"<a href=\"event:quest_highlight|donate_to_all_shrines\">Respect for the Beginnings</a> and "+
			"The Last Pilgrimage of Esquibeth!";
		}
		else if ( esquibeth_status == "none" ) {
			var hint = "Oh! Oh, your glitchiness, have you seen? There's a feat going on. You can help once you complete the quest The Last Pilgrimage of Esquibeth! (Visit a Shrine to Grendaline to get started.)";
		}
		else if ( esquibeth_status == "todo" ) {
			var hint = "Oh! Oh, your glitchiness, have you seen? There's a feat going on. You can help once you finish the quest "+
			"<a href=\"event:quest_highlight|last_pilgrimage_of_esquibeth\">The Last Pilgrimage of Esquibeth</a>! (Make sure you blow the conch.)";
		}
		else if ( esquibeth_status == "done" ) {
			var hint = "Oh! Oh, your glitchiness, have you seen? A new feat! I wonder if we can help? ";
			hint +="<a href=\"event:external|http://www.glitch.com/feats/"+feat.url+"/\">"+feat.title+"</a>";
		}
		else { 
			this.logDebugInfo("got status of "+respect_status +" and "+esquibeth_status);
		}
		
		this.logDebugInfo("hint is "+hint);
		
		if (hint && !this.hintAlreadyGiven(hint)) {
			possibles = []; // feats are time sensitive, so override other hints
			possibles.push(hint);
		}
	}
	
	var recent = 60*30; // 30 minutes
	if (pc.level_up_time && (now - pc.level_up_time) <= recent && (pc.stats.level <= 25 || pc.stats.level % 5 == 0)) {
		hint = "Well fluff my stuffing and call me butler! Level "+pc.stats.level+" is a tremendous accomplishment, your glitchiness! You should take those currants to a Toy Vendor and buy yourself something lovely."
		
		if (!this.hintAlreadyGiven(hint)) {
			possibles = [];
			possibles.push(hint);
		}
	}
	
	hint = this.getRookNotification(player_level);
	if (hint) {
		possibles = [];
		possibles.push(hint);
	}
	
	//this.logDebugInfo("Possibles is "+possibles);
	
	var hint = "";
	if (possibles.length > 0) {
		hint = choose_one(possibles);
	}
	
	return hint;
}

function hintAlreadyGiven(hint, substr) {
	this.logDebugInfo("substr is "+substr);
	
	var given_hints = this.given_hints;
	for (var i in given_hints) {
		if (hint == given_hints[i]) {
			return true;
		}
		
		if (substr) {
			this.logDebugInfo("matching substr");
			if (given_hints[i].indexOf(substr) >= 0) {
				return true;
			}
		}
	}
	
	return false;
}

function getRookNotification(player_level) {
	if (player_level > 4 && config.rook_attack_tracker) {
		var attacks = apiFindObject(config.rook_attack_tracker).getCurrentAttacks();
		
		if (attacks && attacks.length > 0) { 
			for (var i in attacks) {
				var attack = apiFindObject(attacks[i]);
				if (attack.running == true) {
					var street = null;
					for (var l in attack.locations.epicentre) { 
						if (attack.locations.epicentre[l].isRooked()) { 
							street = attack.locations.epicentre[l];
							break;
						}
					}
				
					if (street) {
						var loc_text = this.getLocationLink(attack.hubid, street.tsid);
					}
					else { 
						var loc_text = this.getLocationLink(attack.hubid, null);
					}
					
					var hint = "Hurry, boss! I just heard on the butlervine that "+loc_text+" is being attacked by the rook! Ur needs your help!";
					if (!this.hintAlreadyGiven(hint)) {
						return hint;
					}
				}
			}
		}
	}
}

function sayHiHint(pc) {
	
	if ((this.convo_text && this.convo_text.length > 0) || this.getCurrentState() === "interacting") {
		this.apiSetTimer("sayHiHint", 10000, pc);
		this.logDebugInfo("can't say hi - trying again in 10 seconds");
	}
	else { 
		delete this.hi_target;
	
		var hint = "Do you like saying 'Hi'? It's as easy as pressing '5' (when the focus is on the game, not in chat). Every day you get a new sign --- hands, bats, flowers, birds, cubes, etc. --- if you find someone with the same sign, you both get a bonus and you get honest mood out of it, once per day.";

		if (pc.counters_get_label_count("emotes", "hi") <= 0) {
			/*this.given_hints.push(hint);
			this.last_hint_given = hint;*/
			this.last_hi_time = time();
			this.sendBubbleAndChat(pc, hint, true, 5000);
		}
	}
}

function getLocationLink(hubid, tsid) {
	
	if (!tsid) {
		if (!config.data_maps.hubs[hubid]) { return ""+hubid; }
		
		var name = config.data_maps.hubs[hubid].name;
		
		return "<a href=\"event:location|"+hubid+"\">"+name+"</a>";
	}
	else {
		var loc = apiFindObject(tsid);
		var name = loc.label;
		
		if (!hubid) {
			hubid = loc.hubid;
		}
		
		return "<a href=\"event:location|"+hubid+"#"+tsid+"\">"+name+"</a>";
	}
}


function notifyAboutTower(data) {
	if (this.buddy_tower) { delete this.buddy_tower; }
	
	this.buddy_tower = data;
	//this.logDebugInfo("Tower data is "+this.buddy_tower);
}

// For checking whether we should notify about this player's birthday etc.
function isPlayerActive(pc) {
	if (pc.isDeleted()) {
		return false;
	}
	
	// date_last_login is time() which is time in seconds.
	// This function uses getTime() which is time in milliseconds
	var days = game_days_since_ts(pc.date_last_login * 1000);
	
	// One glitch year is 308 game days 
	if (days >= 308) { 
		return false; 
	}
	
	return true;
}

function getOldestTimestamp(timestamps) {
	var now = time();
	var oldest = -1;
	var max = 0;
		
	for (var t in timestamps) {
		if ((now - timestamps[t]) > max) { 
			oldest = t;
			max = now - timestamps[t];
		}
	}
	
	if (max > 60*60*24*7) { // at least a week ago
		return t;
	}
	
	return -1;
}

function hasSDBs(location) {
	var sdb = location.findFirst("bag_furniture_sdb");
	
	if (sdb) { return true; }
	
	return false;
}