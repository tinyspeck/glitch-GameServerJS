var name		= "Twinkle-Toed Trap Triggerer";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Daintily triggered 37 Dust Traps";
var status_text		= "By luck or by painstaking planning, you've triggered the mighty flop of 37 Dust Traps and earned yourself this glorious badgling. Mazeltov!";
var last_published	= 1316458688;
var is_shareworthy	= 0;
var url		= "twinkle-toed-trap-triggerer";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/twinkle_toed_trap_triggerer_1315686127.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/twinkle_toed_trap_triggerer_1315686127_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/twinkle_toed_trap_triggerer_1315686127_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/twinkle_toed_trap_triggerer_1315686127_40.png";
function on_apply(pc){
	
}
var conditions = {
	570 : {
		type	: "counter",
		group	: "dust_trap",
		label	: "trigger",
		value	: "37"
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
	pc.stats_add_favor_points("lem", round_to_5(60 * multiplier));
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
		"points"	: 60
	}
};

//log.info("twinkle_toed_trap_triggerer.js LOADED");

// generated ok (NO DATE)
