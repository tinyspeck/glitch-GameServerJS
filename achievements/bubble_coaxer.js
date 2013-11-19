var name		= "Bubble Coaxer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Transformed 53 Bubbles";
var status_text		= "Pat yourself on the back for converting 53 basic Bubbles into fancier Bubbles. You've earned a Bubble Coaxer badge.";
var last_published	= 1339620665;
var is_shareworthy	= 0;
var url		= "bubble-coaxer";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_coaxer_1304984287.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_coaxer_1304984287_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_coaxer_1304984287_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_coaxer_1304984287_40.png";
function on_apply(pc){
	
}
var conditions = {
	265 : {
		type	: "counter",
		group	: "making_tool",
		label	: "bubble_tuner",
		value	: "53"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 25
	}
};

//log.info("bubble_coaxer.js LOADED");

// generated ok (NO DATE)
