var name		= "Brillah Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Brillah";
var status_text		= "Tiny and determined, you've scuttled over every inch of Brillah. From the highest heights to the most pleasing plateau, you felt yourself dwarfed by the soaring scenery, like a tiny explorey ant. You deserve a badge, little Brillah Ant! Brilliant!";
var last_published	= 1354139835;
var is_shareworthy	= 1;
var url		= "brillah-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-09\/brillah_completist_1323474913.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-09\/brillah_completist_1323474913_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-09\/brillah_completist_1323474913_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-09\/brillah_completist_1323474913_40.png";
function on_apply(pc){
	
}
var conditions = {
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("brillah_completist.js LOADED");

// generated ok (NO DATE)
