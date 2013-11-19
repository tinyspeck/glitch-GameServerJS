//#include include/npc_conversation.js, include/npc_quests.js, include/npc_ai.js, include/takeable.js

var label = "Lem-O-Lantern";
var version = "1348102174";
var name_single = "Lem-O-Lantern";
var name_plural = "Lem-O-Lanterns";
var article = "a";
var description = "An unusual addition to Zilloween, the Lem-O-Lantern, marking the special relationship between Zillots and Lemmites, has long been created for the festival by vegetablartistes. It is especially prized, as it uses a special flick of the pick known as \"The Myuki Technique\".";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 151;
var input_for = [];
var parent_classes = ["pumpkin_lit_5", "lit_pumpkin_base", "carved_pumpkin_base", "takeable"];
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
		'position': {"x":-25,"y":-55,"w":51,"h":55},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAN\/0lEQVR42s2Yd1yUV7rH8d4tyW6M\nCALSYRoIKAgK0tVAAAXFhg0vRmPMuhq7YlfsBbFFpQhBJVGQsoqN0IfeYaRL720GZgawRH73eWfI\nH26Sva7u\/ezO5\/P7vO+8M3PO9zzP7zznnFFQ+Be9UOA0Tlq6MUVSdXSzwn\/aazhJX1ea7VQsLf0a\n0vI9kBSvDvuPgRM+1NftT+KIpBlTIc11hbRgEaQ5TpCkG\/77IYWRrHEd97nFfU+5GEjiQppGSjeG\nJJWL\/kQuep+yff6tgI13ObGtsVzURLJQFslBRZwBmh5yISTgnkdcdN7noiWG4\/j\/66+iObpSwUbT\nv39ef1tf93kEF4VhLBzeroIzpw0QdMsWVwIt8CiQhfY4govmov4OJ+WtqP\/IGjecZe8oFaw3\/ZcA\nSvI8w6TluyHJX9wgTuWG9T5kz2eeC4K4YVXfcZEZxMah3RrY+BeC9DfGOX8jHN6jKQOv\/4GL2ltc\nVIRyHBvusn3a73NimdRLc2ZDUrZFNFyxVvfDPEazk\/ETMwGYqzCBC\/IcnkdwRCVXeRAE8ZB2lY39\n+\/Swbo0ydm7XwsEDuvBZ\/jEEoWxUhxPcDS7KrnNFTLRbYyj1j8mvydQm35QmktGHTaS2OG5Y10O5\nn7rpyqStKZKLoitc5F\/g0ZWH0us8gtLDYT8uTvlPhq+vDvw2jUd5CFc2gNJr8u8JgrmyiDKQnQ9+\nbpMj+iBAilRD4105FHOt+56LyjAu+Cd4yDrLQ+55Hgou8nDiKIuiqI+AS1Moihq4sW8iir+Vg+Vf\nlH8v5xwPlaEU\/dtcNNwZbZPEePm9AZkIMCmqCJWninmfTR0lH6HUHuch45Qc9PR+bZzwY+E4gW79\nRhWxR3SQF0BQ\/vT5GR74J3lIPSaHLQvkyaIra5NR0AfMcqYTptGCS3S9wBU9C7dDzkVzUepRHhIP\n8ZDiR6DU8VVfTZoo6ti9VRXeSz9C5H4dGXz6CTkYM6Bsfy4KLsuj+XObTPTzLr0HIKDwe3R+opp5\nnj1QHMRqaXs8HaK8BbSMeUBa6C4ryIwfyymqheTHmOM62LNJCd98+akMMOqAjix6NCg8CzNDxyNz\n9KVMg4Q\/Gf2ZrmiM90RpiBXSKQt8P94\/V27QqfBndGtxxGWTPNufTOroTTOCMM8SrxpYeFlnB3Hx\nMnT+6IyeNGeIUqeim8zecI+NuAuaiDmvgVvH1VBxk422R8aQVk7DYI0lJFWOGKqbhcGyBRDlLEfr\nYxd0p7mhI8Ea7fHslProd\/QhRe536NJmt6canexIMkXTEysIs23xosINw1XLMFSzGUO1mwh0Dl5W\n22Ewx0y2avQ+lpcgRr1P5DO+I55HvzXDYLk5Xjea0wBngNlMCIvmYqRTH6+adSCpsENPpg3qo\/X6\n655oOKFHYew\/Bmwdq1z\/iL3j+YPJaE1zQX\/FKrxoXoeXzasIyAvD1d4YKveWbwiy7NAczZFBiamu\nMXWSEVPjmGc\/l6Xme6N1L9uB7LGc2lhOgCYY6WJjpEMX4jIrNMUbojySI25K1F+MbpWJvwlY80ht\nRvEtrqQlaTZeNLnjTd9ajIh24qfONRiqXAxRkTuE+XPQl+eJjrS5EKVMhTiFOs+0gjTPifQZgVtA\nnMpGXwJHVu+Y5a45itlETJINSprrhMF8in7BNAzkmkNcOg3dmfaoeWCOoghDibCC64A2hQm\/Cph0\nXutJViAXfQWfY6THjeA2443wLF40bICobAUkla7kKYKo9cBwgxfEhXSfaUIRnYvBZ2tIqzFYRN\/J\nNkJ\/CgtdP5qjgz8XvRRxYbabfDAZLFrqeJDmm+JliytGeufjp65FkDz3QeUDa+TeMkxAm54h2W3M\nW3CRX40fF39MC1lBLDQnWpOxP6coUkrr1mHg2f\/gZes8gp4tV58HidJcZInB3Klk\/oUYrN4m92ip\nJ4byzCBO59D7ORgRrqTvLserDi\/00xrMgA9kTqJNrY3s+YhoI2krhtu2oj7ZDenBxugp4zgS4B\/f\nAgzZqL45co8GsgJ1UB07Ca1JlujNpgaLyIulBNTrMioyudALr1o9IeYTRN5kgnIjC9BgKldiWOCK\nocIpEGcZYFgGyNjEh66r0Me3RU8CC33pRpTamfRsDUb69+NN\/3kMt+5FbaIrUoOMkXBV1x8tCh+\/\nBXjta\/WUu776SL2ojeKbenj+N0O0Pp2CTvJZX7YlXrd9Jo+caBkkAif0JRtiIN0Ag3mGGKZoDAuc\n5Sq1wVCBKcQ5JhCmGUOUb08DdEFPjiPa77NoduuiK9EAPfzpkFQvwmDjVxDXfoO2vBUQ3LdH8lVj\n\/HBYIx8pCr97C\/DyOnXc8WUhN9QMGZe1UUKQ1VFs1Mey0XSfFMcC\/5weGqJorxfPQQ91IuLT7jnX\nFENF5gQ3Ay+rHPCi0hGDAluIc6dDyKc6mTSZaqIhlRIOWqiNplgdND9g0+CpUiRbozXdGY0prqh6\nZI+qx1ZIvmaCb\/+qhl9MkIAvJuL6Bg10ZsxDZ6ELnkXRrLrBQukNPVoN9FFNxZd\/ngDvsdAWz6WC\na0EpdcTrVkp57xKK7jLSCrpfMXq\/hGxAq07VTPRkWKAx1hCNcRzU3WWhNlIHtQRc87dJqI4zRV3i\nNPQ9s0VbqhNu+qrj6LIJvwQ8tUoVt3dxaDQuSKZNZ3XcLJnBO7Nd0JXjgoEKWuZqnCAsnAFRsQNe\nt3tQqh3Rn2tPq4szpBXzaaIsIXlhsGoR+os9yBqzMFAym+zhRr+zh7BgOsTlM2SrSneuHbrotyO9\nzqh\/Yo\/MECN0pH+OgLXq2LfgVwCPeKkUh+\/kIO+2DaL2aCE3eDqNyh38AH0UBplQWZmP6hgT1N3j\noSvDnjohX\/HtIClfiNed68ibW8jwu0i+dL+DtAniKi908Wdi8Pnn1LkDaqIMUHmHQ+9nozjUFCnn\ndNArsEF2sAUFRx2CaAdc+Ysuds5RKv4F4LGlKgEh2zjICbPDrW1ayAm2QvVjOySe1ENljDWlbAGy\nv9VHLXUirXFHd4Y1+p9RakXfENRujAz4YUR8huRP70+SDuJV1xb0FS8m2zigXzAXVXeNURLORne+\nLUojpuOhnw7K46eCf92K7KWOwu+dZNHb6Kz4y8P\/lS+05x9cPAEZIfYI3aqNxAtmqHzoiPjDutSY\nNbpLnJB2UQ+1cWYUPU+0JFhhsG41gewluOMEFoARSTApjO6vyWBf9+wlwKVoemqLoXrKQKw58m+w\n0Z7pgJIfLBG9Vxul0VZIvDSdIqeJorsu2DZnvOgri\/HjfnUlOeKl2nDGRx2PA6ZRyFnoLFiIe3u0\n8fQ0ra8Cd6QE6KEiajKGGxeiNdUWIsESvOzYgTcDZwnsOkakt\/FGcofqWhB+ohVouHUHOrLnozmJ\nZvbzhRBEmSHrGpuiOZ\/aZOE2nWE6aRW6uZuD++em49BSNWz4TOm3zyl75in77F2ojPNrNMGUnerH\nHngSYIIoXy1UUo0qiJiC\/BAOpcgNbfxZaEhwRF\/pCqplmzHcsh8v2o\/jRcdpWhX8MNi8C93F3mhM\ndEZL+mfoKZiHnBADlEVPRQW1dcdXAw\/OGKA1aylOe6vhwgYWtrgqYa3NR\/9467VjjlLDgUUTcIp+\ndHsPmfqxOyJ26SByrwYaUp2RH26ColvG6C3xoAXeGg0E0JzuifZcbypP69BVuB4deV+gJXMZGpLm\nopps0pLhhrzwycj9bjIaaZcUtV8TN3cy\/vNAyHY6dC1WwfY5BOeg+H+f8na6TXDcOVcZh5aoyiCv\nb9DBQ38LhG+fiKiDmtSoPQQxliikaNbTruf505lUmtxoHZ2HJv5iNKaT0hahMdUDVfGzIIi1ocpg\nTtcZVIwdEHNEC7d2aiBinyHOf6kl64fpb\/0sRdFaG8V327hSFA8xI5JBrlQDU8RvbNHGTSoFkQc1\nkPStAUFaofSeJYR0DOgVeBLMbIiqF6PqoTMa0uagNmE2SqNskEtwZVQF0q4bIfaYNm5TIQ7eoilr\nl4kcA7dhtiK+sFGc\/09t\/Tc6KYZuI8h9lO6jy1RwxkcN1zao4rsdE\/EDQcaf0UPqNUOU3LNGfoQF\nWrJcURw1A2UUMWH5UmSFmyMteDItXUZ45M9C9FEdgtPA9U1qOLlSBYyNmCB8zcDZKr7fn0xfzVT0\n2eqmBF9PJuUqOOmtistfqyBkmyoiDmjQYUkXD86x8PSSAVKDTZB0zRi1yc4oibGVPXvgz0HsCT3c\nPaSNsF0atMaq4ri3MvZSrdtKcH91Gi9aY6f4Yf\/RMLNqi6ty2O55ythDoEeXK8N\/rQqubFRB2G41\nfE++jDqqi2gCiTmpj9hTLMSc0EcUwUfQZ+E0uQI3T8SF9RNwZKkSpVSJCjED9umh36x37\/M64K5q\nSn5J2eFOoAuVcGSlMs6uVZKBBm4hj5LxQymFNyhSITvUEbhtIq5uUsH59So44TOBBkfHUpfxzGQI\nf+fJ8A6v\/yL9iaRM0iSxF1iM9VlmPTbQx+HTJ1vnjuva56UIP28lnFythFNr5DpB98dWjceR5UrY\ntVBRutphXI771E8uOxl94kVtGJL0SMzhaDzpo\/eF+z2JOQaqjTY4iWRJ8iCtI+0jXWJOC4qfjMmc\nafJx+1K7sWJG1oYfNfzxDwqFY8YoPKXPb5LOMcWBtIrkQjIj8UjaJOaA9GfSmPeB\/APpU5IqSYdk\nQJpCmklaRPqStJ10mHSWdHEU+gKzgyMdJDEL\/+rRgdmSTEhcktYo3J\/eF+7vX0wjzDacOSuMG02R\n1mh0WSTOaFR4owCc0QipjoIojqaTGfR\/v2un\/wswAUEYnU\/8KwAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/pumpkin_lit_5-1344030106.swf",
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

log.info("pumpkin_lit_5.js LOADED");

// generated ok 2012-09-19 17:49:34 by lizg
