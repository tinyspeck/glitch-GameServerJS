function isVisibleTo(pc) {
	return !this.only_visible_to || (this.only_visible_to == pc.tsid);
}

function distanceFromPlayer(pc){
	var location = this.getLocation();
	if (!location) return 999999;
	
	if (location.tsid == pc.tsid) return 0;
	if (location.tsid != pc.location.tsid) return 9999999;
	var x = Math.abs(this.x - pc.x);
	var y = Math.abs(this.y - pc.y);
	return Math.sqrt((x*x)+(y*y));
}

function distanceFromItem(item){
	var location = this.getLocation();
	if (!location) return 999999;
	
	if (location.tsid != item.getLocation().tsid) return 9999999;
	var x = Math.abs(this.x - item.x);
	var y = Math.abs(this.y - item.y);
	return Math.sqrt((x*x)+(y*y));
}

function buildVerbMessage(count, verb, verb_past, failed, more_msgs, self_effects, they_effects, target){

	var msg = 'You ';


	//
	// verb
	//

	if (failed){
		msg += "tried to "+verb+" ";
	}else{
		msg += verb_past+" ";
	}
	
	
	//
	// target (optional)
	//
	
	if (target){
		if (target.is_player) {
			msg += linkifyPlayer(target)+ " with ";
		}
		else { 
			msg += utils.escape(target.label) + " with ";
		}
	}


	//
	// article
	//

	// bad hack to correct the article for "roasted pepitas" which are always plural even when singular
	if (this.name_single == 'Roasted Pepitas' && count == 1) {
		msg += "some " + this.name_single + ": ";
	}
	else if (count > 1){
		msg += count + " " + this.name_plural + ". ";
	}else{
		msg += this.article + " " + this.name_single + ". ";
	}
	
	//
	// Effects and additional messaging
	//
	
	msg += this.buildSimpleVerbMessage(more_msgs, self_effects, they_effects);

	return msg;
}

function buildSimpleVerbMessage(more_msgs, self_effects, they_effects){
	
	var msg = '';

	//
	// flavor messages
	// each should have end punctuation, but no trailing spaces
	//

	for (var i in more_msgs){
		msg += this.formatFlavorText(more_msgs[i])+' ';
	}


	//
	// next comes effects upon yourself
	//

	if (self_effects.length){

		var effects = this.transformEffects(self_effects, 0);

		if (effects.length){
			var effects_text = this.formatEffectsList(effects);

			msg += effects_text+'';
		}
	}


	//
	// and effects on everybody else
	//

	if (they_effects.length){

		var effects = this.transformEffects(they_effects, 1);

		if (effects.length){
			var effects_text = this.formatEffectsList(effects);

			msg += 'Everyone around you: '+effects_text+'. ';
		}
	}
	
	return msg;
}

function formatEffectsList(effects){

	if (effects.length == 1){

		return effects[0];
	}else{
		return effects.join(' ');
	}
}


function transformEffects(effects, plural){

	var gain = '+';
	var lose = '-';
	var out = [];

	for (var i in effects){
		var e = effects[i];

		switch (e.type){

			case 'metabolic_dec':
				var v = Math.abs(e.value);
				out.push(lose+v+' '+capitalize(e.which));
				break;

			case 'metabolic_inc':
				var v = Math.abs(e.value);
				out.push(gain+v+' '+capitalize(e.which));
				break;
		
			case 'xp_give':
				var v = Math.abs(e.value);
				out.push(gain+v+' iMG');
				break;
			
			case 'favor_give':
				var v = Math.abs(e.value);
				out.push(gain+v+' favor with '+capitalize(e.which));
				break;
			
			case 'item_take':
				var v = Math.abs(e.value);
				out.push(lose+v+' '+e.which);
				break;
			
			case 'item_give':
				var v = Math.abs(e.value);
				out.push(gain+v+' '+e.which);
				break;
			
			case 'msp_inc':
				var v = Math.abs(e.value);
				out.push(gain+v+' points in '+e.which);
				break;

			default:
				out.push('NO RULE FOR FORMATTING EFFECT '+e.type);
		}
	}

	return out;

}

function buildVerbEveryoneMessage(pc, count, verb, verb_past, failed, my_msgs, my_effects){

	var msg = pc.label+' ';


	//
	// verb
	//

	if (failed){
		msg += "tried to "+verb+" ";
	}else{
		msg += verb_past+" ";
	}


	//
	// article
	//

	if (count > 1){

		msg += count + " " + this.name_plural + ". ";
	}else{
		msg += this.article + " " + this.name_single + ". ";
	}


	//
	// flavor messages
	// each should have end punctuation, but no trailing spaces
	//

	for (var i in my_msgs){
		msg += this.formatFlavorText(my_msgs[i])+' ';
	}


	//
	// effects upon yourself
	//

	if (my_effects.length){

		var effects = this.transformEffects(my_effects, 0);
		var effects_text = this.formatEffectsList(effects);

		msg += 'You '+effects_text+'. ';
	}

	return msg;
}

