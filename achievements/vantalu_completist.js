var name		= "Vantalu Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Vantalu";
var status_text		= "Across the warm, grassy plains, over the foothills and up to the cold caves in the north. This journey has not been a light one, but you survived and completed it just before your new badge hit its expiration date. Not to worry, it just gets a bit stale and moldy.";
var last_published	= 1351624079;
var is_shareworthy	= 1;
var url		= "vantalu-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-24\/vantalu_completist_1351125956.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-24\/vantalu_completist_1351125956_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-24\/vantalu_completist_1351125956_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-24\/vantalu_completist_1351125956_40.png";
function on_apply(pc){
	
}
var conditions = {
	835 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_100",
		value	: "29"
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
	pc.stats_add_xp(round_to_5(165 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 165,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("vantalu_completist.js LOADED");

// generated ok (NO DATE)
