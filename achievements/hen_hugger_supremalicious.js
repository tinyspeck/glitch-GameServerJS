var name		= "Hen Hugger Supremalicious";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Squoze 137 Chickens in a friendly sorta way";
var status_text		= "Sure, you've squozen 137 chickens, but you didn't do it for the glory - you did it for the love. Which is why the Chickens want you to have this Hen Hugger Supremalicious badge.";
var last_published	= 1348799124;
var is_shareworthy	= 1;
var url		= "hen-hugger-supremalicious";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_supremalicious_1304984180.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_supremalicious_1304984180_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_supremalicious_1304984180_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/hen_hugger_supremalicious_1304984180_40.png";
function on_apply(pc){
	
}
var conditions = {
	248 : {
		type	: "counter",
		group	: "chicken",
		label	: "squoze",
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
	pc.stats_add_xp(round_to_5(400 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(50 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 50
	}
};

//log.info("hen_hugger_supremalicious.js LOADED");

// generated ok (NO DATE)
