//#include include/takeable.js

var label = "Musicblock DG-3";
var version = "1347492224";
var name_single = "Musicblock DG-3";
var name_plural = "Musicblock DG-3";
var article = "a";
var description = "Some would ban this musicblock. Might not be a bad idea.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 500;
var input_for = [];
var parent_classes = ["musicblock_d_green_03", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_dg",	// defined by takeable (overridden by musicblock_d_green_03)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/musicblock-dg-collector\/\" glitch=\"external|\/achievements\/trophies\/musicblock-dg-collector\/\">Musicblock DG Collector<\/a>"]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANbUlEQVR42q2Yd1SUZxbG5889ZxOV\niMI0iqub6BqjMRtNxJAYFUsUFLEBovSiAmqMHZUOkaEJKAgIQx1l6L04FEFRrNgVjcZ0TbJ99+x5\n9t4XZgID5mxywjnP+WaYd77v9z33vvfebyQSo7+o+Saj6\/0m2vYemGLfu2dKyM2dr4Vc2\/5H7VXS\nOf8JIZ2kDl8roTaSzpvkZRXY7GVlq1e9l8K2yUNqKfmt\/76Knu527\/A0PAqdhuu7JqNz60R0ka5u\n+yMuD0jnY4UOP2u0+1qjlaTzscYZbys0k5q8rNBIqve0RJ2HJWpI1e6WqNpkgQpS2UaLvtKNypYS\nN0XLaVdFyymSxlWhUq+Tu2Ws\/JkbYtcehr9x6QHBXd09GWeDJ6LRzwrVXhYo3aRA65YJQvxeu1GO\nel8C8LHEaTc5mgm23F2JGvGZAg10A2V0rNikRK2XJUo2KFDlznBKlLopGRJaOpZsUOI0SeOqRLGL\nAoWkAmdFS9wyU9thgF9Gv6n9PGoGdATBYAxlDKjbbI1KT6WAqiW4Wm9LaDbI0ehvjVJ3gqC1Ra4y\n1PlaocBFhhKCrCFX852ldB5LFBNoCcHxUUNgRc4KA2DBejmy1siQvkqKqCXjELHYVMumCbhvYmbY\nPomcTgD9DhkDVngoBdwZEr8WgARXQ2KwBlpXvEGGGoJmmDpysMBZhlNuClTTmrz1UroxKxS6EhCF\nuYCOZZQChQTXDzOyIheZhvS7F\/NmVue2SSJkDNS8xwZnkgPQeWwr2lO3oCNtK7ozgkjB6DgWhNbU\nQHSmB6OLpEv0QvPBRajcPR+6Q4vFsYXel+\/6ENV75qMpxA7q9TJUMCA7R2HOd5Wj1INvjuAprJEE\nE75ouMLsTJ8LF8m9PgZjHbQzRVmOCtfON6H3QjNu9pzBrR4dbl9uw50r7bh7tQP3rnXg\/vUOPOg9\nO0z8f\/6c1\/H625daxfdvXGzB+apMNMa5o8B9koArIeVSaFXLxyOMgUZQ6KKxbpJ7B18XcDEfjYfn\nB9ZD4PgCfCE9VN+NTjy82YVHt86NKP6M1+hhGZRvjs\/D5+Pz9rSWoSHMgcJtiZx1MmSsNqdQE6Td\nuGEKXWiqlfTunSIAvd4ehZ1Os3+CoxPrHeML6sEe3+nGk7sXhD6\/95P4PX\/22e3zBlj+Hn9f76Ye\n8kp7Oep2zcVJAkx3MkcabY5Qip6xDtuN7ZNc3ztZ7M71M17CrjWzDc4xnN61wWBP719Efm4qvP02\nIl+diozjcWisKcbZM+VoqC40wDLoSJAc7uvdTeipOIpcZzmOE2DGajnBmI4oyfntk0RJcHnzZexZ\n+44hrMZwfOGnD3rwRd8lJCZEwGaeDXz8Nonj4Nf8Oa\/j9fw9\/v5gSH1OcirV7V8o3DuxRk45Z4pD\nC4dL0kU7uJzKh9vMl7F\/3bsitHyywXDsGl\/4q4dXBEhxfjq+e3wd3e01OFNfIpSVkQBff3d8\/egq\nvuy7PCKkPif1oT5H1SHVUUoOymjnvgCQS0wZdYJNb41CyPo5htByePTO6eG+eXRNQGgK0vH90xv4\n4YubBqUkRwsH+fOkhMghkPpw83kHh\/piZjBSVpojnQCprODgguGScKHVUmH2oE1y0GXOEPdEztFF\n+GIMx649\/7xXAP341W385es7Bp0uzoRfgDtiog8Ihw1Okvt8npFcvJgVjKOO5jjmJBObImTBcEnq\nqTVxDnrNGo3DrjYG9\/iu9e7xxb797Cc4Bvrbt3fx9+\/uGZSWEiscZMijSVFiPbvO39e7yDc+OBd7\nsrYhiRxMoTAfpnAemD92mCS1Pv2AvrNHIzF45ZDw8t0Pdo\/Dys4x3D+e3ce\/vu\/Dv394KI5dbZUC\nMjb2IE4VZoj1g13k8w0O82DAxBXmOLLcbGRA0Ttd5PB\/Zwxywv1fCPjsyXWDe+zYP58\/wH9+fIT\/\n\/vWxOB5PO9Lv4GYPkY+8nr83EqAIM+VhT\/Y2AZcwALifgIwl4Ynj2CozbJ4zBrkRvwxQpQrDrt1B\nSKdayID+mz1RoslEW1PpiICch8aACQ7mUDmY4dNlZtj34dhhkvAolEaJGmhjAvUA4I3eZoR2eiG4\nfaVQybWkEUMcsMXTUAf9B17z57yO17\/IQUOICVBlbyYUS4B7CchYEh6FGDB4rgnyIv1FEhdciMWS\nxskGrWqeiZv3m0fcJN88vorO1kqoTx4V4b3UVY9bl3WGHLzZ2I7eOt2wUvNTDsoQt9ycZgEz7Jk3\ndpgkFTSipxLg9vdMkE+AbP+hDo8hgKz4C9t\/tsykHo0x1MHkxCiDezU7S5A24xiqtp9Chk0GzhXU\nGcoMAyaukFGYZWJY2TPvlWGS8PDIgDvffwUFA4AuLTbDAIM7HA27mfPLuFDzzmU4roEtdacNJab6\n49Oo3nFauKdLrEB5cDG6tXX9hZrqIMMlregH3E1AxpLw8MiAuz5gQD9xd8ZwApBykR3R10QG1cOy\n2DV9T+ZeLXoy5V6BY65wT18DW+LLkTo9TbQ67iTx9gS4Uo5oAmQGY0l4eGRAjvexwMUiN7bq7IcB\nFl+OE12FIRiAQVnsKh8L844JuMiIfWLa0fdhhstfmWPYvc2qMnoGyRETzYXMIMTZS5FMgFEE+AkB\nGUvCk+0J6oX7acfEOL0m7kzTlTAEzltnJ5KcW1YClZaGmiLh0GAlxIcLeG\/fjYiPCzOUlcrtGlRs\nKza0uKo9GuTaZ9OEXYPuE0E4QoBHVykQtZQAKc2MJdFPtjw5cO\/ThLqgp6MWNe1ZULVtR3zHDlzu\nqaULtBtqpCouVMCEh+8VQCz9a66BF8\/WGqbrvBUnRd4xHEen8YgWBetyoMsuw\/mMQMQulyKBHIwk\nQN4HxpJo6FEwe62McsFMQHLTzvt4EdoqstHdWoWL7bW4dLYeV87V41p3o0juE8dV8PByxaFDn2Cd\nq5OA9fTeII58E\/3PJv2PCuVBxVA7nBS7tiO3EhoPNaoOFaOzvBLn07dS\/SNA2iSRS8fh4\/dNhklS\n7GaBLALMWkvTLU22ofwsYNf\/ZJW0fjLS\/eai8KAztNHeaDoZhjOFcbjQXo2eswxeiytU9y538Q00\n4Or5AZ1rJDXRZ40o2ZyPFNoUZTsLUOSei8JNOWgvLUd3WxVao1YgZhmN\/HTdCHoE3WFrMkySIgLM\npImWp1q1s1I8beXRwzQrg\/6XvFJqgGbxY2IsJXTSamucCCD4vStRGuONuuN70JIfh47aInS1VAh1\ntpQLtVZq0XhSg9q0IjQVadDWUAJdpRoVAVNo95oj1elnAPNdLZ7zM0HmOjnakiajSfUq6kIn4thq\nhRiDNJSjp0haDytxzHXph2dwlb35EHgGP0ItiyeUzAAb5GyZi9Jod4O0UZtQFOqG\/MNuqD6wmCJG\nz8VLadyiTRJON87NwliSPBdlC4\/cvadm4Pn1OXjW64DKqMnYT88K3B+z1yvpBDIR\/sx1StE302jA\nVLtS7tL7EgJXE3TxRtpszgparxDwkYvHD4HvvwEz8flpilIh5X7kUik5J6UQKxBGgNsIyFgStbNC\npfa1wNPOt\/G49S30Nc3ErfqP0K7+E0LsxiOLIJLJyTQKw4m1Cqpb5jhK\/TN9jZJGJHrtKBd9NNVJ\ngdRVfKHxtF6GTAbxsKYIWEHjTu6T8jZY0IaQIn4F5foiM4QTXPgSc2RTaoUtNqV5YMwQBdmM6aMQ\nK2zVfha4Wz0dN0un4ZrmdTzs2IDOwqkIWTiOoPrDyYAZA1Dcno6vViJyiZnoAp9SonOxTSFI3pEx\ntDPDFo0XGyCB3M\/2t0DeFsp1XwU5Zo44BwUO2ZkRFKUIiW88lACDGGqwbMZoxe8zJ9bKQtqTX0V3\n1mu4UvQBWlLfwmEaYg8sGCe+nEIupaySCyiG4faU5qREBLnFzZ67QTwdk8nBZEcFkmh9LK1rTJws\n0obVW7UUveWvQ+VhQcVZjoMLzQRc6CJzFNJGPURPdVttxhgr0PATXJaLLKQiZEJfRdRUanmW8Jsz\nToSTXWM4bugMeIQKKwPpw8lgqgHX9HCJ5Cb\/\/17DTHx5bhaetP8Zz+7swP2m6dCppxKMlJrCeAF3\nmFTpY43g98bQ0Dx6iALe\/d3QHzWLnUxGRy0xs98930x11FHRwuFkKM4zvWsMF7e8vz0xYByFm4Ei\nKNx85K6QsEIu8uwhzZH362bgTuV09FF\/761eihqK1IGFUhFidpHXltNU7\/\/uaCONyvq\/fhY+7qSw\npaEyJN5Bqk1xVDzn3vkpAXI4OQfjHKQCLJQKux5MRTnGedaZMQVXi6biknoKHrV7oTl5JqI3SLFv\nAHDf\/PHQ0sB8gkqc3zujDPKdParPe6Zk9K\/6HTtsyRjLJEdpIO1u7RF78z7eFOwauxm7TCbAWJxn\ncWtk0CVNQmf6NNxscCHAV+FtO46qgznJDMfXKNC05Q\/4ZJ4JfAhMiOB83v79G7\/ZD+9NAdaWVT5W\n9lQXVQTdkuNiQXVNSUOAXORYBHWKbMrpFH9LBCwwQ9B7VMwd5CimWshwEdSDvWaPgieBec0aFfir\nnfslf81brGwbN08ILPWy0mrcLfu4MHMoSzy5JlqiwI0K\/gp6SJpvcslz1ksqj9kvu73oXP8D5COM\nHTL5Vq8AAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_green_03-1334256696.swf",
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

log.info("musicblock_d_green_03.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
