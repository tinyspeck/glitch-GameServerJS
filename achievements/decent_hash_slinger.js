var name		= "Decent Hash Slinger";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Fried up 11 meals with a Frying Pan.";
var status_text		= "You're coming along in the hash-slinging department. Here's a Decent Hash Slinger badge to prove it. And remember: When in doubt, just add butter.";
var last_published	= 1349313872;
var is_shareworthy	= 1;
var url		= "decent-hash-slinger";
var category		= "cooking";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/decent_hash_slinger_1352232446.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/decent_hash_slinger_1352232446_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/decent_hash_slinger_1352232446_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-06\/decent_hash_slinger_1352232446_40.png";
function on_apply(pc){
	
}
var conditions = {
	24 : {
		type	: "counter",
		group	: "making_known_tool",
		label	: "frying_pan",
		value	: "11"
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
	pc.stats_add_xp(round_to_5(75 * multiplier), true);
	pc.stats_add_favor_points("pot", round_to_5(10 * multiplier));
	pc.making_try_learn_recipe(89);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 75,
	"favor"		: {
		"giant"		: "pot",
		"points"	: 10
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "89",
			"label"		: "Green Eggs",
			"id"		: 89
		}
	}
};

//log.info("decent_hash_slinger.js LOADED");

// generated ok (NO DATE)
