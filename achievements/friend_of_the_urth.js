var name		= "Friend of the Urth";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Made 53 wholesome Urth Blocks";
var status_text		= "From the dirt packed under your fingernails, the mud in your hair, and the ripe smell of Glitchly sweat emanating from your underpits, everyone knows you are a true Friend of the Urth. Also because you have this badge! Yay!";
var last_published	= 1340307652;
var is_shareworthy	= 0;
var url		= "friend-of-the-urth";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/friend_of_the_urth_1339698045.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/friend_of_the_urth_1339698045_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/friend_of_the_urth_1339698045_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/friend_of_the_urth_1339698045_40.png";
function on_apply(pc){
	
}
var conditions = {
	698 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "190",
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
	pc.stats_add_xp(round_to_5(300 * multiplier), true);
	pc.stats_add_favor_points("alph", round_to_5(60 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 300,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 60
	}
};

//log.info("friend_of_the_urth.js LOADED");

// generated ok (NO DATE)
