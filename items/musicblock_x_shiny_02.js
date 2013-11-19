//#include include/takeable.js

var label = "Musicblock XS-2";
var version = "1347492224";
var name_single = "Musicblock XS-2";
var name_plural = "Musicblock XS-2";
var article = "a";
var description = "It's a little-known fact that this snappy little ditty was the inspiration for the phrase 'snappy little ditty'.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 400;
var input_for = [];
var parent_classes = ["musicblock_x_shiny_02", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_xs",	// defined by takeable (overridden by musicblock_x_shiny_02)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANYklEQVR42q2Yd1TUVxbH5889ZxOF\niMA0BlzdRNcYjdloIobEWNAkYokVcBSkq4hpigWU3lVQQEAUaQJSRHoZQBBBinQLgsaeommbbWfP\nd+99ZEYYMGc3J5zzPY+ZX\/u8773v3fsbiUTvL3ih4fhyt8lWPQem2fR4T\/Pp+\/wVn65P\/pzXSWpy\nn+TTSGpwNRe6SKp1JjmZe1Y7mVtpVe6ksKpylKokv\/ff45CZ6v5DM3DHbwa6d09F447JuEzq3PVn\nXP1FtS7maHCzQL2rBepItS4WqHE2RzWpyskclaTyrSqUOapQQip2UKFoixkKSQWbzQbzNys1uWqF\n5py9QpNDyrZXRKVukKsTV\/3KhNi12wGvtQ8QXOeeqbjkNRmVbuYodjJD\/hYF6rZPEuLPeZvlKHcl\nABcVzqnlqCbY8w5KlIhjClTQBApoLNyiRKmTCrmbFChyYDgl8tVKhkQejbmblDhHyrZXIstOgUxS\nhq1CE\/mRkdUowEchr+fdD56FWoJgMIbSB6zdZoELW5UCqpTgSp1VyN4kR6W7BfIdCILOzbST0TFz\nMZ5TK1BCrqbbSuk+KmQRaC7B8ZhNYGdtFTrAjI1yJK+TIeFjKYKXTUTgUqM8Nk3AfR06y+pe0EwC\nGHJIH7DQUSngakj8PwOWEFwxicEq6LysTTKUEDTDlBFghq0M2XQeg6VulNHECNqegCjMGTQWUApk\nEtwQzNgKsjbyGXIv9PXkxl1TRMgYqNrbEjUxHmiM34H62O1oiNuBK4k7SV5oiN+JulhPNCZ44TKp\n9qgTqn2tcWHPQtQeXCpGDX0+v\/t9FHsvROWBJTizQYZCyksGy6Ywp9vLke\/Ik1MhjcIaRDAB1qPl\nv8ToqXCR3BtkMJbvEiMUpEShq7kKPS3V6GurwbW2Wly\/ehE3Oupxs7MB\/V0NuNXdgIGeS6PE3\/Nx\nPo\/Pv95eJ67vbdWguegkKiMdkLFlCvIILpd0hkIbtdwY\/gw0hvysJ6gl\/b6vCrjQD42x9T2LEXD8\nAH6QFmqwtxG3+y7jzrWmMcXH+BwtLIPy5Pg+fD++b1tdASr8VlC4VUghdxPXmlKoCXLJxFHyW2yU\nJ+nZO00AOr05Dp+vmfsMjm6sdYwfqAW7e+MK7t1sEbrf\/0z8mY99eb1ZB8vX8fVaN7WQHfXnUbp7\nPk6tp4WxxhRxtDj8KHr6OrRkwqCke+9UsTo3znoBu9fN1TnHcFrXhoM9uNWKBwNtqCzJQseVSjwc\nbBfi7\/iYFpZBx4LkcHdfqUJb4TGk2MoRT3CJa+UEYzSmJM2fTKHlr4Dd6y\/Ce\/1burDqw\/GDGYJh\nHt\/ugOUCS7i4bRkxBgXuQyCJz+Pz+Tq+fjikNic5lcr2LxbuMaC\/tREOLh4tyWVawQW00apnv4j9\nG94WoeWbDYdjZ7RgwUH7ERJ8AK7uDog5GqwTf2Yx7KPBq2NCanNSG+om2h1iV5tSmGW0cp8D2PgL\n4JY3xsFn4zxdaDk8Wue0cF\/f6dKBsGPHY0Lw\/cM+oe8e9ApwVvSRIHRSGLWQ2nDzfYeHuvWkF44T\n4Im1Mt5W4LtotCS80ebRxuxIi8TXbt4I90TO0UPYEYb79m43nt7vEUD1mgL0kys\/fnVD6IfH1+Hm\n8Qy+uixnyElyn+8zloutyV6IWUWLhBzkReGzaLQk5a7mIged5ozHIXtLnXs8a617X93pxDdfPoNj\noL99cxM\/f9uv009f30RYmC\/CQn1wLDoYvZRr7Dpfr3WRJz48F9uSdyGaAI+tkopwHlg4YZQkXDsZ\n0HXueBz1WjUivDz74e5xGNkphvv7k1v453eD+Nf3t8XIn8PDDgpIdrCmPFdMTOsi3294mLWAR1ea\n4ggpYrnJ8wEz7ORwf8sAKQHuzwV8cq9b5x479o+nA\/j3D3fwn5\/uipE\/u2\/bCrdtjiLULQ0l4rqx\nAEWYKQ\/bTg0BRq0wEYD7CUhfEi76catNsG2eAc4E\/jbAuxTCpotFiAg\/JFxkB2srckcBch7qAx5e\nQYA2Jgj\/yAT73p8wSpIiKuRxtJI8LQ2ROgywd6AL3Xf60Hv3Oh7c6fnVEJ+IjxBQ7sI9R3Een\/88\nB3UhJkCGi7QxRRgB7iUgfUm4FYr92BRe8w2RFuQ+VOz7mpD25Eec\/u5noYZH98ZcJAP0wPi4cMTH\nhgs4kYOhvuI8BryVm4drSSkjtpob9RW41qR5tkhWyii8ptQLmMB7wYRRknArxJvlJ+8YIp0A2X7N\nlwM6OBbDal3UQrKTDTXnhXOcdzz+8OiaDo7dY7iu8OO6bYZXcWdsEtoDj6L3UoUAPLJCJsTNiveC\nl0ZJws0jA37+7kvI+AUw85unIwCHXLyrW82cj7wQeEvh8fTJaLFpD4fTbjF9CafQl5Im3LvZUoP2\noGgCPIKukgKxDx62eQa4h4D0JeHmkQF3v8eAbmITLXzwYBRgxeOHIp+0eyI7pt2UeUEwGH8\/HI5z\nb7CZNuRd\/ujNyERHVByuRsaiV1MiSh1XkkgbKa1kGUIIkBn0JeHmkQE53vGeS0Vu1Pf3jgLsH+gQ\nVcXZbbOot6zMtHgBxNAsBhurDt+oJqD0DFxx80HP+VxdR9Nycicil0sRvVqOYAL8goD0JcmlxjFx\nrRT7acWErnllqF\/rbBwBV\/bwvkhyzqXAgL3UsewVoOmpsbp2a3jLpe0NtXnHznWnZaDNJwJdBefE\nMzqbK3ElaSfCBaACwR8QIKWZviQ59KZ1mjpbLjVc+7L97NDWUIqOxgpcba3F5d5W9HTy3jXUgjm5\nqOHkqhah3bnLDc6um5EQF4HDUf6ory7Axap83YplOHau2cEbveUX0FN6Hu3R8biam42Opgo0J3oi\n9CMK8So5ggiQ14G+JFlqM9HZHqb9iCG5aKd9Zo2Lhadwpa4IrfWlaL9UTjcsRxc1qIkEk3QiCo5O\n9vhi9w4ButV5k27U\/n8hNwXXKovRupvqclmhaA44tO2nUtDiH4W2mgtoTthBgKa0WcsIcCI+e9dw\nlATgyXX0XrpeLtoeP34XWDL0ZhW9cSoS3OYj09cWeSHOqDrtj5rMSLTUF6PtEoOT05fLUUXddXZG\nAu2HYUJBAfugKc1Be2Euml33oz0nE1cby+iaMrRkZaDJ9jM0n01DXdBKWhymiF0jRyC9gn5qZThK\nksxNKiQRICvVlt57+XWQXqZZifRdzCqpDprFr4lhlNDRay2Q5EHwe1chP9QZZSe8oUmPREPpWVzW\nFAo1as4LXaLQsxqq81FflI2G2DjUZiah0GMaOWeK4x8rng+Ybm\/2lFvupA1y1MVMRVXUyyjzm0w9\nmoKaSSmyNquQQwsp19Ec2TSesR2CZ\/AoKlHD4Rk8gkoWt1AnPSyRsn0+8kMcdMoL3oKzfmqkH1Kj\n+MBSxK9VEpgUxwgwgCbOxUJfkjQ7pYZb7p5zs\/C0ex6e9KzAheCp2E\/vCqH0sOSNShwj0HiexHql\nqJ1xFJIzdpQaG5QCPNVOKSaSYqvAqY0KAR+01HgE\/NAETMRxjlKmWiXgApZxiBXwJ8BdBKQvSSr\/\nuuRqhgeNb+Ju3RsYrJqNa+Ufoj71L\/BZPFFA8AO562XASKqbMatklK9K6kBMyS25qKOx5MJx8SBj\nxKyW0XUE4miBLHI9e4s5chxoIvZmYkFErlDg4BITAee\/1JSglTQaUT9gMEI7LQ0GJSn2CisGvFk8\nE335M9CV\/SpuN2xCY+Z0HFg0kaAUBCEjADkS1g1BcWmKX0PhIRiuArwSeauIIcgoOhZGW4eftbFY\nAIcJNtndDKnbKNddlAIowkYO38Um8KP\/\/axNkUjP8CPAnQw1XJYGeeL3maS1Mp\/6mJdxJfkVdJx9\nD5rYN3CImtghQA6xXIhdC\/uQ+zepCEsAAR4h+Aj6HElgMbThclVg2DCCrjg6VaQNq6foA6oiryLK\n0Qxhy+W05xoLuEOkTNpJDtJb3Q5LA3156n6CS7KT+RT6TBosDJ5OJU8Ft3kTRRvEUAx3lADiyDX+\njsuTNpwMxq5pXTzCWikX3\/dXzMajpjm4V\/9XPLnxKW5VzURt6nQKr5Qmb0yjqQj1BRcLeL1jQE3z\n+BHyePsPI3\/UzFpjOD54mYnNnoUmUcdWKzQcTgaMoYdyUec8Y7e4PHE4OYwMxy4KNwnsMCmKcozz\n7Hb1bNwqm4UbF2ZisNYGPcUfoIQitW+xVITYh8Tnn3c2h\/vb4\/U0Lvl\/+ln4xBqFFeWgz+EV0jwK\n4dOw5VJRnjicgctMBDC7dohW6XA4zrPGxGnoPDsd7anTcKfeCdUxsxGySYp9i0zhQ855LzRGHjXM\nvMW5vTVOJ9e54wadZ0vG\/6bfsf2XGaiiV0s9kzYo88KXmw7yqmQw\/6UmBC4TYOEkzrNIqky10VPQ\nmDADfRV2BPgynK0mYj+F9gC5F79Ogartf8IXCwzhQmBCBOfy5h9f+91+eK\/ysFAVuZjb0BYSRdCa\n07Q\/xlKuMiAvgABaVMk7VDjuroLHIhN4vmMsJsDbD8MFUg12mjsOWwnMac44z9\/s3P\/zV73d3Kpy\n2yTPfCfzPKo+gzm0MXMoRTWi\/zPUtOGvpJekhYbtW+e8EOU490X18+71X0Wqur08vXXxAAAAAElF\nTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_x_shiny_02-1334257210.swf",
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

log.info("musicblock_x_shiny_02.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
