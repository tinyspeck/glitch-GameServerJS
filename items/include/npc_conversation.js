function conversation_cancel(pc) {

	var rsp = {
		type			: 'conversation_cancel',
		itemstack_tsid	: this.tsid
	};
	
	pc.conversations_clear_current_state();
	
	pc.apiSendMsg(rsp);

	if (this.local_chat_queue){
		pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: this.local_chat_queue});
		delete this.local_chat_queue;
	}

	if (this.onConversationEnding) this.onConversationEnding(pc);
}

function conversation_end(pc, msg)
{
	if (this.fsm_event_notify) this.fsm_event_notify('conversation_end', {'pc': pc, 'msg': msg});

	var rsp = {
		type		: 'conversation_choice',
		msg_id		: msg.msg_id,
		success		: true,
		itemstack_tsid	: this.id,
	};

	pc.apiSendMsgAsIs(rsp);

	if (this.local_chat_queue){
		pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: this.local_chat_queue});
		delete this.local_chat_queue;
	}

	if(this.onInteractionEnding) {
		this.onInteractionEnding(pc);
	}
	if (this.onConversationEnding) this.onConversationEnding(pc);
}

function conversation_reply(pc, msg, txt, choices, offsets, rewards, cancel_value, details, no_echo){

	if (msg.type != 'conversation_choice') return this.conversation_start(pc, txt, choices, offsets, rewards);
	
	if (this.fsm_event_notify) this.fsm_event_notify('conversation_reply', {'pc': pc, 'msg': msg, 'txt': txt, 'choices': choices});

	if ((!details || !details.ignore_state) && this.getContainerType() == 'street'){
		if (this.instanceProps && this.instanceProps.talk_state){
			this.state = this.instanceProps.talk_state;
		} else {
			this.state = 'talk';
		}
	}

	var rsp = {
		type		: 'conversation_choice',
		msg_id		: msg.msg_id,
		success		: true,
		itemstack_tsid	: this.id,
		txt		: ""+txt
	};
	
	if (details && details.dont_take_focus){
		rsp.dont_take_focus = true;
	}
	
	if (details && details.dont_take_camera_focus){
		rsp.dont_take_camera_focus = true;
	}
	
	if (details && details.button_style_size){
		rsp.button_style_size = details.button_style_size;
	}
	
	if (details && details.button_style_type){
		rsp.button_style_type = details.button_style_type;
	}

	if (choices) rsp.choices = choices;
	if (offsets){
		rsp.offset_x = intval(offsets.offset_x);
		rsp.offset_y = intval(offsets.offset_y);
	}
	else if (this.classProps && this.classProps.conversation_offset_x){
		rsp.offset_x = intval(this.classProps.conversation_offset_x);
		rsp.offset_y = intval(this.classProps.conversation_offset_y);
	}

	if (rewards){
		if (rewards.xp){
			if (!rewards.imagination) rewards.imagination = 0;
			rewards.imagination += rewards.xp;
			delete rewards.xp;
		}
		rsp.rewards = rewards;
	}
	if (cancel_value){
		rsp.cancel_value = cancel_value;
	}

	if (details && details.title){
		rsp.title = details.title;
	}

	pc.apiSendMsgAsIs(rsp);

	if (this.onInteractionStarting) this.onInteractionStarting(pc);
	if (this.onConversationReply) this.onConversationReply(pc);

	if (!no_echo && !this.no_chat_echo) {
		txt = txt.replace(new RegExp('<split butt_txt="[^"]+"?\\s?\\W>', 'g'), '--br--');
		txt = txt.replace(/<br>/g, '<br> ');
		txt = utils.strip_html(txt);
		txt = txt.replace(/--br--/g, '<br>');

		var split_pos = txt.search('<br>');
		if (split_pos != -1){
			this.local_chat_queue = txt.substr(split_pos+4);
			txt = txt.substr(0, split_pos);
		}

		pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: txt});
	}
}

