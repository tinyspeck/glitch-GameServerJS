// x
function homes_get_cloned_geo(){
	return apiGetObjectContent(this.geometry.tsid);
}

function homes_get_type(){
	if (this.home_id) return this.home_id;
	if (!this.is_home) return null;
	this.home_id = this.is_public ? 'exterior' : 'interior';
	return this.home_id;
}

function homes_belongs_to(owner_tsid){
	if (!this.homes_get_type()) return false;
	if (this.owner.tsid != owner_tsid) return false;
	return true;
}

function homes_init_config(){

	if (!this.cfg) this.cfg = {};
	if (!this.cfg.style) this.cfg.style = config.home_limits.START_INT_TEMPLATE;
	if (!this.cfg.floors){
		this.cfg.floors = [[]];
		for (var i=0; i<config.home_limits.START_WALL_SEGMENTS-2; i++) this.cfg.floors[0].push('wall');
	}
	if (!this.cfg.doors_up) this.cfg.doors_up = {};
	if (!this.cfg.doors_down) this.cfg.doors_down = {};
	if (!this.cfg.wallpaper) this.homes_reset_wallpaper();
	if (!this.cfg.flooring) this.homes_reset_flooring();
	if (!this.cfg.ceilings) this.homes_reset_ceilings();
	if (!this.cfg.yard_expansions) this.cfg.yard_expansions = config.home_limits.START_BACKYARD_SEGMENTS;
}

function homes_init_config_frontyard(){
	if (!this.cfg) this.cfg = {};
	if (!this.cfg.style) this.cfg.style = config.home_limits.START_EXT_TEMPLATE;
	if (!this.cfg.yard_expansions_left) this.cfg.yard_expansions_left = config.home_limits.START_FRONTYARD_LEFT_SEGMENTS;
	if (!this.cfg.yard_expansions_right) this.cfg.yard_expansions_right = config.home_limits.START_FRONTYARD_RIGHT_SEGMENTS;
}

function homes_get_config(){
	var t = this.cfg.style;
	if (!config.homes_interior_configs[t]) t = 'basic';

	var cfg = utils.copy_hash(config.homes_interior_configs[t]);

	// merge in frame config
	var ft = cfg.frame_style;
	if (!config.homes_interior_frames[ft]) ft = 'groddle';

	for (var i in config.homes_interior_frames[ft]){
		cfg[i] = config.homes_interior_frames[ft][i];
	}

	return cfg;
}

function homes_reset(){
	this.homes_return_decos();
	this.jobs_delete_all();
	this.cfg = {
		'style' : 'basic',
		'floors' : [[]],
		'yard_expansions' : config.home_limits.START_BACKYARD_SEGMENTS,
	};
	for (var i=0; i<config.home_limits.START_WALL_SEGMENTS-2; i++) this.cfg.floors[0].push('wall');
	this.homes_reset_wallpaper();
	this.homes_reset_flooring();
	this.homes_reset_ceilings();
	this.homes_rebuild_rooms();
	this.homes_reset_players();
}

function homes_reset_wallpaper(){
	this.cfg.wallpaper = [];
	var tex = config.home_limits.START_TEXTURE_WALL;
	for (var i=0; i<this.cfg.floors.length; i++){

		// wallpaper needs to include the end caps, while
		// this.cfg.floors does not, so we add 2 extra
		// sections per floor.
		var a = [tex, tex];
		for (var j=0; j<this.cfg.floors[0].length; j++){

			a.push(tex);
		}
		this.cfg.wallpaper.push(a);
	}
}

function homes_reset_flooring(){
	this.cfg.flooring = [];
	for (var i=0; i<this.cfg.floors.length; i++){
		this.cfg.flooring.push(config.home_limits.START_TEXTURE_FLOOR);
	}
}

function homes_reset_ceilings(){
	this.cfg.ceilings = [];
	for (var i=0; i<this.cfg.floors.length; i++){
		this.cfg.ceilings.push(config.home_limits.START_TEXTURE_CEILING);
	}
}

function homes_set_style(t){

	// interior
	if (this.is_home && !this.is_public){

		this.homes_init_config();

		if (config.homes_interior_configs[t]){
			this.cfg.style = t;
		}

		this.homes_rebuild_rooms('street_style');
		//this.homes_reset_players();
	}

	// exterior
	if (this.is_home && this.is_public){

		this.homes_init_config_frontyard();

		if (config.homes_exterior_configs[t]){
			this.cfg.style = t;
		}

		this.homes_rebuild_exterior('street_style');
	}
}

function homes_extend(){
	this.homes_init_config();

	if (!this.homes_can_extend()) return false;

	for (var i=0; i<this.cfg.floors.length; i++){
		this.cfg.floors[i].push('wall');

		// find the second-to-last wallpaper on this floor (last wall segment
		// before the right-cap) and duplicate it for the new piece.
		var wp = this.cfg.wallpaper[i];
		var last = wp.pop();
		wp.push(wp[wp.length-1]);
		wp.push(last);
	}

	this.homes_rebuild_rooms('expand_house');
	return true;
}

function homes_unexpand(){
	this.homes_init_config();

	for (var i=0; i<this.cfg.floors.length; i++){
		this.cfg.floors[i].pop();

		// remove the second-to-last wallpaper segment
		var wp = this.cfg.wallpaper[i];
		var last = wp.pop();
		wp[wp.length-1] = last;
	}

	// move all items over
	var x = this.geometry.r - 300;
	for (var i in this.items){
		if (this.items[i].x >= x){
			this.items[i].apiSetXY(this.items[i].x - 150, this.items[i].y);
		}
	}

	// move all players over
	for (var i in this.players){
		if (this.players[i].x >= x){
			this.players[i].apiSetXY(this.players[i].x - 150, this.players[i].y);
		}
	}

	this.homes_rebuild_rooms('unexpand_house');
	return true;
}

function homes_guess_door_pos(){
	return 75 + (this.cfg.floors.length * 150);
}

function homes_add_floor_at(x, source){
	this.homes_init_config();

	if (!this.homes_can_add_floor()) return false;

	// create the floor
	var len = this.cfg.floors[0].length;
	var floor = [];
	for (var i=0; i<len; i++) floor.push('wall');
	this.cfg.floors.push(floor);

	// insert door positions
	if (!source) source = this.homes_create_door_item(x, 'up');
	var floors = this.cfg.floors.length;
	this.cfg.doors_up[floors-2] = source;
	this.cfg.doors_down[floors-1] = this.homes_create_door_item(x, 'down');

	// set up wallpaper
	var wall = [];
	var def_paper = this.cfg.wallpaper[floors-2][1]; // first wall segment of old top floor
	for (var i=0; i<len+2; i++) wall.push(def_paper);
	this.cfg.wallpaper.push(wall);

	// set up flooring / ceiling
	this.cfg.flooring.push(this.cfg.flooring[floors-2]);
	this.cfg.ceilings.push(this.cfg.ceilings[floors-2]);

	this.homes_rebuild_rooms('add_floor');
	return true;
}

function homes_create_door_item(x, direction){
	var s = apiNewItemStack('furniture_door', 1);
	if (!s) return null;

	s.setInstanceProp('door_direction', direction);
	s.no_job = true;

	this.apiPutItemIntoPosition(s, x, 0);

	return s;
}

function homes_replace_door(from, to){
	log.info(this+' homes_replace_door '+from+' '+to);
	for (var i in this.cfg.doors_up){
		if (this.cfg.doors_up[i] && this.cfg.doors_up[i].tsid == from.tsid){
			this.cfg.doors_up[i] = to;
			break;
		}
	}

	for (var i in this.cfg.doors_down){
		if (this.cfg.doors_down[i] && this.cfg.doors_down[i].tsid == from.tsid){
			this.cfg.doors_down[i] = to;
			break;
		}
	}

	var doors_changed = {};
	for (var i in this.geometry.layers.middleground.doors){
		var d = this.geometry.layers.middleground.doors[i];
		if (!d) continue;
		log.info(this+' homes_replace_door checking door '+i);
		if (doors_changed[i]) continue; // Only touch each door once

		if (d.itemstack_tsid == from.tsid){
			log.info(this+' homes_replace_door itemstack_tsid '+d.itemstack_tsid+' '+to.tsid);
			d.itemstack_tsid = to.tsid;
			doors_changed[i]++;

			if (d.target_tsid == to.tsid){
				log.info(this+' homes_replace_door inner target_tsid '+d.target_tsid+' '+from.tsid);
				d.target_tsid = from.tsid;
				doors_changed[i]++;
			}
			continue;
		}

		if (d.itemstack_tsid == to.tsid){
			log.info(this+' homes_replace_door itemstack_tsid '+d.itemstack_tsid+' '+from.tsid);
			d.itemstack_tsid = from.tsid;
			doors_changed[i]++;

			if (d.target_tsid == from.tsid){
				log.info(this+' homes_replace_door inner target_tsid '+d.target_tsid+' '+to.tsid);
				d.target_tsid = to.tsid;
				doors_changed[i]++;
			}
			continue;
		}

		if (d.target_tsid == from.tsid){
			log.info(this+' homes_replace_door target_tsid '+d.target_tsid+' '+to.tsid);
			d.target_tsid = to.tsid;
			doors_changed[i]++;
			continue;
		}

		if (d.target_tsid == to.tsid){
			log.info(this+' homes_replace_door target_tsid '+d.target_tsid+' '+from.tsid);
			d.target_tsid = from.tsid;
			doors_changed[i]++;
			continue;
		}
	}

	if (num_keys(doors_changed)){
		this.apiGeometryUpdated();
		for (var i in doors_changed){
			log.info(this+' homes_replace_door updating client for '+i);
			this.geo_door_updated(i);
		}
	}

	return true;
}

function houses_num_floors(){
	return (this.cfg && this.cfg.floors) ? this.cfg.floors.length : 0;
}

function homes_num_floors_remaining(){
	return Math.max(0, config.home_limits.MAX_FLOORS - this.cfg.floors.length);
}

function homes_num_segments_remaining(){
	return Math.max(0, (config.home_limits.MAX_WALL_SEGMENTS - 2) - this.cfg.floors[0].length);
}

function homes_can_add_floor(){
	if (this.home_has_active_expansion()) return false;
	return !!(this.homes_num_floors_remaining() > 0);
}

function homes_can_extend(){
	if (this.home_has_active_expansion()) return false;
	return !!(this.homes_num_segments_remaining() > 0);
}

function homes_get_whole_bounds(){

	var cfg = this.homes_get_config();
	var floors_cfg = this.homes_get_floor_config();
	var num_floors = floors_cfg.length;

	var floor_height = 458 + cfg.frame_height;
	if (cfg.double_frames) floor_height += cfg.frame_height + cfg.floor_gap;

	var basement_h = 0;
	if (cfg.basement_h) basement_h = cfg.basement_h;

	var bound = {};

	// left and right are easy
	bound.l = 0;
	bound.r = (150 * floors_cfg[0].length);

	// top and bottom are layout-dependant
	if (cfg.layout == 'house-right'){

		bound.b = 0 - basement_h;
		bound.t = ((0 - floor_height) * num_floors) - basement_h;
	}

	if (cfg.layout == 'house-below'){

		if (cfg.double_frames){
			bound.t = 0;
			bound.b = ((num_floors+1) * floor_height) - (cfg.floor_gap + basement_h);
		}else{
			bound.t = 0;
			bound.b = ((num_floors+1) * floor_height) + cfg.frame_height - basement_h;
		}
	}

	if (cfg.layout == 'house-above'){
		bound.b = 0;
		bound.t = ((0 - floor_height) * (i+1)) - basement_h;
	}

	return bound;
}

