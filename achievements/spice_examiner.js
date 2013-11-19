var name		= "Spice Examiner";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Carefully scrutinized every spice in existence";
var status_text		= "You've sniffed, snorted, scrutinized, studied, flattered, rubbed and loved your way through every spice. If anyone deserves the Spice Examiner badge, it's you.";
var last_published	= 1352766242;
var is_shareworthy	= 1;
var url		= "spice-examiner";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/spice_examiner_1304983669.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/spice_examiner_1304983669_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/spice_examiner_1304983669_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/spice_examiner_1304983669_40.png";
function on_apply(pc){
	
}
var conditions = {
	73 : {
		type	: "counter",
		group	: "black_pepper",
		label	: "sniff",
		value	: "1"
	},
	74 : {
		type	: "counter",
		group	: "cumin",
		label	: "lick",
		value	: "1"
	},
	75 : {
		type	: "counter",
		group	: "curry",
		label	: "scrutinize",
		value	: "1"
	},
	76 : {
		type	: "counter",
		group	: "ginger",
		label	: "sniff",
		value	: "1"
	},
	77 : {
		type	: "counter",
		group	: "camphor",
		label	: "study",
		value	: "1"
	},
	78 : {
		type	: "counter",
		group	: "cardamom",
		label	: "watch",
		value	: "1"
	},
	79 : {
		type	: "counter",
		group	: "all_spice",
		label	: "consider",
		value	: "1"
	},
	80 : {
		type	: "counter",
		group	: "hot_pepper",
		label	: "blow_on",
		value	: "1"
	},
	81 : {
		type	: "counter",
		group	: "licorice",
		label	: "flatter",
		value	: "1"
	},
	82 : {
		type	: "counter",
		group	: "mustard",
		label	: "plaster",
		value	: "1"
	},
	83 : {
		type	: "counter",
		group	: "nutmeg",
		label	: "rub",
		value	: "1"
	},
	84 : {
		type	: "counter",
		group	: "older_spice",
		label	: "gaze_at",
		value	: "1"
	},
	85 : {
		type	: "counter",
		group	: "saffron",
		label	: "love",
		value	: "1"
	},
	150 : {
		type	: "counter",
		group	: "cinnamon",
		label	: "pinch",
		value	: "1"
	},
	151 : {
		type	: "counter",
		group	: "garlic",
		label	: "eat",
		value	: "1"
	},
	152 : {
		type	: "counter",
		group	: "turmeric",
		label	: "palpitate",
		value	: "1"
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
	pc.stats_add_favor_points("spriggan", round_to_5(20 * multiplier));
	pc.making_try_learn_recipe(47);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 200,
	"favor"		: {
		"giant"		: "spriggan",
		"points"	: 20
	},
	"recipes"	: {
		"0"	: {
			"recipe_id"	: "47",
			"label"		: "Onion Sauce",
			"id"		: 47
		}
	}
};

//log.info("spice_examiner.js LOADED");

// generated ok (NO DATE)
