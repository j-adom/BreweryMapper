var stateArray = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
'Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana',
'Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota',
'Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington',
'West Virginia','Wisconsin','Wyoming']

var typeArray = ["Micro", "Regional", "Brewpub", "Large", "Planning", "Bar", "Contract", "Proprietor"];
var tagsArray = ["Dog-friendly", "Patio", "Food-service", "Food-truck", "Tours"];

var searchCity;
var searchState;
var searchName;
var searchType;

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
          var results = response;
          console.log(queryURL)
          for(var i=0;i<results.length;i++){
            var holderBody = $("<tbody>")
            var holderRow = $("<tr>");
            holderBody.append(holderRow);
            var holder = $("<td>");
            holder.text(results[i].name);
            holderRow.append(holder);
            $("#results-area").append(holderBody);

          }
        });

    });

});