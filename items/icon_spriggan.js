//#include include/icon.js, include/takeable.js, include/npc_conversation.js

var label = "Icon of Spriggan";
var version = "1354842507";
var name_single = "Icon of Spriggan";
var name_plural = "Icons of Spriggan";
var article = "an";
var description = "Buzzing with a sense of its own supreme magnificence, this Icon of Spriggan, containing the combined power of eleven emblems, is known to repay generously those who show it adoration correctly.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["icon_spriggan", "icon_base", "takeable"];
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

function conversation_canoffer_icon_spriggan_1(pc){ // defined by conversation auto-builder for "icon_spriggan_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_icon_spriggan_1(pc, msg, replay){ // defined by conversation auto-builder for "icon_spriggan_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_spriggan_1";
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
	choices['8'] = {};
	if (!msg.choice){
		choices['0']['icon_spriggan_1-0-2'] = {txt: "I’m risen, but...", value: 'icon_spriggan_1-0-2'};
		this.conversation_start(pc, "All rise. ALL RISE, for the daily recitation of the Pledge to Spriggan.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_spriggan_1', msg.choice);
	}

	if (msg.choice == "icon_spriggan_1-0-2"){
		choices['1']['icon_spriggan_1-1-2'] = {txt: "Look, I’m not sure...", value: 'icon_spriggan_1-1-2'};
		this.conversation_reply(pc, msg, "We, earnest tree-huggers and loyal supplicants to Spriggan, pledge allegiance to the All-Powerful Giant of Trees.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_spriggan_1', msg.choice);
	}

	if (msg.choice == "icon_spriggan_1-1-2"){
		choices['2']['icon_spriggan_1-2-2'] = {txt: "I’m not really a Spriggot, tbh.", value: 'icon_spriggan_1-2-2'};
		this.conversation_reply(pc, msg, "We swear to pet, not poison, water, not weedkill, and never to go against the grain, when we know the grain is good.", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_spriggan_1', msg.choice);
	}

	if (msg.choice == "icon_spriggan_1-2-2"){
		choices['3']['icon_spriggan_1-3-2'] = {txt: "Oh come ON...", value: 'icon_spriggan_1-3-2'};
		this.conversation_reply(pc, msg, "We will cherish our wood, and love our logs, and never take a hatchet to a dying friend, for every tree is our friend.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_spriggan_1', msg.choice);
	}

	if (msg.choice == "icon_spriggan_1-3-2"){
		choices['4']['icon_spriggan_1-4-2'] = {txt: "I’m sorry, I can’t.", value: 'icon_spriggan_1-4-2'};
		this.conversation_reply(pc, msg, "... nd above all, deny our loyalty to any giant but Spriggan.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_spriggan_1', msg.choice);
	}

	if (msg.choice == "icon_spriggan_1-4-2"){
		choices['5']['icon_spriggan_1-5-2'] = {txt: "But, but - it’s not. When is this from?", value: 'icon_spriggan_1-5-2'};
		this.conversation_reply(pc, msg, "In this, the age of Spriggan.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_spriggan_1', msg.choice);
	}

	if (msg.choice == "icon_spriggan_1-5-2"){
		choices['6']['icon_spriggan_1-6-2'] = {txt: "That’s terrible. This is awful.", value: 'icon_spriggan_1-6-2'};
		this.conversation_reply(pc, msg, "Now and ever more. This is our special pledge. Our lives are made shiny by it. We wooden’ lie.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_spriggan_1', msg.choice);
	}

	if (msg.choice == "icon_spriggan_1-6-2"){
		choices['7']['icon_spriggan_1-7-2'] = {txt: "Unbeleafable.", value: 'icon_spriggan_1-7-2'};
		this.conversation_reply(pc, msg, "You may now continue your day. Transmission ends.", choices['7'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_spriggan_1', msg.choice);
	}

	if ((msg.choice == "icon_spriggan_1-7-2") && (!replay)){
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

	if (msg.choice == "icon_spriggan_1-7-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"icon_spriggan_1",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Icons placed on the ground have a chance of bestowing blessings when you walk past."]);

	// automatically generated source information...
	out.push([2, "You can make this by combining eleven <a href=\"\/items\/590\/\" glitch=\"item|emblem_spriggan\">Emblems of Spriggan<\/a>."]);
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
		'position': {"x":-37,"y":-105,"w":74,"h":94},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOIUlEQVR42qWYaVSUZ5bH\/dLT05np\nPhnbGDeUVVQQEdkXKaAKKLaiWAsolmLfin3fURBZFBEEFREQwQ1UMAjE4KuJMbRJxCUne2InncVk\nMidLTzrpySS\/eWAm0z3zoT9U1zn31Hl5i3p\/dZf\/vfdZseJvvPxlzvXuDjaLLnZW\/GzerjsJV7pJ\nan8Xaek9ItBdig7ylGKCZVKcykvShvpI8UumlktJ4QphfpIuwk9KifBfNjd7K2nHFrP\/NeedWyXn\nXVaJKwx57bK24Gdz3G5OmM92dKHOJIe6kBbuKsyN7ChPcqJl6DXe5ArLi\/WmSKugJNGPsiQlZTrl\n8nt5UgCVKYGUJPghd7bkr7\/bztq8\/u8ClDuZkR1iRJ5qDfmha8kNXkteyDrSFU+hD15HQegGiiLW\nUxZnRlmsBaXRxhRHbqAi1oSaBDOq403FfSPqkiwpCt9ATaIl0Yq\/ANrv2HzJYEClzJ7sMHOashwY\nPpDBSHcugwcyGen8bxs+kC6usxjszGWgI5vxgTxOtKYz3LlkaZw6lMXI4WyGu7J4Yfrw8v+f6spm\n7HAecUEOOO6wxGGHpWQQoDbUezFbG0hywAaa9S6MdOl57YVhjrboGD9eJK6zl+FOtKczPpTN1EQx\n42Pl3JgtoL8tWYDlMnYkl1FhZ48V8ekjiTO94t6BbK6crkOfIEfkJ8FyJ8MAc7XBkj5BRVqomQB0\n48ZEC2\/fHmGwPYPXbvUzPVrH8dZEJkdzGOwuFNAVXB8t5PihUibP5nPiQAqne3O4e6ObkwczuDXb\ny\/xEBw9eGOTc0aJlwJRof3TRCsMA8+NDpYIkNXkxW6lKsmWgJYUrg1WMdecw0V9MU2EQ7y+eoL02\nk9kxPWfbozjVFM1oayzdTancfnYf3Q0aro830NsUz5VTpdyZ7WKwI0N4Mp9srReJEQriI3wMAyxO\nipCKkyNICzGhLMGKiZ4CPn\/jPJePldJZHcOBigQGDqdzoimJS0ez4fv74v45\/vThBbqqw5kaqmO0\nT8fF\/kI+e2uCB7dP8mhxjIH2VIaFR9M1u4lVexGjlhkGWJ4aLZWkRJISuImWbBdevNTCjfF98MNr\n3J7ey8JsC2VZEezLlfPjp\/PCQ3XwzSynuwu4NdkpPttOb2umyEM9b905xcJcFw9vjdDfnszJNh2p\n0e5EhewmWuVpGGBFqkYqTV0CNBLyYUlHZSgvXWlnT4GSr96d5o8fPcsXj+Z4eL2Hb\/8wSc8eLR89\n6OOZkWbuXD3If3y+wCdvXeHbT+Y5JSCvjNVxc7KNIZGbx\/ZGkRzlRkSQO5HBHoYD1mbFkSFCnBts\nRGtxMIfronj8+jm+ePsis6fr+f7xZd57ZYSxg6l89nCYjxcHuH+tRXj3IPNXOuCrZ5e9\/u0frjJ2\ntEAUVTz9LVqO1IeJCnYlLNCNQLmD4YCdFVmkqUypTLDmcE04HRXB1OV4s3i9nalBPY\/u9XDvuTY+\nvT\/E7xd6+PL1MW5fruf9u4NCekr47N1h3n15iPnxJo40xQjTiCJJFIAqEsNdUCtdCZI7XjK4SNpK\n05ZlpiLeQgCqRPKrhFQ0897DcRam2\/j6g2nefPE4izP7uT9\/gOtnSrlxvoQHwosf3D\/D91\/c5nmR\nFtcE4JmjuRzbHyc8GEtPXQjxaidU\/i6E+jvXGywzTYU6MkUnqYg341BNiAhzAHfnu3nhajvTg2VI\n441cPVHEq9PNTB3PZv5CLa8+04h0oYFbU838bq6V3z8c5eZcNXefbRPVH0JvnZr9eZ7EBdsT7OtM\niK+BgFlxwVJ9npZ0tTlVus101YbQUaXi609uCu+10yO0rXdPLPdmWnh+tFjITx61WXKO7NEw0ZfF\nh6+eZOZUMbeEB+fGanj0cIxDtWq6RSQOlvmjCbInSOFEkK+jYYBpGqVUla1BqxCDgGj453szGRW9\n9cMH57lxoZqLx3R0VvpzpVfLy5OV5MSJKSfag31FgeJ+JVcH9PSJH3BntkMAVvLw9mFaS4O5fLyQ\n80I\/lwADfBwI8LY3DDBJzHHF6eHigd60FrqxcLWF9poIHlw\/zJWjelHFRfTWKBlsjmCyO55ynQ8Z\nsc6cFoPCaGcS82er6alVCWlqZvxoKpdFKhwUEeisVDHRrVsGVHrb4y+zMwxQq\/aR8pJVIsSbSQ1Y\nBf\/+otC+Ob54c5Rboq3tzbCjNc+N0fYYhpvCxWxoT2qUA3v1Cgb2qnnpUj0jbYnC06n8+K9X+f6z\n5\/jzRzPwb\/NkicIL89uBn9cufHcbCKhRyaSsxEAS\/E14\/WanGK109DVr+PPHM3z6\/F5enSzm\/kw1\nL1+u4WJvOiUpbiSpbKjLkHGlL5vrY4Wc607l6zcG+ObRJX786paIhJLGTDnXxioIlVvj62mHfLet\nYYBC5aU0rUhm7\/U05frw1sI+\/vhOJ3wp8dVbg3z99gmmjiRx60I5D55robMumgM1Yjg4U7Us1vev\nNnN8X5hIiUP86aObXDtdzjdvHuK7D4Z4+VIVaoWNgNuJt7uNYYDhYt9IiPIhUmHOA1Gp956r4UC5\nAr67w9svHuT9m\/u5eS6f4bZ4pvqzRPJn8c6LrbSWKJgR1y9drGK8S8O9yTpemdqz3GlmTiRwrNaL\nM62hAmwHPu627Ha1NgwwVCxFmlBPNEpLdH4r+enxJHw+w9D+KMaPxDM7ECfyaZr\/fDzDD4+fob1Y\nQWuBD999OM5Pn0zw02czwsuj3Dir50x3Gi9dFoPG13N88nIvRVFWyFxt8HKzwd3ZUEB\/ZykqxIMY\n5WYylau5fSGfet1OsZuY8fpUPofLfXnhYhYP5sSDH0\/z7bvneHitUYxcvfwg0qCvIYRTPTEsTFbz\nwa0OyrQ76S5ViNwtIV+9id0u25chdxsKGOznvLRWEhtgKbYyC9oKZJQnO5EZZ8\/CmTQuH01k8bk8\nnj9Tzrt3Bnh9tpTbQ+nce6ZZAF+iRb+LkRYfPr4\/QkdZGLF+QvAT7diTZUd1wlY8XbeLMNsaDihU\nXlIHuAoPWlIYaUx+pAn5mm2EykyY60\/hbKuaD+4cZG5Yz9xQMQsTRQKuXLS9Bk7WKXhzrorFS2XM\nia6ij91FuLexkJeNwpObaUixFuHdgUIUifCiYYBLY9BSM4\/yNUevFmtnuAnpYuwK8djA1V4N17rV\nXOpUL08696YqeWemjJfGSwRkPTOiu9SlOrM4UY10MpOMMDsCXdejDzemXGshVtBt+HjY4ifbZXgV\nK33spWDRK5dCXKAxozDahLY8V3KjLekqcOZMnRf9tXIKNfbMDCQw2hTCtf443ni2hlKtNbKtv2Co\nxo+RKk+0\/macbg4ScDsoDjcVu7LlsveU3g5LYTYM0F9mLwXIHYTMmFIWbUaOCE9Dhg+zPWpmhmIZ\nEGHsK3NnuCOWhZFMWtJ388r5NG6crqBE54bKdR2H0l2Y6onjaruc4WpnsV+LlHH+NWUa82XvBcod\nDRdq8QWSv5c9Mf4WlMQYoY8wpS53KzXZW9iT6kFHoRMtubY4m6\/gvfla7p4vRBrQsHA2m\/0lYYR4\nGnEgz4mhWpn4\/HbxHfZCDdaTovgtpVHG+Is+LEYtwwHlHraSr8yOOOUWCtUmlKYYs7fahK7GHRyp\ndWV\/qStVCXZkh27h7sU8pvvEltfgRXe+r+g8XsT6bqRCVOvJKgXVqVspSjalOHE1+WFrlo9AliaZ\nUDFR+xo6LAiVl+QeO1HLzGiqNKW5YRN7azZRV7aRPYVbSYt\/kvxkBzEwyDjfGc5pISl5oRYMNYRx\nvE5Jl+goOSFWZCdvIE2ziapCExoKjTnYZEG2ao2YBR0R3QpX+20qgwCFDEhLUqBVW7Cv2px9dUIe\nKowpylpLbZEVceIhfp6rCXdfw0h7pCgYdyK8VlOdZEet1pH6dCtUslWkxqykttSS+jJT9pab0Fi2\ngeZq0+Xwio0OF4ctngYByly2S0tKrxO61bZXWLMlrY2WlOSspThnIwqnp4gJfxJfp7VcH0qmKNYC\nR9MVxPs+zcU+LVmxG4kJ+RVq79Xkpa6hOGMN9aUbaWvcTGu98XJ4NWGyvwPwfzyYIGSlqdaY\/Y3m\n4tdvoiJ3LSlxv0UTaEJCxGrsLJ5kpi+FxlJvPGz+GVenXzJ3Kosw1Vriw59CpxFFkWdEVbExjVVi\nQ8zdLCJiSliwO9poueGAP+egLs6K5nrhwSYrmmrMKc1dQ17GajLi15MU\/TTK3UbioR58+rCf1Ijt\neNj\/g+g+\/0Kw96+JClpJqnYVadqnKcszpqpoE4XJW2ltMCNS7UmiGOcMBvRwspYUu+3Qhm+jUeTg\n3hpLmmstqSsXXigyISdlDamJa\/B2XEtC2HoSI4zERG1NbsousWc8gTrgN2jDVpIcs4qc+KfRp6ym\nSi8KrGItycGmREd6kxTvj6PNZsOOgHdamUv22y3QRlhRW2bGnhoz6kWS11eYCcBNFGSuJ0u3Fl+X\nlUQqVxId9BQR8o3kxm1G7vArPG1XoPL+R8IU\/yRWzCfISnyKinxjCnS\/wdfmCUICXZcPMA0+Arbd\naib9fEyrDbcU+WOxbHtqLASgEaX6TeQkr0MTvA5t1NNEq1fiuPOX1KTZERO2msSoVcKDT4ocfBJ9\n6irydKJYUlZRmb+OCKXxX86orSwGDQK0tjCW\/vqw299rG+pAaxE6a0LFu8pvG0ofS9GutglNE+Zv\njVJuJfZca9ElthKw9HffbYQorURB2BARart87W5v9n8O0XdZmxt2NrPFzEiystiEjaUJwpvL5u6w\nBOi2GKnyENO2TNKEy6SYCB9Jq5FL8TEKSSS9JPJK0iUFSqm6ICktLVjKyAyVMrNCpegony8dbS3\/\nH9zfBvwvcjZ267f5GlMAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/icon_spriggan-1318971772.swf",
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

log.info("icon_spriggan.js LOADED");

// generated ok 2012-12-06 17:08:27 by martlume
