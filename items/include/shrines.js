//#include events.js

var is_shrine = true;
var no_auto_flip = true;

var giant_tips = [
	'Donating to a shrine earns favor with that Giant.',
	'The more valuable your donation, the more favor you earn.',
	'You can spend favor to speed up the learning of <a href="event:external|http://www.glitch.com/profiles/me/skills/">Skills</a>.',
	'Spending favor with any Giant speeds up skill learning — but spending favor with the Primary Giant of a given skill will speed it up the most.',
	'Earn enough favor with any giant, and you\'ll get an <a href="event:external|http://www.glitch.com/items/emblems-icons/">Emblem</a>.',
	'Hallowed Shrine Powders can double or triple the rewards you get for the next donation you make after using \'em',
	'Don\'t forget to Caress, Consider and Contemplate each Emblem every day for bonus Mood, Energy and iMG.',
	'You can see your favor with all the Giants on the <a href="event:external|http://www.glitch.com/giants/favor/">website</a> or any time you \'Check Favor\' with any one giant.',
	'Some skills require you to spend an Emblem to unlock them.',
	'Earn 11 Emblems of any one giant and you can make an <a href="event:external|http://www.glitch.com/items/emblems-icons/">Icon</a>.',
	'You can only earn so much favor with each Giant in a single game day — in fact, about one emblem\'s worth!'
];

function check_favor(pc){

	var giant = this.get_giant();
	var points = pc.stats_get_favor_points(giant);
	var skill = pc.skills_get_learning();

	var info = pc.get_skill_info(skill, giant, points);
	
	// If we have the yellow crumb flower buff, learning acceleration durations are increased
	var multiplier = pc.buffs_has('yellow_crumb_flower') ? 1.05 : 1.0;

	pc.apiSendMsg({
		'type'			: 'shrine_start',
		'itemstack_tsid'	: this.tsid,
		'favor_points'		: points,
		'emblem_cost'		: pc.stats_get_max_favor(giant),
		'is_learning'		: skill ? true : false,
		'spend_points'		: info.spend_points,
		'speed_up'		: info.speed_up * multiplier,
		'giant_name'		: giant,
		'giant_rel'		: info.giant_rel,
		'favor'			: pc.stats_get_all_favor()
	});

}

function spend_points(pc, msg){

	var giant = this.get_giant();
	var points = pc.stats_get_favor_points(giant);
	var skill = pc.skills_get_learning();

	var info = pc.get_skill_info(skill, giant, points);

	if(points >= 997 && skill.data.giants[giant] && intval(skill.data.giants[giant].primary)) {
		// If we're spending more than 997 favor in one go, update the associated Better Learning skill.
		pc.quests_set_flag('primary_giant_spend_mad_favor');
	}
	if(points >= 1511) {
		pc.quests_set_flag('spend_enormous_favor');
	}
	
	apiLogAction('SPEND_FAVOR', 'pc='+pc.tsid, 'giant='+giant, 'favor='+points);

	// If we have the yellow crumb flower buff, learning acceleration durations are increased
	var multiplier = pc.buffs_has('yellow_crumb_flower') ? 1.05 : 1.0;
	
	// accelerate
	pc.skills_start_acceleration(info.speed_up * multiplier);

	// remove points
	pc.stats_remove_favor_points(giant, info.spend_points);
	
	// Update client
	var msg = this.favorUpdate(pc, giant);
	pc.apiSendMsg(msg);
}

function give_emblem(pc, slugs){
	var giant = this.get_giant();
	var emblem = 'emblem_'+giant;
	if (!slugs) slugs = {};
	
	if (!pc.stats_has_favor_points(giant, pc.stats_get_max_favor(giant))) {
		// update client values after donation even though we didn't give an emblem
		var msg = this.favorUpdate(pc, giant);
		pc.apiSendMsg(msg);
		return false;
	}
	
	var num_emblems = pc.countItemClass(emblem);
	
	if (pc.achievements_has('first_'+giant+'_emblem')){
		var remainder = pc.createItemFromOffset(emblem, 1, {x:0, y:-75}, true, this);
		if (remainder){
			// update client values anyway
			var msg = this.favorUpdate(pc, giant);
			pc.apiSendMsg(msg);
			return false;
		}
		else{
			var favor = pc.stats_remove_favor_points(giant, pc.stats_get_max_favor(giant));
			//if (!slugs.favor) slugs.favor = [];
			/*slugs.favor.push({
				giant: giant,
				points: favor
			}); */
		
			// Add to the pc's emblem counter
			pc.stats_add_emblem(giant);
			
			var xp = pc.stats_add_xp(50, false, {'verb':'give_emblem','class_id':this.class_tsid});
			if (!slugs.xp) slugs.xp = 0;
			slugs.xp += xp;

			var giant_text = capitalize(giant);
			if (giant_text == "Ti") { giant_text = "Tii"; }
			
			if (!slugs.items) slugs.items = [];
			slugs.items.push({
                "class_tsid"    : "emblem_"+giant,
                "label"         : "Emblem of "+giant_text,
                "count"         : 1
            });
			
			var txt = "Congratulations! Your devotion has earned you an emblem of "+giant_text+"!";
			this.sendBubble(txt, 5000, pc, slugs);

			if (xp) txt = txt + " +"+xp+" iMG";
			if (favor > 0) txt = txt + (xp ? ',' : '') + " "+favor+" favor";
			pc.sendActivity(txt);
			pc.announce_sound('DONATION_RECIEVE_EMBLEM');
		}
	}
	else{
		pc.stats_remove_favor_points(giant, pc.stats_get_max_favor(giant));
		// Add to the pc's emblem counter
		pc.stats_add_emblem(giant);
	}
	
	// Tell client the max_favor has increased
	var msg = this.favorUpdate(pc, giant);
	pc.apiSendMsg(msg);
	
	if (pc.getQuestStatus('create_giant_icon') == 'none'){
		var max_emblem_count = 0;
		var emblem_count = 0;
		for (var i in config.giants){
			emblem_count = pc.stats_get_emblems(config.giants[i]);
			if (emblem_count > max_emblem_count){
				max_emblem_count = emblem_count;
			}
		}
		if (max_emblem_count >= 4){
			pc.quests_offer('create_giant_icon');
		}
	}
	
	// Increment their achievement counter, and do the callback immediately if they don't have the emblem
	pc.achievements_increment('emblems_acquired', giant, 1, false, !pc.achievements_has('first_'+giant+'_emblem'));
	pc.quests_inc_counter('emblems_acquired', 1);
	
	//log.info("EMBLEM: "+emblem+" num was "+num_emblems+" is now "+pc.countItemClass(emblem));
	apiLogAction('GIVE_EMBLEM', 'pc='+pc.tsid, 'giant='+giant, 'num_emblems_of_type='+(num_emblems+1));
	
	return true;
}

