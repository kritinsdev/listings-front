async function fetchApi(endpoint, queryParams = {}) {
    let url = new URL(`${import.meta.env.VITE_API_URL}/${endpoint}`);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]))

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`,
            'Content-Type': 'application/json'
        }
    });
    return await response.json();
}

export const getAllListings = () => fetchApi('listings');
export const getAllModels = () => fetchApi('models');
export const getModel = (id) => fetchApi('listings', { model_id: id });
export const getStats = () => fetchApi('stats');