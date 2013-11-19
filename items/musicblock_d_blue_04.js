//#include include/takeable.js

var label = "Musicblock DB-4";
var version = "1347492224";
var name_single = "Musicblock DB-4";
var name_plural = "Musicblock DB-4";
var article = "a";
var description = "Feet everywhere will tap despite themselves when they hear this.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 600;
var input_for = [];
var parent_classes = ["musicblock_d_blue_04", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_db",	// defined by takeable (overridden by musicblock_d_blue_04)
	"music_duration"	: "12000"	// defined by musicblock_base (overridden by musicblock_d_blue_04)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANX0lEQVR42q2YeVBUVxbG+8+pmkQl\notAbi6NJdIzRmIkmYojG3Si44AaIsi8qosYoRlFAVgEVZBEEZIdWmh1ZmraxERVFRYl70GjMOjqZ\npaZqqqa+Oec2rwONpjKpUPXVBfr269\/7zrnnnNcymcVP3Byr4c1BY517901w6Q2fEHFr55sRN7a\/\nru0hXQweE9FJ6gh0EDpHMviT\/BxC2\/wcnCU1+6mcdT5ye9nv\/fNd\/GSv+5GT8ChqEm7uGo\/OLWNx\ngdSz7XVc65chwAEdQY4wBjqinWQIcMRZfwe0kXR+DmglNfvao8nHHo2kBm971G+0Qy2peoNdX9UG\ntb7SS6U\/7anSnyJpPFUpRWuVXjnLf+GG2LWHB9+++iXB9ewej\/NhY9Ea5IAGPztUbVShffMYIf5b\nu0GJ5kACCLDHaS8l2gi2xluNRvGaCi10A9W01m5U44yfPSrXq1DvzXBqVHmpGRJaWivXq3GapPFU\no8JDhTJSqbtKn7zE2nkI4Lfx72i\/jpsCA0EwGENZAho2OaLOVy2gzhDcGX97aNYr0RrsiCpvgqC9\n5Z4KNAU6oNRDgUqCbCRXS9zldB17VBBoJcHxqiGwcneVGbB0nRJ5qxXIXilH3KJRiFlorWXTBNwP\nCVOcn8ROJgCTQ5aAtT5qAXeWxL8LQIJrJDFYC+2rWK9AI0EzTBM5WOquwCkvFRpoT\/E6Od2YA8o8\nCYjCXEprNaVAGcGZYF6s2AXWESb3Et7J69w2ToSMgdrCnXA2LQSdWVtgzNiMjswt6MrZSgpDR9ZW\ntGeEojM7DBdIhqN+aNu\/AHW758BwYKFY9fR3za6P0RA+B7qI+Shap0AtA7JzFOYSTyWqfPjmCJ7C\nGkswBxcMVfR86+fCRXKvj8FY++dbo7ogBTcu6dB7uQ23us\/idrcBd66dw93rRtzr6cD9Gx14cLMD\nX\/aeHyL+P7\/O+3j\/navt4v1fXNHjUn0uWpO9Ueo9TsBVkgoptClLRyOagV6gqAUjvWT3978l4BI+\nGQ3fWY6D4PgD+IMkqL4vOvHw1gU8un3xheLXeI8Ey6B8c3wdvh5ft7u9Gi3RrhRuexSsVSBnlS2F\nmiDnjxqiqHnWWlnvngkC0O+9YdjpNv1nOLqw5Bh\/oAT2+G4Xnty7LPT1\/Z\/Ff\/NrX925ZIbl9\/H7\nJTclyOvGGjTtmomTBJjtZotMOhxRFD1LRc4f2Se7uWe8OJ3rpryCXaunm51jOMm1gWBPH1zB0y+7\n8U3fVbNaGytw5PBBtDSUobm+TOxj0BdBcrhvdunQXXsMhe5KHCfAnFVKgrF+oWSXto8TJcHjnVcR\nvuZ9c1gt4dglCey7h9fx\/aMes1KPxMJpthMCgjaKlffxfn4fv38gpJSTnEpNe+cJ906sVlLOWePA\nvKGSXaATXEPlw2vqq9i79gMRWr7YQDh2bSDYj1\/dxF8f30RFSTYCg70RH7fPvDLkt33XXggp5aQU\n6otUHTJWyMlBBZ3clwByiammTrDx3WGIWDfDHFoOj+ScBPfDoxsC7NmTm\/jb0y+QnhYvHAsK8RYr\nQ\/LK+wZCSuHm6w4M9ZXcMKQvt0U2AVJZwf65QyXjQqulwuxDh2S\/x4xB7omcow\/hD5Pgnn\/di5++\nuYW\/f3cHlZpcBG3ywaHEAwTpg8SECAHJ+9hpAUnu83Ve5OKVvDAcW2GLLDeFOBQRc4dK1kytiXPQ\nb9pwRHo6md3ju5bck8Iqwf3j+7v414\/3kJVxSDgWvMm330kfsfI+3s+u8\/slF\/nGB+Zid942pJKD\n6RTmSArnvjkjh0h2JsAEGDh9OI6GLR8UXr77ge5xWNm584ZaARIZtRshm\/2QnByF4M2+Zid5n6WL\nfL2BYR4IeHSZLZKW2rwYUPRODyWC3x+BgoPBLwXkvJPcu0EJHkJAn+0OFaAhW\/wGOcn7eL85Fy0A\nRZgpD7vztwm4I\/2AewnIUjKeOLJW2mDTjBEojPl1gJ3tdQKk63wj\/vvPx6itKhTASYciRU6+DJDz\n0BLwiKstUlxtcGiJDT7\/eOQQyXgUyqREDXWyQtEAwIjjZ5FU1I76toto1HcNCnHPZZ0Iae\/Vs\/jP\nTw9xPCup30FTDkohfpmD5hATYIqLjVAiAe4hIEvJeBRiwLCZViiODTafYpV7wyBx0re3VpoOQz8I\nO\/nvZw9QdSpfwEk5yIdEysFbrUb0NhmGlJqfc1CB5KW2NAvYIHz2yCGS1dKInkGA2z+0QgkBsv1c\nDiwB2Y0uY6MoI1xOGOTapVYR8oz0xEGneKB7jTsrkTklC\/XbTyHHKQcXS5vMZYYBjy5TUJgVYlgJ\nn\/3aEMl4eGTAnR+9htJ+wGuXjUMAuWTom04LgO07QkRxNoH+vCbEmzoKw0klpuHT02jYcVq4Zzha\ni5qwCnRpm0yFmuogw6UuMwHuJiBLyXh4ZMBdsxgwSNydps4wCG7W9mbxYZ2GOtHKpNbGoAM7iLSa\nezLlXumKQuGeVAP1h2uQMTlTtDruJIddCHC5EvEEyAyWkvHwyIAc76zQhSI3KmrPDgJcEt7y0mGB\n3SorzhJQsbF7xRoTswf+gRvEwWC4kuUF5tPbllJNzyAFYqK5nLsVyS5ypBFgHAF+RkCWkvFke4J6\n4V46MQlub4o7K69uswBsFkn+snGLRy12zD9og1il2ZDLSt12DWq3VZhbXH24BoUu+TRhN6LrxFYk\nEeCxlSrELSZASjNLyaTJlicH7n2aKA90d5zB9c4WXDDqUFqtQ32znj7AOKhGDhxYiwvShWMHo\/fA\nL9DLfGI5rMXLToq8YziOTmuSFqVrC2DIr8alnFAkLpXjCDkYS4B8Diwl09CjYP4aBeWCjYDkpl38\n6QKcq81HV3s9rhjP4Or5Zly\/2IwbXa0iuW9f5ecUA+720NR9w4hDCfuFc77+68VqejYxPSrUbK1A\nketJcWo7Cuug8SlC\/YEKdNbU4VL2Fqp\/BEiHJHbxKHz6kdUQySq87JBHgHlraLqlyTaKnwXmm56s\nUteNR3bQTJTtd4c23h+6k9E4W5aMy8YGdJ9ncHL6QjN0NFFrSrNRmJeKWMq\/noutJB291orKTSVI\np0NRvbMU5d6FKNtYAGNVDbrO1aM9bhkSltDIT58bQ4+gO5ythkhWToC5NNHyVFvkrhZPW8X0MM3K\nof+lLZeboVn8mJhICZ26yhEnQgh+z3JUJfij6Xg49CXJ6DhTjgv6WqFOfY1Qe50WrSc1OJNZDl25\nBudaKmGoK0JtyAQ6vbbIcPsFwBJPu+f8TJC7VolzqeOhS3kDTVFjkbVKJcYgDeXoKZLWx0GshR4m\neAZPcbEdBM\/gSdSyeELJDXFCweaZqIr3NksbtxHlUV4oifRCw76FFDF6Ll5M4xYdkoN049wsLCUr\n9lDreeTuPTUFz2\/OwLNeV9TFjcdeelbg\/pi\/Tk0XUIjw565Vi76ZSQNmkSflLv1dSeBFBF2xgQ6b\nu4r2qwR87MLRg+BNN2AjXj9NUSqj3I9dLCfn5BRiFaIJcBsBWUpW5K5KKQq0w9PO9\/C4\/V306abi\ndvMnMBb9GRHzRyOPINLIyUwKw4k1KqpbtjhG\/TN7tZpGJPp9hVL00Qw3FTJW8geNpv0K5DKIjyNF\nwAEab3KfVLzejg6EHIeXUa4vsMFBgju4yBb5lFrRC61pHhgxSFudRvRRiFXORUF2uNcwGbeqJuGG\n5i087FiPzrKJiJg3iqBM4WTAnH4obk\/HV6kRu8hGdIFDlOhcbNMJkk9kAp3M6AWjxQE4Qu7nB9uh\neDPleqCKHLNFsqsKB+bbEBSlCIlvPIoAtzLUQDmN0IrvZ06sUUQY095AV96buF4+C\/qMdxFJQ+y+\nuaPEm9PJpfSVSgHFMNyeMt3UiCG3uNlzNzhMaxo5mLZChVTan0j7Wo+OF2nD6q1fjN6at5DiY0fF\nWYn982wEXNQCW5TRQT1AT3VbnEZYKtT8FVyehyKiNmJMX23cRGp59giaMUqEk11jOG7oDJhEhZWB\npHAyWEq\/axLcUXKT\/3+\/ZSq+vTgNT4x\/wbO7O\/BANxmGookEI6emMFrARZLqAhwR9uEIGpqHD1LI\nB38Y\/KVmhZvV8LhFNi6759ikHFuh0nM4GYrzTHKN4ZKXmtoTAyZTuBkohsLNK3eFI8uUIs8etk3F\ng6YpuFs3GX0GF\/Q2LEYjRWrfPLkIMbvIe2toqg\/+YLiFhuX9qq+Fj7upnGmojDjsKtemr1A95955\niAA5nJyDya5yARZFhV0CS6Ec4zzrzJmAnvKJuFo0AY+MfmhLm4r49XJ83g\/4+ZzR0NLAfIJKXND7\nw8wKnD6sz3+qbPhv+h47etEI+9QV8lA63dokF9s+PhTsGruZuEQhwFicZ8mrFTCkjkNn9iTcavEg\nwDfg7zyKqoMtyQbHV6ug2\/wnfDbbCgEEJkRwAe\/98e3f7Yt3XYijfX2AgwvVxRSC1hd42FFdU9MQ\noBQ5FkOdIp9yOj3YHiFzbbD1QyrmrkpUUC1kuBjqwX7Th8GXwPymDQv9zc79Pz9tmx2cWzeNCa3y\nc9BqvO37uDBzKCt9uSbao9SLCv4yekiaY3XVd9orKT7TX\/V62bX+B8TIZ4Ur3UcPAAAAAElFTkSu\nQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_blue_04-1334256513.swf",
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

log.info("musicblock_d_blue_04.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