function computeDonationXP(pc){
	return pc.stats_donation_xp_limit();
}

// Check donation amounts to see if daily limits are exceeded. If not, donate. Otherwise, prompt the player.
function evalDonate(pc, msg) {
	var baseXP = this.computeDonationXP(pc);
	
	// Count up items and compute donation favour and XP values
	var giantName = this.get_giant();
	giantName = giantName.charAt(0).toUpperCase() + giantName.slice(1);
	
	var dailyMaxFavor = pc.stats_get_max_favor(this.get_giant());
	
	log.info(pc+" Donating item : " + msg.target_itemstack_tsid + " of class " + msg.target_item_class + ".");
	
	var stack;
	if (msg.target_itemstack_tsid){
		stack = apiFindObject(msg.target_itemstack_tsid);
	}
	else{
		stack = pc.findFirst(msg.target_item_class);
	}

	var cost = stack.getBaseCost();
	
	var count = msg.target_item_class_count;
	var exceedsFavor = false;
	var exceedsXP = false;
	
	log.info("SHRINE: donating "+msg.target_item_class_count+" "+stack.class_tsid);
	
	cost *= count;
	
	/* Check powder bonuses */
	var powder_bonus = 1;
	if (pc.buffs_has('extremely_hallowed')){
		powder_bonus = 3;
	}
	else if (pc.buffs_has('fairly_hallowed')){
		powder_bonus = 2;
	}

	// compute donation xp and favour.
	var xp = Math.round(cost * 0.2 * powder_bonus) * pc.stats_get_xp_mood_bonus();
	var favor = Math.round(cost * 0.1 * powder_bonus);
	
	log.info("SHRINE: xp is "+xp+" and favor is "+favor);
	
	var atMaxFavor = false;
	var atMaxXP = false;
	var dailyFavor = 0;
	var dailyXP = 0;

	// Check to see what limits are exceeded, if any.
	if(pc.daily_favor && pc.daily_favor[this.get_giant()]) {
		log.info("SHRINE: Current daily favor "+pc.daily_favor[this.get_giant()]+". and max is "+dailyMaxFavor);
		dailyFavor = pc.daily_favor[this.get_giant()].value;
		if(dailyFavor + favor > dailyMaxFavor) {
			exceedsFavor = true;
			if(dailyFavor == dailyMaxFavor) {
				atMaxFavor = true;
			}
			
		}
		
		/*if (pc.stats_has_favor_points(giantName)+favor > pc.stats_get_max_favor(giantName)) { 
			var exceedsEmblem = true;
		}*/
	} else if (favor > dailyMaxFavor) {
		exceedsFavor = true;
		
		/*if (favor > pc.stats_get_max_favor(giantName)) { 
			var exceedsEmblem = true;
		}*/
	}
	
	if(pc.stats.donation_xp_today) {
		dailyXP = pc.stats.donation_xp_today.value;
		
		log.info("Current daily xp "+dailyXP+". and max is "+baseXP);
		if(dailyXP + xp > baseXP && pc.stats_get_level() < 60) {
			exceedsXP = true;
			if(dailyXP == baseXP) {
				atMaxXP = true;
			}
		}
	}
	
	// Recompute amount if over the caps
	if (pc.is_god) {
		if (exceedsFavor || exceedsXP /*|| exceedsEmblem*/) {
			
			var favorOver = (dailyFavor + favor) - dailyMaxFavor;
			var xpOver = pc.stats_get_level() < 60 ? (dailyXP + xp) - baseXP : 0;
			//var emblemOver = (dailyFavor+favor) - pc.stats_get_max_favor(giantName);
		
			var bc = stack.getBaseCost();
		
			log.info("SHRINE: favor: "+atMaxFavor+" xp: "+atMaxXP);
			log.info("SHRINE: bc is "+bc+" and powder_bonus "+powder_bonus);
			log.info("SHRINE: "+" and favorOver is "+favorOver+" xpOver is "+xpOver);
		
			/*if (exceedsEmblem && (emblemOver > 0) && (emblemOver > favorOver) && (emblemOver > xpOver)) {
				log.info("SHRINE: overcount based on emblem "+emblemOver + " max is "+pc.stats_get_max_favor(giantName)+" daily is "+dailyFavor+" and favor is "+favor);
				var overcount = emblemOver / (bc * .1 * powder_bonus);
			}
			else */ if (!atMaxFavor && (favorOver > 0) && (favorOver > xpOver || atMaxXP)) { 
				// will hit favor cap first
				log.info("SHRINE: computing favor limit with "+dailyFavor+" "+favor+" "+dailyMaxFavor+" "+favorOver+" "+cost+" "+powder_bonus);
				
				var overcount = favorOver / (bc * .1 * powder_bonus);
				
			}
			else if (!atMaxXP && (xpOver > 0) ) {
				// will hit xp cap first
				log.info("SHRINE: computing xp limit with "+dailyFavor+" "+favor+" "+dailyMaxFavor+" "+xpOver+" "+cost+" "+powder_bonus+" "+pc.stats_get_xp_mood_bonus());
				
				var overcount = xpOver / (bc * .2 * powder_bonus * pc.stats_get_xp_mood_bonus());
			}
		
			if (overcount) {
				log.info("SHRINE: overcount is "+Math.floor(overcount));
				msg.target_item_class_count -= Math.floor(overcount);
				
				if (msg.target_item_class_count < 1) { 
					msg.target_item_class_count = 1;
				}
			}
		}
	}
	
	if (stack.hasTag('no_donate')){
		pc.announce_sound('HORRIBLE_SOUND');
		pc.sendActivity("Your attempt to donate "+pluralize(count, stack.name_single, stack.name_plural)+" does not anger the giants, nor does it please them. In fact, it merely bemuses them.");
		return false;
	} else if (atMaxXP && atMaxFavor) {
		this.conversation_start(pc, "You have reached your maximum of "+dailyMaxFavor+" possible daily favor from donations to "+giantName+" and your maximum daily iMG of "+baseXP +
			" from shrine donations. You will receive no favor or iMG from this donation. Do you still want to donate?",
								{1: {txt: "Yes, donate anyway.", value:"yes"}, 2: {txt: "No thanks.", value:"no"}});
		
	} else if (!pc.is_god && (exceedsFavor && exceedsXP)) {
		this.conversation_start(pc, "You are currently at "+dailyFavor+" out of your possible "+dailyMaxFavor+" daily favor from donations to "+giantName+
			" and at "+dailyXP+" of your possible "+baseXP+" daily iMG from shrine donations. "+
			"This donation will exceed your maximum daily favor limit for this giant as well as your maximum daily donation iMG, and you will not receive the full amounts. "+
			"Do you still want to donate?",
								{1: {txt: "Yes, donate anyway.", value:"yes"}, 2: {txt: "No thanks.", value:"no"}});
	}  else if (!pc.is_god && exceedsFavor) {
		this.conversation_start(pc, "You are currently at "+dailyFavor+" out of your possible "+dailyMaxFavor+" daily favor from donations to "+giantName+
		". This donation will exceed your maximum daily favor limit for this giant. Do you still want to donate?",
								{1: {txt: "Yes, donate anyway.", value:"yes"}, 2: {txt: "No thanks.", value:"no"}});
	} else if (!pc.is_god && exceedsXP) {
		this.conversation_start(pc, "You are currently at "+dailyXP+" of your possible "+baseXP+" daily iMG from shrine donations. "+
			"This donation will exceed your maximum daily donation iMG, and you will not receive the full amount. Do you still want to donate?",
								{1: {txt: "Yes, donate anyway.", value:"yes"}, 2: {txt: "No thanks.", value:"no"}});
	}
	else if (pc.is_god && atMaxFavor) {
		this.conversation_start(pc, "You have reached your maximum of "+dailyMaxFavor+" possible daily favor from donations to "+giantName+
		". You will receive no favor from this donation. Do you still want to donate?",
								{1: {txt: "Yes, donate anyway.", value:"yes"}, 2: {txt: "No thanks.", value:"no"}});
	} else if (pc.is_god && atMaxXP) {
		this.conversation_start(pc, "You have reached your maximum daily iMG of "+baseXP +
			" from shrine donations. "+
			"You will not receive any iMG from this donation. Do you still want to donate?",
								{1: {txt: "Yes, donate anyway.", value:"yes"}, 2: {txt: "No thanks.", value:"no"}});
	}
	
	if ((pc.is_god && (atMaxXP || atMaxFavor)) || (!pc.is_god && (exceedsFavor || exceedsXP))){
		if(!this.pendingDonations) {
			this.pendingDonations = {};
		}
		this.pendingDonations[pc.tsid] = msg;
		return true;
	} else {
		return this.doDonate(pc,msg);
	}
}

