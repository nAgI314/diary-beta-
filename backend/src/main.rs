use actix_cors::Cors;
use actix_web::{App, HttpServer, web, http};
use std::collections::HashMap;
use std::env;

use crate::method::get_repo::get_repo_contents;
pub mod method;
mod auth;
mod session;

use auth::{github_login::login, github_callback::callback};
use session::SessionStore;
use auth::me::me;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();

    let session_store = web::Data::new(SessionStore::new(HashMap::new()));
    let frontend_origin = env::var("FRONTEND_ORIGIN")
        .or_else(|_| env::var("FRONTEND_URL"))
        .unwrap_or_else(|_| "http://localhost:5173".to_string());
    let port = env::var("PORT")
        .unwrap_or_else(|_| "8080".to_string())
        .parse::<u16>()
        .expect("PORT must be a number");

    HttpServer::new(move || {
        App::new()
            .app_data(session_store.clone())
            .wrap(
                Cors::default()
                    .allowed_origin(&frontend_origin)
                    .allowed_methods(vec!["GET", "POST", "OPTIONS"])
                    .allowed_headers(vec![
                        http::header::CONTENT_TYPE,
                        http::header::AUTHORIZATION,
                        http::header::ACCEPT,
                        http::header::COOKIE,
                    ])
                    .supports_credentials()
                    .max_age(3600),
            )
            .service(get_repo_contents)
            .service(login)
            .service(callback)
            .service(me)
    })
    .bind(("0.0.0.0", port))?
    .run()
    .await
}