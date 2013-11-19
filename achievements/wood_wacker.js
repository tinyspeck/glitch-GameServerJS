var name		= "Wood Wacker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Hatchet to gently harvest Planks from Wood Trees 17 times";
var status_text		= "You've hacked Planks from Wood Trees 17 times. You know what this makes you? A Wood Wacker. Don't feel badly. This is progress. And the trees don't mind. Much.";
var last_published	= 1339620006;
var is_shareworthy	= 0;
var url		= "wood-wacker";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wood_wacker_1315686017.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wood_wacker_1315686017_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wood_wacker_1315686017_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/wood_wacker_1315686017_40.png";
function on_apply(pc){
	
}
var conditions = {
	528 : {
		type	: "counter",
		group	: "completed_harvest",
		label	: "wood_tree",
		value	: "17"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 15
	}
};

//log.info("wood_wacker.js LOADED");

// generated ok (NO DATE)