function formatFlavorText(txt){
	// TODO: make sure this ends with punctuation and has
	// no trailing whitespace

	return txt;
}

function buildState(){
	if (this.is_invisible) return 'visible:false';
	var s = this.state ? this.state : intval(this.count);

	if (this.dir){
		//log.info('building state for stack with direction', this.dir);
		if (this.dir == 'left'){
			return '-' + s;
		}
	}

	return s;
}

function setInvisible(){
	this.is_invisible = true;
	this.broadcastState();
}

function setVisible(){
	delete this.is_invisible;
	this.broadcastState();
}

function setAndBroadcastState(state){
	if (state == this.state) return;
	this.state = state;
	this.broadcastState();
}

function broadcastState(){
	var container = this.apiGetLocatableContainerOrSelf();
	if (!container) return false;
	
	if (container.container){
		var root = container.container;
	}
	else{
		var root = container;
	}
	
	root.apiSendMsg({
		type: 'item_state',
		itemstack_tsid: this.tsid,
		s: this.buildState(),
	});

	return true;
}

function broadcastStatus(){
	if (!this.onStatus) return;
	var container = this.apiGetLocatableContainerOrSelf();
	if (!container) return;
	
	if (container.container){
		var root = container.container;
	}
	else{
		var root = container;
	}
	
	var self = this;
	root.activePlayers.apiIterate(function(pc){
		var l_self = self;
		pc.apiSendMsg({
			type: 'itemstack_status',
			itemstack_tsid: l_self.tsid,
			status: l_self.onStatus(pc)
		});
	});
}

function broadcastConfig(){
	var container = this.apiGetLocatableContainerOrSelf();
	if (!container) return;
	
	if (container.container){
		var root = container.container;
	}
	else{
		var root = container;
	}
	
	if (!this.make_config) return;
	
	root.apiSendMsg({
		type: 'item_config',
		itemstack_tsid: this.tsid,
		config: this.make_config(),
	});
}

function triggerState(s){
	var old = this.state;
	this.state = s;
	this.broadcastState();
	this.state = old;
}

function adminGetInstanceProps(){

	var out = {};

	for (var i in this.instancePropsDef){
		if (!this.instanceProps){
			this.instanceProps = {};
		}

		out[i] = {
			def: this.instancePropsDef[i],
			value: this.instanceProps[i],
			choices: (this.instancePropsChoices && this.instancePropsChoices[i]) ? this.instancePropsChoices[i].join(',') : ''
		};

		if (out[i].choices == 'LOCATION_EVENT'){

			// get location events for this location
			var con = this.getLocation();
			out[i].choices = con.events_get_list ? con.events_get_list().join(',') : '';
		}
	}

	return out;
}

function adminSetInstanceProp(args){

	var prop = args.prop;
	var value = args.value;

	var ret = this.setInstanceProp(prop, value);
	if (ret) this.broadcastConfig();
	return ret;
}

function adminSetPosition(args){
	this.x = args.x;
	this.y = args.y;
	
	return {x: this.x, y: this.y};
}

function setAllInstanceProps(props){
	if (!this.instanceProps && this.initInstanceProps) this.initInstanceProps();

	for (var i in props){
		if (this.instancePropsDef[i] != null){
			this.instanceProps[i] = props[i];
		}
	}

	if (this.onPropsChanged) this.onPropsChanged();
	return true;
}

function setInstanceProp(prop, value){
	if (!this.instanceProps && this.initInstanceProps) this.initInstanceProps();

	if (this.instancePropsDef && this.instancePropsDef[prop] != null){

		this.instanceProps[prop] = value;
		if (this.onPropsChanged) this.onPropsChanged();
		return 1;
	}
	
	return 0;
}

function getInstanceProp(prop){
	if (this.instancePropsDef && this.instancePropsDef[prop] != null && this.instanceProps){
		return this.instanceProps[prop];
	}
	
	return undefined;
}

function getClassProp(prop){
	if (this.classProps && this.classProps[prop]){
		return this.classProps[prop];
	}
	
	return undefined;
}

//
// proxy a verb action to another itemstack. used for
// verbs which exist on the tool and the target
// (e.g. 'hoe' on hoe & 'tend' on patch)
//

