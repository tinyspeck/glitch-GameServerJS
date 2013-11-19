
function init(w, h, mote, hub, name){

	this.streets = {};
	this.exit = {};

	this.size_x = w;
	this.size_y = h;

	this.mote = mote;
	this.hub = hub;

	this.name = name;
	this.style = 'normal';
}

function get_info(){

	var out = {
		size_x	: this.size_x,
		size_y	: this.size_y,
		name	: this.name,
		style	: this.style,
		exit	: {
			tsid	: this.exit.tsid,
			x	: this.exit.x,
			y	: this.exit.y,
		},
		hub_id	: this.hub,
		mote_id : this.mote, 
		streets	: {},
		pols	: 0,
	};

	for (var y=1; y<=this.size_y; y++){
	for (var x=1; x<=this.size_x; x++){

		var key = "("+x+","+y+")";
		var data = this.streets[key];
		if (!data) data = {};

		var cfg = config.quarter_templates[data.template_uid];
		if (!cfg) cfg = {};

		out.streets[key] = {
			has_instance	: data.instance ? 1 : 0,
			instance 	: data.instance,
			template	: data.template_uid,
			template_tsid	: cfg.template_tsid,
			instance_tsid	: data.instance ? data.instance.tsid : null,
			teleport_point	: data.teleport_point,
			label		: this.generate_label(x, y),
		};

		out.pols += intval(data.pol_count);
	}
	}

	return out;
}

function set_info(args){

	this.name = args.name;
	this.style = args.style;

	this.exit.tsid = args.exit_tsid;
	this.exit.x = args.exit_x;
	this.exit.y = args.exit_y;

	this.refresh_all();


	//
	// get requested size and check bounds
	//

	var sx = intval(args.size_x);
	var sy = intval(args.size_y);

	if (sx < 1) sx = 1;
	if (sy < 1) sy = 1;

	if (sx > 9) sx = 9;
	if (sx == 1){
		if (sy > 20) sy = 20;
	}else{
		if (sy > 9) sy = 9;
	}


	//
	// check current streets to see if we need to
	// force a larger size
	//

	var need_x = 0;
	var need_y = 0;

	for (var y=1; y<=this.size_y; y++){
	for (var x=1; x<=this.size_x; x++){

		var key = "("+x+","+y+")";
		var data = this.streets[key];
		if (data && data.template_uid){

			need_x = Math.max(need_x, x);
			need_y = Math.max(need_y, y);
		}
	}
	}

	if (sx < need_x) sx = need_x;
	if (sy < need_y) sy = need_y;


	//
	// set new size
	//

	this.size_x = sx;
	this.size_y = sy;
}


//
// for a given occupied slots, we want to know what POLs we have in the
// instance and what POLs we have in the template.
//

function get_slot_info(args){

	var key = "("+args.x+","+args.y+")";

	var out ={
		template_pols: {},
		instance_pols: {},
	};

	if (this.streets[key]){

		var s = this.streets[key];

		// template info
		if (s.template_uid){
			out.template_pols = this.get_template_pols(s.template_uid);
		}

		// instance info
		if (s.instance){
			out.instance_pols = s.instance.quarters_get_pols();
		}

		// TODO: figure out which ones would be deleted on a refresh
	}

	return out;
}


//
// this method sets the template for a given position. if there is
// already an instance there, it will be replaced.
//

function admin_add_street(args){
	return this.add_street(args.x, args.y, args.template_uid);
}

function add_street(x, y, template_uid){

	var key = "("+x+","+y+")";

	if (!this.streets[key]) this.streets[key] = {};

	// set the template for this street (this does
	// not create the instance of it yet)
	this.streets[key].template_uid = template_uid;


	// create / reclone
	return this.recreate_street_instance(x, y);
}


//
// this method clears the street at a given position. if there is
// already an instance there, it will be deleted.
//

function admin_clear_street(args){
	log.info(this+' quarter admin_clear_street: '+args.x+', '+args.y);
	return this.clear_street(args.x, args.y);
}

