//#include include/cultivation.js

var label = "Dirt Pile";
var version = "1349315752";
var name_single = "Dirt Pile";
var name_plural = "Dirt Piles";
var article = "a";
var description = "A pile of dirt. Digging it with a shovel produces various dirty rewards, their quality depending on how deeply you appreciate soil, and how many friends are digging with you.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["dirt_pile"];
var has_instance_props = true;

var classProps = {
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.dirt_state = "11";	// defined by dirt_pile
	this.instanceProps.variant = "dirt1";	// defined by dirt_pile
	this.instanceProps.cultivation_max_wear = "300";	// defined by dirt_pile
	this.instanceProps.cultivation_wear = "";	// defined by dirt_pile
}

var instancePropsDef = {
	dirt_state : ["Amount of dirt visible in the pile, from 1 to 11."],
	variant : ["Asset variant of dirt pile"],
	cultivation_max_wear : ["Max wear"],
	cultivation_wear : ["Current wear"],
};

var instancePropsChoices = {
	dirt_state : [""],
	variant : ["dirt1","dirt2"],
	cultivation_max_wear : [""],
	cultivation_wear : [""],
};

var verbs = {};

verbs.remove = { // defined by dirt_pile
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Pour {$stack_name} on {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return this.proto_class && stack.class_tsid == 'wine_of_the_dead';
	},
	"conditions"			: function(pc, drop_stack){

		if (this.container.pols_is_pol() && !this.container.pols_is_owner(pc)) return {state:null};
		if (this.proto_class && drop_stack && drop_stack.class_tsid == 'wine_of_the_dead') return {state:'enabled'};
		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		var it = pc.getAllContents()[msg.target_itemstack_tsid];
		if (!it) return false;

		msg.target = this;
		return it.verbs['pour'].handler.call(it, pc, msg);
	}
};

verbs.dig = { // defined by dirt_pile
	"name"				: "dig",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Dig dutifully for delightful dirt",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Dig this {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		if((stack.class_tsid == 'shovel' || stack.class_tsid == 'ace_of_spades') && stack.isWorking()) {
			return true;
		} else {
			return false;
		}
	},
	"conditions"			: function(pc, drop_stack){

		// Find a shovel
		function is_shovel(it){ return (it.class_tsid == 'shovel' || it.class_tsid == 'ace_of_spades') && it.isWorking() ? true : false; }
		var shovel = pc.findFirst(is_shovel);

		if (!shovel){
			return {state:'disabled', reason: "You need a working shovel."}; 
		}

		if (this.getInstanceProp('dirt_state') == 1){
			return {state: 'disabled', reason: "There isn't enough dirt left to dig."};
		}

		var upgrade_max = pc.imagination_has_upgrade("soil_appreciation_dirt_pile_2") ? 2 : (pc.imagination_has_upgrade("soil_appreciation_dirt_pile_1") ? 1 : 0);

		if (upgrade_max == 2 && this.getDailyDigger(pc) >= 5) { 
			return {state: 'disabled', reason: "You've dug this dirt pile enough for today."};
		}
		else if (upgrade_max == 1 && this.getDailyDigger(pc) >= 4) {
			return {state: 'disabled', reason: "You've dug this dirt pile enough for today."};
		}
		else if(upgrade_max == 0 && this.getDailyDigger(pc) >= 3) {
			return {state: 'disabled', reason: "You've dug this dirt pile enough for today."};
		}

		return {state: 'enabled'};
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('dig_dirt_pile');
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.doDigging(pc,msg);
	}
};

function addDailyDigger(pc){ // defined by dirt_pile
	var today = current_day_key();
	if(!this.currentDay || this.currentDay != today) {
		this.currentDay = today;
		this.dailyDiggers = {};
	}
	if(!this.dailyDiggers[pc.tsid]) {
		this.dailyDiggers[pc.tsid] = 1;
	} else {
		this.dailyDiggers[pc.tsid]++;
	}
}

function addDigger(pc){ // defined by dirt_pile
	if(!this.diggers) {
		this.diggers = [];
	}
	if(!this.helpers) {
		this.helpers = {};
	}

	for(var i in this.helpers) {
		this.helpers[i][pc.tsid] = pc;
	}

	this.diggers.push(pc.tsid);
	this.helpers[pc.tsid] = {};

	pc['!digging'] = true;
}

