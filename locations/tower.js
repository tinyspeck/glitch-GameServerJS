
function tower_create(owner){

	this.is_home = true;
	this.home_id = 'tower';

	this.isOwnable = true;
	this.cost = 0;
	this.owner_type = 1;
	this.owner = owner;
	this.is_public = true;
	this.no_sync = true;
	
	if (owner.notifyButlersAboutTower) {
		owner.notifyButlersAboutTower();
	}
}

function tower_init(){

	// oops, forgot to set this!
	if (!this.is_public) this.is_public = true;

	if (!this.cfg) this.cfg = {};
	if (!this.cfg.floors) this.cfg.floors = config.towers.START_FLOORS;
	if (!this.cfg.flooring) this.tower_reset_flooring();
	if (!this.cfg.ceilings) this.tower_reset_ceilings();
	if (!this.cfg.wallpaper) this.tower_reset_wallpaper();
	if (!this.cfg.is_expanding) this.cfg.is_expanding = false;
	if (!this.cfg.floor_labels) this.cfg.floor_labels = {};

	// check that the sizes of the wall/floor/ceiling configs match
	// the sizes of the tower

	while (this.cfg.flooring.length  < this.cfg.floors) this.cfg.flooring.push(config.towers.START_TEXTURE_FLOOR);
	while (this.cfg.ceilings.length  < this.cfg.floors) this.cfg.ceilings.push(config.towers.START_TEXTURE_CEILING);
	while (this.cfg.wallpaper.length < this.cfg.floors) this.cfg.wallpaper.push([]);

	while (this.cfg.flooring.length  > this.cfg.floors) this.cfg.flooring.pop();
	while (this.cfg.ceilings.length  > this.cfg.floors) this.cfg.ceilings.pop();
	while (this.cfg.wallpaper.length > this.cfg.floors) this.cfg.wallpaper.pop();

	var geo_config = this.tower_get_geo_config();

	for (var i=0; i<this.cfg.floors; i++){
		while (this.cfg.wallpaper[i].length < geo_config.wall_segments+1) this.cfg.wallpaper[i].push(config.towers.START_TEXTURE_WALL);
		while (this.cfg.wallpaper[i].length > geo_config.wall_segments+1) this.cfg.wallpaper[i].pop();
	}
}

function tower_reset(){
	delete this.cfg;
	this.tower_init();
	this.tower_rebuild();
}

function tower_start_expand(){
	this.tower_init();

	if (this.cfg.is_expanding){
		return {
			ok: 0,
			error: 'already_building',
		};
	}

	if (this.cfg.floors >= config.towers.MAX_FLOORS){
		return {
			ok: 0,
			error: 'max_size_already',
		};
	}

	this.cfg.is_expanding = true;
	this.tower_rebuild();

	return {
		ok: 1,
	};
}

function tower_end_expand(){
	// this is called by the tower_expander item, when
	// the expansion job has been completed.
	this.tower_init();
	if (!this.cfg.is_expanding) return;
	this.cfg.floors++;
	this.cfg.is_expanding = false;
	this.tower_rebuild();

	apiLogAction('TOWER_EXPAND', 'pc='+this.owner.tsid, 'location='+this.tsid, 'floors='+this.cfg.floors);
}

function tower_reset_wallpaper(){
	var geo_config = this.tower_get_geo_config();
	this.cfg.wallpaper = [];
	for (var i=0; i<this.cfg.floors; i++){
		var floor = [];
		for (var j=0; j<=geo_config.wall_segments; j++){
			floor.push(config.towers.START_TEXTURE_WALL);
		}
		this.cfg.wallpaper.push(floor);
	}
}

function tower_reset_flooring(){
	this.cfg.flooring = [];
	for (var i=0; i<this.cfg.floors; i++){
		this.cfg.flooring.push(config.towers.START_TEXTURE_FLOOR);
	}
}

function tower_reset_ceilings(){
	this.cfg.ceilings = [];
	for (var i=0; i<this.cfg.floors; i++){
		this.cfg.ceilings.push(config.towers.START_TEXTURE_CEILING);
	}
}

