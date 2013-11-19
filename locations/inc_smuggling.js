function smuggling_is_destination(pc){
	var contrabands = pc.get_stacks_by_class('contraband');

	if (contrabands){
		for (var i in contrabands){
			if (contrabands[i].destination == this.tsid){
				return true;
			}
		}
	}

	return false;
}

function smuggling_spawn_receiver(pc){
	// find a spot to stand in

	if(is_chance(0.5)) {
		var offset = randInt(250, 2000);
		
		if(pc.x + offset > pc.location.geo.r) {
			offset = 0 - randInt(250,2000);
		}
	} else {
		var offset = 0 - randInt(250,2000);

		if(pc.x + offset < pc.location.geo.l) {
			offset = randInt(250, 2000);
		}
	}

	var point = pc.location.apiGetPointOnTheClosestPlatformLineBelow(pc.x + offset, pc.y - 75);
	if (!point){
		point = pc.location.apiGetPointOnTheClosestPlatformLineAbove(pc.x + offset, pc.y);
	}
	if(!point) {
		point = pc.location.apiGetPointOnTheClosestPlatformLineAbove(pc.x, pc.y);
	}
	if (!point) {
		point = {x: pc.x, y: pc.y};
	}

	var smuggler = this.createItemStack('npc_smuggler', 1, point.x, point.y);

	smuggler.setTask('receive', pc);
}

function smuggling_spawn_deimaginator(pc){

	// for about 10% of streets, don't spawn... because what you can't see is often scarier than what you can... ;)
	if (is_chance(0.1)){
		return;
	}


	// find a spot to stand in

	if(is_chance(0.5)) {
		var offset = randInt(250, 1000);
		
		if(pc.x + offset > pc.location.geo.r) {
			offset = 0 - randInt(250,1000);
		}
	} else {
		var offset = 0 - randInt(250,1000);

		if(pc.x + offset < pc.location.geo.l) {
			offset = randInt(250, 1000);
		}
	}

	var point = pc.location.apiGetPointOnTheClosestPlatformLineBelow(pc.x + offset, pc.y - 75);
	if (!point){
		point = pc.location.apiGetPointOnTheClosestPlatformLineAbove(pc.x + offset, pc.y);
	}
	if(!point) {
		// Nowhere to go!
		return;
	}

	var deimaginator = this.createItemStack('npc_deimaginator', 1, point.x, point.y);

	deimaginator.setTarget(pc);
}