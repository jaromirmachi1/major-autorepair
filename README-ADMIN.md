# Admin Panel Setup Guide

## Overview

This admin panel allows you to manage your car inventory with Supabase authentication. Only authorized administrators can access the panel.

## Features

- 🔐 Email/password authentication
- 📊 Dashboard with statistics
- 🚗 Complete car management (CRUD operations)
- 📸 Image upload and management
- 🔍 Search and filter functionality
- 📱 Responsive design

## Setup Instructions

### 1. Supabase Configuration

1. Go to [Supabase Console](https://supabase.com)
2. Create a new project or use existing one
3. Enable Authentication and Database
4. Copy your project URL and anon key

### 2. Update Supabase Config

Create `.env.local` file in your project root with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Database Setup

Run this SQL in the Supabase SQL Editor:

```sql
-- Create cars table
CREATE TABLE cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER NOT NULL,
  price_formatted TEXT,
  mileage INTEGER NOT NULL,
  fuel TEXT NOT NULL,
  transmission TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  image_urls TEXT[],
  featured BOOLEAN DEFAULT false,
  pinned BOOLEAN DEFAULT false,
  features TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all cars" ON cars
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert cars" ON cars
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own cars" ON cars
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own cars" ON cars
  FOR DELETE USING (auth.uid() = created_by);

-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Create storage policies
CREATE POLICY "Anyone can view car images" ON storage.objects
  FOR SELECT USING (bucket_id = 'car-images');

CREATE POLICY "Authenticated users can upload car images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'car-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own car images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'car-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own car images" ON storage.objects
  FOR DELETE USING (bucket_id = 'car-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Create Admin User

1. Go to Authentication → Users in Supabase
2. Click "Add user"
3. Create an admin user with email/password
4. Note the user ID for admin privileges

## Usage

### Accessing the Admin Panel

1. Navigate to `/admin` in your browser
2. Use your admin email and password to sign in
3. Access the dashboard and car management

### Managing Cars

- **Dashboard**: View statistics and recent cars
- **Add Car**: Upload images, set details, and add features
- **Edit Car**: Update existing car information
- **Delete Car**: Remove cars from inventory

### Car Information

Each car includes:

- Basic info (make, model, year, color)
- Pricing and mileage
- Technical details (fuel type, transmission)
- Description and features
- Multiple images
- Availability status

## File Structure

```
src/admin/
├── AdminApp.tsx                    # Main admin app component
├── contexts/
│   └── SupabaseAuthContext.tsx     # Supabase authentication context
├── pages/
│   ├── AdminLogin.tsx              # Login page
│   ├── AdminDashboard.tsx          # Admin dashboard
│   └── ManageCars.tsx              # Car management
└── config/
    └── supabase.ts                 # Supabase configuration
```

## Security Features

- **Row Level Security**: Database policies protect data access
- **Route protection**: All admin routes are protected
- **Supabase security**: Database and storage are secured
- **Authentication state management**: Proper login/logout handling

## Customization

### Adding New Admin Features

1. Create new components in `src/admin/components/`
2. Add new pages in `src/admin/pages/`
3. Update routing in `AdminApp.tsx`
4. Add navigation items in the layout

### Styling

The admin panel uses Tailwind CSS classes. You can customize:

- Colors: Update the red-primary color scheme
- Layout: Modify the header and main content areas
- Components: Customize individual form elements and cards

## Troubleshooting

### Common Issues

1. **Authentication not working**

   - Check Supabase config is correct
   - Verify user exists in Supabase Auth
   - Check browser console for errors

2. **Images not uploading**

   - Check Supabase Storage policies
   - Verify storage bucket is configured
   - Check browser console for errors

3. **Cars not saving**
   - Check database policies
   - Verify table structure matches
   - Check browser console for errors

### Support

For issues or questions, check the browser console for error messages and ensure all Supabase services are properly configured.

## Development Mode

If Supabase is not configured, the app will run in development mode using localStorage. This is useful for development and testing without setting up Supabase.
