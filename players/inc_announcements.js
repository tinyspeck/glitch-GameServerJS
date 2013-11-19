/////////////////////////////////////////////////////////////////////////////
//
// Music and sound management
//

function announce_sound(name, loop_count, fade_in, is_exclusive, allow_multiple){
	if (name == 'NO_MUSIC') return;
	
	if (config.music_map[name]) name = config.music_map[name];
	
	var rsp = {
		type: 'play_sound',
		sound: name,
		is_exclusive: is_exclusive ? true : false
	};

	if (loop_count){
		rsp['loop_count'] = intval(loop_count);
	}
	
	if (fade_in){
		rsp['fade'] = intval(fade_in);
	}

	if (allow_multiple){
		rsp['allow_multiple'] = true;
	}
	
	this.apiSendAnnouncement(rsp);
}

function announce_sound_delayed(name, loop_count, fade_in, delay){

	var details = {
		name: name,
		loop_count: loop_count,
		fade_in: fade_in,
		callback: 'announce_sound_delayed_callback'
	};
	
	this.events_add(details, delay);
}

function announce_sound_delayed_callback(details){
	this.announce_sound(details.name, details.loop_count, details.fade_in);
}

function announce_sound_stop(name, fade_out){
	if (name == 'NO_MUSIC') return;

	if (config.music_map[name]) name = config.music_map[name];

	var rsp = {
		type: 'stop_sound',
		sound: name
	};

	if (fade_out){
		rsp['fade'] = intval(fade_out);
	}
		
	this.apiSendAnnouncement(rsp);
}

function announce_music(name, loop_count, fade_in){
	if (name == 'NO_MUSIC') return;

	var rsp = {
		type: 'play_music',
		mp3_url: config.music_map[name]
	};
	
	if (loop_count){
		rsp['loop_count'] = intval(loop_count);
	}
	
	if (fade_in){
		rsp['fade'] = intval(fade_in);
	}
	this.apiSendAnnouncement(rsp);
}

function announce_music_stop(name, fade_out){
	if (name == 'NO_MUSIC') return;
	
	var rsp = {
		type: 'stop_music',
		mp3_url: config.music_map[name]
	};
	
	if (fade_out){
		rsp['fade'] = intval(fade_out);
	}
	this.apiSendAnnouncement(rsp);
}


/////////////////////////////////////////////////////////////////////////////
//
// Small wrappers around the various overlay types
//
// http://tools.tinyspeck.com/pastebin/266
//

function announce_vp_overlay(args){
	var rsp = {
		type: 'vp_overlay'
	};
	
	for (var i in args){
		if (i == 'overlay_key'){
			rsp['swf_url'] = this.overlay_key_to_url(args[i]);
		}
		else{
			rsp[i] = args[i];
		}
	}
	
	this.apiSendAnnouncement(rsp);
}

function announce_window_overlay(args){
	var rsp = {
		type: 'window_overlay'
	};
	
	for (var i in args){
		if (i == 'overlay_key'){
			rsp['swf_url'] = this.overlay_key_to_url(args[i]);
		}
		else{
			rsp[i] = args[i];
		}
	}
	
	this.apiSendAnnouncement(rsp);
}

function announce_pc_overlay(args){
	var rsp = {
		type: 'pc_overlay'
	};
	
	for (var i in args){
		if (i == 'overlay_key'){
			rsp['swf_url'] = this.overlay_key_to_url(args[i]);
		}
		else{
			rsp[i] = args[i];
		}
	}
	
	this.apiSendAnnouncement(rsp);
}

function announce_itemstack_overlay(args){
	var rsp = {
		type: 'itemstack_overlay'
	};
	
	for (var i in args){
		if (i == 'overlay_key'){
			rsp['swf_url'] = this.overlay_key_to_url(args[i]);
		}
		else{
			rsp[i] = args[i];
		}
	}
	
	this.apiSendAnnouncement(rsp);
}

function announce_location_overlay(args){
	var rsp = {
		type: 'location_overlay'
	};
	
	for (var i in args){
		if (i == 'overlay_key'){
			rsp['swf_url'] = this.overlay_key_to_url(args[i]);
		}
		else{
			rsp[i] = args[i];
		}
	}
	
	this.apiSendAnnouncement(rsp);
}