function homes_get_floor_bounds(){

	// return an array of floor bounds

	var cfg = this.homes_get_config();
	var floors_cfg = this.homes_get_floor_config();
	var bounds = [];

	var floor_height = 458 + cfg.frame_height;
	if (cfg.double_frames) floor_height += cfg.frame_height + cfg.floor_gap;

	var basement_h = 0;
	if (cfg.basement_h) basement_h = cfg.basement_h;

	for (var i=0; i<floors_cfg.length; i++){
		var bound = {};

		if (cfg.layout == 'house-right'){
			bound.l = 0;
			bound.b = ((0 - floor_height) * i) - basement_h;
		}

		if (cfg.layout == 'house-below'){
			bound.l = 0;
			if (cfg.double_frames){
				bound.b = ((i+1) * floor_height) - (cfg.floor_gap + basement_h);
			}else{
				bound.b = ((i+1) * floor_height) + cfg.frame_height - basement_h;
			}
		}

		if (cfg.layout == 'house-above'){
			bound.l = 0;
			bound.b = ((0 - floor_height) * i) - basement_h;
		}

		bound.r = bound.l + (150 * floors_cfg[i].length);
		bound.t = bound.b - floor_height;

		bounds.push(bound);
	}

	return bounds;
}

function homes_can_add_door(y){

	if (!this.homes_can_add_floor()) return false;
	if (this.home_id == 'tower') return false;

	var bounds = this.homes_get_floor_bounds();
	var top_floor = bounds.pop();

	if (y < top_floor.t) return false;
	if (y > top_floor.b) return false;
	return true;
}

function homes_get_floor_config(){

	//
	// add ends to floors
	//

	var floors_cfg = [];
	for (var i=0; i<this.cfg.floors.length; i++){
		floors_cfg[i] = this.cfg.floors[i].slice(0);
		floors_cfg[i].unshift('left');
		floors_cfg[i].push('right');
	}

	// special case for house-on-right
	var cfg = this.homes_get_config();
	if (cfg.layout == 'house-right') floors_cfg[0][0] = 'left-open';

	//floors_cfg[0][0] = 'none';

	return floors_cfg;
}

function homes_include_swf(swf){

	var cur = this.geometry.swf_file;
	if (cur){
		var bits = cur.split(',');
		var found = false;
		for (var i=0; i<bits.length; i++){
			if (bits[i] == swf){
				found = true;
				break;
			}
		}
		if (!found) bits.push(swf);
		this.geometry.swf_file = bits.join(',');
	}else{
		this.geometry.swf_file = swf;
	}
}

function homes_rebuild_rooms(reload_reason){

	this.homes_init_config();

	var cfg = this.homes_get_config();


	//
	// we're going to rebuild from template now
	//

	var signposts	= this.geometry.layers.middleground.signposts;
	var doors	= this.geometry.layers.middleground.doors;

	var template_tsid = cfg.template;
	var template_inst = apiFindObject(template_tsid);

	var tmp = template_inst.homes_get_cloned_geo();
	this.geometry = {};
	for (var i in tmp) this.geometry[i] = tmp[i];

	var floors_cfg = this.homes_get_floor_config();


	//
	// make sure we have the interiors swf loaded
	//

	this.homes_include_swf(cfg.door_deco_swf);
	this.homes_include_swf('home_wallpaper.swf');


	//
	// if we're expanding to the right...
	//

	if (cfg.double_frames){
		var house_h = (floors_cfg.length * (458 + cfg.frame_height + cfg.frame_height + cfg.floor_gap)) - cfg.floor_gap;
	}else{
		var house_h = (floors_cfg.length * (458 + cfg.frame_height)) + cfg.frame_height;
	}
	if (cfg.basement_h) house_h += cfg.basement_h;
	if (cfg.attic_h) house_h += cfg.attic_h_visible ? cfg.attic_h_visible : cfg.attic_h;

	var house_w = floors_cfg[0].length * 150;
	var new_dims = this.homes_get_middlelayer_size();


	if (cfg.layout == 'house-right'){

		var location_h = Math.max(house_h, 700); // viewport height
		new_dims.r = house_w;
		new_dims.t = 0 - location_h;
		new_dims.l = 0 - this.home_get_yard_size();
	}

	if (cfg.layout == 'house-below'){

		new_dims.l = 0;
		new_dims.r = Math.max(house_w, this.home_get_yard_size());
		new_dims.b = house_h;
	}

	if (cfg.layout == 'house-above'){

		new_dims.l = 0;
		new_dims.r = Math.max(house_w, this.home_get_yard_size());
		new_dims.t = 0 - house_h;
	}

	this.homes_resize_main_layer(new_dims);


	//
	// prep wallpaper info - which ones do we need?
	//

	var wallpaper_hashes = this.homes_prep_wallpapers();


	//
	// collect all decos/walls/plats for all floors
	//

	var all = {
		'decos' : [],
		'walls'	: [],
		'plats'	: [],
	};
	var floors = [];

	var bounds = this.homes_get_floor_bounds();

	var door_pos = [
		bounds[0].r - 84,
		bounds[0].b - (cfg.frame_height + 25),
	];

	for (var i=0; i<floors_cfg.length; i++){

		var first = i==0;
		var last = i==floors_cfg.length-1;
		var wallpaper = [wallpaper_hashes, this.cfg.wallpaper[i]];

		if (cfg.layout == 'house-right'){
			floors.push(this.homes_rebuild_floor_offset(bounds[i].l, bounds[i].b, floors_cfg[i], wallpaper, last, first, cfg.layout, i));
		}
		if (cfg.layout == 'house-below'){
			floors.push(this.homes_rebuild_floor_offset(bounds[i].l, bounds[i].b, floors_cfg[i], wallpaper, first, last, cfg.layout, i));
		}
		if (cfg.layout == 'house-above'){
			floors.push(this.homes_rebuild_floor_offset(bounds[i].l, bounds[i].b, floors_cfg[i], wallpaper, last, first, cfg.layout, i));
		}
	}

	if (cfg.layout == 'house-right'){
		var top = bounds[bounds.length-1];
		floors.push(this.homes_rebuild_attic(top.l, top.t - cfg.frame_height, floors_cfg[0].length));
		floors.push(this.homes_rebuild_basement(floors_cfg[0].length));
	}


	//
	// merge all floors & layers into a single list of decos, walls and plats
	//

	var l = this.homes_deco_layers();
	for (var i=0; i<l.length; i++){
		var layer = l[i];
		for (var j=0; j<floors.length; j++){
			var floor = floors[j];
			for (var k=0; k<floor.decos[layer].length; k++){
				all.decos.push(floor.decos[layer][k]);
			}
		}
	}
	for (var j=0; j<floors.length; j++){
		for (var k=0; k<floors[j].walls.length; k++){
			all.walls.push(floors[j].walls[k]);
		}
		for (var k=0; k<floors[j].plats.length; k++){
			all.plats.push(floors[j].plats[k]);
		}
	}


	//
	// for house-on-right style, we need to add a left outer wall
	//

	if (cfg.layout == 'house-right'){

		var y = cfg.frame_height + cfg.frame_div_y + 1 + cfg.basement_h;
		var h = house_h + cfg.attic_h - y;

		all.walls.push({
			'item_perm'	: null,
			'pc_perm'	: null,
			'x'		: 0,
			'y'		: 0 - y,
			'h'		: h,
		});

	}


	//
	// insert decos
	//

	var bit_idx = 0;

	var decos = this.geometry.layers.middleground.decos;
	var max_z = 0;
	for (var i in decos){
		if (decos[i].is_home){
			delete decos[i];
		}else{
			max_z = decos[i].z > max_z ? decos[i].z : max_z;
		}
	}

	for (var i=0; i<all.decos.length; i++){
		max_z++;
		all.decos[i].z = max_z;
		all.decos[i].layer = 'middleground';
		
		// is_home makes the client render the deco in standalone mode, rather than
		// baking it into the bitmap. used whenever decos can change dynamically
		all.decos[i].is_home = true;
		
		all.decos[i].name = 'home_interior_'+(bit_idx++);
		this.homes_add_deco(all.decos[i]);
	}


	//
	// strip previous interior walls and add new ones
	//

	var walls = this.geometry.layers.middleground.walls;
	for (var i in walls){
		if (walls[i].is_home) delete walls[i];
	}

	for (var i=0; i<all.walls.length; i++){
		var wall = all.walls[i];
		wall.is_home = true;
		wall.name = 'home_interior_'+(bit_idx++);
		this.homes_add_wall(wall);
	}


	//
	// and plats
	//

	var plats =  this.geometry.layers.middleground.platform_lines;
	for (var i in plats){
		if (plats[i].is_home) delete plats[i];
	}

	for (var i=0; i<all.plats.length; i++){
		var plat = all.plats[i];
		plat.is_home = true;
		if (!plat.name) plat.name = 'home_interior_'+(bit_idx++);
		this.geometry.layers.middleground.platform_lines[plat.name] = plat;
	}


	this.geometry.layers.middleground.signposts = signposts;
	this.geometry.layers.middleground.doors = doors;


	//
	// add the external door
	//

	var external = apiFindObject(this.owner.houses_get_external_tsid());
	var external_info = external.geo_get_info();
	var marker_outside = external.geo_get_teleport_point();

	var doors = {};
	doors['door_out'] = {
		x: door_pos[0],
		y: door_pos[1],
		requires_level: 0,
		key_id: 0,
		connect: {
			target: external,
			mote_id: external_info.mote_id,
			hub_id: external_info.hub_id,
			x: intval(marker_outside.x),
			y: intval(marker_outside.y),
		},
		w: cfg.door_deco_w,
		h: cfg.door_deco_h,
		deco: {
			name: 'door_out_deco',
			sprite_class: cfg.door_deco_class,
			w: cfg.door_deco_w,
			h: cfg.door_deco_h,
		},
	};


	//
	// add internal doors
	//

	for (var i=1; i<floors_cfg.length; i++){

		// First, fix items if we don't have them
		if (!this.cfg.doors_up[i-1] || !this.cfg.doors_up[i-1].class_id) this.cfg.doors_up[i-1] = this.homes_create_door_item(this.cfg.doors_up[i-1] ? this.cfg.doors_up[i-1] : 150, 'up');
		if (!this.cfg.doors_down[i] || !this.cfg.doors_down[i].class_id) this.cfg.doors_down[i] = this.homes_create_door_item(this.cfg.doors_down[i] ? this.cfg.doors_down[i] : 150, 'down');

		// Now, move the door items into the right place
		this.cfg.doors_up[i-1].apiSetXY(this.cfg.doors_up[i-1].x, bounds[i-1].b - (108 + cfg.frame_height));
		this.cfg.doors_down[i].apiSetXY(this.cfg.doors_down[i].x, bounds[i].b - (108 + cfg.frame_height));

		// lower floor = i-1, higher floor = i

		doors['floor_'+i+'_up'] = {
			x: this.cfg.doors_up[i-1].x,
			y: this.cfg.doors_up[i-1].y,
			requires_level: 0,
			key_id: 0,
			connect: {
				target: this,
				mote_id: this.mote_id,
				hub_id: this.hub_id,
				x: this.cfg.doors_down[i].x,
				y: bounds[i].b-120,
			},
			w: cfg.up_deco_w,
			h: cfg.up_deco_h,
			itemstack_tsid: this.cfg.doors_up[i-1].tsid,
			target_tsid: this.cfg.doors_down[i].tsid
		};

		 doors['floor_'+i+'_down'] = {
			x: this.cfg.doors_down[i].x,
			y: this.cfg.doors_down[i].y,
			requires_level: 0,
			key_id: 0,
			connect: {
				target: this,
				mote_id: this.mote_id,
				hub_id: this.hub_id,
				x: this.cfg.doors_up[i-1].x,
				y: bounds[i-1].b-120,
			},
			w: cfg.down_deco_w,
			h: cfg.down_deco_h,
			itemstack_tsid: this.cfg.doors_down[i].tsid,
			target_tsid: this.cfg.doors_up[i-1].tsid
		};
	}

	this.geometry.layers.middleground.doors = doors;


	//
	// move teleport marker
	//

	var xp = this.geometry.r - 110;
	var yp = bounds[0].b - (45 + cfg.frame_height);

	for (var i in this.items){
		var item = this.items[i];
		if (item.class_tsid == 'marker_teleport'){
			item.apiSetXY(xp, yp);
		}
	}

	this.owner.houses_get_external_street().homes_rebuild_entrance();
	

	//
	// Restore furniture plats
	//

	var loc = this;
	var owner = this.owner;
	this.items.apiIterate(function(it){
		if (it.has_parent('furniture_base')){
			it.setPlatsAndWalls();
		}
	});

	//
	// Update owner's info cache
	//
	owner.profile_update_house_info();

	this.apiGeometryUpdated();
	this.upgrades_move_players(reload_reason ? reload_reason : 'misc');
	//log.info('post');
}

