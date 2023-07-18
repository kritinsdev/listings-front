export const getAllListings = async function () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/listings`);
    const data = await response.json();
    return data;
}

export const getAllModels = async function () {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/models`);
    const data = await response.json();
    return data;
}

export const getModel = async function (id) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/listings?model_id=${id}`);
    const data = await response.json();
    return data;
}