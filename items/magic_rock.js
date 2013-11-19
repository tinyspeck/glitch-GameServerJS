//#include include/npc_conversation.js, include/npc_quests.js

var label = "Magic Rock";
var version = "1352158007";
var name_single = "Magic Rock";
var name_plural = "";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["magic_rock"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.talk_state = "talk";	// defined by magic_rock
}

var instancePropsDef = {
	talk_state : [""],
};

var instancePropsChoices = {
	talk_state : [""],
};

var verbs = {};

verbs.whatcha_reading = { // defined by magic_rock
	"name"				: "Whatcha Reading?",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "What are you reading, anyways?",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: null};
		if (this.state == 'read' || this.state == 'readBreak' || this.state == 'readTalk' || this.state == 'readResume' || this.state == 'readTalk' || this.state == 'readStart'){
			if (pc.is_god) return {state:'enabled'};
		}
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.setInstanceProp('talk_state', 'readTalk');
		this.setAndBroadcastState('readBreak');

		var story = choose_one(intro_strings)+' '+choose_one(story_strings);
		this.apiSetTimerX('conversation_start', 1*1000, pc, story);
	}
};

verbs.howto_keys = { // defined by magic_rock
	"name"				: "How To: House Keys",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Learn about your keyring",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: null};
		if (pc.magic_rock && pc.magic_rock['keys']) return {state:null};
		if (this.checkLevelCapForHowto(pc)) {state: null};
		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.announce_vog_fade('If you have some friends you trust to enter your house at any time, you can give them a key to your house.//If you give them a key, they will have access to most of your stuff, so only give keys to people you trust.//Other players can give keys to you as well. To see all of the keys you\'ve given our or which have been given to you, chose \'House Keys\' on your Magic Rock.//You can also see your House Keys via your \'Player Menu\' which is what you get when you click on your face in the upper left corner.', {width: '600'});

		if (!pc.magic_rock) pc.magic_rock = {};
		pc.magic_rock['keys'] = 'howto_shown';

		return true;
	}
};

verbs.howto_customize = { // defined by magic_rock
	"name"				: "How To: Customize",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Learn how to customize your house",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: null};

		var location = this.getLocation();
		if (location.homes_get_type() != 'exterior') return {state: null};

		if (pc.magic_rock && pc.magic_rock['customize']) return {state:null};
		if (this.checkLevelCapForHowto(pc)) {state: null};

		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.announce_vog_fade('You can alter the look of your house — or switch to a house with a totally different look — by selecting \'Customize\' on your Magic Rock.//You can also just click on your house to get the Customize option.//Note: some of the options cost credits which you buy with real money. We\'ve given you some credits to get started.', {width: '600'});

		if (!pc.magic_rock) pc.magic_rock = {};
		pc.magic_rock['customize'] = 'howto_shown';

		return true;
	}
};

verbs.howto_changestyle = { // defined by magic_rock
	"name"				: "How To: Change Styles",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Learn how to change your street style",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: null};
		if (pc.magic_rock && pc.magic_rock['changestyle']) return {state:null};
		if (this.checkLevelCapForHowto(pc)) {state: null};
		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.announce_vog_fade('You can change the style of your Home Street or Yard whenever you want.//Changing the style takes a small amount of imagination each time you do it.//To change the style, just click on your Magic Rock and choose \'Change Style\’.', {width: '600'});

		if (!pc.magic_rock) pc.magic_rock = {};
		pc.magic_rock['changestyle'] = 'howto_shown';

		return true;
	}
};

verbs.howto_expand = { // defined by magic_rock
	"name"				: "How To: Expand",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Learn how to expand your street and yard",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: null};
		if (pc.magic_rock && pc.magic_rock['expand']) return {state:null};
		if (this.checkLevelCapForHowto(pc)) {state: null};
		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.announce_vog_fade('You can expand your Home Street and your Yard to make them wider and wider and wider//Expansion costs imagination and each expansion costs a bit more than the last one.//To expand your Home Street or your Yard, click on your Magic Rock and choose \'Expand\'.', {width: '600'});

		if (!pc.magic_rock) pc.magic_rock = {};
		pc.magic_rock['expand'] = 'howto_shown';

		return true;
	}
};

verbs.howto_cultivate = { // defined by magic_rock
	"name"				: "How To: Cultivate",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Learn how to cultivate land",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: null};
		if (pc.magic_rock && pc.magic_rock['cultivate']) return {state:null};
		if (this.checkLevelCapForHowto(pc)) {state: null};
		return {state: 'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.announce_vog_fade('Cultivation allows you to spend imagination to create resources on your property.//You can cultivate gardens, mineable rocks, patches (for trees) and many other things.//Anything you cultivate on your home street will be usable by visitors; anything in your yard is private.//(The first thing you cultivate must be cultivated in your yard.)//Choose the \'Cultivate\' verb on your Magic Rock to get started.', {width: '600'});

		if (!pc.magic_rock) pc.magic_rock = {};
		pc.magic_rock['cultivate'] = 'howto_shown';

		return true;
	}
};

verbs.house_keys = { // defined by magic_rock
	"name"				: "house keys",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Manage your keyring",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: null};
		if (pc.magic_rock && pc.magic_rock['keys']) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.apiSendMsg({type: 'acl_key_start'});

		return true;
	}
};

verbs.customize = { // defined by magic_rock
	"name"				: "customize",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Customize your house",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: null};

		var location = this.getLocation();
		if (location.homes_get_type() != 'exterior') return {state: null};

		if (pc.magic_rock && pc.magic_rock['customize']) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.apiSendMsg({type: 'houses_change_chassis_start'});

		return true;
	}
};

verbs.change_style = { // defined by magic_rock
	"name"				: "change style",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Change your street style",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: null};
		if (pc.magic_rock && pc.magic_rock['changestyle']) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.apiSendMsg({type: 'houses_change_style_start'});

		return true;
	}
};

verbs.expand = { // defined by magic_rock
	"name"				: "expand",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "",
	"get_tooltip"			: function(pc, verb, effects){

		if (this.container.homes_get_type() == 'exterior'){
			return 'Expand your street';
		}

		return 'Expand your yard';
	},
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: null};
		if (pc.magic_rock && pc.magic_rock['expand']) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		pc.apiSendMsg({type: 'houses_expand_start'});

		return true;
	}
};

verbs.cultivate_land = { // defined by magic_rock
	"name"				: "cultivate land",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 60,
	"tooltip"			: "Cultivate your land",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: null};
		if (pc.magic_rock && pc.magic_rock['cultivate']) return {state:'enabled'};
		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var location = this.getLocation();
		if (pc.magic_rock['cultivate'] == 'howto_shown' && location.homes_get_type() == 'exterior'){
			this.conversation_start(pc, 'Sorry kid — your first cultivation has to happen in your yard. <split butt_txt=\"Ok?\" />Go inside your house and I’ll meet you in the yard for some cultivation action.', {txt:'Will Do'});
			return;
		}

		pc.apiSendMsg({type: 'cultivation_mode_start'});
		return true;
	}
};

