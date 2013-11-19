//
// this is the public API!
//

//
// add an event {seconds} seconds from now. the {details} hash
// must contain a {callback} property, which is the method name or anonymous function
// to be called when the event fires. any other properties just
// get passed back to the method.
//

function events_add(details, seconds){
	if (!details.callback){
		log.error(this+' events_add: no callback: '+details);
		return false;
	}
	
	if (typeof(details.callback) != 'function' && !this[details.callback]){
		log.error(this+' events_add: callback does not exist: '+details);
		return false;
	}

	if (!this.events) this.events = {};

	// special check
	if (seconds <= 0){
		this.events_trigger(details);
		return;
	}

	details.time = time() + floatval(seconds);

	// get a unique key to add it under
	var i = 1;
	while (this.events[str(i)]){
		i++;
	}

	this.events[str(i)] = details;
	this.events_check();
}


//
// remove all events matched by the function {f}, which
// gets passed the details hash for each queued event.
// returns the number of events removed.
//

function events_remove(f){

	if (!this.events) this.events = {};

	var c = 0;

	for (var i in this.events){

		if (f(this.events[i])){
			delete this.events[i];
			c++;
		}
	}

	this.events_check();

	return c;
}


//
// return true if the function {f} matches any events
// in the queue. the function is passed the details hash
// for each queued event.
//

function events_has(f){

	if (!this.events) this.events = {};

	for (var i in this.events){

		if (f(this.events[i])){
			return true;
		}
	}

	return false;
}

///////////////////////////////////////////////////////////////////////////////////////////

//
// past this point are private functions - do not call, pls
//

function events_trigger(details){

	if (details.callback){

		if (typeof(details.callback) == 'function'){
			log.info('------- events_trigger: '+details.callback+' is an anonymous function and should be replaced');
			details.callback(this, details);
		}
		else if (this[details.callback]){
//			this[details.callback].call(this, details);
			var f = this[details.callback];
			if (typeof(f) == 'function'){
				f.call(this, details);
			}else{	
				log.error(this+" events_trigger callback not a function: " + f +"  type=" + typeof(f)+" details="+details);	
			}
		}
		else{
			log.error(this+' events_trigger: what to do with '+details.callback+'? details='+details);	
		}
	}
}

function events_check(){

	var now = time();
	var next = 0;
	var run_now = {};

	for (var i in this.events){

		var ts = floatval(this.events[i].time);

		if (ts <= now){
			run_now[i] = this.events[i];
			delete this.events[i];
		}else{
			if (next == 0){
				next = ts;
			}else{
				if (ts < next) next = ts;
			}
		}
	}

	this.apiCancelTimer('events_check');

	if (next){
		var away = next - now;
		this.apiSetTimer('events_check', away * 1000);
	}


	//
	// we need to run any 'now' events after we've set the next timer,
	// so that if these event cause any more events, they will enter
	// this function and correctly override the next timer event.
	//

	for (var i in run_now){
		this.events_trigger(run_now[i]);
	}
}
