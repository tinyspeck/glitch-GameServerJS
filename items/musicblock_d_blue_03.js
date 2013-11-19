//#include include/takeable.js

var label = "Musicblock DB-3";
var version = "1347492224";
var name_single = "Musicblock DB-3";
var name_plural = "Musicblock DB-3";
var article = "a";
var description = "Warning: May cause you to do the chicken boogie.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 500;
var input_for = [];
var parent_classes = ["musicblock_d_blue_03", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_db",	// defined by takeable (overridden by musicblock_d_blue_03)
	"music_duration"	: "13000"	// defined by musicblock_base (overridden by musicblock_d_blue_03)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANXklEQVR42q2Yd1SUZxbG5889ZxOF\niMI0iqtJdI3RmI0mYojGbhQs2ABRelEBTYxiQaWKkZGOgIAw1FGG3mEYBEFRrMQuGo3pmmT77tnz\n7L0vzgQGzG5ywjnP+WaYd77v9z33vvfebyQSk7+YueYjG\/zHOfTum+jYGzox7PqOV8Oubn9Ze4V0\nNmBsWCepw89W6DRJ70Pytg1q8bZ1MKjBW+HQ7Cm1kfzWf18dmuJ+5+BkPAifjGs7J6Bz6zh0ka5s\nexmXnknva4sOfzu0+9mhjaT3tUOrjy1aSM3etmgiNXjZoN7TBrWkGg8bVG+yRiWpfKN1X9lGpa7U\nXaE75abQnSRp3BQq9Tq5e+aKn7khdu1+5OsX7xHclV0TcCZkHJr8bVHjbY2yTQq0bRkrxO+1G+Vo\n8CMAXxuccpejhWArPJSoFZ8p0Eg3UE7Hyk1K1HnboHSDAtUeDKdEmbuSIaGlY+kGJU6RNG5KlLgq\nUEQqdFHo4pZaOAwB\/PLQG9rPY6ZCTxAMxlCmgPrNdqjyUgqoOoKr87GBZoMcTQF2KPMgCFpb7CZD\nvZ8tCl1lKCXIWnK1wEVK57FBCYGWEhwfNQRW7KIwAhaulyN7jQwZq6SIWTwaUYsstGyagPsmdqrD\no+gpBNDvkClgpadSwLWS+LUAJLhaEoM10rqSDTLUEjTD1JODhS4ynHRXoIbW5K+X0o3ZosiNgCjM\nhXQspxQoIrh+mOEVvdAirN+92DeyO7eNFyFjoJZQe7QmBaLz2Fa0p25BR9pWdGcGk0LQcSwYbalB\n6MwIQRdJn+CNlv0LUbVrLvQHFomjjt5X7HwfNaFz0Ry2AOr1MlQyIDtHYS5wk6PMk2+O4Cms0QQT\nuXCoIhZYPBUuknt9DMbav8AC5bkqXD3XjN7zLbje04obPXrcvHQaty634\/aVDty52oG71zpwr\/fM\nEPH\/+XNex+tvXmwT3\/\/0gg7nqrPQFOeBQo\/xAq6UlEehVS0bgwgGGkbhC0e5S+7sf03AxX4wBl6z\n7QbB8QX4Qgaovk87cf96Fx7cODus+DNeY4BlUL45Pg+fj8\/b01aOxggnCrcNctfJkLnaikJNkAtG\nD1H4fAutpHf3RAHo\/dYI7HCe8RMcndjgGF\/QAPbwVjce3T4v9Pmdn8Tv+bPPbp4zwvL3+PsGNw2Q\nl9srUL9zFk4QYIazFdJoc4RT9Ex1cMGoPsm13RPE7lw\/9QXsXDPD6BzDGVwbCPb47gUU5KXCx38j\nCtSpyEyPQ1NtCc60VqCxpsgIy6DDQXK4r3U3o6cyGXkucqQTYOZqOcFYDCvJue3jRUlwfeNFhK59\n2xhWUzi+8ON7Pfii7yIS4qNgP8cevv6bxHHga\/6c1\/F6\/h5\/fyCkISc5ler3zhfuHV8jp5yzwIH5\nQyXpoh1cQeXDfdqL2LvuHRFaPtlAOHaNL\/zV\/csCpKQgA989vIbu9lq0NpQKZWfGwy\/AA18\/uIIv\n+y4NC2nISUOoz1J1SF0pJQdltHOfA8glppw6waY3RyBs\/UxjaDk8BucMcN88uCogNIUZ+P7xp\/jh\ni+tGpSQdEg7y54nx0YMgDeHm8w4M9YWsEKSssEIGAVJZwf55QyXhQqulwuxJm2S\/68xB7omco4vw\nxRiOXXv6ea8A+vGrm\/jz17eMOlWSBf9AD8Qe2iccNjpJ7vN5hnPxQnYIklda4ZizTGyKsHlDJWmg\n1sQ56D19JA662Rvd47s2uMcX+\/azn+AY6K\/f3sbfvrtjVFrKYeEgQyYnxoj17Dp\/3+Ai3\/jAXOzJ\n3oZEcjCFwnyQwrlv7qghktT59gP6zRiJhJAVg8LLdz\/QPQ4rO8dwf39yF\/\/8vg\/\/+uG+OHadrhKQ\nhw\/vx8miTLF+oIt8voFhHgiYsNwKR5ZZDg8oeqerHAFvmyE3MuC5gE8eXTO6x4794+k9\/PvHB\/jP\nXx6KY3rakX4HN3uKfOT1\/L3hAEWYKQ97crYJuPhngHsJyFQSnjiOrbLE5plmyIv6ZYAqVQR27gpG\nBtVCBgzY7IVSTRZON5cNC8h5aAoY72QFlZMlPllqiT3vjxoiCY9CaZSoQfbmUA8ADEtvxRF1G6pb\nzqJW1z1siAO3eBnrYMCz1\/w5r+P1z3PQGGICVDlaCh0mwN0EZCoJj0IMGDLLHPnRAcZdrHCpGaTn\nbZJvHl5BZ1sV1CeSRXgvdjXgxiW9MQevN7Wjt14\/pNT8lIMyxC2zolnAEqFzRg2RpJJG9FQC3P6u\nOQoIkO3ncmAK+L\/KTGpyrLEOJiXEGN2r3VGKtKnHUL39JDLtM3G2sN5YZhgwYbmMwiwTw0ronJeG\nSMLDIwPueO8lFD4DvHS+fQigoVAzJOeXaaHmnctwXAN19aeMJabmo1Oo+fCUcE+fUImKkBJ0a+v7\nCzXVQYZLXN4PuIuATCXh4ZEBd85mQH9xd5oq\/SC42dsbxMXYEUNNZFADLItdM\/Rk7tWiJ1PuFa7M\nE+4ZaqDuaAVSp6SJVsed5KgjAa6Q4xABMoOpJDw8MiDH+1jQIpEbJZWtgwCXhjYahwWGYAAGZbGr\nfCzKPybgoqP2iGnH0IcZrmBFrnH3tqjK6RkkV0w057OCEecoRRIBxhDgxwRkKglPtsepF+6lHRPr\n\/Kq4s+LyFhPABpHk3LLiqbQ01hYLhwYq\/mikgPfx24ijcRHGslK1XYPKbSXGFlcdqkGeYw5N2LXo\nPh6MIwSYvEqBmCUESGlmKolhsuXJgXufJtwVPR11uNzZiK72ZhSWN6O6QUcXaDeWIFVcuICJjNwt\ngFiG11wDL5ypM07X+ctPiLxjOI5O0xEtCtflQp9TjnOZQTi8TIp4cjCaAHkfmEqioUfBnLUyygVL\nAclNO\/+jhThdmYPutmpcaK\/DxTMNuHy2AVe7m0RyH09XwdPbDQcOfIx1bs4C1stngzjyTfQ\/m\/Q\/\nKlQEl0DtdELs2o68Kmg81ag+UILOiiqcy9hK9Y8AaZNELxmNj94zHyJJibs1sgkwey1NtzTZhvOz\nwIL+J6vE9ROQ4T8LRftdoD3kg+YTEWgtisP59hr0nGFwcprq3qUuvoFGXDn3TGebSM30WRNKNxcg\nhTZF+Y5CFHvkoWhTLtrLKtB9uhptMcsRu5RGfrpuFD2CfuhgPkSSYgLMoomWp1q1i1I8beXTwzQr\nk\/6XtEJqhGbxY+JhSujE1XY4Hkjwu1egLNYH9emh0BXEoaOuGF26SqFOXYVQW5UWTSc0qEsrRnOx\nBqcbS6GvUqMycCLtXiukOv8MYIGb9VN+JshaJ8fpxAloVr2C+vBxOLZaIcYgDeXoSZLW01Yc81z7\n4Rlc5Wg1CJ7Bj1DL4gklK9AeuVtmoeyQh1HamE0oDndHwUF31OxbRBGj5+IlNG7RJomkG+dmYSpJ\nvqtSxyN378mpeHptJp70OqEqZgL20rMC98ec9Uo6gUyEP2udUvTNNBow1W6Uu\/S+lMDVBF2ykTab\ni4LWKwR89KIxg+D7b8BSfH6KolREuR+9RErOSSnECkQQ4DYCMpVE7aJQqf2s8bjzLTxsexN9zdNw\no+EDtKv\/iLAFY5BNEEnkZBqF4fhaBdUtKyRT\/8xYo6QRiV6vlIs+muqsQOoqvtAYWi9DFoN42lEE\nbKHxIPdJ+RusaUNIcXQ55fpCS0QSXORiK+RQakUssqB5wGyQgu3N+ijECge1vzVu10zB9bLJuKp5\nDfc7NqCzaBLC5o8mqP5wMmDmMyhuT+mrlYhebCm6wCeU6FxsUwiSd2Qs7cyIhWPEBogn93MCrJG\/\nhXLdT0GOWSHOSYEDCywJilKExDceToDBDDVQ9mZa8fvM8bWysPakV9Cd\/SouF8+GLvVNHKQhdt+8\n0eLLKeRSyiq5gGIYbk9pzkpEkVvc7LkbHKVjEjmYtFKBRFp\/mNY1JUwQacPqrV6C3orXoPK0puIs\nx\/75lgIufKEVimijHqCnuq32ZqYKMv4El+0qC6sMG9tXGTOJWp4N\/GeOFuFk1xiOGzoDHqHCykCG\ncDKY6plrBrgEcpP\/f6dxGr48Ox2P2v+EJ7c+xN3mKdCrJxGMlJrCGAF3kFTla4eQd81oaB45SIHv\n\/G7wj5olzuYjYxZbOu6aa6lKXqnQcTgZivPM4BrDxS3rb08MGEfhZqAoCjcfuSvEL5eLPLvfMg13\n66fiVtUU9Okd0VuzBLUUqX3zpSLE7CKvraCpPuCdkSYakf1\/\/Syc7qxwoKEy7KiTVJuyUvGUe+cn\nBMjh5ByMc5IKsHAq7AYwFeUY51ln5kRcKZ6Ei+qJeNDujZakaTi0QYo9zwD3zB0DLQ3Mx6nE+b89\nwii\/GSP6fKZJRv6q37EjFpvZJK6UBtHu1h5xtOrjTcGusZuHl8oEGIvzLG6NDPrE8ejMmIzrja4E\n+Ap8HEZTdbAiWSJ9jQLNW\/6Aj+eYw5fAhAjO963fv\/6b\/fDeHGhnU+1r60h1UUXQulxXa6prShoC\n5CLHoqhT5FBOpwTYIHCeJYLfpWLuJEcJ1UKGi6Ie7D1jBLwIzHv6iKBf7dwv+WvZYuvQtHlsUJm3\nrVbjYdPHhZlDWerFNdEGhe5U8JfTQ9Jc84te019Qec540f155\/ovY6GWkJi4yz0AAAAASUVORK5C\nYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_blue_03-1334256480.swf",
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

log.info("musicblock_d_blue_03.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
