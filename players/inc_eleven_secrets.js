// The level to start tracking the 11 secret locations quest/achievement
function secretLocationsQuestLevel() { 
	return 5;
}

// Number of locations to choose out of the full selection. Triggering 11 of them will 
// result in the achievement. This number must be >= 11.
function secretLocationsQuestNumToChoose() { 
	return 20;
}

// Start the 11 secret locations quest/achievement
function startSecretLocationsQuest() {
	//if (!(this.is_god)) return; 	// for testing - only let gods do this

	// if the player already has the achievement, then make sure the data is cleared out
	if (this.achievements_has('eleven_secret_locations')) {
		this.secret_locations = [];
		return;
	}
	
	if (this.secret_locations) return;	// skip this if we've already done it (achievement in progress)
	if (!(config.secret_spots)) {
		log.error("11 secrets broken: can't find secret spots list in config");
		return; // skip this if the location list doesn't exist 
	}
	
	config.secret_spots.sort(function(){ return 0.5 - Math.random(); }); // Shuffle the secret locations
	
	// The last giant is Lem and the rest are randomized.
	this.secret_giants = [ 'alph', 'humbaba', 'cosma', 'spriggan', 'grendaline', 'zille', 'mab', 'tii', 'pot', 'friendly'];
	this.secret_giants.sort(function() { return 0.5 - Math.random(); }); // Shuffle the giants
	
	this.secret_locations = [];
	
	var num_choices = config.secret_spots.length;

	var max = this.secretLocationsQuestNumToChoose();
	if (num_choices < max) {
		max = num_choices;	// for testing - the real list should always have more than 11 
	}
	
	for (var i = 0; i < max; i ++) {
		this.secret_locations.push(config.secret_spots[i]);
	}
	
	// If the current location has one of the secrets, turn the marker on.
	this.showSecretLocationMarker(this.location);
}

// For testing
function resetSecretLocationsQuest() {
	log.info("Reset 11 secret locations for "+this.tsid);
	
	this.announce_sound_stop('11_SECRET_LOCATIONS_BEACON_LOOP');
	
	if (this.secret_locations) {
		var num = this.secret_locations.length;
	}
	else {
		var num = 0;
	}
	
	this.showAllSecrets = false;
	
	// dismiss the overlays
	for (var i = 0; i < num; i ++) {
		if (this.secret_locations[i]) {
			//this.sendActivity('Canceling overlay for '+ this.secret_locations[i].id);
			this.apiSendMsg({type: 'overlay_cancel', uid: 'secret_location_marker '+ this.secret_locations[i].id});
		}
	}
	
	// remove all locations data
	delete this.secret_locations;
	delete this.secret_giants;
	this.achievements_reset_group('eleven_secret_locations');
	this.counters_reset_group('eleven_secret_locations');
}

// For testing
function checkSecretLocations() { 
	var out = [];
	var max = config.secret_spots.length;
	for (var i = 0; i < max; i ++) {
		var loc = apiFindObject(config.secret_spots[i].tsid);
		if (loc) {
			out.push(loc.label);
		}
		else {
			out.push("Invalid");
		}
	}
	
	return out;
}

// For testing
function showAllSecretOverlays() { 
	this.showAllSecrets = true;

	var max = config.secret_spots.length;
	for (var i = 0; i < max; i ++) {
		if (config.secret_spots[i].tsid == this.location.tsid) {
			this.apiSendAnnouncement({
				type: 'location_overlay',
				swf_url: overlay_key_to_url('secret_location_marker'),
				state: 'active',
				x: config.secret_spots[i].x,
				y: config.secret_spots[i].y,
				width: 110,
				height: 110,
				uid: 'secret_location_marker '+config.secret_spots[i].id
			});
		}
	}
}

function clearAllSecretOverlays() { 
	this.showAllSecrets = false;

	var max = config.secret_spots.length;
	for (var i = 0; i < max; i ++) {
		this.apiSendMsg({type: 'overlay_cancel', uid: 'secret_location_marker '+ config.secret_spots[i].id});
	}
}

