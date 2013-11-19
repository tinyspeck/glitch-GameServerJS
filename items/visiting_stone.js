//#include include/npc_conversation.js

var label = "Visiting Stone";
var version = "1351476823";
var name_single = "Visiting Stone";
var name_plural = "Visiting Stone";
var article = "a";
var description = "A confederate in the grand System of Stones and Rocks whose aim in life is to redistribute the Glitch here and there and make sure each has a chance to see each.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["visiting_stone"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

verbs.flip = { // defined by visiting_stone
	"name"				: "flip",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 10,
	"tooltip"			: "Turn it around",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		this.state = "1";
		if (this.dir == 'left'){
			this.dir = 'right';
		}
		else{
			this.dir = 'left';
		}
		this.broadcastState();

		var pre_msg = this.buildVerbMessage(msg.count, 'flip', 'flipped', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.stop_random_visitors = { // defined by visiting_stone
	"name"				: "stop random visitors",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Opt out from receiving random visitors",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// only show we're already opt'ed in
		if (!pc.home_allow_visits) return {state: null};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var choices = {
			1: {txt: 'OK', value: 'opt_out-yes'},
		};

		this.conversation_start(pc, "OK, we will no longer send random visitors to your home street. If you change your mind, you know who … er, \"what\" … to talk to.", choices, null, null, null, {dont_take_camera_focus: true, ignore_state: true, no_auto_flip: true});

		return true;
	}
};

verbs.visit = { // defined by visiting_stone
	"name"				: "visit",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Visit a random player's home",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var choices = {
			1: {txt: 'Sure', value: 'visit-yes'},
			2: {txt: 'Maybe later', value: 'visit-no'}
		};
		this.conversation_start(pc, "Ah — I know just the street to send you to. Ready to go?", choices, null, null, null, {dont_take_camera_focus: true, ignore_state: true, no_auto_flip: true});

		return true;
	}
};

verbs.get_visitors = { // defined by visiting_stone
	"name"				: "get visitors",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Opt in to receiving random visitors",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		// if we're already opt'ed in
		if (pc.home_allow_visits) return {state: null};

		// check if we can
		var ret = pc.visiting_can_opt_in();
		if (ret.ok) return {state: 'enabled'};

		if (ret.error == 'low_level') return {state: 'disabled', reason: "You need to reach level 4 first."};
		if (ret.error == 'no_cultivation') return {state: 'disabled', reason: "You need to cultivate 3 items."};
		if (ret.error == 'no_butler') return {state: 'disabled', reason: "You haven't yet unboxed your butler in your front yard."};

		return {state: 'disabled', reason: "Something is wrong!"};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var choices = {
			1: {txt: 'Indubitably', value: 'opt_in-yes'},
			2: {txt: 'No Thanks', value: 'opt_in-no'}
		};
		this.conversation_start(pc, "Me and my kindred rocks and stones often help random travellers visit home streets far and wide.<split butt_txt=\"Interesting\" />Would you like me to try to draw some of these visitors to your home street?", choices, null, null, null, {dont_take_camera_focus: true, ignore_state: true, no_auto_flip: true});

		return true;
	}
};

function onConversation(pc, msg){ // defined by visiting_stone
	if (msg.choice == 'opt_in-yes'){
		var butler = pc.getButler();
		pc.visiting_opt_in();
		this.conversation_reply(pc, msg, "Very well. I will put a word in for you and we’ll see what happens. I’m sure "+butler.getLabel(pc)+" will tell you if any new visitors drop by.");
		return;
	}
	else if (msg.choice == 'opt_in-no'){
		this.conversation_reply(pc, msg, "Ah, well, if you ever change your mind come and talk to me again.");
		return;
	}
	else if (msg.choice == 'opt_out-yes'){
		pc.visiting_opt_out();
		this.conversation_end(pc, msg);
		return;
	}
	else if (msg.choice == 'visit-yes'){
		this.conversation_end(pc, msg);
		pc.visiting_visit_random();
		return;
	}
	else if (msg.choice == 'visit-no'){
		this.conversation_reply(pc, msg, "Ok, well … come back any time.");
		return;
	}

	this.conversation_reply(pc, msg, "Uh, what? Sorry!");
}

function onCreate(){ // defined by visiting_stone
	this.apiSetHitBox(1200, 1200);
}

