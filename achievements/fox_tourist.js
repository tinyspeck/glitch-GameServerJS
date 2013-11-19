var name		= "Fox Tourist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Brushed a fox in preserves in each of the 10 regions";
var status_text		= "Not content with sticking to your local foxes, you made it a mission to brush the tails of foxes in every corner of Ur. Was it worth it? Sure it was, here's a badge! BAM!";
var last_published	= 1348798478;
var is_shareworthy	= 1;
var url		= "fox-tourist";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fox_tourist_1339701253.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fox_tourist_1339701253_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fox_tourist_1339701253_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/fox_tourist_1339701253_40.png";
function on_apply(pc){
	
}
var conditions = {
	739 : {
		type	: "group_count",
		group	: "fox_hubs",
		value	: "10"
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
	pc.stats_add_xp(round_to_5(750 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 750,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 150
	}
};

//log.info("fox_tourist.js LOADED");

// generated ok (NO DATE)
