//#include include/npc_conversation.js, include/npc_quests.js, include/npc_ai.js, include/takeable.js

var label = "Shiny Hello Pumpkin!";
var version = "1348102174";
var name_single = "Shiny Hello Pumpkin!";
var name_plural = "Shiny Hello Pumpkins!";
var article = "a";
var description = "A brightly-lit cute kitty pumpkin lantern. As cute as a vegetable that has been set about with a knife until it resembles an animal and then set on fire with a face full of insects can be. Pretty cute then!";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 151;
var input_for = [];
var parent_classes = ["pumpkin_lit_3", "lit_pumpkin_base", "carved_pumpkin_base", "takeable"];
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
		'position': {"x":-27,"y":-47,"w":49,"h":47},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOsUlEQVR42uVZB1SUZ9Y2v7sbNatS\npCMMw8zQBQELAopoEI0uYolEjYJGrGgQCxgF7AXErhFUsKOA9N4ZmnQERWlDV+ogDBCTPzx7vxly\nNrtuEnf37Dn5zz\/nPIc588133+d97nPvfb9h1Kj\/D6\/9ztITvfYphfv66qRfvTE93O\/ClPW\/K4IH\nvp7k5e2uAr\/z+vC\/a44LV4xw5JC6gCH+uyB43JvldcBVDntdlXH2nB5On+Lh4B4FuG2V+n0oefI4\n22vnDiUcPKQJd3cWjhzl4EuHMVi76o+G\/7VFayPnra9PWy2sz3ASCjI3eNUVOf9iuo4fZXu5bFfE\nGT99fOPJIZJqWPv5x8IPWefxGcs50ZdsBOm3FuLZI8tzH0yw5QkXPUlctKeaQ5C+GnUZTqW\/RPLw\nQbVdu3cpw4\/Se\/7SFOx1UyaCY7x+a41Hp2evj7k4D2UPZqIzUQvCFC5eR3HmfBDBjlguRPnWEJU6\nopduFCR8xpAU1PM3vJe2Q3sV5+xzVcTJ4xx4e7KwecNEfLlyzK8u9OCE5bm4C5aovq+Fznhaq+Az\niIpXQZjM8foggu0MwbzZEJWsFe+s8TEXVY+tUJPmKKyIXvV3JOvvaah\/s1sehw+oYp+rAhzXjEO8\nPy+QWawtVkP9H2PfP24eGHPGDEWXtVH3gCsh+NQWoqKVH0bw1U0Nw+YwLroTuWJyb6K5qL3PRekV\nHvKumqHwkR0ao6eCVC6tvc8RvLjJxXkPeVC7wfavJlBxjEGinxpe3OLiZRCpH8xFazht8okWos5O\nR\/ixGUjx4qHwPE98nbnG2EmYzEVbBCf8NwmWXOXMqb4jUa0plCveZWUAF\/lneUj25CH2gD5iz89C\n2EElVD9go4G+F+mrCg8XGexyniCu4BRfFqoCueJrbRFcRB9RRrCnFiI8pyJmrxYSPHjIOc1D+TUe\nau7SOiGStWrvcdJ\/k2DhBU07Ri2G1PMbXJR\/y0PBOR74p\/TAP2eOgusWKLtriqYoPbxNkyjdHkOp\nipOAscfrKC5awiXkekiZ1ig2ym7rovjmTGT5kYKHTZDqTRnx5aHsKk+8DoOya9xfJ1gZqDjt6XnN\nXv4Jyc35hMpbBmiImY+BFy4QVblB9MyJTL0EIr6huIC6EyTpYd4zYNLF+IqxBkOSUaY\/nXyWO0vs\nM1EFE2c\/WlJWoDzABLk+f1sr+wxHUHT9FyZQyW15s5Kb6r3ZPhzEuVMKznLQncbDYPE0DJbZYLBi\nGQaercBAySIytRmR4YjJMCqKMrXEhEVZemIyjHcZkoySjJ8Zn4n4+hAVzsVAmR0GKlZisJwqt8gC\nPZm6qCAfp3hzkX6MA\/7FyYHvkUPrqHE5VyY\/f+qvgTIyd00ID8IcPSJigKFiQtl0giUGS2dhsNAY\nzVGaaI9j420qhxY2oJY0nxa3lyhLSjEkxX00VkKu4REHnQmaGMjTxWDRdAyWUJySmRgoMsLbfD10\n0cYa47RQRLZ6GsBC9FHVXX8jh1Gj+ddU3PhX1FFCxdGUoIeODCMI80zRXzQDA6Uzidg0DJUYU3AD\nNMdpo5nS15uuif4sTWpHVtQv10FUSekv3zKSfgNxuhlPMj5sCmOj6Ql9P4eLgafatEl9yowRKWiC\nt09N0ZVtita0qaiL0UfhbR6S\/Fi456YkaVFoniCT4KvWknGZjVcROmhONkZL8my84c9BX4Ul3gnM\n8K7OjIhSOnJNUf3EgNKig7dZHAzkEMECUu\/ZNoiqfSF67iHxWTYtnCpJc1sUBy0RmmiKIMtkaKM\/\nfwo15an4XmCIdw1mGKqfh\/5Xy9DxdAEEidNQ9sgAmVSYD91VvRj1Pkq\/ruAQf0Yd\/OtcVEeZQhBr\ni\/Zcawx3EDoXjmAehqrnQhBvgW6+CXqy9Ikgj4gQwXwLcUMXVewiBZ3fU\/B1NBut0ZpkCy28Sab7\n8kxow8YUfzrBimJ\/KsZA3RoIK75EVRRVur8uHnupCxmCH0eeUAqKPcNCfpA+mlPtSUF7fN9ig+Gu\n5RjuXidB1woKsoB2aY2eHDMImQrO1kYfnzyYoysZi4V2komQMxN9P\/Ngm5ggqRijjdfJhhh8aUrE\nzCges4Y9xf+C4IAf2pYSwQ3oKF4N\/k1DRJ7RxCi8GfXJIy\/lghgfNp5HzMGbXAf0vbDFYMMy9Nds\nQu+Lbeit3EgBtlCwzzFQbUtptkQPfyqpSGnO5KAvk01VPFIs9BlDjmk74iomYq1UUC3k2eYYPSJo\njO8bLYicLX7sWIWhRmcMNu7GQJMrhprXoa9qBbpL1qEw2IKaP09C8KGnUkHkaQ3UJS+GsHwVvmsk\nooUk9wtX9NefQBvfgW7eJlbyXZMdunIsqeqM0ZWuS22IlErRZGaoOKUMsZ5ESWolfZCDZsZ\/kRKC\nrckmI8otw3ctTuh9vgmihrPorT2OjnIXDAqWkr2+QNkTa4T7aEkIBnkoFYSdYKEl73OIXq1E1zMr\neu+AznJS76UHOos34LvWrUTQiQjao5Nvjo40I7Qn66AjkYOOeDYzl8WkOuIkU0U8SejI1hjCQQNV\ncAMRbYzSRXMCea9rsTgb\/dXr0FVKWar2RnfVAbQWbaH3dmjNsEd52HyEnuKC8eAfAvbKJ9\/3VEVr\n4WoM1juikW9NZ8C\/oPXpGnSUfoXuMif80LFJrOAPbcvxJmMGXidNQWu8FlpjNNFKCnVlqKCvUB5v\nGRTIo\/epPBpD2ah\/qIm6YA3Uh2iiPlwbLUkmI75zgKhmDV7nrkF76TYi5wwBfzWt\/RnVwSIUPZyN\ngH1qELeZmwcmud1yV0ZagCHq0hajLGwWXsbORX3qYjRl2aPvlTN5xYmwjlKwVqxCU6wuzWLqb+Fs\nMZG2NGrAr+QxVKtIbUmZvDqPNsFB9R3CPQ1UP2Sj+jEPDbGm6C5dip6yZegsWI6mZDs08FeiLn05\nXiQsRkmoFUqJXNwFA\/huVpQQTLw1dvIVF3k88FZFwgUucgINUBo8Hc8jLVAdP5cIbsRAPfW5mi1i\nsvWR+qino1PtYzbqQtRQH6pBKdRCc6I5XmdaoSNvPjpyrOiahNiL2+qoCGSh8q4mnj+cgppQGzFq\nn9iiJsqGxJiHiqi5KAqxQFaQKWIv6uH+YQ14LJcN\/2mSfHRhq0xCgJsSwo6rI+kinVxu6KHwnhE1\nTRNUhprQroxRfGcKqkJ0URWshSpGkUcs1BI5QTiPzoekaLw+hmrU0BxvgMZY2kSkLhHh4cU9Np4F\nqaP0BotOMxw61Wih7L4eyoMNUUrxix9OQ95dE2TeNELcRR0EH9OA7yZFbLX62VPhyXWy9j5fySE\/\nYAaKQ1SoD6kjjY5c2f7ayL+lg5zrWsi8wkFJELOABp4\/0EZ9tA7qIrXppGOI5qTpNKrMMdxuiLaM\n2WihZ5mmhBloTKDemqJHE8oEhQGTkXtFDbnX2Mjz5yAngOIH6CD9mjaSLmkh5w6L0jwZcX5G2LVQ\n+v2HroPLZQQhdEYrDZ6CbprBXSV6aMnRQmW4JhLpAJrgo4aMC2oovKFGqTJBVwH5qVgXjSmWaOUv\nxOt8auxdS9Be8AVe5y1Hc9ZC9DyjOV5rgZpYC+RcYyHr\/GQk+TBQQ+JZFqqTqLLzqOlXmkJYZoHc\n2wY4u1Edm6yk3j\/RbLeRWu9hLwvfDXL4dqcCok5rIzdwBvJuz0CYpwqekEdjjyshm1Qoo3Q3JX2K\n75uN0VNhi+6KNRho3I5hoSv93QNhtQuEVWvxv+1LaPGleBltieyrHCT5qiHqsBJCD6ni0TfKKAmz\nRnrANAQf4VBa5bF3sQy2WUth4ywp9X96JtxpI1WaddkMtakyaMoZR\/1wHKoTx+O2qxKCXFXw+CBV\n+3kWCoJ0UEsG761cImkbPTsw\/PYUhkU3CLcw3OdLZPeIG39b9kpqG6Y067UpC+oIOaSCWztVEOCi\nSM83Csi9Px75j8bTOlwknZsJR3OpX34+3r9Y3tB\/FxehRwwR42OKpMszkRlgCX8XNfhvV8YDdyXE\nnlYj\/2ijItSC0rcAP3atwnCvG5G6guHBFAn6\/TEg+JrayhJUxS1Ewf1pyCSvxZxSE8e4ulkZdzy0\nqLXNQdwlc0ScmY6Hh6fipCOrNHk\/+9d\/09mzSNbOxUZa6L5UFl4r5XBijTx8HRVw8Ssl3HJTxGNv\nFTI1PUTdMUZnkT2+a9qIH7s3k4JHiNi3YnJDLZ5UIHaoj7dDCY2t7MCp4ntCj6jixi5FnHWk5+jV\nCvBcIYd9SyZhh40MnMwnljqbfOAPTrttpAx3fCpVv+8vsji4XA5HHeRwep0CLm2Vw5395CFqRynX\ndFEebk0z1BFDTespzc6k5G7CPnTSVKpJpJEVYYucu\/SQdFUX4TROA\/cpwcdRHkdXyeEb+0lwWySD\n7fNlsNlKOvyDyf30cjYZNXGrtVSq60Jp\/KTmsdVyuLRdDoHuinhySgOJV3RRSN2\/vZSZq+vRkb8a\nrTQVaqI\/I19ZISNwGuIv6SDsJJvuUYafsxypNgnutPGvbYnYXCnhnkWTvP6jH5I2Wkup714oHb5n\nsSw8GKKrJsFvkyyuuyngweHJiPDlIv6yPpKvGyH1hqkYSfSemQhhpzl46K2GgD0K8NlAxJbKiFXb\ntUAWDjP+fIjCyxGkCGMJo\/8dfn8k\/Jkwacd8GdedC2Se714og3120jiyVhpnN8vhmqsigg6o4p4X\nFcARFpFm4Y6nGm64q4iv+W2Rw8EVsnBdJC32msPMCdm6Kh9voZjWBCOCNkGDoESQIYwj\/M+HkBs9\n8mVZggpBk6BnqjFmnZXOuGP2Jp8kOlmPr92+aHzzoS+k351wksGpjbI4RUodWy87vGPJhH663ve5\n2YQ+C95YgbbSn3JkPxl9j2IcIzBPbasJNgTjEZIsguKIomP+FRXHjtykQFAj8Aj6BDOCLcGBsMmC\nO+bBp\/pjU+fpj82Unzj6Kn12ivn5kODNdDCCC8GJsJwwj2BC0B3ZuOpIuscT\/vCfWJJR9U8jaZcd\n2TGjLtP52QTOyAa0fgbuyOcaIxuUHdnw+JFYTMyP\/k\/+B+GvVwDRGWnm9QMAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/pumpkin_lit_3-1344029997.swf",
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

log.info("pumpkin_lit_3.js LOADED");

// generated ok 2012-09-19 17:49:34 by lizg
