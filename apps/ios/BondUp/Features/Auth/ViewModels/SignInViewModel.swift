//
//  SignInViewModel.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//


import Foundation
import Combine
import AuthenticationServices

@MainActor
final class SignInViewModel: NSObject, ObservableObject {
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    let coordinator: AppCoordinator

    init(coordinator: AppCoordinator) {
        self.coordinator = coordinator
    }

    func handleAppleSignIn(result: Result<ASAuthorization, Error>) async {
        switch result {
        case .success(let authResult):
            guard
                let credential = authResult.credential as? ASAuthorizationAppleIDCredential,
                let identityTokenData = credential.identityToken,
                let idToken = String(data: identityTokenData, encoding: .utf8)
            else {
                self.errorMessage = "Invalid token"
                return
            }

            do {
                isLoading = true
                let response = try await AuthService.shared.signInWithApple(idToken: idToken)
                if response.requiresProfile {
                    coordinator.state = .setupProfile
                }
                isLoading = false
            } catch {
                errorMessage = error.localizedDescription
                isLoading = false
            }

        case .failure(let error):
            self.errorMessage = error.localizedDescription
        }
    }
}
