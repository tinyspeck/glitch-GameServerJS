var name		= "Butterfly Whisperer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Administered 3 tickly butterfly massages.";
var status_text		= "Zoinks! You somehow persuaded 3 tricksy butterflies to yield to your tickly touch. What are you, some kind of Butterfly Whisperer? In fact: Yes. That's exactly what you are. Have a badge.";
var last_published	= 1349460325;
var is_shareworthy	= 1;
var url		= "butterfly-whisperer";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/butterfly_whisperer_1304983406.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/butterfly_whisperer_1304983406_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/butterfly_whisperer_1304983406_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/butterfly_whisperer_1304983406_40.png";
function on_apply(pc){
	
}
var conditions = {
	29 : {
		type	: "counter",
		group	: "butterflies",
		label	: "massaged",
		value	: "3"
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
	pc.stats_add_xp(round_to_5(50 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 50,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 10
	}
};

//log.info("butterfly_whisperer.js LOADED");

// generated ok (NO DATE)
