function geo_textures_rebuild_ceilings(ceiling_config, preview){

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
			var deco_hash = this.geo_textures_fetch_hash(deco_key, config.homes_ceiling_configs);

			var idx = deco.ceiling_idx;
			var new_deco = this.geo_textures_get_ceiling_texture(idx, deco_hash);

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

function geo_textures_rebuild_floors(floor_cfg, preview){

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
			var deco_hash = this.geo_textures_fetch_hash(deco_key, config.homes_floor_configs);

			var idx = deco.floor_idx;
			var new_deco = this.geo_textures_get_floor_texture(idx, deco_hash);

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



function geo_textures_get_ceiling_texture(idx, deco_hash){
	return this.geo_textures_get_simple_texture(idx, deco_hash);
}

function geo_textures_get_floor_texture(idx, deco_hash){
	if (idx == 0) return deco_hash.left;
	return this.geo_textures_get_simple_texture(idx, deco_hash);
}

function geo_textures_get_simple_texture(idx, deco_hash){

	var num_pieces = 1;
	if (num_pieces == 1 && deco_hash.main_2) num_pieces = 2;
	if (num_pieces == 2 && deco_hash.main_3) num_pieces = 3;
	if (num_pieces == 3 && deco_hash.main_4) num_pieces = 4;
	if (num_pieces == 4 && deco_hash.main_5) num_pieces = 5;
	if (num_pieces == 5 && deco_hash.main_6) num_pieces = 6;

	var use_idx = (idx % num_pieces) + 1;

	return use_idx == 1 ? deco_hash.main : deco_hash['main_'+use_idx];
}

function geo_textures_fetch_hash(key, hash){
	if (hash[key]) return hash[key];
	for (var i in hash) return hash[i];
	return {};
}

//
// this function gets passed a list of wallpaper textures and figures
// out which asset to use for each position, bearing in mind wallpaper
// grouping and repeating-pattern wallpapers.
//

function geo_textures_get_room_textures(room_cfg){

	var out = [];

	for (var i=0; i<room_cfg.length; i++){

		var this_wp = room_cfg[i];
		var prev_wp = i == 0 ? null : room_cfg[i-1];
		var next_wp = i == room_cfg.length-1 ? null : room_cfg[i+1];

		var more_left  = !!(this_wp == prev_wp);
		var more_right = !!(this_wp == next_wp);

		var wallpaper_segment = 'wall';
		if ( more_left && !more_right) wallpaper_segment = 'wall_right';
		if (!more_left &&  more_right) wallpaper_segment = 'wall_left';
		if (!more_left && !more_right) wallpaper_segment = 'wall_single';

		// if we know we don't have this seg, reduce it. this means that we'll use
		// 'wall' instead of 'wall_right' when they have the same value. this is useful
		// for the random-sections stuff below (else end pieces will always use plain
		// 'wall' piece).

		var hash = this.geo_textures_fetch_hash(this_wp, config.homes_wallpaper_configs);
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

				var this_seg = (i % num_segs) + 1;
				if (this_seg > 1){

					wallpaper_segment = 'wall_' + this_seg;
				}
			}
		}

		out.push(hash[wallpaper_segment]);
	}

	return out;
}
