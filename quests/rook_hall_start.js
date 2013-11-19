var title = "It's Educational";
var desc = "Travel to the Mezzanine in Jethimadh Tower accessible via <a href=\"event:location|71#LIF5UU8FO3029OK\">Tower St. West<\/a> and speak to Greeterbot Sentry G-42.";
var offer = "Say, how do you feel about learning? <split butt_txt=\"I like to learn.\" \/> OK, so how do you feel about ancient artifacts of the past and dire prophetic warnings of the future, with a little art history mixed in? <split butt_txt=\"Those all sound pretty fun, but…\" \/>Let me guess, you're worried I'm going to send you on another wacky adventure. Well, don't worry—I'm not going to shrink you down or send you into some spooky woods or make you ride a roller-skating camel again.<split butt_txt=\"I've never ridden a roller-skating camel.\" \/>Really? Well maybe we haven't done that one yet. Anyway, this time we're going to the museum in the Mezzanine of Jethimadh Tower, accessible from <a href=\"event:location|71#LIF5UU8FO3029OK\">Tower St. West<\/a>. We're going to learn about the Rook. <split butt_txt=\"Not the Rook!\" \/>Yes, but don't worry. The museum is perfectly safe. For legal reasons, though, just on the outside chance that something even slightly bad happens, you'll need to get your parents to sign some indemnity forms. <split butt_txt=\"Do I even have parents?\" \/>Good point. Well, I'm sure it'll be fine. Like I said, the chances are extremely low that you'll be horrifically mangled beyond recognition, so get a move on, champ!";
var completion = "Welcome, young one, to the ancient and venerable Museum of the Rook. I am Greeterbot Sentry G-42, humble docent of this establishment. How may I be of service?<split butt_txt=\"A magic rock told me talk to you.\" \/>Then it is time: time for you to learn of the Rook! Time for you to take up the fight against those dreadful beasts, the fight for imagination—nay, for Ur itself!<split butt_txt=\"Me?\" \/>Yes, for if not you, then who else?";

var button_accept = "If you say so…";

var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [];
var end_npcs = ["npc_quest_giver_widget"];
var locations = {};
var requirements = {};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
}
var rewards = {};

//log.info("rook_hall_start.js LOADED");

// generated ok (NO DATE)
