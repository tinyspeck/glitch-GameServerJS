//#include include/npc_conversation.js, include/npc_quests.js, include/npc_ai.js, include/takeable.js

var label = "Steve-O-Lantern";
var version = "1351702104";
var name_single = "Steve-O-Lantern";
var name_plural = "Steve-O-Lanterns";
var article = "a";
var description = "A gurning, gape-mouthed, firefly-filled glowing pumpkin, smelling of decomposing root, and overcooked vegetables. How very seasonal.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 151;
var input_for = [];
var parent_classes = ["pumpkin_lit_2", "lit_pumpkin_base", "carved_pumpkin_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

var verbs = {};

verbs.pickup = { // defined by carved_pumpkin_base
	"name"				: "pick up",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Put it in your pack",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.owner){
			this.owner = pc.tsid;
		}
		else if (this.owner != pc.tsid){
			log.info('pumpkin_owner: '+pc.tsid);
			return {state:null};
		}

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by carved_pumpkin_base
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// If we have it, then it is ours
		if (this.owner != pc.tsid){
			this.owner = pc.tsid;
		}

		if ((pc.location.pols_is_pol() && pc.location.pols_is_owner(pc))||
			pc.location.is_party_space){
			return this.takeable_drop_conditions(pc, drop_stack);
		}

		var entrances = pc.houses_get_entrances();
		var near_entrance = false;
		for (var i in entrances){
			if (pc.location.tsid == entrances[i].tsid){
				if (pc.distanceFromPlayerXY(entrances[i].x, entrances[i].y) <= 300){
					near_entrance = true;
				}
			}
		}

		if (near_entrance){
			return this.takeable_drop_conditions(pc, drop_stack);
		}
		else{
			return {state:'disabled', reason: "A carved pumpkin can only be placed inside or near the entrance to your house, or in party spaces."};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		var result = this.takeable_drop(pc, msg, true);

		if (result) {
			if (isZilloween()) {
				if (isLit()) {
					pc.achievements_increment('pumpkins_placed', 'lit');
				}
				else {
					pc.achievements_increment('pumpkins_placed', 'carved');
				}
			}
		}

		return result;
	}
};

verbs.smash = { // defined by lit_pumpkin_base
	"name"				: "smash",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Smash it",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		this.apiDelete();

		pc.createItemFromGround('pumpkin_pie', 1, false);
		pc.sendActivity('"PUNKIN-SMASH! Oh! You got a pumpkin pie!"');
	}
};

verbs.light = { // defined by lit_pumpkin_base
	"name"				: "light",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Light this pumpkin",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return {state:null};
	},
	"effects"			: function(pc){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];
		var sub_effects = [];


		return this.flatten_effects(pc, {
			self_effects: self_effects,
			they_effects: they_effects,
			sub_effects: sub_effects,
		});
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];


		var pre_msg = this.buildVerbMessage(msg.count, 'light', 'lit', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.teach = { // defined by lit_pumpkin_base
	"name"				: "teach",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Teach me a new phrase",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.owner){
			this.owner = pc.tsid;
			return {state:'enabled'};
		}
		else if (this.owner == pc.tsid){
			return {state:'enabled'};
		}
		else{
			return {state:null};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.phrases.length == 3){
			var txt = "I can't learn anymore phrases. Pick one for me to forget!";
			var choices = {};

			for (var i=0; i<this.phrases.length; i++){
				if (this.phrases[i].length > 20){
					choices[i+1] = {value: 'forget-'+i, txt: 'Forget "'+this.phrases[i].substr(0, 20)+'..."'};
				}
				else{
					choices[i+1] = {value: 'forget-'+i, txt: 'Forget "'+this.phrases[i]+'"'};
				}
			}

			choices[4] = {value: 'nevermind', txt: 'Nevermind!'};
		}
		else if (this.phrases.length){
			var txt = "Teach me a new phrase or pick one for me to forget!";

			var choices = {
				1: {value: 'teach', txt: 'I have a witty phrase.'}
			};

			for (var i=0; i<this.phrases.length; i++){
				if (this.phrases[i].length > 20){
					choices[i+2] = {value: 'forget-'+i, txt: 'Forget "'+this.phrases[i].substr(0, 20)+'..."'};
				}
				else{
					choices[i+2] = {value: 'forget-'+i, txt: 'Forget "'+this.phrases[i]+'"'};
				}
			}

			choices[this.phrases.length+2] = {value: 'nevermind', txt: 'Nevermind!'};
		}
		else{
			var txt = "Want to teach me a new phrase?";

			var choices = {
				1: {value: 'teach', txt: 'OK'},
				2: {value: 'nevermind', txt: 'Nevermind!'}
			};
		}

		this.conversation_start(pc, txt, choices);
		return true;
	}
};

