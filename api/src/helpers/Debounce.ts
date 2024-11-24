interface Timeout {
    id: number | string;
    timeout: NodeJS.Timeout;
}

const timeouts: Timeout[] = [];
const timeoutTeste = new Map<number | string, NodeJS.Timeout>()

const clearTimeoutByTicketId = (id: string | number): void => {
    // const timeoutIndex = timeouts.findIndex((timeout) => timeout.id === id);

    if (timeoutTeste.has(id)) {
        clearTimeout(timeoutTeste.get(id));
        timeoutTeste.delete(id);
    }

    // if (timeoutIndex !== -1) {
    //     clearTimeout(timeouts[timeoutIndex].timeout);
    //     timeouts.splice(timeoutIndex, 1);
    // }
};

export const debounceById = (
    func: { (): Promise<void>; (...args: never[]): void },
    wait: number,
    id: number | string
): ((...args: never[]) => void) => {
    return (...args: never[]): void => {
        const later = () => {
            clearTimeoutByTicketId(id);
            func(...args);
        };

        clearTimeoutByTicketId(id);

        const newTimeout = {
            id: id,
            timeout: setTimeout(later, wait),
        };

        timeoutTeste.set(id, newTimeout.timeout)
        // timeouts.push(newTimeout);
    };
};
