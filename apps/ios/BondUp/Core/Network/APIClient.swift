//
//  APIClient.swift
//  BondUp
//
//  Created by Marcin Kondrat on 8/16/25.
//


import Foundation

final class APIClient {
    static let shared = APIClient()

    private let baseURL = URL(string: "http://localhost:3000")!
    private let urlSession = URLSession.shared
    private init() {}

    var authToken: String?

    // MARK: - Requests

    func post<T: Decodable>(_ path: String, body: Encodable) async throws -> T {
        let url = baseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        if let token = authToken {
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        request.httpBody = try JSONEncoder().encode(body)

        let (data, response) = try await urlSession.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse,
              200..<300 ~= httpResponse.statusCode else {
            throw URLError(.badServerResponse)
        }
        return try JSONDecoder().decode(T.self, from: data)
    }
    
    func get<T: Decodable>(_ path: String) async throws -> T {
        let url = baseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.httpMethod = "GET"

        if let token = authToken {
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, response) = try await urlSession.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse,
              200..<300 ~= httpResponse.statusCode else {
            throw URLError(.badServerResponse)
        }
        return try JSONDecoder().decode(T.self, from: data)
    }
    
    func patch<T: Decodable>(_ path: String, body: Encodable) async throws -> T {
        let url = baseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        if let token = authToken {
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        request.httpBody = try JSONEncoder().encode(body)

        let (data, response) = try await urlSession.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse,
              200..<300 ~= httpResponse.statusCode else {
            throw URLError(.badServerResponse)
        }
        return try JSONDecoder().decode(T.self, from: data)
    }
}
