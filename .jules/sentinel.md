# Sentinel's Journal

## 2025-05-26 - [Remediation of PII Leakage in Firestore Error Handling]
**Vulnerability:** The `handleFirestoreError` function was serializing the entire `auth.currentUser` object, including sensitive PII like `email`, `displayName`, and `photoURL`, into an error message that was both logged to the console and thrown to the client.
**Learning:** Even internal error handlers can inadvertently become vectors for PII leakage if they blindly serialize state objects (like user profiles) for "better debugging".
**Prevention:** Always use a strict allow-list for fields included in error metadata. Never pass raw internal error objects or state containing PII directly to the client or generic loggers without sanitization. Use a centralized logger that can handle redaction.