// If we are displaying more than 11 overlays, use this method to remove the rest once 
// 11 have been triggered.
function clearRemainingSecretOverlays() { 
	if (this.secret_locations) {
		var num = this.secret_locations.length;
		for (var i = 0; i < num; i ++) {
			if (	this.secret_locations[i] 
				) {
				this.apiSendMsg({type: 'overlay_cancel', uid: 'secret_location_marker '+ this.secret_locations[i].id});
				this.secret_locations[i] = null;
			}
		}
	}
}

// Hack to fix typo without doing a backfill.
function fixBrokenMarker(idx) {
	if (this.secret_locations ) {
		if (this.secret_locations[idx] && this.secret_locations[idx].id == '11spots_salatu_06') {
			this.secret_locations[idx].tsid = 'LIFJP2UC80820D3';
		}
	}
}

// For testing & fixing player data
function forceFixSecrets() {
	if (this.secret_locations) {
		var num = this.secret_locations.length;
		for (var i = 0; i < num; i ++) {
			this.fixBrokenMarker(i);
		}
	}
}

// Check whether a specific location is in the player's list, meaning that it is one of their locations 
// and they have not found it yet.
function hasSecretLocation(loc, id) {
	if (this.secret_locations) {
		var num = this.secret_locations.length;
		for (var i = 0; i < num; i ++) {
			this.fixBrokenMarker(i);
		
			//this.sendActivity('Checking '+this.secret_locations[i].id+' in '+this.secret_locations[i].tsid+' against '+id+' in '+loc.tsid);
			if (	this.secret_locations[i] 
				&& 	this.secret_locations[i].tsid == loc.tsid
				&&	this.secret_locations[i].id == id
				) {
				return true;
			}
		}
	}
	
	return false;
}

// Take a location out of the list (used to prevent us from showing the marker on the next visit to the location)
function removeSecretLocation(loc, id) {
	if (this.secret_locations) {
		var num = this.secret_locations.length;
		for (var i = 0; i < num; i ++) {
			if (	this.secret_locations[i] 
				&& 	this.secret_locations[i].tsid == loc.tsid
				&& 	this.secret_locations[i].id == id
				) {
				this.secret_locations[i] = null;
			}
		}
	}
}

// Put markers on the secret spots in this location so the player knows they are there.
function showSecretLocationMarker(loc) {
	if (this.secret_locations) {
		var num = this.secret_locations.length;
		for (var i = 0; i < num; i ++) {
			this.fixBrokenMarker(i);
		
			if (this.secret_locations[i] && this.secret_locations[i].tsid == loc.tsid) {
				this.apiSendAnnouncement({
					type: 'location_overlay',
					swf_url: overlay_key_to_url('secret_location_marker'),
					state: 'active',
					x: this.secret_locations[i].x,
					y: this.secret_locations[i].y,
					width: 110,
					height: 110,
					uid: 'secret_location_marker '+this.secret_locations[i].id
				});
				
				this.announce_sound('11_SECRET_LOCATIONS_BEACON_LOOP', 1000000);
			}
		}
	}
	// For testing:
	else if (this.is_god && this.showAllSecrets) {
		this.showAllSecretOverlays();
	}
}

// Change marker state when the player walks through it
function triggerSecretLocationMarker(loc, id) {
	if (this.secret_locations) {
		var num = this.secret_locations.length;
		for (var i = 0; i < num; i ++) {
			this.fixBrokenMarker(i);
		
			if (	this.secret_locations[i] 
				&& 	this.secret_locations[i].tsid == loc.tsid
				&& 	this.secret_locations[i].id == id
				) {
				this.announce_sound('11_SECRET_LOCATIONS_COLLISION');
				this.announce_sound_stop('11_SECRET_LOCATIONS_BEACON_LOOP');
				this.location.apiSendMsg({type: 'overlay_state', uid: 'secret_location_marker '+this.secret_locations[i].id, state: 'off'});
			}
		}
	}
}

