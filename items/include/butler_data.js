
// Method copied from one of the answers in this StackOverflow post:
// http://stackoverflow.com/questions/1303646/check-variable-whether-is-number-or-string-in-javascript
function isString(object) {
	return typeof object == "string" || (typeof object == "object" && object.constructor === String);
}

// Retrieve text strings from the stringTable object.
// The return value is either a string (with various substrings replaced) or an array of strings.
// Substring replacement is NOT done in strings that are inside arrays.
// All values beyond strId are optional (but may be needed to get correct strings).
// Param is a string used to replace $param
function getTextString(strId, pc, owner, item, message, param, targetPC){

	var string = this.strTable[strId];
	
	if (!string) { 
		log.info(this.getLabel()+" bad strId "+strId);
		return "";
	}

	// If we have an array, pick one of the options to return
	if (!this.isString(string)) {
		string = choose_one(string);
	}
	
	// Now do all substitutions for this string:
	
	if (pc) { 
		var time_away = (this.getGameDaysSinceSeen(pc.tsid)).toFixed(2); //  $time_away
		
		//log.info(this.getLabel()+" for strID "+strId+" target pc is "+targetPC+" and pc is "+pc);
		
		if (targetPC != pc) {
			var pc_name = this.getPlayerNameText(pc); // $pc
		}
		else { 
			var pc_name = pc.label;
		}
		
		var num_visits = this.getVisitsToday(pc.tsid); // $num_visits
	}
	else {
		var time_away = "";
		var pc_name = "";
		var num_visits = "";
	}

	if (owner) {
		if (targetPC != owner) {
			var owner_name = this.getPlayerNameText(owner); // $owner
		}
		else {
			var owner_name = owner.getLabel();
		}
		
		//log.info("TEXT owner_name is "+owner_name);
	}
	else {
		// Should never happen
		var owner_name = "";
	}
	
	var butler_name = (this.user_name ? this.user_name : "Butler"); // $butler
	var location_name = this.container.label; // $location
	var num_visitors = this.getUniqueVisitorsToday(); // $visitors
	
	if (message) { 
		log.info(this.getLabel()+" message is "+message);
		var message_time = ago(gametime_to_timestamp(message.time)); // $message_time
		var message_text = message.message; // $message_text
	}
	else {
		var message_time = "";
		var message_text = "";
	}
	
	if (item) {
			var item = pluralize(item.getProp('count'), item.name_single, item.name_plural); // $item
	}
	else { 
		var item = "";
	}
	
	var speech = this.speech; // $speech
	this.logDebugInfo("in get text string, speech is "+this.speech);
	
	if (this.owner_greetings) { 
		var owner_greeting = this.owner_greetings[0]; // $owner_greeing
	} 
	else {
		var owner_greeting = "";
	}
	
	if (this.friend_greetings) { 
		var friend_greeting = this.friend_greetings[0]; // $friend_greeting
	}
	else {
		var friend_greeting = "";
	}
	
	if (this.stranger_greetings) {
		var stranger_greeting = this.stranger_greetings[0]; // $stranger_greeting
	}
	else {
		var stranger_greetings = "";
	}
	
	if (this.idle_comments) { 
		var idle_comment = this.idle_comments[0]; // $idle_comment
	}
	else { 
		var idle_comment = "";
	}
	
	if (this.info) {
		var info = this.info[0]; // $info
	}
	else {
		var info = "";
	}
	
	var num_packages = this.getNumPackagesTotal(); // $num_packages
	var packagesWithMessages = this.getNumPackagesWithMessages();
	var num_messages = this.getNumMessagesTotal() - packagesWithMessages;	// $num_messages
	var messages = this.pluralizeMessages(num_messages); // $messages
	var packages = this.pluralizePackages(num_packages); // $packages
	
	var num_messages_today = this.getNumMessagesToday(); // $num_messages_today
	var messages_recent = this.pluralizeMessages(num_messages_today); // $messages_recent
	var num_older_messages = (num_messages-num_messages_today); // $num_older_messages
	var messages_older = this.pluralizeMessages(num_older_messages); // $messages_older
	
	
	
	// String could be an array of strings. If so, skip the substring replacement
	if ((string.constructor != String)) {
		return string;
	}
	
	//log.info(this.getLabel()+"TEXT string is "+string);
	//log.info(this.getLabel()+"num_messages_today is "+num_messages_today+" messages_recent is "+messages_recent);
	
	string = string.replace("$butler", butler_name);
	string = string.replace("$pc", pc_name);
	string = string.replace("$owner_greeting", owner_greeting);
	string = string.replace("$owner", owner_name);
	string = string.replace("$location", location_name);
	string = string.replace("$time_away", time_away.toString());
	string = string.replace("$message_time", message_time);
	string = string.replace("$message_text", message_text);
	string = string.replace("$visitors", num_visitors);
	string = string.replace("$speech", speech);
	string = string.replace("$friend_greeting", friend_greeting);
	string = string.replace("$stranger_greeting", stranger_greeting);
	string = string.replace("$idle_comment", idle_comment);
	string = string.replace("$info", info);
	string = string.replace("$num_messages_today", num_messages_today);
	string = string.replace("$messages_recent", messages_recent);
	string = string.replace("$num_older_messages", num_older_messages);
	string = string.replace("$messages_older", messages_older);
	string = string.replace("$item", item);
	string = string.replace("$num_visits", num_visits);
	string = string.replace("$num_packages", num_packages.toString());
	string = string.replace("$num_messages", num_messages.toString());
	string = string.replace("$messages", messages);
	string = string.replace("$packages", packages);
	
	if (param) { 
		this.logDebugInfo(" got param "+param+" for string "+string);
		string = string.replace("$param", param);
	}
	
	return string;
}

// See if this input text matches anything in a  list of responses.
function matchInput(txt) {
	
	var responses_list = this.getResponses();
	
	var obj = {};
	for (var i in responses_list) { 
		obj = responses_list[i];
		this.logDebugInfo("obj is "+obj);
		
		if (obj.user_string && (txt.toLowerCase().indexOf(obj.user_string.toLowerCase()) > -1)) { 
			var response = obj.butler_response;
			if (!this.isString(response)) {
				response = choose_one(response);
			}
			
			return response;
		}
		else if (obj.reg_ex && txt.match(obj.reg_ex)) { 
			var response = obj.butler_response;
			if (!this.isString(response)) {
				response = choose_one(response);
			}
			
			return response;
		}
	}
	
	return null;
}

function doClickAnim(num) { 
	if (!num) { 
		num = 0;
	}

	// If the player is clicking fast, they may see the same animation repeatedly. So, 
	// detect the case where we have lots of clicks and randomize the reaction.
	if (num > 11) { 
		num = randInt(0, 2);
	}
	
	//if (num <= 5) { 
	if (num % 3 === 0) {
		//log.info(this.getLabel()+" playing startle0");
		
		var anims = ["startle0", "acknowledge", "bow", "wave"];
		var times = [467, 667, 1333, 1733];
		
		var index = randInt(0, 3);
		this.playAnim(anims[index], false, times[index]);
	}
	//else if (num <= 11) { 
	else if (num % 3 === 1) {
		//log.info(this.getLabel()+" playing startle1");
		this.playAnim("startle1", false, 500);
	}
	else if (num % 3 === 2) {
		//log.info(this.getLabel()+" playing startle2");
		this.playAnim("startle2", false, 900);
	}

}

// This is what the butler says when he is clicked on:
function getShortGreeting(num) {
	var normal_choice = this.getTextString("normalClickResponseList"); 
	
	var medium_choice = this.getTextString("somewhatAnnoyedClickResponseList"); 
	
	var high_choice = this.getTextString("reallyAnnoyedClickResponseList"); 
	
	var really_high_choice = this.getTextString("reallyReallyAnnoyedClickResponseList"); 
	
	var help_string = this.getTextString("clickHelpAddition"); 

	if (!num || num <= 1) {
		return normal_choice + help_string;
	}
	else if (num <= 5) { 
		return normal_choice;
	}
	else if (num <= 13) {
		return medium_choice;
	}
	else if (num <= 21) { 
		return high_choice;
	}
	else {
		return really_high_choice;
	}
}

// Initial greeting for stranger.
function getGreetingForStranger(pc) { 	
	var owner = this.getOwner();
	
	if (!owner) { return this.getTextString("strangerGreetingOwnerBad"); }
	
	var greeting = this.getTextString("strangerGreeting", pc, owner, null, null, null, pc); 
	
	if (this.getVisitsToday(pc.tsid) > 10) { 
		greeting += this.getTextString("strangerHighNumberVisits", pc); 
	}
	else if (this.getVisitsToday(pc.tsid) > 3) { 
		greeting += this.getTextString("strangerMediumNumberVisits", pc);
	}
	else if (this.getVisitsToday(pc.tsid) > 1) { 
		greeting += this.getTextString("strangerLowNumberVisits", pc); 
	}
	
	return greeting;
}

// Custom greeting, done after a delay.
function getAfterGreetingForStranger(pc) {
	var owner_tsid = this.getInstanceProp("owner_tsid");
	
	if (!owner_tsid) { return this.getTextString("strangerGreetingOwnerBad"); }

	if (this.stranger_greetings && this.stranger_greetings.length > 0) {
		var custom_greeting = choose_one(this.stranger_greetings);
	}
	else {
		var custom_greeting = null;
	}

	var owner = this.getOwner();

	if (custom_greeting) {
		return this.getTextString("visitorCustom", pc, owner) + "\""+custom_greeting+"\"";
	}
	
	return null;
}


function pluralizePackages(num) { 
	if (num === 1) { 
		return "package";
	}
	
	return "packages";
}

function pluralizeMessages(num) { 
	if (num === 1) { 
		return "message";
	}
	
	return "messages";
}

function getGreetingForOwner(pc) { 
	
	if (this.owner_greetings && this.owner_greetings.length > 0) {
		var custom_greeting = choose_one(this.owner_greetings);
	}
	else {
		var custom_greeting = null;
	}
	
	if (custom_greeting) {
		var greeting = this.getTextString("ownerGreeting", pc, pc) + " "+custom_greeting+"";
	}
	else {
		var greeting = this.getTextString("ownerGreeting", pc, pc); 
	}
	
	var days = (this.getGameDaysSinceSeen(pc.tsid)).toFixed(2);
	
	this.logDebugInfo(" days since seen owner is "+days);
	
	if (days > 2) { 
		greeting += this.getTextString("ownerAwayTime", pc, pc); 
	}
	
	if (days > 10) { 
		greeting += this.getTextString("ownerAwayTimeLong", pc, pc); 
	}
	
	return greeting;
}

function getPackagesAndMessagesForOwner(pc) { 

	var text = "";
	
	var packagesWithMessages = this.getNumPackagesWithMessages();
	var numMessages = this.getNumMessagesTotal() - packagesWithMessages;

	var numPackages = this.getNumPackagesTotal();
	var mail = pc.mail_has_unread();
	
	if (numMessages > 0 && numPackages > 0) { 
			text += this.getTextString("ownerMessagesPackagesNew", pc);
	}
	else if (numMessages > 0) { 
			text += this.getTextString("ownerMessages", pc);
	}
	else if (numPackages > 0) { 
			text += this.getTextString("ownerPackages", pc);
	}
		
	if (mail && text.length > 0) { 
		text += this.getTextString("ownerMailAlso", pc);
	}
	else if (mail) { 
		text += this.getTextString("ownerMail", pc);
	}
			
	return text;
}

