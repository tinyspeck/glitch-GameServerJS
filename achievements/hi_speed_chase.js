var name		= "Hi Speed Chase";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Avoided a Hi Sign for 61 seconds";
var status_text		= "You believe saying Hi is important, but equally believe that nothing in life is satisfying if you haven't had to work for it. And BOY did you make that little Hi Sign work for it. For 61 seconds! Woah there!";
var last_published	= 1351812483;
var is_shareworthy	= 1;
var url		= "hi-speed-chase";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_speed_chase_1351810774.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_speed_chase_1351810774_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_speed_chase_1351810774_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_speed_chase_1351810774_40.png";
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 40
	}
};

//log.info("hi_speed_chase.js LOADED");

// generated ok (NO DATE)
