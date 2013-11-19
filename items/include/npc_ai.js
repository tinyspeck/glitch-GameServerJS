function ai_debug_log(msg){
	if (this.getInstanceProp('ai_debug') == "1"){
		log.info(msg);
	}
}

function ai_debug_display(msg) {
	if (this.debugging == true) {
		if (this.target_pc && this.target_pc.getProp('is_god')) {
			this.sendBubble(msg, 3000, this.target_pc);
		}
		else {
			if (this.target_pc) { 
				this.sendBubble("You're not an admin! (Please report a bug.)", 3000, this.target_pc);
			}
			else {
				this.sendBubble("I'm confused :( Please report a bug.", 3000);
			}
		}
	}
}

///////////////////////////////////////////////////////////////////////
// Finite state machine
///////////////////////////////////////////////////////////////////////

function fsm_init(){
	if (!this.current_state){
		this.current_state = undefined;
	}
	
	if (!this.state_stack){
		this.state_stack = [];
	}
	
	if (this.state_stack.length == 0 && this.default_state){
		this.fsm_push_stack(this.default_state);
		
		if (this.current_state && this.current_state != this.default_state){
			this.fsm_push_stack(this.current_state);
		}
	}
}

function fsm_switch_state(state){
	this.ai_debug_log(this+" switch state to "+state+" from "+this.current_state);
	if (this.current_state == state) return this.fsm_run_current_state();
	
	this.fsm_init();
	
	var previous_state = this.current_state;
	this.current_state = state;
	
	// exit existing state, if any, telling it what state we're transitioning to
	if (previous_state){
		var onExit = previous_state + '_onExit';
		if (this[onExit]){
			this.ai_debug_log(this+" calling "+onExit);
			this[onExit](state);
		}
		
		// cleanup any handlers this state has
		this.messages_clear_handlers(previous_state);
		
	}
	
	// enter new state, if state has onEnter defined, telling it what state we're coming from
	var onEnter = state + '_onEnter';
	if (this[onEnter]){
		this.ai_debug_log(this+" calling "+onEnter);
		this[onEnter](previous_state);
	}
	
	// make sure onEnter, etc hasn't caused us to exit this state
	if (this.current_state == state){
		// update
		this.fsm_run_current_state();
	
		// Now we stay in this state, so we can handle events, etc
		// States are responsible for either blindly exiting their state or explicitly switching to another one
	}
}

function fsm_run_current_state(){
	this.ai_debug_log(this+" running current state "+this.current_state);
	this.fsm_init();

	// if we have a current state, execute its onRun method
	if (!this.current_state) return 0;
	
	var onRun = this.current_state + '_onRun';
	if (this[onRun]){
		this.ai_debug_log(this+" calling "+onRun);
		this[onRun]();
	}
}

function fsm_exit_current_state(){
	this.ai_debug_log(this+" exiting current state "+this.current_state);
	this.fsm_init();

	// helper function to find the next state to run and run it
	if (!this.fsm_pop_stack()){
		// no more states... re-run this one
		this.fsm_run_current_state();
	}
}

function fsm_event_notify(event_type, data, when){
	this.fsm_init();

	if (!this.current_state) return 0;
	
	if (!when) when = getTime();
	
	// tell current state about this event, if it cares
	var message = {
		'from' :	event_type,
		'to' :		this.current_state,
		'payload' : 	data,
		'delivery_time':when,
	};
	this.messages_add(message);
}

function fsm_event_notify_interval(event_type, data, when){
	this.fsm_init();

	if (!this.current_state) return 0;
	
	// tell current state about this event, if it cares
	var message = {
		'from' :	event_type,
		'to' :		this.current_state,
		'payload' : 	data,
		'delivery_time':when,
	};
	this.messages_add_interval(message);
}

function fsm_push_stack(state){
	this.ai_debug_log(this+" pushing stack state "+state);
	// add a state to the stack and switch to it, as long is it's not already at the top
	if (this.fsm_get_stack_top() != state){
		this.state_stack.push(state);
		this.fsm_switch_state(state);
		
		return 1;
	}
	
	return 0;
}

function fsm_pop_stack(){
	this.ai_debug_log(this+" popping stack state");
	// remove the top entry of the stack and run the next one
	// if there's only one entry in the stack, do nothing
	
	if (this.state_stack.length <= 1){
		return 0;
	}
	
	var last_state = this.state_stack.pop();
	this.fsm_switch_state(this.fsm_get_stack_top());
	
	return 1;
}

function fsm_get_stack_top(){
	if (!this.state_stack.length) return undefined;
	
	return this.state_stack[this.state_stack.length-1];
}

///////////////////////////////////////////////////////////////////////
// Messaging
///////////////////////////////////////////////////////////////////////