function addDirt(){ // defined by dirt_pile
	var dirt_amt = parseInt(this.getInstanceProp('dirt_state')) + 1;
	if(dirt_amt > 11) {
		dirt_amt = 11;
	} else if(dirt_amt < 11) {
		this.apiSetTimer('addDirt', 300 * 1000);
	}

	this.setInstanceProp('dirt_state', dirt_amt);
}

function checkAndSendResponse(key, pc, slugs, txt_pc){ // defined by dirt_pile
	if (this.container.is_skillquest) return;

	return this.sendResponse(key, pc, slugs, txt_pc);
}

function cleanPCs(){ // defined by dirt_pile
	for(var i in this.diggers) {
		var pc = this.diggers[i];
		
		if(pc) {
			if(!pc.isOnline() || pc.location != this.container || !pc['!digging']) {
				// PC shouldn't be here. There has been an error
				log.info("Error: dirt pile "+this+" has retained digger "+pc+" who should have been removed!");
				this.removeDigger(pc);
			}
		}
	}
}

function doDigging(pc, msg){ // defined by dirt_pile
	if(pc['!digging']) {
		pc.sendActivity("You are already occupied with digging.");
		return false;
	}

	// Find a shovel
	if (msg.target_itemstack_tsid){
		var shovel = pc.getAllContents()[msg.target_itemstack_tsid];
	} else{
		function is_shovel(it){ return (it.class_tsid == 'shovel' || it.class_tsid == "ace_of_spades") && it.isWorking() ? true : false; }
		var shovel = pc.findFirst(is_shovel);
	}

	// Add us as a digger
	this.addDigger(pc);

	// Invoke skill package
	var ret = pc.runSkillPackage('dig_dirt_pile', this, {tool_item: shovel, word_progress: config.word_progress_map['digging'], callback: 'onDigComplete', msg: msg});

	if (!ret['ok']){
		this.removeDigger(pc);

		if (ret['error_tool_broken']){
			pc.sendActivity("Your shovel doesn't have enough wear remaining.");
		}
		else{
			pc.sendActivity("Oops! That didn't work. Try again?");
		}
	}

	return true;
}

function getDailyDigger(pc){ // defined by dirt_pile
	var today = current_day_key();
	if(!this.currentDay || this.currentDay != today) {
		this.currentDay = today;
		this.dailyDiggers = {};
	}
	if(!this.dailyDiggers[pc.tsid]) {
		return 0;
	} else {
		return this.dailyDiggers[pc.tsid];
	}
}

function getHelperString(pc){ // defined by dirt_pile
	if(!this.helpers || !this.helpers[pc.tsid]) {
		return "";
	}

	var num_helpers = num_keys(this.helpers[pc.tsid]);
	var count = 0;
	var result = "";

	for(var i in this.helpers[pc.tsid]) {
		count++;
		if(count > 1) {
			if(count == num_helpers) {
				result += ", and ";
			} else {
				result += ", ";
			}
		}
		result += this.helpers[pc.tsid][i].label;
	}

	return result;
}

function getVerbLabel(pc, verb){ // defined by dirt_pile
	if(verb == 'dig') {
		if(!this.helpers || num_keys(this.helpers) == 0) {
			return "Dig";
		} else {
	 		return "Help dig";
		}
	}
}

function make_config(){ // defined by dirt_pile
	var ret = {
		dirt_state: this.getInstanceProp('dirt_state') ? this.getInstanceProp('dirt_state') : '11',
		variant: this.getInstanceProp('variant')
	};

	ret = this.buildConfig(ret);
	return ret;
}

