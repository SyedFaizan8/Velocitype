import imagekit from "@/utils/imagekit";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileDetailsCache: { [key: string]: any } = {};

setInterval(() => {
    Object.keys(fileDetailsCache).forEach(key => delete fileDetailsCache[key]);
}, 60000);

const getFileDetails = async (fileId: string) => {
    if (!fileDetailsCache[fileId]) {
        fileDetailsCache[fileId] = await imagekit.getFileDetails(fileId);
    }
    return fileDetailsCache[fileId];
};

export const bringImageUrlFromFileId = async (fileId: string): Promise<string | null> => {
    const fileDetails = await getFileDetails(fileId);

    if (fileDetails.fileType === "non-image") {
        await removeImageFromImagekit(fileId);
        return null;
    } else {
        const [baseUrl, path] = fileDetails.url.split("/syedfaizan/");
        return `${baseUrl}/syedfaizan/tr:h-400,w-400/${path}`;
    }
};

export const bringDpUrlFromFileId = async (fileId: string): Promise<string | null> => {
    const fileDetails = await getFileDetails(fileId);
    const [baseUrl, path] = fileDetails.url.split("/syedfaizan/");
    return `${baseUrl}/syedfaizan/tr:h-200,w-200/${path}`;
};

export const removeImageFromImagekit = async (fileId: string) => {
    try {
        await imagekit.deleteFile(fileId);
        return { success: true };
    } catch (error) {
        return { error };
    }
};