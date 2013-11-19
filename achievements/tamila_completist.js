var name		= "Tamila Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Tamila";
var status_text		= "You've tripped lightly though Tamila, from the fringes of the plains to the depths of the enchanted forest. In what way was the forest enchanted, you ask? Enchanted enough to reward you this badge, little Tamila Completist. THAT'S how enchanted.";
var last_published	= 1350066563;
var is_shareworthy	= 1;
var url		= "tamila-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/tamila_completist_1317703259.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/tamila_completist_1317703259_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/tamila_completist_1317703259_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-10-03\/tamila_completist_1317703259_40.png";
function on_apply(pc){
	
}
var conditions = {
	605 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_92",
		value	: "31"
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

//log.info("tamila_completist.js LOADED");

// generated ok (NO DATE)
