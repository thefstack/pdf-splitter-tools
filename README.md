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
   - By approximate file size (MB)
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

#### Splitting by File Size (Approximate)

When splitting by file size, the application:
1. Calculates the approximate number of pages per chunk based on the total file size and requested chunk size
2. Uses the page count splitting method with the calculated number of pages per chunk

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

### Code Example: PDF Splitting Function

\`\`\`javascript
// Function to split PDF by pages
const splitPdfByPages = async (pdfBuffer, pagesPerSplit, progressCallback) => {
  const srcPdfDoc = await PDFDocument.load(pdfBuffer)
  const totalPages = srcPdfDoc.getPageCount()
  const splitPdfs = []
  
  // Calculate how many PDFs we'll create
  const numPdfs = Math.ceil(totalPages / pagesPerSplit)
  
  for (let i = 0; i < numPdfs; i++) {
    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create()
    
    // Calculate page range for this split
    const startPage = i * pagesPerSplit
    const endPage = Math.min(startPage + pagesPerSplit, totalPages)
    
    // Copy pages from source PDF to new PDF
    const pagesToCopy = []
    for (let j = startPage; j < endPage; j++) {
      pagesToCopy.push(j)
    }
    
    const copiedPages = await newPdfDoc.copyPages(srcPdfDoc, pagesToCopy)
    
    // Add copied pages to new document
    copiedPages.forEach(page => {
      newPdfDoc.addPage(page)
    })
    
    // Save the new PDF as bytes
    const pdfBytes = await newPdfDoc.save()
    
    // Add to our array of split PDFs
    splitPdfs.push(pdfBytes)
    
    // Update progress
    progressCallback(((i + 1) / numPdfs) * 100)
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
