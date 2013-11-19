//#include include/takeable.js

var label = "Musicblock SB-1";
var version = "1354427262";
var name_single = "Musicblock SB-1";
var name_plural = "Musicblock SB-1";
var article = "a";
var description = "This is the rare original recording of the song the Giants were humming when they were imagining the world.";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 10000;
var input_for = [];
var parent_classes = ["musicblock_sb_secret_01", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "",	// defined by takeable
	"music_duration"	: "35000"	// defined by musicblock_base (overridden by musicblock_sb_secret_01)
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
	return out;
}

var tags = [
	"musicblock",
	"no_rube"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-37,"w":37,"h":37},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAQWElEQVR42q2Yd1RUaZrGa2enZ5zR\nFpFYiWCbYGxDY2pBAQUpQUmC5FhAVZFzEiiSJNEiSM5KFLAwgSLRxsbQM3bburpqix1mtufsnum\/\n9u9n3+9D3W7onrM7ZzjnObe4VRS\/+7zxXoFgyU+Zg67OuGq97ZM8S7cn2Zbqp+mb1V+mbNQ+It2L\nXqeeJ91RmnF9QpqNIkWaJUxFmtm+1XikxHZSLjQV\/LN\/\/lq+PeRl4VZ8XbQVjzMtMB+\/HndJj5I3\n4vM3mlWY4Y7KHHNKc9wmzSrMMRNlhinSZKQZJkjjEaa4KTfFGGk03BTXw0xwlXQ51GRhJFQ6fSlE\nMj0cJJkeIg0GSTTdfuKQVs+\/c0HMtdentj18RXCPsizwadJ6TKjMMBppgpEwCW7HreNiv2tDxRhX\nEoDCFMMhYkwR7JVwKcb4exLcogu4TMerYeycKbQhEozKGZwUIyFSBknnpLgULMUwaTBIiouBEvST\n+gIk02eP6dsuA\/y+\/CPtn8t2YJYgGBiDWgo4G2uOaxFSDnWD4G5EmWIwWIyJaHOMhEtwnT47ECTC\nTaUZ+gJFuESQNwi2N0CE0Tef1ZKLgwyKNBAgeQfY5y9Gh48ILV5ClDkboOSIvpaZxuH+s2KH7Xel\n2wlg0aGlgFflUg43Q2KvOSD9wzHSZXLuFn3uYrAIYwTdGyAkZwmQoIaYc\/SZHn8hwZsRPAGRe\/3B\nElyJMKOj9A3Mz6tUpq9edK\/io4755A08ZAxoSL4BWUc\/Qqm3NRRWQmQdskSqtRnynLYgy9ECzSpX\n9Cc5QZsmQ0+sHS4ordESvhcXonahM2gT+sI24cxRQ2hc9FHvZow2byGuciAJhgiwL0iMEcpNpl4K\naynBnJItV7GT\/g\/cRXJvgYExnfM0QkGQDCd2WSB033aoDlghzm43TlhI4b7BGPm+zjij8EV1rB+G\ny9Jw9exJ9BbEo78oEQPFSfzI3kt02QufDyVw26APmWQVDhqsgJv091BtW40SRwMOp6Xi6Q4QQ+Nq\niGIG9DMqkumFCF7mf8jhuvxE8N66EpdqCuG+YwNsDFcheLclwvdsgf+2dYixs4JG5Y\/+whQMlabi\nyplsXK\/KxWTjKdyozeevmUZOZ6I+KRhFfjKkH7VGxN7N8N4shp+lFAf1fov9q3+FkI2\/g5YgL1Du\ntZ0QotyZIJ0MlqnosL5W8OSkJQdUO+rBd9sqjHZUw5G+0GmjCJ5bTOHygRGyPA5BYbsDnSdjCSwP\n1zQ5GK8r5HAzLWW4VV+Em+cKOKC2IgPd6ljUxwZAE+mFrGP74Uff42j4O9LvYbvm13DQW4GUXbo4\nT6a0njBGIxVHkZP+MhU66S0IHp+04NWZYqsL\/x2r8OfPbyNP7o0jmyU4ukkEP6uNyPZ0QMSBbRTO\nZIzVLTrGgBjkREPxO8DR6jzu4PncaDQnhqBG6YN0530c0H7tezhstJKOv4HMaBVXo+8mtHhTnlIF\nF3Kg5RLcT9nAAeNt1iDwo\/fxH4\/v4PHEMIoifHFi50ZE2e+E8qAVyiO8MVieBa1mEeJyZda7sI7V\nqDkgA2Wh7zypxPlMBQdMcdqDY2Z62P1bAYK2ruPyNDfE\/lX\/glKP3Wgi99p8xJRz+ig4vFyCu1TB\nV6h9pNutRYjV+\/j+3+bxXwT54FIXEtzskBfoiqbUSHSpEzBQnon+iixeHKxI3uYhCys7x0LPxHK0\nMz0SLUmhKPB2hMpmG46vN+IOupnpw1W6FnY6v0aGuwzn\/SUckFXuzwKyFsP6WYb9WoTtXI2\/PPkU\n\/\/3qIdoKU1GXFoXSSB9UJ4SgKUOB1rw4aKvzuYN1iUE4o\/RGVYwv2jIjed6xiu7Jj0NHtgI9J6M5\nZGNsIMoD3RC7fzs81hnCyXgV7Ne8x\/Mw+7gLugOllIci1laQ77hcAtZotdSYMw+uhXz3arx+cQ9\/\nfXYPZYoAxDntR2GIFzKDjyE3zAMNCXJcK8jAlapCtOfEoyk9BmdjwlEeFUSv49BdkI5LlXmUCifR\np05E78k4Dnku2g9FPk5wNdfnheJgsJKOq5DreZRajQQtBMiKQu24XIJxGk1sLGUd0kPkHh28fHoH\nsyNdyPQ7hmiHfSiR+6IyMZQDVquCMHoqG9ozavSXkIvJCsQ52yPVQ4YI+73IC3BHc2Y0usn9kbIs\njJzKwIA6noe62FcGDwrzIf0VVCgrIBPqIMfDBRcIsOG4EIUUzjwHvWUSsNk5TIA5BBi1ZzW+fXkf\nw61nUKoMhMfWD3A6OhiBdtvhZ70Fkft3YLSU5Vo+FUkuunISUB0Ths7sRNiLdeFMzTzHR4Y+6pXX\n6P0xcvNKGbWdbBUqQ92p4Ut4Hzyg8x53MdvdGecJsNbTGGdcjX4BkGbnMM3NTHsGqINvn9\/Do9kr\nyKDisDVZC++dmxFMLSbW2QaeljSrNUWYaa7Azdpi9KiTURUdhLr4CDSlRGG4NBtDJeRaUQou0fFq\nWTYul6ajLzcWNVEnoLTeSnD\/Sr3wN7Be9StkEWAXAdZ4LALmEtBSCcZojxukBSDWeg2UH+vgu6d3\nOeD3X9xGR2EaXLd9gD4KVX1SBPJ8XaAtpdCVZ2CoOA39+ck4nx2L1tQotKcr0ZamwGBRKi5XZHLA\ntyFuT5WjVuGDiiB3HuJ3DlKRtPqKUU2AlceMeBSXSjBKO9tFGuQJNrqI2bcGC5\/P4uX9W3gw1ofX\nd8Zw72I7d6c+PhwtaUqauWnozVHhJrWTkZI0dBEY0\/kMFZ2PwVBhAm5Qy7lOE+d6RQ4HbE0OQ320\nP6ojfJB0cDf8\/2AOF8la5J5wQzMViMbdCKcJ8CQBLZXg7SqUtF8XcQT4DU2SZ5+O4f6NPjy42o2X\nk5dRnyhHR6qKh\/RKVT7GqwiAWs1ETQE6ybU+quiL6iQMFyWTEvn74zVFPAdZeBlgd6YSp4M9kCGz\nQbztLsh3WiLTaRfa\/WhhcDNCxVEjZB\/UWybB21Uo5YAuEijM3z68zZv1N49vY2agGSO1JWhPUaIz\nRYWRilzc6TmHuUYabxpq1gUJ0FK+3ajM4ZqoysPt+kLcaTqF6YYyTFQX4WJ+Aq9i1g9ZiLNdbDlg\nVZgPGsKc0U4hrvUUEaAhAa1dJgFbHntpR2OTJJlc\/P7xPBb+OIVXj6bxYn4ML6YuU\/hi0UaFUBnl\nh8p4atChzuhMDsawOg7XS9MwqcnFdLUac\/XFuNtcggftZZhpLOcOvg0xm8kphz\/mIfbZbALF3q1I\nt7dAm6+E1rxFwCwCWioB2816AsVUxWu5iwtP7uKrx3N4\/icCvD+JV\/cnUE3hbYhXoEUlx1B6ErQF\nSZisLiDH8nkejpFzU00luEWLwyQdmaarK3G5KA9\/7GhGf3Ya6qPCkHtMhukz5Xja04WpyjL0qyPR\n6iNB3XExygmQMSzVIiAtjize7MSjWS1efvkJXlKxfPXZNF59Nomu4izUJyjQpApHf2oChTaJh3Sm\n\/hQGChMxWJy8uMCyWUyzeaAsFZPjvbhxvQt3bl\/C\/NwIJkYv4PbEAKbHejB7sw9To92Y6yjigPXH\nJSgjQDZul0rwdrOl5RC5VDWzvRosfDmHFw9n8Izce373Jp5OjKAhNQaZRx3gamKE8mB3ZLnaIdFx\nDxKc9qKNzWlSF4Wzk+b1s9EeKopk6n2hSJcdQsYRByTZ23DJrbYieMtmZB4+iIrjB6iKxWjwJkAX\nAqQ0WyrBpTBT2ijEOE1XwGZfS9QevKQeyELMAP+dABfmx9GWk4yWZBUidm9DwQkZV7bnITQmh3O4\nxhQ5Gmnu3umpRQflpsruY8QctEaikx1i7fbR4uqEUj8vNMVEoSYiBOE7t6HM04YDnvMSo5QAWR0s\nlYDdyLB1v+G48bsVpyVyF2a7y\/DiTzP4hmBffzaFmQuNtBiEoiLCH1VK6mmqAHJOSXBKAqN\/SvP6\ns6EWlLAd0NsBD+evY+ZGL5ooPy92adBOLWmw4yy+uHMNrz6fwdeURs9nutBEgDVUJKUuBkiz010m\nwSABdvqKuDqo5EuPGNJmYcBVTlfVotqPTnYXVyKnFSqQVqsQNNNkaMmMo2M0GtOiUSwnKM\/DUId6\noZV65UClGk5mxtintxLuFtSU10vgRKlxSKSHwyLaaIR6OGYuRme8E+q8RAQpQQndgqbSVr9Ugosh\nJgQmQjstjef96Yaafh+isHfSIsl0zlP4E2gmlg6suTbKd6LKxwLtyW5oUB7GrbocRMl24RDdLrjb\nUBsJ90IzbT2BjnsRccwO\/gd3wY7ud3ab6GI\/LRYjcbtoggi5i78I2Bds+gPbaNspDz85Z4EpzSbc\nLFqPFl7+xhgINUVfsAmuKcz5kS2YPUFSutERcfgfg7N7XAbPtpOGIEsMph7CdFUktZxoWjIUmDxL\nxZR0FLUxMrTGHcJguBm1F7ppIsBT9LeszS2VoC9QOt1KH3gyvAM\/PLbG356441qZBXLpXoEN8PMB\nUjQQTAtdRAc5XEVzk11xh5+UOzzIiow+w44X3sAz8NM0un4Mv3gBhtRWxDxKl2nEnnETUvUao4nM\nKCbAZAJaKkFvkETTqzTBX+Z349vbO7EwaYVn40cx1\/0H5DsZEoQU9QTIqq2doFho62nBbPOl167G\n9J6YLsSY3peiyVuKEoKocRfyCXEpwpy7NEQaltPrMDP+XTWezDFDDldK6gowIUB92gfW\/ESJNmsW\nGKBtj8oEL0a34+nIVnw5+CFtMcGY798CNQEy1+qOL+YJgzrrZoxaD+aolP6BEZ8CZ1yFdJTwfsbe\nY84wgNN0vsZbjK4YU\/TGU64rJfxvqj2o78oMCU5IuSekC5egiAATGdSPZbNGy5\/PdPhK1HPnNuFB\nx2Z8MWBPg34nCmn8qQ8bcNdYiBu9RYuA5FqNh4g7VuZsROEUo4qAWKuoJ8A6LyosUiXBTdRa8LRh\nenLdBU+ufIgquQmtVxK65zXCKYI75WyMfuokBXTbyW59lyjh3SO4jkCR+qp63cLVsi1oSjCFytqA\nh5OFqpFcqPNcdE1DMNXuov8NJ52veePaW7hacpOF8eUtK3x\/bw++m9uFvz1PxVeT26m\/bkGRswgF\nBFh8xJicM+YFmHRgDS3NOj9RzL4VP32oedFbV4dccctyMNA0eImnWThbfaQ8zxgUc63KTcQhWTgZ\nYDUB1h5nk8CIg507LuG\/M8DXU1b46uYOPL+2HQuzbngy6oIxipTaiapfZoxCUq2nBFdoq4\/ep7NE\nqzv+T4+Fm70ltuSemnY2bYOX9IezBHeWwlfvvZhPGg8RB2M59xasmony7G6rJR4NbMHDbkt8PReJ\nqXNWNMeFyHsDqHY0xEikOdpoaVV9vPqdlHtXL0RZCXT+oefYxc5rTOu8hQlUPFqNu3CBATHXSpwN\neZgZWBWJ5VkVDYDZ2g2Yb9mKp7cCCXATomwNKLxC7h7rtZNxHyDjoC4UBMZFcIrdK7f90x68T8aY\nm15XmLn1Bks0nQHS6QtBJmimtDhLgKwIysjtzgRqL9GmiHE0QpItTSEP6p+0RTG4EprBkXtXI4LA\nIvesTviHnfv\/\/EzFmdlOxK5LGIk001IfXBhmT1QplFra3hlYXwgVmwfdJDnoPozYs0oj3\/t+yC99\n1\/8A8jSczZspFyUAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_sb_secret_01-1334257096.swf",
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

log.info("musicblock_sb_secret_01.js LOADED");

// generated ok 2012-12-01 21:47:42 by ali
