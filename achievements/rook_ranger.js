var name		= "Rook Ranger";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Fended off Rook with the aid of a tincture";
var status_text		= "The power of Rook Armour has saved your bacon - or at least kept it pink and floppy rather than crispy and cremated - this time. Consider yourself a decorated Rook Ranger. Hoo-ha!";
var last_published	= 1348802494;
var is_shareworthy	= 1;
var url		= "rook-ranger";
var category		= "alchemy";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/rook_ranger_1321576700.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/rook_ranger_1321576700_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/rook_ranger_1321576700_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-11-17\/rook_ranger_1321576700_40.png";
function on_apply(pc){
	
}
var conditions = {
	644 : {
		type	: "counter",
		group	: "essence_of_rookswort",
		label	: "defeated_rook",
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	pc.stats_add_favor_points("ti", round_to_5(150 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700,
	"favor"	: {
		"giant"		: "ti",
		"points"	: 150
	}
};

//log.info("rook_ranger.js LOADED");

// generated ok (NO DATE)
