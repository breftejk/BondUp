//
//  SignInView.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//


import SwiftUI
import AuthenticationServices

struct SignInView: View {
    @StateObject private var viewModel: SignInViewModel
    
    init(coordinator: AppCoordinator) {
        _viewModel = StateObject(wrappedValue: SignInViewModel(coordinator: coordinator))
    }

    var body: some View {
        VStack(spacing: 24) {
            SignInWithAppleButton(
                .signIn,
                onRequest: { request in
                    request.requestedScopes = [.fullName, .email]
                },
                onCompletion: { result in
                    Task {
                        await viewModel.handleAppleSignIn(result: result)
                    }
                }
            )
            .frame(height: 50)

            if viewModel.isLoading {
                ProgressView()
            }

            if let error = viewModel.errorMessage {
                Text(error)
                    .foregroundColor(.red)
            }
        }
        .padding(32)
    }
}

