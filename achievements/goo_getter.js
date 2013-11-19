var name		= "Goo-Getter";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Unsqueamishly scooped 127 quivering Jellisac clumps";
var status_text		= "After scooping up 127 Jellisacs, you're a certified Goo-Getter. While you already have the pruney fingers to prove it, this little badge is nice, too.";
var last_published	= 1348798863;
var is_shareworthy	= 1;
var url		= "goo-getter";
var category		= "harvesting";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/goo_getter_1315685982.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/goo_getter_1315685982_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/goo_getter_1315685982_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-10\/goo_getter_1315685982_40.png";
function on_apply(pc){
	
}
var conditions = {
	515 : {
		type	: "counter",
		group	: "jellisac",
		label	: "scoop",
		value	: "127"
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
	pc.stats_add_xp(round_to_5(350 * multiplier), true);
	pc.stats_add_favor_points("grendaline", round_to_5(45 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 350,
	"favor"	: {
		"giant"		: "grendaline",
		"points"	: 45
	}
};

//log.info("goo_getter.js LOADED");

// generated ok (NO DATE)