function doDonate(pc, msg){
	var failed = 0;
	var orig_count = this.count;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];
	var huge_bonus = false;
	var super_huge_bonus = false;
	var did_giant_overlay = false;

	var baseXP = this.computeDonationXP(pc);

	if (msg && msg.target_item_class){
		/* Since you can donate emblems during the rook attack, it's possible if the menu remains up while
		* the rook is being defeated that you can wind up actually donating an emblem. Do not permit that!
		*/
		
		var proto = apiFindItemPrototype(msg.target_item_class);
		if(proto.hasTag('emblem')) {
			pc.sendActivity("You cannot donate this item to the Giants!");
			return;
		}
		
		if (proto.hasTag('no_donate')) baseXP = 0;
		
		// make sure we're in the right state
		this.fsm_push_stack('opened');
		pc.announce_sound('DONATE_TO_SHRINE');

		if (msg.target_item_class_count <= 0) { 
			log.error("Problem: tried to donate 0 or fewer items! "+msg);
		}
		
		var stack;
		if (msg.target_itemstack_tsid){
			stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
		} else{
			stack = pc.removeItemStackClass(msg.target_item_class, msg.target_item_class_count);
		}
		
		if (!stack){
			log.error('failed to find other stack - wtf');
			return false;
		}
		
		// Notify juju bosses in this location
		var bosses = this.container.find_items('npc_juju_boss');
		for (var i in bosses){
			bosses[i].onShrineDonation(stack);
		}
		
		var base_cost = stack.hasTag('no_donate') ? 0 : (stack.getBaseCost() * stack.count);
		//log.info('Base cost: '+base_cost);
		var got = stack.count;
		
		if (msg.target_item_class_count === 1) { 
			var verb_past = "donated "+msg.target_item_class_count+" "+stack.name_single+" to";
		}
		else {
			var verb_past = "donated "+msg.target_item_class_count+" "+stack.name_plural+" to";
		}

		
		// TODO: items_removed here is a hack -- we should handle it better/more universally in the bags code
		// Note: pc.items_removed must be called AFTER the item is deleted in order for quest requirements to update correctly
		stack.apiDelete();
		pc.items_removed(stack);
		
		while (got < msg.target_item_class_count) {
			var next_stack = pc.removeItemStackClass(msg.target_item_class, msg.target_item_class_count-got);
			
			if (next_stack){
				got += next_stack.count;
				base_cost += next_stack.hasTag('no_donate') ? 0 : (next_stack.getBaseCost() * next_stack.count);
				// Note: pc.items_removed must be called AFTER the item is deleted in order for quest requirements to update correctly
				next_stack.apiDelete();
				pc.items_removed(next_stack);
			} else {
				break;
			}
		}
		
//		base_cost *= got;

		
		// animate
		this.fsm_event_notify('animate', {'pc': pc, 'item': msg.target_item_class}, getTime()+500);

		// you get 20% of the base value back as XP + 10% back as mood
		// it rounds, so if is something is cheap enough, you get nothing

		// check bonuses from powder buffs
		var powder_bonus = 1;
		if (pc.buffs_has('extremely_hallowed')){
			powder_bonus = 3;
			pc.buffs_remove('extremely_hallowed');
			
			if (base_cost >= 1000) pc.achievements_increment('powders', 'hallowed_be_shrine_name', 1);
		} else if (pc.buffs_has('fairly_hallowed')){
			powder_bonus = 2;
			pc.buffs_remove('fairly_hallowed');
		}

		// include XP mood bonus in stats
		var xp = Math.round(base_cost * 0.2 * powder_bonus) * pc.stats_get_xp_mood_bonus();
		if (pc.buffs_has('no_no_powder')){
			xp = Math.round(xp * 0.2);
		}
		var mood = Math.round(base_cost * 0.1 * powder_bonus);

		// one in 100 donations, you get a bonus.
		// 90% of the time, the bonus is .4x the base cost of the item back as XP and .2x the base cost of the item back as mood.
		// 10% of the time the bonus is 1x the base cost of the item back as XP and .5x the base cost back as mood

		if (is_chance(0.01) || pc.buffs_has("max_luck")){
			pc.show_rainbow('rainbow_superdonation');
			if (is_chance(0.1)){
				super_huge_bonus = true;
				self_msgs.push("You got a super super huge bonus!");
				xp += Math.round(base_cost * 1);
				mood += Math.round(base_cost * 0.5);
			} else{
				huge_bonus = true;
				self_msgs.push("You got a super huge bonus!");
				xp += Math.round(base_cost * 0.4);
				mood += Math.round(base_cost * 0.2);
			}
		}
		
		// add to daily donation xp limits
		pc.init_prop('stats', 'donation_xp_today', 0, 0, baseXP);
		xp = pc.stats['donation_xp_today'].apiInc(xp);

		var slugs = {};
		if (xp){
			
			xp = pc.stats_add_xp(xp, true, {type: 'shrine_donation', tsid: this.tsid, giant: this.get_giant(), location: pc.location.tsid, item_class: msg.target_item_class, count: msg.target_item_class_count});
			self_effects.push({
				"type"	: "xp_give",
				"value"	: xp
			});
			slugs.xp = xp;
		}

		if (mood){

			mood = pc.metabolics_add_mood(mood);
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: mood
			});
			slugs.mood = mood;
		}


		// we give 10% of the base cost as "favor points" to that giant (and keep 11 counters, one for each giant)
		var favor_points = Math.round(base_cost * 0.1 * powder_bonus);
		var actual_favor = 0;
		
		var giant = this.get_giant();

		// we also give 10% of the base cost as "favor points" for that player with that giant,
		// so have 11 counters for each player
		if (favor_points){
			// track daily favor limits
			pc.init_prop('daily_favor', giant, 0, 0, pc.stats_get_max_favor(giant));
			var limValue = pc.daily_favor[giant].apiInc(favor_points);

			// Increment only by the amount remaining in the daily favor limit
			actual_favor = pc.stats_add_favor_points(giant, limValue, true);
			// Add to betterlearning favor quest
			pc.betterlearning_favor_add(giant, limValue);
			if (actual_favor){
				// perform web callback
				var args = {
					giant	: giant,
					points	: actual_favor
				};

				utils.http_get('callbacks/giants_add_points.php', args);
				
				if (actual_favor == 1){
					self_msgs.push("Your favor with "+capitalize(giant)+" has increased by 1!");
				}
				else{
					self_msgs.push("Your favor with "+capitalize(giant)+" has increased by "+actual_favor+"!");
				}
				if (!slugs.favor) slugs.favor = [];
				slugs.favor.push({
					giant: giant,
					points: actual_favor
				});
			}
		}

		this.fsm_event_notify('close', null, getTime()+1000);

		apiLogAction('DONATE_TO_SHRINE', 'pc='+pc.tsid, 'giant='+giant, 'item='+msg.target_item_class, 'count='+msg.target_item_class_count, 'xp='+xp, 'mood='+mood, 'favor='+favor_points);
				
		var ticket_chance = 0;
		if (base_cost >= 6) {
			if (base_cost < 80) {
				ticket_chance = 0.04;
			} else if (base_cost < 300) {
				ticket_chance = 0.0005 * base_cost;
			} else {
				ticket_chance = 0.15;
			}
		}
		// Chance to get a gameshow ticket
		if (is_chance(ticket_chance)){
			this.fsm_event_notify('give_ticket', pc, getTime()+1500);
			var message = {
				'from' :		'give_ticket',
				'to' :			'closed',
				'payload' :		pc,
				'delivery_time':getTime()+1500
			};
			this.messages_add(message);
		}


		// quests/achievements
		pc.achievements_increment('shrines_donated', giant);
		pc.quests_inc_counter('favor_points', actual_favor);

		var donate_to_all_shrines = pc.getQuestInstance('donate_to_all_shrines');
		var req_status;
		if (donate_to_all_shrines){
			req_status = donate_to_all_shrines.get_req_status_by_name('shrine_donated_'+giant);
		}

		if (!donate_to_all_shrines || req_status.got_num === 0){
			if (!pc.giant_tip_index || !donate_to_all_shrines) pc.giant_tip_index = 0;
			pc.giant_tip_index %= 11;
			pc.giant_tip_index++;

			var screen_args = {
				tip_body: this.giant_tips[pc.giant_tip_index-1]
			};

			if (!donate_to_all_shrines){
				screen_args.close_payload = {
					itemstack_tsid: this.tsid,
					callback: 'offerGiantQuest'
				};

				pc.last_giant_donated = giant;
			}
			else{
				screen_args.close_payload = {
					itemstack_tsid: this.tsid,
					callback: 'incrementGiantQuest'
				};
			}

			this.open_giant_screen(pc, screen_args);
			//pc.quests_inc_counter('shrine_donated_'+giant);
			did_giant_overlay = true;
		}

		if (giant == 'lem' && msg.target_item_class == 'lemburger'){
			pc.quests_inc_counter('lemburgers_donated', got);
		}
		
		var q = pc.getQuestInstance('betterlearning_donate_to_shrines');
		if (q && q.accepted && !q.isDone()){
			if (!pc.giants_donated) pc.giants_donated = {};
			if (!pc.giants_donated[giant]){
				pc.giants_donated[giant] = true;
				pc.quests_inc_counter('donate_giants', 1);
			}
		}

		q = pc.getQuestInstance('donate_1000_favor_every_giant_one_day');
		if (q && q.accepted && !q.isDone()){
			pc.quests_inc_counter('earned_favor_'+giant, favor_points);
		}
		
		if (msg.target_item_class == 'cocktail_shaker' && giant == 'friendly'){
			pc.quests_set_flag('cocktail_shaker_donated');
		} else if (msg.target_item_class == 'awesome_pot' && giant == 'pot'){
			pc.quests_set_flag('awesome_pot_donated');
		}

		if (!this.give_emblem(pc, slugs) && !did_giant_overlay){
			if (super_huge_bonus) {
				pc.announce_sound('DONATION_4TH_TIER');
				this.sendResponse('super_donation_20x_xp', pc, slugs);
			} else if (huge_bonus) {
				pc.announce_sound('DONATION_4TH_TIER');
				this.sendResponse('super_donation_5x_xp', pc, slugs);
			} else if (base_cost <= 10){
				pc.announce_sound('DONATION_1ST_TIER');
				this.sendResponse('donated_item_tier1', pc, slugs);
			} else if (base_cost <= 100){
				pc.announce_sound('DONATION_2ND_TIER');
				this.sendResponse('donated_item_tier2', pc, slugs);
			} else if (base_cost <= 500){
				pc.announce_sound('DONATION_3RD_TIER');
				this.sendResponse('donated_item_tier3', pc, slugs);
			} else{
				pc.announce_sound('DONATION_4TH_TIER');
				this.sendResponse('donated_item_tier4', pc, slugs);
			}
		}
	}
	else{
		failed = 1;
	}


	var pre_msg = this.buildVerbMessage(orig_count, 'donate to', verb_past, failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg, pc, did_giant_overlay);

	return failed ? false : true;
}

