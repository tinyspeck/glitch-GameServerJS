var name		= "Haoma Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Haoma";
var status_text		= "Oh man! Is it ever fun watching you bounce around Haoma like a chicken with a bit too much No-no! I am thoroughly entertained and in the end, that's all that really matters, right? Here's a tip for you good glitch. Enjoy.";
var last_published	= 1350066106;
var is_shareworthy	= 1;
var url		= "haoma-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/haoma_completist_1347052794.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/haoma_completist_1347052794_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/haoma_completist_1347052794_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/haoma_completist_1347052794_40.png";
function on_apply(pc){
	
}
var conditions = {
	792 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_131",
		value	: "20"
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
	pc.stats_add_favor_points("lem", round_to_5(100 * multiplier));
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
		"giant"		: "lem",
		"points"	: 100
	}
};

//log.info("haoma_completist.js LOADED");

// generated ok (NO DATE)
