// types found out by reading the moodle source code
// may be incomplete at some points

export default interface CoreNotification {
    exception: (ex: Error) => Promise<void>;
}
