var name		= "Numismatizer, Leprechaun Class";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Collected 100 quoins a day for 5 game days in a row";
var status_text		= "Whoa-hoa! You've picked up 100 quoins for 5 days in a row now. You've earned the title Numismatizer, Leprechaun Class.";
var last_published	= 1348801954;
var is_shareworthy	= 1;
var url		= "numismatizer-leprechaun-class";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/numismatizer_leprechaun_class_1315685863.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/numismatizer_leprechaun_class_1315685863_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/numismatizer_leprechaun_class_1315685863_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/numismatizer_leprechaun_class_1315685863_40.png";
function on_apply(pc){
	
}
var conditions = {
	476 : {
		type	: "counter",
		group	: "coin_count",
		label	: "days_maxed",
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
	pc.stats_add_xp(round_to_5(450 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(60 * multiplier));
	pc.making_try_learn_recipe(241);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 450,
	"favor"		: {
		"giant"		: "lem",
		"points"	: 60
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "241",
			"label"		: "Elixir of Avarice",
			"id"		: 241
		}
	}
};

//log.info("numismatizer_leprechaun_class.js LOADED");

// generated ok (NO DATE)
