//#include include/takeable.js

var label = "Musicblock DB-1";
var version = "1347492224";
var name_single = "Musicblock DB-1";
var name_plural = "Musicblock DB-1";
var article = "a";
var description = "Knees, prepare to be slapped. This musicblock takes no prisoners with its twangy goodness.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 400;
var input_for = [];
var parent_classes = ["musicblock_d_blue_01", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_db",	// defined by takeable (overridden by musicblock_d_blue_01)
	"music_duration"	: "15000"	// defined by musicblock_base (overridden by musicblock_d_blue_01)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/musicblock-db-collector\/\" glitch=\"external|\/achievements\/trophies\/musicblock-db-collector\/\">Musicblock DB Collector<\/a>"]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANC0lEQVR42q2YeVRT1xbG8+db67Uq\nFRkyEPDpa\/VZq7Wv2oqlWquoVUDFCRABmVVEW6tYQRkUUYgzoigIkSlKmGeIQRAQRUWos2hrrZ30\nvb7xv+\/tfeJNQ8D2tatZ61tJ7j2553e\/vc8++0Yms3olz7QZWhc+yq03dqxHb8zYuBubXou7vvHP\n+m5SR8TIuDZSa5iz0HmSMYQU7BzVFOzsJqkuWOnWGOSolv3er292T\/C\/Gz8eDxPGo2fzGLStG4V2\nUveGP+PqcxlDndEa7oKWMBc0k4yhLjgX4owmUmOwMxpIdavVqA1So5pUFahGZYATykmlq5z6Slap\nDMX+SsNZP6XhDEnnp9Rolyv8Mxf+zA2xaw+S3rhyn+C6t4zBhehRaAh3RlWwE0oClGheO1KIv+tX\nKVAXRgChapz1V6CJYMsCVagW55SopxsopffyABVqgtUoXqlEZSDDqVDir2JI6Om9eKUKZ0k6PxWK\nfJUoIOX7KA1p823dBgA+2f2m\/qvkiTASBIMxlDWgcY0LKlarBFQNwdWEqKFbqUBDhAtKAgmCxhb6\nyemcM00mp3FKVJOreT6OdB01igi0mOD4XUdghT5KM2D+CgWylspxfLEjkueOwM45tno2TcB9lzLR\n7dGuCQRgcsgasDxIJeDOkfgzA1YTXBWJweppXNFKOaoJmmFqCTDfR44zBMhjtCvkdGME7UdAFOZ8\nei+lFCggOBPM4Nrlbhtnci\/lzay2DaNFyBioKcYV5w5Foi1jHVrS16L16Dp0Zq4nRaM1Yz2a06PQ\ndjwa7STjgWA0bXdHxZaZMO6YI94N9L1s8weoipmJhtjZyF0uRznlJYPpKMx5fgqUBPHNqXGawrqL\nYJLcBypxtu0z4SK518dgrO2zbVGao8H1i43ovdSEG13ncLPLiFtXz+P2tRbc6W7F3eutuNfTivu9\nFwaIj\/N5Hsfjb11pFr\/\/\/LIBFytPoiEtEPkBo6EnuGJSLoVWs8AOiQw0iBLch\/vL7m5\/XcClfGSH\n1dNd+sHxBDyRBNX3eRse3GjHw5sdg4rP8RgJlkH55vg6fD2+bldzKeoTPCncauSQu5lLHCjUBDl7\nxAAlzLLVy3q3jhWAwW8PwSbvKT\/B0YUlx3hCCezL2514dOeS0Fd3fxJ\/53Nf3LpohuXf8e8lNyXI\nay1lqNk8DdnLaGF4O+AoLY4Eip614mcP75P1bB0jVueKiS9h89IpZucYTnLNEuzxvct4fL8LX\/dd\n6Sc+xuckWAYdDJLD3dPZiK7yw8j1USCD4DKXKAjGdlDJLm4cTctfCd83X0bMsnfMYbWG44klsG8e\nXMO3D7tRcDoD5fpcNNWewX0a+6TvqhmWx\/Pv+PeWkFJOcirVbpsl3GPARHdb7Jg1ULJ2WsGlVGj9\nJ72MbcvfFaHli1nCsTOWYN9\/0YMfvuxBWESgkOsMWvl1xeI4n2fQwSClnJRC3UHVIX0RA8pp5b4A\nsO05YMBbQxC3Yqo5tBweyTkJ7ruH181Q4ZGB2JMSJ8Sfu9pq8fSRCZzHWUJK4ebrWob68sloHFno\ngGMESGUF2z8cKBkXWj0V5iBaJNt9p\/ZzT+QcTcKT8aSSawuXeAjXwtcECfHnFkMp\/v71DTz7qleM\nMztJ7vN1BnPxclY0Di9yQIa3XCyKuA8HSlYX5ixyMHjyUMT7uZrd47uW3JPCypMzxD++vY1\/fX8H\nqXvjhSLWrMY1Svwfv7llhuTx7Dr\/XnKRb9wyF7uyNuAgOXiEwhxP4YydOXyAZLx3MmDYlKE4EL2w\nX3j57i3d+9vjzwUEw\/3n6T1Erl1NChYOtp+vwD+\/uyPO8zhrF\/l6lmGWAA94OWA\/KXWB\/YsB830V\niHhnGHKSIl4IyPkluffvH+7iv8\/uQ6NJxD5NEiLXBaOnyyCO83kex+PNuWgFKMJMediVbQLc52kv\nALcRkLVk3HFkLLbHmqnDkLvz1wMmJsYIBzvOV\/4iIOehNeA+TwdoPOyxd749Pvtg+ADJKmkjP0qJ\nGuVqA60FYNyxc0jVNqOyqQPVhs4XhvjTzVHi\/frlJnHcMsQvctAcYgJkuDQPB+whwK0EZC0Zt0IM\nGD3NBqd3RZhXsdKnqp9euEhSTYuk+1KjOP7jk5v9VvKNhhb01hoHlJqfFokcaQscqBewR8yM4QMk\n41YonQA3vmeDPAJk+7kcWANKC0WCZKesy4wlnORe9aZiHJ2YgcqNZ5DpmomO\/FpzmTEtEjn2e8pF\nsxIz45UBknHzyICb3n8F+c8Br15qGQAoFWqenPOLw2hdqC3hpBJT9clZVH18VrhnPFCOsugidOpr\nTYWa6iDDHXgOuIWArCXj5pEBN09nwHBxd7oKYz+46RvrxGTsyC9tdZZwnHv5i3KFe1INNOwrQ\/qE\no2Kr451E4+GIAxTm3QTIDNaScfPIgBzvjKg5IjeKys\/1A5wfUz9os5C8axspFqHhAWIV83HrfZjh\n8hbmmFdvk6aUnkFyREdz6eR6yj9HHFykQDIBfkpA1pJxZ5u5xBHbaMWkeL8m7qywtMkKsE4kuXW7\nFRK+SogdbKguMrdcUm\/IZaViow7lG4rMW1xljA65HtnUYVej88R67CXAQ4uVSJ5HgJRm1pJxZ3uK\nOlvuHHjv0yX4oqu1Btfa6tHe0oj80kZU1hlogpZ+NZIhkpK2CoWErUIrLRLLplXqrk97nRJ5x3Ac\nnYZUPfKX58CYXYqLmVFImc8hVmAXAfI6sJZMR4+C3Nnuo3rEkLxpn\/7EHefLs9HZXInLLTW4cqEO\n1zrqcL2zQST3zSv8nGJEUIgfaaVwsKLYFEZJd6+bHhXK1hdB63lKrNrW3ArogrSo3FGEtrIKXDy+\njuqfI211cgIcgU\/etxkgWZG\/E7IIMGuZgtoeBQGOEOInq4MrxuB4+DQUbPeBfncIGk8l4lxBGi61\nVKHrAoPXoM1QBl3eMbSdK0f3xXqTOhpIjbjW3oDiNXk4QouidFM+CgNzURCQg5aSMnRSzjYne9Hi\noJaf5t1Jj6Afu9kMkKxgpRonliqEtD4q8bR1mh6mWZl07NBCRzM0ix8T91BCH1zighORBL91IUpS\nQlB7LAaGvDS01hSi3VAuxPCs5go9Gk7pUHO0EI2FOpyvL4axQovyyLGUew5I9\/4ZwDw\/p2fccp9c\nrsD5g2PQqHkVtQmjkLFEKdogHeXoGVJxkLN4z\/U1wTO4hrYoS3gGT6Uti1uok5GuyFk7DSW7A83S\nJwegMMEfefH+qIqdI+bYNc8Rh2mRJNGN82ZhLdlpX5XhODWMvWcn4lnPVDzt9URF8hhso2eFFJos\na4WKmkpHuhi5vEwl9s6jdMdaX0qN5SoBriXoolX0GOmjRPYKpYDfNceuH7zpBuzF+bMUpQJ\/Nbnm\niCTSUW8lEglwAwFZS6blf5fCnPC47W182fwW+hon4WbdR2jR\/gVxs+0ExKFFjgKKAXnfPESF9dgS\nFbnFnxViH02nSdIX80R2NF5OESGQIBcUkeu6AHI\/0Jmcd8I+L3LeU0lPbPYCLmmuA7IptRLn2FI\/\nMKyf1rsO66MQK9204U64UzUBN0rG47rudTxoXYm2gnGInTVCQLEjDJi5VEVtkYPYnjK8VdhJMLwL\n7KFjXGw5VPu85GJlJrjbiQWwf7Ec2RFO0K51wolQFYXSAWkEuIMAE+hzgrsDzaGkz7ZYz1CWch2m\nF\/\/PnFgmj2s59Co6s17DtcLpMKS\/hXhqYmM\/NAEeocmPLFYI1xiQtyd2LIkA9xNgKn3XENjBRRRe\nEsMydMOBMSJtWL2V89Bb9jo0QU7Y66FA3Cx7AccqoEqyg57q1rkOs1aU+S+4LF95XHncyL7y5HG0\n5akRPnWECOfxpZyDChz0MrmWSpU\/jQGfh5PB0jxNrjEYF939JA0du1s\/CU86JuNRy1\/x9PbHuNc4\nAUbtOIJxpE3BDvEEt2O2AypCXRD93jBqmof2U+S7f+j\/p2aRt83Q5Ln2Hltm2msOL1Ia2C12jfNM\nco33TnaMw8lhZBB20eQmwXkpKMwKkWcPmibhXu1E3K6YgD6jB3qr5qGaIrVtliO2k4MsHltGXX3E\nu0OtNCTr\/\/pb+Ji30o2ayrh9no56gnrGe+cescFTiZhL3bCnaatKoMIugaU9V1vmWHQXjsMV7Vg8\nbAlG06FJ2L3SEZ8xIOXg1pl20FPDfIJKXPg7Q8wKmzKkL2SSbOhv+h87ce4wNZWdqBPLVfq9Cxz6\neFGwa4lz7KksyQVYKuUY51naUjmMB0ej7fh43Kj3JcBXEeI2ArEU1lgCzFiqROPaP+HTGTYIJTAh\nggt9+49v\/G5\/vDdGuqgrQ509tH5OGipJhhyqj+mUq3sWKMQCSKKVnLVOjSMRakR+aI+o9+yw11Mh\nyg\/D7aQ9OHjKEKwmsODJQ6J+s3O\/5tW01tmtYc3IqJJgZz3tRH1nqDBzKItJOvqc708F34tDbHNl\n9eSXNEFTXvZ\/0bX+B\/Ppr\/UF6I9TAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_blue_01-1334256389.swf",
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

log.info("musicblock_d_blue_01.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
