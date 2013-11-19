var name		= "Epic Blowout";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Attended a house party containing 11 guests under the influence.";
var status_text		= "Woah. That was a party to remember. Or not, as the case may be. The memories from your Epic Blowout may be hazy, but you know what isn't? This awesome badge. YEAH.";
var last_published	= 1348797761;
var is_shareworthy	= 1;
var url		= "epic-blowout";
var category		= "social";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/epic_blowout_1339718078.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/epic_blowout_1339718078_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/epic_blowout_1339718078_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/epic_blowout_1339718078_40.png";
function on_apply(pc){
	
}
var conditions = {
	769 : {
		type	: "counter",
		group	: "attended_party",
		label	: "blowout",
		value	: "1"
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
	pc.stats_add_favor_points("friendly", round_to_5(175 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 175
	}
};

//log.info("epic_blowout.js LOADED");

// generated ok (NO DATE)
