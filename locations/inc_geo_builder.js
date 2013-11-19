

//
// merge all floors & layers into a single list of decos, walls and plats
//

function geo_builder_merge_groups(groups, layers){

	var all = {
		'decos' : [],
		'walls' : [],
		'plats' : [],
	};

	if (!layers){
		layers = utils.array_keys(groups[0].decos);
	}

	for (var i=0; i<layers.length; i++){
		var layer = layers[i];
		for (var j=0; j<groups.length; j++){
			for (var k=0; k<groups[j].decos[layer].length; k++){
				all.decos.push(groups[j].decos[layer][k]);
			}
		}
	}
	for (var j=0; j<groups.length; j++){
		for (var k=0; k<groups[j].walls.length; k++){
			all.walls.push(groups[j].walls[k]);
		}
		for (var k=0; k<groups[j].plats.length; k++){
			all.plats.push(groups[j].plats[k]);
		}
	}

	return all;
}



function geo_builder_insert(all, geo, name_prefix){

	var bit_idx = 0;
	if (!name_prefix) name_prefix = 'geo_builder_';


	//
	// insert decos
	//

	var decos = geo.layers.middleground.decos;
	var max_z = 0;
	for (var i in decos){
		max_z = decos[i].z > max_z ? decos[i].z : max_z;
	}
	max_z++;

	for (var i=0; i<all.decos.length; i++){
		var deco = all.decos[i];		
		deco.z = max_z++;
		deco.layer = 'middleground';
		
		// is_home makes the client render the deco in standalone mode, rather than
		// baking it into the bitmap. used whenever decos can change dynamically
		deco.is_home = true;
		
		if (!deco.name) deco.name = name_prefix + (bit_idx++);
		this.geo_builder_add_deco(geo, deco);
	}


	//
	// inserts walls
	//

	for (var i=0; i<all.walls.length; i++){
		var wall = all.walls[i];
		if (!wall.name) wall.name = name_prefix + (bit_idx++);
		this.geo_builder_add_wall(geo, wall);
	}


	//
	// insert plats
	//

	for (var i=0; i<all.plats.length; i++){
		var plat = all.plats[i];
		if (!plat.name) plat.name = name_prefix + (bit_idx++);
		this.geo_builder_add_plat(geo, plat);
	}
}

function geo_builder_add_deco(geo, args){

	var layer = args.layer ? args.layer : 'middleground';
	delete args.layer;

	args.x += args.w / 2;

	geo.layers[layer].decos[args.name] = args;
}

function geo_builder_add_wall(geo, args){

	var name = args.name;
	delete args.name;

	args.w = 0;
	args.y -= args.h;

	geo.layers.middleground.walls[name] = args;
}

function geo_builder_add_plat(geo, plat){

	var name = plat.name;

	geo.layers.middleground.platform_lines[name] = plat;
}

function geo_builder_room_plats(plats, start_x, end_x, y_offset){

	plats.push({
		'platform_item_perm'		: 0,
		'platform_pc_perm'		: 0,
		'start'				: {'x': start_x+10, 'y': 0 - (438 + y_offset)},
		'end'				: {'x': end_x-10,   'y': 0 - (438 + y_offset)},
		'placement_userdeco_set'	: 'ceiling',
		'placement_plane_height'	: 0,
		'is_for_placement'		: true,
	});

	plats.push({
		'platform_item_perm'		: 0,
		'platform_pc_perm'		: 0,
		'start'				: {'x': start_x+10, 'y': 0 - (118 + y_offset)},
		'end'				: {'x': end_x-10,   'y': 0 - (118 + y_offset)},
		'placement_userdeco_set'	: 'wall',
		'placement_plane_height'	: 280,
		'is_for_placement'		: true,
	});

	plats.push({
		'platform_item_perm'		: 0,
		'platform_pc_perm'		: 0,
		'start'				: {'x': start_x, 'y': 0 - (108 + y_offset)},
		'end'				: {'x': end_x,   'y': 0 - (108 + y_offset)},
		'placement_userdeco_set'	: 'bookshelf',
		'placement_plane_height'	: 0,
		'is_for_placement'		: true,
	//	'name'				: 'home_interior_floor_'+floor_idx,
	});

	plats.push({
		'platform_item_perm'		: 0,
		'platform_pc_perm'		: 0,
		'start'				: {'x': start_x-10, 'y': 0 - (73 + y_offset)},
		'end'				: {'x': end_x+10,   'y': 0 - (73 + y_offset)},
		'placement_userdeco_set'	: 'chair',
		'placement_plane_height'	: 0,
		'is_for_placement'		: true,
	});

	plats.push({
		'platform_item_perm'		: 0,
		'platform_pc_perm'		: 0,
		'start'				: {'x': start_x-42, 'y': 0 - (43 + y_offset)},
		'end'				: {'x': end_x+42,   'y': 0 - (43 + y_offset)},
		'placement_userdeco_set'	: 'rug',
		'placement_plane_height'	: 0,
		'is_for_placement'		: true,
	});

	plats.push({
		'platform_item_perm'		: 0,
		'platform_pc_perm'		: 0,
		'start'				: {'x': start_x-20, 'y': 0 - (23 + y_offset)},
		'end'				: {'x': end_x+20,   'y': 0 - (23 + y_offset)},
		'placement_userdeco_set'	: 'front',
		'placement_plane_height'	: 0,
		'is_for_placement'		: true,
	});

}
