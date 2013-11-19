//#include include/takeable.js

var label = "Musicblock DR-5";
var version = "1347492224";
var name_single = "Musicblock DR-5";
var name_plural = "Musicblock DR-5";
var article = "a";
var description = "This friendly little tune reaches into your brain and scratches your hypothalamus. Tickly.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 700;
var input_for = [];
var parent_classes = ["musicblock_d_red_05", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_dr",	// defined by takeable (overridden by musicblock_d_red_05)
	"music_duration"	: "14000"	// defined by musicblock_base (overridden by musicblock_d_red_05)
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

verbs.play_for = { // defined by musicblock_base
	"name"				: "play for",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: true,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 53,
	"tooltip"			: "Let someone else listen",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_msgs = [];
		var they_effects = [];

		var targetPC = pc.location.activePlayers[msg.object_pc_tsid];
		if (!targetPC){
			pc.sendOnlineActivity("Hey! Where'd they go?");
			return false;
		}

		var context = {'class_id':this.class_tsid, 'verb':'play_for'};

		// Start overlays
		var duration = this.getClassProp('music_duration');
		targetPC.apiSendAnnouncement({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: duration,
			pc_tsid: targetPC.tsid,
			locking: false,
			dismissible: false,
			delta_x: 20,
			delta_y: -120,
			width: 60,
			height: 60,
			uid: targetPC.tsid+'_musicblock_self'
		});

		targetPC.apiSendAnnouncement({
			type: 'pc_overlay',
			swf_url: overlay_key_to_url('musicblock_notes'),
			duration: duration,
			pc_tsid: targetPC.tsid,
			locking: false,
			dismissible: false,
			delta_x: 140,
			delta_y: -100,
			width: 180,
			height: 180,
			uid: targetPC.tsid+'_musicblock_notes'
		});

		targetPC.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: duration,
			pc_tsid: targetPC.tsid,
			delta_x: 20,
			delta_y: -120,
			bubble: true,
			width: 40,
			height: 40,
			uid: targetPC.tsid+'_musicblock_all'
		}, targetPC);

		if (!targetPC.musicblocks_heard) targetPC.musicblocks_heard = {};
		if (!targetPC.musicblocks_heard[this.class_tsid]){
			var xp = targetPC.stats_add_xp(50, false, context);
			they_msgs.push("Totally fresh tunes! Rad!");
			they_msgs.push("It was generous of "+pc.linkifyLabel()+" to share some new music!");
		}
		else if (targetPC.musicblocks_heard[this.class_tsid] < time() - (30.5 * 24 * 60 * 60)){
			var xp = targetPC.stats_add_xp(100, false, context);
			they_msgs.push("Good tune! It's been a long time since you've heard that one.");
			they_msgs.push("It was generous of "+pc.linkifyLabel()+" to play it for you!");
		}
		else if (targetPC.musicblocks_heard[this.class_tsid] < time() - 14400){
			var today = current_gametime();
			var today_key = today[0]+'-'+today[1]+'-'+today[2];

			var heard_today = 0;
			for (var i in targetPC.musicblocks_heard){
				var last_play = timestamp_to_gametime(targetPC.musicblocks_heard[i]);
				var last_play_key = last_play[0]+'-'+last_play[1]+'-'+last_play[2];

				if (last_play_key == today_key) heard_today++;
			}

			// you get 10 XP for the first time you listen to a block on a given game day 
			// and 5XP for every subsequent listen to any block (other than ones you've already heard that day), 
			// up to 8 more blocks (so: 50XP per day, just from block listening, 
			// if you can come across 10 different ones)

			if (heard_today == 0){
				var xp = targetPC.stats_add_xp(10, false, context);
				they_msgs.push("Ah, first dose of music for the day!");
			}
			else{
				var xp = targetPC.stats_add_xp(5, false, context);
				they_msgs.push("Haven't heard that one yet today!");
			}
			they_msgs.push("It was generous of "+pc.linkifyLabel()+" to play it for you!");
		}
		else{
			they_msgs.push("Good stuff, but play it too much and it gets stale, you know?");
			they_msgs.push("Still, it was generous of "+pc.linkifyLabel()+" to share their tunes!");
		}

		if (xp){
			they_effects.push({
				"type"	: "xp_give",
				"value"	: xp
			});
		}

		var mood = targetPC.metabolics_add_mood(2);
		if (mood){
			they_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: mood
			});
		}

		var energy = pc.metabolics_lose_energy(2);
		if (energy){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: energy
			});
		}

		targetPC.announce_sound(this.class_tsid.toUpperCase(), 0, 0, true);
		pc.achievements_increment('musicblocks_played', this.class_tsid);
		targetPC.achievements_increment('musicblocks_heard', this.class_tsid);
		targetPC.musicblocks_heard[this.class_tsid] = time();

		var quest_play_musicblocks = pc.getQuestInstance('play_musicblocks');
		if (quest_play_musicblocks && !quest_play_musicblocks.isDone() && quest_play_musicblocks.canPlayFor(targetPC)){
			pc.quests_set_flag(this.class_tsid+'_played');
		}

		var pre_msg = this.buildVerbMessage(msg.count, 'play for', 'played for', failed, self_msgs, self_effects, [], targetPC, 'for');
		pc.sendActivity(pre_msg);
		var pre_msg = this.buildVerbMessage(msg.count, 'hear', 'heard', failed, they_msgs, they_effects, []);
		targetPC.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

