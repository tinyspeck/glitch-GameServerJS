// Loneliness functionality for items. Street spirits for now, but eventually perhaps everything can be lonely!

function initLoneliness() {
	this.loneliness = {
		is_running: false,
		recent_visits: 0
	};
}

function lonelinessResetRecentVisits() {
	if (this.loneliness) {
		this.loneliness.recent_visits = 0;
	} else {
		this.initLoneliness();
	}
}

function lonelinessAdminGetData() {
	var is_alone = num_keys(this.container.getActivePlayers()) == 0;
	
	if (this.loneliness) {
		return {recent_visits: this.loneliness.recent_visits, is_alone: is_alone};
	} else {
		return {recent_visits: 0, is_alone: is_alone};
	}
}

function lonelinessGetText(pc, type, option, location_name, stage, args) {
	var text = "";
	var choices = {};
	var rewards = null;
	
	if (stage == 0) {
		switch(option) {
			case 0:
				text = "Hi $PLAYERNAME, could you come to here? and then please chat to me? I can't bear this loneliness any longer. I am at $LOCATION. Please...";
				break;
			case 1:
				text = "Hey $PLAYERNAME. I am so lonely.... Because I haven’t met anybody recently. I want to talk to anyone. I am at $LOCATION.";
				break;
			case 2:
				text = "How do you do, sir? And good bye, sir. I will die soon because too lonely. I am at $LOCATION. I want to talk with someone before pass away....";
				break;
			case 3:
				text = "Hey $PLAYERNAME, what was a \"Friend\"? Can I buy it? Please let me know about \"Friend\" to come here. I am at $LOCATION.";
				break;
			case 4:
				text = ".... Please ...... $PLAYERNAME ......... Please ..... Come ... to .... $LOCATION .......";
				break;
			case 5:
				text = "Hi $PLAYERNAME. Here is a quiet place. Because there is nobody else. It's like a empty. Sigh, could you come to $LOCATION?";
				break;
			case 6:
				text = "Everything is blurred these days. Also something like a water is dripping down from my eyes always. What is this? I'm at $LOCATION. Visit me.";
				break;
			case 7:
				text = "H Hi $PLAYERNAME,, oh sor-ry I ca-n't ta-lk well. bec-ause I ha-ve not talked wit-h any-one recently. Vis-it m-e at $LOCATION.";
				break;
			case 8:
				text = "My role is only to sell stuff from morning till night. Because of this, I am loneliness! Therefore, could you come to $LOCATION?";
				break;
		}		
	} else if (stage == 1) {
		switch (option) {
			case 0:
				text = "Wow unbelievable! $PLAYERNAME is here! Thank you for coming!";
				choices = [{txt: "You're welcome!", value: 'loneliness-2'}];
				break;
			case 1:
				text = "Wow amazing!! $PLAYERNAME is here! Thank you for coming!";
				choices = [{txt: "You're welcome!", value: 'loneliness-2'}];
				break;
			case 2:
				text = "Sir $PLAYERNAME!! Wooooooow!! What a wonderful day! I'm no longer loneliness! Yeah!";
				choices = [{txt: "Um… sure!", value: 'loneliness-2'}];
				break;
			case 3:
				text = "$PLAYERNAME!! Finally I remembered about \"Friend\"! You are my true friend, right?";
				choices = [{txt: "Of course!", value: 'loneliness-2'}];
				break;
			case 4:
				text = "......Really? ... Are you $PLAYERNAME? ......Whoop! Whooop! Whooooooop!";
				choices = [{txt: "Whoooop!", value: 'loneliness-2'}];
				break;
			case 5:
				text = "$PLAYERNAME!!!! Wow!!! Here is not quiet place already!!! Here is not empty!!! It's lively like a festival!!!";
				choices = [{txt: "Yeah!", value: 'loneliness-2'}];
				break;
			case 6:
				text = "Wow! $PLAYERNAME! Wow it's double surprised!!! Because I can see clearly. It's not blurred and not wet yet!! Wow!!!";
				choices = [{txt: "I'm not sure what that means.", value: 'loneliness-2'}];
				break;
			case 7:
				text = "$PLAYERNAME!! Wow, it's a great! Wow!!! I could speak very smoothly! Unbelievable!!!";
				choices = [{txt: "You're welcome!", value: 'loneliness-2'}];
				break;
			case 8:
				text = "Thank you $PLAYERNAME!! I'm so glad to see you. We are friends from today, right? Of course you are also customer at same time.";
				choices = [{txt: "Right on.", value: 'loneliness-2'}];
				break;
			case 9: 
				text = "$PLAYERNAME!! I was crying because I was loneliness, but seeing you as a friend made me happy again."
				choices = [{txt: "Glad to help, I think…", value: 'loneliness-2'}];
				break;
		}
	} else if (stage == 2) {
		if (type == 'A') {
			text = "BTW, you are kind people who came to here in the <b>$RANKING place</b> today.";
			// Add other player names.
			var others = [];
			for (var i in this.loneliness.visitors) {
				if (this.loneliness.visitors[i] != pc) {
					others.push(this.loneliness.visitors[i].label);
				}
			}
			if (others.length) {
				var pos = Math.max(others.length - 3, 0);
				log.info(this+"others position: "+pos)
				if (pos > 0) {
					array_remove(others, 0, pos - 1);
				}
				log.info(this+"others after splicing: "+others);

				text += " I was also visited today by "+pretty_list(others, ' and ')+"!<split butt_txt=\"Delightful.\" />";
				choices = [{txt: "Delightful.", value: 'loneliness-3'}];
			} else {
				text += "This is in return for your kindness. Thank you!";
				choices = [{txt: "OK", value: 'loneliness-ok'}];
				rewards = {xp: this.lonelinessComputeRaceXP(pc)};
			}
		} else if (type == 'B') {
			text = "BTW, I am going to have a party because I think this is a rare opportunity!! Could you wait here until after <b>$NUMBEROFPLAYERS players</b>? Thank you!";
			choices = [{txt: "OK", value: "loneliness-ok"}];
		}
	} else if (stage == 3) {
		if (type == 'A') {
			text = "This is in return for your kindness. Thank you!";
			choices = [{txt: "OK", value: 'loneliness-ok'}];
			rewards = {xp: this.lonelinessComputeRaceXP(pc)};
		}
	} else {
		text = "Hi I thought I had a thing to tell to you. I forgot it....";
		choices = [{txt: "OK", value: 'none'}];
	}
	
	text = text.replace("$PLAYERNAME", pc.label);
	text = text.replace("$LOCATION", location_name);
	if (args && args.number_of_players) {
		text = text.replace("$NUMBEROFPLAYERS", args.number_of_players);
	}
	if (args && args.ranking) {
		text = text.replace("$RANKING", args.ranking);
	}
	
	return {text: text, choices: choices, rewards: rewards};
}