function messages_init(){
	if (!this.message_queue){
		this.message_queue = apiNewOrderedHash();
	}
	
	if (!this.message_interval){
		this.message_interval = {};
	}
	
	if (!this.message_handlers){
		this.message_handlers = {};
	}
	
	if (!this['!message_counter']){
		this['!message_counter'] = 0;
	}
	
	if (this.message_counter){
		delete this.message_counter;
	}
}

function messages_add(args){
	this.messages_init();
	
	// what time was this sent?
	args.time_sent = getTime();
	if (!args.delivery_time){
		args.delivery_time = getTime();
	}
	
	// add to the queue
	this.message_queue[str(args.delivery_time+'-'+this['!message_counter']++)] = args;
	
	// schedule message delivery
	this.messages_deliver();
}

function messages_add_interval(args){
	this.messages_init();
	
	// what time was this sent?
	args.time_sent = getTime();
	if (!args.delivery_time) return;
	
	// Only one at a time
	this.messages_cancel_interval();
	
	// add to the queue
	this.message_interval = args;
	
	// schedule message delivery
	this.apiSetInterval('messages_deliver_interval', args.delivery_time);
}

function messages_cancel_interval(){
	if (this.message_intervals){
		this.apiClearInterval('messages_deliver_interval');
		delete this.message_interval;
	}
}

function messages_deliver_interval(){
	this.messages_init();
	
	var message = this.message_interval;
	if (!message) return;
	
	// deliver it
	if (!message.timeout || message.timeout < getTime()){
		for (var j in this.message_handlers[message.to]){			
			var handler = this.message_handlers[message.to][j];
			if (typeof(handler) == 'function'){
				handler(this, message);
			}
			else{
				this[handler](message);
			}
		}
	}
	else{
		this.messages_cancel_interval();
	}
}

function messages_deliver(timeout){
	// if timeout is specified, we only deliver messages until the timeout is reached or we've drained the queue
	// remember that the deliveries are synchronous
	// messages without handlers are discarded
	
	// messages are: from, to, payload, delivery_time, timeout, time_sent
	// Many things are optional
	
	var start_time = getTime();
	for (var i in this.message_queue){		
		// check processing timeout
		if (timeout && getTime() - time_start >= timeout) break;
		
		// have we reached TEH FUTURE!?
		var message = this.message_queue[i];
		if (message && message.delivery_time > getTime()) break;
		
		// remove it
		delete this.message_queue[i];
		
		if (!message) break;
		
		// deliver it
		if (!message.timeout || message.timeout < getTime()){
			for (var j in this.message_handlers[message.to]){
				if (!this.message_handlers[message.to]) continue; // In case we changed state while processing another message
				
				var handler = this.message_handlers[message.to][j];
				if (typeof(handler) == 'function'){
					handler(this, message);
				}
				else{
					this[handler](message);
				}
			}
		}
	}
	
	// schedule next message delivery
	var next = this.message_queue.first();
	if (next){
		var next_delivery = next.delivery_time;
		
		// no less than 100 ms between runs
		if (next_delivery <= getTime() + 100){
			next_delivery = getTime() + 100;
		}
		
		this.apiCancelTimer('messages_deliver');
		this.apiSetTimer('messages_deliver', next_delivery - getTime());
	}
}

function messages_register_handler(to, callback){
	this.messages_init();

	// for a finite state machine, for example, $to might be: $stateName and callback might be: $stateName_onMsg
	if (this.message_handlers[to]){
		for (var i in this.message_handlers[to]){
			if (this.message_handlers[to][i] == callback) break;
		}
		
		this.message_handlers[to].push(callback);
	}
	else{
		this.message_handlers[to] = [callback];
	}
}

function messages_unregister_handler(to, callback){
	if (this.message_handlers[to]){
		for (var i in this.message_handlers[to]){
			if (this.message_handlers[to][i] == callback){
				delete this.message_handlers[to][i];
				break;
			}
		}
	}
}

function messages_clear_handlers(to){
	this.messages_init();

	delete this.message_handlers[to];
}

///////////////////////////////////////////////////////////////////////
// Behavior voting/evaluation
///////////////////////////////////////////////////////////////////////

function ai_choices_init(){
	if (!this.ai_choices){
		this.ai_choices = [];
	}
}

function ai_choices_make_decision(){
	this.ai_choices_init();
	
	// evaluate our conditions and run the best one
	var results = this.ai_choices_rate();
	if (results.length){
		this.ai_choices_run_choice(results.first());
	}
}

function ai_choices_rate(){
	// run all evaluations and sort them
	
	var results = apiNewOrderedHash();
	for (var i in this.ai_choices){
		var choice = this.ai_choices[i];
		var score = this[choice+'Eval']();
		
		// Score of 0 means DO NOT DO
		if (score > 0){
			results[score] = choice;
		}
	}
	
	return results;
}

function ai_choices_run_choice(choice){
	// run it
	this[choice+'Run']();
}
