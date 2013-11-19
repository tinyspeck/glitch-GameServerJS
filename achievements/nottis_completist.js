var name		= "Nottis Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Nottis";
var status_text		= "Wow, it's nipply out here. Like being inside a freezer. Yet you still managed to trek through days and nights of slipping on ice and rolling in snow and I present you this badge for your Brrrr-iliant work! Try not to get your tongue stuck on it.";
var last_published	= 1351861595;
var is_shareworthy	= 1;
var url		= "nottis-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-24\/nottis_completist_1351123424.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-24\/nottis_completist_1351123424_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-24\/nottis_completist_1351123424_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-24\/nottis_completist_1351123424_40.png";
function on_apply(pc){
	
}
var conditions = {
	834 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_137",
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

//log.info("nottis_completist.js LOADED");

// generated ok (NO DATE)
