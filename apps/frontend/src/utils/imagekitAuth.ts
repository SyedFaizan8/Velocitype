import axios from "axios";

export const authenticator = async () => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/imagekit-auth`, { withCredentials: true });
        if (response.status !== 200) throw new Error(`Request failed with status: ${response.status}`)

        const { signature, expire, token } = response.data.data;
        return { signature, expire, token };
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data || error.message);
            throw new Error(`Authentication request failed: ${error.response?.data?.message || error.message}`);
        } else {
            console.error("General error:", error);
            throw new Error("Authentication request failed");
        }
    }
};