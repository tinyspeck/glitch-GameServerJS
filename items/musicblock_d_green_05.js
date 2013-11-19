//#include include/takeable.js

var label = "Musicblock DG-5";
var version = "1347492224";
var name_single = "Musicblock DG-5";
var name_plural = "Musicblock DG-5";
var article = "a";
var description = "Rock out with your block out. This is the musicblock anthem that's taking Groddle Forest by storm.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 700;
var input_for = [];
var parent_classes = ["musicblock_d_green_05", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_dg",	// defined by takeable (overridden by musicblock_d_green_05)
	"music_duration"	: "15000"	// defined by musicblock_base (overridden by musicblock_d_green_05)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANvElEQVR42q2Yd1TUVxbH5889Zzcq\nKwrTKNlkE90kqzGbmEhCkjVi2Qio2GhKLyKgibGjgoCoMyJI7wx1lKE3GWAo0hRsxB40picbt9ez\n57v3PvxNYCA5u3uWc77nzY95v9\/v8+697977Riaz+EtcajWzNfQp59GD811H986PubHr2ZhrO39u\nuEoaCHsypo\/UG+Ig1E0yBZECHSLbAx2cJbUGqpyN\/nJ72f\/778tjC3zvHnkBD2JfwPXd89C3\/Sn0\nk67u+DkuP5Yp2AG9oY7oCXFEF8kU7IjOIAe0k4yBDmgjtQbYo8XfHk2kRj97NGy1Qx2pZovdWPUW\ndUeVr6rjnLeq4yxJ763S6jYpfXPW\/MCC2Gr3j\/5y5COCu7pnHi5EP4W2UAc0BtqheqsKXRFPCvG1\nYYsSrSEEEGyPc75KtBNsrZ8aTeI7Fc7TAmporNuqRnOgPap8VGjwYzg1qn3VDAkDjVU+apwj6b3V\nqPRSoZxU5qnq0Lxr7TwF8ItjLxo+TVwIE0EwGENZApq2OaI+QC2gmgmuOcgeeh8l2sIcUe1HEDS3\nwluBlhAHlHkpUEWQTWTVUk85PccelQRaRXA86gmswlNlBizbrET+BgWy18mRuHIO4ldYG9hoAu7r\npIXOnyQsIIBxC1kC1vmrBVwniT8LQIJrIjHYeZpX6aNAE0EzTAtZsMxTgbO+KjTSnJLNclqYA8q9\nCYjcXEZjDYVAOcGNw0yvhOXWMePWS3oxv2\/H08JlDNS+1wmdqeHoy9yOnvQI9GZsx1BOFCkavZlR\n6EqPRF92NPpJptOBaD+0HPV7lsJ0eIUYO+i6dvev0bh3KYwxLtBtVqCOAdly5OZSbyWq\/XlxBE9u\nTSCYo8unKs7F+pGwIllvjMFYh1ysUVOkxbVBI0YvtuPGcCduDptw63I3bl\/pwZ2rvbh7rRf3rvfi\no9ELU8T\/5+95Hs+\/NdIl7v\/wUgcGG\/LQpvFDmd\/TAq6KVEyu1a6eizgGmkaxy2f7yu4eel7AJf1m\nLgLecpwExy\/gF0lQYx\/24f6Nfjy4OTCt+DueI8EyKC+On8PP4+cOd9XgfJwbudseRZsUyFlvS64m\nSJc5UxS7zNogG903XwAGvjwDuzwWfwdHD5Ysxi+UwB7eHsIndy4KfXr3O\/E1f\/fxrUEzLN\/H90vW\nlCCv9NSiZffrKCTAbA9bZNDmiCXvWeqIy+wx2fV988Tu3LzwJ9i9YbHZcgwnWU0Ca60vh9PbTsjO\n1CAodAtysjRIPnUUpbp0MV7oqEFrQzl62mvQXFc6LSS7+\/qQEcN1Z1DsqUQWAeasVxKM9bSSDe58\nWqQErxefwN6Nr5rdagnHVrrQWSvAcrO0AjQ4dOu0I8\/hke\/j+ydCSjHJodRyYJmwXu4GJcWcNQ4v\nmypZP+3gWkofvouewIFNrwnX8sMmwn127xI+HxuBsVkvXpyfk4yQMD8M9TThtw+v40N6aWdrlbhu\nbzmLMl2GsCgvaiKkFJOSqwcoO6SvlZMFFbRzvweQU0wNVYKtL81AzOYlZteyeyTLMdyX969gsLtR\ngBXkJgvQbmM1fv\/5DaHfffYhvv3kugD++sE1fDF2GZ99NCzu57jk5\/FzJ7r6Ul400tbYIpsAKa3g\n0DtTJeNEa6DE7E+b5JDXkknW48Dnl\/DL+KVsJQYrzEtBaLg\/Lg+24Y9f3Rb6w5e3BOijT0cF5FcP\nro5DkvX5OdNZ8VJ+NM6stUWmh0Jsiph3pkrWSqWJYzDwlZk44u1kth6vWrIev+ybj6\/j0oVmAvND\nUUGqAO3rqsdffntX6E9f35kEyfPZ6ny\/ZEVe+MRYHM7fgRSyYBq5+Qi58+DS2VMkaw4eBwxZPBOn\no9dMci+vXrIeW6XbaBBgusIzCIsIgEYTi\/CIQJQWpyMz4wQM+nykn0kS7ra0Ij9vopsnAp52t8XJ\n1TbTA4ra6aVE2KuzUHQ07HsBOb5G+lsQus0f1WcLCCwAH+yJFMDh2wPFGLYtQIxsRZ5vjkULQOFm\nisPhgh0CLvkx4AECspSMO47MdTbYtmQWiuN\/GJBfzPHGLv3bo4\/wzz88wL\/+9BAPyYUD3Q04eeKI\nWAAvxHS+agogx6ElYLKbLbRuNjjxrg32\/3r2FMm4FcqgQI10soJuAuCtm50oHD6KzEv7kTV8EB\/f\nHxCu4zj78zd38Ndv7+HvvxvDP35\/X4x8HUZwbEGOUx6\/z4JmFxOg1tVG6DgB7iMgS8m4FWLA6Net\nUJIQZt7FJ\/ojsbJtnln7+3xE8EtWZEi2JIPxyNcnjh8Wuzvp2EGRjjgGb7T1YLTFNCXVfBeDCmhW\n21IvYIO9b8+eIlkdtejpBLjzDSuUEiCbn9NBkMllEiBr+E6dGZItKaUYKc0wHFuO4Xhk6zXtqkLG\nwkw07DyLHKccDJS1mNMMA552V5CbFaJZ2fv2T6dIxs0jA+5686coewx47er5KXAsdjXvTo5HdreU\npKVELVmuoiQLp5PjRYppfP8cGt87J6xnOl2H2uhKDBlaxhM15UGGS3EfB9xDQJaScfPIgLvfYsBQ\nsbrGi3nTAmq6d4pS9uDmoACVYKUKIllOqskce2Vri4X1pBzYcaoW6QsyRKnjSnLKlQDXKHGMAJnB\nUjJuHhmQ\/Z0ZuULExpWR1mkBU6sOiRdzTeb4YvFGkD4nJBwQcPHx+xAUskVsDIYrXVNk3r3t2ho6\ngxSJjuZiXhQ0rnKkEmAiAX5AQJaScWebS7XwAO2YJI9nxcoYcrvJdRJcVLc7RvpakayNoxJ3XrjP\nUlIXw3A8clqp36lH3Y5Kc4lr2KtHsWsBddhNGMqNwkkCPLNOhcRVBEhhZimZ1Nly58C1Tx\/rheHe\nZvRfqEF8VxgiOldjV9dGXLncak5BLfVlAmDfvh0CJjvjJE4ReElhGrRUXYqpFGooJ7JbS9wLRdwx\nHC+87aQBZZuKYCqowWBOJI6vliOZLJhAgLwPLCXT01GwYKOCYsFGQHLRLnl\/ObrrCjDU1YBLPc0Y\nudCKKwOtuDbUJoKbG1f\/QG9ERAYJ0IAgn0nj+Nlk\/KhQG1UJnVuh2LW9xfXQ++vQcLgSfbX1GMze\nTvmPAGmTJKyag\/fftJoiWaWvHfIJMH8jdbfU2cbyWcBl\/GSVsnkeskNfR\/khTxiOBcFYGIfOcg0u\n9jRi+AKDN+NKfyuMTZXQl2UjM\/04Eij+rg60kYz0XRuqtpUijTZFza4yVPgVo3xrEXqqazFElacr\n0R1J71LLT++NpyPoe85WUySrIMA86mi5q9V5qsVpq4QO06wc+l\/qGrkZmsXHxOMU0CnrHZEbTvD7\n1qA6KQgtWXvRUapBb3MF+jvqhPo6aoW66g1oK9SjOaMCxgo9uqkMmup1qAufT7vXFukePwBY6m33\niM8EeZuU6E6ZB6P2GbTEPoXM9SrRBukpRs+SDP4OYiz2GodncK2r7SR4Bj9JJYs7lLxwJxRFvI7q\nY35mGRK3oiLWF6VHfNF4cAV5jM7Fq6jdok1ylBbOxcJSshIvdQe33KNnF+LR9SX4dtQN9YnzcIDO\nClwfCzar6QEK4f68TWpRNzOowdR5U+zSdRWB6wi6cgttNk8VzVcJ+IQVcyfBjy\/ARnx\/jrxUTrGf\nsEpOlpOTi1WII8AdBGQpmc5TpdWF2OGzvpfxsOsljBkX4Wbrb9Cj+wViXOYinyBSyZIZ5IbcjSrK\nW7Y4Q\/Uze4OaWiT6vFYp6mi6hwrp6\/hFc2m+AnkM4u9IHnCA3o+sTyrxsaMNIccpd4r15TY4SnBH\nV9qigEIrboU19QOzJinKadYYuVjlrAu1w53GBbhR\/QKu6Z\/H\/V4f9JU\/h5hlcwhq3J0MmPMYistT\n1no1ElbaiCpwggKdk20aQfKOTKKdGbd8rtgAyWT9gjA7lERQrIeoyGK20LipcNjFhqAoREi88FgC\njGKoiXKaZRC\/z+RuVMT0pD6DofxncaXiLXSkv4Qj1MQefGeOuDmNrJS2TimgGIbLU4aHGvFkLS72\nXA1O0ZhKFkxdq0IKzT9O89pOzxNhwxptWIXR2ueh9bej5KzEoWU2Ai52uS3KaaMeplPddqdZloo0\n\/wSX76WIqYt5cqwu8TkqefYIXTJHuJOtxnBc0BnwJCVWBpLcyWDax1aT4E6TNfn\/d88vwhcDr+CT\nnl\/h29vv4Z5xAUy65whGTkVhroA7QqoPdkT0G7OoaZ45SeGv\/Wjyj5qVHlYzE1fauO5ZaqM9s1bV\nwe5kKI4zyWoMp1k9Xp4YUEPuZqB4cjePXBWS3ZUizu63L8K9loW4Xb8AY1Q6RxtXoYk8dXCZXLiY\nrchza6mrD3ttpoVm5P9HPwtneaicqamMOeUmN6StVT3i2nmCANmdHIMaN7kAi6XELoFpKcY4zvpy\n5uNqxXMY0c3Hg55AtKcuwjEfOfY\/Bty\/dC4M1DDnUooLfXWGWSGLZ4wFLZLN\/J9+x45bOcs+Za08\nkna34aSr7RhvCrYaW\/P4uwoBxuI402xQwJTyNPqyX8CN814E+AyCnOdQdrAl2SBrgwrGiJ\/hg7et\nEExgQgQX\/PKPf\/l\/++HdGO5o3xDs4Ep5UUvQHUVedpTX1NQEKEWMxVOlKKCYTguzR\/g7Noh6g5K5\nmxKVlAsZLp5qcODiGQggsMBXZkT+z5b7b\/7aIxyc27Y9GVkd6GDQ+9mPcWJmV1YFcE60R5kvJXx3\nOiQttRoJeOUnWv\/FT\/h+37P+DY\/QaF+dZ\/akAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_green_05-1334420898.swf",
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

log.info("musicblock_d_green_05.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
