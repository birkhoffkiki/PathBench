"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Dataset information based on the supplementary table
const datasetInfo = [
  { organ: "Lung", source: "H1", cohort: "Metastatic-Cohort", caseNumber: 846, slidesNumber: 1422 },
  { organ: "Lung", source: "H5", cohort: "Metastatic-Cohort", caseNumber: 493, slidesNumber: 493 },
  { organ: "Lung", source: "H6", cohort: "Metastatic-Cohort", caseNumber: 826, slidesNumber: 1422 },
  { organ: "Stomach", source: "H7", cohort: "Biopsy-Cohort", caseNumber: 1345, slidesNumber: 2700 },
  { organ: "Stomach", source: "H1", cohort: "Gastric-Cohort", caseNumber: 403, slidesNumber: 404 },
  { organ: "Stomach", source: "H4", cohort: "Gastric-Cohort", caseNumber: 320, slidesNumber: 320 },
  { organ: "Stomach", source: "H3", cohort: "Gastric-Cohort", caseNumber: 260, slidesNumber: 260 },
  { organ: "Colorectal", source: "H8", cohort: "Colorectal-Cohort", caseNumber: 622, slidesNumber: 2779 },
  { organ: "Colorectal", source: "H1", cohort: "Colorectal-Cohort", caseNumber: 294, slidesNumber: 301 },
  { organ: "Breast", source: "H9", cohort: "Breast-Cohort", caseNumber: 418, slidesNumber: 421 },
  { organ: "Breast", source: "H2", cohort: "Breast-Cohort", caseNumber: 2045, slidesNumber: 4275 },
  { organ: "Brain", source: "H1", cohort: "Glioma-Cohort", caseNumber: 677, slidesNumber: 1362 },
];

// Color mapping for organs
const organColors: Record<string, string> = {
  "Lung": "#3B82F6", // Blue
  "Stomach": "#10B981", // Green
  "Colorectal": "#F59E0B", // Orange
  "Breast": "#EF4444", // Red
  "Brain": "#8B5CF6", // Purple
};

export function DatasetInfoTable() {
  const [isVisible, setIsVisible] = useState(false);

  // Calculate totals
  const totalCases = datasetInfo.reduce((sum, item) => sum + item.caseNumber, 0);
  const totalSlides = datasetInfo.reduce((sum, item) => sum + item.slidesNumber, 0);
  const totalHospitals = new Set(datasetInfo.map(item => item.source)).size;
  const totalOrgans = new Set(datasetInfo.map(item => item.organ)).size;

  if (!isVisible) {
    return (
      <Card className="w-full shadow-sm border border-gray-200">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">Dataset Information</h3>
              <div className="text-sm text-gray-500 break-words">
                <span className="inline-block">{totalCases.toLocaleString()} cases</span>
                <span className="mx-1">•</span>
                <span className="inline-block">{totalSlides.toLocaleString()} slides</span>
                <span className="mx-1">•</span>
                <span className="inline-block">{totalHospitals} hospitals</span>
                <span className="mx-1 hidden sm:inline">•</span>
                <span className="inline-block hidden sm:inline">{totalOrgans} organs</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(true)}
              className="flex items-center gap-2 shrink-0 self-start sm:self-auto"
            >
              <FaEye className="w-4 h-4" />
              <span className="hidden sm:inline">Show Details</span>
              <span className="sm:hidden">Details</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm border border-gray-200">
      <CardHeader className="pb-3 p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Dataset Information
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 break-words">
              In-house data used for the benchmark across {totalOrgans} organs and {totalHospitals} hospitals
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <FaEyeSlash className="w-4 h-4" />
            <span className="hidden sm:inline">Hide</span>
            <span className="sm:hidden">Hide</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 p-3 sm:p-6">
        {/* Total Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 border border-blue-200">
          <div className="text-center">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Dataset Overview</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-blue-600">{totalCases.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Cases</div>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-green-600">{totalSlides.toLocaleString()}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Slides</div>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-purple-600">{totalHospitals}</div>
                <div className="text-xs sm:text-sm text-gray-600">Hospitals</div>
              </div>
              <div className="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
                <div className="text-lg sm:text-2xl font-bold text-orange-600">{totalOrgans}</div>
                <div className="text-xs sm:text-sm text-gray-600">Organs</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
          {Object.entries(
            datasetInfo.reduce((acc, item) => {
              if (!acc[item.organ]) {
                acc[item.organ] = [];
              }
              acc[item.organ].push(item);
              return acc;
            }, {} as Record<string, typeof datasetInfo>)
          ).map(([organ, items]) => {
            const totalCasesForOrgan = items.reduce((sum, item) => sum + item.caseNumber, 0);
            const totalSlidesForOrgan = items.reduce((sum, item) => sum + item.slidesNumber, 0);
            const hospitalCount = new Set(items.map(item => item.source)).size;

            return (
              <div
                key={organ}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                style={{ borderTopColor: organColors[organ], borderTopWidth: '3px' }}
              >
                <div className="p-2 sm:p-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: organColors[organ] }}
                    />
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{organ}</h4>
                  </div>
                  <div className="mt-1 text-xs text-gray-600 break-words">
                    {hospitalCount} hospital{hospitalCount > 1 ? 's' : ''} • {items.length} cohort{items.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="p-2 sm:p-3 space-y-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start text-xs gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{item.source}</div>
                        <div className="text-gray-500 truncate text-xs">{item.cohort.replace('-Cohort', '')}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-medium text-gray-900 text-xs">{item.caseNumber.toLocaleString()}</div>
                        <div className="text-gray-500 text-xs">{item.slidesNumber.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-gray-900">Total</span>
                      <div className="text-right">
                        <div className="text-gray-900">{totalCasesForOrgan.toLocaleString()}</div>
                        <div className="text-gray-600">{totalSlidesForOrgan.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
