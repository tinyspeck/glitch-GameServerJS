var name		= "Dust-Busting Trigger-Trappist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Trippingly triggered 127 Dust Traps";
var status_text		= "To trigger 126 Dust Traps might be mistaken for coincidence, but 127? That's badge-worthy. Here's your badge.";
var last_published	= 1348797694;
var is_shareworthy	= 1;
var url		= "dust-busting-trigger-trappist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dust_busting_trigger_trappist_1315686129.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dust_busting_trigger_trappist_1315686129_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dust_busting_trigger_trappist_1315686129_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/dust_busting_trigger_trappist_1315686129_40.png";
function on_apply(pc){
	
}
var conditions = {
	571 : {
		type	: "counter",
		group	: "dust_trap",
		label	: "trigger",
		value	: "127"
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
	pc.stats_add_favor_points("lem", round_to_5(125 * multiplier));
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
		"giant"		: "lem",
		"points"	: 125
	}
};

//log.info("dust_busting_trigger_trappist.js LOADED");

// generated ok (NO DATE)
