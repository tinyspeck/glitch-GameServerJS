var name		= "Subwayfarer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Rode the subway rails 23 times";
var status_text		= "Why walk when you can ride? And why ride anything else, when you can ride the subway? Good questions, these. As a bonafide Subwayfarer, you can ponder them before your next stop.";
var last_published	= 1315936648;
var is_shareworthy	= 0;
var url		= "subwayfarer";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/subwayfarer_1315686086.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/subwayfarer_1315686086_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/subwayfarer_1315686086_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/subwayfarer_1315686086_40.png";
function on_apply(pc){
	
}
var conditions = {
	553 : {
		type	: "counter",
		group	: "transit",
		label	: "subways_entered",
		value	: "23"
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
	pc.stats_add_favor_points("lem", round_to_5(30 * multiplier));
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
		"giant"		: "lem",
		"points"	: 30
	}
};

//log.info("subwayfarer.js LOADED");

// generated ok (NO DATE)