function lonelinessGetChatter() {
	return choose_one([
		"Oh, but I am still loneliness.",
		"I wish more people would come to visit to me.",
		"It is still like a empty here. Sigh…",
		"There is water coming down from my eyes always.",
		"What is a feeling? It is the loneliness."
	]);
}

function startLoneliness(args) {
	if (!this.loneliness) {
		this.initLoneliness();
	}
	if (this.isLonely()) {
		this.clearLoneliness();
	}
	
	var container = this.container;
	
	this.loneliness.players = apiGetNLocalOnlinePlayers(args.num_players, function(pc) {return pc.canDoLoneliness(container);});
	this.loneliness.total_players = this.loneliness.players.length;
	if (!this.loneliness.total_players) {
		delete this.loneliness.players;
		delete this.loneliness.total_players;
		
		log.error(this+" attempted to start Loneliness, but could not find any players.");
		return;
	}

	if (args.type) {
		this.loneliness.type = args.type;
	} else {
		this.loneliness.type = is_chance(0.7) ? 'A' : 'B';
	}
	this.loneliness.start_time = time();
	this.loneliness.visitors = {};
	this.loneliness.is_running = true;
	this.loneliness.num_visitors = 0;
	this.loneliness.uid = this.tsid+'_'+time();

	for (var i in this.loneliness.players) {
		this.loneliness.players[i].startLoneliness(this, this.loneliness.type, false, this.loneliness.uid);
		log.info("Testing loneliness. "+this+" found player "+this.loneliness.players[i]);
	}	

	// Eventually these will be different.
	switch (this.loneliness.type) {
		case 'A':
			this.loneliness.duration = 60 * 15;
			this.apiSetTimer('clearLoneliness', this.loneliness.duration * 1000);
			
			break;
		case 'B':
			this.loneliness.duration = 60 * 5;
			this.lonelinessShowPartyOverlay(this.container);
			break;
	} 
	
	if (this.onLonelinessStart) {
		this.onLonelinessStart();
	}
}

