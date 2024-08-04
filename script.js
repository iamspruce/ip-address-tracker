/* Select form */
const search_form = document.querySelector(".header_form");

search_form.addEventListener("submit", (event) => {
  /* stop form from auto submiting on click */
  event.preventDefault();

  /* get the value of the form field */
  const value = document.querySelector("#search").value;

  /* Pass the Ip address to the search_Ip_Address() function */
  search_Ip_Address(value);
});

/* Search for an IpAddress */
async function search_Ip_Address(ip_address) {
  const api_key = "at_b1AyHXsURuXnWIQ8Tl6NNawNn8VYP";
  const request = await fetch(
    `https://geo.ipify.org/api/v2/country,city?apiKey=${api_key}&ipAddress=${ip_address}`
  );
  const response = await request.json();

  const { location, ip, isp } = response;

  /* Update the ui on the page */
  update_ui(ip, location.city, location.timezone, isp);

  /* Update the map on the page */
  /* first remove all map instances if any */
  if (map !== undefined && map !== null) {
    map.remove();
  }
  create_map(location.lat, location.lng, location.country, location.region);
}

/* create the map */
let map;
function create_map(lat, lng, country, region) {
  map = L.map("map").setView([lat, lng], 14);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 20,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  /* Add marker to the map */
  const my_icon = L.icon({
    iconUrl: "/images/icon-location.svg",
    iconSize: [40, 60],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],
  });
  L.marker([lat, lng], { icon: my_icon })
    .addTo(map)
    .bindPopup(`${region}, ${country}`)
    .openPopup();
}

/* update UI function */
function update_ui(ip_address, location, timezone, isp) {
  /* select all the elements on the page */
  const address = document.querySelector(".address");
  const city = document.querySelector(".location");
  const utc = document.querySelector(".utc");
  const isprovider = document.querySelector(".isp");

  /* Update all the elements on the page */
  address.textContent = ip_address;
  city.textContent = location;
  utc.textContent = "UTC" + timezone;
  isprovider.textContent = isp;
}

/* Create map with default values when page loads */
const defaultIp = "26.37.52.179";
search_Ip_Address(defaultIp);

/* navigator.geolocation.getCurrentPosition
https://europe-west3-devrcc.cloudfunctions.net/whatismyip*/
