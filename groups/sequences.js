// Provides functions for generating global sequences

function getSequence(key){
	if (!this.sequences) this.sequences = {};
	if (!this.sequences[key]){
		this.sequences[key] = this.apiNewProperty(key, 0);
		this.sequences[key].apiSetLimits(0, 1000000);
	}

	this.sequences[key].apiInc(1);

	return this.sequences[key].value;
}

function resetSequence(key){
	if (!this.sequences) return;
	if (!this.sequences[key]) return;

	this.sequences[key] = this.apiNewProperty(key, 0);
	this.sequences[key].apiSetLimits(0, 1000000);
}

function getCurrentSequence(key){
	if (!this.sequences) return 0;
	if (!this.sequences[key]) return 0;

	return this.sequences[key].value;
}