var name		= "Bonafide Gas Wrangler";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Successfully converted 503 Gases";
var status_text		= "You turned 503 natural Gases into something better than natural. You're a Bonafide Gas Wrangler, and have the faraway stare, the crazy hair, the squeaky voice and the rook-may-care attitude to prove it.";
var last_published	= 1349461155;
var is_shareworthy	= 1;
var url		= "bonafide-gas-wrangler";
var category		= "trees";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bonafide_gas_wrangler_1304984329.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bonafide_gas_wrangler_1304984329_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bonafide_gas_wrangler_1304984329_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/bonafide_gas_wrangler_1304984329_40.png";
function on_apply(pc){
	
}
var conditions = {
	274 : {
		type	: "counter",
		group	: "making_tool",
		label	: "gassifier",
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
	pc.stats_add_favor_points("spriggan", round_to_5(150 * multiplier));
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
		"giant"		: "spriggan",
		"points"	: 150
	}
};

//log.info("bonafide_gas_wrangler.js LOADED");

// generated ok (NO DATE)
