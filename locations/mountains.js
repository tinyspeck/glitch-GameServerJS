
function isMountain() { 
	return true;
}

// Hitboxes are used for the freeze, and also to declare the winner at the top of the mountain.
function hitBox(pc, id, in_box){
	if (this.done) return;
	
	if (!this.current_freeze_rung) this.current_freeze_rung = 1;
	
	if (config.is_dev || pc.is_god) log.info(pc+' hit box '+id+', in box: '+(in_box ? 'true': 'false'));
	if (!id){
		log.error("MT location.hitBox passed undefined id");
		return;
	}

	
	// Have we reached the top of the mountain?
	if (id == 'winner') { 
		this.onEnterFinishLine(pc);
	}
	// Coins test:
	else if (id == 'rain') { 
		this.onStartCoinMovement(pc, 1000, 350);
		//this.apiSetTimerX("onStartCoinMovement", 750, pc); //this.onStartCoinMovement();
	}
	else if (id == 'reset') { 
		this.onResetCoinMovement();
	}	
	else { 
		var box = this.find_hitbox_by_id(id);

		var id_parts = id.split('_');
		switch (id_parts[0]){
			case 'coldzone':{
				log.info("MT checking coldzone");
				pc.onColdZone(box);
				break;
			}
			case 'freeze':{
				this.onEnterFreeze(pc, intval(id_parts[2]));
				break;
			}
			case 'hwindzone':{
				if (!this.hwindzones[id].pcs) this.hwindzones[id].pcs = {};
				var pc_tsid = pc.tsid;
				this.hwindzones[id].pcs[pc_tsid] = "here";
			
				if (this.hwindzones[id].start == 0 || this.constant_wind_zones) {	
					pc.onEnterHWindZone(id);
				}
				break;
			}
			case 'vwindzone':{
				if (!this.vwindzones[id].pcs) this.vwindzones[id].pcs = {};
				var pc_tsid = pc.tsid;
				this.vwindzones[id].pcs[pc_tsid] = "here";
				
				//log.info("MT windzone start "+this.vwindzones[id].start);
				if (this.vwindzones[id].start == 0 || this.constant_wind_zones) { 
					pc.onEnterVWindZone(id);
				}
				break;
			}
		}
	}
}

// Disable collisions with plats in the freeze so players fall through:
function disablePlatsAbove(height){
	if (!this.plats_init){
		this.geo_set_initial_perms();
		this.plats_init = true;
	}

	this.geo_set_plats_to_initial_perms(null, height, null, null, true);
	this.geo_disable_plats(null, null, null, height, true);
}

function enableAllPlats(){
	if (!this.plats_init){
		this.geo_set_initial_perms();
		this.plats_init = true;
	}

	this.geo_set_plats_to_initial_perms(null, null, null, null, true);
}