function announce_vog_simple(txt){
	this.apiSendAnnouncement({
		type: "vp_overlay",
		swf_url: overlay_key_to_url('pet_rock_rays'),
		duration: 0,
		delay_ms: 0,
		uid: 'nuxp_familiar_graphic',
		locking: true,
		size: '40%',
		x: '50%',
		y: '15%'
	});
	
	this.apiSendAnnouncement({
		uid: 'vog_simple',
		type: "vp_overlay",
		duration: 0,
		locking: true,
		width: 300,
		x: '50%',
		top_y: '25%',
		delay_ms: 1000,
		click_to_advance: true,
		bubble_familiar: true,
		text: [
			'<p><span class="nuxp_medium">'+txt+'</span></p>'
		],
		done_cancel_uids: ['nuxp_familiar_graphic']
	});
}

// http://bugs.tinyspeck.com/9549
function announce_vog_fade(txt, args_in){
	if (!args_in) args_in = {};

	var lines = txt.split('//');
	var css_class = args_in.css_class ? args_in.css_class : 'nuxp_vog';

	var text_list = [];
	var chat_text_list = [];
	var tmp_class = '';
	var tmp_text = '';
	for (var i=0; i<lines.length; i++){
		tmp_class = css_class;
		tmp_text = lines[i];
		// Check for line specific class definition (with [[class=foo]])
		if (lines[i].substr(0, 8) == '[[class='){
			tmp_class = lines[i].substr(8, lines[i].indexOf(']]')-8);
			tmp_text = lines[i].substr(lines[i].indexOf(']]')+2);
		}
		text_list.push('<p align="center"><span class="'+tmp_class+'">'+tmp_text+'</span></p>');
		chat_text_list.push(tmp_text);
	}
	var args = {
		uid: 'vog_fade',
		type: "vp_overlay",
		duration: args_in.duration ? args_in.duration : 0,
		locking: args_in.no_locking ? false : true,
		width: args_in.width ? args_in.width : 500,
		x: args_in.x ? args_in.x : '50%',
		y: args_in.y ? args_in.y : '50%',
		delay_ms: args_in.delay_ms ? args_in.delay_ms : 0,
		click_to_advance: true,
		click_to_advance_bottom: true,
		text_fade_delay_sec: args_in.fade_delay_sec ? args_in.fade_delay_sec : 0,
		text_fade_sec: args_in.fade_sec ? args_in.fade_sec : 1,
		background_color: args_in.fade_color ? args_in.fade_color : '#000000',
		background_alpha: args_in.fade_alpha ? args_in.fade_alpha : 0.3,
		at_bottom: true,
		text: text_list,
		chat_text: chat_text_list
	};

	if (args_in.done_payload) args.done_payload = args_in.done_payload;

	this.apiSendAnnouncement(args);
}

/////////////////////////////////////////////////////////////////////////////
//
// Overlay script management functions
//

function run_next_overlay_script(){
	if (this['!next_overlay_script']){
		var next = this['!next_overlay_script'];
		delete this['!next_overlay_script'];
		this.run_overlay_script(next);
	}
	
	return false;
}

function dismiss_next_overlay_script(){
	if (this['!dismiss_overlay']){
		var next = this['!dismiss_overlay'];
		delete this['!dismiss_overlay'];
		this.overlay_dismiss(next);
	}
	
	return false;
}

function run_overlay_script(name){
	if (!this['!current_overlay_script']){
		if (this.overlay_scripts_map[name]){
			//log.info('Starting overlay script: '+name);
			this['!current_overlay_script'] = name;
			this.overlay_scripts_map[name].start(this);
			
			this.apiSendMsg({ type: 'annc_flush' }); // HACKS!
			return true;
		}
	}
	
	return false;
}

function run_overlay_done_script(name){
	//log.info(this+' run_overlay_done_script '+name);
	//log.info(this+' current_overlay_script '+this['!current_overlay_script']);

	if (this['!current_overlay_script'] == name){
		if (this.overlay_scripts_map[name]){
			//log.info('Ending overlay script: '+name);
			delete this['!current_overlay_script'];
			this.overlay_scripts_map[name].done(this);


			//log.info(this+' run_overlay_done_script '+name+' returning true');
			return true;
		}

		//log.info(this+' run_overlay_done_script '+name+' no map');
	}
	
	//log.info(this+' run_overlay_done_script '+name+' returning false');
	return false;
}

