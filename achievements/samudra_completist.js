var name		= "Samudra Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Samudra";
var status_text		= "Blub blub blub, it's bright in this tub. Hey, what get's darker AND brighter at the same time? That's right! Samudra does! I'm not even sure how you got around this whole place but it seems like I should give you something worthwhile for doing it. But since I don't have anything like that, I'll give you this badge instead.";
var last_published	= 1353545323;
var is_shareworthy	= 1;
var url		= "samudra-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-18\/samudra_completist_1353295420.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-18\/samudra_completist_1353295420_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-18\/samudra_completist_1353295420_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-18\/samudra_completist_1353295420_40.png";
function on_apply(pc){
	
}
var conditions = {
	871 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_140",
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_currants(round_to_5(200 * multiplier));
	pc.stats_add_favor_points("lem", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 250,
	"currants"	: 200,
	"favor"		: {
		"giant"		: "lem",
		"points"	: 30
	}
};

//log.info("samudra_completist.js LOADED");

// generated ok (NO DATE)
