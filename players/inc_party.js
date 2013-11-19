
//
// invite someone to join our party
//

function party_invite(pc, silent){

	if (!this.has_done_intro){
		return false;
	}

	//
	// make sure we're in a party.
	// if we're not, create an ephemeral one
	//

	var created = false;

	if (!this.party){

		created = true;
		this.party_create();
	}


	//
	// invite
	//

	var ret = this.party.send_invite(this, pc, silent);

	if (ret != 'ok' && created){

		log.info('XX destroying after sending invite...');

		this.party.leave(this, 'invites-done');
	}


	//
	// messaging
	//

	switch (ret){
		case 'invited':
			this.party_activity(utils.escape(pc.label)+" has already been invited to join your party.");
			break;
		case 'offline':
			this.party_activity(utils.escape(pc.label)+" is currently offline.");
			break;
		case 'other_party':
			this.party_activity(utils.escape(pc.label)+" is already in a party.");
			break;
		case 'full':
			this.party_activity("Your party is full!");
			break;
		case 'kicked':
			this.party_activity(utils.escape(pc.label)+" has been removed from your party - only the party creator can re-invite them.");
			break;
		case 'newxp':
			this.party_activity(utils.escape(pc.label)+" cannot yet join your party.");
			break;
		case 'ok':
			this.party_activity("You have invited "+utils.escape(pc.label)+" to join your party.");
			break;
		default:
			this.party_activity("Unknown invite response: "+ret);
	}

	return ret;
}

//
// leave our current party
//

function party_leave(){

	//log.info(this.tsid+'.party_leave()');

	if (this.party) this.party.leave(this, 'left');
}


//
// are we in a party?
//

function party_is_in(){

	return this.party ? true: false;
}

function party_get(){
	return this.party;
}

function party_is_full(){
	return this.party && this.party.is_full();
}


//
// we have been invited to join a party. show
// invitation and maybe join.
//

function party_invited(party, inviter){

	var txt = utils.escape(inviter.label)+" has invited you to join their ";

	var space = party.get_space();
	if (space){
		var loc = apiFindObject(space.get_entrance());
		if (loc){
			txt += "Party in "+utils.escape(loc.label)+".";
		}
		else{
			txt += "Party Chat.";
		}
	}
	else{
		txt += "Party Chat.";
	}

	this.prompts_add({
		callback	: 'familiar_invite_read',
		party		: party,
		inviter		: inviter,
		txt		: txt,
		timeout		: config.party_invite_timeout-1,
		icon_buttons	: true,
		choices		: [
			{ label : 'OK', value: 'accept' },
			{ label : 'No thanks', value: 'decline' }
		]
	});		
}

function familiar_invite_read(choice, details){

	if (choice == 'accept'){
		details.inviter.party_invite_accepted(this);
	}

	if (choice == 'decline'){
		details.inviter.party_invite_declined(this);
	}
}


//
// somebody we invited has responded. these functions
// proxy to our *current* group, to allow the group to
// change while the invite is outstanding
//

function party_invite_accepted(pc, auto_space){
	if (!this.party) this.party_create();
	this.party.accept_invite(pc, this, auto_space);
}

function party_invite_declined(pc){
	if (!this.party) this.party_create();
	this.party.decline_invite(pc, this);
}


//
// our party invite has expired
//

function party_uninvited(party, inviter){

	// TODO: remove any invites from this player from the familiar queue

	this.party_activity('Your invite from '+utils.escape(inviter.label)+' to join their party has expired');
}


//
// we are no longer in a party
//

function party_left(reason){

	//log.error('party_left for '+this.tsid);

	delete this.party;

	switch (reason){
		case 'disband':
			this.apiSendMsg({ type :'party_leave' });
			this.party_activity("Your party has been disbanded");
			break;
		case 'invites-done':
			// the party was only emphemeral, being used for invites
			break;
		case 'left':
			this.apiSendMsg({ type :'party_leave' });
			this.party_activity("You have left the party");
			break;
		case 'offline':
			// everyone went offline
			break;
		default:
			this.apiSendMsg({ type :'party_leave' });
			this.party_activity("Left party for unknown reason: "+reason);
	}

	//this.sendActivity('MSG:party_leave');
}


//
// we're now the leader of the party
//

function party_now_leader(){

	this.party_activity('now leader of party');
}


//
// we have joined a party
//

function party_joined(party, reason, pc){

	//log.error("party_joined for "+this.tsid);

	this.party = party;

	var m = party.get_members();

	//this.sendActivity('MSG:party_join');
	this.apiSendMsg({
		type	: 'party_join',
		members	: m
	});

	if (reason == 'invite_accepted'){

		this.party_activity(utils.escape(pc.label)+' accepted your party invite.');

	}else{

		var m_names = [];
		for (var i in m){
			if (i != this.tsid){
				m_names.push(utils.escape(m[i].label));
			}
		}

		this.party_activity("You joined a party with "+pretty_list(m_names, ' and '));
	}
}


//
// some one declined our invite
//

function party_declined(pc, expired){

	if (expired){
		this.party_activity(utils.escape(pc.label)+' has declined your invitation (expired)');
	}else{
		this.party_activity(utils.escape(pc.label)+' has declined your invitation');
	}
}


//
// someone else joined or left our party
//

function party_member_joined(pc, invited){

	if (invited){
		this.party_activity(utils.escape(pc.label)+' accepted your party invite.');
	}else{
		this.party_activity(utils.escape(pc.label)+' has joined the party');
	}

	//this.sendActivity('MSG:party_add');
	this.apiSendMsg({
		type	: 'party_add',
		pc	: pc.make_hash_online()
	});
}