function clearLoneliness() {
	for (var i in this.loneliness.players) {
		this.loneliness.players[i].cancelLoneliness();
	}
	this.onLonelinessEnd();
	
	if (this.loneliness.player_xp) {
		delete this.loneliness.player_xp;
	}

	this.loneliness.is_running = false,
	this.loneliness.recent_visits = this.loneliness.num_visitors;
}

function lonelinessFinishParty() {
	var speech = "Wow! It is so lively now. It is a real party! Yes!! Please take these. Thank you very much for being good friends!";
	
	this.sendBubble(speech);
	this.container.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: speech});	
	
	for (var i in this.loneliness.visitors) {
		if (this.loneliness.visitors[i].location == this.container && this.loneliness.visitors[i].isOnline()) {
			var xp = this.loneliness.visitors[i].stats_add_xp(200);
			this.loneliness.visitors[i].sendActivity("You brightened a street spirit's day! You received "+xp+" xp.");
			this.loneliness.visitors[i].buffs_apply('party_time');
		}
	}
	
	this.lonelinessEndPartyOverlay(0);
	
	this.clearLoneliness();
	
	this.apiSetTimer('lonelinessPartyJabber', 55000);
}

function lonelinessPartyJabber(type) {
	var speech = "It was the best party. Therefore, I am not loneliness anymore. Thank you everybody!!";
	this.sendBubble("It was the best party. Therefore, I am not loneliness anymore. Thank you everybody!!");
	this.container.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: speech});	
}

function lonelinessVisit(pc) {
	if (!this.isLonely()) {
		return false;
	} else if (this.loneliness.visitors[pc.tsid]) {
		if (this.loneliness.type == 'B' && !this.loneliness.is_crying) {
			var speech = choose_one([
				pc.label+"! It will be time for the party soon so please wait for a little bit longer.",
				"I hope the party is good!! Please invite your friends!",
				pc.label+"! Tell your friends and this will be the best party."
			]);

			this.sendBubble(speech, 5000, pc);
			pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: speech});
		}
		
		return true;
	}

	apiLogAction('LONELINESS_ARRIVE', 'pc='+pc.tsid, 'target='+this.tsid, 'type='+this.loneliness.type, 'uid='+this.loneliness.uid);

	this.loneliness.visitors[pc.tsid] = pc;
	this.loneliness.num_visitors++;

	var playerLoneliness = pc.getLoneliness();
	var option = (playerLoneliness && (playerLoneliness.option != undefined)) ? playerLoneliness.option : 9;
	var text = "";
	var rewards = null;
	switch (this.loneliness.type) {
		case 'A':
			if (this.loneliness.num_visitors >= this.loneliness.total_players) {
				this.loneliness.is_running = false;		
			}

			var response = this.lonelinessGetText(pc, this.loneliness.type, option, this.container.label, 1, {});
			text = response.text;
			var choices = response.choices;
			rewards = response.rewards;
			
			pc.endLoneliness();
			this.lonelinessHideOverlay(pc);
			if (!this.isLonely()) {
				this.lonelinessHideOverlay(this.container);
				this.clearLoneliness();
			} 
			break;
		case 'B':			
			var players = this.container.getActivePlayers();
			for (var i in players) {
				if (players[i] != pc && this.isLonely()) {				
					this.lonelinessUpdatePartyOverlay(players[i]);
				} else {
					this.lonelinessHideOverlay(players[i]);					
				}
			}
			
			if (this.loneliness.num_visitors < this.loneliness.total_players) {
				var response = this.lonelinessGetText(pc, this.loneliness.type, option, this.container.label, 1, {});
				text = response.text;
				var choices = response.choices;
			} else {
				this.lonelinessHideOverlay(this.container);
				this.loneliness.is_running = false;
				text = pc.label+"!! Finally you are here at last and now we can start a party! Please everyone be friends and enjoy a party together.";
				this.sendBubble(text, 5000, pc);
				pc.endLoneliness();
				
				this.apiSetTimer('lonelinessFinishParty', 5000)
				if (this.onLonelinessVisit) {
					this.onLonelinessVisit();
				}
				
				return;
			}
			break;
	}

	if (this.onLonelinessVisit) {
		this.onLonelinessVisit();
	}

	this.conversation_start(
		pc, 
		text,
		choices,
		null,
		rewards,
		choices[0].value
	);		
	
	return true;
}

