var name		= "Qualified Botanical Health Professional";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered antidote to 79 trees";
var status_text		= "Anyone can be a lousy tree hugger. Only a chosen few can be called a Qualified Botanical Health Professional, and for that to happen you'd have had to have administered antidote to 79 trees, which you did! Bonsai!";
var last_published	= 1348802276;
var is_shareworthy	= 1;
var url		= "qualified-botanical-health-professional";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/qualified_botanical_health_professional_1336506011.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/qualified_botanical_health_professional_1336506011_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/qualified_botanical_health_professional_1336506011_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-08\/qualified_botanical_health_professional_1336506011_40.png";
function on_apply(pc){
	
}
var conditions = {
	473 : {
		type	: "counter",
		group	: "tree_antidote",
		label	: "antidoted",
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

//log.info("qualified_botanical_health_professional.js LOADED");

// generated ok (NO DATE)
