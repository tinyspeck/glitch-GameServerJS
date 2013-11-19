var name		= "Serious Scrabbler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Mined for ore 101 times";
var status_text		= "Paydirt! Well, not quite. It's just a Serious Scrabbler badge to reward your mining efforts. But still, better sock it away before a claimjumper gets wind of it.";
var last_published	= 1349313882;
var is_shareworthy	= 1;
var url		= "serious-scrabbler";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/serious_scrabbler_1304983913.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/serious_scrabbler_1304983913_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/serious_scrabbler_1304983913_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/serious_scrabbler_1304983913_40.png";
function on_apply(pc){
	
}
var conditions = {
	200 : {
		type	: "group_sum",
		group	: "nodes_mined",
		value	: "101"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 50
	}
};

//log.info("serious_scrabbler.js LOADED");

// generated ok (NO DATE)
