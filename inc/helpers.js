const relativeTime = (dateString) => {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    givenDate.setUTCHours(0, 0, 0, 0);

    const differenceInDays = (currentDate - givenDate) / (1000 * 60 * 60 * 24);

    const formatTime = (date) => {
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();

        // Pad the minutes with a leading zero if necessary
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes}`;
    }

    if (differenceInDays === 0) {
        return `Today at ${formatTime(new Date(dateString))}`;
    } else if (differenceInDays === 1) {
        return `Yesterday at ${formatTime(new Date(dateString))}`;
    } else {
        return `${differenceInDays} days ago at ${formatTime(new Date(dateString))}`;
    }
}

export const createListingItem = (item) => {
    const itemElement = document.createElement('a');
    itemElement.classList.add('listing');
    itemElement.setAttribute('href', item.url);
    itemElement.setAttribute('target', '_blank');

    const itemPrice = document.createElement('div');
    itemPrice.setAttribute('data-price', item.price);
    itemPrice.classList.add('price');
    itemPrice.textContent = `${item.price}€`;

    const itemModel = document.createElement('div');
    itemModel.classList.add('model');
    itemModel.textContent = `iPhone ${item.phone_model.model_name}`;

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