async function fetchApi(endpoint, queryParams = {}) {
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

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

export const getListings = (id) => fetchApi('listings', (id) ? {category: id} : {});
export const getModels = (id) => fetchApi('models', (id) ? {category_id: id} : {});
export const getModel = (id) => fetchApi('listings', { model_id: id });
export const getStats = () => fetchApi('stats');