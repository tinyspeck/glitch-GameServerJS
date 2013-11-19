var name		= "Respected Tree Doctor";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered antidote to 127 trees";
var status_text		= "There's nothing sadder than a poisonified tree. Likewise, there's nothing happier than an unpoisionified tree. Now, stick 127 of those trees together that have received antidote, and you have the kind of party you would expect to honor a Respected Tree Doctor. Just like you.";
var last_published	= 1348802484;
var is_shareworthy	= 1;
var url		= "respected-tree-doctor";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/respected_tree_doctor_1336506015.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/respected_tree_doctor_1336506015_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/respected_tree_doctor_1336506015_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/respected_tree_doctor_1336506015_40.png";
function on_apply(pc){
	
}
var conditions = {
	474 : {
		type	: "counter",
		group	: "tree_antidote",
		label	: "antidoted",
		value	: "127"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 75
	}
};

//log.info("respected_tree_doctor.js LOADED");

// generated ok (NO DATE)
