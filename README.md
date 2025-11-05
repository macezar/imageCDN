# Image CDN Microservice

A modern, full-stack image management microservice built with Node.js and React, powered by Cloudinary for cloud-based image storage and manipulation.

## Features

### Backend
- **Image Upload**: Upload images with automatic optimization using Sharp
- **Image Retrieval**: Fetch images with customizable transformations
- **Image Deletion**: Delete individual or multiple images
- **Image Listing**: Browse all images with pagination
- **Image Search**: Search images using Cloudinary's advanced query syntax
- **Usage Statistics**: Monitor storage, bandwidth, and transformation usage
- **Health Monitoring**: Built-in health check endpoints
- **Security**: Rate limiting, CORS, Helmet.js for security headers
- **Validation**: Comprehensive input validation with Joi
- **Error Handling**: Centralized error handling with meaningful messages

### Frontend
- **Drag & Drop Upload**: Intuitive file upload with react-dropzone
- **Image Gallery**: Responsive grid layout with lazy loading
- **Image Preview**: Full-size modal view with detailed metadata
- **Image Management**: Delete images with confirmation
- **Statistics Dashboard**: Visual representation of Cloudinary usage
- **Download Images**: Download images directly from the gallery
- **Real-time Feedback**: Toast notifications for all operations
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** + **Express**: Server framework
- **Cloudinary SDK**: Cloud-based image storage and manipulation
- **Sharp**: Image optimization before upload
- **express-fileupload**: File upload handling
- **Joi**: Request validation
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Morgan**: Request logging
- **express-rate-limit**: API rate limiting

### Frontend
- **React 18**: UI library
- **Vite**: Build tool and dev server
- **Axios**: HTTP client
- **react-dropzone**: File upload component
- **react-hot-toast**: Notification system
- **lucide-react**: Icon library

## Project Structure

```
imageCDN/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── app.config.js          # App configuration
│   │   │   └── cloudinary.config.js   # Cloudinary setup
│   │   ├── middleware/
│   │   │   ├── error.middleware.js    # Error handlers
│   │   │   └── validation.middleware.js # Request validation
│   │   ├── routes/
│   │   │   ├── health.routes.js       # Health check routes
│   │   │   └── image.routes.js        # Image CRUD routes
│   │   ├── services/
│   │   │   └── image.service.js       # Business logic
│   │   └── server.js                  # Express app setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx             # App header
│   │   │   ├── ImageUpload.jsx        # Upload component
│   │   │   ├── ImageGallery.jsx       # Gallery view
│   │   │   └── Stats.jsx              # Statistics dashboard
│   │   ├── services/
│   │   │   └── api.js                 # API client
│   │   ├── App.jsx                    # Main app component
│   │   ├── main.jsx                   # React entry point
│   │   └── index.css                  # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── .env.example                       # Environment template
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Cloudinary account ([Sign up for free](https://cloudinary.com/users/register/free))

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd imageCDN
```

2. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` and add your Cloudinary credentials:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FORMATS=jpg,jpeg,png,gif,webp,svg
```

3. **Install backend dependencies**

```bash
cd backend
npm install
```

4. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

### Development

Run both backend and frontend in development mode:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

- Backend API: http://localhost:5000
- Frontend: http://localhost:3000
- Health Check: http://localhost:5000/api/health

### Production

1. **Build the frontend:**

```bash
cd frontend
npm run build
```

2. **Start the backend in production mode:**

```bash
cd backend
NODE_ENV=production npm start
```

The backend will serve the built frontend from `frontend/dist`.

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Health Check
```http
GET /health
```
Check API and Cloudinary connection status.

#### Upload Image
```http
POST /images/upload
Content-Type: multipart/form-data

Body:
- image: File (required)
- folder: String (optional)
- tags: String[] (optional)
- optimize: Boolean (optional, default: true)
```

#### Get Image
```http
GET /images/:publicId
```
Get image details by public ID.

#### Delete Image
```http
DELETE /images/:publicId
```
Delete an image by public ID.

#### List Images
```http
GET /images?maxResults=30&nextCursor=&prefix=
```
List all images with pagination.

**Query Parameters:**
- `maxResults`: Number (1-500, default: 30)
- `nextCursor`: String (for pagination)
- `prefix`: String (filter by folder)

#### Search Images
```http
GET /images/search/query?expression=folder:uploads&maxResults=30
```
Search images using Cloudinary query syntax.

**Query Parameters:**
- `expression`: String (required) - Cloudinary search expression
- `maxResults`: Number (1-500, default: 30)
- `nextCursor`: String (for pagination)

**Example expressions:**
- `folder:uploads` - Images in uploads folder
- `tags=featured` - Images tagged as featured
- `resource_type:image AND format:png` - PNG images only

#### Bulk Delete
```http
POST /images/bulk-delete
Content-Type: application/json

Body:
{
  "publicIds": ["image1", "image2", ...]
}
```

#### Get Statistics
```http
GET /images/stats/usage
```
Get Cloudinary usage statistics (storage, bandwidth, transformations, credits).

## Best Practices Implemented

### Security
- **Helmet.js**: Security headers
- **CORS**: Configurable allowed origins
- **Rate Limiting**: Prevent abuse (100 requests per 15 minutes)
- **Input Validation**: All inputs validated with Joi
- **File Type Validation**: Only allowed image formats
- **File Size Limits**: Configurable maximum file size

### Performance
- **Image Optimization**: Automatic compression with Sharp
- **Lazy Loading**: Images load as user scrolls
- **Pagination**: Efficient data loading
- **Caching**: Cloudinary CDN caching
- **Compression**: Response compression

### Code Quality
- **Error Handling**: Centralized error middleware
- **Async/Await**: Modern async patterns
- **Modular Structure**: Separation of concerns
- **Environment Variables**: Configuration via .env
- **Logging**: Request logging with Morgan

### User Experience
- **Drag & Drop**: Intuitive file upload
- **Toast Notifications**: Real-time feedback
- **Loading States**: Visual feedback for operations
- **Responsive Design**: Works on all devices
- **Progressive Enhancement**: Graceful degradation

## Configuration

### Backend Configuration

Edit `backend/src/config/app.config.js` or use environment variables:

```javascript
{
  port: 5000,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100
  }
}
```

### Image Optimization

Images are automatically optimized before upload:
- **Max dimensions**: 4096px on longest side
- **JPEG quality**: 85%, progressive encoding
- **PNG quality**: 85%, compression level 9
- **WebP quality**: 85%
- **SVG**: No optimization (preserved as-is)

You can disable optimization by setting `optimize: false` during upload.

## Cloudinary Features

This microservice leverages Cloudinary's powerful features:

- **CDN Delivery**: Global CDN for fast image delivery
- **Auto Format**: Automatic format selection (WebP, AVIF)
- **Auto Quality**: Intelligent quality optimization
- **Transformations**: On-the-fly image transformations
- **Storage**: Secure cloud storage
- **Analytics**: Usage and performance metrics

## Troubleshooting

### Cloudinary Connection Failed
- Verify your credentials in `.env`
- Check if your Cloudinary account is active
- Ensure you have internet connectivity

### CORS Errors
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`
- Restart the backend server

### Upload Fails
- Check file size (max 10MB by default)
- Verify file format is allowed
- Check Cloudinary storage quota

### Images Not Loading
- Verify Cloudinary credentials
- Check browser console for errors
- Ensure images exist in Cloudinary

## License

MIT

## Support

For issues and questions:
- Create an issue in the repository
- Check [Cloudinary Documentation](https://cloudinary.com/documentation)
- Review the API logs for error details

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

Built using Node.js, React, and Cloudinary