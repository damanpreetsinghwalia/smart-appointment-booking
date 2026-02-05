import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Calendar, Search, Heart, Brain, Baby, Bone, Stethoscope, Eye, Ear, Activity, Star, MapPin, Clock, Shield, Video, CreditCard, Facebook, Twitter, Instagram, Linkedin } from 'lucide-angular';

interface Specialty {
  iconName: string;
  name: string;
  description: string;
  color: string;
}

interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  available: boolean;
}

interface Feature {
  iconName: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent {
  // Icon references for template
  readonly Calendar = Calendar;
  readonly Search = Search;
  readonly Heart = Heart;
  readonly Brain = Brain;
  readonly Baby = Baby;
  readonly Bone = Bone;
  readonly Stethoscope = Stethoscope;
  readonly Eye = Eye;
  readonly Ear = Ear;
  readonly Activity = Activity;
  readonly Star = Star;
  readonly MapPin = MapPin;
  readonly Clock = Clock;
  readonly Shield = Shield;
  readonly Video = Video;
  readonly CreditCard = CreditCard;
  readonly Facebook = Facebook;
  readonly Twitter = Twitter;
  readonly Instagram = Instagram;
  readonly Linkedin = Linkedin;

  // Icon map for dynamic icon selection
  iconMap: any = {
    'calendar': Calendar,
    'search': Search,
    'heart': Heart,
    'brain': Brain,
    'baby': Baby,
    'bone': Bone,
    'stethoscope': Stethoscope,
    'eye': Eye,
    'ear': Ear,
    'activity': Activity,
    'star': Star,
    'map-pin': MapPin,
    'clock': Clock,
    'shield': Shield,
    'video': Video,
    'credit-card': CreditCard,
    'facebook': Facebook,
    'twitter': Twitter,
    'instagram': Instagram,
    'linkedin': Linkedin
  };

  specialties: Specialty[] = [
    {
      iconName: 'heart',
      name: 'Cardiology',
      description: 'Heart & vascular care',
      color: 'from-red-500 to-pink-500',
    },
    {
      iconName: 'brain',
      name: 'Neurology',
      description: 'Brain & nerve care',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      iconName: 'baby',
      name: 'Pediatrics',
      description: 'Child healthcare',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      iconName: 'bone',
      name: 'Orthopedics',
      description: 'Bone & joint care',
      color: 'from-orange-500 to-amber-500',
    },
    {
      iconName: 'stethoscope',
      name: 'General Practice',
      description: 'Comprehensive care',
      color: 'from-green-500 to-emerald-500',
    },
    {
      iconName: 'eye',
      name: 'Ophthalmology',
      description: 'Eye care & vision',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      iconName: 'ear',
      name: 'ENT',
      description: 'Ear, nose & throat',
      color: 'from-violet-500 to-purple-500',
    },
    {
      iconName: 'activity',
      name: 'Dermatology',
      description: 'Skin care',
      color: 'from-pink-500 to-rose-500',
    },
  ];

  doctors: Doctor[] = [
    {
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      experience: '15 years',
      rating: 4.9,
      reviews: 234,
      location: 'New York, NY',
      image: 'https://images.unsplash.com/photo-1734002886107-168181bcd6a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkb2N0b3IlMjBzbWlsaW5nJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MDEzMTczOXww&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
    },
    {
      name: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      experience: '12 years',
      rating: 4.8,
      reviews: 189,
      location: 'Los Angeles, CA',
      image: 'https://images.unsplash.com/photo-1642975967602-653d378f3b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwbmV1cm9sb2dpc3QlMjBkb2N0b3J8ZW58MXx8fHwxNzcwMTkxOTIxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
    },
    {
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatologist',
      experience: '10 years',
      rating: 5.0,
      reviews: 312,
      location: 'Miami, FL',
      image: 'https://images.unsplash.com/photo-1706565029539-d09af5896340?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBkZXJtYXRvbG9naXN0JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MDE5MTkyMHww&ixlib=rb-4.1.0&q=80&w=1080',
      available: false,
    },
    {
      name: 'Dr. James Wilson',
      specialty: 'Pediatrician',
      experience: '18 years',
      rating: 4.9,
      reviews: 456,
      location: 'Chicago, IL',
      image: 'https://images.unsplash.com/photo-1709127347876-9636bed47ab2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwcGVkaWF0cmljaWFuJTIwZG9jdG9yJTIwY2hpbGRyZW58ZW58MXx8fHwxNzcwMTkxOTIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
    },
    {
      name: 'Dr. Lisa Thompson',
      specialty: 'Orthopedic Surgeon',
      experience: '14 years',
      rating: 4.7,
      reviews: 167,
      location: 'Boston, MA',
      image: 'https://images.unsplash.com/photo-1676155081561-865fab11da37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBvcnRob3BlZGljJTIwc3VyZ2VvbnxlbnwxfHx8fDE3NzAxOTE5MjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
    },
    {
      name: 'Dr. Robert Martinez',
      specialty: 'Cardiologist',
      experience: '20 years',
      rating: 4.9,
      reviews: 523,
      location: 'Houston, TX',
      image: 'https://images.unsplash.com/photo-1659353885824-1199aeeebfc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwY2FyZGlvbG9naXN0JTIwZG9jdG9yfGVufDF8fHx8MTc3MDEyMjEwNnww&ixlib=rb-4.1.0&q=80&w=1080',
      available: true,
    },
  ];

  features: Feature[] = [
    {
      iconName: 'clock',
      title: '24/7 Availability',
      description: 'Book appointments anytime, anywhere with our round-the-clock service.',
    },
    {
      iconName: 'shield',
      title: 'Verified Doctors',
      description: 'All our doctors are certified and verified healthcare professionals.',
    },
    {
      iconName: 'video',
      title: 'Video Consultation',
      description: 'Consult with doctors remotely through secure video calls.',
    },
    {
      iconName: 'credit-card',
      title: 'Easy Payment',
      description: 'Multiple payment options for your convenience and security.',
    },
  ];

  constructor() { }
}
