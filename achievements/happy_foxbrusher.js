var name		= "Happy Foxbrusher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Brushed 1009 fibers from the tails of foxes";
var status_text		= "The foxes of Ur have 1009 fewer fibres in their tails thanks to you. And you have this lovely badge, thanks to them. Happy foxbrushing, Happy Foxbrusher! Foxeh!";
var last_published	= 1348798900;
var is_shareworthy	= 1;
var url		= "happy-foxbrusher";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/happy_foxbrusher_1339701054.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/happy_foxbrusher_1339701054_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/happy_foxbrusher_1339701054_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/happy_foxbrusher_1339701054_40.png";
function on_apply(pc){
	
}
var conditions = {
	734 : {
		type	: "counter",
		group	: "fox",
		label	: "fibers_brushed",
		value	: "1009"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(50 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 50
	}
};

//log.info("happy_foxbrusher.js LOADED");

// generated ok (NO DATE)
