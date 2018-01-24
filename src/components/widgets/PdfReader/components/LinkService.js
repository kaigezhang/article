import { PDFLinkService } from 'pdfjs-dist/lib/web/pdf_link_service'

export default PDFLinkService

// class LinkService {
//   constructor(onLinkCreate, scrollToAnchor) {
//     this.onLinkCreate = onLinkCreate
//     this.scrollToAnchor = scrollToAnchor
//   }
//   getDestinationHash(dest) {
//     return this.onLinkCreate(dest)
//   }
//
//   navigateTo(dest) {
//     const anchor = Array.isArray(dest) ? `pdfdr:${JSON.stringify(dest)}` : `pdfd:${dest}`
//
//     this.scrollToAnchor(anchor)
//   }
//
//   onFileAttachmentAnnotation({ id, filename, content }) {
//     console.warn('File Attachment are not support yet')
//   }
// }
//
//
// export default LinkService
