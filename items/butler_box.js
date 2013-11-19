//#include include/npc_conversation.js

var label = "Special One-Time Delivery";
var version = "1353044838";
var name_single = "Special One-Time Delivery";
var name_plural = "Special One-Time Deliveries";
var article = "a";
var description = "Special delivery, just for you! Whatever could it be?";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["butler_box"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.talk_state = "1";	// defined by butler_box
}

var instancePropsDef = {
	talk_state : [""],
};

var instancePropsChoices = {
	talk_state : [""],
};

var verbs = {};

verbs.read_label = { // defined by butler_box
	"name"				: "read label",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Read the label",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (!this.have_read_label || !this.have_read_label[pc.tsid]) { 
			if (pc.location.pols_is_pol() && pc.location.pols_is_owner(pc)) {
				return {state:'enabled'};
			}
			else { 
				return {state:'disabled', reason:"This delivery box is for somebody else. Maybe you have a delivery too?"}
			}
		}
		else { 
			return { state:null };
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (pc.location.pols_is_pol() && pc.location.pols_is_owner(pc)) {

			if (!this.have_read_label) { 
				this.have_read_label = {};
			}

			if (!this.have_read_label[pc.tsid]) { 
				this.have_read_label[pc.tsid] = true;

				if (this.is_craftybot){
					this.conversation_run_read_label_craftybot(pc, {});
				}else{
					this.conversation_run_read_label(pc, {});
				}
			}
		}
	}
};

verbs.open = { // defined by butler_box
	"name"				: "open",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Open the box",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (pc.location.pols_is_pol() && pc.location.pols_is_owner(pc)) {
			if (this.have_read_label && this.have_read_label[pc.tsid]) { 
				return {state:'enabled'};
			}
		}

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.is_craftybot){
			pc.apiSetTimerX("createCraftybot", 750, this.x);
		}else{
			pc.apiSetTimerX("createButler", 750, this.x);
		}

		this.container.apiSendAnnouncement({
			type: 'itemstack_overlay',
			itemstack_tsid: this.tsid,
			delta_y: 125,
			duration: 2000,
			swf_url: overlay_key_to_url('proto_puff'),
		});

		this.apiSetTimer('apiDelete', 500);
	}
};

function onCreate(){ // defined by butler_box
	this.initInstanceProps();
	this.apiSetHitBox(200,200);
}

function onPlayerCollision(pc, hitbox){ // defined by butler_box
	if (this.is_craftybot) return;

	if (pc.location.pols_is_pol() && pc.location.pols_is_owner(pc)) {

		if (!this.have_read_label) { 
			this.have_read_label = {};
		}

		if (!this.have_read_label[pc.tsid]) { 
			this.have_read_label[pc.tsid] = true;

			if (this.is_craftybot){
				this.conversation_run_read_label_craftybot(pc, {});
			}else{
				this.conversation_run_read_label(pc, {});
			}
		}
	}
}

