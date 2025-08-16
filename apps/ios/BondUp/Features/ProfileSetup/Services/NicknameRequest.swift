//
//  NicknameRequest.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//

import Foundation

struct NicknameRequest: Encodable {
    let nickname: String
}

final class ProfileService {
    static let shared = ProfileService()
    private init() {}

    func setNickname(_ nickname: String) async throws {
        let body = NicknameRequest(nickname: nickname)
        let _: EmptyResponse = try await APIClient.shared.patch("/me/nickname", body: body)
    }
}

struct EmptyResponse: Decodable {}
