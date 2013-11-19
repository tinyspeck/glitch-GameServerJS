var name		= "Gloopmeister";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Unsqueamishly scooped 1009 quivering Jellisac clumps";
var status_text		= "Scooping up 1009 Jellisacs isn't exactly difficult. It's not like they put up a fight or anything. But still, noteworthy! Consider it duly noted with this coveted Gloopmeister badge.";
var last_published	= 1348798831;
var is_shareworthy	= 1;
var url		= "gloopmeister";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/gloopmeister_1315685990.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/gloopmeister_1315685990_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/gloopmeister_1315685990_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/gloopmeister_1315685990_40.png";
function on_apply(pc){
	
}
var conditions = {
	518 : {
		type	: "counter",
		group	: "jellisac",
		label	: "scoop",
		value	: "1009"
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
	pc.stats_add_favor_points("grendaline", round_to_5(175 * multiplier));
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
		"giant"		: "grendaline",
		"points"	: 175
	}
};

//log.info("gloopmeister.js LOADED");

// generated ok (NO DATE)
