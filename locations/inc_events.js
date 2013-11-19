
function events_get_list(){
	if (this.events) return utils.array_keys(this.events);
	return [];
}

function admin_events_get(){

	var out = {
		ok: 1,
		tsid: this.tsid,
	};

	// get the defined events
	if (this.events) out.events = this.events;

	// we need to know about location bounds for our minimap
	out.bounds = {
		t: this.geometry.t,
		r: this.geometry.r,
		b: this.geometry.b,
		l: this.geometry.l,
	};

	// we want to know about all the plats and walls
	out.walls = this.geometry.layers.middleground.walls;
	out.plats = this.geometry.layers.middleground.platform_lines;

	// standalone decos we can toggle
	out.decos = {};
	for (var l in this.geometry.layers){
		for (var i in this.geometry.layers[l].decos){
			var d = this.geometry.layers[l].decos[i];
			if (d.standalone){
				if (l == 'middleground'){
					out.decos[i] = utils.copy_hash(d);
				}else{
					out.decos[i] = this.events_map_deco(utils.copy_hash(d), l);
				}
			}
		}
	}

	// and all the physics changers
	// TODO

	// and all the Collision-triggered Geo Changers (class: ctgc)
	// TODO

	return out;
}

function events_map_deco(d, layer){

	var ratio_x = this.geometry.layers.middleground.w / this.geometry.layers[layer].w;
	var ratio_y = this.geometry.layers.middleground.h / this.geometry.layers[layer].h;

	d.x *= ratio_x;
	d.y *= ratio_y;

	d.x += this.geometry.l;
	d.y += this.geometry.t;

	return d;
}

function admin_events_add_action(args){

	// make sure we have this event already
	if (!this.events) this.events = {};
	if (!this.events[args.event]){
		this.events[args.event] = {
			'actions' : {},
		};
	}
	var ev = this.events[args.event];

	// find a uid for this action and create it
	if (args.action_id){
		var act_id = args.action_id;
	}else{
		var act_id = 1;
		while (ev.action[act_id]) act_id++;
	}

	// store the action details
	ev.actions[act_id] = args.details;
}

function admin_events_delete_action(args){

	if (!this.events) return;
	if (!this.events[args.event]) return;

	delete this.events[args.event].actions[args.action_id];

	// delete empty events
	if (this.num_keys(this.events[args.event].actions) == 0){
		delete this.events[args.event];
	}
}

function admin_events_run(args){
	this.events_broadcast(args.event, args);
}

function admin_events_reorder(args){

	if (!this.events || !this.events[args.event]){
		return {
			ok: 0,
			error: 'event_not_found',
		};
	}

	var old = this.events[args.event].actions;
	var acts = {};

	var keys = [];
	if (args.keys && args.keys.length) keys = args.keys.split(',');

	// insert in new key order
	for (var i=0; i<keys.length; i++){
		if (old[keys[i]]){

			var k = ''+keys[i];
			if (k.substr(0,1) != 'a') k = 'a'+k;

			acts[k] = old[keys[i]];
			delete old[keys[i]];
		}
	}

	// add anything that wasn't specified to the end of the list
	for (var i in old){

		var k = ''+i;
		if (k.substr(0,1) != 'a') k = 'a'+k;

		acts[k] = old[i];
	}

	this.events[args.event].actions = acts;

	return {
		ok: 1,
		actions: acts,
	};
}

