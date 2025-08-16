//
//  AuthResponse.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//


import Foundation

struct AuthResponse: Decodable {
    let token: String
    let requiresProfile: Bool
}

final class AuthService {
    static let shared = AuthService()
    private init() {}

    func signInWithApple(idToken: String) async throws -> AuthResponse {
        let requestBody = ["idToken": idToken]

        let response: AuthResponse = try await APIClient.shared.post(
            "/auth/apple",
            body: requestBody
        )

        KeychainService.shared.saveToken(response.token)

        APIClient.shared.authToken = response.token
        
        return response
    }
}
