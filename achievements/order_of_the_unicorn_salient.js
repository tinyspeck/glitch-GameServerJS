var name		= "Order of the Unicorn Salient";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Won 251 Games";
var status_text		= "People speak in hushed tones of members of the Order of the Unicorn Salient, because they say that only those who have won Game of Crowns 251 times are allowed into the order. Today, fresh unicorn, that door opened to you.";
var last_published	= 1348802186;
var is_shareworthy	= 1;
var url		= "order-of-the-unicorn-salient";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_unicorn_salient_1315512133.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_unicorn_salient_1315512133_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_unicorn_salient_1315512133_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_unicorn_salient_1315512133_40.png";
function on_apply(pc){
	
}
var conditions = {
	590 : {
		type	: "counter",
		group	: "it_game",
		label	: "won",
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
	pc.stats_add_favor_points("friendly", round_to_5(225 * multiplier));
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
		"giant"		: "friendly",
		"points"	: 225
	}
};

//log.info("order_of_the_unicorn_salient.js LOADED");

// generated ok (NO DATE)
