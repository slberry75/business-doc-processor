# Business Document Processing Application

Enterprise-level document processing application built with microservices architecture using React, Node.js, and TypeScript.

## Architecture

### Microservices
- **Auth Service** - User authentication & JWT management
- **Document Service** - Document CRUD & metadata management  
- **Processing Service** - PDF processing & OCR text extraction
- **Reporting Service** - Analytics, reports & data export
- **API Gateway** - Request routing & authentication middleware

### Technology Stack
- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **Testing**: Jest + Supertest
- **Deployment**: Docker + Docker Compose
- **Authentication**: JWT tokens

## Features
- PDF invoice/receipt upload and processing
- Automated data extraction (vendor, amount, date, line items)
- Search and filter functionality
- Monthly spending reports and vendor analysis
- Excel/CSV export capabilities
- Secure user authentication

## Getting Started

### Prerequisites
- Node.js 18+
- Docker Desktop
- PostgreSQL (or use Docker)

### Installation
```bash
# Clone the repository
git clone https://github.com/slberry75/business-doc-processor.git
cd business-doc-processor
1. Copy `.env.template` to `.env`
2. Fill in your actual database credentials
# Install all dependencies
npm run install:all

# Start development environment
npm run dev