function favorRequest(pc, msg){
	var stack = pc.findFirst(msg.item_class);
	if (!stack){
		return {ok: 0, error: "That's not an item type I recognize."};
	}

	var giant = this.get_giant();

	var cost = stack.hasTag('no_donate') ? 0 : stack.getBaseCost();
	
	/* Check powder bonuses */
	var powder_bonus = 1;
	if (pc.buffs_has('extremely_hallowed')){
		powder_bonus = 3;
	}
	else if (pc.buffs_has('fairly_hallowed')){
		powder_bonus = 2;
	}

	var favor = cost * 0.1 * powder_bonus;

	var max_daily_favor = pc.stats_get_max_favor(giant);
	var cur_daily_favor = 0;
	
	log.info("SHRINE: doing favorRequest,  max is "+max_daily_favor+" for giant "+giant);

	if (pc.daily_favor && pc.daily_favor[giant]){
		cur_daily_favor = pc.daily_favor[giant].value;
	}

	var ret = {
		ok: 1,
		item_favor: favor, // how much favor for a single item
		single_stack_only: (stack.has_custom_basecost && !(stack.hasTag("powder") && !intval(stack.getClassProp("maxCharges")))) ? true : false, //send true for items that can only be donated 1 of (like firefly jars)
		favor: { //the same as when shrine_start is sent to the client, but only for this giant for speeeeed
			name: giant.replace('ti', 'tii'),
			cur_daily_favor: cur_daily_favor,
			current: pc.stats_get_favor_points(giant),
			max: max_daily_favor,
			max_daily_favor: max_daily_favor
		}
	};

	return ret;
}

