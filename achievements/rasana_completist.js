var name		= "Rasana Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Rasana";
var status_text		= "The Rasana Gorge has revealed its secrets to you, from the thrill of its edge to the surprising mini climate at its bottom. You're not only a Rasana completist, you're the foremost Rasana expert. But you only get a badge for the completist bit. Hurrah!";
var last_published	= 1350066492;
var is_shareworthy	= 1;
var url		= "rasana-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-28\/rasana_completist_1322501264.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-28\/rasana_completist_1322501264_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-28\/rasana_completist_1322501264_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-28\/rasana_completist_1322501264_40.png";
function on_apply(pc){
	
}
var conditions = {
	655 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_109",
		value	: "37"
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 50
	}
};

//log.info("rasana_completist.js LOADED");

// generated ok (NO DATE)
