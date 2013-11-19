//#include include/takeable.js

var label = "Musicblock DB-5";
var version = "1347492224";
var name_single = "Musicblock DB-5";
var name_plural = "Musicblock DB-5";
var article = "a";
var description = "If you could amplify butterfly song, this is roughly what it would sound like.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 700;
var input_for = [];
var parent_classes = ["musicblock_d_blue_05", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_db",	// defined by takeable (overridden by musicblock_d_blue_05)
	"music_duration"	: "11000"	// defined by musicblock_base (overridden by musicblock_d_blue_05)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANs0lEQVR42q2Yd1RUdxbH5889ZxOV\niMI0SjbZRDdFYzaaSEKKsUbBgg0QpRcR0cQoRlFBQBRGBOlNGOooQ+\/DMDCIgGJFE0vQmN5Mstl+\n9nz33h++CQwmZzcnnPM9vxnmzXuf9733d+99I5NZ\/SXMs5nYGvKY69De6W5DUdOjr+14Mvry9j\/q\nL5H6Qh+N7iX1BDsJdZNMgaQAp4iOACdXSa0BKleDn9xR9lv\/fXFohs\/NA8\/gTswzuLJzGnq3PIYz\npEvb\/ogL92UKckJPiDPMwc7oIpmCnNEZ6IQOkiHACe2kVn9HtPg5oonU6OuIhk0OqCPVbHQYrt6o\nNlb5qIynvFXGkySdt0qjXaf0yV3xCzfErt0++Oz5Dwnu0q5pOB35GNpDnNAY4IDqTSp0hT8qxO\/1\nG5VoDSaAIEec8lGig2BrfdVoEp+p0EY3UENr3SY1mgMcUbVBhQZfhlOj2kfNkNDTWrVBjVMknbca\nlV4qlJPKPFXG5KW2ruMAPz\/0nP6ThJkwEQSDMZQ1oGmzM+r91QKqmeCaAx2h26BEe6gzqn0Jgo6t\n8FagJdgJZV4KVBFkE7la6imn8ziikkCrCI5XHYFVeKosgGXrlShYo0DOKjkSFk9B3CJbPZsm4L5K\nnOn6cfwMAhhxyBqwzk8t4DpJ\/FoAElwTicHa6LjKDQo0ETTDtJCDZZ4KnPRRoZGOKVkvpxtzQrk3\nAVGYy2itoRQoJ7gRmAcrfqFt9Ih7ic8V9G57XISMgTqiXNCZFoberC0wZ4SjJ3MLBnK3kiLRk7UV\nXRkR6M2JxBmS6VgAOvYtRP2ueTDtXyRWI72v3fkGGqPmwRC9ANr1CtQxIDtHYS71VqLaj2+O4Cms\n8QRzcOF4xS6wvSdcJPeGGYy1b4Etaoo0uNxvwNDZDlwb7MT7gyZ8cKEb1y+aceNSD25e7sGtKz34\ncOj0OPH\/+XM+jo\/\/4HyX+P7Vc0b0N+SjPdkXZb6PC7gqUjGFVrNsKmIZ6AGKWTjZR3Zz39MCLvGt\nqfB\/zXkMHF+ALyRBDV\/txe1rZ3Dn\/b4Hij\/jYyRYBuWb4\/Pw+fi8g101aIt1p3A7omidArmr7SnU\nBLlgyjjFzLfVy4Z2TxeAAS9MwA6POT\/B0Yklx\/iCEtjd6wP4+MZZoU9u\/iR+z5999EG\/BZa\/x9+X\n3JQgL5pr0bLzZZwgwBwPe2TS5oih6FnrwILJw7Iru6eJ3bl+5kPYuWaOxTmGk1yTwFrry+Hyugty\nspIRGLIRudnJSDl6EKXaDLGeNtagtaEc5o4aNNeVPhCSw31lwIDBuuMo9lQimwBzVysJxvaBkvVv\nf1yUBK\/nHkbU2hctYbWGY5dOd9YKsLxsjQANCtn0wJWP4ZW\/x98fDSnlJKdSy575wr28NUrKOVvs\nnz9esjO0g2upfPjMehh71r0kQssnGw336a1z+Gz4PAzNOnHhgtwUBIf6YsDchG\/uXsFVumhna5V4\n39FyEmXaTOEo39RoSCknpVD3UXXIWCknBxW0c38GkEtMDXWCTc9PQPT6uZbQcngk5xjui9sX0d\/d\nKMAK81IEaLehGt9\/dk3ou0+v4tuPrwjgr+5cxufDF\/Dph4Pi+5yXfD4+7+hQn8uPRPoKe+QQIJUV\n7HtzvGRcaPVUmP1ok+zzmjvGPU58vghfjC\/KLjHYifxUhIT54UJ\/O\/7y5XWhH774QIDe+2RIQH55\n59IIJLnP53mQi+cKInF8pT2yPBRiU0S\/OV6yVmpNnIMBsyfigLeLxT2+a8k9vtjXH13BudPNBOaL\nosI0AdrbVY+\/fXNT6MevboyB5OPZdf6+5CLf+OhcHCzYhlRyMJ3CfIDCuXfe5HGSNQeNAAbPmYhj\nkSvGhJfvXnKPXek26AWY9sRxhIb7Izk5BmHhASgtzkBW5hHodQXIOJ4owm3tIp9vdJhHAx5bbo+k\nZXYPBhS900uJ0Bcnoehg6M8Ccn6dP9OCkM1+qD5ZSGD+eHdXhAAO2xIg1tDN\/mJlF\/l4Sy5aAYow\nUx4OFm4TcCn3AfcQkLVkPHFkrbLD5rmTUBz3y4B8Yc43Duk\/7n2If\/9wB\/\/58S7uUgj7uhuQdOSA\nuAG+EVNb1ThAzkNrwBR3e2jc7XBkqR3ee2PyOMl4FMqkRI1wsYF2FGB0dieStF1o6OhDk3FAhIxD\nx3n2169v4O\/f3sI\/vxvGv76\/LVZ+H0pw7CDnKa8\/56AlxASocbMTOkyAuwnIWjIehRgw8mUblMSH\nWnaxyrNxjDjpOfklFxmSnWQwXvn9kcP7xe5OPLRXlCPOwWvtZgy1mMaVmp9yUIHkZfY0C9gh6vXJ\n4ySroxE9gwC3v2KDUgJk+7kcWANKG0WCZCelEiOVGYZj5xiOV3avaUcVMmdmoWH7SeS65KKvrMVS\nZhjw2HIFhVkhhpWo1x8ZJxkPjwy449VHUHYf8MJZ8zhALhkSJOcjh1sq0lKhlpyrKMnGsZQ4UWIa\n3zmFxrdPCfdMx+pQG1mJAX3LSKGmOshwqctHAHcRkLVkPDwy4M7XGDBE3J2u3jQG7rXtreJit8hZ\nbmV33u8XoBKs1EEk56SezLlXtrJYuCfVQOPRWmTMyBStjjvJUTcCXKHEIQJkBmvJeHhkQI53VsQi\nkRuVdZ1jAJdGtYli29ZUIS7MPZnzi8WuSq\/j4\/cIuLi43QgM3ig2BsOVriiy7N4OTQ09gxSJieZs\n\/lYku8mRRoAJBPguAVlLxpNtHvXCPbRjEj2eFHdWUdNhBdgqkvx8bytSNLHU4tqEo9aSphiG45XL\nSv12Heq2VVpaXEOUDsVuhTRhN2EgbyuSCPD4KhUSlhAgpZm1ZNJky5MD9z5djBcGe5pxsbcNZ8wG\nlNUY0NBqpAuYLSWopb5MAOzevU3A5GQm4SiBl5xIh4a6SzG1wmSqiRzWkuUnRN4xHEenPUmPsnVF\nMBXWoD83AoeXyZFCDsYTIO8Da8l09ChYuFZBuWAnILlpl7yzEN11hRjoasA5czPOn27Fxb5WXB5o\nF8nNg6tfgDfCIwIFqH\/ghjHryLPJyKNC7dZKaN1PiF3bU1wPnZ8WDfsr0Vtbj\/6cLVT\/CJA2SfyS\nKXjnVZtxklX6OKCAAAvW0nRLk20MPwssGHmySl0\/DTkhL6N8nyf0hwJhOBGLzvJknDU3YvA0g5PT\nZ1phaKqEriwHWRmHEU\/5d6mvnWSgz9pRtbkU6bQpanaUocK3GOWbimCursUAdZ6uhOVIXEojP103\njh5B33a1GSdZBQHm00TLU63WUy2etkroYZqVS\/9LWyG3QLP4MfEwJXTqamfkhRH87hWoTgxES3YU\njKXJ6GmuwBljnVCvsVaoq16P9hM6NGdWwFChQze1QVO9FnVh02n32iPD4xcAS70d7vEzQf46JbpT\np8GgeQItMY8ha7VKjEE6ytGTJL2fk1iLvUbgGVzjZj8GnsGTqGXxhJIf5oKi8JdRfcjXIn3CJlTE\n+KD0gA8a9y6iiNFz8RIat2iTHKQb52ZhLVmJl9rII\/fQyZm4d2Uuvh1yR33CNOyhZwXuj4Xr1XQC\nhQh\/\/jq16JuZNGBqvSl36X0VgWsJunIjbTZPFR2vEvDxi6aOgR+5ATvx+SmKUjnlfvwSOTknpxCr\nEEuA2wjIWjKtp0qjDXbAp70v4G7X8xg2zML7rW\/BrP0TohdMRQFBpJGTmRSGvLUqqlv2OE79M2eN\nmkYker1SKfpohocKGav4QlPpeAXyGcTPmSLgBJ0vuU8q2eBAG0KOo8sp1xfa4SDBHVxsj0JKrdhF\ntjQPTBqjrS6ThinEKldtiANuNM7AtepncFn3NG73bEBv+VOInj+FoEbCyYC596G4PWWvViN+sZ3o\nAkco0bnYphMk78hE2pmxC6eKDZBC7heGOqAknHI9WEWO2SPZXYX9C+wIilKExDceQ4BbGWq0XCbp\nxe8zeWsV0ea0JzBQ8CQuVrwGY8bzOEBD7N43p4gvp5NL6auUAophuD1leqgRR25xs+ducJTWNHIw\nbaUKqXT8YTqu\/dg0kTasoYYlGKp9Gho\/ByrOSuybbyfgYhbao5w26n56qtviMslaEZaf4Aq8FNF1\n0Y8O1yU8RS3PESFzp4hwsmsMxw2dAZOosDKQFE4G09x3TYI7Rm7y\/2+2zcLnfbPxsfnP+Pb627hl\nmAGT9imCkVNTmCrgDpDqg5wR+cokGponjlHYS78b+6NmpYfNxITFdm675tlpjq9UGTmcDMV5JrnG\ncMnLRtoTAyZTuBkojsLNK3eFlOVKkWe3O2bhVstMXK+fgWGTG4Yal6CJIrV3vlyEmF3kY2tpqg99\naaKVJhT8Tz8LZ3uoXGmojD7qLtenr1Td4955hAA5nJyDye5yARZDhV0C01COcZ715k7HpYqncF47\nHXfMAehIm4VDG+R47z7ge\/OmQk8Dcx6VuJAXJ1gUPGfCcOAs2cRf9Tt27OJJjqkr5RG0u\/VJbvbD\nvCnYNXbz8FKFAGNxniWvUcCU+jh6c57BtTYvAnwCga5TqDrYk+yQvUYFQ\/gf8O7rNggiMCGCC3rh\n98\/+Zj+8G8KcHRuCnNyoLmoI2ljk5UB1TU1DgFLkWBx1ikLK6fRQR4S9aYetr1Axd1eikmohw8VR\nDw6YMwH+BBYwe0LEr3bu\/\/nrCHdybd\/8aER1gJNe5+s4zIWZQ1nlzzXREWU+VPCX00PSPJvz\/rMf\n0vjNedjn5871X9ZNc0gNldUIAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_blue_05-1334256552.swf",
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

log.info("musicblock_d_blue_05.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
