
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use dotenvy::dotenv;
use serde::{Deserialize, Serialize};
use reqwest;

#[derive(Deserialize)]
struct RepoQuery {
    owner: String,
    repo: String,
    path: Option<String>,
}

#[derive(Serialize, Deserialize)]
struct GitHubItem {
    name: String,
    path: String,
    sha: String,
    #[serde(rename = "type")]
    kind: String,
    download_url: Option<String>,
}

#[get("/repo")]
async fn get_repo_contents(query: web::Query<RepoQuery>) -> impl Responder {
    let owner = &query.owner;
    let repo = &query.repo;
    let path = query.path.clone().unwrap_or_else(|| "".to_string());

    dotenv().ok();
    
    let github_token = std::env::var("GITHUB_TOKEN")
        .expect("GITHUB_TOKEN must be set");

    let url = format!(
        "https://api.github.com/repos/{}/{}/contents/{}/",
        owner, repo, path
    );

    let client = reqwest::Client::new();
    let res = client
        .get(url)
        .header("User-Agent", "Actix-Web")
        .bearer_auth(github_token)
        .send()
        .await;

    if let Err(err) = res {
        return HttpResponse::InternalServerError()
            .body(format!("Request error: {}", err));
    }

    let response = res.unwrap().text().await;
    
    // let response = res.unwrap().json::<serde_json::Value>().await;

    match response {
        Ok(json) => HttpResponse::Ok().json(serde_json::json!(json)),
        Err(err) => HttpResponse::InternalServerError()
            .body(format!("Failed to parse GitHub response: {}", err)),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(get_repo_contents))
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}
