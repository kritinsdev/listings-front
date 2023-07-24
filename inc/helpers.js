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
    itemElement.setAttribute('data-listing-id', item.id);
    itemElement.setAttribute('href', item.url);
    itemElement.setAttribute('target', '_blank');

    const itemPrice = document.createElement('div');
    itemPrice.setAttribute('data-price', item.price);
    itemPrice.classList.add('price');
    itemPrice.innerHTML = `
    <div>
        ${item.price}€${(item.old_price) ? `<span class="old-price">${item.old_price}€</span>` : ""}
        ${(item.old_price) ? `${(item.old_price > item.price) ? '<span class="price-direction down">&#8595;</span>' :'<span class="price-direction up">&#8593;</span>'}` : ''}
    </div>`;


    const profitElement = document.createElement('div');
    profitElement.classList.add('profit');
    profitElement.innerHTML = `<div>Potential: <span>${item.average_model_price - item.price}€</span></div>`;

    const priceCompareElement = document.createElement('div');
    const priceDifference = calculatePercentageChange(item.price, item.average_model_price);
    priceCompareElement.setAttribute('data-price-diff', priceDifference);
    priceCompareElement.classList.add('difference');
    priceCompareElement.textContent = `${priceDifference} %`;

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

    if(item.price < item.average_model_price && priceDifference > 30) {
        itemElement.classList.add('good');
        itemElement.appendChild(priceCompareElement);
        itemElement.appendChild(profitElement);
    }

    return itemElement;
}

const calculatePercentageChange = (oldNumber, newNumber) => {
    if (!oldNumber || !newNumber) {
        return false;
    }

    let difference = newNumber - oldNumber;
    let percentageChange = (difference / oldNumber) * 100;

    return Math.round(percentageChange);
}