verbs.play = { // defined by musicblock_base
	"name"				: "play",
	"ok_states"			: ["in_pack"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_single"			: 1,
	"is_default"			: true,
	"is_emote"			: false,
	"sort_on"			: 54,
	"tooltip"			: "Enjoy the tune",
	"is_drop_target"		: false,
	"handler"			: function(pc, msg, suppress_activity){

		var failed = 0;
		var orig_count = this.count;
		var self_msgs = [];
		var self_effects = [];
		var they_effects = [];

		var context = {'class_id':this.class_tsid, 'verb':'play'};

		// Start overlays
		var duration = this.getClassProp('music_duration');
		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: duration,
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 20,
			delta_y: -120,
			width: 60,
			height: 60,
			uid: pc.tsid+'_musicblock_self'
		});

		pc.apiSendAnnouncement({
			type: 'pc_overlay',
			swf_url: overlay_key_to_url('musicblock_notes'),
			duration: duration,
			pc_tsid: pc.tsid,
			locking: false,
			dismissible: false,
			delta_x: 140,
			delta_y: -100,
			width: 180,
			height: 180,
			uid: pc.tsid+'_musicblock_notes'
		});

		pc.location.apiSendAnnouncementX({
			type: 'pc_overlay',
			item_class: this.class_tsid,
			duration: duration,
			pc_tsid: pc.tsid,
			delta_x: 20,
			delta_y: -120,
			bubble: true,
			width: 40,
			height: 40,
			uid: pc.tsid+'_musicblock_all'
		}, pc);

		if (!pc.musicblocks_heard) pc.musicblocks_heard = {};
		if (!pc.musicblocks_heard[this.class_tsid]){
			if (this.class_tsid == 'musicblock_sb_secret_01'){
				var xp = pc.stats_add_xp(1000, false, context);
				self_msgs.push("You feel the oneness with the Giants, harking back to the time the world was imagined.");
			}
			else{
				var xp = pc.stats_add_xp(50, false, context);
				self_msgs.push("Totally fresh tunes! Rad!");
			}
		}
		else if (pc.musicblocks_heard[this.class_tsid] < time() - (30.5 * 24 * 60 * 60)){
			var xp = pc.stats_add_xp(100, false, context);
			self_msgs.push("Good tune! It's been a long time since you've heard that one.");
		}
		else if (pc.musicblocks_heard[this.class_tsid] < time() - 14400){
			var today = current_gametime();
			var today_key = today[0]+'-'+today[1]+'-'+today[2];

			var heard_today = 0;
			for (var i in pc.musicblocks_heard){
				var last_play = timestamp_to_gametime(pc.musicblocks_heard[i]);
				var last_play_key = last_play[0]+'-'+last_play[1]+'-'+last_play[2];

				if (last_play_key == today_key) heard_today++;
			}

			// you get 10 XP for the first time you listen to a block on a given game day 
			// and 5XP for every subsequent listen to any block (other than ones you've already heard that day), 
			// up to 8 more blocks (so: 50XP per day, just from block listening, 
			// if you can come across 10 different ones)

			if (heard_today == 0){
				var xp = pc.stats_add_xp(10, false, context);
				self_msgs.push("Ah, first dose of music for the day!");
			}
			else{
				var xp = pc.stats_add_xp(5, false, context);
				self_msgs.push("Haven't heard that one yet today!");
			}
		}
		else{
			self_msgs.push("Good stuff, but play it too much and it gets stale, you know?");
		}

		if (xp){
			self_effects.push({
				"type"	: "xp_give",
				"value"	: xp
			});
		}

		var mood = pc.metabolics_add_mood(2);
		if (mood){
			self_effects.push({
				"type"	: "metabolic_inc",
				"which"	: "mood",
				"value"	: mood
			});
		}

		var energy = pc.metabolics_lose_energy(2);
		if (energy){
			self_effects.push({
				"type"	: "metabolic_dec",
				"which"	: "energy",
				"value"	: energy
			});
		}

		pc.announce_sound(this.class_tsid.toUpperCase(), 0, 0, true);
		pc.achievements_increment('musicblocks_played', this.class_tsid);
		pc.achievements_increment('musicblocks_heard', this.class_tsid);
		pc.musicblocks_heard[this.class_tsid] = time();

		var pre_msg = this.buildVerbMessage(msg.count, 'play', 'played', failed, self_msgs, self_effects, they_effects);
		pc.sendActivity(pre_msg);

		return failed ? false : true;
	}
};

