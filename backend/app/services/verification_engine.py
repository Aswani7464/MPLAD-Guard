def verify_document(
    document_name: str,
    verified: bool,
    remarks: str | None = None
) -> dict:

    if verified:
        status = "verified"
    else:
        status = "pending"

    return {
        "document_name": document_name,
        "verification_status": status,
        "verified": verified,
        "remarks": remarks
    }
