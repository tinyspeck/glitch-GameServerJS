function demo_populate_pol(){
	this.removeAllItems();
	
	// create patch to be planted in
	var patch = this.createItemStack('patch', 1, 200, -73);

	// create the trant to harvest
	var trant = this.createItemStack('trant_bean', 1, 400, -73);
	trant.setInstanceProp('health', 10);
	trant.setInstanceProp('maturity', 10);
	trant.setInstanceProp('fruitCount', 20);
	trant.setInstanceProp('fruitCapacity', 20);

	// create the chicken to incubate our egg
	var chicken = this.createItemStack('npc_chicken', 1, -200, -53);

	// create our garden
	var garden = this.createItemStack('garden', 1, 600, -63);
	var grown = {
		state: 'crop',
		wet: true,
		seed: 'seed_corn',
	};
	garden.setPlotData('1-4', grown);
	garden.setPlotData('2-4', grown);
	garden.setPlotData('3-4', grown);
	garden.setPlotData('4-4', grown);
	
}