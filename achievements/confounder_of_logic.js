var name		= "Confounder of Logic";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Mastered the unlearning of Unlearning";
var status_text		= "Some people know the knowns, learning skills that are learnable. Some know the unknowns, learning Unlearning. But one step beyond them all, you have unlearned unlearning, and now unknow the unknown. How Rumsfeldian.";
var last_published	= 1348797117;
var is_shareworthy	= 1;
var url		= "confounder-of-logic";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-08\/confounder_of_logic_1323390307.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-08\/confounder_of_logic_1323390307_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-08\/confounder_of_logic_1323390307_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-08\/confounder_of_logic_1323390307_40.png";
function on_apply(pc){
	
}
var conditions = {
	662 : {
		type	: "counter",
		group	: "skills_unlearned",
		label	: "unlearning_1",
		value	: "1"
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
	pc.stats_add_favor_points("cosma", round_to_5(100 * multiplier));
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
		"giant"		: "cosma",
		"points"	: 100
	}
};

//log.info("confounder_of_logic.js LOADED");

// generated ok (NO DATE)