verbs.talk_to = { // defined by magic_rock
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 61,
	"tooltip"			: "Talk to the Magic Rock!",
	"get_tooltip"			: function(pc, verb, effects){

		// Had to remove 'Find out what you can do to your yard!' as the static tooltip
		// since one-click-verbs only work with static tips and we needed a more generic
		// option for non-homestreet rocks.

		return verb.tooltip;
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: 'enabled'};
		if (pc.houses_get_img_rewards()) return {state: 'enabled'};

		return {state: null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (pc['!in_house_deco_mode']) pc.apiSendMsg({type:'decoration_mode_end'});
		if (this.container.is_newxp && this.container.class_tsid != 'newbie_island' && this.container.class_tsid != 'home') return true;

		this.checkFacing();

		if (!this.is_visible){
			this.is_visible = true;
			this.setAndBroadcastState('appear1');
			this.apiSetTimer('onIdle', 1500);
		}
		else{
			if (this.state == 'read' || this.state == 'readBreak' || this.state == 'readTalk' || this.state == 'readResume'){
				this.setAndBroadcastState('readTalk');
			}
			else{
				this.setAndBroadcastState('react');
			}
		}

		this.last_seen = time();

		if (this.container.is_newxp && this.container.class_tsid == 'home'){
			if (this.container.current_step == 'choose_skill'){
				var choices = [{txt:'OK', value:'learn-skill2'}];
				return this.conversation_reply(pc, msg, "All set? Good. I can give you one skill instantly; the rest you’ll have to learn over time. Take your pick …", choices);
			}
			return this.onPlayerCollision(pc);
		}
		else if (this.container.class_tsid == 'newbie_island'){
			return this.onPlayerCollision(pc);
		}

		var quests = this.getAvailableQuests(pc);
		if (pc.is_god && (num_keys(quests.offered) || num_keys(quests.completed))){
			this.offerQuests(pc);
			return true;
		}

		var img_rewards  = pc.houses_get_img_rewards();
		if (img_rewards){
			pc.stats_add_xp(img_rewards, true, {type: 'home_cultivation_rewards'});
					
			if (img_rewards > 503) { 
				pc.achievements_increment("daily_img", "five_hundred_three", 1);
			}
			
			if (img_rewards > 1009) { 
				pc.achievements_increment("daily_img", "one_thousand_nine", 1);
			}
			
			if (img_rewards > 2503) { 
				pc.achievements_increment("daily_img", "twenty_five_hundred_three", 1);
			}
			
			pc.houses_reset_img_rewards();

			this.conversation_start(pc, "My observations today have resulted in <b>"+img_rewards+" iMG</b>. Remember: the more stuff visitors do on your home street, the more you’ll earn.", null, null, {imagination: img_rewards}, null, {dont_take_camera_focus: true, ignore_state: true});
		}
		else{
			var costs = {};
			if (this.container && this.container.homes_get_expand_costs){
				costs = this.container.homes_get_expand_costs();
			}

			pc.apiSendMsg({
				type:'houses_upgrade_start',
				sign_tsid: this.tsid,
				costs: costs,
			});
		}

		return true;
	}
};

function callToNewxpPlayer(pc){ // defined by magic_rock
	if (!pc.location.is_newxp) return;

	if (pc.location.current_step == 'given_furniture' || pc.location.current_step == 'furniture_placed' || pc.location.current_step == 'enabled_swatches') return;

	if (this.container && this.container.current_step == 'choose_skill'){
		var choices = {
			1: {txt: 'I’m ready now', value: 'learn-skill'},
			2: {txt: 'Give me a minute', value: 'give-me-a-minute'}
		};
		
		this.conversation_start(pc, "There’s so much more you can do with your house and your land — but to do much more you’re going to need some skills, and you’re going to need to get out into the world to put those skills to work.<split butt_txt=\"OK\">Do you want to choose a skill now? Or do you want a few more minutes to look around?", choices, null, null, null, {ignore_state: true});
	}
	else if (this.container.class_tsid == 'newxp_house_exterior'){
		if (!this.oofed){
			this.sendBubble('Ooof.', 1500, pc);
			this.apiSetTimerX('callToNewxpPlayer', 2500, pc);
			this.oofed = true;
		}
		else{
			var choices = [{txt:'OK', value:'ok'}];
			this.conversation_start(pc, "Well, this is your home street. It’s not much yet, but I’m sure you’ll build it up nicely.<split butt_txt=\"I bet\">Have a look around and then you can pick a house.", choices, null, null, null, {dont_take_camera_focus: true});
		}
	}
	else if (this.container.class_tsid == 'home' && this.container.is_public){
		var choices = [{txt:'OK', value:'ok-inside'}];
		this.conversation_start(pc, "Huh! It worked! I guess I’ve still got it!<split butt_txt=\"Seems so\">Well then, don’t just stand there. Go inside!", choices);
	}
	else if (this.container.class_tsid == 'home' & !this.container.is_public){
		this.apiSetHitBox(250, 400);
		pc.centerCamera({x:this.x, y:this.y}, 0);
		var choices = [{txt:'I see', value:'ok-recenter'}];
		this.apiSetTimerX('conversation_start', 1.5*1000, pc, "Your new house. It's empty …", choices);
	}
	else{
		this.sendBubble("Hey "+utils.escape(pc.label)+"! Come over here to talk to me.", 10000, pc);
	}
}

function checkFacing(pc){ // defined by magic_rock
	if (!pc || pc.location.tsid != this.container.tsid) return;

	var facing;
	if (pc.x < this.x){
		facing = 'left';
	}
	else{
		facing = 'right';
	}

	if (facing != this.facing){
		this.facing = facing;
		this.dir = facing;
		//this.broadcastConfig();
	}
}

function checkLevelCapForHowto(pc){ // defined by magic_rock
	if (pc.stats_get_level() >= 6) {
		if (!pc.magic_rock) pc.magic_rock = {};
		pc.magic_rock['cultivate'] 		= 'cultivate_complete';
		pc.magic_rock['changestyle'] 	= 'howto_shown';
		pc.magic_rock['customize'] 	= 'howto_shown';
		pc.magic_rock['expand'] 		= 'howto_shown';
		pc.magic_rock['keys'] 		= 'howto_shown';
		return true;
	}

	return false;
}

function checkSideStreetsConvo(pc, force_bye){ // defined by magic_rock
	force_bye = true; // Temporary

	if (pc.counters_get_label_count('locations_visited','LIFUS3T1NE332QL') || pc.counters_get_label_count('locations_visited','LIFOPS5QTG33GGK') || force_bye){
		var choices = [{txt:'Bye', value:'remind-img'}];
		this.conversation_start(pc, "This chapter is just fascinating … bye!", choices, null, null, null, {dont_take_camera_focus: true, ignore_state: true});
	}
	else{
		var choices = [{txt:'Will do', value:'force-bye'}];
		this.conversation_start(pc, "Oh, when you get back to Gentle Island, be sure to use the map to explore all the streets … there’s some good stuff there. Bye!", choices);
	}
}

function closeChassisPicker(pc){ // defined by magic_rock
	pc.overlay_dismiss('newxpchoosehouse_text');
	pc.overlay_dismiss('newxpchoosehouse_firebog_overlay_'+this.tsid);
	pc.overlay_dismiss('newxpchoosehouse_tinyhominid_overlay_'+this.tsid);
	pc.overlay_dismiss('newxpchoosehouse_cottage_overlay_'+this.tsid);
	pc.overlay_dismiss('newxpchoosehouse_canvas');
}

function closeSkillChooser(pc){ // defined by magic_rock
	pc.overlay_dismiss('newxpchooseskill_text');
	pc.overlay_dismiss('newxpchooseskill_animalkinship_overlay_'+this.tsid);
	pc.overlay_dismiss('newxpchooseskill_ezcooking_overlay_'+this.tsid);
	pc.overlay_dismiss('newxpchooseskill_lightgreenthumb_overlay_'+this.tsid);
	pc.overlay_dismiss('newxpchooseskill_canvas');
}