function homes_add_deco(args){

	var layer = args.layer ? args.layer : 'middleground';
	delete args.layer;

	args.x += args.w / 2;

	//log.info('adding deco', layer, args);

	this.geometry.layers[layer].decos[args.name] = args;
}

function homes_add_wall(args){

	var name = args.name;
	delete args.name;

	args.w = 0;
	args.y -= args.h;

	this.geometry.layers.middleground.walls[name] = args;
}

function homes_deco_layers(){
	return [
		'base',		// floor & ceiling
		'wall',		// wallpaper & ends
		'shadow',	// wall shadows
		'div',		// dividers
		'div_shadow',	// divider shadows
		'frame_h',	// framing
		'frame_v',	// ""
	];
}

function homes_rebuild_floor_offset(x, y, segments, wallpaper, is_top, is_bottom, cfg_type, floor_idx){

	var ret = this.homes_rebuild_floor(segments, wallpaper, is_top, is_bottom, cfg_type, floor_idx);

	for (var i=0; i<ret.walls.length; i++){
		ret.walls[i].x += x;
		ret.walls[i].y += y;
	}

	for (var i=0; i<ret.plats.length; i++){
		ret.plats[i].start.x += x;
		ret.plats[i].start.y += y;
		ret.plats[i].end.x += x;
		ret.plats[i].end.y += y;
	}

	for (var k in ret.decos)
	for (var i=0; i<ret.decos[k].length; i++){
		ret.decos[k][i].x += x;
		ret.decos[k][i].y += y;
		if (!ret.decos[k][i].h_flip) delete ret.decos[k][i].h_flip;
	}

	return ret;
}