// Display the freeze for all levels down to 1.
// TODO: add any missing functionality from location.js
// Such as not giving the player XP when they enter.
function onPlayerEnter(pc){
	
	// Standard location entry stuff:
	apiLogAction('race_player_enter', 'pc='+pc.tsid, 'loc='+this.tsid, 'template='+this.instance_of);

	pc.is_afk = false;

	// Dead, but not in hell?
	if (pc.is_dead && !this.isInHell()){
		log.info(pc+' forcing back to hell');
		pc.teleportToLocationDelayed(config.hell['tsid'], config.hell['x'], config.hell['y']);
	}
	
	// Update send announcements for any overlay flags on players in the area.
	this.updatePlayerOverlayIndicators(pc);
	this.updatePlayerOverlayIndicators(pc);
	
	// Glitch train achievement check
	pc.updateGlitchTrain(this.tsid);
	
	// make sure we update physics whenever a player enters a location
	pc.removeAllTempPhysics(true);

	// Announce
	pc.sendLocationActivity(pc.label + " is here!", pc, pc.buddies_get_ignoring_tsids());

	var msg = '';
	var players = [];
	for (var i in this.activePlayers){
		var player = this.activePlayers[i];
		var tsid = player.tsid;
		if (tsid != pc.tsid){
			if (pc.buddies_is_ignored_by(tsid) == false) { 
				players.push(utils.escape(player.label));
			}
		}
	}

	var rsp = {
		type: 'pc_location_change',
		pc: {
			tsid: pc.tsid,
			label: pc.label,
			location: {
				tsid: this.tsid,
				label: this.is_hidden() ? 'A secret place' : this.label
			}
		}
	};

	pc.reverseBuddiesSendMsg(rsp);

	if (players.length){
		var msg = "Other players here: " + pretty_list(players, ' and ');
		pc.sendActivity(msg, null);
	}

	// Set up this mountain and do a short intro for the player:
	if (!this.current_freeze_rung) this.current_freeze_rung = 1;
	
	if (!this.rungs) {
		this.rungs = pc.party.get_space().getProp('rungs');
		this.rewards = pc.party.get_space().getProp('rewards');
		log.info('MT Mountain Rewards: '+this.rewards);
		
		// Make sure the plats are disabled in the freeze:
		if (this.rungs) { 
			var data = this.rungs[this.current_freeze_rung-1];
			this.disablePlatsAbove(data.yPos-data.height);
		}
		
		// Initial set up of wind zones
		log.info("MT creating wind zones");
		this.onInitWindZones();
	}
	
	this.showColdZoneOverlays();
	
	if (!pc['mountaineering_state'] && (!this.mountaineers || !this.mountaineers[pc.tsid])) { 
		log.info("MT doing new player intro"+pc);
		pc['mountaineering_state'] = 'intro';
		this.startIntro(pc);
	}
	else { 
		log.info("MT showing decos for player who was already here");
		// Update the player's client so they see the decos correctly
		for (var rung in this.rungs) {
			if (rung >= this.current_freeze_rung && !(this.done) && !(this.freezeBeaten)) {
				log.info("MT Player entered, displaying rung "+rung);
				pc.displayFreeze(rung);
			}
			else { 
				log.info("MT player entered, removing rung "+rung);
				pc.removeFreeze(rung);
			}
		}
		
		if (this.rungs) { 
			// Make sure the player is not standing in the freeze
			log.info("MT freeze booting player with height "+ this.rungs[this.current_freeze_rung].yPos);
			pc.teleportToLocation(pc.location.tsid, pc.x, this.rungs[this.current_freeze_rung].yPos);
			this.freezeBootPlayer(pc, this.rungs[this.current_freeze_rung].yPos);
		}
	}
	
	log.info("MT updating wind");
	this.onWindTick();
	
	log.info("MT updating counter");
	this.updateLanternCounter();
}

function recordMountaineer(pc_tsid) { 
	if (!this.mountaineers) this.mountaineers = {};
	
	this.mountaineers[pc_tsid] = "here";
}

// When each player enters the level, give them a nice camera pan
function startIntro(pc) { 
	
	for (var rung in this.rungs) {
		pc.removeFreeze(rung);
	}
	
	var num_rungs = !this.rungs ? 0 : this.rungs.length;
	
	pc.showRung(num_rungs-1);
}

function getCurrentFreezeRung() { 
	return this.current_freeze_rung;
}

function getRungData(rung) { 
	if (this.rungs) { 
		return this.rungs[rung];
	}
	
	
	return null;
}

function getLanterns(rung){
    var items = this.getItems();
    var lanterns = [];

    var is_lantern = function(it){
    	if (it.class_tsid == 'mountain_lantern'){
			if (!rung || it.getInstanceProp('rung') == rung){
				lanterns.push(it);
			}
        }
    };
    this.items.apiIterate(is_lantern);
    
    return lanterns;
}

function lanternLit(lantern){
	var rung = intval(lantern.getInstanceProp('rung'));	
	if (this.areAllLanternsLit(rung)){
		this.advanceRung(rung+1);
	}
	log.info("MTim lanternLit");
	this.updateLanternCounter();
}

function extinguishLanterns(rung){
	log.info('MT extinguishLanterns: '+rung);
	var rung_lanterns = this.getLanterns();
	for (var i in rung_lanterns){
		if (!rung || intval(rung_lanterns[i].getInstanceProp('rung')) >= rung){
			rung_lanterns[i].onExtinguish();
		}
	}
	this.updateLanternCounter();
}

function setPermanentLanterns(rung){
	log.info('MT setPermanentLanterns: '+rung);
	var rung_lanterns = this.getLanterns();
	for (var i in rung_lanterns){
		if (!rung || intval(rung_lanterns[i].getInstanceProp('rung')) <= rung){
			log.info('setting: '+rung_lanterns[i]+' permanent');
			rung_lanterns[i].setPermanent();
		}
	}
}

