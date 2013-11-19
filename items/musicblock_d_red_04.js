//#include include/takeable.js

var label = "Musicblock DR-4";
var version = "1347492224";
var name_single = "Musicblock DR-4";
var name_plural = "Musicblock DR-4";
var article = "a";
var description = "The best ear-wormy racket-pop currants can buy.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 600;
var input_for = [];
var parent_classes = ["musicblock_d_red_04", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_dr",	// defined by takeable (overridden by musicblock_d_red_04)
	"music_duration"	: "9000"	// defined by musicblock_base (overridden by musicblock_d_red_04)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANeElEQVR42q2YeVBUVxbG+8+pmkQl\notAbi6NJdIxxyUQTMSRGBTUKLrgBouyLirjFHQRkVVBBFkFAdmil2ffFRhAVRUVxN2g0Ro3RySw1\nVVM19c05t30tNJiaSYWqry7Qt1\/\/3nfOPee8lsmMfqJmmQyt9xtt27N3nEPPznHBN7d9GHxt8\/va\nbtJ5\/1HBHaR2XyuhMySdN8nLKrDZy8pWUr2XyrbJQ24p+71\/nkVPdLsXOgEPwybg+vax6NgwGudI\n3Zvex5XX0vlYod3PGm2+1mgl6XyscdrbCs2kJi8rNJLqPS1R52GJGlK1uyWq1lqgglS2xqK3dI26\npcRN1XLKVdVykqRxVcXnrlS6pS\/+lRti1x7s\/\/jydwTXvWMszgaNRqOfFaq9LFC6VoXW9aOE+G\/t\nGiXqfQnAxxKn3JRoJthydzVqxGsqNNANlNFasVaNWi9LlKxWocqd4dQodVMzJLS0lqxW4xRJ46pG\nsYsKhaQCZ1VL3AJT2wGAT6Mna3+ImgQdQTAYQxkD6tZZo9JTLaBqCa7W2xKa1Uo0+luj1J0gaG+R\nqwJ1vlYocFGghCBryNV8ZzldxxLFBFpCcLxqCKzIWWUALFilROZyBdKWyhE1bwQi5ppq2TQB91PM\nJNvHkRMJQO+QMWCFh1rAnSbx7wKQ4GpIDNZA+4pXK1BD0AxTRw4WOCtw0k2FatqTt0pON2aFQlcC\nojAX0FpGKVBIcHqYwRVpbxqsdy9mcmbHpjEiZAzUvNMGpxMD0JG6AW3J69GesgGd6RtJQWhP3YjW\n5EB0pAXhHEl3xAvNIfao3DELun1zxdpCf5dv\/xrVO2ehKdgOuasUqGBAdo7CnO+qRKkH3xzBU1gj\nCWa\/\/UCF25m+Ei6Se70MxgqxM0VZdjyuXWhCz8Vm3Ow6jVtdOty+cgZ3rrbhbnc77l1rx\/3r7fiu\n5+wA8f\/5dd7H+29fbhXvv3GpBReqMtAY544C9zECroSUQ6GNXzgS4Qw0iMLsh7vJ7oV8JOBivhkJ\nz6+s+8HxB\/AHSVC9Nzrw4OY5PLx1flDxa7xHgmVQvjm+Dl+Pr9vVWoaGcEcKtyWyVyqQvsycQk2Q\ndiMGKGyOqVbWs2ucAPT6dAi2OU17A0cXlhzjD5TAHt3pxOO7F4V+uPdG\/De\/9v3tCwZYfh+\/X3JT\ngrzaVo667TNwggDTnMyRQocjjKJnrFC74b2y67vGitO5atI72L58msE5hpNc6wv25P4lPPmuCz\/2\nXjaosaYYhw\/tR0N1IeqrCsU+Bh0MksN9vbMJXRVHkeOsxDECTF+mJBjTQSW7sHmMKAkuk9\/FzhWf\nGcJqDMcuSWDPHlzF84fdBiUcjoTNTBv4+K0VK+\/j\/fw+fn9fSCknOZXq9swR7h1frqScM8W+OQMl\nO0cnuJzKh9uUd7Fn5ecitHyxvnDsWl+wF99fx8+PrqM4Pw2+\/u6IjtprWBnyae+VQSGlnJRCfZ6q\nQ\/ISOTmooJP7FkAuMWXUCdZ+MgTBq6YbQsvhkZyT4H56eE2AvXx8HX99cgNJidHCMb8Ad7EyJK+8\nry+kFG6+bt9QX8oIQtJic6QRIJUVhMweKBkXWi0VZg86JCEu0\/u5J3KOPoQ\/TIJ79UMPfvnxJv72\n7DZKNBnwW+eBA7H7CNIDsTHBApL3sdMCktzn6wzm4qXMIBxdYo5UJ4U4FMGzB0pWT62Jc9Br6lCE\nutoY3OO7ltyTwirB\/f35HfzzxV2kJh8Qjvmv83ztpIdYeR\/vZ9f5\/ZKLfON9c7ErcxMSyMEkCnMo\nhXPvrOEDJKv10QP6ThuKI0GL+4WX776vexxWdu6srkKAhIbtQMB6L8TFhcF\/vafBSd5n7CJfr2+Y\n+wIeWWSOgwvNBgcUvdNFCf\/PhiF7v\/9bATnvJPeuUYIHENC3OwIFaMAGr35O8j7eb8hFI0ARZsrD\nrqxNAu7wa8A9BGQsGU8cqUvNsG76MOREGAFeqB4UsKO1UoB0nq3Bf\/7xCBWlOQL44IFQkZNvA+Q8\nNAY87GiOeEczHFhght1fDx8gGY9CKZSogTYmyDUC\/CnAHs9qcwaEuPtikwhpz+XT+PcvD3As9eBr\nB\/U5KIX4bQ4aQkyA8Q5mQrEEuIuAjCXjUYgBg2aYIC\/S33CKH52txM+zVXi+181wSFobS\/SH4TUI\nO\/mvl\/dRejJLwEk5yIdEysGbjW3oqdMNKDVvclCBuIXmNAuYYefM4QMkq6ARPZkAN39hgnwCZPu5\nHDzd7SIAWU972oQbnW01ooxwOWGQKxcaRciTk2L7neK+7tVsK0HKpFRUbT6JdJt0nC+oM5QZBjyy\nSEFhVohhZefM9wZIxsMjA2778j0USICd9Xix8H0D4LPDW0XJaKk7JQA2bwkQxVkP+maNidZ3FIaT\nSkz11lOo3nJKuKc7UoHyoGJ0auv0hZrqIMMlLNID7iAgY8l4eGTA7V8xoJ+4u+8TdxngWC+WTxYf\n1qGrFK1Mam0M2reDSKuhJ1PuFSzJEe5JNbDlUDmSJ6aIVsed5JADAS5WIpoAmcFYMh4eGZDjnRo4\nV+TG82WT+gGyfjx5dNBhgd0qzEsVUJGRe8QaEbEL3r5rxMFguPzF2YbT2xxfRs8g2WKiuZixEXEO\nciQSYBQBfktAxpLxZHuceuEeOjExTh\/iVkMRHoV44qnvHDxzm24AfO5v99Zxi0ctdszbb41YpdmQ\ny0rlZg0qNhUbWlzVTg1yHLJowq5B5\/GNOEiAR5eqEDWfACnNjCWTJlueHLj3acJc0NVei6sdDXSX\nzbghhleeD9v6laC+A2tedpJwbH\/4Lnj5uhlOLIc1b9EJkXcMx9FpPKhFwcps6LLKcCE9ELEL5ThM\nDkYSIJ8DY8k09CiYtUJBuWAmILlp5221x5mKLHS2VuFSWy0un63H1fP1uNbZKJL71mV+TtHhTjdN\n3dfacCAmRDjn6b1arPpnE\/2jQvnGYuQ6nhCntj2nEhqPXFTtK0ZHeSUupG2g+keAdEgi54\/A1i9N\nBkhW7GaBTALMXEHTLU22YfwsYKd\/skpYNRZpfjNQGOIMbbQ3mk6E43RhHC62VaPrLIOT0+fq0UQT\ntaYgDTmZCYik\/Os+30hqotcaUbIuH0l0KMq2FaDIPQeFa7PRVlqOzjNVaI1ahJgFNPLT50bQI+gW\nW5MBkhURYAZNtDzV5jqrxdNWHj1Ms9Lpf4mL5QZoFj8mxlJCJyyzxvEAgt+1GKUx3qg7thMt+XFo\nry3CuZYKoY6WcqHWSi0aT2hQm1KEpiINzjSUQFeZi4qAcXR6zZHs9CuA+a4Wr\/iZIGOlEmcSxqIp\n\/gPUhY1G6jKVGIM0lKMnSVoPK7HmuOjhGTzewbwfPIMfpJbFE0pGgA2y189AabS7QdqotSgKc0N+\nqBuq986liNFz8Xwat+iQ7Kcb52ZhLFmei7qFR+6ek5Pw6vp0vOxxRGXUWOyhZwXuj1mr1HQBhQh\/\nxkq16JspNGDmulLu0t8lBJ5L0MVr6LA5q2i\/SsBHzh3ZD15\/A2bi9VMUpULK\/cj5cnJOTiFWIZwA\nNxGQsWS5zqr4XF8LPOn4FI9aP0Fv0xTcqv8Gbbl\/RrDdSGQSRCI5mUJhOL5CRXXLHEepf6YtV9OI\nRL8vUYo+muykQvJS\/qCRtF+BDAbxsKYIWEHjTu6T8lZb0IGQ49AiynV7M+wnuP3zzJFFqRU+15Tm\ngWH9tNFmWC+FWGWb62eBu9UTcbN0Aq5pPsKD9tXoKByP4DkjCEofTgZMfw3F7enYMjUi55mJLnCA\nEp2LbRJB8omMoZMZbj9SHIDD5H6WvwXy1lOu+6rIMXPEOaqwz86MoChFSHzjYQS4kaH6ymaYVnw\/\nc3yFIrgt8QN0Zn6Iq0VfoSX5E4TSELt39gjx5iRyKWmpUkAxDLenFCc1IsgtbvbcDQ7RmkgOJi5R\nIYH2x9K+xiNjRdqweqrmo6f8I8R7WFBxViJkjpmAC7M3RyEd1H30VLfBZpixAg1fwWW6KIIrgkf1\nVkSNp5ZnCb\/pI0Q42TWG44bOgAepsDKQFE4Gi3\/tmgR3hNzk\/99rmIKn56ficdtf8PLOFtxvmghd\n7niCkVNTGCngQkmVPtYI+mIYDc1D+yng8z\/0\/1Kz2MlkaNQ8M4cds8zijy5RtXA4GYrzTHKN4eIW\n6tsTA8ZRuBkogsLNK3eFw4uUIs8eNE\/B\/bpJuFM5Eb06B\/RUz0cNRWrvHLkIMbvIe8tpqvf\/fKiR\nhmT+T18LH3NS2dJQGXzIUa5NWqJ6xb3zAAFyODkH4xzlAiyMCrsEFk85xnnWkT4O3UXjcTl3HB62\neaE5cQqiV8ux+zXg7lkjoaWB+TiVOL\/PhhjkO21Ir\/cU2dDf9D12+LxhlglL5IF0urUHHcx7+VCw\na+xm7AKFAGNxnsUtV0CXMAYdaRNws8GFAD+At+0Iqg7mJDMcW65C0\/o\/4duZJvAhMCGC8\/n0jx\/\/\nbl+8NwVYW1b5WDlQXYwn6JZsFwuqa2oaApQixyKoU2RRTif5WyJgthk2fkHF3FGJYqqFDBdBPdhr\n2hB4EpjX1CGBv9m5\/+eneb2VbeO6UYGlXlZajbtlLxdmDmWJJ9dESxS4UcFfRA9Js0wue059J95j\n2rtub7vWfwFV3W4hqyAmwAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_red_04-1334256910.swf",
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

log.info("musicblock_d_red_04.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