// this is used to match up functions with overlay script names
var overlay_scripts_map = {
	'top_of_tree': {
		start: this.overlay_script_top_of_tree,
		done: this.overlay_done_script_top_of_tree
	},
	'smuggling_explain_restrictions': {
		start: this.overlay_script_smuggling_explain_restrictions,
		done: this.overlay_done_script_smuggling_explain_restrictions
	},
	'smuggling_reveal_destination': {
		start: this.overlay_script_smuggling_reveal_destination,
		done: this.overlay_done_script_smuggling_reveal_destination
	},
	'return_to_gentle_island': {
		start: this.overlay_script_return_to_gentle_island,
		done: null
	}
};


/////////////////////////////////////////////////////////////////////////////
//
// Tree jump quest
//

function overlay_done_script_top_of_tree(pc){
	pc.apiSendMsg({type: 'ui_visible', familiar: true});
	
	pc.events_add({callback: 'activate_spinach_prompt', txt: 'Sigh. Activate a spinach then jump.'}, 30);
	pc.events_add({callback: 'activate_spinach_prompt', txt: 'Oy! Activate a spinach. Then jump. It’s easy!!'}, 45);
}

function activate_spinach_prompt(details){
	if (!this['!spinach_activated']){
		this.prompts_add({
			txt		: details.txt,
			icon_buttons	: false,
			timeout_value	: '',
			timeout		: 10,
			choices		: [
				{ value : '', label : 'Ok' }
			],
			callback	: ''
		});
	}
}

function overlay_script_top_of_tree(pc){
	
	pc.metabolics_add_energy(50);

	pc.apiSendAnnouncement({
		type: "vp_overlay",
		swf_url: overlay_key_to_url('pet_rock_rays'),
		duration: 0,
		delay_ms: 0,
		uid: 'nuxp_familiar_graphic',
		locking: true,
		size: '40%',
		x: '50%',
		y: '15%'
	});
	
	pc.apiSendAnnouncement({
		uid: 'top_of_tree',
		type: "vp_overlay",
		duration: 0,
		locking: true,
		width: 500,
		x: '50%',
		top_y: '25%',
		delay_ms: 1000,
		click_to_advance: true,
		bubble_familiar: true,
		text: [
			'<p><span class="nuxp_medium">Trial and error, baby. Just get started…</span></p>'
		],
		done_cancel_uids: ['nuxp_familiar_graphic'],
		done_payload: {
			overlay_script_name: 'top_of_tree'
		}
	});
}

/////////////////////////////////////////////////////////////////////////////
//
// End of tree jump. Start of smuggling explanation
//

function overlay_script_smuggling_explain_restrictions(pc){
	pc.apiSendAnnouncement({
		uid: 'smuggling_restrictions',
		type: "vp_overlay",
		duration: 0,
		locking: true,
		width: 500,
		x: '50%',
		top_y: '25%',
		delay_ms: 2500,
		click_to_advance: true,
		bubble_familiar: true,
		text: [
			'<p><span class="nuxp_medium">How exciting! Remember, don\'t let the deimaginators get too close to you or they\'ll confiscate your contraband.</span></p>',
			'<p><span class="nuxp_medium">Also… the contents of that package won\'t fare too well on public transit, and are too fragile for teleportation.</span></p>',
			'<p><span class="nuxp_medium">Whenever you\'re ready, your top secret delivery destination will be revealed.</span></p>'
		],
		done_payload: {
			overlay_script_name: 'smuggling_explain_restrictions'
		}
	});
}

function overlay_done_script_smuggling_explain_restrictions(pc){
	pc.ui_callout_cancel();

	var contraband = pc.findFirst('contraband');

	if (contraband){
		var path = pc.buildPath(contraband.destination);

		pc.apiSendMsg({type: 'get_path_to_location', path_info: path.path});
		pc.apiSendMsg({type: 'map_open', hub_id: path.path.destination.hub_id, location_tsid: path.path.destination.street_tsid});
	}

}

