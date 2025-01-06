// types found out by reading the moodle source code
// may be incomplete at some points

export default interface CorePubsub {
    subscribe: (eventName: string, callback: (data: unknown) => void) => void;
    unsubscribe: (eventName: string, callback: (dat: unknown) => void) => void;
    publish: (eventName: string, data?: unknown) => void;
}
