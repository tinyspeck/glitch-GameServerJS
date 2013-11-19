//#include include/icon.js, include/takeable.js, include/npc_conversation.js

var label = "Icon of Tii";
var version = "1354842447";
var name_single = "Icon of Tii";
var name_plural = "Icons of Tii";
var article = "an";
var description = "The ultimate decorative item for the true follower of Tii, this Icon of Tii, made up of eleven Emblems, contains powers far beyond simply looking pretty. Great blessings can belong to the appropriately observant.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["icon_tii", "icon_base", "takeable"];
var has_instance_props = true;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"actions_capacity"	: "20"	// defined by icon_base
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.actions_remaining = "20";	// defined by icon_base
	this.instanceProps.testing = "0";	// defined by icon_base
}

var instancePropsDef = {
	actions_remaining : ["The number of actions remaining before tithing is necessary"],
	testing : ["Set to 1 to cause a bestowment check every 6 seconds which will always result in a bestowment"],
};

var instancePropsChoices = {
	actions_remaining : [""],
	testing : [""],
};

var verbs = {};

verbs.pickup = { // defined by takeable
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
	"proximity_override"			: 800,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_pickup_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_pickup(pc, msg);
	}
};

verbs.furniturize = { // defined by icon_base
	"name"				: "furniturize",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Turn into a lovely wall decoration",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (config.is_dev && pc.is_god) return {state:'enabled'};
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


		var pre_msg = this.buildVerbMessage(msg.count, 'furniturize', 'furniturizeed', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.tithe = { // defined by icon_base
	"name"				: "tithe",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Insert $cost currants to support the Icon",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_tithe_conditions(pc, drop_stack);
	},
	"effects"			: function(pc){

		return this.icon_tithe_effects(pc);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_tithe(pc, msg, suppress_activity);
	}
};

verbs.ruminate = { // defined by icon_base
	"name"				: "ruminate",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Soak up the happysauce emanating from the Icon",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_ruminate_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_ruminate(pc, msg, suppress_activity);
	}
};

verbs.revere = { // defined by icon_base
	"name"				: "revere",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Let the Icon replenish you while you adore it",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_revere_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_revere(pc, msg, suppress_activity);
	}
};

verbs.reflect = { // defined by icon_base
	"name"				: "reflect",
	"ok_states"			: ["in_location","in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Dwell a while on the true meaning of the Icon",
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		return this.icon_reflect_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_reflect(pc, msg, suppress_activity);
	}
};

verbs.place = { // defined by icon_base
	"name"				: "place",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Place this Icon on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.icon_place_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.icon_place(pc, msg, suppress_activity);
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
	"sort_on"			: 57,
	"tooltip"			: "Or, drag item to player",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_give_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_give(pc, msg);
	}
};

