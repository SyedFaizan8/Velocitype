
export const addTransformationToImageKitURL = (imageURL: string, transformation: string): string => {
    const url = new URL(imageURL);
    const parts = url.pathname.split('/');
    parts.splice(2, 0, transformation);

    return `${url.origin}${parts.join('/')}`;
}