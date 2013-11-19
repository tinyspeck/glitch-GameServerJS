//#include include/takeable.js

var label = "Special Item That Only Beta Testers Get";
var version = "1337965214";
var name_single = "Special Item That Only Beta Testers Get";
var name_plural = "Special Items That Only Beta Testers Get";
var article = "a";
var description = "Best selling toy in a year that the historians have glossed over, sales plummeted when it was discovered that many of the advertised functions of Señor Funpickle could cause injury, death, or severe unpopularity. Hastily rebranded, the remaining stock were quietly farmed out as commemorative free gifts at a time known as \"The Great Reset\".";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["special_item_that_only_beta_testers_get", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: ""	// defined by takeable
};

var instancePropsDef = {};

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

verbs.give = { // defined by takeable
	"name"				: "give",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
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
	"sort_on"			: 52,
	"tooltip"			: "Drop it on the ground",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		return this.takeable_drop_conditions(pc, drop_stack);
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.takeable_drop(pc, msg);
	}
};

verbs.procrastinate = { // defined by special_item_that_only_beta_testers_get
	"name"				: "procrastinate",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Never mind. You can do stuff to the item later",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(pc.buffs_has('beta_item_cooldown')) {
			return {state: 'disabled', reason: "On second thought, maybe you should wait a while before using this again."};
		} else if (!pc.has_done_intro) {
			return {state: 'disabled', reason: "It's too early to start messing with your pickle. Can't you just wait for a while?"};
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.deployItem(pc);

		return true;
	}
};

verbs.ignore = { // defined by special_item_that_only_beta_testers_get
	"name"				: "ignore",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "If you don't pay any attention to the item, maybe it will go away",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(pc.buffs_has('beta_item_cooldown')) {
			return {state: 'disabled', reason: "On second thought, maybe you should wait a while before using this again."};
		} else if (!pc.has_done_intro) {
			return {state: 'disabled', reason: "It's too early to start messing with your pickle. Can't you just wait for a while?"};
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.deployItem(pc);

		return true;
	}
};

verbs.begrudge = { // defined by special_item_that_only_beta_testers_get
	"name"				: "begrudge",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 55,
	"tooltip"			: "Nurse a secret contempt for the item",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(pc.buffs_has('beta_item_cooldown')) {
			return {state: 'disabled', reason: "On second thought, maybe you should wait a while before using this again."};
		} else if (!pc.has_done_intro) {
			return {state: 'disabled', reason: "It's too early to start messing with your pickle. Can't you just wait for a while?"};
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.deployItem(pc);

		return true;
	}
};

verbs.respect = { // defined by special_item_that_only_beta_testers_get
	"name"				: "respect",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 56,
	"tooltip"			: "Treat the item with the respect and deference it deserves",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(pc.buffs_has('beta_item_cooldown')) {
			return {state: 'disabled', reason: "On second thought, maybe you should wait a while before using this again."};
		} else if (!pc.has_done_intro) {
			return {state: 'disabled', reason: "It's too early to start messing with your pickle. Can't you just wait for a while?"};
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.deployItem(pc);

		return true;
	}
};

verbs.enjoy = { // defined by special_item_that_only_beta_testers_get
	"name"				: "enjoy",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 57,
	"tooltip"			: "Experience the pure and honest enjoyment the item brings you",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(pc.buffs_has('beta_item_cooldown')) {
			return {state: 'disabled', reason: "On second thought, maybe you should wait a while before using this again."};
		} else if (!pc.has_done_intro) {
			return {state: 'disabled', reason: "It's too early to start messing with your pickle. Can't you just wait for a while?"};
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.deployItem(pc);

		return true;
	}
};

verbs.infer = { // defined by special_item_that_only_beta_testers_get
	"name"				: "infer",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 58,
	"tooltip"			: "Deduce secret truths of the universe from brute facts about the item",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(pc.buffs_has('beta_item_cooldown')) {
			return {state: 'disabled', reason: "On second thought, maybe you should wait a while before using this again."};
		} else if (!pc.has_done_intro) {
			return {state: 'disabled', reason: "It's too early to start messing with your pickle. Can't you just wait for a while?"};
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.deployItem(pc);

		return true;
	}
};

