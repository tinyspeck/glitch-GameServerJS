//
// this library contains quarters related functions for streets which are not
// themselves quarter instances - this includes quarter templates.
//

//

//
// return information about the pol markers on this street
//

function quarters_get_template_pols(){

	var out = {};

	for (var i in this.items){

		if (this.items[i].class_tsid == 'lot_marker'){

			out[i] = this.items[i].get_pol_info();
		}
	}

	return out;
}


//
// return a summary of markers and POLs in this quarter street instance
//

function quarters_get_pols(){

	var out = {};

	// find the doors
	if (this.geo && this.geo.doors){
		for (var i in this.geo.doors){
			var door = this.geo.doors[i];
			if (door.connect && door.connect.target){
				var info = door.connect.target.pols_get_status();

				if (info.is_pol){

					out[door.connect.target.tsid] = {
						x: door.x,
						y: door.y,
						chassis: info.door_uid,
						owned: info.owner ? true : false,
						owner: info.owner,
						num: intval(info.house_number),
					};
				}
			}
		}
	}

	return out;
}