function party_member_left(pc, reason){

	this.party_activity(utils.escape(pc.label)+" has left the party");

	//this.sendActivity('MSG:party_remove');
	this.apiSendMsg({
		type	: 'party_remove',
		pc_tsid	: pc.tsid
	});
}


//
// party member changed online status
//

function party_member_online(pc){

	this.party_activity("Party member "+utils.escape(pc.label)+" has come online");

	//this.sendActivity('MSG:party_online');
	this.apiSendMsg({
		type	: 'party_online',
		pc_tsid	: pc.tsid
	});
}

function party_member_offline(pc){

	this.party_activity("Party member "+utils.escape(pc.label)+" has gone offline");

	//this.sendActivity('MSG:party_offline');
	this.apiSendMsg({
		type	: 'party_offline',
		pc_tsid	: pc.tsid
	});
}


//
// player going offline and coming online
//

function party_logout(){

	if (this.party) this.party.player_logout(this);
}

function party_login(){

	if (this.party) this.party.player_login(this);
}


//
// chatting
//

function party_chat(txt){

	if (this.party){

		this.party.chat(this, txt);

		apiLogAction('CHAT_PARTY', 'pc='+this.tsid, 'party='+this.party.tsid, 'msg='+txt);
	}else{
		this.party_activity("You're not in a party!");
	}
}


//
// used for when we log in, to see if we're in a party the client needs to
// know about
//

function party_members(){

	if (this.party){
		var m = this.party.get_members();
		if (num_keys(m) > 1) return m;
	}

	return null;
}


//
// remove & return any pending invites to the current party
// sent by us. used for moving invites to a new group with us.
//

function party_get_invites_sent(){

	if (this.party) return this.party.remove_invites_from(this.tsid);

	return null;
}

/////////////////////////////////////////////////////////////////////////////////////////////

//
// Party Space code
//

function party_has_space(){
	if (this.party && this.party.get_space()) return true;
}

function party_start_space(template, duration){
	if (!this.party) return {ok: 0, error: "You are not in a party."};
	if (this.party_has_space()) return {ok: 0, error: "There's already a space!"};

	this.party.create_space(template, duration, this);

	return {ok: 1};
}

function party_enter_space(){
	if (!this.party) return {ok: 0, error: "You are not in a party."};

	if (this.party.enter_space(this)){
		return {ok: 1};
	}
	else{
		return {ok: 0, error: "Could not enter the space."};
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////

//
// private API below here
//


//
// create a new party with just us in it
//

function party_create(){

	//log.error('party_create for '+this.tsid);

	this.party = apiNewGroup('party');

	this.party.init(this);
}


//
// send a party activity notice
//

function party_activity(msg){

	this.sendMsgOnline({
		type: 'party_activity',
		txt: msg
	});
}

function party_space_prompt(){
	if (!this.party) return;

	var ret = this.party.get_space_details();
	var pcs = [];
	for (var i in ret.players){
		pcs.push(ret.players[i].make_hash());
	}

	var energy_cost = this.teleportation_get_energy_cost();
	if (!energy_cost) energy_cost = Math.round(this.metabolics_get_max_energy() * 0.40);
	this.apiSendMsg({
		type: 'party_space_start',
		location_name: ret.label,
		img_url: ret.img_url,
		desc: ret.desc,
		pcs: pcs,
		energy_cost: energy_cost
	});
}

function party_space_prompt_callback(choice, details){	
	if (!this.party || !this.party.get_space()) {
		this.sendActivity("Sorry, but the party space has already expired.");
		return;
	}
	
	if (choice == 'energy'){
		var energy_cost = this.teleportation_get_energy_cost();
		if (!energy_cost) energy_cost = Math.round(this.metabolics_get_max_energy() * 0.40);

		if (this.metabolics_try_lose_energy(energy_cost)){
			this.party_create_teleporter();
		}
		else{
			this.sendActivity("You don't have enough energy for that.");
			this.party_space_prompt();
		}
	}
	else if (choice == 'token'){
		if (this.teleportation_spend_token("Party Space teleportation.")){
			this.party_create_teleporter();
		}
		else{
			this.sendActivity("You don't have any tokens left.");
			this.party_space_prompt();
		}
	}
	else{
		this.party_activity("If you'd like to join the Party Space later, you can do so from the Party Chat menu above.");
	}
}

function party_create_teleporter(){
	//log.info(this+' Creating party teleporter');
	var tp = this.location.createAndReturnItem('teleporter_visible', 1, this.x+100, this.y+40, 0, this.tsid);
	if (tp){
		this.announce_sound('TELEPORTER_VISIBLE_APPEAR');
		this.announce_sound_delayed('TELEPORTER_VISIBLE_PORTAL', 0, 0, 1);
		//log.info(this+' Teleporter is '+tp);
		tp.setInstanceProp('width', 50);
		tp.setInstanceProp('height', 200);
		tp.setInstanceProp('single_use', 1);
		tp.setInstanceProp('is_party', 1);
		tp.apiSetTimer('disappear', 2*60*1000);

		this.moveAvatar(tp.x-100, this.y, 'right');
	}
}

function party_find_teleporter(){
	var is_tp = function(it, args){ return it.class_tsid == 'teleporter_visible' && it.only_visible_to == args; };

	var tp = this.location.find_items(is_tp, this.tsid)[0];
	if (tp){
		this.moveAvatar(tp.x, tp.y-40, 'right');
		return true;
	}

	return false;
}

function party_extend_space_time(duration, cost){
	if (this.party){
		if (this.stats_try_remove_currants(cost, {type: 'party_space_extend', party: this.party.tsid, space_type: this.party.get_space().getProp('party_template')})){
			this.party.extend_space_time(this, duration);
			return true;
		}

		return false;
	}

	return false;
}