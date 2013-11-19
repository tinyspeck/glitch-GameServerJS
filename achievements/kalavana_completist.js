var name		= "Kalavana Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Kalavana";
var status_text		= "You delved the depths of Kalavanan firebogginess and plodded down every murky strip: WOO! You've been awarded the title Kalavana Completist. Not many Glitches can say that. Apart from the other ones who have. They also can.";
var last_published	= 1350066312;
var is_shareworthy	= 1;
var url		= "kalavana-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-20\/kalavana_completist_1316577438.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-20\/kalavana_completist_1316577438_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-20\/kalavana_completist_1316577438_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-20\/kalavana_completist_1316577438_40.png";
function on_apply(pc){
	pc.quests_offer('where_the_blue_grew');
	
}
var conditions = {
	597 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_99",
		value	: "28"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("kalavana_completist.js LOADED");

// generated ok (NO DATE)
