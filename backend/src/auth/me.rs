use actix_web::{get, HttpRequest, HttpResponse};
use serde::Serialize;

#[derive(Serialize)]
struct AuthStatus {
    authenticated: bool,
}

#[get("/auth/me")]
pub async fn me(req: HttpRequest) -> HttpResponse {
    let authenticated = req
        .cookie("sessionid")
        .is_some();

    HttpResponse::Ok().json(AuthStatus { authenticated })
}
