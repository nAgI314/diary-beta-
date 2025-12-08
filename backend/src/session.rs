use actix_web::HttpRequest;
use std::collections::HashMap;
use std::sync::Mutex;

pub type SessionStore = Mutex<HashMap<String, String>>;
// session_id -> github_access_token

pub fn new_session_store() -> SessionStore {
    Mutex::new(HashMap::new())
}

/// セッションから GitHub トークンを取得
pub fn get_token_from_session(
    req: &HttpRequest,
    store: &SessionStore,
) -> Option<String> {
    let cookie = req.cookie("session_id")?;
    let session_id = cookie.value();

    store.lock().unwrap().get(session_id).cloned()
}

/// セッションにトークンを保存
pub fn save_token_to_session(
    session_id: String,
    token: String,
    store: &SessionStore,
) {
    store.lock().unwrap().insert(session_id, token);
}

/// セッションを削除（ログアウト用）
pub fn remove_session(
    session_id: &str,
    store: &SessionStore,
) -> bool {
    store.lock().unwrap().remove(session_id).is_some()
}