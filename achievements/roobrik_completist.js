var name		= "Roobrik Completist";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Visited every location in Roobrik";
var status_text		= "I like long walks by the beach, beautiful sunsets and really tall trees. Since you've been to every single spot in Roobrik, I'd say you do too! Or maybe you just like hopping around. Whatever floats your boat champ, I don't judge. I just hand out badges to glitches like you.";
var last_published	= 1350066507;
var is_shareworthy	= 1;
var url		= "roobrik-completist";
var category		= "exploring";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/roobrik_completist_1339722215.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/roobrik_completist_1339722215_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/roobrik_completist_1339722215_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/roobrik_completist_1339722215_40.png";
function on_apply(pc){
	
}
var conditions = {
	702 : {
		type	: "counter",
		group	: "streets_visited_in_hub",
		label	: "number_126",
		value	: "21"
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
	pc.stats_add_xp(round_to_5(150 * multiplier), true);
	pc.stats_add_favor_points("lem", round_to_5(20 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 150,
	"favor"	: {
		"giant"		: "lem",
		"points"	: 20
	}
};

//log.info("roobrik_completist.js LOADED");

// generated ok (NO DATE)
