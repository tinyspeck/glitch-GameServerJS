//#include include/npc_conversation.js, include/npc_quests.js, include/npc_ai.js, include/takeable.js

var label = "Zille-O-Lantern";
var version = "1348102174";
var name_single = "Zille-O-Lantern";
var name_plural = "Zille-O-Lantern";
var article = "a";
var description = "A common seasonal vegetable carved into a representation of Zille, and filled with fireflies to create an eerie glow. And it IS eerie. If you squint, it's like her eyes (and the burny pumpkin smell) are following you around the room.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 151;
var input_for = [];
var parent_classes = ["pumpkin_lit_4", "lit_pumpkin_base", "carved_pumpkin_base", "takeable"];
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
		'position': {"x":-24,"y":-47,"w":49,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAARVUlEQVR42tVZZ1iUV9omuxuTNSEU\n6UXazABKXQUUKYIggiKKNaKiSSQ2bIAGBYmK2GJQQbCjKEUpg4I0xQEUsABDkaYoomDoQwej4d7n\nfR1d\/ZL9tlzfn2+u676Ycs7z3Ofp50VC4v\/TK3Mbz7gobGKQ8PTEoLrrbvy6m56C2pvLBLXZyxtq\nspcLazOXu\/3Rvh2b5EL37+MKwk9OFISdMNm4f7+21D\/TUZe51Lg6aym\/OnuZqDZ7GSv\/UeYCQc1l\ny6CSSIOgu0dN\/lCHRKofLyprOw\/5e3l4cJSHh6e5eBKnhyfXpqDi2gKUXVsM4dXFKElZGPXhvkA\/\nOduALQo4eEAXkVEWOH7GDPv2ckT+3tK2\/1NHcfJCz9KURawcBk8z7PEydTyeXeai+hwXJWE83NnP\nQ3YAV3hj2weHTPPlhqb56eI9wSNigrFcvEzhoj1LF5UpLii67I7CeHfciZ3r+W5vSKCmbaCvIjau\nU8Be2vvTT+OwJ3AsfNZI8z8kdzt+rvGd2Dmiwjh3FCfNQXuuDbpvctGSykVDPBE8+wHBQB7S\/HhC\nduN1Hy0NhhyDTH8e8oJ5uB\/KQ8VJHh5f5OJFEhdt17kQ3eDiQdw03IpyJcwS3TjpwJ4wZJembUCA\nFtatUcSG9cr4+ZgxVn8rBY8Fn4V+SPDmmVmCnHOz2P1t2eNYcu0ZXDTxuaiP4bIGYTx3O4SHrAAe\nyyfNh+cpcd1X1+09wT2myIm0x60Tdig8aS6sieJGPY17K4Q5aXOqLrJPOCI9wglp4dM931pQzXaH\nvwZ+3M3FjkAOjkVOwNJFn2PJolHvYyk9wtH2+vHp7L6KmAloTeOyaCbv1MfpCQrPWvFzT9tBcJJw\ndDIyt4sJkmeZ2OOzHwKNkRHphOskhBGWemy6MRvUF3Q8GZKNV7h4nsBF3gkLJP9sj6SfprIu2OWv\nZksxh0Cy4pEwI+zZw4HHos8bPrRe4k9T+UmH7ZB6xIZ1JyOnMYF17ft4Tg1zFKWRXkZ\/eog5SzDV\nlyei+NMVMB9S9lqAT4oZ5SRQ8KGC6iiO6FE0FwzKz+ghNsQKsXutcCnYUoP5nYm5PT9qISSYg+0\/\nqMFj4ecfJVJM8BTEBFshP8wQteffymFQd1HL+N2ahENTQ5lDJDM4aIN3Xn1PMH6fNeJCrFnFMXum\nfKSg4hRnV8UpLhiUR\/IQFWiBc4QzAWYbn1zRltrzg1LDru1q8PdRwqoVkggN1BL05XGCWlO1jM\/5\nm9meDTDHuQALFIXqoSySiW9GFicXkPgL4RNGR+yuybbMIRj9DI8Uf4O3BJnywrw5HzQJUTsnsYpJ\nYBC7uV1Csr\/EcmmPcElc+Wk9CCN1UByug7PbjRDha4pj3jwkBmogercKqBbCd50sG39nghRQd4Ey\nM4rTkBbCER33MWXXFx7moDhMB6XHOdjgJtU4ULPCe6iOq40uCanYAyaO7EFIP2MA\/rbx5GLdBol0\nP44tQzDaj1UqivAx8USLxBeifPU5vbe1Mgfum6KzwB6N6daoPG+Ie8c4iAnSQ+YRPdQn6KD2Agd5\n4Zrw95aF31pprPT4Kw5vkmctxbjxMWXojVBdnNymhzsHae0hbQSvlEd0sD4GhC7ofzCpur9Iwwdt\n8kqXD\/JcIraaCM\/4GeMaE4OUH6wL47boi5gPl3z0NRirNaVrnGrL1kJ9og4arhmhvdAFg3VeaC9b\njea82WgrdMTA\/Ynoy6fDZ+tQQefgOV+HLUdMdv5yjTI\/mbKUsr8jnYOePFqXOw7NN6xRkeKIF0Ur\nMVj7DQbK7NBXqE+\/cdCcqXWvq1zRAN0SMnxf3vkkH11R\/Bae8UeV\/nn2aJXaeM2HDUlaqIvnQJSv\ni6EyWwzVLMDQYy8MPdmEoToSXjkTg8Vm6M7VxtMELZYkUycZdGUTqYx\/lJEXfCJ3SweD9wwwWDad\nZHlgqH49YS0GaxaSFe3QdVsfzRkcPE7S6mlIV3NmXP67VlccKylXfGZsZUW0JqpjOeguIBcUG2K4\n3ArD1a4YfvQ1YSmGa+ZjqHIaWdCQDsBFb74O+vJ00J+vR9BHn4DLFuGOTKqdaTp4yYCs2H9XD0Pl\ndNgqNwzXLSFZRLTGjaxog557RmjJGYfHyRwIozV7qpMVHCkHRn1EMO+oWszdyLEoidJGa44uRAVG\n6C+ZiOEKS7yqdsKr2tkshqtmkMBJ6Ck0IvfoYaCIi4F7Zui\/50iYgf5CK\/TnkTUZklk6aM3UwS+Z\numjLGY9hoRntn4ZXNYwsOnT1DAyWW6PngRna8o3x9Dpl+UVt3I5Qe4EmyTHvyV3bo2qf85M61SkN\nNFDHaLllAFHRRPSXWmGoYhoJcibLzSKhJLDCHp2FU9B3fwIGHpDbiulvGQV7xUrCWvQXz0N\/gRl6\nBOT2HB10ENHWm\/pouWmC3vsWGK60JYLTCS4YqnbBQOV09BTbou2OGRqzDFBBTSEvfCwyDysfZioJ\nSzA5QDk6Y586HsYboCXPBsNP\/4ZfG63xusmZkmMOhmoXYujREoq\/hXh52xV9pfZk3ckYLDGmGLWi\nmKRYqtuGwXpfvG6eR4dxRC+5XUQkO2\/pop0O3JY7kQ5mg8GHzuRad5L1NSXKYvTXzEMvfSdiXF1t\nh\/ZSF+Qd18DVYNUXaJYYLXFmnbLGZX8VZBxQQ2O2DQYemWOkbQpG2mdgpGMhRrpW4U2bN4Yb16P7\n4XdoL16EvrKZFNzWGCydQAQtiaAbRCXL0Vkyi9YvJiwiq0+GiLKzM1cPHbnGaM+fjPYCB\/RXEbnH\nK\/GqyRtv2jfR2jUY6fQgXbPwW4sD6VmGgjNcJFNtvbhNYY1EhJeSZ+w2VeSGkysKnPGq0ZII2tEG\nN9roiRERCen+ESM9+\/Frx070Va9EX8Vc9FOJGCwxw1CpMRG1QVfRDIgq3Ekh7elajleP7dElIIIC\nIphngvbbVmgvIo888cRvXf4kcy8hmLCV1n9H+uaRURww8HgJHqaYIeFHVZzeIh8ncWyVUlS0jwoK\nTumjs3g2CbBFp9AKnWTq3jqyXucPGOk9hJG+00TyAPpqvNBbMZ\/c7IDeUgrwChe8aXIli04hggvo\nQKsJ36NfOIlChZKr0QU9ZfZE0BptRTPx68v1JGc3yQwnhOF1exD6npDMR3PxqtkJvVULUZtmibhA\nNYSvk3suEbpCSRC1SRnX96mis8wNHSVONOlaUKw5UEysxK+t20ngQVbgb6J96K3+jhS6o7fEHr1l\ntKZqHrnLA29aPSCi5HnT6Y1Xzz0wUONElllGhBaj474TWvOsqMC7YLhprZjgUfzWcwSDz4PQWuKB\nxlxnPKMhtks4Fw\/5FojZroLQVfKQOLBMUXDSWxH8PSooTzDFQP0S1GdOxvNb9uiu8sTrNnJBzy5C\nCF699Ed3xTKKt9novj+VCJmx2d4jdGD3dRdNwUDt12i\/YUzW+IbWOeAXes+g5ZYl2gqc0PNwKbk1\nkOQF43XHbrLcFjQXzcfTHEc8y3FAU64jso5qI2qrCvYtJ4LBi+UFx1Yr4HKgMm4e0SCSJniUMRlP\nMsllVUvxunUL3nT4o\/\/ZZnSVL6NEmI+ue07Un6dQbJminQpsG3WQVuogLZkG7BXhRbIunqdw8OKq\nNprSeGjKMETzTTP8kmuH1qLZ6KtfjaEXfgRfdFZ4keVmofa6DZ5m2yGfhpKU\/WNxYqMighbJQiJg\nnvzGg9S8L2xVRNp+qoUndFByyQA1fHPaYIvnZPqXBXPohO4k3A2thU5ou22D1lxzqm2GVJp0qVtw\n0HRVC8+pdzcmcGi45aDhijaE57TxjIg+o37emG6K59mWaLo1Dc13ZuElWa25cD5e5LuRQexRnmiO\ngigDGkJ0EEcJcuR7eWxzleFL+LhIa+xeJI8IuvRcCVJF1s+aKDzDQ2mcMZG0QH0GnSzTHjXXpqFJ\nYI\/mWzZkDXM0ZRnj2VUz5F5Qgui+HBJ3cVAbzcGjJHXcOMRFZbwaanNkUHhiPB4nTsSTFEO6IU5A\nQ7olGrKnouHGNNRn2aOOLFeRNAn3LhojJ0IX\/H0aOO2jjBBPOax1kn57bdjuLic8tEIOF\/yUwA9W\nww2KgcKzeiiNMcLDxAmoSrZAWTyRTTVHw\/WJ1G2oLV2l3pk0Ff2PJPHq6Wi0lEqi\/a4s2kq+YtFf\nNxojLz9DHd8SNXHkEbJ09RWaqJNMUUtlhDn8wyQLlF7+G+5eMMQtGs+uHdBEdIAKjlDIbZsjLXrf\n6nxmjvEMnC+HKzt1UBZrhqrESWi4aYNGwVRUEsEHFwxw77wRymMNUZNogNor+qilu0V98lR0l3JY\nIn+E4foxdBAXlJ3VQtl5DkqjeBBeHAfhpfEovWSE6lRLiKiTtJa6ovnuTDy77YzUUH3sXiqLdQ6y\n\/7gVejnISG2dLSs658tB5HpFXPJXRsoedeRG8NBWPAt3TutT++HSTY+L0vOk5DxNxRRfVbF0Q7tj\n8U8JDtYpofayDYrCKGyOa+JOuBYKaCovIDlMzPU\/XYLcE3rgh2ggJlAVJzYp0sXKFJudZfCN1Rcf\nz4IbZkgHHVujhQPLFHB6gzIu+ikjMUgN5VcmofKaDTIOaSL7kAYp0URBuAYKaLAoPj2OCFoTGcad\nkgQpgrQYUugWGpLlJiGHsjIrRB3Z9Df7oAYySU7zA3dUpVpTx1DDhW3KOOurigMUZnG7TLBqqrTg\nd\/MgY0ViLtrhPgY5xybiRckcRG1RorigaZmyOJESKGmnCtL3qpEidWQFj8WdY4Zou2uPkV9UMNKi\nTtAkaImhgZ5KCxrfJiN151gk+Y8Ff6cakglJ1CUGG7\/H1X0cnN2shLsJtpRQrgiYp4jNLnJYaf37\nxybs63s7abctzrLIOGLBFunoHbo4sUYJVWkuOL9ZGfkRprh70RqJ\/urg7xgLQagBOh7QUNE6jmBE\nPdyEYCqGCbVFa9w\/NxlxvuqI81GjS\/kE5Icb4QLJaitdjjAvBRz1UiZdKxEXZMLEHVZMkQ79X59w\nedlJnd08Q4ZOIwcq4jiwXBG5Z20RtV6NvXJ23J2NSr4zYklpwUlzanVEsH0ywYYwlWAnhi1NJtNQ\nkeCIqA1quHfOmgr1TKqVXERvVkNF6nzsW6KInfPlsdVV7h05odcEGal\/+Rhule1XhzfOkPnt+CYe\nimKdkBlpi0Oeiuy18Wm8Hg0SS1ESR3Us0w39j2nq6XCmyceVMIdAE03nXIIbjWmuaL\/vQXXVCs2C\nuTRdU9k6p4ODdGjBxdkojHdGuLfuW3JW0oJ\/i9y710rrL203TJcRbZ09hqwpD6aYn1qnispTPLoo\nGeNlrhtaChZTz6UJputrdjAYEa0kfCPGCvrOAy2FC\/AiaxYaEozw+BIXZ71VEbRAAT\/MGUPxJovv\n7aRGiNzG\/+qBptcECanV9tJBW5wZorLY4S6Pi5vU2adQJeF61DWmUZLMo369igYAb8Jmgg+B6d\/e\nNNx+jbqk6bhPta34GA8xPmOxfa4c\/GaOwfrpsvjWRjrqW0tpjf\/2geufCH8lSOurfcbdOVexkEkg\nhihT1C96a+DyJi3cDpuE9gdLaTT77iN0Cj1RdNoGcd7aiPHWpHhWYIltcJKB11TpJivOaFeSrU5Q\nYHQQPid88u+SY658X4k3jyXwCEZTdEd\/u3iS5C1P66\/qNlEibXaRwZZZMixp\/7ljsN39LX5wk4UP\nfb\/NVZYlxbjyOzvp7gXmklX2475gnvvMI9gQDMWy3xGVFOv+ly\/mNvUlQY6gStAhjCdYEFwIS5na\nrqfyaRRXaVTCeNXPchZZSLatdZAGAyLSpacy6oGO4qe5HIVR6aM\/lYig9UEEb8ISwgyCOWGcWDaj\ng7lmfkH483\/i5k\/euVl8QkaQFkFXTNiUMIUwTUyccdscMVzF3zG\/WYrXjhdbTEssS54gJbbaJ\/\/X\n\/xT4k9jSo8Tx86UYkmK8+zxafMhRYuv8R0T+DqYXywCyjUarAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/pumpkin_lit_4-1344030095.swf",
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

log.info("pumpkin_lit_4.js LOADED");

// generated ok 2012-09-19 17:49:34 by lizg
