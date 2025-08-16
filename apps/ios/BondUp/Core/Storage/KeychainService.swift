//
//  KeychainService.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//


import Foundation
import Security

final class KeychainService {
    static let shared = KeychainService()
    private init() {}

    private let service = "com.bondup.app.internalToken"

    func saveToken(_ token: String) {
        guard let data = token.data(using: .utf8) else { return }

        let query: [String: Any] = [
            kSecClass as String       : kSecClassGenericPassword,
            kSecAttrService as String : service,
            kSecValueData as String   : data
        ]

        SecItemDelete(query as CFDictionary)
        SecItemAdd(query as CFDictionary, nil)
    }

    func loadToken() -> String? {
        let query: [String: Any] = [
            kSecClass as String       : kSecClassGenericPassword,
            kSecAttrService as String : service,
            kSecReturnData as String  : true,
            kSecMatchLimit as String  : kSecMatchLimitOne
        ]

        var item: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &item)

        guard status == errSecSuccess,
              let data = item as? Data,
              let token = String(data: data, encoding: .utf8) else {
            return nil
        }
        return token
    }

    func clearToken() {
        let query: [String: Any] = [
            kSecClass as String       : kSecClassGenericPassword,
            kSecAttrService as String : service
        ]
        SecItemDelete(query as CFDictionary)
    }
}