verbs.admire = { // defined by special_item_that_only_beta_testers_get
	"name"				: "admire",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 59,
	"tooltip"			: "Admire the many aesthetically pleasing qualities of the item",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if(pc.buffs_has('beta_item_cooldown')) {
			return {state: 'disabled', reason: "On second thought, maybe you should wait a while before using this again."};
		} else if (!pc.has_done_intro) {
			return {state: 'disabled', reason: "It's too early to start messing with your pickle. Can't you just wait for a while?"};
		} else {
			return {state: 'enabled'};
		}
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.deployItem(pc);

		return true;
	}
};

function bounce(){ // defined by special_item_that_only_beta_testers_get
	var pc = getPlayer(this.pc_tsid);

	this.setAndBroadcastState('bounce2');
	pc.announce_sound('SPECIAL_ITEM_THAT_ONLY_BETA_TESTERS_GET');
}

function brokenTeleporter(pc){ // defined by special_item_that_only_beta_testers_get
	pc.apiSendAnnouncement({
		type: 'vp_canvas',
		canvas: {
			color: 0x000000,
			steps: [
				{alpha: 0, secs: 0.0},
				{alpha:.7, secs:.5}
			],
			loop: false
		}
	});

	pc.apiSendAnnouncement({
		type: "vp_overlay",
		locking: true,
		duration: 0,
		x: '55%',
		width: 400,
		delay_ms: 500,
		top_y: '30%',
		click_to_advance: true,
		text: [
			'<p align="center"><span class="nuxp_vog_smaller">'+pc.label+'?</span></p>',
			'<p align="center"><span class="nuxp_vog_smaller">There\'s something amiss with the particle accelerating teletransponder… Oh boy…</span></p>'
		],
		done_payload: {
			function_name: 'teleportation_random_teleport'
		}
	});
}

function canPickup(pc, drop_stack){ // defined by special_item_that_only_beta_testers_get
	if(this.in_use) {
		return {ok: 0, error: "The Special Item That Only Beta Testers Get is moving around too much to pick up."};
	} else {
		return {ok: 1};
	}
}

function comedian(pc){ // defined by special_item_that_only_beta_testers_get
	pc.sendActivity("Suddenly you feel overpoweringly witty, like the next thing you say just may be the funniest thing you have ever said.");

	pc.buffs_apply('comedian');
}

function deployItem(pc){ // defined by special_item_that_only_beta_testers_get
	this.in_use = true;

	pc.buffs_apply('beta_item_cooldown');
	this.former_slot = this.slot;
	this.former_container = this.container;

	// Choose a start direction based on player facing
	var facing = intval(pc.s) / Math.abs(intval(pc.s));
	var start_offs = facing * 75;
	this.bounce_dir = facing;

	log.info("Item is facing "+facing+" and starting from offset "+start_offs);

	pc.location.apiPutItemIntoPosition(this, pc.x + start_offs, pc.y);
	this.onDrop(pc);
	pc.sendActivity("You invoke the awesome power of the Special Item That Only Beta Testers Get.");
	this.pc_tsid = pc.tsid;

	this.apiSetTimer('bounce', 1000);
	this.apiSetTimer('usePower', 6000);
}

function giveAward(pc){ // defined by special_item_that_only_beta_testers_get
	this.given_award = true;

	pc.sendActivity("You've experienced every shade of fun The Special Item Only Beta Testers Get has in his arsenal. As an apology, Tiny Speck have sent you this Musicblock.");

	pc.createItemFromGround('musicblock_goodnight_groddle', 1, false);
}

function moonwalk(pc){ // defined by special_item_that_only_beta_testers_get
	pc.sendActivity("A whole new sound, a whole new way to move: do the moonwalk.");
	pc.buffs_apply('moonwalk');
}

function onDrop(){ // defined by special_item_that_only_beta_testers_get
	this.setAndBroadcastState('1');
}

function onPickup(){ // defined by special_item_that_only_beta_testers_get
	this.setAndBroadcastState('iconic');
}