function doCultivationModeEnded(pc){ // defined by magic_rock
	if (pc.magic_rock){
		if (pc.magic_rock['cultivate'] == 'howto_shown'){
			this.conversation_start(pc, "Good work, kid. You are on your way to being a master of cultivation. <split butt_txt=\"Yay!\">Here’s a tip for: you can skip right into cultivation mode without talking to me if you press the shift key and the ‘C’ key together: shift+C!", [{txt:'Thanks'}], null, null, null, {ignore_state: true});
		}

		pc.magic_rock['cultivate'] = 'cultivate_complete';
	}
}

function gentleReminder(pc, first_time){ // defined by magic_rock
	this.sendBubble("Go inside! Click on the door to enter your house.", 5000, pc, null, true, !first_time);
	this.apiSetTimerX('gentleReminder', 8000, pc);
}

function make_config(){ // defined by magic_rock
	return {
		//rock: (this.facing == 'left' ? 'rockLeft' : 'rockRight'),
		book: 'orangeBook'
	};
}

function onConversation(pc, msg){ // defined by magic_rock
	if (msg.choice == 'chassis-picker'){
		this.conversation_end(pc, msg);

		// Create the home street and set the style
		pc.houses_go_to_new_house(false, true);
		var ext_style;
		var int_style;
		if (this.container.instance_id == 'firebog_4_high_newxp'){
			ext_style = 'firebog_4_high';
			int_style = 'firebog_int_4__high';
		}
		else if (this.container.instance_id == 'meadow_ext_default_high_newxp'){
			ext_style = 'meadow_ext_default_high';
			int_style = 'meadows_int_default__high';
		}
		else if (this.container.instance_id == 'uralia_2_high_newxp'){
			ext_style = 'uralia_2_high';
			int_style = 'uralia_int_2_hor_high';
		}
		
		var exterior = pc.houses_get_external_street();
		if (exterior){
			exterior.homes_set_style(ext_style);
			exterior.homes_set_newxp();
		}

		var interior = pc.houses_get_interior_street();
		if (interior){
			interior.homes_set_style(int_style);
			interior.homes_set_newxp();
		}

		// Launch chassis picker
		this.showChassisPicker(pc);
		return;
	}
	else if (msg.choice == 'give-furniture'){
		pc.changeUIComponent('furniture_bag', true);
		pc.changeUIComponent('decorate_button', true);
		pc.apiSendMsg({
			type: "ui_callout",
			section: 'furniture_tab',
			display_time: 0
		});
		pc.furniture_populate_newxp();

		pc.location.current_step = 'given_furniture';

		return this.conversation_end(pc, msg);
	}
	else if (msg.choice == 'learn-skill'){
		var choices = [{txt:'OK', value:'learn-skill2'}];
		this.conversation_reply(pc, msg, "Good. I can give you one skill instantly; the rest you’ll have to learn over time. Take your pick …", choices);
		return;
	}
	else if (msg.choice == 'learn-skill2'){
		this.conversation_end(pc, msg);

		this.showSkillChooser(pc);

		return;
	}
	else if (msg.choice == 'skill-quest'){
		this.conversation_end(pc, msg);
		this.container.current_step = 'skill_complete';

		pc.last_quest_offer = time();
		if (this.skill_id == 'light_green_thumb_1'){
			pc.quests_give_finished('lightgreenthumb_1');
			pc.teleportToLocationDelayed('LHVMSAEVLFB39K2', 123, -958);
		}
		else if (this.skill_id == 'animalkinship_1'){
			pc.quests_give_finished('animalkinship_1');
			pc.teleportToLocationDelayed('LHF8PTQ7RFB3PRB', 123, -958);
		}
		else if (this.skill_id == 'ezcooking_1'){
			pc.quests_give_finished('ezcooking_1');
			pc.teleportToLocationDelayed('LIFII3UBRFB3KBE', 123, -958);
		}
		delete this.skill_id;
		return;
	}
	else if (msg.choice == 'give-me-a-minute'){
		this.conversation_reply(pc, msg, "OK, no problem. Take your time and when you’re ready, come talk to me.");
		this.setAndBroadcastState('readStart');
		this.apiSetTimer('onIdle', 1000);
		return;
	}
	else if (msg.choice == 'give-quest'){
		this.conversation_end(pc, msg);
		pc.announce_vog_fade("Watch this part: the rock is about to give you a quest.", {done_payload: {location_script_name: 'explainQuest'}});
		return;
	}
	else if (msg.choice == 'explain-currants'){
		this.conversation_end(pc, msg);
		pc.announce_vog_fade("Currants are the currency of Glitch.//They make it easier to trade with vendors and other players.", {done_payload: {location_script_name: 'revealCurrants'}, width: 600});
		return;
	}
	else if (msg.choice == 'explain-questlog'){
		this.conversation_end(pc, msg);
		pc.announce_vog_fade("That was a quest. It shows up in your quest log.", {done_payload: {location_script_name: 'giveQuest'}});
		return;
	}
	else if (msg.choice == 'go-home'){
		this.conversation_end(pc, msg);
		var target_house = pc.houses_get_external_street();
		var ret = pc.houses_teleport_to(target_house, 140);
		return;
	}
	else if (msg.choice == 'ok-inside'){
		this.conversation_end(pc, msg);
		this.container.current_step = 'go-inside';
		this.apiSetTimerX('gentleReminder', 5000, pc, true);
		return;
	}
	else if (msg.choice == 'give-skill-learning'){
		this.conversation_end(pc, msg);
		pc.imagination_grant('skill_learning');

		var upgrade = config.data_imagination_upgrades['skill_learning'];
		pc.apiSendMsg({
			type: 'imagination_purchase_screen',
			card: {
				id: 0,
				class_tsid: 'skill_learning',
				name: upgrade.name,
				desc: upgrade.desc,
				cost: upgrade.cost,
				config: upgrade.config
			}
		});
		return;
	}
	else if (msg.choice == 'open-skills'){
		this.conversation_end(pc, msg);
		pc.vog_skill_learning = true;
		pc.apiSendMsg({type: 'skills_can_learn'});
		pc.apiSendMsg({type: 'open_img_menu', section: 'skills', close_payload: {location_script_name: 'closedImaginationMenu2'}});
		return;
	}
	else if (msg.choice == 'check-sidestreets'){
		this.conversation_end(pc, msg);
		this.setAndBroadcastState('readStart');
		this.apiSetTimer('onIdle', 1000);
		this.apiSetTimer('checkSideStreetsConvo', 2000, pc);
		return;
	}
	else if (msg.choice == 'force-bye'){
		this.conversation_end(pc, msg);
		this.checkSideStreetsConvo(pc, true);
		return;
	}
	else if (msg.choice == 'remind-img'){
		this.conversation_end(pc, msg);
		
		this.setAndBroadcastState('readStart');
		this.apiSetTimer('onIdle', 1000);

		pc.apiSetTimerX('announce_vog_fade', 4000, "When you’re ready, use the iMG Menu to go back to Gentle Island and head to the real world.", {css_class: 'nuxp_vog_brain', done_payload: {location_script_name: 'giveQuests'}});
		return;
	}
	else if (msg.choice == 'ok' || msg.choice == 'ok-recenter'){
		if (msg.choice == 'ok-recenter') pc.apiSetTimerX('centerCamera', 1*1000, {x:pc.x, y:pc.y}, 1);
		return this.conversation_end(pc, msg);
	}

	if (this.getAvailableQuests) {
		// do quests
		return this.questConversation(pc, msg);
	}

	this.conversation_reply(pc, msg, "Uh, what? Sorry!");
}

function onConversationEnding(pc){ // defined by magic_rock
	if (this.local_chat_queue){
		pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: this.local_chat_queue});
		delete this.local_chat_queue;
	}

	var location = this.getLocation()
	if (location.eventFired){
		return location.eventFired('talk_end', this, {pc:pc});
	}
}