function startFreezeFade() { 
	// Start fading the freeze in again
	log.info("MT starting fade for rung "+this.current_freeze_rung - 1);
	this.displayFreeze(this.current_freeze_rung - 1);
}		

function advanceRung(rung){
	log.info('MT advanceRung: '+rung);
	if (rung < this.current_freeze_rung) return;

	if (!this.done && !this.freezeBeaten) {
		this.setCurrentRungState(this.current_freeze_rung+1);
	}
}

// The number of "states" during the freeze, used to display growls at certain 
// intervals.
function getRungStateCount(rung){
	return 5;
}

// Move the rung down
function declineRungState(){
	log.info('MT declineRungState');
	if (!this.done && !this.freezeBeaten) {
		this.setCurrentRungState(this.current_freeze_rung, this.current_freeze_rung_state-1);
	}
} 

function areAllLanternsLit(rung){
	if (!this.current_freeze_rung){
		log.info('MT current_freeze_rung is not set... returning');
		return;
	}
	if (rung < this.current_freeze_rung){
		log.info('MT current_freeze_rung higher then this lanturn\'s rung... returning [lantern:'+rung+' current: '+this.current_freeze_rung+']');
		return;
	}

	var lanterns = this.getLanterns(rung);
	for (var i in lanterns){
		if (lanterns[i].getInstanceProp('is_lit') == 0){
			return false;
		}
	}
	
	return true;	
}

function notifyAllPlayers(message){
	var players = this.getAllPlayers();
	for (var i in players){
		players[i].sendActivity(message);
	}
}

// Display the number of lamps left to light on this rung.
function updateLanternCounter(){
	this.apiSendMsg({type: 'overlay_cancel', uid:'lantern_counter'});

	if (this.freezeBeaten || this.done) return;
	
	var rung_lanterns = this.getLanterns(this.current_freeze_rung);
	var lit_lanterns = 0;
	for (var i in rung_lanterns){
		if (rung_lanterns[i].isLit()){
			lit_lanterns++;
		}
	}

	this.apiSendAnnouncement({
		uid: "lantern_counter",
		type: "vp_overlay",
		duration: 0,
		locking: false,
		width: 500,
		x: '50%',
		top_y: '15%',
		click_to_advance: false,
		text: ['<p align="center"><span class="game_splash_race">'+(rung_lanterns.length - lit_lanterns)+' lamps left before advancing the freeze</span></p>']		
	});
}

function removeLanternCounter(){
	log.info('MT - removeLanternCounter');
	this.apiSendMsg({type: 'overlay_cancel', uid:'lantern_counter'});
}

// Display the number of seconds left until the freeze drops
function updateRungTimer(){
	this.apiSendMsg({type: 'overlay_cancel', uid:'timer_display'});
	
	if (this.freezeBeaten || this.done || this.current_freeze_rung <= 1) return;
	
	if (this.seconds_remaining < 0) { return; }
	
	this.apiSendAnnouncement({
		uid: "timer_display",
		type: "vp_overlay",
		duration: 0,
		locking: false,
		width: 500,
		x: '50%',
		top_y: '5%',
		click_to_advance: false, 
		text: ['<p align="center"><span class="game_splash_race">'+this.seconds_remaining+' seconds remaining</span></p>']		
	});
	log.info("MT time remaining is "+this.seconds_remaining);
	
	if (this.seconds_remaining >= 0){
		this.seconds_remaining -= 1;
		this.apiCancelTimer('updateRungTimer');
	}
	
	this.apiSetTimer('updateRungTimer', 1*1000);
}

// Remove the timer display
function removeRungTimer() { 
	log.info("MT removeRungTimer");
	this.apiCancelTimer('updateRungTimer')
	this.apiSendMsg({type:'overlay_cancel', uid:'timer_display'});
}

// Reset the timer display
function resetRungTimer() { 
	log.info("MT resetRungTimer");
	var data = this.rungs ? this.rungs[this.current_freeze_rung-1] : null;
	this.seconds_remaining = data ? data.freezeTime : 10000;
}

function freezeBootAllPlayers(height){
 	log.info("MT freezeBootAllPlayers: "+height);
	var players = this.getAllPlayers();
	for (var i in players){
		//players[i].sendActivity("You're getting booted");
		freezeBootPlayer(players[i],  height);
	}
}

