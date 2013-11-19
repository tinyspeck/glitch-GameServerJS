//#include include/takeable.js

var label = "Musicblock BB-3";
var version = "1347492224";
var name_single = "Musicblock BB-3";
var name_plural = "Musicblock BB-3";
var article = "a";
var description = "Lie back, close your eyes, and let the music wash over you, like the a cool sea breeze on a hot Alakol day. Or the tongues of a thousand piggies.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 500;
var input_for = [];
var parent_classes = ["musicblock_b_brown_03", "musicblock_base", "takeable"];
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOYUlEQVR42rWYaVSUZ5bH68uc04pK\nURsFkWxm\/+KcaZM2HSNtOouitg2KyiJbse\/gwhJZhGIVKASEAopVVgWKYhUFClEUFUXiEjUaYncn\nmaR72lnOzNf\/3PuUVYNU0nPOnB7O+Z8Hql7e9\/f+733uve8rkSz7SfnYyfFqwZu6O7q3zdfyXjNP\nZ71snvr8JfNEmptxOFGdNciKV2eZSEZWrDqrJ9Y5oS9K7X7aJoV7W4z0Jcnf++d22dsJN4vfAoFh\nIv1FDB18AcOHXsBk2osYT3UT6otzxkCCC\/rjXUCA9LcavbFq9MSocZrUHa1GV5QzOkntkc5oi3DG\nKVJruArNoarFplCluYFk0JCCFeb6IIWuKkAeWOL1N26IXROOFbwOc+bLGDqyFqfj6QLRSjSHy9Gf\n7CLEnzWFydAVp0JXrAoNoTL0EGRLuALtUSo0hirQEe2M+hAFmsP4M2c0aBRoI9DmMDpXqBJNoXwc\n\/a9GBUOIEvXBStSS9EFK1AQqzMc8pe72zuneNi6UvgVjsquAYKjlgMYktQBrJKhOguuIoQtoZDhD\ngM0EeIoAa4P5O4IiUAOBdcQ4oybACW1RavpOgcYwFSoD5DAQaHWAwgZIYCj3k6Nkvwyf\/84RaTsc\njSkfSxwF3L2yt9xvlRBckosA+ilAhusjMRhDMVx7tEqAMVBdiAytkXTRQJmAMmgIIkROxzjjZICM\n4NXQE6CBXKyhtZkcrSE4AbPzp5W6Y03WM\/feaRo6vBbdcSoBVJ\/wj2jOC8RIczYmTpeQSjFtLMNF\now4X+8txoa8c52ojMUYarbGsQycjMFCyG21pH8B4zB2nUj9AR\/om9GS5o\/KADC0UagarJ+eqAuVo\nopxsDCf4IAXSBYy9UnY4PhUuLpS8tWhxSoEDHzigXZ+PS5MDuHJhGFcvjuD6zChuXBnD\/NXzWLg2\ngS+uk+YmhW7fMNskPqPv+Jhb18Zxc\/Yc5i6fxbVLI5idHsHkYBP6T2hQG\/UmGgiOxeE+5vnTgKy0\n7asDJbO0Yxkw4\/dS+G1xw4x5UMDxifkCfCErGIPcuTmFe\/PT+PLWxefEn929eUF8L4Cv\/w8o3yTf\n7OWpIVyaMKHvuA+FW4WKA3KU+jghy1OKlO2Odjri4WiUTGe\/IgD93l+J2D3\/ZIOzumYF44szyP2F\nS2gynEB3Rx0Gja2YOHtGrA9vz+DBFzPie4ZlUHaVb87qphXy4tlOdKVtwAl\/OY7vd0LxfjmOMNAy\nHfZwXJRcIMBTUQp4\/nIF4vdusIOzOsYX\/urODB7dvYzwiEChzR9tsq2s0pJj4nuGtYLyzTEkn28p\n5NSZEgqxAsX7ZCjzVbBbPynJaOpaset2b1iBxH0bxEmWwrFr7AxfeMTUDl1pLqYnTTg71IVynRZt\nrdVi1ZVpMTrUicX7V\/H1l7PiZvj\/lkJaw805yanUnfEhigiwlABp15Jj9pKMpKxFS4QC3u+uQPL+\nDbac45Pyya1wfGFdWa5w6k9f38S3i\/P4bvEWvv9mQaz8eURUkFgZlCH5\/5ZDcnQ4SpxKY\/pwFO6V\nocRXTjm3Boe22UsyTF2Dd\/D+X63EYd93RWJz7nDOcZiscE++msMfH98QMP\/85Av88OQ2fvzDHfz5\nj3fEGhkVjMKCDAF5yWzCNw+v25zk8\/D5OCrWULOLE\/WRyN9LOejzNwC5ezRRW\/LduBIp\/u+Ju7SG\nlnOJL8IXs8IxGEP9y7d38dfvv7Tou3vCuajoELGOj54Rx\/P\/Pb53RZyHz7fURc7FCQMBels3yRoc\n3GYvSVecpTX50y5OJUC+S77b+QutWJiqxb1LBvzh0ZwIKTv3lz\/dEUD\/+sMD\/PufvxL6tx8fIjpG\ng+NFWQJy9uKwOJ5dZ\/etLoqdfd2SixzmSUMU8ggw31sm8i15q70k3Kq4bwZQkS5M3GkL74BuM\/qz\n5TibrxRucK5xKK1w\/\/GXr\/Cff32M\/3r6tVjZOYbk1XyuT7gtXHxwzZaLS8PMm4UBtXuckLubaqGX\nE5IIaLkkoqEHyRC0yQE1ORoByEndX7oZPZlyDOUqxKZgQA4th5Qd+\/r+LOpryzDYf0qsMXGhqKk+\njuqqIgHCx88tGHH\/7pQIs3Wz8PmteTjZYAHMYUBPAvxsjZ0kPB4V75Mi5EMH6HM1yA9ehcroNWhI\nlqIzXSZcvDmQhC+GD+K7++M2wCsXh4RbcfFhtjqoJ0D+nm+EARtGk1DS44\/wmndQ1OWDk70xyGza\n+Rwgwx3zkolukvjZajtJeBQqop0UunkVagkw+4ADysJXQx\/viNYjTjiTIcdAjgJjBUoszrXZQvz9\nkwWRa3fmp8QaE6tBa1MVpieMlHfXBGBelxe0nV5oGU61OXi0cSfaB3IxMdEuALM9ZUKZ1GoTPl1t\nJwmPQkX7nBD+m1Wo01oA2cUKctGQJEV7qgy9z0L96FqrZZOQS9ZNwrnIqyUHLbt4cqxXbBJtpycq\nesPQN37cVmoCS99EWXsERsbqRQ7m7pETnNPPA\/IoxIBRW1ahXhuCcRqnJk0VqE1bj+pYRzQelGLo\nxG9wvnoLHt3oEWXGupNtZYbEcMWFmaIeXpkeFnlbO5CAwg5fNA4cEWWGd3F63Q6k6rejb6hCAObs\nlgvxsBL\/yWo7SXh4LKQQx3y0WgCKNkeJXJO+EbqI1aiJc7QVar6otVBbizTD8srOMRyv50a7xfHZ\nrb9HWbcGJR0h6B87gXFzi4A73hqGwdE6UahzvOS0i+U4SoBxBLRcEh4eGTDuYwYMtrW6qrSNyKNQ\nl0euWdLqtAJgaZuziuEK8o8iIjJI9Go+PrNpl4ArbgtGk\/EoytoikVK9XZQYbnXj9RHIpg2i9SbA\nXVLBsFwSHhwZMIFoS+M+Ev\/8c8NCa1OlmF7YHS7eXOesEpNNpKUXjwy0i+Mru2NxoisaHYP5tvq3\nL+c1FBg06B\/UY7zOApi3VyEAYwlouSQNYc40TciQ9OkaZOxdR3c2ZAe5fNzS5qYJMWwtlRaecPj3\nspIcMXJduTAobiq9dicKWgLRZtKKHs8tLln3GfLqQtBnqsH52nBkeDIgPZ8QYMzHq+wkMYRaJtvD\n3Puocjdme2N6vE80\/KtUPuZmeKo+j1tXacKZMwtHjx1LQWpqgnArLDzAVgdLirMFmHXC5pBm6Peg\nsj3RNsV4pb+K3Jog9PadJMAw2hwy5OxR0AMUAf52lZ0kdfR8Wk6TbQ61GoZMoZ6oP7QFo2eqYR7r\nwYVxI2bEM8rQs2eUs7hx+RzmZ8cJmiaf6\/x8YkZvVyOmqMVZ\/qZJmtw\/VOGBg+XboMl7F\/nkWp4+\nBHFFn6CmJR0DJgPGakLJOSrStFHSCTCagJZLUhviDJ2fAjp\/BUp8FAToKJRKI3e+\/zqURb2H+szd\nOFUQAFNDBkbaCshhIz1YmTAzNYjLBH5liWaf6cr0EE3OgzSYDmB4uAk9xpM401uF\/OpwTNJjwsTI\naZgKPiMwJwqznB41pYj6aJWdJHoC5JGbp9rKQKV42qoOVgmVEThPGpmUH1bwdHra4r\/zfVxxIuZX\nMHy+He1FgeirTsZgixbnTM00bp0WOj\/SjXPDpKFunB3oxFlTB0ZpKh8xnoKpS4\/W+FeR9jsZhdkC\nGElAyyU5GaR6WkIDYxnl4WiVGwbKXdGrJWh\/JQpod9eFOqOeNlJrtAuaItX0NGa5gYoApYDn1LDC\nM3g29VT+\/ETMe6iKfw+t+b5ozWP5CNVn7UNtxl50Zm6hQVWJ1J0yFOxTWgCpWSyXpCpIaT5OgHO9\n6\/DD7Xfw7fxG9JWuRQblZTZNGLoDKpp6ZSiiobLUTyX6ZuE+BSoCKTXoJgzhajRGqMUNsGo1Fvd5\nCGXQ5eLPOUp6jTM9h8joAZ0+38ugUkQQ0HIxoK46RolvZt\/Ao4uv4\/7EOjy+5g9zpxuN3FLhZB4V\nUoYqIcCc3ZbCWuyjQtYuyyRylNbC\/eQ4KWW7lMqG\/Bm8C+rC1KjlKNDvNRq1aGvZXkqalsn57TKa\npKnMeCv5TQLNAw52klQfULjXEODt0VcwP\/ASrve+iIczXjB3udHAKBWuaamhFxDgcV+VrXcW71eR\nA1JRaDOo2efQMXkUKq23QuxMvjneAJU0EDemqKBPpByPUQioLAbcSlXDQybE1+Dn4DB3h+cU6u5g\nFu9nSv0UurFqV0y3uGL2zAYM699EQbSCBkYn4VoeXTSfqj27xr2TXWPHGDCLfs\/05HlODi2FKtfb\noqMEaapwE2nDWji\/DXOmF6DV8FsMpTj3IQ++ERnKKY3oIR2azQ7PiWZUne0VXKm\/LKs9U\/W0q+gV\nlCcqEfihTEy57BrDacm1IoJix1jWcHKhzabv0sgtBuOie2wPHbdbgTvnXsOTq2\/g8aXX8eODaDyc\nXo\/zbW446CFH4qdOtMqQ7OGEUzGuCKN8CyaopQrZ5LDe7kXm557ywMStsiZK3Hme09i1fHIw+5lr\nVsc4nEc8pKJEMNRhChGDCe1mQCXuT67D3bFXsTD8Mh5M\/Rbzo+7or3ZB4lY5kikHk0h8HG+uoA9X\nPq9NK8z\/6yvhQm8nx2IfhXveHlkWDZZmaupPuXeyaxzOlB1Oogsw4EHKOSsYbwLOs4mGtbh62g0z\n7S\/gS7MXBivfQHawDPEEyHBxn0ipdLlSiVMiYNPKpXrq++tf\/N\/ecafskK6nXZdQ6q8y0uZY5FCy\na4cpVEd3yQVYpqdFWir+oyfVGDe8grkhDwxXueDAFhkSt1GIaZMUU\/r0JK1FDE1SBz5YadVT\/03\/\nsP7v9uK996DLS+3Rrruqgpx1pX7O5opANaWCigZQBQ5tt2yCMqoS+ZEqaD6VI9jdScDXhbkIuDTq\nwX6\/Xgnf91cskhK8f\/ns1e\/\/509f0lp3unhCa5SrsT5cvcj1sJFC2RjhQl1JTfXQmdKCRrytq81+\n76\/Q+W38ReDPneu\/AU65\/jP5\/zrnAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_b_brown_03-1334256297.swf",
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

log.info("musicblock_b_brown_03.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
