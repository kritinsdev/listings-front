async function fetchApi(endpoint, queryParams = {}, method = 'GET', body = null) {
    let token, apiUrl;
    if (import.meta.env.MODE === 'development') {
        apiUrl = import.meta.env.VITE_API_URL_LOCAL;
        token = import.meta.env.VITE_BEARER_TOKEN_LOCAL;
    } else {
        apiUrl = import.meta.env.VITE_API_URL;
        token = import.meta.env.VITE_BEARER_TOKEN;
    }


    let url = new URL(`${apiUrl}/${endpoint}`);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]))

    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    } else if (response.status !== 204) {
        return await response.json();
    }
}

export const getListings = (id) => fetchApi('listings', (id) ? { category: id } : {});
export const deleteListing = (id) => fetchApi(`listings/${id}`, {}, 'DELETE');
export const getModels = (id) => fetchApi('models', (id) ? { category_id: id } : {});
export const getModel = (id) => fetchApi('listings', { model_id: id });
export const getStats = () => fetchApi('stats');