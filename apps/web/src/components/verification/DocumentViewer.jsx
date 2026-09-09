function DocumentViewer({
  title = 'Document Viewer',
  documentUrl,
  documentName = 'Document',
}) {
  return (
    <div className="document-viewer">
      <div className="document-viewer-header">
        <div>
          <h3>{title}</h3>
          <p>{documentName}</p>
        </div>
      </div>

      <div className="document-viewer-content">
        {documentUrl ? (
          <iframe
            src={documentUrl}
            title={documentName}
            width="100%"
            height="500"
          ></iframe>
        ) : (
          <div className="document-empty">
            <span>📄</span>
            <p>No document selected.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DocumentViewer