function getAfterGreetingForOwner(pc) {
	
	var greeting = "";
		
	this.logDebugInfo(" getting after greeting for "+pc);
	
	var numVisitors = this.getUniqueVisitorsToday();
	if (numVisitors > 1) { 
		greeting += this.getTextString("ownerNumVisitors"); 
	}

	this.logDebugInfo(" numVisitors is "+numVisitors);
	
	var numMessages = this.getNumMessagesTotal();
	var numMessagesToday = this.getNumMessagesToday();
	var numPackages = this.getNumPackagesTotal();
	var numPackagesToday = this.getNumPackagesToday();
	
	if (!this.messages || !this.messages.list) { 
		var numMessagers = 0;
	}
	else {
		//var numMessagers = num_keys(this.messages.list);
		var numMessagers = 0;
		var singleMessager = null;
		for (var messager in this.messages.list) { 
			this.logDebugInfo(" messager is "+messager);
			
			var messages = this.messages.list[messager];
			
			for (var m in messages) {
				if (!(messages[m].withPackage)) {
					singleMessager = messager;
					numMessagers ++;
				}
			}
		}
	}
	
	if (!this.packages || !this.packages.list) { 
		var numPackagers = 0;
	}
	else {
		
		var numPackagers = 0;
		var singlePackager = null;
		for (var packager in this.packages.list) { 
			this.logDebugInfo(" packager is "+packager);
			
			if (num_keys(this.packages.list[packager]) > 0) { 
				singlePackager = packager;
				numPackagers ++;
			}
		}
	}
	
	//log.info(this.getLabel()+" packager is "+singlePackager+" and messager is "+singleMessager+" and numMessagers is "+numMessagers+" and numPackagers is "+numPackagers);
	
	if (numMessagers === 1 && numPackagers === 1 && singleMessager === singlePackager) { 
		var player = getPlayer(singlePackager);
		greeting += this.getTextString("ownerMessagesAndPackages", player); 
	}
	else {
		if (numMessages > 0) {
			if (messager) { 
				var player = getPlayer(messager);
				this.logDebugInfo(" messager is "+messager);
				greeting += this.getTextString("ownerSingleMessager", player); 
			}
			else {
				if (numMessagesToday > 3) { 
					greeting += this.getTextString("ownerPopular"); 
				}
				
				greeting += this.getTextString("ownerMultipleMessagers"); 
			}
		}

		if (numPackages > 0) { 
			
			if (numMessages > 0) { 
				greeting += this.getTextString("ownerPackagesAfterMessages"); 
			}
			else { 
				greeting += this.getTextString("ownerPackages"); 
			}
			
			if (numPackagesToday > 3) { 
				greeting += " Your friends have been very generous today.";
			}
		}
	}
	
	

	if (numPackages > 0) {
		this.logDebugInfo(" numPackages is "+numPackages);
		//this.sendBubbleAndChat(pc, this.getTextString("openIM", pc, pc, null, null, null, pc), true, null, true);
		greeting += this.getTextString("openIM", pc, pc, null, null, null, pc);
		this.sendIM(pc, this.getTextString("ownerSuggestPackages", pc, pc), true); 
		this.waiting_for_response.list[pc.tsid] = {which:"suggestion-packages", pc:pc, time:current_gametime()};
	}
	else if (numMessages > 0) {
		this.logDebugInfo(" numMessages is "+numMessages);
		//this.sendBubbleAndChat(pc, this.getTextString("openIM", pc, pc, null, null, null, pc), true, null, true);
		greeting += this.getTextString("openIM", pc, pc, null, null, null, pc);
		this.sendIM(pc, this.getTextString("ownerSuggestMessages", pc, pc), true); 
		this.waiting_for_response.list[pc.tsid] = {which:"suggestion-messages", pc:pc, time:current_gametime()};
	}
	else { 
		if (numVisitors > 0) {
			this.logDebugInfo(" numVisitors is "+numVisitors);
			//this.sendBubbleAndChat(pc, this.getTextString("openIM", pc), true, null, true);
			greeting += this.getTextString("openIM", pc, pc, null, null, null, pc);
			this.sendIM(pc, this.getTextString("ownerSuggestVisitors", pc, pc), true); 			
			this.waiting_for_response.list[pc.tsid] = {which:"suggestion-visitors", pc:pc, time:current_gametime()};
		}
		else {
			this.logDebugInfo(" no suggestions");
			this.sendBubbleAndChat(pc, greeting, true, null, true);
			this.sendIM(pc, this.getTextString("ownerNoSuggestions", pc, pc));
		}
	}

	
	
	return greeting;
}

/*function getAfterGreetingForOwner(pc) {
	return null;
}*/

function getGreetingForFriend(pc) { 
	
	var owner_tsid = this.getInstanceProp("owner_tsid");

	var owner = getPlayer(owner_tsid);
	
	var greeting = this.getTextString("friendGreeting", pc, owner, null, null, null, pc); 
	
	var days = (this.getGameDaysSinceSeen(pc.tsid)).toFixed(2);
	
	if (days > 2) { 
		greeting += this.getTextString("friendTimeAway", pc, owner); 
	}
	else if (this.getVisitsToday(pc.tsid) > 10) {
		if (!this.isOwnerHome()){
			greeting += this.getTextString("friendHighNumberVisitsOwnerAway", pc, owner); 
		}
		else {
			greeting += this.getTextString("friendHighNumberVisitsOwnerHome", pc, owner); 
		}
	}
	else if (this.getVisitsToday(pc.tsid) > 3) { 
		if (!this.isOwnerHome()){
			greeting += this.getTextString("friendMediumNumberVisitsOwnerAway", pc, owner); 
		}
		else {
			greeting += this.getTextString("friendMediumNumberVisitsOwnerHome", pc, owner); 
		}
	}
	else if (this.getVisitsToday(pc.tsid) > 0) { 
		if (!this.isOwnerHome()){
			greeting += this.getTextString("friendLowNumberVisitsOwnerAway", pc, owner); 
		}
		else {
			greeting += this.getTextString("friendLowNumberVisitsOwnerHome", pc, owner); 
		}
	}
	
	return greeting;
}

function getAfterGreetingForFriend(pc) {

	if (this.friend_greetings && this.friend_greetings.length > 0) {
		var custom_greeting = choose_one(this.friend_greetings);
	}
	else {
		var custom_greeting = null;
	}
	
	var owner_tsid = this.getInstanceProp("owner_tsid");

	var owner = getPlayer(owner_tsid);
	
	if (custom_greeting) {
		var greeting = this.getTextString("visitorCustom", pc, owner, null, null, null, pc) + "\""+custom_greeting+"\""; 
		
		return greeting;
	}

	return null;
}

function getCollisionComment(pc) { 

	var chance = randInt(0, 5);
	
	
	if (chance <= 2) { 
		if (this.idle_comments && this.idle_comments.length > 0) {
			var custom_comment = choose_one(this.idle_comments);
		}
	}
	
	if (custom_comment) { return custom_comment; }

	var choices = [	"Excuse me, "+this.getPlayerNameText(pc)+".", 
	    	"Excuse me, "+this.getPlayerNameText(pc)+".",
 	    	"Excuse me, "+this.getPlayerNameText(pc)+".",
	    	"Excuse me, "+this.getPlayerNameText(pc)+".",
	    	"Excuse me, "+this.getPlayerNameText(pc)+".",
	    	"Excuse me, "+this.getPlayerNameText(pc)+".",
	    	"Enjoying the lovely weather?",
	    	"I do love Blue Sno Cones.",
	    	"How has your day been?",
	    	"It's nice to have company.",
	   ];
	 
	if (isZilloween()) { choices.push("Happy Zilloween!"); }
	   
	return choose_one(choices);
}

// Get number of messages left today (by all visitors)
// Don't count messages left with packages
function getNumMessagesToday() {
	var gt = current_gametime();

	var count = 0;
	
	if (!this.messages || !this.messages.list) { 
		return 0;
	}
	
	this.logDebugInfo("getNumMessagesToday");
	
	var messages = this.messages.list;
	
	for (var tsid in messages) { 
		var list = messages[tsid];
		
		for (var i in list) {
			if (list[i].withPackage) { 
				break; 
			}
			
			var time = list[i].time;
			if (time && is_same_day(time, gt)) { 
				count ++;
			}
			else {
				break;
			}
		}
	}
	
	return count;
}

// Total number of stored messages.
function getNumMessagesTotal() {
	var count = 0;
	
	if (!this.messages || !this.messages.list) { 
		return 0;
	}
	
	this.logDebugInfo("getNumMessagesTotal");
	
	var messages = this.messages.list;
	for (var tsid in messages) { 
		var list = messages[tsid];
		
		for (var i in list) {
			//if (!list[i].withPackage) { // don't count messages left with packages
				count ++;
			//}
		}
	}
	
	return count;
}


// Get number of packages left today (by all visitors)
function getNumPackagesToday() { 
	var gt = current_gametime();

	if (!this.packages || !this.packages.list) { 
		return 0;
	}
	
	this.logDebugInfo("getNumPackagesToday");
	var packages = this.packages.list;
	
	var count = 0;
	for (var tsid in packages) { 
		var list = packages[tsid];
		
		for (var i in list) { 
			var time = list[i].time;
			if (is_same_day(time, gt)) { 
				count ++;
			}
			else {
				break;
			}
		}
	}
	
	return count;
}

function getNumPackagesTotal() { 
	var count = 0;
	
	if (!this.packages || !this.packages.list) { 
		return 0;
	}
	
	this.logDebugInfo("getNumPackagesTotal");
	var packages = this.packages.list;
	
	for (var tsid in packages) { 
		count += num_keys(packages[tsid]);
	}
	
	return count;
}

function getNumPackagesWithMessages() { 
	var count = 0;
	
	if (!this.messages || !this.messages.list) { 
		return 0;
	}
	
	this.logDebugInfo("getNumPackagesWithMessages");
	
	var messages = this.messages.list;
	
	for (var tsid in messages) { 
		for (var i in messages[tsid]) {
			if (messages[tsid][i].withPackage) {
				count ++;
			}
		}
	}
	
	return count;
}

// Get number of times a specific visitor visited today
function getVisitsToday(tsid) { 
	return 0;

	if (!this.visitors) { 
		return 0;
	}
	
	if (this.tsid === "BUVBKQP3QL13VUS") { 
		this.logDebugInfo(this+" getting visits today for "+tsid);
	}
	
	var list = this.visitors[tsid];
	var gt = current_gametime();
	
	var count = 0;
	for (var i in list) { 
		var time = list[i];
		if (is_same_day(time, gt)) { 
			count ++;
		}
		/*else { 
			break; // timestamps are in order with the most recent first
		}*/
	}
	
	return count;
}

