var name		= "Trans-Rational Meat Aficionado";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Nibbled on an impressive - and impressed - 503 Piggies";
var status_text		= "It's not outrageous to wonder if all you do with your time is nibble Piggies, having nibbled 503 of the critters. Hence your new title: Trans-Rational Meat Aficionado.";
var last_published	= 1316304211;
var is_shareworthy	= 0;
var url		= "transrational-meat-aficionado";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/transrational_meat_aficionado_1304984230.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/transrational_meat_aficionado_1304984230_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/transrational_meat_aficionado_1304984230_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/transrational_meat_aficionado_1304984230_40.png";
function on_apply(pc){
	
}
var conditions = {
	254 : {
		type	: "counter",
		group	: "npc_piggy",
		label	: "nibble",
		value	: "503"
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
	pc.stats_add_favor_points("humbaba", round_to_5(150 * multiplier));
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
		"giant"		: "humbaba",
		"points"	: 150
	}
};

//log.info("transrational_meat_aficionado.js LOADED");

// generated ok (NO DATE)
