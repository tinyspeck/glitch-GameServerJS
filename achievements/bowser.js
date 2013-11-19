var name		= "Bowser";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Refueled 5 machines in other players' home streets or yards, or machine rooms";
var status_text		= "You're like the friendly neighbourhood gas pump, refuelling machines for all and sundry. For your generosity, gentle Bowser, a badge. Bravo!";
var last_published	= 1348796821;
var is_shareworthy	= 1;
var url		= "bowser";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bowser_1339713867.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bowser_1339713867_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bowser_1339713867_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/bowser_1339713867_40.png";
function on_apply(pc){
	
}
var conditions = {
	700 : {
		type	: "counter",
		group	: "machines",
		label	: "refueled_for_others",
		value	: "5"
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
	pc.stats_add_favor_points("alph", round_to_5(65 * multiplier));
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
		"giant"		: "alph",
		"points"	: 65
	}
};

//log.info("bowser.js LOADED");

// generated ok (NO DATE)
