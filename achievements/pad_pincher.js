var name		= "Pad Pincher";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Braved papercuts to harvest Paper Trees 503 times";
var status_text		= "We give out a lot of random awards. This one, for harvesting your 503rd Paper Tree, is pretty much about par. And yet don't you still feel a teensy bit more special?";
var last_published	= 1348802197;
var is_shareworthy	= 1;
var url		= "pad-pincher";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/pad_pincher_1315686000.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/pad_pincher_1315686000_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/pad_pincher_1315686000_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/pad_pincher_1315686000_40.png";
function on_apply(pc){
	
}
var conditions = {
	521 : {
		type	: "counter",
		group	: "paper_tree",
		label	: "harvest",
		value	: "503"
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 450,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 60
	}
};

//log.info("pad_pincher.js LOADED");

// generated ok (NO DATE)
