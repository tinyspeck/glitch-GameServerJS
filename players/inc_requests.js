function sendActionRequest(type, tsid, from, txt, need, got, timeout){
	this.sendMsgOnline({
		type: "action_request",
		txt: txt,
		pc: from.make_hash(),
		got: intval(got),
		need: intval(need),
		event_type: type,
		event_tsid: tsid,
		timeout_secs: timeout,
		has_accepted: this.hasActionRequestReply(from),
		uid: from.tsid+'_'+type+'_'+tsid
	});
}

function broadcastActionRequest(type, tsid, txt, need, got){
	
	var timeout = 0;
	if (type == 'trade') timeout = 5*60; // 5 minute timeout for trades

	// Store some flags on the location
	if (!this.location.action_requests) this.location.action_requests = {};
	if (this.location.action_requests[this.tsid]){
		this.cancelActionRequestBroadcast(this.location.action_requests[this.tsid].type, this.location.action_requests[this.tsid].tsid);
	}
	
	this.location.action_requests[this.tsid] = {
		type: type,
		tsid: tsid,
		txt: txt,
		got: got,
		need: need,
		timeout: timeout,
		offered: time()
	};
	
	this.location.apiSendMsgX({
		type: "action_request",
		txt: txt,
		pc: this.make_hash(),
		got: intval(got),
		need: intval(need),
		event_type: type,
		event_tsid: tsid,
		timeout_secs: timeout,
		uid: this.tsid+'_'+type+'_'+tsid
	}, this);
	
	this.apiSendMsg({
		type: "action_request",
		txt: txt,
		pc: this.make_hash(),
		got: intval(got),
		need: intval(need),
		event_type: type,
		event_tsid: tsid,
		timeout_secs: timeout,
		uid: this.tsid+'_'+type+'_'+tsid
	});

	return true;
}

function actionRequestReply(from, msg){
	log.info(this+" Action request reply from "+from+" "+msg);
	
	var g;
	if (msg.event_type == 'quest_accept'){
		var q = this.getQuestInstance(msg.event_tsid);
		if (!q){
			g = config.shared_instances[msg.event_tsid];
			if (!g){
				log.error(this+' actionRequestReply unknown quest id: '+msg.event_tsid);
				return false;
			}
		}
		
		if (q && (q.isFull() || !q.isStarted())){
			from.prompts_add({
				txt		: 'Sorry, you were not quite fast enough to join '+this.linkifyLabel()+' on the '+q.getTitle(this)+' quest.',
				timeout		: 10,
				choices		: [
					{ value : 'ok', label : 'Dagnabit!' }
				]
			});
		}
		else if (q){
			q.addOpponent(from);
			from.addActionRequestReply(this);
		}

		return true;
	}

	if (g || msg.event_type == 'game_accept'){
		if (this.games_invite_is_full()){
			from.prompts_add({
				txt		: 'Sorry, you were not quite fast enough to join '+this.linkifyLabel()+'.',
				timeout		: 10,
				choices		: [
					{ value : 'ok', label : 'Dagnabit!' }
				]
			});
		}
		else{
			this.games_add_opponent(from);
			from.addActionRequestReply(this);
		}
		
		return true;
	} else if (msg.event_type == 'trade'){
		this.updateActionRequest('was looking for someone to trade with. '+from.linkifyLabel()+' accepted.', 1);
		this.cancelActionRequestBroadcast('trade', this.tsid);
		var ret = from.trading_request_start(this.tsid);
		if (ret.ok){
			from.apiSendMsgAsIs({
				type: 'trade_start',
				tsid: this.tsid
			});
		}

		return true;
	}
	else{
		log.error(this+' actionRequestReply unknown event type: '+msg.event_type);
	}
	
	return false;
}

