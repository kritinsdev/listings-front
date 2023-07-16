import { createListingItem } from './inc/helpers.js';
import { getAllListings, getAllModels, getModel } from './inc/data.js';

class App {
    constructor() {
        this.listingsContainer = document.querySelector('.listings');
        this.statsContainer = document.querySelector('.stats');
        this.filtersContainer = document.querySelector('.filters');
        this.modelsSelectElemet = document.querySelector('#models');
        this.events();
    }

    events() {
        window.onload = this.initApp.bind(this);
        document.addEventListener('click', this.resetListings);
        this.modelsSelectElemet.addEventListener('change', this.getModelListings);
    }

    async initApp() {
        const listings = await getAllListings();
        const models = await getAllModels();

        for (let i = 0; i < models.length; i++) {
            const modelOption = document.createElement('option');
            modelOption.value = models[i].id;
            modelOption.textContent = `iPhone ${models[i].model_name}`;
            this.modelsSelectElemet.appendChild(modelOption);
        }

        for (let i = 0; i < listings.length; i++) {
            const itemElement = createListingItem(listings[i]);
            this.listingsContainer.appendChild(itemElement);
        }
    }

    getModelListings = async (e) => {
        const modelId = e.target.value;

        if(!document.querySelector("#reset")) {
            const resetBtn = document.createElement('span');
            resetBtn.textContent = 'Reset';
            resetBtn.setAttribute('id', 'reset');
            this.filtersContainer.appendChild(resetBtn);
        }

        const allListings = await getModel(modelId);
        this.listingsContainer.innerHTML = '';

        for (let i = 0; i < allListings.length; i++) {
            const itemElement = createListingItem(allListings[i]);
            this.listingsContainer.appendChild(itemElement);
        }

        this.createModelStats(allListings);
    }

    createModelStats = (allListings) => {
        let sum = 0;
        let lowest = allListings[0].price;
        let biggest = allListings[0].price;

        for (let i = 0; i < allListings.length; i++) {
            sum += allListings[i].price;
            if (allListings[i].price < lowest) {
                lowest = allListings[i].price;
            }
            if (allListings[i].price > biggest) {
                biggest = allListings[i].price;
            }
        }

        const avg = sum / allListings.length;
        this.statsContainer.innerHTML = `<div>Average price: <span>${parseInt(avg)}€</span></div>`;
        this.statsContainer.innerHTML += `<div>Lowest price: <span>${lowest}€</span></div>`;
        this.statsContainer.innerHTML += `<div>Highest price: <span>${biggest}€</span></div>`;

        const listings = document.querySelectorAll('.listing');

        for(let i = 0; i < listings.length; i++) {
            const priceElement = listings[i].querySelector('.price');
            let price = priceElement.getAttribute('data-price');
            price = parseFloat(price);

            if(price <= avg - 100) {
                priceElement.classList.add('low');
            }
        }
    }

    resetListings = async (e) => {
        if (e.target.id === 'reset') {
            e.target.remove();
            const listings = await getAllListings();
            this.listingsContainer.innerHTML = '';
            this.statsContainer.innerHTML = '';

            for (let i = 0; i < listings.length; i++) {
                const itemElement = createListingItem(listings[i]);
                this.listingsContainer.appendChild(itemElement);
            }
        }
    }
}

new App();