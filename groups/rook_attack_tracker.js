
// This just stores the tsid of the current rook attack so we can retrieve it from the butler etc.

function addAttack(tsid) {
	if (!this.current_attacks) { 
		this.current_attacks = [];
	}

	this.current_attacks.push(tsid);
}

function removeAttack(tsid) {
	var attacks = this.current_attacks;

	for (var i in attacks) { 
		if (attacks[i] == tsid) {
			this.current_attacks = attacks.slice(0, i).concat(attacks.slice(i+1, attacks.length));
			return;
		}
	}		
}

function getCurrentAttacks() {
	return this.current_attacks;
}

function containsAttack(tsid) {
	var attacks = this.current_attacks;
	
	for (var i in attacks) { 
		if (attacks[i] == tsid) {
			return true;
		}
	}	
	
	return false;
}