var name		= "Certified Boozehound";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wet your whistle 41 times";
var status_text		= "You can sniff out a snifter of booze at fifty planks and snaffle it before anyone has the chance to say \"Cheers!\". You're a Certified Boozehound and have the badge to prove it. Prost!";
var last_published	= 1349460967;
var is_shareworthy	= 1;
var url		= "certified-boozehound";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/certified_boozehound_1304983586.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/certified_boozehound_1304983586_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/certified_boozehound_1304983586_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/certified_boozehound_1304983586_40.png";
function on_apply(pc){
	
}
var conditions = {
	421 : {
		type	: "counter",
		group	: "items_drank",
		label	: "alcohol",
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(30 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 30
	}
};

//log.info("certified_boozehound.js LOADED");

// generated ok (NO DATE)
