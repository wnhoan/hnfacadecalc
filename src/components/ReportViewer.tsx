import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Project, 
  Combination, 
  getProjectResults, 
  calculatePanelResults, 
  calculateSealantResults, 
  calculateBracketResults, 
  calculateCastInEmbedResults 
} from '@/lib/structural-logic';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MATERIALS, CODES_OF_PRACTICE } from '../constants';
import { Printer, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ReportViewer({ project }: { project: Project }) {
  const results = React.useMemo(() => {
    switch (project.calculationMode) {
      case 'beam': return getProjectResults(project);
      case 'panel': return calculatePanelResults(project);
      case 'sealant': return calculateSealantResults(project);
      case 'bracket': return calculateBracketResults(project);
      case 'cast-in-embed': return calculateCastInEmbedResults(project);
      default: return null;
    }
  }, [project]);

  const handlePrint = () => {
    window.print();
  };

  const selectedCode = CODES_OF_PRACTICE.find(c => c.country === project.selectedCodeId);

  const status = React.useMemo(() => {
    if (!results) return 'fail';
    if ('summary' in results) return results.summary.status;
    if ('status' in results) return results.status;
    return 'fail';
  }, [results]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-4 sm:p-8 bg-white print:p-0">
      <div className="flex justify-between items-center print:hidden bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 rounded-lg text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-tight">Report Viewer</h3>
            <p className="text-[10px] text-slate-500 font-medium">Preview structural calculation report</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
             <Printer className="w-4 h-4" /> Print PDF
           </Button>
        </div>
      </div>

      {/* Header */}
      <div className="border-b-4 border-slate-900 pb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Structural Analysis Report</h1>
            <p className="text-lg text-slate-500 font-medium mt-1 uppercase tracking-widest">{project.calculationMode} Member validation</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold uppercase text-slate-400">Date</p>
            <p className="text-sm font-black italic">{project.projectDate}</p>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="grid grid-cols-2 gap-8 py-6">
        <div>
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Project Information</h3>
           <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-tight">{project.projectTitle}</p>
              <p className="text-xs text-slate-600">{project.projectLocation}</p>
              <p className="text-xs text-slate-500 italic mt-2">{project.projectDescription}</p>
           </div>
        </div>
        <div className="text-right">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Design Standards</h3>
           <div className="space-y-1">
              <p className="text-sm font-black uppercase tracking-tight">{selectedCode?.country || 'Building Code'}</p>
              <p className="text-xs text-slate-500">{selectedCode?.codes.join(', ')}</p>
           </div>
        </div>
      </div>

      <Separator className="bg-slate-900 h-0.5" />

      {/* Summary Results Section */}
      <div className="py-6">
        <div className="flex items-center justify-between mb-4">
           <h2 className="text-xl font-black uppercase tracking-tighter">1. Calculation Summary</h2>
           <Badge variant={status === 'pass' ? 'outline' : 'destructive'} className={cn(
             "text-sm font-black uppercase px-4 py-1",
             status === 'pass' && "border-emerald-600 text-emerald-600"
           )}>
             {status === 'pass' ? "PASS" : "FAIL"}
           </Badge>
        </div>
        
        <Table className="border border-slate-200">
           <TableHeader>
              <TableRow className="bg-slate-50">
                 <TableHead className="font-black uppercase text-[10px]">Criteria</TableHead>
                 <TableHead className="font-black uppercase text-[10px]">Limit / Allowable</TableHead>
                 <TableHead className="font-black uppercase text-[10px]">Actual Value</TableHead>
                 <TableHead className="font-black uppercase text-[10px] text-right">Utilization</TableHead>
              </TableRow>
           </TableHeader>
           <TableBody>
              {project.calculationMode === 'beam' && (results as any)?.summary && (
                <>
                  <TableRow>
                     <TableCell className="font-medium">Maximum Stress</TableCell>
                     <TableCell>{(results as any).summary.allowableStress.toFixed(1)} MPa</TableCell>
                     <TableCell>{(results as any).summary.maxStress.toFixed(1)} MPa</TableCell>
                     <TableCell className="text-right font-black italic">{((results as any).summary.utilizationStress * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell className="font-medium">Maximum Deflection</TableCell>
                     <TableCell>L / {project.beamType === 'transom' ? 240 : 175}</TableCell>
                     <TableCell>{(results as any).summary.maxDeflection.toFixed(2)} mm</TableCell>
                     <TableCell className="text-right font-black italic">{((results as any).summary.utilizationDeflection * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                </>
              )}
              {project.calculationMode === 'panel' && (results as any)?.skin && (
                <>
                  <TableRow>
                     <TableCell className="font-medium">Skin Stress</TableCell>
                     <TableCell>{(results as any).skin.allowableStress.toFixed(1)} MPa</TableCell>
                     <TableCell>{(results as any).skin.stress.toFixed(1)} MPa</TableCell>
                     <TableCell className="text-right font-black italic">{((results as any).skin.utilizationStress * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                   <TableRow>
                     <TableCell className="font-medium">Skin Deflection</TableCell>
                     <TableCell>{(results as any).skin.allowableDeflection.toFixed(2)} mm</TableCell>
                     <TableCell>{(results as any).skin.deflection.toFixed(2)} mm</TableCell>
                     <TableCell className="text-right font-black italic">{((results as any).skin.utilizationDeflection * 100).toFixed(1)}%</TableCell>
                  </TableRow>
                </>
              )}
           </TableBody>
        </Table>
      </div>

      {/* Input Data */}
      <div className="py-6">
        <h2 className="text-xl font-black uppercase tracking-tighter mb-4">2. Design Parameters</h2>
        <div className="grid grid-cols-3 gap-6">
           <div className="bg-slate-50 p-4 border rounded-xl">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Geometry</p>
             <p className="text-sm font-bold">Length: <span className="font-black italic">{project.length} mm</span></p>
             <p className="text-sm font-bold">Width: <span className="font-black italic">{project.width} mm</span></p>
             <p className="text-sm font-bold">Height: <span className="font-black italic">{project.height} mm</span></p>
           </div>
           <div className="bg-slate-50 p-4 border rounded-xl">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Material</p>
             <p className="text-sm font-black uppercase tracking-tight">{MATERIALS[project.material]?.name}</p>
             <p className="text-xs text-slate-500 mt-1">E: {MATERIALS[project.material]?.e} MPa</p>
           </div>
           <div className="bg-slate-50 p-4 border rounded-xl">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Support Condition</p>
             <p className="text-sm font-black uppercase tracking-tight">{project.supportCondition.replace('_', ' ')}</p>
           </div>
        </div>
      </div>

      {/* Loading Info */}
      <div className="py-6">
        <h2 className="text-xl font-black uppercase tracking-tighter mb-4">3. Applied Loading</h2>
        <div className="border rounded-xl overflow-hidden">
           <Table>
             <TableHeader>
               <TableRow className="bg-slate-50">
                 <TableHead className="font-black text-[10px]">Type</TableHead>
                 <TableHead className="font-black text-[10px]">Category</TableHead>
                 <TableHead className="font-black text-[10px] text-right">Value</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {project.loads.map(load => (
                 <TableRow key={load.id}>
                    <TableCell className="uppercase text-xs font-bold">{load.type}</TableCell>
                    <TableCell className="uppercase text-xs font-medium text-slate-500">{load.category}</TableCell>
                    <TableCell className="text-right font-mono font-bold">{load.value} {load.type === 'udl' ? 'N/mm' : 'N'}</TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
        </div>
      </div>

      {/* Signature */}
      <div className="mt-20 border-t-2 border-slate-200 pt-8 flex justify-between items-end italic text-slate-400">
         <div>
            <p className="text-xs">Analysis generated by FacadeCalc Structural Engine</p>
            <p className="text-[10px]">System Version 2.4.0-PRO</p>
         </div>
         <div className="w-64 border-t border-slate-300 pt-2 text-center text-xs">
            Structural Engineer / Designer
         </div>
      </div>
    </div>
  );
}