function events_broadcast(event, args){

	if (!args) args = {};

	// Pause events in race levels if the race hasn't started yet
	if (this.is_game && this.instance && !this.instance.has_game_running()){
		if (this.debug_events){
				this.apiSendMsgAsIs({
					type: 'activity',
					txt: "Ignoring event "+event+", since all were cancelled",
					pc: {},
					auto_prepend: false
				});
			}
			return;
	}

	if (this.events_stop){
		if (args.fired_at < this.events_stop){
			if (this.debug_events){
				this.apiSendMsgAsIs({
					type: 'activity',
					txt: "Ignoring event "+event+", since all were cancelled",
					pc: {},
					auto_prepend: false
				});
			}
			return;
		}
	}

	if (this.debug_events){
		var msg = "event fired: "+event;
		if (args && args.target_pc) msg += ", target="+args.target_pc.tsid;
		this.apiSendMsgAsIs({
			type: 'activity',
			txt: msg,
			pc: {},
			auto_prepend: false
		});
	}


	//
	// sync state for hidden decos - if it's been marked as hidden,
	// tell new players that's it's hidden when they enter
	//

	if (event == 'player_enter' || event == 'player_reconnect'){
		if (this.hidden_decos){
			for (var i in this.hidden_decos){
				this.geo_deco_toggle_visibility(i, false, true);
			}
		}
	}

	if (!this.events) return;
	if (!this.events[event]) return;
	var ev = this.events[event];


	//
	// prep for changes	
	//

	var all_plats = this.geo_get_platform_lines_ref();
	var all_walls = this.geo_get_walls_ref();

	var mod_plats = {};
	var mod_walls = {};
	var has_geo_mod = false;


	//
	// run the actions
	//

	if (ev.actions)	
	for (var i in ev.actions){
		var act = ev.actions[i];


		//
		// change platform perms
		//

		if (act.type == 'plat'){

			if (all_plats[act.plat_id]){

				var has_effect = false;

				if (utils.has_key('pc_perm', act)){
					if (all_plats[act.plat_id].platform_pc_perm != act.pc_perm){
						all_plats[act.plat_id].platform_pc_perm = act.pc_perm;
						has_effect = true;
					}
				}

				if (utils.has_key('item_perm', act)){
					if (all_plats[act.plat_id].platform_item_perm != act.item_perm){
						all_plats[act.plat_id].platform_item_perm = act.item_perm;
						has_effect = true;
					}
				}

				if (has_effect){
					mod_plats[act.plat_id] = all_plats[act.plat_id];
					has_geo_mod = true;
				}
			}
		}


		//
		// change wall perms
		//

		if (act.type == 'wall'){

			if (all_walls[act.wall_id]){

				var has_effect = false;

				if (utils.has_key('pc_perm', act)){
					if (all_walls[act.wall_id].pc_perm != act.pc_perm){
						all_walls[act.wall_id].pc_perm = act.pc_perm;
						has_effect = true;
					}
				}

				if (utils.has_key('item_perm', act)){
					if (all_walls[act.wall_id].item_perm != act.item_perm){
						all_walls[act.wall_id].item_perm = act.item_perm;
						has_effect = true;
					}
				}

				if (has_effect){
					mod_walls[act.wall_id] = all_walls[act.wall_id];
					has_geo_mod = true;
				}
			}
		}


		//
		// show/hide deco
		//

		if (act.type == 'deco_hide'){
			this.geo_deco_toggle_visibility(act.deco_id, false, act.fade ? act.fade : true);

			if (!this.hidden_decos) this.hidden_decos = {};
			this.hidden_decos[act.deco_id] = time();
		}
		if (act.type == 'deco_show'){
			this.geo_deco_toggle_visibility(act.deco_id, true, act.fade ? act.fade : true);

			if (this.hidden_decos) delete this.hidden_decos[act.deco_id];
		}


		//
		// fire another event
		//

		if (act.type == 'event'){
			if (act.delay > 0){

				if (this.debug_events_more){
					this.apiSendMsgAsIs({
						type: 'activity',
						txt: "delayed event: "+event+"->"+act.event,
						pc: {},
						auto_prepend: false
					});
				}

				args.fired_at = getTime();
				this.apiSetTimerMulti('events_broadcast', 0+act.delay, ''+act.event, args);
			}else{

				if (this.debug_events_more){
					this.apiSendMsgAsIs({
						type: 'activity',
						txt: "sync event: "+event+"->"+act.event,
						pc: {},
						auto_prepend: false
					});
				}

				this.events_broadcast(act.event, args);
			}
		}


		//
		// flags
		//

		if (act.type == 'flag_set') this.events_set_flag(act.flag);
		if (act.type == 'flag_clear') this.events_clear_flag(act.flag);
		if (act.type == 'flag_has_exit') if (this.events_has_flag(act.flag)) break;
		if (act.type == 'flag_not_exit') if (!this.events_has_flag(act.flag)) break;


		//
		// TODO: physics box toggles
		//

		//var phys_box = apiFindObject(tsid);
		//if (phys_box && phys_box.setActiveState){
		//	phys_box.setActiveState(state);
		//}


		//
		// physics
		//

		if (act.type == 'physics'){
			if (act.all_players){
				for (var j in this.activePlayers){
					this.activePlayers[j].physics_event_run(act.param, act.value, act.duration);
				}
			}else{
				if (args.target_pc){
					args.target_pc.physics_event_run(act.param, act.value, act.duration);
				}
			}
		}

		if (act.type == 'physics_reset'){
			if (act.all_players){
				for (var j in this.activePlayers){
					this.activePlayers[j].physics_event_reset(act.param);
				}
			}else{
				if (args.target_pc){
					args.target_pc.physics_event_reset(act.param);
				}
			}
		}


		//
		// play a sound
		//

		if (act.type == 'play_sound' || act.type == 'stop_sound'){
			if (act.all_players){
				for (var j in this.activePlayers){
					this.events_runSoundAction(act, this.activePlayers[j]);
				}
			}else{
				if (args.target_pc){
					this.events_runSoundAction(act, args.target_pc);
				}
			}
		}


		//
		// custom code
		//

		if (act.type == 'code_player'){
			if (act.all_players){
				for (var j in this.activePlayers){
					this.events_runCodePlayer(act.code, this.activePlayers[j], args);
				}
			}else{
				if (args.target_pc){
					this.events_runCodePlayer(act.code, args.target_pc, args);
				}
			}
		}

		if (act.type == 'code_location'){
			this.events_runCode(act.code, args);
		}


		//
		// stop all timers
		//

		if (act.type == 'stop_timers'){
			this.events_stop_all();
		}


		//
		// VOG overlay
		//

		if (act.type == 'pc_vog'){
			if (args.target_pc){
				this.events_VOGPlayer(args.target_pc, act);
			}else{
				for (var j in this.activePlayers){
					this.events_VOGPlayer(this.activePlayers[j], act);
				}
			}
		}
	}


	//
	// save changes
	//

	if (has_geo_mod){
		this.apiGeometryUpdated();
		this.geo_update_players_plats('geo_update', mod_plats, mod_walls);
	}

}

