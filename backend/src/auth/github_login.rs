use actix_web::{HttpResponse, get};
use dotenvy::dotenv;

#[get("/auth/github/login")]
pub async fn login() -> HttpResponse {
    dotenv().ok();
    let client_id = std::env::var("GITHUB_CLIENT_ID").unwrap();

    let redirect = format!(
        "https://github.com/login/oauth/authorize?client_id={}&scope=repo",
        client_id
    );

    HttpResponse::Found()
        .append_header(("Location", redirect))
        .finish()
}
