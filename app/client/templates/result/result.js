/*****************************************************************************/
/* Result: Event Handlers */
/*****************************************************************************/
Template.Result.events({
});

/*****************************************************************************/
/* Result: Helpers */
/*****************************************************************************/
Template.Result.helpers({
  state: function () {

  	// Levels of fire
    var heat_levels = ["ICE COLD BULLSHIT, TAKE THAT BACK WHERE YOU FOUND IT", 
    	"QUIETLY BOILING WATER, MAYBE NEXT TIME", 
    	"SMOKEY BEAR-LEVEL SHIT. IT IS FIRE.",
    	"PIPING HOT VOLCANIC ERUPTION SHIT",
    	"CHILL, THAT SHIT HOTTER THAN THE SURFACE OF THE SUN"
    	];

    // isitfire.com is fire af; make sure it stays that way on the results page
    if (Session.get("url").indexOf("isitfire.com") > -1) {
    	Session.setPersistent("heat", 999);
    	return "FOREST FIRE SHIT. CAN YOU FETCH A BROTHER SOME WATER?";
    }
    else {
    	if (Session.get("YouTubeId") || Session.get("SoundCloudId")) {
	    	var index;
	    	Math.floor(Session.get("heat")/50) > 4 ? index = 4 : index = Math.floor(Session.get("heat")/50);
	    	return heat_levels[index];
	    } else {
	    	Session.setPersistent("heat", Math.random() * 100);
	    	return heat_levels[Math.floor(Math.random() * 4)];
	    }
    }
  },

  youtube: function () {
  	return Session.get("YouTubeId") != "";
  },

  soundcloud: function () {
  	return Session.get("SoundCloudId") != "";
  },

  heat: function () {
  	return Math.round(Session.get("heat"));
  }
});

/*****************************************************************************/
/* Result: Lifecycle Hooks */
/*****************************************************************************/
Template.Result.onCreated(function () {
});

Template.Result.onRendered(function () {
});

Template.Result.onDestroyed(function () {
});
