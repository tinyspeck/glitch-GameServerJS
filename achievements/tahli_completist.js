var name		= "Tahli Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Tahli";
var status_text		= "Aww, so Cute! The sloths I mean. Not that I'm saying you're ugly or anything, it's just that, well uh … here, have this convenient Tahli completist badge I just found.";
var last_published	= 1350066552;
var is_shareworthy	= 1;
var url		= "tahli-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-19\/tahli_completist_1324347505.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-19\/tahli_completist_1324347505_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-19\/tahli_completist_1324347505_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-12-19\/tahli_completist_1324347505_40.png";
function on_apply(pc){
	
}
var conditions = {
	663 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_113",
		value	: "28"
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

//log.info("tahli_completist.js LOADED");

// generated ok (NO DATE)
