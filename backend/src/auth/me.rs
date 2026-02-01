use actix_web::{HttpRequest, HttpResponse, get, web};
use serde::Serialize;

use crate::session::{self, SessionStore, is_session};

#[derive(Serialize)]
struct AuthStatus {
    authenticated: bool,
}

#[get("/auth/me")]
pub async fn me(
    req: HttpRequest,
    session_store: web::Data<SessionStore>,
) -> HttpResponse {
    let session_id = match req.cookie("session_id") {
        Some(cookie) => cookie.value().to_string(),
        None => {
            return HttpResponse::Ok().json(AuthStatus {
                authenticated: false,
            });
        }
    };
        
    let authenticated  = is_session(session_id, &session_store);
    HttpResponse::Ok().json(AuthStatus { authenticated })
}