function onPlayerCollision(pc){ // defined by visiting_stone
	if (pc.has_seen_visiting_stone) return;

	if (pc.has_butler()){
		pc.announce_vog_fade("Hmm! Over there, near the end of the street … it’s a Visiting Stone!//Visiting Stones can instantly transport you to the home streets of people looking for more visitors.//And, if you want s’more visitors you can get them from the stones as well. Go look.");
	}
	else{
		pc.announce_vog_fade("Hmm! Over there, near the end of the street … it’s a Visiting Stone!//Visiting Stones can instantly transport you to the home streets of people looking for more visitors.//Later, once you get a little higher level, you can get some visitors through the stones too.");
	}

	pc.has_seen_visiting_stone = true;
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Visiting Stones can typically be found in \"dead-end locations\" of most regions."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"regular-item"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-76,"y":-165,"w":139,"h":158},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGwUlEQVR42uWYS28bZRSGK5BALFAl\nWCAWqBsklvkFKGKFVAEtRaU0hV5SkjZtkzRt7onjOIkT3+J77Ph+jZM4tpO0qtRdJCTEgkUl\/kB\/\nQvkHH+c5yVhuKSs8ZUGkTzP2TORnzjnvOe83p079X\/+ePm321Ov53r16oZDNRF5Uy5umuVd8cdCo\n7B+2qteeNKtn\/hOwVqt0rVTYOMplImZ7K222a5n22tnOmka9qOugUX32uFnpeWNgHo\/ndDYTPoqE\n10xwfUXhJHqmXEzo6gS11t5uwTxqVkNvBDAcdL8AjJVJh02zUTLVyqbZiPlMuZR8LeAxZN4c7m+N\n2gq3vr7UA5jf5zLrgWXTEriaRHCrmpJIZszudk5hJMJmM7luKuWXgUm5rTW56prpDfiXNHrh0Kp5\nfFgzWYliSVKrkAIRCrqNe2XeeNecZmpixCTifo0ea1dqc7uScdoGODMx3LvkmtboEaGDVuWlCBVy\nMbOyNKs1yef6bs541hb0HLhaNW1y6WjBNsAJAVx1zyug37f4N8B41GuiIp4Q4pHPS64ZE5R7reui\nekl\/5MhWQJ938R8jmM9FzdLitKH1UKepZNDEIp6OCMcF3m1sBeSHqcFOwGI+rmLh3OdZNPNzD43T\nMaHnyY2Afs\/1vJRArZI2rVa51xZAl2Oil+ghlMSGv11r9L\/0ZkjbDQsB8RC0HsQTk9SvrS7oQx02\nq+awtXXONhXzwxR+RCAO96vHEZTaQrXulTk90l4QRUX6Ivf5PE6Tz0YF0qGt5vH+ltPWNrOyPGuo\nRSJI6oBe9y+rCPg+HHK3624j7tMIcs7\/7jcr9gEGg6saQSD4se2OuiN9nHM9GllrA6bke+fCpAgn\natzLc+ZAAG0be1aKEYpjfty4FqfMDhCbQTmfVkE4HZPauDvV7ZH6m50ZM\/GY1+zu5KjDI9sAEQk1\nSNGXixtaV8VC3LicUwqxLpGl3l6aw1IKPMRePa+fDxrlZ7YATk6OOGnU1CCrIT\/85PGOiqIksDRq\nVPuqqyFy3E\/0ubcpQrEFcHDwqpP0sjRy0v9IGUIhjQ7pfzyAR5RckGvALcvo4z5GYDCwYpZluuzU\nsvaYhv7+PidgRAKRoFoViYiGnscUictRLJl+1ukhcHUxCrQbxmA2HVHX86hV67UFcHlpxlh+kMkA\nELOXFK+5HTrKAGs1ym2Hg8JxNTgd3HZrr2SPNwQQA0D0WPS4Svl4egBRyMckzePapEl9+cSGUZtE\nEhumdSne8bBZcdoC6JWpYPVCn9fZTjOmIHtiEgDuHIGIBHGoiZXpote3M\/YAWtGj3bAvSSWPZzDR\npO7U+p+oWOdycLUNjJho2KytrZQ9gPRAqwZJXSziFSi\/Rmano7WQWmY0gDRwoFEzD4Ca\/d5FewDn\nZseOZ69EkE1TJhVuR6VysmmiLhEQUHzHtiARD+g9fI8vzGVi3QccHh7onZocMdSh98ShWHBWGl9d\nbWg5AtdRnyFbAEeGB3QqYK1qJ1OjeNKU21AiCKLM7o4HQTgIhcVI5H8au8Xuz+ObN\/vO3Oy\/ou4E\nSH6wsVc0W5WUAmFiST39jglCU6dBpxLrJiulwAPhaNjIN+slewzDrcFr5v7oLfPwwR0zdn9I\/F1J\nowaIpVTMgZVO+iGThKM1l+mJ9EpbAO\/e6Vebxb5jYvyeOOiFtrPuTDE9b1HSyZHoomR6JTObaQK8\nLYDD9waOSC9+EICZ6ftag8xfoghQQGqOXkm0iqJY9su0JEqA68DlRGD5fKL78\/ju0I0jNu9WHdKs\niSiztlxKaPRIKVaMKVMuJMTyexTWckL8L5CNeqn783jo9o0jIscCkLRh+XEpQGC1MBCAA0OvpLnT\nklZlFiMgrtV38qZey8a6zff27cHrvyw4xs3c7IO2kkkfEUkmArpZx1YlJZ1qKASWRo3S6YXczz0q\nmmrm126BvSvrtKyPf7xy8bfhez+bwYGrhlSzQWIy5LMxhUDFjDgmDGNQN0sSOVI\/L04HS6Z7ExHK\nQaPSlVbznqwPZX0i67MfLp3\/\/cb1ywZIVBwKrqhIAGTfgaNOSt\/DvLrUwHr1IXA1CIleiC2zXij9\nW7i3ZL0v6yNZn8r6\/Ouvvvzj6k\/fG0YegAG\/S19cAoiKUSzvZjKpkNYnU6MkQiHKtJpNgacu9aHk\n3m5E8B1ZH5wA9nx7\/uyffZe\/M3eG+jXNNGycC6nEEOAJrVcgiMUyE9gyapNz3nDJMZRPR+15R3Ph\nwtkzfX0Xvrh08ZvRsZFb5yRqTlHms3Qq\/Dybju5jpQJe15EIpODzuUYBkvPnayvzzxOJ4Guh\/gLv\nuomHCfBv\/gAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-08\/visiting_stone-1346284506.swf",
	admin_props	: false,
	obey_physics	: false,
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
	"no_trade",
	"no_auction",
	"regular-item"
];
itemDef.keys_in_location = {
	"c"	: "flip",
	"g"	: "get_visitors",
	"t"	: "stop_random_visitors",
	"v"	: "visit"
};
itemDef.keys_in_pack = {};

log.info("visiting_stone.js LOADED");

// generated ok 2012-10-28 19:13:43 by mygrant
