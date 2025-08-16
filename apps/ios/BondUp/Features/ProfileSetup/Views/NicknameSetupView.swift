//
//  NicknameSetupView.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//


import SwiftUI

struct NicknameSetupView: View {
    @StateObject private var viewModel: NicknameSetupViewModel

    init(coordinator: AppCoordinator) {
        _viewModel = StateObject(wrappedValue: NicknameSetupViewModel(coordinator: coordinator))
    }

    var body: some View {
        VStack(spacing: 24) {
            TextField("Enter nickname", text: $viewModel.nickname)
                .textFieldStyle(.roundedBorder)

            Button("Continue") {
                Task { await viewModel.submit() }
            }
            .buttonStyle(.borderedProminent)
            
            if viewModel.isLoading {
                ProgressView()
            }

            if let error = viewModel.errorMessage {
                Text(error).foregroundColor(.red)
            }
        }
        .padding(32)
    }
}

#Preview {
    NicknameSetupView(coordinator: AppCoordinator())
}
