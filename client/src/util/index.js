export const limitCharWithDots = (str, limit) => {
    if (str.length > limit)
        return `${
            str.substring(0, 1).toUpperCase() + str.substring(1, limit)
        }...`;
    else return str.substring(0, 1).toUpperCase() + str.substring(1);
};
