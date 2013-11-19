var name		= "Jammy Dodger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Artfully dodged 137 malevolent Juju Bandits";
var status_text		= "You ducked, you dived, you jumped and you ran like the wind, artfully outsmarting 137 Juju Bandits. You jammy little Juju-dodger, you.";
var last_published	= 1348801446;
var is_shareworthy	= 1;
var url		= "jammy-dodger";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/jammy_dodger_1315686137.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/jammy_dodger_1315686137_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/jammy_dodger_1315686137_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/jammy_dodger_1315686137_40.png";
function on_apply(pc){
	
}
var conditions = {
	574 : {
		type	: "counter",
		group	: "juju_bandits",
		label	: "escaped",
		value	: "137"
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

//log.info("jammy_dodger.js LOADED");

// generated ok (NO DATE)
