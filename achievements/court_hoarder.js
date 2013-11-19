var name		= "Court Hoarder";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Crafted 53 Storage Display Boxes";
var status_text		= "Every good hoarder loves a good Storage Display Box. You court the love of those hoarders, by making beautiful boxes. 53 of them! Take a badge and a bow, you gorgeous Court Hoarder you.";
var last_published	= 1348797368;
var is_shareworthy	= 1;
var url		= "court-hoarder";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/court_hoarder_1339722211.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/court_hoarder_1339722211_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/court_hoarder_1339722211_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/court_hoarder_1339722211_40.png";
function on_apply(pc){
	
}
var conditions = {
	704 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "255",
		value	: "53"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 150
	}
};

//log.info("court_hoarder.js LOADED");

// generated ok (NO DATE)
