import { createListingItem } from './inc/helpers.js';
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
        this.modelsOptions = document.querySelector('#models');
        this.events();
    }

    events() {
        window.onload = this.initApp.bind(this);
        document.addEventListener('click', this.handleClick);
        this.modelsOptions.addEventListener('change', this.getModelListings);
    }

    async initApp() {
        this.allListings = await getAllListings();

        const models = await getAllModels();
        const reversedOrderModels = [...models].reverse();

        this.createModelOptions(reversedOrderModels);

        for (let i = 0; i < this.allListings.data.length; i++) {
            const itemElement = createListingItem(this.allListings.data[i]);
            this.listingsContainer.appendChild(itemElement);
        }

        this.pageLoader.remove();
        this.pageBody.style.overflow = 'initial';
    }

    getModelListings = async (e) => {
        this.selectedModel = e.target.value;
        this.listingsContainer.classList.add('processing');
        
        if (this.selectedModel) {
            const modelListings = await getModel(this.selectedModel);
            this.listingsContainer.innerHTML = '';
            
            if (modelListings.data.length > 0) {
                for (let i = 0; i < modelListings.data.length; i++) {
                    const itemElement = createListingItem(modelListings.data[i]);
                    this.listingsContainer.appendChild(itemElement);
                }
                
                this.createResetButton(this.filtersContainer);
            } else {
                this.listingsContainer.innerHTML = '<p>No results found</p>';
            }
            this.listingsContainer.classList.remove('processing');
        }
    }

    createModelOptions(models) {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select option';
        this.modelsOptions.appendChild(defaultOption);

        for (let i = 0; i < models.length; i++) {
            const modelOption = document.createElement('option');
            modelOption.value = models[i].id;
            modelOption.textContent = `iPhone ${models[i].model_name}`;
            this.modelsOptions.appendChild(modelOption);
        }
    }

    handleClick = (e) => {
        if (e.target.id === 'reset') {
            this.selectedModel = null;
            e.target.remove();

            this.modelsOptions.value = '';
            
            this.listingsContainer.innerHTML = '';
            for (let i = 0; i < this.allListings.data.length; i++) {
                const itemElement = createListingItem(this.allListings.data[i]);
                this.listingsContainer.appendChild(itemElement);
            }
        }

        if (e.target.id === 'best-deals') {
            const listings = document.querySelectorAll('.listing.good');
            const listingsArray = Array.from(listings);
            listingsArray.sort((a, b) => {
                const aDiff = parseInt(a.querySelector('.difference').getAttribute('data-price-diff'));
                const bDiff = parseInt(b.querySelector('.difference').getAttribute('data-price-diff'));
                return bDiff - aDiff;
            });
        
            this.listingsContainer.innerHTML = '';
            listingsArray.forEach(el => this.listingsContainer.appendChild(el));
            this.createResetButton(this.filtersContainer);
        }
    }

    updateModelStats = (data) => {

    }

    createResetButton = (parent) => {
        const resetButton = document.querySelector('#reset');
        if(!resetButton) {
            const resetBtn = document.createElement('span');
            resetBtn.textContent = 'Reset';
            resetBtn.setAttribute('id', 'reset');
            parent.appendChild(resetBtn);
        }
    }
}

new App();