//
//  AppCoordinator.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//

import Foundation
import Combine
import SwiftUI

enum AppState {
    case signIn
    case setupProfile
    case main
}

@MainActor
final class AppCoordinator: ObservableObject {
    @Published var state: AppState = .signIn
    @Published var session: UserSession?

    init() {
        Task { await loadSession() }
    }

    func loadSession() async {
            guard let token = KeychainService.shared.loadToken() else {
                self.state = .signIn
                return
            }

            APIClient.shared.authToken = token

            do {
                let me: MeResponse = try await APIClient.shared.get("/me")

                self.session = UserSession(token: token, nickname: me.nickname, userId: me.id)

                self.state = (me.nickname == nil) ? .setupProfile : .main
            } catch {
                KeychainService.shared.clearToken()
                self.state = .signIn
            }
        }
}
