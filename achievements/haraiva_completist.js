var name		= "Haraiva Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Haraiva.";
var status_text		= "Gasp! You've climbed and leaped your way up the beautiful and jagged, snowy peaks of Skyr- er, I mean Haraiva! Would've been easier with a gravity-defying horse though. Huh? No, of course that was a joke! Everyone knows horses are just a myth!";
var last_published	= 1354139883;
var is_shareworthy	= 1;
var url		= "haraiva-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-03-20\/haraiva_completist_1332294024.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-03-20\/haraiva_completist_1332294024_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-03-20\/haraiva_completist_1332294024_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-03-20\/haraiva_completist_1332294024_40.png";
function on_apply(pc){
	
}
var conditions = {
	665 : {
		type	: "group_count",
		group	: "streets_visited_in_hub_116",
		value	: "19"
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

//log.info("haraiva_completist.js LOADED");

// generated ok (NO DATE)
