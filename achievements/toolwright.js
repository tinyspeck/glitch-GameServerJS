var name		= "Toolwright";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Painstakingly crafted 41 tools with a Tinkertool";
var status_text		= "With 41 successfully crafted tools under your belt, you're ready to move up the ranks to Toolwright. Oh yeah. Nothing's gonna stop you now.";
var last_published	= 1323922352;
var is_shareworthy	= 0;
var url		= "toolwright";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/toolwright_1315686117.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/toolwright_1315686117_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/toolwright_1315686117_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/toolwright_1315686117_40.png";
function on_apply(pc){
	
}
var conditions = {
	566 : {
		type	: "counter",
		group	: "making_tool",
		label	: "tinkertool",
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 30
	}
};

//log.info("toolwright.js LOADED");

// generated ok (NO DATE)
