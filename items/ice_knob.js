//#include include/scraping.js

var label = "Ice Nubbin";
var version = "1352416540";
var name_single = "Ice Nubbin";
var name_plural = "Ice Nubbins";
var article = "an";
var description = "A dribble of purest water, frozen in time, space, and temperature (mainly temperature, actually: it's very cold) into a nubbin of purest ice. Attacking the nubbin with a sharp enough scraper (NB: not as painful as it sounds) will result in handfuls of fresh cuboid ice lumps.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["ice_knob"];
var has_instance_props = true;

var classProps = {
	"conversation_offset_y"	: "-40"	// defined by ice_knob
};

function initInstanceProps(){
	this.instanceProps = {};
	this.instanceProps.scrape_state = "4";	// defined by ice_knob
	this.instanceProps.knob = "1";	// defined by ice_knob
}

var instancePropsDef = {
	scrape_state : ["1-4, 4 being harvestable"],
	knob : ["1-4, controls orientation of the knob"],
};

var instancePropsChoices = {
	scrape_state : [""],
	knob : [""],
};

var verbs = {};

verbs.scrape = { // defined by ice_knob
	"name"				: "scrape",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Or, drag scraper to ice nubbin. Costs $energy_cost energy and takes $seconds seconds",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "",
	"drop_ok_code"			: function(stack, pc){

		return (stack.class_tsid == 'scraper' || stack.class_tsid == 'super_scraper') && stack.isWorking() ? true : false;
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.isUseable()){
			return {state: 'disabled', reason: "This Ice Nubbin is not ready yet!"};
		}

		var package_class = 'scraping';
			
		var details = pc.getSkillPackageDetails(package_class);
		if (!details) return {state:null};

		if (details.interval_limit){
			var fail = pc.checkSkillPackageOverLimit(package_class, details.interval_limit, this);
			if (fail) return {state: 'disabled', reason: "You can't harvest this Ice Nubbin more than once per day."};
		}

		function is_scraper(it){ return (it.class_tsid == 'scraper' || it.class_tsid == 'super_scraper') && it.isWorking() ? true : false; }
		if (!pc.items_has(is_scraper, 1)){
			return {state: 'disabled', reason: "You'll need a working Scraper first."};
		}

		return {state:'enabled'};
	},
	"effects"			: function(pc){

		return pc.trySkillPackage('ice_scraping');
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

function buildState(){ // defined by ice_knob
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

function getIceAmount(pc){ // defined by ice_knob
	var chance = randInt(1, 100);

	log.info("ICE chance is "+chance);

	if (pc.imagination_has_upgrade('ice_scraping_yield')) {
		//2 Ice - 40% / 3 Ice - 30% / 4 Ice - 20% / 5 Ice - 10% average yield 3 Ice

		if (chance < 40) {
			var to_get = 2;
			var talkback_key = "scrape_2_ice";
		}
		else if (chance < 70) { 
			var to_get = 3;
			var talkback_key  = "scrape_3_ice";
		}
		else if (chance < 90) {
			var to_get = 4;
			var talkback_key = "scrape_4_ice";
		}
		else {
			var to_get = 5;
			var talkback_key = "scrape"; // we don't have talkbacks for 5
		}

	}
	else { 
		//1 Ice - 50% / 2 Ice - 30% / 3 Ice - 20% average yield 1.7 Ice
		if (chance < 50) {
			var to_get = 1;
			var talkback_key = "scrape";
		}
		else if (chance < 80) {
			var to_get = 2;
			var talkback_key = "scrape_2_ice";
		}
		else {
			var to_get = 3;
			var talkback_key = "scrape_3_ice";
		}
	}

	return { amount: to_get, talkback: talkback_key };
}

function isUseable(){ // defined by ice_knob
	return this.getInstanceProp('scrape_state') == 4 ? true : false;
}

function make_config(){ // defined by ice_knob
	var knob = this.getInstanceProp('knob');
	if (!knob) knob = '1';

	return {
		knob: 'knob'+knob
	};
}

function onCreate(){ // defined by ice_knob
	this.initInstanceProps();
	this.state = 1;
}

function onGrow(){ // defined by ice_knob
	var scrape_state = intval(this.getInstanceProp('scrape_state'));
	if (scrape_state == 4) return;

	this.setInstanceProp('scrape_state', scrape_state+1);

	var growtime = randInt(30, 180); // regrow somewhere between 30 secs and 3 mins

	if (scrape_state < 3) this.apiSetTimer('onGrow', growtime * 1000);
}

function onLoad(){ // defined by ice_knob

}

function onPropsChanged(){ // defined by ice_knob
	this.broadcastConfig();
	this.broadcastState();
}

function onScrapingComplete(pc, ret){ // defined by ice_knob
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

	// Amounts are defined in this doc: https://docs.google.com/spreadsheet/ccc?key=0Ainb9qzMereSdDUzNnhSTThyTW5kRVNEVDhiQmhDZGc#gid=23

	/*var chance = randInt(1, 100);
	if (chance < 50) {
		var to_get = 1;
		var talkback_key = "scrape";
	}
	else if (chance < 80) {
		var to_get = 2;
		var talkback_key = "scrape_2_ice";
	}
	else {
		var to_get = 3;
		var talkback_key = "scrape_3_ice";
	}

	// later...
	if (to_get == 4) {
		var talkback_key = "scrape_4_ice";
	} */

	var to_give = this.getIceAmount(pc);
	var to_get = to_give.amount;
	var talkback_key = to_give.talkback;

	var bonus = this.getBonus(pc);
	log.info("ICE bonus "+bonus+" to_get "+to_get);

	var remaining = pc.createItemFromSource('ice', to_get, this);
	var got = to_get;
	if (remaining != (to_get + bonus)){
		var proto = apiFindItemPrototype('ice');
		got = to_get - remaining;
	}

	var remaining = pc.createItemFromSource('ice', bonus, this);
	//bonus -= remaining;

	// Set up effects
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
			class_tsid	: 'ice',
			label		: proto.label,
			count		: got,
		});

	pc.achievements_increment("ice", "ice_received", got+bonus);

	this.sendResponse(talkback_key, pc, slugs);

	var pre_msg = this.buildVerbMessage(this.count, 'scrape', 'scraped', failed, self_msgs, self_effects, they_effects);
	pc.sendActivity(pre_msg);

	var helper_msg = this.getHelpString(pc);
	if (helper_msg && (bonus > 0)) { 
		var bonus_msg = "You got more ice with the help you received from "+this.getHelpString(pc)+". +"+bonus+" Ice";
		pc.sendActivity(bonus_msg);
	}

	this.setInstanceProp('scrape_state', 1);
	pc.announce_sound('ICE_CUBE');

	var growtime = randInt(30, 180); // regrow somewhere between 30 secs and 3 mins

	this.apiSetTimer('onGrow', growtime * 1000);

	if (this.pod){
		this.container.cultivation_add_img_rewards(pc, 3.0);
		if (!this.pod.addWear()){
			this.pod.onDepleted();
		}
	}

	this.removeScraper(pc, false);
	delete pc['!scraping'];
}

