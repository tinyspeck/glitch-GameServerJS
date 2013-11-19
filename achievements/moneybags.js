var name		= "Moneybags";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Socked away 5,011 currants";
var status_text		= "Over 5,011 currants?! You are well on your way to being a person of considerable financial heft. Keep going.";
var last_published	= 1323923331;
var is_shareworthy	= 0;
var url		= "moneybags";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/moneybags_1304983967.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/moneybags_1304983967_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/moneybags_1304983967_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/moneybags_1304983967_40.png";
function on_apply(pc){
	
}
var conditions = {
	209 : {
		type	: "has_currants",
		value	: "5011"
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
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200
};

//log.info("moneybags.js LOADED");

// generated ok (NO DATE)
