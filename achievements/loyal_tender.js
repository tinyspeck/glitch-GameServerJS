var name		= "Loyal Tender";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Wore out and restored the same cultivated thing 5 times";
var status_text		= "Far be it from you to let one of your cultivation projects die. You'd rather restore the same thing 5 times over than let it die. Oh wait: you did! For your loyalty: a badge!";
var last_published	= 1348801525;
var is_shareworthy	= 1;
var url		= "loyal-tender";
var category		= "cultivation";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/loyal_tender_1339702885.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/loyal_tender_1339702885_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/loyal_tender_1339702885_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/loyal_tender_1339702885_40.png";
function on_apply(pc){
	
}
var conditions = {
	788 : {
		type	: "counter",
		group	: "cultivation",
		label	: "times_restored",
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
	pc.stats_add_xp(round_to_5(1000 * multiplier), true);
	pc.stats_add_favor_points("mab", round_to_5(200 * multiplier));
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
		"giant"		: "mab",
		"points"	: 200
	}
};

//log.info("loyal_tender.js LOADED");

// generated ok (NO DATE)
