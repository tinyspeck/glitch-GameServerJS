var name		= "11 Clusters of DNAja vu";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Stumbled on 11 clusters of DNAja vu";
var status_text		= "You roamed the land until you connected with 11 clusters of your giantly DNA, little Gene Genie. You feel closely connected to your roots AND have a shiny new badge. Win-win!";
var last_published	= 1348797744;
var is_shareworthy	= 1;
var url		= "11-secret-spots";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-28\/eleven_secret_locations_1322501351.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-28\/eleven_secret_locations_1322501351_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-28\/eleven_secret_locations_1322501351_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-28\/eleven_secret_locations_1322501351_40.png";
function on_apply(pc){
	
}
var conditions = {
	601 : {
		type	: "group_count",
		group	: "eleven_secret_locations",
		value	: "11"
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
	pc.stats_add_favor_points("all", round_to_5(20 * multiplier));
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
		"giant"		: "all",
		"points"	: 20
	}
};

//log.info("eleven_secret_locations.js LOADED");

// generated ok (NO DATE)
