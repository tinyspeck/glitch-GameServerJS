var name		= "Wood Abettor";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Petted and watered 7 Wood Trees to the full woody bloom of adulthood";
var status_text		= "Say... did you just water and pet 7 Wood trees to maturity?  Bravo! Upon your over-sized melon we bequeath the title of Wood Abettor. Go forth and continue to do your thang.";
var last_published	= 1323933325;
var is_shareworthy	= 0;
var url		= "wood-abettor";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wood_abettor_1315686026.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wood_abettor_1315686026_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wood_abettor_1315686026_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wood_abettor_1315686026_40.png";
function on_apply(pc){
	
}
var conditions = {
	531 : {
		type	: "counter",
		group	: "wood_tree",
		label	: "maxed",
		value	: "7"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 40
	}
};

//log.info("wood_abettor.js LOADED");

// generated ok (NO DATE)
