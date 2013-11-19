var name		= "Callopee Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Callopee";
var status_text		= "You wove through the treacherous pointy uppy-downy spiky rocks, burrowed through locked doors, chipped away at every dead end and lived to tell the tale. The tale entitled \"How I Became A Callopee Completist\".";
var last_published	= 1350065515;
var is_shareworthy	= 1;
var url		= "callopee-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-21\/callopee_completist_1319236018.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-21\/callopee_completist_1319236018_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-21\/callopee_completist_1319236018_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-21\/callopee_completist_1319236018_40.png";
function on_apply(pc){
	
}
var conditions = {
	606 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_107",
		value	: "20"
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
	pc.stats_add_favor_points("lem", round_to_5(40 * multiplier));
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
		"giant"		: "lem",
		"points"	: 40
	}
};

//log.info("callopee_completist.js LOADED");

// generated ok (NO DATE)
