// types found out by reading the moodle source code
// may be incomplete at some points

export default interface CoreUserRepository {
    setUserPreference: (
        name: string,
        value?: string | null | boolean | number,
        userid?: number
    ) => Promise<Proxy>;
}