function clear_street(x, y){

	var key = "("+x+","+y+")";

	// first see if we need to destory an existing street
	if (this.streets[key].instance){
		var ret = this.delete_street_instance(x, y);
		if (!ret.ok) return ret;
		delete this.streets[key].instance;
	}

	// clear any other info
	delete this.streets[key];


	return {
		ok: 1,
	};
}

//
// refresh a single slot
//

function admin_rebuild_street(args){
	return this.rebuild_street(args.x, args.y);
}

function rebuild_street(x, y){

	return this.recreate_street_instance(x, y);	
}



//
// refresh the infoi/mapdata/names of all streets/pols within this quarter
//

function refresh_all(){

	var slots = this.get_slots();
	for (var key in slots){

		var slot = slots[key];
		if (slot.data.instance){
			this.propagate_settings(slot.x, slot.y);
		}
	}
}


//
// create/reclone all the configured instances
//

function recreate_all(){

	var slots = this.get_slots();
	for (var key in slots){
		var s = slots[key];
		this.recreate_street_instance(s.x, s.y);
	}
}


//
// delete all the configured instances
//

function delete_all(){

	var slots = this.get_slots();
	for (var key in slots){
		var s = slots[key];
		this.delete_street_instance(s.x, s.y);
	}
}


/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//
// INTERNAL/PRIVATE METHODS BELOW
//


//
// delete the street instance in the given slot
//

function delete_street_instance(x, y){

	var key = "("+x+","+y+")";


	//
	// check we have something to delete
	//

	var s = this.streets[key];
	if (!s.instance){
		return {
			ok: 0,
			error: 'no_instance',
		};
	}
	var street = s.instance;


	//
	// lock
	//

	if (!apiAdminLockLocations(street.tsid)){

		return {
			ok: 0,
			error: 'location_locked',
		};
	}


	//
	// remove POLs
	//

	var pols = street.quarters_get_pols();
	for (var i in pols){
		street.pols_delete(apiFindObject(i));
	}


	//
	// delete the street itself
	// (need to deal with players and items in location)
	//

    street.evacuatePlayers();
	var ret = street.admin_delete();


	//
	// clear the reference
	//

	delete s.instance;

	return {
		ok: 1,
	};
}


//
// create/reclone the instance in the given slot
//

function recreate_street_instance(x, y){

	var key = "("+x+","+y+")";


	//
	// get the template street
	//

	var s = this.streets[key];
	if (!s || !s.template_uid){

		log.error("missing quarter slot "+key);
		return {
			ok: 0,
			error: 'bad_slot',
		};
	}

	var template_uid = s.template_uid;
	var template_info = config.quarter_templates[template_uid];

	if (!template_info || !template_info.template_tsid){
		log.error("missing quarter template info for uid:"+template_uid);
		return {
			ok: 0,
			error: 'bad_uid',
		};
	}


	//
	// do we have a street at all? if not, we need to create one
	//

	var created = false;

	if (!s.instance){

		s.instance = apiNewLocation("Quarter Street", this.mote, this.hub, 'quarter');

		if (!s.instance){

			return {
				ok: 0,
				error: 'failed_create',
			};
		}

		created = true;
	}

	var street = s.instance;


	//
	// tell the street to rebuild itself
	//

	var ret = street.rebuild_quarter_street({
		quarter_tsid	: this.tsid,
		quarter_style	: this.style,
		template_uid	: template_uid,
		template_tsid	: template_info.template_tsid,
	});

	if (!ret.ok) return ret;


	//
	// set some params
	//

	s.teleport_point = ret.teleport_point;
	s.pol_count = ret.pol_count;

	this.propagate_settings(x, y);


	ret.street_created = created;

	return ret;
}


//
// the name of each street depends on the style of this quarter
//

function generate_label(x, y){

	if (this.style == 'normal'){
		return this.name + ', '+x+y+'00 block';
	}

	if (this.style == 'apartment'){
		return this.name + ', floor '+y;
	}

	if (this.style == 'single'){
		return this.name;
	}

	return 'Unknown quarter style';
}

