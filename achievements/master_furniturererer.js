var name		= "Master Furniturererer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Crafted 251 furniture items";
var status_text		= "Furniture trooper to the end, 251 pieces of furniture bear your stamp (and drops of your very own blood, sweat and tears). Here, take this badge, and have a nice lie down. Not on the furniture though. No no no.";
var last_published	= 1348801843;
var is_shareworthy	= 1;
var url		= "master-furniturererer";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/master_furniturererer_1339715842.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/master_furniturererer_1339715842_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/master_furniturererer_1339715842_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/master_furniturererer_1339715842_40.png";
function on_apply(pc){
	
}
var conditions = {
	743 : {
		type	: "counter",
		group	: "furniture_items",
		label	: "made",
		value	: "251"
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
	pc.stats_add_xp(round_to_5(1250 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(250 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1250,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 250
	}
};

//log.info("master_furniturererer.js LOADED");

// generated ok (NO DATE)
