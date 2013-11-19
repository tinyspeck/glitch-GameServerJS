var name		= "Novice Novitiate";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Donated to Shrines 11 times";
var status_text		= "Now you're getting the hang of this donating-to-Shrines business. We were going to send you a tax-deductible receipt, but then we decided to give you this Novice Novitiate badge instead. You're welcome.";
var last_published	= 1316419696;
var is_shareworthy	= 0;
var url		= "novice-novitiate";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-13\/novice_novitiate_1352831954.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-13\/novice_novitiate_1352831954_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-13\/novice_novitiate_1352831954_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-11-13\/novice_novitiate_1352831954_40.png";
function on_apply(pc){
	
}
var conditions = {
	353 : {
		type	: "group_sum",
		group	: "shrines_donated",
		value	: "11"
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
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 200
};

//log.info("novice_novitiate.js LOADED");

// generated ok (NO DATE)