function homes_rebuild_floor(segments, wallpaper_cfg, is_top, is_bottom, cfg_type, floor_idx){

	var cfg = this.homes_get_config();

	var wallpaper_hashes = wallpaper_cfg[0];
	var wallpaper = wallpaper_cfg[1];
	//log.info(this+' HASHES ', wallpaper_hashes);


	//
	// we store decos in arrays so we can composite with correct z depths once we have all floors
	//

	var decos = {};
	var walls = [];
	var plats = [];

	var l = this.homes_deco_layers();
	for (var i=0; i<l.length; i++) decos[l[i]] = [];


	//
	// floor and ceiling plats
	//

	var floor_start = (150 - 74);
	var ceiling_start = (150 - 74);

	if (segments[0] == 'left-open') floor_start = 56;
	if (segments[0] == 'left-open') ceiling_start = 8;

	var floor_end = 0 + this.geometry.r - (150 - 74);

	plats.push({
		'platform_item_perm'	: -1,
		'platform_pc_perm'	: -1,
		'start'			: {'x' : floor_start,		'y': 0 - (43 + cfg.frame_height)},
		'end'			: {'x' : floor_end,		'y': 0 - (43 + cfg.frame_height)},
	});

	plats.push({
		'platform_item_perm'	: 1,
		'platform_pc_perm'	: 1,
		'start'			: {'x' : ceiling_start,		'y': 0 - (456 + cfg.frame_height)},
		'end'			: {'x' : floor_end,		'y': 0 - (456 + cfg.frame_height)},
	});


	// floor & ceiling
	var flooring = this.homes_fetch_texture_hash(this.cfg.flooring[floor_idx], config.homes_floor_configs);
	var ceiling = this.homes_fetch_texture_hash(this.cfg.ceilings[floor_idx], config.homes_ceiling_configs);

	for (var i=0; i<segments.length; i++){
		decos.base.push({
			'x'		: 150 * i,
			'y'		: 0 - cfg.frame_height,
			'w'		: 150,
			'h'		: 108,
			'sprite_class'	: this.homes_get_floor_sprite(i, flooring),
			'floor_key'	: 'f_'+floor_idx,
			'floor_idx'	: i,
		});

		decos.base.push({
			'x'		: 150 * i,
			'y'		: 0 - (408 + cfg.frame_height),
			'w'		: 150,
			'h'		: 63,
			'sprite_class'	: this.homes_get_ceiling_sprite(i, ceiling),
			'ceiling_key'	: 'c_'+floor_idx,
			'ceiling_idx'	: i,
		});
	}


	// floor & ceiling shadows

	decos.base.push({
		'x'		: 0,
		'y'		: 0 - (408 + cfg.frame_height),
		'w'		: 300,
		'h'		: 50,
		'sprite_class'	: 'ceiling_shadow_left',
	});
	decos.base.push({
		'x'		: (segments.length * 150) - 300,
		'y'		: 0 - (408 + cfg.frame_height),
		'w'		: 300,
		'h'		: 50,
		'sprite_class'	: 'ceiling_shadow_left',
		'h_flip'	: true,
	});

	if (floor_idx == 0){
		decos.base.push({
			'x'		: 0,
			'y'		: 0 - cfg.frame_height,
			'w'		: 300,
			'h'		: 108,
			'sprite_class'	: 'floor_shadow_left_open',
		});
	}else{
		decos.base.push({
			'x'		: 0,
			'y'		: 0 - cfg.frame_height,
			'w'		: 300,
			'h'		: 108,
			'sprite_class'	: 'floor_shadow_right',
			'h_flip'	: true,
		});
	}
	decos.base.push({
		'x'		: (segments.length * 150) - 300,
		'y'		: 0 - cfg.frame_height,
		'w'		: 300,
		'h'		: 108,
		'sprite_class'	: 'floor_shadow_right',
	});

	


	//
	// framing
	//

	var frame_h = cfg.frame_hz_h ? cfg.frame_hz_h : cfg.frame_height;
	var frame_h_diff = frame_h - cfg.frame_height;

	var floor_segments = Math.ceil(this.geometry.r / cfg.frame_hz_w);
	for (var i=0; i<floor_segments; i++){

		//
		// we always have a bottom frame
		//

		decos.frame_h.push({
			'x'		: (cfg.frame_hz_w * i),
			'y'		: 0,
			'w'		: cfg.frame_hz_w,
			'h'		: frame_h,
			'sprite_class'	: cfg.double_frames ? cfg.frame_hz_deco_btm : cfg.frame_hz_deco,
		});


		//
		// we have a top frame if either this is the
		// top floor, or we have double frame
		//

		if (is_top || cfg.double_frames){

			decos.frame_h.push({
				'x'		: (cfg.frame_hz_w * i),
				'y'		: (0 - (458 + cfg.frame_height - frame_h_diff)),
				'w'		: cfg.frame_hz_w,
				'h'		: frame_h,
				'sprite_class'	: cfg.double_frames ? cfg.frame_hz_deco_top : cfg.frame_hz_deco,
			});
		}
	}


	// build wall segments
	var idx = 0;

	for (var i=0; i<segments.length; i++){

		var this_type = segments[i];
		var prev_type = null;
		var next_type = null;

		if (this_type == 'wall' || this_type == 'divide-left' || this_type == 'divide-right'){
			prev_type = segments[i-1];
			next_type = segments[i+1];
		}


		//
		// we need to determine what this segment is, from a wallpaper perspective.
		// this is like figuring out what piece of a 'room' it is, but different wallpapers
		// also divide rooms.
		//

		var this_wp = wallpaper[i];
		this_wp = this.homes_fetch_texture_key(this_wp, wallpaper_hashes); // double-check that this is valid
		var this_wp_hash = wallpaper_hashes[this_wp ? this_wp : '-'];
		var wallpaper_segment = this.homes_get_wallpaper_segment_type(floor_idx, i, wallpaper_hashes, this.cfg.wallpaper);
		var wp_key = 'wp_'+floor_idx+'_'+i;


		//
		// basic positioning
		//

		var x = idx * 150;
		var y = 0 - (108 + cfg.frame_height);

		if (this_type == 'left'){

			var wp = this_wp_hash.left;
			wp = wp.split(',');

			decos.wall.push({
				'x'		: x,
				'y'		: 0 - cfg.frame_height,
				'w'		: 150,
				'h'		: 458,
				'h_flip'	: wp[1] ? true : false,
				'sprite_class'	: wp[0],
				'wp_key'	: wp_key,
				'room'		: 'r'+floor_idx,
			});

			decos.shadow.push({
				'x'		: x + 17,
				'y'		: 0 - cfg.frame_height,
				'w'		: 133,
				'h'		: 458,
				'h_flip'	: true,
				'sprite_class'	: 'wallpaper_end_shadow',
			});

			decos.frame_v.push({
				'x'		: x,
				'y'		: 0,
				'w'		: cfg.frame_end_w,
				'h'		: cfg.frame_end_h,
				'h_flip'	: true,
				'sprite_class'	: cfg.frame_end_deco,
			});

			walls.push({
				'item_perm'	: 1,
				'pc_perm'	: 1,
				'x'		: x + (150 - 74),
				'y'		: 0 - (43 + cfg.frame_height),
				'h'		: 415,
			});
		}

		if (this_type == 'right'){

			var wp = this_wp_hash.right;
			wp = wp.split(',');

			decos.wall.push({
				'x'		: x,
				'y'		: 0 - cfg.frame_height,
				'w'		: 150,
				'h'		: 458,
				'h_flip'	: wp[1] ? true : false,
				'sprite_class'	: wp[0],
				'wp_key'	: wp_key,
				'room'		: 'r'+floor_idx,
			});

			decos.shadow.push({
				'x'		: x + 1,
				'y'		: 0 - cfg.frame_height,
				'w'		: 133,
				'h'		: 458,
				'sprite_class'	: 'wallpaper_end_shadow',
			});

			decos.frame_v.push({
				'x'		: x + (151 - cfg.frame_end_w),
				'y'		: 0,
				'w'		: cfg.frame_end_w,
				'h'		: cfg.frame_end_h,
				'sprite_class'	: cfg.frame_end_deco,
			});

			walls.push({
				'item_perm'	: -1,
				'pc_perm'	: -1,
				'x'		: x + 74,
				'y'		: 0 - (43 + cfg.frame_height),
				'h'		: 415,
			});
		}

		if (this_type == 'wall'){

			var wp = this_wp_hash[wallpaper_segment];
			wp = wp.split(',');

			decos.wall.push({
				'x'		: x,
				'y'		: y,
				'w'		: 150,
				'h'		: 300,
				'h_flip'	: wp[1] ? true : false,
				'sprite_class'	: wp[0],
				'wp_key'	: wp_key,
				'room'		: 'r'+floor_idx,
			});

			decos.shadow.push({
				'x'		: x,
				'y'		: y,
				'w'		: 150,
				'h'		: 300,
				'sprite_class'	: 'wallpaper_back_shadow_tile',
			});

			if (prev_type != 'wall' && prev_type != 'divide-right')
			decos.shadow.push({
				'x'		: x,
				'y'		: y,
				'w'		: 150,
				'h'		: 300,
				'sprite_class'	: 'wallpaper_back_shadow_left',
			});

			if (next_type != 'wall' && next_type != 'divide-left')
			decos.shadow.push({
				'x'		: x,
				'y'		: y,
				'w'		: 150,
				'h'		: 300,
				'sprite_class'	: 'wallpaper_back_shadow_right',
			});
		}

		if (this_type == 'divide-right'){

			var wp = this_wp_hash[wallpaper_segment];
			wp = wp.split(',');

			decos.wall.push({
				'x'		: x,
				'y'		: y,
				'w'		: 150,
				'h'		: 300,
				'h_flip'	: wp[1] ? true : false,
				'sprite_class'	: wp[0],
				'wp_key'	: wp_key,
				'room'		: 'r'+floor_idx,
			});

			decos.shadow.push({
				'x'		: x,
				'y'		: y,
				'w'		: 150,
				'h'		: 300,
				'sprite_class'	: 'wallpaper_back_shadow_tile',
			});

			decos.shadow.push({
				'x'		: x,
				'y'		: y,
				'w'		: 150,
				'h'		: 300,
				'sprite_class'	: 'wallpaper_back_shadow_left',
			});

			if (next_type != 'wall')
			decos.shadow.push({
				'x'		: x,
				'y'		: y,
				'w'		: 150,
				'h'		: 300,
				'sprite_class'	: 'wallpaper_back_shadow_right',
			});

			decos.div.push({
				'x'		: x,
				'y'		: 0 - (65 + cfg.frame_height),
				'w'		: 150,
				'h'		: 393,
				'h_flip'	: true,
				'sprite_class'	: 'wallpaper_divider_stucco_lightblue',
			});

			decos.div_shadow.push({
				'x'		: x + 1, //this seems to need +1 in one renderer?
				'y'		: 0 - (65 + cfg.frame_height),
				'w'		: 133,
				'h'		: 393,
				'h_flip'	: true,
				'sprite_class'	: 'wallpaper_divider_shadow',
			});

			var xpos = x;
			if (cfg.frame_div_center) xpos = x + 140 - Math.ceil(cfg.frame_div_w / 2);

			decos.frame_v.push({
				'x'		: xpos,
				'y'		: 0 - (cfg.frame_height + cfg.frame_div_y),
				'w'		: cfg.frame_div_w,
				'h'		: cfg.frame_div_h,
				'h_flip'	: true,
				'sprite_class'	: cfg.frame_div_deco,				
			});

			walls.push({
				'item_perm'	: null,
				'pc_perm'	: null,
				'x'		: x + 141,
				'y'		: 0 - (cfg.frame_height + cfg.frame_div_y + 1),
				'h'		: cfg.frame_div_h - (cfg.frame_height - 5),
			});

		}

		if (this_type == 'divide-left'){

			var wp = this_wp_hash[wallpaper_segment];
			wp = wp.split(',');

			decos.wall.push({
				'x'		: x,
				'y'		: y,
				'w'		: 150,
				'h'		: 300,
				'h_flip'	: wp[1] ? true : false,
				'sprite_class'	: wp[0],
				'wp_key'	: wp_key,
				'room'		: 'r'+floor_idx,
			});

			decos.shadow.push({
				'x'		: x,
				'y'		: y,
				'w'		: 150,
				'h'		: 300,
				'sprite_class'	: 'wallpaper_back_shadow_tile',
			});

			decos.shadow.push({
				'x'		: x,
				'y'		: y,
				'w'		: 150,
				'h'		: 300,
				'sprite_class'	: 'wallpaper_back_shadow_right',
			});

			decos.div.push({
				'x'		: x,
				'y'		: 0 - (65 + cfg.frame_height),
				'w'		: 150,
				'h'		: 393,
				'sprite_class'	: 'wallpaper_divider_stucco_lightblue',
			});

			decos.div_shadow.push({
				'x'		: x + 18,
				'y'		: 0 - (65 + cfg.frame_height),
				'w'		: 133,
				'h'		: 393,
				'sprite_class'	: 'wallpaper_divider_shadow',
			});


			var xpos = x;
			if (cfg.frame_div_center) xpos = x + 8 - Math.ceil(cfg.frame_div_w / 2);

			decos.frame_v.push({
				'x'		: xpos,
				'y'		: 0 - (cfg.frame_height + cfg.frame_div_y),
				'w'		: cfg.frame_div_w,
				'h'		: cfg.frame_div_h,
				'sprite_class'	: cfg.frame_div_deco,
			});

			walls.push({
				'item_perm'	: null,
				'pc_perm'	: null,
				'x'		: (150 * idx) + 8,
				'y'		: 0 - (cfg.frame_height + cfg.frame_div_y + 1),
				'h'		: cfg.frame_div_h - (cfg.frame_height - 5),
			});
		}

		if (this_type == 'left-open'){

			var wp = this_wp_hash.left_open;
			wp = wp.split(',');

			plats.push({
				'platform_item_perm'	: null,
				'platform_pc_perm'	: null,
				'start'			: {'x' : x-20, 'y': 0},
				'end'			: {'x' : x+56, 'y': 0 - (43 + cfg.frame_height)},
			});

			decos.div.push({
				'x'		: x,
				'y'		: 0 - (65 + cfg.frame_height),
				'w'		: 150,
				'h'		: 393,
				'h_flip'	: !!wp[1],
				'sprite_class'	: wp[0],
				'wp_key'	: wp_key,
				'room'		: 'r'+floor_idx,
			});

			decos.div_shadow.push({
				'x'		: x + 18,
				'y'		: 0 - (65 + cfg.frame_height),
				'w'		: 133,
				'h'		: 393,
				'sprite_class'	: 'wallpaper_divider_shadow',
			});

			decos.frame_v.push({
				'x'		: x+1,
				'y'		: 0 - (cfg.frame_height + cfg.frame_open_y),
				'w'		: cfg.frame_open_w,
				'h'		: cfg.frame_open_h,
				'sprite_class'	: cfg.frame_open_deco,
			});

			// interior wall (top section only)
			walls.push({
				'item_perm'	: null,
				'pc_perm'	: null,
				'x'		: x + 8,
				'y'		: 0 - (cfg.frame_height + cfg.frame_div_y + 1),
				'h'		: 456 - (cfg.frame_div_y + 1),
			});

			// stop players jumping into the outer frame gap
			plats.push({
				'platform_item_perm'	: 1,
				'platform_pc_perm'	: 1,
				'start'			: {'x' : 0, 'y': 0 - (cfg.frame_height + cfg.frame_div_y + 1)},
				'end'			: {'x' : 8, 'y': 0 - (cfg.frame_height + cfg.frame_div_y + 1)},
			});

			// wall to stop animals getting into house
			walls.push({
				'item_perm'	: -1,
				'pc_perm'	: 0,
				'x'		: x+8,
				'y'		: 0 - (cfg.frame_height + 1),
				'h'		: cfg.frame_div_y,
			});
		}

		idx++;
	}


	//
	// bottom frame caps
	//

	if (!cfg.double_frames){
		if ((cfg_type == 'house-right' || cfg_type == 'house-above') && !is_bottom){
			decos.frame_v.push({
				'x'		: 0,
				'y'		: 0,
				'w'		: 16,
				'h'		: cfg.frame_height,
				'h_flip'	: true,
				'sprite_class'	: 'crosssection_junction_t_groddle1',
			});
			decos.frame_v.push({
				'x'		: this.geometry.r-16,
				'y'		: 0,
				'w'		: 16,
				'h'		: cfg.frame_height,
				'sprite_class'	: 'crosssection_junction_t_groddle1',
			});
		}
		if ((cfg_type == 'house-below') && !is_top){
			decos.frame_v.push({
				'x'		: 0,
				'y'		: -475,
				'w'		: 16,
				'h'		: cfg.frame_height,
				'h_flip'	: true,
				'sprite_class'	: 'crosssection_junction_t_groddle1',
			});
			decos.frame_v.push({
				'x'		: this.geometry.r-16,
				'y'		: -475,
				'w'		: 16,
				'h'		: cfg.frame_height,
				'sprite_class'	: 'crosssection_junction_t_groddle1',
			});
		}
	}


	//
	// build the placement plats - they work by room
	//

	var rooms = [];
	var room = [];
	for (var i=0; i<segments.length; i++){
		if (segments[i] == 'wall'){
			room.push(i);
		}else{
			if (room.length > 0){
				rooms.push(room);
				room = [];
			}
		}
	}
	for (var i=0; i<rooms.length; i++){
		var start = rooms[i][0];
		var end = rooms[i].pop();

		var start_x = start * 150;
		var end_x = (end + 1) * 150;

		plats.push({
			'platform_item_perm'		: 0,
			'platform_pc_perm'		: 0,
			'start'				: {'x': start_x+10, 'y': 0 - (438 + cfg.frame_height)},
			'end'				: {'x': end_x-10,   'y': 0 - (438 + cfg.frame_height)},
			'placement_userdeco_set'	: 'ceiling',
			'placement_plane_height'	: 0,
			'is_for_placement'		: true,
		});

		plats.push({
			'platform_item_perm'		: 0,
			'platform_pc_perm'		: 0,
			'start'				: {'x': start_x+10, 'y': 0 - (118 + cfg.frame_height)},
			'end'				: {'x': end_x-10,   'y': 0 - (118 + cfg.frame_height)},
			'placement_userdeco_set'	: 'wall',
			'placement_plane_height'	: 280,
			'is_for_placement'		: true,
		});

		plats.push({
			'platform_item_perm'		: 0,
			'platform_pc_perm'		: 0,
			'start'				: {'x': start_x, 'y': 0 - (108 + cfg.frame_height)},
			'end'				: {'x': end_x,   'y': 0 - (108 + cfg.frame_height)},
			'placement_userdeco_set'	: 'bookshelf',
			'placement_plane_height'	: 0,
			'is_for_placement'		: true,
			'name'				: 'home_interior_floor_'+floor_idx,
		});

		plats.push({
			'platform_item_perm'		: 0,
			'platform_pc_perm'		: 0,
			'start'				: {'x': start_x-10, 'y': 0 - (73 + cfg.frame_height)},
			'end'				: {'x': end_x+10,   'y': 0 - (73 + cfg.frame_height)},
			'placement_userdeco_set'	: 'chair',
			'placement_plane_height'	: 0,
			'is_for_placement'		: true,
		});

		plats.push({
			'platform_item_perm'		: 0,
			'platform_pc_perm'		: 0,
			'start'				: {'x': start_x-42, 'y': 0 - (43 + cfg.frame_height)},
			'end'				: {'x': end_x+42,   'y': 0 - (43 + cfg.frame_height)},
			'placement_userdeco_set'	: 'rug',
			'placement_plane_height'	: 0,
			'is_for_placement'		: true,
		});

		plats.push({
			'platform_item_perm'		: 0,
			'platform_pc_perm'		: 0,
			'start'				: {'x': start_x-20, 'y': 0 - (23 + cfg.frame_height)},
			'end'				: {'x': end_x+20,   'y': 0 - (23 + cfg.frame_height)},
			'placement_userdeco_set'	: 'front',
			'placement_plane_height'	: 0,
			'is_for_placement'		: true,
		});

		//log.info('room:',start,end);
	}


	return {
		'decos': decos,
		'walls': walls,
		'plats': plats,
	};
}

