var name		= "Super-Sized Sycophant";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Collected one of each Giant Emblems";
var status_text		= "Zounds! For collecting one of each Emblem of the Giants, we honor you with the designation of Super-Sized Sycophant. It denotes the glory of 11,000 favor points, all in one hard-to-pronounce title.";
var last_published	= 1348796100;
var is_shareworthy	= 1;
var url		= "super-sized-sycophant";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/all_giant_emblems_1304983749.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/all_giant_emblems_1304983749_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/all_giant_emblems_1304983749_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/all_giant_emblems_1304983749_40.png";
function on_apply(pc){
	
}
var conditions = {
	170 : {
		type	: "group_count",
		group	: "emblems_acquired",
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400
};

//log.info("all_giant_emblems.js LOADED");

// generated ok (NO DATE)