function parent_verb_carved_pumpkin_base_smash(pc, msg, suppress_activity){
	this.apiDelete();

	pc.createItemFromGround('pepitas', 5, false);
	pc.sendActivity('"PUNKIN-SMASH! Oh! You got pepitas!"');
};

function parent_verb_carved_pumpkin_base_smash_effects(pc){
	// no effects code in this parent
};

function parent_verb_carved_pumpkin_base_light(pc, msg, suppress_activity){
	if (this.class_id == 'pumpkin_carved_1') var lit_class_id = 'pumpkin_lit_1';
	else if (this.class_id == 'pumpkin_carved_2') var lit_class_id = 'pumpkin_lit_2';
	else if (this.class_id == 'pumpkin_carved_3') var lit_class_id = 'pumpkin_lit_3';
	else if (this.class_id == 'pumpkin_carved_4') var lit_class_id = 'pumpkin_lit_4';
	else if (this.class_id == 'pumpkin_carved_5') var lit_class_id = 'pumpkin_lit_5';

	this.apiDelete();

	pc.createItemFromGround(lit_class_id, 1, false);

	function is_firefly_jar(it){ return it.class_tsid=='firefly_jar' && it.getInstanceProp('num_flies')==7; }
	var firefly_jar = pc.findFirst(is_firefly_jar)
	if (firefly_jar) {
		firefly_jar.setInstanceProp('num_flies', 0);
	}

	pc.metabolics_lose_energy(5);
	pc.metabolics_add_mood(20);
	pc.stats_add_xp(5, true);

	return true;




	var remaining = this.former_container.addItemStack(this, this.former_slot);
};

function parent_verb_carved_pumpkin_base_light_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_drop(pc, msg, suppress_activity){
	return this.takeable_drop(pc, msg);
};

function parent_verb_takeable_drop_effects(pc){
	// no effects code in this parent
};

function parent_verb_takeable_pickup(pc, msg, suppress_activity){
	return this.takeable_pickup(pc, msg);
};

function parent_verb_takeable_pickup_effects(pc){
	// no effects code in this parent
};

function isLit(){ // defined by lit_pumpkin_base
	return true;
}

function onConversation(pc, msg){ // defined by lit_pumpkin_base
	if (this.owner != pc.tsid) return this.conversation_reply(pc, msg, "Cheater...");

	if (msg.choice == 'teach'){
		var args = {
			input_label: 'A witty phrase:',
			cancelable: true,
			input_focus: true,
			input_max_chars: 150,

			itemstack_tsid: this.tsid,
			follow:true
		};

		this.askPlayer(pc, 'teach', 'Teach Me', args);
		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'nevermind'){
		return this.conversation_end(pc, msg);
	}
	else{
		for (var i=0; i<this.phrases.length; i++){
			if (msg.choice == 'forget-'+i){
				array_remove(this.phrases, i);
				
				return this.conversation_reply(pc, msg, "Ok, forgot that one.");
			}
		}
	}

	return this.conversation_reply(pc, msg, "Not sure what you mean there...");
}

function onCreate(){ // defined by lit_pumpkin_base
	this.checkRot();

	this.apiSetHitBox(400, 150);
	this.apiSetPlayersCollisions(true);
	this.phrases = [];

	this.setAndBroadcastState('1');
}

function onInputBoxResponse(pc, uid, value){ // defined by lit_pumpkin_base
	if (this.owner != pc.tsid) return false;

	if (value) value = value.substr(0, 150);

	if (uid == 'teach' && value){
		this.phrases.push(value);
		var reply = 'MWA-HA-HA! Now I\'ve learned how to say "'+utils.filter_chat(value)+'"' ;
		var duration = 1500 + reply.length * 30;

		apiLogAction('PUMPKIN_PHRASE', 'pc='+pc.tsid,'tsid='+this.tsid,'phrase='+value);

		this.conversation_start(pc, reply);
		this.apiSetTimer('onTalkingEnd', duration);
	}
}

