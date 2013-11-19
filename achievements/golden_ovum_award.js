var name		= "Golden Ovum Award";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Chowed down 503 eggs";
var status_text		= "For outstanding achievement in the field of egg-cellence, you win a slightly gooey Golden Ovum Award.";
var last_published	= 1348798850;
var is_shareworthy	= 1;
var url		= "golden-ovum-award";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/golden_ovum_award_1304983550.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/golden_ovum_award_1304983550_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/golden_ovum_award_1304983550_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/golden_ovum_award_1304983550_40.png";
function on_apply(pc){
	
}
var conditions = {
	54 : {
		type	: "counter",
		group	: "items_eaten",
		label	: "egg_plain",
		value	: "503"
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
	pc.stats_add_favor_points("pot", round_to_5(100 * multiplier));
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
		"giant"		: "pot",
		"points"	: 100
	}
};

//log.info("golden_ovum_award.js LOADED");

// generated ok (NO DATE)
