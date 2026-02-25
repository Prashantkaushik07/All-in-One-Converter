# All-in-One Converter

All-in-One Converter is a versatile full-stack application built with React and Node.js, designed to help you seamlessly manipulate and manage your files. Whether you need to convert, compress, edit, or batch-process files, this tool provides an intuitive, secure, and efficient interface to get the job done.

## Table of Contents

* [Features](#features)
* [Demo](#demo)
* [Tech Stack](#tech-stack)
* [Getting Started](#getting-started)

  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [API](#api)
* [Available Scripts](#available-scripts)
* [Folder Structure](#folder-structure)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

## Features

* **File Conversion:** Convert between common formats (PDF, DOCX, JPG, PNG, etc.)
* **Compression & Decompression:** Zip and unzip files with ease.
* **File Editing:** Crop, resize, or rotate images; remove metadata.
* **Batch Processing:** Perform operations on multiple files in a single action.
* **Secure Handling:** Files are processed server-side and cleaned up automatically.
* **Responsive UI:** Built with React for a smooth, responsive experience.

## Demo

Check out the live demo here:

[Live Project](https://your-live-url.com)

> *Replace the above URL with your deployed application URL.*

## Tech Stack

* **Frontend:** React, React Router, Axios
* **Backend:** Node.js, Express, Multer (for file uploads)
* **Styling:** CSS Modules / SCSS
* **Bundler:** Create React App (Webpack, Babel)

## Getting Started

### Prerequisites

* Node.js v14 or higher
* npm (or Yarn)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Prashantkaushik07/All-in-One-Converter.git
   cd All-in-One-Converter
   ```

2. **Install dependencies**

   ```bash
   # In the root directory
   npm install

   # If there is a backend service:
   cd backend
   npm install
   cd ..
   ```

3. **Environment Variables**

   Create a `.env` file in the `backend/` folder and add:

   ```env
   PORT=5000
   UPLOAD_DIR=uploads/
   ```

4. **Run the application**

   ```bash
   # Start backend server
   cd backend && npm start

   # In a separate terminal, start frontend
   npm start
   ```

   The frontend will be available at `http://localhost:3000` and the backend at `http://localhost:5000`.

## Usage

* Navigate to the web interface.
* Upload one or multiple files.
* Select desired operation (convert, compress, edit).
* Configure options (format, quality, dimensions).
* Click **Start** and download your processed files.

## API

The backend exposes the following endpoints:

| Method | Endpoint          | Description                       |
| ------ | ----------------- | --------------------------------- |
| POST   | `/api/upload`     | Upload files for processing       |
| POST   | `/api/convert`    | Convert uploaded files            |
| POST   | `/api/compress`   | Compress or decompress files      |
| POST   | `/api/edit`       | Perform edits (crop, resize)      |
| GET    | `/api/status/:id` | Check processing status by job ID |

> *Refer to the JSDoc comments in `backend/` for detailed request/response schemas.*

## Available Scripts

In the project directory, you can run:

```bash
npm start       # Starts the React development server
npm test        # Runs frontend tests in watch mode
npm run build   # Bundles the app for production
npm run eject   # Ejects CRA configuration (one-way)
```

And for the backend:

```bash
cd backend
npm start       # Starts the Express server
npm test        # Runs backend tests (if any)
```

## Folder Structure

```
All-in-One-Converter/
├── backend/            # Express server, file-processing logic
├── public/             # Static assets (favicon, index.html)
├── src/                # React source code
│   ├── components/     # Reusable React components
│   ├── pages/          # Page-level components
│   ├── services/       # API service calls (Axios wrappers)
│   └── styles/         # CSS / SCSS modules
├── .gitignore          # Excluded files
├── package.json        # Frontend dependencies & scripts
├── backend/package.json# Backend dependencies & scripts
└── README.md           # This file
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

Maintainer: Prashant Kaushik

* GitHub: [@Prashantkaushik07](https://github.com/Prashantkaushik07)
* Email: [prashantkaushik700@gmail.com](mailto:prashantkaushik700@gmail.com)
