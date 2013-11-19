var name		= "Captain of the Anti-Temperance League";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Dutifully distilled 3331 Hooches in your back yard";
var status_text		= "Your name is whispered in disapproving tones by stern-looking teetotallers in big hats, but drinkers everywhere are grateful for your dutiful service. Unless you distilled all 3331 Hooches to drink yourself, in which case: Woah, dude. Prost!";
var last_published	= 1348797057;
var is_shareworthy	= 1;
var url		= "captain-of-the-anti-temperance-league";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/captain_of_the_anti_temperance_league_1321576683.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/captain_of_the_anti_temperance_league_1321576683_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/captain_of_the_anti_temperance_league_1321576683_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/captain_of_the_anti_temperance_league_1321576683_40.png";
function on_apply(pc){
	
}
var conditions = {
	638 : {
		type	: "counter",
		group	: "still",
		label	: "collected_in_pol",
		value	: "3331"
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
	pc.stats_add_xp(round_to_5(1250 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1250,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 250
	}
};

//log.info("captain_of_the_anti_temperance_league.js LOADED");

// generated ok (NO DATE)
