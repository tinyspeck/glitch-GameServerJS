//#include group.js

//
// An organization is like a group, but different. Most of the logic is handled in group.js.
// Only organization-specific code is here. For the most part, we just branch elsewhere based on class_tsid
//

log.info("loading organization.js");

// Called by doCreate in group.js
function organization_create(){
	this.level = 1;
	this.balance = 0;

	utils.http_post('callbacks/organizations_create.php', {

		'tsid'		: this.tsid,
		'created'	: this.created,
		'creator'	: this.creator,
		'name'		: this.label

	}, this.tsid);
}

function getMaxMembers(){
	switch (this.level){
		case 1:
			return 11;
		case 2:
			return 25;
		case 3:
			return 80;
		default:
			return 0;
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////

function get_balance(){
	if (!this.balance) return 0;

	return this.balance;
}

function add_balance(currants){
	if (!this.balance) this.balance = 0;

	this.balance += currants;

	return currants;
}

function subtract_balance(currants){
	if (!this.balance) return 0;

	var balance = this.balance;
	this.balance -= currants;
	if (this.balance < 0) this.balance = 0;

	return this.balance - balance;
}

function make_deposit(pc, currants){
	if (pc.stats_try_remove_currants(currants, {type: 'group_deposit', group: this.tsid})){
		var actual = this.add_balance(currants);

		// TODO: Put this in the db
		if (!this.transaction_history){
			this.transaction_history = apiNewOwnedDC(this);
			this.transaction_history.label = 'Transaction History';
			this.transaction_history.transaction_history = apiNewOrderedHash;
		}

		this.transaction_history.transaction_history[str(time()+'-'+pc.tsid)] = {
			who: pc.tsid,
			when: time(),
			amount: amount,
			type: 'deposit'
		};

		return true;
	}

	return false;
}

function make_withdrawal(pc, currants){
	var actual = this.subtract_balance(currants);
	if (actual){
		// TODO: Put this in the db
		if (!this.transaction_history){
			this.transaction_history = apiNewOwnedDC(this);
			this.transaction_history.label = 'Transaction History';
			this.transaction_history.transaction_history = apiNewOrderedHash;
		}

		this.transaction_history.transaction_history[str(time()+'-'+pc.tsid)] = {
			who: pc.tsid,
			when: time(),
			amount: amount,
			type: 'withdrawal'
		};

		pc.stats_add_currants(actual, {type: 'group_withdrawal', group: this.tsid});

		return true;
	}
}

function rename(name){
	this.label = name;

	utils.http_post('callbacks/organizations_update.php', {

		'tsid'		: this.tsid,
		'name'		: this.label

	}, this.tsid);

	this.has_been_renamed = true;
}