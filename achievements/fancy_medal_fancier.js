var name		= "Fancy Medal Fancier";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Scrupulously earned 47 Emblems of the Giants";
var status_text		= "You've scrimped, scrabbled and saved up 47 Emblems of the Giants, hereby earning the title Fancy Medal Fancier. Fancy that.";
var last_published	= 1348798434;
var is_shareworthy	= 1;
var url		= "fancy-medal-fancier";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fancy_medal_fancier_1304984778.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fancy_medal_fancier_1304984778_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fancy_medal_fancier_1304984778_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fancy_medal_fancier_1304984778_40.png";
function on_apply(pc){
	
}
var conditions = {
	351 : {
		type	: "group_sum",
		group	: "emblems_acquired",
		value	: "47"
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
	pc.stats_add_xp(round_to_5(2000 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 2000
};

//log.info("fancy_medal_fancier.js LOADED");

// generated ok (NO DATE)