function packExploder(pc){ // defined by special_item_that_only_beta_testers_get
	var contents = pc.getAllContents(function(it) {return it.getBaseCost() > 0 && it.getBaseCost() < 1000 && !it.is_bag && !it.hasTag('element');});
	var contents_array = [];

	for (var i in contents) {
		contents_array.push(contents[i]);
	}

	contents_array.sort(function(a,b){return a.getBaseCost() > b.getBaseCost();});
	var rm_items = contents_array.slice(0, Math.min(5,contents_array.length));

	if(rm_items.length == 0) {
		pc.sendActivity("Hm… that didn't seem to do anything.");
	}

	var item_names = [];
	var plat_point = null;
	var x = 0;
	var y = pc.y;

	for(var i in rm_items) {
		item_names.push(rm_items[i].name_single);

		// Pick random positions nearby
		x = pc.x - 500 + 1000 * Math.random();
		plat_point = pc.location.apiGetPointOnTheClosestPlatformLineBelow(x, y - 50);
		if(!plat_point) {
			plat_point = {x: pc.x, y: pc.y};
		}

		if (rm_items[i].count > 1) {
			var stack = rm_items[i].apiSplit(1);
		} else {
			var stack = rm_items[i];
		}

		// Move it above the platline
		pc.location.apiPutItemIntoPosition(stack, plat_point.x, plat_point.y - (250 + 350 * Math.random()));
		if(stack.onDrop) {
			stack.onDrop(pc);
		}
	}

	pc.sendActivity('They say that a fool and their money are soon parted. If rather than \"a fool\" they mean \"you\" and \"money\" they mean "'+pretty_list(item_names, ' and ')+'\", then yes, they\'re right.');
}

function scream(pc){ // defined by special_item_that_only_beta_testers_get
	var activity = [
		"Put it away, will you?!? You'll startle the chickens.",
		"Squeeeeeeeee",
		"Put that away, you're frightening the livestock."
	];

	pc.sendActivity(choose_one(activity));
	pc.announce_sound('WILHELM_SCREAM');
	pc.apiSendAnnouncement({
		type: 'vp_canvas',
		canvas: {
			color: 0x000000,
			steps: [
				{alpha: 0, secs: 0.1},
				{alpha:.9, secs: 0.05},
				{alpha:.9, secs:0.1},
				{alpha:0, secs:0.05},
				{alpha:0, secs:0.2},
				{alpha:.9, secs: 0.1},
				{alpha:.9, secs:0.05},
				{alpha:0, secs:0.05}
			],
			loop: false
		}
	});

	pc.metabolics_lose_mood(5);
}

function sneezingFit(pc){ // defined by special_item_that_only_beta_testers_get
	pc.sendActivity("You know that those times when you feel like you need to sneeze, but you can't? This is not one of those times.");

	pc.buffs_apply('sneezing_fit');
}

