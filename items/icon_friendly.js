//#include include/icon.js, include/takeable.js, include/npc_conversation.js

var label = "Icon of Friendly";
var version = "1354842538";
var name_single = "Icon of Friendly";
var name_plural = "Icons of Friendly";
var article = "an";
var description = "More radiant than can be imagined by a mere mortal Glitch, this powerful Icon of Friendly, made up of eleven separately radiant Emblems of Friendly, confers glorious gifts upon those who use it correctly.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["icon_friendly", "icon_base", "takeable"];
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

function conversation_canoffer_icon_friendly_1(pc){ // defined by conversation auto-builder for "icon_friendly_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

		if (pc.stats.level >= 10){
			return true;
	}
	return false;
}

function conversation_run_icon_friendly_1(pc, msg, replay){ // defined by conversation auto-builder for "icon_friendly_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "icon_friendly_1";
	var conversation_title = "Books of the Giants";
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
		choices['0']['icon_friendly_1-0-2'] = {txt: "Alertity: On.", value: 'icon_friendly_1-0-2'};
		this.conversation_start(pc, "Par-parrrrrrrp. Silence and alertity, Little Child of Friendly, for your daily proverb from the Epic of Friendly.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_friendly_1', msg.choice);
	}

	if (msg.choice == "icon_friendly_1-0-2"){
		choices['1']['icon_friendly_1-1-2'] = {txt: "What?", value: 'icon_friendly_1-1-2'};
		this.conversation_reply(pc, msg, "“Proverb 4,8: 15 - When two friends meet together, at night, in the shadow of the rook, the one bearing the greatest booze-concoction shall triumph...”", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_friendly_1', msg.choice);
	}

	if (msg.choice == "icon_friendly_1-1-2"){
		choices['2']['icon_friendly_1-2-2'] = {txt: "Huh?", value: 'icon_friendly_1-2-2'};
		this.conversation_reply(pc, msg, "“...The other will be called “He who smells of very stinky cheese” by all who meet him.”", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_friendly_1', msg.choice);
	}

	if (msg.choice == "icon_friendly_1-2-2"){
		choices['3']['icon_friendly_1-3-2'] = {txt: "But...", value: 'icon_friendly_1-3-2'};
		this.conversation_reply(pc, msg, "“Also: never trust Zillots.”", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_friendly_1', msg.choice);
	}

	if (msg.choice == "icon_friendly_1-3-2"){
		choices['4']['icon_friendly_1-4-2'] = {txt: "But what did she SAY?", value: 'icon_friendly_1-4-2'};
		this.conversation_reply(pc, msg, "Friendly has spoken.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_friendly_1', msg.choice);
	}

	if (msg.choice == "icon_friendly_1-4-2"){
		choices['5']['icon_friendly_1-5-2'] = {txt: "You’re annoying.", value: 'icon_friendly_1-5-2'};
		this.conversation_reply(pc, msg, "End of proverb. Parrr-parrrrrrrp.", choices['5'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'icon_friendly_1', msg.choice);
	}

	if ((msg.choice == "icon_friendly_1-5-2") && (!replay)){
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

	if (msg.choice == "icon_friendly_1-5-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"icon_friendly_1",
];

function getDescExtras(pc){
	var out = [];
	out.push([2, "Icons placed on the ground have a chance of bestowing blessings when you walk past."]);

	// automatically generated source information...
	out.push([2, "You can make this by combining eleven <a href=\"\/items\/584\/\" glitch=\"item|emblem_friendly\">Emblems of Friendly<\/a>."]);
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
		'position': {"x":-45,"y":-99,"w":90,"h":88},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAPKUlEQVR42r2Y91Pbd5rH97ebm\/vl\ndmZLcpeyae4FbNPBAoQAASqoAEIV9YIkEL3YxsY2tsHghgGDqcZ97V3bieOsWzbFSZxsEidx+iVz\nM\/vL\/Xj\/wOuerzJzMzc3N6OfjpnPCCSk7\/v7PO\/yPPrVr\/6Pn+LcNVsLczfs+f86Rbnr3IXZ61\/8\nVSY\/Jm3+Tw7TTtyWMnwNFQRtVUTsNcScdSTcetpajHT4THQHLPQGG+gLNTIQbmIw0szumJ2hVgd7\n4y6GE245HvanTwv7ky0cSB9v+hxs86Wf3xd3s6fVya6og8wAVhdgrS3CptuJw1iGy6SmxaLB31BF\nsElLpLmWVoeeuNNA0mWkzV1PymOmo8VCl9dKj7\/xv0+vv4neQBN9Adv\/OMprXb4GeY+VlLyvXd6f\ndNVnBtBuKJXKVbJj44uU7ngVg2oDPSEdg76dcrEyEvZcOjzFAkoAm\/JobS6g1b5dgJZhLX+ZaFMO\nSW8FcbuKhFO6YCkkYCkgZCvEZ83DrtshN6uiuS4Hl7kYuz4Hs7aYqF2fGUClWqFmLeV5a3Eb8un3\nabl6pps7s2GuTcVYOWTj+mSQq5MdHO+zsHDIzvK4nYvHYoy1a7lyyseFqQTnj8e4dDLG8kSYpVEf\ny8cCzIw4mdzvYn4swvQBHwtjCcZ7rNRXF0l3ajIDGLbV0OrUoS3eKNxoZOV4P0\/eXuHfPljm23dX\n+OjmSb55uMRnd2f4+OYpPnlzkidvyXkwz48fLPDVwym+enuJnx+f55v7M3z9cI6nD87y\/ftLfPVg\nQR6Vz1qVz1rix48u8ejqAIbKAlqsVZkBTHPLbaS6cAP9MSurJwf42\/1FvntvgR\/eX+XdaxN8+9dl\nudgcH14b5dM7J\/no9gSf3h7n2L4UY0MJfnhnnid3p\/jy7iTfv7fC9+8upoF9\/deF9Pn5o6t8df8M\nPz2+zHtX+9Fp8nAK1zMC2O4xCXFNUsH19PpqmdwX4eO3Zvj5vXm+fWeJDxRQbxznM6nOu1emmN8j\n7Z88SSpsZ3+7m9H+EHu7YjyYPsH1k7vlxuZ4cn+aLwXQ53eVxyl5bpmnD6f5\/P4cj28MUaPOoUm4\nnxFARYmdPqtUcC1tdjWn+n08vj3FT1KFL+\/N88GNUW5MDXFv+gzXDp3kdFcDB3a3iG24OLpLeNgb\nZGxXgqWJblZHevlg+RxL8vj5X6b44t6k3Nw4PzxakZsVOjyY5PNbB6gu34FVV5IZwF8swEpV4Xq6\n3Vom+jwCcJof3p6Vdk4xt6eTB7PTnOhs5OnrCb6738ORnrAAdKcBjvYEONQbZlciyo\/3Y\/zn0zEe\nnl3m+vhhvpWqP359VNo7I+CmePKX07x\/rp2qsu2Y64ozA6h4V5ffiiZ\/DZ2uKsY77Hx465QAnGFu\nMMWfRg7w3uUUT+8OCuAObq+EWJ4dptXbTLcY9t64nXjQSSru5cyhKP\/x8X7+\/skoN08d5t7s6XQH\nvn17Tng8wxd3T\/PucpLK0m2YaooyA6gYabe\/gZqiDdTlr2NPm41H1w5yc3oXN8fHuDET49HlEAf7\nogzGnQTtVvE3PRGfk4GoneFOJ26bjoDdQlvEy6HOIAcGE3xy08+dqVNM9vn42+tHeCqcjLrqWDw+\nQKVqG0ZtYeYV7PBa0AoHk9ZiWoS8MZeF+QNDzHS6efqGi6Bbx7HDXfgc9WKwRhIRD0OxRuIShZ0+\nSRX5uy3okEhrZrDHR293mJjc+Dd329Igd3dESEqC7I47WBRv1KiyMVQVZAZQiZ+kxFd10VrChhwi\n1kpaGqoJ2Q2SEgZc1gocBrUkQI1Uz8LKgSgjot6EQ0vUaSRs10k+2yRbG4XDdXjtZjymOlqDbjxW\nrfxdK7luZF97Cyd2RZkbslCxMxtdZV5mAJVMbHXqqSneQMiYT2P5dhkcNKQCZg6mXCIgE+4mI16b\nhYjHzon+oICvF6Mtoi9mkItX0ayXqsvNJJ3V6f8JuW10CughocBAooE9Uu2jA2HmDqY4s1uPuiSL\nuorczAAqmRiWu9QqAA15+CWGXPUqhtod2B11mGorZFiQbI7a2B+xMCSieGO5n6rKzTSK2RrrJIc9\ntZwbj7DLr+dwu4nheBP9YSeRsFCiwcrBhF3cIcRIwsnimDMNUPHCjAAqmeiXqUWxGXf1FtrNNbTo\nitkXNmI3G+TUEJWQDzRV0KjehqFkE9HGSrlAPvqqEmrVBRiqd+I1CTWMObQI6JS3nnhjFbZ6HUlf\nI8OxBsa6QsyI0GZHmigv3pr2wsyGBclEj1VDzc7NBPV5tBuqOdPTRV9PiFBTrQwS1VjEsxTQcfm9\nongHegGnK8+lvrKI2rIdGCVb9Zoiaspz5EaqhLuVNFTnyu8aHGLI5upSbo4d4exgnIWDDsqKtlBV\nuj0zgEomOs3q9LDgr8slUqlirruLJqMer7mUVrmgVZOLO1ZDh6UYTXFuGpxWlSXgxC40+Rgq8tIA\nq0SdLqOK1k4rEYtwU14LCn0sxkpuj4ywtCfJuSMeSgu3iJK3ZQZQyUSbfGiFjFst2iyCZYXMdnaS\n9NfTJUqN2yox18t41FOPV2a5ipwNLMgIVVW0iZqSrRgFXH1FPkfazVSrtjPc7SSwxyKDbzmJJjU9\ndg2eei3XjuyXzsRYGLGhKtxMRUl2ZgCVTGw2lVG+\/WU86o1Eq1TMd6awa0pw1pbiqC2kZOda\/MMO\nAm61KL2E6d1mdCVSPdUWzBU7MKnzOCYVjlgFVG8jkdkotdLCRrGSBuHaxT293Dl2VFoc4eLRIKqC\nzaiLszIDqGSir7mK0qwXBeB6UjoNx2Mh7hwc4bu32nBqfsPO7D\/g292MxSFtLFlDt1NLU9kWXOot\nhOoK8FXlMRiswSmVDg80ED3WQk3+73hys5VRUfa5zjau7dnNdJeXC2NBduZvEh5uzXAnkUz0CJlV\nAqK5dB2pOg0T0RBvjh6irTqbH9+w88WtANuynsPl18i4vgGrOpvm2jxi2nxS+nzitflUl8hEbs0l\n3F6Xbt\/Xrzfy93c6WEn1sJRq43xvGxMxC+fHApQIQIWHGQFUMtFlVVO6\/SWscpEO8b3xgJ97xye4\nMtDLV\/dCnBnWSBvXkJP1B4rk\/8p3rCU36xU0215gn\/ByUJdL4dYX0eZlk5dVQENFGZ++6eDa8CDz\n8Sgz0SCrXSlG3JVcHfelK6hYTUYAlUy0m8tEJK9hLV5DsqZMAPr48\/69LLcnmI0ESdpyUL36az67\nVYK24FmcVTtQ575M\/rrfctxayAFdDnZtHk2abP79roWSTc9JFzys9kQ42ypHQM4KbUZknDs\/4klz\nUIm7jAAqmdgkKi7PeQWXZgvxyp2ciISEM4Msp+JcHRxg2t\/CbtuLqLY8T+H6Z2hSb6Vg0+\/Z8tqv\nmW3I46R5O77aYip2vEb2v\/wTywNJFhN+lpOtUkFRrsyKs1JFBeCFo750eysz9UElExUlqwWgrzaL\nTn0VRwXQpb5uTgdbON\/VyVlRoXrTS5QKQG3OenwSc83VeeSse54rjnzmDRs5NxpGLzNl4frnaCrZ\nztmktDbs54\/9PczK58wL2HGfjpXD3rRAtJkmiZKJJlncK3JeFYDZaZEccju42NvFKb9bqpDkQm8P\nWc\/8owAQ3m1+gbrcF2iuyhYgr\/Cmt5iLpk20iNisqs2UCTd3yfI+E\/KxIq292NnOqoCdT8Q4kq5g\nMM2\/2kyHBSUTjdUFaR9s0W2hU1fJcHMj13YPMBcNc76jg2G7rKNSgemAE59w1Fiwlm3PPMvWF\/6B\nOz4Vf3ZtQ1+2XsTzMidk8lGquE9fy7y4wflUkjmpYFokMrEvHfxlWNBV5mcGUNkPFB6WbXuZkCmX\n9hq1iMQr3tXOdNDDdVHygt\/Hot\/J8YCbqbY2TkhFlxIJsl\/7DTdcJVyx57Dp2X9maqCHDpm2X+\/r\nZEY+Y7LFxSUBdi4R4Xx3h1BHx9FuExoRiFKUjAAq47fSZpUYdcCUk27xiMsu4uhjvjXKsrRmLhzg\nuL0hfcEjjY20aQpZDgWpyH6OZXs+c8atjDtK2WsxcVTmxtWOJPMR5b0RluJhpr1uzkRluXJXM5w0\npkf+jHcSRe7KZFG8+Xki5hyi6hJGvR7+NLSLEx4Hq2I1pzxODpkMaZCjVgvH3TK4ykW1RRsZN27j\nUM0mDms3MxqWqbmhnis9IqyIn8XWkDwGOe33MBUQJ5BJfW\/ClL6epS7DtVPJRAWkKuslAnKxiLqY\nMV8LN4eHmPS5pQLRtM0cNhuZkOocNptYSsaY8NmJGVS41euY9ZYTFtEsJlo5Yq7jXHsoDXBeqqbw\n8IyoWfksBeCeVmN6FmwUa8sIoCL5cjlqUXFQn0V7rbTY6ZAW97AQF5ONRlmUCyltmvLYOOn1sdQa\n57TPRnXe77CV5bKQDHNLRLXa1cZJEdS5ZCANcEXUq1R\/NhJIV3FEVoJdIS01FTk0WzP86kMxzfR8\nJh6WaMglWVXGAUczl8W\/ZkIBVjs7WI4npIo+VmMBiv7191wWNdtlaHVpNwr527mQiqYr\/sf+fk7K\nRrgYD6QFdjbkTVfwSneCCz0poU4t\/f5K6mS4cDVXZgZQ8STlVOa+SkS3iYRGxX67jZWONs7GImmi\nL4inKY\/LYS9HHU50OZtozFuTtqFLotjr\/SmuS\/Jc7evjhNMs1hSTtnrTlVcoclkcYSXVLjeuYV+r\nDp22gBZ3TeYiUY4m9xWSjfmSxToO2JrEHjo5EwxIHqdYiMaZcNrEOvyi0ibhYJwRQ608HxMj7+BK\nZ5fYUfcv5t5iEy7KBheLCh1apPoplmUvng77GHUbGErUYKgrIhDI8AtMJROVU134Ggm7ioOt1awc\ntPP09jAPFlr58FIXH55LcW2smasjVpYGDHx+Yw9vzVq5vxjik2v9PL6c4tGFPh5dHeTWhIvPrnal\nv4O5Pxfh\/Yu7eLgYT593lltlf66i3lBCJJrhV8BKJiqnvHAjteXbZBHajk1fSFj2XY+lBF9jGW5z\nCW5TsewbhTj0BQSb1XjMRbIby7ZnEwU71LJ7yLRtryDQqCLqqsBvKyPQLK9JeoQcFfJ6ORG3RtRb\nRJOsArGEJTOASibWafLSaaKX+FHGL8XllTmxXsxUyWmzTCqKbylDRYNhJ031ssfIiKYo0dFYgVP2\nFrddbkhUqnDL11KLXwaDYFBPSNZXpVrRVnMaVLytgXh7A8mOpv8F8L8ARAKhZQrDg+YAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/icon_friendly-1334255143.swf",
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

log.info("icon_friendly.js LOADED");

// generated ok 2012-12-06 17:08:58 by martlume
