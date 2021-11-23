// Significantly coded live along with Nathan during group homework help session
var myMap = L.map("map", {
    center : [40.7128, -74.0059],
    zoom: 4
})

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "©️ <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> ©️ <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

function getColor(depth){
    switch(true){
        case depth > 90: return "black";
        case depth > 70: return "blue";
        case depth > 50: return "purple";
        case depth > 30: return "red";
        case depth > 10: return "pink";
        default: return "white";
    }
}

  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(data => {
      L.geoJson(data, {
          pointToLayer: (feature, latlng) => {
              return L.circleMarker(latlng, {
                  radius: feature.properties.mag*5,
                  color: getColor(feature.geometry.coordinates[2]),
                  fill: getColor(feature.geometry.coordinates[2]),
                  fillOpacity: ".5"
              })
          },
          onEachFeature: (feature, layer)=> {
              layer.bindPopup(
                  "Magnitude: " + feature.properties.mag
                  + "<br>Depth: " + feature.geometry.coordinates[2]
                  + "<br>Location: " + feature.properties.place
              )
          }
      }).addTo(myMap)

      var legend = L.control({
          position: "bottomleft"
      })
      legend.onAdd = function(){
          var div = L.DomUtil.create("div", "Legend")
          div.innerHTML = "<h2>Depth</h2>"

          var depthList = [0,10,30,50,70,90]

          for (var i = 1; i < depthList.length; i++){
              div.innerHTML += "<div>"
                    + "<i style = 'background-color: " + getColor(depthList[i]-1) + ";'>&nbsp;</i>" +
                    + depthList[i-1] + ' - ' + depthList[i] + "</div>"
          }
          div.innerHTML += "<div>" 
                        + "<i style = 'background-color: " + getColor(100) + ";'>&nbsp;</i>"
                        + depthList[depthList.length - 1] + "+" + "</div>"
          return div;
      }

      legend.addTo(myMap)
  })