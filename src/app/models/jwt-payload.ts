export interface JwtPayload {
    sub: string;            // User Id
    given_name: string;     // First Name
    family_name: string;    // Last Name
    email: string;
    role: string;
    WorkerId?: string;      // Optional Worker Id
    jti: string;            // Jwt Id
    exp: number;            // Expiry (Unix timestamp)
    iat: number;            // Issued At (Unix timestamp)
}
