/* jshint devel:true */
/* global moment */

(function() {
  'use strict';

  var API = {
    EVENTS: 'https://boston-civic-calendar.herokuapp.com/api/v1/events',
    NEW_SOURCE: 'https://boston-civic-calendar.herokuapp.com/source/new',
    // EVENTS: 'http://localhost:3000/api/v1/events',
  }

  var DAYS_OF_THE_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS_PER_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  var today = new Date();



  function dasherize (text) {
    return text.toLowerCase().split(' ').join('-');
  }


  function transformEventsForFC(events) {
    return events.map(function(e){
      return {
        title: e.title,
        start: e.start_date,
        end: e.end_date,
        url: e.url,
        editable: false,
        startEditable: false,
        durationEditable: false,
        className: dasherize(e.organizer)
      };
    });
  }

  function linkify (text) {
    return text.split(' ')
        .map(function(s){
          if(s.toLowerCase().indexOf('http') == 0) {
            return "<a href='"+s+"' target='_blank'>"+s+"</a>";
          } else {
            return s;
          }
        })
        .join(' ');
  }


// setup bootstrap stuff

$('[data-toggle="tooltip"]').tooltip()

$('[data-hook="new-source-link"]').attr('href', API.NEW_SOURCE);



// populate list
//

  var $listContainer = $('[data-hook="list-container"]');
  $.getJSON(API.EVENTS).then(function(events){

    var fullCalEvents = transformEventsForFC(events);


    console.log(fullCalEvents);


    $('.calendar-container').fullCalendar({
      events: fullCalEvents,
      theme: false,
      aspectRatio: 2,
      dayClick: function(date, jsEvent, view) {
        console.log("handle day click. show all events in pane?");
      },
      eventClick: function(event) {
        debugger;
        console.log("handle event click. show single event in pane?");

      }
    });



    $.each( events, function(i, event) {
      var start = new Date(event.start_date);

      if( start > today ) {

        var tpl = $('<li> <h3 class="title"></h3><p><em class="date"></em></p><p><strong class="location"></strong></p><p class="description"></p>  </li>');
        tpl.find('.title').text(event.title);
        if( moment(event.start_date).format('L') === moment(event.end_date).format('L')) {
          tpl.find('.date').text(moment(event.start_date).format('L'));
        } else {

          tpl.find('.date').text(moment(event.start_date).format('L')+' - '+moment(event.end_date).format('L'));
        }
        tpl.find('.location').text(event.location);
        tpl.find('.description').html( linkify(event.description) );

        $listContainer.append(tpl);
      }

    });

  });

})();

