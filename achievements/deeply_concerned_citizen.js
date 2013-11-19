var name		= "Deeply Concerned Citizen";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Helped out with 253 phases of a project";
var status_text		= "This marks the 253rd Project you've helped with. We struggled with what to name this badge. Hard Worker? Control Freak? We settled on Deeply Concerned Citizen.";
var last_published	= 1316467782;
var is_shareworthy	= 0;
var url		= "deeply-concerned-citizen";
var category		= "projects";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/deeply_concerned_citizen_1315686057.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/deeply_concerned_citizen_1315686057_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/deeply_concerned_citizen_1315686057_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/deeply_concerned_citizen_1315686057_40.png";
function on_apply(pc){
	
}
var conditions = {
	543 : {
		type	: "group_count",
		group	: "job_contributions",
		value	: "253"
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(80 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "all",
		"points"	: 80
	}
};

//log.info("deeply_concerned_citizen.js LOADED");

// generated ok (NO DATE)
