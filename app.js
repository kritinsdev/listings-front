import { createListingItem, removeItemDisabled, setItemDisabled } from './inc/helpers.js';
import { getAllListings, getAllModels, getModel } from './inc/data.js';

class App {
    constructor() {
        this.allListings = null;
        this.selectedModel = null;
        this.pageBody = document.querySelector('body');
        this.pageLoader = document.querySelector('.loader');
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
        this.allListings = await getAllListings();
        const models = await getAllModels();

        const reversedOrderModels = [...models].reverse();
        const countMap = this.allListings.reduce((acc, curr) => {
            acc[curr.model_id] = (acc[curr.model_id] || 0) + 1;
            return acc;
        }, {});

        for (let i = 0; i < reversedOrderModels.length; i++) {
            const modelCount = document.createElement('div');
            modelCount.classList.add('count');
            const count = countMap[reversedOrderModels[i].id] || 0;
            modelCount.textContent = count;

            const modelOption = document.createElement('div');
            modelOption.classList.add('modelId');
            modelOption.setAttribute('data-model-id', reversedOrderModels[i].id);
            modelOption.textContent = `iPhone ${reversedOrderModels[i].model_name}`;
            
            if(count > 0) {
                modelOption.appendChild(modelCount);
            }

            this.modelsList.appendChild(modelOption);
        }

        for (let i = 0; i < this.allListings.length; i++) {
            const itemElement = createListingItem(this.allListings[i]);
            this.listingsContainer.appendChild(itemElement);
        }

        this.pageLoader.remove();
        this.pageBody.style.overflow = 'initial';
    }

    getModelListings = async (e) => {
        if (e.target.getAttribute('data-model-id')) {
            const allModelButtons = this.modelsList.querySelectorAll('.modelId');
            setItemDisabled(allModelButtons);

            const active = document.querySelector('.modelId.active');
            e.target.classList.add('active');
            if (active) {
                active.classList.remove('active');
            }

            if (this.selectedModel === null) {
                const resetBtn = document.createElement('span');
                resetBtn.textContent = 'Reset';
                resetBtn.setAttribute('id', 'reset');

                this.modelsList.appendChild(resetBtn);
            }

            this.selectedModel = e.target.getAttribute('data-model-id');

            if (this.selectedModel) {
                const allListings = await getModel(this.selectedModel);
                this.listingsContainer.innerHTML = '';
                this.statsContainer.innerHTML = '';

                if (allListings.length > 0) {
                    for (let i = 0; i < allListings.length; i++) {
                        const itemElement = createListingItem(allListings[i]);
                        this.listingsContainer.appendChild(itemElement);
                    }

                    this.createModelStats(allListings);
                } else {
                    this.listingsContainer.innerHTML = '<p>No results found</p>';
                }
            }
            removeItemDisabled(allModelButtons);
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

        for (let i = 0; i < listings.length; i++) {
            const priceElement = listings[i].querySelector('.price');
            let price = priceElement.getAttribute('data-price');
            price = parseFloat(price);

            if (price <= avg - 100) {
                priceElement.classList.add('low');
            }
        }
    }

    resetListings = async (e) => {
        if (e.target.id === 'reset') {
            this.selectedModel = null;
            const active = document.querySelector('.modelId.active');
            active.classList.remove('active');
            e.target.remove();

            this.listingsContainer.innerHTML = '';
            this.statsContainer.innerHTML = '';

            for (let i = 0; i < this.allListings.length; i++) {
                const itemElement = createListingItem(this.allListings[i]);
                this.listingsContainer.appendChild(itemElement);
            }
        }
    }
}

new App();