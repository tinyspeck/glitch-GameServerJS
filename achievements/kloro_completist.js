var name		= "Kloro Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Kloro";
var status_text		= "Amidst the eerie night sky, you hopped, skipped, and jumped your way across the uneven features of Kloro. Accept this badge as not only for your adventuring prowess, but also your wicked parkour skills.";
var last_published	= 1350066368;
var is_shareworthy	= 1;
var url		= "kloro-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/kloro_completist_1347052441.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/kloro_completist_1347052441_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/kloro_completist_1347052441_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/kloro_completist_1347052441_40.png";
function on_apply(pc){
	
}
var conditions = {
	791 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_133",
		value	: "20"
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
	pc.stats_add_favor_points("lem", round_to_5(100 * multiplier));
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
		"giant"		: "lem",
		"points"	: 100
	}
};

//log.info("kloro_completist.js LOADED");

// generated ok (NO DATE)