function conversation_start(pc, txt, choices, offsets, rewards, cancel_value, details, no_echo){

	if (this.fsm_event_notify) this.fsm_event_notify('conversation_start', {'pc': pc, 'txt': txt, 'choices': choices});
	
	if ((!details || !details.ignore_state) && this.getContainerType() == 'street'){
		if (this.instanceProps && this.instanceProps.talk_state){
			this.state = this.instanceProps.talk_state;
		} else {
			this.state = 'talk';
		}
	}

	var rsp = {
		type		: 'conversation',
		itemstack_tsid	: this.id,
		txt		: ""+txt
	};

	if (details && details.dont_take_focus){
		rsp.dont_take_focus = true;
	}
	
	if (details && details.dont_take_camera_focus){
		rsp.dont_take_camera_focus = true;
	}
	
	if (details && details.button_style_size){
		rsp.button_style_size = details.button_style_size;
	}
	
	if (details && details.button_style_type){
		rsp.button_style_type = details.button_style_type;
	}

	if (choices) rsp.choices = choices;
	if (offsets){
		rsp.offset_x = intval(offsets.offset_x);
		rsp.offset_y = intval(offsets.offset_y);
	}
	else if (this.classProps && this.classProps.conversation_offset_x){
		rsp.offset_x = intval(this.classProps.conversation_offset_x);
		rsp.offset_y = intval(this.classProps.conversation_offset_y);
	}

	if (rewards){
		if (rewards.xp){
			if (!rewards.imagination) rewards.imagination = 0;
			rewards.imagination += rewards.xp;
			delete rewards.xp;
		}
		rsp.rewards = rewards;
	}
	if (cancel_value){
		rsp.cancel_value = cancel_value;
	}

	if (details && details.title){
		rsp.title = details.title;
	}

	pc.apiSendMsgAsIs(rsp);

	// Make player face the speaker.
	if ((!details || !details.dont_take_focus) && this.getContainerType() == 'street'){
		if((details && details.required_distance) || intval(this.getClassProp('conversation_distance')) > 0) {
			var req_distance = (details && details.required_distance) ? details.required_distance : intval(this.getClassProp('conversation_distance'));
			
			var move_distance = (pc.x < this.x) ? -req_distance : req_distance;
		
			pc.moveAvatar(this.x + move_distance, pc.y, (this.x < pc.x) ? 'left' : 'right', 'conversation_start 1');
			if (this.x < pc.x) {
				this.dir = 'right';
			} else {
				this.dir = 'left';
			}
			this.broadcastState();
			
		} else if ((!details || !details.no_auto_flip) && !this.no_auto_flip){
			if (this.x < pc.x) {
				this.dir = 'right';
			} else {
				this.dir = 'left';
			}

			// TODO: GET THIS FUCKING ASSET FLIPPED
			if (this.class_tsid == 'npc_maintenance_bot'){
				if (this.dir == 'left'){
					this.dir = 'right';
				}
				else{
					this.dir = 'left';
				}
			}
			this.broadcastState();

			pc.faceAvatar((this.x < pc.x) ? 'left' : 'right', true);
		}
	}

	if (this.onInteractionStarting) this.onInteractionStarting(pc);
	if (this.onConversationStarting) this.onConversationStarting(pc);

	if (!no_echo && !this.no_chat_echo) {
		txt = txt.replace(new RegExp('<split butt_txt="[^"]+"?\\s?\\W>', 'g'), '--br--');
		txt = txt.replace(/<br>/g, '<br> ');
		txt = utils.strip_html(txt);
		txt = txt.replace(/--br--/g, '<br>');

		var split_pos = txt.search('<br>');
		if (split_pos != -1){
			this.local_chat_queue = txt.substr(split_pos+4);
			txt = txt.substr(0, split_pos);
		}

		pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: txt});
	}
}

function onConversation(pc, msg){

	log.info("******************onConversation", msg.choice);
	
	
	//
	// Notify other functions that might care
	//
	
	if (this.fsm_event_notify) this.fsm_event_notify('conversation', {'pc': pc, 'msg': msg});
	
	var conversation_runner = "conversation_run_"+msg.choice.split('-')[0];
	if (this[conversation_runner]) return this[conversation_runner](pc, msg);
	
	if (this.loneliness && msg.choice.substr(0, 11) == 'loneliness-') {
		return this.lonelinessOnConversation(pc, msg);
	}
	
	if (this.getAvailableQuests) {
		// do quests
		return this.questConversation(pc, msg);
	}
	
	
	//
	// I give up
	//

	return this.conversation_reply(pc, msg, "Not sure what you mean there...");
}

