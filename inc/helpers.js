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
    profitElement.setAttribute('data-pp', item.average_model_price - item.price);
    profitElement.classList.add('profit');
    profitElement.textContent = `+${item.average_model_price - item.price}€`;

    const itemModel = document.createElement('div');
    itemModel.classList.add('model');
    itemModel.textContent = `iPhone ${item.model}`;

    const itemDetails = document.createElement('div');
    itemDetails.classList.add('details');

    const itemCategory = document.createElement('span');
    itemCategory.textContent = `Category: ${item.category}`;

    const modelAvgPrice = document.createElement('span');
    modelAvgPrice.textContent = `Average price(iPhone ${item.model}): ${item.average_model_price}€`;

    itemDetails.appendChild(itemCategory);
    itemDetails.appendChild(modelAvgPrice);

    const priceHistoriesButton = document.createElement('div');
    priceHistoriesButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
</svg>
`;
    priceHistoriesButton.classList.add('price-histories-btn');
    // priceHistories.classList.add('price-history');
    // item.price_history.forEach((el) => {
    //     const historyItem = document.createElement('p');
    //     historyItem.textContent = `Old Price: ${el.old_price}, New Price: ${el.new_price}, Change fixed: ${el.change_date}`;
    //     priceHistories.appendChild(historyItem);
    // });

    const itemAdded = document.createElement('p');
    itemAdded.classList.add('added');
    itemAdded.textContent = `Added: ${relativeTime(item.added)}`;

    itemElement.appendChild(priceHistoriesButton);
    itemElement.appendChild(itemModel);
    itemElement.appendChild(itemDetails);
    itemElement.appendChild(itemAdded);
    itemElement.appendChild(itemPrice);

    if((item.average_model_price - item.price) >= 90) {
        itemElement.classList.add('good');
        itemElement.appendChild(profitElement);
    }

    return itemElement;
}

export const openModal = (data) => {
    // Create the modal container
    const modal = document.createElement('div');
    modal.style.display = 'block';
    modal.style.width = '200px';
    modal.style.height = '200px';
    modal.style.background = '#fff';
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.2)';
  
    // Create the modal content
    const title = document.createElement('h2');
    title.textContent = data.title;
    const content = document.createElement('p');
    content.textContent = data.content;
  
    // Add the content to the modal
    modal.appendChild(title);
    modal.appendChild(content);
  
    // Add the modal to the body
    document.body.appendChild(modal);
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.style.position = 'fixed';
    backdrop.style.top = '0';
    backdrop.style.left = '0';
    backdrop.style.width = '100vw';
    backdrop.style.height = '100vh';
    backdrop.style.background = 'rgba(0,0,0,0.5)';
    backdrop.style.zIndex = '1000';
    document.body.appendChild(backdrop);
  
    // Close modal when backdrop is clicked
    backdrop.addEventListener('click', function() {
      document.body.removeChild(modal);
      document.body.removeChild(backdrop);
    });
  }