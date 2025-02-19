import axios from "axios";
import { baseUrl } from "./constants";

export const profiles = async () => {
    const response = await axios.get(`${baseUrl}/api/sitemapProfiles`);
    return response.data.data;
}