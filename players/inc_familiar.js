function familiar_init(){

	if (!this.familiar) this.familiar = {};
	if (!this.familiar.details) this.familiar.details = {};
	if (!this.familiar.stack) this.familiar.stack = [];
}

function familiar_delete(){

	delete this.familiar;
}

function familiar_reset(){
	this.familiar_delete();
	this.familiar_init();
}

function familiar_conversation_reply(uid, msg, txt, choices, extras){

	var rsp = {
		type		: 'conversation',
		itemstack_tsid	: config.familiar_tsid,
		uid		: uid,
	};

	// if the incoming message had a different source (like a door!), then
	// copy that source over to the reply.
	if (msg.itemstack_tsid) rsp.itemstack_tsid = msg.itemstack_tsid;

	if (msg.msg_id){
		rsp.type = 'conversation_choice';
		rsp.msg_id = msg.msg_id;
		rsp.success = true;
	}

	if (msg.type == 'conversation_cancel'){

		rsp.type = 'conversation_cancel';
	}

	if (txt) rsp.txt = ""+txt;
	if (choices) rsp.choices = choices;
	if (extras){
		for (var i in extras){
			rsp[i] = extras[i];
		}
	}

	//log.info("CONV-CHOICE", rsp);

	this.apiSendMsgAsIs(rsp);
}


//
// this function gets called when we need to alert the player
// that the familiar has a new message for them. we'll store
// the message details in a stack and send an announcement to
// the client. when the player clicks to read the message, the
// client will send a uid back to the server and we'll start a
// conversation, passing a uid around so that we can have
// multiple things going on at once.
//

function familiar_send_alert_delayed(details, seconds){
	// Copy the familiar callback, if any
	if (details.callback) details.familiar_callback = details.callback;
	details.callback = 'familiar_send_alert';
	
	this.events_add(details, seconds);
}

function familiar_send_alert(details){
	// If we were called from events.js, cleanup first
	if (details.familiar_callback){
		details.callback = details.familiar_callback;
		delete details.familiar_callback;
	}

	var uid = this.familiar_get_uid();

	this.familiar.details[uid] = details;
	this.familiar.stack.push(uid);

	this.familiar_announce_queue();
}


//
// this variant puts a message at the start of the stack and
// then starts the conversation. a way to immediately get the
// attention of the player. should only be called from user
// initiated actions, since it interrupts flow.
//
// NOTE: this has been changed by cal to no longer interrupt.
// the only difference between the the regular function and
// this one is that alerts wont persist through logout.
//

function familiar_send_alert_now(details){

	var uid = this.familiar_get_uid();
	details.remove_on_load = true;

	this.familiar.details[uid] = details;
	this.familiar.stack.push(uid);

	this.familiar_announce_queue();
}


//
// this variant starts a conversation immediately, but coming
// from a specific target (e.g. geo:door:DOOR-ID or
// geo:signpost:SIGNPOST-ID). the conversation is not put in
// the stack, so can only be accessed by UID.
//

function familiar_send_targeted(details){

	//
	// store details for later
	//

	var uid = this.familiar_get_uid();

	details.remove_on_load = true;
	this.familiar.details[uid] = details;


	//
	// start it
	//

	this.familiar_on_conversation({ itemstack_tsid: details.target_tsid, uid: uid });
}


//
// called at startup to remove temporary conversations
//

function familiar_clean_queue(){

	var remove_uids = [];

	for (var i in this.familiar.details){
		if (this.familiar.details[i].remove_on_load){
			remove_uids.push(i);
		}
	}

	for (var i=0; i<remove_uids.length; i++){
		this.familiar_remove_alert(remove_uids[i]);
	}
}



//
// a pair of functions to allow queued messages to be removed
// from the queue
//

function familiar_find_alerts(callback){

	var temp = {};

	for (var i in this.familiar.details){
		if (this.familiar.details[i].callback == callback){
			temp[i] = this.familiar.details[i];
		}
	}

	return temp;
}

