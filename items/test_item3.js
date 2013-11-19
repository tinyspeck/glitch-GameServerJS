//#include include/npc_conversation.js

var label = "test";
var version = "1351280528";
var name_single = "test";
var name_plural = "test";
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
var parent_classes = ["test_item3", "mortar_barnacle"];
var has_instance_props = true;

var classProps = {
	"conversation_offset_y"	: "-20",	// defined by mortar_barnacle
	"conversation_offset_x"	: "-10"	// defined by mortar_barnacle
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.scrape_state = "4";	// defined by mortar_barnacle
	this.instanceProps.blister = "1";	// defined by mortar_barnacle
}

var instancePropsDef = {
	scrape_state : ["1-4, 4 is when it can be harvested"],
	blister : ["Which blister? 1-6"],
};

var instancePropsChoices = {
	scrape_state : [""],
	blister : [""],
};

var verbs = {};

verbs.scrape = { // defined by mortar_barnacle
	"name"				: "scrape",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Or, drag scraper to barnacle. Costs $energy_cost energy and takes $seconds seconds",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Scrape this {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return (stack.class_tsid == 'scraper' || stack.class_tsid == 'super_scraper') && stack.isWorking() ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.isUseable()){
			return {state: 'disabled', reason: "This barnacle is not ready yet!"};
		}

		var package_class = 'scraping';
			
		var details = pc.getSkillPackageDetails(package_class);
		if (!details) return {state:null};

		if (details.interval_limit){
			var fail = pc.checkSkillPackageOverLimit(package_class, details.interval_limit, this);
			if (fail) return {state: 'disabled', reason: "You can't harvest this barnacle more than once per day."};
		}

		function is_scraper(it){ return (it.class_tsid == 'scraper' || it.class_tsid == 'super_scraper') && it.isWorking() ? true : false; }
		if (!pc.items_has(is_scraper, 1)){
			return {state: 'disabled', reason: "You'll need a working scraper first."};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('scraping');
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (msg.target_item_class || msg.target_itemstack_tsid){
			return this.startScraping(pc, msg);
		}
		else{
			function is_scraper(it){ return it.class_tsid =='super_scraper' && it.isWorking() ? true : false; }
			var scraper = pc.findFirst(is_scraper);
			if (!scraper){
				function is_scraper(it){ return it.class_tsid =='scraper' && it.isWorking() ? true : false; }
				scraper = pc.findFirst(is_scraper);
				if (!scraper){
					return false;
				}
			}

			return this.startScraping(pc, scraper.class_tsid);
		}
	}
};

