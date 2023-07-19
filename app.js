import { createListingItem } from './inc/helpers.js';
import { getAllListings, getAllModels, getModel } from './inc/data.js';

class App {
    constructor() {
        this.listingsContainer = document.querySelector('.listings');
        this.statsContainer = document.querySelector('.stats');
        this.filtersContainer = document.querySelector('.filters');
        this.modelsList = document.querySelector('#models');
        this.events();
    }

    events() {
        window.onload = this.initApp.bind(this);
        document.addEventListener('click', this.resetListings);
        this.modelsList.addEventListener('click', this.getModelListings);
    }

    async initApp() {
        const listings = await getAllListings();
        const models = await getAllModels();

        const reversedOrderModels = [...models].reverse();
        console.log(listings);

        for (let i = 0; i < reversedOrderModels.length; i++) {
            const modelOption = document.createElement('div');
            modelOption.classList.add('modelId');
            modelOption.setAttribute('data-model-id', reversedOrderModels[i].id);
            modelOption.textContent = `iPhone ${reversedOrderModels[i].model_name}`;
            this.modelsList.appendChild(modelOption);
        }

        for (let i = 0; i < listings.length; i++) {
            const itemElement = createListingItem(listings[i]);
            this.listingsContainer.appendChild(itemElement);
        }
    }

    getModelListings = async (e) => {
        const active = document.querySelector('.modelId.active');
        if(active) {
            active.classList.remove('active');
        }
        const modelItem = e.target;
        const modelId = modelItem.getAttribute('data-model-id');
        modelItem.classList.add('active');

        if(!document.querySelector("#reset")) {
            const resetContainer = document.createElement('div');
            resetContainer.classList.add('reset-container');
            const resetBtn = document.createElement('span');
            resetBtn.textContent = 'Reset';
            resetBtn.setAttribute('id', 'reset');

            resetContainer.appendChild(resetBtn);
            this.filtersContainer.appendChild(resetContainer);
        }

        if(modelId) {
            const allListings = await getModel(modelId);
            this.listingsContainer.innerHTML = '';
    
            if(allListings.length > 0) {
                for (let i = 0; i < allListings.length; i++) {
                    const itemElement = createListingItem(allListings[i]);
                    this.listingsContainer.appendChild(itemElement);
                }
        
                this.createModelStats(allListings);
            } else {
                this.listingsContainer.innerHTML = '<p>No results found</p>'; 
            }
        }

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
            console.dir(e.target);
            const active = document.querySelector('.modelId.active');
            active.classList.remove('active');
            e.target.parentElement.remove();
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