function startScraping(pc, msg){ // defined by ice_knob
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
		pc.sendActivity("This is not the ice nubbin you are looking for.");
		return false;
	}

	// Sanity cehck
	this.scrapingSanityCheck();

	pc['!scraping'] = this.tsid;
	this.addScraper(pc);

	var no_upgrade = pc.party_scraping;

	var success = pc.runSkillPackage('ice_scraping', this, {word_progress: {type:"scrape2"}, tool_item: scraper, source_delta_y: 80, source_delta_x: 40, callback: 'onScrapingComplete', msg: msg, no_img_upgrades: no_upgrade});

	if (!success['ok']){
		if (success['error_tool_broken']) {
			pc.sendActivity("Nope! You need to fix your scraper up first — it's almost busted!");
		}
		else {
			pc.sendActivity("Oops, that didn't work. All I can tell is this: "+success['error']); 
		}

		delete pc['!scraping'];
		return false;
	}

	return true;
}

function getDescExtras(pc){
	var out = [];
	out.push([2, "Ice Nubbins can be found in the region of <a href=\"\/locations\/hub-137\/\" glitch=\"location|137\">Nottis<\/a>."]);
	out.push([2, "Scraping this yields <a href=\"\/items\/183\/\" glitch=\"item|ice\">Ice<\/a>."]);
	return out;
}