function onCreate(){ // defined by magic_rock
	this.initInstanceProps();
	this.apiSetHitBox(400, 400);
	this.setAndBroadcastState('blank');

	this.setAvailableQuests([
		'build_a_tower'
	]);
}

function onIdle(){ // defined by magic_rock
	if (!this.is_visible) return;

	if (this.state == 'readStart'){
		this.setAndBroadcastState('read');
		this.apiSetTimer('onIdle', 10000);
	}
	else if (this.state == 'read'){
		this.setAndBroadcastState('readBreak');
		this.apiSetTimer('onIdle', 5000);
	}
	else if (this.state == 'readBreak' || this.state == 'readTalk'){
		this.setAndBroadcastState('readResume');
		this.apiSetTimer('onIdle', 1000);
	}
	else if (this.state == 'readResume'){
		this.setAndBroadcastState('read');
		this.apiSetTimer('onIdle', 10000);
	}
	else{
		if (this.last_seen <= time() - 5*60){
			this.setAndBroadcastState('readStart');
		}
		else{
			this.setAndBroadcastState(choose_one(['idle0', 'idle1', 'idle2']));
		}
		this.apiSetTimer('onIdle', 8000);
	}
}

function onLoad(){ // defined by magic_rock
	this.setAvailableQuests([
		'build_a_tower'
	]);
}

function onOverlayClicked(pc, payload){ // defined by magic_rock
	if (payload.choice.substr(0, 6) == 'skill_'){
		this.closeSkillChooser(pc);

		// Don't let them do this more than once
		var skill_id = '';
		if (pc.skills_has('animalkinship_1')){
			skill_id ='animalkinship_1';
		}
		else if (pc.skills_has('ezcooking_1')){
			skill_id ='ezcooking_1';
		}
		else if (pc.skills_has('light_green_thumb_1')){
			skill_id ='light_green_thumb_1';
		}
		else{
			log.info(this+' '+pc+' chose: '+payload.choice);
			if (payload.choice == 'skill_animal_kinship'){
				skill_id ='animalkinship_1';
			}
			else if (payload.choice == 'skill_ezcooking'){
				skill_id ='ezcooking_1';
			}
			else if (payload.choice == 'skill_lightgreenthumb'){
				skill_id = 'light_green_thumb_1';
			}
		}

		log.info(this+' '+pc+' skill_id: '+skill_id);
		if (skill_id){
			this.skill_id = skill_id;
			pc.skills_give(skill_id);
			var skill = pc.skills_get(skill_id);

			var choices = {
				1: {txt: 'OK', value: 'skill-quest'}
			};
			this.conversation_start(pc, skill.name+" is a good choice. I’ll send you to a special place to practice and then you’ll be off to The Island …", choices);
		}
	}
	else{
		this.closeChassisPicker(pc);

		var upgrade_id = 0;
		log.info(this+' '+pc+' chose: '+payload.choice);
		if (payload.choice == 'firebog'){
			upgrade_id = 220;
		}
		else if (payload.choice == 'tinyhominid'){
			upgrade_id = 219;
		}
		else if (payload.choice == 'cottage'){
			// do nothing, leave at default
		}

		log.info(this+' '+pc+' upgrade_id: '+upgrade_id);

		var external = pc.houses_get_external_street();
		if (!external){
			pc.houses_go_to_new_house(false, true);

			var ext_style;
			var int_style;
			if (this.container.instance_id == 'firebog_4_high_newxp'){
				ext_style = 'firebog_4_high';
				int_style = 'firebog_int_4__high';
			}
			else if (this.container.instance_id == 'meadow_ext_default_high_newxp'){
				ext_style = 'meadow_ext_default_high';
				int_style = 'meadows_int_default__high';
			}
			else if (this.container.instance_id == 'uralia_2_high_newxp'){
				ext_style = 'uralia_2_high';
				int_style = 'uralia_int_2_hor_high';
			}
			
			exterior = pc.houses_get_external_street();
			if (exterior){
				exterior.homes_set_style(ext_style);
				exterior.homes_set_newxp();
			}

			var interior = pc.houses_get_interior_street();
			if (interior){
				interior.homes_set_style(int_style);
				interior.homes_set_newxp();
			}
		}

		var chassis = external.find_items('furniture_chassis');
		log.info(this+' '+pc+' chassis: '+chassis);
		if (chassis && chassis[0]){
			chassis[0].applyUpgrade(pc, upgrade_id);
		}

		var choices = {
			1: {txt: 'OK', value: 'go-home'}
		};
		this.apiSetTimerX('conversation_start', 1000, pc, "Very good — just give me a second and we’ll have that imagined.", choices);
	}
}

function onPlayerCollision(pc){ // defined by magic_rock
	if (!this.container || (!this.container.pols_is_owner(pc) && !this.container.is_newxp)) return;

	if (this.container.is_newxp){
		if (this.container.class_tsid == 'newxp_house_exterior'){
			if (!this.is_visible){
				this.checkFacing(pc);
				this.is_visible = true;

				this.setAndBroadcastState('appear1');
				this.apiSetTimerX('onPlayerCollision', 500, pc);
			}
			else{
				if (this.container.events_has_flag('vog_done')){
					var choices = {
						1: {txt: 'Will do', value: 'chassis-picker'}
					};
					this.conversation_start(pc, "You’re going to need a little private space too, so let’s imagine you a house.<split butt_txt=\"OK\">Choose the style you like the best and I’ll think it right up.", choices, null, null, null, {dont_take_camera_focus: true});
				}
			}
		}
		else if (this.container.class_tsid == 'home' && !this.container.is_public){
			if (!this.container.current_step){
				pc.moveAvatar(this.x+250, this.y, 'left');
				this.apiSetHitBox(500, 400);
				var choices = {
					1: {txt: 'OK', value: 'give-furniture'}
				};
				this.conversation_start(pc, "Let’s fill up some of the emptiness. Here’s some basic furniture to get you started.", choices, null, null, null, {ignore_state: true});
			}
		}
		else if (this.container.class_tsid == 'newbie_island'){
			this.apiCancelTimer('onPlayerCollision');
			if (!this.container.current_step){
				var current_skill = pc.skills_get(pc.skills_get_list()[0].id);
				var choices = {
					1: {txt: 'Yes, I need some bags', value: 'give-quest'}
				};
				this.conversation_start(pc, "Well, "+utils.escape(pc.label)+", what did I say?  "+current_skill.name+" was a solid choice.<split butt_txt=\"Thanks\">All that skillin’ is going to get you lots of stuff. And, hmmmm, your inventory is not SO big.<split butt_txt=\"Hmmm\">Looks like you need some bags. You can hold more stuff if you have some bags.", choices, null, null, null, {ignore_state: true});
			}
		}
		return;
	}

	if (!this.is_visible){
		this.checkFacing(pc);
		this.is_visible = true;
		var previous_location = pc.getProp('last_magic_rock_location');
		if (previous_location != this.container.tsid){
			this.setAndBroadcastState('appear1');
		}
		else{
			this.setAndBroadcastState('read');
		}
		pc.setProp('last_magic_rock_location', this.container.tsid);

		if (pc.houses_get_img_rewards()){
			this.apiSetTimerX('onPlayerCollision', 4000, pc);
		}
		else{
			this.apiSetTimer('onIdle', 4000);
		}
	}
	else{
		this.apiSetTimerX('checkFacing', 1500, pc);

		var quests = this.getAvailableQuests(pc);
		if (pc.is_god && (num_keys(quests.offered) || num_keys(quests.completed))){
			return this.sendBubble("Hey, "+utils.escape(pc.label)+"! I have something for you that I think is worth your time.", 5000, pc);
		}

		var img_rewards  = pc.houses_get_img_rewards();
		if (img_rewards){
			if (this.state == 'read' || this.state == 'readBreak' || this.state == 'readTalk' || this.state == 'readResume'){
				this.setAndBroadcastState('readTalk');
			}
			else{
				this.setAndBroadcastState('talk');
			}
			this.sendBubble("Hey "+utils.escape(pc.label)+", I have some iMG for you. Click on me and I’ll hand it over.", 10*1000, pc);
			this.apiSetTimer('onIdle', 2000);
		}

	}
}

