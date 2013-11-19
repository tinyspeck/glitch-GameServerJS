var title = "It's Educational II";
var desc = "Get your learn on in the Museum of the Rook.";
var offer = "Now, this way please. Let us enter the museum.";
var completion = "You have seen all there is to see here. Do you now feel prepared to do battle with the Rook?<split butt_txt=\"I'm not sure.\" \/>I understand your trepidation, but you must simply remember this…<split butt_txt=\"Yes?\" \/>The Rook, while incredibly powerful, is vulnerable to the attacks of Martial Imagination. Before you can harm the Rook, you must use a Focusing Orb to stun it.<split butt_txt=\"Focusing Orb. Stun. Got it.\" \/>Once the Rook has been stunned, the Pious Glitch can prime a shrine, turning the donations of others into powerful attacks.<split butt_txt=\"Prime. Donations. Attack. OK.\" \/>I believe you are now ready. Go, rally the forces of imagination in defence of Ur! And may the Giants be with you.";

var button_accept = "Lead the way.";

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
var prereq_quests = ["rook_hall_start"];
var prerequisites = [];
var end_npcs = ["npc_quest_widget"];
var locations = {
	"rook_museum"	: {
		"dev_tsid"	: "LMF18E5891926RI",
		"prod_tsid"	: "LA91BDTNHS82D36"
	}
};

var requirements = {
	"r285"	: {
		"type"		: "flag",
		"name"		: "learn_rook",
		"class_id"	: "rook_head",
		"desc"		: "Learn about the Rook."
	}
};

function onComplete(pc){ // generated from rewards
	var xp=0;
	var currants=0;
	var mood=0;
	var energy=0;
	var favor=0;
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_quest_modifier();
	xp = pc.stats_add_xp(round_to_5(400 * multiplier), true, {type: 'quest_complete', quest: this.class_tsid});
	apiLogAction('QUEST_REWARDS', 'pc='+pc.tsid, 'quest='+this.class_tsid, 'xp='+intval(xp), 'mood='+intval(mood), 'energy='+intval(energy), 'currants='+intval(currants), 'favor='+intval(favor));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
	this.onComplete_custom(pc);
}
var rewards = {
	"xp"	: 400
};

function breakOrb(){
	this.owner.apiSendMsg({type: 'overlay_state', uid: 'rook_hall_orb', state: 'orbBreak'});
}

function buildSubtitles(){
	this.subtitles = {
		'button_1': [
			{delay: 1, txt: "Back in the early ages of Ur, when small islands formed spontaneously from the primordial chaos, only to be rendered unrecognizable moments later by the constant ebb and flow of imagination, the ancient Glitchian tribes suffered under constant threats to their very survival."},
			{delay: 18, txt: "There was the instability of the environment, the paucity of piggies—not to mention going to sleep every night without knowing what shapes or substances their meagre huts might be when they awoke—"},
			{delay: 28, txt: "But by far the most dangerous and terrifying of these was the Rook."},
			{delay: 33, txt: "THE ROOK, enemy of imagination, visited its wrath upon whatever the Giants’ minds created."},
			{delay: 39, txt: "It was the very manifestation of fear, doubt and uncertainty."},
			{delay: 44, txt: "It pecked and clawed relentlessly at the periphery of the Giants’ domain, black winter to the Giants’ spring of creativity."},
			{delay: 51, txt: "It was, if I can say so myself, most awful."}
		],
		'button_2': [
			{delay: 1, txt: "Noticing the capability of a particularly strong, focused and concentrated burst of imagination to temporarily stun The Rook, ascetics and yogis of the Meadow Tribes set to work to develop a more reliable method of harnessing this defensive action."},
			{delay: 14, txt: " Employing the recent technological breakthrough of spun-crystal focusing orbs they learned to draw the small imaginations of individual Glitches together and blast the rook into stillness, at least temporarily."},
			{delay: 26, txt: "They gave this discipline the name of ‘Martial Imagination,’ and the image preserved in this display shows an elder Glitch in early times leading imaginators to defend against a stream of Rook attacks."}
		],
		'button_3': [
			{delay: 1 , txt: "While the lustre of this ancient focusing orb has faded with the passing of generations, in ages long past, its flawless surface of spun crystal acted as a nexus for the imaginations of our Glitchian ancestors, and as a potent weapon against the Rook."}
		],
		'button_4': [
			{delay: 0, txt: "Generations struggled to find a way to fight back against the Rook and end its destruction of creativity."},
			{delay: 7, txt: "No progress was made until the extraordinarily Pious Esquibeth of Inari discovered that her will alone could turn a normal shrine into a weapon, harnessing the direct conduit to the minds of the Giants to return fire instead of favor."}
		],
		'button_5': [
			{delay: 2, txt: "The holofilm which follows demonstrates a pious primitive priming the shrine for an attack."},
			{delay: 8, txt: "Discovered half-buried in a rock face at Ekorran Roughs, it would be easy to overlook the coarse stonework of this ancient shrine as simply another natural feature."},
			{delay: 16, txt: "But while the crafts of ancient Glitchian tribespeople may have been rudimentary, they still excelled in their piety and devotion to the Giants."},
			{delay: 24, txt: "This shrine would have played an integral role in the everyday ceremonies of village life."}
		],
		'button_6': [
			{delay: 1, txt: "As ancient legends tell it, these battle plans were recovered from an abandoned nest after a series of courageous attacks repulsed The Rook entirely from the Isle of Uralia."},
			{delay: 11, txt: "Though its true provenance has never been proven to the satisfaction of all skeptics, most now believe it to be a genuine artifact — indeed, the only such artifact ever to fall into Glitchian hands —"},
			{delay: 22, txt: "And the only example of Rookish script ever seen."}
		],
	};
}

