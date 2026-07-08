import api from "./axios";

export const getListings = () => api.get("/listings");
export const getListingById = (id) => api.get(`/listings/${id}`);
export const createListing = (data) => api.post("/listings", data);
export const updateListing = (id, data) => api.put(`/listings/${id}`, data);
export const deleteListing = (id) => api.delete(`/listings/${id}`);