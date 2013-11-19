//#include include/takeable.js

var label = "Musicblock DR-3";
var version = "1347492224";
var name_single = "Musicblock DR-3";
var name_plural = "Musicblock DR-3";
var article = "a";
var description = "Underpants have been known to become airborne at the sound of this musicblock. Watch your back.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 500;
var input_for = [];
var parent_classes = ["musicblock_d_red_03", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_dr",	// defined by takeable (overridden by musicblock_d_red_03)
	"music_duration"	: "9000"	// defined by musicblock_base (overridden by musicblock_d_red_03)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANd0lEQVR42q2Yd1RUdxbH5889ZxOV\niMI0imuKrjGWbDQRQ5JVQY2CBRsgSi8qoNHYQaliZKSjICAMdZSh9yIIoqJYsSsajbElJtm+e\/Z8\n994fzgsM6O7mhHO+580wv3nv8773\/u69b2Qyo7\/oGSZD6\/xG23bvHOvQvXVsyNVN74Rc2vCW\/iLp\nlP+okA5Su6+V0HFSizfJyyqwycvK1qA6L5Vto4fcUvZr\/z3eM8Ht1u7xuBc2Hpc3j0HHutE4Sbq4\n\/i2cf6EWHyu0+1mjzdcaraQWH2sc87ZCE6nRywoNpDpPS9R6WKKaVOVuicrVFignla6y6ClZpW4u\ndlM1H3VVNR8h6VxVGu1ypVv6wlfcELt2N+K9c3cI7uKWMTgRPBoNflao8rJAyWoVWteOEuL3+lVK\n1PkSgI8ljrop0USwZe5qVIvPVKinGyilY\/lqNWq8LFG8UoVKd4ZTo8RNzZDQ07F4pRpHSTpXNYpc\nVCgg5TurmmPnmdoOAHy0Z5L+m+iJaCEIBmMoY8CWNdao8FQLqBqCq\/G2hG6lEg3+1ihxJwhaW+iq\nQK2vFfJdFCgmyGpyNc9ZTuexRBGBFhMcH3UEVuiskgDzVyiRuVSBtMVyRM8ZgcjZpno2TcA9jZlo\n+yBqAgH0OmQMWO6hFnDHSPxaABJcNYnB6mld0UoFqgmaYWrJwXxnBY64qVBFa3JXyOnGrFDgSkAU\n5nw6llIKFBBcL8zgirI3Del1L2ZSZsf6N0XIGKhpqw2OJQag48A6tKWsRXvqOnSmB5GC0X4gCK0p\ngehIC8ZJUku8F5pC7VGxZQZads0Wx2Z6X7b5j6jaOgONIXbQrlCgnAHZOQpznqsSJR58cwRPYY0i\nmAj7gQq3M30uXCT3ehiMFWpnitJsDS6dbkT3mSZc7TqGa10tuH7+OG5caMPNi+24dakdty+34073\niQHi\/\/PnvI7XXz\/XKr5\/5WwzTldmoCHWHfnubwq4YlIOhVYzfyTCGWgQhdkPd5PdCn1XwMV8PhKe\nn1r3g+ML8IUMUD1XOnD36kncu3ZqUPFnvMYAy6B8c3wePh+ft6u1FPXhjhRuS2QvVyB9iTmFmiDt\nRgxQ2CxTvax721gB6PXBEGxymvozHJ3Y4Bhf0AB2\/0YnHtw8I\/TNrZ\/F7\/mzr6+flmD5e\/x9g5sG\nyAttZajdPB2HCTDNyRyptDnCKHrG2m03vEd2edsYsTtXTHwNm5dOlZxjOINrfcEe3j6LvJwUePut\nQp42BekHY9FQXYQTx8pQX1UgwTLoYJAc7sudjegqT0KOsxIHCTB9iZJgTAeV7PSGN0VJcJn0OrYu\n+1AKqzEcX\/jhnS5823MO8XGRsPnMBj5+q8Wx72v+nNfxev4ef78vpCEnOZVqd8wS7h1aqqScM8Wu\nWQMlO0k7uIzKh9vk17Fj+UcitHyyvnDsGl\/48d0LAqQoLw3f3b+MzrZqHKsrFspMj4Ovvzue3LuI\nRz3nB4U05KQh1KeoOqQskpODCtq5LwHkElNKnWD1+0MQsmKaFFoOj8E5A9zTe5cEhC4\/DT88vIIf\nv70qKTlxj3CQP0+Ii+oHaQg3n7dvqM9mBCN5oTnSCJDKCkJnDpSMC62eCrMHbZJQl2n93BM5Rxfh\nizEcu\/b8m24B9NPj6\/jTkxuSjhZlwC\/AHTF7dgqHJSfJfT7PYC6ezQxG0iJzHHBSiE0RMnOgZHXU\nmjgHvaYMxW5XG8k9vmuDe3yxZ1\/\/DMdAf3l2E3\/97pak1OS9wkGGTEqIFuvZdf6+wUW+8b652JW5\nHgnkYDKFeTeFc+eM4QMkq\/HpBfSdOhTxwQv7hZfvvq97HFZ2juH+9v1t\/OOHHvzzx7viePJ4hYDc\nuzcURwrSxfq+LvL5+oa5L2D8AnPsm282OKDonS5K+H84DNkR\/i8F\/P7BZck9duzvz+\/gXz\/dw7\/\/\nfF8cD6bu63VwjYfIR17P3xsMUISZ8rAra72Ai3sBuIOAjCXjiePAYjOsmTYMOZFGgKerXgmo0YRj\n85YgpFEtZED\/NZ4o1mXgeGPJoICch8aAcY7m0Dia4at5Ztj+x+EDJONRKJUSNdDGBFojwKcB9nhc\nk\/PSEAes9ZTqoP+L1\/w5r+P1L3NQCjEBahzMhPYS4DYCMpaMRyEGDJ5ugtwof2kX3z9Rge9mqvBk\np9srN8nT+xfR0VoB7eEkEd5zJ+tw7XyLlINXG9rQXdsyoNT8nIMKxM43p1nADFs\/Gz5AsnIa0VMI\ncMPHJsgjQLafy8Gj7S4CkPWou+2\/lpmUpBipDibGR0vuVW8qRurEA6jccATpNuk4lV8rlRkGjF+g\noDArxLCy9bM3BkjGwyMDbvrkDeQbADvr8Gz+WxLg47iNUqFmSM4v40LNO5fhuAY21x6VSkzVxqOo\n+uKocK8lvhxlwUXo1Nf2FmqqgwyXsKAXcAsBGUvGwyMDbv6UAf3E3X2duE2CYz1bOklcjB0xhJtB\nDbAsds3Qk7lXi55MuZe\/KEe4Z6iBzfvLkDIhVbQ67iT7HQhwoRJ7CJAZjCXj4ZEBOd4HAmeL3Hiy\nZGI\/QNa3R5JEV2EIBmBQFrvKx4LcAwIuKnK7mHYMfZjh8hZmS7u3SVNKzyDZYqI5kxGEWAc5Egkw\nmgC\/JCBjyXiyPUS9cAftmBind3CtvhD3Qz3xyHcWHrtNkwCf+NuJlhVHpaW+ulA41Fdx+yMEvLfv\nKuyPDZfKSsUGHcrXF0ktrnKrDjkOWTRhV6PzUBD2EWDSYhWi5xIgpZmxZIbJlicH7n26MBd0tdfg\nQkc93WUTrojhlefDNqkEaWLDBExExDYBxDK85hp49kSNNF3nLjgs8o7hODoN+\/TIX56NlqxSnE4P\nxN75csSRg1EEyPvAWDIdPQpmLVNQLpgJSG7auRvtcbw8C52tlTjbVoNzJ+pw4VQdLnU2iOQ+dFAD\nDy9X7Nr1JZa7OglYT++V4sg30fts0vuoUBZUBK3jYbFr23MqoPPQonJXETrKKnA6bR3VPwKkTRI1\ndwQ2fmIyQLIiNwtkEmDmMppuabIN42cBu94nq4QVY5DmNx0Foc7Q7\/FG4+FwHCuIxZm2KnSdYHBy\nmure+ZN8A\/W4ePqFTjWQGumzBhSvyUMybYrSTfkodM9BwepstJWUofN4JVqjFyBmHo38dN1IegT9\nwtZkgGSFBJhBEy1PtVpntXjayqWHaVY6\/S9xoVyCZvFj4l5K6IQl1jgUQPDbFqIkxhu1B7eiOS8W\n7TWFONlcLtTRXCbUWqFHw2EdalIL0Viow\/H6YrRUaFEeMJZ2rzlSnF4BmOdq8ZyfCTKWK3E8YQwa\nNW+jNmw0DixRiTFIRzl6hKT3sBLHHJdeeAbXOJj3g2fwfdSyeELJCLBB9trpKNnjLkkfvRqFYW7I\n2+2Gqp2zKWL0XDyXxi3aJBF049wsjCXLdVE388jdfWQinl+ehu+7HVERPQY76FmB+2PWCjWdQCHC\nn7FcLfpmKg2YWlfKXXpfTOBagi5aRZvNWUXrVQI+avbIfvC9N2AmPj9KUSqg3I+aKyfn5BRiFcIJ\ncD0BGUumdVZptL4WeNjxAe63vo+exsm4Vvc52rS\/R4jdSGQSRCI5mUphOLRMRXXLHEnUP9OWqmlE\noteLlKKPpjipkLKYLzSS1iuQwSAe1hQBK+jcyX1S7koL2hBy7F9AuW5vhgiCi5hjjixKrfDZpjQP\nDOunIJthPRRila3WzwI3qybgasl4XNK9i7vtK9FRMA4hs0YQVG84GTD9BRS3p4NL1IiaYya6wFeU\n6FxskwmSd2QM7cxw+5FiA8SR+1n+FshdS7nuqyLHzBHrqMIuOzOCohQh8Y2HEWAQQ\/WVzTC9+H3m\n0DJFSFvi2+jMfAcXCj9Fc8r72E1D7M6ZI8SXk8ml5MVKAcUw3J5SndSIJLe42XM32E\/HRHIwcZEK\nCbR+L61riB8j0obVXTkX3WXvQuNhQcVZidBZZgIuzN4cBbRRd9FT3TqbYcYKlH6Cy3RRhJSHjOop\njx5HLc8SftNGiHCyawzHDZ0B91FhZSBDOBlM88I1A1w8ucn\/v1U\/GY9OTcGDtj\/g+xtf4HbjBLRo\nxxGMnJrCSAG3m1ThY43gj4fR0Dy0nwI++k3\/HzWLnEyGRs8xc9gyw0yTtEjVzOFkKM4zg2sMFzu\/\ntz0xYCyFm4EiKdx85K4Qt0Ap8uxu02Tcrp2IGxUT0NPigO6quaimSO2cJRchZhd5bRlN9f4fDTXS\nkMz\/6Wfhg04qWxoqQ\/Y7yvXJi1TPuXd+RYAcTs7BWEe5AAujwm4A01COcZ51pI\/FxcJxOKcdi3tt\nXmhKnIw9K+XY\/gJw+4yR0NPAfIhKnN+HQyT5Th3S4z1ZNvQX\/Y4dPmeYZcIieSDtbv0+B\/Me3hTs\nGru5d55CgLE4z2KXKtCS8CY60sbjar0LAb4Nb9sRVB3MSWY4uFSFxrW\/w5efmcCHwIQIzueD3773\nq\/3w3hhgbVnpY+VAdVFD0M3ZLhZU19Q0BChFjkVSp8iinE72t0TATDMEfUzF3FGJIqqFDBdJPdhr\n6hB4EpjXlCGBv9i5\/+evaa2VbcOaUYElXlZ6nbtlDxdmDmWxJ9dES+S7UcFfQA9JM0zOeU55TeMx\n9XW3l53rP\/SnnSwTNmngAAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_red_03-1334256875.swf",
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

log.info("musicblock_d_red_03.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