function questConversation(pc, msg) {
	//
	// QUESTS
	//

	if (msg.choice == 'offer'){
		return this.offerQuests(pc, msg);
	}
	else if (msg.choice == 'cancel'){
		return this.conversation_end(pc, msg);
	}

	var quests = this.getAvailableQuests(pc);

	for (var i in quests.offered){

		var q = quests.offered[i];

		if (msg.choice == 'decline-quest-'+q){
			if (q == 'blue_and_white_part1'){ // HAAAACKS
				pc.last_blue_and_white_offer = time();
				return this.conversation_reply(pc, msg, "Ok, Perhaps I'll ask you some other time then...");
			}
			return this.conversation_end(pc, msg);
		}

		if (msg.choice == 'start-quest-'+q){

			var qi = pc.startQuest(q, true);
			pc.acceptQuest(q);
			if (qi.onStarted){
				var ret = pc.restartQuest(q);
				if (ret.error){
					return this.conversation_reply(pc, msg, ret.error);
				}
			}
			if (qi.start){
				return this.conversation_reply(pc, msg, qi.getStart(pc));
			}else{
				return this.conversation_end(pc, msg);
			}
		}

		if (msg.choice == 'explain-quest-'+q){

			var q_proto = apiFindQuestPrototype(q);

			var choices = {
				1: {txt: q_proto.button_accept, value: 'start-quest-'+q},
				2: {txt: q_proto.button_decline, value: 'offer'}
			};

			if (msg.no_backtrack) delete choices[2];

			if (q_proto.onStarted && msg.no_backtrack){
				choices[2] = {txt: q_proto.button_decline, value: 'decline-quest-'+q};
			}

			var text = q_proto.getOffer(pc);

			return this.conversation_reply(pc, msg, text, choices);
		}
	}

	for (var i in quests.incomplete){

		var qi = quests.incomplete[i];

		if (msg.choice == 'incomplete-quest-'+qi.class_id){

			var text = qi.getWaitingText(pc);

			return this.conversation_reply(pc, msg, text);	
		}
	}

	for (var i in quests.given){

		var qi = quests.given[i];

		if (msg.choice == 'given-quest-'+qi.class_id){

			var text = qi.getGiverWaitingText(pc);

			return this.conversation_reply(pc, msg, text);	
		}
	}

	for (var i in quests.completed){

		var qi = quests.completed[i];

		if (msg.choice == 'turnin-quest-'+qi.class_id){

			var choices = {
				1: {txt: qi.button_turnin, value: 'complete-quest-'+qi.class_id},
				2: {txt: qi.button_noturnin, value: 'offer'}
			};

			if (msg.no_backtrack) delete choices[2];

			var text = qi.getCompletion(pc);

			return this.conversation_reply(pc, msg, text, choices, null, qi.rewards);
		}

		if (msg.choice == 'complete-quest-'+qi.class_id){

			if (pc.completeQuest(qi.class_id, 1)){

				// should we chain together the next quest?
				var next = this.getAvailableQuests(pc);
				var chain = num_keys(next.offered) + num_keys(next.completed);

				if (chain){
					if (qi.thanks){

						var choices = {
							1: {txt: q_proto.button_thanks, value: 'offer'}
						};
						return this.conversation_reply(pc, msg, qi.getThanks(pc), choices);
					}else{
						// Exclude this quest -- do not offer it again
						if(!msg.exclude_quests) {
							msg.exclude_quests = [];
						}
						msg.exclude_quests.push(qi.class_id);
						
						log.info("Finished quest. Offering more quests.");
						
						return this.offerQuests(pc, msg);
					}
				}else{
					if (qi.thanks){
						return this.conversation_reply(pc, msg, qi.getThanks(pc));
					}else{
						return this.conversation_end(pc, msg);
					}
				}
			}else{
				return this.conversation_reply(pc, msg, "Can't complete for some reason...");
			}
		}
	}
	
	
	//
	// I give up
	//

	return this.conversation_reply(pc, msg, "Not sure what you mean there...");

}
