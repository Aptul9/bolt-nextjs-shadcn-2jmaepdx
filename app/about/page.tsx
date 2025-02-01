"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const companyInfo = {
  businessName: "CorePass S.r.l.",
  registeredOffice: "Contrada Castromurro 39, Belvedere Marittimo 87023",
  taxCode: "03943760789",
  vatNumber: "IT03943760789",
  pecEmail: "corepass@pec.it",
  businessRegistry: "Camera di Commercio di Cosenza",
  reaNumber: "CS-123456",
  capital: "€10,000.00",
  management: "Independent Company",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="min-h-screen pt-24 pb-12 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-center mb-8">
                  Legal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Business Name
                    </h3>
                    <p>{companyInfo.businessName}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Registered Office
                    </h3>
                    <p>{companyInfo.registeredOffice}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">Tax Code</h3>
                    <p>{companyInfo.taxCode}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">VAT Number</h3>
                    <p>{companyInfo.vatNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">PEC Email</h3>
                    <p>{companyInfo.pecEmail}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Business Registry
                    </h3>
                    <p>{companyInfo.businessRegistry}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">REA Number</h3>
                    <p>{companyInfo.reaNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Share Capital
                    </h3>
                    <p>{companyInfo.capital}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">Management</h3>
                    <p>{companyInfo.management}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
