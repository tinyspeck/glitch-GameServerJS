var name		= "Chatterbox";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Chatted with 11 different players";
var status_text		= "You've got a real gift for gab. You've earned a Chatterbox badge!";
var last_published	= 1323924521;
var is_shareworthy	= 0;
var url		= "chatterbox";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/chatterbox_1316406752.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/chatterbox_1316406752_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/chatterbox_1316406752_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-18\/chatterbox_1316406752_40.png";
function on_apply(pc){
	
}
var conditions = {
	217 : {
		type	: "group_count",
		group	: "talked_to",
		value	: "11"
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 30
	}
};

//log.info("chatterbox.js LOADED");

// generated ok (NO DATE)
