//#include include/takeable.js

var label = "Musicblock XS-1";
var version = "1347492224";
var name_single = "Musicblock XS-1";
var name_plural = "Musicblock XS-1";
var article = "a";
var description = "This is sort of an experimental, free-form, jazzy, fusiony something-or-other. Heavy on the experimental.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 400;
var input_for = [];
var parent_classes = ["musicblock_x_shiny_01", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_xs",	// defined by takeable (overridden by musicblock_x_shiny_01)
	"music_duration"	: "5000"	// defined by musicblock_base (overridden by musicblock_x_shiny_01)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANEElEQVR42q2YZ1SUZxqG5+ees4lC\nRGAaA64m0TVGYzaaiCExFjSJKMZKE5CuoqYpRlGKICijggIKokgTlAHpdQBBpEu3oGjsKZpNdrP7\n797neclMhgE2uzmZc+7zzXz1ep\/+jURi9IlcaDq+3G+yXe\/eaQ69QdOC+794Nbj705c1XaQm\/0nB\njaQGX2uhy6Rab5KXdWC1l7WdTuVeCrsqT6lK8kd\/nh6c6TYQMgP3QmegZ+dUNG6djKukrh0v49ov\nqvWxRoOfDep9bVBHqvWxQY23NapJVV7WqCSVb1KhzFOFElKxhwpF7lYoIOVvtBrM26jU5roptBdd\nFNoLpBwXhTptvdwtyfG\/LIitdjf89Y47BNe1ayqubJ+MSj9rFHtZIc9dgbotk4T4t2ajHOW+BOCj\nwkU3OaoJ9pKHEiXimAIVtIB82ha4K1HqpUKuqwJFHgynRJ6bkiGhoW2uqxIXSTkuSmQ7K5BFynRS\naGM+NrMbAfjk4Buah5GzUEsQDMZQxoC1m21QuEkpoEoJrtRbhRxXOSr9bZDnQRB0bpazjI5Zi+1F\nNwVKyKoZTlK6jwrZBJpLcLzNIbDzTgo9YOYGOVLWynDqEykil03EgaVmGjaagPs2apbdg4iZBDBk\nIWPAAk+lgKsh8XcGLCG4YhKDVdB52a4ylBA0w5QRYKaTDDl0HoOlbZDRwgjahYDIzZm0zacQyCK4\nIZjRFWFvFjxkvag3Uhp3TBEuY6DqIFvUxAWgMXEr6uO3oCFhK1qStpG2oyFxG+riA9F4ajuukmqP\neaF6nz0Kdy1E7f6lYqul35d2foDioIWo3LsE59bLUEBxyWA55OYMFznyPHlxKqSTWyMIJtx+pMKW\nmD0XViTrDTIYa98SM+SnqtHdXIXe1mr0t9fgenstbly7jJud9bjV1YCB7gbc7mnAnd4rI8T7+Tif\nx+ff6KgT1\/e1adFcdBqVMR7IdJ8CDcHlks6Ra9XLzRHGQKMo1H6Cm2Rg32sCLuojc2x632YYHD+A\nH6SDGuxrxN3+q7h3vWlU8TE+RwfLoLw4vg\/fj+\/bXpePitAV5G4VUsm6SWssydUEuWTiCIUuNtNI\nendPE4Beb43DF6vn\/gpHN9ZZjB+oA7t\/swUPbrUKPRz4Vfybj319o1kPy9fx9Tpr6iA76y+hdOd8\nnFlHibHaEgmUHKHkPWOFLJkwKOnZPVVk54ZZL2Dn2rl6yzGczmqGYI9ut+HRnXY8HuwYJt7Hx3Sw\nDDoaJLu7p6UK7QXHkeokRyLBJa2RE4zZqJI0fzqF0l8B5zdeRNC6t\/VuNYbjB+vAnt7txDf3upCV\nnogCzTlUl13AHTr3yeA1PSyfz9fx9YaQupjkUCrbs1hYjwHD7M2wf\/FISa5SBudToXWb\/SL2rH9H\nuJZvZgjHljEE++7rHnx\/vwe+\/h5Ctgso88tzxX4+zqCjQepiUufqJqoO8assyc0yytwxABt\/AXR\/\ncxyCN8zTu5bdo7OcDu7be916KL8AD0RHBQvx9\/bGMjx7MATO5xlC6tzN9zV0ddvp7ThBgCfXyLis\nYN+ikZJwodVQYfakJNnnPG+Y9UTM0UP4YfxQndUc1zgIq\/lt9hTi7\/XafPz9cT+eP+wV5+ktSdbn\n+4xmxbaU7YhzpCQhC3JSBC8aKUm5r7WIQa854xHiYqu3Hq9aZz2dW\/nhDPHTNzfxz+9u4fChECH\/\nzZvQSYH\/49Mbekg+n63O1+usyAs3jMX2lB2IJcDjjlLhzr0LJ4yQhHsnA\/rOHY9j2x2HuZdXb2i9\nHx71CQiG+9ez2wjYsonkJSx49XIh\/vHtLXGczzO2It\/P0M06wGMrLXGUdHi5xdiAmc5y+L9tgtRw\n\/zEBOb501vv5+wH8+\/kdqNVhOKIOR8BWL\/S0a8V+Ps7n8fn6WDQCFG6mOGw\/MwSoXmEhAPcQkLEk\n3PQTVllg8zwTnDvw\/wOGhQUJCzZdLvpNQI5DY8AjKwjQwQKHPrbAVx9MGCFJETXyBMqkQFtTpBkA\n9t3pRs+9fvTdv4FH93rHdPGXOwPFtrutWuw3dPFYFtS7mAAZLsbBEtEEuJuAjCXhUSj+E0tsn2+K\n9Aj\/oWbf34T0Zz\/h7A8\/CzU8eTB2khweSpKu1iqx\/8cn1\/WZfDtXg+vJqcNKzc36Clxv0v6aJCtl\n5F5LmgUsELRgwghJeBTiYvnpu6bIIEA2v\/brO3o4FsPqrKiDZEsZlxlDOLYew3UfOqEvM5zFXfHJ\n6DhwDH1XKgTg0RUyIR5Wgha8NEISHh4Z8Iv3XkLmL4BZ3z0fBjhkxfv6bOb4YjcaF2pDOF2J6T91\nBv2p6cJ6t1pr0BERS4BH0V2SL+rgEYdfAXcRkLEkPDwy4M73GdBPFNGCR49GAFY8fSzi6bdanSEc\nx95gMxXkHWHoy8xCpzoB12Li0actEa2OO0mMg5QyWYaDBMgMxpLw8MiA7O\/EwKUiNuoH+kYADtzp\nHDEsREbsIe2Fj5+7yGLeP1ofvllNQBmZaPELRu+lXP1E03p6G2KWSxG7So5IAvySgIwlyaXBMWmN\nFHsoY6JWvzo0r3U1DoMre\/xQBLnxuOXtt1GILVhZkq0fuXSzoS7u2HI96ZloDz6M7vyL4hldzZVo\nSd6GQwJQgcgPCZDCzFiSC\/SmdZYmW2413PtyQp3R3lCKzsYKXGurxdW+NvR2ce2qH1YjGSI8fLeQ\nt+9GNFCSGA6tuumaLdfsEYS+8kL0ll5CR2wiruXmoLOpAs1JgYj6mFzsKEcEAXIeGEuS7WYlJtsj\nVI8Ykpt2+uf2uFxwBi11RWirL0XHlXK6YTm6WyqFe6538HtKLTy9XUiuwoKFualiAToNdFOtqyxG\n285I9JUViOGAr+04k4rWMDXaawrRfGorAVpSsZYR4ER8\/p7pCAnA02vpvXSdXIw9ofwusGTozSp2\nw1Sc8puPrH1O0Bz0RtXZMNRkxaC1vhjtVxi8FI3aS8jJOInGmgJyW8WQmipJVegoyEWz7x50XMjC\nNcry9itlaM3ORJPT52g+n466iJWUHJaIXy3HAXoF\/czOdIQkWa4qJBMgK82J3nv5dZBepllJtC\/O\nUaqHZvFrYjQFdOwaGyQHEPxuR+RFeaPsZBC0GTFoKD2Pq9oCIYZnXanOF2qozkN9UQ4a4hNQm5WM\ngoBpZDlLnPhEMTZghovVcx65k9fLURc3FVXqV1AWOplmNAUNk1Jkb1ThAiVSrqc1cmh7zmkInsHV\n1KIM4Rn8MLUsHqFOB9gidct85B300EsT6Y7zoW7ICHFD8d6lSFyjJDApjhNgOC2cm4WxJOnOSi2P\n3L0XZ+F5zzw8612Bwsip2EPvClH0sJQNShwn0ERexDql6J0J5JJzzhQa65UCPM1ZKRaS6qTAmQ0K\nAR+x1HwY\/NACLMRx9lKWm0rAhS9jFysQRoA7CMhYkjT+d8nXCo8a38L9ujcxWDUb18s\/Qn3aXxG8\neKKA4Afy1MuAMdQ34xxlFK9KmkAsyVpy0UfjyQonxIPMEbdKRtcRiKcNssnqOe7WuOBBC3GxEgkR\ns0KB\/UssBFzYUkuCVtLWjOYBk2HaZmsyKEl1Udgx4K3imejPm4HunNdwt8EVjVnTsXfRRIJSEISM\nAOQ4tXYIiltT4mpyD8FwF+BM5FIRR5BqOhZNpSPU3lwkwBGCTfG3QtpminUfpQA67CDHvsUWCKXv\nofaWSKJnhBLgNoYylK2JRvw\/k7xGFlwf9wpaUl5F5\/n3oY1\/EyE0xA4BsovlQmy16I94fpMKt4QT\n4FGCP0y\/YwgsjgoudwWGjSboimNTRdiweos+pC7yGtSeVoheLqeaay7gQkhZVEn201vdVlsTYwXq\n\/4JLdpYFFwRPGiyInE4tTwW\/eRPFGMRQDHeMABLIaryP25POnQzGVtNZ8ShrpVzsH6iYjSdNc\/Cg\n\/m94dvMz3K6aidq06eReKS3enLaWwtWFPjbY\/q4JDc3jhyngnT8N\/1Mze7Xp+MhlFg67Flqoj69S\naNmdDBhHD+WmznHG1uL2xO5kNzIcW1FYk8COkNQUYxxnd6tn43bZLNwsnInBWgf0Fn+IEvLUV4ul\nwsXBJD7\/krc1\/N8Zb6RxKf\/T38InVyvsKAaDj6yQasiFz6OXS0V7YnceWGYhgNlqIZSlhnAcZ41J\n09B1fjo60qbhXr0XquNm46CrFF8tskQwWS5ooTk0NDBzifN7e5xevnPHDXrPloz\/Xf9jhy0zUcWu\nkgYmr1dqDi23HOSsZLCwpRYELhNgh0gcZzHUmWpjp6Dx1Az0VzgT4CvwtpuIPeTavWS9xLUKVG35\nC75cYAofAhMiOJ+3\/vz6H\/bHe1WAjarIx9qBSoiaoLVnqT7GU6wyICdAOCVVylYVTvirELDIAoHv\nmosFcPlhuAPUg73mjsMmAvOaMy7wd1vu\/\/lUb7G2q9w8KTDPy1pD3WfwAhVmdqXoRvQ9040K\/kp6\nSVpo2rFpzgtqz7kvuo11r\/8AYfDbRJ2N5JcAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_x_shiny_01-1334257170.swf",
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

log.info("musicblock_x_shiny_01.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
