var label = "Teleportation Point";
var version = "1324607691";
var name_single = "Teleportation Point";
var name_plural = "Teleportation Points";
var article = "a";
var description = "To use teleportation, click on your familiar (or press F).";
var is_hidden = false;
var has_info = true;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 0;
var input_for = [];
var parent_classes = ["quest_req_icon_teleport"];
var has_instance_props = false;

var classProps = {
};

var instancePropsDef = {};

var verbs = {};

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-19,"y":-39,"w":38,"h":39},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAMmklEQVR42s1ZWVca2xLOP7g\/4bzf\nl\/MT8hPuy33P253OkDkxJyaYROMYARWHaDCOQVSUmDhFg3EmziJOKOAAKDPdND3QULeqAY\/JyVp3\naR7OZa1vNd2w9\/76q6pd1dVXrpz7VFQU\/lD2\/NHVksKHfyt6lqcqeHxP9Tj\/jir\/t1sKfsu7oXpw\n\/4Y67\/51S95dwi+W+3cyoO\/KNfztQd4Ny0NE\/oOblvyHty2q\/DuWAtW9PpqzuChfVV78WPWivECl\nfVGk0mmLVQ01Fdf0Lyuvtr2q+vHK158qTXGzuvzpSnlpAZQ8fwRFz36DpwV5oHp0Fx49vA0PH9wE\nJAV5936Fe3d+gbu3f4Y7t36C2zf\/o+DWjX8ryJ3Tb\/Qf+i+NobE0B81Fc9LctAatRWuqK55BtaYY\n6mrKoalBDa9fVUN7S52rq7Opb6C37ccrmhfPmivKnkDp88dn5FA1QMXgt7ybuMh1uH83Q+w8oZvX\n\/\/VNnCdMY2gszUFz0Zw0d44krUlra14UQo22BBpqK+DVSw20NuvgTVu9S1GwsvLJ1fKSAkDpoVxb\nClp9PTx59hB6bOtQY+jABX79Jrkbv\/5TwfVf\/qEgd\/5tkjklbylKPlHdg8KnDzJrlvyuYr0uo2KL\nvgY62xuunZm52dzj6pqfBU19FThSoNzli5c6eN3SdGZaMt3X6uVInSd3niCNyZka\/fdMwSeq+1D0\n9I9mJoKk4Gt9dcRobPjLGUF1+TNVlU4NxYX58BzVKy1+rNxdJQ7UVBZCpboYymo0CDWUVleCuqEG\ntI210PSm7QyvvoaB0A5N+lrQVZWAVl0EVernUK0txvNS9LkyJFSBpi2G2uoyBS\/rXkBzUxW0vtY1\nfxEoTU0VP5BzNrzSQXlrC6j7zdA4vwTtW07Q73jg1fYRtB+EwOCJgRHRjehBmHwxMPsYMJ8wMIB4\nlz2+JeD1Pvy914vI\/p\/GdiE6do+gZXUTOjYc0La+DXrrMjT1GqHttQ46Wuugvb3phz9EM0mqHxy8\nUzG3biu3WE+rZ1cCa\/5wauUkAJWWOdDMLCvQImrmVqBqahEa13ageR0Xse9Bx6YTOrcyoO+t9n14\nbXOAHlH3eV2BDjF84AUXy0HVpBVqphegem71tHpu7bR+dNzU3lJ77ZvkzvbBDd9fK3dODYTNuHQY\nllJsUJIZOyce0DXt7qmhdi9gaNgPGvSuoKHTEzV1e6MDvSexwbd+ZhiVHKFj3wkzhNffGTzRPr0r\n1EX\/p3Ha3YBhJszZD3npNLdODuot\/9+v\/K\/PeYI2VnT7hFTYK8jh2WjCVo0L1O8HDE1IrO0w3NXj\njfYPnLCDw8H4h7Ew\/\/FThP80EeEnLXgcDycso8H4GJp8uNcbfdtxGO2mcQ04nub5mtylCKp3\/F2D\np+y8yctMVCuqBQxbCcm9zyePe32x\/uEAOzwe4j5OR\/mpeYafs8b4zwsMv4D4jOfz0ww\/PYFERwLc\naP8JM9BxHDbqXWFFfR2pifMTLk0whxy5165wl0+Ug4ycTnwM8eOfwpxlnhFmFllhYZUTV21cct2W\nSNpsnGRb5aS1JVZYsjLi3FSU\/\/QBSZp9MXP7YdjQ7A4bujzR95ucdLARFw9Q2YFLEySfI7PSndPk\nn6L8pD0ubU5GuY8LjDC7xklLm0hqW0hu7wpJx54o7+3wyb1tPrmzmZDs+PvKIiPMz0aFibEgN2Ty\nMb1vjsPdTl72nAhyxCemwpuceKx1+LsuTFCzkwkI8p1WJGc8ihjQ5P2fwonRz6wwvc5KS3Y+ueFA\nYk4xdXAgysduMe1xiymPU5QP8fo+Et9cJ5KsOItKjqNbvBs4ZQcOBfk0Lqf5WDKVQJfx1ewHei5M\nsHo3E60taJI3SM7sY42WMPfeyggTq3Hx8zYqty+mHG5RPjoS06ceKR3yyOmwJ5kOHUop\/wES3ZfS\n+6imHUku4U1Nok8Ov\/Oxpj1eOvYKyZAXXWYzLh5pdi9h4px6ZFrcmA1DftY0HeFGVzhpGs234hDk\nHRcqdYRkvMlU7CSZ5k5l4BEJXzLN4LWgQhJvAt1gfZWV5mZRxZEga8ag6bPHxf1lRthucAaMF\/ZB\nuiMKDHJo43G024QEx4Pxt9aYML4WF627vGxziSnnkZQ+IXKncloMpEEOZuFPgXQip9ljKRVwS6kD\nh5giUy8usMIEusj7fpyPrELz0zraiyqomBfVa0H1ZkLc1IAv1kXmXcYFNnAhDIYt9LkjbxJCpBqR\niiJi2WOYSMppJAnRQzHldUryLqq4sswJ01MRMnPMSD5N8zfiOrRTXIwgDmjMBgeZd9Af654KJ4ZW\n4sLUFi7kwgXRtF5UKRbIkmLTkOIQcUQsqySZHVX0k9o7vLyO6s\/OxPhRnK+H5m3PEtRdlKDunP9h\nojcM+9me2ZgwvJqQpjE41lCRfQyKUyIQQiIMkkogxDSkeQSRjWRMLaA\/Bt2S7EaCG2txaX4uxo+N\n+tne3ixBWqf2ogRrvyJIE87GEiOrcWkG97l1l5RykjLoe3wkq56AxGSEhCAlo1lfxBsJH0i47Yiy\nfR39l\/x4BAMuR1B\/GYLfUPALgqiIy4MBQP5HBONZ9dJpgPMEAzIkvTKE3USQzxCcUwgypu9S8I8+\nyPagD46sssIM7mtrbtzfSEH0wUQ4a2I+qx4pGf\/dxKIX90eK5F3cD9dYwYquMkYEv8sHz0cxRdu7\nE7Z7MswNL7PilD0hrjqllAODxOdLYjmWjV4u64dcJkhS5Ju0J9JWgz7rQuVtmH3mjiQ5MOqPv\/2u\nKNbkcjBlkcOIoc8TM44HuUHcxz6h00ePk6nAIaY2zBoRJCGGMpGcYrLkSL1ACmTcIxnMKj7K0XYM\nriXMy2wKEstY+XzXPvh1oBg9EcNogB2YiSUsQVQNVfFhvnVTSkPCLJEJZfe\/UJYcmf+YzIv75Y4g\nb1O6w5JscizIDuFjwBcBcqlqJpOLM9mEVHyPhcJkhPuwwIizuFmvUZFAhQGRQKXilE1wc07iUfIR\nOVQXU50Ps4hzIyFuLLGiFWvHj1hwvMVyqwsLCDtV6jpnqOvS5VbdXqCLSvbWTDT3jAW4oRksuZYZ\ncREzg30XF3cKshfNHURzRzGyGVQ3dpRR7mRPTB5s8cltjP6VOUaYxgJ3lObBrDTrw0o9IMkxKhYu\nRbBuL2ii55KdhHRk9ETfkUnwiW3gY4gbn4vysyu4KJLc2hVk576QxFJL9qGip1hynbiElAcVdm9i\nXYjF7PpnRrBSdf3Ozwx2HGFdGeEXqB4MSzK7FZcuTpDKfXwmOfRLqWgIVXEkpGOlEvZGewcD7BA+\nd0wgSSuabXWDT25uCSnHjpB0Idx03OblPRsvba+wSC4mLExG+CmshkbRl00UeC+dgS4sfN0kQLXD\n330pgjTYL8qxkCizu0iwMVtZ49OaGffF0Y8RbnI6wlvRJ1eW46INg2ATK+gtOmJRsYEV9yoGxTLm\nbT+mSIcJn\/IyzyTffnC6sInrXSET+QeV5Fi49uWe6poPQsZuLzOA5hodDyY+oblmZ9BkmCEwSoXl\neQQWBIsYEHNY8QSjVCeiJfp8zGj99z7VNY2NXatc3R8vXdhV8GJ+Y7lsetVWPLlsK0GUzyzbKmfX\nbDrrmqvRuho07OBdOI\/Cb93HkfcHnujQgS86iHjv9kTNruOII86LEUmWjzlBbLfv7WsXNmyVnzds\nms+bNs3Cpq1qccumWXOOa9bc4zXTi487O19e\/Sax1tbaq9RyqG+uh9JeM6gn5qDO7oaG7SMFjQ4f\ntHhi0IpoQ3R6Gej2MdB\/ysK7AAdDIQ5GwhyMhhPKcQTPB4MEFrA8A6ykoQPHtWdBczTv+6DjwA8d\nh35odRyB\/v0AtOirobOtHoxfE9VWPrtWWf4UqtRFUK15DrXVpZl+3Ust1OgboKq5EXQmE9SZzVCP\n0A8NwuvhYeiemQGTdR76FxZgYGkRsQRv8WheXMDrVhhZmIeesWFoNXWB3tgJ3Wajgtb2Jmisr1Sa\nldRu0zdqlaYRnVN\/5k1Hg+oLgi2D5pVRpwvKyguhz26HkhfFSo+wtKpCaZtRAzLXXT3fJzyP2zd\/\ngtu3ssj2BTOtt+tnrTfqDRY8vgeFTx4onbSyYhWQMNrKIkWUc90t1xd96Vz7t0JbBqaPH5Qentnh\nAMvUxJ\/SH6QGZkdL\/d8yHdbyp+pch5W6ntT9zPSmbyld0T+rw9rRVm9RCGZ61AWR\/7sedXu95Ysu\na+4VBA68\/rTgvppeHdArBHqdkHf\/hvKa4e6dny13b\/20crku\/60IzfmkIM9S+OyBpaQo31JRUmBB\n9Sz0pqFOV6761quI\/wLOAD3xeFY0CAAAAABJRU5ErkJggg==",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "http:\/\/c2.glitch.bz\/items\/2011-12\/quest_req_icon_teleport-1324494682.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: false,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: true,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 0;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"no_trade"
];
itemDef.keys_in_location = {};
itemDef.keys_in_pack = {};

log.info("quest_req_icon_teleport.js LOADED");

// generated ok 2011-12-22 18:34:51 by martlume
