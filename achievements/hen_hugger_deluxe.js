var name		= "Hen Hugger Deluxe";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Squoze 41 Chickens in a friendly sorta way";
var status_text		= "You know what's better than being a Hen Hugger? Being a Hen Hugger Deluxe, which you can only be after squeezing 41 chickens. This badge is for you.";
var last_published	= 1348799119;
var is_shareworthy	= 1;
var url		= "hen-hugger-deluxe";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_deluxe_1304984174.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_deluxe_1304984174_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_deluxe_1304984174_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_deluxe_1304984174_40.png";
function on_apply(pc){
	
}
var conditions = {
	247 : {
		type	: "counter",
		group	: "chicken",
		label	: "squoze",
		value	: "41"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 25
	}
};

//log.info("hen_hugger_deluxe.js LOADED");

// generated ok (NO DATE)
