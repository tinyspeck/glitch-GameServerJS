var name		= "Dedicated Snail Getter";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Negotiated 1001 snails from a sloth";
var status_text		= "Somehow, you persuaded the sloths to give up 1001 snails. It took dedication and a very smooth Sloth-charming style. Hats off to you, Snail Getter.";
var last_published	= 1348797450;
var is_shareworthy	= 1;
var url		= "dedicated-snail-getter";
var category		= "animals";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/dedicated_snail_getter_1339706657.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/dedicated_snail_getter_1339706657_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/dedicated_snail_getter_1339706657_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/dedicated_snail_getter_1339706657_40.png";
function on_apply(pc){
	
}
var conditions = {
	761 : {
		type	: "counter",
		group	: "sloth",
		label	: "snails_received",
		value	: "1001"
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("humbaba", round_to_5(200 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 1000,
	"favor"	: {
		"giant"		: "humbaba",
		"points"	: 200
	}
};

//log.info("dedicated_snail_getter.js LOADED");

// generated ok (NO DATE)
