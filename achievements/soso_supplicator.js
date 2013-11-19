var name		= "So-So Supplicator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Donated to Shrines 53 times";
var status_text		= "When it comes to donating to Shrines, you're a-give'rin' but you're not quite a-quiverin'. At this point, the best title we can award you is So-So Supplicant.";
var last_published	= 1316419684;
var is_shareworthy	= 0;
var url		= "soso-supplicator";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/soso_supplicator_1316419711.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/soso_supplicator_1316419711_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/soso_supplicator_1316419711_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-19\/soso_supplicator_1316419711_40.png";
function on_apply(pc){
	
}
var conditions = {
	354 : {
		type	: "group_sum",
		group	: "shrines_donated",
		value	: "53"
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
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400
};

//log.info("soso_supplicator.js LOADED");

// generated ok (NO DATE)
