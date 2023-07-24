import { createListingItem, removeItemDisabled, setItemDisabled } from './inc/helpers.js';
import { getAllListings, getAllModels, getModel, getStats } from './inc/data.js';

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

        console.log(reversedOrderModels);

        for (let i = 0; i < reversedOrderModels.length; i++) {
            const modelCount = document.createElement('div');
            modelCount.classList.add('count');
            const count = reversedOrderModels[i].model_stats?.count;
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

        for (let i = 0; i < this.allListings.data.length; i++) {
            const itemElement = createListingItem(this.allListings.data[i]);
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

                if (allListings.data.length > 0) {
                    for (let i = 0; i < allListings.data.length; i++) {
                        const itemElement = createListingItem(allListings.data[i]);
                        this.listingsContainer.appendChild(itemElement);
                    }

                } else {
                    this.listingsContainer.innerHTML = '<p>No results found</p>';
                }
            }
            removeItemDisabled(allModelButtons);
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

            for (let i = 0; i < this.allListings.data.length; i++) {
                const itemElement = createListingItem(this.allListings.data[i]);
                this.listingsContainer.appendChild(itemElement);
            }
        }
    }
}

new App();