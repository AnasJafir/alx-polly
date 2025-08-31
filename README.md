# ALX Polling App

A modern, interactive polling application built with Next.js 15, TypeScript, and Tailwind CSS. Create polls, vote on them, and engage with the ALX community.

## Features

- **User Authentication**: Sign up, sign in, and manage your account
- **Poll Creation**: Create custom polls with multiple options and descriptions
- **Poll Voting**: Vote on polls and see real-time results
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern Tech Stack**: Built with Next.js 15, TypeScript, and Tailwind CSS

## Project Structure

```
alx-polly/
├── app/                          # Next.js app directory
│   ├── auth/                     # Authentication pages
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── polls/                   # Poll-related pages
│   │   ├── page.tsx            # Browse all polls
│   │   └── create/             # Create new poll
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── auth/                    # Authentication components
│   │   ├── login-form.tsx      # Login form
│   │   └── register-form.tsx   # Registration form
│   ├── layout/                  # Layout components
│   │   └── navigation.tsx      # Main navigation
│   ├── polls/                   # Poll-related components
│   │   ├── poll-card.tsx       # Individual poll display
│   │   └── create-poll-form.tsx # Poll creation form
│   └── ui/                      # Base UI components
│       ├── button.tsx          # Button component
│       ├── card.tsx            # Card components
│       └── input.tsx           # Input component
├── lib/                         # Utility functions
│   └── utils.ts                # Common utilities
├── public/                      # Static assets
├── package.json                 # Dependencies
├── tailwind.config.ts          # Tailwind configuration
└── tsconfig.json               # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd alx-polly
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Routes

- `/` - Home page with app overview
- `/auth/login` - User login page
- `/auth/register` - User registration page
- `/polls` - Browse all available polls
- `/polls/create` - Create a new poll

## Component Architecture

### UI Components
- **Button**: Versatile button component with multiple variants
- **Card**: Card layout components for consistent styling
- **Input**: Form input component with proper styling

### Feature Components
- **LoginForm**: User authentication form
- **RegisterForm**: User registration form
- **PollCard**: Individual poll display with voting functionality
- **CreatePollForm**: Poll creation interface
- **Navigation**: Main app navigation header

## Styling

The app uses Tailwind CSS with a custom design system:
- Consistent color scheme with CSS variables
- Responsive design patterns
- Modern UI components following Shadcn/ui patterns
- Smooth transitions and hover effects

## Development

### Adding New Features
1. Create components in the appropriate directory
2. Add new pages in the `app/` directory
3. Update navigation if needed
4. Test responsiveness across devices

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow the established color scheme
- Maintain consistent spacing and typography
- Ensure mobile-first responsive design

## Future Enhancements

- [ ] User profile management
- [ ] Poll categories and tags
- [ ] Real-time updates with WebSockets
- [ ] Poll sharing and social features
- [ ] Advanced analytics and charts
- [ ] Dark mode support
- [ ] Mobile app (React Native)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the repository.
