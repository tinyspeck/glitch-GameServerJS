var title = "A slice of Pie";
var desc = "An unfortunate accident put a stain on the relationship between the Rangers and the Bureaucrats.  Time to help!";
var offer = "*sigh I love my job, helping keep Ur organized, but some days I have regrets.  <split butt_txt=\"Go on\" \/>Many cycles ago,  I was very good friends with a Bureaucrat named Henrique.   <split butt_txt=\"Henrique?\" \/>It's not a typical Bureaucrat name, but he isn't your typical paper pusher either.  Anyway, I decided to throw a party so that he could meet some of the other Rangers and we could start building some bridges.   <split butt_txt=\"It's always nice to meet new people...\" \/>I completely agree!  Sure, we were imagined by the giants to do different things, but that's no reason we can't be friends!   <split butt_txt=\"And the party?\" \/>It was great, until it became a disaster.  The butterfly band was great.  We were dancing up a storm.  Until the pie. <split butt_txt=\"What can be bad about pie?\" \/>The giants imagined the Bureaucrats to like order, to keep things in line, to always have enough staples, to keep things clean. <split butt_txt=\"And the pie?\" \/>After pulling off a great full-gainer, I hit the edge of the table.  The pie arced through the air  and landed square on Henrique's boss's brand new tie. <split butt_txt=\"Uh oh.\" \/>Uh oh is right.  They all stood up straight and marched right out of the party.  Henrique has not spoken to me since. <split butt_txt=\"Really?\" \/>Not a peep.  I still feel awful about the pie on the tie.  Say... could you help me?<split butt_txt=\"I'd love to\" \/>Great.  Take this card I wrote.  It just needs the signatures of some other Rangers.  If you could then deliver it to a Bureaucrat, it will make its way to Henrique.<split butt_txt=\"I'm on it\" \/>Oh fantastic, this means so much to me.";
var completion = "What is this?<split butt_txt=\"A note for Henrique\" \/>Hmmm.  It is in the appropriate 27B-6 format.  Oh and it is countersigned by the correct authorities within the Ranger organization.   <split butt_txt=\"I'm a bit of a stickler for paperwork\" \/>I agree.  Where would we be if we didn't follow the correct procedures?  I'll go ahead and get this filed appropriately.<split butt_txt=\"Thank you\" \/>No thank you.  Clearly you talked some sense into those ruffian Rangers.  Maybe they are not such a bunch of savages after all.<split butt_txt=\"So this might remove a bit of the 'stain' in your relationship?\" \/>*stares at you*  What are you implying?  Do you also have a fondness for pirouetting pie?<split butt_txt=\"Oh no, not at all.\" \/>Good.  Thank you for this apology form.  It will be delivered.  Good day.<split butt_txt=\"Good bye\" \/>";


var auto_complete = 0;
var familiar_turnin = 0;
var is_tracked = 0;
var show_alert = 0;
var silent_complete = 0;
var progress = [
];
var giver_progress = [
];
var no_progress = "null";
var prereq_quests = [];
var prerequisites = [];
var end_npcs = ["npc_bureaucrat"];
var locations = {};
var requirements = {};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	favor = pc.stats_add_favor_points("friendly", round_to_5(171 * multiplier));
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards = {
	"favor"	: {
		"0"	: {
			"giant"		: "friendly",
			"points"	: 171
		}
	}
};

//log.info("slice_of_pie.js LOADED");

// generated ok (NO DATE)
