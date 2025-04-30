# PDF Splitter

![PDF Splitter Logo](/public/logo.svg)

A browser-based PDF splitting tool that processes files entirely client-side, ensuring privacy and eliminating file size limitations typically found in server-based solutions.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Technical Implementation](#technical-implementation)
- [Getting Started](#getting-started)
- [Development](#development)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [License](#license)

## 🔍 Overview

PDF Splitter is a web application that allows users to split large PDF files into smaller chunks. Unlike traditional server-based tools, this application processes files entirely in the user's browser, providing several advantages:

- **Privacy**: Files never leave the user's device
- **No size limits**: Can handle very large PDFs (limited only by browser capabilities)
- **No waiting for uploads**: Instant processing without network delays
- **No server costs**: No need for expensive server infrastructure

## ✨ Features

- **Split by file size**: Divide PDFs into chunks of specified size (in MB)
- **Split by page count**: Divide PDFs by specifying the number of pages per chunk
- **Real-time progress tracking**: See the progress as your PDF is being processed
- **Download as ZIP**: Receive all split PDFs in a convenient ZIP package
- **Responsive design**: Works on desktop and mobile devices
- **No installation required**: Works in any modern browser

## 🛠️ How It Works

### User Flow

1. **Upload**: User selects a PDF file from their device
2. **Choose split method**:
   - By file size (MB)
   - By page count
3. **Process**: The application splits the PDF in the browser
4. **Download**: User receives a ZIP file containing all split PDFs

### PDF Splitting Process

The application uses two main approaches to split PDFs:

#### Splitting by Page Count

When splitting by page count, the application:
1. Loads the PDF document
2. Creates new PDF documents for each chunk
3. Copies the specified number of pages to each new document
4. Packages all new PDFs into a ZIP file

#### Splitting by File Size

When splitting by file size, the application:
1. Loads the PDF document
2. Creates a new PDF document
3. Adds pages one by one, checking the file size after each addition
4. When the size approaches the specified limit, it finalizes that document and starts a new one
5. Continues this process until all pages are processed
6. Packages all split PDFs into a ZIP file

This approach ensures that each split PDF stays under the specified size limit while maximizing the number of pages in each part.

## 💻 Technical Implementation

### Technologies Used

- **Next.js**: React framework for the user interface
- **pdf-lib**: JavaScript library for PDF manipulation
- **JSZip**: Library for creating ZIP files in the browser
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vercel Analytics**: For tracking site usage

### Key Components

- **PDF Processing**: Uses pdf-lib to load, manipulate, and create PDF documents
- **Client-side Processing**: All file processing happens in the browser using Web APIs
- **Progress Tracking**: Real-time feedback during processing
- **Responsive UI**: Adapts to different screen sizes

### Code Example: PDF Splitting by Size Function

\`\`\`javascript
const splitPdfBySize = async (pdfBuffer, maxSizeBytes, progressCallback) => {
  const srcPdfDoc = await PDFDocument.load(pdfBuffer)
  const totalPages = srcPdfDoc.getPageCount()
  const splitPdfs = []
  
  let currentDoc = await PDFDocument.create()
  let currentDocPages = 0
  
  // Process each page
  for (let i = 0; i < totalPages; i++) {
    // Copy the current page
    const [currentPage] = await currentDoc.copyPages(srcPdfDoc, [i])
    currentDoc.addPage(currentPage)
    currentDocPages++
    
    // Check if we need to finalize this part
    const isLastPage = i === totalPages - 1
    
    if (!isLastPage) {
      // Save the current document to check its size
      const currentPdfBytes = await currentDoc.save()
      const currentSize = currentPdfBytes.length
      
      // If adding this page made the document exceed the size limit,
      // save the current document and start a new one
      if (currentSize > maxSizeBytes && currentDocPages > 1) {
        // Remove the last page since it made us exceed the limit
        const pagesArray = currentDoc.getPages()
        currentDoc.removePage(pagesArray.length - 1)
        
        // Save this document
        const pdfBytes = await currentDoc.save()
        splitPdfs.push(pdfBytes)
        
        // Start a new document with the page that made us exceed the limit
        currentDoc = await PDFDocument.create()
        const [newPage] = await currentDoc.copyPages(srcPdfDoc, [i])
        currentDoc.addPage(newPage)
        currentDocPages = 1
      }
    } else {
      // If this is the last page, save the current document
      const pdfBytes = await currentDoc.save()
      splitPdfs.push(pdfBytes)
    }
    
    // Update progress
    progressCallback(((i + 1) / totalPages) * 100)
  }
  
  return splitPdfs
}
\`\`\`

## 🚀 Getting Started

### Using the Application

1. Visit [https://pdf-splitter.thefstack.com/](https://pdf-splitter.thefstack.com/)
2. Click "Upload PDF" or drag and drop a PDF file
3. Choose your splitting method:
   - By file size: Enter the desired size in MB
   - By page count: Enter the number of pages per split
4. Click "Split PDF"
5. Wait for processing to complete
6. Download the ZIP file containing your split PDFs

### Running Locally

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/thefstack/pdf-splitter.git
   cd pdf-splitter
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧩 Development

### Project Structure

\`\`\`
pdf-splitter/
├── app/                  # Next.js app directory
│   ├── layout.jsx        # Root layout component
│   ├── page.jsx          # Main page component
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── pdf-splitter.jsx  # Main PDF splitting component
│   ├── footer.jsx        # Footer component
│   └── ui/               # UI components
├── lib/                  # Utility functions
│   └── utils.js          # Helper utilities
├── public/               # Static assets
│   ├── favicon.ico       # Favicon
│   └── logo.svg          # Logo
└── package.json          # Project dependencies
\`\`\`

### Building for Production

\`\`\`bash
npm run build
\`\`\`

## ⚠️ Limitations

- **Browser Memory**: Very large PDFs (multiple GB) might cause memory issues in the browser
- **Processing Power**: Complex PDFs might take longer to process in the browser compared to server-side
- **Browser Compatibility**: Relies on modern browser features
- **No Advanced Features**: Currently lacks advanced PDF manipulation features like merging or editing

## 🔮 Future Improvements

- **PDF Preview**: Add ability to preview PDFs before splitting
- **Merge Functionality**: Allow users to merge multiple PDFs
- **Extract Pages**: Add option to extract specific pages
- **Password Protection**: Add option to password-protect split PDFs
- **PDF Compression**: Add option to compress PDFs while splitting
- **Batch Processing**: Process multiple PDFs at once

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created by [theFstack](https://www.thefstack.com) | [GitHub](https://github.com/thefstack)
