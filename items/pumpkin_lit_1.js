//#include include/npc_conversation.js, include/npc_quests.js, include/npc_ai.js, include/takeable.js

var label = "Jack-O-Lantern";
var version = "1351701336";
var name_single = "Jack-O-Lantern";
var name_plural = "Jack-O-Lanterns";
var article = "a";
var description = "A carved pumpkin lit from the inside with the power of fireflies. You'd think this would make it look more warm and comforting. But no, still terrifying (for a vegetable).";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 151;
var input_for = [];
var parent_classes = ["pumpkin_lit_1", "lit_pumpkin_base", "carved_pumpkin_base", "takeable"];
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
		'position': {"x":-26,"y":-47,"w":49,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOA0lEQVR42uWYB1CU2ZqG3b2zM+66\nDqCogCI0dJMkijiKOqIiGAd1lMGcMec8OmPCeA14DTMG9IqCAQYwoYjaRMk5G8gCAp2guzH2u283\n1NRO7d67M7d2q6zarnrrp\/8+\/3ee837fCT+dOv1\/+GxZqe+0d4epOPCEg\/h0kNulY8dshn9SgNvX\nGor3\/miGE6edce7KEBwLtMeubSaRnwzg3h\/MxFvX9cSGtSY4dtweB\/YJsXW1Ibav0Df7JAAPHhCJ\n58zUx74DNtizzwabN5pglu8Xsk\/GwYMBQvHqlcbYtt0CR086Y9mSbpj1XWfxJwMYsMtcvGaVMY6f\ncEDgSScsXWyAmb6d534ygLu2muzcssEETDX27rbUuocZUzqbfTKAP+82XrN9kxH27DDFqiUGOkBV\nivtOWYzl\/72LbckuZq05c9Yoi3aIlYUboMzwgTLeGtKHIjTcFoqfBYtkueeF2La6G7av64FFc7ro\nAMsui1ByUcSrsKLyhgh1USI03xehRSyEMnUIWvPmV6pKNweoCicNBDr96Q+DSWMt9CSxwp2tcZYV\nylQPVEV7QfZ0IoMPR0uCI6Sxdmi8J8LzECEKg4QI3NYT21Z1w\/IFXTHbrzNyzohAeFSFEe6WCE0x\nlpCJbflsP6hSB0CV6QFVNuNljJArEm1DJQlGdr8btPy6wKk60qKi6b4lGu4LURPtDnn2bKjKNkNV\nshrKvOlQpntAmSCC\/JEINRFCPA+zQNYVcx10wx0RXkWKUBvR\/rfssSWUiRZQpQ+CKn8KY\/hDXbYO\n6lwCpjhAIhag4YG5vPq2yXJCfvF34fIumM8tu2KBsqsCjtqco3WAKscLqiIt4GoGXw5VgS9UGcOg\nShKi7o4FKsOEkMWKdJJSkhgRGqNFqKdztVEc5D0CPrWAOmsQ1AWToC5dCPXzVVCXMGauJ+RJ9qi7\nL8CL8L4oDDG9RsjP\/1u4pGPmczPOmCP5L+aojDKHPJ6jTrViYHeo88dDXTwV6sIpHLkX1BmukMcx\nbU8soGA7ZTxrK8GWVxEUT0S6Gm3UZiDaEq\/uWELyRMg4zmjLH4W2okloK5kGddF4Dn4oWlL7oYm\/\nv4gUIPdyXzw90yeUkP\/8G7h7AcZmcX8W4PGhviiPMEPDQwFk2o5TRGjLtEdb7iAG\/xpteUPRlk24\nJCvImeLWJEvOWIf2lKdra3Qk0+kEBSeD9JEFmmIJ+YBO37ciiB3jDMSbwuHUSLQVDIM6xwWKVFs0\nxVmhmgPKv2KGpFOmiD1utOw3gLd2moqj95giO6gvKuheA4taSjdaUuyYTnuosx3RltMuSaI9Ae3Q\nmmINdZoVC57pzvODsmAFlDnzCOmpqzl5nAWkBG16bIXXj+wI4Uig\/niT70YN5GDd6OAAyFOd0BRv\nh+oHIhTfFCCBgHcP9JY\/OtW1uw4udF2f4RHfm+LB\/t4oCCHgLQHqY6zQzJQpUh3RmunCGacNNhAy\nzkBJUn+0pDmx6PvRXQemfDRUxYugfBZAyLV0kqlLtoEioX2QzWJbHVyj2BWtunKhc4UevA5Ha\/ZQ\nxnTD63hHVD6wRUm4BZLPmuHOPhNc+77Xfh3gpVUml25u6424E6bIv2qGlyzsVzE2aEpw0AG1ZA5G\nK2tFmfs16uOHQZHuTmgCZzqhLYuAeSNYT9MJuZwzfCGUaaMIKERLIidPgjUkCfYcbH80JblDlj6C\ng\/CGqnAsWgvGQpHjCWn6UNQnuBLQHsW\/iJAaZI6oABNc3mRUpQO8sLK3LOJHc5RECFDz2BQNSaao\niemH1wwqTeUSkzUCLXleaEofi8ZUbyiyRnLkQ6DKGtCRel5zCZUzjuuaF+u2v642FaxRKbMgSWJZ\nJA1Ec4oHpFljoSyaDGXxNLQWTYU8byKaM0ahPnEwmrNsUf\/UES9iHHH3oDmC1vVCpyMLjc1+WmqC\n+wes8TzcC81pdtDUG+JdlRmD0MGcYdRYtBRMRkPaVCjyJ0ORNx4tOZwMWYPpogtntB3UnEiqNE6W\np3ZoiRfo0itjeqWsLUmiM5qT3dGcOhqy3ElQlsyC6tkitJayXp99C3X5KHyoc4GmgTVfOgnSvHm4\nRcBzawh4eLbh8JP+Rri1V8jUjiWgMwF7srEAmtf2aCkaAVneZF5noSlnARQFswg7FS253nRxGFM9\nAK1p9nTNqt01TgzZY04OLs4SMes4rp8uvc1Ph6I5fQzk+d9BWbYIqpfroHzBdfXlDGiaRrEvV\/Zp\nBWnOJDSmzcAve01wZmVPdNo\/3XB44MJeCN7UC+XR4\/E62YOARmxsyVE5sfFYAvpBXrQE8uJ1qIub\ngrc1vkzPeKbag\/XoBjmXGXmiNWRxQki4rDTFCND40BKNj6zQ+KQfGuP7Q5E7BG3lLI+SBXRuKdSV\nO9D6YgMUpXMIOJqAbuzTGnUJvii97Ykbu3rj1PIedHC60fDD83ogaH0vZIUMYi344kNtHzYW4l1N\nf9SnjockdwZkxdziynezDmdD0zyLQX3wrnoUZGlukCY6cqZyUsUKdQtzPXeXeu4e9Vw2Gung+9pB\n0DR64E3VBDSmf8fBLkLLs9WQc1eS5GsdHKlzUFXmiuoYHySc64erO4xxdLEh2g+cM7rLzq7uwbz3\nRUOqny6lH+qs+BDXp2xvNGb7oSmfDmr34ef+BNRCTqHGc48eTAh7vI61Qj3ham9ZoDrCHNW81t7l\nLM5y1cFpXXpXMw41DyegKdMPEtZZU+5sgvrw92F4U+GGyugxKA7zwK3DfXFpixH2z+vWDvijb\/e\/\nBi7tgWs\/GCPz+ldQFGtrxAcfG5z48FC8qf4GbTUz8b5hMTSSBe0ONk\/Dh9cTuX65ov5RP7yKtkIN\noSrDBXh5XYAKXisjLVH3xIFtvakxugG9b\/CBumIy3tRMxdtXhGvyRNvLwai674GyME+If7LFjb19\ncJoTJGC2QbIOcPfUXj6H5nbHxY29ELXfFAVRw6B8uQRtVQvxvm4sg2iDf0sxHRLCSfzwsfE7Thwv\nvHrojOpoW1TxYFDOE82zqxYoDeZhI1SA5zcs8YLrmrJsND40TGQcqtmnQxPxvt4b0uyReBnpidKw\nUUi8YI+oQ+a49L0xjjC9AfMNVv661e2ZoV95ckVPhP5ggrtHzJB80Q7l4rGQFs6BqnwZR7yI8tdJ\nXTEfTRnjUBXjioq79iiP5BJ1U4jSEAsUXBQg\/5wlCi4JUBgsQHGoJZ5FMNY9d9Q88qbG6K5VD7zw\nLNyTO8cI5F4fhPjztrh7zAKhO01xZm1P7JltUIOKTp1\/Bdw\/u\/veA\/O748J6I4TR4geBlhyRLTJD\nnZH\/y0DkR7ij6NZQvHgwBC\/vD8KLu654HuWAsnBuT9dFOph8wmWetkDmKUtknBEg+7w5cngvN5iH\ngBBr5ITYIe+aA\/JuuCDnpguyrjkjJdgBcWdtce+YJW7wLHB2oxEOLzDEzll6h39zWPD3NND7wVdf\nHrjMEJe2GiNiX19kXnVEWbQTap4OQGPe14R1QX64C4rCnVEYZo+ia44ojRigUyZhUk+ZI4kuJB21\nQMopaxTcHIzcKy7IOC9CCl1NOSdEygVrpATZoDp5MCoTXZFxpT8zZsG6M8WFzcY4toQv\/NO64aeN\nnXr+l\/PgRh+9gN0zDXBqZQ\/cO26O8tvjuLiOYO1Qkm+QHd6fqaerwdRfrfAsaiRaXmyCRnmSOguN\nKoi6RF3k9\/PUachL1yMn2A2xx\/riSaA5nvxFgKJ7XHYkk1mHo3V93D1qjSC+dGnhds7Qx5pxXYP\/\n5ol6k49e3r653XB+Yw9UxE5Cc+aU9hkomQbFS188j\/NGReI3FLeo2q342HKaQJehUV+jwqhfqHDq\nOu8H8\/efISlZg+KYySiLnYCXCRPwtmEeNFI\/TpKJqImbiqAtvXHEn3DTDbDSu6vM39VA728CLvbo\n4rzxGz1pwOxuiL88DC1l\/nhXN5UBZ0IjWwqNgo617Iam9Sgd+lkHoQNqu0PFQPMmlnrIv+\/xfgQV\n0u5mayCfC+DzW6CRL2e8OdzqFiA70hsHud5t99XHci89zXz3rj7\/40uTFnL9RP3yg9wCX+fN53Kz\nHB+aFjLwSnbwPTs60J5WnXNauPuEEkPz9imVRqXwe3w7sDqS7a6w\/U+EPMznf8BH2Vq8rVsKOQd\/\nYrkpNk\/Sw2KPL6Xzh+j\/\/vdof9dOemvH6V8+sZpH\/1J\/Qq7Em9pVeN+8jR0daa85dWi7czq4DGje\nFVAlVBG\/Z\/J+An+PZrubuvr8qDjK57fr4tTnzMeptTZY4WmABUP0niwYqu\/0D724Lxypb3Zobp\/I\nkIABqEie2QG6Hu9e78a75uP4oAjBh9ZIfHxDoPfl0Hx4RVXxey7v38Z7+RW8azzEZzbpntWChQa4\nYbW3AZaM0I\/6h8H4+SdKu1BqC7bntwP+bcGK0frVR5ZYInTfAKSEjUfp42m6DrUd\/z2VPvZFzt1J\nOrC1Y7phiYd+7fSv9LYyrjllTGnfPbpQn\/1eOG3Df6cMqT6UkLKn3L3su+yf5vZl7CrvblJtZ+vG\nGWDDBAPs8jPCzxttf9Wp9TY4s84Gm8Z3xwpv\/bezhnStHW3fRdzf7ItzjONHeVIulE0HqBGl32HK\n73ZPv+NBbQBrypHyoL7VziVqM7WPOu0u+tf0xR56b5eN0se8oXoq296fp\/L+Neo8dVR7JqFWUbOo\ncdRXVD\/KssMEww5TPvujqf6sw34DqhdlSll0AGtddaYGU8M7XPHukBc1khpGuXUMzpYSdQzYpAPq\nS+rzDlP+1z\/aoNp\/+PxLRydaffGf9HnHb591tPvDEP8BjbbobKS9e5YAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/pumpkin_lit_1-1351701483.swf",
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

log.info("pumpkin_lit_1.js LOADED");

// generated ok 2012-10-31 09:35:36
