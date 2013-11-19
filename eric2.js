
function echo_evt(req) {
	req = req || {};
	req.evt = req.evt || {'no':'event_passed'}
	return req.evt
}

function make_rsp(req) {
	return {
    	msg_id: req.msg_id,
    	type: req.type,
	}
}

function move_to_signpost(req) {
    var rsp = make_rsp(req);
    rsp.success = true;
	rsp.street = streets_map[req.street_id]
	return rsp;
}

function get_init_ob(req) {
    var rsp = make_rsp(req);
    rsp.success = true;
    
	rsp.pc = {
		id: 'pc1',
		name: 'serguei',
		is_you: true,
		location: {
			hub_id: 'hub1',
			street_id: 'street1'
		}
	}
	
	return rsp;
}

function get_hub_ob(req) {
    var rsp = make_rsp(req);
	var hub = hubs[req.hub_id];
	
	if (!hub){
		rsp.success = false;
		return rsp;
	}
    rsp.success = true;
    rsp.hub = hub;
	
	return rsp;
}


var hubs = {}

streets = [{
	tsid: 'street1',
	label: 'Main st',
	w: 3000,
	h: 1000,
	ladders: [{
		tsid: 'ladder1',
		x: 600,
		y: 1000,
		h: 400
	}],
	platforms: [],
	doors: [{
		tsid: 'door1',
		x: 100,
		y: 1000
	},{
		tsid: 'door2',
		x: 800,
		y: 700
	}],
	signposts: [{
		tsid: 'signpost1',
		x: 400,
		y: 1000,
		connects:[{
			tsid: 'street2',
			label: '2nd ave',
			signpost: {
				tsid: 'signpost3'
			}
		},{
			tsid: 'street3',
			label: '3rd ave',
			signpost: {
				tsid: 'signpost2'
			}
		}]
	}]
},{
	tsid: 'street2',
	label: '2nd ave',
	w: 2000,
	h: 1000,
	ladders: [],
	platforms: [],
	doors: [],
	signposts: [{
		tsid: 'signpost3',
		x: 800,
		y: 1000,
		connects:[{
			tsid: 'street1',
			label: 'Main St',
			signpost: {
				tsid: 'signpost1'
			}
		}]
	}]
},{
	tsid: 'street3',
	label: '3rd ave',
	w: 4000,
	h: 2000,
	ladders: [],
	platforms: [],
	doors: [],
	signposts: [{
		tsid: 'signpost2',
		x: 1200,
		y: 2000,
		connects:[{
			tsid: 'street1',
			label: 'Main St',
			signpost: {
				tsid: 'signpost1'
			}
		}]
	}]
}]

streets_map = [];
streets_map.street1 = streets[0];
streets_map.street2 = streets[1];
streets_map.street3 = streets[2];

