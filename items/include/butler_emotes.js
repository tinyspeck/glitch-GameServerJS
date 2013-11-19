// do not call this directly! should be called only from
// setHiEmoteVariantRandomly() or setHiEmoteVariantFromInfector()
function setHiEmoteVariant(variant) {
	// make sure we get a valid variant
	if (config.hi_emote_variants.indexOf(variant) == -1) {
		return;
	}
	
	this.hi_emote_variant = variant;
	
	// make sure we have the daily target dc
	if (!this.hi_emote_daily_targets) {
		this.hi_emote_daily_targets = apiNewOwnedDC(this);
	}
	
	// remember yesterdays
	this.hi_emote_daily_targets.pcs_yesterday = this.hi_emote_daily_targets.pcs || {};
	
	// make it fresh
	this.hi_emote_daily_targets.pcs = {};
	
	// timestamp when the symbol was chosen so the butler won't try to choose it again.
	this.hi_emote_gt = current_gametime();
	
	return variant;
}

function setHiEmoteVariantRandomly() {
	var variant = this.setHiEmoteVariant(choose_one(config.hi_emote_variants));
	return variant;
}

function setHiEmoteVariantFromInfector(infector) {
	if (!infector.hi_emote_variant) return;
	
	var variant = infector.hi_emote_variant;
	
	if (config.feature_hi_viral) {
		apiLogAction('HI_SIGN_INFECTED_BUTLER', 'pc='+infector.tsid,'variant='+variant,'infectee='+this.tsid);
	}
	
	return this.setHiEmoteVariant(variant);
}

function doSayHi(pc){
	
	if (!this.hi_emote_daily_targets || !this.hi_emote_variant) {
		this.setHiEmoteVariantRandomly();
	}

	if (this.hi_target) { return; }
	
	var now = current_gametime();
	var last_hi = this.hi_emote_daily_targets.pcs[pc.tsid];
	var last_gt = last_hi ? timestamp_to_gametime(last_hi) : timestamp_to_gametime(0);

	this.logDebugInfo("last hi is "+last_hi+" and last gt is "+last_gt+" and today is "+now);

	if (!is_same_day(last_gt, now)) { 

		if (!this.hi_emote_gt || !is_same_day(this.hi_emote_gt, now)) {
			this.setHiEmoteVariantRandomly();
		}
		
		var base_mood = config.hi_emote_base_mood;
		var bonus_mood = config.hi_emote_bonus_mood;
		var shard = {mood_granted: 0, pc_tsid: pc.tsid};
		var variant_name = config.hi_emote_variants_name_map[this.hi_emote_variant];
		
		var do_bonus = false;
		var did_infect_target_pc = false;
		var target_variant = pc.hi_emote_variant;
		if (!target_variant) {
			did_infect_target_pc = true;
			target_variant = pc.setHiEmoteVariantFromInfector(this);
		}
		
		// if the target of the hi emote recently targeted this player with an emote of the same variant, bonus!
		if (target_variant == this.hi_emote_variant) {
			if (this.tsid in pc.hi_emote_daily_targets.butlers) {
				do_bonus = true;
			}
		}
		
		if (do_bonus) {
			// we'll add the mood in doHiEmoteBonusWithOtherPlayer
			this.apiSetTimer('doHiEmoteBonusWithOtherPlayer', 2000, pc, "hi", this.hi_emote_variant, base_mood+bonus_mood);
		} else {
			// add the mood here
			shard.mood_granted = pc.metabolics_add_mood(5);
		}
		
		pc.location.apiSendAnnouncement({
			emote: "hi",
			accelerate: true,
			emote_shards: [shard],
			itemstack_tsid: this.tsid,
			type: "emote",
			variant: this.hi_emote_variant, 
		});

		this.hi_emote_daily_targets.pcs[pc.tsid] = time();
		apiLogAction("BUTLER_HI", 'pc='+pc.tsid, 'butler='+this.tsid, 'sign='+this.hi_emote_variant, 'bonus='+do_bonus);		

		// send notifications to clients about what happened
		if (config.is_dev) {
			var target_activity_str;
			
			// for the target
			if (pc) {
				if (did_infect_target_pc) {
					target_activity_str = this.getLabel(pc)+' just passed their daily hi sign to you — you\'ve got "'+variant_name+'"!'+
											  ' Say "hi" back with the "H" or "5" key and get a bonus!';
				} else if (do_bonus) {
					target_activity_str = 'You and '+this.getLabel(pc)+' have the hi sign "'+variant_name+'". Bonus time!'
				}
				
				if (target_activity_str) {
					pc.sendActivity(target_activity_str);
				}
			}		
		}

		this.hi_target = pc;
		this.apiSetTimer("sayHiHint", 5000, pc);
	}
}


function doHiEmoteBonusWithOtherPlayer(target_pc, emote, variant, target_mood) {
	var emote_bonus_mood_granted = {};
	emote_bonus_mood_granted[target_pc.tsid] = target_pc.metabolics_add_mood(target_mood);

	var bonus_annc = {
		type: 'emote_bonus',
		emote: emote,
		variant: variant,
		variant_color: config.hi_emote_variants_color_map[variant],
		itemstack_tsid: this.tsid,
		pc_tsid: target_pc.tsid,
		emote_bonus_mood_granted: emote_bonus_mood_granted
	};

	target_pc.apiSendAnnouncement(bonus_annc);
}


// Respond to a hi from a player, but only once per day
function doHiResponse(pc) {

	this.logDebugInfo("doing hi response");

	this.apiCancelTimer("sayHiHint");
	
	
	if (!this.hi_response_time) { 
		this.hi_response_time = apiNewOwnedDC(this);
	}

	if (!this.hi_response_time.list) {
		this.hi_response_time.list = {};
	}

	var now = current_gametime();
	var last_hi = this.hi_response_time.list[pc.tsid];
	
	this.logDebugInfo("last hi is "+last_hi);
	
	if (!last_hi || !is_same_day(now, last_hi)) {
	
		this.hi_response_time.list[pc.tsid] = current_gametime();
		
		this.apiSetTimer("doSayHi", 750, pc);  // Let's just hi back right away if we can
		this.apiSetTimer("respondToHi", 1000, pc); // say the response - must do it after doSayHi so our hi variant is set
	}
}

// This does the speech bubble in response to a hi
function respondToHi(pc) {
	var variant = pc.hi_emote_variant;
	
	if (variant == this.hi_emote_variant) {
		var response = "Neato, we match today!";
		log.info("Butler emote is "+this.hi_emote_variant+" and pc emote is "+variant);
	}
	else { 
		var possibles = [ "Oh, thank you "+pc.getLabel()+".", "Ah, you have "+variant+" today. That's auspicious!", 
						"I always like getting a hi from you.", "Challenge: say hi 5 times fast! Oh, wait... that's not a challenge at all.", "You're so friendly.", "Hello, Hi-master."];
					
		var response = choose_one(possibles);
	}
	
	this.sendBubbleAndChat(pc, response, true, 5000);
}

function sayHiToButler(pc) {
	
	this.last_hi_time = time();  // suppress hints
	this.apiSetTimer("doHiResponse", 1500, pc);
}

function notifyButlerHi(){
	this.owner_knows_hi = true;
}

function clearButlerHi() {
	delete this.owner_knows_hi;
}

