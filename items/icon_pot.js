//#include include/icon.js, include/takeable.js, include/npc_conversation.js

var label = "Icon of Pot";
var version = "1354842486";
var name_single = "Icon of Pot";
var name_plural = "Icons of Pot";
var article = "an";
var description = "Quietly vibrating with a powerful inner light, this Icon of Pot - composed of eleven carefully won Emblems of the same - can deliver great things to those who treat it correctly.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["icon_pot", "icon_base", "takeable"];
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

function conversation_canoffer_icon_pot_1(pc){ // defined by conversation auto-builder for "icon_pot_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_icon_pot_1(pc, msg, replay){ // defined by conversation auto-builder for "icon_pot_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_pot_1";
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
		choices['0']['icon_pot_1-0-2'] = {txt: "Attending.", value: 'icon_pot_1-0-2'};
		this.conversation_start(pc, "Attention, supplicant.  Attention. Attention Supplicant... att...att... bzzzzzz... attention loyal supplicant.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_pot_1', msg.choice);
	}

	if (msg.choice == "icon_pot_1-0-2"){
		choices['1']['icon_pot_1-1-2'] = {txt: "Reception’s terrible, dude.", value: 'icon_pot_1-1-2'};
		this.conversation_reply(pc, msg, "The following is a ... urrrzzzzzzzzz ... announcement on behalf of Pot... click! Cick! ... of Pot.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_pot_1', msg.choice);
	}

	if (msg.choice == "icon_pot_1-1-2"){
		choices['2']['icon_pot_1-2-2'] = {txt: "Sacked?", value: 'icon_pot_1-2-2'};
		this.conversation_reply(pc, msg, "It has come to the attention of the giants that the stash of... urzzzzzz... hell wine has been ran...rans... ran...", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_pot_1', msg.choice);
	}

	if (msg.choice == "icon_pot_1-2-2"){
		choices['3']['icon_pot_1-3-2'] = {txt: "But...", value: 'icon_pot_1-3-2'};
		this.conversation_reply(pc, msg, "Ransacked. This is not acceptable. Also, Pot wishes the Potulace to know, it shows very little taste in alcohol. It is bad, BAD wine.", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_pot_1', msg.choice);
	}

	if (msg.choice == "icon_pot_1-3-2"){
		choices['4']['icon_pot_1-4-2'] = {txt: "*kick*", value: 'icon_pot_1-4-2'};
		this.conversation_reply(pc, msg, "And just because the Giants are sleeping, it does not mean they do not know what is going on down here. And if it contin... cont... cont...", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_pot_1', msg.choice);
	}

	if (msg.choice == "icon_pot_1-4-2"){
		choices['5']['icon_pot_1-5-2'] = {txt: "Wait! How old IS this...", value: 'icon_pot_1-5-2'};
		this.conversation_reply(pc, msg, "... inues, you will all be eradicated by the rook. You and your sheepies, ducks, and sorbetflies.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_pot_1', msg.choice);
	}

	if (msg.choice == "icon_pot_1-5-2"){
		choices['6']['icon_pot_1-6-2'] = {txt: "Hrmpf.", value: 'icon_pot_1-6-2'};
		this.conversation_reply(pc, msg, "This is the decree of Pot. Message ends. Bzzzzz.", choices['6'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_pot_1', msg.choice);
	}

	if ((msg.choice == "icon_pot_1-6-2") && (!replay)){
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

	if (msg.choice == "icon_pot_1-6-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"icon_pot_1",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Icons placed on the ground have a chance of bestowing blessings when you walk past."]);

	// automatically generated source information...
	out.push([2, "You can make this by combining eleven <a href=\"\/items\/589\/\" glitch=\"item|emblem_pot\">Emblems of Pot<\/a>."]);
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
		'position': {"x":-55,"y":-100,"w":111,"h":89},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOnklEQVR42p2YeXDT55nH88fO7nST\nTVLCaRt8YLBs5ANjfGEs4\/uUbXzf8in5lk+MLPtnGwsLH1jyBb4w5nQIVziyhJQQEgi0aUJOGrLZ\nJFsSknabpNNu22na3c++Npii2Zkd7WrmO680kub3+T3v83yf5\/098YQVr\/5QR\/uhCGfFWLSsYF+s\nmzQePy\/5gkaFzLFyaTBaLvUJ9UTKJYNQR7ibpA+RSS3BMqkxaL2kDXSWKvydpTIfJ6nI20HK91oj\nZbnbKZ74\/7w6t6wpMEbIr\/ZFuX0uLsxIvCdjCV5MJG3iQKovM2l+HEr350hmIEeztnAsO4jjOcHM\n5c5LwVxeCM\/nz2sbcw\/XeR2fl\/ju2EMdzQ3hcI6C2exgrlTFX\/2JkFWA2iCZJG1zJdxhCREOzxHp\n+Bwx61aS6LKKVFcbMjfYUuhpT7GXg5A9JUIaHycq\/ddT7uuMZrMTZZschRwo83FELb5rD3ZF\/5ja\nFBto2uJCma8TpeL3xeJ3h\/NCsQpQF+ImdYXL8Vj6owW5P\/cjglY9Q7jNMyQI4AznZRTJllHutowK\n16VUb1hOvccqtJ4rafC2o9l3NQ0yOyrlq6j2WoPa3ZYy+UrU4kbUno6UezpQ4eWIyt2eCCcRgIea\nyAqxDnBXuFzqjd2Iz8qnFrRpxVMELHuS4KX\/SPzqZ8l1XiouvpJmAbPD25ZWn9XoNq+mQ+FEhdtS\n8kWE6wTYPLjWfQWVYi1Zv4Ril+cokS2nyGUZJa4rKNhgR9TapY+0P2ubdYB7oj0kk9IXf9unH8jm\naQKX\/xNhK54kxeHHFK5bila+nBYRsXZ\/RwwBToy311Jf5IxWE0lbl4FmfQvddQkky1fTJCC1G1ZQ\n42lDmVhLXFZQ5rqKfDcbYsRuLGos28otHoj1ksZS\/AkS0ZrXlvl1+VPE2T1LlsjHyg026Dba0e5l\ny\/O7cjB1RNJaLqe+UsXRyXRMY2oaNM6U5wVRnrmO9tJwdvjYU+tpR81Gka9ie8s3OqESEYxbt\/yR\nRrLDrAM0x3tL4+lbUIgiUdg\/0Hz+pYg8KZSJXPOwpTvQCXOYO8Mh9hh3hFHT0sjLp8\/y4tFCRlo3\n0l0TSUPlRuo7DaRFedPu50TLJhFN37XUeDug9lhNicjF+PUrSHiooexw6wBHld7SdOZWtoloLWrr\ns39HquOPxdasoH6zPU2ebvTkenN6MB7TgJoLY9m0lAXRWroJgzaIXfkedDb40lIXT1ulFz06BYXe\nYqu9ZQJSVLyIZL6bLUrZygUlCplyIqwD3JfkIx0QgKECbFExts+S4bQUjWwF+s2OaDNdePVEG2cm\nYulqCuX227d5440bTI\/Gom8sZ6A1lVPPn2d0cj9txWuZNWdj0iUQv3YJDQKu0XcdRR72JIlcXNTe\n7P8D4MGsrYSLLQ17KKXDMnJEItd5rqZXVG2PdgNjXcn0S7GcGdnK3bdv8cFHb9DbXsyAScJkqmF2\n7hjjE\/00F9kyPDqFttCdGNkSOgNkworWUuK+mu2iUBY1kBVuPeBMVjARovQXlbBmCaVyO+F3tvT2\nGZgeiGS6J5hP797hsy9+waeffcnllyWuv3mVG2+\/zemzx5g60MjcmVNMHx6ntjKHxhI3yuu1ZLuv\nYqcomhKxG6nCkhbVn2kl4HCSrzSdrSBaRGxeUULpzquo9HBAV5NLncqXE8OhvPPJv3Lv\/n3uvHWQ\n2zcP8s1dE7++uYMPLubz6uFE5vrDMQ9VMzxYh3lsHGPvEC2FviQp\/Wj1dkEt3CBN3PSi+jKtrOJB\npa80lR1C7PrlDyQsIEVUskqYbFdbLeb2SK5fv8Hnn3\/IvU\/P8+3XN\/n+63f47pcXuHezjInuYG6e\nVHHxYAWvXz5Fr15Bp3Ytu83DdO1qIzHYhpqUSOGL9haAe9Kt9ME+ATievY0EYajzihfKEX1Ymx9P\ndWEYZ05f5I7IuXvv7eXPv7\/HX\/76Ln\/83ev8+ctj9FT7c\/XWLWY7NnB6NIaJXncmRCrs25uCpHaj\nvduIpkZLTmYUje52FoDGdCs7SY\/SX9qfE7pQ+osqLUlnh7YQ87CZCy9e4\/ZrGj5+5yKffXKMf79\/\njd9+dY7f3tmNWefN\/jZ39neH8YIpiNPmJF4+2cZgdxID7Rm0FKykUddORk4mOk066QJsUbvTrOzF\nBgE4lhMuKmvVgpKFygvS0VbnMzhm5vxoCu9f2c7vfv0VP3xi5LsvRjnQ481f\/gTnxqJ55XAoU8Np\n3Pv+Owbb4zg7XcikTsbswQmRIsmoszaSU1pIU0miBaAh1UrADmWgNCJM828VZoMmL4WG2iJGhoaY\nNWVw972f8sE1JV+\/W83vhQ6OZjN8tJeJThcu71Oiz3Pl0pWfYChfJyK6EUOjMO7WGHaUelMqDD63\nqIja\/BgLwO4UhXWA+vhAaSg38tEfM0SuVKjSqdcWYWhSMrk7lEsHo\/num6+5cyGT98\/n8Op0GlKl\nPb\/6eRt3X8llqsMHY+VKTo5E0KuVifdOjJg7aKpXUpy8joRYf8pFUaQ9ZjOd24OtA2wRgIM5kRZ3\np8lLprYin7Yqf8xSJsfHQ3jtiIobJ9M40pfEv93\/ktFOBW3l3tz\/9gcOGAO5fr6SP\/zHHxjvErZS\nvpaWUhcRPXcyk71ICnegMiPsoUk\/SCUpeat1gM2xgdJwfrQFYHlxFm3N1Ri7tcz0VnFuOJ1LEwmM\nt4RwwBTOaz+9hlRui6F5Exdev8LRPj\/GOkK4fO0mY7sCGGv1pbXYhrocJ9RpCtJiY9FVZlgUoj4x\nyDrAWLmDNKPZbmEBpaoMWhvzMPW0MT3Zw4WpUs5PJ\/PNe6\/z\/Ts6fvjlLN9++gJfXsvn5FgKdYme\n1CQ\/wXSLJ8PGTcIb89CqXTCbe6iqTSEnPRlJq7KwMp1yi\/WA0+pkC8DyPDGVNBTTVB3C9D4j56az\neWkmg4\/ePMZXN03cfyuL6zeyefulHj6++yFXTuzjyE4vbt96mZdOdFGbK0MvZsZOXTK7uoQPZgTT\nrs23aAYt8QHWAUa7OUiTZUmWgAUptDap6doZx1RPJBdmK\/gvfuDb93q4JEDfulrBjdvXuHKpj7nZ\nJC7OJPOzs7u5+eo5ZntC+fDOF7x+6SB7WyMw68MoFie5lspsi3baFOdvHWCk2xppvERp0cg1+dtp\nqc\/H0KlBX7WNazfe5T\/fb+NPtxvgN3McMYTyykwKV09UcefWS1w+XMbYThl3LhZx61Qyb54wsNPQ\ngb5aeGBmMI0VSpo0qRYDSV2Ur3WA4bI10r7iBItRqDA1WmyvGO976jg2tYcDU8\/zL9cL+SN\/5dvb\n3bx6IIlT5ggmuzcyKnli2rGa63Nx\/OZXr\/DzN45zeMbIkYlWWutzGdCnM7y7nrqi+IWRbnGsq4rw\nsRbQThoVf358mCzOSqChKoe+XbVMDmg5fXKEX1zK452LGt7\/8GfMnb2BoWqZsBwfjvT6Maxz5cbV\n83z08Se8dmmQlyfSKc1PYWZfG2Zxk6aeampzfC2GYnWot3WAoevtpGFVnMU4nrs9ijqRMz0d1Uzt\nbeDFQ3oxBERyfjyZE0MKJg1+vLg\/jqP9CmYMW5juDsKoFaB6D6b2RDDSpmB8sJUpUwtDxhr6xY3W\nlaZaHCuKFF7WAYast5HMBbGPDjPzNpCdGEWlOgt9vUpcoI7TJ3q5ctrE2ZND4r2ZY6MaDvdtY1J4\n3sQuf\/Y0eVFbtF78tgWTlMbUYCMHh\/QY9Vn0dVVg7KikPDfG4mCWH+RhHWCws400KPrk40fCrMQI\nKksy2CkKxdhdxbAhk\/PH93L57ChXzu\/nwpkBjvUGMNMXKjpHID31m9GoUnlh1sjMpI5D+7rFeUUc\nBYwNYhcqhemXLQAuHm3nlRUgtxZwpdSfG21xqE6NC6OsMF1UcjF9ndVMjLYyd3APZ47288+nhnnp\neTFEDOYxN6AUphwiWp4n+wZ3inxVMzHQzIRJx3Bfs4hclRga1OgaSlClhBFg+8yjBwQpm12tAwxy\nWin15kRZPJZIjAknL1tJfU2xiEAdk2OdTA\/rOH6oj3NzJk4fMzE7McAZU5oYJqJoKpJxaKSd\/QN1\nTIzoRc5p6BEGravLZmdDAQ3V2eQmhj56vDIvpTgGWAUY6LRcMooj4OMPdhKjg8nNUFJZliYuUMTQ\ngJ4ps8TByd0cnTIwOVTBoQP9zJkTGWxViFFqvchDUTx9NXTVhdGtzxUDQzCtzSox+BZQmuVPerir\nxQOqaA9n6wEN4oQV7rjkkSLDfMlIi6W8JA1dYxV7OusZNNYzureVMVMz42YdI8NtzA2lsaPCD03W\nBkYGRc7taRZw+XS3V1En+ntLbTbVmmRqyjLIjN+K67P\/sCDZM39PpPta6wE7UkMtAEO3bCIpIQpV\nTgz1Ygpp3VlEr9iyzsYoBro1wh+FdRh1VKQHoErcQlW6iyioBDrE\/NdWp6SlKpF6dSLVVemU5UWj\nVsWTnRCEiwBbVLS7k7U5uFzSJSssAEMCN5IQs43t8X5UqXPZUa8WjV+NoX3eMmoEoBajSP7irBDU\neUo0GQE0V4bSXJWEvqmQ2rJYSvNCxDwYjrogTIxvMaREuFgAxrk7WlnFArAxYasFoGKrD8qYMNIS\no0VHEMVSXoDUXI5eVGN7o4r2JpUAC1poh5X528RncX4uzWJHVQr1FSlUqDOoKVZSUZxIWaoX2sI0\n0qI3WwAqrQUMEYA1sYGP4HJkS+nf5oQpYh0j0TL2xbmxP34D4wly9guNxssxx8nZGyOnL1pOT5Sc\n7kg5HeFu6Le5siNYRkPQemoD11Hht5ZSH0cKve3JdLdl0\/InHwEmuTtY2eoEYEVUAErnJTR6r2B3\n0JoFQLMAHI353wF7HwcMswSsCfgboGqjPbmeq8mQ2xJo8\/QC4HZ3eyuHBQFYIqpWE+yOZqs76vlV\n4Yla4SHee1Am1tKtHhSL74qC3CkMkj\/QFjmqLQ\/WwsANQm6oAoT8XSkUKvCTofJzEauQ73oKNq8j\nf7Mz+T7OpHvaU7j5f9rMfwO7bwr2rYRIIQAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-10\/icon_pot-1318971775.swf",
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

log.info("icon_pot.js LOADED");

// generated ok 2012-12-06 17:08:06 by martlume
