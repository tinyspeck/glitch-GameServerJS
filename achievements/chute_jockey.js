var name		= "Chute Jockey";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Rode the subway rails 503 times";
var status_text		= "You've taken the subway 503 times while still retaining your childlike love of Glitch-manity. That deserves a reward. And that reward will be this Chute Jockey badge.";
var last_published	= 1348797081;
var is_shareworthy	= 1;
var url		= "chute-jockey";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/chute_jockey_1315686090.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/chute_jockey_1315686090_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/chute_jockey_1315686090_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/chute_jockey_1315686090_40.png";
function on_apply(pc){
	
}
var conditions = {
	556 : {
		type	: "counter",
		group	: "transit",
		label	: "subways_entered",
		value	: "503"
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 200
	}
};

//log.info("chute_jockey.js LOADED");

// generated ok (NO DATE)