function events_set_flag(name){
	if (!this.flags) this.flags = {};
	this.flags[name] = true;
}

function events_clear_flag(name){
	if (this.flags) delete this.flags[name];
}

function events_has_flag(name){
	return !!(this.flags && this.flags[name]);
}

function events_test(){

	this.apiSetTimerMulti('events_test_2', 2000, 4);
	this.apiSetTimerMulti('events_test_2', 2001, 5);
	this.apiSetTimerMulti('events_test_2', 2002, 6);
}

function events_test_2(t){

	var msg = 'events_test_2('+t+')';

	log.info(msg);

	this.apiSendMsgAsIs({
		type: 'activity',
		txt: msg,
		pc: {},
		auto_prepend: false
	});
}

function events_stop_all(){
	this.events_stop = getTime();
}

function events_runSoundAction(act, pc){

	var loops = act.loops ? act.loops : 1;
	var fade = act.fade ? act.fade : 0;
	var exclusive = !!act.exclusive;
	var multi = !!act.multi;
	var delay = act.delay ? act.delay : 0;


	//
	// deal with stops first
	//

	if (act.type == 'stop_sound'){
		return pc.announce_sound_stop(act.name, fade);
	}


	//
	// starts!
	//

	if (act.type == 'play_sound'){

		if (delay){
			var new_act = utils.copy_hash(act);
			delete new_act.delay;
			this.apiSetTimerMulti('events_runSoundAction', delay, new_act, pc);
		}else{
			//pc.sendActivity("pc.announce_sound : "+act.name+", "+loops+", "+fade+", "+exclusive);
			return pc.announce_sound(act.name, loops, fade, exclusive, multi);
		}
	}
}

function events_runCodePlayer(src, pc, args){
	var loc = this;
	var call_event = function(ev){ loc.events_broadcast(ev, args); }
	eval(src);
}

function events_runCode(src, args){
	var loc = this;
	var call_event = function(ev){ loc.events_broadcast(ev, args); }
	eval(src);
}

function events_VOGPlayer(pc, args_in){

	// This should maybe call pc.announce_vog_fade()
	var css_class = args_in.css_class ? args_in.css_class : 'nuxp_vog';
	var lines = args_in.text.split('//');
	var width = args_in.width ? args_in.width : 500;

	var text_list = [];
	var chat_text_list = [];
	for (var i=0; i<lines.length; i++){
		text_list.push('<p align="center"><span class="'+css_class+'">'+utils.escape(lines[i])+'</span></p>');
		chat_text_list.push(utils.escape(lines[i]));
	}

	var args = {
		uid: 'vog_event_'+this.tsid, // does this need to be more unique?
		type: "vp_overlay",
		duration: 0,
		locking: true,
		width: width,
		x: args_in.x ? args_in.x : '50%',
		y: args_in.y ? args_in.y : '50%',
		delay_ms: 0,
		click_to_advance: true,
		click_to_advance_show_text: false,
		click_to_advance_bottom: true,
		text: text_list,
		chat_text: chat_text_list,

		text_fade_delay_sec: args_in.fade_delay_sec ? args_in.fade_delay_sec : 0,
		text_fade_sec: args_in.fade_sec ? args_in.fade_sec : 1,
		background_color: args_in.fade_color ? args_in.fade_color : '#000000',
		background_alpha: args_in.fade_alpha ? args_in.fade_alpha : 0.3,
		at_bottom: true
	};
log.info('ARGS', args);

	if (args_in.next_event){
		args.done_payload = {
			event_location: this.tsid,
			event_name: args_in.next_event,
		};
	}

	pc.apiSendAnnouncement(args);
}
