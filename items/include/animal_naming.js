var is_nameable = true;

function canName(pc){
	if (pc.is_god) return true; // Admins always can

	if (!this.has_parent('npc_cubimal_base') && !pc.skills_has('animalkinship_5')) return false; // Must have AK5

	if (!this.container) return false;

	var container_type = this.getContainerType();
	if (container_type == 'street' && (this.container.pols_is_owner(pc) || this.container.acl_keys_player_has_key(pc))) return true; // Owners of this POL always can; so can keyholders

	if ((container_type != 'street' || !this.container.pols_is_pol()) && !this.user_name) return true; // No name yet

	if ((container_type != 'street' || !this.container.pols_is_pol()) && pc.tsid == this.pc_namer) return true; // We're the one who named them

	if (!this.named_on || ((container_type != 'street' || !this.container.pols_is_pol()) && time() - this.named_on > 3600)) return true; // Been longer than an hour since they were named

	return false;
}

function getLabel(){
	if (this.user_name){
		return 'A '+this.name_single+' Named '+this.user_name;
	}

	return this.label;
}

function getName(){
	if (this.user_name){
		return this.user_name;
	}

	return null;
}

function onInputBoxResponse(pc, uid, value){
	if (!this.canName(pc)) return false;

	value = value.substr(0, 32).replace(/[^a-z0-9 ]/gi,'');

	if (uid == 'name' && value && value != this.user_name){
		var previous_name = this.user_name;
		this.user_name = value;
		this.pc_namer = pc.tsid;
		this.named_on = time();

		this.sendBubble('And they shall call me "'+value+'"', 5000);

		if (this.class_tsid == 'npc_butterfly') pc.quests_inc_counter('butterflies_named', 1);
		if (this.class_tsid == 'npc_piggy') pc.quests_inc_counter('piggies_named', 1);
		if (this.class_tsid == 'npc_chicken') pc.quests_inc_counter('chickens_named', 1);
		pc.achievements_increment('animals_named', this.class_tsid, 1);

		if (!pc.animals_named) pc.animals_named = [];
		pc.animals_named.unshift({
			class_id: this.class_tsid,
			tsid: this.tsid,
			from: previous_name,
			to: value,
			on: this.named_on
		});
		if (pc.animals_named.length > 50){
			pc.animals_named.splice(50, pc.animals_named.length-50);
		}

		utils.http_get('callbacks/animal_rename.php', {
			'when'		: this.named_on,
			'player'	: pc.tsid,
			'item'		: this.tsid,
			'class'		: this.class_tsid,
			'from'		: str(previous_name),
			'to'		: value,
		});

		return true;
	}

	return false;
}

function clearName(){
	delete this.user_name;
}

function clearNameIf(match){
	if (this.user_name == match){
		delete this.user_name;
	}
}

function getNameInfo(){

	return {
		user_name	: this.user_name,
		class_tsid	: this.class_tsid,
		pc_namer	: this.pc_namer,
		named_on	: this.named_on,
		location	: this.container.tsid,
	};
}