function lonelinessEndPartyOverlay(stage) {
	switch(stage) {
		case 0:
			this.container.apiSendAnnouncement({
				type: 'vp_overlay',
				swf_url: overlay_key_to_url('fireworks_1'),
				uid: 'loneliness_fireworks_1_'+this.tsid,
				duration: 2000,
				y: '75%'
			});
			
			this.container.announce_sound_to_all('LONELINESS_FIREWORKS', 0);
			
			this.apiSetTimerX('lonelinessEndPartyOverlay', 4000, 1);
			break;
		case 1:			
			this.container.apiSendAnnouncement({
				type: 'vp_overlay',
				swf_url: overlay_key_to_url('fireworks_2'),
				uid: 'loneliness_fireworks_2_'+this.tsid,
				duration: 2000,
				x: '30%',
				y: '30%'
			});

			this.container.announce_sound_to_all('LONELINESS_FIREWORKS', 0);

			this.apiSetTimerX('lonelinessEndPartyOverlay', 4000, 2);
			break;
		case 2:			
			this.container.apiSendAnnouncement({
				type: 'vp_overlay',
				swf_url: overlay_key_to_url('fireworks_3'),
				uid: 'loneliness_fireworks_3_'+this.tsid,
				duration: 2000,
				x: '70%',
				y: '30%'
			});

			this.container.announce_sound_to_all('LONELINESS_FIREWORKS', 0);

			this.apiSetTimerX('lonelinessEndPartyOverlay', 27000, 3);
			break;
		case 3:			
			this.container.apiSendAnnouncement({
				type: 'vp_overlay',
				swf_url: overlay_key_to_url('fireworks_1'),
				uid: 'loneliness_fireworks_2_1_'+this.tsid,
				duration: 2000,
				y: '75%'
			});

			this.container.announce_sound_to_all('LONELINESS_FIREWORKS', 0);

			this.apiSetTimerX('lonelinessEndPartyOverlay', 4000, 4);
			break;
		case 4:			
			this.container.apiSendAnnouncement({
				type: 'vp_overlay',
				swf_url: overlay_key_to_url('fireworks_2'),
				uid: 'loneliness_fireworks_2_2_'+this.tsid,
				duration: 2000,
				x: '30%',
				y: '30%'
			});

			this.container.announce_sound_to_all('LONELINESS_FIREWORKS', 0);

			this.apiSetTimerX('lonelinessEndPartyOverlay', 4000, 5);
			break;
		case 5:			
			this.container.apiSendAnnouncement({
				type: 'vp_overlay',
				swf_url: overlay_key_to_url('fireworks_3'),
				uid: 'loneliness_fireworks_2_3_'+this.tsid,
				duration: 2000,
				x: '70%',
				y: '30%'
			});

			this.container.announce_sound_to_all('LONELINESS_FIREWORKS', 0);
			break;
	}
}

