var name		= "Hen Hugger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Squoze 11 Chickens in a friendly sorta way.";
var status_text		= "Squeezing Chickens can be addictive. In a good way. This badge tells everyone in the world that you are an honorary Hen Hugger.";
var last_published	= 1349313858;
var is_shareworthy	= 1;
var url		= "hen-hugger";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_1304984169.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_1304984169_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_1304984169_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_1304984169_40.png";
function on_apply(pc){
	
}
var conditions = {
	246 : {
		type	: "counter",
		group	: "chicken",
		label	: "squoze",
		value	: "11"
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(10 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 75,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 10
	}
};

//log.info("hen_hugger.js LOADED");

// generated ok (NO DATE)
