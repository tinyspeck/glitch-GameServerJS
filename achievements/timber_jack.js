var name		= "Timber Jack";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Used a Hatchet to gently harvest Planks from Wood Trees 79 times";
var status_text		= "Little Glitch took an axe and gave a tree 40 whacks. 79 trees that Glitch did smack, so let's call him (or her!) a Timber Jack.";
var last_published	= 1339620010;
var is_shareworthy	= 0;
var url		= "timber-jack";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/timber_jack_1315686021.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/timber_jack_1315686021_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/timber_jack_1315686021_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/timber_jack_1315686021_40.png";
function on_apply(pc){
	
}
var conditions = {
	529 : {
		type	: "counter",
		group	: "completed_harvest",
		label	: "wood_tree",
		value	: "79"
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(45 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 350,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 45
	}
};

//log.info("timber_jack.js LOADED");

// generated ok (NO DATE)
