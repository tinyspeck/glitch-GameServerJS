var name		= "Toolie Apprentice";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Painstakingly crafted 17 tools with a Tinkertool";
var status_text		= "You, friend, are a dab hand with the Tinkertool, as evidenced by the many fine and powerful tools you have created. Please accept the designation Toolie Apprentice.";
var last_published	= 1323922348;
var is_shareworthy	= 0;
var url		= "toolie-apprentice";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/toolie_apprentice_1315686114.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/toolie_apprentice_1315686114_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/toolie_apprentice_1315686114_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/toolie_apprentice_1315686114_40.png";
function on_apply(pc){
	
}
var conditions = {
	565 : {
		type	: "counter",
		group	: "making_tool",
		label	: "tinkertool",
		value	: "17"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 25
	}
};

//log.info("toolie_apprentice.js LOADED");

// generated ok (NO DATE)
