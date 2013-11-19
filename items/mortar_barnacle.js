//#include include/npc_conversation.js

var label = "Mortar Barnacle";
var version = "1351119010";
var name_single = "Mortar Barnacle";
var name_plural = "Mortar Barnacles";
var article = "a";
var description = "An unpretentious lump commonly found growing in marshland. Slow-growing, but once a barnacle reaches full blister, they can be scraped off with the right tool, and ground down.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = true;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["mortar_barnacle"];
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
	out.push([2, "Scraping this will yield <a href=\"\/items\/639\/\" glitch=\"item|barnacle\">Mortar Barnacles<\/a>."]);
	return out;
}

var tags = [
	"barnacle",
	"no_trade",
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
		'position': {"x":-18,"y":-43,"w":34,"h":42},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAGO0lEQVR42u2Ya0xTZxjHcXJRwSHg\n1HGrgOtEkKIiqCC3chcoIAXLrZRruWqBUmgHFRhaRQSMF4bWwrzMqVNQmHNb1Dk3dVtG4lz20WWa\nffED2RI\/nz0v+decEP3EAZPFJ\/ml5305HP48t\/c5tbF5a2\/trc2pLSAWE86EK+GGT7ZeQti+SXEO\nxCLC7uHE8ORX5\/s482Edp9+T94+6KOXr4l1xe\/39PT+AWNv59pqddTF8RG8Z6tU82Wco7jNocmWN\nNVkitn\/1tGl3d2vps\/jI4BRaroRH58XesV7oanMlHdrCqFfd9Ms3F51PH9ZG1ZWnsZ+vIjwIp3kT\nxzN74n146T3i3df8LhPpRSydK3ELrRe1JamS+rJ0Y1pCqIaWFUQloSRyCdno6d4B\/v0884TIuQv3\njXN9lpb6HE5TmfnUealjM23VQWQRE+gr8szr1JadoetNrxDJ1r7wpq3goWV5ZT7cwrU35b3wXb3K\nCHE1RDlRSOQQ6WI\/UeZQj97S1ar80aBRKPkPunKyp54+xGhHglauzc3zA0pNZdaLjOQtlyGOUUWU\nEvmEnAnMz0xWU+vhBrpruDaNYsr6kIfXz0juXBnkctIjSmjpjR4quK3liauG94oJBbGTSCXiicgO\nrWqooSrrZyaEibs3dmrqmKmO09XJ79KePxq7MN5j9tOXn0btLpNNxYQHjdBSDXElCC8rkEyC9b04\nYjuxmQjq7axpuGzu4vq71dyB9hKu26DkaD8EBWMvWPVeNZueNFZnPXdxcapFWFUoDgXCKyOSiFgi\nHCLWS6MkMSZjyfVDHWUvBWanbdcjF50F633fjw5xBfLYKxBVBM\/loTiyEN4EIprYikoOINYQy0y6\nCufhI62TprZSjtrUTdqToH\/O2oNMpMODiWFLRuK24\/AYYxdPXDqRjPBGEmHEBmId4Ue4sy5w+4vj\nU10tRVxTVdYjpIDXbFsOE+hdrkgMwJoVQjYPq7gUeC8G4d0MD61F73P\/Ycx87aipnuvQFXDGpjwO\n9\/nNtnHbsRzq2VvWh3U6ci0Dn2kQl4jci+SFdz3ybPWJA01tgwc1XEczidPmc20NCi7Q34sV1oez\nPf5YlXnpNblHsA6FICtJ8JyUiOJ5LxjhXYOex3JtUZtWEdXVUmwxags4aYSkATm6bLYC7TXqTDNL\ncngmHqLikXOxPHEs9zbCe9bwemCQcLA+dGTAwEVHSBrpMnC2\/XB69isrSu40tatk+GPRyLUYCNvO\nE7cJuWf1ngjTjhu\/5w3367norYFNQghcgAcHdegKjzIv7IgLrYUgK1tniAtAbvligllBuBzb3zA2\n49kRQghk5sgmEF29fPSQoVTUWi\/\/FoLCkJMhCKtV3FpUpze8t\/zWpcF9Xa1FqhmRicX9rkIIFBmb\n8\/\/t1BUwEa4hweIU9LkNELaeJ46FdjXSYcX4SH\/1Z4NGzrAnt4\/3THdUvCCnCWukHjWqHYPGxjwL\n9sQQFQhh\/girVZwn5j63atUur9696hFdhZwvhP1j2wgfoQZYVx+fVaE0ifxtaJx+MXKCt5gosSx5\nSxpyji9uObzjOON1wQ6nzkahBgbra6Z3RWHSJ5SDk8wbhfI0nwsnOp4eaC\/9Xb8nx5wQGcw84tHb\n3iAdPztg+Hyo23Two+okvgB23KVIw+PRCQLQfoSxzIRQibo4pV9bm327qTrLyMavSye7ODalUH7+\nZX15unXx+L39hhKuuS57qnBnTNi9UXPMg4kRGTvLb5zrfxa7LUSFAvMT+iXKHsn9svP\/OnFW1GNU\nxypzYiPhDbfwTeu8y\/MTkosypGJLv37yVK+O6++q49TK1D9cXBzzUByBeJa9jcDmhPbhzt88e9Qg\n+o7G+fvjlj9pKLh7\/7rlzthwz+3Bg01Tu8tlXEpcyDkMtFLkno8Q1fs6c0YxTLeIh+MjymsjPZMD\nH1dND6RsIGipl3NMWJVyx\/N1Yu8WDBlSnNNieHtOvxJZBk8GpieGNlerUi9o67IfUd79pqnMeEzr\nxztTwy9QSBU4tyPhOTEqfLHNPNhSNGMxmnUYzuVonBLRvOkmCEUxr9\/T2MATbuhna9Cwg0Ag1n74\nuSt\/opnvb7yWQMBKFJAHPldifwn\/DfFN2kK0Dgdga\/N\/tv8ATt7PGxb1xnYAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2010-12\/1293562015-3289.swf",
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
	"barnacle",
	"no_trade",
	"natural-resources"
];
itemDef.keys_in_location = {
	"c"	: "scrape",
	"t"	: "talk_to"
};
itemDef.keys_in_pack = {};

log.info("mortar_barnacle.js LOADED");

// generated ok 2012-10-24 15:50:10 by lizg
