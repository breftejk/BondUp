//
//  NicknameSetupViewModel.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//

import Foundation
import Combine

@MainActor
final class NicknameSetupViewModel: ObservableObject {
    @Published var nickname: String = ""
    @Published var isLoading = false
    @Published var errorMessage: String?

    let coordinator: AppCoordinator

    init(coordinator: AppCoordinator) {
        self.coordinator = coordinator
    }

    func submit() async {
        guard !nickname.isEmpty else {
            errorMessage = "Nickname cannot be empty"
            return
        }

        do {
            isLoading = true
            try await ProfileService.shared.setNickname(nickname)
            isLoading = false

            coordinator.session?.nickname = nickname
            coordinator.state = .main
        } catch {
            isLoading = false
            errorMessage = error.localizedDescription
        }
    }
}
