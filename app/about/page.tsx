"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import companyInfo from "@/constants/companyInfo";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="pt-24 pb-12 bg-background">
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
                      Nome Società:
                    </h3>
                    <p>{companyInfo.businessName}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">Sede Legale:</h3>
                    <p>{companyInfo.registeredOffice}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">Partita IVA:</h3>
                    <p>{companyInfo.vatNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">PEC:</h3>
                    <p>{companyInfo.pecEmail}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Registro Delle Imprese:
                    </h3>
                    <p>{companyInfo.businessRegistry}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">REA:</h3>
                    <p>{companyInfo.reaNumber}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Capitale Sociale
                    </h3>
                    <p>{companyInfo.capital}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-primary">
                      Tipo Di Società:
                    </h3>
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
