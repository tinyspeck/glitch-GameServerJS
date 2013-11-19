var name		= "Groddle Heights Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Groddle Heights. Including a couple of secret ones.";
var status_text		= "From its tallest crest down to its weirdest crag, to its two most secret crannies, you've explored every last nook of Groddle Heights, with not even a cheap little plastic souvenir cliff to show for it. You do, however, get the title of Groddle Heights Completist. That counts for something, right?";
var last_published	= 1350066021;
var is_shareworthy	= 1;
var url		= "groddle-heights-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/groddle_heights_completist_1315685895.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/groddle_heights_completist_1315685895_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/groddle_heights_completist_1315685895_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/groddle_heights_completist_1315685895_40.png";
function on_apply(pc){
	
}
var conditions = {
	484 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_64",
		value	: "22"
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 25
	}
};

//log.info("groddle_heights_completist.js LOADED");

// generated ok (NO DATE)
