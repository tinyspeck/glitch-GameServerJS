var name		= "Sheet Snatcher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Braved papercuts to harvest Paper Trees 283 times";
var status_text		= "Well done. For harvesting Paper Trees 283 times, you've just gone and earned yourself the title Sheet Snatcher. Um, you were planning to recycle those, hey?";
var last_published	= 1348802543;
var is_shareworthy	= 1;
var url		= "sheet-snatcher";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sheet_snatcher_1315685997.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sheet_snatcher_1315685997_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sheet_snatcher_1315685997_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/sheet_snatcher_1315685997_40.png";
function on_apply(pc){
	
}
var conditions = {
	520 : {
		type	: "counter",
		group	: "paper_tree",
		label	: "harvest",
		value	: "283"
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
	pc.stats_add_favor_points("spriggan", round_to_5(40 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 40
	}
};

//log.info("sheet_snatcher.js LOADED");

// generated ok (NO DATE)