function spammer(pc){ // defined by special_item_that_only_beta_testers_get
	var spams = [
		"Dear $recipient,\n\nI am crown prince of Shimla Mirch who has run up against the serious problem of finances.\n\nWhile my family possesses many wealths, all of these are tied up in the peat trade, which has been experiencing the turbulences. Unfortunately, without immediate access to liquid assets in the form of 50,000 (fifty thousand) currants, we are unable to secure our asset against decline in peat and face insolvency.\n\nI hope to enter into the business arrangement with you, the pillar of communities, against this event. If you can make the arrangement to mail 50,000 (fifty thousand) currants to me directly, I will be enabled to access my vast fortunes and you will be well rewards by the sum of 100,000,000 (one-hundred million) currants in return.\n\nI hope most sincerely that you will consider this offer to help me, my family and my region.\n\nYours truly,\nCrown Prince $sender of Shimla Mirch",
		"$$$ CHEAP RX AVAILABLE NOW $$$\n\nMAIL ORDER PURPLE FLOWERS, HAIRBALL FLOWERS, NO-NO POWDER \n\nFULLY LEGAL* PRESCRIPTIONS** FROM REAL DOCTORS***\n\nTROUBLE PLEASURING YOUR GLITCH GIRLFRIEND/BOYFRIEND/FRIEND-OF-VARIABLE-OR-UNDISCLOSED-OR-UNDEFINED-GENDER? WORRY NO LONGER WITH ALL NATURAL RUBEWEED ENHANCEMENTS.\n\n$$$ CHEAP AND LEGAL* $$$\nCALL NOW\n\n* May not be as legal as advertised.\n** Prescriptions may be scrawled on bar napkins in crayon.\n*** May not be a doctor. Possibly just a piggy we refer to as Doctor Piggles who signs prescriptions (see above) with his foot and actually truth be told it is pretty adorable.",
		"Dear $recipient,\n\nNow is an excellent time to enter the real estate market! Real estate is doing better than ever, with market values improving across the board on homes everywhere from Groddle Forest to Alakol and beyond. Our financial models, developed by a fully-qualified economics undergraduate only minutes before the deadline, indicate that houses will never cease increasing in value.\n\nThat's infinite value!\n\nBuy a house now, and the equity in your home will pay for itself. No income, assets or job required! You don't need to have any money; you don't even need to know what money is or looks like!\n\nContact one of our real estate agents today to get in on the ground floor on this amazing offer.\n\nSincerely,\n$sender, Realtor.\n\n DISCLAIMER: OFFER DOES NOT CONSTITUTE LEGALLY BINDING CONTRACT. BENEFITS OF OFFER NOT GUARANTEED TO BE FACTUAL OR EVEN POSSIBLE. THE AGENCY PROVIDING THIS SPECIAL OFFER ACCEPTS NO RESPONSIBILITY FOR ANY DAMAGE IT MAY CAUSE, INCLUDING BUT NOT LIMITED TO THE FOLLOWING: PERSONAL INSOLVENCY, LOSS IN STANDARDS OF LIVING, LOSS OF HOME, JOB OR LIFE, POLITICAL INSTABILITY, MARKET COLLAPSE, DESTRUCTION OF THE ECONOMY, PLAGUE AND/OR FAMINE, NUCLEAR PROLIFERATION AND THE END OF LIFE AS WE KNOW IT."
	];

	pc.sendActivity("All your friends have received some very special mail from you.");

	var spam_index = randInt(0, spams.length - 1);

	for(var i in pc.friends['group1'].pcs) {
		var friend = pc.friends['group1'].pcs[i];
		var this_index = spam_index;

		if(!friend) {
			continue;
		}

		for(var j = 0; j < spams.length; j++) {
			if(friend.mail_has_spam(this_index)) {
				this_index++;
				this_index %= spams.length;
			} else {
				break;
			}
		}

		var spam = spams[this_index].replace("$sender", pc.label);
		friend.mail_send_player_spam(pc.tsid, spam.replace("$recipient", friend.label), this_index);
	}
}

function tryAddToPack(){ // defined by special_item_that_only_beta_testers_get
	var pc = getPlayer(this.pc_tsid);
	if(pc.isMovingToNewGS) {
		log.info("Player is moving to new GS. Rescheduling BETA PICKLE.");
		this.apiSetTimer('tryAddToPack', 1000);
		return;	
	}

	//var s = apiNewItemStack(this.class_id, 1);
	this.setAndBroadcastState('iconic');
	var remaining = pc.addItemStack(this);

	if(remaining) {
		// Creation failed, reschedule
		log.info("Beta pickle add failed.");
	//	s.apiDelete();
	} else {
		// Creation successful. Copy powers
		log.info("Beta pickle add successful.");
	/*	s.powers_used = {};
		for (var i in this.powers_used) {
			s.powers_used[i] = this.powers_used[i];
		}
		// Delete this item.
		this.apiDelete();*/
	}
}

