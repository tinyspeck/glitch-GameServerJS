var name		= "Crackpot Infuser";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Created 253 Tinctures";
var status_text		= "You smushed herbs and hooch and other stuff into a thing far greater than the sum of its parts 253 times.";
var last_published	= 1348797373;
var is_shareworthy	= 1;
var url		= "crackpot-infuser";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-23\/crackpot_infuser_1337790236.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-23\/crackpot_infuser_1337790236_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-23\/crackpot_infuser_1337790236_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-05-23\/crackpot_infuser_1337790236_40.png";
function on_apply(pc){
	
}
var conditions = {
	640 : {
		type	: "counter",
		group	: "making_tool",
		label	: "tincturing_kit",
		value	: "253"
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 200
	}
};

//log.info("crackpot_infuser.js LOADED");

// generated ok (NO DATE)
