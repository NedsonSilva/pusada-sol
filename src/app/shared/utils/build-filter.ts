
interface FilterConfig {
    stringifyArray?: boolean;
}

export const buildFilter = <T = any>(filter: T, config?: FilterConfig) => {
    const obj = filter || ({} as any);
    const params: string[] = [];
    for (const key in filter) {
        if (key.startsWith('_')) {
            continue;
        }
        if (
            obj.hasOwnProperty(key) &&
            obj[key] !== null &&
            obj[key] !== undefined
        ) {
            const value = obj[key];

            if (Array.isArray(value) && config?.stringifyArray) {
                obj[key] = JSON.stringify(value);
            }

            params.push(`${key}=${value}`);
        }
    }
    return params?.join('&');
};