verbs.talk_to = { // defined by mortar_barnacle
	"name"				: "talk to",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
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

function buildState(){ // defined by mortar_barnacle
	var state = '';
	switch (intval(this.getInstanceProp('scrape_state'))){
		case 0:
			state = 'empty';
			break;
		case 1:
			state = 'empty';
			break;
		case 2:
			state = 'small';
			break;
		case 3:
			state = 'big';
			break;
		case 4:
			state = 'ready';
			break;
		default:
			state = 'empty';
			log.error(this+' has bad scrape state: '+this.getInstanceProp('scrape_state'));
	}

	return state;
}

function isUseable(){ // defined by mortar_barnacle
	return this.getInstanceProp('scrape_state') == 4 ? true : false;
}

function make_config(){ // defined by mortar_barnacle
	var blister = this.getInstanceProp('blister');
	if (!blister) blister = '1';

	return {
		blister: 'blister'+blister
	};
}

function onCreate(){ // defined by mortar_barnacle
	this.initInstanceProps();
	this.state = 1;
	this.apiSetPlayersCollisions(true);
	this.apiSetHitBox(400, 400);
}

function onGrow(){ // defined by mortar_barnacle
	var scrape_state = intval(this.getInstanceProp('scrape_state'));
	if (scrape_state == 4) return;

	this.setInstanceProp('scrape_state', scrape_state+1);
	//this.broadcastState();

	var growtime = randInt(30, 180); // regrow somewhere between 30 secs and 3 mins

	if (scrape_state < 3) this.apiSetTimer('onGrow', growtime * 1000);
}

function onLoad(){ // defined by mortar_barnacle
	if (!this.hitBox){
		this.apiSetPlayersCollisions(true);
		this.apiSetHitBox(400, 400);
	}
}

function onPlayerCollision(pc){ // defined by mortar_barnacle
	if (this.conversations){
		for (var i=0; i<conversations.length; i++){
			if (pc.conversations_offer(this, conversations[i])){
				return pc.conversations_offer_bubble(this);
			}
		}
	}
}

function onPropsChanged(){ // defined by mortar_barnacle
	this.broadcastConfig();
	this.broadcastState();
}

function onScrapingComplete(pc, ret){ // defined by mortar_barnacle
	var failed = 0;
	var self_msgs = [];
	var self_effects = [];
	var they_effects = [];

	var slugs = ret.slugs;
	self_effects.push({
		"type"	: "metabolic_dec",
		"which"	: "energy",
		"value"	: ret.values['energy_cost'] ? ret.values['energy_cost'] : 0
	});

	if (ret.values['mood_bonus']){
		self_effects.push({
			"type"	: "metabolic_inc",
			"which"	: "mood",
			"value"	: ret.values['mood_bonus']
		});
	}

	if (ret.values['xp_bonus']){
		self_effects.push({
			"type"	: "xp_give",
			"value"	: ret.values['xp_bonus']
		});
	}

	var to_get = ret.details['bonus_amount'];
	var remaining = pc.createItemFromSource('barnacle', to_get, this);
	if (remaining != to_get){
		var proto = apiFindItemPrototype('barnacle');
		var got = to_get - remaining;

		if (got == 1){
			self_effects.push({
				"type"	: "item_give",
				"which"	: proto.name_single,
				"value"	: got
			});
		}
		else{
			self_effects.push({
				"type"	: "item_give",
				"which"	: proto.name_plural,
				"value"	: got
			});
		}
		
		if (!slugs.items) slugs.items = [];
		slugs.items.push({
			class_tsid	: 'barnacle',
			label		: proto.label,
			count		: got,
			//itemstack_tsid	: 'IWESKDJF345' //sent when applicable
		});
	}

	this.sendResponse('scrape', pc, slugs);

	var pre_msg = this.buildVerbMessage(this.count, 'scrape', 'scraped', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	this.setInstanceProp('scrape_state', 1);
	pc.announce_sound('BARNACLE_IS_RELEASED');
	//this.broadcastState();

	var growtime = randInt(30, 180); // regrow somewhere between 30 secs and 3 mins

	this.apiSetTimer('onGrow', growtime * 1000);

	if (this.pod){
		this.container.cultivation_add_img_rewards(pc, 3.0);
		if (!this.pod.addWear()){
			this.pod.onDepleted();
		}
	}

	delete pc['!scraping'];
}

function startScraping(pc, msg){ // defined by mortar_barnacle
	// Find a scraper
	if (msg.target_itemstack_tsid){
		var scraper = pc.getAllContents()[msg.target_itemstack_tsid];
	}
	else{
		if (msg.target_item_class){
			var tool_class = msg.target_item_class;
		}
		else{
			var tool_class = msg;
		}
		

		function is_scraper(it){ return it.class_tsid == tool_class && it.isWorking() ? true : false; }
		var scraper = pc.findFirst(is_scraper);
	}

	if (!scraper){
		pc.sendActivity("You'll need a working scraper first.");
		return false;
	}

	// Is this working?

	if (!this.isUseable()){
		pc.sendActivity("This is not the barnacle you are looking for.");
		return false;
	}

	pc['!scraping'] = this.tsid;

	var no_upgrade = pc.party_scraping;

	var success = pc.runSkillPackage('scraping', this, {word_progress: config.word_progress_map['scrape'], tool_item: scraper, source_delta_y: 80, source_delta_x: 40, callback: 'onScrapingComplete', msg: msg, no_img_upgrades: no_upgrade});

	if (!success['ok']){
		delete pc['!scraping'];
		return false;
	}

	return true;
}

function conversation_canoffer_rime_of_the_barnacle_1(pc){ // defined by conversation auto-builder for "rime_of_the_barnacle_1"
	var chain = null;
	if (!pc.conversations_can_do_chain(chain)) return false;

	if (pc.conversations_has_completed(null, "genesis_of_a_rock_4")){
		return true;
	}
	return false;
}

function conversation_run_rime_of_the_barnacle_1(pc, msg, replay){ // defined by conversation auto-builder for "rime_of_the_barnacle_1"
	if (!msg.count) msg.count = 1;
	var self_effects = [];
	var conversation_id = "rime_of_the_barnacle_1";
	var conversation_title = "Rime of the Barnacle";
	var chain = null;
	var choices = {};

	choices['0'] = {};
	choices['1'] = {};
	choices['2'] = {};
	choices['3'] = {};
	choices['4'] = {};
	choices['5'] = {};
	if (!msg.choice){
		choices['0']['rime_of_the_barnacle_1-0-2'] = {txt: "Oh arrr? I mean, Yes?", value: 'rime_of_the_barnacle_1-0-2'};
		this.conversation_start(pc, "I know not if you be aware, me hearty, but this be not the first time this world you roam upon ‘as been ‘ost to adventurers.", choices['0'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rime_of_the_barnacle_1', msg.choice);
	}

	if (msg.choice == "rime_of_the_barnacle_1-0-2"){
		choices['1']['rime_of_the_barnacle_1-1-2'] = {txt: "Space?!?", value: 'rime_of_the_barnacle_1-1-2'};
		this.conversation_reply(pc, msg, "Arrrr. There be some say they comed from a whole ‘nother world, they did. Said they fell ‘ere from space.", choices['1'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rime_of_the_barnacle_1', msg.choice);
	}

	if (msg.choice == "rime_of_the_barnacle_1-1-2"){
		choices['2']['rime_of_the_barnacle_1-2-2'] = {txt: "Aaaaand which ocean might that be, exactly?", value: 'rime_of_the_barnacle_1-2-2'};
		this.conversation_reply(pc, msg, "Arr. Space. Thems brought them blasted fireflies with’em when they came, buzzin’ around like nobody’s business, the blighters. And there be others, me hearty, say they came from over the ocean, a land far away. And they did bring bounty, laddie-o. Much bounty. ", choices['2'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rime_of_the_barnacle_1', msg.choice);
	}

	if (msg.choice == "rime_of_the_barnacle_1-2-2"){
		choices['3']['rime_of_the_barnacle_1-3-2'] = {txt: "You are?", value: 'rime_of_the_barnacle_1-3-2'};
		this.conversation_reply(pc, msg, "Somewhere over yonder. I be gesticluatin’ right now in case you bain’t noticin'. ", choices['3'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rime_of_the_barnacle_1', msg.choice);
	}

	if (msg.choice == "rime_of_the_barnacle_1-3-2"){
		choices['4']['rime_of_the_barnacle_1-4-2'] = {txt: "Arrr.", value: 'rime_of_the_barnacle_1-4-2'};
		this.conversation_reply(pc, msg, "Arrrrr. Admittedly, it's pretty hard to tell.", choices['4'], null, null, null, {title: conversation_title});
		pc.conversations_set_current_state(this.tsid, 'rime_of_the_barnacle_1', msg.choice);
	}

	if (msg.choice == "rime_of_the_barnacle_1-4-2"){
		pc.conversations_complete(this.class_tsid, conversation_id, chain);
		this.conversation_end(pc, msg);
		pc.conversations_clear_current_state();
	}

}

var conversations = [
	"rime_of_the_barnacle_1",
];

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"barnacle",
	"natural-resources"
];

var responses = {
	"scrape": [
		"Arrrrrrrrrrr…",
		"You be boostin' barnacles, be you? Arrr, that you be.",
		"That be that then, lads. I be off.",
		"Farewell, me blister of Barnacle mates! Farewell!",
		"Offward, ho!",
		"Oh. I be scuppered now.",
		"That be me unstuck, then",
		"Arr, I clung me best, but all for naught",
		"Batten down your hatches, lads, there be a scraper at large!",
		"Arrrr, I be naught but 'lubber booty now.",
	],
	"scrape_drop": [
		"Ye scurvy bilge-rat, you've plundered me now.",
		"Arrr, you've found me gold.",
		"Treasure!",
		"Arrr! You've found me lucky charm!",
		"The spoils are all yours, me hearty.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-98,"y":-70,"w":182,"h":67},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAFV0lEQVR42u1WbUxTZxSGguVDoDId\nyESdYzAFpoYa3ebHXIQlRtxHMrJMlCWSNVsyfpA4NduSblGSMfaBuMyRqEE3NqnKKEWolVFpqyir\nCFJa2tvW0tuP297b9rb3tqWmhr233us6RnA\/9vXjPsmT5vacnvOc857z3iYksGDBggULFixY\/BOY\nmZlJBOTMY08FzACsmJ6eLnxUPGckUoz6Q+cgb2RfLwSlgK8Sac4rInke2zOArxAEkQM+F8xh32XD\n8A9NTvQrrdm6jc\/nUz6c2UmBXxLg0mFkeveoO\/SNDSOvyiYse7dv354KzA\/yb9q5M2v2jzyh0PLR\niYkSkiRzZwtggvr9\/o02m2095SOXy1OZ5MDGBdyA42T5jRFNcXt7TzaKonyz2bxSIBD8IRYaCL\/r\n8ke6IPzeBYMTH9QjfpnOFThzVtS9KiE\/Py3mVLB2bU5RUdGSOAEcGIaXqVQ3KjQazWYQPFMkEnHj\n7CmAhSBhhVarrwmFQnscDscaIDJDrVanR6PR\/ffv3z8RIMlDLsz7ucvn+wDFcYE3QDYZ7t5dz3QS\nx\/Fsa3DmyKTT12d2k\/0mNzFwE7Kdt+DTinE30XKkta3ggcCCtTm5ubk58QIikUgJSFotlUpLQFKe\nUChMjutQNuDmYDD4DoKi1cCPD7itsrIyHZiT9Hb7EiCIDzpbrTNNCRHMe\/y2yXTs6ojmrePHTz0B\nfKhik1x44JDTG+4a1Fk6jWhAYvWR3VY8fMmJh9QKo+Pc5Rsj+6l8iU+X8oHSvPT4ASfJ6Qo9ZH5\/\naEi9qb6+nmo1dTRJlD\/VYWr25Erllu\/aftgmkUiWVVVVZQAbNdxJoOtcsBgVXjzwsUTSW61QXHt1\nfBLa1y39pQzM1iLgE5svIOSNMVf4E6ObEFs95IDNQ9504mGlzukdsvtC13quje6NCVy3bksRj7ci\nO35DPR7PcqPRLGhvF\/GnpqaKDxw4sJAeWkrgQgJ0WDk0VD4wqKrGMF+Nani0hE68ABxdWTAcFpLB\n4BmdTidEEKQRdPT8gEKxA9gzAWMFwxi2zOIJ1Oqw4NlJd7BfgxCXR2GP+KYFkarN9p4TnX31MUHP\nV9Wnlca6+PsShMPhp8B8lXd0dJTr9frVdHdim0jZvV4vz+31boVhe+2dO9rXxrTaMjoxFwgsNztc\nRxHM0zJpMB9F3O5mo9X2xYm2to3ATnWQKpbb29ubNWSAN004fC1jMCqFXMQlK0qorFjgV+WE5cpP\nEtnrjKbkgoLS5fFLQg2wTDZY2NnZuUUsFufSc8MI5AG+YLfbKxSK4R1araHy5MWLK5kO1tXVpUSi\n0b33olEZgnpEfoLs0OiNgj21tZQPDzCdjpXQrVSv0Lrxz6weQjZiwy\/ore4B+Zj++\/Oq2yfrDn70\nXEwQmIs\/3XdgKThC4deLGhsbM1tbW3l0QOaIU8AMPn6ms3\/x9evq1ZMm04b3Dh\/OZgRSRUA2W74v\nQL7tRH2f4kSwFSzarry8vCVxR0zNc4IcsuUrTfY9wzB2TOvwiQfGoW+\/bD31kgmGD6elpeU\/6oJP\npK+EZJpJs+yMjUuPAJd+pr7nUMsFQZYyB4IKeqT9W+mrLIMu5GGsW+OGNSr93TcNrsA5g90jbmho\nKDt99scXgWnpX3mrJc7z2pldACOOASWC29zcnFtTU7OYFpdGF\/IwXktLS8rPffInb8HoQaMda2po\naip9effuVcC0+O94LTMiOXMUksiIpLuWytyBc8RJBtteLurqejYrK+sx8EyNTNa\/9d+CQ4tiOOdp\nXFEqVxQXF2fQW76Q7vb\/B42nxJlxtwVDFixYsGDBgsV\/iN8Avfj+HU97Bo8AAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/test_item3-1351280323.swf",
	admin_props	: true,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: true,
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
	"no_trade",
	"no_auction",
	"barnacle",
	"natural-resources"
];
itemDef.keys_in_location = {
	"c"	: "scrape",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("test_item3.js LOADED");

// generated ok 2012-10-26 12:42:08 by kukubee
