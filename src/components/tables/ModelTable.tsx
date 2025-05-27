"use client";

import { useEvaluation } from "@/context/EvaluationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { FaSort, FaSortUp, FaSortDown, FaSearch } from 'react-icons/fa';
import { Model } from "@/types";

type SortField = keyof Model | 'parameterValue';
type SortDirection = 'asc' | 'desc';

export function ModelTable() {
  const { getFilteredModels } = useEvaluation();
  const allModels = getFilteredModels();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>('released_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Function to generate model link based on citation
  const getModelLink = (citation: string): string => {
    // Map common citations to their respective URLs
    const linkMap: Record<string, string> = {
      'r50': 'https://arxiv.org/abs/1512.03385',
      'ctranspath': 'https://www.sciencedirect.com/science/article/pii/S1361841522002043',
      'virchow': 'https://www.nature.com/articles/s41591-024-03141-0',
      'gigapath': 'https://www.nature.com/articles/s41586-024-07441-w',
      'hibou': 'https://arxiv.org/abs/2406.05074',
      'gpfm': 'https://arxiv.org/abs/2407.18449',
      'hoptimus1': 'https://huggingface.co/bioptimus/H-optimus-1',
      'plip': 'https://www.nature.com/articles/s41591-023-02504-3',
      'conch': 'https://www.nature.com/articles/s41591-024-02856-4',
      'musk': 'https://www.nature.com/articles/s41586-024-08378-w',
      'mstar': 'https://arxiv.org/abs/2407.15362',
      'phikon': 'https://www.medrxiv.org/content/10.1101/2023.07.21.23292757v3',
      'chief': 'https://www.nature.com/articles/s41586-024-07894-z',
      'uni': 'https://www.nature.com/articles/s41591-024-02857-3',
      'virchow2': 'https://arxiv.org/abs/2408.00738'
    };

    return linkMap[citation.toLowerCase()] || `https://scholar.google.com/scholar?q=${encodeURIComponent(citation)}`;
  };

  // Function to handle row click
  const handleRowClick = (model: Model) => {
    const link = getModelLink(model.citation);
    if (typeof window !== 'undefined') {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  // Helper function to parse parameter values for sorting
  const parseParameterValue = (paramStr: string): number => {
    if (paramStr === '-') return 0;
    const match = paramStr.match(/^([\d.]+)([MBK]?)$/);
    if (!match) return 0;

    const value = parseFloat(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'B': return value * 1000;
      case 'M': return value;
      case 'K': return value / 1000;
      default: return value;
    }
  };

  // Helper function to parse date for sorting
  const parseDate = (dateStr: string): Date => {
    if (dateStr === '-') return new Date(0);

    // Handle different date formats
    if (dateStr.includes('-')) {
      // Format like "26-Jul-23" or "14-Jan-25"
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
        return new Date(`${month} ${day}, ${year}`);
      }
    } else {
      // Format like "Jun-16" or "Nov-24"
      const parts = dateStr.split('-');
      if (parts.length === 2) {
        const month = parts[0];
        const year = parts[1].length === 2 ? '20' + parts[1] : parts[1];
        return new Date(`${month} 1, ${year}`);
      }
    }

    return new Date(dateStr);
  };

  // Filter and sort models
  const filteredAndSortedModels = useMemo(() => {
    const filtered = allModels.filter(model =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.architecture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.pretraining_strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.publication.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;

      if (sortField === 'parameterValue') {
        aValue = parseParameterValue(a.parameters);
        bValue = parseParameterValue(b.parameters);
      } else if (sortField === 'released_date') {
        aValue = parseDate(a.released_date);
        bValue = parseDate(b.released_date);
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [allModels, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <FaSort className="w-3 h-3 opacity-50" />;
    return sortDirection === 'asc' ?
      <FaSortUp className="w-3 h-3 text-blue-600" /> :
      <FaSortDown className="w-3 h-3 text-blue-600" />;
  };

  // Helper function to get publication display name and badge color
  const getPublicationInfo = (publication: string) => {
    const lower = publication.toLowerCase();
    let displayName = publication;
    let colorClass = 'bg-gray-100 text-gray-800 border-gray-200';

    switch (lower) {
      case 'nature':
        colorClass = 'bg-red-100 text-red-800 border-red-200';
        break;
      case 'nat. med.':
      case 'nm':
        displayName = 'Nat. Med.';
        colorClass = 'bg-red-100 text-red-800 border-red-200';
        break;
      case 'cvpr':
        colorClass = 'bg-blue-100 text-blue-800 border-blue-200';
        break;
      case 'media':
        colorClass = 'bg-green-100 text-green-800 border-green-200';
        break;
      case 'nat. biomed. eng.':
        displayName = 'Nat. BME';
        colorClass = 'bg-red-100 text-red-800 border-red-200';
        break;
      case 'nbme':
        displayName = 'NBME';
        colorClass = 'bg-purple-100 text-purple-800 border-purple-200';
        break;
      case 'preprint':
        colorClass = 'bg-orange-100 text-orange-800 border-orange-200';
        break;
    }

    return { displayName, colorClass };
  };

  // Helper function to get architecture badge color
  const getArchitectureBadgeColor = (architecture: string) => {
    if (architecture.includes('ViT')) return 'bg-blue-50 text-blue-700 border-blue-200';
    if (architecture.includes('ResNet')) return 'bg-green-50 text-green-700 border-green-200';
    if (architecture.includes('Swin')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <CardTitle className="text-lg sm:text-xl font-semibold">Pathology Foundation Models</CardTitle>
          <div className="flex gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="font-medium">{filteredAndSortedModels.length}</span> Models
            </span>
          </div>
        </div>
        <div className="relative max-w-sm">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile Card Layout */}
        <div className="block xl:hidden">
          <div className="space-y-4 p-4">
            {filteredAndSortedModels.map((model) => (
              <Card
                key={model.name}
                className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow mobile-card"
                onClick={() => handleRowClick(model)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 text-sm">{model.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {model.architecture}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500">Parameters:</span>
                        <div className="font-medium">{model.parameters}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Slides:</span>
                        <div className="font-medium">{model.slides}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Patches:</span>
                        <div className="font-medium">{model.patches}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Released:</span>
                        <div className="font-medium">{model.released_date}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="text-xs text-gray-500 mb-1">Publication:</div>
                      <div className="text-sm font-medium text-blue-600 truncate">
                        {model.publication}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden lg:block overflow-x-auto mobile-table-scroll">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold px-3 py-4 text-base w-[15%]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('name')}
                    className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1 text-base"
                  >
                    Model Name
                    {getSortIcon('name')}
                  </Button>
                </TableHead>
                <TableHead className="font-semibold px-3 py-4 text-base w-[10%]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('architecture')}
                    className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1 text-base"
                  >
                    Architecture
                    {getSortIcon('architecture')}
                  </Button>
                </TableHead>
                <TableHead className="font-semibold px-3 py-4 text-base w-[10%]">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('pretraining_strategy')}
                    className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1 text-base"
                  >
                    Strategy
                    {getSortIcon('pretraining_strategy')}
                  </Button>
                </TableHead>
                <TableHead className="font-semibold px-3 py-4 text-center text-base w-[8%]">
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('parameterValue')}
                      className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1 text-base"
                    >
                      Parameters
                      {getSortIcon('parameterValue')}
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="font-semibold px-3 py-4 text-center text-base w-[7%]">Slides</TableHead>
                <TableHead className="font-semibold px-3 py-4 text-center text-base w-[7%]">Patches</TableHead>
                <TableHead className="font-semibold px-3 py-4 text-base w-[20%]">Data Source</TableHead>
                <TableHead className="font-semibold px-3 py-4 text-base w-[8%]">Stain</TableHead>
                <TableHead className="font-semibold px-3 py-4 text-center text-base w-[8%]">
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('released_date')}
                      className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1 text-base"
                    >
                      Released
                      {getSortIcon('released_date')}
                    </Button>
                  </div>
                </TableHead>
                <TableHead className="font-semibold px-3 py-4 text-center text-base w-[7%]">
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('publication')}
                      className="h-auto p-0 font-semibold hover:bg-transparent flex items-center gap-1 text-base"
                    >
                      Publication
                      {getSortIcon('publication')}
                    </Button>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedModels.map((model, index) => (
                <TableRow
                  key={model.name}
                  onClick={() => handleRowClick(model)}
                  className={`hover:bg-blue-50/50 hover:cursor-pointer transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                  }`}
                  title={`Click to view ${model.name} publication`}
                >
                  <TableCell className="font-semibold text-gray-900 px-3 py-4 w-[15%]">
                    <div className="text-base truncate" title={model.name}>
                      {model.name}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-4 w-[10%]">
                    <Badge
                      variant="outline"
                      className={`${getArchitectureBadgeColor(model.architecture)} font-medium text-sm truncate`}
                    >
                      {model.architecture}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3 py-4 w-[10%]">
                    <div className="flex flex-wrap gap-1">
                      {model.pretraining_strategy.split(', ').map((strategy, idx) => {
                        // Handle line breaks for long strategy names
                        const displayStrategy = strategy === 'Supervised Learning'
                          ? strategy.replace(' ', '\n')
                          : strategy;

                        return (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-indigo-50 text-indigo-700 border-indigo-200 text-sm whitespace-pre-line text-center leading-tight"
                          >
                            {displayStrategy}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-base font-medium px-3 py-4 text-center w-[8%]">
                    <div className="truncate">{model.parameters}</div>
                  </TableCell>
                  <TableCell className="text-base px-3 py-4 text-center w-[7%]">
                    <div className="truncate">{model.slides}</div>
                  </TableCell>
                  <TableCell className="text-base px-3 py-4 text-center w-[7%]">
                    <div className="truncate">{model.patches}</div>
                  </TableCell>
                  <TableCell className="px-3 py-4 w-[20%]">
                    <div className="text-base leading-tight truncate" title={model.pretraining_data_source}>
                      {model.pretraining_data_source}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-4 w-[8%]">
                    <div className="flex flex-wrap gap-1">
                      {model.stain.split(', ').map((stain, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 text-sm truncate"
                        >
                          {stain}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-base px-3 py-4 text-center w-[8%]">
                    <div className="truncate">{model.released_date}</div>
                  </TableCell>
                  <TableCell className="px-3 py-4 text-center w-[7%]">
                    {model.publication !== '-' ? (() => {
                      const { displayName, colorClass } = getPublicationInfo(model.publication);
                      return (
                        <Badge
                          variant="outline"
                          className={`${colorClass} font-medium text-sm truncate`}
                        >
                          {displayName}
                        </Badge>
                      );
                    })() : (
                      <span className="text-gray-400 text-base">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
