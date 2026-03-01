let key = document.getElementById("searchDestination");
let recommendations = document.getElementsByClassName("recommendations")[0];
let searchBtn = document.getElementById("search");
let clearBtn = document.getElementById("clear");
function normalizeWord(word) {
    if (word.endsWith("ies")) {
        return word.slice(0, -3) + "y";
    }
    if (word.endsWith("es")) {
        return word.slice(0, -2);
    }
    if (word.endsWith("s")) {
        return word.slice(0, -1);
    }
    return word;
}
searchBtn.addEventListener("click", function (event) {
    event.preventDefault();

    let keyword = key.value.toLowerCase().trim();
    keyword = normalizeWord(keyword);
    recommendations.innerHTML = "";
    
    if (keyword === "") return;

    fetch('travel_recommendation_api.json')
        .then(response => response.json())
        .then(data => {

            let results = [];

            
            data.beaches.forEach(place => {
                if (
                    place.name.toLowerCase().includes(keyword) ||
                    place.description.toLowerCase().includes(keyword)
                ) {
                    results.push(place);
                }
            });

            
            data.temples.forEach(place => {
                if (
                    place.name.toLowerCase().includes(keyword) ||
                    place.description.toLowerCase().includes(keyword)
                ) {
                    results.push(place);
                }
            });

            
            data.countries.forEach(country => {
                country.cities.forEach(city => {
                    if (
                        city.name.toLowerCase().includes(keyword) ||
                        city.description.toLowerCase().includes(keyword) ||
                        country.name.toLowerCase().includes(keyword)
                    ) {
                        results.push(city);
                    }
                });
            });

            
            if (results.length > 0) {
                results.slice(0, 6).forEach(place => {

                    let div = document.createElement("div");
                    div.classList.add("card");

                    div.innerHTML = `
                        <img src="${place.imageUrl}" alt="${place.name}">
                        <h3>${place.name}</h3>
                        <p>${place.description}</p>
                    `;

                    recommendations.appendChild(div);
                });

            } else {
                recommendations.innerHTML = "<p>Destination Not Found</p>";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            recommendations.innerHTML = "<p>Error loading data</p>";
        });
});


clearBtn.addEventListener("click", function () {
    recommendations.innerHTML = "";
    key.value = "";
});