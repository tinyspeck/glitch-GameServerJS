var name		= "Mighty Fine Mulcher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Tended 251 weedy patches";
var status_text		= "You're not afraid to get your hands dirty. You deserve a Mighty Fine Mulcher badge!";
var last_published	= 1348801887;
var is_shareworthy	= 1;
var url		= "mighty-fine-mulcher";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mighty_fine_mulcher_1304983852.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mighty_fine_mulcher_1304983852_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mighty_fine_mulcher_1304983852_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/mighty_fine_mulcher_1304983852_40.png";
function on_apply(pc){
	
}
var conditions = {
	190 : {
		type	: "group_sum",
		group	: "VERB:tend",
		value	: "251"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 100
	}
};

//log.info("mighty_fine_mulcher.js LOADED");

// generated ok (NO DATE)
