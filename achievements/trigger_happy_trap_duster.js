var name		= "Trigger-Happy Trap-Duster";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Nimbly triggered 503 Dust Traps";
var status_text		= "An almost unbelievable 503 Dust Traps have been triggered by your light-footed exploreating. Jaws have been dropped, eyebrows raised, and you have been crowned Trigger-Happy Trap-Duster. And you thought no one noticed.";
var last_published	= 1348803072;
var is_shareworthy	= 1;
var url		= "trigger-happy-trap-duster";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/trigger_happy_trap_duster_1315686131.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/trigger_happy_trap_duster_1315686131_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/trigger_happy_trap_duster_1315686131_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/trigger_happy_trap_duster_1315686131_40.png";
function on_apply(pc){
	
}
var conditions = {
	572 : {
		type	: "counter",
		group	: "dust_trap",
		label	: "trigger",
		value	: "503"
	},
};
function onComplete(pc){ // generated from rewards
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_achievement_modifier();
	if (/completist/i.exec(this.name)) { 
		 var level = pc.stats_get_level(); 
		 if (level > 4) {  
				multiplier *= (pc.stats_get_level()/4); 
		} 
	} 
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 200
	}
};

//log.info("trigger_happy_trap_duster.js LOADED");

// generated ok (NO DATE)
