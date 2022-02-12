var API = "https://phishstats.info:2096/api/";
google.charts.load('current', {'packages':['corechart']});



$(document).ready(function () {
  //Ajustando o width do input
  var inputFilter = document.getElementById("inputFilter");
  inputFilter.setAttribute(
    "size",
    inputFilter.getAttribute("placeholder").length
  );

  loadHistory();
});

function verifyURL() {
  var isPhishing = false;
  $("#loader").removeAttr("hidden");
  $.get(
    API + "phishing?_where=(url,like,~" + inputFilter.value + "~)",
    function (data, status) {
      $("#cardResults").removeAttr("hidden");
      var results = "";
      data.forEach((element) => {
        results = results + element.url + "<br><hr>";
        isPhishing = true;
      });
      isPhishing
        ? $("#results").html(
            "The following URLs related to your search are considered phishing:" +
              "<br><strong>" +
              results +
              "</strong>"
          )
        : $("#results").html("<strong>No results found.</strong>");
      $("#loader").attr("hidden", true);
      localStorage.setItem(inputFilter.value, isPhishing);
      loadHistory();
    }
  );
}

function loadHistory() {
    keys = Object.keys(localStorage),
    i = keys.length;
  var html = ""
  while (i--) {
    html = html + "<tr><td>" + keys[i] + "</td>+<td>" + localStorage.getItem(keys[i])+ "</td></tr>";
  }
  $("#bodyTable").html(html);
}

function drawChart(){
    //Calculando quantidade de phishings
    var truePhishing = 0;
    var falsePhishing = 0;
    keys = Object.keys(localStorage),
    i = keys.length;
  while (i--) {
    localStorage.getItem(keys[i])=='true'?truePhishing++:falsePhishing++;
  }

    var data = google.visualization.arrayToDataTable([
        ['',''],
        ['Are phishing',    truePhishing],
        ['Not are phishing',    falsePhishing]
      ]);

      var options = {
        title: 'Statistics of my queries'
      };

      var chart = new google.visualization.PieChart(document.getElementById('piechart'));

      chart.draw(data, options);
      $('#piechart').removeAttr('hidden');
}