import imagekit from "@/utils/imagekit"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fileDetailsCache: { [key: string]: any } = {};

setInterval(() => {
    for (const key in fileDetailsCache) {
        delete fileDetailsCache[key];
    }
}, 60000);

export const bringImageUrlFromFileId = async (fileId: string): Promise<string | null> => {
    if (!fileDetailsCache[fileId]) {
        fileDetailsCache[fileId] = await imagekit.getFileDetails(fileId);
    }

    const fileDetails = fileDetailsCache[fileId];

    if (fileDetails.fileType === "non-image") {
        await removeImageFromImagekit(fileId);
        return null;
    } else {
        const parts = fileDetails.url.split("/syedfaizan/");
        return `${parts[0]}/syedfaizan/tr:h-400,w-400/${parts[1]}`;
    }
}

export const bringDpUrlFromFileId = async (fileId: string): Promise<string | null> => {
    const fileDetails = await imagekit.getFileDetails(fileId);
    const parts = fileDetails.url.split("/syedfaizan/");
    return `${parts[0]}/syedfaizan/tr:h-200,w-200/${parts[1]}`;
}

export const removeImageFromImagekit = async (fileId: string) => {
    try {
        await imagekit.deleteFile(fileId)
        return { success: true }
    } catch (error) {
        return { error }
    }
}