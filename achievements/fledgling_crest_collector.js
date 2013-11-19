var name		= "Fledgling Crest Collector";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Earnestly earned 5 Emblems of the Giants";
var status_text		= "Five Emblems of the Giants isn't much of a collection, but hey, everyone has to start somewhere. You may now officially consider yourself a Fledgling Crest Collector.";
var last_published	= 1326849230;
var is_shareworthy	= 0;
var url		= "fledgling-crest-collector";
var category		= "giants";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fledgling_crest_collector_1304984769.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fledgling_crest_collector_1304984769_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fledgling_crest_collector_1304984769_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/fledgling_crest_collector_1304984769_40.png";
function on_apply(pc){
	
}
var conditions = {
	349 : {
		type	: "group_sum",
		group	: "emblems_acquired",
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
	pc.stats_add_xp(round_to_5(700 * multiplier), true);
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 700
};

//log.info("fledgling_crest_collector.js LOADED");

// generated ok (NO DATE)
