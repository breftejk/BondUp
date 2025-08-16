import Foundation

struct APIError: Error {
    let message: String
}

struct ErrorResponse: Decodable {
    let error: String
}

final class APIClient {
    static let shared = APIClient()

    private let baseURL = URL(string: "http://172.20.10.14:3000")!
    private let urlSession = URLSession.shared
    private init() {}

    var authToken: String?

    // MARK: - Requests

    func post<T: Decodable>(_ path: String, body: Encodable? = nil) async throws -> T {
        return try await sendRequest(path: path, method: "POST", body: body)
    }

    func get<T: Decodable>(_ path: String) async throws -> T {
        return try await sendRequest(path: path, method: "GET", body: nil)
    }

    func patch<T: Decodable>(_ path: String, body: Encodable? = nil) async throws -> T {
        return try await sendRequest(path: path, method: "PATCH", body: body)
    }
    
    func delete<T: Decodable>(_ path: String) async throws -> T {
        return try await sendRequest(path: path, method: "DELETE", body: nil)
    }

    // MARK: - Private

    private func sendRequest<T: Decodable>(path: String, method: String, body: Encodable? = nil) async throws -> T {
        let url = baseURL.appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.httpMethod = method

        if let token = authToken {
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        if let body = body {
            request.addValue("application/json", forHTTPHeaderField: "Content-Type")
            request.httpBody = try JSONEncoder().encode(body)
        }

        let (data, response) = try await urlSession.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError(message: "Invalid response")
        }

        if 200..<300 ~= httpResponse.statusCode {
            return try JSONDecoder().decode(T.self, from: data)
        } else {
            let errorResponse = try? JSONDecoder().decode(ErrorResponse.self, from: data)
            throw APIError(message: errorResponse?.error ?? "Unknown server error")
        }
    }

    // EmptyBody just to satisfy the generic
    private struct EmptyBody: Encodable {}
}
