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
    case initializing
    case signIn
    case setupProfile
    case main
}

@MainActor
final class AppCoordinator: ObservableObject {
    @Published var state: AppState = .initializing
    @Published var session: UserSession?
    @Published var pendingInviteCode: String?
    @Published var inviteErrorMessage: String?
    @Published var inviteSuccessMessage: String?

    init() {
        Task { await loadSession() }
    }
    
    func handleIncomingInvite(code: String) async {
        do {
            let _: EmptyResponse = try await APIClient.shared.post("/bond/connect/\(code)")
            inviteSuccessMessage = "Successfully invited user to Bond!"
        } catch let apiError as APIError {
            inviteErrorMessage = apiError.message
        } catch {
            inviteErrorMessage = error.localizedDescription
        }
    }
        
    func loadSession() async {
        if let token = KeychainService.shared.loadToken() {
            APIClient.shared.authToken = token
            do {
                let me: MeResponse = try await APIClient.shared.get("/me")
                self.session = UserSession(token: token, nickname: me.nickname, userId: me.id)
                self.state = (me.nickname == nil) ? .setupProfile : .main
            } catch {
                KeychainService.shared.clearToken()
                self.state = .signIn
            }
        } else {
            self.state = .signIn
        }
    }
}
