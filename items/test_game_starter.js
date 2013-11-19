//#include include/npc_conversation.js

var label = "Game Pig";
var version = "1314681228";
var name_single = "Game Pig";
var name_plural = "Game Pigs";
var article = "a";
var description = "GAME PIG IS THE BEST. GAME PIG WANTS TO PLAY FUN GAME.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["test_game_starter"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.shared_game_manager = "";	// defined by test_game_starter
}

var instancePropsDef = {
	shared_game_manager : ["Shared game manager to use for starting games "],
};

var instancePropsChoices = {
	shared_game_manager : [""],
};

var verbs = {};

verbs.admire = { // defined by test_game_starter
	"name"				: "admire",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		if(this.shared_game_manager) {
			var choices = {
				1: {txt: 'Color', value: 'color_game'},
				2: {txt: 'Crowns', value: 'it_game'},
				3: {txt: 'Maths', value: 'math_mayhem'}
			};
			this.conversation_start(pc,"Which game do you want to play?", choices);
		} else {
			failed = true;
			self_msgs.push("Oops, this piggy ain't hooked up right.");
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'admire', 'admired', failed, self_msgs, self_effects, they_effects);
		if (!suppress_activity && pre_msg) pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

function onConversation(pc, msg){ // defined by test_game_starter
	if (msg.choice){
		this.shared_game_manager.playerJoinInstance(pc, msg.choice);
		pc.sendActivity("You are transported to a mystical land of fun and adventure!");
	}

	this.conversation_end(pc, msg);
}

function onPropsChanged(){ // defined by test_game_starter
	if(this.getInstanceProp('shared_game_manager')) {
		this.shared_game_manager = apiFindObject(this.getInstanceProp('shared_game_manager'));
	}
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-40,"y":-55,"w":81,"h":55},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAEhklEQVR42u2X7U9bdRTH+Q\/6JzQm\nvjG+aBbI1IkUWCdRmbPzBdkLxW2KMcMBm3uAArctLdy1pRf6IDBYKw+ylofVFlFmwUvbtQwZXAd0\nJprlGuP7+yccf+fixdu7tlgLyRJ7khOa3733\/D7nnO\/vgbKykpWsZCUr2ZFaeiFI7YaDjc8l3NPo\njCodCULC0wfb85N8Ohw481wBPonMaLfnJiDBmGCFbofNr0cFhJa\/82iEVq27zJrcQRbn1TsLAU1R\nICSGcmJp\/PHMV5ByW0VnHd3wJBxowWcIlXJZmBVbp7BougqWt2vV5vqaZznwA2wDuvSx0jABrAbq\nSfLdcIBVuJBljN0JTQsp0uINnwsSgz2AY9jqn8YGuDDVBnM3LwECej96v8V0ukaLTut0qmcAxAki\nQQZBEBR\/p8NBToI\/Cicth8We6xBzGiHpsahztojA8fiBmF2WQDv3poCbHgWsxPptp+ibE0Ow+810\n0ZBbUyOArc6rIdwG8lULgSQdyf3hsP1QIHcCdw5eA4\/Gh9hcARAkGyA6LoJCYH4O3BGrj5WTkkM5\n5YVL9Js1W9NjOYPKV6LcidAL1x2BW+2nwPf5eQh1tYrAqP9su8A\/gINWKlugtS9vZbQQx6TsEfq\/\ntBd1fLfHAGhjQ17wtjaJcbKdNn+uJ\/Zan3TToVy6K7SF+VzqxG\/RCDAMAxRFwbEXX9hLllRROmmw\nmtj2p\/EoiIBxpoc9KDg5qg4FEvdDhDR\/dgEnh4baSlkC45Dy2kjbfZBemIHfU6t7gDGHqQUfHgR4\nWJCoO9Svcqt6eJsBsrGL\/sv392CDvLe3gmlalfTahfxBfbDh98BRbtxi5f7+jYCxEQfsCxKrmA9g\nc3IE1oYcRwoo91+Xv4WNoJ\/PWDVEi34EybpZjw3+qwoWIgNudkL0XIB\/JOOZ1zNsdbzfzKMGMlff\nODxw94FyPBuccj\/Npm2Mg+OYMCb+nbUD2AGL+DfSfQXuXmnyL9E5rmAP3DSfcVaSCeNOMyQGrGIw\nrHAuUBS5Egjfxxj4DFcoJooecxhFX3UYBeLsqt3IEJk1YpHynirKLQehpGByx0lwQrljIkpA5XcE\nhCdAoVi\/kcITrODLJ2Yi19H2\/JSYGWujONbWnRVW7nLAx7MT3DLdyROHaK8BonQXFH1Nj9tNZ+SL\nQTrIf+ht194nGlm2UZAcdsLa6CBsTQ5nVAABMxYSudguWdrZmJvel0Wxt\/cyk\/6UNtzXBbPUF\/Cj\nxwZzhsscjq9YDGrX+Qbwt34Ciw4T3L\/VCcoDHrWErd8HJEfXkrWjJeG1Z0AXBdhUXq7qeFfHU+9U\nQa9eB7azuv22NFdVUG01r4D5dHXGuGwvbcQqShLB23mUvqHyfPqBkPR5xITnjdcE\/P+jKMjmymOa\ntprjgrm+OtSnr+VcDW9qJPhLb1QwhrpKjtafZF3n3tIqvzWereOYj89B2HwdnB\/qxRvKheMva5qr\nynnLeyd5Epe7dupVf9FaRJirtScKzhRhLr6mEQx1rzOm+mpWGr944iX15eoKqqxkJSvZ\/8z+ArZ3\n+Ws0pdkYAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-07\/test_game_starter-1311143563.swf",
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
	"no_trade"
];
itemDef.keys_in_location = {
	"e"	: "admire"
};
itemDef.keys_in_pack = {};

log.info("test_game_starter.js LOADED");

// generated ok 2011-08-29 22:13:48 by mygrant
