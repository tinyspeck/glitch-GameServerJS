var name		= "Card-Carrying Qualification";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Got the Card-Carrying Qualification.";
var status_text		= "Your name has been entered in the great ledger and here you are, another cog in the machine, another brick in the wall, another loyal denizen of the state, able to carry or use any bureaucratic item you like. Arise, Card-carrier.";
var last_published	= 1349460382;
var is_shareworthy	= 1;
var url		= "card-carrying-qualification";
var category		= "player";
var url_swf		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/card_carrying_qualification_1304985086.swf";
var url_img_180		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/card_carrying_qualification_1304985086_180.png";
var url_img_60		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/card_carrying_qualification_1304985086_60.png";
var url_img_40		= "http:\/\/c2.glitch.bz\/achievements\/2011-05-09\/card_carrying_qualification_1304985086_40.png";
function on_apply(pc){
	
}
var conditions = {
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
}
var rewards = {};

//log.info("card_carrying_qualification.js LOADED");

// generated ok (NO DATE)