verbs.drop = { // defined by takeable
	"name"				: "drop",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.talk_to = { // defined by icon_base
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "I have something to tell you!",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		if (convos.length) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 1;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var convos = pc.conversations_offered_for_class(this.class_tsid);
		for (var i=0; i<convos.length; i++){
			var conversation_runner = "conversation_run_"+convos[i];
			if (this[conversation_runner]){
				failed = 0;
				this[conversation_runner](pc, msg);
				break;
			}
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'talk to', 'talked to', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onCreate(){ // defined by icon_base
	this.initInstanceProps();
	this.initInstanceProps();
	this.apiSetHitBox(300,250);

	this.tither = null;
}

function conversation_canoffer_icon_tii_1(pc){ // defined by conversation auto-builder for "icon_tii_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_icon_tii_1(pc, msg, replay){ // defined by conversation auto-builder for "icon_tii_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_tii_1";
	var conversation_title = "Voices of the Giants";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	if (!msg.choice){
		choices['0']['icon_tii_1-0-2'] = {txt: "Ping-ping...", value: 'icon_tii_1-0-2'};
		this.conversation_start(pc, "Beep-boop. Eeeeeuuuuuuuuuurgh, ping, ping.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_tii_1', msg.choice);
	}

	if (msg.choice == "icon_tii_1-0-2"){
		choices['1']['icon_tii_1-1-2'] = {txt: "Enter.", value: 'icon_tii_1-1-2'};
		this.conversation_reply(pc, msg, "Connection made. Tii is online. To progress with your supplication, please click “Enter”.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_tii_1', msg.choice);
	}

	if (msg.choice == "icon_tii_1-1-2"){
		choices['2']['icon_tii_1-2-2'] = {txt: "You’re welcome.", value: 'icon_tii_1-2-2'};
		this.conversation_reply(pc, msg, "Tii would like you to know that your donations are important to Tii. Tii thanks you. Please click “You’re welcome”", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_tii_1', msg.choice);
	}

	if (msg.choice == "icon_tii_1-2-2"){
		choices['3']['icon_tii_1-3-2'] = {txt: "Excellent news.", value: 'icon_tii_1-3-2'};
		this.conversation_reply(pc, msg, "Tii believes that come the next great age of imagining, the logic and logistical perfection of the way of Tii will win out. Click “Excellent news” to progress.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_tii_1', msg.choice);
	}

	if (msg.choice == "icon_tii_1-3-2"){
		choices['4']['icon_tii_1-4-2'] = {txt: "Hello?", value: 'icon_tii_1-4-2'};
		this.conversation_reply(pc, msg, "Tii says “Correct”. Tii would like to reassure all loyal Tii-ites that when the time comes, they will be remembered, if not fondly, then certainly fairly. Because as Tii always says, the...", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_tii_1', msg.choice);
	}

	if (msg.choice == "icon_tii_1-4-2"){
		choices['5']['icon_tii_1-5-2'] = {txt: "Dang. I think.", value: 'icon_tii_1-5-2'};
		this.conversation_reply(pc, msg, "... the ... eeeuuuuuuuuurghhhhhhh, ping, ping. Connection lost.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_tii_1', msg.choice);
	}

	if ((msg.choice == "icon_tii_1-5-2") && (!replay)){
		var context = {'class_id':this.class_tsid, 'verb':''};
		var val = pc.stats_add_xp(111 * msg.count, false, context);
		if (val){
			self_effects.push({
				"type"	: "xp_give",
				"which"	: "",
				"value"	: val
			});
		}
	}

	if (msg.choice == "icon_tii_1-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"icon_tii_1",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Icons placed on the ground have a chance of bestowing blessings when you walk past."]);

	// automatically generated source information...
	out.push([2, "You can make this by combining eleven <a href=\"\/items\/591\/\" glitch=\"item|emblem_ti\">Emblems of Tii<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_vendor",
	"no_donate",
	"icon",
	"emblems_icons"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-45,"y":-86,"w":91,"h":76},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANzUlEQVR42tWY+VNUWZbHq6tcyyqx\nXApEBGRfVGRRENAEWWTftwQSyCRJtmQRkFV2SECWZEv2HUFAWUQ2BbXHaLs75pf6cWZiKqJnoqd\/\n7j\/hO+e84hHa3YX2\/DZEfOPdfO9y7ueec+59952vvvr\/+KdWqx3i4+MLEhMTf5LJZAgJCYGvry\/u\n3bv3U3Z2tiQjI0Mil8sl9EwilUr\/Tnz\/H4mfBQYGFkgkEgQHByMqKgp0\/68qlWqV7Ka2trbqfRYu\nJyfnp4SEBAHKzc0Nt27dYjDcv39fuBcdHY3IyEgEBATAz89PED9j+fv7H4h\/cx8COnjObZbYh+07\nOzsLoASPuLi4v+bn56ceCkieOzBub28vGHF1dRXEbdbNmzfh5OQkGBevYvtv5ejoKIjb7u7u8PT0\nFGy4uLgc3Gfb\/IxtpKSk1B4KyN4TvWFtbS140MPD48AwG71x44ZgmEFZPNg\/AhL7snhwtsPhvXPn\nDm7fvi2I7bNdfsZXhULxZYDswWvXrsHO0hS2FiawszCFjdllWF0xgoXxJZgbG8LCxBBWppfoHrcN\nYGl6EVZml\/av9MzMiNq\/XFnW5pfJngnsyaYd2bS3MoW9tbkwQfYgQ34WMDY2VvBeWFiY4AHD00dh\nqHcUl84cgfG5ozC6cBxGp4\/QvSO4qPcNDE5\/DX2S4Q9Hoa\/3NS6dPQKj89SP+hpTX5MfT+5fTwhX\no3PHYHSWnp0\/gcv029jge8HDYgp9FpAXAa\/Y0NBQXL9+nQC\/hgkZNT1\/nHQMZjwgDcBtUx6Q2kb6\nJ+EbEggvWplBkcHw9r2Ji2fo\/4Q+v\/Qz1T+OKwYnfpE+wZ47IjwzMzwtpAPDccg\/CxgTEwMfHx8h\nzLa2tgRzhACPCrrCg\/14XNAVg+OwNDxBEEdwy\/M68rOTUFSQDmVaOHyCfeDl7UlQR2F1+XvSKVgZ\nfQ\/zS9\/BUtC3MKf\/NSNYC6MzQqTEnPwsIIMxIG8fNjY2uELhMmMwmrH5j8fI+CkKzxFEBbojOSEA\nKXGBuHnNAA8KYyBLvgdHB1NII8wRFh8CWZwPUuL9EUoetTL6DtbGp2FNwDYmekLbhmR5+QcBUPQg\nRe9wQN7zOMSch7zNMNSVC0eFqwWFyfLicciTgiGXRUCVGomsZE9kJTgiN+0OVFIXJIfbQBVvDVlm\nBvLld3Hb+UdkpcuQrpCSB0\/B0uhbgj0FO4K0NdWje3oCIOcgA9JucTjg3bt34e3tLUDa2dnBisJg\nTl60vngSVhdPIDsjBvmqBCSEOaFQyaF0QpHSG7FBVvB314c0WoLUglwUZXihOMsHqelJeEhXVXos\nCtQyeLnZkPcY8BRsKPQ2xmcOPLi\/T747FJD3O96nWFZWVjA79w1sDI8JSksOpQVwmwZ3RUWONx5l\necPPzZg85QJXBwO4O5rA2fYyIlLiUKRww4MMb6RkZaEqPxCV+b6oKFagIDcV9ibf4arxSdibfkvt\nM8IiYe\/t75OHA4obKYs3ahvymq3hScQFuUGuzqbcc0ZFrh8eqb2QV1aAsgwPqGtrkZatgiScXn3h\n\/pBlZOFh9j3UPAhFelEO\/CXWqC6OpN8hFO4YgkzGdbPvcMNCD05WF4TNnh2z75x3nw3xp4DHYGd6\nAnddLcnQVVSS55qKAlFT5Iu80mI43bJFjDwJ+dXlKG5uQJwyDdqeBnRrihFLuZqek4bghEhEJMch\nNjUeTjZ6UCpi4HZVn3QBjlbnPwH8ohCLYeZVnB7jheAgX2SWFCOzqASJ5KmuMn80lgYhPEWKsZFu\nDPbXw+OePQrqHqG4vgLppYUoqn8ETVspWutkyK4sRaRchpyyIqQVF0FWkI\/wEE9ky4PhYn3h4DX4\nRYDckSUCZif5o6VZCaUqFiP9rSjMD0aSPBntlaHo7G3D2FA7RgZaMNLTgsGeZjzuKEVgFK3sshIU\nNtYL\/xcli4OflxkaSu+i+aE\/ynLj4ePrhrqqTLjaGRwA7utwQPGdyLNhwAJFGNKlHpjojEfjQwlK\nMj1Q3q1DoL85psYaMDPRi+nxbsyO9cLBxQYRsSHo6KIQt+cgPkOJ0pY2DGlC0Fd7H\/3NQXA0PoaM\naHs0VaWhpjIDTuZn\/2+ALM7BEmUoasrkuGb4GwwOU4j8rhC0BHHJ4Vh4Uo2F2Q4szPVieUGHsJgg\n\/ObrrxAdG4DJHhUSlTI8HuhGR2MS+mu9Md7oi6GmYBQku6KlWglNg5oAzwiAX5SD1FGPAVm87C0t\nLVGWFYnW6myEWOshL9wR7SMDqGh8gIRMBaYHFLhscxHPJkswM1CAkpIkJCjiMdyXj9YKfwTH+6F3\nTIeZnnQMN4diVBOE8bZw9GsyoHusRmfrA9y0PCucZsSFeSggQUlEON44zc3NoZb5oaNOjZDrl1BZ\nqsDSUBqySwvQOtyPqb48rC5WY3FAhbHuFAy3xaG9ljxe4ADNQx+Mzw1hYncd2SpfTLWHYVwThol2\nX3S1qaFtkqNTkwtXmx8OPLgPeTigCCcCPlSGQdtSgJbaLGgbcjHZEY45bRxmu6TQlPlivp9CGXsH\nN72uYZLgdc0R6Ki6Q\/JGxeM6NA\/1oPJxNYanB6BIuIryVAfIVcmoyIvGpO4R3GzOCtsMb2\/7W9w\/\nB9hSpcRAdxWFrRrTukoo719F2I1vEHdbH8u6BAw3hmJyOBVDbZF4PqnGAmskGff9zGlffIT8snxU\n1JciwMcej1qbUVClhuSuLUZ7S6HTVsDF8ozwHuYXhJeX1+cBP\/4GMTMzo+0kDWO9FZgerMHUaAOG\ntGX0lgjF2lg81icSUZ\/rjYSsACTmylBYqUJ7jwaFtSUoqSmEpr8NheVytA5p0TOhQ\/fYEFJi3dHb\nloe5sTpMjDTCzfacMBa\/\/xnw0Ffdx4D8rSAAVskx0VeOgY48YdYj\/eWYGqwlL5Xjw2ohducyoOmo\nx8jCOJ50SFGn60LnzAR0Q43oGWtBjI8J4gNcMKV9gImOfMyNE9hAFcYpIrMTTfCwOy9Ei09RXwzI\ncJwXAmB1OoFVYGaoFvOj9VgkL6aFOmNxogFj2gLkKO\/jQfVD1LYUY2c0ilZ4CWZfb+O+mwGaSkKh\nHerEeHcBVp40YaZfjanJWjybaaRUaKarBm5WesKuwWdQ9uJnAcXwih6sVIVhfqwGW8taLD1pwcpi\nN8Y2V9HYVYPmjhrMrD1Fx5QOa4sdWJrUoLImE6u\/fY08hT\/lbCHigq9j7WkbXq30YIO0taTF04ka\nrC904dl8GyT0Pua8Z7j9MP9zHhxuUWN9sQubz7V4tT5M20oPVha60VghRViIIzo0WViiUC3MPsbm\ni37Ud1RCTYtjcbQK28+76S10DxvLvTSxTrxc6qSJdmL1iQbPphuwMF6F25Z6AiB7cF9fDsireKRd\njW0y+vK5DpvLw9jemMDy8z5srA5iZ20QT6ca8Wyujs56UQRJr7iBPGTK71D4KvFksgmbi4PYXuvH\n65eDZKObPNdOk2zDywUNVuer4WZxRgDkHNwH\/NMXh5gBp3oe4M1aG9681GFvcww7W6P47dsl7Lwc\nxZvtGWyuDeB\/fv4j\/vvn9\/jLf\/2e2h8QkXQVMqkD1marMEv75N7WIG1BRdhbbaDJarH9ohebS200\nySYCPC3koBhiPsn\/KiB5TSLCiSGe7S8iuD582J3Eu+0JvCW9353B1loP1ihkL2aa8Of\/\/AP+8m9\/\nQGdXG\/7jj4N07MpDsPdFrM3XUFrosDJVgw+vp7H3sgfvd0awu6HDu51h7G72wuvq2U9ykD\/WDgX8\n2xALgNsjeLM1jvc0yO\/ePBEAN5YpbDvzkGeE4s\/\/Po6f39fRHhmIqkehtHiKsfe0jHKwhTzdhuWp\ncrzd6sTrF53YfdEnwL1a78PWOgFeO\/tJiPmr8lBAEY5f4OzBwdYsbK124\/VaN3Yp5\/Y2h2iAURpg\nFHvb4yjOj4Z2tg8zW\/OY21nF4Hw\/JnoysTSej80VrRDKlfkivFrrws5iO7ZeDGBvnSa31iuE+pb5\n9weLRKyg\/SogfV1JxEoViwGf6Mqw8rQVey+68fu3c\/jwdprCPIK9jRE8n9Ngeb4Fr1Ypr5Z7aGU2\nYunNBg3eL4TzX98+wwYdw16vDwnpwTbe74zhw5tZ\/MurSWw974Dkur5wtOPPXIYLDw8\/3IPsORZ7\n0cLCAtO95Vh\/1i8YfLczQZqkHBoVANkDq4uPsU5b0PZ2Ly0gSoOVLjSWx+PNeieWZ9poK2nCDoH9\n7mWv4Ll3m8OCLYbeXe+C5Np54ZDAdUMuarIOXcUcYnEl82dniKc1pKH0RRfrhYwEb6RGe0AZ7wVF\n1B1kJPogKdwTyhgJksJuIpWO+imR7kiNcUesvz3kUe5IDHaGNMAZKSG3kB7pQf1dIQtzgyL6DhLD\nbuGG2Q8CYFBQkFBR+9Uc5PKrVCrVijUSFlcW2O3JyclISkoSxCXh1NRUQSkpKZ88Y4m\/ExMTBXHl\nlMXtj\/uxHS6WciqJHhQrs\/X19ZK\/AywrK\/uTUqkU\/pEH5qtCoUAWfXinp6cLba4dRkRECGVgUVy+\nZXFZmMVt7sPlO84nvoptFj9j26J4LLYrTorvqVQqhvy0FMwzEOsj4qmaT7mcwPzlzzU8LsexxAqr\nuJg4Zz9uf1xZ\/Vhi5VWsvnI68Vh8kha\/hdiLvKLJMZ\/WaMRSrAjG+xJ35iMQP+PBeRAHBwdB4mBi\nbVos\/YpwH\/fjSi2X8jhl+Lc4GbEkzGNxmPnK5T\/2NKWWAPi\/73lFbolpfRYAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/icon_tii-1318971770.swf",
	admin_props	: true,
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
	"no_vendor",
	"no_donate",
	"icon",
	"emblems_icons"
];
itemDef.keys_in_location = {
	"p"	: "pickup",
	"e"	: "reflect",
	"v"	: "revere",
	"n"	: "ruminate",
	"t"	: "talk_to",
	"h"	: "tithe"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"u"	: "furniturize",
	"g"	: "give",
	"c"	: "place",
	"e"	: "reflect",
	"v"	: "revere",
	"n"	: "ruminate",
	"h"	: "tithe"
};

log.info("icon_tii.js LOADED");

// generated ok 2012-12-06 17:07:27 by martlume
