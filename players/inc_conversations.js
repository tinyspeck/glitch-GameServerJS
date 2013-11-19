function conversations_init(){
	if (this.conversations === undefined || this.conversations === null){
		this.conversations = apiNewOwnedDC(this);
		this.conversations.label = 'Conversations';
		
		this.conversations.completed = {};
		this.conversations.offered = {};
	}

	if (!this.conversations.chains_completed) this.conversations.chains_completed = {};
	if (!this.conversations.chains_inprogress) this.conversations.chains_inprogress = {};
}

function conversations_delete(){
	if (this.conversations){
		this.conversations.apiDelete();
		delete this.conversations;
	}
}

function conversations_reset(){
	if (this.conversations){
		this.conversations.completed = {};
		this.conversations.offered = {};

		this.conversations.chains_completed = {};
		this.conversations.chains_inprogress = {};
	}
}

function conversations_has(class_id, id){
	if (this.conversations_has_completed(class_id, id)) return true;
	
	if (this.conversations_has_offered(class_id, id)) return true;

	return false;
}

function conversations_has_completed(class_id, id){
	this.conversations_init();

	// Completed?
	if (class_id){
		if (this.conversations.completed[class_id] && this.conversations.completed[class_id][id]) return true;
	}
	else{
		for (var i in this.conversations.completed){
			if (this.conversations.completed[i] && this.conversations.completed[i][id]) return true;
		}
	}

	return false;
}

function conversations_has_offered(class_id, id){
	this.conversations_init();

	// Time out after 30 minutes
	var timeout = config.is_dev ? 10 : 30*60;

	// Offered?
	if (class_id){
		if (this.conversations.offered[class_id] && this.conversations.offered[class_id][id]){
			if (time() - this.conversations.offered[class_id][id] >= timeout) return false;
			
			return true;
		}
	}
	else{
		for (var i in this.conversations.offered){
			if (this.conversations.offered[i] && this.conversations.offered[i][id]){
				if (time() - this.conversations.offered[i][id] >= timeout) return false;
				
				return true;
			}
		}
	}

	return false;
}

function conversations_offer(source_item, id){
	if (this.conversations_has(null, id)) return false;
	if (source_item.can_be_rooked && source_item.isRooked()) return false;
	if (source_item.is_poisoned) return false;

	var now = time();
	if (!config.is_dev && now - this.date_last_loggedin < (5*60)) return false; // 5 minutes from last login
	if (now - this.stats_get_last_street_visit(this.location.tsid) < 10) return false; // At least 10s on this street
	
	var timeout = config.is_dev ? 10 : 30*60;
	if (num_keys(this.conversations.chains_inprogress)) timeout = config.is_dev ? 5 : 15; // If we're on a chain, we can continue every 15 seconds

	if (this.conversations.last_offer > (now - timeout)) return false;
	if (this.conversations_get_last_completed_conversation() > (now - timeout)) return false;

	var donate_to_all_shrines = this.getQuestInstance('donate_to_all_shrines');
	if (!config.is_dev){
		if (!donate_to_all_shrines || !donate_to_all_shrines.isDone() || time() - donate_to_all_shrines.getProp('ts_done') < 60) return false;
	}

	var can_offer = true;
	var conversation_canoffer = "conversation_canoffer_"+id;
	if (source_item[conversation_canoffer]) can_offer = source_item[conversation_canoffer](this);
	if (!can_offer) return false;
	
	if (!this.conversations.offered[source_item.class_tsid]) this.conversations.offered[source_item.class_tsid] = {};
	this.conversations.offered[source_item.class_tsid][id] = now;

	this.conversations.last_offer = now;
	
	return true;
}

function conversations_force_offer(class_tsid, id){
	if (!this.conversations.offered[class_tsid]) this.conversations.offered[class_tsid] = {};
	this.conversations.offered[class_tsid][id] = time();
}

function conversations_complete(class_id, id, chain){
	this.conversations_init();
	
	for (var i in this.conversations.offered){
		if (this.conversations.offered[i] && this.conversations.offered[i][id]){
			delete this.conversations.offered[i][id];
			if (!num_keys(this.conversations.offered[i])) delete this.conversations.offered[i];
		}
	}
	
	if (!this.conversations.completed[class_id]) this.conversations.completed[class_id] = {};
	this.conversations.completed[class_id][id] = time();
	
	if (chain){
		if (chain.level == chain.max_level){
			this.conversations.chains_completed[chain.id] = time();
			delete this.conversations.chains_inprogress;
		}
		else{
			this.conversations.chains_inprogress[chain.id] = time();
		}
	}

	return true;
}