// global block from musicblock_base
this.is_musicblock = 1;

function getDescExtras(pc){
	var out = [];

	// automatically generated source information...
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/musicblock-dr-collector\/\" glitch=\"external|\/achievements\/trophies\/musicblock-dr-collector\/\">Musicblock DR Collector<\/a>"]);
	return out;
}

var tags = [
	"musicblock",
	"collectible",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-37,"w":37,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANzUlEQVR42q2Yd1RUdxbH5889ZxOV\niMI0StYUXWMs2WgihsRVQY0CIjZAlF5ERBNjRwUBURkRpEgVhjrK0PuANFFQrERjQ6MxliQm2Ww\/\ne7577w\/fRAbN2c0J53zPb4Z5897nfe\/93XvfyGQmf7GzzIY3BI2x79sxzqlvy7iIKxvfjLi04XX9\nRdLp4FcjukidgTZC7aRWf5KfTVizn429pAY\/lb3BR24t+63\/Hu6d6HVj9wTciZyAy5vGomvtGJwi\nXVz\/Os4\/VWuADTqDbNERaIs2UmuALU7426CZZPCzQROpwdca9T7WqCXVeFujerUVKknlq6z6y1ap\nW0q9VC3HPVUtx0g6T5VGu1zplbHoF26IXbu95+1ztwju4uaxOBk+Bk1BNqjxs0LZahXaQl8V4vf6\nVUo0BBJAgDWOeynRTLAV3mrUis9UaKQbKKe1crUadX7WKF2pQrU3w6lR5qVmSOhpLV2pxnGSzlON\nEg8VikiF7qqW+AXm9kMAH+ydrP8qdhJaCYLBGMoUsHWNLap81QKqjuDq\/K2hW6lEU7AtyrwJgo4t\n9lSgPtAGhR4KlBJkLbla4C6n81ijhEBLCY5XHYEVu6uMgIUrlMheqkD6Yjli541C9FxzPZsm4B7H\nTbK\/FzORAAYcMgWs9FELuBMkfi0ACa6WxGCNdFzJSgVqCZph6snBQncFjnmpUEPH5K+Q043ZoMiT\ngCjMhbSWUwoUEdwAzPMV42geMeBe3OTsrvWviZAxUPMWO5xICkFX2lp0pISiM3UtejLWkcLRmbYO\nbSlh6EoPxylS6yE\/NO90RNXmWWjdNVesLfS+YtOfUbNlFgwRDtCuUKCSAdk5CnOBpxJlPnxzBE9h\njSGYPY5DFeVg\/kS4SO71Mxhrp4M5ynM1uNRtQN+ZZlzpPYGrva344nw7rl3owPWLnbhxqRM3L3fi\nVt\/JIeL\/8+d8HB\/\/xbk28f3Pz7aguzoLTfHeKPR+TcCVkvIotJqFoxHFQM9RpONIL9mNnW8JuLiP\nR8P3I9tBcHwBvpAE1f95F25fOYU7V08\/V\/wZHyPBMijfHJ+Hz8fn7W0rR2OUM4XbGrnLFchYYkmh\nJkiHUUMUOcdcL+vbOk4A+r07DBvdpv0MRyeWHOMLSmB3r\/Xg3vUzQl\/d+Fn8nj\/78otuIyx\/j78v\nuSlBXuioQP2mGThKgOlulkilzRFJ0TPVboeR\/bLLW8eK3bli0kvYtHSa0TmGk1yTwBqqimA30w7p\nafHwD1qFjCPxSDi4BwXaFLGebClHQ3UROprLUVdZ8FxIDvflHgN6Kw8jz12JIwSYsURJMObPlax7\nw2uiJHhMfhlblr1nDKspHLt08kSFAMs8ohGgAUGrn7vyMbzy9\/j7z0JKOcmpVL99jnAvc6mScs4c\nu+YMlewU7eAKKh9eU17G9uXvi9DyyZ6Fu3\/zLL7uPwdDnU5cODsjAYHB3ujpqMW3dy\/jc7roiYZS\n8b65\/hgKtanCUb6pZyGlnJRCfZqqQ4qrnBxU0M59ASCXmHLqBKvfGYaIFdONoeXwSM4x3MPbF9Dd\nXiPAcjITBGi7oQw\/fH1F6Pv7n+O7e5cF8OM7l\/Cg\/zzu3+oV3+e85PPxeZ8N9dmscCQvskQ6AVJZ\nwc7ZQyXjQqunwuxDm2Snx\/RB7nHi80X4YnxRdonBjmYlIijEB+e7m\/CXR9eEfnz4hQB98lWfgHx0\n5+IAJLnP53mei2ezw3HY1RJpbgqxKSJmD5WsgVoT56Df1OHY7WlndI\/vWnKPL\/bNl5dx9mQdgXkj\nNydJgHa1VeFv394Q+unx9UGQfDy7zt+XXOQbfzYXe7PXI5EcTKYw76Zw7pg1cohkdQEDgIHThuNQ\n+KJB4eW7l9xjV9oNegGmPXoYwaG+iI+PREioHwryUpCWuh96XTZSDseJcJu6yOd7NszPAh5yscSB\nhRbPBxS900OJ4PdGIHdP8AsBOb\/OnapH0BoflB3LITBffLY5TACHrPUTa\/AaX7Gyi3y8MRdNAEWY\nKQ97c9YLuISngNsJyFQynjjSFltgzfQRyIs2AeyuGQTIF+Z845D+48kt\/PvHO\/jPT3dxl0J4ur0a\nB\/bvFjfAN9LaWDoEkPPQFDDB2RIaZwvsX2CBbX8eOUQyHoVSKVHD7MygNQF8HOKIh3V5xhBz6DjP\n\/vrNdfz9u5v45\/f9+NcPt8XK74MJjh3kPOX1RQ4aQ0yAGicLoX0EuJWATCXjUYgBw2eYIT8m2LiL\n756swrezVXi0w8u4STj5JRcZkp1kMF75\/f59u8Tujtu7Q5Qj\/t6Vpg701bcOKTU\/56AC8QstaRaw\nwJaZI4dIVkkjegoBbvjADAUEyPZzOXiwzUMAsh70dRhdlCDZSanESGWG4dg5huOV3avdWIrUSWmo\n3nAMGXYZOF1YbywzDHjIRUFhVohhZcvMV4ZIxsMjA2788BUUSoA9Dfhm4etGwIcJn4qSIUFyPnK4\npSItFWrJueL8IziUEC1KTM2nx1HzyXHhXuuhSlSEl6BHXz9QqKkOMlyiywDgZgIylYyHRwbc9BED\nBom7+zJpqxGO9c3SyeJiN8lZbmV3rnYLUAlW6iCSc1JP5twrdM0T7kk1sOVgBVImpopWx53koBMB\nLlJiLwEyg6lkPDwyIMc7LWyuyI1HSyYNAmR9fewwGmuLxYW5J3N+sdhV6XVMzHYBFx29Ff6Bq8TG\nYLiCRbnG3dusKadnkFwx0ZzJWod4JzmSCDCWAD8jIFPJeLLNpF64nXZMnNubuNpYjLs7ffEgcA4e\nek03Aj4KdsC5rgYkaKKoxTUKR00lTTEMxyuXlaoNOlSuLzG2uOotOuQ55dCEXYuezHU4QICHF6sQ\nO58AKc1MJZMmW54cuPfpIj3Q21mHC12NdJfNNKnw8MrzYYexBNVXFQqArVvXC5j01AM4SOD5R5Oh\noe6SR60wnmoihzXf5ajIO4bj6DQd0KNweS5ac8rRnRGGfQvlSCAHYwiQ94GpZDp6FMxZpqBcsBCQ\n3LTzP3VEe2UOetqqcbajDudONuDC6QZc6mkSyc2Dq4+fJ0LD\/AWor\/\/KQevAs8nAo0LFuhJonY+K\nXduZVwWdjxbVu0rQVVGF7vS1VP8IkDZJzPxR+PRDsyGSlXhZIZsAs5fRdEuTbSQ\/CzgMPFklrhiL\n9KAZKNrpDv1efxiORuFEUTzOdNSg9ySDk9OnGmCoLYGuMB1pKfsQQ\/l38XQTyUCfNaF0TQGSaVOU\nbyxEsXceilbnoqOsAj3UedpiXRC3gEZ+um40PYJ+Ym82RLJiAsyiiZanWq27Wjxt5dPDNCuD\/pe0\nSG6EZvFj4j5K6MQltsgMIfiti1AW54\/6I1vQUhCPzrpinGqpFOpqqRBqq9Kj6agOdanFMBTr0E5t\nsLVKi8qQcbR7LZHi9guABZ5WT\/iZIGu5Eu2JY2HQvIH6yDFIW6ISY5COcvQYSe9jI9Y8jwF4Btc4\nWQ6CZ\/AD1LJ4QskKsUNu6AyU7fU2Sh+7GsWRXijY7YWaHXMpYvRcPJ\/GLdoke+jGuVmYSpbvoW7h\nkbvv2CQ8uTwd3\/U5oyp2LLbTswL3x5wVajqBQoQ\/a7la9M1UGjC1npS79L6UwLUEXbKKNpu7io5X\nCfiYuaMHwQ\/cgIX4\/DhFqYhyP2a+nJyTU4hViCLA9QRkKpnWXaXRBlrhfte7uNv2DvoNU3C14WN0\naP+ICIfRyCaIJHIylcKQuUxFdcsSh6l\/pi9V04hEr12Voo+muKmQspgvNJqOVyCLQXxsKQI20HmT\n+6T8lVa0IeQ46EK57miBPQS3Z54lcii1ouaa0zwwYpDW2Y3opxCr7LVBVrheMxFXyibgku4t3O5c\nia6i8YiYM4qgBsLJgBlPobg9HVmiRsw8C9EF9lOic7FNJkjekXG0M6McR4sNkEDu5wRbIT+Ucj1Q\nRY5ZIt5ZhV0OFgRFKULiG48kwHUM9azsRujF7zOZyxQRHUlvoCf7TVwo\/ggtKe9gNw2xO2aPEl9O\nJpeSFysFFMNwe0p1UyOa3OJmz93gIK1J5GCSqwqJdPw+Oq7p0FiRNqy+6vnoq3gLGh8rKs5K7Jxj\nIeAiHS1RRBt1Fz3VrbUbYaow409w2R6KiMqIV\/srY8dTy7NG0PRRIpzsGsNxQ2fAA1RYGUgKJ4Np\nnromwR0iN\/n\/Nxqn4MHpqbjX8Sd8d+0T3DRMRKt2PMHIqSmMFnC7SVUBtgj\/YAQNzcMHKeT93w3+\nUbPEzWx47DwLp82zLDSHXVUtHE6G4jyTXGO4+IUD7YkB4yncDBRN4eaVu0KCi1Lk2e3mKbhZPwnX\nqiaiv9UJfTXzUUuR2jFHLkLMLvKxFTTVB78\/3ETDsv+nn4WPuKnsaaiMOOgs1ye7qp5w79xPgBxO\nzsF4Z7kAi6TCLoFpKMc4z7oyxuFi8Xic047DnQ4\/NCdNwd6Vcmx7Crht1mjoaWDOpBIX9N4wowKn\nDev3nyIb\/qt+x46aN8I60VUeRrtbf8DJsp83BbvGbu5boBBgLM6z+KUKtCa+hq70CbjS6EGAb8Df\nfhRVB0uSBY4sVcEQ+gd8NtMMAQQmRHAB7\/7+7d\/sh3dDiK11dYCNE9VFDUG35HpYUV1T0xCgFDkW\nTZ0ih3I6OdgaIbMtsO4DKubOSpRQLWS4aOrBftOGwZfA\/KYOC\/vVzv0\/f82hNvZNa14NK\/Oz0eu8\nrfu5MHMoS325Jlqj0IsKvgs9JM0yO+c79SWNz7SXvV50rv8CZ2J55IflymQAAAAASUVORK5CYII=\n",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_red_05-1334256943.swf",
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
	"musicblock",
	"collectible",
	"no_rube"
];
itemDef.keys_in_location = {
	"p"	: "pickup"
};
itemDef.keys_in_pack = {
	"r"	: "drop",
	"g"	: "give",
	"y"	: "play",
	"o"	: "play_for"
};

log.info("musicblock_d_red_05.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
