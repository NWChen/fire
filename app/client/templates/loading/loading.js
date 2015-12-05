/*****************************************************************************/
/* Loading: Functions
/*****************************************************************************/

function getYouTubeID(url) {
	var rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
	try {
		var match = url.match(rx)[1];
		Session.setPersistent("YouTubeId", match);
		return match;
	} catch(err) {
		Session.setPersistent("YouTubeId", "");
		return "";
	}
}

function getSoundCloudId(url) {
	if(url.indexOf("soundcloud.com") > -1) {
		var trackId;
		Meteor.http.call("GET", "https://api.soundcloud.com/resolve.json?url="
		+ Session.get("url") + "&client_id=" + Meteor.settings.public.SOUNDCLOUD_CLIENT_ID,
 		function (error, response) {
    	trackId = JSON.parse(response.content).id;
    	Session.setPersistent("SoundCloudId", trackId);
    });
		return Session.get("SoundCloudId");
	} else {
		Session.setPersistent("SoundCloudId", "");
		return "";
	}
}

/*****************************************************************************/
/* Loading: Event Handlers */
/*****************************************************************************/
Template.Loading.events({
});

/*****************************************************************************/
/* Loading: Helpers */
/*****************************************************************************/
Template.Loading.helpers({

});

/*****************************************************************************/
/* Loading: Lifecycle Hooks */
/*****************************************************************************/
Template.Loading.onCreated(function () {
	
	// YouTube Data API call
	var id = getYouTubeID(Session.get("url"));
	if(id != "") {
		Session.setPersistent("YouTubeId", id);
		var requestUrl = "https://www.googleapis.com/youtube/v3/videos?id="
    	+ id + "&key=" + Meteor.settings.public.YOUTUBE_API_KEY + "&part=statistics";
		HTTP.call('GET', requestUrl, {}, function(error, response) {
			data = JSON.parse(response.content).items[0].statistics;
			var sum = parseInt(data.viewCount) + parseInt(data.likeCount) - parseInt(data.dislikeCount) + parseInt(data.favoriteCount) + parseInt(data.commentCount);
			Session.setPersistent("heat", normalize(sum, 0, 99999, 0, 10));
		});
	}

	// SoundCloud Data API Call
	var id = getSoundCloudId(Session.get("url"));
	if(id != "") {
		var requestUrl = "http://api.soundcloud.com/tracks/" + id + "?client_id=" + Meteor.settings.public.SOUNDCLOUD_CLIENT_ID;
		HTTP.call('GET', requestUrl, {}, function(error, response) {
			data = JSON.parse(response.content);
			var sum = parseInt(data.comment_count) + parseInt(data.favoritings_count) + parseInt(data.playback_count);
			Session.setPersistent("heat", normalize(sum, 0, 9999, 0, 10));
		});
	}
});

Template.Loading.onRendered(function () {
  $(".progress-bar").animate({
    width: "100%"
  }, 250, function () {
    window.location.href="/result";
  });
});

Template.Loading.onDestroyed(function () {
});

function normalize(x, in_min, in_max, out_min, out_max) {
	return ((x - in_min) * (out_max - out_min) / (in_max - in_min)) + out_min;
}
