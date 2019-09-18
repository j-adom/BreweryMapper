var stateArray = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
'Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana',
'Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota',
'Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington',
'West Virginia','Wisconsin','Wyoming']

var typeArray = ["Micro", "Regional", "Brewpub", "Large", "Planning", "Bar", "Contract", "Proprietor"];

var searchCity;
var searchState;
var searchName;
var searchType;
var numResults=0;
var numBrews=0;
var results;
var getResults;
var x =0;
var startLatitude;
var startLongitude;
var map;

$(document).ready(function() {

    function createDropdown(){
        for(var i=0; i< stateArray.length;i++){
            var dropdown = $("#state-selector");
            var option = $("<option>");
            option.val(stateArray[i].replace(/ /g, '_'));
            option.text(stateArray[i]);
            dropdown.append(option);
        }

        for(var i=0; i< typeArray.length;i++){
            var dropdown = $("#type-input");
            var option = $("<option>");
            option.val(typeArray[i]);
            option.text(typeArray[i]);
            dropdown.append(option);
        }

    }

    function getNumStorage(){
      numBrews=0;
      x=0;
        while(localStorage.getItem("brew"+x)!=null){
          numBrews++;
          x++;
        }
    }


    function fixStorage(){
      var i=0;
      for(var j=0;j<numBrews;j++){
        if(localStorage.getItem("brew"+j)!="null"){
          localStorage.setItem("brew"+i,localStorage.getItem("brew"+j))
          if(i!=j){
            localStorage.removeItem("brew"+j);
          }
          i++;
        }
        else{
          localStorage.removeItem("brew"+j);
        }
      }
      
      numBrews=i;
      
     
    }

    function indexListCreate(){
      $("#list-area").empty();
      for(var i=0;i<numBrews;i++){
      
        getResults = JSON.parse(localStorage.getItem("brew"+i));
        
  
        // var holderBody = $("<tbody>")
        var holderRow = $("<tr>");
  
        // holderBody.append(holderRow);
  
        var holderName = $("<td>");
        holderName.text(getResults.name);
  
        var holderState = $("<td>");
        holderState.text(getResults.state);
  
        var holderCity = $("<td>");
        holderCity.text(getResults.city);
  
        var holderStreet = $("<td>");
        holderStreet.text(getResults.street);

        var holderModal = $("<button type='button' class='btn btn-primary modalButton' data-value="+i+" data-toggle='modal' data-target='#exampleModalLong' id='modal'>");
        holderModal.text("Click for more Info");
  
        var radio = $("<div class='form-check'>");
        var input = $("<input class='form-check-input' type='checkbox' value='"+i+"' id='checkbox"+i+"'>");
        radio.append(input);
        
        holderRow.append(radio);
        holderRow.append(holderName);
        holderRow.append(holderState);
        holderRow.append(holderCity);
        holderRow.append(holderStreet);
        holderRow.append(holderModal);
        $("#list-area").append(holderRow);
  
      }
    }
    
    function checkForRepeats(){
      for(var i=0;i<numBrews;i++){
        for(var j=0;j<numBrews;j++){
          if(localStorage.getItem("brew"+i)==localStorage.getItem("brew"+j) && i!=j){
            localStorage.setItem("brew"+j,"null");
          }
        }
      }
      fixStorage();
    }

    createDropdown();



    $("#form-submit").on("click", function() {
        event.preventDefault();
        $("#results-area").empty();

        searchCity = $("#city-input").val();
        if(searchCity!=""){
            searchCity = searchCity.trim();
            searchCity.replace((/ /g, '_'))
        }
        searchState = $("#state-selector").val();
        searchName = $("#name-input").val();
        if(searchName!=""){
            searchName = searchName.trim();
            searchName.replace((/ /g, '_'))
        }
        searchType = $("#type-input").val();

        var queryURL = "https://api.openbrewerydb.org/breweries?by_state="+searchState+"&by_city="+searchCity+"&by_name="+searchName+"&by_type="+searchType;

      $.ajax({
        url: queryURL,
        method: "GET"
      })
        .then(function(response) {
          results = response;
          numResults = results.length;
          
          for(var i=0;i<results.length;i++){
            var holderBody = $("<tbody>")
            var holderRow = $("<tr>");
            
            var radio = $("<div class='form-check'>");
            var input = $("<input class='form-check-input' type='checkbox' value='"+i+"' id='checkbox"+i+"'>");
            radio.append(input);

            holderBody.append(holderRow);
            holderRow.append(radio);

            var holder = $("<td>");
            holder.text(results[i].name);

            holderRow.append(holder);
            $("#results-area").append(holderBody);

          }
        });

    });





    $("#result-submit").on("click", function() {
      event.preventDefault();
      getNumStorage();
      for(var i=0;i<numResults;i++){
    
        if($('#checkbox'+i).prop('checked')){
          localStorage.setItem("brew"+numBrews,JSON.stringify(results[i]));
          numBrews++;
        }
      }
      checkForRepeats();
    });

    $("#remove-button").on("click", function() {
      event.preventDefault();
      for(var i=0;i<numBrews;i++){
    
        if($('#checkbox'+i).prop('checked')){
          
          localStorage.setItem("brew"+i,"null");
          
        }
      }
      fixStorage();
      indexListCreate();
      $("#mapContainer").empty();
      centerMap();
      addMarkersToMap(map);
    });

    $(document).on("click",".modalButton", function(e) {
      e.preventDefault();
      var position = $(this).data("value");
      var myBrew = JSON.parse(localStorage.getItem("brew"+position));
      
      var mymodal = $('#exampleModalLong');

      mymodal.find('.modal-title').text(myBrew.name);

      mymodal.find('.modal-body').html(myBrew.website_url +"<br>"+ myBrew.state+" "+myBrew.city+" "+myBrew.street);
      mymodal.modal('show');
    });
    

    // Begin Map code
    function addMarkersToMap(map) {
     
      for(var i=0;i< numBrews;i++) {
        if(localStorage.getItem("brew"+i)!="null"){
          let currentBrewery = JSON.parse(localStorage.getItem('brew'+ i))
          
          let latitude = currentBrewery.latitude
          let longitude = currentBrewery.longitude
          
          let stop = new H.map.Marker({lat:latitude, lng:longitude});
          map.addObject(stop);
        }
      }
    }

      function centerMap(){
        if(localStorage.getItem("brew0")){
          if(localStorage.getItem("brew0")!="null"){
          var temp = JSON.parse(localStorage.getItem("brew0"))
          startLatitude = temp.latitude;
          startLongitude = temp.longitude
          }
          else{
            startLatitude=36.1627;
            startLongitude=-86.7816;
          }
        }
        else{
          startLatitude=36.1627;
          startLongitude=-86.7816;
        }
        
            /**
     * Boilerplate map initialization code starts below:
     */

    //Step 1: initialize communication with the platform
    // In your own code, replace variable window.apikey with your own apikey
    var platform = new H.service.Platform({
      apikey: 'ZJV0UQd_-AXRmjvUV2btEe9nAIsJA4HNlvtZggxgRC8'
    });
    var defaultLayers = platform.createDefaultLayers();

    //Step 2: initialize a map - this map is centered over Europe

    map = new H.Map(document.getElementById('mapContainer'),
      defaultLayers.vector.normal.map,{
      center: {lat:startLatitude, lng:startLongitude},
      zoom: 8,
      pixelRatio: window.devicePixelRatio || 1
    });
    // add a resize listener to make sure that the map occupies the whole container
    window.addEventListener('resize', () => map.getViewPort().resize());

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    // Now use the map as required...
    // window.onload = function () {
    // } 
      }
    
                     

    
     

    getNumStorage();
    indexListCreate();
    centerMap();
    addMarkersToMap(map);
    
});


