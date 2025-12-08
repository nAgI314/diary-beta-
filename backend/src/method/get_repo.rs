use actix_web::{HttpRequest, HttpResponse, Responder, get, web};
use reqwest;
use serde::Deserialize;

use crate::session::{SessionStore, get_token_from_session};

#[derive(Deserialize)]
struct RepoQuery {
    owner: String,
    repo: String,
    path: Option<String>,
}

#[get("/repo")]
pub async fn get_repo_contents(
    req: HttpRequest,
    query: web::Query<RepoQuery>,
    store: web::Data<SessionStore>,
) -> impl Responder {
    // セッションからGitHubトークンを取得
    let github_token = match get_token_from_session(&req, &store) {
        Some(token) => token,
        None => {
            return HttpResponse::Unauthorized()
                .body("not logged in or invalid session");
        }
    };
    
    // GitHub APIのURLを構築
    let url = build_github_api_url(&query.owner, &query.repo, query.path.as_deref());
    
    // GitHub APIにリクエスト
    match fetch_github_contents(&url, &github_token).await {
        Ok(data) => HttpResponse::Ok().json(data),
        Err(err) => err,
    }
}

/// GitHub API の URL を構築
fn build_github_api_url(owner: &str, repo: &str, path: Option<&str>) -> String {
    let path = path.unwrap_or("");
    
    if path.is_empty() {
        format!("https://api.github.com/repos/{}/{}/contents", owner, repo)
    } else {
        format!("https://api.github.com/repos/{}/{}/contents/{}", owner, repo, path)
    }
}

/// GitHub API からコンテンツを取得
async fn fetch_github_contents(
    url: &str,
    github_token: &str,
) -> Result<serde_json::Value, HttpResponse> {
    let client = reqwest::Client::new();
    
    let response = client
        .get(url)
        .header("User-Agent", "my-app")
        .header("Authorization", format!("Bearer {}", github_token))
        .header("Accept", "application/vnd.github.v3+json")
        .send()
        .await
        .map_err(|err| {
            HttpResponse::InternalServerError()
                .body(format!("Request error: {}", err))
        })?;
    
    let status = response.status();
    
    if !status.is_success() {
        let error_text = response.text().await
            .unwrap_or_else(|_| "Unknown error".to_string());
        
        return Err(HttpResponse::BadGateway()
            .body(format!("GitHub API error ({}): {}", status, error_text)));
    }
    
    response.json::<serde_json::Value>()
        .await
        .map_err(|err| {
            HttpResponse::InternalServerError()
                .body(format!("Failed to parse GitHub response: {}", err))
        })
}