// Reports visits since the last time visitors info was requested.
function getRecentVisits(tsid, ignore_last_request_time) { 
	if (!this.visitors) { 
		return 0;
	}
	
	if (this.tsid === "BUVBKQP3QL13VUS") { 
		this.logDebugInfo(this+" getting recent visits for "+tsid);
	}
	
	var list = this.visitors.list[tsid];
	
	var count = 0;
	for (var i in list) { 
		var time = list[i];
		
		if (!ignore_last_request_time && this.last_who_visited_time) {
			if (!time) { 
				continue; // bad timestamp
			}
		
			var diff = time - this.last_who_visited_time;
			this.logDebugInfo("last visitors time is "+this.last_who_visited_time+" and time is "+time+" and diff is "+diff);
			if (diff < 0) { 
				continue; // time too old
			}
		}
		
		count ++;
	}
	
	return count;
}


function clearOldVisitorsData(tsid) { 
	if (!this.visitors) { 
		return;
	}
	
	var list = this.visitors.list[tsid];
	var recent = [];
	
	for (var i in list) { 
		var time = list[i];
		
		// Keep a maximum of 5 timestamps for each player
		if ((i >= (list.length - 5)) && this.last_who_visited_time) {
			if (time) { 
				var diff = time - this.last_who_visited_time;
				this.logDebugInfo("last visitors time is "+this.last_who_visited_time+" and time is "+time+" and diff is "+diff);
				
				if (diff >= 0) { 
					recent.push(time);
				}
			}
		}
		else if (i >= (list.length - 5)) {
			recent.push(time);
		}
	}
	
	if (recent.length === 0) { 
		delete this.visitors.list[tsid];
	}
	else { 
		this.visitors.list[tsid] = recent;
	}
}

function clearAllOldVisitors() {
	var visitors = this.visitors ? this.visitors.list : null;
	if (!visitors) { return; }

	for (var i in visitors) {
		this.logDebugInfo("Clearing data for "+i);
		this.clearOldVisitorsData(i);
	}
}

function displayRecentVisits() { 
	if (!this.visitors) { 
		return 0;
	}
	
	if (this.tsid === "BUVBKQP3QL13VUS") { 
		log.info(this+" displaying recent visits ");
	}
	
	var output = "Displaying recent visits - last_who_visited_time is "+this.last_who_visited_time+" ";
	
	for (var tsid in this.visitors.list) {
		var list = this.visitors.list[tsid];
		
		output += "\n"+tsid;
		
		for (var i in list) { 
			var time = list[i];
			
			output += " "+i +" ";
			
			if (this.last_who_visited_time) {
				var diff = time - this.last_who_visited_time;
				this.logDebugInfo("last visitors time is "+this.last_who_visited_time+" and time is "+time+" and diff is "+diff);
				
				output += " time is "+time+" and diff is "+diff;
			}
			
			var days_since = game_days_since(timestamp_to_gametime(time));
			output += " days since is "+days_since;
		}
	}
	
	return output;
}


// Get total number of visits today - not necessarily unique visitors
function getTotalVisitsToday() { 
	return 0;

	if (this.tsid === "BUVBKQP3QL13VUS") { 
		log.info(this+" getting total visits today ");
	}
	
	var count = 0;
	for (var i in this.visitors) { 
		count += this.getVisitsToday(i);
	}
	
	return count;
}

function getUniqueVisitorsToday() { 
	return 0;

	if (this.tsid === "BUVBKQP3QL13VUS") { 
		log.info(this+" getting unique visits today ");
	}
	
	var count = 0;
	for (var i in this.visitors) { 
		if (this.getVisitsToday(i) > 0) { 
			count ++;
		}
	}
	
	return count;
}

// This function is called in the conditions of the visitors verb. It builds the output string and stores it so that 
// if the player selects the verb we don't have to do all the work over again.
function getVisitors() { 
	var owner = this.getOwner();
	var pc = owner;
	
	apiLogAction('BUTLER_VISITORS', 'pc='+pc.tsid, 'butler='+this.tsid);

	var output = "";	
	var num = 0;
	var player = null;

	this.logDebugInfo("getting visitors");
	
	
	var count = 0;
	
	var names = [];
	var visitors = this.visitors ? this.visitors.list : null;
	for (var i in visitors) {
	
		// Never show more than 20 unique visitors
		if (count >= 20) { 
			count ++;
			continue;
		}
	
		//this.logDebugInfo("checking "+i);
		var bLength = visitors[i].length;
		num = this.getRecentVisits(i);
		
		var aLength = visitors[i].length;
		
		if (bLength != aLength){
			log.info(this+" number of timestamps for "+i+" changed from "+bLength+" to "+visitors[i].length);
		}
		
		if (num > 0) { 
			/*if (count > 0) { 
				output += ", ";
			}*/
			
			count ++;
		}
		
		if (num > 0) {
			player = getPlayer(i);
			var name = this.getPlayerNameText(player);
			names.push(name);
			
			//this.logDebugInfo(" got name text "+name+" for "+i);
			//output += this.getTextString("visitorNumTimes", player, owner, null, null, num); 
		
			/*if (num > 3) { 
				output += this.getTextString("visitorSeveralVisits", player, owner); 
			}
			else if (num > 7) {
				output += this.getTextString("visitorManyVisits", player, owner); 
			}
			else if (num > 11) { 
				output += this.getTextString("visitorVeryManyVisits", player, owner); 
			}
			else if (num > 17) { 
				output += this.getTextString("visitorExcessiveVisits", player, owner); 
			}*/
		}
		/*else if (num == 1) {
			player = getPlayer(i);
			output += this.getTextString("visitorOnce", player, owner); 
		}*/
	}
	
	var numVisitors = names.length;
	//if (numVisitors != count) { log.error(" butler data mismatch in getVisitors"); }
	if (numVisitors > 0){ 
		output += this.getTextString("visitorsIntro");

		for (var n = 0; n < numVisitors; n ++) { 
			
			if (numVisitors === 1) { 
				output += " "+names[n]+".";
			}
			else if ((n+1) === numVisitors) { 
				output += " and "+names[n]+".";
			}
			else if ((n+2) === numVisitors) { 
				output += " "+names[n];
			}
			else { 
				output += " "+names[n]+",";
			}
		}
		
		if (count > 20) { 
			output += this.getTextString("visitorsTooMany");
		}
	}
	
	this.visitors_output = output;
	
	return count;
}


// Get the number of game days since a player last visited
// Returns -1 if the player has never visited.
function getGameDaysSinceSeen(tsid) { 

	if (this.tsid === "BUVBKQP3QL13VUS") { 
		log.info(this+" getting days since seen for "+tsid);
	}

	if (tsid == this.getInstanceProp("owner_tsid") && this.last_owner_visit) {
		this.logDebugInfo(" last owner visit is "+this.last_owner_visit);
		return game_days_since(this.last_owner_visit);
	}

	if (!this.visitors || !this.visitors.list || !this.visitors.list[tsid]) { 
		return -1;
	}
	
	var gt = timestamp_to_gametime(this.visitors.list[tsid][0]);
	
	return game_days_since(gt);
}

// Initial help text is a list of options
function getHelpText(pc) {
	var owner = this.getOwner();
	
	var txt = this.getTextString("helpIntro", pc); 
	
	if (pc.location == this.container) {
		txt += this.getTextString("helpOptionsOther", pc); 
	}
	/*else if (pc.location == this.container) {
		txt += this.getTextString("helpOptionsOwnerHome", pc); 
	}*/
	// Currently disabled:
	else {
		txt += this.getTextString("helpOptionsOwnerAway", pc); 
	}
	
	return txt;
}

// After getting a response, show help for a specific command
function showCommandHelp(pc, txt) {
	
	var summonRe = /^\s*(\bcome\b\s*here\b|c|\bcome\b)\s*$/i;
	var goRe = /^\s*(\bgo\b\s*away|g|\bgo\b)\s*$/i;
	var stepRe = /^\s*(\bstep\b\s*back|s)\s*$/i;
	var danceRe = /^\s*(dance|d)\s*$/i;
	var jumpRe = /^\s*(jump|j)\s*$/i;
	var zombieRe = /^\s*(zombie|z)\s*$/i;
	var announceRe = /^\s*(\bannounce\b|\ba\b)\s*/i;
	var whoRe = /^\s*(\bwho\b|w)\s*(\?)?$/i;
	
	var output = "";
	
	var owner = this.getOwner();
	
	this.logDebugInfo(" showing help for "+txt+" to "+pc);
	
	if (summonRe.exec(txt)) {
		output += this.getTextString("helpSummon", pc, owner); 
	}
	else if (goRe.exec(txt)) { 
		output += this.getTextString("helpGo", pc, owner);
	}
	else if (stepRe.exec(txt)) {
		output += this.getTextString("helpStep", pc, owner);
	}
	else if (danceRe.exec(txt)) {
		output += this.getTextString("helpDance", pc, owner);
	}
	else if (jumpRe.exec(txt)) {
		output += this.getTextString("helpJump", pc, owner);
	}
	else if (zombieRe.exec(txt)) {
		output += this.getTextString("helpZombie", pc, owner);
	}
	else if (announceRe.exec(txt)) { 
		output += this.getTextString("helpAnnounce", pc, owner);
	}
	else if (whoRe.exec(txt)) {
		output += this.getTextString("helpWho", pc, owner);
	}
	else if (this.parseQuit(txt)) {
		output += this.getTextString("helpStop", pc, owner);
	}
	else if (this.parseResume(txt)) {
		output += this.getTextString("helpResume", pc, owner);
	}
	else {
		output += this.getTextString("helpUnknown", pc, owner); 
	}
	
	return output;
}