function freezeBootPlayer(pc, height){
	
	if (height && pc.y >= height) { return; } 	// don't freeze boot if not in the freeze

	log.info("MT booting player at "+pc.y+" "+pc);
	
	pc.apiSendAnnouncement({
		type: 'vp_canvas',
		uid: 'freeze',
		canvas: {
			color: '#0000cc',
			steps: [
				{alpha:.5, secs:.5},
				{alpha:.5, secs:.25},
				{alpha:0, secs:.5},
				{alpha:0, secs:3.75}
			],
			loop: false
		}
	});
	
	// If the pc is on a ladder, knock them off. Otherwise, the change in physics 
	// has no effect.
	var ladder = pc.isOnLadder();
	if (ladder) {
		pc.teleportToLocation(pc.location.tsid, pc.x, ladder.y);
		log.info("MT teleported player to "+ladder.y);
	}
	else if (!pc.isInAir()) {
		pc.teleportToLocation(pc.location.tsid, pc.x, pc.y+30); // teleport the player down by the height of the player
		log.info("MT teleported player to "+pc.y+30);
	}
	
	pc.addCTPCPhysics({
						gravity: 4,
						duration_ms : floatval(0.5)*1000
						}, this.tsid);
}

// Overlay display
// If isFaded is true, the overlay will fade in for the 1.5 * the number of seconds specified in 
// this.rungs[rung].freezeTime (see config.party_spaces).
function displayFreeze(rung, isFaded){ 
	log.info("MT displayFreeze: "+rung);
	
	if (this.rungs) {
		var data = this.rungs[rung];
	}
	else { 
		return;
	}

	for (var id in data.ids) { 
		if (isFaded) { 
			log.info("MT Turning on "+data.ids[id]+" with fade time "+data.freezeTime*1500);
			this.geo_deco_toggle_visibility(data.ids[id], true, data.freezeTime * 1500);
		}
		else {
			log.info("MT Turning on "+data.ids[id]);
		
			this.geo_deco_toggle_visibility(data.ids[id], true);
		}
	}
}

// Overlay removal
function removeFreeze(rung) {
	log.info("MT removeFreeze "+rung);
	if (this.rungs) {
		var data = this.rungs[rung];
	}
	else { 
		log.error("MT Bad mountain data, can't remove freeze");
		return;
	}

	for (var id in data.ids) { 
		log.info("MT removeFreeze for: "+data.ids[id]);
		this.geo_deco_toggle_visibility(data.ids[id], false, 1);
	}
}

function showColdZoneOverlays(){
	log.info('MT showColdZoneOverlays');
	var hitboxes = this.find_hitboxes_by_id_prefix('coldzone_');
	for(var i in hitboxes){
		var annc = {
			type: 'location_overlay',
			swf_url: overlay_key_to_url('cold_zone_overlay'),
			x: hitboxes[i].x,
			y: hitboxes[i].y+70,
			uid: 'freeze_tile_'+hitboxes[i].id
		};

		log.info("MT coldzone hitbox dimensions "+hitboxes[i].w+" "+hitboxes[i].h);
		this.apiSendMsg({type: 'overlay_cancel', uid: 'freeze_tile_'+hitboxes[i].id});
		this.apiSendAnnouncement(annc);
	}

}

//*******************************
// Wind gusts
//*******************************

function enableWindZone(id) {
	//log.info("MT displaying wind "+id);
	
	var hitbox = this.find_hitbox_by_id(id);
	if (hitbox){
		var annc = { 
					type: "location_overlay",
					swf_url: overlay_key_to_url("wind_fog_vertical_overlay"),
					x: hitbox.x,
					y: hitbox.y+49,
					uid: id
					};
		this.apiSendAnnouncement(annc);
	}
}

function disableWindZone(id) {
	//log.info("MT canceling wind zone id "+id);
	this.apiSendMsg({type: "overlay_cancel", uid:id});
}

function onInitWindZones() { 
	this.duration = 2;
	this.interval = 4;
	
	this.constant_wind_zones = false;
	
	this.tick_length_ms = 1000; 

	var vhitboxes = this.find_hitboxes_by_id_prefix("vwindzone_");
	var hhitboxes = this.find_hitboxes_by_id_prefix("hwindzone_");
	
	this.vwindzones = {};
	this.hwindzones = {};
	
	for (var i in vhitboxes) { 
		var id = vhitboxes[i].id;
		this.vwindzones[id] = {};
		this.vwindzones[id].start = randInt(0, this.interval - 1);
		this.vwindzones[id].duration = this.duration;
		

	}

	for (var i in hhitboxes) { 
		var id = hhitboxes[i].id;
		this.hwindzones[id] = {};
		this.hwindzones[id].start = randInt(0, this.interval - 1);
		this.hwindzones[id].duration = this.duration;
	}
}

