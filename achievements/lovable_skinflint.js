var name		= "Lovable Skinflint";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Socked away 11,111 currants";
var status_text		= "11,111 currants … that's a lot of ones! Yet, there are many things still which you are unable to afford. Keep on flintin' that skin.";
var last_published	= 1323923335;
var is_shareworthy	= 0;
var url		= "lovable-skinflint";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/lovable_skinflint_1304983972.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/lovable_skinflint_1304983972_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/lovable_skinflint_1304983972_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/lovable_skinflint_1304983972_40.png";
function on_apply(pc){
	
}
var conditions = {
	210 : {
		type	: "has_currants",
		value	: "11111"
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
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 400
};

//log.info("lovable_skinflint.js LOADED");

// generated ok (NO DATE)