function onPlayerEnter(pc){ // defined by magic_rock
	if (this.container && (this.container.is_newxp || this.container.is_is_postnewxp)){
		if (this.container.class_tsid == 'home' && !this.container.pols_is_owner(pc)) return;
	}
	else if (!this.container || !this.container.pols_is_owner(pc)){
		return;
	}

	this.checkFacing(pc);

	if (!this.is_visible){
		if (this.container.is_newxp && (this.container.class_tsid == 'home' || this.container.class_tsid == 'newxp_house_exterior')){
			this.checkFacing(pc);
			this.is_visible = true;

			this.setAndBroadcastState('appear1');
			var delay = 2000;
			if (this.container.class_tsid == 'newxp_house_exterior') delay = 1000;
			this.apiSetTimerX('callToNewxpPlayer', delay, pc);
			return;
		}
		else if (this.container.class_tsid == 'newbie_island' || this.container.is_postnewxp){
			this.checkFacing(pc);
			this.is_visible = true;
			this.onIdle();
			if (!this.container.is_postnewxp) this.apiSetTimerX('onPlayerCollision', 2000, pc);
			return;
		}

		var previous_location = pc.getProp('last_magic_rock_location');
		if (previous_location == this.container.tsid){
			this.setAndBroadcastState('read');
			this.is_visible = true;
			this.apiSetTimer('onIdle', 4000);
			this.last_seen = time();
		}
	}
	else if (this.container.class_tsid == 'newbie_island'){
		this.checkFacing(pc);
		this.onIdle();
		return;
	}
}

function onPlayerExit(pc){ // defined by magic_rock
	if (this.container && this.container.pols_is_owner(pc)){
		delete this.is_visible;
		this.setAndBroadcastState('blank');

		if (this.container.is_newxp){
			this.apiCancelTimer('gentleReminder');
			if (this.container.current_step == 'go-inside') delete this.container.current_step;
		}
	}
}

function onPlayerLeavingCollisionArea(pc){ // defined by magic_rock
	if (!this.container || (!this.container.pols_is_owner(pc) && !this.container.is_newxp)) return;

	this.apiSetTimerX('checkFacing', 1500, pc);
}

function onPrototypeChanged(){ // defined by magic_rock
	this.setAvailableQuests([
		'build_a_tower'
	]);
}

function showChassisPicker(pc){ // defined by magic_rock
	pc.apiSendAnnouncement({
		type: 'vp_canvas',
		uid: 'newxpchoosehouse_canvas',
		canvas: {
			color: '#000000',
			steps: [
				{alpha:.3, secs:1}
			],
			loop: false
		},
		fade_out_sec:1,
		at_bottom: true
	});

	var annc1 = {
		type:'vp_overlay',
		pc_tsid: pc.tsid,
		swf_url:overlay_key_to_url('newxpchoosehouse_firebog_overlay'),
		uid: 'newxpchoosehouse_firebog_overlay',
		delay_ms: 1000,
		y: 0,
		x: -215,
		position_from_center_of_vp: true,
		scale_to_stage: true,
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_payload: {itemstack_tsids: [this.tsid], choice: 'firebog'},
			dismiss_on_click: true
		},
		fade_out_sec:1,
		done_cancel_uids: ['newxpchoosehouse_tinyhominid_overlay', 'newxpchoosehouse_cottage_overlay', 'newxpchoosehouse_canvas', 'newxpchoosehouse_text']
	};

	var annc2 = {
		type:'vp_overlay',
		pc_tsid: pc.tsid,
		swf_url:overlay_key_to_url('newxpchoosehouse_tinyhominid_overlay'),
		uid: 'newxpchoosehouse_tinyhominid_overlay',
		delay_ms: 1000,
		y: 0,
		x: '0',
		position_from_center_of_vp: true,
		scale_to_stage: true,
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_payload: {itemstack_tsids: [this.tsid], choice: 'tinyhominid'},
			dismiss_on_click: true
		},
		fade_out_sec:1,
		done_cancel_uids: ['newxpchoosehouse_firebog_overlay', 'newxpchoosehouse_cottage_overlay', 'newxpchoosehouse_canvas', 'newxpchoosehouse_text']
	};

	var annc3 = {
		type:'vp_overlay',
		pc_tsid: pc.tsid,
		swf_url:overlay_key_to_url('newxpchoosehouse_cottage_overlay'),
		uid: 'newxpchoosehouse_cottage_overlay',
		delay_ms: 1000,
		y: 0,
		x: 215,
		position_from_center_of_vp: true,
		scale_to_stage: true,
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_payload: {itemstack_tsids: [this.tsid], choice: 'cottage'},
			dismiss_on_click: true
		},
		fade_out_sec:1,
		done_cancel_uids: ['newxpchoosehouse_firebog_overlay', 'newxpchoosehouse_tinyhominid_overlay', 'newxpchoosehouse_canvas', 'newxpchoosehouse_text']
	};

	pc.apiSendAnnouncement(annc1);
	pc.apiSendAnnouncement(annc2);
	pc.apiSendAnnouncement(annc3);

	var args = {
		uid: 'newxpchoosehouse_text',
		type:'vp_overlay',
		pc_tsid: pc.tsid,
		delay_ms: 1000,
		duration: 0,
		width: 500,
		x: 0,
		y: 115,
		position_from_center_of_vp: true,
		text: [
			'<p align="center"><span class="nuxp_vog_smaller">Choose a style for your house</span></p>'
		],
		fade_out_sec:1,
		locking: true
	};

	pc.apiSendAnnouncement(args);
}

