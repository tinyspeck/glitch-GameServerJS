function getTestTower(){

	// we must already have a house for this to work
	if (!this.home || !this.home.exterior) return null;

	if (this.tower_tsid){

		var tower = apiFindObject(this.tower_tsid);
		delete this.tower_tsid;
		this.home.tower = tower;
		this.home.exterior.homes_position_tower(tower, 48, -97);
	}

	if (!this.home.tower){

		var tower = apiNewLocation("Test Tower", config.is_prod ? '15' : '28', 'POL_'+this.tsid, 'tower');
		tower.tower_create(this);
		this.home.tower = tower;
		this.home.exterior.homes_position_tower(tower, 48, -97);
	}

	this.home.tower.tower_set_label(this.label+"'s Tower");

	return this.home.tower;
}

function getTower(){
	if (!this.home || !this.home.exterior) return null;
	
	return this.home.tower;
}

function visitTower(){
	var tower = this.getTestTower();
	tower.tower_rebuild();
	var pos = tower.tower_get_teleport_point();
	this.teleportToLocationDelayed(tower.tsid, pos[0], pos[1]);
}

function rebuildTower(){
	var tower = this.getTestTower();
	if (this.location.tsid == tower.tsid) tower.tower_rebuild();
}

function setTowerFloors(num){
	var tower = this.getTestTower();
	if (this.location.tsid == tower.tsid) tower.tower_set_floors(num);
}

function resetTower(){
	var tower = this.getTestTower();
	if (this.location.tsid == tower.tsid) tower.tower_reset();
}

function removeTower(){
	if (!this.home) return;

	if (this.home.exterior){
		var chassis = this.home.exterior.homes_get_tower_chassis();
		if (chassis){
			for (var i in this.home.exterior.geometry.layers.middleground.doors){
				var d = this.home.exterior.geometry.layers.middleground.doors[i];
				if (d.itemstack_tsid == chassis.tsid){
					delete this.home.exterior.geometry.layers.middleground.doors[i];
					this.home.exterior.apiGeometryUpdated();
					break;
				}
			}

			chassis.apiDelete();
			this.home.exterior.upgrades_move_players('misc');
		}
	}

	if (this.home.tower) this.home.tower.tower_delete();

	delete this.home.tower;
	delete this.tower_tsid;
}