// This processes commands that the owner is allowed to do while not in the same location as the butler
function doFarCommand(pc, txt) {
	
	var owner = this.getOwner();
	
	this.logDebugInfo("doing far command "+txt);
	
	// **** Disable all far commands for now!
	if (pc != owner) {
		this.logDebugInfo("you're not my owner");
		// error check 
		//this.sendIM(pc, this.getTextString("farCommandNotOwner", pc, owner)); 
		return false;
	}
	/*else if (!config.is_dev && !owner.is_god) {
		this.logDebugInfo("you're not allowed to use this command");
		//this.sendIM(pc, this.getTextString("farCommandFailOwner", pc, owner)); 
		return false;
	}*/
	
	var far = (pc.location != this.container);
	
	
	if (far && this.parseQuit(txt)) {
		var now = getTime();
		var time_diff = now - this.notification_time;
	
		this.logDebugInfo(" time diff is "+time_diff);
		this.logDebugInfo("notification time is "+this.notification_time);
	
		if (this.textAddition) { 
			this.sendIM(owner, this.textAddition);
			delete this.textAddition;
			return true;
		}
		else { 
			apiLogAction('BUTLER_QUIT', 'butler='+this.tsid, 'owner='+owner);
			this.notifications = false;
			this.sendIM(pc, this.getTextString("notificationsOff", pc, owner));
			return true;
		}
	}
	else if (this.parseResume(txt)) { 
		if (this.textAddition) { 
			this.sendIM(owner, this.textAddition);
			delete this.textAddition;
			return true;
		}
		else {
			apiLogAction('BUTLER_RESUME', 'butler='+this.tsid, 'owner='+owner);
			this.notifications = true;
			this.sendIM(pc, this.getTextString("notificationsOn", pc, owner));
			return true;
		}
	}
	
	this.logDebugInfo("far is "+far);
	
	var tellRecentRe = /^\s*(tell|say|t)\s+(him\s+|her\s+|them\s+)?/i;
	var announceRe = /^\s*(\bannounce\b|\ba\b)\s*/i;
	var whoRe = /^\s*(\bwho\b|\bw\b)\s*(\?)?$/i;
	//var toRe = /\bto\s+(him\s*|her\s*|them\s*)$/i;
	var danceRe = /^(dance|d)\b/i;
	var fasterRe = /fast/i;
	var zombieRe = /zombie/i;
	var jumpRe = /jump/i;
	var helpRe = /^(help|h|\?)\b/i;
	
	if (tellRecentRe.exec(txt)) {
		log.info
		if (this.textAddition) { 
			this.sendIM(owner, this.getTextString("helpTellOwner", pc, owner));
			delete this.textAddition;
		}
		else if (this.most_recent_notification) {
			this.speech = txt.replace(tellRecentRe, "");
			//this.speech = this.speech.replace(toRe, "");
			if (this.speech === "") { 
				this.sendIM(owner, this.getTextString("farCommandTellNoMessage"));
			}
			else { 
				this.logDebugInfo("speech is "+this.speech);
				
				var sayText = this.getTextString("tellMessage", this.most_recent_notification, owner);
				this.sendBubbleAndChat(this.most_recent_notification, sayText);
				this.sendIM(owner, this.getTextString("confirmTell", pc, owner, null, null, sayText));
				
				apiLogAction('BUTLER_TELL', 'pc='+pc.tsid, 'butler='+this.tsid, 'owner='+owner, 'text='+sayText);
			}
		}
		else {
			this.sendIM(owner, this.getTextString("farCommandTellFail", pc, owner)); 
		}
		
		return true;
	}
	else if (/^\s*(\btell\b|\bt\b|\bsay\b)/i.exec(txt)) { 
		if (this.textAddition) { 
			this.sendIM(owner, this.getTextString("helpTellOwner", pc, owner));
			delete this.textAddition;
		}
		else if (this.most_recent_notification) {
			this.speech = txt.replace(/^\btell\b|\bt\b/i, "");
			this.logDebugInfo("speech is "+this.speech);
			if (this.speech === "") { 
				this.sendIM(owner, this.getTextString("farCommandTellNoMessage"));
			}
			else { 
				//this.stateChange("approachAndSpeak");
				var sayText = this.getTextString("tellMessage", this.most_recent_notification, owner);
				this.sendBubbleAndChat(this.most_recent_notification, sayText);
				this.sendIM(owner, this.getTextString("confirmTell", pc, owner, null, null, sayText));
				
				apiLogAction('BUTLER_TELL', 'pc='+pc.tsid, 'butler='+this.tsid, 'owner='+owner, 'text='+sayText);
			}
		}
		else {
			this.sendIM(owner, this.getTextString("farCommandTellFail", pc, owner)); 
		}
		
		return true;
	}
	else if (announceRe.exec(txt)) { 
		if (this.textAddition) { 
			this.sendIM(owner, this.textAddition);
			delete this.textAddition;
		}
		else { 
			this.speech = txt.replace(announceRe, "");
			
			if (this.speech != "") { 
				var sayText = this.getTextString("announceMessage", null, owner);
				this.sendBubbleAndChat(this.most_recent_notification, sayText);
				this.sendIM(owner, this.getTextString("confirmAnnounce", pc, owner, null, null, sayText));
				
				apiLogAction('BUTLER_ANNOUNCE', 'butler='+this.tsid, 'owner='+owner, 'text='+sayText);
			}
			else { 
				this.sendIM(owner, this.getTextString("farCommandTellNoMessage", pc, owner));
			}
		}
		
		return true;
	}
	else if (whoRe.exec(txt)) { 
		if (this.textAddition) { 
			this.sendIM(owner, this.textAddition);
			delete this.textAddition;
		}
		
		apiLogAction('BUTLER_WHO', 'butler='+this.tsid, 'owner='+owner);
		
		var names = "";
		
		var players = this.container.getActivePlayers();
		for (var p in players) { 
			if (names != "") { names += ", "; }
		
			names += this.getPlayerNameText(players[p]);	
		}
		
		if (names === "") { 
			this.sendIM(owner, this.getTextString("whoMessageNone", owner, owner));
		}
		else { 
			this.sendIM(owner, this.getTextString("whoMessage", owner, owner, null, null, names) );
		}
		return true;
	}
	// Ideally allow phrasing "tell player Hi", but many player names contain spaces, so how to differentiate from rest of 
	// phrase? Could require quotes.
	/*else if (tellRe.exec(txt)) {
		var phrase = txt.replace(tellRe, "");
		if (player.isOnline() && player.location == this.container) {
			this.stateChange("approachAndSpeak");
			this.moveToPlayer(player);
			this.sendIM(owner, "I'm on my way.");
		}
		else {
			this.sendIM(owner, "I'm sorry, "+this.getPlayerNameText(player)+" is not here any more.");
		}
	}*/
	else if (far && danceRe.exec(txt)) {
		apiLogAction('BUTLER_DANCE', 'pc='+pc.tsid, 'butler='+this.tsid);
		
		if (this.stateChange("dancing", "start")) {
			if (this.textAddition) { 
				this.sendIM(pc, this.textAddition);
				delete this.textAddition;
			}
			else { 
				this.sendIM(pc, this.getTextString("farCommandDanceSuccess", pc, owner)); 
			}
		}
		else {
			if (this.textAddition) { 
				this.sendIM(owner, this.getTextString("helpDanceNoPrefix", pc, owner));
				delete this.textAddition;
			}
		
			this.sendIM(pc, this.getTextString("farCommandDanceFail", pc, owner)); 
		}
		
		return true;
	}
	else if (far && fasterRe.exec(txt)) { 
		if (this.getCurrentState() === "dancing") {
			if (this.getCurrentAnim() === "dance") {
				this.playAnim("fastDance", true);
				this.sendIM(pc, this.getTextString("farCommandFasterSuccess", pc, owner));
			}
			else if (this.getCurrentAnim() === "fastDance") {
				this.playAnim("fall",  false, 5633);
				this.sendIM(pc, this.getTextString("fasterFall", pc, owner));
			}
			else {
				this.sendIM(pc, this.getTextString("fasterFailList"));
			}
		}
		else {
			this.sendIM(pc, this.getTextString("fasterFailList"));
		}
		return true;
	}
	else if (far && zombieRe.exec(txt) || /^\s*z\s*($|\s+)/i.exec(txt)) {
		if (this.most_recent_notification) {
			this.sendBubbleAndChat(this.most_recent_notification, "braains");
		}

		this.sendIM(pc, "braains ");
			
		if (!pc.butlers_zombied_today) { 
			pc.butlers_zombied_today = {};
		}
			
		if (pc.butlers_zombied_today[this.tsid]) { 
			pc.butlers_zombied_today[this.tsid] ++;
		}
		else { 
			pc.butlers_zombied_today[this.tsid] = 1;
		}
			
		pc.quests_set_counter('butlers_zombied', num_keys(pc.butlers_zombied_today));
			
		if (this.textAddition) { 
			this.sendIM(pc, this.textAddition);
			delete this.textAddition;
		}
			
		if (this.most_recent_notification) { 
			if (this.stateChange("move_away", "start")) { 
				this['!walk_anim'] = "walk3";
				if (this.canPlayAnim(this['!walk_anim'], true)) {
					this.moveAwayFromPlayer(this.most_recent_notification, false);
					
					delete this.walkNotAllowed;
				}
				else {
					this.logDebugInfo(" can't play walk anim (in butler data)");
					this.walkNotAllowed = true;
					this.dismisser = this.most_recent_notification;
					//this.chooseWalk(); // reset this
				}
			}
		}
		/*else {
			return false;
			//this.sendIM(owner, this.getTextString("farCommandTellFail", pc, owner)); 
		}*/
		
		apiLogAction('BUTLER_ZOMBIE', 'pc='+pc.tsid, 'butler='+this.tsid);
		return true;
	}
	else if (far && jumpRe.exec(txt) || /^\s*j\s*($|\s+)/i.exec(txt)) {
	
		if (this.getCurrentAnim() === "jump") {
			this.sendIM(pc, this.getTextString("alreadyDoingIt", pc, owner));
		}
		else if (this.canPlayAnim("jump", false, 1700)) {
			this.playAnim("jump", false, 1700);
			
			if (this.textAddition) { 
				this.sendIM(pc, this.textAddition);
				delete this.textAddition;
			}
			else { 
				this.sendIM(pc,  this.getTextString("farCommandJumpSuccess", pc, owner));
			}
		}
		else {
			if (this.textAddition) { 
				this.sendIM(pc, this.getTextString("helpJumpFail", pc, owner));
				delete this.textAddition;
			}
			else { 
				this.sendIM(pc, this.getTextString("jumpFail", pc, owner)); 
			}
		}
		apiLogAction('BUTLER_JUMP', 'pc='+pc.tsid, 'butler='+this.tsid);
		return true;
	}
	else if (far && helpRe.exec(txt)) {
		this.sendIM(pc, this.getHelpText(pc)); 
		this.waiting_for_response.list[pc.tsid] = {which:"help", pc:pc, time:current_gametime()};
		return true;
	}
	/*else {
		this.sendIM(pc, this.getTextString("farCommandBad", pc, owner)); 
		return false;
	}*/
	
	return false;
}

// Parse teach commands since they are annoying and complicated
function parseTeach(pc, txt, teachResponse) {

	var owner = this.getOwner();

	this.logDebugInfo(" parsing for teach: "+txt+" with teachResponse "+teachResponse);
	
	if (teachResponse) { 
		var teachInfoRe =  /^\s*info\s*/i ;
		var teachStrangerRe = /^\s*(greeting\s+for)?\bstranger\b/i;
		var teachFriendRe = /^\s*(greeting\s+for)?\bfriend\b/i;
		var teachOwnerRe = /^\s*(greeting\s+for)?\s*\b(owner)\b/i;
		var teachMeRe = /^\s*(greeting\s+for)?\s*\bme\b/i; 
		var teachIdleRe = /^\s*(bored|idle|comment|random)\s*/i;
		var teachRe = /^\s*teach\s*$/i;
	}
	else {
		var teachInfoRe = /^(teach|t)\b.*info\b/i;
		var teachStrangerRe = /^(teach|t)\b.*stranger\b/i;
		var teachFriendRe = /^(teach|t)\b.*friend\b/i;
		var teachOwnerRe = /^(teach|t)\b.*(owner)\b/i;
		var teachMeRe = /^(teach|t)\b.*(greeting\s)?\s*\bme/i; 
		var teachIdleRe = /^(teach|t)\b.*(bored|idle|comment|random)\b/i;
		var teachRe = /^\s*\bteach\b\s*$/i;
	}
	
	// I would like to handle cases like:
	// "teach stranger greeting Hello" but 
	// I can't find a way of building a regex that would handle that and also 
	// "teach greeting for stranger Hello" and "teach stranger Hello" 
	// So for now we will just require the greeting to be entered separately in all cases except 
	// "teach info"
	
	if (teachInfoRe.exec(txt)) {
		var info = txt.replace(teachInfoRe, "");
		
		if (!info) {
			this.sendIM(pc, this.getTextString("teachInfoWhat", pc, owner)); 
			this.waiting_for_response.list[pc.tsid] = {which: "info", pc:pc, time:current_gametime()};
		}
		else {
			this.onTeach(pc, info, "info");
		}
		return true;
	}
	else if (teachOwnerRe.exec(txt) || teachMeRe.exec(txt)) {
		
		this.logDebugInfo("setting waiting_for_response to owner_greeting " +txt);
		this.logDebugInfo("teachOwnerRe is "+teachOwnerRe.exec(txt));
		this.logDebugInfo("teachMeRe is "+teachMeRe.exec(txt));
		
		this.sendIM(pc, this.getTextString("teachGreetingWhat", pc, owner)); 
		this.waiting_for_response.list[pc.tsid] = {which:"owner_greeting", pc:pc, time:current_gametime()};
		
		return true;
	}
	else if (teachFriendRe.exec(txt)) {
		
		this.sendIM(pc, this.getTextString("teachGreetingWhat", pc, owner)); 
		this.waiting_for_response.list[pc.tsid] = {which:"friend_greeting", pc:pc, time:current_gametime()};
		
		return true;
	}
	else if (teachStrangerRe.exec(txt)) {
		this.sendIM(pc, this.getTextString("teachGreetingWhat", pc, owner)); 
		this.waiting_for_response.list[pc.tsid] = {which:"stranger_greeting", pc:pc, time:current_gametime()};
		
		return true;
	}
	else if (teachIdleRe.exec(txt)) {
		this.sendIM(pc, "What should I say?");
		this.waiting_for_response.list[pc.tsid] = {which:"idle_comment", pc:pc, time:current_gametime()};
		
		return true;
	}
	else if (teachRe.exec(txt) || /^\s*t\s*$/i.exec(txt)) { 
		this.sendIM(pc, this.getTextString("teachWhat", pc, owner)); 
		this.waiting_for_response.list[pc.tsid] = {which:"teach_which", pc:pc, time:current_gametime()};
		return true;
	}
	
	return false;
}

