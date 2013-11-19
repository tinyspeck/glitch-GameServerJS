//#include include/takeable.js

var label = "Musicblock BB-1";
var version = "1347492224";
var name_single = "Musicblock BB-1";
var name_plural = "Musicblock BB-1";
var article = "a";
var description = "The hit single off the best selling album \"Music For Batterflies\", inspired by the enchanting noises inside a batterfly's gastrointestinal tract.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 400;
var input_for = [];
var parent_classes = ["musicblock_b_brown_01", "musicblock_base", "takeable"];
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
		'position': {"x":-19,"y":-37,"w":38,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOLUlEQVR42rWYeVSU99XH55+e87oy\nKzMo1uQ1TU17Tu1p1CY1hmg0RsUYVASBALLJIJu4sO+rbINsAwwKIqsswzKgyDKyuCGCC9EkmpI0\nXZIuad+3p39\/33t\/w1Ac4mnfnnbO+Z555nl+z\/N8fvfe3733NxLJd3zG01\/1mdG9Zp7IfMU8mvyS\n+Xr8WvNgjKPZFKkxd5O6IjTmzjCNuYPUHqo2todqkttDNMmtpBatxueyVunUOKd6f+layb\/rM1O4\n3ud21qsgMAzFfR+mk6vRe2o1hmO\/j8GYNULdkQ7ojnBAZ7gDjOEaECQIEG3HNbhMagnRoFmrRhOp\nIViN+mNqXApSoy7IHhcD7VEToJo+H6AyV\/uTjirNBl+lrsBdnpzqInV6IVj0Dond5NkfmieyfwBz\n0kvoPLkKl8PpBSEq1AYp0BnlIMTnagLlaA6zR3OoPc4HyNFGkBeDlGjQEkCQCi2hlt+1gXxOTd8q\nAcnfFkB7XCCd97dHtZ8KhqMqVJIqfFUo8lDMJrlIfRYBPtK9ZpzK\/SGMURYwhrIFNJ7QCLALBNVE\ncI3H6QX+crQSYA3BXCLA6gAFXVMTuJKuKWmMmiAUqNdqCILHaFDuo6BxKpR7K+cB9T5KFHkqkO8u\nR\/wHdohztptmowm4x4Xrne7nr0d7hEYA2QKyGK6DxGAMxXANIfY0TokWcnGVn1yAVfjKLVD+CgHW\nEKJGmbdCgFUQ4EWyaPFHctSS6\/UExzCx+75bMc4rk+es96OaLoo1dhnD1CfuQH9DDoYu55HyMdxa\ngFFjIcaMOox1FmGkowjXKoNJWlzR03eVFqayY+gtPITmhK3oTHXCpZgtaIzbirZkp3kwPX0zWJGX\nHDXk8gsUl6VkuTgBs1jRznZ\/FlYk187Wa1XCGh9tWQbTZQPGh7txa6QXd8b6cPfGFdy71Y\/pOwN4\nMDGEh3dJk8N4dM\/8nPgci8fcnxjE1O1r4j6+\/\/ZoHwbby2DM90CxryPOExyrhKyb6vLdgKzYvSt8\nJDcz1gnLRb2\/Ep7b1uCGuUfATYz3YfLm1b+DzUF9PDWCx9OjeHJ\/bJH4\/MzUdQvw3b+D8nN4svzc\n61ea0Jq2iwDtyd0KFByRCVdH712sM3vsjJLRlJcFoOumJQh1fX0ezmo1fpEVjCE+fXgDnz26gacz\ni8XnP3kwLsbxeL6PJ8fPWQg5drUJzbEbcc5LgTxaGGfdFDjDQDY6vcduVjJCgJe0Sri8vgThhzfO\nw\/HsGY4twpZhMIZ49vFN\/PLJbcx+cgcT5L6RQSP6uhvEMZ\/n61ZQq0X5OQshb143CchSvzXIdZOT\nFRVsre+UpC\/akVahAgc3LkGk28Z5t1rhrFazgn3x6QS+fDqJXz2bRJEuA8eCffH29rfE8Ref3RXX\neRxPhu+zQrIl2d3WmORQas09QtaTI48AadWSxRZLAHLqYBdHuW8UD+GHsXuslmM4thgDZGXGIzsr\nAcHao8jOThTi46b6Cvz6l1MCnMfxeL7PCml1N3uHvcSuHmrJQ85hObJJ0XtX4tTuxZL0nnEUecv9\n50tx2mOTxXq0IDiG2E1WOLYaAzBcDkGx1bQhfkJ8XHIuG19\/+RC\/nb2Prz6\/J8bzfWxJfg4\/j59r\ndTVbcaS9AFmHZUIvBOTqwZXA442lOOO5SczS6lqOJeFWsgi\/lF\/+zZeP8Mdfz+BPv\/kYo0OdaGup\nRshxP7Q2GfCHr2bEdSsk38f383P4ebZWHOkoRJarTIiT80kCspWkOcxSmrzeXIoYr83zsXezKxW3\nWsNwrzNCuO03s9PCQgz37e+e4C\/ffIqK8jwcD\/UXFtSX5eLb3z4W13kcj7e1onXBcBgx4GiHDpkE\nl3FIhpQDMpHqbCXhEsV105uStC7Wfd693bq3YUxR4GqWat56v\/\/VjIBguL\/+8Sk622tRWJCGyop8\n3BjpEef5Oo\/73RcPLFakRfP541siFhe6mRcLVyeGSz8oQzIBniAgW0m4dpZQffR9axn0af4Yv1qN\nm31laMv+GdoSFTClK0Xs8QvZhWy9\/\/n9Z\/jbt5+j21gnVi9bkCH\/9w9PxXUex+MnHxgxcqcOU1M9\nws28WBbGoRUwjQFdCHDXykWSNFJBz3WTwW\/rMlSk+6Mi\/g0Uh6zE+SgpmuLkwoqjhndxu3YHvnrU\n+RygobIQYeGBCCWxNRcCspuzLh9EQv37OHVhK9LqP0Ry3X4k1ex7DpDh8j1UBChF5K4ViyThVugs\nAQY4LUdlhj9KY36OgqAVqAi3w8XTMrSSFbvTlOjPVmF2sl4sDquLb42Z0NVxEcfDAmBsq1nk4ure\nEwgzbERtb8x8uvHVrUdDdzqGhhoEYIqLXAAmfShFxHsrFklyaQ4w6J3lqJoDzDq6HMXalTBESlEf\nI0N7kgI95OpnE3WWRTIXh4sWCVmPr\/NK5kWS0eiCgNLXUNMTPZ9q4qudEVu5F8beYtEVpR9SIPeI\n8sWA3AoxoHbbchgy\/DDSa8BwVzEqYjagLNQOF05KYTr3DgbKt+HZvTbxcnYhW5JTTF5uskgzbc3V\n83DWNFPZHYHUug\/Rfi1XpBlexXFVziioD0LvVXpPtZZcrEChlz0SCTB854pFknCPlkOJ8vj2FQLQ\nWub0cW+gkFytD7ObryLW1czxxW4sLc6ZT9R8bE3UvKg4xaQQXLRhJ\/Ib\/dDZfw4D5ovwzHkVeXWB\n6LlShSFDMNIOKKAjwAQCDCMgW0m4eWTAsB0MeFQkUU6mpbFvINN3GYqCVz5X6jgnMgCDNNVXPlfq\n2K0Lq0h5WxgCdT9FvOED1BgTUFgfjDNle0SK4VI3aDhG+U+Oc94EuF8qGGwl4caRASOItiBsu7jZ\nWo9tO5l\/1Czweb5urcMlLaHk0n1o7Mma72jc0l5BVNH7aKEFMlgVRPlPDt1HFsBQArKV5HygGgUe\ncpx4byUSD6+jmZkE5MJekCE5yDmXLWy36mpKkZERh6BjPuKYz3NStnYy5xpDEFPhjPquDNG+sXei\ndLuQWeWHji49BioDkUirmGMwngCP71i+SJLqAEtne5prH2VuffRejAx0YNzcRQW9F3fHLRa9f4dg\nJ81zTQTX6XHk56UgMMhbWJCPeQIMZm1Y2aWnS\/egriN9vv5G5L2HsLM70Uj7nWsVBPghpRlPe8R9\nIEXIu8sXSVJF+9Mi6mxzqbNlyGjqwXQhm2GsScfw1VYBOzbciZvmbgE8QcCTN\/sxdWsA07cHCXxQ\nrODh\/nYKC8ue5MFcu3\/y3B64Jq2Df+YmZJHVMvR+CMvZCf3FOHR3VaNfH0CWkyPHXfliwEo\/NXSe\nStE4FnmpeE9KkGJviiyvdSjUboYh6SBqMz+C0RAP06Vs0UWPUSczPtxFlu7Gjes91CVbdEvIRMd8\nvlt4wmS6gNaOMlxuK0Fd41kM0cQHTM3oytpFYDICVFE3I4V2+\/JFklQQYKGHFVCJct7l+9nTtz0K\nCTzLVY4kig+Gtop\/px12EJbWR+8W8C0lJ9Bdm4H+zloM9rUIDfQ2o9\/UQmrGle5GXOlsQJ+xHqb2\nOnQ1V6BW64DYD8iCbhbAYAKylaTMVz2bTy13Ee1br1WsQU\/RKpgKaRNOu65sWt1VAWoBWxfiAAMd\nV1BIFHurhBg+jbqQhfAJ5CqeQEHwJiFDyhEYkt1RxUpyQyUr8TAup2yjCqJCzD7qqK2AVCxsJSn1\nVZl5T\/Cg9xV8\/fA1fD2zDR2FjsijnV4ivYhTQBa15GfdaYtIwcy1M8dNiTwPsjCFBOcwPVmcJ1Lp\nrxbgPKFcGs8TWCj2yEUqre1Rq2miatqHUKvvzHmQjgnwGAHZigF1leHUCNx6FU9HXsGTwXW4f2Uz\nes87UkcrFRCZrgoBxast7aAcGa5cPwmWViBfS9hviaNsUvReKW12pLQ6ZSikyZ0lK+V7quhYLSaV\neVhJ9VdFz+Y2X07bS7mYeDTFfNA7y2y0dFZS7GW\/oVyrwsO+lzDVtRYTrWsw3bsZw42O1DBKxc0Z\nVNCz56zGtZOV624vwBiWYdJoTCa5KvMwdSYuCtpPSMUCqDylRmeeGnUJSuhP0Pk9FNMu\/EeBjCYi\nF+KJ8z44wGmZrczi\/xmdlzL5avl\/Y6R2FcYbfixcnHRUQQ2jzDJrV1osNHO2GtfO1ANyYbEYZ6kA\nSyK3J5E1Mwgu3dWiBEoflac1+GpyvQidBwO7MdXjiJSj3BioxLMZ9tRuOaqDHHiTDv+3l9loScT8\nX3A5bvIIU\/H22bbCH0MXqYLPVrnochmQ4TLIamcJimsni915htyZSudTSLFkLQZLO6RE6iEep8Sj\na+vwBYXOs7Ef4JtPQvDJ6AYM1K\/ByT0KRL4no285ovbI0BS+GoHU7h2lpnmh\/H\/xX8\/\/O1sZJLOL\n3yfdH7xDnpx3RGVOItex1bLIgilzVuPayRZjd56hWEsmizLUaXIRgwkdZEAVngytw8zVl3G\/5yU8\nub4dk6a30V6sQcRu8g7FYCSFUI67JUP4vrX0eW1Zovun\/hbOcZNuSHeVR6QclNdQfE1z7Uycc2e0\ns0wApoqglwqrpczBJZMGDY643eKI8frVeDx8AD3Fa5DkLUP4+xbAsJ1SNISupgWkgjdBzWvL0mnX\n1+f+wPz\/fvIPSNdSB+xU4m2fnOIiM+d6qP7MYXCaXJWwXyHAeBGwMqgA9JVoCPRlXL\/0E\/SUrILv\ndrnFxbRIin3UaDvhiOPUSXltWTqnJeZ\/Ge5Fn1J\/h7WU33zKfdW6Cn+NudRXI2I3yUWJM7RYzkWo\nUBKpRqizAoHbZXNuXSXgYimxe\/5iKTzfXGL2sI25\/+TnglbjRAARzWGrjG2RjmY9JWarCrw4DGSz\n2ndXGD3eXBLhtfl7G170nP8D+1EYq93orFwAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_b_brown_01-1334256125.swf",
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

log.info("musicblock_b_brown_01.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
