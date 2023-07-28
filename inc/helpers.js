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
    const listingElement = document.createElement('div');
    listingElement.classList.add('listing');
    listingElement.setAttribute('data-listing-id', item.id);
    listingElement.setAttribute('data-price', item.price);
    listingElement.setAttribute('data-potential-profit', item.average_model_price - item.price);

    const itemPrice = document.createElement('a');
    itemPrice.classList.add('price');
    itemPrice.setAttribute('href', item.url);
    itemPrice.setAttribute('target', '_blank');
    itemPrice.innerHTML = `
        ${item.price}€${(item.old_price) ? `<span class="old-price">${item.old_price}€</span>` : ""}
        ${(item.old_price) ? `${(item.old_price > item.price) ? '<span class="price-direction down">&#8595;</span>' :'<span class="price-direction up">&#8593;</span>'}` : ''}`;

    const profitElement = document.createElement('div');
    profitElement.classList.add('profit');
    profitElement.textContent = `+${item.average_model_price - item.price}€`;

    const itemModel = document.createElement('div');
    itemModel.classList.add('model');
    itemModel.textContent = `${item.model}`;

    const itemDetails = document.createElement('div');
    itemDetails.classList.add('details');

    const optionsButtonsContainer = document.createElement('div');
    optionsButtonsContainer.classList.add('option-buttons');

    const deleteListing = document.createElement('div');
    deleteListing.setAttribute('id', 'delete-listing');
    deleteListing.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>`;

    const priceHistoriesButton = document.createElement('div');
    priceHistoriesButton.classList.add('price-histories-btn');
    priceHistoriesButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
</svg>
`;

    optionsButtonsContainer.appendChild(deleteListing);
    // TODO
    // priceHistories.classList.add('price-history');
    // item.price_history.forEach((el) => {
    //     const historyItem = document.createElement('p');
    //     historyItem.textContent = `Old Price: ${el.old_price}, New Price: ${el.new_price}, Change fixed: ${el.change_date}`;
    //     priceHistories.appendChild(historyItem);
    // });

    const itemAdded = document.createElement('p');
    itemAdded.classList.add('added');
    itemAdded.textContent = `Added: ${relativeTime(item.added)}`;

    listingElement.appendChild(optionsButtonsContainer);
    listingElement.appendChild(itemModel);
    listingElement.appendChild(itemDetails);
    listingElement.appendChild(itemAdded);
    listingElement.appendChild(itemPrice);

    if((item.average_model_price - item.price) >= 100) {
        listingElement.classList.add('good');
        listingElement.appendChild(profitElement);
    }

    return listingElement;
}

export const statsModal = () => {
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.setAttribute('id', 'modal');

    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'canvas');

    modal.appendChild(canvas);
    document.body.appendChild(modal);
    return modal;
}

export const openModal = (modal) => {
    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');
    document.body.appendChild(backdrop);

    backdrop.addEventListener('click', function () {
        document.body.removeChild(modal);
        document.body.removeChild(backdrop);
    });
} 