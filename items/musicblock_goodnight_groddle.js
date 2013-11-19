//#include include/takeable.js

var label = "Musicblock GNG";
var version = "1347492224";
var name_single = "Musicblock GNG";
var name_plural = "Musicblock GNG";
var article = "a";
var description = "Once upon a time, this was the song that sent the world into slumber.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 5000;
var input_for = [];
var parent_classes = ["musicblock_goodnight_groddle", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"music_duration"	: "64000"	// defined by musicblock_base (overridden by musicblock_goodnight_groddle)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAP0UlEQVR42q2Yd1SU17rG55+71rHC\n9KGDgCAqHZUmHekwtKFJ70gVBAQpUkUpKooFRSyJHcUWW7BLjIarkqgniRgTE0xi1Jyb++9z371B\n4gHPWefcdWatZ30z88337d9+3vfd+\/1GIPjAa7DBOH+4fd7AnQajgWvV+gNXKvQGLpVpD5wuUAz0\nk07mKwZO5CoGjpOOrZD3HVuhqD6Wrag+QjqUpUg4nCVx+Whc+1PU9QT\/qddwm2nCYONcEBgur9bF\n6ZVaOFOshU\/LdXGpTIfreK4c\/fkaOJGngb48BX1WgABxNEeBw6RD2QoczJLjY9KBTDn2Z8ixj7Q3\nXYbeNBl6UqVDu1KlA90ppCTJwM5ESXtnvDhhQ+g\/mUipp0DtbovJ0J0mYwxU6eP0Km0czqMBsqXY\nky7GiSINLva5J02Eg7kyHFwhw65UEY4SZG+6BAeyZNidKsFH2XJ0JYgJSErfybErRYL9BLonje6V\nStenst\/RtSkydCdLsTNJiu2kbYlSuk4yUKtUd5kC+LB9Xt\/9VlP0FWlyMAY1GbCvUIF9WRK6uQgf\nE9xHOTRAighHCHAPAe4jwO1J7JycBhPROYLNIdh4IfZnKegcXUsObo4Xo5tAt8ZLJgAJDB2xYmyI\nEqEiSA3lAWp9zDQO91Wbqct\/byC4wjGHPgTI4I6T9mZKOBSDO5At42CHKMQ7kkU4QN9tTRCNQSUI\naXAx\/UaOLfEigldgGwF2k4tddNxDjnYRHIcJ\/LDKAmZXj7tn1nOGQspCxoA6knSR7D8PmSELkRa8\nEClBC5EdboWcCBukKa2REmyFzDBbZJBywi3QmGCMyqg5aGJHlQGa4o1REWGAKvquPs4Im5eL0Euh\nZmA7ybmN9LmHcnJ3OsEnSrCaw0xVaYDaa+7i\/Q2mIwyMqdhvNswtrWFs6wmTRctgusQf8xyDYOYc\njPnOoVjgEo4FbpFY6K6COWmhR9Sfcie5qbDANQLzXcLo90qYOQXD1CEApot94eDshIygeWiOkmIX\nwTGxcNcqPwzIVO4\/K4GWFCMOtyZEHT6WarBy8kNEbCKColOxLDIDAXG5CEspRkxWBVbWtCC1pAE5\nq1uQX92O4rrNKKrdiJSVDUgpbkDyyjokFFQjJqcSqoxShCYXwSsiHfZ+sbBYqqRJ+2CBnQtWRxpR\nuGXYtFyM1mghD3Wp\/1St8lPrE1yrMeCAsfbT4Wklx1KfcDTWVyEsMQ\/BCflQZZbToDWoa92KI8eP\nY\/W6LlSu34G6TT1Y13UAbd2HsKnnCFfHrkNo3f4Rmjt7UdO6A+WNm5G\/Zj0ySuqQWrAGEUkFWOof\nCyt7d6xP0MPGODHWRwmxTiXGKgY0SSV+aiOCqwTIqlNpMw3eNgrYuivhp0qGtyoLQQmFiMwow\/L8\nWmSvXo+cNa0oqutExfpuAtyLrn1Hcer8Jzh94ROcuXAepz45hyP9\/WjfuR+1bd0oa+wkwA3IKW9E\nT+8upBVUICg2G+7By+Hn6UAhlqBFJSIXxcytD0pwrkybyl+CMNtp8LHT4Dln4xkNz8gsBBBgWFo5\nYvNqkFTShIyKNhQ2bEHDll7cuH0R3\/z1Jr795jZpkN7fxl8f38Cj4au4P3QJh\/sOY03LVhRUtSKt\npB6ratYhjEIeEJMNT2USFnmEojZ2DrlHgDESVrXk2FQJzpZqozdDggg7ArRVUHKHwNo7Bq7hGfCJ\nK0BIahlUOTVYXtSEzMoOlFJ4vxy+gmdPP8f3z4e5fnj+Jb57egcj3zDI6xh+cBlDd8\/h7CdHKVfb\nkE55G5tTgZDEQvhEZ8I1OAFLvFW0CliiOVKEDTFiyrnZKPadKgFbYth6FrV4OnysJTChyrUiwKXK\nDHjFFCAmj\/IxswqxRY1Ir9yIazfP4btndzD609f4efQpfnk5gp9fPsXo6Dd4\/oxB3sCTR1fw+WAf\nbt04hh29u5Fa3IgoKrLA+Hx40sSdA+OxyDMCBdE2aIwUoiX6nwAepp2gh0Ics2Q6\/Gwk0F\/oDAuv\naNgHpcInvhAHDh9EfFE9oguasHF3L74buY7RH+\/j1a8jePPmOX5\/+wPe0vG3V8\/w8sdhgryFJ19d\nwvWrB\/DppR4M3jiO3KpmDugfn4fQxFyUlFcgOikD+VHWaIwgwChWJLOx0neqBAdp899Fe2gcVXGA\nrQQ685Zg7pIA2Ponwyk8mxysgW\/KaqjyGnDrszN48fwGfvv1Cf74nx\/xv3\/8NCH2+dWvj\/Dj94MY\n+fYa7t\/rx907ffjs1nF0dXchIqMcPrG5iMssQkFxEazdQpGnskYDATZGiHi+FflMlYDtnWzfjHec\ngWWLdDmgobUXFnrGYFEwhUNVAI+4EiSVNlPefYrRF7fwt7ff4o8\/XpAY5J96+9t9cneQXLxGuXiR\niuU0rlzuRf\/JXVCmroKXKgfOIckwtHTBAkd\/DlgfLkRdmBDVoUIUEtBkCfjeSZt7otMMuNgackAT\n+0BY+SbCJiANi0NzsDg4HbHZBXj+dAA\/\/3QTv78ZJsd+GNcLrr+9\/Rq\/v\/4Cv4wO4gcCfPL4PIY+\n78OpEx04e6oLAYkr4RKeSbuKD7RN7GBgvpQAbTjgWgaoJMBls6dIwNqjFpU6kp0J0FqfA+rOd8Qc\nWy9Y+iTCNiQLxhTyufYBOHWml\/LsOjn1Od6+fkBQj0iPCewhfXeX65fRW3g+cgWPvzqHL+4cQ3tH\nBc6c7IR3TB6sPaNgYOEKbdNF0Jpri9xIKw5XGyoiQHUULJs1RQLWCq2jSkpdOhOu44DGdr6Yz\/Zc\nj1gs8IiBgbU3AftAmZiOgasH8frX28guq6Dl5Rre\/HaH6y3p1S+3KO96cXdwP7582I\/80hJaTkLQ\n37cVrpHZWByQRPu6kjuoZWyDzCAT1ChFXFW01eZ7z5oiAWuF1qmESHedCTcbBrgYOvMdYLzIFxbL\n4mHmqoI+5aSBjTfSiwox8jUtM0\/PobBqDbbt6cSbV4MTGn1xFUP3juLLBydw6cIeuASqYOsWiE1b\nmuEclol51DjomtlDm9wztHbHCuqG6sLFBCf8x4CsFWKAWW4z4W6rx+3XoZvozneCHuWJnoUb9K08\nxl1cBlVqBq5c6YWllwqRabm07p2hsF\/F988u4t5nvdi0fT0+u0mF0dfBr2PXeyijYWDpxu+rbbqY\nHLTlRrAiWRsm5mLNSp7XrCkSsOaxmUKc4z4LHuQgs5\/noZkDdBc40wAu0LN0h8E4pEdoHO3TKTB2\nVHLIobvH8OCLQxi+f4zWvl44BMZh45YGOPqEQJ+u06Oc06W1leU1u6+2Ccs\/G2gZWZGD5lgbKqYq\nFqOSAHMJaLIErHlkgLmes+Bpp89nN+biWLGwm7NBGCR30s4HcyhHx+QHN2UM0vIyUFy5Eu6hy6kf\nVGK+gy+H0zd\/B+fE3dMZd0\/L2BqahhbIVpqhhgqkPoIAg9U5w2QJWOPIAPOJVuWsyZOX5Qi72btQ\nj0G6jId7zE2Wl\/o2XtxVduR5au3Jz+u979wCgptvP+6e3YR7mobmBDifAzZESjjgCgKaLMGuNDl1\nEyIUes9GlqcYGkaW0KQZsmWAFwyHdBwLN+Ukc4WBckcniU+AnaffTTg3AbeIT1yTwc2xgKbBQmRR\nFa9RMkB6PiHAHM+ZUyToTh3rbEvY3kcrd+RSHcj150MxxxwahuOwLOxsABYmM0fuCgfgReQyJnOX\nCTA9dp7lnNl7cCY2E6HVYPemMTL8Dak4RFgbLqGumgA9Zk6RYAc9n3ZQZ7uWthoGWUp7YryHDkxM\n50GmZ8Zh5TRbBbsxzV7DiAZhTlC4+MAsr5gYiOmSPz+zxZiD2XHntIytoPUenELXjANWBItQG0YP\nTwSYTUCTJdieLEd7rATtcRJsiJYQoBpXGbXcRb5ipHnKEOaohSBHHThbz4GdpTFBL+DQchpMQeFi\n8FyUHsx1\/p6+16A8UxiYj02QTZRJdx7kOqYkY3ry0yMwIX+QKg9UR5b7zCkSbCPANupoWVe7OWHs\niWtrkoyrjcBZp\/EOmmk1PW1VUb5U0swzvGRY7qYJpZMOvBYZwM6c9nKDuZDpmkJKEFJdE8i0Teg9\nSdsYUi0jSDSMINWcA20dfWxP00J5kAjNqjHATAKaLMGWRPnIBmoY2ygPz3XqoL9DC0fraX+OlqKJ\nqntHqhw7qZB2ZyjoSUyOTpoEg2fgLC3eh2fgNbSnsnNZ3jKs8CX3nbQQ7qRJR01+DFysQICdHGWh\nmnyMskARmt4B0mYxWYLOROnAegK8e8wQLx+aYXTYDUdatFAcSas7Ddi+nGCoLV9HTWVrrIzvm80q\nCTYlUGrEkeMEviVRxifCIrApXsoBmdPvw7+bADvPorQthSADKDokFuIyAswgoMligO1b6bFz5PZc\nfH3NCI8uG+L+BRdc2q9NHa062giigRZSBrWBAFlbxBbWlmh6Hyzk5yqDx\/KoiVTqr07LhpjDd6dr\nYEeaAttZFOh9Z5Kcb2s1oVK6N7nvL6JOWoSO5XL2TwL1AzMmafqIYFOczKIrR4oHZw3wxUk93Dmq\ng4cXXTFwUIcaRnXuWj1t6E0EuD5Gxjd2NkhLlIwcUOewa0IYtAQNFKq1VJGsMotpcqwAamkR3kz3\n78qXYGM2LWd+1FoxQB8hf8\/ExmDPwWkuMyZpeh\/\/f4YKpPr8Fg1c3aOJwSO2OLFRB6spJwuXCblr\nDTR4Iw3EXKsKHuvfeFgIsI4Aq5RsqRCjnhbcuogxsSI6uUmHpw3TvTMuuNevhRrK3zUhUn7vYj82\nERGFW8Ee0pGydMYkTcuf+AuuPV5U\/XGNfOTgOgN0FEiR4Czi4WSuMbh6AlhHUNWsfyPAd+FkYDUk\n5hoDY4tubbiUvpNg+IIRng3OxbfXjfHySTa+uqSDi\/t1sNJPjAJvIR1FKPITYl+OJtKo3Uuipvl9\npTj85e\/\/1NyeLlSrCFQPzvQUVVO4Blg4mWuN5GDNuGvVdGSOsXCu8lOnz2IOtYrBEhhXGAOU4jHl\n8\/B5A9w\/rY\/HVzxw7+xS9HVqoMBHTGuskI7q\/Hd7szXokWP638txes+\/9Ldws0rdoi5ClL82TNRD\ne+YQ2zvZ9sTCWRognABkBfUOjBUBy7PL3doYPKSDmwe08ORGHE5vmYvqBCHyCLCQAHO91NGTqUlL\nnBTxBDUhx2kjETbjf2D+uy\/2XzIVTTCFvoe2pyEWSuZaCYWqMljMwaqUY6qNEuFspwKXdhrgxqHF\nON2pSQu7aCzEVCQtlD5HC7WRQ51UnON0rliHaSNxTv9lIfhPvvZmKVxoOcrfECPra42VjzRThVeG\nSHgRlNJOsblAhvX09JjiLUaKq5DD70jT4HDltAfHOkxHjP20EVL+\/9u5f+d1uFSodrxQ22VXuqJ6\na7K8rytZ9rolRopWWhs7aVFnR9ZBZ7jPHIq1n9Yeu+QvCf\/oXv8HCbTNEjclIFUAAAAASUVORK5C\nYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_goodnight_groddle-1334256973.swf",
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

log.info("musicblock_goodnight_groddle.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
