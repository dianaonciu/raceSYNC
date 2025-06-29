export {};

declare global {
    interface Window {
        api: {
            getUsers: () => Promise<{ id: number; name: string; email: string }[]>;
        };
    }
}