function onPlayerCollision(pc){ // defined by lit_pumpkin_base
	if (this.phrases.length == 0) return;

	// We only what to show a message every 6 seconds
	if (!this.lastMessage || getTime() - this.lastMessage > 6000){
		var phrase = choose_one(this.phrases);
		if (!phrase) return;

		this.setAndBroadcastState('talk');

		// 30ms per character + 1.5 seconds
		var duration = 1500 + (phrase.length * 30);
		this.sendBubble(utils.filter_chat(phrase), duration + 250);

		this.apiCancelTimer('onTalkingEnd');
		this.apiSetTimer('onTalkingEnd', duration);

		this.lastMessage = getTime();
	}
}

function onTalkingEnd(){ // defined by lit_pumpkin_base
	this.setAndBroadcastState('1');
}

function rotPumpkin(){ // defined by lit_pumpkin_base
	var container = this.container;
	if (!container) return;

	if (container.is_player || container.is_bag){
		var pc = container.findPack();
		if (pc.is_player) {

			var auction_tsid = pc.auctions_get_uid_for_item(this.tsid);
			if (auction_tsid){

				// the pumpkin is in auction		
				var ret = pc.auctions_cancel(pc.auctions_get_uid_for_item(this.tsid), true);
				pc.createItemFromFamiliar('pumpkin_pie', 1);
				pc.sendActivity('"Gadzooks! The fancy carved pumpkin you had at auction has rotted away! I guess some things really are seasonal after all. What was left has been returned to you."');
			}else{
				if (container.class_tsid == 'bag_private'){
					var s = apiNewItemStack('pumpkin_pie', 1);
					container.addItemStack(s);
					pc.mail_replace_mail_item(this.tsid, s);
				}else{
					pc.createItemFromGround('pumpkin_pie', 1, false);
					pc.sendActivity('"Gadzooks! All the fancy carved zilloween pumpkins rotted away! I guess some things really are seasonal after all. Still, you might want to check if there\'s anything left of them…"');
				}
			}
		}else{
			container.createItemInBag('pumpkin_pie', 1);

			if (container.onPumpkinRot) {
				container.onPumpkinRot(this.tsid, 'pumpkin_pie', 1);
			}
		}

		this.apiDelete();
	}else{
		container.createItemStackFromSource('pumpkin_pie', 1, this.x, this.y, this);
		this.apiDelete();
	}
}

function checkRot(){ // defined by carved_pumpkin_base
	//
	// If it is not Zilloween, rot the pumpkin.
	//

	if (!isZilloween()){
		this.rotPumpkin();
	}else{
		//
		// Set timer to check next game day.
		//
		this.apiSetTimer('checkRot', seconds_until_next_game_day() * 1000);
	}
}

function carved_pumpkin_base_isLit(){ // defined by carved_pumpkin_base
	return false;
}

function carved_pumpkin_base_onCreate(){ // defined by carved_pumpkin_base
	this.checkRot();
}