// Player is leaving the level, check all windzones and remove the player from them if 
// needed
function removePlayer(pc) {
	log.info("MT removing player from level "+pc);

	delete pc['mountaineering_state'];
	pc.apiCancelTimer('onWindZone');
	
	for (var id in this.vwindzones) { 
		if (this.vwindzones[id].pcs){
			if (this.vwindzones[id].pcs[pc.tsid]) { 
				log.info("MT Removing "+pc+" from windzone "+id);
				pc.onExitWindZone(id);
			}
		}
	}
	
	for (var id in this.hwindzones) { 
		if (this.hwindzones[id].pcs){
			if (this.hwindzones[id].pcs[pc.tsid]) { 
				pc.onExitWindZone(id);
			}
		}
	}
}

function removePlayerFromWind(tsid, id) {
	//log.info("MT removing player from wind zone");

	if (this.vwindzones[id]) {
		delete this.vwindzones[id].pcs[tsid];
	}
	
	if (this.hwindzones[id]) { 
		delete this.hwindzones[id].pcs[tsid];
	}
}

// Handle toggling of wind zones
function onWindTick() {
	//log.info("MT vwindzones "+this.vwindzones);

	for (var id in this.vwindzones) { 
		//log.info("MT id is "+id + " and windzone is "+this.vwindzones[id]);
	
		if (this.constant_wind_zones) { 
			//log.info("MT wind is constant");
			this.enableWindZone(id);
			
			var pcs = this.vwindzones[id].pcs;
			for (var tsid in pcs) { 
				getPlayer(tsid).onEnterVWindZone(id);
			}
		}
		else if (this.vwindzones[id].start > 0) {
			//log.info("MT wind is starting");
			this.vwindzones[id].start -= 1;
			
			if (this.vwindzones[id].start == 0) { 
				this.enableWindZone(id);
				
				var pcs = this.vwindzones[id].pcs;
				//log.info("MT pcs is "+pcs);
				for (var tsid in pcs) { 
					//log.info("player "+tsid);
					getPlayer(tsid).onEnterVWindZone(id);
				}
			}
		}
		else {
			//log.info("MT wind turning off");
			this.vwindzones[id].duration -= 1;
			
			if (this.vwindzones[id].duration <= 0) { 
				this.disableWindZone(id);
				
				var pcs = this.vwindzones[id].pcs;
				for (var tsid in pcs) {
					getPlayer(tsid).removePhysics(tsid, true);
					getPlayer(tsid).sendActivity("Hey, the wind stopped. What a relief!");
				}
				
				this.vwindzones[id].start = this.interval;
				this.vwindzones[id].duration = this.duration;
			}
		}
	}

	for (var id in this.hwindzones) { 
		if (this.constant_wind_zones) { 
			this.enableWindZone(id);
			
			var pcs = this.hwindzones[id].pcs;
				//log.info("MT pcs is "+pcs);
			for (var tsid in pcs) { 
				//log.info("player "+tsid);
				getPlayer(tsid).onEnterHWindZone(id);
			}
		}
		else if (this.hwindzones[id].start > 0) {
			this.hwindzones[id].start -= 1;
			
			if (this.hwindzones[id].start == 0) { 
				this.enableWindZone(id);
				
				var pcs = this.hwindzones[id].pcs;
				//log.info("MT pcs is "+pcs);
				for (var tsid in pcs) { 
					//log.info("player "+tsid);
					getPlayer(tsid).onEnterHWindZone(id);
				}
			}
		}
		else {
			this.hwindzones[id].duration -= 1;
			
			if (this.hwindzones[id].duration <= 0) { 
				this.disableWindZone(id);
				
				var pcs = this.hwindzones[id].pcs;
				for (var tsid in pcs) {
					getPlayer(tsid).removePhysics(tsid, true);
					getPlayer(tsid).sendActivity("Hey, the wind stopped. What a relief!");
				}
				
				this.hwindzones[id].start = this.interval;
				this.hwindzones[id].duration = this.duration;
			}
		}
	}
	
	this.apiSetTimer("onWindTick", 1000);
}

