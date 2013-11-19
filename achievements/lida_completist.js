var name		= "Lida Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Lida";
var status_text		= "What's green and pleasant and meadowy, has some uppy-downy bits, and is a region you happen to have explored every corner of? Yes! Lida. And to prove it, here's your Lida Completist Badge. You're welcome.";
var last_published	= 1350581892;
var is_shareworthy	= 1;
var url		= "lida-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-21\/lida_completist_1319236024.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-21\/lida_completist_1319236024_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-21\/lida_completist_1319236024_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-21\/lida_completist_1319236024_40.png";
function on_apply(pc){
	
}
var conditions = {
	610 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_105",
		value	: "27"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("lida_completist.js LOADED");

// generated ok (NO DATE)
