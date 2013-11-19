var name		= "Tool Artiste";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Painstakingly crafted 283 tools with a Tinkertool";
var status_text		= "When you've made 283 tools, you've moved beyond mere tool making and into the realm of tool artistry. Here's your Tool Artiste badge. Your beret is in the mail.";
var last_published	= 1348802938;
var is_shareworthy	= 1;
var url		= "tool-artiste";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/tool_artiste_1315686122.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/tool_artiste_1315686122_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/tool_artiste_1315686122_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/tool_artiste_1315686122_40.png";
function on_apply(pc){
	
}
var conditions = {
	568 : {
		type	: "counter",
		group	: "making_tool",
		label	: "tinkertool",
		value	: "283"
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
	pc.stats_add_favor_points("alph", round_to_5(100 * multiplier));
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
		"giant"		: "alph",
		"points"	: 100
	}
};

//log.info("tool_artiste.js LOADED");

// generated ok (NO DATE)
