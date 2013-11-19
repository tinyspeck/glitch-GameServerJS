var name		= "Bubble Collector";
var collection_type	= 1;
var is_secret		= 0;
var desc		= "Collected all 4 bubbles";
var status_text		= "Mmm..Bop!";
var last_published	= 1323933928;
var is_shareworthy	= 0;
var url		= "bubble-collector";
var category		= "trophies";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_bubbles_1304983629.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_bubbles_1304983629_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_bubbles_1304983629_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/collection_bubbles_1304983629_40.png";
function on_apply(pc){
	
}
var conditions = {
	86 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "hard_bubble",
		value	: "1"
	},
	87 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "plain_bubble",
		value	: "1"
	},
	88 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "tiny_bubble",
		value	: "1"
	},
	89 : {
		type	: "counter",
		group	: "in_inventory",
		label	: "blue_bubble",
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
	pc.stats_add_xp(round_to_5(50 * multiplier), true);
	pc.stats_add_currants(round_to_5(50 * multiplier));
	pc.metabolics_add_mood(round_to_5(20 * multiplier));
	pc.metabolics_add_energy(round_to_5(20 * multiplier));
	pc.createItemFromFamiliar("trophy_bubble", 1);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"		: 50,
	"currants"	: 50,
	"mood"		: 20,
	"energy"	: 20,
	"items"		: {
		"0"	: {
			"class_id"	: "trophy_bubble",
			"label"		: "Bubble Trophy",
			"count"		: "1"
		}
	}
};

//log.info("collection_bubbles.js LOADED");

// generated ok (NO DATE)
