//#include include/icon.js, include/takeable.js, include/npc_conversation.js

var label = "Icon of Grendaline";
var version = "1354842470";
var name_single = "Icon of Grendaline";
var name_plural = "Icons of Grendaline";
var article = "an";
var description = "Shimmering like a bottomless pool, this supremely lustrous Icon of Grendaline, made up of eleven individual Emblems, floods with blessings the glitch who shows it proper respect.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["icon_grendaline", "icon_base", "takeable"];
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

function conversation_canoffer_icon_grendaline_1(pc){ // defined by conversation auto-builder for "icon_grendaline_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_icon_grendaline_1(pc, msg, replay){ // defined by conversation auto-builder for "icon_grendaline_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_grendaline_1";
	var conversation_title = "Rituals of the Giants";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	choices['6'] = {};
	choices['7'] = {};
	if (!msg.choice){
		choices['0']['icon_grendaline_1-0-2'] = {txt: "123?", value: 'icon_grendaline_1-0-2'};
		this.conversation_start(pc, "... Bzzzzzz... testing... testing...", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_grendaline_1', msg.choice);
	}

	if (msg.choice == "icon_grendaline_1-0-2"){
		choices['1']['icon_grendaline_1-1-2'] = {txt: "Consider me upstood.", value: 'icon_grendaline_1-1-2'};
		this.conversation_reply(pc, msg, "...All ... *click*... All be upstanding for the Grendalinian Anthem.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_grendaline_1', msg.choice);
	}

	if (msg.choice == "icon_grendaline_1-1-2"){
		choices['2']['icon_grendaline_1-2-2'] = {txt: "Wait, whu?", value: 'icon_grendaline_1-2-2'};
		this.conversation_reply(pc, msg, "...Nyaaaaaaaaarrrrrrrrk... guk-guk-guk-guk Grendalina HUH!", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_grendaline_1', msg.choice);
	}

	if (msg.choice == "icon_grendaline_1-2-2"){
		choices['3']['icon_grendaline_1-3-2'] = {txt: "This is terrible.", value: 'icon_grendaline_1-3-2'};
		this.conversation_reply(pc, msg, "Fnnnnnnnnorrrrr... schmik-schmik-schmik-schmik Grendalina PNANG.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_grendaline_1', msg.choice);
	}

	if (msg.choice == "icon_grendaline_1-3-2"){
		choices['4']['icon_grendaline_1-4-2'] = {txt: "Please stop.", value: 'icon_grendaline_1-4-2'};
		this.conversation_reply(pc, msg, "Nork-podge-geesh-wang Grendalina HEY.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_grendaline_1', msg.choice);
	}

	if (msg.choice == "icon_grendaline_1-4-2"){
		choices['5']['icon_grendaline_1-5-2'] = {txt: "Wow. That’s a doozy.", value: 'icon_grendaline_1-5-2'};
		this.conversation_reply(pc, msg, "Grendalina, Grendalina, ONK ONK ONK.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_grendaline_1', msg.choice);
	}

	if (msg.choice == "icon_grendaline_1-5-2"){
		choices['6']['icon_grendaline_1-6-2'] = {txt: "With pleasure.", value: 'icon_grendaline_1-6-2'};
		this.conversation_reply(pc, msg, "... Grendalinians, stand down. All, stand... *click*... stand down.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_grendaline_1', msg.choice);
	}

	if ((msg.choice == "icon_grendaline_1-6-2") && (!replay)){
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

	if (msg.choice == "icon_grendaline_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"icon_grendaline_1",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Icons placed on the ground have a chance of bestowing blessings when you walk past."]);

	// automatically generated source information...
	out.push([2, "You can make this by combining eleven <a href=\"\/items\/585\/\" glitch=\"item|emblem_grendaline\">Emblems of Grendaline<\/a>."]);
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
		'position': {"x":-43,"y":-107,"w":86,"h":96},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAALu0lEQVR42rWYe2xb1R3H+8ekQbcB\n+2cbD60T0jRpk4BJE9okoALajkJpKWgT61raQSugDxVW1nfrhKZN+kjTpmnatClO2jya9\/v9cOw4\ntvOwncTv9yPxI44d52U7jp189zs3CyoItOGwK\/107\/U99\/hzfr\/vOff3O6tWfcvRU7FtjbD87zu7\nyrdXdVXsCAorduD7NlHVLmVf66drVyVy1N3dVVWXvwvMavg7UZG7A2W3tqPqznucsd9r83Zy1+xZ\nac72bzXWhrVd7o9ds3eWLSHAuxlbqu5dfQvLVpD5Fu5ff\/tbjT1n7fIubwY\/fcnuXHyTO7Pf717Z\nwj3Lz9jy5f1ynwkBVmS9veZC0nv8c7zdSE3ag9TkD3H+zIe4cOYjXDy7F5fO7UV66n5kpB2ga2b7\nkZz0Ic6yZ\/Tb9YxDyCa7cfUz3Mw8jByyW1lHkHv9GHKzj+GLmyfAzzmJ0uytiYWYHYK2Qp5YWA6J\nqBIycRV6JTXok9ZioLceiv4GKAcaMaRognqwBSpFC3SaDhi0Qhh1nTDqBXQWwKQXkQkfMNFXbNVK\nDt1QG8+k68KDZjYIYTOL4bRKMOqQwj0ig2u0FyNOGWx0dtG9ydoNt7MPeosITpsEdksPLEYR1Pqu\n\/x+glf7AYenmoLyjffC6+zHulUM8UIcJnxIBvxI+\/yDcfgVa5U0Y86vg98mpzQC1HaCB9MJhk8Jm\nEn+\/gGYatcMqhssuxZirj4PSmTsxOa7E1MQQ\/JMaDJCHBINNcI2rEQqqofEo0TM6CM+kitpo4KZ3\n2pT18HkVcNPgRuwyWE09Kwc0qDp4I\/YeeClsfk8\/JshDk8EhTE8OIxzSYXpWA5G2FY3aNmgCOpR0\n3ccH7+9At7YDMnsfnBNqNMu7off3YnpKjUl6PzA+iDEPgY700cAlMBi6n00Y0GIQ8MZcvfCPDWBy\nYhgzUyqEZ7SIzhkQjTrQqhNiIT6GBpMUzZou+LUHkf7P3yNm5qHNIIIt7obdb0a1uhMGkkZ5Rx5m\nyOOTgWHqcxBe1wBGRvoSn8UOi5A34VNQmAYRnhpGhODUUxrE406U9nWgWtkEmDMx0HEKhbI6fLLn\ndwiI38HGNx5HnrQDXsMZTI6cx+GCbIzOuwlagkjIgNC0jvpUIeAbxLhHkTigy9bNmw4MYZa0FA1p\nMDdvRJPPADVNlv6hIkgFqQjoTmJC+T4y6ovJSnHqfiFui+8ho64KE4rd6K7einslSchuL0V8wYX5\niBlzy5BBFYLj2sQBPY5uXojBkediER3iczoEJvWQaZrg1X+KQfkJiOX9uN1cj1JRMdqHm8HvLuXO\nuc2FKOmuQfNgA4Jd\/4DHKYA7bMQ8gYUjTkTpOkzXM0FT4oBjIz28uWkNwpNKLM6bSG8WYNEGi\/QE\nGlXVuEmLeKGkFLOxUZwsvIzzJRlILriKs4XpSCvLxljEgCJRES435cEr248ZmNDgHMQNQRPiMYKc\nNZBsVgLo6uHNh\/VYiBoJUA\/EHACF6VZHMbRuBawzFpwuSEN69W0ItZ3QBtR46Eer4Z7RoF3ZiFPl\n13C\/vxlamhAN\/TWQz9ogo4icLsmDe3EM4bCNIrMCwHGXlBcnLyzOmwnOCnvMBDXBSn1qmhS1SC65\nAalTjMsUzpxGPu6LyrHmxw+jsLccN5oKUSQsg5jW0JTaHPBFFTBSWNvsauSI26g\/igjpMRaxrQDQ\nI+UtRKmjqI6D7KJFVzBroZlshNwsQ1JjLngFV8CruYbGYSG2Pf0Ytv7qIaz\/+Q\/RYOjEdQI\/XZyD\n3IZ7MI7Rog0PIhE1eY8iMW\/HIvWNlQIuzlF455b0F120ILJgpjAN0brXjgZNC6603EVxRxkuXDkA\nbVMS5PUpMAtTce3GQfTSZDlefB29JhmahlpIgQ6YYzqMx2k2LzA9E2BsBYABDtC0BBhdgpyj0ETJ\nA\/dk9dCP9iO3vRi\/ee63OHL1NNY\/uRpvPP0wXnvyEaTcScdPf\/1LDJAnxaMDEJi7oQy5YKdBxmjC\nIW4FokzXIysMccTIfTkYZIiurU5KFkiPupAW+ZJa8O5cxqZ3X8WBq5\/jb7v\/itWPPYlfPPUzHLt2\nBi9ufhlJt1LQqaZMhkI6hXH45ygKBLe4sGTxkG1LwoA+V4+AeY1ZDEw3VoyTloamDNBGTBif12LY\na0AaPw37UlJwNO0YHn50NdY88xT2ZZ7C2ZyLcISd6At74CZZ5PdW0kSzwTEmp2WGTTwjWxl4CQP6\nCZCte8zCYc1SmMkDWBgBYCdwB+oU9ThB4TxfxYejKxPKch4crZm4UHkdqfkXUWvsgGWK2tPs985Z\n4SevYdHJ9ckBRm2JA\/rcEgHIe0vLjIMADYgt0Dlu57xqcYgxiwnkEeTd+hyUpu\/ChT0b0Jp7CMVN\n55DVUQjDPC3IMMNEYY1QFAKk4eXwMiMNrgBwlEIcYaM0c18F5kEGy+AWCTK2YEcATkhdMvzhoVV4\n54lH8JfHH8FbT\/wEz\/5gFT7etQkFfa1QkNeNpMFQTIsx0u8cm71xFl4aaGQFIR4bFQviIT0HGKWO\nOU+SJzhNEtwsnY3jfUg9vRfbNr2AIwffxdmjH2Dv+5tx\/NOdGNb3oNagRO+0Cz0+CwKLZjhoeYnF\nlr5MTC4rAvQSYJQ+6LFZLSfq2QdnH4l9csGGKfp9PuZFnqAMn\/AOQKGVoEHRhlJpNbI7itATsEAS\nNEI5N4J2Sq\/maKKBWwMt1IcRsZBlBYAOsWAuTIAk8DhpJxI3cZ7jkgaaICECHY3pESLPVPc14URB\nBnJailEsLUPtUDv4UiHEVAbYyPPiKQvaPCZucrABLsTZ8qWjNM6UOOCoXSQITasxRwkD82CI4ELx\nEU7sYfqj+UU75qNW+BZM8GGUPmuZuNlchPqhRhhpMTeETRik76+OdNrqUKPGrOEAF+LkdQZHKVxo\nypA4oMPaJZgKDiNE2QlLWGfmDTBQeDQxC0yxERhY6kXaHJmnPyLE5NJMPL32CbRo6yCZNUFP78mo\nLmmxyVGmG6SlyY2FMMmFJb90Ds2oKR\/UJA5oN3YKAqx6I8jZaRVCVCR5aD1UUcHkJv0NT2thjdsw\nQ3q81XYPe7P3YcP25\/BF4w1YF92ILZJWCSoIFyUGlPDSAJnXIgQYov6mqAALjqsSBzTr2wVeVz\/V\ntwoqmgapMqO6ZJLphvI6nw5yqntbTN3gS6oJWoHbNWcgGCpBmzkfjf0tKJDWUAWohW+6nyaDgfNa\nhD6RDI715x+XUymrTBxQM9QicNol8FA97KMCPEhlI\/Mmq8wquktQ1NuAcnkr8kRlqJKUQamqxdGs\n91AjvI1aWrzviyvB7ypDcWshaU1FtQ0rWclrvgH6ZCrABm+39FQlDjjYImC7CnaTmNtR4Ap36jhI\nhVSFqBJTVOH1URqVLyin8OtpIL2o7MqG0daOMkkNRPRM65ShhJLVcZJKgMBYCet193FbJA5rDwya\nLsGKAU1U\/1qMQtjZDoOzlxu5RtMJr2cAVcJKiOSN8AdVXJUWmKQyNaCi+2HUEdgEyUCioprZLefA\n3KMyOG09sFH6xTaTDOoVAhq1AixDsg7ZJhDbDLJZJXCTd9iuw5hHThLoJ+8u7cUwOTBPeyhf9JLX\nXaNSikAPt+HE9ni4\/v6z25UwYGfFRwJBxZ4gGZatvXQ32ko++J+NtX\/w\/W+0yn3BLy6\/+d2T1gd3\nVpevv2lntfDaVjy4E\/t1K8ra+mVbdv3152ynlZ\/+5nf3Ij99M4\/ZtTN\/Flw+vQ5ft0un1uH88Vc4\nY9eZn2\/40tjztGMv4\/PPXvpGSz60dE45vJbB8Uuytu5MWIdZKa+vyUzeuPbCsXU4969XkXrkVaR8\nRmB0f\/H4eqTR\/dF9f8S5wy9lsHbLln5qPZ+1Y8\/Zu7yDL+E02ckDL+LE\/hdw+OM\/Yc+2Zw7mpK17\ndNVKj5tpm569eHwDmF3lbSR7DeePrMONlDeQ9MlaHNv3fPDU\/ue\/so2WTZAph14JZiZtxKUT5Fk6\nZyW\/jkvUx7XkjZyRt\/\/r1tu\/Aa\/03hN5vtsZAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/icon_grendaline-1334255175.swf",
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

log.info("icon_grendaline.js LOADED");

// generated ok 2012-12-06 17:07:50 by martlume
