//#include include/takeable.js

var label = "Musicblock DG-2";
var version = "1347492224";
var name_single = "Musicblock DG-2";
var name_plural = "Musicblock DG-2";
var article = "a";
var description = "Dig those crazy pincer-snapping beats.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 400;
var input_for = [];
var parent_classes = ["musicblock_d_green_02", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_dg",	// defined by takeable (overridden by musicblock_d_green_02)
	"music_duration"	: "6000"	// defined by musicblock_base (overridden by musicblock_d_green_02)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANcUlEQVR42q2YeVBUVxbG+8+pmkQl\notAbi6OT6BijMRNNxJAYIy5RUMQNEAWbVQXUGMUFBAQEoVWQRRAQ2Vtp9k2gbQRRUVwRdzQaYzZN\nMpm9pr4552K30I2pmVSo+urR3bff+73vnHvOeS2RmPzFzbQY2hgw2rF75zjn7rBx4T2b3wi\/uvGP\n2iuks4GjwjtI7f52QqdIel+Syi64RWXnaFCjSuHY7CO1lfzWf1\/vmeh1J3ICHkRNwLUtY9GxfjTO\nkK5s+CMuPZfezw7tAfZo87dHK0nvZ4+TvnZoITWr7NBEalxjiwYfW9SRar1tUbPaBlWkilU2veWr\nlLoyL4XuuKdCd4yk8VSo85fLvbIW\/cINsWv3d7918R7BXdk6FqdDR6MpwA61KhuUr1agdd0oIX6t\nXSVHoz8B+NniuJccLQRb6a1EnfhMgRN0AxV0rFqtRL3KFmUrFajxZjglyr2UDAktHctWKnGcpPFU\notRDgWJSkbtClzTf0tEM8Mmet7Vfxk2CniAYjKFMAfVr7VG9Rimg6gmu3tcWmpVyNAXao9ybIGht\niacMDf52KPKQoYwg68jVQncpnccWpQRaRnB81BBYibvCCFi0Qo6cpTJkLpYibu4IxMyx1LJpAu7b\n+EmOj2InEkCfQ6aAVT5KAXeSxP8LQIKrIzHYCVpXulKGOoJmmAZysMhdhmNeCtTSmoIVUroxOxR7\nEhCFuYiOFZQCxQTXBzO4Ymdbhve5F\/92TseGMSJkDNQS5oCTKUHoyFiPtrR1aE9fj86sEFIo2jNC\n0JoWjI7MUJwh6Q+o0BIxG9VbZ0K\/a4446uh15ZaPURs2E83hTshfIUMVA7JzFOZCTznKffjmCJ7C\nGkswu2ebK9rJ8plwkdzrZTBWhJMlKvLUuHquGd3nW9DTdRI3uvS4eekUbl1uw+0r7bhztR13r7Xj\nXvdpM\/H7\/Dmv4\/U3L7aK71+\/oMO5mmw0JXmjyHuMgCsjHaXQqheMRDQDDaKo2cO9JHci3hRw8Z+O\nxJqP7AfA8QX4Qgao3usduN9zBg9unB1U\/BmvMcAyKN8cn4fPx+ftaq3AiWgXCrct8pbLkLXEmkJN\nkE4jzBQ1y1Ir6d42TgCq3h2CzW5TX8DRiQ2O8QUNYA9vdeLR7fNCX955IX7Nn31x85wRlr\/H3ze4\naYC83FaJhi3TcYQAM92skU6bI4qiZ6pIp+G9kmvbxorduWLSK9iydKrROYYzuNYf7PHdC3h8rwtN\ndaW43NmEr3ovCvF7\/JkBlkEHg+RwX+tsRlfVQRx1l+MQAWYtkROM5aCSnNs4RpQEj7dfRdiy94xh\nNYXjCzMEw3x9\/zIcZjjAL2D1gGNszHbEkHgdr+fv8ff7QxpyklOpYccs4d7hpXLKOUvsmmUuyRna\nwZVUPrwmv4ody98XoeWT9YdjZwxgcbE7sCduJ\/wDvZFyIM4ofs1i2Ce9lwaFNOSkIdRnqTqkuUrJ\nQRnt3JcAcompoE6w+p0hCF8xzRhaDo\/BOQPctw+uGkHYsdSUPfjxqx6hHx5fF+Cs5P2xuEJhNEAa\nws3n7R\/qC9mhSF1kjUwCpLKCiE\/MJeFCq6XC7EObJMJj2gD3RM7RRdgRhvv+4TU8+7JbALXpKnCH\nXPnLN7eEfvr6JgKCXsC3NBzrc5Lc5\/MM5uKFnFAcdLVGhptMbIrwT8wlaaTWxDmomjIUkZ4ORvf4\nrg3uffPgCr774gUcA\/31u9v42\/d3jPr529tISIhAQnw4DibH4TrlGrvO3ze4yDfePxe7cjYgmRxM\npTBHUjh3zhxuJkm9Xx+g\/9ShOBC6aEB4+e77u8dhZKcY7u9P7+KfP\/TiXz\/eF0d+vTdhl4BkB082\nlokbM7jI5+sf5v6ABxZaI3GB1eCAond6yBH43jDk7Q58KeDTR9eM7rFj\/3h2D\/\/+6QH+8\/NDceTX\ngWvXIGCtjwj1+fY68b3BAEWYKQ+7cjcIuP3PAXcQkKkkPHFkLLbC2mnDcDTm1wE+pBCePVWDxL2R\nwkV2UH+izAyQ89AUcL+LNdQuVtg73wrbPx5uJgmPQumUqMEOFsh\/Dni9uwVRHSqEti0SKrua\/Ish\nPpSRKKAChXs+Yh2vf5mDxhAToNrZSiiBALcRkKkkPAoxYOh0CxTEBookLjqfgLlNY41a3DIZPXdb\nzDbJPbpgRvpeZKTtFXAiB+MjxDoG5BzsaWpDd4PerNS8yEEZkhZY0yxghbAZw80kqaIRPY0AN35g\ngUICZPt3tfsMAGTtO79xQJlhJ9tPVgrnOO\/4+NOTG0Y4g3t1m8uQPikDNRuPIcshC2eLGoxlhgEP\nLJRRmGViWAmb8ZqZJDw8MuDmD19D0XNAD52DGWBou6txN3M+8kbgksLHI9nJomj3hzOUmNrPjqN2\n03Hhnv5AFSpDS9Gpbegr1FQHGS55YR\/gVgIylYSHRwbc8hEDBoi7M4UTgJSL7IihJrJjhqLMG4LB\n+P3+cJx7Ra5HhXuGGqjbV4m0iemi1XEn2edMgIvk2EOAzGAqCQ+PDMjxzgieI3Jjvd7ZDLD0UpLo\nKr4Bq0S\/ZRUXZAgghmYxmGkfZrjCRXnG3duirqBnkDwx0ZzPDkGSsxQpBBhHgJ8TkKkkPNkepl64\ng3ZMvNsb4s40Z\/YPgPPVO4kk55YVs3sbTSzbBGhhfppx3Oo\/chlmQy4r1Rs1qNpQamxxNWEaHHXO\npQm7Dp2HQ5BIgAcXKxA3jwApzUwlMUy2PDlw79NEeaCrvR51bTlQn9qIfe2bcKmrni7QN4Kp\/Lyg\n8vcSoQ3ZEABf\/1XITE\/EPnU02loqcKq53LhjOawFC4+IvGM4jk5TohZFy\/Ogz63AuaxgJCyQYj85\nGEuAvA9MJdHQo2DuMhnlgpWA5KZd8NlsnKrKRWdrDS601ePi6UZcPtuIqzSgZhHM4UNq+Kg88fmW\n9QJ0je9K49Hwf3VZnsi5ypBS5LscEbu2\/Wg1ND75qNlVio7KapzLXE\/1jwBpk8TOG4HPPrQwk6TU\nywY5BJizjKZbmmyj+FnAqe\/JKnnFWGQGTEdxhDu0e3zRfCQaJ4uTcL6tFl2nGbwel880opmma01R\nJtXDBKHY3duhqz9GnzWhbG0hUmlTVGwuQon3URSvzkNbeSU6qfO0xi1E\/Hwa+em6MfQIusnRwkyS\nEgLMpomWp9p8d6V42iqgh2lWFr2XskhqhGbxY2ICJXTyEnscDiL4bYtQHu+LhkNh0BUmob2+BGd0\nVUIdukqh1motmo5oUJ9eguYSDU7RrtdX56MqaBztXmukuf0CYKGnzTN+JsheLsep5LFoVr+OhqjR\nyFiiEGOQhnL0GEnrYyeORz364Blc7Ww9AJ7BE6ll8YSSHeSAvHXTUb7H2yht3GqURHmhMNILtTvn\nUMTouXgejVu0SXbTjXOzMJWkwEOp45G7+9gkPLs2DU+7XVAdNxY76FmB+2PuCiWdQCbCn71cKfpm\nOg2Y+Z6Uu\/S6jMDzCbp0FW02dwWtVwj42DkjB8D33YCV+Pw4RamYcj92npSck1KIFYgmwA0EZCpJ\nvrtCne9vg8cd7+Jh6zvobZ6MG42foi3\/Twh3GokcgkghJ9MpDIeXKahuWeMg9c\/MpUoakeh\/V7no\no2luCqQt5guNpPUyZDOIjz1FwA4ab3KfVLDShjaEFPsWUq7PtsJugts91xq5lFrRcyxpHhg2QCEO\nw3opxArH\/AAb3K6diJ7yCbiqeRP321eio3g8wmeNIKi+cDJg1nMobk+HligRO9dKdIG9lOhcbFMJ\nkndkPO3M6NkjxQbYT+7nBtqgYB3lur+CHLNGkosCu5ysCIpShMQ3HkWAIQzVXw7DtOL3mcPLZOFt\nKa+jM+cNXC75CLq0dxBJQ+zOT0aIL6eSS6mL5QKKYbg9pbspEUNucbPnbrCPjinkYIqrAsm0PoHW\nNR0YK9KG1V0zD92Vb0LtY0PFWY6IWVYCLmq2NYppo+6ip7r1DsNMFWz8CS7HQxZeFT6qtypuPLU8\nWwRMGyHCya4xHDd0BkykwspAhnAymPq5awa4A+Qmv3\/nxGQ8OTsFj9r+jKe3NuFu80To88cTjJSa\nwkgBF0mq9rNH6AfDaGgeOkBB7\/9u4I+apW4WQ+PmWjlvnWmlPuiq0HE4GYrzzOAawyUt6GtPDJhE\n4WagGAo3H7kr7F8oF3l2n+bIuw2TcKt6Inqpv3fXzkMdRWrnLKkIMbvIaytpqg98f6iJhuT8Tz8L\nH3JTONJQGb7PRapNdVU84965lwA5nJyDSS5SARZFhd0ApqYc4zzryBqHKyXjcTF\/HB60qdCSMhl7\nVkqx\/Tng9pkjoaWB+TCVuID3hhjlP3VIr+9kydBf9Tt29Nxhtsmu0mDa3dpEZ+te3hTsGruZMF8m\nwFicZ0lLZdAnj0FH5gT0nPAgwNfh6ziCqoM1yQqHlirQvO4P+HyGBfwITIjg\/N79\/Vu\/2Q\/vzUH2\ntjV+ds5UF9UErcvzsKG6pqQhQC5yLIY6RS7ldGqgLYI+sULIB1TMXeQopVrIcDHUg1VTh2ANgamm\nDAn+1c79P38t6+wcm9aOCi5X2Wk13ra9XJg5lGVruCbaosiLCv5CekiaaXFxzZRX1D5TX\/V62bn+\nC1GjhbUNH\/hkAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_green_02-1334256666.swf",
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

log.info("musicblock_d_green_02.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