function proxyVerb(pc, msg, target_class_tsid, max_distance, verb){

	var it = pc.findCloseStack(target_class_tsid, max_distance);

	if (it){

		return it.verbs[verb].handler.call(it, pc, msg);
	}

	return 0;
}

// Proxy the verb conditions (used by 'dig' on shovel to check if there is enough dirt to dig)
function proxyVerbEnabled(pc, target_class_tsid, max_distance, verb){

	var it = pc.findCloseStack(target_class_tsid, max_distance);

	if (it){

		return it.verbs[verb].conditions.call(it, pc);
	}

	return {state:null};
}


function adminReplaceWith(args){
	var n = this.replaceWith(args.class_tsid);
	return {
		ok: 1,
		tsid: n.tsid,
	};
}

function replaceWithPoofIfOnGround(new_class_tsid, force_container) {
	var s;
	if (this.isOnGround()) {
		s = this.container.createItemStackWithPoof(new_class_tsid, 1, this.x, this.y);
		this.apiDelete();
	} else {
		s = this.replaceWith(new_class_tsid, force_container);
	}

	return s;
}

function deleteWithPoof(delta_x, delta_y) {

	var container = this.container;
	if (delta_x == undefined) delta_x = 0;
	if (delta_y == undefined) delta_y = 0;

	if (container.hubid){
		var annc = {
			type: 'itemstack_overlay',
			swf_url: overlay_key_to_url('proto_puff'),
			itemstack_tsid: this.tsid,
			delta_x: delta_x,
			delta_y: delta_y
		};

		container.apiSendAnnouncement(annc);
		container.announce_sound_to_all('PROTO_PUFF');
	}

	this.apiSetTimer('apiDelete', 200);
}

function replaceWith(new_class_tsid, force_container, count){
	if (!count) count = 1;
	if (this.container && !force_container){
		var container = this.container;
	}
	else if (force_container){
		var container = force_container;
	}
	else{
		return null;
	}

	var n = apiNewItemStack(new_class_tsid, count);

	if (this.canWear && this.canWear() && n.canWear){
		n.setInstanceProp('cultivation_wear', this.getInstanceProp('cultivation_wear'));
		n.setProp('proto_class', this.getProp('proto_class'));
	}
	
	//
	// in the pack or in the street?
	//

	if (container.location || container.is_bag){
		//
		// what slot in the pack are we?
		//
		
		var contents = container.getContents();
		var slot = 0;
		for (slot in contents){
			if (contents[slot] && contents[slot].tsid == this.tsid){
				break;
			}
		}
		
		this.apiDelete();
		var remaining = container.addItemStack(n, slot);
		if (remaining){
			container.addItemStack(n);
		}
	}
	else{
		container.apiPutItemIntoPosition(n, this.x, this.y);
		this.apiDelete();
	}

	return n;
}

function sendBubble(msg, duration, pc, rewards, allow_out_of_viewport_top, suppress_local_chat){
	var location = this.getLocation();
	if (!location) return;

	var rsp = {
		type: "itemstack_bubble",
		msg: msg,
		itemstack_tsid: this.tsid,
		duration: duration // in milliseconds!
	};
	
	if (allow_out_of_viewport_top) {
		rsp.allow_out_of_viewport_top = true;
	}

	if (this.classProps){
		if (this.classProps.conversation_offset_x) rsp.offset_x = intval(this.classProps.conversation_offset_x);
		if (this.classProps.conversation_offset_y) rsp.offset_y = intval(this.classProps.conversation_offset_y);
	}

	if (this.instanceProps){
		if (this.instanceProps.conversation_offset_x) rsp.offset_x = intval(this.instanceProps.conversation_offset_x);
		if (this.instanceProps.conversation_offset_y) rsp.offset_y = intval(this.instanceProps.conversation_offset_y);
	}
	
	// http://svn.tinyspeck.com/wiki/RewardsHash
	if (rewards){
		if (rewards.xp){
			if (!rewards.imagination) rewards.imagination = 0;
			rewards.imagination += rewards.xp;
			delete rewards.xp;
		}
		rsp.rewards = rewards;
	}
	
	if (pc){
		pc.apiSendMsg(rsp);
	}
	else{
		location.apiSendMsg(rsp);
	}

	if (pc && !suppress_local_chat && (this.hasTag('bubbles_in_chat') || location.is_newxp)) pc.apiSendMsg({type: 'npc_local_chat', tsid: this.tsid, txt: msg.replace(new RegExp('<split butt_txt="[^"]+">', 'g'), '<br><br>')});
}