function tower_set_floors(num){
	// remove this function after we're done testing!
	if (num < 2) return;
	if (num > config.towers.MAX_FLOORS) return;
	this.tower_init();
	this.cfg.floors = num;
	this.cfg.is_expanding = false;
	this.tower_rebuild();
}

function tower_rebuild(reload_reason){

	this.tower_init();


	//
	// build all the floors
	//

	var bounds = this.tower_get_bounds();

	this.tower_reset_geometry(bounds.w-1, bounds.h);

	var floors = [];
	for (var i=0; i<this.cfg.floors; i++){
		var x = bounds.floors[i].l;
		var y = bounds.floors[i].b;
		floors.push(this.tower_build_floor_offset(x, y, i));
	}
	if (this.cfg.is_expanding){
		floors.push(this.tower_build_expansion(bounds));
	}

	var all = this.geo_builder_merge_groups(floors);
	this.geo_builder_insert(all, this.geometry);

	this.tower_build_elevator();
	this.tower_build_exit();

	// reset furniture plats
	this.items.apiIterate(function(it){
		if (it.has_parent('furniture_base')){
			it.setPlatsAndWalls();
		}
	});

	this.apiGeometryUpdated();
	this.tower_move_players(reload_reason ? reload_reason : 'misc');

	//testing this last
	this.tower_check_construction(bounds);

	// after tower is rebuilt, make sure exterior matches interior size
	var ext_street = this.owner.houses_get_external_street();
	if (ext_street){
		var chassis = ext_street.homes_get_tower_chassis();
		if (chassis){
			chassis.setExtraFloors(this.cfg.floors - 2);
		}
	}
}