function showSkillChooser(pc){ // defined by magic_rock
	pc.apiSendAnnouncement({
		type: 'vp_canvas',
		uid: 'newxpchooseskill_canvas',
		canvas: {
			color: '#000000',
			steps: [
				{alpha:.3, secs:1}
			],
			loop: false
		},
		fade_out_sec:1,
		at_bottom: true
	});

	var annc1 = {
		type:'vp_overlay',
		pc_tsid: pc.tsid,
		swf_url:overlay_key_to_url('newxpchooseskill_animalkinship_overlay'),
		uid: 'newxpchooseskill_animalkinship_overlay',
		delay_ms: 1000,
		y: 0,
		x: -150,
		position_from_center_of_vp: true,
		scale_to_stage: true,
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_payload: {itemstack_tsids: [this.tsid], choice: 'skill_animal_kinship'},
			dismiss_on_click: true
		},
		fade_out_sec:1,
		done_cancel_uids: ['newxpchooseskill_ezcooking_overlay', 'newxpchooseskill_lightgreenthumb_overlay', 'newxpchooseskill_canvas', 'newxpchooseskill_text']
	};

	var annc2 = {
		type:'vp_overlay',
		pc_tsid: pc.tsid,
		swf_url:overlay_key_to_url('newxpchooseskill_ezcooking_overlay'),
		uid: 'newxpchooseskill_ezcooking_overlay',
		delay_ms: 1000,
		y: 0,
		x: '0',
		position_from_center_of_vp: true,
		scale_to_stage: true,
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_payload: {itemstack_tsids: [this.tsid], choice: 'skill_ezcooking'},
			dismiss_on_click: true
		},
		fade_out_sec:1,
		done_cancel_uids: ['newxpchooseskill_animalkinship_overlay', 'newxpchooseskill_lightgreenthumb_overlay', 'newxpchooseskill_canvas', 'newxpchooseskill_text']
	};

	var annc3 = {
		type:'vp_overlay',
		pc_tsid: pc.tsid,
		swf_url:overlay_key_to_url('newxpchooseskill_lightgreenthumb_overlay'),
		uid: 'newxpchooseskill_lightgreenthumb_overlay',
		delay_ms: 1000,
		y: 0,
		x: 150,
		position_from_center_of_vp: true,
		scale_to_stage: true,
		mouse: {
			is_clickable: true,
			allow_multiple_clicks: false,
			click_payload: {itemstack_tsids: [this.tsid], choice: 'skill_lightgreenthumb'},
			dismiss_on_click: true
		},
		fade_out_sec:1,
		done_cancel_uids: ['newxpchooseskill_animalkinship_overlay', 'newxpchooseskill_ezcooking_overlay', 'newxpchooseskill_canvas', 'newxpchooseskill_text']
	};

	pc.apiSendAnnouncement(annc1);
	pc.apiSendAnnouncement(annc2);
	pc.apiSendAnnouncement(annc3);

	pc.changeUIComponent('decorate_button', false);

	var args = {
		uid: 'newxpchooseskill_text',
		type:'vp_overlay',
		pc_tsid: pc.tsid,
		delay_ms: 1000,
		duration: 0,
		width: 500,
		x: 0,
		y: -105,
		position_from_center_of_vp: true,
		text: [
			'<p align="center"><span class="nuxp_vog_smaller">Choose your first skill</span></p>'
		],
		fade_out_sec:1,
		locking: true
	};

	pc.apiSendAnnouncement(args);
}

// global block from magic_rock
var intro_strings = [
	'This is fascinating, just fascinating.',
	'What an interesting article.',
	'Oh hello. You\’ve caught me reading again.',
	'You\’ll never guess what I just read!',
	'So interesting.',
	'An intriguing text.',
	'My word.',
	'Would you believe it?',
	'Well, I\’ll be Rooked!',
	'By the Giants!',
	'I can\'t help it, I just can\'t put this book down.',
];

