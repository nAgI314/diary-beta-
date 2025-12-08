use actix_cors::Cors;
use actix_web::{App, HttpServer, web, http};
use std::collections::HashMap;

use crate::method::get_repo::get_repo_contents;
pub mod method;
mod auth;
mod session;

use auth::{github_login::login, github_callback::callback};
use session::SessionStore;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let session_store = web::Data::new(SessionStore::new(HashMap::new()));

    HttpServer::new(move || {
        App::new()
            .app_data(session_store.clone())
            .wrap(
                Cors::default()
                    // 本番環境では具体的なオリジンを指定する
                    .allowed_origin("http://localhost:5173")  
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
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}