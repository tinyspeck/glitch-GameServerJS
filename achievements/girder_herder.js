var name		= "Girder Herder";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Goaded 41 Girders into being";
var status_text		= "41 girders look to you and call you daddy. Or mommy. Or whatever word girders use for that kinda thing. Basically, you're as close to a god as you can get in the world of girders. Good on you, Girder Herder!";
var last_published	= 1348798822;
var is_shareworthy	= 1;
var url		= "girder-herder";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/girder_herder_1339698024.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/girder_herder_1339698024_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/girder_herder_1339698024_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/girder_herder_1339698024_40.png";
function on_apply(pc){
	
}
var conditions = {
	697 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "281",
		value	: "41"
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
	pc.stats_add_xp(round_to_5(900 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 900,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 150
	}
};

//log.info("girder_herder.js LOADED");

// generated ok (NO DATE)
