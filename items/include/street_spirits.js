//#include jobs.js
//#include loneliness.js
var default_state = 'idle';
var y_offset = 150;

function initSpirit(){
	this.messages_init();
	this.fsm_init();
}

function idle_onEnter(previous_state){
	// Setup our message handler
	this.messages_register_handler('idle', 'onMsg');
}

function onMsg(msg){

	if (msg.from == 'player_collision'){
	}
	else if (msg.from == 'player_enter'){
	}
	else if (msg.from == 'talk_to'){
	}
}

function make_config(){
	if (this.class_tsid != 'street_spirit_firebog'){
		return {
			skull: this.getInstanceProp('skull') || "none",
			eyes: this.getInstanceProp('eyes') || "none",
			top: this.getInstanceProp('top') || "none",
			bottom: this.getInstanceProp('bottom') || "none",
			base: this.getInstanceProp('base') || "none"
		};
	}
	else{
		return {
			size: this.getInstanceProp('size') || "small"
		};
	}
}

function onPropsChanged(){
	this.broadcastConfig();
	
	this.y_offset = intval(this.getInstanceProp('y_offset'));
}

function getTooltipLabel(){
	var label = this.label;
	if (intval(this.getInstanceProp('store_id')) != 0){
		var store = get_store(intval(this.getInstanceProp('store_id')));
		label += " (" + store.name + ")";
	}
	
	return label;
}

// Ensure our y_offset gets set when we are instanced
function onCreateAsCopy(){
	this.y_offset = intval(this.getInstanceProp('y_offset'));
}