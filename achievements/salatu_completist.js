var name		= "Salatu Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Salatu";
var status_text		= "On hearing the words \"Yariam Jam\", some people might reach for the bread and peanut butter. But not you, Peanut, because you're well travelled enough to know every corner of Salatu. That's what makes you a Salatu Completist. Go you!";
var last_published	= 1350066518;
var is_shareworthy	= 1;
var url		= "salatu-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/salatu_completist_1317703263.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/salatu_completist_1317703263_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/salatu_completist_1317703263_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/salatu_completist_1317703263_40.png";
function on_apply(pc){
	
}
var conditions = {
	603 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_93",
		value	: "32"
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

//log.info("salatu_completist.js LOADED");

// generated ok (NO DATE)
