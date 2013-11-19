var name		= "Egg Aficionado";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gently harvested 1009 Eggs";
var status_text		= "Eggs - they're not just for breakfast anymore.' This would be the battle cry of the Egg Aficionado... if Egg Aficionados were into battle crying. Mostly, though, they just quietly harvest Eggs. Welcome to the club.";
var last_published	= 1348797704;
var is_shareworthy	= 1;
var url		= "egg-aficianado";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_aficianado_1304984452.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_aficianado_1304984452_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_aficianado_1304984452_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/egg_aficianado_1304984452_40.png";
function on_apply(pc){
	
}
var conditions = {
	296 : {
		type	: "counter",
		group	: "trants_fruit_harvested",
		label	: "egg_plain",
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 60
	}
};

//log.info("egg_aficianado.js LOADED");

// generated ok (NO DATE)