function formatStack(num){

	if (num == 1) return this.article+' '+this.name_single;
	return num+' '+this.name_plural;
}

function hasTag(tag){
	if (!this.tags) return false;
	
	if (in_array(tag, this.tags)){ return true; }
	
	return false;
}

function isOnGround(){
	// No container?
	if (!this.container){
		return false;
	}
	// In a pack?
	else if (this.container.location){
		return false;
	}
	// In a street?
	else if (this.container.hubid){
		return true;
	}
	// In another bag?
	else if (this.container.is_bag){
		return false;
	}
	// WTF
	else{
		log.error(this.tsid+" doesn't know where it is!");
		return false;
	}
}

function setQuestItem(){
	this.is_quest_item = true;
}

function isQuestItem(){
	return this.is_quest_item ? true : false;
}

function setSoulbound(pc){
	this.is_soulbound_item = true;
	this.soulbound_to = pc.tsid;
}

function isSoulbound(){
	if (this.class_tsid == 'wall_segment') return false;
	return this.is_soulbound_item ? true : false;
}

function isSoulboundTo(pc){
	return this.isSoulbound() && this.soulbound_to == pc.tsid;
}

function findClosePlayer(){
	var location = this.getLocation();
	if (!location) return;
	
	var players = location.activePlayers;
	
	var best_d = 10000;
	var best_player = null;
	for (var i in players){
		var it = players[i];
		var dx = it.x - this.x;
		var dy = it.y - this.y;
		var d = Math.sqrt(dx*dx+dy*dy);

		if (d < best_d){
			best_player = it;
			best_d = d;
		}
	}
	
	return best_player;
}

function findCloseItem(class_tsid, args){
	return this.apiFindCloseItem(class_tsid, args);
}

function getContainerType(){
	//log.error('***CONTAINER', this.container);
	if (!this.container) return 'none';
	if (this.container.location) return 'pack';
	if (this.container.hubid) return 'street';
	if (this.container.is_bag) return 'bag';
	return 'unknown';
}

function addDeliveryPacket(deliveryPacket){
	this.delivery_packet = deliveryPacket;
}

function getDeliveryPacket(){
	if (this.delivery_packet){
		return this.delivery_packet;
	} else {
		return false;
	}
}

function removeDeliveryPacket(){
	delete this.delivery_packet;
}

function notifyVerb(pc, verb, count, success){

	//
	// Only things we do on success
	//

	if (success){
		var quest_flag_name = 'VERB:'+this.class_tsid+':'+verb;
		pc.quests_set_flag(quest_flag_name);
		pc.quests_inc_counter(quest_flag_name, count);

		for (var i=0; i<this.parent_classes.length; i++){
			if (this.parent_classes[i] == this.class_id) continue;
			
			quest_flag_name = 'VERB:'+this.parent_classes[i]+':'+verb;
			pc.quests_set_flag(quest_flag_name);
			pc.quests_inc_counter(quest_flag_name, count);
		}
		
		pc.achievements_increment(this.class_tsid, verb);
		pc.achievements_increment('VERB:'+verb, this.class_tsid);
		
		if (pc.location && pc.location.eventFired){
			pc.location.eventFired('verb_'+verb, this, {pc:pc});
		}
	}
}

function adminGetInfo(args){
	var out = {
		'tsid'		: this.tsid,
		'label'		: this.getLabel ? this.getLabel() : this.label,
		'item_class'	: this.class_tsid,
		'count'		: this.count,
		'container'	: this.container.tsid,
		'root'		: this.getRootContainer().tsid,
		'created'	: this.ts,
		'description'	: this.description,
		
		'x': intval(this.x),
		'y': intval(this.y),
	};
	
	// Is this a bag?
	if (this.is_bag){
		out.slots = this.capacity;
		
		out.itemstacks = {};
		var contents = this.getContents();
		for (var i in contents){
			if (contents[i]){
				out.itemstacks[contents[i].tsid] = {
					class_tsid: contents[i].class_tsid,
					label: contents[i].getLabel ? contents[i].getLabel() : contents[i].label,
					slot: contents[i].slot
				};
			}
		}
	}
	
	// Is this a trophy?
	if (this.is_trophy){
		out.itemstacks = {};
		var collection_id = this.getClassProp('collection_id');
		
		if (collection_id){
			out.collection_id = collection_id;
			out.trophy_items = [];
			
			var collection = get_achievement(collection_id);
			for (var i in collection.conditions){
				var condition = collection.conditions[i];
				if (condition.group == 'in_inventory'){
					var item = apiFindItemPrototype(condition.label);
					if (item){
						var hash = {
							class_tsid: condition.label,
							label: item.label,
							// sound
						};
						
						if (item.is_musicblock){
							hash.sound = config.music_map[condition.label.toUpperCase()];
						}
						
						out.trophy_items.push(hash);
					}
				}
			}
		}
	}
	
	if (this.getAdminStatus) out.status = this.getAdminStatus();
	
	return out;
}