function onDigComplete(pc, ret){ // defined by dirt_pile
	var msg = ret.msg ? ret.msg : '';

	var failed = 1;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var num_helpers = num_keys(this.helpers[pc.tsid]);

	var bonus_chance = 0;
	var bonus_items = 0;

	var bonus_item_class = 'earth';
	var got_bonus = ret.details['got_drop'];

	var slugs = {};

	log.info("DIRT: dig complete");

	if (ret['ok']){

		if (ret.values['energy_cost']){
			slugs.energy = ret.values['energy_cost'];
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: ret.values['energy_cost']
			});
		}

		if (ret.values['mood_bonus']){
			slugs.mood = ret.values['mood_bonus'];
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: ret.values['mood_bonus']
			});
		}

		if (ret.values['xp_bonus']){
			slugs.xp = ret.values['xp_bonus'];
			self_effects.push({
				"type"	: "xp_give",
				"value"	: ret.values['xp_bonus']
			});
		}

		// don't show slugs unless there's at least two
		if (slugs.__length <= 1) { 
			slugs = null;
		}	
		
		// Additional bonuses for helpers
		if(num_helpers > 0) {
			bonus_items++;
		} 
		if(num_helpers > 1) {
			bonus_chance += 0.05;
		} 
		if(num_helpers > 2) {
			bonus_items++;
		} 
		if(num_helpers > 5) {
			bonus_items++;
			bonus_chance += 0.1;
		}

		var proto = apiFindItemPrototype('earth');

		// reduce the number of lumps in the dirt pile by one
		//log.info("CULT: adding wear to dirt pile");
		this.addWear();
		var dirt_amt = parseInt(this.getInstanceProp('dirt_state')) - 1;
		if(dirt_amt <= 1) {
			dirt_amt = 1;
			var dirt_gone = true;
			this.checkAndSendResponse('dirt_pile_gone', pc, slugs);

			//log.info("CULT: checking depletion on dirt pile");
			if (this.isDepleted()) this.replaceWithDepleted();
		}

		if(got_bonus) {
			if(!dirt_gone) {

				log.info("DIRT: slugs is "+slugs);			

				if(num_keys(this.helpers[pc.tsid]) > 0) {
					this.checkAndSendResponse('dig_loam_helped', pc, slugs);
				} else {
					this.checkAndSendResponse('dig_loam', pc, slugs);
				}
			}

			bonus_item_class = 'loam';
			proto = apiFindItemPrototype('loam');

			for (var i in ret.details['got_drop']){
				var it = ret.details['got_drop'][i];
				pc.quests_inc_counter('dig_loam', it.count);			
			}
		} else {
			// compute the real bonus.
			// From Bayes', the total possibility of getting loam is (l)+(1.0 - l) * b where l is the base skill package chance.
			// So if we didn't already get the bonus in the previous roll, we need to normalize the bonus probability

			var drop_chance = pc.getSkillPackageDetails('dig_dirt_pile').drop_chance;

			// These upgrades have been put on hold.
			/*if (pc.imagination_has_upgrade("soil_appreciation_loam_1")) {
				drop_chance *= 1.5;
			}
			else if (pc.imagination_has_upgrade("soil_appreciation_loam_2")) {
				drop_chance *= 2.0;
			}*/

			bonus_chance /= 1.0 - (drop_chance  / 100);

			if(is_chance(bonus_chance > 1.0 ? 1.0 : bonus_chance)) {
				pc.createItemFromSource('loam', ret.details['bonus_amount'], this);
				pc.quests_inc_counter('dig_loam', ret.details['bonus_amount']);

				bonus_item_class = 'loam';
				proto = apiFindItemPrototype('loam');

				got_bonus = true;

				self_effects.push({
					"type"	: "item_give",
					"value"	: ret.details['bonus_amount'],
					"which"  : proto.name_plural
				});

				if(!dirt_gone) {
					this.checkAndSendResponse('dig_loam_helped', pc, slugs);
				}
			} else {
				pc.createItemFromSource('earth', ret.details['bonus_amount'], this);
				pc.quests_inc_counter('dig_dirt', ret.details['bonus_amount']);
				self_effects.push({
					"type"	: "item_give",
					"value"	: ret.details['bonus_amount'],
					"which"  : proto.name_plural
				});

				if(!dirt_gone) {
					if(num_keys(this.helpers[pc.tsid]) > 0) {
						this.checkAndSendResponse('dig_dirt_helped', pc, slugs);
					} else {
						this.checkAndSendResponse('dig_dirt', pc, slugs);
					}
				}
			}
		}

		// Do bonus items
		if(bonus_items) {		
			var bonus_remaining = pc.createItemFromOffset(bonus_item_class, bonus_items, {x: 100, y:0}, false, this);
			if(bonus_item_class == 'loam') {
				pc.quests_inc_counter('dig_loam', ret.details['bonus_amount']);
			} else {
				pc.quests_inc_counter('dig_dirt', ret.details['bonus_amount']);
			}
			if(bonus_remaining != bonus_items) {
				var item_name = (bonus_items - bonus_remaining) > 1 ? proto.name_plural : proto.name_single;

				var bonus_msg = "You got "+ (bonus_items - bonus_remaining) +" additional "+item_name+" thanks to the help you got from "+this.getHelperString(pc)+".";
			}
		}

		this.setInstanceProp('dirt_state',dirt_amt);
		// Reset dug-timer
		this.apiCancelTimer('addDirt');
		if (!this.isDepleted()) this.apiSetTimer('addDirt', 5 * 60 * 1000);

		pc.achievements_increment('dug', 'dirt');
		pc.location.cultivation_add_img_rewards(pc, 3.0);

		failed = 0;
	}

	var pre_msg = this.buildVerbMessage(msg.count, 'dig', 'dug', failed, self_msgs, self_effects, they_effects);
	pc.sendOnlineActivity(pre_msg);
	if(bonus_msg) {
		pc.sendActivity(bonus_msg);
	}

	if(num_keys(this.helpers[pc.tsid]) > 0) {
		pc.quests_inc_counter('helped_dig', 1);
	}

	this.removeDigger(pc, false);
	this.addDailyDigger(pc);
}

