var name		= "Bubble Tea Aficionado";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Drank 11 Bubble Teas";
var status_text		= "Do your insides feel oxygenated? Are there flurries of bubbles in your undercarriage? That's because you've drunk 11 Bubble Teas, you Aficionado, you. Have a badge!";
var last_published	= 1349461120;
var is_shareworthy	= 1;
var url		= "bubble-tea-aficionado";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_tea_aficionado_1304984254.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_tea_aficionado_1304984254_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_tea_aficionado_1304984254_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bubble_tea_aficionado_1304984254_40.png";
function on_apply(pc){
	
}
var conditions = {
	259 : {
		type	: "counter",
		group	: "items_drank",
		label	: "bubble_tea",
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 15
	}
};

//log.info("bubble_tea_aficionado.js LOADED");

// generated ok (NO DATE)
