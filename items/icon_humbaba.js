//#include include/icon.js, include/takeable.js, include/npc_conversation.js

var label = "Icon of Humbaba";
var version = "1354841017";
var name_single = "Icon of Humbaba";
var name_plural = "Icons of Humbaba";
var article = "an";
var description = "As magnificent a sight as any glitch could imagine, this Icon of Humbaba (made from eleven of her dazzling Emblems) bestows blessings generously on those who show it appropriate respect.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["icon_humbaba", "icon_base", "takeable"];
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

function conversation_canoffer_icon_humbaba_1(pc){ // defined by conversation auto-builder for "icon_humbaba_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_icon_humbaba_1(pc, msg, replay){ // defined by conversation auto-builder for "icon_humbaba_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_humbaba_1";
	var conversation_title = "Facts About the Giants";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['icon_humbaba_1-0-2'] = {txt: "Button?", value: 'icon_humbaba_1-0-2'};
		this.conversation_start(pc, "Click... click... transmission begins. Press button to continue.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_humbaba_1', msg.choice);
	}

	if (msg.choice == "icon_humbaba_1-0-2"){
		choices['1']['icon_humbaba_1-1-2'] = {txt: "Oh?", value: 'icon_humbaba_1-1-2'};
		this.conversation_reply(pc, msg, "...Fzzzzzz ... transmission. Giant facts, no.1623: Humbaba, giant overseer of all that walks or crawls or hops upon the land, is as capable as any giant of walking on two legs. Out of respect for her charges, she walks on four.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_humbaba_1', msg.choice);
	}

	if (msg.choice == "icon_humbaba_1-1-2"){
		choices['2']['icon_humbaba_1-2-2'] = {txt: "Right.", value: 'icon_humbaba_1-2-2'};
		this.conversation_reply(pc, msg, "... except sometimes, when she slithers. Just so nobody feels left out.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_humbaba_1', msg.choice);
	}

	if (msg.choice == "icon_humbaba_1-2-2"){
		choices['3']['icon_humbaba_1-3-2'] = {txt: "Anything el...", value: 'icon_humbaba_1-3-2'};
		this.conversation_reply(pc, msg, "...And occasionally she hops.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_humbaba_1', msg.choice);
	}

	if (msg.choice == "icon_humbaba_1-3-2"){
		choices['4']['icon_humbaba_1-4-2'] = {txt: "...", value: 'icon_humbaba_1-4-2'};
		this.conversation_reply(pc, msg, "... Transmission ends. Click.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_humbaba_1', msg.choice);
	}

	if ((msg.choice == "icon_humbaba_1-4-2") && (!replay)){
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

	if (msg.choice == "icon_humbaba_1-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_icon_humbaba_2(pc){ // defined by conversation auto-builder for "icon_humbaba_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "icon_humbaba_1")){
			return true;
	}
	return false;
}

function conversation_run_icon_humbaba_2(pc, msg, replay){ // defined by conversation auto-builder for "icon_humbaba_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_humbaba_2";
	var conversation_title = "Facts About the Giants";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['icon_humbaba_2-0-2'] = {txt: "Need a kick?", value: 'icon_humbaba_2-0-2'};
		this.conversation_start(pc, "Click. Clickclick... Transmission beeeeeeeee...", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_humbaba_2', msg.choice);
	}

	if (msg.choice == "icon_humbaba_2-0-2"){
		choices['1']['icon_humbaba_2-1-2'] = {txt: "Hm.", value: 'icon_humbaba_2-1-2'};
		this.conversation_reply(pc, msg, "... smission begins. Giant fact no.815: Before the time of the great imagining, Humbaba had dominion over only one animal: the great grey grunting, waddling fartybeast of her home swamp.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_humbaba_2', msg.choice);
	}

	if (msg.choice == "icon_humbaba_2-1-2"){
		choices['2']['icon_humbaba_2-2-2'] = {txt: "Huh?", value: 'icon_humbaba_2-2-2'};
		this.conversation_reply(pc, msg, "It is for this reason that, in the time of the great imagining, Humbaba carefully mind-crafted every animal to be special and different and unique. Both the species already hatched, and the species waiting in the future-worlds, waiting to hatch.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_humbaba_2', msg.choice);
	}

	if (msg.choice == "icon_humbaba_2-2-2"){
		choices['3']['icon_humbaba_2-3-2'] = {txt: "Wait, what?", value: 'icon_humbaba_2-3-2'};
		this.conversation_reply(pc, msg, "Transmission...", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_humbaba_2', msg.choice);
	}

	if (msg.choice == "icon_humbaba_2-3-2"){
		choices['4']['icon_humbaba_2-4-2'] = {txt: "Gah.", value: 'icon_humbaba_2-4-2'};
		this.conversation_reply(pc, msg, "... ends. Click.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_humbaba_2', msg.choice);
	}

	if ((msg.choice == "icon_humbaba_2-4-2") && (!replay)){
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

	if (msg.choice == "icon_humbaba_2-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"icon_humbaba_1",
	"icon_humbaba_2",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Icons placed on the ground have a chance of bestowing blessings when you walk past."]);

	// automatically generated source information...
	out.push([2, "You can make this by combining eleven <a href=\"\/items\/586\/\" glitch=\"item|emblem_humbaba\">Emblems of Humbaba<\/a>."]);
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
		'position': {"x":-41,"y":-104,"w":81,"h":94},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAASpUlEQVR42s2Z+VeUZ5qGOac7c6Z7\nZtLTnUnSfTLd00nsTNKmTUeNG2qiqMQNBRQVEREE2QQslgIKKPaCYl+KTVbZ933f933fQUDBPS7R\nmMWke6555fQPk6H\/gK5z3lMFp77i+t73eZ77vgs1tb89Hk+4ND+ZcOUfZk25fKr2fx9TzdKwySYH\nplucmWmTMdshZ67Lh\/keBQt9QSwOhLE0FMWN4RhujiawMp7ErYkUbk+lsjKRyMpYPMsj0dwcCmdp\nQLy\/L4CFHh+ud3sy3+nGXJuUmRZ7ppttmGqwZLL+EhO1xoxVGzJaqc9I+UmGS7UZKtZitPwEeQH7\nfvEjwLvDPvLh6ovMd8u43isXUF4sDPixOBggwIK5MRLGjdEobo6rWJ6IZ2UqaXU9u10qYCMEYAjL\no0pxA+KaAXFtr4wH0+HcGJAL2Jef5yGAXQWwVADbM9dhJ6CtmW21YKbZjOkmE6YbzzPXfJ7Z6qMI\npNd+BHh70EM+WmfFt3dyxcrn27vFfHe\/jO8eVPPdF\/W8eNjEi8ftfP+khxdi3ZlJoSbbiFB\/LULc\nDhPsfoKPTWwJtD\/MBX11XJxPE+i+m4LEM0y0Srg7GcXXt\/P5eiWH58sZfHUzla+WEnm2GMez69E8\nnQ8TK5QvZwKYqz+xFnCl31U+WmvBNyupTNSb05R1gJacg7TkHqYt\/yjtBcfpKNKls0SP0uSj+Dtp\n8LZxIDKvU\/xx\/eus37iOze\/\/io2b\/51degb4Omix01lFoFyXYM8jlF4zoKfsFN0lJ+gq1qazUHxm\n\/iHa8jRpy93P7Mvda7fn6VwoC80GawFv9jrLR2rM+PpGAr0l+rja7cfZdi+yK\/tws\/8cT6kWcqdD\n+MqOoi6NJ0i2n70fvU5wkDsXT+8nXGGLvuYGosJlpIdL2WpwBvV3XsFNvO9TQ0dUSm0ilTpi6RHq\nrUNc2AUilCaEBZii9D1Pb7nl\/Fy7w+puLrVfXAu41O0kH64y5fmiip6iM4R5HyHYSxOl\/CBhvseI\n9NflxKEPuCSg129Yx+8t\/SnIjuWExntE5mazK6CAdZJkNJyjsDY3QON9NaoLVWxxCxE38lNCQw2o\nL7WjIteW0mwbitKtyU2xJTvVjswkCSN19pPzna48W0pgudt6LeBCp0Q+VGki6iCC7qLTpKsMSY08\nxTXxnBRuQH6aBYWZ51B3y6KhvZSd76mx1yubzYpSDoZks+dqG3tUNRyIbWRHTg\/rgyuQ1s9jovU2\nvtey0Q2vYVx09mh3MANtSroa\/Gmp9KCx3JuCDEum29xHrnd7rNbmrX6HtYDz7XbygYoLPJ4Joavg\nlAA0IjPWkPRYY\/KTLThnepgtvgUc37UOQ9MTbA0rZrM0mo98YrBMrOHGVCmLHeHcunOdQ6kN7Igv\nY5eykH0p\/ezc9iq6297gZGoL\/bVKRjv9aK2S0tscSFetP41lnsz1+A0t9PrwfCWLu8NuawFnW63l\n\/WXneTippDNfj0jfvcQp95AWJ3Yv3Qajg5s5sOEVtp3S42OHYN5yCSUkScnCUBUTHcUsDxdze7qO\nxaEsniw282RhgIHpXt4z92BHcDr7d2\/h+O5fktvUzHirH2MCrr8pgK46AVvpLUZT6OBif6Do9ALu\njfqsBZxutpT3lZ7jwbiCjvyTpKnOiXWBnHgDzupv4EM9C379z2qsv2DFJ6amjPbVMtaZzVBrLMOt\niSz0p\/FosYXZXjG4x4p5fmOCF4\/GWFls53L8VX5rJeO\/fqHGNlNzVE3jLE0kMdUXxlhXMJ113twc\nixlYGgzhm7tlfDEVtBZwst5c3lNswN0RH9pzdcXRmpASdR6FxxmuRKWjsektfquty36z08yPlTPa\nnsXiSAnzA1nieGJZ6r0qdjGSB1Mp3JnI5dZUMQ\/mGsQfLuKvj4ZxDFby7sGjHDv43xSNLhLdNMJs\ndwgj7f5013tyazK5\/4a4\/tv7NTyajVoLOF57Ud5dpM+tQU\/acnTISjCj6Npl3KNSCUyK5e1XX+FS\nnIr2tnTGO7NoL1MIaXKmLcUEbtWgvuFN7sy2oaXxDl8ulDFT7c6N\/gihPPk8XW4Rv6vEtrqF81Y6\nJOSmkd4xR12lMT317uKofbg3l9m3PBonREGUx+LVtYCj1cbyrsIzLPfJaM3RRibRweqyCWaXTnJO\nV5N\/+okabeWxzPQXisF6ha4ccwZy9LjTE8axTW+wRYyVpelAtDf\/hEMbf8Z8eygN0fsZKjAXEqYQ\nu1LP46VW9E7vRiFUx99P3LynIaEVY4y3B\/BgobB3WRz7i0edPLuZvhZwuNJI3pF\/iiWhlS1Zx1G4\nHiAvKwQPzT\/jqP42R\/\/4C0ZaMyhIuoxCcpriUDMy5Fp0Z1twYetvCJFs49G0nGiHzZhovMb99jDm\nawKpuGaL0kmL4bYIoRKdhFpqoDj4AQFHPuT2bCcBZfWMtQbx6GZF78pkmpDRfp4LSRRIv\/oR4GC5\ngbw97yTXOxxozjyGXKYlBmsMzrve5crOP1AQIaE5w5zt774iRlEkCtO3sNd8HcnWn1PkrUXAxfVk\nBRwk3HIjadJDOGx9Dee9ryE9+Ro\/PCxCd8cbVITt44eFKnw1fo\/rjje5P9eKsqSKgVpPAVjZc3sm\nm++fjoo6LF8L2F+qL28TzTHXZkdT5lEUbrokJQZyYcN\/cHHjGxSURhMv5K7k6ikyfT5lsMaXhmwF\n5pt+jvXHr+J9fDMLo1XIdT8QN\/VrbDb\/nOwoG+GCcqlPd2KgypPvRa3OdLRjsfnfyLx0EMOTmoRU\nVdJfY8ODpcKeW9MZ\/PB8mu8e1r0E\/OWPAHuL9eQt2TrCr12mMf0oAS5H8EzJpasmmbPv\/ZTwWOHj\n2tzoH7iGldKPP9mpmOhOgWdD3KkLQHrwTexyari499cMZ\/rx+OYEd8cL2e6m4pSfGB8P+vmfPlGX\nDUl4Hl5H\/2gesfVdBFdUiB205cH1nO6VyRR++GpUOKeGtYDdhSfkzaL2JhosaLh2GLn9ASSqTA59\nvkXU40WK4uzQ93NhuDmEr28N8eJ6DBIbLf76\/WMO\/EmNPcVLfJbWyyfxXRz9gxpT453o6O\/mq8U8\n\/vJ8jtEOJZYBMhpSbEj00EXieI6g4gYU+SXiNKTcm03tXh5P4Ieng3xzv2ItYGe+jrwp4xhjtabU\npx1CIXbQNiIJWUwWNjJ7Aow\/EQVvx73JEjTdElgYMcE3M4Hv78xQ3D8o5l6ZKPoGUVd1hBVkcvvJ\nTbKqsrnXK+FSWrWwUpHCaWeRHWiMg5slSY3d+GUV452ZQ1\/5FW5PJnTfHFUJv9nFV7cL1wK252rJ\nXx7taI0prdnHUEj34RibjmdyBnLVNSQCtiBBgrP+n+nNt2aqOopnk018s9wmhnEZT5b7+fL+CE9v\n97A4VcCLL8TP94ZZmClnqiOCqihzJjrTSMiMJaZadG9BOYF55YRWNTLV6cutMVX30lCEGDPNPL2Z\nuRawOfOIvF4c7VDlBTGojxHmcQjL4ATcE3LxT69EnpJHR1UUKwMpooi7uD9Tydd3u5nuS+VOfyn3\nF1p4tNwn8knVakNMD+TzcL6Gvzwa5Yu5er6cLufuQjNXO\/uIauomYXCe6MpuFEVljDS6iywT0r04\nGCxurJbHCyl\/BzD9kLwu9SADZefEHBSOWbqHS0FxVBS60lpshs6BXfRURQppisZpx1tMFPhg9tEb\nJDjvF+qTxdP7wzy9MySKXXSqmIHRVuocflONLPlZDEWTPbsndrbPFb9gIWtjYTxcriOybkQ0SR0D\nNU7i+BXdi30KETPKeTgbuxawMe2AvDbl81U33ZxxGD\/7nVz0CaNYdYDGnPNoaf6LMKxbRb7IoFll\nxXi1DznC1CpNNrIgVOPW9fbVHZztz2asMQhnrT+Q46PNvc4YGhOkIgEWsWfje5y6sJWVIX+eLniT\n0jFDcHkdTbnmIqzJe673ePPd3ULuT0WsBaxN2SevTjpAV6GeGDOf4+WyHYeQaDFqcmivUOEYk0Ni\nVTeFccbC7bjTkmdFR6oLXy8OCMsVybMvBsQODorXefTl27FSIeOaTJc0503Mdyl5MFZKWFIYMk8P\neiqEAFT0k9TQR3CZKIk6EUvbnXvmu9z59lY2d8eUawd1ddJn8qrEfXTk6VKfqom74zZM3QMwVvij\npaNOZ54vtlZ6+Jjv566os8y6AmGxUvEKUYq6jOCJGD1T4vhXhCccLPegobqKqgRdCqpi+Ot8HUoL\ndTS1NXg+VY3CUxvLS3oosioIKasWgO5MNV3pnetwFk2Xyu1h77WA5fG75ZVXNVY7uC5lHz6uO5F4\nhWHpYoa9vzfhoVIasiTYB3mKsK0UAd+LtLxwxlpsRXiv4+71egaLrLg+VMBUVwpz4qhDYgOZ7Exk\ntMCUlJRwKmP1iA23RZXkhXdyOAHxPgTn59NXK2e8waZvts2Bb0RoW+77O466MGKnvDxhj9DhI9Qk\n7cXDcQ\/W9lbYerlg6+2KrVxCXpwlFZmu1KdYE5oWQVCsF9rCxXx1q4cv5iupjj7K\/dkyHl5vWtVt\nqb0J0WkJVCedY6JExnS1L8pID8LSE7jsaYR7hAsOQU60FZxlpMa6f6ZFshralrr\/TibJDNwmL1Z9\nKlTkIJUJn4k0dwQzVxsc\/D1WAW28HbHxlNDTXY1M\/Td4aKkz35FKe7GUx8sjos6iqYs6zI3Ba6JD\nu6gLFyeRZUp+oAW+B9fhcXQ7MXkqHALsCRED3lPljSLGk9OXNClOOcZQlcXAVLPtamhb6LiyFjDJ\nc4s8P2KnON79lKh2Ea7Ux8DWlMtyFyzcnbD3deKytxRZoBuBqiBaikOZ6MnlxqRIa63JDJZI6S+W\nMFomF7kkh\/uLnVwfyGRYNEtopIyQ9Ksor8USlJqMMi0SlzAvpCEewmk7U19oItTEbHCi0YYnIrTN\nt9muBYxy3ijPClanOnEPOSHqxIQbccHBEksBZ+YiwdjJGguZI9be9tjbnGGgr5Hh9mL6hPjXZdrT\nHK9NV6UvTSnGDNUE0CPG0OJQkdDZJLJVEvySIglIDCVIuHN\/8ewR7Y9LiDf2gU7U5pvQU2oyNF5v\ntRra5lovrwUMstsgT1VsE7u3mzT\/bajCjTG2M8VQYoWF3AEzZ1uueNjj5nQBN+U5qtNFdikJFCVh\nQ0HICcZ78xlsiGSuM5mGmJO0ZgjJzHOmWyiK31VHSjJkyFTBeMcHERAXhltMIFf8nDGTmVGYpifG\nm9Hwy69e7o\/5M9NktRbQx\/xD+VWvLWQH7yDeYzNRitPoSyxFHUrFEbti4SHFNcgPUwHdmmWBxvF9\n5ESL7nT6GKXKiwgvCyYHculvzULifIHSwH00pNvh53SWnlwD3MMzkQS445cQhpOPPRYKXxwD5Vj5\nOJCfpE9b\/rnR4ZpLIhN7M9VovhbQzfh9uUq2mWTfLURINxIacApzZ4moO5nYRWvM3ZywdJOgt\/9t\nSuJtKIzSJ8P3GO6qUILdjfjkbTU+2r4eqY0O5y2PYia9QKDZBkqTz9JyVQdHzd\/iFOyFvYC86O\/I\nGVNNdA01MfOwJS\/RgOacs2NDVReFbMqZrDdbCyg5vU4e7rQRlWwTStuP8HE\/gInUElNXe0xlV8Sz\nA9ZerkhcrbHzlGJ6+Rwbt72Dc7APH76uhsGmV9lh40xwkANO4QoC4yPYuO6XWElNkfq5ConT5tjF\nY1iLSSD1d+d3\/6qG0RUDDB3MRMQ9RVPW6bGBCmNuitAmEuZaQEudd+RKu48Ithdw5h8S6LADX8e9\nwnbtFcZhl3A3+4nwPkC0nyaqQA0iPXdyLUqLaNnHxHpuItpNrJizIi4YkhWnTXb8cRI8d5CbqENh\n6hlKM43EODEgP\/GUqMfz5MSfoCzDiLJ0I9oLDYQHOPtVX5kRSz3OwvIZrwU0PvQ7uZ\/VBnws1+Nr\n\/QH+Nh+glKwn1OlDIl03EOPxEVd9PibZbxPpyk\/IDBH1GrqNnPDt5Eaokxe5k\/yoXRREf0pRzGcU\nx+6lJE6D0vj9lF3VpFysiiQxY5MPUZ1yhOrUo9SmHaP22nHqM3RoyNBlRqjSgghtI5VGLwF\/9iNA\n\/b3\/KXc2fB+70+8iPf8ebibvr8IqbP9EqOOfiXb9WOzIZtIUW8kK2i5S3s7Vji+P28NLiaxNPkBD\nmiZNGYdW1eilZLbnagtjobtqQF5+pddXcpZ+YecGK4wYFqH9pTkerzNjot5CNIY1M802zLbaMlRh\niNr\/f4RLd6cEX9lOuKM6KpedxLnvJtHzU5J99pCu2EN2kAZ5IjYWRR2gLFZTqM1BAXVIQB2hRaTA\nzrxjYh1fXV352nQX6NBTqCvAdOktPing9Oh\/uUpPCc95WhiKMwyV6wuYswLWgJEqA0arzjFabSiA\nTYRplf74S\/Rv79XwD7W+qFv9N8T\/AhJHmEJnsNO\/AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/icon_humbaba-1334255218.swf",
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

log.info("icon_humbaba.js LOADED");

// generated ok 2012-12-06 16:43:37 by martlume
