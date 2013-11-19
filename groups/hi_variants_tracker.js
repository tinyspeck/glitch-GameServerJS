// private
function init(){
	delete this.infectors; //legacy
	delete this.evasions; //legacy
	delete this.evasion_records; //legacy
	delete this.yesterdays_hi_emote_infectors_winner; //legacy
	delete this.yesterdays_hi_emote_infectors_winner_count; //legacy
	delete this.yesterdays_hi_emote_infectors_winner_variant; //legacy
	delete this.yesterdays_hi_emote_variant_winner; //legacy
	delete this.yesterdays_hi_emote_variant_winner_count; //legacy
	delete this.yesterdays_hi_emote_top_infector; //legacy
	delete this.yesterdays_hi_emote_top_infector_count; //legacy
	delete this.yesterdays_hi_emote_top_infector_variant; //legacy
	
	if (!this.counts) this.counts = {};
	
	this.daily_evasion_records_max_days = 4; // today and the previous 3 days
	
	if (!this.infectors_dc) {
		this.infectors_dc = apiNewOwnedDC(this);
		this.infectors_dc.list = {};
	}
	
	if (!this.daily_evasion_records) {
		this.daily_evasion_records = apiNewOwnedDC(this);
		this.daily_evasion_records.A = [{}];
	}
	
	if (!this.history_dc) {
		this.history_dc = apiNewOwnedDC(this);
		this.history_dc.days = {};
	}
		
	if (!this.current_game_day) this.current_game_day = current_day_key();

	this.check_for_reset();
}

// private
function check_for_reset() {
	if (this.current_game_day != current_day_key()){
		// reset!
		this.reset();
	}
}

// private
function reset() {
	var winning_count = 0;
	var winning_variant = '';
	if (this.counts) {
		for (var variant in this.counts) {
			if (this.counts[variant] > winning_count) {
				winning_count = this.counts[variant];
				winning_variant = variant;
			}
		}
	}
	
	this.yesterdays_variant_winner = winning_variant;
	this.yesterdays_variant_winner_count = winning_count;
	
	
	var top_infector_count = 0;
	var top_infector_tsid = '';
	var top_infector_variant = '';
	if (this.infectors_dc.list) {
		for (var variant in this.infectors_dc.list) {
			for (var tsid in this.infectors_dc.list[variant]) {
				if (tsid.substr(0, 1) != 'P') continue; //only players
				if (this.infectors_dc.list[variant][tsid] > top_infector_count) {
					top_infector_count = this.infectors_dc.list[variant][tsid];
					top_infector_tsid = tsid;
					top_infector_variant = variant
				}
			}
		}
	}
	
	this.yesterdays_top_infector = top_infector_tsid;
	this.yesterdays_top_infector_count = top_infector_count;
	this.yesterdays_top_infector_variant = top_infector_variant;
	
	// let's keep a history
	if (this.current_game_day) {
		this.history_dc.days[this.current_game_day] = {
			top_infector_tsid: top_infector_tsid,
			top_infector_count: top_infector_count,
			top_infector_variant: top_infector_variant,
			winning_variant: winning_variant,
			counts: this.counts
		}
	}
	
	if (config.feature_hi_viral) {
		var infector_pc = apiFindObject(this.yesterdays_top_infector);
	
		apiSendToAll({
			type: 'hi_emote_variant_winner',
			count: this.yesterdays_variant_winner_count,
			variant: this.yesterdays_variant_winner,
			top_infector_tsid: this.yesterdays_top_infector,
			top_infector_pc: (infector_pc && infector_pc.is_player) ? infector_pc.make_hash() : null,
			top_infector_count: this.yesterdays_top_infector_count,
			top_infector_variant: this.yesterdays_top_infector_variant
		});
	}
	
	if (config.feature_report_hi_records) {
		// create a new entry for today, at the front of the array
		this.daily_evasion_records.A.unshift({});
	
		// truncate the array, so we're not keeping more than daily_evasion_records_max_days in the array
		if (this.daily_evasion_records.A.length > this.daily_evasion_records_max_days) {
			this.daily_evasion_records.A.length = this.daily_evasion_records_max_days;
		}
	}
	
	this.current_game_day = current_day_key();
	this.counts = {};
	this.infectors_dc.list = {};
}