function conversations_offered_for_class(class_id){
	if (!this.conversations.offered[class_id]) return [];
	
	var convos = [];
	for (var i in this.conversations.offered[class_id]){
		convos.push(i);
	}
	
	return convos;
}

function conversations_offered_for_item(item){
	
	var convos = [];
	for (var i in item.conversations){
		if (this.conversations_has_offered(null, item.conversations[i])) convos.push(item.conversations[i]);
	}
	
	return convos;
}

function conversations_get_last_completed_conversation(){
	var highest = 0;
	for (var i in this.conversations.completed){
		for (var j in this.conversations.completed[i]){
			if (this.conversations.completed[i][j] > highest) highest = this.conversations.completed[i][j];
		}
	}

	return highest;
}

function conversations_set_current_state(itemstack_tsid, conversation_name, choice) {
	this.conversations_init();
	
	this.conversations.state = {itemstack_tsid: itemstack_tsid, conversation_name: conversation_name, choice: choice};
}

function conversations_clear_current_state() {
	this.conversations_init();
	
	if(this.conversations.state) {
		delete this.conversations.state;
	}
}

function conversations_login(){
	if (!this.conversations || !this.conversations.state){
		return;
	}
	
	var stack = apiFindObject(this.conversations.state.itemstack_tsid);
	if (!stack) {
		log.error("Player "+this+" attempting to resume conversation "+this.conversations.state.conversation_name+" with itemstack "+this.conversations.state.itemstack_tsid+", but it cannot be found.");
		return;
	}
	
	// Ensure the stack is appropriately close to begin a conversation
	if (stack.container != this.location || Math.abs(stack.x - this.x) > 300 || Math.abs(stack.y - this.y) > 150){
		log.info("Player "+this+" attempting to resume conversation"+this.conversations.state.conversation_name+" with itemstack "+this.conversations.state.itemstack_tsid+" but itemstack is out of range.");
		return;
	}
		
	// We have a conversation in progress with an item in our location
	var conversation = 'conversation_run_'+this.conversations.state.conversation_name;
	if (!stack[conversation]){
		log.error("Player "+this+" attempting to resume conversation "+this.conversations.state.conversation_name+" with itemstack "+stack+", but conversation does not exist.");
		return;
	}
	
	// Kind of a kludge.
	var msg = {type: 'conversation_login', choice: this.conversations.state.choice};
	stack[conversation](this, msg, true);
	this.conversations_clear_current_state();
}

function conversations_can_do_chain(chain){
	this.conversations_init();

	// This isn't part of a chain, and we aren't in the middle of another
	if (!chain && !num_keys(this.conversations.chains_inprogress)) return true;

	// We are already on this chain
	if (chain && this.conversations.chains_inprogress[chain.id]) return true;

	// We are in the middle of another chain
	if (num_keys(this.conversations.chains_inprogress)) return false;

	return true;
}

var convo_bubble_choices = [
	"Hey {pc_label}, come here, I've got something to tell you!",
	"Hey! {pc_label}! Come talk to me!",
	"{pc_label}! Talk to me? I know secrets.",
	"Say, {pc_label}? You want secrets? Talk to me.",
	"Psssssst! {pc_label}! Talk to me!",
	"Hey! {pc_label}! Talk to me! Here! Me! {pc_label}!",
	"Hey hey hey! Hey! {pc_label}! Hey! Talk to me!",
	"Oy, {pc_label}! Talk to me! I have secrets.",
	"Psst, {pc_label}… Pssst, talk to me!… {pc_label}!",
	"{pc_label}? Want to know what I know? Talk to me!",
	"I know stuff about stuff, {pc_label}. Curious? Talk to me.",
	"Hello? {pc_label}? C’mere. Talk to me.",
	"{pc_label}! Pssssst! Talk to me! {pc_label}!"
];

function conversations_offer_bubble(source){
	if (!this.do_not_disturb){
		var choice = choose_one(this.convo_bubble_choices);
		choice = choice.replace(/{pc_label}/g, this.getLabel());

		source.sendBubble(choice, 10000, this);
	}
}
