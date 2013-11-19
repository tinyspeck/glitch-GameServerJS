//#include include/takeable.js

var label = "Musicblock XS-5";
var version = "1347492224";
var name_single = "Musicblock XS-5";
var name_plural = "Musicblock XS-5";
var article = "a";
var description = "If you played a butterfly song backward, this is roughly what it would sound like. You can barely hear the demons.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 700;
var input_for = [];
var parent_classes = ["musicblock_x_shiny_05", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_xs",	// defined by takeable (overridden by musicblock_x_shiny_05)
	"music_duration"	: "6000"	// defined by musicblock_base (overridden by musicblock_x_shiny_05)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/musicblock-xs-collector\/\" glitch=\"external|\/achievements\/trophies\/musicblock-xs-collector\/\">Musicblock XS Collector<\/a>"]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANuElEQVR42q2YeVBUVxbG+8+pmkQl\nItAbDRkziY5JNGaiiRiyuKBJRDFqFBBlX1TUbIpRVBAQtFsEBQQEkU1QGmRfGxBoAQFldUeiMTGL\nZpvMVlPfnHPJ60CjqZlUuuqr26\/7vXd\/95xzzznvyWRmn6h5FuOrAiY79u2a6twXMjV04KNnQnve\n\/7O+m9Qa+GSokdTsbyd0jtTgS\/KxC67zsXOUVOWjcqz1kmtkv\/fn3v7pHtf3PoehsOfQu20KjJsm\n4zype+ufcfFnNfjZoTnAHk3+9mgkNfjZo97XDnWkWh871JCqvDWo9NKgnFTmqUHpelsUk4rW2Q4W\nrlMbCjxUhjPuKsNpUr67Spe5WumR4vIrC2Kr3dr3fNdNguvePgUtWyajJsAOZT62KFyvQuPGJ4X4\nWL9OiSp\/AvDT4IyHEnUEe9ZTjXLxnwrVtIAiGovXq1Hho0HBWhVKPRlOjUIPNUNCT2PBWjXOkPLd\n1chzUyGXlOOqMmjfsXQcA\/jF\/hf0n0XNQANBMBhDmQM2bLBHibdaQFUQXIWvBvlrlagJtEehJ0HQ\nubluCvrPToxnPFQoJ6tmu8rpPhrkEWgBwfGYT2CnXFUmwJw1SqStUiD5XTmiFk9CxCJLPRtNwH0V\nPcPxTuR0Ahi2kDlgsZdawNWT+DsDlhNcGYnBqum8vLUKlBM0w1QSYI6rAvl0HoNlrlHQwgjanYDI\nzTk0FlEI5BLcMMzDFelkGTpsvegX0oxbnxIuY6C6EAfUxwfBmLQJTQkb0Zy4Ce0pm0lb0Jy0GY0J\nwTAmb8F5UsNhH9TtdkLJ9nlo2LNIjAY6PrvtTZSFzEPNroU4uVqBYopLBssnN2e7K1HoxYvTIIvc\nGkkw+5zGKnyh5QNhRbLeIIOxdi+0RFGGDj1ttei7UIeBznpc7mzAlYvncPVSE651N+N6TzNu9Dbj\nZl\/LGPHv\/D+fx+df6WoU1\/d3GNBWehw1Wk\/krH8KeoIrIJ0k1+qWWCGcgR6iMKeJHrLru58VcNFv\nW8H7dftRcDwBTyRBDfYbcWvgPIYutz5U\/B+fI8EyKC+O78P34\/t2NhahOmwpuVuDDLJuykobcjVB\nLpw0RmELLPWyvh1TBaDPS+Pw0YrZv8DRjSWL8YQS2O2r7bhz7YLQZ9d\/ER\/zf59eaTPB8nV8vWRN\nCfJS01lUbJuL9PdoY6ywQSJtjjDynrn2Lpw4KOvdMUXszjUzHsO2VbNNlmM4yWoSWFVJLhzecEBy\nkha+AeuQckyL2EP7kJ2ZIMYWQxGqSnPRVFeEiuLsh0Kyu3vba9FZfAQZrkokEVzKSiXBWD5Usrb3\nn6Ltr4LbC48j5L2XTW41h2MrtdSfFWCpx3QC1C9g\/UNHPodHvo6vHwkpxSSHUuXOBcJ6DBjuZIk9\nC8ZKdp52cBElWo+Zj2Pn6leEa\/lmI+Hu3ujA54NdqK3IFxOnpcTCP9AT7U3l+OZ2L\/pp0vqqAnFc\nV3kaOZmJwqK8qJGQUkxKrm6l7JCw3IbcrKCd+whA48+A618ch9A1c0yuZfdIlmO4e7cuoe1cmQBL\nT40VoOdqC\/Hd5wNC397tx\/07vQL4q6EefDF4EXdvdorrOS75fnzfka7uOL4FRwnw2EoFpxXsnj9W\nMk60ekrMXrRJdrvNGWU9DnyehCfjSdlKDHbieBwCgrxwsa0GP3x5Vej7e1cE6IPP+gTkl0Pdw5Bk\nfb7Pw6zYkbYF8S60SciCvClC54+VrMrfTsSgz6zx2OvuYLIer1qyHk\/29ae96GipIDBPZKTHC1Bj\nYwl++ua60I9fXRsFyeez1fl6yYq88JGx2Jm2FXEEeMRFLty5a97EMZJx7WRA\/9njcXiLyyj38uol\n67FVztXqBVjmiSMI3OgNrTYMQRt9kH0yAUmJB6DPT0PCkWjhbnMr8v1GulkCPLzMBrGkg0usHw2Y\n46ZE4MsTkLEv8JGAHF9d5ysRsMELhafTCcwbH28PFsBBm3zEGLjBW4xsRT7fFItmgMLNFIed6cOA\nuqXWAnAnAZlLxkU\/cbk1NsyZgJMRvw7IE3O8sUv\/8eAm\/v39EP7z423cJhe2nivFwQN7xQJ4IQ3V\nBWMAOQ7NAQ8tJUBnaxx4xxqfvDlxjGSlVMgTaScFO1ggcwRg\/80e9A4NoP\/2FdwdGg58dh3H2d++\nvoa\/37+Bf347iH99d0uMfBxIcGxBjlMeH2VBk4sJkOG0zjaIIcAdBGQuGbdCCe\/aYMtcC2RFBg4X\n+4FWZN3\/ASe+\/Umo+Ys7Iug5+CUrMiRbksF45OMDMXvE7o7ev0ukoxsFelxOzRiVaq42VeNyq+GX\nTbJMQe61oV7AGiFvTBwjGbdCnCzff9UC2QTI5jd8etMEx2JYyYoSJFtSSjFSmmE4thzD8chwPQeO\nmtIM7+LuhFR0RRxGf0u1AIxdqhDiZiXkjSfGSMbNIwN+9NoTyPkZMPfrB6MAh61427SbOR7Z3VKS\nlhK1ZLlTWcdwODZCpJiB5HQMZGQJ6127UI+uyDgCjEVPeZHIg4ecfwHcTkDmknHzyIDbXmfAAJFE\ni+\/eHQNYfe9z3KBEy6Vs6HKbAJVgpQoiWU6qyRx7g22UkLeGoz8nF5d0ibioTUC\/oVyUOq4kWmc5\n7WQF9hMgM5hLxs0jA7K\/k4IXidhout4\/BvD6zUuoLj8lJuaazDmOxVaVvkdG7hRwERE74Ou\/zrRz\nr9YRUHYO2gNC0Xe2wNTRXDi+GdolcsQtVyKKAD8mIHPJCqhxTFkpx07aMdErnhnu17qNo+AqP\/9M\nBHmXsQqxunAqcdXCfeaSuhiG41GKO7Zcb1YOOkMPoqfojJijm8pke+pmHBCAKkS9RYAUZuaSnaYn\nrRPU2XKp4dqXH+aGzuYKXDJW42JHA873d6Cvm3NXkykFVZbkCIAdO7YKmOTEgzhE4FknjkJH1eUk\nlUIt5USGY8u1eYagv6oEfRVn0RWXhIsF+bjUWo22lGBEv0MudlEikgB5H5hLludhKzrbQ5SPGJKL\ndtaHTjhXnI72xlJ0NFWgq6WKbliFnvYa4R5uXL183LEx2FeAevuuHTUOP5tQrqspQ8e2KPRXFovm\ngK\/tSs\/AhXAdOutL0Ja8iQBtKFkrCHASPnzNYowE4PFV9Fz6nlK0PWH8LLBw+Mkqbs0UJAfMRe5u\nV+j3+6L2RDjqc7W40FSGzhYGJ0ufr0JteR7yc5KRlBCDSIq\/7tYaUi26igvQ5r8TXadzcdFYSddU\n4kJeDlpdP0TbqSw0Ri6jzWGDhBVKRNAj6AeOFmMky12rQSoBsjJd6bmXHwfpYZqVQr\/Fu8hN0Cx+\nTIyhgI5baY\/UIILf4YLCaF9UHguBIVuL5opTOG8oFjIazgq10CMAq7muEE2l+WhOSERDbiqKg6aS\n5Wxw9F3VowGz3W0fcMudulqJxvgpqNU9jcqwydSjqaiZlCNvnQanaSMVeNkhn8aTrsPwDK6jEjUS\nnsEPUsniFup4kAMyNs5F4X5Pk\/RR63EqzAPZez1QtmsRklaqCUyOIwS4jxbOxcJcsiw3tYFb7r4z\nM\/Cgdw7u9y1FSdQU7KRnhWiaLG2NGkcINIkX8Z5a1M5EcslJNwqN1WoBnummFgvJcFUhfY1KwEcu\nshoFP7wAa\/E\/eynXQyPg9i1mF6sQToBbCchcskx+u+Rvi7vGl3C78UUM1s7E5aq30ZT5F4QumCQg\neELuehlQS3Uz3kVB8aqmDsSGrKUUdTSBrHBUTGSF+OUKuo5AvOyRR1bPX2+H0560EHdbsSG0S1XY\ns9BawIUvsiFoNY2W1A9MGKXNDhMGZRnuKkcGvFY2HQOFz6En\/1ncal4LY+407Jo\/iaBUBKEgACWS\nVw1DcWlKWkHuIRiuArwTOVXEE6SO\/ouh1BHmZCU2wCGCTQu0ReYGinU\/tQA66KzE7gXWCKPvYU42\nSKE5wghwM0ONlMMEvXg\/k7pSEdoU\/zTa057BpVOvw5DwIvZSEzsMyC5WCrHVYt7m\/k0u3LKPAGMJ\n\/iAdawksnhIuVwWGjSHo6sNTRNiw+krfoiryLHRetohZoqScayXg9pJyKZPsoae6TQ4TzBVsegWX\n6qYILQ59crA4ahqVPA0C5kwSbRBDMdxhAkgkq\/FvXJ4kdzIYW02yYixrmVL8fr16Jr5onYU7TX\/F\n\/asf4EbtdDRkTiP3ymnxVjTaCFeX+Nljy6sTqGkeP0pBr\/xh9EvNvBUW46MWWztvn2etO7JcZWB3\nMmA8TcpFneOMrcXlid3JbmQ4tqKwJoEdIukoxjjObtXNxI3KGbhaMh2DDc7oK3sL5eSpTxbIhYtD\nSXz+WV87BL4y3kzj0v6n18LHVqgcKQZDDy2V68mFD2KWyEV5YndGLLYWwGy1vbRLR8JxnBlTpqL7\n1DR0ZU7FUJMP6uJnYv9aOT6Zb4NQslzIPCvoqWHmFBfw8jiT\/GePG\/SdKRv\/m95jhy+eoIlbLg9O\nXa3WH1hiM8i7ksHCF1kTuEKAHSBxnGmpMjXEPQVj8nMYqHYjwKfh6zgJO8m1u8h6SatUqN34J3z8\nhgX8CEyI4Pxe+uPzv9uL99oge02pn50zpRAdQRtOUH5MoFhlQN4A+2hTpW3S4GigBkHzrRH8qpVY\nAKcfhougGuwzexy8Ccxn1rjg32y5\/+dTt9HOsWbDk8GFPnZ6qj6DpykxsytFNaLvOR6U8JfRQ9I8\niy7vWY\/pvGY\/7vGoe\/0XSuWd3WVryJwAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_x_shiny_05-1334257307.swf",
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

log.info("musicblock_x_shiny_05.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
