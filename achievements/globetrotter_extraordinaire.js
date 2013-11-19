var name		= "Globetrotter Extraordinaire";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited 1259 new locations.";
var status_text		= "You've seen a lot of this crazy old world. Wipe the dust off your feet and enjoy this Globetrotter Extraordinaire badge.";
var last_published	= 1351203977;
var is_shareworthy	= 1;
var url		= "globetrotter-extraordinaire";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/globetrotter_extraordinaire_1316414520.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/globetrotter_extraordinaire_1316414520_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/globetrotter_extraordinaire_1316414520_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/globetrotter_extraordinaire_1316414520_40.png";
function on_apply(pc){
	
}
var conditions = {
	10 : {
		type	: "group_count",
		group	: "locations_visited",
		value	: "1259"
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
	pc.stats_add_favor_points("lem", round_to_5(300 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 2000,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 300
	}
};

//log.info("globetrotter_extraordinaire.js LOADED");

// generated ok (NO DATE)
