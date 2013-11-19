//#include include/takeable.js

var label = "Musicblock BB-4";
var version = "1347492224";
var name_single = "Musicblock BB-4";
var name_plural = "Musicblock BB-4";
var article = "a";
var description = "Voted Head-bumpingest, Toe-tappingest, Ear-wormingest, Air-drummingest Music Block of the Year, every year, for three centuries running.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 600;
var input_for = [];
var parent_classes = ["musicblock_b_brown_04", "musicblock_base", "takeable"];
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAOWklEQVR42q2YZ3BUV5bH+8tWDQKk\nzt0EOdvj8RdXjbGNDUbGYxtbgAERBJJQaqVWlpBRQjlnIQl1KyGUc05IaqkFCCxAIGQEBoeRGc94\n0u54a2q3trb2w3\/PuaIbueXZ3dmarvrXe\/3efff+7jn33HPek0h+4rdU\/LLXUskvzDeyXjBfTnnG\nPJP4tNkUt9U8HKk1D5IGIrTm\/jCtuZfUE6rp6wnVpvQEa1O6SB16rVenXunU+ljNOunTkn\/Uj8Hu\nlvximcAwlfAUhk9twUjMFkzHPwVTnKNQb5gGgxGb0B++CX3hWvqvBQGiO0SLTlJHsBbteg3aSC1B\nGjQHatBEagxQo8FfjXo\/1UKdn8pcqyP5KM013sqSCk+FV6HL\/zIRYbGcF2FOfgbDp7eiM5wGCFbh\nQoAC\/dGbhPh\/vb8c7WFqtIeqUecnRzdBNgQo0aJX47yfEh0Ee8FfSUAquqZBnU6JZgK94E99+dHz\nftyOntWpUeurQo2PClUko7cKBi+lOe2Q1GkNHFmtb7HoZfRFbxZgDGUL2BelRZNeSZ3L0UZwrSE0\ngE6OLgK8QIBNBFjlw\/c0NJic7impjQYGTxma9Vq6R8+SBat9lagl0EpPpRWQwFDqrkDhcTkSP3FA\n\/D6Hvtj3JQ4C7n7xy053CgkuasVCtoCNQUoB10vic4ZiuJZgtQDrIBdX+8rRQtcqveQrUF4yGlxB\nbTQ45ykneC2MBFhLVjTQ8QJZ1EBwAmb\/Tytun33KY+u9Uj9CLu0IUwugnsTXMFDqg7FKP4xUkM75\nY7I6ECbSmCEAw+cCMFEVRNJj6OxJ9KU7oTVxJ\/rT30Vz\/A70pzmhKW4HWhPeQXeKE8pPytFArmaw\nGractxL1tCbPBxA8nScImLWK3efwg7DiYuHLywzGinG2R4sxG7PTg\/js0giuXxnFzatjuPXZOBau\nT2LxxhQ+v0man8bdW+Yfia+xuM2dGybcnpsQz92YHcXc5VGYes6hO\/8EKv0cUUdwrHJPBdIO\/TQg\nK37vRi\/JHEUswyUdlMJ9tyOumocEHHc8f+3iEzAafOn2DO7dvoT7C5fxxZ0ra8TXuY0AvvkElPvh\nyXK\/M2Nt6ErfQ+5Wo+ykAkUnZMLVsXvX6rSzQ5\/kcuqzAtD9LTuEHvmlFc5iNR6IB2Qwhnj4+VV8\nefcqvlp6oqG+RnpuSFx\/sDgr2nF7fo4nx\/2shrxysQ3t8dtw1kOBguMy5LkqcJqBbPSps8Oy5BIB\ncnQeem0dwo9ts8Lx7BmOLWIBY5iv713Dr7+Yw\/KD61btem8nAgK9xHG4v8kKyha1WHM15LWZYcx0\nFZKLlch3lZMVFWytn5RkLG4rhb8Sh7etQ6TrNqtbV8PxgBawbx\/ewKOv5vGbr+fR3FiJFlJgkDey\nMhMREOSFS6Y+0Y4nw5OyQLIl2d28pnlN8lLqSHqHrEeAbkqOWrLYWklGY7eiIVCJo6+vQ\/TxbaIT\n7swWji3FYN99cwu\/W17A98t3EKT3EWLLBeq9xXF8pB3ffnlTtOfnbCEtgcOuHjcGIPeYHIVuClpz\n9oj5eK0kvMXwfnb8TTt86vb6imspIHgNceer4X7769sC7A+PPseffrOEvNxkIX2wL3JzkgXsVVqL\nPAkLJFuS3c39rXY1W3GqJgjZx2TIP\/E\/AHZSJqgnF7ttt0Osxxs\/sh53LtxKg\/GgDPfHR3fxz79d\nwr\/87h6CQ3yF2HIMycfp8R7RzgL5zf3PhBe4P1srTtUS4FECPM5BYo9TH6+VpJ2Sfx3lUA+K4jgC\n5FnybBcuNWJxpgr3Z2vFemO3suUY7vJUPwzn8lFYkCYUEqpDQUGqgL0xOybacXu2+mor8sS5f15G\nDDhdq0cWAWYflYv1Fv3RWkk4d3Le9NyxHrmR+63uHSzZhf5UBS5mq4Q1fv\/tonDrX76\/L+DYWiFh\nfggliXOC5OMlU69oZ7UiBRVbkZeLcDP1z27mYGHAzCMyZByWIcVFhigCspVE5E5K7t4718OQrhMd\n8KLuL9qF7mQFhjOUYu0x4J+\/I8Dff4GervMC7t4d2rQXLxOkP4qL0hFMkLfmxkU7bj+\/2IcH92as\ngNyvBZDX4XTdCmA6Ax4iwD32ayRppYSe7yqF7zvrYczQoSpxO8qD7VEXLUVbglxY8fZgFD4fOYXv\nH5gEoKGyQFjrP\/\/6CP\/1b99ZrclHdr8FsG4sCoXdHggwvIJQ4y9xricEyfX7fwTIcGkucgKUInLP\nxjWScCmUR5Hkt2sDqgiwIu5NFAdshDHcAY2nZehKUmAwXYnxHBXMvblinTXWV8BoKMC\/\/+Ub\/Me\/\nLgu4osI0uqcTAcAuZsCsdhdktrmgYSTO6uIz5\/ejZTADU1MtAjD1kFwomVJtxIcb10jCpVCeqwwB\n725AdeYKYLbPBpSRFWujpGiJk6PnsasHm5KElSyR+9c\/fyW0cm1lDc5M9opI5yDJbDuEsh5\/9JoK\nrFuNV9HPUdwSiNHxGrEGM44oCE72twG5FGJA\/e4NqMn0xaURenCgDFXxr6Iy1AHnT0kxfPZdTFbu\nhqn\/rNjr8h\/vfbzeWAxckJcirs1RKrMESNVgBIx94eiZyBfbDEdxQvU+xBn3one4TACmH1YIcbES\n\/sHGNZJw8ZhLLg55b6MAFGmOFrIhYTtKAjfCEOZg3ajHR9uFlSzZg4Es+5\/lmHTmlMgq3D618SCK\nO3QobPXFhf4kmMwNcM99CQWN\/hgaqxYbdbqLgqJYgTMEGEZAtpJw8ciAYe8zoI811VXEb0cWubo0\nyN6aTXjj5T1x4cYkTGNdaGuuEmLgnOwzAiwqWi9AuX1ldxgqukKRWPOJsFxxcxBiK\/eKLYZTnakm\nEKkUIJlHCfCAVDDYSsKFIwNGEG1R2HviYdt8bEl5tsUCu5ElcnHQSi4eG2q15uHyjlCcbQ9G61C2\nNc25pr+AnFod+oeMVKUHCMCsY0oBGEpAtpLU+WuompAj6kN7JB17jmY2LCBXVzS8f\/Eity23GJZV\nUpQBI209XHKZJ7qtlUxC1X7kNHiheSBT5HiO8OiSPciq9kXvgAGTVf5IOsSA9H5CgCHvb1gjSa3f\nSmX7Kec+2rmbCoJwmbLBrHmAEvoIbs6uWPTOdSpc51cK1weLXOU8AWbL+Qd4iuNgb6O1umaXJhmP\noLwl0pp\/XRKeQ4bBGz295zBhJMCDcqQfUVJVTYC\/2rBGkmp6Py2lyjadUg1DxlJOPJ\/hgaGWIkxf\n7MIl2jauTPfjmnnQCjx\/bRy3P5vEwpyJwE3w9fNAclKMOI70N2PxcbkfU+aMU6UfQ5f1OmLPHkRN\nazLC8j6AoSEBgwO1GDf4keXkSDtML08EGExAtpJU+WpQ4q5EiYcShSeUBOggFEcld7bH8yjWv4Ga\n5MNoyvHEQO0ZjDTliKL0CmWMWYK+Rkvi6swQVckrmqP\/rGszg3R9UHhiZKQeLZ2F6OqpQDa9FfLE\np0Y7MZCzh8BkyD2uoldNKfTvbVgjiZEAi6mi5aq23Esl3rYqfdRCxQTOlYYFmpVAb1vJtF6yT2zG\n2ZA3UZO4F815nuitjMZQQyYmBi5QhHcKTY52YGKkA+PD7bg42IaLA60Y62\/BaF8TBtqNaAx\/DvGf\nyJHrugIYREC2kpzzVv9QSAVjMa3DsQpHDJZuQXcm5ecTKuRQdFf7aVBDgXQ+UEtvYhpU0CQYnsF5\nWayGZ\/BUyql872zIG6gIfwON2W5ozGKdEKpJcUVV0jG0Je8WY8TtlyPHAkjJwlaSCm+VuYAA53ue\nxx\/vvoI\/LO1GV\/4WxByj3Z0GLDlJMFSW55P7i9zVIm\/muipR5kVLw4MsTuDlnioxEfZAGZ0zIFt6\nNbxlAnyfvWTUaeg9hLxDYhfHEWAgAdmKAUsqQ1T4du4lfH3lRTyYeh6LE04wNW+lilaKYoLIoo2U\noQoJkMsi3ljzT9D5AZm4xxHIg+SQYvdKadtQCPjagE2o9teiir1A5xU+GpHWUl1U1DdZf6+cKmk5\nSk9q+EsC1QPrbWS3LKk8qXQyEODdsWexMPg0bvY8hYdXXWBud6SCUSqslkkJPYcAC9zUIrHzIPnH\n1WQB6eMswNBKZJGr0ikiOTJjaHIcAGm0CZdR\/8ZIJUr1tJ05U2nFgB\/JxDmLx+D3YH+n9Tay6xPf\nZyhAUsYrN+Nyw2bMdW3DiPHnyA1RUsEoE1bLosGzaSC2WvKBlfpNuIUAMwiQN9s0gs6kDTfj6IrO\nEORAmaNYNqxbI06YH9iCVB\/+iqESfcc480Tk5G4tv6RDt2u9jdZFWD\/BlXjKU9pSNcvtec+iNFIF\n1+38SUImrMZwmQSQR1ApXL8RoMWdDJZKYqsxGG+6aUdUdE2JpYkX8Oj6S\/hm9kX86WEw7pscMdns\niFPOCkR+KKOjHNHOMjSFbIY\/rTcfglot3ds\/+\/FHzaoAmUPifumBoPflKTSAmd3JVssmC6Y+tloK\nHZM5PZE7TztL6b9CbLSnGZbAhA4zoAoPpp\/HvfHnsDjyDB7O\/AoLY07or9yEyI8UiKY1GEXido3B\nm+D9jp2t6v9Pn4VzXaWvZhyVR6QfltdTzlxgd3J6YnfG7pMJQLZa9EdSKxgHAa+zqbqtuN7piKst\nW\/DlLGWn8pfIxXKEEyDDhX0gRX3QZtriVPDcafdEO9YtH33t8QfMv\/fH35IpaA6Q6+spPS2wK9lq\nMeSqMwcUAiz50IrS6H3XfIHW39AeLM1QGqzYhJO75SsupiDJp+XTHbUVIVRJndxhJ+Tx9rplj53\/\n9KrkH\/lr1GudaDuKKHRT9xW5a5ZzKcLPHFSKIIilTFEeqUYBvT3qPlRA965MwFf7bxJw8bRFub9t\nB7e31i2TIv7flvt7fp2xMofeqK1ONf7qeoNOYzb4qn\/Id1OhiPbGCm+1OHIFHfWx\/YL7W+tK3Lf\/\nzOtv9fXfUIbckFIZl\/IAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_b_brown_04-1334256327.swf",
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

log.info("musicblock_b_brown_04.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