function adminDelete(args){
	this.apiDelete();
}

//
// this is the default implementation of the tooltip fetching code
//

function get_tooltip(pc, verb, drop_stack){


	//
	// does this verb have conditional processing?
	//

	if (this.verbs[verb].conditions){

		var con = this.verbs[verb].conditions.call(this, pc, drop_stack);
		if (con.state == 'disabled'){
			return {
				disabled: true,
				tooltip: con.reason,
			};
		}
		if (con.state != 'enabled'){
			return {
				hidden: true,
			};
		}
	}


	//
	// looks like it's enabled - does it have a tooltip function?
	//

	var effects = this.get_effects(pc, verb);

	if (this.verbs[verb].get_tooltip){

		return {
			tooltip: this.verbs[verb].get_tooltip.call(this, pc, this.verbs[verb], effects),
			effects: effects,
			effects_simple: this.simplify_effects(effects),
		};
	}


	//
	// no function - fall back to the static tooltip
	//

	return {
		tooltip: utils.substitute(this.verbs[verb].tooltip, effects),
		effects: effects,
		effects_simple: this.simplify_effects(effects),
	};
}

function flatten_effects(pc, ret){

	//
	// this is called at the end of auto-generated effects() functions
	// to flatten the big effects structure into a nice flat
	// hash we can substitute with.
	//

	var effects = {};

	var temp = {
		pre_energy : pc.metabolics.energy.value,
		pre_mood : pc.metabolics.mood.value
	};
	
	temp.post_energy = temp.pre_energy;
	temp.post_mood = temp.pre_mood;

	for (var i=0; i<ret.self_effects.length; i++){
		var e = ret.self_effects[i];

		if (e.type == 'metabolic_dec') temp['post_'+e.which] -= e.value;
		if (e.type == 'metabolic_inc') temp['post_'+e.which] += e.value;
		if (e.type == 'metabolic_set') temp['post_'+e.which] = e.value;
	}

	effects.energy		= temp.post_energy - temp.pre_energy;
	effects.mood		= temp.post_mood - temp.pre_mood;

	effects.energy_cost	= temp.pre_energy - temp.post_energy;
	effects.mood_cost	= temp.pre_mood - temp.post_mood;

	//log.info(verb+' auto effects: ', ret, temp, effects);


	//
	// merge in any sub-effects. these are the effects returned from parent
	// classes for simple-inherited verbs.
	//

	if (ret.sub_effects){
		for (var j=0; j<ret.sub_effects.length; j++){
			for (var i in ret.sub_effects[j]){
				if (effects[i]){
					effects[i] += ret.sub_effects[j][i];
				}else{
					effects[i] = ret.sub_effects[j][i];
				}
			}
		}
	}


	return effects;
}

function simplify_effects(effects){

	if (!effects) return {};

	var out = {};

	for (var i in effects){
		if (effects[i] > 0){
			out[i] = effects[i];
		}
	}

	// Global rewrite of xp -> iMG
	if (out.xp){
		out.iMG = out.xp;
		delete out.xp;
	}

	return out;
}

function get_effects(pc, verb){

	if (this.verbs[verb].effects) return this.verbs[verb].effects.call(this, pc);

	return {};
}

//
// potions inherit from tool_base, so this also works for those, despite the name
//
function get_tool_state(){
	if (!this.is_tool) return {};
	
	//
	// Various sanity checks
	//
	
	if (this.getInstanceProp('points_remaining') > this.getClassProp('points_capacity')){
		this.setInstanceProp('points_remaining', this.getClassProp('points_capacity'));
	}
	else if (this.getInstanceProp('points_remaining') < 0){
		this.setInstanceProp('points_remaining', 0);
	}
	
	//
	// Send state
	//
	
	var tool_state = {
		is_broken: this.getInstanceProp('is_broken') == 1 ? true : false
	};

	if (this.getClassProp('display_wear') == 1){
		tool_state['points_capacity'] = intval(this.getClassProp('points_capacity'));
		tool_state['points_remaining'] = floatval(this.getInstanceProp('points_remaining'));
	}
	
	return tool_state;
}