// Updates favor limits after an emblem is received
function favorUpdate(pc, giant) {

	var max_daily_favor = pc.stats_get_max_favor(giant);
	var cur_daily_favor = 0;
	

	if (pc.daily_favor && pc.daily_favor[giant]){
		cur_daily_favor = pc.daily_favor[giant].value;
	}

	var msg = { type: "shrine_favor_update",
			favor: { //the same as when shrine_start is sent to the client, but only for this giant for speeeeed
				name: giant.replace('ti', 'tii'),
				cur_daily_favor: cur_daily_favor,
				current: pc.stats_get_favor_points(giant),
				max: max_daily_favor,
				max_daily_favor: max_daily_favor
			}
		};
	//log.info("SHRINE: favorUpdate sending msg "+msg);
	
	return msg;
}

function openRookAttack() {
	this.showPrimeOverlay();
	this.rook_attack_open = true;
}

function closeRookAttack() {
	this.rook_attack_open = false;
	if(this.primed) {
		this.primeComplete();
	} else {
		this.hidePrimeOverlay();
	}
}

function showPrimeOverlay(pc) {
	if(pc && !pc.skills_has('piety_1')) {
		return;
	}
	
	var annc = {
		type:'itemstack_overlay',
		itemstack_tsid: this.tsid,
		swf_url:overlay_key_to_url('click_to_prime'),
		uid: 'shrine_prime_overlay_'+this.tsid,
		delta_y: 0,
		at_top: true,
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_payload: {itemstack_tsids: [this.tsid]},
			dismiss_on_click: true,
			txt: "Click to prime this shrine for attack.",
			txt_delta_y: -30
		}
	};
	
	if(pc) {
		log.info("Sending prime announcement");
		pc.apiSendAnnouncement(annc);
	} else {
		var pcs = this.container.getActivePlayers();
		for(var i in pcs) {
			if(pcs[i].skills_has('piety_1')) {
				pcs[i].apiSendAnnouncement(annc);
			}
		}
	}
}