// public
function remember_pcs_daily_evasion_record(pc, location_tsid){
	if (!config.feature_report_hi_records) return;
	this.init();
	
	// this will write over the previous record holder for this location for today, which is right and proper
	
	var ob = this.daily_evasion_records.A[0]; // the first one in the array is always the current one
	if (!ob) ob = this.daily_evasion_records.A[0] = {};
	ob[location_tsid] = pc.tsid;
	

}

// public
function calculate_pcs_daily_evasion_record_achieves(pc){
	if (!config.feature_report_hi_records) return;
	this.init();
	
	var count = 0;
	var ob;
	
	for (var i=0;i<this.daily_evasion_records.A.length;i++) {
		ob = this.daily_evasion_records.A[i];
		if (!ob) continue; 
		
		for (var location_tsid in ob) {
			if (ob[location_tsid] == pc.tsid) {
				count++;
				
				apiLogAction('HI_EVASION_DAILY_RECORD_HELD', 'pc='+pc.tsid,'recordloc='+location_tsid);
				
				// delete it, we no longer need it
				delete ob[location_tsid];
			}
		}
	}
	
	if (count) {
		pc.achievements_increment('daily_evasion_record', 'held', count);
	}
}

// public
function increment_count(variant, infector_tsid){
	this.init();

	if (!this.counts[variant]) this.counts[variant] = 0;
	this.counts[variant]++;
	
	if (infector_tsid) {
		if (!this.infectors_dc.list[variant]) this.infectors_dc.list[variant] = {};
		if (!this.infectors_dc.list[variant][infector_tsid]) this.infectors_dc.list[variant][infector_tsid] = 0;
		this.infectors_dc.list[variant][infector_tsid]++;
	}
	
	return this.get_all_counts();
}

// public
function get_count(varient){
	this.init();
	return this.counts[variant] || 0;
}

// public
function get_all_counts(){
	this.init();
	var ob = {};
	for (var i=0;i<config.hi_emote_variants.length;i++) {
		ob[config.hi_emote_variants[i]] = this.counts[config.hi_emote_variants[i]] || 0;
	}
	return ob;
}

// public
function get_counts_report(){
	this.init();
	var str = 'Leaderboard:';
	var variant;
	var count;
	var sortable_counts = [];
	var i;
	
	for (i=0;i<config.hi_emote_variants.length;i++) {
		variant = config.hi_emote_variants[i];
		if (!this.counts[variant]) this.counts[variant] = 0;
		sortable_counts.push({
			variant:variant,
			count:this.counts[variant]
		});
	}
	
	sortable_counts.sort(function(a,b){ return b['count']-a['count']; });
	
	for (i=0;i<sortable_counts.length;i++) {
		variant = sortable_counts[i].variant;
		count = sortable_counts[i].count;
		str+= '<br>'+config.hi_emote_variants_name_map[variant]+': '+count;
		if (this.infectors_dc.list[variant]) {
			for (var tsid in this.infectors_dc.list[variant]) {
				str+= '<br>&nbsp;&nbsp;&nbsp;'+tsid+': '+this.infectors_dc.list[variant][tsid];
			}
		}
	}
	
	return str;
}

// public
// called from main.js login_start processing
function get_login_data(){
	return {
		leaderboard: this.get_all_counts(),
		yesterdays_winner: this.yesterdays_variant_winner,
		yesterdays_winner_count: this.yesterdays_variant_winner_count,
		yesterdays_top_infector_tsid: this.yesterdays_top_infector,
		yesterdays_top_infector_count: this.yesterdays_top_infector_count,
		yesterdays_top_infector_variant: this.yesterdays_top_infector_variant
	};
}
