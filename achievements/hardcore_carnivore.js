var name		= "Hardcore Carnivore";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Munched 53 meats";
var status_text		= "Way to munch that meat. We're offally excited to offer you a juicy promotion to Hardcore Carnivore status.";
var last_published	= 1338926902;
var is_shareworthy	= 0;
var url		= "hardcore-carnivore";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hardcore_carnivore_1304983503.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hardcore_carnivore_1304983503_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hardcore_carnivore_1304983503_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hardcore_carnivore_1304983503_40.png";
function on_apply(pc){
	
}
var conditions = {
	57 : {
		type	: "counter",
		group	: "items_eaten",
		label	: "meat",
		value	: "53"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "pot",
		"points"	: 50
	}
};

//log.info("hardcore_carnivore.js LOADED");

// generated ok (NO DATE)
