//#include include/takeable.js

var label = "Musicblock BB-2";
var version = "1347492224";
var name_single = "Musicblock BB-2";
var name_plural = "Musicblock BB-2";
var article = "a";
var description = "Warning: excessive volume may cause eyeball jelly to vibrate (in a good way).";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 400;
var input_for = [];
var parent_classes = ["musicblock_b_brown_02", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"music_duration"	: "8000"	// defined by musicblock_base
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/musicblock-bb-collector\/\" glitch=\"external|\/achievements\/trophies\/musicblock-bb-collector\/\">Musicblock BB Collector<\/a>"]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOdElEQVR42q2YaVSUV5rH68uc06IC\ntYPRJJ29Mx9yzmQ6bRIjSTqJETURjAuCFFBQUKyiKMhS7ItshWwFFIisArIVUCCyFCoaVJQQl6gx\nQXtJT5KeZLrnzJyZT\/95notVwcKe6Z7Tdc7\/VNW73Pu7z3rfVyJ5zOdG6UuaG8Zf2C7nPmc7l\/60\nbSrlKdt40lrb0H4P2wDJEudh64\/xsPWSeqLVfT3RHuk9kR7pp0ideg9Nl17h1f5QrVr3pyR\/rw+D\nXTf+YoHAMJH8JIYOPgFrwhOYPPIkxpPWCfXGqDEQ54n+WE\/0xXrQfw8QILqjPNBF6oz0QIdejZOk\ntgg1WsPVaCE161RoClOhMVQ51xCqtNVrScEKmzlIYawMlGuKff+PhQiL5T8Pm+FpDB1ei65YmiBS\niRM6OfoPeArx\/8YwGTpiVOiIVqEhVIZugmzSKdCmJwCdEu2RatRo5ASkpGNqNGgVaCXQE2FKNITQ\n\/aEqHCc1aFWop\/\/mYCVqSTVBSpg0Clumj7vXMjiyWt98yUvoO7BGgDGUM2BfvAda9AoaXIaTBNce\nRRNoZThFgCcIsIUAj4cp6BwBBsnonIKuUcMUKEWr3oMg6F6yoNFfhjqtEtWBCgcggaHMX47iPTKk\nfOSGI1vd+hLfk7gJuFulL3kJuPhFCz0OkOF6Sc0RCgHFcG2RKgHWSS6uC5HROaUAE1AaKU0up2vU\nqAqUEbwHagiwnqxYvk+GE2RRE8EJmG2PV9JW1\/SH1nu50Uou7YxRCaCelFdhKQvGSHUorJWhGKwI\nxVhdOMZJIyYdhqp0OFMbQdJj8Ng+9GV5oT1lA7rTN6Ij9S30Z3qhJelNtCe\/Rce8UEFATeRqEwGa\nQ5WoClKgkWLyuE4tficLmOVK3Or2o7DifPFLCwzGSvB2xVCXGdOTA\/j0rBWXzg\/jyoURXP10FHOX\nxjB\/eQKfXyHNTuL6Vdsj4mMsvuazy+O4NnNG3Hd5ehgz54YxOdiIgeoY1OpfRAPBsSoC5cj0eTwg\n68iW1RrJDGUsw6Vtd4fW+0VcsA0KOB549uLpn8Bo8hvXpnDz2lncmjuHLz47v0x8nK8RwFd+AuVx\neLE8Li\/eUhVN7laRu+Uo8ZMi3ccdiVvclumwt1uf5FzGzwWg\/+suyIr1dcDZrcYT8YQMxhB3Pr+A\n4sIMdLbXYbCvGROnT4nvL29cwN3rF3B7flpcx9fzfbw4HucRyAkLunI\/xrEAOYr2SFHkJ8dhBnLS\nIW+3BYnN8JTITp9XV6A4WeOA49UzHFvEDsYQ925exMZ3N0AXrnnkOyf7CJqOl4vzdlC2qN2aSyEv\nTg3h\/OmTqAxZh8LdMspsBVvrsZKMJK1FU7gSO\/55BUpTNA63LoXjCXlihsjJSYaxNAe9pxoxau1A\nX3cjyow5yM1JQUtTFe7fuYyvv5gRi+FF2SHZkuxujmmOSQ6lU4V+OEqAJXspWT5ii7kuk2Q4kQEV\n2PnLFTCmasQgPJgz3MLtSwIiLzdFWKy8LA9\/uD8v9M3CZwjXByH+gB7hEUE4O9Evruf7nCHticOu\nHq3RoWCXDMV75RRzrkjYvFySfirOXM\/2\/MoF5YbgRddSQnAM8eB2uAdfzuJ3X18TMP\/y4HN895sb\n+P63P6kg34C0tAQBPzrcgft3r4j72JLsbh5vqavZihPmCOTtkqLQ738B7KJO0EgdYO96F1RmhDxi\nPR6c3cWT\/farqwLu2wfX8cff3cC\/\/v4mfvjDFw7pI0OQkBCFCH0wLp4dEtfzfV\/d+lR4gcdztuJE\nPQHuJMA9nCSuOLh5uSQd1PwbQhUIoCyuIkBeJa927mwz5qdqcWu6Hr+5N4vfL8wJyzEcA\/3bt3fw\n5++\/dCgySotDh6IF6Mx5q7ierb7UirxwHp\/DiAEn6\/XIJcC8nTIRbwc+XC4J907um4FvrkR1ltbh\n3gHjRvRnyHE6TymswbHGbv3hm1sC7t\/\/+CX+44ev8J8\/fi2+o6IJ8HCMALw0PSKsLaxIScNW5HAR\nbqbx2c2cLAyYTzGYvYNqoa8U8QTkLInondRDgzashOkhIAd1f8lGdBvkGMpWiNhjQI41tt6fvrsr\noP7rT\/dxheLJXFuK0pIsFBdlkiVDyDoj4vrZ+T7cvjnlAORx7YAch5MNDChHFgP6EOAm12WS8Pao\ncLc7Qt5aiZpsLfKCV6Ei0hUNB9xxMlkmrHhtIB6fWw\/im9vjjwD+958foN5sFIkRFROKmuoicZ4X\nwoANI\/Eo7g6AzvQyomv+CVU9UTA0bnsEMJfcm+krE91k\/6bVyyThrdBRyqTQjatQS4AZ+1aiVLca\nNbFuaD4sxak0OQayFBjNV2JhttXh4vnZCQFVWpotvrkenrdZxHkOBQbM7fBFzklfnLAmOVycenwb\n2gayMTHRJgBzPpEjw0cGA7XauA9WL5OEt0JHd0uhe3sV6nIWAdmK5WTF+nh3tCXJ0PPQ1fcuNzuS\nhGGE5Sj2+Juh+Tif50znJMlp90F5Txh6x4ocpUZT8iJK28IxPGoWMZhNgIbt0r8MyFshBtS\/swrm\nnBCM95Zh0lKO2iOvoDraDccPumPo2NsYq34H9652i8kZiEsKx9vIYDvOUWFmy9nh7AlSOxCHmr5Y\n9JwpFGWGszi5bisSa7agd6hcAGbtkAvxZiX2\/dXLJOHNYwG5OOrd1QJQtDkKZFPyehjDV8MU4+Yo\n1NNkNa5xXOsMhkMC1HamV8Qcu5XLEMNxUvH1Gc3bUdqpRXF7CE70p2Hc1gT\/ghdQ1ByGwZE6Uaiz\nfOWUxXKkEmAMATlLwptHBox5jwGDHa2u8sh65JKryyJcHd1EF6ERrcy51dnbHbuVLWevf9XdMag8\nFY0U80fCcqWtEThc5S1KDLe6cXM4MihBcnYS4MfugsFZEt44MmAc0ZbEvCtudu7H9pbHOxcWbxZ4\no8AwdnExZzCue\/Y+XNEZjWMdkWgfzHO0ud1ZzyG\/Xov+wRrapesEYO4uhQCMJiBnSRrC1LSbkCH+\nA1ek7XqGVjYkIJfuaLh+cZCH6QKFlm6zkpPjxe\/mxkp0d9TDammlxY2LRSXXbkN+kwatlhzR47nF\nHTBuQm5dCHotJozVhiHNhwHp+YQAo95btUySenoErKZng0Pc+6hytxRF4Nx4r4i3mXNWXJletOhn\nlyYwMtCO04MdKDqajqqKAgEbFxcuQJfC93c3iUWxS9NqPkFF235H\/\/VNfgbZpiD09FbhTA0Bbpch\n6xMFPUAR4K9XLZOkjp5PK+mxL4taDUMmUk88nh2AwbYSTNJu+exYL85P9uOibcABPHtxFNc+HcPc\nzDiBj4twsFrayIINyM9LxeRot7BYQrk3DpZthjb3l0g8th3mdgNiCt6HqSkZA5Z6jJpCyXJUpClR\nkgkwkoCcJakN4YcXJYwBChT7KQjQTSiJttx5Ac+iVP8azIYdaMkPhKU+FdaWfJwd78N5Ki3TBM1Z\nfWFqkHbJi5qh\/6yLUwN0fEB4wmptRFtXMU71VCKPngp54RPDXbDkbyIwKblZTo+a7tC\/u2qZJDUE\nWL5PKXa1FRqleNqqDlYJldJWnHcadmhWMj1tGShe8vzW4FjUr2BO2YLWo4HorT6AwaYcnLGcwPhI\nl9DYcCfOWDsxOtSB0wMncdrSjpH+Ngz3tcDSUYPm2Gdw5CMZuXkRMIKAnCWpClIvlJH1SukJa6Ry\nHbqPeqI7h\/qzn5IauRR1oWqYKZGOh3vQk5iawkEp4Bmcw2IpPINnUE\/lc8eiXkNl7GtoztuL5lyW\nn5A5fTdq03bhpOEdMUfSNhnydysXAalZOEtSGaS0sXtne57Ft9dfxvd3fNFdtBaHaJeRRhMa9xEM\nbYlKA8jK\/irRNwt2K1CuUVNYKAncU4QIL4Q9UE6\/GZAtvRTevgA+z16qpeuTtpJ3SHm7GNQd4QTk\nLAY01sWqcH\/mBdw7\/zxuTz6L62NemGhbSztadwGWS4W0aK8SxQTI2yIurIV+KtEF+BxnYMEesjgp\ncYs7lQ25gK\/XeaIuzANmHcsTJq2HaGsZvkoBlrhFRjtp8sQOBb9JoP3ASie5LEjKA1SvmAnw+sjP\nMTfwFK70PIm7F31xtnMdbRjdhdV4x5FPVivaqxKNnScp3LP4e7ELSEWxzSVX8WScmQm0OE6ATDpe\nGaNEzX6K8SgqZ96ctUoBd3CzVPznhfNzcJjXSie59In3M2T2xlHTGpxrWoNZy0aM1L6IAhosfpNU\n3Jy7k5KFJmKrGQiG929sMQbLJkAutpkEnUOuyt65qFSCtJSvE2HDumr1orGfQEYwv8VQCrD9NH7C\nZhnKKIzoIR3ajSudtCLO8QquJECW3mZQ\/dhj\/EeU7Vdi93opuU4qrMZweQR5lKDSCYbbE7tTWIhd\nRmKrMRgX3cxPlHRMgRtnnsODSy\/gq+nn8d2dSNwaX4ex1nU46C0XYHEEeMBbipaoNQijeAsmqKXS\nvvGzR19qJr4ndUvxkWti3pcZaZI5diFbjeEyHlotnb4N3J5E5klFkc0kmMMUewwmtIMBlSKeb44+\ng3nr07gz9WvMjXihv9oT+z+UE6QMsZvcxXXNkZ4IesvFWY1\/1WvhQj+FV\/ZOWRzFXR9BLbA7uT2x\nOxO3LgKy1Tih7GCcBBxnEw1rcalrHS60PYG709SdKl4gFxMYAcZT\/MW8747GiDVU4pQI3ODyk95c\nsbDz1YcvMP\/WD79Lzt4l15DrG6k9zbEr2WoJ5KrUj+UCzOCzqBwq\/rYTFH+Dm3BjKgDWSk\/se0cm\nXLz\/Q\/IOhU93\/FpE0U5q35suQgFvrFgI2PAPr0j+np9mvYcXlaO44r2qvhJ\/9UIBZXjqdgUSKFMT\nqVNUxVOYRKig\/UAO7dtSAV8X5ingjlCJ8n\/DBXtfX7FAivt\/W+5v+XQlSt1649d6UUE2mrRqmylE\n9WMh1dESqo2VQSrxzTvo+M2uc\/6vrzD6r\/+Z5i+N9T8uYvzmaPTaaAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_b_brown_02-1334256266.swf",
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

log.info("musicblock_b_brown_02.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
