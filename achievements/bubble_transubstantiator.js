var name		= "Bubble Transubstantiator";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Converted an almost inconceivable 2003 Bubbles";
var status_text		= "Your deftness in wielding a Bubble Tuner has spread throughout the land. Proclaim your Bubble mastery from the rooftops with your new Bubble Transubstantiator badge in hand.";
var last_published	= 1348796837;
var is_shareworthy	= 1;
var url		= "bubble-transubstantiator";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_transubstantiator_1304984358.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_transubstantiator_1304984358_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_transubstantiator_1304984358_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_transubstantiator_1304984358_40.png";
function on_apply(pc){
	
}
var conditions = {
	279 : {
		type	: "counter",
		group	: "making_tool",
		label	: "bubble_tuner",
		value	: "2003"
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
	pc.stats_add_xp(round_to_5(800 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(175 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 800,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 175
	}
};

//log.info("bubble_transubstantiator.js LOADED");

// generated ok (NO DATE)
