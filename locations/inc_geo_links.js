//
// PUBLIC API:
// * geo_links_get_outgoing()		[ARRAY]
// * geo_links_get_incoming()		[HASH]
// * geo_links_move_target(args)
// * geo_links_add_source(tsid)
// * geo_links_remove_source(tsid)
// * geo_links_clear_sources()
//

function geo_links_cleanup(){

	this.geo_links_check_sources_out();
	this.geo_links_check_sources_in();
	this.jobs_modify_connections();

	return {
		ok: 1,
	};
}


//
// check that all outgoing links from this street are represented in
// the 'sources' list for their target streets.
//

function geo_links_check_sources_out(){

	if (this.isInstance()) return false;

	//
	// get a unique hash of streets we connect to,
	// in the format { tsid : obj }
	//

	var dests = {};

	var links = this.geo_links_get_outgoing_refs();

	for (var i=0; i<links.length; i++){

		var t = links[i].target;
		if (t) dests[t.tsid] = t;
	}


	//
	// let them all know
	//

	for (var i in dests){
		if (dests[i]){
			
			dests[i].geo_links_add_source(this.tsid);
		}
	}
	
	return true;
}


//
// source management
//

function geo_links_add_source(tsid){
	if (!this.geometry.sources) this.geometry.sources = {};
	this.geometry.sources[tsid] = 1;
}

function geo_links_remove_source(tsid){
	if (!this.geometry.sources) this.geometry.sources = {};
	delete this.geometry.sources[tsid];
}

function geo_links_clear_sources(){
	this.geometry.sources = {};
}

function admin_geo_links_add_source(args){
	this.geo_links_add_source(args.tsid);
	this.geo_links_cleanup();
}

function admin_geo_links_remove_source(args){
	this.geo_links_remove_source(args.tsid);
	this.geo_links_cleanup();
}


//
// check that every street on our sources list really does link here
//

function geo_links_check_sources_in(){

	if (!this.geometry.sources) return;

	for (var i in this.geometry.sources){

		var street = apiFindObject(i);

		if (street && !street.isInstance()){
			if (!street.geo_links_has_outgoing_to(this.tsid)){

				delete this.geometry.sources[i];
			}
		}else{
			delete this.geometry.sources[i];
		}
	}
}

function geo_links_has_outgoing_to(tsid){

	var links = this.geo_links_get_outgoing_refs();

	for (var i=0; i<links.length; i++){

		var t = links[i].target;
		if (t && t.tsid == tsid) return true;
	}

	return false;
}



//
// a utility function that returns an array of all outgoing
// connections on this street
//

function geo_links_get_outgoing_refs(){

	if (!this.geo) return [];

	var out = [];

	if (this.geo.doors){
		for (var i in this.geo.doors){
			var d = this.geo.doors[i];
			if (d.connect){
				out.push(d.connect);
			}
		}
	}

	if (!this.geo.signposts) return out;

	for (var i in this.geo.signposts){
		var s = this.geo.signposts[i];
		if (s.connects){
			for (var j in this.geo.signposts[i].connects){

				out.push(s.connects[j]);
			}
		}
	}

	return out;
}

function geo_links_get_all_doors(){
	if (!this.geo || !this.geo.doors) return [];

	var out = [];

	for (var i in this.geo.doors){
		var d = this.geo.doors[i];

		var data = {
			'type'			: 'door',
			'door_id'		: i,
			'deco_class'	: d.deco ? d.deco.sprite_class : '',
			'my_x'			: d.x,
			'my_y'			: d.y
		};

		if (d.connect){
			var c = d.connect;

			if (c.target){

				data.target = c.target;
				data.tsid = c.target.tsid;
				data.hub_id = c.hub_id;
				data.mote_id = c.mote_id;
				data.x = c.x;
				data.y = c.y;
			}
		}

		out.push(data);
	}

	return out;
}

function geo_links_get_all_signposts(){
	if (!this.geo || !this.geo.signposts) return [];

	var out = [];

	for (var i in this.geo.signposts){
		if (this.geo.signposts[i].connects && this.geo.signposts[i].connects.__length){
			for (var j in this.geo.signposts[i].connects){
				var c = this.geo.signposts[i].connects[j];

				if (c.target){

					out.push({
						'target'	: c.target,
						'tsid'		: c.target.tsid,
						'hub_id'	: c.hub_id,
						'mote_id'	: c.mote_id,
						'signpost_x': this.geo.signposts[i].x,
						'signpost_y': this.geo.signposts[i].y,
						'x'			: c.x,
						'y' 		: c.y,
						'type'		: 'signpost',
						'signpost_id'	: i,
						'connect_id'	: j
					});
				}
			}
		}
		else{
			out.push({
				'type'		: 'signpost',
				'signpost_id'	: i,
				'signpost_x': this.geo.signposts[i].x,
				'signpost_y': this.geo.signposts[i].y
			});
		}
	}

	return out;
}

