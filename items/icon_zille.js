//#include include/icon.js, include/takeable.js, include/npc_conversation.js

var label = "Icon of Zille";
var version = "1354841473";
var name_single = "Icon of Zille";
var name_plural = "Icons of Zille";
var article = "an";
var description = "Curiously heavy for something that emits so much inner light, this Icon of Zille, made up of eleven Emblems of Zille, can bestow mighty things upon supplicants who know how to use it.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["icon_zille", "icon_base", "takeable"];
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

function conversation_canoffer_icon_zille_1(pc){ // defined by conversation auto-builder for "icon_zille_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_icon_zille_1(pc, msg, replay){ // defined by conversation auto-builder for "icon_zille_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_zille_1";
	var conversation_title = "Facts About the Giants";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	if (!msg.choice){
		choices['0']['icon_zille_1-0-2'] = {txt: "1?", value: 'icon_zille_1-0-2'};
		this.conversation_start(pc, "Transmission will begin in 3...2... 2... 2... 2...", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_zille_1', msg.choice);
	}

	if (msg.choice == "icon_zille_1-0-2"){
		choices['1']['icon_zille_1-1-2'] = {txt: "Two-fa...", value: 'icon_zille_1-1-2'};
		this.conversation_reply(pc, msg, "2... 2...1. The Committee for the Illumination of the Populace presents Giant Fact no. 4: Zille, giant overseer of all mountains, grew up in a travelling circus, eons before the time of the Great Imagining, and is to this day as well known for her ability to  juggle continents as she was for being two-faced.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_zille_1', msg.choice);
	}

	if (msg.choice == "icon_zille_1-1-2"){
		choices['2']['icon_zille_1-2-2'] = {txt: "What?", value: 'icon_zille_1-2-2'};
		this.conversation_reply(pc, msg, "Even though having a face on either side of one’s head is not usual, even for giants.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_zille_1', msg.choice);
	}

	if (msg.choice == "icon_zille_1-2-2"){
		choices['3']['icon_zille_1-3-2'] = {txt: "Oh.", value: 'icon_zille_1-3-2'};
		this.conversation_reply(pc, msg, "Transmission ends. Click.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_zille_1', msg.choice);
	}

	if ((msg.choice == "icon_zille_1-3-2") && (!replay)){
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

	if (msg.choice == "icon_zille_1-3-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

function conversation_canoffer_icon_zille_2(pc){ // defined by conversation auto-builder for "icon_zille_2"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.conversations_has_completed(null, "icon_zille_1")){
			return true;
	}
	return false;
}

function conversation_run_icon_zille_2(pc, msg, replay){ // defined by conversation auto-builder for "icon_zille_2"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_zille_2";
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
		choices['0']['icon_zille_2-0-2'] = {txt: "Here we go.", value: 'icon_zille_2-0-2'};
		this.conversation_start(pc, "...Click. Transmission...", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_zille_2', msg.choice);
	}

	if (msg.choice == "icon_zille_2-0-2"){
		choices['1']['icon_zille_2-1-2'] = {txt: "Hm?", value: 'icon_zille_2-1-2'};
		this.conversation_reply(pc, msg, "...Begins. The Committee for the Illumination of the Populace presents Giant Fact no. 42: Zille was the last giant to close her eyes to the universes the giants used to inhabit, and give herself over to the world of the Great Imagining.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_zille_2', msg.choice);
	}

	if (msg.choice == "icon_zille_2-1-2"){
		choices['2']['icon_zille_2-2-2'] = {txt: "Oh.", value: 'icon_zille_2-2-2'};
		this.conversation_reply(pc, msg, "This is why, it has been suggested, Zille is the most level-headed of the giants, but the hardest to please. The rumour that she has a heart of stone, however, is not true.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_zille_2', msg.choice);
	}

	if (msg.choice == "icon_zille_2-2-2"){
		choices['3']['icon_zille_2-3-2'] = {txt: "SPACE MATTER?!", value: 'icon_zille_2-3-2'};
		this.conversation_reply(pc, msg, "It is made of giant-flesh. And space-matter. And gravel.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_zille_2', msg.choice);
	}

	if (msg.choice == "icon_zille_2-3-2"){
		choices['4']['icon_zille_2-4-2'] = {txt: "*Sigh*.", value: 'icon_zille_2-4-2'};
		this.conversation_reply(pc, msg, "Transmission ends. Click.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_zille_2', msg.choice);
	}

	if ((msg.choice == "icon_zille_2-4-2") && (!replay)){
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

	if (msg.choice == "icon_zille_2-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"icon_zille_1",
	"icon_zille_2",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Icons placed on the ground have a chance of bestowing blessings when you walk past."]);

	// automatically generated source information...
	out.push([2, "You can make this by combining eleven <a href=\"\/items\/592\/\" glitch=\"item|emblem_zille\">Emblems of Zille<\/a>."]);
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
		'position': {"x":-52,"y":-102,"w":104,"h":91},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAPoElEQVR42pVYB1OUa5aef7A\/YWan\n9u7ueOWSo0AjuckIKKGJNkFAAUk2Ag1IEpAgongNiFkvigHlKkqLBCUoOecgIggI6q2p2ql69pyX\nizWzO+CuVae+tvn6\/Z6TnvOc7w9\/+H\/8e34n9o\/VP4dWZ8Y5TYZ5GygLFVaSsnRp1IUcJ+W5LAdl\nWZqdsKIk6\/9l8cGmFQXJeyYfVoRVnM1y+nbvxWxHCduFXAf1\/xOI2yVuUeeyHHEh2wnnMh1xOt0O\ndBAuF+5D9fkwhPsYIiNqN37OcsDNYjdcL3RD5XFnXDvhKqwyz1ncz1aSbAPlQck32++ujahACWou\nhaMy3w2FCmucSbdHRa4zPY8sx0V1Jdd1e6DH4y07S5LtcPaYM85nu9ABjrhe4oOq8hCE7NNHSoQp\nEkN2\/YPF7TfCIT99xAQaiP8zmKzD5siJs8QJhS2KjkqRGmkm\/hYdYIBANz3cPReKfIUUyeEmwtIP\nmSE\/0RqXct1V2wKM22+oOuSnh4MyXUTRQ09l7BGRk3vooeCILUXGEWcynMBOZESZIyZAnwAaCov2\n1xe\/Yzv8O9jUSAkyY8y\/WVyQASK8dXHAZ5cAmRtvI76LomfyGYnBu7YHGOalq4qliLBXDQ+L8LAi\nHMrYfWiuu4m2hl\/Q8fIO2hrJVLfxir6rvXMOj6rO4um982iqu4Y3TXfQ316DvjePMPCmBsNdtRgg\n6+t4hI6m+3jT8pCuD6B6fBVph51xj5xveXYFl4qCNxxPsd8eoL+rRmd0gBHSoyyhqkpCtsIbg10v\n8WGmF8vzg1iY7sHsSAdGuhvR3\/ECPe0vMNrXjJnRDvG3lfdDWF0YxqePY\/i8PIJTcZ74ujqBLyvj\nWFsaoe\/GMNb\/mhx4QUBrkBnviuaaHGQpfOHjqA5Xq53bAwz20FTFUnoqC2VIPCBFV+tTfHw3RDZA\nkXtMgOoJXDPGxtox2dWE2clOLM0NinsY2MrCoACytDyKtbU5nIqwxsrSOH77NC5Azk92YX6qE+MD\nrZgeeYPHd35GVrwjrhXLRK2SbQ9Q5qyuulTgjfQYe1z5ORdz428pLU\/Q+Ow+Bnqa6OBXGOpsoO9q\ncSYtEmey4rA41YfF2QEsLQxheW4AKx9H0Pr8Mta\/TqOUnLxXkS+Ac\/TWFkcpI42YHesUNjXcgePK\ncBAFISfBDhE+utsDvFYS0Mk3B7hqobXhCeof38VI72v0U0o5NXx407Ma1NX9CqWHGYKlerAyMYDC\nXYLh9if4bW0YZfH7kB\/sCJm5Oo7778YR2W5yoE84OzHYRue10GeK5GSPKAsuoRi5FOeO++BGiWxr\ngPcvhjvnKlwg36srmoRTsv5xVNTSKkVlbqoL72d78fHDIEVrBPlh9sjws0HUXgmWZ9owP9pMddqB\nZUp\/c+01FMQHIjvQHAofM1FzA50vqWSeifQywPdTvaJ03k10ozAtAP57dFGe473KA+GfAsxLcu2U\nOWuDa\/DoAWOsL43h04cRfOJ6WiVbmcI6XT9\/mkDaPjN8\/W0Wf\/syjuXxFurWF3hw6xwGXz3E1XMn\n8KL2BqZ7G7A41iZSX3vtNFYWR0SjraxMYnlxTIDjmuSIlh8PxrFoc0T4miA\/ZU\/RPwVoZ\/Svf\/R2\nUO9k0mVC\/bo+gf\/68g6fZjtQHGaDslBb4j85Psz24PblYixQpM6XZuHTQh\/W3vVhquelSDNf+17X\nYrDvJW5XlmC6vwl3rp7E4vwQrp1UoojOORluj8XpTgx1N2Fu9A1OZ++HInQX9ntoVVhq\/\/lftkwz\nt\/ke650IctOiaE3jVn4k1ZMUucEOyJZJ0PKoAp2NNai5cwllBWl0eCveDbeh6koZ7t0sx+DbZ7hc\nnoebFSUYfv0EM8OvcCr\/KHpa6zDb34jXtVeQGWCFVG8J0n0kSPEyxtR4N9GZHwL3aCJgj4byu0Tt\n56KB0H3aWBhpw+kETyi9LZBH4BpfVGG0sx4djdXISklASKAXnj64jIuns\/HswVVcOV8Ed2dr3Lp0\nEqoH15CWHI0LpTmoLC8QduFULkqLjqEw6RBSfUyR5muOXy8dQ8+zGyjLlotJdMhXt2hbgIowYxWP\nnHgy7rD759IR7GyCw3stEO9uhnvXy5FwcD9O5+ch91gSvPZYIDM5EoEyN6QqohHk64HkI5Hw9XKE\nvvZ\/oDDniKjJ4pyjkMvckZuaiMi9pjjoZg7P3eq4e\/4EWut+QWVJuJjdZNtHMF5uqOJZyo3yYbIb\nF6he5K6mxFdvce\/GWWRnJKPv7RN8nKtCfkYcQvZYoub6KcR47kZUiDtiw\/0QEegGf1sdFGUnYZ+1\nIX0nw+jQZfS2PcWJvCTUP6jERP8reNno4Wp6GLo6GqkxfHHQVw+RMp3tAQa4aqi4WFmRfJzvpzH2\nHHHUsQtEMd2v61F39wpG+y8hJdETU30NkFnpISUuHIVhDkgLskKe3BYZ+x2g9LPGL5VlkOrvQMvz\naiTFuqO3qxxnizPQR5NocuA1jnpb4qwyAuPD7bhcEkFixAYnjlhvD9DDdqdK7qGFA146mKCZO9TX\ngvQgKRGxiZgo0yPt6HpVi\/HBJhQoD+OQmwlKKH1Sgx9hb6wBPQMNWBrpQOHvAH8PJ8idDOHtaEnN\n8wLNDfeJlIl6pnuRTc6kyozxeWkY6ysTuHoqEtmxFsiKNt8eIHcwm7vtTgFwmFLxoo7UR101vqxN\nivlZUaLEXO9LhLiZQWqmJ2rRSGsHrHZpYre+GqwNdkBqrI7SghQ4SLTgaWcgOvhp1UXMz2wIChYX\nM6NvMUkUw88pzQxCgtyQzGBrgK7WP6pvAvSQqgke\/LI2LoB9XZvG2vI4KRNSI70qqitP\/Fp1Abt0\n\/iIaQ\/Mvf4a1sZYAKd2lBjsTDapFD7pqkTZ0gSLWDwuzrTQyG4TgGO5pFqNzbKhNpPhEqj\/PYcjd\ndZy3BOjlqCbZS8B8ndURslcL7ygVbKODraRGJmmSjGGJCPnD3A3iNgWyfS0hszOBgaYOkgNcBBgz\niqC5wU+Qu5jBUHMnfGz0kU\/zOC1hL\/3+OvrfNgiBwOC4fPhsBnm97CDyEqyRHbNbsiXAA166knCq\nvQBXTdHF7NnS+2HhNUdy9X2\/iOL10jTcOJ2Dw66GOOZLdRNkg+JwF2TK7RDtZoq8UAeUhhB4K20i\n5N2QWevgfuUJ3LtaKtLL+pBn\/KbzIwNt1MX+1MWGbFsDjAk0lDAwAZJYnQHyITxDZ4lyWKhWFiuR\nK7eH3E4PXtYaBMgIiQRKZq2FKEdjRLsQxxFvKnykCHUwg7+DPvyk6gi1N0ROII3LnHghuRgka0S+\nsgy7cfogLh13x+U8j60BphwwkfDesLnoLH8YJY6qFwDXV8eFZGI9GOZhDi+pLvydjMTYKopwQmmE\nIxIo5T6WukiXWeF4MG12ofbwtdFCuIsE7jZGCKP7p8beCnHLIoTVEpcOgyzNCqLhYARFsMnWAANd\nNSWBNIOZZlgw9JIw\/fJpSjTG51VSIO8HyPtxVJzOg4eFMaz0dsCJutXLXBd2hjupHAbx1\/VJofOs\n9H8QBG+o8e+w1f9P1NfcRPnJdAFwfqYPCyxs34+IVPP5t89Gi4WsUCHdPsUJwUbfVkGWQyy5GNTy\n\/LC4sjRiWyJN6EyjykT\/3wisHj10APs9zYg66uHvbopFqld97R+pgRjgDqHGWfSy06ykF6b7hLpZ\nXRilZ0wgLyUAwXu14euoKdm2i1lRhHvrI15uImqFi5pTsrF3DIjUcJRYcjmbqsFE+wfY79bG+Mhr\n+LoY4rf1e4je74Tx\/jpo\/\/QjdTJF2WiH6NQRmh7Meb0dKtHFMxNdYlVgkLfKo0VZbRtBTjHTC++o\nzElcg5vpeD\/bLzxmPhwZbIe7mQbsDXfAR2oqOpy7fW2pBe8nnmJqSIWvK\/342+c3sCVwHMGzJBqm\nxjtFiplmWFVvZoMVdXFGEM1hPTCTbAkwK1YaxQM7McQYaQfNRdQ+zPQLkGybS85It0qIg2Rfa9ib\nqGGi9ynu38wWK8HC3JCoxYozqeh6\/Rh+ttqkJe0Q72WNgbY6sdNwFKcJLF+ZKZhqmAc5gjdL\/aK2\nBPj02iHEBBoLVRHtb0AP7Pl20FAfEWv3xrLDqWcBGuBoAC\/7XXC2MiWl8pgWJnJo7gnWFwfQ03IL\ngZ5O8LZQh6f5TwIEn8OswATNkWTq4mfwuLtYGIbSNFc8vxXduSXAykJv5yvF\/iS9TcQLIv4xH8IF\nzjOZaeav69OCHrg2a+9ehL+9CQ646MNM60+Yn27F8mQd1mbqob\/zB3jaGMDPzgjV138WgNhZPq+z\n\/TkGe5vFZy4NLp2ynFDxFuPmKfnWo04RbCgpSXVC2bG9iJMb0Sb2Eg1Pq9Hd9lyAHetvEW8YuCbZ\n+IE8yri2PM000fH8ChYXnsFC809wt9DC9HArwvZZUIO8xod3g2LZ4sZgsNzNo32vRPRmJ97gyY0j\nOJ4oxbZKhguU+a8gyRHl2Z5\/d1ij8Jg\/cyR5E+MJw3XJq2MbpW28vxlBrkYYb70BW2M1VJZlo58c\n2owUdyobO8bOcqqHe15harQdL6rTkB4jpfmvvT1AVys1yYbUUkNR6h40PTohUsDvWfq6NtLM1vqy\nlmbypAC8Quvju9luzBCIQGdTfF4kurHehSG6jzt1s9aYR7npmA3YOT63teEh6quSUXPrOPKOysQe\n9F2AbjY74U9L0353LTQ8OIGuhvPfosV8yPzFfNbb0SA4jB\/4+eOk6HbVw6tICPNEjvKg4D3ueNZ8\nDJDrbLM0NrhvGC01mRjtfiiahvUgv677LsANqaXNfCTEaeuTk+hqvrpR0L\/TDkem\/VUd3rbVC+ph\nkBxJjq4\/LUOcVga4KUbZuFzYSQbKDdbbeBaTfTViFvNqUZwegMRg4+8AtNzhzCsnE3UCNQlTCvPW\nq1+L8bbpOiaH2vFleQov6+4SbbSjreWpKHQGzw\/nSC+8GyZuaxX8xsA4xQyO79kE2d1QTst8ze+K\nZkMs3DwTJXaSbQHyJIkLMkRqpKlYmkqOBSD3qDfykmWoKPDC3Qux4mVmgdIfOUf9kBKzF0ej3ZEe\n74UshQzx4e6ICnZCXLgb4iPckcAW6fHN4ujvVedjkXPEjX5H+3asN7KTfJFPajo7fuN18HdTLHNS\nFwsTv8LdFA1svFSfSnfFtZIAoXQOEZknhRmLXZbfL\/O7HI4660m+N8xT5\/dS0aHZrksDYJdghiNh\n5vB2UBc1zqoplgKSdtAMykiJOGd7gLST8KsPT3s1Fa+fbPukav9giWEWqvvnwyYzY6Wrwfu0VWxy\nd01xL\/\/u7+\/lDZGvKZFWq9XnQjsPBZgq\/Zw0lMQUwmgxU3o7\/KRkFbVp\/xPTfwNCgxX9ksOGpQAA\nAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/icon_zille-1318971769.swf",
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

log.info("icon_zille.js LOADED");

// generated ok 2012-12-06 16:51:13 by martlume