// VoG messages for each giant. Three options for each one.
var secret_giant_messages = {
	'alph': [	'*YOWCH!*\nWha…? What was that? Some kind of shock?', 
				'*POW*.\nWas that a deja vu of the DNA? Because it smells like burning hair.', 
				'WOAH THERE!\nI swear I just felt a planet imploding. Did you feel that?!?'
			],
	'humbaba': ['*FWAP!*\nYour mindicles are vibrating at a manic giant frequency.', 
				'*YIKES*\nThis is like being trampled by a thousand hooves. What the...', 
				'WHAT THE...\nYour fingernails are tingling with the force of this DNAja-vu.'],
	'cosma': [	'*SHHHHH*\nWhat was that? Did the air just freeze?', 
				'*WHOA!*\nAre you still on your feet? Powerful DNAja-vu! Even MY eyeballs have gone wibbly.', 
				'*HUSSHHHHH*\nI swear I just felt the winds converge.'
			 ],
	'spriggan': [	'*SHUDDER*.\nSo that’s a DNAja-vu? Smells like wet forests.', 
					'You feel a rootlike tingling in your undertoes.\nWoah! DNAja-vu!', 
					'DNAja-vu, right? I swear I just heard your limbs creak in the wind.'
				],
	'grendaline':[	'*SHUDDER*\nA sudden deluge of sadness stops you in your tracks.', 
					'HUH?!?\nWhat\'s going on?!? You feel like you’re going under...', 
					'*WOOOSH*\nYour folicles are recoiling. Is that possible?'
				 ],
	'zille':[	'*SHAZAM*\nAn avalanche of Zille\'s old thoughts almost crush you.', 
				'HEY! WHAT THE... Did you hear that? Like a mountain creeping up behind you?', 
				'You hear ancient gravel rattling through your brainicle passages. DNA deja vu, man.'
			],
	'mab':[	'WOAH.\nYour guts feel like they\'re being sucked into the earth.', 
			'*YEEESH*\nYou feel like you\'re being buried alive... Make. It. Stop.', 
			'Is this really one of those deja vu of the DNA? It smells like wet dirt.'
		  ],
	'tii':[	'CAN\'T. THINK. DNA DEJA VU. TOO. STRONG. BRAIN. IMPLODING.', 
			'*ZAP!*\nYou feel a mental link with Tii so strong you can smell burning synapse.', 
			'WOAH.\nYour brain feels like it is the size of a planet.\nBut your skull remains small.'
		  ],
	'lem':[	'*FWAP!*\nLem\'s warm thoughts fuzzle in your brainicles. This feels good. You have explored well. You feel at peace.', 
			'*PHEW.*\nYour brain sighs with the relief that this is your last DNA deja vu cluster.', 
			'*POP!*\nOne last DNA deja vu. A sharp jolt in your brain, but a familiar one.\nThis feels almost peaceful.'
			],
	'pot':[	'*UUURGH*\nDoes deja vu of the DNA feel like food poisoning?', 
			'YEEEEK!\nWhat wa… who the… did you feel that?!', 
			'*ZJUK-FFF-NNNG*\nIntestines? Being tied in complex knots? Or something?'
		  ],
	'friendly':['*POW!*\nA strong DNAja-vu vibration is making your eyes go funny.', 
				'*YEEEESH!*\nPowerful wave of sweet nausea, friendly?!? What *was* that?', 
				'*SHAZAYAM*\nI feel dizzy. Can a deja vu of the DNA make you dizzy?']
};