function get_powder_state(){
	var powder_state = {};

	if (this.has_parent('powder_base') && parseInt(this.getClassProp('maxCharges')) > 0){
		var charges = this.getInstanceProp('charges');
		var maxCharges = this.getClassProp('maxCharges');

		if (charges > maxCharges){
			this.setInstanceProp('charges', maxCharges);
		}
		else if (charges < 0){
			this.setInstanceProp('charges', 1);
		}

		powder_state = {
			'charges': charges,
			'maxCharges': maxCharges
		};
	}

	return powder_state;
}

function getLocation(){
	var container = this.apiGetLocatableContainerOrSelf();
	if (!container) return;
	
	if (container.location) return container.location;
	
	return container.container;
}

function getCoordinates(){
	return {x:this.x, y:this.y};
}

function getContainer(){
	return this.apiGetLocatableContainerOrSelf();
}

function has_parent(test){

	if (in_array(test, this.parent_classes)){ return true; }
	
	return false;
}

function chooseResponse(key, pc, txt_pc){
	if (!this.responses || !this.responses[key]){
		log.error(this+' chooseResponse no response for: '+key);
		return false;
	}
	
	var choice = choose_one(this.responses[key]);
	if (!choice){
		log.error(this+' chooseResponse no choice for: '+key);
		return false;
	}
	
	// Do substitutions
	if (pc && !txt_pc) txt_pc = pc;
	if (txt_pc){
		choice = choice.replace(/{pc_label}/g, '<b>'+txt_pc.label+'</b>');
	}
	
	return choice;
}

function sendResponse(key, pc, slugs, txt_pc){
	var choice = this.chooseResponse(key, pc, txt_pc);
	if (!choice) return false;
		
	this.sendBubble(choice, 3500, pc, slugs);
	return true;
}

function isRookable(){
	return this.can_be_rooked ? true : false;
}

function askPlayer(pc, uid, title, args){
	if (!args) args = {};
	args.itemstack_tsid = this.tsid;
	args.follow = true;
	
	if (this.onInteractionStarting) this.onInteractionStarting(pc);
	
	return pc.openInputBox(uid, title, args);
}


function isBag() {
	return this.is_bag;
}

//
// this is called by the edit-props pages to perform special
// per-class actions, like killing trants
//

function admin_custom_action(args){

	//
	// trant stuff
	//

	if (args.action == 'trant_kill'){
		if (!this.is_trant){
			return {
				ok: 0,
				error: 'not_a_trant',
			};
		}

		this.instanceProps.dontDie = 0;
		this.die();

		return {
			ok: 1,
		};
	}

	if (args.action == 'trant_patch'){
		if (!this.is_trant){
			return {
				ok: 0,
				error: 'not_a_trant',
			};
		}

		this.replaceWithPatch();

		return {
			ok: 1,
		};
	}

	if (args.action == 'dead_trant_patch'){
		if (!this.is_dead_trant){
			return {
				ok: 0,
				error: 'not_a_dead_trant',
			};
		}

		this.replaceWithPatch();

		return {
			ok: 1,
		};
	}


	//
	// huh?
	//

	return {
		ok: 0,
		error: 'unknown_action',
	};
}

function get_store_id(){
	var store_id = this.getInstanceProp('store_id');
	if (hasIntVal(store_id) && store_id){
		return store_id;
	}
	
	for (var i in this.verbs){
		store_id = verbs[i].store_id;
		if (hasIntVal(store_id)){
			return store_id;
		}
	}
	
	return 0;
}

function getBaseCost(){
	return this.base_cost;
}

function getCount() {
	return this.count;
}

function getItemNames() {
	return {single: this.name_single, plural: name_plural};
}

function makeRewards() {
	var reward = {};
	
	reward.class_tsid = this.class_tsid;
	reward.label = this.getLabel ? this.getLabel() : this.label;
	reward.count = this.count;
	
	if (this.is_tool) {
		reward.is_broken = intval(this.getInstanceProp('is_broken'));
	}
	
	// Config?
	if (this.make_config){
		reward.config = this.make_config();
	}
	
	return reward;
}


//
// used on the item instance page to find extra instance info
// for optional blocks
//

function adminGetInstanceDetails(){

	var out = {};

	if (this.is_nameable){
		out.nameable = this.getNameInfo();
	}

	return out;
}

function isNearEdge(distance){
	if (!distance) distance = 50;

	if (this.getContainerType() != 'street') return false;

	var loc = this.getLocation();
	if (this.x <= loc.geo.l+distance) return true;
	if (this.x >= loc.geo.r-distance) return true;

	return false;
}

function onStackedWith(stack, delta){
	if (config.is_dev) log.info(this+' stacked with '+delta+' of '+stack);
}

function clearSkillPackage(){
	delete this['!skill_package_running'];
}