function hidePrimeOverlay() {
	this.container.apiSendMsg({type: 'overlay_cancel', uid: 'shrine_prime_overlay_'+this.tsid});
}

function resumeDonateOverlay(details) {
	if(details.pc && this.primed && this.container.canAttack()) {
		this.showDonateOverlay(details.pc);
	}
}

function showDonateOverlay(pc) {
	var annc = {
		type:'itemstack_overlay',
		itemstack_tsid: this.tsid,
		swf_url:overlay_key_to_url('click_to_donate'),
		uid: 'shrine_donate_overlay_'+this.tsid,
		delta_y: 0,
		at_top: true,
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_verb: 'donate_to',
			dismiss_on_click: true,
			txt: "Click to donate to this shrine.",
			txt_delta_y: -30
		}
	};

	if(pc) {
		pc.apiSendAnnouncement(annc);
	} else {
		this.container.apiSendAnnouncementX(annc, this.priming_pc);
	}
}

function hideDonateOverlay() {
	this.container.apiSendMsg({type: 'overlay_cancel', uid: 'shrine_donate_overlay_'+this.tsid});
}

//********************************************
// Special for the Jellisac Hands 1 skill quest:
function showSplatterOverlay(pc) {
	if (pc){
		pc.apiSendMsg({
			type:  'move_avatar',
			x:  this.x - 120,
			y:  this.y,
			face: 'right'
		});

		log.info(pc + " started slathering a shrine to Grendaline.");
		this.apiSetTimerX('showSplatterOverlayFinish', 1500, pc);
	}
}

function showSplatterOverlayFinish(pc) {
	if (pc) {
		log.info(pc + " finished slathering a shrine to Grendaline.");
	
		var delta_y = 180;
		if (this.class_tsid == 'npc_shrine_ix_grendaline'){
			delta_y = 275;
		}
		else if (this.class_tsid == 'npc_shrine_firebog_grendaline'){
			delta_y = 255;
		}
		else if (this.class_tsid == 'npc_shrine_uralia_grendaline'){
			delta_y = 195;
		}
		
		var annc = {
			type: 'itemstack_overlay',
			itemstack_tsid: this.tsid,
			duration: 4500,
			swf_url:overlay_key_to_url('jellisac_splatter_on_shrine'),
			locking: false,
			delta_x: 0,
			delta_y: delta_y,
			
			uid: 'shrine_splatter_overlay_'+this.tsid
		};

		pc.location.apiSendAnnouncementX(annc, pc);
			
		pc.announce_sound('SQUISH_GRAPES');
	
		annc.locking = true;
		pc.apiSendAnnouncement(annc);
	}
}

function hideSplatterOverlay() {
	this.container.apiSendMsg({type: 'overlay_cancel', uid: 'shrine_splatter_overlay_'+this.tsid});
}
//**********************************************

function primeStart(pc) {
	if(pc['!priming_shrine'] || this.primed || !this.container.canAttack()) {
		return;
	}
	
	this.hidePrimeOverlay();
	
	this.priming_pc = pc;
	pc['!priming_shrine'] = true;
	this.primed = true;
	this.total_damage = 0;
	
	pc.apiSendMsg({
		type:  'move_avatar',
		x:  this.x - 150,
		y:  this.y,
		face: 'right'
	});
		
	this.priming_pc.apiSendMsg({
		type:  'move_avatar',
		x:  this.x - 120,
		y:  this.y,
		face: 'right'
	});

	var annc = {
		type:'location_overlay',
		pc_tsid: this.priming_pc.tsid,
		swf_url:overlay_key_to_url('shrine_power_up'),
		uid: 'shrine_power_up_'+this.priming_pc.tsid,
		x: this.x - 40,
		y: this.y + 10,
		delay_ms: 1000,
		duration: 10000,
		at_bottom: true
	};
	
	this.container.apiSendAnnouncementX(annc, this.priming_pc);
	annc.locking = true;
	this.priming_pc.apiSendAnnouncement(annc);
	
	this.apiSetTimer('primeComplete', 10000);
	this.showDonateOverlay();
}

function primeComplete() {
	if(!this.priming_pc || !this.primed) {
		return;
	}
	
	this.apiCancelTimer('primeComplete');
	this.container.apiSendMsg({type: 'overlay_cancel', uid: 'shrine_power_up_'+this.priming_pc.tsid});

	var xp;
	if (this.total_damage) {
		xp = this.priming_pc.stats_add_xp(this.total_damage / 2);
	}

	var priming_text = "You have finished priming the shrine for attack.";
	if (xp) {
		priming_text += " You got "+xp+" iMG for the "+this.total_damage+" damage dealt to the Rook.";
	}
	this.priming_pc.sendActivity(priming_text);
	
	
	if(this.priming_pc['!priming_shrine']) {
		delete this.priming_pc['!priming_shrine'];
	}
	
	delete this.priming_pc;
	
	this.primed = false;
	this.hideDonateOverlay();
	if(this.rook_attack_open && !this.attacking) {
		this.showPrimeOverlay();
	}
}