var tags = [
	"no_rube",
	"no_trade",
	"no_auction",
	"natural-resources"
];

var responses = {
	"scrape": [
		"That's just cold, man.",
		"Ice THIS, Glitch!",
		"I'm cool with this, little bud.",
		"Ice to meet you. Yeah. Ice.",
		"It's a thrill to chill you, chum.",
		"You been ICED, Glitch!",
		"Chill.",
		"BAM! Ice! Whut-WHUT?!?",
	],
	"scrape_2_ice": [
		"Bling BLING, friend! Consider yo'self ICED.",
		"Ice ICE, baby! BAM!",
		"We chill? Yeah. We're chill.",
		"So cold. But so, so hawt.",
		"Izzle to yo scrapazizzle, glizzle.",
		"Ice THIS! (It's ice, you don't have to ice it much)",
	],
	"scrape_3_ice": [
		"Here, catch! Yeah. You caught'a cold.",
		"Didn't your mama tell you not to catch a chill?",
		"I to the C to the E, tinyglitchsta.",
		"You really are a cowboy. Take it from the Ice, man.",
		"Bling bling BLING. You is rich in the chilly stuff, chum.",
	],
	"scrape_4_ice": [
		"Nice, kid. You can be my wingman any time.",
		"Supercool.",
		"Bada BLING, friend.",
		"We the chilliest chilled, amarite? I rite. Ice out.",
	],
};

// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-15,"y":-39,"w":20,"h":31},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAACoklEQVR42t2Y\/UtTYRTHx4goy0Ik\n2tza1n3en91793L3Ys6XrRm5piDKChWcSi79pZR0QUU3EJQKorcf+nN7jiZJhO6n3UOD88vlwv3s\nnOd8z\/k+odD\/\/qtW\/Uu65V\/GDbnmX0ELB9lDDTjdeXUTOaCfCAwQPvx3\/Auwvno4HGiXAlhz+2io\nsX5468GGPwLPzvyJyMyWn5rt+AOhkB\/G0hSR8YV1q1xv6ex4o5J2i09PgxHxlTH1gRBRCxTU82YH\npMxWle01ZdprK5XZZUx+MoA\/IUiKtNEJNmRWysxLavEfzGJbCHvaD4\/Nd4idrzyhVL5DKjx+uNJ6\nnjCl3xZC3MU7YXT+MefpDNoFQqYLS1prnEvEvdk1qZQziRKuvvTitpMdXUkkEhbK0uYmZupS2q9j\nsdgwLjgzDuvLOxbn9nsQaqW8KCppqa10jaq4+wBHCf+OqkEge8WJuSmYIBCGdARVeWGTcYtTc8dz\nmAl8Iw5WMcerzgMg53ITJWC2XHuEGhDkBc4fSkBYswDweB9koosOEGxAtlRrgkBDmZPJJB4NhOkB\nngTGm3YKzzgVn83K30Qj0AAH5T31JABpMrnnuu61wPHA5TU6BwSyB56Ec310cg4h1EdO1Cpjuhw4\n4LGbO2OY4Cz+Po9fTp7JPcdxhgKZIH8A1QG16K5yR\/MgO6fhVRdl2i21GeHfjJFa6Lt3hpsFAFSG\n7LxZ7eQmJ6lpIELYG1GpDPYNsLLRHTzJoHPhgpobu58UIv2WU+n3tYlsu1TQ2lvuZcWCexxjpjYp\nVTv9vWmYeBhVdtH4YTfey9mFprIsNt1nq6mvC52f6SWTBm7RdPh+3zublss3jCemF70XjUYHKJWH\ngehjokfNM2VeiMfjV9HePqRSqYh1xyqc984v8iHBB7smfhMAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-10\/ice_knob-1351290759.swf",
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
	"no_rube",
	"no_trade",
	"no_auction",
	"natural-resources"
];
itemDef.keys_in_location = {
	"c"	: "scrape"
};
itemDef.keys_in_pack = {};

log.info("ice_knob.js LOADED");

// generated ok 2012-11-08 15:15:40 by lizg
