//#include include/takeable.js

var label = "Musicblock XS-3";
var version = "1347492224";
var name_single = "Musicblock XS-3";
var name_plural = "Musicblock XS-3";
var article = "a";
var description = "This rare musicblock is a bootleg from a Lapulapu Cavern rave dance party.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 500;
var input_for = [];
var parent_classes = ["musicblock_x_shiny_03", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_xs",	// defined by takeable (overridden by musicblock_x_shiny_03)
	"music_duration"	: "5000"	// defined by musicblock_base (overridden by musicblock_x_shiny_03)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANZElEQVR42q2Yd1SUZxbG5889ZxOV\niMA0BlxTdI3RmI0mYkiMPYkoxkpTelER0xQLKiBNGREQEBBFmqAU6XUA6UiRakdiT9GU3Ww7e569\n98UZYcA9m5zMOc\/5ZuZrv\/e59733\/T6JRO8TvNBgfJnHFMvefdOsen2n+fV\/+Zpf92ev5HSRmj0n\n+zWS6t3NhC6SalxJLmbeVS5mllqVuSgsK52kKsnv\/XkUMtPhxsEZGPSfgZ6dU9G4bQqaSF07XkHn\nU9W4maHewxx17uaoJdW4maPa1QxVpEoXM1SQypxVKHVSoZhU5KhC4WZT5JPyNpkO5G5SarIdFJrz\ndgrNOVKWnUKdskHukGD9PwbErt0OfKPjFsF17ZqKBp8pqPAwQ5GLKXI3K1C7dbIQ\/87ZJEeZOwG4\nqXDeQY4qgr3gqESx2KdAOQ0gj7b5m5UocVEh216BQkeGUyLXQcmQyKFttr0S50lZdkpk2iqQQUq3\nUWjCPzG0HAX4MOTNnHvBs1BDEAzGUPqANVvMUeCsFFAlBFfiqkKWvRwVnubIdSQIOjbDVkb7zMT2\nvIMCxeRqmo2UrqNCJoFmExxvswjsrI1CB5i+UY6kdTLEfypF8PJJOLTMMIdNE3Dfhs6yvBs0kwCG\nHNIHzHdSCrhqEn9nwGKCKyIxWDkdl2kvQzFBM0wpAabbyJBFxzFYykYZDYyg7QiIwpxO2zxKgQyC\nG4IZW0FLDf2G3At9M6lxx8siZAxU5WuB6igvNMZtQ13MVtTHbkNrwnaSD+rjtqM2xhuN8T5oItUc\nc0HV\/qUo2LUQNQeWia2Gfl\/Y+SGKfBeiYt8SnNkgQz7lJYNlUZjT7OTIdeLBqZBKYQ0imMCloxWw\nxPCJcJHcG2Aw1v4lhshLVqO7pRK9l6rQ316NK+01uNp5Edcu1+F6Vz1udNfjZk89bvU2jBL\/z\/v5\nOD7+aketOL+vTYOWwpOoCHdE+uaXkUNw2aQzFFr1CiMEMNAY8l860UFyY\/\/rAi70YyM4f2A+Ao5v\nwDfSQg30NeJ2fxMGrzSPKd7Hx2hhGZQHx9fh6\/F122vzUO6\/ksKtQjK5m7DWhEJNkEsmjZL\/YsMc\nSe\/uaQLQ5e1x+HLN3GdwdGGtY3xDLdida624e\/2S0L0bz8S\/ed\/XV1t0sHwen691Uwt5ue4CSnbO\nx6n1NDHWmCCWJoc\/RU9fB5dMHJD07J4qZufGWS9g57q5OucYTuvacLD7N9uQdiYGrh6bkJYSg4QT\n4agozkRD9QWUF2XoYBl0LEgOd09rJdrzo5FsI0ccwSWslROM4ZiStHz2Mk1\/BWzffBG+69\/RhVUf\njm98\/1Y7Hgx04FjEIVgssICbx2axHf6d9\/NxfDyfx+cPh9TmJKdS6d7Fwj0GDFhqiAOLR0vSRDM4\njwqtw+wXsXfDuyK0fLHhcOwa3\/jR7csCJDMtHt\/f6UFrXTGqy7KFkhIi4O7piG8Gu\/BwoHNMSG1O\nakPdTNUhZrUJhVlGM\/c5gI1PATe\/NQ5+G+fpQsvh0Tqnhft2sFtAZKXH44f7ffjxQb9Ox6NChIO8\nPzIiaASkNtx83eGhbjvpg+MEeGKtjMsK9i8aLQkX2hwqzE40Sfbbzhvhnsg5ugnfjOHYtSf3egXQ\nT4+u4udvrul0PvMkPLwcERqyTzisc5Lc5+uM5WJbkg+irGmSkIM8KfwWjZakzN1M5KDLnPE4aGeh\nc49HrXWPb\/bd18\/gGOhv313HL9\/f0Cn2eJhwkCGjI4PF8ew6n691kQc+PBfbk3YgkgCjraUinPsW\nThwlCfdOBnSfOx7HfKxHhJdHP9w9Dis7x3B\/f3wT\/\/xhAP\/68bbYNl0sEJBhYftxLiNBHD\/cRb7e\n8DBrAY+tMkEE6cgK4+cDptvK4fnOBCQHej4X8PHdHp177Ng\/ntzCv38axH\/+ekdsT8QeGXJwi5PI\nRz6ezxsLUISZ8rD91BCgeqWxANxLQPqScNOPXW2MLfMm4MyhXweoVgdg567tiKdayICeW5yRnXUS\nFytzxwTkPNQHPLqSAK2McfgTY+z5cOIoSQqpkcfSTPK2MEDKMMC+W93oGexH352ruD\/YO2aIvbY6\n6+qg59PvvJ+P4+Of56AuxATIcOFWJggjwN0EpC8JL4ViPjWBz3wDpAZ5DjX7\/makPv4Zp3\/4Raj+\n4d3nTpJv73ShsbYAKaejRXg7mspwpbNGAN7MzsGVxOQRpeZaXTmuNGueTZJVMgqvCa0FjOG7YOIo\nSXgpxMXys\/cMkEaAbL\/m61s6OBbDal18XpmJiQ7V1cGoY8HCPYbrPnxcV2Z4FnfFJKLj0DH0NZQL\nwIiVMiFerPgueGmUJLx4ZMAv338J6U8BM757MgJwyMU7utnM+aVfqHnmMhzXQE3peV2J6Y8\/hf7k\nVOHe9UvV6AiKJMAIdBfniTp41OoZ4C4C0peEF48MuPMDBvQQRTT\/\/v1RgOWPHoh80tZEBtXCstg1\nbU\/mXi16MuXeQAsV5B0B6EvPwGV1LDrDY9CnKRatjjtJuJWUZrIMIQTIDPqS8OKRATnecd7LRG7U\n3egbBXjj1mXRVRiCARiUxa7yNiM1TsAFHdojVjvD+\/C1KgJKS0erhx96L2TrVjSXTm5H+AopIlfL\nEUyAXxGQviTZtHBMWCvFXpoxoWteG1qvdTWOgCt9cE8kOedSBJWW8uKzwqHhijgaKOBd3TfhaHiA\nDo7zjp3rSU1Hu98RdOedF\/foaqlAa+J2HBaACgR\/RICUZvqSnKMnrdO0suVWw70vy98W7fUluNxY\njs62GjT1taG3i2tXna4EqcP9BUxg4G4BxNJ+5xrY1lCiW12zcy2OvugrK0BvyQV0RMahMzsLl5vL\n0ZLgjdBPKMTWcgQRIM8DfUkyHUzFyvYo1SOG5Kad+sVSXMw\/hdbaQrTVlaCjoYwuWIbu1goRnsQT\naji52OHAga+wwW6NgHV2tRdbHsTQswnVuooitO0MRl9pvlgc8Lkdp5JxKUCN9uoCtMRvI0ATKtYy\nApyEL943GCUBeHIdPZeul4tljz8\/CywZerKK3DgV8R7zkbHfBjkhrqg8HYDqjHBcqitCewODk9NU\n9zqbyoQjXS1P1VxBqkRHfjZa3Pei41wGOhtL6ZxSXMpMR7PNF2g5m4raoFU0OUwQs0aOQ\/QI+rml\nwShJMuxVSCRAVooNPffy4yA9TLMS6L8oa6kOmsWPiWGU0JFrzZHoRfC7rZEb6orSE77QpIWjvuQs\nmjT5Qo2aC0INVXlC9VW5qCvMQn1MLGoyEpHvNY2cM8HxTxXPB0yzM33CS+7EDXLURk1FpfpVlPpP\noTWaghaTUmRuUuEcTaRsJzNk0faMzRA8g6upRQ2HZ\/Aj1LJ4CXXSywLJW+cjN8RRp5zgzTjr74C0\ngw4o2rcMcWuVBCZFNAEG0sC5WehLkmqr1PCSu\/f8LDzpmYfHvStREDwVe+lZIZRulrRRiWgCjeNB\nrFeK3hlLITljS6mxQSnAU2yVYiDJNgqc2qgQ8EHLjEbADw3AWOznKGU4qARc4HIOsQIBBLiDgPQl\nSeG3S+6muN\/4Nu7UvoWBytm4UvYx6lL+DL\/FkwQE35BXvQwYTn0zylpG+aqkFYgJuSUXfTSGXDgu\nbmSEqNUyOo9AnMyRSa5nbTbDOUcaiJ2pmBDhKxU4sMRYwAUsMyFoJW0NaT0wYYS2W0wYkCTbKSwZ\n8HrRTPTnzkB31uu4XW+Pxozp2LdoEkEpCEJGAHLErxuC4tYUt4bCQzDcBXgmcqmIIkg17Quj0uG\/\n1EhMgKMEm+RpipQtlOtuSgF0xEqO\/YuN4U\/f\/ZeaIIHu4U+A2xlquCwm5Ij3M4lrZX51Ua+iNek1\nXD77ATQxb+EgLWKHADnEciF2LexjXr9JRVgCCTCC4I\/Q73ACi6KCy12BYcMIuvzYVJE2rN7Cj6iL\nvA61kynCVsip5hoJuIOkDKokB+ipbpvFBH15617BJdrK\/PL9Jg\/kB0+nlqeCx7xJYhnEUAx3jABi\nyTX+j9uTNpwMxq5pXYxgrZKL\/2+Uz8bD5jm4W\/cXPL72OW5WzkRNynQKr5QGb0RbExHqAjdz+Lw3\ngRbN40fI690\/jHypmbnGYHzwcmOrXQuN1dGrFRoOJwNG0U25qXOesVvcnjicHEaGYxeFmwR2lKSm\nHOM8u101GzdLZ+FawUwM1Fiht+gjFFOk9iyWihD7kfj4C65m8Hx3vJ7GJf1fr4VPrFFYUg76HV0p\nzaEQPglbIRXticN5aLmxAGbXDtIsHQ7HedaYMA1dZ6ejI2UaButcUBU1GyH2UuxZZAI\/cs53oRFy\naMHMJc7jnXE6uc8dN+A6WzL+N73HDlg+QRW5WuqduEGZc3iFyQDPSgYLWGZM4DIBdpjEeRZOnakm\n8mU0xs9Af7ktAb4KV8tJ2Euh3Ufuxa1ToHLrn\/DVAgO4EZgQwbm9\/cc3frcX75Ve5qpCNzMrKiFq\ngtacpvoYQ7nKgDwBAmlSJW1T4binCl6LjOH9npEYAJcfhjtEPdhl7jg4E5jLnHHev9m5X\/Op2mpm\nWbFlsneui1kOdZ+Bc1SYOZSiG9H3dAcq+KvoIWmhQYfznBfUTnNfdHjetf4L2CrBJfPSqsYAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_x_shiny_03-1334257246.swf",
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

log.info("musicblock_x_shiny_03.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
