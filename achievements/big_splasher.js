var name		= "Big Splasher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered a much-needed watering to 41 hot Spice Plants";
var status_text		= "The more water you splash around on hot Spice plants, the cooler you are. And we're talking old school rat pack cool here, hence your new title, Big Splasher. There might even be a song about you.";
var last_published	= 1323931328;
var is_shareworthy	= 0;
var url		= "big-splasher";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/big_splasher_1304984727.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/big_splasher_1304984727_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/big_splasher_1304984727_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/big_splasher_1304984727_40.png";
function on_apply(pc){
	
}
var conditions = {
	341 : {
		type	: "counter",
		group	: "trants_watered",
		label	: "trant_spice",
		value	: "41"
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

//log.info("big_splasher.js LOADED");

// generated ok (NO DATE)