function runCallback(callback, pc, args){
	if (this[callback]){
		this[callback].call(this, pc, args);
		return true;
	}

	return false;
}

function getRestoreInfo(){
	var container_root = this.getContainer();
	return {
		is_trophy: this.is_trophy ? true : false,
		container: this.container.tsid,
		location: this.getLocation().tsid,
		class_tsid: this.class_tsid,
		count: this.count,
		props: this.instanceProps,
		user_name: this.user_name,
		container_class: container_root.class_tsid,
		container_pos: [container_root.x, container_root.y],
		my_pos: [this.x, this.y],
		my_slot: this.slot,
		contents: this.contents,
		title: this.title,
		owner: this.getLocation().owner.tsid
	};
}

function restoreItem(args){
	if (this.is_bag){

		if (args.only_rename){
			function is_bag(it, f_args){ return it.class_tsid == f_args.class_tsid && it.slot == f_args.slot ? true : false; }
			var s = this.findFirst(is_bag, {class_tsid: args.class_tsid, slot: args.my_slot});
			if (s){
				if (args.props) s.instanceProps = args.props;
				if (args.user_name) s.user_name = args.user_name;
				if (args.contents) s.contents = args.contents;
				if (args.title) s.title = args.title;

				return {ok: 1, tsid: s.tsid};
			}
			else{
				function is_bag2(it, f_args){ return it.class_tsid == f_args.class_tsid && it.is_bag && !it.isBagFull() ? true : false; }
				s = this.findFirst(is_bag2, {class_tsid: args.class_tsid});
				if (s){
					if (args.user_name) s.user_name = args.user_name;

					return {ok: 1, tsid: s.tsid};
				}
				else{
					return {ok: 0, error: "Could not find item to rename"};
				}
			}
		}
		else{
			var s = apiNewItemStack(args.class_tsid, args.count);
			if (!s) return {ok: 0, error: "Could not create item"};
			
			if (args.props) s.instanceProps = args.props;
			if (args.user_name) s.user_name = args.user_name;
			if (args.contents) s.contents = args.contents;
			if (args.title) s.title = args.title;

			this.addItemStack(s, args.slot);

			return {ok: 1, tsid: s.tsid};
		}
	}
	else if (args.only_rename){
		if (args.props) this.instanceProps = args.props;
		if (args.user_name) this.user_name = args.user_name;
		if (args.contents) this.contents = args.contents;
		if (args.title) this.title = args.title;

		return {ok: 1, tsid: this.tsid};
	}
	else{
		return {ok: 0, error: "I don't know what to do!"};
	}
}

// http://wiki.tinyspeck.com/wiki/SpecItemIM
// also see: http://bugs.tinyspeck.com/7717 for the new "force" flag.
function im_send(pc, txt, flag){
	//
	// send message to target player
	//
	
	if (flag) { 
		var forceVal = true;
	}
	else {
		var forceVal = false;
	}
	
	var rsp_msg = {
		type: 'im_recv',
		force: forceVal,
		itemstack: {
			tsid: this.tsid,
			label: this.getLabel ? this.getLabel(pc) : this.label
		},
		txt: txt
	};
	
	pc.apiSendMsgAsIs(rsp_msg);
	pc.performPostProcessing(rsp_msg);

	return true;
}

// http://wiki.tinyspeck.com/wiki/SpecItemIM
function im_close(pc){
	pc.apiSendMsg({
		type: 'im_close',
		itemstack: {
			tsid: this.tsid,
			label: this.getLabel ? this.getLabel() : this.label
		}
	});
}

function getRootContainer(){
	var container = this.apiGetLocatableContainerOrSelf();
	if (!container) return this;

        if (container.container){
                return container.container;
        }

	return container;
}


//
// this is a wrapper around adminGetInfo() which checks caller perms.
//
// you are allowed to see the stack *if*:
// * it's in the caller's bags
// * it's in the caller's house interior(s)
// * it's in a public street
// * it's in the same street as the caller
//

function adminGetInfoScoped(args){

	var ret = this.adminGetInfo();


	//
	// item rooted in a player
	//

	if (ret.root.substr(0, 1) == 'P'){

		if (ret.root == args.viewer_tsid) return ret;

		return {
			ok	: 0,
			error	: 'not_your_stack',
		};
	}


	//
	// item rooted in a location
	//

	var loc = apiFindObject(ret.root);
	var owner = loc ? loc.getPrivateOwner() : null;

	if (owner && owner != args.viewer_tsid){

		var caller = apiFindObject(args.viewer_tsid);
		var caller_loc = caller ? caller.get_location().tsid : null;

		if (caller_loc != ret.root){

			// container is a location that is not owned by caller
			// and is not caller's current location.

			return {
				ok	: 0,
				error	: 'not_your_stack',
			};
		}
	}

	return ret;
}