function geo_links_get_outgoing(){
	
	if (!this.geo) return [];
	var out = [];

	if (this.geo.doors){
		for (var i in this.geo.doors){
			var d = this.geo.doors[i];
			if (d.connect){
				var c = d.connect;

				if (c.target){

					out.push({
						'target'		: c.target,
						'tsid'			: c.target.tsid,
						'hub_id'		: c.hub_id,
						'mote_id'		: c.mote_id,
						'x'			: c.x,
						'y'			: c.y,
						'type'			: 'door',
						'door_id'		: i,
						'deco_class'	: d.deco ? d.deco.sprite_class : ''
					});
				}
			}
		}
	}

	if (!this.geo.signposts) return out;

	for (var i in this.geo.signposts){
		var quarter_tsid = this.geo.signposts[i].quarter;
		if (quarter_tsid){
			var quarter = apiFindObject(quarter_tsid);
			if (!quarter){
				log.error(this+' signpost points to missing quarter: '+quarter_tsid);
				continue;
			}

			var info = quarter.get_info();

			for (var j in info.streets){
				var s = info.streets[j];

				// Make sure quarter really exists
				if (s.has_instance) {
					out.push({
						'target'	: s.instance,
						'tsid'		: s.instance_tsid,
						'hub_id'	: info.hub_id,
						'mote_id'	: info.mote_id,
						'x'		: s.teleport_point ? s.teleport_point.x : 0,
						'y'		: s.teleport_point ? s.teleport_point.y : 0,
						'type'		: 'signpost',
						'signpost_id'	: i,
						'connect_id'	: j
					});
				}
			}

		} else if (this.geo.signposts[i].connects){
			for (var j in this.geo.signposts[i].connects){
				var c = this.geo.signposts[i].connects[j];

				if (c.target){

					out.push({
						'target'	: c.target,
						'tsid'		: c.target.tsid,
						'hub_id'	: c.hub_id,
						'mote_id'	: c.mote_id,
						'x'		: c.x,
						'y'		: c.y,
						'type'		: 'signpost',
						'signpost_id'	: i,
						'connect_id'	: j,
						'hidden'	: c.hidden
					});
				}
			}
		}
	}

	return out;

}


//
// return a list of virtual 'targets', based on the incoming
// links listed in 'sources'
//

function geo_links_get_incoming(){

	if (!this.geo || !this.geo.sources) return [];

	var out = {};
	var uid = 0;

	for (var i in this.geo.sources){
		var street = apiFindObject(i);
		if (street){
			var links = street.geo_links_get_outgoing_to(this.tsid);

			for (var j=0; j<links.length; j++){
				uid++;
				var id = 'vtarget_'+uid;
				out[id] = links[j];
			}
		}
	}

	return out;
}

function geo_links_get_outgoing_to(tsid){

	if (!this.geo) return [];

	var out = [];

	if (this.geo.doors){
		for (var i in this.geo.doors){
			var d = this.geo.doors[i];
			if (d.connect){
				var c = d.connect;
				if (c.target && c.target.tsid == tsid){

					out.push({
						'street_tsid'	: this.tsid,
						'street_name'	: this.label,
						'hub_id'	: this.hubid,
						'mote_id'	: this.moteid,
						'source_type'	: 'door',
						'source_id'	: i,
						'x'		: c.x,
						'y'		: c.y,
						'deco_class'	: d.deco ? d.deco.sprite_class : '',
						'hidden'	: c.hidden ? true : false,
						'is_locked' : d.is_locked ? true : false
					});
				}
			}
		}
	}

	if (!this.geo.signposts) return out;

	for (var i in this.geo.signposts){
		if (this.geo.signposts[i].connects){
			for (var j in this.geo.signposts[i].connects){
				var c = this.geo.signposts[i].connects[j];

				if (c.target !== undefined && c.target !== null && c.target.tsid == tsid){

					out.push({
						'street_tsid'	: this.tsid,
						'street_name'	: this.label,
						'hub_id'	: this.hubid,
						'mote_id'	: this.moteid,
						'source_type'	: 'signpost',
						'source_id'	: i,
						'connect_id'	: j,
						'x'		: c.x,
						'y'		: c.y,
						'hidden'	: c.hidden ? true : false
					});
				}
			}
		}
	}

	return out;
}



//
// called from the geo editor to move the position of a target.
// should return the x/y
//

function geo_links_move_target(args){

	if (args.source_type == 'door'){
		this.geometry.layers.middleground.doors[args.source_id].connect.x = args.x;
		this.geometry.layers.middleground.doors[args.source_id].connect.y = args.y;
	}

	if (args.source_type == 'signpost'){
		this.geometry.layers.middleground.signposts[args.source_id].connects[args.connect_id].x = args.x;
		this.geometry.layers.middleground.signposts[args.source_id].connects[args.connect_id].y = args.y;
	}

	return {
		x: args.x,
		y: args.y,
	};
}

function geo_links_delete_target(source_type, source_id, connect_id){
	if (source_type == 'door' && this.geometry.layers.middleground.doors[source_id]){
		delete this.geometry.layers.middleground.doors[source_id].connect.target;

		return true;
	}

	if (source_type == 'signpost' && this.geometry.layers.middleground.signposts[source_id] && this.geometry.layers.middleground.signposts[source_id].connects[connect_id]){
		delete this.geometry.layers.middleground.signposts[source_id].connects[connect_id].target;

		return true;
	}

	return false;
}