function familiar_remove_alert(uid){

	this.familiar_remove_message(uid);
	this.familiar_announce_queue();
}

//
// two helper functions
//

function familiar_get_uid(){

	var uid = time();
	while (this.familiar.details[str(uid)]){
		uid++;
	}
	return str(uid);
}

function familiar_announce_queue(){

	this.apiSendAnnouncement({
		type: 'new_familiar_msgs',
		num: this.familiar.stack.length,
	});
}


//
// this gets called when we get sent a 'conversation' message from
// the client. it needs to be dispatched to the first event in the
// stack.
//

function familiar_on_conversation(msg){

	var uid = msg.uid;

	if (!uid){
		uid = this.familiar.stack[0];
		if (!uid){
			this.familiar_conversation_reply(0, msg, "That's odd, I coulda sworn I had something for you...");
			this.familiar_announce_queue();
			return;
		}
	}
	
	var details = this.familiar.details[uid];
	if (!details){
		this.familiar_conversation_reply(0, msg, "That's odd, I coulda sworn I had something for you...");
		this.familiar_remove_message(uid);
		this.familiar_announce_queue();
		return;
	}

	if (!msg.choice) msg.choice = 'start';


	//
	// here we need to dispatch to the functions that handle the various different
	// things that the NPC does, passing along the message and the originally
	// registered details. the function we call will end up calling
	// familiar_conversation_reply and will optionally
	// remove this message from the stack if it's done with.
	//

	var func = details.callback;

	if (func && this[func]){
		// we have a function to dispatch to
		var ret = this[func].call(this, msg.choice, details);

		if (ret){
			
			// Arguments we want to pass along
			var args = ret.args ? ret.args : {};
			
			if (ret.choices && ret.txt){
				this.familiar_conversation_reply(uid, msg, ret.txt, ret.choices, args);
				// ignore ret.done if we gave choices...
			}else if (ret.txt){
				this.familiar_conversation_reply(uid, msg, ret.txt, null, args);
				if (ret.done) this.familiar_remove_message(uid);
			}else{
				this.familiar_conversation_reply(uid, msg);
				if (ret.done) this.familiar_remove_message(uid);
			}
		}

	}else{

		// nothing to handle this event type...
		//this.familiar_conversation_reply(uid, msg, "No handler for conversation type "+details.type);
		log.error(this+"No handler for conversation type "+details.type+': '+details);
		this.familiar_remove_message(uid);
	}

	if (msg.choice == 'dismiss'){
		this.apiSetTimer('familiar_announce_queue', 5000);
	}
	else{
		this.familiar_announce_queue();
	}
}


//
// this gets called when a player performs a verb on their familiar. this
// is how the player reads the next async message in the queue.
//

function familiar_on_verb(msg){

	if (msg.verb == 'talk_to'){
		this.familiar_on_conversation({});
		this.apiSendMsg(make_ok_rsp(msg));
		return;
	}

	this.apiSendMsg(make_fail_rsp(msg, 0, "Unknown familiar verb"));
}


//
// this gets called when the user cancels a conversation dialog
// with the familiar. we'll treat this the same as sending the
// 'dismiss' response, which will finish/remove some events, and
// just pause others (until the player next asks the familiar to
// talk)
//

function familiar_on_conversation_cancel(msg){

	if (!msg.uid){
		this.apiSendMsg(make_fail_rsp(msg, 0, 'conversation_cancel without a uid'));
		return;
	}

	msg.choice = 'dismiss';
	return this.familiar_on_conversation(msg);
}

function familiar_remove_message(uid){

	var old_stack = this.familiar.stack;
	var new_stack = [];

	for (var i=0; i<old_stack.length; i++){
		if (old_stack[i] != uid){
			new_stack.push(old_stack[i]);
		}
	}

	this.familiar.stack = new_stack;

	delete this.familiar.details[uid];
}


