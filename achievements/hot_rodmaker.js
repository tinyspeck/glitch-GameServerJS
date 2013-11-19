var name		= "Hot Rodmaker";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Milled 67 metal rods";
var status_text		= "You turned formless base matter into a sturdy rod of gleaming metal, not once, but 67 times. Which is two less than 69. 69, Dude!";
var last_published	= 1348799167;
var is_shareworthy	= 1;
var url		= "hot-rodmaker";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hot_rodmaker_1339717674.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hot_rodmaker_1339717674_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hot_rodmaker_1339717674_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/hot_rodmaker_1339717674_40.png";
function on_apply(pc){
	
}
var conditions = {
	695 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "279",
		value	: "67"
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 50
	}
};

//log.info("hot_rodmaker.js LOADED");

// generated ok (NO DATE)