function carved_pumpkin_base_rotPumpkin(){ // defined by carved_pumpkin_base
	var container = this.container;
	if (!container) return;

	if (container.is_player || container.is_bag){
		var pc = container.findPack();
		if (pc.is_player) {

			var auction_tsid = pc.auctions_get_uid_for_item(this.tsid);
			if (auction_tsid){

				// the pumpkin is in auction		
				var ret = pc.auctions_cancel(pc.auctions_get_uid_for_item(this.tsid), true);
				pc.createItemFromFamiliar('pepitas', 5);
				pc.sendActivity('"Gadzooks! The fancy carved pumpkin you had at auction has rotted away! I guess some things really are seasonal after all. What was left has been returned to you."');
			}else{
				if (container.class_tsid == 'bag_private'){
					var s = apiNewItemStack('pepitas', 5);
					container.addItemStack(s);
					pc.mail_replace_mail_item(this.tsid, s);
				}else{
					pc.createItemFromGround('pepitas', 5, false);
					pc.sendActivity('"Gadzooks! All the fancy carved zilloween pumpkins rotted away! I guess some things really are seasonal after all. Still, you might want to check if there\'s anything left of them…"');
				}
			}
		}else{
			container.createItemInBag('pepitas', 5);

			if (container.onPumpkinRot) {
				container.onPumpkinRot(this.tsid, 'pepitas', 5);
			}
		}

		this.apiDelete();
	}else{
		container.createItemStackFromSource('pepitas', 5, this.x, this.y, this);
		this.apiDelete();
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"zilloween"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-25,"y":-47,"w":49,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOVklEQVR42uWYB1CUZx7Gv4tnu9OI\nVAUM7LK7sBZWFMFCRLkYsUEgKkpUNEZjiWLsBY6AGjtYYsOCxggGUBClLShNKdKVpjTpbRuwCxbC\nc\/9vl2Qul5ub5GZuxplj5pkPvt33fX\/v8y\/v98Ew\/w8\/ezZqeRzcz0k6dd4q6buL1gHHj3NM3inA\nvZ66OHTADGcDrXHh2mQcO2oBr20Gnu8MoO8+Y+zwNIDXPlOc8B+Dg74cbF+vVf3OALKOubu9j31e\nXJw8a4V1XwzDssUDI94ZwCOHBfDcbIitW0fh3BUbLHMbRICDfN4ZwG\/9uNiyeSQCTlvi5BmRGtDd\ndZDJu5SDSbu3G+HIIQF27zDEZ26Dqt+pKj7hNTLCa+dI+Hl\/gNUrhuDrL3WqVWmjfeQxPPv\/+eLK\nrJkiVeFan84S32pl4TooMx3QkcSHNJYnb4zkJZUG8REfYIK9njrw2qqvDq\/XhmF4fp2Pkqs8ecUN\nnrw2jI+mKBoTz0dnMh\/KLEcon3omdZZ4eXbnuf93qSCL5pgoxGZBnanj5PK0Wai5T5Nmu0CZbof2\nZEtazALN9wgiiMeCYM8mbbVWL\/sL9qzVwtOLfFTc5KMuXAMnieND\/kCE9pTxNMc0KJ8sUM\/Xnj6j\nWv5A4CNL4A773XA1d0w9mu5z5a2xHLTGC1ET7QBl0RYoyw7QdQeUuUvVoKwbsgQ+asJ5KArhoOgW\nBy3RfDV4fQTpDh+tMXwoEsm1VCE59zGUBZ9DWbIPymIvApyL9lRzSMVc1N\/jVFfd5oj+IxiqmUGV\nkZxbtVFc1Nwzo8Fm6MqdCFXBPKiKvyRAmrhomwYwY7oasCKYh5b7PMgJlJVMrHGLBW2M5KOWHGy5\nzwKO+SfAPVCW7qQw0zw5MyBLMUdDnBmq7nJRedd0C0KZfr+Fo5tlt\/n3noebozTMAtK00RQGIbrz\nROgqtEfXUyeonrlBmb9YnUOdqePVOcVCsTmppEVYl1hoxQNNvrFgDeTkyzANuDJ9KrnmBGXhUqiK\n3GjjlDY5NujIEqItRYiXMUI8jxCg\/L5g728An9+z8CkOE6IozAptj6zR\/sSanJqI7nwRaQJpCrry\n7KB6MhmdaZZoi9Es2snCPZ6kcefJPLWzLCgbVkmsJv9YF6tv0UYeCuhzK6hyptJc00g2UOWOp7XG\nQ5YxES0ZdqiItsLT0DFoTLd0\/AWuJdfcsiB4tPJZ2CS8CJ+Ftkx7tOfNpJ3OQIN4FjoKWcjR6Hoi\ngCrdDPV3OWiL7cutNJEm4QvXUsi++iU\/WVdl8Zp8rLvNR1UIuRlpRpvjQpXJw6tnHEoZe3QUzEJ7\n7jRIs+0hzZsH2TN3lETZoDBcVIaWqWYMwPTLDxV+n3dLhIp7s1GbMAeyAid0PHMlLUBDsgve1I5H\nT60AnVmjUR\/NQ2ssFxIx5ejDPvdYqGLKq+eHNaCZH2kKSKwJM1ssrINVt7hQJJtRWHnobTZFZykL\ntgCKgtmQFzpDkk9domIdqpLmIC\/UGtWPbH0ZNAh0HwcJW\/N+tEbtQyfI8mlAyUooX6yFosgD3dXO\n6G2ZRpoAWdoYVLGVGc+lHCNAyjXlIytN+2HdYys8n8ZmzPi3gJUhXLTQuK5iC5pvHMkakmwyJH8h\n2ktXQfF8DeRFq1D72BUFd+yQEz4hnckM5sxKCRQiP8wGzY8XQ1Xpgp+ka9HTupO0Br1tC0kf46cm\nyo+IsWgWC9BCFdcWx6G+RiGjSldmTiYX55DY3kapkT4WHSm0iQQztMRwURfBJffMUPEjBw3RXLTn\njEVv6xSadwZpLl7VLMKrelpLvgsdpcvQkL4YeXemI\/mqSMXcOz5q3YPzFmpLpXkeeF1Hjkk90Cvb\nQNfPSYtpkvlQlX2IsrDRaIrnoZng2sQcyB5w0cECUl6qMsdSjlqiK9McnY951KJ4kNIGWuJ4aKCW\n9fI2tZFwU9THmKDlIQ+vX05Tb7y3jdaTfEbrrSWtp6i5oS71U2SH2iHh4jgwId8Y+8Sd4iHzxjhK\nUA\/ajSsN+lQzSLqUrp\/iTb0jGpNFqIoSoJHC2yw2RQs1VykVgiKVcjOdWkymBYnaTIYQHY+FkKcJ\nIU22QGsi9bgYc9RST3xJxVVPjjY\/4EGSOQ49zR\/R\/PNIFCXJUrUakp1RET8X6T9MQvQpIZiz60b4\nRB42RfIlC5RGU\/W9WEUD2V1p1NMyF5Isa1RGW6CWWksTha05gZpzggUkyWMgf0TOlZrjbTWH+pmV\nWm9ecskhB0hSrdD6UIQm8TjUxYxBTZQF6qj6Gyk3Gx8IIM+3JTPm9WkB2rLm4kXUR8ihdEsMHIew\nw1wwh9z1fW54GyImgIP0IAsUhIpQKf6QbJ6OpnQb1CdZoj5BiLJIAbUcc5pcgKbEMRQmEQFQ4WRM\nRnfVdKp0OqOzWX2IN3UOeFXrBGnmdLSlTUFzki0aEibSBq1QGzcWdXR81olpwzRvfaqIep41ymMm\n4FnkeGSHjEfylTGIPM7DlT1GYHa5aIkC1hgg1NcI4tOmeHSJj9xgAYpuC2g3AnJOgOpYAYrDKExx\n1GbIjaYEa7SmToaE+p0saya1o3loL5wPBfUxRf58dBS7Ql7gAmnOXOqps9H6+G9oSrFHfeI01MRN\nQk28CNUEWhUrRDlFpjTKHE\/DBcgONkPKJS6iTpjihpcR\/D7Tlasbtc9iverzm\/UQ7meEuIBReBT4\nAXJumFBH56Dkjhle3BUgP8SCQEW0exs0JdvRog60uCNkec7Uw6hNUINtL1pOcB509VC3KHnhMiq8\nJWh74krRmI+6pI9Rk2iPqrjJqCA3n98bi5IIcxSG8pB9k4PUK6MQc9IIt3xH4MgqXWxx1Na8Nni7\n6gb4ueniwiY9hPnqI85\/JNIuGOPJNRMU0MNAEbmXF2xJjk6isExHY9rHaMlcAEneIoJYQX1zLTrK\nNqGzfBs6K3aq1VG+HYoyT8iL10NasBot2e6of+SKmuQ5qBLPRNm9KSiOtELBj0Jk3eAh9ZIJ4k4b\nIeygPs58pYO9LtrY6KCleVbcNlfLZJ+rHo6u1MOVrQbk5AjE+hsj+ZwJMq9SyKnCc4OtUHp3KuqS\nHdFetgKvGj3xunkP3rT54a30GOk03soD0aO4SrpGv1\/GW9l5vJGeou8cRmflDrTkfo6aVFdUiB0J\n0B6FVAxs90gJNEf8SVOEHzDCpW365J429i4advNXDwveLnpJ+911cHajPn7YMxKR3xojjfKxmc7J\nlyl2yA2xRtHd6ahPcyKwLeht\/zt6Ow6jt\/MMepWXScHo7YokxZLiSdHoVYXT\/R\/oO4F4IzkKeakn\natKWoDxxPiofzoOk+FNk3ZyAxLNCRB7h4gdvY5zepI\/9K7RxZM1QJ\/YY\/gVw\/Swt+30Lh8N\/jQ4u\nbzdANCVqx3N7ajVz8abZBXlhtnT8UGU\/WYy3bTsIcD8BnqDFzxPE9wRzm6DE6H31mJSL3u6UPsgf\n6fMg9MhPob1iB6pSl6JM7ARF+Wo6Odajq84dYgIMO8jF5V2GCFinj2+WaRWjYajurwDZnx3OWqkH\nVujg3GbKw5PmUDydRYBO6tNEUuKC3DA7VCY5oUe6i+AOkPwJ8AIBXCOQUAKK0rjXnUDXOLpHjqpu\naQAVp9FRuR3lD+mkyFmBXgVtUv4VeiSr8fj6RNzwMcXZrw1xkIrj+FfDtqN+qA4Bvvfr99s1AwV7\nF2kpjn2hg8Rz46hxzia4T0hLaLKVUFQsh6R0JU2+lxxkAY8R4HcEcIl0nWBCCCyMRKFV0VUZornP\nfk7fe916ALLyr2k8pYdiJ83pSWe\/O7KCbXFp1ygcXz8Cvh7aWWjQHgUZ89t3FJZ475Ih67yXaP10\nkd5zGx85UnWSgzL2rKRzWU7ns2Ibwe0j+RLgEVo4gHS2DzKoD+j7PgX1wVEadJ7WbKjjoCZ\/FbvQ\nVe1BTzLOuOs\/GgH04u+7QqddfFXXHi1\/NUARM+Dfv5eAGfj35UM2+n42XBG0zxR1j+ZQT3PF22bW\nuY0EuZUW2EP6hnSIFjyuWVydi4F9BXOFdLXv94uaDXSc+gWwR0rvNuXL1M9\/iZescHKzIQ6s1mmI\nCND\/BBIdI0iZ9\/\/zy1MdM\/jsziEz968cnnFsjS7izlvSY9BCdNesQE\/bZnWIe2T7qHi2\/xPgOdLF\nPrggjVRX8FP7Gco\/tphOqYvqbetueih1R3GcA656m8J\/g0Gv\/2a9qLLEEZMg1TYmg37f6ycLyVZS\niK+eW8B6vdLz2w3xNHoGVBVLCXQlnsbORmO2M143eWryUA1HrqnYXLypFlsYkiJ3JARaqTfTXbMK\nFSmOuHNciNOe1PO8DK9mRBjPQasxX+1cGzP0D728+\/szg88cYQwvHB8yev\/qYYGHvtDtvLLXBBmh\nU5EWPBnXvD9AcbwDGnKc0Zj7CRrzPkFTnubKqiZjPiL9xyLsCB85kdMRfozAtozEsY0GJWd263t\/\nd1B71km\/922\/3TPAYv58RpeWHPh72f5EGkwaThopFDJ857mM7Zdug123LB4a6L1cO\/voWt3uExv0\ncWqzAc5uHYGLOw2pEo1xebcRAqmfsY6zhXZ+qyGObjDo9lqp27hlqVb+cqeh153nDN61YFb\/lbNn\nMI6mpsx4WsOMZETSIf2V1O\/3QLJVxFquRxpF4g8fzlhajmYcbKz6LZ1q03+Tnc2ffexs+p9ymDbg\n5gbn98v9qIf6eehgu5uWfJ79X7KnThoYN9V6YMQU6wHXbSf0P2M78c9+Ey3f87SwYNx1tZiZNKcl\nSUD6gGRAGvZHXPxXN4f1wbI75QwcyJhzOIyltYixmWbLzJw2mZljN6mfy4e2\/RZOn9xvsZ1Nv0Xs\n31NtmHljzJmZo0Yxk4YMYcbSWHMSl2RM0u+L0iDSe\/+Lf3691xeO\/n2OD+hz4Gf9fK9f33f\/9EcX\n+AfFMWJbj10zyAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/pumpkin_lit_2-1351702103.swf",
	admin_props	: false,
	obey_physics	: true,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"zilloween"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"t"	: "teach"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"h"	: "light",
	"c"	: "smash",
	"t"	: "teach"
};

log.info("pumpkin_lit_2.js LOADED");

// generated ok 2012-10-31 09:48:24
