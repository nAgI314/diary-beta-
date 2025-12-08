use actix_web::{HttpResponse, cookie::{Cookie, SameSite}, get, web};
use dotenvy::dotenv;
use reqwest::Client;
use serde::Deserialize;
use uuid::Uuid;

use crate::session::SessionStore;

#[derive(Deserialize)]
struct GithubTokenResponse {
    access_token: String,
    token_type: String,
    scope: String,
}

#[derive(Deserialize)]
pub struct OAuthCallback {
    pub code: String,
}

#[get("/auth/github/callback")]
pub async fn callback(
    store: web::Data<SessionStore>,
    query: web::Query<OAuthCallback>,
) -> HttpResponse {
    dotenv().ok();
    let client_id = std::env::var("GITHUB_CLIENT_ID").unwrap();
    let client_secret = std::env::var("GITHUB_CLIENT_SECRET").unwrap();

    let client = Client::new();

    let res = client
        .post("https://github.com/login/oauth/access_token")
        .header("Accept", "application/json")
        .json(&serde_json::json!({
            "client_id": client_id,
            "client_secret": client_secret,
            "code": query.code,
        }))
        .send()
        .await
        .expect("github token fetch failed");

    let token: GithubTokenResponse = res.json().await.expect("invalid github token response");

    // println!("ACCESS TOKEN: {}", token.access_token);

    // session_id 発行
    let session_id = Uuid::new_v4().to_string();

    // メモリに保存
    {
        let mut sessions = store.lock().unwrap();
        sessions.insert(session_id.clone(), token.access_token);
    }
    
    // println!("SESSION_ID: {}",session_id);
    // cookie 発行
    let cookie = Cookie::build("session_id", session_id)
        .http_only(true)
        .same_site(SameSite::Lax)
        .path("/")
        .finish();


    HttpResponse::Found()
        .append_header(("Location", "http://localhost:5173"))
        .cookie(cookie)
        .finish()
}