function lonelinessUpdatePartyOverlay(target) {
	if (!this.loneliness) {
		this.initLoneliness();
	}

	target.apiSendMsg({
		type: 'overlay_text',
		uid: 'loneliness_players_'+this.tsid,
		text: [
			'<p align="center"><span class="nuxp_vog_smallest">End the loneliness with a party!</span><br /><span class="nuxp_vog_smaller">'+this.loneliness.num_visitors+'/'+
				this.loneliness.total_players+'</span><br /><span class="nuxp_vog_smallest">players here now</span</p>'
		]
	});			

	target.apiSendMsg({
	  type:'overlay_opacity',
	  opacity: 1,
	  opacity_ms: 300, //how many ms it takes to fade to the desired opacity
	  opacity_end: .5,  //OPTIONAL: after the opacity changes, should it go to another opacity? (defaults to "opacity" if not set)
	  opacity_end_delay_ms: 3000, //OPTIONAL: how long after it gets to the "opacity" before it changes to "opacity_end" (defaults to 0 if not set)
	  opacity_end_ms: 300, //OPTIONAL: how many ms it takes to fade to the desired opacity_end (defaults to "opacity_ms" if not set)
	  uid: 'loneliness_players_'+this.tsid
	});
}

function lonelinessShowPartyOverlay(target) {
	if (!this.loneliness) {
		this.initLoneliness();
	}
	
	target.apiSendAnnouncement({
		type: "vp_overlay",
		uid: 'loneliness_players_'+this.tsid,
		width: 300,
		x: '50%',
		top_y: '25',
		delay_ms: 0,
		opacity: 1.0,
		use_drop_shadow: true,
		show_text_shadow: false,
		text: [
			'<p align="center"><span class="nuxp_vog_smallest">End the loneliness with a party!</span><br /><span class="nuxp_vog_smaller">'+this.loneliness.num_visitors+
				'/'+this.loneliness.total_players+'</span><br /><span class="nuxp_vog_smallest">players here now</span</p>'
		]
	});		
	target.apiSendMsg({type: 'flush_anncs'});

	target.apiSendMsg({
	  type:'overlay_opacity',
	  opacity: 1,
	  opacity_ms: 0, //how many ms it takes to fade to the desired opacity
	  opacity_end: .5,  //OPTIONAL: after the opacity changes, should it go to another opacity? (defaults to "opacity" if not set)
	  opacity_end_delay_ms: 3000, //OPTIONAL: how long after it gets to the "opacity" before it changes to "opacity_end" (defaults to 0 if not set)
	  opacity_end_ms: 300, //OPTIONAL: how many ms it takes to fade to the desired opacity_end (defaults to "opacity_ms" if not set)
	  uid: 'loneliness_players_'+this.tsid
	});
}

function lonelinessShowRaceOverlay(target) {
	if (!this.loneliness) {
		this.initLoneliness();
	}
	
	target.apiSendAnnouncement({
		type: "vp_overlay",
		uid: 'loneliness_players_'+this.tsid,
		width: 200,
		x: '50%',
		top_y: '25',
		delay_ms: 0,
		use_drop_shadow: true,
		text: [
			'<p align="center"><span class="nuxp_vog_smallest">There is a lonely street spirit here.<br />Hurry! Hurry!</span</p>'
		]
	});		
	target.apiSendMsg({type: 'flush_anncs'});
		
	target.apiSendMsg({
	  type:'overlay_opacity',
	  opacity: 1,
	  opacity_ms: 0, //how many ms it takes to fade to the desired opacity
	  opacity_end: .5,  //OPTIONAL: after the opacity changes, should it go to another opacity? (defaults to "opacity" if not set)
	  opacity_end_delay_ms: 3000, //OPTIONAL: how long after it gets to the "opacity" before it changes to "opacity_end" (defaults to 0 if not set)
	  opacity_end_ms: 300, //OPTIONAL: how many ms it takes to fade to the desired opacity_end (defaults to "opacity_ms" if not set)
	  uid: 'loneliness_players_'+this.tsid
	});
}

function lonelinessHideOverlay(target) {
	target.apiSendMsg({type: 'overlay_cancel', uid: 'loneliness_players_'+this.tsid});	
}

