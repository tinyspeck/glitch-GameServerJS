var name		= "Paper Plucker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Braved papercuts to harvest Paper Trees 73 times";
var status_text		= "Congratulations. You just harvested a Paper Tree for the 73th time, earning the title Paper Plucker. Try saying that 5 times fast.";
var last_published	= 1338921130;
var is_shareworthy	= 0;
var url		= "paper-plucker";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/paper_plucker_1315685993.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/paper_plucker_1315685993_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/paper_plucker_1315685993_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/paper_plucker_1315685993_40.png";
function on_apply(pc){
	
}
var conditions = {
	519 : {
		type	: "counter",
		group	: "paper_tree",
		label	: "harvest",
		value	: "73"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(25 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 25
	}
};

//log.info("paper_plucker.js LOADED");

// generated ok (NO DATE)
