# Eazost
![Logo Eazost](public/logo.png)

**Eazost** is an application designed to simplify the management of vacation rentals and provide a seamless, secure experience.

## 🚀 Features

- Property Management: Add and modify property information.
- Secure Access Codes: Generate and share codes with tenants.
- Integrated Shop: Order services before vacationers' arrival.
- Instant Messaging: Direct communication between owners and tenants.
- Customization: Add profile pictures and specific information.

## 🛠️ Technologies Used

- **Framework**: Next.js 14
- **Database**: MySQL with Drizzle
- **UI**: Tailwind CSS, ShadCN UI
- **Authentication**: NextAuth.js
- **Validation**: Zod
- **Media**: Cloudinary
- **Testing**: Jest & React Testing Library
- **State Management**: Zustand

## 📦 Installation

### Prerequisites

- Node.js 18 or higher
- MySQL 8 or higher
- Cloudinary Account

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/eazost.git
   cd eazost
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in .env.local:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/eazost"
   CLOUDINARY_CLOUD_NAME="your_cloud_name"
   CLOUDINARY_API_KEY="your_api_key"
   CLOUDINARY_API_SECRET="your_api_secret"
   NEXTAUTH_SECRET="your_secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```
eazost/
├── app/                # Next.js app router
├── components/         # Reusable components
├── lib/               # Utility functions and configurations
├── public/            # Static assets
├── styles/           # Global styles
└── types/            # TypeScript type definitions
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run linting:
```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
