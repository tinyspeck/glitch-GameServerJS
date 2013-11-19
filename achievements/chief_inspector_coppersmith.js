var name		= "Chief Inspector Coppersmith";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Vigorously rubbed, tugged and massaged 501 Plain Metal Ingots into Copper";
var status_text		= "This marks the 501st Plain Ingot you've rubbed into Copper. Revel in your newfound title of Chief Inspector Coppersmith. But make the revels snappy, before your stash turns green.";
var last_published	= 1348789874;
var is_shareworthy	= 1;
var url		= "chief-inspector-coppersmith";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/chief_inspector_coppersmith_1315685810.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/chief_inspector_coppersmith_1315685810_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/chief_inspector_coppersmith_1315685810_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/chief_inspector_coppersmith_1315685810_40.png";
function on_apply(pc){
	
}
var conditions = {
	462 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "175",
		value	: "501"
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

//log.info("chief_inspector_coppersmith.js LOADED");

// generated ok (NO DATE)