function conversation_run_read_label(pc, msg, replay){ // defined by conversation auto-builder for "read_label"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "read_label";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['read_label-0-2'] = {txt: "Butler? What? Where?", value: 'read_label-0-2'};
		this.conversation_start(pc, "A special shipment from Tiny Speck, Inc. Greetings and salutations! Inside this package you will find one, slightly worn but very loving Butler!", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'read_label', msg.choice);
	}

	if (msg.choice == "read_label-0-2"){
		choices['1']['read_label-1-2'] = {txt: "And...?", value: 'read_label-1-2'};
		this.conversation_reply(pc, msg, "We made the Butlers out of some old dolls that were originally made by the Toymakers — who existed in a previous world that the Giants never finished imagining — so we kinda had to guess about how to hook them up … ", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'read_label', msg.choice);
	}

	if (msg.choice == "read_label-1-2"){
		choices['2']['read_label-2-2'] = {txt: "That’s good!", value: 'read_label-2-2'};
		this.conversation_reply(pc, msg, "Well, they may still have a few kinks, but your Butler knows how to do all sorts of interesting and helpful things. For example, it can take messages and packages from visitors.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'read_label', msg.choice);
	}

	if (msg.choice == "read_label-2-2"){
		choices['3']['read_label-3-2'] = {txt: "Roger dodger.", value: 'read_label-3-2'};
		this.conversation_reply(pc, msg, "So open me up and meet your new-to-you Butler.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'read_label', msg.choice);
	}

	if (msg.choice == "read_label-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_run_read_label_craftybot(pc, msg, replay){ // defined by conversation auto-builder for "read_label_craftybot"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "read_label_craftybot";
	var conversation_title = "";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['read_label_craftybot-0-2'] = {txt: "Oh, great. What is it?", value: 'read_label_craftybot-0-2'};
		this.conversation_start(pc, "Special 'End-of-Ur' delivery.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'read_label_craftybot', msg.choice);
	}

	if (msg.choice == "read_label_craftybot-0-2"){
		choices['1']['read_label_craftybot-1-2'] = {txt: "Uh ok, what is it?", value: 'read_label_craftybot-1-2'};
		this.conversation_reply(pc, msg, "Well someone in Ur has been busy working on this for what feels like forever.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'read_label_craftybot', msg.choice);
	}

	if (msg.choice == "read_label_craftybot-1-2"){
		choices['2']['read_label_craftybot-2-2'] = {txt: "Cobble together what?", value: 'read_label_craftybot-2-2'};
		this.conversation_reply(pc, msg, "Figured since the end of Ur was nigh, we'd just cobble some together and let you play with one.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'read_label_craftybot', msg.choice);
	}

	if (msg.choice == "read_label_craftybot-2-2"){
		choices['3']['read_label_craftybot-3-2'] = {txt: "Seriously, what is it?", value: 'read_label_craftybot-3-2'};
		this.conversation_reply(pc, msg, "It might not be perfect, and might need the occasional 'Kick' to get it back in commision.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'read_label_craftybot', msg.choice);
	}

	if (msg.choice == "read_label_craftybot-3-2"){
		choices['4']['read_label_craftybot-4-2'] = {txt: "...", value: 'read_label_craftybot-4-2'};
		this.conversation_reply(pc, msg, "Just open this box to let him loose.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'read_label_craftybot', msg.choice);
	}

	if (msg.choice == "read_label_craftybot-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"read_label",
	"read_label_craftybot",
];

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-32,"y":-101,"w":63,"h":101},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAIuklEQVR42sWYa1dT2R3G\/QbzEeYj\nuLq6xnZWO8N4qaMjIwJyMVxyv4ckJCSQewIhJIQQ7gkBkgAiQQmojIiCRvGGrYWZ6au+qa\/62o\/w\ndP93OBmsY2fao6tnrWflnJMszo9n\/2\/7HDv2Xx77a6GqV2sh6csVb2Cv4C0JerHiOXh5w48\/rwbo\nPLlX8NTsFz2fHvvYx37Rd3wn5yhtZ+1vHi1049myG3sr3l+vguf1q9Xg+sF6n2V\/o\/f4BwfcXXBV\n7V514cmSGw\/mu7GddeD2lBkEW5p34ij084Kncp90f9aOrUwn\/+6vayEc3Apj\/2bfm1fF4PrLVb\/0\n1fXuT0QDPlxwVD1e7IGgFwUv\/rIawNNrHmzNduHujA1rY0bsZLsqYNtzdtxj958sudhv7CgkdMj0\nSpEKtmPC14p0qHxOinTWS0UB3l\/wVW3M+ZCdDGIpO4jV5SmsF\/PYXktx4L0VH3dnM2PjsCXm4H0G\nSA9PuiQY9bRgxN2CuLP5HQ11X0GyRxIQBfjj7lpVfimHwvV5pPNzCI5NQRZIIDgYwVFnjyo\/oMKk\nv70iAh3uuYIE01D3T3CH34sENF+u2ZrohzU2xhVNpbH34Dp2ipN4cs3Ltcvic\/eqm8G5mIM9yB0B\nnPC1cY17W7mTBEufY+z68L44wL+ZLwd+NDdgr5jhgLpwEt\/vFvH49swhoIeDkXPl+OvCXL\/iLQdT\nobevj8InnM3iAH8opgI\/pEP4fi7Cwe4Vp7G6OIrNawkO+Kzg5yqD9uBB3oFsRMkB8nEztlbGcTM3\n8LOA4www7mxKigJkDw3w2KJSw4AEt46KSgtl8RZLkrusrMyElRzq8Xf5iv7dRXKP4jDuaC59GMD3\nqDRfhiPnCHT\/7iS+Wx7H9VwCO+uzFcDCpPstwFFPK49H0YDsocn3wd0Yt+Fmyl65fl6M4Z9\/f8GB\nNpYnKoDzUxFsF1PvLDEBRrsaxAFuzXSWNtmykVMzUTOujXRWgAwaGVd+yFKOv5wD\/9jfqrhGkNPD\nfvS6TLiWiSGf6OTZS+5RJsccjeIBHy32lGjpCiMWaJVt0DOg2xknj0mC06ulMOtkeJh3lsGvBViG\nz2HrRpo7NzHoQTxk55C3F+IcUEgQqoniAee7S8JyCkBjIT020jZ+LrhI3wvObi70V5aWHCQRJEFn\nwppKkpCTA3aRgPdm7SVKgnus7wowRq2CiwDJUYNWjnTUiqeH5WZ+UMcBBRdpeWm51xeTmIuZKklC\nHSXcWS8yi6+6Sk+XfbzEWI1KDsOlKX8adWXYybCRdxMCzEfVWJsruygkyoP1mQqc0F0oScJWkYA7\nc13cQRaLiHgMMBnU6DBquOjcqFeWAftNPA5pUMj0yjDVq\/4pWa4mkO5VvZPF5KJowM1pa4mKLxXh\nVNiA8T4DbkzYWEZa0dWhOHRRiYWkHeT0Q5bt1EkoCdbzUV7\/hL77c90k2HFJHODusrdEwwCNUcXJ\nTiwlrRj06rGdc3INenXQqdpxZ6aLlyJycaZPzocDIWPfJ4IWDfi04CtR8D9bCeD59SASITOyCZaR\nWRc8di1upbuYk8r\/OG69T1QLPwjgs0NAWsIBr5HH4kLSxhNnLd2N8X4rHxiEZKIk+TWAg44m8YCU\nxeVZrwc7+R5MRcw85rgOyw25KAwU9Nv8wC8D0vLHGCCTyBhc8nBA0mividdBikGhJro7Vb84Ub9v\n1OJbAdHDAmt1woMnw6YKGEHS9UjQ8NbAQG0x21+eB1NBOVZSfVhJBzDdp35nUIh1NaLPUisOkI1R\nJaHPEpAgSgwB1mtX4z7bjgqaZnWQAHJxC3ZYfEYSMYQH+xH16bhrNAdS\/EVslz\/ENGPLUR0MOVS8\ntW3OOBD3GzDa14HUgIUVahW8Dj1PkEdsP7I1a8NsWM4e3IiVJCs7pgZ094URiA6gvoMV+2iwPOqz\nDRS1OtExeHfGGlhOmqCWS+CySLEQNyITMaDXqeI1MBPtwDwr2kKcEuTioIZPKhsRKx61n0ViKAKF\n08edbOpwVnZ2pD5rrXjA8ZCGA\/ptcmRjBu6mSSfFUMCEYsqBFMvs5VEbL9T0NmE+quIOrSR78LCz\nBRtJHySdHkxMDWN+IsABefxZ6xA0XxK3aSqOGgL9ThlkrY2IuRUI2KRwW1nwj1oR9Wjhsqr4wGrR\ny3F7yorVUSOmQzJh+TDZq8WduShmMyNsw5VBLmHj8UdwIfMl+E0XxQEuxlSBdK8CamkDBl0y9kAN\nxoIaWPVSBidHoEvNASk+qT\/TpoocFJaQ3ixQ1s4P27GajWLCL+Ob+P7OegRMNehSnBMHeGvSHGCC\noLhbiWxUx4cHmlxoeCXp1e3oMraiMKxjNa61AigkwzC9XaBN0qGz5J5bewEmySnxS0xglMmkqEsF\nj6WdLyUp7JCiv1sJjaIVDpOU\/ybLNu5H38EMH75NKAM2sRGrDnblBRha\/gTV5S\/FAWZCMstCTA0B\nkjKasnnEzwpviIFJ65H0SqFsq+dhsJzQYcrf9s6LIoviEpzaWrj0tai7cAqSmq+gbDwNRd0XOVGA\nPm318bC57s04Gy5zrEOQaxtTZtxJW\/lSD7llmAjIQf\/E4qAaN0YMHNBvqoNRVgNt27ewq2shbbrA\nz23KakgunYS2+QyXvP4LcWWGjoYzv\/2k\/eLnFre2+vUEa\/IzrFNcjWt4vBEQwQmiPjzilqBTUY1A\nx2XuXLeujn8KsKor57l7BGhpOyMe8OgRNtfWjLiulCjOCGiWDacsDHjcCffibL9rbDvHwZSSai6P\nsZ5L0fQ1Tld9jvpvvoSq8SSuVP8eH+XdNS19n6UuN+KSvBnpkbBlbcd0UMo\/CZDc8ei+hYmBttSe\nhrr5LPQtZ6FpOgVd80loGqsOJNW\/s9DqfNSX7PQAj\/6itNdUexAy1aLfUs\/KRzU62s7yRCBRtsrr\n\/oiG858dMCWbzp44fuz\/cdR985tPG77+zNJ47sTrxvMnOBBlqbz2D1L67n\/5m\/8CLaAto1BLzjAA\nAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-11\/butler_box-1353043841.swf",
	admin_props	: true,
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
	"no_auction"
];
itemDef.keys_in_location = {
	"o"	: "open",
	"e"	: "read_label"
};
itemDef.keys_in_pack = {};

log.info("butler_box.js LOADED");

// generated ok 2012-11-15 21:47:18 by tim