function homes_rebuild_attic(x, y, segment_count){

	var decos = {};
	var walls = [];
	var plats = [];

	var l = this.homes_deco_layers();
	for (var i=0; i<l.length; i++) decos[l[i]] = [];


	//
	// build!
	//

	var cfg = this.homes_get_config();

	if (cfg.attic_h){
		for (var i=0; i<segment_count; i++){
			var deco = cfg.attic_mid_deco;
			if (i == 0) deco = cfg.attic_left_deco;
			if (i == segment_count-1) deco = cfg.attic_right_deco;
			decos.wall.push({
				'x'		: x + (150 * i),
				'y'		: y,
				'w'		: 150,
				'h'		: cfg.attic_h,
				'sprite_class'	: deco,
			});
		}

		plats.push({
			'platform_item_perm'	: null,
			'platform_pc_perm'	: null,
			'start'			: { x: x, y: y - cfg.attic_platform },
			'end'			: { x: x + (150 * segment_count), y: y - cfg.attic_platform },
		});
	}


	//log.info('%%%%%%%%%%%%%%%%%%%%%', cfg, decos);

	return {
		'decos': decos,
		'walls': walls,
		'plats': plats,
	};
}

function homes_rebuild_basement(segment_count){

	var decos = {};
	var walls = [];
	var plats = [];

	var l = this.homes_deco_layers();
	for (var i=0; i<l.length; i++) decos[l[i]] = [];


	//
	// build!
	//

	var cfg = this.homes_get_config();
	var x = 0;
	var y = 0;

	if (cfg.basement_h){
		for (var i=0; i<segment_count; i++){
			var deco = cfg.basement_mid_deco;
			if (i == 0) deco = cfg.basement_left_deco;
			if (i == segment_count-1) deco = cfg.basement_right_deco;
			decos.wall.push({
				'x'		: x + (150 * i),
				'y'		: y,
				'w'		: 150,
				'h'		: cfg.basement_h,
				'sprite_class'	: deco,
			});
		}
	}

	return {
		'decos': decos,
		'walls': walls,
		'plats': plats,
	};
}

function homes_reset_players(){

	var cfg = this.homes_get_config();

	//
	// find a safe spot to teleport players to.
	// left edge of floor 0 is the best bet
	//

	var bounds = this.homes_get_floor_bounds();

	var x = bounds[0].l + 150 + 75;
	var y = bounds[0].b - (45 + cfg.frame_height);

	//log.info("&&&&&&&&&&&&&&&&&&&&&&&&&&& MOVING PPL TO",x,y);

	for (var i in this.players){
		var pc = this.players[i];
		pc.reloadGeometry(x, y, 'rebuild');
	}
}

function homes_return_decos(){
	var owner = this.owner;
	if (!owner) return;

	var f_bag = owner.furniture_get_bag();
	if (!f_bag) return;

	var t_bag = owner.trophies_find_container();
	if (!t_bag) return;

	var door_count = 0;
	this.items.apiIterate(function(it){
		if (it.hasTag('furniture') && it.class_tsid != 'furniture_chassis'){
			if (it.class_tsid == 'furniture_door'){
				door_count++;
				if (door_count % 2 == 0){
					it.apiDelete();
					return;
				}
				
				it.reset();
			}

			f_bag.addItemStack(it);
			// TODO: Do we care about removing any deco-related geometry here?
			// Or not, since we're probably wiping the location anyway
		}
		else if (it.has_parent('trophy_base') && !t_bag.countItemClass(it.class_tsid)){
			t_bag.addItemStack(it);
		}
	});
}

function homes_rebuild_entrance(){
	if (!this.owner) return {ok: 0, error: "No owner"};

	var external_tsid = this.owner.houses_get_external_tsid();
	if (this.tsid != external_tsid) return {ok: 0, error: "This is not an external street"};

	var interior = apiFindObject(this.owner.houses_get_interior_tsid());
	if (!interior) return {ok: 0, error: "Could not find internal street"};

	var doors_in = this.geo_links_get_all_doors();
	if (!doors_in[0]) return {ok: 0, error: "No doors in"};

	var marker_inside = interior.geo_get_teleport_point();
	if (!marker_inside.found){
		var doors_out = interior.geo_links_get_all_doors();
		if (!doors_out[0]) return {ok: 0, error: "No doors out"};

		marker_inside.x = doors_out[0].x;
		marker_inside.y = doors_out[0].y;
	}

	this.geo_door_set_dest_pos(doors_in[0].door_id, interior, marker_inside.x, marker_inside.y);

	return {ok: 1};
}


//
// update a single piece of wallpaper, with key wp_key, to type wp_type
//

function homes_set_wp(wp_key, wp_type, preview){

	var walls_config = {};

	if (preview){
		walls_config = utils.apiCopyHash(this.cfg.wallpaper);
	}else{
		walls_config = this.cfg.wallpaper;
	}

	var keys = wp_key.split(',');
	for (var i=0; i<keys.length; i++){
		var ret = this.homes_set_wp_single(keys[i], wp_type, walls_config);
		if (!ret.ok) return ret;
	}

	this.homes_rebuild_wallpaper(walls_config, preview);

	return { ok: 1 };
}

function homes_set_wp_single(wp_key, wp_type, walls_config){

	var floors_cfg = this.homes_get_floor_config();

	//
	// is this a valid wp_type?
	//

	if (!config.homes_wallpaper_configs[wp_type]){
		return {
			'ok' : 0,
			'error' : 'cant_find_wallpaper',
		};
	}


	//
	// first, break down the key to find the indexes
	//

	var a = wp_key.split('_');
	var floor_idx = intval(a[1]);
	var wall_idx = intval(a[2]);

	if (floor_idx >= floors_cfg.length){
		return {
			'ok' : 0,
			'error' : 'bad_wallpaper_index_floor_too_high',
		};
	}
	if (wall_idx >= floors_cfg[0].length){
		return {
			'ok' : 0,
			'error' : 'bad_wallpaper_index_wall_too_high',
		};
	}


	//
	// now find the deco that represents the piece
	//

	var deco_ptr = null;
	for (var i in this.geometry.layers.middleground.decos){
		if (this.geometry.layers.middleground.decos[i].wp_key == wp_key){
			deco_ptr = this.geometry.layers.middleground.decos[i];
			break;
		}
	}
	if (!deco_ptr){
		return {
			'ok' : 0,
			'error' : 'cant_find_wallpaper_deco',
		};
	}


	//
	// update the wallpaper config hash
	//

	walls_config[floor_idx][wall_idx] = wp_type;

	return { 'ok': 1 };
}


function homes_set_floor(floor_key, floor_type, preview){

	if (!config.homes_floor_configs[floor_type]){
		return {
			'ok' : 0,
			'error' : 'bad_floor_type',
		};
	}

	var floors_cfg = this.homes_get_floor_config();
	var a = floor_key.split('_');
	var floor_idx = intval(a[1]);

	if (floor_idx >= floors_cfg.length || floor_idx < 0){
		return {
			'ok' : 0,
			'error' : 'bad_floor_index',
		}
	}

	if (preview){

		var temp = utils.apiCopyHash(this.cfg.flooring);
		temp[floor_idx] = floor_type;
		this.homes_rebuild_floors(temp, preview);
	}else{
		this.cfg.flooring[floor_idx] = floor_type;
		this.homes_rebuild_floors(this.cfg.flooring);
	}

	return { 'ok': 1 };
}

function homes_set_ceiling(ceiling_key, ceiling_type, preview){

	if (!config.homes_ceiling_configs[ceiling_type]){
		return {
			'ok' : 0,
			'error' : 'bad_ceiling_type',
		};
	}

	var floors_cfg = this.homes_get_floor_config();
	var a = ceiling_key.split('_');
	var floor_idx = intval(a[1]);

	if (floor_idx >= floors_cfg.length || floor_idx < 0){
		return {
			'ok' : 0,
			'error' : 'bad_ceiling_index',
		}
	}

	if (preview){

		var temp = utils.apiCopyHash(this.cfg.ceilings);
		temp[floor_idx] = ceiling_type;
		this.homes_rebuild_ceilings(temp, preview);

	}else{
		this.cfg.ceilings[floor_idx] = ceiling_type;
		this.homes_rebuild_ceilings(this.cfg.ceilings);
	}

	return { 'ok': 1 };
}

