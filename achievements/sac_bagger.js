var name		= "Sac Bagger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Unsqueamishly scooped 283 quivering Jellisac clumps";
var status_text		= "Well done! You've just scooped your 283rd Jellisac. I have no idea what you're doing with them all. That's between you and your giants. But here. An official Sac Bagger badge. For you.";
var last_published	= 1348802502;
var is_shareworthy	= 1;
var url		= "sac-bagger";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sac_bagger_1315685984.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sac_bagger_1315685984_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sac_bagger_1315685984_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sac_bagger_1315685984_40.png";
function on_apply(pc){
	
}
var conditions = {
	516 : {
		type	: "counter",
		group	: "jellisac",
		label	: "scoop",
		value	: "283"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 75
	}
};

//log.info("sac_bagger.js LOADED");

// generated ok (NO DATE)
