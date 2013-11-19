var name		= "Noise-Bringer";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Made metal music for sloths";
var status_text		= "For rocking the sloth, an unconvincing air guitar salute to you, Noise-Bringer: Widdly-widdly-widdy-widdly-weeee! You brought the noise! Have a badge!";
var last_published	= 1348801937;
var is_shareworthy	= 1;
var url		= "noisebringer";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/noisebringer_1339712660.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/noisebringer_1339712660_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/noisebringer_1339712660_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/noisebringer_1339712660_40.png";
function on_apply(pc){
	
}
var conditions = {
	790 : {
		type	: "counter",
		group	: "sloths",
		label	: "played_music_for",
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("zille", round_to_5(80 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "zille",
		"points"	: 80
	}
};

//log.info("noisebringer.js LOADED");

// generated ok (NO DATE)
