var name		= "Curious George";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Assembled and Disassembled each of the 4 machines";
var status_text		= "It's been noted that you're the kind of glitch that likes putting things together, then taking them apart again just to see how they work. Alph commends your spirit, little Curious George!";
var last_published	= 1348797423;
var is_shareworthy	= 1;
var url		= "curious-george";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/curious_george_1339717773.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/curious_george_1339717773_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/curious_george_1339717773_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/curious_george_1339717773_40.png";
function on_apply(pc){
	
}
var conditions = {
	786 : {
		type	: "group_count",
		group	: "machines_assembled",
		value	: "4"
	},
	787 : {
		type	: "group_count",
		group	: "machines_disassembled",
		value	: "4"
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
	pc.stats_add_favor_points("alph", round_to_5(40 * multiplier));
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
		"giant"		: "alph",
		"points"	: 40
	}
};

//log.info("curious_george.js LOADED");

// generated ok (NO DATE)
