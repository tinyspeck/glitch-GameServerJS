var name		= "Parchment Purloiner";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Braved papercuts to harvest Paper Trees 1009 times";
var status_text		= "This marks the 1009th time you've harvested a Paper Tree, thereby earning the title Parchment Purloiner. Incidentally, the Trees wanted me to assure you that it barely hurts at all.";
var last_published	= 1348802201;
var is_shareworthy	= 1;
var url		= "parchment-purloiner";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/parchment_purloiner_1315686002.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/parchment_purloiner_1315686002_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/parchment_purloiner_1315686002_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/parchment_purloiner_1315686002_40.png";
function on_apply(pc){
	
}
var conditions = {
	522 : {
		type	: "counter",
		group	: "paper_tree",
		label	: "harvest",
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(75 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 75
	}
};

//log.info("parchment_purloiner.js LOADED");

// generated ok (NO DATE)