function overlay_script_smuggling_reveal_destination(pc){

	var txt = choose_one(["And today's destination is...",
				"Today you'll be hauling those goods to...",
				"This time around, that bundle of joy needs to get to...",
				"The destination you need to hustle your way to is..."]);

	pc.apiSendAnnouncement({
		uid: 'smuggling_destination',
		type: "vp_overlay",
		duration: 0,
		locking: true,
		width: 500,
		x: '50%',
		top_y: '25%',
		delay_ms: 2500,
		click_to_advance: true,
		bubble_familiar: true,
		text: [
			'<p><span class="nuxp_medium">'+txt+'</span></p>',
		],
		done_payload: {
			overlay_script_name: 'smuggling_reveal_destination'
		}
	});
}

function overlay_done_script_smuggling_reveal_destination(pc){
	pc.ui_callout_cancel();
	log.info('smuggling - started map open for follow ups');
	var contraband = pc.findFirst('contraband');

	if (contraband){
		log.info('smuggling - found contraband and spawning map from it');
		var path = pc.buildPath(contraband.destination);

		pc.apiSendMsg({type: 'get_path_to_location', path_info: path.path});
		pc.apiSendMsg({type: 'map_open', hub_id: path.path.destination.hub_id, location_tsid: path.path.destination.street_tsid});
	} else {
		log.info('smuggling - wtf, no contraband found. shitsacks.');
	}
}

//
// newxp
//

function overlay_script_return_to_gentle_island(pc){
	pc.apiSetTimer('newxpReturnToGentleIsland', 4000);
	delete pc['!current_overlay_script'];
}

/////////////////////////////////////////////////////////////////////////////
//
// Generic util functions
//

function announce_itemstack_bubble(stack, text, duration, follow, width, dont_keep_in_bounds){
	if (!stack) return;
	
	this.overlay_dismiss(stack.tsid+'_bubble');
	
	var annc = {
		uid: stack.tsid+'_bubble',
		duration: duration,
		dismissible: false,
		itemstack_tsid: stack.tsid,
		delta_x: 10,
		delta_y: 0,
		height: "100",
		bubble_talk: true,
		follow: follow ? true : false,
		dont_keep_in_bounds: dont_keep_in_bounds ? true : false,
		text: [
			'<span class="simple_panel">'+text+'</span>'
		]
	};
	
	if (width) {
		annc.width = width;
	}
	
	return this.announce_itemstack_overlay(annc);
}

function overlay_dismiss(uid){
	this.apiSendMsg({type: 'overlay_cancel', uid: uid});
}

function announce_counter(value, args){
	
	if (!args) args = {};
	if (!args['delta_x']) args['delta_x'] = 0;
	if (!args['delta_y']) args['delta_y'] = -110;
	if (!args['prefix']) args['prefix'] = '+';
	if (!args['duration']) args['duration'] = 1000;
	
	//this.overlay_dismiss('counter');
	this.apiSendAnnouncement({
		uid: 'counter',
		type: "pc_overlay",
		pc_tsid: this.tsid,
		swf_url: overlay_key_to_url('light_burst'),
		duration: args['duration'],
		locking: false,
		delta_x: args['delta_x'],
		delta_y: args['delta_y'],
		width: "50",
		height: "50",
		text: [
			'<p align="center"><span class="overlay_counter">'+args['prefix']+value+'</span></p>'
		]
	});
}

function announce_checkmark(txt, annc_uid, deco_name){
	var msg = {
		type: 'loc_checkmark',
		txt: txt
	};

	if (annc_uid) msg.annc_uid = annc_uid;
	if (deco_name) msg.deco_name = deco_name;

	this.apiSendMsg(msg);
}

// Persistent indicators with stacking behaviour.
function announce_build_indicator_annc(uid){
	var indicator = this.announced_indicators[uid];
	if (!indicator) return {};

	var annc = {
		type: 'pc_overlay',
		uid: this.tsid+'_'+uid,
		duration: 0,
		pc_tsid: this.tsid,
		delta_y: indicator.delta_y ? indicator.delta_y : -120,
		delta_x: indicator.delta_x ? indicator.delta_x : 0
	};
				
	if (indicator.is_item){
		annc.item_class = indicator.overlay_key;
	}
	else{
		annc.swf_url= this.overlay_key_to_url(indicator.overlay_key);
	}

	if (indicator.state){
		annc.state = indicator.state;
	}

	if (indicator.args){
		for (var i in indicator.args){
			annc[i] = indicator.args[i];
		}
	}

	return annc;
}

