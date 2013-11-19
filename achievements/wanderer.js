var name		= "Wanderer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited 503 new locations.";
var status_text		= "Gosh, where HAVEN'T you traveled? Your peregrinations have earned you this footworn-but-carefree Wanderer badge.";
var last_published	= 1348803094;
var is_shareworthy	= 1;
var url		= "wanderer";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/wanderer_1316414516.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/wanderer_1316414516_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/wanderer_1316414516_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/wanderer_1316414516_40.png";
function on_apply(pc){
	
}
var conditions = {
	8 : {
		type	: "group_count",
		group	: "locations_visited",
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

//log.info("wanderer.js LOADED");

// generated ok (NO DATE)
