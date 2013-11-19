var name		= "Jolly Good Chap";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Made 47 friends";
var status_text		= "There's just something about you that people like. Here's a Jolly Good Chap badge.";
var last_published	= 1348801458;
var is_shareworthy	= 1;
var url		= "jolly-good-chap";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/jolly_good_chap_1316061693.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/jolly_good_chap_1316061693_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/jolly_good_chap_1316061693_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-14\/jolly_good_chap_1316061693_40.png";
function on_apply(pc){
	
}
var conditions = {
	213 : {
		type	: "counter",
		group	: "player",
		label	: "buddies_count",
		value	: "47"
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
	pc.stats_add_favor_points("friendly", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 25
	}
};

//log.info("jolly_good_chap.js LOADED");

// generated ok (NO DATE)