function announce_add_indicator(uid, overlay_key, is_item, state, args){
	// already exists? Remove first
	if (this.announced_indicators && this.announced_indicators[uid]){
		this.announce_remove_indicator(uid);
	}

	if (!this.announced_indicators){
		this.announced_indicators = {};
	}
	
	var offset = num_keys(this.announced_indicators) * -50;
	this.announced_indicators[uid] = {
		overlay_key: overlay_key,
		is_item: is_item,
		state: state,
		args: args
	};

	var annc = this.announce_build_indicator_annc(uid);
	if (!annc || !annc.type) return;

	annc.delta_y += offset;
	
	this.location.apiSendAnnouncement(annc);
}

function announce_hide_indicators(pc) {
	for (var i in this.announced_indicators){
		var msg = {
			type: 'overlay_cancel',
			uid: this.tsid+'_'+i
		};
		
		if (pc){
			pc.apiSendMsg(msg);
		}
		else{
			this.location.apiSendMsg(msg);
		}
	}
}

function announce_remove_all_indicators() {
	this.announce_hide_indicators();
	
	delete this.announced_indicators;
}

function announce_show_indicators(pc) {
	if (!this.announced_indicators) return;
	
	var offset = 0;
	for (var i in this.announced_indicators){
		var annc = this.announce_build_indicator_annc(i);
		if (!annc || !annc.type) continue;

		annc.delta_y += offset;
		
		if (pc){
			pc.apiSendAnnouncement(annc);
		}
		else{
			this.location.apiSendAnnouncement(annc);
		}
		offset -= 50;
	}
}

function announce_remove_indicator(uid){
	if (!this.announced_indicators || !this.announced_indicators[uid]){
		return;
	}
	
	this.announce_hide_indicators();
	
	delete this.announced_indicators[uid];
	if (num_keys(this.announced_indicators)){
		this.announce_show_indicators();
	} else {
		delete this.announced_indicators;
	}
}

function announce_has_indicator(uid){
	if (!this.announced_indicators){
		return false;
	}
	
	return !!this.announced_indicators[uid];
}

function announce_remote_item_speech(class_tsid, text, args) {
	var item_annc = {
		uid: 'remote_item_'+class_tsid+'_item',
		type: 'vp_overlay',
		item_class: class_tsid,
		corner: 'tr',
		corner_offset_x: 65,
		corner_offset_y: 45,
		size: 300
	};
	
	// Copy over props from args
	for (var i in args){
		item_annc[i] = args[i];
	}
	if (!item_annc.duration){
		item_annc.duration = 5000;
	}
	
	this.apiSendAnnouncement(item_annc);

	this.apiSendAnnouncement({
		uid: 'remote_item_'+class_tsid+"_bubble",
		type: 'vp_overlay',
		corner: 'tr',
		corner_offset_x: 170,
		corner_offset_y: 80,
		state: {
			text:text
		},
		duration: args.duration ? args.duration : 5000,
		size: 250,
		swf_url: overlay_key_to_url('loneliness_quest_bubble_overlay')
	});
}

function announce_remote_item_state_change(args){
	if (!args || !args.state || !args.class_tsid){
		log.error(this+" tried to change remote item announcement state, but args were incorrect: "+args);
		return;
	}
	
	var state_msg = {
		type: 'overlay_state',
		uid: 'remote_item_'+args.class_tsid+'_item'
	};
	
	for (var i in args){
		if (i != 'class_tsid'){
			state_msg[i] = args[i];
		}
	}
	
	this.apiSendMsg(state_msg);
}

/**************** Toggle decos *********************/
function geo_deco_toggle_visibility(name, is_visible, fade){
	this.apiSendMsg({
		type: 'deco_visibility',
		visible: is_visible,
		deco_name: name, // this is the name property on the deco in the location geo, it can be set via locodeco
		fade_ms: fade ? fade : 400 // by default the fade is 400 ms. If you specify any other number it will be what you specify (0 for immediate, with no fade)
	});
}
