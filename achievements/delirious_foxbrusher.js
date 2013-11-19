var name		= "Delirious Foxbrusher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Brushed 10,009 fibers from the tails of foxes";
var status_text		= "No wonder Ur's foxes are looking grumpy and a little threadbare: you've deliriously brushed 10,009 fibers from their tails. Wowzers! Have a badge!";
var last_published	= 1348797464;
var is_shareworthy	= 1;
var url		= "delirious-foxbrusher";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/delirious_foxbrusher_1339701057.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/delirious_foxbrusher_1339701057_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/delirious_foxbrusher_1339701057_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/delirious_foxbrusher_1339701057_40.png";
function on_apply(pc){
	
}
var conditions = {
	735 : {
		type	: "counter",
		group	: "fox",
		label	: "fibers_brushed",
		value	: "10009"
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
	pc.stats_add_xp(round_to_5(600 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(100 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 600,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 100
	}
};

//log.info("delirious_foxbrusher.js LOADED");

// generated ok (NO DATE)
