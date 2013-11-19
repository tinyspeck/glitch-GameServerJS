var name		= "Super Awesome Intern";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "A super-special, ultra-unique, \"thank you for being a snowflake\" award for your outstanding contribution to Glitchology.";
var status_text		= "There's no one quite like HBurger. Quite literally, now, because you've just been awarded the Super Awesome Intern badge! And this super awesome burger! No, wait, no burger. Just the badge. Marvellous though, right?";
var last_published	= 1339439799;
var is_shareworthy	= 0;
var url		= "super-awesome-intern-hburger";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-16\/super_awesome_intern_hburger_1316230554.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-16\/super_awesome_intern_hburger_1316230554_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-16\/super_awesome_intern_hburger_1316230554_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-16\/super_awesome_intern_hburger_1316230554_40.png";
function on_apply(pc){
	
}
var conditions = {
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000
};

//log.info("super_awesome_intern_hburger.js LOADED");

// generated ok (NO DATE)