// Works out the index for each of the current body parts in the options array
function setBodyConfig() {
	if (this.bodyConfig) { return; }

	this.bodyConfig = {};
	
	var skulls = this.instancePropsChoices["skull"];
	var head = this.getInstanceProp("skull");
	
	this.bodyConfig.skull = skulls.indexOf(head);
	
	var faces = this.instancePropsChoices["face"];
	var face = this.getInstanceProp("face");
	
	this.bodyConfig.face = faces.indexOf(face);
	
	var necks = this.instancePropsChoices["accessory"];
	var neck = this.getInstanceProp("accessory");
	
	this.bodyConfig.accessory = necks.indexOf(neck);
	
	var bodies = this.instancePropsChoices["bod"];
	var body = this.getInstanceProp("bod");
	
	this.bodyConfig.bod = bodies.indexOf(body);
	
	var cLegs = this.instancePropsChoices["closeLeg"];
	var cLeg = this.getInstanceProp("closeLeg");
	
	this.bodyConfig.closeLeg = cLegs.indexOf(cLeg);
	
	var fLegs = this.instancePropsChoices["farLeg"];
	var fLeg = this.getInstanceProp("farLeg");
	
	this.bodyConfig.farLeg = fLegs.indexOf(fLeg);
	
	var cArms = this.instancePropsChoices["closeArm"];
	var cArm = this.getInstanceProp("closeArm");
	
	this.bodyConfig.closeArm = cArms.indexOf(cArm);
	
	var fArms = this.instancePropsChoices["farArm"];
	var fArm = this.getInstanceProp("farArm");
	
	this.bodyConfig.farArm = fArms.indexOf(fArm);
}

function cycleBodyPart(which) {
	this.setBodyConfig();
	this.bodyConfig[which] ++;
		
	if (this.bodyConfig[which] >= this.instancePropsChoices[which].length) {
		this.bodyConfig[which] = 0;
	}
		
	this.setInstanceProp(which, this.instancePropsChoices[which][this.bodyConfig[which]]);
	this.config[which] = this.instancePropsChoices[which][this.bodyConfig[which]];
	this.broadcastConfig();
}


// Change an individual body part
function parseChange(pc, txt) {
	var owner = this.getOwner();

	var headRe = /head/i;
	var faceRe = /face/i;
	var neckRe = /(collar|accessory|scarf|tie|necklace|neck|bow|bowtie)\s*(tie)?/i;
	var bodyRe = /body|torso/i
	var farLegRe = /far\s+leg/i;
	var nearLegRe = /close\s+leg/i;
	var nearArmRe = /close\s+arm/i;
	var farArmRe = /far\s+arm/i;
	
	if (headRe.exec(txt)) {
		this.cycleBodyPart("skull");
	}
	else if (faceRe.exec(txt)) {
		this.cycleBodyPart("face");
	}
	else if (neckRe.exec(txt)) {
		this.cycleBodyPart("accessory");
	}
	else if (bodyRe.exec(txt)) {
		this.cycleBodyPart("bod");
	}
	else if (farLegRe.exec(txt)) {
		this.cycleBodyPart("farLeg");
	}
	else if (nearLegRe.exec(txt)) {
		this.cycleBodyPart("closeLeg");
	}
	else if (farArmRe.exec(txt)) {
		this.cycleBodyPart("farArm");
	}
	else if (nearArmRe.exec(txt)) {
		this.cycleBodyPart("closeArm");
	}
	else {
		this.waiting_for_response.list[pc.tsid] = {which:"change", pc:pc, time:current_gametime()};
		this.sendIM(pc, this.getTextString("changeWhat", pc, owner)); 
		return true;
	}
	
	return false;
}

// Process a suggestion that the butler made to the player, such as "Would you like to see your messages now?"
// The txt string is the response, which should be either an affirmative or negative answer.
function processSuggestion(pc, txt) {
	this.logDebugInfo(" got response to "+this.waiting_for_response.list[pc.tsid].which+" of "+txt);

	var owner = this.getOwner();
	
	if (this.parseAffirmative(txt)) {
		// need to figure out which suggestion we made
		if (this.waiting_for_response.list[pc.tsid].which === "suggestion-help") {
			delete this.waiting_for_response.list[pc.tsid];
			this.getHelpText(pc);
		}
		else if (this.waiting_for_response.list[pc.tsid].which === "suggestion-visitors") {
			delete this.waiting_for_response.list[pc.tsid];
			this.getVisitorsToday(pc);
		}
		else if (this.waiting_for_response.list[pc.tsid].which === "suggestion-packages") {
			delete this.waiting_for_response.list[pc.tsid];
			this.stateChange("packages", "done"); // has to be "done" in order to override greeting state
		}
		else if (this.waiting_for_response.list[pc.tsid].which === "suggestion-messages") {
			delete this.waiting_for_response.list[pc.tsid];
			this.onRetrieveMessages(pc);
		}
		else {
			this.sendIM(pc, this.getTextString("suggestionUnknownResponse", pc, owner)); 
			log.error(this.getLabel()+" has unknown suggestion "+this.waiting_for_response.list[pc.tsid]);
			delete this.waiting_for_response.list[pc.tsid];
		}
	}
	else if (this.parseNegative(txt)) {
		this.sendIM(pc, this.getTextString("suggestionResponseNo", pc, owner)); 
		delete this.waiting_for_response.list[pc.tsid];
		return;
	}
	else {
		this.sendIM(pc, this.getTextString("yesNoBad", pc, owner)); 
		//this.waiting_for_response.list[pc.tsid]  = {which:"suggestion-help", pc:pc, time:current_gametime()};
	}
}

// return true if the txt contains an affirmative answer
function parseAffirmative(txt) { 
	if (/(yes|yeah|yeh|yah|yup|yep|sure|ok|please|aye|affirmative)/i.exec(txt)) {
		return true;
	}
	else if (/^\s*y\s*$/i.exec(txt)) {
		return true;
	}
	else if (/^\s*if\s+you\s+don't\s+mind$/i.exec(txt)) {
		return true;
	}
	else if (/\s*if\s+you\s+would\s+be\s+so\s+kind/i.exec(txt)) {
		return true;
	}
	else if (/\s*why\s+not/i.exec(txt)) {
		return true;
	}
	else if (/\s*uh\s+huh/i.exec(txt)) {
		return true;
	}
	else if (/\s*go\s+ahead/i.exec(txt)) {
		return true;
	}
	
	return false;
}

