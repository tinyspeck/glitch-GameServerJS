var title = "Play by Mail";
var desc = "Make someone feel special by using a mailbox to send them an item. (You can also use the Butler on your home street - you'll receive one at level 3!)";
var offer = "Pssst. Hey, kid! How do you feel about raindrops on roses? <split butt_txt=\"I’m for them.\" \/>Whiskers on kittens? <split butt_txt=\"Who doesn’t like those?\" \/>Bright copper kettles and warm woollen mittens? Brown paper packages tied up with string? <split butt_txt=\"Why, these are a few of my favourite things!\" \/>I dig the enthusiasm, kid. But it’s the last item I want to talk to you about: packages, whence they came and where they’re going. <split butt_txt=\"Where are they going?\" \/>Wherever you send 'em, champ! You may have noticed your Butler's ability to handle mail and some stately mailboxes scattered here and there around the world. These are your links to the GIGPDS and its team of expert delivery frogs. <split butt_txt=\"Gigapids?\" \/>Don’t try to pronounce it, kid. You’ll hurt yourself. Just say “General Inter-Giant Postal Delivery Service.” How about you try out this handy service and mail someone an item? <split butt_txt=\"OK, I’ll do it.\">That’s the spirit! One more thing: you can only send mail to friends. You do have friends, right? <split butt_txt=\"I have many friends.\" \/>Of course! Who wouldn’t want to be friends with a delightful Glitch like yourself? Now get out there and brighten someone’s day!";
var completion = "That wasn’t so difficult, was it? <split butt_txt=\"Not difficult at all!\" \/> Good! Here’s a fun piece of history for you, kid: Friendly imagined the GIGPDS to help close friends keep in touch. Originally mail was delivered by bats—bats being Friendly’s symbol or avatar or mascot or whatever. <split butt_txt=\"So what happened?\" \/> Well, the bats had this troubling tendency to latch on to the faces of mail recipients and refuse to let go. They were just excited to have made a new friend, but let me tell you, in those days it was not uncommon to see a Glitch running frantically around Groddle Meadow, waving his or her arms wildly with a serious case of bat-face. <split butt_txt=\"That sounds horrible.\" \/> Horrible, yes. Horrible and also very funny. Honestly, sometimes I miss the bats, although the frogs are nice too.";

var button_accept = "I'm on it!";

var auto_complete = 0;
var familiar_turnin = 1;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var is_emergency = 1;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [{
		"not"		:0,
		"condition":	"over_level",
		"value":	3
}];
var end_npcs = [];
var locations = {};
var requirements = {
	"r269"	: {
		"type"		: "counter",
		"name"		: "mail_packages_sent",
		"num"		: 1,
		"class_id"	: "npc_mailbox",
		"desc"		: "Send a package"
	}
};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	xp = pc.stats_add_xp(round_to_5(100 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	currants = pc.stats_add_currants(round_to_5(25 * multiplier), {type: 'quest_complete', quest: this.class_tsid});
	energy = pc.metabolics_add_energy(round_to_5(25 * multiplier));
	favor = pc.stats_add_favor_points("friendly", round_to_5(10 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"xp"		: 100,
	"currants"	: 25,
	"energy"	: 25,
	"favor"		: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 10
		}
	}
};

//log.info("send_mail.js LOADED");

// generated ok (NO DATE)
