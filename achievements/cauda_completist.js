var name		= "Cauda Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Cauda";
var status_text		= "I sure wish I could give those foxes a good brushing! You make it look like so much fun … the way you pretend to miss with your brush all the time and how the bait sometimes lands on your head after it explodes. I am honored to present you with this complimentary Cauda completist badge!";
var last_published	= 1350065526;
var is_shareworthy	= 1;
var url		= "cauda-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/cauda_completist_1335307190.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/cauda_completist_1335307190_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/cauda_completist_1335307190_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/cauda_completist_1335307190_40.png";
function on_apply(pc){
	
}
var conditions = {
	668 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_120",
		value	: "18"
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

//log.info("cauda_completist.js LOADED");

// generated ok (NO DATE)