function makeWindConstant() {
	this.constant_wind_zones = true;
}

function makeWindVariable() { 
	this.constant_wind_zones = false;
}

function distributeRewards(){

	for (var i in this.activePlayers){
		var player = this.activePlayers[i];
		if (this.rewards['xp']){
			player.stats_add_xp(this.rewards['xp']);
		}
		if (this.rewards['currants']){
			player.stats_add_currants(this.rewards['currants']);
		}
		if (this.rewards['mood']){
			player.metabolics_add_mood(this.rewards['mood']);
		}
		if (this.rewards['energy']){
			player.metabolics_add_energy(this.rewards['energy']);
		}
		if (this.rewards['favor_giant'] && this.rewards['favor_points']){
			player.stats_add_favor_points(this.rewards['favor_giant'], this.rewards['favor_points']);
		}
		if (this.rewards['items']){
			for (var j in this.rewards['items']){
				if (this.rewards['items'][j]['type'] == 1){
					player.createItem(this.rewards['items'][j]['class_id'], this.rewards['items'][j]['num'], true);
				}else if (this.rewards['items'][j]['type'] == 2){
					player.runDropTable(this.rewards['items'][j]['class_id']);
				}
			}
		}
	}
}

function setCurrentRungState(rung, state){
	if (this.done) {
		log.info("MT setting rung while expedition is compelete");
		return; 	// don't do anything if the players are already at the top
	}

	if (!this.rungs) { 
		log.info("MT no rungs to set");
		return;
	}
	
	if (state != undefined){
		this.current_freeze_rung_state = state;
	}
	
	
	switch (this.current_freeze_rung_state){
		case 1:{
			this.notifyAllPlayers('Lookout the freeze is about to drop!');
			break;			
		}
		case 2:{
			this.notifyAllPlayers('Do you feel that? It\'s getting colder up here.');
			break;			
		}
	}
	
	if (this.current_freeze_rung_state == 0) {
		rung = rung-1;
	}

	if (this.current_freeze_rung != rung){
		log.info('MT setCurrentRungState -- rung:'+this.current_freeze_rung+'->'+rung+' , state:'+this.current_freeze_rung_state+'->'+state);

		this.current_freeze_rung = rung;
		this.current_freeze_rung_state = this.getRungStateCount(this.current_freeze_rung);

		if (this.rungs[this.current_freeze_rung]){
			// Any active rung
			this.disablePlatsAbove(this.rungs[this.current_freeze_rung].yPos);		
			this.freezeBootAllPlayers(this.rungs[this.current_freeze_rung].yPos);				
			this.extinguishLanterns(this.current_freeze_rung);
			this.displayFreeze(this.current_freeze_rung); 

			this.resetRungTimer();
			this.updateRungTimer();

			this.setFreeze(this.current_freeze_rung);
		}
		if (this.current_freeze_rung > 1){
			// Any rung but the first rung
			this.setPermanentLanterns(this.current_freeze_rung-1);
		}
	}
	
	
	if (this.current_freeze_rung > 1){

		this.apiCancelTimer('declineRungState');
		var data = this.rungs[this.current_freeze_rung];
		if (data){
			var time = data.freezeTime/this.getRungStateCount(this.current_freeze_rung);
			this.apiSetTimer('declineRungState', time*1000);			
		}else{
			this.onFreezeBeaten();
		}
	}else{
		this.apiCancelTimer('declineRungState')
		this.removeRungTimer();		
	}
	
	if (!this.start_time){
		this.start_time = getTime();
	}
}

function setFreeze(rung){
	
	var enabled = true;
	for (var i in this.rungs){
		var data = this.rungs[i];
		for (var id in data.ids) { 
			enabled = i >= rung;

			this.geo_deco_toggle_visibility(data.ids[id], enabled);
		}
	}
}

function restartExpedition(){
	this.done = false;
	this.freezeBeaten = false;
	delete this.start_time;

	this.setCurrentRungState(1, 5);
	this.freezeBootAllPlayers(this.rungs[this.current_freeze_rung].yPos);
	this.removeLanternCounter();
	this.removeRungTimer();
	this.removeMessages();

	// Clear each players mountaineering state
	for (var player in this.activePlayers) { 
		var pc = getPlayer(player);
		if (pc){
			delete pc['mountaineering_state'];
		}
	}
}

