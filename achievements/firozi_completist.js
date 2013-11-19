var name		= "Firozi Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Firozi";
var status_text		= "Ventured through the whole place, you did! You explored every last inch of Firozi. Wow. It did take you a while though. I used that time to come up with a way to express how awesome you are. In the end, I got nothin'. So here's a shiny badge instead!";
var last_published	= 1350065978;
var is_shareworthy	= 1;
var url		= "firozi-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/firozi_completist_1347067599.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/firozi_completist_1347067599_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/firozi_completist_1347067599_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-09-07\/firozi_completist_1347067599_40.png";
function on_apply(pc){
	
}
var conditions = {
	795 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_114",
		value	: "26"
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
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("firozi_completist.js LOADED");

// generated ok (NO DATE)