//
// this handler is for debugging
//

function familiar_test(choice, details){

	if (choice == 'start'){
		return {
			'txt' : "Hello! This is a the familiar messaging test!",
			'choices' : {
				1: {
					txt	: 'Choice 1',
					value	: 'choice_1',
				},
				2: {
					txt	: 'Choice 2',
					value	: 'choice_2',
				},
			},
			'args': {
				'title': 'Test Familiar Conversation'
			}
		};
	}

	if (choice == 'choice_1' || choice == 'choice_2'){
		return {
			'txt' : "Thanks for choosing "+choice+"!",
			'done' : true,
		};
	}

	// they hit escape - keep this message queued
	return {};
}

function familiar_get_login(){

	var out = {};

	out.messages = this.familiar.stack.length;
	out.tsid = config.familiar_tsid;
	
	if (this.skills_is_accelerated()){
		out.accelerated = true;
	}
	else{
		out.accelerated = false;
	}

	return out;
}

function familiar_teleport_offer(txt, tsid, x, y, force){

	this.familiar_send_alert_now({
		'callback'	: 'familiar_teleport_do',
		'txt'		: txt,
		'tsid'		: tsid,
		'x'		: x,
		'y'		: y,
		'force'		: force,
	});
}

function familiar_teleport_do(choice, details){
	
	if (choice == 'start'){
		if (details.force){
			return {
				'txt' : details.txt,
				'choices' : {
					1: {
						txt	: 'OK',
						value	: 'accept',
					},
				},
			};
		}
		else{
			return {
				'txt' : details.txt,
				'choices' : {
					1: {
						txt	: 'OK',
						value	: 'accept',
					},
					2: {
						txt	: 'Not yet',
						value	: 'cancel',
					},
				},
			};
		}
	}

	if (choice == 'accept' || details.force){
		this.teleportToLocationDelayed(details.tsid, details.x, details.y);
		return {
			done: true,
		};
	}
	else{
		return {
			txt: "Just talk to me again when you're ready.",
			done: false,
		};
	}
}

function familiar_locked_door(choice, details){

	return {
		txt: details.error_msg,
		done: true,
	};
}



function familiar_upgrade(){

	this.familiar_send_alert_now({
		'callback'	: 'familiar_upgrade_do',
	});
}

function familiar_upgrade_do(choice, details){

	var choices = this.location.upgrades_get_details();

	if (choice == 'start'){

		if (num_keys(choices)){

			var fam_choices = {};
			for (var i in choices.upgrade){
				var temp = apiFindObject(choices.upgrade[i].tsid);
				fam_choices[i] = {
					txt	: "Upgrade to "+temp.label+" ("+temp.tsid+")",
					value	: choices.upgrade[i].tsid,
				};
			}
			for (var i in choices.downgrade){
				var temp = apiFindObject(choices.downgrade[i].tsid);
				fam_choices[i] = {
					txt	: "Downgrade to "+temp.label+" ("+temp.tsid+")",
					value	: choices.downgrade[i].tsid,
				};
			}

			return {
				txt: "Pick a state to move to:",
				choices: fam_choices,
			};

		}else{
			return {
				txt: "This is not an upgradeable street.",
				done: true,
			};
		}
	}


	//
	// see if we have a choice match
	//

	var details = null;
	for (var i in choices.downgrade){
		if (choice == choices.downgrade[i].tsid) details = choices.downgrade[i];
	}
	for (var i in choices.upgrade){
		if (choice == choices.upgrade[i].tsid) details = choices.upgrade[i];
	}

	if (details){

		this.location.upgrades_apply(details);

		return {
			done: true,
		};
	}


	//
	// uhh, wtf?
	//

	return {
		txt: "Step not found?",
		done: true,
	};
}

function familiar_ignore_callback(choice, details){
	return {
		txt: details.txt,
		args: details.args ? details.args : {},
		done: true
	};
}