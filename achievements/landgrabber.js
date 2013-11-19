var name		= "Landgrabber";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Expanded your home street and yard to their full widths";
var status_text		= "BAM! You've reached out in every direction, and your domain - front and back - couldn't be bigger. Brava, Landgrabber! Enjoy your personal kingdom AND your badge.";
var last_published	= 1348801473;
var is_shareworthy	= 1;
var url		= "landgrabber";
var category		= "cultivation";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/landgrabber_1339723501.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/landgrabber_1339723501_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/landgrabber_1339723501_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/landgrabber_1339723501_40.png";
function on_apply(pc){
	
}
var conditions = {
	770 : {
		type	: "counter",
		group	: "max_expansions",
		label	: "street",
		value	: "1"
	},
	771 : {
		type	: "counter",
		group	: "max_expansions",
		label	: "yard",
		value	: "1"
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
	pc.stats_add_xp(round_to_5(1250 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1250,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 250
	}
};

//log.info("landgrabber.js LOADED");

// generated ok (NO DATE)