function onEnterFinishLine(pc){
	pc['mountaineering_state'] = 'done';
	log.info("MT "+pc+" state is "+pc['mountaineering_state']);
	
	if (!this.freezeBeaten) return;

	var all_done = true;
	for (var player in this.activePlayers) { 
		log.info("MT "+getPlayer(player)+" state is "+getPlayer(player)['mountaineering_state']);
		if (getPlayer(player)['mountaineering_state']	!= 'done') { 
			all_done = false;
			break;
		}
	}
	
	if (all_done) { 	
		this.onCompleteExpedition()
	}	
}

function onCompleteExpedition(){
	this.done = true;
	
	this.removeRungTimer();
	this.removeLanternCounter();
	this.apiSendMsg({type: 'overlay_cancel', uid:'winner'});
	this.apiSendMsg({type: 'overlay_cancel', uid:'winner_time'});
	
	this.end_time = getTime();

	this.apiSendAnnouncement({
		uid: "winner",
		type: "vp_overlay",
		duration: 60000,
		locking: false,
		width: 500,
		x: '50%',
		top_y: '5%',
		click_to_advance: false,
		text: ['<p align="center"><span class="game_splash_race">Yay! You all reached the top of the mountain!</span></p>']		
	});

	this.apiSendAnnouncement({
		uid: "winner_time",
		type: "vp_overlay",
		duration: 60000,
		locking: false,
		width: 500,
		x: '50%',
		top_y: '15%',
		click_to_advance: false,
		text: ['<p align="center"><span class="game_splash_race">It took you '+((this.end_time-this.start_time)/1000).toFixed(2)+' seconds.</span></p>']		
	});
	
	this.distributeRewards();
}

function onFreezeBeaten(){
	this.freezeBeaten = true;
	log.info("MTim - past last rung");
	this.apiCancelTimer('declineRungState')
	this.enableAllPlats();
	this.removeRungTimer();
	this.removeLanternCounter();
	this.setFreeze(this.current_freeze_rung);
	this.setPermanentLanterns(this.current_freeze_rung-1);

	this.apiSendAnnouncement({
		uid: "winner",
		type: "vp_overlay",
		duration: 0,
		locking: false,
		width: 500,
		x: '50%',
		top_y: '15%',
		click_to_advance: false,
		text: ['<p align="center"><span class="game_splash_race">The freeze is gone! Everybody get to the summit to claim your rewards.</span></p>']		
	});
}

function onEnterFreeze(pc, rung){
	if (rung >= this.current_freeze_rung){
		log.info("MT collision booting player "+pc+" at current rung "+this.current_freeze_rung);
		this.freezeBootPlayer(pc);
	}	
}

function removeMessages(){
	this.apiSendMsg({type: 'overlay_cancel', uid:'winner'});
	this.apiSendMsg({type: 'overlay_cancel', uid:'winner_time'});	
}

///////////////////// Coins tests //////////////////////////
function onStartCoinMovement(pc, distance, speed) { 
	log.info("Coins test starting coin move");
	var coins = this.find_items('quoin');
	
	if (!this.coins) { 
		this.coins = []; 
		for (var i in coins) { 
			var coin = {tsid: coins[i].tsid, y:coins[i].y};
			log.info("Coins test "+coin);
			this.coins.push(coin);
		}
	}
	
	var g = this.geo;
	if (g.ground_y) var floor = g.ground_y;
	else var floor = pc.y;
	
	var delays = [ 0, 500, 1000, 1500, 2000];
	
	if (!distance) { distance = 1000; }
	if (!speed) { speed = 300; }
	
	log.info("Coins test floor is "+floor+" coins is "+coins);
	for (var i in coins) { 
		var time_delay = choose_one(delays);
		log.info("Coins time delay is "+time_delay);
		coins[i].apiSetTimerX("apiStartMove", time_delay, 0, 250, 1190);
		coins[i].apiSetTimerX("apiMoveToXY", time_delay, coins[i].x, coins[i].y + distance, speed, null);
	}
}

function onResetCoinMovement() { 
	log.info("Coins test reset");
	if (this.coins) { 
		for (var i in this.coins) {
			log.info("Coins resetting "+this.coins[i]);
			var coin = apiFindObject(this.coins[i].tsid);
			coin.apiSetXY(coin.x, this.coins[i].y);
			coin.onRespawn();
		}
	}
}