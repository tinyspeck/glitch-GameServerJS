//#include include/takeable.js

var label = "Musicblock DR-2";
var version = "1347492224";
var name_single = "Musicblock DR-2";
var name_plural = "Musicblock DR-2";
var article = "a";
var description = "The bestselling theme song from 'A Pig Petter's Diary'.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 400;
var input_for = [];
var parent_classes = ["musicblock_d_red_02", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_dr",	// defined by takeable (overridden by musicblock_d_red_02)
	"music_duration"	: "10000"	// defined by musicblock_base (overridden by musicblock_d_red_02)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANeUlEQVR42q2Yd1RUdxbH5889ZxOV\niMI0iqtJdI2xZKOJGBJXBTUKqNgAR+lFBTQaOygICMKoIEWq9KIMvUkRBFFRjAW7otEYWzTJZvvZ\n8917f\/hGGDCbzQnnfM\/jzbzyed97f\/feNzKZwV\/EDKPBdT4jrbt2jLHr2jIm6OrGd4MurX9bd5F0\n2ndEUDupzdtC6ASp2ZPkYeHf6GFhLanOQ2Xd4CY3l\/3Wf4\/3jNfc2jUO90LG4fKm0WhfOxKnSBfX\nvY2vXqrZywJtPpZo9bZEC6nZyxLHPS3QSGrwsEA9qc7dHLVu5qgmVbmao3KVGcpJpSvNuktWqpuK\nNaqmoy6qpiOkIheVNnuZUpOy4GceiF27u\/v983cI7uLm0TgZOBL1Phao8jBDySoVWtaMEOJ93Uol\n6rwJwMscRzVKNBJsmasa1eI7FY7RA5TStnyVGjUe5iheoUKlK8OpUaJRMyR0tC1eocZRUpGLGoXO\nKuST8pxUTTHzjK37AT7aM1H3TcQENBMEgzGUIWDzaktUuKsFVA3B1Xiao2iFEvW+lihxJQg6tsBF\ngVpvC+Q5K1BMkNXkaq6TnK5jjkICLSY43hYRWIGTSg+Yt1yJ9CUKJC+SI2LOMITNNtaxaQLuaeQE\n6wfh4wmgxyFDwHI3tYA7TuL\/BSDBVZMY7BgdV7hCgWqCZphacjDPSYEjGhWq6Jic5XJ6MAvkuxAQ\nhTmPtqWUAvkE1wMzsMJtjYN63IucmN6+bpQIGQM1brHC8Tg\/tCetRWvCGrQlrkVHSgApEG1JAWhJ\n8Ed7ciBOkZoPeKAx2BYVm2egeedssW2i\/bJNf0bVlhloCLJB9nIFyhmQnaMw57ooUeLGD0fwFNZw\ngtlt21+hNsYvhIvkXjeDsYJtjFGaqcWlMw3oOtuIq53Hca2zGde\/OoEbF1px82Ibbl1qw+3LbbjT\ndbKf+HP+no\/j46+fbxHnXznXhDOVaaiPcUWe6ygBV0zKotBq5w9HKAMNoBDboRrZreD3BFzk58Ph\n\/pllHzi+Ad9Iguq+0o67V0\/h3rXTA4q\/42MkWAblh+Pr8PX4up0tpTgWak\/hNkfmMgVSFptSqAnS\nZlg\/hcwy1sm6to4RgB4fDsJGxymv4OjCkmN8Qwns\/o0OPLh5VuibW6\/E+\/zd19fP6GH5PD5fclOC\nvNBahtpN03CYAJMdTZFIiyOEomeoXTZDu2WXt44Wq3P5hDewackUvXMMJ7nWG+zh7XN4eKcT9dWF\nuNBRj2+7zwvxZ\/ydBMugA0FyuC93NKCz\/CCynJQ4RIApi5UEYzygZGfWjxIlwXnim9iy9CN9WA3h\n+MYMwTCP716A1XQrePms6rMND9uGMBIfx8fzeXx+b0gpJzmVarfPEu6lLlFSzhlj56z+kp2iFVxG\n5UMz6U1sX\/axCC1frDccOyOBRYRvx56IHfD2dUXcgQi9eJ\/FsI+6vxoQUspJKdSnqTokLJSTgwpa\nua8B5BJTSp1g1QeDELR8qj60HB7JOQnu6b1LehB2LD5uD3749qrQ9w+vCHBW7P5wXKQwSpBSuPm6\nvUN9Li0Q8QtMkUyAVFYQPLO\/ZFxodVSY3WiRBDtP7eOeyDm6CTvCcN\/dv4wX33QJoNamUtwiV\/7y\n5IbQj4+vw8fvFXxj7ZEeJ8l9vs5ALp5LD8TBhaZIclSIRRE0s79kddSaOAc9Jg\/GLhcrvXv81JJ7\nT+5dxLOvX8Ex0F+f3cTfvrul109PbyIqKhhRkUE4GBuBK5Rr7DqfL7nID947FzvT1yGWHIynMO+i\ncO6YMbSfZDVePYDeUwbjQOCCPuHlp+\/tHoeRnWK4vz+\/jX9+341\/\/XBXbHl\/b9ROAckOHq8rFg8m\nucjX6x3m3oAHHEwRPd9kYEDRO52V8P1oCDJ3+74W8PmDy3r32LF\/vLiDf\/94D\/\/56b7Y8r7vanf4\nrHYToT7bVi3OGwhQhJnysDNjnYDb\/xJwOwEZSsYTR9IiE6yeOgRZYQaAZ6p+EeB9CuHpE5WI3rtL\nuMgONh8r7gfIeWgIuN\/eFFp7E+ydZ4Jtfx7aTzIehRIpUf2tjJBtAPjUzxaPa7L+Z4gPJUULKF\/h\nnps4jo9\/nYP6EBOg1s5EKIoAtxKQoWQ8CjFg4DQj5IT76lfx\/ZMV+G6mCk92aF67SO7QDZMS9yIp\nYa+AEzkYGSyOY0A+72p9K7pqm\/uVmlc5qEDMfFOaBUywZfrQfpKV04ieQIDrPzFCLgGy\/VwOHm1z\nFoCsR12t\/coMO9l2vEw4x3nH2x8fXdPDSe5VbyxG4oQkVK4\/ghSrFJzOq9WXGQY84KCgMCvEsLJl\n+lv9JOPhkQE3fvoW8iTAjjo8m\/+2HvDx\/g36Qs0353zkhcAlhbeH02JF0e4NJ5WYqg1HUfXFUeFe\n84FylAUWokNX21OoqQ4yXKxDD+BmAjKUjIdHBtz0GQP6iKf7Om6rHo71bMlEcTN2RAo3OyYVZV4Q\nDMaf94bj3MtbmCXck2pg074yJIxPFK2OO8k+OwJcoMQeAmQGQ8l4eGRAjneS\/2yRG08WT+gDyPr2\nyEHRVTx9Vop+y8rPSRJADM1iMMM+zHC5CzL1q7dRW0rvIJliojmbFoAYOzniCDCCAL8kIEPJeLJN\npV64nVZMpOO7uHasAPeD3fHIexYea6bqAZ\/42oiWFbZ7K00sWwVobnaCftzqPXJJsyGXlYr1RShf\nV6hvcZVbipBll0ETdjU6UgMQTYAHF6kQMZcAKc0MJZMmW54cuPcVhTijs60GF9qP0VM2Usvi4ZXn\nw54RzMNLAw9vjQhtwDofeHqvRHJiNPZpQ9HaWIoTDSX6FcthzXE4LPKO4Tg69dE65C3LRHNGKc6k\n+CNqvhz7ycFwAuR1YChZEb0KZixVUC6YCEhu2jkbbHGiPAMdLZU411qD8yfrcOF0HS7RgJpCMKmH\ntHDzcMGXm9YKUHfPFfqt9H9FcabIubKAQmTbHxarti2rAkVu2ajcWYj2sgqcSV5L9Y8AaZGEzx2G\nDZ8a9ZOsUGOGdAJMX0rTLU22IfwuYNPzZhW7fDSSfaYhP9gJuj2eaDgciuP5MTjbWoXOkwxOTp+q\nQwNN10V5yVQPo4TCd29DU80R+q4exatzEU+LonRjHgpcs5C\/KhOtJWXooM7TEuGAyHk08tN9w+gV\n9Atro36SFRBgGk20PNVmO6nF21YOvUyzUuizuAVyPTSLXxOjKKFjF1si1Y\/gty5ASaQnag9tQVNu\nDNpqCnCqqVyovalMqKVCh\/rDRahJLEBDQRFO0KpvrshGud8YWr2mSHD8GcBcF7MX\/E6QtkyJE7Gj\n0aB9B7UhI5G0WCXGoCLK0SMknZuF2GY598AzuNbOtA88g0dTy+IJJc3PCplrpqFkj6teuohVKAjR\nIHeXBlU7ZlPE6L14Lo1btEh204NzszCULMdZ3cQjd9eRCXhxeSqed9mjImI0ttO7AvfHjOVquoBC\nhD9tmVr0zUQaMLNdKHdpv5jAswm6cCUtNicVHa8S8OGzh\/eB73kAE\/H9UYpSPuV++Fw5OSenEKsQ\nSoDrCMhQsmwnlTbb2wwP2z\/E\/ZYP0N0wCdfqPkdr9h8RZDMc6QQRR04mUhhSl6qobpniIPXP5CVq\nGpHo\/4VK0UcTHFVIWMQ3Gk7HK5DGIG6WFAELFLmS+6ScFWa0IOTY50C5bmuC3QS3e44pMii1Qmcb\n0zwwpI8CrIZ0U4hV1tk+ZrhZNR5XS8bhUtF7uNu2Au35YxE0axhB9YSTAVNeQnF7OrRYjfA5JqIL\n7KVE52IbT5C8IiNpZYbaDhcLYD+5n+Frhpw1lOveKnLMFDH2Kuy0MSEoShESP3gIAQYwVG9ZDdGJ\n32dSlyqCWuPeQUf6u7hQ8BmaEj7ALhpid8wcJk6OJ5fiFykFFMNwe0p0VCOM3OJmz91gH23jyMG4\nhSrE0vFRdFz9gdEibVhdlXPRVfYetG5mVJyVCJ5lIuBCbE2RTwt1J73VrbUaYih\/\/U9w6c6KoPKg\nEd3lEWOp5ZnDZ+owEU52jeG4oTNgNBVWBpLCyWDal65JcAfITf781rFJeHR6Mh60\/gnPb3yB2w3j\n0Zw9lmDk1BSGC7hdpAovSwR+MoSG5sF95Pfx7\/r+qFnoaDQ4Yo6J3eYZJtqDC1VNHE6G4jyTXGO4\nmPk97YkBYyjcDBRG4eYtd4X9DkqRZ3cbJ+F27QTcqBiP7mY7dFXNRTVFascsuQgxu8jHltFU7\/vx\nYAMNSv9FPwsfclRZ01AZtM9erotfqHrBvXMvAXI4OQdj7OUCLIQKuwSmpRzjPGtPGYOLBWNxPnsM\n7rV6oDFuEvaskGPbS8BtM4ZDRwNzKpU4n48G6eU9ZVC35yTZ4F\/1O3bonCHmsQvl\/rS6ddF2pt28\nKNg1djNqnkKAsTjPYpYo0Bw7Cu3J43D1mDMBvgNP62FUHUxJJji0RIWGNX\/Al9ON4EVgQgTn9eHv\n3\/\/Nfnhv8LM0r\/SysKO6qCXopkxnM6prahoClCLHwqhTZFBOx\/uaw2+mCQI+oWJur0Qh1UKGC6Me\n7DFlENwJzGPyIP9f7dz\/89e4xsK6fvUI\/xIPC12Rq3k3F2YOZbE710Rz5Gmo4DvQS9IMo\/Puk9\/Q\nuk15U\/O6a\/0XYieWxHuHSt4AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_red_02-1334256845.swf",
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

log.info("musicblock_d_red_02.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