function homes_get_wallpaper_segment_type(floor_idx, wall_idx, hashes, wallpaper_cfg){

	var floors_cfg = this.homes_get_floor_config();
	var segments = floors_cfg[floor_idx];
	var wallpaper = wallpaper_cfg[floor_idx];

	var this_type = segments[wall_idx];
	var prev_type = null;
	var next_type = null;

	//var this_wp = wallpaper[wall_idx];
	var this_wp = this.homes_fetch_texture_key(wallpaper[wall_idx], hashes);
	var prev_wp = null;
	var next_wp = null;

	if (this_type == 'wall' || this_type == 'divide-left' || this_type == 'divide-right'){
		prev_type = segments[wall_idx-1];
		next_type = segments[wall_idx+1];

		prev_wp = wallpaper[wall_idx-1];
		next_wp = wallpaper[wall_idx+1];
	}

	var has_segment_left = false;
	var has_segment_right = false;

	if ((prev_type == 'wall' || prev_type == 'divide-right') && (this_type == 'wall' || this_type == 'divide-left')){
		if (this_wp == prev_wp){
			has_segment_left = true;
		}
	}

	if ((next_type == 'wall' || next_type == 'divide-left') && (this_type == 'wall' || this_type == 'divide-right')){
		if (this_wp == next_wp){
			has_segment_right = true;
		}
	}

	var wallpaper_segment = 'wall';
	if (has_segment_left && !has_segment_right) wallpaper_segment = 'wall_right';
	if (!has_segment_left && has_segment_right) wallpaper_segment = 'wall_left';
	if (!has_segment_left &&!has_segment_right) wallpaper_segment = 'wall_single';

	// if we know we don't have this seg, reduce it. this means that we'll use
	// 'wall' instead of 'wall_right' when they have the same value. this is useful
	// for the random-sections stuff below (else end pieces will always use plain
	// 'wall' piece).
	//log.info(this+' homes_get_wallpaper_segment_type: '+hashes+' - '+this_wp);
	var hash = hashes[this_wp];
	//log.info(this+' hash: '+hash);
	if (hash[wallpaper_segment] == hash['wall']) wallpaper_segment = 'wall';


	// deal with optional multi-wall sequences
	if (wallpaper_segment == 'wall'){
		var num_segs = 1;
		if (num_segs == 1 && hash['wall_2']) num_segs = 2;
		if (num_segs == 2 && hash['wall_3']) num_segs = 3;
		if (num_segs == 3 && hash['wall_4']) num_segs = 4;
		if (num_segs == 4 && hash['wall_5']) num_segs = 5;
		if (num_segs == 5 && hash['wall_6']) num_segs = 6;

		if (num_segs > 1){

			var this_seg = ((wall_idx + floor_idx) % num_segs) + 1;
			if (this_seg > 1){

				wallpaper_segment = 'wall_' + this_seg;
			}
		}
	}

	return wallpaper_segment;
}


//
// we call this after some of the wallpaper config has changed.
// we need to do this because setting a single piece of wallpaper
// can affect the other pieces around it (e.g. chan ging from
// 'wall_single' to 'wall_left', etc.)
//

function homes_rebuild_wallpaper(wallpaper_config, preview){

	// get config for all the papers we need
	var hashes = this.homes_prep_wallpapers();


	//
	// build a hash of which texture to apply to which segment
	//

	var wps = {};
	var floors_cfg = this.homes_get_floor_config();

	for (var i=0; i<floors_cfg.length; i++){
		for (var j=0; j<floors_cfg[0].length; j++){

			var this_type = floors_cfg[i][j];
			var this_wp = this.homes_fetch_texture_key(wallpaper_config[i][j], hashes);

			switch (this_type){
				case 'left'		: var wall_segment = 'left'; break;
				case 'right'		: var wall_segment = 'right'; break;
				case 'left-open'	: var wall_segment = 'left_open'; break;
				default			: var wall_segment = this.homes_get_wallpaper_segment_type(i, j, hashes, wallpaper_config);
			}

			wps['wp_'+i+'_'+j] = hashes[this_wp][wall_segment];
		}
	}


	//
	// apply the decos
	//

	var updated_msg = {
		'type'		: "deco_update",
		'layers'	: { 'middleground' : {} },
	};

	for (var i in this.geometry.layers.middleground.decos){
		var deco = this.geometry.layers.middleground.decos[i];
		if (deco.wp_key && wps[deco.wp_key]){

			var wp = wps[deco.wp_key].split(',');

			var update = false;

			if (deco.sprite_class != wp[0]){
				update = true;
			}

			if ((deco.h_flip && !wp[1]) || (!deco.h_flip && wp[1])){
				update = true;
			}

			if (update){

				updated_msg.layers.middleground[i] = {
					'sprite_class'	: wp[0],
					'h_flip'	: wp[1] ? true : false,
				};

				if (!preview){
					deco.sprite_class = wp[0];
					if (wp[1]){
						deco.h_flip = true;
					}else{
						delete deco.h_flip;
					}
				}
			}
		}
	}


	//log.info("UPDATED:::: ", updated_msg);

	if (preview){
		updated_msg.preview = 1;
		preview.apiSendMsg(updated_msg);
	}else{
		this.apiGeometryUpdated();
		this.apiSendMsg(updated_msg);
	}

	//this.upgrades_move_players('upgrade');	
}


//
// make sure the location has all the swfs it needs for the wallpapers
// we're using, then return a hash of all the wallpapers used.
//

function homes_prep_wallpapers(){

	return config.homes_wallpaper_configs;
}

function homes_rebuild_floors(floor_cfg, preview){

	var updated_msg = {
		'type'		: "deco_update",
		'layers'	: { 'middleground' : {} },
	};

	for (var i in this.geometry.layers.middleground.decos){
		var deco = this.geometry.layers.middleground.decos[i];
		if (deco.floor_key){

			var a = deco.floor_key.split('_');
			var floor_idx = intval(a[1]);

			var deco_key = floor_cfg[floor_idx];
			var deco_hash = this.homes_fetch_texture_hash(deco_key, config.homes_floor_configs);

			var idx = utils.has_key('floor_idx', deco) ? deco.floor_idx : (deco.floor_left ? 0 : 1);
			var new_deco = this.homes_get_floor_sprite(idx, deco_hash);

			if (deco.sprite_class != new_deco){

				if (!preview){
					deco.sprite_class = new_deco;
				}
				updated_msg.layers.middleground[i] = { 'sprite_class' : new_deco };
			}
		}
	}

	if (preview){
		updated_msg.preview = 1;
		preview.apiSendMsg(updated_msg);
	}else{
		this.apiGeometryUpdated();
		this.apiSendMsg(updated_msg);
	}
}

function homes_get_floor_sprite(idx, deco_hash){

	if (idx == 0) return deco_hash.left;

	var num_pieces = 1;
	if (num_pieces == 1 && deco_hash.main_2) num_pieces = 2;
	if (num_pieces == 2 && deco_hash.main_3) num_pieces = 3;
	if (num_pieces == 3 && deco_hash.main_4) num_pieces = 4;
	if (num_pieces == 4 && deco_hash.main_5) num_pieces = 5;
	if (num_pieces == 5 && deco_hash.main_6) num_pieces = 6;

	var use_idx = (idx % num_pieces) + 1;

	return use_idx == 1 ? deco_hash.main : deco_hash['main_'+use_idx];
}

function homes_get_ceiling_sprite(idx, deco_hash){

	var num_pieces = 1;
	if (num_pieces == 1 && deco_hash.main_2) num_pieces = 2;
	if (num_pieces == 2 && deco_hash.main_3) num_pieces = 3;
	if (num_pieces == 3 && deco_hash.main_4) num_pieces = 4;
	if (num_pieces == 4 && deco_hash.main_5) num_pieces = 5;
	if (num_pieces == 5 && deco_hash.main_6) num_pieces = 6;

	var use_idx = (idx % num_pieces) + 1;

	return use_idx == 1 ? deco_hash.main : deco_hash['main_'+use_idx];
}

function homes_rebuild_ceilings(ceiling_config, preview){

	var updated_msg = {
		'type'		: "deco_update",
		'layers'	: { 'middleground' : {} },
	};

	for (var i in this.geometry.layers.middleground.decos){
		var deco = this.geometry.layers.middleground.decos[i];
		if (deco.ceiling_key){

			var a = deco.ceiling_key.split('_');
			var floor_idx = intval(a[1]);

			var deco_key = ceiling_config[floor_idx];
			var deco_hash = homes_fetch_texture_hash(deco_key, config.homes_ceiling_configs);

			var idx = utils.has_key('ceiling_idx', deco) ? deco.ceiling_idx : 0;
			var new_deco = this.homes_get_ceiling_sprite(idx, deco_hash);

			if (deco.sprite_class != new_deco){

				if (!preview){
					deco.sprite_class = new_deco;
				}
				updated_msg.layers.middleground[i] = { 'sprite_class' : new_deco };
			}
		}
	}

	if (preview){
		updated_msg.preview = 1;
		preview.apiSendMsg(updated_msg);
	}else{
		this.apiGeometryUpdated();
		this.apiSendMsg(updated_msg);
	}
}

function homes_get_middlelayer_size(){
	return {
		l : this.geometry.l,
		t : this.geometry.t,
		b : this.geometry.b,
		r : this.geometry.r,
	};
}


//
// this function needs to deal with all the parallaxing layers!
//

function homes_resize_main_layer(new_dims){

	var old_dims = this.homes_get_middlelayer_size();

	this.geometry.t = new_dims.t;
	this.geometry.r = new_dims.r;
	this.geometry.b = new_dims.b;
	this.geometry.l = new_dims.l;


	//
	// the middleground layer is easy - we just adjust the bounds
	//

	var w = new_dims.r - new_dims.l;
	var h = new_dims.b - new_dims.t;

	var mid = this.geometry.layers.middleground;
	mid.w = w;
	mid.h = h;


	//
	// other layers are harder
	//

	var old_w = old_dims.r - old_dims.l;
	var old_h = old_dims.b - old_dims.t;

	for (var i in this.geometry.layers){
		if (i == 'middleground') continue;
		var layer = this.geometry.layers[i];

		var old_l_w = layer.w;
		var old_l_h = layer.h;

		var new_l_w = old_l_w * (w / old_w);
		var new_l_h = old_l_h * (h / old_h);

		for (var j in layer.decos){
			var deco = layer.decos[j];

			var c_x = deco.x;
			var c_y = deco.y + (deco.h / 2);

			var x = ((c_x / old_l_w) * old_w) + old_dims.l;
			c_x = new_l_w * ((x - new_dims.l) / w);

			var y = ((c_y / old_l_h) * old_h) + old_dims.t;
			c_y = new_l_h * ((y - new_dims.t) / h);

			deco.x = c_x;
			deco.y = c_y - (deco.h / 2);
		}

		layer.w = layer.w * (w / old_w);
		layer.h = layer.h * (h / old_h);
	}

}

function homes_fetch_texture_hash(key, hash){
	if (hash[key]) return hash[key];
	for (var i in hash) return hash[i];
	return {};
}

function homes_fetch_texture_key(key, hash){
	if (hash[key]) return key;
	for (var i in hash) return i;
	return null;
}

function homes_delete_wallpaper(type){
	for (var i=0; i<this.cfg.floors.length; i++){
		for (var j=0; j<this.cfg.wallpaper[0].length; j++){
			if (this.cfg.wallpaper[i][j] == type) this.cfg.wallpaper[i][j] = 'blue';
		}
	}

	this.homes_rebuild_wallpaper(this.cfg.wallpaper, false);
}

