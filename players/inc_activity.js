//
// send an activity event to the webapp.
// it will deal with fanout itself
//

function activity_notify(args){

	args.to_tsid = this.tsid;

	utils.http_get('callbacks/activity_push.php', args);
}
