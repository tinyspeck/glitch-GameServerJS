//
// An organization is like a group, but different.
// inc_groups.js can do much of what we do here -- we only define/use functions here where we want different behavior
//

function organizations_init(){

	if (this.organizations === undefined || this.organizations === null){
		this.organizations = apiNewOwnedDC(this);
		this.organizations.label = 'Organizations';
		this.organizations.organizations = {};
	}
}

function organizations_delete_all(){

	// TODO: clean up!
	if (this.organizations){
		this.organizations.apiDelete();
		delete this.organizations;
	}
}


//
// create a new group
//

function organizations_create(name, desc){

	var organization = apiNewGroup('organization');

	organization.doCreate(name, desc, 'public_apply', this); // Invite/apply

	this.organizations.organizations[organization.tsid] = organization;

	return organization;
}


//
// delete a group
//

function organizations_delete(tsid){
	if (!tsid) return null;

	var organization = apiFindObject(tsid);

	if (!organization) return null;

	organization.doDelete(this);

	return 1;
}


//
// log us out of chat when we log out of the game
//

function organizations_logout(){

	if (this.organizations){
		for (var i in this.organizations.organizations){

			this.organizations.organizations[i].chat_logout(this);
		}
	}
}

//
// join an org
//

function organizations_join(tsid){

	var org = apiFindObject(tsid);

	if (!org) return null;

	var ret = org.join(this);
	if (!ret['ok']) return ret;

	if (!this.organizations) this.init();
	this.organizations.organizations[org.tsid] = org;

	var info = org.get_basic_info();

	if (info.mode != 'private'){
		this.activity_notify({
			type	: 'group_join',
			group	: group.tsid
		});
	}


	//
	// if they're online, send info
	//


	info.type = 'organizations_join';
	info.tsid = org.tsid;

	this.sendMsgOnline(info);

	utils.http_get('callbacks/organizations_joined.php', {
		organization_tsid: org.tsid,
		pc_tsid: this.tsid,
	});

	return ret;
}


//
// remove this pc from the passed org.
// this function just removes pointers - it doesn't deal with auto-promotion, deletion, etc
//

function organizations_left(organization){

	//
	// remove pointer from pc->organization
	//

	if (this.organizations && this.organizations.organizations){

		delete this.organizations.organizations[organization.tsid];
	}


	//
	// if we're online, point out we left the organization
	//

	this.sendMsgOnline({
		type: 'organizations_leave',
		tsid: organization.tsid,
	});

	utils.http_get('callbacks/organizations_left.php', {
		organization_tsid: organization.tsid,
		pc_tsid: this.tsid,
	});
}

//
// Do we have an organization?
//

function organizations_has(){
	this.organizations_init();
	return num_keys(this.organizations.organizations) ? true : false;
}

//
// Return our organization. This only works if everyone only has one, which is true for now
//

function organizations_get(){
	this.organizations_init();

	for (var i in this.organizations.organizations){
		return this.organizations.organizations[i];
	}
}