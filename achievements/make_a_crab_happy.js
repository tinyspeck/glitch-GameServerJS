var name		= "Make a Crab Happy";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Played the exact Music Block for the Crab, which he has heard the LEAST recently.";
var status_text		= "Now that's what we call a moldy oldie. For throwing down a sets of claw-snappin' beats that brought the Crab back sweet memories, you've just earned the ever-so-rare Make a Crab Happy award.";
var last_published	= 1348801540;
var is_shareworthy	= 1;
var url		= "make-a-crab-happy";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/make_a_crab_happy_1304983676.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/make_a_crab_happy_1304983676_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/make_a_crab_happy_1304983676_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/make_a_crab_happy_1304983676_40.png";
function on_apply(pc){
	
}
var conditions = {
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800
};

//log.info("make_a_crab_happy.js LOADED");

// generated ok (NO DATE)
