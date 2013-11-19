var name		= "Firetongue Award";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Boldly imbibed 11 Flaming Humbabas";
var status_text		= "You just drank 11 Flaming Humbabas. That's going to leave a mark! You get a Firetongue Award.";
var last_published	= 1348798461;
var is_shareworthy	= 1;
var url		= "firetongue-award";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firetongue_award_1304983782.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firetongue_award_1304983782_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firetongue_award_1304983782_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/firetongue_award_1304983782_40.png";
function on_apply(pc){
	
}
var conditions = {
	177 : {
		type	: "counter",
		group	: "items_drank",
		label	: "flaming_humbaba",
		value	: "11"
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
	pc.stats_add_favor_points("friendly", round_to_5(15 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 15
	}
};

//log.info("firetongue_award.js LOADED");

// generated ok (NO DATE)