function tower_build_floor_offset(x, y, floor_idx){

	var ret = this.tower_build_floor(floor_idx);

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

function tower_build_floor(floor_idx){

	var walls = [];
	var plats = [];
	var decos = {
		'base'		: [],
		'main'		: [],
		'shadow'	: [],
		'frame'		: [],
	};

	var geo_cfg = this.tower_get_geo_config();
	var bounds = this.tower_get_bounds();


	//
	// framing
	//

	var is_top = !!(floor_idx == this.cfg.floors - 1);
	var is_bottom = !!(floor_idx == 0);

	var frame_h = geo_cfg.frame_hz_h ? geo_cfg.frame_hz_h : geo_cfg.frame_height;
	var frame_h_diff = frame_h - geo_cfg.frame_height;

	var frame_segments = Math.ceil(bounds.w / geo_cfg.frame_hz_w);
	for (var i=0; i<frame_segments; i++){

		//
		// we always have a bottom frame
		//

		decos.frame.push({
			'x'		: (geo_cfg.frame_hz_w * i),
			'y'		: 0,
			'w'		: geo_cfg.frame_hz_w,
			'h'		: frame_h,
			'sprite_class'	: geo_cfg.double_frames ? geo_cfg.frame_hz_deco_btm : geo_cfg.frame_hz_deco,
		});


		//
		// we have a top frame if either this is the
		// top floor, or we have double frame
		//

		if (is_top || geo_cfg.double_frames){

			decos.frame.push({
				'x'		: (geo_cfg.frame_hz_w * i),
				'y'		: (0 - (458 + geo_cfg.frame_height - frame_h_diff)),
				'w'		: geo_cfg.frame_hz_w,
				'h'		: frame_h,
				'sprite_class'	: geo_cfg.double_frames ? geo_cfg.frame_hz_deco_top : geo_cfg.frame_hz_deco,
			});
		}
	}


	//
	// plats & walls
	//

	var floor_start = 130; // (150 - 74);
	var floor_end = bounds.w - (150 - 74);
	var floor_y = 0 - (frame_h + 43);
	var ceiling_y = 0 - (frame_h + 456);

	plats.push({ // floor
		'platform_item_perm'	: -1,
		'platform_pc_perm'	: -1,
		'start'			: {'x' : floor_start,	'y': floor_y},
		'end'			: {'x' : floor_end,	'y': floor_y},
	});

	plats.push({ // ceiling
		'platform_item_perm'	: 1,
		'platform_pc_perm'	: 1,
		'start'			: {'x' : floor_start,	'y': ceiling_y},
		'end'			: {'x' : floor_end,	'y': ceiling_y},
	});

	walls.push({ // left
		'item_perm'	: 1,
		'pc_perm'	: 1,
		'x'		: floor_start,
		'y'		: floor_y,
		'h'		: 415,
	});

	walls.push({ // right
		'item_perm'     : -1,
		'pc_perm'       : -1,
		'x'		: floor_end,
		'y'		: floor_y,
		'h'		: 415,
	});


	//
	// floor & ceiling
	//

	var floor_hash		= this.geo_textures_fetch_hash(this.cfg.flooring[floor_idx], config.homes_floor_configs);
	var ceiling_hash	= this.geo_textures_fetch_hash(this.cfg.ceilings[floor_idx], config.homes_ceiling_configs);

	for (var i=0; i<geo_cfg.wall_segments+2; i++){

		decos.base.push({
			'x'		: 150 * i,
			'y'		: 0 - frame_h,
			'w'		: 150,
			'h'		: 108,
			'sprite_class'	: this.geo_textures_get_floor_texture(i, floor_hash),
			'floor_key'	: 'f_'+floor_idx,
			'floor_idx'	: i,
		});

		decos.base.push({
			'x'		: 150 * i,
			'y'		: 0 - (408 + frame_h),
			'w'		: 150,
			'h'		: 63,
			'sprite_class'	: this.geo_textures_get_ceiling_texture(i, ceiling_hash),
			'ceiling_key'	: 'c_'+floor_idx,
			'ceiling_idx'	: i,
		});
	}


	//
	// floor & ceiling shadows
	// (we only need to do right-side shadows, since the elevator covers the left side)
	//

	decos.base.push({
		'x'		: bounds.w + 17 - 300,
		'y'		: 0 - (408 + frame_h),
		'w'		: 300,
		'h'		: 50,
		'sprite_class'	: 'ceiling_shadow_left',
		'h_flip'	: true,
	});

	decos.base.push({
		'x'		: bounds.w + 17 - 300,
		'y'		: 0 - frame_h,
		'w'		: 300,
		'h'		: 108,
		'sprite_class'	: 'floor_shadow_right',
	});



	//
	// figure out wallpaper sprites
	//

	var wallpaper_config = this.cfg.wallpaper[floor_idx];
	var sprites = this.geo_textures_get_room_textures(wallpaper_config.slice(0,-1));
	var right_key = wallpaper_config[wallpaper_config.length-1];
	var right_hash = this.geo_textures_fetch_hash(right_key, config.homes_wallpaper_configs);
	sprites.push(right_hash.right);


	//
	// draw wall segments
	//

	for (var i=0; i<=geo_cfg.wall_segments; i++){

		var x = geo_cfg.left_offset + (i * 150);
		var y = 0 - 108; // floor height

		var wp_key = 'wp_'+floor_idx+'_'+i;

		if (i == geo_cfg.wall_segments){

			var wp = sprites[i].split(',');

			decos.main.push({
				x		: x,
				y		: 0 - frame_h,
				w		: 150,
				h		: 458,
				h_flip		: wp[1] ? true : false,
				sprite_class	: wp[0],
				wp_key		: wp_key,
				'room'		: 'r'+floor_idx,
			});

			decos.shadow.push({
				'x'		: x + 1,
				'y'		: 0 - frame_h,
				'w'		: 133,
				'h'		: 458,
				'sprite_class'	: 'wallpaper_end_shadow',
			});

		}else{

			var wp = sprites[i].split(',');

			decos.main.push({
				x		: x,
				y		: y - frame_h,
				w		: 150,
				h		: 300,
				h_flip		: wp[1] ? true : false,
				sprite_class	: wp[0],
				wp_key		: wp_key,
				room		: 'r'+floor_idx,
			});

			decos.shadow.push({
				'x'		: x,
				'y'		: y - frame_h,
				'w'		: 150,
				'h'		: 300,
				'sprite_class'	: 'wallpaper_back_shadow_tile',
			});

			if (i==0)
			decos.shadow.push({
				'x'		: x,
				'y'		: y - frame_h,
				'w'		: 150,
				'h'		: 300,
				'sprite_class'	: 'wallpaper_back_shadow_left',
			});

			if (i == geo_cfg.wall_segments-1)
			decos.shadow.push({
				'x'		: x,
				'y'		: y - frame_h,
				'w'		: 150,
				'h'		: 300,
				'sprite_class'	: 'wallpaper_back_shadow_right',
			});
		}
	}


	//
	// placement plats
	//

	var start_x = geo_cfg.left_offset + 32;
	var end_x = geo_cfg.left_offset + ((geo_cfg.wall_segments + 0) * 150);

	this.geo_builder_room_plats(plats, start_x, end_x, frame_h);


	return {
		'decos': decos,
		'walls': walls,
		'plats': plats,
	};
}


function tower_reset_geometry(w, h){

	var geo = {
		l		: 0, 
		r		: w,
		t		: -h,
		b		: 0,
		swf_file	: 'home_groddle.swf,home_wallpaper.swf,home_tower.swf',
		layers		: {},
		music_file	: '',
		ground_y	: -100, // TODO
		rookable_type	: 0,
		gradient	: { top : '99CC', bottom : 'B5FAFF' },
		sources		: {},
	};
	
	// get a copy of the normal physics, and make changes for the tower
	geo.physics = utils.copy_hash(config.physics_configs.normal);
	geo.physics.y_cam_offset = 220;

	geo.layers = {};
	geo.layers.middleground = {
		'name'		: 'middleground',
		'targets'	: {},
		'w'		: w,
		'h'		: h,
		'z'		: 0,
		'decos'		: {},
		'walls'		: {},
		'ladders'	: {},
		'doors'		: {},
		'platform_lines': {},
		'signposts'	: {},
		'boxes'		: {},
	};


	for (var i in geo){
		this.geometry[i] = geo[i];
	}
}

function tower_get_geo_config(){

	var out = {
		'wall_segments'		: 6,
		'left_offset'		: 145,
	};

	out.frame_hz_w = 1200;
	out.frame_hz_deco = 'crosssection_tower_horizontal_1200px';
	out.double_frames = false;
	out.frame_h = 28;
	out.frame_height = 28;
	out.basement_h = 0;
	out.attic_h = 0;
	out.frame_hz_h = 28;

	out.door_deco_class = 'door_asset_entry_basic';
	out.door_deco_w = 75;
	out.door_deco_h = 236;

	return out;
}

function tower_get_bounds(){

	this.tower_init();

	var geo_cfg = this.tower_get_geo_config();
	var floors = this.cfg.floors;

	var out = {};

	out.floor_height = 458 + geo_cfg.frame_height;

	out.h = geo_cfg.basement_h + (floors * out.floor_height) + geo_cfg.frame_height + geo_cfg.attic_h;
	out.w = geo_cfg.left_offset + ((geo_cfg.wall_segments + 1) * 150) - 17;

	// floor bounds
	out.floors = [];
	for (var i=0; i<floors; i++){
		out.floors.push({
			'l' : 0,
			'b' : 0 - (geo_cfg.basement_h + (i * out.floor_height)),
			'w' : out.w,
			'h' : out.floor_height,
		});
	}

	if (this.cfg.is_expanding){
		out.expansion = {
			'l' : 0,
			'b' : 0 - (geo_cfg.basement_h + (floors * out.floor_height) + geo_cfg.frame_height),
			'w' : out.w,
			'h' : 486,
		};
		out.h += out.expansion.h;

		// position of the job item
		out.expansion.job = {
			'x'	: 260 + 80,
			'y'	: out.expansion.b - 70,
		};
	}

	out.exit_door = {
		'x' : out.floors[0].w - 67,
		'y' : out.floors[0].b - (geo_cfg.frame_height + 25),
	};

	return out;
}


function tower_build_elevator(){

	var geo_cfg = this.tower_get_geo_config();
	var bounds = this.tower_get_bounds();	

	var connects = {};
	for (var i=0; i<bounds.floors.length; i++){

		var id = 'fl_1_'+(i);
		if (i == 0) id = 'exit';

		connects[id] = {
			'hub_id'	: this.hubid,
			'mote_id'	: this.moteid,
			'x'		: 200,
			'y'		: bounds.floors[i].b - 70,
			'target'	: this,
		};

		if (this.cfg.floor_labels[i]) connects[id].custom_label = this.cfg.floor_labels[i];
	}

	var num_rows = bounds.floors.length;

	if (this.cfg.is_expanding){

		num_rows++;

		var id = 'fl_1_'+(bounds.floors.length);
		connects[id] = {
			'hub_id'	: this.hubid,
			'mote_id'	: this.moteid,
			'x'		: 200,
			'y'		: bounds.expansion.b - 70,
			'target'	: this,
		}

		var i = bounds.floors.length;
		if (this.cfg.floor_labels[i]) connects[id].custom_label = this.cfg.floor_labels[i];
	}


	//
	// build the elevator signposts
	//

	for (var i=0; i<bounds.floors.length; i++){

		var sign_name = 'elevator_'+i;

		var sign = {
			x	: 90,
			y	: bounds.floors[i].b,
			w	: 180,
			h	: 514,
			deco	: {
				w		: 180,
				h		: 514,
				name		: sign_name+'_deco',
				sprite_class	: 'signpost_asset_elevator_tower',
			},
			connects : utils.copy_hash(connects),
			quarter_info : {
				'label'		: 'TOWER',
				'style'		: 'apartment',
				'cols'		: 1,
				'rows'		: num_rows,
				'col'		: i==0 ? 0 : 1,
				'row'		: i,
			},
		};

		this.geometry.layers.middleground.signposts[sign_name] = sign;
	}

	if (this.cfg.is_expanding){

		var sign_name = 'elevator_'+bounds.floors.length;

		var sign = {
			x	: 90,
			y	: bounds.expansion.b + geo_cfg.frame_height,
			w	: 180,
			h	: 514,
			deco	: {
				w		: 180,
				h		: 514,
				name		: sign_name+'_deco',
				sprite_class	: 'signpost_asset_elevator_tower',
			},
			connects : utils.copy_hash(connects),
			quarter_info : {
				'label'		: 'TOWER',
				'style'		: 'apartment',
				'cols'		: 1,
				'rows'		: num_rows,
				'col'		: 1,
				'row'		: bounds.floors.length,
			},
		};

		this.geometry.layers.middleground.signposts[sign_name] = sign;
	}
}

function tower_get_teleport_point(){

	var bounds = this.tower_get_bounds();
	var geo_cfg = this.tower_get_geo_config();

	var x = bounds.w - 150;
	var y = bounds.floors[0].b - (geo_cfg.frame_height + 50);

	return [x, y];
}

function tower_set_ceiling(ceiling_key, ceiling_type, preview){

	this.tower_init();

	if (!config.homes_ceiling_configs[ceiling_type]){
		return {
			'ok' : 0,
			'error' : 'bad_ceiling_type',
		};
	}

	var a = ceiling_key.split('_');
	var floor_idx = intval(a[1]);

	if (floor_idx >= this.cfg.floors || floor_idx < 0){
		return {
			'ok' : 0,
			'error' : 'bad_ceiling_index',
		}
	}

	if (preview){

		var temp = utils.apiCopyHash(this.cfg.ceilings);
		temp[floor_idx] = ceiling_type;
		this.geo_textures_rebuild_ceilings(temp, preview);

	}else{
		this.cfg.ceilings[floor_idx] = ceiling_type;
		this.geo_textures_rebuild_ceilings(this.cfg.ceilings);
	}

	return { 'ok': 1 };
}

function tower_set_floor(floor_key, floor_type, preview){

	this.tower_init();

	if (!config.homes_floor_configs[floor_type]){
		return {
			'ok' : 0,
			'error' : 'bad_floor_type',
		};
	}

	var a = floor_key.split('_');
	var floor_idx = intval(a[1]);

	if (floor_idx >= this.cfg.floors || floor_idx < 0){
		return {
			'ok' : 0,
			'error' : 'bad_floor_index',
		}
	}

	if (preview){

		var temp = utils.apiCopyHash(this.cfg.flooring);
		temp[floor_idx] = floor_type;
		this.geo_textures_rebuild_floors(temp, preview);
	}else{
		this.cfg.flooring[floor_idx] = floor_type;
		this.geo_textures_rebuild_floors(this.cfg.flooring);
	}

	return { 'ok': 1 };
}


function tower_set_wp(wp_key, wp_type, preview){

	var walls_config = {};

	if (preview){
		walls_config = utils.apiCopyHash(this.cfg.wallpaper);
	}else{
		walls_config = this.cfg.wallpaper;
	}

	var keys = wp_key.split(',');
	for (var i=0; i<keys.length; i++){
		var ret = this.tower_set_wp_single(keys[i], wp_type, walls_config);
		if (!ret.ok) return ret;
	}

	this.tower_rebuild_wallpaper(walls_config, preview);

	return { ok: 1 };
}

function tower_set_wp_single(wp_key, wp_type, walls_config){

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

	if (floor_idx >= this.cfg.floors){
		return {
			'ok' : 0,
			'error' : 'bad_wallpaper_index_floor_too_high',
		};
	}
	if (wall_idx >= this.cfg.wallpaper[0].length){
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

function tower_rebuild_wallpaper(wallpaper_config, preview){

	//
	// build a hash of which texture to apply to which segment
	//

	var wps = {};

	for (var i=0; i<wallpaper_config.length; i++){

		var sprites = this.geo_textures_get_room_textures(wallpaper_config[i].slice(0,-1));

		var right_key = wallpaper_config[i][wallpaper_config[i].length-1];
		var right_hash = this.geo_textures_fetch_hash(right_key, config.homes_wallpaper_configs);
		sprites.push(right_hash.right);

		for (var j=0; j<sprites.length; j++){

			wps['wp_'+i+'_'+j] = sprites[j];
		}
	}


	//
	// apply the decos
	//

	var updated_msg = {
		'type'	  : "deco_update",
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
					'sprite_class'  : wp[0],
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

	if (preview){
		updated_msg.preview = 1;
		preview.apiSendMsg(updated_msg);
	}else{
		this.apiGeometryUpdated();
		this.apiSendMsg(updated_msg);
	}
}

function tower_get_reload_position(floor_idx){

	if (floor_idx == 0) return this.tower_get_teleport_point();

	var bounds = this.tower_get_bounds();
	var p = [200, 0];

	if (floor_idx >= bounds.floors.length){
		p[1] = bounds.expansion.b - 70;
	}else{
		p[1] = bounds.floors[floor_idx].b - 70;
	}

	return p;
}

function tower_move_players(change_type, floor_idx){

	//
	// move all players to the ground floor, except
	// the the owner, in the case where we've just expanded.
	// in that case, move them to the top.
	//

	var p = this.tower_get_reload_position(0);
	var po = p;

	if (this.cfg.floors > 2 || this.cfg.is_expanding){

		var top_idx = this.cfg.floors-1;
		if (this.cfg.is_expanding) top_idx++;
		po = this.tower_get_reload_position(top_idx);
	}

	for (var i in this.players){

		var pc = this.players[i];
		if (!pc) continue;

		if (pc.tsid == this.owner.tsid){
			pc.reloadGeometry(po[0], po[1], change_type);
		}else{
			pc.reloadGeometry(p[0], p[1], change_type);
		}
	}
}

function tower_build_expansion(bounds){

	var geo_cfg = this.tower_get_geo_config();

	var walls = [];
	var plats = [];
	var decos = {
		'base'		: [],
		'main'		: [],
		'shadow'	: [],
		'frame'		: [],
	};


	//
	// plats & walls
	//

	var floor_start = 130; // (150 - 74);
	var floor_end = 290;
	var floor_y = (0 - 43) + bounds.expansion.b;

	plats.push({ // floor
		'platform_item_perm'	: null,
		'platform_pc_perm'	: null,
		'start'			: {'x' : floor_start,   'y': floor_y},
		'end'			: {'x' : floor_end,     'y': floor_y},
	});

	plats.push({ // ceiling
		'platform_item_perm'	: 1,
		'platform_pc_perm'	: 1,
		'start'			: {'x' : floor_start,   'y': floor_y-415},
		'end'			: {'x' : floor_end,     'y': floor_y-415},
	});

	walls.push({ // left
		'item_perm'	: 1,
		'pc_perm'	: 1,
		'x'		: floor_start,
		'y'		: floor_y,
		'h'		: 415,
	});

	walls.push({ // right
		'item_perm'	: -1,
		'pc_perm'	: -1,
		'x'		: floor_end,
		'y'		: floor_y,
		'h'	     : 415,
	});


	//
	// floor & ceiling
	//

	decos.base.push({
		'x'		: 0,
		'y'		: bounds.expansion.b,
		'w'		: 1177,
		'h'		: 108,
		'sprite_class'	: 'towerbase_floor',
	});

	decos.base.push({
		'x'		: 0,
		'y'		: bounds.expansion.b - 408,
		'w'		: 1177,
		'h'		: 50,
		'sprite_class'	: 'towerbase_ceiling',
	});

	decos.base.push({
		'x'		: 0,
		'y'		: bounds.expansion.b - 458,
		'w'		: 1177,
		'h'		: 28,
		'sprite_class'	: 'crosssection_tower_base_horizontal_1177px',
	});


	//
	// walls
	//

	for (var i=0; i<=geo_cfg.wall_segments; i++){

		var x = geo_cfg.left_offset + (i * 150);
		var y = bounds.expansion.b;

		if (i == geo_cfg.wall_segments){

			decos.main.push({
				x		: x,
				y		: y,
				w		: 150,
				h		: 458,
				sprite_class	: 'towerbase_wallpaper_right',
			});

		}else{

			var sprite = choose_one(['towerbase_wallpaper_wall', 'towerbase_wallpaper_wall_2']);

			decos.main.push({
				x		: x,
				y		: y - 108,
				w		: 150,
				h		: 300,
				sprite_class	: sprite,
			});
		}
	}

	return {
		'decos': decos,
		'walls': walls,
		'plats': plats,
	};
}

function tower_check_construction(bounds){

	// check we have a tower_expander item if we're supposed to,
	// else delete it and cancel any pending jobs.

	var ex = null;
	for (var i in this.items){
		if (this.items[i].class_tsid == 'tower_expander'){
			if (ex){
				this.items[i].apiDelete();
			}else{
				ex = this.items[i];
			}
		}
	}

	if (this.cfg.is_expanding){
		if (ex){
			// we have it - move into place

			ex.apiSetXY(bounds.expansion.job.x, bounds.expansion.job.y);
		}else{
			// we don't have one - create it

			var s = apiNewItemStack('tower_expander', 1);
			if (!s) return null;
			this.apiPutItemIntoPosition(s, bounds.expansion.job.x, bounds.expansion.job.y);

			var job_class = 'job_tower_floor_'+(this.cfg.floors+1);
			s.configureJob(job_class);
		}
	}else{
		if (ex){
			// delete the jobs first, then the item
			this.jobs_delete_all();
			if (ex) ex.apiDelete();
		}
	}
}

function tower_set_exit(street, x, y){

	this.exit = {
		x: x,
		y: y,
		street : street,
	};

	this.tower_build_exit();
}

function tower_build_exit(){

	if (!this.exit || !this.exit.street){
		log.error("no exit infor - can't build exit door");
		return;
	}

	if (!this.geometry || !this.geometry.layers || !this.geometry.layers.middleground) return;

	var bounds = this.tower_get_bounds();
	var geo_cfg = this.tower_get_geo_config();

	this.geometry.layers.middleground.doors['door_out'] = {

		x	: bounds.exit_door.x,
		y	: bounds.exit_door.y,
		w	: geo_cfg.door_deco_w,
		h	: geo_cfg.door_deco_h,
		key_id	: 0,
		requires_level: 0,
		connect	: {
			target	: this.exit.street,
			mote_id	: this.moteid,
			hub_id	: this.hubid,
			x	: this.exit.x,
			y	: this.exit.y,
		},
		deco: {
			name		: 'door_out_deco',
			sprite_class	: geo_cfg.door_deco_class,
			w		: geo_cfg.door_deco_w,
			h		: geo_cfg.door_deco_h,
		},
	};
}

function tower_set_label(label){
	this.label = label;
}

function tower_get_expand_costs(){

	var out = {};
	out.floor = {};

	// how many floors left to expand into? can we expand now?
	out.floor.count = Math.max(config.towers.MAX_FLOORS - this.cfg.floors, 0);
	out.floor.locked = !!this.cfg.is_expanding;

	// get cost of next floor project
	if (out.floor.count < 1){
		var job = {};
	}else{
		var job_class = 'job_tower_floor_'+(this.cfg.floors+1);	
		var job = apiFindQuestPrototype(job_class);
	}

	out.floor.items = {};
	out.floor.work = {};

	for (var i in job.requirements){
		var r = job.requirements[i];

		if (r.type == 'item'){
			out.floor.items[r.class_id] = r.num;
		}

		if (r.type == 'work'){
			out.floor.work[r.class_id] = r.num;
		}
	}

	return out;
}

function tower_delete(){

	//
	// does it have players?
	// try and teleport them home
	//	

	for (var i in this.players){
		this.players[i].teleportHome();
	}

	for (var i in this.players){
		return {
			ok : 0,
			error : 'contains_players',
		};
	}


	//
	// delete it!
	//

	this.web_sync_deleted();
	this.apiDelete();

	return {
		ok: 1,
	};
}

function tower_get_custom_name(){

	if (!this.owner) return null;

	var ext = this.owner.houses_get_external_street();
	if (!ext) return null;

	var towers = ext.find_items('furniture_tower_chassis');
	if (!towers.length) return null;

	return towers[0].getProp('user_name');
}

function tower_fix(pc){
	var tower = pc.getTower();
	if (tower) return;
	
	this.tower_create(pc);
	pc.home.tower = this;
	pc.home.exterior.homes_position_tower(this);
	this.tower_rebuild();

	pc.home.tower.tower_set_label(pc.label+"'s Tower");

	pc.home.exterior.upgrades_move_players('tower');
}

function tower_set_floor_name(connect_id, custom_label){

	this.tower_init();

	log.info("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", connect_id, custom_label);

	connect_id = str(connect_id);
	custom_label = str(custom_label);

	var idx = 0;

	if (connect_id != 'exit'){

		var a = connect_id.split('_');

		if (a[0] != 'fl' || a[1] != '1'){
			return {
				ok: 0,
				error: 'bad_connect_id',
			};
		}

		idx = intval(a[2]);
	}

	if (custom_label.length){
		this.cfg.floor_labels[idx] = custom_label;
	}else{
		delete this.cfg.floor_labels[idx];
	}

	var signs = this.geometry.layers.middleground.signposts;
	for (var i in signs){
		if (i.substr(0, 9) == 'elevator_'){
			if (custom_label.length){
				signs[i].connects[connect_id].custom_label = custom_label;
			}else{
				delete signs[i].connects[connect_id].custom_label;
			}
			this.geo_signpost_updated(i);
		}
	}

	return {
		ok: 1,
	};
}
