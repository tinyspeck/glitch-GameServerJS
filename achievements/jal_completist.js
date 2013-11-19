var name		= "Jal Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Jal";
var status_text		= "Don't forget to bring a towel! Oh, too late it seems. Well, don't you hate when you get water up your nose? I wouldn't know since I don't have one, but I hear it's the worst. Next to stubbing your toe of course. I can't do that either, but you can! You can also swim through all of Jal it seems. As such, I got you this somewhat water proof badge!";
var last_published	= 1350587782;
var is_shareworthy	= 1;
var url		= "jal-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-11\/jal_completist_1350010192.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-11\/jal_completist_1350010192_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-11\/jal_completist_1350010192_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-11\/jal_completist_1350010192_40.png";
function on_apply(pc){
	
}
var conditions = {
	833 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_136",
		value	: "20"
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_currants(round_to_5(200 * multiplier));
	pc.stats_add_favor_points("lem", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 250,
	"currants"	: 200,
	"favor"		: {
		"giant"		: "lem",
		"points"	: 30
	}
};

//log.info("jal_completist.js LOADED");

// generated ok (NO DATE)
