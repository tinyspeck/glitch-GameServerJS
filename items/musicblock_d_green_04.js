//#include include/takeable.js

var label = "Musicblock DG-4";
var version = "1347492224";
var name_single = "Musicblock DG-4";
var name_plural = "Musicblock DG-4";
var article = "a";
var description = "This one is like that song from that guy who did that other musicblock.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 600;
var input_for = [];
var parent_classes = ["musicblock_d_green_04", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_dg",	// defined by takeable (overridden by musicblock_d_green_04)
	"music_duration"	: "13000"	// defined by musicblock_base (overridden by musicblock_d_green_04)
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
	out.push([2, "This item belongs to a collection which grants you the achievement <a href=\"\/achievements\/trophies\/musicblock-dg-collector\/\" glitch=\"external|\/achievements\/trophies\/musicblock-dg-collector\/\">Musicblock DG Collector<\/a>"]);
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANa0lEQVR42q2YeVBUVxbG+8+pmkQl\notAbi6NJdIzRmIkmYkiMiksUFHEDRIFmVRE1xiWKArIqqCCLICA7tNLsmyw2NqKiqCDuBo3GrKOT\nWWqqpmrqm3Nu8zrQYCqTClVfXaBvv\/6975x7znktk5n9xMy1GNkYON6xd98k597dk8Ju73gzrGfb\n67pu0qWgcWEdpPYAO6HzJL0fSWMX0qKxc5TUqFE5NvvIbWW\/9893sVO9HoRPweOIKbi5cyI6No\/H\nRVL31tdxvV96fzu0B9rDEGCPNpLe3x7n\/OzQQmrW2KGJ1OhriwYfW9SRar1tUbPBBlWkivU2feXr\n1a1lXqrWM56q1tMkracqMX+N0itz+S\/cELv26ODb174kuO5dE3EhdDyaAu1Qq7FB+QYV2jaNE+K\/\ndeuVaAwgAH9bnPFSooVgK73VqBOvqXCWbqCC1qoNatRrbFG2ToUab4ZTo9xLzZDQ0Vq2To0zJK2n\nGqUeKhSTitxVrQlLLB2HAH4b+47u65hp0BMEgzGUOaB+oz2qfdUCqp7g6v1soV2nRFOQPcq9CYL2\nlngq0BBghyIPBcoIso5cLXSX03VsUUqgZQTHq5bAStxVJsCitUpkr1IgY4UcMYvGIGqhpY5NE3A\/\nxE1zfBo9lQCMDpkDVvmoBdw5Ev8uAAmujsRgZ2lf6ToF6giaYRrIwSJ3BU57qVBLewrWyunG7FDs\nSUAU5iJaKygFignOCDO8ohdYhhndi3snu2PrBBEyBmrZ7YBzycHoSN8MQ+omtKdtRmfmFlIo2tO3\noC01BB0ZobhI0h\/ToGX\/AlTvmgv9gYVibaW\/K3d+gtrdc9Ec5oT8tQpUMSA7R2Eu9FSi3IdvjuAp\nrNEEc3DBUEU6Wb4QLpJ7fQzG2u9kiYrcRPRcbkbvlRbc7jqHO1163L1+HvduGHC\/ux0Petrx8GY7\nvuy9MET8f36d9\/H+u9faxPtvXW3F5ZosNCV4o8h7goArI+VRaBOXjkUkAw2jiAWjvWQP9r8l4OI+\nHQvfj+0HwfEH8AdJUH23OvDo9kU8vnNpWPFrvEeCZVC+Ob4OX4+v29VWgbORLhRuW+SuUSBzpTWF\nmiCdxgxRxHxLnax3zyQBqHlvBHa4zfwZji4sOcYfKIE9udeJp\/evCH394Gfx3\/zaV3cvm2D5ffx+\nyU0J8oahEg07Z+MUAWa4WSONDkcERc9c4U6j+2Q390wUp3PttFewc9VMk3MMJ7k2EOzZw6t49mUX\nvum7ZlJTXSmOHjmIs7XFaKwpFvsYdDhIDvfNzmZ0VR1HnrsSJwgwc6WSYCyHlezytgmiJHi88yp2\nr37fFFZzOHZJAvvu0Q18\/7jbpKSj0XCY4wD\/wA1i5X28n9\/H7x8IKeUkp1LD3vnCvZOrlJRzljgw\nf6hkF+kEV1L58Jr+Kvau+UCEli82EI5dGwj241c38dcnN1FamIGAIG\/ExuwzrQz5bd\/1YSGlnJRC\nfYmqQ6qrnBxU0Ml9CSCXmArqBBveHYGwtbNMoeXwSM5JcD887hFgz5\/exN+e3UJKcqxwLDDYW6wM\nySvvGwgphZuvOzDUV7NCkbLcGhkESGUF++cNlYwLrY4Ksw8dkv0eswa5J3KOPoQ\/TIJ78XUvfvrm\nNv7+3V2UabMQuNEHh+IPEKQP4uPCBCTvY6cFJLnP1xnOxavZoTjuao10N4U4FGHzhkrWSK2Jc1Az\nYyTCPR1M7vFdS+5JYZXg\/vH9Pfzrx\/tITz0kHAva6NvvpI9YeR\/vZ9f5\/ZKLfOMDc7EreyuSyMEU\nCnM4hXPf3NFDJKv3NwIGzByJY6HLB4WX736gexxWdu6CvkqAhEfsQvAmDRISIhC0ydfkJO8zd5Gv\nNzDMAwGPLbPG4aVWwwOK3umhRND7o5B7MOilgJx3kns9lODBBPT5rhABGrxZM8hJ3sf7TbloBijC\nTHnYlbNVwB3tB9xLQOaS8cSRvsIKG2eNQl7UrwPsaKsWIJ0X6vDffz5BVXmeAD58KFzk5MsAOQ\/N\nAY+6WCPRxQqHlljhi09GD5GMR6E0StQQBwvk9wPe6m1BRIcGoYblQmU9SYNC3H2lWYS099o5\/Oen\nRziRfrjfQWMOSiF+mYOmEBNgorOVUDwB7iEgc8l4FGLA0NkWKIgOEklcdCUei5ommrSiZTpuP2xB\nW1OZ8TD0g7CT\/37+EOWncwSclIN8SKQcvN1kQG+Dfkip+TkHFUhYak2zgBV2zxk9RLIqGtFTCXDb\nhxYoJEC2\/0C7zyBA1pEr29BpqBNlhMsJg1y\/3CRCnpoSP+gUD3SvbkcZ0qalo2bbaWQ6ZOJSUYOp\nzDDgsWUKCrNCDCu757w2RDIeHhlwx0evoagf0KPVYQhgaLsrWhvOCIBt24NFcTaC\/rzGxRo7CsNJ\nJab2szOo3X5GuKc\/VoXK0FJ06hqMhZrqIMMlLTMC7iIgc8l4eGTAnR8zYKC4O3M4AUi52KGvFq1M\nam0MOrCDSKupJ1PuFbnmCfekGth6pBKpU9NEq+NOcsSZAJcrEUuAzGAuGQ+PDMjxTg9ZKHJjs955\nCGDp9YRhhwV2q7ggXUBFR+8Va1TUHvgFrBcHg+EKl+eaTm9LYgU9g+SKieZK1hYkOMuRTIAxBPg5\nAZlLxpPtSeqFe+nExLm9Ke5Me\/HoIDg\/vZNI8peNWzxqsWN+gevFKs2GXFaqt2lRtbXU1OJqdmuR\n55xDE3YdOk9uwWECPL5ChZjFBEhpZi6ZNNny5MC9Txvhga72etQZspF4fhuOtG\/H9a56+gDDoBo5\ncGAtyE0Rjh2M3ANNgJfpxHJYC5adEnnHcBydpsM6FK3JhT6nApczQxC\/VI6j5GA0AfI5MJdMS4+C\nOasVlAtWApKbdsFnC3C+KgedbTW4aqjHtQuNuHGpET2dTSK571zj5xQ97nXT1N1jwKG4\/cI5X791\nYjU+mxgfFSq3lCLf5ZQ4te151dD65KPmQCk6KqtxOWMz1T8CpEMSvXgMPvvIYohkpV42yCbA7NU0\n3dJkG8HPAk7GJ6uktRORETgbxfvdoYv1Q\/OpSJwrTsAVQy26LjB4PW5cbEQzTdTaogzkZSchmvKv\n+1ITqZlea0LZxkKk0KGo2FGEEu88FG\/IhaG8Ep3na9AWswxxS2jkp8+NokfQ7Y4WQyQrIcAsmmh5\nqs13V4unrQJ6mGZl0v+Sl8tN0Cx+TIynhE5aaY+TwQS\/ZznK4\/zQcGI3WgsT0F5fgoutVUIdrZVC\nbdU6NJ3Soj6tBM0lWpw\/WwZ9dT6qgifR6bVGqtsvABZ62rzgZ4KsNUqcT5qI5sQ30BAxHukrVWIM\n0lKOnibpfOzEmudhhGfwRGfrQfAMfphaFk8oWcEOyN00G+Wx3ibpYjagJMILheFeqN23kCJGz8WL\nadyiQ3KQbpybhblkBR7qVh65e09Pw4ubs\/C81wXVMROxl54VuD\/mrFXTBRQi\/Flr1KJvptGAme9J\nuUt\/lxF4PkGXrqfD5q6i\/SoBH71w7CB44w1YidfPUJSKKfejF8vJOTmFWIVIAtxKQOaS5burEvMD\nbPCs4z08aXsXfc3TcafxUxjy\/4wwp7HIJohkcjKNwnBytYrqljWOU\/\/MWKWmEYl+d1WKPprqpkLq\nCv6gsbRfgSwG8bGnCNhB603ukwrW2dCBkOPIMsr1BVY4SHAHF1kjh1IrcqElzQOjBmmLw6g+CrHK\nMT\/QBvdrp+J2+RT0aN\/Co\/Z16CiejLD5YwjKGE4GzOyH4vZ0YqUa0YusRBc4RInOxTaFIPlExtHJ\njFwwVhyAo+R+TpANCjZRrgeoyDFrJLiocMDJiqAoRUh84xEEuIWhBsphlE58P3NytSLMkPwGOrPf\nxI2Sj9Ga+i7CaYjdN2+MeHMKuZSyQimgGIbbU5qbGlHkFjd77gZHaE0mB5NdVUii\/fG0r+nYRJE2\nrN6axeitfAuJPjZUnJXYP99KwEUssEYxHdQD9FS32WGUuUJMX8FleyjCqsLG9VXFTKaWZ4vAWWNE\nONk1huOGzoCHqbAykBROBkvsd02CO0Zu8v8fnJ2Oby\/NwFPDX\/D83nY8bJ4Kff5kgpFTUxgr4MJJ\n1f72CP1wFA3NIwcp+IM\/DP5Ss9TNYmTMIivnXXOtEo+7qlo5nAzFeSa5xnAJS43tiQETKNwMFEXh\n5pW7wtFlSpFnj2iOfNgwDfeqp6KP+ntv7WLUUaT2zZeLELOLvLeSpvqgD0aaaUT2r\/pa+ISbypGG\nyrAjLnJdiqvqBffOQwTI4eQcTHCRC7AIKuwSWCLlGOdZR+YkdJdMxrX8SXhs0KAleTpi18nxRT\/g\nF3PHQkcD80kqcYHvjzApYOaIPr\/pspG\/6XvsyEWjbJNc5SF0unWHna37+FCwa+xm\/BKFAGNxniWs\nUkCfNAEdGVNw+6wHAb4BP8cxVB2sSVY4sUqF5k1\/wudzLOBPYEIE5\/\/eH9\/+3b54bw62t63xt3Om\nuphI0K25HjZU19Q0BChFjkVRp8ihnE4JskXwPCts+ZCKuYsSpVQLGS6KerBm5gj4EphmxoiQ3+zc\n\/\/PTssnOsWnjuJByjZ1O623bx4WZQ1nmyzXRFkVeVPCX0UPSXItrvjNeSfSZ+arXy671P0VZXRKS\nnAn9AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_green_04-1334273174.swf",
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

log.info("musicblock_d_green_04.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
