import { Populate } from "../../../types";

export const checkIfPopulateExits = (populate: Populate) => {
    return (
        (Array.isArray(populate) && populate.length) ||
        Object.keys(populate).length > 0
    );
};

export const createSlug = async (title = "") => {
    return title
        .trim()
        .toLowerCase()
        .replace(/ /g, "_")
        .replace(/[^\w-]+/g, "");
};
