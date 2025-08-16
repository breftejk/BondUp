//
//  UserSession.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//

import Foundation

struct UserSession: Codable {
    let token: String
    var nickname: String?
    let userId: String
}
