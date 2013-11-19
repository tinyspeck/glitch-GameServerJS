var name		= "Total Tool";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Painstakingly crafted 503 tools with a Tinkertool";
var status_text		= "Tools are very useful things. You've made 503 of them, making you a very useful thing-maker. Or, as we prefer to say, a Total Tool.";
var last_published	= 1348802950;
var is_shareworthy	= 1;
var url		= "total-tool";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/total_tool_1315686124.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/total_tool_1315686124_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/total_tool_1315686124_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/total_tool_1315686124_40.png";
function on_apply(pc){
	
}
var conditions = {
	569 : {
		type	: "counter",
		group	: "making_tool",
		label	: "tinkertool",
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
	pc.stats_add_favor_points("alph", round_to_5(200 * multiplier));
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
		"giant"		: "alph",
		"points"	: 200
	}
};

//log.info("total_tool.js LOADED");

// generated ok (NO DATE)
