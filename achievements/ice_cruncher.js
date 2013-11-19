var name		= "Holy Zamboni";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Gleaned as much iMG as you could from the crunching of ice.";
var status_text		= "Though every crunch represented a very real possibility of brainfreeze, you battled through and reached the extent of what there is to be learnt from crushing bits of ice into clear, smooth, nothingness. And that's why they call you the Holy Zamboni, eh? Yay!";
var last_published	= 1348799181;
var is_shareworthy	= 1;
var url		= "ice-cruncher";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-24\/ice_cruncher_1316906561.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-24\/ice_cruncher_1316906561_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-24\/ice_cruncher_1316906561_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-24\/ice_cruncher_1316906561_40.png";
function on_apply(pc){
	
}
var conditions = {
	600 : {
		type	: "counter",
		group	: "ice",
		label	: "cubes_crunched",
		value	: "1009"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 25
	}
};

//log.info("ice_cruncher.js LOADED");

// generated ok (NO DATE)
