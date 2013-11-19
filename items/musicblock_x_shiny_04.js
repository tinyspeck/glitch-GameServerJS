//#include include/takeable.js

var label = "Musicblock XS-4";
var version = "1347492224";
var name_single = "Musicblock XS-4";
var name_plural = "Musicblock XS-4";
var article = "a";
var description = "Rare recording of classic Glitch-hop before it all went mainstream.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 600;
var input_for = [];
var parent_classes = ["musicblock_x_shiny_04", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_xs",	// defined by takeable (overridden by musicblock_x_shiny_04)
	"music_duration"	: "6000"	// defined by musicblock_base (overridden by musicblock_x_shiny_04)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANZElEQVR42q2YeVBUVxbG+8+pmkQh\nItAbDY5ZdIzRmIkmYkiMexJRjCubgOwqolkUgyCLrIIKsgiIIpugLLKvLQRsAQVkVVzQuCcZTSaz\nVE3V1Dfn3LZbaHAqkwpVX126+773fu87595z3pNIDP4iFxlPrPWeatO\/b7ptf8D0oMGv3gjq3fVa\ncQ+pzWdKkIbU6mUp9C2pyYPkbunX6G5po1Otu8KmwU2qkvzef4+jZjnfCJmJO6Ez0bd7GjTbp+Ii\nqWfna+h+piZPS7R6W6HFywrNpCZPK5z3sEQjqcHdEvWk2i0q1LipUEWqdFWhwsUCZaTSzRbDJZuV\n6iJnhfqso0J9hlToqIjP3ih3Trf7HzfErt0Of6vrFsH17JmGC\/5TUe9tiUp3C5S4KNC8bYoQfy7e\nLEetFwF4qnDWWY5Ggj3nqkSV+E2BOrqBUhrLXJSodlehyEmBCleGU6LEWcmQKKaxyEmJs6RCRyUK\nHBTIJ+XZK9Rxn5nYjAF8FPV28f3I2WgiCAZjKEPApq1WKN+iFFDVBFftoUKhkxz1PlYocSUImpvv\nIKPfLMV41lmBKnI1115K51GhgECLCI7HQgI7ba\/QA+ZtkiNzvQxpn0sRuWIyDiw3KWbTBNwP0bNt\n7kXMIgCtQ4aAZW5KAXeexP8zYBXBVZIYrI7mFTjJUEXQDFNDgHn2MhTSPAbL3iSjGyNoRwKiMOfR\nWEopkE9wWpjxFbHMJEjrXvTbmZqdr4qQMVBjgDXOJ\/pCk7odLcnb0JqyHR3pO0j+aE3dgeZkP2jS\n\/HGR1HTEHY3By1C+ZxGa9i8Xo5o+n9v9MSoDFqF+31Kc2ihDGeUlgxVSmHMd5Shx45tTIYfCGkEw\n4cvGKmypyVPhIrk3zGCs4KUmKM2KR297A\/ovNWKw8zyudjbhWve3GLrSgus9rbjR24qbfa241X9h\njPh7\/p3n8fxrXc3i+IHLarRXHEd9nCvyXF5FMcEVkU5RaONXmiKMgcZR6LJJzpIbwW8KuOhPTbHl\nI6tRcHwBvpAOanhAg9uDF3Hnatu44t94jg6WQfnm+Dx8Pj5vZ3Mp6kJXUbhVyCJ309eZU6gJcunk\nMQpdYlIs6d87XQC6vzsBX62d9xyOTqxzjC+oA7s71IF71y8J3b\/xXPyZf\/vuWrselo\/j43Vu6iCv\ntJxD9e4FOLGBFsZac6TQ4gil6BkqZOmkYUnf3mlidW6a\/RJ2r5+nd47hdK6NBHtw8zIe3OrEw+Eu\nveqrCnD4UDjqKvNRW5Ev5jHoeJAc7r6OBnSWHUWWvRypBJe+Tk4wJuNK0r7rVVr+Cji8\/TICNryn\nD6shHLukA3t8+wq+v9OjV8LhCFgvtIant4sYeR7P5+P4+JGQupzkVKoJXCLcY8CwZSbYv2SsJBdp\nBZfSRus852UEbnxfhJZPNhKOXRsJ9uN3ffjr3T4U5KbBy8cVUZH79CNDPhruHhdSl5O6ULfR7pC8\nxpzCLKOV+wJAzTNAl3cmIGjTfH1oOTw653RwP9zpFWBP7vXhpwcDSEqMEo55+7qKkSF55HkjIXXh\n5vOODPXl4\/5IIsBj62S8rSB48VhJeKMtpo3ZjRZJsMP8Ue6JnKOL8MV0cE\/v9+Pnh4P42+NrKCo8\nDu+tboiN2U+QboiJDhKQPI+dFpDkPp9nPBcvZ\/oj0Y4WCTnIiyJo8VhJar0sRQ66z52IEEdrvXt8\n1zr3dGHVwf3y\/RD+8eN1pCbHCsd8tm555qSbGHkez2fX+Xidi3zjI3OxM3MnEgjwqJ1UhHPfoklj\nJOHayYBe8ybiiL\/dqPDy3Y90j8PKzl1oKhMgIaF74LvNHXFxofDZtkXvJM8zdJHPNzLMOsAjq81x\nmHRwpdmLAfMc5PB5zwhZ4T4vBOS807nXSwnuS0Bf7\/EToL7b3Uc5yfN4vj4XDQBFmCkPO09oAeNX\nmQnAQAIylISLfsoaM2ydb4RTB34doKa5XIB0XKjCf\/5+F2UlpwTwwdgQkZMvAuQ8NAQ8tIoAbc0Q\n+5kZvvl40hhJKqiQp9BK8rM2RvYIwIFbvei7M4iBu9fw4E7\/qBD3XGoQIe3vOo9\/\/3wbx1IPPnNQ\nm4O6EL\/IQX2ICZDh4mzNEUOAewnIUBJuhZI\/N4f\/AmPkRPhoi\/1gG3Ke\/IKTP\/1TqPXRPZH0zfVF\n2sXwDISd\/NeTmyg5c0LA6XKQFwkD3iwqxtWMrFFbzVBLHa62qZ8vktUyCq859QJmCFg4aYwk3Arx\nZrnrA2PkEiDbr\/7ulh6OxbDsYkdLldhGeDthkO72ehHy5KSYUatY5x7D9cYm6bcZXsU9yRnoOnAE\nAxfqBODhVTIhblYCFr4yRhJuHhnwqw9fQd4zwPwfn44C1Lp4F+qaswJg1xe+YnPWgj4fo6O0FYXh\ndFvMYNoJDGblCPeuXzqProgEAjyM3qpSsQ8esn0OuIeADCXh5pEBd3\/EgN5iEy178GAMYN3jh9A0\nlYtSpittDDqyguhGfU2m3Btupw15ZxgG8vJxJT4F3XHJGFBXiVLHlSTOVkorWYYoAmQGQ0m4eWRA\njneq33KRGy03BsYA3rh1Zdxmgd3Kz0kVUBERgWI8cGAvPLw261fuUCMB5eahwzsI\/eeK9B3NpeM7\nELdSioQ1ckQS4NcEZChJETWO6eukCKQVE732DW2\/1qMZBVfz8L5I8he1W9xqsWMe3pvFqOsNdXnH\nzvXl5KEz6CB6S8+Ka\/RQ\/nZk7ECsAFQg8hMCpDQzlOQMPWmdpM6WSw3XvsJQB3S2VuOKpg7dl5tw\nceAy+nt472oZtUeObFhzspKEY+Fhe+Hu5axfsQzHzrW7BmCgthz91efQlZCK7qJCXGmrQ3u6H6I\/\noxDbyRFBgLwODCUpcLYQne0h2o8Ykot2zpfL8G3ZCXQ0V+BySzW6LtTSCWvR21EvwnO1i59TmjDU\nQ113bwtio4OFc1s8nMSofTahva6+Epd3R2Kgpkw0B3xs14ksXAqLR+f5crSnbSdAc9qsZQQ4GV9+\naDxGAvD4enou3SAXbU8oPwss1T5ZJWyahjTvBcgPtkdxlAcaTobhfH4cLrVUovMCg5PTF2vRQB11\nYV4aTmUmIILyr6etntSArrIitHsFoutMPro1NXRMDS4V5KHN\/ku0n85Bc8RqWhzmSF4rxwF6BP3C\nxniMJPlOKmQQICvbnp57+XGQHqZZ6fRdop1UD83ix8QYSuiEdVbI8CX4vXYoifZAzbEAqHPj0Fp9\nGhfVZUIa9TmhC42lQq2NJWipKERrcgqa8jNQ5judnDNH0ueKFwPmOlo85ZY7Y6MczYnT0BD\/OmpC\np1KPpqBmUoqCzSqcoYVU5GaJQhpP2WvhGTyeStRIeAY\/SCWLW6jjvtbI2rYAJVGuehVHuuB0qDNy\nQ5xRuW85UtcpCUyKowQYTjfOxcJQkhwHpZpb7v6zs\/G0bz6e9K9CeeQ0BNKzQjRdLHOTEkcJNJVv\nYoNS1M4UCskpB0qNjUoBnu2gFDeSZa\/AiU0KAR+x3HQUvPYGzMTvHKV8Z5WAC1\/BIVYgjAB3EpCh\nJNn8dsnLAg807+Ju8zsYbpiDq7WfoiX7zwhaMllA8AW562XAOKqbiXYyylcldSDm5JZc1NFkciFJ\nXMgUiWtkdByBuFmhgFwvdLHEGVe6EUcLsSDiVimwf6mZgAtbbk7QShpNqB8wGqUd1kbDkixHhQ0D\nXq+chcGSmegtfBO3W52gyZ+BfYsnE5SCIGQEIEfaei0Ul6bUtRQeguEqwCuRt4pEgoyn32Jo6whd\nZioWwCGCzfSxQPZWynVPpQA6aCtH8BIzhNL\/ocvMkU7XCCXAHQw1UtZGxeL9TMY6WVBL4uvoyHwD\nV05\/BHXyOwihJlYLyCGWC7FrMZ9y\/yYVYQknwMMEf5A+xxFYIm24XBUYNoag645ME2nD6q\/4hKrI\nm4h3s0DMSjntuaYCLoSUTzvJfnqq225tZCg\/\/Su4DAdZUFnQlOGyyBlU8lTwnj9ZtEEMxXBHCCCF\nXOPvuDzpwslg7JrOxcOs1XLx\/Y26OXjUNhf3Wv6CJ0Nf4GbDLDRlz6DwSunmTWk0F6Eu97SC\/wdG\n1DRPHCXf9\/8w+qVmwVrjiZErzGz3LDKLP7pGoeZwMmAiXZSLOucZu8XlicPJYWQ4dlG4SWCHSPGU\nY5xntxvn4GbNbAyVz8Jwky36Kz9BFUXqmyVSEeIgEs8\/52EJn\/cnGmhC5q96LXxsrcKGcjDo0Cpp\nMYXwacxKqShPHM4DK8wEMLsWQqt0JBznmSZ9OnpOz0BX9nTcaXFHY+IcRDlJ8c1icwSRcwGLTFFM\nDTNvcd7vTdDLa96EYY85kom\/6T122AojVcIaqV\/GRmVx7ErzYV6VDBa23IzAZQIslsR5FkeVqSnh\nVWjSZmKwzoEAX4eHzWQEUmj3kXup6xVo2PYnfL3QGJ4EJkRwnu\/+8a3f7cV7g6+VqsLT0pa2kHiC\nVp+k\/TGZcpUBeQGE06LK3K5Cko8KvovN4PeBqbgB3n4Y7gDVYPd5E7CFwNznTvD7zc79P3+N2yxt\n6rdO8Stxtyym6jN8hjZmDqWoRvR\/njNt+KvpIWmRcdeWuS\/Fu8172flF5\/ovOWCSGkfP77oAAAAA\nSUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_x_shiny_04-1334257273.swf",
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

log.info("musicblock_x_shiny_04.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