function onOverlayDismissed(pc, payload){ // defined by dirt_pile
	this.removeDigger(pc, true);
	pc['!digging'] = false;
}

function onPlayerExit(pc){ // defined by dirt_pile
	if(this.helpers && this.helpers[pc.tsid]) {
		this.removeDigger(pc, true);
	}
}

function removeDigger(pc, cancel){ // defined by dirt_pile
	// If we're cancelling, remove us from any helper lists
	if(cancel) {
		for(var i in this.helpers) {
			if(this.helpers[i][pc.tsid]) {
				delete this.helpers[i][pc.tsid];
			}
		}
	}

	// remove us from diggers
	for(var i in this.diggers) {
		if(this.diggers[i] == pc.tsid) {
			this.diggers.splice(i, 1);
			break;
		}
	}
	// remove our helpers
	if(this.helpers[pc.tsid]) {
		delete this.helpers[pc.tsid];
	}

	pc['!digging'] = false;
}

function onCreate(){ // needed for initializing props
	this.initInstanceProps();
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Digging this yields <a href=\"\/items\/628\/\" glitch=\"item|earth\">Lumps of Earth<\/a> and sometimes <a href=\"\/items\/642\/\" glitch=\"item|loam\">Lumps of Loam<\/a>."]);
	out.push([0, "This can be dug with <a href=\"\/items\/627\/\" glitch=\"item|shovel\">Shovel<\/a> or <a href=\"\/items\/1202\/\" glitch=\"item|ace_of_spades\">Ace of Spades<\/a>."]);
	return out;
}

var tags = [
	"no_trade",
	"natural-resources"
];