// return true if the txt contains a negative answer
function parseNegative(txt) {
	if (this.parseAffirmative(txt)) { 
		return false; // otherwise the "why not" case matches as negative  
	}

	if (/\b(no|not|nay|never|nope|nada|decline|negative|quit|cancel|reject|stop|don't)\b/i.exec(txt)) {
		return true;
	}
	else if (/^\s*n\s*$/i.exec(txt)) { 
		return true;
	}
	
	return false;
}

// Return true if the txt contains a response that indicates a desire to quit out of the current command
function parseQuit(txt) {
	if (/^\s*(quit|escape|cancel|esc|stop|don't)/i.exec(txt)) { 
		return true;
	}
	else if (/^\s*q\s*$/i.exec(txt)) {
		return true;
	}
	else if (/^\s*never\s+mind\s*$/i.exec(txt)) {
		return true;
	}
	else if (/^\s*cut\s+it\s+out\s*$/i.exec(txt)) { 
		return true;
	}
	
	return false;
}

function parseResume(txt) { 
	if (/^\s*(resume|start)/i.exec(txt)) {
		return true;
	}
	else if (/^\s*r\s*$/i.exec(txt)) {
		return true;
	}
	else if (/^\s*notify\s+me\s*$/i.exec(txt)) { 
		return true;
	}

	return false;
}
	
// This processes IM or local chat commands from players
function doCommand(pc, txt) {
	var owner = this.getOwner();
	
	var announcement = this.announce_flag;
	this.announce_flag = false;
	
	var waiting_for_response = this.waiting_for_response.list[pc.tsid];
	
	//this.logDebugInfo("Text addition is "+this.textAddition+" and waiting_for_response is "+waiting_for_response);
	
	if (waiting_for_response && waiting_for_response.pc === pc) {
		this.logDebugInfo(" parsing response to "+ waiting_for_response);
	
		/*if (this.parseQuit(txt)) {
			this.logDebugInfo(" quit command "+txt);
			//if (waiting_for_response.which === "help") {
			//	this.sendIM(pc, this.getTextString("helpQuit", pc)); 
			//}
			//else  {
				this.sendIM(pc, this.getTextString("otherQuit", pc)); 
			//}
			delete this.waiting_for_response.list[pc.tsid];
			return;
		}
		else*/ if (waiting_for_response.which === "leave_package") {
			if (this.parseNegative(txt)) {
				this.sendIM(pc, this.getTextString("packageNo", pc)); 
			}
			else if (this.parseAffirmative(txt)){
				this.onLeavePackage(pc, waiting_for_response.msg);
			}
			else {
				this.sendIM(pc, this.getTextString("yesNoBad", pc));
				return;
			}
			
			delete this.waiting_for_response.list[pc.tsid];
			return;
		}
		else if (waiting_for_response.which === "leave_message") { 
			delete this.waiting_for_response.list[pc.tsid];
			
			if (this.parseNegative(txt)) {
				this.sendIM(pc, this.getTextString("messageNo", pc)); 
			}
			else if (this.parseAffirmative(txt)){	
				this.sendIM(pc, this.getTextString("messageYes", pc)); 
				this.waiting_for_response.list[pc.tsid] = {which:"message", pc:pc, time:current_gametime()};
				this.logDebugInfo(" waiting is "+this.waiting_for_response.list[pc.tsid]);
			}
			else {
				this.sendIM(pc, this.getTextString("messageBad", pc)); 
			}
			return;
		}
		else if (waiting_for_response.which === "visitor_gift") { 
			if (this.parseNegative(txt)) {
				this.sendIM(pc, this.getTextString("visitorGiftNo", pc)); 
			}
			else if (this.parseAffirmative(txt)) {
				this.onLeaveVisitorGift(pc, waiting_for_response.msg);
			}
			else { 
				this.sendIM(pc, this.getTextString("yesNoBad", pc));
				return;
			}
			
			delete this.waiting_for_response.list[pc.tsid];
			
			return;
		}
		else if (waiting_for_response.which === "name") {
			//log.info(this.getLabel()+" recording name "+txt);
			this.onName(pc, txt);
			delete this.waiting_for_response.list[pc.tsid];
			return;
		}
		else if (waiting_for_response.which === "message") {
			//log.info(this.getLabel()+" taking message "+txt);
			this.takeMessage(pc, txt);
			delete this.waiting_for_response.list[pc.tsid];
			return;
		}
		else if (waiting_for_response.which === "change") {
			//log.info(this.getLabel()+" changing "+txt);
			this.parseChange(pc, txt);
			delete this.waiting_for_response.list[pc.tsid];
			return;
		}
		else if (waiting_for_response.which === "help") {
			this.textAddition = this.showCommandHelp(pc, txt);
			//this.logDebugInfo(" showing help "+txt+"  and text addition is "+this.textAddition);	
			delete this.waiting_for_response.list[pc.tsid];
		}
		else if (/suggestion-/i.exec(waiting_for_response.which)) {
			this.logDebugInfo(" got answer to suggestion: "+txt);
			this.processSuggestion(pc, txt);
			return;
		}
		else if (waiting_for_response.which === "teach_which") {
			this.logDebugInfo(" waiting for response "+ waiting_for_response);
			delete this.waiting_for_response.list[pc.tsid]; // MUST do this before parseTeach, since parseTeach creates another waiting_for_response structure
			this.parseTeach(pc, txt, true);
			return;
		}
		else { // greeting
			this.logDebugInfo(" learning greeting type "+this.waiting_for_response.which);
			this.onTeach(pc, txt, waiting_for_response.which);
			delete this.waiting_for_response.list[pc.tsid];
			return;
		}
	}
	
	
	var whatRe = /^\s*what's\s+your\s+name/i;
	var nameRe = /.*name\b(\s+to)?/i;
	var danceRe = /dance\b\s*(?!fast).*/i;
	var visitRe = /(visit|lead\s+me|take\s+me\s+to|where\s+is)/i;
	var messageRe = /message/i;
	var packageRe = /(package|gift)/i;
	var mailRe = /mail/i;
	var chatRe = /(chat|talk|converse|joke)/i;
	var infoRe = /info/i;
	var comeRe = /(come|summon)/i;
	var nothingRe = /nothing/i;
	var anythingRe = /don't.*anything/i;
	var awayRe = /go\s+away/i;
	var botherRe = /(don\'t|stop)\s+bother.+me/i;
	var aloneRe = /leave\s+me\s+alone/i;
	var thanksRe = /(thanks|thank you|ty|tyvm)/i;
	var visitorsRe = /(visitor|visited)/i;
	var hiRe = /\b(hi|hello|hey)\b/i;
	var helpWithThatRe = /help\s*.*with\sthat/i
	var helpRe = /\b(help|commands)\b\s*/i;
	var randomRe = /(customize|customise|randomize|randomise)/i;
	var changeRe = /change/i;
	var zombieRe = /zombie/i;
	var jumpRe = /jump/i;
	var debugRe = /debug/i;
	var nextRe = /next/i;
	var stepBackRe =/(step\s+back|back\s+off|step\s+away|step\s+off|get\s+off|get\s+away|get\s+out)/i;
	var fasterRe = /fast/i;
	var zorkRe = /^\s*(zork|plugh)\s*$/i;
	var hintsRe = /hint/i;
	var infoRe = /(?:(?:how\s+do\s+i\s+find)|(?:how\s+do\s+i\s+get)|(?:where\s+is)|(?:where\s+are)|(?:location\s+of)|(?:tell\s+me\s+about)|(?:I\s+want\s+to\s+know\s+about)|(?:what\s+is)|(?:where\s+can\s+I\s+get)|(?:where\s+can\s+I\s+find)|(?:where\s+do\s+I\s+go\s+to\s+get)|(?:where\s+do\s+I\s+go\s+to\s+buy)|(?:where\s+can\s+I\s+buy)|(?:where\s+do\s+I\s+buy))\s*(?:(?:an|a|some|one|the)?)\s*(\w+)(.*)/i;
	
	this.logDebugInfo(" doing command ["+txt+"] for "+pc);
	
	if (hintsRe.exec(txt)) { 
		this.sendIM(pc, this.getTextString("hints", pc, owner));
		apiLogAction("BUTLER_HINTS", "pc="+pc.tsid, "butler="+this.tsid);
		return;
	}
	else if (infoRe.exec(txt)) {
		var subject = infoRe.exec(txt)["1"];
		if (/you/i.exec(subject)) {
			this.sendIM(pc, this.getTextString("here"));
		}
		else { 
			this.sendIM(pc, this.getTextString("infoMode", pc, owner, null, null, subject));
		}
		apiLogAction("BUTLER_INFO", "pc="+pc.tsid, "butler="+this.tsid);
		return;
	}
	else if (helpWithThatRe.exec(txt)) {
		// this is more or less a joke case, but why not handle it?
		// it has to go before helpRe or it will be matched by that.
		this.sendIM(pc, this.getTextString("helpWithThatResponse", pc)); 
		apiLogAction('BUTLER_HELP_WITH_THAT', 'pc='+pc.tsid, 'butler='+this.tsid, "txt="+txt);
		return;
	}
	else if (helpRe.exec(txt) || /^\s*(h|\?)\s*$/i.exec(txt)) {
		//log.info(this.getLabel()+" matched the 'h' case");
		var command = txt.replace(helpRe, "");
		if (command === "") {
			log.info(this.getLabel()+"  matched 'h' case with "+command);
			this.sendIM(pc, this.getHelpText(pc));
			this.waiting_for_response.list[pc.tsid] = {which:"help", pc:pc, time:current_gametime()};
		}
		else if (txt.replace(/^\s*(h|\?)\s*$/i, "") === "") {
			log.info(this.getLabel()+"  matched 'h' case with "+txt.replace(/^\s*(\?|h)\s*$/i, ""));
			this.sendIM(pc, this.getHelpText(pc));
			this.waiting_for_response.list[pc.tsid] = {which:"help", pc:pc, time:current_gametime()};
		}
		else {
			log.info(this.getLabel()+"  matched command help case with "+command);
			this.textAddition = this.showCommandHelp(pc, command);
			this.doCommand(pc, command);
		}
		apiLogAction('BUTLER_HELP', 'pc='+pc.tsid, 'butler='+this.tsid, "txt="+txt);
		return;
	}
	else if (/^\s*(h|\?)\s+/i.exec(txt)) {
		var command = txt.replace(/^\s*(h|\?)\s+/i, "");
		log.info(this.getLabel()+ " matched the 'h v' case: "+command);
		this.textAddition = this.showCommandHelp(pc, command);
		this.doCommand(pc, command);
		
		apiLogAction('BUTLER_HELP', 'pc='+pc.tsid, 'mbutler='+this.tsid, "txt="+txt);
		return;
	}
	
	//if (pc.location != this.container) { 
	// try to do a far command, if it's not one, then continue on:
	if (this.doFarCommand(pc, txt)) { return; }
	//}
	
	var far = (pc.location != this.container);
	
	if (debugRe.exec(txt) && pc.is_god) {
		this.debugging = !this.debugging;
		if (this.debugging) {
			this.sendIM(pc, this.getTextString("debugOn", pc, owner)); 
			this.target_pc = pc;
		}
		else {
			this.sendIM(pc, this.getTextString("debugOff", pc, owner)); 
			this.target_pc = null;
		}
		return;
	}
	else if (!far && (stepBackRe.exec(txt) || /^\s*s\s*($|\s+)/i.exec(txt))) {
		if (!this.stepBackFromPlayer(pc, pc.x)) { 
			if (this.textAddition) { 
				this.sendIM(pc, this.getTextString("stepFail", pc, owner) + this.getTextString("helpStepFail", pc, owner));
				delete this.textAddition;
			}
			else { 
				this.sendIM(pc, this.getTextString("stepFail", pc, owner)); 
			}
		}
		return;
	}
	else if (fasterRe.exec(txt)) { 
		if (this.getCurrentState() === "dancing") {
			if (this.getCurrentAnim() === "dance") {
				this.playAnim("fastDance", true);
			}
			else if (this.getCurrentAnim() === "fastDance") {
				this.playAnim("fall",  false, 5633);
			}
		}
		else {
			this.sendIM(pc, this.getTextString("fasterFailList"));
		}
		return;
	}
	else if (danceRe.exec(txt) || /^\s*d\s*($|\s+)/i.exec(txt)) {
		//log.info(this.getLabel()+" changing to state dance");
		if (!this.stateChange("dancing", "start")) {
			var anim = this.getCurrentAnim();
			var state = this.getCurrentState();
			this.logDebugInfo(" dance fail, anim is "+anim+" and state is "+state);
			if ((anim === "danceStart" || anim === "dance" || anim === "fastDance")  && state === "dancing") { 
				this.sendIM(pc, this.getTextString("alreadyDancing", pc)); 
			}
			else { 
				if (this.textAddition) { 
					this.sendIM(pc, this.getTextString("danceFail", pc) + this.getTextString("helpDanceFail", pc));
					delete this.textAddition;
				}
				else { 
					this.sendIM(pc, this.getTextString("danceFail", pc));
				}
			}
			
			delete this.textAddition; // error case?
		}
		else { 
			this.logDebugInfo("dance success, text addition is "+this.textAddition);
			this.danceMaster = pc;
			if (this.textAddition) { 
				this.sendIM(pc, this.textAddition);
				delete this.textAddition;
			}
		}
		
		apiLogAction('BUTLER_DANCE', 'pc='+pc.tsid, 'butler='+this.tsid);
		return;
	}
	else if (thanksRe.exec(txt)) {
		this.sendIM(pc, this.getTextString("thanksResponse", pc, owner)); 
		apiLogAction('BUTLER_THANKS', 'pc='+pc.tsid, 'butler='+this.tsid);

		return;
	}
	else if (whatRe.exec(txt)) {
			this.sendIM(pc, this.getTextString("nameResponse", pc)); 
			return;
	}
	else if (comeRe.exec(txt) || /^\s*c\s*$/i.exec(txt)) {
		var success = true;
		if (!this.approachPlayer(pc)) {
			this.sendIM(pc, this.getTextString("summonFail", pc, owner));
			success = false;
		}
		else { 
		}
		
		apiLogAction('BUTLER_COME', 'pc='+pc.tsid, 'butler='+this.tsid, 'success='+success);
		return;
	}
	else if (!far && (zombieRe.exec(txt) || /^\s*z\s*($|\s+)/i.exec(txt))) {
		this.sendBubbleAndChat(pc, "braains");
			
		if (!pc.butlers_zombied_today) { 
			pc.butlers_zombied_today = {};
		}
			
		if (pc.butlers_zombied_today[this.tsid]) { 
			pc.butlers_zombied_today[this.tsid] ++;
		}
		else { 
			pc.butlers_zombied_today[this.tsid] = 1;
		}
			
		pc.quests_set_counter('butlers_zombied', num_keys(pc.butlers_zombied_today));
			
			
		if (this.textAddition) { 
			this.sendIM(pc, this.textAddition);
			delete this.textAddition;
		}
			
		if (this.stateChange("move_away", "start")) { 
			this['!walk_anim'] = "walk3";
			if (this.canPlayAnim(this['!walk_anim'], true)) {
				this.moveAwayFromPlayer(pc, false);
					
				delete this.walkNotAllowed;
			}
			else {
				this.logDebugInfo(" can't play walk anim (in butler data)");
				this.walkNotAllowed = true;
				this.dismisser = pc;
				//this.chooseWalk(); // reset this
			}
		}
		apiLogAction('BUTLER_ZOMBIE', 'pc='+pc.tsid, 'butler='+this.tsid);
		return;
	}
	else if (jumpRe.exec(txt) || /^\s*j\s*($|\s+)/i.exec(txt)) {
		if (this.getCurrentAnim() === "jump") {
			this.sendIM(pc, this.getTextString("alreadyDoingIt", pc, owner));
		}
		else if (this.canPlayAnim("jump", false, 1700)) {
			this.playAnim("jump", false, 1700);
			if (this.textAddition) { 
				this.sendIM(pc, this.textAddition);
				delete this.textAddition;
			}
		}
		else {
			if (this.textAddition) { 
				this.sendIM(pc, this.getTextString("helpJumpFail", pc, owner));
				delete this.textAddition;
			}
			else { 
				this.sendIM(pc, this.getTextString("jumpFail", pc, owner)); 
			}
		}
		apiLogAction('BUTLER_JUMP', 'pc='+pc.tsid, 'butler='+this.tsid);
		return;
	}
	/*else if (txt === "LEFT") {
		this.stateChange("walkleft", "start");
		apiLogAction('BUTLER_LEFT', 'pc='+pc.tsid, 'butler='+this.tsid);
		return;
	}
	else if (txt === "RIGHT") {
		this.stateChange("walkright", "start");
		apiLogAction('BUTLER_RIGHT', 'pc='+pc.tsid, 'butler='+this.tsid);
		return;
	}*/
	else if (!far && (nothingRe.exec(txt) || anythingRe.exec(txt) || aloneRe.exec(txt) || awayRe.exec(txt) || botherRe.exec(txt) || /^\s*g\s*($|\s+)/i.exec(txt))) {
		//this.sendIM(pc, "If you need me, just ask me to 'come here'.");
		if (pc && pc.location == this.container) {
			this.chooseWalk();
			
			if (this.stateChange("move_away", "start")) {
			
				if (this.canPlayAnim(this['!walk_anim'], true)) {
					this.moveAwayFromPlayer(pc, true);
					// Check that it actually worked. (Failure if can't find a path to target)
					
					if (this.getCurrentState() === "move_away") { 
						if (this.textAddition) { 
							this.sendIM(pc, this.getTextString("goAwaySucceed", pc, owner) + this.textAddition);
							delete this.textAddition;
						}
						else { 
							this.sendIM(pc, this.getTextString("goAwaySucceed", pc, owner));
						}
					}
					delete this.walkNotAllowed;
				}
				else {
					this.sendIM(pc, this.getTextString("waitASec", pc, owner));
					this.dismisser = pc;
					this.walkNotAllowed = true;
				}
			}
			else { 
				this.sendIM(pc, this.getTextString("goAwayFail", pc, owner));
			}
		}
		apiLogAction('BUTLER_NOTHING', 'pc='+pc.tsid, 'butler='+this.tsid);
		return;
	}
	else if (announcement) {
			this.doFarCommand(pc, "a "+txt);
			return;
	}
	else if (/\bdick\b/i.exec(txt)) { 
		this.sendIM(pc, this.getTextString("dickResponse", pc, owner));
		apiLogAction('BUTLER_DICK', 'pc='+pc.tsid, 'butler='+this.tsid);
		return;
	}
	else if (/(\bfuck\b|\bshit|\bcunt\b|\bbugger\b|\bass|\barse|\bcrap)/i.exec(txt)) { 
		this.sendIM(pc, this.getTextString("swearResponseList", pc, owner));
		apiLogAction('BUTLER_SWEAR', 'pc='+pc.tsid, 'butler='+this.tsid);
		return;
	}
	else if (/^\bwhy\b\?*/i.exec(txt)) { 
		this.sendIM(pc, this.getTextString("whyResponse", pc, owner));
		apiLogAction('BUTLER_WHY', 'pc='+pc.tsid, 'butler='+this.tsid);
		return;
	}
	else if (/\bdid\b\s*you\b\s*do\b\s*it\b/i.exec(txt)) { 
		this.sendIM(pc, this.getTextString("didYouDoItResponse", pc, owner));
		apiLogAction('BUTLER_DOIT', 'pc='+pc.tsid, 'butler='+this.tsid);
		return;
	}
	else if (hiRe.exec(txt)) {
		this.sendIM(pc, this.getTextString("hiResponse", pc, owner)); 
		apiLogAction('BUTLER_HI', 'pc='+pc.tsid, 'butler='+this.tsid);
		return;
	}
	else if (zorkRe.exec(txt)) {
		this.sendIM(pc, this.getTextString("zorkResponseList", pc, owner));
		apiLogAction("BUTLER_ZORK", "pc="+pc.tsid, "butler="+this.tsid);
		return;
	}
	else {
		this.logDebugInfo("calling matchInput for "+txt);
		var response = this.matchInput(txt);
		if (response) {
			apiLogAction("BUTLER_RESPONSE", "pc="+pc.tsid, "butler="+this.tsid, "text="+txt, "response="+response);
			this.sendIM(pc, response);
			return;
		}
		else {
			apiLogAction('BUTLER_OTHER', 'pc='+pc.tsid, 'butler='+this.tsid, 'txt='+txt);
			this.sendIM(pc, this.getTextString("unknownResponse", pc, owner)); 
			//this.onTalkTo(pc);
			return;
		}
	}	
}

//////////////////////////////////////////////////////
// Build convos
//////////////////////////////////////////////////////

var alphy = [
	/*[ { txt: "So the other day, a piggy walked into a bar.", choices: [{txt:"The only bar I know of is the Hell Bar. So it was a dead piggy?", value:"ok"}] },
	  { txt: "I guess. But it doesn't matter!", choices: [{txt: "Ok, ok. Go on.", value:"ok"}] },
	  { txt: "So the piggy says to the bartender 'I think you set your bar too high!'", choices: [{txt:"How come dead piggies don't come back to life the way Glitchen do?", value:"ok"}] },
	  { txt: "TOO HIGH. The piggy walked into the bar because piggies are SHORT and the bar was TOO HIGH.", choices: [{txt:"Ok, ok, I get it already.", value:"ok"}] },
	  { txt: "Then why aren't you laughing? You have no sense of humour!", choices:[{txt: "I guess not."}] },
	],*/
	[ { txt: "So the other day, a piggy walked into a bar.", choises:[{txt:"Ouch."}] },
	  { txt: "And the piggy says to the bartender, 'I think you set your bar too high!'", choices: [{txt:"Wait, what?"}] },
	  { txt: "TOO HIGH. The piggy walked into the bar because piggies are SHORT and the bar was TOO HIGH.", choices: [{txt:"Ok, ok, I get it already.", value:"ok"}] },
	  { txt: "Then why aren't you laughing? You have no sense of humour!", choices:[{txt: "I guess not."}] },
	],
	[ { txt: "Why did the chicken cross the road?", choices: [{txt: "I don't know. What's a road?", value: "ok"}] },
	  { txt: "To get to the chicken stick! HA HA HA!", choices: [{txt: "Ha ha?", value: "ok"}] },
	],
	[ { txt: "What did the Glitchmas Yeti say when he found a house with three Patches?", choices: [{txt: "What?", value: "ok"}] }, 
	  { txt: "Hoe, hoe, hoe! LOL!", choices: [{txt: "Very funny.", value:"ok"}] },
	],
	[ { txt: "Why did the bureaucrat cross the road?", choices: [{txt: "Why?", value: "ok"}] },
	  { txt: "Because he had the correct permit, filled out in triplicate. HEE HEE HEE!", choices: [{txt: "Um...", value:"ok"}] },
	],
	[ { txt: "Why did the Glitch not buy a meditation device?", choices: [{txt: "Why not?", value: "ok"}] },
	  { txt: "Because he orb-ready had one. HA HA", choices: [{txt: "Ha. I guess.", value:"ok"}] },
    ],
	[ { txt: "What did the Sparkly in Ajaya Bliss say?", choices: [{txt: "What?", value: "ok"}] },
	  { txt: "Hey! Why's everyone picking on me?!?", choices: [{txt: "Ha ha!", value: "ok"}] },
	],
	[ { txt: "Why should you swap a Bean for a Cubimal if you get the chance?", choices: [{txt: "Why?", value:"ok"}] },
	  { txt: "Because it would be Rube not to.", choices: [{txt: "...Thanks.", value:"ok"}] },
	],
	[ { txt: "What do giant devotees prefer to drink with breakfast?", choices: [{txt: "What?", value:"ok"}] },
	  { txt: "A nice cup of Tii. ROFL!", choices: [{txt: "...lol.", value:"ok"}] },
	],
	[ { txt: "Why do philosophy students study Dirt Piles?", choices: [{txt: "Why?", value:"ok"}] },
	  { txt: "Because Loam is where Descartes is. LOL LOL LOL", choices: [{txt: "I think that's actually the worst joke I've ever heard", value:"ok"}] },
	],
	[ { txt: "Why is the novice chef's food so bad?", choices: [{txt: "Why?", value:"ok"}] },
	  { txt: "He keeps making a Hash of it.", choices: [{txt: "Very funny.", value:"ok"}] },
	], 
	[ { txt: "Why was the Glitch happy to see a ghost?", choices: [{txt: "Why?", value:"ok"}] },
	  { txt: "It raised her spirits. HEE HEE HEE!", choices: [{txt: "Um...", value:"ok"}] },
	],
	[ { txt: "Why did the Glitch refuse to visit Newcot Close?", choices: [{txt:"Why?", value:"ok"}] },
	  {	txt: "He had a fear of Heights. HA HA HA", choices: [{txt:"Ha. I guess.", value:"ok"}] },
	]
	
];


function buildPrefix(personality) {
	var options = alphy; // to do - add the other personality modules
	
	var choice = randInt(0, options.length - 1);
	
	this.prefix_choice = choice;
	
	if (choice >= options.length) {
		log.error(this.getLabel()+" conversation start empty");
		return [];
	}
	else {
		//log.info(this.getLabel()+" conversation start "+options[choice]);
		return options[choice];
	}
}

/*
	personality: Alphy, Cosmalite, Tiian, Friendish 
	pc_type: owner, stranger, or friend
*/
	
function buildMiddle(personality, pc_type, pc) { 

	// This is going to be the hard part.
	// Need to grab user data and build conversation choices using it here.
	
	/*var convo = [{ txt: "Insert text here.", choices: [{txt: "Oh really?", value: "ok"}] },
			{ txt: "Yes, I will be so intelligent when we're done!", choices: [{txt: "You're right!", value:"ok"}] },
			];
	
	log.info(this.getLabel()+" conversation middle "+convo);
	
	
	return convo; */
	
	return [];
}

function buildPostscript(personality) { 
	var options = alphy; // to do - add the other personality modules
	
	return [];
	
	/*var choice = randInt(0, options.length);
	
	// don't duplicate
	if (choice === this.prefix_choice) { choice ++; }
	
	if (choice >= options.length) { 
		log.info(this.getLabel()+" conversation end empty");
		return [];
	}
	else { 
		log.info(this.getLabel()+" conversation end "+options[choice]);
		return options[choice];
	}*/
}

function buildAndRunConvo(personality, pc_type, pc) {

	this.conversation = this.buildPrefix(personality).concat(this.buildMiddle(personality, pc_type, pc), this.buildPostscript(personality));
	this.convo_step = 0;
	
	if (!this.conversation || this.conversation.length <= 0) { 
		this.sendIM(pc, "I'm sorry. I can't seem to think of anything right now.");
		log.error(this.getLabel()+" failed to get conversation");
		return;
	}
	
	this.playTalk();
	this.timer = 4000;
	this.playAnim("talk", false, 3400);
	
	//log.info(this.getLabel() + " starting conversation "+this.conversation);
	this.conversation_start(pc, this.conversation[0].txt, this.conversation[0].choices);
}

function handleConversation(pc, msg) {

	//log.info(this.getLabel()+" in conversation, msg is "+msg);

	var choice = msg.choice;
	
	this.convo_step ++;
	if (this.convo_step < this.conversation.length) { 
		//log.info(this.getLabel()+" doing conversation step "+this.convo_step);
		var reply = this.conversation[this.convo_step];
		this.conversation_reply(pc, msg, reply.txt, reply.choices);
	}
	else { 
		//log.info(this.getLabel()+" convo end");
		this.setSpeakTime();
		this.conversation_end(pc, msg);
		this.stateChange("idle", "done");
		delete this.conversation;
		delete this.convo_step;
	}
}

function getNumPlayersInRange(range, x_pos) {
	if (!this.container) { return 0; }
	
	var players = this.container.activePlayers;
	
	if (!players) { return 0; }
	
	if (x_pos) { 
		var target = x_pos;
	}
	else {
		target = this.x;
	}
	
	var count = 0;
	
	for (var i in players) { 
		var pc = this.container.activePlayers[i];
		if (pc){
			if (Math.abs(target - pc.x) <= range && Math.abs(this.y - pc.y) <= 300){
				count ++;
			}
		}
	}
	
	return count;
}

function notifyOwner(pc, txt) { 
	var owner = this.getOwner();
	
	if (this.notifications === true || this.notifications == undefined) { 
		if (this.eavesdropping || this.eavesdropping === undefined) { 
	
			if (pc != owner && owner.isOnline() && (!this.isOwnerHome() || (this.ownerInsideHouse() || this.isOwnerInTower()) )) {
				var text = this.getTextString("visitorSpeechReport", pc, owner, null, null, txt);

				/*if (!this.notification_time 
				  || ((getTime()-this.notification_time) > 10 * 60 * 1000)) {
					text += this.getTextString("clickHelpAddition", pc, pc);
				}*/

				this.sendIM(owner, text); 
				this.notification_time = getTime();
				this.announce_flag = true;
				
				if (pc.is_god) { 
					this.logDebugInfo("got god pc, notifications list is "+this.eavesdropping_notifications);
					if (!this.eavesdropping_notifications) { 
						this.eavesdropping_notifications = apiNewOwnedDC(this);
					}
					
					if (!this.eavesdropping_notifications[pc.tsid]) { 
						this.eavesdropping_notifications[pc.tsid] = true;
						
						this.apiSetTimerMulti("sendBubbleAndChat", 1000, pc, this.getTextString("visitorSpeechNotification", pc, owner), true);
					}
				}
			}
		}
	}
}

function getPlayerInRange(range, x_pos) {
	//log.info(this.getLabel()+" container "+this.container);
	if (!this.container) { return null; }
	
	var players = this.container.activePlayers;
	//log.info(this.getLabel() +" players "+players);
	
	if (!players) { return null; }
	
	if (x_pos) { 
		var target = x_pos;
	}
	else {
		target = this.x;
	}
	
	var playersInRange = [];
	
	for (var i in players) { 
		var pc = this.container.activePlayers[i];
		//log.info(this.getLabel()+ " checking pc "+pc);
		if (pc){
			if (Math.abs(target - pc.x) <= range && Math.abs(this.y - pc.y) <= 300){
				playersInRange.push(pc);
			}
		}
	}
	
	if (playersInRange.length > 0) { 
		var which = randInt(0, playersInRange.length -1);
		return playersInRange[which];
	}
	
	return null;
}

// Merge gift items stacks
function mergeGifts() { 
	if (!this.gift_item) { return; }

	var class_id = this.gift_item["class"];
	var gift_count = this.gift_item["count"];
	
	this.logDebugInfo("merging: class is "+class_id+" and count is "+gift_count);
	var contents = this.findItemClass(class_id);
	
	var count = 0;
	for (var i in contents) { 
		 var stack = contents[i];
		 
		 this.logDebugInfo("got stack "+stack);
		 if (stack.class_id === class_id) { 
			count += stack.count;
			
			if (count <= gift_count) { 
				this.logDebugInfo("removing "+stack.tsid);
				var removed = this.removeItemStackTsid(stack.tsid);
				
				this.logDebugInfo("removed is "+removed);
				this.addItemStack(removed);
			}
		}
	}
}

// Remove old data to force conversion to the new data container structure.
function fixButler() {
	if (!config.is_dev) { return; }
	if (this.fixed_two) { return;}
	
	this.logDebugInfo("fixButler");
	
	var owner = this.getOwner();
	if (this.messages && !this.messages.list) { 
		this.sendIM(owner, "Liz changed the way the message list is stored, and I had to delete some data. It's possible you lost some messages. If so, I'm very sorry.");
		delete this.messages;
	}
	
	if (this.packages && !this.packages.list) { 
		this.sendIM(owner, "Liz changed the way the package list is stored, and I had to delete some data. It's possible you lost some packages. If so, I'm very sorry.");
		this.emptyBag();
		delete this.packages;
	}
	
	if (this.collisions && !this.collisions.list) { 
		delete this.collisions;
	}
	
	if (this.visitors && !this.visitors.list) { 
		log.info(this+" butler deleting visitors data");
		delete this.visitors;
	}
	
	this.fixed_two = true;
}

// This is a fix for butlers who have somehow taken packages but lost the package data. 
// After giving all the normal messages/packages, the butler will give any other items it has 
// with the message to the effect of "I have this for you, but I forgot who gave it to me."
function giveBrokenPackage() { 
	
	var owner = this.getOwner();
	var text = "";
	
	this.logDebugInfo(" checking for abandoned packages");
	
	var found_gift = false;
	
	//if (this.packages.list.length === 0) { 
		var contents = this.getContents();
	
		for (var i in contents) { 
			var it = contents[i];
			this.logDebugInfo(" got item "+it);
			
			if (!found_gift && it && this.gift_item && it.class_tsid === this.gift_item["class"] && it.count >= this.gift_item.count) {
				this.logDebugInfo(" got gift item, putting it back");
				found_gift = true; // gift must be a single item stack, so any further items are packages
				//this.addItemStack(stack, i);
				continue;
			}
			else if (it) { 
				var canGive = this.packageCanGive(owner, it);

				if (canGive === "no space") { 
					break;
				}
			
				if (canGive) { 
					var stack = this.removeItemStackSlot(i);
					this.logDebugInfo(" found broken package");
					text = this.getTextString("packagesBroken", owner, owner, null, null, pluralize(stack.count, stack.name_single, stack.name_plural));
					this.stack_to_give = stack;
					break;
				}
			}
		}
		
		this.logDebugInfo(" in giveBrokenPackage "+text);
		
		if (canGive === "no space") { 
			this.logDebugInfo("it.class_id is "+it.class_id+" and substr is "+it.class_id.indexOf("bag_"));
			if (it.class_id.indexOf("bag_") === 0) { 
				text = this.getTextString("packagesBrokenNoSpaceBag", owner, owner);
			}
			else { 
				text = this.getTextString("packagesBrokenNoSpace", owner, owner);
			}
			this.sendBubbleAndChat(owner, text, true, null, true);
			var conversation = [ { txt: text, choices: [{txt:"Ok", value:"packageNoSpace"}] }];

			this.convo_step = 0;
			this.playTalk();
			this.timer = 4000;
			this.playAnim("talk", false, 3400);

			this.conversation_start(owner, conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
		
			return; 
		}
		else if (text) { 
			this.sendBubbleAndChat(this.getOwner(), text, true, null, true);
			var conversation = [ { txt: text, choices: [{txt:"Thanks!", value:"acceptPackageBroken"}] }];

			this.convo_step = 0;
			this.playTalk();
			this.timer = 4000;
			this.playAnim("talk", false, 3400);

			this.conversation_start(this.getOwner(), conversation[0].txt, conversation[0].choices, null, null, null, {dont_take_camera_focus: true}, true);
		}
	//}
}

function displayMessagesAndPackages() {
	
	var output = this.getLabel()+" MESSAGES: ";
	
	if (this.messages) { 
		var messages = this.messages.list;
	
		for (var m in messages) { 
			output += (this.getLabel()+" message "+m+" is "+messages[m]);
		}
	}
	
	output += (this.getLabel()+" DONE MESSAGES  ");
	
	log.info(output);
	

	var output2 = this.getLabel()+" PACKAGES: ";
	
	if (this.packages) {
		var packages = this.packages.list;
		for (var p in packages) {
			output2 += (this.getLabel()+" package "+p+" is "+packages[p]);
		}
	}
	
	output2 += (this.getLabel()+" DONE PACKAGES  ");
	log.info(output2);
	
	return output + output2;
}

function displayVisitors() { 
	var visitors = this.visitors.list;
	
	var output = this.getLabel()+" VISITORS: ";
	
	for (var v in visitors) { 
		output += v + ":"+visitors[v]+" ";
	} 
	
	output += " END VISITORS ";
	
	log.info(output);
	
	return output;
}

function getVisitorsString() {
	return this.visitors.list.toString();
}

function getVisitorsKeys() { 
	return array_keys(this.visitors.list);
}

function deleteVisitorsData() { 
	delete this.visitors.list;
}

function breakPackages() {
	delete this.packages;
}

function clearHi() {
	this.hi_emote_daily_targets.pcs = {};
}

function clearGiftItem() {
	delete this.gift_item;
	delete this.gifts;
}