function shrineAttack(pc,msg) {
	log.info("SHRINE ATTACK.");
	var emblem_name = "emblem_"+this.get_giant();

	if (msg.target_item_class){
		pc.apiSendMsg({type: 'overlay_cancel', uid: 'shrine_donate_overlay_'+this.tsid});
		this.events_add({callback: 'resumeDonateOverlay', pc: pc}, 3);
		// Move them to one side
		pc.apiSendMsg({
			type:  'move_avatar',
			x:  this.x + 120,
			y:  pc.y,
			face: 'left'
		});

		this.fsm_push_stack('opened');

		var stack;
		if (msg.target_itemstack_tsid){
			stack = pc.removeItemStackTsid(msg.target_itemstack_tsid, msg.target_item_class_count);
		}
		else{
			stack = pc.removeItemStackClass(msg.target_item_class, msg.target_item_class_count);
		}
		if (!stack){
			log.error('failed to find other stack - wtf');
			return false;
		}

		var base_cost = stack.getBaseCost();
		//log.info('Base cost: '+base_cost);
		var got = stack.count;
		
		stack.apiDelete();
		
		while (got < msg.target_item_class_count) {
			var next_stack = pc.removeItemStackClass(msg.target_item_class, msg.target_item_class_count-got);
			
			if (next_stack){
				got += next_stack.count;
				next_stack.apiDelete();
			}
			else{
				break;
			}
		}
		
		base_cost *= got;
		
		// Announce item animation to all:
		this.container.apiSendAnnouncement({
			type: "pc_to_floor",
			orig_x: pc.x,
			orig_y: pc.y-50,
			dest_x: this.x-5,
			dest_y: this.y-135,
			count: 1,
			item_class: msg.target_item_class
		});
		
		this.fsm_event_notify('close', null, getTime()+500);
		
		this.events_add({callback:'launchAttack', count: got, base_cost: base_cost, is_emblem: msg.target_item_class == emblem_name, pc:pc}, 1);

		apiLogAction('DAMAGE_ROOK', 'pc='+pc.tsid, 'item='+msg.target_item_class, 'count='+msg.target_item_class_count);
	}


	return true;
}

function launchAttack(details) {
	log.info("Attack!");
	var pc = details.pc;
	var damage = intval(details.is_emblem ? (250 * details.count) : (details.base_cost * 0.1));
	
	if(damage <= 0) {
		return;
	}

	if (this.priming_pc){
		if (this.priming_pc.imagination_has_upgrade('piety_shrine_prime_bonus_2')){
			damage += Math.round(damage * 0.5);
		}else if (this.priming_pc.imagination_has_upgrade('piety_shrine_prime_bonus_1')){
			damage += Math.round(damage * 0.25);
		}
	}
	
	var rook_attack = this.container.getRookAttack();
	if (rook_attack) {
		var rook_health = rook_attack.rookAttackGetInfo().health;
		damage = Math.min(damage, rook_health);
	}
	
	this.total_damage += damage;
	
	var annc = {
		type:'itemstack_overlay',
		duration: 2000,
		itemstack_tsid: this.tsid,
		delta_x: 5,
		delta_y: 140,
		dont_keep_in_bounds: true
	};
	
	if(details.is_emblem) {
		annc.swf_url = overlay_key_to_url('shrine_laser_beam_3');
	} else if(damage >= 100) {
		annc.swf_url = overlay_key_to_url('shrine_laser_beam_2');
	} else {
		annc.swf_url = overlay_key_to_url('shrine_laser_beam_1');
	}
	
	var xp_given = pc.stats_add_xp(damage);
	if (xp_given) {
		pc.sendActivity("You struck back against the Rook, causing "+damage+" damage. You got "+xp_given+" iMG.");
	}
	
	this.container.apiSendAnnouncement({
		type:'location_overlay',
		swf_url:overlay_key_to_url('rook_feathers_falling'),
		uid: 'rook_feathers_'+this.tsid,
		x: this.x,
		y: this.y - 200,
		dont_keep_in_bounds:true,
		duration:3000,
		delay_ms:1000
	});
	
	// Move the camera for players in view.
	this.container.apiSendMsg({
		type: 'camera_center',
		itemstack_tsid: this.tsid,
		duration_ms: 2000
	});
	
	this.container.apiSendAnnouncement(annc);
	
	this.container.rook_attack.doAttack(pc, damage);
	
	this.attacking = true;
	this.apiCancelTimer('doneAttack');
	this.apiSetTimer('doneAttack', 3000);
}

function doneAttack() {
	this.attacking = false;
	if(this.rook_attack_open && !this.primed) {
		this.showPrimeOverlay();
	}
}

function closed_onEnter(previous_state){
	// Setup our message handler
	this.messages_register_handler('closed', 'closed_onMsg');

	// transition animation
	if (previous_state == 'opened'){
		this.setAndBroadcastState('close');
	}
}

function closed_onMsg(msg){
	//log.info('closed_onMsg received: '+msg);

	if (msg.from == 'give_ticket'){
		this.fsm_push_stack('opened');
		this.fsm_event_notify('give_ticket', msg.payload, getTime()+500);
	}
}

