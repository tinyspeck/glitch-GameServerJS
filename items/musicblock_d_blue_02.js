//#include include/takeable.js

var label = "Musicblock DB-2";
var version = "1347492224";
var name_single = "Musicblock DB-2";
var name_plural = "Musicblock DB-2";
var article = "a";
var description = "Like the songs that giants hum to themselves when they're feeling blue. Unless they ARE blue, in which case they don't sing this way at all.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 400;
var input_for = [];
var parent_classes = ["musicblock_d_blue_02", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_db",	// defined by takeable (overridden by musicblock_d_blue_02)
	"music_duration"	: "9000"	// defined by musicblock_base (overridden by musicblock_d_blue_02)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANYUlEQVR42q2YeVBUVxbG+8+pmkQl\notAbi6OT6BijMRNNxBCNcY0CKm6AKMjqAmhiFBdQEBCEVkEWWcVmbaXZN4GmEURFccVd0WiM2TTJ\nZPaa+uaci6+FBlMzqVD11aO7b7\/3e98595zzWiYz+4uZYTG4PmCkY9fOMU5doWPCrm9+I+zKpj\/q\nL5POBI4Iaye1+dsJnSQZfUk+dkFNPnaOkup9VI6N3nJb2W\/99\/Xe8Z53do\/Dg4hxuLplNNo3jMRp\n0uWNf8TF5zL62aEtwB6t\/vZoIRn97NHsa4cmUqOPHRpI9WtsUedtixpStZctqlbboIJUtsqmu3SV\n2lDiqTIc91AZjpF0HiqNdrnSM2PhL9wQu3Z\/z1sX7hHc5a2jcSpkJBoC7FDtY4PS1Sq0rB8hxK\/1\nq5So9ycAP1sc91SiiWDLvdSoEZ+pcIJuoIyOFavVqPWxRclKFaq8GE6NUk81Q0JPx5KVahwn6TzU\nKHZXoZBU4KYyJMy3dOwH+GTv2\/ovYybASBAMxlDmgMZ19qhcoxZQtQRX62sL3UolGgLtUepFELS2\nyEOBOn87FLgrUEKQNeRqvpuczmOLYgItITg+6gisyE1lAixYoUT2UgXSF8sRM3cYouZY6tk0Afdt\n7ATHR9HjCaDHIXPACm+1gGsm8f8CkOBqSAx2gtYVr1SghqAZpo4cLHBT4JinCtW0Jm+FnG7MDoUe\nBERhLqBjGaVAIcH1wAys6NmWYT3uxb6d3b5xlAgZAzWFOqA5aS3a0zagNWU92lI3oCMjmBSCtrRg\ntKQEoT09BKdJxoM+aAqfjcqtM2DcNUccDfS6fMtHqA6dgcawWdCuUKCCAdk5CnO+hxKl3nxzBE9h\njSaYPbP7K3KW5TPhIrnXzWCs8FmWKMvV4MrZRnSda8L1zmbc6DTi5sWTuHWpFbcvt+HOlTbcvdqG\ne12n+onf5895Ha+\/eaFFfP\/aeQPOVmWhIcELBV6jBFwJ6SiFVrNgOCIZaABFzB7qKbsT\/qaAi\/1k\nONZMs+8DxxfgC0lQ3dfacf\/6aTy4cWZA8We8RoJlUL45Pg+fj8\/b2VKGE5HOFG5b5C5XIGOJNYWa\nIGcN66eImZZ6Wde2MQLQ591B2Ow6+QUcnVhyjC8ogT281YFHt88JfXnnhfg1f\/bFzbMmWP4ef19y\nU4K81FqOui1TcYQA012tkUqbI4KiZ67ds4Z2y65uGy1254oJr2DL0skm5xhOcq032OO75\/H4Xica\naopxqaMBX3VfEOL3+DMJlkEHguRwX+1oRGfFIRx1U+IwAWYsURKM5YCSnd00SpQE97dfReiy90xh\nNYfjCzMEw3x9\/xIcpjvAL2B1n2N01HZEkXgdr+fv8fd7Q0o5yalUt2OmcC9zqZJyzhK7ZvaX7DTt\n4HIqH54TX8WO5e+L0PLJesOxMxJYTPQO7I3ZCf9ALyQdjDGJX7MY9kn3xQEhpZyUQn2GqkPKIjk5\nqKCd+xJALjFl1AlWvzMIYSummELL4ZGck+C+fXDFBMKOJSftxY9fXRf64fE1Ac5KPBCNyxRGCVIK\nN5+3d6jPZ4UgeaE10gmQygrCP+4vGRdaPRVmb9ok4e5T+rgnco4uwo4w3PcPr+LZl10CqNVQhjvk\nyl++uSX009c3EbD2BXxT3bEeJ8l9Ps9ALp7PDsGhRdZIc1WITRH2cX\/J6qk1cQ76TBqM3R4OJvf4\nriX3vnlwGd998QKOgf763W387fs7Jv387W3ExYUjLjYMhxJjcI1yjV3n70su8o33zsXO7I1IJAeT\nKcy7KZw7ZwztJ1mtXw+g\/+TBOBiysE94+e57u8dhZKcY7u9P7+KfP3TjXz\/eF0d+vS9ul4BkB5vr\nS8SNSS7y+XqHuTfgQRdrxC+wGhhQ9E53JQLfG4LcPYEvBXz66KrJPXbsH8\/u4d8\/PcB\/fn4ojvw6\ncN0aBKzzFqE+11YjvjcQoAgz5WFnzkYBd+A54A4CMpeMJ460xVZYN2UIjkb9OsCHFMIzJ6sQv2+3\ncJEdNJ4o6QfIeWgOeMDZGhpnK+ybb4XtHw3tJxmPQqmUqEEOFtD2Agw73Ix4bQuqms6gxtDxiyE+\nnBYvoAKFe95iHa9\/mYOmEBOgxslKKI4AtxGQuWQ8CjFgyFQL5EUHmnaxyq26jwbaJPfogmmp+5CW\nsk\/AiRyMDRfrGJBz8HpDK7rqjP1KzYscVCBhgTXNAlYInT60n2QVNKKnEOCmDyyQT4BsP5cDc0Dz\nMsNOtjWXC+c47\/j405MbJjjJvZrNJUidkIaqTceQ4ZCBMwV1pjLDgAddFBRmhRhWQqe\/1k8yHh4Z\ncPOHr6HgOeDFc639AKVCzRfnfOSNwCWFj0eyEkXR7g0nlZjqz46j+tPjwj3jwQqUhxSjQ1\/XU6ip\nDjJcoksP4FYCMpeMh0cG3DKNAQPE3ekqjX3gpm2qFxdjR6SayI5JRZk3BIPx+73hOPcKFh0V7kk1\n0LC\/HCnjU0Wr406y34kAFyqxlwCZwVwyHh4ZkOOdFjRH5EZxRXMfwPmhJ0zDgm\/AKtFvWYV5aQKI\noVkMZt6HGS5\/Ya5p9zZpyugZJFdMNOeygpHgJEcSAcYQ4OcEZC4ZT7aZ1At30I6JdX1D3FlRWZMZ\nYL1Icm5ZUXu20cSyTYDma1NM41bvkUuaDbmsVG7SoWJjsanFVYXqcNQphybsGnRkBiOeAA8tViFm\nHgFSmplLJk22PDlw79NFuKOzrRaX2k\/gdGsjCsoaUVVvoAv0jGA+fp7w8fcUoQ3eGABf\/1VIT43H\nfk0kWpvKcLKx1LRjOax5LkdE3jEcR6chXo+C5bkw5pThbEYQ4hbIcYAcjCZA3gfmkunoUTBnmYJy\nwUpActPO+2w2TlbkoKOlCudba3HhVD0unanHFRpQMwgm87AG3j4e+HzLBgG6xnel6Sj9X1mSK3Ku\nPLgYWucjYte2Ha2EzluLql3FaC+vxNn0DVT\/CJA2SfS8YfjsQ4t+khV72iCbALOX0XRLk20EPwvM\n6nmySlwxGukBU1EY7gb9Xl80HolEc2ECzrVWo\/MUg5PTp+vRSNO1riCd6mGcUPSe7TDUHqPPGlCy\nLh\/JtCnKNhegyOsoClfnorW0HB3UeVpiXBA7n0Z+um4UPYJ+6mjRT7IiAsyiiZanWq2bWjxt5dHD\nNCuD3ktaKDdBs\/gxMY4SOnGJPTLXEvy2hSiN9UXd4VAY8hPQVluE04YKoXZDuVBLpR4NR3SoTS1C\nY5EOJ2nXGyu1qFg7hnavNVJcfwEw38PmGT8TZC1X4mTiaDRqXkddxEikLVGJMUhHOXqMpPe2E8ej\n7j3wDK5xsu4Dz+Dx1LJ4Qsla64Dc9VNRutfLJH3MahRFeCJ\/tyeqd86hiNFz8Twat2iT7KEb52Zh\nLlmeu9rAI3fXsQl4dnUKnnY5ozJmNHbQswL3x5wVajqBQoQ\/a7la9M1UGjC1HpS79LqEwLUEXbyK\nNpubitarBHz0nOF94HtuwEp8fpyiVEi5Hz1PTs7JKcQqRBLgRgIyl0zrptJo\/W3wuP1dPGx5B92N\nE3Gj\/hO0av+EsFnDkU0QSeRkKoUhc5mK6pY1DlH\/TF+qphGJ\/l+kFH00xVWFlMV8oeG0XoEsBvG2\npwjYQedF7pPyVtrQhpBjvwvl+mwr7CG4PXOtkUOpFTnHkuaBIX0U7DCkm0KsctQG2OB29XhcLx2H\nK7o3cb9tJdoLxyJs5jCC6gknA2Y8h+L2dHiJGtFzrUQX2EeJzsU2mSB5R8bSzoycPVxsgAPkfk6g\nDfLWU677q8gxayQ4q7BrlhVBUYqQ+MYjCDCYoXrLYYhe\/D6TuUwR1pr0Ojqy38ClomkwpLyD3TTE\n7vx4mPhyMrmUvFgpoBiG21OqqxpR5BY3e+4G++mYRA4mLVIhkdbH0bqGg6NF2rC6quahq\/xNaLxt\nqDgrET7TSsBFzLZGIW3UXfRUt8FhiLmCTD\/BZbsrwirCRnRXxIyllmeLgCnDRDjZNYbjhs6A8VRY\nGUgKJ4NpnrsmwR0kN\/n9Oycm4smZSXjU+mc8vfUp7jaOh1E7lmDk1BSGC7jdpEo\/e4R8MISG5sF9\ntPb93\/X9UbPY1WJwzFwrp60zrDSHFqkMHE6G4jyTXGO4hAU97YkBEyjcDBRF4eYjd4UDLkqRZ\/eb\nJuJu3QTcqhyPbqMTuqrnoYYitXOmXISYXeS15TTVB74\/2EyDsv+nn4UPu6ocaagM2+8s1ycvUj3j\n3rmPADmcnIMJznIBFkGFXQLTUI5xnrVnjMHlorG4oB2DB60+aEqaiL0r5dj+HHD7jOHQ08CcSSUu\n4L1BJvlPHtTtO1E2+Ff9jh05d4ht4iJ5EO1ufbyTdTdvCnaN3YybrxBgLM6zhKUKGBNHoT19HK6f\ncCfA1+HrOIyqgzXJCoeXqtC4\/g\/4fLoF\/AhMiOD83v39W7\/ZD++Na+1tq\/zsnKguagjakOtuQ3VN\nTUOAUuRYFHWKHMrp5EBbrP3YCsEfUDF3VqKYaiHDRVEP9pk8CGsIzGfSoKBf7dz\/89e03s6xYd2I\noFIfO73Oy7abCzOHsmQN10RbFHhSwXehh6QZFhfWTHpF4z35Vc+Xneu\/0RKQKCj1r3EAAAAASUVO\nRK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_blue_02-1334256440.swf",
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

log.info("musicblock_d_blue_02.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
