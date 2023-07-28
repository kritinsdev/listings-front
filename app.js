import { createListingItem, openModal, statsModal } from './inc/helpers.js';
import { getListings, getModels, getModel } from './inc/data.js';
import ModelPrices from './inc/ModelPrices.js';

class App {
    constructor() {
        this.state = {
            category: 'phone',
            listings: [],
            models:[],
            selectedModel: null,
            listingsCategory: 1,
        },

        this.pageBody = document.querySelector('body');
        this.pageLoader = document.querySelector('.loader');
        this.listingsContainer = document.querySelector('.listings');
        this.statsContainer = document.querySelector('.stats');
        this.filtersContainer = document.querySelector('.filters');
        this.modelsOptions = document.querySelector('#models');
        this.events();
    }

    events() {
        window.onload = this.initApp();
        document.addEventListener('click', this.handleClick);
        this.modelsOptions.addEventListener('change', this.getModelListings);
    }

    initApp = async () => {
        this.state.listings = await getListings();
        this.state.models = await getModels(this.state.listingsCategory);

        this.createModelOptions();

        for (let i = 0; i < this.state.listings.data.length; i++) {
            const itemElement = createListingItem(this.state.listings.data[i]);
            this.listingsContainer.appendChild(itemElement);
        }

        this.pageLoader.remove();
        this.pageBody.style.overflow = 'initial';
    }

    getModelListings = async (e) => {
        this.state.selectedModel = e.target.value;
        this.listingsContainer.classList.add('processing');
        
        if (this.state.selectedModel) {
            const modelListings = await getModel(this.state.selectedModel);
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

    createModelOptions() {
        const models = [...this.state.models].reverse();
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select option';
        this.modelsOptions.appendChild(defaultOption);

        for (let i = 0; i < models.length; i++) {
            const modelOption = document.createElement('option');
            modelOption.value = models[i].id;
            modelOption.textContent = `${models[i].model_name}`;
            this.modelsOptions.appendChild(modelOption);
        }
    }

    handleClick = (e) => {
        if (e.target.id === 'reset') {
            this.state.selectedModel = null;
            e.target.remove();

            this.modelsOptions.value = '';
            
            this.listingsContainer.innerHTML = '';
            for (let i = 0; i < this.state.listings.data.length; i++) {
                const itemElement = createListingItem(this.state.listings.data[i]);
                this.listingsContainer.appendChild(itemElement);
            }
        }

        if(e.target.id === 'best-profit') {
            const listings = document.querySelectorAll('.listing.good');
            const listingsArray = Array.from(listings);
            listingsArray.sort((a, b) => {
                const aDiff = parseInt(a.getAttribute('data-potential-profit'));
                const bDiff = parseInt(b.getAttribute('data-potential-profit'));
                return bDiff - aDiff;
            });
        
            this.listingsContainer.innerHTML = '';
            listingsArray.forEach(el => this.listingsContainer.appendChild(el));
            this.createResetButton(this.filtersContainer);
        }

        if(e.target.id === 'delete-listing') {
            
        }

        if(e.target.id === 'statistics') {
            e.preventDefault();

            const modelsData = this.state.models.map((item) => {
                const obj = {
                    model: item.model_name,
                    avgPrice: item.model_stats.average_price
                };
                return obj;
            });

            const modal = statsModal();
            openModal(modal);
            const stats = new ModelPrices(modelsData);
            stats.init();
        }
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