function homes_delete_flooring(type){
	for (var i=0; i<this.cfg.floors.length; i++){
		if (this.cfg.flooring[i] == type) this.cfg.flooring[i] = 'woodpanel';
	}

	this.homes_rebuild_floors(this.cfg.flooring, false);
}

function homes_delete_ceiling(type){
	for (var i=0; i<this.cfg.ceilings.length; i++){
		if (this.cfg.ceilings[i] == type) this.cfg.ceilings[i] = 'white_crappy';
	}

	this.homes_rebuild_ceilings(this.cfg.ceilings, false);
}

function homes_yard_rebuild(reload_reason){

	var new_dims = this.homes_get_middlelayer_size();

	if (this.cfg && this.cfg.floors){

		this.homes_init_config();

		var cfg		= this.homes_get_config();
		var floors_cfg	= this.homes_get_floor_config();
		var house_w	= floors_cfg[0].length * 150;

		if (cfg.layout == 'house-right'){
			new_dims.l = 0 - this.home_get_yard_size();
		}
		if (cfg.layout == 'house-below' || cfg.layout == 'house-above'){
			new_dims.l = 0;
			new_dims.r = Math.max(house_w, this.home_get_yard_size());
		}

	}else{
		this.homes_init_config_frontyard();
		var sz = this.home_get_yard_size();

		new_dims.l = 0 - sz[0];
		new_dims.r = 0 + sz[1];
	}

	this.homes_resize_main_layer(new_dims);

	this.apiGeometryUpdated();

	//
	// Update owner's info cache
	//
	this.owner.profile_update_house_info();

	this.upgrades_move_players(reload_reason ? reload_reason : 'misc');
}

function homes_demo_backyard(){

	this.homes_delete_items_of_class('home_sign');
	this.homes_delete_items_of_class('magic_rock');

	var i5 = apiNewItem('magic_rock');
	this.apiPutItemIntoPosition(i5, -29, -155);
	i5.setProp('only_visible_to', this.owner.tsid);

	this.homes_init_config();
	this.homes_yard_rebuild();
}

function homes_delete_items_of_class(class_tsid){

	var delete_list = [];

	for (var tsid in this.items){
		var i = this.items[tsid];
		if (i.class_tsid == class_tsid) delete_list.push(i);
	}

	for (var i=0; i<delete_list.length; i++){

		delete_list[i].apiDelete();
	}

	return delete_list.length;
}

function homes_is_r2(){
	for (var tsid in this.items){
		var i = this.items[tsid];
		if (i.class_tsid == 'home_sign' || i.class_tsid == 'magic_rock') return true;
	}
	return false;
}

function homes_replace_sign_with_rock(){
	var sign = this.findFirst('home_sign');
	if (sign){
		var rock = sign.replaceWith('magic_rock');
		if (rock) rock.setProp('only_visible_to', this.owner.tsid);
	}
}

function homes_scrub_r1(){

	var found_home_sign = false;
	var delete_list = [];

	for (var tsid in this.items){

		var i = this.items[tsid];
		var delete_me = false;

		//log.info("checking", i);

		if (i.class_tsid == 'patch') delete_me = true;
		if (i.class_tsid == 'wood_tree') delete_me = true;
		if (i.class_tsid == 'rock_metal_1') delete_me = true;
		if (i.class_tsid == 'garden_new') delete_me = true;

		if (i.is_trant) delete_me = true;

		if (i.class_tsid == 'home_sign' || i.class_tsid == 'magic_rock') found_home_sign = true;

		if (delete_me) delete_list.push(i);
	}

	//log.info("*********************************** START SCRUB");

	if (!found_home_sign){

		//log.info("delete_list", delete_list);

		for (var i=0; i<delete_list.length; i++){

			//log.info("deleting stack "+delete_list[i].tsid);
			delete_list[i].apiDelete();
		}
	}else{
		//log.info("no need to delete anything!");
	}

	//log.info("*********************************** END SCRUB");
}

function homes_demo_frontyard(make_empty){

	var doors = this.geometry.layers.middleground.doors;
	var door_uid = null;
	if (doors['door_1']){
		door_uid = 'door_1';
	}else{
		for (var i in doors){
			if (!door_uid) door_uid = i;
		}
		if (door_uid){
			doors['door_1'] = doors[door_uid];
			delete doors[door_uid];
		}else{
			log.error("***** no door found in location during homes_demo_frontyard()");
			return;
		}
	}

	var door = doors['door_1'];
	delete door.deco;

	this.homes_delete_items_of_class('furniture_chassis');
	this.homes_delete_items_of_class('home_sign');
	this.homes_delete_items_of_class('magic_rock');

	if (!make_empty){
		var i4 = apiNewItem('furniture_chassis');
		i4.setInstanceProp('facing_right', 0);
		this.apiPutItemIntoPosition(i4, door.x, door.y);
		door.itemstack_tsid = i4.tsid;

		var i5 = apiNewItem('magic_rock');
		this.apiPutItemIntoPosition(i5, 221, -144);
		i5.setProp('only_visible_to', this.owner.tsid);
	}

	this.homes_init_config_frontyard();
	this.homes_yard_rebuild();
}

function homes_restore_chassis(){
	var chassis = this.findFirst('furniture_chassis');
	if (!chassis){
		var doors = this.geometry.layers.middleground.doors;
		var door_uid = null;
		if (doors['door_1']){
			door_uid = 'door_1';
		}else{
			for (var i in doors){
				if (!door_uid) door_uid = i;
			}
			if (door_uid){
				doors['door_1'] = doors[door_uid];
				delete doors[door_uid];
			}else{
				log.error("***** no door found in location during homes_restore_chassis()");
				return;
			}
		}

		var door = doors['door_1'];
		delete door.deco;

		chassis = apiNewItem('furniture_chassis');
		chassis.setInstanceProp('facing_right', 0);
		this.apiPutItemIntoPosition(chassis, door.x, door.y);
		door.itemstack_tsid = chassis.tsid;

		this.upgrades_move_players('misc');
	}
}

// tells the client how much stuff if going to cost
function homes_get_expand_costs(){


	// for frontyard only...
	if (this.is_home && this.is_public){
		return {
			'yard' : this.home_get_yard_expansion_costs(),
		};
	}


	var CLASS_EARTH		= 'grade_aa_earth_block';
	var CLASS_WALL		= 'wall_segment';
	var CLASS_GIRDER	= 'girder';
	var CLASS_WORK		= 'construction_tool';

	var WORK_FOR_FLOOR_TWO	= 10;
	var WORK_FOR_FLOOR_THREE = 15;

	var out = {
		'floor' : {
			'count' : this.homes_num_floors_remaining(),
			'locked' : !!this.home_has_active_expansion(),
		},
		'wall' : {
			'count' : this.homes_num_segments_remaining(),
			'locked' : !!this.home_has_active_expansion(),
		},
	};

	var num_floors = this.cfg.floors.length;
	var num_walls = this.cfg.floors[0].length;


	//
	// expand walls
	//

	if (out.wall.count){

		out.wall.items = {};
		out.wall.items[CLASS_WALL] = num_floors;
		//out.wall.items[CLASS_EARTH] = 0;
		//out.wall.items[CLASS_GIRDER] = 0;

		if (num_floors == 2){
			out.wall.items[CLASS_EARTH] = 1;
			if (((num_walls + 1) % 4) == 0) out.wall.items[CLASS_GIRDER] = 1;
		}
		if (num_floors == 3){
			out.wall.items[CLASS_EARTH] = 3;
			if (((num_walls + 1) % 4) == 0) out.wall.items[CLASS_GIRDER] = 2;
			if (((num_walls + 1) % 8) == 0) out.wall.items[CLASS_GIRDER] = 3;
		}
	}


	//
	// add a floor
	//	

	if (out.floor.count){

		out.floor.items = {};
		out.floor.items[CLASS_WALL] = num_walls;
		out.floor.items[CLASS_EARTH] =  num_walls;
		out.floor.items[CLASS_GIRDER] = Math.floor(num_walls / 4);

		out.floor.work = {};
		out.floor.work[CLASS_WORK] = WORK_FOR_FLOOR_TWO;

		out.floor.door_placement = {};
		out.floor.door_placement.plat_id = 'home_interior_floor_'+(num_floors-1);
		out.floor.door_placement.direction = 'up';

		if (num_floors == 2){
			out.floor.items[CLASS_EARTH] *= 2;
			out.floor.items[CLASS_GIRDER] += Math.floor(num_walls / 8);
			out.floor.work[CLASS_WORK] = WORK_FOR_FLOOR_THREE;
		}

		if (config.home_limits.UPGRADES_ARE_FREE){
			out.floor.items = {};
			out.floor.work = {};
			out.floor.items['plank'] = 10;
		}

		var cfg = this.homes_get_config();
		if (cfg.layout == 'house-below'){
			out.floor.door_placement.direction = 'down';
		}
	}

	out.yard = this.home_get_yard_expansion_costs();


	//
	// unexpand
	//

	out.unexpand = {
		count	: Math.max(0, this.cfg.floors[0].length - (config.home_limits.MIN_WALL_SEGMENTS - 2)),
		locked	: !!this.home_has_active_expansion(),
	};

	if (out.unexpand.count){

		// we need to offset this so that the refund for tour first expansions
		// has the correct values.
		var segs = out.unexpand.count - (config.home_limits.START_WALL_SEGMENTS - config.home_limits.MIN_WALL_SEGMENTS);
		while (segs < 0) segs += 4;

		out.unexpand.items = {
			'wood_post' : num_floors * 2,
			'board' : num_floors * 6,
			'barnacle_talc' : num_floors * ((segs % 2 == 0) ? 8 : 7),
		};
		if (segs % 2 == 0) out.unexpand.items['beam'] = num_floors * 1;
		if (segs % 4 == 0) out.unexpand.items['girder'] = num_floors * 1;
	}

	return out;
}

// Are we currently doing a job/project to expand this house?
function home_has_active_expansion(){
	var jobs = this.jobs_get_all(true);
	for (var i in jobs){
		var job = jobs[i];
		if (!job) continue;

		if (job.type == 5 && job.class_tsid == 'job_proto_door' && !job.isDone()) return true;
	}

	return false;
}

function home_get_yard_size(){

	if (this.is_home && !this.is_public){
		this.homes_init_config();
		return this.cfg.yard_expansions * 150;
	}

	if (this.is_home && this.is_public){
		this.homes_init_config_frontyard();
		return [this.cfg.yard_expansions_left * 150, this.cfg.yard_expansions_right * 150];
	}

	return 0;
}