function verb_drop_ok(verb, stack, pc){
	if (!this.verbs) return false;
	if (!this.verbs[verb]) return false;
	if (!this.verbs[verb].is_drop_target) return false;

	return this.verbs[verb].drop_ok_code.call(this, stack, pc);
}

function isSelectable(pc){
	return this.not_selectable ? false : true;
}

function broadcastLocationEvents(event, args){

	var con = this.getLocation();
	if (con.events_broadcast){
		con.events_broadcast(event, args);
	}
}

function setLocationFlag(name){
	var con = this.getLocation();
	if (con.events_set_flag) con.events_set_flag(name);
}

function clearLocationFlag(name){
	var con = this.getLocation();
	if (con.events_clear_flag) con.events_clear_flag(name);
}

function hasLocationFlag(name){
	var con = this.getLocation();
	if (con.events_has_flag) return con.events_has_flag(name);
	return false;
}

function runLocationEventProp(prop_name){
	var val = this.getInstanceProp(prop_name);
	if (val){
		var events = val.split(',');
		for (var i=0; i<events.length; i++){
			log.info(")))))))))))))))))))))))))))))) RUNNING EVENT", events[i])
			this.broadcastLocationEvents(events[i]);
		}
	}
}

function showVerbWithLocationFlag(name){
	if (this.hasLocationFlag(name)) return {state:'enabled'};
	return null;
}

function hideVerbWithLocationFlag(name){
	if (this.hasLocationFlag(name)) return null;
	return {state:'enabled'};
}

// Can this be packed in a moving box?
function itemIsPackable(){
	if (this.class_tsid == 'bag_moving_box') return false;

	// Furniture is not packable, unless it is a cabinet or sdb, which we handle specially
	if (this.is_cabinet && this.countContents()) return true;
	if (this.has_parent('furniture_base') && (this.class_tsid != 'bag_furniture_sdb' || !this.countContents())) return false;
	if (this.is_cabinet) return false;

	// No cultivated items
	if (this.proto_class || this.has_parent('proto')) return false;

	// No trophies
	if (this.has_parent('trophy_base')) return false;
	if (this.has_parent('bag_trophycase_base')) return false;

	// Special items
	if (this.class_tsid == 'home_sign') return false;
	if (this.class_tsid == 'magic_rock') return false;
	if (this.class_tsid == 'marker_teleport') return false;

	// Resources that might be in old pols
	if (this.class_tsid == 'garden_new') return false;
	if (this.class_tsid == 'patch' || this.class_tsid == 'patch_dark') return false;
	if (this.is_trant) return false;
	if (this.class_tsid == 'spawner') return false;
	if (this.class_tsid == 'patch_seedling') return false;
	if (this.has_parent('dead_tree')) return false;
	if (this.has_parent('wood_tree')) return false;
	if (this.has_parent('peat_base')) return false;
	if (this.has_parent('mortar_barnacle')) return false;
	if (this.has_parent('jellisac')) return false;
	if (this.has_parent('mineable_rock')) return false;
	if (this.class_tsid == 'npc_firefly') return false;

	return true;
}


function cloneSerializeStack(){

	var out = {
		'tsid'		: this.tsid,
		'class_tsid'	: this.class_tsid,
		'label'		: this.label,
		'count'		: this.count,
		'is_hidden'	: this.isHidden,
		'x'		: this.x,
		'y'		: this.y,
		'slot'		: this.slot,
		'hitBox'	: this.hitBox,
		'props'		: this.instanceProps,
	};

	// TODO: support for multiple hitboxes on an item
	// TODO: bag contents!

	return out;
}

function cloneUnserializeStack(serial_data, container){

	this.label = serial_data.label;

	if (serial_data.slot){

		// not implemented
	}else{
		container.apiPutItemIntoPosition(this, serial_data.x, serial_data.y, false);
	}

	if (serial_data.hitBox) this.apiSetHitBox(serial_data.hitBox.w, serial_data.hitBox.h);
	if (serial_data.props) this.setAllInstanceProps(serial_data.props);
}

function getRoutingClass(){

	if (this.proxy_item){
		var it = apiFindItemPrototype(this.proxy_item);
		if (!it.is_routable) return null;
		return this.proxy_item;
	}

	if (!this.is_routable) return null;
	if (this.getSubClass) return this.getSubClass();
	return this.class_tsid;
}

