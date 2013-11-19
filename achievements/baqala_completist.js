var name		= "Baqala Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Baqala";
var status_text		= "From east to west, north to south (if only those directions meant the same here as they do wherever you're from), you've criss-crossed the grid of perilous pathways, all the time bearing the weight of overwhelming ancestral nostalgia for just long enough to earn the title: Baqala Completist. You're amazing.";
var last_published	= 1350065458;
var is_shareworthy	= 1;
var url		= "baqala-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/baqala_completist_1315685935.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/baqala_completist_1315685935_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/baqala_completist_1315685935_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/baqala_completist_1315685935_40.png";
function on_apply(pc){
	
}
var conditions = {
	497 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_86",
		value	: "41"
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
	pc.stats_add_favor_points("lem", round_to_5(50 * multiplier));
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
		"giant"		: "lem",
		"points"	: 50
	}
};

//log.info("baqala_completist.js LOADED");

// generated ok (NO DATE)
