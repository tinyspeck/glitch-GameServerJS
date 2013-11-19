var name		= "Dedicated Restorationizer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wore out and restored the same cultivated item 20 times";
var status_text		= "On your watch, every cultivation project can breathe easy: especially this one - you've restored it 20 times, giving it the maximum lifespan of 200%. This cultivation project basically worships you. Have a badge!";
var last_published	= 1348797445;
var is_shareworthy	= 1;
var url		= "dedicated-restorationizer";
var category		= "cultivation";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/dedicated_restorationizer_1339726916.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/dedicated_restorationizer_1339726916_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/dedicated_restorationizer_1339726916_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/dedicated_restorationizer_1339726916_40.png";
function on_apply(pc){
	
}
var conditions = {
	789 : {
		type	: "counter",
		group	: "cultivation",
		label	: "times_restored",
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
	pc.stats_add_xp(round_to_5(2000 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(400 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 2000,
	"favor"	: {
		"giant"		: "mab",
		"points"	: 400
	}
};

//log.info("dedicated_restorationizer.js LOADED");

// generated ok (NO DATE)
