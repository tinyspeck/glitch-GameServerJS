var name		= "Karnata Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Karnata";
var status_text		= "You wandered around all the cliffs and ledges that beautiful Karnata has to offer. So, what did you get? The pure satisfaction of self accomplishment is all you need! Yup, just the rewarding feeling of reaching a goal. No material goods needed. The experience is enough to satiate the longing for any sort of reward. Just that, and this awesome badge, of course.";
var last_published	= 1353452662;
var is_shareworthy	= 1;
var url		= "karnata-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/karnata_completist_1347065129.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/karnata_completist_1347065129_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/karnata_completist_1347065129_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/karnata_completist_1347065129_40.png";
function on_apply(pc){
	
}
var conditions = {
	794 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_88",
		value	: "28"
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

//log.info("karnata_completist.js LOADED");

// generated ok (NO DATE)
