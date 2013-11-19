var name		= "Shriner Forty-Niner";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Dug deep and donated to Shrines 1049 times";
var status_text		= "You've just earned the designation Shriner Forty-Niner! Though, technically, you've donated to 1049 Shrines. Let's not get into the technicalities.";
var last_published	= 1348802555;
var is_shareworthy	= 1;
var url		= "shriner-fortyniner";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/shriner_fortyniner_1316419714.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/shriner_fortyniner_1316419714_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/shriner_fortyniner_1316419714_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/shriner_fortyniner_1316419714_40.png";
function on_apply(pc){
	
}
var conditions = {
	356 : {
		type	: "group_sum",
		group	: "shrines_donated",
		value	: "1049"
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700
};

//log.info("shriner_fortyniner.js LOADED");

// generated ok (NO DATE)
