var name		= "Folivoria Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Folivoria";
var status_text		= "Holy sloth-knocker! They said you couldn't do it. Yup, every last one of them said you would never even be able to get close. But, you did it! You explored every cliff top, saw every sloth bandana and in the end you can finally say, \"Who's the sloth-knocker now?\" And, you get this nifty badge too.";
var last_published	= 1350065999;
var is_shareworthy	= 1;
var url		= "folivoria-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/folivoria_completist_1335307210.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/folivoria_completist_1335307210_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/folivoria_completist_1335307210_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-04-24\/folivoria_completist_1335307210_40.png";
function on_apply(pc){
	
}
var conditions = {
	670 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_119",
		value	: "21"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("folivoria_completist.js LOADED");

// generated ok (NO DATE)
