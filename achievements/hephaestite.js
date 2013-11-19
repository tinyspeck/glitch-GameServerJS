var name		= "Hephaestite";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Smelted 1009 Metal Ingots from purest Metal Rock";
var status_text		= "A-smeltering you did go, a-smeltering you did go, high-ho the derry-o, a-smeltering you did go. We hope you enjoyed this brief lyrical moment, along with your new Hephaestite badge.";
var last_published	= 1348799129;
var is_shareworthy	= 1;
var url		= "hephaestite";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/hephaestite_1315686083.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/hephaestite_1315686083_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/hephaestite_1315686083_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/hephaestite_1315686083_40.png";
function on_apply(pc){
	
}
var conditions = {
	552 : {
		type	: "counter",
		group	: "smelter",
		label	: "ingots_created",
		value	: "1009"
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 175
	}
};

//log.info("hephaestite.js LOADED");

// generated ok (NO DATE)
