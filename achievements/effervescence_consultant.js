var name		= "Effervescence Consultant";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Converted no fewer than 503 Bubbles";
var status_text		= "If a largish number of basic Bubbles need to be coaxed into an awesomer state, you are clearly the one to call. You've earned the title of Effervescence Consultant, and the badge that accompanies it.";
var last_published	= 1339620671;
var is_shareworthy	= 0;
var url		= "effervescence-consultant";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/effervescence_consultant_1304984314.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/effervescence_consultant_1304984314_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/effervescence_consultant_1304984314_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/effervescence_consultant_1304984314_40.png";
function on_apply(pc){
	
}
var conditions = {
	271 : {
		type	: "counter",
		group	: "making_tool",
		label	: "bubble_tuner",
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(125 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 125
	}
};

//log.info("effervescence_consultant.js LOADED");

// generated ok (NO DATE)
