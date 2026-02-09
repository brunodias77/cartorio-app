import { Timestamp } from 'firebase/firestore';

export const formatDate = (date: any): string => {
    if (!date) return '-';

    try {
        let dateObj: Date;

        if (date instanceof Timestamp || (typeof date.toDate === 'function')) {
            dateObj = date.toDate();
        } else if (typeof date === 'string') {
            dateObj = new Date(date);
        } else if (date instanceof Date) {
            dateObj = date;
        } else if (typeof date === 'number') {
            dateObj = new Date(date);
        } else {
            return '-';
        }

        // Validar se é uma data válida
        if (isNaN(dateObj.getTime())) return '-';

        return new Intl.DateTimeFormat('pt-BR').format(dateObj);
    } catch (e) {
        console.error("Erro ao formatar data:", e);
        return '-';
    }
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
