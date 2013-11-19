//#include include/takeable.js

var label = "Musicblock DG-1";
var version = "1347492224";
var name_single = "Musicblock DG-1";
var name_plural = "Musicblock DG-1";
var article = "a";
var description = "Hoe Magazine gave this musicblock 6.8 out of a possible 7 pointlets.";
var is_hidden = false;
var has_info = true;
var has_infopage = true;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 5;
var base_cost = 400;
var input_for = [];
var parent_classes = ["musicblock_d_green_01", "musicblock_base", "takeable"];
var has_instance_props = false;

var classProps = {
	"collection_id"	: "musicblocks_dg",	// defined by takeable (overridden by musicblock_d_green_01)
	"music_duration"	: "11000"	// defined by musicblock_base (overridden by musicblock_d_green_01)
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
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAANGUlEQVR42q2YeVSTZxbG8+ecM61C\nRSAbAUen1bFWa6faiqW1VlBb2cQVREB2FVFrFSsoiyIqQVEBRUFAtihh3wRiWARFcUHEHW2ttZvO\ndNb\/nrn3jUkhwXba05zznCTf9+Z7f99z73vf+0UiMXslz7Ye2Rg+1qUvdoJ7X8yEuP5Nr8X1bviz\n9hrpfMSYuE5SR5ijUBtJH0IKdoxqCXZ0MaoxWOHSHCRVSX7v1ze7J\/vfjZ+EhwmTcH3zeHSuHYsu\n0rX1f8aV59KHOqIj3AntYU5oJelDnXA2xBEtpOZgRzSRGlep0BCkQh2pNlCFmgAHVJEqVjoMlK9U\n6sr8FbrTfgrdKZLGT6EuWCr3z\/b6mRti1x4kvXH5PsFd2zIe56LHoincEbXBDigPUKB1zRgh\/q5d\nKUdjGAGEqnDaX44Wgq0MVKJOnFPgDN1ABb1XBShRH6xC2QoFagIZTolyfyVDQkvvZSuUOE3S+ClR\n6qtAMalouUKX+omNiwXgk91var9KngI9QTAYQ5kD6lc7oXqVUkDVE1x9iAqaFXI0RTihPJAgaGyJ\nn4zOOdJkMhqnQB25WrhcStdRoZRAywiO3zUEVrJcYQIsWiZHzmIZji6UInneaOyca6Nl0wTcdylT\nXB7tmkwABofMAauClALuLIk\/M2AdwdWSGOwMjStdIUMdQTNMAwEWLZfhFAHymIJlMroxgvYjIApz\nEb1XUAoUE5wBZnjtcrOJM7iX8mZO5\/pxImQM1BLjjLMHI9GZtRbtGWvQkbkW3dnrSNHoyFqH1owo\ndB6NRhdJfyAYLdvdUL1lNvQ75op3HX2v3PwhamNmoynWFflLZaiivGQwDYW50E+O8iC+ORVOUlh3\nEUySm6USXW2eCRfJvQEGY213tUFFnhq9F5rRd7EF\/T1ncbNHj1tX2nD7ajvuXOvA3d4O3Lvegft9\n5yzEx\/k8j+Pxty63it\/fuKTDhZrjaEoNRFHAOGgJroyUT6FVL7BFIgMNowS3Uf6Su9tfF3ApH9ti\n1QdOQ+B4Ap7ICDVwoxMP+rvw8Ob5YcXneIwRlkH55vg6fD2+bk9rBc4keFC4Vcgjd7MX2VOoCdJ1\ntIUS5thoJX1bJwjA4LdHYJPP9J\/g6MJGx3hCI9iXt7vx6M5Foa\/u\/iT+zue+uHXBBMu\/498b3TRC\nXm2vRP3mmchdQgvDxx6ZtDgSKHrmincdNSC5vnW8WJ3LpryEzYunm5xjOKNrg8Ee37uEx\/d78PXA\n5SHiY3zOCMugw0FyuK93N6On6hDyl8uRRXDZi+QEYzOsJBc2jKPlr4Dvmy8jZsk7prCaw\/HERrBv\nHlzFtw+vofhkFqq0+WhpOIX7NPbJwBUTLI\/n3\/HvB0Mac5JTqWHbHOEeAya62WDHHEtJumgFV1Ch\n9Z\/6MrYtfVeEli82GI6dGQz2\/RfX8cOX1xEWESjkPItWfmOZOM7nGXQ4SGNOGkN9nqpDhjcDymjl\nvgCw8zlgwFsjELdshim0HB6jc0a47x72mqDCIwOxJyVOiD\/3dDbg6SMDOI8bDGkMN193cKgvHY\/G\nYS97HCFAKivY\/pGlJFxotVSYg2iRbPedMcQ9kXM0CU\/Gkxpd81rkLlwLXx0kxJ\/bdRX4+9f9ePZV\nnxhncpLc5+sM5+KlnGgc8rZHlo9MLIq4jywlaQxzFDkYPG0k4v2cTe7xXRvdM4aVJ2eIf3x7G\/\/6\n\/g727Y0Xili9Clcp8X\/85pYJksez6\/x7o4t844NzsSdnPdLJwcMU5ngKZ+zsURaS8N7JgGHTR+JA\ntNeQ8PLdD3bvb49vCAiG+8\/Te4hcs4oULBzsaqvGP7+7I87zOHMX+XqDw2wEPOBpj\/2kfQvsXgxY\n5CtHxDtWyEuKeCEg55fRvX\/\/cBf\/fXYfanUi0tRJiFwbjOs9OnGcz\/M4Hm\/KRTNAEWbKw55cA2Ca\nh50A3EZA5pJwx5G10A6rZ1ghf+evB0xMjBEOnm+r+UVAzkNzwDQPe6jd7bD3Ezt8\/uEoC0lqaCPP\npESNcrZGwXPAG30tSOgMRnS7l1BZb\/oLQ\/zZ5ijx3nupRRwfHOIXOWgKMQEyXKq7PfYQ4FYCMpeE\nWyEGjJ5pjZO7IkQSF13cg3lN401a2DIV\/fdahl8k+wyL5NrFZnH8xyc3h6zk\/qZ29DXoLUrNT4tE\nhtQF9tQL2CFm1igLSbgVyiDADe9Zo5AA2f4dHUFDAFlpFzeISY2Q7JR5mRkMZ3SvblMZMqdkoWbD\nKWQ7Z+N8UYOpzBgWiQz7PWSiWYmZ9YqFJNw8MuCm919B0XNAX52zBWB0h7dpNXN+cRjNC\/VgOGOJ\nqf30NGo3nhbu6Q9UoTK6FN3aBkOhpjrIcAeeA24hIHNJuHlkwM0fMGC4uDtzOAFIuciO\/NJWNxiO\nc6\/IO1+4Z6yBurRKZEzOFFsd7yRqdykOUJh3EyAzmEvCzSMDcryzouaK3Fird7cALL2SatEsJO\/a\nRopFaHiAWMV83HwfZrhCrzzT6m1RV9AzSJ7oaC4eX0f5J0W6txzJBPgZAZlLwp1t9iIpttGKSfF5\nTdyZpmv\/ELgQvatIcvN2KyR8pRA72FRXamq5jL0hl5XqDRpUrS81bXE1MRrku+dSh12H7mPrsJcA\nDy5UIHk+AVKamUvCne0J6my5c+C9T5Pgi56OetS150DdtgFpHRtxpaeeJmgfUiMZIilpq1BI2Ep0\n0CIZ3LQau+uTnidE3jEcR6dpnxZFS\/Ogz63AhewopHzCIZZjFwHyOjCXREOPgtzZplE9YkjetE9+\n6oa2qlx0t9bgUns9Lp9rxNXzjejtbhLJffMyP6foERTiR1ohHKwuM4TRqLu9hkeFynWlKPA4IVZt\nR341NEEFqNlRis7Kalw4upbqn5S2OhkBjsan71tbSFLq74AcAsxZIqe2R06Ao4X4ySp92XgcDZ+J\n4u3Lod0dguYTiThbnIqL7bXoOcfg9ejUVUJTeASdZ6tw7cIZg843kZpxtasJZasLcZgWRcWmIpQE\n5qM4IA\/t5ZXoppxtTfakxUEtP827kx5BN7pYW0hSvEKFY4vlQgXLleJp6yQ9TLOy6dhBL6kJmsWP\niXsoodMXOeFYJMFv9UJ5SggajsRAV5iKjvoSdOmqhBie1VqtRdMJDeozS9BcokHbmTLoqwtQFTmB\ncs8eGT4\/A1jo5\/CMW+7jS+VoSx+PZvWraEgYi6xFCtEGaShHT5HKghzFe76vAZ7B1bRFDYZn8H20\nZXELdTzSGXlrZqJ8d6BJ2uQAlCT4ozDeH7Wxc8Ucu+ZLcYgWSRLdOG8W5pKc9FXqjlLD2Hd6Cp5d\nn4GnfR6oTh6PbfSskEKT5SxTUlMppYuRy0uUYu\/MpDsu8KXUWKoU4AUEXbqSHiOXK5C7TCHgd821\nHQJvuAE7cf40RanYX0WuSZFEyvRRIJEA1xOQuSQF\/O9SmAMed76NL1vfwkDzVNxs\/BjtBX9BnKut\ngDjoLRVQDMj75kEqrEcWKckt\/iwX+2gGTZKxkCeypfEyigiBBDmhlFzXBJD7gY7kvAPSPMl5DwU9\nsdkJuKR59sil1Eqca0P9gNUQrXO2GqAQK1wKwh1wp3Yy+ssnoVfzOh50rEBn8UTEzhktoNgRBsxe\nrKS2yF5sT1k+SuwkGN4F9tAxLrYcqjRPmViZCW62YgHsXyhDboQDCtY44FiokkJpj1QC3EGACfQ5\nwc2e5lDQZxusY6jBcrbSiv9nji2RxbUffBXdOa\/haskH0GW8hXhqYmM\/MgAepskPL5QL1xiQtyd2\nLIkA9xPgPvquJrB0bwoviWEZuunAeJE2rL6a+eirfB3qIAfsdZcjbo6dgGMVUyXZQU91a52tzBVl\n+gsux1cWVxU3ZqAqeSJteSqEzxgtwnl0MeegHOmeBtf2UeVPZcDn4WSwVA+DawzGRXc\/SU3H7p6Z\niifnp+FR+1\/x9PZG3GueDH3BRIKR0qZgi3iC2+Fqj+pQJ0S\/Z0VN88ghinz3D0P\/1Cz1sR6ZPM\/O\nfctsO\/Uhb4WO3WLXOM+MrvHeyY5xODmMDMIuGtwkOE85hVku8uwB9ZH3GqbgdvVkDND+3lc7H3UU\nqW1zpNhODrJ4bCV19RHvjjTTiJz\/62\/hIz4KF2oq49I8pFqCesZ75x6xwVOJmEfdsIdhq0qgwm4E\nS32uzuwJuFYyEZcLJuBhezBaDk7F7hVSfM6AlINbZ9tCSw3zMSpx4e+MMCls+oiBkKmSkb\/pf+zE\neVYqKjtRx5YqtXsX2A\/womDXEufaUVmSCbB9lGOcZ6mLZdCnj0Pn0UnoP+NLgK8ixGU0YimssQSY\ntViB5jV\/wmezrBFKYEIEF\/r2H9\/43f54b450UtWEOroX+DmoqSTp8qg+ZlCu7lkgFwsgiVZyzloV\nDkeoEPmRHaLes8VeD7koPwy3k\/bg4OkjsIrAgqeNiPrNzv2aV8saR5em1WOiyoMdtbQTDZyiwsyh\nLCNp6HORPxV8Tw6x9eVV015SB01\/2f9F1\/ofdHqlgphcc\/EAAAAASUVORK5CYII=",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2012-04\/musicblock_d_green_01-1334256587.swf",
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

log.info("musicblock_d_green_01.js LOADED");

// generated ok 2012-09-12 16:23:44 by lizg