function home_get_yard_expansion_costs(){

	// interior street
	if (this.is_home && !this.is_public){
		this.homes_init_config();

		var remain = this.home_get_yard_expansions_remaining();
		var start = config.home_limits.START_BACKYARD_SEGMENTS;
		var max = config.home_limits.MAX_BACKYARD_SEGMENTS;

		var costs = config.home_limits.BACKYARD_EXPAND_COSTS;
		var idx = (max - remain) - start;

		return {
			'count'		: remain,
			'img_cost'	: 0 + costs[idx],
		};
	}

	// exterior street
	if (this.is_home && this.is_public){
		this.homes_init_config_frontyard();

		var num = this.home_get_yard_expansions_remaining();
		var remain = num[0] + num[1];
		var start = config.home_limits.START_FRONTYARD_LEFT_SEGMENTS + config.home_limits.START_FRONTYARD_RIGHT_SEGMENTS;
		var max = config.home_limits.MAX_FRONTYARD_LEFT_SEGMENTS + config.home_limits.MAX_FRONTYARD_RIGHT_SEGMENTS;

		var costs = config.home_limits.FRONTYARD_EXPAND_COSTS;
		var idx = (max - remain) - start;

		return {
			'count_left'	: num[0],
			'count_right'	: num[1],
			'img_cost'	: 0 + costs[idx],
		};
	}

	return {
		'error' : 'not_a_home_street',
	};
}

function home_get_yard_expansions_remaining(){

	if (this.is_home && !this.is_public){

		return Math.max(0, config.home_limits.MAX_BACKYARD_SEGMENTS - this.cfg.yard_expansions);
	}

	if (this.is_home && this.is_public){

		var l = Math.max(0, config.home_limits.MAX_FRONTYARD_LEFT_SEGMENTS  - this.cfg.yard_expansions_left );
		var r = Math.max(0, config.home_limits.MAX_FRONTYARD_RIGHT_SEGMENTS - this.cfg.yard_expansions_right);
		return [l, r];
	}

	return 0;
}

function home_add_expansion(side){

	//
	// backyard
	//

	if (this.is_home && !this.is_public){

		if (this.home_get_yard_expansions_remaining() <= 0){
			return {
				ok: 0,
				error: 'already_max_size',
			};
		}

		this.cfg.yard_expansions++;
		this.homes_yard_rebuild('expand_street');
		
		
		if (this.home_get_yard_expansions_remaining() <= 0) { 
			this.owner.achievements_increment("max_expansions", "yard", 1);
		}

		return { ok : 1 };
	}


	//
	// frontyard
	//

	if (this.is_home && this.is_public){

		var num = this.home_get_yard_expansions_remaining();

		if (side == 'left' ){

			if (num[0] <= 0){
				return {
					ok: 0,
					error: 'already_max_size',
				};
			}

			this.cfg.yard_expansions_left++;
		}

		if (side == 'right'){

			if (num[1] <= 0){
				return {
					ok: 0,
					error: 'already_max_size',
				};
			}

			this.cfg.yard_expansions_right++;
		}

		this.homes_yard_rebuild('expand_street');
		
		num = this.home_get_yard_expansions_remaining(); // get the new numbers
		if (num[0] <= 0 && num[1] <= 0) { 
			this.owner.achievements_increment("max_expansions", "street", 1);
		}

		return { ok : 1 };
	}

	return {
		ok: 0,
		error: 'not_a_home',
	};
}

function homes_get_style_choices(is_admin){

	// back yard
	if (this.is_home && !this.is_public){

		var out = {};

		for (var i in config.homes_interior_configs){

			var style = config.homes_interior_configs[i];

			if (!is_admin && !style.is_visible) continue;

			var loc = apiFindObject(style.template);
			var img = loc.getProp('image');

			out[i] = {
				'label'		: style.label,
				'is_current'	: !!(i == this.cfg.style),
				'is_subscriber'	: style.is_subscriber,
				'image'		: 'http://c2.glitch.bz/' + (style.thumb ? style.thumb : (img ? img.url : '')),
				'main_image'	: style.main_image,
				'loading_image'	: style.loading_image,
			};

			if (!style.is_visible) out[i].admin_only = true;
		}

		return out;
	}

	// front yard
	if (this.is_home && this.is_public){

		var out = {};

		for (var i in config.homes_exterior_configs){

			var style = config.homes_exterior_configs[i];

			if (!is_admin && !style.is_visible) continue;

			var loc = apiFindObject(style.template);
			var img = loc.getProp('image');

			out[i] = {
				'label'		: style.label,
				'is_current'	: !!(i == this.cfg.style),
				'is_subscriber'	: style.is_subscriber,
				'image'		: 'http://c2.glitch.bz/' + (style.thumb ? style.thumb : img.url),
				'main_image'	: style.main_image,
				'loading_image'	: style.loading_image,
			};

			if (!style.is_visible) out[i].admin_only = true;
		}

		return out;
	}

	return {};
}

function homes_rebuild_exterior(reload_reason){

	this.homes_init_config_frontyard();

	var cfg = config.homes_exterior_configs[this.cfg.style];


	//
	// capture current doors - we'll need those later
	//

	var doors = this.geometry.layers.middleground.doors;


	//
	// reset geo from template
	//

	var template_tsid = cfg.template;
	var template_inst = apiFindObject(template_tsid);

	var tmp = template_inst.homes_get_cloned_geo();
	this.geometry = {};
	for (var i in tmp) this.geometry[i] = tmp[i];

	this.geometry.layers.middleground.doors = doors;


	//
	// Reset furniture plats
	//

	this.items.apiIterate(function(it){
		if (it.has_parent('furniture_base')){
			it.setPlatsAndWalls();
		}
	});


	//
	// reset friends signpost
	//

	this.updateNeighborSignpost();


	//
	// go!
	//

	this.homes_yard_rebuild(reload_reason);
}


function homes_get_teleport_location(){

	// tower
	if (this.is_home && this.home_id == 'tower'){

		var pos = this.tower_get_teleport_point();
		return {
			tsid: this.tsid,
			x: pos[0],
			y: pos[1]
		};
	}

	// exterior street
	if (this.is_home && this.is_public){

		var landing = this.geo_get_teleport_point(false);
		if (!landing.found){

			var interior = this.owner.houses_get_interior_street();
			landing = interior.pols_get_entrance_outside();
		}

		return landing;
	}

	// interior street
	if (this.is_home && !this.is_public){

		return this.geo_get_teleport_point(false);
	}

	return {};
}

function homes_set_name(name){
	this.custom_name = name;
}

function homes_get_info(){

	// incase this gets called on old-style POLs or broken ones
	// (see issue #8330)
	if (!this.cfg) return {};

	var home_type = this.homes_get_type();

	// front yard
	if (home_type == 'exterior'){
		return {
			left_start	: config.home_limits.START_FRONTYARD_LEFT_SEGMENTS,
			right_start	: config.home_limits.START_FRONTYARD_RIGHT_SEGMENTS,

			left_now	: this.cfg.yard_expansions_left,
			right_now	: this.cfg.yard_expansions_right,

			left_max	: config.home_limits.MAX_FRONTYARD_LEFT_SEGMENTS,
			right_max	: config.home_limits.MAX_FRONTYARD_RIGHT_SEGMENTS,

			style		: this.cfg.style,
		};
	}

	// back yard
	if (home_type == 'interior'){
		return {
			yard_start	: config.home_limits.START_BACKYARD_SEGMENTS,
			yard_now	: this.cfg.yard_expansions,
			yard_max	: config.home_limits.MAX_BACKYARD_SEGMENTS,

			segs_start	: config.home_limits.START_WALL_SEGMENTS,
			segs_now	: this.cfg.floors[0].length + 2,
			segs_max	: config.home_limits.MAX_WALL_SEGMENTS,

			floors_now	: this.cfg.floors.length,
			floors_max	: config.home_limits.MAX_FLOORS,
		};
	}

	if (home_type == 'tower'){
		return {
			custom_name	: this.tower_get_custom_name(),

			floors_start	: config.towers.START_FLOORS,
			floors_now	: this.cfg.floors,
			floors_max	: config.towers.MAX_FLOORS,
		};
	}

	return {};
}

function homes_rebuild_from_template(){

	var map = {
		'int' : {
			'firebog_int_1b__high' : 1,
			'uralia_int_3__high' : 1,
			'kajuu_int_3_hor_high' : 1,
			'uralia_1_hor_high' : 1,
			'firebog_int_1b_hor_high' : 1,
			'firebog_int_3_hor_high' : 1,
			'firebog_1_hor_high' : 1,
		},
		'ext' : {
			'firebog_4a_high' : 1,
			'firebog_2_high' : 1,
			'firebog_4_high' : 1,
			'heights_1_high' : 1,
			'uralia_1_high' : 1,
			'forest_6_high' : 1,
			'uralia_2a_high' : 1,
			'firebog_1b_high' : 1,
			'firebog_1_high' : 1,
		}
	};

	// interior
	if (this.is_home && !this.is_public){
		if (map['int'][this.cfg.style]){
			this.homes_rebuild_rooms('rebuild');
		}
	}

	// exterior
	if (this.is_home && this.is_public){
		if (map['ext'][this.cfg.style]){
			this.homes_rebuild_exterior('rebuild');
		}
	}
}



// called by the player object to position a tower
// on this external street. used during testing

function homes_position_tower(tower, x, y){

	//
	// make sure we have a chassis
	//

	var chassis = this.homes_get_tower_chassis();
	if (!chassis){
		chassis = apiNewItem('furniture_tower_chassis');
		this.apiPutItemIntoPosition(chassis, x, y);
	}
	else{
		x = chassis.x;
		y = chassis.y;
	}


	//
	// make sure we have a door
	//

	var door = null;
	for (var i in this.geometry.layers.middleground.doors){
		var d = this.geometry.layers.middleground.doors[i];
		if (d.itemstack_tsid == chassis.tsid){
			door = d;
			delete door.deco;
			break;
		}
	}
	if (!door){
		door = {
			'requires_level'	: 0,
			'key_id'		: 0,
			'itemstack_tsid'	: chassis.tsid,
		};
		this.geometry.layers.middleground.doors['tower_'+chassis.tsid] = door;
	}


	//
	// set door position and target
	//

	var teleport_pos = tower.tower_get_teleport_point();

	door.x = x;
	door.y = y;
	door.connect = {
		'target'	: tower,
		'mote_id'	: this.moteid,
		'hub_id'	: this.hubid,
		'x'		: teleport_pos[0],
		'y'		: teleport_pos[1],
	};


	//
	// finally, make sure the tower exits here
	//

	tower.tower_set_exit(this, x, y);
}

function homes_get_tower_chassis(){

	for (var i in this.items){
		if (this.items[i].class_tsid == 'furniture_tower_chassis'){
			return this.items[i];
		}
	}

	return null;
}

function homes_set_newxp(){
	this.is_newxp = true;
	delete this.current_step;

	if (this.is_home && this.is_public){
		this.special_loading_image = {
			url: 'streets/2012-07-12-static/houses_adding_house.png',
			w: 600,
			h: 400
		};

		var chassis = this.findFirst('furniture_chassis');
		if (chassis){
			chassis.not_selectable = true;
		}

		// We'll add this back later
		this.geo_lock_signpost('signpost_1');
		this.apiGeometryUpdated();
	}
}

function homes_unset_newxp(){
	if (this.is_postnewxp) return;
	
	delete this.is_newxp;
	delete this.current_step;

	var chassis = this.findFirst('furniture_chassis');
	if (chassis){
		delete chassis.not_selectable;
	}

	delete this.give_skill_learning;
	if (this.is_home && this.is_public){
		this.is_postnewxp = true;
	}
}
