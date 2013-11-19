var name		= "Uralia Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Uralia";
var status_text		= "They say size isn't everything, and as a dedicated Uralia Completist you can testify to that. Yes. You've roamed four streets… but what a glorious four streets they were. Quality, not quantity, eh?";
var last_published	= 1350066575;
var is_shareworthy	= 1;
var url		= "uralia-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/uralia_completist_1315685928.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/uralia_completist_1315685928_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/uralia_completist_1315685928_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/uralia_completist_1315685928_40.png";
function on_apply(pc){
	
}
var conditions = {
	493 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_51",
		value	: "4"
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 10
	}
};

//log.info("uralia_completist.js LOADED");

// generated ok (NO DATE)