var responses = {
	"dig_dirt": [
		"Ooooof. I maded you dirts.",
		"YAY! Heresis are the erfs and stuff you did dig.",
		"Diggins for you. Good diggin.",
		"Ooooooh, looky what you did pull from my middles.",
		"Nice duggy-uppin’ with your shovel-widget. I like you.",
		"Hello! Is you wantin more dirty bits? I made you some.",
		"I did make you erfs and stuff and did put it in your bag. OK!",
		"HERE IS ERFS AND STUFFS. I like you.",
	],
	"dig_dirt_helped": [
		"Ooof! Mores the peopling makes dirty dirts nicer.",
		"Nicey dirts for you? And for friendleglitches, I fink.",
		"Nice for you! You likes it.",
		"Good diggin? Erfy digs? Or Loammy digs?",
		"Ooooh, big dirty piles are erfier than little patches, int they?",
		"Erfs for you, erfs for erryone!",
		"Theres enuff dirtypiles for you AND friendies. True.",
		"Good diggin', yous! I like yous! Allofyous!",
	],
	"dig_loam": [
		"Looks! Looks at the stuff you did dugged up! Loammy!",
		"You maded loams!",
		"Lookit! Loamminess!",
		"OooooOOOOoooo. Loam, innit? I like you.",
	],
	"dig_loam_helped": [
		"You all togetherish did dig out extra loams. LOAMS!",
		"Grouppy-shovellins make for loaminess. Like they say.",
		"Many shovellinesses make more loams.",
		"Yes. Many friends make moresome loamminess. Good.",
	],
	"dirt_pile_gone": [
		"Paf! No more dirtypile!",
		"Allgone!",
		"Dirtygone.",
		"Poff! Out of erfs now.",
		"I like you. I go now.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-103,"y":-63,"w":195,"h":64},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAD\/klEQVR42u2US09bVxDHkSIRqeHW\nvm+\/3zEB2\/ELG4zBF1+\/sCH4wcPgJibgkEeBuG0iIbWrSqm6aVR1WTb9ApW66AdA6tpSViyyyqLK\n2lK\/wGTmgLNKn6mqLu5IR0fn3HPn\/OY\/M2dszDDDDDPMMMMMM8ywS\/ui5nWf1Pz1x0VP\/Sjvjf6v\n4I7zHu1JJTA8LnjhCAfNt+esr25FJK14Mmb6T9Tp5Vy7zX1zdPXkWnQnZdEeaO6fDnXPCwLCmYEd\n6V64r7lga0aF\/QUH1GMydG4rLxoV4duRn8\/K\/h86s2p\/M8n\/O+BPKr4+AgxREbgVlaG9rqA6Nni0\n5IZ+yQeP8h4cbuhm7NCZs+MZiQE+xO+783boLTphPS3T\/tnTauAV\/bMWVaAZl6EcMr9fKRyXPNo9\nvIAuOcg54U7GhpfaYCdthY2kAvRtL+ugdMJaTGFw9ZjEwEhJUrEZV2D15gU0BUV+urqNAdZ1cdiO\nK\/8MstMxu+\/lnEO6gC6jyEkVgmmnVFTMxi4jiN6ig80NhNxOWVhAI8DStMDANzGg0dntFRWaGQwG\nM1KaFof54N9UsttT+82KDCsRkSlClxEczaQgKfFp2Q+Pi5jiJQ+CuqARV\/G8xM4dYi0SDI1KSGBq\n76QtgHXL9u5giVTDIlN19aYItYgwXP2r6V7JmPfbKStLE0VNTu5m7ewSGqQgge5V7fAA4e7n3EDn\nRyAEQKmnmc62MJXkg\/x9jPXaw\/32jIWUw6Ak9g+VwOJ1fpj0vbtxxhd8XLA0xdcKk0J\/3m\/+rRoW\nMF0SrCcU5rgza2HrVuICmNbUKJRK6l5SrY37a5hKgiI4ahwCovUnZR88XQ4wpWlvd56UFTH1IpSx\nBIpTAsz7eVwrtP5F\/vDqdeQSR4Dc5VBbceWbOa\/pKwR5rQV5BkRqrCcs6ERkkVLtbSIMXUxgNOgM\npZC+kyLUOARy0SQqSzmldyOpsvRuoN9WQmblQ3CHupuVx+ac81kr429y3PgN5DG\/S80relBM46zk\nJk361oyCjp2ssEmdZYyYum9pkn\/71nWxJum9o3JYRuULGAh1+16WUupi3d3NOFB1K4MhyLtZGwYj\nQx795IPCeS0inVfDynkrYf28EBJeTlsmtpDB9kelOI7DmQvyX2OnDVCZQTnDQzI68V1A\/qAXc3Cn\nCRd3WpgSfi5E+MFMgHtempaeF26Ig1mP6Qw7\/\/VDzckgD3IO9izpMenXYlo8p5JpY6eXsQaLYeuP\nEZ9YzAZMvWxq4stLKO593+7xSyc0XylMmRvViHT6EaZ8G9O8EDCfNeLKAEviZT2JL0FKZOnTw\/Zn\nHHd1MmS7tqOF+O8TLuEA18E\/U8owwwwzzDDDDDPsd+0NEGrka3do7dMAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-06\/dirt_pile-1307403805.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: true,
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
	"no_trade",
	"natural-resources"
];
itemDef.keys_in_location = {
	"g"	: "dig",
	"e"	: "remove"
};
itemDef.keys_in_pack = {};

log.info("dirt_pile.js LOADED");

// generated ok 2012-10-03 18:55:52 by lizg
