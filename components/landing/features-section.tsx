"use client";

import { Building2, Key, Users, Shield, BarChart } from "lucide-react";
import { FeatureCard } from "./feature-card";

const features = [
  {
    title: "Access Control",
    description: "Secure entry management with real-time monitoring and customizable access levels.",
    Icon: Key,
  },
  {
    title: "Member Management",
    description: "Comprehensive member database with profiles, attendance tracking, and payment history.",
    Icon: Users,
  },
  {
    title: "Multi-Location Support",
    description: "Manage multiple facilities from a single dashboard with location-specific settings.",
    Icon: Building2,
  },
  {
    title: "Security & Compliance",
    description: "Advanced security features ensuring your data is protected and compliant with regulations.",
    Icon: Shield,
  },
  {
    title: "Analytics & Reporting",
    description: "Detailed insights into facility usage, member attendance, and business performance.",
    Icon: BarChart,
  },
  {
    title: "24/7 Access",
    description: "Enable secure round-the-clock access with automated entry systems and monitoring.",
    Icon: Key,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need to Manage Your Facility
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive solution provides all the tools you need to run your gym efficiently and securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}