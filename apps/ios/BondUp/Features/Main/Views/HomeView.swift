//
//  HomeView.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//


import SwiftUI

struct HomeView: View {
    @StateObject private var viewModel: HomeViewModel

    init(coordinator: AppCoordinator) {
        _viewModel = StateObject(wrappedValue: HomeViewModel(coordinator: coordinator))
    }

    var body: some View {
        VStack(spacing: 24) {
            Text("Welcome, \(viewModel.displayName)")
                .font(.title.bold())

            // TODO: add buttons (Add friend, Send gesture, etc.)
        }
        .padding()
    }
}

#Preview {
    HomeView(coordinator: AppCoordinator())
}
