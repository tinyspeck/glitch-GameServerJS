var name		= "Überculturalist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Planted 5003 Herbs";
var status_text		= "There's a rich, salty, and somewhat savoury smell. Is that you? Yes. And the sweat of the herbatious labors that have resulted in the world being 5003 herbs richer, and you being awarded this badge. Gratz!";
var last_published	= 1348803076;
var is_shareworthy	= 1;
var url		= "uberculturalist";
var category		= "gardens";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/uberculturalist_1315686150.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/uberculturalist_1315686150_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/uberculturalist_1315686150_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/uberculturalist_1315686150_40.png";
function on_apply(pc){
	
}
var conditions = {
	581 : {
		type	: "group_sum",
		group	: "garden_herb_plots_planted",
		value	: "5003"
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
	pc.stats_add_xp(round_to_5(1500 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1500,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 250
	}
};

//log.info("uberculturalist.js LOADED");

// generated ok (NO DATE)
