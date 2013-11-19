var name		= "Order of the Butterfly Passant";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Won 5 Games";
var status_text		= "In Urish days of old, 5 wins gained a knight access to the Order of the Butterfly Passant. Or 'Walking Butterfly' Or 'The Easily-Squishable Club', as bigger, tougher knights called it. Contenders thought this the first step on the way to higher orders… as should you, brave knightling! Onward!";
var last_published	= 1338920507;
var is_shareworthy	= 0;
var url		= "order-of-the-butterfly-passant";
var category		= "games";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_butterfly_passant_1315518630.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_butterfly_passant_1315518630_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_butterfly_passant_1315518630_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-09-08\/order_of_the_butterfly_passant_1315518630_40.png";
function on_apply(pc){
	
}
var conditions = {
	593 : {
		type	: "counter",
		group	: "it_game",
		label	: "won",
		value	: "5"
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
	pc.stats_add_xp(round_to_5(200 * multiplier), true);
	pc.stats_add_favor_points("friendly", round_to_5(25 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200,
	"favor"	: {
		"giant"		: "friendly",
		"points"	: 25
	}
};

//log.info("order_of_the_butterfly_passant.js LOADED");

// generated ok (NO DATE)