var story_strings = [
	'It says here that the infinitilistic belief — that worlds of Giant Imagination have formed, unformed and reformed countless times — did not gain currancy until long after Abbasid had already been forgotten.',
	'Did you know that contrary to popular opinion, Ur is not flat?',
	'Some maintain that this is the twelfth age of Ur, and there were eleven ages before, each presided over by a single Giant.',
	'Says here, in the \'Golden Age of Cosma\', there was no such thing as incubation.',
	'In times past, chickens were minor deities, and would never be asked to perform manual labor…',
	'The Mabbites, it says here, used to bury sacred stuff in the ground when they wanted to keep it safe.',
	'According to the book of Zille, the very first rock was Beryl, formed from the tears of Zille herself.',
	'Sounds like no one knows why Zille wept, but that all mountains were born of her sorrow. So sad!',
	'This large pamphlet - written by some crazy pirate philosopher scientist king - says that there are no such things as giants! I say!!',
	'This here sacred text of … well, one of the giants let’s just say… suggests that there aren’t really 11 giants, only one.',
	'I’d previously read that there were 11 ages or Ur before this age, but this chapter suggests that maybe Ur has existed for ever.',
	'Says here that when Cosma first created butterflies, they were a mile tall and a couple of miles wide. Freaky!',
	'Bureaucrocs and Rangers dancing together. What a wonderful sight it was! Sad, how a bowl of spilled punch ruined everything, isn’t it?',
	'In the not too distant past, all the sloths disappeared for 3 days. When they returned, they spoke in hushed terms of witnessing an epic concert. When asked who played, they bow their heads in reverent silence.',
	'One time after an all night reading bender, I woke up with a tattoo that read \'01000100 0111001001 1010010110111001 1010110010000 0011011010110 11110111001001100 10100100000 01001111011 10110011000010 11011000111 0100011 01001011 011100 110010 1000011010 0001010\'. Glad I got that removed! ',
	'What a hard to read book. Some days it has 143 chapters, other days, 257.',
	'Toymakers? More like toy breakers! They couldn\'t sew a straight line for all the chickens in Ur.',
	'An epic battle between the Tii\'ites and the Spriggots. Chickens hurled like feathery snowballs. Such a mess.',
	'The rumour that Zille has a heart of stone is untrue, apparently. It is made of giant flesh. And space-matter. Also: gravel.',
	'You think the caverns are the deepest places there are? Oh, glitchen child: how little you know.',
	'During one age, the domestic animals of choice were sheepies, ducks and \'sorbetflies\'! Who knew?',
	'There\'s a theory that if everyone stops thinking about the Giants, they cease to exist. And if they cease to exist? Beware.',
	'Batterflies have 13 stomachs, one for each food group.',
	'It is a well-documented fact that piggies once flew, though it is unclear whether they used wings or rotor blades.',
	'It has been at least 10,000 eras - before the last great age of Humbaba, in fact - since piggies flew.',
	'Lem was the very first of the Giants to close his eyes and start imagining Ur, it says here…',
	'There\'s a myth that claims that the world of the giants, the world outside this one, is contained in a marble hidden somewhere in Ur. Crazy, huh?',
	'What lies between the streets of Ur? Pudding! It says so right here! Look at these diagrams! Chocolate, vanilla, strawberry, then some lemon. Mmmm. Now I\'m hungry.',
	'How can I hold this book? I don\'t have hands! Wait… I\'ve never had hands, yet I can put these glasses on and off without a problem. Listen to me kids. Reading opens your mind up to questions that you really shouldn\'t ask. Don\'t do it!',
	'Layers and layers of imagination, slowly pressed together by the weight of further imaginings, took solid form. From that form came the first physical manifestations of Ur.',
	'No living soul in Ur can dance like Friendly. But frankly, all flailing arms, rolling eyes and wayward tentacles? Who would want to?',
	'One winter it was so cold the bubbles on the bubble trees all froze solid and rolled down the mountains, clanging like a million bells.',
	'Humbaba CAN walk on two legs, but prefers to walk on four, in solidarity with her imagination-creations. Imagincrations? Whatever.',
	'It says here, during the 37th age of Alph, 71% of all offspring were born as small clockwork versions of themselves. Some still remain in the world today.',
	'Beware the ides of Tii. I don\'t know when those are, kid, but that\'s what it says here. Beware. Be very ware.',
	'The greatest parties Ur has ever seen were the Belabour Parties of the Age of Friendly. Good times. Good times.',
	'Says here there WERE no different ages of the giants - but that 11 giantcentric worlds exist in 11 layers, all below this one. Dig deep enough, it says, you\'ll find them…',
	'I was just reading this history of mountaineering in Ur. Scaling the snow-tipped peaks of the northern lands: dangerous? Maybe: but worth it, they say.',
	'The Ancient Grendalinians were famed for their button collecting. Well, that and their racy interpretive dance versions of historic events.',
	'One group of ancestors believed that bubble tree bubbles capture free-floating thoughts, and can hold them for thousands of years.',
	'The chickens of Ur have their own belief system, based around an ancient, all-powerful giant chicken.',
	'This chapter\'s all about visitors that came, it says, from space. Bearing fireflies. Space, kid! SPACE! Crazy!',
	'The Ti\'ites went on a Egg Plant poisoning rampage once, you know. They found the ovoid nature of eggs too haphazard, they said. They liked things neat.',
	'This seems to be a catalogue of jewellery made from carved Sparkly Rock. Purty! Smallprint says you can only wear it a few minutes before you\'ll sink into the ground, though.',
	'Four…five… six?..... Hey! The Hymn To Grendaline (the Grendalinians daily anthem) has 1307 verses! Yowzers!',
	'The refreshing good feeling that washes over Ur at the break of a new day is caused by all the giants blinking in turn, it says here.',
	'Only a few times have the creatures of Ur had cross-species babies, this claims. The results have been cute but impractical. It\'s hard to nibble a piggerfly.',
	'Huh! This chapter claims that the refreshing whoosh at the break of new day is caused by the whole world flipping over like one of Gamma\'s own pancakes.',
	'Hey this says that… fneh! fneh! FNEH! Sorry, I got the worst itch in my nose today. I can\'t scratch it, cause y\'know… no hands. Wait! No nose!',
	'This mysterious shady tome says there was once an Age of The Rook. A dark, brooding age where the clock stopped at five minutes to midnight for a thousand years.',
	'Says here, the batterfly is more closely related to the rook than to the butterfly. That\'s why the batterfly feels so sad.',
	'Spriggan and Cosma once experimented with imagining a new breed of tree together. The flying tree didn’t really take off. Well it did… that was the problem. ',
	'Cosma was the giant who imagined the concepts of \'up\' and \'down\'. You don\'t want Cosma to get distracted. You won\'t know which way is up.',
	'Fact for you: Spriggan was the tallest of all the giants. And if you know giants, you\'ll know that\'s saying something.',
	'Grendaline, her loyal followers proudly state, is the baby of the giants... maybe not even 400 million years old.',
	'This theory claims we\'ve had eleven ages of the giants. If this, the 12th age does not work out, Ur will be given over to the power of the rook…',
	'Traditionally, it seems, each Alphcon was marked by the unveiling of a new alchemical compound - or tweaking of an old one.',
	'Ahem: Lemadan, Lem\'s Festival of Wandering Aimlessly, when anyone found loafing at home would be called \'Boring McStickyfeet\' and made to wear concrete pants for the day.',
	'Wowzers. Apparently Tii slipped into a black hole as a child and spent years spinning through space. No wonder he … er, she … or, hmm … it hates chaos …',
	' Nibbling chickens and squeezing piggies was the norm until relatively recently, but everyone got tired of having mouths full of feathers and hands full of piggy plop.',
	'Deimaginators have no noses. For the record, they smell terrible.',
	'Bureaucrocs never take time off. They’re supposed to take all Giantish Holidays, but they rather stay in their Hall, toiling for The Man.',
	'This here map shows the area where the firebogs are now as ocean. All ocean. Huh! Well, that explains the barnacles, I guess…',
	' It says here that far from being flat, Ur is a trunka… a truncatactatoratorated… a “truncated icosidodecahedron”. Peh! That’s not even a THING, right?',
	'Well I’ll be. Apparently, in the universe the giants belong to, they are the lowest of the low in a miserable grey world. That’s why the world is what it is…',
	'Sometimes, if you look closely, you can see the seams between the different imagination spheres of the 11 giants.',
	'This book talks about ‘Dragons’ as a mode of transport, but it’s not clear whether there be ACTUAL dragons, or just a subway train with pretensions.',
	'Zille grew up in the circus, says here. “Death-defying stunts and rock-juggling”, apparently… which sound like the same thing to me.',
	'If you look very very closely at the star-holes, you can apparently see the giants through the other side.',
	'You read this? Memoirs of a Talking Hairball? Don’t, it’s terrible.',
	'This isn’t as good as the last book I read: “Who Moved My Very, Very Stinky Cheese? (And By The Way Thanks For Doing That)”. That was a classic.',
	'Strange, this is a map of mountain-climbing trails.',
	'Darn it! This book claims that one of the giants is in charge of all the rest - but the last page is missing, and I don’t know which one! GAH!',
	'The giants coexist peacefully now. By my rocknostrils, they didn’t used to. The battles! You should read thi… actually you shouldn’t, you little dinky innocent.',
	'Oh my Giant, there was this incredible paragraph I wanted to read you. On page… wait… 361? No. 613? 3? No. Where WAS it? Oh never mind. It was really important, though.',
	'In this, Barnacles speak of ancient ships, sunk in the seas that covered the lands that are now bogs. Treasure ships…',
	'Piggies and Chickens have never got on, since way back in the 187th age of Pot. You’ll notice you never catch them talking…',
	'…Bubbles of imagination, emanating from each giant, grew till they overlapped and meshed, and imaginings inside turned into new, more complex things…',
	'The rocks might claim seniority, but peat bogs are the the oldest (though maybe not the wisest) things that exist in all of Ur.',
	'In the age of Humbaba, there were more than 318 species of animals walking Ur.',
	'In the time of the great rifts and ground-shaking battles, Pot and Mab were the giants who most often conspired together against the others.',
	'Chickens are terrified of noodles. No one knows why.',
	'This particular theory posits that the giants didn’t imagine up the animals, or the world. In fact, there ARE no giants: the animals created all of this.',
	'It says here that there are wormholes that will take you back in time. Is that true? Have they been found yet?',
	'This tale tells of a special type of door that leads into parallel Urs, ruled over by different giants. I’ve never seen one though. I’m not sure I believe it.',
	'This is an expose of the dark bureaucrocs - you know, the ones that hang out in dark passages? Apparently, like all other bureaucrocs, they’re on a rota.',
	'There’s one night of the year when bureaucrocs cut loose. The party, if you can find it, is, by far, the wildest you’ve ever seen.',
	'This fable says that the sloth and the fox once had a race. And who won? Well, the fox won. Because foxes are faster.',
	'There’s a chapter here describing the exodus of the angry bees, who swore that they would return one day and avenge their honey-drained ancestors. Weird.',
	'According to this blueprint there’s a giant honey repository in a overhead cavern somewhere. Millions of sticky gallons. Be careful with overhead trapdoors.',
	'When the giants first started imagining, once upon a time, all that existed was a tiny island, covered in forest.',
	'Legend tells of ancestors and ancients who have wandered through the world, generations upon generations, leaving things behind them.',
	'It was Pot that banished the Egg Plants to the caves. No one knows why, but BOY was he cranky about them.',
	'Man, I’m getting eye strain. It’s worth it though, y’know? I just found out this awesome thing about… um…Oh shoot I forgot.',
	'Fruit trees used to grow all fruits at once, but the greedy high priests in the Age of Pot ruined all that.',
	'According to the annals of the Cosmapolitans, the world IS round, but inside out, so Ur is on the inside of the planet. But then: what’s on the outside?',
	'Grilled batterfly tastes like rubber tyres soaked in pickled whortleberry juice. Apparently.',
	'Dullite used to be the most expensive resource in Ur, this says. Because… oh no wait. I haven’t reached that bit yet. Still. Invest in dullite, I guess?',
]

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
		'position': {"x":-22,"y":-47,"w":43,"h":52},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAH30lEQVR42t2Ya1CU9R7HtXNqOjOe\nLOc0Y6fmVFOmYyamVp7kmhklGh2voMByFW9c5LYsu7AsVxdYlsvCsoAoVxFFOCp4QxCl8nY001OY\nx8Obes27M+fdr9\/33\/95ZnfNxnioZtqZ7+yzz+3\/eX73Z2fMmKZPV09PwJnzI+bzo5fMn165Zr5+\n63bKjN\/qc274Yuid8Xv2O+PfjFy9cWti7PJVGhq9RKeGhun8hYuqLn52mf715e2+2+PfpNy\/f3\/2\nrwJX7XDoGlsO0PmLY3T5+g1ia3lAQeeGL6jbwww+9vkVunbji8lb\/\/7a\/IuCGo1FL5ZV2CZd+1uo\no+cIHR88RYNnh4S8IXv6+sU53cf6xHnK\/k+vXp+8c\/c\/ul8E0GTO78svKCR7dQ01HTgoAB5VAD3S\nf5z6BwZpdOyzydt3\/+szrXB5eZbQXHM+ZWUbaHdSMtW5Gn8WoLeuf\/HlyLQCZuizJ0r2WclaXkEA\n\/TELwq0nTp2h\/pODNHhmiE4PjTwUsPf4Sfrq3r2AaYGLiorSGfPMVNfgUtXadUhdrPVQN5XZqqi1\no4u6Dh9R9U8GPXr8hHpe08E2AY+HGOAHOHthdHqsGKWLnqiqdXgAulsjNUNPxfsqHgCE+hgI5zRw\nYuVZij2ODY+O0Z2v72pLGD+\/oNCY2DgPOKilvUMFTNi5h1LTsygqJp7CI3QUHbedcnLNVOt00WGZ\nzTXOBkrLNFCGPocKiktpP1sTkAOnz01oBty6LYIQfwCr5Az2hoR1MnNMpIuNJ5PZwtYsoyyDkWxs\ndXdLR0TH0o7dSbRla6RQbn4hVdiruciP6rQABoSsXUd6Qw7V1jsp22Qim4RsaN6vLm7IzXvAxQZT\nnlv8tZKtqoZ6evuE2joPkSm\/QCTWkJZYBOD7qz+gXbv3iPpXYi2nKkcdVVTaPUrN5k0b6O\/LfTwU\n6LtCPe5kK3sf3xa+RRzTDLj6g2BR++zCco3CenB5fWOTCnCwo5Mit26hkOBVKkBRcbF6vIWPp6en\nqcc\/WfshVdc5xTF0Ik0xuH7jJkrZmyYBXVRqLSN0lObWNjfALsrS6ylxxw6KjomhpORkThKnRww6\nOFHiExJIFx3D97BSW\/dhsR+emDKgv3+gWRcTKwBtVdUC0FJYpLq4nRfJNBjEQl1HjlLPsX4hbP9Y\ngT50tJe6e49Rp9s+s6VAgwUDAvsAuDc9Q3QQwOFbyWpnUzODNmlqe+X2Kk2AIwDMMeWSkTM1O8dI\nRSWlIqPVusiWPNjZ9VAADAjK1IPJxvs4qsHUXRwQSNFcqDEkwM1IljJbpUc3Qdv7KUBvdbL7nbJE\nYbasrXOOaALcwEkSxYG9fcdOD0ClUNfy9t6MTGripOGxXwyssBYshxGr0yse65ubuaNkUxv3cHii\n1FpunxKcr2+QDwA\/\/GgNhYVvpaSUVGFFZLDiWlivnuMwl4uug2MRSXDsxICAGzhzVnUtQBXA9u4e\nMWCgCuA+DqfLPuUaCMCAwCCKi0+gjCy96CgAramrV2MQbnKfbh7mVsArv2E9XCcAGxpGNAGuen81\nxW9PFAmCDIYVMX5lcly6DxAI9gNckN3BSsrLKT4xkWw1tQ9A49UB1\/GkpA1wTchaiomLp\/TMLAFY\nWFxCBmMu7Su3eVix43CPcC2kQKAEmbk01XqNaKif6ES41pxvmRrgu+++9yIAI3XRIjlSuRai1KBI\no+y4W08AysUxkIoBgWMMQry1M\/z+tnYRd5jGyysr1cmI33W0ZfG2iEgBmGcp5Bq4T7Q8b0BIKTW9\ncorevnMXz4V5Hi9NfSdO8iTTRXqjiSegXJHFDDihBfDm+g0bBWAalxK4GFmMhPEGRFbDOrAS1NDc\nQo38Gwnh\/naHUuTgoaOqtk60T3SnqXcS\/8ADmGbCeWjdtSeJY88kIAGIbbxEQbCqR3fxkvtgMXD6\nrHgY5RiurW9sDJjqsKBTEmXzljDak5wiwOBilBtYVliXE8hSVMyxZadqnheVxS1FRVTj+MFSgEQY\nuMPhodA6XS7XbC1unkQtVFwN68GKEKyH8oKu0i7HJzH\/8W8AZOgNovMgLJRpyF0YOkqs1pva3kvY\nzbDiuo9DRbtTAJWW9zChmFsrfrAoABXLQ9lyG7NljaPerglQKTcfrQnhYTSWUtPS1WT5qbjzgGVI\nkf2c1UpYQDv5VWJXcnKo5ndjjsUUQIZ+8g9xU3QTWAQZaHd703sUKeEBb4SFh0\/bXyBPrPTzb1eG\nh22RUZTIdQ5WAGwmTydwmbK4u7C\/gLsPYhBhoVSBjZs2TwYHB786VaDHWH9iPc2ay\/oba96SJUuN\nK339xgEa9N4qAYv3ZgwT6NeK8LIfEaUT5SmSvzGuJfB+PBTEI9y3S5cuXSfvO1eug\/VmPgrcH1mz\nWH9hvcB6hbWItYy1khU8d+5fM95ctnzs7XdW3PP18\/8fgCHe\/v+y5W9998Zin\/H58xdcW7Bg4djC\nha8Pz5s3v5NVxr\/NixYtzpwzZ06wvN8ief8X5HqzHgVwpnyaZ1jPsV5izWfhP723EZKsEFYYK46V\nzMpm5bOKWaXyO1\/uT5bnhcnr\/OV9fOR9X5LrYL3Hf66rccGfWc+ynme9zHpNPvkS1nLWCmlZP1Yg\nK0h++8n9K+R5S+R1r8n74H5zpDH+MJ1\/F86UMfoE60m5wGxpgWfkoso29j8lXfekDJ+ZM34vn+8B\n7Ouun8I61nUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-06\/magic_rock-1340212862.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

