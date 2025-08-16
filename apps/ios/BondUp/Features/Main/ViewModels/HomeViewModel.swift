//
//  HomeViewModel.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//


import Foundation
import Combine

@MainActor
final class HomeViewModel: ObservableObject {
    @Published var isLoading = false
    @Published var displayName: String = ""

    let coordinator: AppCoordinator

    init(coordinator: AppCoordinator) {
        self.coordinator = coordinator
        load()
    }

    func load() {
        displayName = coordinator.session?.nickname ?? ""
    }
}