function generate_pol_label(x, y){

	if (this.style == 'normal'){
		return ''+x+y+'## '+this.name;
	}

	if (this.style == 'apartment'){
		return ''+y+'## '+this.name;
	}

	if (this.style == 'single'){
		return '## '+this.name;
	}

	return 'Unknown quarter style, ##';
}

function generate_pol_floor(x, y){

	// the number to add to the house number to get
	// the number to show on the door

	if (this.style == 'normal'){
		return intval(''+x+y+'00');
	}

	if (this.style == 'apartment'){
		return intval(''+y+'00');
	}

	if (this.style == 'single'){
		return 0;
	}

	return 0;
}


function get_slots(){

	var slots = {};

	for (var y=1; y<=this.size_y; y++){
	for (var x=1; x<=this.size_x; x++){

		var key = "("+x+","+y+")";
		var s = this.streets[key];
		if (s){

			slots[key] = {x:x, y:y, data:s};
		}
	}
	}

	return slots;
}

function get_exit_position(){

	var exit = this.exit;
	if (!exit || !exit.tsid){
		log.error(this+" has no exit");
		return null;
	}

	var tsid = exit.tsid;
	var x = exit.x;
	var y = exit.y;

	var exitStreet = apiFindObject(tsid);
	if (!exitStreet){
		log.error(this+" failed to find exit for quarter: "+tsid);
		return null;
	}

	return exitStreet.getFractionalPosition(x);
}


function get_template_pols(template_uid){

	var template_info = config.quarter_templates[template_uid];
	if (!template_info) return {};

	var template = apiFindObject(template_info.template_tsid);
	if (!template) return {};

	return template.quarters_get_template_pols();
}


function pols_to_posmaps(pols){

	var out = {};

	for (var i in pols){
		var p = pols[i];
		var chassis = p.chassis;
		if (chassis){
			if (!out[chassis]) out[chassis] = [];
			out[chassis].push([i, p.x, p.y]);
		}else{
			log.error("lot marker "+i+" has no chassis set - skipping");
		}
	}

	return out;
}



//
// returns a conenctions hash for a signpost pointing into this quarter
//

function formatSignpost(source_tsid){

	var slots = this.get_slots();
	var connections = {};
	var col = 0;
	var row = 0;
	var found_source = 0;

	var slot_map = {};
	var tsids = [];


	//
	// first, get all of the data we can without any RPC,
	// collecting TSIDs along the way
	//

	for (var i in slots){
		var s = slots[i];
		var data = s.data;
		if (data.instance){

			var x = s.x;
			var y = s.y;
			var key = x+'_'+y;
			var info = this.streets["("+x+","+y+")"];

			if (info && info.instance){

				var tsid = info.instance.tsid;
				var tp = info.teleport_point;

				slot_map[tsid] = key;
				tsids.push(tsid);

				connections[key] = {
					street_tsid	: tsid,
					mote_id		: this.mote,
					hub_id		: this.hub,
					x			: tp ? tp.x : 0,
					y			: tp ? tp.y : 0,
				};

				if (tsid == source_tsid){
					// the street we're calling from is one of the slots
					found_source = 1;
					col = s.x;
					row = s.y;
				}
			}
		}
	}


	//
	// the exit works differently
	//

	var exit = this.exit;
	slot_map[exit.tsid] = 'exit';
	tsids.push(exit.tsid);

	connections['exit'] = {
		street_tsid	: exit.tsid,
		mote_id		: this.mote,
		hub_id		: this.hub,
		x		: exit.x,
		y		: exit.y,
	};


	//
	// now do our RPC in one go
	//

	if (tsids.length){
		var ret = apiCallMethod('get_signpost_info', tsids);

		for (var i in ret){
			var r = ret[i];
			if (r.ok){
				var key = slot_map[i];
				connections[key].label = r.label;
				connections[key].swf_file_versioned = r.swf_file_versioned;
				connections[key].img_file_versioned = r.img_file_versioned;
			}
		}
	}


	//
	// return
	//

	return {
		connects: connections,
		quarter: {
			tsid	: this.tsid,
			label	: this.name,
			style	: this.style,
			cols	: this.size_x,
			rows	: this.size_y,
			col	: col,
			row	: row,
		},
	};
}



