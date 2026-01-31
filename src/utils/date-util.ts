export const formatDate = (date: Date | string | number): string => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("pt-BR");
};

export const formatLongDate = (date: Date | string | number): string => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("pt-BR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export const isValidDate = (date: unknown): date is Date => {
    return date instanceof Date && !isNaN(date.getTime());
};