function getTeleportVars(){
	var vars = [];

	if (!this.instanceProps) return vars;

	if (this.instanceProps.teleport_class == 'Oktyabrya'){
		vars.push({giant: 'Pot', street: 'Ti Street', hub: 'Groddle Forest', tsid: 'LM4106P196QP2', x: 51, y: -133, cost: 200});
		vars.push({street: 'Flipside', hub: 'Ix', tsid: 'LM410QQ0CHARO', x: 791, y: -262, cost: 100});
	}
	else if (this.instanceProps.teleport_class == 'Flipside'){
		vars.push({giant: 'Friendly', street: 'The Entrance', hub: 'Ilmenskie Caverns', tsid: 'LHH101L162117H2', x: -490, y: -529, cost: 150});
		vars.push({street: 'Upper Valley Heights', hub: 'New Groddle Forest', tsid: 'LLI23UJNDHD1A4V', x: 423, y: -209, cost: 200});
	}
	else if (this.instanceProps.teleport_class == 'Middle Valley Meadow'){
		vars.push({giant: 'Alph', street: 'Lower Valley Hollow', hub: 'Groddle Forest', tsid: 'LM410DL52LK2K', x: -1157, y: -110, cost: 100});
		vars.push({street: 'Lem Hill', hub: 'Groddle Forest', tsid: 'LM4107P19BGU4', x: 2029, y: -24, cost: 100});
	}
	else if (this.instanceProps.teleport_class == 'Short Track'){
		vars.push({giant: 'Spriggan', street: 'Doon Way', hub: 'Groddle Forest', tsid: 'LM411HOPTGN58', x: 2315, y: -63, cost: 100});
		vars.push({street: 'Ilmenskie', hub: 'Uralia', tsid: 'LIF102FDNU11314', x: -2006, y: -657, cost: 200});
	}
	else if (this.instanceProps.teleport_class == 'Lem Hill'){
		vars.push({giant: 'Lem', street: 'Guillermo Gamera Way', hub: 'Ix', tsid: 'LM4109NI2R640', x: -1283, y: -38, cost: 250});
		vars.push({street: 'Cebarkul', hub: 'Uralia', tsid: 'LIF12PMQ5121D68', x: -2310, y: -245, cost: 250});
	}

	return vars;
}

function get_giant(){
	return this.class_tsid.replace('npc_shrine_', '').replace('ix_', '').replace('uralia_', '').replace('firebog_', '').replace('tii', 'ti');
}

function onConversation(pc, msg){
	log.info("SHRINE: onConversation in shrines.js");
	var vars = this.getTeleportVars();

	if (msg.choice == 'teleport-0'){
		if (pc.stats_has_currants(vars[0].cost)){
			pc.stats_remove_currants(vars[0].cost, {type: 'shrine_teleport', destination: vars[0].tsid});
			pc.teleportToLocationDelayed(vars[0].tsid, vars[0].x, vars[0].y);
			return this.conversation_end(pc, msg);
		}
		else{
			return this.conversation_reply(pc, msg, "Oh, but you don't have enough!");
		}
	}
	else if (msg.choice == 'teleport-1'){
		if (pc.stats_has_currants(vars[1].cost)){
			pc.stats_remove_currants(vars[1].cost, {type: 'shrine_teleport', destination: vars[1].tsid});
			pc.teleportToLocationDelayed(vars[1].tsid, vars[1].x, vars[1].y);
			return this.conversation_end(pc, msg);
		}
		else{
			return this.conversation_reply(pc, msg, "Oh, but you don't have enough!");
		}
	}
	else if (msg.choice == 'teleport-no'){
		return this.conversation_end(pc, msg);
	}
	else {
		return this.conversation_reply(pc, msg, "Not sure what you mean there...");
	}
}

function opened_onEnter(previous_state){
	// Setup our message handler
	this.messages_register_handler('opened', 'opened_onMsg');

	// transition animation
	if (previous_state == 'closed'){
		this.setAndBroadcastState('open');
	}
}

function opened_onMsg(msg){
	//log.info('opened_onMsg received: '+msg);

	if (msg.from == 'give_ticket'){
		var pc = msg.payload;
		var val = pc.createItemFromSource("gameshow_ticket", 1, this);
		if (val == 0){
			pc.sendActivity('You got a Gameshow Ticket!');
		}
		else{
			this.container.createItem("gameshow_ticket", 1, this.x, this.y, 150);
			pc.sendActivity('A Gameshow Ticket fluttered to the ground.');
		}
		
		this.fsm_event_notify('close', null, getTime()+1000);
	} else if (msg.from == 'close'){
		this.fsm_pop_stack();
	} else if (msg.from == 'animate'){
		var pc = msg.payload.pc;
		var item = msg.payload.item;
		pc.apiSendAnnouncement({
			type: "pc_to_floor",
			orig_x: pc.x,
			orig_y: pc.y-50,
			dest_x: this.x-5,
			dest_y: this.y-135,
			count: 1,
			item_class: item
		});
	}
}

// http://wiki.tinyspeck.com/wiki/GiantScreen
function open_giant_screen(pc, args){
	var giant = this.get_giant();
	var info = config.giants_info[giant];
	if (giant == 'ti') giant = 'tii';

	var rsp = {
		type:'giant_screen',
		tsid: giant,
		giant_of: info.giant_of,
		personality: info.personality,
		desc: info.desc,
		followers: info.followers,
		flv_url: overlay_key_to_url('giant_'+giant+'_flv_overlay'),
		tip_title: 'Donation Tip:', //optional
		tip_body: args.tip_body ? args.tip_body : '',
		sound: 'GONG_GIANTS'
	};

	if (args.close_payload) rsp.close_payload = args.close_payload;

	pc.apiSendMsg(rsp);
}

function offerGiantQuest(pc, msg){
	log.info(this+' offering giant quest to '+pc);
	pc.quests_offer('donate_to_all_shrines', true);
}

function incrementGiantQuest(pc, msg){
	pc.quests_inc_counter('shrine_donated_'+this.get_giant());
}