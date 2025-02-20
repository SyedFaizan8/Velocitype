import { Dispatch, SetStateAction, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import axios from "axios";

interface Availability {
    usernameAvailability: boolean | null;
    emailAvailability: boolean | null;
    checkUsernameAvailability: (username: string) => void;
    checkEmailAvailability: (email: string) => void;
    setUsernameAvailability?: Dispatch<SetStateAction<boolean | null>>;
    setEmailAvailability?: Dispatch<SetStateAction<boolean | null>>;
}

export const useAvailability = (): Availability => {
    const [usernameAvailability, setUsernameAvailability] = useState<boolean | null>(null);
    const [emailAvailability, setEmailAvailability] = useState<boolean | null>(null);

    const checkUsernameAvailability = useDebouncedCallback(async (username: string) => {
        try {
            const { data } = await axios.get(`/api/check-username`, {
                params: { username },
            });
            setUsernameAvailability(data.data.available);
        } catch {
            setUsernameAvailability(false);
        }
    }, 500);

    const checkEmailAvailability = useDebouncedCallback(async (email: string) => {
        try {
            const { data } = await axios.get(`/api/check-email`, {
                params: { email },
            });
            setEmailAvailability(data.data.available);
        } catch {
            setEmailAvailability(false);
        }
    }, 500);

    return {
        usernameAvailability,
        emailAvailability,
        checkUsernameAvailability,
        checkEmailAvailability,
        setUsernameAvailability,
        setEmailAvailability
    };
};
