var name		= "Hoochhawker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Determinedly distilled 253 Hooches in your back yard";
var status_text		= "Due to your distillation determination, there are at least 253 more means of getting buzzed in the world than there were before you began. Terviseks!";
var last_published	= 1348799158;
var is_shareworthy	= 1;
var url		= "hoochhawker";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/hoochhawker_1321576677.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/hoochhawker_1321576677_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/hoochhawker_1321576677_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/hoochhawker_1321576677_40.png";
function on_apply(pc){
	
}
var conditions = {
	636 : {
		type	: "counter",
		group	: "still",
		label	: "collected_in_pol",
		value	: "253"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 60
	}
};

//log.info("hoochhawker.js LOADED");

// generated ok (NO DATE)
