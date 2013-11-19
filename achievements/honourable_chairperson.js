var name		= "Honourable Chairperson";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Crafted one of each type of seating";
var status_text		= "Six types of seat and you've crafted them all. That must have been very tiring. Why don't you have a sit down? Not on a chair, of course, that would be ridiculous. Here, have an Honourable Chairperson award. Perhaps you can sit on that?";
var last_published	= 1348799153;
var is_shareworthy	= 1;
var url		= "honourable-chairperson";
var category		= "furniture";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/honourable_chairperson_1339715845.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/honourable_chairperson_1339715845_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/honourable_chairperson_1339715845_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/honourable_chairperson_1339715845_40.png";
function on_apply(pc){
	
}
var conditions = {
	744 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "252",
		value	: "1"
	},
	749 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "271",
		value	: "1"
	},
	750 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "259",
		value	: "1"
	},
	751 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "276",
		value	: "1"
	},
	752 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "257",
		value	: "1"
	},
	753 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "266",
		value	: "1"
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
	pc.stats_add_favor_points("alph", round_to_5(75 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "alph",
		"points"	: 75
	}
};

//log.info("honourable_chairperson.js LOADED");

// generated ok (NO DATE)
