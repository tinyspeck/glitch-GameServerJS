var name		= "Famous Featologist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Contributed to an outstanding 253 feats";
var status_text		= "To partake in one feat is good, to partake in a handful is glorious. To partake in 253 is a feat in itself. You, Famous Featologist, have made a feat of feating.";
var last_published	= 1351302485;
var is_shareworthy	= 1;
var url		= "famous-featologist";
var category		= "feats";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/famous_featologist_1351300689.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/famous_featologist_1351300689_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/famous_featologist_1351300689_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-10-26\/famous_featologist_1351300689_40.png";
function on_apply(pc){
	
}
var conditions = {
	841 : {
		type	: "counter",
		group	: "feats",
		label	: "contributed",
		value	: "253"
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
	pc.stats_add_xp(round_to_5(5000 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(211 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 5000,
	"favor"	: {
		"giant"		: "all",
		"points"	: 211
	}
};

//log.info("famous_featologist.js LOADED");

// generated ok (NO DATE)