function callback_buttonFinished(details){
	if(details.name == 'button_3' && this.ancient_orb_started) {
		this.orb_overlay_state = 0;
		this.doOrbOverlay();
	
		this.ancient_orb_started = false;
		this.ancient_orb_overlay = true;
	}
}

function callback_buttonPushed(details){
	if(this.ancient_orb_overlay) {
		this.queued_button = details.name;
		log.info("Queueing button "+this.queued_button);
		this.sendNPCMessage(details.name, 'stop', {});
	} else {
		if (details.name == 'button_3') {
			this.ancient_orb_started = true;
		}
	}
	
	if(!this.pushedButtons) {
		this.pushedButtons = {};
	}
	this.pushedButtons[details.name] = true;
	this.checkRequirements();
}

function callback_onMoveComplete(details){
	switch(details.npc_name) {
		case 'widget':
			this.sendNPCMessage('widget', 'face_direction', {dir: 'right'});
			this.widget_moving = false;
			break;
	}
}

function callback_overlayDone(details){
	this.orb_overlay_state++;
	this.doOrbOverlay();
}

function callback_widgetConversation(details){
	if(this.widget_nagging) {
		this.widget_nagging = false;
		this.widget_has_nagged = true;
	}
		
	this.sendNPCMessage('widget', 'move_to_xy', {x: 2200, y: -100});
	this.talked_to_widget = true;
	this.widget_moving = true;
}

function callback_widgetNag(details){
	if((!this.pushedButtons || num_keys(this.pushedButtons) == 0) && !this.widget_has_nagged) {
		this.sendNPCMessage('widget', 'move_to_player', {pc: this.owner, stop_distance: 150});
		this.widget_nagging = true;
	}
}

function checkRequirements(){
	if(!this.pushedButtons) {
		return;
	}
	
	if(num_keys(this.pushedButtons) == 6) {
		this.set_flag(this.owner, 'learn_rook');
	}
}