function usePower(){ // defined by special_item_that_only_beta_testers_get
	var pc = getPlayer(this.pc_tsid);

	if(pc.isMovingToNewGS || pc.get_location() != this.container) {
		this.tryAddToPack();
		return;
	}

	var powers = ['moonwalk', 'comedian', 'sneezingFit', 'scream', 'brokenTeleporter', 'packExploder'];
	var power = null;

	if (!this.given_award) {
		power = choose_one(powers);
	} else {
		var r = Math.random();
		if (r <= 0.3) {
			power = powers[0];
		} else if (r <= 0.6) {
			power = powers[1];
		} else if (r <= 0.7) {
			power = powers[2];
		} else if (r <= 0.8) {
			power = powers[3];
		} else if (r <= 0.9) {
			power = powers[4];
		} else {
			power = powers[5];
		}	
	}

	if(!this.powers_used) {
		this.powers_used = {};
	}

	// The spammer functionality has been removed
	if(this.powers_used.spammer) {
		delete this.powers_used.spammer;
	}

	this.powers_used[power] = 1;
	if(num_keys(this.powers_used) == powers.length && !this.given_award) {
		this.giveAward(pc);
	}

	this[power](pc);


	this.in_use = false;

	// Pick up the item
	this.apiCancelTimer('bounceDirection');
	this.apiStopMoving();
	this.setAndBroadcastState('iconic');
	var remaining = this.former_container.addItemStack(this, this.former_slot);
	if (remaining){
		remaining = pc.addItemStack(this);

		if (remaining){
			pc.rewards_store(this);
		}
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"collectible",
	"no_auction",
	"no_donate"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-37,"y":-51,"w":74,"h":51},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMSElEQVR42u2XCVAUdxbGOymTuNEE\nTBSiiRkBFVAUOUU0TkyMR9Z4YAhqVBIP8EBHwyVBHDDKDcPlcDPAcAwDw8wA43BOc8g9HAKCKEIu\nDUk26WyO2trN1n7770ZJzGaTuJtYqa3tqldUMV3Vv\/7ee9\/3b4r6\/3X3lVrT9GzTwLVX2JLUdzjQ\nY2NTfzdw6bVtxq1Do9njnzPdXdffzYtVVHu3DI7u\/V2pN\/jeLdXo+Cc1ohLtW2EFZce03Vdi7xvA\naLMNb7jZVshVk431D3+X1F56rmXoelZT31AaCxdRpDkurW8Lui9wN\/R2Blcv2TLDzXaYrEu2ou\/f\nU9DSZ1FUqcvJlis00XmlIQmqOt+ay1eP3BfA6y02fBZKX26FduUiFL8zB\/W5C9GhthJ8\/74cdWVO\nojh1VJyTX6Fq6\/e9Oj5uct8AK+J40CaZcGD12fPRqVqE7vLFzPWGpcKx5mXCm83nhW3FOcNlJVEj\nzf2D4nFg2n2bv8bc+Xxd1nxc1lqh66IVdDILqNIWICvSZLKGi2PRG3oUPdlxGKxxYZhBB8F9gfv8\nhp3B+23LlIM6a3RULEFtoSWaVYvRX7cU3dol6NQsQaV0OT6qKcaHOjWa4s7gYuxqXGtaJvnN4b4e\ndbT+0xXHnvc77THYYIPB+mW43myD\/lprqMLs0F5mhRblYvSF7AbTUYeu8OMo9HoN9RJH3GixoX9T\nOHxuZ\/DN6AqGuboct3ocMFxvg44ye\/RULsUlxWKMxLyC0lhzqEmruyRe+KShDPrUMNSl+GAgaBPa\n0uwk+Fxv0Bpx0r147zrhZL2xTnJuvb3ovwb89qaz5O83V+LLESd83OeAFrE9LketBS2zREmyCXIu\nzERC9GNITnoUdeWuuKKLRk2EP2QhztBlWDHiWF\/+zcu0UH3MFXL3dZOV5roawS\/Z4WfU8TD46oM9\n\/Gr5CsGN1heEvdUr6N6alZLvfnfm\/eOjlWDrWrMT19beqqUcXEbkMygqfhS1DVa41O6IimpDpOVR\nSGVLMgXZScaM7Iz5Fr33Rnqk7SKTffjVnqRtK+mEbc49bMVtXUEHr7X76fZXyxwEVxts0VdjjTa1\nFeoKLFAttUBdoZWQA\/x4pfs\/xleO\/e0DZ2jOrkZ7tg1ayWLkxpgiIe5hNLU6oVW\/BsryxyFXTUVm\nAQWpgkJ8OoWYFAqhAVP5Q0Uiob66CPfcur+M7uI1llpzinQQ42Xn6aJkYpbU6QuZOoUN7w7k1zec\n0JXhCH2WI5pKFkEqnkvUo1Cqns4BykqmIK+IgrrCFmUaZ+TIpiNKTEEYQY0NNKpE+qoi5b3B3drF\nG+97UdJRYcXBsQ\/VEdvQZC2ELN4MBSJTaCQWwjv399fxmV6tNbe1V5p98dmtIYwMtKBcY39bQUMM\n9+Xjq8\/eRXdbNUrlwUjJnYrQeAr9DUroq2X35oWfXN1Cv99px3oUZw9sa7XZ5lClLoA02hQZ53mo\nzDGfnI8mr7XK5qDVkkGdDT8rORIX4sMxcqUF+fm7OMAixRTcHOmELDcF3ieOwOvQGwg+Nw\/FxS+B\nbW93nYJ3D7bhatCnc8Zoqy2GiJ\/picHegZMnmiE3ygRJQXPJ\/yy5udF72BlE+q4SCH1nSTw8Zhi4\nvLIOLps3gtbKkJm+DZWVi1FS+iCGe+ogy07E5pdfgs\/xg\/ALMkRfUxY6q2Rj33++RmHJk5NEShPP\n4\/8oIDO2h99dxapnQ5ZjYv7YrZQnzifqmXDqJQTORUXmQg7wiudyZe+RVQj18YLH8Vk9hZkxorjw\nQDRX5+LDkXgochejoXkW5PJVaKcVkGcnQJLmgyQxmUdFIeQ5YXdtan31SqakYAGyU00RE\/4M7e8\/\nw+BuwOt7+JdrHTBQZ03ydAnXYnb+2OXIjjBBcvCziPV\/BnmxZviqy1kydNgJHfvskSLYg8MnDFGh\nptyv9R7BF+NpwF\/bMNR5BrW1C1AoewDpORSiLlCITaWQVTgd6hI\/CHxm3wXYQvOhLjZHXpYZUhJ4\nOO33lPAHmepqcKXBAe912HEb3CBfNNniwjhTpJ7lIdL7aa6+Hd+HrogXUey5FqLTu3HgqAGjUVGS\n7qZ5+PTaa\/hkyJXUdrSULsMpr2lkeynI1BQSMyiIsynkS59GYbYZk3FhHp0SP3eLRrlK0FS7HFql\nBeTSBcgUm+BMwGzmLsA+3UY+lwzXnfBRrz3JSltcrp4AZVVkZ\/DCmWe5jR5tfxFfvnsQnbo3cPqM\nEfYfNlQSwLF22gjvdlrjg54VqM23xFuChxBHlGONWkLsJklCIbtgKhpr16C+yh7tjc+ho2k9Sgps\nkZmyBHSVA5SyhZCkmCDAx\/huj9TkOwu\/\/dAZXwwvx81ueww3TiwKLVuE8owJm2GriMxkgciMjIAV\n3u\/cj4+veuDs2SeZcqKQJt8IYYEzUJT+DMoy5iEmgUJe8e0UuV1FJcZo1vHRRRJIf8kaWpUlJKkT\nQCUFa5AhNkdw4Gyc8ja+O02Ykd0ChsCx4c9azSC9jAt+NiFq8y2gEJtxhn322ByEnDTqyYgzR2L4\nbHRXb0Ja1Fyo1FOIIZtCXvIgKQpnhQ8jKfkBSGTfwbGtzsh5HF2tm9BKL0Ffhw1RcjHOC+fA39tI\nyS5GR4svv7sjgK\/RuPD+JUHGB15k2HT4+sYKfDM60eorumWkzZZQpsxHeaaV0p9YSuC5qbyAoOk4\ndXo6igrnopfegE56E5pb5qBAPgUyolo+aalMcbd6WXkzEB6zjrTYBfI8M\/i\/ZXS7nkT0udk\/74ls\nmzG+Cmyx7f50wJHb6qpcc5IgC8fkqXaTq+8fZCpJTH6IUVVQqC63wDvCaajRkJdQzUK+fAIu43YG\ns\/MXET8HEZFv41y4G3wDp9MdjRuZ4MDHCdxjZGMfYX6RWb\/X4yq42bscdyBZQPawUC9fwlRKHa13\n7drFO3HihPDUqVNj6enp0HddxOX+lSgsfpjLYFa5MsU8VJVZQ1Y6oVoJeYFwMoshERROh1IQnKLg\nupua36RbbN3e5CIszFktTIgxsf7FifLnMTfB16Pr6Vt9zzPDTU5kkx1ofY2pwbloS975SCv4+K1C\nQEAAGhoaMDAwgP6BTihU5igkqrHKsYcDhXI6ysiBI7PgEQ6SncNo9pAQSeG1PVT8r3JivjXowhvt\n3jb5ZupaiimrIQqRKix9CL6+R9HZ2Qm9Xo\/GRi2Bm4YComBxGbGV\/An1VHI7lCpMIc6icE5EwcuH\nYjZtomb+6sf7mhrKoKyWQnndg2D\/qqqIp6UaITw8HDRNQ6vVolQpgvLixNzdWYqImCmIPU2+k6VO\nCAh+BPuOUMJ7enBnzbktqih3Rh60HaF+25EU8SadHuch6W+IFNwaTJrcqsaW+fyevrVITFpCoori\nIFklvf2IyZaUkLyVQyqVIj13GcQk1hKJYqGhjyDQwxhBnk8h+KgJ1Jmb0aDcLQj3+EHG\/tSlzhRA\n7\/U8Rvw2oPv4GpQdWo0cwXpEeG9FZpwn9LVh9NUOEdPbGIH6ciFk6cexa48hB6jQkrlKfBrx8fHI\nzMxEUlISokRr8U4MBT\/vPyDI4ykE7DdG4EECeHg2B5pwxgmlaW7QFhwVhXgab\/lZwJLoN8e0O4nP\n7bVFxwFHDHu\/hP5jfLS+aY9LqYcw1p2IweZoFGUIIHpnD2LI56PnQQsk53w3Z4Gn30J0dDRCQkLg\nd2orpMSkff2nwNvdiINkAU97TECK3rZBWvh6iM9vQKSfDQe9c6Mh\/98Club4bElYv1CZ\/LI5pFsW\nQbPDGvQeW7DQfQ0RyEo4hHSRB3KSDo+VXbQYOx\/zKMLiH4KikmymfKJ8\/Dbh0KFD2LFjBw56rkFE\nEoWTb1PYunUKc8DlSebtA8YcHFvRfouQHf86YkNccdLdBO6bnySAM3p+VsnwtaYGoc+buYeuMe1J\n3LAQma9YQiX1QZCPC8KCdiA\/xYtmF0VdR9FlOhJZiongjyMfQfsOrIObmxtX+z1t4HmC6tl\/hBLs\nP0rxXNfOMHj9jzPok7uNIDw0oeIZopr3XiMc3D6TwD0Bt3WG1ve0OKFr5vHDXjCVaKTeiA91hzhq\nHwpSj01+SBNAvlpHbYlJpoRHTvCUO3fupNny8PAQ+vv7\/+gCuK03FBxwmcm1nIU84jaLg9u5wdD9\nP7YWeaqHQUHaMX5exlHer2FVrFLum5\/o8Xx1QrkdG54QUr\/Hi1WTAIqo\/4Xrn\/MkUbm7zjAEAAAA\nAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-03\/special_item_that_only_beta_testers_get-1330717625.swf",
	admin_props	: false,
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
	"collectible",
	"no_auction",
	"no_donate"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"e"	: "admire",
	"g"	: "begrudge",
	"n"	: "enjoy",
	"v"	: "give",
	"o"	: "ignore",
	"c"	: "infer",
	"t"	: "procrastinate",
	"h"	: "respect"
};

log.info("special_item_that_only_beta_testers_get.js LOADED");

// generated ok 2012-05-25 10:00:14 by eric
