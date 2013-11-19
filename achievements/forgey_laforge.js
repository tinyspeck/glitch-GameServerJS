var name		= "Forgey LaForge";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Smelted 41 Metal Ingots from purest Metal Rock";
var status_text		= "You've used a Smelter to channel the power of raw heat in order to turn Metal Rock into Plain Metal. Like a god, you are. A god named Forgey LaForge.";
var last_published	= 1323921405;
var is_shareworthy	= 0;
var url		= "forgey-laforge";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/forgey_laforge_1315686073.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/forgey_laforge_1315686073_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/forgey_laforge_1315686073_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/forgey_laforge_1315686073_40.png";
function on_apply(pc){
	
}
var conditions = {
	548 : {
		type	: "counter",
		group	: "smelter",
		label	: "ingots_created",
		value	: "41"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 20
	}
};

//log.info("forgey_laforge.js LOADED");

// generated ok (NO DATE)