function doOrbOverlay(){
	switch(this.orb_overlay_state) {
		case 0:
			this.owner.apiSendAnnouncement({
				type: 'vp_canvas',
				uid: 'rook_hall_text_bg',
				canvas: {
					color: '#000000',
					steps: [
						{alpha:.5, secs:.5},
					],
					loop: false
				}
			});
	
			var text = [
				'<p align="center"><span class="nuxp_vog_smaller">Heed my words, young Glitch.</span></p>',
				'<p align="center"><span class="nuxp_vog">YES, YOU!</span></p>',
				'<p align="center"><span class="nuxp_vog_smaller">The Rook, in its full wrath and vigour, cannot be harmed by even the most powerful of attacks. It must first be stunned.</span></p>'
			];
			break;
		case 1:
			this.owner.apiSendAnnouncement({
				type:'vp_overlay',
				swf_url:overlay_key_to_url('focusing_orb_attack'),
				state: 'orb1',
				uid: 'rook_hall_orb',
				duration: 0,
				x: '50%',
				top_y: '25%',
				size: '10%'
			});
	
			var text = ['<p align="center"><span class="nuxp_vog_smaller">Only with a Focusing Orb and the power of Martial Imagination can you stun the Rook. But you cannot do it alone: others must join in the fight.</span></p>'];
			break;
		case 2:
			this.owner.apiSendMsg({type: 'overlay_scale', uid: 'rook_hall_orb', scale: 1.5, time:1.0});
			this.owner.apiSendMsg({type: 'overlay_state', uid: 'rook_hall_orb', state: 'orb2'});
			var text = ['<p align="center"><span class="nuxp_vog_smaller">As other Glitches turn their wills towards the Focusing Orb, your attack will grow in size and power.</span></p>'];
	
			break;	
		case 3:
			this.owner.apiSendMsg({type: 'overlay_scale', uid: 'rook_hall_orb', scale: 2.0, time:1.0});
			this.owner.apiSendMsg({type: 'overlay_state', uid: 'rook_hall_orb', state: 'orb3'});
			var text = ['<p align="center"><span class="nuxp_vog_smaller">The Rook is exceptionally strong, and several powerful attacks may be required to stun it.</span></p>'];
	
			break;	
		case 4:
			this.owner.apiSendMsg({type: 'overlay_scale', uid: 'rook_hall_orb', scale: 2.5, time:1.0});
			this.owner.apiSendMsg({type: 'overlay_state', uid: 'rook_hall_orb', state: 'orb4'});
			var text = ['<p align="center"><span class="nuxp_vog_smaller">But beware, for as the Orb reaches its most powerful, it also grows fragile. If too many minds join in the attack…</span></p>'];
	
			break;	
		case 5:
			this.apiSetTimer('breakOrb', 1200);
			var text = [
				'<p align="center"><span class="nuxp_vog_smaller">The Orb will be destroyed, and the attack for naught.</span></p>',
				'<p align="center"><span class="nuxp_vog_smaller">To walk this fine line between success and failure is your sacred duty as a defender of imagination.</span></p>',
			];
	
			break;	
		case 6:
			this.owner.apiSendMsg({type: 'overlay_cancel', uid: 'rook_hall_text_bg'});
			this.owner.apiSendMsg({type: 'overlay_cancel', uid: 'rook_hall_orb'});
	
			if(this.ancient_orb_overlay) {
				delete this.ancient_orb_overlay;
			}
			if(this.queued_button) {
				this.sendNPCMessage(this.queued_button, 'play', {});
				log.info("Playing button "+this.queued_button);
				delete this.queued_button;
			}
			break;	
	}
	
	if(text) {
		this.owner.apiSendAnnouncement({
			uid: 'rook_hall_text',
			type: "vp_overlay",
			locking: true,
			duration: 0,
			x: '55%',
			width: 400,
			top_y: '60%',
			click_to_advance: true,
			text: text,
			done_payload: {
				quest_callback: 'overlayDone'
			}
		});
	}
}

function injectSubtitles(npc_name){
	if(!this.subtitles || !this.subtitles[npc_name]) {
		log.error("Error in quest "+this+". Voiceover subtitles not found for npc "+npc_name);
		return;
	}
	
	for(var i in this.subtitles[npc_name]) {
		var title = this.subtitles[npc_name][i];
		if (title.delay) {
			this.sendNPCMessageDelayed(npc_name, 'local_chat', {txt: title.txt, label: "Loudspeaker"}, title.delay);
		} else {
			this.sendNPCMessage(npc_name, 'local_chat', {txt: title.txt, label: "Loudspeaker"});
		}
	}
}

function onAccepted(pc){
	this.buildSubtitles();
	this.questInstanceLocation(pc, 'rook_museum', -2270, -136, 0, {preserve_links: true});
	
	return {ok: 1};
}

function onComplete_custom(pc){
	pc.instances_exit('rook_museum');
}

function onEnterLocation(location){
	if (!this.entered_hall) {
		this.no_progress = "You still have much to learn before you are ready to fight the Rook. Please examine the remaining exhibits in the museum.";
	
		var widget = this.owner.location.createItemStack('npc_quest_widget', 1, -2132, -196);
		if (widget) {
			widget.setInstanceProp('npc_name', 'widget');
			widget.setInstanceProp('variant', 'widgetWood');
		} else {
			log.error(this+" couldn't create widget itemstack in "+location);
		}
		this.entered_hall = true;
	}
}

function onExitLocation(location){
	log.info("Leaving quest location. Failing quest");
	this.owner.failQuest(this.class_tsid);
}

function onNpcCollision(pc, npc_name){
	switch(npc_name) {
		case 'widget':
			if (this.widget_nagging) {
				this.sendNPCMessage('widget', 'conversation_start', {conversation: 'rook_museum_nag', pc: pc});	
			} else if(this.talked_to_widget) {
				this.sendNPCMessage('widget', 'offer_quest', {quest_id: 'rook_hall', pc: pc});
			} else if (!this.widget_moving) {
				this.sendNPCMessage('widget', 'conversation_start', {conversation: 'rook_museum_enter', pc: pc});
			}
			break;
	}
}

function repeatShrineAnimation(){
	this.sendNPCMessage('shrine', 'set_state', {state: 'stop'});
	this.sendNPCMessage('shrine', 'set_state', {state: 'play'});
	this.apiSetTimer('repeatShrineAnimation', 8000);
}

//log.info("rook_hall.js LOADED");

// generated ok (NO DATE)
