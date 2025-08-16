//
//  BondUpApp.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/15/25.
//

import SwiftUI

@main
struct BondUpApp: App {
    @StateObject private var coordinator = AppCoordinator()

    var body: some Scene {
        WindowGroup {
            switch coordinator.state {
            case .initializing:
                VStack {
                        Image("AppIcon")
                            .resizable()
                            .scaledToFit()
                            .frame(width: 120, height: 120)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                    .background(Color(.systemBackground))
                
            case .signIn:
                SignInView(coordinator: coordinator)
                    .environmentObject(coordinator)

            case .setupProfile:
                NicknameSetupView(coordinator: coordinator)

            case .main:
                Text("Main App View")
                    .environmentObject(coordinator)
            }
        }
    }
}
