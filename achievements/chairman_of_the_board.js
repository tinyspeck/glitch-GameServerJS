var name		= "Chairman of the Board";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Worked up 101 Boards";
var status_text		= "You bound yourself to the board-making cause, making board after board without ever apparently getting bored. You deserve a little something, Chairman of the Board.";
var last_published	= 1348797069;
var is_shareworthy	= 1;
var url		= "chairman-of-the-board";
var category		= "industrial";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/chairman_of_the_board_1339696917.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/chairman_of_the_board_1339696917_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/chairman_of_the_board_1339696917_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2012-06-14\/chairman_of_the_board_1339696917_40.png";
function on_apply(pc){
	
}
var conditions = {
	692 : {
		type	: "counter",
		group	: "making_known_recipe",
		label	: "253",
		value	: "101"
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
	pc.stats_add_xp(round_to_5(250 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 250,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 40
	}
};

//log.info("chairman_of_the_board.js LOADED");

// generated ok (NO DATE)
