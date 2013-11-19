
// This file contains butler conversations that are triggered on collision if particular conditions are met.

function doConvo(pc) {
	
	var conversation = null;

	if (!this.birthday_notification || !is_same_day(this.birthday_notification, current_gametime())) {  // don't notify more than once per day
	
		var special_tsids = ["P001", "P002", "P003", "P004", "P005", "P006", "P007", "P008", "P009"];
		if (!in_array(pc.tsid, special_tsids)) {
			var age = isBirthday(pc);
			if (age) {
			
				this.convo_text = [];
				this.convo_text.push(this.getTextString("happyBirthday0", pc, pc, null, null, ""+age));
				this.convo_text.push(this.getTextString("happyBirthday1", pc, pc, null, null, ""+age));
				this.convo_text.push(this.getTextString("happyBirthday2", pc, pc, null, null, ""+age));
				
				this.convo_buttons = ["Thanks!", "Wow!", "You're forgiven."];
			
				this.logDebugInfo("doing conversation "+this.convo_text+" and "+this.convo_buttons);
				conversation = [ { txt: this.convo_text.shift(), choices: [{txt:this.convo_buttons.shift(), value:"convo"}] }];
				
				this.birthday_notification = current_gametime();
				
			}
		}
	}

	if (conversation) {
		this.convo_step = 0;
		this.playTalk();
		this.timer = 4000;
		this.playAnim("talk", false, 3400);
		this.stateChange("interacting");

		this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
		
		this['!speak_time'] = getTime();
		
		return true;
	}
	
	
	return false;
}

function continueConvo(pc) {

	this.logDebugInfo("doing conversation "+this.convo_text+" and "+this.convo_buttons);
	var conversation = [ { txt: this.convo_text.shift(), choices: [{txt:this.convo_buttons.shift(), value:"convo"}] }];
	
	if (this.convo_text.length <= 0) {
		conversation[0].choices[0].value = "convoDone";
	}
	
	this.logDebugInfo(" conversation is "+conversation);
	
	this.convo_step = 0;
	this.playTalk();
	this.timer = 4000;
	this.playAnim("talk", false, 3400);

	this.conversation_start(pc, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
}