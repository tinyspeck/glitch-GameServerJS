// https://docs.google.com/document/d/1C55RswL6UMOOmVOZWoKV7WJyGWoH39kaq83R9ED4rc8/edit

function canWear(){
	return (this.getInstanceProp('cultivation_max_wear') === undefined || !this.proto_class) ? false : true;
}

function getMaxWear(){
	return intval(this.getInstanceProp('cultivation_max_wear')) * this.getMaxWearMultiplier();
}

function addMaxWearMultiplier(multiplier){
	return this.setMaxWearMultiplier(multiplier + this.getMaxWearMultiplier());
}

function setMaxWearMultiplier(multiplier){
	this.cultivation_max_wear_multiplier = multiplier;
	if (this.cultivation_max_wear_multiplier > 2.0) this.cultivation_max_wear_multiplier = 2.0;

	return this.getMaxWearMultiplier();
}

function getMaxWearMultiplier(){
	if (!this.cultivation_max_wear_multiplier) this.cultivation_max_wear_multiplier = 1.0;
	return this.cultivation_max_wear_multiplier;
}

function getWear(){
	return intval(this.getInstanceProp('cultivation_wear'));
}

function initWear(){
	this.setInstanceProp('cultivation_wear', 0);
}

function addWear(wear){
	if (wear === undefined) wear = 1;

	if (!this.canWear()) return false;
	if (this.isDepleted()) return false;

	this.setInstanceProp('cultivation_wear', intval(this.getInstanceProp('cultivation_wear'))+wear);

	if (this.isDepleted() && this.onDepleted){
		this.onDepleted();
	}

	this.broadcastConfig();

	return true;
}

function makeDepleted(){
	log.info(this+' making depleted');
	this.setInstanceProp('cultivation_wear', this.getMaxWear()+1);
	this.replaceWithDepleted();
	log.info(this+' made depleted');
}

function isDepleted(){
	if (!this.canWear()) return false;
	return this.getWear() >= this.getMaxWear();
}

function replaceWithDepleted(pc){
	if (!this.isDepleted()) return false;

	//log.info("CULT: Resource is depleted");
	if (this.onRemoved) this.onRemoved(pc);

	//log.info("CULT: Removed resource");
	apiLogAction('CULTIVATION_DEPLETED', 'class_id='+this.class_id, 'tsid='+this.tsid, 'proto_class='+this.proto_class, 'pc='+(pc ? pc.tsid : null));
	
	//log.info("CULT: Replacing item with "+this.proto_class);
	log.info(this+' Replacing item with '+this.proto_class);
	var s = this.replaceWithPoofIfOnGround(this.proto_class);
	if (s){
		s.setMaxWearMultiplier(this.getMaxWearMultiplier());
		if (this.wotd) s.wotd = true;
		if (this.restorer) s.restorer = this.restorer;
	}
	return s;
}

function removeResource(pc){
	apiLogAction('CULTIVATION_REMOVED', 'pc='+pc.tsid, 'class_id='+this.class_id, 'tsid='+this.tsid, 'proto_class='+this.proto_class);

	if (this.onRemoved) this.onRemoved(pc);

	this.apiDelete();
}

function buildConfig(ret){
	if (!this.canWear()) return ret;

	ret.lifespan = {
		proto_item_tsid: this.proto_class,
		percentage_left: (this.getWear() >= this.getMaxWear()) ? 0 : (1.0 - floatval(this.getWear() / this.getMaxWear()))
	};

	return ret;
}