var secret_giant_growls = { 
	'alph': [	'The power of Alph is reverberating in your cellular membranes. The DNAja-vu feels like an electric shock.', 
				'An Alph-specific DNAja-vu fizzles through your veins. You feel the urge to go tinker with something.', 
				'One of Alph\'s own memories flashed through your brain faster than you could catch in a moment of DNAja-vu.'
			],
	'humbaba': ['The connection to Humbaba is strong in this spot. Your synapses are feeling all bamboozled by giant memories.', 
				'The sense of Humbaba in this particular spot is enough to make your nucleotide polymers jangle. Strong DNAja-vu, here.', 
				'The overwhelming sense of precognition almost fells you. Humbaba must have very carefully woven her imagination into this place.'],
	'cosma': [	'You feel the power of Cosma vibrating the air in your bronchioles. This is one crazy DNAja-vu.', 
				'A powerful Cosma-infused DNAja-vu rushes your nerve endings and leaves you unable to breathe for a second.', 
				'Cosma\'s own recolllection of imagining up the 7 directions of the winds just rushed through your brain in a DNAja-vu. It was pretty overwhelming.'
			 ],
	'spriggan': [	'Your synapses buzz with a Spriggan-centric DNA deja vu. Spriggan must have put a lot of thought into this place.', 
					'Your mitochondria tingle as the Spriggan-imagined parts of your DNA resonate with the Sprigganness of this place.', 
					'Spriggan must have imagined this place up. The Spriggot parts of your DNA are shivering in recognition.'
				],
	'grendaline':[	'You\'re temporarily stunned by a rush of memories. From what you can tell, they seem to be Grendaline\'s.', 
					'You\'re incapacitated by an ocean of Grendalinian DNAja-vu bearing down on you. She must have poured a lot of imagination into this spot.', 
					'The power of Grendaline is reverberating in your chloroplastic membranes. This is a powerful DNAja-vu spot.'],
	'zille':[	'The connection to Zille in this spot is so strong that the DNAja-vu in this spot could feasibly crush you.', 
				'Zille must have poured some heavy imagination into this spot. Your chromosomes are rattling in recognition.', 
				'Briefly, your DNA-dust connection to Zille is so strong that you hear her old thoughts. You forget them immediately. Far too heavy.'
			],
	'mab':[	'A sudden DNAja-vu digs deep into your cellular membranes and sucks them downward. Your connection to Mab is strong here.', 
			'A strong Mab-centric DNAja-vu changes the gravity in your synapses and makes you feel all weird.', 
			'Your mitochondrial membranes soak up the earthiness that Mab imagined into this spot. It is a strong DNAja-vu.'
			],
	'tii':[	'Your mental connection to Tii is so strong in this location that you feel your ears being sucked inward.',
			'You\'re overwhelmed by a DNAja-vu. Your brain starts working by itself in strange, Tii-like loops and clusters.',
			'Briefly, the DNAja-vu connection with Tii in this spot makes you feel like you have all Tii\'s thoughts in your head at once. It hurts.'
		  ],
	'lem':[	'Your last DNAja-vu makes you feel warm and fuzzy. Every Lemmite molecule in you reverberates joyfully at the amount of wandering you have done to get here.', 
			'You can feel your genetic closeness to Lem in this place. Your long hours of exploration have filled the Giant with pride.', 
			'You feel proud of all the exploring you have done to find your DNAja-vu clusters. The strong connection with Lem in this place reassures you of this.'],
	'pot':[	'The strong connection to Pot here is fiddling with your polynucleotides, and making them feel all ooky.', 
			'This spot contains such a strong imaginational cluster connecting you to Pot that it feels as if you\'re wearing someone else\'s arms.', 
			'The DNAja-vu in this location is so rooted to Pot that every piece of food inside you feels like it\'s being recalled to its creator.'
		  ],
	'friendly':['You feel an overwhelming rush of Friendly vibrations caused by a DNA deja vu in this spot.', 
				'The connection to Friendly is strong in this place. The reverberation in your synapses makes you feel pukey.', 
				'The feeling of DNAja-vu courses through your veins like a triple-hooched Spicy Grog. Your connection to Friendly is strong here.']
};

// Get a randomly selected message for each giant
function getSecretNotification(giant){
	var message = Math.floor(Math.random() * 3);
	
	this.secret_message_index = message;
	return secret_giant_messages[giant][message];
}

// Called from location.js to do the announcements & favor & stuff
function handleElevenSecrets(id) {	
	if (!this.secret_giants) return;
	this.secret_id = id;

	if (this.counters_get_group_count('eleven_secret_locations') == 0){
		var count = 1;
	}
	else {
		var count = this.counters_get_group_count('eleven_secret_locations') + 1;
	}
		
	if (count != 11){
		var giant = this.secret_giants[count - 1];
	}
	else {
		this.clearRemainingSecretOverlays();
		var giant = 'lem';
	}
				
	var txt = 'You stumbled on another unique cluster of genetic dust, triggering a DNA deja vu... ('+count+'/11)'; 
		
	if (count > 1) {	// skip the announcement for the 1st giant since they get the intro text instead
		this.apiSendAnnouncement({
			uid: "eleven_secret_spots",
			type: "vp_overlay",
			duration: 0,
			locking: true,
			width: 500,
			x: '50%',
			top_y: '15%',
			click_to_advance: true,
			click_to_advance_show_text: false, // shows the text prompt next to the advance button
			no_spacebar_advance: true,
			text: [
				'<p align="center"><span class="nuxp_medium">'+txt+'</span></p>',
				'<p align="center"><span class="nuxp_medium">'+this.getSecretNotification(giant)+'</span></p>'
			],
			done_payload: {
				function_name: 'doGrowl'
			}
		});
	}
	else {
		this.introFirst();
	}
	
}

