//#include include/takeable.js

var label = "Musicblock T-1";
var version = "1347492224";
var name_single = "Musicblock T-1";
var name_plural = "Musicblock T-1";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 3000;
var input_for = [];
var parent_classes = ["musicblock_trumpets", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"music_duration"	: "10000"	// defined by musicblock_base (overridden by musicblock_trumpets)
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
	"no_rube",
	"musicblock",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-37,"w":37,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAPpklEQVR42q2Y91OVWZ7G7y9bNUa4\n+ZIEJGNCQVFAEJEo6ZLzJUdJggQlS5CMgKIooc1iwHZEOynbdtvd0612nJ7p3dlleqe2and\/6T\/h\n2ecctMeBnqmdrblVT933pvd8zjefq1CseNQfUppdK7cOeNruEPNRy+bWj5rsWhcbbeYfUwtVhtZf\nC1UYWt+m5oWOGFpvH9FX3i0xBMz9LE3AlTJzW8U\/+vHdkKvps25nvDjljA9b7PCgxgoLtVZ40rgJ\nHzTYSN0t1+N+pQXuVViAgHxtwJ0jBtwuM2COullqwI0SPa5TV4v1uFKkx2XqUqEOs\/m6pZl87eIU\ndTGPytEsXsjWDI9nqU0DcX9jQ8Jqz\/tcvvy8xwmLAqzOGnMVXKBUi9lCNe4dtZASr2cKVLhRrsON\nIzpM5atwm5BvFWpwtUSH6XwNbhJ2tkBDIC3f02MqT4MrBJ0t4L3y+ft88T3+Nk+Hi7laXMjR4jx1\nLluLCZNmsd1oHrAK8Ntht\/mvB10xf9RSggmolYDz1QZcLtHw5ipcJ9y1Mi6Qp8ItAs4S8DIBz+eI\nz\/RcTMXPNPyOHhNZSlwpMfAz\/rZAh8lcDSbzloFeAxIMI+lqDKSocCLaDI2RZvP1hxRmEu77IdeA\nrwYIV71soZWAl4o1Eu4uJa4FlIC7WqqTYDfp4slcFa7yvbMm1TKUScnF1fyOHmeyVIQ34BwBL9KK\nE3yepUUnCCdhon5ZDZEbW19Zz31mgS4VLhNA41l6lB\/UoSbUAtXBBhylGsIt0RhhhdoQvnfIgPpQ\nS9RRDeEGDKYa0BmnxVCqBU4aNRhKsUBHrIbv6dCfbIGxTBXeoqsF2AW6+Gy2BjOMyelCwvP6uIRZ\nrfpIs5+kFb8ecF0SYEK1ERsR4KDFfnsrHNhsgyAHGwQ7bkKoky3CqcPOtoh0sUOUqz2iqRhXO6no\nV6+jeH2Yn0fwe+HO4nebcIj3OLjZGtHbLFEdYsBQmgZThBMay1Kj3fjLgEKNhzeYFJ91OUq45lhz\nRGxbC397awRScbt3wBTkh6KwgzgSE46axBg0ZCSiOTcdHYXZOHWkEAPVZeirKEFzVgqaqBMZSWhI\ni0dtUiwq4yJRFh2GrEAfxHvtQLi7IzfNeztYEspAd+swmqmmB5TS1fWHV6suwmxe8bTNXgKm71tL\nwPUSLpjWygnaj+LDwaiOj0ZjeiLa8jLRU1aAwaPlGGs8inMtjbjY2YLZ3pO41N+NywM9eKuvE1Pd\n7TjX1oSxE3UYqKlEV3kxmvNNOJaZgjJjJBL2eSHExQbD6QaczlCjP0WJ3mQ16gTQCh2LMFtSfEhA\nkZ1GzzWI3L5RujV6uwuyD\/qhJDwIVXGH0ZAaj7acdHQX52Kgohinaytw9ngtJlsbMdXRjGmCTne2\nyuvJtuM421SH03VV6K8qw8CxPLQVZuJYWiLK46KQHx6MZP+9SPe2oYs16EtW0YpqYa1flOJRgzXT\nX0M3rEHMjo0IYdzEbnNFTsA+FIcFoopuakiOQWtWErrys9BfloeR6hKcOVaBc7TkZNMxTDbX4WJL\nPc4T7GxjDUaPVWKwuhSnygpxd9qEy+MpqEk24khsBPLCgpAe4IPIndvQk2Sg9QjIuGTW0mKrpXhY\nb423ijRI3L0GsR4bEcbgNtKCWft3o+jQflRGHUIdrdicGoeT2SnoLczCUFk+TlcW4UxNGSbqKqhK\nTNRXEroSY7VHMFxVgj6Gw+VBE96fT8evryWiuzIKpQyZnEMBSPHbg9jdHowza5xKUmEgTc3rjagN\nXy2FKDGinqV4r0X8LjNmny2MW52QuXcnCg7sQ0X4AdRGh+JEYiTa0+PRk5OK\/oJMDJfmYqy8AOMV\nBK0qxjg1SugRvtdfnIPxuiw8uZeGx\/OJWLgeg5mRMCZcIEy0XvJeT0R7bEFTjB26k5ToS\/0bgHPs\nBDN0cdretUj0NJNlwrhlM9K9tiHPzwulQb44GnEQjbFhaE2KQmdGPPpMyRjMT8NIUSZOl5gwWpqD\n06XZGC7ORj\/jbbAkDU9uJ+PZo3g8mY\/Bwo1w3JkJQqXRFxm+XkhghYjc6szs3YTuRAKmiCTZiJrw\n1VLcYPOfYg\/NYBYne5khioCx7vZI8XBDtvd2FPnvQVWwHwP2AJqMoehIikRPWiwGTAkYyk3GeGkq\n7g2lYSiPls1JRq8pCc\/eTsCLJ3H49J0oAobh4Y0g3Jn2R0fpHqR6e8Do4YpQF3sWaRt0EbA7USXj\n7WjYailE7xR9M8t3HZJ2qWQRNrrZI5FWzNjphvy9O1Dmv5sdxYeFMxCtscHoTAjHdF0UZhti8J\/f\nxeHlwzj0ZcQR2IgvFqLx\/SdR+PJJBD55GIIndwPx4Jof7kx5Y7zdA4m73BHp5iAbwIkoa95LiZPx\nSrTGKVFNoJVSyN7J5p7ttw4JO7WyI0jArZuRts0R2Z5uKNq3AxUBXujP3YfpRn88OhuEP30dijMl\nobhYE4bfP43ApRPh+Oa9CPz78zB8\/1EIXjw+iGcL\/nh8xwcLV\/bg5qQHZke2IGWPo4zzkDcAOwSg\nkYChG1dJcY0NvS\/ZHLn71yHxFwAzdzghd5crjsdsw7PbnnhwxhsnQn3x2R1\/QgVgrusA\/vDpQfzp\nqyCpP3x+AN996I8v3vfBR\/e98d7NXbg\/ux3XJ9wwPeiI\/GD7vwAUcO1xKgKaoyp0wyopxCjUy0zK\n91+PJAK+6eLUV4DZHs4o8HRBR7I7PpjdgctNu\/Dt+3vw44t9+PGlD\/7jpa\/Uywc+WLzijXemvXBv\nYiduDm\/Do2tbcPeiC66eccTUgAOqkuxlX3\/t4jajSqqFrbYyZMMqKcQo1JusROGB9Uj21MphIMHD\nHrn+DkjZ5oD07cuA7anOmBtywzeP3fHDx1vxxy92UDvxx+e7ftYPn3gwo7eh2HsL8j1dYdrpjAz+\n\/miMI9oKHDDSYo\/KRDsCcoh4BXgyQU045V8HFKOQACwJXI8UAooyUx5nx3hxwGiTA863O+HWWWc8\nueWKT+674fk77hLy+6db8fzBFsz1bEGH0R1H9rijdLcbnt1zk9bO2cli7+GENAImbXVAvPtmxNAz\n4v5hr6YckcUd8WopMaxUBG9YJYUYHk\/RxWUHN0hAER9ZAfa40L8Zl8cccWvSiTHkjEs8p\/QVuWBx\nzhXTzW6oDXZDiZebhCrlczGfC71c8e4lVwlnotWF9VMYJiJcRNiI+BajmBjDRM8\/HskYjFMzi9Vo\nImA5gVZKIYZHAVh+aBlQ7E7scrTdDjNDDugpd0Cmp6NcrDbKCTOdLsglQP4uF2mpArqyzNcFp3Jd\nMDfsitlOAeckXStiOInJtmw9Oxk+Yk4U7g3k6NVIwDYmSGciAWPMJcNKKcTgKAArSZvnq5LBK4K4\nNNoOffX28uYio0U8mnY74cqgkwQQ8VUf7YwLzS7S\/XNjLmjPdJZJlbYCThR+McyGv2G9AAI2vALs\nStJIwCMEWinFVIGe04SK0+5GlAeZy+k3xNFG3ixxl52MmzgukrDFQcaSCPiZXidcH3XmTOiE3hIn\n1EQuW0yAidKUzM0It\/4Z7rVrbWXsiWl9v50V+68Vmo0CkOcTApYdWr9Kiov5y5PtMdH7WLnz92vh\nZ2uJAxz7g17BRgi3cwEx3hvdBKy9tI6wqogx8SygxAYEWIL7cswJtwrLvQknDCCmdl+uUScAY1Xo\nSNCwLxMwaP0qKSZ5Ph3hZNvBViMg69kTK4LVOOiog88mA\/bbWiDAzlLe+JADgZ1oXYaBgI7kwlEu\ntgx+yuXV+YSvBVTk67OJ02o4YYC9myzZf61oORXa43l4ImApgVZKcT5Xz\/Fbg+EMDQZSNQQ0k2oQ\nI3e4SB4Vcn01yPbRsFfrEb\/dAH8CH6AC7QW41bIcli0exE0IkEB6IJDvC0+I7wsoH2qfjQF7bCzg\nZW1AN099x6OVOJWi5VHTHCUH16+S4hwBxUlLTLVjJq08bZ3N0UkNEVxMGq+hhY7ztNXCeGmJUXLK\nUaE0UMMNaJG2R4eY7XpaSIe9hBDyttZjD7WbMF5WOuyy1MGD2mGhhacVD\/AFFmiMVuFU8jJgMYFW\nSnEmW\/fTAAfGIcbho3Eb3B+xwu1O9udULUdyJSbz9bjARJouEicxPca5CQEvwEVYvAkvwNvYU8Vn\nVSEqznNq5PhppLIpEz2R6q1C8m62NuPyGg1RKvS8BmSzWCnFeLZ2sZ+Az+844L+\/dcd\/fReIW308\npCexunPB4UzCcCzv5VA5mK6TffNUsgajJoZGBi1OcG5SbkR4YDRLKwGFpd+Ef70B8bnw0rk8PcsM\nvUMJFzcQsIhAKyUAh8\/y2Ln0qTP+9akjfvfYAV+\/F4APrljTAuYYIkQXC6mAGiCgGItEYe1L5TXd\n3CWL7HIc9VD1h81ZNtQS\/mKhBd1okLrA6\/EcvWxrbXFa3pvWP6xiJqswkqkX\/yRwHli3QmuXFGcz\nNQETZVp889AeL9+2xee3bfDDszgs3rDhwGgurdbJht5DwP40nWzsYpG+FB0tYC5hm2MFtAZddFUH\nM1JkZi03JxKgnUV4jPefqNTwWKCWUK0CMIxVI0IlJdYQ5+CCgHUrtHZe\/j\/DBGl994wFPpy1xGe3\nvLBwzgXHGZPVoUpptS4u3s2FhNVEcoj5TbqFgCcJ2GIUpUKNThbck4nLaiLk26M2MmyEXiwE4MV9\nKx5dddyQVt67NkJsREV3G8QhHXn+61ZoTeXPf8ENZ6lar7fpl2702mOkSgvTfpV0p7CagOskQC+h\nWsX8RsDX7hRgbZSwmgATRbc9Qcv3NPjuPUf8+Btn\/NvHTvifH0rx\/Qc2eP+KDWoi1EwiJZ9VPJAp\ncbnMEgWMtxxCvak8n1\/95Z+a5wuVZieizGPKg1XDdNeicKewWjct2PbKaq1xKmkx4c66CHO+Vkuo\nOgFLMKl4AajF75844LfvbsbXC3b44Z+D8OKhP+bHLVAVpsZRxmA1Jb53qdQC2fvXrtTM\/+lv4b5U\nTUBXgqqVcTfPpv6T6J2iPQl31kcqfwYUCfUaTCSBiLPHU9b4zZwNnl21wr98nMHjgjNaTUpUEFDA\nlQebY6bYkiVOiyy\/tX+W75qlRM9Xf2D+vY+aCHPbrkRt5WCGbp7JsSRcKax2jK5qilFLsBbjstpZ\nmh6dMeCDi\/b46r14PBi3RGYgayTrYxWTpI\/hc7vaGmWcpDJ910pl+KxZyvD7px3\/sD\/e79RY2F4t\ntYwZz9YPD2foF0dNBoaCjgOoRiZBPTvFWJUO\/Tw95oWokXdAKeFFFxFwjezB6T5rkbZvzRJV+f+2\n3N\/zuFttHcDFK2dLLOYvFBqWRD2cpiuniyzYlQyYYJHuSKAlQ9d\/mb5vzXD63l+Z\/tq9\/hddsEk9\nU2EwXgAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_trumpets-1334257135.swf",
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
	"musicblock",
	"no_trade"
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

log.info("musicblock_trumpets.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
