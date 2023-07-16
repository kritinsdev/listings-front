import { relativeTime } from './inc/helpers.js';
import { getAllListings, getAllModels, getModel } from './inc/data.js';

class App {
    constructor() {
        this.modelsSelectElemet = document.querySelector('#models');
        this.events();  
    }

    events() {
        window.onload = this.initApp.bind(this);
        this.modelsSelectElemet.addEventListener('change', this.getModel);
    }

    async initApp() {
        const listings = await getAllListings();
        const models = await getAllModels();
        const listingsContainer = document.querySelector('.listings');
        const modelsSelect = document.querySelector('#models');

        for (let i = 0; i < models.length; i++) {
            const modelOption = document.createElement('option');
            modelOption.value = models[i].id;  // assuming 'id' is the property you want as value
            modelOption.textContent = `iPhone ${models[i].model_name}`;  // assuming 'name' is the property you want as display text
            modelsSelect.appendChild(modelOption);
        }

        for (let i = 0; i < listings.length; i++) {
            const itemElement = this.createListingItem(listings[i]);
            listingsContainer.appendChild(itemElement);
        }
    }

    createListingItem(item) {
        const itemElement = document.createElement('a');
        itemElement.classList.add('listing');
        itemElement.setAttribute('href', item.url);
        itemElement.setAttribute('target', '_blank');

        const itemPrice = document.createElement('div');
        itemPrice.classList.add('price');
        itemPrice.textContent = `${item.price}€`;

        const itemModel = document.createElement('div');
        itemModel.classList.add('model');
        itemModel.textContent = `iPhone ${item.model}`;

        const itemDetails = document.createElement('div');
        itemDetails.classList.add('details');

        const itemMemory = document.createElement('span');
        itemMemory.textContent = (item.memory) ? `Memory: ${item.memory}GB` : `Memory: N/A`;
        const itemBatteryCapacity = document.createElement('span');
        itemBatteryCapacity.textContent = (item.battery_capacity) ? `Battery Capacity: ${item.battery_capacity}%` : `Battery Capacity: N/A`;
        itemDetails.appendChild(itemMemory);
        itemDetails.appendChild(itemBatteryCapacity);

        const itemAdded = document.createElement('p');
        itemAdded.classList.add('added');
        itemAdded.textContent = relativeTime(item.added);

        itemElement.appendChild(itemModel);
        itemElement.appendChild(itemDetails);
        itemElement.appendChild(itemAdded);
        itemElement.appendChild(itemPrice);

        return itemElement;
    }

    getModel = () => {
        console.log('red');
    }
}

new App();