var name		= "Swine Snuggler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Gave 41 piggies a thorough patdown";
var status_text		= "Petting piggies never gets boar-ing for you. You are hereby an honorary Swine Snuggler.";
var last_published	= 1348802901;
var is_shareworthy	= 1;
var url		= "swine-snuggler";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/swine_snuggler_1304983769.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/swine_snuggler_1304983769_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/swine_snuggler_1304983769_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/swine_snuggler_1304983769_40.png";
function on_apply(pc){
	
}
var conditions = {
	174 : {
		type	: "counter",
		group	: "npc_piggy",
		label	: "pet",
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(20 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 20
	}
};

//log.info("swine_snuggler.js LOADED");

// generated ok (NO DATE)
