//#include include/icon.js, include/takeable.js, include/npc_conversation.js

var label = "Icon of Mab";
var version = "1354842428";
var name_single = "Icon of Mab";
var name_plural = "Icons of Mab";
var article = "an";
var description = "Composed of eleven moderately burnished Emblems of Mab, this majorly buffed Icon of Mab bestows gifts and benedictions upon those who give Mab her due.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["icon_mab", "icon_base", "takeable"];
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

function conversation_canoffer_icon_mab_1(pc){ // defined by conversation auto-builder for "icon_mab_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_icon_mab_1(pc, msg, replay){ // defined by conversation auto-builder for "icon_mab_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_mab_1";
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
		choices['0']['icon_mab_1-0-2'] = {txt: "Hello?", value: 'icon_mab_1-0-2'};
		this.conversation_start(pc, "Buzz... *click*... *click*... Hello?", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_mab_1', msg.choice);
	}

	if (msg.choice == "icon_mab_1-0-2"){
		choices['1']['icon_mab_1-1-2'] = {txt: "Hello?", value: 'icon_mab_1-1-2'};
		this.conversation_reply(pc, msg, "Hello?", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_mab_1', msg.choice);
	}

	if (msg.choice == "icon_mab_1-1-2"){
		choices['2']['icon_mab_1-2-2'] = {txt: "Huh?", value: 'icon_mab_1-2-2'};
		this.conversation_reply(pc, msg, "Hello? I’m sorry, the line is very bad. Is this thing on? This is Mab’s direct message line. Anything you say may be recorded. I’m not sure we’ve set this thing up correctly. What’s this button? Is it plugged in? What’s a plug? Does it have one?", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_mab_1', msg.choice);
	}

	if (msg.choice == "icon_mab_1-2-2"){
		choices['3']['icon_mab_1-3-2'] = {txt: "What what?!", value: 'icon_mab_1-3-2'};
		this.conversation_reply(pc, msg, "... have a message, please leave it after the beep. If you have, however, found the very important artifact that Mab has been seeking for so long, known as Mab “Guffin”, please read the secret word printed on the underside of the object for a direct line to wake Mab and speak directly to her.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_mab_1', msg.choice);
	}

	if (msg.choice == "icon_mab_1-3-2"){
		choices['4']['icon_mab_1-4-2'] = {txt: "Hello?", value: 'icon_mab_1-4-2'};
		this.conversation_reply(pc, msg, "...All other enquiries, please... Hang on, does this thing run out of time? What do I push? Regardless, please leave a tone after the... we mean, a message after th... *click*", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_mab_1', msg.choice);
	}

	if (msg.choice == "icon_mab_1-4-2"){
		choices['5']['icon_mab_1-5-2'] = {txt: "Awesome.", value: 'icon_mab_1-5-2'};
		this.conversation_reply(pc, msg, "*Bzzzzzzzzzzzzz*", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_mab_1', msg.choice);
	}

	if ((msg.choice == "icon_mab_1-5-2") && (!replay)){
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

	if (msg.choice == "icon_mab_1-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"icon_mab_1",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Icons placed on the ground have a chance of bestowing blessings when you walk past."]);

	// automatically generated source information...
	out.push([2, "You can make this by combining eleven <a href=\"\/items\/588\/\" glitch=\"item|emblem_mab\">Emblems of Mab<\/a>."]);
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
		'position': {"x":-43,"y":-107,"w":84,"h":96},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANKElEQVR42rWYaVDbZ37H867vuu92\np+20u+m26SZxnG3idWI73Aaf2OY0BoMAcYj70IGEBEJIIIQOwNz3LUBcMgYB5jS+8IGd2HHiI4nr\nybU5bLJx1t3ptvPp42z7rp1xlMl\/5hlJI+n5f57v7\/4\/99z\/c2XFBV5XSA+sNGj3\/\/K5n\/Da\/fo\/\n\/qwk41BNalTA9QVX1M+e6U9J4b6b5QV7MMn3I4sJFCvoJ1up0QHkJwZgVu0jMzaIZwLMPh6iV6YG\nbcqlQciT3iI\/YQdyqa9470NO3BvIE9+iKMUXjSwAXVYwRam+aDMCKM3eTUl2APrcp6\/\/s3KC0Yrf\naLJ2o0zzQ5EWgCI1gAKxlzxZ7Cn1ozA5SHz233yq5DNLL063kiFOmH70BTLjt5CTtJUC6VbU0lfQ\nZLwqwLZRWbSLSrUP9aV7qSv1o9YQQoMpnO0v\/RUNxr3iczAO4x5qTPuo1AZQofXDoAlEJ\/clN3kr\n2ce3kJf0GhmxPk\/VXPlBvvG\/gLkpr1Eke4UypR+VJf6YFG\/g0PvSaAoRAH40mgNpqT5Km3UP9eY9\nREU9z7GwX9NXH8FASyT9zUfpazoqvtv3\/aqp3I+pNABjkQ+qrNdRZO0gM87Pe0Bd7nZKcrdh1vjQ\nWLWXpuoQumsP0l13mMGWI7h6D5CR9Twm7R7ifX6BUvc7tJJXOaELYm6qgJODUqYGUhjpSWSwI4Hu\npmN0NybiMO3FpHmLcnUQWcd\/BGClcge24l10OEJxNkfT3xjOZE8cc2PpVCjf5KTqIMcP\/g15mhdJ\nDX2ZisZtyEJ+gVG6gxTlvzKrCcMi92fRk8epcRmTIzKc3TH0tUlodBzGZjpAQXKQ94COEh9azbsZ\n75Ew2hXLWEcE5xYKGC2NRZvyW1KT\/hmDwxeFdgvq0tcpMWyh3OKL2boNV4kfV4xhzBQFsGQKpaXy\nIJeWtcyezMc9ksVARzx9rSkicPZ6D9hm3ctQczjTgxKWxqSUJb\/CYvERztUcZbXqGA\/v2\/n6fhUW\nqx9tXfvRCciKShGZBW9SkPX3XFlOY9x2mMuOWJYErEWxg4urOk5PFXJqNAtneywq2T7vAYeFn031\nHWVxXIqnM5lF9QHerj7GWN1R0qUvYrGEotZsRyp9DZV2B7LcFzFW+1JevZPyyu2oVG\/hGszkyeMp\nbvfks9GSTov1MGfn8wRkAdNDqWgy93sPONUTxqLrGBc8yVw0RHGnK5Pp5kS+uNvKk0eTGKr8kWfs\nwu4IwTMmYXUiDkvlTpo79mEs86PKGs3jr3v585MZ\/rw5xp32XO51Kti4aOLCoorlmWy02T9CwZWx\nOM5OHGcgJ4DzxeF06w\/yzadt\/Nd3qwJwlpvXHVSadjArFP7wcglrp\/PodgTT0hbC3Ek5Dz9rJjHu\nNzz6zMnjzWEe3urk9qgGpyGU2xulXDmTT2negR8BOBzK+2fSuWiMYlwXSVttIqPdycyPx+MSEd1u\nDqNKuZ3F0VSurchZ9aTjFi5xY133fV6c6pIyWL8bs8ih33wxzrcP+7ladZy7J7L44o6DGxeVGApD\nvQfUh29hUhfHFUsSszUSERTttDfEM+PM5vRwIj21Ecy70uiwHxJpJE0omYpHqLk4lc075w242qJZ\nn8+luiySx19NsjhdxldfTXDVnsSw6TBOxyHK5Ye8BzxVGMxpdThnapL598+nhC+tolXtZc6ZRpOo\nCuOdCVxekDPZH8OT72Z48s0kH9y00NO8h+VTuUwOSJiflNJRn86VcxYefd7N1581ccOayUZ9Cpdt\n0VQUhXsPOBS3nYvlEVxvTOfhJ27+8OUZ1s84sBlFZLuTeLJ5SrxmsjAZz+2bNi6tqLi4kk9PYxDf\nfj7MN9\/MMd4dyb1b\/fAfS9y70cufvp7kemsBG00yror0U6n+EYALolJcs8VyuT+fzd8PsfnZKN9t\nLnKiNokvPuljY02Nq0tUhuYoykVE640h1FuFvw6ncuNCKfc2zGx+O8OF5Wq+ejDO1x8P8\/jhNBtt\nClbt8Vyvi6NCdcR7wEvq3Vx3xHNrQCXUGxKO7uLRp+OUi9rb0xSLrewIK9NFdHREMXYqi\/qWaAZG\nEzg5lsOyR8tYbyZjoh631Uv48uNeccAxvnwwwu0BLTc7szlbEiwAD3sPeEEdzL0WGR\/2avnPb+fE\nDZwY9EdoaThCb5OEaVeGUCwMe304YYfeIDLSl6y8gzjHk2mpiWduRE6VaMOmRnP57qFHpKgJHn05\nxfW2HN5uTeWq+QAm5UHvAS8bDnJbAN6dMLE6pObRxy7u3hpCIvGlXZinuz6Z4e5MAnbtwmfXTnbu\n3InPzrewVMUx1J3C2mIlo6NpmM0RfPKBkz9uzvP4yxk+6FdzpSGR82W7BaCXeVCbEco5TSgfdin4\ntzETDyar+MPvZxh3FVFbfYTJ4UI6TqTh6ssj2C8Aafgeko8EkxwWgK08Xpg2m5G+dFqb4ujojOXb\nr5b54n4\/M00ZrDfLuGg\/yopiu+iKvleQHwzYbDjKNUMEF0SQ3Jm18KFLy9lZh2hAM5nok+PsSGF2\nQs3EQC6hgQdQp+9Fm3kAfVYgKTEhuAYyWZorpsEex5k5nehkauDxOje6Cni3V0S7JZLzonk1eQvY\noI\/iXfMx7rbn85HLjLMhl5HuPBYnVQJKOH9fFv2tMtxOJXGh+7GXRFFdHEFdSTi50lBOWI\/T35lJ\nV0sqzlYprk6ZOFgGnqYcbvap2bDFcFHnT+VfgsQLwNJoLuvCuNqSyQOPg4UJJQtTJZw\/XcbcuIqB\nznScXdkMiAYgJkIAlUtE8harLIL8lIP0tmZgNcXSaJcwNZjF+pKamZF8OixxvD2oEYk6iQulISKK\nD3kH2KiPZk2xj40GGQ+GLWjkUSyJqNTmRtJaE0GDTTQRIlWUaw5zLOIQo60KsUSSthwjLekw9sp4\nzKXx1FcnYCo+zpgzn+lhJe9N2fjUY+eqKJ3vVUcIE4d6CSh8cDF3F2uVsdzs11NXGMlJYU57eQyD\nXfl4RjRCnTSq9DFkpYQzIZLvVJccd0MOxcpk6ixp1FVLcA\/IsRsTmBlTc8ISK3KqgdtOPefMQgAx\n5VUovARsFiDzsu2sWyW806Pjg4EKBkSJcgrVFqYNuAcV9LTmctptoEwRiUf4laeniPleDXazmD\/6\nFbTVZIhmt4xltx63K4\/3Jqzcddv40G3hUnUs74gxoELprYnLoljIfJPrIpXcHjJyY7CcuZpiPHVq\nWswZfPZggoL0SNzDeayMGlg\/aWRlqJjZTjmOihROTxgozIikviJBtF5SpltL8NiVvOuq5N6EmWtN\n6ayVHhSjbKj3UbySs4sr1nTujpgYNaThscrxVOXyqWi7\/vTdHBvnbYz2Z3JurIyrS3WiHRtmeaRY\nJOok1qaN\/PHhFI8eDNEugD11Raw0iegdrODWcDk3RC68YooUCnoZxSdEg7qm3C02UvDRhIUZm5LT\ntUIhm4Yacxz3rjVyZc0uzCgUXrXw8FM3n3\/UzeXzVir0kSwJBe\/faOLuzXrm3HZW67RMmdPFPgo+\n9tRwuSaJdUMYRrmXClaL6LqkOcCtlkLujNrw2FRMO4pZFmau1SeKiBSppi2b\/vZClkXCfv9aHRtn\nLSyeMlBnFjnwqX9OlDE7qmPlhJalTvHfBjWzDhXvu4xcqUngrP7QjwAUvrGW5c\/ltjyGjcK8Ni3T\nwsSnazUs1AgVtYnYdQkYS44z0VrIiDjIpIBor0rBahDDU3G0GM6fjp0qnLYCznYZWKzT4K5XsT5Q\nzvvtopsRCpbn7\/cO0K4JY0mUravdYjwUpq1SJzBfq2bOUSRMJVr+miKxNMIvlVh0SQzW5Yo5RUGZ\nKgprcTqDlmzmLSqWGnSsNRo5K5Rfqi9mzpLPor2IdUcSE\/m7KP3LVOeFgkWiIcgN4kyHknnhd+66\nEhZrSpgTmz9dU+ZCPBYNi\/V6dNo0bIbj6OUJdAozypUJnLarhNpqVhtLWKorpsmYz1qzgWlLAb1V\nWcLEqUwrgtBl7\/UO0CI63QHJG5hlUfSbVYxbRamyqnBXCjNb1N+nG6NKglqdRrEqkU5hQos6lXJ1\nMrrCWBasGnEQcbgaAdqso0YVx5xZgasyj9LcWJxlR3GXiMFfFuIdYIUYB+sit9KWF0+RqAwTFjEc\nWYsZFzc5JUw7V6ujuFSGvDBBAEoplkvor5BjKcnGqElAlR2FR7iG25COR0Bm50sYFypaFckMVBVS\nnribwbxgARj8wwCDd7zilyMJvK+R7eHItl8RuO2XBO96AXmYDwEBL6CM2IkyzJeIgJfYt+cl9ge9\nTLD\/CwQFvkTB\/ld5bevfsu\/1f2Dblp\/z5m\/\/jug3n0fl\/y\/EBb3G1pd\/zrbf\/DWZgf9E8O9+RUmM\nL+nHfEiL9ueZn4enRQdiyN+LPmc\/BYn7fvKVHOH3\/aPip++fCVAa4ZunSg3ePFESeV8W46+XxQT+\nZCs50l9fmBx0P1+YOz8x+NmfUUuO+KyIE\/2wOcHLKzHMZ0Xc7\/9U778BT2XY6laJPQAAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/icon_mab-1318971775.swf",
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

log.info("icon_mab.js LOADED");

// generated ok 2012-12-06 17:07:08 by martlume