function actionRequestCancel(msg){
	if (msg.event_type == 'quest_accept'){
		var q = this.getQuestInstance(msg.event_tsid);
		
		if (q){
			if (!q.isFull()){
				// Remove prompts
				this.prompts_remove(this['!invite_uid_'+this.tsid]);
				for (var i in q.opponents){
					var opp = getPlayer(i);
					if (opp){
						opp.prompts_remove(opp['!invite_uid_'+this.tsid]);
						opp.removeActionRequestReply(this);
					}
				}
				
				this.updateActionRequest('was looking for a challenger on the quest <b>'+q.getTitle(this)+'</b>.', 0);
				this.cancelActionRequestBroadcast('quest_accept', q.class_tsid);
				this.failQuest(q.class_tsid);
				this.events_remove(function(details){ return details.callback == 'quests_multiplayer_invite_timeout'; });
			}
		}		
		return true;
	} else if (msg.event_type == 'game_accept') {
		if (!this.games_invite_is_full()){
			var g = config.shared_instances[msg.event_tsid];
			if (!g){
				log.error(this+' actionRequestCancel unknown game id: '+msg.event_tsid);
				return false;
			}

			// Remove prompts
			this.prompts_remove(this['!invite_uid_'+this.tsid]);
			for (var i in this.games_invite.opponents){
				var opp = getPlayer(i);
				if (opp){
					opp.prompts_remove(opp['!invite_uid_'+this.tsid]);
					opp.removeActionRequestReply(this);
				}
			}
			
			this.updateActionRequest('was looking for a challenger on <b>'+g.name+'</b>.', 0);
			this.cancelActionRequestBroadcast('game_accept', msg.event_tsid);
			this.events_remove(function(details){ return details.callback == 'games_invite_timeout'; });

			if (this.games_invite && this.games_invite.ticket_on_cancel){
				this.createItemFromFamiliar(this.games_invite.ticket_on_cancel, 1);
			}

			delete this.games_invite;
		}
		return true;		
	} else if (msg.event_type == 'trade'){
		this.updateActionRequest('was looking for someone to trade with.', 0);
		this.cancelActionRequestBroadcast('trade', this.tsid);

		return true;
	} else{
		log.error(this+' actionRequestCancel unknown event type: '+msg.event_type);
	}
	
	return false;
}

function cancelActionRequestBroadcast(type, tsid){
	if (!this.location.action_requests) this.location.action_requests = {};
	var details = this.location.action_requests[this.tsid];
	if (!details) return;
	if (details.type != type) return;

	this.location.apiSendMsg({
		type: "action_request_cancel",
		player_tsid: this.tsid,
		event_type: details.type,
		event_tsid: details.tsid,
		uid: this.tsid+'_'+details.type+'_'+details.tsid
	});
	
	delete this.location.action_requests[this.tsid];
}

function cancelActionRequest(from, type, tsid){
	if (!this.location.action_requests) this.location.action_requests = {};
	var details = this.location.action_requests[from.tsid];
	if (!details) return;
	if (details.type != type) return;

	this.apiSendMsg({
		type: "action_request_cancel",
		player_tsid: from.tsid,
		event_type: details.type,
		event_tsid: details.tsid,
		uid: from.tsid+'_'+details.type+'_'+details.tsid
	});
}

function updateActionRequest(txt, got){
	if (!this.location.action_requests) this.location.action_requests = {};
	var details = this.location.action_requests[this.tsid];
	if (!details) return;
	
	this.location.apiSendMsg({
		type: "action_request_update",
		player_tsid: this.tsid,
		event_type: details.type,
		event_tsid: details.tsid,
		txt: txt ? txt : '',
		got: intval(got),
		need: intval(details.need),
		uid: this.tsid+'_'+details.type+'_'+details.tsid
	});
	
	this.location.action_requests[this.tsid].got = got;
	if (txt) this.location.action_requests[this.tsid].txt = txt;
}

function addActionRequestReply(from){
	if (!this.action_request_replies) this.action_request_replies = {};

	this.action_request_replies[from.tsid] = this.location.action_requests[from.tsid];
	if (this.action_request_replies[from.tsid]){
		this.action_request_replies[from.tsid].location = this.location.tsid;
	}
}

function hasActionRequestReply(from){
	if (!this.action_request_replies) return false;
	return this.action_request_replies[from.tsid] ? true : false;
}

function cancelActionRequestReplies(){
	// this is complicated!
	for (var i in this.action_request_replies){
		var deets = this.action_request_replies[i];
		if (!deets) continue;

		log.info(this+' is canceling: '+deets);

		var from = getPlayer(i);
		if (deets.type == 'quest_accept'){
			var q = from.getQuestInstance(deets.tsid);
		
			if (q && !q.isFull()){
				q.removeOpponent(this);
			}
		}
		else if (deets.type == 'game_accept'){
			from.games_remove_opponent(this);
		}

		// Not necessary
		//this.cancelActionRequest(from, deets.type, deets.tsid);
	}

	delete this.action_request_replies;
}

function removeActionRequestReply(from){
	if (!this.action_request_replies) return;

	delete this.action_request_replies[from.tsid];

	if (!num_keys(this.action_request_replies)) delete this.action_request_replies;
}