//
// formats the connect for a quarter door. this could either
// be an entry door if it's not in the quarter, or an exit door.
//

function formatDoor(tsid){

	var info = this.streets["(1,1)"];
	var connect = {};

	if (!info || tsid == info.instance.tsid){

		//
		// we are inside, so the door leads to the exit
		//

		connect = {
			street_tsid	: this.exit.tsid,
			mote_id		: this.mote,
			hub_id		: this.hub,
			x		: this.exit.x,
			y		: this.exit.y,
		};
	}else{

		//
		// we are outside, so the door needs to lead inwards
		//

		var tp = info.teleport_point;

		connect = {
			street_tsid     : info.instance.tsid,
			mote_id         : this.mote,
			hub_id          : this.hub,
			x               : tp ? tp.x : 0,
			y               : tp ? tp.y : 0,
		};
	}

	if (connect.street_tsid){

		var target = apiFindObject(connect.street_tsid);
		if (target){

			var target_info = target.get_signpost_info();

			connect.label			= target_info.label;
			connect.swf_file_versioned	= target_info.swf_file_versioned;
			connect.img_file_versioned	= target_info.img_file_versioned;
		}
	}

	return {
		'connect' : connect,
	};
}


//
// these next 2 functions are used by main.js when a player follows
// a link in a quarter signpost. they just need to return {target, x, y}
// so we can actually take the player there (this info is not sent to the client)
//

function getConnectionData(key){

	var s = this.streets[key];
	if (!s) return {};
	if (!s.instance) return {};

	var tp = s.teleport_point;

	return {
		target: s.instance,
		mote_id: this.mote,
		hub_id: this.hub,
		x: tp ? tp.x : 0,
		y: tp ? tp.y : 0,
		loading_music: this.style == 'apartment' ? 'ELEVATOR_MUSIC' : ''
	};
}

function getExitConnectionData(){

	return {
		target: apiFindObject(this.exit.tsid),
		mote_id: this.mote,
		hub_id: this.hub,
		x: this.exit.x,
		y: this.exit.y,
		loading_music: this.style == 'apartment' ? 'ELEVATOR_MUSIC' : ''
	}
}


//
// this is used by main.js when a player follows a quarter door - it may lead in or out
//

function getDoorConnectionData(current_tsid){

	var info = this.streets["(1,1)"];
	var connect = {};

	if (!info || current_tsid == info.instance.tsid){

		return this.getExitConnectionData();
	}

	return this.getConnectionData('(1,1)');
}


//
// push quarter info, names and map info to a slot street,
// which will in turn push to all POLs
//

function propagate_settings(x, y){

	var key = "("+x+","+y+")";
	var s = this.streets[key];
	if (!s) return;
	if (!s.instance) return;

	var street = s.instance;
	var template_uid = s.template_uid;

	street.set_quarter_info({
		'quarter_tsid'	: this.tsid,
		'template_uid'	: template_uid,
		'quarter_style'	: this.style,

		'street_label'	: this.generate_label(x, y),
		'pols_label'	: this.generate_pol_label(x, y),
		'pols_floor'	: this.generate_pol_floor(x, y),

		'exit_tsid'	: this.exit.tsid,
		'exit_pos'	: this.get_exit_position(),
	});

}


function delete_unowned_pols(){

	var c1 = 0;
	var c2 = 0;

	var slots = this.get_slots();
	for (var key in slots){

		var street = slots[key].data.instance;
		if (street){

			var pols = street.quarters_get_pols();
			for (var i in pols){
				c1++;
				if (!pols[i].owned){
					street.pols_delete(apiFindObject(i));
					c2++;
				}
			}
		}
	}

	return {
		ok: 1,
		total: c1,
		removed: c2,
	};
}

function admin_delete(){
	log.info(this+' quarter admin_delete');
	this.apiDelete();
}