function lonelinessOnConversation(pc, msg) {
	if (msg.choice == 'loneliness-2') {
		var playerLoneliness = pc.getLoneliness();
		var option = (playerLoneliness && (playerLoneliness.option != undefined)) ? playerLoneliness.option : 9;

		var args = {};
		if (this.loneliness.type == 'A') {
			args.ranking = numberth(this.loneliness.num_visitors);			
		} else if (this.loneliness.type == 'B') {
			args.number_of_players = this.loneliness.total_players;			
		}

		var response = this.lonelinessGetText(pc, this.loneliness.type, option, this.container.label, 2, args);

		this.conversation_reply(
			pc, 
			msg,
			response.text,
			response.choices,
			null,
			response.rewards,
			response.choices[0].value
		);		
	} else if (msg.choice == 'loneliness-3') {
		var playerLoneliness = pc.getLoneliness();
		var option = (playerLoneliness && (playerLoneliness.option != undefined)) ? playerLoneliness.option : 9;
		var response = this.lonelinessGetText(pc, this.loneliness.type, option, this.container.label, 3, {});

		this.conversation_reply(
			pc, 
			msg, 
			response.text,
			response.choices,
			null,
			response.rewards,
			response.choices[0].value
		);		
	} else if (msg.choice == 'loneliness-ok') {
		switch (this.loneliness.type) {
			case 'A':
				// Give player xp
				this.lonelinessGiveRaceXP(pc);
			
				this.conversation_end(pc, msg);
			
				if (this.isLonely()) {
					var speech = "But I am still loneliness. So I hope that the others will come and visit me soon......";
					this.sendBubble(speech, 4000, pc);
					pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: speech});
				}
				break;
			case 'B':
				pc.endLoneliness();
				if (this.isLonely()) {
					this.lonelinessShowPartyOverlay(pc);
				}
				this.conversation_end(pc, msg);
				break;
		}
	}
	
	return true;
}

function lonelinessComputeRaceXP(pc) {
	if (!this.loneliness.player_xp) {
		this.loneliness.player_xp = {};
	}

	var give_xp = 0;
	if (this.loneliness.num_visitors == 1) {
		give_xp = 1000;
	} else if (this.loneliness_num_visitors <= 5) {
		give_xp = 500;
	} else if (this.loneliness_num_visitors <= 10) {
		give_xp = 200;
	} else {
		give_xp = 100;
	}
	
	this.loneliness.player_xp[pc.tsid] = give_xp;
	
	return give_xp;
}

function lonelinessGiveRaceXP(pc) {
	if (!this.loneliness.player_xp || !this.loneliness.player_xp[pc.tsid]) {
		this.lonelinessComputeRaceXP(pc);
	}
	var xp = pc.stats_add_xp(this.loneliness.player_xp[pc.tsid]);
	pc.sendActivity("You brightened a street spirit's day. You received "+xp+" xp.");
}

function onLonelinessPlayerEnter(pc) {
	if (!this.loneliness) {
		this.initLoneliness();
	}
	
	this.loneliness.recent_visits++;

	if (!this.isLonely()) {
		return;
	}
	
	if (this.loneliness.type == "A") {
		if (!this.loneliness.visitors[pc.tsid]) {
			this.lonelinessShowRaceOverlay(pc);
		}
	} else if (this.loneliness.type == "B") {
		
		pc.sendActivity("The street spirit here is having a party! Invite all your friends.");

		if (this.loneliness.visitors[pc.tsid]) {
			this.loneliness.num_visitors++;
			if (this.loneliness.num_visitors >= this.loneliness.total_players) {
				this.loneliness.is_running = false;		
				this.lonelinessHideOverlay(this.container);
				this.lonelinessFinishParty();
			} else {
				var players = this.container.getActivePlayers();
				for (var i in players) {
					if (players[i] == pc) {				
						this.lonelinessShowPartyOverlay(players[i]);					
					} else {
						this.lonelinessUpdatePartyOverlay(players[i]);
					}					
				}
			}
		} else {
			this.lonelinessShowPartyOverlay(pc);
		}
	}	
}

function onLonelinessPlayerExit(pc) {
	if (!this.loneliness) {
		this.initLoneliness();
	}
	
	if (this.loneliness.type != 'B' || !this.isLonely()) {
		return;
	}	
	
	if (this.loneliness.visitors[pc.tsid]) {
		this.loneliness.num_visitors--;
		this.lonelinessUpdatePartyOverlay(this.container);
	}
	
	this.lonelinessHideOverlay(pc);
}

function isLonely() {
	return this.loneliness && this.loneliness.is_running;
}