// Called on a timer after the VoG message to increment the achievement. This prevents the last message from 
// being hidden by the achievement notification.
function elevenSecretsIncrement() {
	//this.sendActivity('Incrementing '+this.secret_id);
	this.achievements_increment('eleven_secret_locations', this.secret_id);
	this.counters_increment('eleven_secret_locations', this.secret_id);
}

// Intro text:
function introFirst() {
	this.apiSendAnnouncement({
		uid: "eleven_secret_spots",
		type: "vp_overlay",
		duration: 0,
		locking: true,
		width: 500,
		x: '50%',
		top_y: '15%',
		click_to_advance: true,
		click_to_advance_show_text: true, // shows the text prompt next to the advance button
		no_spacebar_advance: true,
		text: [
			'<p align="center"><span class="nuxp_medium">Woah! Did you feel that? That was a DNA deja vu...</span></p>'
			],
		done_payload: {
			function_name: 'introSecond'
		}
	});
}
		
function introSecond() {
	this.apiSendAnnouncement({
		uid: "eleven_secret_spots",
		type: "vp_overlay",
		duration: 0,
		locking: true,
		width: 500,
		x: '50%',
		top_y: '15%',
		click_to_advance: true,
		click_to_advance_show_text: false, // shows the text prompt next to the advance button
		no_spacebar_advance: true,
		text: [
			'<p align="center"><span class="nuxp_medium">See - when you were imagined up, your genetic macromolecules were pulled from random parts of the giants\' brains.</span></p>',
			'<p align="center"><span class="nuxp_medium">Everything in this world is made up of different combinations of the same microscopic imagination particles from the eleven giants...</span></p>',
			'<p align="center"><span class="nuxp_medium">...and when you hit a genetic dust cluster that resembles your own glitchy makeup, you might find yourself getting a DNA deja vu (or "DNAja-vu") Just like this one.</span></p>',
			'<p align="center"><span class="nuxp_medium">It may happen quickly, it may take you years, but eventually, you will find eleven hidden DNAja-vu clusters, unique to you.</span></p>',
			],
		done_payload: {
			function_name: 'doGrowl'
		}
	});
}

// Show a growl in addition to the VoG message
function doGrowl() {
	if (!this.secret_giants) return;
	
	if (this.counters_get_group_count('eleven_secret_locations') == 0){
		var count = 1;
	}
	else {
		var count = this.counters_get_group_count('eleven_secret_locations') + 1;
	}
	
	if (count != 11){
		var giant = this.secret_giants[count - 1];
	}
	else {
		var giant = 'lem';
	}
	
	if (giant == 'tii') {
		var favorval = this.stats_add_favor_points('ti', 50);
		var xpval = this.stats_add_xp(100, true);	// no adjustment for mood bonus
		
		
	}
	else {
		if (count != 11) {
			var favorval = this.stats_add_favor_points(giant, 50);
			var xpval = this.stats_add_xp(100, true);	// no adjustment for mood bonus
		}
		else 
		{
			// No XP, since you'll get the achievement right after this.
			var favorval = this.stats_add_favor_points(giant, 100);	// Extra favor for Lem, since he likes exploration and stuff
			this.secret_locations = []; // clear data
		}
	}
	
	var effects_msg = '';
	
	if (favorval) {
		effects_msg += 'You gain '+favorval+' favor with '+capitalize(giant)+'. ';
	}
	
	if (xpval){
		effects_msg += 'You gain '+xpval+' iMG.';
	}
	
	// Pick a random message
	if (this.secret_message_index) { 
		var message = this.secret_message_index ;
	}
	else {
		var message = Math.floor(Math.random() * 3);
	}
	
	this.sendActivity(secret_giant_growls[giant][message] + effects_msg);
	this.apiSetTimer('elevenSecretsIncrement', 1000);
}
