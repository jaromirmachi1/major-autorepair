# AutoPro - Car Repair & Used Cars Website

A modern, Awwwards-style responsive React website for a car repair and used car sales firm. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Design**: Clean, premium aesthetic with smooth animations
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Powered by Framer Motion with elegant transitions
- **Color Scheme**: Black (#000000), White (#FFFFFF), and Red (#ED232D) accent
- **Sections**:
  - Hero section with full-screen background
  - Services showcase with animated cards
  - Used cars inventory grid with hover effects
  - Contact form with company information
  - Sticky navigation bar
  - Professional footer

## 🛠️ Tech Stack

- **React 19** - Latest React with functional components
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Color Palette

- **Black**: `#000000`
- **White**: `#FFFFFF`
- **Primary Red**: `#ED232D`
- **Red Dark**: `#C41E26`
- **Red Light**: `#F04B54`

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx      # Navigation bar with smooth scroll
│   └── Footer.tsx      # Footer with links and info
├── sections/
│   ├── Hero.tsx        # Hero section with CTA
│   ├── Services.tsx    # Services grid with animations
│   ├── Cars.tsx        # Used cars showcase
│   └── Contact.tsx     # Contact form and info
├── App.tsx             # Main app component
├── main.tsx           # Entry point
└── index.css          # Global styles with Tailwind
```

## ✨ Key Features

### Navigation

- Sticky header with smooth scroll to sections
- Responsive menu for mobile devices
- Animated hover effects on links

### Animations

- Fade-in and slide-up effects on scroll
- Hover animations on cards and buttons
- Smooth page transitions
- Scroll indicators and animations

### Sections

#### Hero

- Full-screen background with overlay
- Large animated headline
- Call-to-action buttons
- Scroll indicator

#### Services

- 6 service cards with icons
- Hover effects with red accents
- Staggered animations on scroll reveal
- Schedule service CTA

#### Used Cars

- Grid of premium vehicles
- Hover image zoom effects
- Price tags and features
- "View Details" buttons

#### Contact

- Interactive form with validation
- Contact information cards
- Business hours
- Map placeholder for future integration

#### Footer

- Company information
- Quick links
- Social media icons
- Copyright and legal links

## 🎯 Usage

The website is ready to use out of the box. Simply run `npm run dev` and navigate to `http://localhost:5173` to see it in action.

### Customization

- **Colors**: Update `tailwind.config.js` to modify the color scheme
- **Content**: Edit component files in `src/sections/` to change text and images
- **Images**: Replace placeholder images with your own
- **Animations**: Adjust Framer Motion variants in component files

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is open source and available for use.

## 🤝 Contributing

Feel free to fork, modify, and use this template for your own projects!
