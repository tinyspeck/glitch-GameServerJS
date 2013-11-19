var name		= "Barman of Death";
var collection_type	= 0;
var is_secret		= 1;
var desc		= "Ended the useful life of 3 cultivated items using Wine of the Dead";
var status_text		= "For whatever reason, you decided time was up for three cultivated objects, and dispatched them with Wine of the Dead. But you have to ask: if it can wipe out a rock, what the heckfire is it doing to your liver?";
var last_published	= 1348796753;
var is_shareworthy	= 1;
var url		= "barman-of-death";
var category		= "cultivation";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/barman_of_death_1339702891.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/barman_of_death_1339702891_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/barman_of_death_1339702891_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/barman_of_death_1339702891_40.png";
function on_apply(pc){
	
}
var conditions = {
	781 : {
		type	: "counter",
		group	: "wotd",
		label	: "poured_on_something",
		value	: "3"
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
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500
};

//log.info("barman_of_death.js LOADED");

// generated ok (NO DATE)
