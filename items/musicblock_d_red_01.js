//#include include/takeable.js

var label = "Musicblock DR-1";
var version = "1347492224";
var name_single = "Musicblock DR-1";
var name_plural = "Musicblock DR-1";
var article = "a";
var description = "Music to drink a Cloud 11 Smoothie by.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 400;
var input_for = [];
var parent_classes = ["musicblock_d_red_01", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_dr",	// defined by takeable (overridden by musicblock_d_red_01)
	"music_duration"	: "10000"	// defined by musicblock_base (overridden by musicblock_d_red_01)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/musicblock-dr-collector\/\" glitch=\"external|\/achievements\/trophies\/musicblock-dr-collector\/\">Musicblock DR Collector<\/a>"]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANJElEQVR42q2YeVSTZxbG8+ecM61K\nRSAbAccuOta6dKqtWFrrgtoKqLiCCMiuIlqtYgUVENyICgooikJkixL2HWIQRECxorgrWq11q850\n1v+eufeNSUOidqanOec5Sb7vzff+vufe9773i0Ri9UqeZNe\/LnyIe0\/sMM+emGFxV9a+F3dx9Tu6\nblJ7xOC4NlJrmIvQKZIhhBTsEtUU7OJuUl2wwr0xSKqS\/N6vR9tG+t\/cMgJ340fg0rqhaFsxBGdI\n3avewXcvZAh1QWu4K1rCXNFMMoS64mSIC5pIjcEuaCDVLVWhNkiFalJVoAqVAc4oJ5Uuce4tWaLU\nF\/sr9Cf8FPrjJK2fQq1ZIPfPmvWaG2LX7iR+cP42wXWvH4rT0UPQEO6CqmBnlAQo0Lx8sBB\/1y2R\noy6MAEJVOOEvRxPBlgUqUS3OKVBPN1BK7+UBStQEq1C8WIHKQIZTosRfyZDQ0XvxYiVOkLR+ShT5\nKlBAyl+k0Kd8Ze9uA\/hw22jdD8mjYCAIBmMoa0DDMldULFUKqBqCqwlRQbtYjoYIV5QEEgSNLfST\n0TkXmkxG4xSoJlfzFknpOioUEWgxwfG7lsAKFynMgPkL5cieJ8PBOVIkTx+ErdPsdWyagHuyfZT7\n\/aSRBGB0yBqwPEgp4E6S+DMDVhNcFYnB6mlc0WIZqgmaYWoJMH+RDMcJkMdoFsroxgjaj4AozPn0\nXkopUEBwRpiXK8nDPs7o3vbR2W2r3hYhY6CmGDecTItEW+YKtKQvR2vGCnRmrSRFozVzJZrTo9B2\nMBpnSIa9wWja5IGK9ZNg2DxNvOvpe9m6L1AVMwkNsVORu0CGcspLBtNSmPP85CgJ4ptT4RiFNYlg\nEj1slTDV\/rlwkdzrZTDWpqn2KM1R42JHI3rONuFK10lc7TLg2nencP1CC250t+LmxVbcutSK2z2n\nbcTH+TyP4\/HXzjeL318+p0dH5WE0pAQiP+Bt6AiumJRLoVXPdEACA71E8R4D\/SU3N70v4LZ\/6YCl\nn7v2geMJeCITVO\/lNty5cgZ3r7a\/VHyOx5hgGZRvjq\/D1+PrdjWXoj7ei8KtQg65mzXXiUJNkFMH\n2Sh+ir1O0rNhmAAM\/qgf1vqM+wWOLmxyjCc0gd273on7N84K\/XDzF\/F3Pvf9tQ4zLP+Of29y0wR5\noaUMNesm4Mh8Whg+TsigxRFP0bPWlqkDeyWXNgwVq3PhqDewbt44s3MMZ3LNEuzBrXN4cLsLP\/ae\n7yM+xudMsAz6MkgO96XORnSV70PuIjkyCS5rrpxg7F8qScfqt2n5K+A7+k3EzP\/YHFZrOJ7YBPbo\nzgU8vtuNgmOZKNfloqn2OG7T2Ie935lheTz\/jn9vCWnKSU6l2o1ThHsMmOBhj81TbCU5Qyu4lAqt\n\/5g3sXHBJyK0fDFLOHbGEuzp95fw071LCIsIFHKbSCu\/rlgc5\/MM+jJIU06aQt1O1SF9NgPKaOW+\nArDtBWDAh\/0Qt3C8ObQcHpNzJrgndy+aocIjA7Fje5wQf+5qq8Wz+0ZwHmcJaQo3X9cy1OcOR2P\/\nLCccIEAqK9g02VYSLrQ6KsxBtEg2+Y7v457IOZqEJ+NJTa7NmuspXAtfFiTEn1v0pfjbj1fw\/Ice\nMc7sJLnP13mZi+eyo7FvthMyfWRiUcRNtpWkLsxF5GDw2P7Y4udmdo\/v2uSeKaw8OUP8\/fF1\/PPp\nDezauUUoYtlSXKDE\/\/nRNTMkj2fX+fcmF\/nGLXOxK3sVUsnB\/RTmLRTO2EkDbSThvZMBw8b1x97o\nWX3Cy3dv6d5fH1wWEAz372e3ELl8KSlYOHjmVAX+8eSGOM\/jrF3k61mG2QS419sJe0i7Zjq+GjDf\nV46IjwcgJzHilYCcXyb3\/vXTTfzn+W2o1QnYrU5E5IpgXOrSi+N8nsfxeHMuWgGKMFMedh0xAu72\nchSAGwnIWhLuODLnOGLZ+AHI3WoF2FH1q4AJCTHCwfZTlb8KyHloDbjbywlqT0fs\/MoR334x0EaS\nStrIMyhRo9zsoLECfBLpgUc1ua8N8TfrosT7xXNN4rhliF\/loDnEBMhwKZ5O2EGAGwjIWhJuhRgw\neoIdjiVFmFfxvdMV+GmyAo9j\/V+\/SHYZF0n32UZx\/OeHV\/us5CsNLeipNdiUml8WiQwpM52oF3BE\nzMSBNpJwK5ROgKs\/tUMeAbL9XA4efusrAFkPe1rMLpog2SnrMmMJZ3Kvem0xMkZlonL1cWS5ZaE9\nv9ZcZoyLRIY9XjLRrMRMfMtGEm4eGXDtZ28h3wTYWYenM98xAz7as8ZcqHlyzi8Oo3WhtoQzlZiq\nNSdQ9fUJ4Z5hbznKoovQqas1Fmqqgwy39wXgegKyloSbRwZc9zkDhou7+z5tgxmO9XTeaDEZO\/Jr\nW50lHOde\/uxc4Z6pBup3lyF9ZIbY6ngnUXtKsZfCvI0AmcFaEm4eGZDjnRk1TeTG47mj+gCyfjy+\nz6ZZSE7aSIpFaHiAWMV83HofZri8WTnm1dukLqVnkBzR0Zw9vJLyT4rU2XIkE+A3BGQtCXe2WXOl\n2EgrZrvPe7haX4h7m5biYdgUPPIfbwZ8HDHVpt0KCV8ixA42VBeZWy5Tb8hlpWK1FuWrisxbXGWM\nFrmeR6jDrkbnoZXYSYBpcxRInkGAlGbWknBne5Q6W+4ceO\/Txvuiq7UGF9rq6S6bcFk0r9wftvQp\nQQyRmLhBKCRsCVppkVg2rabu+pj3UZF3DMfRadilQ\/6CHBiOlKIjKwrbv+IQy5FEgLwOrCXR0qMg\nd7a7qR4xJG\/ax9Z44FT5EXQ2V+JcSw3On67DhfY6XOxsEMl99Tw\/pxgQFOJHWiwcrCg2htGkmxeN\njwplK4ug8ToqVm1rbgW0QRpUbi5CW1kFOg6uoPonpa1ORoCDsOYzOxtJivydkU2A2fPl1PbICXCQ\nED9ZpS4cioPhE1CwaRF020LQeDQBJwtScLalCl2nGbwGbfoyaPMOoO1kObo76o1qbyA14sKZBhQv\ny8N+WhSla\/NRGJiLgoActJSUoZNytjnZmxYHtfw071Z6BP3a3c5GkoLFKhyaJxfSLFKKp61j9DDN\nyqJjabOkZmgWPybuoIROneuKQ5EEv2EWSraHoPZADPR5KWitKcQZfbkQw7OaK3RoOKpFTUYhGgu1\nOFVfDEOFBuWRwyj3nJDu8xrAPD\/n59xyH14gx6nUoWhUv4va+CHInKsQbZCWcvQ4qTjIRbzn+hrh\nGVxNW5QlPIPvoi2LW6jDkW7IWT4BJdsCzdIlB6Aw3h95W\/xRFTtNzJE0Q4p9tEgS6cZ5s7CW5Jiv\nUn+QGsaeE6Pw\/NJ4POvxQkXyUGykZ4XtNFn2QiU1lVK6GLk8Xyn2zgy6Y40vpcYCpQDXEHTREnqM\nXKTAkYUKAZ80zaEPvPEGHMX5ExSlAn8VuSZFIinDR4EEAlxFQNaSaPjfpTBnPGj7CPeaP0Rv4xhc\nrfsSLZo\/I26qg4BImy0VUAzI+2YaFdYDc5XkFn+Wi300nSZJn8MTOdB4GUWEQIJcUUSuawPI\/UAX\nct4Zu73JeS8FPbE5CrjE6U44QqmVMM2e+oEBfbTSbUAvhVjhrgl3xo2qkbhSMgIXte\/jTutitBUM\nR+yUQQKKHWHArHlKaoucxPaU6aPEVoLhXWAHHeNiy6Ha7S0TKzPew0EsgD1zZDgS4QzNcmccClVS\nKJ2QQoCbCTCePsd7ONEcCvpsj5UMZSm3ATrx\/8yh+bK4lrR30Zn9Hi4Ufg59+ofYQk1s7GQj4H6a\nfP8cuXCNAXl7YscSCXAPAe6i72oCS51N4SUxLEM37B0q0obVUzkDPWXvQx3kjJ2ecsRNcRRwrAKq\nJJvpqW6F2wBrRZn\/gsv2lcWVxw3uLU8eTlueCuHjB4lwHpzHOShHqrfRtV1U+VMY8EU4GSzFy+ga\ng3HR3UNS07Gb9WPwsH0s7rf8Bc+uf41bjSNh0AwnGCltCg7YQnCbpzqhItQV0Z8OoKa5fx9FfvKH\nvn9qFvnY9U+e7ui5fpKjet9shZ7dYtc4z0yu8d7JjnE4OYwMwi4a3SQ4bzmFWS7y7E7TGNyqHYXr\nFSPRa\/BET9UMVFOkNk6RYhM5yOKxZdTVR3zS30r9sv+nv4UP+CjcqamM2+0l1RHUc947d4gNnkrE\ndOqGvYxbVTwVdhNYygu1ZQ1Dd+FwnNcMw92WYDSljcG2xVJ8y4CUgxsmOUBHDfMhKnHhH\/czK2xc\nv96QMZL+v+l\/7ITpA1RUdqIOLVDqds506uVFwa4lTHOksiQTYLsoxzjPUubJYEh9G20HR+BKvS8B\nvosQ90GIpbDGEmDmPAUal\/8J30y0QyiBCRFc6Ed\/\/OB3++O9MdJVVRnq4qnxc1ZTSdLnUH1Mp1zd\nMVMuFkAireTsFSrsj1AhcrIjoj51wE4vuSg\/DLeV9uDgcf2wlMCCx\/aL+s3O\/T+vpuUu7g3LBkeV\nBLvoaCfqPU6FmUNZTNLS53x\/KvjeHGK780vHvqEOGvem\/6uu9V+E\/raRigukjQAAAABJRU5ErkJg\ngg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_red_01-1334256807.swf",
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

log.info("musicblock_d_red_01.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
