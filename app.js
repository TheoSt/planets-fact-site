let hamIcon = document.querySelector("#ham-icon");
let navMenu = document.querySelector(".nav-menu");
let planets = document.querySelectorAll(".planet");
let planetImage = document.querySelector("#planet-img");
let planetInfo = document.querySelector(".planet-info");
let sciInfoItems = document.querySelectorAll(".sci-info-item");
let tabs = document.querySelectorAll(".tab");
let tabLabel = document.querySelector("hr");
let geologyImage = planetImage.nextElementSibling;
let planetsObj = [];
let activePlanet = null;
let activeTab = tabs[0];
let deskLayout = false;

planetImage.classList.add("init-image");

if(window.innerWidth>=768) {
    deskLayout = true;
    activeTab.style.backgroundColor = "purple";
}

getData()
.then(response=> {
    for(var i=0; i<response.length; i++) {
        planetsObj.push(response[i]);
    }

    activePlanet = showPlanet("earth"); //planet earth
})
.catch(e=> {
    console.error(e);
});

planets.forEach(p => 
        p.addEventListener("click",function() {

            activePlanet = showPlanet(this.dataset.planet);
            navMenu.classList.toggle("active-menu");
            
            if(planetImage.nextElementSibling.classList.length>=1) {
                planetImage.nextElementSibling.classList.toggle("active-geology");
            }
        })
);


tabs.forEach(tab => 
        tab.children[0].addEventListener("click",function(){
            if(activeTab.children[0].id===this.id) return;

            var t = 0;

            activeTab.style.backgroundColor = "transparent";
            activeTab = this.parentNode;
            
            if(activeTab.children[0].id === "overview-tab") {
                showOverview(activePlanet);
                t = 1; 
            }
            else if(activeTab.children[0].id==="structure-tab") {
                showStructure(activePlanet);
                t= 2; 
            }
            else {
                showSurface(activePlanet);
                t = 3;
            }

            showTabGraphic(t);
        })
);

hamIcon.addEventListener("click",function() {
    navMenu.classList.toggle("active-menu");
});


/* functions */

function showTabGraphic(tabNumber) {
    if(deskLayout) {
        activeTab.style.backgroundColor = "purple";
     }
     else {
         switch(tabNumber) {
             case 1:
                 tabLabel.style.marginLeft = "4%";  
                 break;
             case 2:
                 tabLabel.style.marginLeft = "35%";
                 break;
             case 3:
                 tabLabel.style.marginLeft = "66%";
                 break;
         }
     }

    if(activeTab.children[0].id !=="surface-tab" && geologyImage.classList.length===1) {
        geologyImage.classList.toggle("active-geology");
    }
}

async function getData() {
    const response = await fetch("data.json");
    if(!response.ok) throw new Error(`HTTP error, status ${response.status}`);
    const data = await response.json();

    return data;
}


function showPlanet(planetName) {
    var planet = planetsObj.find(p => p.name===planetName.toLowerCase());

    if(planet) {
        showOverview(planet);
        planetInfo.children[0].textContent = planet.name;

        sciInfoItems[0].textContent = planet.rotation;
        sciInfoItems[1].textContent = planet.revolution;
        sciInfoItems[2].textContent = planet.radius;
        sciInfoItems[3].textContent = planet.temperature;
        return planet;
    }
    return null;   
}

function showOverview(planet) {
    planetImage.src = planet.images.planet;

    planetInfo.children[1].classList.remove("load");
    planetInfo.children[2].classList.remove("load");

    setTimeout(function(){
        planetInfo.children[1].textContent = planet.overview.content;  
        planetInfo.children[2].children[0].href = planet.overview.source;
        
        planetInfo.children[1].classList.add("load");
        planetInfo.children[2].classList.add("load");
    
    },400)
}

function showStructure(planet) {
    planetImage.src = planet.images.internal;
    
    planetInfo.children[1].classList.remove("load");
    planetInfo.children[2].classList.remove("load");
    
    setTimeout(function(){
        planetInfo.children[1].textContent = planet.structure.content;
        planetInfo.children[2].children[0].href = planet.structure.source;  

        planetInfo.children[2].classList.add("load");
        planetInfo.children[1].classList.add("load");
    },400)
}

function showSurface(planet) {
    var geologyImage = planetImage.nextElementSibling;
    planetImage.src = planet.images.planet;
    geologyImage.src = planet.images.geology;
    geologyImage.classList.toggle("active-geology");


    planetInfo.children[1].classList.remove("load");
    planetInfo.children[2].classList.remove("load");
    
    setTimeout(function(){
        planetInfo.children[1].textContent = planet.geology.content;
        planetInfo.children[2].children[0].href = planet.geology.source;
    
        planetInfo.children[2].classList.add("load");
        planetInfo.children[1].classList.add("load");
    },400)
}