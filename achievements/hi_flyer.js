var name		= "Hi Flyer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Evaded a Hi Sign for 11 seconds";
var status_text		= "They say you can never outrun a Hi Sign, but gosh-darn it if you didn't give it a good try. It got you in the end, but for 11 whole seconds you were free. Free!";
var last_published	= 1351812137;
var is_shareworthy	= 1;
var url		= "hi-flyer";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_flyer_1351810771.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_flyer_1351810771_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_flyer_1351810771_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-01\/hi_flyer_1351810771_40.png";
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("hi_flyer.js LOADED");

// generated ok (NO DATE)
