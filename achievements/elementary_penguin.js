var name		= "Elementary Penguin";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Took 3 Purple Journeys";
var status_text		= "A time, a place, some yellow matter custard, three vials of Purple essence, a semolina pilchard climbing up the eiffel tower, one journey, one glitch. Who is the eggman? You are the eggman. Goo goo ga joob.";
var last_published	= 1348797737;
var is_shareworthy	= 1;
var url		= "elementary-penguin";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/elementary_penguin_1321580404.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/elementary_penguin_1321580404_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/elementary_penguin_1321580404_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/elementary_penguin_1321580404_40.png";
function on_apply(pc){
	
}
var conditions = {
	642 : {
		type	: "counter",
		group	: "essence_of_purple",
		label	: "journeys_taken",
		value	: "3"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 150
	}
};

//log.info("elementary_penguin.js LOADED");

// generated ok (NO DATE)
