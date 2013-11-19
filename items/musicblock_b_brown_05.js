//#include include/takeable.js

var label = "Musicblock BB-5";
var version = "1347492224";
var name_single = "Musicblock BB-5";
var name_plural = "Musicblock BB-5";
var article = "a";
var description = "Like the noise of Tii's sleeping brain, creating whole new rhythmical logarithms of imagination, but in musical form.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 700;
var input_for = [];
var parent_classes = ["musicblock_b_brown_05", "musicblock_base", "takeable"];
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOeklEQVR42q2YaVSUZ5bH68uc0+JC\n7YCRmD3pzIfM6SWdxUhMJzFuMaCoKFJAse+okUUpEChABAoRqAKKHWQRKIpV1lIERcUFt6jREDvd\nySTd0+npme45c+bDf+59sIhW2d2n+zTn\/M9DvfXW+\/yee+9z731eicThL+l9meuY7rn0G4Yf2y7o\nX7BNpD9jO3VgpW0sxdPSn+Ce3suKc0+3kiysGPf0jhi3+K5Id6\/2BSm9mqKlKyX\/7L8bRa9opnNe\nAoFhLPVp9O19Cv37nsJ4ytMYTfYU6op1Q0+8B7rjPECA9NkdnTHu6Ih2RzupLcodrZFuaCE1R7ih\nKdwNjaSGMDXqQtRztSEqWzXJrCUFKW1VgUpDaYBCU+DzVxbEVhMWy30RNt0z6Nu\/Au1xNEGUCnVh\nCnTv8RDiz7WhcrTGqtEao0Z1iBwdBFkfpkRzpJpGFdoItkarQF0oX3NDtVaJJgKtC6VnhdDvQ9So\nIVVr1TAHq1AVpEIFyRSoglGjtB3ylno5AV43\/NgyW\/gKLHuWCzCGcgS0JLqjMVJJD5ejheCOR9ME\nWjlOEGAdATYSYA1BtcS40WRy+k5J97jBGCBDU6Q7QdBvQ9Uo1yhgJtDyAOUCIIGheJcCBTvkOPCx\nK1I2ulqS3pe4CrhbRa94XS0guMR5Cz0JkOG6SA0RSgHFcM1RagHWRi6uDJbTdyoBJqA0MppcQfe4\noSxATvDuMBGgmaxYsluOOrKokeAEzKYnK3njsvSH1nu1tp9c2harFkBV8f+GOr0GA3UZGGsvIBVi\nwlKEMxYDjQac7irGcEUEhkiDxggMV0airywcPQVb0HrwHVgOeaEx+W0cT12FjnQvHCOgenK1kQCr\nyHLF\/nLUUkzWhBF8oBKpAsZZSRtdvxdWnC14ZW7eUkrsfnsx+tqrMDneg3On+3H+zAAuTg3i0rkh\nXDk\/gtkLY7h2kTQzLnT9km1B4hp9x\/dcvTCKy9PDmDl7EhcmBzA9MYDx3lr0lMeiLPxFVBMc61iA\nAoe8nwzIStmwVCOZph3LgGmfSKFd\/zKmbL0Cjh\/ME\/BEdjAGuXH5FG5dmcBnV888Jr528\/Jp8b0A\nvvgDKC+SF3v2VB8mx6ywlsWQu9XkbgUK\/WRI95YiaYOrk\/avd7VIJjKeFYC73nRBZpzPApzdanaw\nidFu5B9OR03VURTkZ6DX0iA0dvKEGK+eH8Wda1O4PTspYBmUrcqLs1vzUch2\/WYc9VfgyA4Zjvgp\nsJ+BHPTpetc5iU23UuxO758uQkGqxgnObjFrZwNWv7cKoWEBYgwL1zxxzMpMFvfYQXlxDMnPexTy\nzMkWlAZ7In+7HIZdSrbWEyUZTF6B+nAVtvxsEYoOaMRDHoVj97Flpif6UFSQiYryIwiLCESFqRDF\nhmw0NZSL0VCUTdc1yM5KEbCf35gSv3sU0u5ujkkOpRP5fjhMgIU7abN8zBZb5iTJQBIDKuH780Uw\nHNQsxBw\/lB\/Ok9y7eRYDPc3CQuEEx+PIYDu+nruKb76cFeNv5q7g119cxq\/uzeDLuxfxxWfT4neO\nkOwd9hKH0pApDHnb5CjYqaCYW4Z965wl6abkzDt4xy9cUKILEoHNscMBz27iSeZun8fMuWFhKXOl\nARGRQZgmV333qxv47Vc3xPjtg+v49wfXBOhX9y8tQLIl+Tn8PPaK3dVsxbGqCORskyHf768AtlMl\nqKUKsPMNF5RmBItV2l179\/qUmIQnGxpoFZZjOB5Pj3bh9998Nq+vb+E\/fnNTwDIkW9QOef\/WOfEc\nft6jVuRYHDMToC8B7uBNsgx71zlL0krFvzpECX\/axWUEyKvk1V453YDZUxW4NWkWbrt6cRTHjuai\ntvoooqKDcbKvBVOneun6GCZP9RDQZQFqh2RLPvh8RljfbkWxsy\/OxyK7edwcCT0B5vjKRbzt+chZ\nEq6dXDcDKEmXZ2oX3NtjWI3uDAVO5qiENUYpnbDlGI7H6BitGGNiQx77zJZkly9Y8c6FhVh81M28\nWRgwl2IwawvlQh8ZEgnIURJRO6mGBq5aDONDQA7q7sLV6NAp0JelFMHPm4Gt89W9S8Ji1y6N4zxN\nYhvpQlVFEbo762CkHc4u5\/v4\/plZC27fPCXcbN8s\/Hx7HI5XM6ACmQzoTYBrlzlJcpwKev52KYLf\nWQxTlhY5QUtwLGoZqvdI0ZIqF1a83JOIa\/178fXtUQHwn9\/dxZ9+fx\/\/+8cH+L\/\/\/kqMFaaCxyzM\ngNWDiSjo8EeY8VXEmH6Css5o6Go3PQaoJ\/ce8pGLapKwdqmTJNwKHaadFLJ6CSoIMGP3YhSFLYUp\nzhUN+2U4kaZAT6YSQ7kqzM00iTj7w7d38F+\/+xx\/\/v4L\/M8f5sRo6aglOC2OULWJjAoWgPpWH2S3\n+KCuP3nBggdrNqG5JwtjY80CMHurAhnecuio1MZ\/uNRJEm6FDm+XIezdJajMngdkK5aQFc2JUjQn\ny9H50NX3LjTgd7++IazIkH\/87ecClEdjWb6wHMPxyJsk+7g3SjpD0TVyZCHVaApfRlFzOAaGqkQM\nZhGg7hPZXwbkVogBI9csQVV2MEapnRq3lqAi5TWUx7iiZq8UfUffxUj5Gty71CHynYAkSy6kGVJH\nq1nA5eXqRCriuK3oiUfe8Z2o6dkv0gzv4tTKjUgybUBXX4kAzNyiEOJmJe6DpU6ScPOYRy6Ofm+p\nABRljgLZmPoGDOFLYYx1FamCUwZPyruT04g9STMsj6UleY\/lSb4\/o+ETFLVpUXA8GPVWHUZt9Ugm\nuCMNoegdrBSJOtNHQbtYgYMEGEtAjpJw88iAse8zYNBCqStNeQN6cnVxxLLHSh1XE3afvczZ1dJk\nQnhkIHL0B0St5kXpajcLuPymIBS3RKKoKQL7y9aLFMOlbrQqHBm0QbJ9CXCzVDA4SsKNIwPGE21h\n7Hvix09qFsaHOkQT0FhXKqzDyZvznF0MLrqaiPmuhhd1rC0GR1ujcLw3ZyH\/bc98AblmLbp7TRit\nnAfUb1MKwBgCcpSkOtSNugk5Ej9chrRtz9PK+pwgefdxkHNFsIOaKOcZCrMw2HtcqKPNLLode7vF\ni0qt2ITceg2arNmixnOJ22NYC31lMLqsRoxUhCHNmwHpfEKA0e8vcZLETEfAcjobfMq1jzJ3TYYv\nNaddmLRZqV72Y2aKu+oRakipw5mxobuj\/rG+0HFkMHuHzS5NM23FseaEhS7GJ\/U5ZBkD0dlVRoCh\ntDnkyNyqpAMUAf5yiZMklXQ+LaVjXyaVGoZMoppo2rcGgyfKYSNrnR61YEqcUfoenlFO4tLZYYwO\nduBEi5lcXkY7Nw15OWnQhviT1efPK7Nk\/X0l67G3eB20+p8joZAsZwpGbN4HMNanosdqxpAxhCxH\nSZo2SioBRhGQoyQVwXx4UcHgr0SBn5IAXYWSqeXO8X8eRZGvo0q3BY25AbBWp2GgKZcsbKGDlVU0\nC2cJ\/Nwjmn6oc9TgnqXvp2w96O+vRTOdEE90liKnPAzjVNfHBtphzV1LYDJys4KOmlJEvrfESRIT\nAZbsVomu9phGJU5b5UFqoSJqxbnT0FF82MFT6bTFn3P8luNo9C9gPrABzYc16Crfg976bAxb68i6\n7UIjA20Y7if1teFkTwtOWilerc0YsDTC2mpCQ9xzSPlYTm6eB4wgIEdJygLd5orJekV0whos9UTH\nYQ90ZlN99lNRIZehMsQNVbSRGqI8UBvhTqex+QWUkNUZnkPDDs\/gGVRT+frR6NdRGvc6GnJ2okHP\n8hOqSt+OirRtaNGtEXMkb5Ijd7tqHpCKhaMkpYEqG7t3pvN5fHv9VXxzfR26Clfg0+2U3WlCw241\ndb1yFPmTlXepRd3M265EicaNwkKFmnAPkrtYAKtCO299bkIZ1FF8nb1UQQtP3iinAzpd38agUoQT\nkKMY0FAZp8aX0y\/h3pkXcXv8edy\/4A9biyd1tFIBpqdEemSnCgUEyG0RJ9Z8P7WoAnqRZGXI20EW\nJyVtkFLaUAh4c5gHKkPdURXG8oBR6y7KWoaPSoAlbZBTJ01e2KLkNwnUDyx2kMucpMRf\/VoVAV4f\nfBZXelbiYufTuDvlA1urJzWMUmE17jhyyWpHdqpFYedJ8nfM\/8+waWJUQk+u4pF35j5aHG+AQ5SE\nS2NVMCVQjEcrBVQ6A9K4dx1ljvVysXA+B4d6LXaQi0W8n6F4qh0yLsdE\/XLMWFej3\/QycqOU1DDK\nxI\/1NGkOTcRW05G1uH9ji7HlsghQR24\/RNDZ5Kos33kdJEhriacIG9alfi969lPI1vJbDJUAS6Dn\n71snRzGFER3SoV292EGL4hdewRX6y9ObdervOw3\/iuIEFTTvyIU72WoMl0OQhwkqnWC4PLE7hYXY\nZSS2GoNx0j20VUXXlLgx\/AIenH8J9ydfxHd3onBr1BMjTRQ66xUCLJ4A96yXoTF6OUIp3oII6lFp\n3\/rRSqcXmQe8FZqEj+S1FLhX2IVsNYbLeGi1dBrZYnqx82QiyTLUfoo9BhPawoAqEc83h57DbP8z\nuHPql7gy6IXucg8kfKQgSDni1krFfby5At9xcVTt33wlnOcrc833U3rpt8rTqbG0UVH\/nmsnlyd2\nZ9LGHwB5Q9nBeBNwnE00rsD5dk9MNT+Fu5P+6D32EjKCCIwAEyn+Yj+QUupaTilOhYBVLj\/o7UVz\nvj99+ALz7\/1L2ih9Te+rii\/0V1toc8yxK9lqn5KrDm5WCDCd97yyKfkPlrlj1Pwsrg5vQX+pB3av\nodhbpyArkncofDoSVyCaOqndb7sI+b+1aM5\/1b+89k978d6512Nlc9TyzaWBbgaDv5utRONOoaCm\nBlSJfbRTk6hSlCVSmESoof1QAe27MgFfGeoh4FKoBu96ywU731w0R4r\/hy339\/x1Ja7wosnjGyKX\nWygHznE+rCFXclKvorxo1LpRWPAuXnJl15uLDLve+JHmLz3r\/wF07ub3l0lNWgAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_b_brown_05-1334256357.swf",
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

log.info("musicblock_b_brown_05.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