itemDef.oneclick_verb	= { // defined by magic_rock
	"id"				: "talk_to",
	"label"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 61,
	"tooltip"			: "Talk to the Magic Rock!",
	"get_tooltip"			: function(pc, verb, effects){

		// Had to remove 'Find out what you can do to your yard!' as the static tooltip
		// since one-click-verbs only work with static tips and we needed a more generic
		// option for non-homestreet rocks.

		return verb.tooltip;
	},
	"is_drop_target"		: false,
	"disable_proximity"		: true,
	"conditions"			: function(pc, drop_stack){

		if (this.container.is_newxp) return {state: 'enabled'};
		if (pc.houses_get_img_rewards()) return {state: 'enabled'};

		return {state: null};
	},
};

;
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
	"c"	: "change_style",
	"u"	: "cultivate_land",
	"t"	: "customize",
	"e"	: "expand",
	"h"	: "house_keys",
	"o"	: "howto_changestyle",
	"v"	: "howto_cultivate",
	"z"	: "howto_customize",
	"x"	: "howto_expand",
	"k"	: "howto_keys",
	"g"	: "talk_to",
	"n"	: "whatcha_reading"
};
itemDef.keys_in_pack = {};

log.info("magic_rock.js LOADED");

// generated ok 2012-11-05 15:26:47 by mygrant
